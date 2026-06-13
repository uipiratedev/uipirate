import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import { verifyAuth } from "@/lib/pirateCOS/auth";
import { checkRole } from "@/lib/pirateCOS/require-role";
import { audit } from "@/lib/pirateCOS/audit";
import { createSnapshot } from "@/lib/pirateCOS/version-tracker";
import { notifyByEmail } from "@/lib/pirateCOS/notify";
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
  teamId?: string;
  assignees?: Array<{ email: string; name: string }>;
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
    let post = await Post.findOne({ _id: id, tenantId: tenantOid }).catch(
      () => null,
    );

    if (!post) {
      const escapedId = id.replace(/[/\-\\^$*+?.()|[\]{}]/g, "\\$&");

      post = await Post.findOne({
        tenantId: tenantOid,
        slug: { $regex: new RegExp(`^${escapedId}$`, "i") },
      });
    }

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 },
      );
    }

    // Org members (non-owners) can only access posts they created or are assigned to
    if (user.id !== user.tenantId) {
      const ownerEmail = (post as any).owner?.email;
      const assigneeEmails: string[] = ((post as any).assignees ?? []).map((a: any) => a.email);
      if (ownerEmail !== user.email && !assigneeEmails.includes(user.email)) {
        return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
      }
    }

    return NextResponse.json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error("GET /api/pirateCOS/posts/[id] error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch post",
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

    const denied = checkRole(user, ["org-admin", "admin", "editor"]);
    if (denied) return denied;

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
      teamId,
      assignees,
      changeType: bodyChangeType, // Phase 4F.2
      commitMessage: bodyCommitMessage, // Phase 4F.2
      aiMetadata: bodyAiMetadata, // Phase 4F.2
    } = body;


    const putTenantOid = new mongoose.Types.ObjectId(user.tenantId);
    const post = await Post.findOne({ _id: id, tenantId: putTenantOid });

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 },
      );
    }

    // Update fields
    if (title !== undefined) {
      post.title = title;
      if (customSlug === undefined) {
        const newSlug = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

        const existingPost = await Post.findOne({
          tenantId: putTenantOid,
          slug: newSlug,
          _id: { $ne: id },
        }).lean();

        if (!existingPost) {
          post.slug = newSlug;
        }
      }
    }

    if (customSlug !== undefined && customSlug !== post.slug) {
      const existingPost = await Post.findOne({
        tenantId: putTenantOid,
        slug: customSlug,
        _id: { $ne: id },
      }).lean();

      if (existingPost) {
        return NextResponse.json(
          { success: false, error: "Slug already exists" },
          { status: 400 },
        );
      }
      post.slug = customSlug;
    }

    // Phase 4F.2: Capture the previous content BEFORE mutation so we can
    // detect a real change after save (and avoid the no-op snapshot bug
    // where post.content has already been overwritten).
    const previousContent = post.content ?? "";

    if (content !== undefined) post.content = content;
    if (excerpt !== undefined) post.excerpt = excerpt;
    if (featuredImage !== undefined) post.featuredImage = featuredImage;
    if (bannerImage !== undefined) post.bannerImage = bannerImage;
    if (tags !== undefined) post.tags = tags;
    if (published !== undefined) post.published = published;
    if (postType !== undefined) (post as any).postType = postType;
    if (contentGoal !== undefined) (post as any).contentGoal = contentGoal;
    if (teamId !== undefined) (post as any).teamId = teamId ? new mongoose.Types.ObjectId(teamId) : null;
    if (assignees !== undefined) {
      const prevEmails: string[] = ((post as any).assignees ?? []).map((a: any) => a.email);
      (post as any).assignees = assignees;
      post.markModified("assignees");
      // Notify only newly added members
      for (const a of assignees) {
        if (!prevEmails.includes(a.email)) {
          notifyByEmail(a.email, {
            type: "post_assigned",
            title: "Post assigned to you",
            message: `${user.name || user.email} added you as a collaborator on "${(post as any).title}".`,
            href: `/pirateCOS/posts/edit/${post._id}`,
            relatedId: String(post._id),
          });
        }
      }
    }

    if (seo !== undefined) {
      post.seo = {
        ...post.seo,
        ...seo,
      };
      post.markModified("seo");
    }

    if (repurposedOutputs !== undefined) {
      post.repurposedOutputs = repurposedOutputs;
      post.markModified("repurposedOutputs");
    }

    if (aiWorkspaceSession !== undefined) {
      post.aiWorkspaceSession = aiWorkspaceSession;
      post.markModified("aiWorkspaceSession");
    }


    if (content !== undefined) {
      post.calculateReadTime();
    }

    await post.save();

    // Phase 4F.2: Create version snapshot only when content actually changed.
    // Compare against the pre-mutation `previousContent` (the old buggy check
    // compared against `post.content`, which had already been reassigned).
    if (content !== undefined && content !== previousContent) {
      const updateChangeType: IContentHistory["changeType"] =
        bodyChangeType ?? "manual";
      const isAiUpdate = updateChangeType.startsWith("ai-");
      try {
        await createSnapshot(
          id,
          post.content,
          user.tenantId.toString(),
          isAiUpdate ? "ai" : user.id,
          updateChangeType,
          {
            title: post.title,
            postType: post.postType,
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
      data: post,
    });
  } catch (error) {
    console.error("PUT /api/pirateCOS/posts/[id] error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update post",
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

    const deleteDenied = checkRole(user, ["org-admin", "admin"]);
    if (deleteDenied) return deleteDenied;

    await dbConnect();

    const { id } = params;
    const deleteTenantOid = new mongoose.Types.ObjectId(user.tenantId);
    const post = await Post.findOneAndDelete({
      _id: id,
      tenantId: deleteTenantOid,
    });

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 },
      );
    }

    await audit(user, "post.delete", { targetId: id, targetType: "post", meta: { title: (post as any).title } });

    return NextResponse.json({
      success: true,
      message: "Post deleted successfully",
      data: post,
    });
  } catch (error) {
    console.error("DELETE /api/pirateCOS/posts/[id] error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete post",
      },
      { status: 500 },
    );
  }
}
