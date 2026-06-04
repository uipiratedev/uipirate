# Phase 4F — Precision Chat Editing & Contextual Refinement

> **Status:** Planned
> **Priority:** High (User Experience / Competitive Moat)
> **Dependencies:** Phase 4E (AI Workspace Panel)
> **Strategic Impact:** Addresses core user complaint: "AI rewrites everything when I just want a small change"
> **Estimated Effort:** 7 days (~1.5 weeks)

---

## Executive Summary

Phase 4F transforms PirateCOS from a "regeneration-heavy" AI writing tool into a **precision editing assistant** that understands the difference between:
- **Surgical edits** ("remove em-dashes") → Changes only what's requested
- **Transformations** ("make this shorter") → Modifies while preserving core structure
- **Rewrites** ("rewrite for developers") → Full content regeneration
- **Continuations** ("keep writing") → Extends existing content seamlessly

**Key innovation:** Intent-based prompt engineering that prevents "regeneration drift" — the current behavior where asking for a small change results in unwanted content restructuring.

**User-facing improvements:**
1. AI explains what it changed before showing results ("✏️ Removed 3 em-dashes")
2. Post type constraints are actively enforced (LinkedIn stays under 300 words, blogs get H2/H3 structure)
3. Apply mode buttons show "Recommended" badges based on edit type
4. Brand Brain rules don't interfere with surgical edits

---

## Quick Start Checklist

### Backend Changes (app/api/pirateCOS/ai/workspace/route.ts)
- [ ] Add `classifyEditIntent()` function with regex patterns
- [ ] Add `getPostTypeConstraints()` function
- [ ] Add `determineSuggestedApplyMode()` function
- [ ] Add intent-based `systemInstructions` branching (surgical/transform/rewrite/continue)
- [ ] Conditionally skip Brand Brain for surgical edits
- [ ] Add "✏️ Change summary:" instruction to prompts
- [ ] Return `suggestedApplyMode` in response

### Frontend Changes
- [ ] **ConversationThread.tsx**: Add `parseAIResponse()` helper
- [ ] **ConversationThread.tsx**: Display change summary badge UI
- [ ] **ConversationThread.tsx**: Add "Recommended" badge to apply buttons
- [ ] **useAIWorkspaceSession.ts**: Store and handle `suggestedApplyMode`

### Testing
- [ ] Test: "remove all em-dashes" → only removes em-dashes
- [ ] Test: "change 'utilize' to 'use'" → only makes that substitution
- [ ] Test: "make this more conversational" → transforms while preserving structure
- [ ] Test: "rewrite for developers" → full regeneration with technical tone
- [ ] Test: LinkedIn post stays under 300 words after edit
- [ ] Test: Blog post maintains H2/H3 structure after transformation

---

## Problem Statement

### Current Behavior (Regeneration Drift)

When a user provides a **specific, surgical instruction** via the chat interface, such as:
- "remove all em-dashes"
- "change 'utilize' to 'use' throughout"
- "make the second sentence more concise"
- "fix this typo: 'recieve' → 'receive'"

The AI currently **regenerates the entire content block**, often:
- Changing sentence structure unnecessarily
- Altering tone or voice
- Removing or adding content beyond the requested scope
- Breaking formatting or losing user-specific phrasing

This happens because the current prompt strategy in `app/api/pirateCOS/ai/workspace/route.ts` treats **all chat requests as full rewrites**, not as **diff-style edits**.

### Root Cause Analysis

#### 1. **Prompt Construction Lacks Edit Intent Detection**

Lines 322-328 in `workspace/route.ts`:

```typescript
systemInstructions = `You are a world-class professional copywriter and technical content author. 
The user wants you to write content based on the following instructions: "${actionPrompt}". 
The context of the post is: title: "${postTitle}", category: "${postType}".${contextInfo}${briefContext}
Write a comprehensive, fully detailed, and substantial piece of content...`
```

**Issue:** The phrase "write a comprehensive, fully detailed" signals to the AI that it should **generate new content**, not **edit existing content**.

#### 2. **No Distinction Between Quick Actions and Chat Edits**

Lines 280-311 construct `actionPrompt` differently for quick actions vs. chat, but the system instructions remain identical. Quick actions like "improve" or "shorten" are **transformation directives**, while chat messages like "remove em-dashes" are **precision edits**.

#### 3. **Context Injection Overwrites User Intent**

Lines 331-354 inject Brand Brain, content goal, and post type context **after** the user's instruction. This causes the AI to prioritize "writing in brand voice" over "making the exact change requested."

#### 4. **Missing Edit Mode Classification**

The API does not distinguish between:
- **Full rewrites** ("rewrite this section to focus on developers")
- **Transformations** ("make this more conversational")
- **Surgical edits** ("remove all exclamation marks")
- **Continuations** ("keep writing from here")

---

## Solution Architecture

### 1. Precision Editing Logic

#### A. Edit Intent Detection

Add intent classification to the workspace route:

```typescript
// New utility function in workspace/route.ts
function classifyEditIntent(userMessage: string, action: string): "surgical" | "transform" | "rewrite" | "continue" {
  if (action !== "chat") {
    // Quick actions are always transformations
    return action === "continue" ? "continue" : "transform";
  }

  const surgical_patterns = [
    /remove|delete|fix|change .* to|replace .* with/i,
    /correct|typo|spelling|grammar|punctuation/i,
    /add a comma|remove quotes|capitalize/i,
  ];

  const continue_patterns = [
    /continue|keep writing|extend|elaborate from here/i,
  ];

  const rewrite_patterns = [
    /rewrite|rephrase|restructure|completely change/i,
  ];

  for (const pattern of surgical_patterns) {
    if (pattern.test(userMessage)) return "surgical";
  }
  for (const continue_patterns of continue_patterns) {
    if (pattern.test(userMessage)) return "continue";
  }
  for (const pattern of rewrite_patterns) {
    if (pattern.test(userMessage)) return "rewrite";
  }

  // Default to transform for ambiguous requests
  return "transform";
}
```

#### B. Intent-Specific System Instructions

```typescript
let systemInstructions = "";
const editIntent = classifyEditIntent(userMessage || "", action);

if (editIntent === "surgical") {
  systemInstructions = `You are a precise text editor. The user has requested a SPECIFIC, SURGICAL change to their text.

CRITICAL RULES:
1. Make ONLY the exact change requested. Do not rephrase, restructure, or "improve" anything else.
2. Preserve the original text's tone, structure, and formatting completely.
3. If the user said "remove X", remove X and nothing else.
4. If the user said "change X to Y", change X to Y and leave everything else untouched.
5. Return the FULL text with only the requested change applied.
6. Do NOT add explanations, improvements, or suggestions. Just make the edit.

Original text:
"${targetText}"

User's edit instruction:
"${userMessage}"

Output the edited text with ONLY the requested change applied.`;

} else if (editIntent === "transform") {
  // Existing transformation prompt (lines 322-328), but with preservation clause
  systemInstructions = `You are a world-class professional copywriter. 
The user wants you to ${actionPrompt}.

IMPORTANT: This is a TRANSFORMATION, not a rewrite. Preserve the core structure, key points, and information architecture. 
Change ONLY what is necessary to achieve: ${actionPrompt}

Context: title: "${postTitle}", category: "${postType}".${contextInfo}${briefContext}...`;

} else if (editIntent === "continue") {
  systemInstructions = `You are a world-class professional copywriter continuing a piece of content.

Continue writing naturally from where the text ends. Match the tone, style, and flow EXACTLY. 
Do NOT repeat what's already written. Start with fresh content that flows seamlessly.

Existing text:
"${targetText}"

Continue from here, maintaining the same voice and structure.`;

} else {
  // Full rewrite (existing comprehensive prompt)
  systemInstructions = `You are a world-class professional copywriter...
Write a comprehensive, fully detailed, and substantial piece of content...`;
}
```

---

### 2. Context-Aware Refinement

#### A. Smarter Brand Brain Injection

**Current problem:** Brand Brain context is injected unconditionally, even for surgical edits.

**Solution:** Only inject Brand Brain for rewrites and transformations, not surgical edits.

```typescript
// Modified brand context injection (line 366+)
let brandContext = "";

if (editIntent !== "surgical") {
  // Only apply brand rules for non-surgical edits
  const activeName = brandBrain?.companyName || "Our Brand";
  const activeVoice = brandBrain?.brandVoice;
  // ... rest of existing brand context logic
}
```

#### B. Enhanced Post Type Context Utilization

**Current gap:** `postType` and `contentGoal` are passed to the prompt but not actively used in editing decisions.

**Solution:** Make constraints explicit for each post type.

```typescript
// New function in workspace/route.ts
function getPostTypeConstraints(postType: string, contentGoal: string): string {
  const constraints: Record<string, string> = {
    "social-post": "Keep it under 250 words. Use short, punchy paragraphs. No H2/H3 headings. Optimize for engagement.",
    "linkedin-post": "Use double line spacing. Include relevant emojis. End with an engagement question. 200-300 words max.",
    "blog": "Use proper H2/H3 structure. Aim for 800-2000 words. Include clear sections and transitions.",
    "case-study": "Follow Problem→Solution→Results structure. Include data points and customer quotes.",
    "newsletter": "Personal, conversational tone. Clear sections. Strong CTA at end.",
  };

  const goalHints: Record<string, string> = {
    "traffic": "Focus on SEO keywords and search intent. Use semantic variations.",
    "engagement": "Prioritize readability and emotional hooks. Short sentences.",
    "conversion": "Include benefit-driven language. Build urgency. Strong CTAs.",
    "retention": "Educational and valuable. Build trust through expertise.",
  };

  let hint = constraints[postType] || "";
  if (contentGoal && goalHints[contentGoal]) {
    hint += ` ${goalHints[contentGoal]}`;
  }
  return hint;
}

// Inject into system instructions (for transform/rewrite only)
if (editIntent === "transform" || editIntent === "rewrite") {
  const typeConstraints = getPostTypeConstraints(postType, contentGoal);
  if (typeConstraints) {
    systemInstructions += `\n\n[POST TYPE CONSTRAINTS]: ${typeConstraints}`;
  }
}
```

---

### 3. User-Friendly Response Patterns

#### A. AI Self-Documentation

Add a **response wrapper** that makes the AI explain its edits before showing the result:

```typescript
// New system instruction clause (for surgical and transform modes)
if (editIntent === "surgical" || editIntent === "transform") {
  systemInstructions += `\n\nBefore providing the edited text, write a brief 1-sentence explanation in this format:
"✏️ Change summary: [what you changed]"

Then output the edited HTML content.`;
}
```

#### B. Frontend Display Enhancement

Update `ConversationThread.tsx` to parse and display the change summary separately:

```typescript
// In ConversationThread.tsx, around line 312
const parseAIResponse = (content: string) => {
  const summaryMatch = content.match(/✏️ Change summary: (.+?)(?:\n|$)/);
  if (summaryMatch) {
    return {
      summary: summaryMatch[1],
      content: content.replace(/✏️ Change summary: .+?(?:\n|$)/, '').trim(),
    };
  }
  return { summary: null, content };
};

// In the message bubble rendering
const { summary, content: parsedContent } = parseAIResponse(msg.content);

{summary && (
  <div className="mb-2 p-2 bg-orange-50/50 rounded-lg text-[10px] text-gray-600 font-geist border-l-2 border-[#FF5B04]">
    ✏️ {summary}
  </div>
)}
<div className="ai-prose" dangerouslySetInnerHTML={{ __html: parsedContent }} />
```

---

### 4. Apply Mode Integration

#### Current State
Phase 4E defines `ApplyMode` types but the workspace API doesn't receive or utilize the `applyMode` parameter (line 264 in Phase 4E spec shows it's optional and unused).

#### Enhancement

**A. Track Apply Intent in Request**

```typescript
// Update workspace/route.ts POST handler
const {
  postId,
  action,
  selectedText,
  userMessage,
  sessionHistory = [],
  tone,
  engine,
  model,
  brief,
  keywords,
  applyMode = "replace", // Add this parameter
} = body;
```

**B. Return Apply Mode Suggestion**

```typescript
// In the response
return NextResponse.json({
  success: true,
  output: text,
  generationId,
  tokensUsed: Math.ceil(text.length / 4) + 500,
  suggestedApplyMode: determineSuggestedApplyMode(editIntent, action, selectedText),
});

// New helper function
function determineSuggestedApplyMode(
  editIntent: string,
  action: string,
  selectedText?: string
): "replace" | "insert-below" | "insert-above" {
  if (editIntent === "surgical" && selectedText) return "replace";
  if (editIntent === "continue") return "insert-below";
  if (action === "generate-cta") return "insert-below";
  if (selectedText) return "replace";
  return "insert-below";
}
```

**C. Auto-Select Apply Mode in Frontend**

Update `useAIWorkspaceSession.ts` around line 280:

```typescript
const data = await response.json();

if (!response.ok || !data.success) {
  throw new Error(data.error || "Failed to generate AI response.");
}

// Auto-apply if suggested mode is "replace" and user has selection
if (data.suggestedApplyMode === "replace" && selectedText) {
  // Could auto-apply here or show a highlighted "Recommended" badge on the button
}
```

---

## Implementation Plan

### Phase 1: Core Logic (3 days)

**File:** `app/api/pirateCOS/ai/workspace/route.ts`

- [ ] Add `classifyEditIntent()` function
- [ ] Add `getPostTypeConstraints()` function
- [ ] Add `determineSuggestedApplyMode()` function
- [ ] Refactor `systemInstructions` construction to use intent-based branching
- [ ] Add conditional Brand Brain injection (skip for surgical edits)
- [ ] Add change summary instruction to surgical/transform prompts
- [ ] Update response to include `suggestedApplyMode`

### Phase 2: Frontend Integration (2 days)

**Files:**
- `components/pirateCOS/workspace/ConversationThread.tsx`
- `hooks/useAIWorkspaceSession.ts`

- [ ] Add `parseAIResponse()` helper to extract change summaries
- [ ] Update message bubble UI to display summaries in highlighted blocks
- [ ] Add "Recommended" badge to apply mode buttons based on `suggestedApplyMode`
- [ ] Update apply action handlers to respect suggested mode

### Phase 3: Testing & Refinement (2 days)

- [ ] Test surgical edit patterns ("remove X", "change X to Y", "fix typo")
- [ ] Test transformation patterns ("make more concise", "change tone")
- [ ] Test rewrite patterns ("rewrite this section", "completely rephrase")
- [ ] Test continuation patterns ("continue from here", "keep writing")
- [ ] Verify Brand Brain is NOT applied to surgical edits
- [ ] Verify Brand Brain IS applied to rewrites and transformations
- [ ] Test apply mode suggestions for each intent type

---

## Success Metrics

### Qualitative
- **User feedback:** "AI now makes exactly the change I asked for" (reduce "regeneration drift" complaints)
- **Session depth:** Users engage in longer editing sessions (more back-and-forth refinement)

### Quantitative
- **Apply rate:** % of AI responses that result in "Replace selection" or "Insert below" action increases by 30%+
- **Variant requests:** "Try a variant" usage decreases (users get what they want on first try)
- **Session message count:** Average messages per session increases (users refine iteratively vs. giving up)

---

## Risk Mitigation

### Risk: Intent Classification False Positives
**Scenario:** User says "make this better" and system classifies as surgical edit.

**Mitigation:** Default ambiguous requests to "transform" mode, not surgical. Only classify as surgical when regex match is unambiguous.

### Risk: Surgical Edits Breaking Formatting
**Scenario:** User says "remove all bold text" and AI strips `<strong>` tags but breaks HTML.

**Mitigation:** Add HTML validation layer. If output is invalid HTML, retry with explicit instruction: "Maintain valid HTML structure."

### Risk: Change Summary Parsing Failures
**Scenario:** AI doesn't follow the `✏️ Change summary:` format.

**Mitigation:** Make parsing optional. If no summary found, display content normally (no visual breakage).

---

## Competitive Advantage

| Feature | Notion AI | Jasper | Copy.ai | **PirateCOS 4F** |
|---------|-----------|--------|---------|------------------|
| Surgical edit mode | ❌ | ❌ | ❌ | ✅ |
| Intent-based prompting | ❌ | ❌ | ❌ | ✅ |
| Change summary display | ❌ | ❌ | ❌ | ✅ |
| Post-type aware constraints | ❌ | ❌ | ❌ | ✅ |
| Smart apply mode suggestions | ❌ | Limited | ❌ | ✅ |

PirateCOS becomes the only AI writing tool that **understands the difference between editing and rewriting**.

---

## Post-Implementation: Future Enhancements

### A. Diff-Style Visualization
Show a before/after comparison for surgical edits (like GitHub diff view).

### B. Undo/Redo Stack
Track edit history with granular undo (undo last AI change without losing other edits).

### C. Multi-Turn Edit Refinement
"Make it shorter" → "Even shorter" → "Perfect" should incrementally refine, not regenerate.

### D. Voice Command Integration
"Remove all instances of 'very'" as a voice command → instant surgical edit.

---

## Appendix A: Example Prompts by Intent

### Surgical Edits
- "Remove all em-dashes"
- "Change 'utilize' to 'use'"
- "Fix typo: 'recieve' → 'receive'"
- "Add a comma after 'However'"
- "Remove exclamation marks"

### Transformations
- "Make this more conversational"
- "Shorten by 30%"
- "Make it more technical"
- "Simplify the language"

### Rewrites
- "Rewrite this section for developers"
- "Completely rephrase this intro"
- "Restructure with bullet points"

### Continuations
- "Continue from here"
- "Keep writing"
- "Elaborate on this point"

---

## Appendix B: Code Change Summary

### Files Modified

#### 1. `app/api/pirateCOS/ai/workspace/route.ts` (Primary Changes)

**New Functions:**
- `classifyEditIntent(userMessage: string, action: string)` → Returns "surgical" | "transform" | "rewrite" | "continue"
- `getPostTypeConstraints(postType: string, contentGoal: string)` → Returns constraint string
- `determineSuggestedApplyMode(editIntent, action, selectedText)` → Returns "replace" | "insert-below" | "insert-above"

**Modified Logic:**
- Lines 312-354: Replace single `systemInstructions` assignment with intent-based branching
- Lines 366-409: Wrap Brand Brain injection in `if (editIntent !== "surgical")` conditional
- Line 553-558: Add `suggestedApplyMode` to response JSON

#### 2. `components/pirateCOS/workspace/ConversationThread.tsx`

**New Functions:**
- `parseAIResponse(content: string)` → Extracts change summary and content separately

**Modified Rendering:**
- Lines 305-317: Add summary badge display before message content
- Add conditional styling for "Recommended" apply mode badge

#### 3. `hooks/useAIWorkspaceSession.ts`

**Modified:**
- Line 278+ (`sendMessage`): Handle `suggestedApplyMode` from response
- Line 383+ (`triggerAction`): Handle `suggestedApplyMode` from response
- Store suggested mode in message metadata for UI highlighting

---

## Appendix C: Regex Patterns for Intent Classification

### Surgical Edit Patterns
```javascript
/\b(remove|delete|fix|strip|eliminate)\b/i
/\b(change|replace|swap|substitute)\s+[""'']?\w+[""'']?\s+(to|with)\b/i
/\b(correct|fix)\s+(typo|spelling|grammar|punctuation)\b/i
/\b(add|insert)\s+(a\s+)?(comma|period|quote|semicolon)\b/i
/\bcapitalize\b/i
/\blowercase\b/i
```

### Continue Patterns
```javascript
/\b(continue|keep writing|extend|elaborate)\b/i
/\bfrom here\b/i
/\bkeep going\b/i
```

### Rewrite Patterns
```javascript
/\b(rewrite|rephrase|restructure|reword)\b/i
/\bcompletely (change|revise|redo)\b/i
/\bstart over\b/i
```

### Transform Patterns (Default)
Everything else defaults to transform mode, including:
- "make this [adjective]"
- "shorten"
- "expand"
- "improve"
- "change tone"

---

**End of Phase 4F Plan**
