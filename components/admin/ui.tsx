"use client";

import { Icon } from "./icons";
import { fmtPct } from "./format";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        {description ? (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}

export function Card({
  title,
  subtitle,
  actions,
  children,
  className = "",
  bodyClassName = "",
}: {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section
      className={`rounded-xl border border-gray-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] ${className}`}
    >
      {(title || actions) && (
        <header className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-3">
          <div>
            {title ? (
              <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
            ) : null}
            {subtitle ? (
              <p className="text-xs text-gray-400">{subtitle}</p>
            ) : null}
          </div>
          {actions}
        </header>
      )}
      <div className={`p-4 ${bodyClassName}`}>{children}</div>
    </section>
  );
}

export function StatePanel({
  loading,
  error,
  empty,
  emptyText = "No data for this period yet.",
  onRetry,
  children,
}: {
  loading?: boolean;
  error?: string | null;
  empty?: boolean;
  emptyText?: string;
  onRetry?: () => void;
  children: React.ReactNode;
}) {
  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-gray-400">
        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
        Loading…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-40 flex-col items-center justify-center gap-2 text-sm text-red-600">
        <span>{error}</span>
        {onRetry ? (
          <button
            className="text-xs font-medium text-gray-500 underline"
            onClick={onRetry}
          >
            Retry
          </button>
        ) : null}
      </div>
    );
  }

  if (empty) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-gray-400">
        {emptyText}
      </div>
    );
  }

  return <>{children}</>;
}

export function DeltaBadge({ value }: { value: number }) {
  if (!isFinite(value) || Math.abs(value) < 0.0005) {
    return <span className="text-xs text-gray-400">—</span>;
  }

  const up = value > 0;
  const Arrow = up ? Icon.arrowUp : Icon.arrowDown;

  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs font-medium ${
        up ? "text-emerald-600" : "text-red-600"
      }`}
    >
      <Arrow className="h-3 w-3" />
      {fmtPct(Math.abs(value), 0)}
    </span>
  );
}

const STATUS_STYLES: Record<string, string> = {
  new: "bg-blue-50 text-blue-700 ring-blue-600/20",
  contacted: "bg-amber-50 text-amber-700 ring-amber-600/20",
  qualified: "bg-violet-50 text-violet-700 ring-violet-600/20",
  won: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  lost: "bg-gray-100 text-gray-500 ring-gray-500/20",
};

export function StatusChip({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
        STATUS_STYLES[status] || STATUS_STYLES.lost
      }`}
    >
      {status}
    </span>
  );
}
