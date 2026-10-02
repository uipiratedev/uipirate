import { NextRequest, NextResponse } from "next/server";
import { requireApi } from "@/lib/auth/session";
import { isPublishable } from "@/lib/indexing/publishable";
import { reserveQuota, refundQuota } from "@/lib/indexing/quota";
import { submitBingUrls } from "@/lib/indexing/bing";
import { submitIndexNow } from "@/lib/indexing/indexnow";
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

  for (const url of urls) {
    const check = await isPublishable(url);
    if (!check.publishable) {
      results.push({
        url,
        status: "skipped_draft",
        message: check.reason || "Skipped: unreleased draft or blocked path",
      });
      await pushHistory(url, {
        ts: new Date(),
        source: "bing",
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
      message: "No publishable URLs to submit.",
      results,
    });
  }

  // Reserve Bing quota
  const reservation = await reserveQuota(
    "bing-submit",
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
      message: "Daily Bing submission quota reached. URL queued for nightly drain.",
    });
  }

  if (urlsToExecute.length > 0) {
    // 1. Submit to IndexNow
    const indexNowRes = await submitIndexNow(urlsToExecute);

    // 2. Submit to Bing Webmaster Tools batch
    const bingRes = await submitBingUrls(urlsToExecute);

    for (const url of urlsToExecute) {
      if (bingRes.ok || indexNowRes.ok) {
        await IndexedUrl.updateOne(
          { url },
          {
            $set: {
              "bing.submittedAt": new Date(),
              "bing.lastResponseCode": bingRes.status,
              "bing.lastError": null,
              "indexnow.submittedAt": new Date(),
              "indexnow.statusCode": indexNowRes.status,
            },
          },
          { upsert: true },
        );

        await pushHistory(url, {
          ts: new Date(),
          source: "bing",
          action: "submit",
          result: `Bing (${bingRes.status}) + IndexNow (${indexNowRes.status}) submitted`,
          actorId: guard.user.id,
        });

        results.push({
          url,
          status: "submitted",
          message: `Submitted to Bing & IndexNow (${bingRes.status}/${indexNowRes.status})`,
        });
      } else {
        await refundQuota("bing-submit", 1);

        await IndexedUrl.updateOne(
          { url },
          {
            $set: {
              "bing.lastResponseCode": bingRes.status,
              "bing.lastError": bingRes.error || indexNowRes.error || "Submission failed",
            },
          },
        );

        await pushHistory(url, {
          ts: new Date(),
          source: "bing",
          action: "submit",
          result: `Bing failed: ${bingRes.error || indexNowRes.error}`,
          actorId: guard.user.id,
        });

        results.push({
          url,
          status: "failed",
          message: bingRes.error || indexNowRes.error || "Bing submit failed",
        });
      }
    }
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
