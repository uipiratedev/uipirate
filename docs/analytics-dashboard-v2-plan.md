# Analytics Dashboard v2 — Build Plan

**Status:** Draft · **Created:** 2026-10-08 · **Owner:** Vishal

---

## 1. Why v2

The dashboard works, but it cannot answer the one question that matters:

> *"Where is my traffic actually coming from, and is SEO working?"*

Today four tools report four different numbers for the same 30 days and nothing
on screen explains the gaps:

| Source | Last 30d | What it actually counts |
| --- | --- | --- |
| Vercel Analytics | 616 visitors / 1,395 views | Every browser that ran the script. No consent needed. |
| **Our dashboard** | *(lower — unmeasured)* | Only visitors who **granted cookie consent** and weren't blocked. |
| Google Search Console | 30 clicks / 431 impressions | Only sessions that *started* from a Google result. |
| Bing Webmaster | 1 click / 76 impressions | Same, for Bing. |

Google sends ~46 of 616 visitors (~7%). The rest is Reddit (~71), X/t.co (18),
ChatGPT (10), LinkedIn (9) and direct. **None of that is visible in GSC**, and
our own dashboard under-counts all of it.

### The headline insight v2 must surface automatically

`/design-tokens-how-to-build-an-enterprise-grade-token-system` pulled **229
visitors** — nearly the homepage (235) — while being **not indexed on Google**.
That page earns traffic with zero search help. Nothing in the current dashboard
makes that collision visible.

---

## 2. Root causes of the data gap

Findings from reading the current implementation:

### 2.1 Consent gate drops a large share of visitors
`components/analytics/AnalyticsTracker.tsx` only starts when
`localStorage["cookie-consent"].analytics === true`. No consent → zero events.

### 2.2 Consent auto-accept depends on a fragile third-party call
`components/CookieConsent.tsx:119` calls a **free external geolocation API** to
decide if the visitor is in a GDPR country. If that call is blocked by an ad
blocker, rate-limited, or slow, the banner shows instead of auto-accepting — and
a non-EU visitor who ignores the banner is never counted.

> Vercel already gives us the country for free in the `x-vercel-ip-country`
> request header. Zero latency, zero failures, no third party.

### 2.3 AI traffic is invisible — misclassified
`lib/analytics/enrich.ts:39-43`:

- `chatgpt.com` matches neither `SEARCH_HOSTS` nor `SOCIAL_HOSTS` → falls
  through to generic **`referral`**.
- `gemini.google.com` **matches `SEARCH_HOSTS`** → wrongly counted as
  **organic search**.
- `perplexity.ai`, `claude.ai`, `copilot.microsoft.com` → `referral`.

With GPTBot/ClaudeBot explicitly allowed in `robots.txt`, AI referral traffic is
a strategic channel and deserves its own bucket.

### 2.4 Bot traffic is thrown away
`app/api/analytics/collect/route.ts:54` returns early for any bot UA. We allow
AI crawlers in `robots.txt` but have **no record of them ever visiting**.

### 2.5 Search data is not joined to page data
`/admin/analytics/pages` shows our visitors. `/admin/analytics/search` shows GSC
clicks. They are never shown side by side, so "high traffic + zero impressions"
is invisible.

### 2.6 `mocked: true` can silently show fake data
`lib/analytics/searchConsole.ts` returns `mocked: true` when credentials are
missing. The UI must never render placeholder numbers without a loud banner.

---

## 3. Design principles for v2

1. **Every number is labelled with what it counts.** No bare "Visitors".
2. **Never hide a gap — explain it.** Show tracked vs. untracked side by side.
3. **One screen answers "where is traffic from".** Channel is a first-class dimension.
4. **SEO and traffic live together**, never on separate pages.
5. **Privacy first.** Anonymous counting needs no cookie and no consent.

---

## 4. Scope

### Phase 1 — Fix correctness ✅ DONE

| # | Change | File |
| --- | --- | --- |
| 1.1 | ✅ Replaced third-party geo lookup with first-party `/api/geo` reading `x-vercel-ip-country` | `app/api/geo/route.ts`, `components/CookieConsent.tsx` |
| 1.2 | ✅ Added `ai` to `ReferrerType`; AI hosts classified **before** search hosts | `lib/analytics/enrich.ts`, `lib/analytics/types.ts` |
| 1.3 | ✅ Already present — amber "Preview Mode Active" banner | `SearchAnalyticsClient.tsx:469` |
| 1.4 | ⬜ Deploy the pending ISR caching + canonical fix (commit `acaa60e`) | — |
| 1.5 | ✅ Brand logos for referrers (theSVG) | `lib/analytics/brands.ts`, `components/admin/BrandLogo.tsx` |
| 1.6 | ✅ `getTopReferrers` now groups by **host**, not full URL | `lib/analytics/queries.ts` |
| 1.7 | ✅ Channel keys render as human labels ("AI assistants") | `lib/analytics/brands.ts` |

**1.2 ordering matters:** `gemini.google.com` must be tested against the AI list
*before* `SEARCH_HOSTS`, or it stays misclassified as organic. Covered by a
regression test in `__tests__/lib/analytics/enrich.test.ts`.

**1.1 behaviour change:** when the country cannot be determined the banner is
now shown (consent required) rather than assumed non-EU. Safer default, and the
header is reliable on Vercel so the unknown case should be rare.

#### Brand icons — theSVG

Source: [thesvg.org](https://thesvg.org) · tooling MIT, marks remain their
owners' property.

- **CDN, not npm.** Referrer hosts are only known at runtime, so the
  tree-shakeable `@thesvg/react` package would mean bundling thousands of
  unused components into the admin build.
- **Pinned to `@3.1.0`.** `@main` would let an upstream rename break every icon
  silently. Note the GitHub CDN has no `3.3.12` tag even though npm does.
- **`default` variant only.** `mono` 404s upstream for `openai`, `linkedin`,
  `bing` and `gemini`.
- **Slugs are not guessable** — verified each against the CDN. `bing` →
  `microsoft-bing`, `chatgpt.com` → `openai`, `twitter.com`/`t.co` → `x`,
  `producthunt` → `product-hunt`. No icon exists for Yahoo or Hacker News.
- Unmapped hosts and load failures fall back to a neutral letter tile.

### Phase 2 — Close the counting gap ✅ DONE

| # | Change | Detail |
| --- | --- | --- |
| 2.1 | ✅ **Consent-free counter** | `AnalyticsHitDaily`, written from **middleware**. No cookie, visitor id, IP or UA stored — only a `+1` per bucket. |
| 2.2 | ✅ **Bot/AI crawler log** | `AnalyticsBotDaily` + `lib/analytics/botIdentity.ts` names 60+ crawlers. |
| 2.3 | ✅ **Consent rate metric** | On Overview and Channels: tracked ÷ all visits. |
| 2.4 | ✅ **Joined GSC per page** | Done live in `contentPerformance.ts` — see deviation below. |

#### Why middleware, not the page or a beacon

This was the one real architectural constraint. Blog pages are **ISR-cached**
for SEO, so their server render does *not* re-run per visitor — counting there
would miss nearly every hit. A client beacon would reintroduce exactly the
blind spot we are trying to remove (ad blockers, no-JS, declined consent).

Middleware is the only hook that sees **every** request, cached or not. Since
Mongoose cannot run on the edge, middleware fires a non-blocking
`event.waitUntil(fetch(...))` to `/api/analytics/hit`, which does the write in
the Node runtime.

Guards, all verified against a running server:
- Skips `/api`, `/admin`, `/login`, `/_next` (and so cannot recurse).
- Counts only `GET` + `Accept: text/html` — **RSC prefetches do not
  double-count** (confirmed: a prefetch after a real hit left `hits: 1`).
- Requires `x-internal-token`; a wrong token returns **401**.
- Every failure is swallowed — counting can never break page delivery.

> ⚠️ **Deployment requirement:** set `CRON_SECRET` (or
> `INTERNAL_ANALYTICS_SECRET`) in the Vercel environment. It is **not set
> today**, so counting stays off until it is, and the dashboard says so
> explicitly rather than quietly reading zero.

#### Deviation from plan: no `AnalyticsPageSearchDaily`

The spec called for caching GSC rows into a new table behind a new cron. Built
instead as a live join in `lib/analytics/contentPerformance.ts`, because
`IndexedUrl` **already** stores per-URL index state and `getSearchIntelligence`
already returns per-page rows. A new table plus cron would have added two
moving parts and a staleness window for a page that is read a few times a day.
Revisit if the Content screen gets slow.

### Phase 3 — The new dashboard ✅ DONE

Two new screens, both in the sidebar:

| Screen | Route | What it answers |
| --- | --- | --- |
| **Channels** | `/admin/analytics/channels` | "Where does my traffic come from?" |
| **Content** | `/admin/analytics/content` | "Which pages need work, and why?" |

Overview KPIs were relabelled so no number is ambiguous: *All visits*,
*Tracked*, *Consent rate*, *Crawler hits*, *Bounce rate*, *New leads* — each
with a one-line definition underneath.

**Empty-state honesty.** With the counter at zero, every indexed page would
otherwise be flagged "indexed, no traffic" — a screen of false alarms on first
deploy. Traffic-dependent flags are now withheld until the counter has recorded
something, and a blue notice explains why. Verified: flags went from 5 false
positives to 0.

#### 3.1 Overview — "Executive" rewrite
Five labelled KPIs, each with a one-line definition:

```
Visitors (all)        1,395   every human pageview, no consent needed
Tracked visitors        640   granted consent — powers journeys below
Search clicks            31   Google 30 + Bing 1
Search impressions      507   times we appeared in results
AI + bot crawls       2,431   GPTBot, ClaudeBot, Googlebot
```

#### 3.2 Channels — the "where from" screen (new)
A single screen replacing guesswork:

| Channel | Visitors | % | Trend | Top source |
| --- | --- | --- | --- | --- |
| Direct | 410 | 38% | ↑ | — |
| Social | 89 | 14% | ↑ | reddit.com (71) |
| Organic search | 47 | 8% | → | google.com (46) |
| **AI assistants** | 10 | 2% | ↑ | chatgpt.com |
| Referral | 60 | 10% | → | … |

Plus: channel-over-time stacked area, and **country × channel** breakdown.

#### 3.3 Pages — traffic × search, together
One row per page, sortable, with an **opportunity flag**:

| Page | Visitors | Impr. | Clicks | Pos. | Indexed | Flag |
| --- | --- | --- | --- | --- | --- | --- |
| `/design-tokens-…` | 229 | 14 | 0 | — | ❌ | 🔴 Traffic, no index |
| `/` | 235 | 113 | 22 | 4.5 | ✅ | — |
| `/ui-ux-design-cost…` | 12 | 26 | 1 | 3.46 | ✅ | 🟡 Ranks, low CTR |

**Flag rules**
- 🔴 **Traffic, no index** — visitors > 50 and not indexed → highest priority.
- 🟡 **Ranks, low CTR** — position < 10 and CTR < 2% → rewrite title/description.
- 🟠 **Impressions, no clicks** — impressions > 10 and clicks = 0 → intent mismatch.
- 🔵 **Indexed, no traffic** — indexed, visitors < 5 → thin or off-target content.

#### 3.4 SEO health strip
Persistent across admin pages: indexed count vs. sitemap count, open GSC issues
by type, pages crawled in the last 7 days, and current Core Web Vitals.

---

## 5. Data model additions

```ts
// models/analytics/AnalyticsPageDaily.ts  (extend existing)
{ date, path, country, deviceType, channel, views, uniques }

// models/analytics/AnalyticsBotDaily.ts   (new)
{ date, botName, botCategory: "search" | "ai" | "seo" | "other", path, hits }

// models/analytics/AnalyticsPageSearchDaily.ts  (new — GSC/Bing cache)
{ date, path, engine: "google" | "bing", clicks, impressions, ctr, position }
```

A daily cron (reusing the `app/api/admin/indexing/cron` pattern) refreshes the
search cache so the dashboard never blocks on a live API call.

---

## 5b. What is left to do

| # | Action | Owner |
| --- | --- | --- |
| 1 | **Set `CRON_SECRET` in Vercel** — counting is off without it | You |
| 2 | **Deploy** `vishal/dev2` → `main` (also carries the ISR/canonical fix) | You |
| 3 | Confirm GSC service account is connected in production (`searchMocked` was `true` locally) | You |
| 4 | After ~3 days of data, compare *All visits* against Vercel and tune | Either |

Known pre-existing issues, untouched by this work:
- `models/Lead.ts:74` — `TS2590: union type too complex`. Reproduces on a
  clean checkout.
- `__tests__/lib/ssrfGuard.test.ts` — DNS-dependent, 5s timeout, fails roughly
  1 run in 3.
- `~1,500` prettier CRLF warnings repo-wide (Windows line endings).

## 6. Open decisions

1. **Consent-free counter (2.1)** — anonymous and cookie-free, so lawful under
   GDPR/ePrivacy in most readings, but it is a judgement call. **Confirm before
   building.**
2. **Retention** — how long to keep raw `AnalyticsEvent` rows? Proposal: raw 90
   days, daily rollups forever.
3. **GSC service account** — is it connected in production? Needs verifying
   before 2.4 can be built.
4. **Vercel reconciliation** — show Vercel's number inside our dashboard via
   their API, or keep them separate?

---

## 7. Sequencing

```
Phase 1  ──►  deploy  ──►  verify numbers move  ──►  Phase 2  ──►  Phase 3
  (1h)                        (2–3 days of data)      (0.5d)       (0.5d)
```

Phase 1 ships alone and is independently valuable. Let 2–3 days of data land
before Phase 2 so the consent-rate gap can be measured rather than guessed.

---

## 8. Success criteria

- [ ] Dashboard visitor count within **10%** of Vercel (today: unknown gap).
- [ ] Every KPI on screen carries a one-line definition of what it counts.
- [ ] Channel attribution covers **100%** of visitors (no "unknown" bucket).
- [ ] AI assistant traffic is its own channel, not lumped into referral.
- [ ] Any page with traffic but no index is flagged within 24h.
- [ ] `mocked: true` can never render without a visible warning.

---

## 9. Phase 4 — Conversions, funnels and history

Added after scanning the live portal (2026-10-08). Findings that drove it, from
the production database:

| Finding | Evidence |
| --- | --- |
| No real conversions recorded in 30 days | `leads`: 0 rows. The only 2 estimates are `localhost:3000` test submits from September. |
| Most contact routes are invisible | 51 sessions reached `/contact` or `/pricing`; only 4 clicked WhatsApp / mail / tel / Cal.com — and none of those reach the leads count. |
| Readers have nowhere to go | Design-tokens post: 142 sessions, ~4 min read, **0.94 pages/session**. |
| "Direct" is 79% | Consistent with Vercel (~72% no referrer), but only 2 sessions carry a UTM, so it cannot be broken down. |
| Click analytics are fragile | 3,372 of 3,374 clicks have no stable id; only one `data-analytics-id` exists in the codebase. |
| Stored `isBounce` is dead | `true` on all 413 sessions, never updated. The dashboard computes bounce at read time, so the KPI is right, but the field is a trap. |
| Half the site is not indexed | 59 of 123 URLs indexed; 40 "Discovered – not indexed". |

### Scope

| # | Item | Approach |
| --- | --- | --- |
| 4.1 | **Contact actions as conversions** | Tracker classifies WhatsApp / mailto / tel / Cal.com / Upwork clicks and emits a `conversion` event with a `conversionKind`. Counted alongside form submits. |
| 4.2 | **Stable click ids** | Tracker derives an id from the link destination when no `data-analytics-id` is set (survives copy changes); key CTAs tagged by hand. |
| 4.3 | **UTM link builder** | `/admin/utm-links` with presets for Reddit, LinkedIn, X, Upwork, newsletter. Pure client page. |
| 4.4 | **Next-step CTA on articles** | End-of-article block on blog posts, tracked as its own id. |
| 4.5 | **Funnel screen** | `/admin/analytics/funnel`: sessions → viewed pricing/contact → contact action → form submit, with per-landing-page conversion rate. |
| 4.6 | **Tool usage** | Derived from existing click events on `/tools/*` — no new tracking. Leaderboard of views vs. sessions that took an action. |
| 4.7 | **Broken-link log** | `not-found` page reports the missing path anonymously → `AnalyticsNotFoundDaily`; shown on Content. |
| 4.8 | **Weekly snapshots** | Cron writes `AnalyticsSnapshot` weekly; Channels shows week-over-week history. |
| 4.9 | **Remove dead `isBounce`** | Drop the stored field so nothing reads it by mistake. |

### Deliberately not built

- **Scroll milestones** — `page_close.scrollDepthMax` is already stored and the
  Engagement screen already charts its distribution. A second event stream
  would only add volume.
- **A "path" normalisation fix** — `cleanPath` already strips full URLs
  server-side; the `localhost:3000` paths are older rows.

### Status — Phase 4 ✅ DONE

| # | Item | Where |
| --- | --- | --- |
| 4.1 | ✅ Contact actions → `conversion` events | `lib/analytics/conversions.ts`, tracker in `lib/analytics/client.ts` |
| 4.2 | ✅ Stable click ids derived from link destination; key CTAs tagged (`cta-nav-contact`, `cta-global-estimate`, `cta-global-work`, `cta-footer-primary`, `cta-article-contact`, `cta-article-book-call`) | same + `navbar.tsx`, `GlobalCTA.tsx`, `footer.tsx` |
| 4.3 | ✅ UTM link builder | `/admin/utm-links` |
| 4.4 | ✅ End-of-article CTA | `components/blog/ArticleCta.tsx` |
| 4.5 | ✅ Funnel screen | `/admin/analytics/funnel` |
| 4.6 | ✅ Tool & component usage | on the Funnel screen; derived from existing click events |
| 4.7 | ✅ Broken-link log | `not-found` page → `AnalyticsNotFoundDaily`; card on Content |
| 4.8 | ✅ Weekly snapshots | cron `0 4 * * 1` → `AnalyticsSnapshot`; "Week by week" on Channels |
| 4.9 | ✅ Dead `isBounce` removed | `models/analytics/AnalyticsSession.ts` |

**Verified against a running server and the live database:** a WhatsApp click
stored as `conversion`/`whatsapp` with id `link:wa.link`; a forged
`conversionKind` was rejected (whitelist); a human 404 logged with its referrer
and query string stripped, while Googlebot and `/admin/*` were refused; the
snapshot endpoint returns 401 without the secret and 200 with it; the funnel
read 414 sessions → 52 intent → 4 converted on real data. Test rows were removed
afterwards.

**Two things the live data showed**

- *Component Lab is the site's most-used feature.* Use rates (sessions that
  pressed a button) are 60–100% on pages like `tactile-pill-button` — far above
  anything else on the site.
- *Historic form submits include test data.* 3 `form_submit` events from
  September are `localhost:3000` test submissions and count toward "contact
  actions" until they age out of the 90-day window.

**Known follow-ups, not fixed here**

- A CMS list request is ~2.2 MB, over Next's 2 MB data-cache limit
  (`Failed to set fetch cache … 2200015 bytes` in the build log), so it is
  refetched every time. Trim the `fields` requested or paginate.
- `/tools/*` pages produced no rows in the usage table; only Component Lab
  pages showed. Worth checking whether tool pages emit button clicks the same
  way.

---

## 10. Phase 5 — SEO and data-quality fixes

Found by measuring production, not guessing. Numbers are before → after.

| Problem | Evidence | Fix |
| --- | --- | --- |
| **Blog pages near Googlebot's 2 MB limit** | `design-tokens` page: 1,835,048 bytes, 4 embedded images | 279,873 bytes (−85%), 0 embedded |
| **4 case studies store hero images as base64** | connectwise 409 KB, nxvoy 348 KB, sarge 25 KB, testdynamiz 13 KB — each stored twice (featured + banner) = 1.6 MB | Rewritten to `/api/post-image/{slug}/{kind}/{version}`: decoded and served as a real, immutable-cached PNG. Case-study cards show their real image again instead of the placeholder. |
| **A 2.2 MB CMS request that could never be cached** | `Failed to set fetch cache … 2200015 bytes` on every build | Sitemap now asks for 6 fields: 1,650,000 → 17,100 bytes. `opengraph-image` `generateStaticParams` narrowed to `id,slug,postType`. Warning gone. Sitemap output verified identical (114 = 114 URLs, empty diff). |
| **Every CMS call paid a redirect** | `/api/pirateCOS/v1` answers `308 → /api/cometCOS/v1` | Client calls `cometCOS` directly. |
| **Internal links concentrated on 3 posts** | "More to Read" always showed the 3 newest posts — currently case studies — so every article carried identical links and most posts had 1 inbound link; 36 URLs at "Discovered – currently not indexed" | Rotating picks: each post links to the next 3, wrapping around, so **every post receives exactly 3 inbound links** (unit-tested). Links go to the canonical route, not through `/[slug]`'s redirect. |
| **Dev traffic written to the production database** | `.env.local` points at prod; 71 events had a localhost referrer; the only "conversions" were owner test submits | Ingest refuses non-production and localhost requests at all four entry points. `ANALYTICS_ALLOW_DEV=1` re-enables it deliberately. Old test sessions are excluded from funnel / overview / snapshot counts (raw 3 → clean 1) without deleting any production rows. |
| **Tool usage table hid tools and undercounted them** | 37 pages competed for 30 rows; only buttons counted, but tools are operated through inputs (105), selects (14), textareas (19) vs buttons (51) | All 37 shown, split Tools / Component Lab; fields count as use. |
| **Mongoose duplicate-index warning** | `google.coverageState` indexed twice | Removed the field-level duplicate. |

### What the unindexed-page analysis showed

56 of 114 sitemap URLs are not indexed: 36 *Discovered – not indexed*, 13
*unknown to Google*, 4 *crawled – not indexed*, 3 *duplicate*. Only **7 of the
56 have ever been crawled**, and **none were ever submitted to a Google API**.
Raw HTML for every checked page carries 400–5,000 words of real content, so
this is a discovery problem, not a rendering one — hence the internal-linking
fix above. The three "duplicate" pages chose unrelated third-party canonicals
(`747live.bet`, `marcustheatres.com`), which Google does when it has fetched a
near-empty page; they were crawled before the caching / API-failure fixes.

### Still open (outside the codebase)

- **Upload the 4 base64 images to Cloudinary** and put the URLs in the CMS. The
  proxy makes this safe to defer, but the CMS API still sends ~1.6 MB on any
  full list request (`/blogs` fetches all posts, then filters).
- **One residual test conversion** (Sep 8, path `/contact`) cannot be told
  apart from a real one; it leaves the 90-day window on 7 Dec. The two test
  estimates (`UI Pirate`, `xyz`) are still in the estimates collection.
- **Request indexing** for the 3 duplicate pages and the weakest unindexed URLs
  (`/services/*`, the older blog posts) in Search Console.
