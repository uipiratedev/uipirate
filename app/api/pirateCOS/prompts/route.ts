import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/pirateCOS/auth";
import {
  getAllPromptKeys,
  getPrompt,
  getAllVersions,
  type PromptKey,
} from "@/lib/pirateCOS/prompt-registry";
import AIGenerationLog from "@/models/pirateCOS/AIGenerationLog";
import dbConnect from "@/lib/mongodb";

/**
 * Phase 4G-3: Prompt Registry API
 * 
 * GET /api/pirateCOS/prompts - List all prompts with performance metrics
 * GET /api/pirateCOS/prompts?key=<promptKey> - Get specific prompt with all versions
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
    const promptKey = searchParams.get("key") as PromptKey | null;

    // If specific prompt key requested
    if (promptKey) {
      try {
        const versions = getAllVersions(promptKey);
        const latestVersion = getPrompt(promptKey);

        // Get performance metrics for each version from AIGenerationLog
        const versionsWithMetrics = await Promise.all(
          versions.map(async (version) => {
            // Query logs for this prompt version
            // Note: We'll need to start storing promptVersion in logs
            const logs = await AIGenerationLog.find({
              tenantId: user.tenantId,
              "generation.promptVersion": version.version,
            }).select("feedback generation.latencyMs");

            const total = logs.length;
            const accepted = logs.filter(
              (l) => l.feedback.action === "accepted"
            ).length;
            const acceptanceRate = total > 0 ? (accepted / total) * 100 : 0;
            const avgLatency =
              logs.reduce((sum, l) => sum + (l.generation.latencyMs || 0), 0) /
                (total || 1);

            return {
              ...version.metadata,
              version: version.version,
              systemPrompt: version.systemPrompt?.substring(0, 200) + "...", // Preview only
              testResults: {
                acceptanceRate: Math.round(acceptanceRate * 10) / 10,
                avgLatency: Math.round(avgLatency),
                totalGenerations: total,
              },
            };
          })
        );

        return NextResponse.json({
          success: true,
          data: {
            key: promptKey,
            latestVersion: latestVersion.version,
            versions: versionsWithMetrics,
          },
        });
      } catch (error: any) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 400 }
        );
      }
    }

    // List all prompts
    const allKeys = getAllPromptKeys();
    const prompts = await Promise.all(
      allKeys.map(async (key) => {
        const latest = getPrompt(key);
        const versions = getAllVersions(key);

        // Get aggregate performance metrics
        const logs = await AIGenerationLog.find({
          tenantId: user.tenantId,
          "generation.action": key,
        })
          .select("feedback generation.latencyMs")
          .limit(1000); // Limit for performance

        const total = logs.length;
        const accepted = logs.filter(
          (l) => l.feedback.action === "accepted"
        ).length;
        const acceptanceRate = total > 0 ? (accepted / total) * 100 : 0;
        const avgLatency =
          logs.reduce((sum, l) => sum + (l.generation.latencyMs || 0), 0) /
            (total || 1);

        return {
          key,
          latestVersion: latest.version,
          totalVersions: versions.length,
          description: latest.metadata.description,
          performance: {
            acceptanceRate: Math.round(acceptanceRate * 10) / 10,
            avgLatency: Math.round(avgLatency),
            totalGenerations: total,
          },
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        prompts,
        total: prompts.length,
      },
    });
  } catch (error: any) {
    console.error("Prompts API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch prompts" },
      { status: 500 }
    );
  }
}
