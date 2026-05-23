import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { verifyApiKey } from "@/lib/api-key-auth";
import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";

export async function GET(req: NextRequest) {
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

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const tag = searchParams.get("tag");
  const postType = searchParams.get("postType");

  const skip = (page - 1) * limit;

  await dbConnect();
  const tenantOid = new mongoose.Types.ObjectId(auth.tenantId);

  // Filter criteria: tenant isolated + published locally
  const query: Record<string, any> = {
    tenantId: tenantOid,
    published: true,
  };

  if (tag) {
    query.tags = tag;
  }
  if (postType) {
    query.postType = postType;
  }

  try {
    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch content" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const auth = await verifyApiKey(req);

  if (!auth) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Invalid or missing API key." },
      { status: 401 },
    );
  }

  if (!auth.scopes.includes("write")) {
    return NextResponse.json(
      { success: false, error: "Forbidden. Write permission is required." },
      { status: 403 },
    );
  }

  try {
    const { title, content, excerpt, featuredImage, tags, postType, slug, seo } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: title and content are required." },
        { status: 400 },
      );
    }

    await dbConnect();
    const tenantOid = new mongoose.Types.ObjectId(auth.tenantId);

    // Auto-generate slug if not provided
    const resolvedSlug =
      slug ||
      title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

    // Uniqueness validation per tenant
    const existing = await Blog.findOne({ tenantId: tenantOid, slug: resolvedSlug });
    if (existing) {
      return NextResponse.json(
        { success: false, error: `Slug "${resolvedSlug}" already exists for this tenant.` },
        { status: 400 },
      );
    }

    const blog = new Blog({
      tenantId: tenantOid,
      title,
      content,
      excerpt,
      featuredImage,
      tags: tags || [],
      postType: postType || "blog",
      slug: resolvedSlug,
      seo: seo || {},
      published: false, // Default to draft for programmatic entry
    });

    await blog.save();

    return NextResponse.json({
      success: true,
      data: blog,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to create content" },
      { status: 500 },
    );
  }
}
