# Works / Case Studies (List) — Content Audit — UI Pirate

**Page path:** `/case-studies` (reached two ways, same URL: nav label **"Works"** → `/case-studies` [`config/site.ts:45-47`, `:115-117`], and **Resources → Case Studies** → `/case-studies` [`config/site.ts:70-76`, `:127`]. Footer link labeled **"Works"** → `/case-studies` [`components/footer.tsx:198-199`].)

**Files in scope:**
- `app/case-studies/page.tsx` — route, `metadata` export, ISR, CMS fetch
- `screens/caseStudies/index.tsx` — page shell, section order, search, card grid, JSON-LD, "What's next" CTA, pricing CTA
- `screens/caseStudies/hero/index.tsx` — hero badge, H1, subhead, stacked testimonial cards, stats row
- `screens/caseStudies/ClientLogosMarquee.tsx` — "Trusted by teams at" logo strip
- `screens/caseStudies/CaseStudiesFAQ.tsx` — 6-question FAQ (no schema)
- Shared, referenced not re-audited: `screens/landing/testimonials/index.tsx`, `screens/landing/whyChoosUs/index.tsx`, `components/ProjectEstimate.tsx`, `components/GlobalCTA.tsx` (id `global-cta-works`)

**Out of scope (own audit later):** `app/case-studies/[slug]/page.tsx` — the case-study **detail** template, which currently renders through the **blog** detail components (`BlogsDetailsHero`, `BlogContents` — `app/case-studies/[slug]/page.tsx:8-9`). Flagged here, audited separately.

**Focus:** Copy, messaging, positioning, portfolio/case-study conversion structure, internal linking, metadata, structured data, E-E-A-T, AI citation readiness. **No UI/layout/animation/component-structure changes.**

**Research basis:** Apple HIG, Google Material UX Writing, Nielsen Norman Group, Copyhackers / Jobs-to-be-Done, Google E-E-A-T + Helpful Content, plus sources specific to portfolio / case-study pages: NN/g portfolio & case-study research, B2B agency-portfolio conversion playbooks (case-study = problem → approach → measurable result), CRO research on proof pages, and GEO / AI-citation-readiness guidance (`CreativeWork` / `ItemList` / `FAQPage` structured data, named entities, itemized results).

**Last audited:** 2026-08-31
**Note:** New page — first audit. No prior v1/v2. This is a single first-pass audit written to the same shape as the v3 sections in the existing audit files, not a "what changed" delta.

---

## Research Foundation

Every recommendation traces back to one or more of these principles. Nothing below is opinion.

### What the research consistently says

**Apple Human Interface Guidelines — every word earns its place; labels stay consistent.** One page currently calls this entity four different things: nav **"Works"**, `<title>` **"Case Studies & Portfolio"**, hero badge **"PORTFOLIO & CASE STUDIES"**, OG title **"…| UI Pirate"**, JSON-LD `name` **"Case Studies - UI Pirate"**, breadcrumb **"Case Studies & Portfolio"** (`components/Breadcrumbs.tsx:12`). Pick one canonical name.

**Google Material UX Writing — plain language, visitor's vocabulary.** "Product design & development in practice", "product thinking, IA, UX/UI and Angular/React development" is org-chart language. A founder scanning proof wants: *who did you build for, what did it do for them.*

**Nielsen Norman Group — portfolio pages are scanned, not read.** Users decide in seconds whether the work is relevant to *their* problem. That means each card must telegraph **industry + problem + outcome**, and the page must show real projects **above the fold or immediately after** — not a stats row, three rotated decorative testimonial cards, and a logo marquee before the first case study.

**Copyhackers / Jobs-to-be-Done — proof pages answer "will this work for someone like me?"** The visitor's job is de-risking the decision. Organize and label by the buyer's situation (SaaS MVP, enterprise dashboard redesign, AI product), and make the outcomes concrete and attributed.

**B2B case-study conversion playbooks — a case study is Problem → Approach → Measurable Result, with a named client and a real metric.** Vague "50+ shipped products" plus unattributed "$150M+ made by our clients" is weaker than three fully-attributed stories. The list page's job is to make those stories findable and credible, then route to contact.

**Google E-E-A-T / Helpful Content — first-hand experience, accurate claims, verifiable.** Numbers that disagree across the page ("50+ Projects Completed" hero vs. "helped 20+ startups" FAQ vs. "trusted by 50+ SaaS founders" GlobalCTA) and puffery ("Khaitan & Co – APAC's largest law firm") are trust risks. Every claim must be consistent and defensible.

**GEO / AI citation readiness — itemized, attributed, schema-backed content gets cited.** The page has `CollectionPage` + `itemListElement` JSON-LD (good), but the 6-item FAQ has **no `FAQPage` schema**, there is **no `Organization`/aggregateRating** tie-in, `numberOfItems` can render as `0`, and the whole list is **client-rendered from a CMS call** with an empty-state that says "No case studies published yet". If the CMS returns nothing, the page's primary content is a "check back soon" message — invisible to crawlers and AI engines.

### How this audit applies the foundation

| Principle | Where it drives a finding |
|---|---|
| Apple HIG — consistent labels | Entity name drift: Works / Case Studies & Portfolio / Portfolio & Case Studies / Case Studies - UI Pirate (§Metadata, NC1) |
| Material — visitor's vocabulary | "Product design & development in practice", "product thinking, IA, UX/UI and Angular/React development" (§2, NC3) |
| NN/g — proof scanned, relevance-first | Real case studies are the 3rd block; hero leads with stats + decorative testimonial cards (§1, §Structure) |
| Copyhackers / JTBD | No filtering by buyer situation; outcomes vague/unattributed (§2, §3) |
| Case-study conversion playbooks | "$150M+ made by our clients" unattributed; card "primary metric" falls back to industry string (§1c, §3) |
| E-E-A-T / accurate claims | 50+ vs 20+ vs 50+ number conflict; "APAC's largest law firm" (§1d, §5, P-table) |
| GEO / AI citation | No `FAQPage` schema (§6), `numberOfItems` can be 0 (§3), empty-state is the fallback content (§3), no Twitter card (§Metadata) |

---

## What This Page Is For

`/case-studies` is the **proof page** of the funnel. Its job: take a visitor who is interested but not convinced (from the homepage, a service page, an ad, or organic search for "SaaS design agency portfolio") and remove the risk by showing **real, relevant, measurable work**, then hand them to the contact / estimate flow.

It should be judged on three questions:
1. **Relevance** — within seconds, can a SaaS founder / enterprise product lead see work that looks like their problem?
2. **Credibility** — are the clients named, the outcomes specific, and the numbers internally consistent?
3. **Routing** — does a convinced visitor get a single, low-friction next step (the canonical `Book a Free 15-Min Call` → `https://cal.com/ui-pirate/15min`)?

Currently it under-delivers on all three: the proof is buried below a stats-and-decoration hero, card outcomes frequently fall back to a bare industry label, the headline numbers contradict each other, and the two CTAs point to `/contact` and `/pricing` rather than the canonical call link.

---

## Current Page Structure (from source)

| # | Section | Source | Notes |
|---|---|---|---|
| 1 | **Hero** | `hero/index.tsx` | Badge "PORTFOLIO & CASE STUDIES"; H1 "Real Projects. Real Results."; subhead; 3 rotated decorative testimonial cards (desktop only, review text shown as `"...{review}..."`); stats row: `9+ Years of Experience`, `50+ Projects Completed`, `$150M+ Made by our clients`, `6+ Countries Served` |
| 2 | **Client logos marquee** | `ClientLogosMarquee.tsx` | "Trusted by teams at" + 9 logos (Ipsos, Bioptex Medical, Khaitan & Co, RevUp AI, SimpleO AI, ArthAlpha, Sarge, Awesome Health Club, Rings & I) |
| 3 | **Case studies grid** | `index.tsx:160-403` | Badge "case studies"; H2 "Product design & development in practice"; intro para; search box; results count; 2-col card grid from CMS (`postType: "case-study"`, `limit: 50`); empty-state copy |
| 4 | **"What's next" CTA** | `index.tsx:405-434` | Eyebrow "What's next"; H2 "Let's Build Something Like This For You"; para ending "Typical response under 2 hours."; buttons **"Start Your Project →"** → `/contact`, **"View Pricing"** → `/pricing` |
| 5 | **Client testimonials** | `screens/landing/testimonials` | Shared landing block — badge "testimonials", H2 "Loved by SaaS Founders & Product Teams" |
| 6 | **Why Choose Us** | `screens/landing/whyChoosUs` | Shared landing block — badge "WHY CHOOSE US", H2 "Why SaaS & AI Teams Choose UI Pirate?" (stray `\` rendered before it — `index.tsx:443`) |
| 7 | **FAQ** | `CaseStudiesFAQ.tsx` | Badge "FAQ", H2 "Common Questions", 6 Q&A, **no FAQPage JSON-LD** |
| 8 | **Pricing CTA** | `index.tsx:451-463` | Badge "pricing", H2 "Pricing That Makes Sense", embedded `<ProjectEstimate>` |

**Order problem:** the actual case studies are block **3 of 8**. Blocks 1–2 are 100% "us" framing (stats + logos + decoration). NN/g portfolio research says relevant work should come first.

---

## Section-by-Section Audit

### 1. Hero — `screens/caseStudies/hero/index.tsx`

#### 1a. Badge
- **Current (verified, `hero/index.tsx:107-109`):** `PORTFOLIO & CASE STUDIES`
- **Wrong:** Third distinct name for this page (nav says "Works", `<title>` says "Case Studies & Portfolio"). Word order flipped vs. the title.
- **Why it matters:** Apple HIG label consistency; entity-name drift weakens the page as a named entity for AI engines and confuses returning users.
- **Rewrite:** `CASE STUDIES` (and align every other surface to that — see NC1).

#### 1b. H1
- **Current (verified, `hero/index.tsx:113-116`):** `Real Projects. Real Results.`
- **Wrong:** Generic agency filler; contains no keyword and no specificity. "Real Results." is undercut immediately because most card metrics on this page are not results (see §3).
- **Why it matters:** The H1 is the single strongest on-page relevance and SEO signal. NN/g: it should tell the scanner what they'll find.
- **Rewrite:** `SaaS & enterprise products we designed and shipped` or `Case studies: real products, measurable outcomes` (keep only if the card metrics are made real).

#### 1c. Subhead
- **Current (verified, `hero/index.tsx:119-122`):** `See how we've helped startups, SaaS teams, and global brands turn ideas into fully functional digital products.`
- **Wrong:** Fine in tone but redundant with the H1 and the block-3 intro, which says almost the same thing a third time.
- **Rewrite:** Make it do work the H1 can't — name the range: `Deep dives into SaaS platforms, enterprise dashboards, AI apps and fintech tools — the problem, what we did, and what changed for the client.`

#### 1d. Stats row
- **Current (verified, `hero/index.tsx:211-217`):** `9+ Years of Experience` · `50+ Projects Completed` · `$150M+ Made by our clients` · `6+ Countries Served`
- **Wrong:**
  - `$150M+ Made by our clients` — unattributed, unverifiable, and the strongest claim on the page carries the least evidence. E-E-A-T risk.
  - `50+ Projects Completed` contradicts `CaseStudiesFAQ.tsx:21` ("helped 20+ startups") and `components/GlobalCTA.tsx:35-37` ("trusted by 50+ SaaS founders and enterprise teams"). Three different framings of the count on surfaces that appear on or near this page.
  - `6+ Countries Served` vs. the meta description's "globally" / About page phrasing — verify one canonical figure.
- **Why it matters:** Contradictory numbers are a classic Google quality-rater trust flag and erode buyer confidence.
- **Rewrite:** Lock a single fact set (see NC5). If `$150M+` can be sourced, add a one-line basis ("combined funding raised / revenue reported by clients post-launch"); if not, cut it.

#### 1e. Decorative testimonial cards
- **Current (verified, `hero/index.tsx:198-200`):** renders `"...{item.review}..."` — leading and trailing ellipses hard-coded around a `line-clamp-3` snippet.
- **Wrong:** `"...fragment..."` reads as a mangled pull-quote. Rotated ±10–18° cards with clipped text add visual noise before the visitor has seen a single case study, and duplicate block 5 (full testimonials section).
- **Why it matters:** NN/g — decoration that delays the primary content (the work) costs relevance assessment time.
- **Copy fix (no layout change):** drop the wrapping `"..." ` so each card shows a clean clamped quote with a proper closing quotation mark, or pull a curated one-sentence line per card instead of a mid-sentence clamp.

---

### 2. Case studies grid — heading & intro (`screens/caseStudies/index.tsx:160-172`)

- **Current H2 (verified, `:165-167`):** `Product design & development in practice`
- **Current intro (verified, `:168-171`):** `Deep dives into how we turn ideas into shipped products — from product thinking and IA to UX/UI and Angular/React development.`
- **Wrong:**
  - "in practice" is vague; "product thinking and IA to UX/UI and Angular/React development" is a process list, not a reason to read.
  - This is the **third** near-identical restatement of "we turn ideas into products" (H1, hero subhead, here).
  - **Angular** is foregrounded here and in the meta keywords ("Angular development projects") — an unusual lead for a design-forward agency; confirm this is deliberate positioning and not stale copy. If React is the primary stack, lead with it.
- **Why it matters:** Material — write the visitor's reason to scroll, not the service breakdown. Copyhackers — the intro should frame the proof around the buyer's situation.
- **Rewrite (H2):** `Case studies` (the badge above it already says "case studies" — dedupe; make the H2 the useful line). **Intro:** `Each one covers the problem the client had, what we designed and built, and the measurable change after launch. Filter by industry or stack below.`

#### 2a. Search box
- **Current placeholder (verified, `:179`):** `Search by client, industry, or technology...`
- **Verdict:** Good pattern. Minor: with a small catalog, add **filter chips** (SaaS / Enterprise / AI / Fintech / Design system) alongside search — matches how buyers self-qualify (JTBD). Copy-only add, defer if it touches layout.

#### 2b. Results count / empty state
- **Current (verified, `:266-275`):** `No case studies published yet` / `Check back soon` (no search) — `No matching projects found` / `Try adjusting your search term` (with search).
- **Wrong:** "No case studies published yet / Check back soon" is the **fallback content of the whole page** if the CMS call returns empty. A proof page that can render with zero proof and an apologetic message is a real risk for both users and crawlers.
- **Why it matters:** GEO / crawlability — primary content must not be conditional on a client-side CMS fetch resolving with data. E-E-A-T — "check back soon" on a flagship page reads as abandoned.
- **Recommendation:** (a) ensure at least 3–6 evergreen case studies always render (server-rendered fallback), (b) if truly empty, swap copy to route forward: `Case studies are being migrated. See selected work on the homepage or book a call to discuss projects like yours.` + the canonical call link.

---

### 3. Case study cards (`screens/caseStudies/index.tsx:289-400`)

- **"Primary metric" chip (verified, `:290-291`):** `const primaryMetric = study.metrics?.[0]?.value || study.industry;`
- **Wrong:** When a CMS case study has no `metrics`, the orange chip that visually reads as *the result* silently shows the **industry string** instead. So a card can display "Fintech" styled identically to where another card shows "+38% activation" — the page's core credibility element is unreliable.
- **Card sub-line (verified, `:355-357`):** `{study.title.split(" — ")[1] || study.title}` — depends on every CMS title using a ` — ` separator; titles without it render the full title twice (as `client` H3 and again here).
- **Excerpt (verified, `:358-360`):** `line-clamp-2` on `study.excerpt` — fine, but excerpts are CMS-authored; there's no guaranteed problem/outcome framing.
- **"New" badge (verified, `:38-42, :325-331`):** 30-day window on `publishedAt` — fine.
- **CTA (verified, `:386-389`):** `Read case study` / mobile `Read` — good, consistent.
- **Why it matters:** Case-study conversion research: the card must reliably communicate **industry + outcome**. A fallback that shows a category where a metric belongs breaks that contract.
- **Recommendations (copy/content + light logic, for the implementation pass):**
  - Only render the orange chip when a real `metrics[0].value` exists; otherwise show a neutral "Case study" label or the region, never the industry masquerading as a metric.
  - Standardize CMS case-study titles on `Client — Outcome-oriented project name` so `:356` always resolves.
  - Give every published case study at least one `metrics` entry and an excerpt that names the problem.

#### 3a. JSON-LD (`index.tsx:113-140`)
- **Current:** `CollectionPage` with `itemListElement` of `CreativeWork` — good type choice.
- **Issues:**
  - `numberOfItems: caseStudies.length` — renders `0` when the CMS is empty; emit the block only when `length > 0`, or hard-floor to the evergreen set.
  - `name: "Case Studies - UI Pirate"` (`:116`) — fourth spelling of the entity name. Align to canonical (NC1).
  - `description` (`:117-118`) hard-codes "SaaS, AI, mobile apps, and enterprise projects" — keep in sync with the on-page copy.
  - No `provider` `sameAs`, no link to the `Organization` entity used elsewhere, no `aggregateRating` despite testimonials existing on the same page.
- **Recommendation:** add `publisher`/`provider` `@id` referencing the site's `Organization`, and consider an `ItemList` of `Article`/`CreativeWork` with `about` + `keywords` per item (already partly done) plus each item's real metric in `description`.

---

### 4. "What's next" CTA (`screens/caseStudies/index.tsx:405-434`)

- **Current (verified):** eyebrow `What's next` (`:409`); H2 `Let's Build Something Like This For You` (`:411-413`); para `From idea to shipped product — product thinking, IA, UX/UI, and Angular/React frontend carried end-to-end. Typical response under 2 hours.` (`:414-418`); buttons `Start Your Project →` → `/contact` (`:420-425`), `View Pricing` → `/pricing` (`:426-431`).
- **Wrong:**
  - Neither CTA is the canonical contact action. Per project constraint, the preferred CTA everywhere is **`Book a Free 15-Min Call`** → `https://cal.com/ui-pirate/15min`.
  - "product thinking, IA, UX/UI, and Angular/React frontend carried end-to-end" — fourth restatement of the process list on one page.
  - "Typical response under 2 hours" — unverified SLA; also appears/varies elsewhere. Keep only if it's a real, monitored commitment.
  - "Let's Build Something Like This For You" only makes sense directly under a strong case study; here it sits after the grid, testimonials-adjacent — fine, but the copy assumes the visitor just read one.
- **Rewrite:** Eyebrow `Your project` · H2 `Want results like these for your product?` · Para `Tell us what you're building. We'll walk you through how we'd approach it and what it would take.` · Primary button **`Book a Free 15-Min Call →`** → `https://cal.com/ui-pirate/15min` · Secondary `See pricing` → `/pricing`.

---

### 5. Client logos marquee (`screens/caseStudies/ClientLogosMarquee.tsx`)

- **Current heading (verified, `:54`):** `Trusted by teams at`
- **Alt-text claims (verified, `:5-42`):**
  - `Khaitan & Co - APAC's largest law firm` (`:16`) — **overstated**. Khaitan & Co is one of India's largest / oldest law firms, not "APAC's largest". This is exactly the kind of unverifiable superlative E-E-A-T raters flag.
  - `Ipsos - Global market research firm` (`:8`) — OK.
  - `SimpleO AI - Legal management platform` (`:24`) and `Sarge - AI business solutions` (`:32`) / `RevUp AI - AI-powered business solutions` (`:20`) — generic; fine as alt text.
- **Wrong:**
  - "Trusted by teams at" implies a live client relationship for all 9 logos — make sure that's true for each (E-E-A-T: accurate association).
  - No link from any logo to its case study, so the strongest brand names on the page are a dead end for a scanner who recognizes one.
- **Why it matters:** Logo strips convert only when they're accurate and, ideally, navigable to proof.
- **Recommendations:**
  - `:16` → `Khaitan & Co - one of India's largest law firms` (or drop the descriptor).
  - Where a case study exists for a logo, make the logo link to `/case-studies/{slug}` (implementation pass).
  - Keep "Trusted by teams at" only if every logo is a real client; otherwise `Selected clients`.

---

### 6. FAQ (`screens/caseStudies/CaseStudiesFAQ.tsx`)

- **Current:** badge `FAQ`, H2 `Common Questions`, subhead `Everything you need to know about working with us`, 6 Q&A (`:13-44`). **No `FAQPage` JSON-LD anywhere in the component or the page.**
- **Content issues (verified quotes):**
  - `:21` — `"We've helped 20+ startups validate and ship their MVPs."` conflicts with hero's `50+ Projects Completed` and GlobalCTA's `50+ SaaS founders`. Pick one number and one framing.
  - `:17` — timeline says `Development (3-6 weeks)` and total `4-12 weeks`; the "What's next" copy and pricing page should agree — cross-check against `03-pricing-page.md`.
  - `:22`, `:32` — `"Many of our case studies showcase products we've built from scratch."` / `"Many of our case studies involve enhancing existing platforms."` — both say "many of our case studies" without linking to any. Add inline links to representative case studies.
  - `:42` — `"SaaS, AI/ML platforms, FinTech, HealthTech, LegalTech, and Enterprise software"` vs. JSON-LD's "SaaS, AI, mobile apps, and enterprise" (`index.tsx:118`) vs. meta's "SaaS platforms, enterprise dashboards, AI apps, fintech, and design systems" (`page.tsx:13`). Three different industry lists. Standardize.
  - Questions are agency-generic ("How long does a typical project take?"). For a **case-studies** page, at least half the FAQ should be proof-specific: *"Can I see work in my industry?"*, *"Are these results verified?"*, *"Can I talk to a past client?"*, *"Do you have enterprise / NDA work you can't show?"*
- **Why it matters:** GEO — a `FAQPage` block is one of the highest-yield AI-citation and rich-result signals and it's completely absent here. E-E-A-T — proof-page FAQs should address skepticism about the proof itself.
- **Recommendations:**
  - Add `FAQPage` JSON-LD generated from the `faqs` array (mirror the pattern used on the tools/services pages).
  - Reconcile the 20+/50+ numbers and the industry list to the canonical set (NC5).
  - Replace 2–3 generic questions with proof-specific ones; link answers to real case studies.
  - Subhead → `Questions about our work and how we engage.`

---

### 7. Shared blocks (referenced, not re-audited)

- **Testimonials (`screens/landing/testimonials`)** — H2 "Loved by SaaS Founders & Product Teams". Covered in `01-landing-page.md`. On this page it partially duplicates the hero's decorative testimonial cards (§1e) — consider whether both are needed.
- **Why Choose Us (`screens/landing/whyChoosUs`)** — H2 "Why SaaS & AI Teams Choose UI Pirate?". Covered in `01-landing-page.md`. **Bug to flag (not copy):** `screens/caseStudies/index.tsx:443` renders a stray `\` immediately before `<WhyChooseUs />`, which prints a literal backslash on the page.
- **Pricing CTA + `ProjectEstimate`** — H2 "Pricing That Makes Sense". `ProjectEstimate` copy is covered in `03-pricing-page.md`. On a proof page, an embedded multi-step estimate form as the final block is heavy; a link to `/pricing` may suffice. Positioning note only.

---

## E-E-A-T Assessment

**Google's "Who / How / Why" test:**
- **Who** — Weak. No author/entity byline on the page; the entity is named four different ways; OG `siteName` "UI Pirate by Vishal Anand" is the only person-signal and it's inconsistent with other pages.
- **How** — Partial. The grid *structure* implies process (problem → work → result) but card metrics fall back to industry labels, so "how we got the result" is often not shown. FAQ describes process generically.
- **Why** — Clear enough: showcase work to win projects. No deceptive intent, but the unverified `$150M+` and "APAC's largest law firm" push toward puffery.

**Scored breakdown:**

| Dimension | Score | Notes |
|---|---|---|
| **Experience** /20 | **12** | Real named clients, real logos, "50+ projects", 9+ years — genuine first-hand signal. Lost points: outcomes not consistently shown per project; hero testimonial snippets are mangled (`"...x..."`). |
| **Expertise** /25 | **16** | Industry specialization stated (SaaS/AI/fintech/enterprise); process described. Lost points: three conflicting industry lists; process copy repeated 4×; no named practitioners on the page. |
| **Authoritativeness** /25 | **13** | Strong logos (Ipsos, Khaitan & Co, Bioptex). Lost points: no case-study links from logos; no client names on cards until you click; no press/awards/external validation; entity-name drift dilutes the brand as a citable entity. |
| **Trustworthiness** /30 | **15** | Honest tone, real testimonials block. Lost points: 20+ vs 50+ vs 50+ number conflict; unattributed "$150M+ made by our clients"; "APAC's largest law firm" overstatement; page can render with zero case studies + "check back soon"; no FAQ addressing "are these results verified / can I reference-check". |
| **Total** | **56 / 100** | Solid raw material, undermined by inconsistent claims, buried proof, and missing verification signals. |

---

## SEO Metadata Assessment (`app/case-studies/page.tsx`)

| Element | Current value (verified) | file:line | Verdict | Recommended |
|---|---|---|---|---|
| `<title>` | `Case Studies & Portfolio \| 50+ Shipped Products` | `page.tsx:11` | 🟡 OK length (~47 chars); "Portfolio" + "Shipped Products" slightly redundant; no brand token | `Case Studies: SaaS & Enterprise Product Design \| UI Pirate` |
| `meta description` | `Explore 50+ shipped products and deep-dive case studies — SaaS platforms, enterprise dashboards, AI apps, fintech, and design systems.` | `page.tsx:12-13` | 🟢 Good — specific, ~145 chars. Keep the industry list here as the **canonical** one and sync §6/§3a to it | Minor: lead with the outcome — `See how we design and ship SaaS platforms, enterprise dashboards, AI apps and fintech tools — deep-dive case studies with the problem, the work, and the result.` |
| `keywords` | `UI/UX case studies, product design portfolio, SaaS design case study, ..., Angular development projects, ...` | `page.tsx:14-15` | 🟡 Ignored by Google; "Angular development projects" over-weights Angular (see §2). Harmless but review | Trim to the phrases actually reflected in copy; drop Angular unless it's deliberate positioning |
| `canonical` | `https://uipirate.com/case-studies` | `page.tsx:33-35` | 🟢 Correct. "Works" is only a nav label pointing to this same URL — **no duplicate-content issue**, no separate `/works` route exists (`find app` confirms). No action. | — |
| OG `title` | `Case Studies & Portfolio \| 50+ Shipped Products \| UI Pirate` | `page.tsx:17` | 🟡 Fifth variant of the name; double `|` stacking | Match `<title>` + ` | UI Pirate` once |
| OG `description` | `From SaaS platforms to fintech dashboards — 50+ products we designed and developed for enterprise clients globally, with detailed case studies on product thinking, IA, UX/UI and Angular/React development.` | `page.tsx:18-19` | 🟡 Long (~210 chars, truncates); process-list tail; Angular again | Shorten to ~160, cut the process list: `50+ SaaS, fintech and enterprise products we designed and shipped — with deep-dive case studies on the problem, the work, and the measurable result.` |
| OG `url` / `type` / `locale` | `.../case-studies` / `website` / `en_US` | `page.tsx:20,30,31` | 🟢 Fine | — |
| OG `siteName` | `UI Pirate by Vishal Anand` | `page.tsx:21` | 🟡 Inconsistent with other pages' siteName; check `01`/`03`/`04` audits for the canonical form | Use one canonical `siteName` site-wide (likely `UI Pirate`) |
| OG `image` | `https://res.cloudinary.com/dvk9ttiym/image/upload/v1779397879/Screenshot_2026-05-22_023842_sebbvi.png` (1200×630, alt "UI Pirate — Case Studies & Portfolio") | `page.tsx:22-28` | 🟠 Raw screenshot filename; not a designed social card | Commission a branded OG card: "Case Studies — 50+ SaaS & enterprise products shipped" + 3–4 client logos |
| Twitter card | **absent** | — | 🟠 No `twitter` block — X/Twitter and some AI previewers fall back to a poor default | Add `twitter: { card: "summary_large_image", title, description, images }` |
| JSON-LD | `CollectionPage` + `itemListElement` (`CreativeWork[]`) | `screens/caseStudies/index.tsx:113-140` | 🟡 Good type; `numberOfItems` can be 0; `name` = 4th entity spelling; no `Organization` tie-in; **no `FAQPage`** despite §6 | Guard on `length>0`; align `name`; add `FAQPage` from `CaseStudiesFAQ` array; add `provider @id` → site `Organization` |
| Robots / index | ISR `revalidate = 60`, indexable | `page.tsx:8` | 🟢 Fine | Ensure evergreen server-rendered case studies so an empty CMS response never yields a thin page |

---

## Keyword Gap Analysis

| Target phrase (buyer intent) | In current copy? | Where / gap |
|---|---|---|
| "SaaS design agency portfolio" / "case studies" | Partial | Title + meta yes; H1 ("Real Projects. Real Results.") no |
| "enterprise dashboard redesign case study" | No | Not in any heading or card-level copy; only implied |
| "AI product design case study" | Weak | Meta only; grid H2/intro don't mention AI |
| "fintech UX design case study" | Weak | Meta + one logo; no heading, no filter |
| "design system case study" | No | In meta description; nowhere on the page body |
| "[Client] case study" (Ipsos, Khaitan & Co, etc.) | No | Client names not in headings/links; locked inside CMS cards |
| "MVP design agency" / "startup product design" | Partial | Hero subhead + FAQ ("20+ startups"); no dedicated section |
| "product design and development agency" | Yes | H2, "What's next", OG — arguably overused (4×) |

**Takeaway:** the page ranks its keywords into the metadata but not into the visible, crawlable body (H1, H2, section labels, links). Add industry-specific sub-headings or filter labels and link client names.

---

## AI Citation Readiness Score

| Signal | State | Points |
|---|---|---|
| Server-rendered primary content | 🟠 Grid is client-rendered from a CMS fetch; empty-state fallback is "no case studies published yet" | 4 / 15 |
| `CollectionPage` / `ItemList` schema | 🟢 Present with per-item `CreativeWork`, `about`, `keywords` | 12 / 15 |
| `FAQPage` schema | 🔴 Absent (6 Q&A on page, unmarked) | 0 / 15 |
| Itemized, attributed outcomes | 🟠 Metrics exist per-card *when authored*; fall back to industry label; not in body text | 5 / 15 |
| Named entities (clients, industries) | 🟠 Clients in logos + CMS cards, not in headings/links; industries listed 3 inconsistent ways | 6 / 15 |
| Consistent entity name / brand | 🔴 5 spellings (Works / Case Studies & Portfolio / Portfolio & Case Studies / Case Studies - UI Pirate / …) | 3 / 10 |
| Claim accuracy / verifiability | 🟠 "$150M+" unattributed; "APAC's largest law firm"; 20+ vs 50+ conflict | 4 / 10 |
| Metadata completeness (title/desc/OG/Twitter) | 🟠 Strong title+desc; no Twitter card; screenshot OG | 5 / 10 |
| **Total** | | **43 / 100** |

**Biggest wins:** add `FAQPage` schema (+15), guarantee server-rendered evergreen case studies (+8), unify the entity name (+5), fix the number conflicts (+4).

---

## New Copy Recommendations

> Format: exact current copy → exact recommended copy, with file:line. Copy/content only. No layout or component-structure change implied unless noted.

### NC1 — Unify the entity name (one canonical name + slug)
Canonical: **"Case Studies"** (page), slug stays `/case-studies`, nav label may remain **"Works"** *only if* treated as a synonym link — but every content surface below uses "Case Studies":

| Surface | Current | file:line | → Recommended |
|---|---|---|---|
| Hero badge | `PORTFOLIO & CASE STUDIES` | `screens/caseStudies/hero/index.tsx:108` | `CASE STUDIES` |
| `<title>` | `Case Studies & Portfolio \| 50+ Shipped Products` | `app/case-studies/page.tsx:11` | `Case Studies: SaaS & Enterprise Product Design \| UI Pirate` |
| OG title | `Case Studies & Portfolio \| 50+ Shipped Products \| UI Pirate` | `app/case-studies/page.tsx:17` | `Case Studies: SaaS & Enterprise Product Design \| UI Pirate` |
| JSON-LD `name` | `Case Studies - UI Pirate` | `screens/caseStudies/index.tsx:116` | `Case Studies` |
| OG `siteName` | `UI Pirate by Vishal Anand` | `app/case-studies/page.tsx:21` | `UI Pirate` (match site-wide canonical) |
| Grid H2 | `Product design & development in practice` | `screens/caseStudies/index.tsx:166` | `Case studies` |

### NC2 — Hero H1
- **Current (`screens/caseStudies/hero/index.tsx:113-116`):** `Real <span>Projects.</span> Real <span>Results.</span>`
- **Recommended:** `SaaS & enterprise products we designed <span>and shipped</span>`
- *(If "Results" is kept, every card must show a real metric — see NC4.)*

### NC3 — Hero subhead
- **Current (`screens/caseStudies/hero/index.tsx:119-122`):** `See how we've helped startups, SaaS teams, and global brands turn ideas into fully functional digital products.`
- **Recommended:** `Deep dives into SaaS platforms, enterprise dashboards, AI apps and fintech tools — the problem the client had, what we designed and built, and what changed after launch.`

### NC4 — Grid intro + card metric fallback
- **Current intro (`screens/caseStudies/index.tsx:168-171`):** `Deep dives into how we turn ideas into shipped products — from product thinking and IA to UX/UI and Angular/React development.`
- **Recommended intro:** `Every case study covers the problem, the work, and the measurable result. Search by client, industry or stack.`
- **Current logic (`screens/caseStudies/index.tsx:290-291`):** `const primaryMetric = study.metrics?.[0]?.value || study.industry;`
- **Recommended (implementation pass):** render the orange result chip **only** when `study.metrics?.[0]?.value` exists; when absent, show region or a neutral `Case study` label — never the industry string in the result slot.

### NC5 — Reconcile headline numbers (pick one canonical set)
Decide the true figures once, then apply everywhere:

| Claim | Locations to sync | Suggested canonical |
|---|---|---|
| Projects / products shipped | hero `50+ Projects Completed` (`hero/index.tsx:214`); FAQ `helped 20+ startups` (`CaseStudiesFAQ.tsx:21`); GlobalCTA `50+ SaaS founders and enterprise teams` (`components/GlobalCTA.tsx:35-37`); title/meta `50+` | `50+ products shipped` — and change FAQ line to `We've shipped 50+ products, including 20+ startup MVPs` |
| Client economic impact | hero `$150M+ Made by our clients` (`hero/index.tsx:215`) | Add a sourced basis or remove: `$150M+ raised by clients post-launch` *(only if verifiable)* |
| Countries | hero `6+ Countries Served` (`hero/index.tsx:216`) | Confirm vs. About page; state one number |
| Industries served | `CaseStudiesFAQ.tsx:42`; `index.tsx:118`; `page.tsx:13` | Use the meta list as canonical: `SaaS platforms, enterprise dashboards, AI apps, fintech, and design systems` |

### NC6 — "What's next" CTA → canonical call
- **Current (`screens/caseStudies/index.tsx:411-431`):**
  - H2 `Let's Build Something Like This For You`
  - Para `From idea to shipped product — product thinking, IA, UX/UI, and Angular/React frontend carried end-to-end. Typical response under 2 hours.`
  - Button `Start Your Project →` → `/contact`; Button `View Pricing` → `/pricing`
- **Recommended:**
  - H2 `Want results like these for your product?`
  - Para `Tell us what you're building. We'll walk through how we'd approach it and what it would take — no pitch.`
  - Primary button `Book a Free 15-Min Call →` → `https://cal.com/ui-pirate/15min`
  - Secondary button `See pricing` → `/pricing`
- *(Drop "Typical response under 2 hours" unless it's a real, tracked SLA used consistently site-wide.)*

### NC7 — Client logo alt-text accuracy
- **Current (`screens/caseStudies/ClientLogosMarquee.tsx:16`):** `alt: "Khaitan & Co - APAC's largest law firm"`
- **Recommended:** `alt: "Khaitan & Co - one of India's largest law firms"`
- **Current heading (`:54`):** `Trusted by teams at` → keep only if all 9 are active clients; otherwise `Selected clients`.

### NC8 — FAQ: add schema + proof-specific questions + links
- Add `FAQPage` JSON-LD built from the `faqs` array in `screens/caseStudies/CaseStudiesFAQ.tsx:13-44` (mirror the services/tools page pattern).
- **Current subhead (`:70`):** `Everything you need to know about working with us` → `Questions about our work and how we engage.`
- Replace 2–3 generic entries with:
  - `Can I see work in my industry?` → *"Yes — filter the case studies above by SaaS, fintech, AI, enterprise or design systems, or ask us and we'll send the two or three closest to your situation."*
  - `Are the results in these case studies verified?` → *"The metrics come from the client or from analytics we had access to during the engagement. For several clients we can arrange a direct reference call."*
  - `Do you have work you can't show publicly?` → *"Yes. Some enterprise and fintech work is under NDA. We can walk through it on a call."*
- **Current (`:21`):** `We've helped 20+ startups validate and ship their MVPs.` → `We've shipped 50+ products, including 20+ startup MVPs built from scratch.`

### NC9 — Empty-state copy (route forward, don't apologize)
- **Current (`screens/caseStudies/index.tsx:269`, `:274`):** `No case studies published yet` / `Check back soon`
- **Recommended:** `Case studies are being added.` / `See selected work on the homepage, or book a call to discuss projects like yours.` + link `Book a Free 15-Min Call` → `https://cal.com/ui-pirate/15min`
- *(Primary fix is server-rendering an evergreen set so this state is unreachable in normal operation — see §2b / §3a.)*

### NC10 — Hero testimonial snippet punctuation
- **Current (`screens/caseStudies/hero/index.tsx:198-200`):** `&quot;...{item.review}...&quot;` renders `"...fragment..."`
- **Recommended:** `&quot;{item.review}&quot;` (clean clamped quote) — or curate a one-line pull-quote field per testimonial.

### NC11 — Remove stray backslash (not copy, but visible text)
- **Current (`screens/caseStudies/index.tsx:443`):** a literal `\` on its own line before `<WhyChooseUs />`, which renders on the page.
- **Recommended:** delete the `\`.

---

## Priority Fix Table

| # | Issue | File : line | Priority | Verified |
|---|---|---|---|---|
| 1 | Entity name inconsistent across 5+ surfaces (Works / Case Studies & Portfolio / Portfolio & Case Studies / Case Studies - UI Pirate) | `hero/index.tsx:108`; `app/case-studies/page.tsx:11,17,21`; `screens/caseStudies/index.tsx:116` | 🔴 | ✅ |
| 2 | Headline number conflict: `50+ Projects` vs FAQ `20+ startups` vs GlobalCTA `50+ SaaS founders` | `hero/index.tsx:214`; `CaseStudiesFAQ.tsx:21`; `components/GlobalCTA.tsx:35-37` | 🔴 | ✅ |
| 3 | FAQ has no `FAQPage` JSON-LD (6 Q&A unmarked) | `screens/caseStudies/CaseStudiesFAQ.tsx` (whole file) | 🔴 | ✅ |
| 4 | Result chip silently falls back to industry label when no metric | `screens/caseStudies/index.tsx:290-291` | 🔴 | ✅ |
| 5 | Page's fallback content is "No case studies published yet / Check back soon"; grid is client-rendered from CMS | `screens/caseStudies/index.tsx:269,274`; `app/case-studies/page.tsx:38-45` | 🔴 | ✅ |
| 6 | CTAs point to `/contact` + `/pricing`, not canonical `Book a Free 15-Min Call` → cal.com | `screens/caseStudies/index.tsx:420-431` | 🔴 | ✅ |
| 7 | `$150M+ Made by our clients` unattributed / unverifiable | `hero/index.tsx:215` | 🟠 | ✅ |
| 8 | "Khaitan & Co - APAC's largest law firm" overstated claim (alt text) | `ClientLogosMarquee.tsx:16` | 🟠 | ✅ |
| 9 | Three inconsistent "industries we serve" lists | `CaseStudiesFAQ.tsx:42`; `index.tsx:118`; `page.tsx:13` | 🟠 | ✅ |
| 10 | No Twitter card block | `app/case-studies/page.tsx:10-36` | 🟠 | ✅ |
| 11 | `numberOfItems` in JSON-LD can render `0` | `screens/caseStudies/index.tsx:125` | 🟠 | ✅ |
| 12 | H1 "Real Projects. Real Results." — no keyword, no specificity | `hero/index.tsx:113-116` | 🟠 | ✅ |
| 13 | "we turn ideas into shipped products" / process list repeated 4× (H1, subhead, grid intro, What's next) | `hero/index.tsx:119-122`; `index.tsx:168-171,414-418` | 🟠 | ✅ |
| 14 | OG image is a raw screenshot, not a designed card | `app/case-studies/page.tsx:24` | 🟠 | ✅ |
| 15 | Proof is section 3 of 8; hero leads with stats + decorative testimonial cards | `screens/caseStudies/index.tsx:142-403` (order) | 🟠 | ✅ |
| 16 | Hero testimonial snippets render as `"...fragment..."` | `hero/index.tsx:198-200` | 🟡 | ✅ |
| 17 | Client logos not linked to their case studies | `ClientLogosMarquee.tsx:59-77` | 🟡 | ✅ |
| 18 | FAQ answers say "many of our case studies" with no links | `CaseStudiesFAQ.tsx:22,32` | 🟡 | ✅ |
| 19 | Angular over-weighted vs React (meta keywords + 3× body) — confirm intent | `page.tsx:15`; `index.tsx:170,417` | 🟡 | ✅ |
| 20 | Stray literal `\` renders before "Why Choose Us" | `screens/caseStudies/index.tsx:443` | 🟡 | ✅ |
| 21 | Card sub-line assumes every CMS title contains ` — ` | `screens/caseStudies/index.tsx:356` | 🟡 | ✅ |
| 22 | Case-study **detail** page renders via blog components — needs its own audit | `app/case-studies/[slug]/page.tsx:8-9` | 🟡 | ✅ |
| 23 | `keywords` meta list broader than on-page copy | `app/case-studies/page.tsx:14-15` | 🟡 | ✅ |
| 24 | Grid intro says "Deep dives" but nothing enforces problem/approach/result in excerpts | `screens/caseStudies/index.tsx:168-171` | 🟡 | ✅ |

---

## E-E-A-T Quick Wins (top 3 highest-ROI)

1. **Add `FAQPage` JSON-LD to `CaseStudiesFAQ.tsx`** and reconcile the 20+/50+ numbers in the same edit. One small change buys a rich-result + AI-citation signal *and* removes the page's most visible contradiction. (Fixes P-table #2, #3.)
2. **Guarantee 3–6 server-rendered evergreen case studies** so the page can never render "No case studies published yet", and so crawlers/AI engines always see real, attributed work. (Fixes #5, boosts AI-citation score +8.)
3. **Unify the entity name to "Case Studies"** across hero badge, `<title>`, OG, and JSON-LD `name`; fix the "APAC's largest law firm" alt text in the same pass. Cheap, and it makes the page a coherent citable entity. (Fixes #1, #8.)

---

## What's Working Well (preserve as-is)

- ✅ **`CollectionPage` + per-item `CreativeWork` JSON-LD** (`index.tsx:113-140`) — right structure, just needs the `length>0` guard, name alignment, and a `FAQPage` sibling.
- ✅ **Strong, specific meta description** (`page.tsx:12-13`) — keep it as the canonical industry list.
- ✅ **Canonical is correct and there is no duplicate `/works` route** — "Works" is purely a nav synonym pointing at `/case-studies`. No SEO action needed here; leave the two nav entry points as they are (per instruction).
- ✅ **Client-side search with a clear placeholder and results count** (`index.tsx:174-247`) — good pattern for a catalog this size.
- ✅ **"New" badge on recent case studies** (30-day window, `index.tsx:38-42`) — nice freshness signal.
- ✅ **Real client logos** (Ipsos, Khaitan & Co, Bioptex Medical, ArthAlpha) with descriptive alt text — genuine authority once the one overstatement is fixed.
- ✅ **ISR `revalidate = 60`** (`page.tsx:8`) — new CMS case studies appear without a rebuild.
- ✅ **Consistent card CTA** ("Read case study" / "Read") and honest empty/no-match states.
- ✅ **Testimonials + Why-Choose-Us reuse** — consistent with the landing page; keep, just de-dupe against the hero's decorative cards.

---

## Copy Tone Reference — Case-Studies-Specific

| ✅ Do | ❌ Avoid | Example from current code |
|---|---|---|
| Name the client and the outcome on the card | Show the industry string where a metric belongs | `primaryMetric = ... || study.industry` (`index.tsx:291`) |
| One entity name everywhere ("Case Studies") | Five spellings across title/badge/OG/JSON-LD | `hero/index.tsx:108` vs `page.tsx:11` vs `index.tsx:116` |
| One canonical number, stated once | "50+" here, "20+" in the FAQ, "50+" in GlobalCTA | `hero/index.tsx:214` vs `CaseStudiesFAQ.tsx:21` |
| Sourced or removed impact claims | "$150M+ Made by our clients" with no basis | `hero/index.tsx:215` |
| Accurate client descriptors | "APAC's largest law firm" | `ClientLogosMarquee.tsx:16` |
| `Book a Free 15-Min Call` → `cal.com/ui-pirate/15min` | "Start Your Project" → `/contact`, "View Pricing" | `index.tsx:420-431` |
| Say the reason to scroll | Restate the process list 4× | `index.tsx:170,417`; `hero/index.tsx:120` |
| FAQ that defends the proof (verify, industry, NDA) | Generic "how long does a project take" only | `CaseStudiesFAQ.tsx:15-44` |
| `FAQPage` / guarded `ItemList` schema | Unmarked Q&A; `numberOfItems: 0` | `CaseStudiesFAQ.tsx` (no schema); `index.tsx:125` |
| Clean pull-quotes | `"...mid-sentence fragment..."` | `hero/index.tsx:199` |

**Word / phrase removal list (case-studies additions):** `Real Projects. Real Results.`, `in practice`, `product thinking, IA, UX/UI and Angular/React development` (as a repeated stock phrase), `Made by our clients` (unattributed), `APAC's largest`, `Check back soon`, `Start Your Project` (as the primary CTA), `Typical response under 2 hours` (unless tracked).

---

*This file is the first-pass audit for the Works / Case Studies list page (`/case-studies`). Verify every quote against current source before implementing — the code is the ground truth. The case-study **detail** template (`app/case-studies/[slug]/page.tsx`, which currently renders through the blog detail components) is not covered here and needs its own audit file. Related audits: `01-landing-page.md` (shared testimonials / why-choose-us / GlobalCTA), `03-pricing-page.md` (`ProjectEstimate`), `05-services-pages.md` (service→proof internal linking).*
