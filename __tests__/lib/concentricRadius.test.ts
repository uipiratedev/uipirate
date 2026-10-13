import { describe, it, expect } from "vitest";

import {
  computeInnerRadius,
  generateRadiusScale,
  RADIUS_LEVELS,
} from "@/lib/concentricRadius";

describe("computeInnerRadius", () => {
  it("subtracts padding from the outer radius", () => {
    expect(computeInnerRadius(24, 16)).toBe(8);
  });

  it("never goes negative when padding exceeds the outer radius", () => {
    expect(computeInnerRadius(8, 16)).toBe(0);
  });
});

describe("generateRadiusScale", () => {
  it("produces one result per level, in order", () => {
    const scale = generateRadiusScale({ baseOuter: 16, padding: 8 });

    expect(scale.map((s) => s.key)).toEqual(RADIUS_LEVELS.map((l) => l.key));
  });

  it("the md level (scale=1) matches the base outer radius exactly", () => {
    const scale = generateRadiusScale({ baseOuter: 16, padding: 8 });
    const md = scale.find((s) => s.key === "md")!;

    expect(md.outer).toBe(16);
    expect(md.inner).toBe(8);
  });

  it("larger levels have a larger outer radius than smaller ones", () => {
    const scale = generateRadiusScale({ baseOuter: 16, padding: 8 });
    const xs = scale.find((s) => s.key === "xs")!;
    const xl = scale.find((s) => s.key === "xl")!;

    expect(xl.outer).toBeGreaterThan(xs.outer);
  });

  it("clamps inner radius to 0 for small outer radii with large padding", () => {
    const scale = generateRadiusScale({ baseOuter: 10, padding: 20 });

    scale.forEach((level) => expect(level.inner).toBeGreaterThanOrEqual(0));
  });
});
