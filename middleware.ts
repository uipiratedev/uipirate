import type { NextRequest, NextFetchEvent } from "next/server";

import { NextResponse } from "next/server";

import { AUTH_COOKIE, verifySessionEdge } from "@/lib/auth/edge";
import { internalAnalyticsSecret } from "@/lib/analytics/internalSecret";

/** Never counted: internal surfaces, APIs, and anything non-navigational. */
const UNCOUNTED = /^\/(api|admin|login|_next|monitoring)(\/|$)/;

/**
 * Fire-and-forget anonymous hit count.
 *
 * Middleware is the only server-side hook that sees *every* request: blog
 * pages are ISR-cached, so their render does not re-run per visitor, and the
 * consented client tracker misses anyone who blocks scripts or declines the
 * banner. Counting here is what lets the dashboard agree with Vercel.
 *
 * Runs inside `waitUntil` so it never delays the response, and failures are
 * swallowed — a counting problem must never break page delivery.
 */
function countHit(req: NextRequest, event: NextFetchEvent) {
  const { pathname } = req.nextUrl;

  if (UNCOUNTED.test(pathname)) return;
  // Only count real page navigations, not RSC prefetches or data fetches.
  if (req.method !== "GET") return;
  if (req.headers.get("rsc") || req.headers.get("next-router-prefetch")) return;
  if (!req.headers.get("accept")?.includes("text/html")) return;

  const secret = internalAnalyticsSecret();

  if (!secret) return;

  event.waitUntil(
    fetch(new URL("/api/analytics/hit", req.nextUrl.origin), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-token": secret,
      },
      body: JSON.stringify({
        path: pathname,
        referrer: req.headers.get("referer") || "",
        ua: req.headers.get("user-agent") || "",
        country: req.headers.get("x-vercel-ip-country") || "",
      }),
    }).catch(() => {}),
  );
}

/**
 * Runs on (almost) every request. Three jobs:
 *   1. Expose the pathname to server components via `x-pathname`.
 *   2. Gate `/admin/*` behind a valid session cookie, and bounce an already
 *      signed-in user away from `/login`. Deep role checks happen in the
 *      /admin server layout and each API route — this is signature-only.
 *   3. Count the request anonymously (see `countHit`).
 */
export async function middleware(req: NextRequest, event: NextFetchEvent) {
  const url = req.nextUrl;
  const requestHeaders = new Headers(req.headers);

  requestHeaders.set("x-pathname", url.pathname);

  countHit(req, event);

  const pass = NextResponse.next({ request: { headers: requestHeaders } });

  const isAdmin =
    url.pathname === "/admin" || url.pathname.startsWith("/admin/");
  const isLogin = url.pathname === "/login";

  if (!isAdmin && !isLogin) return pass;

  const session = await verifySessionEdge(req.cookies.get(AUTH_COOKIE)?.value);

  if (isAdmin && !session) {
    const loginUrl = new URL("/login", req.url);

    loginUrl.searchParams.set("next", url.pathname + url.search);

    return NextResponse.redirect(loginUrl);
  }

  if (isLogin && session) {
    const next = url.searchParams.get("next");
    const dest = next && next.startsWith("/admin") ? next : "/admin";

    return NextResponse.redirect(new URL(dest, req.url));
  }

  return pass;
}

export const config = {
  // Run everywhere except Next internals and static assets. The pathname header
  // is needed site-wide; the auth branch only fires for /admin and /login.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|json)$).*)",
  ],
};
