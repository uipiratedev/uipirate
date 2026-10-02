import { NextRequest, NextResponse } from "next/server";
import { requireApi } from "@/lib/auth/session";
import { getIndexedUrlById, toggleIntentionalNoindex } from "@/lib/indexing/repo";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const guard = await requireApi("manage:indexing");
  if (!guard.ok) return guard.response;

  const item = await getIndexedUrlById(params.id);
  if (!item) {
    return NextResponse.json({ error: "Indexed URL not found" }, { status: 404 });
  }

  return NextResponse.json({ item });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const guard = await requireApi("manage:indexing");
  if (!guard.ok) return guard.response;

  const body = await req.json().catch(() => ({}));
  if (typeof body.noindexIntentional !== "boolean") {
    return NextResponse.json(
      { error: "Invalid payload: noindexIntentional boolean required" },
      { status: 400 },
    );
  }

  const updated = await toggleIntentionalNoindex(
    params.id,
    body.noindexIntentional,
  );

  if (!updated) {
    return NextResponse.json({ error: "Indexed URL not found" }, { status: 404 });
  }

  return NextResponse.json({ item: updated });
}
