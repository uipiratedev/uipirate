/**
 * AI Context Builder for PirateCOS
 * 
 * Purpose: Centralize ALL AI prompt construction logic
 * Replaces: Duplicated context construction in workspace and generate routes
 * 
 * Phase: 4F+ (Context Builder & Consistency)
 * Created: 2026-06-04
 */

import { getGoalConfig, getPostTypeConfig } from "@/lib/pirateCOS/postTypeConfig";
import type {
  AIContextConfig,
  AIContextResult,
  EditIntent,
  ApplyMode,
} from "@/lib/pirateCOS/types/ai-context";

// ============================================================================
// Main Context Builder Function
// ============================================================================

/**
 * Build complete AI context from configuration
 * 
 * This is the SINGLE SOURCE OF TRUTH for all AI prompt construction.
 * Used by: workspace route, generate route, future copilot features
 * 
 * Context Assembly Order (CRITICAL):
 * 1. Goal Context (strategic foundation)
 * 2. Type Context (structural guidance)
 * 3. User Focus Context (brief + keywords) ⭐ PRIORITY #3
 * 4. Brand Context (identity and voice)
 * 5. Preset Directive (task-specific augmentation)
 * 6. User Prompt (final instructions)
 */
export function buildAIContext(config: AIContextConfig): AIContextResult {
  // Classify edit intent FIRST (affects context assembly)
  const editIntent = classifyEditIntent(config.action, config.userMessage, config.selectedText);
  
  // Build context layers in priority order
  let systemInstructions = "";
  
  // LAYER 1: Goal Context (strategic foundation)
  const goalConfig = config.contentGoal ? getGoalConfig(config.contentGoal) : null;
  if (goalConfig) {
    systemInstructions += buildGoalContext(goalConfig);
  }
  
  // LAYER 2: Type Context (structural guidance)
  const typeConfig = config.postType ? getPostTypeConfig(config.postType) : null;
  if (typeConfig) {
    systemInstructions += buildTypeContext(typeConfig, config.brandBrain, config.postType);
  }
  
  // LAYER 3: User Focus Context ⭐ PRIORITY (brief + keywords)
  // This is the KEY IMPROVEMENT from Phase 4F+
  // User's specific topic/keywords now come BEFORE Brand Brain
  if (config.brief || config.keywords) {
    systemInstructions += buildUserFocusContext(config.brief, config.keywords);
  }
  
  // LAYER 4: Brand Context (identity and voice)
  // Skip Brand Brain for surgical edits (they don't need brand voice)
  if (editIntent !== "surgical") {
    systemInstructions += buildBrandContext(
      config.brandBrain,
      config.workflowMemory,
      config.customBrandVoice,
      config.customAudience,
      config.customKeywords,
      config.action,
      config.teamId // Phase 4F.1: Team Brain support
    );
  }
  
  // LAYER 5: Base Instructions (action-specific)
  systemInstructions += buildBaseInstructions(
    config.postType,
    config.userMessage,
    config.selectedText,
    config.postTitle,
    editIntent
  );
  
  // LAYER 6: Preset Directive (task-specific augmentation)
  if (config.preset) {
    systemInstructions += buildPresetDirective(
      config.preset,
      config.postType,
      config.contentGoal,
      typeConfig,
      goalConfig
    );
  }
  
  // Determine suggested apply mode based on intent
  const suggestedApplyMode = determineSuggestedApplyMode(editIntent, config.action, config.selectedText);
  
  // Return complete context result
  return {
    systemInstructions,
    userPrompt: config.userMessage,
    editIntent,
    suggestedApplyMode,
    contextMetadata: {
      contentGoal: config.contentGoal,
      postType: config.postType,
      hasBrief: !!config.brief,
      hasKeywords: !!config.keywords,
      hasBrandBrain: !!config.brandBrain,
      hasPreset: !!config.preset,
    },
  };
}

// ============================================================================
// Edit Intent Classification
// ============================================================================

/**
 * Classify the type of edit the user is requesting
 * 
 * - surgical: Specific, minimal changes ("remove em-dashes", "fix typo")
 * - transform: Style/tone changes while preserving structure ("make conversational")
 * - rewrite: Complete regeneration ("rewrite for developers")
 * - continue: Extend existing content ("keep writing from here")
 */
export function classifyEditIntent(
  action: string | string[],
  userMessage: string,
  selectedText?: string
): EditIntent {
  // Quick actions are never surgical
  if (action !== "chat") {
    // Continue action is explicitly "continue"
    if (action === "continue" || (Array.isArray(action) && action.includes("continue"))) {
      return "continue";
    }
    // All other quick actions are transformations
    return "transform";
  }
  
  const message = userMessage.toLowerCase();
  
  // Pattern 1: Continue patterns
  const continuePatterns = [
    /\b(continue|keep writing|extend|elaborate|write more|add more)\b/i,
    /\bfrom here\b/i,
    /\bkeep going\b/i,
  ];
  
  for (const pattern of continuePatterns) {
    if (pattern.test(message)) return "continue";
  }
  
  // Pattern 2: Surgical edit patterns (specific, minimal changes)
  const surgicalPatterns = [
    /\b(remove|delete|strip|eliminate|take out)\b/i,
    /\b(fix|correct)\s+(typo|spelling|grammar|punctuation)\b/i,
    /\b(change|replace|swap|substitute)\s+[""'']?\w+[""'']?\s+(to|with)\b/i,
    /\b(add|insert)\s+(a\s+)?(comma|period|quote|semicolon|colon)\b/i,
    /\bcapitalize\b/i,
    /\blowercase\b/i,
    /\bshorten to \d+ words\b/i,
  ];
  
  for (const pattern of surgicalPatterns) {
    if (pattern.test(message)) return "surgical";
  }
  
  // Pattern 3: Rewrite patterns (complete regeneration)
  const rewritePatterns = [
    /\b(rewrite|rephrase|restructure|completely change|start over)\b/i,
    /\bfrom scratch\b/i,
  ];
  
  for (const pattern of rewritePatterns) {
    if (pattern.test(message)) return "rewrite";
  }
  
  // Default: Transform (style/tone changes)
  return "transform";
}

// ============================================================================
// Layer 1: Goal Context Builder
// ============================================================================

/**
 * Build goal-specific context (strategic foundation)
 * Example goals: traffic, authority, conversion, engagement
 */
function buildGoalContext(goalConfig: any): string {
  if (!goalConfig || !goalConfig.aiPriorityPrompt) return "";

  return `\n\n# CONTENT STRATEGY GOAL: ${goalConfig.label}\n${goalConfig.aiPriorityPrompt}\n`;
}

// ============================================================================
// Layer 2: Type Context Builder
// ============================================================================

/**
 * Build type-specific context (structural guidance)
 * Example types: blog, tutorial, case-study, social-post
 *
 * Includes custom preset instructions from Brand Brain if available
 */
function buildTypeContext(typeConfig: any, brandBrain: any, postType?: string): string {
  if (!typeConfig) return "";

  // Check for custom preset instructions in Brand Brain
  const brandPresetMap = brandBrain?.presetInstructions as any;
  let activeHint = typeConfig.templateHint;

  if (brandPresetMap && postType) {
    const customPrompt = typeof brandPresetMap.get === "function"
      ? brandPresetMap.get(postType)
      : brandPresetMap[postType];

    if (customPrompt && typeof customPrompt === "string" && customPrompt.trim()) {
      activeHint = customPrompt.trim();
    }
  }

  return `\n\n# CONTENT ARCHETYPE: ${typeConfig.label}\n${activeHint}\n`;
}

// ============================================================================
// Layer 3: User Focus Context Builder ⭐ PRIORITY
// ============================================================================

/**
 * Build user focus context (brief + keywords)
 *
 * THIS IS THE KEY IMPROVEMENT FROM PHASE 4F+
 *
 * User's specific topic and keywords now take PRIORITY #3
 * (before Brand Brain but after Goal and Type)
 *
 * This ensures the AI focuses on what the user ACTUALLY wants to write about,
 * not just generic brand guidelines.
 */
function buildUserFocusContext(brief?: string, keywords?: string): string {
  if (!brief && !keywords) return "";

  let context = "\n\n[USER CONTENT FOCUS]:";

  if (brief) {
    context += `\n📌 PRIMARY TOPIC: "${brief.trim()}"`;
    context += `\nThis is the CENTRAL THEME. All content must directly address this topic.`;
  }

  if (keywords) {
    context += `\n🎯 TARGET KEYWORDS: ${keywords.trim()}`;
    context += `\nIntegrate these keywords naturally and prominently in:`;
    context += `\n  - Headings (H2/H3)`;
    context += `\n  - Opening paragraph`;
    context += `\n  - Throughout the content`;
    context += `\n  - Meta description (if applicable)`;
  }

  return context + "\n";
}

// ============================================================================
// Layer 4: Brand Context Builder
// ============================================================================

/**
 * Build brand-specific context (identity and voice)
 *
 * Phase 4F.1: Supports Workspace Brain → Team Brain hierarchy
 * - Workspace-level properties apply by default
 * - Team-level overrides take precedence over workspace
 * - Per-post overrides take precedence over team
 *
 * Hierarchy: Workspace → Team (optional) → Per-post overrides
 */
function buildBrandContext(
  brandBrain: any,
  workflowMemory: any,
  customBrandVoice?: string,
  customAudience?: string,
  customKeywords?: string[],
  action?: string | string[],
  teamId?: string // Phase 4F.1: Team Brain support
): string {
  const hasBrandBrain = !!brandBrain;
  const hasCustomOverrides = !!(customBrandVoice || customAudience || customKeywords);

  if (!hasBrandBrain && !hasCustomOverrides) return "";

  let brandContext = "\n\n[STRICT BRAND WRITING IDENTITY RULES]:";

  // Phase 4F.1: Resolve team brain if teamId is provided
  let teamBrain: any = null;
  if (teamId && brandBrain?.workspaceType === "team" && brandBrain?.teamBrains) {
    teamBrain = brandBrain.teamBrains.find((tb: any) => tb._id?.toString() === teamId);
  }

  // Company/Brand Name (workspace-level only)
  const activeName = brandBrain?.companyName || "Our Brand";
  brandContext += `\n- Company/Brand Name: "${activeName}"`;

  // Phase 4F.1: Show team context if applicable
  if (brandBrain?.workspaceType === "team" && teamBrain) {
    brandContext += `\n- Team Context: "${teamBrain.teamName}"`;
  }

  // Brand Voice (per-post → team → workspace)
  const activeVoice = customBrandVoice || teamBrain?.brandVoice || brandBrain?.brandVoice;
  if (activeVoice) {
    brandContext += `\n- Tone & Brand Voice: Write in a style that is ${activeVoice.trim()}.`;
  }

  // Products/Services (per-post → team → workspace)
  const activeProducts = teamBrain?.products || brandBrain?.products;
  if (activeProducts) {
    brandContext += `\n- Brand Products / Core Services: "${activeProducts.trim()}"`;
  }

  // Audience/ICP (per-post → team → workspace)
  const activeAudience = customAudience || teamBrain?.audienceICP || brandBrain?.audienceICP;
  if (activeAudience) {
    brandContext += `\n- Target ICP / Audience Profile: Focus content appeal directly towards: "${activeAudience.trim()}"`;
  }

  // Focus Keywords (per-post → team + workspace merged)
  const workspaceKeywords = brandBrain?.targetKeywords || [];
  const teamKeywords = teamBrain?.targetKeywords || [];
  const activeKeywords = customKeywords || Array.from(new Set([...workspaceKeywords, ...teamKeywords]));
  if (activeKeywords.length > 0) {
    brandContext += `\n- Focus Keywords: Proactively integrate and emphasize these search terms when contextually appropriate: ${activeKeywords.join(", ")}`;
  }

  // Forbidden Words (team + workspace merged)
  const workspaceForbidden = brandBrain?.forbiddenWords || [];
  const teamForbidden = teamBrain?.forbiddenWords || [];
  const forbiddenWords = Array.from(new Set([...workspaceForbidden, ...teamForbidden]));
  if (forbiddenWords.length > 0) {
    brandContext += `\n- FORBIDDEN VOCABULARY: Under NO circumstances are you allowed to use any of these words or variants in your generated output: ${forbiddenWords.join(", ")}. Filter them out completely.`;
  }

  // Workflow Memory & Preferences
  const sentenceComplexity = workflowMemory?.sentenceComplexity || brandBrain?.sentenceComplexity || "moderate";
  brandContext += `\n\n[WORKFLOW MEMORY & PREFERENCES]:`;
  brandContext += `\n- Sentence Complexity: Generate text targeted at a "${sentenceComplexity}" readability level.`;

  // Formatting Rules
  const isChatAction = action === "chat" || (Array.isArray(action) && action.includes("chat"));
  const isWriteAction = action === "write" || (Array.isArray(action) && action.includes("write"));

  if ((workflowMemory?.formattingRules?.alwaysIncludeTakeaways || brandBrain?.formattingRules?.alwaysIncludeTakeaways) && isChatAction) {
    brandContext += `\n- Formatting Constraint: Proactively begin the text block with a 3-sentence "Key Takeaways" summary block.`;
  }

  if ((workflowMemory?.formattingRules?.alwaysIncludeFAQ || brandBrain?.formattingRules?.alwaysIncludeFAQ) && isChatAction) {
    brandContext += `\n- Formatting Constraint: Always append a structured, comprehensive "Frequently Asked Questions" Q&A segment at the end of the post content.`;
  }

  // CTA Template
  const ctaTemplate = workflowMemory?.defaultCTA || brandBrain?.callToActionTemplate;
  if (ctaTemplate && !isChatAction) {
    brandContext += `\n- Footer CTA Guidance: When appropriate, guide the reader in this Call-To-Action style: "${ctaTemplate.trim()}"`;
  }

  return brandContext + "\n";
}

// ============================================================================
// Layer 5: Base Instructions Builder
// ============================================================================

/**
 * Build base instructions (action-specific)
 *
 * Different instructions for:
 * - Social posts (concise, no headings, <250 words)
 * - Regular content (comprehensive, structured, 150-600 words)
 * - Surgical edits (minimal, precise changes only)
 */
function buildBaseInstructions(
  postType?: string,
  userMessage?: string,
  selectedText?: string,
  postTitle?: string,
  editIntent?: EditIntent
): string {
  const contextInfo = selectedText ? `\n\nTARGET CONTEXT: "${selectedText.substring(0, 3000)}"` : "";
  const titleInfo = postTitle ? `title: "${postTitle}"` : "";
  const typeInfo = postType ? `category: "${postType}"` : "";

  // Surgical edits: Special minimal-change instructions
  if (editIntent === "surgical") {
    return `\n\nYou are a precise text editor. The user wants you to make a SPECIFIC, MINIMAL change based on these instructions: "${userMessage}".

Context: ${titleInfo}, ${typeInfo}.${contextInfo}

CRITICAL RULES FOR SURGICAL EDITS:
1. Make ONLY the requested change - do NOT rewrite or rephrase other parts
2. Preserve ALL existing formatting, structure, and style
3. Keep the same tone and voice
4. Do NOT add or remove content beyond what was explicitly requested
5. After making the change, add a change summary line: "✏️ Change summary: [describe what you changed]"

Output in clean HTML format. Deliver ONLY the raw HTML block, no backticks, no markdown formatting.`;
  }

  // Social posts: Concise, no headings
  if (postType === "social-post") {
    return `\n\nYou are a world-class professional copywriter and social media content writer. The user wants you to write content based on the following instructions: "${userMessage}". Context: ${titleInfo}, ${typeInfo}.${contextInfo}

Write a concise, engaging, and highly readable update. Ensure it is formatted perfectly for social feeds with short, punchy paragraphs and no long blocks of text. Limit the length to be extremely concise (typically 1-3 short paragraphs, under 250 words total).

Do NOT include headings (h1, h2, h3), lists, blockquotes, or dividers. Output in simple HTML format (using <p>, <strong>, <em>, and <br> tags). Do NOT use markdown. Deliver ONLY the raw HTML block, no backticks, no markdown formatting, and no wrapper comments.`;
  }

  // Regular content: Comprehensive, structured
  return `\n\nYou are a world-class professional copywriter and technical content author. The user wants you to write content based on the following instructions: "${userMessage}". Context: ${titleInfo}, ${typeInfo}.${contextInfo}

Write a comprehensive, fully detailed, and substantial piece of content. Expand on the concepts deeply with rich explanations, multiple robust and fully-fleshed out paragraphs, structured subheadings, and thorough insights (aim for at least 150 to 450 words, unless the prompt explicitly requests a short summary or brief answer).

Output in standard clean HTML format (using <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>, <blockquote> as appropriate). Do NOT use markdown. Do NOT use <html>, <head>, or <body> tags. Deliver ONLY the raw HTML block, no backticks, no markdown formatting, and no wrapper comments.`;
}

// ============================================================================
// Layer 6: Preset Directive Builder
// ============================================================================

/**
 * Build preset-specific directives
 *
 * Presets: seo-article, thought-leadership, how-to-guide, etc.
 * These are task-specific augmentations that further refine the output
 */
function buildPresetDirective(
  preset: string,
  postType?: string,
  contentGoal?: string,
  typeConfig?: any,
  goalConfig?: any
): string {
  // TODO: Implement preset-specific directives
  // This will be expanded based on preset types in the system
  // For now, return empty string (presets are optional)
  return "";
}

// ============================================================================
// Apply Mode Determination
// ============================================================================

/**
 * Determine suggested apply mode based on edit intent
 *
 * - surgical + selection: replace (replace the exact selection)
 * - continue: insert-below (extend content)
 * - transform: replace (replace selection or entire content)
 * - rewrite: replace (replace entire content)
 */
function determineSuggestedApplyMode(
  editIntent: EditIntent,
  action: string | string[],
  selectedText?: string
): ApplyMode {
  // Continue always inserts below
  if (editIntent === "continue") {
    return "insert-below";
  }

  // Surgical edits with selection: replace the selection
  if (editIntent === "surgical" && selectedText) {
    return "replace";
  }

  // Default: replace
  return "replace";
}
