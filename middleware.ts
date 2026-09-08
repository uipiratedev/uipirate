import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { AUTH_COOKIE, verifySessionEdge } from "@/lib/auth/edge";

/**
 * Runs on (almost) every request. Two jobs:
 *   1. Expose the pathname to server components via `x-pathname`.
 *   2. Gate `/admin/*` behind a valid session cookie, and bounce an already
 *      signed-in user away from `/login`. Deep role checks happen in the
 *      /admin server layout and each API route — this is signature-only.
 */
export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const requestHeaders = new Headers(req.headers);

  requestHeaders.set("x-pathname", url.pathname);

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
