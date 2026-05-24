import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const ALGORITHM = "aes-256-gcm";
const KEY_BYTES = 32; // 256 bits
const IV_BYTES = 12; // 96 bits — optimal for GCM

/**
 * Reads the AI_ENCRYPTION_KEY env var and returns a 32-byte Buffer.
 * Accepts a 64-char hex string OR a 44-char base64 string.
 * Throws if the key is missing or the wrong length.
 */
function getKey(): Buffer {
  const raw = process.env.AI_ENCRYPTION_KEY;

  if (!raw) {
    throw new Error(
      "AI_ENCRYPTION_KEY is not set. Generate one with:\n" +
        "  node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"\n" +
        "and add it to your .env.local file.",
    );
  }
  const buf = Buffer.from(raw, raw.length === 64 ? "hex" : "base64");

  if (buf.length !== KEY_BYTES) {
    throw new Error(
      "AI_ENCRYPTION_KEY must be 32 bytes (64 hex chars or 44 base64 chars).",
    );
  }

  return buf;
}

/**
 * Encrypts a plaintext string using AES-256-GCM.
 * Returns a colon-separated string: "<iv_hex>:<authTag_hex>:<ciphertext_hex>"
 */
export function encrypt(plaintext: string): string {
  const key = getKey();
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag(); // 16-byte authentication tag

  return [
    iv.toString("hex"),
    tag.toString("hex"),
    encrypted.toString("hex"),
  ].join(":");
}

/**
 * Decrypts an AES-256-GCM ciphertext produced by `encrypt()`.
 * The input must be in the format "<iv_hex>:<authTag_hex>:<ciphertext_hex>".
 * Throws if the format is wrong or the authentication tag fails (tampered data).
 */
export function decrypt(ciphertext: string): string {
  const key = getKey();
  const parts = ciphertext.split(":");

  if (parts.length !== 3) {
    throw new Error("Invalid encrypted value format — expected iv:tag:data.");
  }
  const [ivHex, tagHex, dataHex] = parts;
  const decipher = createDecipheriv(ALGORITHM, key, Buffer.from(ivHex, "hex"));

  decipher.setAuthTag(Buffer.from(tagHex, "hex"));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(dataHex, "hex")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}
