// Layered box-shadow generator.
//
// A single CSS box-shadow has one blur radius, so its edge fades at a
// constant rate - it always looks slightly "muddy" or artificial. Real
// shadows don't: light sources aren't points, so the penumbra (soft edge)
// spreads out and fades faster than the umbra (dark core) grows. Stacking
// several box-shadow layers - offset/blur growing while opacity shrinks,
// each step following an easing curve rather than a straight line - lets a
// handful of CSS values approximate that falloff.

export type ShadowEasing = "linear" | "ease-out" | "ease-in";

export interface ShadowConfig {
  layers: number;
  angle: number; // degrees clockwise from top: 0=shadow up, 90=right, 180=down, 270=left
  distance: number; // px, offset of the farthest (softest) layer
  blurRatio: number; // blur = offset distance * blurRatio
  spread: number; // px, spread of the farthest layer (can be negative)
  opacity: number; // 0-1, opacity of the closest (sharpest) layer
  color: string; // hex color, e.g. "#000000"
  easing: ShadowEasing;
  inset: boolean;
}

export interface ShadowLayer {
  x: number;
  y: number;
  blur: number;
  spread: number;
  opacity: number;
  rgba: string;
}

export interface ElevationLevel {
  key: string;
  label: string;
  scale: number;
}

export interface ElevationResult extends ElevationLevel {
  layers: ShadowLayer[];
  cssValue: string;
  cssPretty: string;
  tailwindValue: string;
}

export const ELEVATION_LEVELS: ElevationLevel[] = [
  { key: "xs", label: "XS", scale: 0.4 },
  { key: "sm", label: "SM", scale: 0.65 },
  { key: "md", label: "MD", scale: 1 },
  { key: "lg", label: "LG", scale: 1.6 },
  { key: "xl", label: "XL", scale: 2.4 },
  { key: "2xl", label: "2XL", scale: 3.4 },
];

export const SHADOW_PRESETS: Record<string, ShadowConfig> = {
  "Subtle Card": {
    layers: 4,
    angle: 180,
    distance: 16,
    blurRatio: 1.4,
    spread: -2,
    opacity: 0.16,
    color: "#0F172A",
    easing: "ease-out",
    inset: false,
  },
  "Raised Button": {
    layers: 3,
    angle: 180,
    distance: 10,
    blurRatio: 1.2,
    spread: -1,
    opacity: 0.24,
    color: "#0F172A",
    easing: "linear",
    inset: false,
  },
  "Modal / Dialog": {
    layers: 5,
    angle: 180,
    distance: 36,
    blurRatio: 1.6,
    spread: -4,
    opacity: 0.28,
    color: "#020617",
    easing: "ease-out",
    inset: false,
  },
  "Dramatic Hero": {
    layers: 6,
    angle: 150,
    distance: 60,
    blurRatio: 1.1,
    spread: -6,
    opacity: 0.38,
    color: "#020617",
    easing: "ease-in",
    inset: false,
  },
};

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleaned = hex.trim().replace(/^#/, "");

  if (/^[0-9a-f]{3}$/i.test(cleaned)) {
    const r = parseInt(cleaned[0] + cleaned[0], 16);
    const g = parseInt(cleaned[1] + cleaned[1], 16);
    const b = parseInt(cleaned[2] + cleaned[2], 16);

    return { r, g, b };
  }
  if (/^[0-9a-f]{6}$/i.test(cleaned)) {
    return {
      r: parseInt(cleaned.slice(0, 2), 16),
      g: parseInt(cleaned.slice(2, 4), 16),
      b: parseInt(cleaned.slice(4, 6), 16),
    };
  }

  return null;
}

export function applyEasing(t: number, easing: ShadowEasing): number {
  if (easing === "ease-out") return 1 - Math.pow(1 - t, 2);
  if (easing === "ease-in") return Math.pow(t, 2);

  return t;
}

export function generateLayers(config: ShadowConfig): ShadowLayer[] {
  const rgb = hexToRgb(config.color) ?? { r: 0, g: 0, b: 0 };
  const angleRad = (config.angle * Math.PI) / 180;
  const layers: ShadowLayer[] = [];
  const count = Math.max(1, Math.round(config.layers));

  for (let i = 1; i <= count; i++) {
    const t = i / count;
    const eased = applyEasing(t, config.easing);
    const offsetDist = config.distance * eased;
    const x = Math.round(offsetDist * Math.sin(angleRad));
    const y = Math.round(-offsetDist * Math.cos(angleRad));
    const blur = Math.round(Math.max(0, offsetDist * config.blurRatio));
    const spread = Math.round(config.spread * eased);
    const opacity = Math.max(
      0.02,
      Math.round(config.opacity * (1 - eased * 0.75) * 1000) / 1000,
    );

    layers.push({
      x,
      y,
      blur,
      spread,
      opacity,
      rgba: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`,
    });
  }

  return layers;
}

function layerToCss(layer: ShadowLayer): string {
  return `${layer.x}px ${layer.y}px ${layer.blur}px ${layer.spread}px ${layer.rgba}`;
}

export function formatCssValue(layers: ShadowLayer[], inset: boolean): string {
  const prefix = inset ? "inset " : "";

  return layers.map((l) => `${prefix}${layerToCss(l)}`).join(", ");
}

export function formatCssPretty(layers: ShadowLayer[], inset: boolean): string {
  const prefix = inset ? "inset " : "";

  return layers.map((l) => `  ${prefix}${layerToCss(l)}`).join(",\n");
}

export function formatTailwindValue(layers: ShadowLayer[], inset: boolean): string {
  const prefix = inset ? "inset_" : "";

  return layers
    .map((l) => `${prefix}${layerToCss(l).replace(/\s+/g, "_")}`)
    .join(",");
}

export function generateElevationScale(base: ShadowConfig): ElevationResult[] {
  return ELEVATION_LEVELS.map((level) => {
    const scaledConfig: ShadowConfig = {
      ...base,
      distance: base.distance * level.scale,
      spread: base.spread * level.scale,
    };
    const layers = generateLayers(scaledConfig);

    return {
      ...level,
      layers,
      cssValue: formatCssValue(layers, base.inset),
      cssPretty: formatCssPretty(layers, base.inset),
      tailwindValue: formatTailwindValue(layers, base.inset),
    };
  });
}
