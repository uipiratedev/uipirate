import { createHash, randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { verifyAuth } from "@/lib/pirateCOS/auth";
import { encrypt } from "@/lib/pirateCOS/encrypt";
import dbConnect from "@/lib/mongodb";
import ApiKey from "@/models/pirateCOS/ApiKey";

export async function GET() {
  const user = await verifyAuth();

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  await dbConnect();
  const tenantOid = new mongoose.Types.ObjectId(user.tenantId);

  const keys = await ApiKey.find({ tenantId: tenantOid }).sort({ createdAt: -1 }).lean();

  // Strip sensitive hashes before returning metadata
  const results = (keys as any[]).map((k) => ({
    id: String(k._id),
    name: k.name,
    keyPrefix: k.keyPrefix,
    scopes: k.scopes,
    lastUsedAt: k.lastUsedAt || null,
    expiresAt: k.expiresAt || null,
    isActive: k.isActive,
    createdAt: k.createdAt,
  }));

  return NextResponse.json({
    success: true,
    keys: results,
  });
}

export async function POST(req: NextRequest) {
  const user = await verifyAuth();

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const { name, scopes } = await req.json();

  if (!name?.trim()) {
    return NextResponse.json(
      { success: false, error: "Name is required for the API Key." },
      { status: 400 },
    );
  }

  await dbConnect();
  const tenantOid = new mongoose.Types.ObjectId(user.tenantId);

  // Generate cryptographically secure token
  const randomToken = randomBytes(20).toString("hex");
  const rawKey = `uip_live_${randomToken}`;

  // Prefix shown in UI: "uip_live_abcdef12" (prefix of token + label)
  const keyPrefix = `uip_live_${randomToken.substring(0, 8)}...`;

  // Compute SHA-256 hash of the full raw key
  const sha256Hash = createHash("sha256").update(rawKey).digest("hex");

  // AES-256-GCM encrypt this hash
  const keyHashEncrypted = encrypt(sha256Hash);

  const newKey = new ApiKey({
    tenantId: tenantOid,
    name: name.trim(),
    keyHashEncrypted,
    keyPrefix,
    scopes: Array.isArray(scopes) ? scopes : ["read"],
    isActive: true,
  });

  await newKey.save();

  // Return rawKey ONLY ONCE at creation!
  return NextResponse.json({
    success: true,
    key: rawKey,
    meta: {
      id: String(newKey._id),
      name: newKey.name,
      keyPrefix: newKey.keyPrefix,
      scopes: newKey.scopes,
      createdAt: newKey.createdAt,
    },
  });
}
