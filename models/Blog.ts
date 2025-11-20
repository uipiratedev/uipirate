import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBlog extends Document {
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
  views?: number;
  readTime?: number; // in minutes
  calculateReadTime(): void;
}

const BlogSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title for this blog"],
      maxlength: [200, "Title cannot be more than 200 characters"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Please provide a slug for this blog"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Please provide content for this blog"],
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
    readTime: {
      type: Number, // in minutes
      default: 5,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Create indexes for better query performance
BlogSchema.index({ published: 1, publishedAt: -1 });
// Note: slug index is created automatically by unique: true
BlogSchema.index({ tags: 1 });

// Pre-save middleware to set publishedAt when published status changes
BlogSchema.pre("save", function (next) {
  if (this.isModified("published") && this.published && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Method to calculate read time based on content
BlogSchema.methods.calculateReadTime = function () {
  const wordsPerMinute = 200;
  const textContent = this.content.replace(/<[^>]*>/g, ""); // Strip HTML tags
  const wordCount = textContent.split(/\s+/).length;

  this.readTime = Math.ceil(wordCount / wordsPerMinute);
};

// Static method to find published blogs
BlogSchema.statics.findPublished = function () {
  return this.find({ published: true }).sort({ publishedAt: -1 });
};

// Prevent model recompilation in development
const Blog: Model<IBlog> =
  mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);

export default Blog;
