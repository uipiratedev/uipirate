"use client";

import { useMemo, useState } from "react";
import { Button, Chip } from "@heroui/react";

import { useApi } from "@/lib/admin/useApi";
import { PageHeader, Card, StatePanel } from "@/components/admin/ui";
import { KpiRow, type Kpi } from "@/components/admin/KpiRow";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Icon } from "@/components/admin/icons";
import { fmtInt, fmtPct } from "@/components/admin/format";

export type PageCategory =
  | "all"
  | "componentlab"
  | "tools"
  | "case-studies"
  | "blogs"
  | "main";

interface ClickRow {
  label: string;
  path: string;
  tag?: string;
  href?: string;
  analyticsId?: string;
  section?: string;
  clicks: number;
  uniqueVisitors: number;
  pageViews: number;
  ctr: number;
}

export function categorizePath(path: string): {
  category: Exclude<PageCategory, "all">;
  label: string;
  color: "primary" | "secondary" | "warning" | "success" | "default";
} {
  const p = (path || "").toLowerCase();

  if (
    p.startsWith("/componentlab") ||
    p.startsWith("/components") ||
    p.startsWith("/elements")
  ) {
    return { category: "componentlab", label: "Component Lab", color: "primary" };
  }
  if (
    p.startsWith("/tools") ||
    p.includes("-generator") ||
    p.includes("-converter")
  ) {
    return { category: "tools", label: "Tools", color: "secondary" };
  }
  if (p.startsWith("/case-studies") || p.startsWith("/case-study")) {
    return { category: "case-studies", label: "Case Studies", color: "warning" };
  }
  if (
    p.startsWith("/blogs") ||
    p.startsWith("/blog") ||
    p.startsWith("/articles")
  ) {
    return { category: "blogs", label: "Blogs", color: "success" };
  }

  return { category: "main", label: "Main Site", color: "default" };
}

function kindOf(r: ClickRow): string {
  if (
    r.analyticsId &&
    /cta|book|contact|estimate|start|join|buy|demo/i.test(r.analyticsId)
  )
    return "CTA";
  if (r.tag === "button") return "button";
  if (r.tag === "a" || r.href) return "link";

  return "other";
}

export default function ClicksClient() {
  const { data, loading, error, refetch } = useApi<{ rows: ClickRow[] }>(
    "/api/admin/analytics/clicks",
  );

  const [selectedCategory, setSelectedCategory] = useState<PageCategory>("main");
  const [pathFilter, setPathFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"flat" | "grouped">("flat");
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set());

  // Category counts and grouped paths
  const { categoryCounts, groupedPaths, kpis } = useMemo(() => {
    const rawRows = data?.rows || [];
    const counts: Record<PageCategory, number> = {
      all: rawRows.length,
      componentlab: 0,
      tools: 0,
      "case-studies": 0,
      blogs: 0,
      main: 0,
    };

    const grouped: Record<Exclude<PageCategory, "all">, Set<string>> = {
      componentlab: new Set(),
      tools: new Set(),
      "case-studies": new Set(),
      blogs: new Set(),
      main: new Set(),
    };

    let totalClicks = 0;
    let componentClicks = 0;
    let toolClicks = 0;
    let ctaClicks = 0;

    for (const r of rawRows) {
      const { category } = categorizePath(r.path);
      counts[category] = (counts[category] || 0) + 1;
      grouped[category].add(r.path);

      totalClicks += r.clicks || 0;
      if (category === "componentlab") componentClicks += r.clicks || 0;
      if (category === "tools") toolClicks += r.clicks || 0;
      if (kindOf(r) === "CTA") ctaClicks += r.clicks || 0;
    }

    const kpiItems: Kpi[] = [
      {
        label: "Total Clicks",
        value: fmtInt(totalClicks),
        hint: `${fmtInt(rawRows.length)} tracked elements`,
      },
      {
        label: "Component Lab Clicks",
        value: fmtInt(componentClicks),
        hint: `${fmtPct(totalClicks > 0 ? componentClicks / totalClicks : 0, 0)} of all clicks`,
      },
      {
        label: "Tools & Apps Clicks",
        value: fmtInt(toolClicks),
        hint: `${fmtPct(totalClicks > 0 ? toolClicks / totalClicks : 0, 0)} of all clicks`,
      },
      {
        label: "CTA / Conversion Clicks",
        value: fmtInt(ctaClicks),
        hint: "Action & contact triggers",
      },
    ];

    return {
      categoryCounts: counts,
      groupedPaths: grouped,
      kpis: kpiItems,
    };
  }, [data]);

  // Filtered rows
  const filteredRows = useMemo(() => {
    let rows = data?.rows || [];

    if (selectedCategory !== "all") {
      rows = rows.filter(
        (r) => categorizePath(r.path).category === selectedCategory,
      );
    }

    if (pathFilter) {
      rows = rows.filter((r) => r.path === pathFilter);
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      rows = rows.filter(
        (r) =>
          (r.label && r.label.toLowerCase().includes(q)) ||
          (r.path && r.path.toLowerCase().includes(q)) ||
          (r.section && r.section.toLowerCase().includes(q)) ||
          (r.href && r.href.toLowerCase().includes(q)),
      );
    }

    return rows;
  }, [data, selectedCategory, pathFilter, searchTerm]);

  // Grouped by page structure
  const pageGroups = useMemo(() => {
    const map = new Map<
      string,
      {
        path: string;
        categoryMeta: ReturnType<typeof categorizePath>;
        totalClicks: number;
        uniqueVisitors: number;
        pageViews: number;
        elements: ClickRow[];
      }
    >();

    for (const r of filteredRows) {
      if (!map.has(r.path)) {
        map.set(r.path, {
          path: r.path,
          categoryMeta: categorizePath(r.path),
          totalClicks: 0,
          uniqueVisitors: 0,
          pageViews: r.pageViews || 0,
          elements: [],
        });
      }
      const group = map.get(r.path)!;
      group.totalClicks += r.clicks;
      group.uniqueVisitors = Math.max(group.uniqueVisitors, r.uniqueVisitors);
      group.elements.push(r);
    }

    return Array.from(map.values()).sort(
      (a, b) => b.totalClicks - a.totalClicks,
    );
  }, [filteredRows]);

  const toggleExpand = (path: string) => {
    const next = new Set(expandedPages);
    if (next.has(path)) next.delete(path);
    else next.add(path);
    setExpandedPages(next);
  };

  const expandAll = () => {
    setExpandedPages(new Set(pageGroups.map((p) => p.path)));
  };

  const collapseAll = () => {
    setExpandedPages(new Set());
  };

  const columns: Column<ClickRow>[] = [
    {
      key: "label",
      header: "Element / Target",
      width: "30%",
      render: (r) => (
        <div className="min-w-0">
          <span
            className="block truncate font-medium text-gray-800"
            title={r.label}
          >
            {r.label || "(unlabeled)"}
          </span>
          {r.href ? (
            <span
              className="block truncate text-xs text-gray-400 font-mono"
              title={r.href}
            >
              → {r.href}
            </span>
          ) : null}
        </div>
      ),
      sortValue: (r) => r.label || "",
    },
    {
      key: "kind",
      header: "Type",
      width: "80px",
      render: (r) => (
        <span className="inline-flex rounded bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-600">
          {kindOf(r)}
        </span>
      ),
      sortValue: (r) => kindOf(r),
    },
    {
      key: "section",
      header: "Section",
      width: "110px",
      render: (r) => (
        <span className="block truncate text-gray-500" title={r.section || "—"}>
          {r.section || "—"}
        </span>
      ),
      sortValue: (r) => r.section || "",
    },
    {
      key: "path",
      header: "Page & Category",
      width: "28%",
      render: (r) => {
        const cat = categorizePath(r.path);
        return (
          <div className="min-w-0 flex items-center gap-1.5">
            <Chip
              className="text-[10px] h-5 shrink-0"
              color={cat.color}
              size="sm"
              variant="flat"
            >
              {cat.label}
            </Chip>
            <span
              className="block truncate font-mono text-xs text-gray-700"
              title={r.path}
            >
              {r.path}
            </span>
          </div>
        );
      },
      sortValue: (r) => r.path,
    },
    {
      key: "clicks",
      header: "Clicks",
      align: "right",
      width: "75px",
      render: (r) => (
        <span className="font-semibold text-gray-900">{fmtInt(r.clicks)}</span>
      ),
      sortValue: (r) => r.clicks,
    },
    {
      key: "uniqueVisitors",
      header: "Unique",
      align: "right",
      width: "75px",
      render: (r) => fmtInt(r.uniqueVisitors),
      sortValue: (r) => r.uniqueVisitors,
    },
    {
      key: "ctr",
      header: "CTR",
      align: "right",
      width: "75px",
      render: (r) => (r.pageViews ? fmtPct(r.ctr, 1) : "—"),
      sortValue: (r) => r.ctr,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={viewMode === "flat" ? "solid" : "bordered"}
              onClick={() => setViewMode("flat")}
            >
              <Icon.grid className="h-3.5 w-3.5" /> All Clicks
            </Button>
            <Button
              size="sm"
              variant={viewMode === "grouped" ? "solid" : "bordered"}
              onClick={() => setViewMode("grouped")}
            >
              <Icon.folder className="h-3.5 w-3.5" /> Group by Page
            </Button>
          </div>
        }
        description="Every tracked click — buttons, links, tools, and component lab sub-components. Filter by category or inspect page-wise groupings."
        title="Clicks &amp; Element Analytics"
      />

      {/* KPI Metric Strip */}
      <KpiRow items={kpis} />

      {/* Category Tabs Strip */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200/80 pb-3">
        {/* Main Website tab (Far left default) */}
        <button
          className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
            selectedCategory === "main"
              ? "bg-gray-900 text-white shadow-sm"
              : "bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200/80"
          }`}
          onClick={() => {
            setSelectedCategory("main");
            setPathFilter("");
          }}
        >
          <span>Main Website</span>
          <span
            className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
              selectedCategory === "main"
                ? "bg-white/20 text-white"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {categoryCounts.main}
          </span>
        </button>

        {/* Divider */}
        <div className="hidden h-5 w-px bg-gray-200 sm:block mx-1" />

        {/* All and other category tabs */}
        {(
          [
            { key: "all", label: "All Pages", count: categoryCounts.all },
            {
              key: "componentlab",
              label: "Component Lab",
              count: categoryCounts.componentlab,
            },
            { key: "tools", label: "Tools & Apps", count: categoryCounts.tools },
            {
              key: "case-studies",
              label: "Case Studies",
              count: categoryCounts["case-studies"],
            },
            {
              key: "blogs",
              label: "Blogs & Content",
              count: categoryCounts.blogs,
            },
          ] as const
        ).map((tab) => {
          const active = selectedCategory === tab.key;
          return (
            <button
              key={tab.key}
              className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                active
                  ? "bg-gray-900 text-white shadow-sm"
                  : "bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200/80"
              }`}
              onClick={() => {
                setSelectedCategory(tab.key);
                setPathFilter("");
              }}
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

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Icon.search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full rounded-xl border border-gray-200/80 bg-white py-2 pl-10 pr-3.5 text-xs text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/5 transition-all"
            placeholder="Search element name, section, link URL or path…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Grouped Page Filter Dropdown */}
        <select
          className="rounded-xl border border-gray-200/80 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm transition-all focus:border-gray-400 focus:outline-none max-w-[280px]"
          value={pathFilter}
          onChange={(e) => setPathFilter(e.target.value)}
        >
          <option value="">
            All {selectedCategory !== "all" ? selectedCategory : ""} Pages
          </option>

          {groupedPaths.componentlab.size > 0 &&
          (selectedCategory === "all" || selectedCategory === "componentlab") ? (
            <optgroup label="Component Lab & Sub-components">
              {Array.from(groupedPaths.componentlab)
                .sort()
                .map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
            </optgroup>
          ) : null}

          {groupedPaths.tools.size > 0 &&
          (selectedCategory === "all" || selectedCategory === "tools") ? (
            <optgroup label="Tools & Generators">
              {Array.from(groupedPaths.tools)
                .sort()
                .map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
            </optgroup>
          ) : null}

          {groupedPaths["case-studies"].size > 0 &&
          (selectedCategory === "all" || selectedCategory === "case-studies") ? (
            <optgroup label="Case Studies">
              {Array.from(groupedPaths["case-studies"])
                .sort()
                .map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
            </optgroup>
          ) : null}

          {groupedPaths.blogs.size > 0 &&
          (selectedCategory === "all" || selectedCategory === "blogs") ? (
            <optgroup label="Blogs & Articles">
              {Array.from(groupedPaths.blogs)
                .sort()
                .map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
            </optgroup>
          ) : null}

          {groupedPaths.main.size > 0 &&
          (selectedCategory === "all" || selectedCategory === "main") ? (
            <optgroup label="Main Website">
              {Array.from(groupedPaths.main)
                .sort()
                .map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
            </optgroup>
          ) : null}
        </select>

        {pathFilter || searchTerm || selectedCategory !== "main" ? (
          <button
            className="text-xs font-semibold text-gray-500 hover:text-gray-900"
            onClick={() => {
              setPathFilter("");
              setSearchTerm("");
              setSelectedCategory("main");
            }}
          >
            Reset Filters
          </button>
        ) : null}
      </div>

      <StatePanel error={error} loading={loading && !data} onRetry={refetch}>
        {viewMode === "flat" ? (
          <Card
            bodyClassName="p-0"
            subtitle="Sorted by total click volume"
            title={`${fmtInt(filteredRows.length)} click elements`}
          >
            <DataTable
              columns={columns}
              initialSort={{ key: "clicks", dir: "desc" }}
              rowKey={(r, i) => `${r.path}|${r.label}|${i}`}
              rows={filteredRows}
            />
          </Card>
        ) : (
          /* Grouped by Page View */
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-gray-500 px-1">
              <span>
                Showing {pageGroups.length} distinct pages with active click events
              </span>
              <div className="flex items-center gap-2">
                <button
                  className="font-semibold text-gray-700 hover:text-black"
                  onClick={expandAll}
                >
                  Expand All
                </button>
                <span>·</span>
                <button
                  className="font-semibold text-gray-700 hover:text-black"
                  onClick={collapseAll}
                >
                  Collapse All
                </button>
              </div>
            </div>

            {pageGroups.length === 0 ? (
              <Card>
                <div className="py-12 text-center text-sm text-gray-400">
                  No pages found matching the selected filters.
                </div>
              </Card>
            ) : (
              pageGroups.map((group) => {
                const isExpanded = expandedPages.has(group.path);
                return (
                  <div
                    key={group.path}
                    className="overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-sm transition-all"
                  >
                    {/* Header */}
                    <div
                      className="flex flex-wrap items-center justify-between gap-3 bg-gray-50/70 px-5 py-3.5 cursor-pointer hover:bg-gray-100/70 transition-colors"
                      onClick={() => toggleExpand(group.path)}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon.chevron
                          className={`h-4 w-4 text-gray-400 transition-transform ${
                            isExpanded ? "rotate-90" : ""
                          }`}
                        />
                        <Chip
                          color={group.categoryMeta.color}
                          size="sm"
                          variant="flat"
                        >
                          {group.categoryMeta.label}
                        </Chip>
                        <span className="font-mono text-xs font-semibold text-gray-900 truncate">
                          {group.path}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs">
                        <div className="text-right">
                          <span className="font-semibold text-gray-900">
                            {fmtInt(group.totalClicks)}
                          </span>
                          <span className="ml-1 text-gray-400">clicks</span>
                        </div>
                        <div className="text-right text-gray-500">
                          <span className="font-semibold text-gray-800">
                            {fmtInt(group.elements.length)}
                          </span>
                          <span className="ml-1 text-gray-400">elements</span>
                        </div>
                        <span className="rounded bg-white px-2 py-0.5 font-mono text-[11px] font-semibold text-gray-600 border border-gray-200">
                          {isExpanded ? "Hide" : "Show Sub-components"}
                        </span>
                      </div>
                    </div>

                    {/* Sub-components / Interactive Elements on this page */}
                    {isExpanded ? (
                      <div className="border-t border-gray-200/80 p-0">
                        <table className="w-full table-fixed border-collapse text-sm">
                          <thead className="bg-gray-50/50 text-xs uppercase tracking-wider text-gray-400">
                            <tr className="border-b border-gray-100">
                              <th className="truncate px-5 py-2.5 text-left font-semibold">
                                Sub-component / Element
                              </th>
                              <th className="w-24 truncate px-4 py-2.5 text-left font-semibold">
                                Type
                              </th>
                              <th className="w-32 truncate px-4 py-2.5 text-left font-semibold">
                                Section
                              </th>
                              <th className="w-24 truncate px-4 py-2.5 text-right font-semibold">
                                Clicks
                              </th>
                              <th className="w-24 truncate px-4 py-2.5 text-right font-semibold">
                                Unique
                              </th>
                              <th className="w-24 truncate px-5 py-2.5 text-right font-semibold">
                                CTR
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {group.elements
                              .sort((a, b) => b.clicks - a.clicks)
                              .map((elem, idx) => (
                                <tr
                                  key={idx}
                                  className="hover:bg-slate-50/50 transition-colors"
                                >
                                  <td className="truncate px-5 py-2.5">
                                    <span
                                      className="font-medium text-xs text-gray-900 block truncate"
                                      title={elem.label}
                                    >
                                      {elem.label || "(unlabeled)"}
                                    </span>
                                    {elem.href ? (
                                      <span
                                        className="font-mono text-[11px] text-gray-400 block truncate"
                                        title={elem.href}
                                      >
                                        → {elem.href}
                                      </span>
                                    ) : null}
                                  </td>
                                  <td className="truncate px-4 py-2.5">
                                    <span className="inline-flex rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-600">
                                      {kindOf(elem)}
                                    </span>
                                  </td>
                                  <td className="truncate px-4 py-2.5 text-xs text-gray-500">
                                    {elem.section || "—"}
                                  </td>
                                  <td className="truncate px-4 py-2.5 text-right font-mono text-xs font-semibold text-gray-900">
                                    {fmtInt(elem.clicks)}
                                  </td>
                                  <td className="truncate px-4 py-2.5 text-right font-mono text-xs text-gray-600">
                                    {fmtInt(elem.uniqueVisitors)}
                                  </td>
                                  <td className="truncate px-5 py-2.5 text-right font-mono text-xs text-gray-600">
                                    {elem.pageViews ? fmtPct(elem.ctr, 1) : "—"}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    ) : null}
                  </div>
                );
              })
            )}
          </div>
        )}
      </StatePanel>
    </div>
  );
}

