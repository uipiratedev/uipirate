/**
 * Shared secret for server-to-server analytics calls (middleware → the
 * `/api/analytics/hit` ingest route).
 *
 * Falls back to `CRON_SECRET` so no new environment variable is required —
 * that value already exists for the rollup/indexing crons and is server-only.
 * When neither is set the ingest route returns 401 and middleware skips the
 * call entirely: anonymous counting is simply off, rather than leaving a
 * publicly writable counter exposed.
 */
export function internalAnalyticsSecret(): string | null {
  return (
    process.env.INTERNAL_ANALYTICS_SECRET || process.env.CRON_SECRET || null
  );
}
