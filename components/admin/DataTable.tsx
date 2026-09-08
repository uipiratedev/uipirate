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
}: {
  rows: T[];
  columns: Column<T>[];
  initialSort?: { key: string; dir: "asc" | "desc" };
  rowKey: (row: T, i: number) => string;
  onRowClick?: (row: T) => void;
  emptyText?: string;
  maxHeight?: number;
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
      className="overflow-auto rounded-lg border border-gray-200"
      style={maxHeight ? { maxHeight } : undefined}
    >
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead className="sticky top-0 z-10 bg-gray-50 text-xs uppercase tracking-wide text-gray-400">
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                className={`whitespace-nowrap px-3 py-2 font-medium ${
                  c.align === "right" ? "text-right" : "text-left"
                } ${c.sortValue ? "cursor-pointer select-none hover:text-gray-600" : ""}`}
                style={c.width ? { width: c.width } : undefined}
                onClick={c.sortValue ? () => toggleSort(c.key) : undefined}
              >
                <span className="inline-flex items-center gap-1">
                  {c.header}
                  {sort?.key === c.key ? (
                    <Icon.chevron
                      className={`h-3 w-3 ${sort.dir === "asc" ? "rotate-180" : ""}`}
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
                className="px-3 py-8 text-center text-gray-400"
                colSpan={columns.length}
              >
                {emptyText}
              </td>
            </tr>
          ) : (
            sorted.map((row, i) => (
              <tr
                key={rowKey(row, i)}
                className={onRowClick ? "cursor-pointer hover:bg-gray-50" : ""}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={`px-3 py-2 ${c.align === "right" ? "text-right tabular-nums" : "text-left"}`}
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
