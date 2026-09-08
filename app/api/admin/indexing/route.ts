import { NextRequest, NextResponse } from "next/server";
import { requireApi } from "@/lib/auth/session";
import { listIndexedUrls, getIndexingKpis } from "@/lib/indexing/repo";
import { reconcileSitemap } from "@/lib/indexing/sync";
import IndexedUrl from "@/models/IndexedUrl";
import dbConnect from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  const guard = await requireApi("manage:indexing");
  if (!guard.ok) return guard.response;

  await dbConnect();

  // If database has 0 indexed URLs, run an initial sync automatically
  const count = await IndexedUrl.countDocuments();
  if (count === 0) {
    try {
      await reconcileSitemap(guard.user.id);
    } catch (e) {
      console.warn("Auto-initial sitemap sync warning:", e);
    }
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || undefined;
  const engine = searchParams.get("engine") || undefined;
  const status = searchParams.get("status") || undefined;
  const type = searchParams.get("type") || undefined;
  const inSitemap = searchParams.get("inSitemap") || undefined;
  const isDraft = searchParams.get("isDraft") || undefined;
  const page = searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : 1;
  const pageSize = searchParams.get("pageSize") ? parseInt(searchParams.get("pageSize")!, 10) : 25;
  const sortBy = searchParams.get("sortBy") || undefined;
  const sortDir = (searchParams.get("sortDir") as "asc" | "desc") || "desc";

  const [list, kpis] = await Promise.all([
    listIndexedUrls({
      q,
      engine,
      status,
      type,
      inSitemap,
      isDraft,
      page,
      pageSize,
      sortBy,
      sortDir,
    }),
    getIndexingKpis(),
  ]);

  return NextResponse.json({
    ...list,
    kpis,
  });
}
