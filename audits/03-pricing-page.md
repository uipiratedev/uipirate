# Pricing Page Content Audit — UI Pirate
**Page:** `/pricing`
**Files in scope:** `app/pricing/page.tsx` · `screens/pricing/` · `screens/landing/pricing/index.tsx`
**Focus:** Copy, messaging, positioning, conversion logic, SEO metadata, and structural decisions
**Research basis:** Apple HIG, Google Material UX Writing, Nielsen Norman Group, Copyhackers JTBD, E-E-A-T guidelines, CRO research, B2B pricing psychology (Predictably Irrational — Ariely, Influence — Cialdini), agency pricing studies, SaaS pricing benchmark data
**Last audited:** 2026-08-27 (v2) → v3 (2026-08-31) → **v4 sync (2026-09-01)**
**v4 note:** Synced with landing page pricing changes. Price updated to "from $500". CTAs, copy, and features updated. See "What's Done vs Open" below.

---

## Research Foundation

Every recommendation in this document is grounded in the same cross-source principle set used for the landing page audit, with additional sources specific to pricing psychology. Nothing below is opinion — each finding traces back to one or more of these.

### What the research consistently says

**Apple Human Interface Guidelines** — Clarity is the goal. A pricing page visitor has one job: understand what they get, for how much, and what happens next. Every word that doesn't serve that job is friction. Clarity beats cleverness on every pricing page without exception. Any label that requires interpretation ("5/7 Communication") should be rewritten.

**Google Material UX Writing** — Concrete, plain language converts. Pricing copy that uses abstract claims ("endless possibilities," "high-value") instead of specific deliverables and guarantees fails the clarity test. The visitor needs to be able to make a decision — help them, don't excite them.

**Nielsen Norman Group (NN/g)** — Pricing pages are research pages. Visitors arrive having already seen your service offering; they are now in evaluation mode. They are asking: Is this worth it? Can I trust this? What happens if it doesn't work? Every section should address one of these three questions. Sections that don't are wasted real estate.

**Copyhackers / Jobs-to-be-Done** — Buyers don't pay for plans. They pay for outcomes. The strongest pricing page copy names the specific situation the buyer is in right now (overwhelmed, understaffed, under deadline) and shows how each plan resolves it. Feature lists alone don't convert — situation-to-outcome copy does.

**Predictably Irrational (Dan Ariely) — Pricing Psychology** — The most powerful pricing page structure uses anchoring and decoy effects. Showing a high-cost option first makes the middle option feel reasonable. A comparison table that makes your price look low next to established alternatives activates the "that's a deal" cognitive response. Price without context is just a number. Price next to a more expensive competitor is a bargain.

**Cialdini's Influence — Social Proof, Scarcity, and Reciprocity** — On pricing pages specifically: (1) social proof closest to the price reduces hesitation at the decision moment, (2) scarcity is the single most effective CTA accelerator but only when it is visibly real and changes, (3) a risk-reversal guarantee near the CTA is the most direct way to eliminate the last objection before a conversion.

**B2B Agency Pricing Research** — The biggest conversion killers on agency pricing pages: (a) no direct booking path — forcing a contact form as the only next step adds friction and loses warm leads; (b) vague feature lists — "unlimited requests" without context sounds too good and triggers skepticism; (c) no indication of what a typical engagement looks like — buyers fear the unknown more than the price.

**E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)** — Google's quality-rater framework: schema data (e.g. `reviewCount`, `AggregateRating`) and on-page ratings must be verifiable by a crawler reading the page. Numbers that can't be substantiated should be sourced or removed.

### How this audit applies the foundation

| Principle | Where it drives a finding in this document |
|---|---|
| Apple HIG — labels that require decoding | "5/7 Communication", cryptic plan descriptors |
| Material — plain language | Abstract benefit claims over concrete deliverables |
| NN/g — "is it worth it / can I trust it / what if it fails" | Every section judged against these three questions |
| Copyhackers / JTBD | Plan intros describe who buys, not the pain driving the purchase |
| Ariely — anchoring / decoy | Order of plans; presence/absence of a comparison anchor |
| Cialdini — social proof, real scarcity, guarantee | Static "2 spots left" copy; guarantee placement; proof near price |
| B2B agency pricing | WhatsApp/contact-form-only path instead of a calendar booking |
| E-E-A-T | Unsourced "5.0★ rating"; JSON-LD `reviewCount: 50` not verifiable on page |

---

## What Changed Since v1

Between the first audit and this one, the pricing page was significantly rebuilt. Here is what changed:

**Hero section — fully redesigned:**
- H1: Updated from the old generic heading to "Simple, Transparent Pricing" (with "Pricing" in brand orange) — this was the suggested fix from v1
- Subheadline: Completely rewritten to "No hidden fees. No surprise invoices. Choose the plan that fits your scope — from monthly retainers to one-time projects. We work the way you need."
- Trust stats strip added: 50+ Products Shipped, 5.0★ Rating, <2hr Response Time, 9yr+ In Business
- "Save 50-70% compared to US agencies" pill added
- Hero CTAs changed: Now has "Compare Plans ↓", "Book a Call →" (cal.com), and "Download Pricing PDF"
- Badge label changed from old copy to "PLANS & PRICING"

**PerfectFor section — now present on pricing page:**
- The "Is This Right For You?" section (from `screens/pricing/perfectFor/index.tsx`) is now embedded in the pricing page
- This was listed as missing in v1

**TryBeforeCommit — completely rebuilt:**
- Now shows three pilot tiers: Design ($150), Development ($250), Design + Dev ($350)
- Description fixed: "Test our work before committing. See real results in 5 days — your fee is fully deductible from the final project invoice."
- Badge changed to "ZERO RISK"
- CTA updated to "Start Your Pilot Project" linking to cal.com

**Fixed since v2 (updated in v4 sync):**
- Monthly Retainer subtitle updated to: "Your dedicated design and development team — without the full-time headcount" ✅
- Monthly Retainer CTA now "Get Started →" → cal.com ✅
- Custom Quote CTAs (desktop + mobile) now "Book a Discovery Call →" → cal.com ✅
- Satisfaction Guarantee now names Ipsos, Khaitan & Co, RevUp AI ✅
- Benefits broken sentence fixed: "The 5-day pilot lets you see our execution quality" ✅
- 5/7 Communication replaced with "Mon–Fri communication, < 2hr response" on all plans ✅
- FIT CHECK badge changed to "WHO IT'S FOR" ✅
- Emoji icons in "Not the right fit" strip replaced with ✕ ✅
- Price updated to "from $500/per month" on the Monthly Retainer card ✅

**Still open (as of v4 sync — 2026-09-01):**
- Custom Quote subtitle still "For complex products, enterprise needs & startups"
- Scarcity message still static ("To ensure quality, we only onboard 2 new clients per month")
- "One subscription, endless possibilities" still present (L143)
- Hero "Book a Call →" still links to /contact not cal.com
- SEO title/meta still says "$2000/mo" but component now shows "from $500"

---

## Current Page Structure (Post-Restructure)

```
1.  Hero (H1, subheadline, trust stats, CTAs + PDF download)
2.  Client Logos strip
3.  Pricing Cards (Monthly Retainer + Project Estimate + Custom Quote)
4.  Benefits row (3 benefit cards)
5.  Satisfaction Guarantee block
6.  Comparison Table (UI Pirate vs. US Agency vs. Freelancer vs. In-House)
7.  "Is This Right For You?" (PricingPerfectFor — 4 audience cards + "Not For" strip)
8.  5-Day Pilot Project CTA (TryBeforeCommit — rebuilt with 3 tiers)
9.  FAQ accordion
```

---

## Section-by-Section Audit

---

### 1. HERO
**File:** `screens/pricing/hero/index.tsx`

---

#### 1a. Badge

**Current:** `PLANS & PRICING`

**Assessment:** ✅ Clear and functional. Keep.

---

#### 1b. Headline (H1)

**Current:**
```
Simple, Transparent Pricing
```
("Pricing" in brand orange)

**Assessment:** ✅ **Fixed from v1.** This replaces the generic "Pricing That Makes Sense." "Simple, Transparent" directly addresses the two biggest buyer anxieties on a pricing page: complexity and hidden costs. This is strong. Keep.

---

#### 1c. Subheadline

**Current:**
```
No hidden fees. No surprise invoices. Choose the plan that fits your scope —
from monthly retainers to one-time projects. We work the way you need.
```

**Assessment:** ✅ Good. Anxiety-reducing, plain language, no jargon. "We work the way you need" is slightly vague at the end — but acceptable. Keep.

---

#### 1d. Trust Stats Strip

**Current stats:**
```
50+    Products Shipped
5.0★   Average Rating
<2hr   Response Time
9yr+   In Business
```

**Assessment:** ✅ Strong addition. These four stats address the main evaluation questions a pricing page visitor has: Is this a real agency? Are they good? Are they responsive? Have they been around long enough to trust?

**One issue:** `5.0★` — the star is part of the numeric value, which is unconventional. This could cause a visual parsing problem — is it a rating or a price? Consider splitting it as `5.0` / `★★★★★ Rating` to make it unambiguous.

---

#### 1e. "Save 50-70%" pill

**Current:** `Save 50-70% compared to US agencies`

**Assessment:** ✅ Well-positioned. Provides price anchoring before the visitor even sees the price. The range (50-70%) is believable and specific enough without being a precise claim that needs to be proven.

---

#### 1f. Hero CTAs

**Current (3 CTAs):**
```
"Compare Plans ↓" → #compare anchor
"Book a Call →" → /contact
"Download Pricing PDF" → /uipirate-pricing-2026.pdf (download)
```

**What's wrong:**

| CTA | Issue |
|---|---|
| "Book a Call →" links to `/contact` | v1 audit recommended direct cal.com link — `/contact` adds an extra page in the funnel. The TryBeforeCommit section links directly to cal.com; the hero CTA should too |
| "Download Pricing PDF" | A downloadable PDF is a high-intent action — but if the PDF file doesn't exist at `/uipirate-pricing-2026.pdf`, this will silently fail. Verify the file is in the `public/` folder |
| Three equal-weight CTAs | CRO research: a single primary CTA outperforms three side-by-side options. The three buttons here are visually distinct enough (orange vs. white vs. dark) to guide the eye, but "Compare Plans ↓" and "Book a Call →" compete for primary attention |

**Suggested fix:** Change "Book a Call →" to link directly to `cal.com/ui-pirate/15min`.

---

#### 1g. SEO Metadata

**Current title:** `UI/UX Design Pricing | $2000/mo Unlimited`

**Assessment:** ✅ This is strong. It includes the price point which is a high-intent search signal, and "Unlimited" addresses the main pricing model concern upfront. Keep.

**Current meta description:**
```
UI/UX design from $2000/mo — unlimited requests, 48hr turnaround. Save 60% vs US agencies. No contracts, pause anytime.
```

**Assessment:** ✅ Concise, specific, benefit-forward. The 60% claim differs slightly from the "50-70%" in the hero — small inconsistency but not a critical issue. Keep overall; optionally align the % claim.

---

### 2. CLIENT LOGOS
**File:** `screens/pricing/clientLogos/`

Social proof strip immediately after the hero. Same logos as the landing page marquee. Function is to validate the price point before the visitor sees the pricing cards.

**Assessment:** ✅ Positioning is correct. Keep.

**One issue:** Same placeholder logo problem as the landing page marquee — if the same `premiumLogos` array is shared, the empty alt/link entry will appear here too. Verify and fix.

---

### 3. PRICING CARDS (Landing Pricing Component)
**File:** `screens/landing/pricing/index.tsx`

This shared component renders on both the landing page and the pricing page. Issues flagged here apply to both surfaces.

---

#### 3a. Section heading

**Current:** `Pricing That Makes Sense`

**Status:** ⚠️ **Not fixed from v1.** The pricing page hero now has a strong H1 ("Simple, Transparent Pricing") so this H2 is redundant and still uses the generic phrase. On the full `/pricing` page, this section heading becomes the second H2 the visitor sees, which means it should add context — not repeat a weaker version of the page title.

**Suggested fix:**
```
Choose Your Plan
```
or simply remove the section heading since the hero already frames the section.

---

#### 3b. Monthly Retainer subtitle

**Current:** `For teams that need design & dev support, every month`

**Status:** ⚠️ **Not fixed from v1.** This is a descriptor, not a positioning line. It describes who buys it, not why they need it.

**Suggested fix:**
```
Your dedicated design and development team — without the full-time headcount
```

---

#### 3c. Monthly Retainer copy — "One subscription, endless possibilities"

**Current:** `One subscription, endless possibilities`

**What's wrong:** "Endless possibilities" is a consumer-app phrase — it's the kind of copy that appears on music streaming apps, not on B2B agency pricing pages. It's also inaccurate: the subscription is explicitly scoped ("1 Active request at a time").

**Suggested fix:**
```
One team, one subscription, no headcount overhead
```

---

#### 3d. Monthly Retainer CTA — WhatsApp still present

**Current:** `Chat on WhatsApp` (primary CTA on the Monthly Retainer card)

**Status:** 🔴 **Critical — not fixed from v1.** This is the primary conversion button on the most expensive plan on the pricing page. A US enterprise buyer evaluating a $2,000/month retainer who sees "Chat on WhatsApp" as the only action is almost certainly going to close the tab.

This issue was flagged in v1 across the hero section (fixed) and the FAQ (still present). It now persists as the primary CTA on the main pricing card — the highest-stakes location on the entire page.

**Suggested fix:**
```
Get Started → (linking to cal.com/ui-pirate/15min)
```
or
```
Book a Discovery Call → (linking to cal.com/ui-pirate/15min)
```
Move WhatsApp to a secondary link below the button if you want to keep it as an option.

---

#### 3e. Custom Quote subtitle

**Current:** `For complex products, enterprise needs & startups`

**Status:** ⚠️ **Not fixed from v1.** Enterprise and startups are at opposite ends of budget, process, and deal complexity. Naming both signals that this plan is for everyone — which means it's for no one in particular.

**Suggested fix (choose the actual target):**
- Enterprise focus: `"For organizations with complex products and custom delivery requirements"`
- Growth-stage focus: `"For funded startups and growing SaaS teams building at scale"`

---

#### 3f. Custom Quote CTAs — also WhatsApp

**Current:** `Chat on WhatsApp` (two instances — desktop and mobile CTAs)

**Status:** 🔴 **Critical.** Same issue as the Monthly Retainer CTA. Both pricing card CTAs lead to WhatsApp.

**Suggested fix:** Replace both with `Book a Discovery Call →` (cal.com).

---

#### 3g. Scarcity message

**Current:** `Only accepting 2 new clients this month`

**Status:** ⚠️ **Not fixed from v1.** Static scarcity copy that never updates destroys trust faster than no scarcity at all. A returning visitor who sees the same "only 2 spots left" message weeks later will discount everything else on the page.

**Options:**
1. Connect to real availability — update manually each month, or link to a calendar showing actual open slots
2. Replace with a claim that is always true: `"We keep our client load small. Every project gets our full attention."`

---

#### 3h. Satisfaction Guarantee copy

**Current:**
```
Not happy with the first milestone? We'll refund your deposit — no questions asked.
We're confident in our work because we've done this 100+ times for companies like yours.
```

**Status:** ⚠️ **Not fixed from v1.** "Companies like yours" is a missed name-drop opportunity. You have real client names.

**Suggested fix:**
```
We've done this for companies like Sarge, RevUp AI, and Biotex Medical. If the first
milestone doesn't meet the agreed standard, we'll refund your deposit — no questions asked.
```

---

#### 3i. Benefits row — 5-Day Pilot description broken sentence still present

**Current (benefits[1].description):**
```
"Big scope. Big budget. No blind trust. This 5-day pilot shows you see our execution before committing long term."
```

**Status:** 🔴 **Not fixed from v1.** "shows you see our execution" is still a broken sentence. A word is missing ("lets you see" or "shows you our execution").

**Suggested fix:**
```
"Big scope. Big budget. No blind trust. The 5-day pilot lets you see our execution quality before committing to a full engagement."
```

---

### 4. COMPARISON TABLE
**File:** `screens/pricing/comparison/index.tsx`

---

#### 4a. Section heading and subtext

**Current:**
```
Heading: "How We Stack Up"
Subtext: "See why 50+ companies chose us over traditional agencies, freelancers, or hiring in-house."
```

**Assessment:** ✅ "How We Stack Up" is direct and clear. The subtext is benefit-framed. Keep both.

---

#### 4b. The comparison data

**Current rows:**
```
Monthly Cost:   UI Pirate $2,000 | US Agency $8-15k | Freelancer $3-5k | In-House $8-12k
Turnaround:     48-72hr | 1-2 weeks | Variable | Slow
Quality:        Enterprise | Enterprise | Variable | Variable
Scalability:    ✅ | ✅ | ✕ | ✕
No Contracts:   ✅ | ✕ | ✅ | ✕
Pause Anytime:  ✅ | ✕ | ✕ | ✕
```

**What's wrong:**

| Row | Issue |
|---|---|
| Quality: "Enterprise" for UI Pirate | This is a self-assessed claim — the visitor knows you wrote this table. Consider replacing "Enterprise" with something verifiable like "50+ shipped products" or linking to case studies |
| Freelancer: "No Contracts ✅" | Freelancers often do require contracts. This row may be inaccurate depending on the comparison context |
| Turnaround: "Slow" for In-House | This is editorial — it's not wrong, but "Slow (1-3 weeks)" would be more credible than a single word that appears biased |

These are minor credibility points, not conversion killers. The table structure and the core advantage message are solid.

---

### 5. "IS THIS RIGHT FOR YOU?" (PricingPerfectFor)
**File:** `screens/pricing/perfectFor/index.tsx`

This section was missing in v1. All issues with this section are documented in the landing page audit (v2), sections 3a–3c. The same component is used here. Issues are:

- ⚠️ "FIT CHECK" badge — informal for enterprise context; consider "WHO IT'S FOR"
- ⚠️ "Funded Startups" card — "impress investors" claim is inaccurate
- ⚠️ "SaaS Companies" card — description starts as a dependent clause (grammar)
- ⚠️ Emoji icons in "Not the right fit" strip — should be replaced with clean icons

On the pricing page, the positioning of this section (after comparison, before pilot CTA) is **correct** — unlike the landing page where it appears too early. Here the visitor has already seen the plans, the comparison table, and is about to see the pilot option. Asking "is this right for you?" at this point makes sense.

---

### 6. TRYBEFORECOMMIT — 5-Day Pilot Section
**File:** `screens/pricing/tryBeforeCommit/index.tsx`

---

#### 6a. Section heading

**Current:** `5-Day Pilot Project` (with "Pilot Project" in brand orange)
**Badge:** `ZERO RISK`

**Assessment:** ✅ "ZERO RISK" is the strongest possible badge for a risk-reversal section. The heading is direct. Keep both.

---

#### 6b. The three pilot tiers

**Current:**
```
Design         $150   "UI/UX design sprint"
Development    $250   "Code implementation"
Design + Dev   $350   "Full-stack delivery"
```

**Assessment:** ✅ This is a significant upgrade from v1 where the pilot was a single undifferentiated price. Three tiers let the buyer self-select based on what they need.

**One issue:** The descriptions are one-line placeholders rather than conversion copy. "UI/UX design sprint" and "Code implementation" tell the buyer what type of work it is, but not what they walk away with.

**Suggested rewrites:**
```
Design         $150   "5 screens or 1 full user flow — polished Figma file, ready for dev"
Development    $250   "Working component or feature, production-ready code"
Design + Dev   $350   "Designed and built in 5 days — you own all the files and code"
```

---

#### 6c. Pilot description

**Current:**
```
"Test our work before committing. See real results in 5 days — your fee is
fully deductible from the final project invoice."
```

**Assessment:** ✅ **Fixed from v1.** This is now a clean, well-formed sentence. "Fully deductible from the final project invoice" is the single most important detail of the pilot offer — it removes the financial risk entirely. Keep.

---

#### 6d. The two benefit cards

**Current:**
```
Low-Risk, High-Value — "Your pilot fee is deducted from the final invoice when you continue with a full project."
Real Deliverables — "Walk away with a working mini-build or polished design — ready to scale."
```

**Assessment:** ✅ Both cards are clear and benefit-forward. "Ready to scale" is slightly vague but acceptable in context. Keep.

---

#### 6e. CTA

**Current:** `Start Your Pilot Project` → `cal.com/ui-pirate/15min`
**Sub-note:** `Limited slots available each month` (with green pulse dot)

**Assessment:** ✅ "Start Your Pilot Project" is more specific than "Book a Call." The cal.com link is correct. The "Limited slots" scarcity signal is more believable here than the static "Only accepting 2 new clients" message on the pricing card, because it's attached to a lower-price commitment point.

**However:** The scarcity signal here ("Limited slots available each month") contradicts the scarcity message on the pricing card ("Only accepting 2 new clients this month"). They both claim limited availability for different tiers. Unified scarcity messaging is more credible than two separate availability signals.

---

### 7. FAQ SECTION
**File:** `screens/pricing/faq/`

The pricing page FAQ is separate from the landing page FAQ. The v1 audit had concerns about the content of this FAQ — whether the questions address buyer blockers or just process mechanics. This section needs to be reviewed against the current file to confirm the current questions.

**Action required:** Check `screens/pricing/faq/` for the current questions. Ensure at least 1-2 questions address the top buyer blockers specific to pricing decisions:
- "What happens if I'm not happy with the work?"
- "Can I cancel at any time?"
- "How do I know this is worth $2,000/month?"

---

## Priority Fix Table (v2)

| # | Section | Issue | File | Priority |
|---|---------|--------|------|----------|
| 1 | Pricing Cards | Monthly Retainer CTA: "Chat on WhatsApp" on the primary pricing card | `landing/pricing/index.tsx` | 🔴 Fix now |
| 2 | Pricing Cards | Custom Quote CTAs (x2): "Chat on WhatsApp" on enterprise plan | `landing/pricing/index.tsx` | 🔴 Fix now |
| 3 | Benefits row | "shows you see our execution" — broken sentence still present | `landing/pricing/index.tsx` | 🔴 Fix now |
| 4 | Hero CTAs | "Book a Call →" links to /contact instead of cal.com directly | `pricing/hero/index.tsx` | 🟠 Soon |
| 5 | Hero CTAs | Verify PDF exists at /uipirate-pricing-2026.pdf in public/ folder | `public/` | 🟠 Soon |
| 6 | Pricing Cards | "Pricing That Makes Sense" section heading — still generic | `landing/pricing/index.tsx` | 🟠 Soon |
| 7 | Pricing Cards | Monthly Retainer subtitle — describe the pain, not the feature | `landing/pricing/index.tsx` | 🟠 Soon |
| 8 | Pricing Cards | Scarcity: "Only accepting 2 new clients" — make real or replace | `landing/pricing/index.tsx` | 🟠 Soon |
| 9 | Pricing Cards | Custom Quote subtitle — "enterprise needs & startups" pick one | `landing/pricing/index.tsx` | 🟠 Soon |
| 10 | PerfectFor | "FIT CHECK" badge — informal; consider "WHO IT'S FOR" | `pricing/perfectFor/index.tsx` | 🟠 Soon |
| 11 | PerfectFor | "Funded Startups" card — "impress investors" inaccurate | `pricing/perfectFor/index.tsx` | 🟠 Soon |
| 12 | PerfectFor | "SaaS Companies" card — dependent clause with no subject | `pricing/perfectFor/index.tsx` | 🟠 Soon |
| 13 | PerfectFor | Emoji icons in "Not the right fit" strip | `pricing/perfectFor/index.tsx` | 🟠 Soon |
| 14 | TryBeforeCommit | Pilot tier descriptions are placeholder labels — rewrite to outcomes | `pricing/tryBeforeCommit/index.tsx` | 🟠 Soon |
| 15 | Pricing Cards | "One subscription, endless possibilities" — consumer-app phrase | `landing/pricing/index.tsx` | 🟡 Consider |
| 16 | Trust Stats | 5.0★ — star glyph in numeric value causes parsing ambiguity | `pricing/hero/index.tsx` | 🟡 Consider |
| 17 | Guarantee | Replace "companies like yours" — name actual client companies | `landing/pricing/index.tsx` | 🟡 Consider |
| 18 | TryBeforeCommit | Two scarcity signals ("2 new clients" + "Limited slots") — unify | `landing/pricing/index.tsx` + `tryBeforeCommit/index.tsx` | 🟡 Consider |
| 19 | Comparison | "Enterprise" quality claim is self-assessed — link to proof | `pricing/comparison/index.tsx` | 🟡 Consider |
| 20 | Client Logos | Verify no placeholder logo (empty alt/link) appears in pricing logos | `pricing/clientLogos/` | 🟡 Consider |

**Priority key:**
- 🔴 **Fix now** — Errors or broken data actively damaging trust and credibility with every visitor
- 🟠 **Soon** — Conversion and positioning improvements with direct impact on lead quality
- 🟡 **Consider** — Strategic polish and copy quality improvements

---

## The Underlying Pattern

The pricing page has improved significantly. The hero is now strong — it leads with transparency, social proof, and a comparison anchor before the visitor even sees a number. The new TryBeforeCommit with three tiers is a genuine upgrade.

What remains most damaging is the CTA problem: **the two most prominent action buttons on the pricing cards — the $2,000/month retainer and the custom quote — both lead to WhatsApp.** This is the single highest-priority fix on the entire pricing page. No amount of strong copy or design work recovers the conversion if the action button itself is a professional red flag for the US market.

The core formula for fixing this page is straightforward:
1. WhatsApp CTAs → cal.com CTAs on all pricing cards
2. Fix the broken sentence in the benefits row
3. Update the retainer subtitle to lead with buyer pain
4. Make the scarcity messaging real or remove it

---

## Copy Tone Reference

| ✅ Do | ❌ Avoid |
|---|---|
| Short, direct sentences | Long sentences with multiple clauses |
| Specific, verifiable claims | Self-assessed quality labels ("Enterprise") |
| Name real clients | "Companies like yours" |
| Risk-reversal language near CTAs | Scarcity that never changes |
| Action-focused CTA labels | Platform names as CTA labels ("Chat on WhatsApp") |

---

*Related audits: `01-landing-page.md` · `04-about-page.md`*

---

---


---

# v4 Sync Update — 2026-09-01

**Purpose:** Sync pricing page MD with changes made during the landing page audit session.

## Price Change: $2,000 → from $500/month

The Monthly Retainer card in `landing/pricing/index.tsx` now displays **`from $500/per month`** (L153). This is a significant change that affects:

| Location | Status | Action Needed |
|----------|--------|---------------|
| Pricing card component (`landing/pricing/index.tsx` L153) | ✅ Done — shows `from $500` | None |
| Page title (`app/pricing/page.tsx`) | ❌ Still says `$2000/mo Unlimited` | Update to `from $500/mo` |
| Meta description (`app/pricing/page.tsx`) | ❌ Still says `UI/UX design from $2000/mo` | Update to `from $500/mo` |
| OG title (`app/pricing/page.tsx`) | ❌ Still says `$2000/mo Unlimited` | Update to `from $500/mo` |
| OG description (`app/pricing/page.tsx`) | ❌ Still says `$2000/mo` | Update |
| Twitter title (`app/pricing/page.tsx`) | ❌ Still says `$2000/mo Unlimited` | Update |
| JSON-LD schema offer price (`app/pricing/page.tsx`) | ❌ Still says `"price": "2000"` | Update to `"500"` |
| Comparison table (`pricing/comparison/index.tsx`) | ❌ Still shows `$2,000` | Update to `from $500` |
| "How much does UI/UX design cost?" FAQ (NC10) | ❌ Still references `$2,000/month` | Update |

## What Is Done (Code-Verified as of v4)

| # | Item | Status |
|---|------|--------|
| 1 | Monthly Retainer CTA: `Get Started →` → cal.com | ✅ Done |
| 2 | Custom Quote CTA (desktop): `Book a Discovery Call →` → cal.com | ✅ Done |
| 3 | Custom Quote CTA (mobile): `Book a Discovery Call →` → cal.com | ✅ Done |
| 4 | Benefits broken sentence fixed | ✅ Done |
| 5 | `5/7 Communication` → `Mon–Fri communication, < 2hr response` (all 3 plans) | ✅ Done |
| 7 | Section H2 updated to `Transparent Pricing for SaaS Teams` | ✅ Done |
| 8 | Monthly Retainer subtitle updated to outcome-focused copy | ✅ Done |
| 12 | `FIT CHECK` → `WHO IT'S FOR` | ✅ Done |
| 13 | Emoji icons in "Not the right fit" strip → ✕ | ✅ Done |
| 17 | Guarantee `companies like yours` → named clients (Ipsos, Khaitan & Co, RevUp AI) | ✅ Done |

## What Is Still Open (as of v4)

| # | Item | File | Priority |
|---|------|------|----------|
| 6 | Hero `Book a Call →` still links to `/contact` — change to cal.com | `pricing/hero/index.tsx` L117 | 🟠 Soon |
| 9 | Scarcity still static (only copy changed, not made dynamic) | `landing/pricing/index.tsx` L168 | 🟠 Soon |
| 10 | Custom Quote subtitle still `For complex products, enterprise needs & startups` | `landing/pricing/index.tsx` L217 | 🟠 Soon |
| 11 | PerfectFor card rewrites (Funded Startups, SaaS Companies, Agencies) | `pricing/perfectFor/index.tsx` | 🟠 Soon |
| 14 | Pilot tier descriptions still placeholder labels | `tryBeforeCommit/index.tsx` L18-21 | 🟠 Soon |
| 15 | Missing FAQ: `How much does UI/UX design cost?` | `pricing/faq/index.tsx` | 🟠 Soon |
| 16 | FAQ CTA `Chat With Us` — replace with cal.com CTA | `pricing/faq/index.tsx` L101 | 🟠 Soon |
| 18 | `One subscription, endless possibilities` still present | `landing/pricing/index.tsx` L143 | 🟡 Consider |
| 19 | SEO keywords: remove `cheap UI design agency`, `affordable UX design` | `app/pricing/page.tsx` | 🟡 Consider |
| 20 | SEO keywords: add `design subscription agency`, `SaaS design retainer`, etc. | `app/pricing/page.tsx` | 🟡 Consider |
| 21 | `priceValidUntil: "2026-12-31"` in JSON-LD — update before expiry | `app/pricing/page.tsx` | 🟡 Consider |
| 22 | `reviewCount: 50` not verifiable on-page | `app/pricing/page.tsx` | 🟡 Consider |
| 23 | Meta description and OG title: align `60%` → `50-70%` savings claim | `app/pricing/page.tsx` | 🟡 Consider |
| 24 | `5.0★` trust stat — star glyph in numeric causes parsing ambiguity | `pricing/hero/index.tsx` | 🟡 Consider |
| 25 | `Enterprise` quality claim in comparison table is self-assessed | `pricing/comparison/index.tsx` | 🟡 Consider |
| 26 | Two scarcity signals (`Only 2 new clients` + `Limited slots`) — unify | Multiple files | 🟡 Consider |
| NEW | SEO title/meta/schema price still says `$2000` — update to `from $500` | `app/pricing/page.tsx` | 🔴 Fix now |

---

# v3 Audit Update — Pricing Page
**Audited:** 2026-08-31
**Audit basis:** Direct source-code inspection of all flagged components + SEO Content skill (E-E-A-T framework, Google Helpful Content guidelines, AI Citation Readiness, pricing psychology lens)
**Scope:** Copy, content, SEO metadata, and conversion logic only. No UI or layout changes evaluated.

---

## What Actually Changed Since v2 (Code-Verified)

Every item from v2 was verified against the live source files.

| Section | v2 Status | v3 Code Reality |
|---|---|---|
| Hero — H1 `Simple, Transparent Pricing` | ✅ Fixed | ✅ Still correct — `screens/pricing/hero/index.tsx` L72-74 |
| Hero — Subheadline | ✅ Fixed | ✅ Still correct — no hidden fees, no surprise invoices |
| Hero — Trust Stats Strip | ✅ Added | ✅ Present — `50+`, `5.0★`, `<2hr`, `9yr+` — L12-16 |
| Hero — `Save 50-70%` pill | ✅ Added | ✅ Present — L101 |
| TryBeforeCommit — rebuilt with 3 tiers | ✅ Fixed | ✅ `$150 / $250 / $350` tiers present — `tryBeforeCommit/index.tsx` L17-21 |
| TryBeforeCommit — clean description | ✅ Fixed | ✅ `Test our work before committing...fully deductible` — L48-55 |
| TryBeforeCommit — `Start Your Pilot Project` → cal.com | ✅ Fixed | ✅ Correctly links to `https://cal.com/ui-pirate/15min` — L113 |
| PDF file exists | 🟠 Verify | ✅ **Confirmed** — `uipirate-pricing-2026.pdf` exists in `/public/` |
| Pricing FAQ — buyer-blocker questions | ⚠️ Not checked in v2 | ✅ **New finding — actually good.** Pricing FAQ has 6 buyer-blocker questions (pause, satisfaction, turnaround, exclusions, pilot, switching). This is better than the landing page FAQ. |
| Monthly Retainer CTA — WhatsApp | 🔴 Not fixed | ✅ **Fixed (v4)** — now reads `Get Started →` → cal.com — `landing/pricing/index.tsx` L174 |
| Custom Quote CTA (desktop) — WhatsApp | 🔴 Not fixed | ✅ **Fixed (v4)** — now reads `Book a Discovery Call →` → cal.com — `landing/pricing/index.tsx` L227 |
| Custom Quote CTA (mobile) — WhatsApp | 🔴 Not fixed | ✅ **Fixed (v4)** — now reads `Book a Discovery Call →` → cal.com — `landing/pricing/index.tsx` L260 |
| Benefits row — broken sentence | 🔴 Not fixed | ✅ **Fixed (v4)** — now reads `lets you see our execution quality` — `landing/pricing/index.tsx` L66 |
| Hero `Book a Call →` → `/contact` | 🟠 Not fixed | ❌ **Still open** — `pricing/hero/index.tsx` L117 still links to `/contact` |
| Section H2 copy | 🟠 Not fixed | ✅ **Fixed (v4)** — now reads `Transparent Pricing for SaaS Teams` — `landing/pricing/index.tsx` L89 |
| Monthly Retainer subtitle | 🟠 Not fixed | ✅ **Fixed (v4)** — now reads `Your dedicated design and development team — without the full-time headcount` — L119 |
| Scarcity message | 🟠 Not fixed | ⚠️ **Partially done (v4)** — now reads `To ensure quality, we only onboard 2 new clients per month` — still static, consider a dynamic approach |
| Custom Quote subtitle | 🟠 Not fixed | ❌ **Still reads:** `For complex products, enterprise needs & startups` — L212 |
| PerfectFor — `FIT CHECK` badge | 🟠 Not fixed | ✅ **Fixed (v4)** — now reads `WHO IT'S FOR` |
| PerfectFor — `impress investors` card | 🟠 Not fixed | ❌ **Still reads:** `Ship fast and impress investors...` — L17-18 |
| PerfectFor — SaaS Companies grammar | 🟠 Not fixed | ❌ **Still reads:** `Without in-house design teams, needing...` — L24-25 |
| PerfectFor — emoji in "Not the right fit" | 🟠 Not fixed | ✅ **Fixed (v4)** — replaced with ✕ icons |
| Pilot tier descriptions — placeholder labels | 🟠 Not fixed | ❌ **Still reads:** `UI/UX design sprint`, `Code implementation`, `Full-stack delivery` — L18-21 |
| `One subscription, endless possibilities` | 🟡 Not fixed | ❌ **Still open** — L143 |
| `companies like yours` guarantee | 🟡 Not fixed | ✅ **Fixed (v4)** — now names Ipsos, Khaitan & Co, RevUp AI — L319 |
| `5/7 Communication` feature label | ⚠️ Not flagged in v2 | ✅ **Fixed (v4)** — all 3 plans now read `Mon–Fri communication, < 2hr response` |
| Pricing FAQ CTA — `Chat With Us` | ⚠️ Not flagged in v2 | ❌ **New finding** — `pricing/faq/index.tsx` L101. `LetsTalkButton` with no `href` — unclear where this goes. |

**Summary:** Zero copy changes have been made since v2. All 🔴 and 🟠 items remain open. Two new issues found.

---

## New Findings (v3 — Not in v2)

### NF1. `5/7 Communication` — Unexplained Feature Label

**Confirmed in:** `landing/pricing/index.tsx` L33, L43, L52

This label appears as the final feature on all three pricing plans (Monthly Retainer, Custom Project, Custom Quote). It is also the final item on the features list in the `customProjectFeatures` and `customQuoteFeatures` arrays.

**The problem:** `5/7 Communication` is an internal shorthand — it almost certainly means "communication available 5 out of 7 days" (Mon–Fri). But a US buyer reading this feature list has no frame of reference. It could mean:

- 5 days a week of communication
- 5 out of 7 SLAs
- Some kind of tier metric

A VP of Product at a US company reads `5/7 Communication` and either skips it (if scanning fast) or feels slightly confused (if pausing to parse it). Neither outcome is good for conversion.

**Recommended replacement:**
```
Mon–Fri communication, < 2hr response time
```

This is specific (Mon–Fri), verifiable (matches the trust stat strip), and removes all ambiguity about what `5/7` means. It also reinforces the `<2hr Response Time` stat from the pricing hero, creating copy consistency across the page.

---

### NF2. Pricing FAQ CTA — `Chat With Us` Has No Destination

**Confirmed in:** `pricing/faq/index.tsx` L101

```jsx
<LetsTalkButton variant="light">Chat With Us</LetsTalkButton>
```

No `href` prop is passed. The `LetsTalkButton` component likely has a default href, but the label `Chat With Us` is vague and potentially WhatsApp-adjacent (same issue as the pricing card CTAs).

**Recommended fix:**
```
Still have questions?
[Book a Free 15-Min Call →] (href="https://cal.com/ui-pirate/15min")
```

This gives the visitor a specific, frictionless next step — not another contact form or a vague "chat" destination.

---

## E-E-A-T Assessment (v3 — SEO Content Skill Applied)

Applying Google's E-E-A-T framework and the "Who / How / Why" test specifically to the pricing page.

### Google's "Who / How / Why" Test

| Question | Current state | Assessment |
|---|---|---|
| **Who** created this pricing? | No founder name or byline on the pricing page. JSON-LD schema attributes it to `UI Pirate` org. | ⚠️ Entity is defined but no human authority signal on the page itself |
| **How** are prices set? | `Save 50-70% vs US agencies` pill explains the relative value; comparison table explains the value proposition. `$2,000/mo vs $8-15k` anchor is present. | ✅ The page does explain *how* prices compare — that's the right frame for a B2B pricing page |
| **Why** does this pricing exist? | The subheadline (`No hidden fees. No surprise invoices.`) gives the "why" — transparency. The pilot option gives "why try us first" — risk reversal. | ✅ Both are present and clear |

### E-E-A-T Breakdown

| Factor | Score | Key Signals Present | Key Gaps |
|---|---|---|---|
| **Experience** | 12/20 | `100+ times` in guarantee copy, `50+` trust stat, pilot described with real deliverables | Guarantee says "companies like yours" — missed opportunity to name Ipsos, Khaitan & Co, RevUp AI |
| **Expertise** | 16/25 | JSON-LD schema has `Service` type with offers and pricing; 3-tier pilot shows process depth; comparison table shows competitive awareness | `5/7 Communication` unexplained; `Enterprise` quality claim is self-assessed |
| **Authoritativeness** | 14/25 | `aggregateRating: 5.0` in schema; `reviewCount: 50` in schema; comparison table references real competitor cost ranges | `reviewCount: 50` in schema is not verifiable on-page — no review count visible to human reader |
| **Trustworthiness** | 18/30 | HTTPS; 100% satisfaction guarantee with deposit refund; `fully deductible` pilot fee; PDF download for offline review; `<2hr response time` claim | WhatsApp CTAs on highest-value plans; static scarcity copy (`Only 2 new clients`); `companies like yours` instead of real names |

**Total E-E-A-T Score: 60/100**

The pricing page scores slightly higher than the landing page because the guarantee copy, the pilot structure, and the FAQ are all stronger. The biggest drag remains **Trustworthiness** — specifically the WhatsApp CTAs and the static scarcity claim.

---

## SEO Metadata — v3 Assessment

### Page Title (`app/pricing/page.tsx` line 6)

**Current:**
```
UI/UX Design Pricing | $2000/mo Unlimited
```

**Assessment:** ✅ This is still the strongest title tag in the entire site. It contains a price point (high-intent signal), the service category, and the "Unlimited" modifier that addresses the main subscription concern. No change recommended.

**One note:** `$2000/mo` — consider whether to write `$2,000/mo` with the comma for clarity. Without the comma it reads slightly informal, though search engines don't differentiate.

---

### Meta Description (`app/pricing/page.tsx` line 7–8)

**Current:**
```
UI/UX design from $2000/mo — unlimited requests, 48hr turnaround. Save 60% vs US agencies. No contracts, pause anytime.
```

**Assessment:** ✅ Strong. Specific price, specific turnaround, specific saving claim, specific flexibility signal. Under 155 characters. No significant change needed.

**Minor inconsistency:** The hero says `50-70%` savings, the meta description says `60%`. These should be aligned.

**Recommended micro-fix:**
```
UI/UX design from $2,000/mo — unlimited requests, 48hr turnaround. Save 50-70% vs US agencies. No contracts, pause anytime.
```

---

### OpenGraph (`app/pricing/page.tsx` lines 11–19)

**Current OG title:**
```
UI/UX Design Pricing | $2000/mo Unlimited · Save 60% vs Agencies
```

**Assessment:** ✅ Good for social sharing — price point and saving claim are both present. Same `60%` vs `50-70%` inconsistency as the meta description applies here too.

**Current OG description:**
```
Unlimited design requests from $2000/mo. 48hr turnaround, no contracts. Or try $350 pilot first. 100% satisfaction guarantee.
```

**Assessment:** ✅ One of the best OG descriptions in the repo — it mentions the pilot option (`$350 pilot first`) which is a unique differentiator that most competitors don't offer. Keep.

---

### JSON-LD Schema (`app/pricing/page.tsx` lines 35–75)

**Current schema issues:**

| Field | Current | Assessment |
|---|---|---|
| `aggregateRating.reviewCount: "50"` | 50 reviews in schema | ⚠️ Not verifiable on-page. Google's quality raters and structured data validators look for schema values that match visible page content. If no star rating count is visible to a human reader, this may trigger a manual review flag. |
| `aggregateRating.ratingValue: "5.0"` | 5.0 in schema | ⚠️ Same issue — visible `5.0★` in the hero stats strip counts as a partial signal, but the `reviewCount` of 50 has no corresponding visible element |
| `Offer.priceValidUntil: "2026-12-31"` | Expires Dec 31, 2026 | ⚠️ Only 4 months from audit date. Update this date when refreshing pricing. If it passes without update, Google may stop showing rich results for this offer. |
| `5-Day Pilot` offer `price: "350"` | $350 | ✅ Matches the Design+Dev tier in the component |

**Recommended schema additions:**
- Add a `description` to the org `provider` field with a brief sentence (currently only `name: "UI Pirate"`)
- Consider adding a `url` to the `aggregateRating` pointing to Clutch or Upwork where the reviews can be verified

---

### Keywords (`app/pricing/page.tsx` lines 9–10)

**Current keywords include:**
```
cheap UI design agency, affordable UX design
```

**Assessment:** ⚠️ `cheap` is a problematic word on a $2,000/month pricing page. Searchers using "cheap UI design agency" are almost certainly looking for sub-$500 solutions. Attracting this traffic creates a misfit lead problem — visitors who can't afford the pricing, generating bounce signals.

**Recommended removals:**
- `cheap UI design agency`
- `affordable UX design` (same issue)

**Recommended additions:**
- `design subscription agency`
- `unlimited design requests pricing`
- `SaaS design retainer`
- `design and development retainer`

---

## Keyword Gap Analysis (v3 — New Finding)

Cross-referencing the page's copy against high-intent queries a B2B buyer would use when evaluating a design agency's pricing:

| Target phrase | Present in page copy? | Gap |
|---|---|---|
| `design retainer pricing` | Partially (`Monthly Retainer` plan label) | ⚠️ Not in a headline or body sentence |
| `unlimited design requests` | In hero meta and FAQ | ✅ Present |
| `SaaS design agency pricing` | Not explicitly | ❌ Missing from H1 and body |
| `design agency vs freelancer cost` | In comparison table | ✅ Present (as column header) |
| `how much does UI/UX design cost` | Not addressed | ❌ High-intent FAQ question — missing from pricing FAQ |
| `5 day design sprint` | Not in copy | ⚠️ `5-Day Pilot` is present but `sprint` variant is not |
| `no contract design agency` | In meta description only | ⚠️ Not in visible page body copy |
| `pause design subscription` | In FAQ only | ⚠️ Not in hero or plans copy |

**Key finding:** The pricing FAQ is missing the single most-searched pricing query: *"How much does UI/UX design cost?"* This is the highest-volume transactional question for the category, and a pricing page is the perfect place to answer it definitively. Adding this as a FAQ item would improve both AI citation readiness and organic search appearance.

---

## AI Citation Readiness Assessment (v3 — New Finding)

| Signal | Current state | Score |
|---|---|---|
| Price points stated clearly | `$2,000/mo`, `$150/$250/$350` pilot tiers — present | ✅ Strong |
| Comparison anchor | `vs $8-15k/mo for a typical agency retainer` — present on card | ✅ Strong |
| JSON-LD Service schema | Present with offers and pricing | ✅ Strong |
| Satisfaction guarantee | `100% satisfaction guarantee` — present | ✅ Strong |
| FAQ structured answers | 6 clear Q&A pairs in pricing FAQ | ✅ Strong |
| "5/7 Communication" | Unexplained abbreviation — not quotable | ❌ Weak |
| `companies like yours` | No specific names — not citable | ❌ Weak |
| Broken sentence in benefits | `shows you see our execution` — grammatically un-citable | ❌ Weak |
| Missing cost FAQ | No answer to "how much does UI/UX design cost" | ❌ Gap |

**AI Citation Readiness Score: 66/100**

The pricing page is the best-performing page in the site for AI citation readiness — it has clear price points, a comparison table, and a good FAQ. The remaining weak spots (broken sentence, vague "companies like yours", missing cost FAQ) are all fixable with copy changes.

---

## New Copy Recommendations (v3 — SEO Content Skill Applied)

### NC1. WhatsApp CTAs → cal.com (Highest Priority)

**Confirmed in:** `landing/pricing/index.tsx` L172, L223, L253

Three `Chat on WhatsApp` buttons — one on the Monthly Retainer card, two on the Custom Quote card (separate desktop and mobile renders).

**Recommended replacements:**

| Location | Current | Recommended | Link |
|---|---|---|---|
| Monthly Retainer (L172) | `Chat on WhatsApp` | `Get Started →` | `https://cal.com/ui-pirate/15min` |
| Custom Quote desktop (L223) | `Chat on WhatsApp` | `Book a Discovery Call →` | `https://cal.com/ui-pirate/15min` |
| Custom Quote mobile (L253) | `Chat on WhatsApp` | `Book a Discovery Call →` | `https://cal.com/ui-pirate/15min` |

**Why `Get Started →` for Monthly Retainer vs `Book a Discovery Call →` for Custom Quote:**
The retainer has a fixed price — the buyer knows what they're getting into. `Get Started` implies lower friction. Custom Quote is open-ended — the buyer needs a conversation first. `Book a Discovery Call` accurately sets expectations for what happens next.

---

### NC2. Benefits Row — Fix Broken Sentence

**Confirmed in:** `landing/pricing/index.tsx` L66

**Current:**
```
"Big scope. Big budget. No blind trust. This 5-day pilot shows you see our execution before committing long term."
```

**Recommended:**
```
"Big scope. Big budget. No blind trust. The 5-day pilot lets you see our quality of execution before committing to a full engagement."
```

Changes: `shows you see` → `lets you see` (grammatically correct); `long term` → `a full engagement` (more professional register, aligns with the B2B tone elsewhere).

---

### NC3. `5/7 Communication` → Plain English

**Confirmed in:** `landing/pricing/index.tsx` L33, L43, L52 — appears on all three feature lists.

**Current:**
```
"5/7 Communication"
```

**Recommended:**
```
"Mon–Fri communication, <2hr response"
```

This is the same information, in plain English, aligned with the trust stat strip in the hero. It also adds verifiability — `<2hr response` is already displayed prominently in the hero stats.

---

### NC4. Monthly Retainer — Subtitle + `endless possibilities`

**Confirmed in:** `landing/pricing/index.tsx` L119 (subtitle), L143 (`endless possibilities`)

**Current subtitle:**
```
"For teams that need design & dev support, every month"
```

**Recommended subtitle:**
```
"Your dedicated design and development team — without the full-time headcount"
```

This leads with the *outcome* (dedicated team, no hiring) instead of describing the plan's cadence.

**Current italic line:**
```
"One subscription, endless possibilities"
```

**Recommended:**
```
"One team, one subscription — no overhead, no contracts"
```

This is specific (no overhead, no contracts — both verifiable), replaces a consumer-app cliché, and aligns with what's actually on the card.

---

### NC5. Scarcity Message — Replace Static Copy

**Confirmed in:** `landing/pricing/index.tsx` L165

**Current:**
```
"Only accepting 2 new clients this month"
```

This has been on the page for multiple audit cycles with no change. A returning visitor — or any visitor who has seen this site before — recognises it as static copy. Static scarcity destroys trust faster than no scarcity at all (Cialdini, *Influence*).

**Two options:**

**Option A — Always-true alternative (no maintenance required):**
```
"We keep our client list intentionally small. Every project gets full team attention."
```

**Option B — Dynamic scarcity (requires monthly update):**
```
"[N] retainer slots open this month → [X] taken"
```
This requires updating the number monthly — but is highly effective when real.

Option A is recommended for immediate implementation. Option B is better long-term if you're willing to maintain it.

---

### NC6. Custom Quote Subtitle — Pick One Audience

**Confirmed in:** `landing/pricing/index.tsx` L212

**Current:**
```
"For complex products, enterprise needs & startups"
```

Enterprise and startups are opposite audience segments. Naming both signals "this is for everyone" — which means the copy does no filtering work.

**Recommended (enterprise focus):**
```
"For organizations with complex products, custom delivery needs, or large team workflows"
```

**Recommended (growth-stage focus, if that's the real target):**
```
"For funded startups and growing SaaS teams building at scale"
```

Choose based on who actually closes Custom Quote deals. If enterprise, use the first. If growth-stage, use the second.

---

### NC7. Satisfaction Guarantee — Name Real Clients

**Confirmed in:** `landing/pricing/index.tsx` L308–310

**Current:**
```
"Not happy with the first milestone? We'll refund your deposit — no questions asked.
We're confident in our work because we've done this 100+ times for companies like yours."
```

**Recommended:**
```
"Not happy with the first milestone? We'll refund your deposit — no questions asked.
We've done this for companies like Ipsos, Khaitan & Co, and Sarge — and we stand behind every project the same way."
```

Named clients + kept the refund guarantee = maximum trust signal at the highest-friction moment (right before conversion). This is one of the highest E-E-A-T improvements available via copy alone.

---

### NC8. Pilot Tier Descriptions — Outcome-Based Rewrites

**Confirmed in:** `screens/pricing/tryBeforeCommit/index.tsx` L17–21

**Current:**
```
Design        $150   "UI/UX design sprint"
Development   $250   "Code implementation"
Design + Dev  $350   "Full-stack delivery"
```

**Recommended:**
```
Design        $150   "5 screens or 1 complete user flow — polished Figma file, ready for dev handoff"
Development   $250   "Working component or feature — clean, production-ready code you can deploy"
Design + Dev  $350   "Designed and built in 5 days — you own all files and code, no strings attached"
```

Each description now states: (1) what the deliverable is, (2) what format it comes in, (3) the buyer's ownership of it. This is the information a buyer needs to decide whether $150/$250/$350 is worth spending.

---

### NC9. PerfectFor Cards — Rewrites (Same as Landing Page)

**Confirmed in:** `screens/pricing/perfectFor/index.tsx` L14–43

The same `perfectFor` component is used on both the landing page and the pricing page. These rewrites apply to both.

**Current vs. Recommended:**

| Card | Current | Recommended |
|---|---|---|
| Funded Startups | `Ship fast and impress investors with premium UI that stands out in competitive markets.` | `You raised a round. Now you need a product that looks as good as the idea you pitched. We help you ship it.` |
| SaaS Companies | `Without in-house design teams, needing consistent updates and design system maintenance.` | `No in-house design team, but a product that needs to keep moving. We plug in as your design and dev partner.` |
| Agencies | `White-label design support for client projects when your team is at capacity.` | `Your team is at capacity. We work as a white-label partner on client projects — no handoff friction, full execution.` |
| Enterprise Teams | `Overflow design capacity without the overhead of hiring full-time designers.` | No change needed — this card is already the strongest. |

---

### NC10. Missing FAQ — "How much does UI/UX design cost?"

The pricing FAQ has 6 good questions but is missing the highest-volume transactional query for the category.

**Recommended addition (insert as first or second FAQ item):**

```
Q: How much does UI/UX design typically cost?
A: It depends heavily on the scope and model. A US agency retainer runs $8,000–15,000/month.
   A freelancer costs $3,000–5,000/month — but with variable quality and availability risk.
   UI Pirate's retainer starts at $2,000/month for unlimited design requests, 48hr turnaround,
   and the full design-and-development stack. For defined-scope projects (landing pages, SaaS
   redesigns), fixed-price quotes are available from $1,500. See the full comparison above.
```

This answer: names the cost explicitly, provides competitive context (matches the comparison table), and links back to the page — all AI citation readiness signals.

---

## Updated Priority Table (v3)

All items from v2 carried forward. New items marked `[v3]`. Items code-verified as still open marked ✓.

| # | Section | Issue | File | Priority | Verified |
|---|---|---|---|---|---|
| 1 | Pricing Cards | Monthly Retainer CTA: `Chat on WhatsApp` → `Get Started →` (cal.com) | `landing/pricing/index.tsx` L174 | ✅ Done | ✓ |
| 2 | Pricing Cards | Custom Quote CTA (desktop): `Chat on WhatsApp` → `Book a Discovery Call →` (cal.com) | `landing/pricing/index.tsx` L227 | ✅ Done | ✓ |
| 3 | Pricing Cards | Custom Quote CTA (mobile): `Chat on WhatsApp` → same as #2 | `landing/pricing/index.tsx` L260 | ✅ Done | ✓ |
| 4 | Benefits Row | `shows you see our execution` — fix broken sentence (see NC2) | `landing/pricing/index.tsx` L66 | ✅ Done | ✓ |
| 5 | Feature Lists | `5/7 Communication` → `Mon–Fri communication, <2hr response` (all 3 plans) | `landing/pricing/index.tsx` L32, L42, L52 | ✅ Done | ✓ |
| 6 | Hero CTA | `Book a Call →` links to `/contact` — change to `cal.com/ui-pirate/15min` | `pricing/hero/index.tsx` L117 | 🟠 Soon | ✓ |
| 7 | Pricing Cards | Section H2 — replaced generic copy | `landing/pricing/index.tsx` L89 | ✅ Done — now `Transparent Pricing for SaaS Teams` | ✓ |
| 8 | Pricing Cards | Monthly Retainer subtitle — lead with buyer outcome (see NC4) | `landing/pricing/index.tsx` L119 | ✅ Done | ✓ |
| 9 | Pricing Cards | Scarcity message — replace static `Only 2 new clients` (see NC5) | `landing/pricing/index.tsx` L165 | 🟠 Soon | ✓ |
| 10 | Pricing Cards | Custom Quote subtitle — `enterprise needs & startups` → pick one (see NC6) | `landing/pricing/index.tsx` L212 | 🟠 Soon | ✓ |
| 11 | PerfectFor | Rewrite Funded Startups + SaaS Companies cards (see NC9) | `pricing/perfectFor/index.tsx` L17-25 | 🟠 Soon | ✓ |
| 12 | PerfectFor | Replace `FIT CHECK` badge with `WHO IT'S FOR` | `pricing/perfectFor/index.tsx` L63 | ✅ Done | ✓ |
| 13 | PerfectFor | Replace emoji icons in "Not the right fit" strip with `✕` text icon | `pricing/perfectFor/index.tsx` L46-49 | ✅ Done | ✓ |
| 14 | TryBeforeCommit | Pilot tier descriptions — rewrite to outcomes (see NC8) | `tryBeforeCommit/index.tsx` L18-21 | 🟠 Soon | ✓ |
| 15 | Pricing FAQ | Add `How much does UI/UX design cost?` as first FAQ item (see NC10) | `pricing/faq/index.tsx` | 🟠 Soon `[v3]` | ✓ |
| 16 | Pricing FAQ | Replace `Chat With Us` CTA with `Book a Free 15-Min Call →` (cal.com) | `pricing/faq/index.tsx` L101 | 🟠 Soon `[v3]` | ✓ |
| 17 | Guarantee | Replace `companies like yours` with real client names (see NC7) | `landing/pricing/index.tsx` L319 | ✅ Done — now names Ipsos, Khaitan & Co, RevUp AI | ✓ |
| 18 | Pricing Cards | `One subscription, endless possibilities` → specific line (see NC4) | `landing/pricing/index.tsx` L143 | 🟡 Consider | ✓ |
| 19 | SEO Keywords | Remove `cheap UI design agency`, `affordable UX design` — wrong audience signal | `app/pricing/page.tsx` L10 | 🟡 Consider `[v3]` | ✓ |
| 20 | SEO Keywords | Add `design subscription agency`, `SaaS design retainer`, `unlimited design requests pricing` | `app/pricing/page.tsx` L10 | 🟡 Consider `[v3]` | ✓ |
| 21 | Schema | `priceValidUntil: "2026-12-31"` — update before Dec 31 | `app/pricing/page.tsx` L55 | 🟡 Consider `[v3]` | ✓ |
| 22 | Schema | `reviewCount: 50` not verifiable on-page — add visible review count near guarantee | `app/pricing/page.tsx` L73 | 🟡 Consider `[v3]` | ✓ |
| 23 | Meta | Align `60%` saving claim in meta description with `50-70%` on-page | `app/pricing/page.tsx` L8 | 🟡 Consider | ✓ |
| 24 | Trust Stats | `5.0★` — star glyph in numeric value causes parsing ambiguity | `pricing/hero/index.tsx` L13 | 🟡 Consider | ✓ |
| 25 | Comparison | `Enterprise` quality claim is self-assessed — link to case studies or Clutch | `pricing/comparison/index.tsx` L25 | 🟡 Consider | ✓ |
| 26 | TryBeforeCommit | Two scarcity signals (`Only 2 new clients` + `Limited slots`) — unify messaging | `landing/pricing/index.tsx` + `tryBeforeCommit/index.tsx` | 🟡 Consider | ✓ |

---

## E-E-A-T Quick Wins (v3 Summary)

These 3 changes have the highest E-E-A-T return for the least effort on the pricing page:

1. **Fix the 3 WhatsApp CTAs** (`landing/pricing/index.tsx` L172, L223, L253) — replace with cal.com links. Single most damaging issue for conversion. A US buyer evaluating a $2,000/month retainer who sees `Chat on WhatsApp` as the only action closes the tab. Three string changes, maximum impact.

2. **Fix the broken sentence** (`landing/pricing/index.tsx` L66) — `shows you see our execution` → `lets you see our quality of execution`. One sentence. A grammar error in a benefits card directly under the pricing cards is a trust signal failure at the exact moment of decision.

3. **Replace `companies like yours` with client names** (`landing/pricing/index.tsx` L310) — the guarantee is your strongest trust moment on the page. Replacing `companies like yours` with `Ipsos, Khaitan & Co, and Sarge` turns a generic claim into a verifiable, name-dropping proof statement. One sentence change.

---

## Pricing Page — What's Actually Working Well (v3 Recognitions)

Unlike the landing page where almost all v2 items remain open, the pricing page has several genuinely strong elements that should be preserved exactly as-is:

- ✅ **Hero H1** — `Simple, Transparent Pricing` — addresses the two biggest pricing anxieties directly
- ✅ **`Save 50-70%` pill** — price anchoring before the visitor sees any numbers
- ✅ **Comparison table** — structure and data are solid; `How We Stack Up` heading is clear
- ✅ **TryBeforeCommit description** — `your fee is fully deductible from the final project invoice` — this is the best sentence on the entire pricing page. It removes the financial risk completely.
- ✅ **Pricing FAQ content** — 6 buyer-blocker questions with clean answers. This is better than the landing page FAQ and should not be replaced — only extended with the cost FAQ (NC10).
- ✅ **PDF download** — confirmed file exists in `/public/`, CTA label is clear, download attribute is set correctly.
- ✅ **`ZERO RISK` badge** on TryBeforeCommit — most powerful badge label in the site.

---

## Copy Tone Reference — v3 Additions (Pricing-Specific)

*The original Copy Tone Reference from v2 remains valid. These additions are specific to patterns found in the v3 pricing source code review.*

| ✅ Do | ❌ Avoid | Example from current code |
|---|---|---|
| Name the action, name the channel | Platform name as CTA label | `Chat on WhatsApp` on a $2,000/month plan |
| Describe deliverables, not process types | One-word category labels | `Code implementation` (pilot tier description) |
| Use plain English for SLAs | Internal abbreviations | `5/7 Communication` |
| Name real clients in guarantees | Generic audience references | `companies like yours` |
| Make scarcity real or replace it | Static "limited availability" copy | `Only accepting 2 new clients this month` |
| Lead with buyer outcome in plan labels | Describe the plan mechanics | `For teams that need design & dev support, every month` |

*Extended word removal list (v3 pricing additions):* `endless possibilities`, `chat on whatsapp`, `companies like yours`.

---

*This file is the living audit for the pricing page. v1 (2026-08-XX) → v2 (2026-08-27) → v3 (2026-08-31). Always verify against current source code before implementing — the code is the ground truth.*
