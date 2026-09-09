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
          className="group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-[0_6px_16px_rgba(0,0,0,0.06)]"
        >
          {/* Subtle top accent highlight on hover */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-gray-900/40 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

          <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
            {k.label}
          </div>
          <div className="mt-1.5 text-2xl font-bold tracking-tight tabular-nums text-gray-900">
            {k.value}
          </div>
          {k.hint ? (
            <div className="mt-1 truncate text-xs text-gray-400" title={k.hint}>
              {k.hint}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
