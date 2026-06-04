# Phase 4 — Consolidated Implementation Roadmap

> **Status:** Phases 4F, 4F+, 4G are **Spec Complete / Code NOT Implemented**  
> **Decision Date:** 2026-06-04  
> **Purpose:** Merge Final Foundation Plan into Phase 4 with correct dependency order

---

## Executive Summary

**Current State:**
- ✅ Phase 4E (AI Workspace Panel) is implemented and working
- ✅ Brand Brain exists but needs enhancement (Workspace Brain upgrade)
- ✅ Credit system exists but needs refinement
- ✅ AI access control partially implemented (BYOK working)
- ❌ Phase 4F (Precision Editing) - Spec only
- ❌ Phase 4F+ (Context Builder) - Spec only  
- ❌ Phase 4G (RLHF Infrastructure) - Spec only
- ❌ Content History & Versioning - Missing
- ❌ Workspace Brain hierarchy - Missing

**Critical Discovery:**
The "Final Foundation Plan" identifies gaps that must be filled BEFORE implementing Phases 4F/4F+/4G. We need to reorganize into a logical dependency chain.

---

## Dependency Analysis

### What Phase 4F+ Needs:
- Centralized context builder (`lib/pirateCOS/ai-context-builder.ts`)
- User brief/keywords elevation
- HTML normalizer

### What Phase 4F Needs:
- **Depends on Phase 4F+** (needs centralized context builder)
- Edit intent classification logic
- Surgical edit prompts

### What Phase 4G Needs:
- **Depends on both 4F and 4F+** (needs full context stack in place)
- AIGenerationLog model
- Prompt registry
- RLHF pipeline

### What Final Foundation Needs:
- **Independent** - Can run in parallel with 4F+
- Workspace Brain upgrade (replaces Organization Brain)
- Content History model
- Enhanced credit tracking

---

## Reorganized Phase 4 Family

| Phase | Name | Dependencies | Timeline |
|-------|------|--------------|----------|
| **4F.0** | Foundation Prep | None | Week 1 |
| **4F+** | Context Builder & Consistency | 4F.0 | Weeks 2-3 |
| **4F** | Precision Editing | 4F+ | Week 4 |
| **4F.1** | Workspace Brain Upgrade | None (parallel) | Weeks 2-3 |
| **4F.2** | Content History & Versioning | None (parallel) | Week 4 |
| **4G** | RLHF Infrastructure | 4F, 4F+, 4F.1 | Weeks 5-12 |

---

## Phase 4F.0 — Foundation Prep [NEW - Week 1]

**Goal:** Prepare the codebase for centralized context building

### Tasks:
- [ ] **Audit existing context construction** in workspace/generate routes
- [ ] **Extract common patterns** into reusable interfaces
- [ ] **Create type definitions** for AIContextConfig, AIContextResult
- [ ] **Document current prompt hierarchy** (as-is state)
- [ ] **Test suite setup** for context builder validation

**Files to create:**
- `lib/pirateCOS/types/ai-context.ts` (type definitions)

**Deliverables:**
- Clear understanding of current state
- Type definitions ready for context builder
- Test framework in place

---

## Phase 4F+ — Context Builder & Consistency [Weeks 2-3]

**Goal:** Centralize ALL prompt construction logic

### Week 2: Core Infrastructure

#### Task 1: Create Context Builder
- [ ] Create `lib/pirateCOS/ai-context-builder.ts`
- [ ] Implement `buildAIContext(config)` function
- [ ] Implement `buildUserFocusContext(brief, keywords)` ⭐ **Priority**
- [ ] Implement `buildBrandContext(brandBrain, ...)` helper
- [ ] Implement `buildGoalContext(goalConfig)` helper
- [ ] Implement `buildTypeContext(typeConfig)` helper
- [ ] Implement `buildPresetDirective(preset, ...)` helper

#### Task 2: Create HTML Normalizer
- [ ] Create `lib/pirateCOS/html-normalizer.ts`
- [ ] Implement `normalizeHTML(rawHtml, postType)` function
- [ ] Strip markdown wrappers
- [ ] Fix heading hierarchy (H1→H2, no skipped levels)
- [ ] Enforce postType constraints (social-post = no headings)
- [ ] Remove unsafe tags (script, iframe)

### Week 3: Route Refactoring

#### Task 3: Refactor Workspace Route
- [ ] Replace lines 312-410 in `workspace/route.ts` with `buildAIContext()`
- [ ] Apply `normalizeHTML()` to all outputs
- [ ] Test all quick actions still work
- [ ] Test chat still works
- [ ] Test suggestions still work

#### Task 4: Refactor Generate Route
- [ ] Replace lines 181-233 in `generate/route.ts` with `buildAIContext()`
- [ ] Apply `normalizeHTML()` to all outputs
- [ ] Test SEO analysis
- [ ] Test title/tag generation
- [ ] Test "write" action

#### Task 5: Cross-Provider Testing
- [ ] Test OpenAI
- [ ] Test Anthropic
- [ ] Test Gemini
- [ ] Test Mistral
- [ ] Measure output consistency (target: 95%+)

**Success Criteria:**
- ✅ User brief/keywords now #3 priority (before Brand Brain)
- ✅ All routes use same context builder
- ✅ 95%+ output consistency across providers
- ✅ No regression in existing features

---

## Phase 4F — Precision Editing [Week 4]

**Goal:** Add surgical edit detection to prevent regeneration drift

**Dependencies:** Requires Phase 4F+ context builder

### Tasks:

#### Task 1: Edit Intent Classification
- [ ] Add `classifyEditIntent(userMessage, action)` to context builder
- [ ] Implement regex patterns for surgical/transform/rewrite/continue
- [ ] Test pattern matching with 20+ test cases

#### Task 2: Backend Logic
- [ ] Update workspace route to use edit intent
- [ ] Branch system instructions based on intent
- [ ] Add "✏️ Change summary:" instruction for surgical edits
- [ ] Skip Brand Brain for surgical edits
- [ ] Return `suggestedApplyMode` in response

#### Task 3: Frontend Integration
- [ ] Update `ConversationThread.tsx` with `parseAIResponse()` helper
- [ ] Display change summary badge
- [ ] Add "Recommended" badge to apply buttons
- [ ] Update `useAIWorkspaceSession.ts` to handle `suggestedApplyMode`

#### Task 4: Testing
- [ ] Test: "remove all em-dashes" → only removes em-dashes
- [ ] Test: "change 'utilize' to 'use'" → only that substitution
- [ ] Test: "make this more conversational" → transforms while preserving
- [ ] Test: "rewrite for developers" → full regeneration

**Success Criteria:**
- ✅ Surgical edits make ONLY requested changes
- ✅ Change summaries displayed
- ✅ Apply mode suggestions work
- ✅ No more "regeneration drift"

---

## Phase 4F.1 — Workspace Brain Upgrade [NEW - Weeks 2-3, Parallel with 4F+]

**Goal:** Upgrade Brand Brain → Workspace Brain (supports individuals + teams)

**From Final Foundation Plan Priority 1**

### Current State:
- ✅ Brand Brain model exists
- ✅ GET/POST `/api/pirateCOS/brand-brain` routes exist
- ❌ Missing: Team Brain hierarchy
- ❌ Missing: Workspace concept

### Architecture Change:

**OLD:** Organization → Team → User  
**NEW:** Workspace → Team (optional) → User

### Tasks:

#### Task 1: Rename & Extend Model
- [ ] Rename `BrandBrain` → `WorkspaceBrain` (or keep BrandBrain but add workspace fields)
- [ ] Add `workspaceType: "individual" | "team"` field
- [ ] Add `workspaceName` field (replaces companyName)
- [ ] Add `teamBrains: []` array for team-level overrides (optional)
- [ ] Keep all existing fields for backward compatibility

#### Task 2: Update API Routes
- [ ] Rename `/api/pirateCOS/brand-brain` → `/api/pirateCOS/workspace-brain` (or keep old route for backward compat)
- [ ] Update GET handler to return workspace context
- [ ] Update POST handler to support workspace + team structure

#### Task 3: Update Context Builder
- [ ] Update `buildBrandContext()` in context builder to use WorkspaceBrain
- [ ] Add team-level override logic
- [ ] Maintain backward compatibility with existing Brand Brain data

#### Task 4: Frontend Migration
- [ ] Update `brand-brain/page.tsx` → `workspace-brain/page.tsx` (or update in place)
- [ ] Add workspace type selector (Individual / Team)
- [ ] Show team brain section only for team workspaces
- [ ] Update all references

**Success Criteria:**
- ✅ Supports both individual creators and teams
- ✅ Backward compatible with existing Brand Brain data
- ✅ Clear UI for workspace vs. team vs. user settings

---

## Phase 4F.2 — Content History & Versioning [NEW - Week 4, Parallel with 4F]

**Goal:** Git-style version control for content

**From Final Foundation Plan Priority 7**

### Current State:
- ✅ Post model exists
- ✅ `aiWorkspaceSession.generations` tracks AI history
- ❌ Missing: Full content snapshots
- ❌ Missing: Diff tracking
- ❌ Missing: Manual edit tracking

### Tasks:

#### Task 1: Create ContentHistory Model
- [ ] Create `models/pirateCOS/ContentHistory.ts`
- [ ] Schema: `{ postId, version, snapshot, diff, changedBy, aiGenerated, timestamp, changeType, commitMessage }`
- [ ] Indexes: `{ postId: 1, version: -1 }`, `{ postId: 1, timestamp: -1 }`

#### Task 2: Version Tracking Logic
- [ ] Create `lib/pirateCOS/version-tracker.ts`
- [ ] Implement `createSnapshot(postId, content, user, changeType, aiAction?)` function
- [ ] Implement `calculateDiff(oldContent, newContent)` helper
- [ ] Implement `getVersionHistory(postId)` function
- [ ] Implement `restoreVersion(postId, version)` function

#### Task 3: Integration Points
- [ ] Hook into `PUT /api/pirateCOS/posts/:id` (manual saves)
- [ ] Hook into AI workspace apply actions (AI-generated changes)
- [ ] Hook into distribute actions (pre-distribution snapshots)
- [ ] Store AI action metadata with each snapshot

#### Task 4: UI (Optional - Can defer to Phase 5)
- [ ] Add "History" tab to editor sidebar
- [ ] Show version timeline
- [ ] Display diffs between versions
- [ ] Add "Restore" button

**Success Criteria:**
- ✅ Every save creates a version snapshot
- ✅ AI changes are tracked separately
- ✅ Can query version history via API
- ✅ Future-ready for team collaboration

---

## Phase 4G — RLHF Infrastructure [Weeks 5-12]

**Goal:** Transform from "LLM API wrapper" to "self-improving AI platform"

**Dependencies:** Requires 4F, 4F+, and 4F.1 to be complete

**See:** `Phase 4G — Implementation Checklist.md` for detailed breakdown

### Quick Overview:

#### Phase 4G-1: Data Instrumentation (Weeks 5-6)
- Create AIGenerationLog model with FULL context stack
- Log all generations from workspace/generate routes
- Implement feedback API

#### Phase 4G-2: Model-Agnostic Consistency (Weeks 7-8)
- Already done in Phase 4F+! ✅
- Cross-provider testing
- Performance benchmarking

#### Phase 4G-3: Prompt Registry (Week 9)
- Create versioned prompt registry
- Migrate hardcoded prompts
- A/B testing infrastructure

#### Phase 4G-4: RLHF Feedback Loop (Weeks 10-12)
- Performance aggregation cron
- Auto-learning insights API
- Admin UI for insights
- Workspace Brain auto-refinement suggestions

---

## Final Foundation Plan Integration Summary

### What's Already Built:
✅ **Brand Brain** (Priority 1) - Exists, needs upgrade to Workspace Brain (4F.1)
✅ **AI Access Control** (Priority 2) - BYOK working, needs credit ledger refinement
✅ **Credit System** (Priority 3) - Basic system exists, needs usage tracking enhancement
✅ **AI Workspace Panel** (Priority 6) - Phase 4E complete
✅ **Publishing Workflow** (Priority 8) - Distribution system exists
✅ **Repurposing Engine** (Priority 9) - Implemented in Phase 4B

### What Needs Building:
❌ **Workspace Brain hierarchy** (Priority 1) → **Phase 4F.1**
❌ **AI Context Engine** (Priority 5) → **Phase 4F+** (context builder)
❌ **Content History** (Priority 7) → **Phase 4F.2**
❌ **Credit Ledger & Usage Tracking** (Priority 2) → **Phase 4G-1** (part of AIGenerationLog)
❌ **Reader Response Analysis** → **Phase 5** (defer to analytics phase)
❌ **Billing Activation** → **Phase 5** (defer, Stripe integration exists)

---

## Revised Implementation Order

### ✅ Week 1: Phase 4F.0 — Foundation Prep
Prepare types, interfaces, test framework

### ✅ Weeks 2-3: Parallel Execution
- **Track A:** Phase 4F+ (Context Builder & Consistency)
- **Track B:** Phase 4F.1 (Workspace Brain Upgrade)

### ✅ Week 4: Parallel Execution
- **Track A:** Phase 4F (Precision Editing) — depends on 4F+
- **Track B:** Phase 4F.2 (Content History & Versioning)

### ✅ Weeks 5-12: Phase 4G — RLHF Infrastructure
- Week 5-6: Data Instrumentation (AIGenerationLog, Feedback API, Credit Ledger)
- Week 7-8: Cross-provider testing & benchmarking
- Week 9: Prompt Registry
- Week 10-12: RLHF Feedback Loop

---

## Total Timeline: 12 Weeks (3 Months)

**End State:**
- ✅ Surgical precision editing working
- ✅ Consistent AI output across all providers
- ✅ Workspace Brain supporting individuals + teams
- ✅ Git-style content versioning
- ✅ Full RLHF pipeline with auto-learning
- ✅ Production-ready for public launch

**Market Position:**
> "The only AI content platform that learns from your team's best work and gets smarter over time"

---

## Next Steps

1. ✅ **Review this roadmap** with stakeholders
2. ⬜ **Approve revised Phase 4 sequence**
3. ⬜ **Start Phase 4F.0** (Foundation Prep) - 1 week
4. ⬜ **Parallel execution:** Weeks 2-3 (4F+ and 4F.1)
5. ⬜ **Update project trackers** with new phase structure

**Decision Point:** Approve to proceed? [Yes / No / Needs Discussion]

---

**Document References:**
- Phase 4F Spec: `Phase 4F — Precision Chat Editing & Contextual Refinement.md` (583 lines)
- Phase 4F+ Spec: `Phase 4F+ — Full-Stack AI Consistency & Generation Optimization.md` (1,020 lines)
- Phase 4G Spec: `Phase 4G — Implementation Checklist.md` (150+ lines)
- Final Foundation: `PirateCOS_Final_Foundation_Plan.md` (588 lines)
- Implementation Tracker: `IMPLEMENTATION_TRACKER.md`
- Master Plan: `PirateCOS-Project-Matser-Plan.md`

