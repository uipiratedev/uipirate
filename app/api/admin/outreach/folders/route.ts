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
  const parentId = req.nextUrl.searchParams.get("parentId");
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

  const rawList = folders.map((f) => ({
    id: String(f._id),
    name: f.name,
    parentId: f.parentId ? String(f.parentId) : null,
    directCount: byFolder.get(String(f._id)) ?? 0,
    createdAt: new Date(f.createdAt).toISOString(),
  }));

  // Group child states by parentId
  const statesByParent = new Map<string, typeof rawList>();
  for (const item of rawList) {
    if (item.parentId) {
      const arr = statesByParent.get(item.parentId) || [];
      arr.push(item);
      statesByParent.set(item.parentId, arr);
    }
  }

  // Enrich with aggregated counts and state counts
  const enriched = rawList.map((item) => {
    const children = statesByParent.get(item.id) || [];
    const childSum = children.reduce((sum, ch) => sum + ch.directCount, 0);

    return {
      id: item.id,
      name: item.name,
      parentId: item.parentId,
      stateCount: children.length,
      // For parent countries, count is direct contacts plus child states' contacts.
      // For states, count is direct contacts.
      count: item.parentId ? item.directCount : item.directCount + childSum,
      createdAt: item.createdAt,
    };
  });

  let result = enriched;
  if (parentId !== null && parentId !== undefined) {
    result =
      parentId === "root" || parentId === ""
        ? enriched.filter((f) => !f.parentId)
        : enriched.filter((f) => f.parentId === parentId);
  }

  return NextResponse.json({
    folders: stage === "outreach" ? result.filter((f) => f.count > 0) : result,
    unsorted: byFolder.get(null) ?? 0,
  });
}

export async function POST(req: NextRequest) {
  const guard = await requireApi("manage:leads");

  if (!guard.ok) return guard.response;

  let body: { name?: unknown; parentId?: unknown };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim().slice(0, 80) : "";
  const parentId =
    typeof body.parentId === "string" && /^[0-9a-f]{24}$/i.test(body.parentId)
      ? body.parentId
      : null;

  if (!name)
    return NextResponse.json(
      { error: "Folder name is required." },
      { status: 400 },
    );

  await dbConnect();

  const folder = await MarketingFolder.create({ name, parentId });

  return NextResponse.json({
    id: String(folder._id),
    name: folder.name,
    parentId: folder.parentId ? String(folder.parentId) : null,
  });
}

/** Rename a folder or change its parent country. */
export async function PATCH(req: NextRequest) {
  const guard = await requireApi("manage:leads");

  if (!guard.ok) return guard.response;

  let body: { id?: unknown; name?: unknown; parentId?: unknown };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim().slice(0, 80) : "";
  const id = typeof body.id === "string" ? body.id : "";
  const parentIdProvided = "parentId" in body;
  const parentId =
    typeof body.parentId === "string" && /^[0-9a-f]{24}$/i.test(body.parentId)
      ? body.parentId
      : null;

  if (!name && !parentIdProvided)
    return NextResponse.json(
      { error: "Folder name or parent is required." },
      { status: 400 },
    );

  await dbConnect();

  if (id === "none") {
    const folder = await MarketingFolder.create({
      name: name || "Unsorted",
      parentId,
    });

    await MarketingContact.updateMany(
      { folder: { $in: [null, ""] } } as never,
      { $set: { folder: String(folder._id) } },
    );

    return NextResponse.json({
      id: String(folder._id),
      name: folder.name,
      parentId: folder.parentId ? String(folder.parentId) : null,
    });
  }

  if (!/^[0-9a-f]{24}$/i.test(id))
    return NextResponse.json({ error: "Invalid folder." }, { status: 400 });

  const update: Record<string, unknown> = {};
  if (name) update.name = name;
  if (parentIdProvided) update.parentId = parentId;

  await MarketingFolder.updateOne({ _id: id } as never, { $set: update });

  return NextResponse.json({ id, name, parentId });
}

/** Delete a folder and its contacts (and any child states if deleting a country). */
export async function DELETE(req: NextRequest) {
  const guard = await requireApi("manage:leads");

  if (!guard.ok) return guard.response;

  const id = req.nextUrl.searchParams.get("id") || "";

  if (!/^[0-9a-f]{24}$/i.test(id))
    return NextResponse.json({ error: "Invalid folder." }, { status: 400 });

  await dbConnect();

  const childFolders = ((await (
    MarketingFolder.find({ parentId: id }) as any
  ).lean()) || []) as Array<{ _id: unknown }>;
  const folderIdsToDelete = [id, ...childFolders.map((c) => String(c._id))];

  const res = await MarketingContact.deleteMany({
    folder: { $in: folderIdsToDelete },
  } as never);

  await (MarketingFolder.deleteMany as any)({
    _id: { $in: folderIdsToDelete },
  });

  return NextResponse.json({ deletedContacts: res.deletedCount });
}
