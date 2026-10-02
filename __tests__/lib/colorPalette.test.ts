import { describe, expect, it } from "vitest";

import {
  generateNeutralPalette,
  generatePalette,
  PALETTE_STOPS,
  shadeCssVariables,
  shadeTailwindConfig,
} from "@/lib/colorPalette";

describe("generatePalette", () => {
  it("returns null for an unparseable color", () => {
    expect(generatePalette("not-a-color")).toBeNull();
  });

  it("returns exactly 11 shades in stop order", () => {
    const palette = generatePalette("#FF5B04");

    expect(palette).not.toBeNull();
    expect(palette!.shades.map((s) => s.stop)).toEqual([...PALETTE_STOPS]);
  });

  it("produces monotonically decreasing lightness from 50 to 950", () => {
    const palette = generatePalette("#3B82F6")!;
    const lightnesses = palette.shades.map((s) => s.hsl.l);

    for (let i = 1; i < lightnesses.length; i++) {
      expect(lightnesses[i]).toBeLessThan(lightnesses[i - 1]);
    }
  });

  it("keeps hue constant across every step", () => {
    const palette = generatePalette("#10B981")!;
    const hues = palette.shades.map((s) => Math.round(s.hsl.h));

    for (const h of hues) expect(h).toBe(Math.round(palette.baseHsl.h));
  });

  it("produces valid 6-digit lowercase hex for every shade", () => {
    const palette = generatePalette("#7C3AED")!;

    for (const shade of palette.shades) {
      expect(shade.hex).toMatch(/^#[0-9a-f]{6}$/);
    }
  });

  it("recommends black text for the lightest stop and white text for the darkest stop", () => {
    const palette = generatePalette("#FF5B04")!;
    const lightest = palette.shades.find((s) => s.stop === 50)!;
    const darkest = palette.shades.find((s) => s.stop === 950)!;

    expect(lightest.recommendedTextColor).toBe("black");
    expect(darkest.recommendedTextColor).toBe("white");
  });

  it("always recommends the text color with the higher WCAG contrast ratio", () => {
    const palette = generatePalette("#EAB308")!;

    for (const shade of palette.shades) {
      const expected = shade.contrastWithBlack >= shade.contrastWithWhite ? "black" : "white";

      expect(shade.recommendedTextColor).toBe(expected);
    }
  });

  it("accepts rgb() and hsl() input, not just hex", () => {
    expect(generatePalette("rgb(255, 91, 4)")).not.toBeNull();
    expect(generatePalette("hsl(20, 100%, 51%)")).not.toBeNull();
  });
});

describe("generateNeutralPalette", () => {
  it("caps saturation so the ramp reads as gray, not tinted", () => {
    const neutral = generateNeutralPalette("#FF5B04", 8)!;

    for (const shade of neutral.shades) {
      expect(shade.hsl.s).toBeLessThanOrEqual(8);
    }
  });

  it("preserves the base hue even while desaturating", () => {
    const base = generatePalette("#3B82F6")!;
    const neutral = generateNeutralPalette("#3B82F6", 8)!;

    expect(Math.round(neutral.baseHsl.h)).toBe(Math.round(base.baseHsl.h));
  });
});

describe("export formats", () => {
  it("formats CSS custom properties for every stop", () => {
    const palette = generatePalette("#FF5B04")!;
    const css = shadeCssVariables(palette, "brand");

    for (const stop of PALETTE_STOPS) {
      expect(css).toContain(`--brand-${stop}:`);
    }
  });

  it("formats a valid-looking Tailwind config snippet", () => {
    const palette = generatePalette("#FF5B04")!;
    const config = shadeTailwindConfig(palette, "brand");

    expect(config).toContain("colors:");
    expect(config).toContain("brand:");
    expect(config).toContain(`500: "${palette.shades.find((s) => s.stop === 500)!.hex}"`);
  });
});
