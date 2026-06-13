import mongoose, { Schema, Document, Model } from "mongoose";

export interface IApiKey extends Document {
  tenantId: mongoose.Types.ObjectId;
  name: string;
  /**
   * Non-secret, indexed lookup id embedded in the token (`uip_<keyId>_<secret>`).
   * Lets verifyApiKey find the candidate key in one indexed query instead of
   * scanning the whole collection. Sparse: legacy keys (uip_live_…) have none.
   */
  keyId?: string;
  keyHashEncrypted: string; // SHA-256 hash, AES-256 encrypted
  keyPrefix: string; // Prefix shown in UI (e.g. uip_a1b2c3d4e5f6...)
  /** Read-only only — the public API has no write surface. */
  scopes: "read"[];
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
    keyId: {
      type: String,
      index: true,
      sparse: true,
      unique: true,
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
      enum: ["read"],
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
