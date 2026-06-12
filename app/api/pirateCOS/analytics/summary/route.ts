import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/pirateCOS/auth";
import AIGenerationLog from "@/models/pirateCOS/AIGenerationLog";
import dbConnect from "@/lib/mongodb";

/**
 * Phase 4G-4: Analytics Summary API
 * 
 * GET /api/pirateCOS/analytics/summary
 * 
 * Returns high-level summary statistics for dashboard:
 * - Total generations
 * - Acceptance rate
 * - Total cost
 * - Average latency
 * - Most used provider
 * - Most effective action
 * 
 * Query params:
 * - days: number (default: 30)
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

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const logs = await AIGenerationLog.find({
      tenantId: user.tenantId,
      createdAt: { $gte: startDate },
    });

    if (logs.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          totalGenerations: 0,
          acceptanceRate: 0,
          totalCost: 0,
          avgLatency: 0,
          message: "No data available for the selected period",
        },
      });
    }

    // === Calculate Summary Stats ===
    const total = logs.length;
    const accepted = logs.filter((l) => l.feedback.action === "accepted").length;
    const rejected = logs.filter((l) => l.feedback.action === "rejected").length;
    const edited = logs.filter((l) => l.feedback.action === "edited").length;
    const pending = logs.filter(
      (l) => !l.feedback.action || l.feedback.action === "pending"
    ).length;

    const acceptanceRate = (accepted / total) * 100;
    const rejectionRate = (rejected / total) * 100;
    const editRate = (edited / total) * 100;

    const totalCost = logs.reduce((sum, l) => sum + (l.generation.costUSD || 0), 0);
    const avgLatency =
      logs.reduce((sum, l) => sum + (l.generation.latencyMs || 0), 0) / total;
    const avgCost = totalCost / total;

    // === Provider Distribution ===
    const providerCounts: any = {};
    logs.forEach((l) => {
      const provider = l.modelConfig.engine;
      providerCounts[provider] = (providerCounts[provider] || 0) + 1;
    });

    const mostUsedProvider = Object.entries(providerCounts).sort(
      ([, a]: any, [, b]: any) => b - a
    )[0];

    // === Action Distribution ===
    const actionCounts: any = {};
    logs.forEach((l) => {
      const action = l.generation.action;
      actionCounts[action] = (actionCounts[action] || 0) + 1;
    });

    const mostUsedAction = Object.entries(actionCounts).sort(
      ([, a]: any, [, b]: any) => b - a
    )[0];

    // === Best Performing Provider ===
    const providers = Array.from(new Set(logs.map((l) => l.modelConfig.engine)));
    const providerPerformance = providers.map((provider) => {
      const providerLogs = logs.filter((l) => l.modelConfig.engine === provider);
      const providerAccepted = providerLogs.filter(
        (l) => l.feedback.action === "accepted"
      ).length;
      return {
        provider,
        acceptanceRate:
          providerLogs.length > 0 ? (providerAccepted / providerLogs.length) * 100 : 0,
      };
    });

    const bestProvider = providerPerformance.sort(
      (a, b) => b.acceptanceRate - a.acceptanceRate
    )[0];

    // === Trend (compare to previous period) ===
    const prevStartDate = new Date(startDate);
    prevStartDate.setDate(prevStartDate.getDate() - days);
    const prevLogs = await AIGenerationLog.find({
      tenantId: user.tenantId,
      createdAt: { $gte: prevStartDate, $lt: startDate },
    });

    const prevAcceptanceRate =
      prevLogs.length > 0
        ? (prevLogs.filter((l) => l.feedback.action === "accepted").length /
            prevLogs.length) *
          100
        : 0;

    const trend = acceptanceRate - prevAcceptanceRate;

    return NextResponse.json({
      success: true,
      data: {
        period: `${days} days`,
        summary: {
          totalGenerations: total,
          acceptanceRate: Math.round(acceptanceRate * 10) / 10,
          rejectionRate: Math.round(rejectionRate * 10) / 10,
          editRate: Math.round(editRate * 10) / 10,
          pendingRate: Math.round((pending / total) * 1000) / 10,
        },
        performance: {
          avgLatencyMs: Math.round(avgLatency),
          totalCostUSD: Math.round(totalCost * 100) / 100,
          avgCostUSD: Math.round(avgCost * 10000) / 10000,
        },
        breakdown: {
          accepted,
          rejected,
          edited,
          pending,
        },
        providers: {
          mostUsed: mostUsedProvider ? mostUsedProvider[0] : "none",
          mostUsedCount: mostUsedProvider ? mostUsedProvider[1] : 0,
          bestPerforming: bestProvider?.provider || "none",
          bestAcceptanceRate: bestProvider
            ? Math.round(bestProvider.acceptanceRate * 10) / 10
            : 0,
          distribution: providerCounts,
        },
        actions: {
          mostUsed: mostUsedAction ? mostUsedAction[0] : "none",
          mostUsedCount: mostUsedAction ? mostUsedAction[1] : 0,
          distribution: actionCounts,
        },
        trend: {
          acceptanceRateChange: Math.round(trend * 10) / 10,
          direction: trend > 0 ? "up" : trend < 0 ? "down" : "stable",
          comparisonPeriod: `Previous ${days} days`,
        },
      },
    });
  } catch (error: any) {
    console.error("Summary Analytics API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch summary",
      },
      { status: 500 }
    );
  }
}
