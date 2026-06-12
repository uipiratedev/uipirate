import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { verifyAuth } from "@/lib/pirateCOS/auth";
import { checkRole } from "@/lib/pirateCOS/require-role";
import Team from "@/models/pirateCOS/Team";
import Workspace from "@/models/pirateCOS/Workspace";
import mongoose from "mongoose";

/**
 * Find the canonical workspace for a user, backfilling tenantId on legacy docs
 * that were created before the tenantId field was added.  Returns an up-to-date
 * workspace document (never null after the function resolves without throwing).
 */
async function resolveWorkspace(userEmail: string, tenantId: string) {
  // Fast path: workspace already has tenantId set correctly
  let workspace = await Workspace.findOne({ tenantId: new mongoose.Types.ObjectId(tenantId) });

  if (!workspace) {
    // Legacy path: find by owner email (documents created before tenantId existed)
    workspace = await Workspace.findOne({
      owner: userEmail,
      tenantId: { $exists: false },
    }).sort({ createdAt: 1 }); // oldest first — the canonical one
  }

  if (workspace && !workspace.tenantId) {
    // Backfill tenantId so future lookups hit the fast path; bypass Mongoose
    // validation via collection.updateOne to avoid "required" rejection on
    // documents that are otherwise valid.
    await Workspace.collection.updateOne(
      { _id: workspace._id },
      { $set: { tenantId: new mongoose.Types.ObjectId(tenantId) } }
    );
    (workspace as any).tenantId = new mongoose.Types.ObjectId(tenantId);
  }

  if (!workspace) {
    workspace = await Workspace.create({
      owner: userEmail,
      name: "UI Pirate",
      tenantId: new mongoose.Types.ObjectId(tenantId),
      description: "Central workspace for UI Pirate organization",
    });
    console.log(`✅ Auto-created workspace for tenant ${tenantId}`);
  }

  return workspace;
}

// GET /api/pirateCOS/teams - List all teams for the user's workspace
export async function GET(_req: NextRequest) {
  try {
    const user = await verifyAuth();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const workspace = await resolveWorkspace(user.email, user.tenantId);

    // Cover both tenantId-stamped docs and legacy docs tied to this workspace
    const teamsQuery = {
      $or: [
        { tenantId: new mongoose.Types.ObjectId(user.tenantId) },
        { workspace: workspace._id },
      ],
    };

    const teams = await Team.find(teamsQuery)
      .sort({ createdAt: -1 })
      .lean();

    // Enrich members data with email field for UI compatibility
    const enrichedTeams = teams.map((team: any) => ({
      ...team,
      members: team.members.map((member: any) => ({
        ...member,
        email: member.userId, // userId contains the email
      })),
    }));

    return NextResponse.json({
      success: true,
      data: { teams: enrichedTeams },
    });
  } catch (error: any) {
    console.error("Error fetching teams:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch teams" },
      { status: 500 }
    );
  }
}

// POST /api/pirateCOS/teams - Create a new team
export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuth();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const denied = checkRole(user, ["org-admin", "admin"]);
    if (denied) return denied;

    await dbConnect();

    const workspace = await resolveWorkspace(user.email, user.tenantId);

    const body = await req.json();
    const { name, description, brandVoiceOverride, keywordsOverride } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Team name is required" },
        { status: 400 }
      );
    }

    // Create new team
    const team = await Team.create({
      tenantId: workspace.tenantId, // Direct tenant boundary for fast isolation
      name: name.trim(),
      description: description?.trim() || undefined,
      workspace: workspace._id,
      brandVoiceOverride: brandVoiceOverride || undefined,
      keywordsOverride: keywordsOverride || undefined,
      members: [
        {
          userId: user.email,
          role: "admin",
        },
      ],
    });

    return NextResponse.json({
      success: true,
      data: { team },
    });
  } catch (error: any) {
    console.error("Error creating team:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create team" },
      { status: 500 }
    );
  }
}
