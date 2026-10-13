/**
 * Signing in as the profile owner instead of a service account.
 *
 * Google lets a service account be invited to a profile but often refuses to
 * accept the invite, so the owner grants access once through the normal Google
 * consent screen and we keep the refresh token.
 */
import { randomBytes } from "crypto";

import dbConnect from "@/lib/mongodb";
import GbpAuth, { type IGbpAuth } from "@/models/GbpAuth";

export const GBP_SCOPE = "https://www.googleapis.com/auth/business.manage";

const AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_URL = "https://oauth2.googleapis.com/token";

export const OAUTH_STATE_COOKIE = "gbp_oauth_state";

export function oauthClient(): { id: string; secret: string } | null {
  const id = process.env.GBP_OAUTH_CLIENT_ID?.trim();
  const secret = process.env.GBP_OAUTH_CLIENT_SECRET?.trim();

  return id && secret ? { id, secret } : null;
}

export const redirectUri = (origin: string) => `${origin}/api/admin/gbp/oauth/callback`;

export const newState = () => randomBytes(24).toString("hex");

export function buildAuthUrl(origin: string, state: string): string | null {
  const c = oauthClient();

  if (!c) return null;

  const u = new URL(AUTH_URL);

  u.search = new URLSearchParams({
    client_id: c.id,
    redirect_uri: redirectUri(origin),
    response_type: "code",
    scope: `${GBP_SCOPE} openid email`,
    // offline + consent is what makes Google return a refresh token.
    access_type: "offline",
    prompt: "consent",
    state,
  }).toString();

  return u.toString();
}

let cached: { token: string; expiresAt: number } | null = null;

/** Trade the one-time code for tokens and keep the refresh token. */
export async function completeSignIn(code: string, origin: string): Promise<{ email?: string }> {
  const c = oauthClient();

  if (!c) throw new Error("GBP_OAUTH_CLIENT_ID / GBP_OAUTH_CLIENT_SECRET are not set.");

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: c.id,
      client_secret: c.secret,
      redirect_uri: redirectUri(origin),
      grant_type: "authorization_code",
    }),
    cache: "no-store",
  });
  const j = (await res.json().catch(() => ({}))) as {
    refresh_token?: string;
    id_token?: string;
    error_description?: string;
    error?: string;
  };

  if (!res.ok) throw new Error(j.error_description || j.error || `Google returned ${res.status}.`);

  if (!j.refresh_token)
    throw new Error(
      "Google did not return a refresh token. Remove this app at myaccount.google.com/permissions and connect again.",
    );

  let email: string | undefined;

  try {
    // Display only; the token came straight from Google over TLS.
    email = JSON.parse(Buffer.from(j.id_token!.split(".")[1], "base64url").toString()).email;
  } catch {
    // Not needed.
  }

  await dbConnect();
  await GbpAuth.updateOne(
    { key: "owner" },
    { $set: { refreshToken: j.refresh_token, email } },
    { upsert: true },
  );
  cached = null;

  return { email };
}

export async function getStoredAuth(): Promise<{ email?: string; updatedAt: Date } | null> {
  await dbConnect();

  return GbpAuth.findOne({ key: "owner" })
    .select("email updatedAt")
    .lean<{ email?: string; updatedAt: Date } | null>();
}

export async function disconnect(): Promise<void> {
  await dbConnect();
  await GbpAuth.deleteOne({ key: "owner" });
  cached = null;
}

/** A fresh access token for the signed-in owner, or `null` if not connected. */
export async function getOAuthAccessToken(): Promise<string | null> {
  const c = oauthClient();

  if (!c) return null;

  if (cached && cached.expiresAt - 60_000 > Date.now()) return cached.token;

  await dbConnect();

  const row = await GbpAuth.findOne({ key: "owner" }).lean<IGbpAuth | null>();

  if (!row) return null;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: c.id,
      client_secret: c.secret,
      refresh_token: row.refreshToken,
      grant_type: "refresh_token",
    }),
    cache: "no-store",
  });
  const j = (await res.json().catch(() => ({}))) as {
    access_token?: string;
    expires_in?: number;
  };

  if (!res.ok || !j.access_token) {
    // Revoked or expired grant: the admin shows "Connect" again.
    cached = null;

    return null;
  }

  cached = { token: j.access_token, expiresAt: Date.now() + (j.expires_in ?? 3000) * 1000 };

  return cached.token;
}
