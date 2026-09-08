/**
 * Tiny in-memory fixed-window rate limiter. Good enough to blunt brute-force
 * on /api/auth/login and floods on /api/analytics/collect within a single
 * serverless instance. Not a distributed limiter — swap for Redis/Upstash if
 * this ever needs to hold across instances.
 */
interface Window {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Window>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowMs;

    buckets.set(key, { count: 1, resetAt });

    return { allowed: true, remaining: limit - 1, resetAt };
  }

  existing.count += 1;

  const allowed = existing.count <= limit;

  return {
    allowed,
    remaining: Math.max(0, limit - existing.count),
    resetAt: existing.resetAt,
  };
}

// Opportunistic cleanup so the map can't grow unbounded on a long-lived instance.
if (typeof setInterval === "function") {
  const timer = setInterval(
    () => {
      const now = Date.now();

      for (const [key, win] of buckets) {
        if (win.resetAt <= now) buckets.delete(key);
      }
    },
    10 * 60 * 1000,
  );

  // Don't keep the process alive just for cleanup.
  if (typeof timer === "object" && timer && "unref" in timer) {
    (timer as { unref: () => void }).unref();
  }
}
