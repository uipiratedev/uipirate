import { NextRequest, NextResponse } from "next/server";

import { requireApi } from "@/lib/auth/session";
import { rangeFromRequest } from "@/lib/admin/apiRange";
import {
  getSummary,
  getTimeSeries,
  getTrafficBreakdowns,
  getTopReferrers,
} from "@/lib/analytics/queries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const guard = await requireApi("view:dashboard");

  if (!guard.ok) return guard.response;

  const { from, to, granularity } = rangeFromRequest(req);
  const range = { from, to };

  const [summary, series, breakdowns, referrers] = await Promise.all([
    getSummary(range),
    getTimeSeries(range, granularity),
    getTrafficBreakdowns(range),
    getTopReferrers(range),
  ]);

  return NextResponse.json({
    range: { from, to, granularity },
    summary,
    series,
    ...breakdowns,
    referrers,
  });
}
