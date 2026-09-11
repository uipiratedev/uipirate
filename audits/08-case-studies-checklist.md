# Case Studies / Works Page: Redesign Checklist

This document tracks the progress of all content, copy, design, and structural changes on the Case Studies page (`/case-studies`).
Synced to **`08-case-studies-page.md` v2 (2026-09-11)**. Combines the original content audit findings with the new design and structural decisions discussed on 2026-09-11.

**Page aliases:** Nav "Works" → `/case-studies`. Resources → Case Studies → `/case-studies`. Both reach the same URL. This flow is **intentional and kept as-is**.

**Files in scope:**
- `app/case-studies/page.tsx`: route, metadata, ISR
- `screens/caseStudies/index.tsx`: page shell, section order, search, card grid, CTA, pricing block
- `screens/caseStudies/hero/index.tsx`: hero badge, H1, subhead, testimonial cards, stats row
- `screens/caseStudies/ClientLogosMarquee.tsx`: client logos section (to be replaced)
- `screens/caseStudies/CaseStudiesFAQ.tsx`: FAQ section
- Shared: `screens/landing/testimonials/index.tsx`, `screens/landing/whyChoosUs/index.tsx`

---

## How to read this

- ✅ **Done**: verified in source code
- ❌ **Not done**: confirmed still needs work
- ⚠️ **Partially done**: in progress or needs further review
- 🔴 **Fix now**: actively damaging trust, credibility, or SEO
- 🟠 **Soon**: important design and conversion improvement
- 🟡 **Consider**: polish, consistency, quality

---

## 1. HERO SECTION

**File:** `screens/caseStudies/hero/index.tsx`

| # | Item | Priority | Status |
|---|------|----------|--------|
| 1a | Badge: Change `PORTFOLIO & CASE STUDIES` → `CASE STUDIES` (entity name unification) | 🟠 | ✅ |
| 1b | H1: Keep "Real Projects. Real Results." (tagline is good) | 🟢 Keep | ✅ Verified |
| 1c | Subtext: Rewrite to be more specific (see updated copy below) | 🟠 | ✅ |
| 1d | Testimonial cards: Change rainbow gradient border → shimmery orange gradient to match brand style | 🟠 | ✅ |
| 1e | Testimonial card quotes: Remove the hard-coded `"...{review}..."` ellipsis; render a clean clamped quote | 🟡 | ✅ |
| 1f | Stats: Replace current inline layout with the **About page stats design**: 4 white rectangle cards, `grid-cols-4` desktop / `grid-cols-2` mobile, `bg-white border border-gray-200 rounded-xl p-6 text-center` | 🔴 | ✅ |
| 1g | Stats content: Match About page exactly: `9+` Years of Experience, `50+` Products Shipped, `5.0` Client Rating, `6` Countries Served | 🔴 | ✅ |

### 1c: Updated Hero Subtext
**Current:** `See how we've helped startups, SaaS teams, and global brands turn ideas into fully functional digital products.`

**Recommended:** `Deep dives into SaaS platforms, enterprise dashboards, AI products, and fintech tools. The problem the client had, what we designed and built, and what changed after launch.`

---

## 2. CASE STUDIES SECTION (Grid + Heading)

**File:** `screens/caseStudies/index.tsx` (lines 158–401)

| # | Item | Priority | Status |
|---|------|----------|--------|
| 2a | Section badge: Keep `case studies` | 🟢 Keep | ❌ Verify |
| 2b | H2 title: Rename `Product design & development in practice` → `Products We've Designed & Shipped` | 🟡 | ❌ |
| 2c | Subtext: Rewrite to frame proof around buyer's need (see updated copy below) | 🟠 | ❌ |
| 2d | Search bar: Keep. Good pattern, placeholder is fine. | 🟢 Keep | ✅ |
| 2e | Case study cards: Clean up background. Move away from blurred hero image overlay; use a cleaner white/light card design | 🟠 | ❌ |
| 2f | Card heights: Enforce uniform card height so all cards match in the grid. No mismatched heights. | 🔴 | ❌ |
| 2g | Metric chip fallback: Only show orange chip when `metrics[0].value` exists; never show industry string in metric slot | 🔴 | ❌ |

### 2c: Updated Section Subtext
**Current:** `Deep dives into how we turn ideas into shipped products, from product thinking and IA to UX/UI and Angular/React development.`

**Recommended:** `Each case study covers the problem, what we designed and built, and the outcome. Browse by client, industry, or tech stack.`

---

## 3. "WHAT'S NEXT" CTA (In-page CTA / Placeholder Redesign)

**File:** `screens/caseStudies/index.tsx` (lines 403–432)

| # | Item | Priority | Status |
|---|------|----------|--------|
| 3a | Keep this CTA section. The concept is right: your project could be featured here. | 🟢 Keep | ❌ |
| 3b | Redesign visuals: Change from dark bg card → **placeholder/wireframe aesthetic** that gives the sense the visitor's project will be spotlighted once built | 🟠 | ❌ |
| 3c | H2: Update copy (see recommended below) | 🟠 | ❌ |
| 3d | Para: Update copy (see recommended below) | 🟠 | ❌ |
| 3e | Primary button: Change `Start Your Project →` / `/contact` → `Book a Free 15-Min Call →` / `https://cal.com/ui-pirate/15min` | 🔴 | ❌ |
| 3f | Secondary button: Change `View Pricing` → `See Pricing` / `/pricing` | 🟢 Keep | ❌ |

### 3b: Visual Design Concept
The CTA should evoke a **placeholder slot in the case study grid**: dashed border, ghost layout that mirrors a real case study card, with a "Your project here" treatment. Psychological message: "We did all of these. Your product could be next."

### 3c–3d: Updated CTA Copy
- **Eyebrow:** `Your project`
- **H2:** `Your product could be featured here next.`
- **Para:** `Every case study started as a conversation. Tell us what you're building and we'll walk through how we'd approach it. No pitch, no pressure.`
- **Primary CTA:** `Book a Free 15-Min Call →` → `https://cal.com/ui-pirate/15min`
- **Secondary CTA:** `See Pricing` → `/pricing`

---

## 4. CLIENT LOGOS / "OUR CLIENTS" SECTION

**Files:** `screens/caseStudies/ClientLogosMarquee.tsx`, `screens/caseStudies/index.tsx`

| # | Item | Priority | Status |
|---|------|----------|--------|
| 4a | **Move section down**: Relocate from Position 2 (after hero, before case studies) → after "What's Next" CTA | 🔴 | ✅ |
| 4b | **Replace component**: Replace the bare `ClientLogosMarquee` (just "Trusted by teams at" + logos) with the full **About page "Our Clients" section** using `SectionHeader` chip=`OUR CLIENTS`, subcopy `60% of our clients are US-based startups and enterprises`, H2 `Trusted by Teams Worldwide`, and `<ClientLogosGrid />` | 🔴 | ✅ |
| 4c | Remove old `<ClientLogosMarquee />` from `index.tsx` | 🔴 | ✅ |
| 4d | Verify 10 client logo cards match About page exactly | 🟠 | ✅ |

---

## 5. CLIENT TESTIMONIALS & WHY CHOOSE US

**Files:** `screens/landing/testimonials/index.tsx`, `screens/landing/whyChoosUs/index.tsx`

| # | Item | Priority | Status |
|---|------|----------|--------|
| 5a | Testimonials: Keep `LandingTestimonials`. Fix spacing issues later. | 🟢 Keep | ❌ Spacing TBD |
| 5b | Why Choose Us: Keep. Section content is fine. | 🟢 Keep | ❌ |
| 5c | Why Choose Us icon: Right-side icon is low quality. Replace with a high-res SVG version. | 🟡 | ❌ |
| 5d | Fix stray backslash `\` rendering before `<WhyChooseUs />` at `index.tsx:443` | 🔴 | ❌ |

---

## 6. FAQ SECTION

**File:** `screens/caseStudies/CaseStudiesFAQ.tsx`

| # | Item | Priority | Status |
|---|------|----------|--------|
| 6a | **Move FAQ**: Relocate to just above the footer (last section before footer) | 🔴 | ❌ |
| 6b | Subhead: Change `Everything you need to know about working with us` → `Questions about our work and how we engage.` | 🟠 | ❌ |
| 6c | Fix number conflict: `We've helped 20+ startups` → `We've shipped 50+ products, including 20+ startup MVPs built from scratch.` | 🔴 | ❌ |
| 6d | Add 3 proof-specific questions (see content below) | 🟠 | ❌ |
| 6e | Add `FAQPage` JSON-LD schema built from the `faqs` array | 🔴 | ❌ |
| 6f | Link FAQ answers that reference case studies to the actual grid (`#case-studies` anchor) | 🟡 | ❌ |

### 6d: New / Revised FAQ Questions

**Add or replace generic questions with proof-specific ones:**

1. **Q: Can I see work in my industry?**
   A: *Yes. Search the case studies above by industry (SaaS, fintech, AI, enterprise, design systems) or ask us directly. We'll send the two or three most relevant to your situation.*

2. **Q: Are the results in these case studies verified?**
   A: *The metrics come from the client or from analytics we had direct access to during the engagement. For several clients we can arrange a direct reference call.*

3. **Q: Do you have work you can't show publicly?**
   A: *Yes. Some enterprise and fintech work is under NDA. We can walk through it on a call without violating any agreements.*

4. **Q: Do you work with early-stage startups?** *(update existing answer)*
   A: *Yes. We've shipped 50+ products, including 20+ startup MVPs built from scratch. We understand the constraints of early-stage companies and offer flexible engagement models.*

---

## 7. PRICING SECTION: REMOVE

**File:** `screens/caseStudies/index.tsx` (lines 443–456)

| # | Item | Priority | Status |
|---|------|----------|--------|
| 7a | **Remove** the entire "Pricing That Makes Sense" block with embedded `<ProjectEstimate />` from this page | 🔴 | ❌ |
| 7b | Pricing lives on `/pricing`. No need to embed it here. | 🟢 Confirmed | ❌ |

---

## 8. METADATA & SEO

**File:** `app/case-studies/page.tsx`

| # | Item | Priority | Status |
|---|------|----------|--------|
| 8a | `<title>`: `Case Studies & Portfolio | 50+ Shipped Products` → `Case Studies: SaaS & Enterprise Product Design | UI Pirate` | 🟠 | ❌ |
| 8b | OG title: Align with `<title>` pattern | 🟠 | ❌ |
| 8c | `siteName`: `UI Pirate by Vishal Anand` → `UI Pirate` | 🟡 | ❌ |
| 8d | Add Twitter card block (`summary_large_image`) | 🟠 | ❌ |
| 8e | OG description: Shorten to ~160 chars (see recommended below) | 🟡 | ❌ |

### 8e: Recommended OG Description
`50+ SaaS, fintech, and enterprise products we designed and shipped. Deep-dive case studies on the problem, the work, and the measurable result.`

---

## 9. JSON-LD SCHEMA

**File:** `screens/caseStudies/index.tsx` (lines 112–140)

| # | Item | Priority | Status |
|---|------|----------|--------|
| 9a | Guard `numberOfItems`: only emit block when `caseStudies.length > 0` | 🟠 | ❌ |
| 9b | Align JSON-LD `name` to `Case Studies` (currently `Case Studies - UI Pirate`, the 5th variant) | 🟠 | ❌ |
| 9c | Add `FAQPage` JSON-LD (currently fully absent despite 6 Q&A on-page) | 🔴 | ❌ |

---

## 10. SECTION ORDER: BEFORE AND AFTER

| Position | Current | Target |
|----------|---------|--------|
| 1 | Hero (rainbow-border testimonial cards + inline stats) | Hero (orange testimonial cards + About-style stats) |
| 2 | Client Logos Marquee ("Trusted by teams at") | Case Studies Grid (heading + search + cards) |
| 3 | Case Studies Grid | "What's Next" CTA (placeholder redesign) |
| 4 | "What's Next" CTA | Our Clients (About-style `SectionHeader` + `ClientLogosGrid`) |
| 5 | Client Testimonials | Client Testimonials |
| 6 | Why Choose Us | Why Choose Us |
| 7 | FAQ | FAQ (moved just above footer) |
| 8 | Pricing CTA (`ProjectEstimate`) | ~~Pricing CTA~~ **REMOVED** |
| 9 | Footer | Footer |

---

## Progress Summary

| Priority | Total | Done | Remaining |
|----------|-------|------|-----------|
| 🔴 Fix now | 13 | 0 | 13 |
| 🟠 Soon | 14 | 0 | 14 |
| 🟡 Consider | 5 | 0 | 5 |
| 🟢 Keep/Verify | 5 | 1 | 4 |
| **Total** | **37** | **1** | **36** |

---

*Last updated: 2026-09-11. Initial checklist created from 2026-09-11 design discussion + 08-case-studies-page.md audit findings.*
