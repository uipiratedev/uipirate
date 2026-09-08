import dbConnect from "@/lib/mongodb";
import IndexedUrl from "@/models/IndexedUrl";
import sitemap from "@/app/sitemap";
import { isPublishable, extractPath, HELD_DRAFT_SLUGS } from "./publishable";
import { pushHistory } from "./repo";

export interface SitemapSyncResult {
  totalInSitemap: number;
  newlyAdded: number;
  updated: number;
  removedFromSitemap: number;
  draftsHeld: number;
}

function classifyPathType(
  path: string,
): "page" | "case-study" | "blog" | "tool" | "bot" {
  if (path.startsWith("/case-studies/")) return "case-study";
  if (path.startsWith("/tools/ai/bot-directory/")) return "bot";
  if (path.startsWith("/tools/")) return "tool";
  if (
    path.startsWith("/services/") ||
    path.startsWith("/apps4sale/") ||
    [
      "/",
      "/about",
      "/process",
      "/pricing",
      "/contact",
      "/faqs",
      "/sitemap",
      "/componentlab",
      "/privacy",
      "/terms",
      "/tools",
      "/case-studies",
      "/blogs",
      "/apps4sale",
    ].includes(path)
  ) {
    return "page";
  }
  return "blog";
}

/**
 * Reconciles the dynamically generated sitemap with MongoDB's indexedUrls collection.
 * - Upserts all live pages from sitemap.ts
 * - Flags unlisted/orphan URLs
 * - Tracks held draft case studies separately with isDraft=true, inSitemap=false
 */
export async function reconcileSitemap(
  actorId?: string,
): Promise<SitemapSyncResult> {
  await dbConnect();

  // 1. Fetch current sitemap entries
  const entries = await sitemap();
  const sitemapUrlMap = new Map<string, string>(); // url -> path

  for (const entry of entries) {
    const url = entry.url;
    const path = extractPath(url);
    sitemapUrlMap.set(url, path);
  }

  let newlyAdded = 0;
  let updated = 0;
  let draftsHeld = 0;

  // 2. Upsert sitemap URLs into DB
  for (const [url, path] of sitemapUrlMap.entries()) {
    const pubCheck = await isPublishable(path);
    const type = classifyPathType(path);
    const isDraft = !pubCheck.publishable || pubCheck.isDraft;

    const existing = await IndexedUrl.findOne({ url });

    if (!existing) {
      await IndexedUrl.create({
        url,
        path,
        type,
        inSitemap: true,
        isDraft,
        noindexIntentional: false,
        google: {
          submittedAt: null,
          lastResponseCode: null,
          coverageState: null,
          indexingState: null,
          verdict: null,
          robotsTxtState: null,
          lastCrawlTime: null,
          googleCanonical: null,
          userCanonical: url,
          lastInspectedAt: null,
          lastError: null,
        },
        bing: {
          submittedAt: null,
          lastResponseCode: null,
          indexed: null,
          lastCrawlTime: null,
          lastInspectedAt: null,
          lastError: null,
        },
        indexnow: {
          submittedAt: null,
          statusCode: null,
        },
        history: [
          {
            ts: new Date(),
            source: "sitemap-sync",
            action: "submit",
            result: isDraft ? "Tracked as draft (excluded from indexing)" : "Discovered in sitemap",
            actorId,
          },
        ],
      });
      newlyAdded++;
    } else {
      let needsSave = false;
      if (!existing.inSitemap) {
        existing.inSitemap = true;
        needsSave = true;
      }
      if (existing.isDraft !== isDraft) {
        existing.isDraft = isDraft;
        needsSave = true;
      }
      if (existing.type !== type) {
        existing.type = type;
        needsSave = true;
      }

      if (needsSave) {
        await existing.save();
        updated++;
      }
    }
  }

  // 3. Ensure held draft case studies are tracked as drafts
  const baseUrl = process.env.SITE_ORIGIN || "https://uipirate.dev";
  for (const draftSlug of HELD_DRAFT_SLUGS) {
    const draftPath = `/case-studies/${draftSlug}`;
    const draftUrl = `${baseUrl}${draftPath}`;
    draftsHeld++;

    const existingDraft = await IndexedUrl.findOne({
      $or: [{ url: draftUrl }, { path: draftPath }],
    });

    if (!existingDraft) {
      await IndexedUrl.create({
        url: draftUrl,
        path: draftPath,
        type: "case-study",
        inSitemap: false,
        isDraft: true,
        noindexIntentional: false,
        google: {
          submittedAt: null,
          lastResponseCode: null,
          coverageState: null,
          indexingState: null,
          verdict: null,
          robotsTxtState: null,
          lastCrawlTime: null,
          googleCanonical: null,
          userCanonical: draftUrl,
          lastInspectedAt: null,
          lastError: null,
        },
        bing: {
          submittedAt: null,
          lastResponseCode: null,
          indexed: null,
          lastCrawlTime: null,
          lastInspectedAt: null,
          lastError: null,
        },
        indexnow: {
          submittedAt: null,
          statusCode: null,
        },
        history: [
          {
            ts: new Date(),
            source: "sitemap-sync",
            action: "submit",
            result: `Draft case study '${draftSlug}' held safely`,
            actorId,
          },
        ],
      });
      newlyAdded++;
    } else if (!existingDraft.isDraft || existingDraft.inSitemap) {
      existingDraft.isDraft = true;
      existingDraft.inSitemap = false;
      await existingDraft.save();
      updated++;
    }
  }

  // 4. Mark removed URLs that are no longer in sitemap and not held drafts
  const sitemapUrls = Array.from(sitemapUrlMap.keys());
  const removedDocs = await IndexedUrl.find({
    url: { $nin: sitemapUrls },
    isDraft: false,
    inSitemap: true,
  });

  let removedFromSitemap = 0;
  for (const doc of removedDocs) {
    doc.inSitemap = false;
    await doc.save();
    await pushHistory(doc.url, {
      ts: new Date(),
      source: "sitemap-sync",
      action: "status-change",
      result: "URL dropped from sitemap",
      actorId,
    });
    removedFromSitemap++;
  }

  return {
    totalInSitemap: sitemapUrls.length,
    newlyAdded,
    updated,
    removedFromSitemap,
    draftsHeld,
  };
}
