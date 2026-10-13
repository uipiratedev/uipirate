import { describe, expect, it } from "vitest";

import { extractOnboardingFeatures, runOnboardingAudit, scoreOnboardingFeatures } from "@/lib/onboardingAudit";

const RICH_SIGNUP_PAGE = `
<!DOCTYPE html>
<html>
<head><title>Sign up</title>
<script src="https://widget.intercom.io/widget/abc123"></script>
</head>
<body>
  <header><nav><a href="/docs">Documentation</a></nav></header>
  <main>
    <p>Start your free trial today. No credit card required to get started.</p>
    <div class="step-indicator">Step 1 of 2</div>
    <div role="progressbar" aria-valuenow="50"></div>
    <form>
      <input type="email" name="email" required />
      <input type="password" name="password" required />
      <button type="submit">Create your account</button>
    </form>
    <div class="sso-options">
      <button aria-label="Continue with Google">Continue with Google</button>
      <button aria-label="Continue with GitHub">Continue with GitHub</button>
    </div>
    <div class="onboarding-checklist">
      <p>3 of 5 steps completed</p>
      <p>Get started by creating your first project.</p>
    </div>
  </main>
</body>
</html>
`;

const POOR_SIGNUP_PAGE = `
<!DOCTYPE html>
<html>
<head><title>Register</title>
<script src="https://www.google.com/recaptcha/api.js"></script>
</head>
<body>
  <main>
    <p>Fill out the form below to register for an account.</p>
    <form>
      <input type="text" name="first_name" required />
      <input type="text" name="last_name" required />
      <input type="email" name="email" required />
      <input type="password" name="password" required />
      <input type="tel" name="phone" required />
      <input type="text" name="company" required />
      <input type="text" name="job_title" required />
      <input type="text" name="referral_code" required />
      <div class="captcha-box" data-sitekey="abc"></div>
      <button type="submit">Submit</button>
    </form>
  </main>
</body>
</html>
`;

const NO_FORM_PAGE = `
<!DOCTYPE html>
<html>
<head><title>Blog post</title></head>
<body>
  <main>
    <article>
      <h1>How we scaled our infrastructure</h1>
      <p>${"This is a long-form blog article with plenty of body text. ".repeat(10)}</p>
      <p>${"It has multiple paragraphs of genuine editorial content. ".repeat(10)}</p>
    </article>
  </main>
</body>
</html>
`;

const LOW_CONTENT_PAGE = `<!DOCTYPE html><html><body><div id="root"></div></body></html>`;

// Mirrors a real-world case found via live testing: an encyclopedia-style
// article page that has a <form> for site search but no signup fields at
// all. A naive "any <form> = signup form" check would misreport this.
const SEARCH_ONLY_FORM_PAGE = `
<!DOCTYPE html>
<html>
<head><title>Onboarding - Wikipedia</title></head>
<body>
  <form action="/search" role="search">
    <input type="search" name="q" />
    <button type="submit">Search</button>
  </form>
  <main>
    <h1>Onboarding</h1>
    <p>${"Onboarding is the process by which new employees acquire the knowledge and skills to become effective members of an organization. ".repeat(6)}</p>
  </main>
</body>
</html>
`;

describe("extractOnboardingFeatures", () => {
  it("detects a lean signup form with SSO options", () => {
    const f = extractOnboardingFeatures(RICH_SIGNUP_PAGE);

    expect(f.formCount).toBe(1);
    expect(f.totalFieldCount).toBe(2);
    expect(f.requiredFieldCount).toBe(2);
    expect(f.ssoOptionCount).toBe(2);
    expect(f.captchaDetected).toBe(false);
    expect(f.mandatoryPhoneDetected).toBe(false);
  });

  it("detects step indicator and progress bar", () => {
    const f = extractOnboardingFeatures(RICH_SIGNUP_PAGE);

    expect(f.stepIndicatorDetected).toBe(true);
    expect(f.progressBarDetected).toBe(true);
  });

  it("detects onboarding checklist copy", () => {
    const f = extractOnboardingFeatures(RICH_SIGNUP_PAGE);

    expect(f.onboardingChecklistDetected).toBe(true);
  });

  it("detects a known product tour / chat library from script src", () => {
    const f = extractOnboardingFeatures(RICH_SIGNUP_PAGE);

    expect(f.productTourLibraryDetected).toBe(true);
    expect(f.liveChatWidgetDetected).toBe(true);
  });

  it("detects free trial and no-credit-card copy", () => {
    const f = extractOnboardingFeatures(RICH_SIGNUP_PAGE);

    expect(f.freeTrialMentioned).toBe(true);
    expect(f.noCreditCardMentioned).toBe(true);
  });

  it("detects a specific CTA and a docs link", () => {
    const f = extractOnboardingFeatures(RICH_SIGNUP_PAGE);

    expect(f.specificCtaDetected).toBe(true);
    expect(f.primaryCtaSample).toBe("Create your account");
    expect(f.helpDocsLinkDetected).toBe(true);
  });

  it("detects a heavy, high-friction form", () => {
    const f = extractOnboardingFeatures(POOR_SIGNUP_PAGE);

    expect(f.formCount).toBe(1);
    expect(f.totalFieldCount).toBe(8);
    expect(f.requiredFieldCount).toBe(8);
    expect(f.ssoOptionCount).toBe(0);
    expect(f.captchaDetected).toBe(true);
    expect(f.mandatoryPhoneDetected).toBe(true);
  });

  it("does not flag a generic 'Submit' button as a specific CTA", () => {
    const f = extractOnboardingFeatures(POOR_SIGNUP_PAGE);

    expect(f.specificCtaDetected).toBe(false);
    expect(f.primaryCtaSample).toBeNull();
  });

  it("reports zero forms on a non-signup page", () => {
    const f = extractOnboardingFeatures(NO_FORM_PAGE);

    expect(f.formCount).toBe(0);
    expect(f.totalFieldCount).toBe(0);
    expect(f.lowContent).toBe(false);
  });

  it("flags a near-empty SPA shell as low content", () => {
    const f = extractOnboardingFeatures(LOW_CONTENT_PAGE);

    expect(f.lowContent).toBe(true);
  });

  it("does not count a site-search form (no substantive fields) as a signup form", () => {
    const f = extractOnboardingFeatures(SEARCH_ONLY_FORM_PAGE);

    expect(f.formCount).toBe(0);
    expect(f.totalFieldCount).toBe(0);
  });
});

describe("scoreOnboardingFeatures", () => {
  it("gives a rich, low-friction signup flow a high friction score", () => {
    const result = runOnboardingAudit(RICH_SIGNUP_PAGE);
    const friction = result.categories.find((c) => c.key === "friction")!;

    expect(friction.score).toBeGreaterThanOrEqual(75);
  });

  it("gives a heavy, high-friction signup form a low friction score", () => {
    const result = runOnboardingAudit(POOR_SIGNUP_PAGE);
    const friction = result.categories.find((c) => c.key === "friction")!;

    expect(friction.score).toBeLessThan(40);
  });

  it("scores progressive disclosure highly when step indicators and progress bars exist", () => {
    const result = runOnboardingAudit(RICH_SIGNUP_PAGE);
    const disclosure = result.categories.find((c) => c.key === "disclosure")!;

    expect(disclosure.score).toBeGreaterThanOrEqual(70);
  });

  it("scores progressive disclosure at zero when nothing is found", () => {
    const result = runOnboardingAudit(POOR_SIGNUP_PAGE);
    const disclosure = result.categories.find((c) => c.key === "disclosure")!;

    expect(disclosure.score).toBe(0);
  });

  it("scores onboarding guidance highly when a checklist is present", () => {
    const result = runOnboardingAudit(RICH_SIGNUP_PAGE);
    const guidance = result.categories.find((c) => c.key === "guidance")!;

    expect(guidance.score).toBeGreaterThanOrEqual(65);
  });

  it("scores time-to-first-value highly with a specific CTA, trial copy, chat and docs", () => {
    const result = runOnboardingAudit(RICH_SIGNUP_PAGE);
    const activation = result.categories.find((c) => c.key === "activation")!;

    expect(activation.score).toBe(100);
  });

  it("scores time-to-first-value at zero with none of the signals present", () => {
    const result = runOnboardingAudit(POOR_SIGNUP_PAGE);
    const activation = result.categories.find((c) => c.key === "activation")!;

    expect(activation.score).toBe(0);
  });

  it("caps the friction score and explains a missing form on a non-signup page", () => {
    const result = runOnboardingAudit(NO_FORM_PAGE);
    const friction = result.categories.find((c) => c.key === "friction")!;

    expect(friction.score).toBe(25);
    expect(friction.checks.find((c) => c.key === "form-detected")?.passed).toBe(false);
  });

  it("caps the friction score for a page whose only form is a site search box", () => {
    const result = runOnboardingAudit(SEARCH_ONLY_FORM_PAGE);
    const friction = result.categories.find((c) => c.key === "friction")!;

    expect(friction.score).toBe(25);
    expect(friction.checks.find((c) => c.key === "form-detected")?.passed).toBe(false);
  });

  it("caps the friction score for low-content pages and reports lowContent at the top level", () => {
    const result = runOnboardingAudit(LOW_CONTENT_PAGE);
    const friction = result.categories.find((c) => c.key === "friction")!;

    expect(result.lowContent).toBe(true);
    expect(friction.score).toBe(20);
  });

  it("assigns a high overall grade to the rich signup fixture", () => {
    const result = runOnboardingAudit(RICH_SIGNUP_PAGE);

    expect(result.overallScore).toBeGreaterThanOrEqual(70);
    expect(["A", "B"]).toContain(result.grade);
  });

  it("assigns a low overall grade to the poor signup fixture", () => {
    const result = runOnboardingAudit(POOR_SIGNUP_PAGE);

    expect(result.overallScore).toBeLessThan(40);
    expect(["D", "F"]).toContain(result.grade);
  });

  it("always returns exactly 4 categories in a stable order", () => {
    const result = runOnboardingAudit(RICH_SIGNUP_PAGE);

    expect(result.categories.map((c) => c.key)).toEqual([
      "friction",
      "disclosure",
      "guidance",
      "activation",
    ]);
  });

  it("clamps every category score between 0 and 100", () => {
    for (const html of [RICH_SIGNUP_PAGE, POOR_SIGNUP_PAGE, NO_FORM_PAGE, LOW_CONTENT_PAGE]) {
      const result = scoreOnboardingFeatures(extractOnboardingFeatures(html));

      for (const cat of result.categories) {
        expect(cat.score).toBeGreaterThanOrEqual(0);
        expect(cat.score).toBeLessThanOrEqual(100);
      }
      expect(result.overallScore).toBeGreaterThanOrEqual(0);
      expect(result.overallScore).toBeLessThanOrEqual(100);
    }
  });
});
