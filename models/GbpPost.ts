import mongoose, { Schema, Document } from "mongoose";

/**
 * One row per CMS post that has been considered for the Google Business
 * Profile. The unique `slug` is what makes publishing idempotent: a post is
 * announced once, however many times the sync runs.
 */
export type GbpStatus =
  | "queued"
  | "publishing"
  | "published"
  | "failed"
  | "skipped";

export interface IGbpPost extends Document {
  slug: string;
  title: string;
  postType?: string;
  /** CMS publish date, used to order the backlog newest-first. */
  postPublishedAt?: Date | null;
  status: GbpStatus;
  /** `new` goes out within a day; `backlog` drips out on a schedule. */
  origin: "new" | "backlog";
  attempts: number;
  /** Resource name Google returned, e.g. accounts/1/locations/2/localPosts/3. */
  gbpPostName?: string;
  publishedAt?: Date | null;
  /** Last failure, or why the post was skipped. */
  message?: string;
  /** "manual" skips are permanent; others are re-evaluated on every sync. */
  skipKind?: "manual" | "ineligible";
  createdAt: Date;
  updatedAt: Date;
}

const GbpPostSchema: Schema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, default: "" },
    postType: String,
    postPublishedAt: { type: Date, default: null },
    status: {
      type: String,
      enum: ["queued", "publishing", "published", "failed", "skipped"],
      default: "queued",
    },
    origin: { type: String, enum: ["new", "backlog"], default: "new" },
    attempts: { type: Number, default: 0 },
    gbpPostName: String,
    publishedAt: { type: Date, default: null },
    message: String,
    skipKind: { type: String, enum: ["manual", "ineligible"] },
  },
  { timestamps: true },
);

GbpPostSchema.index({ status: 1, origin: 1 });

const GbpPost = (mongoose.models.GbpPost ||
  mongoose.model("GbpPost", GbpPostSchema as never)) as unknown as mongoose.Model<IGbpPost>;

export default GbpPost;
