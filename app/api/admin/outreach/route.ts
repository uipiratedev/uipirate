import { NextRequest, NextResponse } from "next/server";

import { requireApi } from "@/lib/auth/session";
import dbConnect from "@/lib/mongodb";
import MarketingContact from "@/models/MarketingContact";
import {
  MARKETING_STATUSES,
  MAX_UPLOAD_ROWS,
  normalizeWebsiteState,
} from "@/lib/marketing/constants";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function serialize(c: any) {
  return {
    id: String(c._id),
    name: c.name,
    phone: c.phone || "",
    email: c.email || "",
    company: c.company || "",
    category: c.category || "",
    city: c.city || "",
    state: c.state || "",
    website: c.website || "",
    pitch: c.pitch || "",
    hasWebsite: c.hasWebsite || "",
    batch: c.batch,
    status: c.status,
    callCount: c.callCount || 0,
    lastCalledAt: c.lastCalledAt
      ? new Date(c.lastCalledAt).toISOString()
      : null,
    whatsappDraft: c.whatsappDraft || "",
    whatsappCount: c.whatsappCount || 0,
    lastWhatsappAt: c.lastWhatsappAt
      ? new Date(c.lastWhatsappAt).toISOString()
      : null,
    emailCount: c.emailCount || 0,
    lastEmailAt: c.lastEmailAt ? new Date(c.lastEmailAt).toISOString() : null,
    extra: c.extra || {},
    touches: (c.touches || [])
      .slice(-50)
      .reverse()
      .map((t: any) => ({
        channel: t.channel,
        at: new Date(t.at).toISOString(),
        byName: t.byName,
        message: t.message || "",
      })),
    notes: (c.notes || []).map((n: any) => ({
      id: String(n._id),
      byName: n.byName,
      at: new Date(n.at).toISOString(),
      text: n.text,
    })),
    activities: (c.activities || []).map((a: any) => ({
      type: a.type,
      at: new Date(a.at).toISOString(),
      byName: a.byName,
      summary: a.summary,
    })),
    createdAt: new Date(c.createdAt).toISOString(),
  };
}

export async function GET(req: NextRequest) {
  const guard = await requireApi("view:leads");

  if (!guard.ok) return guard.response;

  await dbConnect();

  const sp = req.nextUrl.searchParams;
  const status = sp.get("status");
  const q = sp.get("q")?.trim();
  const stage = sp.get("stage");
  const filter: Record<string, unknown> = {};

  if (stage === "leads") filter.inOutreach = { $ne: true };
  if (stage === "outreach") filter.inOutreach = true;

  const folder = sp.get("folder");

  if (folder === "none") filter.folder = { $in: [null, ""] };
  else if (folder && /^[0-9a-f]{24}$/i.test(folder)) filter.folder = folder;

  if (status && (MARKETING_STATUSES as readonly string[]).includes(status))
    filter.status = status;
  if (q) {
    const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

    filter.$or = [{ name: rx }, { phone: rx }, { email: rx }, { company: rx }];
  }

  const [rows, byStatus, totals] = await Promise.all([
    (MarketingContact.find(filter) as any)
      .sort({ createdAt: -1 })
      .limit(500)
      .lean() as Promise<any[]>,
    MarketingContact.aggregate([
      { $group: { _id: "$status", n: { $sum: 1 } } },
    ]),
    MarketingContact.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          outreach: {
            $sum: { $cond: [{ $eq: ["$inOutreach", true] }, 1, 0] },
          },
          calls: { $sum: "$callCount" },
          called: { $sum: { $cond: [{ $gt: ["$callCount", 0] }, 1, 0] } },
        },
      },
    ]),
  ]);

  const t = totals[0] || { total: 0, outreach: 0, calls: 0, called: 0 };
  const counts: Record<string, number> = {};

  for (const s of byStatus) counts[s._id] = s.n;

  return NextResponse.json({
    contacts: rows.map(serialize),
    stats: {
      total: t.total,
      outreach: t.outreach,
      leads: t.total - t.outreach,
      called: t.called,
      calls: t.calls,
      pending: t.total - t.called,
      byStatus: counts,
    },
  });
}

/** Import parsed sheet rows as one batch. */
export async function POST(req: NextRequest) {
  const guard = await requireApi("manage:leads");

  if (!guard.ok) return guard.response;

  let body: { fileName?: string; rows?: any[]; folderId?: string };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const rows = Array.isArray(body.rows) ? body.rows : [];

  if (!rows.length)
    return NextResponse.json({ error: "No rows to import." }, { status: 400 });
  if (rows.length > MAX_UPLOAD_ROWS)
    return NextResponse.json(
      { error: `Max ${MAX_UPLOAD_ROWS} rows per upload.` },
      { status: 400 },
    );

  const str = (v: unknown, max = 200) =>
    typeof v === "string" ? v.trim().slice(0, max) : "";
  const batch = `${str(body.fileName, 80) || "upload"} · ${new Date().toISOString().slice(0, 16).replace("T", " ")}`;

  const folderId =
    typeof body.folderId === "string" && /^[0-9a-f]{24}$/i.test(body.folderId)
      ? body.folderId
      : undefined;

  const docs = rows
    .map((r) => {
      const extra: Record<string, string> = {};

      if (r?.extra && typeof r.extra === "object")
        for (const [k, v] of Object.entries(r.extra).slice(0, 20))
          if (typeof v === "string")
            extra[k.replace(/[.$]/g, "_").slice(0, 60)] = v.slice(0, 300);

      return {
        name: str(r?.name),
        phone: str(r?.phone, 40) || undefined,
        email: str(r?.email) || undefined,
        company: str(r?.company) || undefined,
        category: str(r?.category) || undefined,
        city: str(r?.city, 80) || undefined,
        state: str(r?.state, 80) || undefined,
        website: str(r?.website, 300) || undefined,
        pitch: str(r?.pitch, 500) || undefined,
        hasWebsite: normalizeWebsiteState(r?.hasWebsite),
        extra: Object.keys(extra).length ? extra : undefined,
        batch,
        folder: folderId,
      };
    })
    .filter((d) => d.name && (d.phone || d.email));

  await dbConnect();

  // Re-uploading a sheet updates existing contacts instead of duplicating
  // them. Match on email, then phone digits, then name; only fields whose
  // uploaded value is non-empty and different are written.
  const digits = (v?: string) => (v || "").replace(/\D/g, "");
  const keysOf = (d: { email?: string; phone?: string; name: string }) =>
    [
      d.email ? `e:${d.email.toLowerCase()}` : "",
      digits(d.phone).length >= 7 ? `p:${digits(d.phone)}` : "",
      `n:${d.name.toLowerCase()}`,
    ].filter(Boolean);

  const existing = (await MarketingContact.find()
    .select(
      "name phone email company category city state website pitch hasWebsite extra",
    )
    .lean()) as any[];
  const index = new Map<string, any>();

  for (const e of existing)
    for (const k of keysOf(e)) if (!index.has(k)) index.set(k, e);

  const FIELDS = [
    "name",
    "phone",
    "email",
    "company",
    "category",
    "city",
    "state",
    "website",
    "pitch",
    "hasWebsite",
  ] as const;
  const fresh: any[] = [];
  const updates = new Map<string, Record<string, unknown>>();
  let unchanged = 0;

  for (const d of docs) {
    const match = keysOf(d)
      .map((k) => index.get(k))
      .find(Boolean);

    if (!match) {
      const doc = { ...d, inOutreach: d.hasWebsite !== "" };

      fresh.push(doc);
      for (const k of keysOf(d)) index.set(k, doc);
      continue;
    }

    // Duplicate row inside the same upload: already handled as a new record.
    if (!match._id) {
      unchanged++;
      continue;
    }

    const set: Record<string, unknown> = updates.get(String(match._id)) || {};
    const before = Object.keys(set).length;

    for (const f of FIELDS) {
      const next = d[f];

      if (next && next !== (match as any)[f]) {
        set[f] = next;
        (match as any)[f] = next;
      }
    }
    if (d.extra) {
      const merged = { ...(match.extra || {}), ...d.extra };

      if (JSON.stringify(merged) !== JSON.stringify(match.extra || {})) {
        set.extra = merged;
        match.extra = merged;
      }
    }
    if (Object.keys(set).length > before) updates.set(String(match._id), set);
    else unchanged++;
  }

  if (fresh.length) await MarketingContact.insertMany(fresh);
  if (updates.size)
    await MarketingContact.bulkWrite(
      [...updates].map(([id, $set]) => ({
        updateOne: { filter: { _id: id }, update: { $set } },
      })) as never,
    );

  return NextResponse.json({
    imported: fresh.length,
    updated: updates.size,
    unchanged,
    skipped: rows.length - docs.length,
  });
}

/** Bulk delete by id. */
export async function DELETE(req: NextRequest) {
  const guard = await requireApi("manage:leads");

  if (!guard.ok) return guard.response;

  let body: { ids?: unknown };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const ids = Array.isArray(body.ids)
    ? body.ids.filter(
        (i): i is string => typeof i === "string" && /^[0-9a-f]{24}$/i.test(i),
      )
    : [];

  if (!ids.length)
    return NextResponse.json(
      { error: "No contacts selected." },
      { status: 400 },
    );

  await dbConnect();

  const res = await MarketingContact.deleteMany({ _id: { $in: ids } } as never);

  return NextResponse.json({ deleted: res.deletedCount });
}
