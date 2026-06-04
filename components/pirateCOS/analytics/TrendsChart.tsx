"use client";

interface TrendData {
  date: string;
  total: number;
  accepted: number;
  acceptanceRate: number;
}

interface TrendsChartProps {
  data: {
    stats: TrendData[];
  };
}

export default function TrendsChart({ data }: TrendsChartProps) {
  const maxRate = Math.max(...data.stats.map((s) => s.acceptanceRate));
  const minRate = Math.min(...data.stats.map((s) => s.acceptanceRate));
  const avgRate =
    data.stats.reduce((sum, s) => sum + s.acceptanceRate, 0) / data.stats.length;

  const normalizeY = (value: number) => {
    const range = maxRate - minRate || 1;
    return ((value - minRate) / range) * 100;
  };

  // Create SVG path for the line chart
  const linePoints = data.stats
    .map((stat, index) => {
      const x = (index / (data.stats.length - 1)) * 100;
      const y = 100 - normalizeY(stat.acceptanceRate);
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  // Create area path (same as line but closed to bottom)
  const areaPoints =
    linePoints +
    ` L 100 100 L 0 100 Z`;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-card border border-black/5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs font-semibold font-jetbrains-mono text-gray-400 uppercase tracking-widest mb-1">
            Acceptance Rate Trend
          </p>
          <p className="text-sm text-gray-600 font-geist">
            Average: {avgRate.toFixed(1)}% • Range: {minRate.toFixed(1)}% - {maxRate.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Chart */}
        <div className="relative w-full h-48">
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            {/* Area gradient */}
            <defs>
              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            {/* Area fill */}
            <path
              d={areaPoints}
              fill="url(#areaGradient)"
            />

            {/* Line */}
            <path
              d={linePoints}
              fill="none"
              stroke="#7C3AED"
              strokeWidth="0.5"
              vectorEffect="non-scaling-stroke"
            />

            {/* Data points */}
            {data.stats.map((stat, index) => {
              const x = (index / (data.stats.length - 1)) * 100;
              const y = 100 - normalizeY(stat.acceptanceRate);
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="0.8"
                  fill="#7C3AED"
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          </svg>

          {/* Y-axis labels */}
          <div className="absolute top-0 left-0 h-full flex flex-col justify-between text-[10px] text-gray-400 font-geist -ml-10">
            <span>{maxRate.toFixed(0)}%</span>
            <span>{avgRate.toFixed(0)}%</span>
            <span>{minRate.toFixed(0)}%</span>
          </div>
        </div>

        {/* X-axis labels (dates) */}
        <div className="flex items-center justify-between text-[10px] text-gray-400 font-geist px-2">
          {data.stats.length > 7 ? (
            <>
              <span>{new Date(data.stats[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              <span>{new Date(data.stats[Math.floor(data.stats.length / 2)].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              <span>{new Date(data.stats[data.stats.length - 1].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </>
          ) : (
            data.stats.map((stat, index) => (
              <span key={index}>
                {new Date(stat.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            ))
          )}
        </div>

        {/* Stats summary */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500 font-geist mb-1">Total Uses</p>
            <p className="text-lg font-bold text-gray-900 font-geist">
              {data.stats.reduce((sum, s) => sum + s.total, 0).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-geist mb-1">Accepted</p>
            <p className="text-lg font-bold text-green-600 font-geist">
              {data.stats.reduce((sum, s) => sum + s.accepted, 0).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-geist mb-1">Avg Rate</p>
            <p className="text-lg font-bold text-purple-600 font-geist">
              {avgRate.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
