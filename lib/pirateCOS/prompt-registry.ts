/**
 * Phase 4G-3: Versioned Prompt Registry
 * 
 * Centralized registry for all AI prompts with versioning support.
 * Enables A/B testing, prompt updates without deployment, and performance tracking.
 */

export type PromptKey =
  | "chat-workspace"
  | "suggest-ideas"
  | "generate-write"
  | "generate-titles"
  | "generate-tags"
  | "seo-analysis";

export interface PromptTemplate {
  key: PromptKey;
  version: string; // "v1.0", "v1.1", "v2.0"
  systemPrompt?: string; // System-level instructions
  userPromptTemplate?: string; // Optional template with {{placeholders}}
  metadata: {
    createdAt: Date;
    createdBy: string;
    description: string;
    testResults?: {
      // A/B test metrics (populated from AIGenerationLog)
      acceptanceRate?: number;
      avgLatency?: number;
      totalGenerations?: number;
    };
  };
}

/**
 * Prompt Registry
 * 
 * Each key contains an array of versions (oldest to newest).
 * Use getPrompt(key) to get the latest version.
 * Use getPromptVersion(key, version) to get a specific version.
 */
export const PROMPT_REGISTRY: Record<PromptKey, PromptTemplate[]> = {
  // Workspace chat (uses buildAIContext, no hardcoded prompts)
  "chat-workspace": [
    {
      key: "chat-workspace",
      version: "v1.0",
      systemPrompt: "", // Uses buildAIContext()
      userPromptTemplate: "",
      metadata: {
        createdAt: new Date("2026-06-04"),
        createdBy: "system",
        description: "Workspace chat uses buildAIContext() for dynamic context"
      }
    }
  ],

  // Suggest Ideas (workspace panel)
  "suggest-ideas": [
    {
      key: "suggest-ideas",
      version: "v1.0",
      systemPrompt: `You are a world-class professional copywriter and AI content strategist.
Your task is to generate exactly 4 highly creative, targeted, and actionable custom suggestions/prompts that the user can run in their AI writing assistant to write or improve their current post.

# Output Format
Return ONLY a raw JSON array of exactly 4 suggestion objects. Do not wrap in markdown backticks or add any extra text.

Each suggestion object must have:
- "label": A concise 3-6 word title
- "prompt": A detailed, actionable prompt (2-3 sentences) that the user can run directly

# Style Guide
- Make each suggestion highly specific and context-aware
- Vary the suggestions: mix structural, tonal, and content-level improvements
- Use professional, action-oriented language
- Each prompt should be immediately executable without clarification

Example output structure:
[
  {"label": "Add a personal story", "prompt": "Insert a relatable personal anecdote in the introduction that connects with the reader's pain points. Make it vivid and specific."},
  {"label": "Strengthen your conclusion", "prompt": "Rewrite the conclusion to include a clear call-to-action and a memorable takeaway that reinforces your main argument."}
]`,
      metadata: {
        createdAt: new Date("2026-06-04"),
        createdBy: "system",
        description: "Generate 4 contextual writing suggestions for workspace panel"
      }
    }
  ],

  // Generate: Write content
  "generate-write": [
    {
      key: "generate-write",
      version: "v1.0",
      systemPrompt: "", // Uses buildAIContext()
      userPromptTemplate: "",
      metadata: {
        createdAt: new Date("2026-06-04"),
        createdBy: "system",
        description: "Content generation uses buildAIContext() for dynamic context"
      }
    }
  ],

  // Generate: Titles
  "generate-titles": [
    {
      key: "generate-titles",
      version: "v1.0",
      systemPrompt: `You are an expert content strategist and headline copywriter.
Analyze the content provided and generate 10 highly engaging, click-worthy titles optimized for both SEO and social sharing.

# Title Requirements
1. Mix styles: informational, curiosity-driven, benefit-focused, and question-based
2. Optimize for search engines (include relevant keywords naturally)
3. Optimize for social shares (emotional hooks, clarity)
4. Length: 50-70 characters ideal (hard max: 90 characters)
5. Avoid clickbait - be compelling but honest

# Output Format
Return ONLY a raw JSON array of exactly 10 title strings. No backticks, no markdown, no extra text.

Example:
["Title 1", "Title 2", "Title 3", ...]`,
      metadata: {
        createdAt: new Date("2026-06-04"),
        createdBy: "system",
        description: "Generate 10 SEO-optimized titles"
      }
    }
  ],

  // Generate: Tags
  "generate-tags": [
    {
      key: "generate-tags",
      version: "v1.0",
      systemPrompt: `You are an expert content tagger and SEO specialist.
Analyze the content and generate 8-12 relevant, high-traffic tags that maximize discoverability.

# Tag Requirements
1. Mix broad and specific tags (e.g., "productivity" + "deep work techniques")
2. Include industry-standard tags (what readers search for)
3. Consider trending topics when relevant
4. Use lowercase, hyphenated format (e.g., "content-marketing")
5. Prioritize tags with high search volume

# Output Format
Return ONLY a raw JSON array of 8-12 tag strings. No backticks, no markdown.

Example:
["tag-one", "tag-two", "content-marketing", ...]`,
      metadata: {
        createdAt: new Date("2026-06-04"),
        createdBy: "system",
        description: "Generate 8-12 SEO-optimized tags"
      }
    }
  ],

  // Generate: SEO Analysis
  "seo-analysis": [
    {
      key: "seo-analysis",
      version: "v1.0",
      systemPrompt: `You are an expert SEO specialist and content analyst.
Analyze the following blog post and provide a comprehensive SEO optimization report.

# Analysis Criteria
1. Keyword optimization (density, placement, natural usage)
2. Heading structure (H2/H3 hierarchy, keyword integration)
3. Meta title and description recommendations
4. Readability score (Flesch reading ease estimate)
5. Content length and structure
6. Overall SEO score (0-100)

# Output Format
Return ONLY a raw JSON object. No backticks, no markdown.

Structure:
{
  "overallScore": <number 0-100>,
  "keywordDensity": <number 0-5>,
  "readabilityScore": <number 0-100>,
  "recommendations": [
    "<specific actionable recommendation 1>",
    "<specific actionable recommendation 2>",
    "<specific actionable recommendation 3>"
  ],
  "metaTitleSuggestion": "<optimized meta title 50-60 chars>",
  "metaDescriptionSuggestion": "<optimized meta description 150-160 chars>"
}`,
      metadata: {
        createdAt: new Date("2026-06-04"),
        createdBy: "system",
        description: "Comprehensive SEO analysis and recommendations"
      }
    }
  ]
};

/**
 * Get the latest version of a prompt template
 *
 * @param key - Prompt key to retrieve
 * @returns Latest version of the prompt template
 * @throws Error if key not found
 */
export function getPrompt(key: PromptKey): PromptTemplate {
  const versions = PROMPT_REGISTRY[key];
  if (!versions || versions.length === 0) {
    throw new Error(`Prompt key "${key}" not found in registry`);
  }

  // Return latest version (last in array)
  return versions[versions.length - 1];
}

/**
 * Get a specific version of a prompt
 *
 * @param key - Prompt key
 * @param version - Version string (e.g., "v1.0")
 * @returns Prompt template or undefined if not found
 */
export function getPromptVersion(
  key: PromptKey,
  version: string
): PromptTemplate | undefined {
  const versions = PROMPT_REGISTRY[key];
  return versions?.find((p) => p.version === version);
}

/**
 * Replace placeholders in prompt template
 *
 * Replaces {{variable}} placeholders with actual values.
 *
 * @param template - Prompt template
 * @param variables - Object with variable values
 * @returns Rendered prompt with placeholders replaced
 */
export function renderPrompt(
  template: PromptTemplate,
  variables: Record<string, string>
): string {
  let prompt = template.userPromptTemplate || template.systemPrompt || "";

  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = new RegExp(`{{${key}}}`, "g");
    prompt = prompt.replace(placeholder, value);
  });

  return prompt;
}

/**
 * Get all versions of a prompt (for A/B testing comparison)
 *
 * @param key - Prompt key
 * @returns Array of all versions
 */
export function getAllVersions(key: PromptKey): PromptTemplate[] {
  return PROMPT_REGISTRY[key] || [];
}

/**
 * Add test results to a prompt version
 *
 * Note: This updates the in-memory registry only.
 * For persistent storage, test results should be queried from AIGenerationLog.
 *
 * @param key - Prompt key
 * @param version - Version string
 * @param results - Test results to add
 */
export function updateTestResults(
  key: PromptKey,
  version: string,
  results: {
    acceptanceRate?: number;
    avgLatency?: number;
    totalGenerations?: number;
  }
): void {
  const template = getPromptVersion(key, version);
  if (template) {
    template.metadata.testResults = {
      ...template.metadata.testResults,
      ...results,
    };
  }
}

/**
 * List all available prompt keys
 *
 * @returns Array of all registered prompt keys
 */
export function getAllPromptKeys(): PromptKey[] {
  return Object.keys(PROMPT_REGISTRY) as PromptKey[];
}
