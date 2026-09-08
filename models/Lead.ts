import mongoose, { Schema, Document } from "mongoose";

import { LEAD_STATUSES, type LeadStatus } from "@/lib/leads/constants";

/**
 * Contact-form leads. Promoted out of the inline schema that used to live in
 * app/api/leads/route.ts so the dashboard has a stable model to query and
 * annotate (status / assignee / notes) and so visits can be stitched to a lead.
 */
export { LEAD_STATUSES };
export type { LeadStatus };

export interface ILeadNote {
  by: mongoose.Types.ObjectId;
  byName?: string;
  at: Date;
  text: string;
}

/**
 * Shared note field definition — reused by Estimate. A plain definition object
 * (not a `new Schema(...)` instance) keeps TS's schema-inference union small.
 */
export const noteFieldDef = {
  by: { type: Schema.Types.ObjectId, ref: "User", required: true },
  byName: String,
  at: { type: Date, default: Date.now },
  text: { type: String, required: true, trim: true },
} as const;

export interface ILead extends Document {
  name: string;
  email: string;
  company?: string;
  budget?: string;
  projectType?: string;
  message?: string;
  source: string;
  /** First-party analytics visitor cookie captured at submit time. */
  visitorId?: string;
  status: LeadStatus;
  assignedTo?: mongoose.Types.ObjectId;
  notes: ILeadNote[];
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    company: { type: String, trim: true },
    budget: { type: String },
    projectType: { type: String },
    message: { type: String, trim: true },
    source: { type: String, default: "contact-form" },
    visitorId: { type: String, index: true },
    status: { type: String, enum: LEAD_STATUSES, default: "new", index: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
    notes: [noteFieldDef],
  },
  { timestamps: true },
);

LeadSchema.index({ createdAt: -1 });

const Lead =
  (mongoose.models.Lead as mongoose.Model<ILead>) ||
  mongoose.model<ILead>("Lead", LeadSchema);

export default Lead;
