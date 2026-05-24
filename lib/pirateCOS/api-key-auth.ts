import { createHash, timingSafeEqual } from "crypto";
import { NextRequest } from "next/server";
import { decrypt } from "./encrypt";
import dbConnect from "../mongodb";
import ApiKey from "@/models/pirateCOS/ApiKey";

export interface ApiKeyAuthResult {
  tenantId: string;
  scopes: ("read" | "write")[];
}

export async function verifyApiKey(req: NextRequest): Promise<ApiKeyAuthResult | null> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const rawKey = authHeader.substring(7).trim();
  if (!rawKey) return null;

  // Compute SHA-256 hash of incoming Bearer key
  const requestHash = createHash("sha256").update(rawKey).digest("hex");

  await dbConnect();
  // Fetch active keys
  const activeKeys = await ApiKey.find({ isActive: true }).lean();

  const requestHashBuffer = Buffer.from(requestHash, "hex");

  for (const key of activeKeys) {
    try {
      if (!key.keyHashEncrypted) continue;

      // Decrypt the stored SHA-256 hash
      const decryptedHash = decrypt(key.keyHashEncrypted);
      const dbHashBuffer = Buffer.from(decryptedHash, "hex");

      // Verify key match using timing-safe comparison
      if (
        requestHashBuffer.length === dbHashBuffer.length &&
        timingSafeEqual(requestHashBuffer as any, dbHashBuffer as any)
      ) {
        // Check expiration
        if (key.expiresAt && new Date() > new Date(key.expiresAt)) {
          continue;
        }

        // Proactively update lastUsedAt in the background
        ApiKey.updateOne({ _id: key._id }, { $set: { lastUsedAt: new Date() } }).catch(
          (err) => console.error("Failed to update ApiKey lastUsedAt", err),
        );

        return {
          tenantId: String(key.tenantId),
          scopes: key.scopes,
        };
      }
    } catch (err) {
      // Gracefully continue to check other keys if encryption/decryption fails
      console.error("API Key decryption verification error", err);
    }
  }

  return null;
}
