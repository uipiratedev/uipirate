import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/pirateCOS/auth";
import AIGenerationLog from "@/models/pirateCOS/AIGenerationLog";
import dbConnect from "@/lib/mongodb";

/**
 * Phase 4G-4: AI Performance Analytics API
 * 
 * GET /api/pirateCOS/analytics/ai-performance
 * 
 * Returns comprehensive analytics on AI generation performance:
 * - Provider comparison (OpenAI vs Anthropic vs Gemini vs Mistral)
 * - Action effectiveness (which actions get highest acceptance?)
 * - Temporal trends (performance over time)
 * - Cost analysis
 * 
 * Query params:
 * - days: number (default: 30, lookback period)
 * - groupBy: "provider" | "action" | "day" (default: "provider")
 */

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "30");
    const groupBy = searchParams.get("groupBy") || "provider";

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Base query
    const query: any = {
      tenantId: user.tenantId,
      createdAt: { $gte: startDate },
    };

    const logs = await AIGenerationLog.find(query).select(
      "modelConfig generation feedback createdAt"
    );

    // === Provider Comparison ===
    if (groupBy === "provider") {
      const providers = ["openai", "anthropic", "gemini", "mistral", "puter"];
      const providerStats = providers.map((provider) => {
        const providerLogs = logs.filter(
          (l) => l.modelConfig.engine === provider
        );
        const total = providerLogs.length;
        const accepted = providerLogs.filter(
          (l) => l.feedback.action === "accepted"
        ).length;
        const rejected = providerLogs.filter(
          (l) => l.feedback.action === "rejected"
        ).length;
        const edited = providerLogs.filter(
          (l) => l.feedback.action === "edited"
        ).length;
        const avgLatency =
          providerLogs.reduce(
            (sum, l) => sum + (l.generation.latencyMs || 0),
            0
          ) / (total || 1);
        const avgCost =
          providerLogs.reduce((sum, l) => sum + (l.generation.costUSD || 0), 0) /
          (total || 1);

        return {
          provider,
          total,
          accepted,
          rejected,
          edited,
          acceptanceRate: total > 0 ? Math.round((accepted / total) * 1000) / 10 : 0,
          rejectionRate: total > 0 ? Math.round((rejected / total) * 1000) / 10 : 0,
          editRate: total > 0 ? Math.round((edited / total) * 1000) / 10 : 0,
          avgLatencyMs: Math.round(avgLatency),
          avgCostUSD: Math.round(avgCost * 10000) / 10000,
        };
      });

      return NextResponse.json({
        success: true,
        data: {
          groupBy: "provider",
          period: `${days} days`,
          stats: providerStats.filter((s) => s.total > 0),
        },
      });
    }

    // === Action Effectiveness ===
    if (groupBy === "action") {
      const actions = Array.from(new Set(logs.map((l) => l.generation.action)));
      const actionStats = actions.map((action) => {
        const actionLogs = logs.filter((l) => l.generation.action === action);
        const total = actionLogs.length;
        const accepted = actionLogs.filter(
          (l) => l.feedback.action === "accepted"
        ).length;
        const avgRating =
          actionLogs
            .filter((l) => l.feedback.rating)
            .reduce((sum, l) => sum + (l.feedback.rating || 0), 0) /
            (actionLogs.filter((l) => l.feedback.rating).length || 1);

        return {
          action,
          total,
          accepted,
          acceptanceRate: total > 0 ? Math.round((accepted / total) * 1000) / 10 : 0,
          avgRating: Math.round(avgRating * 10) / 10,
        };
      });

      return NextResponse.json({
        success: true,
        data: {
          groupBy: "action",
          period: `${days} days`,
          stats: actionStats.sort((a, b) => b.acceptanceRate - a.acceptanceRate),
        },
      });
    }

    // === Temporal Trends (Day by Day) ===
    if (groupBy === "day") {
      const dailyStats: any[] = [];
      const daysArray = Array.from({ length: days }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (days - i - 1));
        date.setHours(0, 0, 0, 0);
        return date;
      });

      daysArray.forEach((date) => {
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);

        const dayLogs = logs.filter(
          (l) =>
            new Date(l.createdAt) >= date && new Date(l.createdAt) < nextDate
        );

        const total = dayLogs.length;
        const accepted = dayLogs.filter(
          (l) => l.feedback.action === "accepted"
        ).length;

        dailyStats.push({
          date: date.toISOString().split("T")[0],
          total,
          accepted,
          acceptanceRate: total > 0 ? Math.round((accepted / total) * 1000) / 10 : 0,
        });
      });

      return NextResponse.json({
        success: true,
        data: {
          groupBy: "day",
          period: `${days} days`,
          stats: dailyStats,
        },
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid groupBy parameter" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("AI Performance Analytics API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch analytics",
      },
      { status: 500 }
    );
  }
}
