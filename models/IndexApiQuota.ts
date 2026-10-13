import mongoose, { Schema, Document } from "mongoose";

export interface IIndexApiQuota extends Document<string> {
  _id: string; // e.g. "google-indexing:2026-09-09"
  provider: "google-indexing" | "google-inspection" | "bing-submit";
  date: string; // "YYYY-MM-DD"
  used: number;
  limit: number;
  updatedAt: Date;
}

const IndexApiQuotaSchema = new Schema<IIndexApiQuota>(
  {
    _id: { type: String, required: true },
    provider: {
      type: String,
      enum: ["google-indexing", "google-inspection", "bing-submit"],
      required: true,
      index: true,
    },
    date: { type: String, required: true, index: true },
    used: { type: Number, default: 0 },
    limit: { type: Number, required: true },
  },
  { timestamps: { createdAt: false, updatedAt: true }, collection: "indexApiQuotas" },
);

const IndexApiQuota =
  (mongoose.models.IndexApiQuota as mongoose.Model<IIndexApiQuota>) ||
  mongoose.model<IIndexApiQuota>("IndexApiQuota", IndexApiQuotaSchema);

export default IndexApiQuota;
