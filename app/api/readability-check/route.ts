import { NextRequest, NextResponse } from "next/server";

import { resolveAndValidateUrl } from "@/lib/ssrfGuard";
import { extractReadableText, analyzeReadability } from "@/lib/readability";
import { rateLimit } from "@/lib/rateLimit";
import { extractIp } from "@/lib/analytics/ip";

const MAX_RESPONSE_BYTES = 3 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 10_000;
const USER_AGENT = "Mozilla/5.0 (compatible; UIPirateReadabilityChecker/1.0; +https://uipirate.com)";

async function readBodyWithLimit(response: Response, maxBytes: number): Promise<string> {
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

export async function GET(req: NextRequest) {
  const ip = extractIp(req.headers);
  const limit = rateLimit(`readability-check:${ip}`, 10, 5 * 60_000);

  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a few minutes and try again." },
      { status: 429 },
    );
  }

  const urlParam = req.nextUrl.searchParams.get("url");

  if (!urlParam) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  const safety = await resolveAndValidateUrl(urlParam);

  if (!safety.ok || !safety.normalizedUrl) {
    return NextResponse.json({ error: safety.error ?? "Invalid URL" }, { status: 400 });
  }

  try {
    const response = await fetch(safety.normalizedUrl, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `The page responded with status ${response.status}` },
        { status: 400 },
      );
    }

    const contentType = response.headers.get("content-type") ?? "";

    if (contentType && !contentType.includes("html")) {
      return NextResponse.json(
        { error: `Expected an HTML page, but got content-type "${contentType}"` },
        { status: 400 },
      );
    }

    const html = await readBodyWithLimit(response, MAX_RESPONSE_BYTES);
    const text = extractReadableText(html);
    const report = analyzeReadability(text);

    return NextResponse.json({
      url: safety.normalizedUrl,
      analyzedAt: new Date().toISOString(),
      report,
    });
  } catch (err: unknown) {
    const isTimeout = err instanceof Error && err.name === "TimeoutError";
    const message = isTimeout
      ? "The page took too long to respond."
      : err instanceof Error
        ? err.message
        : "Unknown error while fetching the page.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
