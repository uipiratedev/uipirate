import { NextRequest, NextResponse } from "next/server";

import { requireApi } from "@/lib/auth/session";
import { OAUTH_STATE_COOKIE, buildAuthUrl, newState } from "@/lib/gbp/oauth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Sends the signed-in admin to Google's consent screen. */
export async function GET(req: NextRequest) {
  const guard = await requireApi("manage:indexing");

  if (!guard.ok) return guard.response;

  const state = newState();
  const url = buildAuthUrl(req.nextUrl.origin, state);

  if (!url)
    return NextResponse.redirect(
      new URL("/admin/google-business?oauth=missing-client", req.nextUrl.origin),
    );

  const res = NextResponse.redirect(url);

  res.cookies.set(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: req.nextUrl.protocol === "https:",
    sameSite: "lax",
    path: "/api/admin/gbp/oauth",
    maxAge: 600,
  });

  return res;
}
