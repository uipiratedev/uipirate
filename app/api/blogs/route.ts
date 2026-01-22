import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { verifyAuth } from "@/lib/auth";

// GET /api/blogs - Get all blogs (published only for public, all for authenticated admin)
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const published = searchParams.get("published");
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    // Check if user is authenticated admin
    const user = await verifyAuth();
    const isAdmin = !!user;

    let query: any = {};

    // If not admin, only show published blogs
    if (!isAdmin) {
      query.published = true;
    } else if (published !== null) {
      // Admin can filter by published status
      query.published = published === "true";
    }

    const blogs = await Blog.find(query)
      .sort({ createdAt: -1, publishedAt: -1 })
      .limit(limit)
      .skip(skip)
      .select("-content"); // Exclude full content for list view

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
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch blogs",
      },
      { status: 500 },
    );
  }
}

// POST /api/blogs - Create a new blog (requires authentication)
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const {
      title,
      content,
      excerpt,
      featuredImage,
      bannerImage,
      tags,
      published,
    } = body;

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Check if slug already exists
    const existingBlog = await Blog.findOne({ slug });

    if (existingBlog) {
      // Add timestamp to make slug unique
      const uniqueSlug = `${slug}-${Date.now()}`;
      const blog = await Blog.create({
        title,
        slug: uniqueSlug,
        content,
        excerpt,
        featuredImage,
        bannerImage,
        tags,
        published: published || false,
        author: {
          name: user.name || "UI Pirate",
          email: user.email || "",
        },
      });

      // Calculate read time
      blog.calculateReadTime();
      await blog.save();

      return NextResponse.json(
        {
          success: true,
          data: blog,
        },
        { status: 201 },
      );
    }

    const blog = await Blog.create({
      title,
      slug,
      content,
      excerpt,
      featuredImage,
      bannerImage,
      tags,
      published: published || false,
      author: {
        name: user.name || "UI Pirate",
        email: user.email || "",
      },
    });

    // Calculate read time
    blog.calculateReadTime();
    await blog.save();

    return NextResponse.json(
      {
        success: true,
        data: blog,
      },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create blog",
      },
      { status: 500 },
    );
  }
}
