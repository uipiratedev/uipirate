import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPost extends Document {
  /** References the Admin._id that owns this post — the tenant boundary */
  tenantId: mongoose.Types.ObjectId;
  /** Optional: References the Team._id if this post is assigned to a team (Phase 5.4+) */
  teamId?: mongoose.Types.ObjectId;
  /** The post creator — always has access and is shown as owner in the collab panel */
  owner?: { email: string; name: string };
  /** Members assigned to collaborate on this post */
  assignees?: Array<{ email: string; name: string }>;
  title: string;
  slug: string;
  content: string; // HTML content from TipTap editor
  excerpt?: string;
  featuredImage?: string;
  bannerImage?: string;
  author: {
    name: string;
    email: string;
  };
  tags?: string[];
  published: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  views?: number; // Unique human views (deduplicated per IP per 24h)
  botViews?: number; // Hits from known bots/crawlers
  duplicateViews?: number; // Repeat visits from same IP within 24h
  totalViews?: number; // Raw total = views + duplicateViews + botViews
  readTime?: number; // in minutes
  postType?: "blog" | "tutorial" | "case-study" | "community-insight" | "product-review" | "product-launch" | "listicle" | "comparison" | "newsletter" | "social-post" | "corporate-post";
  contentGoal?: "traffic" | "authority" | "conversion" | "engagement" | "lead-generation" | "retention";
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    twitterHandle?: string;
    twitterCard?: "summary" | "summary_large_image";
    focusKeyword?: string;
    canonicalUrl?: string;
    noIndex?: boolean;
  };
  distributionRecords?: Array<{
    platform: string; // "wordpress" | "medium" | "ghost" | "buffer"
    externalId: string; // Platform's post ID — used for future updates/deletes
    url: string; // Canonical external URL (shown as a link in the UI)
    distributedAt: Date;
    status: "success" | "failed" | "pending";
    errorMessage?: string; // Populated on failure; surfaced in Distribution Panel
  }>;
  repurposedOutputs?: Record<string, string>;
  aiWorkspaceSession?: {
    messages: Array<{
      id: string;
      role: "user" | "assistant";
      content: string;
      timestamp: Date;
      associatedGenerationId?: string;
      selectedTextContext?: string;
    }>;
    generations: Array<{
      id: string;
      prompt: string;
      output: string;
      mode: string;
      appliedAt?: Date;
      isAccepted: boolean;
      selectedTextContext?: string;
    }>;
    lastActiveAt: Date;
  };
  // Approval workflow (enterprise)
  approvalStatus?: "draft" | "pending_review" | "approved" | "rejected";
  approvalRequestedBy?: string;   // actor email
  approvalRequestedAt?: Date;
  approvalReviewedBy?: string;    // actor email
  approvalReviewedAt?: Date;
  approvalNote?: string;          // reviewer note / rejection reason
  calculateReadTime(): void;
}


const PostSchema: Schema = new Schema(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: [true, "tenantId is required"],
      index: true,
    },
    teamId: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      index: true,
    },
    owner: {
      email: { type: String, default: "" },
      name: { type: String, default: "" },
    },
    assignees: {
      type: [{ email: { type: String, required: true }, name: { type: String, default: "" } }],
      default: [],
      index: true,
    },
    title: {
      type: String,
      required: [true, "Please provide a title for this post"],
      maxlength: [200, "Title cannot be more than 200 characters"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Please provide a slug for this post"],
      lowercase: true,
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Please provide content for this post"],
    },
    excerpt: {
      type: String,
      maxlength: [500, "Excerpt cannot be more than 500 characters"],
      trim: true,
    },
    featuredImage: {
      type: String,
      trim: true,
    },
    bannerImage: {
      type: String,
      trim: true,
    },
    author: {
      name: {
        type: String,
        required: true,
        default: "UI Pirate",
      },
      email: {
        type: String,
        required: true,
      },
    },
    tags: {
      type: [String],
      default: [],
    },
    published: {
      type: Boolean,
      default: false,
      index: true,
    },
    publishedAt: {
      type: Date,
    },
    views: {
      type: Number,
      default: 0,
    },
    // Views from known bots/crawlers (Googlebot, Bingbot, etc.)
    botViews: {
      type: Number,
      default: 0,
    },
    // Human visits that were duplicates (same IP within 24h window)
    duplicateViews: {
      type: Number,
      default: 0,
    },
    // Raw total hits: views + duplicateViews + botViews
    totalViews: {
      type: Number,
      default: 0,
    },
    readTime: {
      type: Number, // in minutes
      default: 5,
    },
    postType: {
      type: String,
      enum: ["blog", "tutorial", "case-study", "community-insight", "product-review", "product-launch", "listicle", "comparison", "newsletter", "social-post", "corporate-post"],
      default: "blog",
    },
    contentGoal: {
      type: String,
      enum: ["traffic", "authority", "conversion", "engagement", "lead-generation", "retention"],
    },
    seo: {
      metaTitle: { type: String, trim: true },
      metaDescription: { type: String, trim: true },
      keywords: { type: [String], default: [] },
      ogTitle: { type: String, trim: true },
      ogDescription: { type: String, trim: true },
      ogImage: { type: String, trim: true },
      twitterHandle: { type: String, trim: true },
      twitterCard: {
        type: String,
        enum: ["summary", "summary_large_image"],
        default: "summary_large_image",
      },
      focusKeyword: { type: String, trim: true },
      canonicalUrl: { type: String, trim: true },
      noIndex: { type: Boolean, default: false },
    },
    distributionRecords: [
      {
        platform: { type: String, required: true },
        externalId: { type: String },
        url: { type: String },
        distributedAt: { type: Date, default: Date.now },
        status: {
          type: String,
          enum: ["success", "failed", "pending"],
          default: "pending",
        },
        errorMessage: { type: String },
      },
    ],
    repurposedOutputs: {
      type: Map,
      of: String,
      default: {},
    },
    // Approval workflow (enterprise)
    approvalStatus: {
      type: String,
      enum: ["draft", "pending_review", "approved", "rejected"],
      default: "draft",
      index: true,
    },
    approvalRequestedBy: { type: String },
    approvalRequestedAt: { type: Date },
    approvalReviewedBy: { type: String },
    approvalReviewedAt: { type: Date },
    approvalNote: { type: String },
    aiWorkspaceSession: {
      messages: [
        {
          id: { type: String, required: true },
          role: { type: String, enum: ["user", "assistant"], required: true },
          content: { type: String, required: true },
          timestamp: { type: Date, default: Date.now },
          associatedGenerationId: { type: String },
          selectedTextContext: { type: String },
        },
      ],
      generations: [
        {
          id: { type: String, required: true },
          prompt: { type: String, required: true },
          output: { type: String, required: true },
          mode: { type: String, required: true },
          appliedAt: { type: Date },
          isAccepted: { type: Boolean, default: false },
          selectedTextContext: { type: String },
        },
      ],
      lastActiveAt: { type: Date, default: Date.now },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  },
);

// Create indexes for better query performance
PostSchema.index({ tenantId: 1, published: 1, publishedAt: -1 });
PostSchema.index({ "owner.email": 1 });
// Slug must be unique within a tenant, not globally
PostSchema.index({ tenantId: 1, slug: 1 }, { unique: true });
PostSchema.index({ tags: 1 });

// Pre-save middleware to set publishedAt when published status changes
PostSchema.pre("save", function (next) {
  if (this.isModified("published") && this.published && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Method to calculate read time based on content
PostSchema.methods.calculateReadTime = function () {
  const wordsPerMinute = 200;
  const textContent = this.content.replace(/<[^>]*>/g, ""); // Strip HTML tags
  const wordCount = textContent.split(/\s+/).length;

  this.readTime = Math.ceil(wordCount / wordsPerMinute);
};

// Static method to find published posts
PostSchema.statics.findPublished = function () {
  return this.find({ published: true }).sort({ publishedAt: -1 });
};

// Prevent model recompilation in development
const Post: Model<IPost> =
  (mongoose.models.Post as any) || mongoose.model<IPost>("Post", PostSchema);

export default Post;
