import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

import { resolveAndValidateUrl } from "@/lib/ssrfGuard";
import { extractDomainGeoFeatures, scoreDomainGeoReadiness, compareGeoReadiness, type DomainGeoScore } from "@/lib/geoBenchmark";
import { rateLimit } from "@/lib/rateLimit";
import { extractIp } from "@/lib/analytics/ip";

const FETCH_TIMEOUT_MS = 8_000;
const MAX_BYTES = 2 * 1024 * 1024;
const USER_AGENT = "Mozilla/5.0 (compatible; UIPirateGeoBenchmark/1.0; +https://uipirate.com)";

async function readTextWithLimit(response: Response, maxBytes: number): Promise<string> {
  const reader = response.body?.getReader();

  if (!reader) return response.text();

  const decoder = new TextDecoder();
  let received = 0;
  let result = "";

  for (;;) {
    const { done, value } = await reader.read();

    if (done) break;

    received += value.byteLength;
    if (received > maxBytes) {
      await reader.cancel();
      break;
    }
    result += decoder.decode(value, { stream: true });
  }
  result += decoder.decode();

  return result;
}

async function fetchDomainScore(rawUrl: string): Promise<{ hostname: string; score: DomainGeoScore } | { error: string }> {
  const safety = await resolveAndValidateUrl(rawUrl);

  if (!safety.ok || !safety.normalizedUrl) {
    return { error: safety.error ?? `Invalid URL: ${rawUrl}` };
  }

  const origin = new URL(safety.normalizedUrl).origin;

  const [robotsResult, llmsResult, llmsFullResult, homepageResult] = await Promise.allSettled([
    fetch(`${origin}/robots.txt`, {
      headers: { "User-Agent": USER_AGENT },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    }),
    fetch(`${origin}/llms.txt`, {
      method: "HEAD",
      headers: { "User-Agent": USER_AGENT },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    }),
    fetch(`${origin}/llms-full.txt`, {
      method: "HEAD",
      headers: { "User-Agent": USER_AGENT },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    }),
    fetch(safety.normalizedUrl, {
      headers: { "User-Agent": USER_AGENT, Accept: "text/html" },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    }),
  ]);

  let robotsTxt: string | null = null;

  if (robotsResult.status === "fulfilled" && robotsResult.value.ok) {
    robotsTxt = await readTextWithLimit(robotsResult.value, MAX_BYTES);
  }

  const llmsTxtFound = llmsResult.status === "fulfilled" && llmsResult.value.ok;
  const llmsFullTxtFound = llmsFullResult.status === "fulfilled" && llmsFullResult.value.ok;

  const jsonLdTypes: string[] = [];

  if (homepageResult.status === "fulfilled" && homepageResult.value.ok) {
    const html = await readTextWithLimit(homepageResult.value, MAX_BYTES);
    const $ = cheerio.load(html);

    $("script[type='application/ld+json']").each((_, el) => {
      try {
        const parsed = JSON.parse($(el).contents().text());
        const items = Array.isArray(parsed) ? parsed : [parsed];

        for (const item of items) {
          const type = item?.["@type"];

          if (typeof type === "string") jsonLdTypes.push(type);
          else if (Array.isArray(type)) jsonLdTypes.push(...type.filter((t) => typeof t === "string"));
        }
      } catch {
        // malformed JSON-LD - simply not counted
      }
    });
  }

  const features = extractDomainGeoFeatures(robotsTxt, llmsTxtFound, llmsFullTxtFound, jsonLdTypes);

  return { hostname: new URL(safety.normalizedUrl).hostname, score: scoreDomainGeoReadiness(features) };
}

export async function GET(req: NextRequest) {
  const ip = extractIp(req.headers);
  const limit = rateLimit(`geo-benchmark:${ip}`, 6, 5 * 60_000);

  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a few minutes and try again." },
      { status: 429 },
    );
  }

  const primaryParam = req.nextUrl.searchParams.get("primary");
  const competitorParam = req.nextUrl.searchParams.get("competitor");

  if (!primaryParam || !competitorParam) {
    return NextResponse.json({ error: "Both primary and competitor URLs are required" }, { status: 400 });
  }

  const [primaryResult, competitorResult] = await Promise.all([
    fetchDomainScore(primaryParam),
    fetchDomainScore(competitorParam),
  ]);

  if ("error" in primaryResult) {
    return NextResponse.json({ error: `Primary domain: ${primaryResult.error}` }, { status: 400 });
  }
  if ("error" in competitorResult) {
    return NextResponse.json({ error: `Competitor domain: ${competitorResult.error}` }, { status: 400 });
  }

  const comparison = compareGeoReadiness(primaryResult.score, competitorResult.score);

  return NextResponse.json({
    analyzedAt: new Date().toISOString(),
    primary: primaryResult,
    competitor: competitorResult,
    comparison,
  });
}
