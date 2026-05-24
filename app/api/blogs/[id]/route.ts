import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";

// GET /api/blogs/[id] - Get a single published blog by ID or slug (Public only)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await dbConnect();

    const { id } = params;

    // Try to find by ID first, then by slug
    let blog = await Blog.findOne({ _id: id, published: true }).catch(() => null);

    if (!blog) {
      const escapedId = id.replace(/[/\-\\^$*+?.()|[\]{}]/g, "\\$&");

      blog = await Blog.findOne({
        slug: { $regex: new RegExp(`^${escapedId}$`, "i") },
        published: true,
      });
    }

    if (!blog) {
      return NextResponse.json(
        { success: false, error: "Blog not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: blog,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch blog";

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 },
    );
  }
}
