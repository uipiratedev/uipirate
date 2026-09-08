import mongoose, { Schema, Document, Model } from "mongoose";

import { LEAD_STATUSES, noteFieldDef, type LeadStatus } from "@/models/Lead";
import type { ILeadNote } from "@/models/Lead";

export interface IEstimate extends Document {
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  projectTypes: string[];
  requirement: string;
  priorities: string[];
  budgetRange: string;
  timelineEstimate: string;
  isInvalidCombination: boolean;
  /** First-party analytics visitor cookie captured at submit time. */
  visitorId?: string;
  status: LeadStatus;
  assignedTo?: mongoose.Types.ObjectId;
  notes: ILeadNote[];
  createdAt: Date;
  updatedAt: Date;
}

const EstimateSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      trim: true,
    },
    countryCode: {
      type: String,
      required: true,
      default: "+91",
    },
    projectTypes: {
      type: [String],
      required: true,
      default: [],
    },
    requirement: {
      type: String,
      required: true,
      trim: true,
    },
    priorities: {
      type: [String],
      required: true,
      default: [],
    },
    budgetRange: {
      type: String,
      trim: true,
    },
    timelineEstimate: {
      type: String,
      trim: true,
    },
    isInvalidCombination: {
      type: Boolean,
      default: false,
    },
    visitorId: { type: String, index: true },
    status: { type: String, enum: LEAD_STATUSES, default: "new", index: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
    notes: [noteFieldDef],
  },
  {
    timestamps: true,
  },
);

const Estimate: Model<IEstimate> =
  mongoose.models.Estimate ||
  mongoose.model<IEstimate>("Estimate", EstimateSchema);

export default Estimate;
