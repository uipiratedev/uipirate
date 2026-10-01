// Accessible SaaS color ramp generator.
//
// Given a single base color, this produces a Tailwind-style 11-step shade
// ramp (50 -> 950) the way production design systems do it: the ramp is NOT
// a naive linear interpolation from white to black through the base hue -
// that produces muddy, unusable steps. Instead each step targets a curated
// lightness and a saturation *multiplier* of the base color's own
// saturation, so a vivid base color stays vivid through the midtones and
// desaturates gracefully near white/black (the same shape real palettes
// like Tailwind's or Radix's use, even though the exact curve is our own).
//
// Hue is held constant across every step. Some production systems also
// apply a small hue shift per step for extra "warmth correction" - that's a
// legitimate technique, but it's an artistic judgment call without a single
// correct formula, so this tool doesn't fake precision it doesn't have.
// Every number this tool DOES produce (the lightness/saturation curve, and
// every contrast ratio) is exact and documented.

import {
  hslToRgb,
  rgbToHex,
  rgbToHsl,
  parseColor,
  wcagContrastRatio,
  type RGB,
} from "./colorContrast";

export const PALETTE_STOPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
export type PaletteStop = (typeof PALETTE_STOPS)[number];

// Target lightness (%) per stop - monotonically decreasing, anchored near
// white at 50 and near black at 950.
export const LIGHTNESS_CURVE: Record<PaletteStop, number> = {
  50: 97,
  100: 94,
  200: 88,
  300: 79,
  400: 68,
  500: 56,
  600: 47,
  700: 39,
  800: 31,
  900: 21,
  950: 13,
};

// Multiplier applied to the base color's own saturation per stop - full
// saturation through the midtones, tapering toward the extremes so 50 and
// 950 don't read as pure gray-tinted white/black.
export const SATURATION_MULTIPLIER: Record<PaletteStop, number> = {
  50: 0.35,
  100: 0.55,
  200: 0.7,
  300: 0.85,
  400: 0.95,
  500: 1,
  600: 0.97,
  700: 0.9,
  800: 0.82,
  900: 0.72,
  950: 0.62,
};

const WHITE: RGB = { r: 255, g: 255, b: 255 };
const BLACK: RGB = { r: 0, g: 0, b: 0 };

export interface PaletteShade {
  stop: PaletteStop;
  hex: string;
  hsl: { h: number; s: number; l: number };
  contrastWithWhite: number;
  contrastWithBlack: number;
  recommendedTextColor: "white" | "black";
}

export interface Palette {
  baseHex: string;
  baseHsl: { h: number; s: number; l: number };
  shades: PaletteShade[];
}

function buildShades(baseHsl: { h: number; s: number; l: number }): PaletteShade[] {
  return PALETTE_STOPS.map((stop) => {
    const l = LIGHTNESS_CURVE[stop];
    const s = Math.min(100, baseHsl.s * SATURATION_MULTIPLIER[stop]);
    const rgb = hslToRgb(baseHsl.h, s, l);
    const contrastWithWhite = wcagContrastRatio(rgb, WHITE);
    const contrastWithBlack = wcagContrastRatio(rgb, BLACK);

    return {
      stop,
      hex: rgbToHex(rgb),
      hsl: { h: baseHsl.h, s, l },
      contrastWithWhite,
      contrastWithBlack,
      recommendedTextColor: contrastWithBlack >= contrastWithWhite ? "black" : "white",
    };
  });
}

export function generatePalette(baseColorInput: string): Palette | null {
  const baseRgb = parseColor(baseColorInput);

  if (!baseRgb) return null;

  const baseHsl = rgbToHsl(baseRgb);

  return {
    baseHex: rgbToHex(baseRgb),
    baseHsl,
    shades: buildShades(baseHsl),
  };
}

// Builds directly from the capped HSL instead of round-tripping through an
// 8-bit hex string and re-parsing it - that round trip loses enough
// precision (hex only has 256 levels per channel) that the "capped"
// saturation could drift back above the ceiling, and the hue could drift by
// a couple of degrees.
export function generateNeutralPalette(baseColorInput: string, saturationCeiling = 8): Palette | null {
  const baseRgb = parseColor(baseColorInput);

  if (!baseRgb) return null;

  const baseHsl = rgbToHsl(baseRgb);
  const cappedHsl = { h: baseHsl.h, s: Math.min(baseHsl.s, saturationCeiling), l: baseHsl.l };

  return {
    baseHex: rgbToHex(hslToRgb(cappedHsl.h, cappedHsl.s, cappedHsl.l)),
    baseHsl: cappedHsl,
    shades: buildShades(cappedHsl),
  };
}

export function shadeCssVariables(palette: Palette, prefix = "brand"): string {
  return palette.shades.map((s) => `  --${prefix}-${s.stop}: ${s.hex};`).join("\n");
}

export function shadeTailwindConfig(palette: Palette, name = "brand"): string {
  const entries = palette.shades.map((s) => `      ${s.stop}: "${s.hex}",`).join("\n");

  return `module.exports = {\n  theme: {\n    extend: {\n      colors: {\n        ${name}: {\n${entries}\n        },\n      },\n    },\n  },\n};`;
}
