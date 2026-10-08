import { describe, expect, it } from "vitest";

import { flagRow } from "@/lib/analytics/contentPerformance";

const base = {
  hits: 0,
  impressions: 0,
  clicks: 0,
  ctr: 0,
  position: null as number | null,
  indexed: null as boolean | null,
};

describe("flagRow", () => {
  it("flags the design-tokens case: real traffic, not indexed", () => {
    // The page that prompted this whole feature — ~229 visits, no index.
    expect(
      flagRow({ ...base, hits: 229, indexed: false }),
    ).toContain("traffic-not-indexed");
  });

  it("does not flag low-traffic unindexed pages", () => {
    // Below the threshold: a new page not yet indexed is normal, not a problem.
    expect(flagRow({ ...base, hits: 10, indexed: false })).not.toContain(
      "traffic-not-indexed",
    );
  });

  it("does not flag unindexed when index status is unknown", () => {
    expect(flagRow({ ...base, hits: 500, indexed: null })).toEqual([]);
  });

  it("flags page-one rankings that nobody clicks", () => {
    expect(
      flagRow({
        ...base,
        impressions: 26,
        clicks: 0,
        ctr: 0,
        position: 3.46,
        indexed: true,
      }),
    ).toContain("ranks-low-ctr");
  });

  it("does not flag low CTR when the page ranks poorly", () => {
    // Position 40 with a low CTR is expected, not a title problem.
    expect(
      flagRow({ ...base, impressions: 50, clicks: 0, position: 40 }),
    ).not.toContain("ranks-low-ctr");
  });

  it("flags impressions with no clicks", () => {
    expect(
      flagRow({ ...base, impressions: 14, clicks: 0, position: 30 }),
    ).toContain("impressions-no-clicks");
  });

  it("flags indexed pages nobody visits", () => {
    expect(flagRow({ ...base, hits: 1, indexed: true })).toContain(
      "indexed-no-traffic",
    );
  });

  it("leaves a healthy page unflagged", () => {
    expect(
      flagRow({
        ...base,
        hits: 235,
        impressions: 113,
        clicks: 22,
        ctr: 0.195,
        position: 4.5,
        indexed: true,
      }),
    ).toEqual([]);
  });

  it("orders the most urgent flag first", () => {
    const flags = flagRow({
      ...base,
      hits: 200,
      impressions: 20,
      clicks: 0,
      ctr: 0,
      position: 5,
      indexed: false,
    });

    expect(flags[0]).toBe("traffic-not-indexed");
  });
});
