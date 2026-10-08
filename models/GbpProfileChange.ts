import mongoose, { Schema, Document } from "mongoose";

/** The value a profile field had before an admin changed it, so it can be put back. */
export interface IGbpProfileChange extends Document {
  field: "services" | "description" | "links";
  before: unknown;
  after: unknown;
  by?: string;
  createdAt: Date;
}

const GbpProfileChangeSchema: Schema = new Schema(
  {
    field: { type: String, enum: ["services", "description", "links"], required: true },
    before: {},
    after: {},
    by: String,
  } as never,
  { timestamps: { createdAt: true, updatedAt: false } },
);

const GbpProfileChange = (mongoose.models.GbpProfileChange ||
  mongoose.model("GbpProfileChange", GbpProfileChangeSchema as never)) as unknown as mongoose.Model<IGbpProfileChange>;

export default GbpProfileChange;
