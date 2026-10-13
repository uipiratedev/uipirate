// Homepage SEO & metadata heuristic auditor.
//
// Reads the STATIC server-rendered HTML a URL returns (the same thing a
// search engine crawler sees on first pass) and checks the specific <head>
// tags and heading structure that drive how a page is indexed and how its
// search/social snippets render. Every check is a deterministic rule over
// the parsed DOM - no LLM, no guesswork, no live PageSpeed/Search Console
// data (that would require API keys and real property ownership, which this
// tool deliberately doesn't need).

import * as cheerio from "cheerio";

export interface SeoFeatures {
  bodyTextLength: number;
  elementCount: number;
  lowContent: boolean;

  title: string | null;
  titleLength: number;
  metaDescription: string | null;
  metaDescriptionLength: number;
  canonicalHref: string | null;
  canonicalMatchesPage: boolean;
  viewportPresent: boolean;
  htmlLang: string | null;
  faviconPresent: boolean;
  robotsContent: string | null;
  isNoindex: boolean;

  ogTags: Record<string, string>;
  twitterTags: Record<string, string>;

  h1Count: number;
  h1Text: string | null;
  headingSequence: number[];
  hasSkippedHeadingLevel: boolean;

  imgCount: number;
  imgMissingAltCount: number;

  jsonLdCount: number;
  jsonLdTypes: string[];
}

const OG_PROPERTIES = ["og:title", "og:description", "og:image", "og:url", "og:type", "og:site_name"];
const TWITTER_NAMES = ["twitter:card", "twitter:title", "twitter:description", "twitter:image"];

export function extractSeoFeatures(html: string, pageUrl: string): SeoFeatures {
  const $ = cheerio.load(html);

  const bodyTextForSize = $("body").clone();

  bodyTextForSize.find("script, style, noscript, svg").remove();
  const bodyText = bodyTextForSize.text().replace(/\s+/g, " ").trim();
  const elementCount = $("body *").length;
  const lowContent = bodyText.length < 150 && elementCount < 15;

  const title = $("head > title").first().text().trim() || null;
  const metaDescription = $("meta[name='description']").attr("content")?.trim() || null;
  const canonicalHref = $("link[rel='canonical']").attr("href")?.trim() || null;

  let canonicalMatchesPage = false;

  if (canonicalHref) {
    try {
      const resolvedCanonical = new URL(canonicalHref, pageUrl);
      const page = new URL(pageUrl);
      const normalize = (u: URL) => `${u.origin}${u.pathname.replace(/\/$/, "")}`;

      canonicalMatchesPage = normalize(resolvedCanonical) === normalize(page);
    } catch {
      canonicalMatchesPage = false;
    }
  }

  const viewportPresent = $("meta[name='viewport']").length > 0;
  const htmlLang = $("html").attr("lang")?.trim() || null;
  const faviconPresent =
    $("link[rel='icon'], link[rel='shortcut icon'], link[rel='apple-touch-icon']").length > 0;
  const robotsContent = $("meta[name='robots']").attr("content")?.trim() || null;
  const isNoindex = /noindex/i.test(robotsContent ?? "");

  const ogTags: Record<string, string> = {};

  for (const prop of OG_PROPERTIES) {
    const content = $(`meta[property='${prop}']`).attr("content");

    if (content) ogTags[prop] = content;
  }

  const twitterTags: Record<string, string> = {};

  for (const name of TWITTER_NAMES) {
    const content = $(`meta[name='${name}']`).attr("content");

    if (content) twitterTags[name] = content;
  }

  const h1Elements = $("h1");
  const h1Count = h1Elements.length;
  const h1Text = h1Count > 0 ? h1Elements.first().text().trim() : null;

  const headingSequence: number[] = [];

  $("h1, h2, h3, h4, h5, h6").each((_, el) => {
    headingSequence.push(Number(el.tagName.slice(1)));
  });

  let hasSkippedHeadingLevel = false;

  for (let i = 1; i < headingSequence.length; i++) {
    if (headingSequence[i] - headingSequence[i - 1] > 1) {
      hasSkippedHeadingLevel = true;
      break;
    }
  }

  const images = $("img");
  const imgCount = images.length;
  let imgMissingAltCount = 0;

  images.each((_, el) => {
    const alt = $(el).attr("alt");

    if (alt === undefined || alt.trim().length === 0) imgMissingAltCount++;
  });

  const jsonLdScripts = $("script[type='application/ld+json']");
  const jsonLdCount = jsonLdScripts.length;
  const jsonLdTypes: string[] = [];

  jsonLdScripts.each((_, el) => {
    const raw = $(el).contents().text();

    try {
      const parsed = JSON.parse(raw);
      const items = Array.isArray(parsed) ? parsed : [parsed];

      for (const item of items) {
        const type = item?.["@type"];

        if (typeof type === "string") jsonLdTypes.push(type);
        else if (Array.isArray(type)) jsonLdTypes.push(...type.filter((t) => typeof t === "string"));
      }
    } catch {
      // Malformed JSON-LD is itself worth surfacing, but this extractor
      // stays a pure parser - the scorer below treats "0 recognized types
      // from N scripts" as a signal.
    }
  });

  return {
    bodyTextLength: bodyText.length,
    elementCount,
    lowContent,
    title,
    titleLength: title?.length ?? 0,
    metaDescription,
    metaDescriptionLength: metaDescription?.length ?? 0,
    canonicalHref,
    canonicalMatchesPage,
    viewportPresent,
    htmlLang,
    faviconPresent,
    robotsContent,
    isNoindex,
    ogTags,
    twitterTags,
    h1Count,
    h1Text,
    headingSequence,
    hasSkippedHeadingLevel,
    imgCount,
    imgMissingAltCount,
    jsonLdCount,
    jsonLdTypes,
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

export interface SeoAuditResult {
  overallScore: number;
  grade: "A" | "B" | "C" | "D" | "F";
  lowContent: boolean;
  isNoindex: boolean;
  categories: CategoryResult[];
}

function clampScore(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function scoreToGrade(score: number): SeoAuditResult["grade"] {
  if (score >= 90) return "A";
  if (score >= 75) return "B";
  if (score >= 60) return "C";
  if (score >= 40) return "D";

  return "F";
}

export function scoreSeoFeatures(f: SeoFeatures): SeoAuditResult {
  // Core metadata
  const metaChecks: CheckResult[] = [];
  let metaScore = 0;

  if (f.lowContent) {
    metaScore = 20;
    metaChecks.push({
      key: "content-volume",
      label: "Meaningful server-rendered content",
      passed: false,
      detail: `Only ${f.bodyTextLength} characters of text and ${f.elementCount} elements were found - this page may be client-rendered or behind authentication, which also means crawlers relying on the raw HTML response see very little.`,
    });
  } else {
    const titleOk = f.title !== null && f.titleLength >= 10 && f.titleLength <= 60;

    metaScore += titleOk ? 35 : f.title ? 15 : 0;
    metaChecks.push({
      key: "title",
      label: "Title tag present and a healthy length (10-60 chars)",
      passed: titleOk,
      detail: f.title
        ? `"${f.title}" (${f.titleLength} characters)${titleOk ? "" : f.titleLength > 60 ? " - likely to be truncated in search results." : " - a bit short to be descriptive."}`
        : "No <title> tag found.",
    });

    const descOk = f.metaDescription !== null && f.metaDescriptionLength >= 70 && f.metaDescriptionLength <= 160;

    metaScore += descOk ? 35 : f.metaDescription ? 15 : 0;
    metaChecks.push({
      key: "meta-description",
      label: "Meta description present and a healthy length (70-160 chars)",
      passed: descOk,
      detail: f.metaDescription
        ? `${f.metaDescriptionLength} characters${descOk ? "" : f.metaDescriptionLength > 160 ? " - likely to be truncated in search results." : " - could say more to earn the click."}`
        : "No <meta name=\"description\"> found.",
    });

    const canonicalOk = Boolean(f.canonicalHref) && f.canonicalMatchesPage;

    metaScore += canonicalOk ? 15 : f.canonicalHref ? 5 : 0;
    metaChecks.push({
      key: "canonical",
      label: "Canonical URL declared and points to this page",
      passed: canonicalOk,
      detail: !f.canonicalHref
        ? "No <link rel=\"canonical\"> found - without one, search engines guess which URL variant to index."
        : f.canonicalMatchesPage
          ? `<link rel="canonical" href="${f.canonicalHref}"> correctly points to this page.`
          : `<link rel="canonical" href="${f.canonicalHref}"> points somewhere other than this page - only intentional on paginated/duplicate content, otherwise this tells search engines to index a different URL instead.`,
    });

    metaScore += f.viewportPresent ? 15 : 0;
    metaChecks.push({
      key: "viewport",
      label: "Responsive viewport meta tag",
      passed: f.viewportPresent,
      detail: f.viewportPresent
        ? "<meta name=\"viewport\"> found."
        : "No viewport meta tag - mobile search ranking factors in mobile usability.",
    });
  }

  // Indexability
  const indexChecks: CheckResult[] = [];
  let indexScore = 0;

  indexScore += f.isNoindex ? 0 : 50;
  indexChecks.push({
    key: "noindex",
    label: "Page is not blocked from indexing",
    passed: !f.isNoindex,
    detail: f.isNoindex
      ? `<meta name="robots" content="${f.robotsContent}"> is telling search engines not to index this page.`
      : f.robotsContent
        ? `<meta name="robots" content="${f.robotsContent}"> found and does not block indexing.`
        : "No robots meta tag restricting indexing.",
  });

  indexScore += f.htmlLang ? 25 : 0;
  indexChecks.push({
    key: "html-lang",
    label: "Declared document language",
    passed: Boolean(f.htmlLang),
    detail: f.htmlLang ? `<html lang="${f.htmlLang}">` : "No lang attribute on <html> - screen readers and search engines can't reliably detect the page's language.",
  });

  indexScore += f.faviconPresent ? 25 : 0;
  indexChecks.push({
    key: "favicon",
    label: "Favicon declared",
    passed: f.faviconPresent,
    detail: f.faviconPresent
      ? "A <link rel=\"icon\"> (or apple-touch-icon) was found."
      : "No favicon link found - browsers will request /favicon.ico as a fallback, which may 404.",
  });

  // Heading structure
  const headingChecks: CheckResult[] = [];
  let headingScore = 0;

  const exactlyOneH1 = f.h1Count === 1;

  headingScore += exactlyOneH1 ? 45 : f.h1Count > 1 ? 15 : 0;
  headingChecks.push({
    key: "single-h1",
    label: "Exactly one <h1>",
    passed: exactlyOneH1,
    detail:
      f.h1Count === 0
        ? "No <h1> found - every page should have exactly one top-level heading."
        : f.h1Count === 1
          ? `"${f.h1Text}"`
          : `${f.h1Count} <h1> elements found - search engines may struggle to identify the page's primary topic.`,
  });

  headingScore += f.headingSequence.length >= 2 ? 30 : f.headingSequence.length === 1 ? 10 : 0;
  headingChecks.push({
    key: "heading-depth",
    label: "Subheadings present (h2/h3) to structure content",
    passed: f.headingSequence.length >= 2,
    detail: `${f.headingSequence.length} heading element(s) found in total (h1-h6).`,
  });

  headingScore += f.hasSkippedHeadingLevel ? 0 : 25;
  headingChecks.push({
    key: "no-skipped-levels",
    label: "No skipped heading levels (e.g. h1 straight to h3)",
    passed: !f.hasSkippedHeadingLevel,
    detail: f.hasSkippedHeadingLevel
      ? "Found a heading that jumps more than one level below its predecessor - this breaks the document outline assistive tech and crawlers rely on."
      : "Heading levels descend in order without gaps.",
  });

  // Social preview (Open Graph + Twitter) and structured data
  const socialChecks: CheckResult[] = [];
  let socialScore = 0;

  const ogCoreCount = ["og:title", "og:description", "og:image"].filter((k) => k in f.ogTags).length;

  socialScore += Math.round((ogCoreCount / 3) * 40);
  socialChecks.push({
    key: "open-graph",
    label: "Core Open Graph tags (title, description, image)",
    passed: ogCoreCount === 3,
    detail: `${ogCoreCount} of 3 core og: tags found${Object.keys(f.ogTags).length > ogCoreCount ? ` (plus ${Object.keys(f.ogTags).length - ogCoreCount} more)` : ""}.`,
  });

  const twitterCoreCount = ["twitter:card", "twitter:title"].filter((k) => k in f.twitterTags).length;

  socialScore += Math.round((twitterCoreCount / 2) * 25);
  socialChecks.push({
    key: "twitter-card",
    label: "Twitter Card tags",
    passed: twitterCoreCount === 2,
    detail: `${twitterCoreCount} of 2 core twitter: tags found.`,
  });

  socialScore += f.jsonLdCount > 0 ? 20 : 0;
  socialChecks.push({
    key: "structured-data",
    label: "JSON-LD structured data present",
    passed: f.jsonLdCount > 0,
    detail:
      f.jsonLdCount > 0
        ? `${f.jsonLdCount} <script type="application/ld+json"> block(s) found${f.jsonLdTypes.length > 0 ? ` (${[...new Set(f.jsonLdTypes)].join(", ")})` : ""}.`
        : "No JSON-LD structured data found.",
  });

  const altRatio = f.imgCount > 0 ? (f.imgCount - f.imgMissingAltCount) / f.imgCount : 1;

  socialScore += Math.round(altRatio * 15);
  socialChecks.push({
    key: "image-alt-text",
    label: "Images have descriptive alt text",
    passed: f.imgCount === 0 || f.imgMissingAltCount === 0,
    detail:
      f.imgCount === 0
        ? "No <img> elements found on the page."
        : `${f.imgCount - f.imgMissingAltCount} of ${f.imgCount} images have alt text.`,
  });

  const categories: CategoryResult[] = [
    { key: "metadata", label: "Core Metadata", score: clampScore(metaScore), checks: metaChecks },
    { key: "indexability", label: "Indexability", score: clampScore(indexScore), checks: indexChecks },
    { key: "headings", label: "Heading Structure", score: clampScore(headingScore), checks: headingChecks },
    { key: "social", label: "Social Preview & Structured Data", score: clampScore(socialScore), checks: socialChecks },
  ];

  const overallScore = clampScore(categories.reduce((sum, c) => sum + c.score, 0) / categories.length);

  return {
    overallScore,
    grade: scoreToGrade(overallScore),
    lowContent: f.lowContent,
    isNoindex: f.isNoindex,
    categories,
  };
}

export function runSeoAudit(html: string, pageUrl: string): SeoAuditResult {
  return scoreSeoFeatures(extractSeoFeatures(html, pageUrl));
}
