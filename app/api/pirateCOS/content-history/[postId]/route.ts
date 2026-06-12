import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/pirateCOS/auth";
import { getVersionHistory } from "@/lib/pirateCOS/version-tracker";
import dbConnect from "@/lib/mongodb";

/**
 * Phase 4F.2: Content History API
 * 
 * GET /api/pirateCOS/content-history/[postId]
 * Returns version history for a specific post
 */

export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const user = await verifyAuth();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const { postId } = params;
    const { searchParams } = new URL(request.url);
    const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "50"), 1), 100);

    // Get version history
    const history = await getVersionHistory(postId, user.tenantId.toString(), limit);

    return NextResponse.json({
      success: true,
      data: {
        postId,
        totalVersions: history.length,
        versions: history,
      },
    });
  } catch (error: any) {
    console.error("Content History API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch content history" },
      { status: 500 }
    );
  }
}
