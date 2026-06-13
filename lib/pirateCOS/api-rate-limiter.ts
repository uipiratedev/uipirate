// Per-API-key sliding-window rate limiter for the public v1 API.
//
// Keyed by apiKeyId (the unit of trust), not IP. See
// PIRATECOS_PUBLIC_API_INTEGRATION_PLAN.md §6.
//
// ⚠️ This is an in-memory window. It is correct for a single instance but does
// NOT share state across serverless instances / regions. For production
// correctness this should be backed by a shared store (Upstash Redis token
// bucket, or a Mongo TTL counter). The interface here is intentionally small so
// the backing store can be swapped without touching the routes.

const buckets = new Map<string, number[]>();

const WINDOW_MS = 60 * 1000; // 1 minute
const DEFAULT_LIMIT = 120; // requests per key per window

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  /** Epoch seconds at which the current window resets. */
  reset: number;
  /** Seconds to wait before retrying — only set when `allowed` is false. */
  retryAfter?: number;
}

export function checkApiRateLimit(
  apiKeyId: string,
  limit: number = DEFAULT_LIMIT,
): RateLimitResult {
  const now = Date.now();
  const hits = (buckets.get(apiKeyId) || []).filter(
    (t) => now - t < WINDOW_MS,
  );

  const windowStart = hits[0] ?? now;
  const reset = Math.ceil((windowStart + WINDOW_MS) / 1000);

  if (hits.length >= limit) {
    buckets.set(apiKeyId, hits);
    const retryAfter = Math.max(
      1,
      Math.ceil((hits[0] + WINDOW_MS - now) / 1000),
    );

    return { allowed: false, limit, remaining: 0, reset, retryAfter };
  }

  hits.push(now);
  buckets.set(apiKeyId, hits);

  return { allowed: true, limit, remaining: limit - hits.length, reset };
}

/** Standard rate-limit headers for any v1 response. */
export function rateLimitHeaders(r: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    "X-RateLimit-Limit": String(r.limit),
    "X-RateLimit-Remaining": String(r.remaining),
    "X-RateLimit-Reset": String(r.reset),
  };

  if (r.retryAfter !== undefined) {
    headers["Retry-After"] = String(r.retryAfter);
  }

  return headers;
}
