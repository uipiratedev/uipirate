# PirateCOS — Roles, Account Types & Access Control Plan

> **Phase:** 7.1 — Identity, Access & Profile Foundation
> **Created:** June 5, 2026
> **Status:** 📋 Planning
> **Prerequisites:** Phase 5.4 (Team Management) ✅ Complete

---

## 1. Current State Analysis

### What exists today
| Model / File | Relevant field | Current state |
|---|---|---|
| `models/pirateCOS/Admin.ts` | `role: "admin" \| "super-admin"` | No real RBAC — all users are effectively equal |
| `models/pirateCOS/Admin.ts` | `tenantId = Admin._id` | Each admin is their own isolated tenant |
| `models/pirateCOS/BrandBrain.ts` | `workspaceType: "individual" \| "team"` | Correct hook — already distinguishes account mode |
| `models/pirateCOS/Team.ts` | `members[].role: "admin" \| "editor" \| "viewer"` | Team-level roles exist but are not enforced at API level |
| `models/pirateCOS/Workspace.ts` | Single "UI Pirate" workspace (shared) | Does not correctly model per-tenant workspaces |
| `lib/pirateCOS/auth.ts` | `User { role, tenantId, plan }` | `role` is unused beyond login; no `orgRole` or `accountType` |
| `app/api/pirateCOS/teams/route.ts` | Hard-coded `name: "UI Pirate"` | Teams resolve to a single shared workspace — incorrect for multi-tenant |

### What is missing
- No `accountType` field — cannot distinguish Individual from Organization
- No `orgRole` — team member privilege levels not enforced server-side
- No `parentOrgId` — org members not linked to their org's tenant
- No profile page (`/pirateCOS/profile`) — nowhere to view/edit personal info
- No account-type conversion flow (Individual → Organization)
- Sidebar shows Teams for all users regardless of account type

---

## 2. Account Types

### 2.1 Individual Account
- Default for every new registration
- Full access to ALL features **except** Team management
- One user, one workspace, one Brand Brain
- Can convert to Organisation account at any time (non-reversible without support)
- Conversion promotes them to `org-admin` of their own org

### 2.2 Organisation Account
- One organisation per account (not multiple)
- One workspace, one Brand Brain profile
- The registering user becomes the `org-admin` (workspace admin)
- Can have **multiple `admin`-role members** (normal admins)
- `org-admin` or `admin` can invite new members via email
- Only `org-admin` can: change org profile, manage billing, set AI settings, promote/demote members
- Teams are available for grouping members across projects/systems

---

## 3. Role Hierarchy

```
Individual Account
└── [account-owner]   → full access, no teams

Organisation Account
├── org-admin         → 1 per org (the original owner or transferred)
│   └── all permissions + org profile + billing + member management
├── admin             → multiple allowed (promoted by org-admin)
│   └── all content permissions + team access, no billing/org settings
├── editor            → create & edit posts, use AI, cannot publish or delete
└── viewer            → read-only; see posts and analytics, no edits
```

> **Rule:** `org-admin` and `admin` can add/invite new team members.
> Only `org-admin` can change a member's role or remove members.

---

## 4. Privilege Matrix

| Capability | Individual | org-admin | admin | editor | viewer |
|---|:---:|:---:|:---:|:---:|:---:|
| Create posts | ✅ | ✅ | ✅ | ✅ | ❌ |
| Edit own posts | ✅ | ✅ | ✅ | ✅ | ❌ |
| Edit any post (org-scoped) | N/A | ✅ | ✅ | ❌ | ❌ |
| Publish / unpublish | ✅ | ✅ | ✅ | ❌ | ❌ |
| Delete posts | ✅ | ✅ | ✅ | ❌ | ❌ |
| Use AI workspace | ✅ | ✅ | ✅ | ✅ | ❌ |
| Distribute content | ✅ | ✅ | ✅ | ❌ | ❌ |
| View AI analytics | ✅ | ✅ | ✅ | ✅ | ✅ |
| Manage integrations | ✅ | ✅ | ❌ | ❌ | ❌ |
| Manage Teams | ❌ | ✅ | ✅ | ❌ | ❌ |
| Add/invite members | ❌ | ✅ | ✅ | ❌ | ❌ |
| Set member roles | ❌ | ✅ | ❌ | ❌ | ❌ |
| Edit Brand Brain | ✅ | ✅ | ✅ | ❌ | ❌ |
| AI Settings (providers) | ✅ | ✅ | ❌ | ❌ | ❌ |
| Billing & plan | ✅ | ✅ | ❌ | ❌ | ❌ |
| Edit org profile | N/A | ✅ | ❌ | ❌ | ❌ |
| Convert to org account | ✅→org | N/A | N/A | N/A | N/A |
| View own profile | ✅ | ✅ | ✅ | ✅ | ✅ |
| Edit own profile | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 5. Data Model Changes Required

### 5.1 `models/pirateCOS/Admin.ts` — extend `IAdmin`

```typescript
// ADD these fields:
accountType: "individual" | "organization";   // default: "individual"
orgRole: "individual" | "org-admin" | "admin" | "editor" | "viewer"; // "individual" for solo accounts
parentOrgId: mongoose.Types.ObjectId | null;  // null if owner; points to org-admin's _id for members
```

**Tenant scoping rule (unchanged):**
- Individual owner: `tenantId = self._id`
- Org owner (`org-admin`): `tenantId = self._id`
- Org member: `tenantId = parentOrgId` (all queries scope to the org owner's _id)

### 5.2 `lib/pirateCOS/auth.ts` — extend `User` interface & JWT

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: string;           // keep existing "admin" | "super-admin"
  tenantId: string;       // unchanged — scopes all DB queries
  plan: "free" | "starter" | "pro" | "enterprise";
  accountType: "individual" | "organization";   // NEW
  orgRole: "individual" | "org-admin" | "admin" | "editor" | "viewer"; // NEW
}

// JWT payload additions:
{
  "accountType": "organization",
  "orgRole": "editor"
}
```

### 5.3 `models/pirateCOS/Workspace.ts` — fix per-tenant scoping

Add `tenantId` field so each org gets their own workspace document (not the shared "UI Pirate" one):

```typescript
tenantId: { type: Schema.Types.ObjectId, ref: "Admin", required: true, index: true }
```

### 5.4 `app/api/pirateCOS/teams/route.ts` — fix workspace lookup

Replace hard-coded `findOne({ name: "UI Pirate" })` with `findOne({ tenantId: user.tenantId })`.

---

## 6. New API Endpoints Required

| Method | Route | Who can call | Purpose |
|---|---|---|---|
| `GET` | `/api/pirateCOS/profile` | Any authenticated | Fetch own Admin doc (without password) |
| `PUT` | `/api/pirateCOS/profile` | Any authenticated | Update name, avatar, password |
| `GET` | `/api/pirateCOS/org` | org-admin, admin | Fetch org profile (name, accountType, member count) |
| `PUT` | `/api/pirateCOS/org` | org-admin only | Update org name, logo, description |
| `POST` | `/api/pirateCOS/org/convert` | Individual account only | Convert to org (sets accountType, orgRole) |
| `GET` | `/api/pirateCOS/org/members` | org-admin, admin | List all org members with roles |
| `POST` | `/api/pirateCOS/org/members/invite` | org-admin, admin | Add existing user to org (by email) |
| `PATCH` | `/api/pirateCOS/org/members/[id]/role` | org-admin only | Change a member's orgRole |
| `DELETE` | `/api/pirateCOS/org/members/[id]` | org-admin only | Remove member from org |

### Permission middleware helper

Create `lib/pirateCOS/require-role.ts`:

```typescript
export function requireOrgRole(
  user: User,
  allowed: Array<"org-admin" | "admin" | "editor" | "viewer">
): boolean {
  if (user.orgRole === "individual") return false;
  return allowed.includes(user.orgRole as any);
}
```

---

## 7. New Pages Required

### 7.1 `/pirateCOS/profile` — User Profile Page (NEW ⭐)

**Sections:**
- **Personal Info** — Name, email (read-only), avatar upload
- **Change Password** — Current → New → Confirm
- **Account Type badge** — `Individual` or `Organisation · [Role]`
- **Convert to Organisation** — CTA button (visible only for Individual accounts)
  - Asks for Org Name, then calls `POST /api/pirateCOS/org/convert`
  - On success: refreshes JWT, shows org-admin badge

### 7.2 `/pirateCOS/org` — Organisation Profile Page (org accounts only, NEW ⭐)

**Sections:**
- **Org Identity** — Org name, description, logo
- **Members** — Table of all members with role badges; invite by email; remove/change role (org-admin only)
- **Account Status** — Current plan, billing link

### 7.3 Updates to existing pages

| Page | Change |
|---|---|
| `/pirateCOS/teams` | Show only when `accountType === "organization"` |
| `/pirateCOS/ai-settings` | Show only for `org-admin` and Individual accounts |
| `/pirateCOS/settings/billing` | Show only for `org-admin` and Individual accounts |
| `/pirateCOS/settings/integrations` | Show only for `org-admin` and Individual accounts |

---

## 8. Sidebar Changes (`components/pirateCOS/AdminSidebar.tsx`)

Add role-gated nav items:

```
Always visible:
  Dashboard · Posts · Create Post · AI Analytics · Profile

Org accounts only:
  Teams · Organisation

Org-admin + Individual only:
  AI Settings · Integrations · Billing & Usage

Role badge in sidebar footer:
  [avatar] Name
  Individual  OR  Organisation · org-admin
```

---

## 9. Implementation Phases

### Phase 7.1-A — Model & Auth Layer (Backend First)
- [ ] Add `accountType`, `orgRole`, `parentOrgId` to `Admin` model & `IAdmin` interface
- [ ] Update `auth.ts` User interface and JWT payload
- [ ] Update `register/route.ts` — new users default to `accountType: "individual"`, `orgRole: "individual"`
- [ ] Update `login/route.ts` — include `accountType` and `orgRole` in JWT
- [ ] Create `lib/pirateCOS/require-role.ts` permission helper
- [ ] Fix `Workspace` model: add `tenantId`, fix `teams/route.ts` lookup

### Phase 7.1-B — Org API Routes
- [ ] `GET/PUT /api/pirateCOS/profile`
- [ ] `POST /api/pirateCOS/org/convert`
- [ ] `GET/PUT /api/pirateCOS/org`
- [ ] `GET /api/pirateCOS/org/members`
- [ ] `POST /api/pirateCOS/org/members/invite`
- [ ] `PATCH /api/pirateCOS/org/members/[id]/role`
- [ ] `DELETE /api/pirateCOS/org/members/[id]`

### Phase 7.1-C — API-Level Permission Guards
- [ ] Gate `PUT /api/pirateCOS/posts/[id]` publish action — deny `editor`, `viewer`
- [ ] Gate `DELETE /api/pirateCOS/posts/[id]` — deny `editor`, `viewer`
- [ ] Gate `/api/pirateCOS/distribution/publish` — deny `editor`, `viewer`
- [ ] Gate `/api/pirateCOS/ai-settings` — deny `admin` (org), `editor`, `viewer`
- [ ] Gate `/api/pirateCOS/settings/billing` — deny `admin` (org), `editor`, `viewer`
- [ ] Gate `/api/pirateCOS/integrations` — deny non-org-admin non-individual

### Phase 7.1-D — Profile & Org Pages (Frontend)
- [ ] Create `app/pirateCOS/(authed)/profile/page.tsx`
- [ ] Create `app/pirateCOS/(authed)/org/page.tsx`
- [ ] Update `AdminSidebar.tsx` — role-gated nav items + role badge in footer
- [ ] Add Teams nav guard — hide for Individual accounts
- [ ] Update `useAuth` hook — expose `accountType` and `orgRole`

### Phase 7.1-E — Existing Page Guards
- [ ] Add `accountType` check to `/pirateCOS/teams` page — redirect Individual users
- [ ] Add `orgRole` check to `/pirateCOS/ai-settings` — redirect `editor`, `viewer`
- [ ] Add `orgRole` check to `/pirateCOS/settings/billing` — redirect `editor`, `viewer`

---

## 10. Migration Notes

- **Existing users:** All current `Admin` docs get `accountType: "individual"` and `orgRole: "individual"` via a one-time migration script (`scripts/migrate-account-types.ts`)
- **No data loss:** `tenantId` scoping is unchanged — all existing posts, brand brains, and integrations remain correctly scoped
- **Existing Team records:** Kept as-is; `Team.members` email-based lookup continues to work; `Workspace` documents updated with the creator's `tenantId`
- **JWT expiry:** Existing sessions remain valid; new fields appear on next login

---

## 11. Live Data Migration — UI Pirate Organisation Consolidation

> **Goal:** Migrate all existing tenant-isolated data into a single shared Organisation tenant
> owned by `admin@uipirate.com`, set that account as `org-admin`, and promote all other
> registered admins to `orgRole: "admin"` under the same org.
>
> ⚠️ **This is a destructive, one-way migration. Take a full MongoDB backup before running.**

### 11.1 What the migration must do (in order)

| Step | Action | Affected collection(s) |
|---|---|---|
| 1 | Identify `admin@uipirate.com` as the canonical org owner | `Admin` |
| 2 | Set `accountType`, `orgRole`, `parentOrgId` on ALL `Admin` docs | `Admin` |
| 3 | Re-scope all Posts from other tenants → org owner's `tenantId` | `Post` |
| 4 | Re-scope all BrandBrain docs → org owner's `tenantId` (keep only the org owner's; delete or merge others) | `BrandBrain` |
| 5 | Re-scope all AIConfig docs → org owner's `tenantId` | `AIConfig` |
| 6 | Re-scope all Integration docs → org owner's `tenantId` | `Integration` |
| 7 | Re-scope all ContentHistory docs → org owner's `tenantId` | `ContentHistory` |
| 8 | Re-scope all AIGenerationLog docs → org owner's `tenantId` | `AIGenerationLog` |
| 9 | Re-scope all ApiKey docs → org owner's `tenantId` | `ApiKey` |
| 10 | Create/update the "UI Pirate" Workspace with `tenantId` set to org owner's `_id` | `Workspace` |
| 11 | Ensure existing Teams reference the correct workspace | `Team` |

### 11.2 Why re-scoping is necessary

Currently every `Admin` is their own isolated tenant (`tenantId = Admin._id`). After migration,
all members share a single `tenantId` (the org owner's `_id`). Without re-scoping, members would
see empty data because their queries scope to the org owner's `tenantId` but the documents still
carry their own old `tenantId`.

**JWT change for org members (post-migration):**
```jsonc
// BEFORE (current — member's own tenant)
{ "userId": "member_id", "tenantId": "member_id", "role": "admin" }

// AFTER (new — org owner's tenant, member's orgRole)
{ "userId": "member_id", "tenantId": "org_owner_id", "role": "admin",
  "accountType": "organization", "orgRole": "admin" }
```

### 11.3 Migration script — `scripts/migrate-account-types.ts`

> Supersedes `scripts/migrate-to-uipirate-org.ts` (which only handled Workspace/Team/Post assignment but not role fields or full tenantId re-scoping).

```typescript
/**
 * migrate-account-types.ts
 * Full migration: UI Pirate org consolidation + new role system
 *
 * What it does:
 *   1. Sets accountType / orgRole / parentOrgId on all Admin docs
 *   2. Re-scopes ALL tenant-bound collections to the org owner's tenantId
 *   3. Creates / fixes the UI Pirate Workspace with proper tenantId
 *   4. Idempotent — safe to run multiple times
 *
 * Usage:
 *   npx ts-node -r tsconfig-paths/register scripts/migrate-account-types.ts
 *
 * Prerequisites:
 *   MONGODB_URI env var must be set (or defaults to localhost)
 *   admin@uipirate.com must already exist in the Admin collection
 */

const ORG_ADMIN_EMAIL = "admin@uipirate.com";
const ORG_NAME        = "UI Pirate";

// Collections to re-scope (field that holds the old tenantId):
const TENANT_SCOPED_COLLECTIONS = [
  { model: "Post",              field: "tenantId" },
  { model: "AIConfig",          field: "tenantId" },
  { model: "Integration",       field: "tenantId" },
  { model: "ContentHistory",    field: "tenantId" },
  { model: "AIGenerationLog",   field: "tenantId" },
  { model: "ApiKey",            field: "tenantId" },
];
// BrandBrain handled separately (unique index; merge/keep org owner's doc)
```

**Migration logic (pseudo-code for the script body):**

```
STEP 1 — Connect to MongoDB

STEP 2 — Find org owner
  orgAdmin = Admin.findOne({ email: ORG_ADMIN_EMAIL })
  if not found → ABORT with clear error message

STEP 3 — Update Admin role fields
  For orgAdmin:
    accountType = "organization"
    orgRole     = "org-admin"
    parentOrgId = null
  For every other Admin doc:
    accountType = "organization"
    orgRole     = "admin"          ← all existing users become "admin"
    parentOrgId = orgAdmin._id

STEP 4 — Re-scope all tenant-bound collections
  For each collection in TENANT_SCOPED_COLLECTIONS:
    updateMany({ tenantId: { $ne: orgAdmin._id } },
               { $set: { tenantId: orgAdmin._id } })
    log: "Re-scoped N docs in [collection]"

STEP 5 — Handle BrandBrain (unique tenantId index)
  orgBrain = BrandBrain.findOne({ tenantId: orgAdmin._id })
  if orgBrain exists:
    Delete all other BrandBrain docs (orphaned individual brains)
    log: "Kept org owner's BrandBrain; removed N orphaned docs"
  else:
    Reassign the most recently updated BrandBrain to orgAdmin._id
    Delete the rest

STEP 6 — Fix Workspace
  workspace = Workspace.findOne({ name: ORG_NAME })
  if exists:
    workspace.tenantId = orgAdmin._id
    workspace.owner    = ORG_ADMIN_EMAIL
    save
  else:
    Workspace.create({ tenantId: orgAdmin._id, owner: ORG_ADMIN_EMAIL,
                       name: ORG_NAME,
                       description: "Central workspace for UI Pirate organisation" })

STEP 7 — Verify Teams reference the correct workspace
  Update all Team docs: workspace = uiPirateWorkspace._id

STEP 8 — Print summary report
  Show counts for every collection updated
  Show final org member list with roles
```

### 11.4 Compatibility checklist (new system)

After running the migration, these points must be verified before the new code is deployed:

| Check | How to verify |
|---|---|
| `admin@uipirate.com` has `orgRole: "org-admin"` | `db.admins.findOne({ email: "admin@uipirate.com" }, { orgRole: 1 })` |
| All other admins have `parentOrgId = orgAdmin._id` | `db.admins.count({ parentOrgId: null, email: { $ne: "admin@uipirate.com" } })` → must be 0 |
| All Posts carry `tenantId = orgAdmin._id` | `db.posts.count({ tenantId: { $ne: orgAdmin._id } })` → must be 0 |
| Only one BrandBrain doc exists | `db.brainbrains.count()` → must be 1 |
| Workspace has `tenantId` field set | `db.workspaces.findOne({ name: "UI Pirate" }, { tenantId: 1 })` |
| Login returns new JWT claims | Log in as a member; decode JWT; confirm `accountType` + `orgRole` present |
| Member sees org's posts (not empty) | Log in as non-org-admin; open Posts list; data must appear |

### 11.5 Rollback plan

1. Restore MongoDB from backup taken before running the script
2. Redeploy the previous code version
3. No client-side state needs resetting (JWTs will naturally expire or be re-issued on next login)

### 11.6 Existing migration scripts — status after this migration

| Script | Status | Reason |
|---|---|---|
| `scripts/migrate-to-uipirate-org.ts` | **Superseded** | Only handled Workspace/Team/Post; did not set role fields or re-scope all collections |
| `scripts/init-workspace.ts` | **Deprecated** | Workspace creation now handled per-tenant by the new org API route |
| `scripts/migrate-account-types.ts` | **New — canonical** | Full migration; safe to re-run |

---

## 12. Files to Create / Modify Summary

| File | Action |
|---|---|
| `models/pirateCOS/Admin.ts` | Modify — add 3 new fields |
| `lib/pirateCOS/auth.ts` | Modify — extend User interface |
| `lib/pirateCOS/require-role.ts` | **CREATE** — permission helper |
| `app/api/pirateCOS/auth/login/route.ts` | Modify — add new JWT claims |
| `app/api/pirateCOS/auth/register/route.ts` | Modify — set default accountType |
| `app/api/pirateCOS/profile/route.ts` | **CREATE** — GET + PUT |
| `app/api/pirateCOS/org/route.ts` | **CREATE** — GET + PUT |
| `app/api/pirateCOS/org/convert/route.ts` | **CREATE** — POST |
| `app/api/pirateCOS/org/members/route.ts` | **CREATE** — GET + POST |
| `app/api/pirateCOS/org/members/[id]/route.ts` | **CREATE** — PATCH + DELETE |
| `app/api/pirateCOS/teams/route.ts` | Modify — fix workspace scoping |
| `models/pirateCOS/Workspace.ts` | Modify — add tenantId |
| `app/pirateCOS/(authed)/profile/page.tsx` | **CREATE** — user profile page |
| `app/pirateCOS/(authed)/org/page.tsx` | **CREATE** — org profile & members |
| `components/pirateCOS/AdminSidebar.tsx` | Modify — role-gated nav + badge |
| `hooks/useAuth.ts` | Modify — expose accountType, orgRole |
| `scripts/migrate-account-types.ts` | **CREATE** — canonical full migration (supersedes migrate-to-uipirate-org.ts) |
| `scripts/migrate-to-uipirate-org.ts` | **Superseded** — kept for reference only; do not run after new migration |
| `scripts/init-workspace.ts` | **Deprecated** — workspace now created by org API route |


