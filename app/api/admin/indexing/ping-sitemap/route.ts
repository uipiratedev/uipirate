import { NextResponse } from "next/server";
import { requireApi } from "@/lib/auth/session";
import { submitSitemapToGSC } from "@/lib/indexing/google";
import { submitIndexNow } from "@/lib/indexing/indexnow";
import sitemap from "@/app/sitemap";

export async function POST() {
  const guard = await requireApi("manage:indexing");
  if (!guard.ok) return guard.response;

  try {
    const [gscRes] = await Promise.all([
      submitSitemapToGSC("sitemap.xml"),
    ]);

    // Also submit top priority pages to IndexNow
    const entries = await sitemap();
    const topUrls = entries.slice(0, 50).map((e) => e.url);
    const indexNowRes = await submitIndexNow(topUrls);

    return NextResponse.json({
      success: true,
      message: "Sitemap submitted to Google Search Console and Bing IndexNow.",
      gsc: gscRes,
      indexnow: indexNowRes,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to resubmit sitemap" },
      { status: 500 },
    );
  }
}
