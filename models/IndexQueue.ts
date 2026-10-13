import mongoose, { Schema, Document } from "mongoose";

export interface IIndexQueue extends Document {
  url: string;
  provider: "google-indexing" | "google-inspection" | "bing-submit" | "indexnow";
  action: "submit" | "inspect";
  enqueuedAt: Date;
  attempts: number;
  lastAttemptAt?: Date;
  lastError?: string;
  status: "pending" | "done" | "failed";
  createdAt: Date;
  updatedAt: Date;
}

const IndexQueueSchema = new Schema<IIndexQueue>(
  {
    url: { type: String, required: true, index: true },
    provider: {
      type: String,
      enum: ["google-indexing", "google-inspection", "bing-submit", "indexnow"],
      required: true,
    },
    action: {
      type: String,
      enum: ["submit", "inspect"],
      required: true,
    },
    enqueuedAt: { type: Date, default: Date.now },
    attempts: { type: Number, default: 0 },
    lastAttemptAt: { type: Date },
    lastError: { type: String },
    status: {
      type: String,
      enum: ["pending", "done", "failed"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true, collection: "indexQueue" },
);

IndexQueueSchema.index({ status: 1, enqueuedAt: 1 });

const IndexQueue =
  (mongoose.models.IndexQueue as mongoose.Model<IIndexQueue>) ||
  mongoose.model<IIndexQueue>("IndexQueue", IndexQueueSchema);

export default IndexQueue;
