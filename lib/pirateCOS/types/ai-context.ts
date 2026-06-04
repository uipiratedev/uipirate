/**
 * AI Context Type Definitions for PirateCOS
 *
 * Purpose: Centralize all type definitions for AI context building
 * Used by: ai-context-builder.ts, workspace route, generate route
 *
 * Phase: 4F.0 (Foundation Prep)
 * Created: 2026-06-04
 */

import { AIEngine } from "@/lib/pirateCOS/ai-registry";
import type { ContentGoal } from "@/lib/pirateCOS/postTypeConfig";

// ============================================================================
// Edit Intent Classification
// ============================================================================

/**
 * Categorizes the type of edit the user is requesting
 * - surgical: Specific, minimal changes ("remove em-dashes", "fix typo")
 * - transform: Style/tone changes while preserving structure ("make conversational")
 * - rewrite: Complete regeneration ("rewrite for developers")
 * - continue: Extend existing content ("keep writing from here")
 */
export type EditIntent = "surgical" | "transform" | "rewrite" | "continue";

/**
 * Suggests how to apply the generated content
 * - replace: Replace selected text or entire content
 * - insert-below: Insert after current selection/cursor
 * - insert-above: Insert before current selection/cursor
 */
export type ApplyMode = "replace" | "insert-below" | "insert-above";

// ============================================================================
// Context Configuration Input
// ============================================================================

/**
 * Configuration object for building AI context
 * This is the input to buildAIContext()
 */
export interface AIContextConfig {
  // === Action & Intent ===
  /** The action being performed (chat, improve, continue, etc.) */
  action: string | string[];
  
  /** User's message/instruction */
  userMessage: string;
  
  /** Selected text from editor (if any) */
  selectedText?: string;
  
  // === Content Metadata ===
  /** Post type (blog, tutorial, case-study, etc.) */
  postType?: string;

  /** Content goal (traffic, authority, conversion, etc.) */
  contentGoal?: ContentGoal;

  /** Post title */
  postTitle?: string;
  
  // === User Input (PRIORITY) ===
  /** User-provided brief/topic */
  brief?: string;
  
  /** User-provided keywords */
  keywords?: string;
  
  // === Brand Context ===
  /** Brand Brain / Workspace Brain object */
  brandBrain?: any; // TODO: Type this properly when BrandBrain model is finalized

  /** Workflow Memory object */
  workflowMemory?: any; // TODO: Type this properly

  // Phase 4F.1: Team Brain support
  /** Team ID (for team-level overrides) */
  teamId?: string;

  /** Per-post brand voice override */
  customBrandVoice?: string;

  /** Per-post audience override */
  customAudience?: string;

  /** Per-post keywords override */
  customKeywords?: string[];
  
  // === Preset & Template ===
  /** Preset directive (seo-article, thought-leadership, etc.) */
  preset?: string;
  
  // === Model Configuration ===
  /** AI engine being used */
  engine?: AIEngine;
  
  /** Model name */
  model?: string;
  
  /** Tone override */
  tone?: string;
}

// ============================================================================
// Context Builder Output
// ============================================================================

/**
 * Result from buildAIContext()
 * Contains the final system instructions and metadata
 */
export interface AIContextResult {
  /** Complete system instructions (assembled from all layers) */
  systemInstructions: string;
  
  /** User's prompt (may be modified based on intent) */
  userPrompt: string;
  
  /** Detected edit intent */
  editIntent: EditIntent;
  
  /** Suggested apply mode */
  suggestedApplyMode: ApplyMode;
  
  /** Context metadata for logging */
  contextMetadata: {
    contentGoal?: string;
    postType?: string;
    hasBrief: boolean;
    hasKeywords: boolean;
    hasBrandBrain: boolean;
    hasPreset: boolean;
    promptVersion?: string; // For future prompt registry
  };
}

// ============================================================================
// Layer-Specific Context Builders
// ============================================================================

/**
 * Goal-specific context (from postTypeConfig.ts)
 */
export interface GoalContext {
  label: string;
  aiPriorityPrompt: string;
}

/**
 * Type-specific context (from postTypeConfig.ts)
 */
export interface TypeContext {
  label: string;
  templateHint: string;
  wordCountGuidance?: string;
  structuralRules?: string;
}

/**
 * User focus context (brief + keywords)
 */
export interface UserFocusContext {
  brief?: string;
  keywords?: string;
  focusPrompt: string;
}

/**
 * Brand context (from Brand Brain / Workspace Brain)
 */
export interface BrandContext {
  companyName?: string;
  brandVoice?: string;
  audienceICP?: string;
  targetKeywords?: string[];
  forbiddenWords?: string[];
  brandPrompt: string;
}

// ============================================================================
// HTML Normalization
// ============================================================================

/**
 * Options for HTML normalization
 */
export interface NormalizeHTMLOptions {
  /** Post type (affects structural constraints) */
  postType?: string;
  
  /** Strip markdown code fence wrappers */
  stripMarkdownWrappers?: boolean;
  
  /** Replace H1 with H2 */
  replaceH1WithH2?: boolean;
  
  /** Fix heading hierarchy (no skipped levels) */
  fixHeadingHierarchy?: boolean;
  
  /** Remove unsafe tags (script, iframe, etc.) */
  removeUnsafeTags?: boolean;
  
  /** Enforce postType constraints (e.g., social-post = no headings) */
  enforcePostTypeConstraints?: boolean;
}
