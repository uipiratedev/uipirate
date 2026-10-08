import fs from "fs";
import path from "path";

import { describe, expect, it } from "vitest";

import {
  HOST_TO_SLUG,
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
  it("points at the vendored public path", () => {
    expect(brandIconUrlForHost("reddit.com")).toBe("/icons/reddit.svg");
  });

  it("null when unmapped", () => {
    expect(brandIconUrlForHost("nope.example")).toBeNull();
  });
});

describe("vendored icon files", () => {
  // Guards the gap between the host map and `public/icons`: a mapped slug with
  // no file renders as a broken image, and the CLI's slugs are not guessable
  // (yahoo -> yahoo-badge, dev.to -> devto, chatgpt.com -> openai).
  // To add one: `npx @thesvg/cli add <slug>`.
  const dir = path.join(process.cwd(), "public", "icons");
  const vendored = new Set(
    fs.readdirSync(dir).map((f) => f.replace(/\.svg$/, "")),
  );

  const mapped = [...new Set(Object.values(HOST_TO_SLUG))];

  it.each(mapped)("%s has a vendored svg", (slug) => {
    expect(vendored.has(slug)).toBe(true);
  });

  it("has no unused icon files", () => {
    const unused = [...vendored].filter((s) => !mapped.includes(s));

    expect(unused).toEqual([]);
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
