import { createHash, randomBytes } from "crypto";

import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { verifyAuth } from "@/lib/pirateCOS/auth";
import { encrypt } from "@/lib/pirateCOS/encrypt";
import dbConnect from "@/lib/mongodb";
import ApiKey from "@/models/pirateCOS/ApiKey";

/**
 * Rotate an API key: issue fresh key material (new keyId + secret) while keeping
 * the same name and id. The previous secret is invalidated immediately — update
 * any consumers with the new key shown once below.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const user = await verifyAuth();

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, error: "Invalid API key ID" },
      { status: 400 },
    );
  }

  await dbConnect();
  const tenantOid = new mongoose.Types.ObjectId(user.tenantId);

  const key = await ApiKey.findOne({
    _id: new mongoose.Types.ObjectId(id),
    tenantId: tenantOid,
  });

  if (!key) {
    return NextResponse.json(
      { success: false, error: "API Key not found or access denied" },
      { status: 404 },
    );
  }

  const keyId = randomBytes(6).toString("hex");
  const secret = randomBytes(20).toString("hex");
  const rawKey = `uip_${keyId}_${secret}`;

  key.keyId = keyId;
  key.keyPrefix = `uip_${keyId}...`;
  key.keyHashEncrypted = encrypt(
    createHash("sha256").update(rawKey).digest("hex"),
  );
  key.isActive = true;

  await key.save();

  return NextResponse.json({
    success: true,
    key: rawKey,
    meta: {
      id: String(key._id),
      name: key.name,
      keyPrefix: key.keyPrefix,
      scopes: key.scopes,
      expiresAt: key.expiresAt,
      createdAt: key.createdAt,
    },
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const user = await verifyAuth();

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, error: "Invalid API key ID" },
      { status: 400 },
    );
  }

  await dbConnect();
  const tenantOid = new mongoose.Types.ObjectId(user.tenantId);

  // Hard delete or set isActive to false. Hard deleting is clean since it's fully revoked
  const result = await ApiKey.deleteOne({
    _id: new mongoose.Types.ObjectId(id),
    tenantId: tenantOid,
  });

  if (result.deletedCount === 0) {
    return NextResponse.json(
      { success: false, error: "API Key not found or access denied" },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true });
}
