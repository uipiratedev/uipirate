"use client";

interface SummaryStatsProps {
  data: {
    summary: {
      totalGenerations: number;
      acceptanceRate: number;
      rejectionRate: number;
      editRate: number;
    };
    performance: {
      avgLatencyMs: number;
      totalCostUSD: number;
      avgCostUSD: number;
    };
    trend: {
      acceptanceRateChange: number;
      direction: "up" | "down" | "stable";
    };
  };
}

export default function SummaryStats({ data }: SummaryStatsProps) {
  const stats = [
    {
      label: "Total Generations",
      value: data.summary.totalGenerations.toLocaleString(),
      color: "#151514",
      bg: "#F0EDE8",
      icon: (
        <svg fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" width="18">
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        </svg>
      ),
    },
    {
      label: "Acceptance Rate",
      value: `${data.summary.acceptanceRate}%`,
      color: data.summary.acceptanceRate >= 70 ? "#16A34A" : data.summary.acceptanceRate >= 50 ? "#FF5B04" : "#DC2626",
      bg: data.summary.acceptanceRate >= 70 ? "#DCFCE7" : data.summary.acceptanceRate >= 50 ? "#FFF0E8" : "#FEE2E2",
      icon: (
        <svg fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" width="18">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <path d="m9 11 3 3L22 4" />
        </svg>
      ),
      trend: data.trend.acceptanceRateChange,
      trendDirection: data.trend.direction,
    },
    {
      label: "Avg Latency",
      value: `${(data.performance.avgLatencyMs / 1000).toFixed(1)}s`,
      color: "#7C3AED",
      bg: "#EDE9FE",
      icon: (
        <svg fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" width="18">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      ),
    },
    {
      label: "Total Cost",
      value: `$${data.performance.totalCostUSD.toFixed(2)}`,
      color: "#FF5B04",
      bg: "#FFF0E8",
      icon: (
        <svg fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" width="18">
          <line x1="12" x2="12" y1="2" y2="22" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(({ label, value, color, bg, icon, trend, trendDirection }) => (
        <div
          key={label}
          className="bg-white rounded-2xl p-5 shadow-card border border-black/5"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-medium text-gray-500 font-geist">
              {label}
            </p>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: bg, color }}
            >
              {icon}
            </div>
          </div>
          <div className="flex items-end justify-between">
            <p
              className="text-3xl font-bold font-geist tracking-tight"
              style={{ color }}
            >
              {value}
            </p>
            {trend !== undefined && (
              <div className="flex items-center gap-1 mb-1">
                {trendDirection === "up" && (
                  <svg
                    className="w-3 h-3 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                )}
                {trendDirection === "down" && (
                  <svg
                    className="w-3 h-3 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
                <span
                  className={`text-xs font-medium ${
                    trendDirection === "up"
                      ? "text-green-600"
                      : trendDirection === "down"
                      ? "text-red-600"
                      : "text-gray-500"
                  }`}
                >
                  {trend > 0 ? "+" : ""}
                  {trend}%
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
