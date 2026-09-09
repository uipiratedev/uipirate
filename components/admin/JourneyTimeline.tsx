"use client";

import { useState } from "react";

import { fmtDateTime, fmtDuration, fmtInt } from "./format";

interface JourneyEvent {
  type: string;
  path: string;
  occurredAt: string;
  label?: string;
  dwellMs?: number;
  scrollDepthMax?: number;
}

interface JourneySession {
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
  events: JourneyEvent[];
}

export interface Journey {
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
  sessions: JourneySession[];
}

const EVENT_DOT: Record<string, { color: string; label: string }> = {
  page_view: { color: "bg-blue-500 ring-blue-100", label: "Viewed Page" },
  click: { color: "bg-amber-500 ring-amber-100", label: "Clicked Element" },
  form_submit: { color: "bg-emerald-500 ring-emerald-100", label: "Form Submitted" },
  page_close: { color: "bg-gray-400 ring-gray-100", label: "Closed Page" },
};

function SessionRow({
  session,
  index,
}: {
  session: JourneySession;
  index: number;
}) {
  const [open, setOpen] = useState(index === 0);

  const locationText = [session.geo?.city, session.geo?.country]
    .filter(Boolean)
    .join(", ");
  const deviceText = [session.device?.type, session.device?.os, session.device?.browser]
    .filter(Boolean)
    .join(" · ");

  return (
    <li className="rounded-xl border border-gray-200/80 bg-white shadow-sm transition-all">
      <button
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-slate-50/60 rounded-xl transition-colors"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-900">
              Session #{index + 1}
            </span>
            <span className="text-xs text-gray-400">·</span>
            <span className="text-xs text-gray-600 font-mono">
              {fmtDateTime(session.startedAt)}
            </span>
            {locationText ? (
              <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600">
                📍 {locationText}
              </span>
            ) : null}
          </div>
          <p className="mt-1 truncate text-xs text-gray-500">
            <span className="font-semibold text-gray-700 capitalize">
              {session.referrerType || "Direct"}
            </span>{" "}
            → Entry: <code className="font-mono text-gray-800">{session.entryPath}</code>
            {deviceText ? ` · ${deviceText}` : ""}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="rounded-md bg-gray-100/80 px-2 py-1 font-mono text-xs font-bold tabular-nums text-gray-700">
            {fmtDuration(session.durationMs)}
          </span>
          <span className="text-xs font-mono text-gray-400">
            {session.events.filter((e) => e.type === "page_view").length} views
          </span>
          <span className="text-xs text-gray-400">{open ? "▲" : "▼"}</span>
        </div>
      </button>

      {open ? (
        <ol className="space-y-2.5 border-t border-gray-100 bg-slate-50/40 px-4 py-3.5">
          {session.events.length === 0 ? (
            <li className="text-xs text-gray-400 py-1">
              No page-level events recorded in this session.
            </li>
          ) : (
            session.events.map((e, i) => {
              const meta = EVENT_DOT[e.type] || {
                color: "bg-gray-400 ring-gray-100",
                label: e.type,
              };

              return (
                <li key={i} className="flex items-start gap-2.5 text-xs">
                  <span
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ring-2 ${meta.color}`}
                  />
                  <div className="min-w-0 flex-1">
                    <span className="font-semibold text-gray-800">
                      {meta.label}:
                    </span>{" "}
                    <span className="font-mono text-gray-700 break-all">
                      {e.type === "click" || e.type === "form_submit"
                        ? e.label || e.path
                        : e.path}
                    </span>
                    {e.type === "page_close" &&
                    (e.dwellMs || e.scrollDepthMax) ? (
                      <span className="text-gray-400">
                        {" "}
                        (Dwell: {fmtDuration(e.dwellMs)}, Scrolled: {e.scrollDepthMax ?? 0}%)
                      </span>
                    ) : null}
                  </div>
                  <span className="shrink-0 font-mono text-[11px] text-gray-400">
                    {new Date(e.occurredAt).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </span>
                </li>
              );
            })
          )}
        </ol>
      ) : null}
    </li>
  );
}

export function JourneyTimeline({ journey }: { journey: Journey | null }) {
  if (!journey) {
    return (
      <p className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 px-4 py-10 text-center text-sm text-gray-400">
        No first-party visit data linked to this profile. They may have visited
        before analytics consent or used private browsing.
      </p>
    );
  }

  const locationFull = [
    journey.lastGeo?.city,
    journey.lastGeo?.region,
    journey.lastGeo?.country,
  ]
    .filter(Boolean)
    .join(", ");

  const deviceFull = [
    journey.lastDevice?.type ? `${journey.lastDevice.type}` : null,
    journey.lastDevice?.os,
    journey.lastDevice?.browser,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="space-y-5">
      {/* Overview Dossier Card */}
      <div className="rounded-2xl border border-gray-200/80 bg-slate-50/70 p-4 shadow-sm">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Visitor Profile &amp; Attribution
        </h3>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
          <Stat label="Total Visits" value={fmtInt(journey.sessionCount)} />
          <Stat label="Total Pageviews" value={fmtInt(journey.pageViewCount)} />
          <Stat label="Total Clicks" value={fmtInt(journey.clickCount)} />
          <Stat label="Cumulative Dwell" value={fmtDuration(journey.totalDurationMs)} />

          <Stat
            label="Location"
            value={locationFull || "Unknown / Not resolved"}
          />
          <Stat
            label="Device & Browser"
            value={deviceFull || "Unknown"}
          />
          <Stat
            label="First Touch Channel"
            value={journey.firstReferrerType ? journey.firstReferrerType.toUpperCase() : "DIRECT"}
          />
          <Stat
            label="Initial Landing"
            value={journey.firstLandingPath || "/"}
          />

          <Stat
            label="First Visit Date"
            value={journey.firstSeenAt ? fmtDateTime(journey.firstSeenAt) : "—"}
          />
          <Stat
            label="Most Recent Visit"
            value={journey.lastSeenAt ? fmtDateTime(journey.lastSeenAt) : "—"}
          />
          <Stat
            label="Identified Email"
            value={journey.identifiedEmail || "Anonymous / Unlinked"}
          />
          <Stat
            label="Initial Referrer URL"
            value={journey.firstReferrer || "None (Direct)"}
          />
        </dl>
      </div>

      {/* Session Timeline Breakdown */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Session Audit Trail ({journey.sessions.length})
        </h3>
        <ul className="space-y-2.5">
          {journey.sessions.map((s, i) => (
            <SessionRow key={s.sessionId} index={i} session={s} />
          ))}
          {journey.sessions.length === 0 ? (
            <li className="text-xs text-gray-400">No session events recorded.</li>
          ) : null}
        </ul>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
        {label}
      </dt>
      <dd className="mt-0.5 truncate text-xs font-semibold text-gray-900" title={value}>
        {value}
      </dd>
    </div>
  );
}
