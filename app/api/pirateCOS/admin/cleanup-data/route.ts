import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";
import { verifyAuth } from "@/lib/pirateCOS/auth";

/**
 * POST /api/pirateCOS/admin/cleanup-data
 *
 * All-in-one migration for UI Pirate tenant cleanup. Idempotent — safe to run
 * multiple times.
 *
 * Steps:
 *   1. Rename "admins" collection → "users" (skipped if already done)
 *   2. Load all users, workspaces, teams via raw MongoDB (bypasses Mongoose
 *      schema validation on legacy documents that lack required fields)
 *   3. Deduplicate workspaces per owner — keep oldest, delete rest
 *   4. Reassign teams whose workspace was deleted/never-existed:
 *        – All members @uipirate.com  → reassign to canonical workspace (keep)
 *        – Any member with foreign email → delete as test/seed data
 *   5. Backfill tenantId on every surviving workspace and team
 *   6. Remove remaining duplicate teams (same name + same workspace)
 */
export async function POST(req: NextRequest) {
  const user = await verifyAuth();
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  if (user.accountType !== "individual" && user.orgRole !== "org-admin") {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  const secret = process.env.MIGRATION_SECRET;
  if (secret) {
    const provided = req.headers.get("x-migration-secret");
    if (provided !== secret) {
      return NextResponse.json({ success: false, error: "Invalid migration secret" }, { status: 403 });
    }
  }

  await dbConnect();
  const db = mongoose.connection.db!;

  const log: string[] = [];
  const errors: string[] = [];

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 1 — Rename admins → users
  // ─────────────────────────────────────────────────────────────────────────
  const collections = (await db.listCollections().toArray()).map((c) => c.name);
  if (collections.includes("admins") && !collections.includes("users")) {
    try {
      await db.collection("admins").rename("users");
      log.push("✅ Renamed collection: admins → users");
    } catch (err: any) {
      errors.push(`rename admins→users: ${err.message}`);
    }
  } else if (collections.includes("users")) {
    log.push("ℹ️  Collection already named 'users' — skipping rename");
    // If both admins and users exist, try to drop the empty admins collection
    if (collections.includes("admins")) {
      const adminCount = await db.collection("admins").countDocuments();
      if (adminCount === 0) {
        await db.collection("admins").drop();
        log.push("🗑  Dropped empty leftover 'admins' collection");
      } else {
        errors.push(`Both 'admins' (${adminCount} docs) and 'users' collections exist — manual merge required`);
      }
    }
  } else {
    errors.push("Neither 'admins' nor 'users' collection found — check your DB connection");
  }

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 2 — Load all documents via raw driver (no Mongoose schema validation)
  // ─────────────────────────────────────────────────────────────────────────
  const allUsers      = await db.collection("users").find({}).toArray();
  const allWorkspaces = await db.collection("workspaces").find({}).sort({ createdAt: 1 }).toArray();
  const allTeams      = await db.collection("teams").find({}).sort({ createdAt: 1 }).toArray();

  log.push(`📊 Loaded: ${allUsers.length} users, ${allWorkspaces.length} workspaces, ${allTeams.length} teams`);

  // Build lookup maps
  const userByEmail  = new Map(allUsers.map((u) => [u.email as string, u]));
  const workspaceIds = new Set(allWorkspaces.map((w) => String(w._id)));

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 3 — Deduplicate workspaces per owner (keep oldest)
  // ─────────────────────────────────────────────────────────────────────────
  const byOwner = new Map<string, typeof allWorkspaces>();
  for (const ws of allWorkspaces) {
    const owner = ws.owner as string;
    if (!byOwner.has(owner)) byOwner.set(owner, []);
    byOwner.get(owner)!.push(ws);
  }

  // canonicalWs: owner email → the workspace document to keep
  const canonicalWs = new Map<string, (typeof allWorkspaces)[0]>();

  for (const [owner, wsList] of byOwner) {
    const adminUser = userByEmail.get(owner);
    const tenantId  = adminUser ? adminUser._id : null;

    // Keep the oldest (already sorted by createdAt asc)
    const [keep, ...dupes] = wsList;
    canonicalWs.set(owner, keep);

    // Backfill tenantId on the canonical workspace
    if (tenantId && !keep.tenantId) {
      await db.collection("workspaces").updateOne(
        { _id: keep._id },
        { $set: { tenantId } }
      );
      log.push(`✅ Workspace ${keep._id} tenantId set → ${tenantId}`);
    }

    // Reassign teams then delete duplicates
    for (const dup of dupes) {
      const teamsOnDup = allTeams.filter((t) => String(t.workspace) === String(dup._id));
      if (teamsOnDup.length > 0) {
        await db.collection("teams").updateMany(
          { workspace: dup._id },
          { $set: { workspace: keep._id, ...(tenantId ? { tenantId } : {}) } }
        );
        log.push(`↩️  Reassigned ${teamsOnDup.length} team(s) from duplicate workspace ${dup._id} → ${keep._id}`);
      }

      await db.collection("workspaces").deleteOne({ _id: dup._id });
      log.push(`🗑  Deleted duplicate workspace ${dup._id} (owner: ${owner})`);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 4 — Handle teams whose workspace doesn't exist in the DB
  // ─────────────────────────────────────────────────────────────────────────

  // Re-read teams after step 3 reassignments
  const teamsAfterStep3 = await db.collection("teams").find({}).sort({ createdAt: 1 }).toArray();
  // Rebuild workspace IDs after deletions
  const validWorkspaceIds = new Set(
    (await db.collection("workspaces").find({}, { projection: { _id: 1 } }).toArray()).map((w) =>
      String(w._id)
    )
  );

  for (const team of teamsAfterStep3) {
    const wsId = String(team.workspace);
    if (validWorkspaceIds.has(wsId)) continue; // workspace exists — fine

    // Workspace is gone or was never saved properly
    const members: Array<{ userId: string }> = team.members ?? [];
    const memberEmails = members.map((m) => String(m.userId ?? ""));
    const hasExternalEmail = memberEmails.some(
      (e) => e && !e.endsWith("@uipirate.com")
    );

    if (hasExternalEmail) {
      // Test / seed data — delete
      await db.collection("teams").deleteOne({ _id: team._id });
      log.push(`🗑  Deleted test-data team "${team.name}" (${team._id}) — had external member emails`);
    } else {
      // Real team — reassign to this user's canonical workspace
      // Find the canonical workspace from the team's first admin member
      const adminMember = members.find((m) => (m as any).role === "admin");
      const ownerEmail  = adminMember?.userId as string | undefined;
      const canonical   = ownerEmail ? canonicalWs.get(ownerEmail) : undefined;

      if (canonical) {
        const adminUser = userByEmail.get(canonical.owner as string);
        const tenantId  = adminUser?._id ?? null;
        await db.collection("teams").updateOne(
          { _id: team._id },
          { $set: { workspace: canonical._id, ...(tenantId ? { tenantId } : {}) } }
        );
        log.push(`↩️  Reassigned team "${team.name}" (${team._id}) → workspace ${canonical._id}`);
      } else {
        // Can't determine workspace — try any canonical workspace as last resort
        const firstCanonical = [...canonicalWs.values()][0];
        if (firstCanonical) {
          const adminUser = userByEmail.get(firstCanonical.owner as string);
          const tenantId  = adminUser?._id ?? null;
          await db.collection("teams").updateOne(
            { _id: team._id },
            { $set: { workspace: firstCanonical._id, ...(tenantId ? { tenantId } : {}) } }
          );
          log.push(`↩️  Reassigned team "${team.name}" (${team._id}) → first available workspace ${firstCanonical._id}`);
        } else {
          errors.push(`Team ${team._id} "${team.name}" has no valid workspace and no canonical workspace found`);
        }
      }
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 5 — Backfill tenantId on all remaining teams that still lack it
  // ─────────────────────────────────────────────────────────────────────────
  const finalTeams      = await db.collection("teams").find({}).toArray();
  const finalWorkspaces = await db.collection("workspaces").find({}).toArray();
  const wsById = new Map(finalWorkspaces.map((w) => [String(w._id), w]));

  for (const team of finalTeams) {
    if (team.tenantId) continue;
    const ws = wsById.get(String(team.workspace));
    if (!ws?.tenantId) continue;
    await db.collection("teams").updateOne(
      { _id: team._id },
      { $set: { tenantId: ws.tenantId } }
    );
    log.push(`✅ Team "${team.name}" (${team._id}) tenantId backfilled`);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 6 — Remove remaining duplicate teams (same name + same workspace)
  // ─────────────────────────────────────────────────────────────────────────
  const dedupeTeams = await db.collection("teams").find({}).sort({ createdAt: 1 }).toArray();
  const seenKeys    = new Set<string>();

  for (const team of dedupeTeams) {
    const key = `${String(team.workspace)}::${String(team.name ?? "").toLowerCase().trim()}`;
    if (seenKeys.has(key)) {
      await db.collection("teams").deleteOne({ _id: team._id });
      log.push(`🗑  Deleted duplicate team "${team.name}" (${team._id})`);
    } else {
      seenKeys.add(key);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Final state
  // ─────────────────────────────────────────────────────────────────────────
  const finalState = {
    workspaces: (await db.collection("workspaces").find({}).toArray()).map((w) => ({
      _id: String(w._id),
      owner: w.owner,
      name: w.name,
      tenantId: w.tenantId ? String(w.tenantId) : null,
    })),
    teams: (await db.collection("teams").find({}).toArray()).map((t) => ({
      _id: String(t._id),
      name: t.name,
      workspace: String(t.workspace),
      tenantId: t.tenantId ? String(t.tenantId) : null,
      memberCount: (t.members ?? []).length,
    })),
  };

  return NextResponse.json({
    success: errors.length === 0,
    log,
    errors: errors.length > 0 ? errors : undefined,
    finalState,
  });
}
