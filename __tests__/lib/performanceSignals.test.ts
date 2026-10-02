import { describe, expect, it } from "vitest";

import { extractPerformanceFeatures, runPerformanceAudit, scorePerformanceFeatures } from "@/lib/performanceSignals";

const PAGE_URL = "https://example.com/";

const GOOD_MEASURED = { ttfbMs: 180, htmlBytes: 40_000, contentEncoding: "br", cacheControl: "public, max-age=3600" };
const BAD_MEASURED = { ttfbMs: 1800, htmlBytes: 600_000, contentEncoding: null, cacheControl: null };

const FAST_PAGE = `
<!DOCTYPE html>
<html>
<head>
  <link rel="preconnect" href="https://cdn.example.com" />
  <link rel="stylesheet" href="/styles.css" />
  <script src="/app.js" defer></script>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter&display=swap" />
</head>
<body>
  <h1>Fast Page</h1>
  <p>${"Plenty of real body content so this isn't flagged as low-content. ".repeat(6)}</p>
  <img alt="hero" height="400" src="/hero.jpg" width="800" />
  <img alt="thumb" src="/thumb.jpg" style="aspect-ratio: 1/1" />
  <iframe height="315" src="https://www.youtube.com/embed/x" width="560"></iframe>
  <script src="https://cdn.example.com/widget.js"></script>
</body>
</html>
`;

const SLOW_PAGE = `
<!DOCTYPE html>
<html>
<head>
  <script src="/a.js"></script>
  <script src="/b.js"></script>
  <script src="/c.js"></script>
  <link rel="stylesheet" href="/one.css" />
  <link rel="stylesheet" href="/two.css" />
  <link rel="stylesheet" href="/three.css" />
  <link rel="stylesheet" href="/four.css" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto" />
  <script src="https://analytics.example.com/a.js"></script>
  <script src="https://ads.example.com/a.js"></script>
  <script src="https://chat.example.com/a.js"></script>
  <script src="https://pixel.example.com/a.js"></script>
</head>
<body>
  <h1>Slow Page</h1>
  <p>${"Plenty of real body content so this isn't flagged as low-content. ".repeat(6)}</p>
  <img alt="hero" src="/hero.jpg" />
  <img alt="thumb" src="/thumb.jpg" />
  <iframe src="https://www.youtube.com/embed/x"></iframe>
</body>
</html>
`;

const LOW_CONTENT_PAGE = `<!DOCTYPE html><html><body><div id="root"></div></body></html>`;

describe("extractPerformanceFeatures", () => {
  it("counts every <head> script without async/defer/module as render-blocking, first- or third-party alike", () => {
    const f = extractPerformanceFeatures(SLOW_PAGE, PAGE_URL, GOOD_MEASURED);

    // 3 first-party (a/b/c.js) + 4 third-party (analytics/ads/chat/pixel) -
    // blocking behavior depends on the missing async/defer, not on origin.
    expect(f.blockingScriptCount).toBe(7);
  });

  it("does not count deferred scripts as blocking", () => {
    const f = extractPerformanceFeatures(FAST_PAGE, PAGE_URL, GOOD_MEASURED);

    expect(f.blockingScriptCount).toBe(0);
    expect(f.asyncDeferScriptCount).toBe(1);
  });

  it("counts render-blocking stylesheets in <head>", () => {
    const f = extractPerformanceFeatures(SLOW_PAGE, PAGE_URL, GOOD_MEASURED);

    expect(f.blockingStylesheetCount).toBe(5);
  });

  it("identifies third-party scripts by hostname, excluding first-party ones", () => {
    const f = extractPerformanceFeatures(SLOW_PAGE, PAGE_URL, GOOD_MEASURED);

    // /a.js, /b.js, /c.js are same-origin (example.com); the 4 external
    // analytics/ads/chat/pixel scripts are third-party.
    expect(f.thirdPartyScriptCount).toBe(4);
    expect(f.thirdPartyOriginCount).toBe(4);
  });

  it("counts images/iframes with reserved layout space via width+height or aspect-ratio", () => {
    const f = extractPerformanceFeatures(FAST_PAGE, PAGE_URL, GOOD_MEASURED);

    expect(f.imgCount).toBe(2);
    expect(f.imgWithReservedSpaceCount).toBe(2);
    expect(f.iframeCount).toBe(1);
    expect(f.iframeWithReservedSpaceCount).toBe(1);
  });

  it("flags images/iframes with no dimensions as not reserving space", () => {
    const f = extractPerformanceFeatures(SLOW_PAGE, PAGE_URL, GOOD_MEASURED);

    expect(f.imgWithReservedSpaceCount).toBe(0);
    expect(f.iframeWithReservedSpaceCount).toBe(0);
  });

  it("detects font-display: swap on a Google Fonts link", () => {
    const f = extractPerformanceFeatures(FAST_PAGE, PAGE_URL, GOOD_MEASURED);

    expect(f.fontDisplaySwapDetected).toBe(true);
  });

  it("flags a web font link with no display=swap as a risk", () => {
    const f = extractPerformanceFeatures(SLOW_PAGE, PAGE_URL, GOOD_MEASURED);

    expect(f.webFontLinkCount).toBeGreaterThan(0);
    expect(f.fontDisplaySwapDetected).toBe(false);
  });

  it("treats a page with no web fonts as having no font-display risk", () => {
    const html = `<html><head></head><body><h1>x</h1><p>${"text ".repeat(40)}</p></body></html>`;
    const f = extractPerformanceFeatures(html, PAGE_URL, GOOD_MEASURED);

    expect(f.webFontLinkCount).toBe(0);
    expect(f.fontDisplaySwapDetected).toBe(true);
  });

  it("counts preconnect/dns-prefetch hints", () => {
    const f = extractPerformanceFeatures(FAST_PAGE, PAGE_URL, GOOD_MEASURED);

    expect(f.preconnectHintCount).toBe(1);
  });

  it("passes measured fetch stats through unchanged", () => {
    const f = extractPerformanceFeatures(FAST_PAGE, PAGE_URL, BAD_MEASURED);

    expect(f.ttfbMs).toBe(1800);
    expect(f.htmlBytes).toBe(600_000);
    expect(f.contentEncoding).toBeNull();
    expect(f.cacheControl).toBeNull();
  });

  it("flags a near-empty SPA shell as low content", () => {
    const f = extractPerformanceFeatures(LOW_CONTENT_PAGE, PAGE_URL, GOOD_MEASURED);

    expect(f.lowContent).toBe(true);
  });
});

describe("scorePerformanceFeatures", () => {
  it("gives a fast, well-optimized page a high overall score", () => {
    const result = runPerformanceAudit(FAST_PAGE, PAGE_URL, GOOD_MEASURED);

    expect(result.overallScore).toBeGreaterThanOrEqual(80);
    expect(["A", "B"]).toContain(result.grade);
  });

  it("gives a slow, heavy page a low overall score", () => {
    const result = runPerformanceAudit(SLOW_PAGE, PAGE_URL, BAD_MEASURED);

    expect(result.overallScore).toBeLessThan(35);
  });

  it("scores network/delivery from the real measured TTFB and payload size", () => {
    const fast = runPerformanceAudit(FAST_PAGE, PAGE_URL, GOOD_MEASURED);
    const slow = runPerformanceAudit(FAST_PAGE, PAGE_URL, BAD_MEASURED);
    const fastNetwork = fast.categories.find((c) => c.key === "network")!;
    const slowNetwork = slow.categories.find((c) => c.key === "network")!;

    expect(fastNetwork.score).toBeGreaterThan(slowNetwork.score);
  });

  it("penalizes render-blocking resources independent of measured network stats", () => {
    const result = runPerformanceAudit(SLOW_PAGE, PAGE_URL, GOOD_MEASURED);
    const blocking = result.categories.find((c) => c.key === "blocking")!;

    expect(blocking.checks.find((c) => c.key === "blocking-scripts")?.passed).toBe(false);
    expect(blocking.checks.find((c) => c.key === "blocking-stylesheets")?.passed).toBe(false);
  });

  it("scores layout stability down when images/iframes have no reserved space", () => {
    const result = runPerformanceAudit(SLOW_PAGE, PAGE_URL, GOOD_MEASURED);
    const layout = result.categories.find((c) => c.key === "layout")!;

    expect(layout.checks.find((c) => c.key === "image-dimensions")?.passed).toBe(false);
  });

  it("caps the network score's content-volume check for low-content pages", () => {
    const result = runPerformanceAudit(LOW_CONTENT_PAGE, PAGE_URL, GOOD_MEASURED);

    expect(result.lowContent).toBe(true);
  });

  it("always returns exactly 4 categories in a stable order", () => {
    const result = runPerformanceAudit(FAST_PAGE, PAGE_URL, GOOD_MEASURED);

    expect(result.categories.map((c) => c.key)).toEqual(["network", "blocking", "layout", "thirdparty"]);
  });

  it("clamps every category score between 0 and 100", () => {
    for (const [html, measured] of [
      [FAST_PAGE, GOOD_MEASURED],
      [SLOW_PAGE, BAD_MEASURED],
      [LOW_CONTENT_PAGE, GOOD_MEASURED],
    ] as const) {
      const result = scorePerformanceFeatures(extractPerformanceFeatures(html, PAGE_URL, measured));

      for (const cat of result.categories) {
        expect(cat.score).toBeGreaterThanOrEqual(0);
        expect(cat.score).toBeLessThanOrEqual(100);
      }
    }
  });
});
