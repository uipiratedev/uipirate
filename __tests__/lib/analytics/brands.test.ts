import { describe, expect, it } from "vitest";

import {
  brandIconUrlForHost,
  brandLabel,
  brandSlug,
  channelLabel,
  normalizeHost,
} from "@/lib/analytics/brands";

describe("normalizeHost", () => {
  it("strips www, port and scheme", () => {
    expect(normalizeHost("https://www.reddit.com/r/x")).toBe("reddit.com");
    expect(normalizeHost("WWW.Google.COM:443")).toBe("google.com");
  });

  it("accepts a bare host", () => {
    expect(normalizeHost("t.co")).toBe("t.co");
  });

  it("empty for nullish or unparseable", () => {
    expect(normalizeHost(null)).toBe("");
    expect(normalizeHost("")).toBe("");
    expect(normalizeHost("://nope")).toBe("");
  });
});

describe("brandSlug", () => {
  it("maps known hosts", () => {
    expect(brandSlug("https://www.reddit.com/r/DesignSystems")).toBe("reddit");
    expect(brandSlug("chatgpt.com")).toBe("openai");
    expect(brandSlug("t.co")).toBe("x");
    expect(brandSlug("bing.com")).toBe("microsoft-bing");
  });

  it("maps the Reddit Android app referrer", () => {
    expect(brandSlug("com.reddit.frontpage")).toBe("reddit");
  });

  it("walks up subdomains", () => {
    expect(brandSlug("https://old.reddit.com/r/x")).toBe("reddit");
    expect(brandSlug("m.linkedin.com")).toBe("linkedin");
  });

  it("does not collapse gemini.google.com into google", () => {
    // Exact match must win over the subdomain walk.
    expect(brandSlug("gemini.google.com")).toBe("gemini");
  });

  it("null for unmapped hosts", () => {
    expect(brandSlug("some-random-blog.example")).toBeNull();
    expect(brandSlug(null)).toBeNull();
  });
});

describe("brandIconUrlForHost", () => {
  it("builds a pinned jsDelivr url with the default variant", () => {
    expect(brandIconUrlForHost("reddit.com")).toBe(
      "https://cdn.jsdelivr.net/gh/glincker/thesvg@3.1.0/public/icons/reddit/default.svg",
    );
  });

  it("null when unmapped", () => {
    expect(brandIconUrlForHost("nope.example")).toBeNull();
  });
});

describe("brandLabel", () => {
  it("falls back to (direct)", () => {
    expect(brandLabel(null)).toBe("(direct)");
    expect(brandLabel("https://www.reddit.com/")).toBe("reddit.com");
  });
});

describe("channelLabel", () => {
  it("humanises known channels", () => {
    expect(channelLabel("ai")).toBe("AI assistants");
    expect(channelLabel("organic")).toBe("Organic search");
  });

  it("passes through unknown keys", () => {
    expect(channelLabel("weird")).toBe("weird");
    expect(channelLabel(null)).toBe("Unknown");
  });
});
