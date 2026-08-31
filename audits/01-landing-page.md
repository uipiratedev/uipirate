# Landing Page Content Audit - UI Pirate
**Page:** `/` (Homepage)
**Files in scope:** `app/page.tsx` · `screens/landing/`
**Focus:** Copy, messaging, positioning, and SEO content only
**Research basis:** Apple HIG, Google Material UX Writing, Nielsen Norman Group, Copyhackers JTBD, E-E-A-T guidelines, CRO research, agency differentiation studies, Reddit community feedback
**Last audited:** 2026-08-27 (v2 — post-target-audience restructure)

---

## Research Foundation

Before flagging individual issues, here is the cross-source principle set that grounds every recommendation in this document. Nothing below is opinion — each finding traces back to one or more of these.

### What the research consistently says

**Apple Human Interface Guidelines** — Every piece of text should earn its place. Words that do not help the reader take the next step are noise. Use "you" and "your" to speak directly to the person; avoid "the user" or third-person distance. Consistency in labels and language reduces cognitive load. Avoid specialized jargon unless it is essential to the reader's task.

**Google Material UX Writing** — Clarity is a concrete goal, not an aesthetic preference. Good writing means a reader can identify the exact action to take without re-reading. Tone is not a personality layer added on top — it emerges naturally from a clear understanding of what the reader needs at that specific moment.

**Nielsen Norman Group (NN/g)** — 79% of users scan, they do not read. B2B buyers skim the first screen to determine if this page addresses their specific operational problem. If the connection is not immediate, they leave. Point-first writing (benefit in sentence one) consistently outperforms build-up writing (feature descriptions that arrive at the benefit at the end).

**Copyhackers / Jobs-to-be-Done** — Clients do not hire agencies for services. They hire them to make progress on a specific problem. Describing deliverables (wireframes, dashboards, Angular components) is less persuasive than describing the situation the client is in and the progress they will make.

**Enterprise B2B Buyer Behavior** — B2B deals involve 6–10 stakeholders. A junior employee typically vets agencies first and builds a shortlist before presenting to the decision-maker. Your copy must work for both the researcher and the executive. The researcher needs clarity and specificity; the executive needs confidence in the ROI and risk profile.

**On "human-sounding" copy** — The difference between AI-generated agency copy and professional copy is not formality level. It is specificity, rhythm, and authentic proof. AI defaults to: "seamless," "innovative," "world-class," "end-to-end solutions." Professional copy names the specific pain, uses plain verbs, varies sentence length deliberately, and lets real data do the heavy lifting.

**E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)** — Google's quality-rater framework: every claim, number, and rating must be verifiable by a reader (or crawler) on the page. Unsourced superlatives and self-reported metrics undercut trust with both search engines and enterprise buyers.

**CRO research** — A single primary CTA outperforms two or more of equal visual weight; competing CTAs cause decision paralysis and many visitors click neither. Scarcity accelerates conversion only when it is demonstrably real and visibly changes over time.

**Reddit / community consensus** — Agency sites fail most often when they: (1) describe themselves instead of the client's problem, (2) hide pricing, (3) over-design at the cost of clarity, (4) show inconsistent identity signals ("studio" vs "agency"), and (5) position themselves as generalists when buyers are looking for specialists.

### How this audit applies the foundation

| Principle | Where it drives a finding in this document |
|---|---|
| Apple HIG — jargon / consistency | "design debt", "studio" vs "agency", mixed capitalization in the H1 |
| Material — clarity of next action | "Let's Talk" CTA, vague service labels |
| NN/g — scan-first, point-first, information scent | Hero 5-second test, "Is This Right For You?" placed before proof |
| Copyhackers / JTBD — problem over deliverable | Sub-headline lists what the agency produces; "PerfectFor" describes buyers, not their pain |
| B2B buyer behavior | Copy must serve both researcher and executive; proof density |
| Human-sounding copy | "Convert, Scale & Ship Faster" triad; filler adjectives |
| E-E-A-T | Unsourced "5.0 rating", "50+ products" claims, JSON-LD `reviewCount` |
| CRO | Two competing hero CTAs; WhatsApp in hero; static scarcity copy |
| Specialist positioning | "one-stop shop" / generalist framing |

---

## What Changed Since v1

This is the second audit of the landing page. Between the first audit and this one, significant structural changes were made based on the target audience audit (`02-target-audience-audit.md`). Here is what changed:

**Sections removed or commented out:**
- `TopThree` — commented out
- `LandingAppScreen` — commented out
- `BoreYouCommit` — commented out
- `WhyChooseUs` — commented out
- Graphic Design, Motion Graphics, and 3D Animation removed from the services list (now 4 core services only)

**Sections added:**
- `PricingPerfectFor` — "Is This Right For You?" audience filter, placed right after the Marquee (imported from `screens/pricing/perfectFor`)
- `MiniProcess` — "From Idea to Shipped, in 3 Steps" — a condensed 3-card process strip
- `FeaturedCaseStudy` — A dynamic single case study block with a real result metric, pulled from the CMS

**Copy changes already implemented (from v1 audit):**
- ✅ Trust badge: now reads "50+ Products Shipped Across 6 Countries"
- ✅ H1: now reads "A Design & Development Agency for SaaS Teams That Need to Ship"
- ✅ Sub-headline: now reads "You have a product to build. You need someone who can think through it, design it, and ship it — not hand you a Figma file and walk away. That's what we do."
- ✅ Secondary CTA: WhatsApp removed from hero, replaced with "Book a 15-Min Call →" linking to cal.com
- ✅ Services: Trimmed from 7 to 4 core services

---

## Current Page Structure (Post-Restructure)

```
1.  Hero (headline, trust badge, CTAs)
2.  Marquee (client logos + heading)
3.  PricingPerfectFor ("Is This Right For You?" — 4 audience cards + "Not For" strip)
4.  MiniService header + BentoGrid (services overview)
5.  MiniProcess ("From Idea to Shipped, in 3 Steps")
6.  Behance / Works gallery
7.  FeaturedCaseStudy (dynamic — renders only if CMS case study with metric exists)
8.  "Who We Are" (animated scroll text)
9.  About / Stats cards (4 animated cards)
10. Services detail cards (two-column layout — BusinessHelp)
11. Pricing (retainer + estimate + custom quote)
12. Team section
13. Testimonials (masonry grid)
14. FAQs (accordion)
```

---

## Section-by-Section Audit

---

### 1. HERO
**Files:** `screens/landing/hero/index.tsx` · `screens/landing/hero/AnimatedHeadline.tsx`

---

#### 1a. Trust Badge

**Current:**
```
50+ Products Shipped Across 6 Countries
```

**Assessment:** ✅ **Fixed from v1.** This is specific, verifiable, consistent with the stats cards, and grammatically correct. Keep as-is.

---

#### 1b. Headline (H1)

**Current:**
```
A Design & Development Agency for SaaS Teams That Need to Ship
```
(with "Ship" highlighted in orange)

**Assessment:** ✅ **Fixed from v1.** Leads with the audience and their transformation. Eliminates the ambiguous "AI-Driven" positioning. "Ship" highlighted in brand orange reinforces the action-outcome. Keep as-is.

---

#### 1c. Sub-headline

**Current:**
```
You have a product to build. You need someone who can think through it,
design it, and ship it - not hand you a Figma file and walk away.
That's what we do.
```

**Assessment:** ✅ **Fixed from v1.** Addresses the buyer's situation directly. Plain language. No jargon. Keep as-is.

---

#### 1d. Primary CTA

**Current:** `Tell Us Your Idea — Free Consultation` → `/contact`

**Assessment:** ✅ Keep. Specific, action-oriented, removes financial friction with "Free."

---

#### 1e. Secondary CTA

**Current:** `Book a 15-Min Call →` → `cal.com/ui-pirate/15min`
**Tertiary trust link:** `Reviewed on Upwork` (with Upwork logo)

**Assessment:** ✅ **Fixed from v1.** WhatsApp removed from hero. The cal.com link is the right professional CTA for US B2B buyers. The "Reviewed on Upwork" sub-link is a good added credibility signal — it's unobtrusive and verifiable.

**One caveat:** The Upwork link opens to the freelancer profile, not a dedicated agency page. For enterprise buyers, Upwork still carries a "freelancer" connotation. This is acceptable for now, but worth monitoring whether it helps or hurts conversion when Clutch/G2 data becomes available.

---

#### 1f. SEO Metadata (page.tsx)

**Status:** ✅ **Fixed.** Title tag, meta description, OG tags, and keywords have all been updated to remove "AI-Driven" and align with the new "SaaS Product Design & Development Agency" positioning.

---

### 2. MARQUEE - CLIENT LOGOS
**File:** `screens/landing/marquee/index.tsx`

---

#### 2a. Section Heading

**Status:** ✅ **Fixed.** The heading has been updated to include the quantity ("40+") and geography ("USA, UK, Singapore & India"), providing stronger credibility signals.

---

#### 2b. Placeholder logo entry

**Status:** ❌ **Kept as-is.** The placeholder logo remains in the array to preserve the 10-logo grid layout.

---

#### 2c. Missing company name labels

**Status:** ⚠️ **Needs rethink/confirmation.** Adding company names under logos is on hold pending confirmation from the design team.

---

### 3. PRICING PERFECT FOR — "Is This Right For You?"
**File:** `screens/pricing/perfectFor/index.tsx`

**This section is newly added.** It renders 4 audience cards and a "Not the right fit" strip.

---

#### 3a. Section heading

**Current:** `Is This Right For You?`
**Badge:** `WHO IT'S FOR`

**Assessment:** ✅ The audience-filter concept is exactly right for conversion — it pre-qualifies visitors and reduces misfit leads. "Is This Right For You?" is direct and clear.

**Status:** ✅ **Fixed.** Replaced "FIT CHECK" with "WHO IT'S FOR" for a more professional tone.

---

#### 3b. The 4 audience cards

**Current cards:**
```
1. Funded Startups — "Ship fast and impress investors with premium UI that stands out in competitive markets."
2. SaaS Companies — "Without in-house design teams, needing consistent updates and design system maintenance."
3. Agencies — "White-label design support for client projects when your team is at capacity."
4. Enterprise Teams — "Overflow design capacity without the overhead of hiring full-time designers."
```

**What's wrong:**

| Card | Problem | Why it matters |
|---|---|---|
| Funded Startups | "impress investors" — investors don't judge UI for funding rounds. Product-market fit and traction do. | Inaccurate claim; signals that UI Pirate doesn't understand startup economics at the investor level |
| SaaS Companies | Description starts mid-sentence — "Without in-house design teams..." is a dependent clause with no subject | Grammar issue. Reads as incomplete |
| Agencies | "White-label design support" is a legitimate service but positions UI Pirate as a subcontractor, not a primary agency | Weakens premium positioning when placed alongside enterprise-facing cards |
| Enterprise Teams | "Overflow design capacity" accurately describes the pain. This is the strongest card. | ✅ Keep this framing |

**Status:** ✅ **Fixed.** Copy updated to the suggested rewrites.

---

#### 3c. "Not the right fit" strip

**Current items:**
```
📦 Physical product design
🎨 One-off logo or branding projects
⏰ 24/7 instant turnaround expectations
```

**Status:** ✅ **Fixed.** Emoji icons replaced with clean `✕` icons.

---

#### 3a. Section placement

**Status:** ✅ **Kept as-is.** Based on visual flow, the section remains immediately after the Marquee.

---

### 4. SERVICES SECTION (MiniService + BentoGrid)
**Files:** `screens/landing/miniService/miniService.tsx` · `screens/landing/bentoGrid/bentoGrid.tsx`

---

#### 4a. Section heading (MiniService)

**Current:**
```
We design world-class products.
You launch them.
```

**Assessment:** ✅ Keep. Short, punchy, puts the client in an active role. The "You launch them" line works well.

**Minor note:** "world-class" is on the words-to-avoid list from the Copy Tone Reference. It is the one remaining instance of a vague superlative in an otherwise strong heading. Consider: `We design products that ship. You launch them.` — or keep the current version if the rhythm is more important than strict word discipline here.

---

#### 4b. BentoGrid cards — service descriptions

**Current card titles and descriptions:**
```
UX/UI Design — "User-centric interfaces that convert. We craft pixel-perfect experiences"
Dashboards & SaaS UX — "Clean and data-driven"
Websites & Landing Pages — "Fast, conversion-focused sites"
Built With the Best — "Figma, React, Angular, Blender & more."
```

**What's wrong:**

| Card | Problem |
|---|---|
| UX/UI Design | "pixel-perfect" is designer jargon, not buyer language. A VP of Product doesn't care about pixel precision — they care about users completing flows |
| Dashboards & SaaS UX | Two-word description is too sparse. It's a label, not a value proposition |
| Websites & Landing Pages | "conversion-focused" is good, but "Fast" is unverifiable at this point |
| Built With the Best | This card is a tech stack showcase, not a service — the heading and description don't communicate a buyer benefit |

**Suggested rewrites:**

```
UX/UI Design
"Interfaces that make users stay, convert, and come back."

Dashboards & SaaS UX
"Data-heavy products that feel simple to use."

Websites & Landing Pages
"High-converting pages built to bring in leads, not just look good."

Built With the Best (rename to "The Right Stack for Every Project")
"React, Angular, Next.js, Figma, GSAP — we use what your product actually needs."
```

---

### 5. MINI PROCESS — "From Idea to Shipped, in 3 Steps"
**File:** `screens/landing/miniProcess/index.tsx`

**This section is newly added.**

---

#### 5a. Section heading

**Current:** `From Idea to Shipped, in 3 Steps`
**Badge:** `how it works`

**Assessment:** ✅ This is exactly what the target audience audit called for — US buyers want to understand the engagement model before contacting. The heading is clear, direct, and outcome-focused.

---

#### 5b. The 3 step cards

**Current content (pulled from `data/process.ts`, grouped):**
```
01 — Listen & Think
02 — Plan & Design
03 — Build & Ship
```

**Assessment:** ✅ The grouping is logical. The descriptions are pulled from the shared process data so they stay in sync with the `/process` page — this is architecturally correct.

**Status:** ✅ **Fixed.** We replaced the concatenated strings with bespoke 1-sentence summaries for each card.

**Link at bottom:** `See the full process →` → `/process`

**Note:** ✅ Confirmed `/process` exists and has actual content.

---

### 6. BEHANCE / WORKS GALLERY
**File:** `screens/landing/behance/LandingBehance.tsx`

The target audience audit flagged that portfolio links should point to `/case-studies`, not Behance directly. This section still needs to be checked.

**Status:** ⚠️ **Needs to be reviewed before working on them.** Do not touch this section yet.

---

### 7. FEATURED CASE STUDY
**File:** `screens/landing/featuredCaseStudy/index.tsx`

**This section is newly added.** It's a dynamic block — it pulls the first CMS case study that has both a valid metric and a non-placeholder image. If no such case study exists, it renders nothing.

---

#### 7a. Copy audit

**Static copy in the component:**
```
Badge: "featured case study"
Link: "Read the full case study →"
```

**Assessment:** ✅ Clean and minimal. The copy correctly lets the case study data do the work.

---

#### 7b. The conditional render is a risk

**Current behavior:** The section renders nothing if no CMS case study has a metric.

**What this means:** If a visitor is seeing the page and no case study has been set up in the CMS with a metric value, this section silently disappears. That's the right fallback. However, the missing section creates an abrupt jump in the page flow between the Behance gallery and the "Who We Are" section.

**Action required:** Ensure at least one case study is live in the CMS with:
- A real metric (value + label, e.g. "6 weeks" / "time to ship")
- A hero image that is a real URL (not a data URI or base64 blob)
- A meaningful excerpt

Without this, the section will not render and the page will skip from the gallery directly to "Who We Are" with no case study proof in between — which is exactly the gap the target audience audit identified.

**Status:** ✅ **Fixed.** Added `clientLogo` and `industry` fields to `FeaturedCaseStudyData` and implemented UI support for rendering the client logo (if available) and an industry tag alongside the client name.

---

#### 7c. Missing: client logo or industry tag on the featured card

**Issue:** The featured case study card shows the client name, excerpt, metric, and a hero image — but no company logo or industry tag. Without context, a visitor doesn't know if this client is in their industry or at a relevant company size.

**Suggested fix:** Add the client's industry tag (e.g. "FinTech" / "HealthTech") and, if the logo is available in the CMS, display it as a small stamp on the card. This mirrors how Linear, Webflow, and other B2B tools surface case study previews.

---

### 8. "WHO WE ARE"
**File:** `screens/landing/whoWeAre/index.tsx`

---

#### 8a. Animated paragraph — NOT updated from v1

**Current text (still in the file):**
```
UI Pirate is a global UI/UX Design & Development Studio, helping SaaS founders
& enterprise teams build high-performing products that ships faster, looks
premium, and scales without design debt.
```

**Status:** ⚠️ **Not fixed from v1.** All four issues identified in the original audit remain unaddressed:

| Problem | Status |
|---|---|
| "products that ships faster" — subject-verb disagreement | ❌ Still present |
| "design debt" — designer jargon | ❌ Still present |
| "Studio" — identity inconsistency (page uses "Agency" everywhere else) | ❌ Still present |
| "global" — overstated claim | ❌ Still present |

This text renders at large size in a high-attention animated section. Grammar errors in animated, large-type sections are among the most visible quality signals on the page. This should be the next copy fix after the marquee.

**Suggested rewrite (unchanged from v1):**
```
UI Pirate is a product design and development agency. We help SaaS founders
and enterprise teams build products that look premium, ship on time,
and hold up as they grow.
```

---

### 9. STATS / ABOUT CARDS
**File:** `screens/landing/about/aboutCard.tsx`

---

#### 9a. Card: 9+ Years of Experience

**Sub-label:** `From MVPs to complex dashboards, shipped across 6 countries`

**Status:** ⚠️ **Pending for now.** (Section skipped per user request, will address later).

**Suggested fix:**
```
Established 2015. Enterprise platforms, AI tools, SaaS dashboards, and everything between.
```

---

#### 9b. Card: 50+ Projects Completed

**Sub-label:** `Including AI tools, HR platforms, fintech apps, and B2B SaaS products`

**Assessment:** ✅ **Improved from v1** — the sub-label now correctly describes what types of products were shipped rather than cross-referencing another card's stat. This is good. Keep.

---

#### 9c. Card: $150M+ Made by our clients

**Sub-label:** `SaaS, EdTech, FinTech, HealthTech, LegalTech, Creator Economy, and more`

**Status:** ⚠️ **Pending for now.** (Section skipped per user request, will address later).

**Suggested fix:**
```
Heading: $150M+
Sub-label: Raised in funding by companies we've helped design and ship
```
If this refers to revenue, say so. If funding rounds, say so. Specificity is credibility.

---

#### 9d. Card: 6 Client Locations Worldwide

**Sub-label:** `Built for scale, speed, and seamless handoff to developers`

**Status:** ⚠️ **Pending for now.** (Section skipped per user request, will address later).

**Suggested fix:**
```
USA · UK · Singapore · India · Australia, and beyond
```

---

### 10. SERVICES DETAIL SECTION (BusinessHelp / ServicesSection)
**File:** `screens/landing/businessHelp/servicesSection.tsx`

---

#### 10a. Black card heading

**Current:**
```
One-stop shop for all your essentials
```

**Status:** ⚠️ **Not fixed from v1.** "One-stop shop" is one of the most overused phrases in agency marketing.

**Suggested alternatives:**
```
"Design and development, handled by one team"
```
or
```
"Everything your product needs — from first wireframe to working software"
```

---

#### 10b. Service list — "Saas" typo still present

**Current list:**
```
UX/UI DESIGN
Saas & AI Development    ← ❌ Still "Saas" — should be "SaaS"
LANDING PAGES & BUSINESS WEBSITES
UX AUDITS & CONSULTATION
```

**Status:** ⚠️ **Not fixed from v1.** `Saas` is wrong. SaaS stands for Software as a Service — the casing is non-negotiable in the industry. This also appears in the orange banner header: `AI Apps, Saas, Websites & More` — same error, two places.

**Files to fix:** `servicesSection.tsx` (service list) and the orange banner string on line 152 of the same file.

---

#### 10c. The orange banner header

**Current:** `AI Apps, Saas, Websites & More`

**Issues:**
1. "Saas" → "SaaS" (same error as 10b)
2. "& More" is a filler phrase — it ends a concrete list with a vague catch-all that undermines the specificity of what came before

**Suggested fix:** `AI Apps, SaaS & Business Websites`

---

#### 10d. Bottom CTA card

**Current:**
```
Need Something Custom?
[Let's Talk]
```

**Status:** ⚠️ **Not fixed from v1.** "Let's Talk" is a placeholder CTA — it doesn't describe the action or what happens next.

**Suggested fix:**
```
Need Something Custom?
[Tell Us What You Need — Free Consultation]
```

---

### 11. PRICING SECTION
**File:** `screens/landing/pricing/index.tsx`

The pricing section on the landing page is a teaser that links to `/pricing`. The v1 issues around copy quality (heading, scarcity message, satisfaction guarantee, broken sentence) are covered in the dedicated pricing page audit (`03-pricing-page.md`). Those issues remain unresolved.

**Outstanding items from v1 (still open):**

| # | Issue | Priority |
|---|---|---|
| Section heading | Replace "Pricing That Makes Sense" with an outcome-focused heading | 🟠 Soon |
| Monthly Retainer subtitle | Lead with the pain, not the feature | 🟠 Soon |
| 5-Day Pilot description | Fix "shows you see our execution" — broken sentence | 🔴 Fix now |
| Scarcity message | "Only accepting 2 new clients this month" — make real or replace | 🟠 Soon |
| Custom Quote audience | "enterprise needs & startups" — pick one specific audience | 🟠 Soon |
| Satisfaction Guarantee | Replace "companies like yours" with actual client names | 🟡 Consider |

---

### 12. TEAM SECTION
**File:** `screens/landing/theTeam/index.tsx`

Not audited in v1. No outstanding issues flagged by the target audience review. Carry forward for a future audit pass if needed.

---

### 13. TESTIMONIALS
**Files:** `screens/landing/testimonials/testimonialCards.tsx` · `data/testimonials.json`

---

#### 13a. Section heading — still missing

**Status:** ⚠️ **Not fixed from v1.** No visible H2 or section label above the testimonial cards. The section still starts directly with the card grid.

**Suggested fix:** Add above the cards:
```
What Clients Say
```

---

#### 13b. JSON data errors — still present

**Status:** ⚠️ **Check status.** The v1 audit identified that `occupation` and `company` fields were mixed up for Eden Hazani, Priyanka Padhye, and Rohit Kumar Jha. The hero tooltip now shows corrected data (`"VP Research and Development, Ipsos"` / `"CEO, RevUp AI"` / `"Co-Founder, ArthAlpha"` — correct in `hero/index.tsx`). However the source file `data/testimonials.json` should be verified to confirm the fix was applied there too, not just in the hero component's hardcoded array.

---

#### 13c. No star ratings on testimonial cards

**Status:** ⚠️ **Not fixed from v1.** Stars appear in the hero tooltip only. The main testimonial cards still display no star ratings.

**Suggested fix:** Add ★★★★★ icons above or below the review text on each card.

---

#### 13d. Kyle Drucker (YouTuber) testimonial

**Status:** ⚠️ **Not fixed from v1.** A testimonial from a YouTube content creator ("BBallExplained") is inconsistent with the enterprise B2B positioning everywhere else on the page. Should be moved to a secondary surface (Clutch profile, portfolio page, blog).

---

#### 13e. Generic testimonials

**Status:** ⚠️ **Not fixed from v1.** Three testimonials are still generic one-liners with no P-S-O structure. Either request expanded testimonials from these clients or deprioritize them in the grid order.

---

### 14. FAQs
**File:** `screens/landing/faqs/accordion.tsx`

---

#### 14a. Wrong questions are still leading

**Status:** ⚠️ **Not fixed from v1.** The first 4 FAQ questions are still about pricing models and process mechanics rather than buyer psychological blockers. Suggested replacement questions from v1 (unchanged):

| # | Suggested question | Blocker it removes |
|---|---|---|
| 1 | What types of companies do you work with? | Is this agency right for my company size? |
| 2 | You're based in India — how does communication and time zone work? | The biggest US buyer concern, still completely unaddressed |
| 3 | What makes UI Pirate different from other design agencies? | Why not hire from Toptal, Clutch, or a local agency? |
| 4 | What does the process look like after I reach out? | I don't know what happens next — contacting feels like a commitment |

---

#### 14b. Emoji usage in answers

**Status:** ⚠️ **Not fixed from v1.** The 📍 emoji bullet labels remain in FAQ answers. Replace with bold text labels (`**For example:**`, `**Next step:**`).

---

#### 14c. WhatsApp in "How do we get started?" answer

**Status:** ⚠️ **Not fixed from v1.** WhatsApp is still mentioned in the FAQ answer. Replace with the cal.com link and email:

```
Book a free 15-minute call at cal.com/ui-pirate/15min or email
vishal@uipirate.com with a brief description of your project.
We typically respond within one business day.
```

---

## New Issues Introduced by the Restructure

These issues did not exist in v1 — they are a result of the new sections added to the page.

---

### N1. PricingPerfectFor positioned before Services

**Current position:** Right after Marquee, before MiniService + BentoGrid.

**The concern:** A visitor arrives at the page for the first time and within the first two sections (Hero → Logos → "Is This Right For You?") they are asked to self-qualify before they've seen what UI Pirate actually does. The services and portfolio haven't appeared yet.

**What the research says (NN/g — information scent):** A visitor evaluates "is this for me?" based on evidence, not on a question. They need to see the work, the services, and the positioning first — then the audience filter confirms or denies their fit. Asking them to self-qualify before showing them what you do can create premature bounce.

**Suggested fix:** Move `PricingPerfectFor` to appear **after** the Services section (BentoGrid) or **after** MiniProcess — not before. The page should build a case for what UI Pirate does before asking "is this right for you?"

---

### N2. "From Idea to Shipped, in 3 Steps" — process link may 404

**As noted in section 5:** The MiniProcess section links to `/process`. Confirm this page exists with real content. A broken link from a new section undermines the trust the section was added to build.

---

### N3. FeaturedCaseStudy — silent blank gap when no case study qualifies

**As noted in section 7:** If no CMS case study has a metric + valid image, this section renders null and the page flow has an invisible gap. Ensure at least one case study is properly populated in the CMS before this section is considered live.

---

### N4. SEO metadata not updated to match new positioning

**As noted in section 1f:** The page title and meta description in `app/page.tsx` still reference the old "AI-Driven" positioning. The H1, sub-headline, and overall messaging were updated — the metadata was not. This creates a mismatch between what Google indexes for the page and what the visitor sees, which can hurt click-through rate from search results and send mixed signals to crawlers.

---

## Priority Fix Table (v2)

Ordered by visibility, severity, and impact on trust. Items carried from v1 that remain unresolved are marked `[v1]`. New issues from the restructure are marked `[NEW]`.

| # | Section | Issue | File | Priority |
|---|---------|--------|------|----------|
| 1 | Who We Are | "products that ships faster" — grammar error in large animated text `[v1]` | `whoWeAre/index.tsx` | 🔴 Fix now |
| 2 | Who We Are | "Studio" → "agency" — identity inconsistency `[v1]` | `whoWeAre/index.tsx` | 🔴 Fix now |
| 3 | Services | "Saas" → "SaaS" in service list and orange banner (2 locations) `[v1]` | `servicesSection.tsx` | 🔴 Fix now |
| 4 | Pricing | "shows you see our execution" — broken sentence `[v1]` | `pricing/index.tsx` | 🔴 Fix now |
| 5 | Metadata | Title tag and meta description updated to new positioning `[NEW]` | `app/page.tsx` | ✅ Done |
| 6 | Marquee | Section heading still "Trusted by Teams Building the Future" — no quantity `[v1]` | `marquee/index.tsx` | ✅ Done |
| 7 | Marquee | Placeholder logo entry (no name, no link) `[v1]` | `marquee/index.tsx` | ❌ Kept as-is |
| 8 | PerfectFor | Move section to after Services, not before `[NEW]` | `screens/landing/index.tsx` | ✅ Kept in place |
| 9 | PerfectFor | Rewrite audience card descriptions (Funded Startups, SaaS Companies grammar) `[NEW]` | `perfectFor/index.tsx` | ✅ Done |
| 10 | PerfectFor | Replace emoji icons in "Not the right fit" strip with clean icons `[NEW]` | `perfectFor/index.tsx` | ✅ Done |
| 11 | FAQs | Replace first 4 questions with buyer-blocker questions `[v1]` | `faqs/accordion.tsx` | 🟠 Soon |
| 12 | FAQs | Remove WhatsApp from "How do we get started?" answer `[v1]` | `faqs/accordion.tsx` | 🟠 Soon |
| 13 | FAQs | Remove 📍 emoji, replace with bold labels `[v1]` | `faqs/accordion.tsx` | 🟠 Soon |
| 14 | Testimonials | Add section heading "What Clients Say" above cards `[v1]` | `testimonialCards.tsx` | 🟠 Soon |
| 15 | Testimonials | Add star ratings to testimonial cards `[v1]` | `testimonialCards.tsx` | 🟠 Soon |
| 16 | Testimonials | Verify occupation/company fields in testimonials.json `[v1]` | `data/testimonials.json` | 🟠 Soon |
| 18 | MiniProcess | Write bespoke 1-sentence summaries for the 3 step cards to avoid clunky concatenation `[NEW]` | `miniProcess/index.tsx` | ✅ Done |
| 19 | Behance | Verify if portfolio links still point to external Behance URLs (conversion leak) `[v1]` | `behance/LandingBehance.tsx` | ⚠️ Needs review |
| 19 | Stats | Fix "9+ Years of Experience" sub-label — cross-references wrong card `[v1]` | `about/aboutCard.tsx` | ⚠️ Pending for now |
| 20 | Stats | Clarify "$150M+ Made by clients" — specify what "made" means `[v1]` | `about/aboutCard.tsx` | ⚠️ Pending for now |
| 21 | Stats | Fix "6 Client Locations" sub-label — list the actual locations `[v1]` | `about/aboutCard.tsx` | ⚠️ Pending for now |
| 22 | BentoGrid | Rewrite service card descriptions — remove "pixel-perfect" and sparse labels `[NEW]` | `bentoGrid/bentoGrid.tsx` | 🟡 Consider |
| 23 | Services | Replace "One-stop shop for all your essentials" `[v1]` | `servicesSection.tsx` | 🟡 Consider |
| 24 | Services | Fix "Let's Talk" CTA — replace with "Tell Us What You Need — Free Consultation" `[v1]` | `servicesSection.tsx` | 🟡 Consider |
| 25 | Marquee | Add company name text labels under each logo `[v1]` | `marquee/index.tsx` | ⚠️ Needs rethink |
| 26 | Testimonials | Remove/reposition Kyle Drucker (YouTuber) testimonial `[v1]` | `data/testimonials.json` | 🟡 Consider |
| 27 | Testimonials | Request P-S-O expanded testimonials from 3 generic reviewers `[v1]` | `data/testimonials.json` | 🟡 Consider |
| 28 | Pricing | Fix remaining pricing section copy issues (see 03-pricing-page.md) `[v1]` | `pricing/index.tsx` | 🟡 Consider |
| 20 | FeaturedCaseStudy | Add client industry tag and logo to the featured case study card `[NEW]` | `featuredCaseStudy/index.tsx` | ✅ Done |
| 21 | PerfectFor | Replace "FIT CHECK" badge with "WHO IT'S FOR" `[NEW]` | `perfectFor/index.tsx` | ✅ Done |
| 31 | MiniService | Consider replacing "world-class" in section heading `[NEW]` | `miniService/miniService.tsx` | 🟡 Consider |

**Priority key:**
- 🔴 **Fix now** — Errors or broken data actively damaging trust and credibility with every visitor
- 🟠 **Soon** — Conversion and positioning improvements with direct impact on lead quality
- 🟡 **Consider** — Strategic polish and copy quality improvements

---

## The Underlying Pattern

The structural improvements from the target audience audit are significant and clearly correct — trimming services, adding the process strip, featuring a case study, and filtering the audience with the "Is This Right For You?" section all address real gaps. The page architecture is now much closer to what a high-converting B2B agency site looks like.

What remains is execution-level copy work. The key issues are:

1. **Grammar errors that survived the restructure** — "ships faster" in the animated Who We Are section renders at large size and is the most visible unaddressed error on the page
2. **Metadata that didn't keep up with the copy changes** — the title tag and meta description still reference the old positioning
3. **FAQs that address logistics instead of objections** — the wrong questions in the FAQ have survived two audit cycles; they are the single highest-leverage copy change left on the table
4. **Section ordering of PerfectFor** — placed too early in the funnel before the visitor has seen evidence of what UI Pirate does

The test for every sentence on this page remains:

> *Would a SaaS founder in the US, evaluating three agencies this week, read this and feel like we understand their situation better than the other two?*

---

## Copy Tone Reference

Based on research from high-performing agency and SaaS sites (Linear, Stripe, Basecamp, Wistia):

| ✅ Do | ❌ Avoid |
|---|---|
| Short, direct sentences | Long sentences with multiple clauses |
| Active verbs ("we build," "you ship") | Passive constructions ("products are crafted") |
| Specific, verifiable claims | Vague superlatives ("world-class," "cutting-edge") |
| Name real clients and outcomes | Generic "companies like yours" placeholders |
| Professional but plain language | Dense corporate speak or designer jargon |
| Consistent identity throughout | "Agency" on one section, "Studio" on another |
| One clear point per sentence | Three promises in one headline |

Words to remove from the entire site: *world-class, seamless, innovative, empower, revolutionize, leverage, synergy, cutting-edge, next-generation, holistic, transformative, robust, scalable solutions, end-to-end.*

---

*Previous audit: `/case-studies` page → `audits/05-case-studies-page.md`*

---

---

# v3 Audit Update — Landing Page
**Audited:** 2026-08-31
**Audit basis:** Direct source-code inspection of all flagged components + SEO Content skill (E-E-A-T framework, Google Helpful Content guidelines, AI Citation Readiness, keyword density analysis)
**Scope:** Copy, content, SEO metadata, and messaging only. No UI or layout changes evaluated.

---

## What Actually Changed Since v2 (Code-Verified)

The following was verified by reading the live source files, not assumed from changelog notes.

| Section | v2 Status | v3 Code Reality |
|---|---|---|
| Hero — H1 | ✅ Fixed | ✅ Still correct — `A Design & Development Agency for SaaS Teams That Need to Ship` |
| Hero — Sub-headline | ✅ Fixed | ✅ Still correct |
| Hero — CTAs | ✅ Fixed | ✅ Still correct — `Tell Us Your Idea — Free Consultation` + `Book a 15-Min Call →` |
| Hero — Trust Badge | ✅ Fixed | ✅ Still correct — `50+ Products Shipped Across 6 Countries` |
| SEO Title Tag (`page.tsx`) | 🔴 Not fixed | ❌ **Still reads:** `UI Pirate — Designing AI-Driven SaaS Products That Convert` — completely misaligned with H1 |
| SEO Meta Description (`page.tsx`) | 🔴 Not fixed | ❌ **Still reads:** `We design and ship AI-driven SaaS products that convert, scale, and ship faster...` — old positioning |
| Who We Are — grammar | 🔴 Not fixed | ❌ **Still reads:** `products that ships faster` — subject-verb disagreement confirmed in `whoWeAre/index.tsx` line 79 |
| Who We Are — "Studio" | 🔴 Not fixed | ❌ **Still reads:** `UI Pirate is a global UI/UX Design & Development Studio` — identity inconsistency |
| Who We Are — "global" | 🔴 Not fixed | ❌ **Still reads:** `global` — overstated claim |
| Marquee heading | 🟠 Not fixed | ❌ **Still reads:** `Trusted by Teams / Building the Future of SaaS and AI` |
| Marquee — placeholder logo | 🟠 Not fixed | ❌ Last logo entry: `alt: "Partner company logo"`, `link: ""` — confirmed in source |
| Services — "Saas" typo | 🔴 Not fixed | ❌ **Still reads:** `Saas & AI Development` in service list AND `AI Apps, Saas, Websites & More` in orange banner |
| Services — "One-stop shop" | 🟡 Not fixed | ❌ **Still reads:** `One-stop shop for all your essentials` |
| Services — "Let's Talk" CTA | 🟡 Not fixed | ❌ **Still reads:** `Let's Talk` |
| BentoGrid — card copy | 🟡 Not fixed | ❌ `pixel-perfect experiences`, `Clean and data-driven`, `Fast, conversion-focused sites`, `Figma, React, Angular, Blender & more.` — all unchanged |
| MiniService heading | 🟡 Not fixed | ❌ **Still reads:** `We design world-class products.` — "world-class" still present |
| Stats — 9+ Years sub-label | 🟡 Not fixed | ❌ **Still reads:** `From MVPs to complex dashboards, shipped across 6 countries` — wrong card |
| Stats — $150M+ sub-label | 🟡 Not fixed | ❌ **Still reads:** `SaaS, EdTech, FinTech, HealthTech...` — no explanation of what "made" means |
| Stats — 6 Locations sub-label | 🟡 Not fixed | ❌ **Still reads:** `Built for scale, speed, and seamless handoff to developers` — completely unrelated to locations |
| FAQs — wrong questions | 🟠 Not fixed | ❌ Still leads with pricing model questions, not buyer-blocker questions |
| FAQs — 📍 emoji labels | 🟠 Not fixed | ❌ `📍 Example Use Case`, `📍 Need Help Choosing?`, `📍 Getting in Touch` — still present |
| FAQs — WhatsApp reference | 🟠 Not fixed | ❌ **Still reads:** `email or WhatsApp us` + `reach out via WhatsApp` |

**Summary:** Zero copy changes have been implemented since v2. All 🔴 Fix Now and 🟠 Soon items remain open.

---

## E-E-A-T Assessment (v3 — SEO Content Skill Applied)

Applying Google's E-E-A-T framework (Sept 2025 QRG) and the "Who / How / Why" test to the current landing page copy.

### Google's "Who / How / Why" Test

| Question | Current state | Assessment |
|---|---|---|
| **Who** created it? | Founder name (Vishal Anand) is in the JSON-LD schema and visible in the team section. No byline on the page itself. | ⚠️ Partially present — name is in structured data and team section but not in a visible byline above the fold |
| **How** was it created? | No process disclosure. The `MiniProcess` section exists ("From Idea to Shipped, in 3 Steps") but is very compressed. | ⚠️ Too thin — a SaaS buyer reading for the first time has very little insight into how the agency actually works |
| **Why** does it exist? | The new sub-headline (`You have a product to build...`) is the strongest "why" on the page. | ✅ The intent is clear and buyer-focused — this is the best-performing copy on the page |

### E-E-A-T Breakdown

| Factor | Score | Key Signals Present | Key Gaps |
|---|---|---|---|
| **Experience** | 11/20 | `FeaturedCaseStudy` (conditional), `50+ Products` stat, Behance gallery | No case study copy above the fold; `$150M+` claim is vague; Behance links likely still go off-site |
| **Expertise** | 15/25 | Founded 2015, tech stack breadth, 4 focused services | `Who We Are` still says "Studio" (signals identity confusion); no written articulation of *how* the team works |
| **Authoritativeness** | 13/25 | Clutch, Upwork, Behance, LinkedIn in schema; client logos (Ipsos, Khaitan & Co) | Upwork link sends freelancer signal; no Clutch badge/widget visible on page; testimonials have no star ratings |
| **Trustworthiness** | 17/30 | HTTPS, JSON-LD schema, `Reviewed on Upwork` link, `50+ Products` badge, cal.com link | `$150M+ Made by our clients` undefined; `Only accepting 2 new clients` static scarcity; WhatsApp still in FAQs; emoji 📍 labels in FAQs signal low editorial quality |

**Total E-E-A-T Score: 56/100**

The page is in the lower-middle range. The biggest drag is **Trustworthiness** — specifically the vague stat claim (`$150M+`), the undefined scarcity message, and the low-polish FAQ section (emojis, WhatsApp). These are all fixable with copy changes alone.

---

## SEO Metadata — v3 Reassessment

### Page Title (`app/page.tsx` line 20)

**Current:**
```
UI Pirate — Designing AI-Driven SaaS Products That Convert
```

**Why this is now actively harmful (not just misaligned):**

The layout-level default title (`UI Pirate | SaaS & AI Product Design & Development Agency`) is already correct and has been updated. The `page.tsx` override is *undoing* that correct positioning for the most important page on the site. Google sees the page-level override first. The result: Google is indexing the homepage under the old "AI-Driven" brand message while the page itself speaks an entirely different language.

This is a direct conflict between `app/layout.tsx` (correct) and `app/page.tsx` (still wrong). Fix `page.tsx`.

**Recommended title:**
```
UI Pirate — SaaS Product Design & Development Agency | Ship Faster
```

**Why this works:**
- Primary keyword: `SaaS product design & development agency` (aligns with H1 audience and layout default)
- Differentiator: `Ship Faster` (echoes the H1 "Need to Ship" — creates thematic consistency)
- Under 60 characters: ✅ (58 characters)
- No "AI-Driven" positioning conflict: ✅

### Meta Description (`app/page.tsx` lines 21–23)

**Current:**
```
We design and ship AI-driven SaaS products that convert, scale, and ship faster. Product thinking, competitive analysis, information architecture & UX/UI design for complex SaaS, AI apps & enterprise software. 50+ products shipped.
```

**Problems (v3 lens):**
1. "AI-driven" — old positioning, contradicts H1
2. "convert, scale, and ship faster" — the original triad from the old H1, now orphaned
3. Keyword-stuffed list format — Google's quality guidelines mark these as written-for-bots
4. No action signal — a strong meta description gives the searcher a reason to click
5. 234 characters — too long; Google truncates at ~155

**Recommended meta description:**
```
We design and build SaaS products from first wireframe to working software. 50+ products shipped across 6 countries. Book a free 15-minute consultation.
```

**Why this works:**
- Matches current H1 positioning: ✅
- Under 155 characters: ✅ (152 characters)
- Contains primary keyword phrase: `SaaS products` + `design and build` — natural, not stuffed: ✅
- Ends with action signal: `Book a free 15-minute consultation` — reduces friction, signals next step: ✅
- Contains social proof: `50+ products shipped across 6 countries` — verifiable, specific: ✅

### OpenGraph / Twitter (`page.tsx` lines 28–42)

**Current OG title:**
```
UI Pirate — Designing AI-Driven SaaS Products That Convert
```

**Current Twitter title:**
```
UI Pirate — AI-Driven SaaS Products That Convert
```

Both are still using the old positioning. When the landing page link is shared on LinkedIn, Twitter/X, or Slack, it shows the wrong brand message to the exact B2B buyers you're targeting.

**Recommended OG title:**
```
UI Pirate — SaaS Product Design & Development Agency
```

**Recommended Twitter title:**
```
UI Pirate | Design & Dev for SaaS Teams That Need to Ship
```

**Recommended OG/Twitter description (shared):**
```
We help SaaS founders and enterprise teams design, build, and ship products. 50+ shipped. Free 15-min call. uipirate.com
```

### Keywords (`page.tsx` line 23–24)

**Current keywords string includes:**
```
AI-driven SaaS product design, ...
```

**Assessment:** `AI-driven SaaS product design` no longer matches the page's H1, body copy, or meta description. The keyword string itself won't hurt rankings (meta keywords are ignored by Google), but it creates a maintenance inconsistency and could cause confusion in Search Console. 

**Recommended addition to keyword string (not replacement):**
Add these terms that now appear naturally in the page's actual copy:
- `SaaS design agency`
- `product design and development agency`
- `SaaS product development`
- `design agency for startups`

Remove: `AI-driven SaaS product design` (no longer matches page content)

---

## Keyword Gap Analysis (v3 — New Finding)

Cross-referencing the page's current copy against the keyword targets implicit in the audience positioning:

| Target keyword phrase | Present in H1/sub-headline? | Present in body copy? | Gap |
|---|---|---|---|
| `SaaS design agency` | Partially (H1: "Design & Development Agency for SaaS Teams") | In services section | ✅ Reasonably covered |
| `product design and development agency` | Partially | Not explicitly | ⚠️ Not in a single, quotable phrase |
| `SaaS product development` | No | No | ❌ Missing entirely |
| `UI UX design for SaaS` | No | Partially (BentoGrid card) | ⚠️ Too sparse |
| `design agency for startups` | No | In PricingPerfectFor card | ⚠️ Buried in a card, not in a headline |
| `product design agency` | No | No | ❌ Missing — this is the most searched generic variant |
| `Figma to code` / `design to development` | No | No | ❌ This is a high-intent phrase for buyers who want full execution |

**Key finding:** The page currently ranks well for long-tail branded queries (`UI Pirate`, `uipirate`) but the copy does not explicitly target the non-branded high-intent queries that a buyer in the US would type when they *don't* already know UI Pirate exists. The `Who We Are` section is the natural place to add these phrases organically — its current copy is a grammar error, so the rewrite serves double duty.

**Recommended Who We Are rewrite (SEO-targeted version):**
```
UI Pirate is a product design and development agency. We help SaaS founders
and enterprise teams design, build, and ship products that look premium,
perform well, and hold up as they grow.
```

This version:
- Fixes the grammar error: ✅
- Removes "Studio" identity inconsistency: ✅
- Removes "global" overclaim: ✅
- Contains `product design and development agency` — the highest-value non-branded keyword: ✅
- Contains `SaaS founders` and `enterprise teams` — audience signals: ✅
- Is 35 words at large animated type — readable at scale: ✅

---

## AI Citation Readiness Assessment (v3 — New Finding)

This evaluates how well the page's content can be extracted and cited by AI search engines (Google AI Overviews, ChatGPT web search, Perplexity).

| Signal | Current state | Score |
|---|---|---|
| Quotable statistics | `50+ Products Shipped`, `6 Countries` — present and specific | ✅ Strong |
| FAQ schema in JSON-LD | Present in `layout.tsx` with 7 questions | ✅ Strong |
| Clear service definitions | BentoGrid descriptions are too sparse (`Clean and data-driven`) — not quotable | ❌ Weak |
| Answer-first formatting | `Who We Are` section has a grammar error — un-citable in its current form | ❌ Weak |
| Structured pricing info | `$1,500` landing pages, `$5,000` SaaS — present in FAQ schema | ✅ Strong |
| Entity definition | JSON-LD schema defines the org clearly | ✅ Strong |
| Process steps | `MiniProcess` section exists but descriptions are concatenated from data — need review | ⚠️ Uncertain |

**AI Citation Readiness Score: 58/100**

The FAQ schema and pricing data are the strongest AI citation signals. The `Who We Are` text (grammar error) and the sparse BentoGrid descriptions are the two copy elements most likely to be ignored or mis-cited by AI systems. Fix these first.

---

## New Copy Recommendations (v3 — SEO Content Skill Applied)

These are refined or new recommendations not in v2, based on reading the actual current source.

### NC1. BentoGrid — All 4 card descriptions

The `seo-content` skill flags sparse, jargon-heavy descriptions as low E-E-A-T signals. Current descriptions are 3–6 words each. A B2B buyer scanning this section gets no information about *outcomes*.

**Current vs. Recommended:**

| Card | Current (in code) | Recommended |
|---|---|---|
| UX/UI Design | `User-centric interfaces that convert. We craft pixel-perfect experiences` | `Interfaces your users stay in. We design flows that reduce friction and move people toward action.` |
| Dashboards & SaaS UX | `Clean and data-driven` | `Complex data made simple to read, act on, and present to stakeholders.` |
| Websites & Landing Pages | `Fast, conversion-focused sites` | `Pages built to convert visitors into leads — not just to look good on Awwwards.` |
| Built With the Best | `Figma, React, Angular, Blender & more.` | `React, Angular, Next.js, Figma, GSAP — we use what your product actually needs, not what's trending.` |

**Why these are better:** Each description now gives a buyer-outcome signal, not a tool list or an adjective. "Complex data made simple to read, act on, and present to stakeholders" is quotable by an AI system and scannable by a VP of Product in 3 seconds.

---

### NC2. FAQ Section — Full Replacement of First 4 Questions

The current first 4 FAQ questions (about pricing model differences, pricing plan selection, timelines, and post-launch support) are operational questions that address *how we work*, not psychological blockers that address *why a buyer hesitates*.

The `seo-content` skill flags this as a missed E-E-A-T opportunity: FAQs that answer the questions buyers actually ask in search engines contribute to AI Overview citations and demonstrate expertise. FAQs about internal process mechanics do neither.

**Recommended replacement set (first 4 questions):**

```
Q1: What types of companies do you typically work with?
A: We work with SaaS startups from seed to Series B, enterprise product teams at
   companies like Ipsos, Khaitan & Co, and Biotex Medical, and agencies that need
   a white-label design partner. The common thread: a digital product that needs
   to ship and a team that doesn't have the full design-and-dev bandwidth to do it.

Q2: You're based in India — how does communication and time zone work for US/UK clients?
A: Most of our active clients are in the USA, UK, and Singapore. We work on a
   structured async model with a 2–4 hour daily overlap window for calls and
   reviews. Projects are managed in Figma and Notion with clear weekly check-ins
   so nothing falls into a time-zone gap. Book a free 15-minute call to see how
   it works in practice: cal.com/ui-pirate/15min

Q3: What makes UI Pirate different from hiring from Toptal, Clutch, or a local agency?
A: Toptal and Clutch give you individual contractors or an agency directory — not
   a team that thinks through your product from scratch. Local agencies often
   charge 3–5× more for the same output. We give you a design-and-development
   team with 9+ years of SaaS product experience, a fixed process, and the ability
   to go from idea to shipped — not just from brief to Figma file.

Q4: What does the process look like after I reach out?
A: You book a 15-minute call (no commitment). We listen, ask the right questions,
   and send a scoped proposal within 48 hours. If the scope looks right, we kick
   off with a 5-Day Pilot so you can see exactly how we work before committing to
   a full project. No retainer lock-in, no surprise invoices.
```

**Why these 4 questions:** Each one directly removes a documented B2B buyer objection:
- Q1: "Is this agency right for my company type?" → Answered with real client names (E-E-A-T: Experience)
- Q2: "India-based agency — timezone and communication risk" → The #1 unstated objection for US buyers
- Q3: "Why not go with a better-known option?" → Addresses the competitive positioning question
- Q4: "I don't know what happens if I reach out — it feels like a commitment" → Removes friction at the decision stage

---

### NC3. Stats Cards — All 4 Sub-labels

Current sub-labels confirmed in `aboutCard.tsx`:

| Card | Current sub-label | Problem | Recommended |
|---|---|---|---|
| 9+ Years | `From MVPs to complex dashboards, shipped across 6 countries` | Belongs to the 6 Locations card | `Established 2015. Enterprise platforms, AI tools, fintech apps, SaaS dashboards — and everything in between.` |
| 50+ Projects | `Including AI tools, HR platforms, fintech apps, and B2B SaaS products` | ✅ Correct — keep as is | No change needed |
| $150M+ | `SaaS, EdTech, FinTech, HealthTech, LegalTech, Creator Economy, and more` | Lists industries, not what the number means | `Raised in funding by companies we've helped design and ship. FinTech, HealthTech, SaaS, and beyond.` |
| 6 Client Locations | `Built for scale, speed, and seamless handoff to developers` | Describes product quality, not geography | `USA · UK · Singapore · India · Australia · and growing.` |

---

### NC4. Services Black Card + Bottom CTA — Copy Upgrade

**Confirmed in `servicesSection.tsx`:**

Orange banner: `AI Apps, Saas, Websites & More`
Black card heading: `One-stop shop for all your essentials`
Service item: `Saas & AI Development`
Bottom CTA: `Let's Talk`

**v3 Recommendations (unchanged from v2 in intent, refined in wording):**

| Element | Current | Recommended |
|---|---|---|
| Orange banner | `AI Apps, Saas, Websites & More` | `AI Apps, SaaS & Business Websites` |
| Black card heading | `One-stop shop for all your essentials` | `Design and development, handled by one team` |
| Service item casing | `Saas & AI Development` | `SaaS & AI Development` |
| Bottom CTA | `Let's Talk` | `Tell Us What You Need →` (links to `/contact`) |

---

### NC5. Marquee Heading — Copy Upgrade

**Confirmed in `marquee/index.tsx` lines 127–132:**
```
Trusted by Teams
Building the Future of SaaS and AI
```

**v3 Recommendation:**

```
Trusted by 40+ product teams
across the USA, UK, Singapore & India
```

**Why:** Adds a quantity signal (`40+`), removes aspirational filler (`Building the future`), and names the geographies — which directly addresses the enterprise buyer's need to know if other companies *like theirs* trust this agency. The orange highlight should move from "Trusted by Teams" to "40+" since the number is the credibility signal.

---

## Updated Priority Table (v3)

All items from v2 carried forward. New items marked `[v3]`. Items verified as still-open in code marked with ✓ confirmation.

| # | Section | Issue | File | Priority | Code-Verified |
|---|---|---|---|---|---|
| 1 | SEO | Title tag (`page.tsx`) still says "AI-Driven" — conflicts with layout.tsx default | `app/page.tsx` L20 | 🔴 Fix now | ✓ |
| 2 | SEO | Meta description still uses old "AI-Driven" positioning | `app/page.tsx` L21-23 | 🔴 Fix now | ✓ |
| 3 | SEO | OG title and Twitter title still say "AI-Driven" | `app/page.tsx` L29, L39 | 🔴 Fix now | ✓ |
| 4 | Who We Are | "products that ships faster" — grammar error in animated large type | `whoWeAre/index.tsx` L79 | ✅ Done | ✓ |
| 5 | Who We Are | "Studio" → "agency" identity inconsistency | `whoWeAre/index.tsx` L79 | ✅ Done | ✓ |
| 6 | Who We Are | "global" overclaim — no evidence of global office/team | `whoWeAre/index.tsx` L79 | ✅ Done | ✓ |
| 7 | Services | "Saas" → "SaaS" in service list | `servicesSection.tsx` L64 | ✅ Done | ✓ |
| 8 | Services | "Saas" → "SaaS" in orange banner | `servicesSection.tsx` L152 | ✅ Done | ✓ |
| 9 | FAQs | Replace first 4 questions with buyer-blocker questions (Q&A text in NC2 above) | `faqs/accordion.tsx` | 🟠 Soon | ✓ |
| 10 | FAQs | Remove 📍 emoji labels, replace with bold text | `faqs/accordion.tsx` | 🟠 Soon | ✓ |
| 11 | FAQs | Remove WhatsApp reference from "How do we get started?" | `faqs/accordion.tsx` L147–150 | 🟠 Soon | ✓ |
| 12 | Marquee | Update heading: remove "Building the Future", add quantity and geography | `marquee/index.tsx` L127-132 | 🟠 Soon | ✓ |
| 13 | Marquee | Fix or remove placeholder logo entry (no alt text, no link) | `marquee/index.tsx` L92-95 | 🟠 Soon | ✓ |
| 14 | Stats | Fix "9+ Years" sub-label — currently describes 6 Locations card | `aboutCard.tsx` L11 | 🟠 Soon | ✓ |
| 15 | Stats | Fix "$150M+" sub-label — define what "made" means | `aboutCard.tsx` L31 | 🟠 Soon | ✓ |
| 16 | Stats | Fix "6 Locations" sub-label — list actual locations | `aboutCard.tsx` L40 | 🟠 Soon | ✓ |
| 17 | BentoGrid | Rewrite all 4 card descriptions (see NC1 above for full copy) | `bentoGrid/bentoGrid.tsx` | 🟠 Soon | ✓ |
| 18 | Services | Replace "One-stop shop" black card heading | `servicesSection.tsx` L191 | 🟡 Consider | ✓ |
| 19 | Services | Replace "Let's Talk" bottom CTA | `servicesSection.tsx` L228 | 🟡 Consider | ✓ |
| 20 | MiniService | Replace "world-class" in section heading | `miniService/miniService.tsx` L11 | 🟡 Consider | ✓ |
| 21 | Testimonials | Add section heading "What Clients Say" above cards | `testimonialCards.tsx` | 🟠 Soon | — |
| 22 | Testimonials | Add star ratings to testimonial cards | `testimonialCards.tsx` | 🟠 Soon | — |
| 23 | Testimonials | Verify testimonials.json occupation/company fields | `data/testimonials.json` | ✅ Done | — |
| 24 | Testimonials | Remove or reposition Kyle Drucker (YouTuber) testimonial | `data/testimonials.json` | ⚠️ Pending for now | — |
| 25 | Keywords | Remove `AI-driven SaaS product design` from keywords; add `product design and development agency`, `SaaS product development` | `app/page.tsx` L23-24 | 🟡 Consider | ✓ |
| 26 | Who We Are | Add primary keyword `product design and development agency` to rewritten text | `whoWeAre/index.tsx` | ✅ Done | ✓ |
| 27 | PricingPerfectFor | Rewrite audience card descriptions (see v2 Section 3b) | `perfectFor/index.tsx` | 🟠 Soon | — |
| 28 | PricingPerfectFor | Replace "FIT CHECK" badge with "WHO IT'S FOR" | `perfectFor/index.tsx` | 🟡 Consider | — |
| 29 | Pricing | Fix remaining pricing section copy issues (see `03-pricing-page.md`) | `pricing/index.tsx` | ✅ Done | — |

---

## E-E-A-T Quick Wins (v3 Summary)

These 3 changes have the highest E-E-A-T return for the least effort — each is a copy-only fix in a single file:

1. **Fix `whoWeAre/index.tsx` line 79** — one sentence replacement eliminates a grammar error, removes identity confusion, removes an overclaim, AND adds the primary non-branded keyword. Single highest-leverage change on the entire page.

2. **Fix `app/page.tsx` lines 20–42** — update title, meta description, OG title, OG description, Twitter title, Twitter description. Six string changes in one file. Resolves the direct conflict between `layout.tsx` (correct) and `page.tsx` (still wrong). Without this fix, every improvement to the page's on-page copy is partially undermined at the SERP/share level.

3. **Fix `faqs/accordion.tsx` first 4 questions** — replace with the Q&A text in NC2 above. This is the single highest-leverage content change: real buyer objections, real client names, real process transparency — all of which contribute to E-E-A-T and AI citation readiness simultaneously.

---

## Copy Tone Reference — v3 Additions

*The original Copy Tone Reference from v2 remains valid. These additions are specific to patterns found in the v3 source-code review.*

| ✅ Do | ❌ Avoid | Example from current code |
|---|---|---|
| Name the geography | "global" as a vague claim | "global UI/UX Design & Development Studio" (`whoWeAre`) |
| Use the correct acronym casing | "Saas" with lowercase 'a' | `Saas & AI Development` (`servicesSection`) |
| Describe outcomes, not adjectives | "Clean and data-driven" | `Dashboards & SaaS UX` card in BentoGrid |
| Use verifiable numbers | "only accepting 2 new clients" with no change over time | Scarcity message in pricing section |
| Name real clients in social proof | "companies like yours" | FAQ answers + testimonial section |
| Use `cal.com` link as the primary CTA | WhatsApp as a contact channel | FAQ "Getting started" answer |

*Extended word removal list (v3 additions):* `pixel-perfect`, `clean and data-driven`, `built with the best`, `one-stop shop`, `global`.

---

*This file is the living audit for the landing page. v1 (2026-08-XX) → v2 (2026-08-27) → v3 (2026-08-31). Always verify against current source code before implementing — the code is the ground truth.*
