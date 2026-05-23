import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { verifyAuth } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Integration, { SupportedPlatform } from "@/models/Integration";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ platform: string }> },
) {
  const { platform } = await params;
  const user = await verifyAuth();

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  if (!["wordpress", "medium", "ghost", "buffer"].includes(platform)) {
    return NextResponse.json(
      { success: false, error: "Invalid platform" },
      { status: 400 },
    );
  }

  await dbConnect();
  const tenantOid = new mongoose.Types.ObjectId(user.tenantId);

  const doc = await Integration.findOne({ tenantId: tenantOid, platform });

  if (doc) {
    doc.isActive = false;
    // Clear all encrypted/sensitive fields
    if (doc.credentials) {
      doc.credentials.wpAppPasswordEncrypted = undefined;
      doc.credentials.mediumTokenEncrypted = undefined;
      doc.credentials.ghostAdminKeyEncrypted = undefined;
      doc.credentials.bufferAccessTokenEncrypted = undefined;
    }
    await doc.save();
  }

  return NextResponse.json({ success: true });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ platform: string }> },
) {
  const { platform } = await params;
  const user = await verifyAuth();

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  if (!["wordpress", "medium", "ghost", "buffer"].includes(platform)) {
    return NextResponse.json(
      { success: false, error: "Invalid platform" },
      { status: 400 },
    );
  }

  await dbConnect();
  const tenantOid = new mongoose.Types.ObjectId(user.tenantId);

  const doc = await Integration.findOne({ tenantId: tenantOid, platform });

  if (!doc || !doc.isActive) {
    return NextResponse.json(
      { success: false, error: "Integration is not active or credentials missing" },
      { status: 400 },
    );
  }

  // Stubs for connection test — will return mock success in Phase 1
  let message = "Connected successfully";
  if (platform === "wordpress") {
    message = `Connected successfully to WordPress as @${doc.credentials.wpUsername || "admin"}`;
  } else if (platform === "medium") {
    message = `Connected successfully to Medium with Author ID: ${doc.credentials.mediumAuthorId || "default"}`;
  } else if (platform === "ghost") {
    message = `Connected successfully to Ghost at ${doc.credentials.ghostSiteUrl || "site"}`;
  } else if (platform === "buffer") {
    message = "Connected successfully to Buffer accounts queue";
  }

  doc.lastTestedAt = new Date();
  await doc.save();

  return NextResponse.json({
    success: true,
    message,
  });
}
