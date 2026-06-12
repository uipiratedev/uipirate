import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { verifyAuth } from "@/lib/pirateCOS/auth";

/**
 * POST /api/pirateCOS/admin/rename-collection
 *
 * Renames the MongoDB `admins` collection → `users`.
 * The Mongoose Admin model already targets "users" — this endpoint
 * makes the actual MongoDB collection name match.
 *
 * Safe to call multiple times:
 *   - If `admins` doesn't exist (already renamed), returns success.
 *   - If `users` already exists and `admins` doesn't, returns success.
 *   - If both exist, merges by renaming `admins` with dropTarget: false
 *     (fails if target has docs — prevents accidental overwrites).
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

  const { connection } = await import("mongoose");
  const db = connection.db;
  if (!db) {
    return NextResponse.json({ success: false, error: "Database not connected" }, { status: 500 });
  }

  // List existing collections
  const collections = await db.listCollections().toArray();
  const collectionNames = new Set(collections.map((c) => c.name));

  const FROM = "admins";
  const TO = "users";

  if (!collectionNames.has(FROM)) {
    // Already renamed or never existed — check the target exists
    if (collectionNames.has(TO)) {
      return NextResponse.json({
        success: true,
        message: `Collection "${FROM}" not found. "${TO}" already exists — rename already complete.`,
        alreadyDone: true,
      });
    }
    return NextResponse.json({
      success: false,
      error: `Neither "${FROM}" nor "${TO}" collection found. Check your database.`,
    }, { status: 404 });
  }

  // Count docs in source before renaming
  const sourceCount = await db.collection(FROM).countDocuments();

  try {
    // MongoDB rename — dropTarget:false prevents accidental overwrite if "users" already has data
    await db.collection(FROM).rename(TO, { dropTarget: false });

    return NextResponse.json({
      success: true,
      message: `Renamed "${FROM}" → "${TO}" (${sourceCount} documents moved).`,
      documentsRenamed: sourceCount,
    });
  } catch (err: any) {
    // If target already exists with data, MongoDB throws "target namespace exists"
    if (err.message?.includes("target namespace exists")) {
      const targetCount = await db.collection(TO).countDocuments();
      return NextResponse.json({
        success: false,
        error: `"${TO}" already exists with ${targetCount} documents. Cannot overwrite. ` +
          `If "${FROM}" is empty (${sourceCount} docs) you can safely drop it manually.`,
        sourceCount,
        targetCount,
      }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
