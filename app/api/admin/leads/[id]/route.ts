import { NextRequest, NextResponse } from "next/server";

import { requireApi } from "@/lib/auth/session";
import { LEAD_STATUSES } from "@/models/Lead";
import { getLead, updateLead, getVisitorJourney } from "@/lib/analytics/leads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const guard = await requireApi("view:leads");

  if (!guard.ok) return guard.response;

  const lead = await getLead(params.id);

  if (!lead)
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });

  const journey = lead.visitorId
    ? await getVisitorJourney(lead.visitorId)
    : null;

  return NextResponse.json({ lead, journey });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const guard = await requireApi("manage:leads");

  if (!guard.ok) return guard.response;

  let body: { status?: string; assignedTo?: string | null; note?: string };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (body.status && !LEAD_STATUSES.includes(body.status as never)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const updated = await updateLead(params.id, {
    status: body.status,
    assignedTo: body.assignedTo,
    note: body.note?.trim()
      ? { by: guard.user.id, byName: guard.user.name, text: body.note.trim() }
      : undefined,
  });

  if (!updated)
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });

  return NextResponse.json({ lead: updated });
}
