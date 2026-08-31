# Landing Page Audit Checklist

This document tracks the progress of content and copy changes on the landing page.
Synced to **`01-landing-page.md` v3 (2026-08-31)** — all statuses are code-verified against live source files.

---

## How to read this

- ✅ **Done** — verified in source code
- ❌ **Not done** — confirmed still wrong in source code
- ⚠️ **Needs check** — not fully verified from source (e.g. CMS, runtime state)
- 🔴 **Fix now** — errors actively damaging trust/credibility
- 🟠 **Soon** — conversion and positioning improvements
- 🟡 **Consider** — polish and copy quality

---

## 1. HERO (✅ Section complete)

| # | Item | Status | File |
|---|------|--------|------|
| 1a | Trust Badge: now reads "50+ Products Shipped Across 6 Countries" | ✅ Done | `hero/index.tsx` |
| 1b | H1: "A Design & Development Agency for SaaS Teams That Need to Ship" | ✅ Done | `hero/AnimatedHeadline.tsx` |
| 1c | Sub-headline: "You have a product to build…" | ✅ Done | `hero/index.tsx` |
| 1d | Primary CTA: "Tell Us Your Idea — Free Consultation" → `/contact` | ✅ Done | `hero/index.tsx` |
| 1e | Secondary CTA: WhatsApp removed, replaced with "Book a 15-Min Call →" cal.com link | ✅ Done | `hero/index.tsx` |

---

## 2. SEO METADATA (✅ Section complete)

| # | Item | Status | Location |
|---|------|--------|----------|
| 2a | **Title tag** — updated to: `UI Pirate — SaaS Product Design & Development Agency | Ship Faster` | ✅ Done | `page.tsx` |
| 2b | **Meta description** — updated to: `We design and build SaaS products...` | ✅ Done | `page.tsx` |
| 2c | **OG title** — updated to: `UI Pirate — SaaS Product Design & Development Agency` | ✅ Done | `page.tsx` |
| 2d | **Twitter title** — updated to: `UI Pirate | Design & Dev for SaaS Teams That Need to Ship` | ✅ Done | `page.tsx` |
| 2e | **Keywords** — removed `AI-driven`, added `product design and development agency` | ✅ Done | `page.tsx` |

**Fixes to apply (`app/page.tsx`):**

- **Title:** `UI Pirate — SaaS Product Design & Development Agency | Ship Faster`
- **Meta description:** `We design and build SaaS products from first wireframe to working software. 50+ products shipped across 6 countries. Book a free 15-minute consultation.`
- **OG title:** `UI Pirate — SaaS Product Design & Development Agency`
- **Twitter title:** `UI Pirate | Design & Dev for SaaS Teams That Need to Ship`
- **OG/Twitter description:** `We help SaaS founders and enterprise teams design, build, and ship products. 50+ shipped. Free 15-min call. uipirate.com`

---

## 3. MARQUEE — CLIENT LOGOS (⚠️ Needs confirmation)

**File:** `screens/landing/marquee/index.tsx`

| # | Item | Status | Location |
|---|------|--------|----------|
| 3a | Section heading: updated to include 40+ product teams and geography | ✅ Done | `marquee/index.tsx` |
| 3b | Placeholder logo entry | ❌ Kept as-is | `marquee/index.tsx` |
| 3c | Company name text labels under logos | ⚠️ Needs rethink/confirmation | `marquee/index.tsx` |

---

## 4. FIT CHECK / PRICING PERFECT FOR (❌ All items still open — 🟠 Soon)

**File:** `screens/pricing/perfectFor/index.tsx`

| # | Item | Status | Priority |
|---|------|--------|----------|
| 4a | Move `PricingPerfectFor` to after Marquee | ✅ Kept in place | 🟠 Soon |
| 4b | "FIT CHECK" badge too casual for enterprise buyers; replace with "WHO IT'S FOR" | ✅ Done | 🟡 Consider |
| 4c | Audience card descriptions need rewriting | ✅ Done | 🟠 Soon |
| 4d | Emoji icons in "Not the right fit" strip (📦 🎨 ⏰); replace with clean × or dash icons | ✅ Done (replaced with ✕) | 🟠 Soon |
| 4e | Fix layout: apply left/right container padding so it doesn't stretch full width | ✅ Done | 🔴 Fix now |

---

## 5. SERVICES — BentoGrid (✅ Section complete)

**File:** `screens/landing/bentoGrid/bentoGrid.tsx`

| # | Card | Current text in code | Status |
|---|------|----------------------|--------|
| 5a | UX/UI Design | `User-centric interfaces that convert. We craft pixel-perfect experiences` | ✅ Done |
| 5b | Dashboards & SaaS UX | `Clean and data-driven` | ✅ Done |
| 5c | Websites & Landing Pages | `Fast, conversion-focused sites` | ✅ Done |
| 5d | Built With the Best | `Figma, React, Angular, Blender & more.` | ✅ Done |

**Recommended copy (buyer-outcome focused):**

| Card | Replace with |
|------|-------------|
| UX/UI Design | `Interfaces your users stay in. We design flows that reduce friction and move people toward action.` |
| Dashboards & SaaS UX | `Complex data made simple to read, act on, and present to stakeholders.` |
| Websites & Landing Pages | `Pages built to convert visitors into leads — not just to look good on Awwwards.` |
| Built With the Best | `React, Angular, Next.js, Figma, GSAP — we use what your product actually needs, not what's trending.` |

---

## 6. SERVICES — MiniService Heading (✅ Section complete)

**File:** `screens/landing/miniService/miniService.tsx`

| # | Item | Status | Location |
|---|------|--------|----------|
| 6a | Heading reads "We design world-class products." — "world-class" is on the words-to-avoid list | ✅ Done | `miniService.tsx` L11 |

**Suggested fix:** `We design products that ship. You launch them.`

---

## 7. SERVICES — BusinessHelp / ServicesSection (❌ All items still open)

**File:** `screens/landing/businessHelp/servicesSection.tsx`

| # | Item | Current text in code | Status | Priority |
|---|------|----------------------|--------|----------|
| 7a | Service list — wrong casing | `Saas & AI Development` (L64) | ❌ Not done | 🔴 Fix now |
| 7b | Orange banner header — wrong casing + filler phrase | `AI Apps, Saas, Websites & More` (L152) | ❌ Not done | 🔴 Fix now |
| 7c | Black card heading — generic agency phrase | `One-stop shop for all your essentials` (L191) | ❌ Not done | 🟡 Consider |
| 7d | Bottom CTA — vague, no action described | `Let's Talk` (L228) | ❌ Not done | 🟡 Consider |

**Fixes:**
- 7a → `SaaS & AI Development`
- 7b → `AI Apps, SaaS & Business Websites`
- 7c → `Design and development, handled by one team`
- 7d → `Tell Us What You Need →` (links to `/contact`)

---

## 8. WHO WE ARE (❌ All items still open — 🔴 Fix now)

**File:** `screens/landing/whoWeAre/index.tsx`

Current text at **L79** — renders at large animated size, most visible copy error on the page:

> `UI Pirate is a global UI/UX Design & Development Studio, helping SaaS founders & enterprise teams build high-performing products that ships faster, looks premium, and scales without design debt.`

| # | Problem | Status |
|---|---------|--------|
| 8a | `products that ships faster` — subject-verb disagreement | ❌ Not done |
| 8b | `Studio` — identity inconsistency (every other section says "Agency") | ❌ Not done |
| 8c | `global` — overstated claim, no evidence of a global office or team | ❌ Not done |
| 8d | `design debt` — designer jargon, not buyer language | ❌ Not done |
| 8e | Missing primary SEO keyword: `product design and development agency` | ❌ Not done |

**Recommended replacement — fixes all 5 issues and adds primary SEO keyword:**

> `UI Pirate is a product design and development agency. We help SaaS founders and enterprise teams design, build, and ship products that look premium, perform well, and hold up as they grow.`

---

## 9. STATS / ABOUT CARDS (❌ Most sub-labels still wrong — 🟠 Soon)

**File:** `screens/landing/about/aboutCard.tsx`

| # | Card | Current sub-label (in code) | Problem | Status |
|---|------|----------------------------|---------|--------|
| 9a | 9+ Years | `From MVPs to complex dashboards, shipped across 6 countries` (L11) | Belongs to the 6 Locations card | ❌ Not done |
| 9b | 50+ Projects | `Including AI tools, HR platforms, fintech apps, and B2B SaaS products` | Correct — keep as-is | ✅ Done |
| 9c | $150M+ | `SaaS, EdTech, FinTech, HealthTech, LegalTech, Creator Economy, and more` (L31) | Lists industries, not what "$150M+ Made by our clients" actually means | ❌ Not done |
| 9d | 6 Locations | `Built for scale, speed, and seamless handoff to developers` (L40) | Describes product quality, not geography | ❌ Not done |

**Fixes:**
- 9a → `Established 2015. Enterprise platforms, AI tools, fintech apps, SaaS dashboards — and everything in between.`
- 9c → `Raised in funding by companies we've helped design and ship. FinTech, HealthTech, SaaS, and beyond.`
- 9d → `USA · UK · Singapore · India · Australia · and growing.`

---

## 10. MINI PROCESS (⚠️ Needs check — 🟠 Soon)

**File:** `screens/landing/miniProcess/index.tsx`

| # | Item | Status |
|---|------|--------|
| 10a | Section heading "From Idea to Shipped, in 3 Steps" — correct and clear | ✅ Done |
| 10b | Step descriptions: joined from `data/process.ts` via `.join(" ")` — review rendered text to confirm joined sentences read naturally, not like two descriptions stapled together | ⚠️ Needs check |
| 10c | "See the full process →" link goes to `/process` — confirm this page exists with real content before this link goes live (a 404 undermines the section's trust signal) | ⚠️ Needs check |

---

## 11. BEHANCE / WORKS GALLERY (⚠️ Needs check — 🟠 Soon)

**File:** `screens/landing/behance/LandingBehance.tsx`

| # | Item | Status |
|---|------|--------|
| 11a | Portfolio links — still pointing to external Behance URLs (conversion leak — visitor leaves site, session lost), or updated to `/case-studies/[slug]`? | ⚠️ Needs check |

---

## 12. FEATURED CASE STUDY (⚠️ Needs check — 🟠 Soon)

**File:** `screens/landing/featuredCaseStudy/index.tsx`

| # | Item | Status |
|---|------|--------|
| 12a | Static copy ("featured case study" badge, "Read the full case study →") — clean and minimal | ✅ Done |
| 12b | CMS: at least 1 case study must have a real metric (value + label) + a non-placeholder hero image. Without this the section renders null and the page skips from gallery to "Who We Are" with no case study proof | ⚠️ Needs CMS check |
| 12c | Missing: client industry tag (e.g. "FinTech") and client logo on the featured card | ❌ Not done |

---

## 13. PRICING SECTION (❌ All items still open — 🔴–🟡)

**File:** `screens/landing/pricing/index.tsx`  
See `03-pricing-page.md` for full details.

| # | Item | Status | Priority |
|---|------|--------|----------|
| 13a | Section heading "Pricing That Makes Sense" — replace with outcome-focused heading | ❌ Not done | 🟠 Soon |
| 13b | Monthly Retainer subtitle — lead with the pain, not the feature | ❌ Not done | 🟠 Soon |
| 13c | 5-Day Pilot — fix broken sentence "shows you see our execution" | ❌ Not done | 🔴 Fix now |
| 13d | Scarcity message "Only accepting 2 new clients this month" — make real or replace | ❌ Not done | 🟠 Soon |
| 13e | Custom Quote audience — "enterprise needs & startups" — pick one specific audience | ❌ Not done | 🟠 Soon |
| 13f | Satisfaction Guarantee — replace "companies like yours" with actual client names | ❌ Not done | 🟡 Consider |

---

## 14. TEAM SECTION (✅ No issues flagged)

**File:** `screens/landing/theTeam/index.tsx`

No outstanding copy or content issues identified. Carry forward for a future audit pass if needed.

---

## 15. TESTIMONIALS (❌ Most items still open — 🟠 Soon)

**Files:** `screens/landing/testimonials/testimonialCards.tsx` · `data/testimonials.json`

| # | Item | Status | Priority |
|---|------|--------|----------|
| 15a | No section heading above testimonial cards — add "What Clients Say" H2 | ❌ Not done | 🟠 Soon |
| 15b | No star ratings on testimonial cards (stars only appear in hero tooltip) — add ★★★★★ to each card | ❌ Not done | 🟠 Soon |
| 15c | Verify `occupation` and `company` fields in `testimonials.json` for Eden Hazani, Priyanka Padhye, Rohit Kumar Jha — hero tooltip shows correct data; confirm source JSON also matches | ⚠️ Needs check | 🟠 Soon |
| 15d | Kyle Drucker (YouTuber / "BBallExplained") testimonial — inconsistent with enterprise B2B positioning | ❌ Not done | 🟡 Consider |
| 15e | 3 generic one-liner testimonials with no P-S-O structure — request expanded versions or deprioritize in grid | ❌ Not done | 🟡 Consider |

---

## 16. FAQs (❌ All items still open — 🟠 Soon)

**File:** `screens/landing/faqs/accordion.tsx`

| # | Item | Current state | Status | Priority |
|---|------|---------------|--------|----------|
| 16a | First 4 FAQ questions — still about pricing model differences, hourly vs fixed, plan selection, and timelines. Need to be buyer-blocker questions | Operational questions | ❌ Not done | 🟠 Soon |
| 16b | 📍 emoji labels in answers — `📍 Example Use Case`, `📍 Need Help Choosing?`, `📍 Getting in Touch`, etc. | Still present | ❌ Not done | 🟠 Soon |
| 16c | WhatsApp references in "How do we get started?" — `email or WhatsApp us` + `reach out via WhatsApp` (L147–150) | Both still present | ❌ Not done | 🟠 Soon |

**Replacement buyer-blocker questions (full Q&A copy in `01-landing-page.md` section NC2):**

| # | Question to add | Blocker it removes |
|---|----------------|--------------------|
| Q1 | What types of companies do you typically work with? | Is this agency right for my company type? |
| Q2 | You're based in India — how does communication and time zone work for US/UK clients? | Timezone/communication risk — #1 unstated US buyer concern |
| Q3 | What makes UI Pirate different from Toptal, Clutch, or a local agency? | Why not go with a better-known option? |
| Q4 | What does the process look like after I reach out? | Contacting feels like a commitment — what actually happens next? |

**WhatsApp fix for L147–150:**
```
Book a free 15-minute call at cal.com/ui-pirate/15min or email
vishal@uipirate.com with a brief description of your project.
We typically respond within one business day.
```

---

## 17. NEW SECTIONS — STRUCTURAL ISSUES (v2 additions, mostly unresolved)

| # | Issue | Status | Priority |
|---|-------|--------|----------|
| 17a | `/process` page — confirm it exists with real content before "See the full process →" link goes live | ⚠️ Needs check | 🟠 Soon |
| 17b | `FeaturedCaseStudy` — populate at least 1 CMS case study with metric + valid image to prevent silent null render | ⚠️ Needs check | 🟠 Soon |

---

## Priority Summary

### 🔴 Fix Now — Active trust damage (do these first)

| File | Item |
|------|------|
| `whoWeAre/index.tsx` L79 | Grammar error "products that ships faster" + "Studio" + "global" — one sentence replacement fixes all |
| `servicesSection.tsx` L64 | `Saas & AI Development` → `SaaS & AI Development` |
| `servicesSection.tsx` L152 | `AI Apps, Saas, Websites & More` → `AI Apps, SaaS & Business Websites` |
| `pricing/index.tsx` | "shows you see our execution" — broken sentence |

### 🟠 Soon — Conversion and positioning

| File | Item |
|------|------|
| `faqs/accordion.tsx` | Replace first 4 questions with buyer-blocker questions |
| `faqs/accordion.tsx` | Remove 📍 emoji labels from all answers |
| `faqs/accordion.tsx` L147–150 | Remove WhatsApp references; point to cal.com + email |
| `testimonialCards.tsx` | Add "What Clients Say" H2 above testimonial grid |
| `testimonialCards.tsx` | Add ★★★★★ star ratings to each card |
| `aboutCard.tsx` L11, L31, L40 | Fix 3 wrong sub-labels (Years, $150M+, 6 Locations) |

### 🟡 Consider — Polish and strategic copy

| File | Item |
|------|------|
| `servicesSection.tsx` L191 | Replace "One-stop shop for all your essentials" heading |
| `servicesSection.tsx` L228 | Replace "Let's Talk" CTA with "Tell Us What You Need →" |
| `marquee/index.tsx` | Add company name text labels (⚠️ Needs rethink/confirmation) |
| `data/testimonials.json` | Remove or reposition Kyle Drucker (YouTuber) testimonial |
| `data/testimonials.json` | Request expanded P-S-O testimonials from 3 generic reviewers |
| `featuredCaseStudy/index.tsx` | Add client industry tag + logo to the featured case study card |

---

*Last updated: 2026-08-31 — synced to `01-landing-page.md` v3. All ❌ statuses code-verified against live source files.*
