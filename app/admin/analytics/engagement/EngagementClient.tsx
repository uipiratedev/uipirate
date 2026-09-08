"use client";

import { useApi } from "@/lib/admin/useApi";
import { PageHeader, Card, StatePanel } from "@/components/admin/ui";
import { KpiRow } from "@/components/admin/KpiRow";
import {
  MiniHistogram,
  ActivityHeatmap,
  BreakdownBars,
} from "@/components/admin/charts";
import { fmtDuration, fmtInt, fmtPct } from "@/components/admin/format";

interface EngagementData {
  summary: {
    avgSessionDurationMs: number;
    bounceRate: number;
    pagesPerSession: number;
    sessions: number;
  };
  durationHist: Array<{ label: string; count: number }>;
  scrollHist: Array<{ label: string; count: number }>;
  pagesPerSession: Array<{ pages: number; sessions: number }>;
  heatmap: Array<{ hour: number; weekday: number; count: number }>;
  dwellByPage: Array<{ path: string; avgDwellMs: number; samples: number }>;
}

export default function EngagementClient() {
  const { data, loading, error, refetch } = useApi<EngagementData>(
    "/api/admin/analytics/engagement",
  );

  return (
    <div className="space-y-5">
      <PageHeader
        description="How long people stay, how far they scroll, and when they show up."
        title="Engagement"
      />

      <StatePanel error={error} loading={loading && !data} onRetry={refetch}>
        {data ? (
          <KpiRow
            items={[
              {
                label: "Avg. visit",
                value: fmtDuration(data.summary.avgSessionDurationMs),
              },
              {
                label: "Pages / visit",
                value: data.summary.pagesPerSession.toFixed(1),
              },
              {
                label: "Bounce rate",
                value: fmtPct(data.summary.bounceRate, 0),
              },
              { label: "Sessions", value: fmtInt(data.summary.sessions) },
            ]}
          />
        ) : null}

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <Card
            subtitle="Sessions grouped by engaged time"
            title="Visit duration"
          >
            <MiniHistogram rows={data?.durationHist || []} />
          </Card>
          <Card
            subtitle="Max scroll reached per page view"
            title="Scroll depth"
          >
            <MiniHistogram rows={data?.scrollHist || []} />
          </Card>
          <Card
            subtitle="Pageviews UTC · darker = busier"
            title="Activity by hour & weekday"
          >
            <ActivityHeatmap cells={data?.heatmap || []} />
          </Card>
          <Card subtitle="Longest average time on page" title="Stickiest pages">
            <BreakdownBars
              formatValue={fmtDuration}
              labelKey="path"
              rows={data?.dwellByPage || []}
              valueKey="avgDwellMs"
            />
          </Card>
        </div>
      </StatePanel>
    </div>
  );
}
