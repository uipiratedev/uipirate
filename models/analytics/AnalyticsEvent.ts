import type {
  AnalyticsEventType,
  ClickElement,
  ReferrerType,
  Utm,
} from "@/lib/analytics/types";

import mongoose, { Schema, Document } from "mongoose";

/**
 * Append-only raw event stream. Everything else (sessions, visitors, daily
 * rollups) is derived from this. TTL 90 days — long enough for quarter-over-
 * quarter, short enough to keep the collection bounded.
 */
export interface IAnalyticsEvent extends Document {
  type: AnalyticsEventType;
  visitorId: string;
  sessionId: string;
  ipHash: string;
  leadId?: mongoose.Types.ObjectId;
  path: string;
  referrer?: string;
  referrerType?: ReferrerType;
  utm?: Utm;
  title?: string;
  lang?: string;
  element?: ClickElement;
  dwellMs?: number;
  scrollDepthMax?: number;
  formName?: string;
  device?: { type: string; os?: string; browser?: string };
  geo?: { country?: string; region?: string; city?: string };
  screen?: { w: number; h: number };
  viewport?: { w: number; h: number };
  isBot: boolean;
  /** client-reported event time */
  occurredAt: Date;
  createdAt: Date;
}

const AnalyticsEventSchema: Schema = new Schema(
  {
    type: {
      type: String,
      enum: ["page_view", "click", "page_close", "ping", "form_submit"],
      required: true,
    },
    visitorId: { type: String, required: true },
    sessionId: { type: String, required: true },
    ipHash: { type: String, required: true },
    leadId: { type: Schema.Types.ObjectId, ref: "Lead" },
    path: { type: String, required: true },
    referrer: String,
    referrerType: String,
    utm: { type: Schema.Types.Mixed },
    title: String,
    lang: String,
    element: { type: Schema.Types.Mixed },
    dwellMs: Number,
    scrollDepthMax: Number,
    formName: String,
    device: { type: Schema.Types.Mixed },
    geo: { type: Schema.Types.Mixed },
    screen: { w: Number, h: Number },
    viewport: { w: Number, h: Number },
    isBot: { type: Boolean, default: false },
    occurredAt: { type: Date, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

AnalyticsEventSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 90 },
);
AnalyticsEventSchema.index({ type: 1, occurredAt: 1 });
AnalyticsEventSchema.index({ path: 1, type: 1, occurredAt: 1 });
AnalyticsEventSchema.index({ visitorId: 1, occurredAt: 1 });
AnalyticsEventSchema.index({ sessionId: 1, occurredAt: 1 });
AnalyticsEventSchema.index({ leadId: 1, occurredAt: 1 });
AnalyticsEventSchema.index({ "element.analyticsId": 1 });

const AnalyticsEvent = (mongoose.models.AnalyticsEvent ||
  mongoose.model(
    "AnalyticsEvent",
    AnalyticsEventSchema as never,
  )) as unknown as mongoose.Model<IAnalyticsEvent>;

export default AnalyticsEvent;
