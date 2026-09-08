/** Shared date-range model for every dashboard page and API. */

export type RangePreset = "24h" | "7d" | "28d" | "90d" | "12m";

export interface DateRange {
  preset: RangePreset;
  /** Inclusive ISO start (UTC). */
  from: string;
  /** Exclusive ISO end (UTC) — "now" at the time the range was built. */
  to: string;
}

export const PRESET_LABELS: Record<RangePreset, string> = {
  "24h": "Last 24 hours",
  "7d": "Last 7 days",
  "28d": "Last 28 days",
  "90d": "Last 90 days",
  "12m": "Last 12 months",
};

const PRESET_MS: Record<RangePreset, number> = {
  "24h": 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
  "28d": 28 * 24 * 60 * 60 * 1000,
  "90d": 90 * 24 * 60 * 60 * 1000,
  "12m": 365 * 24 * 60 * 60 * 1000,
};

export function rangeFromPreset(
  preset: RangePreset,
  now = Date.now(),
): DateRange {
  return {
    preset,
    from: new Date(now - PRESET_MS[preset]).toISOString(),
    to: new Date(now).toISOString(),
  };
}

/** Sensible bucket size for a time series over the given range. */
export function granularityFor(
  preset: RangePreset,
): "hour" | "day" | "week" | "month" {
  if (preset === "24h") return "hour";
  if (preset === "7d" || preset === "28d") return "day";
  if (preset === "90d") return "week";

  return "month";
}

/** Parses ?from&to (falling back to a preset) for API routes. */
export function parseRangeParams(searchParams: URLSearchParams): {
  from: Date;
  to: Date;
  preset: RangePreset;
} {
  const preset = (searchParams.get("preset") as RangePreset) || "28d";
  const fallback = rangeFromPreset(PRESET_LABELS[preset] ? preset : "28d");

  const fromRaw = searchParams.get("from") || fallback.from;
  const toRaw = searchParams.get("to") || fallback.to;

  const from = new Date(fromRaw);
  const to = new Date(toRaw);

  const valid =
    !Number.isNaN(from.valueOf()) && !Number.isNaN(to.valueOf()) && from < to;

  if (!valid) {
    const r = rangeFromPreset("28d");

    return { from: new Date(r.from), to: new Date(r.to), preset: "28d" };
  }

  return { from, to, preset: PRESET_LABELS[preset] ? preset : "28d" };
}
