// 8pt (and 4pt) grid spacing scale math.
//
// The "8-point grid system" is a layout convention, not a CSS spec: keep
// every spacing value (padding, margin, gaps) a multiple of a base unit
// (usually 8px, with 4px allowed as a "half step" for fine adjustments like
// icon padding) so that spacing across a product stays visually consistent
// and every value composes cleanly with every other value. This module
// generates that scale, converts between px/rem, and checks arbitrary
// pixel values for grid alignment.

export interface SpacingStep {
  step: number;
  px: number;
  rem: number;
  tailwindToken: string | null;
}

const TAILWIND_SPACING_PX: Record<number, string> = {
  0: "0",
  2: "0.5",
  4: "1",
  6: "1.5",
  8: "2",
  10: "2.5",
  12: "3",
  14: "3.5",
  16: "4",
  20: "5",
  24: "6",
  28: "7",
  32: "8",
  36: "9",
  40: "10",
  44: "11",
  48: "12",
  56: "14",
  64: "16",
  80: "20",
  96: "24",
  112: "28",
  128: "32",
  144: "36",
  160: "40",
  192: "48",
  224: "56",
  256: "64",
};

export function pxToRem(px: number, rootFontSizePx = 16): number {
  return px / rootFontSizePx;
}

export function remToPx(rem: number, rootFontSizePx = 16): number {
  return rem * rootFontSizePx;
}

export function tailwindTokenForPx(px: number): string | null {
  const token = TAILWIND_SPACING_PX[px];

  return token !== undefined ? token : null;
}

export function generateSpacingScale(
  baseUnit: 4 | 8,
  stepCount: number,
  rootFontSizePx = 16,
): SpacingStep[] {
  const steps: SpacingStep[] = [];

  for (let i = 0; i <= stepCount; i++) {
    const px = i * baseUnit;

    steps.push({
      step: i,
      px,
      rem: pxToRem(px, rootFontSizePx),
      tailwindToken: tailwindTokenForPx(px),
    });
  }

  return steps;
}

export interface GridAlignment {
  px: number;
  baseUnit: number;
  isAligned: boolean;
  nearestDown: number;
  nearestUp: number;
  nearest: number;
}

export function checkGridAlignment(px: number, baseUnit: number): GridAlignment {
  const nearestDown = Math.floor(px / baseUnit) * baseUnit;
  const nearestUp = Math.ceil(px / baseUnit) * baseUnit;
  const isAligned = nearestDown === px;
  const nearest =
    px - nearestDown <= nearestUp - px || nearestUp === nearestDown ? nearestDown : nearestUp;

  return { px, baseUnit, isAligned, nearestDown, nearestUp, nearest };
}

export type Density = "compact" | "comfortable" | "spacious";

// Padding multipliers expressed as a multiple of the base unit. This is a
// documented convention (a common, but not universal, starting point for
// component density), not a derived law - the tutorial says so explicitly.
export const DENSITY_MULTIPLIERS: Record<Density, { paddingX: number; paddingY: number; gap: number }> = {
  compact: { paddingX: 3, paddingY: 1.5, gap: 1 },
  comfortable: { paddingX: 4, paddingY: 2.5, gap: 1.5 },
  spacious: { paddingX: 6, paddingY: 4, gap: 2 },
};

export interface DensityTokens {
  density: Density;
  baseUnit: number;
  paddingX: number;
  paddingY: number;
  gap: number;
}

export function computeDensityTokens(density: Density, baseUnit: 4 | 8): DensityTokens {
  const m = DENSITY_MULTIPLIERS[density];

  return {
    density,
    baseUnit,
    paddingX: Math.round(m.paddingX * baseUnit),
    paddingY: Math.round(m.paddingY * baseUnit),
    gap: Math.round(m.gap * baseUnit),
  };
}

export function spacingScaleCssVariables(steps: SpacingStep[], prefix = "space"): string {
  return steps.map((s) => `  --${prefix}-${s.step}: ${s.px}px;`).join("\n");
}

export function spacingScaleTailwindConfig(steps: SpacingStep[]): string {
  const entries = steps
    .filter((s) => s.step > 0)
    .map((s) => `      ${s.step}: "${s.rem}rem", // ${s.px}px`)
    .join("\n");

  return `module.exports = {\n  theme: {\n    extend: {\n      spacing: {\n${entries}\n      },\n    },\n  },\n};`;
}

export function spacingScaleFigmaVariables(steps: SpacingStep[], prefix = "space"): string {
  const variables = steps.map(
    (s) =>
      `    "${prefix}/${s.step}": { "type": "FLOAT", "value": ${s.px}, "scopes": ["GAP", "WIDTH_HEIGHT"] }`,
  );

  return `{\n  "figmaVariables": {\n${variables.join(",\n")}\n  }\n}`;
}
