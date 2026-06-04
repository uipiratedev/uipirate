# Phase 4 — User Input Handling (Brief & Keywords)

> **Document Type:** Clarification & Enhancement
> **Purpose:** Addresses how user-provided `brief` and `keywords` are integrated into the AI generation system
> **Status:** Critical improvement identified during audit

---

## Question Raised

> "btw you did take into notice the user can provide input etc when chatting or generating?"

**Answer:** YES! And thank you for catching this — it revealed a **critical gap** in the current implementation that Phase 4F+ now addresses.

---

## Current State: User Inputs Exist But Are Underutilized

### What Users Can Provide

#### In Workspace Chat (`/api/pirateCOS/ai/workspace`)
```typescript
// Request body (workspace/route.ts lines 31-43)
{
  postId: string;
  action: string;
  selectedText?: string;
  userMessage?: string;        // Chat message
  brief?: string;              // 🎯 USER TOPIC INPUT
  keywords?: string;           // 🎯 USER KEYWORD INPUT
  tone?: string;
  engine?: string;
  model?: string;
  sessionHistory?: AIWorkspaceMessage[];
}
```

#### In Main Generator (`/api/pirateCOS/ai/generate`)
```typescript
// Request body (generate/route.ts lines 29-45)
{
  action: string;
  title?: string;
  content?: string;
  postType?: string;
  contentGoal?: string;
  prompt?: string;             // Main generation prompt
  customBrandVoice?: string;   // 🎯 PER-POST OVERRIDE
  customAudience?: string;     // 🎯 PER-POST OVERRIDE
  customKeywords?: string[];   // 🎯 PER-POST OVERRIDE
  preset?: string;
  engine?: string;
  model?: string;
}
```

### The Problem: Weak Integration

**Current handling (workspace/route.ts lines 314-320):**
```typescript
let briefContext = "";
if (brief) {
  briefContext += `\n- Active Topic/Brief context: "${brief}"`;
}
if (keywords) {
  briefContext += `\n- Focus Keywords: "${keywords}"`;
}
// Then weakly appended to contextInfo string
```

**Issues:**
- ❌ Treated as **footnotes** in the prompt, not primary directives
- ❌ Easy for AI to **ignore** or deprioritize
- ❌ Buried after Brand Brain context
- ❌ Not integrated into preset directives

---

## Phase 4F+ Solution: Elevate User Inputs to Priority

### New Context Injection Order

```
BEFORE Phase 4F+:
1. Generic system prompt
2. User prompt
3. Preset directive (overwrites tone)
4. Brand Brain (conflicts with preset)
5. Brief/keywords (footnote, often ignored)

AFTER Phase 4F+:
1. Content Goal (strategic foundation)
2. Post Type (structural guidance)
3. USER BRIEF & KEYWORDS ⭐ ELEVATED TO #3
4. Brand Brain (identity and voice)
5. Preset Directive (task-specific)
6. User Prompt (final refinement)
```

### Implementation

**New Shared Function:**
```typescript
// lib/pirateCOS/ai-context-builder.ts
export function buildUserFocusContext(brief?: string, keywords?: string): string {
  if (!brief && !keywords) return "";
  
  let context = "\n\n[USER CONTENT FOCUS]:";
  
  if (brief) {
    context += `\n📌 PRIMARY TOPIC: "${brief.trim()}"
This is the CENTRAL THEME. All content must directly address this topic.`;
  }
  
  if (keywords) {
    context += `\n🎯 TARGET KEYWORDS: ${keywords.trim()}
Integrate these keywords naturally and prominently in:
- Headings (H2/H3)
- Opening paragraph
- Throughout the content
- Meta description (if applicable)`;
  }
  
  return context;
}
```

**Applied in Both Routes:**
```typescript
// generate/route.ts and workspace/route.ts
const systemInstructions = 
  buildGoalContext(goalConfig)
  + buildTypeContext(typeConfig)
  + buildUserFocusContext(brief, keywords)  // ⭐ STEP 3: USER INPUT
  + buildBrandContext(brandBrain, customBrandVoice, customAudience, customKeywords)
  + buildPresetDirective(preset, postType, contentGoal, typeConfig, goalConfig)
  + userPrompt;
```

---

## Per-Post Overrides: customBrandVoice, customAudience, customKeywords

### Current Implementation (Already Supported!)

The generate route already supports **per-post overrides**:

```typescript
// generate/route.ts lines 238-243
const activeVoice = customBrandVoice || brandBrain?.brandVoice;
const activeAudience = customAudience || brandBrain?.audienceICP;
const activeKeywords = customKeywords || brandBrain?.targetKeywords || [];
```

### Phase 4F+ Enhancement

**Updated priority in `buildBrandContext()`:**
```typescript
function buildBrandContext(
  brandBrain: any,
  customBrandVoice?: string,
  customAudience?: string,
  customKeywords?: string[]
): string {
  // Custom inputs OVERRIDE Brand Brain defaults
  const activeVoice = customBrandVoice || brandBrain?.brandVoice;
  const activeAudience = customAudience || brandBrain?.audienceICP;
  const activeKeywords = customKeywords || brandBrain?.targetKeywords || [];
  
  // ... build context with overrides taking precedence
}
```

**Why this matters:**
- User wants to write ONE post in a different voice → `customBrandVoice`
- User wants to target a SPECIFIC audience for this post → `customAudience`
- User wants to focus on DIFFERENT keywords → `customKeywords`
- Brand Brain settings preserved for all OTHER posts

---

## Example: Complete User Flow

### Scenario: User Writes React Performance Tutorial

**User Inputs:**
```json
{
  "postType": "tutorial",
  "contentGoal": "traffic",
  "brief": "How to optimize React performance using useMemo and useCallback hooks",
  "keywords": "React performance, useMemo, useCallback, optimization",
  "customKeywords": ["React hooks", "performance optimization"],
  "preset": "seo-article"
}
```

**Phase 4F+ Context Construction:**

```
1. CONTENT STRATEGY GOAL: Traffic
   → "Optimize for organic search traffic. Prioritize keyword-rich headings..."

2. CONTENT ARCHETYPE: Tutorial
   → "Structure as step-by-step tutorial with code examples..."

3. USER CONTENT FOCUS: ⭐ PRIORITY
   → 📌 PRIMARY TOPIC: "How to optimize React performance using useMemo..."
   → 🎯 TARGET KEYWORDS: "React performance, useMemo, useCallback..."

4. BRAND BRAIN:
   → Company: "Tech Tutorials Co"
   → Voice: "Friendly, beginner-accessible"
   → Brand Keywords: ["React hooks", "performance optimization"] (custom override!)

5. PRESET DIRECTIVE: SEO Article
   → "1,000-3,000 words, FAQ section, H2/H3 structure"

6. USER PROMPT:
   → "Write a comprehensive guide"
```

**AI Output:**
- ✅ Centers on useMemo/useCallback (from brief)
- ✅ Integrates target keywords in headings
- ✅ Uses friendly, accessible tone (Brand Brain)
- ✅ Follows tutorial structure (postType)
- ✅ SEO-optimized with FAQ section (preset + goal)
- ✅ 1,500-2,000 words (enforced by Phase 4F+)

---

## UI/UX: Where Users Provide These Inputs

### Workspace Chat Interface

**Brief & Keywords Form** (`components/pirateCOS/workspace/ConversationThread.tsx` lines 166-194):

```typescript
<form>
  <input
    type="text"
    value={brief}
    onChange={(e) => setBrief(e.target.value)}
    placeholder="What is this post about?"
  />
  <input
    type="text"
    value={keywords}
    onChange={(e) => setKeywords(e.target.value)}
    placeholder="Keywords (optional)"
  />
  <button type="submit">Get Custom Ideas</button>
</form>
```

**When shown:**
- User opens workspace with NO editor content
- User clicks "Suggest Ideas" button
- User wants AI to generate topic-specific suggestions

### Generate Route (Future Enhancement)

Currently, `brief` and `keywords` are not exposed in the main generate UI, but the API supports them. Consider adding:

```typescript
// In create/page.tsx or edit/[id]/page.tsx
<div className="generation-form">
  <input
    placeholder="Topic brief (optional)"
    value={brief}
    onChange={(e) => setBrief(e.target.value)}
  />
  <input
    placeholder="Focus keywords (optional)"
    value={keywords}
    onChange={(e) => setKeywords(e.target.value)}
  />
  <select value={preset}>
    <option value="seo-article">SEO Article</option>
    {/* ... other presets */}
  </select>
  <button onClick={handleGenerate}>Generate</button>
</div>
```

---

## Summary: User Inputs Are Now First-Class Citizens

| Input Type | Before Phase 4F+ | After Phase 4F+ |
|------------|------------------|-----------------|
| **brief** | Footnote in contextInfo | **#3 priority** in prompt construction |
| **keywords** | Weak suggestion | **Prominently integrated** in headings and content |
| **customBrandVoice** | Overrides Brand Brain (already works) | Preserved, used in buildBrandContext |
| **customAudience** | Overrides Brand Brain (already works) | Preserved, used in buildBrandContext |
| **customKeywords** | Overrides Brand Brain (already works) | Preserved, used in buildBrandContext |

**Impact:**
- ✅ User-provided `brief` becomes the **central theme** of generated content
- ✅ User-provided `keywords` are **strategically placed** in headings and throughout content
- ✅ Per-post overrides allow **one-off customization** without changing Brand Brain
- ✅ AI respects user intent **without sacrificing** Brand Brain identity

---

**Thank you for catching this! The audit is now complete with full user input integration.** 🎉
