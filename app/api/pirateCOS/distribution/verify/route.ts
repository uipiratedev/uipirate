import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { verifyAuth } from "@/lib/pirateCOS/auth";
import { verifyDistribution } from "@/lib/pirateCOS/distribution";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import { SupportedPlatform } from "@/models/pirateCOS/Integration";

export async function POST(req: NextRequest) {
  const user = await verifyAuth();

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const { postId, platform } = await req.json();

    if (!postId || !platform) {
      return NextResponse.json(
        { success: false, error: "Missing required fields postId or platform" },
        { status: 400 },
      );
    }

    await dbConnect();
    const tenantOid = new mongoose.Types.ObjectId(user.tenantId);

    // Strict tenant isolation guard
    const post = await Post.findOne({ _id: postId, tenantId: tenantOid });

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 },
      );
    }

    const records = post.distributionRecords || [];
    const index = records.findIndex((r) => r.platform === platform);

    if (index === -1) {
      return NextResponse.json({
        success: true,
        exists: true,
        distributionRecords: records,
      });
    }

    const record = records[index];
    if (!record.externalId) {
      return NextResponse.json({
        success: true,
        exists: true,
        distributionRecords: records,
      });
    }

    // Call dynamic platform verification probe
    const check = await verifyDistribution({
      platform: platform as SupportedPlatform,
      externalId: record.externalId,
      tenantId: user.tenantId,
    });

    if (!check.exists) {
      // Mark as failed and log external deletion reason
      record.status = "failed";
      record.errorMessage = check.errorMessage || "Post was deleted on the external platform.";
      
      post.markModified("distributionRecords");
      await post.save();
    }

    return NextResponse.json({
      success: true,
      exists: check.exists,
      distributionRecords: post.distributionRecords,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to verify distribution link" },
      { status: 500 },
    );
  }
}
