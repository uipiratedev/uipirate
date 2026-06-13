import { NextRequest, NextResponse } from "next/server";

import { verifyApiKey, ApiKeyAuthResult } from "../api-key-auth";
import {
  checkApiRateLimit,
  rateLimitHeaders,
  RateLimitResult,
} from "../api-rate-limiter";

import { apiError } from "./response";

export interface GuardResult {
  auth: ApiKeyAuthResult;
  rate: RateLimitResult;
}

/**
 * Shared gate for every public v1 route: verifies the API key and applies the
 * per-key rate limit. Returns a ready-to-send NextResponse on failure, or the
 * authenticated context (plus rate-limit state for header echoing) on success.
 *
 * All keys are read-only, so there is no scope check.
 */
export async function guard(
  req: NextRequest,
): Promise<GuardResult | NextResponse> {
  const auth = await verifyApiKey(req);

  if (!auth) {
    return apiError("unauthorized", "Invalid or missing API key.");
  }

  const rate = checkApiRateLimit(auth.apiKeyId);

  if (!rate.allowed) {
    return apiError(
      "rate_limited",
      "Rate limit exceeded. Slow down and retry shortly.",
      rateLimitHeaders(rate),
    );
  }

  return { auth, rate };
}
