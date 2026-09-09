/**
 * Unified lead view: contact-form Leads + project Estimates merged into one
 * list with a `kind` discriminator, plus the stitched first-party visitor
 * journey behind each one.
 */
import mongoose from "mongoose";

import dbConnect from "@/lib/mongodb";
import Lead from "@/models/Lead";
import Estimate from "@/models/Estimate";
import AnalyticsEvent from "@/models/analytics/AnalyticsEvent";
import AnalyticsSession from "@/models/analytics/AnalyticsSession";
import AnalyticsVisitor from "@/models/analytics/AnalyticsVisitor";

export type LeadKind = "contact" | "estimate";

export interface UnifiedLead {
  id: string;
  kind: LeadKind;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: string;
  source: string;
  assignedTo?: string | null;
  visitorId?: string | null;
  detail: string;
  message?: string;
  payload: Record<string, unknown>;
  notes: Array<{ id: string; byName?: string; at: string; text: string }>;
  createdAt: string;
  updatedAt: string;
}

interface ListOpts {
  from?: Date;
  to?: Date;
  status?: string;
  kind?: LeadKind | "all";
  q?: string;
  page?: number;
  pageSize?: number;
}

function mapNotes(notes: any[] = []) {
  return notes.map((n) => ({
    id: String(n._id),
    byName: n.byName,
    at: new Date(n.at).toISOString(),
    text: n.text,
  }));
}

function leadToUnified(l: any): UnifiedLead {
  return {
    id: String(l._id),
    kind: "contact",
    name: l.name,
    email: l.email,
    company: l.company || undefined,
    status: l.status || "new",
    source: l.source || "contact-form",
    assignedTo: l.assignedTo ? String(l.assignedTo) : null,
    visitorId: l.visitorId || null,
    detail: [l.projectType, l.budget].filter(Boolean).join(" · "),
    message: l.message || undefined,
    payload: {
      company: l.company,
      budget: l.budget,
      projectType: l.projectType,
      message: l.message,
    },
    notes: mapNotes(l.notes),
    createdAt: new Date(l.createdAt).toISOString(),
    updatedAt: new Date(l.updatedAt || l.createdAt).toISOString(),
  };
}

function estimateToUnified(e: any): UnifiedLead {
  return {
    id: String(e._id),
    kind: "estimate",
    name: e.name,
    email: e.email,
    phone: e.phone ? `${e.countryCode || ""}${e.phone}` : undefined,
    status: e.status || "new",
    source: "project-estimate",
    assignedTo: e.assignedTo ? String(e.assignedTo) : null,
    visitorId: e.visitorId || null,
    detail: [
      (e.projectTypes || []).join(", "),
      e.budgetRange,
      e.timelineEstimate,
    ]
      .filter(Boolean)
      .join(" · "),
    message: e.requirement || undefined,
    payload: {
      projectTypes: e.projectTypes,
      requirement: e.requirement,
      priorities: e.priorities,
      budgetRange: e.budgetRange,
      timelineEstimate: e.timelineEstimate,
      phone: e.phone ? `${e.countryCode || ""}${e.phone}` : undefined,
    },
    notes: mapNotes(e.notes),
    createdAt: new Date(e.createdAt).toISOString(),
    updatedAt: new Date(e.updatedAt || e.createdAt).toISOString(),
  };
}

export async function listLeads(opts: ListOpts) {
  await dbConnect();

  const { from, to, status, kind = "all", q, page = 1, pageSize = 25 } = opts;

  const common: Record<string, unknown> = {};

  if (from || to) {
    common.createdAt = {
      ...(from ? { $gte: from } : {}),
      ...(to ? { $lt: to } : {}),
    };
  }
  if (status && status !== "all") common.status = status;
  if (q) {
    const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

    common.$or = [{ name: rx }, { email: rx }];
  }

  const wantContact = kind === "all" || kind === "contact";
  const wantEstimate = kind === "all" || kind === "estimate";

  const [leads, estimates, leadCount, estCount, statusFacet] = await Promise.all([
    wantContact
      ? Lead.find(common).sort({ createdAt: -1 }).limit(500).lean<any[]>()
      : ([] as any[]),
    wantEstimate
      ? Estimate.find(common).sort({ createdAt: -1 }).limit(500).lean<any[]>()
      : ([] as any[]),
    wantContact ? Lead.countDocuments(common) : 0,
    wantEstimate ? Estimate.countDocuments(common) : 0,
    statusCounts(from, to),
  ]);

  const merged = [
    ...(leads as any[]).map(leadToUnified),
    ...(estimates as any[]).map(estimateToUnified),
  ].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const total = leadCount + estCount;
  const start = (page - 1) * pageSize;

  return {
    rows: merged.slice(start, start + pageSize),
    total,
    page,
    pageSize,
    statusCounts: statusFacet,
  };
}

async function statusCounts(from?: Date, to?: Date) {
  const match: Record<string, unknown> = {};

  if (from || to) {
    match.createdAt = {
      ...(from ? { $gte: from } : {}),
      ...(to ? { $lt: to } : {}),
    };
  }

  const group = [
    { $match: match },
    { $group: { _id: "$status", n: { $sum: 1 } } },
  ];

  const [a, b] = await Promise.all([
    Lead.aggregate(group),
    Estimate.aggregate(group),
  ]);

  const out: Record<string, number> = {};

  for (const r of [...a, ...b])
    out[r._id || "new"] = (out[r._id || "new"] || 0) + r.n;

  return out;
}

export async function getLead(id: string): Promise<UnifiedLead | null> {
  if (!mongoose.isValidObjectId(id)) return null;
  await dbConnect();

  const [lead, estimate] = await Promise.all([
    Lead.findById(id).lean<any>(),
    Estimate.findById(id).lean<any>(),
  ]);

  if (lead) return leadToUnified(lead);
  if (estimate) return estimateToUnified(estimate);

  return null;
}

export async function updateLead(
  id: string,
  patch: {
    status?: string;
    assignedTo?: string | null;
    note?: { by: string; byName?: string; text: string };
  },
): Promise<UnifiedLead | null> {
  if (!mongoose.isValidObjectId(id)) return null;
  await dbConnect();

  const set: Record<string, unknown> = {};
  const push: Record<string, unknown> = {};

  if (patch.status) set.status = patch.status;
  if (patch.assignedTo !== undefined) set.assignedTo = patch.assignedTo || null;
  if (patch.note?.text) {
    push.notes = {
      by: patch.note.by,
      byName: patch.note.byName,
      at: new Date(),
      text: patch.note.text.slice(0, 2000),
    };
  }

  const update: Record<string, unknown> = {};

  if (Object.keys(set).length) update.$set = set;
  if (Object.keys(push).length) update.$push = push;

  if (!Object.keys(update).length) return getLead(id);

  const [l, e] = await Promise.all([
    Lead.findByIdAndUpdate(id, update, { new: true }).lean<any>(),
    Estimate.findByIdAndUpdate(id, update, { new: true }).lean<any>(),
  ]);

  if (l) return leadToUnified(l);
  if (e) return estimateToUnified(e);

  return null;
}

// ─── visitor journey ──────────────────────────────────────────────────────────

export interface VisitorJourney {
  visitorId: string;
  identified: boolean;
  identifiedEmail?: string;
  firstSeenAt?: string;
  lastSeenAt?: string;
  sessionCount: number;
  pageViewCount: number;
  clickCount: number;
  totalDurationMs: number;
  firstReferrer?: string;
  firstReferrerType?: string;
  firstLandingPath?: string;
  lastGeo?: { country?: string; region?: string; city?: string };
  lastDevice?: { type?: string; os?: string; browser?: string };
  sessions: Array<{
    sessionId: string;
    startedAt: string;
    lastSeenAt: string;
    durationMs: number;
    referrerType?: string;
    referrer?: string;
    entryPath: string;
    exitPath: string;
    device?: { type?: string; os?: string; browser?: string };
    geo?: { country?: string; city?: string };
    events: Array<{
      type: string;
      path: string;
      occurredAt: string;
      label?: string;
      dwellMs?: number;
      scrollDepthMax?: number;
    }>;
  }>;
}

export async function getVisitorJourney(
  visitorId: string,
  maxSessions = 40,
): Promise<VisitorJourney | null> {
  if (!visitorId) return null;
  await dbConnect();

  const [visitor, sessions] = await Promise.all([
    AnalyticsVisitor.findOne({ visitorId }).lean<any>(),
    AnalyticsSession.find({ visitorId })
      .sort({ startedAt: -1 })
      .limit(maxSessions)
      .lean<any[]>(),
  ]);

  if (!visitor && sessions.length === 0) {
    return {
      visitorId,
      identified: false,
      sessionCount: 0,
      pageViewCount: 0,
      clickCount: 0,
      totalDurationMs: 0,
      sessions: [],
    };
  }

  const sessionIds = sessions.map((s) => s.sessionId);
  const events = await AnalyticsEvent.find({
    sessionId: { $in: sessionIds },
    type: { $in: ["page_view", "click", "page_close", "form_submit"] },
  })
    .sort({ occurredAt: 1 })
    .limit(2000)
    .lean<any[]>();

  const eventsBySession = new Map<string, any[]>();

  for (const e of events) {
    const arr = eventsBySession.get(e.sessionId) || [];

    arr.push(e);
    eventsBySession.set(e.sessionId, arr);
  }

  return {
    visitorId,
    identified: Boolean(visitor?.identifiedAt),
    identifiedEmail: visitor?.identifiedEmail,
    firstSeenAt: visitor?.firstSeenAt
      ? new Date(visitor.firstSeenAt).toISOString()
      : undefined,
    lastSeenAt: visitor?.lastSeenAt
      ? new Date(visitor.lastSeenAt).toISOString()
      : undefined,
    sessionCount: visitor?.sessionCount || sessions.length,
    pageViewCount: visitor?.pageViewCount || 0,
    clickCount: visitor?.clickCount || 0,
    totalDurationMs: visitor?.totalDurationMs || 0,
    firstReferrer: visitor?.firstReferrer,
    firstReferrerType: visitor?.firstReferrerType,
    firstLandingPath: visitor?.firstLandingPath,
    lastGeo: visitor?.lastGeo,
    lastDevice: visitor?.lastDevice,
    sessions: sessions.map((s) => ({
      sessionId: s.sessionId,
      startedAt: new Date(s.startedAt).toISOString(),
      lastSeenAt: new Date(s.lastSeenAt).toISOString(),
      durationMs: s.durationMs || 0,
      referrerType: s.referrerType,
      referrer: s.referrer,
      entryPath: s.entryPath,
      exitPath: s.exitPath,
      device: s.device,
      geo: s.geo,
      events: (eventsBySession.get(s.sessionId) || []).map((e) => ({
        type: e.type,
        path: e.path,
        occurredAt: new Date(e.occurredAt).toISOString(),
        label:
          e.type === "click"
            ? e.element?.analyticsId || e.element?.text || e.element?.href
            : e.type === "form_submit"
              ? e.formName
              : undefined,
        dwellMs: e.dwellMs,
        scrollDepthMax: e.scrollDepthMax,
      })),
    })),
  };
}

// ─── visitor list (PII view) ─────────────────────────────────────────────────

export async function listVisitors(opts: {
  from?: Date;
  to?: Date;
  identifiedOnly?: boolean;
  q?: string;
  page?: number;
  pageSize?: number;
}) {
  await dbConnect();

  const { from, to, identifiedOnly, q, page = 1, pageSize = 30 } = opts;
  const match: Record<string, unknown> = { isBot: { $ne: true } };

  if (from || to) {
    match.lastSeenAt = {
      ...(from ? { $gte: from } : {}),
      ...(to ? { $lt: to } : {}),
    };
  }
  if (identifiedOnly) match.identifiedAt = { $exists: true };
  if (q) {
    const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

    match.$or = [
      { identifiedEmail: rx },
      { visitorId: rx },
      { "lastGeo.city": rx },
      { "lastGeo.country": rx },
      { "lastGeo.region": rx },
      { "lastDevice.browser": rx },
      { "lastDevice.os": rx },
      { firstLandingPath: rx },
      { firstReferrerType: rx },
    ];
  }

  const [rows, total] = await Promise.all([
    AnalyticsVisitor.find(match)
      .sort({ lastSeenAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean<any[]>(),
    AnalyticsVisitor.countDocuments(match),
  ]);

  return {
    rows: rows.map((v) => ({
      visitorId: v.visitorId,
      identified: Boolean(v.identifiedAt),
      email: v.identifiedEmail || null,
      firstSeenAt: v.firstSeenAt ? new Date(v.firstSeenAt).toISOString() : null,
      lastSeenAt: v.lastSeenAt ? new Date(v.lastSeenAt).toISOString() : null,
      sessionCount: v.sessionCount || 0,
      pageViewCount: v.pageViewCount || 0,
      clickCount: v.clickCount || 0,
      totalDurationMs: v.totalDurationMs || 0,
      country: v.lastGeo?.country || null,
      region: v.lastGeo?.region || null,
      city: v.lastGeo?.city || null,
      device: v.lastDevice?.type || null,
      os: v.lastDevice?.os || null,
      browser: v.lastDevice?.browser || null,
      referrerType: v.firstReferrerType || null,
      firstReferrer: v.firstReferrer || null,
      firstLandingPath: v.firstLandingPath || null,
    })),
    total,
    page,
    pageSize,
  };
}
