/**
 * Weekly snapshot of the headline numbers.
 *
 * Weeks are Monday–Sunday, UTC. The cron runs early on Monday and snapshots
 * the week that just ended, so a snapshot is never written for a week that is
 * still in progress.
 */
import dbConnect from "@/lib/mongodb";
import AnalyticsSnapshot from "@/models/analytics/AnalyticsSnapshot";
import AnalyticsSession from "@/models/analytics/AnalyticsSession";
import { countContactActions } from "@/lib/analytics/funnel";
import {
  getAnonymousTotal,
  getBotBreakdown,
  getBotTotal,
  getChannelBreakdown,
} from "@/lib/analytics/anonymous";

const DAY = 86_400_000;

const iso = (d: Date) => d.toISOString().slice(0, 10);

/**
 * The most recent *complete* Monday–Sunday week strictly before `now`.
 * Run on a Monday it returns the week that ended yesterday.
 */
export function lastCompleteWeek(now: Date): {
  from: Date;
  to: Date;
  weekStart: string;
  weekEnd: string;
} {
  const midnight = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
  );
  // getUTCDay: Sun=0 … Sat=6 → days since Monday, Mon=0 … Sun=6.
  const sinceMonday = (new Date(midnight).getUTCDay() + 6) % 7;
  const thisMonday = midnight - sinceMonday * DAY;
  const from = new Date(thisMonday - 7 * DAY);
  const to = new Date(thisMonday - 1); // 23:59:59.999 Sunday

  return {
    from,
    to,
    weekStart: iso(from),
    weekEnd: iso(new Date(thisMonday - DAY)),
  };
}

/** Compute and upsert the snapshot for the week containing `week`. */
export async function takeSnapshot(week = lastCompleteWeek(new Date())) {
  await dbConnect();

  const range = { from: week.from, to: week.to };

  const allVisits = await getAnonymousTotal(range);
  const botHits = await getBotTotal(range);
  const channelRows = await getChannelBreakdown(range);
  const bots = await getBotBreakdown(range, 200);

  const trackedSessions = await AnalyticsSession.countDocuments({
    startedAt: { $gte: week.from, $lte: week.to },
    isBot: { $ne: true },
  });

  const conversions = await countContactActions(range);

  const channels: Record<string, number> = {};

  for (const c of channelRows) channels[c.key] = c.hits;

  const aiCrawls = bots
    .filter((b) => b.botKind === "ai")
    .reduce((n, b) => n + b.hits, 0);

  const doc = {
    weekStart: week.weekStart,
    weekEnd: week.weekEnd,
    allVisits,
    trackedSessions,
    botHits,
    aiCrawls,
    conversions,
    channels,
  };

  // Idempotent: re-running a week overwrites it rather than duplicating.
  await AnalyticsSnapshot.updateOne(
    { weekStart: week.weekStart },
    { $set: doc },
    { upsert: true },
  );

  return doc;
}

export interface SnapshotRow {
  weekStart: string;
  weekEnd: string;
  allVisits: number;
  trackedSessions: number;
  botHits: number;
  aiCrawls: number;
  conversions: number;
  channels: Record<string, number>;
}

/** Most recent snapshots, newest first. */
export async function getSnapshots(limit = 12): Promise<SnapshotRow[]> {
  await dbConnect();

  return (await AnalyticsSnapshot.find({}, { _id: 0, __v: 0, createdAt: 0 })
    .sort({ weekStart: -1 })
    .limit(limit)
    .lean()) as unknown as SnapshotRow[];
}
