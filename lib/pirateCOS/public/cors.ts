import { NextResponse } from "next/server";

/**
 * CORS for the public v1 API.
 *
 * The API is read-only and every post it serves is already published
 * (intentionally public), so there is no per-key origin allowlist — a simple
 * wildcard is correct. See PIRATECOS_PUBLIC_API_INTEGRATION_PLAN.md §5.4.
 */
export function corsHeaders(): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type, If-None-Match",
    "Access-Control-Max-Age": "86400",
  };
}

/** Shared OPTIONS preflight handler for v1 routes. */
export function handleOptions(): NextResponse {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}
