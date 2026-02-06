import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { verifyAuth } from "@/lib/auth";

interface BlogQuery {
  published?: boolean;
}

// GET /api/blogs - Get all blogs (published only for public, all for authenticated admin)
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const published = searchParams.get("published");
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const skip = (page - 1) * limit;

    // Check if user is authenticated admin
    const user = await verifyAuth();
    const isAdmin = !!user;

    const query: BlogQuery = {};

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
      .select("-content") // Exclude full content for list view
      .lean(); // Use lean() for better performance

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
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch blogs";
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 },
    );
  }
}

interface BlogCreateData {
  title: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  bannerImage: string;
  tags: string[];
  published: boolean;
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

    const body = await request.json() as BlogCreateData;
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
    let slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Check if slug already exists and make it unique if needed
    const existingBlog = await Blog.findOne({ slug }).lean();

    if (existingBlog) {
      // Add timestamp to make slug unique
      slug = `${slug}-${Date.now()}`;
    }

    // Create blog with calculated slug
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
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to create blog";
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 },
    );
  }
}
