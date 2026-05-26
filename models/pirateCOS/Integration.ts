import mongoose, { Schema, Document, Model } from "mongoose";

export type SupportedPlatform = "wordpress" | "medium" | "ghost" | "buffer" | "linkedin";

export interface IPlatformCredentials {
  // WordPress
  siteUrl?: string;
  wpUsername?: string;
  wpAppPasswordEncrypted?: string;

  // Medium
  mediumTokenEncrypted?: string;
  mediumAuthorId?: string;

  // Ghost
  ghostSiteUrl?: string;
  ghostAdminKeyEncrypted?: string;

  // Buffer
  bufferAccessTokenEncrypted?: string;
  bufferProfileIds?: string[];

  // LinkedIn
  linkedinTokenEncrypted?: string;
  linkedinUserId?: string;
  linkedinPreferArticles?: boolean;
}

export interface IIntegration extends Document {
  tenantId: mongoose.Types.ObjectId;
  platform: SupportedPlatform;
  credentials: IPlatformCredentials;
  isActive: boolean;
  lastTestedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const IntegrationSchema: Schema<IIntegration> = new Schema(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
      index: true,
    },
    platform: {
      type: String,
      enum: ["wordpress", "medium", "ghost", "buffer", "linkedin"],
      required: true,
    },
    credentials: {
      type: {
        // WordPress
        siteUrl: { type: String, trim: true },
        wpUsername: { type: String, trim: true },
        wpAppPasswordEncrypted: { type: String, default: null },

        // Medium
        mediumTokenEncrypted: { type: String, default: null },
        mediumAuthorId: { type: String, trim: true },

        // Ghost
        ghostSiteUrl: { type: String, trim: true },
        ghostAdminKeyEncrypted: { type: String, default: null },

        // Buffer
        bufferAccessTokenEncrypted: { type: String, default: null },
        bufferProfileIds: { type: [String], default: [] },

        // LinkedIn
        linkedinTokenEncrypted: { type: String, default: null },
        linkedinUserId: { type: String, trim: true },
        linkedinPreferArticles: { type: Boolean, default: true },
      },
      required: true,
      default: {},
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    lastTestedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

// Ensure there is at most one integration record per platform per tenant
IntegrationSchema.index({ tenantId: 1, platform: 1 }, { unique: true });

const Integration: Model<IIntegration> =
  (mongoose.models.Integration as Model<IIntegration>) ||
  mongoose.model<IIntegration>("Integration", IntegrationSchema);

export default Integration;
