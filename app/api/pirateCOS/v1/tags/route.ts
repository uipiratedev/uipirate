import { NextRequest } from "next/server";
import mongoose from "mongoose";

import dbConnect from "@/lib/mongodb";
import { rateLimitHeaders } from "@/lib/pirateCOS/api-rate-limiter";
import { handleOptions } from "@/lib/pirateCOS/public/cors";
import { guard } from "@/lib/pirateCOS/public/guard";
import { apiError, apiSuccess } from "@/lib/pirateCOS/public/response";
import Post from "@/models/Post";

export function OPTIONS() {
  return handleOptions();
}

export async function GET(req: NextRequest) {
  const guarded = await guard(req);

  if (guarded instanceof Response) return guarded;
  const { auth, rate } = guarded;

  await dbConnect();
  const tenantOid = new mongoose.Types.ObjectId(auth.tenantId);

  try {
    const rows = await Post.aggregate<{ _id: string; count: number }>([
      { $match: { tenantId: tenantOid, published: true } },
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } },
    ]);

    const data = rows
      .filter((r) => r._id)
      .map((r) => ({ tag: r._id, count: r.count }));

    return apiSuccess(
      { data },
      {
        ...rateLimitHeaders(rate),
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
      },
    );
  } catch (err) {
    return apiError("internal_error", "Failed to fetch tags.");
  }
}
