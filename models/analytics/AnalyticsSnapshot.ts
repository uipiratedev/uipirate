import mongoose, { Schema, Document } from "mongoose";

/**
 * One frozen row per week of headline numbers.
 *
 * The raw event stream is deleted after 90 days and sessions after 180, so
 * "how are we doing versus the same week last quarter?" has no answer once the
 * source rows are gone. A snapshot is a few hundred bytes and never expires.
 */
export interface IAnalyticsSnapshot extends Document {
  /** Monday of the week, YYYY-MM-DD (UTC). Unique. */
  weekStart: string;
  /** Sunday of the week, YYYY-MM-DD (UTC). */
  weekEnd: string;
  /** Consent-free visits — comparable to Vercel. */
  allVisits: number;
  /** Visits from consented visitors only. */
  trackedSessions: number;
  botHits: number;
  aiCrawls: number;
  /** Contact actions + form submits (tracked visitors). */
  conversions: number;
  /** Hits per channel, e.g. { direct: 400, organic: 30, ai: 10 }. */
  channels: Record<string, number>;
  createdAt: Date;
}

const AnalyticsSnapshotSchema: Schema = new Schema(
  {
    weekStart: { type: String, required: true, unique: true },
    weekEnd: { type: String, required: true },
    allVisits: { type: Number, default: 0 },
    trackedSessions: { type: Number, default: 0 },
    botHits: { type: Number, default: 0 },
    aiCrawls: { type: Number, default: 0 },
    conversions: { type: Number, default: 0 },
    channels: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

const AnalyticsSnapshot = (mongoose.models.AnalyticsSnapshot ||
  mongoose.model(
    "AnalyticsSnapshot",
    AnalyticsSnapshotSchema as never,
  )) as unknown as mongoose.Model<IAnalyticsSnapshot>;

export default AnalyticsSnapshot;
