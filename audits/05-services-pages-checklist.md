# Services Pages Audit Checklist

This document tracks the progress of all content, copy, SEO, and conversion changes on the 4 service detail pages.
Synced to **`05-services-pages.md` v8 (2026-09-09)**, all statuses are code-verified against live source files.

**2026-09-09, v7 consolidated change list (C1–C12) applied to `data/sericesDetailsList.json`.** All C1–C12 textual/content edits are in the data file; JSON validated. The `model landing pages` → `modern` typo was also fixed in `data/sericesDetailsList.json` **and** `data/servicesTopList.json`.

**2026-09-09, v8 "What we provide" removal + render reconciliation.** The `youWillGet` block ("What we provide") duplicated the `whatYouGet` ("WHAT YOU GET") section, so it was **removed entirely**: the `youWillGet` key is deleted from all 5 entries in `data/sericesDetailsList.json`, and no component renders it. Consequences: **C6, C7, and the optional C10 "AI Agents / LLM APIs" badge are now VOID**, they only ever touched `youWillGet`. The short-lived `YouWillGet` component from the v7 render pass was deleted. The three other v7 render-pass fixes (streamlinedProcess heading, RecommendedNextSteps `href`, animation-map key) stay. Also fixed the dead SEO-footer / sitemap links to the killed Design System + `SaaS-Web-&-Mobile-Apps` slugs (`app/layout.tsx` noscript, `app/sitemap.ts`).

**Pages in scope (`/services/[id]`):**

1. UX/UI Design, slug `UX-UI-Design`
2. SaaS & AI Development, slug `SaaS-&-AI-Development`
3. Landing Pages & Business Websites, slug `Landing-Pages-&-Business-Websites`
4. UX Audits & Consultation, slug `UX-Audits-&-Consultation`

**Files in scope:**
- `data/sericesDetailsList.json`, all page content (filename misspelled `serices`, intentional, do not rename without a codemod)
- `app/services/[id]/page.tsx`, routing, metadata, JSON-LD
- `app/services/[id]/opengraph-image.tsx`, OG social card
- `screens/serviceDetails/`, section components
- `screens/serviceDetails/whatYouGetAnimations/index.tsx`, `whatYouGet` heading → animation coupling (X4)
- `config/site.ts`, `components/footer.tsx`, `screens/sitemap/index.tsx`, `app/layout.tsx` (noscript SEO footer), `app/sitemap.ts` (`SERVICE_SLUGS`), `components/Breadcrumbs.tsx`, navigation / discovery into these pages

---

## How to read this

- ✅ **Done**, verified in source code
- ❌ **Not done**, confirmed still wrong in source code
- ⚠️ **Partially done**, in progress or needs further work
- 🚫 **Won't do**, intentional decision not to change
- 🔴 **Fix now**, errors actively damaging trust/credibility or SEO
- 🟠 **Soon**, conversion and positioning improvements
- 🟡 **Consider**, polish and consistency improvements

---

## 0. CROSS-CUTTING (affects multiple / all service pages)

| # | Item | Status |
|---|------|--------|
| X1 | One service ("UX/UI Design") referenced by 3+ names and some dead slugs across cross-links | ✅ Done, (C12) badge `SAAS & AI PRODUCT DESIGN`, all cross-links use `ux-ui-design`; (v8/S4) JSON-LD `name` from a clean `SERVICE_NAME` map; (v8/S1) killed Design System entry + all its keys + `<noscript>` + sitemap slug removed |
| X2 | No `/services` hub page | 🚫 Won't do, intentional (user decision 2026-09-09). Service pages are reached via nav dropdown + cross-links only |
| X3 | Placeholder / copy-paste content left in production (`<div>danis...`, wrong-service strings) | ✅ Done, (C1, C2) UX Audits 3D heading + Design-System-Roadmap process replaced; (v8/S2) `<div>danis...</div>` → `notFound()` |
| X4 | `whatYouGet` card headings silently coupled to animation map | ✅ Done (v8/S9), map documented as load-bearing; `Full-Stack Architecture` + `AI-Generated Code, Production-Ready` mapped to `VisualCode`. Remaining SaaS/`AI & LLM`/`Cloud`/Landing cards intentionally use their `image` SVG |
| X5 | Positioning boundary between "UX/UI Design" and "SaaS & AI Development" unclear | ✅ Naming standardised (C12), badge no longer says "FRONT END DEVELOPMENT"; service is "UX/UI Design" everywhere it's cross-linked |
| X6 | `WhoThisIsFor` section heading inconsistent across services | ✅ Done (v8/C-a), all 4 pages now `Does this sound like you?` |
| X7 | Social proof (`LandingWork` gallery) is generic, not service-filtered | 🟡 Open (S10), needs per-service project/metric/testimonial selection (content + product decision) |
| X8 | No timeline / price signal on most pages | ⚠️ Partially, UX Audits carries "Most audits run 1–2 weeks" (C4). Other 3 pages still bare; price band deferred until tiers are set |
| X9 | SEO metadata keyword-stuffed / partly stale | ✅ Done (v8/C-i), 4 titles tightened + `| UI Pirate`; keyword lists trimmed; Fortune 500 fallback claim removed; Design System entry deleted |
| NF1 | `RecommendedNextSteps` buttons were undisclosed WhatsApp links | ✅ Done, `recommendedNextSteps/index.tsx` passes `href={`/services/${slug}`}`; WhatsApp only as fallback when `slug` is absent |
| NF4 | Unknown service slug returns HTTP 200 (soft 404) | ✅ Done (v8/S3), `if (!service) notFound()` in `app/services/[id]/page.tsx` |

---

## 1. UX/UI DESIGN (`UX-UI-Design`)

### 1.1 Hero
| # | Item | Status |
|---|------|--------|
| 1.1a | `hero.badge` = `SAAS & AI PRODUCT UX/UI & FRONT END DEVELOPMENT`, all-caps, 3-in-1 name | ✅ Done (C12), now `SAAS & AI PRODUCT DESIGN` |
| 1.1b | Heading + description, clear, on-message | ✅ Keep as-is |

### 1.2 WhatYouGet, "Everything You Need to Design & Build a SaaS Product"
| # | Item | Status |
|---|------|--------|
| 1.2a | Card 3 `Idea to MVP`, desc is a noun-list (`Product strategy, Product thinking, Competitive analysis`) and omits the dominant real use case (redesign of a live product) | ✅ Done (C11), replaced with `New Build or Redesign` card + sentence description |
| 1.2b | Cards 1, 2, 4 (`UX/UI Design & Prototype`, `UI Development & Integration`, `Mobile Optimization`) | ✅ Keep as-is |

**V6-10 replacement copy (apply verbatim):**
> **Heading:** New Build or Redesign
> **Description:** Whether you're going idea-to-MVP or modernising a live SaaS product that's outgrown its interface, product strategy, IA, and competitive analysis included.

### 1.3 WhyThisMatters, "Why Most SaaS & AI Products Break (And How We Fix It)"
| # | Item | Status |
|---|------|--------|
| 1.3a | 5 problem-first cards | ✅ Keep, "behaves consistent" typo fixed (v8/C-c) |

### 1.4 StreamlinedProcess, "Complete SaaS Web & Mobile App Workflow"
| # | Item | Status |
|---|------|--------|
| 1.4a | Design + Development workflow steps, accurate | ✅ Keep as-is |

### 1.5 WhoThisIsFor
| # | Item | Status |
|---|------|--------|
| 1.5a | 3 Title-case cards (SaaS & AI Startups · Enterprise Teams · Design / Dev Agencies) | ✅ Keep as-is |
| 1.5b | Section heading `Does it sound like you?` vs other pages' `Does this sound like you?` (X6) | ✅ Done (v8/C-a), now `Does this sound like you?` |

### 1.6 RecommendedNextSteps
| # | Item | Status |
|---|------|--------|
| 1.6a | Featured = Landing Pages; others = SaaS & AI Development, UX Audits, all have real slugs | ✅ Done, routes internally (NF1 fixed) |

### 1.7 Naming / SEO
| # | Item | Status |
|---|------|--------|
| 1.7a | Service called `UX/UI Design` / `UX/UI & Front End Development` / `SaaS & AI Product UX/UI...` across badge + cross-links (X1/X5/NC7) | ✅ Done (C12), `UX/UI Design` in every cross-link `title`; badge is `SAAS & AI PRODUCT DESIGN` |
| 1.7b | JSON-LD `Service.name` = raw all-caps badge (X9/NF3) | ✅ Done (v8/S4), `SERVICE_NAME` map → "UX/UI Design"; also sets `serviceType` + `description` from `SERVICE_META` |

---

## 2. SaaS & AI DEVELOPMENT (`SaaS-&-AI-Development`)

### 2.1 Hero
| # | Item | Status |
|---|------|--------|
| 2.1a | "Build the engine behind your SaaS or AI product." + description | ✅ Keep as-is (strongest hero on the services surface) |

### 2.2 WhatYouGet, "Everything You Need to Ship a Working SaaS or AI Product"
| # | Item | Status |
|---|------|--------|
| 2.2a | 4 cards (Full-Stack Architecture · AI & LLM Integration · API & Third-Party Integrations · Cloud Deployment & Scaling) | ✅ Now 5 cards, see 2.2b |
| 2.2b | No card names "AI-generated code → production", highest-intent unaddressed keyword in both Upwork scans (v5 Finding 2) | ✅ Done (C8), 5th card `AI-Generated Code, Production-Ready` appended (Lovable / Bolt / Replit / Claude Code) |
| 2.2c | `Full-Stack Architecture` + `Cloud Deployment & Scaling` descriptions are provider-generic | ✅ Done (C10), Full-Stack Architecture → "on Node.js or Python"; Cloud Deployment & Scaling → "on AWS, GCP, or Azure" |
| 2.2d | Adding a 5th card may break the heading→animation map (X4) | ✅ Checked, SaaS & AI Dev's 4 headings were never in the map; 5th card falls back to `image` like the others. Appended, not swapped |

**V6-7 new card copy (apply verbatim):**
> **Heading:** AI-Generated Code, Production-Ready
> **Description:** Built something fast with Lovable, Bolt, Replit, or Claude Code? We take it from prototype to a secure, scalable, production-grade product.

**V6-9 description rewrites:**
> Full-Stack Architecture → *Scalable backend and database architecture on Node.js or Python, built to handle real growth*
> Cloud Deployment & Scaling → *Production deployment on AWS, GCP, or Azure, CI/CD, monitoring, and infrastructure that scales with usage*

### 2.3 WhyThisMatters, "Why Most SaaS & AI Builds Stall (And How We Fix It)"
| # | Item | Status |
|---|------|--------|
| 2.3a | 5 problem-first cards, strong | ✅ Keep |
| 2.3b | Card 1 `Fragile Foundations`, doesn't name AI-tool scaffolding, though that's now the common cause | ✅ Done (C9), `QuickWins[0]` now names "often scaffolded fast by an AI tool" |

**V6-8 rewrite of `Fragile Foundations` → `QuickWins[0]`:**
> Because the architecture, often scaffolded fast by an AI tool, wasn't built to extend. We re-lay the data models and services so change is absorbed, not fought.

### 2.4 StreamlinedProcess, "Complete SaaS & AI Development Workflow"
| # | Item | Status |
|---|------|--------|
| 2.4a | Architecture + Engineering workflow steps, accurate | ✅ Keep as-is |

### 2.5 WhoThisIsFor
| # | Item | Status |
|---|------|--------|
| 2.5a | 3 cards (SaaS Founders · Teams Adding AI Features · Agencies Needing Backend Help) | ✅ Keep as-is |

### 2.6 RecommendedNextSteps / SEO
| # | Item | Status |
|---|------|--------|
| 2.6a | Featured = UX/UI Design; other = UX Audits, real slugs | ✅ Done, routes internally (NF1 fixed) |
| 2.6b | `youWillGet`, optionally add `AI Agents / LLM APIs` right badge | 🚫 Void (v8), `youWillGet` / "What we provide" section removed entirely (duplicated `whatYouGet`) |

---

## 3. LANDING PAGES & BUSINESS WEBSITES (`Landing-Pages-&-Business-Websites`)

### 3.1 Hero
| # | Item | Status |
|---|------|--------|
| 3.1a | "Your Website Isn't a Brochure, It's a Sales Tool" + description | ✅ Keep as-is |
| 3.1b | Description typo `model landing pages` (also in `data/servicesTopList.json`, NF5) | ✅ Done, `modern landing pages` + double-space removed in **both** `data/sericesDetailsList.json` and `data/servicesTopList.json` |

### 3.2 WhatYouGet, "Everything You Need to Launch and Convert"
| # | Item | Status |
|---|------|--------|
| 3.2a | 4 cards incl. `SEO Performance & AI-Readable Websites` | ✅ Keep as-is (differentiator praised in v1–v3) |
| 3.2b | Framer / Webflow named as buyer search terms (v4 D4) | ✅ Done (v8), "Design & Frontend Development" `whatYouGet` card description now reads "…builds in React, Next.js, Framer, or Webflow…". Keyword is back in visible body copy after the `youWillGet` badge removal. |

### 3.3–3.5 WhyThisMatters / StreamlinedProcess / WhoThisIsFor
| # | Item | Status |
|---|------|--------|
| 3.3a | ~~6~~ problem-first cards | ✅ Done (v8/C-f), consolidated to 4 (dropped "Messaging Drives Action" + "Users Scan"); QuickWins whitespace trimmed (C-d) |
| 3.4a | "From idea to live website" 2×3 steps, accurate | ✅ Keep, group badges ("Website Strategy & Design" / "Website Development") now visible via S7 |
| 3.5a | `whoThisIsFor` spanned SaaS → local business → portfolio | ✅ Done (v8/C-g), 3rd card retargeted to "Funded Startups & Scaleups" |
| 3.5b | "Fully Responsive Experience" filler "…without extra effort later" | ✅ Done (v8/C-e) |

### 3.6 RecommendedNextSteps / SEO
| # | Item | Status |
|---|------|--------|
| 3.6a | Featured = UX Audits; other = UX/UI (`ux-ui-front-end-development` slug) | ✅ Done (C12), `otherServices[0]` now `UX/UI Design` / slug `ux-ui-design` |

**Net: no market-demand copy changes required for this page (v7); slug + typo fixes applied.**

---

## 4. UX AUDITS & CONSULTATION (`UX-Audits-&-Consultation`)  🔴 highest-leverage page

Highest real demand in both Upwork scans **and** still carrying leftover wrong-service strings from the deleted 3D / Design-System service.

### 4.1 Hero
| # | Item | Status |
|---|------|--------|
| 4.1a | "Find What's Blocking Growth, Before You Build More" + description | ✅ Fixed since v3, keep |
| 4.1b | No timeline/scope signal for the small-fast-cheap buyer (X8, v4 D2) | ✅ Done (C4), hero `description` now ends "…Most audits run 1–2 weeks." |

### 4.2 WhatYouGet, "What All Will you get in return"
| # | Item | Status |
|---|------|--------|
| 4.2a | Heading is deliverable-first + ungrammatical | ✅ Done (C3), now `What You Get From a UX Audit` |
| 4.2b | 4 cards (Heuristic Report · Drop-Off & Friction · Flow Review · Walkthrough Video) | ✅ Fixed since v3, keep |

### 4.3 WhyThisMatters, heading references 3D
| # | Item | Status |
|---|------|--------|
| 4.3a | `heading` = `"Why Most 3D On Websites Fails "` / `heading2` = `"(And How We Do It Right)"`, leftover from deleted 3D service | ✅ Done (C1), now `Why Growth Stalls After Launch` / `(And What an Audit Uncovers)` |
| 4.3b | 5 cards underneath (Unclear First Steps · Too Many Decisions · Features Without Priority · Demo vs. Daily Use Gap · Silent Churn), on-topic | ✅ Keep as-is |

**V6-1 replacement:**
> `heading`: `Why Growth Stalls After Launch`
> `heading2`: `(And What an Audit Uncovers)`

### 4.4 StreamlinedProcess, entirely wrong content
| # | Item | Status |
|---|------|--------|
| 4.4a | `heading` = `"Design System Roadmap"`; both workflow groups badged `"Design Workflow"`; steps describe a website build (CMS, React/Next.js, SEO, domain, deploy), not an audit | ✅ Done (C2), whole block replaced: `How a UX Audit Runs`, Review Workflow (Kickoff & Context · Heuristic & Flow Review · Prioritised Findings) + Handover Workflow (Audit Report · Walkthrough Call or Video · Action Roadmap) |

**V6-2 replacement, see `05-services-pages.md` v6 §1c for the full JSON.** Summary:
> `heading`: `How a UX Audit Runs`
> Group 1 `Review Workflow`: Kickoff & Context · Heuristic & Flow Review · Prioritised Findings
> Group 2 `Handover Workflow`: Audit Report · Walkthrough Call or Video · Action Roadmap

### 4.5 WhoThisIsFor
| # | Item | Status |
|---|------|--------|
| 4.5a | Card 1 heading `Founders or startups who are just starting out`, sentence-case, long | ✅ Done (C5), now `Founders Just Getting Started` (desc kept) |
| 4.5b | Card 2 heading `anyone looking to upgrade their product experience & conversions`, lowercase | ✅ Done (C5), replaced with `Teams With an AI-Built Prototype` (Lovable / Bolt / v0 / Cursor) |
| 4.5c | Only 2 cards vs 3 elsewhere | ✅ Done (v8/C-b), 3rd card added: `Teams With Stalled Growth` |

**V6-5 replacement for card 2:**
> **Heading:** Teams With an AI-Built Prototype
> **Description:** You shipped something fast with Lovable, Bolt, v0, or Cursor and need a professional read on what's usable, what's fragile, and what to fix before you invest further.

### 4.6 youWillGet ("What we provide"), 🚫 SECTION REMOVED (v8)
| # | Item | Status |
|---|------|--------|
| 4.6a | `rightBadges` had `Prioritized Suggestions` twice | 🚫 Void, `youWillGet` deleted from all entries; it duplicated the `whatYouGet` section |
| 4.6b | `youWillGet.description` was copy-pasted from UX/UI Design | 🚫 Void, same |

### 4.7 RecommendedNextSteps / SEO
| # | Item | Status |
|---|------|--------|
| 4.7a | Featured = SaaS & AI Product UX/UI (`ux-ui-front-end-development`); others = Landing Pages, UX Audits (self-link) | ✅ Done (C12), featured now `UX/UI Design` / slug `ux-ui-design`; self-link removed, replaced by `SaaS & AI Development` / slug `saas-ai-development` |
| 4.7b | `whyThisMatters` / process copy must not reintroduce "3D" or "Design System" anywhere | ✅ Guard when editing |

---

## Sequencing (from `05-services-pages.md` v6/v7 priority table)

1. **V6-1 / C1, V6-2 / C2, V6-7 / C8** (🔴), ✅ done, UX Audits `whyThisMatters` heading, UX Audits `streamlinedProcess`, SaaS & AI Dev AI-code card.
2. **V6-3 / C3, V6-6 / C4, V6-11 / C12** (🟠), ✅ done, UX Audits heading grammar + scope signal, service-name standardisation.
3. **V6-4 / C6, V6-5 / C5, V6-8 / C9, V6-9 / C10, V6-10 / C11** (🟡), ✅ done, dedupe, audience cards, provider naming, redesign card.
4. **V6-12**, ✅ recorded X2 / NC8 (`/services` hub) as 🚫 won't-do.
5. Also done in the v7 pass: Landing Pages `model` → `modern` typo (both data files), UX Audits self-link removed.

### v7 render pass, make updated content visible (2026-09-09)

The v7 content edits landed in `data/sericesDetailsList.json` but a source read showed several fields were never rendered.

| Change | File | Status |
|---|---|---|
| `streamlinedProcess` H2 was hardcoded `"How We Work"` → now renders `data.heading` (fallback kept) | `screens/serviceDetails/streamlinedProcess/index.tsx` | ✅ Kept, surfaces **C2** and each service's real process heading |
| `RecommendedNextSteps` buttons ignored `slug` → linked to WhatsApp (**NF1**) → now `href={`/services/${slug}`}`, arrow added | `screens/serviceDetails/recommendedNextSteps/index.tsx` | ✅ Kept, makes **C12** slug standardisation functional; WhatsApp only as fallback |
| `"New Build or Redesign": Visuals.VisualMVP` added to animation map | `screens/serviceDetails/whatYouGetAnimations/index.tsx` | ✅ Kept, **C11** card keeps its visual |
| ~~New `YouWillGet` section component~~ | ~~`screens/serviceDetails/youWillGet/`~~ | 🚫 **Reverted in v8**, the section duplicated `whatYouGet`; component deleted, `youWillGet` key removed from the JSON |

### v8, "What we provide" removal + full open-items sweep (2026-09-09)

**Verified: `next build` succeeds; 4 service routes generated (`UX-UI-Design`, `SaaS-&-AI-Development`, `Landing-Pages-&-Business-Websites`, `UX-Audits-&-Consultation`), no Design System route. `tsc --noEmit` + `eslint` clean on all changed files.**

| Change | Files | Status |
|---|---|---|
| Remove the duplicate "What we provide" (`youWillGet`) section entirely | `data/sericesDetailsList.json` (key deleted from all entries), `screens/serviceDetails/index.tsx`, `screens/serviceDetails/youWillGet/` (deleted) | ✅ |
| **S1, kill the Design System service.** Removed the 5th JSON entry; removed its `SERVICE_META`, `SERVICE_OG`, and `SERVICE_LABELS` (breadcrumb) keys; removed its `<noscript>` SEO-footer link and its `app/sitemap.ts` slug | `data/sericesDetailsList.json`, `app/services/[id]/page.tsx`, `app/services/[id]/opengraph-image.tsx`, `components/Breadcrumbs.tsx`, `app/layout.tsx`, `app/sitemap.ts` | ✅ |
| **S2, `<div>danis...</div>`** → `notFound()` | `screens/serviceDetails/index.tsx` | ✅ |
| **S3, soft 404 (NF4)** → `import { notFound }` + `if (!service) notFound()` | `app/services/[id]/page.tsx` | ✅ |
| **S4, JSON-LD `Service.name`** → new `SERVICE_NAME` map (`"UX/UI Design"` etc.); also sets `serviceType` + `description` from `SERVICE_META` | `app/services/[id]/page.tsx` | ✅ |
| **S5, hero CTAs** → primary now `https://cal.com/ui-pirate/15min` (was `/contact`); secondary "See Pricing" → `/pricing` (WhatsApp block removed) | `screens/serviceDetails/hero/index.tsx` | ✅ |
| **S6, hero badge fallback** → `"50+ PRODUCTS SHIPPED ACROSS 6 COUNTRIES"` | `screens/serviceDetails/hero/index.tsx` | ✅ |
| **S7, two-phase process structure** → each `workflow` group renders as one row with its `badge` shown as a phase label ("Review Workflow" / "Handover Workflow" etc.) | `screens/serviceDetails/streamlinedProcess/index.tsx` | ✅ |
| **S8, dead `getCardRotation`** removed | `screens/serviceDetails/streamlinedProcess/index.tsx` | ✅ |
| **S9, animation map** documented (load-bearing heading strings) + `Full-Stack Architecture` / `AI-Generated Code, Production-Ready` mapped to `VisualCode` | `screens/serviceDetails/whatYouGetAnimations/index.tsx` | ✅ |
| **C-a**, `whoThisIsFor` heading standardised to `Does this sound like you?` on all 4 pages | `data/sericesDetailsList.json` | ✅ |
| **C-b**, UX Audits `whoThisIsFor` 3rd card added ("Teams With Stalled Growth"), now 3 cards like the others | `data/sericesDetailsList.json` | ✅ |
| **C-c**, "behaves consistent" → "behaves consistently." | `data/sericesDetailsList.json` | ✅ |
| **C-d**, Landing Pages `QuickWins` leading/trailing spaces trimmed; both `description2` leading spaces trimmed (Landing + UX Audits) | `data/sericesDetailsList.json` | ✅ |
| **C-e**, "…without extra effort later" cut | `data/sericesDetailsList.json` | ✅ |
| **C-f**, Landing Pages `whyThisMatters` 6 → 4 cards (dropped "Messaging Drives Action" + "Users Scan, They Don't Read"; "Clarity Beats Creativity" absorbs the scanning point) | `data/sericesDetailsList.json` | ✅ |
| **C-g**, Landing Pages `whoThisIsFor` 3rd card retargeted: "Portfolios & Personal Brand Sites" → "Funded Startups & Scaleups" (commercial audience) | `data/sericesDetailsList.json` | ✅ |
| **C-h**, UX/UI `hero.description` → "enterprise-grade" + tidied punctuation | `data/sericesDetailsList.json` | ✅ |
| **C-i**, `SERVICE_META` titles tightened + `| UI Pirate` added on all 4; keyword lists trimmed; SaaS description now names Node.js/Python/AWS/GCP/Azure + AI-code; UX Audits description reflects the audit reframe; fallback branch's "Fortune 500" claim removed | `app/services/[id]/page.tsx` | ✅ |

### Kept from the v7 render pass (independent of the `youWillGet` decision)

| Change | File |
|---|---|
| `streamlinedProcess` H2 renders `data.heading` (was hardcoded `"How We Work"`) | `screens/serviceDetails/streamlinedProcess/index.tsx` |
| `RecommendedNextSteps` buttons use `href={`/services/${slug}`}` (were WhatsApp), **NF1** | `screens/serviceDetails/recommendedNextSteps/index.tsx` |
| `"New Build or Redesign": Visuals.VisualMVP` in the animation map, **C11** | `screens/serviceDetails/whatYouGetAnimations/index.tsx` |

---

## STILL OPEN

| # | Item | Priority | Note |
|---|---|---|---|
| S10 | `LandingWork` gallery is generic on every service page, no service-specific project, result metric, or testimonial (X7) | 🟡 | Needs real project/testimonial selection per service, a product decision + content, not a mechanical fix |
| S7-b | The phase-label added in S7 sits above the decorative "rope" SVG on desktop, visually fine but not designed; a designer may want to reposition it | 🟡 | Cosmetic |
| n/a | JSON-LD `areaServed` on service pages (`US, UK, SG, IN, AU`) still differs from `/about`'s Organization schema (`US, IN, FR, CA, UK, SG`), cross-audit item, tracked in `04-about-page.md` NF3 | 🟡 | Out of services scope |
| n/a | Hero primary CTA label still reads "Start Your Product Journey, Book a 15-Min Call", fine, but if a shorter label is wanted it's hardcoded in `hero/index.tsx` | 🟡 | Cosmetic |

### Won't-do (recorded)

- **X2 / `/services` hub page**, 🚫 intentional (user decision 2026-09-09). Reached via nav dropdown + cross-links only.
