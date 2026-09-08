"use client";

import { useEffect, useState } from "react";
import { Button } from "@heroui/react";

import { LEAD_STATUSES } from "@/lib/leads/constants";
import { Icon } from "@/components/admin/icons";
import { StatusChip, StatePanel } from "@/components/admin/ui";
import {
  JourneyTimeline,
  type Journey,
} from "@/components/admin/JourneyTimeline";
import { fmtDateTime } from "@/components/admin/format";
import { useDashboard } from "@/lib/admin/DashboardContext";

interface UnifiedLead {
  id: string;
  kind: string;
  name: string;
  email: string;
  phone?: string;
  status: string;
  source: string;
  detail: string;
  message?: string;
  payload: Record<string, unknown>;
  notes: Array<{ id: string; byName?: string; at: string; text: string }>;
  visitorId?: string | null;
  createdAt: string;
}

export function LeadDrawer({
  leadId,
  canManage,
  onClose,
  onChanged,
}: {
  leadId: string;
  canManage: boolean;
  onClose: () => void;
  onChanged: (lead: UnifiedLead) => void;
}) {
  const { rangeQuery } = useDashboard();
  const [lead, setLead] = useState<UnifiedLead | null>(null);
  const [journey, setJourney] = useState<Journey | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let alive = true;

    setLoading(true);
    setError(null);
    fetch(`/api/admin/leads/${leadId}?${rangeQuery}`, {
      credentials: "same-origin",
    })
      .then(async (r) => {
        const j = await r.json();

        if (!r.ok) throw new Error(j.error || "Failed to load lead");

        return j;
      })
      .then((j) => {
        if (!alive) return;
        setLead(j.lead);
        setJourney(j.journey);
      })
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [leadId, rangeQuery]);

  async function patch(body: Record<string, unknown>) {
    setSaving(true);
    const res = await fetch(`/api/admin/leads/${leadId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const j = await res.json().catch(() => ({}));

    setSaving(false);

    if (res.ok && j.lead) {
      setLead(j.lead);
      onChanged(j.lead);
      setNote("");
    }
  }

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/30"
        role="presentation"
        onClick={onClose}
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
          <h2 className="text-sm font-semibold text-gray-900">Lead detail</h2>
          <button
            className="rounded p-1 text-gray-400 hover:bg-gray-100"
            onClick={onClose}
          >
            <Icon.x className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <StatePanel error={error} loading={loading}>
            {lead ? (
              <div className="space-y-5">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {lead.name}
                    </h3>
                    <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] font-medium text-gray-500">
                      {lead.kind}
                    </span>
                    <StatusChip status={lead.status} />
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">
                    <a className="text-blue-600" href={`mailto:${lead.email}`}>
                      {lead.email}
                    </a>
                    {lead.phone ? ` · ${lead.phone}` : ""}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400">
                    {lead.source} · {fmtDateTime(lead.createdAt)}
                  </p>
                </div>

                {canManage ? (
                  <div className="flex flex-wrap items-center gap-2">
                    {LEAD_STATUSES.map((s) => (
                      <button
                        key={s}
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                          lead.status === s
                            ? "bg-gray-900 text-white ring-gray-900"
                            : "bg-white text-gray-600 ring-gray-200 hover:bg-gray-50"
                        }`}
                        disabled={saving}
                        onClick={() => patch({ status: s })}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                ) : null}

                <div>
                  <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Submission
                  </h4>
                  <dl className="space-y-1 rounded-lg bg-gray-50 p-3 text-sm">
                    {Object.entries(lead.payload)
                      .filter(
                        ([, v]) => v !== undefined && v !== null && v !== "",
                      )
                      .map(([k, v]) => (
                        <div
                          key={k}
                          className="grid grid-cols-[110px_1fr] gap-2"
                        >
                          <dt className="text-gray-400">{k}</dt>
                          <dd className="text-gray-700">
                            {Array.isArray(v) ? v.join(", ") : String(v)}
                          </dd>
                        </div>
                      ))}
                  </dl>
                </div>

                <div>
                  <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Visit journey
                  </h4>
                  <JourneyTimeline journey={journey} />
                </div>

                <div>
                  <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Notes
                  </h4>
                  <ul className="space-y-2">
                    {lead.notes.map((n) => (
                      <li
                        key={n.id}
                        className="rounded-lg bg-gray-50 p-2 text-sm"
                      >
                        <p className="text-gray-700">{n.text}</p>
                        <p className="mt-0.5 text-[11px] text-gray-400">
                          {n.byName || "Someone"} · {fmtDateTime(n.at)}
                        </p>
                      </li>
                    ))}
                    {!lead.notes.length ? (
                      <li className="text-xs text-gray-400">No notes yet.</li>
                    ) : null}
                  </ul>

                  {canManage ? (
                    <form
                      className="mt-2 flex gap-2"
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (note.trim()) patch({ note });
                      }}
                    >
                      <input
                        className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
                        placeholder="Add a note…"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                      />
                      <Button
                        isDisabled={!note.trim()}
                        isLoading={saving}
                        size="sm"
                        type="submit"
                      >
                        Add
                      </Button>
                    </form>
                  ) : null}
                </div>
              </div>
            ) : null}
          </StatePanel>
        </div>
      </aside>
    </div>
  );
}
