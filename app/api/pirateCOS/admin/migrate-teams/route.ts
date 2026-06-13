import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { verifyAuth } from "@/lib/pirateCOS/auth";
import Team from "@/models/pirateCOS/Team";
import Workspace from "@/models/pirateCOS/Workspace";

/**
 * POST /api/pirateCOS/admin/migrate-teams
 *
 * One-time migration: backfills `tenantId` on every Team document that is
 * missing it by reading the owning Workspace's tenantId.
 *
 * Protected by:
 *   1. Valid session (org-admin or individual account)
 *   2. `x-migration-secret` header matching MIGRATION_SECRET env var
 *
 * Safe to run multiple times — already-migrated teams are skipped.
 */
export async function POST(req: NextRequest) {
  // Auth check
  const user = await verifyAuth();
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  if (user.accountType !== "individual" && user.orgRole !== "org-admin") {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  // Extra secret check so this can't be triggered accidentally in prod
  const secret = process.env.MIGRATION_SECRET;
  if (secret) {
    const provided = req.headers.get("x-migration-secret");
    if (provided !== secret) {
      return NextResponse.json({ success: false, error: "Invalid migration secret" }, { status: 403 });
    }
  }

  await dbConnect();

  // Find all teams that have no tenantId yet
  const orphanTeams = await Team.find({ tenantId: { $exists: false } }).lean();

  if (orphanTeams.length === 0) {
    return NextResponse.json({ success: true, migrated: 0, message: "All teams already have tenantId." });
  }

  // Group by workspace to minimise DB round-trips
  const workspaceIds = [...new Set(orphanTeams.map((t: any) => String(t.workspace)))];
  const workspaces = await Workspace.find({ _id: { $in: workspaceIds } })
    .select("_id tenantId")
    .lean();

  const workspaceMap = new Map(workspaces.map((w: any) => [String(w._id), w.tenantId]));

  let migrated = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const team of orphanTeams) {
    const tenantId = workspaceMap.get(String((team as any).workspace));
    if (!tenantId) {
      skipped++;
      errors.push(`Team ${team._id}: workspace ${(team as any).workspace} not found`);
      continue;
    }

    try {
      await Team.updateOne({ _id: team._id }, { $set: { tenantId } });
      migrated++;
    } catch (err: any) {
      errors.push(`Team ${team._id}: ${err.message}`);
    }
  }

  return NextResponse.json({
    success: true,
    migrated,
    skipped,
    total: orphanTeams.length,
    errors: errors.length > 0 ? errors : undefined,
  });
}
