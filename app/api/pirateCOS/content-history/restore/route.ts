import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/pirateCOS/auth";
import { restoreVersion } from "@/lib/pirateCOS/version-tracker";
import dbConnect from "@/lib/mongodb";

/**
 * Phase 4F.2: Version Restore API
 * 
 * POST /api/pirateCOS/content-history/restore
 * Restores a specific version of a post
 * 
 * Body: { postId, version }
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
    const { postId, version } = body;

    if (!postId || !version) {
      return NextResponse.json(
        { success: false, error: "postId and version are required" },
        { status: 400 }
      );
    }

    // Restore the version
    const { post, snapshot } = await restoreVersion(
      postId,
      version,
      user.tenantId.toString(),
      user.id
    );

    return NextResponse.json({
      success: true,
      data: {
        post,
        snapshot,
        message: `Successfully restored to version ${version}`,
      },
    });
  } catch (error: any) {
    console.error("Version Restore API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to restore version" },
      { status: 500 }
    );
  }
}
