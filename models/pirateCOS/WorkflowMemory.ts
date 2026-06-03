import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWorkflowMemory extends Document {
  /** References the Admin._id that owns this style profile — one doc per tenant */
  tenantId: mongoose.Types.ObjectId;
  preferredTone: string;
  sentenceComplexity: "simple" | "moderate" | "advanced";
  formattingRules: {
    alwaysIncludeTakeaways: boolean;
    alwaysIncludeFAQ: boolean;
    autoAppendCTA: boolean;
  };
  defaultCTA: string;
  learnedToneProfile?: string; // Analysis snapshot of user writing tone
  snippetLibrary?: string[];
  uiPreferences?: {
    panelWidth?: number;
    showHistory?: boolean;
    quickActionsOrder?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}


const WorkflowMemorySchema: Schema<IWorkflowMemory> = new Schema(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
      index: true,
      unique: true, // Strictly one style preference map per organizational tenant
    },
    preferredTone: {
      type: String,
      default: "Professional & Authoritative",
      trim: true,
    },
    sentenceComplexity: {
      type: String,
      enum: ["simple", "moderate", "advanced"],
      default: "moderate",
    },
    formattingRules: {
      alwaysIncludeTakeaways: {
        type: Boolean,
        default: false,
      },
      alwaysIncludeFAQ: {
        type: Boolean,
        default: false,
      },
      autoAppendCTA: {
        type: Boolean,
        default: false,
      },
    },
    defaultCTA: {
      type: String,
      default: "",
      trim: true,
    },
    learnedToneProfile: {
      type: String,
      default: "",
      trim: true,
    },
    snippetLibrary: {
      type: [String],
      default: [],
    },
    uiPreferences: {
      panelWidth: { type: Number, default: 288 },
      showHistory: { type: Boolean, default: true },
      quickActionsOrder: { type: [String], default: [] },
    },
  },
  {
    timestamps: true,
  },
);

const WorkflowMemory: Model<IWorkflowMemory> =
  (mongoose.models.WorkflowMemory as Model<IWorkflowMemory>) ||
  mongoose.model<IWorkflowMemory>("WorkflowMemory", WorkflowMemorySchema);

export default WorkflowMemory;
