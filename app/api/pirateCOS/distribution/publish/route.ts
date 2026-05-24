import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { verifyAuth } from "@/lib/pirateCOS/auth";
import { dispatch } from "@/lib/pirateCOS/distribution";
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

  const { blogId, platforms, options } = await req.json();

  if (!blogId || !mongoose.Types.ObjectId.isValid(blogId)) {
    return NextResponse.json(
      { success: false, error: "Invalid or missing blog ID" },
      { status: 400 },
    );
  }

  if (!Array.isArray(platforms) || platforms.length === 0) {
    return NextResponse.json(
      { success: false, error: "Please select at least one platform for distribution" },
      { status: 400 },
    );
  }

  await dbConnect();
  const tenantOid = new mongoose.Types.ObjectId(user.tenantId);

  // Scoped strictly to the tenant to guarantee tenant boundary
  const post = await Post.findOne({ _id: blogId, tenantId: tenantOid });

  if (!post) {
    return NextResponse.json(
      { success: false, error: "Blog post not found" },
      { status: 404 },
    );
  }

  if (!post.published) {
    return NextResponse.json(
      { success: false, error: "Please publish the blog locally before distributing." },
      { status: 400 },
    );
  }

  // Trigger concurrent distribution
  const results = await dispatch({
    post,
    platforms: platforms as SupportedPlatform[],
    options,
    tenantId: user.tenantId,
  });

  // Upsert the results to the blog's distributionRecords
  if (!post.distributionRecords) {
    post.distributionRecords = [];
  }

  for (const result of results) {
    const existingIndex = post.distributionRecords.findIndex(
      (r) => r.platform === result.platform,
    );

    if (existingIndex > -1) {
      // Update existing record
      post.distributionRecords[existingIndex] = {
        platform: result.platform,
        externalId: result.externalId,
        url: result.url,
        distributedAt: result.distributedAt,
        status: result.status,
        errorMessage: result.errorMessage || "",
      };
    } else {
      // Append new record
      post.distributionRecords.push({
        platform: result.platform,
        externalId: result.externalId,
        url: result.url,
        distributedAt: result.distributedAt,
        status: result.status,
        errorMessage: result.errorMessage || "",
      });
    }
  }

  // Use markModified for arrays in Mongoose if needed
  post.markModified("distributionRecords");
  await post.save();

  return NextResponse.json({
    success: true,
    results,
  });
}
