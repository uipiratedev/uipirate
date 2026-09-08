"use client";

import { Tooltip } from "@heroui/react";
import { Icon } from "./icons";
import { fmtPct } from "./format";

export function PageHeader({
  title,
  description,
  badge,
  actions,
}: {
  title?: string;
  description?: string;
  badge?: string;
  actions?: React.ReactNode;
}) {
  if (!description && !actions && !badge) return null;

  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div className="min-w-0 max-w-3xl">
        <div className="flex flex-wrap items-center gap-2">
          {badge ? (
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600 ring-1 ring-gray-200">
              {badge}
            </span>
          ) : null}
          {description ? (
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">{actions}</div>
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
      className={`rounded-2xl border border-gray-200/80 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] transition-shadow duration-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] ${className}`}
    >
      {(title || actions) && (
        <header className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-3.5">
          <div>
            {title ? (
              <h2 className="text-sm font-semibold tracking-tight text-gray-900">
                {title}
              </h2>
            ) : null}
            {subtitle ? (
              <p className="mt-0.5 text-xs text-gray-400">{subtitle}</p>
            ) : null}
          </div>
          {actions}
        </header>
      )}
      <div className={`p-5 ${bodyClassName}`}>{children}</div>
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
      <div className="flex h-44 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-200 bg-white/50 text-sm text-gray-400">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
        <span className="font-medium text-gray-500">Loading data…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-44 flex-col items-center justify-center gap-2.5 rounded-2xl border border-red-200/60 bg-red-50/40 p-6 text-center text-sm text-red-700">
        <Icon.alertTriangle className="h-5 w-5 text-red-500" />
        <span className="font-medium">{error}</span>
        {onRetry ? (
          <button
            className="mt-1 inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 shadow-sm transition-colors hover:bg-red-50"
            onClick={onRetry}
          >
            <Icon.refresh className="h-3.5 w-3.5" />
            Retry Request
          </button>
        ) : null}
      </div>
    );
  }

  if (empty) {
    return (
      <div className="flex h-44 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-200 bg-white/50 p-6 text-center text-sm text-gray-400">
        <Icon.inbox className="h-6 w-6 text-gray-300" />
        <span>{emptyText}</span>
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
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
        up
          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20"
          : "bg-red-50 text-red-700 ring-1 ring-red-600/20"
      }`}
    >
      <Arrow className="h-3 w-3 shrink-0" />
      {fmtPct(Math.abs(value), 0)}
    </span>
  );
}

const STATUS_CONFIG: Record<
  string,
  { bg: string; text: string; ring: string; dot: string }
> = {
  new: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    ring: "ring-blue-600/20",
    dot: "bg-blue-500",
  },
  contacted: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    ring: "ring-amber-600/20",
    dot: "bg-amber-500",
  },
  qualified: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    ring: "ring-purple-600/20",
    dot: "bg-purple-500",
  },
  won: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    ring: "ring-emerald-600/20",
    dot: "bg-emerald-500",
  },
  lost: {
    bg: "bg-gray-100",
    text: "text-gray-600",
    ring: "ring-gray-500/20",
    dot: "bg-gray-400",
  },
};

export function StatusChip({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status.toLowerCase()] || STATUS_CONFIG.lost;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${cfg.bg} ${cfg.text} ${cfg.ring}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      <span className="capitalize">{status}</span>
    </span>
  );
}
