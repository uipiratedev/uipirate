# UI Pirate — UI/UX Audit

**Scope:** Accessibility, layout/responsive, typography/color, performance, forms/feedback, navigation, animation.
**Method:** Static review of `app/`, `components/`, `screens/` (128 TSX files), a full ESLint pass (incl. `jsx-a11y`), and manual code inspection against the `ui-ux-pro-max` design-intelligence database (119 UX guidelines / WCAG-mapped rules).
**Stack:** Next.js 14 (App Router), HeroUI, Tailwind CSS, Framer Motion, Lenis smooth-scroll.
**Not covered:** backend/API logic, SEO copy, business logic correctness.

---

## Executive summary

| Severity | Count | Theme |
|---|---|---|
| High | 5 | Focus indicators removed with no replacement, no `prefers-reduced-motion` wiring for JS-driven animation, low-contrast gray text used site-wide, form errors not tied to fields, `<img>` used instead of `next/image` on 29 files |
| Medium | 4 | Sub-14px text widely used, small touch targets on Chip/pill controls, isolated heading-semantics slips, `next/image` optimization pipeline configured but under-used |
| Low | 2 | ESLint/`jsx-a11y` disabled during production builds, minor code-hygiene noise (`console.log`, unescaped entities) |

**The good news first:** the codebase's *structural* accessibility is genuinely solid — `eslint-plugin-jsx-a11y` (34 rules, `recommended` config) returns **zero violations** across all 152 linted files, the mobile nav has proper `aria-label`s, `Escape`-to-close, and a live-region announcement, and most forms use HeroUI's labeled inputs correctly. The issues below are mostly things static linting can't catch: color contrast, motion preferences, and a few interaction-design gaps.

---

## 1. Accessibility (Critical)

### 1.1 Focus indicator removed without a visible replacement — High
Three inputs strip the browser's default focus ring via `outline-none` and supply no visible substitute (no ring, no border-color change, no shadow). Keyboard-only users cannot tell these fields are focused.

- [screens/blogs/newsletter/index.tsx:60](screens/blogs/newsletter/index.tsx#L60) — `className="flex-1 bg-transparent px-1 py-1 text-sm outline-none placeholder:text-slate-400"`
- [screens/blogs/hero/index.tsx:141](screens/blogs/hero/index.tsx#L141) — `focus:outline-none` with no `focus:ring`/`focus:border` pairing
- [screens/faqs/hero/index.tsx:137](screens/faqs/hero/index.tsx#L137) — same pattern

Two other spots remove the outline but *do* substitute a border-color change, which is an acceptable but weaker pattern (contrast of the new border should be checked against WCAG 2.2 Focus Appearance):
- [screens/caseStudies/index.tsx:173](screens/caseStudies/index.tsx#L173) — `focus:border-[#FF5B04] focus:outline-none`
- [styles/globals.css:2185](styles/globals.css#L2185) — `.phone-wrapper-custom .react-tel-input .search-box:focus { @apply !border-[#FF5B04] !ring-0 !outline-none; }` (phone input on the contact/lead forms)

**Guidance (ui-ux-pro-max, Interaction → Focus States, severity High):** *"Keyboard focus needs a visible indicator. Do: use a visible focus ring on every interactive control. Don't: remove focus outline without replacement."*

**Fix:** add `focus-visible:ring-2 focus-visible:ring-[#FF5B04] focus-visible:ring-offset-2` (or equivalent) to the three inputs with no replacement at all.

### 1.2 Framer Motion / Lenis ignore `prefers-reduced-motion` — High
`styles/globals.css:79-87` has a correct CSS-level reduced-motion block, but it only affects **CSS** `animation`/`transition` properties. It has no effect on:

- **Framer Motion** — used in 39 files (`from "framer-motion"`), animates via inline transforms/JS, not CSS transitions. No file uses `useReducedMotion()` or wraps the app in `<MotionConfig reducedMotion="user">`.
- **Lenis smooth-scroll** — [components/SmoothScroll.tsx](components/SmoothScroll.tsx) initializes unconditionally on every page load with no motion-preference check before starting the `requestAnimationFrame` loop.

**Guidance (ui-ux-pro-max, Animation → Reduced Motion, severity High):** *"Respect user's motion preferences. Do: check `prefers-reduced-motion`. Don't: ignore accessibility motion settings."*

**Fix:**
```tsx
// app/layout.tsx or a top-level client wrapper
import { MotionConfig } from "framer-motion";
<MotionConfig reducedMotion="user">{children}</MotionConfig>
```
```tsx
// components/SmoothScroll.tsx
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
```

### 1.3 Low-contrast gray text used site-wide — High
`text-gray-400` (Tailwind default `#9CA3AF`) is used **60+ times across 25 files** for body copy, captions, and helper text, on a white background. Contrast ratio ≈ **2.54:1** — fails WCAG AA (4.5:1) for normal text and even the 3:1 large-text/UI-component floor.

Representative spots: [components/LeadCaptureForm.tsx:339](components/LeadCaptureForm.tsx#L339) (`"No spam. We respond within 2 hours..."`), [components/ProjectEstimate.tsx](components/ProjectEstimate.tsx) (9 occurrences), [app/contact/ContactPageClient.tsx](app/contact/ContactPageClient.tsx) (11 occurrences), [screens/landing/boreYouCommit/index.tsx](screens/landing/boreYouCommit/index.tsx) (9 occurrences).

`text-gray-300` (`#D1D5DB`, contrast ≈1.6:1 on white) also appears — check each usage is decorative-only (borders/dividers), never text.

**Priority-table anti-pattern match:** *"Gray-on-gray"* (Typography & Color, priority 6).

**Fix:** swap `text-gray-400` → `text-gray-500` (`#6B7280`, ≈4.6:1, passes AA) or `text-gray-600` for anything under 18px. Reserve `-300`/`-400` for non-text decoration only.

### 1.4 Section title rendered as `<p>` instead of a heading — Low
Five instances style text to look like a section heading (`className="heading-center"`) but use a `<p>` tag, breaking the heading outline that screen-reader users rely on to navigate. The pattern is correctly `<h2>` in 26 other places, so this is an isolated slip, not systemic:

- [screens/caseStudies/index.tsx:160](screens/caseStudies/index.tsx#L160) — "Product design & development in practice"
- [screens/caseStudies/index.tsx:485](screens/caseStudies/index.tsx#L485) — "Pricing That Makes Sense"
- [screens/landing/works/index.tsx:15](screens/landing/works/index.tsx#L15) — "Recent Works"

**Fix:** change these three `<p className="heading-center">` to `<h2 className="heading-center">`.

### 1.5 Touch targets under 24px on interactive Chips — Medium
`LeadCaptureForm`'s project-type and requirement selectors render as clickable `Chip`s at `h-9` (36px) — acceptable, but several icon/badge elements elsewhere are smaller. Worth a pass with the search tool's `web` domain per-component, e.g.:

```
python .claude/skills/ui-ux-pro-max/scripts/search.py "icon button minimum size" --domain ux
```

**Guidance (ui-ux-pro-max, Accessibility → Target Size Minimum, severity High):** WCAG 2.2 AA requires ≥24×24 CSS px pointer targets (or spacing/exception). Audit small avatar/star icons (`w-[14px] h-[14px]` in [screens/landing/hero/index.tsx:172](screens/landing/hero/index.tsx#L172)) if any are ever made clickable.

---

## 2. Performance (High)

### 2.1 Raw `<img>` instead of `next/image` — High, 29 files
`next.config.js` is correctly configured for image optimization (`formats: ["image/webp", "image/avif"]`, responsive `deviceSizes`/`imageSizes`), but only **8 files** actually use `next/image`. **29 files** use a plain `<img>`, which bypasses all of that: no automatic WebP/AVIF, no responsive `srcset`, no built-in lazy-loading below the fold, no CLS-safe sizing.

Highest-impact instance — a full-bleed, blurred background image rendered inside a `.map()` loop over every case-study card:
```tsx
// screens/caseStudies/index.tsx:354-357
<img
  alt={`${study.client} background`}
  className="w-full h-full object-cover blur-sm scale-110 opacity-60"
  src={study.heroImage}
/>
```
This repeats once per card on the case-studies listing page — each one an unoptimized, un-lazy-loaded network request.

Full file list (`@next/next/no-img-element` ESLint rule, 5 direct hits + additional instances the rule's `<img>`-inside-JSX detection didn't flag due to dynamic wrapping):
`components/navbar.tsx`, `components/NavbarDropdown.tsx`, `components/ProjectEstimate.tsx`, `components/footer.tsx`, `components/proPirate.tsx`, `screens/caseStudies/index.tsx`, `screens/caseStudies/ClientLogosMarquee.tsx`, `screens/sitemap/index.tsx`, `screens/blogs/newsletter/index.tsx`, `app/contact/ContactPageClient.tsx`, `app/_og/template.tsx`, `app/about/page.tsx`, `screens/ourWorks/hero/index.tsx`, `screens/pricing/faq/index.tsx`, `screens/pricing/perfectFor/index.tsx`, `screens/pricing/clientLogos/index.tsx`, `app/case-studies/[slug]/page.tsx`, `screens/landing/businessHelp/servicesSection.tsx`, `screens/landing/testimonials/testimonialCards.tsx`, `screens/landing/theTeam/index.tsx`, `screens/landing/bentoGrid/bentoGrid.tsx`, `screens/landing/about/aboutCard.tsx`, `screens/landing/faqs/accordion.tsx`, `screens/landing/hero/index.tsx` (15 occurrences alone — stars/avatars), `screens/landing/pricing/index.tsx`, `screens/landing/boreYouCommit/index.tsx`, `screens/serviceDetails/hero/index.tsx`, `screens/serviceDetails/whoThisIsFor/index.tsx`, `screens/serviceDetails/recommendedNextSteps/index.tsx`, `screens/saasApps/ai-calling/index.tsx`, `screens/faqs/faqList/faqsAccordion.tsx`.

Note: many of these are small (14–40px) decorative icons/avatars where the impact is minor — prioritize the **large, above-the-fold, or looped** images first (case-study cards, hero backgrounds, `app/_og/template.tsx`).

**Fix priority order:**
1. `screens/caseStudies/index.tsx:354` (looped hero background, largest blast radius)
2. Any hero/above-the-fold image in `screens/landing/hero/`, `screens/serviceDetails/hero/`, `screens/pricing/hero/`
3. Everything else, batched

### 2.2 Production builds skip linting entirely — Medium
```js
// next.config.js
eslint: { ignoreDuringBuilds: true },
```
`jsx-a11y` and `@next/next/no-img-element` are configured but never gate CI/deploys — regressions like 2.1 can land silently. Recommend running `npm run lint` as a required CI step even with this flag on, or removing the flag and fixing the current 57 errors/173 warnings first.

---

## 3. Typography & Color (Medium)

### 3.1 Sub-12px text widely used — Medium, 20 files / 42 occurrences
Arbitrary Tailwind sizes `text-[9px]`, `text-[10px]`, `text-[11px]` appear 42 times across 20 files — below the general 12px body-text floor. Heaviest concentrations:
- [components/ProjectEstimate.tsx](components/ProjectEstimate.tsx) — 7 occurrences
- [screens/saasApps/ai-calling/index.tsx](screens/saasApps/ai-calling/index.tsx) — 7 occurrences
- [app/contact/ContactPageClient.tsx](app/contact/ContactPageClient.tsx) — 5 occurrences
- [screens/caseStudies/index.tsx](screens/caseStudies/index.tsx) — 5 occurrences (including a `text-[9px]` at line 366/372)

Some of these are legitimate micro-badges ("NEW", category tags) where 10–11px is a defensible design choice; others (e.g. body captions) are not. Worth a manual pass rather than a blanket find/replace.

**Priority-table anti-pattern match:** *"Text < 12px body"* (Typography & Color, priority 6).

### 3.2 Brand color fails AA contrast for bold body-size text — Medium
Brand orange `#FF5B04` against white: relative luminance ≈0.288 → contrast ratio ≈**3.11:1**. This passes WCAG AA for *large* text (≥18.66px bold / 24px normal) and UI components, but fails for anything smaller/lighter. Watch for white-on-orange or orange-on-white at body sizes, e.g.:
```tsx
// components/LeadCaptureForm.tsx:332
className="... bg-gray-900 text-white ... hover:bg-[#FF5B04] ..."
// text-base (16px) font-bold — just under the 18.66px bold threshold for "large text"
```
**Fix:** either bump this button's hover text to `text-lg`, or keep the base `bg-gray-900` (which passes comfortably) and use the orange only for accents/large text/icons, not as a hover background under body-sized white text.

---

## 4. Forms & Feedback (Medium)

### 4.1 Validation errors aren't tied to the invalid field — Medium
[components/LeadCaptureForm.tsx:85-90](components/LeadCaptureForm.tsx#L85-L90):
```tsx
if (!form.name || !form.email) {
  setErrorMsg("Name and email are required.");
  setStatus("error");
  return;
}
```
The error renders as a single generic banner near the submit button ([line 321-328](components/LeadCaptureForm.tsx#L321-L328), correctly `role="alert"`), but neither `Input` gets `isInvalid`/`aria-describedby`, so a screen-reader or low-vision user gets "something's wrong" with no indication of *which* field.

**Guidance (ui-ux-pro-max, Forms → Error Placement, severity High):** *"Each invalid field needs an inline error connected to that field. Do: show a specific error below the input and reference it with `aria-describedby`. Don't: show only a top-level error without identifying each invalid field."*

**Fix:**
```tsx
<Input isRequired isInvalid={status === "error" && !form.name} errorMessage="Name is required" ... />
```
HeroUI's `Input` supports `isInvalid`/`errorMessage` natively — this is a small, local change, not a redesign.

**What's already good here:** required-field marking (`isRequired`), `autoComplete` hints, `role="group"`/`aria-labelledby` on the Chip selector groups, and a proper `role="alert"` on the error banner — the form's bones are solid, this is a targeted gap.

---

## 5. Navigation (Good — no action needed)

[components/navbar.tsx](components/navbar.tsx) is well-built: `aria-label={isMenuOpen ? "Close menu" : "Open menu"}` on the toggle, `Escape`-to-close wired to a `keydown` listener, and a live-region `announcement` state for menu open/close — this is above the bar for most marketing sites. No findings here.

---

## 6. Animation (Medium — see 1.2 for the reduced-motion gap)

Framer Motion is used broadly (39 files) with generally sensible, purposeful transitions (spring physics, staggered reveals) — no evidence of gratuitous "animate everything" anti-patterns. The one structural gap is motion-preference wiring, covered in 1.2.

---

## Priority action list

| # | Fix | Files affected | Effort |
|---|---|---|---|
| 1 | Add `<MotionConfig reducedMotion="user">` + guard `SmoothScroll` behind a media-query check | 2 files | Small |
| 2 | Add visible focus styles to the 3 inputs with bare `outline-none` | 3 files | Small |
| 3 | Replace `text-gray-400` → `text-gray-500`/`-600` for text usage | ~25 files | Medium (mostly mechanical) |
| 4 | Wire `isInvalid`/`errorMessage` into `LeadCaptureForm`'s Name/Email inputs | 1 file | Small |
| 5 | Convert `screens/caseStudies/index.tsx:354` looped background to `next/image` | 1 file, high impact | Small |
| 6 | Migrate remaining raw `<img>` → `next/image`, prioritizing hero/above-fold images | 29 files | Large (batch it) |
| 7 | Fix 3 `<p className="heading-center">` → `<h2>` | 2 files | Trivial |
| 8 | Decide: enforce `npm run lint` in CI, or keep `ignoreDuringBuilds: true` deliberately | `next.config.js` | Decision |

---

*Generated via the `ui-ux-pro-max` skill's local guideline database cross-referenced against manual code inspection of `app/`, `components/`, and `screens/`. Re-run `npm run lint` after fixes to confirm no new `jsx-a11y`/`@next/next` regressions.*
