# Services Pages Audit Checklist

This document tracks the progress of all content, copy, SEO, and conversion changes on the 4 service detail pages.
Synced to **`05-services-pages.md` v6 (2026-09-09)** — all statuses are code-verified against live source files.

**Pages in scope (`/services/[id]`):**

1. UX/UI Design — slug `UX-UI-Design`
2. SaaS & AI Development — slug `SaaS-&-AI-Development`
3. Landing Pages & Business Websites — slug `Landing-Pages-&-Business-Websites`
4. UX Audits & Consultation — slug `UX-Audits-&-Consultation`

**Files in scope:**
- `data/sericesDetailsList.json` — all page content (filename misspelled `serices` — intentional, do not rename without a codemod)
- `app/services/[id]/page.tsx` — routing, metadata, JSON-LD
- `app/services/[id]/opengraph-image.tsx` — OG social card
- `screens/serviceDetails/` — section components
- `screens/serviceDetails/whatYouGetAnimations/index.tsx` — `whatYouGet` heading → animation coupling (X4)
- `config/site.ts`, `components/footer.tsx`, `screens/sitemap/index.tsx` — navigation into these pages

---

## How to read this

- ✅ **Done** — verified in source code
- ❌ **Not done** — confirmed still wrong in source code
- ⚠️ **Partially done** — in progress or needs further work
- 🚫 **Won't do** — intentional decision not to change
- 🔴 **Fix now** — errors actively damaging trust/credibility or SEO
- 🟠 **Soon** — conversion and positioning improvements
- 🟡 **Consider** — polish and consistency improvements

---

## 0. CROSS-CUTTING (affects multiple / all service pages)

| # | Item | Status |
|---|------|--------|
| X1 | One service ("UX/UI Design") referenced by 3+ names and some dead slugs across cross-links | ⚠️ Open — see §1.7 (V6-11) |
| X2 | No `/services` hub page | 🚫 Won't do — intentional (user decision 2026-09-09). Service pages are reached via nav dropdown + cross-links only |
| X3 | Placeholder / copy-paste content left in production (`<div>danis...`, wrong-service strings) | ⚠️ Partially — UX Audits still carries 3D / Design-System leftovers, see §4 |
| X4 | `whatYouGet` card headings silently coupled to animation map | ⚠️ Open — must be checked before adding/removing any `whatYouGet` card (blocks V6-7) |
| X5 | Positioning boundary between "UX/UI Design" and "SaaS & AI Development" unclear | ⚠️ Open — naming standardisation (V6-11) is the fix |
| X6 | `WhoThisIsFor` section heading inconsistent across services | ⚠️ Open — ("Does it sound like you?" vs "Does this sound like you?") |
| X7 | Social proof (`LandingWork` gallery) is generic, not service-filtered | 🟡 Consider — not addressed by market findings |
| X8 | No timeline / price signal on most pages | ⚠️ Partially — UX Audits gets "Most audits run 1–2 weeks" (V6-6); others still bare |
| X9 | SEO metadata keyword-stuffed / partly stale | 🟡 Consider — see §*.SEO rows |
| NF1 | `RecommendedNextSteps` buttons were undisclosed WhatsApp links | ✅ Verify — data now carries real `slug` values; confirm the component routes to `/services/[slug]` not WhatsApp |
| NF4 | Unknown service slug returns HTTP 200 (soft 404) | ❌ Not done — add `notFound()` for unknown slugs in `app/services/[id]/page.tsx` |

---

## 1. UX/UI DESIGN (`UX-UI-Design`)

### 1.1 Hero
| # | Item | Status |
|---|------|--------|
| 1.1a | `hero.badge` = `SAAS & AI PRODUCT UX/UI & FRONT END DEVELOPMENT` — all-caps, 3-in-1 name | ❌ Standardise to `UX/UI Design` (V6-11) |
| 1.1b | Heading + description — clear, on-message | ✅ Keep as-is |

### 1.2 WhatYouGet — "Everything You Need to Design & Build a SaaS Product"
| # | Item | Status |
|---|------|--------|
| 1.2a | Card 3 `Idea to MVP` — desc is a noun-list (`Product strategy, Product thinking, Competitive analysis`) and omits the dominant real use case (redesign of a live product) | ❌ Replace with `New Build or Redesign` card (V6-10) |
| 1.2b | Cards 1, 2, 4 (`UX/UI Design & Prototype`, `UI Development & Integration`, `Mobile Optimization`) | ✅ Keep as-is |

**V6-10 replacement copy (apply verbatim):**
> **Heading:** New Build or Redesign
> **Description:** Whether you're going idea-to-MVP or modernising a live SaaS product that's outgrown its interface — product strategy, IA, and competitive analysis included.

### 1.3 WhyThisMatters — "Why Most SaaS & AI Products Break (And How We Fix It)"
| # | Item | Status |
|---|------|--------|
| 1.3a | 5 problem-first cards | ✅ Keep as-is (strong per JTBD) — minor typos in `QuickWins` ("behaves consistent") 🟡 |

### 1.4 StreamlinedProcess — "Complete SaaS Web & Mobile App Workflow"
| # | Item | Status |
|---|------|--------|
| 1.4a | Design + Development workflow steps — accurate | ✅ Keep as-is |

### 1.5 WhoThisIsFor
| # | Item | Status |
|---|------|--------|
| 1.5a | 3 Title-case cards (SaaS & AI Startups · Enterprise Teams · Design / Dev Agencies) | ✅ Keep as-is |
| 1.5b | Section heading `Does it sound like you?` vs other pages' `Does this sound like you?` (X6) | 🟡 Standardise |

### 1.6 RecommendedNextSteps
| # | Item | Status |
|---|------|--------|
| 1.6a | Featured = Landing Pages; others = SaaS & AI Development, UX Audits — all have real slugs | ✅ Verify routing (NF1) |

### 1.7 Naming / SEO
| # | Item | Status |
|---|------|--------|
| 1.7a | Service called `UX/UI Design` / `UX/UI & Front End Development` / `SaaS & AI Product UX/UI...` across badge + cross-links (X1/X5/NC7) | ❌ Pick `UX/UI Design` everywhere (V6-11) 🟠 |
| 1.7b | JSON-LD `Service.name` = raw all-caps badge (X9/NF3) | ⚠️ Use the clean name from the OG map |

---

## 2. SaaS & AI DEVELOPMENT (`SaaS-&-AI-Development`)

### 2.1 Hero
| # | Item | Status |
|---|------|--------|
| 2.1a | "Build the engine behind your SaaS or AI product." + description | ✅ Keep as-is (strongest hero on the services surface) |

### 2.2 WhatYouGet — "Everything You Need to Ship a Working SaaS or AI Product"
| # | Item | Status |
|---|------|--------|
| 2.2a | 4 cards (Full-Stack Architecture · AI & LLM Integration · API & Third-Party Integrations · Cloud Deployment & Scaling) | ⚠️ Keep, but see 2.2b / 2.2c |
| 2.2b | No card names "AI-generated code → production" — highest-intent unaddressed keyword in both Upwork scans (v5 Finding 2) | ❌ Add 5th card `AI-Generated Code, Production-Ready` (V6-7) 🔴 |
| 2.2c | `Full-Stack Architecture` + `Cloud Deployment & Scaling` descriptions are provider-generic | ❌ Name Node.js/Python/AWS/GCP/Azure (V6-9) 🟡 |
| 2.2d | Adding a 5th card may break the heading→animation map (X4) | ⚠️ Check `whatYouGetAnimations/index.tsx` first; if it breaks, swap out `API & Third-Party Integrations` instead of appending |

**V6-7 new card copy (apply verbatim):**
> **Heading:** AI-Generated Code, Production-Ready
> **Description:** Built something fast with Lovable, Bolt, Replit, or Claude Code? We take it from prototype to a secure, scalable, production-grade product.

**V6-9 description rewrites:**
> Full-Stack Architecture → *Scalable backend and database architecture on Node.js or Python, built to handle real growth*
> Cloud Deployment & Scaling → *Production deployment on AWS, GCP, or Azure — CI/CD, monitoring, and infrastructure that scales with usage*

### 2.3 WhyThisMatters — "Why Most SaaS & AI Builds Stall (And How We Fix It)"
| # | Item | Status |
|---|------|--------|
| 2.3a | 5 problem-first cards — strong | ✅ Keep |
| 2.3b | Card 1 `Fragile Foundations` — doesn't name AI-tool scaffolding, though that's now the common cause | ❌ Extend `QuickWins[0]` (V6-8) 🟡 |

**V6-8 rewrite of `Fragile Foundations` → `QuickWins[0]`:**
> Because the architecture — often scaffolded fast by an AI tool — wasn't built to extend. We re-lay the data models and services so change is absorbed, not fought.

### 2.4 StreamlinedProcess — "Complete SaaS & AI Development Workflow"
| # | Item | Status |
|---|------|--------|
| 2.4a | Architecture + Engineering workflow steps — accurate | ✅ Keep as-is |

### 2.5 WhoThisIsFor
| # | Item | Status |
|---|------|--------|
| 2.5a | 3 cards (SaaS Founders · Teams Adding AI Features · Agencies Needing Backend Help) | ✅ Keep as-is |

### 2.6 RecommendedNextSteps / SEO
| # | Item | Status |
|---|------|--------|
| 2.6a | Featured = UX/UI Design; other = UX Audits — real slugs | ✅ Verify routing (NF1) |
| 2.6b | `youWillGet` — optionally add `AI Agents / LLM APIs` right badge | 🟡 Consider (V6-9) |

---

## 3. LANDING PAGES & BUSINESS WEBSITES (`Landing-Pages-&-Business-Websites`)

### 3.1 Hero
| # | Item | Status |
|---|------|--------|
| 3.1a | "Your Website Isn't a Brochure, It's a Sales Tool" + description | ✅ Keep as-is |
| 3.1b | Description typo `model landing pages` (also in `data/servicesTopList.json`, NF5) | ❌ Fix to `modern landing pages` in both files |

### 3.2 WhatYouGet — "Everything You Need to Launch and Convert"
| # | Item | Status |
|---|------|--------|
| 3.2a | 4 cards incl. `SEO Performance & AI-Readable Websites` | ✅ Keep as-is (differentiator praised in v1–v3) |
| 3.2b | Framer / Webflow named as buyer search terms (v4 D4) | ✅ Already visible in `youWillGet.rightBadges` ("Webflow or Framer setup") — no change |

### 3.3–3.5 WhyThisMatters / StreamlinedProcess / WhoThisIsFor
| # | Item | Status |
|---|------|--------|
| 3.3a | 6 problem-first cards — strong | ✅ Keep as-is |
| 3.4a | "From idea to live website" 2×3 steps — accurate | ✅ Keep as-is |
| 3.5a | `whoThisIsFor` spans SaaS → local business → portfolio (specialist-positioning flag, X-ref agency studies) | 🟡 Consider tightening — not a market-demand finding |

### 3.6 RecommendedNextSteps / SEO
| # | Item | Status |
|---|------|--------|
| 3.6a | Featured = UX Audits; other = UX/UI (`ux-ui-front-end-development` slug) | ⚠️ Confirm the `ux-ui-front-end-development` slug resolves (X1) |

**Net: no market-demand changes required for this page (v6).**

---

## 4. UX AUDITS & CONSULTATION (`UX-Audits-&-Consultation`)  🔴 highest-leverage page

Highest real demand in both Upwork scans **and** still carrying leftover wrong-service strings from the deleted 3D / Design-System service.

### 4.1 Hero
| # | Item | Status |
|---|------|--------|
| 4.1a | "Find What's Blocking Growth, Before You Build More" + description | ✅ Fixed since v3 — keep |
| 4.1b | No timeline/scope signal for the small-fast-cheap buyer (X8, v4 D2) | ❌ Append `" Most audits run 1–2 weeks."` to hero `description` (V6-6) 🟠 |

### 4.2 WhatYouGet — "What All Will you get in return"
| # | Item | Status |
|---|------|--------|
| 4.2a | Heading is deliverable-first + ungrammatical | ❌ Change to `What You Get From a UX Audit` (V6-3) 🟠 |
| 4.2b | 4 cards (Heuristic Report · Drop-Off & Friction · Flow Review · Walkthrough Video) | ✅ Fixed since v3 — keep |

### 4.3 WhyThisMatters — heading references 3D
| # | Item | Status |
|---|------|--------|
| 4.3a | `heading` = `"Why Most 3D On Websites Fails "` / `heading2` = `"(And How We Do It Right)"` — leftover from deleted 3D service | ❌ Replace (V6-1) 🔴 |
| 4.3b | 5 cards underneath (Unclear First Steps · Too Many Decisions · Features Without Priority · Demo vs. Daily Use Gap · Silent Churn) — on-topic | ✅ Keep as-is |

**V6-1 replacement:**
> `heading`: `Why Growth Stalls After Launch`
> `heading2`: `(And What an Audit Uncovers)`

### 4.4 StreamlinedProcess — entirely wrong content
| # | Item | Status |
|---|------|--------|
| 4.4a | `heading` = `"Design System Roadmap"`; both workflow groups badged `"Design Workflow"`; steps describe a website build (CMS, React/Next.js, SEO, domain, deploy) — not an audit | ❌ Replace whole block (V6-2) 🔴 |

**V6-2 replacement — see `05-services-pages.md` v6 §1c for the full JSON.** Summary:
> `heading`: `How a UX Audit Runs`
> Group 1 `Review Workflow`: Kickoff & Context · Heuristic & Flow Review · Prioritised Findings
> Group 2 `Handover Workflow`: Audit Report · Walkthrough Call or Video · Action Roadmap

### 4.5 WhoThisIsFor — only 2 cards, lowercase headings
| # | Item | Status |
|---|------|--------|
| 4.5a | Card 1 heading `Founders or startups who are just starting out` — sentence-case, long | ❌ → `Founders Just Getting Started` (keep desc) (V6-5) 🟡 |
| 4.5b | Card 2 heading `anyone looking to upgrade their product experience & conversions` — lowercase | ❌ Replace with `Teams With an AI-Built Prototype` card (V6-5) 🟡 |

**V6-5 replacement for card 2:**
> **Heading:** Teams With an AI-Built Prototype
> **Description:** You shipped something fast with Lovable, Bolt, v0, or Cursor and need a professional read on what's usable, what's fragile, and what to fix before you invest further.

### 4.6 youWillGet (badge set)
| # | Item | Status |
|---|------|--------|
| 4.6a | `rightBadges` has `Prioritized Suggestions` twice | ❌ Second one → `Impact vs. Effort Scoring` (V6-4) 🟡 |
| 4.6b | `youWillGet.description` is copy-pasted from UX/UI Design ("We design & build intuitive user interfaces...") | ❌ Replace with an audit-specific sentence 🟡 |

### 4.7 RecommendedNextSteps / SEO
| # | Item | Status |
|---|------|--------|
| 4.7a | Featured = SaaS & AI Product UX/UI (`ux-ui-front-end-development`); others = Landing Pages, UX Audits (self-link) | ⚠️ Remove the self-link; confirm slugs resolve (X1) |
| 4.7b | `whyThisMatters` / process copy must not reintroduce "3D" or "Design System" anywhere | ✅ Guard when editing |

---

## Sequencing (from `05-services-pages.md` v6 priority table)

1. **V6-1, V6-2, V6-7** (🔴) — UX Audits `whyThisMatters` heading, UX Audits `streamlinedProcess`, SaaS & AI Dev AI-code card.
2. **V6-3, V6-6, V6-11** (🟠) — UX Audits heading grammar + scope signal, service-name standardisation.
3. **V6-4, V6-5, V6-8, V6-9, V6-10** (🟡) — dedupe, audience cards, provider naming, redesign card.
4. **V6-12** — record X2 / NC8 (`/services` hub) as 🚫 won't-do.
5. Independent of v6: **NF1** (verify next-steps routing), **NF4** (soft 404), Landing Pages `model` typo.
