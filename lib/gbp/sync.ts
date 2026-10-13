/**
 * Keeps the Google Business Profile in step with the CMS.
 *
 *   syncCatalogue()  — registers every CMS post in `GbpPost`
 *   publishOne()     — announces a single post (manual button, and the cron)
 *   runScheduled()   — the daily cron: sync, then publish what is due
 *
 * Posting to a public Google listing cannot be taken back from here, so the
 * rules lean cautious: nothing is posted unless publishing is explicitly
 * enabled, held drafts are refused even when asked manually, each post is
 * claimed atomically before the API call, and a crash mid-publish is never
 * retried automatically (it may already be live).
 */
import dbConnect from "@/lib/mongodb";
import GbpPost, { type IGbpPost } from "@/models/GbpPost";
import { getPostBySlug, listPosts } from "@/lib/cometCOS/public-client";
import {
  buildLocalPost,
  eligibility,
  type GbpSourcePost,
  type LocalPostPayload,
} from "./payload";
import { selectToPublish, type QueueItem } from "./schedule";
import { generateOverview, isOverviewConfigured } from "./overview";
import {
  GbpError,
  createLocalPost,
  getGbpConfig,
  isPublishingEnabled,
} from "./client";

const CMS_FIELDS =
  "id,slug,title,excerpt,postType,publishedAt,seo,featuredImage,bannerImage";

/** A claim older than this means the process died mid-publish. */
const STALE_CLAIM_MS = 15 * 60_000;
const MAX_ATTEMPTS = 3;

async function fetchAllCmsPosts(): Promise<GbpSourcePost[]> {
  const out: GbpSourcePost[] = [];

  // 100 per page, capped, in case the API ever ignores `page`.
  for (let page = 1; page <= 10; page++) {
    const batch = await listPosts({ page, limit: 100, fields: CMS_FIELDS });

    out.push(...(batch as unknown as GbpSourcePost[]));
    if (batch.length < 100) break;
  }

  return out;
}

export interface CatalogueResult {
  total: number;
  created: number;
  queued: number;
  skipped: number;
  released: number;
  recovered: number;
}

/** Registers new CMS posts and re-evaluates ones that were held or changed. */
export async function syncCatalogue(): Promise<CatalogueResult> {
  await dbConnect();

  const cms = await fetchAllCmsPosts();

  // First ever run: everything that exists today is backlog, so the existing
  // posts drip out on a schedule instead of flooding the profile.
  const firstRun = (await GbpPost.estimatedDocumentCount()) === 0;

  const existing = new Map(
    (await GbpPost.find({}).lean<IGbpPost[]>()).map((d) => [d.slug, d]),
  );

  const r: CatalogueResult = {
    total: cms.length,
    created: 0,
    queued: 0,
    skipped: 0,
    released: 0,
    recovered: 0,
  };

  for (const p of cms) {
    if (!p.slug) continue;

    const elig = eligibility(p);
    const have = existing.get(p.slug);
    const postPublishedAt = p.publishedAt ? new Date(p.publishedAt) : null;

    if (!have) {
      await GbpPost.create({
        slug: p.slug,
        title: p.title ?? "",
        postType: p.postType,
        postPublishedAt,
        origin: firstRun ? "backlog" : "new",
        status: elig.eligible ? "queued" : "skipped",
        skipKind: elig.eligible ? undefined : "ineligible",
        message: elig.eligible ? undefined : elig.reason,
      }).catch(() => {
        // A concurrent run created it first — the unique slug protects us.
      });
      r.created++;
      elig.eligible ? r.queued++ : r.skipped++;
      continue;
    }

    // Never touch what has already gone out, or what an admin skipped by hand.
    if (have.status === "published" || have.status === "publishing") continue;
    if (have.status === "skipped" && have.skipKind === "manual") continue;

    if (have.status === "skipped" && elig.eligible) {
      // e.g. a held draft that has since been released.
      await GbpPost.updateOne(
        { slug: p.slug, status: "skipped", skipKind: "ineligible" },
        { $set: { status: "queued", message: undefined, title: p.title ?? "" } },
      );
      r.released++;
    } else if (have.status !== "skipped" && !elig.eligible) {
      // Became ineligible (held again, noindex, unpublished) before it went out.
      await GbpPost.updateOne(
        { slug: p.slug, status: { $in: ["queued", "failed"] } },
        { $set: { status: "skipped", skipKind: "ineligible", message: elig.reason } },
      );
      r.skipped++;
    } else {
      await GbpPost.updateOne(
        { slug: p.slug, status: { $ne: "published" } },
        { $set: { title: p.title ?? "", postPublishedAt } },
      );
    }
  }

  // Recover claims left behind by a crash. NOT retried automatically: the post
  // may already be live, so a human decides.
  const recovered = await GbpPost.updateMany(
    { status: "publishing", updatedAt: { $lt: new Date(Date.now() - STALE_CLAIM_MS) } },
    {
      $set: {
        status: "failed",
        attempts: MAX_ATTEMPTS,
        message:
          "Interrupted mid-publish. Check the Business Profile before retrying — it may already be live.",
      },
    },
  );

  r.recovered = recovered.modifiedCount;

  return r;
}

export type PublishOutcome =
  | { slug: string; ok: true; dryRun: true; payload: LocalPostPayload }
  | { slug: string; ok: true; dryRun: false; gbpPostName: string }
  | { slug: string; ok: false; message: string; hint?: string; fatal?: boolean };

/**
 * Announce one post. `dryRun` returns exactly what would be sent and changes
 * nothing. `fatal` marks a problem with the setup (credentials, permission,
 * quota) rather than with the post — the scheduler stops on those.
 */
export async function publishOne(
  slug: string,
  opts: { dryRun?: boolean } = {},
): Promise<PublishOutcome> {
  await dbConnect();

  const rec = await GbpPost.findOne({ slug }).lean<IGbpPost | null>();

  if (!rec) return { slug, ok: false, message: "Not in the queue — run a sync first." };

  if (rec.status === "published")
    return { slug, ok: false, message: "Already published to Google." };

  const cmsPost = await getPostBySlug(slug);

  if (!cmsPost)
    // getPostBySlug returns null for a missing post *and* for a CMS outage, so
    // do not claim the post was deleted — that would be wrong during a blip.
    return {
      slug,
      ok: false,
      message: "Could not load the post from the CMS (it may be unpublished, or the CMS was unreachable). Try again.",
    };

  const source = cmsPost as unknown as GbpSourcePost;

  // Re-checked at the last moment, and applies to manual publishes too.
  const elig = eligibility(source);

  if (!elig.eligible) return { slug, ok: false, message: elig.reason ?? "Not eligible." };

  source.overview = rec.overview || undefined;

  // A real publish with no overview yet: write one from the full article. A
  // preview never calls the model, and a Gemini failure falls back to the CMS
  // excerpt rather than blocking the post.
  if (!opts.dryRun && !source.overview && isOverviewConfigured()) {
    try {
      source.overview = await generateOverview({
        title: source.title,
        excerpt: source.excerpt,
        content: cmsPost.content,
        postType: source.postType,
      });
      await GbpPost.updateOne({ slug }, { $set: { overview: source.overview, overviewSource: "ai" } });
    } catch {
      // Excerpt fallback.
    }
  }

  const payload = buildLocalPost(source);

  if (opts.dryRun) return { slug, ok: true, dryRun: true, payload };

  const cfg = getGbpConfig();

  if (!cfg)
    return {
      slug,
      ok: false,
      fatal: true,
      message: "Business Profile is not configured.",
      hint: "Set GBP_ACCOUNT_ID and GBP_LOCATION_ID.",
    };

  // Atomic claim: only one run can move a post out of queued/failed.
  const claimed = await GbpPost.findOneAndUpdate(
    { slug, status: { $in: ["queued", "failed"] } },
    { $set: { status: "publishing" } },
    { new: true },
  );

  if (!claimed)
    return { slug, ok: false, message: "Another run is already publishing this post." };

  try {
    const name = await createLocalPost(cfg, payload);

    await GbpPost.updateOne(
      { slug },
      {
        $set: {
          status: "published",
          gbpPostName: name,
          publishedAt: new Date(),
          message: undefined,
        },
        $inc: { attempts: 1 },
      },
    );

    return { slug, ok: true, dryRun: false, gbpPostName: name };
  } catch (err) {
    const e = err instanceof GbpError ? err : new GbpError(String(err));
    // Setup problems affect every post and say nothing about this one, so they
    // do not consume a retry attempt.
    const fatal = e.status !== undefined && [401, 403, 404, 429].includes(e.status);

    await GbpPost.updateOne(
      { slug },
      {
        $set: { status: fatal ? "queued" : "failed", message: e.message },
        ...(fatal ? {} : { $inc: { attempts: 1 } }),
      },
    );

    return { slug, ok: false, message: e.message, hint: e.hint, fatal };
  }
}

/** Writes (and stores) an AI overview for one post from its full article. */
export async function generateOverviewFor(slug: string): Promise<string> {
  await dbConnect();

  const cmsPost = await getPostBySlug(slug);

  if (!cmsPost) throw new Error("Could not load the post from the CMS. Try again.");

  const overview = await generateOverview({
    title: cmsPost.title,
    excerpt: cmsPost.excerpt,
    content: cmsPost.content,
    postType: cmsPost.postType,
  });

  const r = await GbpPost.updateOne(
    { slug, status: { $ne: "published" } },
    { $set: { overview, overviewSource: "ai" } },
  );

  if (r.matchedCount !== 1) throw new Error("Post is not in the queue, or is already published.");

  return overview;
}

export async function saveOverview(slug: string, overview: string): Promise<boolean> {
  await dbConnect();

  const text = overview.trim().slice(0, 1400);
  const r = await GbpPost.updateOne(
    { slug, status: { $ne: "published" } },
    text
      ? { $set: { overview: text, overviewSource: "manual" } }
      : { $unset: { overview: "", overviewSource: "" } },
  );

  return r.matchedCount === 1;
}

export interface ScheduledResult {
  mode: "publish" | "dry-run";
  reason?: string;
  catalogue: CatalogueResult;
  due: string[];
  results: PublishOutcome[];
}

const toQueueItem = (d: IGbpPost): QueueItem => ({
  slug: d.slug,
  status: d.status,
  origin: d.origin,
  postPublishedAt: d.postPublishedAt ? d.postPublishedAt.toISOString() : null,
  attempts: d.attempts,
  publishedAt: d.publishedAt,
});

/** The daily cron: sync the catalogue, then publish whatever is due. */
export async function runScheduled(now = new Date()): Promise<ScheduledResult> {
  const catalogue = await syncCatalogue();

  const queue = (await GbpPost.find({}).lean<IGbpPost[]>()).map(toQueueItem);
  const due = selectToPublish(queue, now, { maxAttempts: MAX_ATTEMPTS });
  const dueSlugs = due.map((d) => d.slug);

  if (!isPublishingEnabled() || !getGbpConfig()) {
    return {
      mode: "dry-run",
      reason: !isPublishingEnabled()
        ? "GBP_PUBLISH_ENABLED is not set to 1, so nothing was posted."
        : "GBP_ACCOUNT_ID / GBP_LOCATION_ID are not set.",
      catalogue,
      due: dueSlugs,
      results: [],
    };
  }

  const results: PublishOutcome[] = [];

  for (const slug of dueSlugs) {
    const out = await publishOne(slug);

    results.push(out);
    // A setup problem hits every remaining post identically — stop, don't spam.
    if (!out.ok && out.fatal) break;
  }

  return { mode: "publish", catalogue, due: dueSlugs, results };
}
