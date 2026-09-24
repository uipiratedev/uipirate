import { describe, it, expect } from "vitest";

import {
  smoothingToExponent,
  clampRadius,
  topLeftCorner,
  topRightCorner,
  bottomRightCorner,
  bottomLeftCorner,
  generateSquirclePoints,
  pointsToSvgPath,
  generateSquirclePath,
} from "@/lib/squircle";

function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

// Math.cos(Math.PI / 2) isn't exactly 0 in floating point, so endpoint
// coordinates land a few epsilons off their ideal value - compare loosely.
function expectPointClose(
  actual: { x: number; y: number },
  expected: { x: number; y: number },
) {
  expect(actual.x).toBeCloseTo(expected.x, 5);
  expect(actual.y).toBeCloseTo(expected.y, 5);
}

describe("smoothingToExponent", () => {
  it("maps 0 -> 2 (a plain circular corner)", () => {
    expect(smoothingToExponent(0)).toBe(2);
  });

  it("maps 100 -> 8 (maximum squircle)", () => {
    expect(smoothingToExponent(100)).toBe(8);
  });

  it("maps 50 -> 5 (the commonly-cited iOS approximation)", () => {
    expect(smoothingToExponent(50)).toBe(5);
  });

  it("clamps out-of-range input", () => {
    expect(smoothingToExponent(-20)).toBe(2);
    expect(smoothingToExponent(150)).toBe(8);
  });
});

describe("clampRadius", () => {
  it("passes through a radius that fits", () => {
    expect(clampRadius(200, 200, 20)).toBe(20);
  });

  it("clamps to half the smaller dimension (pill/circle case)", () => {
    expect(clampRadius(200, 100, 999)).toBe(50);
    expect(clampRadius(100, 200, 999)).toBe(50);
  });
});

describe("corner geometry at n=2 (must exactly match a circular rounded corner)", () => {
  const w = 100;
  const h = 100;
  const r = 20;
  const n = 2; // smoothing = 0
  const steps = 16;

  it("top-left corner stays exactly r from its circular center (r, r)", () => {
    const center = { x: r, y: r };
    const points = topLeftCorner(w, h, r, n, steps);

    points.forEach((p) => expect(dist(p, center)).toBeCloseTo(r, 5));
  });

  it("top-right corner stays exactly r from its circular center (w-r, r)", () => {
    const center = { x: w - r, y: r };
    const points = topRightCorner(w, h, r, n, steps);

    points.forEach((p) => expect(dist(p, center)).toBeCloseTo(r, 5));
  });

  it("bottom-right corner stays exactly r from its circular center (w-r, h-r)", () => {
    const center = { x: w - r, y: h - r };
    const points = bottomRightCorner(w, h, r, n, steps);

    points.forEach((p) => expect(dist(p, center)).toBeCloseTo(r, 5));
  });

  it("bottom-left corner stays exactly r from its circular center (r, h-r)", () => {
    const center = { x: r, y: h - r };
    const points = bottomLeftCorner(w, h, r, n, steps);

    points.forEach((p) => expect(dist(p, center)).toBeCloseTo(r, 5));
  });

  it("consecutive corners share the correct tangent points on each straight edge", () => {
    const tl = topLeftCorner(w, h, r, n, steps);
    const tr = topRightCorner(w, h, r, n, steps);
    const br = bottomRightCorner(w, h, r, n, steps);
    const bl = bottomLeftCorner(w, h, r, n, steps);

    // TL exits onto the top edge at (r, 0); TR enters the top edge at (w-r, 0).
    expectPointClose(tl[tl.length - 1], { x: r, y: 0 });
    expectPointClose(tr[0], { x: w - r, y: 0 });

    // TR exits onto the right edge at (w, r); BR enters at (w, h-r).
    expectPointClose(tr[tr.length - 1], { x: w, y: r });
    expectPointClose(br[0], { x: w, y: h - r });

    // BR exits onto the bottom edge at (w-r, h); BL enters at (r, h).
    expectPointClose(br[br.length - 1], { x: w - r, y: h });
    expectPointClose(bl[0], { x: r, y: h });

    // BL exits onto the left edge at (0, h-r); TL enters (its first point) at (0, r).
    expectPointClose(bl[bl.length - 1], { x: 0, y: h - r });
    expectPointClose(tl[0], { x: 0, y: r });
  });
});

describe("superellipse bulge at higher smoothing", () => {
  it("at n>2, the 45° corner point moves toward the sharp rectangle corner (squarer look)", () => {
    const w = 100;
    const h = 100;
    const r = 20;
    const steps = 2; // theta = 0, pi/4, pi/2 - we want the pi/4 midpoint
    const center = { x: r, y: r };
    const sharpCorner = { x: 0, y: 0 };

    const circle = topLeftCorner(w, h, r, 2, steps)[1];
    const squircle = topLeftCorner(w, h, r, 8, steps)[1];

    expect(dist(circle, center)).toBeCloseTo(r, 5);
    // Higher n extends the curve further from its circular-arc center...
    expect(dist(squircle, center)).toBeGreaterThan(r);
    // ...which is exactly what pulls it closer to the sharp (0,0) corner,
    // hugging the straight edges longer before cutting the corner. That's
    // the visible "squircle" signature this whole module exists to produce.
    expect(dist(squircle, sharpCorner)).toBeLessThan(dist(circle, sharpCorner));
  });
});

describe("generateSquirclePoints / pointsToSvgPath / generateSquirclePath", () => {
  it("produces 4 * (steps+1) points for a symmetric shape", () => {
    const points = generateSquirclePoints({ width: 200, height: 200, radius: 24, smoothing: 40, steps: 10 });

    expect(points).toHaveLength(4 * 11);
  });

  it("clamps radius so a squircle never exceeds the shape bounds", () => {
    const points = generateSquirclePoints({ width: 100, height: 60, radius: 500, smoothing: 0 });

    points.forEach((p) => {
      expect(p.x).toBeGreaterThanOrEqual(-0.01);
      expect(p.x).toBeLessThanOrEqual(100.01);
      expect(p.y).toBeGreaterThanOrEqual(-0.01);
      expect(p.y).toBeLessThanOrEqual(60.01);
    });
  });

  it("builds a valid closed SVG path string", () => {
    const path = generateSquirclePath({ width: 200, height: 200, radius: 24, smoothing: 60, steps: 8 });

    expect(path.startsWith("M ")).toBe(true);
    expect(path.endsWith(" Z")).toBe(true);
    expect(path.match(/L /g)?.length).toBe(4 * 9 - 1);
  });

  it("returns an empty string for no points", () => {
    expect(pointsToSvgPath([])).toBe("");
  });
});
