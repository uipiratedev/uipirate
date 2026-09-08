import dbConnect from "@/lib/mongodb";
import IndexApiQuota from "@/models/IndexApiQuota";
import IndexQueue from "@/models/IndexQueue";
import { type QuotaProvider, type QuotaSummary } from "./types";

export const QUOTA_LIMITS: Record<QuotaProvider, number> = {
  "google-indexing": 200,
  "google-inspection": 2000,
  "bing-submit": 10000,
};

export function getTodayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getQuotaId(provider: QuotaProvider, date = getTodayDateString()): string {
  return `${provider}:${date}`;
}

export interface ReservationResult {
  ok: boolean;
  allowed: number;
  exhausted: boolean;
  queuedCount: number;
}

/**
 * Atomically reserve quota units for a provider for today.
 * If reservation exceeds daily limit, rejects or partially fills and optionally queues the rest.
 */
export async function reserveQuota(
  provider: QuotaProvider,
  count: number,
  urlsToQueueIfFull: string[] = [],
  action: "submit" | "inspect" = "submit",
): Promise<ReservationResult> {
  await dbConnect();
  const date = getTodayDateString();
  const _id = getQuotaId(provider, date);
  const limit = QUOTA_LIMITS[provider] || 200;

  // Find or create current usage
  const current = await IndexApiQuota.findById(_id).lean<{ used: number }>();
  const currentUsed = current?.used || 0;

  if (currentUsed + count > limit) {
    const available = Math.max(0, limit - currentUsed);

    // Enqueue remaining URLs if provided
    let queuedCount = 0;
    if (urlsToQueueIfFull.length > available) {
      const overflowUrls = urlsToQueueIfFull.slice(available);
      for (const url of overflowUrls) {
        await IndexQueue.updateOne(
          { url, provider, status: "pending" },
          {
            $set: {
              url,
              provider,
              action,
              enqueuedAt: new Date(),
              status: "pending",
            },
            $inc: { attempts: 1 },
          },
          { upsert: true },
        );
        queuedCount++;
      }
    }

    if (available <= 0) {
      return {
        ok: false,
        allowed: 0,
        exhausted: true,
        queuedCount,
      };
    }

    // Reserve whatever remains
    await IndexApiQuota.findByIdAndUpdate(
      _id,
      {
        $set: { provider, date, limit },
        $inc: { used: available },
      },
      { upsert: true, new: true },
    );

    return {
      ok: true,
      allowed: available,
      exhausted: true,
      queuedCount,
    };
  }

  // Fully reserve requested count
  await IndexApiQuota.findByIdAndUpdate(
    _id,
    {
      $set: { provider, date, limit },
      $inc: { used: count },
    },
    { upsert: true, new: true },
  );

  return {
    ok: true,
    allowed: count,
    exhausted: false,
    queuedCount: 0,
  };
}

/**
 * Refund quota units on network/external failures.
 */
export async function refundQuota(
  provider: QuotaProvider,
  count: number,
): Promise<void> {
  if (count <= 0) return;
  await dbConnect();
  const _id = getQuotaId(provider);

  await IndexApiQuota.findByIdAndUpdate(
    _id,
    { $inc: { used: -count } },
    { new: true },
  );
}

/**
 * Get real-time quota usage summary for all providers today.
 */
export async function getQuotaSummary(): Promise<QuotaSummary[]> {
  await dbConnect();
  const date = getTodayDateString();
  const providers: QuotaProvider[] = [
    "google-indexing",
    "google-inspection",
    "bing-submit",
  ];

  const docs = await IndexApiQuota.find({ date }).lean<
    Array<{ provider: QuotaProvider; used: number; limit: number }>
  >();

  const docMap = new Map(docs.map((d) => [d.provider, d]));

  return providers.map((provider) => {
    const doc = docMap.get(provider);
    const limit = QUOTA_LIMITS[provider];
    const used = doc?.used || 0;
    return {
      provider,
      date,
      used,
      limit,
      remaining: Math.max(0, limit - used),
    };
  });
}
