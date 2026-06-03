# Phase 4E — AI-Native Workspace Panel

> **Status:** Complete & Verified
> **Audit baseline:** June 3, 2026 (post-Phase 4C)
> **Strategic classification:** UX Differentiator / Competitive Moat

---

## Product Philosophy

PirateCOS moves from "editor with AI buttons" to an **AI-native editing environment** — the same conceptual leap Cursor made from VS Code. The AI is not a feature you activate. It is a persistent collaborator embedded in the writing surface itself.

The interaction model is **workflow-first, not chatbot-first.** The panel presents contextual actions as the primary interface; the conversation thread is secondary, present but quiet.

---

## What Changes in the Editor Layout

### Before Phase 4E

```
┌────────────────────────────────────────────────────────┐
│ TipTap Editor (full width)                             │
│                                   [AI modal buttons]   │
│                                   scattered in toolbar │
└────────────────────────────────────────────────────────┘
```

### After Phase 4E

```
┌──────────────────────────────┬─────────────────────────┐
│                              │  AI WORKSPACE PANEL     │
│  TipTap Editor               │  (persistent, sticky)   │
│  (main content area,         │  288px fixed width      │
│   slightly narrowed)         │                         │
│                              │  § Quick Actions        │
│                              │  § Context Display      │
│                              │  § AI Conversation      │
│                              │  § Generation History   │
│                              │                         │
└──────────────────────────────┴─────────────────────────┘
```

The panel is **always visible** during editing. It does not open/close via a button. It is part of the workspace chrome — like a split-pane IDE.

On viewports below 1200px, the panel collapses to an icon rail that expands on demand.

---

## Panel Architecture

### Component: `AIWorkspacePanel`

**File:** `components/pirateCOS/AIWorkspacePanel.tsx`

```typescript
interface AIWorkspacePanelProps {
  postId: string | null;
  postType: PostType;
  contentGoal: ContentGoal;
  editorRef: React.RefObject<Editor>; // TipTap editor instance
  brandBrain: BrandBrain | null;
  workflowMemory: WorkflowMemory | null;
  onApplyToEditor: (text: string, mode: ApplyMode) => void;
  onOpenRepurposingDrawer: () => void;
}

type ApplyMode = "replace" | "insert-below" | "insert-above";

interface AIWorkspaceSession {
  postId: string;
  messages: AIWorkspaceMessage[];
  generations: GenerationRecord[];
  selectedTextSnapshots: TextSnapshot[];
}

interface AIWorkspaceMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  associatedGenerationId?: string;
  selectedTextContext?: string; // the selection that was active when this message was sent
}

interface GenerationRecord {
  id: string;
  prompt: string;
  output: string;
  mode: QuickActionMode | "chat";
  appliedAt?: Date;
  isAccepted: boolean;
  selectedTextContext?: string;
}
```

---

## Section 1 — Quick Actions

**The most used surface. Should feel like a keyboard shortcut panel, not a form.**

Quick actions are aware of:
- Whether text is currently selected in the editor
- The active `postType` and `contentGoal`
- Brand Brain voice and vocabulary rules
- Workflow Memory preferences

### Action Set

| Action | Icon | Behaviour when text selected | Behaviour with no selection |
|--------|------|------------------------------|----------------------------|
| Improve writing | `ti-sparkles` | Rewrites the selected passage | Rewrites the focused paragraph |
| Shorten | `ti-minimize` | Condenses selection by ~40% | Condenses focused paragraph |
| Expand | `ti-maximize` | Elaborates on the selection | Elaborates on focused paragraph |
| Change tone | `ti-adjustments` | Applies tone variant flyout | Applies to full document opening section |
| SEO optimize | `ti-trending-up` | Rewrites selection for keyword density | Runs copilot-style SEO scan |
| Generate CTA | `ti-external-link` | Inserts CTA block below selection | Inserts CTA block at end of post |
| Continue from here | `ti-arrow-right` | Generates continuation from end of selection | Generates continuation from cursor |
| Rewrite for LinkedIn | `ti-brand-linkedin` | Generates LinkedIn variant from selection | Opens repurposing drawer |

**Tone Variant Flyout** (appears on "Change tone" click):

```
Professional · Conversational · Bold · Technical · Empathetic · Provocative
```

Selecting a variant immediately triggers generation — no secondary confirm step.

### Selection-Awareness UX

When the user selects text in the editor, the panel header updates:

```
┌────────────────────────────┐
│  ✦ 43 words selected       │  ← subtle indicator, not a banner
│                            │
│  [ Improve ] [ Shorten ]   │
│  [ Expand  ] [ Rewrite ]   │
└────────────────────────────┘
```

The selected text is automatically injected as context into every action without the user having to do anything. **This is the core UX magic — context travels automatically.**

---

## Section 2 — Context Display

A compact, always-visible strip showing what the AI "knows" about the current document. Collapsed by default, expandable.

```
┌──────────────────────────────┐
│ Context ▾                    │
├──────────────────────────────┤
│ Type     Blog                │
│ Goal     Traffic (SEO)       │
│ Voice    Professional        │
│ Keyword  content operations  │
│ Selected (none)              │
└──────────────────────────────┘
```

This serves two purposes: it reassures the user that the AI isn't "forgetting" their setup, and it makes the implicit context explicit so users can understand why suggestions read the way they do.

---

## Section 3 — AI Conversation Thread

**Workflow-first rule:** The chat input is below the fold by default. Quick actions are above it. The conversational interface exists for nuanced requests that don't fit a quick action — not as the primary mode.

### Thread Display

Each message in the thread shows:
- User prompt (with optional selected-text context indicator)
- AI response with the Apply/Insert/Replace action bar
- Timestamp

```
┌─────────────────────────────────────┐
│  You · 2m ago                       │
│  Make the intro more punchy         │
│  [Context: 87 words selected]       │
├─────────────────────────────────────┤
│  ✦ AI                               │
│  Here's a punchier version:         │
│                                     │
│  "Content doesn't publish itself.   │
│  Most teams waste 3 hours per post  │
│  on manual copy-paste. Here's how   │
│  to cut that to 8 minutes."         │
│                                     │
│  [Replace selection] [Insert below] │
│  [Save as snippet]  [Try a variant] │
└─────────────────────────────────────┘
```

### Apply Actions

Every AI response includes exactly these four actions:

| Action | Behaviour |
|--------|-----------|
| Replace selection | Swaps selected text with generated output |
| Insert below | Injects output after the selection/cursor |
| Save as snippet | Stores to Workflow Memory snippet library |
| Try a variant | Regenerates with slight variation, appends below |

"Try a variant" never replaces the previous generation — it appends as a second card so the user can compare. Maximum 3 variants shown before the thread collapses older ones.

### Conversation Scope

Each document has its own isolated session. Sessions are persisted on the Post document:

```typescript
// models/Post.ts — new field
aiWorkspaceSession?: {
  messages: AIWorkspaceMessage[];
  generations: GenerationRecord[];
  lastActiveAt: Date;
};
```

Sessions do NOT persist between posts. They persist within a post across browser refreshes. A user who closes and reopens a post mid-edit gets their full AI conversation back.

---

## Section 4 — Generation History

A scrollable chronological log of all AI outputs for this document session.

```
┌──────────────────────────────┐
│  History (6)            ▾   │
├──────────────────────────────┤
│  ✓ Improve · 3m ago         │  ← green tick = applied to doc
│  "Content doesn't publish…" │
│                              │
│  · Shorten · 8m ago         │  ← no tick = discarded
│  "Most teams lose 3 hours…" │
│                              │
│  ✓ Generate CTA · 11m ago   │
│  "Start your free trial →"  │
└──────────────────────────────┘
```

History items can be re-applied at any time. Clicking a discarded item opens it in a preview card with the apply actions. This enables the "continue refining" workflow — the user never loses a generated version.

---

## Backend: Conversation-Scoped API

### New Route

**`POST /api/pirateCOS/ai/workspace`**

```typescript
// Request
{
  postId: string;
  action: QuickActionMode | "chat";
  selectedText?: string;
  userMessage?: string;           // for chat mode
  applyMode?: ApplyMode;
  sessionHistory: AIWorkspaceMessage[]; // sent from client, always the full thread
}

// Response
{
  output: string;
  generationId: string;
  tokensUsed: number;
}
```

The session history is passed in from the client on every request — the server is stateless. This mirrors the pattern used in `ai/generate` and avoids server-side session storage complexity.

The route injects context in this order:

1. Brand Brain (company, audience, voice, forbidden words)
2. Workflow Memory (tone, complexity, CTA style, formatting prefs)
3. Post metadata (type, goal, SEO keyword)
4. Selected text (if present)
5. Session history (last 8 messages for token efficiency)
6. User message / quick action prompt

---

## Critical UX Principles

### The Panel Must Feel Calm

The panel should have **zero visual noise when idle.** No spinning animations, no pulsing indicators, no "AI is ready" banners. It is simply there — like a notepad next to your desk.

Activity states:
- **Idle:** Panel shows quick actions and context. Quiet.
- **Generating:** Subtle streaming text appears in the thread. A single small spinner next to the model name.
- **Complete:** Apply actions appear. No celebratory animation.
- **Error:** Inline error in the thread with a retry button. No modal.

### The Panel Must Never Interrupt

The panel does not trigger unsolicited suggestions. It does not analyze text in the background and surface popups. (The real-time co-pilot handles that separately — the workspace panel is different.) The panel responds only to explicit user actions.

The co-pilot and the workspace panel are **complementary, not redundant:**
- **Co-pilot:** Ambient, passive, inline. Squiggly underlines and hover cards.
- **Workspace panel:** Explicit, persistent, conversational. User-initiated.

### Apply/Insert/Replace Is the Core Loop

Every AI output should default to a concrete editorial action. The conversational thread is a means to an end — the end is always improving the document. If a user sends 5 messages and never uses "Replace selection" once, something is wrong with the UX.

---

## Implementation Checklist

### Database

- [x] Extend `models/Post.ts` with `aiWorkspaceSession` field
- [x] Extend `models/pirateCOS/WorkflowMemory.ts` with `snippetLibrary: string[]`

### Backend

- [x] `POST /api/pirateCOS/ai/workspace` route with full context injection pipeline
- [x] Session trimming logic (keep last 20 messages max to control token usage)
- [x] Credit deduction: 0.5 credits per quick action, 1.0 credit per chat message (consistent with Phase 2 pricing)

### Frontend

- [x] `components/pirateCOS/AIWorkspacePanel.tsx` — main panel component
- [x] `components/pirateCOS/workspace/QuickActions.tsx` — action grid with selection awareness
- [x] `components/pirateCOS/workspace/ContextDisplay.tsx` — collapsed context strip
- [x] `components/pirateCOS/workspace/ConversationThread.tsx` — message list with apply actions
- [x] `components/pirateCOS/workspace/GenerationHistory.tsx` — history log with re-apply
- [x] `hooks/useEditorSelection.ts` — hook exposing selected text and selection range to the panel
- [x] `hooks/useAIWorkspaceSession.ts` — local session state + persistence API calls
- [x] Editor layout update in `create/page.tsx` and `edit/[id]/page.tsx` to split-pane with panel
- [x] Responsive collapse behavior below 1200px viewport

### Settings

- [x] Panel width user preference saved to `WorkflowMemory.uiPreferences`
- [x] Option to show/hide History section
- [x] Quick action set customization (reorder, hide unused actions) — Pro tier

---

## Competitive Position

| Feature | Jasper | Notion AI | Writer | **PirateCOS 4E** |
|---------|--------|-----------|--------|-----------------|
| Persistent AI side panel | ❌ | ❌ | ❌ | ✅ |
| Context inherits post goal/type | ❌ | ❌ | ❌ | ✅ |
| Brand Brain in every generation | ❌ | ❌ | ✅ (basic) | ✅ |
| Per-document AI conversation history | ❌ | ❌ | ❌ | ✅ |
| Apply / Insert / Replace workflow | ❌ | ✅ (limited) | ❌ | ✅ |
| Selection-aware quick actions | ❌ | ✅ | ❌ | ✅ |
| Connects to distribution pipeline | ❌ | ❌ | ❌ | ✅ |

PirateCOS is the only tool where a single selection can flow from **context-aware rewrite → apply to doc → LinkedIn repurpose → distribute** without leaving the editor.

---

## Revenue Impact

The workspace panel is a **retention feature** more than an acquisition feature. Once users build a session history on a document, the psychological cost of switching tools becomes extremely high. The AI conversation is uniquely theirs.

**Tier gating:**

| Feature | Free | Pro | Enterprise |
|---------|------|-----|------------|
| Quick Actions (6 of 8) | ✅ | ✅ | ✅ |
| Full Quick Actions (all 8) | ❌ | ✅ | ✅ |
| AI Conversation thread | ❌ | ✅ | ✅ |
| Generation History | ❌ | ✅ | ✅ |
| Session persistence across refreshes | ❌ | ✅ | ✅ |
| Snippet Library | ❌ | ✅ | ✅ |
| Quick action customization | ❌ | ❌ | ✅ |

Free users get the quick actions panel (read-only conversation, no history) — enough to demonstrate the value without giving away the stickiness layer.

---

## Timeline Estimate

| Milestone | Effort |
|-----------|--------|
| Backend workspace API route + context injection | 2 days |
| Post schema extension + session persistence | 1 day |
| Panel layout + split-pane editor layout | 2 days |
| Quick Actions component + selection awareness hook | 2 days |
| Conversation thread + apply actions | 2 days |
| Generation history + re-apply | 1 day |
| Responsive collapse + settings integration | 1 day |
| Testing + UX polish | 2 days |
| **Total Phase 4E** | **~13 days (~2.5 weeks)** |

**No blocking dependencies.** Can begin immediately after Phase 4C verification.