export type IndexSource = "google" | "bing" | "indexnow" | "sitemap-sync" | "cron";
export type IndexAction = "submit" | "inspect" | "status-change" | "publish-hook";
export type QuotaProvider = "google-indexing" | "google-inspection" | "bing-submit";

export interface IndexHistoryItem {
  ts: string;
  source: IndexSource;
  action: IndexAction;
  result: string;
  actorId?: string;
}

export interface IndexedUrlItem {
  id: string;
  url: string;
  path: string;
  type: "page" | "case-study" | "blog" | "tool" | "bot";
  inSitemap: boolean;
  isDraft: boolean;
  noindexIntentional: boolean;
  google: {
    submittedAt: string | null;
    lastResponseCode: number | null;
    coverageState: string | null;
    indexingState: string | null;
    verdict: "PASS" | "PARTIAL" | "FAIL" | "NEUTRAL" | null;
    robotsTxtState: string | null;
    lastCrawlTime: string | null;
    googleCanonical: string | null;
    userCanonical: string | null;
    lastInspectedAt: string | null;
    lastError: string | null;
  };
  bing: {
    submittedAt: string | null;
    lastResponseCode: number | null;
    indexed: boolean | null;
    lastCrawlTime: string | null;
    lastInspectedAt: string | null;
    lastError: string | null;
  };
  indexnow: {
    submittedAt: string | null;
    statusCode: number | null;
  };
  history: IndexHistoryItem[];
  createdAt: string;
  updatedAt: string;
}

export interface QuotaSummary {
  provider: QuotaProvider;
  date: string;
  used: number;
  limit: number;
  remaining: number;
}
