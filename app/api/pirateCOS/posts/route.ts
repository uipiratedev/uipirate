import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import { verifyAuth } from "@/lib/pirateCOS/auth";
import { createSnapshot } from "@/lib/pirateCOS/version-tracker"; // Phase 4F.2

interface PostQuery {
  tenantId?: mongoose.Types.ObjectId;
  published?: boolean;
  postType?: any;
  $or?: any[];
}

// GET /api/pirateCOS/posts - Get all posts scoped to tenant
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const published = searchParams.get("published");
    const postType = searchParams.get("postType");
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const skip = (page - 1) * limit;

    const query: PostQuery = {
      tenantId: new mongoose.Types.ObjectId(user.tenantId),
    };

    if (published !== null) {
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

    const blogs = await Post.find(query)
      .sort({ createdAt: -1, publishedAt: -1 })
      .limit(limit)
      .skip(skip)
      .select("-content")
      .lean();

    const total = await Post.countDocuments(query);

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

// POST /api/pirateCOS/posts - Create a new post scoped to tenant
export async function POST(request: NextRequest) {
  try {
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
      postType,
      contentGoal,
      slug: providedSlug,
      seo,
      teamId, // Phase 5.4+: Team assignment
    } = body;

    let slug =
      providedSlug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const postTenantOid = new mongoose.Types.ObjectId(user.tenantId);

    const existingBlog = await Post.findOne({
      tenantId: postTenantOid,
      slug,
    }).lean();

    if (existingBlog && !providedSlug) {
      slug = `${slug}-${Date.now()}`;
    }

    const blog = await Post.create({
      tenantId: postTenantOid,
      teamId: teamId ? new mongoose.Types.ObjectId(teamId) : undefined, // Phase 5.4+
      title,
      slug,
      content,
      excerpt,
      featuredImage,
      bannerImage,
      tags,
      published: published || false,
      postType: postType || "blog",
      contentGoal,
      seo: seo || {},
      author: {
        name: user.name || "UI Pirate",
        email: user.email || "",
      },
    });

    blog.calculateReadTime();
    await blog.save();

    // Phase 4F.2: Create initial version snapshot
    try {
      await createSnapshot(
        blog._id.toString(),
        blog.content,
        user.tenantId.toString(),
        user.id,
        "manual",
        {
          title: blog.title,
          postType: blog.postType,
          commitMessage: "Initial post creation",
        }
      );
    } catch (versionError) {
      console.error("Failed to create initial version snapshot:", versionError);
      // Don't fail post creation if versioning fails
    }

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
