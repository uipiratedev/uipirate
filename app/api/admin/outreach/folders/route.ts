import { NextRequest, NextResponse } from "next/server";

import { requireApi } from "@/lib/auth/session";
import dbConnect from "@/lib/mongodb";
import MarketingContact from "@/models/MarketingContact";
import MarketingFolder from "@/models/MarketingFolder";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Folders with the contact count for the requested stage. */
export async function GET(req: NextRequest) {
  const guard = await requireApi("view:leads");

  if (!guard.ok) return guard.response;

  await dbConnect();

  const stage = req.nextUrl.searchParams.get("stage");
  const match: Record<string, unknown> =
    stage === "outreach"
      ? { inOutreach: true }
      : { inOutreach: { $ne: true } };

  const [folders, counts] = await Promise.all([
    (MarketingFolder.find() as any).sort({ createdAt: -1 }).lean() as Promise<
      any[]
    >,
    MarketingContact.aggregate([
      { $match: match },
      { $group: { _id: "$folder", n: { $sum: 1 } } },
    ]),
  ]);

  const byFolder = new Map<string | null, number>(
    counts.map((c) => [c._id ?? null, c.n]),
  );
  const list = folders.map((f) => ({
    id: String(f._id),
    name: f.name,
    count: byFolder.get(String(f._id)) ?? 0,
    createdAt: new Date(f.createdAt).toISOString(),
  }));

  return NextResponse.json({
    folders: stage === "outreach" ? list.filter((f) => f.count > 0) : list,
    unsorted: byFolder.get(null) ?? 0,
  });
}

export async function POST(req: NextRequest) {
  const guard = await requireApi("manage:leads");

  if (!guard.ok) return guard.response;

  let body: { name?: unknown };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim().slice(0, 80) : "";

  if (!name)
    return NextResponse.json(
      { error: "Folder name is required." },
      { status: 400 },
    );

  await dbConnect();

  const folder = await MarketingFolder.create({ name });

  return NextResponse.json({ id: String(folder._id), name: folder.name });
}

/** Rename a folder. id "none" turns the unsorted contacts into a real folder. */
export async function PATCH(req: NextRequest) {
  const guard = await requireApi("manage:leads");

  if (!guard.ok) return guard.response;

  let body: { id?: unknown; name?: unknown };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim().slice(0, 80) : "";
  const id = typeof body.id === "string" ? body.id : "";

  if (!name)
    return NextResponse.json(
      { error: "Folder name is required." },
      { status: 400 },
    );

  await dbConnect();

  if (id === "none") {
    const folder = await MarketingFolder.create({ name });

    await MarketingContact.updateMany(
      { folder: { $in: [null, ""] } } as never,
      { $set: { folder: String(folder._id) } },
    );

    return NextResponse.json({ id: String(folder._id), name: folder.name });
  }

  if (!/^[0-9a-f]{24}$/i.test(id))
    return NextResponse.json({ error: "Invalid folder." }, { status: 400 });

  await MarketingFolder.updateOne({ _id: id } as never, { $set: { name } });

  return NextResponse.json({ id, name });
}

/** Delete a folder and every contact inside it. */
export async function DELETE(req: NextRequest) {
  const guard = await requireApi("manage:leads");

  if (!guard.ok) return guard.response;

  const id = req.nextUrl.searchParams.get("id") || "";

  if (!/^[0-9a-f]{24}$/i.test(id))
    return NextResponse.json({ error: "Invalid folder." }, { status: 400 });

  await dbConnect();

  const res = await MarketingContact.deleteMany({ folder: id } as never);

  await MarketingFolder.deleteOne({ _id: id } as never);

  return NextResponse.json({ deletedContacts: res.deletedCount });
}
