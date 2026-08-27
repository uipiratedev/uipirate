# Free Tools Hub — Content Audit — UI Pirate

**Page:** `/tools` (labeled "Free Tools" in the Resources nav dropdown)
**Files in scope:**
- `app/tools/page.tsx` (the hub page — client component)
- `components/SuggestedTools.tsx` → `ALL_TOOLS_REGISTRY` (the data behind every card)
- `app/sitemap.ts` (tool URLs submitted to search)
- Sub-hub pages `/tools/ai`, `/tools/website`, `/tools/saas`, `/tools/design` (referenced, not deep-audited here)

**Focus:** Copy, messaging, positioning, structural decisions, internal linking, and SEO
**Research basis:** Same frameworks as prior audits — Apple HIG, NN/g, Google UX Writing, Copyhackers JTBD, E-E-A-T, CRO research, plus programmatic-SEO / free-tool lead-gen playbooks (Ahrefs, HubSpot, Zapier free-tool hsubs) and GEO (generative engine optimization) guidance
**Last audited:** 2026-08-27
**Note:** This page is new — there is no v1. This is the first audit. It covers the **hub page only**, not the individual tools inside it (those get their own audit later).

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
