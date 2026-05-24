import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { verifyAuth } from "@/lib/pirateCOS/auth";
import { dispatch } from "@/lib/distribution";
import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { SupportedPlatform } from "@/models/Integration";

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
  const blog = await Blog.findOne({ _id: blogId, tenantId: tenantOid });

  if (!blog) {
    return NextResponse.json(
      { success: false, error: "Blog post not found" },
      { status: 404 },
    );
  }

  if (!blog.published) {
    return NextResponse.json(
      { success: false, error: "Please publish the blog locally before distributing." },
      { status: 400 },
    );
  }

  // Trigger concurrent distribution
  const results = await dispatch({
    blog,
    platforms: platforms as SupportedPlatform[],
    options,
    tenantId: user.tenantId,
  });

  // Upsert the results to the blog's distributionRecords
  if (!blog.distributionRecords) {
    blog.distributionRecords = [];
  }

  for (const result of results) {
    const existingIndex = blog.distributionRecords.findIndex(
      (r) => r.platform === result.platform,
    );

    if (existingIndex > -1) {
      // Update existing record
      blog.distributionRecords[existingIndex] = {
        platform: result.platform,
        externalId: result.externalId,
        url: result.url,
        distributedAt: result.distributedAt,
        status: result.status,
        errorMessage: result.errorMessage || "",
      };
    } else {
      // Append new record
      blog.distributionRecords.push({
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
  blog.markModified("distributionRecords");
  await blog.save();

  return NextResponse.json({
    success: true,
    results,
  });
}
