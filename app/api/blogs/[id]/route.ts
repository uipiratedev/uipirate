import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { verifyAuth } from "@/lib/auth";

interface BlogUpdateData {
  title?: string;
  content?: string;
  excerpt?: string;
  featuredImage?: string;
  bannerImage?: string;
  tags?: string[];
  published?: boolean;
}

// GET /api/blogs/[id] - Get a single blog by ID or slug
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await dbConnect();

    const { id } = params;

    // Try to find by ID first, then by slug
    let blog = await Blog.findById(id);

    if (!blog) {
      blog = await Blog.findOne({ slug: id });
    }

    if (!blog) {
      return NextResponse.json(
        { success: false, error: "Blog not found" },
        { status: 404 },
      );
    }

    // Check if blog is published or user is admin
    const user = await verifyAuth();
    const isAdmin = !!user;

    if (!blog.published && !isAdmin) {
      return NextResponse.json(
        { success: false, error: "Blog not found" },
        { status: 404 },
      );
    }

    // Increment view count for published blogs
    if (blog.published && !isAdmin) {
      blog.views = (blog.views || 0) + 1;
      await blog.save();
    }

    return NextResponse.json({
      success: true,
      data: blog,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch blog";
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 },
    );
  }
}

// PUT /api/blogs/[id] - Update a blog (requires authentication)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Check authentication
    const user = await verifyAuth();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    await dbConnect();

    const { id } = params;
    const body = await request.json() as BlogUpdateData;
    const {
      title,
      content,
      excerpt,
      featuredImage,
      bannerImage,
      tags,
      published,
    } = body;

    const blog = await Blog.findById(id);

    if (!blog) {
      return NextResponse.json(
        { success: false, error: "Blog not found" },
        { status: 404 },
      );
    }

    // Update fields
    if (title !== undefined) {
      blog.title = title;
      // Update slug if title changed
      const newSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      // Check if new slug conflicts with another blog
      const existingBlog = await Blog.findOne({
        slug: newSlug,
        _id: { $ne: id },
      }).lean();

      if (!existingBlog) {
        blog.slug = newSlug;
      }
    }
    if (content !== undefined) blog.content = content;
    if (excerpt !== undefined) blog.excerpt = excerpt;
    if (featuredImage !== undefined) blog.featuredImage = featuredImage;
    if (bannerImage !== undefined) blog.bannerImage = bannerImage;
    if (tags !== undefined) blog.tags = tags;
    if (published !== undefined) blog.published = published;

    // Recalculate read time if content changed
    if (content !== undefined) {
      blog.calculateReadTime();
    }

    await blog.save();

    return NextResponse.json({
      success: true,
      data: blog,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to update blog";
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 },
    );
  }
}

// DELETE /api/blogs/[id] - Delete a blog (requires authentication)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Check authentication
    const user = await verifyAuth();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    await dbConnect();

    const { id } = params;

    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return NextResponse.json(
        { success: false, error: "Blog not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Blog deleted successfully",
      data: blog,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to delete blog";
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 },
    );
  }
}
