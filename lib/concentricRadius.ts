// Concentric (nested) border-radius math.
//
// When a rounded container has padding and a rounded child sits flush against
// its edges, using the SAME radius for both looks pinched: the inner corner's
// arc is tighter relative to the (smaller) space it has to curve within, so it
// visually crowds the outer curve instead of running parallel to it. The fix
// is simple geometry - the inner radius must shrink by exactly the padding so
// both arcs share the same center point: innerRadius = outerRadius - padding.

export interface RadiusLevel {
  key: string;
  label: string;
  scale: number;
}

export interface ConcentricConfig {
  baseOuter: number;
  padding: number;
}

export interface RadiusScaleResult extends RadiusLevel {
  outer: number;
  inner: number;
}

export const RADIUS_LEVELS: RadiusLevel[] = [
  { key: "xs", label: "XS", scale: 0.4 },
  { key: "sm", label: "SM", scale: 0.65 },
  { key: "md", label: "MD", scale: 1 },
  { key: "lg", label: "LG", scale: 1.6 },
  { key: "xl", label: "XL", scale: 2.2 },
  { key: "2xl", label: "2XL", scale: 3 },
];

export function computeInnerRadius(outer: number, padding: number): number {
  return Math.max(0, Math.round((outer - padding) * 100) / 100);
}

export function generateRadiusScale(config: ConcentricConfig): RadiusScaleResult[] {
  return RADIUS_LEVELS.map((level) => {
    const outer = Math.round(config.baseOuter * level.scale * 10) / 10;
    const inner = computeInnerRadius(outer, config.padding);

    return { ...level, outer, inner };
  });
}
