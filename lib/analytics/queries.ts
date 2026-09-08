/**
 * Read-side analytics. Every function takes a UTC [from, to) window and runs a
 * MongoDB aggregation over the first-party collections. Bot traffic is excluded
 * everywhere (`isBot: false`).
 *
 * These run on demand — no pre-aggregation required. The optional
 * AnalyticsPageDaily rollup (Phase E) can accelerate wide ranges later.
 */
import dbConnect from "@/lib/mongodb";
import AnalyticsEvent from "@/models/analytics/AnalyticsEvent";
import AnalyticsSession from "@/models/analytics/AnalyticsSession";
import AnalyticsVisitor from "@/models/analytics/AnalyticsVisitor";
import Lead from "@/models/Lead";
import Estimate from "@/models/Estimate";

export type Granularity = "hour" | "day" | "week" | "month";

interface Range {
  from: Date;
  to: Date;
}

const notBot = { isBot: { $ne: true } };

function eventMatch({ from, to }: Range, extra: Record<string, unknown> = {}) {
  return { occurredAt: { $gte: from, $lt: to }, ...notBot, ...extra };
}

function sessionMatch(
  { from, to }: Range,
  extra: Record<string, unknown> = {},
) {
  return { startedAt: { $gte: from, $lt: to }, ...notBot, ...extra };
}

/** A session counts as a bounce: one page view and no engagement heartbeat. */
const BOUNCE_EXPR = {
  $and: [{ $lte: ["$pageViewCount", 1] }, { $lt: ["$durationMs", 15000] }],
};

// ─── KPI summary ──────────────────────────────────────────────────────────────

export async function getSummary(range: Range) {
  await dbConnect();

  const [visitorAgg, sessionAgg, pageviews, newLeads, newEstimates] =
    await Promise.all([
      AnalyticsEvent.aggregate([
        { $match: eventMatch(range) },
        { $group: { _id: null, v: { $addToSet: "$visitorId" } } },
        { $project: { count: { $size: "$v" } } },
      ]),
      AnalyticsSession.aggregate([
        { $match: sessionMatch(range) },
        {
          $group: {
            _id: null,
            sessions: { $sum: 1 },
            avgDurationMs: { $avg: "$durationMs" },
            bounces: { $sum: { $cond: [BOUNCE_EXPR, 1, 0] } },
            totalPageViews: { $sum: "$pageViewCount" },
          },
        },
      ]),
      AnalyticsEvent.countDocuments(eventMatch(range, { type: "page_view" })),
      Lead.countDocuments({ createdAt: { $gte: range.from, $lt: range.to } }),
      Estimate.countDocuments({
        createdAt: { $gte: range.from, $lt: range.to },
      }),
    ]);

  const s = sessionAgg[0] || {};
  const sessions = s.sessions || 0;

  return {
    visitors: visitorAgg[0]?.count || 0,
    sessions,
    pageviews,
    avgSessionDurationMs: Math.round(s.avgDurationMs || 0),
    bounceRate: sessions ? (s.bounces || 0) / sessions : 0,
    pagesPerSession: sessions ? (s.totalPageViews || 0) / sessions : 0,
    newLeads: newLeads + newEstimates,
  };
}

// ─── time series ──────────────────────────────────────────────────────────────

export async function getTimeSeries(range: Range, unit: Granularity) {
  await dbConnect();

  const [pv, sess] = await Promise.all([
    AnalyticsEvent.aggregate([
      { $match: eventMatch(range, { type: "page_view" }) },
      {
        $group: {
          _id: { $dateTrunc: { date: "$occurredAt", unit } },
          pageviews: { $sum: 1 },
          visitors: { $addToSet: "$visitorId" },
        },
      },
      {
        $project: {
          _id: 0,
          bucket: "$_id",
          pageviews: 1,
          visitors: { $size: "$visitors" },
        },
      },
      { $sort: { bucket: 1 } },
    ]),
    AnalyticsSession.aggregate([
      { $match: sessionMatch(range) },
      {
        $group: {
          _id: { $dateTrunc: { date: "$startedAt", unit } },
          sessions: { $sum: 1 },
        },
      },
      { $project: { _id: 0, bucket: "$_id", sessions: 1 } },
      { $sort: { bucket: 1 } },
    ]),
  ]);

  const map = new Map<
    string,
    { bucket: string; pageviews: number; visitors: number; sessions: number }
  >();

  for (const r of pv) {
    const key = new Date(r.bucket).toISOString();

    map.set(key, {
      bucket: key,
      pageviews: r.pageviews,
      visitors: r.visitors,
      sessions: 0,
    });
  }
  for (const r of sess) {
    const key = new Date(r.bucket).toISOString();
    const existing = map.get(key);

    if (existing) existing.sessions = r.sessions;
    else
      map.set(key, {
        bucket: key,
        pageviews: 0,
        visitors: 0,
        sessions: r.sessions,
      });
  }

  return [...map.values()].sort((a, b) => a.bucket.localeCompare(b.bucket));
}

// ─── breakdowns ───────────────────────────────────────────────────────────────

async function sessionBreakdown(range: Range, field: string, limit = 12) {
  await dbConnect();

  const rows = await AnalyticsSession.aggregate([
    { $match: sessionMatch(range) },
    {
      $group: {
        _id: { $ifNull: [`$${field}`, "(unknown)"] },
        sessions: { $sum: 1 },
        visitors: { $addToSet: "$visitorId" },
      },
    },
    {
      $project: {
        _id: 0,
        key: "$_id",
        sessions: 1,
        visitors: { $size: "$visitors" },
      },
    },
    { $sort: { sessions: -1 } },
    { $limit: limit },
  ]);

  return rows as Array<{ key: string; sessions: number; visitors: number }>;
}

export async function getTrafficBreakdowns(range: Range) {
  const [source, country, deviceType, browser, os, landing, newReturning] =
    await Promise.all([
      sessionBreakdown(range, "referrerType"),
      sessionBreakdown(range, "geo.country"),
      sessionBreakdown(range, "device.type"),
      sessionBreakdown(range, "device.browser"),
      sessionBreakdown(range, "device.os"),
      sessionBreakdown(range, "entryPath", 15),
      AnalyticsSession.aggregate([
        { $match: sessionMatch(range) },
        {
          $group: {
            _id: "$isNewVisitor",
            sessions: { $sum: 1 },
          },
        },
      ]),
    ]);

  const nr = { new: 0, returning: 0 };

  for (const r of newReturning as Array<{ _id: boolean; sessions: number }>) {
    if (r._id) nr.new = r.sessions;
    else nr.returning = r.sessions;
  }

  return {
    source,
    country,
    deviceType,
    browser,
    os,
    landing,
    newReturning: nr,
  };
}

// ─── referrer detail (top referring hosts) ────────────────────────────────────

export async function getTopReferrers(range: Range, limit = 15) {
  await dbConnect();

  return AnalyticsSession.aggregate([
    { $match: sessionMatch(range, { referrer: { $nin: [null, ""] } }) },
    { $group: { _id: "$referrer", sessions: { $sum: 1 } } },
    { $sort: { sessions: -1 } },
    { $limit: limit },
    { $project: { _id: 0, referrer: "$_id", sessions: 1 } },
  ]) as Promise<Array<{ referrer: string; sessions: number }>>;
}

// ─── pages report ─────────────────────────────────────────────────────────────

export async function getPagesReport(range: Range, limit = 100) {
  await dbConnect();

  const [views, closes, entries, exits] = await Promise.all([
    AnalyticsEvent.aggregate([
      { $match: eventMatch(range, { type: "page_view" }) },
      {
        $group: {
          _id: "$path",
          views: { $sum: 1 },
          visitors: { $addToSet: "$visitorId" },
        },
      },
      {
        $project: {
          _id: 0,
          path: "$_id",
          views: 1,
          uniqueVisitors: { $size: "$visitors" },
        },
      },
      { $sort: { views: -1 } },
      { $limit: limit },
    ]),
    AnalyticsEvent.aggregate([
      { $match: eventMatch(range, { type: "page_close" }) },
      {
        $group: {
          _id: "$path",
          avgDwellMs: { $avg: "$dwellMs" },
          avgScrollDepth: { $avg: "$scrollDepthMax" },
          samples: { $sum: 1 },
        },
      },
    ]),
    AnalyticsSession.aggregate([
      { $match: sessionMatch(range) },
      {
        $group: {
          _id: "$entryPath",
          entrances: { $sum: 1 },
          bounces: { $sum: { $cond: [BOUNCE_EXPR, 1, 0] } },
        },
      },
    ]),
    AnalyticsSession.aggregate([
      { $match: sessionMatch(range) },
      { $group: { _id: "$exitPath", exits: { $sum: 1 } } },
    ]),
  ]);

  const closeMap = new Map(closes.map((c: any) => [c._id, c]));
  const entryMap = new Map(entries.map((e: any) => [e._id, e]));
  const exitMap = new Map(exits.map((e: any) => [e._id, e]));

  return views.map((v: any) => {
    const c = closeMap.get(v.path);
    const e = entryMap.get(v.path);

    return {
      path: v.path,
      views: v.views,
      uniqueVisitors: v.uniqueVisitors,
      avgDwellMs: Math.round(c?.avgDwellMs || 0),
      avgScrollDepth: Math.round(c?.avgScrollDepth || 0),
      entrances: e?.entrances || 0,
      exits: exitMap.get(v.path)?.exits || 0,
      bounceRate: e?.entrances ? (e.bounces || 0) / e.entrances : 0,
    };
  });
}

// ─── clicks report ────────────────────────────────────────────────────────────

export async function getClicksReport(
  range: Range,
  path?: string,
  limit = 100,
) {
  await dbConnect();

  const match = eventMatch(range, { type: "click", ...(path ? { path } : {}) });

  const [rows, pvByPath] = await Promise.all([
    AnalyticsEvent.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            label: {
              $ifNull: [
                "$element.analyticsId",
                {
                  $ifNull: [
                    "$element.text",
                    { $ifNull: ["$element.href", "$element.tag"] },
                  ],
                },
              ],
            },
            path: "$path",
            tag: "$element.tag",
            href: "$element.href",
            analyticsId: "$element.analyticsId",
            section: "$element.section",
          },
          clicks: { $sum: 1 },
          visitors: { $addToSet: "$visitorId" },
        },
      },
      {
        $project: {
          _id: 0,
          label: "$_id.label",
          path: "$_id.path",
          tag: "$_id.tag",
          href: "$_id.href",
          analyticsId: "$_id.analyticsId",
          section: "$_id.section",
          clicks: 1,
          uniqueVisitors: { $size: "$visitors" },
        },
      },
      { $sort: { clicks: -1 } },
      { $limit: limit },
    ]),
    AnalyticsEvent.aggregate([
      { $match: eventMatch(range, { type: "page_view" }) },
      { $group: { _id: "$path", views: { $sum: 1 } } },
    ]),
  ]);

  const pvMap = new Map(pvByPath.map((p: any) => [p._id, p.views]));

  return rows.map((r: any) => {
    const pv = pvMap.get(r.path) || 0;

    return { ...r, pageViews: pv, ctr: pv ? r.clicks / pv : 0 };
  });
}

// ─── engagement report ────────────────────────────────────────────────────────

const DURATION_BUCKETS = [
  0, 10_000, 30_000, 60_000, 180_000, 600_000, 1_800_000,
];
const SCROLL_BUCKETS = [0, 25, 50, 75, 100];

export async function getEngagementReport(range: Range) {
  await dbConnect();

  const [durationHist, scrollHist, pagesPerSession, heatmap, dwellByPage] =
    await Promise.all([
      AnalyticsSession.aggregate([
        { $match: sessionMatch(range) },
        {
          $bucket: {
            groupBy: "$durationMs",
            boundaries: [...DURATION_BUCKETS, Infinity],
            default: "1800000+",
            output: { count: { $sum: 1 } },
          },
        },
      ]),
      AnalyticsEvent.aggregate([
        {
          $match: eventMatch(range, {
            type: "page_close",
            scrollDepthMax: { $ne: null },
          }),
        },
        {
          $bucket: {
            groupBy: "$scrollDepthMax",
            boundaries: [...SCROLL_BUCKETS, 101],
            default: "other",
            output: { count: { $sum: 1 } },
          },
        },
      ]),
      AnalyticsSession.aggregate([
        { $match: sessionMatch(range) },
        { $group: { _id: "$pageViewCount", sessions: { $sum: 1 } } },
        { $sort: { _id: 1 } },
        { $limit: 15 },
      ]),
      AnalyticsEvent.aggregate([
        { $match: eventMatch(range, { type: "page_view" }) },
        {
          $group: {
            _id: {
              hour: { $hour: "$occurredAt" },
              weekday: { $isoDayOfWeek: "$occurredAt" },
            },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            hour: "$_id.hour",
            weekday: "$_id.weekday",
            count: 1,
          },
        },
      ]),
      AnalyticsEvent.aggregate([
        { $match: eventMatch(range, { type: "page_close" }) },
        {
          $group: {
            _id: "$path",
            avgDwellMs: { $avg: "$dwellMs" },
            samples: { $sum: 1 },
          },
        },
        { $sort: { avgDwellMs: -1 } },
        { $limit: 15 },
        {
          $project: {
            _id: 0,
            path: "$_id",
            avgDwellMs: { $round: "$avgDwellMs" },
            samples: 1,
          },
        },
      ]),
    ]);

  return {
    durationHist: labelBuckets(durationHist, DURATION_BUCKETS, "ms"),
    scrollHist: labelBuckets(scrollHist, SCROLL_BUCKETS, "pct"),
    pagesPerSession: pagesPerSession.map((r: any) => ({
      pages: r._id,
      sessions: r.sessions,
    })),
    heatmap,
    dwellByPage,
  };
}

function labelBuckets(rows: any[], boundaries: number[], kind: "ms" | "pct") {
  const fmt = (n: number) =>
    kind === "ms"
      ? n >= 60000
        ? `${Math.round(n / 60000)}m`
        : `${Math.round(n / 1000)}s`
      : `${n}%`;

  return rows.map((r) => {
    const idx = boundaries.indexOf(r._id);
    const lower =
      typeof r._id === "number" ? r._id : boundaries[boundaries.length - 1];
    const upper =
      idx >= 0 && idx < boundaries.length - 1 ? boundaries[idx + 1] : undefined;

    return {
      label:
        upper !== undefined ? `${fmt(lower)}–${fmt(upper)}` : `${fmt(lower)}+`,
      count: r.count,
    };
  });
}

// ─── top lists for the overview ───────────────────────────────────────────────

export async function getRecentLeads(limit = 6) {
  await dbConnect();

  const [leads, estimates] = await Promise.all([
    Lead.find({}).sort({ createdAt: -1 }).limit(limit).lean<any[]>(),
    Estimate.find({}).sort({ createdAt: -1 }).limit(limit).lean<any[]>(),
  ]);

  const merged = [
    ...leads.map((l: any) => ({
      id: String(l._id),
      kind: "contact" as const,
      name: l.name,
      email: l.email,
      status: l.status || "new",
      createdAt: l.createdAt,
      detail: l.projectType || l.company || "",
    })),
    ...estimates.map((e: any) => ({
      id: String(e._id),
      kind: "estimate" as const,
      name: e.name,
      email: e.email,
      status: e.status || "new",
      createdAt: e.createdAt,
      detail: (e.projectTypes || []).join(", "),
    })),
  ];

  return merged
    .sort(
      (a, b) =>
        new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf(),
    )
    .slice(0, limit);
}

export async function getIdentifiedVisitorCount(range: Range) {
  await dbConnect();

  return AnalyticsVisitor.countDocuments({
    identifiedAt: { $gte: range.from, $lt: range.to },
  });
}
