import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * Phase 4F.2: Content History & Versioning
 * 
 * Git-style version control for content tracking
 * Stores snapshots, diffs, and metadata for every content change
 */

export interface IContentHistory extends Document {
  /** References the Post._id this version belongs to */
  postId: mongoose.Types.ObjectId;
  
  /** References the Admin._id (tenant boundary) */
  tenantId: mongoose.Types.ObjectId;
  
  /** Sequential version number (auto-incremented per post) */
  version: number;
  
  /** Full content snapshot at this version */
  snapshot: string;
  
  /** Diff from previous version (unified diff format) */
  diff?: string;
  
  /** Character count change (+/- from previous version) */
  charDelta?: number;
  
  /** Who made this change (user ID or "ai") */
  changedBy: mongoose.Types.ObjectId | string; // ObjectId for users, "ai" for AI
  
  /** Type of change */
  changeType: "manual" | "ai-generation" | "ai-rewrite" | "ai-continue" | "ai-improve" | "restore" | "import";
  
  /** AI-specific metadata (if changeType starts with "ai-") */
  aiMetadata?: {
    generationId?: string; // Links to aiWorkspaceSession.generations[].id
    action?: string; // "chat", "improve", "shorten", etc.
    model?: string; // "gpt-4o", "claude-3.5-sonnet", etc.
    provider?: string; // "openai", "anthropic", etc.
    tokensUsed?: number;
  };
  
  /** Optional commit message/description */
  commitMessage?: string;
  
  /** Timestamp of this version */
  timestamp: Date;
  
  /** Title at this version (for reference) */
  title?: string;
  
  /** Post type at this version */
  postType?: string;
  
  createdAt: Date;
}

const ContentHistorySchema: Schema<IContentHistory> = new Schema(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true,
    },
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
      index: true,
    },
    version: {
      type: Number,
      required: true,
      min: 1,
    },
    snapshot: {
      type: String,
      required: true,
    },
    diff: {
      type: String,
    },
    charDelta: {
      type: Number,
    },
    changedBy: {
      type: Schema.Types.Mixed, // Can be ObjectId or string "ai"
      required: true,
    },
    changeType: {
      type: String,
      enum: ["manual", "ai-generation", "ai-rewrite", "ai-continue", "ai-improve", "restore", "import"],
      required: true,
      index: true,
    },
    aiMetadata: {
      generationId: String,
      action: String,
      model: String,
      provider: String,
      tokensUsed: Number,
    },
    commitMessage: {
      type: String,
      maxlength: 500,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    title: {
      type: String,
    },
    postType: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Only track creation
  }
);

// Compound indexes for efficient queries
ContentHistorySchema.index({ postId: 1, version: -1 }); // Get latest version
ContentHistorySchema.index({ postId: 1, timestamp: -1 }); // Get chronological history
ContentHistorySchema.index({ tenantId: 1, timestamp: -1 }); // Get tenant history
ContentHistorySchema.index({ tenantId: 1, changeType: 1, timestamp: -1 }); // Filter by change type

const ContentHistory: Model<IContentHistory> =
  (mongoose.models.ContentHistory as Model<IContentHistory>) ||
  mongoose.model<IContentHistory>("ContentHistory", ContentHistorySchema);

export default ContentHistory;
