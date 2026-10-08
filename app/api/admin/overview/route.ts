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
import { getAnonymousTotal, getBotTotal } from "@/lib/analytics/anonymous";
import AnalyticsEvent from "@/models/analytics/AnalyticsEvent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const guard = await requireApi("view:dashboard");

  if (!guard.ok) return guard.response;

  const { from, to, granularity } = rangeFromRequest(req);
  const range = { from, to };
  const canLeads = guard.user.role !== "normal-user";

  const [
    summary,
    series,
    breakdowns,
    pages,
    clicks,
    recentLeads,
    allVisits,
    botHits,
    contactActions,
  ] = await Promise.all([
    getSummary(range),
    getTimeSeries(range, granularity),
    getTrafficBreakdowns(range),
    getPagesReport(range, 6),
    getClicksReport(range, undefined, 6),
    canLeads ? getRecentLeads(6) : Promise.resolve([]),
    // Consent-free totals — these are the numbers comparable to Vercel.
    getAnonymousTotal(range).catch(() => 0),
    getBotTotal(range).catch(() => 0),
    // WhatsApp / email / phone / calendar / Upwork clicks and form submits.
    AnalyticsEvent.countDocuments({
      occurredAt: { $gte: from, $lte: to },
      type: { $in: ["conversion", "form_submit"] },
    }).catch(() => 0),
  ]);

  return NextResponse.json({
    range: { from, to, granularity },
    summary,
    allVisits,
    botHits,
    contactActions,
    // How much of real traffic the consented tracker actually sees.
    consentRate: allVisits > 0 ? summary.pageviews / allVisits : null,
    series,
    sources: breakdowns.source,
    topPages: pages,
    topClicks: clicks,
    recentLeads,
    canViewLeads: canLeads,
  });
}
