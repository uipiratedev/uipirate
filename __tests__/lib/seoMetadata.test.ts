import { describe, expect, it } from "vitest";

import { extractSeoFeatures, runSeoAudit, scoreSeoFeatures } from "@/lib/seoMetadata";

const PAGE_URL = "https://example.com/product";

const WELL_OPTIMIZED_PAGE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Project Management Software for Remote Teams | Acme</title>
  <meta name="description" content="Acme helps remote teams plan sprints, track tasks, and ship on time. Start a free 14-day trial - no credit card required." />
  <link rel="canonical" href="https://example.com/product" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="icon" href="/favicon.ico" />
  <meta property="og:title" content="Acme Project Management" />
  <meta property="og:description" content="Plan sprints and ship on time." />
  <meta property="og:image" content="https://example.com/og.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Acme Project Management" />
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"SoftwareApplication","name":"Acme"}</script>
</head>
<body>
  <h1>Project Management for Remote Teams</h1>
  <p>${"Acme keeps distributed teams aligned with shared sprints. ".repeat(6)}</p>
  <h2>Why teams switch to Acme</h2>
  <p>${"Fewer status meetings, clearer ownership, faster delivery. ".repeat(6)}</p>
  <h3>Built for remote-first teams</h3>
  <p>${"Async updates replace daily standups entirely. ".repeat(6)}</p>
  <img alt="Acme dashboard screenshot showing a sprint board" src="/dash.png" />
</body>
</html>
`;

const POORLY_OPTIMIZED_PAGE = `
<!DOCTYPE html>
<html>
<head>
  <title>Home</title>
</head>
<body>
  <h3>Welcome</h3>
  <p>${"Some content on the page that is long enough to not be flagged as low content. ".repeat(6)}</p>
  <img src="/hero.png" />
  <img src="/logo.png" alt="" />
</body>
</html>
`;

const NOINDEX_PAGE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Staging - Internal Only</title>
  <meta name="robots" content="noindex, nofollow" />
</head>
<body>
  <h1>Staging</h1>
  <p>${"Internal staging environment content for QA purposes only. ".repeat(6)}</p>
</body>
</html>
`;

const LOW_CONTENT_PAGE = `<!DOCTYPE html><html><body><div id="root"></div></body></html>`;

describe("extractSeoFeatures", () => {
  it("extracts title and meta description", () => {
    const f = extractSeoFeatures(WELL_OPTIMIZED_PAGE, PAGE_URL);

    expect(f.title).toBe("Project Management Software for Remote Teams | Acme");
    expect(f.metaDescriptionLength).toBeGreaterThan(70);
  });

  it("resolves a relative canonical href against the page URL and detects a match", () => {
    const f = extractSeoFeatures(WELL_OPTIMIZED_PAGE, PAGE_URL);

    expect(f.canonicalMatchesPage).toBe(true);
  });

  it("detects a canonical that points elsewhere", () => {
    const html = WELL_OPTIMIZED_PAGE.replace(
      'href="https://example.com/product"',
      'href="https://example.com/different-page"',
    );
    const f = extractSeoFeatures(html, PAGE_URL);

    expect(f.canonicalHref).toBe("https://example.com/different-page");
    expect(f.canonicalMatchesPage).toBe(false);
  });

  it("resolves a root-relative canonical href correctly", () => {
    const html = WELL_OPTIMIZED_PAGE.replace(
      'href="https://example.com/product"',
      'href="/product"',
    );
    const f = extractSeoFeatures(html, PAGE_URL);

    expect(f.canonicalMatchesPage).toBe(true);
  });

  it("detects noindex from the robots meta tag", () => {
    const f = extractSeoFeatures(NOINDEX_PAGE, PAGE_URL);

    expect(f.isNoindex).toBe(true);
  });

  it("counts exactly one h1 and captures its text", () => {
    const f = extractSeoFeatures(WELL_OPTIMIZED_PAGE, PAGE_URL);

    expect(f.h1Count).toBe(1);
    expect(f.h1Text).toBe("Project Management for Remote Teams");
  });

  it("records the page's actual heading sequence", () => {
    const f = extractSeoFeatures(POORLY_OPTIMIZED_PAGE, PAGE_URL);

    expect(f.headingSequence).toEqual([3]);
  });

  it("detects a skipped heading level between two sequential headings (h1 -> h3, no h2)", () => {
    const html = `<html lang="en"><head><title>Test Page With A Good Length</title></head><body><h1>Title</h1><h3>Skips h2</h3></body></html>`;
    const f = extractSeoFeatures(html, PAGE_URL);

    expect(f.hasSkippedHeadingLevel).toBe(true);
  });

  it("does not flag a single lone heading as a 'skip' (WCAG G141 compares sequential headings)", () => {
    // A lone <h3> with nothing else is a real problem - but it's captured
    // by the separate "exactly one h1" check, not by the skip-detector,
    // since there's no *sequence* of headings to compare against.
    const f = extractSeoFeatures(POORLY_OPTIMIZED_PAGE, PAGE_URL);

    expect(f.hasSkippedHeadingLevel).toBe(false);
  });

  it("does not flag a properly nested heading sequence as skipped", () => {
    const f = extractSeoFeatures(WELL_OPTIMIZED_PAGE, PAGE_URL);

    expect(f.hasSkippedHeadingLevel).toBe(false);
  });

  it("counts images missing alt text (including empty alt)", () => {
    const f = extractSeoFeatures(POORLY_OPTIMIZED_PAGE, PAGE_URL);

    expect(f.imgCount).toBe(2);
    expect(f.imgMissingAltCount).toBe(2);
  });

  it("extracts Open Graph and Twitter Card tags", () => {
    const f = extractSeoFeatures(WELL_OPTIMIZED_PAGE, PAGE_URL);

    expect(f.ogTags["og:title"]).toBe("Acme Project Management");
    expect(f.twitterTags["twitter:card"]).toBe("summary_large_image");
  });

  it("parses JSON-LD and extracts @type", () => {
    const f = extractSeoFeatures(WELL_OPTIMIZED_PAGE, PAGE_URL);

    expect(f.jsonLdCount).toBe(1);
    expect(f.jsonLdTypes).toContain("SoftwareApplication");
  });

  it("flags a near-empty SPA shell as low content", () => {
    const f = extractSeoFeatures(LOW_CONTENT_PAGE, PAGE_URL);

    expect(f.lowContent).toBe(true);
  });
});

describe("scoreSeoFeatures", () => {
  it("gives the well-optimized fixture a high overall score and grade", () => {
    const result = runSeoAudit(WELL_OPTIMIZED_PAGE, PAGE_URL);

    expect(result.overallScore).toBeGreaterThanOrEqual(80);
    expect(["A", "B"]).toContain(result.grade);
  });

  it("gives the poorly-optimized fixture a low score", () => {
    const result = runSeoAudit(POORLY_OPTIMIZED_PAGE, PAGE_URL);

    expect(result.overallScore).toBeLessThan(60);
  });

  it("penalizes a title that is too short", () => {
    const result = runSeoAudit(POORLY_OPTIMIZED_PAGE, PAGE_URL);
    const metadata = result.categories.find((c) => c.key === "metadata")!;

    expect(metadata.checks.find((c) => c.key === "title")?.passed).toBe(false);
  });

  it("scores the heading category down for a missing h1", () => {
    const result = runSeoAudit(POORLY_OPTIMIZED_PAGE, PAGE_URL);
    const headings = result.categories.find((c) => c.key === "headings")!;

    expect(headings.checks.find((c) => c.key === "single-h1")?.passed).toBe(false);
  });

  it("surfaces isNoindex at the top level regardless of other scores", () => {
    const result = runSeoAudit(NOINDEX_PAGE, PAGE_URL);

    expect(result.isNoindex).toBe(true);
  });

  it("scores social preview down when no Open Graph/Twitter/JSON-LD tags exist", () => {
    const result = runSeoAudit(POORLY_OPTIMIZED_PAGE, PAGE_URL);
    const social = result.categories.find((c) => c.key === "social")!;

    expect(social.score).toBeLessThan(30);
  });

  it("caps the metadata score for low-content pages with an explanatory check", () => {
    const result = runSeoAudit(LOW_CONTENT_PAGE, PAGE_URL);
    const metadata = result.categories.find((c) => c.key === "metadata")!;

    expect(result.lowContent).toBe(true);
    expect(metadata.score).toBe(20);
  });

  it("always returns exactly 4 categories in a stable order", () => {
    const result = runSeoAudit(WELL_OPTIMIZED_PAGE, PAGE_URL);

    expect(result.categories.map((c) => c.key)).toEqual(["metadata", "indexability", "headings", "social"]);
  });

  it("clamps every category score between 0 and 100", () => {
    for (const html of [WELL_OPTIMIZED_PAGE, POORLY_OPTIMIZED_PAGE, NOINDEX_PAGE, LOW_CONTENT_PAGE]) {
      const result = scoreSeoFeatures(extractSeoFeatures(html, PAGE_URL));

      for (const cat of result.categories) {
        expect(cat.score).toBeGreaterThanOrEqual(0);
        expect(cat.score).toBeLessThanOrEqual(100);
      }
    }
  });
});
