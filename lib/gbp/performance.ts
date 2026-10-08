/**
 * How the Google listing performs: how often it is seen and what people do
 * from it. Read-only, from the Business Profile Performance API (which must be
 * enabled in the Cloud project).
 */
import { call, getGbpConfig, GbpError } from "./client";

const PERF_API = "https://businessprofileperformance.googleapis.com/v1";

export const METRICS = [
  "BUSINESS_IMPRESSIONS_DESKTOP_SEARCH",
  "BUSINESS_IMPRESSIONS_MOBILE_SEARCH",
  "BUSINESS_IMPRESSIONS_DESKTOP_MAPS",
  "BUSINESS_IMPRESSIONS_MOBILE_MAPS",
  "WEBSITE_CLICKS",
  "CALL_CLICKS",
  "BUSINESS_DIRECTION_REQUESTS",
  "BUSINESS_BOOKINGS",
  "BUSINESS_CONVERSATIONS",
] as const;

type Metric = (typeof METRICS)[number];

interface Raw {
  multiDailyMetricTimeSeries?: Array<{
    dailyMetricTimeSeries?: Array<{
      dailyMetric: Metric;
      timeSeries?: { datedValues?: Array<{ date: { year: number; month: number; day: number }; value?: string }> };
    }>;
  }>;
}

export interface PerformanceSummary {
  from: string;
  to: string;
  /** Times the listing appeared in Search or Maps. */
  views: number;
  websiteClicks: number;
  calls: number;
  directions: number;
  bookings: number;
  messages: number;
  /** One point per day for the chart. */
  daily: Array<{ date: string; views: number; websiteClicks: number }>;
}

const iso = (d: { year: number; month: number; day: number }) =>
  `${d.year}-${String(d.month).padStart(2, "0")}-${String(d.day).padStart(2, "0")}`;

/** Pure: turn Google's per-metric series into totals and a daily series. */
export function summarise(raw: Raw, from: string, to: string): PerformanceSummary {
  const totals: Record<string, number> = {};
  const byDay = new Map<string, { views: number; websiteClicks: number }>();

  for (const group of raw.multiDailyMetricTimeSeries ?? [])
    for (const s of group.dailyMetricTimeSeries ?? [])
      for (const p of s.timeSeries?.datedValues ?? []) {
        const n = Number(p.value ?? 0) || 0;
        const day = iso(p.date);
        const row = byDay.get(day) ?? { views: 0, websiteClicks: 0 };

        totals[s.dailyMetric] = (totals[s.dailyMetric] ?? 0) + n;
        if (s.dailyMetric.startsWith("BUSINESS_IMPRESSIONS")) row.views += n;
        if (s.dailyMetric === "WEBSITE_CLICKS") row.websiteClicks += n;
        byDay.set(day, row);
      }

  const views = METRICS.filter((m) => m.startsWith("BUSINESS_IMPRESSIONS")).reduce(
    (a, m) => a + (totals[m] ?? 0),
    0,
  );

  return {
    from,
    to,
    views,
    websiteClicks: totals.WEBSITE_CLICKS ?? 0,
    calls: totals.CALL_CLICKS ?? 0,
    directions: totals.BUSINESS_DIRECTION_REQUESTS ?? 0,
    bookings: totals.BUSINESS_BOOKINGS ?? 0,
    messages: totals.BUSINESS_CONVERSATIONS ?? 0,
    daily: [...byDay.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, v]) => ({ date, ...v })),
  };
}

const parts = (d: Date) => ({ year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() });

/** The last `days` days, ending two days ago because Google's data lags. */
export async function getPerformance(days = 28): Promise<PerformanceSummary> {
  const cfg = getGbpConfig();

  if (!cfg) throw new GbpError("Business Profile is not configured.", undefined, "Set GBP_ACCOUNT_ID and GBP_LOCATION_ID.");

  const end = new Date(Date.now() - 2 * 86_400_000);
  const start = new Date(end.getTime() - (days - 1) * 86_400_000);
  const s = parts(start);
  const e = parts(end);

  const q = new URLSearchParams();

  for (const m of METRICS) q.append("dailyMetrics", m);
  q.set("dailyRange.startDate.year", String(s.year));
  q.set("dailyRange.startDate.month", String(s.month));
  q.set("dailyRange.startDate.day", String(s.day));
  q.set("dailyRange.endDate.year", String(e.year));
  q.set("dailyRange.endDate.month", String(e.month));
  q.set("dailyRange.endDate.day", String(e.day));

  const raw = await call<Raw>(`${PERF_API}/locations/${cfg.locationId}:fetchMultiDailyMetricsTimeSeries?${q}`);

  return summarise(raw, iso(s), iso(e));
}
