import mongoose, { Schema, Document, Model } from "mongoose";

export interface IViewLog extends Document {
  ipHash: string;
  slug: string;
  viewedAt: Date;
}

const ViewLogSchema: Schema = new Schema({
  // SHA-256 hash of visitor IP — never stored raw for privacy
  ipHash: {
    type: String,
    required: true,
  },
  // Blog slug this view is associated with
  slug: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  // When the view was recorded — MongoDB TTL index will auto-delete after 24h
  viewedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

// Compound unique index: one entry per IP+slug combination within the TTL window
ViewLogSchema.index({ ipHash: 1, slug: 1 }, { unique: true });

// TTL index: MongoDB automatically deletes documents 24 hours after viewedAt
// 86400 seconds = 24 hours
ViewLogSchema.index({ viewedAt: 1 }, { expireAfterSeconds: 86400 });

const ViewLog: Model<IViewLog> =
  (mongoose.models.ViewLog as any) ||
  mongoose.model<IViewLog>("ViewLog", ViewLogSchema);

export default ViewLog;
