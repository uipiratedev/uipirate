import { NextRequest } from "next/server";

import { rateLimitHeaders } from "@/lib/pirateCOS/api-rate-limiter";
import { handleOptions } from "@/lib/pirateCOS/public/cors";
import { guard } from "@/lib/pirateCOS/public/guard";
import { apiSuccess } from "@/lib/pirateCOS/public/response";

export function OPTIONS() {
  return handleOptions();
}

/**
 * Debugging endpoint: echoes the authenticated key's tenant + name and the
 * current rate-limit budget (also present in the X-RateLimit-* headers).
 */
export async function GET(req: NextRequest) {
  const guarded = await guard(req);

  if (guarded instanceof Response) return guarded;
  const { auth, rate } = guarded;

  return apiSuccess(
    {
      data: {
        tenantId: auth.tenantId,
        keyName: auth.name,
        scopes: auth.scopes,
        rateLimit: {
          limit: rate.limit,
          remaining: rate.remaining,
          reset: rate.reset,
        },
      },
    },
    rateLimitHeaders(rate),
  );
}
