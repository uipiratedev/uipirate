// SaaS marketing website heuristic auditor.
//
// Reads the STATIC server-rendered HTML a URL returns and checks for the
// specific structural and copy patterns that differentiate a B2B SaaS
// marketing site from a generic brochure site: a legible feature grid, a
// clear self-serve-vs-sales-assisted conversion path, enterprise trust
// signals (compliance badges, security pages), and third-party social
// proof. Every check is a deterministic rule over the parsed DOM and
// visible text - no LLM, no guesswork.

import * as cheerio from "cheerio";

export interface MarketingSiteFeatures {
  bodyTextLength: number;
  elementCount: number;
  lowContent: boolean;

  featureCardCount: number;
  pricingMentioned: boolean;
  comparisonTablePresent: boolean;

  selfServeCtaCount: number;
  salesAssistedCtaCount: number;
  noCreditCardMentioned: boolean;

  complianceBadgeCount: number;
  complianceKeywordsFound: string[];
  securityPageLinked: boolean;
  uptimeSlaMentioned: boolean;

  testimonialCount: number;
  reviewPlatformMentioned: string[];
  logoStripDetected: boolean;
  customerStatMentioned: boolean;
}

const COMPLIANCE_KEYWORDS = [
  "soc 2",
  "soc2",
  "iso 27001",
  "iso27001",
  "gdpr",
  "hipaa",
  "ccpa",
  "pci dss",
  "pci-dss",
];
// Word-boundary regexes rather than plain substring checks - real marketing
// copy almost always says the platform's bare name ("Rated 4.8 on G2"), not
// its domain, and a short token like "g2" needs a boundary to avoid
// matching incidentally inside unrelated words.
const REVIEW_PLATFORM_PATTERNS: { label: string; pattern: RegExp }[] = [
  { label: "G2", pattern: /\bg2\b/i },
  { label: "Capterra", pattern: /\bcapterra\b/i },
  { label: "TrustRadius", pattern: /\btrustradius\b/i },
  { label: "GetApp", pattern: /\bgetapp\b/i },
  { label: "Product Hunt", pattern: /\bproduct\s*hunt\b/i },
];
const SELF_SERVE_PATTERN = /\b(start (a |your )?free trial|sign up free|get started free|try (it )?free|start for free|create (a |your )?free account)\b/i;
const SALES_ASSISTED_PATTERN = /\b(book a demo|request a demo|talk to sales|contact sales|schedule a (demo|call)|speak (with|to) (an? )?expert)\b/i;
const UPTIME_SLA_PATTERN = /\b(\d{2}\.\d+%|\d{2}%)\s*(uptime|sla)\b|\buptime sla\b/i;
const CUSTOMER_STAT_PATTERN = /\b[\d,]{3,}\+?\s*(companies|teams|customers|businesses|users|organizations)\b/i;

export function extractMarketingSiteFeatures(html: string): MarketingSiteFeatures {
  const $ = cheerio.load(html);

  $("script, style, noscript, svg").remove();

  const bodyText = $("body").text().replace(/\s+/g, " ").trim();
  const lowerBodyText = bodyText.toLowerCase();
  const elementCount = $("body *").length;
  const lowContent = bodyText.length < 150 && elementCount < 15;

  // Feature grid: repeated sibling blocks that each contain a heading and a
  // short description - the structural signature of a "features" section
  // regardless of what classes the site author happened to use.
  let featureCardCount = 0;

  $("div, li, section, article").each((_, el) => {
    const $el = $(el);
    const heading = $el.children("h1, h2, h3, h4, h5, h6").first();
    const paragraph = $el.children("p").first();

    if (heading.length > 0 && paragraph.length > 0) {
      const headingText = heading.text().trim();
      const paraText = paragraph.text().trim();

      if (headingText.length > 0 && headingText.length <= 60 && paraText.length > 0 && paraText.length <= 200) {
        featureCardCount++;
      }
    }
  });

  const pricingMentioned = /\bpricing\b/i.test(bodyText) || $("a[href*='pricing' i]").length > 0;
  const comparisonTablePresent = $("table").length > 0;

  let selfServeCtaCount = 0;
  let salesAssistedCtaCount = 0;

  $("a, button").each((_, el) => {
    const text = $(el).text().trim();

    if (!text || text.length > 60) return;
    if (SELF_SERVE_PATTERN.test(text)) selfServeCtaCount++;
    if (SALES_ASSISTED_PATTERN.test(text)) salesAssistedCtaCount++;
  });

  const noCreditCardMentioned = /no credit card/i.test(bodyText);

  const complianceKeywordsFound = COMPLIANCE_KEYWORDS.filter((kw) => lowerBodyText.includes(kw));
  const complianceBadgeCount = $(
    "[class*='badge' i][class*='compliance' i], [class*='trust' i][class*='badge' i], img[alt*='soc 2' i], img[alt*='iso 27001' i], img[alt*='gdpr' i]",
  ).length;
  const securityPageLinked = $("a[href*='security' i], a[href*='trust' i]").filter((_, el) =>
    /security|trust( center)?/i.test($(el).text()),
  ).length > 0;
  const uptimeSlaMentioned = UPTIME_SLA_PATTERN.test(bodyText);

  const testimonialCount = $(
    "[class*='testimonial' i], [class*='review' i][class*='card' i], blockquote",
  ).length;
  const reviewPlatformMentioned = REVIEW_PLATFORM_PATTERNS.filter((p) => p.pattern.test(bodyText)).map(
    (p) => p.label,
  );
  const logoStripDetected =
    $("[class*='logo' i][class*='strip' i], [class*='logo' i][class*='cloud' i], [class*='logo' i][class*='wall' i]").length >
      0 || /trusted by|used by teams at|as seen in/i.test(bodyText);
  const customerStatMentioned = CUSTOMER_STAT_PATTERN.test(bodyText);

  return {
    bodyTextLength: bodyText.length,
    elementCount,
    lowContent,
    featureCardCount,
    pricingMentioned,
    comparisonTablePresent,
    selfServeCtaCount,
    salesAssistedCtaCount,
    noCreditCardMentioned,
    complianceBadgeCount,
    complianceKeywordsFound,
    securityPageLinked,
    uptimeSlaMentioned,
    testimonialCount,
    reviewPlatformMentioned,
    logoStripDetected,
    customerStatMentioned,
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

export interface MarketingSiteAuditResult {
  overallScore: number;
  grade: "A" | "B" | "C" | "D" | "F";
  lowContent: boolean;
  categories: CategoryResult[];
}

function clampScore(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function scoreToGrade(score: number): MarketingSiteAuditResult["grade"] {
  if (score >= 90) return "A";
  if (score >= 75) return "B";
  if (score >= 60) return "C";
  if (score >= 40) return "D";

  return "F";
}

export function scoreMarketingSiteFeatures(f: MarketingSiteFeatures): MarketingSiteAuditResult {
  // Value communication
  const valueChecks: CheckResult[] = [];
  let valueScore = 0;

  if (f.lowContent) {
    valueScore = 20;
    valueChecks.push({
      key: "content-volume",
      label: "Meaningful server-rendered content",
      passed: false,
      detail: `Only ${f.bodyTextLength} characters of text and ${f.elementCount} elements were found - this page may be client-rendered or behind authentication.`,
    });
  } else {
    valueChecks.push({
      key: "content-volume",
      label: "Meaningful server-rendered content",
      passed: true,
      detail: `${f.elementCount} elements and ${f.bodyTextLength} characters of text found.`,
    });

    valueScore += f.featureCardCount >= 3 ? 40 : f.featureCardCount > 0 ? 20 : 0;
    valueChecks.push({
      key: "feature-grid",
      label: "Legible feature grid (heading + description blocks)",
      passed: f.featureCardCount >= 3,
      detail:
        f.featureCardCount > 0
          ? `${f.featureCardCount} heading+description block(s) found that look like feature cards.`
          : "No repeated heading+description blocks found - features may be communicated as prose instead of scannable cards.",
    });

    valueScore += f.pricingMentioned ? 30 : 0;
    valueChecks.push({
      key: "pricing-visible",
      label: "Pricing mentioned or linked",
      passed: f.pricingMentioned,
      detail: f.pricingMentioned
        ? "Found a pricing mention or a link to a pricing page."
        : "No mention of pricing or link to a pricing page found - B2B buyers increasingly bounce from sites that hide pricing entirely.",
    });

    valueScore += f.comparisonTablePresent ? 30 : 0;
    valueChecks.push({
      key: "comparison-table",
      label: "Feature/plan comparison table",
      passed: f.comparisonTablePresent,
      detail: f.comparisonTablePresent
        ? "A <table> element was found - likely a plan or feature comparison."
        : "No <table> element found.",
    });
  }

  // Conversion funnel clarity
  const funnelChecks: CheckResult[] = [];
  let funnelScore = 0;

  const hasSelfServe = f.selfServeCtaCount > 0;
  const hasSalesAssisted = f.salesAssistedCtaCount > 0;

  funnelScore += hasSelfServe ? 35 : 0;
  funnelChecks.push({
    key: "self-serve-cta",
    label: "Self-serve signup CTA (\"Start free trial\")",
    passed: hasSelfServe,
    detail: hasSelfServe
      ? `${f.selfServeCtaCount} self-serve CTA(s) found.`
      : "No self-serve signup CTA found - every path to conversion may require talking to sales first.",
  });

  funnelScore += hasSalesAssisted ? 25 : 0;
  funnelChecks.push({
    key: "sales-assisted-cta",
    label: "Sales-assisted CTA (\"Book a demo\")",
    passed: hasSalesAssisted,
    detail: hasSalesAssisted
      ? `${f.salesAssistedCtaCount} sales-assisted CTA(s) found.`
      : "No demo/sales-assisted CTA found - larger accounts that want to talk to a human before buying have no obvious path.",
  });

  funnelScore += hasSelfServe && hasSalesAssisted ? 20 : 0;
  funnelChecks.push({
    key: "dual-path",
    label: "Both self-serve AND sales-assisted paths offered",
    passed: hasSelfServe && hasSalesAssisted,
    detail:
      hasSelfServe && hasSalesAssisted
        ? "Offers both a self-serve and a sales-assisted path - lets SMB and enterprise buyers each convert the way they prefer."
        : "Only one conversion path is offered - a common gap is enterprise-only sites with no free trial, or dev-tool sites with no path for buyers who want a guided demo.",
  });

  funnelScore += f.noCreditCardMentioned ? 20 : 0;
  funnelChecks.push({
    key: "no-credit-card",
    label: "\"No credit card required\" stated",
    passed: f.noCreditCardMentioned,
    detail: f.noCreditCardMentioned
      ? "Found copy stating no credit card is required to start."
      : "No copy found removing the \"will I be charged\" hesitation before signup.",
  });

  // Enterprise trust & compliance
  const trustChecks: CheckResult[] = [];
  let trustScore = 0;

  const hasComplianceSignal = f.complianceKeywordsFound.length > 0 || f.complianceBadgeCount > 0;

  trustScore += hasComplianceSignal ? 45 : 0;
  trustChecks.push({
    key: "compliance-signals",
    label: "Compliance/certification signals (SOC 2, ISO 27001, GDPR, HIPAA)",
    passed: hasComplianceSignal,
    detail:
      f.complianceKeywordsFound.length > 0
        ? `Found: ${f.complianceKeywordsFound.join(", ")}.`
        : f.complianceBadgeCount > 0
          ? `${f.complianceBadgeCount} compliance-badge-like element(s) found.`
          : "No compliance/certification keywords or badges found - enterprise buyers often filter vendors out at this exact check.",
  });

  trustScore += f.securityPageLinked ? 30 : 0;
  trustChecks.push({
    key: "security-page",
    label: "Security/trust center page linked",
    passed: f.securityPageLinked,
    detail: f.securityPageLinked
      ? "Found a link to a security or trust center page."
      : "No link to a dedicated security/trust page found.",
  });

  trustScore += f.uptimeSlaMentioned ? 25 : 0;
  trustChecks.push({
    key: "uptime-sla",
    label: "Uptime/SLA commitment stated",
    passed: f.uptimeSlaMentioned,
    detail: f.uptimeSlaMentioned
      ? "Found an uptime percentage or SLA mention."
      : "No uptime percentage or SLA commitment found.",
  });

  // Social proof
  const proofChecks: CheckResult[] = [];
  let proofScore = 0;

  proofScore += f.testimonialCount > 0 ? 30 : 0;
  proofChecks.push({
    key: "testimonials",
    label: "Testimonials or quote blocks",
    passed: f.testimonialCount > 0,
    detail:
      f.testimonialCount > 0
        ? `${f.testimonialCount} testimonial/quote-like element(s) found.`
        : "No testimonial or blockquote elements found.",
  });

  proofScore += f.reviewPlatformMentioned.length > 0 ? 25 : 0;
  proofChecks.push({
    key: "review-platforms",
    label: "Third-party review platform mentioned (G2, Capterra, etc.)",
    passed: f.reviewPlatformMentioned.length > 0,
    detail:
      f.reviewPlatformMentioned.length > 0
        ? `Mentions: ${f.reviewPlatformMentioned.join(", ")}.`
        : "No mention of G2, Capterra, TrustRadius, or similar third-party review platforms.",
  });

  proofScore += f.logoStripDetected ? 25 : 0;
  proofChecks.push({
    key: "logo-strip",
    label: "Customer logo strip (\"Trusted by...\")",
    passed: f.logoStripDetected,
    detail: f.logoStripDetected
      ? "Found a customer logo strip or \"trusted by\"-style copy."
      : "No customer logo strip detected.",
  });

  proofScore += f.customerStatMentioned ? 20 : 0;
  proofChecks.push({
    key: "customer-stat",
    label: "Customer count / scale stat (\"10,000+ teams\")",
    passed: f.customerStatMentioned,
    detail: f.customerStatMentioned
      ? "Found a specific customer-count or scale statistic."
      : "No specific customer-count statistic found.",
  });

  const categories: CategoryResult[] = [
    { key: "value", label: "Feature & Value Communication", score: clampScore(valueScore), checks: valueChecks },
    { key: "funnel", label: "Conversion Funnel Clarity", score: clampScore(funnelScore), checks: funnelChecks },
    { key: "trust", label: "Enterprise Trust & Compliance", score: clampScore(trustScore), checks: trustChecks },
    { key: "proof", label: "Social Proof & Credibility", score: clampScore(proofScore), checks: proofChecks },
  ];

  const overallScore = clampScore(categories.reduce((sum, c) => sum + c.score, 0) / categories.length);

  return {
    overallScore,
    grade: scoreToGrade(overallScore),
    lowContent: f.lowContent,
    categories,
  };
}

export function runMarketingSiteAudit(html: string): MarketingSiteAuditResult {
  return scoreMarketingSiteFeatures(extractMarketingSiteFeatures(html));
}
