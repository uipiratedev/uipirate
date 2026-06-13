import { createHash, timingSafeEqual } from "crypto";

import { NextRequest } from "next/server";

import dbConnect from "../mongodb";

import { decrypt } from "./encrypt";

import ApiKey from "@/models/pirateCOS/ApiKey";

export interface ApiKeyAuthResult {
  /** The ApiKey._id as a string — the unit of trust for rate limiting. */
  apiKeyId: string;
  /** The key's display name (echoed by /v1/me). */
  name: string;
  tenantId: string;
  scopes: "read"[];
}

/**
 * Timing-safe compare of the incoming token's SHA-256 against a stored
 * (encrypted) hash. Swallows decryption errors so one bad row can't break auth.
 */
function hashMatches(rawKey: string, keyHashEncrypted?: string): boolean {
  if (!keyHashEncrypted) return false;
  try {
    const requestHash = Buffer.from(
      createHash("sha256").update(rawKey).digest("hex"),
      "hex",
    );
    const dbHash = Buffer.from(decrypt(keyHashEncrypted), "hex");

    return (
      requestHash.length === dbHash.length &&
      timingSafeEqual(requestHash as any, dbHash as any)
    );
  } catch (err) {
    console.error("API Key decryption verification error", err);

    return false;
  }
}

function isExpired(expiresAt?: Date | null): boolean {
  return !!expiresAt && new Date() > new Date(expiresAt);
}

function touchLastUsed(id: unknown): void {
  ApiKey.updateOne({ _id: id }, { $set: { lastUsedAt: new Date() } }).catch(
    (err) => console.error("Failed to update ApiKey lastUsedAt", err),
  );
}

export async function verifyApiKey(
  req: NextRequest,
): Promise<ApiKeyAuthResult | null> {
  const authHeader = req.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const rawKey = authHeader.substring(7).trim();

  if (!rawKey) return null;

  await dbConnect();

  // Token format: `uip_<keyId>_<secret>`. The legacy format is
  // `uip_live_<secret>` (no per-key id). Parse the keyId to do a single indexed
  // lookup; fall back to the full scan only for legacy keys.
  const parts = rawKey.split("_");
  const keyId = parts.length >= 3 && parts[0] === "uip" ? parts[1] : null;

  if (keyId && keyId !== "live") {
    const key = await ApiKey.findOne({ keyId, isActive: true }).lean();

    if (
      key &&
      !isExpired(key.expiresAt) &&
      hashMatches(rawKey, key.keyHashEncrypted)
    ) {
      touchLastUsed(key._id);

      return {
        apiKeyId: String(key._id),
        name: key.name,
        tenantId: String(key.tenantId),
        scopes: key.scopes,
      };
    }

    return null;
  }

  // Legacy path: keys created before keyId existed. O(n) scan — acceptable only
  // for the shrinking set of legacy keys, which carry no keyId.
  const legacyKeys = await ApiKey.find({
    isActive: true,
    keyId: { $in: [null, undefined] },
  }).lean();

  for (const key of legacyKeys) {
    if (isExpired(key.expiresAt)) continue;

    if (hashMatches(rawKey, key.keyHashEncrypted)) {
      touchLastUsed(key._id);

      return {
        apiKeyId: String(key._id),
        name: key.name,
        tenantId: String(key.tenantId),
        scopes: key.scopes,
      };
    }
  }

  return null;
}
