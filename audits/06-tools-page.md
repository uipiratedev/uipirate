# Free Tools Hub — Content Audit — UI Pirate

**Page:** `/tools` (labeled "Free Tools" in the Resources nav dropdown)
**Files in scope:**
- `app/tools/page.tsx` (the hub page — client component)
- `components/SuggestedTools.tsx` → `ALL_TOOLS_REGISTRY` (the data behind every card)
- `app/sitemap.ts` (tool URLs submitted to search)
- Sub-hub pages `/tools/ai`, `/tools/website`, `/tools/saas`, `/tools/design` (referenced, not deep-audited here)

**Focus:** Copy, messaging, positioning, structural decisions, internal linking, and SEO
**Research basis:** Apple HIG, Google Material UX Writing, Nielsen Norman Group, Copyhackers JTBD, E-E-A-T + thin-content / doorway-page guidance, CRO research, programmatic-SEO / free-tool lead-gen playbooks (Ahrefs, HubSpot, Zapier free-tool hubs), and GEO (generative engine optimization) guidance (full principle set in the Research Foundation section below)
**Last audited:** 2026-08-27
**Note:** This page is new — there is no v1. This is the first audit. It covers the **hub page only**, not the individual tools inside it (those get their own audit later).

---

## Research Foundation

Every recommendation in this document is grounded in the same cross-source principle set used for the landing, pricing, and about page audits, plus sources specific to free-tool lead-gen hubs and generative-engine optimization. Nothing below is opinion — each finding traces back to one or more of these.

### What the research consistently says

**Apple Human Interface Guidelines** — Every word should earn its place and labels must be consistent. "Engine" used three ways on one page (preview engines, the tools, roadmaps), plus "diagnostics", "operational", "verticals", is decoration, not communication. Say "tools".

**Google Material UX Writing** — Plain language over insider framing. A visitor searching "check my landing page" does not call it "conversion architecture" or organize their problem by the agency's "core verticals". Write for the visitor's vocabulary, not the org chart.

**Nielsen Norman Group (NN/g)** — Scanners decide fast whether a page delivers. A tool hub is judged on: can I tell what's here, is it actually usable, and can I get value without friction. The most important content (working tools) must be near the top, not the fifth section down.

**Copyhackers / Jobs-to-be-Done** — Visitors come to a free tool to make progress on a problem (leaky onboarding, invisible to AI search, failing contrast). Organize and label by the job, not by the agency's service pillars. The bridge-to-agency CTA should connect to the job the visitor just did, not assume an audit they couldn't run.

**E-E-A-T + thin-content / doorway-page guidance** — Google's quality framework plus its guidance on thin and doorway pages: 17 near-empty "Coming Soon" pages, each indexable and in the sitemap at priority ~0.85, is a low-quality-cluster signal that can drag down the pages that are genuinely useful. Pages should have real value before they're submitted for indexing. Claims ("built by senior design engineers", "100% free", any usage number) must be accurate and, ideally, verifiable.

**Programmatic-SEO / free-tool lead-gen playbooks (Ahrefs, HubSpot, Zapier free-tool hubs)** — A tool hub that converts: leads with working tools, shows traction/social proof, answers "is it really free / do I need an account / what happens to my data" in a short FAQ, and is interlinked with the money pages (service and pricing pages link to the relevant tool; each tool links back to the matching service).

**GEO (Generative Engine Optimization)** — To be cited by ChatGPT, Perplexity, and Gemini, a page needs explicit, itemized, machine-readable structure: clean metadata, `ItemList` / `WebApplication` / `FAQPage` JSON-LD, and unambiguous named entities. A client-rendered hub with no `metadata` export and no structured data is close to invisible to the exact engines half of these tools are about.

### How this audit applies the foundation

| Principle | Where it drives a finding in this document |
|---|---|
| Apple HIG — consistent labels | "engines / diagnostics / operational / verticals" jargon (§6, §7, §5) |
| Material — visitor's vocabulary | "conversion architecture", "Explore Tools by Agency Pillar" (§1c, §4) |
| NN/g — most valuable content first | Live tools are the 5th section down (§5, §3) |
| Copyhackers / JTBD | Organize by problem not "agency pillar"; bridge banner assumes an audit (§4, §8) |
| E-E-A-T / thin content | 17 "Coming Soon" pages in the grid + sitemap (§2, §7, S3); "senior design engineers" positioning (§1c) |
| Free-tool lead-gen playbooks | Missing social proof, FAQ, and cross-links (M1, M2, M4) |
| GEO | No `metadata` export (S1), no JSON-LD (S2) |

---

## What This Page Is For

`/tools` is a free-tool hub: a set of small audit/generator utilities (UX scores, contrast checkers, `robots.txt`/`llms.txt` generators, token studios) meant to pull in SaaS/AI/product-team visitors from search and generative engines, demonstrate the agency's expertise, and hand them to `/contact`. It is a **top-of-funnel SEO/GEO asset**, and it should be judged as one: does it rank, does it deliver value on arrival, and does it route qualified visitors to the agency.

On all three counts it currently underperforms, mostly because of one number (below) and one missing export (metadata).

---

## Current Page Structure

```
1.  Hero (badge, H1, subheadline)
2.  Search input (filters all tools live)
3.  Category tabs (All / AI & GEO / Website & Conversion / SaaS & Product UX / Design Systems & Code) with live counts
4.  "Explore Tools by Agency Pillar" — 4 category pillar cards (link to sub-hubs)
5.  "Live & Operational Tools" — cards where badge = Live or Popular
6.  "Interactive Preview Engines" — cards where badge = Preview Available
7.  "Upcoming Tools & Diagnostic Roadmaps" — cards where badge = Coming Soon
8.  "Agency Bridge Banner" — "Need a Custom Product Audit?" → Book a 1-on-1 UX Consultation (/contact)
```

**The registry holds 28 tools. By badge:**

| Badge | Count | What the user actually gets |
|---|---|---|
| Live | 6 | A working tool |
| Popular | 1 | A working tool |
| Preview Available | 4 | A partial / demo interface |
| **Coming Soon** | **17** | **A page that says it's not built yet** |

**≈ 75% of the cards on this page lead to nothing usable.** This is the single biggest issue and it colors everything else — see H1 below.

---

## Section-by-Section Audit

---

### 1. HERO

**File:** `app/tools/page.tsx` (lines ~56–74)

---

#### 1a. Badge

**Current:** `TOOLS & DIAGNOSTICS`

**Assessment:** 🟡 Functional but flat. "Diagnostics" is slightly clinical. Not worth a fight — but `FREE PRODUCT & GEO TOOLS` would say what's here and that it costs nothing (the #1 thing a free-tool visitor wants confirmed).

---

#### 1b. Headline (H1)

**Current:**
```
Free tools for SaaS, AI & Product Teams
```
("SaaS, AI & Product Teams" in brand orange)

**Assessment:** ✅ The framing is right — "free", named audience, plural (a suite, not one tool). Two problems:

| Problem | Why it matters |
|---|---|
| Lowercase "Free tools" while the rest of the site uses Title Case H1s | Minor visual inconsistency with landing/about/pricing |
| The H1 promises "tools" (plural, present tense) but the page delivers **7 working tools and 21 that don't exist yet** | A visitor who scrolls past the two green "Live" rows into 17 "Coming Soon" cards learns the page over-promised. That's a trust hit on a page whose entire job is a first impression |

**The fix is not copy — it's the ratio.** Options, in order of preference:
1. **Hide "Coming Soon" tools from the hub entirely** until they're at least "Preview Available". Keep their landing pages if they rank, but don't pad the hub with them. A hub of 11 real/near-real tools reads as strong; a hub of 28 where 17 are vapor reads as thin.
2. If they must stay, collapse all 17 into a single "On the roadmap" list (text links, no big cards, below the fold) instead of three full card rows.
3. Change the H1 to set the honest expectation: `Free UX, conversion & AI-visibility tools — with more shipping every month.`

---

#### 1c. Subheadline

**Current:**
```
Audit, score, and optimize your product UX, conversion architecture, and AI bot
visibility — 100% free and built by senior design engineers.
```

**What's wrong:**

| Problem | Why it matters |
|---|---|
| "conversion architecture" | Jargon. A founder searching "check my landing page" doesn't call it that. Say "your landing pages" or "how well your site converts" |
| "built by senior design engineers" | Inconsistent with the positioning used everywhere else on the site ("product design & development agency", "product partner"). "Design engineers" is an internal role label. Say "built by the team at UI Pirate" and let the agency name carry the credibility |
| "100% free" | ✅ Keep this — it's the most important two words in the sentence |

**Suggested rewrite:**
```
Audit and score your product UX, your landing pages, and how visible you are to
AI search — free, no signup, built by the team at UI Pirate.
```
("no signup" is a strong differentiator for free-tool hubs if it's true — confirm before using.)

---

### 2. SEARCH INPUT

**File:** `app/tools/page.tsx` (lines ~78–103)

**Current placeholder:**
```
Search across all tools (e.g. AI bot, SaaS UX, Pricing, Onboarding, Typography,
Breakpoints, robots.txt)...
```

**Assessment:**
- 🟡 Placeholder is doing too much — 7 examples is a wall of text inside the field. Trim to 2–3: `Search tools — e.g. "contrast", "robots.txt", "landing page"`.
- 🟠 **Accessibility:** the input has no associated `<label>` (visible or `aria-label`). Add one.
- 🟡 Search matches against `title`, `description`, `categoryLabel` — fine — but there are no `keywords`/synonyms, so "a11y" won't find "contrast checker" and "SEO" won't find "homepage metadata". Add a hidden `keywords` array per tool in the registry.

---

### 3. CATEGORY TABS

**File:** `app/tools/page.tsx` (lines ~106–160)

**Current:** All Tools · AI & GEO Visibility · Website & Conversion · SaaS & Product UX · Design Systems & Code, each with a live count badge.

**Assessment:** ✅ Good pattern — clear labels, live counts, keyboard-focusable buttons. Two notes:
- 🟡 The counts include "Coming Soon" tools, so "Design Systems & Code — 10 Tools" is really "1 working + 9 planned". If the roadmap tools stay on the page, show `2 live · 8 soon` rather than a single inflated number.
- 🟡 Tabs and the "pillar cards" (Section 4) below are the **same four categories** shown twice, back to back. Pick one navigation model — the tabs filter in place, the pillar cards navigate away to sub-hubs. Having both is redundant and pushes the actual tools further down.

---

### 4. "EXPLORE TOOLS BY AGENCY PILLAR"

**File:** `app/tools/page.tsx` (lines ~163–231)

**Current heading:**
```
EXPLORE TOOLS BY AGENCY PILLAR          4 Core Verticals
```

**Card copy (badges):** `Check · Generate · Research` · `Commercial CRO` · `Core Expertise` · `Foundations & Code`

**What's wrong:**

| Problem | Why it matters |
|---|---|
| "Agency Pillar" / "4 Core Verticals" | Internal strategy language leaking onto a user-facing page. A visitor doesn't organize their problem by the agency's service pillars — they think "my onboarding is leaky" or "does ChatGPT know my product exists" |
| "Core Expertise", "Commercial CRO" as card badges | These describe the *agency*, not the tools. On a tool card the badge should describe what the tools do |
| Section duplicates the tab bar directly above it | See 3 above |

**Suggested heading:** `Browse by what you're trying to fix`

**Suggested card badges** (describe the tools, not the agency):
- AI & GEO Visibility → `Check & generate`
- Website & Conversion → `Score & audit`
- SaaS & Product UX → `Audit & benchmark`
- Design Systems & Code → `Generate & convert`

---

### 5. "LIVE & OPERATIONAL TOOLS"

**File:** `app/tools/page.tsx` (lines ~233–282)

**Current heading:** `LIVE & OPERATIONAL TOOLS (7)` with a pulsing green dot.

**Assessment:**
- 🟡 "Operational" is redundant with "Live" and sounds like server status. Just `Live Tools` or `Ready to Use`.
- ✅ The card design is right: icon, title, one-line description, category label, CTA. Keep.
- 🟠 This is the **most valuable section on the page** and it's the 5th thing down, below a hero, a search bar, a tab row, and a duplicate category grid. Move the working tools up — ideally the Live grid starts within the first scroll.
- 🟡 The 7 live tools are all `ai-geo` category (`llms.txt`, `robots.txt` generator/validator, schema studio, batch checker, bot directory, AI crawler hub). So the "Live" section is entirely GEO tooling. That's fine as a strength — but the H1 promises "product UX" and "conversion" tools too, and **none of those are live**. Either lead with the GEO angle honestly, or get one UX/conversion tool to Live status before promoting the hub.

---

### 6. "INTERACTIVE PREVIEW ENGINES"

**File:** `app/tools/page.tsx` (lines ~284–332)

**Current heading:** `INTERACTIVE PREVIEW ENGINES (4)` + pill: `⚡ Active Development · Test Preview Engines Below`

**Card CTA:** `Try Interactive Preview`

**What's wrong:**

| Problem | Why it matters |
|---|---|
| "Preview Engines", "Diagnostic Roadmaps" (next section) | "Engine" is used three ways on this page (preview engines, the tools themselves, roadmaps). It's filler. Call them "tools" |
| "Preview Available" / "Try Interactive Preview" | Ambiguous — the visitor can't tell if they'll get a working result or a mockup. If it's partial, say what works: `Try it — scoring is live, PDF export coming` |
| ⚡ emoji in a section header | Inconsistent with the professional register of landing/about/pricing (those audits flagged emoji in B2B context) |

**Assessment:** The concept — ship a partial tool and label it honestly — is reasonable. The labels just need to tell the truth precisely.

---

### 7. "UPCOMING TOOLS & DIAGNOSTIC ROADMAPS"

**File:** `app/tools/page.tsx` (lines ~334–382)

**Current heading:** `UPCOMING TOOLS & DIAGNOSTIC ROADMAPS (17)` + pill: `📋 Detailed Specs & Landing Pages Live`

**This is the core structural problem. 17 full-size cards, each linking to a page that says "coming soon".**

| Problem | Why it matters |
|---|---|
| 17 non-functional cards outnumber the 11 real ones ~1.6 : 1 | The page feels like a promise, not a product |
| Each has its own indexable landing page ("Landing Pages Live") | 17 thin "coming soon" pages is a classic **doorway/thin-content** pattern. Google may see the whole `/tools` subtree as low quality, dragging down the 7 pages that *are* good. This actively works against the SEO goal of the hub |
| "Diagnostic Roadmaps" | Nobody searches for a roadmap. If the pages exist to rank, they need real content (a checklist, a manual how-to, a framework) — not a spec sheet for an unbuilt tool |
| 📋 emoji in header | Same register issue as 6 |

**Recommendation:**
1. Remove "Coming Soon" tools from the hub grid. Replace all three roadmap rows with one short block: *"More on the way — [Onboarding Analyzer], [CTA Analyzer], [Contrast Checker], … Want one sooner? [Tell us]."* (text links).
2. For any roadmap page that already ranks or gets traffic, replace the "coming soon" body with a genuinely useful manual version of that audit (a scored checklist the reader can self-apply). Then it earns its index slot and can convert.
3. Pull the "Coming Soon" URLs from `sitemap.ts` until they have real content — you're currently asking Google to crawl 17 placeholder pages at priority 0.85.

---

### 8. AGENCY BRIDGE BANNER

**File:** `app/tools/page.tsx` (lines ~384–406)

**Current:**
```
Badge: Need a Custom Product Audit?
H3:    Turn audit findings into a high-converting product.
Sub:   UI Pirate is a product design & full-stack development agency specializing
       in complex SaaS platforms, AI interfaces, and high-velocity landing pages.
CTA:   Book a 1-on-1 UX Consultation → /contact
```

**Assessment:** ✅ Right idea, right placement (end of page, after the visitor has seen the expertise). Fixes:

| Problem | Fix |
|---|---|
| "high-velocity landing pages" — jargon | "fast, high-converting landing pages" |
| "Turn audit findings into a high-converting product" assumes the visitor ran an audit that produced findings — but most of the audit tools aren't live | Tie it to what they *can* do here: "Ran one of our tools and want a human to go deeper? That's what we do." |
| CTA "Book a 1-on-1 UX Consultation" vs the rest of the site's "Book a Free 15-Min Call" / cal.com | Standardize the primary CTA wording and destination across the site. The other audits landed on "Book a Free Call" → cal.com |
| No trust signal in the banner | Add one line: "9+ years, 50+ products shipped" or a Clutch mention — consistent with about/pricing |

---

## SEO / GEO Issues (page-level)

This page's whole purpose is discovery, so these rank alongside the copy issues.

---

### S1. The hub is a client component with no metadata 🔴

`app/tools/page.tsx` starts with `"use client"` and there is **no `app/tools/layout.tsx`** and **no `metadata` export**. So `/tools` — the flagship of the entire tools strategy — inherits the root layout's generic homepage title, description, and Open Graph. Google and social/LLM previews get "UI Pirate" boilerplate instead of anything about free tools.

**Fix:** Add `app/tools/layout.tsx` (server component) exporting `metadata`:
- **Title:** `Free UX, Conversion & AI-Visibility Tools | UI Pirate`
- **Description:** `Free tools to audit your product UX, score your landing pages, and check how visible you are to AI search engines. No signup. Built by UI Pirate.`
- Open Graph image, canonical `https://uipirate.com/tools`.

Do the same check on `/tools/ai`, `/tools/website`, `/tools/saas`, `/tools/design` — if they're also client components, they're also inheriting root metadata.

---

### S2. No structured data 🟠

A tool hub is an ideal `ItemList` (of `SoftwareApplication` / `WebApplication` entries, each `offers` → price 0). There's no JSON-LD on the page. Adding it:
- Helps Google understand this is a suite of free utilities
- Is exactly the kind of explicit, itemized data that generative engines (the thing half these tools are *about*) prefer to cite

Add an `ItemList` + per-tool `WebApplication` schema, and a `FAQPage` block if you add the FAQ recommended below.

---

### S3. 17 thin "Coming Soon" pages in the sitemap 🟠

Covered in Section 7. `sitemap.ts` submits ~28 tool detail URLs at priority 0.85–0.9, but only ~7 have working content. Trim the sitemap to live + preview tools until the rest have real content.

---

### S4. Registry / route mismatches — orphan and duplicate pages 🟡

Pages exist on disk that the registry doesn't point to (or points to a different slug):

| On disk | In `ALL_TOOLS_REGISTRY` | Issue |
|---|---|---|
| `app/tools/design/type-scale-generator/` **and** `.../typography-scale-generator/` | registry → `typography-scale-generator` | Two type-scale pages; one is orphaned |
| `app/tools/design/8pt-grid-calculator/` | registry → `figma-spacing-calculator` (titled "8pt Grid & Figma Spacing Calculator") | Two spacing pages; slug mismatch |
| `app/tools/ai/geo-visibility-checker/` | registry → `geo-competitor-checker` only | `geo-visibility-checker` is orphaned (not linked from the hub) |
| `app/tools/website/ux-audit/` | not in registry | In `sitemap.ts` but not linked from the hub |

**Fix:** Reconcile the registry, the folders, and `sitemap.ts` to one canonical slug per tool. Delete or redirect the orphans.

---

### S5. Filter logic bug (minor) 🟡

`upcomingTools` filter: `t.badge === "Coming Soon" || (!t.badge && t.badge !== "Live")`. The second clause is redundant (`!t.badge` already implies `t.badge !== "Live"`). Harmless today because every entry has a badge, but it'll silently bucket any future badge-less tool into "Upcoming". Simplify to `t.badge === "Coming Soon"`.

---

## Missing Sections

Things a high-performing free-tool hub has that this page doesn't:

### M1. Social proof / usage signal
No "used by 3,000+ teams", no logos, no "X audits run this month", no testimonial. Free-tool hubs that convert almost always show traction. Even a modest real number helps.

### M2. A short FAQ
3–5 Q&As: *Are these really free? · Do I need an account? · What do you do with my data / the URL I submit? · How accurate is the score? · Can I get a human to review it?* This answers real hesitation, feeds a `FAQPage` schema, and adds legitimate indexable text to a page that is otherwise mostly card grids.

### M3. "How to use this" / value framing
One or two sentences on *when* to reach for these (before a redesign, before a funding round, after a traffic drop). Right now the page assumes the visitor already knows why they'd run a UX score.

### M4. Contextual links from the money pages
The service pages (`04`/`05` audits) and pricing page don't link into relevant tools, and the tools don't deep-link back to the matching service. e.g. the "Landing Page Analyzer" should link to the Landing Pages service; the SaaS service page should link to the "SaaS UX Audit" tool. This internal linking is free SEO equity and a natural funnel path.

---

## Priority Fix Table

| # | Section | Issue | Priority |
|---|---------|--------|----------|
| 1 | Metadata | `/tools` is a client component with no `metadata` export — the flagship SEO page inherits generic homepage meta | 🔴 Fix now |
| 2 | Structure | 17 of 28 cards are "Coming Soon" — hide them from the hub or collapse to a one-line roadmap list | 🔴 Fix now |
| 3 | Sitemap | 17 thin "Coming Soon" pages submitted at priority ~0.85 — thin-content risk to the whole `/tools` subtree | 🔴 Fix now |
| 4 | Hero | H1 promises "tools" but page is ~75% vapor — fix the ratio or reset the expectation in copy | 🔴 Fix now |
| 5 | Hero sub | "conversion architecture" / "senior design engineers" — jargon + off-positioning | 🟠 Soon |
| 6 | Pillar grid | "Explore Tools by Agency Pillar" / "4 Core Verticals" — internal language on a user-facing page | 🟠 Soon |
| 7 | Structure | Category tabs and pillar cards are the same 4 categories shown twice, back to back | 🟠 Soon |
| 8 | Live section | Most valuable section is 5th down — move working tools near the top | 🟠 Soon |
| 9 | SEO | No JSON-LD — add `ItemList` + `WebApplication` (+ `FAQPage`) | 🟠 Soon |
| 10 | Routes | Orphan/duplicate tool pages vs registry (type-scale ×2, 8pt ×2, geo-visibility, website/ux-audit) | 🟠 Soon |
| 11 | Sections | "Preview Engines" / "Diagnostic Roadmaps" / "Operational" — jargon; call them tools and say what works | 🟠 Soon |
| 12 | Banner | "high-velocity landing pages"; CTA wording/destination differs from rest of site; no trust line | 🟠 Soon |
| 13 | Page | No social proof / usage signal anywhere | 🟠 Soon |
| 14 | Page | No FAQ (hesitation-answering + schema + indexable text) | 🟠 Soon |
| 15 | Linking | Service & pricing pages don't link to tools; tools don't link back to services | 🟡 Consider |
| 16 | Search | No `<label>`/`aria-label`; placeholder too long; no synonym matching | 🟡 Consider |
| 17 | Tabs | Category counts include unbuilt tools — show `live · soon` split | 🟡 Consider |
| 18 | Sections | ⚡ / 📋 emoji in section headers — register inconsistency with other pages | 🟡 Consider |
| 19 | Code | `upcomingTools` filter has a redundant/foot-gun second clause | 🟡 Consider |
| 20 | Hero badge | "TOOLS & DIAGNOSTICS" — flat; consider naming "free" and the GEO angle | 🟡 Consider |

**Priority key:**
- 🔴 **Fix now** — Actively hurts SEO performance or credibility on a page whose only job is first impressions + discovery
- 🟠 **Soon** — Copy quality, positioning, and structure issues with measurable impact on trust and conversion
- 🟡 **Consider** — Polish, accessibility, and consistency improvements

---

## What's Working Well

1. **The core idea is right.** A free-tool hub aimed at SaaS/AI/product teams, with a GEO angle nobody else in the agency space is really pushing, is a strong top-of-funnel bet.
2. **The 7 live GEO tools are a genuine asset** — `llms.txt` generator, `robots.txt` generator/validator, schema studio, AI crawler directory. These are real, useful, and on-trend. Lead with them.
3. **Card design** — icon, title, one-line description, category label, directional CTA — is clean and scannable. Keep it.
4. **Live search + category filtering** is the right interaction model for a hub this size.
5. **The agency bridge banner** is correctly placed and correctly conceived — show value first, then offer the human. It just needs copy cleanup and a trust line.
6. **Honest badging** (Live / Preview / Coming Soon) is a good instinct — the problem is the *quantity* of "Coming Soon", not the honesty of labeling it.

---

## Copy Tone Reference

| ✅ Do | ❌ Avoid |
|---|---|
| "your landing pages", "how visible you are to AI search" | "conversion architecture", "GEO visibility surface" |
| "tools" | "engines", "diagnostic roadmaps", "operational suite" |
| "built by the team at UI Pirate" | "built by senior design engineers" |
| Ship 8 real tools, list the rest as a roadmap line | 28 cards where 17 go nowhere |
| "free — no signup" (if true) | "100% free" buried after jargon |
| Organize by the visitor's problem | Organize by "agency pillar" / "core vertical" |
| Plain section labels + a green/amber status dot | ⚡ and 📋 emoji in headers |

---

*Related audits: `01-landing-page.md` · `02-target-audience-audit.md` · `03-pricing-page.md` · `04-about-page.md` · `05-services-pages.md`*

---
---

# v3 Audit Update — Free Tools Hub
**Audited:** 2026-08-31
**Audit basis:** Direct source-code inspection of `app/tools/page.tsx` (410 lines), `components/SuggestedTools.tsx` → `ALL_TOOLS_REGISTRY` (28 entries), `components/UpcomingToolLandingPage.tsx` (241 lines), `app/tools/{ai,website,saas,design}/page.tsx`, sample tool pages, `app/sitemap.ts`, `config/site.ts` + SEO Content skill (E-E-A-T, thin/doorway-content guidance, AI Citation Readiness, GEO, free-tool lead-gen playbooks)
**Scope:** Hub page copy, content, structure, internal linking, SEO/GEO metadata and JSON-LD only. Individual tool UIs not evaluated.

---

## What Actually Changed Since v2 (Code-Verified)

Every v2 finding (§1–§8, S1–S5, M1–M4) re-checked against the live source on 2026-08-31.

| Item | v2 Status | v3 Code Reality |
|---|---|---|
| **Badge ratio** — 17 of 28 cards are "Coming Soon" | 🔴 | ❌ **Identical.** `ALL_TOOLS_REGISTRY` still holds exactly 6 `Live` + 1 `Popular` + 4 `Preview Available` + **17 `Coming Soon`** = 28. Not one tool has changed badge. |
| **§1a** badge `TOOLS & DIAGNOSTICS` | 🟡 | ❌ Unchanged — `app/tools/page.tsx` L65 |
| **§1b** H1 lowercase `Free tools for…`; promises plural working tools | 🔴 | ❌ Unchanged — L69 |
| **§1c** subheadline `conversion architecture` + `built by senior design engineers` | 🟠 | ❌ Unchanged — L72. **And now propagated:** `components/UpcomingToolLandingPage.tsx` L118 repeats `Our product design engineers provide tailored manual audits…` on all 17 upcoming pages. |
| **§2** search placeholder — 7 examples; no `<label>`/`aria-label` | 🟠/🟡 | ❌ Unchanged — L83 (placeholder), L79-85 (bare `<input>`, still no label) |
| **§3** tab counts include unbuilt tools; tabs duplicate the pillar grid | 🟡 | ❌ Unchanged — L106-160 tabs render `${…length} Tools`; pillar grid L163-231 repeats the same 4 categories |
| **§4** `Explore Tools by Agency Pillar` / `4 Core Verticals`; badges `Commercial CRO`, `Core Expertise`, `Foundations & Code` | 🟠 | ❌ Unchanged — L167, L169, L186, L194, L202 |
| **§5** `Live & Operational Tools`; most valuable section is 5th down | 🟠 | ❌ Unchanged — L239. Live grid still renders after hero + search + tabs + pillar grid. All 7 live/popular tools are still `ai-geo` category only. |
| **§6** `Interactive Preview Engines`; `⚡ Active Development · Test Preview Engines Below` | 🟠 | ❌ Unchanged — L291, L295 |
| **§7** `Upcoming Tools & Diagnostic Roadmaps (17)`; `📋 Detailed Specs & Landing Pages Live` | 🔴 | ❌ Unchanged — L341, L345. Still 17 full-size cards linking to non-functional pages. |
| **§8** banner: `high-velocity landing pages`; CTA `Book a 1-on-1 UX Consultation` → `/contact`; no trust line | 🟠 | ❌ Unchanged — L391-401. CTA still `/contact`, not `cal.com/ui-pirate/15min`. |
| **S1** hub is a client component with no `metadata` | 🔴 | 🟡 **Partially fixed.** `/tools/ai`, `/tools/website`, `/tools/saas`, `/tools/design` are now **server components with full `metadata` exports** and inline `ItemList`-style JSON-LD. **But `app/tools/page.tsx` itself is still `"use client"` with no `app/tools/layout.tsx` and no `metadata` export.** The flagship hub still inherits root metadata — see NF2. |
| **S2** no structured data | 🟠 | 🟡 **Partially fixed at tool level.** `WebApplication` JSON-LD now on `design-tokens`, `landing-page-analyzer`, `ai-bot-checker`, `saas-ux-audit`, etc.; `UpcomingToolLandingPage` emits `FAQPage` JSON-LD. **The `/tools` hub still has zero JSON-LD** — no `ItemList` binding the suite together. |
| **S3** 17 thin "Coming Soon" pages in the sitemap at ~0.85 | 🟠 | ❌ **Not fixed — and priority went the wrong way.** `app/sitemap.ts` still submits ~28 tool detail URLs at 0.85–0.9, including all 17 non-functional ones. `/tools` itself was **raised to `priority: 0.95`** (L53) — now higher than most money pages, on the page with no metadata. Plus a new dynamic set: `/tools/ai/bot-directory/${bot.id}` (L145). |
| **S4** orphan/duplicate tool pages vs registry | 🟡 | ❌ **Not fixed.** All still on disk: `design/type-scale-generator` **and** `design/typography-scale-generator` (registry → the latter); `design/8pt-grid-calculator` **and** `design/figma-spacing-calculator` (registry → the latter); `ai/geo-visibility-checker` (registry → `geo-competitor-checker` only; also absent from sitemap); `website/ux-audit` (in `sitemap.ts` L74, **not** in the registry). See NF6. |
| **S5** `upcomingTools` filter foot-gun | 🟡 | ❌ Unchanged — L34-36: `t.badge === "Coming Soon" || (!t.badge && t.badge !== "Live")` |
| **M1** no social proof / usage signal | 🟠 | ❌ Not added |
| **M2** no FAQ on the hub | 🟠 | ❌ Not added to the hub (the 17 *upcoming* sub-pages now have FAQs + `FAQPage` schema — the hub itself still has none) |
| **M3** no "when to use this" framing | 🟠 | ❌ Not added |
| **M4** money pages don't link to tools; tools don't link back to services | 🟡 | ❌ Not verified changed — service pages (see `05` v3) still show no tool links; hub banner still points at `/contact` generically |

**Summary:** the sub-hub pages (`/tools/ai` etc.) got real metadata and JSON-LD, the individual "Coming Soon" pages became templated landing pages with FAQ schema, and some live tools got `WebApplication` markup. **The hub page `app/tools/page.tsx` is byte-for-byte unchanged since v2** — every copy, structure, ratio, and CTA finding stands. Six new findings below.

---

## New Findings (v3 — Not in v1/v2)

### NF1. The 17 "Coming Soon" pages are now templated landing pages — better than v2 assumed, but a doorway-cluster risk remains 🟠

**Confirmed in:** `components/UpcomingToolLandingPage.tsx` (241 lines) + e.g. `app/tools/design/contrast-checker/page.tsx` (68-line spec).

Each upcoming tool now renders through one shared `UpcomingToolLandingPage` component fed a `UpcomingToolSpec`: unique `title`/`description`/`canonical` metadata, `badgeText: "Upcoming Tool · In Development"`, ~6 `keyMetrics` (each with a name + description), process `steps`, an agency CTA block, and `faqs` that emit `FAQPage` JSON-LD.

**This is a real improvement over v2's "a page that says it's not built yet."** But the SEO risk is not gone, it's changed shape:

- ~17–20 URLs share **one layout, one CTA target (`/contact` via `agencyLink`), and one value proposition** ("our product design engineers provide tailored manual audits", L118), differing only in the metric/FAQ strings. That is close to the definition Google gives for a **doorway cluster** — many similar pages created to funnel users to one destination.
- None contains a **working tool or a usable manual version** (a scored checklist the reader can self-apply). v2's §7 recommendation #2 — "replace the coming-soon body with a genuinely useful manual version of that audit" — is still the right fix; the templated spec page is not it.
- They still all sit in the sitemap at 0.85 (S3).

**Fix (unchanged from v2 §7):** remove them from the hub grid; keep only the pages that either (a) have a working/preview tool or (b) have been rewritten into a genuinely useful manual audit. Trim the rest from `sitemap.ts` until then.

---

### NF2. `/tools` is now the *only* page in the `/tools` subtree with no metadata 🔴

**Confirmed in:** `app/tools/page.tsx` L1 (`"use client"`), no `app/tools/layout.tsx`, no `metadata` export — while `app/tools/ai/page.tsx` L4-6, `app/tools/website/page.tsx`, `app/tools/saas/page.tsx`, `app/tools/design/page.tsx`, and every individual tool page **do** export `metadata`.

The hub — the page the nav links to as "Free Tools", the page that should rank for `free UX tools` / `free SaaS tools` / `AI visibility checker` — inherits the root layout's homepage title, description, and OG. Every page it links *to* is correctly optimised; the front door is not.

**Fix (unchanged from v2 S1):** add `app/tools/layout.tsx` as a server component exporting `metadata` (title `Free UX, Conversion & AI-Visibility Tools | UI Pirate`; description per S1; canonical `https://uipirate.com/tools`; OG image). The page can stay a client component — the layout carries the metadata.

---

### NF3. Sitemap priority is inverted against quality 🟠

**Confirmed in:** `app/sitemap.ts` L53 — `/tools` at `priority: 0.95`.

`/tools` has no metadata, no JSON-LD, and a card grid that is ~60% non-functional, yet it now carries a higher sitemap priority than it did in v2 (was ~0.85–0.9) and higher than most conversion pages. Priority is a relative hint to Google about which URLs matter most; pointing it at an unoptimised, partly-empty page spends that signal poorly.

**Fix:** drop `/tools` to `0.8` until it has metadata + an `ItemList` + a live-tool-first layout; keep the 7 genuinely-live tool pages at `0.8–0.85`; drop every `Coming Soon` URL to `0.3` or remove it from the sitemap entirely.

---

### NF4. New indexable page class since v2 — `/tools/ai/bot-directory/[id]` 🟡

**Confirmed in:** `app/tools/ai/bot-directory/[id]/page.tsx` + `app/sitemap.ts` L145 (`url: \`${BASE_URL}/tools/ai/bot-directory/${bot.id}\``).

A per-bot dynamic route now generates one indexable URL per crawler in the directory. This can be a genuine GEO asset (a citable reference page per bot) **or** another thin cluster, depending on how much unique content each `[id]` page renders. Not assessed in this pass — flag for the individual-tools audit: confirm each bot page has substantive, non-duplicated content before leaving them in the sitemap.

---

### NF5. Tool-level `WebApplication` schema has no price/offer, and nothing ties the suite together 🟠

**Confirmed in:** e.g. `app/tools/design/design-tokens/page.tsx` L23 (`"@type": "WebApplication"`), `app/tools/website/landing-page-analyzer/page.tsx` L23, `app/tools/ai/ai-bot-checker/page.tsx` L23.

The live/preview tool pages now carry `WebApplication` JSON-LD — good — but (a) none includes an `offers` node with `price: "0"` / `priceCurrency`, which is the property that lets Google and AI engines state "free", and (b) the hub has no `ItemList` referencing them, so there is no machine-readable "UI Pirate publishes a suite of N free tools" statement anywhere. For GEO — the thing half these tools are about — that itemised suite-level structure is exactly what gets cited.

**Fix:** add `offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }` to each tool's `WebApplication` block, and add an `ItemList` of `WebApplication` entries to the new `/tools` layout/metadata.

---

### NF6. Two "UX audit" tools, one unlinked; three orphaned generator pages 🟡

**Confirmed in:** `components/SuggestedTools.tsx` L24-25 (`id: "saas-ux-audit"` → `/tools/saas/saas-ux-audit`) vs on-disk `app/tools/website/ux-audit/page.tsx` (80 lines, in `sitemap.ts` L74, **not** in the registry). Plus orphans `app/tools/design/type-scale-generator/`, `app/tools/design/8pt-grid-calculator/`, `app/tools/ai/geo-visibility-checker/` — all live on disk, none referenced by `ALL_TOOLS_REGISTRY`.

So the site ships: a `website/ux-audit` page Google can find via the sitemap but a human cannot find via the hub; and two each of the type-scale and 8pt-spacing tools at different slugs. Duplicate near-identical pages compete with each other in search and split any link equity.

**Fix:** one canonical slug per tool. For each orphan, either wire it into the registry (if it's the intended version) or delete the folder and 301 it to the canonical slug. Remove `website/ux-audit` from `sitemap.ts` if `saas-ux-audit` is the real one.

---

## E-E-A-T Assessment (v3 — SEO Content Skill Applied)

### Google's "Who / How / Why" Test

| Question | Current state | Assessment |
|---|---|---|
| **Who** built these tools? | Subheadline: `built by senior design engineers`; upcoming pages: `Our product design engineers…`. No named person, no link to the About page or team. | ⚠️ An internal role label, not an authority signal |
| **How** do they work / how accurate are they? | No methodology note anywhere on the hub; no "how the score is calculated"; no data-handling statement. | ❌ Absent |
| **Why** should a visitor trust the output? | 7 genuinely live GEO tools are real evidence of capability. Undercut by 17 non-functional cards, no usage numbers, no testimonials, and the CTA-wording drift. | ⚠️ Mixed |

### E-E-A-T Breakdown (hub page)

| Factor | Score | Key Signals Present | Key Gaps |
|---|---|---|---|
| **Experience** | 7/20 | 7 working GEO tools (`llms.txt`, `robots.txt` gen/validator, schema studio, batch checker, crawler directory) — real, shipped artifacts | Hub over-promises (H1 says "tools" plural/present; ~60% lead nowhere usable); no "we built these because…" context |
| **Expertise** | 13/25 | GEO angle is on-trend and under-served; live tools are competent; sub-hub pages now well-structured | Jargon dilutes it (`conversion architecture`, `Preview Engines`, `Diagnostic Roadmaps`, `4 Core Verticals`); no methodology/accuracy note |
| **Authoritativeness** | 8/25 | Sub-hubs have `ItemList` JSON-LD; some tools have `WebApplication` schema | Hub itself has **no metadata and no JSON-LD** (NF2, NF5); no `ItemList` for the suite; no external validation, no usage/traction proof (M1) |
| **Trustworthiness** | 13/30 | Honest badging (Live / Preview / Coming Soon) is a genuine strength; no signup wall on live tools | 17 dead cards on a first-impression page; `senior design engineers` claim; no "is it free / do you keep my data" FAQ (M2); CTA says `Book a 1-on-1 UX Consultation` → `/contact` while the rest of the site says `Book a Free 15-Min Call` → cal.com |

**Total E-E-A-T Score: 41/100**

The lowest of every page-set audited. The 7 live GEO tools are the only strong asset; everything structural around them (metadata, schema, ratio, jargon, proof) works against the page's one job.

---

## SEO / GEO Metadata — v3 Assessment

| Element | State | Action |
|---|---|---|
| `/tools` `<title>` / description / OG | Inherited from root — generic homepage boilerplate (NF2) | 🔴 Add `app/tools/layout.tsx` with `metadata` (title/description/canonical/OG per S1) |
| `/tools` JSON-LD | None | 🟠 Add `ItemList` of `WebApplication` entries + `FAQPage` (once M2 FAQ exists) |
| Sub-hub metadata (`/tools/ai` etc.) | ✅ Present and reasonable (`AI & GEO Visibility Tools Suite | UI Pirate`) | Keep; audit copy in the individual-tools pass |
| Tool `WebApplication` schema | Present on live/preview tools, **missing `offers`/price:0** (NF5) | 🟠 Add `offers: { price: "0", priceCurrency: "USD" }` |
| Upcoming-tool `FAQPage` schema | ✅ Emitted by `UpcomingToolLandingPage` | Fine — but the pages still need real utility (NF1) |
| `app/sitemap.ts` | `/tools` at 0.95; 28 tool URLs at 0.85–0.9 incl. 17 non-functional; new `bot-directory/[id]` set | 🔴 Lower `/tools` to 0.8; drop `Coming Soon` URLs to 0.3 or remove; verify `bot-directory/[id]` content before indexing |
| Canonicals | Present on individual tool pages (`contrast-checker` L8-10 etc.) | ✅ Good at tool level; add one for `/tools` in the new layout |

---

## Keyword Gap Analysis (v3 — New Finding)

| Target phrase | Covered on the hub? | Gap |
|---|---|---|
| `free UX audit tool` | H1 says "Free tools for SaaS, AI & Product Teams" | ⚠️ Not in a title tag (no metadata) — invisible to search |
| `free AI visibility checker` / `llms.txt generator` | Live tool exists; sub-hub `/tools/ai` titled for it | ✅ via sub-hub, ❌ hub can't rank |
| `free landing page analyzer` | Preview tool exists | ⚠️ Preview only; hub has no metadata |
| `free design tokens generator` | Preview tool exists | ⚠️ same |
| `robots.txt generator for AI crawlers` | Live tool + sub-hub | ✅ |
| `is my site visible to ChatGPT` | Pillar-card copy mentions it | ⚠️ Conversational query — no FAQ/heading answers it directly |
| `free tools for SaaS founders` | H1 | ❌ Not in a rankable title/H-tag with metadata |

**Key finding:** the hub cannot compete for a single one of its target head terms because it emits no `<title>` or description of its own (NF2). The sub-hubs partly compensate, but they target narrower phrases and can't hold the `free [X] tools` category term.

---

## AI Citation Readiness Assessment (v3 — New Finding)

| Signal | State | Score |
|---|---|---|
| Hub has clean metadata / named entity | None (NF2) | ❌ Weak |
| Suite-level `ItemList` structured data | None (NF5) | ❌ Weak |
| Per-tool `WebApplication` schema | On live/preview tools | 🟡 Partial |
| Explicit "free / no signup" machine-readable | No `offers` price:0 anywhere (NF5) | ❌ Weak |
| FAQ / Q&A pairs on the hub | None (M2) | ❌ Gap |
| Unambiguous tool names | Yes — registry titles are specific | ✅ Good |
| Methodology / accuracy statements | None | ❌ Gap |
| Doorway-cluster risk (dilutes trust) | 17–20 templated upcoming pages (NF1) | ❌ Risk |

**AI Citation Readiness Score: 37/100**

Ironic for a hub whose flagship live tools are *about* being cited by AI engines: the hub itself is close to invisible to them. The fixes are all structural (metadata, `ItemList`, `offers`, FAQ) rather than copy.

---

## New Copy Recommendations (v3 — SEO Content Skill Applied)

### NC1. Fix the ratio before the copy — hide "Coming Soon" from the hub grid 🔴

**Confirmed in:** `app/tools/page.tsx` L334-382 (three roadmap card rows) + `ALL_TOOLS_REGISTRY` (17 `Coming Soon` entries).

- Change the `upcomingTools` render (L335) to a single collapsed block: a short paragraph + text links, e.g. *"More tools shipping monthly: [CTA Analyzer], [Contrast Checker], [Onboarding Analyzer], … [Want one sooner? Tell us →]."*
- Keep the individual pages (they have metadata + FAQ schema) but stop giving each a full card on the hub.
- Result: a hub of **11 real/near-real tools** reads as a strong suite; 28 cards where 17 go nowhere reads as thin.

### NC2. Add `app/tools/layout.tsx` with metadata + `ItemList` JSON-LD 🔴

Per NF2 / NF5 / S1 / S2. Title `Free UX, Conversion & AI-Visibility Tools | UI Pirate`; description `Free tools to audit your product UX, score your landing pages, and check how visible you are to AI search engines. No signup. Built by the team at UI Pirate.`; canonical `https://uipirate.com/tools`; `ItemList` of the live + preview `WebApplication` entries, each with `offers` price `0`.

### NC3. Hero — Title Case, honest expectation, drop the jargon 🟠

**Confirmed in:** `app/tools/page.tsx` L69, L72.

| Element | Current | Recommended |
|---|---|---|
| H1 (L69) | `Free tools for SaaS, AI & Product Teams` | `Free Tools for SaaS, AI & Product Teams` (Title Case, matches the rest of the site) |
| Subheadline (L72) | `Audit, score, and optimize your product UX, conversion architecture, and AI bot visibility — 100% free and built by senior design engineers.` | `Audit and score your product UX, your landing pages, and how visible you are to AI search — free, no signup, built by the team at UI Pirate.` (confirm "no signup" is true for every live tool first) |
| Badge (L65) | `TOOLS & DIAGNOSTICS` | `FREE PRODUCT & GEO TOOLS` |

### NC4. Section headings — call them tools, drop the "engine/roadmap/vertical/operational" set 🟠

**Confirmed in:** L167, L169, L239, L291, L295, L341, L345.

| Location | Current | Recommended |
|---|---|---|
| L167 / L169 | `Explore Tools by Agency Pillar` / `4 Core Verticals` | `Browse by what you're trying to fix` / *(remove the "4 Core Verticals" caption)* |
| Pillar badges (L186, L194, L202) | `Commercial CRO` / `Core Expertise` / `Foundations & Code` | `Score & audit` / `Audit & benchmark` / `Generate & convert` (describe the tools, not the agency) |
| L239 | `Live & Operational Tools ({n})` | `Ready to Use ({n})` |
| L291 | `Interactive Preview Engines ({n})` | `In Preview ({n})` |
| L295 | `⚡ Active Development · Test Preview Engines Below` | `Partial tools — scoring works, some outputs still in progress` *(no emoji)* |
| L341 | `Upcoming Tools & Diagnostic Roadmaps ({n})` | `On the Roadmap` *(and collapse per NC1)* |
| L345 | `📋 Detailed Specs & Landing Pages Live` | *(remove)* |

### NC5. Preview cards — say precisely what works 🟠

**Confirmed in:** the 4 `Preview Available` tools render a generic `ctaLabel` and badge. Replace the ambiguous `Preview Available` / `Try Interactive Preview` framing per tool with a concrete state, e.g. `Try it — scoring is live, PDF export coming`. A visitor should never have to click to find out whether they'll get a result or a mockup.

### NC6. Agency bridge banner — tie it to what the visitor just did, standardise the CTA 🟠

**Confirmed in:** `app/tools/page.tsx` L388-401.

| Element | Current | Recommended |
|---|---|---|
| H3 (L391) | `Turn audit findings into a high-converting product.` | `Ran one of our tools and want a human to go deeper?` |
| Sub (L394) | `…complex SaaS platforms, AI interfaces, and high-velocity landing pages.` | `…complex SaaS platforms, AI interfaces, and fast, high-converting landing pages. 9+ years, 50+ products shipped.` (adds the trust line used on about/pricing) |
| CTA (L398, L401) | `Book a 1-on-1 UX Consultation` → `/contact` | `Book a Free 15-Min Call` → `https://cal.com/ui-pirate/15min` (matches every other audit) |

### NC7. Add a short hub FAQ (fixes M2 + feeds `FAQPage` schema) 🟠

Add 4-5 Q&As above the bridge banner and mirror them into JSON-LD:

| Question | Answer (draft) |
|---|---|
| Are these tools really free? | Yes — every live tool is free to use with no account and no card. |
| Do I need to sign up? | No. Paste a URL or your values and run it. *(confirm true for all live tools)* |
| What happens to the URL or data I submit? | *(state the real behaviour — processed in-browser / not stored / etc.)* |
| How accurate are the scores? | *(one sentence on methodology — heuristics used, what it does and doesn't catch)* |
| Can a person review my product instead? | Yes — book a free 15-minute call and we'll walk through it with you. |

---

## Updated Priority Table (v3)

All v2 items carried forward. New v3 items marked `[v3]`. "Verified" = code-checked 2026-08-31.

| # | Section | Issue | File + line | Priority | Verified |
|---|---|---|---|---|---|
| 1 | Metadata | `/tools` still `"use client"`, no `layout.tsx`, no `metadata` — only page in the subtree without it | `app/tools/page.tsx` L1 | 🔴 Fix now | ✓ |
| 2 | Structure | 17 of 28 cards `Coming Soon` — collapse to a one-line roadmap (NC1) | `app/tools/page.tsx` L334-382; `components/SuggestedTools.tsx` | 🔴 Fix now | ✓ |
| 3 | Sitemap | `/tools` raised to 0.95 with no metadata; 17 non-functional URLs still at 0.85 (NF3) | `app/sitemap.ts` L53, L62-96 | 🔴 Fix now | ✓ |
| 4 | Hero | H1 promises working "tools" plural; page ~60% non-functional — fix ratio (NC1) or reset expectation | `app/tools/page.tsx` L69 | 🔴 Fix now | ✓ |
| 5 | SEO | No `ItemList` / suite-level JSON-LD on the hub; tool `WebApplication` blocks lack `offers` price:0 (NF5) | `app/tools/layout.tsx` (new); tool pages | 🟠 Soon `[v3]` | ✓ |
| 6 | Hero sub | `conversion architecture` + `senior design engineers` — jargon + off-positioning (NC3); now also on 17 upcoming pages | `app/tools/page.tsx` L72; `components/UpcomingToolLandingPage.tsx` L118 | 🟠 Soon | ✓ |
| 7 | Pillar grid | `Explore Tools by Agency Pillar` / `4 Core Verticals`; agency-describing badges (NC4) | `app/tools/page.tsx` L167, L169, L186, L194, L202 | 🟠 Soon | ✓ |
| 8 | Structure | Category tabs and pillar cards are the same 4 categories, back to back | `app/tools/page.tsx` L106-231 | 🟠 Soon | ✓ |
| 9 | Live section | Most valuable section is 5th down — move it near the top | `app/tools/page.tsx` L233 | 🟠 Soon | ✓ |
| 10 | Sections | `Preview Engines` / `Diagnostic Roadmaps` / `Operational` jargon; `⚡`/`📋` emoji in headers (NC4) | `app/tools/page.tsx` L291, L295, L341, L345 | 🟠 Soon | ✓ |
| 11 | Preview cards | `Preview Available` / `Try Interactive Preview` ambiguous — say what works (NC5) | `app/tools/page.tsx` L300-329; registry | 🟠 Soon | ✓ |
| 12 | Banner | `high-velocity landing pages`; CTA wording + `/contact` destination diverge from the rest of the site; no trust line (NC6) | `app/tools/page.tsx` L391-401 | 🟠 Soon | ✓ |
| 13 | Page | No social proof / usage signal (M1) | `app/tools/page.tsx` | 🟠 Soon | ✓ |
| 14 | Page | No hub FAQ (M2) — add 4-5 Q&As + `FAQPage` schema (NC7) | `app/tools/page.tsx` | 🟠 Soon | ✓ |
| 15 | Upcoming pages | 17–20 templated landing pages, one CTA target, no working tool/manual version — doorway-cluster risk (NF1) | `components/UpcomingToolLandingPage.tsx`; `app/tools/**/` | 🟠 Soon `[v3]` | ✓ |
| 16 | Routes | Orphan/duplicate pages: `type-scale` ×2, `8pt`/`figma-spacing` ×2, `geo-visibility-checker`, `website/ux-audit` (NF6, S4) | `app/tools/design/*`, `app/tools/ai/*`, `app/tools/website/ux-audit/`, `app/sitemap.ts` L74 | 🟠 Soon | ✓ |
| 17 | Sitemap | New `/tools/ai/bot-directory/[id]` page class — verify unique content before indexing (NF4) | `app/tools/ai/bot-directory/[id]/page.tsx`; `app/sitemap.ts` L145 | 🟡 Consider `[v3]` | ✓ |
| 18 | Linking | Service & pricing pages still don't link to tools; hub bridge is a generic `/contact` (M4) | cross-page | 🟡 Consider | ✓ |
| 19 | Search | No `<label>`/`aria-label`; placeholder has 7 examples; no synonym matching | `app/tools/page.tsx` L79-85 | 🟡 Consider | ✓ |
| 20 | Tabs | Counts include unbuilt tools — show `live · soon` split | `app/tools/page.tsx` L108-132 | 🟡 Consider | ✓ |
| 21 | Code | `upcomingTools` filter redundant/foot-gun second clause (S5) | `app/tools/page.tsx` L34-36 | 🟡 Consider | ✓ |
| 22 | Hero badge | `TOOLS & DIAGNOSTICS` — flat; name "free" + the GEO angle (NC3) | `app/tools/page.tsx` L65 | 🟡 Consider | ✓ |

**Priority key:** 🔴 Fix now — actively hurts discovery/credibility on a first-impression + SEO page · 🟠 Soon — copy, structure, positioning, schema with measurable trust/conversion impact · 🟡 Consider — polish, a11y, consistency.

---

## E-E-A-T Quick Wins (v3 Summary)

1. **Add `app/tools/layout.tsx` with metadata + an `ItemList` (NC2).** One new server file. It's the difference between the hub ranking for `free UX tools` / `free AI visibility checker` and being invisible. Every page it links to is already optimised — this fixes the front door.

2. **Collapse the 17 "Coming Soon" cards to one roadmap line (NC1).** The hub instantly goes from "28 cards, 17 dead" to "11 real tools + a roadmap." Biggest single credibility gain, and it's a render change plus removing those URLs from the sitemap.

3. **Standardise the bridge CTA (NC6).** `Book a 1-on-1 UX Consultation` → `/contact` becomes `Book a Free 15-Min Call` → `cal.com/ui-pirate/15min`, and add the `9+ years, 50+ products shipped` trust line. Aligns the tools hub with the landing, pricing, about, and services audits — one CTA, one destination, sitewide.

---

## Free Tools Hub — What's Actually Working Well (v3 Recognitions)

- ✅ **The 7 live GEO tools** — `llms.txt` generator, `robots.txt` generator/validator, schema studio, batch checker, AI crawler directory, GEO readiness hub. Real, useful, on-trend, and under-served in the agency space. Lead with them.
- ✅ **Sub-hub pages now have real metadata + `ItemList` JSON-LD** — new since v2, and done well.
- ✅ **Upcoming pages upgraded to templated landing pages with `FAQPage` schema** — better than bare "coming soon"; the remaining gap is real utility, not structure.
- ✅ **Some live/preview tools now carry `WebApplication` JSON-LD** — right type, just needs `offers` price:0.
- ✅ **Honest badging** (Live / Preview / Coming Soon) — still the right instinct. The problem is the *quantity* of "Coming Soon" on the hub, not the labelling.
- ✅ **Card design + live search + category filtering** — clean, scannable, correct interaction model for a hub this size.
- ✅ **Bridge banner placement** — end of page, after the visitor has seen the expertise. Concept is right; only the copy and CTA need the fixes in NC6.

---

## Copy Tone Reference — v3 Additions (Tools-Specific)

*The v2 Copy Tone Reference above still applies. These additions target patterns confirmed in the v3 source read.*

| ✅ Do | ❌ Avoid | Example from current code |
|---|---|---|
| Give the hub its own `<title>` and description | Let the flagship SEO page inherit homepage meta | `/tools` has no `metadata` export |
| Ship 11 real tools + a roadmap line | 28 cards where 17 link to non-functional pages | the `Coming Soon` grid |
| One templated page only where it earns its index slot | Many near-identical pages funnelling to one `/contact` | 17× `UpcomingToolLandingPage` |
| "built by the team at UI Pirate" | "built by senior design engineers" / "our product design engineers" | hero L72 + upcoming-page L118 |
| Say what works: "scoring is live, export coming" | "Preview Available" / "Try Interactive Preview" | preview card CTAs |
| `Book a Free 15-Min Call` → cal.com | page-specific CTA wording + `/contact` | bridge banner L401 |
| Plain section labels + a status dot | "engines", "diagnostic roadmaps", "operational", "4 core verticals", `⚡`/`📋` | §4–§7 headings |

*Extended word removal list (v3 tools additions):* `conversion architecture`, `senior design engineers`, `preview engines`, `diagnostic roadmaps`, `operational tools`, `core verticals`, `agency pillar`, `high-velocity landing pages`.

---

*This file is the living audit for the Free Tools hub. v1/v2 (2026-08-27) → v3 (2026-08-31). Verify against current source before implementing — the code is the ground truth. Backend/roadmap items for the individual tools are tracked separately in `07-tools-backend-and-advanced-roadmap.md`.*
