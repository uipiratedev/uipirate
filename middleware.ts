import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // Prepare custom headers to pass to downstream components
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", url.pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
