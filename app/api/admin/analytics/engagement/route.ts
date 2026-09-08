import { NextRequest, NextResponse } from "next/server";

import { requireApi } from "@/lib/auth/session";
import { rangeFromRequest } from "@/lib/admin/apiRange";
import { getEngagementReport, getSummary } from "@/lib/analytics/queries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const guard = await requireApi("view:dashboard");

  if (!guard.ok) return guard.response;

  const { from, to } = rangeFromRequest(req);
  const range = { from, to };

  const [summary, report] = await Promise.all([
    getSummary(range),
    getEngagementReport(range),
  ]);

  return NextResponse.json({ range: { from, to }, summary, ...report });
}
