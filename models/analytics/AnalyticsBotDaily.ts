import mongoose, { Schema, Document } from "mongoose";

/**
 * Crawler hits — one row per (date, botName, path).
 *
 * `robots.txt` explicitly allows GPTBot, ClaudeBot, PerplexityBot and the
 * other AI crawlers, but until now every bot request was discarded at the
 * ingest endpoint, so there was no way to tell whether they ever actually
 * came. Whether an AI crawler is reading a page is a leading indicator of
 * whether that page can be cited by an assistant later.
 */
export interface IAnalyticsBotDaily extends Document {
  date: string; // YYYY-MM-DD (UTC)
  botName: string;
  /** `BotKind` — ai | search | seo | social | tool | other */
  botKind: string;
  path: string;
  hits: number;
  updatedAt: Date;
}

const AnalyticsBotDailySchema: Schema = new Schema(
  {
    date: { type: String, required: true },
    botName: { type: String, required: true },
    botKind: { type: String, default: "other" },
    path: { type: String, required: true },
    hits: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: false, updatedAt: true } },
);

AnalyticsBotDailySchema.index(
  { date: 1, botName: 1, path: 1 },
  { unique: true, name: "bot_bucket_unique" },
);
AnalyticsBotDailySchema.index({ date: -1 });

const AnalyticsBotDaily = (mongoose.models.AnalyticsBotDaily ||
  mongoose.model(
    "AnalyticsBotDaily",
    AnalyticsBotDailySchema as never,
  )) as unknown as mongoose.Model<IAnalyticsBotDaily>;

export default AnalyticsBotDaily;
