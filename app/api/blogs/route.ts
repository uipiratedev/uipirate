import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { verifyAuth } from "@/lib/pirateCOS/auth";

interface BlogQuery {
  tenantId?: mongoose.Types.ObjectId;
  published?: boolean;
  postType?: any;
  $or?: any[];
}

// GET /api/blogs - Get all blogs (published only for public, all for authenticated admin)
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const published = searchParams.get("published");
    const postType = searchParams.get("postType");
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const skip = (page - 1) * limit;

    // Check if user is authenticated admin
    const user = await verifyAuth();
    const isAdmin = !!user;

    const query: BlogQuery = {};

    // Scope to the authenticated tenant; public requests see all published posts.
    // Explicitly cast to ObjectId so MongoDB always receives the correct BSON
    // type, regardless of whether the Mongoose model schema is cached from an
    // earlier dev-server session that predates the tenantId field.
    if (isAdmin) {
      query.tenantId = new mongoose.Types.ObjectId(user!.tenantId);
    }

    // If not admin, only show published blogs
    if (!isAdmin) {
      query.published = true;
    } else if (published !== null) {
      // Admin can filter by published status
      query.published = published === "true";
    }

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

interface BlogCreateData {
  title: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  bannerImage: string;
  tags: string[];
  published: boolean;
  postType?: string;
  slug?: string;
  seo?: any;
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

    const body = (await request.json()) as BlogCreateData;
    const {
      title,
      content,
      excerpt,
      featuredImage,
      bannerImage,
      tags,
      published,
      postType,
      slug: providedSlug,
      seo,
    } = body;

    // Use provided slug or generate from title
    let slug =
      providedSlug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    // Explicit ObjectId — bypasses stale schema cache in dev hot-reload
    const postTenantOid = new mongoose.Types.ObjectId(user.tenantId);

    // Check if slug already exists within this tenant's namespace
    const existingBlog = await Blog.findOne({ tenantId: postTenantOid, slug }).lean();

    if (existingBlog && !providedSlug) {
      // Add timestamp to make slug unique within this tenant
      slug = `${slug}-${Date.now()}`;
    }

    // Create blog with tenantId scoping
    const blog = await Blog.create({
      tenantId: postTenantOid,
      title,
      slug,
      content,
      excerpt,
      featuredImage,
      bannerImage,
      tags,
      published: published || false,
      postType: postType || "blog",
      seo: seo || {},
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
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create blog";

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 },
    );
  }
}
