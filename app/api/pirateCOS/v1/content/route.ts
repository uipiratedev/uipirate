import { NextRequest } from "next/server";
import mongoose from "mongoose";

import dbConnect from "@/lib/mongodb";
import { rateLimitHeaders } from "@/lib/pirateCOS/api-rate-limiter";
import { handleOptions } from "@/lib/pirateCOS/public/cors";
import { guard } from "@/lib/pirateCOS/public/guard";
import { apiError, apiSuccess } from "@/lib/pirateCOS/public/response";
import { pickFields, serializePost } from "@/lib/pirateCOS/public/serialize-post";
import Post from "@/models/Post";

const SORT_MAP: Record<string, Record<string, 1 | -1>> = {
  publishedAt: { publishedAt: 1 },
  "-publishedAt": { publishedAt: -1 },
  updatedAt: { updatedAt: 1 },
  "-updatedAt": { updatedAt: -1 },
};

export function OPTIONS() {
  return handleOptions();
}

export async function GET(req: NextRequest) {
  const guarded = await guard(req);

  if (guarded instanceof Response) return guarded;
  const { auth, rate } = guarded;

  const { searchParams } = new URL(req.url);
  const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
  const limit = Math.min(
    Math.max(parseInt(searchParams.get("limit") || "10", 10), 1),
    100,
  );
  const tag = searchParams.get("tag");
  const postType = searchParams.get("postType");
  const updatedSince = searchParams.get("updatedSince");
  const fields = searchParams.get("fields");
  const sort = SORT_MAP[searchParams.get("sort") || "-publishedAt"] || {
    publishedAt: -1,
  };

  const skip = (page - 1) * limit;

  await dbConnect();
  const tenantOid = new mongoose.Types.ObjectId(auth.tenantId);

  // Tenant-isolated + published only. tenantId comes from the verified key,
  // never from the request.
  const query: Record<string, any> = {
    tenantId: tenantOid,
    published: true,
  };

  if (tag) query.tags = tag;
  if (postType) query.postType = postType;
  if (updatedSince) {
    const since = new Date(updatedSince);

    if (!isNaN(since.getTime())) {
      query.updatedAt = { $gt: since };
    }
  }

  try {
    const total = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    // Default list responses exclude the heavy `content` field; callers opt in
    // with `fields=content` (or any explicit field set).
    const effectiveFields = fields ?? "id,slug,title,excerpt,featuredImage,bannerImage,tags,postType,author,readTime,views,seo,publishedAt,updatedAt";

    const data = (posts as any[]).map((p) =>
      pickFields(serializePost(p), effectiveFields),
    );

    return apiSuccess(
      {
        data,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      {
        ...rateLimitHeaders(rate),
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
      },
    );
  } catch (err) {
    return apiError("internal_error", "Failed to fetch content.");
  }
}
