import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import { verifyAuth } from "@/lib/pirateCOS/auth";
import { createSnapshot } from "@/lib/pirateCOS/version-tracker"; // Phase 4F.2
import type { IContentHistory } from "@/models/pirateCOS/ContentHistory";

interface PostQuery {
  tenantId?: mongoose.Types.ObjectId;
  published?: boolean;
  postType?: any;
  $or?: any[];
}

// GET /api/pirateCOS/posts - Get all posts scoped to tenant with pagination and advanced filtering
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
    const status = searchParams.get("status");
    const published = searchParams.get("published");
    const postType = searchParams.get("postType");
    const search = searchParams.get("search");
    const teamId = searchParams.get("teamId");
    
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const skip = (page - 1) * limit;

    const query: any = {
      tenantId: new mongoose.Types.ObjectId(user.tenantId),
    };

    const andConditions: any[] = [];

    // Filter by status (published/draft)
    if (status === "published") {
      query.published = true;
    } else if (status === "draft") {
      query.published = false;
    } else if (published !== null) {
      // Fallback to old 'published' query parameter for backward compatibility
      query.published = published === "true";
    }

    // Filter by postType
    if (postType && postType !== "all") {
      if (postType === "blog") {
        andConditions.push({
          $or: [
            { postType: "blog" },
            { postType: { $exists: false } },
            { postType: null },
          ],
        });
      } else {
        andConditions.push({ postType });
      }
    }

    // Filter by search query (text search across title and excerpt)
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      andConditions.push({
        $or: [
          { title: { $regex: searchRegex } },
          { excerpt: { $regex: searchRegex } },
        ],
      });
    }

    // Filter by teamId
    if (teamId && teamId !== "all") {
      if (teamId === "personal") {
        andConditions.push({
          $or: [
            { teamId: { $exists: false } },
            { teamId: null },
          ],
        });
      } else if (mongoose.Types.ObjectId.isValid(teamId)) {
        andConditions.push({ teamId: new mongoose.Types.ObjectId(teamId) });
      }
    }

    if (andConditions.length > 0) {
      query.$and = andConditions;
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
      posts: blogs,
      data: blogs, // backward compatibility
      totalCount: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
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
      // Phase 4F.2: optional version-tracking metadata
      changeType: bodyChangeType,
      commitMessage: bodyCommitMessage,
      aiMetadata: bodyAiMetadata,
    } = body as {
      [key: string]: any;
      changeType?: IContentHistory["changeType"];
      commitMessage?: string;
      aiMetadata?: IContentHistory["aiMetadata"];
    };

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
    const initialChangeType: IContentHistory["changeType"] =
      bodyChangeType ?? "manual";
    const isAiInitial = initialChangeType.startsWith("ai-");
    try {
      await createSnapshot(
        blog._id.toString(),
        blog.content ?? "",
        user.tenantId.toString(),
        isAiInitial ? "ai" : user.id,
        initialChangeType,
        {
          title: blog.title,
          postType: blog.postType,
          commitMessage: bodyCommitMessage ?? "Initial post creation",
          aiMetadata: bodyAiMetadata,
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
