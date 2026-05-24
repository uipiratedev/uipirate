import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const hostname = req.headers.get("host") || "";

  // Match cos.uipirate.com or cos.localhost:3000
  const isCosSubdomain = hostname.startsWith("cos.") || hostname === "cos.uipirate.com";
  const isCosPath = url.pathname.startsWith("/pirateCOS") || url.pathname.startsWith("/api/pirateCOS");
  const isCos = isCosSubdomain || isCosPath;

  // Prepare custom headers to pass to downstream components
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", url.pathname);
  requestHeaders.set("x-is-cos", isCos ? "true" : "false");

  if (isCosSubdomain) {
    // Exclude Next.js system files, static files, and api routes from subdomain rewriting
    if (
      url.pathname.startsWith("/_next") ||
      url.pathname.startsWith("/api") ||
      url.pathname.startsWith("/static") ||
      url.pathname.includes(".")
    ) {
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }

    // Rewrite root to /pirateCOS
    if (url.pathname === "/") {
      url.pathname = "/pirateCOS";
      return NextResponse.rewrite(url, {
        request: {
          headers: requestHeaders,
        },
      });
    }

    // Rewrite `/dashboard` -> `/pirateCOS/dashboard`, etc.
    if (!url.pathname.startsWith("/pirateCOS")) {
      url.pathname = `/pirateCOS${url.pathname}`;
      return NextResponse.rewrite(url, {
        request: {
          headers: requestHeaders,
        },
      });
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
