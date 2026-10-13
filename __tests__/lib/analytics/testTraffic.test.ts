import { describe, expect, it } from "vitest";

import {
  hostnameOf,
  isLocalHost,
  isTestTraffic,
} from "@/lib/analytics/testTraffic";

const h = (o: Record<string, string>) => ({
  get: (k: string) => o[k.toLowerCase()] ?? null,
});

describe("hostnameOf", () => {
  it("handles urls, host:port and ipv6", () => {
    expect(hostnameOf("http://localhost:3000/contact")).toBe("localhost");
    expect(hostnameOf("localhost:3000")).toBe("localhost");
    expect(hostnameOf("uipirate.com")).toBe("uipirate.com");
    expect(hostnameOf("[::1]:3000")).toBe("[::1]");
  });

  it("is empty for junk", () => {
    expect(hostnameOf("")).toBe("");
    expect(hostnameOf(null)).toBe("");
    expect(hostnameOf("://")).toBe("");
  });
});

describe("isLocalHost", () => {
  it.each([
    "localhost",
    "localhost:3000",
    "http://localhost:3000/x",
    "127.0.0.1:3000",
    "http://127.0.0.1",
    "0.0.0.0",
    "[::1]:3000",
    "my-laptop.local",
    "app.localhost",
  ])("%s is local", (v) => {
    expect(isLocalHost(v)).toBe(true);
  });

  it.each([
    "uipirate.com",
    "https://www.uipirate.com/pricing",
    "https://reddit.com/r/x",
    // Look-alikes must not be swallowed.
    "localhost.evil.com",
    "notlocalhost.com",
    "127.0.0.1.evil.com",
    "",
    null,
  ])("%s is not local", (v) => {
    expect(isLocalHost(v as string | null)).toBe(false);
  });
});

describe("isTestTraffic", () => {
  const prod = { NODE_ENV: "production" };

  it("counts a normal production visitor", () => {
    expect(
      isTestTraffic(
        h({ host: "uipirate.com", origin: "https://uipirate.com" }),
        prod,
      ),
    ).toBe(false);
  });

  it("refuses everything from a development build", () => {
    expect(isTestTraffic(h({ host: "uipirate.com" }), { NODE_ENV: "development" })).toBe(true);
    expect(isTestTraffic(h({}), { NODE_ENV: "test" })).toBe(true);
  });

  it("refuses a production build driven from localhost", () => {
    expect(isTestTraffic(h({ host: "localhost:3000" }), prod)).toBe(true);
    expect(isTestTraffic(h({ origin: "http://localhost:3000" }), prod)).toBe(true);
    expect(isTestTraffic(h({ referer: "http://127.0.0.1:3000/x" }), prod)).toBe(true);
  });

  it("ANALYTICS_ALLOW_DEV=1 lets a dev machine record on purpose", () => {
    expect(
      isTestTraffic(h({ host: "localhost:3000" }), {
        NODE_ENV: "development",
        ANALYTICS_ALLOW_DEV: "1",
      }),
    ).toBe(false);
  });

  it("only the exact value 1 enables the override", () => {
    expect(
      isTestTraffic(h({ host: "localhost" }), {
        NODE_ENV: "development",
        ANALYTICS_ALLOW_DEV: "true",
      }),
    ).toBe(true);
  });
});
