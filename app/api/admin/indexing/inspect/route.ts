import { NextRequest, NextResponse } from "next/server";
import { requireApi } from "@/lib/auth/session";
import { reserveQuota, refundQuota } from "@/lib/indexing/quota";
import { inspectGoogleUrl } from "@/lib/indexing/google";
import { getBingUrlInfo } from "@/lib/indexing/bing";
import { pushHistory } from "@/lib/indexing/repo";
import IndexedUrl from "@/models/IndexedUrl";
import dbConnect from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  const guard = await requireApi("manage:indexing");
  if (!guard.ok) return guard.response;

  const body = await req.json().catch(() => ({}));
  const urls: string[] = Array.isArray(body.urls) ? body.urls : body.url ? [body.url] : [];

  if (!urls.length) {
    return NextResponse.json({ error: "No URLs provided to inspect" }, { status: 400 });
  }

  await dbConnect();

  // Reserve inspection quota
  const reservation = await reserveQuota(
    "google-inspection",
    urls.length,
    urls,
    "inspect",
  );

  const urlsToExecute = urls.slice(0, reservation.allowed);
  const queuedUrls = urls.slice(reservation.allowed);

  const results: Array<{
    url: string;
    googleVerdict: string | null;
    coverageState: string | null;
    bingIndexed: boolean | null;
    status: "inspected" | "queued" | "failed";
    error?: string;
  }> = [];

  for (const url of queuedUrls) {
    results.push({
      url,
      googleVerdict: null,
      coverageState: null,
      bingIndexed: null,
      status: "queued",
      error: "Daily inspection quota reached. URL queued.",
    });
  }

  for (const url of urlsToExecute) {
    const [googleRes, bingRes] = await Promise.all([
      inspectGoogleUrl(url),
      getBingUrlInfo(url),
    ]);

    if (googleRes.ok) {
      const existing = await IndexedUrl.findOne({ url });
      const previousCoverage = existing?.google?.coverageState;

      await IndexedUrl.updateOne(
        { url },
        {
          $set: {
            "google.lastInspectedAt": new Date(),
            "google.verdict": googleRes.verdict,
            "google.coverageState": googleRes.coverageState,
            "google.indexingState": googleRes.indexingState,
            "google.robotsTxtState": googleRes.robotsTxtState,
            "google.lastCrawlTime": googleRes.lastCrawlTime,
            "google.googleCanonical": googleRes.googleCanonical,
            "google.userCanonical": googleRes.userCanonical || url,
            "google.lastError": null,
            "bing.lastInspectedAt": new Date(),
            "bing.indexed": bingRes.indexed,
            "bing.lastCrawlTime": bingRes.lastCrawlTime,
            "bing.lastError": bingRes.error || null,
          },
        },
        { upsert: true },
      );

      const statusChanged =
        previousCoverage &&
        googleRes.coverageState &&
        previousCoverage !== googleRes.coverageState;

      await pushHistory(url, {
        ts: new Date(),
        source: "google",
        action: statusChanged ? "status-change" : "inspect",
        result: `Inspected: ${googleRes.coverageState || googleRes.verdict || "OK"}`,
        actorId: guard.user.id,
      });

      results.push({
        url,
        googleVerdict: googleRes.verdict,
        coverageState: googleRes.coverageState,
        bingIndexed: bingRes.indexed,
        status: "inspected",
      });
    } else {
      await refundQuota("google-inspection", 1);

      await IndexedUrl.updateOne(
        { url },
        {
          $set: {
            "google.lastError": googleRes.error || "Inspection call failed",
          },
        },
      );

      await pushHistory(url, {
        ts: new Date(),
        source: "google",
        action: "inspect",
        result: `Inspection failed: ${googleRes.error}`,
        actorId: guard.user.id,
      });

      results.push({
        url,
        googleVerdict: null,
        coverageState: null,
        bingIndexed: null,
        status: "failed",
        error: googleRes.error,
      });
    }

    // Rate limiting delay (200ms)
    await new Promise((r) => setTimeout(r, 200));
  }

  return NextResponse.json({
    success: true,
    results,
    summary: {
      total: urls.length,
      inspected: results.filter((r) => r.status === "inspected").length,
      queued: results.filter((r) => r.status === "queued").length,
      failed: results.filter((r) => r.status === "failed").length,
    },
  });
}
