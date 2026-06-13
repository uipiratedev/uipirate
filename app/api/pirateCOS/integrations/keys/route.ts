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

  const keys = await ApiKey.find({ tenantId: tenantOid })
    .sort({ createdAt: -1 })
    .lean();

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

  const { name, expiresInDays } = await req.json();

  if (!name?.trim()) {
    return NextResponse.json(
      { success: false, error: "Name is required for the API Key." },
      { status: 400 },
    );
  }

  await dbConnect();
  const tenantOid = new mongoose.Types.ObjectId(user.tenantId);

  // Token format `uip_<keyId>_<secret>`: keyId is a non-secret, indexed lookup
  // id; secret is the high-entropy part. verifyApiKey finds the row by keyId in
  // one indexed query, then timing-safe compares the full token's hash.
  const keyId = randomBytes(6).toString("hex"); // 12 chars
  const secret = randomBytes(20).toString("hex");
  const rawKey = `uip_${keyId}_${secret}`;

  // Prefix shown in UI: "uip_<keyId>..."
  const keyPrefix = `uip_${keyId}...`;

  // Compute SHA-256 hash of the full raw key, then AES-256-GCM encrypt it.
  const sha256Hash = createHash("sha256").update(rawKey).digest("hex");
  const keyHashEncrypted = encrypt(sha256Hash);

  // Optional expiry. All keys are read-only; there is no write scope.
  let expiresAt: Date | null = null;
  const days = Number(expiresInDays);

  if (Number.isFinite(days) && days > 0) {
    expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  }

  const newKey = new ApiKey({
    tenantId: tenantOid,
    name: name.trim(),
    keyId,
    keyHashEncrypted,
    keyPrefix,
    scopes: ["read"],
    expiresAt,
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
      expiresAt: newKey.expiresAt,
      createdAt: newKey.createdAt,
    },
  });
}
