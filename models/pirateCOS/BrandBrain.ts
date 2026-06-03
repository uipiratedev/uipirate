import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBrandBrain extends Document {
  /** References the Admin._id that owns this profile — one doc per tenant */
  tenantId: mongoose.Types.ObjectId;
  companyName: string;
  brandVoice: string;
  products: string;
  audienceICP: string;
  targetKeywords: string[];
  forbiddenWords: string[];
  callToActionTemplate?: string;
  presetInstructions?: Map<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

const BrandBrainSchema: Schema<IBrandBrain> = new Schema(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
      index: true,
      unique: true, // Guarantees strictly one Brand Brain profile per organization tenant
    },
    companyName: {
      type: String,
      required: [true, "Please provide a company name"],
      trim: true,
    },
    brandVoice: {
      type: String,
      required: [true, "Please select or describe a brand voice / tone"],
      trim: true,
    },
    products: {
      type: String,
      required: [
        true,
        "Please describe your primary products, services, or offerings",
      ],
      trim: true,
    },
    audienceICP: {
      type: String,
      required: [
        true,
        "Please outline your target ideal customer profile (ICP) and paint points",
      ],
      trim: true,
    },
    targetKeywords: {
      type: [String],
      default: [],
    },
    forbiddenWords: {
      type: [String],
      default: [],
    },
    callToActionTemplate: {
      type: String,
      default: "",
      trim: true,
    },
    presetInstructions: {
      type: Map,
      of: String,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

const BrandBrain: Model<IBrandBrain> =
  (mongoose.models.BrandBrain as Model<IBrandBrain>) ||
  mongoose.model<IBrandBrain>("BrandBrain", BrandBrainSchema);

export default BrandBrain;
