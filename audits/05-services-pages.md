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

## Scope Note — 4 pages vs 5 in the data

The brief covers **4** service pages:

1. UX/UI Design
2. SaaS & AI Development
3. Landing Pages & Business Websites
4. UX Audits & Consultation

`data/sericesDetailsList.json` actually contains **5** entries. The fifth is **Design System & Component Library**. It is:

- **Still in the data file** and still routable at `/services/Design-System-&-Component-Library`
- **Still in the SEO metadata map** (`SERVICE_META["design-system-component-library"]` in `page.tsx`)
- **Still linked** from `app/layout.tsx` footer and `app/sitemap/page.tsx`
- **Already removed** from the main navbar (`config/site.ts` lists only the 4 above) and from `components/footer.tsx`

So it is in a half-killed state. **A decision is needed: fully kill it or fully rebuild it.** It is audited last (Section 6) because its content is currently the weakest of the five — most of its copy is pasted from other services. This audit assumes the likely intent is to **kill it** and fold "design tokens / component library" into the UX/UI Design page as a deliverable, but both paths are laid out.

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

## 5. Design System & Component Library  (`design-system-component-library`) — KILL or REBUILD

Currently half-removed (in data/metadata/footer-in-layout/sitemap, absent from navbar and `components/footer.tsx`).

### If killing (recommended):
1. Remove the entry from `data/sericesDetailsList.json`.
2. Remove `SERVICE_META["design-system-component-library"]` from `page.tsx`.
3. Remove links in `app/layout.tsx:417`, `app/sitemap/page.tsx`, `screens/sitemap/index.tsx`, and any remaining nav/footer references.
4. Add a 301 redirect from `/services/Design-System-&-Component-Library` → `/services/ux-ui-design` (or `/services`) so existing links / indexed URLs don't dead-end.
5. Fold "design tokens, component library, documented handoff" in as a **deliverable bullet** on the UX/UI Design page (`whatYouGet` or a new card) — it's a real capability, it just doesn't need its own page at current demand.

### If keeping, it needs a full content pass — current state:
- 🔴 `hero.heading` = "Your Website Isn't a Brochure, It's a Sales Tool" (Landing Pages' headline).
- 🔴 `hero.badge` = "Tokens to Components | Built for Scale | 1–4 Week Delivery" — actually fine, but mismatched with the wrong headline.
- 🔴 `whoThisIsFor` = old **Graphic Design** copy (icon sets, pitch decks, logos, print-ready materials, "cohesive design language"). Nothing about design-system consumers (product teams scaling UI, multi-squad orgs, teams with drift between Figma and code).
- 🔴 `streamlinedProcess` = generic website build steps, both groups badged "Design Workflow".
- 🟡 `whatYouGet` uses key `img` not `image` (works via fallback, but inconsistent).
- 🟡 `whyThisMatters` (Visual Inconsistency · Development Friction · Maintenance Debt) is **actually the only well-written block on this page** — keep it if rebuilding.
- 🔴 `recommendedNextSteps.otherServices` slug `ux-ui-front-end-development` broken.

---

## Priority Fix Table

| # | Scope | Issue | Priority |
|---|---|---|---|
| 1 | All | Broken cross-links — every "recommended next step" to the UX/UI service uses dead slug `ux-ui-front-end-development`; `layout.tsx` uses dead `SaaS-Web-&-Mobile-Apps` | 🔴 Fix now |
| 2 | Nav | `/services` parent link 404s — no hub page exists | 🔴 Fix now |
| 3 | UX Audits | `whyThisMatters` heading = "Why Most 3D On Websites Fails" (wrong service) | 🔴 Fix now |
| 4 | UX Audits | `streamlinedProcess` = website-build steps + heading "Design System Roadmap" (entirely wrong) | 🔴 Fix now |
| 5 | Design System | `hero.heading` = Landing Pages' headline; `whoThisIsFor` = old Graphic Design copy | 🔴 Fix now (or kill the page) |
| 6 | All | `screens/serviceDetails/index.tsx` ships `<div>danis...</div>` as the no-data fallback | 🔴 Fix now |
| 7 | Design System | Decide: kill (recommended) or fully rebuild — it's half-removed and half-live | 🔴 Decide now |
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
