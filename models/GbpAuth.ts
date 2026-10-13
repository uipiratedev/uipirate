import mongoose, { Schema, Document } from "mongoose";

/**
 * The Google sign-in used for the Business Profile: one row, holding the
 * long-lived refresh token the owner granted. Revoke it any time from the
 * Google account's security page; "Disconnect" in the admin deletes it here.
 */
export interface IGbpAuth extends Document {
  key: "owner";
  refreshToken: string;
  /** Who granted access, for display only. */
  email?: string;
  createdAt: Date;
  updatedAt: Date;
}

const GbpAuthSchema: Schema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: "owner" },
    refreshToken: { type: String, required: true },
    email: String,
  },
  { timestamps: true },
);

const GbpAuth = (mongoose.models.GbpAuth ||
  mongoose.model("GbpAuth", GbpAuthSchema as never)) as unknown as mongoose.Model<IGbpAuth>;

export default GbpAuth;
