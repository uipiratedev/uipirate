import { describe, it, expect } from "vitest";

import {
  parseDevice,
  classifyReferrer,
  cleanPath,
  clampText,
  clickKind,
  extractUtm,
  referrerLabel,
} from "@/lib/analytics/enrich";

describe("parseDevice", () => {
  it("classifies a desktop Chrome UA", () => {
    const d = parseDevice(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
    );

    expect(d.type).toBe("desktop");
    expect(d.browser).toBe("Chrome");
    expect(d.os).toMatch(/mac/i);
  });

  it("classifies an iPhone UA as mobile", () => {
    const d = parseDevice(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    );

    expect(d.type).toBe("mobile");
  });

  it("returns unknown for empty UA", () => {
    expect(parseDevice("").type).toBe("unknown");
  });
});

describe("classifyReferrer", () => {
  const self = "uipirate.com";

  it("direct when no referrer and no utm", () => {
    expect(classifyReferrer(undefined, undefined, self)).toBe("direct");
  });

  it("organic from a search engine host", () => {
    expect(classifyReferrer("https://www.google.com/", undefined, self)).toBe(
      "organic",
    );
  });

  it("social from a social host", () => {
    expect(classifyReferrer("https://t.co/abc", undefined, self)).toBe(
      "social",
    );
  });

  it("internal when referrer is our own host", () => {
    expect(
      classifyReferrer("https://uipirate.com/pricing", undefined, self),
    ).toBe("internal");
  });

  it("paid when utm_medium says cpc", () => {
    expect(
      classifyReferrer("https://www.google.com/", { medium: "cpc" }, self),
    ).toBe("paid");
  });

  it("referral for an unknown external host", () => {
    expect(
      classifyReferrer("https://someblog.example/post", undefined, self),
    ).toBe("referral");
  });
});

describe("cleanPath", () => {
  it("strips query and hash", () => {
    expect(cleanPath("/pricing?utm_source=x#faq")).toBe("/pricing");
  });

  it("extracts pathname from a full URL", () => {
    expect(cleanPath("https://uipirate.com/blogs/some-post")).toBe(
      "/blogs/some-post",
    );
  });

  it("adds a leading slash and trims trailing", () => {
    expect(cleanPath("about/")).toBe("/about");
  });

  it("defaults to root", () => {
    expect(cleanPath(null)).toBe("/");
    expect(cleanPath("")).toBe("/");
  });
});

describe("clampText", () => {
  it("collapses whitespace and truncates", () => {
    expect(clampText("  hello   world  ")).toBe("hello world");
    expect(clampText("x".repeat(200), 10)).toHaveLength(10);
  });

  it("returns undefined for non-strings", () => {
    expect(clampText(undefined)).toBeUndefined();
    expect(clampText(42 as unknown)).toBeUndefined();
  });
});

describe("clickKind", () => {
  it("detects a CTA from analyticsId", () => {
    expect(clickKind({ analyticsId: "cta-sticky-whatsapp" })).toBe("cta");
  });

  it("detects a button", () => {
    expect(clickKind({ tag: "button" })).toBe("button");
  });

  it("detects a link", () => {
    expect(clickKind({ tag: "a", href: "/x" })).toBe("link");
  });
});

describe("extractUtm", () => {
  it("pulls only present utm params", () => {
    const utm = extractUtm(
      new URLSearchParams("utm_source=nl&utm_medium=email&foo=bar"),
    );

    expect(utm).toEqual({ source: "nl", medium: "email" });
  });
});

describe("referrerLabel", () => {
  it("strips www and returns host", () => {
    expect(referrerLabel("https://www.google.com/search?q=x")).toBe(
      "google.com",
    );
  });

  it("labels missing referrer as direct", () => {
    expect(referrerLabel(undefined)).toBe("(direct)");
  });
});
