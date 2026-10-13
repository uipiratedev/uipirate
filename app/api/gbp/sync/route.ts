import { NextRequest, NextResponse } from "next/server";

import { runScheduled } from "@/lib/gbp/sync";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * GET /api/gbp/sync — the daily cron (see vercel.json).
 *
 * Registers any new CMS post, then publishes whatever is due: brand-new posts
 * at once, the backlog one at a time on a schedule. Until
 * GBP_PUBLISH_ENABLED=1 it only reports what it *would* post.
 *
 * Guarded by `Authorization: Bearer ${CRON_SECRET}`. Fails closed: with no
 * secret configured it refuses, in every environment.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;

  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    return NextResponse.json({ ok: true, ...(await runScheduled()) });
  } catch (err) {
    console.error("GBP sync failed:", err);

    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Sync failed" },
      { status: 500 },
    );
  }
}
