import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/mongodb";
import AnalyticsHitDaily from "@/models/analytics/AnalyticsHitDaily";
import AnalyticsBotDaily from "@/models/analytics/AnalyticsBotDaily";
import { classifyReferrer, cleanPath, parseDevice } from "@/lib/analytics/enrich";
import { identifyBot } from "@/lib/analytics/botIdentity";
import { normalizeHost } from "@/lib/analytics/brands";
import { internalAnalyticsSecret } from "@/lib/analytics/internalSecret";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SELF_HOST = (process.env.NEXT_PUBLIC_SITE_HOST || "uipirate.com").replace(
  /^https?:\/\//,
  "",
);

/** Always 204 — counting must never surface an error to the visitor. */
const ok = () => new NextResponse(null, { status: 204 });

/**
 * Internal, server-to-server only. Called by `middleware.ts` via
 * `waitUntil()` so it never blocks the response.
 *
 * Records one anonymous hit. This is the consent-free counter: no visitor id,
 * no IP, no user-agent is stored — only a +1 against a bucket. It exists
 * because the consented tracker misses every visitor who blocks scripts,
 * declines the banner, or has JS off, which is why the dashboard read far
 * below Vercel.
 *
 * Bot traffic is not discarded here (unlike /api/analytics/collect); it is
 * counted separately so AI crawler activity is visible.
 */
export async function POST(req: NextRequest) {
  const secret = internalAnalyticsSecret();

  // No secret configured → refuse rather than expose a public write endpoint.
  if (!secret || req.headers.get("x-internal-token") !== secret) {
    return new NextResponse(null, { status: 401 });
  }

  try {
    const body = (await req.json()) as {
      path?: unknown;
      referrer?: unknown;
      ua?: unknown;
      country?: unknown;
    };

    const path = cleanPath(typeof body.path === "string" ? body.path : "/");
    const referrer = typeof body.referrer === "string" ? body.referrer : "";
    const ua = typeof body.ua === "string" ? body.ua : "";
    const country = (
      typeof body.country === "string" ? body.country : ""
    ).slice(0, 2);

    const date = new Date().toISOString().slice(0, 10);

    await dbConnect();

    const bot = identifyBot(ua);

    if (bot) {
      await AnalyticsBotDaily.updateOne(
        { date, botName: bot.name, path },
        { $inc: { hits: 1 }, $set: { botKind: bot.kind } },
        { upsert: true },
      );

      return ok();
    }

    const channel = classifyReferrer(referrer, undefined, SELF_HOST);

    // Internal navigations are not new traffic.
    if (channel === "internal") return ok();

    await AnalyticsHitDaily.updateOne(
      {
        date,
        path,
        channel,
        referrerHost: normalizeHost(referrer),
        country,
        deviceType: parseDevice(ua).type,
      },
      { $inc: { hits: 1 } },
      { upsert: true },
    );
  } catch {
    // Swallow — a counting failure must never affect the site.
  }

  return ok();
}
