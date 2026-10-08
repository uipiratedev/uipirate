import { NextRequest, NextResponse } from "next/server";

import { requireApi } from "@/lib/auth/session";
import { OAUTH_STATE_COOKIE, completeSignIn } from "@/lib/gbp/oauth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Google sends the admin back here with a one-time code. */
export async function GET(req: NextRequest) {
  const guard = await requireApi("manage:indexing");

  if (!guard.ok) return guard.response;

  const origin = req.nextUrl.origin;
  const back = (q: string) => {
    const res = NextResponse.redirect(new URL(`/admin/google-business?${q}`, origin));

    res.cookies.delete({ name: OAUTH_STATE_COOKIE, path: "/api/admin/gbp/oauth" });

    return res;
  };

  const p = req.nextUrl.searchParams;
  const expected = req.cookies.get(OAUTH_STATE_COOKIE)?.value;

  if (p.get("error")) return back("oauth=denied");

  // The state must match the cookie set when this admin started the sign-in.
  if (!expected || p.get("state") !== expected || !p.get("code")) return back("oauth=invalid");

  try {
    await completeSignIn(p.get("code")!, origin);

    return back("oauth=connected");
  } catch (err) {
    return back(
      `oauth=failed&reason=${encodeURIComponent(err instanceof Error ? err.message : "failed")}`,
    );
  }
}
