# PirateCOS Retention Plan — Post Groups & Content Continuity

## ✅ What We're Keeping (User Confirmed)

### AI Engine/Model Selectors in Modals
**Status:** ✅ **KEEPING** — User wants override control
- Defaults already apply from `AIConfig` ✅
- Selectors provide per-generation override
- No changes needed to AI selection UX

---

## 🎯 Core Retention Problems to Solve

### Problem 1: No Content Continuity & Campaign Management
**Impact:** User creates blog → leaves to ChatGPT for LinkedIn version → content scattered across tools

**Solution:** **Post Groups** (Campaigns, Series, Multi-Platform)
- Organize related content into groups: "SaaS Launch Q2 2026", "React Tutorial Series"
- **"Generate Derivatives" button** → Blog → LinkedIn + Twitter + Newsletter in one click
- Track campaign analytics (aggregated views/clicks across all posts)
- Series ordering (Tutorial Part 1, 2, 3...)
- **Priority:** **CRITICAL** (Week 1-3) — **THIS IS THE RETENTION MULTIPLIER**

**Post Group Types:**
1. **Campaign** — Product launch, feature announcement (blog + social + newsletter)
2. **Series** — Tutorial series, educational content (Part 1, 2, 3...)
3. **Syndication** — Same content across platforms (WordPress + Medium + LinkedIn)
4. **Custom** — User-defined grouping

### Problem 2: No Workflow Memory
**Impact:** User manually creates derivatives every time

**Solution:** Post Group Templates + Pattern Detection
- "Generate Derivatives" remembers last workflow
- Auto-suggest group type based on keywords
- "Complete this group" hints (you have blog + LinkedIn, missing Twitter)
- **Priority:** HIGH (Week 3)

### Problem 3: Model Duplication
**Impact:** `WorkflowMemory` duplicates `BrandBrain` fields

**Solution:** Merge into single source of truth
- Move `snippetLibrary`, `uiPreferences` into `BrandBrain`
- Delete `models/pirateCOS/WorkflowMemory.ts`
- **Priority:** HIGH (Week 1)

### Problem 4: No Favorite Tracking
**Impact:** User picks same preset/goal every time

**Solution:** Star favorites → auto-select
- `BrandBrain.favoritePresets[]`, `favoriteGoals[]`
- Star icon next to presets/goals
- If only 1 favorite, auto-select on new post
- **Priority:** MEDIUM (Week 1)

---

## 📋 Revised 4-Week Plan with Post Groups

### Week 1: Foundation (Data Models)
- **Day 1-2:** Merge WorkflowMemory into BrandBrain
- **Day 3-4:** Create `PostGroup` model (campaign/series/syndication types)
- **Day 5:** Build Post Group CRUD API (`POST/GET/PUT/DELETE /api/pirateCOS/groups`)

### Week 2: Post Group UI ⭐ CRITICAL
- **Day 6-7:** Post Group List page (`/pirateCOS/(authed)/groups/`)
- **Day 8-9:** Post Group Detail page (shows primary + derivatives + analytics)
- **Day 10:** "Add to Group" action after saving post

### Week 3: Workflow Magic 🔥 GAME CHANGER
- **Day 11-13:** **"Generate Derivatives" API + UI** (blog → LinkedIn + Twitter + Newsletter)
- **Day 14-15:** Auto-add repurposed posts to group, track `role` (primary/derivative)

### Week 4: Intelligence Layer
- **Day 16-17:** Auto-suggest group on save (keyword matching)
- **Day 18:** "Complete this group" suggestions (missing Twitter? Generate it)
- **Day 19:** Analytics aggregation (total campaign views/clicks)
- **Day 20:** Test, measure retention lift

---

## 🗑️ What We're NOT Doing (Simplified)

1. ~~Remove AI selectors from modals~~ — **KEEPING** for override control
2. ~~Delete EngineModelSelector component~~ — **KEEPING** (used in modals)
3. ~~Force single AI provider~~ — **KEEPING** flexibility

**Net deletions:** Just `WorkflowMemory.ts` (~200 lines)

---

## 📊 Expected Impact (Unchanged)

| Metric | Before | After | Lift |
|--------|--------|-------|------|
| 7-Day Return Rate | 20% | 60-70% | +250% |
| Session Length | 15 min | 45 min | +200% |
| Content Per Session | 1 post | 3-5 pieces | +400% |
| External Tool Switching | 3+ tools | 0 tools | -100% |

---

## 🚀 Start Here (Week 1, Day 1-5)

### Day 1-2: Merge WorkflowMemory into BrandBrain

**Schema update:**
```typescript
// models/pirateCOS/BrandBrain.ts
interface IBrandBrain extends Document {
  // ... existing fields ...

  // Migrated from WorkflowMemory:
  snippetLibrary?: string[];
  uiPreferences?: {
    panelWidth?: number;
    showHistory?: boolean;
    quickActionsOrder?: string[];
  };

  // NEW retention fields:
  favoritePresets?: string[];
  favoriteGoals?: string[];
  defaultContentLength?: "short" | "medium" | "long";
}
```

**Files to update:**
- `app/api/pirateCOS/ai-config/preferences/route.ts` — query BrandBrain instead
- `hooks/useAIWorkspaceSession.ts` — fetch snippets from BrandBrain

**Files to delete:**
- `models/pirateCOS/WorkflowMemory.ts`

---

### Day 3-5: Create PostGroup Model + CRUD API

**New model:**
```typescript
// models/pirateCOS/PostGroup.ts
interface IPostGroup extends Document {
  tenantId: ObjectId;
  name: string; // "SaaS Launch Q2 2026"
  description?: string;
  groupType: "campaign" | "series" | "syndication" | "custom";

  posts: Array<{
    postId: ObjectId;
    role: "primary" | "derivative" | "supporting";
    order?: number; // For series: 1, 2, 3...
    platform?: string; // "wordpress" | "linkedin" | "twitter"
    status: "draft" | "published" | "scheduled";
    publishedAt?: Date;
  }>;

  tags?: string[];
  coverImage?: string;

  sharedContext?: {
    contentGoal?: string;
    targetAudience?: string;
    keywords?: string[];
    campaignStartDate?: Date;
    campaignEndDate?: Date;
  };

  analytics?: {
    totalViews: number;
    totalClicks: number;
    totalShares: number;
  };
}
```

**API endpoints to create:**
- `POST /api/pirateCOS/groups` — Create group
- `GET /api/pirateCOS/groups` — List all groups
- `GET /api/pirateCOS/groups/[id]` — Get group details + populate posts
- `PUT /api/pirateCOS/groups/[id]` — Update group
- `DELETE /api/pirateCOS/groups/[id]` — Delete group
- `POST /api/pirateCOS/groups/[id]/add-post` — Add post to group
- `DELETE /api/pirateCOS/groups/[id]/posts/[postId]` — Remove post from group

**See full spec:** `POST_GROUP_CONTENT_CONTINUITY_SPEC.md`

---

## 🎯 The Retention Multiplier: Post Groups + "Generate Derivatives"

**When user saves a blog post:**

```
✨ Post saved!

Create a content campaign?
┌─────────────────────────────────────────────────────┐
│ � New Campaign: "SaaS Growth Hacks"                │
│                                                     │
│ This blog can become:                               │
│ �📱 LinkedIn post — Key insights for your network   │
│ 🐦 Twitter thread — 10 tips broken down           │
│ 📧 Newsletter — Summary with CTA                   │
│                                                     │
│ [Generate All 3 Derivatives]  [Skip]               │
└─────────────────────────────────────────────────────┘
```

**User clicks [Generate All 3]:**
- ✅ Creates Post Group "SaaS Growth Hacks"
- ✅ Generates LinkedIn draft (repurposed from blog)
- ✅ Generates Twitter thread draft (repurposed from blog)
- ✅ Generates Newsletter draft (repurposed from blog)
- ✅ Links all 4 posts to the group
- ✅ User can edit each derivative before publishing
- ✅ Campaign analytics auto-aggregate across all posts

**That's when users stop leaving to ChatGPT.**

---

## 📦 Post Group Detail View (After Campaign Created)

```
┌─────────────────────────────────────────────────────┐
│ 📦 SaaS Growth Hacks Campaign                       │
│ Campaign • 4 posts • 1 published, 3 drafts          │
│ [Edit Campaign] [Analytics] [Generate More]         │
├─────────────────────────────────────────────────────┤
│ PRIMARY POST                                        │
│ ┌───────────────────────────────────────────────┐  │
│ │ 🌐 Blog: "10 SaaS Growth Hacks That Work"     │  │
│ │ Published Apr 1 • 1,234 views                 │  │
│ │ [Edit] [View Analytics]                       │  │
│ └───────────────────────────────────────────────┘  │
│                                                     │
│ DERIVATIVES                                         │
│ ┌───────────────────────────────────────────────┐  │
│ │ 📱 LinkedIn: Key insights version              │  │
│ │ Draft • [Edit] [Publish]                      │  │
│ └───────────────────────────────────────────────┘  │
│ ┌───────────────────────────────────────────────┐  │
│ │ 🐦 Twitter: 10-part thread                    │  │
│ │ Draft • [Edit] [Schedule]                     │  │
│ └───────────────────────────────────────────────┘  │
│ ┌───────────────────────────────────────────────┐  │
│ │ 📧 Newsletter: Summary + CTA                  │  │
│ │ Draft • [Edit] [Send]                         │  │
│ └───────────────────────────────────────────────┘  │
│                                                     │
│ CAMPAIGN ANALYTICS (Aggregated)                    │
│ 📊 Total: 1,234 views • 89 clicks • 23 shares      │
│                                                     │
│ 💡 SUGGESTION: Missing Medium cross-post           │
│    [Generate Medium Version]                       │
└─────────────────────────────────────────────────────┘
```

---

## Summary: Post Groups = The Real Retention Multiplier

### What Changed:
- ✅ Keep AI selectors in modals (user override control)
- ✅ **NEW: Post Groups replace simple parent/child links** (campaigns, series, syndication)
- ✅ **"Generate Derivatives" button replaces "What's Next?" cards** (more powerful)
- ✅ Simplify data model (merge WorkflowMemory)

### Why Post Groups are Better:
| Feature | Simple Links | Post Groups |
|---------|-------------|-------------|
| Campaign management | ❌ | ✅ Group related content |
| Series ordering | ❌ | ✅ Part 1, 2, 3... |
| Aggregated analytics | ❌ Manual | ✅ Auto-calculated |
| One-click derivatives | ❌ | ✅ Generate LinkedIn + Twitter + Newsletter |
| Multi-platform tracking | ❌ Scattered | ✅ Centralized |
| "Complete campaign" hints | ❌ | ✅ "Missing Twitter?" |

### Net Effort:
- **Week 1:** Data models (BrandBrain cleanup + PostGroup)
- **Week 2:** Post Group UI (list, detail, "add to group")
- **Week 3:** **"Generate Derivatives" magic** (the wow factor)
- **Week 4:** Intelligence (auto-suggest, complete campaign, analytics)
- **Total:** 4 weeks
- **Risk:** Low (all additive features)

### Expected Impact:
- **7-Day Return Rate:** 20% → **70%+** (+350% lift)
- **Session Length:** 15 min → **60+ min** (create campaign + derivatives)
- **Content Per Session:** 1 post → **4-6 pieces** (primary + derivatives)
- **External Tool Switching:** 3+ tools → **0 tools** (everything in PirateCOS)

---

## 📄 Technical Specs

- **`POST_GROUP_CONTENT_CONTINUITY_SPEC.md`** — Full technical implementation details (schema, API endpoints, UI mockups, workflows)

---

**Ready to start?**

**Option A:** Start with Week 1 (BrandBrain cleanup + PostGroup model)
**Option B:** Jump straight to Week 3 ("Generate Derivatives" prototype)
**Option C:** Review the Post Group spec first, tweak anything

Which one?
