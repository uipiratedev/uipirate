# About Page Audit Checklist

This document tracks the progress of all content, copy, SEO, and conversion changes on the About page.
Synced to **`04-about-page.md` v3 (2026-08-31)** — all statuses are code-verified against live source files.

**Files in scope:**
- `app/about/page.tsx` — Body copy, JSON-LD schema, stats, industries, client grid
- `app/about/layout.tsx` — SEO metadata (title, description, keywords, OG, Twitter)
- `app/about/opengraph-image.tsx` — OG social card image
- `screens/landing/theTeam/index.tsx` — Team grid (shared component)
- `screens/pricing/perfectFor/index.tsx` — "Who We Work Best With" (shared component)

---

## How to read this

- ✅ **Done** — verified in source code
- ❌ **Not done** — confirmed still wrong in source code
- ⚠️ **Partially done** — in progress or needs further work
- 🔴 **Fix now** — errors actively damaging trust/credibility or SEO
- 🟠 **Soon** — conversion and positioning improvements
- 🟡 **Consider** — polish and consistency improvements

---

## 1. HERO SECTION (🔴 Subheadline issues)

**File:** `app/about/page.tsx` L315–320

| # | Item | Status | Priority |
|---|------|--------|----------|
| 1a | Badge: `ABOUT US` — clear and functional | ✅ Keep as-is | — |
| 1b | H1: `We Turn Ideas Into Shipped Products` — strongest H1 on site | ✅ Keep as-is | — |
| 1c | Subheadline opens with `Not just a design agency` (negation-first) — rewrite per NC1 | ✅ Done | 🔴 Fix now |
| 1d | Subheadline repeats `From idea to shipped product` from H1 — remove repetition (NC1) | ✅ Done | 🔴 Fix now |
| 1e | US Timezone badge `🟢 US Timezone Friendly — EST & PST hours` — keep | ✅ Keep as-is | — |

**NC1 Recommended rewrite (for 1c & 1d):**
> We're a product design and development agency. We work alongside SaaS founders and enterprise teams — from the first wireframe through to working, production-ready software.

---

## 2. STATS STRIP (🟠 Source missing)

**File:** `app/about/page.tsx` L20–25

| # | Item | Status | Priority |
|---|------|--------|----------|
| 2a | `9+` Years of Experience — verifiable stat | ✅ Keep as-is | — |
| 2b | `50+` Products Shipped — verifiable stat | ✅ Keep as-is | — |
| 2c | `5.0 Client Rating` — no source attribution (Clutch/Upwork/Google) | ⚠️ Pending (no source URL yet) | 🟠 Soon |
| 2d | `6` Countries Served — verifiable stat | ✅ Keep as-is | — |

**NC4 Recommended fix (for 2c):** Change label to `Rating on Clutch & Upwork` and add `aggregateRating` to JSON-LD with a `url` to the Clutch profile. (Currently on hold until source URLs are available)

---

## 3. "WHAT MAKES US DIFFERENT" (🟠 Duplicate cards)

**File:** `app/about/page.tsx` L379–403

| # | Item | Status | Priority |
|---|------|--------|----------|
| 3a | Card 01 `Product Thinking First` — strong, keep | ✅ Keep as-is | — |
| 3b | Card 03 `Designed for Conversion` — strong, keep | ✅ Keep as-is | — |
| 3c | Cards 04 `Architecture to Code` + 06 `Idea to Shipped Product` are near-duplicates — consolidate into one `From Sketch to Working Code` card (NC2) | ❌ Not done | 🟠 Soon |
| 3d | Cards 02 `Simplify Complex Products` + 05 `Enterprise Specialist` overlap — absorb Card 05 into 02 (NC2) | ❌ Not done | 🟠 Soon |
| 3e | Add new Card 05: `We Work in Your Time Zone` — US Eastern + Pacific overlap, real-time calls (NC2) | ❌ Not done | 🟠 Soon |
| 3f | Add new Card 06: `We've Shipped This 50+ Times` — experience + proof signal (NC2) | ❌ Not done | 🟠 Soon |

---

## 4. "OUR DESIGN STYLE" (🟠 Jargon fix)

**File:** `app/about/page.tsx` L431–477

| # | Item | Status | Priority |
|---|------|--------|----------|
| 4a | Card 01 `Dashboards & SaaS UX` — strong, keep | ✅ Keep as-is | — |
| 4b | Card 02 `Websites & Landing Pages` — strong, keep | ✅ Keep as-is | — |
| 4c | Card 03 `Pixel-Perfect Execution` — jargon; rewrite to `Design That Holds Up in Code` (NC3) | ❌ Not done | 🟠 Soon |

**NC3 Recommended rewrite (for 4c):**
> Title: Design That Holds Up in Code
> Desc: From Figma to production — the shipped product matches the design, behaves the way users expect, and is built to maintain.

---

## 5. "OUR PROCESS" (✅ Resolved)

**File:** `app/about/page.tsx` L479–531, uses `data/process.ts`

| # | Item | Status | Priority |
|---|------|--------|----------|
| 5a | Sub-copy `Simple: you share your vision. We do the rest.` — keep | ✅ Keep as-is | — |
| 5b | `/process` page link would 404 | ✅ Resolved — `/process` page now exists | — |

---

## 6. TEAM SECTION (🟠 Roles for trimmed services)

**File:** `screens/landing/theTeam/index.tsx` L10–58 + `app/about/page.tsx` L141–172 (schema)

| # | Item | Status | Priority |
|---|------|--------|----------|
| 6a | Kartik Kumar titled `Lead Graphics & Motion` in schema + team — retitle to reflect current services (NF3) | ❌ Not done | 🟠 Soon |
| 6b | Priyagni titled `Graphic Designer` in schema + team — retitle or remove (NF3) | ❌ Not done | 🟠 Soon |
| 6c | Aman titled `Video Editing` in schema + team — retitle or remove (NF3) | ❌ Not done | 🟠 Soon |
| 6d | No founder origin story / bio — add 2–3 sentence founder note above team grid (NC10) | ❌ Not done | 🟡 Consider |

**NC10 Recommended founder note:**
> UI Pirate started in 2015 when Vishal Anand — a product designer who also writes production code — got tired of design hand-offs that fell apart in engineering. The agency is built around one idea: the people who design the product should be able to ship it.

---

## 7. TECHNOLOGY STACK + INDUSTRIES (🟠 Trim industries)

**File:** `app/about/page.tsx` L26–46

| # | Item | Status | Priority |
|---|------|--------|----------|
| 7a | Tech stack: Angular, React, Next.js, TypeScript, Tailwind, Framer, Figma, GSAP — correct | ✅ Keep as-is | — |
| 7b | Industries list has 8 items — trim to 5 client-backed verticals, remove E-commerce / EdTech / PropTech (NC5) | ❌ Not done | 🟠 Soon |
| 7c | Rename `Fintech & Banking` → `FinTech & Quant Trading` to map to ArthAlpha | ❌ Not done | 🟠 Soon |
| 7d | Rename `AI & Machine Learning` → `AI Products & Platforms` to map to RevUp AI, Sarge | ❌ Not done | 🟠 Soon |

---

## 8. CLIENT LOGOS GRID (🟠 H2 copy + polish)

**File:** `app/about/page.tsx` L585–645

| # | Item | Status | Priority |
|---|------|--------|----------|
| 8a | H2 `Trusted by Teams Worldwide` — too generic; rename to `Companies That Trusted Us With Their Products` | ❌ Not done | 🟠 Soon |
| 8b | Client grid shows company names + industries + US flags — strong, keep | ✅ Keep as-is | — |
| 8c | `See our reviews on Clutch →` link — strong trust signal, keep | ✅ Keep as-is | — |
| 8d | US flag emoji `🇺🇸 US` — replace with `• Based in USA` text label for professional register | ❌ Not done | 🟡 Consider |
| 8e | `Awesome Health Club` (schema) vs `Awesome Health` (grid) — align entity names (NF9) | ❌ Not done | 🟡 Consider |

---

## 9. "WHO WE WORK BEST WITH" — PerfectFor (✅ Done at component level)

**File:** `screens/pricing/perfectFor/index.tsx`

| # | Item | Status | Priority |
|---|------|--------|----------|
| 9a | `FIT CHECK` badge → `WHO IT'S FOR` | ✅ Done (fixed during pricing audit) | — |
| 9b | `Funded Startups` card — `impress investors` claim | ✅ Done (fixed during pricing audit) | — |
| 9c | `SaaS Companies` card — grammar (dependent clause) | ✅ Done (fixed during pricing audit) | — |
| 9d | Emoji icons in `Not the right fit` strip → ✕ icons | ✅ Done (fixed during pricing audit) | — |

---

## 10. CTA SECTION (✅ No changes needed)

**File:** `app/about/page.tsx` L649–696

| # | Item | Status | Priority |
|---|------|--------|----------|
| 10a | H2 `Ready to Turn Your Idea Into a Product?` | ✅ Keep as-is | — |
| 10b | `Book a Free Call` → cal.com | ✅ Keep as-is | — |
| 10c | Trust row: `No commitment`, `Response within 2 hours`, `US timezone friendly` | ✅ Keep as-is | — |

---

## 11. SEO METADATA (🔴 Title + description issues)

**File:** `app/about/layout.tsx`

| # | Item | Current Value | Status | Priority |
|---|------|---------------|--------|----------|
| 11a | Page title opens with `About \|` — no brand name (NF6) | `About \| Product Design Agency — From Idea to Shipped Product` | ❌ Not done | 🔴 Fix now |
| 11b | Meta description ~270 chars — truncates before key differentiators (NF5) | Buried `50+ products`, `US timezone` | ❌ Not done | 🔴 Fix now |
| 11c | OG title — functional, brand name present | `About UI Pirate \| Product Design — From Idea to Shipped Product` | ✅ Keep as-is | — |
| 11d | Twitter card — functional and on-message | `summary_large_image` | ✅ Keep as-is | — |
| 11e | Add dev-side keywords: `product design and development agency`, `hire Next.js agency`, `AI product design agency` | Missing | ❌ Not done | 🟡 Consider |

**NC6 Recommended title:** `About UI Pirate — Product Design & Development Agency`

**NC7 Recommended description (≤160 chars):**
> UI Pirate is a product design and development agency — 50+ products shipped across SaaS, AI, FinTech and HealthTech. US timezone friendly. From first wireframe to working software.

---

## 12. OG IMAGE (🟠 Third tagline mismatch)

**File:** `app/about/opengraph-image.tsx` L14–16

| # | Item | Status | Priority |
|---|------|--------|----------|
| 12a | OG image renders `We Design, Build & Ship Products.` — a third tagline not used on the page (NF4) | ❌ Not done | 🟠 Soon |

**NC8 Recommended fix:** Update to `title="We Turn Ideas Into"` `titleHighlight="Shipped Products."` to match the H1.

---

## 13. JSON-LD SCHEMA (🔴 Multiple inconsistencies)

**File:** `app/about/page.tsx` L117–272

| # | Item | Status | Priority |
|---|------|--------|----------|
| 13a | `numberOfEmployees: "9"` — contradicts 7-person team grid and 6-person employee array; set to `"7"` (NF1) | ❌ Not done | 🔴 Fix now |
| 13b | `Syed Musaddiq` (schema) vs `Musuddiq` (team component) — standardize spelling (NF2) | ❌ Not done | 🔴 Fix now |
| 13c | Employee job titles for trimmed services (Kartik, Priyagni, Aman) — update or remove (NF3) | ❌ Not done | 🟠 Soon |
| 13d | Schema description claims `Node.js and Python` — not shown in visible tech stack (NF8) | ❌ Not done | 🟡 Consider |
| 13e | `foundingDate: "2015"` vs `9+ Years` stat — 2026−2015=11 years; reconcile (NF7) | ❌ Not done | 🟡 Consider |
| 13f | `customer[]` name `Awesome Health Club` vs grid `Awesome Health` — align (NF9) | ❌ Not done | 🟡 Consider |
| 13g | `aggregateRating` absent for `5.0 Client Rating` stat — add with Clutch `url` (NC4) | ❌ Not done | 🟠 Soon |

---

## 14. ABOUT FAQ — NEW BLOCK (🟠 Missing)

**File:** `app/about/page.tsx` — new block before CTA (L644)

| # | Item | Status | Priority |
|---|------|--------|----------|
| 14a | No FAQ block — add 3-question FAQ: `Who is UI Pirate?`, `Where is the team based?`, `Do you only design or do you build too?` (NC9) | ❌ Not done | 🟠 Soon |
| 14b | Add `FAQPage` / `Question[]` JSON-LD schema to back the FAQ block | ❌ Not done | 🟠 Soon |

---

## Priority Summary

### 🔴 Fix Now — Critical

| # | Item | File |
|---|------|------|
| 1c–1d | Hero subheadline — negation-first opening + redundant phrase | `app/about/page.tsx` L315–320 |
| 11a | Page title — no brand name, `About \|` wastes lead position | `app/about/layout.tsx` L4 |
| 11b | Meta description — 270 chars, truncates before key differentiators | `app/about/layout.tsx` L5–6 |
| 13a | `numberOfEmployees: "9"` contradicts 7-person team | `app/about/page.tsx` L133 |
| 13b | Founder name spelled 3 ways — standardize across schema + team | `page.tsx` L150; `theTeam/index.tsx` L26, 28 |

### 🟠 Soon — Conversion improvements

| # | Item | File |
|---|------|------|
| 2c | `5.0 Client Rating` — add source label + schema `aggregateRating` | `app/about/page.tsx` L22 |
| 3c–3f | Differentiation cards — consolidate 2 duplicate pairs, add 2 unique cards | `app/about/page.tsx` L379–403 |
| 4c | `Pixel-Perfect Execution` → `Design That Holds Up in Code` | `app/about/page.tsx` L450–453 |
| 6a–6c | Kartik / Priyagni / Aman titled for trimmed services — retitle or remove | `page.tsx` L153–171; `theTeam` L33–56 |
| 7b–7d | Trim industries 8→5, rename 2 labels to match named clients | `app/about/page.tsx` L37–46 |
| 8a | Client logos H2 `Trusted by Teams Worldwide` → `Companies That Trusted Us With Their Products` | `app/about/page.tsx` L591 |
| 12a | OG image uses 3rd tagline — align to H1 | `app/about/opengraph-image.tsx` L14–16 |
| 13c | Employee job titles for trimmed services | `app/about/page.tsx` L153–171 |
| 13g | Add `aggregateRating` to schema with Clutch link | `app/about/page.tsx` |
| 14a–14b | Add 3-question FAQ block + FAQ JSON-LD schema | `app/about/page.tsx` |

### 🟡 Consider — Polish

| # | Item | File |
|---|------|------|
| 1e | Hero badge `EST & PST hours` → `Eastern & Pacific time zones` | `app/about/page.tsx` L331 |
| 6d | Founder origin story — 2–3 sentence note above team grid | `theTeam/index.tsx` |
| 8d | US flag emoji `🇺🇸 US` → `• Based in USA` text label | `app/about/page.tsx` L636 |
| 8e | `Awesome Health Club` vs `Awesome Health` entity name drift | `app/about/page.tsx` L240 vs L94 |
| 11e | Add dev-side SEO keywords | `app/about/layout.tsx` L7–8 |
| 13d | Schema claims Node.js/Python — align with visible stack | `app/about/page.tsx` L131 |
| 13e | `foundingDate: "2015"` vs `9+ Years` stat — reconcile | `app/about/page.tsx` L132 |
| 13f | `Awesome Health Club` in schema `customer` array | `app/about/page.tsx` L240 |

---

*Last updated: 2026-09-01 (v1) — Created from `04-about-page.md` v3. No changes have been made to the About page yet; all items above are open. The five 🔴 Fix now items are the highest priority starting point.*
