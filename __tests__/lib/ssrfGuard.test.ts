import { describe, it, expect } from "vitest";

import { isPrivateOrReservedIp, resolveAndValidateUrl } from "@/lib/ssrfGuard";

describe("isPrivateOrReservedIp", () => {
  it("flags loopback addresses", () => {
    expect(isPrivateOrReservedIp("127.0.0.1")).toBe(true);
    expect(isPrivateOrReservedIp("127.255.255.255")).toBe(true);
    expect(isPrivateOrReservedIp("::1")).toBe(true);
  });

  it("flags the cloud metadata / link-local range", () => {
    expect(isPrivateOrReservedIp("169.254.169.254")).toBe(true);
    expect(isPrivateOrReservedIp("169.254.0.1")).toBe(true);
  });

  it("flags RFC 1918 private ranges", () => {
    expect(isPrivateOrReservedIp("10.0.0.1")).toBe(true);
    expect(isPrivateOrReservedIp("10.255.255.255")).toBe(true);
    expect(isPrivateOrReservedIp("172.16.0.1")).toBe(true);
    expect(isPrivateOrReservedIp("172.31.255.255")).toBe(true);
    expect(isPrivateOrReservedIp("192.168.0.1")).toBe(true);
    expect(isPrivateOrReservedIp("192.168.255.255")).toBe(true);
  });

  it("does not flag adjacent public addresses just outside those ranges", () => {
    expect(isPrivateOrReservedIp("172.15.255.255")).toBe(false); // just below 172.16/12
    expect(isPrivateOrReservedIp("172.32.0.0")).toBe(false); // just above 172.16/12
    expect(isPrivateOrReservedIp("11.0.0.1")).toBe(false); // just above 10/8
    expect(isPrivateOrReservedIp("193.168.0.1")).toBe(false); // not 192.168/16
  });

  it("flags IPv6 loopback, unspecified, link-local, and unique-local", () => {
    expect(isPrivateOrReservedIp("::1")).toBe(true);
    expect(isPrivateOrReservedIp("::")).toBe(true);
    expect(isPrivateOrReservedIp("fe80::1")).toBe(true);
    expect(isPrivateOrReservedIp("fd00::1")).toBe(true);
    expect(isPrivateOrReservedIp("fc00::1")).toBe(true);
  });

  it("flags IPv4-mapped IPv6 addresses that embed a private IPv4", () => {
    expect(isPrivateOrReservedIp("::ffff:127.0.0.1")).toBe(true);
    expect(isPrivateOrReservedIp("::ffff:10.0.0.1")).toBe(true);
  });

  it("does not flag ordinary public IPv4/IPv6 addresses", () => {
    expect(isPrivateOrReservedIp("8.8.8.8")).toBe(false);
    expect(isPrivateOrReservedIp("1.1.1.1")).toBe(false);
    expect(isPrivateOrReservedIp("2606:4700:4700::1111")).toBe(false);
  });
});

describe("resolveAndValidateUrl", () => {
  it("rejects an empty URL without hitting the network", async () => {
    const result = await resolveAndValidateUrl("");

    expect(result.ok).toBe(false);
  });

  it("rejects non-http(s) protocols without hitting the network", async () => {
    const result = await resolveAndValidateUrl("ftp://example.com/file");

    expect(result.ok).toBe(false);
  });

  it("rejects localhost without hitting the network", async () => {
    const result = await resolveAndValidateUrl("http://localhost:3000");

    expect(result.ok).toBe(false);
  });

  it("rejects 0.0.0.0 without hitting the network", async () => {
    const result = await resolveAndValidateUrl("http://0.0.0.0");

    expect(result.ok).toBe(false);
  });

  it("defaults a protocol-less input to https", async () => {
    // example.com is IANA's reserved documentation domain - always resolves,
    // always public, so this is safe to actually hit in CI.
    const result = await resolveAndValidateUrl("example.com");

    expect(result.ok).toBe(true);
    expect(result.normalizedUrl).toMatch(/^https:\/\/example\.com/);
  }, 10000);
});
