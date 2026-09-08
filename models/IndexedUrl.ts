import mongoose, { Schema, Document } from "mongoose";

export interface IndexEvent {
  ts: Date;
  source: "google" | "bing" | "indexnow" | "sitemap-sync" | "cron";
  action: "submit" | "inspect" | "status-change" | "publish-hook";
  result: string;
  actorId?: string;
}

export interface GoogleIndexData {
  submittedAt: Date | null;
  lastResponseCode: number | null;
  coverageState: string | null;
  indexingState: string | null;
  verdict: "PASS" | "PARTIAL" | "FAIL" | "NEUTRAL" | null;
  robotsTxtState: string | null;
  lastCrawlTime: Date | null;
  googleCanonical: string | null;
  userCanonical: string | null;
  lastInspectedAt: Date | null;
  lastError: string | null;
}

export interface BingIndexData {
  submittedAt: Date | null;
  lastResponseCode: number | null;
  indexed: boolean | null;
  lastCrawlTime: Date | null;
  lastInspectedAt: Date | null;
  lastError: string | null;
}

export interface IndexNowData {
  submittedAt: Date | null;
  statusCode: number | null;
}

export interface IIndexedUrl extends Document {
  url: string; // unique absolute canonical URL
  path: string; // relative path e.g. "/case-studies/xperiti"
  type: "page" | "case-study" | "blog" | "tool" | "bot";
  inSitemap: boolean;
  isDraft: boolean;
  noindexIntentional: boolean;
  google: GoogleIndexData;
  bing: BingIndexData;
  indexnow: IndexNowData;
  history: IndexEvent[];
  createdAt: Date;
  updatedAt: Date;
}

const IndexEventSchema = new Schema<IndexEvent>(
  {
    ts: { type: Date, default: Date.now },
    source: {
      type: String,
      enum: ["google", "bing", "indexnow", "sitemap-sync", "cron"],
      required: true,
    },
    action: {
      type: String,
      enum: ["submit", "inspect", "status-change", "publish-hook"],
      required: true,
    },
    result: { type: String, required: true },
    actorId: { type: String },
  },
  { _id: false },
);

const IndexedUrlSchema = new Schema<IIndexedUrl>(
  {
    url: { type: String, required: true, unique: true, trim: true, index: true },
    path: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["page", "case-study", "blog", "tool", "bot"],
      default: "page",
    },
    inSitemap: { type: Boolean, default: true, index: true },
    isDraft: { type: Boolean, default: false, index: true },
    noindexIntentional: { type: Boolean, default: false },

    google: {
      submittedAt: { type: Date, default: null },
      lastResponseCode: { type: Number, default: null },
      coverageState: { type: String, default: null, index: true },
      indexingState: { type: String, default: null },
      verdict: {
        type: String,
        enum: ["PASS", "PARTIAL", "FAIL", "NEUTRAL", null],
        default: null,
      },
      robotsTxtState: { type: String, default: null },
      lastCrawlTime: { type: Date, default: null },
      googleCanonical: { type: String, default: null },
      userCanonical: { type: String, default: null },
      lastInspectedAt: { type: Date, default: null },
      lastError: { type: String, default: null },
    },

    bing: {
      submittedAt: { type: Date, default: null },
      lastResponseCode: { type: Number, default: null },
      indexed: { type: Boolean, default: null },
      lastCrawlTime: { type: Date, default: null },
      lastInspectedAt: { type: Date, default: null },
      lastError: { type: String, default: null },
    },

    indexnow: {
      submittedAt: { type: Date, default: null },
      statusCode: { type: Number, default: null },
    },

    history: { type: [IndexEventSchema], default: [] },
  },
  { timestamps: true, collection: "indexedUrls" },
);

IndexedUrlSchema.index({ "google.coverageState": 1 });
IndexedUrlSchema.index({ isDraft: 1, inSitemap: 1 });
IndexedUrlSchema.index({ updatedAt: -1 });

const IndexedUrl =
  (mongoose.models.IndexedUrl as mongoose.Model<IIndexedUrl>) ||
  mongoose.model<IIndexedUrl>("IndexedUrl", IndexedUrlSchema);

export default IndexedUrl;
