import mongoose, { Schema, Document, Model } from "mongoose";

export interface IApiKey extends Document {
  tenantId: mongoose.Types.ObjectId;
  name: string;
  keyHashEncrypted: string; // SHA-256 hash, AES-256 encrypted
  keyPrefix: string; // Prefix shown in UI (e.g. uip_live_abcdef12)
  scopes: ("read" | "write")[];
  lastUsedAt?: Date;
  expiresAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ApiKeySchema: Schema<IApiKey> = new Schema(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    keyHashEncrypted: {
      type: String,
      required: true,
    },
    keyPrefix: {
      type: String,
      required: true,
    },
    scopes: {
      type: [String],
      enum: ["read", "write"],
      default: ["read"],
    },
    lastUsedAt: {
      type: Date,
      default: null,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true },
);

const ApiKey: Model<IApiKey> =
  (mongoose.models.ApiKey as Model<IApiKey>) ||
  mongoose.model<IApiKey>("ApiKey", ApiKeySchema);

export default ApiKey;
