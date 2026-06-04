import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * Phase 4G: AI Generation Log
 * 
 * Comprehensive data instrumentation for future fine-tuning and RLHF
 * Captures full context stack, model metadata, and user feedback signals
 */

export interface IAIGenerationLog extends Document {
  /** Tenant ID (multi-tenancy boundary) */
  tenantId: mongoose.Types.ObjectId;
  
  /** Post ID this generation belongs to */
  postId?: mongoose.Types.ObjectId;
  
  /** Unique generation ID (links to aiWorkspaceSession.generations[].id) */
  generationId: string;
  
  // === Context Stack (for fine-tuning) ===
  context: {
    contentGoal?: string; // "traffic", "authority", "conversion", etc.
    postType?: string; // "blog", "tutorial", "social-post", etc.
    userBrief?: string; // User's topic/brief input
    userKeywords?: string; // User's keyword input
    brandVoice?: string; // Brand Brain or custom override
    brandAudience?: string;
    brandKeywords?: string[];
    preset?: string; // "seo-article", "thought-leadership", etc.
    editIntent?: string; // "surgical", "transform", "rewrite", "continue"
    selectedText?: string; // What was selected for editing
    surroundingContext?: string; // Nearby content
    postTitle?: string; // Post title at time of generation
  };
  
  // === Model Configuration ===
  modelConfig: {
    engine: "openai" | "anthropic" | "gemini" | "mistral" | "puter";
    model: string; // "gpt-4o", "claude-3-5-sonnet", etc.
    temperature: number;
    maxTokens?: number;
  };
  
  // === Generation Data ===
  generation: {
    action: string; // "chat", "improve", "shorten", "expand", etc.
    systemPrompt: string; // Full system instructions
    userPrompt: string; // Final user message
    rawOutput: string; // AI's raw response
    normalizedOutput?: string; // After HTML normalization
    tokensUsed?: number;
    latencyMs?: number;
    costUSD?: number;
    promptVersion?: string; // Phase 4G-3: Track which prompt version was used (e.g., "v1.0")
  };
  
  // === User Feedback (RLHF signals) ===
  feedback: {
    action?: "accepted" | "rejected" | "edited" | "regenerated" | "pending";
    appliedAt?: Date;
    userEdits?: string; // Diff or final edited version
    rating?: number; // 1-5 stars (future feature)
    flagReason?: string; // "hallucination", "off-brand", "incorrect-tone", etc.
  };
  
  // === Timestamps ===
  createdAt: Date;
  updatedAt: Date;
}

const AIGenerationLogSchema: Schema<IAIGenerationLog> = new Schema(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
      index: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      index: true,
    },
    generationId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    context: {
      contentGoal: String,
      postType: String,
      userBrief: String,
      userKeywords: String,
      brandVoice: String,
      brandAudience: String,
      brandKeywords: [String],
      preset: String,
      editIntent: String,
      selectedText: String,
      surroundingContext: String,
      postTitle: String,
    },
    modelConfig: {
      engine: {
        type: String,
        enum: ["openai", "anthropic", "gemini", "mistral", "puter"],
        required: true,
        index: true,
      },
      model: {
        type: String,
        required: true,
        index: true,
      },
      temperature: Number,
      maxTokens: Number,
    },
    generation: {
      action: {
        type: String,
        required: true,
        index: true,
      },
      systemPrompt: String,
      userPrompt: String,
      rawOutput: {
        type: String,
        required: true,
      },
      normalizedOutput: String,
      tokensUsed: Number,
      latencyMs: Number,
      costUSD: Number,
      promptVersion: String, // Phase 4G-3: Track prompt version
    },
    feedback: {
      action: {
        type: String,
        enum: ["accepted", "rejected", "edited", "regenerated", "pending"],
        default: "pending",
        index: true,
      },
      appliedAt: Date,
      userEdits: String,
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      flagReason: String,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for analytics queries
AIGenerationLogSchema.index({ tenantId: 1, createdAt: -1 }); // Tenant history
AIGenerationLogSchema.index({ postId: 1, createdAt: -1 }); // Post generations
AIGenerationLogSchema.index({ "modelConfig.engine": 1, "feedback.action": 1 }); // Provider performance
AIGenerationLogSchema.index({ "generation.action": 1, "feedback.action": 1 }); // Action effectiveness
AIGenerationLogSchema.index({ tenantId: 1, "feedback.action": 1, createdAt: -1 }); // User feedback patterns

const AIGenerationLog: Model<IAIGenerationLog> =
  (mongoose.models.AIGenerationLog as Model<IAIGenerationLog>) ||
  mongoose.model<IAIGenerationLog>("AIGenerationLog", AIGenerationLogSchema);

export default AIGenerationLog;
