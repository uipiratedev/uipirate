import { NextRequest, NextResponse } from "next/server";

import { requireApi } from "@/lib/auth/session";
import { rangeFromRequest } from "@/lib/admin/apiRange";
import { getContentPerformance } from "@/lib/analytics/contentPerformance";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** Powers the Content screen: traffic × Search Console × index status. */
export async function GET(req: NextRequest) {
  const guard = await requireApi("view:dashboard");

  if (!guard.ok) return guard.response;

  const { from, to } = rangeFromRequest(req);

  const { rows, searchMocked } = await getContentPerformance({ from, to });

  return NextResponse.json({ range: { from, to }, rows, searchMocked });
}
