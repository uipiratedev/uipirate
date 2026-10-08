import { NextRequest, NextResponse } from "next/server";

import { requireApi } from "@/lib/auth/session";
import dbConnect from "@/lib/mongodb";
import GbpPost, { type IGbpPost } from "@/models/GbpPost";
import { nextBacklogAt, type QueueItem } from "@/lib/gbp/schedule";
import {
  acceptInvitation,
  listInvitations,
  GbpError,
  getGbpConfig,
  isPublishingEnabled,
  listAccounts,
  listLocations,
} from "@/lib/gbp/client";
import { isOverviewConfigured } from "@/lib/gbp/overview";
import {
  generateOverviewFor,
  publishOne,
  saveOverview,
  syncCatalogue,
} from "@/lib/gbp/sync";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** The Google Business Profile queue and its settings. */
export async function GET() {
  const guard = await requireApi("manage:indexing");

  if (!guard.ok) return guard.response;

  await dbConnect();

  const rows = await GbpPost.find({})
    .sort({ postPublishedAt: -1 })
    .lean<IGbpPost[]>();

  const queue: QueueItem[] = rows.map((d) => ({
    slug: d.slug,
    status: d.status,
    origin: d.origin,
    postPublishedAt: d.postPublishedAt ? d.postPublishedAt.toISOString() : null,
    attempts: d.attempts,
    publishedAt: d.publishedAt,
  }));

  const cfg = getGbpConfig();

  return NextResponse.json({
    configured: Boolean(cfg),
    publishingEnabled: isPublishingEnabled(),
    aiConfigured: isOverviewConfigured(),
    nextBacklogAt: nextBacklogAt(queue, new Date()),
    counts: rows.reduce<Record<string, number>>((acc, r) => {
      acc[r.status] = (acc[r.status] ?? 0) + 1;

      return acc;
    }, {}),
    rows: rows.map((r) => ({
      slug: r.slug,
      title: r.title,
      postType: r.postType ?? null,
      status: r.status,
      origin: r.origin,
      attempts: r.attempts,
      message: r.message ?? null,
      skipKind: r.skipKind ?? null,
      publishedAt: r.publishedAt ?? null,
      postPublishedAt: r.postPublishedAt ?? null,
      overview: r.overview ?? null,
      overviewSource: r.overviewSource ?? null,
    })),
  });
}

type Action =
  | "sync"
  | "check"
  | "accept"
  | "preview"
  | "publish"
  | "skip"
  | "requeue"
  | "generate"
  | "save-overview";

/** Manual controls. Every action needs the `manage:indexing` capability. */
export async function POST(req: NextRequest) {
  const guard = await requireApi("manage:indexing");

  if (!guard.ok) return guard.response;

  const body = (await req.json().catch(() => ({}))) as {
    action?: Action;
    slug?: string;
    overview?: string;
  };
  const { action, slug } = body;

  try {
    if (action === "sync") return NextResponse.json({ ok: true, ...(await syncCatalogue()) });

    if (action === "check") {
      // Read-only: shows what the service account can see, so the account and
      // location ids can be copied into the environment.
      const accounts = await listAccounts();
      const locations = (
        await Promise.all(
          accounts.map(async (a) => ({
            account: a,
            locations: await listLocations(a.id),
          })),
        )
      ).flat();

      return NextResponse.json({ ok: true, accounts, locations });
    }

    if (action === "accept") {
      const accounts = await listAccounts();
      const accepted: string[] = [];
      const ignored: string[] = [];

      for (const a of accounts) {
        for (const inv of await listInvitations(a.id)) {
          // Posting needs Manager only; never take Owner rights on a robot account.
          if (inv.role === "OWNER") {
            ignored.push(`${inv.target} (Owner invite ignored — re-invite as Manager)`);
            continue;
          }

          try {
            await acceptInvitation(inv.name);
            accepted.push(inv.target);
          } catch (e) {
            // Report each invite on its own so one failure does not hide the rest.
            ignored.push(`${inv.target} (${inv.role}): ${e instanceof Error ? e.message : "failed"}`);
          }
        }
      }

      return NextResponse.json({ ok: true, accepted, ignored });
    }

    if (!slug || typeof slug !== "string")
      return NextResponse.json({ ok: false, error: "slug is required" }, { status: 400 });

    await dbConnect();

    if (action === "preview")
      return NextResponse.json(await publishOne(slug, { dryRun: true }));

    // Publishing is explicit, so it works without GBP_PUBLISH_ENABLED — that
    // flag only governs the automatic cron.
    if (action === "publish") return NextResponse.json(await publishOne(slug));

    if (action === "generate")
      return NextResponse.json({ ok: true, overview: await generateOverviewFor(slug) });

    if (action === "save-overview")
      return NextResponse.json({ ok: await saveOverview(slug, String(body.overview ?? "")) });

    if (action === "skip") {
      const r = await GbpPost.updateOne(
        { slug, status: { $in: ["queued", "failed"] } },
        { $set: { status: "skipped", skipKind: "manual", message: "Skipped by an admin" } },
      );

      return NextResponse.json({ ok: r.modifiedCount === 1 });
    }

    if (action === "requeue") {
      const r = await GbpPost.updateOne(
        { slug, status: { $in: ["skipped", "failed"] } },
        { $set: { status: "queued", attempts: 0 }, $unset: { message: "", skipKind: "" } },
      );

      return NextResponse.json({ ok: r.modifiedCount === 1 });
    }

    return NextResponse.json({ ok: false, error: "Unknown action" }, { status: 400 });
  } catch (err) {
    const e = err instanceof GbpError ? err : null;

    return NextResponse.json(
      {
        ok: false,
        error: e?.message ?? (err instanceof Error ? err.message : "Request failed"),
        hint: e?.hint,
      },
      { status: e?.status && e.status >= 400 && e.status < 500 ? 400 : 500 },
    );
  }
}
