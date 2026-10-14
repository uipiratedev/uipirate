export const MARKETING_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "won",
  "lost",
] as const;

export type MarketingStatus = (typeof MARKETING_STATUSES)[number];

export const MAX_UPLOAD_ROWS = 5000;

export const WEBSITE_STATES = [
  "has-website",
  "no-website",
  "needs-redesign",
  "privacy-error",
] as const;

export type WebsiteState = (typeof WEBSITE_STATES)[number] | "";

export const WEBSITE_LABELS: Record<(typeof WEBSITE_STATES)[number], string> = {
  "has-website": "Has Website",
  "no-website": "No website",
  "needs-redesign": "Can need redesign",
  "privacy-error": "Privacy error",
};

/** Map a sheet cell ("Has Website", "can need redesign", …) to a state or custom remark. */
export function normalizeWebsiteState(v: unknown): string {
  const raw = typeof v === "string" ? v.trim() : "";
  const t = raw.toLowerCase();

  if (!t) return "";
  if (t.includes("privacy") || t.includes("ssl") || t.includes("cert"))
    return "privacy-error";
  if (t.includes("redesign")) return "needs-redesign";
  if (t.startsWith("no")) return "no-website";
  if (t.includes("website")) return "has-website";

  // Preserve custom remarks/comments (e.g. "admin not available")
  return raw.slice(0, 100);
}
