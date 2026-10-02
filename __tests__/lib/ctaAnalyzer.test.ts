import { describe, expect, it } from "vitest";

import { extractCtaFeatures, runCtaAudit, scoreCtaFeatures } from "@/lib/ctaAnalyzer";

const STRONG_CTA_PAGE = `
<!DOCTYPE html>
<html>
<head>
<style>
.hero-btn { color: #ffffff; background-color: #FF5B04; }
.secondary-btn { color: #1f2937; background-color: #f3f4f6; }
</style>
</head>
<body>
  <header class="hero">
    <h1>Ship faster with Acme</h1>
    <button class="hero-btn">Start My Free Trial</button>
    <a class="secondary-btn" href="/demo">Book a demo</a>
  </header>
  <main>
    <p>${"Plenty of body copy explaining the product in detail. ".repeat(10)}</p>
    <section>
      <h2>Ready to get started?</h2>
      <button class="hero-btn">Create your account</button>
    </section>
  </main>
</body>
</html>
`;

const WEAK_CTA_PAGE = `
<!DOCTYPE html>
<html>
<body>
  <main>
    <h1>Welcome</h1>
    <p>${"Some generic marketing copy about our product. ".repeat(10)}</p>
    <button>Submit</button>
  </main>
</body>
</html>
`;

const NO_CTA_PAGE = `
<!DOCTYPE html>
<html>
<body>
  <main>
    <h1>Blog</h1>
    <p>${"This is an article with no calls to action at all. ".repeat(10)}</p>
  </main>
</body>
</html>
`;

const UNRESOLVABLE_CONTRAST_PAGE = `
<!DOCTYPE html>
<html>
<body>
  <header class="hero">
    <button class="btn-primary tw-bg-orange-500 tw-text-white">Get started free</button>
  </header>
  <p>${"Body copy with no embedded style block or inline colors at all. ".repeat(8)}</p>
</body>
</html>
`;

const LOW_CONTENT_PAGE = `<!DOCTYPE html><html><body><div id="root"></div></body></html>`;

describe("extractCtaFeatures", () => {
  it("detects CTA candidates from buttons and button-styled links", () => {
    const f = extractCtaFeatures(STRONG_CTA_PAGE);

    expect(f.candidates.length).toBeGreaterThanOrEqual(3);
  });

  it("flags a CTA inside the header/hero landmark as above the fold", () => {
    const f = extractCtaFeatures(STRONG_CTA_PAGE);
    const heroButton = f.candidates.find((c) => c.text === "Start My Free Trial");

    expect(heroButton?.aboveFold).toBe(true);
  });

  it("detects strong action-verb CTAs", () => {
    const f = extractCtaFeatures(STRONG_CTA_PAGE);

    expect(f.candidates.find((c) => c.text === "Start My Free Trial")?.isStrongVerb).toBe(true);
    expect(f.candidates.find((c) => c.text === "Create your account")?.isStrongVerb).toBe(true);
  });

  it("detects first-person CTA phrasing", () => {
    const f = extractCtaFeatures(STRONG_CTA_PAGE);

    expect(f.candidates.find((c) => c.text === "Start My Free Trial")?.isFirstPerson).toBe(true);
  });

  it("flags a purely generic CTA as generic-only", () => {
    const f = extractCtaFeatures(WEAK_CTA_PAGE);

    expect(f.candidates[0].isGenericOnly).toBe(true);
    expect(f.candidates[0].isStrongVerb).toBe(false);
  });

  it("resolves real contrast from an embedded <style> block matched by class", () => {
    const f = extractCtaFeatures(STRONG_CTA_PAGE);
    const heroButton = f.candidates.find((c) => c.text === "Start My Free Trial");

    expect(heroButton?.contrast).not.toBeNull();
    // white (#fff) on #FF5B04 - a real, specific WCAG ratio, not a guess.
    expect(heroButton?.contrast?.ratio).toBeGreaterThan(1);
  });

  it("reports contrast as null when no colors are resolvable (Tailwind-only classes)", () => {
    const f = extractCtaFeatures(UNRESOLVABLE_CONTRAST_PAGE);

    expect(f.candidates[0].contrast).toBeNull();
  });

  it("finds zero candidates on a page with no CTAs", () => {
    const f = extractCtaFeatures(NO_CTA_PAGE);

    expect(f.candidates).toHaveLength(0);
  });

  it("flags a near-empty SPA shell as low content", () => {
    const f = extractCtaFeatures(LOW_CONTENT_PAGE);

    expect(f.lowContent).toBe(true);
  });
});

describe("scoreCtaFeatures", () => {
  it("gives the strong CTA page a high overall score", () => {
    const result = runCtaAudit(STRONG_CTA_PAGE);

    expect(result.overallScore).toBeGreaterThanOrEqual(75);
    expect(["A", "B"]).toContain(result.grade);
  });

  it("penalizes a page relying solely on generic CTA text", () => {
    const result = runCtaAudit(WEAK_CTA_PAGE);
    const copy = result.categories.find((c) => c.key === "copy")!;

    expect(copy.checks.find((c) => c.key === "no-generic-only")?.passed).toBe(false);
  });

  it("caps discoverability score and explains when no CTA exists at all", () => {
    const result = runCtaAudit(NO_CTA_PAGE);
    const discovery = result.categories.find((c) => c.key === "discovery")!;

    expect(discovery.score).toBe(15);
    expect(discovery.checks.find((c) => c.key === "cta-found")?.passed).toBe(false);
  });

  it("does not penalize the contrast category when no CTA has resolvable colors", () => {
    const result = runCtaAudit(UNRESOLVABLE_CONTRAST_PAGE);
    const contrast = result.categories.find((c) => c.key === "contrast")!;

    expect(contrast.checks[0].key).toBe("contrast-not-measurable");
    expect(contrast.checks[0].passed).toBe(true);
    expect(result.measurableContrastCount).toBe(0);
  });

  it("scores the contrast category using real WCAG pass/fail when colors are resolvable", () => {
    const result = runCtaAudit(STRONG_CTA_PAGE);
    const contrast = result.categories.find((c) => c.key === "contrast")!;

    expect(result.measurableContrastCount).toBeGreaterThan(0);
    expect(contrast.checks[0].key).toBe("measurable-contrast");
  });

  it("caps the discovery score for low-content pages", () => {
    const result = runCtaAudit(LOW_CONTENT_PAGE);
    const discovery = result.categories.find((c) => c.key === "discovery")!;

    expect(result.lowContent).toBe(true);
    expect(discovery.score).toBe(20);
  });

  it("always returns exactly 3 categories in a stable order", () => {
    const result = runCtaAudit(STRONG_CTA_PAGE);

    expect(result.categories.map((c) => c.key)).toEqual(["discovery", "copy", "contrast"]);
  });

  it("clamps every category score between 0 and 100", () => {
    for (const html of [STRONG_CTA_PAGE, WEAK_CTA_PAGE, NO_CTA_PAGE, UNRESOLVABLE_CONTRAST_PAGE, LOW_CONTENT_PAGE]) {
      const result = scoreCtaFeatures(extractCtaFeatures(html));

      for (const cat of result.categories) {
        expect(cat.score).toBeGreaterThanOrEqual(0);
        expect(cat.score).toBeLessThanOrEqual(100);
      }
    }
  });
});
