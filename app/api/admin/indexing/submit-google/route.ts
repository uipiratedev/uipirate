import { NextRequest, NextResponse } from "next/server";
import { requireApi } from "@/lib/auth/session";
import { isPublishable } from "@/lib/indexing/publishable";
import { reserveQuota, refundQuota } from "@/lib/indexing/quota";
import { publishGoogleUrl } from "@/lib/indexing/google";
import { pushHistory } from "@/lib/indexing/repo";
import IndexedUrl from "@/models/IndexedUrl";
import dbConnect from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  const guard = await requireApi("manage:indexing");
  if (!guard.ok) return guard.response;

  const body = await req.json().catch(() => ({}));
  const urls: string[] = Array.isArray(body.urls) ? body.urls : body.url ? [body.url] : [];

  if (!urls.length) {
    return NextResponse.json({ error: "No URLs provided for submission" }, { status: 400 });
  }

  await dbConnect();

  const results: Array<{
    url: string;
    status: "submitted" | "skipped_draft" | "queued" | "failed";
    message: string;
  }> = [];

  const publishableUrls: string[] = [];

  // 1. Safety & Draft Guard
  for (const url of urls) {
    const check = await isPublishable(url);
    if (!check.publishable) {
      results.push({
        url,
        status: "skipped_draft",
        message: check.reason || "Skipped: unreleased draft or blocked path",
      });
      // Push history event about skipped submission
      await pushHistory(url, {
        ts: new Date(),
        source: "google",
        action: "submit",
        result: `Blocked: ${check.reason || "Draft held"}`,
        actorId: guard.user.id,
      }).catch(() => {});
    } else {
      publishableUrls.push(url);
    }
  }

  if (!publishableUrls.length) {
    return NextResponse.json({
      success: false,
      message: "No publishable URLs to submit (all were drafts or excluded).",
      results,
    });
  }

  // 2. Reserve Quota
  const reservation = await reserveQuota(
    "google-indexing",
    publishableUrls.length,
    publishableUrls,
    "submit",
  );

  const urlsToExecute = publishableUrls.slice(0, reservation.allowed);
  const queuedUrls = publishableUrls.slice(reservation.allowed);

  for (const url of queuedUrls) {
    results.push({
      url,
      status: "queued",
      message: "Daily Google Indexing quota reached. URL queued for nightly drain.",
    });
  }

  // 3. Execute Submissions for allowed quota
  for (const url of urlsToExecute) {
    const pubRes = await publishGoogleUrl(url, "URL_UPDATED");

    if (pubRes.ok) {
      await IndexedUrl.updateOne(
        { url },
        {
          $set: {
            "google.submittedAt": new Date(),
            "google.lastResponseCode": pubRes.status,
            "google.lastError": null,
          },
        },
        { upsert: true },
      );

      await pushHistory(url, {
        ts: new Date(),
        source: "google",
        action: "submit",
        result: `Google Indexing API: ${pubRes.status} OK${pubRes.mocked ? " (local/dev)" : ""}`,
        actorId: guard.user.id,
      });

      results.push({
        url,
        status: "submitted",
        message: `Successfully submitted to Google Indexing API (${pubRes.status})`,
      });
    } else {
      // Refund quota unit
      await refundQuota("google-indexing", 1);

      await IndexedUrl.updateOne(
        { url },
        {
          $set: {
            "google.lastResponseCode": pubRes.status,
            "google.lastError": pubRes.error || "Submission failed",
          },
        },
      );

      await pushHistory(url, {
        ts: new Date(),
        source: "google",
        action: "submit",
        result: `Failed (${pubRes.status}): ${pubRes.error}`,
        actorId: guard.user.id,
      });

      results.push({
        url,
        status: "failed",
        message: pubRes.error || "Google Indexing API error",
      });
    }

    // Rate-limit throttle (300ms)
    await new Promise((r) => setTimeout(r, 300));
  }

  return NextResponse.json({
    success: true,
    results,
    summary: {
      total: urls.length,
      submitted: results.filter((r) => r.status === "submitted").length,
      skippedDrafts: results.filter((r) => r.status === "skipped_draft").length,
      queued: results.filter((r) => r.status === "queued").length,
      failed: results.filter((r) => r.status === "failed").length,
    },
  });
}
