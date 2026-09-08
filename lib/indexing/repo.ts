import dbConnect from "@/lib/mongodb";
import IndexedUrl, {
  type IIndexedUrl,
  type IndexEvent,
  type GoogleIndexData,
  type BingIndexData,
} from "@/models/IndexedUrl";
import { type IndexedUrlItem } from "./types";

export function formatIndexedUrlDoc(doc: any): IndexedUrlItem {
  return {
    id: String(doc._id),
    url: doc.url,
    path: doc.path,
    type: doc.type || "page",
    inSitemap: Boolean(doc.inSitemap),
    isDraft: Boolean(doc.isDraft),
    noindexIntentional: Boolean(doc.noindexIntentional),
    google: {
      submittedAt: doc.google?.submittedAt
        ? new Date(doc.google.submittedAt).toISOString()
        : null,
      lastResponseCode: doc.google?.lastResponseCode ?? null,
      coverageState: doc.google?.coverageState ?? null,
      indexingState: doc.google?.indexingState ?? null,
      verdict: doc.google?.verdict ?? null,
      robotsTxtState: doc.google?.robotsTxtState ?? null,
      lastCrawlTime: doc.google?.lastCrawlTime
        ? new Date(doc.google.lastCrawlTime).toISOString()
        : null,
      googleCanonical: doc.google?.googleCanonical ?? null,
      userCanonical: doc.google?.userCanonical ?? null,
      lastInspectedAt: doc.google?.lastInspectedAt
        ? new Date(doc.google.lastInspectedAt).toISOString()
        : null,
      lastError: doc.google?.lastError ?? null,
    },
    bing: {
      submittedAt: doc.bing?.submittedAt
        ? new Date(doc.bing.submittedAt).toISOString()
        : null,
      lastResponseCode: doc.bing?.lastResponseCode ?? null,
      indexed: doc.bing?.indexed ?? null,
      lastCrawlTime: doc.bing?.lastCrawlTime
        ? new Date(doc.bing.lastCrawlTime).toISOString()
        : null,
      lastInspectedAt: doc.bing?.lastInspectedAt
        ? new Date(doc.bing.lastInspectedAt).toISOString()
        : null,
      lastError: doc.bing?.lastError ?? null,
    },
    indexnow: {
      submittedAt: doc.indexnow?.submittedAt
        ? new Date(doc.indexnow.submittedAt).toISOString()
        : null,
      statusCode: doc.indexnow?.statusCode ?? null,
    },
    history: (doc.history || []).map((h: any) => ({
      ts: h.ts ? new Date(h.ts).toISOString() : new Date().toISOString(),
      source: h.source,
      action: h.action,
      result: h.result,
      actorId: h.actorId,
    })),
    createdAt: doc.createdAt
      ? new Date(doc.createdAt).toISOString()
      : new Date().toISOString(),
    updatedAt: doc.updatedAt
      ? new Date(doc.updatedAt).toISOString()
      : new Date().toISOString(),
  };
}

/**
 * Pushes an event to the URL's history array, capping the total history to 50 items.
 */
export async function pushHistory(
  url: string,
  event: IndexEvent,
): Promise<void> {
  await dbConnect();
  await IndexedUrl.updateOne(
    { url },
    {
      $push: {
        history: {
          $each: [event],
          $position: 0,
          $slice: 50,
        },
      },
    },
  );
}

export interface ListIndexedUrlsParams {
  q?: string;
  engine?: string; // "all" | "google" | "bing"
  status?: string; // "all" | "indexed" | "crawled_not_indexed" | "discovered" | "excluded" | "unsubmitted" | "error"
  type?: string; // "all" | "page" | "case-study" | "blog" | "tool" | "bot"
  inSitemap?: string; // "all" | "yes" | "no"
  isDraft?: string; // "all" | "yes" | "no"
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

export async function listIndexedUrls(params: ListIndexedUrlsParams) {
  await dbConnect();

  const page = Math.max(1, Number(params.page) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(params.pageSize) || 25));
  const filter: Record<string, any> = {};

  if (params.q?.trim()) {
    const regex = new RegExp(params.q.trim(), "i");
    filter.$or = [{ url: regex }, { path: regex }];
  }

  if (params.type && params.type !== "all") {
    filter.type = params.type;
  }

  if (params.inSitemap === "yes") filter.inSitemap = true;
  if (params.inSitemap === "no") filter.inSitemap = false;

  if (params.isDraft === "yes") filter.isDraft = true;
  if (params.isDraft === "no") filter.isDraft = false;

  if (params.status && params.status !== "all") {
    switch (params.status) {
      case "indexed":
        filter.$or = [
          { "google.verdict": "PASS" },
          { "google.coverageState": { $regex: /indexed/i } },
          { "bing.indexed": true },
        ];
        break;
      case "crawled_not_indexed":
        filter["google.coverageState"] = { $regex: /crawled.*not indexed/i };
        break;
      case "discovered":
        filter["google.coverageState"] = { $regex: /discovered.*not indexed/i };
        break;
      case "excluded":
        filter.$or = [
          { "google.coverageState": { $regex: /excluded|noindex|duplicate/i } },
          { noindexIntentional: true },
        ];
        break;
      case "unsubmitted":
        filter["google.submittedAt"] = null;
        filter["bing.submittedAt"] = null;
        break;
      case "error":
        filter.$or = [
          { "google.lastError": { $ne: null } },
          { "bing.lastError": { $ne: null } },
          { "google.verdict": "FAIL" },
          { "google.coverageState": { $regex: /404|blocked|robot/i } },
        ];
        break;
    }
  }

  const sort: Record<string, 1 | -1> = {};
  const sortDir = params.sortDir === "asc" ? 1 : -1;

  if (params.sortBy === "url") sort.url = sortDir;
  else if (params.sortBy === "type") sort.type = sortDir;
  else if (params.sortBy === "googleCoverage") sort["google.coverageState"] = sortDir;
  else if (params.sortBy === "bingStatus") sort["bing.indexed"] = sortDir;
  else if (params.sortBy === "updatedAt") sort.updatedAt = sortDir;
  else sort.updatedAt = -1;

  const [rows, total] = await Promise.all([
    IndexedUrl.find(filter)
      .sort(sort)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean<any[]>(),
    IndexedUrl.countDocuments(filter),
  ]);

  return {
    rows: rows.map(formatIndexedUrlDoc),
    total,
    page,
    pageSize,
  };
}

export async function getIndexedUrlById(
  id: string,
): Promise<IndexedUrlItem | null> {
  await dbConnect();
  const doc = await IndexedUrl.findById(id).lean<any>();
  return doc ? formatIndexedUrlDoc(doc) : null;
}

export async function toggleIntentionalNoindex(
  id: string,
  noindexIntentional: boolean,
): Promise<IndexedUrlItem | null> {
  await dbConnect();
  const doc = await IndexedUrl.findByIdAndUpdate(
    id,
    { $set: { noindexIntentional } },
    { new: true },
  ).lean<any>();

  return doc ? formatIndexedUrlDoc(doc) : null;
}

export async function getIndexingKpis() {
  await dbConnect();

  const total = await IndexedUrl.countDocuments();
  if (total === 0) {
    return {
      total: 0,
      googleIndexedPct: 0,
      bingIndexedPct: 0,
      unsubmittedCount: 0,
      errorCount: 0,
    };
  }

  const [
    googleIndexed,
    bingIndexed,
    unsubmitted,
    errors,
  ] = await Promise.all([
    IndexedUrl.countDocuments({
      $or: [
        { "google.verdict": "PASS" },
        { "google.coverageState": { $regex: /indexed/i, $not: /not indexed/i } },
      ],
    }),
    IndexedUrl.countDocuments({ "bing.indexed": true }),
    IndexedUrl.countDocuments({
      "google.submittedAt": null,
      "bing.submittedAt": null,
      isDraft: false,
    }),
    IndexedUrl.countDocuments({
      $or: [
        { "google.verdict": "FAIL" },
        { "google.lastError": { $ne: null } },
        { "google.coverageState": { $regex: /404|blocked|robot/i } },
      ],
    }),
  ]);

  return {
    total,
    googleIndexedCount: googleIndexed,
    googleIndexedPct: Math.round((googleIndexed / total) * 100),
    bingIndexedCount: bingIndexed,
    bingIndexedPct: Math.round((bingIndexed / total) * 100),
    unsubmittedCount: unsubmitted,
    errorCount: errors,
  };
}
