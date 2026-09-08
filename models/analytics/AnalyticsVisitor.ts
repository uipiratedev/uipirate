import type { ReferrerType, Utm } from "@/lib/analytics/types";

import mongoose, { Schema, Document } from "mongoose";

/**
 * Lifetime rollup, one per visitorId. Holds no PII until a form submit stitches
 * it to a Lead (identifiedAt / identifiedEmail / leadId). Not TTL'd — but a
 * visitor with no lead is just an opaque UUID.
 */
export interface IAnalyticsVisitor extends Document {
  visitorId: string;
  leadId?: mongoose.Types.ObjectId;
  identifiedAt?: Date;
  identifiedEmail?: string;
  firstSeenAt: Date;
  lastSeenAt: Date;
  sessionCount: number;
  pageViewCount: number;
  clickCount: number;
  totalDurationMs: number;
  firstReferrer?: string;
  firstReferrerType?: ReferrerType;
  firstUtm?: Utm;
  firstLandingPath?: string;
  lastGeo?: { country?: string; region?: string; city?: string };
  lastDevice?: { type: string; os?: string; browser?: string };
  isBot: boolean;
}

const AnalyticsVisitorSchema: Schema = new Schema({
  visitorId: { type: String, required: true, unique: true },
  leadId: { type: Schema.Types.ObjectId, ref: "Lead" },
  identifiedAt: Date,
  identifiedEmail: String,
  firstSeenAt: { type: Date, required: true },
  lastSeenAt: { type: Date, required: true },
  sessionCount: { type: Number, default: 0 },
  pageViewCount: { type: Number, default: 0 },
  clickCount: { type: Number, default: 0 },
  totalDurationMs: { type: Number, default: 0 },
  firstReferrer: String,
  firstReferrerType: String,
  firstUtm: { type: Schema.Types.Mixed },
  firstLandingPath: String,
  lastGeo: { type: Schema.Types.Mixed },
  lastDevice: { type: Schema.Types.Mixed },
  isBot: { type: Boolean, default: false },
});

AnalyticsVisitorSchema.index({ lastSeenAt: 1 });
AnalyticsVisitorSchema.index({ leadId: 1 });
AnalyticsVisitorSchema.index({ identifiedAt: 1 });
AnalyticsVisitorSchema.index({ isBot: 1, lastSeenAt: 1 });

const AnalyticsVisitor = (mongoose.models.AnalyticsVisitor ||
  mongoose.model(
    "AnalyticsVisitor",
    AnalyticsVisitorSchema as never,
  )) as unknown as mongoose.Model<IAnalyticsVisitor>;

export default AnalyticsVisitor;
