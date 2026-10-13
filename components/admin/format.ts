export function fmtInt(n: number | undefined | null): string {
  return new Intl.NumberFormat("en-US").format(Math.round(n || 0));
}

export function fmtCompact(n: number | undefined | null): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n || 0);
}

export function fmtPct(
  fraction: number | undefined | null,
  digits = 1,
): string {
  return `${((fraction || 0) * 100).toFixed(digits)}%`;
}

export function fmtDuration(ms: number | undefined | null): string {
  const s = Math.round((ms || 0) / 1000);

  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rem = s % 60;

  if (m < 60) return `${m}m ${rem}s`;
  const h = Math.floor(m / 60);

  return `${h}h ${m % 60}m`;
}

export function fmtDate(
  d: string | Date,
  opts?: Intl.DateTimeFormatOptions,
): string {
  return new Date(d).toLocaleDateString(
    "en-US",
    opts || { month: "short", day: "numeric" },
  );
}

export function fmtDateTime(d: string | Date): string {
  return new Date(d).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** Validated categorical palette (light mode) — see dataviz skill references/palette.md */
export const SERIES = [
  "#2a78d6", // blue
  "#eb6834", // orange
  "#1baf7a", // aqua
  "#eda100", // yellow
  "#e87ba4", // magenta
  "#008300", // green
  "#4a3aa7", // violet
  "#e34948", // red
] as const;

/** Blue sequential ramp (light) for heatmap intensity. */
export const SEQ_BLUE = [
  "#eef4fd",
  "#cde2fb",
  "#9ec5f4",
  "#6da7ec",
  "#3987e5",
  "#256abf",
  "#184f95",
  "#0d366b",
] as const;

export const INK = {
  primary: "#0b0b0b",
  secondary: "#52514e",
  muted: "#8a8a86",
  grid: "#ececec",
};
