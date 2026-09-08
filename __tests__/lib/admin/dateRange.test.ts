import { describe, it, expect } from "vitest";

import {
  rangeFromPreset,
  granularityFor,
  parseRangeParams,
} from "@/lib/admin/dateRange";

describe("rangeFromPreset", () => {
  it("28d spans 28 days ending now", () => {
    const now = Date.UTC(2026, 0, 29);
    const r = rangeFromPreset("28d", now);

    expect(new Date(r.to).valueOf()).toBe(now);
    expect(new Date(r.from).valueOf()).toBe(now - 28 * 86_400_000);
    expect(r.preset).toBe("28d");
  });
});

describe("granularityFor", () => {
  it("maps presets to sensible buckets", () => {
    expect(granularityFor("24h")).toBe("hour");
    expect(granularityFor("7d")).toBe("day");
    expect(granularityFor("28d")).toBe("day");
    expect(granularityFor("90d")).toBe("week");
    expect(granularityFor("12m")).toBe("month");
  });
});

describe("parseRangeParams", () => {
  it("uses explicit from/to when valid", () => {
    const sp = new URLSearchParams({
      from: "2026-01-01T00:00:00.000Z",
      to: "2026-01-15T00:00:00.000Z",
      preset: "7d",
    });
    const r = parseRangeParams(sp);

    expect(r.from.toISOString()).toBe("2026-01-01T00:00:00.000Z");
    expect(r.to.toISOString()).toBe("2026-01-15T00:00:00.000Z");
    expect(r.preset).toBe("7d");
  });

  it("falls back to 28d when the range is inverted or unparseable", () => {
    const sp = new URLSearchParams({ from: "later", to: "earlier" });
    const r = parseRangeParams(sp);

    expect(r.preset).toBe("28d");
    expect(r.from.valueOf()).toBeLessThan(r.to.valueOf());
  });

  it("defaults to 28d with no params", () => {
    expect(parseRangeParams(new URLSearchParams()).preset).toBe("28d");
  });
});
