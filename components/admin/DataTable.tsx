"use client";

import { useMemo, useState } from "react";

import { Icon } from "./icons";

export interface Column<T> {
  key: string;
  header: string;
  align?: "left" | "right";
  /** Cell renderer. */
  render: (row: T) => React.ReactNode;
  /** Value used for sorting; omit to disable sort on this column. */
  sortValue?: (row: T) => number | string;
  width?: string;
}

export function DataTable<T>({
  rows,
  columns,
  initialSort,
  rowKey,
  onRowClick,
  emptyText = "No rows.",
  maxHeight,
  layout = "fixed",
}: {
  rows: T[];
  columns: Column<T>[];
  initialSort?: { key: string; dir: "asc" | "desc" };
  rowKey: (row: T, i: number) => string;
  onRowClick?: (row: T) => void;
  emptyText?: string;
  maxHeight?: number;
  layout?: "auto" | "fixed";
}) {
  const [sort, setSort] = useState(initialSort || null);

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);

    if (!col?.sortValue) return rows;

    const dir = sort.dir === "asc" ? 1 : -1;

    return [...rows].sort((a, b) => {
      const av = col.sortValue!(a);
      const bv = col.sortValue!(b);

      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;

      return 0;
    });
  }, [rows, sort, columns]);

  function toggleSort(key: string) {
    setSort((prev) => {
      if (prev?.key !== key) return { key, dir: "desc" };

      return { key, dir: prev.dir === "desc" ? "asc" : "desc" };
    });
  }

  return (
    <div
      className="w-full rounded-xl border border-gray-200/80 bg-white"
      style={maxHeight ? { maxHeight, overflowY: "auto" } : undefined}
    >
      <table className={`w-full border-collapse text-sm ${layout === "fixed" ? "table-fixed" : ""}`}>
        <thead className="bg-gray-50/90 text-xs uppercase tracking-wider text-gray-400">
          <tr className="border-b border-gray-200/80">
            {columns.map((c) => (
              <th
                key={c.key}
                className={`truncate px-4 py-3 font-semibold ${
                  c.align === "right" ? "text-right" : "text-left"
                } ${
                  c.sortValue
                    ? "cursor-pointer select-none transition-colors hover:text-gray-900"
                    : ""
                }`}
                style={c.width ? { width: c.width } : undefined}
                onClick={c.sortValue ? () => toggleSort(c.key) : undefined}
              >
                <span className="inline-flex items-center gap-1.5">
                  {c.header}
                  {sort?.key === c.key ? (
                    <Icon.chevron
                      className={`h-3 w-3 text-gray-900 transition-transform ${
                        sort.dir === "asc" ? "rotate-180" : ""
                      }`}
                    />
                  ) : null}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {sorted.length === 0 ? (
            <tr>
              <td
                className="px-4 py-12 text-center text-sm text-gray-400"
                colSpan={columns.length}
              >
                {emptyText}
              </td>
            </tr>
          ) : (
            sorted.map((row, i) => (
              <tr
                key={rowKey(row, i)}
                className={`transition-colors ${
                  onRowClick
                    ? "cursor-pointer hover:bg-slate-50/80"
                    : "hover:bg-slate-50/40"
                }`}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={`truncate px-4 py-3 text-sm text-gray-700 ${
                      c.align === "right" ? "text-right tabular-nums font-mono text-xs" : "text-left"
                    }`}
                  >
                    {c.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
