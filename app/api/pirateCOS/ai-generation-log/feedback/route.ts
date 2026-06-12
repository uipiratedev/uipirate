import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/pirateCOS/auth";
import AIGenerationLog from "@/models/pirateCOS/AIGenerationLog";
import dbConnect from "@/lib/mongodb";

/**
 * Phase 4G-2: AI Generation Feedback API
 * 
 * POST /api/pirateCOS/ai-generation-log/feedback
 * Updates feedback status for AI generations (RLHF signals)
 * 
 * Body: {
 *   generationId: string;
 *   action: "accepted" | "rejected" | "edited" | "regenerated";
 *   userEdits?: string; // For "edited" action
 *   rating?: number; // 1-5 stars
 *   flagReason?: string; // "hallucination", "off-brand", etc.
 * }
 */

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await request.json();
    const { generationId, action, userEdits, rating, flagReason } = body;

    if (!generationId || !action) {
      return NextResponse.json(
        { success: false, error: "generationId and action are required" },
        { status: 400 }
      );
    }

    // Validate action
    const validActions = ["accepted", "rejected", "edited", "regenerated"];
    if (!validActions.includes(action)) {
      return NextResponse.json(
        { success: false, error: `Invalid action. Must be one of: ${validActions.join(", ")}` },
        { status: 400 }
      );
    }

    // Find and update the generation log
    const log = await AIGenerationLog.findOne({ generationId });

    if (!log) {
      return NextResponse.json(
        { success: false, error: "Generation not found" },
        { status: 404 }
      );
    }

    // Verify tenant ownership
    if (log.tenantId.toString() !== user.tenantId.toString()) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Update feedback
    log.feedback.action = action;
    log.feedback.appliedAt = new Date();
    
    if (userEdits) {
      log.feedback.userEdits = userEdits;
    }
    
    if (rating !== undefined) {
      log.feedback.rating = rating;
    }
    
    if (flagReason) {
      log.feedback.flagReason = flagReason;
    }

    await log.save();

    return NextResponse.json({
      success: true,
      data: {
        generationId,
        feedback: log.feedback,
        message: `Feedback updated: ${action}`,
      },
    });
  } catch (error: any) {
    console.error("AI Generation Feedback API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update feedback" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/pirateCOS/ai-generation-log/feedback
 * Get feedback statistics for a tenant
 * 
 * Query params:
 * - engine?: string (filter by AI engine)
 * - action?: string (filter by generation action)
 * - days?: number (default: 30, look back period)
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
    const engine = searchParams.get("engine");
    const action = searchParams.get("action");
    const days = parseInt(searchParams.get("days") || "30");

    const query: any = {
      tenantId: user.tenantId,
      createdAt: { $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) },
    };

    if (engine) {
      query["modelConfig.engine"] = engine;
    }

    if (action) {
      query["generation.action"] = action;
    }

    const logs = await AIGenerationLog.find(query).select("feedback modelConfig generation.action createdAt");

    // Calculate statistics
    const stats = {
      total: logs.length,
      accepted: logs.filter(l => l.feedback.action === "accepted").length,
      rejected: logs.filter(l => l.feedback.action === "rejected").length,
      edited: logs.filter(l => l.feedback.action === "edited").length,
      regenerated: logs.filter(l => l.feedback.action === "regenerated").length,
      pending: logs.filter(l => l.feedback.action === "pending").length,
      avgRating: logs.filter(l => l.feedback.rating).reduce((sum, l) => sum + (l.feedback.rating || 0), 0) / logs.filter(l => l.feedback.rating).length || 0,
    };

    return NextResponse.json({
      success: true,
      data: {
        stats,
        period: `${days} days`,
        filters: { engine, action },
      },
    });
  } catch (error: any) {
    console.error("AI Generation Feedback Stats API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch feedback stats" },
      { status: 500 }
    );
  }
}
