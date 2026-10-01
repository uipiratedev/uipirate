// CTA & conversion button heuristic auditor.
//
// Reads the STATIC server-rendered HTML a URL returns and evaluates the
// buttons/links that look like calls to action: how many exist and whether
// one is reachable above the fold, whether their copy uses specific,
// action-oriented verbs instead of generic filler, and - where the color
// values are actually recoverable from the page's own inline styles or
// embedded <style> blocks - their real WCAG contrast ratio.
//
// The contrast check is deliberately honest about its own limit: most
// production sites style buttons through compiled Tailwind/CSS classes in
// an external stylesheet this tool never fetches, so their colors usually
// aren't resolvable from the HTML response alone. Those buttons are
// reported as "not measurable" rather than silently scored as failing -
// faking a contrast number would be worse than not having one.

import * as cheerio from "cheerio";
import type { Element } from "domhandler";

import { parseColor, wcagContrastRatio, type RGB } from "./colorContrast";

const STRONG_VERB_PATTERN =
  /^(start|get|try|create|join|build|launch|unlock|discover|claim|grab|book|schedule|request|explore|download|subscribe|sign up|signup|add|invite|upgrade)\b/i;
const GENERIC_TEXTS = new Set([
  "submit",
  "click here",
  "ok",
  "here",
  "go",
  "continue",
  "learn more",
  "read more",
  "next",
  "more",
]);
const FIRST_PERSON_PATTERN = /\bmy\b|\bi want\b|\bi'm in\b|\bi am in\b/i;

const CTA_SELECTOR =
  "button, a[class*='btn' i], a[class*='button' i], a[role='button'], input[type='submit'], input[type='button']";

export interface CtaCandidate {
  text: string;
  aboveFold: boolean;
  isStrongVerb: boolean;
  isGenericOnly: boolean;
  isFirstPerson: boolean;
  contrast: { ratio: number; passesAA: boolean } | null;
}

export interface CtaFeatures {
  bodyTextLength: number;
  elementCount: number;
  lowContent: boolean;
  candidates: CtaCandidate[];
}

function parseEmbeddedCss($: cheerio.CheerioAPI): Map<string, { color?: string; backgroundColor?: string }> {
  const map = new Map<string, { color?: string; backgroundColor?: string }>();

  $("style").each((_, el) => {
    const css = $(el).contents().text();
    const ruleRegex = /([.#][a-zA-Z0-9_-]+)\s*\{([^}]*)\}/g;
    let match: RegExpExecArray | null;

    while ((match = ruleRegex.exec(css)) !== null) {
      const selector = match[1].slice(1);
      const body = match[2];
      const colorMatch = /(?:^|;)\s*color\s*:\s*([^;]+)/i.exec(body);
      const bgMatch = /(?:^|;)\s*background(?:-color)?\s*:\s*([^;]+)/i.exec(body);

      if (!colorMatch && !bgMatch) continue;

      const existing = map.get(selector) ?? {};

      if (colorMatch) existing.color = colorMatch[1].trim();
      if (bgMatch) existing.backgroundColor = bgMatch[1].trim();
      map.set(selector, existing);
    }
  });

  return map;
}

function resolveElementColors(
  $: cheerio.CheerioAPI,
  el: Element,
  cssMap: Map<string, { color?: string; backgroundColor?: string }>,
): { color?: string; backgroundColor?: string } {
  const $el = $(el);
  const inlineStyle = $el.attr("style") ?? "";
  const inlineColorMatch = /(?:^|;)\s*color\s*:\s*([^;]+)/i.exec(inlineStyle);
  const inlineBgMatch = /(?:^|;)\s*background(?:-color)?\s*:\s*([^;]+)/i.exec(inlineStyle);

  let color = inlineColorMatch?.[1]?.trim();
  let backgroundColor = inlineBgMatch?.[1]?.trim();

  const classList = ($el.attr("class") ?? "").split(/\s+/).filter(Boolean);

  for (const cls of classList) {
    const rule = cssMap.get(cls);

    if (rule?.color && !color) color = rule.color;
    if (rule?.backgroundColor && !backgroundColor) backgroundColor = rule.backgroundColor;
  }

  const id = $el.attr("id");

  if (id) {
    const rule = cssMap.get(id);

    if (rule?.color && !color) color = rule.color;
    if (rule?.backgroundColor && !backgroundColor) backgroundColor = rule.backgroundColor;
  }

  return { color, backgroundColor };
}

function toRgb(value: string | undefined): RGB | null {
  if (!value) return null;

  return parseColor(value);
}

export function extractCtaFeatures(html: string): CtaFeatures {
  const $ = cheerio.load(html);

  $("script, noscript, svg").remove();

  const bodyText = $("body").text().replace(/\s+/g, " ").trim();
  const elementCount = $("body *").length;
  const lowContent = bodyText.length < 150 && elementCount < 15;

  const cssMap = parseEmbeddedCss($);
  const allElements = $("body *").toArray();

  const candidates: CtaCandidate[] = [];

  $(CTA_SELECTOR).each((_, el) => {
    const $el = $(el);
    const rawText = $el.is("input") ? ($el.attr("value") ?? "") : $el.text();
    const text = rawText.trim().replace(/\s+/g, " ");

    if (!text || text.length > 60) return;

    const elementIndex = allElements.indexOf(el);
    const foldThreshold = Math.max(1, Math.floor(allElements.length * 0.15));
    const inHeroLandmark = $el.closest("header, [class*='hero' i], [id*='hero' i]").length > 0;
    const aboveFold = (elementIndex >= 0 && elementIndex <= foldThreshold) || inHeroLandmark;

    const lowerText = text.toLowerCase();
    const isStrongVerb = STRONG_VERB_PATTERN.test(text);
    const isGenericOnly = GENERIC_TEXTS.has(lowerText);
    const isFirstPerson = FIRST_PERSON_PATTERN.test(text);

    const { color, backgroundColor } = resolveElementColors($, el, cssMap);
    const fg = toRgb(color);
    const bg = toRgb(backgroundColor);
    const contrast = fg && bg ? { ratio: wcagContrastRatio(fg, bg), passesAA: wcagContrastRatio(fg, bg) >= 3 } : null;

    candidates.push({ text, aboveFold, isStrongVerb, isGenericOnly, isFirstPerson, contrast });
  });

  return { bodyTextLength: bodyText.length, elementCount, lowContent, candidates };
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

export interface CtaAuditResult {
  overallScore: number;
  grade: "A" | "B" | "C" | "D" | "F";
  lowContent: boolean;
  totalCandidates: number;
  measurableContrastCount: number;
  categories: CategoryResult[];
}

function clampScore(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function scoreToGrade(score: number): CtaAuditResult["grade"] {
  if (score >= 90) return "A";
  if (score >= 75) return "B";
  if (score >= 60) return "C";
  if (score >= 40) return "D";

  return "F";
}

export function scoreCtaFeatures(f: CtaFeatures): CtaAuditResult {
  const discoveryChecks: CheckResult[] = [];
  let discoveryScore = 0;

  if (f.lowContent) {
    discoveryScore = 20;
    discoveryChecks.push({
      key: "content-volume",
      label: "Meaningful server-rendered content",
      passed: false,
      detail: `Only ${f.bodyTextLength} characters of text and ${f.elementCount} elements were found - this page may be client-rendered or behind authentication.`,
    });
  } else if (f.candidates.length === 0) {
    discoveryScore = 15;
    discoveryChecks.push({
      key: "cta-found",
      label: "At least one call-to-action detected",
      passed: false,
      detail: "No <button>, button-styled <a>, or submit input was found on this page.",
    });
  } else {
    discoveryChecks.push({
      key: "cta-found",
      label: "At least one call-to-action detected",
      passed: true,
      detail: `${f.candidates.length} candidate CTA(s) found.`,
    });

    const hasAboveFold = f.candidates.some((c) => c.aboveFold);

    discoveryScore += hasAboveFold ? 40 : 0;
    discoveryChecks.push({
      key: "above-fold",
      label: "A CTA is reachable near the top of the page",
      passed: hasAboveFold,
      detail: hasAboveFold
        ? "At least one CTA appears in the header/hero area or within the first ~15% of the page's elements."
        : "No CTA was found near the top of the page - visitors may need to scroll significantly before seeing a clear next step.",
    });

    const hasMultiple = f.candidates.length >= 2;

    discoveryScore += hasMultiple ? 30 : 15;
    discoveryChecks.push({
      key: "cta-repetition",
      label: "More than one CTA on the page",
      passed: hasMultiple,
      detail: `${f.candidates.length} CTA(s) found - on any page with meaningful scroll depth, repeating the CTA reduces how far a ready-to-convert visitor has to hunt.`,
    });

    discoveryScore += 30;
  }

  const copyChecks: CheckResult[] = [];
  let copyScore = 0;

  if (f.candidates.length > 0) {
    const strongRatio = f.candidates.filter((c) => c.isStrongVerb).length / f.candidates.length;

    copyScore += Math.round(strongRatio * 50);
    copyChecks.push({
      key: "strong-verbs",
      label: "CTAs lead with a specific, action-oriented verb",
      passed: strongRatio >= 0.5,
      detail: `${f.candidates.filter((c) => c.isStrongVerb).length} of ${f.candidates.length} CTA(s) lead with a specific verb (Start, Get, Try, Create, etc.) instead of a passive or vague phrase.`,
    });

    const allGeneric = f.candidates.every((c) => c.isGenericOnly);

    copyScore += allGeneric ? 0 : 30;
    copyChecks.push({
      key: "no-generic-only",
      label: "Not relying solely on generic text (\"Submit\", \"Click here\")",
      passed: !allGeneric,
      detail: allGeneric
        ? "Every CTA found uses purely generic text - generic labels give visitors no reason to click and no idea what happens next."
        : "At least one CTA uses more specific, descriptive text than a purely generic label.",
    });

    const hasFirstPerson = f.candidates.some((c) => c.isFirstPerson);

    copyScore += hasFirstPerson ? 20 : 0;
    copyChecks.push({
      key: "first-person",
      label: "First-person CTA phrasing (\"Start My Free Trial\")",
      passed: hasFirstPerson,
      detail: hasFirstPerson
        ? "Found first-person CTA phrasing - well-known A/B tests (e.g. Highrise/37signals) have shown first-person framing can meaningfully lift click-through vs. second-person phrasing."
        : "No first-person CTA phrasing found - this is a smaller, optional lever, not a hard requirement.",
    });
  } else {
    copyChecks.push({
      key: "no-ctas",
      label: "No CTAs to evaluate copy for",
      passed: false,
      detail: "Copy quality can't be evaluated without at least one detected CTA.",
    });
  }

  const contrastChecks: CheckResult[] = [];
  const measurable = f.candidates.filter((c) => c.contrast !== null);
  let contrastScore = 70;

  if (measurable.length === 0) {
    contrastChecks.push({
      key: "contrast-not-measurable",
      label: "Contrast not measurable from static HTML",
      passed: true,
      detail:
        f.candidates.length > 0
          ? `None of the ${f.candidates.length} CTA(s) found have literal color values in an inline style or an embedded <style> block - most production sites style buttons through an external, compiled stylesheet this tool doesn't fetch. This isn't scored against the page.`
          : "No CTAs were found to check.",
    });
  } else {
    const passingCount = measurable.filter((c) => c.contrast!.passesAA).length;

    contrastScore = clampScore((passingCount / measurable.length) * 100);
    contrastChecks.push({
      key: "measurable-contrast",
      label: "Measurable CTAs meet the WCAG 3:1 UI-component minimum",
      passed: passingCount === measurable.length,
      detail: `${passingCount} of ${measurable.length} CTA(s) with resolvable colors meet the 3:1 minimum contrast ratio for UI components (WCAG 2.1 SC 1.4.11). ${f.candidates.length - measurable.length} other CTA(s) use unresolvable (external-stylesheet) styling and aren't included in this score.`,
    });
  }

  const categories: CategoryResult[] = [
    { key: "discovery", label: "CTA Discoverability & Placement", score: clampScore(discoveryScore), checks: discoveryChecks },
    { key: "copy", label: "Action-Oriented Copy", score: clampScore(copyScore), checks: copyChecks },
    { key: "contrast", label: "Explainable Contrast Check", score: clampScore(contrastScore), checks: contrastChecks },
  ];

  const overallScore = clampScore(categories.reduce((sum, c) => sum + c.score, 0) / categories.length);

  return {
    overallScore,
    grade: scoreToGrade(overallScore),
    lowContent: f.lowContent,
    totalCandidates: f.candidates.length,
    measurableContrastCount: measurable.length,
    categories,
  };
}

export function runCtaAudit(html: string): CtaAuditResult {
  return scoreCtaFeatures(extractCtaFeatures(html));
}
