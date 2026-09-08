/**
 * Pure server-side enrichment helpers — no DB, no I/O. Unit-tested in
 * __tests__/lib/analytics/enrich.test.ts.
 */
import type { ReferrerType, Utm } from "./types";

import { UAParser } from "ua-parser-js";

import { MAX_PATH_LEN, MAX_TEXT_LEN } from "./types";

export interface DeviceInfo {
  type: "desktop" | "mobile" | "tablet" | "bot" | "unknown";
  os?: string;
  browser?: string;
}

export function parseDevice(ua: string | null | undefined): DeviceInfo {
  if (!ua) return { type: "unknown" };

  const parsed = new UAParser(ua).getResult();
  const rawType = parsed.device.type; // "mobile" | "tablet" | "console" | ... | undefined

  let type: DeviceInfo["type"] = "desktop";

  if (rawType === "mobile") type = "mobile";
  else if (rawType === "tablet") type = "tablet";
  else if (rawType === "wearable" || rawType === "embedded") type = "mobile";

  return {
    type,
    os:
      [parsed.os.name, parsed.os.version].filter(Boolean).join(" ") ||
      undefined,
    browser: parsed.browser.name || undefined,
  };
}

const SEARCH_HOSTS =
  /(^|\.)(google|bing|yahoo|duckduckgo|yandex|baidu|ecosia|brave|startpage|qwant)\.[a-z.]+$/i;
const SOCIAL_HOSTS =
  /(^|\.)(facebook|instagram|twitter|linkedin|lnkd\.in|pinterest|reddit|youtube|tiktok|threads|mastodon|bsky|substack|medium|producthunt)\.[a-z.]+$|^(t\.co|x\.com|fb\.com|news\.ycombinator\.com)$/i;
const EMAIL_HOSTS =
  /^(mail\.google\.com|outlook\.live\.com|mail\.yahoo\.com)$/i;

/**
 * Classifies a visit's traffic source from the referrer host + UTM medium,
 * relative to our own host so internal navigations are labelled `internal`.
 */
export function classifyReferrer(
  referrer: string | undefined | null,
  utm: Utm | undefined,
  selfHost: string,
): ReferrerType {
  const medium = utm?.medium?.toLowerCase();

  if (medium) {
    if (/cpc|ppc|paid|paidsearch|display|banner|retargeting/.test(medium))
      return "paid";
    if (/social|social-network|social-media|sm|social_media/.test(medium))
      return "social";
    if (/email|newsletter|e-mail/.test(medium)) return "email";
    if (/organic/.test(medium)) return "organic";
    if (/referral/.test(medium)) return "referral";
    if (/affiliate/.test(medium)) return "referral";
  }

  if (!referrer) return utm?.source ? "referral" : "direct";

  let host: string;

  try {
    host = new URL(referrer).hostname.toLowerCase();
  } catch {
    return "direct";
  }

  if (!host) return "direct";
  if (
    host === selfHost.toLowerCase() ||
    host.endsWith(`.${selfHost.toLowerCase()}`)
  )
    return "internal";
  if (EMAIL_HOSTS.test(host)) return "email";
  if (SEARCH_HOSTS.test(host)) return "organic";
  if (SOCIAL_HOSTS.test(host)) return "social";

  return "referral";
}

/** Human-readable label for a referrer host (for "top sources" tables). */
export function referrerLabel(referrer: string | undefined | null): string {
  if (!referrer) return "(direct)";

  try {
    return new URL(referrer).hostname.replace(/^www\./, "") || "(direct)";
  } catch {
    return "(direct)";
  }
}

export function extractUtm(searchParams: URLSearchParams): Utm {
  const pick = (k: string) => {
    const v = searchParams.get(k);

    return v ? v.slice(0, 100) : undefined;
  };

  const utm: Utm = {
    source: pick("utm_source"),
    medium: pick("utm_medium"),
    campaign: pick("utm_campaign"),
    term: pick("utm_term"),
    content: pick("utm_content"),
  };

  return Object.fromEntries(Object.entries(utm).filter(([, v]) => v)) as Utm;
}

export function cleanPath(input: unknown): string {
  if (typeof input !== "string" || !input) return "/";

  let path = input.trim();

  // Accept a full URL or a path; keep pathname only (strip query + hash so
  // cardinality stays low). UTM lives in its own field.
  try {
    if (/^https?:\/\//i.test(path)) path = new URL(path).pathname;
  } catch {
    /* fall through */
  }

  path = path.split("?")[0].split("#")[0];
  if (!path.startsWith("/")) path = `/${path}`;
  // Collapse trailing slash except root.
  if (path.length > 1) path = path.replace(/\/+$/, "");

  return path.slice(0, MAX_PATH_LEN) || "/";
}

export function clampText(
  input: unknown,
  max = MAX_TEXT_LEN,
): string | undefined {
  if (typeof input !== "string") return undefined;

  const t = input.replace(/\s+/g, " ").trim();

  return t ? t.slice(0, max) : undefined;
}

/** Coarse classification of a clicked element for the dashboard's "kind" column. */
export function clickKind(el: {
  tag?: string;
  role?: string;
  href?: string;
  analyticsId?: string;
}): "button" | "link" | "cta" | "other" {
  const tag = el.tag?.toLowerCase();

  if (
    el.analyticsId &&
    /cta|book|contact|estimate|start|join|buy|demo/i.test(el.analyticsId)
  )
    return "cta";
  if (tag === "button" || el.role === "button") return "button";
  if (tag === "a" || el.href) return "link";

  return "other";
}
