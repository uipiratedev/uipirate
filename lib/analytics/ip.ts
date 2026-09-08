/**
 * Shared client-IP handling. Raw IPs are NEVER stored — only an irreversible
 * SHA-256 fingerprint, matching the approach in `models/ViewLog.ts`.
 *
 * Accepts either a Fetch `Headers` / Next `ReadonlyHeaders` object or a plain
 * `Record<string,string>` so it works from route handlers, middleware, and
 * `headers()` in server components.
 */
import { createHash } from "crypto";

type HeaderLike =
  | Headers
  | { get(name: string): string | null | undefined }
  | Record<string, string | string[] | undefined>;

function getHeader(headers: HeaderLike, name: string): string | null {
  if (typeof (headers as { get?: unknown }).get === "function") {
    return ((headers as Headers).get(name) ?? null) as string | null;
  }

  const rec = headers as Record<string, string | string[] | undefined>;
  const value = rec[name] ?? rec[name.toLowerCase()];

  if (Array.isArray(value)) return value[0] ?? null;

  return value ?? null;
}

/**
 * Best-effort real client IP. Priority handles CDN/proxy chains
 * (Cloudflare → standard XFF → nginx → Vercel).
 */
export function extractIp(headers: HeaderLike): string {
  const cf = getHeader(headers, "cf-connecting-ip");

  if (cf) return cf.trim();

  const xff = getHeader(headers, "x-forwarded-for");

  if (xff) {
    const first = xff.split(",")[0]?.trim();

    if (first) return first;
  }

  const real = getHeader(headers, "x-real-ip");

  if (real) return real.trim();

  const vercel = getHeader(headers, "x-vercel-forwarded-for");

  if (vercel) return vercel.split(",")[0].trim();

  return "127.0.0.1";
}

export function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex");
}

/** Convenience: hashed fingerprint straight from a headers object. */
export function ipHashFromHeaders(headers: HeaderLike): string {
  return hashIp(extractIp(headers));
}

// Known bot / crawler User-Agent patterns — never counted as human traffic.
export const BOT_PATTERN =
  /bot|crawler|spider|scraper|facebookexternalhit|Twitterbot|LinkedInBot|WhatsApp|Slackbot|TelegramBot|DuckDuckBot|baiduspider|yandexbot|sogou|exabot|ia_archiver|AhrefsBot|SemrushBot|MJ12bot|DotBot|PetalBot|BingPreview|Googlebot|bingbot|slurp|headlesschrome|lighthouse|pingdom|gtmetrix|python-requests|axios|node-fetch|curl|wget/i;

export function isBotUserAgent(ua: string | null | undefined): boolean {
  if (!ua) return true; // no UA at all → treat as non-human

  return BOT_PATTERN.test(ua);
}

/** Extracts edge-provided geo without ever touching a raw IP. */
export interface Geo {
  country?: string;
  region?: string;
  city?: string;
}

export function extractGeo(headers: HeaderLike): Geo {
  const country =
    getHeader(headers, "x-vercel-ip-country") ||
    getHeader(headers, "cf-ipcountry") ||
    undefined;
  const region =
    getHeader(headers, "x-vercel-ip-country-region") ||
    getHeader(headers, "x-vercel-ip-region") ||
    undefined;
  const rawCity = getHeader(headers, "x-vercel-ip-city") || undefined;

  return {
    country: country && country !== "XX" ? country : undefined,
    region: region || undefined,
    city: rawCity ? decodeURIComponent(rawCity) : undefined,
  };
}
