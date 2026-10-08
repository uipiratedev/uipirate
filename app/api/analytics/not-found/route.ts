import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/mongodb";
import AnalyticsNotFoundDaily from "@/models/analytics/AnalyticsNotFoundDaily";
import { cleanPath } from "@/lib/analytics/enrich";
import { normalizeHost } from "@/lib/analytics/brands";
import { identifyBot } from "@/lib/analytics/botIdentity";
import { ipHashFromHeaders } from "@/lib/analytics/ip";
import { rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ok = () => new NextResponse(null, { status: 204 });

/**
 * POST { path, referrer } — called by the 404 page.
 *
 * Unlike /api/analytics/hit this one is publicly reachable (the browser calls
 * it), so it is rate limited per client and refuses crawlers, whose 404s are
 * Search Console's job and would otherwise drown out real visitors.
 */
export async function POST(req: NextRequest) {
  try {
    if (!rateLimit(`nf:${ipHashFromHeaders(req.headers)}`, 30, 60_000).allowed)
      return ok();

    if (identifyBot(req.headers.get("user-agent"))) return ok();

    const body = (await req.json()) as { path?: unknown; referrer?: unknown };

    if (typeof body.path !== "string" || !body.path) return ok();

    const path = cleanPath(body.path);

    // The admin area redirects rather than 404s; never log it.
    if (path.startsWith("/admin") || path.startsWith("/api")) return ok();

    const referrerHost =
      typeof body.referrer === "string" ? normalizeHost(body.referrer) : "";

    await dbConnect();
    await AnalyticsNotFoundDaily.updateOne(
      {
        date: new Date().toISOString().slice(0, 10),
        path,
        referrerHost: referrerHost.slice(0, 120),
      },
      { $inc: { hits: 1 } },
      { upsert: true },
    );
  } catch {
    // Never let logging a missing page become a second error.
  }

  return ok();
}
