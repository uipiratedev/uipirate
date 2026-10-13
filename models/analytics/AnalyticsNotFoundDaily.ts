import mongoose, { Schema, Document } from "mongoose";

/**
 * Requests that landed on the 404 page — one row per (date, path, referrerHost).
 *
 * Search Console reports crawl errors days late and only for Google; this shows
 * the broken URL the moment a human or a link hits it, along with who linked
 * to it. Anonymous like `AnalyticsHitDaily`: counts only, no identifiers.
 */
export interface IAnalyticsNotFoundDaily extends Document {
  date: string; // YYYY-MM-DD (UTC)
  path: string;
  /** Referring host ("" when direct), so the broken inbound link can be found. */
  referrerHost: string;
  hits: number;
  updatedAt: Date;
}

const AnalyticsNotFoundDailySchema: Schema = new Schema(
  {
    date: { type: String, required: true },
    path: { type: String, required: true },
    referrerHost: { type: String, default: "" },
    hits: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: false, updatedAt: true } },
);

AnalyticsNotFoundDailySchema.index(
  { date: 1, path: 1, referrerHost: 1 },
  { unique: true, name: "notfound_bucket_unique" },
);
AnalyticsNotFoundDailySchema.index({ date: -1 });
// This endpoint is publicly callable, so bound what junk can accumulate.
AnalyticsNotFoundDailySchema.index(
  { updatedAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 90 },
);

const AnalyticsNotFoundDaily = (mongoose.models.AnalyticsNotFoundDaily ||
  mongoose.model(
    "AnalyticsNotFoundDaily",
    AnalyticsNotFoundDailySchema as never,
  )) as unknown as mongoose.Model<IAnalyticsNotFoundDaily>;

export default AnalyticsNotFoundDaily;
