/**
 * Conversion, funnel and tool-usage reads.
 *
 * Everything here comes from the consented event stream, so it describes the
 * visitors who opted in — the same population as Journeys and Clicks — not the
 * consent-free hit counter. Rates are therefore "of tracked sessions".
 */
import dbConnect from "@/lib/mongodb";
import AnalyticsEvent from "@/models/analytics/AnalyticsEvent";
import AnalyticsSession from "@/models/analytics/AnalyticsSession";
import { CONVERSION_LABELS } from "@/lib/analytics/conversions";

export interface Range {
  from: Date;
  to: Date;
}

/** Pages whose visit signals buying intent. */
export const INTENT_PATHS = ["/pricing", "/contact"];

// ─── pure helpers (unit tested) ───────────────────────────────────────────────

export interface SessionLite {
  sessionId: string;
  entryPath?: string | null;
  referrerType?: string | null;
}

export interface LandingRow {
  path: string;
  sessions: number;
  converted: number;
  rate: number;
}

/** Per-landing-page conversion rate, best-converting first (min sample 3). */
export function landingConversion(
  sessions: SessionLite[],
  convertedIds: ReadonlySet<string>,
  minSessions = 3,
): LandingRow[] {
  const by = new Map<string, { sessions: number; converted: number }>();

  for (const s of sessions) {
    const path = s.entryPath || "/";
    const row = by.get(path) ?? { sessions: 0, converted: 0 };

    row.sessions += 1;
    if (convertedIds.has(s.sessionId)) row.converted += 1;
    by.set(path, row);
  }

  return [...by.entries()]
    .map(([path, r]) => ({
      path,
      sessions: r.sessions,
      converted: r.converted,
      rate: r.sessions ? r.converted / r.sessions : 0,
    }))
    .filter((r) => r.sessions >= minSessions)
    .sort((a, b) => b.rate - a.rate || b.sessions - a.sessions);
}

export interface SourceConversionRow {
  channel: string;
  sessions: number;
  converted: number;
  rate: number;
}

/** Conversion rate by acquisition channel. */
export function channelConversion(
  sessions: SessionLite[],
  convertedIds: ReadonlySet<string>,
): SourceConversionRow[] {
  const by = new Map<string, { sessions: number; converted: number }>();

  for (const s of sessions) {
    const channel = s.referrerType || "direct";
    const row = by.get(channel) ?? { sessions: 0, converted: 0 };

    row.sessions += 1;
    if (convertedIds.has(s.sessionId)) row.converted += 1;
    by.set(channel, row);
  }

  return [...by.entries()]
    .map(([channel, r]) => ({
      channel,
      sessions: r.sessions,
      converted: r.converted,
      rate: r.sessions ? r.converted / r.sessions : 0,
    }))
    .sort((a, b) => b.sessions - a.sessions);
}

// ─── queries ──────────────────────────────────────────────────────────────────

export interface FunnelResult {
  steps: {
    sessions: number;
    /** Viewed /pricing or /contact. */
    intent: number;
    /** Clicked WhatsApp / email / phone / calendar / Upwork, or sent a form. */
    converted: number;
    /** Submitted an on-site form (subset of converted). */
    forms: number;
  };
  conversionRate: number;
  byKind: Array<{ kind: string; label: string; count: number; sessions: number }>;
  landing: LandingRow[];
  channels: SourceConversionRow[];
}

export async function getFunnel(range: Range): Promise<FunnelResult> {
  await dbConnect();

  const eventMatch = { occurredAt: { $gte: range.from, $lte: range.to } };

  const sessionDocs = (await AnalyticsSession.find(
    { startedAt: { $gte: range.from, $lte: range.to }, isBot: { $ne: true } },
    { sessionId: 1, entryPath: 1, referrerType: 1 },
  ).lean()) as unknown as SessionLite[];

  // One row per session that did something interesting.
  const flagged = (await AnalyticsEvent.aggregate([
    {
      $match: {
        ...eventMatch,
        type: { $in: ["page_view", "conversion", "form_submit"] },
      },
    },
    {
      $group: {
        _id: "$sessionId",
        intent: {
          $max: {
            $cond: [
              {
                $and: [
                  { $eq: ["$type", "page_view"] },
                  { $in: ["$path", INTENT_PATHS] },
                ],
              },
              1,
              0,
            ],
          },
        },
        converted: {
          $max: {
            $cond: [{ $in: ["$type", ["conversion", "form_submit"]] }, 1, 0],
          },
        },
        form: { $max: { $cond: [{ $eq: ["$type", "form_submit"] }, 1, 0] } },
      },
    },
  ])) as unknown as Array<{
    _id: string;
    intent: number;
    converted: number;
    form: number;
  }>;

  const convertedIds = new Set<string>();
  let intent = 0;
  let forms = 0;

  for (const f of flagged) {
    if (f.intent) intent += 1;
    if (f.converted) convertedIds.add(f._id);
    if (f.form) forms += 1;
  }

  const kindRows = (await AnalyticsEvent.aggregate([
    { $match: { ...eventMatch, type: "conversion" } },
    {
      $group: {
        _id: "$conversionKind",
        count: { $sum: 1 },
        sessions: { $addToSet: "$sessionId" },
      },
    },
    { $sort: { count: -1 } },
  ])) as unknown as Array<{ _id: string; count: number; sessions: string[] }>;

  const total = sessionDocs.length;

  return {
    steps: { sessions: total, intent, converted: convertedIds.size, forms },
    conversionRate: total ? convertedIds.size / total : 0,
    byKind: kindRows.map((k) => ({
      kind: k._id,
      label:
        CONVERSION_LABELS[k._id as keyof typeof CONVERSION_LABELS] ?? k._id,
      count: k.count,
      sessions: k.sessions.length,
    })),
    landing: landingConversion(sessionDocs, convertedIds).slice(0, 15),
    channels: channelConversion(sessionDocs, convertedIds),
  };
}

export interface ToolRow {
  path: string;
  views: number;
  sessions: number;
  /** Sessions that pressed at least one button on the page. */
  engaged: number;
  rate: number;
}

/** Tools and component-lab pages: views vs. sessions that actually used them. */
export async function getToolUsage(range: Range): Promise<ToolRow[]> {
  await dbConnect();

  const base = {
    occurredAt: { $gte: range.from, $lte: range.to },
    path: { $regex: "^/(tools|componentlab)/" },
  };

  const views = (await AnalyticsEvent.aggregate([
    { $match: { ...base, type: "page_view" } },
    {
      $group: {
        _id: "$path",
        views: { $sum: 1 },
        sessions: { $addToSet: "$sessionId" },
      },
    },
  ])) as unknown as Array<{ _id: string; views: number; sessions: string[] }>;

  // Only buttons count as "used it": links on a tool page are navigation.
  const used = (await AnalyticsEvent.aggregate([
    {
      $match: {
        ...base,
        type: "click",
        $or: [{ "element.tag": "button" }, { "element.role": "button" }],
      },
    },
    { $group: { _id: { path: "$path", s: "$sessionId" } } },
    { $group: { _id: "$_id.path", engaged: { $sum: 1 } } },
  ])) as unknown as Array<{ _id: string; engaged: number }>;

  const engagedBy = new Map(used.map((u) => [u._id, u.engaged]));

  return views
    .map((v) => {
      const sessions = v.sessions.length;
      const engaged = Math.min(engagedBy.get(v._id) ?? 0, sessions);

      return {
        path: v._id,
        views: v.views,
        sessions,
        engaged,
        rate: sessions ? engaged / sessions : 0,
      };
    })
    .sort((a, b) => b.sessions - a.sessions)
    .slice(0, 30);
}
