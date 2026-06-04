import { headers } from "next/headers";
import { getCurrentUser } from "@/lib/pirateCOS/auth";
import AIAnalyticsDashboard from "@/components/pirateCOS/analytics/AIAnalyticsDashboard";

export default async function AIAnalyticsPage() {
  const user = await getCurrentUser();
  const host = (await headers()).get("host") || "";
  const isSubdomain =
    host.startsWith("cos.") || host.split(":")[0] === "cos.uipirate.com";
  const getHref = (path: string) => (isSubdomain ? path : `/pirateCOS${path}`);

  return (
    <div className="space-y-6 lg:space-y-8 px-4 lg:px-8 py-4">
      {/* Header */}
      <div className="pt-2">
        <p
          className="text-xs font-jetbrains-mono uppercase tracking-widest mb-1"
          style={{ color: "#7C3AED" }}
        >
          AI Intelligence
        </p>
        <h1 className="text-2xl font-bold font-geist text-gray-900 tracking-tight">
          AI Analytics
        </h1>
        <p className="text-sm text-gray-500 mt-1 font-geist">
          Performance insights and auto-learning recommendations
        </p>
      </div>

      {/* Dashboard Component */}
      <AIAnalyticsDashboard />
    </div>
  );
}
