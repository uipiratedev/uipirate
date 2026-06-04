import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/pirateCOS/auth";
import AIGenerationLog from "@/models/pirateCOS/AIGenerationLog";
import BrandBrain from "@/models/pirateCOS/BrandBrain";
import dbConnect from "@/lib/mongodb";

/**
 * Phase 4G-4: Auto-Learning Insights API
 * 
 * GET /api/pirateCOS/analytics/insights
 * 
 * Analyzes AI generation logs and provides actionable insights:
 * - Provider recommendations (which AI to use?)
 * - Brand Brain refinement suggestions
 * - Cost optimization opportunities
 * - Performance improvement tips
 * 
 * Query params:
 * - days: number (default: 30, minimum data for reliable insights)
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

    // Fetch logs and Brand Brain
    const logs = await AIGenerationLog.find({
      tenantId: user.tenantId,
      createdAt: { $gte: startDate },
    });

    const brandBrain = await BrandBrain.findOne({ tenantId: user.tenantId });

    if (logs.length < 10) {
      return NextResponse.json({
        success: true,
        data: {
          insights: [],
          message: "Not enough data yet. Need at least 10 generations for meaningful insights.",
        },
      });
    }

    const insights: any[] = [];

    // === Insight 1: Best Provider Recommendation ===
    const providers = ["openai", "anthropic", "gemini", "mistral"];
    const providerMetrics = providers.map((provider) => {
      const providerLogs = logs.filter((l) => l.modelConfig.engine === provider);
      const total = providerLogs.length;
      const accepted = providerLogs.filter((l) => l.feedback.action === "accepted").length;
      const acceptanceRate = total > 0 ? (accepted / total) * 100 : 0;
      const avgCost = providerLogs.reduce((sum, l) => sum + (l.generation.costUSD || 0), 0) / (total || 1);

      return { provider, total, acceptanceRate, avgCost };
    });

    const bestProvider = providerMetrics.reduce((best, current) =>
      current.acceptanceRate > best.acceptanceRate ? current : best
    , providerMetrics[0]);

    if (bestProvider && bestProvider.total >= 5) {
      insights.push({
        type: "provider-recommendation",
        priority: "high",
        title: `Switch to ${bestProvider.provider.toUpperCase()} for Better Results`,
        description: `Based on ${days} days of data, ${bestProvider.provider} has a ${bestProvider.acceptanceRate.toFixed(1)}% acceptance rate, which is your best performing provider.`,
        action: {
          type: "change-default-provider",
          value: bestProvider.provider,
        },
        impact: "High - could improve acceptance rate by up to 15%",
      });
    }

    // === Insight 2: Cost Optimization ===
    const totalCost = logs.reduce((sum, l) => sum + (l.generation.costUSD || 0), 0);
    const avgCostPerGeneration = totalCost / logs.length;

    if (totalCost > 10) {
      // $10+ spent
      insights.push({
        type: "cost-optimization",
        priority: "medium",
        title: "Optimize AI Costs",
        description: `You've spent $${totalCost.toFixed(2)} on ${logs.length} generations (avg: $${avgCostPerGeneration.toFixed(4)} each). Consider using cheaper models for simple tasks.`,
        action: {
          type: "review-model-selection",
          suggestion: "Use GPT-4o-mini for simple rewrites, GPT-4o for complex content",
        },
        impact: "Medium - could save 30-50% on AI costs",
      });
    }

    // === Insight 3: Brand Voice Refinement ===
    const brandVoiceLogs = logs.filter((l) => l.context.brandVoice);
    const editedWithBrandVoice = brandVoiceLogs.filter((l) => l.feedback.action === "edited");

    if (editedWithBrandVoice.length > brandVoiceLogs.length * 0.3) {
      // >30% edited
      insights.push({
        type: "brand-voice-refinement",
        priority: "high",
        title: "Refine Your Brand Voice",
        description: `${((editedWithBrandVoice.length / brandVoiceLogs.length) * 100).toFixed(0)}% of generations with brand voice were edited. Your brand voice might need refinement.`,
        action: {
          type: "review-brand-brain",
          currentBrandVoice: brandBrain?.brandVoice || "Not set",
        },
        impact: "High - better brand voice = fewer manual edits",
      });
    }

    // === Insight 4: Most Effective Actions ===
    const actionMetrics: any = {};
    logs.forEach((log) => {
      const action = log.generation.action;
      if (!actionMetrics[action]) {
        actionMetrics[action] = { total: 0, accepted: 0 };
      }
      actionMetrics[action].total++;
      if (log.feedback.action === "accepted") {
        actionMetrics[action].accepted++;
      }
    });

    const bestAction = Object.entries(actionMetrics)
      .map(([action, metrics]: [string, any]) => ({
        action,
        acceptanceRate: (metrics.accepted / metrics.total) * 100,
        total: metrics.total,
      }))
      .filter((a) => a.total >= 3)
      .sort((a, b) => b.acceptanceRate - a.acceptanceRate)[0];

    if (bestAction) {
      insights.push({
        type: "action-effectiveness",
        priority: "low",
        title: `"${bestAction.action}" Works Best`,
        description: `The "${bestAction.action}" action has a ${bestAction.acceptanceRate.toFixed(1)}% acceptance rate. Use it more often for better results.`,
        action: {
          type: "promote-action",
          value: bestAction.action,
        },
        impact: "Low - slight improvement in workflow efficiency",
      });
    }

    // === Insight 5: Consistency Check ===
    const acceptanceRate = (logs.filter((l) => l.feedback.action === "accepted").length / logs.length) * 100;

    if (acceptanceRate < 50) {
      insights.push({
        type: "low-acceptance-alert",
        priority: "critical",
        title: "Low Acceptance Rate Detected",
        description: `Only ${acceptanceRate.toFixed(1)}% of AI generations are being accepted. This suggests AI settings need adjustment.`,
        action: {
          type: "review-all-settings",
          recommendations: [
            "Review Brand Brain settings",
            "Check if prompts need refinement",
            "Consider switching AI provider",
          ],
        },
        impact: "Critical - significant time waste on unusable content",
      });
    }

    // Sort by priority
    const priorityOrder: any = { critical: 0, high: 1, medium: 2, low: 3 };
    insights.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return NextResponse.json({
      success: true,
      data: {
        insights,
        totalInsights: insights.length,
        dataQuality: logs.length >= 50 ? "high" : logs.length >= 20 ? "medium" : "low",
        period: `${days} days`,
        totalGenerations: logs.length,
      },
    });
  } catch (error: any) {
    console.error("Insights API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate insights" },
      { status: 500 }
    );
  }
}
