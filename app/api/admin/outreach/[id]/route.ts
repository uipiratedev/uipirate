import { NextRequest, NextResponse } from "next/server";

import { requireApi } from "@/lib/auth/session";
import dbConnect from "@/lib/mongodb";
import MarketingContact from "@/models/MarketingContact";
import { MARKETING_STATUSES, WEBSITE_STATES } from "@/lib/marketing/constants";

const TOUCH_CHANNELS = ["call", "whatsapp", "email"];
const TOUCH_FIELDS: Record<string, { count: string; last: string }> = {
  call: { count: "callCount", last: "lastCalledAt" },
  whatsapp: { count: "whatsappCount", last: "lastWhatsappAt" },
  email: { count: "emailCount", last: "lastEmailAt" },
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const guard = await requireApi("manage:leads");

  if (!guard.ok) return guard.response;

  let body: {
    status?: string;
    note?: string;
    hasWebsite?: string;
    sendToOutreach?: boolean;
    logCall?: boolean;
    logTouch?: string;
    whatsappDraft?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (
    body.status &&
    !(MARKETING_STATUSES as readonly string[]).includes(body.status)
  )
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });

  if (
    body.hasWebsite !== undefined &&
    body.hasWebsite !== "" &&
    !(WEBSITE_STATES as readonly string[]).includes(body.hasWebsite)
  )
    return NextResponse.json({ error: "Invalid value." }, { status: 400 });

  const update: Record<string, unknown> = {};
  const set: Record<string, unknown> = {};

  if (body.status) set.status = body.status;
  if (body.hasWebsite !== undefined) set.hasWebsite = body.hasWebsite;
  if (typeof body.sendToOutreach === "boolean") {
    if (body.sendToOutreach && !body.hasWebsite)
      return NextResponse.json(
        { error: "Choose a website status before sending to Outreach." },
        { status: 400 },
      );
    set.inOutreach = body.sendToOutreach;
  }
  if (typeof body.whatsappDraft === "string")
    set.whatsappDraft = body.whatsappDraft.trim().slice(0, 1000);

  const channel = body.logCall ? "call" : body.logTouch;

  if (channel !== undefined && !TOUCH_CHANNELS.includes(channel as never))
    return NextResponse.json({ error: "Invalid channel." }, { status: 400 });
  if (channel) {
    const fields = TOUCH_FIELDS[channel];

    set[fields.last] = new Date();
    update.$inc = { [fields.count]: 1 };
  }
  const push: Record<string, unknown> = {};

  if (channel)
    push.touches = { channel, at: new Date(), byName: guard.user.name };
  if (body.note?.trim())
    push.notes = {
      by: guard.user.id,
      byName: guard.user.name,
      at: new Date(),
      text: body.note.trim().slice(0, 2000),
    };
  if (Object.keys(push).length) update.$push = push;
  if (Object.keys(set).length) update.$set = set;
  if (!Object.keys(update).length)
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });

  await dbConnect();

  // First touch moves a brand-new contact to "contacted" unless status was set.
  if (channel && !body.status)
    await MarketingContact.updateOne(
      { _id: params.id, status: "new" },
      { $set: { status: "contacted" } },
    );

  const doc = await MarketingContact.findByIdAndUpdate(params.id, update, {
    new: true,
  }).lean();

  if (!doc)
    return NextResponse.json({ error: "Contact not found" }, { status: 404 });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const guard = await requireApi("manage:leads");

  if (!guard.ok) return guard.response;

  await dbConnect();
  await MarketingContact.findByIdAndDelete(params.id);

  return NextResponse.json({ ok: true });
}
