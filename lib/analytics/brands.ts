/**
 * Maps a referrer hostname to a brand icon from theSVG (https://thesvg.org).
 *
 * Icons are **vendored** into `public/icons/` with `npx @thesvg/cli add <slug>`
 * rather than hot-linked. Serving them from theSVG's CDN would mean a runtime
 * dependency on a third-party domain for an internal page, and `next/image`
 * would additionally need `images.remotePatterns` plus `dangerouslyAllowSVG`.
 * Local files are same-origin, immutable, and cannot break on an upstream
 * rename — the published GitHub tag (v3.1.0) is already behind npm (3.3.12)
 * and is missing newer icons such as `yahoo-badge`.
 *
 * To add a brand: `npx @thesvg/cli add <slug>`, then map the host below.
 *
 * theSVG's tooling is MIT; the brand marks remain the property of their
 * trademark holders and are used here only to label traffic sources.
 */

/** Vendored icons live here, named `<slug>.svg`. */
const ICON_BASE = "/icons";

/** Hostname (or hostname suffix) → vendored icon slug. */
export const HOST_TO_SLUG: Record<string, string> = {
  // Search
  "google.com": "google",
  "bing.com": "microsoft-bing",
  "duckduckgo.com": "duckduckgo",
  // Upstream names the Yahoo mark `yahoo-badge`, not `yahoo`.
  "yahoo.com": "yahoo-badge",
  "search.yahoo.com": "yahoo-badge",
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
  "news.ycombinator.com": "y-combinator",
  "hackerearth.com": "hackerearth",
  "medium.com": "medium",
  "substack.com": "substack",
  "github.com": "github",
  "dev.to": "devto",
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

/** Public path for a vendored icon slug. */
export function brandIconUrl(slug: string): string {
  return `${ICON_BASE}/${slug}.svg`;
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

/**
 * ISO-3166 alpha-2 → country name, e.g. "IN" → "India".
 *
 * Uses the runtime's own ICU data rather than the hand-maintained
 * `COUNTRY_CODE_TO_NAME` table in `lib/analytics/ip.ts`, for two reasons:
 * that table covers 55 countries (so the long tail would render as bare
 * codes), and `ip.ts` imports `node:crypto`, which must not be pulled into
 * a client bundle.
 */
let countryNames: Intl.DisplayNames | null | undefined;

export function countryName(code: string | null | undefined): string {
  const c = (code || "").trim().toUpperCase();

  if (!c) return "(unknown)";
  // Not a country code — pass through whatever we were given.
  if (!/^[A-Z]{2}$/.test(c)) return c;

  if (countryNames === undefined) {
    try {
      countryNames = new Intl.DisplayNames(["en"], { type: "region" });
    } catch {
      countryNames = null;
    }
  }

  try {
    return countryNames?.of(c) || c;
  } catch {
    return c;
  }
}
