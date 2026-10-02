import { NextRequest, NextResponse } from "next/server";

import { requireApi } from "@/lib/auth/session";
import { rangeFromRequest } from "@/lib/admin/apiRange";
import { listLeads, type LeadKind } from "@/lib/analytics/leads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const guard = await requireApi("view:leads");

  if (!guard.ok) return guard.response;

  const { from, to } = rangeFromRequest(req);
  const sp = req.nextUrl.searchParams;

  const data = await listLeads({
    from,
    to,
    status: sp.get("status") || undefined,
    kind: (sp.get("kind") as LeadKind | "all") || "all",
    q: sp.get("q") || undefined,
    page: Math.max(1, Number(sp.get("page")) || 1),
    pageSize: Math.min(100, Math.max(10, Number(sp.get("pageSize")) || 25)),
  });

  return NextResponse.json(data);
}
