# Phase 4G — Architecture Comparison & Migration Guide

> **Document Type:** Technical comparison and migration strategy  
> **Purpose:** Side-by-side comparison of current vs. Phase 4G architecture  
> **Audience:** Development team implementing the transition  

---

## Current Architecture (Pre-Phase 4G)

### Data Flow: workspace/route.ts

```
User Input → Route Handler → Prompt Construction (lines 312-410) → LLM API → Response → Return
                                                                                              ↓
                                                                                    Post.aiWorkspaceSession.generations
                                                                                    (stores: prompt, output, isAccepted)
```

**Problems:**
- ❌ Prompt construction logic duplicated across 3 routes
- ❌ Context layers (Goal, Type, Brand) lost after generation
- ❌ No tracking of which Brand Brain settings were used
- ❌ HTML normalization missing (markdown wrappers leak through)
- ❌ Different output quality across OpenAI, Anthropic, Gemini

### Data Storage: Post.aiWorkspaceSession.generations

```typescript
{
  id: "gen_123",
  prompt: "Improve the writing, making it more engaging...",  // ❌ Lost context
  output: "<p>Improved text here</p>",                        // ❌ May have ```html wrappers
  mode: "improve",                                             // ✅ Action type
  appliedAt: Date,                                             // ✅ When accepted
  isAccepted: true,                                            // ✅ User feedback
  selectedTextContext: "Original text..."                     // ✅ What was selected
}
```

**Missing data:**
- What was the contentGoal?
- What was the postType?
- What Brand Brain settings were active?
- What was the user's brief/keywords?
- Which LLM model generated this?
- How long did it take?

---

## Phase 4G Architecture (Future)

### Data Flow with Instrumentation

```
User Input → buildAIContext() → PROMPT_REGISTRY → LLM API → normalizeHTML() → Response
                ↓                       ↓                                         ↓
         Context Stack          Prompt Version                        AIGenerationLog
         (6 layers logged)      (v1.0, v1.1)                          (FULL context stored)
                                                                                ↓
                                                                       Post.aiWorkspaceSession
                                                                       (backward compatibility)
```

**Improvements:**
- ✅ Centralized context building (no duplication)
- ✅ Full context stack logged for fine-tuning
- ✅ Versioned prompts (can A/B test and rollback)
- ✅ HTML normalized across all providers
- ✅ Consistent output quality (95%+ parity)

### Data Storage: AIGenerationLog (NEW)

```typescript
{
  generationId: "gen_123",
  tenantId: ObjectId("tenant_xyz"),
  postId: ObjectId("post_456"),
  
  context: {
    contentGoal: "traffic",             // ✅ SEO-focused
    postType: "tutorial",               // ✅ Step-by-step structure
    userBrief: "How to optimize React", // ✅ User's specific topic
    userKeywords: "React, useMemo",     // ✅ User's target keywords
    brandVoice: "Friendly, accessible", // ✅ Brand Brain setting
    brandAudience: "Junior developers", // ✅ Target audience
    brandKeywords: ["React", "hooks"],  // ✅ Brand keywords
    preset: "seo-article",              // ✅ Preset used
    editIntent: "surgical",             // ✅ Remove em-dashes
    selectedText: "Original text...",   // ✅ What was edited
  },
  
  modelConfig: {
    engine: "openai",                   // ✅ LLM provider
    model: "gpt-4o",                    // ✅ Specific model
    temperature: 0.7,                   // ✅ Generation params
    maxTokens: 2000
  },
  
  generation: {
    systemPrompt: "Full system instructions here...",  // ✅ Exact prompt used
    userPrompt: "Remove all em-dashes",                // ✅ User's message
    rawOutput: "```html\n<p>Text</p>\n```",            // ✅ Before normalization
    normalizedOutput: "<p>Text</p>",                   // ✅ After normalization
    tokensUsed: 1234,                                  // ✅ Cost tracking
    latencyMs: 1823,                                   // ✅ Performance
    costUSD: 0.0234                                    // ✅ Billing data
  },
  
  feedback: {
    action: "accepted",                 // ✅ User's decision
    appliedAt: Date,                    // ✅ When applied
    userEdits: "User changed X to Y",   // ✅ What user modified
    rating: 5,                          // ✅ Optional 1-5 stars
    flagReason: null                    // ✅ "hallucination", "off-brand"
  },
  
  performanceSignals: {
    postPublished: true,                // ✅ Did post go live?
    postViews: 1234,                    // ✅ From AnalyticsSnapshot
    postClicks: 56,                     // ✅ Engagement data
    postShares: 12                      // ✅ Viral signal
  }
}
```

**Benefits:**
- ✅ Can fine-tune on (context → output) pairs
- ✅ Can analyze which contexts produce best results
- ✅ Can track ROI per LLM provider
- ✅ Can connect content performance to AI generations

---

## Migration Strategy

### Step 1: Parallel Run (Week 1-2)

**Goal:** Log to AIGenerationLog WITHOUT breaking existing flow

```typescript
// workspace/route.ts
const text = await callLLM(...);  // Existing code

// NEW: Log to AIGenerationLog (non-blocking)
try {
  await AIGenerationLog.create({
    generationId,
    tenantId: user.tenantId,
    postId,
    context: {
      contentGoal: post.contentGoal,
      postType: post.postType,
      userBrief: brief,
      userKeywords: keywords,
      brandVoice: customBrandVoice || brandBrain?.brandVoice,
      // ... all context fields
    },
    modelConfig: {
      engine: selectedEngine,
      model: selectedModel,
      temperature: 0.7
    },
    generation: {
      systemPrompt: systemInstructions,
      userPrompt: actionPrompt,
      rawOutput: text,
      normalizedOutput: normalizeHTML(text, postType),
      tokensUsed: Math.ceil(text.length / 4)
    }
  });
} catch (logErr) {
  console.error("Failed to log generation (non-critical):", logErr);
  // Don't block user's request
}

// Existing code continues
return NextResponse.json({ success: true, output: text, generationId });
```

**Validation:**
- Check MongoDB: AIGenerationLog collection should have entries
- Compare `generation.normalizedOutput` with `Post.aiWorkspaceSession.generations[].output`
- Ensure no performance degradation (<50ms additional latency)

---

### Step 2: Refactor to Shared Builders (Week 3-4)

**Goal:** Replace duplicated prompt logic with centralized functions

**Before (workspace/route.ts lines 312-410):**
```typescript
// 98 lines of hardcoded prompt construction
let systemInstructions = "";
const goalConfig = contentGoal ? getGoalConfig(contentGoal) : null;
// ... 90 more lines
```

**After:**
```typescript
import { buildAIContext } from "@/lib/pirateCOS/ai-context-builder";
import { normalizeHTML } from "@/lib/pirateCOS/html-normalizer";

const contextResult = buildAIContext({
  action,
  postType: post.postType,
  contentGoal: post.contentGoal,
  brief,
  keywords,
  userMessage,
  brandBrain,
  workflowMemory,
  selectedText,
  tone
});

const systemInstructions = contextResult.systemInstructions;
const userPrompt = contextResult.userPrompt;
const editIntent = contextResult.editIntent;

// ... call LLM

const normalizedText = normalizeHTML(rawText, post.postType);
```

**Files to refactor:**
1. `app/api/pirateCOS/ai/workspace/route.ts` (lines 312-410 → 8 lines)
2. `app/api/pirateCOS/ai/generate/route.ts` (lines 181-233 → 8 lines)
3. `app/api/pirateCOS/ai/copilot/route.ts` (no changes, copilot is pure analysis)

---

### Step 3: Migrate to Prompt Registry (Week 5)

**Goal:** Move hardcoded prompts to versioned registry

**Before (workspace/route.ts lines 136-158):**
```typescript
const systemInstructions = `You are a world-class professional copywriter...
Your task is to generate exactly 4 highly creative...
[22 lines of hardcoded prompt]`;
```

**After:**
```typescript
import { getPrompt } from "@/lib/pirateCOS/prompt-registry";

const promptTemplate = getPrompt("suggest-ideas");
const systemInstructions = promptTemplate.systemPrompt;

// Log which version was used
await AIGenerationLog.create({
  // ... other fields
  generation: {
    systemPrompt: systemInstructions,
    promptVersion: promptTemplate.version,  // "v1.0"
  }
});
```

**Prompts to migrate:**
- [x] `suggest-ideas` (workspace/route.ts lines 136-158)
- [x] `seo-analysis` (generate/route.ts lines 156-180)
- [x] `generate-titles` (generate/route.ts lines 133-140)
- [x] `generate-tags` (generate/route.ts lines 154)
- [x] Quick actions: improve, shorten, expand, continue, linkedin (workspace/route.ts lines 286-310)

---

### Step 4: Implement Feedback Loop (Week 6-8)

**Goal:** Connect user feedback to auto-learning pipeline

#### Week 6: Feedback Capture

**Create `/api/pirateCOS/ai/feedback` route:**
- Accept `generationId`, `action` ("accepted" | "rejected" | "edited"), `userEdits`, `rating`
- Update `AIGenerationLog.feedback` field
- Update `Post.aiWorkspaceSession.generations[].isAccepted` for backward compatibility

**Frontend changes:**
- When user clicks "Accept" in workspace → `POST /api/pirateCOS/ai/feedback` with `action: "accepted"`
- When user clicks "Regenerate" → `action: "regenerated"`
- When user edits and saves → `action: "edited"` + diff of changes

#### Week 7: Performance Aggregation

**Create cron job (daily at 2 AM):**
```typescript
// lib/cron/aggregate-ai-performance.ts
export async function aggregateAIPerformance() {
  const tenants = await Admin.find({ plan: { $in: ["pro", "enterprise"] } });
  
  for (const tenant of tenants) {
    // Find accepted generations from past 30 days
    const acceptedGens = await AIGenerationLog.find({
      tenantId: tenant._id,
      "feedback.action": { $in: ["accepted", "edited"] },
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    for (const gen of acceptedGens) {
      // Get post performance from AnalyticsSnapshot
      const snapshots = await AnalyticsSnapshot.find({ postId: gen.postId });
      
      const totalViews = snapshots.reduce((sum, s) => sum + s.metrics.views, 0);
      const totalClicks = snapshots.reduce((sum, s) => sum + s.metrics.clicks, 0);
      
      // Update generation with performance
      gen.performanceSignals = {
        postPublished: true,
        postViews: totalViews,
        postClicks: totalClicks,
        postShares: snapshots.reduce((sum, s) => sum + s.metrics.shares, 0)
      };
      
      await gen.save();
    }
  }
}
```

#### Week 8: Insights UI

**Create `/api/pirateCOS/ai/learning/insights` route:**
- Analyze top 10% performing generations
- Extract patterns: most common contentGoal, postType, brandVoice characteristics
- Suggest Brand Brain updates: "Your top content uses 'traffic' goal 65% of the time. Make it your default?"

**Frontend (Admin → AI Settings):**
- New section: "Auto-Learning Insights"
- Card 1: "Top-performing content goals: Traffic (65%), Authority (25%)"
- Card 2: "Suggested keywords from high-performers: React, TypeScript, Next.js"
- Button: "Apply Suggested Keywords to Brand Brain"

---

## Code Diff Examples

### Workspace Route: Before vs. After

**BEFORE (98 lines of prompt construction):**
```typescript
// workspace/route.ts lines 312-410
let systemInstructions = "";
const contextInfo = targetText ? `\n\nTARGET CONTEXT: "${targetText.substring(0, 3000)}"` : "";
let briefContext = "";
if (brief) {
  briefContext += `\n- Active Topic/Brief context: "${brief}"`;
}
if (keywords) {
  briefContext += `\n- Focus Keywords: "${keywords}"`;
}

if (briefContext) {
  systemInstructions += `\n${briefContext}`;
}

const goalConfig = contentGoal ? getGoalConfig(contentGoal) : null;
const typeConfig = postType ? getPostTypeConfig(postType) : null;
let contentContextPrompt = "";

if (goalConfig) {
  contentContextPrompt += `\n\n# CONTENT STRATEGY GOAL: ${goalConfig.label}\n${goalConfig.aiPriorityPrompt}\n`;
}
if (typeConfig) {
  const brandPresetMap = brandBrain?.presetInstructions as any;
  let activeHint = typeConfig.templateHint;
  if (brandPresetMap) {
    const customPrompt = typeof brandPresetMap.get === "function"
      ? brandPresetMap.get(postType)
      : brandPresetMap[postType];
    if (customPrompt && typeof customPrompt === "string" && customPrompt.trim()) {
      activeHint = customPrompt.trim();
    }
  }
  contentContextPrompt += `\n\n# CONTENT ARCHETYPE: ${typeConfig.label}\n${activeHint}\n`;
}

// ... 60 more lines of Brand Brain context building
```

**AFTER (10 lines with shared builder):**
```typescript
// workspace/route.ts (refactored)
import { buildAIContext } from "@/lib/pirateCOS/ai-context-builder";
import { normalizeHTML } from "@/lib/pirateCOS/html-normalizer";

const contextResult = buildAIContext({
  action,
  postType: post.postType,
  contentGoal: post.contentGoal,
  brief,
  keywords,
  userMessage,
  brandBrain,
  workflowMemory,
  selectedText,
  tone
});

const systemInstructions = contextResult.systemInstructions;
const userPrompt = contextResult.userPrompt;
const editIntent = contextResult.editIntent;
```

---

## Testing Strategy

### Unit Tests

**Test `buildAIContext()`:**
```typescript
describe("buildAIContext", () => {
  it("should prioritize user brief over brand keywords", () => {
    const result = buildAIContext({
      action: "chat",
      brief: "How to optimize React performance",
      keywords: "React, useMemo, useCallback",
      brandBrain: {
        targetKeywords: ["generic", "keywords"]
      }
    });
    
    expect(result.systemInstructions).toContain("How to optimize React performance");
    expect(result.systemInstructions).toContain("React, useMemo, useCallback");
    // User inputs should appear BEFORE brand keywords in the prompt
    const briefIndex = result.systemInstructions.indexOf("How to optimize");
    const brandIndex = result.systemInstructions.indexOf("generic");
    expect(briefIndex).toBeLessThan(brandIndex);
  });
});
```

**Test `normalizeHTML()`:**
```typescript
describe("normalizeHTML", () => {
  it("should remove markdown wrappers", () => {
    const input = "```html\n<p>Content</p>\n```";
    const output = normalizeHTML(input);
    expect(output).toBe("<p>Content</p>");
  });
  
  it("should replace H1 with H2", () => {
    const input = "<h1>Title</h1><p>Content</p>";
    const output = normalizeHTML(input);
    expect(output).toBe("<h2>Title</h2><p>Content</p>");
  });
  
  it("should strip headings for social-post type", () => {
    const input = "<h2>Heading</h2><p>Content</p>";
    const output = normalizeHTML(input, "social-post");
    expect(output).toBe("<p><strong>Heading</strong></p><p>Content</p>");
  });
});
```

### Integration Tests

**Test cross-provider consistency:**
```typescript
describe("Model-agnostic consistency", () => {
  const testContext = {
    action: "chat",
    postType: "blog",
    contentGoal: "traffic",
    userMessage: "Write an introduction about React hooks"
  };
  
  it("should produce similar outputs across OpenAI and Anthropic", async () => {
    const openAIOutput = await generateWithOpenAI(testContext);
    const anthropicOutput = await generateWithAnthropic(testContext);
    
    // Both should be normalized HTML
    expect(openAIOutput).not.toContain("```html");
    expect(anthropicOutput).not.toContain("```html");
    
    // Both should have similar structure (e.g., both have H2 headings)
    const openAIHeadings = openAIOutput.match(/<h2[^>]*>/g) || [];
    const anthropicHeadings = anthropicOutput.match(/<h2[^>]*>/g) || [];
    
    expect(Math.abs(openAIHeadings.length - anthropicHeadings.length)).toBeLessThanOrEqual(1);
  });
});
```

---

## Rollback Plan

If Phase 4G causes issues:

1. **Database:** AIGenerationLog is append-only, won't affect existing data
2. **Code:** Revert `workspace/route.ts` and `generate/route.ts` to previous commit
3. **Shared builders:** If bugs found, add feature flag:
   ```typescript
   const USE_PHASE_4G = process.env.ENABLE_PHASE_4G === "true";
   
   if (USE_PHASE_4G) {
     const contextResult = buildAIContext(...);
   } else {
     // Legacy prompt construction
   }
   ```

---

## Success Criteria (3-Month Checkpoint)

| Metric | Baseline | Target | Actual |
|--------|----------|--------|--------|
| **Data completeness** | 20% | 100% | ___ |
| **Cross-provider output consistency** | 60% | 95% | ___ |
| **Prompt update time** | 1 week (code deploy) | Instant (registry) | ___ |
| **User acceptance rate** | 65% | 75% | ___ |
| **High-performing content auto-detected** | 0 | 30%+ | ___ |

**Go/No-Go Decision (End of Week 8):**
- ✅ If user acceptance rate >70% → Continue to fine-tuning phase
- ❌ If <65% → Investigate prompt quality issues, delay fine-tuning

---

**Next Actions:**
1. ✅ Review this architecture document
2. ⬜ Create `models/pirateCOS/AIGenerationLog.ts`
3. ⬜ Create `lib/pirateCOS/ai-context-builder.ts`
4. ⬜ Create `lib/pirateCOS/html-normalizer.ts`
5. ⬜ Start parallel run (Step 1)
