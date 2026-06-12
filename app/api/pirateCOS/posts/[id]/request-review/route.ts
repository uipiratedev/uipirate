import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import { verifyAuth } from "@/lib/pirateCOS/auth";
import { checkRole } from "@/lib/pirateCOS/require-role";
import { audit } from "@/lib/pirateCOS/audit";

// POST /api/pirateCOS/posts/[id]/request-review
// Editors submit a post for admin/org-admin review before publishing.
export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await verifyAuth();
  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const denied = checkRole(user, ["org-admin", "admin", "editor"]);
  if (denied) return denied;

  await dbConnect();

  const tenantOid = new mongoose.Types.ObjectId(user.tenantId);
  const post = await Post.findOne({ _id: params.id, tenantId: tenantOid });

  if (!post) {
    return NextResponse.json(
      { success: false, error: "Post not found" },
      { status: 404 }
    );
  }

  if (post.approvalStatus === "approved") {
    return NextResponse.json(
      { success: false, error: "Post is already approved" },
      { status: 400 }
    );
  }

  post.approvalStatus = "pending_review";
  post.approvalRequestedBy = user.email;
  post.approvalRequestedAt = new Date();
  post.approvalNote = undefined;
  await post.save();

  await audit(user, "post.request_review", {
    targetId: params.id,
    targetType: "post",
    meta: { title: post.title },
  });

  return NextResponse.json({ success: true, data: { approvalStatus: post.approvalStatus } });
}
