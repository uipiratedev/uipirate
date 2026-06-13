import mongoose, { Schema, Document, Model } from "mongoose";

// Phase 5.4: Workspace model for team management
export interface IWorkspace extends Document {
  owner: string; // Email of the owner (from session.user.email)
  name: string;
  description?: string;
  brandBrain: mongoose.Types.ObjectId; // References BrandBrain
  tenantId: mongoose.Types.ObjectId; // References Admin (the tenant)
  createdAt: Date;
  updatedAt: Date;
}

const WorkspaceSchema: Schema<IWorkspace> = new Schema(
  {
    owner: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    brandBrain: {
      type: Schema.Types.ObjectId,
      ref: "BrandBrain",
    },
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Workspace: Model<IWorkspace> =
  (mongoose.models.Workspace as Model<IWorkspace>) ||
  mongoose.model<IWorkspace>("Workspace", WorkspaceSchema);

export default Workspace;
