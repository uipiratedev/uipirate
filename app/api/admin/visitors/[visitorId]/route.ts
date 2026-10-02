import { NextRequest, NextResponse } from "next/server";

import { requireApi } from "@/lib/auth/session";
import { getVisitorJourney } from "@/lib/analytics/leads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: { visitorId: string } },
) {
  const guard = await requireApi("view:visitors:pii");

  if (!guard.ok) return guard.response;

  const journey = await getVisitorJourney(params.visitorId);

  if (!journey)
    return NextResponse.json({ error: "Visitor not found" }, { status: 404 });

  return NextResponse.json({ journey });
}
