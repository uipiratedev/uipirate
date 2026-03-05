import mongoose, { Schema, Document, Model } from "mongoose";

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
  },
  {
    timestamps: true,
  }
);

const Estimate: Model<IEstimate> =
  mongoose.models.Estimate || mongoose.model<IEstimate>("Estimate", EstimateSchema);

export default Estimate;
