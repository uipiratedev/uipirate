import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";

interface BlogQuery {
  published: boolean;
  postType?: any;
  $or?: any[];
}

// GET /api/blogs - Get all published blogs (Public only)
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const postType = searchParams.get("postType");
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const skip = (page - 1) * limit;

    // Public requests can only query published posts
    const query: BlogQuery = {
      published: true,
    };

    if (postType && postType !== "all") {
      if (postType === "blog") {
        query.$or = [
          { postType: "blog" },
          { postType: { $exists: false } },
          { postType: null },
        ];
      } else {
        query.postType = postType;
      }
    }

    const blogs = await Blog.find(query)
      .sort({ createdAt: -1, publishedAt: -1 })
      .limit(limit)
      .skip(skip)
      .select("-content") // Exclude full content for list view
      .lean();

    const total = await Blog.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: blogs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch blogs";

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 },
    );
  }
}
