import { createHash } from "crypto";

import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import dbConnect from "@/lib/mongodb";
import { rateLimitHeaders } from "@/lib/pirateCOS/api-rate-limiter";
import { corsHeaders, handleOptions } from "@/lib/pirateCOS/public/cors";
import { guard } from "@/lib/pirateCOS/public/guard";
import { apiError, apiSuccess } from "@/lib/pirateCOS/public/response";
import { serializePost } from "@/lib/pirateCOS/public/serialize-post";
import Post from "@/models/Post";

export function OPTIONS() {
  return handleOptions();
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const guarded = await guard(req);

  if (guarded instanceof Response) return guarded;
  const { auth, rate } = guarded;

  if (!slug) {
    return apiError("not_found", "Post not found or is not published.");
  }

  await dbConnect();
  const tenantOid = new mongoose.Types.ObjectId(auth.tenantId);

  try {
    const post = await Post.findOne({
      tenantId: tenantOid,
      slug: slug.toLowerCase().trim(),
      published: true,
    }).lean();

    if (!post) {
      return apiError("not_found", "Post not found or is not published.");
    }

    const data = serializePost(post);

    // ETag = hash of id + updatedAt. Lets live-render callers revalidate cheaply.
    const etag = `"${createHash("sha256")
      .update(`${data.id}:${data.updatedAt}`)
      .digest("hex")
      .substring(0, 32)}"`;

    const cacheHeaders = {
      ...rateLimitHeaders(rate),
      ETag: etag,
      "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
    };

    if (req.headers.get("If-None-Match") === etag) {
      return new NextResponse(null, {
        status: 304,
        headers: { ...corsHeaders(), ...cacheHeaders },
      });
    }

    return apiSuccess({ data }, cacheHeaders);
  } catch (err) {
    return apiError("internal_error", "Failed to fetch post detail.");
  }
}
