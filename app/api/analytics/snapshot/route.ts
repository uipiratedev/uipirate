import { NextRequest, NextResponse } from "next/server";

import { lastCompleteWeek, takeSnapshot } from "@/lib/analytics/snapshot";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * GET /api/analytics/snapshot[?week=YYYY-MM-DD]
 * Freezes one week of headline numbers into AnalyticsSnapshot. Wired to a
 * weekly cron in vercel.json. `week` is any date inside the week to (re)take;
 * default is the most recent complete week.
 *
 * Guarded by `Authorization: Bearer ${CRON_SECRET}`. Fails closed: with no
 * secret configured it refuses, in every environment.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;

  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const param = req.nextUrl.searchParams.get("week");
  let week = lastCompleteWeek(new Date());

  if (param) {
    const d = new Date(`${param}T00:00:00Z`);

    if (Number.isNaN(d.valueOf())) {
      return NextResponse.json({ error: "Invalid week" }, { status: 400 });
    }

    // lastCompleteWeek(x) is the week before x's own week; step forward 7 days.
    week = lastCompleteWeek(new Date(d.valueOf() + 7 * 86_400_000));
  }

  const snapshot = await takeSnapshot(week);

  return NextResponse.json({ ok: true, snapshot });
}
