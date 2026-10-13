import { describe, expect, it } from "vitest";

import {
  apcaContrast,
  compareContrast,
  evaluateApca,
  evaluateWcag,
  hslToRgb,
  parseColor,
  rgbToHex,
  rgbToHsl,
  wcagContrastRatio,
  wcagRelativeLuminance,
} from "@/lib/colorContrast";

const BLACK = { r: 0, g: 0, b: 0 };
const WHITE = { r: 255, g: 255, b: 255 };

describe("parseColor", () => {
  it("parses 6-digit hex", () => {
    expect(parseColor("#ff0000")).toEqual({ r: 255, g: 0, b: 0 });
  });

  it("parses 3-digit hex shorthand", () => {
    expect(parseColor("#f00")).toEqual({ r: 255, g: 0, b: 0 });
  });

  it("parses hex without a leading #", () => {
    expect(parseColor("00ff00")).toEqual({ r: 0, g: 255, b: 0 });
  });

  it("parses rgb()", () => {
    expect(parseColor("rgb(10, 20, 30)")).toEqual({ r: 10, g: 20, b: 30 });
  });

  it("parses rgba() and ignores alpha", () => {
    expect(parseColor("rgba(10, 20, 30, 0.5)")).toEqual({ r: 10, g: 20, b: 30 });
  });

  it("parses hsl() red", () => {
    expect(parseColor("hsl(0, 100%, 50%)")).toEqual({ r: 255, g: 0, b: 0 });
  });

  it("returns null for garbage input", () => {
    expect(parseColor("not-a-color")).toBeNull();
  });
});

describe("hslToRgb / rgbToHsl round trip", () => {
  it("converts pure red both ways", () => {
    expect(hslToRgb(0, 100, 50)).toEqual({ r: 255, g: 0, b: 0 });
    expect(rgbToHsl({ r: 255, g: 0, b: 0 })).toEqual({ h: 0, s: 100, l: 50 });
  });

  it("converts pure white both ways", () => {
    expect(hslToRgb(0, 0, 100)).toEqual({ r: 255, g: 255, b: 255 });

    const hsl = rgbToHsl({ r: 255, g: 255, b: 255 });

    expect(hsl.l).toBe(100);
    expect(hsl.s).toBe(0);
  });
});

describe("rgbToHex", () => {
  it("formats as lowercase 6-digit hex", () => {
    expect(rgbToHex({ r: 255, g: 91, b: 4 })).toBe("#ff5b04");
  });
});

describe("WCAG contrast", () => {
  it("gives black-on-white a relative luminance of 0 and 1", () => {
    expect(wcagRelativeLuminance(BLACK)).toBe(0);
    expect(wcagRelativeLuminance(WHITE)).toBe(1);
  });

  it("computes the textbook maximum ratio of 21:1 for black on white", () => {
    expect(wcagContrastRatio(BLACK, WHITE)).toBeCloseTo(21, 5);
  });

  it("computes a ratio of 1:1 for identical colors", () => {
    const gray = { r: 128, g: 128, b: 128 };

    expect(wcagContrastRatio(gray, gray)).toBeCloseTo(1, 5);
  });

  it("is symmetric regardless of argument order", () => {
    const a = { r: 30, g: 144, b: 255 };
    const b = { r: 255, g: 255, b: 255 };

    expect(wcagContrastRatio(a, b)).toBeCloseTo(wcagContrastRatio(b, a), 10);
  });

  it("passes AA normal text but fails AAA at a 4.5-5:1 ratio", () => {
    // #767676 on white is a commonly cited "just barely passes AA" gray.
    const verdict = evaluateWcag(wcagContrastRatio({ r: 0x76, g: 0x76, b: 0x76 }, WHITE));

    expect(verdict.ratio).toBeGreaterThanOrEqual(4.5);
    expect(verdict.aaNormal).toBe(true);
    expect(verdict.aaaNormal).toBe(false);
  });

  it("flags 21:1 as passing every level", () => {
    const verdict = evaluateWcag(21);

    expect(verdict.aaNormal).toBe(true);
    expect(verdict.aaaNormal).toBe(true);
    expect(verdict.aaLarge).toBe(true);
    expect(verdict.aaaLarge).toBe(true);
  });
});

describe("APCA contrast", () => {
  it("matches the published reference value for black text on white (~106)", () => {
    expect(apcaContrast(BLACK, WHITE)).toBeCloseTo(106.04, 0);
  });

  it("matches the published reference value for white text on black (~-107.9)", () => {
    expect(apcaContrast(WHITE, BLACK)).toBeCloseTo(-107.88, 0);
  });

  it("returns 0 for identical colors (no delta)", () => {
    const gray = { r: 128, g: 128, b: 128 };

    expect(apcaContrast(gray, gray)).toBe(0);
  });

  it("returns a positive Lc for dark text on a light background", () => {
    const lc = apcaContrast({ r: 20, g: 20, b: 20 }, { r: 240, g: 240, b: 240 });

    expect(lc).toBeGreaterThan(0);
  });

  it("returns a negative Lc for light text on a dark background", () => {
    const lc = apcaContrast({ r: 240, g: 240, b: 240 }, { r: 20, g: 20, b: 20 });

    expect(lc).toBeLessThan(0);
  });

  it("is not symmetric under argument swap (polarity matters)", () => {
    const lcForward = apcaContrast({ r: 100, g: 100, b: 100 }, WHITE);
    const lcBackward = apcaContrast(WHITE, { r: 100, g: 100, b: 100 });

    expect(Math.abs(lcForward)).not.toBeCloseTo(Math.abs(lcBackward), 1);
  });

  it("categorizes Lc 106 as usable for body text at any reasonable size", () => {
    const verdict = evaluateApca(106);

    expect(verdict.absLc).toBeGreaterThanOrEqual(90);
    expect(verdict.polarity).toBe("text-on-light");
  });

  it("categorizes a low Lc as not usable for text", () => {
    const verdict = evaluateApca(12);

    expect(verdict.recommendedUse).toMatch(/not usable/i);
  });
});

describe("compareContrast", () => {
  it("returns both WCAG and APCA verdicts for the same color pair", () => {
    const result = compareContrast(BLACK, WHITE);

    expect(result.wcag.ratio).toBeCloseTo(21, 5);
    expect(result.apca.lc).toBeCloseTo(106.04, 0);
  });
});
