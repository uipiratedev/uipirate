"use client";

interface ProviderStat {
  provider: string;
  total: number;
  accepted: number;
  rejected: number;
  acceptanceRate: number;
  avgLatencyMs: number;
  avgCostUSD: number;
}

interface ProviderComparisonProps {
  data: {
    stats: ProviderStat[];
  };
}

export default function ProviderComparison({ data }: ProviderComparisonProps) {
  const getProviderColor = (provider: string) => {
    switch (provider) {
      case "openai":
        return "#10A37F";
      case "anthropic":
        return "#D4964A";
      case "gemini":
        return "#4285F4";
      case "mistral":
        return "#FF5B04";
      case "puter":
        return "#7C3AED";
      default:
        return "#6B7280";
    }
  };

  const getProviderLabel = (provider: string) => {
    switch (provider) {
      case "openai":
        return "OpenAI";
      case "anthropic":
        return "Anthropic";
      case "gemini":
        return "Google Gemini";
      case "mistral":
        return "Mistral AI";
      case "puter":
        return "Puter";
      default:
        return provider.charAt(0).toUpperCase() + provider.slice(1);
    }
  };

  const maxAcceptanceRate = Math.max(...data.stats.map((s) => s.acceptanceRate));
  const bestProvider = data.stats.find((s) => s.acceptanceRate === maxAcceptanceRate);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-card border border-black/5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs font-semibold font-jetbrains-mono text-gray-400 uppercase tracking-widest mb-1">
            Provider Performance
          </p>
          <p className="text-sm text-gray-600 font-geist">
            Best: {getProviderLabel(bestProvider?.provider || "")} ({bestProvider?.acceptanceRate}%)
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {data.stats.map((stat) => {
          const color = getProviderColor(stat.provider);
          const barWidth = (stat.acceptanceRate / 100) * 100;
          const isBest = stat.provider === bestProvider?.provider;

          return (
            <div key={stat.provider} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: color }}
                  />
                  <span className="text-sm font-medium text-gray-900 font-geist">
                    {getProviderLabel(stat.provider)}
                  </span>
                  {isBest && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-medium font-jetbrains-mono uppercase tracking-wider bg-green-100 text-green-700">
                      Best
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-6 text-xs text-gray-600 font-geist">
                  <span>{stat.total} uses</span>
                  <span className="font-semibold text-gray-900">
                    {stat.acceptanceRate}%
                  </span>
                </div>
              </div>

              <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${barWidth}%`,
                    background: color,
                  }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-gray-500 font-geist">
                <span>Latency: {(stat.avgLatencyMs / 1000).toFixed(2)}s</span>
                <span>Avg cost: ${stat.avgCostUSD.toFixed(4)}</span>
                <span>
                  {stat.accepted} ✓ / {stat.rejected} ✗
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
