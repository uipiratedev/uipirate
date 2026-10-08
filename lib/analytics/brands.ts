/**
 * Maps a referrer hostname to a theSVG icon slug (https://thesvg.org).
 *
 * Icons are served from the pinned jsDelivr mirror rather than bundled: the set
 * of referrer hosts is only known at runtime, so static imports (@thesvg/react)
 * would mean shipping thousands of unused components to the admin bundle.
 *
 * theSVG's tooling is MIT; the brand marks remain the property of their
 * trademark holders and are used here only to label traffic sources.
 */

/** Pinned — `@main` would let an upstream rename break every icon silently. */
const THESVG_TAG = "3.1.0";
const THESVG_BASE = `https://cdn.jsdelivr.net/gh/glincker/thesvg@${THESVG_TAG}/public/icons`;

/**
 * Hostname (or hostname suffix) → theSVG slug.
 *
 * Only `default` variants are referenced: `mono` is missing upstream for
 * several brands we need (openai, linkedin, bing, gemini) and 404s.
 */
const HOST_TO_SLUG: Record<string, string> = {
  // Search
  "google.com": "google",
  "bing.com": "microsoft-bing",
  "duckduckgo.com": "duckduckgo",
  "yandex.com": "yandex",
  "ecosia.org": "ecosia",
  "brave.com": "brave",

  // AI assistants
  "chatgpt.com": "openai",
  "openai.com": "openai",
  "perplexity.ai": "perplexity",
  "claude.ai": "claude",
  "anthropic.com": "anthropic",
  "gemini.google.com": "gemini",
  "copilot.microsoft.com": "microsoft",

  // Social / community
  "reddit.com": "reddit",
  // Android Reddit app sends this as the referrer.
  "com.reddit.frontpage": "reddit",
  "t.co": "x",
  "x.com": "x",
  "twitter.com": "x",
  "linkedin.com": "linkedin",
  "lnkd.in": "linkedin",
  "instagram.com": "instagram",
  "facebook.com": "facebook",
  "youtube.com": "youtube",
  "producthunt.com": "product-hunt",
  "medium.com": "medium",
  "substack.com": "substack",
  "github.com": "github",
  "dev.to": "devdotto",
  "dribbble.com": "dribbble",
  "behance.net": "behance",
  "upwork.com": "upwork",
};

/** Strips `www.` and any port, lowercased. */
export function normalizeHost(input: string | null | undefined): string {
  if (!input) return "";

  let host = input.trim().toLowerCase();

  // Accept either a bare host or a full URL.
  if (host.includes("://")) {
    try {
      host = new URL(host).hostname;
    } catch {
      return "";
    }
  }

  return host.replace(/^www\./, "").split(":")[0];
}

/**
 * theSVG slug for a referrer host, or `null` when we have no icon for it.
 * Falls back to the registrable-looking parent so `old.reddit.com` still
 * resolves to `reddit`.
 */
export function brandSlug(input: string | null | undefined): string | null {
  const host = normalizeHost(input);

  if (!host) return null;
  if (HOST_TO_SLUG[host]) return HOST_TO_SLUG[host];

  // Walk up subdomains: m.reddit.com → reddit.com
  const parts = host.split(".");

  for (let i = 1; i < parts.length - 1; i++) {
    const parent = parts.slice(i).join(".");

    if (HOST_TO_SLUG[parent]) return HOST_TO_SLUG[parent];
  }

  return null;
}

/** CDN URL for a theSVG slug. */
export function brandIconUrl(slug: string): string {
  return `${THESVG_BASE}/${slug}/default.svg`;
}

/** Icon URL for a referrer host, or `null` when unmapped. */
export function brandIconUrlForHost(
  input: string | null | undefined,
): string | null {
  const slug = brandSlug(input);

  return slug ? brandIconUrl(slug) : null;
}

/** Display label for a host — `(direct)` for empty. */
export function brandLabel(input: string | null | undefined): string {
  return normalizeHost(input) || "(direct)";
}

/** Human-readable names for `ReferrerType` channel keys. */
export const CHANNEL_LABELS: Record<string, string> = {
  direct: "Direct",
  organic: "Organic search",
  ai: "AI assistants",
  social: "Social",
  referral: "Referral",
  paid: "Paid",
  email: "Email",
  internal: "Internal",
};

export function channelLabel(key: string | null | undefined): string {
  if (!key) return "Unknown";

  return CHANNEL_LABELS[key] ?? key;
}
