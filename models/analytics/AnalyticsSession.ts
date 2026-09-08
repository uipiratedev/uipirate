import type { ReferrerType, Utm } from "@/lib/analytics/types";

import mongoose, { Schema, Document } from "mongoose";

/**
 * One document per session (30-min inactivity window, id minted client-side).
 * Upserted on every event. TTL 180 days on lastSeenAt.
 */
export interface IAnalyticsSession extends Document {
  sessionId: string;
  visitorId: string;
  ipHash: string;
  leadId?: mongoose.Types.ObjectId;
  startedAt: Date;
  lastSeenAt: Date;
  /** Accumulated engaged time (pings + page_close dwell), milliseconds. */
  durationMs: number;
  pageViewCount: number;
  clickCount: number;
  isBounce: boolean;
  entryPath: string;
  exitPath: string;
  /** Ordered path history, capped at 50. */
  pagePath: string[];
  referrer?: string;
  referrerType?: ReferrerType;
  utm?: Utm;
  device?: { type: string; os?: string; browser?: string };
  geo?: { country?: string; region?: string; city?: string };
  isNewVisitor: boolean;
  isBot: boolean;
}

const AnalyticsSessionSchema: Schema = new Schema({
  sessionId: { type: String, required: true, unique: true },
  visitorId: { type: String, required: true },
  ipHash: { type: String, required: true },
  leadId: { type: Schema.Types.ObjectId, ref: "Lead" },
  startedAt: { type: Date, required: true },
  lastSeenAt: { type: Date, required: true },
  durationMs: { type: Number, default: 0 },
  pageViewCount: { type: Number, default: 0 },
  clickCount: { type: Number, default: 0 },
  isBounce: { type: Boolean, default: true },
  entryPath: { type: String, default: "/" },
  exitPath: { type: String, default: "/" },
  pagePath: { type: [String], default: [] },
  referrer: String,
  referrerType: String,
  utm: { type: Schema.Types.Mixed },
  device: { type: Schema.Types.Mixed },
  geo: { type: Schema.Types.Mixed },
  isNewVisitor: { type: Boolean, default: false },
  isBot: { type: Boolean, default: false },
});

AnalyticsSessionSchema.index(
  { lastSeenAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 180 },
);
AnalyticsSessionSchema.index({ startedAt: 1 });
AnalyticsSessionSchema.index({ visitorId: 1, startedAt: 1 });
AnalyticsSessionSchema.index({ leadId: 1, startedAt: 1 });
AnalyticsSessionSchema.index({ isBot: 1, startedAt: 1 });

const AnalyticsSession = (mongoose.models.AnalyticsSession ||
  mongoose.model(
    "AnalyticsSession",
    AnalyticsSessionSchema as never,
  )) as unknown as mongoose.Model<IAnalyticsSession>;

export default AnalyticsSession;
