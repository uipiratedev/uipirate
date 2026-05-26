import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";

// GET /api/posts/[id] - Get a single published post by ID or slug (Public only)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await dbConnect();

    const { id } = params;

    // Try to find by ID first, then by slug
    let post = await Post.findOne({ _id: id, published: true }).catch(
      () => null,
    );

    if (!post) {
      const escapedId = id.replace(/[/\-\\^$*+?.()|[\]{}]/g, "\\$&");

      post = await Post.findOne({
        slug: { $regex: new RegExp(`^${escapedId}$`, "i") },
        published: true,
      });
    }

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: post,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch post";

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 },
    );
  }
}
