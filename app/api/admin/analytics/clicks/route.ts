import { NextRequest, NextResponse } from "next/server";

import { requireApi } from "@/lib/auth/session";
import { rangeFromRequest } from "@/lib/admin/apiRange";
import { getClicksReport } from "@/lib/analytics/queries";
import { cleanPath } from "@/lib/analytics/enrich";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const guard = await requireApi("view:dashboard");

  if (!guard.ok) return guard.response;

  const { from, to } = rangeFromRequest(req);
  const pathParam = req.nextUrl.searchParams.get("path");
  const path = pathParam ? cleanPath(pathParam) : undefined;

  const rows = await getClicksReport({ from, to }, path, 200);

  return NextResponse.json({ range: { from, to }, path: path || null, rows });
}
