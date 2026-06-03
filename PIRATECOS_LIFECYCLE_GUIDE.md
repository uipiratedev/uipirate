# PirateCOS: Content Lifecycle Orchestration & AI Brand Brain
## Complete Guide to Phase 4B and Brand Brain Features

This document provides a detailed breakdown of the **AI Brand Brain** and **Phase 4B (Content Lifecycle Orchestration)** systems in PirateCOS, grounded entirely in the active codebase implementation.

---

# 🧠 Part 1: AI Brand Brain

The AI Brand Brain acts as the core brand identity and guardrail system for PirateCOS. Instead of prompting an AI from scratch for every post, the system stores company details, audience definitions, keyword targets, forbidden words, and type-specific rules. These guidelines are dynamically injected into every AI generation route in the backend.

## 🗺️ 1.1 The Setup & Onboarding Wizard Flow
When a tenant has not configured their Brand Brain (i.e. `brandBrain === null`), they are guided through a **3-Step Setup Wizard** in `/pirateCOS/brand-brain`:

```
[ Step 1: Brand & Voice ] ──→ [ Step 2: Offerings & ICP ] ──→ [ Step 3: Vocabulary Guard ]
```

### Step 1: Brand & Voice
* **Screen Layout**: Simple card with company name input and a list of brand voice presets.
* **Fields**:
  * **Company/Brand Name**: (Text input, e.g. `UI Pirate`).
  * **Brand Voice / Tone Presets**: A vertical list of radio-style cards containing:
    * *Professional & Authoritative*: Expert, trustworthy tone for B2B/enterprise.
    * *Conversational & Friendly*: Approachable, warm tone.
    * *Bold & Energetic*: Inspiring, creative, action-oriented.
    * *Empathetic & Supportive*: Compassionate tone focusing on customer pain points.
    * *Sleek & Minimalist*: Understated copy focusing on high-concept design.

### Step 2: Offerings & ICP
* **Screen Layout**: Two large textareas.
* **Fields**:
  * **Products / Services Description**: Detailed explanation of what the company does and its unique value proposition.
  * **Target Ideal Customer Profile (ICP)**: Outlines ideal buyers, demographics, and paint points.

### Step 3: Vocabulary Guard
* **Screen Layout**: Multi-input fields with dynamic tag arrays.
* **Fields**:
  * **Target Keywords to Promote**: Adds keywords (added via Comma/Enter key) rendered as orange badges.
  * **Forbidden Vocabulary**: Banned words or phrases (rendered as red badges) that the AI must filter out.
  * **Standard Call To Action (CTA)**: A global closing CTA appended to drafts.

---

## 📊 1.2 The Active Dashboard Interface
Once saved, `/pirateCOS/brand-brain` transforms into a professional configuration control center containing a completeness score circle progress indicator, success/error banners, and a **4-Tab Dashboard Grid**:

### Tab 1: Brand Identity
* **Controls**: Company Name text input, Brand Voice selection dropdown, and CTA Template input.

### Tab 2: Audience & ICP
* **Controls**: Large textareas to update Products/Services and Target ICP definitions.

### Tab 3: Vocabulary Guard
* **Controls**: Inputs to add/remove Target Keywords and Forbidden Words (each with cross buttons to delete tags).

### Tab 4: Style Guides & Presets
* **Controls**:
  * **Left Column**: Interactive list of 11 Content Archetypes (Blog, Tutorial, Case Study, etc.) showing archetype category (Content vs. Monetization) and a green status dot if custom instructions exist.
  * **Right Column**: Displays the default template hint for the selected archetype and a **Custom AI Prompt Instructions** textarea. If left blank, it falls back to the default config; if populated, it overrides prompt generation for that specific archetype.

---

## ⚙️ 1.3 Technical Architecture & Backend Sync
* **Database Model**: [`models/pirateCOS/BrandBrain.ts`](file:///d:/ui-pirate/uipirate/models/pirateCOS/BrandBrain.ts)
  * Unique index on `tenantId` guarantees exactly one Brand Brain configuration per tenant.
  * `presetInstructions` is defined as a Mongoose `Map` of strings (`Map<string, string>`).
* **API Endpoints**: `/api/pirateCOS/brand-brain`
  * `GET`: Fetches the active profile (returns `{ success: true, brandBrain }`).
  * `POST`: Upserts the configuration profile.
* **Downstream Injection**: Deployed in [`app/api/pirateCOS/ai/generate/route.ts`](file:///d:/ui-pirate/uipirate/app/api/pirateCOS/ai/generate/route.ts)
  * Fetches the tenant's `BrandBrain` document on generation requests.
  * Construct a prompt block containing the company's value proposition, ICP profiles, target keywords, forbidden words, and customized style instructions.
  * Appends these to the model's system prompt prior to calling the AI provider (OpenAI, Gemini, Claude, Mistral, or Puter).

---

# 🌀 Part 2: Phase 4B — Content Lifecycle Orchestration

Phase 4B shifts the product from a passive markdown editor into an active content lifecycle system driven by a **centralized configuration mapping** and a **guided workspace flow**.

```
Select Intent (Type) ──→ Select Goal ──→ Preview Workspace ──→ Editor Adapts ──→ Distribute & Repurpose
```

---

## 🛠️ 2.1 Centralized Config & Features Mapping
File: [`lib/pirateCOS/postTypeConfig.ts`](file:///d:/ui-pirate/uipirate/lib/pirateCOS/postTypeConfig.ts)

The entire creation-distribution flow is driven by configuration mappings defining **11 Post Types** and **6 Content Goals**:

### 11 Content Types
1. **Blog** (✏️): Opinions & insights (600–1,500 words).
2. **Tutorial** (📖): Step-by-step guides (1,000–3,000 words).
3. **Case Study** (🔍): Behind-the-scenes projects (1,000–2,000 words).
4. **Community Insight** (💬): Curated rounds & trends (600–1,200 words).
5. **Corporate / PR Post** (🏢): Milestones & press releases (400–800 words).
6. **Product Review** (⭐): Affiliate reviews (1,000–2,500 words).
7. **Product Launch** (🚀): Feature releases (500–1,000 words).
8. **Listicle** (📋): Curation & roundups (1,200–3,000 words).
9. **Comparison** (⚔️): Head-to-head product sheets (1,500–3,500 words).
10. **Newsletter** (📧): Email broadcasts (400–1,000 words).
11. **LinkedIn / Social Post** (🔗): Short social hooks (150–400 words).

### 6 Content Goals
* **Traffic (📈)**: SEO-optimized, meta-optimized, and keyword targeted.
* **Authority (🏛️)**:Nuanced, expert-toned arguments, and statistics.
* **Conversion (💰)**: CTA blocks, benefit statements, and sales pitches.
* **Engagement (🔥)**: Curiosity hooks, open-ended questions, and social previews.
* **Lead Generation (🧲)**: Newsletter signup links, gated teasers.
* **Retention (🤝)**: Feature deep dives, pro-tips, customer updates.

### Feature Matrix (Workspace Adaptation Flags)
Each post type carries boolean flags indicating what tools are supported:
* `seoPanel` (SEO sidebar tab)
* `codeBlocks` (editor code blocks)
* `tables` (editor data tables)
* `ctaBlocks` (Call-To-Action templates)
* `affiliateLinks` (affiliate links tools)
* `repurposing` (repurposing drawer triggers)
* `distributionAI` (AI channel advisors)

---

## 🎨 2.2 The 3-Step Guided Creation Wizard
Located in: [`app/pirateCOS/(authed)/posts/create/page.tsx`](file:///d:/ui-pirate/uipirate/app/pirateCOS/(authed)/posts/create/page.tsx)

When creating a new post, the user navigates a multi-step card layout:

### Step 1: Intent Selection
* **UI**: 11 large cards split into two categories ("Content & Knowledge" and "Product & Monetization").
* **Card content**: Icon, label, description, estimated reading time, word count boundaries, and feature pills (e.g. `[SEO Tools]`, `[Code Blocks]`).
* **Interaction**: Clicking a card toggles it as active, showing a bold orange border and unlocking the "Continue" CTA.

### Step 2: Goal Selection
* **UI**: 6 horizontal cards for each content goal.
* **Card content**: Icon, label, description, and system behavior summary (e.g. *"Heavy SEO, keyword tools, meta optimization"*).
* **Interaction**: Selects the goal of the content and unlocks step 3.

### Step 3: Workspace Preview & Confirmation
* **UI**: Overview of the configured workspace.
* **Content**:
  * Active configuration header (e.g. `✏️ Blog × 📈 Traffic`).
  * A dual-list checklist. Left: active tools (e.g. `✓ SEO Panel`, `✓ AI Copilot`). Right: omitted tools (e.g. `✗ Code Blocks`).
  * **AI Prioritization Box**: Outlines what the AI engine will prioritize based on `aiPriorityPrompt` (e.g., keyword-rich headings for Traffic, urgency indicators for Conversion).
* **Action**: Clicking `"🚀 Start Writing"` commits the document fields and launches the adapted editor workspace.

---

## ✏️ 2.3 The Adaptive Editor Workspace
Once the wizard completes, the editor adaptations are locked:

* **Header Badge**: A locked lock icon badge displaying `{Icon} {Type} × {Icon} {Goal}` (e.g., `✏️ Blog × 📈 Traffic`) sits in the editor top bar.
* **FormattingToolbar**: Conditionally shows/hides control buttons:
  * Hides tables, code blocks, or CTA insertion buttons if their respective features are false in the type's configuration.
  * Hides formatting blocks (H1/H2/H3, blockquotes, code, text color) for `social-post` types to prevent feed formatting corruption.
  * Hides the `Transform` button for social posts (social posts cannot be transformed into other social posts).
* **Sidebar Tab Visibility**:
  * Hides the `SEO` tab entirely for `newsletter` and `social-post` archetypes.
  * Displays the `Narrative` tab (renamed from `Content`) for social posts, replacing standard Analytics with character counters, warning boundaries (LinkedIn 3,000 vs. X 280), and spacing advisors.
* **AI Prompt Adjustments**: Feeds the selected `contentGoal` and `postType` parameters to the AI backend to calibrate writing styles (e.g., hook generators for social posts, FAQ tables for blog posts).

---

## 📈 2.4 Content Health Panel
Accessible via the `health` tab on the editor sidebar. This panel evaluates content quality and goal alignment:

* **Goal-Weighted Overall Score**: A circular progress ring (0-100) colored green (71-100), amber (41-70), or red (0-40). The calculation multiplies each sub-score by the weights specified in `healthWeights` for the active goal.
* **7 Metric Indicators**: Below the overall score, 7 bars measure:
  1. *SEO Score*: Density, meta completeness, structural headers.
  2. *Readability*: Paragraph length, sentence complexity.
  3. *Engagement Likelihood*: Presence of questions, hook strength.
  4. *Conversion Strength*: Benefit phrases, sales hooks.
  5. *CTA Strength*: Action verbs, CTA placement.
  6. *Structure Quality*: Heading hierarchy balance.
  7. *Distribution Readiness*: Mandatory metadata present.
* **Distribution Readiness Indicators**: Scores (0-100) analyzing target platform fit (SEO, LinkedIn, Newsletter, X/Twitter, Conversion).
* **AI Advisor Text**: Context-aware guidance dynamically advising on structural flaws (e.g. *"Feeds favor breathing room. Split this into short 1-2 sentence paragraphs for better mobile reading."*).

---

## 🚀 2.5 Distribution Intelligence Panel
Accessible via the `distribute` tab in the editor sidebar. This replaces the basic publish list with an operational syndication workflow:

* **AI Distribution Recommendations**: Analyzes `postType` and `contentGoal` to output channel recommendations (`✅ Ideal`, `⚠️ Consider`, `❌ Not recommended`).
* **Suggested Timing**: Recommends best distribution times (e.g. *"Tuesday 9–11 AM"*).
* **Content Repurposing Checklist**: Provides checkable workflows (LinkedIn promotions, X Threads, Newsletter summaries) linking back to the multi-format repurposing drawer.
* **Preflight Checklist**: Lists error/warning preflight items. Errors (e.g., missing local publish, under 300 words) block outbound syndication.
* **Target Channels Selection**: Sorts connected/active platforms (WordPress, Ghost, Medium, LinkedIn Direct, Buffer) to the top of the interface, highlighting oauth status and profile IDs.
* **Syndication History**: Lists logs of completed syndication attempts with clickable external links and error messages.
