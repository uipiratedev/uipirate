# Content Command Center — Technical Implementation Plan

> **Transform the existing blog management system into a multi-channel content distribution platform.**
> This document is grounded entirely in the current codebase structure.
>
> | Phase | Title | Status |
> |---|---|---|
> | **Phase 1** | Content Command Center — Core Platform | 🟢 **Complete** |
> | **Phase 2** | *(To be defined)* | ⬜ Not started |
> | **Phase 3** | *(To be defined)* | ⬜ Not started |
>
> ---
>
> **Phase 1 — Delivery Summary**
>
> | Area | Status |
> |---|---|
> | Database schemas (`AIConfig`, `Integration`, `ApiKey`, `Blog`) | ✅ Complete |
> | AI Settings page (`/admin/ai-settings`) — DB-encrypted keys, all 4 engines | ✅ Complete |
> | `AIConfigPanel` in-editor quick panel — key storage & Mistral engine | ✅ Complete & Verified |
> | Distribution adapters (WordPress, Medium, Ghost, Buffer) | ✅ Complete |
> | `PATCH /api/admin/integrations/[platform]` (test connection) | ✅ Complete & Verified (Live probes) |
> | Distribution Engine, Publish API, Preflight | ✅ Complete |
> | Distribution Panel UI (4th editor tab) | ✅ Complete |
> | Integrations Settings page + API Key management | ✅ Complete |
> | `hooks/useSaveBlog.ts` extraction | ✅ Complete |
> | Public Content API (`/api/v1/content`) | ✅ Complete |
> | Multi-tenant isolation across all routes and models | ✅ Complete |

---

## Table of Contents

> **This document covers Phase 1** of the Content Command Center roadmap.

0. [SaaS / Multi-Tenancy Architecture](#0-saas--multi-tenancy-architecture)
1. [Codebase Audit](#1-codebase-audit)
2. [Database & Schema Evolution](#2-database--schema-evolution)
   - [Integration Model](#21-new-integration-model)
   - [ApiKey Model](#22-new-apikey-model)
   - [Blog Model Extension](#23-extend-blog-model)
3. [Backend API Architecture](#3-backend-api-architecture)
   - [File Tree](#31-proposed-file-tree)
   - [Integrations API](#32-integrations-api--apiadminintegrations)
   - [Distribution Engine](#33-distribution-engine--apidistributionpublish)
   - [Platform Adapters](#34-platform-adapters)
   - [Public Content API](#35-public-content-api--apiv1content)
4. [UI/UX Enhancements](#4-uiux-enhancements)
   - [Distribution Sidebar Tab](#41-distribution-sidebar-tab)
   - [AI Settings Page & AIConfigPanel](#42-ai-settings-page--aiconfigpanel--current-state)
   - [Integrations Settings Page](#43-integrations-settings-page)
5. [Workflow Integration](#5-workflow-integration)
   - [AI Pre-distribution Pipeline](#51-ai-pre-distribution-pipeline)
   - [Decoupling saveBlog](#52-decoupling-saveblog)
6. [Environment Variables](#6-environment-variables)
7. [Phase 1 — Internal Rollout Breakdown](#7-phase-1--internal-rollout-breakdown)

---

## 0. SaaS / Multi-Tenancy Architecture

> **Status: Implemented.** The backend is fully tenant-isolated as of this revision.
> Every model, route, and library function listed below has already been updated.

### Core principle — `tenantId = Admin._id`

No separate "Organisation" or "Tenant" table is required. Each `Admin` document **is** its own tenant. The `_id` of that document is the isolation key threaded through every MongoDB query in the system.

```
Admin document (_id: "abc123")
  ↓ tenantId
  ├── Blog documents     { tenantId: "abc123", slug: "my-post" }
  ├── AIConfig document  { tenantId: "abc123", defaultEngine: "openai" }
  └── Integration docs   { tenantId: "abc123", platform: "wordpress" }
```

A second user (`Admin._id: "def456"`) can have a blog with the same slug `"my-post"` — the compound index `{ tenantId, slug }` guarantees uniqueness **per tenant**, not globally.

### What was changed

| File | Change |
|---|---|
| `models/Admin.ts` | Added `plan`, `stripeCustomerId`, `trialEndsAt`, `usageThisMonth` — billing identity lives on the Admin/Tenant document |
| `models/Blog.ts` | Added `tenantId`; removed global `unique: true` on `slug`; added compound `{ tenantId, slug }` unique index |
| `models/AIConfig.ts` | Added `tenantId`; removed singleton pattern — now one doc per tenant |
| `lib/auth.ts` | `User` interface now includes `tenantId` and `plan`; `getCurrentUser()` returns both |
| `lib/ai-config.ts` | `getDecryptedKeys(tenantId)` scopes the DB lookup per tenant |
| `app/api/auth/login/route.ts` | JWT payload now includes `tenantId` and `plan` |
| `app/api/blogs/route.ts` | `GET` scopes list to `user.tenantId`; `POST` stamps `tenantId` on creation |
| `app/api/blogs/[id]/route.ts` | `GET`, `PUT`, `DELETE` all filter with `{ _id, tenantId }` |
| `app/api/admin/ai-config/route.ts` | Both `GET` and `POST` use `findOne({ tenantId })` |
| `app/api/ai/generate/route.ts` | Passes `user.tenantId` to `getDecryptedKeys()` |
| `hooks/useAuth.ts` | Client `User` interface extended with `tenantId` and `plan` |
| `components/admin/AdminSidebar.tsx` | Displays user name, email, and plan badge in the sidebar footer |

### Billing fields on `Admin` (Tenant)

```typescript
// models/Admin.ts — IAdmin interface additions
plan: "free" | "starter" | "pro";   // default: "free"
stripeCustomerId?: string;           // set on first Stripe checkout
trialEndsAt?: Date;                  // null if no active trial
usageThisMonth: {
  aiRequests: number;                // incremented by /api/ai/generate
  distributions: number;             // incremented by /api/distribution/publish
};
```

Usage counters should be reset monthly by a Stripe webhook (`invoice.paid`) or a scheduled cron job.

### JWT payload (post-login)

```jsonc
{
  "userId":   "abc123",
  "email":    "user@example.com",
  "role":     "admin",
  "tenantId": "abc123",   // identical to userId — Admin IS the tenant
  "plan":     "free"
}
```

Every call to `verifyAuth()` in an API route automatically has `user.tenantId` and `user.plan` available — no extra DB lookup needed.

### Terminology note

In this codebase the words **"Admin"** and **"Tenant/User"** are synonymous for regular accounts. The distinction only matters for `role: "super-admin"`, which is reserved for platform-level administration (future feature). All documentation below uses "tenant" when describing data isolation and "admin" when referring to the Next.js auth guard `verifyAuth()`.

---

## 1. Codebase Audit

Assets the new system reuses (some with minor tenant-scoping additions — see [Section 0](#0-saas--multi-tenancy-architecture)):

| Asset | File | How it is reused |
|---|---|---|
| AES-256-GCM encrypt/decrypt | `lib/encrypt.ts` | All platform credential fields |
| `verifyAuth()` JWT guard (now returns `tenantId` + `plan`) | `lib/auth.ts` | Every new admin route; tenant scope is automatic |
| `dbConnect()` | `lib/mongodb.ts` | All new routes and models |
| Per-tenant model pattern | `models/AIConfig.ts` | Template for `Integration` model — one doc per tenant |
| Tabbed sidebar (Content/SEO/AI) | `app/admin/(authed)/posts/create/page.tsx` | Extended with a 4th "Distribute" tab |
| `POST /api/blogs` (tenant-scoped) | `app/api/blogs/route.ts` | Called by `ensureSaved()` before distribution |
| AI Settings page layout | `app/admin/(authed)/ai-settings/page.tsx` | Cloned as Integrations Settings page |
| `AI_ENCRYPTION_KEY` env var | `.env.local` | Doubles as the integration credential key |

---

## 2. Database & Schema Evolution

### 2.1 New `Integration` Model

**File:** `models/Integration.ts`

Follows the **exact same singleton-avoidance pattern** as `models/AIConfig.ts`.  
All secret fields end in `Encrypted` — matching the `openaiKeyEncrypted` naming convention in `AIConfig.ts`.

```typescript
export type SupportedPlatform = "wordpress" | "medium" | "ghost" | "buffer";

export interface IPlatformCredentials {
  // WordPress
  siteUrl?: string;
  wpUsername?: string;
  wpAppPasswordEncrypted?: string;     // encrypt(applicationPassword)

  // Medium
  mediumTokenEncrypted?: string;       // encrypt(integrationToken)
  mediumAuthorId?: string;             // returned by Medium /me endpoint

  // Ghost
  ghostSiteUrl?: string;
  ghostAdminKeyEncrypted?: string;     // encrypt("id:secret" Admin API key)

  // Buffer (X / LinkedIn)
  bufferAccessTokenEncrypted?: string; // encrypt(oauthAccessToken)
  bufferProfileIds?: string[];         // target social profile IDs
}

export interface IIntegration extends Document {
  /** References the Admin._id that owns this integration — one set of connections per tenant */
  tenantId: mongoose.Types.ObjectId;
  platform: SupportedPlatform;
  credentials: IPlatformCredentials;
  isActive: boolean;
  lastTestedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

**Schema decisions:**
- One document per platform **per tenant** — queries use `findOne({ tenantId, platform })`.
- `isActive` disables a channel without deleting credentials (soft toggle).
- `lastTestedAt` is set by the `PATCH /api/admin/integrations/[platform]` test endpoint.
- All `*Encrypted` credential fields use `AI_ENCRYPTION_KEY` via `lib/encrypt.ts` — same key as AI config.

---

### 2.2 New `ApiKey` Model

**File:** `models/ApiKey.ts`

For programmatic access via `/api/v1/content`. The raw key is shown **once at creation and never stored in plaintext**. Only a SHA-256 hash is persisted.

```typescript
export interface IApiKey extends Document {
  /** References the Admin._id — each tenant manages their own API keys */
  tenantId: mongoose.Types.ObjectId;
  name: string;                 // "CI Pipeline", "Zapier", etc.
  keyHashEncrypted: string;     // SHA-256 hash of raw key, AES-256 encrypted
  keyPrefix: string;            // First 8 chars shown in UI: "uip_live_abc12345"
  scopes: ("read" | "write")[];
  lastUsedAt?: Date;
  expiresAt?: Date;
  isActive: boolean;
  createdAt: Date;
}
```

Lookup uses timing-safe comparison of SHA-256 hashes (`crypto.timingSafeEqual`).

---

### 2.3 Extend `Blog` Model

**File:** `models/Blog.ts` — append to `IBlog` interface and `BlogSchema`

```typescript
// Add to IBlog interface:
distributionRecords?: Array<{
  platform: string;        // "wordpress" | "medium" | "ghost" | "buffer"
  externalId: string;      // Platform's post ID — used for future updates/deletes
  url: string;             // Canonical external URL (shown as a link in the UI)
  distributedAt: Date;
  status: "success" | "failed" | "pending";
  errorMessage?: string;   // Populated on failure; surfaced in Distribution Panel
}>;

// Add to BlogSchema definition:
distributionRecords: [
  {
    platform:      { type: String, required: true },
    externalId:    { type: String },
    url:           { type: String },
    distributedAt: { type: Date, default: Date.now },
    status:        { type: String, enum: ["success", "failed", "pending"], default: "pending" },
    errorMessage:  { type: String },
  },
],
```

> **No migration needed.** MongoDB's schemaless nature means existing documents omit this field; Mongoose defaults to `[]`.

---

## 3. Backend API Architecture

### 3.1 Proposed File Tree

```
app/api/
├── admin/
│   ├── ai-config/route.ts              ← existing, untouched
│   └── integrations/
│       ├── route.ts                    ← GET (list) + POST (upsert)  [NEW]
│       └── [platform]/
│           └── route.ts               ← DELETE + PATCH (test)        [NEW]
├── distribution/
│   └── publish/
│       └── route.ts                   ← POST { blogId, platforms[] } [NEW]
└── v1/
    └── content/
        ├── route.ts                   ← GET (list) + POST (create)   [NEW]
        └── [slug]/
            └── route.ts              ← GET single post               [NEW]

lib/
├── encrypt.ts                         ← existing, no changes
├── api-key-auth.ts                    ← Bearer token verifier         [NEW]
└── distribution/
    ├── index.ts                       ← dispatch() orchestrator       [NEW]
    ├── adapters/
    │   ├── base.adapter.ts            ← abstract interface            [NEW]
    │   ├── wordpress.adapter.ts                                       [NEW]
    │   ├── medium.adapter.ts                                          [NEW]
    │   ├── ghost.adapter.ts                                           [NEW]
    │   └── buffer.adapter.ts                                          [NEW]
    └── transform/
        ├── html-to-markdown.ts        ← for Medium/Ghost              [NEW]
        └── content-preflight.ts      ← pre-distribution validator    [NEW]

models/
├── Blog.ts                            ← +distributionRecords          [MODIFIED]
├── Integration.ts                                                     [NEW]
└── ApiKey.ts                                                          [NEW]
```

---

### 3.2 Integrations API — `/api/admin/integrations`

All routes require `verifyAuth()` (same guard used across existing admin routes).

#### `GET /api/admin/integrations`

Returns connection status for every platform. **Never exposes decrypted credentials.** Pattern mirrors `GET /api/admin/ai-config`.

```jsonc
// Response shape
{
  "success": true,
  "integrations": [
    {
      "platform": "wordpress",
      "isActive": true,
      "isConnected": true,
      "siteUrl": "https://myblog.com",   // non-secret metadata
      "lastTestedAt": "2026-05-20T10:00:00Z"
    },
    { "platform": "medium",  "isConnected": false, "isActive": false },
    { "platform": "ghost",   "isConnected": false, "isActive": false },
    { "platform": "buffer",  "isConnected": false, "isActive": false }
  ]
}
```

#### `POST /api/admin/integrations`

Upsert credentials for one platform. Uses `encrypt()` from `lib/encrypt.ts` — same call as `ai-config/route.ts`. All queries are scoped to `user.tenantId` so each tenant manages only their own connections:

```typescript
// tenantId comes from verifyAuth() — no extra DB lookup needed
const existing =
  (await Integration.findOne({ tenantId: user.tenantId, platform })) ??
  new Integration({ tenantId: user.tenantId, platform });

if (body.wpAppPassword?.trim()) {
  existing.credentials.wpAppPasswordEncrypted = encrypt(body.wpAppPassword.trim());
}
existing.credentials.siteUrl = body.siteUrl;
existing.isActive = true;
await existing.save();
```

#### `PATCH /api/admin/integrations/[platform]`

Updates `lastTestedAt` and returns `{ success, message }`. **Fully implemented with live outbound probes** — the route decrypts stored credentials and makes a real HTTP call to each platform's auth endpoint before saving:

| Platform | Probe endpoint | Extra side-effect |
|---|---|---|
| WordPress | `GET {siteUrl}/wp-json/wp/v2/users/me` (HTTP Basic) | Returns `Connected as @{slug}` |
| Medium | `GET https://api.medium.com/v1/me` (Bearer) | Saves `mediumAuthorId` from response for use in `publish()` |
| Ghost | `GET {siteUrl}/ghost/api/admin/site/` (HS256 JWT from `id:secret`) | Returns site title + version |
| Buffer | `GET https://api.bufferapp.com/1/profiles.json` (Bearer) | Saves `bufferProfileIds[]` from response |

Any non-2xx response from the platform is surfaced as `{ success: false, error: "..." }` — the UI never writes `lastTestedAt` on a failed probe.

#### `DELETE /api/admin/integrations/[platform]`

Sets `isActive = false` and clears all `*Encrypted` fields. Document is kept for audit trail.

---

### 3.3 Distribution Engine — `/api/distribution/publish`

#### Request

```typescript
POST /api/distribution/publish
{
  blogId: string;            // MongoDB _id of a saved Blog document
  platforms: SupportedPlatform[];
  options?: {
    updateIfExists?: boolean; // Re-push if externalId already exists on that platform
    scheduleAt?: string;      // ISO timestamp — Buffer supports scheduled posts
  }
}
```

#### Route handler logic

```typescript
export async function POST(req: NextRequest) {
  const user = await verifyAuth();              // reuse existing guard
  if (!user) return unauthorized();

  const { blogId, platforms, options } = await req.json();

  await dbConnect();
  // Scope to tenant — a user cannot distribute another tenant's post
  const blog = await Blog.findOne({ _id: blogId, tenantId: user.tenantId });
  if (!blog)          return notFound();
  if (!blog.published) return badRequest("Publish the blog locally before distributing.");

  const results = await dispatch({ blog, platforms, options });

  // Upsert distributionRecords on the Blog document
  for (const result of results) {
    const existing = blog.distributionRecords?.find(r => r.platform === result.platform);
    existing ? Object.assign(existing, result)
             : blog.distributionRecords?.push(result);
  }
  await blog.save();

  return NextResponse.json({ success: true, results });
}
```

#### `lib/distribution/index.ts` — `dispatch()` orchestrator

```typescript
import { decrypt } from "@/lib/encrypt";
import Integration from "@/models/Integration";
import { WordPressAdapter } from "./adapters/wordpress.adapter";
import { MediumAdapter }    from "./adapters/medium.adapter";
import { GhostAdapter }     from "./adapters/ghost.adapter";
import { BufferAdapter }    from "./adapters/buffer.adapter";

const ADAPTER_MAP = { wordpress: WordPressAdapter, medium: MediumAdapter,
                      ghost: GhostAdapter, buffer: BufferAdapter };

export async function dispatch({ blog, platforms, options, tenantId }) {
  return Promise.allSettled(
    platforms.map(async (platform) => {
      // Scoped to tenantId — fetches only this user's integration credentials
      const integration = await Integration.findOne({ tenantId, platform, isActive: true });
      if (!integration) throw new Error(`${platform} not connected`);
      const adapter = new ADAPTER_MAP[platform](integration.credentials, decrypt);
      return adapter.publish(blog, options);
    })
  ).then(mapSettledResults); // converts PromiseSettledResult[] → DistributionResult[]
}
```

#### `lib/distribution/transform/content-preflight.ts`

```typescript
export interface PreflightCheck {
  label: string;
  passed: boolean;
  severity: "error" | "warning";
  action?: string; // e.g. "Open SEO Editor"
}

export function runPreflight(blog: Partial<IBlog>): PreflightCheck[] {
  return [
    { label: "Excerpt present",      passed: !!blog.excerpt,                severity: "error",   action: "Generate Excerpt" },
    { label: "Content ≥ 300 words",  passed: wordCount(blog.content) >= 300, severity: "error" },
    { label: "Focus keyword set",    passed: !!blog.seo?.focusKeyword,       severity: "warning", action: "Open SEO Editor" },
    { label: "Meta title set",       passed: !!blog.seo?.metaTitle,          severity: "warning", action: "Open SEO Editor" },
    { label: "Meta description set", passed: !!blog.seo?.metaDescription,    severity: "warning", action: "Open SEO Editor" },
    { label: "At least one tag",     passed: (blog.tags?.length ?? 0) > 0,   severity: "warning", action: "Generate Tags" },
    { label: "Featured image set",   passed: !!blog.featuredImage,           severity: "warning" },
  ];
}
```

---

### 3.4 Platform Adapters

All four adapters extend `BaseAdapter` from `lib/distribution/adapters/base.adapter.ts`.

**Actual `BaseAdapter` signature (as implemented):**

```typescript
export interface DistributionResult {
  platform: SupportedPlatform;
  externalId: string;
  url: string;
  status: "success" | "failed";
  errorMessage?: string;
  distributedAt: Date;        // Added: timestamp of the distribution attempt
}

export abstract class BaseAdapter {
  constructor(
    protected credentials: IPlatformCredentials,
    protected decrypt: (cipher: string) => string,  // typed as plain function, not typeof encrypt.decrypt
  ) {}
  abstract publish(blog: IBlog, options?: PublishOptions): Promise<DistributionResult>;
  abstract update(blog: IBlog, externalId: string): Promise<DistributionResult>;
}
```

| Adapter | Auth | Content Format | `publish()` | `update()` |
|---|---|---|---|---|
| `WordPressAdapter` | HTTP Basic (`user:app_password` base64) | **HTML** — sent directly to WP REST API | `POST /wp-json/wp/v2/posts` ✅ | `POST /wp-json/wp/v2/posts/:id` ✅ |
| `MediumAdapter` | Bearer token | **Markdown** — HTML is converted first | `POST /v1/users/{authorId}/posts` ✅ | ❌ Unsupported — Medium API restriction |
| `GhostAdapter` | JWT from `id:secret` Admin API key | **HTML via `?source=html`** — no Mobiledoc conversion needed | `POST /ghost/api/admin/posts/?source=html` ✅ | `PUT /ghost/api/admin/posts/:id/?source=html` ✅ |
| `BufferAdapter` | OAuth Bearer | Plain text: title + excerpt (no full HTML) | `POST /1/updates/create.json` ✅ | ❌ Unsupported — social posts are immutable |

**`lib/distribution/transform/html-to-markdown.ts`** — Converts TipTap HTML for Medium using a **custom regex-based pipeline** (not `unified`/`rehype-remark`). Handles headings, lists, blockquotes, code blocks, bold/italic, links, and images. Ghost receives HTML directly via its `?source=html` parameter, bypassing this transformer entirely.

> **Note on `update()` limitations:** Medium and Buffer do not support post updates programmatically. Calls to `adapter.update()` on those two return a `"failed"` `DistributionResult` with a descriptive `errorMessage`. WordPress and Ghost both have full update support.

---

### 3.5 Public Content API — `/api/v1/content`

Uses a separate auth mechanism from the admin JWT cookies — a static Bearer key in the `Authorization` header.

#### `lib/api-key-auth.ts`

```typescript
export interface ApiKeyAuthResult {
  tenantId: string;           // Returned so v1 routes can scope DB queries
  scopes: ("read" | "write")[];
}

export async function verifyApiKey(req: NextRequest): Promise<ApiKeyAuthResult | null> {
  const rawKey = req.headers.get("Authorization")?.substring(7).trim();
  if (!rawKey) return null;

  const requestHash = createHash("sha256").update(rawKey).digest("hex");
  await dbConnect();
  // Fetches all active keys; the SHA-256 timing-safe comparison identifies the tenant
  const activeKeys = await ApiKey.find({ isActive: true }).lean();
  for (const key of activeKeys) {
    const decryptedHash = decrypt(key.keyHashEncrypted);
    if (timingSafeEqual(Buffer.from(requestHash, "hex"), Buffer.from(decryptedHash, "hex"))) {
      return { tenantId: String(key.tenantId), scopes: key.scopes };
    }
  }
  return null;
}
```

> **Implementation note:** `verifyApiKey` loads all active keys across all tenants to locate a match. This is correct at current scale; at very high key volumes a per-tenant indexed lookup would be preferable. The returned `tenantId` is used immediately by the `/api/v1/content` routes to scope every MongoDB query.

#### Endpoints

| Method | Path | Scope | Description |
|---|---|---|---|
| `GET` | `/api/v1/content` | `read` | Paginated list of published blogs. Params: `limit`, `page`, `postType`, `tag` |
| `GET` | `/api/v1/content/[slug]` | `read` | Single blog by slug — full content + SEO fields |
| `POST` | `/api/v1/content` | `write` | Create a blog programmatically. Accepts `html` or `markdown` content |

---

## 4. UI/UX Enhancements

### 4.1 Distribution Sidebar Tab

**Files:** `app/admin/(authed)/posts/create/page.tsx` · `app/admin/(authed)/posts/edit/[id]/page.tsx`

The existing sidebar tab system (lines 6644–6665 in `create/page.tsx`) is extended from 3 to 4 tabs:

```typescript
// Current
const tabs = ["content", "seo", "ai"] as const;

// Extended
const tabs = ["content", "seo", "ai", "distribute"] as const;
```

The `"distribute"` tab renders a shared `<DistributionPanel>` component (`components/admin/DistributionPanel.tsx`) — reused by both `create/page.tsx` and `edit/[id]/page.tsx`.

#### `DistributionPanel` props (actual implementation)

```typescript
interface DistributionPanelProps {
  blogId: string | null;              // null if blog has never been saved
  blogPublished: boolean;
  blogContent: string;                // for word-count preflight
  blogExcerpt: string;
  blogTags: string[];
  blogSeo: any;                       // PostSEO shape; typed loosely for flexibility
  distributionRecords: DistributionRecord[]; // current records from blog state
  onEnsureSaved: () => Promise<string>;      // resolves to blogId after save
  onUpdateRecords: (records: DistributionRecord[]) => void; // merge results into parent state
  // Preflight action callbacks — open the relevant modal directly from a checklist item:
  onNavigateToSEO: () => void;
  onTriggerExcerptAI: () => void;
  onTriggerTagsAI: () => void;
  onTriggerCopilotAI: () => void;
}
```

> The panel fetches live integration status from `GET /api/admin/integrations` on mount. Platforms that are disconnected display a "Connect" shortcut link to `/admin/settings/integrations` rather than being selectable.

#### Panel layout (top → bottom within 288px sidebar)

```
┌──────────────────────────────────┐
│  DISTRIBUTION                    │
│                                  │
│  Pre-flight Checklist            │
│   ✓ Excerpt present              │
│   ⚠ Focus keyword missing ──────→ [Open SEO Editor]
│   ✓ Content ≥ 300 words          │
│   ✓ At least one tag             │
│   ⚠ Featured image missing       │
│                                  │
│  Target Platforms                │
│  ┌──────────────────────────┐   │
│  │ WordPress   [●] Connected │   │  ← toggle on/off
│  │ Medium      [○] Not set up│   │  ← greyed, links to settings
│  │ Ghost       [●] Connected │   │
│  │ X/LinkedIn  [○] Not set up│   │
│  └──────────────────────────┘   │
│                                  │
│  Distribution History            │
│  WordPress  ✓ May 20 → [link]   │  ← from blog.distributionRecords
│  Medium     ✗ Failed (error)    │
│                                  │
│  [ Distribute Now ]              │  ← primary CTA
└──────────────────────────────────┘
```

#### "Distribute Now" button flow

1. Run `runPreflight()` client-side (same logic as `content-preflight.ts`).
2. `error`-severity failures → blocking modal. `warning`-severity → dismissible callout.
3. Each failing check is a tappable link that opens the relevant modal (SEO Editor, Excerpt, Tags).
4. Call `onEnsureSaved()` — runs `saveBlog()` only if the blog is new or dirty.
5. `POST /api/distribution/publish` with the selected platforms.
6. Await response, render per-platform status badges inline.

---

### 4.2 AI Settings Page & `AIConfigPanel` — Current State

#### `app/admin/(authed)/ai-settings/page.tsx` ✅ Complete

The full-page AI settings experience. All API keys are saved **encrypted in MongoDB** via `POST /api/admin/ai-config`. Four engines are supported with independent `KeyModal` dialogs:

| Engine | Key Field | Model Options |
|---|---|---|
| Puter AI | None (OAuth sign-in) | Uses GPT models via puter.com for free |
| OpenAI | `openaiKeyEncrypted` | GPT-4o Mini, GPT-4o, GPT-5.x family |
| Google Gemini | `geminiKeyEncrypted` | 1.5 Flash, 1.5 Pro, 2.0 Flash |
| Mistral AI | `mistralKeyEncrypted` | Large, Small, Nemo, Codestral |

The `defaultEngine` / `defaultModel` selection is saved to the DB **and** mirrored to `localStorage` under the key `uipirate-ai-config` as a fast-load cache for the editor UI.

#### `components/admin/AIConfigPanel.tsx` ✅ Complete

This is the **quick-access slide-over panel** that opens from within the blog editor (separate from the settings page). All previously-identified gaps have been resolved:

| Item | Status | Detail |
|---|---|---|
| Key storage | ✅ Fixed | `save()` POSTs to `POST /api/admin/ai-config`; API keys are **never** written to localStorage |
| localStorage cache | ✅ Correct | Only `defaultEngine` and `defaultModel` are cached under `uipirate-ai-config` for fast editor startup |
| Mistral key input | ✅ Added | Full `PanelSection` with `KeyInput` and violet `EnvBadge`, matching OpenAI/Gemini sections |
| Mistral engine button | ✅ Added | Four-button selector: `openai \| gemini \| mistral \| puter` with correct model defaults |
| Footnote | ✅ Updated | Now reads: *"Keys are securely encrypted using AES-256-GCM and stored in your database. They are never exposed to the browser or third parties."* |

On open, the panel fetches `GET /api/admin/ai-config` to populate `serverStatus: { openai, gemini, mistral }` — each key input's placeholder switches to `"Saved in Database (encrypted)"` when the server reports a key is present.

---

### 4.3 Integrations Settings Page

**File:** `app/admin/(authed)/settings/integrations/page.tsx` ✅ Implemented

Structured identically to `app/admin/(authed)/ai-settings/page.tsx` — same card layout, modal pattern, and `#FF5B04` accent colour.

#### Section 1 — Platform Integrations (four cards, 2×2 grid on md+)

```
┌──────────────────────────────────────────────────────┐
│ WordPress REST API                     ● Connected   │
│ Site: https://myblog.com · Tested 2h ago             │
│           [Test Connection]  [Disconnect]  [Edit]    │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│ Medium                                 ○ Not set up  │
│                                    [Connect Medium]  │
└──────────────────────────────────────────────────────┘
```

"Connect" / "Edit" opens a slide-over panel (not a new page) with the credential form. The form design mirrors `KeyModal` from `ai-settings/page.tsx`.

| Platform | Form Fields |
|---|---|
| WordPress | Site URL, Username, Application Password |
| Medium | Integration Token |
| Ghost | Site URL, Admin API Key (`id:secret`) |
| Buffer | Access Token, Target Profile IDs (fetched after token save) |

#### Section 2 — API Keys

```
┌──────────────────────────────────────────────────────┐
│ API Keys                                             │
│ Programmatic access for CI pipelines & integrations  │
│                                     [+ Create Key]   │
│                                                      │
│  CI Pipeline   uip_live_abc12345…  read    [Revoke]  │
│  Zapier        uip_live_xyz98765…  r/w     [Revoke]  │
└──────────────────────────────────────────────────────┘
```

On create: display the full key **once** in a modal (`uip_live_<32 random chars>`). Only the SHA-256 hash is stored in MongoDB.

#### Admin Sidebar update

**File:** `components/admin/AdminSidebar.tsx`

Add a "Settings" nav group beneath the existing items:

```typescript
// New nav entry:
{ label: "Integrations", href: "/admin/settings/integrations", Icon: IconIntegrations }
```

---

## 5. Workflow Integration

### 5.1 AI Pre-distribution Pipeline

The existing AI tools are the **quality gate before distribution**. The Distribution Panel's Pre-flight Checklist enforces usage of these tools by surfacing failures as direct shortcuts:

| Existing Tool | Modal | Satisfies Preflight Check |
|---|---|---|
| **AI Copilot** | `AICopilotModal` | Content ≥ 300 words |
| **AI Tags** | `AITagsModal` | At least one tag |
| **AI Excerpt** | `AIExcerptModal` | Excerpt present |
| **SEO → AI Analysis** | `SEOEditorModal` | Focus keyword, Meta title, Meta description |
| **SEO → AI Title** | `SEOEditorModal` (General tab) | Meta title set |

Failing check items are rendered as tappable buttons that open the relevant modal directly. This creates a closed loop: AI tooling is surfaced *at the distribution moment*, not treated as optional.

---

### 5.2 Decoupling `saveBlog()`

**Current problem:** `saveBlog()` (line 6062 of `create/page.tsx`) is an inline `async` closure. The saved blog ID is captured in component state via `setSavedBlogId()`, making it impossible to `await` the ID from the new `DistributionPanel`.

**Solution:** Extracted to `hooks/useSaveBlog.ts` ✅

**Actual implementation** uses a `getEditorState` callback (lazy evaluation) rather than accepting a static state snapshot. This avoids stale closure bugs when the hook is defined once and called repeatedly:

```typescript
// hooks/useSaveBlog.ts (actual signature)
interface UseSaveBlogProps {
  initialBlogId?: string | null;
  getEditorState: () => EditorSaveState;    // called at save-time, always current
  onSaveSuccess?: (id: string, published: boolean) => void;
  onSaveError?: (error: any) => void;
}

export function useSaveBlog({
  initialBlogId = null,
  getEditorState,
  onSaveSuccess,
  onSaveError,
}: UseSaveBlogProps) {
  const [blogId, setBlogId] = useState<string | null>(initialBlogId);
  const [saveStatus, setSaveStatus] = useState<
    "Draft" | "Saving…" | "Publishing…" | "Saved" | "Published" | "Error"
  >("Draft");
  const [isDirty, setIsDirty] = useState(false);

  // saveBlog accepts optional SEO / slug overrides (for SEO editor integration)
  const saveBlog = useCallback(
    async (published: boolean, customSeo?: any, customSlug?: string): Promise<string> => { ... },
    [blogId, getEditorState, onSaveSuccess, onSaveError],
  );

  // ensureSaved uses a ref to avoid capturing stale isDirty
  const ensureSaved = useCallback(async (): Promise<string> => {
    if (blogId && !isDirtyRef.current) return blogId;
    return await saveBlog(false);
  }, [blogId, saveBlog]);

  return { blogId, setBlogId, isSaving, saveStatus, setSaveStatus, isDirty, setIsDirty, saveBlog, ensureSaved };
}
```

Additional differences vs. the original plan:
- Returns `saveStatus` enum (`"Draft" | "Saving…" | "Publishing…" | "Saved" | "Published" | "Error"`) for rich UI feedback
- `saveBlog()` accepts optional `customSeo` and `customSlug` overrides so the SEO editor can pass updated data without a separate save call
- `isDirty` is tracked via a `useRef` inside `ensureSaved` to prevent stale closure captures

**State transition model:**

```
[New Post]             → saveBlog(false)    → [Draft in DB]
[Draft in DB]          → saveBlog(true)     → [Published in DB]
[Published, clean]     → distribute()       → [Published + WP record]
[Published, dirty]     → ensureSaved()      → saveBlog(false) → distribute()
[Published + WP]       → distribute("medium") → [+ Medium record]  (no re-save needed)
```

This means:
- **Local save** and **external distribution** are always independent operations.
- `DistributionPanel` never owns save logic — it only calls `ensureSaved()`.
- The hook is shared by both `create/page.tsx` and `edit/[id]/page.tsx`, eliminating duplication.
- Existing `onConfirm={() => saveBlog(true)}` modal callbacks in both pages continue to work unchanged.

---

## 6. Environment Variables

Add to `.env.local`:

```bash
# Already present — reused verbatim for integration credential encryption:
AI_ENCRYPTION_KEY=<64-char-hex>

# No additional secrets needed for WordPress, Medium, Ghost, or Buffer.
# All platform keys are stored encrypted in MongoDB using AI_ENCRYPTION_KEY.

# Only required if building direct OAuth for X/Twitter or LinkedIn
# (instead of routing through Buffer):
# X_OAUTH_CLIENT_ID=...
# X_OAUTH_CLIENT_SECRET=...
# LINKEDIN_CLIENT_ID=...
# LINKEDIN_CLIENT_SECRET=...
```

> `AI_ENCRYPTION_KEY` doubles as the integration encryption key. One key, one `lib/encrypt.ts` module, consistent across the entire system.

---

## 7. Phase 1 — Internal Rollout Breakdown

> These are the internal delivery milestones within **Phase 1 — Content Command Center**. All are complete.

| Milestone | Deliverables | Touches | Status | Notes |
|---|---|---|---|---|
| **1.1 — Foundation** | `models/Integration.ts`, `models/ApiKey.ts`, extend `models/Blog.ts`, `app/api/admin/integrations/` routes | Models + API only | ✅ **Complete** | Compound `{ tenantId, platform }` unique index; `distributionRecords` added to Blog |
| **1.2 — Distribution Engine** | All four platform adapters, `html-to-markdown.ts`, `content-preflight.ts`, `app/api/distribution/publish/route.ts` | Backend only | ✅ **Complete** | HTML→Markdown uses custom regex pipeline. Ghost and WordPress support `update()`; Medium and Buffer do not |
| **1.3 — Editor UI** | `hooks/useSaveBlog.ts`, `components/admin/DistributionPanel.tsx`, 4-tab system in `create/page.tsx` | Editor pages + new hook | ✅ **Complete** | Hook uses `getEditorState` callback pattern; panel has extended prop set with AI action callbacks |
| **1.4 — Settings UI + Public API** | `app/admin/(authed)/settings/integrations/page.tsx`, `AdminSidebar.tsx`, `/api/v1/content/` routes, `lib/api-key-auth.ts` | Settings + public API | ✅ **Complete** | Full API Key creation/revocation UI; SHA-256 timing-safe verification with `tenantId` returned |
| **1.5 — Polish** | `AIConfigPanel.tsx` DB key storage, Mistral support, live integration probes | Components + route | ✅ **Complete** | All keys encrypted in DB; live HTTP probes for all four platforms |

Each milestone was independently deployable and produced visible, testable output before the next began.

---

## What Comes Next — Phase 2 & Beyond

Phase 1 delivers the complete foundation. Future phases are not yet scoped — the table below is a placeholder to be defined based on product priorities.

| Phase | Working Title | Scope (TBD) | Status |
|---|---|---|---|
| **Phase 2** | *(To be defined)* | — | ⬜ Not started |
| **Phase 3** | *(To be defined)* | — | ⬜ Not started |
