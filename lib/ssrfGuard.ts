// Outbound-fetch safety guard.
//
// Any route that fetches a URL the caller supplies is a potential SSRF
// vector: without checks, "analyze https://169.254.169.254/..." or
// "analyze http://localhost:6379" lets a client make the server probe its
// own internal network / cloud metadata endpoint. This module blocks
// resolved addresses in private, loopback, link-local, and other reserved
// ranges before a fetch is allowed to proceed.
//
// Note: the caller must resolve DNS and check the *resolved* IP (not just
// the hostname string), since a public-looking hostname can still resolve
// to an internal address ("DNS rebinding"). See resolveAndValidateUrl.

import dns from "node:dns/promises";

const IPV4_PRIVATE_RANGES: [string, number][] = [
  ["0.0.0.0", 8],
  ["10.0.0.0", 8],
  ["100.64.0.0", 10], // carrier-grade NAT
  ["127.0.0.0", 8], // loopback
  ["169.254.0.0", 16], // link-local, incl. cloud metadata (169.254.169.254)
  ["172.16.0.0", 12],
  ["192.0.0.0", 24], // IETF protocol assignments
  ["192.0.2.0", 24], // TEST-NET-1
  ["192.168.0.0", 16],
  ["198.18.0.0", 15], // benchmarking
  ["198.51.100.0", 24], // TEST-NET-2
  ["203.0.113.0", 24], // TEST-NET-3
  ["224.0.0.0", 4], // multicast
  ["240.0.0.0", 4], // reserved
];

function ipv4ToInt(ip: string): number | null {
  const parts = ip.split(".");

  if (parts.length !== 4) return null;

  let result = 0;

  for (const part of parts) {
    const n = Number(part);

    if (!Number.isInteger(n) || n < 0 || n > 255) return null;
    result = (result << 8) | n;
  }

  return result >>> 0;
}

function isIpv4InRange(ip: string, base: string, prefixLength: number): boolean {
  const ipInt = ipv4ToInt(ip);
  const baseInt = ipv4ToInt(base);

  if (ipInt === null || baseInt === null) return false;

  const mask = prefixLength === 0 ? 0 : (0xffffffff << (32 - prefixLength)) >>> 0;

  return (ipInt & mask) === (baseInt & mask);
}

function isPrivateIpv4(ip: string): boolean {
  return IPV4_PRIVATE_RANGES.some(([base, prefix]) => isIpv4InRange(ip, base, prefix));
}

function isPrivateIpv6(ip: string): boolean {
  const normalized = ip.toLowerCase();

  if (normalized === "::1") return true; // loopback
  if (normalized === "::") return true; // unspecified
  if (normalized.startsWith("fe80:")) return true; // link-local
  if (/^f[cd][0-9a-f]{2}:/.test(normalized)) return true; // unique local (fc00::/7)
  if (normalized.startsWith("::ffff:")) {
    // IPv4-mapped IPv6 address - check the embedded IPv4 address
    const mapped = normalized.split(":").pop() ?? "";

    if (mapped.includes(".")) return isPrivateIpv4(mapped);
  }

  return false;
}

export function isPrivateOrReservedIp(ip: string): boolean {
  return ip.includes(":") ? isPrivateIpv6(ip) : isPrivateIpv4(ip);
}

export interface UrlSafetyResult {
  ok: boolean;
  normalizedUrl?: string;
  error?: string;
}

/**
 * Normalizes a user-supplied URL, restricts it to http/https, and resolves
 * DNS to reject private/loopback/link-local targets. Does NOT itself fetch
 * the URL - the caller should fetch immediately after this check, using the
 * same hostname (not the resolved IP), to keep TLS SNI/Host correct.
 */
export async function resolveAndValidateUrl(rawUrl: string): Promise<UrlSafetyResult> {
  const trimmed = rawUrl.trim();

  if (!trimmed) return { ok: false, error: "Missing url parameter" };

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  let parsed: URL;

  try {
    parsed = new URL(withProtocol);
  } catch {
    return { ok: false, error: "Invalid URL" };
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return { ok: false, error: "Only http/https URLs are supported" };
  }

  const hostname = parsed.hostname.toLowerCase();

  if (hostname === "localhost" || hostname.endsWith(".localhost") || hostname === "0.0.0.0") {
    return { ok: false, error: "This URL cannot be analyzed" };
  }

  let addresses: string[];

  try {
    const results = await dns.lookup(hostname, { all: true });

    addresses = results.map((r) => r.address);
  } catch {
    return { ok: false, error: "Could not resolve this domain" };
  }

  if (addresses.length === 0 || addresses.some(isPrivateOrReservedIp)) {
    return { ok: false, error: "This URL resolves to a private or internal address and cannot be analyzed" };
  }

  return { ok: true, normalizedUrl: parsed.toString() };
}
