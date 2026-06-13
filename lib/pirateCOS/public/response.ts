import { NextResponse } from "next/server";

import { corsHeaders } from "./cors";

/**
 * Machine-readable error codes for the public v1 API.
 * Consumers/SDKs branch on `error.code`, never on the human message.
 * See PIRATECOS_PUBLIC_API_INTEGRATION_PLAN.md §5.5.
 */
export type ApiErrorCode =
  | "unauthorized"
  | "not_found"
  | "rate_limited"
  | "internal_error";

const STATUS: Record<ApiErrorCode, number> = {
  unauthorized: 401,
  not_found: 404,
  rate_limited: 429,
  internal_error: 500,
};

/** Standard `{ success:false, error:{ code, message } }` response, CORS-enabled. */
export function apiError(
  code: ApiErrorCode,
  message: string,
  extraHeaders?: Record<string, string>,
): NextResponse {
  return NextResponse.json(
    { success: false, error: { code, message } },
    { status: STATUS[code], headers: { ...corsHeaders(), ...extraHeaders } },
  );
}

/** Standard success envelope `{ success:true, ...payload }`, CORS-enabled. */
export function apiSuccess(
  payload: Record<string, unknown>,
  extraHeaders?: Record<string, string>,
  status = 200,
): NextResponse {
  return NextResponse.json(
    { success: true, ...payload },
    { status, headers: { ...corsHeaders(), ...extraHeaders } },
  );
}
