import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/mongodb";
import AnalyticsPageDaily from "@/models/analytics/AnalyticsPageDaily";
import { getPagesReport } from "@/lib/analytics/queries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * GET /api/analytics/rollup?date=YYYY-MM-DD
 * Recomputes the AnalyticsPageDaily rows for one UTC day (default: yesterday).
 * Guarded by `Authorization: Bearer ${CRON_SECRET}` — wired to a daily cron in
 * vercel.json. The dashboard does NOT depend on this; it's a read accelerator.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");

  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dateParam = req.nextUrl.searchParams.get("date");
  const day = dateParam
    ? new Date(`${dateParam}T00:00:00Z`)
    : new Date(Date.now() - 86_400_000);

  if (Number.isNaN(day.valueOf())) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }

  const from = new Date(
    Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate()),
  );
  const to = new Date(from.valueOf() + 86_400_000);
  const dateKey = from.toISOString().slice(0, 10);

  await dbConnect();

  const rows = await getPagesReport({ from, to }, 2000);

  if (rows.length === 0) {
    return NextResponse.json({ ok: true, date: dateKey, rows: 0 });
  }

  await AnalyticsPageDaily.bulkWrite(
    rows.map((r) => ({
      updateOne: {
        filter: { date: dateKey, path: r.path },
        update: {
          $set: {
            views: r.views,
            uniques: r.uniqueVisitors,
            avgDwellMs: r.avgDwellMs,
            avgScrollDepth: r.avgScrollDepth,
            entrances: r.entrances,
            exits: r.exits,
          },
        },
        upsert: true,
      },
    })),
  );

  return NextResponse.json({ ok: true, date: dateKey, rows: rows.length });
}
