import { describe, expect, it } from "vitest";

import {
  USAGE_TAGS,
  channelConversion,
  landingConversion,
  isTestSession,
  sectionOf,
} from "@/lib/analytics/funnel";

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

describe("sectionOf", () => {
  it("separates the component lab from tools", () => {
    expect(sectionOf("/componentlab/tactile-pill-button")).toBe("componentlab");
    expect(sectionOf("/tools/design/css-shadow-generator")).toBe("tools");
  });
});

describe("USAGE_TAGS", () => {
  // Tool pages are operated through fields as much as buttons; counting only
  // buttons made real tools look unused.
  it("counts form fields as using a page", () => {
    for (const t of ["button", "input", "select", "textarea"])
      expect(USAGE_TAGS).toContain(t);
  });

  it("does not count links, which are navigation", () => {
    expect(USAGE_TAGS).not.toContain("a");
  });
});

describe("isTestSession", () => {
  it("flags a session that arrived from localhost", () => {
    expect(isTestSession({ sessionId: "a", referrer: "http://localhost:3000/" })).toBe(true);
    expect(isTestSession({ sessionId: "a", referrer: "http://127.0.0.1:3000" })).toBe(true);
  });

  it("flags a session whose entry path was stored as a localhost url", () => {
    expect(
      isTestSession({ sessionId: "a", entryPath: "http://localhost:3000/contact" }),
    ).toBe(true);
  });

  it("keeps real visitors", () => {
    expect(isTestSession({ sessionId: "a", referrer: "https://www.reddit.com/" })).toBe(false);
    expect(isTestSession({ sessionId: "a", entryPath: "/contact" })).toBe(false);
    expect(isTestSession({ sessionId: "a" })).toBe(false);
  });

  it("does not match a look-alike host", () => {
    expect(isTestSession({ sessionId: "a", referrer: "https://localhost.evil.com/" })).toBe(false);
  });
});
