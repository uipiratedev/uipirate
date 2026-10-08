import mongoose, { Schema, Document } from "mongoose";

/**
 * Consent-free, fully anonymous hit counter — one row per
 * (date, path, channel, country, deviceType).
 *
 * This is deliberately NOT the same thing as `AnalyticsSession` /
 * `AnalyticsEvent`, which only exist for visitors who granted cookie consent
 * and which carry a visitor id. The consented tracker under-counts badly
 * (ad blockers, declined banners, no-JS), which is why our dashboard
 * disagreed with Vercel. This table answers "how much traffic did we get"
 * for *everyone*, and is written server-side from middleware so it also
 * counts visitors who never run JavaScript.
 *
 * Privacy: no visitor id, no session id, no IP, no IP hash, no user-agent
 * string — nothing that can single out a person. Only counts per bucket, so
 * no consent is required to collect it.
 */
export interface IAnalyticsHitDaily extends Document {
  date: string; // YYYY-MM-DD (UTC)
  path: string;
  /** `ReferrerType` — direct | organic | ai | social | referral | … */
  channel: string;
  /** Referring host, e.g. "reddit.com". "" for direct. */
  referrerHost: string;
  /** ISO-3166 alpha-2, or "" when unknown. */
  country: string;
  deviceType: string;
  hits: number;
  updatedAt: Date;
}

const AnalyticsHitDailySchema: Schema = new Schema(
  {
    date: { type: String, required: true },
    path: { type: String, required: true },
    channel: { type: String, default: "direct" },
    referrerHost: { type: String, default: "" },
    country: { type: String, default: "" },
    deviceType: { type: String, default: "unknown" },
    hits: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: false, updatedAt: true } },
);

// The full dimension tuple is the identity of a row — upserts key on it.
AnalyticsHitDailySchema.index(
  { date: 1, path: 1, channel: 1, referrerHost: 1, country: 1, deviceType: 1 },
  { unique: true, name: "hit_bucket_unique" },
);
// Range scans by day for the dashboard.
AnalyticsHitDailySchema.index({ date: -1 });

const AnalyticsHitDaily = (mongoose.models.AnalyticsHitDaily ||
  mongoose.model(
    "AnalyticsHitDaily",
    AnalyticsHitDailySchema as never,
  )) as unknown as mongoose.Model<IAnalyticsHitDaily>;

export default AnalyticsHitDaily;
