import { describe, expect, it } from "vitest";

import { extractMarketingSiteFeatures, runMarketingSiteAudit, scoreMarketingSiteFeatures } from "@/lib/marketingSiteAudit";

const STRONG_MARKETING_SITE = `
<!DOCTYPE html>
<html>
<head><title>Acme - Project Management for Remote Teams</title></head>
<body>
  <header><nav><a href="/pricing">Pricing</a><a href="/security">Security</a></nav></header>
  <main>
    <h1>Ship faster with Acme</h1>
    <p>Trusted by 12,000+ teams worldwide to plan sprints and track delivery.</p>
    <div class="logo-strip">
      <img alt="Company A logo" src="/a.png" />
      <img alt="Company B logo" src="/b.png" />
    </div>
    <a href="/signup">Start your free trial</a>
    <a href="/demo">Book a demo</a>
    <p>No credit card required to get started.</p>

    <section>
      <div><h3>Sprint Planning</h3><p>Plan sprints in minutes with drag-and-drop boards.</p></div>
      <div><h3>Async Standups</h3><p>Replace daily meetings with async written updates.</p></div>
      <div><h3>Reporting</h3><p>Real-time burndown charts and velocity reports.</p></div>
    </section>

    <table><thead><tr><th>Plan</th><th>Price</th></tr></thead><tbody><tr><td>Pro</td><td>$29</td></tr></tbody></table>

    <p>SOC 2 Type II certified and GDPR compliant. See our <a href="/security">Security &amp; Trust Center</a>.</p>
    <p>99.99% uptime SLA guaranteed.</p>

    <blockquote>"Acme cut our planning time in half." - A Happy Customer</blockquote>
    <p>Rated 4.8 stars on G2 and Capterra.</p>
  </main>
</body>
</html>
`;

const WEAK_MARKETING_SITE = `
<!DOCTYPE html>
<html>
<head><title>Acme</title></head>
<body>
  <main>
    <h1>Welcome to Acme</h1>
    <p>${"We build software for businesses of all sizes. ".repeat(8)}</p>
    <a href="/contact">Contact us</a>
  </main>
</body>
</html>
`;

const LOW_CONTENT_PAGE = `<!DOCTYPE html><html><body><div id="root"></div></body></html>`;

describe("extractMarketingSiteFeatures", () => {
  it("detects feature cards (heading + description blocks)", () => {
    const f = extractMarketingSiteFeatures(STRONG_MARKETING_SITE);

    expect(f.featureCardCount).toBeGreaterThanOrEqual(3);
  });

  it("detects a pricing link and a comparison table", () => {
    const f = extractMarketingSiteFeatures(STRONG_MARKETING_SITE);

    expect(f.pricingMentioned).toBe(true);
    expect(f.comparisonTablePresent).toBe(true);
  });

  it("detects both self-serve and sales-assisted CTAs", () => {
    const f = extractMarketingSiteFeatures(STRONG_MARKETING_SITE);

    expect(f.selfServeCtaCount).toBeGreaterThan(0);
    expect(f.salesAssistedCtaCount).toBeGreaterThan(0);
    expect(f.noCreditCardMentioned).toBe(true);
  });

  it("detects compliance keywords, security page link, and uptime SLA", () => {
    const f = extractMarketingSiteFeatures(STRONG_MARKETING_SITE);

    expect(f.complianceKeywordsFound).toContain("soc 2");
    expect(f.complianceKeywordsFound).toContain("gdpr");
    expect(f.securityPageLinked).toBe(true);
    expect(f.uptimeSlaMentioned).toBe(true);
  });

  it("detects testimonials, review platforms, logo strip, and customer stats", () => {
    const f = extractMarketingSiteFeatures(STRONG_MARKETING_SITE);

    expect(f.testimonialCount).toBeGreaterThan(0);
    expect(f.reviewPlatformMentioned).toContain("G2");
    expect(f.reviewPlatformMentioned).toContain("Capterra");
    expect(f.logoStripDetected).toBe(true);
    expect(f.customerStatMentioned).toBe(true);
  });

  it("detects a bare platform mention with no domain suffix (\"Rated 4.8 on G2\")", () => {
    const html = `<html><body><h1>Reviews</h1><p>${"Rated 4.8 out of 5 on G2 by real customers. ".repeat(4)}</p></body></html>`;
    const f = extractMarketingSiteFeatures(html);

    expect(f.reviewPlatformMentioned).toContain("G2");
  });

  it("finds none of the above signals on a thin, generic page", () => {
    const f = extractMarketingSiteFeatures(WEAK_MARKETING_SITE);

    expect(f.featureCardCount).toBe(0);
    expect(f.pricingMentioned).toBe(false);
    expect(f.selfServeCtaCount).toBe(0);
    expect(f.salesAssistedCtaCount).toBe(0);
    expect(f.complianceKeywordsFound).toHaveLength(0);
    expect(f.testimonialCount).toBe(0);
  });

  it("flags a near-empty SPA shell as low content", () => {
    const f = extractMarketingSiteFeatures(LOW_CONTENT_PAGE);

    expect(f.lowContent).toBe(true);
  });
});

describe("scoreMarketingSiteFeatures", () => {
  it("gives the strong marketing site a high overall score and grade", () => {
    const result = runMarketingSiteAudit(STRONG_MARKETING_SITE);

    expect(result.overallScore).toBeGreaterThanOrEqual(80);
    expect(["A", "B"]).toContain(result.grade);
  });

  it("gives the weak marketing site a low overall score", () => {
    const result = runMarketingSiteAudit(WEAK_MARKETING_SITE);

    expect(result.overallScore).toBeLessThan(30);
  });

  it("awards the dual-path bonus only when both CTA types are present", () => {
    const result = runMarketingSiteAudit(STRONG_MARKETING_SITE);
    const funnel = result.categories.find((c) => c.key === "funnel")!;

    expect(funnel.checks.find((c) => c.key === "dual-path")?.passed).toBe(true);
  });

  it("does not award the dual-path bonus when only one CTA type is present", () => {
    const html = STRONG_MARKETING_SITE.replace('<a href="/demo">Book a demo</a>', "");
    const result = runMarketingSiteAudit(html);
    const funnel = result.categories.find((c) => c.key === "funnel")!;

    expect(funnel.checks.find((c) => c.key === "dual-path")?.passed).toBe(false);
    expect(funnel.checks.find((c) => c.key === "self-serve-cta")?.passed).toBe(true);
  });

  it("caps the value-communication score for low-content pages", () => {
    const result = runMarketingSiteAudit(LOW_CONTENT_PAGE);
    const value = result.categories.find((c) => c.key === "value")!;

    expect(result.lowContent).toBe(true);
    expect(value.score).toBe(20);
  });

  it("scores enterprise trust down to 0 when no compliance/security/SLA signals exist", () => {
    const result = runMarketingSiteAudit(WEAK_MARKETING_SITE);
    const trust = result.categories.find((c) => c.key === "trust")!;

    expect(trust.score).toBe(0);
  });

  it("always returns exactly 4 categories in a stable order", () => {
    const result = runMarketingSiteAudit(STRONG_MARKETING_SITE);

    expect(result.categories.map((c) => c.key)).toEqual(["value", "funnel", "trust", "proof"]);
  });

  it("clamps every category score between 0 and 100", () => {
    for (const html of [STRONG_MARKETING_SITE, WEAK_MARKETING_SITE, LOW_CONTENT_PAGE]) {
      const result = scoreMarketingSiteFeatures(extractMarketingSiteFeatures(html));

      for (const cat of result.categories) {
        expect(cat.score).toBeGreaterThanOrEqual(0);
        expect(cat.score).toBeLessThanOrEqual(100);
      }
    }
  });
});
