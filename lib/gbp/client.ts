/**
 * Thin client for the Google Business Profile APIs, using the project's
 * existing service account (the one already used for Search Console).
 *
 * Three separate Google APIs are involved and each must be enabled in the
 * Cloud project — enabling only "Google My Business API" is not enough:
 *   - My Business Account Management API  (list accounts)
 *   - My Business Business Information API (list locations)
 *   - Google My Business API (mybusiness.googleapis.com) — creates the posts
 *
 * The service account's email must also be added as a *manager* of the
 * Business Profile, or every call returns 403.
 */
import { getGoogleAccessToken } from "@/lib/indexing/auth";
import { getOAuthAccessToken } from "./oauth";
import type { LocalPostPayload } from "./payload";

const SCOPE = "https://www.googleapis.com/auth/business.manage";

const ACCOUNTS_API = "https://mybusinessaccountmanagement.googleapis.com/v1";
const INFO_API = "https://mybusinessbusinessinformation.googleapis.com/v1";
const POSTS_API = "https://mybusiness.googleapis.com/v4";

export class GbpError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    /** A short, human instruction for the admin screen. */
    readonly hint?: string,
  ) {
    super(message);
    this.name = "GbpError";
  }
}

/** "accounts/123" or "123" -> "123". */
export function bareId(value: string | undefined | null): string {
  return (value ?? "").trim().replace(/^(accounts|locations)\//i, "");
}

export interface GbpConfig {
  accountId: string;
  locationId: string;
}

/** Both ids, or `null` when the profile has not been configured yet. */
export function getGbpConfig(): GbpConfig | null {
  const accountId = bareId(process.env.GBP_ACCOUNT_ID);
  const locationId = bareId(process.env.GBP_LOCATION_ID);

  return accountId && locationId ? { accountId, locationId } : null;
}

/** Posting to a live profile is opt-in; without this the cron only dry-runs. */
export function isPublishingEnabled(): boolean {
  return process.env.GBP_PUBLISH_ENABLED === "1";
}

/** Turn Google's error body into something an admin can act on. */
export function explain(status: number, body: string): GbpError {
  let apiMessage = "";

  try {
    const err = JSON.parse(body)?.error;
    const detail = JSON.stringify(err?.details ?? "").slice(0, 300);

    apiMessage = `${err?.message ?? ""}${detail && detail !== "\"\"" ? ` ${detail}` : ""}`.trim();
  } catch {
    apiMessage = body.slice(0, 200);
  }

  if (status === 401)
    return new GbpError(
      "Google rejected the service-account credentials.",
      status,
      "Check GOOGLE_SERVICE_ACCOUNT_JSON.",
    );

  if (status === 403 && /has not been used|is disabled|SERVICE_DISABLED/i.test(apiMessage))
    return new GbpError(
      "A required Google API is not enabled for this project.",
      status,
      "Enable all three: My Business Account Management, My Business Business Information, and Google My Business API.",
    );

  if (status === 403)
    return new GbpError(
      "The service account is not allowed to manage this Business Profile.",
      status,
      "Add the service account's email as a Manager of the profile in Business Profile settings → People and access.",
    );

  if (status === 429)
    return new GbpError(
      "Google's quota for the Business Profile API is exhausted (or zero).",
      status,
      "New projects start with 0 quota; request Business Profile API access from Google, then retry.",
    );

  if (status === 404)
    return new GbpError(
      "Google could not find that account or location.",
      status,
      "Check GBP_ACCOUNT_ID and GBP_LOCATION_ID.",
    );

  return new GbpError(apiMessage || `Google returned HTTP ${status}.`, status);
}

async function call<T>(url: string, init?: RequestInit): Promise<T> {
  // The owner's own sign-in first; the service account is the fallback.
  const token = (await getOAuthAccessToken()) ?? (await getGoogleAccessToken([SCOPE]));

  if (!token)
    throw new GbpError(
      "Google Business Profile is not connected.",
      undefined,
      "Press “Connect Google account” on this page.",
    );

  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  const text = await res.text();

  if (!res.ok) throw explain(res.status, text);

  return (text ? JSON.parse(text) : {}) as T;
}

export interface GbpAccount {
  id: string;
  name: string;
}
export interface GbpLocation {
  id: string;
  title: string;
}

/** Accounts this service account can see. Empty = not added as a manager. */
export async function listAccounts(): Promise<GbpAccount[]> {
  const j = await call<{ accounts?: Array<{ name: string; accountName?: string }> }>(
    `${ACCOUNTS_API}/accounts`,
  );

  return (j.accounts ?? []).map((a) => ({
    id: bareId(a.name),
    name: a.accountName ?? a.name,
  }));
}

export async function listLocations(accountId: string): Promise<GbpLocation[]> {
  const j = await call<{ locations?: Array<{ name: string; title?: string }> }>(
    `${INFO_API}/accounts/${bareId(accountId)}/locations?readMask=name,title&pageSize=100`,
  );

  return (j.locations ?? []).map((l) => ({
    id: bareId(l.name),
    title: l.title ?? l.name,
  }));
}

export interface GbpInvitation {
  /** Full resource name, e.g. accounts/1/invitations/2 — what accept needs. */
  name: string;
  /** The business being offered, for display. */
  target: string;
  role?: string;
}

/**
 * Pending invitations to manage a profile. A service account cannot click the
 * link in an email, so an invite stays "Invited" until it is accepted here.
 */
export async function listInvitations(accountId: string): Promise<GbpInvitation[]> {
  const j = await call<{
    invitations?: Array<{
      name: string;
      role?: string;
      targetLocation?: { locationName?: string };
      targetAccount?: { accountName?: string };
    }>;
  }>(`${ACCOUNTS_API}/accounts/${bareId(accountId)}/invitations`);

  return (j.invitations ?? []).map((i) => ({
    name: i.name,
    role: i.role,
    target: i.targetLocation?.locationName ?? i.targetAccount?.accountName ?? i.name,
  }));
}

export async function acceptInvitation(name: string): Promise<void> {
  await call(`${ACCOUNTS_API}/${name.replace(/^\/+/, "")}:accept`, {
    method: "POST",
    body: "{}",
  });
}

/** Creates a "What's new" post. Returns Google's resource name for it. */
export async function createLocalPost(
  cfg: GbpConfig,
  payload: LocalPostPayload,
): Promise<string> {
  const j = await call<{ name?: string }>(
    `${POSTS_API}/accounts/${cfg.accountId}/locations/${cfg.locationId}/localPosts`,
    { method: "POST", body: JSON.stringify(payload) },
  );

  return j.name ?? "";
}
