import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAnalyticsSnapshot extends Document {
  /** References the Admin._id that owns this snapshot */
  tenantId: mongoose.Types.ObjectId;
  /** References the Post._id this performance snapshot represents */
  postId: mongoose.Types.ObjectId;
  /** Outbound channel platform */
  platform: "wordpress" | "medium" | "ghost" | "buffer" | "linkedin";
  /** Daily snapshot date */
  date: Date;
  /** Scraped or API queried metric counters */
  metrics: {
    views: number;
    clicks: number;
    shares: number;
    claps?: number; // Medium specific
    likes?: number; // LinkedIn specific
    impressions?: number; // LinkedIn specific
    comments?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const AnalyticsSnapshotSchema: Schema<IAnalyticsSnapshot> = new Schema(
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
      required: true,
      index: true,
    },
    platform: {
      type: String,
      enum: ["wordpress", "medium", "ghost", "buffer", "linkedin"],
      required: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    metrics: {
      views: { type: Number, default: 0 },
      clicks: { type: Number, default: 0 },
      shares: { type: Number, default: 0 },
      claps: { type: Number, default: 0 },
      likes: { type: Number, default: 0 },
      impressions: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  },
);

// Compound index to prevent duplicate daily platform performance snap entries
AnalyticsSnapshotSchema.index(
  { postId: 1, platform: 1, date: 1 },
  { unique: true },
);

const AnalyticsSnapshot: Model<IAnalyticsSnapshot> =
  (mongoose.models.AnalyticsSnapshot as Model<IAnalyticsSnapshot>) ||
  mongoose.model<IAnalyticsSnapshot>(
    "AnalyticsSnapshot",
    AnalyticsSnapshotSchema,
  );

export default AnalyticsSnapshot;
