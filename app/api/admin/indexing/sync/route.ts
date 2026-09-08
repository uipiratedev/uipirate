import { NextResponse } from "next/server";
import { requireApi } from "@/lib/auth/session";
import { reconcileSitemap } from "@/lib/indexing/sync";

export async function POST() {
  const guard = await requireApi("manage:indexing");
  if (!guard.ok) return guard.response;

  try {
    const summary = await reconcileSitemap(guard.user.id);
    return NextResponse.json({
      success: true,
      message: `Sitemap synchronized: ${summary.totalInSitemap} live URLs (${summary.newlyAdded} added, ${summary.updated} updated, ${summary.removedFromSitemap} removed).`,
      summary,
    });
  } catch (err: any) {
    console.error("Sitemap sync error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to reconcile sitemap" },
      { status: 500 },
    );
  }
}
