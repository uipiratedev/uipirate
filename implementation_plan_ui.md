# Phase 4B — Content Lifecycle Orchestration: Dynamic Editor Rework & Concrete UX Plan

This document establishes the concrete, implementation-ready plan to adapt both the **guided wizard** and **immersive editor workspace** in `create/page.tsx` and `edit/[id]/page.tsx` for social media and blog/article writing. It removes abstract strategy talk and technical jargon in favor of clear, user-facing strategist copy, platform familiarity features, and context-aware AI utilities.

---

## 🛠️ Shared Social Writing Configuration

A unified social writing layout is declared in the client code to drive platform familiarity (no DB migrations are required for v1; existing `postType: "social-post"` remains the driver):

```typescript
type SocialDestination = "linkedin" | "x";

interface SocialDestinationConfig {
  label: string;
  characterLimit: number;
  warningAt: number;
  suggestions: string[];
}

const SOCIAL_DESTINATIONS: Record<SocialDestination, SocialDestinationConfig> = {
  linkedin: {
    label: "LinkedIn Post",
    characterLimit: 3000,
    warningAt: 2700,
    suggestions: ["#ThoughtLeadership", "#Innovation", "#Marketing", "#Tech", "#Strategy"],
  },
  x: {
    label: "X (Twitter) Post",
    characterLimit: 280,
    warningAt: 250,
    suggestions: ["#Tech", "#AI", "#Productivity", "#BuildInPublic", "#Startup"],
  },
};
```

*By default, the active social destination will fall back to `linkedin` if `postType === "social-post"`, allowing the user to toggle to `x` directly from the sidebar.*

---

## 🗺️ Master Mapping of UI Controls

To ensure a seamless, distraction-free environment, tools in the workspace are dynamically aligned:

### 1. Formatting Toolbar, Inline Inserter, and Slash `/` Commands
For `social-post` archetypes, all structural controls that standard social media feeds do not natively support are **completely hidden** (rather than grayed out) to prevent layout corruption.

| Feature Group | Specific Tool | Blog / Article (`blog`, `tutorial`, etc.) | Social Post (`social-post`) |
| :--- | :--- | :--- | :--- |
| **Active Rich Tools** | **AI Copilot** | **VISIBLE** | **VISIBLE** |
| | **Transform** | **VISIBLE** | **VISIBLE** |
| | **Bold / Italic / Strike** | **VISIBLE** | **VISIBLE** |
| | **Link Insertion** | **VISIBLE** | **VISIBLE** |
| | **Media (Image / Video)** | **VISIBLE** | **VISIBLE** |
| **Hidden Structures** | **H1 / H2 / H3** | **VISIBLE** | **HIDDEN** |
| | **Bullet & Numbered Lists** | **VISIBLE** | **HIDDEN** |
| | **Task Lists** | **VISIBLE** | **HIDDEN** |
| | **Blockquotes** | **VISIBLE** | **HIDDEN** |
| | **Code Blocks** | **VISIBLE** | **HIDDEN** (Except for developer code post types) |
| | **Dividers (`—`)** | **VISIBLE** | **HIDDEN** |
| | **Data Tables** | **VISIBLE** | **HIDDEN** |
| | **Inline Code & Highlight** | **VISIBLE** | **HIDDEN** |
| | **Text Color Picker** | **VISIBLE** | **HIDDEN** |
| | **CTA / Affiliate Links** | **VISIBLE** (If conversion goals) | **HIDDEN** |

*Note: The `/` Slash Command Menu filtering in both `create/page.tsx` and `edit/[id]/page.tsx` will be strictly aligned with the toolbar hiding rules, ensuring headings, lists, quotes, and tables do not appear in the search overlay.*

---

## 💎 Specific Rework Areas & Implementation Details

### 1. Simplified Guided Wizard
- **Concise Copy:** Rewrite all Step 1/2/3 labels and descriptions to describe narrative styles, tone of voice, and publishing targets, completely removing phrases like "hiding tools", "restricting menu bloat", or "experimental flags."
- **Simplified Step 3 Preview:** Replace the detailed ✅/❌ features grid with a clean card showing:
  - Archetype and goal badges.
  - A brief strategy blueprint summary: *"Your writing environment is calibrated. AI outlines and copy rules are optimized to match your goals. Let's make an impact!"*
  - Sleek CTA: `"Start Writing!"` with standard gradient background.
- **Encoding Correction:** Fix any mojibake/encoding issues in all visible text labels (e.g. quote characters, bullet marks, and dashes).

### 2. Goal-Adaptive Sidebar (Narrative Tab)
When a post is a `social-post`:
- **Narrative Tab:** Rename the `Content` tab to `Narrative` in the sidebar header.
- **Feed Guardrails:** Replace the `Analytics` card with a dedicated **Feed Guardrails** card showing:
  - Current character count vs. target limit (toggled between LinkedIn `3000` and X `280`).
  - Active progress bar that turns red when the text length crosses `warningAt` thresholds.
  - **Whitespace Spacing Advisor:** Scans text to display a warning if any paragraph exceeds 3 lines: *"Feeds favor breathing room. Split this into short 1-2 sentence paragraphs for better mobile reading."*
- **Excerpt Hiding:** Hide the `Excerpt` card completely.
- **Hashtag Assistant:** Replace `Tags` with a **Hashtag Assistant** panel:
  - Input field automatically prefixes inputs with `#` if omitted and prevents duplicate entries.
  - One-click suggestion buttons based on selected platform config (`suggestions`).
  - Automatically appends selected hashtags to the bottom of the editor content.

### 3. Context-Aware AI Tools
- **Social Posts AI Sidebar Tab:** Replace blog-only actions with custom social actions:
  - **AI Copilot** (Standard generative prompt).
  - **AI Hook** (Generate 3 scroll-stopping opening hooks).
  - **Shorten to Limit** (Intelligently compresses selected text to fit the 280-char or 3,000-char limits).
  - **Hashtag Ideas** (Generate high-engagement hashtags based on the post topic).
- **Blog/Article AI Sidebar Tab:** Keep Title, Excerpt, Tags, and SEO-oriented assistants active.
- **Prefilled AI Prompts:** Update `AICopilotModal` to accept an optional `initialPrompt` prop so distribution or contextual helper buttons can launch the modal with pre-configured, useful prompt text.
- **Plain HTML Generation:** Update the backend route `/api/pirateCOS/ai/generate` to respect `social-post` structures, outputting simple plain-text or single-paragraph HTML instead of long article structures.

### 4. Seamless Social Promotion Chain
- **Distribution Panel Rework:**
  - Replace the generic "Generate Variant" and "Trigger Repurpose" timeline items with concrete actions: `Draft LinkedIn Promo`, `Draft X Post`, and `Create Newsletter Digest`.
  - Only show these social promo actions after the local post is published (`blogPublished` is `true` or local database ID is saved).
  - Clicking any of these actions triggers the `AICopilotModal` and pre-populates it with a tailored promotional prompt injecting the post title, live URL, and destination.
- **Lighter Social Preflight Checks:**
  - For social posts, bypass blog checks (focus keywords, meta descriptions) and enforce lightweight preflight check parameters: content present, within character limits, has opening hook, optional hashtags, and media attachments.

---

## 🧪 Verification & Build Plan

### Automated Verification
- Run compiler check: `npx tsc --noEmit`.
- Run production compilation check: `npm run build`.
- Avoid mutating scripts like `eslint` unless explicitly requested.

### Manual Verification Flows
1. **Creation Wizard Flow:** Create a `LinkedIn / Social Post` × `Engagement`. Confirm wizard copy is clean, concise, and free of mojibake.
2. **Social-Post Editor:** Verify toolbar blocks, Slash Menu options, and Sidebar (Narrative, Feed Guardrails, Hashtag Assistant, hidden Excerpt) behave according to the matrix.
3. **Blog/Article Editor:** Create a Blog. Confirm SEO, Excerpt, Headings, Lists, Tables, and Distribute tabs operate in standard full-feature mode.
4. **Distribute Tab Social Promo:** Publish a blog. Check `Distribute` and verify that the social promo timeline card correctly opens the AI Copilot with a prefilled promo prompt.
