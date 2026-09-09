# Services Pages Content Audit — UI Pirate

**Pages:** `/services/[id]` — all service detail pages
**Files in scope:**
- `app/services/[id]/page.tsx` (routing, metadata, JSON-LD)
- `data/sericesDetailsList.json` (all page content — note the misspelled filename `serices`)
- `screens/serviceDetails/` (section components)
- `config/site.ts`, `components/footer.tsx`, `app/layout.tsx`, `app/sitemap/page.tsx`, `screens/sitemap/index.tsx` (navigation into these pages)
- `screens/serviceDetails/whatYouGetAnimations/index.tsx` (heading → animation coupling)

**Focus:** Copy, messaging, positioning, structural decisions, internal linking, and SEO
**Research basis:** Apple HIG, Google Material UX Writing, Nielsen Norman Group, Copyhackers JTBD, E-E-A-T guidelines, CRO / service-page conversion research, agency differentiation & specialist-positioning studies (full principle set in the Research Foundation section below)
**Last audited:** 2026-08-27
**Note:** These pages are new — there is no v1 to compare against. This is the first audit.

---

## Research Foundation

Every recommendation in this document is grounded in the same cross-source principle set used for the landing, pricing, and about page audits, adapted for service / offering pages. Nothing below is opinion — each finding traces back to one or more of these.

### What the research consistently says

**Apple Human Interface Guidelines** — Every word should earn its place, and labels must be consistent. A service page that calls the same offering three different names ("UX/UI Design" / "UX/UI & Front End Development" / "SaaS Web & Mobile Apps") forces the reader to work out whether these are one thing or three. Avoid jargon that a non-designer buyer (VP Product, founder, CTO) can't parse.

**Google Material UX Writing** — Clarity is a concrete goal. Descriptions should read as sentences a buyer can act on, not comma-lists of capitalized nouns ("Product strategy, Product thinking, Competitive analysis"). The reader should finish each card knowing exactly what they'd get and when they'd need it.

**Nielsen Norman Group (NN/g)** — Service-page visitors arrive with a task in mind and scan for a match. They need, fast: what this service is, whether it fits their situation, what the process looks like, proof it has worked, and the next step. Progressive disclosure matters — broad offerings ("UX Audits & Consultation") need a one-line "is this you?" qualifier or the visitor can't tell if it applies.

**Copyhackers / Jobs-to-be-Done** — Buyers hire a service to make progress on a problem, not to receive deliverables. "Why most SaaS products break" (problem-first) outperforms "what you get: wireframes, UI, code" (deliverable-first). The strongest service copy names the buyer's current pain and the outcome, then lists deliverables as support.

**E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)** — Claims and proof must be verifiable. Generic portfolio galleries repeated on every service page are weak proof; a service-specific case study with a result metric and a matching testimonial is strong proof. JSON-LD `Service` data should carry a clean name and description, not a raw all-caps badge string.

**CRO / service-page conversion research** — High-performing service pages carry a scope signal near the top (typical timeline, engagement model, price band), a single clear primary CTA repeated down the page, and a natural "what's next" cross-sell. Broken internal links and dead-end CTAs ("Service not found", 404s from "recommended next step") are among the fastest trust killers.

**Agency differentiation / specialist positioning studies** — Buyers choose specialists. A service should name its category and its edge within it, and its audience list should be narrow enough to signal focus. "We'll build any website for SaaS teams, cafés, and personal portfolios" reads as generalist.

### How this audit applies the foundation

| Principle | Where it drives a finding in this document |
|---|---|
| Apple HIG — consistent naming | X1 (one service, three names + dead slugs), X5 (design vs front-end-dev boundary) |
| Material — sentences not noun-lists | "Idea to MVP" description; "What All Will you get in return" |
| NN/g — scan for fit, progressive disclosure | UX Audits `whoThisIsFor` (2 lowercase cards); missing "is this you?" qualifiers |
| Copyhackers / JTBD | `WhyThisMatters` (problem-first) praised; deliverable-first headings flagged |
| E-E-A-T | Generic `LandingWork` gallery on every page (X7); JSON-LD `name` = raw badge (X9) |
| CRO — scope signal, one CTA, working links | X1/X2 broken links, X8 no timeline/price, identical hardcoded hero CTAs |
| Specialist positioning | Landing Pages `whoThisIsFor` spans SaaS → café → portfolio |

---

## Scope Note — 4 pages in scope

The brief covers **4** service pages:

1. UX/UI Design
2. SaaS & AI Development
3. Landing Pages & Business Websites
4. UX Audits & Consultation

*(Note: A fifth service, Design System & Component Library, was previously in the data but has been fully killed and removed from scope).*

---

## How These Pages Are Built

Every service page renders the same component sequence from `screens/serviceDetails/index.tsx`, driven entirely by the JSON for that slug:

```
1.  Hero            — badge, 2-line headline (word-level highlight), description, 2 CTAs
2.  WhatYouGet      — badge, heading, 4–6 cards (heading + description + animation/image)
3.  WhyThisMatters  — badge, heading + heading2, 3–5 "problem → quick win" cards
4.  StreamlinedProcess — badge, heading, 2 workflow groups × 3–4 steps
5.  LandingWork     — generic works/portfolio gallery (NOT filtered by service)
6.  WhoThisIsFor    — badge, heading, 2–3 audience cards
7.  RecommendedNextSteps — 1 featured service + 1–2 "other services" links
8.  GlobalCTA       — shared final CTA
```

Notes that affect every page:

- **`youWillGet` block exists in the data but is not rendered** by `serviceDetails/index.tsx`. Five fully-written content blocks (badges, mockups, descriptions) are dead weight in the JSON. Either wire it in or delete it.
- **`ServiceDetails` renders `<div>danis...</div>`** as its no-data fallback (`screens/serviceDetails/index.tsx:16`). A developer placeholder is shippable in production. Replace with the proper "Service not found" state or `notFound()`.
- **The hero CTAs are identical on all 5 pages** — "Start Your Product Journey — Book a 15-Min Call" (→ `/contact`) and "Let's Talk via WhatsApp". They are hardcoded in `screens/serviceDetails/hero/index.tsx`, not data-driven, so they cannot be tailored per service. WhatsApp as a primary-adjacent CTA is inconsistent with the landing/about/pricing audits, which recommended removing WhatsApp from hero and using cal.com.
- **The hero badge has a hardcoded fallback** `"EMPOWERING 40+ Business ACROSS 6 COUNTRIES"` — grammatically broken ("40+ Business", all-caps) and inconsistent with the "50+ Products Shipped Across 6 Countries" figure standardized on the landing and about pages. It only shows if `data.hero.badge` is missing, but it should still be fixed or removed.

---

## Cross-Cutting Issues (affect multiple / all service pages)

### X1. Broken internal links into and between service pages 🔴

The route matcher in `page.tsx` normalizes any slug to lowercase-hyphenated and compares. The canonical normalized slugs are:

| Service | Normalized slug that resolves |
|---|---|
| UX/UI Design | `ux-ui-design` |
| SaaS & AI Development | `saas-ai-development` |
| Landing Pages & Business Websites | `landing-pages-business-websites` |
| UX Audits & Consultation | `ux-audits-consultation` |
| Design System & Component Library | `design-system-component-library` |

Links that **do not resolve** to these (they render the bare "Service not found" text block):

| Location | Broken href / slug | Problem |
|---|---|---|
| `app/layout.tsx:415` | `/services/SaaS-Web-&-Mobile-Apps` | Normalizes to `saas-web-mobile-apps` — no match |
| `config/site.ts:9` (navbar "Services" parent) | `/services` | No `/services` index route exists at all |
| `config/site.ts` mobile nav parent | `/services` | Same |
| `data` — UX/UI Design → `recommendedNextSteps.featuredService` | (ok: `landing-pages-business-websites`) | fine |
| `data` — SaaS & AI Dev → `recommendedNextSteps` "other" | `ux-ui-design` | fine, but featured slug is `ux-ui-design` ✓ |
| `data` — Landing Pages → `recommendedNextSteps.otherServices[0]` | `ux-ui-front-end-development` | No match — 404-equivalent |
| `data` — UX Audits → `recommendedNextSteps.featuredService` | `ux-ui-front-end-development` | No match — this is the *primary* recommended next step and it's broken |
| `data` — Design System → `recommendedNextSteps.otherServices[0]` | `ux-ui-front-end-development` | No match |

**The pattern:** the data was written when the first service was called "UX/UI & Front End Development" (slug `ux-ui-front-end-development`). It was later renamed to "UX/UI Design" (`ux-ui-design`) but the cross-links were never updated. **Every "recommended next step" that points to the UX/UI service is currently broken.**

**Fix:** Standardize on one slug per service. Do a find-and-replace across `sericesDetailsList.json`, `layout.tsx`, `config/site.ts`, `footer.tsx`, both sitemap files, so every reference uses the same 4 (or 5) canonical slugs. Consider switching the router to match on an explicit `slug` field rather than fuzzy-normalizing display names.

---

### X2. No `/services` hub page 🔴

The navbar "Services" label links to `/services`, which does not exist. Users who click the parent (rather than hovering for the dropdown) hit a dead route. There is also no page that presents the 4 services side-by-side with scannable differences (timeline, price band, when to pick which). Every entry point is a deep link into one service.

**Recommendation:** Build a `/services` index page:
- Short intro framing the 4 services as stages of one journey (idea → design → build → audit)
- One card per service: name, one-line outcome, timeline, "best when…" line, link
- A simple "which one do I need?" decision aid
This also gives the site a page to rank for the head term "product design and development services" rather than only long-tail per-service queries.

---

### X3. Placeholder / copy-paste content left in production 🔴

Content clearly pasted from another service and never rewritten:

| Page | Field | Current (wrong) value | Should be about |
|---|---|---|---|
| Design System | `hero.heading` | "Your Website Isn't a Brochure, It's a Sales Tool" | Design systems — this headline belongs to Landing Pages |
| UX Audits | `whyThisMatters.heading` | "Why Most 3D On Websites Fails (And How We Do It Right)" | UX audit value — leftover from a deleted 3D/animation service |
| UX Audits | `streamlinedProcess.heading` | "Design System Roadmap" | The audit process |
| UX Audits | `streamlinedProcess.workflow` | Website-build steps: "CMS setup", "Full Stack Development", "QA & SEO Optimization", "connect domains" | Audit steps: scope → heuristic review → journey analysis → findings readout → prioritized roadmap |
| Design System | `streamlinedProcess.workflow` | Same generic website-build steps as above | Token architecture → component inventory → build → documentation → handoff |
| Design System & UX Audits | `streamlinedProcess` | Both workflow groups are badged **"Design Workflow"** (duplicate label) | Two distinct phase names |
| Landing Pages, Design System, UX Audits | `youWillGet.description` | Identical boilerplate: "We design & build intuitive user interfaces and working apps for SaaS, AI tools, dashboards, mobile-first products…" | Per-service description (also: block isn't rendered — see below) |
| UX Audits | `youWillGet.rightBadges` | "Prioritized Suggestions" appears **twice** | Two different deliverables |
| Design System | `whoThisIsFor` | Cards about "UI illustrations & icon sets", "pitch decks", "logo and visual identity", "print-ready materials" | This is old **Graphic Design** service copy, not a design-system audience |

None of this is subtle — a visitor comparing services will see a design-system page headlined about brochures and an audit page explaining why "3D on websites fails."

---

### X4. `whatYouGet` card headings are silently coupled to animations 🟠

`screens/serviceDetails/whatYouGetAnimations/index.tsx` maps **exact heading strings** to animated visual components:

```
"UX/UI Design & Prototype", "UI Development & Integration", "Idea to MVP", "Mobile Optimization",
"Landing Pages & Corporate Websites", "Design & Frontend Development",
"SEO Performance & AI-Readable Websites", "Fully Responsive Experience",
"Heuristic UX Audit Report", "Drop-Off & Friction Insights",
"Flow & Interaction Review", "Walkthrough Video"
```

Consequences for a content edit:
- **Rewording any of these 12 headings removes its animation** and silently falls back to a static SVG (or nothing). Content editors need to know this list is load-bearing.
- **SaaS & AI Development's four headings are not in the map at all** ("Full-Stack Architecture", "AI & LLM Integration", "API & Third-Party Integrations", "Cloud Deployment & Scaling"). They fall back to `image` SVGs that are **mislabeled** — e.g. "Full-Stack Architecture" uses `ui_f5z5ar.svg`, "API & Third-Party Integrations" uses `ux_wfeudq.svg`. The icons don't match the concepts.
- **Design System's cards use the key `img`, not `image`** — the component reads `image || img` so it renders, but it's an inconsistency waiting to break.

**Recommendation:** Decouple — add an explicit `visualKey` field per card in the JSON, or accept static icons for all and drop the string-matched animation map. At minimum, document the 12 protected strings and add SaaS & AI Development to the map with correct icons.

---

### X5. Positioning boundary between "UX/UI Design" and "SaaS & AI Development" is unclear 🟠

- **UX/UI Design** hero badge: "SAAS & AI PRODUCT UX/UI & FRONT END DEVELOPMENT". Its `whatYouGet` includes "UI Development & Integration — Production-ready UI built using React, Next.js, or Angular" and "Idea to MVP — Product strategy, Product thinking, Competitive analysis".
- **SaaS & AI Development** covers "Full-Stack Architecture", "AI & LLM Integration", "APIs", "Cloud Deployment".

So front-end development, product strategy, and competitive analysis appear on the UX/UI page, while back-end/infra is the SaaS page. A buyer reading the UX/UI page can reasonably think it already includes the build. The two pages need an explicit "where this ends and the next service begins" line, or the front-end-dev scope should move entirely onto one page.

**Also:** the UX/UI Design page's SEO title is "SaaS & Mobile App UX/UI Design | Idea to Product | Angular, React" while its hero badge says "…& FRONT END DEVELOPMENT". Pick one name for this service and use it in the badge, the H1 region, the SEO title, the nav label, the footer, and the cross-links (see X1).

---

### X6. `WhoThisIsFor` inconsistency 🟡

- UX/UI, SaaS, Landing Pages, Design System each have **3** audience cards. **UX Audits has only 2**, and its headings are lowercase sentence fragments ("anyone looking to upgrade their product experience & conversions") while every other page uses Title Case noun phrases ("SaaS & AI Startups", "Enterprise Teams"). Normalize to 3 cards, Title Case, parallel structure.

---

### X7. Social proof on service pages is generic 🟡

Every page drops in the same `LandingWork` gallery — not filtered to the service. A visitor on the UX Audits page sees the same portfolio as a visitor on Landing Pages. There is no service-specific case study, no testimonial tied to that service, and no result metric. The about and landing audits both praised the "client logos with names + industries + result metric" pattern — service pages get none of it.

**Recommendation:** Per service, show 2–3 relevant projects (or a single mini case study with a metric) and one testimonial from a client who bought that service.

---

### X8. No timeline or price signal on most pages 🟡

Only Design System's hero badge carries a delivery estimate ("1–4 Week Delivery"). The other three give no sense of scope, duration, or price band anywhere on the page — the visitor has to book a call to learn if it's a 2-week or 3-month engagement. `data/servicesTopList.json` already has timeline chips ("1-2 months", "2-4 weeks") that aren't surfaced here.

**Recommendation:** Add a small fact strip near the hero: typical timeline, engagement model (fixed scope / retainer), and "starts at" or "from $X" if pricing allows. This is a standard service-page conversion element.

---

### X9. SEO metadata is keyword-stuffed and partly stale 🟡

`SERVICE_META` in `page.tsx`:
- `ux-ui-design` title: "SaaS & Mobile App UX/UI Design | Idea to Product | Angular, React" — three separate value props pipe-separated; over ~60 chars it truncates in SERP.
- `keywords` meta is present and very long on every entry. The `keywords` meta tag has had no ranking value in Google for over a decade — it's just page weight. Consider removing.
- `design-system-component-library` entry is still there — remove if the service is killed.
- The fallback branch builds titles like "…| Enterprise-grade design trusted by Fortune 500 companies." — an unverifiable claim that shouldn't ship as a default.
- JSON-LD `Service` schema uses `service.data.hero.badge` as the `name`. For UX/UI that means the schema name is the all-caps string "SAAS & AI PRODUCT UX/UI & FRONT END DEVELOPMENT". Give the schema a clean `name`.

---

## Section-by-Section Audit — Per Service

---

## 1. UX/UI Design  (`ux-ui-design`)

### 1a. Hero

| Field | Current | Assessment |
|---|---|---|
| Badge | `SAAS & AI PRODUCT UX/UI & FRONT END DEVELOPMENT` | 🟠 Too long for a badge, all-caps sentence, and names a different scope than the page title. Shorten to e.g. `SAAS & AI PRODUCT DESIGN`. Resolve the design-vs-front-end-dev naming (X5). |
| Headline | "Build **SaaS, AI & Mobile apps** that scale & convert consistently." | 🟡 "scale & convert consistently" is two benefits welded together; "consistently" is doing little. Tighten: "Build SaaS, AI & mobile apps that scale — and convert." |
| Description | "…from MVP Figma wireframes to fully developed enterprise grade products." | ✅ Clear span-of-service statement. "enterprise grade" → "enterprise-grade" (hyphen). |

### 1b. WhatYouGet — "Everything You Need to Design & Build a SaaS Product"

Cards: UX/UI Design & Prototype · UI Development & Integration · Idea to MVP · Mobile Optimization.

- 🟠 "Idea to MVP — Product strategy, Product thinking, Competitive analysis" — the description is a comma list of capitalized nouns, not a sentence. Rewrite: "Product strategy, competitive analysis, and scope definition to get from concept to a buildable MVP."
- 🟡 Heading says "Design & Build a SaaS Product" but the audience also includes mobile and AI tools (per the hero). Align.
- 🟠 Card headings are animation-coupled (X4) — flag before editing.

### 1c. WhyThisMatters — "Why Most SaaS & AI Products Break (And How We Fix It)"

Cards: Hidden Churn · Product Fragility · Too Many Questions · Commitment Risk · Trust Gap.

- ✅ Strong section. The "problem as a question → sharp answer" format works and the answers are quotable ("They didn't get stuck — they got confused. Confusion creates silent churn").
- 🟡 Typos: "consistent" should be "consistently" (Trust Gap quick win). Smart quotes are inconsistent with straight quotes elsewhere — pick one.
- 🟡 "Too Many Questions — Why do buyers ask endless questions?" drifts into sales enablement, slightly off-theme from the other four which are about product usability. Fine to keep but it's the weakest of the five.

### 1d. StreamlinedProcess — "Complete SaaS Web & Mobile App Workflow"

Two groups: Design Workflow (Discovery → UX & Wireframes → UI & Prototyping) and Development Workflow (Setup → Full Stack Development → Testing, Launch & Handoff).

- ✅ This is the best-written process block of the five — specific, correctly sequenced, distinct phase names.
- 🟠 It promises "Full Stack Development" and "production-ready code" — which overlaps the SaaS & AI Development service (X5). Either scope this to front-end only here, or make the relationship explicit.

### 1e. WhoThisIsFor — SaaS & AI Startups · Enterprise Teams · Design / Dev Agencies

- ✅ Good three-way split; parallel structure; each card names a real pain. Keep.

### 1f. RecommendedNextSteps

- Featured: "Landing Pages & Business Websites" (slug ok). Copy is reasonable ("Once your product is ready, the next bottleneck is adoption").
- 🟡 "Once your product is ready" assumes the reader just finished a build — but this service *is* the build. Reframe as "When the product's ready, you'll need somewhere to send traffic."

### 1g. SEO
- Title over-long (X9). Suggested: "SaaS & Mobile App UX/UI Design | UI Pirate" (≤60 chars) with the Angular/React detail in the description.

---

## 2. SaaS & AI Development  (`saas-ai-development`)

### 2a. Hero

| Field | Current | Assessment |
|---|---|---|
| Badge | `SAAS & AI FULL-STACK ENGINEERING` | ✅ Clear and appropriately scoped. |
| Headline | "Build the **engine** behind your SaaS or AI product." | ✅ Strong metaphor, clearly differentiates from the design service. Keep. |
| Description | "…We build what the interface runs on." | ✅ One of the sharpest one-liners across all five pages. Keep. |

### 2b. WhatYouGet — "Everything You Need to Ship a Working SaaS or AI Product"

Cards: Full-Stack Architecture · AI & LLM Integration · API & Third-Party Integrations · Cloud Deployment & Scaling.

- ✅ Card copy is specific and buyer-relevant ("prompt pipelines", "REST/GraphQL", "CI/CD", "load-test for the scale you're growing into").
- 🔴 None of these 4 headings are in the animation map, so they render **mislabeled icons** (X4). Fix the icon mapping or add proper visuals.

### 2c. WhyThisMatters — "Why Most SaaS & AI Builds Stall (And How We Fix It)"

Cards: Fragile Foundations · AI That Doesn't Ship · Integration Debt · Scaling Surprises · Handoff Gaps.

- ✅ Excellent — the strongest WhyThisMatters block of the five. Every card is a real failure mode with a credible one-line fix. "AI That Doesn't Ship — integrating a model into a real product is a different problem than a prototype" is a genuine differentiator. Keep all five verbatim.

### 2d. StreamlinedProcess — "Complete SaaS & AI Development Workflow"

Architecture Workflow (Discovery & Technical Scoping → System & Database Architecture → AI/LLM Pipeline Design) + Engineering Workflow (Infra Setup → Full-Stack Development → Testing, Launch & Handoff).

- ✅ Well-structured, distinct phase names, correct order. Keep.

### 2e. WhoThisIsFor — SaaS Founders · Teams Adding AI Features · Agencies Needing Backend Help

- ✅ Clean parallel structure. "Teams Adding AI Features — without rebuilding from scratch" is a sharp, specific hook. Keep.

### 2f. RecommendedNextSteps
- Featured: "UX/UI Design" — **slug is `ux-ui-design`** here, which resolves. ✅ (This is the only page whose UX/UI cross-link is correct — use it as the reference when fixing the others.)
- 🟡 Only one "other service" listed (UX Audits). The others list two. Add one for balance.

### 2g. SEO
- Title: "SaaS & AI Development | Full-Stack Engineering | Angular, React, Node.js" — borderline long but acceptable; consider trimming the framework list to the description.

---

## 3. Landing Pages & Business Websites  (`landing-pages-business-websites`)

### 3a. Hero

| Field | Current | Assessment |
|---|---|---|
| Badge | `Landing Pages & Business Websites` | 🟡 It's just the page title in title case — every other badge is a positioning phrase in caps. Make it do work: `CONVERSION-FIRST WEB DESIGN & BUILD`. |
| Headline | "Your Website Isn't a Brochure, It's a **Sales Tool**" | ✅ Strong, opinionated, on-message. Keep. (Note: Design System currently steals this line — see X3.) |
| Description | "We design **model** landing pages & websites for small businesses to large corporations that communicate your value…" | 🟠 "model landing pages" is a typo/odd word (likely "modern"). Double space before "that". Rewrite: "We design and build landing pages and websites — from small businesses to large corporations — that communicate your value, look sharp on every device, and turn visitors into leads." |

### 3b. WhatYouGet — "Everything You Need to Launch and Convert"

Cards: Landing Pages & Corporate Websites · Design & Frontend Development · SEO Performance & AI-Readable Websites · Fully Responsive Experience.

- ✅ Solid. "AI-Readable Websites … optimized for search engines and AI discovery systems" is a timely, differentiated point.
- 🟡 "Fully Responsive Experience — works seamlessly across mobile, tablet, and desktop **without extra effort later**" — "without extra effort later" is vague; cut it.

### 3c. WhyThisMatters — "Why Most Business Websites Don't Convert (And What We Do Differently)"

Six cards: First Impressions Matter · Clarity Beats Creativity · Messaging Drives Action · Mobile Is Not Optional · Speed Is Perception · Users Scan, They Don't Read.

- 🟠 **Six cards is too many** and several overlap: "Clarity Beats Creativity", "Messaging Drives Action", and "Users Scan, They Don't Read" are three versions of "clarity > everything". Consolidate to 4: Clarity in 5 seconds · Messaging drives action (absorbs scanning) · Mobile-first or lose them · Speed = credibility.
- 🟡 Leading spaces inside several `QuickWins` strings (" If clarity is missing…"). Trim.

### 3d. StreamlinedProcess — "From idea to live website"

Website Strategy & Design (Discovery & Positioning → Structure & Messaging → Visual Design & Prototyping) + Website Development (Development Setup → Build & QA → Launch & Handoff).

- ✅ Clean and correctly scoped. Note this group's step cards have **no `icon` field** (the other services' process steps do) — they'll render without icons. Add icons or confirm that's intended.

### 3e. WhoThisIsFor — SaaS & Product Teams · Local Businesses · Portfolios & Personal Brand Sites

- 🟡 This spans a very wide range (venture SaaS → a café → a personal portfolio). It signals "we'll build any website for anyone", which the target-audience audit specifically warned against. Consider dropping "Portfolios & Personal Brand Sites" and keeping the two commercial audiences, or splitting local-business work into its own lower-priority mention.

### 3f. RecommendedNextSteps
- Featured: "UX Audits & Consultation" (slug ok).
- 🔴 `otherServices[0]` → title "UX/UI & Front End Development", slug **`ux-ui-front-end-development`** — broken (X1). Change to "UX/UI Design" / `ux-ui-design`.

### 3g. SEO
- Title: "Landing Page & Website Design & Development | Angular, React & Webflow" — fine.

---

## 4. UX Audits & Consultation  (`ux-audits-consultation`)

This page has the most content problems of the four in-scope services.

### 4a. Hero

| Field | Current | Assessment |
|---|---|---|
| Badge | `UX Audits & Consultation` | 🟡 Same issue as Landing Pages — it's just the title. Try `FIND THE FRICTION BEFORE YOU BUILD MORE`. |
| Headline | "Find What's Blocking Growth, **Before You Build More**" | ✅ Excellent — it's a decision reframe, not a service name. Keep. |
| Description | "We identify where users hesitate, drop off, or lose confidence — and tell you exactly what to fix, why it matters, and what to do next." | ✅ Crisp, specific, outcome-led. Keep. |

### 4b. WhatYouGet — "What All Will you get in return"

- 🟠 Heading is broken English. Replace with "What You Get" or "What's in the Report".
- Cards: Heuristic UX Audit Report · Drop-Off & Friction Insights · Flow & Interaction Review · Walkthrough Video — ✅ these are good, concrete deliverables. "Walkthrough Video" is marked "Optional" in its description — if it's optional, consider not listing it as a core deliverable, or label the tier.

### 4c. WhyThisMatters — heading is WRONG

- 🔴 Current heading: **"Why Most 3D On Websites Fails (And How We Do It Right)"** — leftover from a deleted service. Replace with something like "Why Products Stall After Launch (And How an Audit Fixes It)".
- The five cards themselves (Unclear First Steps · Too Many Decisions · Features Without Priority · Demo vs. Daily Use Gap · Silent Churn) are ✅ genuinely strong and on-topic. "Demo vs. Daily Use Gap — products optimized for presentations often break in daily workflows" is a sharp insight. Keep the cards, fix the heading.

### 4d. StreamlinedProcess — entirely wrong content

- 🔴 Heading: **"Design System Roadmap"** — wrong.
- 🔴 Both workflow groups are badged "Design Workflow" and the steps are a **website build process** ("Onboarding & Research", "Setup & Configuration — CMS, repositories, React or Next.js", "Full Stack Development", "QA & SEO Optimization", "Launch & Handoff — deploy your live site, connect domains").
- **None of this describes a UX audit.** Rewrite the whole block, e.g.:
  - *Audit* — Scope & Access → Heuristic Evaluation → User Journey & Flow Analysis → Friction & Drop-off Mapping
  - *Readout* → Prioritized Findings → Recommendations Roadmap → Walkthrough Call

### 4e. WhoThisIsFor — only 2 cards, lowercase headings

- 🟠 Cards: "Founders or startups who are just starting out" and "anyone looking to upgrade their product experience & conversions". Lowercase, non-parallel, and only two (X6). Rewrite as 3 Title Case cards, e.g.: "Early-Stage Founders" · "Teams With Stalled Growth" · "Pre-Redesign Product Leads".

### 4f. youWillGet (not rendered, but if wired in)
- 🟡 "Prioritized Suggestions" listed twice in `rightBadges` (X3). Description is the wrong boilerplate.

### 4g. RecommendedNextSteps
- 🔴 Featured: title "SaaS & AI Product UX/UI & Front End Development", slug **`ux-ui-front-end-development`** — broken (X1). This is the primary next step on the page and it 404s. Point to `ux-ui-design`.
- 🟡 `otherServices` lists "UX Audits & Consultation" as an *other service* — i.e. the page recommends itself. Remove.

### 4h. SEO
- Title: "UX Audit & Consultation | Improve Your Product's Usability" — ✅ fine.

---

## Priority Fix Table

| # | Scope | Issue | Priority |
|---|---|---|---|
| 1 | All | Broken cross-links — every "recommended next step" to the UX/UI service uses dead slug `ux-ui-front-end-development`; `layout.tsx` uses dead `SaaS-Web-&-Mobile-Apps` | 🔴 Fix now |
| 2 | Nav | `/services` parent link 404s — no hub page exists | 🔴 Fix now |
| 3 | UX Audits | `whyThisMatters` heading = "Why Most 3D On Websites Fails" (wrong service) | 🔴 Fix now |
| 4 | UX Audits | `streamlinedProcess` = website-build steps + heading "Design System Roadmap" (entirely wrong) | 🔴 Fix now |
| 6 | All | `screens/serviceDetails/index.tsx` ships `<div>danis...</div>` as the no-data fallback | 🔴 Fix now |
| 8 | SaaS & AI Dev | 4 `whatYouGet` headings unmapped → mislabeled icons | 🟠 Soon |
| 9 | All | `youWillGet` content block written but never rendered — wire in or delete (5 blocks) | 🟠 Soon |
| 10 | UX/UI vs SaaS | Positioning overlap (front-end dev + strategy on both) — draw the boundary | 🟠 Soon |
| 11 | Landing Pages | `whyThisMatters` has 6 cards, 3 overlapping — consolidate to 4 | 🟠 Soon |
| 12 | Landing Pages | "model landing pages" typo (→ "modern"); double spaces; leading spaces in QuickWins | 🟠 Soon |
| 13 | UX Audits | "What All Will you get in return" heading — broken English | 🟠 Soon |
| 14 | UX Audits | `whoThisIsFor` = 2 lowercase cards; normalize to 3 Title Case | 🟠 Soon |
| 15 | UX Audits | `recommendedNextSteps` recommends itself as an "other service" | 🟠 Soon |
| 16 | All | Hero CTAs hardcoded + identical on every page; WhatsApp in hero contradicts other audits | 🟠 Soon |
| 17 | All | No `/services` hub page for the head SEO term + side-by-side comparison | 🟠 Soon |
| 18 | All | Generic `LandingWork` gallery — no service-specific proof / metric / testimonial | 🟡 Consider |
| 19 | All | No timeline / price / engagement-model signal (except Design System badge) | 🟡 Consider |
| 20 | All | `whatYouGet` heading→animation string coupling is undocumented and fragile | 🟡 Consider |
| 21 | All | `keywords` meta tags (very long) have no SEO value — remove | 🟡 Consider |
| 22 | All | JSON-LD `Service.name` uses the raw all-caps hero badge | 🟡 Consider |
| 23 | All | Hero badge fallback "EMPOWERING 40+ Business ACROSS 6 COUNTRIES" — grammar + inconsistent figure | 🟡 Consider |
| 24 | Landing Pages | `whoThisIsFor` spans SaaS → café → personal portfolio — too broad | 🟡 Consider |
| 25 | Data file | Filename is misspelled `sericesDetailsList.json` | 🟡 Consider |

**Priority key:** 🔴 Fix now — broken links, wrong-service content, dev placeholders in prod · 🟠 Soon — copy quality & positioning with real conversion impact · 🟡 Consider — polish, consistency, SEO hygiene

---

## What's Working Well

1. **SaaS & AI Development** is the strongest page of the five — the "engine behind your product" frame, the `WhyThisMatters` cards, and the process block are all sharp and need almost no copy work.
2. **Headlines** across the set are mostly good: "Build the engine behind your SaaS or AI product", "Your Website Isn't a Brochure, It's a Sales Tool", "Find What's Blocking Growth, Before You Build More" — all are reframes or opinions, not service labels.
3. **The `WhyThisMatters` format** — a customer question, then a one-line answer that reframes the problem — is a genuinely good structure. When the content is on-topic (SaaS, UX Audits cards) it produces quotable, differentiated copy. Keep the format on every page.
4. **The shared page skeleton** (hero → what you get → why it matters → process → proof → who it's for → next step → CTA) is a sound service-page structure. The problems are content, linking, and a couple of unrendered/placeholder blocks — not the architecture.
5. **`RecommendedNextSteps`** is a smart idea — cross-selling the natural next service — and just needs its links fixed.

---

## Copy Tone Reference (carry over from prior audits)

| ✅ Do | ❌ Avoid |
|---|---|
| Reframe the decision ("before you build more") | Name the service and stop ("UX Audits & Consultation") |
| Write descriptions as sentences | Comma lists of Capitalized Nouns |
| One idea per card | 6 cards where 4 would do (Landing Pages WhyThisMatters) |
| Service-specific proof + a metric | The same generic portfolio on every page |
| One canonical slug + name per service, used everywhere | "UX/UI Design" / "UX/UI & Front End Development" / "SaaS Web & Mobile Apps" for one thing |
| Straight quotes, trimmed strings, hyphenated compounds ("enterprise-grade") | Smart/straight quote mix, leading spaces, "model landing pages" |

---

*Related audits: `01-landing-page.md` · `02-target-audience-audit.md` · `03-pricing-page.md` · `04-about-page.md`*

---
---

# v3 Audit Update — Services Pages
**Audited:** 2026-08-31
**Audit basis:** Direct source-code inspection of `app/services/[id]/page.tsx`, `app/services/[id]/opengraph-image.tsx`, `data/sericesDetailsList.json` (BOM-encoded, 5 entries), `data/servicesTopList.json`, all 7 `screens/serviceDetails/*` components, `components/LetsTalkButton.tsx`, `config/site.ts`, `components/footer.tsx`, `app/layout.tsx`, `app/sitemap/page.tsx`, `screens/sitemap/index.tsx` + SEO Content skill (E-E-A-T framework, Google Helpful Content guidelines, AI Citation Readiness, service-page CRO lens)
**Scope:** Copy, content, SEO metadata, JSON-LD copy, and internal-link integrity only. No UI/layout/animation changes evaluated.

---

## What Actually Changed Since v2 (Code-Verified)

Every v1/v2 cross-cutting item (X1–X9) and the dev-hygiene notes were re-checked against the live source on 2026-08-31.

| Item | v2 Status | v3 Code Reality |
|---|---|---|
| **X1** — broken cross-links | 🔴 | 🟡 **Partially fixed.** Navbar (`config/site.ts` L15-40), visual footer (`components/footer.tsx` L235-259), and both sitemap files now use resolvable slugs (`/services/UX-UI-Design` → normalizes to `ux-ui-design`). Design System removed from navbar, footer, and sitemap. **Still broken:** (a) `app/layout.tsx` L416 SEO footer still links `/services/SaaS-Web-&-Mobile-Apps` → normalizes to `saas-web-mobile-apps` → no match; (b) `app/layout.tsx` L418 still links the half-killed Design System page; (c) every in-JSON `recommendedNextSteps` slug pointing at the UX/UI service still reads `ux-ui-front-end-development` (Landing Pages, UX Audits, Design System) — see NF1. |
| **X2** — no `/services` hub | 🔴 | ❌ **Not fixed.** `app/services/` contains only `[id]/`. Navbar "Services" parent (`config/site.ts` L9, L112) still points at `/services` → 404. No side-by-side comparison page exists. |
| **X3** — placeholder / copy-paste content | 🔴 | 🟡 **Partially fixed — and the wrong page got the fix.** Design System now has correct `hero.description`, `whyThisMatters.heading` (`Why Most Design Systems Fail to Scale`), `streamlinedProcess.heading` (`Built for Consistency`), and `whatYouGet.heading` (`What This Service Includes`). **But UX Audits is untouched:** `whyThisMatters.heading` still `Why Most 3D On Websites Fails ` (trailing space and all), `streamlinedProcess.heading` still `Design System Roadmap`, `whatYouGet.heading` still `What All Will you get in return`. Design System `hero.heading` still `Your Website Isn't a Brochure, It's a Sales Tool` (Landing Pages' line). Both Design System and UX Audits `streamlinedProcess` still badge both workflow groups `Design Workflow`. Landing Pages `hero.description` still `We design model landing pages…corporations  that` (typo + double space). |
| **X4** — heading↔animation string coupling | 🟠 | ❌ **Not fixed.** `whatYouGetAnimations/index.tsx` L10-23 still maps 12 exact heading strings. SaaS & AI Development's 4 `whatYouGet` headings (`Full-Stack Architecture`, `AI & LLM Integration`, `API & Third-Party Integrations`, `Cloud Deployment & Scaling`) are still absent from the map → still fall back to mislabeled `image` SVGs. No `visualKey` field added. |
| **X5** — UX/UI vs SaaS boundary / one service, three names | 🟠 | ❌ **Not fixed.** UX/UI `hero.badge` still `SAAS & AI PRODUCT UX/UI & FRONT END DEVELOPMENT`; SERVICE_META title still `SaaS & Mobile App UX/UI Design | Idea to Product | Angular, React`; nav/footer label `UX/UI Design`; OG-image badge `UX/UI Design`. Four names, one service. |
| **X6** — `WhoThisIsFor` inconsistency | 🟡 | ❌ **Not fixed.** UX Audits still has **2** cards with lowercase sentence-fragment headings (`Founders or startups who are just starting out`, `anyone looking to upgrade their product experience & conversions`). Every other service has 3 Title Case cards. **New:** section `heading` itself is inconsistent — `Does it sound like you?` (UX/UI, SaaS, Design System) vs `Does this sound like you?` (Landing Pages, UX Audits). See NF2. |
| **X7** — generic social proof | 🟡 | ❌ **Not fixed.** `serviceDetails/index.tsx` L40 still renders a bare `<LandingWork />` — same portfolio on all 5 pages, no service filter, no metric, no service-specific testimonial. |
| **X8** — no timeline / price signal | 🟡 | ❌ **Not fixed.** Only Design System's badge carries a delivery estimate. `data/servicesTopList.json` still holds unused timeline chips (`1-2 months`, `2-4 weeks`) that are never surfaced on the detail pages. |
| **X9** — SEO metadata stuffed / stale | 🟡 | ❌ **Mostly not fixed.** `ux-ui-design` title still 3 pipe-separated value props (~64 chars). `keywords` meta still long on all 5 entries. `design-system-component-library` still in `SERVICE_META` (L52-59) and in `SERVICE_OG` (`opengraph-image.tsx`). Fallback branch still generates `…Enterprise-grade design trusted by Fortune 500 companies.` (`page.tsx` L78). JSON-LD `Service.name` still `service.data.hero.badge` (all-caps sentence) — `page.tsx` L125-126. |
| Dev hygiene — `<div>danis...</div>` no-data fallback | 🔴 | 🟡 **Partially fixed.** `page.tsx` L108-115 now returns a real `Service not found` block. **But** `serviceDetails/index.tsx` L16 still ships `if (!data) return <div>danis...</div>;`, and `page.tsx` returns HTTP 200 for an unknown slug — a **soft 404** (no `notFound()` call). See NF4. |
| Hero CTAs hardcoded + WhatsApp | 🟠 | ❌ **Not fixed.** `serviceDetails/hero/index.tsx` L105 primary CTA → `/contact` (not cal.com); L220 secondary CTA → `https://wa.link/i35lma`, label `Lets Talk via Whatsapp` (L245). Identical on all 5 pages. Contradicts the landing / pricing / about audits. |
| Hero badge fallback string | 🟡 | ❌ **Not fixed.** `hero/index.tsx` L76 still `"EMPOWERING 40+ Business ACROSS 6 COUNTRIES"`. |
| `youWillGet` block written but not rendered | 🟠 | ❌ **Not fixed.** All 5 entries still carry a full `youWillGet` block; `serviceDetails/index.tsx` never references it. |
| OG images per service | (not in v2) | ✅ **New since v2 — good.** `app/services/[id]/opengraph-image.tsx` defines a per-service `SERVICE_OG` map with clean badge/title/description. This is the model the JSON-LD `name` should copy (NF3). |

**Summary:** since v2, the only landed fixes are (1) navbar/visual-footer/sitemap slugs, (2) Design System's four section headings, (3) a real "Service not found" text block, and (4) per-service OG images. **Every 🔴 structural item that matters — the hub page, the UX Audits wrong-service content, the SEO-footer broken links, the in-JSON cross-links, the `danis` placeholder, the WhatsApp CTAs — is still open.** Six new findings below.

---

## New Findings (v3 — Not in v1/v2)

### NF1. `RecommendedNextSteps` does no internal linking at all — every button is an undisclosed WhatsApp link 🔴

**Confirmed in:** `screens/serviceDetails/recommendedNextSteps/index.tsx` L67-72 and L84-90, plus `components/LetsTalkButton.tsx` L34-35.

The featured-service CTA renders `<LetsTalkButton children={data.featuredService.buttonText} .../>` with **no `href` prop**. Each "Other Services You May Need" item renders `<LetsTalkButton children={service.title} .../>` — also **no `href`**, and `service.slug` is **never read by the component**.

`LetsTalkButton`'s default is `href = "https://wa.link/i35lma"` (its own JSDoc: *"Opens WhatsApp by default"*).

**Consequences:**
- The entire "Recommended Next Steps" section on all 5 service pages links to **WhatsApp**, not to the service being recommended. A visitor who clicks "Landing Pages & Business Websites" on the UX/UI page is dropped into a WhatsApp chat, not onto the Landing Pages page.
- The broken `ux-ui-front-end-development` slugs flagged in v2 (X1) are **dead data** — they're in the JSON but the component ignores them. Fixing the slug strings alone changes nothing; the component has to be given `href={`/services/${slug}`}`.
- This is the single largest internal-linking gap on the site: the one section explicitly designed to pass link equity and guide the journey between services passes none.

**Fix:** in `recommendedNextSteps/index.tsx`, pass `href={`/services/${data.featuredService.slug}`}` on the featured CTA and `href={`/services/${service.slug}`}` on each other-service button, and correct the 4 stale slugs in the JSON (NF ref table below). Then these become real internal links.

---

### NF2. `WhoThisIsFor` section heading is inconsistent across services 🟡

**Confirmed in:** `data/sericesDetailsList.json`

| Service | `whoThisIsFor.heading` |
|---|---|
| UX/UI Design | `Does it sound like you?` |
| SaaS & AI Development | `Does it sound like you?` |
| Design System | `Does it sound like you?` |
| Landing Pages & Business Websites | `Does this sound like you?` |
| UX Audits & Consultation | `Does this sound like you?` |

`it` vs `this` — two variants of the same heading. Pick one (`Does this sound like you?` reads slightly better) and apply to all 5. Minor, but it's the kind of drift a buyer comparing two service pages in adjacent tabs will notice.

---

### NF3. JSON-LD `Service` schema is low-quality — an OG map already exists to fix it 🟠

**Confirmed in:** `app/services/[id]/page.tsx` L120-144.

- `name` = `(service.data as any).hero?.badge` → for UX/UI Design the schema `name` is literally `"SAAS & AI PRODUCT UX/UI & FRONT END DEVELOPMENT"`. All-caps, sentence-shaped, not a service name. AI engines and rich-result parsers read this field first.
- `areaServed` = `["United States", "United Kingdom", "Singapore", "India", "Australia"]` — this contradicts the `AboutPage`/`Organization` schema on `/about`, which lists `United States, India, France, Canada, United Kingdom, Singapore` (see `04-about-page.md` NF-set). The site asserts two different "countries served" lists in structured data. `app/layout.tsx` L172 agrees with the service-page list (USA/UK/SG/IN/AU), so **`/about` is the outlier** — flag cross-audit.
- No `offers`, no `serviceType`, no `provider.description`.

**Fix:** the clean per-service names already exist in `app/services/[id]/opengraph-image.tsx` → `SERVICE_OG[slug].badge` (`UX/UI Design`, `SaaS & AI Development`, etc.). Build a shared `SERVICE_NAME` map (or reuse `SERVICE_OG`) and set the JSON-LD `name` from it, with `serviceType` = the same string and `description` from `SERVICE_META[slug].description`. Reconcile `areaServed` to one canonical list across `page.tsx`, `layout.tsx`, and `/about`.

---

### NF4. Unknown service slug returns HTTP 200 (soft 404) 🟠

**Confirmed in:** `app/services/[id]/page.tsx` L108-115.

```tsx
if (!service) {
  return (
    <div className="text-center py-24 text-gray-500">
      <h1 className="text-3xl font-semibold">Service not found</h1>
      ...
```

This renders a "not found" *page* but the response status stays `200 OK`. Google treats a 200 with thin "not found" content as a **soft 404** — it can index the URL, then flag it in Search Console. Any of the still-broken links (`/services/SaaS-Web-&-Mobile-Apps`, `/services/Design-System-&-Component-Library`) currently resolve to this soft-404 rather than a real 404.

**Fix:** `import { notFound } from "next/navigation";` and `if (!service) notFound();` — Next renders the nearest `not-found.tsx` with a real 404 status. Separately, replace `serviceDetails/index.tsx` L16 `<div>danis...</div>` with `notFound()` or a proper empty state (it's a developer placeholder shipping to production).

---

### NF5. `data/servicesTopList.json` carries the same `model landing pages` typo — and it's the file with the timeline chips X8 wants surfaced 🟡

**Confirmed in:** `data/servicesTopList.json` — entry 2 `description`: *"We design model landing pages & websites for small businesses to large corporations  that communicate your value, look stunning on every device…"* (same typo + double space as the detail-page copy).

This file also holds the `chip` arrays with `1-2 months`, timeline/deliverable tags per service — the exact "scope signal near the hero" that X8 recommends adding to the detail pages. If X8 is actioned by piping these chips through, the typo needs fixing at the same time. If this file is now dead (only used by `screens/landing/miniService`?), confirm and consider deleting it so there aren't two sources of service copy drifting apart.

---

## E-E-A-T Assessment (v3 — SEO Content Skill Applied)

Scored across the 4 in-scope service pages as a set.

### Google's "Who / How / Why" Test

| Question | Current state | Assessment |
|---|---|---|
| **Who** delivers this service? | JSON-LD `provider` = `UI Pirate by Vishal Anand`; no named practitioner, no "our team has shipped X" on the page body. | ⚠️ Entity only, no human signal |
| **How** is it done? | `StreamlinedProcess` gives a real 2-phase workflow per service (strong on SaaS & AI Dev, UX/UI, Landing Pages; **wrong content on UX Audits** — website-build steps under a "Design System Roadmap" heading). | ⚠️ Good where the content is correct; actively misleading on UX Audits |
| **Why** trust the outcome? | `WhyThisMatters` cards reframe real failure modes with quotable one-liners — genuinely strong on SaaS & AI Dev and UX/UI. Undercut by the generic portfolio (no metric), the `Fortune 500` unverifiable fallback, and the `Why Most 3D On Websites Fails` heading on the audit page. | ⚠️ Mixed |

### E-E-A-T Breakdown

| Factor | Score | Key Signals Present | Key Gaps |
|---|---|---|---|
| **Experience** | 9/20 | Detailed process phases; specific deliverables in `whatYouGet` (audit report, walkthrough video, prompt pipelines, CI/CD) | No service-specific case study, no result metric, no testimonial tied to a service; same `LandingWork` gallery on every page (X7) |
| **Expertise** | 15/25 | `WhyThisMatters` cards on SaaS/Dev/UX-audit are sharp and category-aware; `StreamlinedProcess` correctly sequenced on 3 of 4 pages; framework names used correctly | UX Audits carries deleted-service headings (3D, Design System Roadmap); SaaS & AI Dev cards render mislabeled icons (X4); one service has 4 names (X5) |
| **Authoritativeness** | 10/25 | JSON-LD `Service` type present on every page; per-service OG images; `provider` linked to org | `Service.name` = all-caps badge string; `areaServed` contradicts `/about` schema; `Fortune 500` fallback claim; no external validation (Clutch/case links) from any service page; no `/services` hub to concentrate authority |
| **Trustworthiness** | 14/30 | HTTPS; consistent page skeleton; per-service metadata + canonical | Soft-404 on bad slugs (NF4); `<div>danis...</div>` in prod; broken links in the SEO footer (X1/NF1); `RecommendedNextSteps` + hero secondary CTA are undisclosed WhatsApp links (NF1); visible copy-paste headings on the UX Audits page; `keywords`-stuffed meta |

**Total E-E-A-T Score: 48/100**

The lowest of the four page-sets audited (landing 55-ish, pricing 60, about 63). The `WhyThisMatters` writing is the asset; the drags are structural — wrong-service content still live, no proof layer, no hub, and a cross-sell section that WhatsApps the visitor instead of linking.

---

## SEO Metadata — v3 Assessment

### Per-service titles (`app/services/[id]/page.tsx` L28-67)

| Slug | Current title | Assessment |
|---|---|---|
| `ux-ui-design` | `SaaS & Mobile App UX/UI Design \| Idea to Product \| Angular, React` | ⚠️ 3 value props, ~64 chars — truncates. Move `Angular, React` to the description. Also the title says "Design" while the badge/schema say "Front End Development" (X5). |
| `saas-ai-development` | `SaaS & AI Development \| Full-Stack Engineering \| Angular, React, Node.js` | ⚠️ ~70 chars — trim the framework list. |
| `landing-pages-business-websites` | `Landing Page & Website Design & Development \| Angular, React & Webflow` | ✅ Acceptable. |
| `ux-audits-consultation` | `UX Audit & Consultation \| Improve Your Product's Usability` | ✅ Good — keep. |
| `design-system-component-library` | `Design Systems & Component Libraries \| Scalable UI Kits` | ⚠️ Remove entirely if the service is killed (NF6). |
| fallback | `…Enterprise-grade design trusted by Fortune 500 companies.` | ❌ Unverifiable claim shipping as a default `description`. Replace with a neutral line or drop the fallback. |

### `keywords` meta

Present and long on all 5 entries. Google has ignored the `keywords` meta for over a decade; some AI crawlers read it, but stuffed lists (`"SaaS product design, idea to product, product thinking, UX/UI design, mobile app design, competitive analysis, information architecture, complex enterprise application, MVP to product, startup product agency USA"`) read as spam. **Recommendation:** trim each to 4-6 phrases or remove.

### OpenGraph

`page.tsx` `generateMetadata` sets OG `title`/`description` from `SERVICE_META` and `siteName: "UI Pirate by Vishal Anand"`. The dedicated `opengraph-image.tsx` provides a clean per-service card. ✅ This layer is fine — no change beyond removing the Design System entry if killed.

### JSON-LD

See NF3. `name` and `areaServed` both need fixing; add `serviceType`, `provider.description`, and (if pricing allows) an `offers` stub.

### Canonical

`page.tsx` L94-96 builds `canonical` from `encodeURIComponent(urlSlug)` — the raw URL slug, not the normalized one. So `/services/UX-UI-Design`, `/services/ux-ui-design`, and `/services/ux%2Dui%2Ddesign` each self-canonicalize to a different string. **Recommendation:** canonicalize to one normalized form per service (`https://uipirate.com/services/${normalizedSlug}`) so duplicate-casing URLs collapse.

---

## Keyword Gap Analysis (v3 — New Finding)

| Target phrase | Covered? | Gap |
|---|---|---|
| `product design and development services` | ❌ | No `/services` hub page to hold the head term (X2). Only long-tail per-service pages exist. |
| `SaaS design and development agency` | Partially — in `ux-ui-design` + `saas-ai-development` bodies | ⚠️ Not in a single page's H1/title |
| `hire full-stack developer for SaaS` | Partially — `saas-ai-development` title says "Full-Stack Engineering" | ✅ Reasonable |
| `UX audit service` | ✅ — `ux-audits-consultation` title + keywords | ✅ Good |
| `React landing page development` | ✅ — `landing-pages-business-websites` title | ✅ Good |
| `AI integration agency` / `LLM integration service` | ✅ — `saas-ai-development` keywords + card | ✅ Good |
| `design system agency` | Only on the half-killed page | ⚠️ If Design System is killed, fold `design tokens / component library` into the `ux-ui-design` page body so the phrase survives |
| `how to choose a product design agency` | ❌ | A `/services` hub with a "which service do I need?" section is the natural home |

**Key finding:** the missing `/services` hub costs the site the one page that could rank for the category head term and answer comparison-intent queries. Every current entry point is a deep link into a single service.

---

## AI Citation Readiness Assessment (v3 — New Finding)

| Signal | State | Score |
|---|---|---|
| Quotable problem/solution statements | `WhyThisMatters` cards — strong on SaaS/Dev/UX-audit ("They didn't get stuck — they got confused. Confusion creates silent churn") | ✅ Strong |
| Clean structured-data service name | `Service.name` = all-caps hero badge | ❌ Weak |
| Consistent entity facts across pages | `areaServed` differs between service schema and `/about` schema | ❌ Weak |
| Deliverables stated concretely | `whatYouGet` cards are specific | ✅ Good |
| Price / timeline data | Absent on 3 of 4 pages (X8) | ❌ Gap |
| Correct-topic headings | UX Audits page headed `Why Most 3D On Websites Fails` and `Design System Roadmap` | ❌ Weak |
| Hub / overview page for the category | None (X2) | ❌ Gap |
| Working internal links between related services | `RecommendedNextSteps` links to WhatsApp, not to services (NF1) | ❌ Weak |

**AI Citation Readiness Score: 44/100**

The card-level writing is citable; almost everything structural around it (schema name, cross-links, hub page, on-topic headings, price/timeline facts) is not.

---

## New Copy Recommendations (v3 — SEO Content Skill Applied)

### NC1. UX Audits page — replace the three wrong-service strings 🔴

**Confirmed in:** `data/sericesDetailsList.json`, `UX-Audits-&-Consultation` entry.

| Field | Current | Recommended |
|---|---|---|
| `whyThisMatters.heading` + `heading2` | `Why Most 3D On Websites Fails ` / `(And How We Do It Right)` | `Why Products Stall After Launch` / `(And How an Audit Fixes It)` |
| `streamlinedProcess.heading` | `Design System Roadmap` | `How a UX Audit Works` |
| `streamlinedProcess.workflow[0].badge` / `[1].badge` | `Design Workflow` / `Design Workflow` | `Audit` / `Readout & Roadmap` |
| `streamlinedProcess` steps | website-build steps (`CMS setup`, `Full Stack Development`, `QA & SEO Optimization`, `connect domains`) | `Scope & Access` → `Heuristic Evaluation` → `User Journey & Flow Analysis` → `Friction & Drop-Off Mapping` → `Prioritized Findings` → `Recommendations Roadmap + Walkthrough Call` |
| `whatYouGet.heading` | `What All Will you get in return` | `What You Get` |

The `whyThisMatters` **cards** on this page (Unclear First Steps · Too Many Decisions · Features Without Priority · Demo vs. Daily Use Gap · Silent Churn) are on-topic and strong — keep them verbatim; only the heading above them is wrong.

---

### NC2. UX Audits `whoThisIsFor` — 2 lowercase cards → 3 Title Case cards 🟠

**Confirmed in:** `data/sericesDetailsList.json`, `UX-Audits-&-Consultation` → `whoThisIsFor.card` (2 entries).

**Current headings:** `Founders or startups who are just starting out` · `anyone looking to upgrade their product experience & conversions`

**Recommended (3, parallel to every other service page):**

| Heading | Description |
|---|---|
| `Early-Stage Founders` | Just starting out and want to get the core flows right before spending on a full build. |
| `Teams With Stalled Growth` | Activation or retention has flattened and it's not clear which part of the experience is the cause. |
| `Pre-Redesign Product Leads` | About to invest in a redesign and want an evidence base for what to change and why. |

---

### NC4. Fix the SEO-footer broken links 🔴

**Confirmed in:** `app/layout.tsx` L416-419.

| Current | Recommended |
|---|---|
| `<a href="/services/SaaS-Web-&amp;-Mobile-Apps">SaaS Web &amp; Mobile App Design &amp; Development</a>` | `<a href="/services/UX-UI-Design">UX/UI Design</a>` **and** `<a href="/services/SaaS-&-AI-Development">SaaS &amp; AI Development</a>` (the offering split into two real services) |
| `<a href="/services/Design-System-&amp;-Component-Library">Design Systems &amp; Component Libraries</a>` | Remove (align with navbar/footer/sitemap) unless the page is rebuilt |

Then all four SEO-footer service links resolve and match the canonical slugs used everywhere else.

---

### NC5. `RecommendedNextSteps` — make it link to services, not WhatsApp 🔴

**Confirmed in:** `screens/serviceDetails/recommendedNextSteps/index.tsx` L67-72, L84-90.

1. Featured CTA: `<LetsTalkButton href={`/services/${data.featuredService.slug}`} children={data.featuredService.buttonText} showArrow ... />`
2. Other-services list: wrap each as a link — `<LetsTalkButton key={service.slug} href={`/services/${service.slug}`} children={service.title} fullWidth variant="light" />`
3. Correct the 4 stale slugs in `data/sericesDetailsList.json`:

| Service | Field | Current slug | Correct slug |
|---|---|---|---|
| Landing Pages | `recommendedNextSteps.otherServices[0].slug` | `ux-ui-front-end-development` | `ux-ui-design` |
| UX Audits | `recommendedNextSteps.featuredService.slug` | `ux-ui-front-end-development` | `ux-ui-design` |
| UX Audits | `recommendedNextSteps.otherServices` — contains `ux-audits-consultation` (itself) | self-reference | replace with `saas-ai-development` |
| Design System | `recommendedNextSteps.otherServices[0].slug` | `ux-ui-front-end-development` | `ux-ui-design` |

Also update the stale display title on UX Audits' featured entry (`SaaS & AI Product UX/UI & Front End Development` → `UX/UI Design`) and Landing Pages' (`UX/UI & Front End Development` → `UX/UI Design`).

---

### NC6. Hero CTAs — cal.com primary, drop WhatsApp 🟠

**Confirmed in:** `screens/serviceDetails/hero/index.tsx` L105 (`href="/contact"`), L213 (label), L220 (`href="https://wa.link/i35lma"`), L245 (`Lets Talk via Whatsapp`).

| Element | Current | Recommended |
|---|---|---|
| Primary CTA link (L105) | `/contact` | `https://cal.com/ui-pirate/15min` (open in new tab) |
| Primary CTA label (L213) | `Start Your Product Journey — Book a 15-Min Call` | `Book a Free 15-Min Call` (tighten) |
| Secondary CTA (L218-249) | `Lets Talk via Whatsapp` → `wa.link` | `See Pricing` → `/pricing`, or `View Our Work` → the works section — anything but WhatsApp, consistent with the other three audits |
| Badge fallback (L76) | `EMPOWERING 40+ Business ACROSS 6 COUNTRIES` | `50+ Products Shipped Across 6 Countries` (matches landing/about) — or remove the fallback since every entry sets `data.badge` |

Since these are hardcoded, the CTAs cannot be tailored per service — acceptable for now, but note it if per-service CTA copy is ever wanted (would need a `hero.cta` field in the JSON).

---

### NC7. Standardize the service name — pick "UX/UI Design" everywhere 🟠

**Confirmed drift:** badge `SAAS & AI PRODUCT UX/UI & FRONT END DEVELOPMENT` (`sericesDetailsList.json`), title `SaaS & Mobile App UX/UI Design | …` (`page.tsx` L30), nav/footer `UX/UI Design`, OG badge `UX/UI Design`.

Pick **`UX/UI Design`** as the canonical name (or `Product Design`, if the intent is to signal more than UI). Apply to: `hero.badge` (→ `SAAS & AI PRODUCT DESIGN`), SERVICE_META title (`UX/UI Design for SaaS & Mobile Apps | UI Pirate`), JSON-LD `name`/`serviceType`, and add one explicit boundary line to the `whatYouGet` or `streamlinedProcess` copy stating where design ends and `SaaS & AI Development` begins (front-end build vs. back-end/infra).

---

### NC8. Build the `/services` hub page 🟠

**Confirmed absent.** Recommended copy skeleton (content only — layout is a separate decision):

- **H1:** `Product Design & Development Services`
- **Intro (1-2 sentences):** `Four services, one path: design the product, build it, launch it, and pressure-test it. Most engagements use two or three.`
- **One row per service:** name · one-line outcome · typical timeline (from `servicesTopList.json` chips) · `Best when…` line · link to the detail page
- **"Which do I need?" block:** 3-4 if/then lines (`If you have an idea and no screens → UX/UI Design`; `If you have designs and no engineers → SaaS & AI Development`; `If traffic isn't converting → Landing Pages`; `If growth stalled after launch → UX Audits`)
- **CTA:** `Book a Free 15-Min Call` → cal.com

This gives the site a page for the head term and a genuine comparison surface, and fixes the navbar parent 404 (X2).

---

## Updated Priority Table (v3)

All v1/v2 items carried forward. New v3 items marked `[v3]`. "Verified" = code-checked on 2026-08-31.

| # | Scope | Issue | File + line | Priority | Verified |
|---|---|---|---|---|---|
| 1 | UX Audits | `whyThisMatters` heading `Why Most 3D On Websites Fails`; `streamlinedProcess` heading `Design System Roadmap` + website-build steps; `whatYouGet` heading `What All Will you get in return` — rewrite per NC1 | `data/sericesDetailsList.json` (UX-Audits entry) | 🔴 Fix now | ✓ |
| 2 | RecommendedNextSteps | Section links to WhatsApp, not to services; `slug` never used; 4 stale slugs in JSON — rewire + fix slugs per NC5 | `screens/serviceDetails/recommendedNextSteps/index.tsx` L67-90; JSON | 🔴 Fix now `[v3]` | ✓ |
| 3 | SEO footer | `/services/SaaS-Web-&-Mobile-Apps` broken; Design System link still live — fix per NC4 | `app/layout.tsx` L416, L418 | 🔴 Fix now | ✓ |
| 4 | Routing | Unknown slug returns 200 (soft 404); `<div>danis...</div>` still in prod — call `notFound()` per NF4 | `app/services/[id]/page.tsx` L108-115; `screens/serviceDetails/index.tsx` L16 | 🔴 Fix now `[v3]` | ✓ |
| 5 | Nav | `/services` parent link 404s — build the hub page per NC8 | `config/site.ts` L9, L112 | 🔴 Fix now | ✓ |
| 7 | UX Audits | `whoThisIsFor` = 2 lowercase cards → 3 Title Case per NC2 | `data/sericesDetailsList.json` (UX-Audits entry) | 🟠 Soon | ✓ |
| 8 | All | Hero secondary CTA = WhatsApp; primary → `/contact` not cal.com; badge fallback string — fix per NC6 | `screens/serviceDetails/hero/index.tsx` L76, L105, L213, L220, L245 | 🟠 Soon | ✓ |
| 9 | SaaS & AI Dev | 4 `whatYouGet` headings unmapped → mislabeled icons; add to map or add `visualKey` | `screens/serviceDetails/whatYouGetAnimations/index.tsx` L10-23 | 🟠 Soon | ✓ |
| 10 | UX/UI vs SaaS | One service, four names — standardize on `UX/UI Design` + add boundary line per NC7 | `sericesDetailsList.json`; `app/services/[id]/page.tsx` L30 | 🟠 Soon | ✓ |
| 11 | Landing Pages | `hero.description` `model landing pages` typo + `corporations  that` double space; `whyThisMatters` still 6 cards (3 overlap) → 4 | `data/sericesDetailsList.json` (Landing-Pages entry) | 🟠 Soon | ✓ |
| 12 | All | JSON-LD `Service.name` = all-caps badge; `areaServed` contradicts `/about` schema — fix per NF3 | `app/services/[id]/page.tsx` L125-126, L133-139 | 🟠 Soon `[v3]` | ✓ |
| 13 | All | `youWillGet` block in all 5 entries, never rendered — wire in or delete | `data/sericesDetailsList.json`; `screens/serviceDetails/index.tsx` | 🟠 Soon | ✓ |
| 14 | All | Canonical built from raw URL slug — casing variants self-canonicalize differently; normalize | `app/services/[id]/page.tsx` L94-96 | 🟠 Soon `[v3]` | ✓ |
| 15 | All | Generic `LandingWork` gallery — no service-specific project / metric / testimonial | `screens/serviceDetails/index.tsx` L40 | 🟡 Consider | ✓ |
| 16 | All | No timeline / price / engagement-model signal (except Design System badge); `servicesTopList.json` chips unused | `data/servicesTopList.json`; service pages | 🟡 Consider | ✓ |
| 17 | All | `whoThisIsFor.heading` inconsistent — `Does it` vs `Does this` — standardize per NF2 | `data/sericesDetailsList.json` (all 5) | 🟡 Consider `[v3]` | ✓ |
| 18 | SEO | `ux-ui-design` + `saas-ai-development` titles over-long (framework lists); move to description | `app/services/[id]/page.tsx` L28-43 | 🟡 Consider | ✓ |
| 19 | SEO | `keywords` meta stuffed on all 5 — trim to 4-6 or remove | `app/services/[id]/page.tsx` L33-66 | 🟡 Consider | ✓ |
| 20 | SEO | Fallback `description` asserts `trusted by Fortune 500 companies` — replace/remove | `app/services/[id]/page.tsx` L78 | 🟡 Consider | ✓ |
| 22 | Data | `servicesTopList.json` duplicates the `model landing pages` typo; confirm whether the file is still used | `data/servicesTopList.json` | 🟡 Consider `[v3]` | ✓ |
| 23 | All | `whatYouGet` heading→animation string coupling undocumented — add `visualKey` or document the 12 protected strings | `screens/serviceDetails/whatYouGetAnimations/index.tsx` | 🟡 Consider | ✓ |
| 24 | Landing Pages | `whoThisIsFor` spans SaaS → café → personal portfolio — narrow to commercial audiences | `data/sericesDetailsList.json` (Landing-Pages entry) | 🟡 Consider | ✓ |
| 25 | Data file | Filename misspelled `sericesDetailsList.json` | `data/sericesDetailsList.json` | 🟡 Consider | ✓ |

**Priority key:** 🔴 Fix now — wrong-service content live, broken links, soft-404s, dev placeholders, WhatsApp-only cross-sell · 🟠 Soon — copy quality, naming, schema, and positioning with conversion impact · 🟡 Consider — polish, SEO hygiene, consistency.

---

## E-E-A-T Quick Wins (v3 Summary)

The three highest-return changes across the service pages:

1. **Fix the UX Audits page content (NC1).** It's the most visible trust failure on the site: an audit service whose "why this matters" heading reads *"Why Most 3D On Websites Fails"* and whose "process" is a website-build checklist titled *"Design System Roadmap."* Five string edits in one JSON entry. The cards underneath are already good.

2. **Rewire `RecommendedNextSteps` to link to services (NC5).** Right now the one section built to guide the buyer between services sends them to WhatsApp instead. Add `href={`/services/${slug}`}` in two places, correct four stale slugs, and the site gains a working internal-linking layer between its money pages.

3. **Fix the broken links + soft-404 (NC4, NF4).** `app/layout.tsx` SEO footer still points at a dead slug and the killed Design System page; unknown slugs return HTTP 200. `notFound()` plus two `<a href>` edits closes both, and stops Google indexing soft-404 URLs.

---

## Services Pages — What's Actually Working Well (v3 Recognitions)

- ✅ **`WhyThisMatters` writing** on SaaS & AI Development and UX/UI Design — "AI That Doesn't Ship — integrating a model into a real product is a different problem than a prototype" is a genuine differentiator. Keep verbatim.
- ✅ **SaaS & AI Development page overall** — badge, headline ("Build the engine behind your SaaS or AI product"), description ("We build what the interface runs on"), and process block all need essentially no copy work.
- ✅ **Per-service OG images** (`opengraph-image.tsx`) — new since v2, clean names and descriptions. This map is the fix source for the JSON-LD `name` problem.
- ✅ **The shared page skeleton** — hero → what you get → why it matters → process → proof → who it's for → next step → CTA is a sound service-page structure.
- ✅ **Navbar / visual footer / sitemap slugs** — now resolve correctly and match each other (the SEO footer in `layout.tsx` is the one straggler).
- ✅ **`whatYouGet` deliverables** on UX Audits (heuristic report, drop-off insights, flow review, walkthrough video) — concrete and buyer-legible; only the section heading is broken.

---

## Copy Tone Reference — v3 Additions (Services-Specific)

*The v2 Copy Tone Reference above still applies. These additions target patterns confirmed in the v3 source read.*

| ✅ Do | ❌ Avoid | Example from current code |
|---|---|---|
| Ship headings that match the page's topic | Leftover headings from deleted services | `Why Most 3D On Websites Fails` on the UX Audits page |
| Cross-sell links that navigate to the service | Contact buttons disguised as navigation | `RecommendedNextSteps` items → `wa.link` |
| One canonical service name, used in badge + title + schema + nav | Four names for one service | `UX/UI Design` / `…& FRONT END DEVELOPMENT` / `SaaS & Mobile App UX/UI Design` / `SaaS-Web-&-Mobile-Apps` |
| Real 404 for unknown routes | 200 OK with "not found" text | `page.tsx` returns a `<div>` instead of `notFound()` |
| Clean service name in structured data | Raw all-caps badge string as `Service.name` | `"SAAS & AI PRODUCT UX/UI & FRONT END DEVELOPMENT"` |
| One "countries served" list across the whole site | Different `areaServed` per schema | service pages (US/UK/SG/IN/AU) vs `/about` (US/IN/FR/CA/UK/SG) |
| Book-a-call CTAs via cal.com | WhatsApp as a service-page CTA | hero secondary CTA + every `LetsTalkButton` default |

*Extended word removal list (v3 services additions):* `model landing pages` (→ modern), `Lets Talk via Whatsapp`, `What All Will you get in return`, `trusted by Fortune 500 companies` (unverifiable fallback), `EMPOWERING 40+ Business`.

---

*This file is the living audit for the services pages. v1/v2 (2026-08-27) → v3 (2026-08-31). Verify against current source before implementing — the code is the ground truth. The data file remains misspelled `sericesDetailsList.json`; all path references above use the real filename.*

---
---

# v4 — Market Demand Findings (Upwork Job Scan) → Services Pages Implications
**Audited:** 2026-09-09
**Method:** Live scan of ~50 Upwork job postings across four searches (`SaaS UI UX product design`, `landing page design`, `UX audit`, `Next.js developer` / `product designer`), read for recurring buyer language, tooling, budget shape, and engagement pattern. This maps live buyer demand onto the 4 in-scope service pages to prioritize which fixes actually drive traffic and leads, on top of the correctness fixes already documented in v1–v3.

## Demand by service, ranked

| Rank | Service page | Signal from the job scan | Read |
|---|---|---|---|
| 1 | **UX Audits & Consultation** | Largest single recurring job category across the whole sample. Titles like "UX Audit and Research," "UX/UI Audit & MVP Improvements," "Senior Product UX Designer Needed for End-to-End UX Audit," "Website Audit Specialist" — at least 8 of ~50 postings were audits, more than any other single job type. Budgets are small ($80–$300 fixed, or modest hourly) and timelines short (`Less than 1 month`), meaning **fast-turnaround, low-commitment first engagements** are a real, high-volume lane. | This is simultaneously the page with the most real demand and, per v1–v3, the page in the worst content state (wrong headings from a deleted 3D service, website-build steps under a "Design System Roadmap" heading, broken `recommendedNextSteps`). **This is the highest-leverage fix on the entire services surface** — real buyers are actively searching this exact service today, landing on a page that visibly describes the wrong offering. |
| 2 | **UX/UI Design** (SaaS-focused) | Second-largest category — "UI/UX Designer Needed to Redesign SaaS Dashboard," "Senior UI/UX Designer for SaaS Redesign," "SaaS UI/UX Consultation," "Mobile UI/UX SAAS." Most of these are **redesigns of an existing product**, not greenfield builds — the buyer already has something live and wants it improved. Competition is fierce (50–140+ proposals on generic "UI/UX Designer" titles). | Confirms this should stay the flagship page, but the existing X5 finding (unclear boundary with SaaS & AI Development, 4 different names for one service) matters more than it looks — in a lane this crowded, an inconsistent name/positioning is a real cost, not just a hygiene issue. Also: since most buyers already have a live product, "redesign an existing SaaS dashboard" language would match search intent better than "idea to MVP" framing alone. |
| 3 | **SaaS & AI Development** | Strong, specific demand — "Full-Stack Developer – Next.js/TypeScript/Python/PostgreSQL \| AI SaaS," "Full-Stack AI Developer for Multi-Tenant Compliance SaaS Portal," "Senior FullStack Developer \| React, Next.js, TypeScript, Supabase \| AI-Powered." Roughly 1 in 4 dev postings name AI/LLM integration explicitly. Budgets here run highest ($10k+ fixed, $30–40+/hr, 6+ month engagements). | This is confirmed as the page's highest-value lane per engagement, even though it's not the highest-volume search term. Per v1–v3 this page's copy ("Build the engine behind your SaaS or AI product") is already the strongest on the site — no copy change needed, but the AI/LLM specificity buyers are using (prompt pipelines, LLM integration, multi-tenant) is good language to keep verbatim if it's already in the `whatYouGet` cards. |
| 4 | **Landing Pages & Business Websites** | High volume but the *tool* named matters: **Framer** and **Webflow** show up repeatedly as the buyer's stated preference ("Framer Landing Page Designer/Developer – SaaS Validation Page," "Webflow Designer/Developer," "Senior Landing Page Designer — Custom Figma / Direct Response / Premium UI"). Buyers also use "conversion-focused," "CRO," and "lead generation" as their own words, not agency marketing-speak. | Validates the page's existing "AI-Readable Websites… optimized for search engines and AI discovery systems" differentiator (praised in v1–v3) and the emphasis on conversion. New finding: Framer is named by buyers often enough that it's worth confirming it's visible on this page's tech/tooling mentions, not just in the About page's tech stack. |

## New cross-cutting findings (v4)

### D1. The single highest-leverage fix on the services surface is finishing the UX Audits page content fix 🔴🔴

v1–v3 already flagged the UX Audits page's wrong-service content (3D heading, Design System Roadmap process, "What All Will you get in return") as a 🔴 "Fix now." The job scan adds the missing piece: **this isn't just a broken page, it's a broken page in the highest-demand lane in the sample.** Every other 🔴 item on the priority table competes for attention against this one on both correctness *and* revenue grounds — fixing this page should be sequenced first among the open 🔴 items in the v1–v3 Priority Fix Table.

### D2. No dedicated "quick audit" low-commitment offer exists anywhere in the funnel 🟠

Across the sample, a recurring buyer pattern is: small fixed budget, fast timeline, explicit framing as "before we build more" or "before our pilot." This is a distinct buyer journey from the "idea to shipped product" full-engagement framing used everywhere else on the site (H1, CTA sections, process). The UX Audits page is the natural landing spot for this buyer, but nothing about its current price/timeline signal (X8, still unresolved per v3) speaks to "this can be small and fast." Adding a concrete scope signal here (e.g. "Starts at $X, 1–2 week turnaround" — the actual smallest audit tier) would match what this specific buyer segment is scanning for, and gives the `/services` hub page (X2, still missing) a natural low-friction entry card once it exists.

### D3. "Redesign an existing product" is the dominant SaaS UI/UX search pattern, not "design a new one" 🟡

Most SaaS-related UI/UX postings in the sample describe an existing, live product that needs improvement ("the current interface is functional but feels outdated," "we already have the product developed," "improve the visual quality of several websites"). The UX/UI Design page's current framing leans toward the MVP/idea-to-product journey (`whatYouGet` card "Idea to MVP"). Consider adding one card or one line that explicitly names "redesigning an existing SaaS product" as a use case — it's currently implied by the WhyThisMatters cards but never stated as a deliverable the way "Idea to MVP" is.

### D4. Framer and Webflow are named buyer search terms for Landing Pages — confirm they're visible, not just implied 🟡

The About page's Technology Stack already lists Framer (confirmed good in v4 About findings). On the Landing Pages service page specifically, verify Framer/Webflow (or the equivalent tools actually used) appear in visible body copy or the `whatYouGet` cards, since buyers in this lane are naming their preferred build tool directly in job titles, not just "a website."

## What this does *not* change

- All 🔴/🟠 correctness findings from v1–v3 (broken links, `<div>danis...</div>`, WhatsApp-only `RecommendedNextSteps`, soft 404s) remain valid and unaffected by market data — those are bugs regardless of demand.
- No new service category is warranted. Mobile app UI/UX appeared frequently in the sample as its own job type, but the site's current 4-service scope (UX/UI Design, SaaS & AI Development, Landing Pages, UX Audits) already covers it under UX/UI Design's "Mobile Optimization" card — a 5th dedicated page is not justified by this sample.

*Cross-reference: `04-about-page.md` v4 covers the About-page-specific implication of this same job scan (the AI-mention gap and the missing low-commitment-buyer signal).*

---
---

# v5 — Angular Scope-Fit + "AI-Generated Code to Production" Findings (Upwork Job Scan)
**Audited:** 2026-09-09
**Method:** Follow-up scan of ~30 additional Upwork postings targeting two specific questions: (1) what does Angular demand actually look like, distinct from the React/Next.js demand already covered in v4, and (2) is there real, paid demand for taking AI-generated ("vibe coded") app code to production. Both were investigated because the site currently lists Angular as a core stack alongside React/Next.js without distinguishing the buyer, and has no language anywhere addressing AI-code cleanup despite it being core to "idea to shipped product" positioning.

## Finding 1: Angular demand is a different buyer than the site's current stack story implies — RESOLVED, scope confirmed by user 🟠→✅

**User decision (2026-09-09):** the agency does not want to chase heavy backend stacks like .NET/C#. **Azure is fine** as a cloud/deploy target. The confirmed real backend stack is **AWS, GCP, Azure, Python, Node.js, and AI agents**. This resolves the open question below — the recommendation is now: stay out of the .NET/C# lane entirely, and make the true backend stack (AWS/GCP/Azure/Python/Node.js/AI agents) visible on the site, since it currently isn't shown anywhere despite being real capability that matches live search demand (see Finding 2 and the v4 findings — AWS, Python, Node.js, and "AI agent" skills recurred often across both scans).

Across the Angular-specific sample, the pattern is consistent and different from the React/Next.js sample in v4:

| What buyers actually ask for | Example titles |
|---|---|
| Angular paired with **.NET / C# / ASP.NET Core / Azure / SQL Server** — an enterprise .NET shop, not a startup SaaS stack | "Senior .NET Angular & Azure Developer," "Full-Stack .NET / Angular / Azure Developer – Security Remediation," "Full-Stack .NET Developer — Angular + ASP.NET Core," "Senior Full-Stack Developer / Technical Contractor — C#, Angular, Azure, Elasticsearch" |
| Angular paired with **Go** backends | "Go, AWS, PostgreSQL, Angular Developer," "Go & Angular Developer" |
| Only one posting in the sample paired Angular with a Node/Postgres stack close to what the site's own tech stack implies | "Senior Full-Stack Developer (Angular 20+, Node.js, PostgreSQL) – Government Job Portal" |

**Why this matters:** the About page's Technology Stack section (`Angular, React, Next.js, TypeScript, Tailwind CSS, Framer, Figma, GSAP`) and the UX/UI Design service page both list Angular alongside React/Next.js as if they serve the same buyer. The live market says otherwise — the Angular buyer is overwhelmingly an **enterprise .NET/C#/Azure shop**, a different technical world from the React/Next.js/Supabase/Firebase startup buyer covered in v4.

**Resolved:** the agency has confirmed it does not want the .NET/C# lane — that segment is explicitly out of scope. Azure stays in scope as a cloud/deploy target. **Action:** don't add .NET/C#/ASP.NET language anywhere on the site. Angular stays in the visible stack list as-is (true, low-cost to list, no change needed). The real fix this finding points to is additive, not corrective: the actual backend stack (AWS, GCP, Azure, Python, Node.js, AI agents) isn't shown anywhere on the site yet, and should be — see the updated recommendation below and `04-about-page.md` v5 AD1 for the specific Technology Stack addition.

---

## Finding 2: "AI-generated code → production-ready" is a real, recurring, currently invisible service gap 🔴

This is the more actionable finding. Across both the general dev sample (v4) and this follow-up scan, a distinct and recurring buyer category showed up — someone who built something with an AI coding tool (Lovable, Bolt, Replit, v0, Cursor, Claude Code, "vibe coding" generally) and now needs a professional to secure, scale, refactor, or finish it for real users:

| Job title | Budget / engagement | What they're actually asking for |
|---|---|---|
| "Lovable App Finalization and Automation" | $15–25/hr, <1 month | Finish app setup, "improve user experience," add automation — i.e. take a Lovable-generated app the rest of the way |
| "Secure and Enhance Vibe Coded App" | 1–3 months | "Help secure my vibe coded app and add more complex features… ensuring the app runs smoothly" |
| "Vibe Coding / Automation Specialist – AI Content Creation App" | 3–6 months, 127 proposals | Building on Lovable + Claude output long-term — this had the highest proposal count of any job in either scan, signaling strong freelancer awareness this category exists, but also strong buyer demand |
| "Vibe coder: Claude Code: e-Commerce Development" | 1–3 months | Client has Claude Code subscription and access, wants a team to "put these together" and finish the build |
| "Full-Stack .NET / Angular / Azure Developer – Security Remediation" | $200 fixed, <1 month | "Review, validate, and remediate security issues identified by **AI-assisted code analysis**" — a slightly different but related pattern: AI found the problems, a human is needed to actually fix them |
| "Developer / Technical Lead for AI-powered Accounting Platform" (Aurora OS) | 6+ months, 131 proposals | "We already have several automation tools and prototypes and are looking for a strong developer / technical lead who can review what we have" — explicitly a review-and-productionize engagement, not greenfield |
| "AI App Vibe Coder/Developer for Instagram videos" | 6+ months, FULL_TIME | Wants someone who has "previously made exactly what we're looking to create" using AI tooling — proof of prior AI-to-production work is the qualifying bar |

**Why this is a genuine gap, not just a market curiosity:** the site's entire positioning — "From Idea to Shipped Product," "Design Through to Code," "no hand-offs, no gaps" (per `04-about-page.md` NC1/NC2) — is *already* the exact pitch this buyer needs to hear. This buyer has an idea that got partway to working code (via an AI tool) and needs someone to carry it the rest of the way to shipped — which is precisely the gap the agency's own tagline describes. But the phrase never appears anywhere: not in `data/sericesDetailsList.json`, not in the About page differentiation cards, not in the SaaS & AI Development page's `whatYouGet` cards (Full-Stack Architecture, AI & LLM Integration, API & Third-Party Integrations, Cloud Deployment & Scaling — none of which name "cleaning up / hardening / productionizing AI-generated code" even though the process work is functionally close to it).

**Recommendation — services pages:**
- Add one `whatYouGet` card to **SaaS & AI Development** naming this directly, e.g. `AI-Generated Code, Production-Ready` — "Built something fast with Lovable, Bolt, Replit, or Claude Code? We take it from prototype to a secure, scalable, production-grade product." This is additive (a 5th card, or a swap for the weakest of the current 4) and costs nothing to test since the underlying skill (full-stack engineering) is already the service being sold.
- Consider whether this belongs as its own line in `WhyThisMatters` ("Fragile Foundations" already gestures at this — "Fragile Foundations — [problem] → [fix]" per v1's cross-reference — worth checking if its current copy already covers AI-tool output specifically, or only general technical debt).
- This also strengthens the **UX Audits & Consultation** page's case (already the top-priority fix per v4 D1): a "review what we already have" audit is exactly the entry point for a buyer who vibe-coded a prototype and needs a professional read on what's salvageable before further investment — the audit page could explicitly mention AI-tool-built prototypes as a thing it evaluates.

**Recommendation — About page:** add "AI-generated code" or "vibe-coded prototype" as a named starting point once, somewhere a scanning buyer would see it — the differentiation cards (Section 3a) or the hero subheadline are the two highest-visibility spots. This is a keyword and a real, quotable buyer situation that currently has zero surface area on the site despite being squarely inside the "idea to shipped product" promise.

---

## Priority additions to the existing tables

| # | Scope | Issue | Priority |
|---|---|---|---|
| A1 | SaaS & AI Development page | No `whatYouGet` card or copy names "AI-generated code to production" despite this being a live, recurring, well-matched buyer request | 🔴 Add — high-intent keyword + service gap, zero conflict with existing content |
| A2 | About / Tech Stack | Real backend stack (AWS, GCP, Azure, Python, Node.js, AI agents) isn't shown anywhere on the site — only front-end tools are listed | 🟠 Add — resolved scope, see AD1 in `04-about-page.md` v5 |
| A3 | UX Audits & Consultation page | Could explicitly mention auditing AI-tool-built (Lovable/Bolt/Replit/v0) prototypes as an audit input, reinforcing the page's existing "before you build more" framing | 🟡 Consider — pairs naturally with the D1/D2 findings in v4 |
| A4 | SaaS & AI Development page, `whatYouGet` cards | "Full-Stack Architecture," "AI & LLM Integration," "Cloud Deployment & Scaling" cards should name the actual providers (AWS, GCP, Azure, Node.js, Python) rather than staying generic — matches confirmed real stack and live search terms | 🟡 Consider |

*Cross-reference: this section extends `05-services-pages.md` v4 and has a matching About-page note appended to `04-about-page.md` v5.*

---
---

# v6 — Implementation Reconciliation + Final Copy (Services Pages)
**Audited:** 2026-09-09
**Method:** v4/v5 market-demand findings diffed against the **current** `data/sericesDetailsList.json` (BOM-encoded; 4 in-scope slugs: `UX-UI-Design`, `SaaS-&-AI-Development`, `Landing-Pages-&-Business-Websites`, `UX-Audits-&-Consultation`). Some v1–v3 correctness items are already fixed in the data; this section states only what is still open and gives verbatim copy to paste. It supersedes the open recommendations in v4 (D1–D4) and v5 (Finding 1, Finding 2, A1–A4) with a checked, final version.

## Decisions carried in from the user (2026-09-09)

- **`/services` hub page (X2 / NC8 / v4 D2's "entry card") — WON'T DO, intentional.** The site deliberately has no services hub; service pages are reached from the nav dropdown and cross-links only. Close X2 and NC8 as *won't-fix by design*. Any earlier text implying the hub is required is void.
- **No `.NET`/`C#`/`ASP.NET` language anywhere** (v5 Finding 1). Angular stays listed as-is. Azure is in scope only as a cloud/deploy target.
- Real backend stack to reference where providers are named: **Node.js, Python, AWS, GCP, Azure, AI agents / LLM APIs**.

## Already fixed in the data since v1–v3 (no action — recorded so they're not re-done)

| v1–v3 item | Current state in `data/sericesDetailsList.json` |
|---|---|
| UX Audits hero was wrong-service copy | ✅ Fixed — hero is now "Find What's Blocking Growth, / Before You Build More" with a correct description |
| UX Audits `whatYouGet` cards | ✅ Fixed — Heuristic UX Audit Report / Drop-Off & Friction Insights / Flow & Interaction Review / Walkthrough Video |
| Landing Pages — Framer/Webflow visibility (v4 D4) | ✅ Already visible — `youWillGet.rightBadges` includes "Webflow or Framer setup"; `streamlinedProcess` names CMS/frameworks. **No change needed.** |
| SaaS & AI Dev copy strength (v4 rank 3) | ✅ Hero + `whyThisMatters` already strong — only additive changes below |

## STILL OPEN — apply per page

---

### Page 1 — UX Audits & Consultation (`UX-Audits-&-Consultation`)  🔴 highest leverage (highest demand + still-broken content)

Three leftover wrong-service strings from the deleted 3D / Design-System service are still in this slug's `data`. Fix all three, plus one dedupe, plus two additive market items.

**1a. `whatYouGet.heading` — deliverable-first + ungrammatical 🟠**
- Current: `"What All Will you get in return"`
- Change to: `"What You Get From a UX Audit"`

**1b. `whyThisMatters.heading` — WRONG (references 3D) 🔴**
- Current: `"Why Most 3D On Websites Fails "`  / `heading2: "(And How We Do It Right)"`
- Change to: `"Why Growth Stalls After Launch"` / `heading2: "(And What an Audit Uncovers)"`
- The 5 cards underneath (`Unclear First Steps`, `Too Many Decisions`, `Features Without Priority`, `Demo vs. Daily Use Gap`, `Silent Churn`) are on-topic and correct — **keep them as-is.**

**1c. `streamlinedProcess` — WRONG (it's a website-build process under a "Design System Roadmap" heading) 🔴**
- Current `heading`: `"Design System Roadmap"`; two workflow groups both badged `"Design Workflow"` with steps about CMS setup, React/Next.js, SEO, domain connection, deployment — none of which is an audit.
- Replace the whole `streamlinedProcess` block with:

```json
"streamlinedProcess": {
  "heading": "How a UX Audit Runs",
  "badge": "Streamlined Process",
  "workflow": [
    {
      "badge": "Review Workflow",
      "card": [
        { "heading": "Kickoff & Context", "description": "A short call to understand your product, target users, key conversion goals, and the metric you're worried about.", "gradientId": 1 },
        { "heading": "Heuristic & Flow Review", "description": "We work through core journeys screen by screen against proven UX heuristics, noting friction, dead ends, and trust gaps.", "gradientId": 2 },
        { "heading": "Prioritised Findings", "description": "Every issue is scored by impact and effort, so you know what to fix first — not just a list of everything wrong.", "gradientId": 3 }
      ]
    },
    {
      "badge": "Handover Workflow",
      "card": [
        { "heading": "Audit Report", "description": "An annotated report with each finding, why it matters, and a concrete recommendation you can hand to design or dev.", "gradientId": 1 },
        { "heading": "Walkthrough Call or Video", "description": "We talk through the findings and priorities so the reasoning is clear, not just the conclusions.", "gradientId": 2 },
        { "heading": "Action Roadmap", "description": "A sequenced fix list you can execute in-house or bring back to us for UX execution.", "gradientId": 3 }
      ]
    }
  ]
}
```

**1d. `youWillGet.rightBadges` — duplicate label 🟡**
- `"Prioritized Suggestions"` appears twice (rotation -10 and -6). Change the second one to: `"Impact vs. Effort Scoring"`.

**1e. ADD — name AI-tool-built prototypes as an audit input (v5 A3) 🟡**
- In `whoThisIsFor.card`, the second card heading is lowercase (`"anyone looking to upgrade their product experience & conversions"`). Replace that card with:

```json
{
  "heading": "Teams With an AI-Built Prototype",
  "description": "You shipped something fast with Lovable, Bolt, v0, or Cursor and need a professional read on what's usable, what's fragile, and what to fix before you invest further.",
  "image": "https://res.cloudinary.com/dvk9ttiym/image/upload/v1771832688/anyone_l09c81.svg"
}
```
- Also Title-case the first card heading: `"Founders or startups who are just starting out"` → `"Founders Just Getting Started"` (keep its description).

**1f. ADD — scope / turnaround signal (v4 D2, closes X8 for this page) 🟠**
- Append to the hero `description` (after "what to do next."):
  > " Most audits run 1–2 weeks."
- This is the only page where the small-fast-cheap buyer lands; the timeline signal is what that buyer scans for. (Price band omitted deliberately until the smallest audit tier is fixed — add `"from $X"` when it is.)

---

### Page 2 — SaaS & AI Development (`SaaS-&-AI-Development`)  🔴 add the AI-code card

**2a. ADD a 5th `whatYouGet` card — "AI-Generated Code, Production-Ready" (v5 Finding 2 / A1) 🔴**
Highest-intent unaddressed keyword in both scans; the underlying skill (full-stack engineering) is already the service. Insert as the last card in `whatYouGet.card`:

```json
{
  "heading": "AI-Generated Code, Production-Ready",
  "description": "Built something fast with Lovable, Bolt, Replit, or Claude Code? We take it from prototype to a secure, scalable, production-grade product.",
  "image": "https://res.cloudinary.com/dvk9ttiym/image/upload/v1760622270/front_dxjszm.svg"
}
```
*(The `whatYouGet` heading render couples to animations per X4 — verify a 5th card doesn't fall off the animation map in `screens/serviceDetails/whatYouGetAnimations/index.tsx`; if it does, swap this card in for the weakest current one, "API & Third-Party Integrations", rather than appending.)*

**2b. `whyThisMatters` — extend "Fragile Foundations" to name AI-tool output (v5 Finding 2) 🟡**
- Current card 1 `description`: `"Why does adding one feature break three others?"`
- Current `QuickWins[0]`: `"Because the architecture wasn't built to extend. We design data models and services that absorb change instead of fighting it."`
- Change `QuickWins[0]` to: `"Because the architecture — often scaffolded fast by an AI tool — wasn't built to extend. We re-lay the data models and services so change is absorbed, not fought."`

**2c. Name real providers in the generic cards (v5 A4) 🟡**
- `whatYouGet` card "Full-Stack Architecture" desc → `"Scalable backend and database architecture on Node.js or Python, built to handle real growth"`
- `whatYouGet` card "Cloud Deployment & Scaling" desc → `"Production deployment on AWS, GCP, or Azure — CI/CD, monitoring, and infrastructure that scales with usage"`
- `youWillGet.leftBadges` "AI/LLM Integration" and "Cloud Deployment & CI/CD" are fine as-is; optionally add one right badge: `{ "icon": "🤖", "text": "AI Agents / LLM APIs", "color": "#E8E8FFE5", "rotation": 4 }`.

---

### Page 3 — UX/UI Design (`UX-UI-Design`)  🟡 name the redesign use case

**3a. ADD "redesign an existing product" as an explicit deliverable (v4 D3) 🟡**
Most SaaS UI/UX buyers have a live product to improve, not a blank page — but every `whatYouGet` card and the hero lean "idea → MVP".
- Replace `whatYouGet` card 3, currently:
  > `"heading": "Idea to MVP"`, `"description": "Product strategy, Product thinking, Competitive analysis"`
  with:
  ```json
  {
    "heading": "New Build or Redesign",
    "description": "Whether you're going idea-to-MVP or modernising a live SaaS product that's outgrown its interface — product strategy, IA, and competitive analysis included.",
    "image": "https://res.cloudinary.com/dvk9ttiym/image/upload/v1760622270/front_dxjszm.svg"
  }
  ```
  *(This also fixes the Material "sentences not noun-lists" flag on the old "Idea to MVP" card carried from v1.)*

**3b. Naming consistency (X1 / X5 / NC7 — still open) 🟠**
- `hero.badge` is `"SAAS & AI PRODUCT UX/UI & FRONT END DEVELOPMENT"`; `recommendedNextSteps` on other pages links this slug as both `"UX/UI Design"` and `"UX/UI & Front End Development"`. Pick **"UX/UI Design"** as the one public name and use it in the badge and every cross-link `title`. Not a market-demand finding — but v4 rank 2 notes this crowded lane makes an inconsistent name a real cost, so it's re-prioritised 🟠.

---

### Page 4 — Landing Pages & Business Websites (`Landing-Pages-&-Business-Websites`)  ✅ no change

v4 D4 (Framer/Webflow must be visible) is already satisfied — `youWillGet.rightBadges` has "Webflow or Framer setup" and the process names CMS/frameworks. "Conversion", "credibility", "signups/demos/inquiries" language is already throughout. **Nothing to change from the market findings.** (Any open v1–v3 correctness items for this page are unaffected and tracked in the checklist.)

---

## Priority additions to the master table (supersedes v5's provisional A1–A4)

| # | Page | Change | Priority | Source |
|---|---|---|---|---|
| V6-1 | UX Audits | Fix `whyThisMatters` heading (3D → growth-stall) | 🔴 | 1b |
| V6-2 | UX Audits | Replace `streamlinedProcess` (website-build → audit flow) | 🔴 | 1c |
| V6-3 | UX Audits | `whatYouGet` heading grammar | 🟠 | 1a |
| V6-4 | UX Audits | Dedupe `rightBadges` label | 🟡 | 1d |
| V6-5 | UX Audits | Add "AI-Built Prototype" audience card + Title-case headings | 🟡 | 1e |
| V6-6 | UX Audits | Add "Most audits run 1–2 weeks" scope signal to hero | 🟠 | 1f |
| V6-7 | SaaS & AI Dev | Add "AI-Generated Code, Production-Ready" `whatYouGet` card | 🔴 | 2a |
| V6-8 | SaaS & AI Dev | Extend "Fragile Foundations" copy to name AI-tool scaffolding | 🟡 | 2b |
| V6-9 | SaaS & AI Dev | Name Node.js/Python/AWS/GCP/Azure in generic cards | 🟡 | 2c |
| V6-10 | UX/UI Design | Replace "Idea to MVP" card with "New Build or Redesign" | 🟡 | 3a |
| V6-11 | UX/UI Design | Standardise the service name to "UX/UI Design" everywhere | 🟠 | 3b |
| V6-12 | Cross-cutting | Close X2 / NC8 (`/services` hub) as intentional won't-do | ✅ | user decision |

*Cross-reference: `04-about-page.md` v6 carries the matching About-page copy (backend/cloud stack row, AI + "AI prototype" hero mention, low-commitment CTA line). Checklist: `05-services-pages-checklist.md`.*

---
---

# v7 — Consolidated Content Change List (Services Pages)
**Compiled:** 2026-09-09
**Purpose:** A single self-contained list of every content change the v4–v6 Upwork market-demand findings call for on the individual service pages, with exact before → after copy. Nothing new is introduced here — this consolidates v6 §968–1102 and the `05-services-pages-checklist.md` entries into one actionable block so the edits can be applied in one pass.

**All edits are in `data/sericesDetailsList.json`** unless noted. Four in-scope slugs: `UX-UI-Design`, `SaaS-&-AI-Development`, `Landing-Pages-&-Business-Websites`, `UX-Audits-&-Consultation`.

**Why these changes (market basis):**
- **UX Audits** is the largest single recurring job category in the ~80-posting Upwork scan, yet the page still carries wrong-service strings from the deleted 3D / Design-System service — highest-leverage fix on the services surface.
- **"AI-generated code → production-ready"** (Lovable / Bolt / Replit / v0 / Cursor / Claude Code cleanup) was the highest-intent keyword with **zero** surface area anywhere on the site, despite sitting squarely inside the "idea to shipped product" promise.
- **"Redesign an existing SaaS product"** — not greenfield "idea to MVP" — is the dominant UI/UX search pattern.
- **Framer / Webflow** are named directly by Landing Pages buyers (already satisfied on that page — no change).

---

## PAGE 1 — UX Audits & Consultation (`UX-Audits-&-Consultation`) 🔴 highest leverage

### C1 — `whyThisMatters.heading` / `heading2` — WRONG, references deleted 3D service 🔴
- **Before:** `heading`: `"Why Most 3D On Websites Fails "` · `heading2`: `"(And How We Do It Right)"`
- **After:** `heading`: `"Why Growth Stalls After Launch"` · `heading2`: `"(And What an Audit Uncovers)"`
- The 5 cards underneath (`Unclear First Steps`, `Too Many Decisions`, `Features Without Priority`, `Demo vs. Daily Use Gap`, `Silent Churn`) are on-topic — **keep verbatim.**

### C2 — `streamlinedProcess` — WRONG, it's a website-build process under a "Design System Roadmap" heading 🔴
- **Before:** `heading`: `"Design System Roadmap"`; two workflow groups both badged `"Design Workflow"`; steps about CMS setup, React/Next.js, SEO optimisation, domain connection, deployment — none of which is an audit.
- **After:** replace the entire `streamlinedProcess` block with:

```json
"streamlinedProcess": {
  "heading": "How a UX Audit Runs",
  "badge": "Streamlined Process",
  "workflow": [
    {
      "badge": "Review Workflow",
      "card": [
        { "heading": "Kickoff & Context", "description": "A short call to understand your product, target users, key conversion goals, and the metric you're worried about.", "gradientId": 1 },
        { "heading": "Heuristic & Flow Review", "description": "We work through core journeys screen by screen against proven UX heuristics, noting friction, dead ends, and trust gaps.", "gradientId": 2 },
        { "heading": "Prioritised Findings", "description": "Every issue is scored by impact and effort, so you know what to fix first — not just a list of everything wrong.", "gradientId": 3 }
      ]
    },
    {
      "badge": "Handover Workflow",
      "card": [
        { "heading": "Audit Report", "description": "An annotated report with each finding, why it matters, and a concrete recommendation you can hand to design or dev.", "gradientId": 1 },
        { "heading": "Walkthrough Call or Video", "description": "We talk through the findings and priorities so the reasoning is clear, not just the conclusions.", "gradientId": 2 },
        { "heading": "Action Roadmap", "description": "A sequenced fix list you can execute in-house or bring back to us for UX execution.", "gradientId": 3 }
      ]
    }
  ]
}
```

### C3 — `whatYouGet.heading` — deliverable-first + ungrammatical 🟠
- **Before:** `"What All Will you get in return"`
- **After:** `"What You Get From a UX Audit"`
- The 4 cards (`Heuristic UX Audit Report`, `Drop-Off & Friction Insights`, `Flow & Interaction Review`, `Walkthrough Video`) are already correct — **keep.**

### C4 — hero `description` — add scope / turnaround signal for the small-fast-cheap buyer 🟠
- **Before:** ends `"…what to do next."`
- **After:** append one sentence → `"…what to do next. Most audits run 1–2 weeks."`
- Price band intentionally omitted until the smallest audit tier is set — add `"from $X"` when it is.

### C5 — `whoThisIsFor` — only 2 cards, lowercase headings; add the AI-prototype buyer 🟡
- **Card 1 — before:** `"Founders or startups who are just starting out"` → **after:** `"Founders Just Getting Started"` (keep the existing description).
- **Card 2 — before:** `"anyone looking to upgrade their product experience & conversions"` → **after:** replace the whole card with:

```json
{
  "heading": "Teams With an AI-Built Prototype",
  "description": "You shipped something fast with Lovable, Bolt, v0, or Cursor and need a professional read on what's usable, what's fragile, and what to fix before you invest further.",
  "image": "https://res.cloudinary.com/dvk9ttiym/image/upload/v1771832688/anyone_l09c81.svg"
}
```

### C6 — `youWillGet.rightBadges` — duplicate label 🟡
- **Before:** `"Prioritized Suggestions"` appears twice (rotation -10 and -6).
- **After:** change the second occurrence to `"Impact vs. Effort Scoring"`.

### C7 — `youWillGet.description` — copy-pasted from UX/UI Design 🟡
- **Before:** `"We design & build intuitive user interfaces and working apps for SaaS, AI tools, dashboards, mobile-first products…"`
- **After:** an audit-specific sentence, e.g. `"We review your live product against proven UX heuristics and real user journeys, then hand you a prioritised, actionable set of fixes."`
- Note: the `youWillGet` block is **not currently rendered** by `screens/serviceDetails/index.tsx` — fix only matters if the block is wired in.

---

## PAGE 2 — SaaS & AI Development (`SaaS-&-AI-Development`) 🔴 add the AI-code lane

### C8 — ADD a 5th `whatYouGet` card: "AI-Generated Code, Production-Ready" 🔴
Highest-intent unaddressed keyword in both Upwork scans; the underlying skill (full-stack engineering) is already the service.

```json
{
  "heading": "AI-Generated Code, Production-Ready",
  "description": "Built something fast with Lovable, Bolt, Replit, or Claude Code? We take it from prototype to a secure, scalable, production-grade product.",
  "image": "https://res.cloudinary.com/dvk9ttiym/image/upload/v1760622270/front_dxjszm.svg"
}
```
- **X4 caveat:** `whatYouGet` headings couple to the animation map in `screens/serviceDetails/whatYouGetAnimations/index.tsx`. Verify a 5th card doesn't fall off the map. If it does, **swap this card in for the weakest current one — `API & Third-Party Integrations` — instead of appending.**

### C9 — `whyThisMatters` "Fragile Foundations" — name AI-tool scaffolding 🟡
- **Before (`QuickWins[0]`):** `"Because the architecture wasn't built to extend. We design data models and services that absorb change instead of fighting it."`
- **After:** `"Because the architecture — often scaffolded fast by an AI tool — wasn't built to extend. We re-lay the data models and services so change is absorbed, not fought."`
- Card `description` (`"Why does adding one feature break three others?"`) stays as-is.

### C10 — name real providers in the generic `whatYouGet` cards 🟡
- **`Full-Stack Architecture` — before:** current generic desc → **after:** `"Scalable backend and database architecture on Node.js or Python, built to handle real growth"`
- **`Cloud Deployment & Scaling` — before:** current generic desc → **after:** `"Production deployment on AWS, GCP, or Azure — CI/CD, monitoring, and infrastructure that scales with usage"`
- Optional: add one `youWillGet.rightBadges` entry → `{ "icon": "🤖", "text": "AI Agents / LLM APIs", "color": "#E8E8FFE5", "rotation": 4 }`.
- Constraint (user decision 2026-09-09): **no `.NET` / `C#` / `ASP.NET` language anywhere.** Azure is in scope only as a cloud/deploy target.

---

## PAGE 3 — UX/UI Design (`UX-UI-Design`) 🟡 name the redesign use case

### C11 — replace `whatYouGet` card 3 "Idea to MVP" with "New Build or Redesign" 🟡
Most SaaS UI/UX buyers have a live product to improve, not a blank page. Also fixes the noun-list description flagged in v1.
- **Before:** `"heading": "Idea to MVP"`, `"description": "Product strategy, Product thinking, Competitive analysis"`
- **After:**

```json
{
  "heading": "New Build or Redesign",
  "description": "Whether you're going idea-to-MVP or modernising a live SaaS product that's outgrown its interface — product strategy, IA, and competitive analysis included.",
  "image": "https://res.cloudinary.com/dvk9ttiym/image/upload/v1760622270/front_dxjszm.svg"
}
```
- **X4 caveat:** `"Idea to MVP"` is in the animation map; the new heading is not. Confirm the fallback visual is acceptable or add `"New Build or Redesign"` to the map.

### C12 — standardise the public service name to "UX/UI Design" 🟠
- **`hero.badge` — before:** `"SAAS & AI PRODUCT UX/UI & FRONT END DEVELOPMENT"` → **after:** `"UX/UI Design"` (or a short positioning phrase in caps, e.g. `"SAAS & AI PRODUCT DESIGN"`).
- Use `"UX/UI Design"` as the `title` in every `recommendedNextSteps` cross-link that points at this slug (currently a mix of `"UX/UI Design"` and `"UX/UI & Front End Development"`).
- JSON-LD `Service.name` in `app/services/[id]/page.tsx` currently uses the raw all-caps badge — set it from a clean name map (reuse `SERVICE_OG[slug].badge`).

---

## PAGE 4 — Landing Pages & Business Websites (`Landing-Pages-&-Business-Websites`) ✅ no market-demand change

- v4 D4 (Framer / Webflow must be visible) is **already satisfied** — `youWillGet.rightBadges` includes `"Webflow or Framer setup"` and `streamlinedProcess` names CMS/frameworks.
- "Conversion" / "credibility" / "signups, demos, inquiries" language is already throughout.
- **No content change from the market findings.** (The separate v1–v3 `model landing pages` typo → `modern` in both `data/sericesDetailsList.json` and `data/servicesTopList.json` is a correctness fix, not a market finding.)

---

## Not a content change — recorded for completeness

| Item | Decision |
|---|---|
| `/services` hub page (X2 / NC8) | 🚫 Won't do — intentional (user decision 2026-09-09). Service pages reached via nav dropdown + cross-links only. |
| `RecommendedNextSteps` buttons routing (NF1) | Verify the component routes to `/services/[slug]`, not the default WhatsApp link. Correctness bug, tracked separately. |
| Unknown slug returns HTTP 200 soft-404 (NF4) | Add `notFound()` in `app/services/[id]/page.tsx`. Correctness bug, tracked separately. |

---

## Apply order

1. **C1, C2, C8** (🔴) — UX Audits `whyThisMatters` heading, UX Audits `streamlinedProcess`, SaaS & AI Dev AI-code card.
2. **C3, C4, C12** (🟠) — UX Audits heading grammar + turnaround line, service-name standardisation.
3. **C5, C6, C7, C9, C10, C11** (🟡) — audience cards, dedupe, boilerplate, provider naming, redesign card.

*Cross-reference: `04-about-page.md` v6/v7 carries the matching About-page copy. Checklist: `05-services-pages-checklist.md` (V6-1…V6-12 map 1:1 to C1…C12 here).*

> **v8 update (2026-09-09):** **C6 and C7 are now VOID.** Both only touched the `youWillGet` ("What we provide") block, which has been removed entirely (see v8 below) because it duplicated the `whatYouGet` ("WHAT YOU GET") section. The optional "AI Agents / LLM APIs" badge under C10 is likewise void. C1–C5, C8, C9, C10 (the card-description rewrites), C11, C12 stand and are applied.

---
---

# v8 — "What We Provide" Removal + Implementation Review (Services Pages)
**Audited:** 2026-09-09
**Method:** After the v7 content pass landed in `data/sericesDetailsList.json`, every service-detail component was read (`screens/serviceDetails/*`, `app/services/[id]/page.tsx`, `app/layout.tsx`, `app/sitemap.ts`) to see which updated fields actually render. Two "what you get"-style sections were found stacked on every page; per user direction the duplicate was removed. This section records what shipped, what's now rendering, and what still needs work.

## Decision carried in from the user (2026-09-09)

- **`youWillGet` ("What we provide") duplicated `whatYouGet` ("WHAT YOU GET")** — keep `whatYouGet`, **remove `youWillGet` from every page entirely.** Do not build a section for it.

## What shipped in v8 — the "What we provide" removal

| Change | Files | Notes |
|---|---|---|
| **`youWillGet` block deleted** from all entries | `data/sericesDetailsList.json` | JSON re-validated. It duplicated `whatYouGet`. |
| **`YouWillGet` component deleted** (added earlier the same day in the v7 render pass, before this decision) | `screens/serviceDetails/youWillGet/` removed; import + render removed from `screens/serviceDetails/index.tsx` | No dangling refs (`grep` clean for `youWillGet` / `leftBadges` / `rightBadges`). |

(The rest of the v8 work — killing the Design System service, the soft-404 fix, hero CTAs, and all the copy items — is in **"v8 — full open-items sweep"** below.)

**Kept from the v7 render pass** (independent of the `youWillGet` decision):
- `streamlinedProcess/index.tsx` now renders `data.heading` instead of a hardcoded `"How We Work"` — so **C2**'s "How a UX Audit Runs" and each service's real workflow heading are visible.
- `recommendedNextSteps/index.tsx` now passes `href={`/services/${slug}`}` on the featured + other-service buttons (they previously all defaulted to the WhatsApp link — finding **NF1**). **C12**'s slug standardisation is now functional.
- `whatYouGetAnimations/index.tsx` — added `"New Build or Redesign": Visuals.VisualMVP` so **C11**'s renamed card keeps a visual.

## Current render map (what a visitor actually sees)

`Hero → WhatYouGet → WhyThisMatters → StreamlinedProcess → LandingWork (generic) → WhoThisIsFor → RecommendedNextSteps → GlobalCTA`

| Section | Fields rendered | v7/v8 content live here |
|---|---|---|
| Hero | `badge`, `heading[]`, `description` (CTAs hardcoded) | C4 (UX Audits "…1–2 weeks"), C12 (UX/UI badge) |
| WhatYouGet | `badge`, `heading`, `card[].{heading, description, image}` (+ animation by exact heading string) | C3, C8, C10 (card descriptions), C11 |
| WhyThisMatters | `badge`, `heading`, `heading2`, `card[].{heading, description, QuickWins[]}` | C1, C9 |
| StreamlinedProcess | `badge` ("Streamlined Process"), `heading` (v8), 2 `workflow` groups × up to 3 cards, **each group's `badge` shown as a phase label** (v8/S7) | C2 |
| WhoThisIsFor | `badge`, `heading`, `card[].{image, heading, description}` | C5 |
| RecommendedNextSteps | `featuredService.{title, tagline, description, description2, buttonText}` + `href` from `slug` (v8); `otherServices[].{title}` + `href` | C12 (titles + working internal links) |

## v8 — full open-items sweep (2026-09-09)

After the "What we provide" removal, every remaining open item from the v1–v7 audits + checklist was worked. **`next build` passes; 4 service routes, no Design System route; `tsc` + `eslint` clean.**

**Structural / code**
- **S1 — Design System service killed.** Removed the 5th JSON entry and every reference: `SERVICE_META`, `SERVICE_OG`, `SERVICE_LABELS` (breadcrumbs), the `<noscript>` SEO-footer link (`app/layout.tsx`), and the `app/sitemap.ts` slug. (`/componentlab` — the "Component Lab" showcase page — is unrelated and untouched.)
- **S2** — `<div>danis...</div>` → `notFound()`.
- **S3** — unknown slug now calls `notFound()` (real 404, was soft-404 HTTP 200).
- **S4** — JSON-LD `Service.name` + `serviceType` from a new `SERVICE_NAME` map; `description` from `SERVICE_META`.
- **S5** — hero CTAs reworked: primary → `https://cal.com/ui-pirate/15min` (was `/contact`); secondary "See Pricing" → `/pricing` (WhatsApp block removed).
- **S6** — hero badge fallback → `"50+ PRODUCTS SHIPPED ACROSS 6 COUNTRIES"`.
- **S7** — `streamlinedProcess` now renders each `workflow` group as one row with its `badge` as a phase label — the two-phase structure is visible.
- **S8** — dead `getCardRotation` removed.
- **S9** — animation map documented as load-bearing; `Full-Stack Architecture` + `AI-Generated Code, Production-Ready` mapped to `VisualCode`.

**Copy (`data/sericesDetailsList.json`)**
- **C-a** `whoThisIsFor` heading → `Does this sound like you?` on all 4 pages.
- **C-b** UX Audits `whoThisIsFor` 3rd card added ("Teams With Stalled Growth") — 3 cards, parallel with the others.
- **C-c** "behaves consistent" → "behaves consistently."
- **C-d** trimmed leading/trailing spaces in Landing `QuickWins` and two `description2` fields.
- **C-e** cut "…without extra effort later".
- **C-f** Landing `whyThisMatters` 6 → 4 cards (dropped "Messaging Drives Action" + "Users Scan, They Don't Read"; "Clarity Beats Creativity" absorbs the scanning point).
- **C-g** Landing `whoThisIsFor` 3rd card → "Funded Startups & Scaleups" (was "Portfolios & Personal Brand Sites").
- **C-h** UX/UI `hero.description` → "enterprise-grade" + tidy punctuation.
- **C-i** (`app/services/[id]/page.tsx`) 4 `SERVICE_META` titles tightened + `| UI Pirate`; keyword lists trimmed; SaaS description names the real stack + AI-code; UX Audits description reflects the reframe; "Fortune 500" fallback claim removed.

## Per-page status after v8

| Page | State |
|---|---|
| **UX/UI Design** | Badge `SAAS & AI PRODUCT DESIGN`; "New Build or Redesign" card (animated); cross-links standardised; hero copy + SEO title fixed. Clean. |
| **SaaS & AI Development** | 5-card `whatYouGet` incl. "AI-Generated Code, Production-Ready" (2 now animated); real provider names in copy; "Fragile Foundations" names AI scaffolding; SEO description names the stack. Clean. |
| **Landing Pages** | `whyThisMatters` 4 cards; `whoThisIsFor` retargeted commercial; typo/whitespace/filler fixed; cross-link `ux-ui-design`. **Note:** Framer/Webflow are named in the process step copy but no longer in a badge (the `youWillGet` badge set was removed) — surfacing them in a `whatYouGet` card is the only remaining 🟡. |
| **UX Audits & Consultation** | Full wrong-service content replaced; real audit process with visible heading + phase labels; 3 audience cards; hero turnaround line; cross-links fixed. Clean. |

## Still open (product / content decisions, not mechanical)

1. **S10 / X7** — `LandingWork` gallery is generic on every service page. Needs a per-service project + result metric + testimonial (content the team must supply).
2. **Landing Pages** — optionally name Framer/Webflow in a `whatYouGet` card (keyword lost with the badge-set removal).
3. **Cross-audit** — service-page JSON-LD `areaServed` (`US, UK, SG, IN, AU`) still differs from `/about`'s Organization schema; tracked in `04-about-page.md` NF3.
4. **S7 cosmetic** — the new phase label sits above the decorative rope SVG on desktop; a designer may want to reposition it.

Full item-by-item status: `05-services-pages-checklist.md`.
