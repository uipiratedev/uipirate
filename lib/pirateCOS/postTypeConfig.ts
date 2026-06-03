// ============================================================================
// PirateCOS — Content Lifecycle Orchestration: Centralized Configuration
// ============================================================================
//
// Single source of truth for:
//   - 11 Content Types (Post Types) organized into 2 categories
//   - 6 Content Goals driving workspace adaptation
//   - Feature flags per type
//   - Health metric weights per goal
//   - AI prompt injection strings per goal
//
// Every file in the Content Lifecycle Orchestration system imports from here.
// ============================================================================

// ── Content Goal Type ────────────────────────────────────────────────────────

export type ContentGoal =
  | "traffic"
  | "authority"
  | "conversion"
  | "engagement"
  | "lead-generation"
  | "retention";

// ── Content Goal Configuration ───────────────────────────────────────────────

export interface ContentGoalConfig {
  value: ContentGoal;
  label: string;
  icon: string;
  description: string;
  hint: string; // "→ Heavy SEO, keyword tools..."
  aiPriorityPrompt: string; // Injected into AI system prompt
  healthWeights: {
    seoScore: number; // 0–1 multiplier
    readability: number;
    engagementLikelihood: number;
    conversionStrength: number;
    ctaStrength: number;
    structureQuality: number;
    distributionReadiness: number;
  };
}

// ── Post Type Feature Flags ──────────────────────────────────────────────────

export interface PostTypeFeatures {
  seoPanel: boolean;
  featuredImage: boolean;
  bannerImage: boolean;
  codeBlocks: boolean;
  tables: boolean;
  aiCopilot: boolean;
  repurposing: boolean;
  affiliateLinks: boolean;
  socialPreview: boolean;
  taskLists: boolean;
  ctaBlocks: boolean;
  distributionAI: boolean;
}

// ── Post Type Configuration ──────────────────────────────────────────────────

export type PostTypeCategory = "content" | "monetization";

export interface PostTypeConfig {
  value: string;
  label: string;
  category: PostTypeCategory;
  description: string;
  bestFor: string;
  estimatedReadTime: string;
  minWordCount: number;
  maxWordCount: number;
  icon: string;
  features: PostTypeFeatures;
  featurePills: string[];
  templateHint: string; // Injected into AI prompt for structure guidance
  suggestedGoals: ContentGoal[]; // Recommended goals for this type
  distributionChannels: string[]; // Default suggested channels
}

// ============================================================================
// CONTENT GOALS — 6 strategic content goals
// ============================================================================

export const CONTENT_GOALS: ContentGoalConfig[] = [
  {
    value: "traffic",
    label: "Traffic",
    icon: "traffic",
    description: "Drive organic search traffic to your site",
    hint: "→ Heavy SEO, keyword tools, meta optimization",
    aiPriorityPrompt: `You are optimizing this content for ORGANIC SEARCH TRAFFIC. Prioritize:
- Keyword-rich headings (H2/H3) that match high-volume search queries
- Long-tail keyword integration naturally throughout the content
- Comprehensive, in-depth coverage that satisfies search intent
- FAQ sections that target "People Also Ask" queries
- Meta-optimized title and description suggestions
- Internal linking recommendations to boost site authority
- Structured data opportunities (FAQ schema, HowTo schema)
- Clear heading hierarchy for featured snippet eligibility`,
    healthWeights: {
      seoScore: 1.0,
      readability: 0.5,
      engagementLikelihood: 0.3,
      conversionStrength: 0.2,
      ctaStrength: 0.2,
      structureQuality: 0.8,
      distributionReadiness: 0.7,
    },
  },
  {
    value: "authority",
    label: "Authority",
    icon: "authority",
    description: "Establish thought leadership in your space",
    hint: "→ Depth, citations, data points, expert tone",
    aiPriorityPrompt: `You are optimizing this content to establish THOUGHT LEADERSHIP and AUTHORITY. Prioritize:
- Deep, nuanced analysis with original insights
- Data points, statistics, and research citations
- Expert-level vocabulary appropriate to the industry
- Contrarian or forward-thinking perspectives
- Case studies and real-world examples
- Clear logical arguments with supporting evidence
- Professional, authoritative tone without being dry
- Industry-specific frameworks or methodologies`,
    healthWeights: {
      seoScore: 0.5,
      readability: 0.6,
      engagementLikelihood: 0.5,
      conversionStrength: 0.2,
      ctaStrength: 0.2,
      structureQuality: 0.9,
      distributionReadiness: 0.5,
    },
  },
  {
    value: "conversion",
    label: "Conversion",
    icon: "conversion",
    description: "Drive sign-ups, purchases, or demo requests",
    hint: "→ CTA blocks, benefit-focused structure, urgency elements",
    aiPriorityPrompt: `You are optimizing this content for CONVERSION (sign-ups, purchases, demos). Prioritize:
- Benefit-focused language over feature-focused language
- Clear, compelling calls-to-action placed strategically throughout
- Urgency and scarcity elements where appropriate
- Social proof elements (testimonials, metrics, case studies)
- Problem-agitation-solution structure
- Objection handling within the content
- Comparison with alternatives that favors the product
- Strong closing section with clear next steps`,
    healthWeights: {
      seoScore: 0.3,
      readability: 0.6,
      engagementLikelihood: 0.4,
      conversionStrength: 1.0,
      ctaStrength: 1.0,
      structureQuality: 0.6,
      distributionReadiness: 0.5,
    },
  },
  {
    value: "engagement",
    label: "Engagement",
    icon: "engagement",
    description: "Spark discussion, shares, and comments",
    hint: "→ Hook-first, questions, social preview",
    aiPriorityPrompt: `You are optimizing this content for maximum ENGAGEMENT (shares, comments, discussion). Prioritize:
- Attention-grabbing opening hook that creates curiosity
- Questions posed directly to the reader throughout
- Controversial or thought-provoking angles
- Personal stories and relatable experiences
- Short paragraphs and scannable formatting
- Shareable quotes and pull-out statements
- Social-media-ready snippets within the content
- Open-ended conclusion that invites discussion`,
    healthWeights: {
      seoScore: 0.2,
      readability: 0.9,
      engagementLikelihood: 1.0,
      conversionStrength: 0.2,
      ctaStrength: 0.3,
      structureQuality: 0.5,
      distributionReadiness: 0.6,
    },
  },
  {
    value: "lead-generation",
    label: "Lead Generation",
    icon: "lead-generation",
    description: "Capture emails and grow your subscriber list",
    hint: "→ Lead magnets, gated content, newsletter CTAs",
    aiPriorityPrompt: `You are optimizing this content for LEAD GENERATION (email capture, subscriber growth). Prioritize:
- Content that demonstrates expertise and builds trust
- Natural insertion points for lead magnets (checklists, templates, guides)
- "Teaser" sections that hint at more detailed gated content
- Email-focused CTAs: "Get the full checklist", "Join 10,000+ subscribers"
- Value-first approach that over-delivers to build reciprocity
- Strategic content gaps that lead magnets fill
- Newsletter subscription prompts integrated naturally
- Trust signals and credibility indicators`,
    healthWeights: {
      seoScore: 0.5,
      readability: 0.7,
      engagementLikelihood: 0.5,
      conversionStrength: 0.7,
      ctaStrength: 0.9,
      structureQuality: 0.6,
      distributionReadiness: 0.6,
    },
  },
  {
    value: "retention",
    label: "Retention",
    icon: "retention",
    description: "Keep existing customers engaged and educated",
    hint: "→ Tips, updates, product education, how-tos",
    aiPriorityPrompt: `You are optimizing this content for CUSTOMER RETENTION (keeping existing users engaged). Prioritize:
- Practical, actionable tips users can implement immediately
- Product education and underused feature highlights
- "Pro tips" and advanced usage patterns
- Community-building language ("our community", "fellow users")
- Progress celebration and success metrics
- Clear step-by-step instructions with screenshots/examples
- Links to related help articles and documentation
- Warm, supportive tone that makes users feel valued`,
    healthWeights: {
      seoScore: 0.2,
      readability: 0.9,
      engagementLikelihood: 0.6,
      conversionStrength: 0.3,
      ctaStrength: 0.4,
      structureQuality: 0.7,
      distributionReadiness: 0.5,
    },
  },
];

// ============================================================================
// POST TYPE CONFIGS — 11 content types in 2 categories
// ============================================================================
//
// Feature matrix exactly matches PRESET_REWORK_PLAN.md (lines 488–503)
// ============================================================================

export const POST_TYPE_CONFIGS: PostTypeConfig[] = [
  // ── Category 1: Content & Knowledge ──────────────────────────────────────

  {
    value: "blog",
    label: "Blog",
    category: "content",
    description: "Share thoughts, insights and perspectives",
    bestFor: "Personal blogs, opinion pieces, updates",
    estimatedReadTime: "3–8 min",
    minWordCount: 600,
    maxWordCount: 1500,
    icon: "blog",
    features: {
      seoPanel: true,
      featuredImage: true,
      bannerImage: false,
      codeBlocks: false,
      tables: false,
      aiCopilot: true,
      repurposing: true,
      affiliateLinks: false,
      socialPreview: false,
      taskLists: false,
      ctaBlocks: false,
      distributionAI: true,
    },
    featurePills: ["SEO Tools", "Featured Image", "AI Copilot", "Repurposing"],
    templateHint:
      "Structure as a blog post: engaging introduction, 3–5 main sections with H2 headings, conclusion with key takeaways. Keep tone conversational and authentic.",
    suggestedGoals: ["traffic", "authority", "engagement"],
    distributionChannels: ["wordpress", "medium", "linkedin"],
  },
  {
    value: "tutorial",
    label: "Tutorial",
    category: "content",
    description: "Step-by-step guides and how-tos",
    bestFor: "Developer docs, educational content",
    estimatedReadTime: "5–15 min",
    minWordCount: 1000,
    maxWordCount: 3000,
    icon: "tutorial",
    features: {
      seoPanel: true,
      featuredImage: true,
      bannerImage: false,
      codeBlocks: true,
      tables: true,
      aiCopilot: true,
      repurposing: true,
      affiliateLinks: false,
      socialPreview: false,
      taskLists: true,
      ctaBlocks: false,
      distributionAI: true,
    },
    featurePills: [
      "SEO Tools",
      "Code Blocks",
      "Tables",
      "Task Lists",
      "AI Copilot",
    ],
    templateHint:
      "Structure as a step-by-step tutorial: brief intro with prerequisites, numbered steps with code examples, expected output for each step, troubleshooting section, summary.",
    suggestedGoals: ["traffic", "authority", "retention"],
    distributionChannels: ["wordpress", "ghost", "medium"],
  },
  {
    value: "case-study",
    label: "Case Study",
    category: "content",
    description:
      "Behind-the-scenes analysis of a project, working style and team experience",
    bestFor: 'Client wins, builders\' journey, "how we did it"',
    estimatedReadTime: "5–12 min",
    minWordCount: 1000,
    maxWordCount: 2000,
    icon: "case-study",
    features: {
      seoPanel: true,
      featuredImage: true,
      bannerImage: false,
      codeBlocks: false,
      tables: true,
      aiCopilot: true,
      repurposing: true,
      affiliateLinks: false,
      socialPreview: true,
      taskLists: false,
      ctaBlocks: true,
      distributionAI: true,
    },
    featurePills: [
      "SEO Tools",
      "Tables",
      "Social Preview",
      "CTA Blocks",
      "AI Copilot",
    ],
    templateHint:
      "Structure as a case study: challenge/problem statement, approach/solution, implementation details, results with metrics, key learnings, testimonial quotes.",
    suggestedGoals: ["authority", "conversion", "lead-generation"],
    distributionChannels: ["wordpress", "linkedin", "medium"],
  },
  {
    value: "community-insight",
    label: "Community Insight",
    category: "content",
    description: "Trends, observations and community highlights",
    bestFor: "Industry roundups, community news",
    estimatedReadTime: "3–7 min",
    minWordCount: 600,
    maxWordCount: 1200,
    icon: "community-insight",
    features: {
      seoPanel: true,
      featuredImage: true,
      bannerImage: false,
      codeBlocks: false,
      tables: false,
      aiCopilot: true,
      repurposing: true,
      affiliateLinks: false,
      socialPreview: false,
      taskLists: false,
      ctaBlocks: false,
      distributionAI: true,
    },
    featurePills: ["SEO Tools", "Featured Image", "AI Copilot", "Repurposing"],
    templateHint:
      "Structure as a community roundup: trending topic intro, 3–5 highlighted trends or observations, quotes from community members, what this means for the industry, call to join the conversation.",
    suggestedGoals: ["engagement", "authority", "retention"],
    distributionChannels: ["wordpress", "medium", "linkedin"],
  },
  {
    value: "corporate-post",
    label: "Corporate / PR Post",
    category: "content",
    description: "Polished corporate announcements, executive letters, and press releases",
    bestFor: "Press releases, company updates, milestones",
    estimatedReadTime: "2–5 min",
    minWordCount: 400,
    maxWordCount: 800,
    icon: "corporate-post",
    features: {
      seoPanel: false,
      featuredImage: true,
      bannerImage: false,
      codeBlocks: false,
      tables: false,
      aiCopilot: true,
      repurposing: true,
      affiliateLinks: false,
      socialPreview: true,
      taskLists: false,
      ctaBlocks: false,
      distributionAI: true,
    },
    featurePills: ["Social Preview", "AI Copilot", "Repurposing"],
    templateHint:
      "Structure as a press release or corporate announcement: headline, dateline, lead paragraph (who/what/when/where/why), supporting details with quotes, boilerplate company description, contact information.",
    suggestedGoals: ["authority", "engagement", "conversion"],
    distributionChannels: ["wordpress", "linkedin", "medium"],
  },

  // ── Category 2: Product & Monetization ───────────────────────────────────

  {
    value: "product-review",
    label: "Product Review",
    category: "monetization",
    description: "Monetization-focused product reviews",
    bestFor: "Affiliate content, honest reviews",
    estimatedReadTime: "5–12 min",
    minWordCount: 1000,
    maxWordCount: 2500,
    icon: "product-review",
    features: {
      seoPanel: true,
      featuredImage: true,
      bannerImage: false,
      codeBlocks: false,
      tables: true,
      aiCopilot: true,
      repurposing: true,
      affiliateLinks: true,
      socialPreview: true,
      taskLists: false,
      ctaBlocks: true,
      distributionAI: true,
    },
    featurePills: [
      "SEO Tools",
      "Tables",
      "Affiliate Links",
      "Social Preview",
      "CTA Blocks",
    ],
    templateHint:
      "Structure as a product review: brief intro with verdict summary, product overview, feature breakdown (use tables), pros & cons, pricing analysis, who is it best for, final verdict with rating, affiliate CTA.",
    suggestedGoals: ["traffic", "conversion", "lead-generation"],
    distributionChannels: ["wordpress", "medium"],
  },
  {
    value: "product-launch",
    label: "Product Launch",
    category: "monetization",
    description: "Launch announcements & press-release style",
    bestFor: "New feature releases, product announcements",
    estimatedReadTime: "3–6 min",
    minWordCount: 500,
    maxWordCount: 1000,
    icon: "product-launch",
    features: {
      seoPanel: false,
      featuredImage: true,
      bannerImage: true,
      codeBlocks: false,
      tables: false,
      aiCopilot: true,
      repurposing: true,
      affiliateLinks: false,
      socialPreview: true,
      taskLists: false,
      ctaBlocks: true,
      distributionAI: true,
    },
    featurePills: [
      "Banner Image",
      "CTA Blocks",
      "Social Preview",
      "AI Copilot",
      "Repurposing",
    ],
    templateHint:
      "Structure as a product launch announcement: attention-grabbing headline, the problem you're solving, what's new (features + benefits), visual demo/screenshots, early access or pricing CTA, what's next on the roadmap.",
    suggestedGoals: ["conversion", "engagement", "authority"],
    distributionChannels: ["wordpress", "linkedin", "medium"],
  },
  {
    value: "listicle",
    label: "Listicle",
    category: "monetization",
    description: '"Top N" roundups and curated lists',
    bestFor: "SEO traffic, affiliate roundups",
    estimatedReadTime: "5–15 min",
    minWordCount: 1200,
    maxWordCount: 3000,
    icon: "listicle",
    features: {
      seoPanel: true,
      featuredImage: true,
      bannerImage: false,
      codeBlocks: false,
      tables: true,
      aiCopilot: true,
      repurposing: true,
      affiliateLinks: true,
      socialPreview: false,
      taskLists: false,
      ctaBlocks: true,
      distributionAI: true,
    },
    featurePills: [
      "SEO Tools",
      "Tables",
      "Affiliate Links",
      "CTA Blocks",
      "AI Copilot",
    ],
    templateHint:
      'Structure as a numbered listicle: compelling title with number, brief intro with selection criteria, numbered items with consistent format (name, description, key features, pricing, verdict), comparison summary table, "best overall" recommendation.',
    suggestedGoals: ["traffic", "conversion", "lead-generation"],
    distributionChannels: ["wordpress", "medium"],
  },
  {
    value: "comparison",
    label: "Comparison",
    category: "monetization",
    description: "Head-to-head product/tool comparisons",
    bestFor: "Buyer guides, decision-making content",
    estimatedReadTime: "8–20 min",
    minWordCount: 1500,
    maxWordCount: 3500,
    icon: "comparison",
    features: {
      seoPanel: true,
      featuredImage: true,
      bannerImage: false,
      codeBlocks: false,
      tables: true,
      aiCopilot: true,
      repurposing: true,
      affiliateLinks: true,
      socialPreview: false,
      taskLists: false,
      ctaBlocks: true,
      distributionAI: true,
    },
    featurePills: [
      "SEO Tools",
      "Tables",
      "Affiliate Links",
      "CTA Blocks",
      "AI Copilot",
    ],
    templateHint:
      'Structure as a head-to-head comparison: overview of both products, side-by-side feature comparison table, detailed category breakdowns (pricing, features, UX, support), use-case recommendations ("Choose A if…, Choose B if…"), final verdict.',
    suggestedGoals: ["traffic", "conversion"],
    distributionChannels: ["wordpress", "medium"],
  },
  {
    value: "newsletter",
    label: "Newsletter",
    category: "monetization",
    description: "Email-style newsletters and updates",
    bestFor: "Subscriber engagement, weekly digests",
    estimatedReadTime: "2–5 min",
    minWordCount: 400,
    maxWordCount: 1000,
    icon: "newsletter",
    features: {
      seoPanel: false,
      featuredImage: false,
      bannerImage: false,
      codeBlocks: false,
      tables: false,
      aiCopilot: true,
      repurposing: false,
      affiliateLinks: false,
      socialPreview: false,
      taskLists: false,
      ctaBlocks: false,
      distributionAI: true,
    },
    featurePills: ["AI Copilot", "Distribution AI"],
    templateHint:
      "Structure as an email newsletter: personal greeting/hook, 2–3 curated insights or updates (brief summaries with links), one featured deep-dive section, community highlight or quote, closing CTA (reply, share, subscribe).",
    suggestedGoals: ["retention", "engagement", "lead-generation"],
    distributionChannels: ["wordpress"],
  },
  {
    value: "social-post",
    label: "LinkedIn / Social Post",
    category: "monetization",
    description: "Articles & posts for LinkedIn, Reddit, X",
    bestFor: "Professional networking, community threads",
    estimatedReadTime: "1–8 min",
    minWordCount: 150,
    maxWordCount: 400,
    icon: "social-post",
    features: {
      seoPanel: false,
      featuredImage: true,
      bannerImage: false,
      codeBlocks: false,
      tables: false,
      aiCopilot: true,
      repurposing: true,
      affiliateLinks: false,
      socialPreview: true,
      taskLists: false,
      ctaBlocks: false,
      distributionAI: true,
    },
    featurePills: [
      "Social Preview",
      "AI Copilot",
      "Repurposing",
      "Distribution AI",
    ],
    templateHint:
      "Structure as a social post: attention-grabbing hook (first line is everything), short paragraphs (1–2 sentences each), personal insight or contrarian take, call-to-engage (question or opinion prompt), 3–5 relevant hashtags.",
    suggestedGoals: ["engagement", "authority", "lead-generation"],
    distributionChannels: ["linkedin"],
  },
];

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get the full configuration for a specific post type.
 */
export function getPostTypeConfig(value: string): PostTypeConfig | undefined {
  return POST_TYPE_CONFIGS.find((config) => config.value === value);
}

/**
 * Get the full configuration for a specific content goal.
 */
export function getGoalConfig(
  value: ContentGoal
): ContentGoalConfig | undefined {
  return CONTENT_GOALS.find((config) => config.value === value);
}

/**
 * Get all post types belonging to a specific category.
 */
export function getPostTypesByCategory(
  category: PostTypeCategory
): PostTypeConfig[] {
  return POST_TYPE_CONFIGS.filter((config) => config.category === category);
}

/**
 * Get the default features for a post type.
 * Falls back to a full-featured default if the type is not found.
 */
export function getFeatures(postType: string): PostTypeFeatures {
  const config = getPostTypeConfig(postType);
  if (config) return config.features;

  // Fallback: enable everything (for unrecognized or legacy types)
  return {
    seoPanel: true,
    featuredImage: true,
    bannerImage: false,
    codeBlocks: true,
    tables: true,
    aiCopilot: true,
    repurposing: true,
    affiliateLinks: false,
    socialPreview: false,
    taskLists: false,
    ctaBlocks: false,
    distributionAI: true,
  };
}

/**
 * Calculate the overall content health score using goal-weighted metrics.
 *
 * @param metricScores - Raw scores (0–100) for each of the 7 metrics
 * @param goal - The content goal whose weights determine metric importance
 * @returns A weighted score (0–100) representing overall content health
 */
export function calculateHealthScore(
  metricScores: {
    seoScore: number;
    readability: number;
    engagementLikelihood: number;
    conversionStrength: number;
    ctaStrength: number;
    structureQuality: number;
    distributionReadiness: number;
  },
  goal: ContentGoal
): number {
  const goalConfig = getGoalConfig(goal);
  if (!goalConfig) return 0;

  const weights = goalConfig.healthWeights;
  const totalWeight =
    weights.seoScore +
    weights.readability +
    weights.engagementLikelihood +
    weights.conversionStrength +
    weights.ctaStrength +
    weights.structureQuality +
    weights.distributionReadiness;

  if (totalWeight === 0) return 0;

  const weightedSum =
    metricScores.seoScore * weights.seoScore +
    metricScores.readability * weights.readability +
    metricScores.engagementLikelihood * weights.engagementLikelihood +
    metricScores.conversionStrength * weights.conversionStrength +
    metricScores.ctaStrength * weights.ctaStrength +
    metricScores.structureQuality * weights.structureQuality +
    metricScores.distributionReadiness * weights.distributionReadiness;

  return Math.round(weightedSum / totalWeight);
}

/**
 * Get all valid postType enum values (for schema validation).
 */
export function getAllPostTypeValues(): string[] {
  return POST_TYPE_CONFIGS.map((config) => config.value);
}

/**
 * Get all valid contentGoal enum values (for schema validation).
 */
export function getAllContentGoalValues(): ContentGoal[] {
  return CONTENT_GOALS.map((config) => config.value);
}

// ── Distribution Chain Configuration ─────────────────────────────────────────

export interface DistributionChain {
  value: string;
  label: string;
  icon: string;
  description: string;
  defaultChannels: string[];
  recommendedRepurposing: string[];
}

export const DISTRIBUTION_CHAINS: DistributionChain[] = [
  {
    value: "seo-growth",
    label: "SEO Growth Chain",
    icon: "traffic",
    description: "WordPress/Ghost publish + SEO preflight + LinkedIn & Twitter promos",
    defaultChannels: ["wordpress", "ghost"],
    recommendedRepurposing: ["linkedin_promo", "twitter_thread"],
  },
  {
    value: "founder-authority",
    label: "Founder Authority Chain",
    icon: "authority",
    description: "LinkedIn Direct + Medium + Twitter summary & quotes",
    defaultChannels: ["linkedin", "medium"],
    recommendedRepurposing: ["twitter_thread", "quote_snippets"],
  },
  {
    value: "product-launch",
    label: "Product Launch Chain",
    icon: "product-launch",
    description: "WordPress/Ghost + Buffer + Newsletter & social promos",
    defaultChannels: ["wordpress", "ghost", "buffer"],
    recommendedRepurposing: ["linkedin_promo", "twitter_thread", "newsletter_summary"],
  },
  {
    value: "newsletter-growth",
    label: "Newsletter Growth Chain",
    icon: "newsletter",
    description: "Buffer/LinkedIn + Quote snippets & carousel copy",
    defaultChannels: ["buffer", "linkedin"],
    recommendedRepurposing: ["quote_snippets", "carousel_text"],
  },
  {
    value: "social-expansion",
    label: "Social Expansion Chain",
    icon: "engagement",
    description: "LinkedIn + Buffer cross-posting + Discussion hooks",
    defaultChannels: ["linkedin", "buffer"],
    recommendedRepurposing: ["quote_snippets"],
  },
];

export function getDistributionChain(value: string): DistributionChain | undefined {
  return DISTRIBUTION_CHAINS.find((chain) => chain.value === value);
}

export function getSuggestedChainForGoal(goal: ContentGoal): DistributionChain | undefined {
  if (goal === "traffic") return DISTRIBUTION_CHAINS.find((c) => c.value === "seo-growth");
  if (goal === "authority") return DISTRIBUTION_CHAINS.find((c) => c.value === "founder-authority");
  if (goal === "conversion") return DISTRIBUTION_CHAINS.find((c) => c.value === "product-launch");
  if (goal === "lead-generation") return DISTRIBUTION_CHAINS.find((c) => c.value === "newsletter-growth");
  return DISTRIBUTION_CHAINS.find((c) => c.value === "social-expansion");
}

// ── Centralized Chat Suggestions ─────────────────────────────────────────────

export interface ChatIdeaSuggestion {
  label: string;
  prompt: string;
  icon: string; // name of CosIcon
  postTypes: string[] | "*";
  goals: ContentGoal[] | "*";
}

export const CHAT_IDEA_SUGGESTIONS: ChatIdeaSuggestion[] = [
  {
    label: "Write a how-to guide",
    icon: "tutorial",
    prompt: "Write a comprehensive how-to guide about [insert topic]. Break down the steps clearly, start with a hook explaining why this matters, and include practical examples for each step.",
    postTypes: ["blog", "tutorial"],
    goals: ["traffic", "authority", "retention"],
  },
  {
    label: "Summarize a key insight",
    icon: "draft",
    prompt: "Summarize the key takeaways and lessons learned from [insert experience/book/project]. Focus on actionable tips that a reader can implement immediately, and explain why these lessons are important.",
    postTypes: ["blog", "corporate-post", "newsletter", "community-insight"],
    goals: ["authority", "engagement", "retention"],
  },
  {
    label: "Share an opinion or take",
    icon: "engagement",
    prompt: "Draft a thought-leadership opinion post about the recent trends in [insert industry/field]. State a clear perspective, back it up with 2-3 reasons, and end with an engaging question to spark a discussion.",
    postTypes: ["blog", "social-post", "community-insight", "newsletter"],
    goals: ["authority", "engagement"],
  },
  {
    label: "Create a list article",
    icon: "listicle",
    prompt: "Create an engaging listicle detailing [insert number] best practices/tools/tips for [insert target audience]. For each item in the list, provide a brief description and a key takeaway.",
    postTypes: ["blog", "listicle"],
    goals: ["traffic", "engagement", "conversion"],
  },
  {
    label: "Draft a conversion copy",
    icon: "conversion",
    prompt: "Write a persuasive conversion copy highlighting the benefits of [insert product/service]. Focus on the customer's problem, present the solution, and conclude with a strong Call-To-Action (CTA).",
    postTypes: ["case-study", "product-review", "product-launch", "comparison", "listicle"],
    goals: ["conversion", "lead-generation"],
  },
  {
    label: "Outline a comparison guide",
    icon: "comparison",
    prompt: "Draft a head-to-head comparison outline between [Product A] and [Product B]. Focus on target audience, pricing, ease of use, and who each tool is best suited for.",
    postTypes: ["comparison"],
    goals: ["traffic", "conversion"],
  },
  {
    label: "Write a product launch post",
    icon: "product-launch",
    prompt: "Draft a high-impact social media post introducing our new product/feature: [insert product name]. Highlight the main benefit, explain who it's for, and invite readers to try it out with a clear link placeholder.",
    postTypes: ["product-launch", "social-post"],
    goals: ["conversion", "engagement", "lead-generation"],
  },
  {
    label: "Write a newsletter opening",
    icon: "newsletter",
    prompt: "Draft a warm, personal opening section for a newsletter issue about [insert main topic]. Keep the tone conversational and tease the valuable insights that follow.",
    postTypes: ["newsletter"],
    goals: ["retention", "engagement", "lead-generation"],
  },
  {
    label: "Draft client success study",
    icon: "case-study",
    prompt: "Help me structure a client success case study about [insert project]. Include sections for the initial challenge, our customized strategy, key performance metrics, and a concluding testimonial.",
    postTypes: ["case-study"],
    goals: ["authority", "conversion", "lead-generation"],
  },
  {
    label: "Create dev tutorial intro",
    icon: "tutorial",
    prompt: "Draft a beginner-friendly tutorial introduction explaining how to install/configure [insert tech stack]. Highlight what the reader will build, list prerequisites, and explain why this framework is valuable.",
    postTypes: ["tutorial"],
    goals: ["authority", "traffic", "retention"],
  },
  {
    label: "Draft corporate release",
    icon: "corporate-post",
    prompt: "Draft a polished corporate update or press release announcement celebrating our milestone of [insert milestone]. Include executive quote placeholders and corporate boilerplate info.",
    postTypes: ["corporate-post"],
    goals: ["authority", "engagement"],
  },
  {
    label: "Write honest product review",
    icon: "product-review",
    prompt: "Structure an in-depth product review of [insert product]. Compare its main features, pros and cons, pricing structure, and wrap up with a final verdict and a high-converting affiliate CTA.",
    postTypes: ["product-review"],
    goals: ["conversion", "traffic", "lead-generation"],
  },
  {
    label: "Write social hook variations",
    icon: "bolt",
    prompt: "Generate 3 scroll-stopping hook variations for a social media post about [insert topic]. Each variation should target a different style: one question-based, one statistic-based, and one contrarian take.",
    postTypes: ["social-post"],
    goals: ["engagement", "authority", "lead-generation"],
  },
  {
    label: "Draft weekly newsletter digest",
    icon: "newsletter",
    prompt: "Draft a weekly roundup newsletter digest summarizing recent updates in [insert industry]. Provide short takeaways for 3 articles and invite reader feedback in the closing section.",
    postTypes: ["newsletter"],
    goals: ["retention", "engagement"],
  },
  {
    label: "Structure comparison table",
    icon: "table",
    prompt: "Design a feature-by-feature comparison table layout comparing [Competitor A] and [Competitor B]. Focus on core metrics like pricing, ease of integration, customer support, and API coverage.",
    postTypes: ["comparison", "listicle"],
    goals: ["traffic", "conversion"],
  },
  {
    label: "Draft lead magnet outline",
    icon: "lead-generation",
    prompt: "Create a detailed outline for a high-value lead magnet (e.g. ebook or checklist) covering [insert topic]. Outline 5 main chapters/checkpoints and write a promotional copy to drive sign-ups.",
    postTypes: ["blog", "tutorial", "case-study"],
    goals: ["lead-generation", "conversion"],
  },
  {
    label: "Draft customer retention update",
    icon: "retention",
    prompt: "Draft a warm customer retention educational update teaching our users how to get the most out of [insert feature]. Include a success checklist and link placeholders for our help center.",
    postTypes: ["corporate-post", "newsletter"],
    goals: ["retention"],
  },
  {
    label: "Outline community roundup",
    icon: "community-insight",
    prompt: "Draft a community roundup post highlighting the best discussions, questions, and insights shared this week about [insert topic]. Conclude with a call-to-action inviting users to join our Slack/Discord.",
    postTypes: ["community-insight"],
    goals: ["engagement", "retention"],
  },
  {
    label: "Write troubleshooting guide",
    icon: "warning",
    prompt: "Draft a comprehensive troubleshooting guide for resolving [insert common error/issue]. Break down the diagnostic steps, explain the root cause, and provide the fix code block.",
    postTypes: ["tutorial"],
    goals: ["retention", "traffic"],
  },
  {
    label: "Draft viral social thread",
    icon: "social-post",
    prompt: "Rewrite this concept [insert topic] into a viral Twitter/social thread structure. Draft a compelling hook, 5 follow-up points with clear transitions, and a concluding prompt to retweet.",
    postTypes: ["social-post", "blog"],
    goals: ["engagement", "authority"],
  },
  {
    label: "Create PR boilerplate",
    icon: "corporate-post",
    prompt: "Write a standard corporate PR media boilerplate and company description for [Company Name]. Focus on our mission of [insert mission] and key industry accomplishments.",
    postTypes: ["corporate-post"],
    goals: ["authority"],
  },
  {
    label: "Generate converting CTA",
    icon: "sparkles",
    prompt: "Generate 3 benefit-focused, high-converting Call-to-Action (CTA) block copy variations promoting [insert product]. Focus on reducing friction (e.g., 'no credit card required') and highlighting speed.",
    postTypes: ["comparison", "product-review", "product-launch"],
    goals: ["conversion", "lead-generation"],
  },
  {
    label: "Structure buying comparison",
    icon: "comparison",
    prompt: "Draft a head-to-head buyer guide comparing [insert category, e.g. project management tools]. Detail which tool is best for small teams, which is best for enterprises, and give a clear verdict.",
    postTypes: ["comparison", "product-review"],
    goals: ["traffic", "conversion"],
  },
  {
    label: "Write client success study",
    icon: "celebrate",
    prompt: "Draft a success story post focusing on how [Client Name] achieved [insert result, e.g., 40% reduction in churn] using our product. Emphasize the implementation timeline and the ROI.",
    postTypes: ["case-study"],
    goals: ["conversion", "retention"],
  },
];

export function getChatSuggestions(postType: string, goal: ContentGoal): ChatIdeaSuggestion[] {
  // Filter suggestions by postType and goal
  const filtered = CHAT_IDEA_SUGGESTIONS.filter((s) => {
    const typeMatch = s.postTypes === "*" || s.postTypes.includes(postType);
    const goalMatch = s.goals === "*" || s.goals.includes(goal);
    return typeMatch && goalMatch;
  });

  // If fewer than 4, fill up using suggestions matching "*" or other relevant fallbacks
  if (filtered.length < 4) {
    for (const s of CHAT_IDEA_SUGGESTIONS) {
      if (filtered.length >= 4) break;
      if (!filtered.find((item) => item.label === s.label)) {
        filtered.push(s);
      }
    }
  }

  return filtered.slice(0, 4);
}
