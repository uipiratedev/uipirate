import { NextRequest, NextResponse } from "next/server";

import { requireApi } from "@/lib/auth/session";
import { rangeFromRequest } from "@/lib/admin/apiRange";
import { GbpError } from "@/lib/gbp/client";
import { getPerformance } from "@/lib/gbp/performance";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Views and actions on the Google listing over the last 28 days. */
export async function GET(req: NextRequest) {
  const guard = await requireApi("manage:indexing");

  if (!guard.ok) return guard.response;

  try {
    // The same range the header date filter sends to every dashboard API.
    const { from, to } = rangeFromRequest(req);

    return NextResponse.json({ ok: true, ...(await getPerformance({ from, to })) });
  } catch (err) {
    const e = err instanceof GbpError ? err : null;
    // A 403 about a disabled API is the only 403 this endpoint can plausibly get.
    const disabled = e?.status === 403 && /not enabled/i.test(e.message);

    return NextResponse.json(
      {
        ok: false,
        error: disabled
          ? "The Business Profile Performance API is not enabled for this project."
          : (e?.message ?? (err instanceof Error ? err.message : "Request failed")),
        hint: disabled
          ? "In Google Cloud → APIs & Services → Library, enable “Business Profile Performance API”, then reload."
          : e?.hint,
      },
      { status: 200 },
    );
  }
}
