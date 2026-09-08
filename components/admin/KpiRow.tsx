"use client";

export interface Kpi {
  label: string;
  value: string;
  hint?: string;
}

export function KpiRow({ items }: { items: Kpi[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {items.map((k) => (
        <div
          key={k.label}
          className="rounded-xl border border-gray-200 bg-white px-4 py-3"
        >
          <div className="text-xs font-medium uppercase tracking-wide text-gray-400">
            {k.label}
          </div>
          <div className="mt-1 text-2xl font-semibold tabular-nums text-gray-900">
            {k.value}
          </div>
          {k.hint ? (
            <div className="mt-0.5 text-xs text-gray-400">{k.hint}</div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
