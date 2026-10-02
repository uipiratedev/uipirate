import { describe, expect, it } from "vitest";

import {
  checkGridAlignment,
  computeDensityTokens,
  generateSpacingScale,
  pxToRem,
  remToPx,
  spacingScaleCssVariables,
  spacingScaleFigmaVariables,
  spacingScaleTailwindConfig,
  tailwindTokenForPx,
} from "@/lib/spacingScale";

describe("pxToRem / remToPx", () => {
  it("converts px to rem at a 16px root", () => {
    expect(pxToRem(16)).toBe(1);
    expect(pxToRem(24)).toBe(1.5);
    expect(pxToRem(8)).toBe(0.5);
  });

  it("converts rem back to px", () => {
    expect(remToPx(1)).toBe(16);
    expect(remToPx(1.5)).toBe(24);
  });

  it("round-trips through a non-default root font size", () => {
    expect(remToPx(pxToRem(20, 10), 10)).toBeCloseTo(20, 10);
  });
});

describe("tailwindTokenForPx", () => {
  it("maps known Tailwind spacing pixel values to their token", () => {
    expect(tailwindTokenForPx(16)).toBe("4");
    expect(tailwindTokenForPx(8)).toBe("2");
    expect(tailwindTokenForPx(0)).toBe("0");
  });

  it("returns null for a pixel value with no Tailwind token", () => {
    expect(tailwindTokenForPx(13)).toBeNull();
  });
});

describe("generateSpacingScale", () => {
  it("generates an 8pt scale with step*8 pixel values", () => {
    const scale = generateSpacingScale(8, 4);

    expect(scale.map((s) => s.px)).toEqual([0, 8, 16, 24, 32]);
  });

  it("generates a 4pt scale with step*4 pixel values", () => {
    const scale = generateSpacingScale(4, 4);

    expect(scale.map((s) => s.px)).toEqual([0, 4, 8, 12, 16]);
  });

  it("includes correct rem values at the default 16px root", () => {
    const scale = generateSpacingScale(8, 2);

    expect(scale[1].rem).toBe(0.5);
    expect(scale[2].rem).toBe(1);
  });

  it("returns stepCount + 1 entries (including the 0 step)", () => {
    expect(generateSpacingScale(8, 10)).toHaveLength(11);
  });
});

describe("checkGridAlignment", () => {
  it("flags an exact multiple as aligned", () => {
    const result = checkGridAlignment(16, 8);

    expect(result.isAligned).toBe(true);
    expect(result.nearest).toBe(16);
  });

  it("flags a non-multiple as unaligned and suggests both neighbors", () => {
    const result = checkGridAlignment(13, 8);

    expect(result.isAligned).toBe(false);
    expect(result.nearestDown).toBe(8);
    expect(result.nearestUp).toBe(16);
    expect(result.nearest).toBe(16);
  });

  it("picks the closer neighbor as 'nearest'", () => {
    const result = checkGridAlignment(10, 8);

    // 10 is 2 away from 8 and 6 away from 16
    expect(result.nearest).toBe(8);
  });

  it("handles 0 as always aligned", () => {
    expect(checkGridAlignment(0, 8).isAligned).toBe(true);
  });
});

describe("computeDensityTokens", () => {
  it("computes compact tokens as multiples of the 8pt base unit", () => {
    const tokens = computeDensityTokens("compact", 8);

    expect(tokens.paddingX).toBe(24);
    expect(tokens.paddingY).toBe(12);
    expect(tokens.gap).toBe(8);
  });

  it("computes spacious tokens larger than comfortable, larger than compact", () => {
    const compact = computeDensityTokens("compact", 8);
    const comfortable = computeDensityTokens("comfortable", 8);
    const spacious = computeDensityTokens("spacious", 8);

    expect(compact.paddingX).toBeLessThan(comfortable.paddingX);
    expect(comfortable.paddingX).toBeLessThan(spacious.paddingX);
    expect(compact.paddingY).toBeLessThan(comfortable.paddingY);
    expect(comfortable.paddingY).toBeLessThan(spacious.paddingY);
  });

  it("scales down proportionally for a 4pt base unit", () => {
    const tokens = computeDensityTokens("compact", 4);

    expect(tokens.paddingX).toBe(12);
    expect(tokens.gap).toBe(4);
  });
});

describe("export formats", () => {
  it("formats CSS custom properties for every step", () => {
    const scale = generateSpacingScale(8, 3);
    const css = spacingScaleCssVariables(scale, "space");

    expect(css).toContain("--space-0: 0px;");
    expect(css).toContain("--space-3: 24px;");
  });

  it("formats a Tailwind spacing config, skipping the 0 step", () => {
    const scale = generateSpacingScale(8, 2);
    const config = spacingScaleTailwindConfig(scale);

    expect(config).toContain("spacing:");
    expect(config).not.toContain("0: \"0rem\"");
    expect(config).toContain('1: "0.5rem"');
  });

  it("formats valid JSON for Figma variables", () => {
    const scale = generateSpacingScale(8, 2);
    const json = spacingScaleFigmaVariables(scale, "space");

    expect(() => JSON.parse(json)).not.toThrow();

    const parsed = JSON.parse(json);

    expect(parsed.figmaVariables["space/1"].value).toBe(8);
  });
});
