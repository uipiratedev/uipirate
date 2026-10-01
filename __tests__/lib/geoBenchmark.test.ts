import { describe, expect, it } from "vitest";

import { AI_BOTS } from "@/data/bots";
import {
  compareGeoReadiness,
  extractDomainGeoFeatures,
  parseRobotsTxt,
  resolveBotAccess,
  scoreDomainGeoReadiness,
} from "@/lib/geoBenchmark";

const GPTBOT = AI_BOTS.find((b) => b.userAgent === "GPTBot")!;
const PERPLEXITYBOT = AI_BOTS.find((b) => b.userAgent === "PerplexityBot")!;

describe("parseRobotsTxt", () => {
  it("parses per-agent allow/disallow rules", () => {
    const { ruleSets } = parseRobotsTxt(`User-agent: GPTBot\nDisallow: /\n\nUser-agent: *\nAllow: /`);

    expect(ruleSets).toEqual([
      { userAgent: "GPTBot", allow: [], disallow: ["/"] },
      { userAgent: "*", allow: ["/"], disallow: [] },
    ]);
  });

  it("detects a declared sitemap", () => {
    const { sitemapDeclared } = parseRobotsTxt(`User-agent: *\nAllow: /\nSitemap: https://example.com/sitemap.xml`);

    expect(sitemapDeclared).toBe(true);
  });

  it("reports no sitemap when none is declared", () => {
    const { sitemapDeclared } = parseRobotsTxt(`User-agent: *\nAllow: /`);

    expect(sitemapDeclared).toBe(false);
  });

  it("ignores comment lines", () => {
    const { ruleSets } = parseRobotsTxt(`# comment\nUser-agent: *\n# another comment\nDisallow: /admin`);

    expect(ruleSets).toEqual([{ userAgent: "*", allow: [], disallow: ["/admin"] }]);
  });
});

describe("resolveBotAccess", () => {
  it("allows a bot with no matching rules at all", () => {
    expect(resolveBotAccess(GPTBOT, [])).toBe("allowed");
  });

  it("blocks a bot with a specific Disallow: / rule", () => {
    const { ruleSets } = parseRobotsTxt(`User-agent: GPTBot\nDisallow: /`);

    expect(resolveBotAccess(GPTBOT, ruleSets)).toBe("blocked");
  });

  it("falls back to the wildcard rule when no bot-specific rule exists", () => {
    const { ruleSets } = parseRobotsTxt(`User-agent: *\nDisallow: /`);

    expect(resolveBotAccess(GPTBOT, ruleSets)).toBe("blocked");
  });

  it("prefers a bot-specific rule over the wildcard rule", () => {
    const { ruleSets } = parseRobotsTxt(`User-agent: *\nDisallow: /\n\nUser-agent: GPTBot\nAllow: /`);

    expect(resolveBotAccess(GPTBOT, ruleSets)).toBe("allowed");
  });

  it("treats a partial disallow (not blocking root) as partial access", () => {
    const { ruleSets } = parseRobotsTxt(`User-agent: GPTBot\nDisallow: /private`);

    expect(resolveBotAccess(GPTBOT, ruleSets)).toBe("partial");
  });

  it("treats Disallow: / plus a specific Allow: as partial, not fully blocked", () => {
    const { ruleSets } = parseRobotsTxt(`User-agent: GPTBot\nDisallow: /\nAllow: /blog`);

    expect(resolveBotAccess(GPTBOT, ruleSets)).toBe("partial");
  });

  it("matches user-agent names case-insensitively", () => {
    const { ruleSets } = parseRobotsTxt(`User-agent: gptbot\nDisallow: /`);

    expect(resolveBotAccess(GPTBOT, ruleSets)).toBe("blocked");
  });
});

describe("extractDomainGeoFeatures", () => {
  it("reports robotsTxtFound: false when robots.txt is null (not fetched/404)", () => {
    const f = extractDomainGeoFeatures(null, false, false, []);

    expect(f.robotsTxtFound).toBe(false);
    expect(f.botResults.every((b) => b.status === "allowed")).toBe(true);
  });

  it("includes a bot access result for every bot in the shared AI_BOTS list", () => {
    const f = extractDomainGeoFeatures("User-agent: *\nAllow: /", false, false, []);

    expect(f.botResults).toHaveLength(AI_BOTS.length);
  });

  it("deduplicates JSON-LD types into a count", () => {
    const f = extractDomainGeoFeatures(null, false, false, ["Organization", "Organization", "WebSite"]);

    expect(f.jsonLdTypeCount).toBe(2);
  });
});

describe("scoreDomainGeoReadiness", () => {
  it("gives a fully open, fully-equipped domain a top score", () => {
    const features = extractDomainGeoFeatures("User-agent: *\nAllow: /\nSitemap: https://x.com/sitemap.xml", true, true, [
      "Organization",
      "WebSite",
      "FAQPage",
    ]);
    const score = scoreDomainGeoReadiness(features);

    expect(score.overallScore).toBe(100);
    expect(score.grade).toBe("A");
  });

  it("gives a domain that blocks every AI bot and has no AI files a low score", () => {
    const features = extractDomainGeoFeatures("User-agent: *\nDisallow: /", false, false, []);
    const score = scoreDomainGeoReadiness(features);

    expect(score.overallScore).toBeLessThan(20);
    expect(score.grade).toBe("F");
  });

  it("weights bot access as the largest single pillar (50%)", () => {
    const allBlocked = scoreDomainGeoReadiness(
      extractDomainGeoFeatures("User-agent: *\nDisallow: /", true, true, ["Organization", "WebSite", "FAQPage"]),
    );

    // aiInfrastructure=100, schema=100, botAccess=0 -> overall should be
    // close to 0.3*100 + 0.2*100 = 50, well below a domain with bots open.
    expect(allBlocked.overallScore).toBeCloseTo(50, 0);
  });

  it("scores schema readiness by distinct JSON-LD type count", () => {
    const none = scoreDomainGeoReadiness(extractDomainGeoFeatures(null, false, false, []));
    const one = scoreDomainGeoReadiness(extractDomainGeoFeatures(null, false, false, ["Organization"]));
    const three = scoreDomainGeoReadiness(
      extractDomainGeoFeatures(null, false, false, ["Organization", "WebSite", "Product"]),
    );

    expect(none.pillars.schemaScore).toBe(0);
    expect(one.pillars.schemaScore).toBeLessThan(three.pillars.schemaScore);
    expect(three.pillars.schemaScore).toBe(100);
  });
});

describe("compareGeoReadiness", () => {
  it("declares the higher-scoring domain the overall winner", () => {
    const strong = scoreDomainGeoReadiness(
      extractDomainGeoFeatures("User-agent: *\nAllow: /", true, true, ["Organization", "WebSite", "FAQPage"]),
    );
    const weak = scoreDomainGeoReadiness(extractDomainGeoFeatures("User-agent: *\nDisallow: /", false, false, []));

    const comparison = compareGeoReadiness(strong, weak);

    expect(comparison.overallWinner).toBe("primary");
  });

  it("declares a tie when both domains score identically", () => {
    const a = scoreDomainGeoReadiness(extractDomainGeoFeatures("User-agent: *\nAllow: /", true, false, []));
    const b = scoreDomainGeoReadiness(extractDomainGeoFeatures("User-agent: *\nAllow: /", true, false, []));

    expect(compareGeoReadiness(a, b).overallWinner).toBe("tie");
  });

  it("lists bots blocked only by the primary domain, not the competitor", () => {
    const primary = scoreDomainGeoReadiness(
      extractDomainGeoFeatures(`User-agent: PerplexityBot\nDisallow: /`, false, false, []),
    );
    const competitor = scoreDomainGeoReadiness(extractDomainGeoFeatures("User-agent: *\nAllow: /", false, false, []));

    const comparison = compareGeoReadiness(primary, competitor);

    expect(comparison.blockedBotsPrimaryOnly).toContain(PERPLEXITYBOT.id);
    expect(comparison.blockedBotsCompetitorOnly).toHaveLength(0);
  });

  it("produces exactly 3 pillar comparisons", () => {
    const a = scoreDomainGeoReadiness(extractDomainGeoFeatures(null, false, false, []));
    const b = scoreDomainGeoReadiness(extractDomainGeoFeatures(null, false, false, []));

    expect(compareGeoReadiness(a, b).pillars).toHaveLength(3);
  });
});
