# About Page Audit Checklist

This document tracks the progress of all content, copy, SEO, and conversion changes on the About page.
Synced to **`04-about-page.md` v6 (2026-09-09)** — all statuses are code-verified against live source files.
Sections 1–14 track the v1–v3 audit. **Section 15** tracks the v4–v6 market-demand (Upwork job scan) changes.

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
> We are a product design and development studio. We help SaaS founders and enterprise teams think through the product, design for real users, and ship production-ready code. No hand-offs, no gaps.

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

## 3. "WHAT MAKES US DIFFERENT" (✅ Rewrite & Redesign applied)

**File:** `app/about/page.tsx` L421–550

| # | Item | Status |
|---|------|---------|
| 3-sub | Section subtext `Most agencies give you mockups. We give you a shipped product.` — remove entirely (per user: no subtext under any heading) | ✅ Done |
| 3-ui | Redesign section from a dark grid to a light Bento Grid matching the homepage style | ✅ Done |
| 3a | Card 01 — new title + description per NC2 rewrite | ✅ Done |
| 3b | Card 02 — new title + description per NC2 rewrite | ✅ Done |
| 3c | Card 03 — new title + description per NC2 rewrite | ✅ Done |
| 3d | Card 04 — new title + description per NC2 rewrite (merges old 04 + 06) | ✅ Done |
| 3e | Card 05 — new title + description per NC2 rewrite (replaces Enterprise Specialist) | ✅ Done |
| 3f | Card 06 — new title + description per NC2 rewrite (new proof card) | ✅ Done |

**NC2 Approved card copy (apply verbatim when editing code):**

| # | Title | Description |
|---|---|---|
| 01 | Strategy Before Pixels | Positioning, user flows, and scope mapped before any screen is touched. |
| 02 | Complex Made Simple | We turn multi-role dashboards, data-heavy flows, and enterprise systems into interfaces that are fast to learn and easy to use. |
| 03 | Built to Convert | Every flow is built to move users forward. Conversion is the brief. |
| 04 | Design Through to Code | Wireframes to React, Angular, and Next.js. One team, no hand-offs. |
| 05 | Same Hours as Your Team | US Eastern and Pacific hours. Real-time calls, no time zone gaps. |
| 06 | 50+ Products, Not Guesses | Across SaaS, AI, FinTech, HealthTech, and LegalTech. We have solved this type of problem before. |

---

## 4. "OUR DESIGN STYLE" (✅ Redesigned & Rewrite applied)

**File:** `app/about/page.tsx` L553–600

| # | Item | Status |
|---|------|--------|
| 4-ui | Redesign cards to white layout with glowing custom SVGs (Quote, Link, Zap) and clean hover effect | ✅ Done |
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
| 5a | Sub-copy `Simple: you share your vision. We do the rest.` — keep | ✅ Removed per user request |
| 5b | `/process` page link would 404 | ✅ Resolved — `/process` page now exists |
| 5c | Redesign process cards to match landing page 'How It Works' light cards (6 steps) | ✅ Done |
| 5d | All 6 step descriptions trimmed to ~12 words each — no em dashes, SEO preserved (`data/process.ts`) | ✅ Done |

---

## 6. TEAM SECTION (🟠 Roles for trimmed services)

**File:** `screens/landing/theTeam/index.tsx` L10–58 + `app/about/page.tsx` L141–172 (schema)

| # | Item | Status |
|---|------|--------|
| 6a | Kartik Kumar titled `Lead Graphics & Motion` in schema + team — retitle to reflect current services (NF3) | ✅ Keep as-is (per user) |
| 6b | Priyagni titled `Graphic Designer` in schema + team — retitle or remove (NF3) | ✅ Keep as-is (per user) |
| 6c | Aman titled `Video Editing` in schema + team — retitle or remove (NF3) | ✅ Keep as-is (per user) |
| 6d | No founder origin story / bio — add 2–3 sentence founder note above team grid (NC10) | ✅ Replaced entire section with home page `LandingWhoWeAre` component per user request |

**NC10 Recommended founder note (Status: Replaced by home page WhoWeAre card):**
> "UI Pirate started in 2015 when I got tired of design hand-offs that fell apart in engineering. We are built around one idea: the people who design the product should be able to ship it."

---

## 7. TECHNOLOGY STACK + INDUSTRIES (🟠 Trim industries)

**File:** `app/about/page.tsx` L26–46

| # | Item | Status |
|---|------|--------|
| 7a | Tech stack: Angular, React, Next.js, TypeScript, Tailwind, Framer, Figma, GSAP — correct | ✅ Front-end row done — but backend/cloud missing, see §15 (AD1) |
| 7a-2 | `technologies` array now also has `Node.js` + `Python` entries, but `/assets/logos/nodejs.svg` and `/assets/logos/python.svg` **do not exist** — chips render broken | ❌ Fix in §15 AD1 (add SVGs or ship text-only chips) 🟠 |
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
| 13d | Schema description claims `Node.js and Python` — not shown in visible tech stack (NF8) | ⚠️ Reopened — chips added to array but render broken (7a-2); real fix is the full backend/cloud row in §15 AD1 |
| 13h | `knowsAbout[]` has no cloud / backend / AI-agent entries | ❌ Add `Cloud Deployment`, `AWS`, `Node.js Development`, `Python Development`, `AI Agent Development` (§15 AD1) 🟡 |
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

## 15. MARKET-DEMAND CHANGES (v4–v6 — Upwork job scan)

Source: `04-about-page.md` v4 (NC-D1, NC-D2), v5 (AD1, AD2), v6 (AD1–AD3, final copy).
Driver: live scan of ~80 Upwork postings — "AI SaaS" is ~1 in 4 buyer searches; AWS/GCP/Azure/Python/Node/"AI agents" recur in job skills; a distinct small-fast-cheap first-engagement buyer exists.

### 15.1 Already shipped before v6 (no action — recorded so v4/v5 aren't re-done)

| # | Item | Status |
|---|------|--------|
| 15.1a | Bento cards already renamed (Built to Convert / Design Through to Code / 50+ Products, Not Guesses) | ✅ Live |
| 15.1b | "Design Through to Code" already names React/Angular/Next.js | ✅ Live |
| 15.1c | Industries list already includes `AI Products & Platforms`, trimmed to 5 | ✅ Live |
| 15.1d | Schema `description` already claims Node.js + Python full-stack | ✅ Live (but see 15.2) |

### 15.2 AD1 — Technology Stack: real backend/cloud row + fix broken chips 🟠

**File:** `app/about/page.tsx` — `technologies` array (~L36–47), render block (~L666–692), `knowsAbout[]` (~L135–149).

| # | Item | Status |
|---|------|--------|
| 15.2a | Add logo assets `nodejs.svg`, `python.svg`, `aws.svg`, `gcp.svg`, `azure.svg`, `ai-agents.svg` to `public/assets/logos/` — until they exist, render new items as text-only chips (no `<img>`) | ❌ Not done |
| 15.2b | Final `technologies` order: `Angular, React, Next.js, TypeScript, Tailwind CSS, Framer, Figma, GSAP, Node.js, Python, AWS, GCP, Azure, AI Agents / LLM APIs` | ❌ Not done |
| 15.2c | Optional: split render into two labelled rows — "Design & Front-End" / "Back-End, Cloud & AI" | 🟡 Optional |
| 15.2d | Add to `knowsAbout[]`: `Cloud Deployment`, `AWS`, `Node.js Development`, `Python Development`, `AI Agent Development` | ❌ Not done 🟡 |
| 15.2e | **Do NOT** add `.NET` / `C#` / `ASP.NET` anywhere; Angular stays as-is, no extra emphasis | 🚫 Guardrail (user decision 2026-09-09) |

### 15.3 AD2 — Name AI product work + a low-commitment entry point in visible prose 🟠

| # | Item | File (approx.) | Status |
|---|------|------|--------|
| 15.3a | Hero subheadline — add "AI product teams" + "blank page or a prototype built with an AI tool" clause | `page.tsx` L295–300 | ✅ Done (full version applied) |
| 15.3b | If 15.3a clause is too long for layout — instead edit bento card 04 desc to mention "an AI-generated prototype" | `page.tsx` L433–439 | 🚫 Not needed — 15.3a full version kept |
| 15.3c | CTA section subheadline — "Whether it's a quick UX audit or a full product build…" | `page.tsx` L784–787 | ❌ Not done |

**15.3a final copy (apply verbatim):**
> We are a product design and development studio. We help SaaS founders, enterprise teams, and AI product teams think through the product, design for real users, and ship production-ready code — whether you're starting from a blank page or a prototype built with an AI tool.

**15.3b alt copy (only if 15.3a clause is cut):**
> Wireframes — or an AI-generated prototype — to production React, Angular, and Next.js. One team, no hand-offs.

**15.3c final copy (apply verbatim):**
> Book a free 15-minute call. Whether it's a quick UX audit or a full product build, tell us where you are — we'll tell you the fastest path forward.

### 15.4 AD3 — SEO metadata keyword top-up 🟡

**File:** `app/about/layout.tsx`

| # | Item | Status |
|---|------|--------|
| 15.4a | Append to `keywords`: `AI SaaS development, Node.js Python backend, AWS GCP Azure deployment, take AI prototype to production` | ❌ Not done |
| 15.4b | `title`, `description`, OG, Twitter — no change (settled in §11) | ✅ Keep as-is |

### 15.5 Explicitly NOT doing

| # | Item | Status |
|---|------|--------|
| 15.5a | New "start small" section on About | 🚫 Won't do — handled by the one CTA line (15.3c) |
| 15.5b | `/services` hub page (`05-services-pages.md` X2/NC8) | 🚫 Won't do — intentional (user decision 2026-09-09) |
| 15.5c | Team / stats / client grid / process / FAQ changes | 🚫 Not touched by market findings |
| 15.5d | Any `.NET` / `C#` language | 🚫 Out of scope (15.2e) |

---
