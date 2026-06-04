"use client";

import { useEffect, useState } from "react";
import SummaryStats from "./SummaryStats";
import ProviderComparison from "./ProviderComparison";
import InsightsPanel from "./InsightsPanel";
import TrendsChart from "./TrendsChart";

export default function AIAnalyticsDashboard() {
  const [period, setPeriod] = useState(30);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);
  const [insights, setInsights] = useState<any>(null);
  const [providerStats, setProviderStats] = useState<any>(null);
  const [trends, setTrends] = useState<any>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Fetch all analytics data in parallel
      const [summaryRes, insightsRes, providerRes, trendsRes] = await Promise.all([
        fetch(`/api/pirateCOS/analytics/summary?days=${period}`),
        fetch(`/api/pirateCOS/analytics/insights?days=${period}`),
        fetch(`/api/pirateCOS/analytics/ai-performance?groupBy=provider&days=${period}`),
        fetch(`/api/pirateCOS/analytics/ai-performance?groupBy=day&days=${period}`),
      ]);

      const [summaryData, insightsData, providerData, trendsData] = await Promise.all([
        summaryRes.json(),
        insightsRes.json(),
        providerRes.json(),
        trendsRes.json(),
      ]);

      setSummary(summaryData.data);
      setInsights(insightsData.data);
      setProviderStats(providerData.data);
      setTrends(trendsData.data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {[7, 14, 30, 60, 90].map((days) => (
            <button
              key={days}
              onClick={() => setPeriod(days)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium font-geist transition-all ${
                period === days
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {days} days
            </button>
          ))}
        </div>
        <button
          onClick={fetchAnalytics}
          disabled={loading}
          className="px-3 py-1.5 rounded-lg text-xs font-medium font-geist bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {loading && !summary ? (
        <div className="bg-white rounded-2xl p-12 shadow-card border border-black/5 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          <p className="text-sm text-gray-500 mt-4 font-geist">Loading analytics...</p>
        </div>
      ) : summary?.totalGenerations === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-card border border-black/5 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-semibold text-gray-900 font-geist">
            No Data Yet
          </h3>
          <p className="mt-2 text-sm text-gray-500 font-geist">
            Start using AI features to see analytics here.
          </p>
        </div>
      ) : (
        <>
          {/* Summary Statistics */}
          <SummaryStats data={summary} />

          {/* Auto-Learning Insights */}
          {insights && insights.insights && insights.insights.length > 0 && (
            <InsightsPanel data={insights} />
          )}

          {/* Provider Comparison */}
          {providerStats && providerStats.stats && providerStats.stats.length > 0 && (
            <ProviderComparison data={providerStats} />
          )}

          {/* Trends Chart */}
          {trends && trends.stats && trends.stats.length > 0 && (
            <TrendsChart data={trends} />
          )}
        </>
      )}
    </div>
  );
}
