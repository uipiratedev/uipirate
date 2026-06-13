# 🔒 pirateCOS Security Audit

> **Audit date:** June 12, 2026
> **Scope:** Full pirateCOS codebase — auth layer, all `app/api/pirateCOS/*` routes, encryption, billing, public v1 API, uploads, teams.
> **Context:** Pre-Phase 7.1 baseline. Several findings are *resolved by* the Phase 7.1 plan (`PIRATECOS_ROLES_ACCOUNTS_ACCESS_PLAN.md`); they are cross-referenced below.

---

## Fix Status (as of June 12, 2026 — Security Hardening Pass Complete)

| ID | Finding | Status |
|---|---|---|
| C1 | IDOR: version restore writes to any tenant's post | ✅ **FIXED** — `ContentHistory.findOne({ postId, version, tenantId })` + `Post.findOneAndUpdate({ _id, tenantId })` in `version-tracker.ts` |
| C2 | IDOR: version history readable across tenants | ✅ **FIXED** — `ContentHistory.find({ postId, tenantId })` filter added to `getVersionHistory()` |
| C3 | Forgeable JWTs via hardcoded secret fallback | ✅ **FIXED** — `auth.ts` has fail-fast; `org/convert/route.ts` fixed in hardening batch |
| C4 | Stripe webhook signature verification bypass | ✅ **FIXED** — bypass path removed; always returns 503 without valid secret |
| C5 | Shared "UI Pirate" workspace breaks tenant isolation for Teams | 🔵 **Phase 7.1** — Workspace gains `tenantId` in Phase 7.1 |
| H1 | Regex injection / ReDoS in posts search | ✅ **FIXED** — `escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")` in `posts/route.ts` |
| H2 | No rate limiting on login | ✅ **FIXED** — `checkRateLimit(ip, email)` enforced in `auth/login/route.ts`; 429 on threshold |
| H3 | JWT also returned in response body | ✅ **FIXED** — `token` removed from both `login/route.ts` and `register/route.ts` response bodies |
| H4 | Unrestricted file upload (no MIME/size/folder) | ✅ **FIXED** — MIME allowlist (9 types), 10MB cap, `pirateCOS/${tenantId}` folder in `media/upload/route.ts` |
| H5 | Free Pro upgrade via checkout simulation fallback | ✅ **FIXED** — simulation gated behind `NODE_ENV !== "production"` guard in `billing/checkout/route.ts` |
| H6 | Internal error messages leaked to clients | ✅ **FIXED** — 28 instances across 21 files replaced with generic messages; final 2 in `prompts/route.ts` fixed June 12. Follow-up June 13: BYOK provider quota/credit errors (previously swallowed by the generic catch) now surfaced with actionable billing links — 12 throws replaced with direct returns in `generate`, `workspace`, `repurpose` routes; per-provider billing URLs and Anthropic credit exhaustion detection added to `ai-error-parser.ts` |
| M1 | Weak password policy (6-char minimum) | ✅ **FIXED** — 8-char minimum + common-password blocklist in `register/route.ts` and `profile/route.ts` |
| M2 | Login JWT payload missing `accountType`/`orgRole` | 🔵 **Phase 7.1** — JWT payload alignment deferred to Phase 7.1 role/account redesign |
| M3 | 30-day JWT with no revocation list | 🟡 **Mitigated** — per-request DB `isActive` check provides effective revocation |
| M4 | `http://` hardcoded in billing redirect URLs | ✅ **FIXED** — protocol switches to `https` in production; Host header validated against allowlist |
| M5 | PII in server logs (emails, credit balances) | ❌ **OPEN** — low urgency; adopt structured logger (see L4 plan) |
| M6 | Overly strict email regex in `Admin.ts` | ❌ **OPEN** — low urgency; TLD restriction rejects valid addresses like `.agency` |
| L1 | `verifyApiKey` O(n) scan on every request | ❌ **OPEN** — performance concern at scale; store indexed SHA-256 hash |
| L2 | No CSRF tokens | 🟡 **Mitigated** — `sameSite: lax` cookie policy blocks cross-site POSTs |
| L3 | `role` enum enforced nowhere server-side | 🔵 **Phase 7.1** supersedes this via `orgRole` + `require-role.ts` |
| L4 | No `expiresAt` on API keys | ❌ **OPEN** — TTL check exists in `api-key-auth.ts` but keys created without expiry |

---

## Severity Summary

| Severity | Count | Fixed | Deferred/Mitigated | Open |
|---|---|---|---|---|
| 🔴 Critical | 5 | 4 (C1–C4) | 1 (C5 → Phase 7.1) | 0 |
| 🟠 High | 6 | 6 (H1–H6) | 0 | 0 |
| 🟡 Medium | 6 | 3 (M1, M4, M3-mitigated) | 1 (M2 → Phase 7.1) | 2 (M5, M6) |
| 🟢 Low / Info | 4 | 0 | 2 (L2-mitigated, L3 → Phase 7.1) | 2 (L1, L4) |

**All Critical and High findings are resolved.** Remaining open items (M5, M6, L1, L4) are low-urgency quality improvements.

**Fix before anything else:** C1, C2 (active cross-tenant read/write — 2 query-filter changes, ~30 min).

---

## 🔴 Critical Findings

### C1 — IDOR: Version restore writes to any tenant's post

**Files:** `lib/pirateCOS/version-tracker.ts` (`restoreVersion`), `app/api/pirateCOS/content-history/restore/route.ts`

`restoreVersion()` receives `tenantId` but never uses it as a query filter:

- `ContentHistory.findOne({ postId, version })` — no `tenantId` filter
- `Post.findByIdAndUpdate(postId, …)` — no `tenantId` filter

**Impact:** Any authenticated user can overwrite **any other tenant's post content** by guessing/obtaining a `postId` and POSTing to `/api/pirateCOS/content-history/restore`. This is both a data-leak (the restored snapshot is returned in the response) and a data-tamper vector.

**Fix:**
```typescript
// version-tracker.ts — restoreVersion()
const tenantOid = new mongoose.Types.ObjectId(tenantId);
const versionToRestore = await ContentHistory.findOne({ postId, version, tenantId: tenantOid });
// ...
const post = await Post.findOneAndUpdate(
  { _id: postId, tenantId: tenantOid },   // was: findByIdAndUpdate(postId, …)
  { ... },
  { new: true },
);
if (!post) throw new Error("Post not found");
```

---

### C2 — IDOR: Version history readable across tenants

**Files:** `lib/pirateCOS/version-tracker.ts` (`getVersionHistory`), `app/api/pirateCOS/content-history/[postId]/route.ts`

`getVersionHistory(postId, limit)` queries `ContentHistory.find({ postId })` with **no tenant filter**, and the route passes the raw `postId` from the URL without verifying ownership.

**Impact:** Any authenticated user can read the **full revision history (complete content snapshots + diffs)** of any post in the database, including drafts and unpublished content of other tenants.

**Fix:** Add a `tenantId` parameter to `getVersionHistory()` and filter on it; update the route to pass `user.tenantId`. Same pattern as C1.

---

### C3 — Forgeable JWTs via hardcoded secret fallback

**Files:** `lib/pirateCOS/auth.ts`, `app/api/pirateCOS/auth/login/route.ts`, `app/api/pirateCOS/auth/register/route.ts`

```typescript
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";
```

**Impact:** If `JWT_SECRET` is ever unset (fresh deploy, CI, misconfigured env), every token in the system is signed with a **publicly known string**. An attacker can mint a valid token for any `userId`/`tenantId` and take over any account.

**Fix:** Fail closed — throw at module load if the env var is missing (same pattern already used correctly by `encrypt.ts` for `AI_ENCRYPTION_KEY`):
```typescript
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET is not set");
```
Apply in all three files (or centralise in one shared constant).

---

### C4 — Stripe webhook signature verification bypass

**File:** `app/api/pirateCOS/billing/webhooks/route.ts`

When `STRIPE_WEBHOOK_SECRET` is unset, the route logs a warning and **parses the raw body as a trusted event**:
```typescript
} else {
  event = JSON.parse(bodyText); // unverified!
}
```

**Impact:** Anyone can POST a forged `checkout.session.completed` event with an arbitrary `metadata.tenantId` and grant themselves a **Pro subscription or unlimited credit top-ups for free**.

**Fix:** Remove the fallback in production — return `503` if `STRIPE_WEBHOOK_SECRET` is missing. If sandbox emulation is needed, gate it behind `process.env.NODE_ENV !== "production"` **and** an explicit `ALLOW_UNVERIFIED_WEBHOOKS=true` flag.

---

### C5 — Shared global "UI Pirate" workspace breaks tenant isolation for Teams

**Files:** `app/api/pirateCOS/teams/route.ts`, `app/api/pirateCOS/teams/[id]/route.ts`

`Workspace.findOne({ name: "UI Pirate" })` returns the **same workspace for every user** in the system. All tenants see and share the same team list. PATCH/DELETE check `workspace.owner !== user.email`, which means only the single user whose email happens to be the workspace `owner` can modify teams — everyone else gets 403, but **everyone can read and create** teams in the shared space.

**Impact:** Cross-tenant data visibility (team names, member emails) and the ability to pollute another organisation's team list.

**Fix:** This is the known Phase 7.1 item — `Workspace` gains a `tenantId` and all queries become `Workspace.findOne({ tenantId })`. Until 7.1 ships, the Teams API should be treated as single-org-only. Covered by §5 of `PIRATECOS_ROLES_ACCOUNTS_ACCESS_PLAN.md`.

---

## 🟠 High Findings

### H1 — Regex injection / ReDoS in posts search

**File:** `app/api/pirateCOS/posts/route.ts` (GET)

```typescript
const searchRegex = new RegExp(search.trim(), "i"); // raw user input
```

**Impact:** Malformed patterns throw 500s; crafted patterns like `(a+)+$` cause catastrophic backtracking (ReDoS), pinning the MongoDB server CPU. Scoped to the requester's tenant, so no data leak — but a denial-of-service vector.

**Fix:** Escape before constructing:
```typescript
const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const searchRegex = new RegExp(escaped, "i");
```

### H2 — No rate limiting on login (or anywhere)

**File:** `app/api/pirateCOS/auth/login/route.ts`

No throttling, lockout, or CAPTCHA on credential attempts. Combined with the 6-character password minimum (M1), online brute force is practical.

**Fix:** Add per-IP + per-email rate limiting (e.g., 5 attempts / 15 min sliding window). A lightweight in-memory limiter is acceptable for a single instance; use Redis when scaling.

### H3 — JWT also returned in the response body

**Files:** `login/route.ts`, `register/route.ts` — `return NextResponse.json({ …, token })`

The `httpOnly` cookie is the correct channel. Returning `token` in JSON invites client-side storage (localStorage), making it stealable via any XSS. Nothing in the frontend actually consumes it.

**Fix:** Remove `token` from both response bodies.

### H4 — Unrestricted file upload

**File:** `app/api/pirateCOS/media/upload/route.ts`

No MIME-type allowlist, no size limit, no tenant-scoped folder. Any authenticated user can upload arbitrary files of arbitrary size to the shared `pirateCOS` Cloudinary folder.

**Fix:** Validate `file.type` against an image/video allowlist, reject `file.size > 10MB`, and upload into `pirateCOS/${user.tenantId}` so assets are attributable and cleanable per tenant.

### H5 — Free Pro upgrade via checkout simulation fallback

**File:** `app/api/pirateCOS/billing/checkout/route.ts`

When `STRIPE_SECRET_KEY` is unset, the route **immediately writes** `plan = "pro"` + credits to the caller's Admin record. Same class of problem as C4: a config gap silently becomes a free-money path.

**Fix:** Gate the simulation behind `NODE_ENV !== "production"`.

### H6 — Internal error messages leaked to clients ✅ FIXED

**Files:** 21 files across `app/api/pirateCOS/` — all `error.message` leakage at catch boundaries.

Raw `error.message` can reveal DB structure, ObjectIds, and stack context (e.g., `Version 3 not found for post 64ab…`).

**Fix applied (June 12, 2026):** 28 instances across 21 route files replaced with generic messages. Full error is logged server-side via `console.error`; only the generic string is returned to the client. Final 2 instances in `prompts/route.ts` (inner catch status 400 and outer catch status 500) resolved last.

**Follow-up fix (June 13, 2026):** The H6 generic outer catch inadvertently swallowed provider-specific error messages produced by `parseAIError` — BYOK users saw "AI Generation failed" instead of actionable quota/billing guidance. Fixed by replacing all 12 `throw new Error(parseAIError(...))` calls in `ai/generate/route.ts`, `ai/workspace/route.ts`, and `posts/[id]/repurpose/route.ts` with direct `return NextResponse.json(...)`, so provider errors bypass the outer catch entirely. Also fixed: incorrect billing URLs for Grok/OpenRouter/Mistral in `ai-error-parser.ts`, and added explicit Anthropic credit exhaustion detection (HTTP 400 + `invalid_request_error` with "credit balance" message).

---

## 🟡 Medium Findings

### M1 — Weak password policy
6-character minimum (`register`, `profile` password change, Admin schema). **Fix:** Raise to 8+ and check against common-password lists. Align all three places.

### M2 — Login JWT payload missing `accountType` / `orgRole`
`login/route.ts` signs only `userId/email/role/tenantId/plan`; `register/route.ts` signs the full Phase 7.1 payload. Currently harmless because `getCurrentUser()` re-reads everything from the DB, but the inconsistency will bite when any code trusts the raw payload. **Fix:** Make login sign the identical payload shape as register.

### M3 — 30-day JWT with no revocation list
Tokens stay valid for 30 days. Mitigated by the per-request DB check (`isActive`), which effectively allows kill-switching a user — good. Residual risk: a stolen token works until expiry as long as the account is active. **Fix (optional):** Add a `tokenVersion` field bumped on password change.

### M4 — `http://` hardcoded in billing redirect URLs
`billing/portal/route.ts` and `checkout/route.ts` build `http://${host}` from the Host header. In production this downgrades to plaintext and trusts a spoofable header. **Fix:** Use `https://` in production and validate `host` against an allowlist (`cos.uipirate.com`, `uipirate.com`).

### M5 — PII in server logs
Webhook + usage-guard log emails, credit balances, tenant IDs (`console.log`). **Fix:** Log tenant IDs only; drop emails and balances.

### M6 — Overly strict email regex
`Admin.ts` uses `\.\w{2,3}` for TLD — rejects `.info`, `.agency`, `.design`, etc. **Fix:** Use a simpler permissive pattern (`/^\S+@\S+\.\S+$/`) and rely on verification emails for correctness.

---

## 🟢 Low / Informational

| ID | Finding | Note |
|---|---|---|
| L1 | `verifyApiKey` scans + decrypts **all** active API keys per request (O(n)) | Works now; becomes a latency problem at scale. Store an indexed SHA-256 hash (hashes don't need encryption) for O(1) lookup. |
| L2 | No CSRF tokens | `sameSite: "lax"` cookies mitigate cross-site POSTs from foreign origins for now. Revisit if cookie policy changes. |
| L3 | `role: "admin" \| "super-admin"` enum is enforced nowhere server-side | Superseded by Phase 7.1 `orgRole` + `require-role.ts`. |
| L4 | No `expiresAt` ever set when creating API keys | The expiry check in `api-key-auth.ts` exists but keys are immortal by default. Add optional TTL in the creation UI. |

---

## ✅ Verified Safe (positive findings)

- **Encryption (`encrypt.ts`):** AES-256-GCM with random 96-bit IV, auth tag verified, fails closed when `AI_ENCRYPTION_KEY` missing. Correct.
- **AI key handling:** `ai-config` GET returns only booleans/sources, never key material; decryption happens only server-side at call time.
- **API key issuance:** `randomBytes(20)`, SHA-256 hashed, raw key shown exactly once, timing-safe comparison on verify.
- **Password storage:** bcrypt with salt rounds 10, `select: false` on the field.
- **Cookie flags:** `httpOnly`, `secure` in production, `sameSite: lax`. Correct.
- **Core CRUD tenant scoping:** `posts` GET/POST/PUT/DELETE, `distribution/publish`, `brand-brain`, `ai-config`, `integrations/keys` all filter by `tenantId` ObjectId correctly.
- **Session hygiene:** `getCurrentUser()` re-validates the user against the DB on every request (`isActive` check) — deactivation takes effect immediately.

---

## Recommended Fix Order

| # | Items | Effort | Why first |
|---|---|---|---|
| 1 | C1, C2 (IDOR) | ~30 min | Active cross-tenant read/write. Two query-filter changes. |
| 2 | C3 (JWT fallback), C4 + H5 (billing bypasses) | ~30 min | Config-gap → total compromise / free upgrades. |
| 3 | H1 (regex escape), H3 (token in body), H6 (error leakage) | ~1 hr | Small, isolated patches. |
| 4 | H2 (rate limit), H4 (upload validation) | ~half day | Needs a small new helper each. |
| 5 | M1–M6 | ~half day | Polish; M2 aligns with Phase 7.1 anyway. |
| 6 | C5, L3 | Phase 7.1 | Already specified in `PIRATECOS_ROLES_ACCOUNTS_ACCESS_PLAN.md`. |

> **Rule going forward:** every Mongo query in an API route must include `tenantId` in the filter (not just in the data), and every "env var missing" branch must fail closed, never open.
