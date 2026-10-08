"use client";

import { useState } from "react";

import { useApi } from "@/lib/admin/useApi";
import { PageHeader, Card, StatePanel } from "@/components/admin/ui";
import { KpiRow } from "@/components/admin/KpiRow";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { fmtInt, fmtPct } from "@/components/admin/format";

import { channelLabel } from "@/lib/analytics/brands";

interface FunnelData {
  steps: { sessions: number; intent: number; converted: number; forms: number };
  conversionRate: number;
  byKind: Array<{ kind: string; label: string; count: number; sessions: number }>;
  landing: Array<{ path: string; sessions: number; converted: number; rate: number }>;
  channels: Array<{ channel: string; sessions: number; converted: number; rate: number }>;
  tools: Array<{
    section: "tools" | "componentlab";
    path: string;
    views: number;
    sessions: number;
    engaged: number;
    rate: number;
  }>;
}

/** One funnel step as a labelled bar, sized against the first step. */
function Step({
  label,
  hint,
  value,
  base,
}: {
  label: string;
  hint: string;
  value: number;
  base: number;
}) {
  const pct = base > 0 ? (value / base) * 100 : 0;

  return (
    <li className="text-sm">
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <span className="font-medium text-gray-800">
          {label}
          <span className="ml-2 text-xs font-normal text-gray-400">{hint}</span>
        </span>
        <span className="shrink-0 tabular-nums text-gray-600">
          {fmtInt(value)}
          <span className="ml-2 text-xs text-gray-400">{fmtPct(pct / 100, 1)}</span>
        </span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-gray-100">
        <div
          className="h-2.5 rounded-full bg-gray-900"
          // A non-zero step always shows a sliver so it never reads as empty.
          style={{ width: `${value > 0 ? Math.max(pct, 1.5) : 0}%` }}
        />
      </div>
    </li>
  );
}

const rateCols = <T extends { rate: number }>(
  label: string,
  key: (r: T) => string,
  total: (r: T) => number,
  conv: (r: T) => number,
): Column<T>[] => [
  { key: "name", header: label, render: (r) => key(r), sortValue: (r) => key(r) },
  {
    key: "sessions",
    header: "Sessions",
    align: "right",
    render: (r) => fmtInt(total(r)),
    sortValue: (r) => total(r),
  },
  {
    key: "converted",
    header: "Converted",
    align: "right",
    render: (r) => fmtInt(conv(r)),
    sortValue: (r) => conv(r),
  },
  {
    key: "rate",
    header: "Rate",
    align: "right",
    render: (r) => fmtPct(r.rate, 1),
    sortValue: (r) => r.rate,
  },
];

export default function FunnelClient() {
  const { data, loading, error, refetch } = useApi<FunnelData>(
    "/api/admin/analytics/funnel",
  );

  const [section, setSection] = useState<"all" | "tools" | "componentlab">("all");
  const toolRows = (data?.tools || []).filter(
    (t) => section === "all" || t.section === section,
  );

  const s = data?.steps;
  const base = s?.sessions ?? 0;

  return (
    <>
      <PageHeader
        description="From first visit to a contact action. Tracked visitors only — people who accepted cookies."
        title="Funnel — do visitors become enquiries?"
      />

      <StatePanel
        empty={!loading && !error && base === 0}
        emptyText="No tracked sessions in this range."
        error={error}
        loading={loading}
        onRetry={refetch}
      >
        <KpiRow
          items={[
            { label: "Sessions", value: fmtInt(base), hint: "Tracked visitors" },
            {
              label: "Viewed pricing/contact",
              value: fmtInt(s?.intent ?? 0),
              hint: "Showed buying intent",
            },
            {
              label: "Contact actions",
              value: fmtInt(s?.converted ?? 0),
              hint: "WhatsApp, email, phone, calendar, Upwork, form",
            },
            {
              label: "Conversion rate",
              value: fmtPct(data?.conversionRate ?? 0, 1),
              hint: "Sessions with a contact action",
            },
            {
              label: "Form submits",
              value: fmtInt(s?.forms ?? 0),
              hint: "On-site forms only",
            },
          ]}
        />

        {(s?.converted ?? 0) === 0 && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-800">
            <span className="font-semibold">No contact actions recorded.</span>{" "}
            Contact-link tracking only counts clicks made after it was
            deployed, so a fresh deploy reads zero until visitors click.
          </div>
        )}

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <Card subtitle="Share of all tracked sessions" title="Funnel">
            <ul className="space-y-4">
              <Step base={base} hint="every tracked visit" label="Sessions" value={base} />
              <Step base={base} hint="/pricing or /contact" label="Showed intent" value={s?.intent ?? 0} />
              <Step base={base} hint="clicked or submitted" label="Contact action" value={s?.converted ?? 0} />
              <Step base={base} hint="on-site form" label="Form submit" value={s?.forms ?? 0} />
            </ul>
          </Card>

          <Card subtitle="Which route people take to reach you" title="Contact actions">
            <DataTable
              columns={[
                { key: "label", header: "Action", render: (r) => r.label, sortValue: (r) => r.label },
                { key: "count", header: "Clicks", align: "right", render: (r) => fmtInt(r.count), sortValue: (r) => r.count },
                { key: "sessions", header: "Sessions", align: "right", render: (r) => fmtInt(r.sessions), sortValue: (r) => r.sessions },
              ]}
              initialSort={{ key: "count", dir: "desc" }}
              rowKey={(r) => r.kind}
              rows={data?.byKind || []}
            />
          </Card>

          <Card subtitle="Pages with 3+ sessions" title="Conversion by landing page">
            <DataTable
              columns={rateCols(
                "Landing page",
                (r: FunnelData["landing"][number]) => r.path,
                (r) => r.sessions,
                (r) => r.converted,
              )}
              initialSort={{ key: "rate", dir: "desc" }}
              rowKey={(r) => r.path}
              rows={data?.landing || []}
            />
          </Card>

          <Card subtitle="Which channel brings people who act" title="Conversion by channel">
            <DataTable
              columns={rateCols(
                "Channel",
                (r: FunnelData["channels"][number]) => channelLabel(r.channel),
                (r) => r.sessions,
                (r) => r.converted,
              )}
              initialSort={{ key: "sessions", dir: "desc" }}
              rowKey={(r) => r.channel}
              rows={data?.channels || []}
            />
          </Card>
        </div>

        <div className="mt-5">
          <Card
            actions={
              <div className="flex gap-1 rounded-lg bg-gray-100 p-0.5 text-xs font-semibold">
                {(
                  [
                    ["all", "All"],
                    ["tools", "Tools"],
                    ["componentlab", "Component Lab"],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    className={`rounded-md px-2.5 py-1 transition ${
                      section === key
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                    type="button"
                    onClick={() => setSection(key)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            }
            subtitle="Sessions that operated the page (button, field or dropdown) vs. just opened it"
            title="Tool & component usage"
          >
            <DataTable
              columns={[
                { key: "path", header: "Page", render: (r) => r.path, sortValue: (r) => r.path },
                { key: "views", header: "Views", align: "right", render: (r) => fmtInt(r.views), sortValue: (r) => r.views },
                { key: "sessions", header: "Sessions", align: "right", render: (r) => fmtInt(r.sessions), sortValue: (r) => r.sessions },
                { key: "engaged", header: "Used it", align: "right", render: (r) => fmtInt(r.engaged), sortValue: (r) => r.engaged },
                { key: "rate", header: "Use rate", align: "right", render: (r) => fmtPct(r.rate, 0), sortValue: (r) => r.rate },
              ]}
              initialSort={{ key: "sessions", dir: "desc" }}
              rowKey={(r) => r.path}
              rows={toolRows}
            />
          </Card>
        </div>
      </StatePanel>
    </>
  );
}
