"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { INK, SEQ_BLUE, SERIES } from "./format";
import { fmtDate, fmtInt } from "./format";

export interface SeriesDef {
  key: string;
  label: string;
}

/** Multi-series area chart with one shared y-axis, crosshair + tooltip. */
export function TrendChart({
  data,
  series,
  xKey = "bucket",
  height = 280,
  xIsDate = true,
}: {
  data: readonly any[];
  series: SeriesDef[];
  xKey?: string;
  height?: number;
  xIsDate?: boolean;
}) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{ top: 8, right: 12, bottom: 4, left: 4 }}
        >
          <defs>
            {series.map((s, i) => (
              <linearGradient
                key={s.key}
                id={`grad-${s.key}`}
                x1="0"
                x2="0"
                y1="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor={SERIES[i % SERIES.length]}
                  stopOpacity={0.22}
                />
                <stop
                  offset="100%"
                  stopColor={SERIES[i % SERIES.length]}
                  stopOpacity={0.02}
                />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid
            stroke={INK.grid}
            strokeDasharray="0"
            vertical={false}
          />
          <XAxis
            axisLine={{ stroke: INK.grid }}
            dataKey={xKey}
            minTickGap={28}
            tick={{ fill: INK.muted, fontSize: 11 }}
            tickFormatter={(v) => (xIsDate ? fmtDate(v as string) : String(v))}
            tickLine={false}
          />
          <YAxis
            axisLine={false}
            tick={{ fill: INK.muted, fontSize: 11 }}
            tickFormatter={(v) => fmtInt(v as number)}
            tickLine={false}
            width={44}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 10,
              border: "1px solid #e5e7eb",
              fontSize: 12,
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            }}
            formatter={(value, name) => [
              fmtInt(value as number),
              name as string,
            ]}
            labelFormatter={(v) => (xIsDate ? fmtDate(v as string) : String(v))}
            labelStyle={{ color: INK.secondary, fontWeight: 600 }}
          />
          <Legend
            formatter={(v) => (
              <span style={{ color: INK.secondary, fontSize: 12 }}>{v}</span>
            )}
            iconType="plainline"
          />
          {series.map((s, i) => (
            <Area
              key={s.key}
              dataKey={s.key}
              fill={`url(#grad-${s.key})`}
              name={s.label}
              stroke={SERIES[i % SERIES.length]}
              strokeWidth={2}
              type="monotone"
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Horizontal bar list — direct-labelled, no axis. `rows` pre-sorted desc. */
export function BreakdownBars({
  rows,
  valueKey = "sessions",
  labelKey = "key",
  formatValue = fmtInt,
  max,
}: {
  rows: readonly any[];
  valueKey?: string;
  labelKey?: string;
  formatValue?: (n: number) => string;
  max?: number;
}) {
  if (!rows.length) {
    return <p className="py-6 text-center text-sm text-gray-400">No data.</p>;
  }

  const top = max ? rows.slice(0, max) : rows;
  const peak = Math.max(...top.map((r) => Number(r[valueKey]) || 0), 1);

  return (
    <ul className="space-y-2">
      {top.map((r, i) => {
        const v = Number(r[valueKey]) || 0;
        const label = String(r[labelKey] ?? "(unknown)");

        return (
          <li key={`${label}-${i}`} className="text-sm">
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="truncate text-gray-700" title={label}>
                {label || "(none)"}
              </span>
              <span className="shrink-0 tabular-nums text-gray-500">
                {formatValue(v)}
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-gray-100">
              <div
                className="h-1.5 rounded-full"
                style={{ width: `${(v / peak) * 100}%`, background: SERIES[0] }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/** Donut with legend; always pair with a table (relief rule). */
export function Donut({
  data,
  height = 220,
}: {
  data: Array<{ name: string; value: number }>;
  height?: number;
}) {
  const total = data.reduce((s, d) => s + d.value, 0);

  if (!total)
    return <p className="py-8 text-center text-sm text-gray-400">No data.</p>;

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius="58%"
            nameKey="name"
            outerRadius="88%"
            paddingAngle={2}
            stroke="#fff"
            strokeWidth={2}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={SERIES[i % SERIES.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: 10,
              border: "1px solid #e5e7eb",
              fontSize: 12,
            }}
            formatter={(value, name) => [
              `${fmtInt(value as number)} (${(((value as number) / total) * 100).toFixed(0)}%)`,
              name as string,
            ]}
          />
          <Legend
            formatter={(v) => (
              <span style={{ color: INK.secondary, fontSize: 12 }}>{v}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Hour (0–23) × ISO weekday (1=Mon…7=Sun) activity grid. */
export function ActivityHeatmap({
  cells,
}: {
  cells: Array<{ hour: number; weekday: number; count: number }>;
}) {
  const grid = new Map<string, number>();
  let peak = 1;

  for (const c of cells) {
    grid.set(`${c.weekday}-${c.hour}`, c.count);
    if (c.count > peak) peak = c.count;
  }

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const color = (n: number) => {
    if (!n) return "#f6f6f5";
    const idx = Math.min(
      SEQ_BLUE.length - 1,
      1 + Math.floor((n / peak) * (SEQ_BLUE.length - 2)),
    );

    return SEQ_BLUE[idx];
  };

  return (
    <div className="overflow-x-auto">
      <table className="border-separate" style={{ borderSpacing: 2 }}>
        <thead>
          <tr>
            <th className="w-8" />
            {Array.from({ length: 24 }).map((_, h) => (
              <th key={h} className="text-[9px] font-normal text-gray-400">
                {h % 6 === 0 ? `${h}h` : ""}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {days.map((day, di) => (
            <tr key={day}>
              <td className="pr-1 text-right text-[10px] text-gray-400">
                {day}
              </td>
              {Array.from({ length: 24 }).map((_, h) => {
                const n = grid.get(`${di + 1}-${h}`) || 0;

                return (
                  <td
                    key={h}
                    className="h-4 w-4 rounded-[3px]"
                    style={{ background: color(n) }}
                    title={`${day} ${h}:00 — ${n} views`}
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Simple vertical bar histogram from {label,count} rows. */
export function MiniHistogram({
  rows,
}: {
  rows: Array<{ label: string; count: number }>;
}) {
  if (!rows.length)
    return <p className="py-6 text-center text-sm text-gray-400">No data.</p>;

  const peak = Math.max(...rows.map((r) => r.count), 1);

  return (
    <div className="flex items-end gap-2" style={{ height: 160 }}>
      {rows.map((r) => (
        <div key={r.label} className="flex flex-1 flex-col items-center gap-1">
          <span className="text-[10px] tabular-nums text-gray-400">
            {fmtInt(r.count)}
          </span>
          <div
            className="w-full rounded-t"
            style={{
              height: `${(r.count / peak) * 100}%`,
              minHeight: 2,
              background: SERIES[0],
            }}
          />
          <span className="text-[10px] text-gray-500">{r.label}</span>
        </div>
      ))}
    </div>
  );
}
