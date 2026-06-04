import mongoose, { Schema, Document, Model } from "mongoose";

// Phase 5.4: Team model for collaborative workspaces
export interface ITeam extends Document {
  name: string;
  description?: string;
  workspace: mongoose.Types.ObjectId; // References Workspace
  brandVoiceOverride?: string; // Overrides workspace brand voice
  keywordsOverride?: string[]; // Additional keywords for this team
  members: Array<{
    userId: string; // Email of the user
    role: "admin" | "editor" | "viewer";
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const TeamSchema: Schema<ITeam> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true,
    },
    brandVoiceOverride: {
      type: String,
      trim: true,
    },
    keywordsOverride: {
      type: [String],
      default: [],
    },
    members: [
      {
        userId: {
          type: String,
          required: true,
        },
        role: {
          type: String,
          enum: ["admin", "editor", "viewer"],
          default: "editor",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Team: Model<ITeam> =
  (mongoose.models.Team as Model<ITeam>) ||
  mongoose.model<ITeam>("Team", TeamSchema);

export default Team;
