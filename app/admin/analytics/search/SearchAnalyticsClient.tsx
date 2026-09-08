"use client";

import { useMemo, useState } from "react";
import { Chip, DateRangePicker } from "@heroui/react";
import { parseDate } from "@internationalized/date";

import { useApi } from "@/lib/admin/useApi";
import { useDashboard } from "@/lib/admin/DashboardContext";
import { PRESET_LABELS, type RangePreset } from "@/lib/admin/dateRange";
import { PageHeader, Card, StatePanel } from "@/components/admin/ui";
import { KpiRow, type Kpi } from "@/components/admin/KpiRow";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { TrendChart } from "@/components/admin/charts";
import { Icon } from "@/components/admin/icons";
import { fmtInt, fmtPct } from "@/components/admin/format";
import {
  type SearchAnalyticsResult,
  type SearchQueryItem,
  type SearchCountryItem,
  type SearchPageItem,
} from "@/lib/analytics/searchConsole";

export default function SearchAnalyticsClient() {
  const { range, setPreset, setCustomRange } = useDashboard();
  const [engine, setEngine] = useState<"all" | "google" | "bing">("all");
  const [activeTab, setActiveTab] = useState<"queries" | "countries" | "pages">("queries");
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [q, setQ] = useState("");

  const DATE_PRESETS: Array<{ key: RangePreset; label: string }> = [
    { key: "7d", label: "7D" },
    { key: "28d", label: "28D" },
    { key: "90d", label: "3M" },
    { key: "12m", label: "12M" },
    { key: "24h", label: "24H" },
  ];

  const parsedDateValue = useMemo(() => {
    try {
      if (range.from && range.to) {
        return {
          start: parseDate(range.from.slice(0, 10)),
          end: parseDate(range.to.slice(0, 10)),
        };
      }
    } catch {
      // ignore parse error
    }
    return undefined;
  }, [range.from, range.to]);

  const { data, loading, error, refetch } = useApi<SearchAnalyticsResult>(
    "/api/admin/analytics/search",
    { engine },
  );

  const kpis: Kpi[] = useMemo(() => {
    const k = data?.kpis;
    return [
      {
        label: "Search Impressions",
        value: fmtInt(k?.totalImpressions ?? 0),
        hint: "Google & Bing search appearances",
      },
      {
        label: "Organic Clicks",
        value: fmtInt(k?.totalClicks ?? 0),
        hint: `Google: ${fmtInt(k?.googleClicks ?? 0)} · Bing: ${fmtInt(k?.bingClicks ?? 0)}`,
      },
      {
        label: "Average Search CTR",
        value: fmtPct(k?.avgCtr ?? 0, 1),
        hint: "Search clicks ÷ impressions",
      },
      {
        label: "Average Position",
        value: k?.avgPosition ? `#${k.avgPosition}` : "—",
        hint: "Average rank across search keywords",
      },
    ];
  }, [data]);

  // Unique country list for dropdown filter
  const countryOptions = useMemo(() => {
    const set = new Map<string, string>();
    for (const c of data?.countries || []) {
      if (c.country && c.country !== "Unknown") {
        set.set(c.country, c.countryCode);
      }
    }
    for (const q of data?.queries || []) {
      if (q.country && q.country !== "Unknown" && !set.has(q.country)) {
        set.set(q.country, q.countryCode || q.country);
      }
    }
    return Array.from(set.entries()).map(([country, code]) => ({ country, code }));
  }, [data]);

  // Filtered queries by search text AND selected country
  const filteredQueries = useMemo(() => {
    let list = data?.queries || [];
    if (selectedCountry !== "all") {
      list = list.filter(
        (item) =>
          item.country === selectedCountry ||
          item.countryCode === selectedCountry,
      );
    }
    if (!q.trim()) return list;
    const queryLower = q.toLowerCase();
    return list.filter(
      (item) =>
        item.query.toLowerCase().includes(queryLower) ||
        (item.page && item.page.toLowerCase().includes(queryLower)) ||
        (item.country && item.country.toLowerCase().includes(queryLower)),
    );
  }, [data, q, selectedCountry]);

  // Query Columns
  const queryColumns: Column<SearchQueryItem>[] = [
    {
      key: "query",
      header: "Search Keyword / Query",
      width: "32%",
      render: (r) => (
        <div className="min-w-0">
          <span className="block truncate font-semibold text-xs text-gray-900" title={r.query}>
            {r.query}
          </span>
          {r.page ? (
            <span className="block truncate font-mono text-[10px] text-gray-400 mt-0.5" title={r.page}>
              {r.page}
            </span>
          ) : null}
        </div>
      ),
      sortValue: (r) => r.query,
    },
    {
      key: "country",
      header: "Country",
      width: "140px",
      render: (r) =>
        r.country ? (
          <button
            className="inline-flex items-center gap-1.5 rounded-md bg-gray-100 hover:bg-gray-200 px-2 py-0.5 text-xs text-gray-800 transition-colors"
            title={`Filter by ${r.country}`}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedCountry(r.country!);
            }}
          >
            {r.countryCode ? (
              <span className="font-mono text-[10px] font-bold text-gray-500">
                {r.countryCode}
              </span>
            ) : null}
            <span className="truncate max-w-[90px]">{r.country}</span>
          </button>
        ) : (
          <span className="text-gray-400 text-xs">—</span>
        ),
      sortValue: (r) => r.country || "",
    },
    {
      key: "engine",
      header: "Engine",
      width: "95px",
      render: (r) => (
        <Chip
          className="text-[10px] h-5"
          color={r.engine === "google" ? "primary" : "secondary"}
          size="sm"
          variant="flat"
        >
          {r.engine === "google" ? "Google GSC" : "Bing WMT"}
        </Chip>
      ),
      sortValue: (r) => r.engine,
    },
    {
      key: "position",
      header: "Avg Rank",
      align: "right",
      width: "85px",
      render: (r) => (
        <span
          className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-mono font-bold ${
            r.position <= 3
              ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20"
              : r.position <= 10
              ? "bg-blue-50 text-blue-700 ring-1 ring-blue-600/20"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          #{r.position}
        </span>
      ),
      sortValue: (r) => r.position,
    },
    {
      key: "impressions",
      header: "Impressions",
      align: "right",
      width: "95px",
      render: (r) => fmtInt(r.impressions),
      sortValue: (r) => r.impressions,
    },
    {
      key: "clicks",
      header: "Clicks",
      align: "right",
      width: "80px",
      render: (r) => (
        <span className="font-semibold text-gray-900">{fmtInt(r.clicks)}</span>
      ),
      sortValue: (r) => r.clicks,
    },
    {
      key: "ctr",
      header: "CTR",
      align: "right",
      width: "80px",
      render: (r) => (r.impressions > 0 ? fmtPct(r.ctr, 1) : "—"),
      sortValue: (r) => r.ctr,
    },
  ];

  // Country Columns with interactive drilldown
  const countryColumns: Column<SearchCountryItem>[] = [
    {
      key: "country",
      header: "Country",
      width: "35%",
      render: (r) => (
        <div className="flex items-center gap-2 min-w-0">
          <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-gray-600">
            {r.countryCode}
          </span>
          <span className="truncate font-semibold text-xs text-gray-900" title={r.country}>
            {r.country}
          </span>
        </div>
      ),
      sortValue: (r) => r.country,
    },
    {
      key: "position",
      header: "Avg Rank",
      align: "right",
      width: "90px",
      render: (r) => (
        <span className="font-mono text-xs font-semibold text-gray-700">
          #{r.position}
        </span>
      ),
      sortValue: (r) => r.position,
    },
    {
      key: "impressions",
      header: "Impressions",
      align: "right",
      width: "110px",
      render: (r) => fmtInt(r.impressions),
      sortValue: (r) => r.impressions,
    },
    {
      key: "clicks",
      header: "Clicks",
      align: "right",
      width: "90px",
      render: (r) => (
        <span className="font-semibold text-gray-900">{fmtInt(r.clicks)}</span>
      ),
      sortValue: (r) => r.clicks,
    },
    {
      key: "ctr",
      header: "CTR",
      align: "right",
      width: "90px",
      render: (r) => fmtPct(r.ctr, 1),
      sortValue: (r) => r.ctr,
    },
    {
      key: "action",
      header: "Drill Down",
      align: "right",
      width: "120px",
      render: (r) => (
        <button
          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 px-2.5 py-1 text-[11px] font-semibold text-gray-700 shadow-sm transition-all"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedCountry(r.country);
            setActiveTab("queries");
          }}
        >
          <span>View Queries</span>
          <Icon.chevronRight className="h-3 w-3 text-gray-400" />
        </button>
      ),
    },
  ];

  // Page Columns with interactive drilldown
  const pageColumns: Column<SearchPageItem>[] = [
    {
      key: "page",
      header: "Landing URL",
      width: "38%",
      render: (r) => (
        <span className="block truncate font-mono text-xs text-gray-800" title={r.page}>
          {r.page}
        </span>
      ),
      sortValue: (r) => r.page,
    },
    {
      key: "position",
      header: "Avg Rank",
      align: "right",
      width: "90px",
      render: (r) => (
        <span className="font-mono text-xs font-semibold text-gray-700">
          #{r.position}
        </span>
      ),
      sortValue: (r) => r.position,
    },
    {
      key: "impressions",
      header: "Impressions",
      align: "right",
      width: "110px",
      render: (r) => fmtInt(r.impressions),
      sortValue: (r) => r.impressions,
    },
    {
      key: "clicks",
      header: "Clicks",
      align: "right",
      width: "90px",
      render: (r) => (
        <span className="font-semibold text-gray-900">{fmtInt(r.clicks)}</span>
      ),
      sortValue: (r) => r.clicks,
    },
    {
      key: "ctr",
      header: "CTR",
      align: "right",
      width: "90px",
      render: (r) => fmtPct(r.ctr, 1),
      sortValue: (r) => r.ctr,
    },
    {
      key: "action",
      header: "Drill Down",
      align: "right",
      width: "120px",
      render: (r) => (
        <button
          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 px-2.5 py-1 text-[11px] font-semibold text-gray-700 shadow-sm transition-all"
          onClick={(e) => {
            e.stopPropagation();
            setQ(r.page);
            setActiveTab("queries");
          }}
        >
          <span>View Keywords</span>
          <Icon.chevronRight className="h-3 w-3 text-gray-400" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Chip
              className="text-[11px] font-medium"
              color={data?.mocked ? "warning" : "success"}
              size="sm"
              variant="flat"
            >
              {data?.mocked ? "⚠️ Dev Preview Data" : "🟢 Live GSC / Bing Data"}
            </Chip>

            {/* Date Range Selector */}
            <div className="flex items-center gap-1.5 rounded-xl border border-gray-200/80 bg-white p-1 shadow-sm">
              <span className="flex items-center gap-1 pl-2 pr-1 text-[11px] font-semibold text-gray-400">
                <Icon.calendar className="h-3.5 w-3.5 text-gray-400" />
              </span>
              {DATE_PRESETS.map((p) => (
                <button
                  key={p.key}
                  className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all ${
                    range.preset === p.key
                      ? "bg-gray-900 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                  onClick={() => setPreset(p.key)}
                >
                  {p.label}
                </button>
              ))}

              <div className="h-4 w-px bg-gray-200 mx-0.5" />

              {/* HeroUI DateRangePicker Component */}
              <DateRangePicker
                aria-label="Date Range Picker"
                className="w-auto min-w-[210px]"
                classNames={{
                  inputWrapper:
                    "h-7 bg-transparent border-none shadow-none text-xs hover:bg-gray-100/60 rounded-lg",
                  segment: "text-xs font-mono",
                }}
                maxValue={parseDate(new Date().toISOString().slice(0, 10))}
                size="sm"
                value={parsedDateValue}
                variant="flat"
                onChange={(val) => {
                  if (val?.start && val?.end) {
                    setCustomRange(val.start.toString(), val.end.toString());
                  }
                }}
              />
            </div>

            {/* Search Engine Switcher */}
            <div className="flex items-center gap-1.5 rounded-xl border border-gray-200/80 bg-white p-1 shadow-sm">
              {(
                [
                  { key: "all", label: "All Search" },
                  { key: "google", label: "Google GSC" },
                  { key: "bing", label: "Bing WMT" },
                ] as const
              ).map((item) => (
                <button
                  key={item.key}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    engine === item.key
                      ? "bg-gray-900 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                  onClick={() => setEngine(item.key)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        }
        description="Organic search performance, exact Google & Bing keyword rankings, impressions, search CTR, and country-level search demand."
        title="Search Intelligence & Keywords"
      />

      {/* Preview Data Notice */}
      {data?.mocked && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-800">
          <Icon.alertCircle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-amber-900 block">Preview Mode Active</span>
            <p className="text-amber-700">
              Live Google Search Console & Bing Webmaster APIs are connected, but 0 search analytics records were returned for your domain (e.g. if the domain was recently connected, has no impressions in this date range, or the service account is awaiting verification in Google Search Console).
              Showing realistic preview keyword data below so you can inspect all rankings, filters, and charts.
            </p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <KpiRow items={kpis} />

      {/* Trend Chart */}
      {data?.series && data.series.length > 0 ? (
        <Card subtitle="Search clicks vs. impressions trends" title="Organic Search Trends">
          <div className="pt-2">
            <TrendChart
              data={data.series.map((s) => ({
                bucket: s.date,
                clicks: s.clicks,
                impressions: s.impressions,
              }))}
              series={[
                { key: "clicks", label: "Organic Clicks" },
                { key: "impressions", label: "Search Impressions" },
              ]}
            />
          </div>
        </Card>
      ) : null}

      {/* Sub-Dimension Navigation Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200/80 pb-3">
        <div className="flex items-center gap-2">
          {(
            [
              {
                key: "queries",
                label: "Keywords & Queries",
                count: data?.queries?.length || 0,
              },
              {
                key: "countries",
                label: "Countries & Geo",
                count: data?.countries?.length || 0,
              },
              {
                key: "pages",
                label: "Landing Pages",
                count: data?.pages?.length || 0,
              },
            ] as const
          ).map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                  active
                    ? "bg-gray-900 text-white shadow-sm"
                    : "bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200/80"
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                    active
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {activeTab === "queries" ? (
          <div className="flex flex-wrap items-center gap-2">
            {/* Country Filter Dropdown */}
            {countryOptions.length > 0 && (
              <div className="flex items-center gap-1.5">
                <select
                  aria-label="Filter by Country"
                  className="rounded-xl border border-gray-200/80 bg-white py-1.5 pl-3 pr-8 text-xs font-semibold text-gray-700 shadow-sm focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/5 transition-all"
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                >
                  <option value="all">🌍 All Countries ({countryOptions.length})</option>
                  {countryOptions.map((c) => (
                    <option key={c.country} value={c.country}>
                      {c.country} ({c.code})
                    </option>
                  ))}
                </select>
                {selectedCountry !== "all" && (
                  <button
                    className="inline-flex items-center gap-1 rounded-lg bg-gray-100 hover:bg-gray-200 px-2 py-1 text-xs font-medium text-gray-600 transition-colors"
                    title="Clear country filter"
                    onClick={() => setSelectedCountry("all")}
                  >
                    <span>Clear</span>
                    <Icon.x className="h-3 w-3" />
                  </button>
                )}
              </div>
            )}

            {/* Keyword / URL Search Box */}
            <div className="relative min-w-[220px]">
              <Icon.search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                className="w-full rounded-xl border border-gray-200/80 bg-white py-1.5 pl-10 pr-3.5 text-xs text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/5 transition-all"
                placeholder="Search keyword or URL…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              {q && (
                <button
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setQ("")}
                >
                  <Icon.x className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {/* Main Data Table */}
      <StatePanel error={error} loading={loading && !data} onRetry={refetch}>
        {activeTab === "queries" ? (
          <Card
            bodyClassName="p-0"
            subtitle={
              selectedCountry !== "all"
                ? `Showing keywords searched by users in ${selectedCountry}`
                : undefined
            }
            title={
              selectedCountry !== "all"
                ? `${filteredQueries.length} Keywords in ${selectedCountry}`
                : `${filteredQueries.length} Search Keywords`
            }
          >
            <DataTable
              columns={queryColumns}
              initialSort={{ key: "clicks", dir: "desc" }}
              rowKey={(r, i) => `${r.query}|${r.countryCode || ""}|${r.engine}|${i}`}
              rows={filteredQueries}
            />
          </Card>
        ) : activeTab === "countries" ? (
          <Card
            bodyClassName="p-0"
            subtitle="Click 'View Queries' on any country to see what users in that country searched"
            title={`${data?.countries?.length || 0} Search Countries`}
          >
            <DataTable
              columns={countryColumns}
              initialSort={{ key: "clicks", dir: "desc" }}
              rowKey={(r) => r.countryCode}
              rows={data?.countries || []}
            />
          </Card>
        ) : (
          <Card
            bodyClassName="p-0"
            subtitle="Click 'View Keywords' on any landing page to see which search queries triggered it"
            title={`${data?.pages?.length || 0} Landing Pages`}
          >
            <DataTable
              columns={pageColumns}
              initialSort={{ key: "clicks", dir: "desc" }}
              rowKey={(r) => r.page}
              rows={data?.pages || []}
            />
          </Card>
        )}
      </StatePanel>
    </div>
  );
}
