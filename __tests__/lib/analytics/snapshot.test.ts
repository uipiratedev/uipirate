import { describe, expect, it } from "vitest";

import { lastCompleteWeek } from "@/lib/analytics/snapshot";

const at = (s: string) => new Date(`${s}Z`);

describe("lastCompleteWeek", () => {
  it("on a Monday returns the week that ended yesterday", () => {
    // 2026-10-05 is a Monday.
    const w = lastCompleteWeek(at("2026-10-05T04:00:00"));

    expect(w.weekStart).toBe("2026-09-28");
    expect(w.weekEnd).toBe("2026-10-04");
  });

  it("mid-week still returns the previous complete week", () => {
    // Thursday 2026-10-08: the current week is incomplete.
    const w = lastCompleteWeek(at("2026-10-08T12:00:00"));

    expect(w.weekStart).toBe("2026-09-28");
    expect(w.weekEnd).toBe("2026-10-04");
  });

  it("on a Sunday does not include the day still in progress", () => {
    // Sunday 2026-10-11: that Sunday has not finished.
    const w = lastCompleteWeek(at("2026-10-11T23:59:00"));

    expect(w.weekStart).toBe("2026-09-28");
    expect(w.weekEnd).toBe("2026-10-04");
  });

  it("spans exactly seven days, Monday to Sunday", () => {
    const w = lastCompleteWeek(at("2026-10-08T12:00:00"));

    expect(w.from.getUTCDay()).toBe(1); // Monday
    expect(w.to.getUTCDay()).toBe(0); // Sunday
    expect(Math.round((w.to.valueOf() - w.from.valueOf()) / 86_400_000)).toBe(7);
  });

  it("crosses a year boundary", () => {
    // Monday 2027-01-04 → week of Mon 2026-12-28 … Sun 2027-01-03.
    const w = lastCompleteWeek(at("2027-01-04T04:00:00"));

    expect(w.weekStart).toBe("2026-12-28");
    expect(w.weekEnd).toBe("2027-01-03");
  });
});
