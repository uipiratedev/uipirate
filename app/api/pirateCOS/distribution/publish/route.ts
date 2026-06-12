import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { verifyAuth } from "@/lib/pirateCOS/auth";
import { checkRole } from "@/lib/pirateCOS/require-role";
import { audit } from "@/lib/pirateCOS/audit";
import { dispatch } from "@/lib/pirateCOS/distribution";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import Admin from "@/models/pirateCOS/Admin";
import { SupportedPlatform } from "@/models/pirateCOS/Integration";
import { deductCredits, CreditLimitError } from "@/lib/usage-guard";

export async function POST(req: NextRequest) {
  const user = await verifyAuth();

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const denied = checkRole(user, ["org-admin", "admin", "editor"]);
  if (denied) return denied;

  const { blogId, platforms, options } = await req.json();

  if (!blogId || !mongoose.Types.ObjectId.isValid(blogId)) {
    return NextResponse.json(
      { success: false, error: "Invalid or missing blog ID" },
      { status: 400 },
    );
  }

  if (!Array.isArray(platforms) || platforms.length === 0) {
    return NextResponse.json(
      {
        success: false,
        error: "Please select at least one platform for distribution",
      },
      { status: 400 },
    );
  }

  await dbConnect();
  const tenantOid = new mongoose.Types.ObjectId(user.tenantId);

  // Scoped strictly to the tenant to guarantee tenant boundary
  const post = await Post.findOne({ _id: blogId, tenantId: tenantOid });

  if (!post) {
    return NextResponse.json(
      { success: false, error: "Blog post not found" },
      { status: 404 },
    );
  }

  if (!post.published) {
    return NextResponse.json(
      {
        success: false,
        error: "Please publish the blog locally before distributing.",
      },
      { status: 400 },
    );
  }

  // Editors may only distribute posts that have been approved by an admin.
  // Org-admins and admins can bypass the approval gate (they self-approve).
  const isPrivileged =
    user.accountType === "individual" ||
    user.orgRole === "org-admin" ||
    user.orgRole === "admin";

  if (!isPrivileged && post.approvalStatus !== "approved") {
    return NextResponse.json(
      {
        success: false,
        error:
          post.approvalStatus === "pending_review"
            ? "This post is awaiting admin approval before it can be distributed."
            : "This post must be approved by an admin before distribution. Submit it for review first.",
        approvalStatus: post.approvalStatus ?? "draft",
      },
      { status: 403 },
    );
  }

  // --- ENFORCE CREDIT LIMITS FOR outbound PUBLISHING ---
  const admin = await Admin.findById(user.tenantId);
  const costPerPlatform = 1.0;
  const totalCost = platforms.length * costPerPlatform;

  if (admin && admin.creditsRemaining < totalCost && admin.plan === "free") {
    return NextResponse.json(
      {
        success: false,
        error: `Insufficient credits. You need ${totalCost.toFixed(1)} credits to publish to ${platforms.length} channels, but you have ${admin.creditsRemaining.toFixed(1)}.`,
        upgradeUrl: `/pirateCOS/settings/billing?reason=insufficient_credits&cost=${totalCost}`,
        limitsReached: true,
      },
      { status: 402 }, // 402 Payment Required
    );
  }

  // Run credit deductions per channel
  for (const _platform of platforms) {
    try {
      await deductCredits(user.tenantId, "publish");
    } catch (guardErr: any) {
      if (guardErr instanceof CreditLimitError) {
        return NextResponse.json(
          {
            success: false,
            error: guardErr.message,
            upgradeUrl: guardErr.upgradeUrl,
            limitsReached: true,
          },
          { status: 402 },
        );
      }
      throw guardErr;
    }
  }

  // Trigger concurrent distribution
  const results = await dispatch({
    post,
    platforms: platforms as SupportedPlatform[],
    options,
    tenantId: user.tenantId,
  });

  // Upsert the results to the blog's distributionRecords
  if (!post.distributionRecords) {
    post.distributionRecords = [];
  }

  for (const result of results) {
    const existingIndex = post.distributionRecords.findIndex(
      (r) => r.platform === result.platform,
    );

    if (existingIndex > -1) {
      // Update existing record
      post.distributionRecords[existingIndex] = {
        platform: result.platform,
        externalId: result.externalId,
        url: result.url,
        distributedAt: result.distributedAt,
        status: result.status,
        errorMessage: result.errorMessage || "",
      };
    } else {
      // Append new record
      post.distributionRecords.push({
        platform: result.platform,
        externalId: result.externalId,
        url: result.url,
        distributedAt: result.distributedAt,
        status: result.status,
        errorMessage: result.errorMessage || "",
      });
    }
  }

  // Use markModified for arrays in Mongoose if needed
  post.markModified("distributionRecords");
  await post.save();
  await audit(user, "post.publish", {
    targetId: blogId,
    targetType: "post",
    meta: { platforms },
  });

  return NextResponse.json({
    success: true,
    results,
  });
}
