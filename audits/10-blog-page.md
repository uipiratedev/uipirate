# Blog & Tutorials (List / Index) — Content Audit — UI Pirate

**Page path:** `/blogs` (labeled **"Blog & Tutorials"** in the Resources nav dropdown — `config/site.ts:62-64`; **"Blog"** in the mobile nav — `config/site.ts:126`; **"Blogs"** in the footer — `components/footer.tsx:272-273`; breadcrumb label **"Blog"** — `components/Breadcrumbs.tsx:11`)

**Files in scope:**
- `app/blogs/page.tsx` — route, `metadata` export, ISR, CMS fetch, `Blog` JSON-LD
- `screens/blogs/index.tsx` — page shell (hero + list + newsletter)
- `screens/blogs/hero/index.tsx` — badge, H1, subhead, search input
- `screens/blogs/featuredBlogs/index.tsx` — section heading, tag filter, post-type filter, card grid, empty state
- `screens/blogs/newsletter/index.tsx` — newsletter block (badge, heading, copy, email form)
- `app/sitemap.ts:36`, `:177-207` — `/blogs` + per-post sitemap entries
- Referenced: `components/LetsTalkButton.tsx` (newsletter button), `components/GlassBadge.tsx`

**Out of scope (own audit later):** `app/[slug]/page.tsx` + `screens/blogsDetails/*` — the **blog post detail** template (posts live canonically at `/{slug}`; `app/blogs/[slug]/page.tsx` is a `permanentRedirect` to `/{slug}` — verified, good). Also referenced by the case-study detail route (`08`).

**Focus:** Copy, messaging, positioning, editorial/author signals, internal linking, newsletter lead-capture integrity, metadata, structured data, E-E-A-T, AI citation readiness. **No UI/layout/animation/component-structure changes.**

**Research basis:** Apple HIG, Google Material UX Writing, Nielsen Norman Group, Copyhackers / Jobs-to-be-Done, Google E-E-A-T + Helpful Content, plus sources specific to blog/editorial index pages: NN/g content-hub & article-list research, Google's guidance on author bylines / `Article` structured data / publish + update dates, editorial-brand voice guidance, newsletter opt-in / lead-gen best practice (double opt-in, consent, working forms), and GEO / AI-citation-readiness guidance (`Blog` + `BlogPosting` `ItemList`, named authors, dated content, server-rendered lists).

**Last audited:** 2026-08-31
**Note:** New page — first audit. No prior v1/v2. Single first-pass audit written to the same shape as the v3 sections in the existing audit files (not a "what changed" delta). Covers the **index page only**, not individual posts.

---

## Research Foundation

Every recommendation traces back to one or more of these principles. Nothing below is opinion.

### What the research consistently says

**Apple Human Interface Guidelines — every word earns its place; labels stay consistent.** This page's own subject is named nine ways: nav **"Blog & Tutorials"**, mobile nav **"Blog"**, footer **"Blogs"**, breadcrumb **"Blog"**, `<title>` **"Design Blog"**, JSON-LD `name` **"UI Pirate Design Blog"**, hero badge **"INSIGHTS & RESOURCES"**, hero H1 **"Insights, Stories & Research…"**, list H2 **"All Articles"**. None of them agree.

**Google Material UX Writing — plain language, user's vocabulary.** Someone looking for the blog searches "ui pirate blog" or "saas design tutorials". The hero badge ("INSIGHTS & RESOURCES") and H1 ("Insights, Stories & Research for SaaS, Tech & Design") contain neither "blog" nor "tutorial" — the two words the nav, title, and users actually use.

**Nielsen Norman Group — content hubs are scanned for relevance + recency + credibility.** A blog index is judged on: *is there anything here for me, is it current, and who wrote it.* This page shows no author anywhere, dates cards from `createdAt` (not published/updated), and renders "0 views" on posts with no view data — three signals that read as "thin / abandoned" to a scanner.

**Copyhackers / Jobs-to-be-Done — the reader's job is "learn something I can use"; the business's job is "turn a reader into a lead".** The blog index has **no path to the agency** — no services link, no case-studies link (despite the `<title>` promising "Case Studies"), no `Book a Free 15-Min Call`. The only conversion element is the newsletter form, and **it doesn't work** (`onSubmit` calls `preventDefault()` and nothing else; the button links to `#`).

**Google E-E-A-T / Helpful Content — accurate claims, named authors, first-hand experience, freshness.** The meta + OG descriptions claim content comes "**from our Fortune 500 design work**" — a specific, verifiable-sounding claim that the case-studies audit (`08`) already flagged as unsupported (the named clients — Ipsos, Khaitan & Co, Bioptex — are not Fortune 500). Blog content with no bylines and no author bios is exactly what the December 2022 E-E-A-T update targeted.

**Editorial-brand voice — a blog needs a consistent editorial identity.** The newsletter block's voice ("✨ Get the Good Stuff Only ✨", "Zero marketing fluff. No spam. No filler.") is sharp and on-brand; the hero's voice ("Fresh ideas, research-backed insights, and real stories") is generic. Pick the sharper one.

**Newsletter opt-in best practice — a working form, explicit consent, a privacy link, and a clear value + cadence promise.** The current form has an unlabeled `type="email"` input (`placeholder="Email ID"`), a button labeled "Register", no consent checkbox, no privacy-policy link, and no backend. It should either work or be removed.

**GEO / AI citation readiness — server-rendered, dated, attributed, `ItemList` of `BlogPosting`.** The `Blog` JSON-LD here has no `blogPost` / `hasPart` list, no author entities, and no dates. The list itself is a client component, but it's hydrated from server-fetched props, so the posts *are* in the initial HTML — the main gap is schema and metadata, not rendering.

### How this audit applies the foundation

| Principle | Where it drives a finding |
|---|---|
| Apple HIG — consistent labels | 9 names for the blog (§1a, §Metadata, NC1) |
| Material — user's vocabulary | Badge/H1 avoid "blog" and "tutorial" (§1a, §1b, NC2) |
| NN/g — recency + credibility signals | No authors; cards dated from `createdAt`; "0 views" shown (§3b, §3c, P-table #4–6) |
| Copyhackers / JTBD | No agency CTA anywhere; broken newsletter is the only conversion (§4, §5, NC6) |
| E-E-A-T / accurate claims | "Fortune 500 design work" in meta + OG (§Metadata, P-table #2); no bylines (§3c) |
| Editorial voice | Hero generic vs newsletter sharp (§1c, §5) |
| Newsletter best practice | Dead form, "Register" button, "Email ID", no consent/privacy link (§5, NC7) |
| GEO / AI citation | `Blog` schema has no `blogPost` `ItemList`, no authors, no dates (§Metadata, §AI score) |

---

## What This Page Is For

`/blogs` is a **top-of-funnel SEO + authority asset**. Its job: rank for design/SaaS/UX informational queries, prove UI Pirate knows its craft, capture emails, and route interested readers toward the services / contact flow.

Judge it on:
1. **Findability & relevance** — can a visitor tell what's here and find a post for their problem in seconds?
2. **Credibility & freshness** — are posts attributed, dated, and current? Does the page look maintained?
3. **Conversion** — does a reader get a next step (newsletter that works, and a path to the agency)?

Currently: findability is OK (real tag + post-type filters, search), but credibility is weak (no authors, `createdAt` dates, "0 views", "Fortune 500" over-claim) and conversion is effectively **zero** (the newsletter form is inert and there is no agency CTA).

---

## Current Page Structure (from source)

| # | Section | Source | Notes |
|---|---|---|---|
| 1 | **Hero** | `screens/blogs/hero/index.tsx` | Badge "INSIGHTS & RESOURCES"; H1 "Insights, Stories & Research for SaaS, Tech & Design"; subhead; full-width search input (`aria-label`, `sr-only` label — good a11y) |
| 2 | **Article list** | `screens/blogs/featuredBlogs/index.tsx` | Dynamic H2 ("All Articles" / `Results for "x"` / selected tag) + post count; **Topic** filter (real CMS tags, top 8 by usage, with counts); **post-type** filter (blog/tutorial/listicle/… shown only if >2 types); 3-col card grid → each card links to `/{slug}`; empty state "No articles found." |
| 3 | **Newsletter** | `screens/blogs/newsletter/index.tsx` | Badge "Newsletter"; H2 "Stay In The Loop"; illustration; tagline "✨ Get the Good Stuff Only ✨"; 3-line description; email form (`type="email"`, placeholder "Email ID", button "Register" → `href="#"`) — **non-functional** |

**No:** featured/hero post treatment (despite the component being named `FeaturedBlogs`), author bylines, category landing pages, pagination, RSS link, "work with us" CTA, or any link to `/services` / `/case-studies` / `cal.com`.

---

## Section-by-Section Audit

### 1. Hero (`screens/blogs/hero/index.tsx`)

#### 1a. Badge
- **Current (verified, `:77-79`):** `INSIGHTS & RESOURCES`
- **Wrong:** Doesn't contain "blog" or "tutorial". "Resources" collides with the nav's **Resources** dropdown (which *contains* this page plus Tools, FAQs, Component Lab) — using it as this page's badge is confusing. Seventh name for the page.
- **Rewrite:** `BLOG & TUTORIALS` (match the nav).

#### 1b. H1
- **Current (verified, `:83-89`):** `Insights, Stories & Research for SaaS, Tech & Design`
- **Wrong:** No target keyword ("blog", "tutorials", "UI/UX", "design"). "Research" over-claims — the blog is not a research publication. Doesn't match `<title>` ("Design Blog…").
- **Why it matters:** The H1 is the strongest on-page relevance + SEO signal; it should carry the words users and the `<title>` use.
- **Rewrite:** `The UI Pirate blog — SaaS & product design, UX, and build tutorials` (or shorter: `SaaS design & UX — articles and tutorials`).

#### 1c. Subhead
- **Current (verified, `:91-94`):** `Fresh ideas, research-backed insights, and real stories from our work and the community.`
- **Wrong:** Generic ("Fresh ideas… real stories"). "research-backed" is an unbacked claim. Weaker voice than the newsletter block on the same page.
- **Rewrite:** `What we've learned shipping SaaS products for enterprise teams — UX calls, design-system decisions, and step-by-step build guides.`

#### 1d. Search
- **Current (verified, `:105-119`):** `sr-only` label "Search blog topics" + `aria-label` + `placeholder="Search by topic, problem, or keyword..."`
- **Verdict:** 🟢 Good — accessible, clear placeholder, `type="search"`. No change.

---

### 2. Article list — heading & filters (`screens/blogs/featuredBlogs/index.tsx`)

#### 2a. Section heading
- **Current (verified, `:109-113`):** `Results for "{searchQuery}"` when searching, else `selectedTag || "All Articles"`.
- **Verdict:** 🟡 Works. "All Articles" is fine but flat; consider `Latest articles` (implies recency, which a maintained blog wants to signal). The component/file is called `FeaturedBlogs` / `featuredBlogs` but nothing is featured — pure naming debt, not user-facing (noted for the implementation pass).

#### 2b. Filters
- **Topic filter (verified, `:121-157`):** real CMS tags, top 8 by usage, with per-tag counts, plus "All Topics". 🟢 Good pattern — the code comment (`:31-35`) explicitly notes this avoids the fixed-category drift problem seen on `/case-studies`. Keep.
- **Post-type filter (verified, `:159-185`):** blog / tutorial / listicle / comparison / etc. from `POST_TYPE_LABELS`, shown only when `postTypeTabs.length > 2`. 🟢 Good. Minor: "Social Post" / "Corporate Post" (`:22-23`) are unlikely to be reader-facing content types — if those postTypes ever publish to `/blogs`, they'll appear as filter tabs. Confirm the CMS only surfaces reader-appropriate types here.

#### 2c. Empty state
- **Current (verified, `:188-191`):** `No articles found.`
- **Wrong:** Terse; no recovery action. If the CMS returns zero posts (or a filter combo yields none), the entire page body is hero + "No articles found." + a broken newsletter. No "clear filters", no "browse all", no CTA.
- **Rewrite:** `No articles match that yet.` + a `Clear filters` action (when a filter/search is active) and a link to the newsletter or `Book a Free 15-Min Call`.

---

### 3. Article cards (`screens/blogs/featuredBlogs/index.tsx:194-257`)

#### 3a. Link target
- **Current (verified, `:208`):** `href={\`/${blog.slug}\`}` — 🟢 correct canonical (posts live at `/{slug}`; `/blogs/{slug}` permanent-redirects here). No action.

#### 3b. Date
- **Current (verified, `:198-202`):** `new Date(blog.createdAt).toLocaleDateString(...)` — displays **`createdAt`**, not `publishedAt` or `updatedAt`.
- **Wrong:** `createdAt` is when the draft row was created, which can predate publication by weeks and never reflects updates. Google's Helpful Content + freshness guidance wants an accurate publish date and, ideally, a visible "Updated" date.
- **Rewrite (logic, implementation pass):** show `publishedAt` (fallback `updatedAt`, then `createdAt`); if `updatedAt` is materially newer than publish, show `Updated {date}`.

#### 3c. Author — absent
- **Current:** cards show date · read time · views. **No author.**
- **Wrong:** For blog content, a byline is a primary E-E-A-T signal. There's no author on the card, no author on the (out-of-scope) detail template surfaced here, and no "written by the UI Pirate team" fallback.
- **Rewrite:** add `By {author}` (or `UI Pirate team`) to each card's meta row; link to an author page or the About page.

#### 3d. Views
- **Current (verified, `:248-251`):** `{(blog.totalViews || blog.views || 0).toLocaleString()} views`
- **Wrong:** Renders **`0 views`** for any post without view data — negative social proof on what may be good content, and it makes a new blog look dead.
- **Rewrite:** render the views span **only when `> ~50`** (or hide entirely); never show "0 views".

#### 3e. Read time
- **Current (verified, `:246`):** `{blog.readTime || 5} min read` — arbitrary `5` fallback. Minor: compute from body word count, or omit when unknown rather than guessing.

#### 3f. Thumbnail alt
- **Current (verified, `:215`):** `alt={blog.title}` — 🟡 acceptable (title as alt for a decorative-ish banner). No action.

#### 3g. No pagination
- `app/blogs/page.tsx:38` fetches `listPosts({ limit: 50 })`. Post #51+ is silently invisible on the index (though still in the sitemap via `:184-207`). Add "load more" / pagination before the catalog exceeds 50, or raise the limit and lazy-render.

---

### 4. Internal linking / funnel exit

- **The blog index links to zero money pages.** No `/services`, no `/pricing`, no `/case-studies` (even though the `<title>` says "…& Case Studies"), no `Book a Free 15-Min Call`. A reader who finishes scanning has one option: the broken newsletter.
- **Why it matters:** Copyhackers / JTBD — a top-of-funnel asset must have a funnel exit. NN/g — related-content and next-step links keep sessions alive.
- **Recommendations:**
  - Add a single bridge block between the list and the newsletter: `Building a SaaS product? See how we work → [Services]` / `[Book a Free 15-Min Call]` → `https://cal.com/ui-pirate/15min`.
  - Either add a real "From our case studies" strip, or remove "Case Studies" from the `<title>` (§Metadata / NC1).

---

### 5. Newsletter block (`screens/blogs/newsletter/index.tsx`)

- **Current (verified):**
  - Badge `Newsletter` (`:12-14`); H2 `Stay In The Loop` (`:18`)
  - Tagline `✨ Get the Good Stuff Only ✨` (`:36`)
  - Body: `We don't send emails often. Only when there's something genuinely useful.` / `Notes on UX, product decisions, & things we've learned the hard way.` / `Zero marketing fluff. No spam. No filler.` (`:45-53`)
  - Form: `<form onSubmit={(e) => e.preventDefault()}>` (`:57`), `<input type="email" placeholder="Email ID">` with **no `value`/`onChange`/`name`/`id`/`label`** (`:59-63`), button `<LetsTalkButton href="#">Register</LetsTalkButton>` (`:64-70`)
- **What's wrong:**
  1. **The form does nothing.** `preventDefault()` with no handler, no state, no API call; the button is a link to `#`. Submitting appears to succeed (page doesn't reload) but no email is captured. This is the worst possible state for a lead-capture form — it silently loses every signup and gives the user no feedback.
  2. **Button label "Register"** — wrong verb for a newsletter (expected "Subscribe" / "Join").
  3. **`placeholder="Email ID"`** — non-idiomatic; and a placeholder is not a label (the input has no visible or `sr-only` label, unlike the hero search which does it correctly).
  4. **No consent / no privacy-policy link.** "No spam" is asserted but there's no link to `/privacy`. For EU/UK visitors this is a compliance gap.
  5. **No success / error / already-subscribed states.**
- **What's right (preserve):** the copy voice — "Zero marketing fluff. No spam. No filler." and "things we've learned the hard way" is genuinely good, specific, and on-brand.
- **Recommendations:**
  - **Either** wire the form to a real list (state + `POST` to the CMS/ESP, success + error messaging, a consent line with a `/privacy` link) **or** replace the block with a static "Follow along" pointing to whatever channel is actually maintained. Do not ship a form that looks live and isn't.
  - Button `Register` → `Subscribe`. Placeholder `Email ID` → `you@company.com`. Add an `sr-only` `<label htmlFor>`.
  - Keep the three description lines verbatim.

---

## E-E-A-T Assessment

**Google's "Who / How / Why" test:**
- **Who** — Very weak. No author on any card, no author bios, no editorial "about this blog" line. `siteName` "UI Pirate by Vishal Anand" (metadata) is the only person-signal and it's inconsistent with the rest of the site.
- **How** — Not shown on the index. No description of how posts are researched/written; "research-backed" is asserted without a method.
- **Why** — Clear: SEO + authority + email capture. No deception in intent, but "Fortune 500 design work" is an unsupported credibility claim and the dead newsletter form erodes trust.

**Scored breakdown:**

| Dimension | Score | Notes |
|---|---|---|
| **Experience** /20 | **11** | "things we've learned the hard way", "from our work" — genuine first-hand framing in the newsletter copy. Lost points: no author experience shown; no evidence the posts are practitioner-written. |
| **Expertise** /25 | **13** | Topic focus (SaaS/UX/design systems/AI) is coherent and on-brand; real tag taxonomy. Lost points: zero bylines, no author credentials, "research-backed" unbacked, no editorial standards. |
| **Authoritativeness** /25 | **11** | Coherent brand, real tags, `Blog` schema present. Lost points: no named authors/entities, no `blogPost` list in schema, no external references, no RSS, entity named 9 ways. |
| **Trustworthiness** /30 | **12** | Honest voice in the newsletter copy. Lost points: **non-functional newsletter form** (captures nothing, no feedback); "Fortune 500 design work" claim; "0 views" on posts; `createdAt` dates; no consent/privacy link at email capture; no path to verify who's behind the content. |
| **Total** | **47 / 100** | Good editorial instincts and filter UX, undermined by missing author signals, an over-claim, and a broken conversion element. |

---

## SEO Metadata Assessment (`app/blogs/page.tsx`)

| Element | Current value (verified) | file:line | Verdict | Recommended |
|---|---|---|---|---|
| `<title>` | `Design Blog \| UI/UX Insights, SaaS Design Tips & Case Studies` | `page.tsx:10` | 🟠 ~60 chars OK, but promises **"Case Studies"** — which are explicitly excluded from `/blogs` (`page.tsx:41`). Misleading. | `UI Pirate Blog \| SaaS & Product Design, UX & Build Tutorials` |
| `meta description` | `Expert insights on UI/UX design, SaaS product design, design systems, and AI application design. Case studies, tutorials, and best practices from our Fortune 500 design work.` | `page.tsx:11-12` | 🟠 ~185 chars (truncates); **"Fortune 500 design work"** unsupported (see `08`); "Case studies" again | `Articles and tutorials on SaaS product design, UX, and design systems — practical lessons from designing and shipping software for enterprise teams.` |
| `keywords` | `UI/UX design blog, SaaS design tips, design system articles, UX case studies, enterprise design insights, AI app design, product design blog` | `page.tsx:13-14` | 🟡 Ignored by Google; "UX case studies" mismatches page scope | Trim; drop "case studies" phrasing |
| `canonical` | `https://uipirate.com/blogs` | `page.tsx:32-34` | 🟢 Correct | — |
| OG `title` | `Design Blog \| UI Pirate — UI/UX Insights & Case Studies` | `page.tsx:16` | 🟠 8th name variant; "Case Studies" again | Match revised `<title>` |
| OG `description` | `Expert UI/UX design insights, SaaS design tips, and case studies from our Fortune 500 design work.` | `page.tsx:17-18` | 🟠 "Fortune 500" + "case studies" repeated | `Articles and tutorials on SaaS product design, UX, and design systems from the UI Pirate team.` |
| OG `siteName` | `UI Pirate by Vishal Anand` | `page.tsx:20` | 🟡 Inconsistent with site-wide `UI Pirate` (same flag as `08`, `09`) | `UI Pirate` |
| OG `image` | `https://res.cloudinary.com/.../Screenshot_2026-05-22_023842_sebbvi.png` (1200×630, alt "UI Pirate Design Blog") | `page.tsx:21-28` | 🟠 Raw screenshot; **same file reused on `/case-studies`** — no page-distinct card | Branded blog OG card: "UI Pirate Blog — SaaS design, UX & tutorials" |
| Twitter card | **absent** | — | 🟠 No `twitter` block | `twitter: { card: "summary_large_image", title, description, images }` |
| JSON-LD | `Blog` — `name`, `description`, `url`, `publisher` (logo = SVG) | `app/blogs/page.tsx:46-66` | 🟠 No `blogPost` / `hasPart` `ItemList` of posts; no author entities; no dates; `name` = 9th variant; `publisher.logo` is `.svg` (Google prefers raster ≥112×112) | Add `blogPost: [{ @type: BlogPosting, headline, url, datePublished, author, image }]` for the visible posts; align `name`; use a PNG logo |
| Rendering | Server component fetches `listPosts`, passes to client list | `page.tsx:37-67` | 🟢 Posts are in the initial HTML (client list is hydrated from server props) | Add the `BlogPosting` list to schema so AI engines get itemised data |
| Pagination / `rel` | none; `limit: 50` | `page.tsx:38` | 🟡 Posts 51+ absent from index | Add pagination (and `rel=next/prev` or a paginated route) before the archive exceeds 50 |

---

## Keyword Gap Analysis

| Target phrase (reader intent) | In current copy? | Where / gap |
|---|---|---|
| "ui pirate blog" | Weak | `<title>` "Design Blog"; H1/badge don't say "blog" |
| "saas design blog" / "saas design tips" | Partial | Meta + keywords; not in H1/H2 |
| "ux tutorials" / "design system tutorial" | Weak | Only as a post-type filter label; no heading, no intro copy |
| "design systems articles" | Partial | Meta only |
| "ai app design" / "designing AI interfaces" | Weak | Meta keyword; no on-page section or intro mention |
| "how to [design task]" (tutorial intent) | No | Nav says "Blog & Tutorials" but the page has no tutorials framing/section |
| "enterprise ux insights" | Partial | Meta; hero says "SaaS, Tech & Design" instead |

**Takeaway:** "blog" and "tutorials" — the words in the nav label and the strongest head terms — appear in the `<title>` only. Put them in the H1 and the list heading; give tutorials at least a filter-preset entry point or an intro line.

---

## AI Citation Readiness Score

| Signal | State | Points |
|---|---|---|
| Server-rendered post list | 🟢 Posts fetched server-side, in initial HTML | 12 / 15 |
| `Blog` + `BlogPosting` `ItemList` schema | 🔴 `Blog` present but no `blogPost` / `hasPart` list, no per-post data | 2 / 15 |
| Named authors / author entities | 🔴 None on cards, none in schema, no author pages | 0 / 15 |
| Accurate dates (publish + update) | 🔴 Cards use `createdAt`; no "updated" signal | 3 / 15 |
| Consistent entity name | 🔴 9 spellings across nav/footer/title/schema/hero | 3 / 15 |
| Topic structure / taxonomy | 🟢 Real usage-ranked tag taxonomy + post-type filters | 12 / 15 |
| Claim accuracy | 🟠 "Fortune 500 design work"; "0 views" surfaced | 4 / 10 |
| Metadata completeness (title/desc/OG/Twitter/image) | 🟠 Title+desc present but misleading; no Twitter; shared screenshot OG | 4 / 10 |
| **Total** | | **40 / 100** |

**Biggest wins:** add `BlogPosting` `ItemList` with authors + `datePublished` (+15), add author bylines to cards (+8), fix dates to `publishedAt` (+6), unify the entity name (+4), drop the "Fortune 500" / "Case Studies" claims (+4).

---

## New Copy Recommendations

> Format: exact current copy → exact recommended copy, with file:line. Copy/content + linking/metadata only. No layout or component-structure change implied unless noted.

### NC1 — Unify the entity name to **"Blog"** (nav may keep "Blog & Tutorials")

| Surface | Current | file:line | → Recommended |
|---|---|---|---|
| `<title>` | `Design Blog \| UI/UX Insights, SaaS Design Tips & Case Studies` | `app/blogs/page.tsx:10` | `UI Pirate Blog \| SaaS & Product Design, UX & Build Tutorials` |
| OG title | `Design Blog \| UI Pirate — UI/UX Insights & Case Studies` | `app/blogs/page.tsx:16` | `UI Pirate Blog \| SaaS & Product Design, UX & Tutorials` |
| JSON-LD `name` | `UI Pirate Design Blog` | `app/blogs/page.tsx:51` | `UI Pirate Blog` |
| OG `siteName` | `UI Pirate by Vishal Anand` | `app/blogs/page.tsx:20` | `UI Pirate` |
| Hero badge | `INSIGHTS & RESOURCES` | `screens/blogs/hero/index.tsx:78` | `BLOG & TUTORIALS` |
| List H2 (default) | `All Articles` | `screens/blogs/featuredBlogs/index.tsx:112` | `Latest articles` |

### NC2 — Hero H1
- **Current (`screens/blogs/hero/index.tsx:83-89`):** `Insights, Stories &amp; Research <br /> for <span>SaaS, Tech &amp; Design</span>`
- **Recommended:** `SaaS & product design, UX, and <span>build tutorials</span>`

### NC3 — Hero subhead
- **Current (`screens/blogs/hero/index.tsx:91-94`):** `Fresh ideas, research-backed insights, and real stories from our work and the community.`
- **Recommended:** `What we've learned shipping SaaS products for enterprise teams — UX calls, design-system decisions, and step-by-step build guides.`

### NC4 — Meta + OG (remove "Fortune 500" and "Case Studies")
- **`meta.description` (`app/blogs/page.tsx:11-12`):** → `Articles and tutorials on SaaS product design, UX, and design systems — practical lessons from designing and shipping software for enterprise teams.`
- **`openGraph.description` (`:17-18`):** → `Articles and tutorials on SaaS product design, UX, and design systems from the UI Pirate team.`
- **`keywords` (`:13-14`):** drop `UX case studies`; keep `UI/UX design blog, SaaS design tips, design system articles, enterprise design insights, AI app design, product design blog`.

### NC5 — Article-card meta row (`screens/blogs/featuredBlogs/index.tsx:243-252`)
- **Current:** `{date} · {readTime||5} min read · {views||0} views` where `date` = `createdAt`.
- **Recommended (content/logic, implementation pass):**
  - `date` → `publishedAt` (fallback `updatedAt` → `createdAt`); prefix `Updated ` when `updatedAt` is materially newer.
  - Add `By {author || "UI Pirate team"}` to the row.
  - Render the views span **only when the count is meaningful (> ~50)**; never show `0 views`.
  - Read time: compute from content, or omit when unknown (drop the hard `5`).

### NC6 — Add a funnel exit (new block between list and newsletter)
- **Current:** none.
- **Recommended copy (new content block; reuse existing card/CTA styles, no new component pattern):**
  - Eyebrow: `Work with us`
  - Line: `Building or scaling a SaaS product? We design and ship it with you.`
  - Primary: `Book a Free 15-Min Call →` → `https://cal.com/ui-pirate/15min`
  - Secondary: `See our services` → `/services`

### NC7 — Newsletter block (`screens/blogs/newsletter/index.tsx`)
- **Current button (`:64-70`):** `Register` → `href="#"`; **input (`:59-63`):** `placeholder="Email ID"`, no label; **form (`:57`):** `onSubmit={(e) => e.preventDefault()}` with no handler.
- **Recommended:**
  - Button label `Register` → `Subscribe`.
  - Input `placeholder="Email ID"` → `placeholder="you@company.com"`; add `<label htmlFor="newsletter-email" class="sr-only">Email address</label>` and `id`/`name` on the input.
  - Add a consent line under the form: `By subscribing you agree to our [privacy policy](/privacy). Unsubscribe anytime.`
  - **Wire the form to a real list with success/error states — or** replace the whole form with a static line pointing to the channel that's actually maintained. Do not keep a live-looking, inert form.
  - Keep verbatim: `We don't send emails often. Only when there's something genuinely useful.` / `Notes on UX, product decisions, & things we've learned the hard way.` / `Zero marketing fluff. No spam. No filler.`

### NC8 — Empty state (`screens/blogs/featuredBlogs/index.tsx:188-191`)
- **Current:** `No articles found.`
- **Recommended:** `No articles match that yet.` + (when a filter/search is active) a `Clear filters` button, and a link `Get new posts by email` (to the newsletter) or `Book a Free 15-Min Call` → `https://cal.com/ui-pirate/15min`.

### NC9 — JSON-LD `blogPost` list (`app/blogs/page.tsx:46-66`)
- Add to the `Blog` object a `blogPost` array of `BlogPosting` for the posts rendered on the page: `headline`, `url` (`https://uipirate.com/{slug}`), `datePublished`, `dateModified`, `author` (`{ @type: Person|Organization, name }`), `image`. Align `name` → `UI Pirate Blog`. Swap `publisher.logo` to a PNG ≥112×112.

---

## Priority Fix Table

| # | Issue | File : line | Priority | Verified |
|---|---|---|---|---|
| 1 | Newsletter form is non-functional — `preventDefault()` only, button → `href="#"`, no state/handler/API; captures nothing, no feedback | `screens/blogs/newsletter/index.tsx:57-70` | 🔴 | ✅ |
| 2 | Meta + OG description claim content "from our **Fortune 500** design work" — unsupported (named clients aren't Fortune 500) | `app/blogs/page.tsx:12`, `:18` | 🔴 | ✅ |
| 3 | `<title>` + OG titles promise "Case Studies" — explicitly excluded from `/blogs` (`page.tsx:41`) | `app/blogs/page.tsx:10`, `:16` | 🔴 | ✅ |
| 4 | No author byline anywhere (cards, schema, author pages) — core blog E-E-A-T signal missing | `screens/blogs/featuredBlogs/index.tsx:243-252` | 🔴 | ✅ |
| 5 | Cards render `0 views` when no view data — negative social proof | `screens/blogs/featuredBlogs/index.tsx:248-251` | 🔴 | ✅ |
| 6 | Cards dated from `createdAt` (draft-row date), not `publishedAt`/`updatedAt`; no "updated" signal | `screens/blogs/featuredBlogs/index.tsx:198-202` | 🟠 | ✅ |
| 7 | No path to the agency anywhere on the blog index — no `/services`, `/case-studies`, or `Book a Free 15-Min Call` | `screens/blogs/index.tsx` (whole) | 🟠 | ✅ |
| 8 | `Blog` JSON-LD has no `blogPost`/`hasPart` `ItemList`, no authors, no dates | `app/blogs/page.tsx:46-66` | 🟠 | ✅ |
| 9 | Entity named 9 ways (Blog & Tutorials / Blog / Blogs / Design Blog / UI Pirate Design Blog / INSIGHTS & RESOURCES / Insights, Stories & Research / All Articles) | `config/site.ts:62,126`; `components/footer.tsx:273`; `app/blogs/page.tsx:10,16,51`; `hero/index.tsx:78,85` | 🟠 | ✅ |
| 10 | Hero badge "INSIGHTS & RESOURCES" collides with the nav "Resources" dropdown name; H1 has no keyword | `screens/blogs/hero/index.tsx:78,83-89` | 🟠 | ✅ |
| 11 | No OG image distinct to the blog — reuses the same screenshot as `/case-studies`; no Twitter card | `app/blogs/page.tsx:21-28` | 🟠 | ✅ |
| 12 | `siteName: "UI Pirate by Vishal Anand"` inconsistent with site-wide `UI Pirate` | `app/blogs/page.tsx:20` | 🟡 | ✅ |
| 13 | Newsletter: button "Register" (should be "Subscribe"), input "Email ID" with no label, no consent/privacy link | `screens/blogs/newsletter/index.tsx:59-70` | 🟡 | ✅ |
| 14 | Empty state "No articles found." — no clear-filters action, no CTA | `screens/blogs/featuredBlogs/index.tsx:188-191` | 🟡 | ✅ |
| 15 | No pagination; `limit: 50` — posts 51+ absent from the index | `app/blogs/page.tsx:38` | 🟡 | ✅ |
| 16 | `readTime` hard fallback of `5` when unknown | `screens/blogs/featuredBlogs/index.tsx:246` | 🟡 | ✅ |
| 17 | `publisher.logo` is an `.svg` (Google prefers raster ≥112×112 for Article/Blog logo) | `app/blogs/page.tsx:58-61` | 🟡 | ✅ |
| 18 | Nav label "Blog & Tutorials" but the page has no tutorial-specific framing/section/entry point | `config/site.ts:62`; `screens/blogs/*` | 🟡 | ✅ |
| 19 | `FeaturedBlogs` component/file name implies a featured post; none exists | `screens/blogs/featuredBlogs/index.tsx` | 🟡 | ✅ |
| 20 | "research-backed insights" (subhead) / "Research" (H1) — unbacked claim / over-claim | `screens/blogs/hero/index.tsx:83-94` | 🟡 | ✅ |
| 21 | `POST_TYPE_LABELS` includes "Social Post" / "Corporate Post" — would show as reader-facing filter tabs if ever published to `/blogs` | `screens/blogs/featuredBlogs/index.tsx:22-23` | 🟡 | ✅ |

---

## E-E-A-T Quick Wins (top 3 highest-ROI)

1. **Fix or remove the newsletter form.** A live-looking form that captures nothing and gives no feedback is the single biggest trust liability on the page. Wire it to a real list with success/error states + a `/privacy` consent line, or replace it with a static "follow along" line. (P-table #1)
2. **Add author bylines to cards + `BlogPosting` schema with `author` and `datePublished`, and drop the "Fortune 500" / "Case Studies" claims from the metadata.** One coordinated edit fixes the two worst E-E-A-T gaps (no attribution, unsupported claim) and the biggest AI-citation gap. (P-table #2, #3, #4, #8)
3. **Fix card dates to `publishedAt` and stop rendering "0 views".** Cheap, and it removes two "this blog is dead" signals for every scanner and crawler. (P-table #5, #6)

---

## What's Working Well (preserve as-is)

- ✅ **Real, usage-ranked tag taxonomy** (`featuredBlogs/index.tsx:64-78`, `:121-157`) — filters reflect what's actually published, not a fixed list that drifts. The code comment explicitly contrasts this with the `/case-studies` drift problem. Keep.
- ✅ **Post-type filter** (blog / tutorial / listicle / comparison …) shown only when there's enough variety (`:159-185`). Good progressive disclosure.
- ✅ **Accessible hero search** — `sr-only` `<label>`, `aria-label`, `type="search"`, clear placeholder (`hero/index.tsx:105-119`).
- ✅ **Server-fetched post list** passed to the client component — posts are in the initial HTML, so the page is crawlable even though the list is `"use client"`.
- ✅ **Cards link to the canonical `/{slug}`**; `/blogs/{slug}` correctly `permanentRedirect`s there (`app/blogs/[slug]/page.tsx`). Clean URL model.
- ✅ **Case studies correctly segregated** from `/blogs` at the data layer (`app/blogs/page.tsx:39-41`) with an explaining comment.
- ✅ **Per-post sitemap generation** from the live API (`app/sitemap.ts:177-207`) so new posts are discoverable even past the index's 50-item limit.
- ✅ **Newsletter copy voice** — "Zero marketing fluff. No spam. No filler." / "things we've learned the hard way." Specific, honest, on-brand. Keep the words; fix the form.
- ✅ **Dynamic list heading** that reflects the active search/tag (`featuredBlogs/index.tsx:109-113`).

---

## Copy Tone Reference — Blog-Specific

| ✅ Do | ❌ Avoid | Example from current code |
|---|---|---|
| One name: "Blog" (nav may say "Blog & Tutorials") | Blog / Blogs / Design Blog / Insights & Resources / Insights, Stories & Research | `page.tsx:10,51` vs `hero/index.tsx:78,85` |
| Put "blog" + "tutorials" in the H1 | Keyword-free hero ("Insights, Stories & Research") | `hero/index.tsx:83-89` |
| A working form, or no form | A form that `preventDefault()`s and captures nothing | `newsletter/index.tsx:57` |
| "Subscribe" | "Register" (for a newsletter) | `newsletter/index.tsx:65` |
| Byline on every card + in schema | Date · read time · views, no author | `featuredBlogs/index.tsx:243-252` |
| `publishedAt` (+ "Updated" when newer) | `createdAt` | `featuredBlogs/index.tsx:198` |
| Hide views under ~50 | "0 views" | `featuredBlogs/index.tsx:248-251` |
| "practical lessons from our SaaS work" | "from our Fortune 500 design work" | `page.tsx:12` |
| Only promise what's on the page | "…& Case Studies" in the blog `<title>` | `page.tsx:10` |
| A `Book a Free 15-Min Call` bridge before the newsletter | Blog index with zero agency links | `screens/blogs/index.tsx` |
| Consent line + `/privacy` link at email capture | Email field, no consent, no privacy link | `newsletter/index.tsx:57-72` |

**Word / phrase removal list (blog additions):** `Fortune 500 design work`, `& Case Studies` (in blog titles), `INSIGHTS & RESOURCES` (as the page badge), `research-backed` / `Research` (as an unearned claim), `Register` (for the newsletter), `Email ID`, `0 views`, `Get the Good Stuff Only` (keep only if the sparkle-emoji tone is deliberate — otherwise tighten to the strong lines below it).

---

*This file is the first-pass audit for the Blog & Tutorials index (`/blogs`). Verify every quote against current source before implementing — the code is the ground truth. The blog **post detail** template (`app/[slug]/page.tsx` + `screens/blogsDetails/*`) is not covered here and needs its own audit file. Related audits: `08-case-studies-page.md` (shared "Fortune 500"-style claim, `siteName` drift, reused screenshot OG image), `09-component-lab-page.md` (hub-page GEO/schema framework), `01-landing-page.md` (canonical `Book a Free 15-Min Call` CTA).*
