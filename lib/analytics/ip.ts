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

export const COUNTRY_CODE_TO_NAME: Record<string, string> = {
  US: "United States",
  IN: "India",
  GB: "United Kingdom",
  UK: "United Kingdom",
  CA: "Canada",
  DE: "Germany",
  FR: "France",
  AU: "Australia",
  JP: "Japan",
  SG: "Singapore",
  AE: "United Arab Emirates",
  NL: "Netherlands",
  IT: "Italy",
  ES: "Spain",
  BR: "Brazil",
  CH: "Switzerland",
  SE: "Sweden",
  PL: "Poland",
  IE: "Ireland",
  RU: "Russia",
  KR: "South Korea",
  CN: "China",
  HK: "Hong Kong",
  TW: "Taiwan",
  NZ: "New Zealand",
  ZA: "South Africa",
  MX: "Mexico",
  AR: "Argentina",
  PK: "Pakistan",
  BD: "Bangladesh",
  ID: "Indonesia",
  PH: "Philippines",
  VN: "Vietnam",
  TH: "Thailand",
  IL: "Israel",
  TR: "Turkey",
  BE: "Belgium",
  AT: "Austria",
  NO: "Norway",
  DK: "Denmark",
  FI: "Finland",
  PT: "Portugal",
  GR: "Greece",
  CZ: "Czech Republic",
  RO: "Romania",
  HU: "Hungary",
  MY: "Malaysia",
  SA: "Saudi Arabia",
  EG: "Egypt",
  NG: "Nigeria",
  KE: "Kenya",
  CO: "Colombia",
  CL: "Chile",
  PE: "Peru",
  UA: "Ukraine",
};

export const TZ_TO_GEO: Record<
  string,
  { country: string; region?: string; city?: string }
> = {
  // India
  "Asia/Kolkata": { country: "India", region: "West Bengal", city: "Kolkata" },
  "Asia/Calcutta": { country: "India", region: "West Bengal", city: "Kolkata" },
  // United States
  "America/New_York": {
    country: "United States",
    region: "New York",
    city: "New York",
  },
  "America/Chicago": {
    country: "United States",
    region: "Illinois",
    city: "Chicago",
  },
  "America/Los_Angeles": {
    country: "United States",
    region: "California",
    city: "Los Angeles",
  },
  "America/Denver": {
    country: "United States",
    region: "Colorado",
    city: "Denver",
  },
  "America/Phoenix": {
    country: "United States",
    region: "Arizona",
    city: "Phoenix",
  },
  "America/Detroit": {
    country: "United States",
    region: "Michigan",
    city: "Detroit",
  },
  "America/Indianapolis": {
    country: "United States",
    region: "Indiana",
    city: "Indianapolis",
  },
  "America/Anchorage": {
    country: "United States",
    region: "Alaska",
    city: "Anchorage",
  },
  "Pacific/Honolulu": {
    country: "United States",
    region: "Hawaii",
    city: "Honolulu",
  },
  // United Kingdom
  "Europe/London": {
    country: "United Kingdom",
    region: "England",
    city: "London",
  },
  // Canada
  "America/Toronto": {
    country: "Canada",
    region: "Ontario",
    city: "Toronto",
  },
  "America/Vancouver": {
    country: "Canada",
    region: "British Columbia",
    city: "Vancouver",
  },
  "America/Montreal": {
    country: "Canada",
    region: "Quebec",
    city: "Montreal",
  },
  "America/Edmonton": {
    country: "Canada",
    region: "Alberta",
    city: "Edmonton",
  },
  "America/Winnipeg": {
    country: "Canada",
    region: "Manitoba",
    city: "Winnipeg",
  },
  // Germany
  "Europe/Berlin": { country: "Germany", region: "Berlin", city: "Berlin" },
  "Europe/Frankfurt": { country: "Germany", region: "Hesse", city: "Frankfurt" },
  // France
  "Europe/Paris": { country: "France", region: "Île-de-France", city: "Paris" },
  // Australia
  "Australia/Sydney": {
    country: "Australia",
    region: "New South Wales",
    city: "Sydney",
  },
  "Australia/Melbourne": {
    country: "Australia",
    region: "Victoria",
    city: "Melbourne",
  },
  "Australia/Brisbane": {
    country: "Australia",
    region: "Queensland",
    city: "Brisbane",
  },
  "Australia/Perth": {
    country: "Australia",
    region: "Western Australia",
    city: "Perth",
  },
  "Australia/Adelaide": {
    country: "Australia",
    region: "South Australia",
    city: "Adelaide",
  },
  // Japan
  "Asia/Tokyo": { country: "Japan", region: "Tokyo", city: "Tokyo" },
  // Singapore
  "Asia/Singapore": {
    country: "Singapore",
    region: "Singapore",
    city: "Singapore",
  },
  // UAE
  "Asia/Dubai": {
    country: "United Arab Emirates",
    region: "Dubai",
    city: "Dubai",
  },
  // Netherlands
  "Europe/Amsterdam": {
    country: "Netherlands",
    region: "North Holland",
    city: "Amsterdam",
  },
  // Italy
  "Europe/Rome": { country: "Italy", region: "Lazio", city: "Rome" },
  // Spain
  "Europe/Madrid": { country: "Spain", region: "Madrid", city: "Madrid" },
  // Brazil
  "America/Sao_Paulo": {
    country: "Brazil",
    region: "São Paulo",
    city: "São Paulo",
  },
  // Switzerland
  "Europe/Zurich": {
    country: "Switzerland",
    region: "Zurich",
    city: "Zurich",
  },
  // Sweden
  "Europe/Stockholm": {
    country: "Sweden",
    region: "Stockholm",
    city: "Stockholm",
  },
  // Poland
  "Europe/Warsaw": { country: "Poland", region: "Masovian", city: "Warsaw" },
  // Ireland
  "Europe/Dublin": { country: "Ireland", region: "Leinster", city: "Dublin" },
  // Russia
  "Europe/Moscow": { country: "Russia", region: "Moscow", city: "Moscow" },
  // South Korea
  "Asia/Seoul": { country: "South Korea", region: "Seoul", city: "Seoul" },
  // China / Hong Kong / Taiwan
  "Asia/Shanghai": { country: "China", region: "Shanghai", city: "Shanghai" },
  "Asia/Hong_Kong": {
    country: "Hong Kong",
    region: "Hong Kong",
    city: "Hong Kong",
  },
  "Asia/Taipei": { country: "Taiwan", region: "Taipei", city: "Taipei" },
  // New Zealand
  "Pacific/Auckland": {
    country: "New Zealand",
    region: "Auckland",
    city: "Auckland",
  },
  // South Africa
  "Africa/Johannesburg": {
    country: "South Africa",
    region: "Gauteng",
    city: "Johannesburg",
  },
  // Mexico
  "America/Mexico_City": {
    country: "Mexico",
    region: "CDMX",
    city: "Mexico City",
  },
  // Argentina
  "America/Argentina/Buenos_Aires": {
    country: "Argentina",
    region: "Buenos Aires",
    city: "Buenos Aires",
  },
  // Pakistan
  "Asia/Karachi": { country: "Pakistan", region: "Sindh", city: "Karachi" },
  // Bangladesh
  "Asia/Dhaka": { country: "Bangladesh", region: "Dhaka", city: "Dhaka" },
  // Indonesia
  "Asia/Jakarta": { country: "Indonesia", region: "Jakarta", city: "Jakarta" },
  // Philippines
  "Asia/Manila": {
    country: "Philippines",
    region: "Manila",
    city: "Manila",
  },
  // Vietnam & Thailand
  "Asia/Ho_Chi_Minh": {
    country: "Vietnam",
    region: "Ho Chi Minh",
    city: "Ho Chi Minh City",
  },
  "Asia/Bangkok": { country: "Thailand", region: "Bangkok", city: "Bangkok" },
  // Israel & Turkey
  "Asia/Jerusalem": {
    country: "Israel",
    region: "Jerusalem",
    city: "Jerusalem",
  },
  "Europe/Istanbul": {
    country: "Turkey",
    region: "Istanbul",
    city: "Istanbul",
  },
};

/** Extracts edge-provided geo or client hints without ever touching a raw IP. */
export interface Geo {
  country?: string;
  region?: string;
  city?: string;
}

export function extractGeo(
  headers: HeaderLike,
  hint?: { tz?: string; lang?: string },
): Geo {
  // 1. Edge CDN & Proxy Headers
  let rawCountry =
    getHeader(headers, "x-vercel-ip-country") ||
    getHeader(headers, "cf-ipcountry") ||
    getHeader(headers, "x-country-code") ||
    getHeader(headers, "geoip-country-code") ||
    getHeader(headers, "x-geo-country") ||
    getHeader(headers, "x-appengine-country") ||
    getHeader(headers, "fastly-client-country") ||
    getHeader(headers, "x-cloudfront-viewer-country") ||
    undefined;

  if (rawCountry === "XX" || rawCountry === "T1") rawCountry = undefined;

  let region =
    getHeader(headers, "x-vercel-ip-country-region") ||
    getHeader(headers, "x-vercel-ip-region") ||
    getHeader(headers, "x-region") ||
    undefined;

  const rawCity =
    getHeader(headers, "x-vercel-ip-city") ||
    getHeader(headers, "x-city") ||
    undefined;
  let city = rawCity ? decodeURIComponent(rawCity) : undefined;

  // 2. Timezone fallback if edge geo is unavailable (e.g. local dev, custom VPS)
  if (!rawCountry && hint?.tz && TZ_TO_GEO[hint.tz]) {
    const tzGeo = TZ_TO_GEO[hint.tz];
    rawCountry = tzGeo.country;
    if (!region) region = tzGeo.region;
    if (!city) city = tzGeo.city;
  }

  // 3. Accept-Language / locale fallback
  if (!rawCountry) {
    const lang = hint?.lang || getHeader(headers, "accept-language");
    if (lang) {
      const match = lang.match(/\b[a-z]{2,3}[-_]([A-Za-z]{2})\b/);
      if (match?.[1]) {
        const code = match[1].toUpperCase();
        if (code !== "XX") {
          rawCountry = COUNTRY_CODE_TO_NAME[code] || code;
        }
      }
    }
  }

  // 4. Normalize 2-letter country codes to friendly names
  let country = rawCountry;
  if (country && country.length === 2) {
    country =
      COUNTRY_CODE_TO_NAME[country.toUpperCase()] || country.toUpperCase();
  }

  return {
    country: country || undefined,
    region: region || undefined,
    city: city || undefined,
  };
}
