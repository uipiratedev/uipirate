/**
 * Reads of the consent-free counter (`AnalyticsHitDaily`) and the crawler log
 * (`AnalyticsBotDaily`).
 *
 * These answer "how much traffic, from where" for *everyone*, in contrast to
 * `queries.ts`, which reads the session/event tables and therefore only ever
 * sees visitors who granted cookie consent.
 */
import dbConnect from "@/lib/mongodb";
import AnalyticsHitDaily from "@/models/analytics/AnalyticsHitDaily";
import AnalyticsBotDaily from "@/models/analytics/AnalyticsBotDaily";
import AnalyticsNotFoundDaily from "@/models/analytics/AnalyticsNotFoundDaily";

export interface Range {
  from: Date;
  to: Date;
}

function keys(range: Range) {
  return {
    $gte: range.from.toISOString().slice(0, 10),
    $lte: range.to.toISOString().slice(0, 10),
  };
}

export interface ChannelRow {
  key: string;
  hits: number;
}

export interface SourceRow {
  referrer: string;
  channel: string;
  hits: number;
}

/** Total anonymous hits in range. */
export async function getAnonymousTotal(range: Range): Promise<number> {
  await dbConnect();

  const [r] = (await AnalyticsHitDaily.aggregate([
    { $match: { date: keys(range) } },
    { $group: { _id: null, hits: { $sum: "$hits" } } },
  ])) as Array<{ hits: number }>;

  return r?.hits ?? 0;
}

/** Hits per channel, descending. */
export async function getChannelBreakdown(
  range: Range,
): Promise<ChannelRow[]> {
  await dbConnect();

  const rows = (await AnalyticsHitDaily.aggregate([
    { $match: { date: keys(range) } },
    { $group: { _id: "$channel", hits: { $sum: "$hits" } } },
    { $sort: { hits: -1 } },
  ])) as Array<{ _id: string; hits: number }>;

  return rows.map((r) => ({ key: r._id || "direct", hits: r.hits }));
}

/** Top referring hosts, with the channel each belongs to. */
export async function getTopSources(
  range: Range,
  limit = 15,
): Promise<SourceRow[]> {
  await dbConnect();

  const rows = (await AnalyticsHitDaily.aggregate([
    { $match: { date: keys(range), referrerHost: { $nin: [null, ""] } } },
    {
      $group: {
        _id: { host: "$referrerHost", channel: "$channel" },
        hits: { $sum: "$hits" },
      },
    },
    { $sort: { hits: -1 } },
    { $limit: limit },
  ])) as Array<{ _id: { host: string; channel: string }; hits: number }>;

  return rows.map((r) => ({
    referrer: r._id.host,
    channel: r._id.channel,
    hits: r.hits,
  }));
}

/** Daily hits, for the trend chart. */
export async function getHitSeries(
  range: Range,
): Promise<Array<{ date: string; hits: number }>> {
  await dbConnect();

  const rows = (await AnalyticsHitDaily.aggregate([
    { $match: { date: keys(range) } },
    { $group: { _id: "$date", hits: { $sum: "$hits" } } },
    { $sort: { _id: 1 } },
  ])) as Array<{ _id: string; hits: number }>;

  return rows.map((r) => ({ date: r._id, hits: r.hits }));
}

/** Hits per country, descending. */
export async function getCountryBreakdown(
  range: Range,
  limit = 20,
): Promise<Array<{ key: string; hits: number }>> {
  await dbConnect();

  const rows = (await AnalyticsHitDaily.aggregate([
    { $match: { date: keys(range) } },
    { $group: { _id: "$country", hits: { $sum: "$hits" } } },
    { $sort: { hits: -1 } },
    { $limit: limit },
  ])) as Array<{ _id: string; hits: number }>;

  return rows.map((r) => ({ key: r._id || "(unknown)", hits: r.hits }));
}

export interface BotRow {
  botName: string;
  botKind: string;
  hits: number;
}

/** Crawler hits by bot, descending. */
export async function getBotBreakdown(
  range: Range,
  limit = 25,
): Promise<BotRow[]> {
  await dbConnect();

  const rows = (await AnalyticsBotDaily.aggregate([
    { $match: { date: keys(range) } },
    {
      $group: {
        _id: { botName: "$botName", botKind: "$botKind" },
        hits: { $sum: "$hits" },
      },
    },
    { $sort: { hits: -1 } },
    { $limit: limit },
  ])) as Array<{ _id: { botName: string; botKind: string }; hits: number }>;

  return rows.map((r) => ({
    botName: r._id.botName,
    botKind: r._id.botKind,
    hits: r.hits,
  }));
}

/** Total crawler hits in range. */
export async function getBotTotal(range: Range): Promise<number> {
  await dbConnect();

  const [r] = (await AnalyticsBotDaily.aggregate([
    { $match: { date: keys(range) } },
    { $group: { _id: null, hits: { $sum: "$hits" } } },
  ])) as Array<{ hits: number }>;

  return r?.hits ?? 0;
}

export interface NotFoundRow {
  path: string;
  hits: number;
  /** Most common referring host for this URL ("" when direct). */
  topReferrer: string;
}

/** Most-hit missing URLs, with who is linking to them. */
export async function getNotFoundTop(
  range: Range,
  limit = 20,
): Promise<NotFoundRow[]> {
  await dbConnect();

  const rows = (await AnalyticsNotFoundDaily.aggregate([
    { $match: { date: keys(range) } },
    {
      $group: {
        _id: { path: "$path", ref: "$referrerHost" },
        hits: { $sum: "$hits" },
      },
    },
  ])) as unknown as Array<{ _id: { path: string; ref: string }; hits: number }>;

  const by = new Map<
    string,
    { hits: number; refs: Map<string, number> }
  >();

  for (const r of rows) {
    const e = by.get(r._id.path) ?? { hits: 0, refs: new Map() };

    e.hits += r.hits;
    e.refs.set(r._id.ref, (e.refs.get(r._id.ref) ?? 0) + r.hits);
    by.set(r._id.path, e);
  }

  return [...by.entries()]
    .map(([path, e]) => {
      // Prefer a real referrer over "direct" when naming the source.
      const named = [...e.refs.entries()]
        .filter(([ref]) => ref)
        .sort((a, b) => b[1] - a[1]);

      return { path, hits: e.hits, topReferrer: named[0]?.[0] ?? "" };
    })
    .sort((a, b) => b.hits - a.hits)
    .slice(0, limit);
}
