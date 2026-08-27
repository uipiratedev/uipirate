# Landing Page Content Audit - UI Pirate
**Page:** `/` (Homepage)
**Files in scope:** `app/page.tsx` · `screens/landing/`
**Focus:** Copy, messaging, positioning, and SEO content only
**Research basis:** Apple HIG, Google Material UX Writing, Nielsen Norman Group, Copyhackers JTBD, E-E-A-T guidelines, CRO research, agency differentiation studies, Reddit community feedback
**Last audited:** 2026-08-27 (v2 — post-target-audience restructure)

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

**Current title:** `UI Pirate — Designing AI-Driven SaaS Products That Convert`

**What's wrong:**

| Problem | Why it matters |
|---|---|
| Title still says "Designing AI-Driven SaaS Products" | The H1 was updated to remove "AI-Driven" and shift to "Design & Development Agency" — the title tag and H1 now send conflicting signals to Google |
| "That Convert" — vague outcome | No longer matches the on-page positioning |
| Missing primary keyword | "product design and development agency" or "SaaS design agency" does not appear in the title |

**Suggested fix:**
```
UI Pirate — SaaS Product Design & Development Agency | Ship Faster
```

**Current meta description:**
```
We design and ship AI-driven SaaS products that convert, scale, and ship faster. Product thinking, competitive analysis, information architecture & UX/UI design for complex SaaS, AI apps & enterprise software. 50+ products shipped.
```

**What's wrong:**

| Problem | Why it matters |
|---|---|
| "AI-driven SaaS products" — still the old positioning | Misaligns with the redesigned page messaging |
| Keyword stuffed | Google's quality guidelines flag descriptions written for bots, not people |
| No action signal for the searcher | A strong meta description ends with a CTA or benefit that makes the person click |

**Suggested fix:**
```
We design and build SaaS products that ship — from first wireframe to working software. 50+ products across 6 countries. Book a free 15-minute call.
```

---

### 2. MARQUEE - CLIENT LOGOS
**File:** `screens/landing/marquee/index.tsx`

---

#### 2a. Section Heading

**Current:**
```
Trusted by Teams
Building the Future of SaaS and AI
```

**What's wrong:**

| Problem | Why it matters |
|---|---|
| "Building the future" — still present, still meaningless | Every agency says this. It differentiates nothing |
| No quantity signal | "Trusted by teams" is less credible than "Trusted by 40+ companies" — numbers convert vague claims into verifiable ones |
| "The future of SaaS and AI" reads aspirationally but not concretely | A US VP of Product reads this and still doesn't know if these are real enterprise clients or small startups |

**Suggested rewrite:**
```
Trusted by 40+ companies across the USA, UK, Singapore & India
```

---

#### 2b. Placeholder logo entry — still present

**In `premiumLogos` array, the last entry:**
```js
alt: "Partner company logo"   // ← never updated from placeholder
link: ""                      // ← no URL
```

**Status:** ⚠️ **Still not fixed from v1.** This logo has a generic placeholder alt text and no link. It renders as a broken logo tile with no name and no destination. Fix or remove.

---

#### 2c. Missing company name labels

**Status:** ⚠️ **Still not fixed from v1.** Logos for ArthAlpha, Rings & I, Awesome Health Club, Simpleo AI are not globally recognizable. No company name text appears below any logo. A US-based buyer sees a grid of icons with no context for who these companies are.

**Suggested fix:** Add a small company name text label below each logo tile, even at 10px — it dramatically increases the section's credibility.

---

### 3. PRICING PERFECT FOR — "Is This Right For You?"
**File:** `screens/pricing/perfectFor/index.tsx`

**This section is newly added.** It renders 4 audience cards and a "Not the right fit" strip.

---

#### 3a. Section heading

**Current:** `Is This Right For You?`
**Badge:** `FIT CHECK`

**Assessment:** ✅ The audience-filter concept is exactly right for conversion — it pre-qualifies visitors and reduces misfit leads. "Is This Right For You?" is direct and clear.

**One issue:** "FIT CHECK" as the badge label is informal — it works on a consumer app but may register as slightly casual for enterprise decision-makers. Consider `WHO IT'S FOR` as an alternative that conveys the same function without the social media tone.

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

**Suggested rewrites:**

```
Funded Startups
"You raised a round. Now you need a product that looks as good as the idea you pitched. We help you ship it."

SaaS Companies
"No in-house design team, but a product that needs to keep moving. We plug in as your design and dev partner."

Agencies
"Your team is at capacity. We work as a white-label partner on client projects — no handoff friction, full execution."

Enterprise Teams
"Overflow design capacity without the overhead of hiring. Plug us in when your team needs more bandwidth."
```

---

#### 3c. "Not the right fit" strip

**Current items:**
```
📦 Physical product design
🎨 One-off logo or branding projects
⏰ 24/7 instant turnaround expectations
```

**Assessment:** ✅ The concept is strong — being explicit about who you don't serve is a high-trust signal. However:

- **Emoji icons** in the dark card context look decorative, not functional. For this professional register, replace with a clean × or dash icon
- The items are accurate and well-scoped. No content changes needed beyond the emoji → icon swap

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

**One issue to check:** The descriptions displayed in these cards are a concatenation of two process steps (`group.steps.map((s) => s.description).join(" ")`). Review the actual rendered text to make sure the joined sentences read naturally as one paragraph and don't feel like two separate descriptions stapled together. If they feel abrupt, each group card should have its own bespoke 1-sentence summary.

**Link at bottom:** `See the full process →` → `/process`

**Note:** `/process` is listed in the target audience audit as a recommended new page (Medium priority). Confirm the `/process` page exists and has actual content before this link goes live — a 404 from this section undermines the trust the section is trying to build.

---

### 6. BEHANCE / WORKS GALLERY
**File:** `screens/landing/behance/LandingBehance.tsx`

The target audience audit flagged that portfolio links should point to `/case-studies`, not Behance directly. This section still needs to be checked.

**Action required:** Verify whether the Behance gallery links still go to external Behance links or have been updated to point to `/case-studies/[slug]` pages. If they still go to Behance directly, this is a conversion leak — visitors leave the site and the session is lost.

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

**Status:** ⚠️ **Not fixed from v1.** "Shipped across 6 countries" belongs to the **6 Locations** card, not the **Years of Experience** card.

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

**Status:** ⚠️ **Not fixed from v1.** The core problem remains: "Made by our clients" is undefined. Made how? Revenue? Funding raised? GMV? The sub-label still lists industries instead of explaining what the number means.

**Suggested fix:**
```
Heading: $150M+
Sub-label: Raised in funding by companies we've helped design and ship
```
If this refers to revenue, say so. If funding rounds, say so. Specificity is credibility.

---

#### 9d. Card: 6 Client Locations Worldwide

**Sub-label:** `Built for scale, speed, and seamless handoff to developers`

**Status:** ⚠️ **Not fixed from v1.** This sub-label describes product quality — completely unrelated to geographic reach. The stat is "6 locations" and the copy should name those locations.

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
| 5 | Metadata | Title tag and meta description still reference "AI-Driven" old positioning `[NEW]` | `app/page.tsx` | 🔴 Fix now |
| 6 | Marquee | Section heading still "Trusted by Teams Building the Future" — no quantity `[v1]` | `marquee/index.tsx` | 🟠 Soon |
| 7 | Marquee | Placeholder logo entry (no name, no link) `[v1]` | `marquee/index.tsx` | 🟠 Soon |
| 8 | PerfectFor | Move section to after Services, not before `[NEW]` | `screens/landing/index.tsx` | 🟠 Soon |
| 9 | PerfectFor | Rewrite audience card descriptions (Funded Startups, SaaS Companies grammar) `[NEW]` | `perfectFor/index.tsx` | 🟠 Soon |
| 10 | PerfectFor | Replace emoji icons in "Not the right fit" strip with clean icons `[NEW]` | `perfectFor/index.tsx` | 🟠 Soon |
| 11 | FAQs | Replace first 4 questions with buyer-blocker questions `[v1]` | `faqs/accordion.tsx` | 🟠 Soon |
| 12 | FAQs | Remove WhatsApp from "How do we get started?" answer `[v1]` | `faqs/accordion.tsx` | 🟠 Soon |
| 13 | FAQs | Remove 📍 emoji, replace with bold labels `[v1]` | `faqs/accordion.tsx` | 🟠 Soon |
| 14 | Testimonials | Add section heading "What Clients Say" above cards `[v1]` | `testimonialCards.tsx` | 🟠 Soon |
| 15 | Testimonials | Add star ratings to testimonial cards `[v1]` | `testimonialCards.tsx` | 🟠 Soon |
| 16 | Testimonials | Verify occupation/company fields in testimonials.json `[v1]` | `data/testimonials.json` | 🟠 Soon |
| 17 | MiniProcess | Confirm /process page exists with real content before link goes live `[NEW]` | `miniProcess/index.tsx` | 🟠 Soon |
| 18 | FeaturedCaseStudy | Populate at least 1 CMS case study with metric + valid image `[NEW]` | CMS | 🟠 Soon |
| 19 | Stats | Fix "9+ Years of Experience" sub-label — cross-references wrong card `[v1]` | `about/aboutCard.tsx` | 🟡 Consider |
| 20 | Stats | Clarify "$150M+ Made by clients" — specify what "made" means `[v1]` | `about/aboutCard.tsx` | 🟡 Consider |
| 21 | Stats | Fix "6 Client Locations" sub-label — list the actual locations `[v1]` | `about/aboutCard.tsx` | 🟡 Consider |
| 22 | BentoGrid | Rewrite service card descriptions — remove "pixel-perfect" and sparse labels `[NEW]` | `bentoGrid/bentoGrid.tsx` | 🟡 Consider |
| 23 | Services | Replace "One-stop shop for all your essentials" `[v1]` | `servicesSection.tsx` | 🟡 Consider |
| 24 | Services | Fix "Let's Talk" CTA — replace with "Tell Us What You Need — Free Consultation" `[v1]` | `servicesSection.tsx` | 🟡 Consider |
| 25 | Marquee | Add company name text labels under each logo `[v1]` | `marquee/index.tsx` | 🟡 Consider |
| 26 | Testimonials | Remove/reposition Kyle Drucker (YouTuber) testimonial `[v1]` | `data/testimonials.json` | 🟡 Consider |
| 27 | Testimonials | Request P-S-O expanded testimonials from 3 generic reviewers `[v1]` | `data/testimonials.json` | 🟡 Consider |
| 28 | Pricing | Fix remaining pricing section copy issues (see 03-pricing-page.md) `[v1]` | `pricing/index.tsx` | 🟡 Consider |
| 29 | FeaturedCaseStudy | Add client industry tag and logo to the featured case study card `[NEW]` | `featuredCaseStudy/index.tsx` | 🟡 Consider |
| 30 | PerfectFor | Replace "FIT CHECK" badge with "WHO IT'S FOR" `[NEW]` | `perfectFor/index.tsx` | 🟡 Consider |
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

*Next audit: `/case-studies` page → `audits/05-case-studies-page.md`*
