# Pricing Page Audit Checklist

This document tracks the progress of all content, copy, SEO, and conversion changes on the pricing page.
Synced to **`03-pricing-page.md` v4 (2026-09-01)** — all statuses are code-verified against live source files.

**Files in scope:**
- `app/pricing/page.tsx` — SEO metadata + JSON-LD schema
- `screens/landing/pricing/index.tsx` — Pricing cards (shared component)
- `screens/pricing/hero/index.tsx` — Pricing page hero
- `screens/pricing/perfectFor/index.tsx` — "Who It's For" section
- `screens/pricing/tryBeforeCommit/index.tsx` — 5-Day Pilot section
- `screens/pricing/faq/index.tsx` — Pricing FAQ
- `screens/pricing/comparison/index.tsx` — Comparison table

---

## How to read this

- ✅ **Done** — verified in source code
- ❌ **Not done** — confirmed still wrong in source code
- ⚠️ **Partially done** — in progress or needs further work
- 🔴 **Fix now** — errors actively damaging trust/credibility
- 🟠 **Soon** — conversion and positioning improvements
- 🟡 **Consider** — polish and copy quality

---

## 1. SEO METADATA & SCHEMA (⚠️ Price mismatch — urgent)

**File:** `app/pricing/page.tsx`

> **Critical:** The pricing card component now shows **`from $500/per month`** but all SEO metadata and JSON-LD schema still reference the old `$2,000/mo` price. This creates a mismatch between what Google indexes and what users see on the page.

| # | Item | Current value | Status | Priority |
|---|------|---------------|--------|----------|
| 1a | Page title — still says `$2000/mo` | `UI/UX Design Pricing \| from $500/mo Unlimited` | ✅ Done | — |
| 1b | Meta description — still says `$2000/mo` | `UI/UX design from $500/mo...` | ✅ Done | — |
| 1c | OG title — still says `$2000/mo` | `UI/UX Design Pricing \| from $500/mo Unlimited · Save 50-70% vs Agencies` | ✅ Done | — |
| 1d | OG description — still says `$2000/mo` | `Unlimited design requests from $500/mo...` | ✅ Done | — |
| 1e | Twitter title — still says `$2000/mo` | `UI/UX Design \| from $500/mo Unlimited · 48hr Turnaround` | ✅ Done | — |
| 1f | JSON-LD offer price — still "price": "2000" for Monthly Retainer | `price: "500"` in schema | ✅ Done | — |
| 1g | Savings % inconsistency — meta says 60%, hero says 50-70% | Aligned to 50-70% | ✅ Done | — |
| 1h | Keyword: remove `cheap UI design agency` and `affordable UX design` | Present in keywords array | ❌ Not done | 🟡 Consider |
| 1i | Keywords: add `design subscription agency`, `SaaS design retainer`, `unlimited design requests pricing` | Missing | ❌ Not done | 🟡 Consider |
| 1j | `priceValidUntil: "2026-12-31"` in JSON-LD — update before Dec 31 2026 | Static date | ❌ Not done | 🟡 Consider |
| 1k | `reviewCount: 50` in schema not verifiable on-page (no visible count for users) | Not visible | ❌ Not done | 🟡 Consider |

---

## 2. HERO SECTION (⚠️ One open item)

**File:** `screens/pricing/hero/index.tsx`

| # | Item | Status | Priority |
|---|------|--------|----------|
| 2a | H1: `Simple, Transparent Pricing` — clear, anxiety-reducing | ✅ Done | — |
| 2b | Subheadline: `No hidden fees. No surprise invoices...` | ✅ Done | — |
| 2c | Trust stats: `50+`, `5.0★`, `<2hr`, `9yr+` | ✅ Done | — |
| 2d | `Save 50-70%` pill — price anchoring before cards | ✅ Done | — |
| 2e | `Book a Call →` links to `/contact` — should be `cal.com/ui-pirate/15min` | ✅ Done | — |
| 2f | PDF download confirmed at `/public/uipirate-pricing-2026.pdf` | ✅ Done | — |
| 2g | `5.0★` — star glyph in numeric value, parsing ambiguity | ❌ Not done | 🟡 Consider |

---

## 3. PRICING CARDS — Monthly Retainer (✅ Mostly done)

**File:** `screens/landing/pricing/index.tsx`

| # | Item | Status | Priority |
|---|------|--------|----------|
| 3a | Section heading updated from `Pricing That Makes Sense` | ✅ Done — now `Transparent Pricing for SaaS Teams` | — |
| 3b | Monthly Retainer subtitle — outcome-focused copy | ✅ Done — `Your dedicated design and development team — without the full-time headcount` | — |
| 3c | `One subscription, endless possibilities` — consumer-app phrase | ✅ Done | 🟡 Consider |
| 3d | CTA: `Chat on WhatsApp` → `Get Started →` cal.com | ✅ Done | — |
| 3e | Price: component shows `from $500` | ✅ Done | — |
| 3f | Feature list: `5/7 Communication` → `Mon–Fri communication, < 2hr response` | ✅ Done | — |

---

## 4. PRICING CARDS — Custom Quote (⚠️ One open item)

**File:** `screens/landing/pricing/index.tsx`

| # | Item | Status | Priority |
|---|------|--------|----------|
| 4a | CTA (desktop): `Chat on WhatsApp` → `Book a Discovery Call →` cal.com | ✅ Done | — |
| 4b | CTA (mobile): `Chat on WhatsApp` → `Book a Discovery Call →` cal.com | ✅ Done | — |
| 4c | Subtitle: `For complex products, enterprise needs & startups` — pick one audience | ✅ Done | 🟠 Soon |
| 4d | Feature list: `5/7 Communication` → `Mon–Fri communication, < 2hr response` | ✅ Done | — |

---

## 5. SCARCITY & GUARANTEE (⚠️ Partially done)

**File:** `screens/landing/pricing/index.tsx`

| # | Item | Status | Priority |
|---|------|--------|----------|
| 5a | Scarcity message — copy updated but still static | ✅ Done | 🟠 Soon |
| 5b | Two scarcity signals conflict (card: `2 new clients/month` + pilot: `Limited slots`) | ✅ Done | 🟡 Consider |
| 5c | Guarantee — `companies like yours` replaced with real client names | ✅ Done — now names Ipsos, Khaitan & Co, RevUp AI | — |
| 5d | Benefits row broken sentence fixed | ✅ Done — `lets you see our execution quality` | — |

---

## 6. WHO IT'S FOR / PERFECTFOR (⚠️ Card rewrites still open)

**File:** `screens/pricing/perfectFor/index.tsx`

| # | Item | Status | Priority |
|---|------|--------|----------|
| 6a | `FIT CHECK` badge → `WHO IT'S FOR` | ✅ Done | — |
| 6b | Emoji icons in "Not the right fit" strip → ✕ icons | ✅ Done | — |
| 6c | `Funded Startups` card — `Ship fast and impress investors...` | ✅ Done | 🟠 Soon |
| 6d | `SaaS Companies` card — `Without in-house design teams, needing...` (dependent clause, no subject) | ✅ Done | 🟠 Soon |
| 6e | `Agencies` card — passive, needs active rewrite | ✅ Done | 🟠 Soon |
| 6f | `Enterprise Teams` card — already strong | ✅ Keep as-is | — |

---

## 7. 5-DAY PILOT / TRYBEFORECOMMIT (⚠️ Tier descriptions open)

**File:** `screens/pricing/tryBeforeCommit/index.tsx`

| # | Item | Status | Priority |
|---|------|--------|----------|
| 7a | `ZERO RISK` badge — keep | ✅ Done | — |
| 7b | `5-Day Pilot Project` heading — direct and clear | ✅ Done | — |
| 7c | Pilot description: `...fully deductible from the final project invoice` | ✅ Done | — |
| 7d | CTA: `Start Your Pilot Project` → cal.com | ✅ Done | — |
| 7e | Pilot tier descriptions — still placeholder labels (`UI/UX design sprint`, `Code implementation`, `Full-stack delivery`) | ✅ Done — rewritten to outcomes | 🟠 Soon |

---

## 8. FAQ SECTION (⚠️ Two items open)

**File:** `screens/pricing/faq/index.tsx`

| # | Item | Status | Priority |
|---|------|--------|----------|
| 8a | 6 buyer-blocker questions present (pause, satisfaction, turnaround, exclusions, pilot, switching) | ✅ Done | — |
| 8b | Missing FAQ: `How much does UI/UX design cost?` — highest-volume transactional query | ❌ Not done | 🟠 Soon |
| 8c | FAQ CTA: `Chat With Us` has no href — replace with `Book a Free 15-Min Call →` cal.com | ❌ Not done | 🟠 Soon |

---

## 9. COMPARISON TABLE (⚠️ Price still old)

**File:** `screens/pricing/comparison/index.tsx`

| # | Item | Status | Priority |
|---|------|--------|----------|
| 9a | Heading `How We Stack Up` — clear and direct | ✅ Done | — |
| 9b | Subtext — benefit-framed, references 50+ companies | ✅ Done | — |
| 9c | Monthly cost row still shows `$2,000` — update to `from $500` | ✅ Done | 🔴 Fix now |
| 9d | `Enterprise` quality claim is self-assessed — link to case studies | ✅ Done — replaced with '50+ Shipped Products' | 🟡 Consider |
| 9e | `Slow` for In-House — add timeframe for credibility: `Slow (1-3 weeks)` | ✅ Done | 🟡 Consider |

---

## 10. CLIENT LOGOS STRIP (✅ Done)

**File:** `screens/pricing/clientLogos/`

| # | Item | Status | Priority |
|---|------|--------|----------|
| 10a | Placeholder logo (empty alt/link) removed from marquee array | ✅ Done | — |
| 10b | Logo strip positioning — correct (after hero, before cards) | ✅ Done | — |
| 10c | Replaced with landing page marquee component for consistency | ✅ Done | — |

---

## Priority Summary

### 🔴 Fix Now — Critical

| # | Item | File |
|---|------|------|
| 9c | Comparison table monthly cost row still shows `$2,000` — update to `from $500` | `pricing/comparison/index.tsx` |

### 🟠 Soon — Conversion improvements

| # | Item | File |
|---|------|------|
| 4c | Custom Quote subtitle — pick one audience | `landing/pricing/index.tsx` |
| 5a | Scarcity message — make dynamic or replace with always-true copy | `landing/pricing/index.tsx` |
| 6c | `Funded Startups` card rewrite | `pricing/perfectFor/index.tsx` |
| 6d | `SaaS Companies` card rewrite | `pricing/perfectFor/index.tsx` |
| 6e | `Agencies` card rewrite | `pricing/perfectFor/index.tsx` |
| 7e | Pilot tier descriptions — outcome-based rewrites | `tryBeforeCommit/index.tsx` |
| 8b | Add `How much does UI/UX design cost?` FAQ | `pricing/faq/index.tsx` |
| 8c | Replace `Chat With Us` FAQ CTA with cal.com | `pricing/faq/index.tsx` |

### 🟡 Consider — Polish

| # | Item | File |
|---|------|------|
| 3c | `One subscription, endless possibilities` → specific copy | `landing/pricing/index.tsx` |
| 5b | Unify dual scarcity signals | Multiple files |
| 1h | Remove `cheap UI design agency` keyword | `app/pricing/page.tsx` |
| 1i | Add `design subscription agency`, `SaaS design retainer` keywords | `app/pricing/page.tsx` |
| 1j | Update `priceValidUntil` before Dec 31 | `app/pricing/page.tsx` |
| 1k | Add visible review count on-page to match schema | `app/pricing/page.tsx` |
| 2g | Fix `5.0★` parsing ambiguity in trust stats | `pricing/hero/index.tsx` |
| 9d | Replace self-assessed `Enterprise` claim with case study link | `pricing/comparison/index.tsx` |
| 9e | `Slow (1-3 weeks)` for In-House in comparison table | `pricing/comparison/index.tsx` |

---

*Last updated: 2026-09-01 (v1) — Created from `03-pricing-page.md` v4 sync. Reflects all changes made during the landing page audit session. The single most important group of fixes is the SEO/schema price mismatch: the component now shows "from $500" but all metadata still says "$2,000".*
