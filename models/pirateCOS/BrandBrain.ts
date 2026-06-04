import mongoose, { Schema, Document, Model } from "mongoose";

// Phase 4F.1: Team Brain structure for optional team-level overrides
export interface ITeamBrain {
  teamName: string;
  teamDescription?: string;
  brandVoice?: string; // Overrides workspace-level
  products?: string; // Overrides workspace-level
  audienceICP?: string; // Overrides workspace-level
  targetKeywords?: string[]; // Appends to workspace-level
  forbiddenWords?: string[]; // Appends to workspace-level
  callToActionTemplate?: string; // Overrides workspace-level
}

export interface IBrandBrain extends Document {
  /** References the Admin._id that owns this profile — one doc per tenant */
  tenantId: mongoose.Types.ObjectId;

  // Phase 4F.1: Workspace Brain architecture
  workspaceType: "individual" | "team";
  workspaceName?: string; // e.g., "Vishal Anand" or "Acme Corp Marketing"
  workspaceDescription?: string;

  // Workspace-level properties (apply to all content unless overridden)
  companyName: string;
  brandVoice: string;
  products: string;
  audienceICP: string;
  targetKeywords: string[];
  forbiddenWords: string[];
  callToActionTemplate?: string;
  presetInstructions?: Map<string, string>;
  sentenceComplexity?: "simple" | "moderate" | "advanced";
  formattingRules?: {
    alwaysIncludeTakeaways: boolean;
    alwaysIncludeFAQ: boolean;
    autoAppendCTA: boolean;
  };

  // Phase 4F.1: Team Brains (optional, only for workspaceType: "team")
  teamBrains?: ITeamBrain[];

  createdAt: Date;
  updatedAt: Date;
}

// Phase 4F.1: Team Brain sub-schema
const TeamBrainSchema = new Schema({
  teamName: {
    type: String,
    required: true,
    trim: true,
  },
  teamDescription: {
    type: String,
    trim: true,
  },
  brandVoice: {
    type: String,
    trim: true,
  },
  products: {
    type: String,
    trim: true,
  },
  audienceICP: {
    type: String,
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
    trim: true,
  },
}, { _id: true }); // Enable _id for each team brain

const BrandBrainSchema: Schema<IBrandBrain> = new Schema(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
      index: true,
      unique: true, // Guarantees strictly one Brand Brain profile per organization tenant
    },
    // Phase 4F.1: Workspace Brain architecture
    workspaceType: {
      type: String,
      enum: ["individual", "team"],
      default: "individual",
      required: true,
    },
    workspaceName: {
      type: String,
      trim: true,
    },
    workspaceDescription: {
      type: String,
      trim: true,
    },
    // Workspace-level properties
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
    // Phase 4F.1: Team Brains array
    teamBrains: {
      type: [TeamBrainSchema],
      default: [],
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
