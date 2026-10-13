// Responsive breakpoint, container-query, and aspect-ratio math.
//
// Three related but independent calculations live here:
//   1. A breakpoint scale (named min-width tokens) that drives both @media
//      and @container CSS output from the same source of truth - a
//      component queries its own box, not the viewport, but the sizing
//      *thresholds* are conventionally the same numbers either way.
//   2. activeBreakpoint(): mobile-first "which named breakpoint applies at
//      this width" lookup, used to drive a live viewport simulator.
//   3. Aspect-ratio dimension math for CLS prevention - given a target
//      render width, compute the exact height so the browser can reserve
//      space before the image loads.

export interface Breakpoint {
  key: string;
  label: string;
  minWidth: number;
}

export const BREAKPOINT_PRESETS: Record<string, Breakpoint[]> = {
  "Tailwind Defaults": [
    { key: "sm", label: "Small", minWidth: 640 },
    { key: "md", label: "Medium", minWidth: 768 },
    { key: "lg", label: "Large", minWidth: 1024 },
    { key: "xl", label: "X-Large", minWidth: 1280 },
    { key: "2xl", label: "2X-Large", minWidth: 1536 },
  ],
  "Device-Based": [
    { key: "sm", label: "Mobile Landscape", minWidth: 390 },
    { key: "md", label: "Tablet", minWidth: 768 },
    { key: "lg", label: "Laptop", minWidth: 1024 },
    { key: "xl", label: "Desktop", minWidth: 1440 },
    { key: "2xl", label: "Ultrawide", minWidth: 1920 },
  ],
  "Bootstrap-Style": [
    { key: "sm", label: "Small", minWidth: 576 },
    { key: "md", label: "Medium", minWidth: 768 },
    { key: "lg", label: "Large", minWidth: 992 },
    { key: "xl", label: "X-Large", minWidth: 1200 },
    { key: "2xl", label: "XX-Large", minWidth: 1400 },
  ],
};

export const ASPECT_RATIO_PRESETS: { label: string; w: number; h: number }[] = [
  { label: "16:9 - Video / Widescreen", w: 16, h: 9 },
  { label: "4:3 - Classic", w: 4, h: 3 },
  { label: "1:1 - Square / Avatar", w: 1, h: 1 },
  { label: "21:9 - Cinematic Ultrawide", w: 21, h: 9 },
  { label: "3:2 - Photography", w: 3, h: 2 },
  { label: "9:16 - Vertical / Stories", w: 9, h: 16 },
];

// ── Breakpoint scale → CSS/Tailwind output ──────────────────────────────

export function sortedByMinWidth(breakpoints: Breakpoint[]): Breakpoint[] {
  return [...breakpoints].sort((a, b) => a.minWidth - b.minWidth);
}

export function generateMediaQueryCss(breakpoints: Breakpoint[]): string {
  const sorted = sortedByMinWidth(breakpoints);
  const lines = [
    ":root {",
    ...sorted.map((bp) => `  --breakpoint-${bp.key}: ${bp.minWidth}px;`),
    "}",
    "",
    ...sorted.map(
      (bp) => `@media (min-width: ${bp.minWidth}px) { /* ${bp.key} and up */ }`,
    ),
  ];

  return lines.join("\n");
}

export function generateContainerQueryCss(
  breakpoints: Breakpoint[],
  containerName: string,
): string {
  const sorted = sortedByMinWidth(breakpoints);
  const name = containerName.trim() || "component";
  const lines = [
    ".component {",
    "  container-type: inline-size;",
    `  container-name: ${name};`,
    "}",
    "",
    ...sorted.map(
      (bp) =>
        `@container ${name} (min-width: ${bp.minWidth}px) { /* ${bp.key} and up */ }`,
    ),
  ];

  return lines.join("\n");
}

export function generateTailwindScreensConfig(breakpoints: Breakpoint[]): string {
  const sorted = sortedByMinWidth(breakpoints);
  const lines = [
    "// tailwind.config.js",
    "module.exports = {",
    "  theme: {",
    "    screens: {",
    ...sorted.map((bp) => `      ${bp.key}: "${bp.minWidth}px",`),
    "    },",
    "  },",
    "};",
  ];

  return lines.join("\n");
}

// Mobile-first: the active breakpoint is the LARGEST minWidth that is <=
// the given viewport width. Below the smallest breakpoint, there is no
// named token (Tailwind's own convention - the unprefixed default).
export function activeBreakpoint(
  width: number,
  breakpoints: Breakpoint[],
): Breakpoint | null {
  const sorted = sortedByMinWidth(breakpoints);
  let active: Breakpoint | null = null;

  for (const bp of sorted) {
    if (width >= bp.minWidth) active = bp;
    else break;
  }

  return active;
}

// ── Aspect ratio / CLS math ──────────────────────────────────────────────

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export function simplifyRatio(w: number, h: number): [number, number] {
  if (w <= 0 || h <= 0) return [w, h];

  const divisor = gcd(Math.round(w), Math.round(h));

  return divisor === 0 ? [w, h] : [w / divisor, h / divisor];
}

export interface AspectRatioResult {
  width: number;
  height: number;
  ratioCss: string;
  paddingTopPercent: number;
  simplified: [number, number];
}

export function computeAspectRatioDimensions(
  ratioW: number,
  ratioH: number,
  targetWidth: number,
): AspectRatioResult {
  const height = Math.round((targetWidth * ratioH) / ratioW);
  const paddingTopPercent = Math.round((ratioH / ratioW) * 10000) / 100;

  return {
    width: Math.round(targetWidth),
    height,
    ratioCss: `${ratioW} / ${ratioH}`,
    paddingTopPercent,
    simplified: simplifyRatio(ratioW, ratioH),
  };
}
