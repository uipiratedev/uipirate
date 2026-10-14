import mongoose, { Schema, Document } from "mongoose";

import { noteFieldDef, type ILeadNote } from "./Lead";

import {
  MARKETING_STATUSES,
  WEBSITE_STATES,
  type MarketingStatus,
  WebsiteState,
} from "@/lib/marketing/constants";

/**
 * Outreach contacts imported from an uploaded sheet. Separate from `Lead`
 * (inbound form submissions) so cold lists never pollute the leads inbox.
 */
export interface IMarketingContact extends Document {
  name: string;
  phone?: string;
  email?: string;
  company?: string;
  category?: string;
  city?: string;
  state?: string;
  website?: string;
  pitch?: string;
  hasWebsite: string;
  /** True once the contact was explicitly sent to Outreach. */
  inOutreach: boolean;
  /** Any extra sheet columns, kept verbatim. */
  extra?: Record<string, string>;
  batch: string;
  /** Owning MarketingFolder id; unset for contacts uploaded before folders. */
  folder?: string;
  status: MarketingStatus;
  callCount: number;
  lastCalledAt?: Date;
  /** Drafted WhatsApp message; {{name}} / {{city}} are filled in on send. */
  whatsappDraft?: string;
  whatsappCount: number;
  lastWhatsappAt?: Date;
  emailCount: number;
  lastEmailAt?: Date;
  /** Drafted Email subject; placeholders like {{name}} are filled in on send. */
  emailSubjectDraft?: string;
  /** Drafted Email body; placeholders like {{name}} / {{website}} are filled in on send. */
  emailDraft?: string;
  /** Chronological log of every call / WhatsApp / email attempt. */
  touches: Array<{
    channel: "call" | "whatsapp" | "email";
    at: Date;
    byName?: string;
    /** The exact message text that was sent (WhatsApp or Email). */
    message?: string;
  }>;
  notes: ILeadNote[];
  /** Log of status / website / outreach / draft changes (calls, messages and
   *  notes live in `touches` / `notes`). */
  activities: Array<{
    type: "status" | "website" | "outreach" | "draft";
    at: Date;
    byName?: string;
    summary: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const MarketingContactSchema = new Schema<IMarketingContact>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, trim: true, index: true },
    email: { type: String, trim: true, lowercase: true },
    company: { type: String, trim: true },
    category: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    website: { type: String, trim: true },
    pitch: { type: String, trim: true },
    hasWebsite: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },
    inOutreach: { type: Boolean, default: false, index: true },
    extra: { type: Schema.Types.Mixed },
    batch: { type: String, required: true, index: true },
    folder: { type: String, index: true },
    status: {
      type: String,
      enum: MARKETING_STATUSES,
      default: "new",
      index: true,
    },
    callCount: { type: Number, default: 0 },
    lastCalledAt: { type: Date },
    whatsappDraft: { type: String, trim: true },
    whatsappCount: { type: Number, default: 0 },
    lastWhatsappAt: { type: Date },
    emailCount: { type: Number, default: 0 },
    lastEmailAt: { type: Date },
    emailSubjectDraft: { type: String, trim: true },
    emailDraft: { type: String, trim: true },
    touches: [
      {
        channel: {
          type: String,
          enum: ["call", "whatsapp", "email"],
          required: true,
        },
        at: { type: Date, default: Date.now },
        byName: String,
        message: String,
      },
    ],
    notes: [noteFieldDef],
    activities: [
      {
        type: {
          type: String,
          enum: ["status", "website", "outreach", "draft"],
          required: true,
        },
        at: { type: Date, default: Date.now },
        byName: String,
        summary: { type: String, required: true },
      },
    ],
  },
  { timestamps: true },
);

MarketingContactSchema.index({ createdAt: -1 });

// In dev, hot reload keeps the first compiled model, so schema changes (new
// fields) would be silently dropped on save. Recompile outside production.
if (process.env.NODE_ENV !== "production")
  delete mongoose.models.MarketingContact;

// Cast-through avoids TS2590 on the generic model overload (see models/Lead.ts).
const MarketingContact = (mongoose.models.MarketingContact ||
  mongoose.model(
    "MarketingContact",
    MarketingContactSchema as never,
  )) as unknown as mongoose.Model<IMarketingContact>;

export default MarketingContact;
