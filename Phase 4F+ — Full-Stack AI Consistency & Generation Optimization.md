# Phase 4F+ — Full-Stack AI Consistency & Generation Optimization

> **Status:** Planned (Extension of Phase 4F)
> **Priority:** Critical (Architectural Foundation)
> **Dependencies:** Phase 4E (AI Workspace Panel), Phase 4F (Precision Editing)
> **Strategic Impact:** Unifies AI behavior across all entry points, preventing hallucination and off-brand output
> **Estimated Effort:** 10-12 days (~2.5 weeks)

---

## Executive Summary

Phase 4F+ extends the precision editing improvements from Phase 4F to create a **unified AI generation architecture** across all entry points in PirateCOS. This ensures that whether a user is:
- Generating a 2,500-word SEO article via preset
- Creating a meta description
- Requesting title suggestions
- Using the workspace chat for surgical edits
- Analyzing SEO performance

...they receive **consistent, Brand Brain-aware, context-respectful output** that maintains the same quality, tone, and structural integrity.

**Key Problems Solved:**
1. ❌ **Preset hallucination**: SEO article presets generate 2,500-word outputs that ignore Brand Brain rules
2. ❌ **Inconsistent HTML structure**: Long-form vs. short-form content use different heading hierarchies
3. ❌ **Context blindness**: Meta descriptions and title generators don't respect `postType` or `contentGoal`
4. ❌ **Format incompatibility**: Content from `/api/ai/generate` doesn't work well with workspace precision edits

---

## Current Architecture Audit

### AI Entry Points Inventory

| Entry Point | File | Actions Supported | Brand Brain? | PostType? | ContentGoal? | Issue |
|-------------|------|-------------------|--------------|-----------|--------------|-------|
| **Main Generator** | `app/api/pirateCOS/ai/generate/route.ts` | `write`, `excerpt`, `metaTitle`, `titles`, `tags`, `focusKeyword`, `seo-analysis` | ✅ Full | ✅ Yes | ✅ Yes | Presets ignore constraints |
| **Workspace** | `app/api/pirateCOS/ai/workspace/route.ts` | `chat`, Quick Actions, `suggest-ideas` | ✅ Full | ✅ Yes | ✅ Yes | Regeneration drift (fixed in 4F) |
| **Repurposing** | `app/api/pirateCOS/posts/[id]/repurpose/route.ts` | Format transformations (LinkedIn, Twitter, etc.) | ⚠️ Partial | ❌ No | ❌ No | No goal context |

### Preset Directive Analysis (generate/route.ts lines 120-141)

**Current State:**
```typescript
if (preset === "seo-article") {
  presetDirective = `Write a comprehensive, search-optimized SEO article. 
  Enforce a robust H2/H3 structural layout, target a length of at least 1,500–2,500 words...`;
}
```

**Problems:**
1. **No word count enforcement** — AI ignores min/max targets
2. **Brand Brain applied AFTER preset** — Preset's "comprehensive" instruction overrides Brand Brain's tone
3. **No postType integration** — Preset doesn't reference `postTypeConfig.templateHint`
4. **No contentGoal alignment** — "SEO article" preset doesn't leverage `goalConfig.aiPriorityPrompt`

---

## Solution Architecture

### 1. Preset Optimization

#### A. Unified Preset System

**Replace hardcoded presets with `postTypeConfig` integration:**

```typescript
// New function in app/api/pirateCOS/ai/generate/route.ts
function buildPresetDirective(
  preset: string,
  postType: string,
  contentGoal: string,
  typeConfig: PostTypeConfig | null,
  goalConfig: ContentGoalConfig | null
): string {
  // Use postTypeConfig as the source of truth
  const baseHint = typeConfig?.templateHint || "";
  const goalHint = goalConfig?.aiPriorityPrompt || "";
  
  const wordRange = typeConfig 
    ? `${typeConfig.minWordCount}–${typeConfig.maxWordCount} words`
    : "800–1,500 words";

  // Preset-specific modifiers that AUGMENT, not replace, typeConfig
  const presetModifiers: Record<string, string> = {
    "seo-article": `STRICT WORD COUNT: Target ${wordRange}. This is a search-optimized long-form article.
${goalHint}
${baseHint}
Mandatory SEO elements:
- Include "Frequently Asked Questions" H2 section at the end
- Use keyword-rich H2/H3 headings that match search queries
- Comprehensive, in-depth coverage (favor depth over brevity)`,

    "thought-leadership": `STRICT WORD COUNT: Target ${wordRange}. This is an opinionated thought leadership piece.
${goalHint}
${baseHint}
Required elements:
- Challenge conventional wisdom with contrarian viewpoints
- Use conversational yet authoritative first-person voice
- Include real-world stories and specific examples
- Present bold, defensible claims`,

    "linkedin-post": `STRICT WORD COUNT: 200-300 words maximum. This is an algorithm-optimized LinkedIn post.
Structure requirements:
- Scroll-stopping hook in the first line
- Double line spacing (use <br> tags liberally)
- Short, punchy sentences (1-2 lines each)
- Include 2-3 relevant emojis strategically
- End with an engagement question
${goalHint}`,

    "case-study": `STRICT WORD COUNT: Target ${wordRange}. This is a professional case study.
${baseHint}
Mandatory structure (use H2 headings):
1. Executive Summary
2. The Challenge (problem statement)
3. The Approach (solution)
4. The Results (metrics and outcomes)
Include placeholders for: [Customer Quote], [Metric: X% improvement]`,

    // ... other presets
  };

  return presetModifiers[preset] || baseHint;
}
```

#### B. Brand Brain Priority Ordering + User Input Integration

**Current problem:** Brand Brain is appended AFTER system instructions, causing conflicts. User-provided `brief` and `keywords` are not prominently featured.

**Solution:** Inject in this order:

1. **PostType & Goal Context** (structural foundation)
2. **User Brief & Keywords** (user's specific topic/focus) ⭐ NEW
3. **Brand Brain Rules** (identity and voice)
4. **Preset Directive** (specific task requirements)
5. **User Prompt** (final user intent)

```typescript
// Modified prompt construction (generate/route.ts lines 181-207)
if (action === "write") {
  let contextInfo = "";

  if (selectedText) {
    contextInfo += `\n\nTARGET TEXT FOR EDITING: "${selectedText}"`;
  }
  if (surroundingContext && surroundingContext.trim()) {
    contextInfo += `\n\nSURROUNDING CONTEXT: ${surroundingContext.trim()}`;
  }

  // STEP 1: Foundation (postType + goal)
  const goalConfig = contentGoal ? getGoalConfig(contentGoal) : null;
  const typeConfig = postType ? getPostTypeConfig(postType) : null;

  let systemInstructions = "";

  if (goalConfig) {
    systemInstructions += `\n# CONTENT STRATEGY GOAL: ${goalConfig.label}\n${goalConfig.aiPriorityPrompt}\n`;
  }
  if (typeConfig) {
    const customHint = brandBrain?.presetInstructions?.[postType];
    const activeHint = customHint || typeConfig.templateHint;
    systemInstructions += `\n# CONTENT ARCHETYPE: ${typeConfig.label}\n${activeHint}\n`;
  }

  // STEP 2: User Brief & Keywords (NEW - from request body)
  // These come from the workspace chat or generate form
  const { brief, keywords } = body; // Already extracted at line 29-45
  if (brief) {
    systemInstructions += `\n\n[USER TOPIC BRIEF]:\n"${brief.trim()}"\n`;
  }
  if (keywords) {
    systemInstructions += `\n[USER FOCUS KEYWORDS]: ${keywords.trim()}\n`;
  }

  // STEP 3: Brand Brain (identity)
  systemInstructions += buildBrandContext(brandBrain, customBrandVoice, customAudience, customKeywords);

  // STEP 4: Preset Directive (specific task)
  const presetDirective = preset
    ? buildPresetDirective(preset, postType, contentGoal, typeConfig, goalConfig)
    : "";

  // STEP 5: User Prompt (final intent)
  const finalPrompt = presetDirective
    ? `${presetDirective}\n\nUser Instructions: "${prompt}"`
    : prompt;

  // Build final system message
  if (postType === "social-post") {
    systemInstructions += `\n\nTASK: ${finalPrompt}${contextInfo}
Output Format: Simple HTML (<p>, <strong>, <em>, <br> only). No headings, lists, or blockquotes.
Length: Under 250 words total.`;
  } else {
    systemInstructions += `\n\nTASK: ${finalPrompt}${contextInfo}
Output Format: Clean HTML (<h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>, <blockquote>).
Length: ${typeConfig ? `${typeConfig.minWordCount}–${typeConfig.maxWordCount} words` : "800–1,500 words"}.
CRITICAL: Respect the word count range. Do NOT exceed the maximum.`;
  }
}

// Extract Brand Brain builder as reusable function
function buildBrandContext(
  brandBrain: any,
  customBrandVoice?: string,
  customAudience?: string,
  customKeywords?: string[]
): string {
  if (!brandBrain && !customBrandVoice && !customAudience && !customKeywords) {
    return "";
  }

  let context = "\n\n[STRICT BRAND WRITING IDENTITY RULES]:";
  const activeName = brandBrain?.companyName || "Our Brand";
  const activeVoice = customBrandVoice || brandBrain?.brandVoice;
  const activeProducts = brandBrain?.products;
  const activeAudience = customAudience || brandBrain?.audienceICP;

  // IMPORTANT: customKeywords (from request) override brandBrain.targetKeywords
  // This allows per-post keyword customization
  const activeKeywords = customKeywords || brandBrain?.targetKeywords || [];
  const forbiddenWords = brandBrain?.forbiddenWords || [];

  context += `\n- Company/Brand Name: "${activeName}"`;
  if (activeVoice) {
    context += `\n- Tone & Brand Voice: ${activeVoice.trim()}.`;
  }
  if (activeProducts) {
    context += `\n- Brand Products/Services: "${activeProducts.trim()}"`;
  }
  if (activeAudience) {
    context += `\n- Target Audience: "${activeAudience.trim()}"`;
  }
  if (activeKeywords.length > 0) {
    // Note: These are Brand Brain keywords OR custom override
    context += `\n- Brand Focus Keywords: ${activeKeywords.join(", ")}`;
  }
  if (forbiddenWords.length > 0) {
    context += `\n- FORBIDDEN WORDS: Never use these words: ${forbiddenWords.join(", ")}`;
  }

  // Formatting rules
  const sentenceComplexity = brandBrain?.sentenceComplexity || "moderate";
  context += `\n\n[WORKFLOW PREFERENCES]:`;
  context += `\n- Sentence Complexity: "${sentenceComplexity}" readability level`;

  if (brandBrain?.formattingRules?.alwaysIncludeTakeaways) {
    context += `\n- Include "Key Takeaways" summary block at the start`;
  }
  if (brandBrain?.formattingRules?.alwaysIncludeFAQ) {
    context += `\n- Append "Frequently Asked Questions" section at the end`;
  }
  if (brandBrain?.callToActionTemplate) {
    context += `\n- CTA Style: "${brandBrain.callToActionTemplate.trim()}"`;
  }

  return context;
}
```

---

### User Input Integration (Brief & Keywords)

**Discovery:** The workspace and generate routes already accept `brief` and `keywords` from users, but they're not prominently featured in prompts!

**Current handling (workspace/route.ts lines 314-320):**
```typescript
let briefContext = "";
if (brief) {
  briefContext += `\n- Active Topic/Brief context: "${brief}"`;
}
if (keywords) {
  briefContext += `\n- Focus Keywords: "${keywords}"`;
}
// Then appended weakly to contextInfo
```

**Problem:** These user inputs are buried as minor context, not treated as primary directives.

**Solution: Elevate Brief & Keywords to Priority Position**

```typescript
// NEW: In both generate and workspace routes
function buildUserFocusContext(brief?: string, keywords?: string): string {
  if (!brief && !keywords) return "";

  let context = "\n\n[USER CONTENT FOCUS]:";

  if (brief) {
    context += `\n📌 TOPIC BRIEF: "${brief.trim()}"
This is what the user wants to write about. Make this the CENTRAL THEME of the content.`;
  }

  if (keywords) {
    context += `\n🎯 TARGET KEYWORDS: ${keywords.trim()}
Integrate these keywords naturally and prominently throughout the content.`;
  }

  return context;
}

// Apply in prompt construction BEFORE Brand Brain
systemInstructions = buildGoalContext(goalConfig)
  + buildTypeContext(typeConfig)
  + buildUserFocusContext(brief, keywords) // ⭐ USER INPUT HERE
  + buildBrandContext(brandBrain, customBrandVoice, customAudience, customKeywords)
  + buildPresetDirective(preset, ...)
  + userPrompt;
```

**Why this matters:**
- Users explicitly provide `brief` to say "write about THIS"
- Users provide `keywords` to target specific terms
- These should take **precedence** over Brand Brain defaults
- Current implementation treats them as footnotes

**Example:**
```
User inputs:
- brief: "How to optimize React performance with useMemo"
- keywords: "React, useMemo, performance optimization"

Current prompt: Buried in contextInfo, AI may ignore it
New prompt: Elevated to top priority, AI centers content on this
```

---

### 2. Structural Consistency

#### A. HTML Hierarchy Enforcement

**Problem:** AI sometimes generates:
- `<h1>` tags (conflicts with page title)
- Inconsistent heading jumps (H2 → H4)
- Missing structural elements for long-form content

**Solution: Heading Enforcement Rules**

```typescript
// New post-processing function in generate/route.ts
function enforceHTMLStructure(html: string, postType: string): string {
  const typeConfig = getPostTypeConfig(postType);

  // Rule 1: Remove <h1> tags (reserved for post title)
  html = html.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '<h2>$1</h2>');

  // Rule 2: Fix heading hierarchy (prevent H2 → H4 jumps)
  html = fixHeadingHierarchy(html);

  // Rule 3: Enforce minimum structural elements for long-form content
  if (typeConfig && typeConfig.minWordCount >= 1000) {
    const h2Count = (html.match(/<h2/gi) || []).length;
    if (h2Count < 3) {
      console.warn(`Warning: Long-form ${postType} has only ${h2Count} H2 headings. Expected at least 3.`);
    }
  }

  // Rule 4: Strip wrapper tags that AI sometimes adds
  html = html.replace(/^<html[^>]*>|<\/html>$/gi, '');
  html = html.replace(/^<body[^>]*>|<\/body>$/gi, '');
  html = html.replace(/^<head[^>]*>.*?<\/head>/gis, '');

  return html.trim();
}

function fixHeadingHierarchy(html: string): string {
  // Detect heading level jumps (e.g., H2 → H4 without H3)
  const headingRegex = /<(h[2-6])[^>]*>(.*?)<\/\1>/gi;
  let lastLevel = 2;

  return html.replace(headingRegex, (match, tag, content) => {
    const currentLevel = parseInt(tag.charAt(1));

    // If jump is more than 1 level, correct it
    if (currentLevel > lastLevel + 1) {
      const correctedLevel = lastLevel + 1;
      lastLevel = correctedLevel;
      return `<h${correctedLevel}>${content}</h${correctedLevel}>`;
    }

    lastLevel = currentLevel;
    return match;
  });
}

// Apply in the response handler (line 399+)
text = text.trim();
if (text.startsWith("```html")) {
  text = text.replace(/^```html/, "").replace(/```$/, "").trim();
} else if (text.startsWith("```")) {
  text = text.replace(/^```/, "").replace(/```$/, "").trim();
}

// NEW: Enforce HTML structure
if (action === "write") {
  text = enforceHTMLStructure(text, postType || "blog");
}
```

#### B. Word Count Validation

**Problem:** AI ignores word count targets in presets.

**Solution: Post-Generation Validation**

```typescript
// Add after HTML cleanup
if (action === "write" && typeConfig) {
  const wordCount = text.replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length;

  if (wordCount < typeConfig.minWordCount * 0.8) {
    console.warn(`Generated content is ${wordCount} words, below minimum ${typeConfig.minWordCount}`);
  }
  if (wordCount > typeConfig.maxWordCount * 1.2) {
    console.warn(`Generated content is ${wordCount} words, exceeds maximum ${typeConfig.maxWordCount}`);
  }

  // Optional: Include metadata in response for client-side warnings
  return NextResponse.json({
    success: true,
    data: text,
    engine: selectedEngine,
    metadata: {
      wordCount,
      targetRange: `${typeConfig.minWordCount}–${typeConfig.maxWordCount}`,
      inRange: wordCount >= typeConfig.minWordCount && wordCount <= typeConfig.maxWordCount,
    }
  });
}
```

---

### 3. UX Audit of AI Tools

#### A. Meta Description Generator (lines 145-146)

**Current:**
```typescript
systemInstructions = `Draft a concise, high-converting SEO meta-description / excerpt (maximum 150-160 characters)
summarizing the following post. Deliver ONLY the excerpt text. Do NOT wrap it in quotes, code blocks, or include introductory text.
Content:\n\n${content || title}`;
```

**Problems:**
- ❌ No `postType` or `contentGoal` awareness
- ❌ Doesn't leverage Brand Brain voice
- ❌ Generic prompt doesn't adapt to content type

**Improved:**
```typescript
// NEW: Context-aware meta description
if (action === "excerpt" || action === "metaDescription") {
  const goalConfig = contentGoal ? getGoalConfig(contentGoal) : null;
  const typeConfig = postType ? getPostTypeConfig(postType) : null;

  let context = "";
  if (goalConfig) {
    if (goalConfig.value === "conversion") {
      context = "Focus on benefit-driven language and include a compelling hook.";
    } else if (goalConfig.value === "traffic") {
      context = "Use keyword-rich language optimized for search click-through.";
    } else if (goalConfig.value === "engagement") {
      context = "Create curiosity and intrigue to maximize clicks.";
    }
  }

  const voiceHint = brandBrain?.brandVoice
    ? `Maintain ${brandBrain.brandVoice.trim()} tone.`
    : "";

  systemInstructions = `Draft a concise, high-converting SEO meta-description (150-160 characters max).
${context} ${voiceHint}
Summarize the following ${typeConfig?.label || "post"}:

Title: "${title}"
Content: ${content || title}

Deliver ONLY the meta description text. No quotes, code blocks, or introductory text.`;
}
```

#### B. Title Suggestions (lines 149-152)

**Current:**
```typescript
systemInstructions = `Suggest a single, high-impact, highly clickable, and search-optimized alternative title for a post with the active title: "${title || ""}", category: "${postType || "blog"}", and content: "${content || ""}". Deliver ONLY the single title text. Do NOT wrap it in quotes, code blocks, or include introductory text.`;
```

**Improved:**
```typescript
if (action === "metaTitle" || action === "titles") {
  const goalConfig = contentGoal ? getGoalConfig(contentGoal) : null;
  const typeConfig = postType ? getPostTypeConfig(postType) : null;

  let styleHint = "";
  if (goalConfig?.value === "traffic") {
    styleHint = "Optimize for SEO: include target keywords and match search intent.";
  } else if (goalConfig?.value === "engagement") {
    styleHint = "Optimize for clicks: use curiosity, numbers, and emotional triggers.";
  } else if (goalConfig?.value === "conversion") {
    styleHint = "Optimize for action: emphasize benefits and urgency.";
  }

  const count = action === "titles" ? "3 alternative titles" : "1 alternative title";
  const format = action === "titles"
    ? `Format as JSON array: ["Title 1", "Title 2", "Title 3"]`
    : "Deliver ONLY the title text (no quotes or formatting).";

  systemInstructions = `Suggest ${count} for this ${typeConfig?.label || "post"}.

Current title: "${title || ""}"
Content: "${(content || "").substring(0, 500)}..."

Style guidance: ${styleHint}
${brandBrain?.brandVoice ? `Brand voice: ${brandBrain.brandVoice}` : ""}

${format}`;
}
```

#### C. Focus Keyword Generator (lines 147-148)

**Improved:**
```typescript
if (action === "focusKeyword") {
  const typeConfig = postType ? getPostTypeConfig(postType) : null;
  const existingKeywords = brandBrain?.targetKeywords || [];

  systemInstructions = `Suggest a single, high-impact focus keyword (2-4 words) for this ${typeConfig?.label || "post"}.

Title: "${title || ""}"
Content: "${(content || "").substring(0, 1000)}..."

${existingKeywords.length > 0 ? `Brand keywords: ${existingKeywords.join(", ")}. Consider semantic variations of these.` : ""}

The keyword should:
- Match high-volume search queries
- Represent the main topic users would search for
- Be specific enough to rank (avoid overly broad terms)

Deliver ONLY the keyword phrase. No quotes, explanations, or formatting.`;
}
```

#### D. SEO Analysis (lines 155-180)

**Current:** Good structure, but missing Brand Brain awareness.

**Improvement:**
```typescript
if (action === "seo-analysis") {
  const brandKeywords = brandBrain?.targetKeywords || [];
  const brandVoice = brandBrain?.brandVoice || "professional";

  systemInstructions = `You are an expert SEO specialist. Analyze the following blog post and provide a comprehensive SEO optimization report.

Title: "${title || ""}"
Category: "${postType || "blog"}"
Content: "${content || ""}"

${brandKeywords.length > 0 ? `\nBrand Focus Keywords: ${brandKeywords.join(", ")}` : ""}
${brandVoice ? `\nBrand Voice: ${brandVoice}` : ""}

Your response must be a valid JSON object with the following structure:
{
  "metaTitle": "A suggested meta title (max 60 chars, keyword-optimized)",
  "metaDescription": "A suggested meta description (max 160 chars)",
  "focusKeyword": "The primary target keyword",
  "semanticKeywords": ["3-5 related keywords${brandKeywords.length > 0 ? ", prioritize variations of brand keywords" : ""}"],
  "slug": "An SEO-friendly URL slug",
  "ogTitle": "Title for social sharing (compelling, benefit-focused)",
  "ogDescription": "Description for social sharing",
  "analysis": {
    "score": 0-100,
    "strengths": ["list of positive SEO aspects"],
    "improvements": ["list of actionable improvements"],
    "keywordGap": ["missing keywords or topics to cover"],
    "headingStructure": "Analysis of H1, H2, H3 hierarchy",
    "readability": "Readability score and analysis (target: ${brandBrain?.sentenceComplexity || "moderate"} complexity)",
    "imageOptimization": "Review of image alt tags and suggestions",
    "brandAlignment": "How well the content aligns with brand voice: ${brandVoice}"
  }
}

Deliver ONLY the raw JSON object, no backticks, no markdown formatting.`;
}
```

---

### 4. Functional Synchronization

#### A. Workspace-Generate Compatibility

**Problem:** Content generated via `/api/ai/generate` uses different HTML patterns than workspace edits.

**Solution: Shared HTML Normalization**

```typescript
// New file: lib/pirateCOS/html-normalizer.ts
export function normalizeHTML(html: string, postType: string): string {
  // Step 1: Remove wrapper tags
  html = html.replace(/^<html[^>]*>|<\/html>$/gi, '');
  html = html.replace(/^<body[^>]*>|<\/body>$/gi, '');
  html = html.replace(/^<head[^>]*>.*?<\/head>/gis, '');

  // Step 2: Normalize whitespace
  html = html.replace(/\n\s*\n/g, '\n'); // Remove excessive line breaks
  html = html.trim();

  // Step 3: Enforce heading hierarchy
  html = enforceHTMLStructure(html, postType);

  // Step 4: Normalize list formatting
  html = html.replace(/<ul>\s+/g, '<ul>');
  html = html.replace(/\s+<\/ul>/g, '</ul>');

  // Step 5: Ensure consistent paragraph spacing
  html = html.replace(/<\/p><p>/g, '</p>\n<p>');

  return html;
}

// Usage in both routes:
// app/api/pirateCOS/ai/generate/route.ts
text = normalizeHTML(text, postType || "blog");

// app/api/pirateCOS/ai/workspace/route.ts
text = normalizeHTML(text, postType);
```

#### B. Cross-Route Context Sharing

**Create shared context builder:**

```typescript
// New file: lib/pirateCOS/ai-context-builder.ts
import { getGoalConfig, getPostTypeConfig } from "@/lib/pirateCOS/postTypeConfig";

export interface AIContextConfig {
  postType: string;
  contentGoal?: string;
  brandBrain?: any;
  workflowMemory?: any;
  customBrandVoice?: string;
  customAudience?: string;
  customKeywords?: string[];
}

export function buildAIContext(config: AIContextConfig): string {
  const { postType, contentGoal, brandBrain, customBrandVoice, customAudience, customKeywords } = config;

  let context = "";

  // Step 1: Content Goal
  const goalConfig = contentGoal ? getGoalConfig(contentGoal) : null;
  if (goalConfig) {
    context += `\n# CONTENT STRATEGY GOAL: ${goalConfig.label}\n${goalConfig.aiPriorityPrompt}\n`;
  }

  // Step 2: Post Type
  const typeConfig = getPostTypeConfig(postType);
  if (typeConfig) {
    const customHint = brandBrain?.presetInstructions?.[postType];
    const activeHint = customHint || typeConfig.templateHint;
    context += `\n# CONTENT ARCHETYPE: ${typeConfig.label}\n${activeHint}\n`;
  }

  // Step 3: Brand Brain
  context += buildBrandContext(brandBrain, customBrandVoice, customAudience, customKeywords);

  return context;
}

// Use in all routes
```

---

## Implementation Plan

### Phase 1: Core Infrastructure (4 days)

**Files:**
- `lib/pirateCOS/html-normalizer.ts` (new)
- `lib/pirateCOS/ai-context-builder.ts` (new)

**Tasks:**
- [ ] Create `normalizeHTML()` function with heading enforcement
- [ ] Create `buildAIContext()` shared context builder
- [ ] Create `buildBrandContext()` shared Brand Brain formatter
- [ ] Create `buildPresetDirective()` with postTypeConfig integration
- [ ] Add `enforceHTMLStructure()` and `fixHeadingHierarchy()` helpers

### Phase 2: Generate Route Refactoring (3 days)

**File:** `app/api/pirateCOS/ai/generate/route.ts`

- [ ] Refactor preset logic to use `buildPresetDirective()`
- [ ] Reorder prompt construction (Goal → Brand → Preset → User)
- [ ] Update meta description generator with goal awareness
- [ ] Update title generator with goal + brand awareness
- [ ] Update focus keyword generator with brand keyword integration
- [ ] Enhance SEO analysis with brand alignment scoring
- [ ] Add word count validation and metadata response
- [ ] Apply `normalizeHTML()` to all `action === "write"` outputs

### Phase 3: Workspace Route Synchronization (2 days)

**File:** `app/api/pirateCOS/ai/workspace/route.ts`

- [ ] Replace inline brand context with `buildBrandContext()`
- [ ] Apply `normalizeHTML()` to all chat and quick action outputs
- [ ] Ensure same prompt ordering as generate route
- [ ] Add word count validation for chat-generated long-form content

### Phase 4: Repurposing Route Enhancement (1 day)

**File:** `app/api/pirateCOS/posts/[id]/repurpose/route.ts`

- [ ] Add `postType` and `contentGoal` parameters
- [ ] Integrate `buildBrandContext()`
- [ ] Add goal-aware formatting hints for each format

### Phase 5: Testing & Validation (2 days)

- [ ] Test: SEO article preset generates 1,500-2,500 words
- [ ] Test: Thought leadership preset uses first-person voice
- [ ] Test: LinkedIn preset stays under 300 words
- [ ] Test: Meta descriptions respect goal (traffic vs. engagement)
- [ ] Test: Title suggestions include Brand Brain keywords
- [ ] Test: HTML structure is consistent across all routes
- [ ] Test: Content from generate route edits cleanly in workspace
- [ ] Test: Brand Brain forbidden words are filtered in all routes

---

## Success Metrics

### Quantitative
- **Word count accuracy**: 90%+ of preset-generated content within target range
- **Brand keyword usage**: 80%+ of SEO content includes at least 1 brand keyword
- **Structural consistency**: 100% of generated HTML has valid heading hierarchy
- **Cross-route compatibility**: 0 formatting errors when editing generate output in workspace

### Qualitative
- **User feedback**: "AI respects my post type settings"
- **User feedback**: "Meta descriptions actually match my content goal"
- **User feedback**: "Long articles stay on-brand and on-topic"

---

## Risk Mitigation

### Risk: Prompt Length Exceeds Token Limits
**Scenario:** Full context (goal + type + brand + preset + user) exceeds model limits.

**Mitigation:**
- Implement smart truncation: prioritize Brand Brain > Goal > Type > Preset
- Use shorter models for simple tasks (meta descriptions don't need full context)

### Risk: HTML Normalization Breaks User-Added Content
**Scenario:** User manually added specific HTML that normalization corrupts.

**Mitigation:**
- Only normalize AI-generated content (check `generationId` flag)
- Add opt-out flag: `{ skipNormalization: true }` in request

### Risk: Word Count Validation Too Strict
**Scenario:** AI generates 1,450 words for 1,500-2,500 range and system rejects it.

**Mitigation:**
- Use 80-120% tolerance range (allow 1,200-3,000 for 1,500-2,500 target)
- Return warning, not error (let user decide if acceptable)

---

## Appendix A: Updated Preset Definitions

```typescript
// Complete preset map integrated with postTypeConfig
const PRESET_DEFINITIONS = {
  "seo-article": {
    applicableTo: ["blog", "tutorial", "listicle"],
    wordCountMultiplier: 1.5, // Use 1.5x the postType maxWordCount
    requiredElements: ["FAQ section", "H2/H3 structure", "keyword-rich headings"],
  },
  "thought-leadership": {
    applicableTo: ["blog", "community-insight"],
    voice: "first-person, conversational yet authoritative",
    requiredElements: ["contrarian viewpoint", "real-world stories"],
  },
  "linkedin-post": {
    applicableTo: ["social-post"],
    strictWordCount: "200-300",
    requiredElements: ["hook", "double line spacing", "emojis", "engagement question"],
  },
  // ... 5 more presets
};
```

---

## Appendix B: Before/After Comparison by Action

| Action | Before 4F+ | After 4F+ |
|--------|-----------|-----------|
| **SEO Article Preset** | ❌ Ignores word count, generates 800 words for 2,500 target<br>❌ Generic tone, ignores Brand Brain<br>❌ No FAQ section despite preset requirement | ✅ Enforces 1,500-2,500 word range<br>✅ Respects Brand Brain voice and keywords<br>✅ Always includes FAQ H2 section |
| **Meta Description** | ❌ Generic summary, no goal awareness<br>❌ Doesn't adapt to traffic vs. conversion goal<br>❌ Ignores Brand Brain voice | ✅ Traffic goal = keyword-rich<br>✅ Conversion goal = benefit-focused<br>✅ Maintains brand voice in 160 chars |
| **Title Suggestions** | ❌ Generic clickbait titles<br>❌ No postType consideration<br>❌ Ignores brand keywords | ✅ Traffic goal = SEO-optimized<br>✅ Engagement goal = curiosity-driven<br>✅ Integrates brand keywords naturally |
| **Focus Keyword** | ❌ Random keyword, no brand context<br>❌ Doesn't consider existing brand keywords | ✅ Suggests variations of brand keywords<br>✅ Context-aware to content goal |
| **SEO Analysis** | ❌ No brand alignment scoring<br>❌ Generic readability analysis | ✅ Includes "Brand Alignment" metric<br>✅ Targets brand's sentence complexity level |
| **Long-Form Content** | ❌ Inconsistent H2/H3 hierarchy<br>❌ Sometimes includes H1 tags<br>❌ H2 → H4 jumps | ✅ Enforces valid heading hierarchy<br>✅ Removes H1 tags automatically<br>✅ Fixes heading level jumps |
| **Workspace → Generate** | ❌ Different HTML patterns break continuity<br>❌ Edits from workspace don't match generate output | ✅ Shared `normalizeHTML()` ensures consistency<br>✅ Seamless transition between routes |

---

## Appendix C: Architectural Diagrams

### Context Injection Order (New - Updated with User Inputs)

```
┌─────────────────────────────────────────────────────────┐
│ 1. CONTENT STRATEGY GOAL (if present)                  │
│    → goalConfig.aiPriorityPrompt                        │
│    → "Optimize for organic search traffic..."          │
└─────────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────┐
│ 2. CONTENT ARCHETYPE (postType)                        │
│    → typeConfig.templateHint OR brandBrain.preset[type] │
│    → "Structure as SEO article with H2/H3..."          │
└─────────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────┐
│ 3. USER CONTENT FOCUS ⭐ NEW PRIORITY                   │
│    → brief: "What the user wants to write about"       │
│    → keywords: "Specific terms to target"              │
│    → "📌 TOPIC BRIEF: How to optimize React..."        │
└─────────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────┐
│ 4. BRAND BRAIN (identity & voice)                      │
│    → Company name, brand voice, products, audience     │
│    → Target keywords, forbidden words                  │
│    → Sentence complexity, formatting rules             │
│    → Note: customKeywords override brandBrain keywords │
└─────────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────┐
│ 5. PRESET DIRECTIVE (if present)                       │
│    → buildPresetDirective() combines all above context │
│    → "STRICT WORD COUNT: 1,500-2,500..."              │
└─────────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────┐
│ 6. USER PROMPT (final intent)                          │
│    → "Write about content operations best practices"   │
└─────────────────────────────────────────────────────────┘
```

### Old vs. New Prompt Construction

**BEFORE:**
```
systemInstructions = "Write comprehensive content..."
+ userPrompt
+ presetDirective (overwrites tone)
+ brandBrain (conflicts with preset)
+ brief/keywords (buried as footnote)
→ Result: User inputs ignored, preset dominates
```

**AFTER:**
```
systemInstructions =
  goalConfig.aiPriorityPrompt          // 1. Strategic foundation
  + typeConfig.templateHint            // 2. Structural guidance
  + buildUserFocusContext(brief, keywords)  // 3. USER'S SPECIFIC INTENT ⭐
  + buildBrandContext(brandBrain)      // 4. Brand identity
  + buildPresetDirective()             // 5. Task-specific augmentation
  + userPrompt                         // 6. Final refinement
→ Result: All layers reinforce, user inputs prioritized
```

---

## Appendix D: Implementation Checklist

### Shared Infrastructure
- [ ] `lib/pirateCOS/html-normalizer.ts`
  - [ ] `normalizeHTML(html, postType)` function
  - [ ] `enforceHTMLStructure(html, postType)` function
  - [ ] `fixHeadingHierarchy(html)` function
- [ ] `lib/pirateCOS/ai-context-builder.ts`
  - [ ] `buildAIContext(config)` function
  - [ ] `buildBrandContext(brandBrain, ...)` function (updated to handle customKeywords override)
  - [ ] `buildPresetDirective(preset, postType, ...)` function
  - [ ] `buildUserFocusContext(brief, keywords)` function ⭐ NEW

### Route Updates
- [ ] **generate/route.ts** (Major Refactor)
  - [ ] Reorder prompt construction (lines 181-297)
  - [ ] Update preset logic (lines 120-141)
  - [ ] Update meta description (lines 145-146)
  - [ ] Update title suggestions (lines 149-152)
  - [ ] Update focus keyword (lines 147-148)
  - [ ] Update SEO analysis (lines 155-180)
  - [ ] Add word count validation
  - [ ] Apply `normalizeHTML()` to output
- [ ] **workspace/route.ts** (Moderate Update)
  - [ ] Replace inline brand context (lines 356-409)
  - [ ] Apply `normalizeHTML()` to output
  - [ ] Sync prompt ordering with generate route
- [ ] **repurpose/route.ts** (Minor Update)
  - [ ] Add postType and contentGoal parameters
  - [ ] Integrate `buildBrandContext()`

### Testing Matrix

| Test Case | Expected Behavior | Route | Priority |
|-----------|-------------------|-------|----------|
| SEO article preset with "blog" postType | 1,500-2,500 words, FAQ section, H2/H3 structure | generate | P0 |
| SEO article preset with Brand Brain keywords | Includes at least 2 brand keywords | generate | P0 |
| Meta description for "traffic" goal | Keyword-rich, search-optimized language | generate | P1 |
| Meta description for "conversion" goal | Benefit-focused, action-oriented language | generate | P1 |
| Title suggestions for "listicle" postType | Includes numbers, "Top X" format | generate | P1 |
| Focus keyword with brand keywords set | Suggests variation of existing brand keyword | generate | P1 |
| Long-form content HTML structure | No H1 tags, valid H2→H3 hierarchy | generate | P0 |
| Generate → Workspace edit continuity | No formatting breaks when editing | both | P0 |
| Forbidden words filter | Brand Brain forbidden words never appear | all | P0 |
| Word count enforcement | Generated content within 80-120% of target | generate | P1 |

---

## Appendix E: Integration with Phase 4F Precision Editing

Phase 4F+ and Phase 4F work together to create a **full-stack AI architecture**:

### Division of Responsibilities

| Phase | Scope | Focus |
|-------|-------|-------|
| **Phase 4F** | Workspace chat edits | Surgical vs. Transform vs. Rewrite intent detection |
| **Phase 4F+** | Initial generation across all routes | Consistent Brand Brain, postType, and goal integration |

### Shared Components

Both phases use:
- `buildBrandContext()` — Unified Brand Brain formatting
- `normalizeHTML()` — Consistent HTML output
- `buildAIContext()` — Shared goal + type context construction

### Example User Flow

1. **User creates new post**: Selects postType="tutorial", contentGoal="traffic"
2. **User uses preset**: "SEO Article" → Phase 4F+ generates 2,000-word tutorial with:
   - Traffic-focused keywords (from goalConfig)
   - Step-by-step structure (from typeConfig.templateHint)
   - Brand voice (from buildBrandContext)
   - Valid H2/H3 hierarchy (from normalizeHTML)
3. **User edits in workspace chat**: "Remove all em-dashes" → Phase 4F detects surgical edit:
   - Preserves structure and tone
   - Makes only the requested change
   - Maintains HTML formatting from Phase 4F+
4. **User generates meta description**: Phase 4F+ creates traffic-optimized description
5. **User gets title suggestions**: Phase 4F+ provides SEO-focused titles with brand keywords

→ **Result:** Seamless, consistent AI experience from generation through refinement.

---

## Appendix F: Performance Considerations

### Token Optimization

**Challenge:** Full context (goal + type + brand + preset) can exceed token limits.

**Solution: Smart Context Truncation**

```typescript
function buildOptimizedContext(config: AIContextConfig, maxTokens: number): string {
  const fullContext = buildAIContext(config);
  const estimatedTokens = fullContext.length / 4; // Rough estimate

  if (estimatedTokens <= maxTokens) {
    return fullContext;
  }

  // Priority: Brand Brain > Goal > Type > Preset
  let optimized = "";
  optimized += buildBrandContext(config.brandBrain, ...); // Always include

  const remaining = maxTokens - (optimized.length / 4);

  if (remaining > 200) {
    const goalConfig = config.contentGoal ? getGoalConfig(config.contentGoal) : null;
    if (goalConfig) {
      optimized += `\n# GOAL: ${goalConfig.label}\n${goalConfig.aiPriorityPrompt.substring(0, 500)}...\n`;
    }
  }

  if (remaining > 100) {
    const typeConfig = getPostTypeConfig(config.postType);
    if (typeConfig) {
      optimized += `\n# TYPE: ${typeConfig.label}\n${typeConfig.templateHint.substring(0, 300)}...\n`;
    }
  }

  return optimized;
}
```

### Caching Strategy

**Opportunity:** Brand Brain and postTypeConfig rarely change.

**Implementation:**
```typescript
// In-memory cache with TTL
const contextCache = new Map<string, { context: string; expiresAt: number }>();

function getCachedBrandContext(tenantId: string, brandBrain: any): string {
  const cacheKey = `brand:${tenantId}:${JSON.stringify(brandBrain)}`;
  const cached = contextCache.get(cacheKey);

  if (cached && cached.expiresAt > Date.now()) {
    return cached.context;
  }

  const context = buildBrandContext(brandBrain);
  contextCache.set(cacheKey, {
    context,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 min TTL
  });

  return context;
}
```

---

## Competitive Differentiation

| Feature | Jasper | Copy.ai | Writer | **PirateCOS 4F+** |
|---------|--------|---------|--------|-------------------|
| Post-type aware generation | ❌ | ❌ | ❌ | ✅ |
| Content goal integration (traffic/conversion/etc.) | ❌ | ❌ | Limited | ✅ |
| Brand Brain across ALL AI tools | Limited | ❌ | Basic | ✅ |
| Preset respect for word count | ❌ | ❌ | ❌ | ✅ |
| Context-aware meta descriptions | ❌ | ❌ | ❌ | ✅ |
| HTML structure enforcement | ❌ | ❌ | ❌ | ✅ |
| Seamless generation → editing flow | ❌ | ❌ | ❌ | ✅ |
| Goal-aware SEO analysis | ❌ | ❌ | ❌ | ✅ |

**Unique Value Prop:** PirateCOS is the only platform where every AI interaction—from generating a 2,500-word article to creating a meta description—understands your content goal, respects your brand voice, and maintains structural consistency.

---

**End of Phase 4F+ Plan**

