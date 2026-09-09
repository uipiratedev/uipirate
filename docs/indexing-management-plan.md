# Indexing Management — Build Plan

A dedicated **Indexing** module inside `/admin` to submit URLs to Google & Bing,
track whether each URL is actually indexed, catch regressions, and keep drafts
out of the search index until they're ready.

- Stack: Next.js App Router, MongoDB (`lib/mongodb.ts`), HeroUI, existing admin
  shell (`components/admin/DashboardShell.tsx`) + RBAC (`lib/auth/roles.ts`).
- Draft guard is central: held case studies
  (`frytx`, `infinity-aquasol`, `designing-testdynamiz`, `designing-brahmastra`)
  must never be submitted until flipped live.

---

## 1. Scope & goals

| Goal | How |
| --- | --- |
| Submit any URL to Google, one call at a time | Google Indexing API `urlNotifications:publish` |
| Submit URLs to Bing instantly | IndexNow (key file) + Bing Webmaster `SubmitUrlBatch` |
| Know real index status per URL | Google URL Inspection API + Bing WMT `GetUrlInfo` |
| Detect drops (was indexed → now excluded) | Nightly re-inspect + history diff |
| Reconcile sitemap vs tracked vs indexed | `sitemap.ts` diff view |
| Never index drafts | `isPublishable(url)` gate on every submit path |
| Respect API quotas | Per-day usage counters, queue overflow |

Non-goals: keyword ranking, backlinks, analytics (already covered elsewhere).

---

## 2. Data model

### 2.1 Collection `indexedUrls`

```ts
interface IndexedUrl {
  _id: ObjectId;
  url: string;              // absolute canonical URL — UNIQUE index
  path: string;             // "/case-studies/frytx"
  type: "page" | "case-study" | "blog";
  inSitemap: boolean;
  isDraft: boolean;         // mirrors the content draft flag
  noindexIntentional: boolean; // user marked "excluded on purpose" — silences alerts

  google: {
    submittedAt: Date | null;
    lastResponseCode: number | null;   // from Indexing API publish
    coverageState: string | null;      // URL Inspection: verdict text
    indexingState: string | null;      // "INDEXING_ALLOWED" | "BLOCKED_BY_META_TAG" ...
    verdict: "PASS" | "PARTIAL" | "FAIL" | "NEUTRAL" | null;
    robotsTxtState: string | null;
    lastCrawlTime: Date | null;
    googleCanonical: string | null;    // Google-picked canonical
    userCanonical: string | null;      // our declared canonical
    lastInspectedAt: Date | null;
    lastError: string | null;
  };

  bing: {
    submittedAt: Date | null;
    lastResponseCode: number | null;
    indexed: boolean | null;
    lastCrawlTime: Date | null;
    lastInspectedAt: Date | null;
    lastError: string | null;
  };

  indexnow: {
    submittedAt: Date | null;
    statusCode: number | null;
  };

  history: IndexEvent[];    // capped to last ~50, newest first
  createdAt: Date;
  updatedAt: Date;
}

interface IndexEvent {
  ts: Date;
  source: "google" | "bing" | "indexnow" | "sitemap-sync" | "cron";
  action: "submit" | "inspect" | "status-change" | "publish-hook";
  result: string;          // "202 accepted", "Crawled – not indexed", "dropped: noindex"
  actorId?: string;        // admin user id when manual
}
```

Indexes: `{ url: 1 }` unique, `{ "google.coverageState": 1 }`, `{ isDraft: 1, inSitemap: 1 }`, `{ updatedAt: -1 }`.

### 2.2 Collection `indexApiQuota`

```ts
interface IndexApiQuota {
  _id: string;             // `${provider}:${YYYY-MM-DD}`  e.g. "google-indexing:2026-09-09"
  provider: "google-indexing" | "google-inspection" | "bing-submit";
  date: string;
  used: number;
  limit: number;           // 200 / 2000 / 10000
  updatedAt: Date;
}
```

Atomic `findOneAndUpdate` with `$inc` before each external call; refuse when `used >= limit` and enqueue instead.

### 2.3 Collection `indexQueue` (overflow)

```ts
{ url, provider, action, enqueuedAt, attempts, lastAttemptAt, status: "pending" | "done" | "failed" }
```

Drained by the nightly cron in quota order.

---

## 3. External integrations

| Provider | Endpoint | Auth | Limit |
| --- | --- | --- | --- |
| Google Indexing API | `POST https://indexing.googleapis.com/v3/urlNotifications:publish` `{url, type: "URL_UPDATED" \| "URL_DELETED"}` | Service account (JSON key) added as **Owner** in Search Console; scope `https://www.googleapis.com/auth/indexing` | 200/day, 600/min. HTTP batch = 100 sub-requests/call, still 1 quota unit each |
| Google URL Inspection | `POST https://searchconsole.googleapis.com/v1/urlInspection/index:inspect` `{inspectionUrl, siteUrl}` | Same service account; scope `webmasters.readonly` | 2000/day, 600/min |
| Google Sitemaps | `PUT .../sites/{site}/sitemaps/{feedpath}` (resubmit) | same | — (the old `/ping` endpoint is dead) |
| IndexNow | `POST https://api.indexnow.org/indexnow` `{host, key, keyLocation, urlList[]}` | Key file at `public/<key>.txt` containing the key | up to 10000 URLs/request, effectively unlimited |
| Bing Webmaster | `SubmitUrlBatch`, `GetUrlInfo` (REST, `?apikey=`) | Bing WMT API key | 10000 URLs/day (varies by site) |

### Env vars

```
GOOGLE_INDEXING_SA_JSON=          # base64 or raw JSON of the service-account key
GSC_SITE_URL=sc-domain:uipirate.dev   # or https://uipirate.dev/
BING_WMT_API_KEY=
INDEXNOW_KEY=                      # random 32-hex; also written to public/<key>.txt
SITE_ORIGIN=https://uipirate.dev
```

Use `google-auth-library` for the SA → access-token exchange (JWT, cache token
~55 min). No extra Google client libs needed; call the REST endpoints with `fetch`.

---

## 4. Server code layout

```
lib/indexing/
  auth.ts            # getGoogleAccessToken() — JWT sign, in-memory token cache
  google.ts          # publishUrl(), inspectUrl() — thin REST wrappers + error mapping
  bing.ts            # submitUrls(), getUrlInfo()
  indexnow.ts        # ping(urls[])
  quota.ts           # reserve(provider, n) -> ok|false, usage(provider)
  publishable.ts     # isPublishable(urlOrPath): boolean  (draft + noindex guard)
  sync.ts            # reconcileSitemap() — sitemap.ts -> indexedUrls upserts
  repo.ts            # Mongo CRUD + history push (capped) for indexedUrls
  coverage.ts        # map raw API verdict -> {chipLabel, tone, actionable}

app/api/admin/indexing/
  route.ts                 # GET list (filters, pagination), used by the table
  [id]/route.ts            # GET one (full detail for the drawer)
  submit-google/route.ts   # POST { urls[] }  -> reserve quota, publish, record
  submit-bing/route.ts     # POST { urls[] }  -> Bing + IndexNow
  inspect/route.ts         # POST { urls[] }  -> URL Inspection, update coverage
  ping-sitemap/route.ts    # POST -> resubmit sitemap to GSC + Bing
  sync/route.ts            # POST -> reconcileSitemap()
  quota/route.ts           # GET  -> today's usage per provider (KPI row)
```

Every route: `requireCapability(req, "manage:indexing")`, then `isPublishable()`
filter on incoming URLs (reject drafts with a clear per-URL error in the response).

---

## 5. RBAC changes (`lib/auth/roles.ts`)

- Add capability `"manage:indexing"` to the `Capability` union.
- Grant to `website-admin` only (extend to `team-member` later if wanted).
- Add nav item:

```ts
{ label: "Indexing", href: "/admin/indexing", icon: "search", capability: "manage:indexing" }
```

- Add a `search` (or `radar`) glyph to `components/admin/icons.tsx`.

---

## 6. Admin UI

### 6.1 `/admin/indexing` — main list

- **KPI row** (`KpiRow`): Google indexed %, Bing indexed %, Not submitted, Errors,
  Google quota used today `x/200`, Inspection quota `x/2000`.
- **Filters**: engine (Google/Bing), status bucket
  (`Indexed`, `Crawled – not indexed`, `Discovered`, `Excluded`, `Never submitted`,
  `Error`), type, `in sitemap`, `drafts only`.
- **Table** (`DataTable`): URL · Type · In sitemap · Google chip · Bing chip ·
  Last checked · row menu.
- **Bulk bar** on selection: Submit to Google · Submit to Bing + IndexNow ·
  Re-check status · mark noindex-intentional. Buttons disable when quota exhausted
  (tooltip: "resets 00:00 PT, N queued").
- Draft rows: greyed, submit actions hidden, badge "Draft — held".

### 6.2 `/admin/indexing/[id]` — detail drawer

Pattern-match `app/admin/leads/LeadDrawer.tsx`.

- Header: URL, open-in-GSC and open-in-Bing external links, canonical.
- **Google panel**: verdict, coverageState, indexingState, robotsTxtState,
  last crawl, Google-picked canonical (highlight red if ≠ our canonical),
  mobile usability, referring URLs.
- **Bing panel**: indexed?, last crawl.
- **Actions**: Request indexing (Google) · Submit to Bing · Recheck now ·
  Toggle "noindex intentional".
- **History timeline** (reuse `JourneyTimeline` styling) from `history[]`.

### 6.3 `/admin/indexing/sitemap` — reconciliation

- Three-way diff: **in `sitemap.ts`** ∩ **tracked** ∩ **indexed (Google)**.
- Surfaces: "in sitemap, not indexed", "indexed, not in sitemap" (orphan),
  "tracked, dropped from sitemap".
- Button: Resubmit sitemap · Sync now.
- Draft URLs excluded from sitemap automatically (verify `app/sitemap.ts`
  filters on the same draft flag).

---

## 7. Automation

Use Vercel Cron (or `/schedule`) hitting internal routes with a shared secret.

| Job | Schedule | Action |
| --- | --- | --- |
| `sync` | hourly | reconcile `sitemap.ts` → `indexedUrls` (add new, mark removed) |
| `inspect` sweep | nightly 02:00 PT | URL Inspection for all live URLs, oldest `lastInspectedAt` first, until quota ~90%; write `status-change` events on diff |
| `drain queue` | nightly 03:00 PT | process `indexQueue` in quota order |
| weekly digest | Mon 09:00 | email/Slack: newly indexed, dropped, stuck in "Discovered/Crawled – not indexed" |

**Publish hook** (most important): when a case study / blog post is flipped from
draft → live (or created live), fire once:
`isPublishable` → `submit-google` + `indexnow` + `submit-bing` + upsert row.
Wire it wherever the content publish/mutation happens (server action or CMS webhook).

---

## 8. Coverage state → UI chip map (`coverage.ts`)

| Raw (Google) | Chip | Tone | Actionable |
| --- | --- | --- | --- |
| Submitted and indexed / URL is on Google | Indexed | success | no |
| Crawled – currently not indexed | Crawled, not indexed | warning | yes — thin/quality |
| Discovered – currently not indexed | Discovered | warning | yes — internal links / crawl budget |
| Duplicate, Google chose different canonical | Canonical mismatch | warning | yes — fix canonical |
| Duplicate without user-selected canonical | Duplicate | warning | yes |
| Excluded by 'noindex' tag | Noindex | default (danger if unintentional) | check intent |
| Blocked by robots.txt | Robots-blocked | danger | yes |
| Not found (404) / Soft 404 | 404 | danger | yes |
| Page with redirect | Redirect | default | maybe |
| — (never inspected) | Unknown | default | run inspect |

---

## 9. Quota & safety rules

- Reserve quota **before** the external call; on non-2xx, refund the unit.
- Hard stop bulk submit when today's reservation would exceed the limit —
  enqueue remainder, tell the user how many were queued.
- Rate limit: max ~1 Indexing call / 300ms, ~1 Inspection call / 200ms.
- De-dupe: ignore submit for a URL submitted to the same provider < 24h ago
  unless "force" is checked.
- All submit paths run `isPublishable()`; a draft URL returns
  `{ url, skipped: "draft" }` and is never sent.
- Copy in the UI: "Submitting asks Google to crawl sooner — it does not
  guarantee indexing."

---

## 10. Build order

1. **Data + guard**: collections, indexes, `publishable.ts`, `repo.ts`, `sync.ts`;
   seed `indexedUrls` from `app/sitemap.ts`. Add `/admin/indexing/sitemap` diff (read-only).
2. **RBAC + nav + empty page** with KPI row wired to a `quota` route stub.
3. **IndexNow** end-to-end (key file, `indexnow.ts`, `submit-bing` route, bulk button).
   Lowest effort, instant Bing/Yandex win.
4. **Google URL Inspection**: `auth.ts`, `google.ts#inspectUrl`, `inspect` route,
   coverage map, chips in the table, detail drawer.
5. **Google Indexing API**: `publishUrl`, `submit-google` route + bulk button,
   quota counters, overflow queue.
6. **Bing Webmaster API** submit + status (complements IndexNow with real index state).
7. **Cron**: sync, nightly inspect sweep, queue drain.
8. **Publish hook** from the content layer.
9. **Weekly digest** + regression alerts.

---

## 11. Open questions

- Where does the draft flag actually live for case studies (frontmatter, DB, config)?
  `publishable.ts` and `sitemap.ts` must read the same source.
- `GSC_SITE_URL`: domain property (`sc-domain:`) or URL-prefix? Affects Inspection calls.
- Digest delivery: email (which provider) or Slack webhook?
- Do we track non-canonical/duplicate URLs at all, or canonical-only?
