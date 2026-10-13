import mongoose, { Schema, Document } from "mongoose";

/**
 * Optional pre-aggregation: one row per (date, path). The dashboard works
 * without this (queries.ts aggregates on read); the rollup cron
 * (/api/analytics/rollup) fills it so very wide date ranges stay fast.
 */
export interface IAnalyticsPageDaily extends Document {
  date: string; // YYYY-MM-DD (UTC)
  path: string;
  views: number;
  uniques: number;
  avgDwellMs: number;
  avgScrollDepth: number;
  entrances: number;
  exits: number;
  clicks: number;
  updatedAt: Date;
}

const AnalyticsPageDailySchema: Schema = new Schema(
  {
    date: { type: String, required: true },
    path: { type: String, required: true },
    views: { type: Number, default: 0 },
    uniques: { type: Number, default: 0 },
    avgDwellMs: { type: Number, default: 0 },
    avgScrollDepth: { type: Number, default: 0 },
    entrances: { type: Number, default: 0 },
    exits: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: false, updatedAt: true } },
);

AnalyticsPageDailySchema.index({ date: 1, path: 1 }, { unique: true });

const AnalyticsPageDaily = (mongoose.models.AnalyticsPageDaily ||
  mongoose.model(
    "AnalyticsPageDaily",
    AnalyticsPageDailySchema as never,
  )) as unknown as mongoose.Model<IAnalyticsPageDaily>;

export default AnalyticsPageDaily;
