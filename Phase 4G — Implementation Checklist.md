# Phase 4G — Implementation Checklist

> **Purpose:** Step-by-step tasks for implementing AI infrastructure scalability  
> **Timeline:** 8 weeks (4 phases)  
> **Priority:** P0 (Critical for fine-tuning and autonomous learning)  

---

## Phase 4G-1: Data Instrumentation (Weeks 1-2) [P0]

### Database & Models

- [ ] **Create `models/pirateCOS/AIGenerationLog.ts`**
  - [ ] Define `IAIGenerationLog` interface with full schema
  - [ ] Include `context` object (Goal, Type, Brief, Keywords, Brand Brain, Preset, editIntent)
  - [ ] Include `modelConfig` object (engine, model, temperature, maxTokens)
  - [ ] Include `generation` object (systemPrompt, userPrompt, rawOutput, normalizedOutput, tokensUsed, latencyMs, costUSD)
  - [ ] Include `feedback` object (action, appliedAt, userEdits, rating, flagReason)
  - [ ] Include `performanceSignals` object (postPublished, postViews, postClicks, postShares)
  - [ ] Add indexes: `{ tenantId: 1, createdAt: -1 }`, `{ postId: 1 }`, `{ "feedback.action": 1 }`
  - [ ] Test schema with sample data

### Backend Routes - Logging

- [ ] **Update `app/api/pirateCOS/ai/workspace/route.ts`**
  - [ ] Import `AIGenerationLog` model
  - [ ] After LLM call, create log entry with full context stack
  - [ ] Wrap in try-catch (non-blocking, log errors but don't fail user request)
  - [ ] Test: Verify logs created in MongoDB after workspace actions

- [ ] **Update `app/api/pirateCOS/ai/generate/route.ts`**
  - [ ] Import `AIGenerationLog` model
  - [ ] After LLM call, create log entry with full context stack
  - [ ] Include custom overrides (customBrandVoice, customAudience, customKeywords)
  - [ ] Test: Verify logs created in MongoDB after article generation

### Backend Routes - Feedback

- [ ] **Create `app/api/pirateCOS/ai/feedback/route.ts`**
  - [ ] `POST` endpoint accepting `{ generationId, action, userEdits?, rating?, flagReason? }`
  - [ ] Validate user owns the generation (tenantId check)
  - [ ] Update `AIGenerationLog.feedback` fields
  - [ ] Also update `Post.aiWorkspaceSession.generations[].isAccepted` for backward compatibility
  - [ ] Test: Submit feedback via API, verify both collections updated

### Frontend Integration

- [ ] **Update `hooks/useAIWorkspaceSession.ts`**
  - [ ] When user clicks "Accept" → call `/api/pirateCOS/ai/feedback` with `action: "accepted"`
  - [ ] When user clicks "Regenerate" → call with `action: "regenerated"`
  - [ ] When user edits and saves → call with `action: "edited"` + diff of changes
  - [ ] Test: Verify feedback captured in all 3 scenarios

### Validation & Testing

- [ ] **Create seed data script**
  - [ ] Generate 50 sample `AIGenerationLog` entries with diverse contexts
  - [ ] Include mix of accepted/rejected/edited feedback
  - [ ] Test: Query logs by tenantId, postId, feedback.action

- [ ] **Performance test**
  - [ ] Measure latency impact of logging (should be <50ms)
  - [ ] Test with 100 concurrent requests
  - [ ] Verify no blocking of user requests if logging fails

---

## Phase 4G-2: Model-Agnostic Consistency (Weeks 3-4) [P0]

### Shared Libraries

- [ ] **Create `lib/pirateCOS/ai-context-builder.ts`**
  - [ ] Define `AIContextConfig` interface
  - [ ] Implement `buildAIContext(config)` function
    - [ ] Step 1: Goal Context (from `postTypeConfig.ts`)
    - [ ] Step 2: Type Context (templateHint or custom presetInstructions)
    - [ ] Step 3: User Focus (brief + keywords) ⭐ PRIORITY
    - [ ] Step 4: Brand Brain (voice, audience, keywords, forbidden words)
    - [ ] Step 5: Preset Directive (if applicable)
  - [ ] Implement `buildUserFocusContext(brief, keywords)` helper
  - [ ] Implement `buildBrandContext(brandBrain, ...)` helper
  - [ ] Implement `classifyEditIntent(action, userMessage, selectedText)` helper
  - [ ] Export `AIContextResult` interface
  - [ ] Test: Unit tests for all branches (with/without goal, type, brief, etc.)

- [ ] **Create `lib/pirateCOS/html-normalizer.ts`**
  - [ ] Implement `normalizeHTML(rawHtml, postType?): string`
    - [ ] Remove markdown wrappers (`\`\`\`html`, `\`\`\``)
    - [ ] Replace H1 tags with H2
    - [ ] Apply postType-specific constraints (e.g., social-post = strip headings)
    - [ ] Fix heading hierarchy (no skipped levels: H2 → H4 becomes H2 → H3)
    - [ ] Remove unsafe tags (script, iframe, object, embed, style)
  - [ ] Implement `fixHeadingHierarchy(html): string` helper
  - [ ] Implement `enforceWordCount(html, postType?): string` helper (warns if too short/long)
  - [ ] Test: Unit tests for all normalization scenarios

### Route Refactoring

- [ ] **Refactor `app/api/pirateCOS/ai/workspace/route.ts`**
  - [ ] Replace lines 312-410 (98 lines) with call to `buildAIContext()`
  - [ ] Pass all context fields: postType, contentGoal, brief, keywords, brandBrain, workflowMemory
  - [ ] Apply `normalizeHTML(text, postType)` before returning response
  - [ ] Test: Compare outputs before/after refactor (should be identical)

- [ ] **Refactor `app/api/pirateCOS/ai/generate/route.ts`**
  - [ ] Replace lines 181-233 (52 lines) with call to `buildAIContext()`
  - [ ] Pass all context fields including customBrandVoice, customAudience, customKeywords
  - [ ] Apply `normalizeHTML(text, postType)` before returning response
  - [ ] Test: Compare outputs before/after refactor (should be identical)

### Cross-Provider Testing

- [ ] **Create integration test suite**
  - [ ] Test same context with OpenAI, Anthropic, Gemini, Mistral
  - [ ] Measure output consistency:
    - [ ] Heading count should be within ±1
    - [ ] Word count should be within ±10%
    - [ ] No markdown wrappers in any output
    - [ ] All outputs follow postType constraints
  - [ ] Target: 95%+ structural consistency across providers
  - [ ] Document any provider-specific quirks

---

## Phase 4G-3: Prompt Abstraction (Week 5) [P1]

### Prompt Registry

- [ ] **Create `lib/pirateCOS/prompt-registry.ts`**
  - [ ] Define `PromptKey` type (suggest-ideas, seo-analysis, generate-titles, etc.)
  - [ ] Define `PromptTemplate` interface (key, version, systemPrompt, userPromptTemplate, metadata)
  - [ ] Implement `PROMPT_REGISTRY` object with all prompts
    - [ ] `suggest-ideas` (workspace/route.ts lines 136-158)
    - [ ] `seo-analysis` (generate/route.ts lines 156-180)
    - [ ] `generate-titles` (generate/route.ts lines 133-140)
    - [ ] `generate-tags` (generate/route.ts line 154)
    - [ ] `quick-action-improve` (workspace/route.ts line 286)
    - [ ] `quick-action-shorten` (workspace/route.ts line 288)
    - [ ] `quick-action-expand` (workspace/route.ts line 290)
    - [ ] `quick-action-continue` (workspace/route.ts line 293)
    - [ ] `quick-action-linkedin` (workspace/route.ts line 301)
  - [ ] Implement `getPrompt(key): PromptTemplate`
  - [ ] Implement `getPromptVersion(key, version): PromptTemplate | undefined`
  - [ ] Implement `renderPrompt(template, variables): string`
  - [ ] Test: Verify all prompts accessible via getPrompt()

### Route Migration

- [ ] **Update `workspace/route.ts` to use registry**
  - [ ] Replace hardcoded "suggest-ideas" prompt with `getPrompt("suggest-ideas")`
  - [ ] Replace quick action prompts with registry lookups
  - [ ] Log `promptVersion` in AIGenerationLog
  - [ ] Test: Verify outputs unchanged

- [ ] **Update `generate/route.ts` to use registry**
  - [ ] Replace hardcoded "seo-analysis" prompt with `getPrompt("seo-analysis")`
  - [ ] Replace title/tag generation prompts with registry
  - [ ] Log `promptVersion` in AIGenerationLog
  - [ ] Test: Verify outputs unchanged

### Validation

- [ ] **Add promptVersion to AIGenerationLog schema**
  - [ ] Update `models/pirateCOS/AIGenerationLog.ts`
  - [ ] Add `generation.promptVersion?: string` field
  - [ ] Test: Query logs by promptVersion

---

## Phase 4G-4: Feedback Loop (Weeks 6-8) [P1]

### Week 6: Performance Aggregation

- [ ] **Create `lib/cron/aggregate-ai-performance.ts`**
  - [ ] Function: `aggregateAIPerformance()`
  - [ ] Find all accepted/edited generations from past 30 days
  - [ ] For each generation:
    - [ ] Query `AnalyticsSnapshot` for related postId
    - [ ] Sum views, clicks, shares across all platforms
    - [ ] Update `AIGenerationLog.performanceSignals`
  - [ ] Test: Run manually, verify performance data populated

- [ ] **Set up cron job (daily at 2 AM)**
  - [ ] Use Vercel cron or external scheduler
  - [ ] Call `/api/cron/aggregate-ai-performance` route
  - [ ] Add logging and error handling
  - [ ] Test: Trigger cron manually, verify logs updated

### Week 7: Insights API

- [ ] **Create `app/api/pirateCOS/ai/learning/insights/route.ts`**
  - [ ] `GET` endpoint (requires Pro/Enterprise plan)
  - [ ] Find top 10% performing generations (by postViews)
  - [ ] Analyze patterns:
    - [ ] `analyzeGoalDistribution(logs)` → Count by contentGoal
    - [ ] `analyzeTypeDistribution(logs)` → Count by postType
    - [ ] `extractCommonKeywords(logs)` → Extract frequent keywords
    - [ ] `analyzeVoicePatterns(logs)` → Detect common voice attributes
  - [ ] Return JSON with insights and suggestions
  - [ ] Test: Verify insights make sense (e.g., "traffic" is top goal)

### Week 8: Admin UI

- [ ] **Create `components/pirateCOS/AILearningInsights.tsx`**
  - [ ] Fetch `/api/pirateCOS/ai/learning/insights`
  - [ ] Display top-performing goals (bar chart or list)
  - [ ] Display suggested keywords (pill badges)
  - [ ] Display suggested voice adjustments (text block)
  - [ ] Add "Apply This Suggestion" buttons
    - [ ] Updates Brand Brain contentGoal default
    - [ ] Adds suggested keywords to Brand Brain
    - [ ] Updates brand voice description
  - [ ] Test: Apply suggestions, verify Brand Brain updated

- [ ] **Integrate into Admin → AI Settings**
  - [ ] Add new section: "Auto-Learning Insights"
  - [ ] Render `<AILearningInsights />` component
  - [ ] Gate behind Pro/Enterprise plan check
  - [ ] Test: Verify UI appears for Pro users, hidden for Free users

---

## Documentation & Deployment

### Documentation

- [ ] **Update `DEVELOPER_GUIDE.md`**
  - [ ] Add section: "AI Infrastructure Architecture"
  - [ ] Document `AIGenerationLog` schema
  - [ ] Document `buildAIContext()` usage
  - [ ] Document `PROMPT_REGISTRY` structure

- [ ] **Update `PIRATECOS_LIFECYCLE_GUIDE.md`**
  - [ ] Add Phase 4G to timeline
  - [ ] Link to Phase 4G documents

### Deployment

- [ ] **Environment variables**
  - [ ] Add `ENABLE_PHASE_4G=true` flag (for gradual rollout)
  - [ ] Add `PROMPT_REGISTRY_SOURCE=local` (later: `database`)

- [ ] **Database migration**
  - [ ] Run script to add indexes to `AIGenerationLog`
  - [ ] Verify indexes created in production

- [ ] **Monitoring**
  - [ ] Add CloudWatch/Datadog metrics:
    - [ ] `aiGenerationLog.created` (count per hour)
    - [ ] `aiGenerationLog.feedback.accepted` (acceptance rate)
    - [ ] `aiGenerationLog.latency` (p50, p95, p99)
  - [ ] Set up alerts: If acceptance rate drops below 60%, alert engineering team

---

## Success Metrics (3-Month Checkpoint)

| Metric | Baseline | Target | Status |
|--------|----------|--------|--------|
| Data completeness | 20% | 100% | ⬜ |
| Cross-provider consistency | 60% | 95% | ⬜ |
| Prompt update time | 1 week | Instant | ⬜ |
| User acceptance rate | 65% | 75% | ⬜ |
| Auto-learning suggestions applied | 0% | 30% | ⬜ |
| Fine-tuning readiness | ❌ | ✅ | ⬜ |

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| **Logging latency impacts UX** | Use non-blocking async logging, measure <50ms overhead |
| **AIGenerationLog grows too large** | Add TTL (delete after 90 days) or archive to S3 |
| **Refactoring breaks existing functionality** | Parallel run first (log without using new builders), A/B test outputs |
| **Prompt registry too rigid** | Add escape hatch: `customSystemPrompt` override field |
| **Insights not actionable** | Start with simple metrics (goal distribution), iterate based on user feedback |

---

**Next Action:** Start with Phase 4G-1 (Data Instrumentation). It's the foundation for everything else! ✅

