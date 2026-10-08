import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

/**
 * Returns the visitor's country from the edge geo headers.
 *
 * Replaces the previous client-side call to ipapi.co, which was the single
 * biggest source of under-counting in analytics: ad blockers, rate limits and
 * slow responses all made it fail, and every failure fell back to showing the
 * consent banner — so a non-EU visitor who ignored the banner was never
 * tracked at all. This is first-party, same-origin, and cannot be blocked
 * without blocking the site itself.
 */
export function GET(req: NextRequest) {
  const country =
    req.headers.get("x-vercel-ip-country") ||
    req.geo?.country ||
    // Cloudflare, in case the site is ever fronted by it.
    req.headers.get("cf-ipcountry") ||
    null;

  return NextResponse.json(
    { country },
    {
      headers: {
        // Per-visitor value — must never be shared by a CDN cache.
        "Cache-Control": "private, no-store",
      },
    },
  );
}
