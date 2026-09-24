import { describe, it, expect } from "vitest";

import {
  hexToRgb,
  applyEasing,
  generateLayers,
  formatCssValue,
  formatCssPretty,
  formatTailwindValue,
  generateElevationScale,
  ELEVATION_LEVELS,
  ShadowConfig,
} from "@/lib/layeredShadow";

describe("hexToRgb", () => {
  it("parses 6-digit hex", () => {
    expect(hexToRgb("#FF5B04")).toEqual({ r: 255, g: 91, b: 4 });
  });

  it("parses 3-digit hex shorthand", () => {
    expect(hexToRgb("#000")).toEqual({ r: 0, g: 0, b: 0 });
  });

  it("returns null for invalid input", () => {
    expect(hexToRgb("not-a-color")).toBeNull();
  });
});

describe("applyEasing", () => {
  it("linear passes through unchanged", () => {
    expect(applyEasing(0.5, "linear")).toBe(0.5);
  });

  it("ease-out grows faster than linear early on", () => {
    expect(applyEasing(0.25, "ease-out")).toBeGreaterThan(0.25);
  });

  it("ease-in grows slower than linear early on", () => {
    expect(applyEasing(0.25, "ease-in")).toBeLessThan(0.25);
  });

  it("both eased curves meet linear at the endpoints", () => {
    expect(applyEasing(0, "ease-out")).toBeCloseTo(0);
    expect(applyEasing(1, "ease-out")).toBeCloseTo(1);
    expect(applyEasing(0, "ease-in")).toBeCloseTo(0);
    expect(applyEasing(1, "ease-in")).toBeCloseTo(1);
  });
});

const baseConfig: ShadowConfig = {
  layers: 4,
  angle: 180,
  distance: 20,
  blurRatio: 1.5,
  spread: -2,
  opacity: 0.3,
  color: "#000000",
  easing: "linear",
  inset: false,
};

describe("generateLayers", () => {
  it("produces exactly `layers` shadow layers", () => {
    expect(generateLayers(baseConfig)).toHaveLength(4);
  });

  it("angle 0 casts the shadow straight up (negative y, zero x)", () => {
    const layers = generateLayers({ ...baseConfig, angle: 0 });

    layers.forEach((l) => expect(l.x).toBe(0));
    expect(layers[layers.length - 1].y).toBeLessThan(0);
  });

  it("angle 180 casts the shadow straight down (positive y, zero x)", () => {
    const layers = generateLayers({ ...baseConfig, angle: 180 });

    layers.forEach((l) => expect(l.x).toBe(0));
    expect(layers[layers.length - 1].y).toBeGreaterThan(0);
  });

  it("angle 90 casts the shadow to the right (positive x, ~zero y)", () => {
    const layers = generateLayers({ ...baseConfig, angle: 90 });

    expect(layers[layers.length - 1].x).toBeGreaterThan(0);
    expect(layers[layers.length - 1].y).toBeCloseTo(0);
  });

  it("later layers travel farther and blur more than earlier layers (linear easing)", () => {
    const layers = generateLayers(baseConfig);
    const first = layers[0];
    const last = layers[layers.length - 1];

    expect(Math.abs(last.y)).toBeGreaterThan(Math.abs(first.y));
    expect(last.blur).toBeGreaterThan(first.blur);
  });

  it("opacity fades out for farther layers", () => {
    const layers = generateLayers(baseConfig);

    for (let i = 1; i < layers.length; i++) {
      expect(layers[i].opacity).toBeLessThanOrEqual(layers[i - 1].opacity);
    }
  });

  it("never produces negative blur even with unusual inputs", () => {
    const layers = generateLayers({ ...baseConfig, distance: -10 });

    layers.forEach((l) => expect(l.blur).toBeGreaterThanOrEqual(0));
  });
});

describe("CSS / Tailwind formatting", () => {
  it("formats a comma-separated CSS value with rgba colors", () => {
    const layers = generateLayers(baseConfig);
    const css = formatCssValue(layers, false);

    // rgba(...) itself contains ", " so count layers by their rgba() markers,
    // not by naively splitting the whole string on ", ".
    expect((css.match(/rgba\(/g) ?? []).length).toBe(4);
    expect(css).toMatch(/rgba\(0, 0, 0, 0\.\d+\)/);
  });

  it("prefixes every layer with inset when the config requests it", () => {
    const layers = generateLayers(baseConfig);
    const css = formatCssValue(layers, true);

    expect(css.startsWith("inset ")).toBe(true);
    expect((css.match(/inset /g) ?? []).length).toBe(layers.length);
  });

  it("pretty-prints one layer per line, comma at end of line", () => {
    const layers = generateLayers(baseConfig);
    const pretty = formatCssPretty(layers, false);

    expect(pretty.split("\n")).toHaveLength(4);
    expect(pretty.split("\n")[0].endsWith(",")).toBe(true);
  });

  it("Tailwind arbitrary value has no raw spaces (all underscored)", () => {
    const layers = generateLayers(baseConfig);
    const tw = formatTailwindValue(layers, false);

    expect(tw.includes(" ")).toBe(false);
    expect((tw.match(/rgba\(/g) ?? []).length).toBe(4);
  });
});

describe("generateElevationScale", () => {
  it("produces one result per elevation level, in the same order", () => {
    const scale = generateElevationScale(baseConfig);

    expect(scale.map((s) => s.key)).toEqual(ELEVATION_LEVELS.map((l) => l.key));
  });

  it("the md level (scale=1) matches the base config's own layers exactly", () => {
    const scale = generateElevationScale(baseConfig);
    const md = scale.find((s) => s.key === "md")!;
    const direct = generateLayers(baseConfig);

    expect(md.cssValue).toBe(formatCssValue(direct, baseConfig.inset));
  });

  it("larger elevation levels travel farther than smaller ones", () => {
    const scale = generateElevationScale(baseConfig);
    const xs = scale.find((s) => s.key === "xs")!;
    const xl = scale.find((s) => s.key === "xl")!;
    const xsMaxY = Math.max(...xs.layers.map((l) => Math.abs(l.y)));
    const xlMaxY = Math.max(...xl.layers.map((l) => Math.abs(l.y)));

    expect(xlMaxY).toBeGreaterThan(xsMaxY);
  });
});
