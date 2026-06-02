# Phase 4B — Content Lifecycle Orchestration: Implementation Plan

> **Scope:** Complete all remaining Phase 4B items from [PRESET_REWORK_PLAN.md](file:///d:/ui-pirate/uipirate/PRESET_REWORK_PLAN.md) and [PirateCOS-Project-Matser-Plan.md](file:///d:/ui-pirate/uipirate/PirateCOS-Project-Matser-Plan.md) (lines 82–99).
>
> **Already complete:** Multi-engine AI provider policy ✅ | Anthropic Claude integration ✅ | BYOK/SaaS gating ✅

---

## Current State Assessment

### What exists today:
- [Post.ts](file:///d:/ui-pirate/uipirate/models/Post.ts) — has `postType` with only 4 enums (`blog | tutorial | case-study | community-insight`), no `contentGoal` field
- [create/page.tsx](file:///d:/ui-pirate/uipirate/app/pirateCOS/(authed)/posts/create/page.tsx) — has a basic 1-step type picker (4 types only)
- [edit/[id]/page.tsx](file:///d:/ui-pirate/uipirate/app/pirateCOS/(authed)/posts/edit/%5Bid%5D/page.tsx) — loads post type but no goal-based adaptation
- [DistributionPanel.tsx](file:///d:/ui-pirate/uipirate/components/pirateCOS/DistributionPanel.tsx) — basic channel list, no AI advisor or distribution intelligence
- [generate/route.ts](file:///d:/ui-pirate/uipirate/app/api/pirateCOS/ai/generate/route.ts) — Brand Brain injection exists but no goal-specific prompts
- `lib/pirateCOS/postTypeConfig.ts` — **does not exist yet**

### What needs to be built (8 milestones):

| # | Milestone | Status | Est. |
|---|---|---|---|
| 1 | Centralized config system (`postTypeConfig.ts`) | ⬜ | 1 day |
| 2 | Post model schema extension | ⬜ | 0.5 day |
| 3 | 3-step creation wizard | ⬜ | 2 days |
| 4 | Dynamic editor workspace adaptation | ⬜ | 1 day |
| 5 | Content Health scoring dashboard | ⬜ | 1 day |
| 6 | Distribution Intelligence panel + AI Advisor | ⬜ | 1.5 days |
| 7 | Goal-specific AI prompt injection | ⬜ | 0.5 day |
| 8 | Edit page adaptation | ⬜ | 0.5 day |
| **Total** | | | **~8 days** |

---

## User Review Required

> [!IMPORTANT]
> **Execution Order Matters:** Milestones 1–2 are pure foundation (config + schema). They have no UI impact and must land first. Milestones 3–4 are the core UX change (wizard + workspace). Milestones 5–7 are progressive enhancements. Milestone 8 is follow-up.

> [!WARNING]
> **Breaking Change:** The `postType` enum expansion adds 7 new values. Existing posts with old types (`blog`, `tutorial`, `case-study`, `community-insight`) will continue to work. New posts will have access to all 11 types. However, the wizard replaces the old type picker — users can no longer skip goal selection for new posts.

---

## Open Questions

> [!IMPORTANT]
> **Q1: Case Study Sub-Styles.** The [PRESET_REWORK_PLAN.md](file:///d:/ui-pirate/uipirate/PRESET_REWORK_PLAN.md) specifies 3 case study sub-styles (Indie Builder, Enterprise, Architectural) and 4 corporate sub-styles. Should these be built in this phase or deferred? They add complexity to the wizard (a sub-step after goal selection for certain types).

> [!IMPORTANT]
> **Q2: Distribution Chains & Distribution Memory.** The spec includes full Distribution Chain Templates (SEO Growth Chain, Founder Authority Chain, etc.) and a Distribution Memory learning system. These are complex features. Should we build:
> - **(A)** The full chain system in this phase
> - **(B)** A simplified "recommended actions" panel now, with full chains deferred to a follow-up
> - **(C)** Skip chains entirely and focus on the wizard + workspace adaptation

> [!IMPORTANT]
> **Q3: Content State Machine.** The spec defines 7 lifecycle states (Draft → Structured → Optimized → Distribution Ready → Published → Repurposed → Tracked). Implementing the full state machine requires tracking state transitions across every save/publish/distribute action. Should we:
> - **(A)** Build the full state machine now
> - **(B)** Start with a simplified 3-state model (Draft → Published → Distributed) and expand later

---

## Proposed Changes

### Milestone 1 — Centralized Config System

#### [NEW] [postTypeConfig.ts](file:///d:/ui-pirate/uipirate/lib/pirateCOS/postTypeConfig.ts)

The single source of truth for the entire Content Lifecycle Orchestration feature. Every other file imports from here.

**Contents:**
- `ContentGoal` type union: `'traffic' | 'authority' | 'conversion' | 'engagement' | 'lead-generation' | 'retention'`
- `ContentGoalConfig` interface with `value`, `label`, `icon`, `description`, `hint`, `aiPriorityPrompt`, and `healthWeights` (7 metric multipliers)
- `PostTypeFeatures` interface: boolean flags for `seoPanel`, `featuredImage`, `bannerImage`, `codeBlocks`, `tables`, `aiCopilot`, `repurposing`, `affiliateLinks`, `socialPreview`, `taskLists`, `ctaBlocks`, `distributionAI`
- `PostTypeConfig` interface: `value`, `label`, `category`, `description`, `bestFor`, `estimatedReadTime`, `minWordCount`, `maxWordCount`, `icon`, `features`, `featurePills`, `templateHint`, `suggestedGoals`, `distributionChannels`
- `CONTENT_GOALS` array: 6 entries matching the spec table from PRESET_REWORK_PLAN.md (lines 86–93)
- `POST_TYPE_CONFIGS` array: 11 entries matching the two category tables from PRESET_REWORK_PLAN.md (lines 52–71)
- Helper functions: `getPostTypeConfig(value)`, `getGoalConfig(value)`, `getPostTypesByCategory(cat)`

**Feature matrix alignment** (from PRESET_REWORK_PLAN.md lines 488–503):
Each `PostTypeConfig.features` object will exactly match the ✅/❌ grid in the Feature Matrix table.

---

### Milestone 2 — Post Model Schema Extension

#### [MODIFY] [Post.ts](file:///d:/ui-pirate/uipirate/models/Post.ts)

**Interface change (line 26):**
```diff
- postType?: "blog" | "tutorial" | "case-study" | "community-insight";
+ postType?: "blog" | "tutorial" | "case-study" | "community-insight" | "product-review" | "product-launch" | "listicle" | "comparison" | "newsletter" | "social-post" | "corporate-post";
+ contentGoal?: "traffic" | "authority" | "conversion" | "engagement" | "lead-generation" | "retention";
```

**Schema change (lines 134–138):**
```diff
  postType: {
    type: String,
-   enum: ["blog", "tutorial", "case-study", "community-insight"],
+   enum: ["blog", "tutorial", "case-study", "community-insight", "product-review", "product-launch", "listicle", "comparison", "newsletter", "social-post", "corporate-post"],
    default: "blog",
  },
+ contentGoal: {
+   type: String,
+   enum: ["traffic", "authority", "conversion", "engagement", "lead-generation", "retention"],
+ },
```

> No migration required — MongoDB is schemaless. Existing posts simply won't have `contentGoal`, which defaults to `undefined`.

---

### Milestone 3 — 3-Step Creation Wizard

#### [MODIFY] [create/page.tsx](file:///d:/ui-pirate/uipirate/app/pirateCOS/(authed)/posts/create/page.tsx)

This is the highest-complexity change. The current single-step type picker (~lines 6521–6639) is replaced with a 3-step guided wizard.

**New state variables:**
```typescript
const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);
const [contentGoal, setContentGoal] = useState<ContentGoal>('traffic');
// postType state already exists — reused
```

**Step 1 — Intent Selection:**
- Renders 11 type cards in 2 category groups ("Content & Knowledge" / "Product & Monetization")
- Each card shows: icon, label, description, feature pills, estimated read time
- Layout: 3-column grid on `md+`, 2-column on `sm`, 1-column on `xs`
- Selecting a card highlights it and enables the "Continue →" button
- "Cancel" closes the wizard and navigates back to posts list
- Visual design: dark-themed cards with glassmorphism, `#FF5B04` accent on selected card

**Step 2 — Goal Selection:**
- Shows 6 goal cards with icon, label, description, and system behavior hint
- Back button returns to Step 1
- Selecting a goal highlights it and enables "Continue →"
- Footer shows the selected type pill: `✏️ Blog`

**Step 3 — Workspace Preview & Confirmation:**
- Header shows: `✏️ Blog × 📈 Traffic`
- "YOUR WORKSPACE WILL INCLUDE" section: renders ✅/❌ for each feature from `PostTypeFeatures`
- "AI WILL PRIORITIZE" section: renders the `aiPriorityPrompt` from the selected `ContentGoalConfig`
- "Start Writing" button commits the selection and opens the editor
- Info note: "You can still access all tools from the slash command menu if needed."

**Animation:** Steps transition with a horizontal slide animation (left-to-right for forward, right-to-left for back).

---

### Milestone 4 — Dynamic Editor Workspace Adaptation

#### [MODIFY] [create/page.tsx](file:///d:/ui-pirate/uipirate/app/pirateCOS/(authed)/posts/create/page.tsx)

After the wizard commits, the editor workspace adapts:

**FormattingToolbar adaptation:**
- Receives `features: PostTypeFeatures` prop (derived from `getPostTypeConfig(postType)`)
- Code block button: visible only when `features.codeBlocks === true`
- Table button: visible only when `features.tables === true`  
- CTA inserter button: visible only when `features.ctaBlocks === true`
- Affiliate link tool: visible only when `features.affiliateLinks === true`
- Task list button: visible only when `features.taskLists === true`

**Sidebar tab adaptation:**
- `seo` tab: hidden when `features.seoPanel === false` (e.g., Newsletter, LinkedIn/Social)
- `distribute` tab: always visible — now shows Distribution Intelligence (Milestone 6)
- `ai` tab: prompts tuned by `contentGoal` (Milestone 7)
- New `health` tab: Content Health scoring dashboard (Milestone 5)

**Editor header badge:**
- Displays: `✏️ Blog × 📈 Traffic` (icon + type × icon + goal)
- Non-editable indicator (locked after wizard confirmation)
- Click opens a tooltip: "Post type and goal were set during creation. Create a new post to change them."

**Content goal sent to save:**
- When saving a post (`POST /api/pirateCOS/posts` or `PUT /api/pirateCOS/posts/[id]`), include the `contentGoal` field in the payload

---

### Milestone 5 — Content Health Scoring Dashboard

#### [NEW] ContentHealthPanel component (embedded in sidebar `health` tab)

**Metrics calculated client-side from post content:**

| Metric | Calculation | Weight Source |
|---|---|---|
| **SEO Score** | Keyword density + meta presence + heading structure | `healthWeights.seoScore` |
| **Readability** | Sentence length + paragraph length + grade level | `healthWeights.readability` |
| **Engagement Likelihood** | Hook strength + question density | `healthWeights.engagementLikelihood` |
| **Conversion Strength** | CTA count + benefit language ratio | `healthWeights.conversionStrength` |
| **CTA Strength** | CTA clarity + placement + verb quality | `healthWeights.ctaStrength` |
| **Structure Quality** | H2/H3 hierarchy + section balance | `healthWeights.structureQuality` |
| **Distribution Readiness** | Excerpt + image + tags + meta complete | `healthWeights.distributionReadiness` |

**Overall score:** Weighted average using the `healthWeights` from the active `ContentGoalConfig`.

**Visual design:**
- Circular progress ring showing overall health score (0–100)
- 7 metric rows below, each with a horizontal progress bar and score
- Color coding: 0–40 red, 41–70 amber, 71–100 green
- Expandable tips per metric: "Add a focus keyword to improve your SEO score"

**Distribution Readiness Score (per-channel):**
- SEO, LinkedIn, Newsletter, Conversion, X/Twitter
- Each shows a score (0–100) based on content attributes
- AI advisor text below: "Strong for SEO and LinkedIn. Weak for newsletter — shorten intro."

---

### Milestone 6 — Distribution Intelligence Panel + AI Advisor

#### [MODIFY] [DistributionPanel.tsx](file:///d:/ui-pirate/uipirate/components/pirateCOS/DistributionPanel.tsx)

**New props:**
```typescript
postType: string;
contentGoal: ContentGoal;
```

**New sections added to the panel (above existing channel list):**

**6A. AI Recommendations section:**
- AI-generated channel fit analysis based on `postType + contentGoal`
- Shows ✅ (ideal), ⚠️ (consider), ❌ (not recommended) per channel
- Example: "This content is ideal for LinkedIn thought leadership ✅"
- Timing suggestion: "Suggested: publish Tuesday 9–11 AM for peak engagement"

**6B. Content Repurposing section:**
- Checkboxes for repurposing outputs:
  - Generate LinkedIn promotion post (2–3 variants)
  - Generate X thread
  - Generate newsletter summary
  - Generate quote snippets
  - Generate carousel text
- Links to existing RepurposingDrawer for execution

**6C. Post-Publish Actions section (shown after successful publish):**
- "What next?" prompt with action buttons linking to repurposing, social promotion, etc.

**The existing preflight checklist, channel selector, and distribution history sections remain unchanged** — they sit below the new intelligence sections.

---

### Milestone 7 — Goal-Specific AI Prompt Injection

#### [MODIFY] [generate/route.ts](file:///d:/ui-pirate/uipirate/app/api/pirateCOS/ai/generate/route.ts)

**Request body extension:**
```typescript
// Accept optional contentGoal in the request body
const { contentGoal, postType, ...rest } = await req.json();
```

**Prompt injection logic:**
```typescript
import { getGoalConfig, getPostTypeConfig } from '@/lib/pirateCOS/postTypeConfig';

// Build goal-specific system prompt section
const goalConfig = contentGoal ? getGoalConfig(contentGoal) : null;
const typeConfig = postType ? getPostTypeConfig(postType) : null;

let contentContextPrompt = '';
if (goalConfig) {
  contentContextPrompt += `\n# CONTENT GOAL: ${goalConfig.label}\n${goalConfig.aiPriorityPrompt}\n`;
}
if (typeConfig) {
  contentContextPrompt += `\n# CONTENT TYPE: ${typeConfig.label}\n${typeConfig.templateHint}\n`;
}

// Inject BEFORE Brand Brain context (which already exists in the route)
systemPrompt = contentContextPrompt + systemPrompt;
```

This ensures that goal+type context is injected into every AI generation call (writing, SEO, tags, excerpts, repurposing).

---

### Milestone 8 — Edit Page Adaptation

#### [MODIFY] [edit/[id]/page.tsx](file:///d:/ui-pirate/uipirate/app/pirateCOS/(authed)/posts/edit/%5Bid%5D/page.tsx)

**Load `contentGoal` from saved post:**
```typescript
const [contentGoal, setContentGoal] = useState<ContentGoal | undefined>(undefined);

// In the data fetch effect:
if (postData.contentGoal) {
  setContentGoal(postData.contentGoal);
}
```

**Apply same adaptations as create page:**
- FormattingToolbar receives `features` based on `postType`
- Sidebar tabs adapt (hide/show SEO, add health tab)
- Editor header shows type × goal badge
- AI prompts inject goal context
- Distribution panel receives `postType` and `contentGoal` props

**No wizard on edit page** — type and goal are loaded from the database. If `contentGoal` is `undefined` (old posts), the workspace defaults to full features with no goal-weighted health scoring.

---

## Verification Plan

### Automated Tests

1. **Config validation:** Unit test that all 11 `POST_TYPE_CONFIGS` entries have valid `features` objects and all 6 `CONTENT_GOALS` entries have valid `healthWeights` summing to consistent totals.
2. **Schema validation:** Create a post with each of the 11 `postType` values and 6 `contentGoal` values via `POST /api/pirateCOS/posts` — verify no validation errors.
3. **Build verification:** `npm run build` passes with zero TypeScript errors.

### Manual / Browser Verification

1. Navigate to `/pirateCOS/posts/create` → 3-step wizard renders with all 11 types in 2 categories
2. Select "Blog" → Step 2 shows 6 goals → Select "Traffic" → Step 3 shows correct ✅/❌ checklist
3. Click "Start Writing" → editor loads with adapted toolbar (no code blocks for Blog)
4. Change selection to "Tutorial × Authority" → verify code blocks ARE visible, SEO panel IS present
5. Change selection to "Newsletter × Engagement" → verify SEO tab IS hidden, code blocks hidden
6. Verify AI generation with goal context: "Blog × Traffic" should produce SEO-focused output; "Blog × Engagement" should produce hook-first output
7. Save post → reload edit page → verify `contentGoal` persists and workspace adapts correctly
8. Old posts (no `contentGoal`) → edit page loads with full features, no crash
9. All 11 types × 6 goals = 66 combinations work (spot check 5–10 key combos)
10. Content Health dashboard shows different metric weightings for Traffic vs. Engagement goals
11. Distribution panel shows AI recommendations based on type + goal
