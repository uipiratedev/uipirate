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

| # | Item | Status |
|---|------|--------|
| 1a | Badge: `ABOUT US` — clear and functional | ✅ Keep as-is |
| 1b | H1: `We Turn Ideas Into Shipped Products` — strongest H1 on site | ✅ Keep as-is |
| 1c | Subheadline opens with `Not just a design agency` (negation-first) — rewrite per NC1 | ✅ Done |
| 1d | Subheadline repeats `From idea to shipped product` from H1 — remove repetition (NC1) | ✅ Done |
| 1e | US Timezone badge `🟢 US Timezone Friendly — EST & PST hours` — keep | ✅ Keep as-is |

**NC1 Recommended rewrite (for 1c & 1d):**
> We're a product design and development agency. We work alongside SaaS founders and enterprise teams — from the first wireframe through to working, production-ready software.

---

## 2. STATS STRIP (🟠 Source missing)

**File:** `app/about/page.tsx` L20–25

| # | Item | Status |
|---|------|--------|
| 2a | `9+` Years of Experience — verifiable stat | ✅ Keep as-is |
| 2b | `50+` Products Shipped — verifiable stat | ✅ Keep as-is |
| 2c | `5.0 Client Rating` — no source attribution (Clutch/Upwork/Google) | ⚠️ Pending (no source URL yet) |
| 2d | `6` Countries Served — verifiable stat | ✅ Keep as-is |

**NC4 Recommended fix (for 2c):** Change label to `Rating on Clutch & Upwork` and add `aggregateRating` to JSON-LD with a `url` to the Clutch profile. (Currently on hold until source URLs are available)

---

## 3. "WHAT MAKES US DIFFERENT" (🟠 Duplicate cards)

**File:** `app/about/page.tsx` L379–403

| # | Item | Status |
|---|------|--------|
| 3a | Card 01 `Product Thinking First` — strong, keep | ✅ Keep as-is |
| 3b | Card 03 `Designed for Conversion` — strong, keep | ✅ Keep as-is |
| 3c | Cards 04 `Architecture to Code` + 06 `Idea to Shipped Product` are near-duplicates — consolidate into one `From Sketch to Working Code` card (NC2) | ✅ Done |
| 3d | Cards 02 `Simplify Complex Products` + 05 `Enterprise Specialist` overlap — absorb Card 05 into 02 (NC2) | ✅ Done |
| 3e | Add new Card 05: `We Work in Your Time Zone` — US Eastern + Pacific overlap, real-time calls (NC2) | ✅ Done |
| 3f | Add new Card 06: `We've Shipped This 50+ Times` — experience + proof signal (NC2) | ✅ Done |

---

## 4. "OUR DESIGN STYLE" (🟠 Jargon fix)

**File:** `app/about/page.tsx` L431–477

| # | Item | Status |
|---|------|--------|
| 4a | Card 01 `Dashboards & SaaS UX` — strong, keep | ✅ Keep as-is |
| 4b | Card 02 `Websites & Landing Pages` — strong, keep | ✅ Keep as-is |
| 4c | Card 03 `Pixel-Perfect Execution` — jargon; rewrite to `Design That Holds Up in Code` (NC3) | ✅ Done |

**NC3 Recommended rewrite (for 4c):**
> Title: Design That Holds Up in Code
> Desc: From Figma to production — the shipped product matches the design, behaves the way users expect, and is built to maintain.

---

## 5. "OUR PROCESS" (✅ Resolved)

**File:** `app/about/page.tsx` L479–531, uses `data/process.ts`

| # | Item | Status |
|---|------|--------|
| 5a | Sub-copy `Simple: you share your vision. We do the rest.` — keep | ✅ Keep as-is |
| 5b | `/process` page link would 404 | ✅ Resolved — `/process` page now exists |
| 5c | Redesign process cards to match landing page 'How It Works' light cards (6 steps) | ✅ Done |

---

## 6. TEAM SECTION (🟠 Roles for trimmed services)

**File:** `screens/landing/theTeam/index.tsx` L10–58 + `app/about/page.tsx` L141–172 (schema)

| # | Item | Status |
|---|------|--------|
| 6a | Kartik Kumar titled `Lead Graphics & Motion` in schema + team — retitle to reflect current services (NF3) | ✅ Keep as-is (per user) |
| 6b | Priyagni titled `Graphic Designer` in schema + team — retitle or remove (NF3) | ✅ Keep as-is (per user) |
| 6c | Aman titled `Video Editing` in schema + team — retitle or remove (NF3) | ✅ Keep as-is (per user) |
| 6d | No founder origin story / bio — add 2–3 sentence founder note above team grid (NC10) | ✅ Done |

**NC10 Recommended founder note (Applied):**
> "UI Pirate started in 2015 when I got tired of design hand-offs that fell apart in engineering. We are built around one idea: the people who design the product should be able to ship it."

---

## 7. TECHNOLOGY STACK + INDUSTRIES (🟠 Trim industries)

**File:** `app/about/page.tsx` L26–46

| # | Item | Status |
|---|------|--------|
| 7a | Tech stack: Angular, React, Next.js, TypeScript, Tailwind, Framer, Figma, GSAP — correct | ✅ Keep as-is |
| 7b | Industries list has 8 items — trim to 5 client-backed verticals, remove E-commerce / EdTech / PropTech (NC5) | ✅ Done |
| 7c | Rename `Fintech & Banking` → `FinTech & Quant Trading` to map to ArthAlpha | ✅ Done |
| 7d | Rename `AI & Machine Learning` → `AI Products & Platforms` to map to RevUp AI, Sarge | ✅ Done |

---

## 8. CLIENT LOGOS GRID (🟠 H2 copy + polish)

**File:** `app/about/page.tsx` L585–645

| # | Item | Status |
|---|------|--------|
| 8a | H2 `Trusted by Teams Worldwide` — too generic; rename to `Companies That Trusted Us With Their Products` | ✅ Reverted (per user) |
| 8b | Client grid shows company names + industries + US flags — strong, keep | ✅ Kept |
| 8c | `See our reviews on Clutch →` link — strong trust signal, keep | ✅ Removed (per user screenshot revert) |
| 8d | US flag emoji `🇺🇸 US` — replace with `• Based in USA` text label for professional register | ✅ Reverted (flag emoji restored) |
| 8e | `Awesome Health Club` (schema) vs `Awesome Health` (grid) — align entity names (NF9) | ✅ Done |

---

## 9. "WHO WE WORK BEST WITH" — PerfectFor (✅ Done at component level)

**File:** `screens/pricing/perfectFor/index.tsx`

| # | Item | Status |
|---|------|--------|
| 9a | `FIT CHECK` badge → `WHO IT'S FOR` | ✅ Done (fixed during pricing audit) |
| 9b | `Funded Startups` card — `impress investors` claim | ✅ Done (fixed during pricing audit) |
| 9c | `SaaS Companies` card — grammar (dependent clause) | ✅ Done (fixed during pricing audit) |
| 9d | Emoji icons in `Not the right fit` strip → ✕ icons | ✅ Done (fixed during pricing audit) |

---

## 10. CTA SECTION (✅ Updated per user request)

**File:** `app/about/page.tsx` L649–696

| # | Item | Status |
|---|------|--------|
| 10a | H2 `Ready to Turn Your Idea Into a Product?` | ✅ Keep as-is |
| 10b | Subheadline grammar tighten | ✅ Done (removed "we'll show you how we can") |
| 10c | `Book a Free Call` → cal.com link | ✅ Done (updated to vishal-anand-3w8233) |
| 10d | Trust row: `No commitment`, `Response within 2 hours`, `US timezone friendly` | ✅ Keep as-is |

---

## 11. SEO METADATA (✅ Resolved)

**File:** `app/about/layout.tsx`

| # | Item | Current Value | Status |
|---|------|---------------|--------|
| 11a | Page title opens with `About \|` — no brand name (NF6) | `About UI Pirate — Product Design & Development Agency` | 🔴 Fix now |
| 11b | Meta description ~270 chars — truncates before key differentiators (NF5) | Optimized to ~160 chars | ✅ Done |
| 11c | OG title — functional, brand name present | `About UI Pirate \| Product Design — From Idea to Shipped Product` | — |
| 11d | Twitter card — functional and on-message | `summary_large_image` | ✅ Keep as-is |
| 11e | Add dev-side keywords: `product design and development agency`, `hire Next.js agency`, `AI product design agency` | Added | ✅ Done |

**NC6 Recommended title:** `About UI Pirate — Product Design & Development Agency`

**NC7 Recommended description (≤160 chars):**
> UI Pirate is a product design and development agency — 50+ products shipped across SaaS, AI, FinTech and HealthTech. US timezone friendly. From first wireframe to working software.

---

## 12. OG IMAGE (🟠 Third tagline mismatch)

**File:** `app/about/opengraph-image.tsx` L14–16

| # | Item | Status |
|---|------|--------|
| 12a | OG image renders `We Design, Build & Ship Products.` — a third tagline not used on the page (NF4) | ⚠️ Skipped for now (Visual change, will do later) |

**NC8 Recommended fix:** Update to `title="We Turn Ideas Into"` `titleHighlight="Shipped Products."` to match the H1.

---

## 13. JSON-LD SCHEMA (🔴 Multiple inconsistencies)

**File:** `app/about/page.tsx` L117–272

| # | Item | Status |
|---|------|--------|
| 13a | `numberOfEmployees: "9"` — contradicts 7-person team grid and 6-person employee array; set to `"7"` (NF1) | ✅ Done |
| 13b | `Syed Musaddiq` (schema) vs `Musuddiq` (team component) — standardize spelling (NF2) | ✅ Done |
| 13c | Employee job titles for trimmed services (Kartik, Priyagni, Aman) — update or remove (NF3) | ✅ Keep as-is (per user) |
| 13d | Schema description claims `Node.js and Python` — not shown in visible tech stack (NF8) | ✅ Done (added + 2017 applied) |
| 13e | `foundingDate: "2015"` vs `9+ Years` stat — 2026−2015=11 years; reconcile (NF7) | ✅ Done (changed to 2017) |
| 13f | `customer[]` name `Awesome Health Club` vs grid `Awesome Health` — align (NF9) | ✅ Done (kept as Awesome Health Club) |
| 13g | `aggregateRating` absent for `5.0 Client Rating` stat — add with Clutch `url` (NC4) | ✅ Keep as-is (add URL later) |

---

## 14. ABOUT FAQ — NEW BLOCK (🟠 Missing)

**File:** `app/about/page.tsx` — new block before CTA (L644)

| # | Item | Status |
|---|------|--------|
| 14a | No FAQ block — add 3-question FAQ: `What is UI Pirate?`, `Where is the team based?`, `Do you only design or do you build too?` (NC9) | ✅ Done |
| 14b | Add `FAQPage` / `Question[]` JSON-LD schema to back the FAQ block | ✅ Done |

---
