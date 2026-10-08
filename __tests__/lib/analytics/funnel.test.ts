import { describe, expect, it } from "vitest";

import { channelConversion, landingConversion } from "@/lib/analytics/funnel";

const s = (id: string, entryPath: string, referrerType = "direct") => ({
  sessionId: id,
  entryPath,
  referrerType,
});

describe("landingConversion", () => {
  const sessions = [
    s("a", "/"),
    s("b", "/"),
    s("c", "/"),
    s("d", "/"),
    s("e", "/pricing"),
    s("f", "/pricing"),
    s("g", "/pricing"),
    s("h", "/about"),
  ];

  it("computes the rate per landing page", () => {
    const rows = landingConversion(sessions, new Set(["a", "e", "f"]));

    expect(rows.find((r) => r.path === "/")).toMatchObject({
      sessions: 4,
      converted: 1,
      rate: 0.25,
    });
    expect(rows.find((r) => r.path === "/pricing")).toMatchObject({
      sessions: 3,
      converted: 2,
    });
  });

  it("sorts best-converting first", () => {
    const rows = landingConversion(sessions, new Set(["a", "e", "f"]));

    expect(rows[0].path).toBe("/pricing");
  });

  it("drops pages below the minimum sample", () => {
    // /about has one session — a 100% rate from n=1 would be noise.
    const rows = landingConversion(sessions, new Set(["h"]));

    expect(rows.find((r) => r.path === "/about")).toBeUndefined();
  });

  it("treats a missing entry path as the homepage", () => {
    const rows = landingConversion(
      [
        { sessionId: "x" },
        { sessionId: "y", entryPath: null },
        { sessionId: "z", entryPath: "/" },
      ],
      new Set(),
    );

    expect(rows).toEqual([
      { path: "/", sessions: 3, converted: 0, rate: 0 },
    ]);
  });

  it("is empty when there are no sessions", () => {
    expect(landingConversion([], new Set())).toEqual([]);
  });
});

describe("channelConversion", () => {
  it("groups by channel and defaults a missing one to direct", () => {
    const rows = channelConversion(
      [
        s("a", "/", "social"),
        s("b", "/", "social"),
        s("c", "/", "direct"),
        { sessionId: "d" },
      ],
      new Set(["a", "d"]),
    );

    expect(rows.find((r) => r.channel === "social")).toMatchObject({
      sessions: 2,
      converted: 1,
      rate: 0.5,
    });
    expect(rows.find((r) => r.channel === "direct")).toMatchObject({
      sessions: 2,
      converted: 1,
    });
  });

  it("orders by volume", () => {
    const rows = channelConversion(
      [s("a", "/", "ai"), s("b", "/", "direct"), s("c", "/", "direct")],
      new Set(),
    );

    expect(rows[0].channel).toBe("direct");
  });
});
