import { NextRequest, NextResponse } from "next/server";

import { requireApi } from "@/lib/auth/session";
import { rangeFromRequest } from "@/lib/admin/apiRange";
import {
  getSummary,
  getTimeSeries,
  getTrafficBreakdowns,
  getPagesReport,
  getClicksReport,
  getRecentLeads,
} from "@/lib/analytics/queries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const guard = await requireApi("view:dashboard");

  if (!guard.ok) return guard.response;

  const { from, to, granularity } = rangeFromRequest(req);
  const range = { from, to };
  const canLeads = guard.user.role !== "normal-user";

  const [summary, series, breakdowns, pages, clicks, recentLeads] =
    await Promise.all([
      getSummary(range),
      getTimeSeries(range, granularity),
      getTrafficBreakdowns(range),
      getPagesReport(range, 6),
      getClicksReport(range, undefined, 6),
      canLeads ? getRecentLeads(6) : Promise.resolve([]),
    ]);

  return NextResponse.json({
    range: { from, to, granularity },
    summary,
    series,
    sources: breakdowns.source,
    topPages: pages,
    topClicks: clicks,
    recentLeads,
    canViewLeads: canLeads,
  });
}
