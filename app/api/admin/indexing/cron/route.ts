import { NextRequest, NextResponse } from "next/server";
import { reconcileSitemap } from "@/lib/indexing/sync";
import { inspectGoogleUrl } from "@/lib/indexing/google";
import { getBingUrlInfo } from "@/lib/indexing/bing";
import { publishGoogleUrl } from "@/lib/indexing/google";
import { submitBingUrls } from "@/lib/indexing/bing";
import { submitIndexNow } from "@/lib/indexing/indexnow";
import { reserveQuota } from "@/lib/indexing/quota";
import { pushHistory } from "@/lib/indexing/repo";
import IndexedUrl from "@/models/IndexedUrl";
import IndexQueue from "@/models/IndexQueue";
import dbConnect from "@/lib/mongodb";

function isAuthorizedCron(req: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return true; // dev mode allow

  const authHeader = req.headers.get("authorization");
  if (authHeader === `Bearer ${cronSecret}`) return true;

  const headerSecret = req.headers.get("x-cron-secret");
  if (headerSecret === cronSecret) return true;

  return false;
}

export async function GET(req: NextRequest) {
  return handleCron(req);
}

export async function POST(req: NextRequest) {
  return handleCron(req);
}

async function handleCron(req: NextRequest) {
  if (!isAuthorizedCron(req)) {
    return NextResponse.json({ error: "Unauthorized cron trigger" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action") || "all";

  await dbConnect();

  const results: Record<string, any> = {};

  // 1. Sync
  if (action === "all" || action === "sync") {
    try {
      results.sync = await reconcileSitemap("cron");
    } catch (e: any) {
      results.sync = { error: e.message };
    }
  }

  // 2. Nightly inspect sweep (oldest lastInspectedAt first, live URLs only)
  if (action === "all" || action === "inspect") {
    try {
      const candidates = await IndexedUrl.find({ isDraft: false, inSitemap: true })
        .sort({ "google.lastInspectedAt": 1 })
        .limit(20)
        .lean();

      let inspectedCount = 0;
      const reservation = await reserveQuota("google-inspection", candidates.length);
      const toInspect = candidates.slice(0, reservation.allowed);

      for (const doc of toInspect) {
        const [googleRes, bingRes] = await Promise.all([
          inspectGoogleUrl(doc.url),
          getBingUrlInfo(doc.url),
        ]);

        if (googleRes.ok) {
          await IndexedUrl.updateOne(
            { url: doc.url },
            {
              $set: {
                "google.lastInspectedAt": new Date(),
                "google.verdict": googleRes.verdict,
                "google.coverageState": googleRes.coverageState,
                "google.indexingState": googleRes.indexingState,
                "google.robotsTxtState": googleRes.robotsTxtState,
                "google.lastCrawlTime": googleRes.lastCrawlTime,
                "google.googleCanonical": googleRes.googleCanonical,
                "bing.lastInspectedAt": new Date(),
                "bing.indexed": bingRes.indexed,
                "bing.lastCrawlTime": bingRes.lastCrawlTime,
              },
            },
          );

          if (doc.google?.coverageState !== googleRes.coverageState) {
            await pushHistory(doc.url, {
              ts: new Date(),
              source: "cron",
              action: "status-change",
              result: `Nightly sweep: ${googleRes.coverageState || googleRes.verdict || "OK"}`,
            });
          }
          inspectedCount++;
        }

        await new Promise((r) => setTimeout(r, 200));
      }

      results.inspect = { attempted: candidates.length, inspected: inspectedCount };
    } catch (e: any) {
      results.inspect = { error: e.message };
    }
  }

  // 3. Drain overflow queue
  if (action === "all" || action === "drain") {
    try {
      const queueItems = await IndexQueue.find({ status: "pending" })
        .sort({ enqueuedAt: 1 })
        .limit(20);

      let drainedCount = 0;

      for (const item of queueItems) {
        if (item.provider === "google-indexing") {
          const res = await publishGoogleUrl(item.url);
          if (res.ok) {
            item.status = "done";
            await item.save();
            drainedCount++;
          }
        } else if (item.provider === "bing-submit") {
          const res = await submitBingUrls([item.url]);
          await submitIndexNow([item.url]);
          if (res.ok) {
            item.status = "done";
            await item.save();
            drainedCount++;
          }
        }
      }

      results.drain = { drainedCount };
    } catch (e: any) {
      results.drain = { error: e.message };
    }
  }

  return NextResponse.json({ success: true, timestamp: new Date().toISOString(), results });
}
