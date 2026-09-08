import { describe, it, expect } from "vitest";

import {
  extractIp,
  hashIp,
  ipHashFromHeaders,
  isBotUserAgent,
  extractGeo,
} from "@/lib/analytics/ip";

describe("extractIp", () => {
  it("prefers cf-connecting-ip", () => {
    const h = new Headers({
      "cf-connecting-ip": "1.2.3.4",
      "x-forwarded-for": "9.9.9.9",
    });

    expect(extractIp(h)).toBe("1.2.3.4");
  });

  it("takes the first x-forwarded-for entry", () => {
    const h = new Headers({ "x-forwarded-for": "5.6.7.8, 10.0.0.1" });

    expect(extractIp(h)).toBe("5.6.7.8");
  });

  it("falls back to localhost", () => {
    expect(extractIp(new Headers())).toBe("127.0.0.1");
  });
});

describe("hashIp", () => {
  it("is stable and irreversible-looking (64 hex chars)", () => {
    const a = hashIp("1.2.3.4");
    const b = hashIp("1.2.3.4");

    expect(a).toBe(b);
    expect(a).toMatch(/^[0-9a-f]{64}$/);
    expect(a).not.toContain("1.2.3.4");
  });

  it("ipHashFromHeaders matches hashIp(extractIp(...))", () => {
    const h = new Headers({ "x-real-ip": "8.8.8.8" });

    expect(ipHashFromHeaders(h)).toBe(hashIp("8.8.8.8"));
  });
});

describe("isBotUserAgent", () => {
  it("flags known crawlers", () => {
    expect(isBotUserAgent("Mozilla/5.0 (compatible; Googlebot/2.1)")).toBe(
      true,
    );
    expect(isBotUserAgent("curl/8.1")).toBe(true);
    expect(isBotUserAgent("node-fetch/1.0")).toBe(true);
  });

  it("treats a missing UA as a bot", () => {
    expect(isBotUserAgent(null)).toBe(true);
    expect(isBotUserAgent("")).toBe(true);
  });

  it("passes a normal browser UA", () => {
    expect(
      isBotUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
      ),
    ).toBe(false);
  });
});

describe("extractGeo", () => {
  it("reads Vercel geo headers and decodes the city", () => {
    const h = new Headers({
      "x-vercel-ip-country": "IN",
      "x-vercel-ip-country-region": "MH",
      "x-vercel-ip-city": "Mumbai",
    });

    expect(extractGeo(h)).toEqual({
      country: "IN",
      region: "MH",
      city: "Mumbai",
    });
  });

  it("ignores the XX placeholder country", () => {
    expect(
      extractGeo(new Headers({ "x-vercel-ip-country": "XX" })).country,
    ).toBeUndefined();
  });
});
