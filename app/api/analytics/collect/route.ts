import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/mongodb";
import AnalyticsEvent from "@/models/analytics/AnalyticsEvent";
import AnalyticsSession from "@/models/analytics/AnalyticsSession";
import AnalyticsVisitor from "@/models/analytics/AnalyticsVisitor";
import { rateLimit } from "@/lib/rateLimit";
import {
  extractGeo,
  ipHashFromHeaders,
  isBotUserAgent,
} from "@/lib/analytics/ip";
import {
  classifyReferrer,
  cleanPath,
  clampText,
  parseDevice,
} from "@/lib/analytics/enrich";
import {
  MAX_EVENTS_PER_BATCH,
  type AnalyticsEventType,
  type RawEvent,
} from "@/lib/analytics/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SELF_HOST = (process.env.NEXT_PUBLIC_SITE_HOST || "uipirate.com").replace(
  /^https?:\/\//,
  "",
);
const HEARTBEAT_MS = 15_000;
const UUID_RE = /^[0-9a-f-]{16,64}$/i;
const VALID_TYPES: AnalyticsEventType[] = [
  "page_view",
  "click",
  "page_close",
  "ping",
  "form_submit",
];

/** Always 204 — analytics must never surface an error to the page. */
const ok = () => new NextResponse(null, { status: 204 });

export async function POST(req: NextRequest) {
  try {
    const ipHash = ipHashFromHeaders(req.headers);

    if (!rateLimit(`collect:${ipHash}`, 240, 60_000).allowed) return ok();

    const ua = req.headers.get("user-agent");
    const isBot = isBotUserAgent(ua);

    // Drop bot traffic entirely — it never reaches the dashboard.
    if (isBot) return ok();

    let payload: { events?: unknown };

    try {
      payload = await req.json();
    } catch {
      return ok();
    }

    const rawEvents = Array.isArray(payload.events) ? payload.events : [];

    if (rawEvents.length === 0) return ok();

    const device = parseDevice(ua);
    const firstEvt = rawEvents[0] as RawEvent | undefined;
    const geo = extractGeo(req.headers, firstEvt);

    const events = (rawEvents.slice(0, MAX_EVENTS_PER_BATCH) as RawEvent[])
      .map((e) => normalize(e, ipHash, device, geo))
      .filter((e): e is NormalizedEvent => e !== null);

    if (events.length === 0) return ok();

    await dbConnect();

    await AnalyticsEvent.insertMany(
      events.map((e) => e.doc),
      { ordered: false },
    ).catch(() => {});

    // Sessions first — the set of visitors who just started a brand-new session
    // is what drives the visitor-level sessionCount increment.
    const newSessionResults = await Promise.all(
      groupBySession(events).map((g) => upsertSession(g)),
    );
    const visitorsWithNewSession = new Set(
      newSessionResults.filter((r) => r.inserted).map((r) => r.visitorId),
    );

    await Promise.all(
      groupByVisitor(events).map((g) =>
        upsertVisitor(g, visitorsWithNewSession.has(g[0].visitorId)),
      ),
    );

    return ok();
  } catch {
    return ok();
  }
}

// ─── normalization ────────────────────────────────────────────────────────────

interface NormalizedEvent {
  type: AnalyticsEventType;
  visitorId: string;
  sessionId: string;
  path: string;
  occurredAt: Date;
  isNewVisitor: boolean;
  referrer?: string;
  referrerType?: string;
  utm?: Record<string, string>;
  device: ReturnType<typeof parseDevice>;
  geo: ReturnType<typeof extractGeo>;
  doc: Record<string, unknown>;
}

function normalize(
  e: RawEvent,
  ipHash: string,
  device: ReturnType<typeof parseDevice>,
  geo: ReturnType<typeof extractGeo>,
): NormalizedEvent | null {
  if (!e || !VALID_TYPES.includes(e.type)) return null;
  if (typeof e.visitorId !== "string" || !UUID_RE.test(e.visitorId))
    return null;
  if (typeof e.sessionId !== "string" || !UUID_RE.test(e.sessionId))
    return null;

  const path = cleanPath(e.path);
  const tsNum = typeof e.ts === "number" ? e.ts : Date.now();
  // Trust client time only within a sane window; otherwise stamp now.
  const drift = Math.abs(Date.now() - tsNum);
  const occurredAt = drift > 24 * 60 * 60 * 1000 ? new Date() : new Date(tsNum);

  const utm =
    e.utm && typeof e.utm === "object"
      ? (Object.fromEntries(
          Object.entries(e.utm)
            .filter(([, v]) => typeof v === "string" && v)
            .map(([k, v]) => [k, String(v).slice(0, 100)]),
        ) as Record<string, string>)
      : undefined;

  const referrer =
    typeof e.referrer === "string" && e.referrer
      ? e.referrer.slice(0, 512)
      : undefined;
  const referrerType = classifyReferrer(referrer, utm, SELF_HOST);

  const doc: Record<string, unknown> = {
    type: e.type,
    visitorId: e.visitorId,
    sessionId: e.sessionId,
    ipHash,
    path,
    occurredAt,
    referrer,
    referrerType,
    utm: utm && Object.keys(utm).length ? utm : undefined,
    title: clampText(e.title, 200),
    lang: clampText(e.lang, 20),
    device,
    geo: geo.country || geo.city ? geo : undefined,
    screen: dims(e.screen),
    viewport: dims(e.viewport),
    isBot: false,
  };

  if (e.type === "click" && e.element && typeof e.element === "object") {
    doc.element = {
      text: clampText(e.element.text),
      tag: clampText(e.element.tag, 16)?.toLowerCase(),
      id: clampText(e.element.id, 80),
      cls: clampText(e.element.cls, 80),
      role: clampText(e.element.role, 40),
      href: clampText(e.element.href, 300),
      analyticsId: clampText(e.element.analyticsId, 80),
      section: clampText(e.element.section, 120),
    };
  }

  if (e.type === "page_close") {
    doc.dwellMs = clampNum(e.dwellMs, 0, 6 * 60 * 60 * 1000);
    doc.scrollDepthMax = clampNum(e.scrollDepthMax, 0, 100);
  }

  if (e.type === "form_submit") doc.formName = clampText(e.formName, 80);

  return {
    type: e.type,
    visitorId: e.visitorId,
    sessionId: e.sessionId,
    path,
    occurredAt,
    isNewVisitor: Boolean(e.isNewVisitor),
    referrer,
    referrerType,
    utm,
    device,
    geo,
    doc,
  };
}

function dims(d: RawEvent["screen"]): { w: number; h: number } | undefined {
  if (!d || typeof d.w !== "number" || typeof d.h !== "number")
    return undefined;
  if (d.w <= 0 || d.h <= 0 || d.w > 20000 || d.h > 20000) return undefined;

  return { w: Math.round(d.w), h: Math.round(d.h) };
}

function clampNum(v: unknown, min: number, max: number): number | undefined {
  if (typeof v !== "number" || Number.isNaN(v)) return undefined;

  return Math.min(max, Math.max(min, Math.round(v)));
}

function stripUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined),
  ) as Partial<T>;
}

// ─── grouped upserts ──────────────────────────────────────────────────────────

function groupBySession(events: NormalizedEvent[]): NormalizedEvent[][] {
  const map = new Map<string, NormalizedEvent[]>();

  for (const e of events) {
    const arr = map.get(e.sessionId) || [];

    arr.push(e);
    map.set(e.sessionId, arr);
  }

  return [...map.values()];
}

function groupByVisitor(events: NormalizedEvent[]): NormalizedEvent[][] {
  const map = new Map<string, NormalizedEvent[]>();

  for (const e of events) {
    const arr = map.get(e.visitorId) || [];

    arr.push(e);
    map.set(e.visitorId, arr);
  }

  return [...map.values()];
}

async function upsertSession(
  group: NormalizedEvent[],
): Promise<{ visitorId: string; inserted: boolean }> {
  const sorted = [...group].sort(
    (a, b) => a.occurredAt.valueOf() - b.occurredAt.valueOf(),
  );
  const first = sorted[0];
  const last = sorted[sorted.length - 1];

  const pageViews = sorted.filter((e) => e.type === "page_view");
  const clicks = sorted.filter((e) => e.type === "click").length;
  const pings = sorted.filter((e) => e.type === "ping").length;

  const inc: Record<string, number> = {};

  if (pageViews.length) inc.pageViewCount = pageViews.length;
  if (clicks) inc.clickCount = clicks;
  if (pings) inc.durationMs = pings * HEARTBEAT_MS;

  const update: Record<string, unknown> = {
    $setOnInsert: stripUndefined({
      sessionId: first.sessionId,
      visitorId: first.visitorId,
      ipHash: first.doc.ipHash,
      startedAt: first.occurredAt,
      entryPath: first.path,
      referrer: first.referrer,
      referrerType: first.referrerType,
      utm: first.utm && Object.keys(first.utm).length ? first.utm : undefined,
      isNewVisitor: first.isNewVisitor,
      isBot: false,
    }),
    $set: stripUndefined({
      lastSeenAt: last.occurredAt,
      exitPath: last.path,
      device: last.device,
      geo: last.geo.country || last.geo.city ? last.geo : undefined,
    }),
  };

  if (Object.keys(inc).length) update.$inc = inc;

  if (pageViews.length) {
    update.$push = {
      pagePath: { $each: pageViews.map((e) => e.path), $slice: -50 },
    };
  }

  const res = await AnalyticsSession.updateOne(
    { sessionId: first.sessionId },
    update,
    {
      upsert: true,
    },
  ).catch(() => null);

  return {
    visitorId: first.visitorId,
    inserted: Boolean(res && (res.upsertedCount ?? 0) > 0),
  };
}

async function upsertVisitor(
  group: NormalizedEvent[],
  startedNewSession: boolean,
): Promise<void> {
  const sorted = [...group].sort(
    (a, b) => a.occurredAt.valueOf() - b.occurredAt.valueOf(),
  );
  const first = sorted[0];
  const last = sorted[sorted.length - 1];

  const pageViews = sorted.filter((e) => e.type === "page_view").length;
  const clicks = sorted.filter((e) => e.type === "click").length;
  const pings = sorted.filter((e) => e.type === "ping").length;

  const inc: Record<string, number> = {};

  if (pageViews) inc.pageViewCount = pageViews;
  if (clicks) inc.clickCount = clicks;
  if (pings) inc.totalDurationMs = pings * HEARTBEAT_MS;
  if (startedNewSession) inc.sessionCount = 1;

  const set = stripUndefined({
    lastGeo: last.geo.country || last.geo.city ? last.geo : undefined,
    lastDevice: last.device,
  });

  const update: Record<string, unknown> = {
    $setOnInsert: stripUndefined({
      visitorId: first.visitorId,
      firstSeenAt: first.occurredAt,
      firstReferrer: first.referrer,
      firstReferrerType: first.referrerType,
      firstUtm:
        first.utm && Object.keys(first.utm).length ? first.utm : undefined,
      firstLandingPath: first.path,
      isBot: false,
    }),
    $max: { lastSeenAt: last.occurredAt },
  };

  if (Object.keys(set).length) update.$set = set;
  if (Object.keys(inc).length) update.$inc = inc;

  await AnalyticsVisitor.updateOne({ visitorId: first.visitorId }, update, {
    upsert: true,
  }).catch(() => {});
}
