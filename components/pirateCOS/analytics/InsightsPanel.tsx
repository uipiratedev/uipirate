"use client";

interface Insight {
  type: string;
  priority: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  action: any;
  impact: string;
}

interface InsightsPanelProps {
  data: {
    insights: Insight[];
    totalInsights: number;
    dataQuality: "high" | "medium" | "low";
  };
}

export default function InsightsPanel({ data }: InsightsPanelProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return { bg: "#FEE2E2", color: "#DC2626", label: "Critical" };
      case "high":
        return { bg: "#FFF0E8", color: "#FF5B04", label: "High" };
      case "medium":
        return { bg: "#FEF3C7", color: "#D97706", label: "Medium" };
      case "low":
        return { bg: "#EDE9FE", color: "#7C3AED", label: "Low" };
      default:
        return { bg: "#F3F4F6", color: "#6B7280", label: "Info" };
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "provider-recommendation":
        return (
          <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" width="20">
            <path d="M3 3v18h18" />
            <path d="m19 9-5 5-4-4-3 3" />
          </svg>
        );
      case "cost-optimization":
        return (
          <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" width="20">
            <line x1="12" x2="12" y1="2" y2="22" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        );
      case "brand-voice-refinement":
        return (
          <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" width="20">
            <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1 0-3.12 3 3 0 0 1 0-3.88 2.5 2.5 0 0 1 0-3.12A2.5 2.5 0 0 1 9.5 2z" />
            <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 0-3.12 3 3 0 0 0 0-3.88 2.5 2.5 0 0 0 0-3.12A2.5 2.5 0 0 0 14.5 2z" />
          </svg>
        );
      case "low-acceptance-alert":
        return (
          <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" width="20">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
          </svg>
        );
      default:
        return (
          <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" width="20">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-card border border-black/5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs font-semibold font-jetbrains-mono text-gray-400 uppercase tracking-widest mb-1">
            Auto-Learning Insights
          </p>
          <p className="text-sm text-gray-600 font-geist">
            {data.totalInsights} {data.totalInsights === 1 ? "recommendation" : "recommendations"} • Data quality: {data.dataQuality}
          </p>
        </div>
        <div className="px-2 py-1 rounded-lg bg-purple-50">
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
            <path d="M12 8V4H8" />
            <rect width="16" height="12" x="4" y="8" rx="2" />
            <path d="M2 14h2" />
            <path d="M20 14h2" />
            <path d="M15 13v2" />
            <path d="M9 13v2" />
          </svg>
        </div>
      </div>

      <div className="space-y-3">
        {data.insights.map((insight, index) => {
          const priorityStyle = getPriorityColor(insight.priority);
          return (
            <div
              key={index}
              className="p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-all"
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: priorityStyle.bg, color: priorityStyle.color }}
                >
                  {getIcon(insight.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-gray-900 font-geist">
                      {insight.title}
                    </h4>
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-medium font-jetbrains-mono uppercase tracking-wider"
                      style={{ background: priorityStyle.bg, color: priorityStyle.color }}
                    >
                      {priorityStyle.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 font-geist mb-2">
                    {insight.description}
                  </p>
                  <p className="text-xs text-gray-500 font-geist italic">
                    Impact: {insight.impact}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
