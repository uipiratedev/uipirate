import { NextRequest, NextResponse } from "next/server";

import { requireApi } from "@/lib/auth/session";
import { rangeFromRequest } from "@/lib/admin/apiRange";
import { getSearchIntelligence } from "@/lib/analytics/searchConsole";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const guard = await requireApi("view:dashboard");

  if (!guard.ok) return guard.response;

  const { from, to } = rangeFromRequest(req);
  const engineParam = req.nextUrl.searchParams.get("engine");
  const engine =
    engineParam === "google" || engineParam === "bing" ? engineParam : "all";

  const data = await getSearchIntelligence({
    from: from.toISOString(),
    to: to.toISOString(),
    engine,
  });

  return NextResponse.json(data);
}
