import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { verifyApiKey } from "@/lib/pirateCOS/api-key-auth";
import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const auth = await verifyApiKey(req);

  if (!auth) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Invalid or missing API key." },
      { status: 401 },
    );
  }

  if (!auth.scopes.includes("read")) {
    return NextResponse.json(
      { success: false, error: "Forbidden. Read permission is required." },
      { status: 403 },
    );
  }

  if (!slug) {
    return NextResponse.json(
      { success: false, error: "Missing post slug parameter." },
      { status: 400 },
    );
  }

  await dbConnect();
  const tenantOid = new mongoose.Types.ObjectId(auth.tenantId);

  try {
    const blog = await Blog.findOne({
      tenantId: tenantOid,
      slug: slug.toLowerCase().trim(),
      published: true,
    }).lean();

    if (!blog) {
      return NextResponse.json(
        { success: false, error: "Post not found or is not published." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: blog,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch post detail" },
      { status: 500 },
    );
  }
}
