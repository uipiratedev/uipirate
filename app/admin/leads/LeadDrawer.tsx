"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Chip,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  Input,
} from "@heroui/react";

import { LEAD_STATUSES } from "@/lib/leads/constants";
import { Icon } from "@/components/admin/icons";
import { StatusChip, StatePanel } from "@/components/admin/ui";
import {
  JourneyTimeline,
  type Journey,
} from "@/components/admin/JourneyTimeline";
import { fmtDateTime } from "@/components/admin/format";
import { useDashboard } from "@/lib/admin/DashboardContext";
import { useDrawerScrollLock } from "@/hooks/useDrawerScrollLock";

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
  useDrawerScrollLock({ enabled: true, onClose });

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
    <Drawer
      backdrop="blur"
      classNames={{
        base: "max-h-screen bg-white shadow-2xl",
        body: "p-0",
      }}
      isOpen={Boolean(leadId)}
      placement="right"
      size="xl"
      onOpenChange={(open) => !open && onClose()}
    >
      <DrawerContent>
        {() => (
          <>
            <DrawerHeader className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-white/95 px-6 py-4 backdrop-blur">
              <div className="min-w-0 pr-3">
                <h2 className="text-base font-semibold tracking-tight text-gray-900">
                  Lead Dossier &amp; Timeline
                </h2>
                <p className="text-xs text-gray-400">
                  Manage status, append notes and inspect customer journey
                </p>
              </div>
            </DrawerHeader>

            <DrawerBody
              className="overflow-y-auto overscroll-contain px-6 py-5 scrollbar-thin"
              data-lenis-prevent="true"
            >
              <StatePanel error={error} loading={loading}>
                {lead ? (
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-lg font-bold tracking-tight text-gray-900">
                          {lead.name}
                        </h3>
                        <Chip size="sm" variant="flat">
                          {lead.kind}
                        </Chip>
                        <StatusChip status={lead.status} />
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        <a
                          className="font-medium text-blue-600 hover:underline"
                          href={`mailto:${lead.email}`}
                        >
                          {lead.email}
                        </a>
                        {lead.phone ? ` · ${lead.phone}` : ""}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-400">
                        Acquisition: <span className="font-semibold text-gray-600 capitalize">{lead.source}</span> · {fmtDateTime(lead.createdAt)}
                      </p>
                    </div>

                    {canManage ? (
                      <div>
                        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                          Lifecycle Status
                        </h4>
                        <div className="flex flex-wrap items-center gap-2">
                          {LEAD_STATUSES.map((s) => (
                            <button
                              key={s}
                              className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                                lead.status === s
                                  ? "bg-gray-900 text-white shadow-sm ring-1 ring-gray-900"
                                  : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50"
                              }`}
                              disabled={saving}
                              onClick={() => patch({ status: s })}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    <div>
                      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Form Payload &amp; Specifications
                      </h4>
                      <dl className="space-y-1.5 rounded-2xl border border-gray-200/80 bg-slate-50/70 p-4 text-xs">
                        {Object.entries(lead.payload)
                          .filter(
                            ([, v]) => v !== undefined && v !== null && v !== "",
                          )
                          .map(([k, v]) => (
                            <div
                              key={k}
                              className="grid grid-cols-[120px_1fr] gap-2 items-start"
                            >
                              <dt className="font-semibold uppercase tracking-wider text-gray-400 text-[10px]">
                                {k}
                              </dt>
                              <dd className="font-medium text-gray-800 break-words font-mono">
                                {Array.isArray(v) ? v.join(", ") : String(v)}
                              </dd>
                            </div>
                          ))}
                      </dl>
                    </div>

                    <div>
                      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Customer Journey &amp; Visits
                      </h4>
                      <JourneyTimeline journey={journey} />
                    </div>

                    <div>
                      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Internal Notes ({lead.notes.length})
                      </h4>
                      <ul className="space-y-2">
                        {lead.notes.map((n) => (
                          <li
                            key={n.id}
                            className="rounded-xl border border-gray-200/80 bg-white p-3 shadow-sm text-xs"
                          >
                            <p className="text-gray-800 leading-relaxed font-medium">{n.text}</p>
                            <p className="mt-1.5 text-[10px] text-gray-400">
                              By <span className="font-semibold text-gray-600">{n.byName || "Admin"}</span> · {fmtDateTime(n.at)}
                            </p>
                          </li>
                        ))}
                        {!lead.notes.length ? (
                          <li className="text-xs text-gray-400">No notes recorded yet.</li>
                        ) : null}
                      </ul>

                      {canManage ? (
                        <form
                          className="mt-3 flex gap-2"
                          onSubmit={(e) => {
                            e.preventDefault();
                            if (note.trim()) patch({ note });
                          }}
                        >
                          <Input
                            className="flex-1"
                            classNames={{
                              inputWrapper: "bg-white border-gray-200 shadow-sm rounded-xl",
                            }}
                            placeholder="Add a team note…"
                            size="sm"
                            value={note}
                            variant="bordered"
                            onChange={(e) => setNote(e.target.value)}
                          />
                          <Button
                            color="primary"
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
            </DrawerBody>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
