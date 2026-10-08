import { NextRequest, NextResponse } from "next/server";

import { requireApi } from "@/lib/auth/session";
import { rangeFromRequest } from "@/lib/admin/apiRange";
import { getContentPerformance } from "@/lib/analytics/contentPerformance";
import { getNotFoundTop } from "@/lib/analytics/anonymous";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** Powers the Content screen: traffic × Search Console × index status. */
export async function GET(req: NextRequest) {
  const guard = await requireApi("view:dashboard");

  if (!guard.ok) return guard.response;

  const { from, to } = rangeFromRequest(req);

  const range = { from, to };
  const { rows, searchMocked, hasTrafficData } =
    await getContentPerformance(range);
  const notFound = await getNotFoundTop(range).catch(() => []);

  return NextResponse.json({
    range: { from, to },
    rows,
    searchMocked,
    hasTrafficData,
    notFound,
  });
}
