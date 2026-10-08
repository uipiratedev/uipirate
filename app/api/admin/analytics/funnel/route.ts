import { NextRequest, NextResponse } from "next/server";

import { requireApi } from "@/lib/auth/session";
import { rangeFromRequest } from "@/lib/admin/apiRange";
import { getFunnel, getToolUsage } from "@/lib/analytics/funnel";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** Powers the Funnel screen: conversions, landing-page rates, tool usage. */
export async function GET(req: NextRequest) {
  const guard = await requireApi("view:dashboard");

  if (!guard.ok) return guard.response;

  const { from, to } = rangeFromRequest(req);
  const range = { from, to };

  const funnel = await getFunnel(range);
  const tools = await getToolUsage(range);

  return NextResponse.json({ range: { from, to }, ...funnel, tools });
}
