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
import { isLocalHost } from "@/lib/analytics/testTraffic";

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
  referrer?: string | null;
}

/**
 * A session recorded from a developer's machine, before ingest started
 * refusing that traffic. Left in the database (it is production data we have
 * not been asked to delete) but kept out of every funnel number.
 */
export function isTestSession(s: SessionLite): boolean {
  return (
    isLocalHost(s.referrer) ||
    /^https?:\/\/(localhost|127\.)/i.test(s.entryPath ?? "")
  );
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

  const allSessions = (await AnalyticsSession.find(
    { startedAt: { $gte: range.from, $lte: range.to }, isBot: { $ne: true } },
    { sessionId: 1, entryPath: 1, referrerType: 1, referrer: 1 },
  ).lean()) as unknown as SessionLite[];

  const sessionDocs = allSessions.filter((s) => !isTestSession(s));
  const realIds = new Set(sessionDocs.map((s) => s.sessionId));

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
    // Events carry no host, so test sessions are removed by session id.
    if (!realIds.has(f._id)) continue;
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

export type UsageSection = "tools" | "componentlab";

/** Which part of the site a usage path belongs to. */
export function sectionOf(path: string): UsageSection {
  return path.startsWith("/componentlab") ? "componentlab" : "tools";
}

/**
 * Elements that mean "the visitor operated the page". Tools are driven by form
 * fields as much as buttons — on /tools pages inputs/selects/textareas account
 * for ~140 clicks against ~50 on buttons — so counting buttons alone made real
 * tools look unused. Links are deliberately excluded: they are navigation.
 */
export const USAGE_TAGS = ["button", "input", "select", "textarea"] as const;

export interface ToolRow {
  section: UsageSection;
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

  // Operating the page counts as "used it"; links are navigation (see USAGE_TAGS).
  const used = (await AnalyticsEvent.aggregate([
    {
      $match: {
        ...base,
        type: "click",
        $or: [
          { "element.tag": { $in: [...USAGE_TAGS] } },
          { "element.role": "button" },
        ],
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
        section: sectionOf(v._id),
        path: v._id,
        views: v.views,
        sessions,
        engaged,
        rate: sessions ? engaged / sessions : 0,
      };
    })
    .sort((a, b) => b.sessions - a.sessions)
    // Enough for every tool and component page (about 40 today) with headroom,
    // so a busy section can no longer push the other one out of the table.
    .slice(0, 100);
}

/**
 * Contact actions (clicks on WhatsApp/email/phone/calendar/Upwork plus on-site
 * form submits) in range, excluding sessions recorded from a developer's
 * machine. One definition shared by the Overview and the weekly snapshot, so
 * the two can never disagree about what a conversion is.
 */
export async function countContactActions(range: Range): Promise<number> {
  await dbConnect();

  const sessions = (await AnalyticsSession.find(
    { startedAt: { $gte: range.from, $lte: range.to } },
    { sessionId: 1, entryPath: 1, referrer: 1 },
  ).lean()) as unknown as SessionLite[];

  const testIds = sessions.filter(isTestSession).map((s) => s.sessionId);

  return AnalyticsEvent.countDocuments({
    occurredAt: { $gte: range.from, $lte: range.to },
    type: { $in: ["conversion", "form_submit"] },
    sessionId: { $nin: testIds },
    // Rows stored before paths were normalised carry the full localhost URL.
    path: { $not: /^https?:\/\/(localhost|127\.)/i },
  }) as unknown as Promise<number>;
}
