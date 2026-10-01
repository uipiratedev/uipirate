// SaaS onboarding & activation heuristic auditor.
//
// Like the Dashboard UX Analyzer, this reads the STATIC server-rendered HTML
// a URL returns - no JavaScript execution, no login, no simulated clicks.
// Point it at a real signup page, welcome flow, or product page and it
// measures four things that move activation rate in real products:
// how much friction the signup form itself creates, whether the flow
// discloses information progressively instead of dumping it all at once,
// whether empty states and onboarding guidance exist to get a new user to
// their first useful action, and whether the page gives a new user a clear,
// low-risk next step (a specific CTA, trial/pricing transparency, and a way
// to get help).
//
// Every check is a deterministic rule over the parsed DOM and visible text -
// no LLM, no guesswork - so every score comes with the exact evidence that
// produced it.

import * as cheerio from "cheerio";

export interface OnboardingFeatures {
  bodyTextLength: number;
  elementCount: number;
  lowContent: boolean;

  formCount: number;
  totalFieldCount: number;
  requiredFieldCount: number;
  ssoOptionCount: number;
  captchaDetected: boolean;
  passwordHintDetected: boolean;
  mandatoryPhoneDetected: boolean;

  stepIndicatorDetected: boolean;
  progressBarDetected: boolean;
  wizardContainerDetected: boolean;

  emptyStateDetected: boolean;
  onboardingChecklistDetected: boolean;
  productTourLibraryDetected: boolean;

  specificCtaDetected: boolean;
  primaryCtaSample: string | null;
  freeTrialMentioned: boolean;
  noCreditCardMentioned: boolean;
  liveChatWidgetDetected: boolean;
  helpDocsLinkDetected: boolean;
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

export interface OnboardingAuditResult {
  overallScore: number;
  grade: "A" | "B" | "C" | "D" | "F";
  lowContent: boolean;
  categories: CategoryResult[];
}

const EMPTY_STATE_PHRASES = [
  "no data",
  "no results",
  "nothing here",
  "nothing to show",
  "get started",
  "no items found",
  "empty state",
  "no records",
  "create your first",
  "add your first",
  "you haven't",
  "let's set up",
  "start by creating",
];

const STEP_PATTERN = /\bstep\s*\d+\s*(of|\/)\s*\d+\b/i;
const CHECKLIST_PATTERN = /\b\d{1,2}\s*(of|\/)\s*\d{1,2}\s*(steps|tasks)\b|\b\d{1,3}%\s*complete\b/i;
const SSO_PATTERN =
  /(continue|sign[ -]?in|sign[ -]?up|log[ -]?in|register)\s*(with|via)\s*(google|github|microsoft|apple|linkedin|okta|slack|saml)|\bsingle sign-on\b|\bsso\b/i;
const PASSWORD_HINT_PATTERN =
  /(password must|at least\s*\d+\s*characters?|must contain (a|an)? ?(uppercase|number|special character))/i;
const FREE_TRIAL_PATTERN = /free trial|free plan|14-day|30-day|no cost to start/i;
const NO_CREDIT_CARD_PATTERN = /no credit card|credit card not required|without a credit card/i;
const SPECIFIC_CTA_PATTERN = /\b(start|try|get started|create|sign up|join|begin|launch)\b/i;
const GENERIC_CTA_TEXTS = new Set(["submit", "click here", "ok", "here", "go", "continue", "next"]);

const TOUR_LIBRARY_PATTERNS = [
  "intercom",
  "appcues",
  "pendo",
  "userpilot",
  "chameleon",
  "shepherd",
  "introjs",
  "intro.js",
  "driver.js",
  "walkme",
  "userguiding",
  "sprig",
  "usetiful",
];

const CHAT_WIDGET_PATTERNS = [
  "intercom",
  "drift",
  "zendesk",
  "crisp.chat",
  "tawk.to",
  "hubspot",
  "freshchat",
  "livechatinc",
  "olark",
];

const FIELD_SELECTOR =
  "input[type='text'], input[type='email'], input[type='password'], input[type='tel'], input[type='number'], input[type='url'], input:not([type]), textarea, select";

export function extractOnboardingFeatures(html: string): OnboardingFeatures {
  const $ = cheerio.load(html);

  $("script, style, noscript, svg").remove();

  const bodyText = $("body").text().replace(/\s+/g, " ").trim();
  const lowerBodyText = bodyText.toLowerCase();
  const elementCount = $("body *").length;
  const lowContent = bodyText.length < 150 && elementCount < 15;

  // Re-parse a copy that still has <script> tags, since library/widget
  // detection depends on script src attributes we just removed above.
  const $withScripts = cheerio.load(html);

  // Signup friction. A bare <form> isn't necessarily a signup form - site
  // search boxes, language switchers, and citation tools are all <form>
  // elements too. Only count forms that actually contain a substantive
  // field, so a page like a Wikipedia article (which has a search <form>
  // but no signup fields) honestly falls into the "no form detected" branch
  // instead of reporting a misleading "form found, 0 fields" result.
  const forms = $("form").filter((_, el) => $(el).find(FIELD_SELECTOR).length > 0);
  const formCount = forms.length;
  const fields = $(FIELD_SELECTOR);
  const totalFieldCount = fields.length;
  const requiredFieldCount = $(
    "input[required], textarea[required], select[required], [aria-required='true']",
  ).length;

  let ssoOptionCount = 0;

  $("a, button").each((_, el) => {
    const text = $(el).text().trim();
    const ariaLabel = $(el).attr("aria-label") ?? "";

    if (SSO_PATTERN.test(text) || SSO_PATTERN.test(ariaLabel)) ssoOptionCount++;
  });

  const captchaDetected =
    $("[class*='captcha' i], [data-sitekey], iframe[src*='recaptcha' i], iframe[src*='hcaptcha' i]").length > 0 ||
    $withScripts("script[src*='recaptcha' i], script[src*='hcaptcha' i], script[src*='turnstile' i]").length > 0;

  const passwordHintDetected =
    $("[class*='password-hint' i], [class*='password-requirements' i], [id*='password-hint' i]").length > 0 ||
    PASSWORD_HINT_PATTERN.test(bodyText);

  const mandatoryPhoneDetected =
    $("input[type='tel'][required], input[type='tel'][aria-required='true']").length > 0;

  // Progressive disclosure
  const stepIndicatorDetected =
    STEP_PATTERN.test(bodyText) ||
    $("[aria-current='step'], [class*='step-indicator' i], [class*='stepper' i]").length > 0;
  const progressBarDetected =
    $("[role='progressbar'], progress, [class*='progress-bar' i]").length > 0;
  const wizardContainerDetected =
    $("[class*='wizard' i], [class*='multistep' i], [id*='wizard' i]").length > 0;

  // Empty states & onboarding guidance
  const emptyStateDetected = EMPTY_STATE_PHRASES.some((phrase) => lowerBodyText.includes(phrase));
  const onboardingChecklistDetected =
    $(
      "[class*='checklist' i], [class*='getting-started' i], [class*='setup-guide' i], [class*='onboarding' i]",
    ).length > 0 || CHECKLIST_PATTERN.test(bodyText);

  let productTourLibraryDetected = false;

  $withScripts("script[src]").each((_, el) => {
    const src = ($withScripts(el).attr("src") ?? "").toLowerCase();

    if (TOUR_LIBRARY_PATTERNS.some((pattern) => src.includes(pattern))) productTourLibraryDetected = true;
  });
  if (!productTourLibraryDetected) {
    $("[class]").each((_, el) => {
      const cls = ($(el).attr("class") ?? "").toLowerCase();

      if (
        cls.includes("shepherd-") ||
        cls.includes("introjs-") ||
        cls.includes("driver-popover") ||
        cls.includes("walkme")
      ) {
        productTourLibraryDetected = true;
      }
    });
  }

  // Time to first value
  let specificCtaDetected = false;
  let primaryCtaSample: string | null = null;

  $("a, button").each((_, el) => {
    const text = $(el).text().trim().replace(/\s+/g, " ");

    if (!text || text.length > 40) return;

    const lower = text.toLowerCase();

    if (GENERIC_CTA_TEXTS.has(lower)) return;
    if (SPECIFIC_CTA_PATTERN.test(text)) {
      specificCtaDetected = true;
      if (!primaryCtaSample) primaryCtaSample = text;
    }
  });

  const freeTrialMentioned = FREE_TRIAL_PATTERN.test(bodyText);
  const noCreditCardMentioned = NO_CREDIT_CARD_PATTERN.test(bodyText);

  let liveChatWidgetDetected = false;

  $withScripts("script[src]").each((_, el) => {
    const src = ($withScripts(el).attr("src") ?? "").toLowerCase();

    if (CHAT_WIDGET_PATTERNS.some((pattern) => src.includes(pattern))) liveChatWidgetDetected = true;
  });

  const helpDocsLinkDetected =
    $("a[href*='/docs' i], a[href*='docs.' i], a[href*='/help' i]").length > 0 ||
    $("a").filter((_, el) => /documentation|help center|help docs|support center/i.test($(el).text())).length > 0;

  return {
    bodyTextLength: bodyText.length,
    elementCount,
    lowContent,
    formCount,
    totalFieldCount,
    requiredFieldCount,
    ssoOptionCount,
    captchaDetected,
    passwordHintDetected,
    mandatoryPhoneDetected,
    stepIndicatorDetected,
    progressBarDetected,
    wizardContainerDetected,
    emptyStateDetected,
    onboardingChecklistDetected,
    productTourLibraryDetected,
    specificCtaDetected,
    primaryCtaSample,
    freeTrialMentioned,
    noCreditCardMentioned,
    liveChatWidgetDetected,
    helpDocsLinkDetected,
  };
}

function clampScore(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function scoreToGrade(score: number): OnboardingAuditResult["grade"] {
  if (score >= 90) return "A";
  if (score >= 75) return "B";
  if (score >= 60) return "C";
  if (score >= 40) return "D";

  return "F";
}

export function scoreOnboardingFeatures(f: OnboardingFeatures): OnboardingAuditResult {
  // Signup friction: gated the same way the Dashboard Analyzer's
  // "Information Density" category is - a near-empty response (likely a
  // client-rendered SPA shell) can't be scored honestly, so it short-circuits
  // to a low, clearly-explained score instead of a confident-looking number.
  const frictionChecks: CheckResult[] = [];
  let frictionScore = 0;

  if (f.lowContent) {
    frictionScore = 20;
    frictionChecks.push({
      key: "content-volume",
      label: "Meaningful server-rendered content",
      passed: false,
      detail: `Only ${f.bodyTextLength} characters of text and ${f.elementCount} elements were found in the initial HTML - this page may be client-rendered or behind authentication.`,
    });
  } else {
    frictionChecks.push({
      key: "content-volume",
      label: "Meaningful server-rendered content",
      passed: true,
      detail: `${f.elementCount} elements and ${f.bodyTextLength} characters of text found.`,
    });

    if (f.formCount === 0) {
      frictionScore = 25;
      frictionChecks.push({
        key: "form-detected",
        label: "Signup or account-creation form detected",
        passed: false,
        detail: "No <form> element was found on this page - point the tool at your actual signup page to measure field count, SSO options, and other friction signals.",
      });
    } else {
      frictionChecks.push({
        key: "form-detected",
        label: "Signup or account-creation form detected",
        passed: true,
        detail: `${f.formCount} form${f.formCount === 1 ? "" : "s"} found, with ${f.totalFieldCount} input field(s) (${f.requiredFieldCount} required).`,
      });

      if (f.totalFieldCount > 0 && f.totalFieldCount <= 5) {
        frictionScore += 30;
      } else if (f.totalFieldCount >= 6 && f.totalFieldCount <= 8) {
        frictionScore += 15;
      }
      frictionChecks.push({
        key: "lean-field-count",
        label: "Lean field count (5 or fewer)",
        passed: f.totalFieldCount > 0 && f.totalFieldCount <= 5,
        detail: `${f.totalFieldCount} input field(s) found on the page. Every extra required field measurably lowers signup completion rate.`,
      });

      frictionScore += f.ssoOptionCount > 0 ? 25 : 0;
      frictionChecks.push({
        key: "sso-options",
        label: "Social login / SSO options",
        passed: f.ssoOptionCount > 0,
        detail:
          f.ssoOptionCount > 0
            ? `${f.ssoOptionCount} social login / SSO option(s) found (e.g. "Continue with Google").`
            : "No social login or SSO buttons detected - users must create and remember a new password.",
      });

      frictionScore += f.captchaDetected ? 0 : 25;
      frictionChecks.push({
        key: "no-captcha",
        label: "No CAPTCHA challenge blocking signup",
        passed: !f.captchaDetected,
        detail: f.captchaDetected
          ? "A CAPTCHA widget (reCAPTCHA/hCaptcha/Turnstile) was detected - these measurably reduce signup completion."
          : "No CAPTCHA widget detected on this page.",
      });

      frictionScore += f.mandatoryPhoneDetected ? 0 : 20;
      frictionChecks.push({
        key: "no-mandatory-phone",
        label: "Phone number not required to sign up",
        passed: !f.mandatoryPhoneDetected,
        detail: f.mandatoryPhoneDetected
          ? "A required phone number field was found - mandatory phone verification is one of the largest known drop-off points in signup flows."
          : "No required phone number field detected.",
      });
    }
  }

  // Progressive disclosure
  const disclosureChecks: CheckResult[] = [];
  let disclosureScore = 0;

  disclosureScore += f.stepIndicatorDetected ? 40 : 0;
  disclosureChecks.push({
    key: "step-indicator",
    label: "Visible step indicator (e.g. \"Step 1 of 3\")",
    passed: f.stepIndicatorDetected,
    detail: f.stepIndicatorDetected
      ? "Found step-count copy or a step-indicator element."
      : "No \"step X of Y\" copy or step-indicator element found.",
  });

  disclosureScore += f.progressBarDetected ? 30 : 0;
  disclosureChecks.push({
    key: "progress-bar",
    label: "Progress bar for multi-step flows",
    passed: f.progressBarDetected,
    detail: f.progressBarDetected
      ? "Found a <progress> element or role=\"progressbar\"."
      : "No progress-bar element found.",
  });

  disclosureScore += f.wizardContainerDetected ? 30 : 0;
  disclosureChecks.push({
    key: "wizard-container",
    label: "Wizard / multi-step container markup",
    passed: f.wizardContainerDetected,
    detail: f.wizardContainerDetected
      ? "Found an element with wizard/multistep-style class or id naming."
      : "No wizard/multistep container markup found - the flow may present everything on one screen at once.",
  });

  // Empty states & onboarding guidance
  const guidanceChecks: CheckResult[] = [];
  let guidanceScore = 0;

  guidanceScore += f.emptyStateDetected ? 35 : 10;
  guidanceChecks.push({
    key: "empty-state-copy",
    label: "Empty-state / getting-started guidance copy",
    passed: f.emptyStateDetected,
    detail: f.emptyStateDetected
      ? "Found copy suggesting a designed empty-state or getting-started moment."
      : "No common empty-state or getting-started phrasing found (may still exist behind conditional rendering).",
  });

  guidanceScore += f.onboardingChecklistDetected ? 35 : 0;
  guidanceChecks.push({
    key: "onboarding-checklist",
    label: "Onboarding checklist / setup progress",
    passed: f.onboardingChecklistDetected,
    detail: f.onboardingChecklistDetected
      ? "Found a checklist/getting-started widget or \"X of Y steps complete\"-style copy."
      : "No checklist or setup-progress widget detected.",
  });

  guidanceScore += f.productTourLibraryDetected ? 30 : 0;
  guidanceChecks.push({
    key: "product-tour",
    label: "Product tour / coachmark library",
    passed: f.productTourLibraryDetected,
    detail: f.productTourLibraryDetected
      ? "Detected a known product-tour or in-app-guidance library (e.g. Intercom, Appcues, Pendo, Shepherd)."
      : "No known product-tour or coachmark library detected.",
  });

  // Time to first value
  const activationChecks: CheckResult[] = [];
  let activationScore = 0;

  activationScore += f.specificCtaDetected ? 30 : 0;
  activationChecks.push({
    key: "specific-cta",
    label: "Specific, action-oriented primary CTA",
    passed: f.specificCtaDetected,
    detail: f.specificCtaDetected
      ? `Found a specific call to action${f.primaryCtaSample ? ` (e.g. "${f.primaryCtaSample}")` : ""} instead of generic text like "Submit".`
      : "No specific, outcome-oriented CTA text found (e.g. \"Start free trial\") - buttons may use generic labels like \"Submit\".",
  });

  activationScore += f.freeTrialMentioned || f.noCreditCardMentioned ? 25 : 0;
  activationChecks.push({
    key: "pricing-transparency",
    label: "Trial / pricing risk clearly stated upfront",
    passed: f.freeTrialMentioned || f.noCreditCardMentioned,
    detail:
      f.freeTrialMentioned || f.noCreditCardMentioned
        ? "Found copy mentioning a free trial/plan and/or that no credit card is required."
        : "No copy mentioning a free trial or credit-card requirement was found - unclear pricing risk is a common activation blocker.",
  });

  activationScore += f.liveChatWidgetDetected ? 20 : 0;
  activationChecks.push({
    key: "live-chat",
    label: "Live chat / support widget",
    passed: f.liveChatWidgetDetected,
    detail: f.liveChatWidgetDetected
      ? "Detected a known live-chat widget (e.g. Intercom, Drift, Zendesk)."
      : "No live-chat widget detected.",
  });

  activationScore += f.helpDocsLinkDetected ? 25 : 0;
  activationChecks.push({
    key: "help-docs-link",
    label: "Documentation / help center link",
    passed: f.helpDocsLinkDetected,
    detail: f.helpDocsLinkDetected
      ? "Found a link to documentation or a help center."
      : "No link to documentation or a help center was found.",
  });

  const categories: CategoryResult[] = [
    { key: "friction", label: "Signup Friction", score: clampScore(frictionScore), checks: frictionChecks },
    { key: "disclosure", label: "Progressive Disclosure", score: clampScore(disclosureScore), checks: disclosureChecks },
    { key: "guidance", label: "Empty States & Onboarding Guidance", score: clampScore(guidanceScore), checks: guidanceChecks },
    { key: "activation", label: "Time to First Value", score: clampScore(activationScore), checks: activationChecks },
  ];

  const overallScore = clampScore(categories.reduce((sum, c) => sum + c.score, 0) / categories.length);

  return {
    overallScore,
    grade: scoreToGrade(overallScore),
    lowContent: f.lowContent,
    categories,
  };
}

export function runOnboardingAudit(html: string): OnboardingAuditResult {
  return scoreOnboardingFeatures(extractOnboardingFeatures(html));
}
