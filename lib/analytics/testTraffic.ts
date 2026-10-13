/**
 * Decides whether a request is test traffic that must not be recorded.
 *
 * `.env.local` points at the *production* database, so `next dev` on a laptop
 * writes straight into the real analytics: 71 recorded events had a localhost
 * referrer and the only "conversions" on record were form submits typed in by
 * the site owner. Filtering after the fact is not enough — it leaves the rows
 * in the table for every other query to trip over — so ingest refuses them.
 *
 * Edge-safe: no Node imports, because middleware uses it too.
 *
 * Override with `ANALYTICS_ALLOW_DEV=1` to deliberately record from a dev
 * machine (for example, to test the tracker end to end).
 */

type HeaderReader = { get(name: string): string | null | undefined };

const LOCAL_HOST =
  /^(localhost|127\.\d+\.\d+\.\d+|0\.0\.0\.0|\[?::1\]?|[^.]+\.local|[^.]+\.localhost)$/i;

/** The hostname inside a header value that may be a URL or a bare `host:port`. */
export function hostnameOf(value: string | null | undefined): string {
  if (!value) return "";

  const v = value.trim();

  try {
    if (v.includes("://")) return new URL(v).hostname.toLowerCase();
  } catch {
    return "";
  }

  // Bare "host:port" or "[::1]:3000".
  if (v.startsWith("[")) return v.slice(0, v.indexOf("]") + 1).toLowerCase();

  return v.split(":")[0].toLowerCase();
}

export function isLocalHost(value: string | null | undefined): boolean {
  const h = hostnameOf(value);

  return h !== "" && LOCAL_HOST.test(h);
}

/** True when this request should not be counted. */
export function isTestTraffic(
  headers: HeaderReader,
  env: { NODE_ENV?: string; ANALYTICS_ALLOW_DEV?: string } = process.env,
): boolean {
  if (env.ANALYTICS_ALLOW_DEV === "1") return false;

  // Any non-production build (dev, test) is a developer, not a visitor.
  if (env.NODE_ENV && env.NODE_ENV !== "production") return true;

  // A production build can still be driven from localhost (`next start`).
  return (
    isLocalHost(headers.get("origin")) ||
    isLocalHost(headers.get("referer")) ||
    isLocalHost(headers.get("host"))
  );
}
