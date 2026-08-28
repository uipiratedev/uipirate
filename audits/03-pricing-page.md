# Pricing Page Content Audit — UI Pirate
**Page:** `/pricing`
**Files in scope:** `app/pricing/page.tsx` · `screens/pricing/` · `screens/landing/pricing/index.tsx`
**Focus:** Copy, messaging, positioning, conversion logic, SEO metadata, and structural decisions
**Research basis:** Apple HIG, Google Material UX Writing, Nielsen Norman Group, Copyhackers JTBD, E-E-A-T guidelines, CRO research, B2B pricing psychology (Predictably Irrational — Ariely, Influence — Cialdini), agency pricing studies, SaaS pricing benchmark data
**Last audited:** 2026-08-27 (v2 — post-target-audience restructure)

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

**Still present from v1 (unresolved):**
- Monthly Retainer subtitle still "For teams that need design & dev support, every month"
- Monthly Retainer CTA is still "Chat on WhatsApp" — not fixed
- Custom Quote subtitle still "For complex products, enterprise needs & startups"
- Scarcity message still "Only accepting 2 new clients this month"
- Satisfaction Guarantee still "companies like yours"
- Benefits section still contains the broken 5-Day Pilot sentence

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
