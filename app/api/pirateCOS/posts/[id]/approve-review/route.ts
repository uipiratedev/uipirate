import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import { verifyAuth } from "@/lib/pirateCOS/auth";
import { checkRole } from "@/lib/pirateCOS/require-role";
import { audit } from "@/lib/pirateCOS/audit";

// POST /api/pirateCOS/posts/[id]/approve-review
// Admins/org-admins approve a pending-review post, allowing it to be published.
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await verifyAuth();
  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const denied = checkRole(user, ["org-admin", "admin"]);
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

  if (post.approvalStatus !== "pending_review") {
    return NextResponse.json(
      { success: false, error: "Post is not awaiting review" },
      { status: 400 }
    );
  }

  const body = await req.json().catch(() => ({}));
  post.approvalStatus = "approved";
  post.approvalReviewedBy = user.email;
  post.approvalReviewedAt = new Date();
  post.approvalNote = body.note ?? undefined;
  await post.save();

  await audit(user, "post.approve", {
    targetId: params.id,
    targetType: "post",
    meta: { title: post.title, note: post.approvalNote },
  });

  return NextResponse.json({ success: true, data: { approvalStatus: post.approvalStatus } });
}
