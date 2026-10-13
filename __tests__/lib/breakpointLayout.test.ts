import { describe, it, expect } from "vitest";

import {
  BREAKPOINT_PRESETS,
  sortedByMinWidth,
  generateMediaQueryCss,
  generateContainerQueryCss,
  generateTailwindScreensConfig,
  activeBreakpoint,
  simplifyRatio,
  computeAspectRatioDimensions,
  Breakpoint,
} from "@/lib/breakpointLayout";

const TAILWIND = BREAKPOINT_PRESETS["Tailwind Defaults"];

describe("sortedByMinWidth", () => {
  it("sorts breakpoints ascending regardless of input order", () => {
    const shuffled: Breakpoint[] = [
      { key: "lg", label: "Large", minWidth: 1024 },
      { key: "sm", label: "Small", minWidth: 640 },
      { key: "md", label: "Medium", minWidth: 768 },
    ];

    expect(sortedByMinWidth(shuffled).map((b) => b.key)).toEqual(["sm", "md", "lg"]);
  });

  it("does not mutate the input array", () => {
    const input: Breakpoint[] = [
      { key: "lg", label: "Large", minWidth: 1024 },
      { key: "sm", label: "Small", minWidth: 640 },
    ];
    const copy = [...input];

    sortedByMinWidth(input);
    expect(input).toEqual(copy);
  });
});

describe("generateMediaQueryCss", () => {
  it("emits one CSS variable and one @media rule per breakpoint, sorted", () => {
    const css = generateMediaQueryCss(TAILWIND);

    expect(css).toContain("--breakpoint-sm: 640px;");
    expect(css).toContain("--breakpoint-2xl: 1536px;");
    expect(css).toContain("@media (min-width: 640px)");
    expect(css).toContain("@media (min-width: 1536px)");

    // sm's variable line appears before 2xl's - confirms ascending order.
    expect(css.indexOf("--breakpoint-sm")).toBeLessThan(css.indexOf("--breakpoint-2xl"));
  });
});

describe("generateContainerQueryCss", () => {
  it("uses the given container name in both the declaration and each query", () => {
    const css = generateContainerQueryCss(TAILWIND, "card");

    expect(css).toContain("container-name: card;");
    expect(css).toContain("@container card (min-width: 768px)");
  });

  it("falls back to a default name when given blank input", () => {
    const css = generateContainerQueryCss(TAILWIND, "   ");

    expect(css).toContain("container-name: component;");
  });
});

describe("generateTailwindScreensConfig", () => {
  it("emits a valid-looking screens object with px string values", () => {
    const config = generateTailwindScreensConfig(TAILWIND);

    expect(config).toContain("screens: {");
    expect(config).toContain('sm: "640px",');
    expect(config).toContain('2xl: "1536px",');
  });
});

describe("activeBreakpoint", () => {
  it("returns null below the smallest breakpoint (mobile-first default)", () => {
    expect(activeBreakpoint(320, TAILWIND)).toBeNull();
    expect(activeBreakpoint(639, TAILWIND)).toBeNull();
  });

  it("returns the exact breakpoint at its own boundary (inclusive)", () => {
    expect(activeBreakpoint(640, TAILWIND)?.key).toBe("sm");
    expect(activeBreakpoint(1536, TAILWIND)?.key).toBe("2xl");
  });

  it("returns the largest breakpoint whose minWidth is <= the given width", () => {
    expect(activeBreakpoint(1000, TAILWIND)?.key).toBe("md");
    expect(activeBreakpoint(1279, TAILWIND)?.key).toBe("lg");
    expect(activeBreakpoint(9999, TAILWIND)?.key).toBe("2xl");
  });
});

describe("simplifyRatio", () => {
  it("simplifies common resolutions to their standard named ratio", () => {
    expect(simplifyRatio(1920, 1080)).toEqual([16, 9]);
    expect(simplifyRatio(800, 600)).toEqual([4, 3]);
    expect(simplifyRatio(1000, 1000)).toEqual([1, 1]);
  });

  it("leaves an already-simplified ratio unchanged", () => {
    expect(simplifyRatio(16, 9)).toEqual([16, 9]);
  });
});

describe("computeAspectRatioDimensions", () => {
  it("computes the classic 16:9 @ 1280 width -> 720 height exactly", () => {
    const result = computeAspectRatioDimensions(16, 9, 1280);

    expect(result.height).toBe(720);
    expect(result.width).toBe(1280);
    expect(result.ratioCss).toBe("16 / 9");
  });

  it("computes a 1:1 square as equal width and height", () => {
    const result = computeAspectRatioDimensions(1, 1, 400);

    expect(result.height).toBe(400);
  });

  it("computes the padding-top percentage hack matching 16:9 -> 56.25%", () => {
    const result = computeAspectRatioDimensions(16, 9, 1280);

    expect(result.paddingTopPercent).toBeCloseTo(56.25, 2);
  });

  it("reports the simplified ratio even when given an unreduced fraction", () => {
    const result = computeAspectRatioDimensions(1920, 1080, 800);

    expect(result.simplified).toEqual([16, 9]);
  });

  it("computes 4:3 @ 800 width -> 600 height exactly", () => {
    const result = computeAspectRatioDimensions(4, 3, 800);

    expect(result.height).toBe(600);
  });
});
