import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import { verifyAuth } from "@/lib/pirateCOS/auth";
import { createSnapshot } from "@/lib/pirateCOS/version-tracker"; // Phase 4F.2
import type { IContentHistory } from "@/models/pirateCOS/ContentHistory";

interface PostUpdateData {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  featuredImage?: string;
  bannerImage?: string;
  tags?: string[];
  published?: boolean;
  postType?: string;
  contentGoal?: string;
  teamId?: string; // Phase 5.4+: Team assignment
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    twitterHandle?: string;
    twitterCard?: "summary" | "summary_large_image";
    focusKeyword?: string;
    canonicalUrl?: string;
    noIndex?: boolean;
  };
  repurposedOutputs?: Record<string, string>;
  aiWorkspaceSession?: any;
  // Phase 4F.2: optional version-tracking metadata
  changeType?: IContentHistory["changeType"];
  commitMessage?: string;
  aiMetadata?: IContentHistory["aiMetadata"];
}


// GET /api/pirateCOS/posts/[id] - Get a single post by ID or slug scoped to tenant
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const user = await verifyAuth();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    await dbConnect();

    const { id } = params;
    const tenantOid = new mongoose.Types.ObjectId(user.tenantId);

    // Try to find by ID first, then by slug, scoped strictly to tenant
    let blog = await Post.findOne({ _id: id, tenantId: tenantOid }).catch(
      () => null,
    );

    if (!blog) {
      const escapedId = id.replace(/[/\-\\^$*+?.()|[\]{}]/g, "\\$&");

      blog = await Post.findOne({
        tenantId: tenantOid,
        slug: { $regex: new RegExp(`^${escapedId}$`, "i") },
      });
    }

    if (!blog) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: blog,
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

// PUT /api/pirateCOS/posts/[id] - Update a post scoped to tenant
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const user = await verifyAuth();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    await dbConnect();

    const { id } = params;
    const body = (await request.json()) as PostUpdateData;
    const {
      title,
      slug: customSlug,
      content,
      excerpt,
      featuredImage,
      bannerImage,
      tags,
      published,
      postType,
      contentGoal,
      seo,
      repurposedOutputs,
      aiWorkspaceSession,
      teamId, // Phase 5.4+: Team assignment
      changeType: bodyChangeType, // Phase 4F.2
      commitMessage: bodyCommitMessage, // Phase 4F.2
      aiMetadata: bodyAiMetadata, // Phase 4F.2
    } = body;


    const putTenantOid = new mongoose.Types.ObjectId(user.tenantId);
    const blog = await Post.findOne({ _id: id, tenantId: putTenantOid });

    if (!blog) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 },
      );
    }

    // Update fields
    if (title !== undefined) {
      blog.title = title;
      if (customSlug === undefined) {
        const newSlug = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

        const existingBlog = await Post.findOne({
          tenantId: putTenantOid,
          slug: newSlug,
          _id: { $ne: id },
        }).lean();

        if (!existingBlog) {
          blog.slug = newSlug;
        }
      }
    }

    if (customSlug !== undefined && customSlug !== blog.slug) {
      const existingBlog = await Post.findOne({
        tenantId: putTenantOid,
        slug: customSlug,
        _id: { $ne: id },
      }).lean();

      if (existingBlog) {
        return NextResponse.json(
          { success: false, error: "Slug already exists" },
          { status: 400 },
        );
      }
      blog.slug = customSlug;
    }

    // Phase 4F.2: Capture the previous content BEFORE mutation so we can
    // detect a real change after save (and avoid the no-op snapshot bug
    // where blog.content has already been overwritten).
    const previousContent = blog.content ?? "";

    if (content !== undefined) blog.content = content;
    if (excerpt !== undefined) blog.excerpt = excerpt;
    if (featuredImage !== undefined) blog.featuredImage = featuredImage;
    if (bannerImage !== undefined) blog.bannerImage = bannerImage;
    if (tags !== undefined) blog.tags = tags;
    if (published !== undefined) blog.published = published;
    if (postType !== undefined) (blog as any).postType = postType;
    if (contentGoal !== undefined) (blog as any).contentGoal = contentGoal;
    if (teamId !== undefined) (blog as any).teamId = teamId ? new mongoose.Types.ObjectId(teamId) : null; // Phase 5.4+

    if (seo !== undefined) {
      blog.seo = {
        ...blog.seo,
        ...seo,
      };
      blog.markModified("seo");
    }

    if (repurposedOutputs !== undefined) {
      blog.repurposedOutputs = repurposedOutputs;
      blog.markModified("repurposedOutputs");
    }

    if (aiWorkspaceSession !== undefined) {
      blog.aiWorkspaceSession = aiWorkspaceSession;
      blog.markModified("aiWorkspaceSession");
    }


    if (content !== undefined) {
      blog.calculateReadTime();
    }

    await blog.save();

    // Phase 4F.2: Create version snapshot only when content actually changed.
    // Compare against the pre-mutation `previousContent` (the old buggy check
    // compared against `blog.content`, which had already been reassigned).
    if (content !== undefined && content !== previousContent) {
      const updateChangeType: IContentHistory["changeType"] =
        bodyChangeType ?? "manual";
      const isAiUpdate = updateChangeType.startsWith("ai-");
      try {
        await createSnapshot(
          id,
          blog.content,
          user.tenantId.toString(),
          isAiUpdate ? "ai" : user.id,
          updateChangeType,
          {
            title: blog.title,
            postType: blog.postType,
            commitMessage:
              bodyCommitMessage ??
              (isAiUpdate ? "AI content update" : "Manual content update"),
            aiMetadata: bodyAiMetadata,
          }
        );
      } catch (versionError) {
        console.error("Failed to create version snapshot:", versionError);
        // Don't fail the update if versioning fails
      }
    }

    return NextResponse.json({
      success: true,
      data: blog,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update post";

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 },
    );
  }
}

// DELETE /api/pirateCOS/posts/[id] - Delete a post scoped to tenant
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const user = await verifyAuth();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    await dbConnect();

    const { id } = params;
    const deleteTenantOid = new mongoose.Types.ObjectId(user.tenantId);
    const blog = await Post.findOneAndDelete({
      _id: id,
      tenantId: deleteTenantOid,
    });

    if (!blog) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Post deleted successfully",
      data: blog,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete post";

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 },
    );
  }
}
