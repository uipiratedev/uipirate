import mongoose, { Schema, Document } from "mongoose";

/** A named group of marketing contacts, shared by Leads and Outreach. */
export interface IMarketingFolder extends Document {
  name: string;
  parentId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const MarketingFolderSchema = new Schema<IMarketingFolder>(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    parentId: { type: String, default: null, index: true },
  },
  { timestamps: true },
);

if (process.env.NODE_ENV !== "production") delete mongoose.models.MarketingFolder;

const MarketingFolder = (mongoose.models.MarketingFolder ||
  mongoose.model(
    "MarketingFolder",
    MarketingFolderSchema as never,
  )) as unknown as mongoose.Model<IMarketingFolder>;

export default MarketingFolder;
