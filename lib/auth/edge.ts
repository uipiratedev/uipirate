/**
 * Edge-runtime session verification for `middleware.ts`.
 *
 * Implemented with Web Crypto (HS256) directly rather than a library so the
 * middleware bundle stays tiny and 100% Edge-native — `jsonwebtoken`
 * (lib/auth/jwt.ts) needs Node crypto, and pulling the full `jose` barrel in
 * trips the Edge runtime's CompressionStream warning.
 *
 * This is a signature + exp/iss/aud check only. The authoritative check — user
 * still exists, still active, still holds the role — runs in the /admin server
 * layout and every API route via `lib/auth/session.ts`.
 */
import type { SessionTokenPayload } from "./jwt";

export const AUTH_COOKIE = "up_session";

const ISSUER = "uipirate";
const AUDIENCE = "uipirate-admin";

function base64UrlToBytes(input: string): Uint8Array {
  const pad = input.length % 4 === 0 ? "" : "=".repeat(4 - (input.length % 4));
  const b64 = input.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);

  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);

  return bytes;
}

function base64UrlToString(input: string): string {
  return new TextDecoder().decode(base64UrlToBytes(input));
}

export async function verifySessionEdge(
  token: string | undefined | null,
): Promise<SessionTokenPayload | null> {
  if (!token) return null;

  const secret = process.env.JWT_SECRET;

  if (!secret) return null;

  const parts = token.split(".");

  if (parts.length !== 3) return null;

  const [headerB64, payloadB64, sigB64] = parts;

  try {
    const header = JSON.parse(base64UrlToString(headerB64)) as { alg?: string };

    if (header.alg !== "HS256") return null;

    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );

    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      base64UrlToBytes(sigB64),
      new TextEncoder().encode(`${headerB64}.${payloadB64}`),
    );

    if (!valid) return null;

    const payload = JSON.parse(base64UrlToString(payloadB64)) as Record<
      string,
      unknown
    >;
    const now = Math.floor(Date.now() / 1000);

    if (typeof payload.exp === "number" && payload.exp < now) return null;
    if (payload.iss !== ISSUER || payload.aud !== AUDIENCE) return null;
    if (typeof payload.uid !== "string") return null;

    return {
      uid: payload.uid,
      email: payload.email as string,
      role: payload.role as SessionTokenPayload["role"],
    };
  } catch {
    return null;
  }
}
