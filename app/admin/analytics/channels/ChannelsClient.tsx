"use client";

import { useApi } from "@/lib/admin/useApi";
import { PageHeader, Card, StatePanel } from "@/components/admin/ui";
import { KpiRow } from "@/components/admin/KpiRow";
import { TrendChart, BreakdownBars } from "@/components/admin/charts";
import { DataTable, type Column } from "@/components/admin/DataTable";
import BrandLogo from "@/components/admin/BrandLogo";
import { fmtInt, fmtPct } from "@/components/admin/format";
import { channelLabel, countryName } from "@/lib/analytics/brands";

interface SourceRow {
  referrer: string;
  channel: string;
  hits: number;
}

interface BotRow {
  botName: string;
  botKind: string;
  hits: number;
}

interface ChannelsData {
  total: number;
  consentedViews: number;
  consentRate: number | null;
  channels: Array<{ key: string; hits: number }>;
  sources: SourceRow[];
  series: Array<{ date: string; hits: number }>;
  countries: Array<{ key: string; hits: number }>;
  bots: BotRow[];
  botTotal: number;
}

const BOT_KIND_LABEL: Record<string, string> = {
  ai: "AI",
  search: "Search",
  seo: "SEO tool",
  social: "Social",
  tool: "Monitoring",
  other: "Other",
};

export default function ChannelsClient() {
  const { data, loading, error, refetch } =
    useApi<ChannelsData>("/api/admin/analytics/channels");

  const sourceCols: Column<SourceRow>[] = [
    {
      key: "referrer",
      header: "Source",
      render: (r) => (
        <span className="flex items-center gap-2">
          <BrandLogo host={r.referrer} />
          <span className="truncate">{r.referrer}</span>
        </span>
      ),
      sortValue: (r) => r.referrer,
    },
    {
      key: "channel",
      header: "Channel",
      render: (r) => channelLabel(r.channel),
      sortValue: (r) => r.channel,
    },
    {
      key: "hits",
      header: "Visits",
      align: "right",
      render: (r) => fmtInt(r.hits),
      sortValue: (r) => r.hits,
    },
  ];

  const botCols: Column<BotRow>[] = [
    {
      key: "botName",
      header: "Crawler",
      render: (r) => r.botName,
      sortValue: (r) => r.botName,
    },
    {
      key: "botKind",
      header: "Type",
      render: (r) => BOT_KIND_LABEL[r.botKind] ?? r.botKind,
      sortValue: (r) => r.botKind,
    },
    {
      key: "hits",
      header: "Crawls",
      align: "right",
      render: (r) => fmtInt(r.hits),
      sortValue: (r) => r.hits,
    },
  ];

  const aiCrawls = (data?.bots || [])
    .filter((b) => b.botKind === "ai")
    .reduce((n, b) => n + b.hits, 0);

  return (
    <>
      <PageHeader
        description="Every visit, counted server-side — including visitors who block scripts or decline cookies."
        title="Channels — where traffic comes from"
      />

      <StatePanel
        empty={!loading && !error && (data?.total ?? 0) === 0}
        emptyText="No hits recorded yet. Server-side counting starts once CRON_SECRET (or INTERNAL_ANALYTICS_SECRET) is set in the environment."
        error={error}
        loading={loading}
        onRetry={refetch}
      >
        <KpiRow
          items={[
            {
              label: "All visits",
              value: fmtInt(data?.total ?? 0),
              hint: "Every human pageview — no consent needed",
            },
            {
              label: "Tracked",
              value: fmtInt(data?.consentedViews ?? 0),
              hint: "Consented only — powers journeys & clicks",
            },
            {
              label: "Consent rate",
              value:
                data?.consentRate == null ? "—" : fmtPct(data.consentRate),
              hint: "Share of visitors the cookie tracker sees",
            },
            {
              label: "Crawler hits",
              value: fmtInt(data?.botTotal ?? 0),
              hint: "Bots & crawlers — excluded from visits",
            },
            {
              label: "AI crawls",
              value: fmtInt(aiCrawls),
              hint: "GPTBot, ClaudeBot, PerplexityBot…",
            },
            {
              label: "Sources",
              value: fmtInt(data?.sources?.length ?? 0),
              hint: "Distinct referring hosts",
            },
          ]}
        />

        <div className="mt-5">
          <Card subtitle="Server-side, all visitors" title="Visits over time">
            <TrendChart
              data={data?.series || []}
              series={[{ key: "hits", label: "Visits" }]}
              xKey="date"
            />
          </Card>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <Card subtitle="How visitors arrived" title="Channels">
            <BreakdownBars
              formatValue={fmtInt}
              rows={(data?.channels || []).map((c) => ({
                key: channelLabel(c.key),
                hits: c.hits,
              }))}
              valueKey="hits"
            />
          </Card>

          <Card subtitle="Referring hosts" title="Top sources">
            <DataTable
              columns={sourceCols}
              initialSort={{ key: "hits", dir: "desc" }}
              rowKey={(r) => r.referrer}
              rows={data?.sources || []}
            />
          </Card>

          <Card title="Countries">
            <BreakdownBars
              formatValue={fmtInt}
              max={10}
              rows={(data?.countries || []).map((c) => ({
                key: countryName(c.key),
                hits: c.hits,
              }))}
              valueKey="hits"
            />
          </Card>

          <Card
            subtitle="robots.txt allows the AI crawlers — this is whether they actually come"
            title="Crawlers"
          >
            <DataTable
              columns={botCols}
              initialSort={{ key: "hits", dir: "desc" }}
              rowKey={(r) => r.botName}
              rows={data?.bots || []}
            />
          </Card>
        </div>
      </StatePanel>
    </>
  );
}
