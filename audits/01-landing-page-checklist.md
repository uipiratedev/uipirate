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

## 3. MARQUEE — CLIENT LOGOS (❌ All items still open — 🟠 Soon)

**File:** `screens/landing/marquee/index.tsx`

| # | Item | Status | Location |
|---|------|--------|----------|
| 3a | Section heading still reads "Trusted by Teams / Building the Future of SaaS and AI" — no quantity, no geography | ❌ Not done | `marquee/index.tsx` L127–132 |
| 3b | Placeholder logo entry: `alt: "Partner company logo"`, `link: ""` — fix or remove | ❌ Not done | `marquee/index.tsx` L92–95 |
| 3c | No company name text labels under logos — unrecognized brands have no context for US buyer | ❌ Not done | `marquee/index.tsx` |

**Fix for 3a — copy-paste ready:**
```
Trusted by 40+ product teams
across the USA, UK, Singapore & India
```
Move orange highlight from "Trusted by Teams" to `40+` — the number is the credibility signal.

---

## 4. SERVICES — BentoGrid (❌ All items still open — 🟠 Soon)

**File:** `screens/landing/bentoGrid/bentoGrid.tsx`

| # | Card | Current text in code | Status |
|---|------|----------------------|--------|
| 4a | UX/UI Design | `User-centric interfaces that convert. We craft pixel-perfect experiences` | ❌ Not done |
| 4b | Dashboards & SaaS UX | `Clean and data-driven` | ❌ Not done |
| 4c | Websites & Landing Pages | `Fast, conversion-focused sites` | ❌ Not done |
| 4d | Built With the Best | `Figma, React, Angular, Blender & more.` | ❌ Not done |

**Recommended copy (buyer-outcome focused):**

| Card | Replace with |
|------|-------------|
| UX/UI Design | `Interfaces your users stay in. We design flows that reduce friction and move people toward action.` |
| Dashboards & SaaS UX | `Complex data made simple to read, act on, and present to stakeholders.` |
| Websites & Landing Pages | `Pages built to convert visitors into leads — not just to look good on Awwwards.` |
| Built With the Best | `React, Angular, Next.js, Figma, GSAP — we use what your product actually needs, not what's trending.` |

---

## 5. SERVICES — MiniService Heading (❌ Not done — 🟡 Consider)

**File:** `screens/landing/miniService/miniService.tsx`

| # | Item | Status | Location |
|---|------|--------|----------|
| 5a | Heading reads "We design world-class products." — "world-class" is on the words-to-avoid list | ❌ Not done | `miniService.tsx` L11 |

**Suggested fix:** `We design products that ship. You launch them.`

---

## 6. SERVICES — BusinessHelp / ServicesSection (❌ All items still open)

**File:** `screens/landing/businessHelp/servicesSection.tsx`

| # | Item | Current text in code | Status | Priority |
|---|------|----------------------|--------|----------|
| 6a | Service list — wrong casing | `Saas & AI Development` (L64) | ❌ Not done | 🔴 Fix now |
| 6b | Orange banner header — wrong casing + filler phrase | `AI Apps, Saas, Websites & More` (L152) | ❌ Not done | 🔴 Fix now |
| 6c | Black card heading — generic agency phrase | `One-stop shop for all your essentials` (L191) | ❌ Not done | 🟡 Consider |
| 6d | Bottom CTA — vague, no action described | `Let's Talk` (L228) | ❌ Not done | 🟡 Consider |

**Fixes:**
- 6a → `SaaS & AI Development`
- 6b → `AI Apps, SaaS & Business Websites`
- 6c → `Design and development, handled by one team`
- 6d → `Tell Us What You Need →` (links to `/contact`)

---

## 7. WHO WE ARE (❌ All items still open — 🔴 Fix now)

**File:** `screens/landing/whoWeAre/index.tsx`

Current text at **L79** — renders at large animated size, most visible copy error on the page:

> `UI Pirate is a global UI/UX Design & Development Studio, helping SaaS founders & enterprise teams build high-performing products that ships faster, looks premium, and scales without design debt.`

| # | Problem | Status |
|---|---------|--------|
| 7a | `products that ships faster` — subject-verb disagreement | ❌ Not done |
| 7b | `Studio` — identity inconsistency (every other section says "Agency") | ❌ Not done |
| 7c | `global` — overstated claim, no evidence of a global office or team | ❌ Not done |
| 7d | `design debt` — designer jargon, not buyer language | ❌ Not done |
| 7e | Missing primary SEO keyword: `product design and development agency` | ❌ Not done |

**Recommended replacement — fixes all 5 issues and adds primary SEO keyword:**

> `UI Pirate is a product design and development agency. We help SaaS founders and enterprise teams design, build, and ship products that look premium, perform well, and hold up as they grow.`

---

## 8. STATS / ABOUT CARDS (❌ Most sub-labels still wrong — 🟠 Soon)

**File:** `screens/landing/about/aboutCard.tsx`

| # | Card | Current sub-label (in code) | Problem | Status |
|---|------|----------------------------|---------|--------|
| 8a | 9+ Years | `From MVPs to complex dashboards, shipped across 6 countries` (L11) | Belongs to the 6 Locations card | ❌ Not done |
| 8b | 50+ Projects | `Including AI tools, HR platforms, fintech apps, and B2B SaaS products` | Correct — keep as-is | ✅ Done |
| 8c | $150M+ | `SaaS, EdTech, FinTech, HealthTech, LegalTech, Creator Economy, and more` (L31) | Lists industries, not what "$150M+ Made by our clients" actually means | ❌ Not done |
| 8d | 6 Locations | `Built for scale, speed, and seamless handoff to developers` (L40) | Describes product quality, not geography | ❌ Not done |

**Fixes:**
- 8a → `Established 2015. Enterprise platforms, AI tools, fintech apps, SaaS dashboards — and everything in between.`
- 8c → `Raised in funding by companies we've helped design and ship. FinTech, HealthTech, SaaS, and beyond.`
- 8d → `USA · UK · Singapore · India · Australia · and growing.`

---

## 9. MINI PROCESS (⚠️ Needs check — 🟠 Soon)

**File:** `screens/landing/miniProcess/index.tsx`

| # | Item | Status |
|---|------|--------|
| 9a | Section heading "From Idea to Shipped, in 3 Steps" — correct and clear | ✅ Done |
| 9b | Step descriptions: joined from `data/process.ts` via `.join(" ")` — review rendered text to confirm joined sentences read naturally, not like two descriptions stapled together | ⚠️ Needs check |
| 9c | "See the full process →" link goes to `/process` — confirm this page exists with real content before this link goes live (a 404 undermines the section's trust signal) | ⚠️ Needs check |

---

## 10. BEHANCE / WORKS GALLERY (⚠️ Needs check — 🟠 Soon)

**File:** `screens/landing/behance/LandingBehance.tsx`

| # | Item | Status |
|---|------|--------|
| 10a | Portfolio links — still pointing to external Behance URLs (conversion leak — visitor leaves site, session lost), or updated to `/case-studies/[slug]`? | ⚠️ Needs check |

---

## 11. FEATURED CASE STUDY (⚠️ Needs check — 🟠 Soon)

**File:** `screens/landing/featuredCaseStudy/index.tsx`

| # | Item | Status |
|---|------|--------|
| 11a | Static copy ("featured case study" badge, "Read the full case study →") — clean and minimal | ✅ Done |
| 11b | CMS: at least 1 case study must have a real metric (value + label) + a non-placeholder hero image. Without this the section renders null and the page skips from gallery to "Who We Are" with no case study proof | ⚠️ Needs CMS check |
| 11c | Missing: client industry tag (e.g. "FinTech") and client logo on the featured card | ❌ Not done |

---

## 12. PRICING SECTION (❌ All items still open — 🔴–🟡)

**File:** `screens/landing/pricing/index.tsx`  
See `03-pricing-page.md` for full details.

| # | Item | Status | Priority |
|---|------|--------|----------|
| 12a | Section heading "Pricing That Makes Sense" — replace with outcome-focused heading | ❌ Not done | 🟠 Soon |
| 12b | Monthly Retainer subtitle — lead with the pain, not the feature | ❌ Not done | 🟠 Soon |
| 12c | 5-Day Pilot — fix broken sentence "shows you see our execution" | ❌ Not done | 🔴 Fix now |
| 12d | Scarcity message "Only accepting 2 new clients this month" — make real or replace | ❌ Not done | 🟠 Soon |
| 12e | Custom Quote audience — "enterprise needs & startups" — pick one specific audience | ❌ Not done | 🟠 Soon |
| 12f | Satisfaction Guarantee — replace "companies like yours" with actual client names | ❌ Not done | 🟡 Consider |

---

## 13. TEAM SECTION (✅ No issues flagged)

**File:** `screens/landing/theTeam/index.tsx`

No outstanding copy or content issues identified. Carry forward for a future audit pass if needed.

---

## 14. TESTIMONIALS (❌ Most items still open — 🟠 Soon)

**Files:** `screens/landing/testimonials/testimonialCards.tsx` · `data/testimonials.json`

| # | Item | Status | Priority |
|---|------|--------|----------|
| 14a | No section heading above testimonial cards — add "What Clients Say" H2 | ❌ Not done | 🟠 Soon |
| 14b | No star ratings on testimonial cards (stars only appear in hero tooltip) — add ★★★★★ to each card | ❌ Not done | 🟠 Soon |
| 14c | Verify `occupation` and `company` fields in `testimonials.json` for Eden Hazani, Priyanka Padhye, Rohit Kumar Jha — hero tooltip shows correct data; confirm source JSON also matches | ⚠️ Needs check | 🟠 Soon |
| 14d | Kyle Drucker (YouTuber / "BBallExplained") testimonial — inconsistent with enterprise B2B positioning | ❌ Not done | 🟡 Consider |
| 14e | 3 generic one-liner testimonials with no P-S-O structure — request expanded versions or deprioritize in grid | ❌ Not done | 🟡 Consider |

---

## 15. FAQs (❌ All items still open — 🟠 Soon)

**File:** `screens/landing/faqs/accordion.tsx`

| # | Item | Current state | Status | Priority |
|---|------|---------------|--------|----------|
| 15a | First 4 FAQ questions — still about pricing model differences, hourly vs fixed, plan selection, and timelines. Need to be buyer-blocker questions | Operational questions | ❌ Not done | 🟠 Soon |
| 15b | 📍 emoji labels in answers — `📍 Example Use Case`, `📍 Need Help Choosing?`, `📍 Getting in Touch`, etc. | Still present | ❌ Not done | 🟠 Soon |
| 15c | WhatsApp references in "How do we get started?" — `email or WhatsApp us` + `reach out via WhatsApp` (L147–150) | Both still present | ❌ Not done | 🟠 Soon |

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

## 16. NEW SECTIONS — STRUCTURAL ISSUES (v2 additions, mostly unresolved)

| # | Issue | Status | Priority |
|---|-------|--------|----------|
| 16a | `PricingPerfectFor` placed before Services — visitor sees audience filter before they've seen what UI Pirate does. Move to after BentoGrid or MiniProcess | ❌ Not moved | 🟠 Soon |
| 16b | `PricingPerfectFor` — "FIT CHECK" badge too casual for enterprise buyers; replace with "WHO IT'S FOR" | ❌ Not done | 🟡 Consider |
| 16c | `PricingPerfectFor` — Audience card descriptions need rewriting (see `01-landing-page.md` Section 3b for full copy) | ❌ Not done | 🟠 Soon |
| 16d | `PricingPerfectFor` — Emoji icons in "Not the right fit" strip (📦 🎨 ⏰); replace with clean × or dash icons | ❌ Not done | 🟠 Soon |
| 16e | `/process` page — confirm it exists with real content before "See the full process →" link goes live | ⚠️ Needs check | 🟠 Soon |
| 16f | `FeaturedCaseStudy` — populate at least 1 CMS case study with metric + valid image to prevent silent null render | ⚠️ Needs check | 🟠 Soon |

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
| `marquee/index.tsx` L127–132 | Section heading: remove "Building the Future", add `40+` quantity + geography |
| `marquee/index.tsx` L92–95 | Placeholder logo: no alt text, no link — fix or remove |
| `faqs/accordion.tsx` | Replace first 4 questions with buyer-blocker questions |
| `faqs/accordion.tsx` | Remove 📍 emoji labels from all answers |
| `faqs/accordion.tsx` L147–150 | Remove WhatsApp references; point to cal.com + email |
| `testimonialCards.tsx` | Add "What Clients Say" H2 above testimonial grid |
| `testimonialCards.tsx` | Add ★★★★★ star ratings to each card |
| `aboutCard.tsx` L11, L31, L40 | Fix 3 wrong sub-labels (Years, $150M+, 6 Locations) |
| `bentoGrid.tsx` | Rewrite all 4 card descriptions with buyer-outcome copy |
| `screens/landing/index.tsx` | Move `PricingPerfectFor` to after BentoGrid |
| `perfectFor/index.tsx` | Rewrite audience card descriptions |
| `perfectFor/index.tsx` | Replace emoji icons in "Not the right fit" strip |

### 🟡 Consider — Polish and strategic copy

| File | Item |
|------|------|
| `servicesSection.tsx` L191 | Replace "One-stop shop for all your essentials" heading |
| `servicesSection.tsx` L228 | Replace "Let's Talk" CTA with "Tell Us What You Need →" |
| `miniService.tsx` L11 | Replace "world-class" in section heading |
| `data/testimonials.json` | Remove or reposition Kyle Drucker (YouTuber) testimonial |
| `data/testimonials.json` | Request expanded P-S-O testimonials from 3 generic reviewers |
| `perfectFor/index.tsx` | Replace "FIT CHECK" badge with "WHO IT'S FOR" |
| `featuredCaseStudy/index.tsx` | Add client industry tag + logo to the featured case study card |

---

*Last updated: 2026-08-31 — synced to `01-landing-page.md` v3. All ❌ statuses code-verified against live source files.*
