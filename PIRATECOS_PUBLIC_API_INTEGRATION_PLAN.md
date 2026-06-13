# PirateCOS — Public API & Website Integration Plan

> **Goal:** Let a tenant pull their published PirateCOS content into their own website, app, static-site generator, or automation tool (Zapier/Make/n8n) — through a stable, documented, secure **read-only** public API plus supporting developer tooling (docs, snippets, webhooks, embed). All content creation, editing, publishing, and deletion happens **inside the PirateCOS app only**. The public API is a consumption layer, not an authoring layer.

**Status:** In Progress — Phase A not yet started (data leak active)
**Owner:** _TBD_
**Last updated:** 2026-06-13 (audited against codebase)

---

## 1. Why this matters

PirateCOS is a headless-ish CMS: the canonical content entity is a single `Post` (`models/Post.ts`), tenant-isolated by `tenantId`. Today content is consumed two ways:

1. The built-in reader site (`/blogs/...`).
2. A nascent programmatic API under `/api/pirateCOS/v1/content`.

For PirateCOS to be a real "content OS," tenants must be able to **display** their published content **anywhere** — their marketing site, a Next.js/Astro/Hugo build, a mobile app, a Slack bot. That requires a **stable, versioned, documented, safe-by-default read-only public API** plus the developer experience around it.

> **Scope boundary:** The public API is a **read-only distribution layer**. Content is authored, edited, published, and deleted exclusively inside the PirateCOS app. There is no write scope, no create endpoint, no update endpoint, and no delete endpoint on the public API. This keeps the external surface minimal, safe, and easy to reason about.

---

## 2. What already exists (audit — verified 2026-06-13)

| Area | File(s) | State |
|------|---------|-------|
| API key model | `models/pirateCOS/ApiKey.ts` | ✅ tenantId, name, `keyHashEncrypted` (SHA-256 → AES-256-GCM), `keyPrefix`, `scopes: ["read"\|"write"]`, `lastUsedAt`, `expiresAt`, `isActive`. ❌ No `keyId` field, no `allowedOrigins`. Note: `"write"` scope is now unused — keys are read-only only |
| Key auth | `lib/pirateCOS/api-key-auth.ts` | 🔴 `ApiKey.find({ isActive: true })` — **no tenant filter, loads every key in the DB**, then decrypts each. O(n) full-collection scan per request. Timing-safe compare preserved |
| Key management API | `app/api/pirateCOS/integrations/keys/route.ts`, `.../keys/[id]/route.ts` | ✅ GET (list, hashes stripped), POST (create, raw key shown once), DELETE (revoke). ❌ No expiry param, no rotation, no per-key usage. Write scope option to be removed from POST |
| Key management UI | `app/pirateCOS/(authed)/settings/integrations/page.tsx` | ✅ Create/revoke, "shown once" modal, `lastUsedAt` displayed. ❌ No expiry selector, no usage counts, no docs/cURL quickstart. Write scope toggle to be removed |
| Public read API | `app/api/pirateCOS/v1/content/route.ts` (GET), `.../v1/content/[slug]/route.ts` (GET) | 🔴 Returns **raw `.lean()` Post docs with no field projection** — leaks `tenantId`, `owner.email`, `assignees[].email`, `aiWorkspaceSession` (full AI chat history), `approvalStatus`, `botViews`, `distributionRecords`. ✅ **Tenant isolation IS correctly implemented** — query uses `{ tenantId: tenantOid, published: true }` where `tenantOid` comes from the verified API key, never from the request. A key for Tenant A can only ever see Tenant A's posts. |
| Public write API | `app/api/pirateCOS/v1/content/route.ts` (POST) | 🗑️ **To be removed.** Authoring is app-only. The POST handler will be deleted |
| Built-in reader (`/blogs`, `/[slug]`) | `app/blogs/page.tsx`, `app/blogs/[slug]/page.tsx`, `app/[slug]/page.tsx`, `screens/blogs/`, `screens/blogsDetails/` | 🔴 Currently query `Post.find/findOne({ published: true })` with **no `tenantId`** — all tenants' content exposed. **Not deleted — will be updated in Phase 2** to call the secure v1 API using a server-side API key, replacing the direct DB queries. |
| Legacy public API (`/api/posts`) | `app/api/posts/route.ts`, `app/api/posts/[id]/route.ts` | 🔴 Unauthenticated, no tenant filter. **Not deleted — will be retired in Phase 2** once the readers are migrated to the v1 API. `screens/blogs/featuredBlogs` and `screens/blogsDetails/suggestedReads` also call this directly. |
| Rate limiter | `lib/pirateCOS/rate-limiter.ts` | ❌ In-memory sliding window, **hardcoded for login only** (IP+email, 5 req/15 min). Not wired to any v1 route. No `X-RateLimit-*` headers |
| CORS | — | ❌ No CORS handling anywhere on v1 routes. Browser `fetch()` from tenant sites will fail |
| Caching | — | ❌ No `Cache-Control`, `ETag`, or `304` support on any v1 route |
| Error model | — | ❌ Errors are plain strings, not machine-readable `{ code, message }` |
| Serializer | — | ❌ `lib/pirateCOS/public/serialize-post.ts` does not exist |
| Discovery endpoints | — | ❌ `/v1/tags`, `/v1/me`, `/v1/content/id/[id]` — none exist |
| `updatedSince`/`fields`/`sort` | — | ❌ Not implemented |
| Webhooks | — | ❌ `Webhook` model, delivery util, management API, and UI card — none exist |
| Embed snippet | — | ❌ No embeddable widget/script exists |
| OpenAPI / docs | — | ❌ No spec, no developer docs page, no code snippets |

**Bottom line:** Auth + key lifecycle + basic v1 read routes exist with correct tenant isolation. The public readers (`/blogs`, `/[slug]`) and legacy `/api/posts` API still exist with no tenant filter — these are left intentionally and will be migrated to use the v1 API in Phase 2. Remaining Phase 1 work: POST handler removal, serializer (v1 leaks internal fields), CORS, rate limiting, caching, error model, discovery endpoints, and developer docs. Phase 2 then rewires the readers to the secure v1 API and retires the legacy routes.

---

## 3. Critical problems to fix first (blockers)

### 3.1 🔴 The public API leaks internal data
Both v1 GET handlers return `Post` documents via `.lean()` **with no field projection**. That ships, to anyone with a read key:

- `tenantId`, `teamId`, `owner.email`, `assignees[].email` — **PII / internal org structure**
- `aiWorkspaceSession` (entire AI chat + generations history) — **large + sensitive**
- `approvalStatus`, `approvalRequestedBy`, `approvalReviewedBy`, `approvalNote` — internal workflow
- `botViews`, `duplicateViews`, raw analytics internals
- `distributionRecords` (external platform IDs/credentials-adjacent metadata)

**Fix (mandatory before any public launch):** introduce a single **public serializer** that whitelists fields. Never return a raw Mongo doc on a public route.

```ts
// lib/pirateCOS/public/serialize-post.ts
export interface PublicPost {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  content: string;            // HTML
  featuredImage?: string;
  bannerImage?: string;
  tags: string[];
  postType: string;
  author: { name: string };   // email intentionally omitted
  readTime?: number;
  views?: number;             // unique only — never bot/duplicate internals
  seo?: {                     // whitelist subset
    metaTitle?: string; metaDescription?: string; keywords?: string[];
    ogTitle?: string; ogDescription?: string; ogImage?: string;
    canonicalUrl?: string; noIndex?: boolean;
  };
  publishedAt?: string;
  updatedAt: string;
}
```
All v1 responses (list, detail, create) go through `serializePost()`. Add a unit test asserting the serialized object has **no** `tenantId`/`owner.email`/`aiWorkspaceSession`/`approval*` keys (regression guard).

### 3.2 🔴 Auth does not scale and has no rate limit
`verifyApiKey` loads **all active keys for all tenants** and loops. At 10k keys that's a full-collection scan + 10k decrypts per request.

**Fix:** Store a **lookup-safe key id** so we can find the candidate key in one indexed query, then timing-safe compare only that one.

- Key format: `uip_<keyId>_<secret>` — embed an indexed, non-secret `keyId` (e.g. 8–12 random chars) in the token.
- On verify: parse `keyId` → `ApiKey.findOne({ keyId, isActive: true })` (indexed) → timing-safe compare the SHA-256 of the full token against the stored hash → check `expiresAt`.
- Keep AES-256-GCM-at-rest for the hash (current security property preserved).
- Backward-compat: keep the legacy scan path for keys created before this change (or run a one-time migration to backfill `keyId`; old keys can simply be re-issued — see §9).
- Since there is no write scope, **all keys are read-only**. Remove the `"write"` enum value from the `ApiKey` schema and the scope check in the route.

Then wrap public endpoints in a **per-key rate limiter** (see §6).

### 3.3 🟠 No CORS story
Browser-side `fetch()` from a tenant's own site will be blocked. Since the API is read-only and all content is published (intentionally public), the correct policy is simple: **`Access-Control-Allow-Origin: *` on all read endpoints**. No per-key origin allowlist complexity needed.
Handle `OPTIONS` preflight in a shared `lib/pirateCOS/public/cors.ts` helper.

---

## 4. Use cases (what we are designing for)

1. **Static / framework site pull** — Next.js (ISR), Astro, Hugo, Gatsby build pulls published posts at build time and renders them. Needs: list + detail + `updatedSince` + webhooks to trigger rebuilds.
2. **Live render** — a CMS-backed page fetches a post by slug at request time. Needs: fast detail endpoint, CORS (wildcard ✅ — content is intentionally public), caching headers.
3. **Headless content feed** — JSON feed / RSS / sitemap consumed by aggregators or other tools.
4. **Embed** — a `<script>` snippet or iframe that a tenant drops into any HTML page to display their latest posts.
5. **Automation glue** — Zapier/Make/n8n: "when a post is published, do X (notify Slack, post to social, trigger build)." Needs: webhooks.

> ~~Programmatic authoring~~ — **Out of scope.** Create, edit, publish, and delete stay inside the PirateCOS app. There is no write API.

---

## 5. API design

### 5.1 Surface (v1)

Base path: `/api/pirateCOS/v1`. Auth: `Authorization: Bearer uip_<keyId>_<secret>`. All responses: `{ success, data, error?, pagination? }` (keep the existing envelope). **All endpoints are read-only (GET). No POST/PUT/PATCH/DELETE.**

| Method | Path | Purpose | Status |
|--------|------|---------|--------|
| GET | `/v1/content` | List published posts (paginated; filters: `tag`, `postType`, `updatedSince`, `fields`, `sort`) | ⚠️ exists — needs serializer, `updatedSince`/`fields`/`sort`, CORS, rate limit, error model |
| GET | `/v1/content/{slug}` | Single published post by slug | ⚠️ exists — needs serializer, ETag, CORS, rate limit, error model |
| GET | `/v1/content/id/{id}` | Single published post by MongoDB id (stable permalink) | ❌ not built |
| GET | `/v1/tags` | Distinct tags + counts for the tenant | ❌ not built |
| GET | `/v1/feed.json` | JSON Feed 1.1 of recent published posts | ❌ not built (optional) |
| GET | `/v1/sitemap.xml` | Sitemap of published slugs | ❌ not built (optional) |
| GET | `/v1/me` | Echo tenant id, key name, rate-limit headers (debugging) | ❌ not built |

> ~~POST/PUT/PATCH/DELETE~~ — **Removed from scope.** All authoring is done inside the PirateCOS app.
>
> Keep `postType: "blog"` and all enum values intact — they are content classifications, not the "blog vs post" naming issue handled separately.

### 5.2 Query parameters (list)
- `page` (≥1, default 1), `limit` (1–100, default 10) — ✅ implemented.
- `tag`, `postType` — ✅ implemented.
- `updatedSince=<ISO8601>` — ❌ not built. Critical for incremental static builds (only fetch what changed).
- `fields=slug,title,excerpt` — ❌ not built. Response shaping to cut payload (esp. omit heavy `content` in list views). Default list response should **exclude `content`** and require detail fetch or `fields=content` opt-in.
- `sort=publishedAt|-publishedAt|updatedAt` — ❌ not built. Default `-publishedAt` (currently hardcoded but not parameterised).

### 5.3 Caching & conditional requests ❌ not built
- Send `Cache-Control` (e.g. `public, max-age=60, stale-while-revalidate=300`) on read endpoints.
- Support `ETag` (hash of `updatedAt`+id) and `If-None-Match` → `304 Not Modified` on detail endpoint. Big win for live-render use case.

### 5.4 CORS policy ❌ not built
Since there is no write API and all served content is intentionally published (public), CORS policy is simple:

- **All v1 endpoints:** `Access-Control-Allow-Origin: *` — tenants can call this from their marketing site, Astro/Next.js, or any browser context with no restriction.
- Handle `OPTIONS` preflight in a shared `lib/pirateCOS/public/cors.ts` helper applied to all v1 routes.
- No per-key origin allowlist needed (write key risk is eliminated; content is public by design).

### 5.5 Error model ❌ not built — current errors are plain strings
Stable machine-readable codes so SDK/consumers can branch:
```json
{ "success": false, "error": { "code": "rate_limited", "message": "..." } }
```
Codes: `unauthorized`, `not_found`, `rate_limited`, `internal_error`. (Migrate existing string errors into this shape; keep top-level `success`.) ~~`forbidden_scope`, `validation_error`, `slug_conflict`~~ — removed, write surface eliminated.

---

## 6. Rate limiting ❌ not applied to v1 API

Current state: `lib/pirateCOS/rate-limiter.ts` is a login-only, in-memory, IP+email sliding window (5 req / 15 min). It is not wired to any v1 route. No `X-RateLimit-*` headers exist anywhere.

- **Per key**, sliding window. Generalise `lib/pirateCOS/rate-limiter.ts` or add a separate `lib/pirateCOS/api-rate-limiter.ts` keyed by `apiKeyId`.
- ⚠️ In-memory won't work across serverless instances / multiple regions. For production correctness use a shared store:
  - **Recommended:** Redis (Upstash) token-bucket, or a Mongo TTL-collection counter if avoiding new infra.
  - Keyed by `apiKeyId` (not IP — keys are the unit of trust).
- Default limit (tunable per tier): `120 req/min` per key. ~~write `30 req/min`~~ — no write surface.
- Always return headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`, and `Retry-After` on `429`.

---

## 7. Webhooks (event push) — for rebuild/automation ❌ not built

Static sites and automations need to react to changes without polling. Nothing in this section exists yet.

- **New model** `models/pirateCOS/Webhook.ts`: `tenantId`, `url`, `events: ["post.published","post.updated","post.unpublished","post.deleted"]`, `secret` (for HMAC signing), `isActive`, `lastDeliveryAt`, `failureCount`.
- **Delivery util** `lib/pirateCOS/webhooks/deliver.ts`: on the relevant Post mutation (publish/update/delete in both the authed routes and the v1 write routes), POST to each matching webhook with body `{ event, post: PublicPost, deliveredAt }` and header `X-PirateCOS-Signature: sha256=<hmac(secret, body)>`.
- **Management API** `app/api/pirateCOS/integrations/webhooks/route.ts` (+ `[id]`): CRUD for webhooks.
- **Reliability:** fire-and-forget with retry/backoff; track `failureCount`, auto-disable after N consecutive failures. (For v1, a best-effort async send is acceptable; note the limitation.)
- **UI:** add a "Webhooks" card to the integrations settings page (create/test/delete, show last delivery + signing secret once).
- **Common recipe to document:** point the webhook at a Vercel/Netlify Deploy Hook or a Next.js `revalidatePath` route → static site rebuilds on publish.

---

## 8. Developer experience (the part that makes it usable) ❌ none of this exists yet

1. **OpenAPI 3.1 spec** ❌ — author `docs/pirateCOS/openapi.yaml` describing all v1 read endpoints, auth, schemas (`PublicPost`, error model). Single source of truth.
2. **Public docs page** ❌ — `/pirateCOS/developers` rendering: auth quickstart, endpoint reference, rate limits, error codes, webhook guide, embed snippet.
3. **Copy-paste snippets** ❌ — cURL, JS `fetch`, Node, Python, plus a **Next.js ISR example** and an **Astro content collection example** (the highest-value integrations).
4. **Embed snippet** ❌ — a `<script>` tag + small vanilla-JS widget tenants can drop into any HTML page to render their latest published posts without writing code. Configured via `data-` attributes (key, postType, limit).
5. **(Optional) Tiny JS SDK** ❌ — `@uipirate/cos-client`: thin typed wrapper (`client.content.list()`, `.get(slug)`), handles auth header + base URL + typed `PublicPost`. Nice-to-have, post-v1.
6. **In-app onboarding** ❌ — on the integrations page, after key creation show a "Use your key" panel with the base URL + a ready-to-run cURL pre-filled (key shown once). Modal currently shows raw key only with no usage context.

---

## 9. API key management enhancements

- **Read-only keys only** ❌ — remove `"write"` scope from the `ApiKey` schema enum, from the POST route, and from the UI. All keys are implicitly read-only. Remove the write scope checkbox from the create modal.
- **Expiry UI** ❌ — model already has `expiresAt` and auth already rejects expired keys; UI does not expose a selector. Add "Expires in 30/90/365 days / never" dropdown at creation.
- **`keyId` for fast lookup** ❌ — see §3.2; `ApiKey` model has no `keyId` field. Add indexed `keyId`, embed in token, migrate.
- **Per-key usage** ⚠️ — `lastUsedAt` already shown in UI. Request counts (from rate-limiter store or a lightweight `ApiKeyUsage` daily counter) not yet available.
- **Rotation** ❌ — no rotate action exists. Add: issue new secret, keep name, short grace window for old one.
- **Label update** ❌ — UI currently says "Read published blog list & detail". Update to "Read published content (list, detail, tags, feed)".

---

## 10. Security checklist

- [ ] 🟠 **`/blogs` reader + `/api/posts` have no tenant filter** — intentionally left in place. Will be updated in **Phase 2** to call the v1 API using a server-side API key. Until then these routes are an isolation risk but are being addressed in the planned sequence.
- [x] ✅ Public serializer whitelist (no PII / internal fields on v1 API) — §3.1, with regression test. **DONE.**
- [x] ✅ Remove POST handler from `v1/content/route.ts` — write surface must not exist. **DONE.**
- [x] ✅ Remove `"write"` scope from `ApiKey` schema, POST route, and UI. **DONE.**
- [x] ✅ Rate limiting active on all v1 read endpoints (per key). **DONE (in-memory; see §6 caveat).**
- [x] ✅ `keyId` fast-lookup: auth O(n) full-table scan eliminated for new keys (legacy keys fall back). **DONE.**
- [x] ✅ v1 API tenant isolation correct — query uses `{ tenantId: tenantOid, published: true }` where `tenantOid` is from the verified API key. Key for Tenant A cannot see Tenant B's posts.
- [x] ✅ Timing-safe key comparison — `timingSafeEqual` used in `verifyApiKey`.
- [x] ✅ CORS (`Access-Control-Allow-Origin: *`) on all v1 read endpoints. **DONE.**
- [ ] 🟡 Webhook payloads HMAC-signed; secret shown once. **NOT DONE (webhooks not built).**
- [ ] 🟡 Re-run `PIRATECOS_SECURITY_AUDIT.md` items against the new v1 surface.

---

## 11. Data model changes

| Model | Change | Built? | Migration? |
|-------|--------|--------|-----------|
| `ApiKey` | Add `keyId: string` (indexed, unique). Remove `"write"` from `scopes` enum (simplify to always read-only). Remove `allowedOrigins` — not needed with wildcard CORS. | ❌ | Backfill `keyId` for existing keys OR force re-issue. Existing `"write"` scope keys: nullify scope or treat as read-only on next verify. |
| New `Webhook` | New collection | ❌ | None (additive). |
| New `ApiKeyUsage` (optional) | Daily per-key request counters | ❌ | None (additive). |
| `Post` | **No schema change.** Public exposure handled at serialization layer. | ✅ n/a | **None.** |

> This feature adds **no breaking DB migration** to `Post`. Only additive collections + an `ApiKey` field backfill.

---

## 12. Testing

Current test coverage for the v1 API surface: **zero**. One test exists for `ai-context-builder` under `__tests__/lib/pirateCOS/`.

- **Unit (needed):** `serializePost()` whitelist (assert `tenantId`/`owner.email`/`aiWorkspaceSession`/`approval*` keys absent); `keyId` parse/verify; rate-limiter window math; HMAC signature.
- **Integration (needed — route-level):** auth (missing/invalid/expired/wrong-scope), tenant isolation (key A cannot read tenant B), pagination/filter correctness, `updatedSince`, 304/ETag, slug conflict, validation errors, CORS preflight.
- **Webhook (needed):** delivery on publish, signature verification, retry/disable on failure.
- **Manual smoke:** create read+write keys in UI → cURL list/detail/create/publish → confirm a Next.js ISR example renders → trigger a webhook to a test endpoint.

---

## 13. Phased rollout

### Phase 1 — Build the secure v1 API + developer docs ✅ COMPLETE

The public readers (`/blogs`, `/[slug]`) and legacy `/api/posts` are left as-is during this phase. Phase 1 focuses entirely on making the v1 API production-ready and documented.

**1A — Make v1 API safe (blocker)** ✅
- [x] Deleted POST handler from `app/api/pirateCOS/v1/content/route.ts` (no write surface)
- [x] Removed `"write"` scope from `ApiKey` schema, key creation API, and UI
- [x] `lib/pirateCOS/public/serialize-post.ts` + `PublicPost` interface (whitelist safe fields only)
- [x] Wired serializer into both v1 GET handlers (list + detail)
- [x] Standardised error model `{ code, message }` via `lib/pirateCOS/public/response.ts` across all v1 routes (§5.5)
- [x] Unit test (`__tests__/lib/pirateCOS/serialize-post.test.ts`): asserts `tenantId` / `owner.email` / `aiWorkspaceSession` / `approval*` absent

**1B — Scale & protect v1 API** ✅
- [x] `keyId` field on `ApiKey` + fast-lookup in `verifyApiKey` — indexed `findOne`, legacy keys fall back to scan (§3.2)
- [x] Per-key rate limiting (`lib/pirateCOS/api-rate-limiter.ts`) on all `/v1/*` routes + `X-RateLimit-*` headers (§6)
- [x] `lib/pirateCOS/public/cors.ts` + `Access-Control-Allow-Origin: *` + `OPTIONS` on all v1 routes (§5.4)
- [x] `Cache-Control` + ETag / `304` on detail + id endpoints (§5.3)

**1C — Complete read surface** ✅
- [x] GET `/v1/content/id/[id]` — stable id-based permalink
- [x] `updatedSince`, `fields`, `sort` query params; default list excludes `content` field
- [x] GET `/v1/tags` — distinct tags + counts
- [x] GET `/v1/me` — key info + rate-limit echo

**1D — Developer docs page** ✅
- [x] In-app developer docs page (`/pirateCOS/developers`): auth quickstart, endpoint reference, rate limits, error codes, cURL + JS + Node + Python + Next.js ISR + Astro examples
- [x] "Use your key" cURL quickstart panel shown after key creation in integrations settings
- [x] Key expiry selector (30/90/365/never), label copy update, rotation UI (§9)

> Note: the per-key rate limiter is in-memory (single-instance correct only). Swap to a shared store (Upstash/Mongo TTL) before multi-instance production — see §6 and the comment in `api-rate-limiter.ts`. OpenAPI spec, JSON feed/sitemap, embed widget, and webhooks remain deferred (Phase 2 / optional Phase E).

---

### Phase 2 — Update internal readers to use the v1 API 🟢 2A + 2B COMPLETE · 2C deferred

Once the v1 API is safe, rate-limited, and documented, migrate the existing public readers away from direct DB queries and the legacy `/api/posts` route.

**2A — Migrate readers to v1 API** ✅
- [x] New server-side client `lib/pirateCOS/public-client.ts` (`listPosts`, `getPostBySlug`, `listPostSlugs`) reading `PIRATECOS_API_KEY` / `PIRATECOS_API_BASE_URL`; tolerant adapter maps the v1 shape to the readers' legacy `ReaderPost` shape (works against both old and serialized API responses during rollout).
- [x] `app/blogs/page.tsx` server-fetches the list and passes `initialBlogs` → `screens/blogs/index.tsx` → `screens/blogs/featuredBlogs/index.tsx` (now presentational; no client `fetch`).
- [x] `app/blogs/[slug]/page.tsx` — metadata, `generateStaticParams`, and page body use the v1 client instead of `Post.findOne`/`Post.find`.
- [x] `app/[slug]/page.tsx` — same migration for the root catch-all reader.
- [x] `screens/blogsDetails/suggestedReads/index.tsx` — now presentational; suggested posts are server-fetched in the page and passed via `BlogsDetails`.
- [x] The read key is server-side only (no `NEXT_PUBLIC_` prefix); added to `.env` (gitignored) and documented in `.env.example`.

**2B — Retire legacy routes** ✅
- [x] Deleted `app/api/posts/route.ts` and `app/api/posts/[id]/route.ts` — confirmed no remaining callers.

**2C — Webhooks** ❌ DEFERRED (not part of the website migration)
- `models/pirateCOS/Webhook.ts` + `lib/pirateCOS/webhooks/deliver.ts`
- Trigger on publish/unpublish inside app post routes (not via public API)
- `/api/pirateCOS/integrations/webhooks` management API + UI card (§7)

> **Deploy ordering:** Phase 1 (the serializer + tenant-scoped v1 API) must be live on `cos.uipirate.com` before/with this change. The reader adapter tolerates the pre-Phase-1 raw-doc shape, but only the deployed Phase-1 API actually enforces tenant isolation — until it ships, the public site still shows whatever the API returns.

---

Phase 1 must be complete before Phase 2 begins — the readers must migrate to a stable, safe API, not the current leaky one.

---

## 14. Open questions (need product decisions)

1. **Rate-limit infra** — acceptable to add Redis/Upstash, or must we stay Mongo-only (TTL counters)?
2. **Tiering** — are rate limits / webhook counts gated by billing plan? (`billing/usage` already exists.)
3. **Public docs location** — in-app `/pirateCOS/developers` vs marketing-site `/docs/api`?
4. **SDK scope** — ship a JS SDK in v1, or snippets-only and SDK later?
5. **Legacy keys** — backfill `keyId` for existing keys or force re-issue on next rotation?
6. **Existing write-scope keys** — treat as read-only going forward, or revoke and require re-issue?
7. **Embed widget hosting** — serve embed script from the same Next.js app (`/api/pirateCOS/v1/embed.js`) or a separate CDN-hosted bundle?

~~Delete semantics~~ — removed (no delete via API).
~~CORS per-key origin allowlist~~ — removed (wildcard is correct for a read-only public content API).

---

## 15. Affected / new files (map)

**Migrate in Phase 2** (exist today, direct DB queries / legacy API — will be rewired to v1 API)
- `app/blogs/page.tsx` — replace direct DB query with v1 API + server-side key
- `app/blogs/[slug]/page.tsx` — replace `Post.findOne` with v1 API call
- `app/[slug]/page.tsx` — same as above for root catch-all
- `screens/blogs/featuredBlogs/index.tsx` — replace `fetch('/api/posts')` with v1 API call
- `screens/blogsDetails/suggestedReads/index.tsx` — replace `fetch('/api/posts')` with v1 API call
- `app/api/posts/route.ts`, `app/api/posts/[id]/route.ts` — **delete** once readers are fully migrated off them

**Modify in Phase 1** (files confirmed to exist in codebase)
- `app/api/pirateCOS/v1/content/route.ts` — **delete POST handler**, wire serializer into GET, add `updatedSince`/`fields`/`sort`, error model, CORS, rate limit (**Phase A/B**)
- `app/api/pirateCOS/v1/content/[slug]/route.ts` — wire serializer, ETag/304, CORS, rate limit, error model (**Phase A/B**)
- `lib/pirateCOS/api-key-auth.ts` — `keyId` fast lookup (replace full-scan `find`) (**Phase B**)
- `app/api/pirateCOS/integrations/keys/route.ts` — remove write scope option, add expiry param, embed `keyId` in generated token (**Phase A/B**)
- `app/api/pirateCOS/integrations/keys/[id]/route.ts` — add rotation endpoint (**Phase E**)
- `app/pirateCOS/(authed)/settings/integrations/page.tsx` — remove write scope toggle, expiry selector, usage stats, webhooks card, label update, cURL quickstart panel (**Phase A + E**)
- `lib/pirateCOS/rate-limiter.ts` — generalise or extract per-key API rate limiter (**Phase B**)
- `models/pirateCOS/ApiKey.ts` — add `keyId: string` (indexed, unique); remove `"write"` from scopes enum (**Phase A/B**)

**New** (none of these exist yet)
- `lib/pirateCOS/public/serialize-post.ts` — `PublicPost` interface + `serializePost()` whitelist function (**Phase A**)
- `__tests__/lib/pirateCOS/serialize-post.test.ts` — regression guard asserting forbidden fields absent (**Phase A**)
- `lib/pirateCOS/public/cors.ts` — CORS + OPTIONS preflight helper (**Phase B**)
- `app/api/pirateCOS/v1/content/id/[id]/route.ts` — GET by MongoDB id (**Phase C**)
- `app/api/pirateCOS/v1/tags/route.ts` — distinct tags + counts (**Phase C**)
- `app/api/pirateCOS/v1/me/route.ts` — key info + rate-limit echo (**Phase C**)
- `app/api/pirateCOS/v1/feed.json/route.ts` — JSON Feed 1.1 (optional, **Phase E**)
- `app/api/pirateCOS/v1/sitemap.xml/route.ts` — sitemap (optional, **Phase E**)
- `models/pirateCOS/Webhook.ts` — Webhook schema (**Phase D**)
- `lib/pirateCOS/webhooks/deliver.ts` — HMAC-signed delivery + retry logic (**Phase D**)
- `app/api/pirateCOS/integrations/webhooks/route.ts` (+ `[id]/route.ts`) — webhook CRUD API (**Phase D**)
- `docs/pirateCOS/openapi.yaml` — OpenAPI 3.1 spec (**Phase E**)
- `public/embed.js` or `app/api/pirateCOS/v1/embed.js/route.ts` — embed widget (**Phase E**)
- (optional) `packages/cos-client/` — typed JS SDK (**Phase E**)
