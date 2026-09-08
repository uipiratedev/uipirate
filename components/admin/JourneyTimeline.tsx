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

const EVENT_DOT: Record<string, string> = {
  page_view: "bg-blue-500",
  click: "bg-amber-500",
  form_submit: "bg-emerald-500",
  page_close: "bg-gray-300",
};

function SessionRow({
  session,
  index,
}: {
  session: JourneySession;
  index: number;
}) {
  const [open, setOpen] = useState(index === 0);

  return (
    <li className="rounded-lg border border-gray-200">
      <button
        className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="min-w-0">
          <span className="block text-sm font-medium text-gray-900">
            {fmtDateTime(session.startedAt)}
          </span>
          <span className="block truncate text-xs text-gray-400">
            {session.referrerType || "direct"} · {session.entryPath}
            {session.device?.type ? ` · ${session.device.type}` : ""}
            {session.geo?.country ? ` · ${session.geo.country}` : ""}
          </span>
        </span>
        <span className="shrink-0 text-xs tabular-nums text-gray-500">
          {fmtDuration(session.durationMs)} ·{" "}
          {session.events.filter((e) => e.type === "page_view").length}p
        </span>
      </button>

      {open ? (
        <ol className="space-y-2 border-t border-gray-100 px-3 py-3">
          {session.events.length === 0 ? (
            <li className="text-xs text-gray-400">
              No page-level events recorded.
            </li>
          ) : (
            session.events.map((e, i) => (
              <li key={i} className="flex items-start gap-2 text-xs">
                <span
                  className={`mt-1 h-2 w-2 shrink-0 rounded-full ${EVENT_DOT[e.type] || "bg-gray-300"}`}
                />
                <span className="min-w-0 flex-1">
                  <span className="font-medium text-gray-700">
                    {e.type === "page_view"
                      ? "Viewed"
                      : e.type === "click"
                        ? "Clicked"
                        : e.type === "form_submit"
                          ? "Submitted"
                          : "Left"}
                  </span>{" "}
                  <span className="text-gray-500">
                    {e.type === "click" || e.type === "form_submit"
                      ? e.label || e.path
                      : e.path}
                  </span>
                  {e.type === "page_close" &&
                  (e.dwellMs || e.scrollDepthMax) ? (
                    <span className="text-gray-400">
                      {" "}
                      · {fmtDuration(e.dwellMs)} · {e.scrollDepthMax ?? 0}%
                      scrolled
                    </span>
                  ) : null}
                </span>
                <span className="shrink-0 text-gray-300">
                  {new Date(e.occurredAt).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              </li>
            ))
          )}
        </ol>
      ) : null}
    </li>
  );
}

export function JourneyTimeline({ journey }: { journey: Journey | null }) {
  if (!journey) {
    return (
      <p className="rounded-lg bg-gray-50 px-3 py-6 text-center text-sm text-gray-400">
        No first-party visit data linked to this lead. They may have submitted
        before analytics consent, or from a different device.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <dl className="grid grid-cols-2 gap-x-4 gap-y-1 rounded-lg bg-gray-50 p-3 text-sm sm:grid-cols-4">
        <Stat label="Visits" value={fmtInt(journey.sessionCount)} />
        <Stat label="Pages seen" value={fmtInt(journey.pageViewCount)} />
        <Stat label="Clicks" value={fmtInt(journey.clickCount)} />
        <Stat label="Total time" value={fmtDuration(journey.totalDurationMs)} />
        <Stat
          label="First seen"
          value={journey.firstSeenAt ? fmtDateTime(journey.firstSeenAt) : "—"}
        />
        <Stat
          label="Last seen"
          value={journey.lastSeenAt ? fmtDateTime(journey.lastSeenAt) : "—"}
        />
        <Stat
          label="First source"
          value={journey.firstReferrerType || "direct"}
        />
        <Stat
          label="Location / device"
          value={
            [journey.lastGeo?.country, journey.lastDevice?.type]
              .filter(Boolean)
              .join(" · ") || "—"
          }
        />
      </dl>

      <ul className="space-y-2">
        {journey.sessions.map((s, i) => (
          <SessionRow key={s.sessionId} index={i} session={s} />
        ))}
        {journey.sessions.length === 0 ? (
          <li className="text-sm text-gray-400">No sessions recorded.</li>
        ) : null}
      </ul>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wide text-gray-400">
        {label}
      </dt>
      <dd className="font-medium text-gray-900">{value}</dd>
    </div>
  );
}
