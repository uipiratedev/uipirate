// Website performance & UX signals auditor.
//
// This is deliberately NOT a Core Web Vitals / Lighthouse replacement - a
// real LCP/INP/CLS measurement requires actually rendering the page in a
// browser and simulating a real session, which isn't something a public,
// rate-limited API route can do per-request without becoming a target for
// abuse (spinning up headless Chrome per request is exactly the kind of
// unbounded server-side cost the rest of this codebase's tools avoid).
//
// Instead, this measures what's genuinely available from a single
// server-side HTTP fetch: the ACTUAL time-to-first-byte and payload size
// for that fetch (real numbers, not estimates), the response's real
// compression/caching headers, and deterministic static-HTML proxies for
// the two biggest self-inflicted performance problems - render-blocking
// resources in <head>, and layout-shift risk from images/iframes with no
// reserved dimensions. Every one of those proxies is a well-established,
// specific cause of a slow LCP or a high CLS score, not a vague guess.

import * as cheerio from "cheerio";
import type { Element } from "domhandler";

export interface MeasuredFetchStats {
  ttfbMs: number;
  htmlBytes: number;
  contentEncoding: string | null;
  cacheControl: string | null;
}

export interface PerformanceFeatures extends MeasuredFetchStats {
  bodyTextLength: number;
  elementCount: number;
  lowContent: boolean;

  blockingScriptCount: number;
  blockingStylesheetCount: number;
  asyncDeferScriptCount: number;

  imgCount: number;
  imgWithReservedSpaceCount: number;
  iframeCount: number;
  iframeWithReservedSpaceCount: number;

  thirdPartyScriptCount: number;
  thirdPartyOriginCount: number;
  preconnectHintCount: number;

  webFontLinkCount: number;
  fontDisplaySwapDetected: boolean;
}

function hasReservedSpace($: cheerio.CheerioAPI, el: Element): boolean {
  const $el = $(el);
  const width = $el.attr("width");
  const height = $el.attr("height");
  const style = $el.attr("style") ?? "";

  if (width && height) return true;
  if (/aspect-ratio\s*:/.test(style)) return true;

  return false;
}

export function extractPerformanceFeatures(
  html: string,
  pageUrl: string,
  measured: MeasuredFetchStats,
): PerformanceFeatures {
  const $ = cheerio.load(html);

  const bodyTextForSize = $("body").clone();

  bodyTextForSize.find("script, style, noscript, svg").remove();
  const bodyText = bodyTextForSize.text().replace(/\s+/g, " ").trim();
  const elementCount = $("body *").length;
  const lowContent = bodyText.length < 150 && elementCount < 15;

  const pageHostname = (() => {
    try {
      return new URL(pageUrl).hostname;
    } catch {
      return "";
    }
  })();

  let blockingScriptCount = 0;
  let asyncDeferScriptCount = 0;
  const thirdPartyHostnames = new Set<string>();
  let thirdPartyScriptCount = 0;

  $("head script[src]").each((_, el) => {
    const $el = $(el);
    const isNonBlocking = $el.attr("async") !== undefined || $el.attr("defer") !== undefined || $el.attr("type") === "module";

    if (isNonBlocking) asyncDeferScriptCount++;
    else blockingScriptCount++;
  });

  $("script[src]").each((_, el) => {
    const src = $(el).attr("src") ?? "";

    try {
      const hostname = new URL(src, pageUrl).hostname;

      if (hostname && hostname !== pageHostname) {
        thirdPartyHostnames.add(hostname);
        thirdPartyScriptCount++;
      }
    } catch {
      // relative/invalid src - treated as first-party, not counted
    }
  });

  const blockingStylesheetCount = $("head link[rel='stylesheet']").filter((_, el) => {
    const media = $(el).attr("media");

    return !media || media === "all" || media === "screen";
  }).length;

  const images = $("img");
  const imgCount = images.length;
  let imgWithReservedSpaceCount = 0;

  images.each((_, el) => {
    if (hasReservedSpace($, el)) imgWithReservedSpaceCount++;
  });

  const iframes = $("iframe");
  const iframeCount = iframes.length;
  let iframeWithReservedSpaceCount = 0;

  iframes.each((_, el) => {
    if (hasReservedSpace($, el)) iframeWithReservedSpaceCount++;
  });

  const preconnectHintCount = $("link[rel='preconnect'], link[rel='dns-prefetch']").length;

  const webFontLinkCount = $("link[href*='fonts.googleapis.com' i], link[href*='fonts.gstatic.com' i], link[href*='use.typekit.net' i], link[href*='fonts.adobe.com' i], link[as='font']").length;

  const googleFontsSwap = $("link[href*='fonts.googleapis.com' i]").filter((_, el) => {
    const href = $(el).attr("href") ?? "";

    return /display=swap|display=optional|display=fallback/i.test(href);
  }).length > 0;

  let embeddedFontFaceSwap = false;

  $("style").each((_, el) => {
    const css = $(el).contents().text();
    const fontFaceBlocks = css.match(/@font-face\s*\{[^}]*\}/gi) ?? [];

    for (const block of fontFaceBlocks) {
      if (/font-display\s*:\s*(swap|optional|fallback)/i.test(block)) embeddedFontFaceSwap = true;
    }
  });

  const fontDisplaySwapDetected = webFontLinkCount === 0 ? true : googleFontsSwap || embeddedFontFaceSwap;

  return {
    ...measured,
    bodyTextLength: bodyText.length,
    elementCount,
    lowContent,
    blockingScriptCount,
    blockingStylesheetCount,
    asyncDeferScriptCount,
    imgCount,
    imgWithReservedSpaceCount,
    iframeCount,
    iframeWithReservedSpaceCount,
    thirdPartyScriptCount,
    thirdPartyOriginCount: thirdPartyHostnames.size,
    preconnectHintCount,
    webFontLinkCount,
    fontDisplaySwapDetected,
  };
}

export interface CheckResult {
  key: string;
  label: string;
  passed: boolean;
  detail: string;
}

export interface CategoryResult {
  key: string;
  label: string;
  score: number;
  checks: CheckResult[];
}

export interface PerformanceAuditResult {
  overallScore: number;
  grade: "A" | "B" | "C" | "D" | "F";
  lowContent: boolean;
  categories: CategoryResult[];
}

function clampScore(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function scoreToGrade(score: number): PerformanceAuditResult["grade"] {
  if (score >= 90) return "A";
  if (score >= 75) return "B";
  if (score >= 60) return "C";
  if (score >= 40) return "D";

  return "F";
}

export function scorePerformanceFeatures(f: PerformanceFeatures): PerformanceAuditResult {
  // Network & delivery - the one category built entirely from real,
  // measured numbers rather than static-HTML proxies.
  const networkChecks: CheckResult[] = [];
  let networkScore = 0;

  const ttfbOk = f.ttfbMs <= 600;

  networkScore += ttfbOk ? 35 : f.ttfbMs <= 1200 ? 15 : 0;
  networkChecks.push({
    key: "ttfb",
    label: "Time to first byte under 600ms",
    passed: ttfbOk,
    detail: `Measured ${Math.round(f.ttfbMs)}ms from our server to yours for this single request - real user latency will vary by their location relative to your server/CDN.`,
  });

  const payloadKb = f.htmlBytes / 1024;
  const payloadOk = payloadKb <= 150;

  networkScore += payloadOk ? 25 : payloadKb <= 300 ? 12 : 0;
  networkChecks.push({
    key: "html-payload",
    label: "Initial HTML payload under 150KB",
    passed: payloadOk,
    detail: `${payloadKb.toFixed(1)}KB of HTML downloaded for this page.`,
  });

  networkScore += f.contentEncoding ? 20 : 0;
  networkChecks.push({
    key: "compression",
    label: "Response is compressed (gzip/brotli)",
    passed: Boolean(f.contentEncoding),
    detail: f.contentEncoding
      ? `Content-Encoding: ${f.contentEncoding}`
      : "No Content-Encoding header found - text responses typically compress 60-80% smaller with gzip or brotli.",
  });

  networkScore += f.cacheControl ? 20 : 0;
  networkChecks.push({
    key: "cache-control",
    label: "Cache-Control header present",
    passed: Boolean(f.cacheControl),
    detail: f.cacheControl
      ? `Cache-Control: ${f.cacheControl}`
      : "No Cache-Control header found on the HTML response.",
  });

  // Render-blocking resources
  const blockingChecks: CheckResult[] = [];
  let blockingScore = 0;

  blockingScore += f.blockingScriptCount === 0 ? 40 : f.blockingScriptCount <= 2 ? 20 : 0;
  blockingChecks.push({
    key: "blocking-scripts",
    label: "No render-blocking <script> tags in <head>",
    passed: f.blockingScriptCount === 0,
    detail:
      f.blockingScriptCount > 0
        ? `${f.blockingScriptCount} external script(s) in <head> without async/defer/type="module" - each one pauses HTML parsing until it downloads and runs.`
        : "No blocking external scripts found in <head>.",
  });

  blockingScore += f.blockingStylesheetCount <= 2 ? 30 : f.blockingStylesheetCount <= 4 ? 15 : 0;
  blockingChecks.push({
    key: "blocking-stylesheets",
    label: "A lean number of render-blocking stylesheets (≤2)",
    passed: f.blockingStylesheetCount <= 2,
    detail: `${f.blockingStylesheetCount} blocking stylesheet(s) found in <head>.`,
  });

  const hintsCoverThirdParty = f.thirdPartyOriginCount === 0 || f.preconnectHintCount >= Math.min(f.thirdPartyOriginCount, 3);

  blockingScore += hintsCoverThirdParty ? 30 : f.preconnectHintCount > 0 ? 15 : 0;
  blockingChecks.push({
    key: "resource-hints",
    label: "Preconnect/dns-prefetch hints for third-party origins",
    passed: hintsCoverThirdParty,
    detail:
      f.thirdPartyOriginCount === 0
        ? "No third-party script origins to hint for."
        : `${f.preconnectHintCount} preconnect/dns-prefetch hint(s) found for ${f.thirdPartyOriginCount} distinct third-party script origin(s).`,
  });

  // Layout stability risk
  const layoutChecks: CheckResult[] = [];
  let layoutScore = 0;

  const imgRatio = f.imgCount > 0 ? f.imgWithReservedSpaceCount / f.imgCount : 1;

  layoutScore += Math.round(imgRatio * 50);
  layoutChecks.push({
    key: "image-dimensions",
    label: "Images have explicit width/height or aspect-ratio",
    passed: f.imgCount === 0 || f.imgWithReservedSpaceCount === f.imgCount,
    detail:
      f.imgCount === 0
        ? "No <img> elements found on the page."
        : `${f.imgWithReservedSpaceCount} of ${f.imgCount} images reserve their layout space before loading - the rest can push content down once they load.`,
  });

  const iframeRatio = f.iframeCount > 0 ? f.iframeWithReservedSpaceCount / f.iframeCount : 1;

  layoutScore += Math.round(iframeRatio * 25);
  layoutChecks.push({
    key: "iframe-dimensions",
    label: "Iframes (embeds/ads) have explicit dimensions",
    passed: f.iframeCount === 0 || f.iframeWithReservedSpaceCount === f.iframeCount,
    detail:
      f.iframeCount === 0
        ? "No <iframe> elements found on the page."
        : `${f.iframeWithReservedSpaceCount} of ${f.iframeCount} iframes reserve their layout space.`,
  });

  layoutScore += f.fontDisplaySwapDetected ? 25 : 0;
  layoutChecks.push({
    key: "font-display",
    label: "Web fonts use font-display: swap (or none are loaded)",
    passed: f.fontDisplaySwapDetected,
    detail:
      f.webFontLinkCount === 0
        ? "No external web font links detected."
        : f.fontDisplaySwapDetected
          ? "Found font-display: swap/optional/fallback for loaded web fonts."
          : `${f.webFontLinkCount} web font link(s) found with no detectable font-display: swap - text using that font may stay invisible until it loads.`,
  });

  // Third-party weight
  const thirdPartyChecks: CheckResult[] = [];
  let thirdPartyScore = 0;

  thirdPartyScore += f.thirdPartyScriptCount <= 3 ? 50 : f.thirdPartyScriptCount <= 7 ? 25 : 0;
  thirdPartyChecks.push({
    key: "third-party-script-count",
    label: "Lean third-party script count (≤3)",
    passed: f.thirdPartyScriptCount <= 3,
    detail: `${f.thirdPartyScriptCount} third-party <script> tag(s) found across ${f.thirdPartyOriginCount} distinct origin(s) - each is a network request and a chunk of JavaScript the browser has to fetch, parse, and run.`,
  });

  thirdPartyScore += f.thirdPartyOriginCount <= 2 ? 50 : f.thirdPartyOriginCount <= 5 ? 25 : 0;
  thirdPartyChecks.push({
    key: "third-party-origin-count",
    label: "Few distinct third-party origins (≤2)",
    passed: f.thirdPartyOriginCount <= 2,
    detail: `${f.thirdPartyOriginCount} distinct third-party hostname(s) the browser has to open a fresh connection to.`,
  });

  const categories: CategoryResult[] = [
    { key: "network", label: "Network & Delivery", score: clampScore(networkScore), checks: networkChecks },
    { key: "blocking", label: "Render-Blocking Resources", score: clampScore(blockingScore), checks: blockingChecks },
    { key: "layout", label: "Layout Stability Risk", score: clampScore(layoutScore), checks: layoutChecks },
    { key: "thirdparty", label: "Third-Party Weight", score: clampScore(thirdPartyScore), checks: thirdPartyChecks },
  ];

  const overallScore = clampScore(categories.reduce((sum, c) => sum + c.score, 0) / categories.length);

  return {
    overallScore,
    grade: scoreToGrade(overallScore),
    lowContent: f.lowContent,
    categories,
  };
}

export function runPerformanceAudit(html: string, pageUrl: string, measured: MeasuredFetchStats): PerformanceAuditResult {
  return scorePerformanceFeatures(extractPerformanceFeatures(html, pageUrl, measured));
}
