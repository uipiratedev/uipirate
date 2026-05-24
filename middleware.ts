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

  // 1. For subdomain mode: redirect /admin/posts -> /posts, /admin -> /
  if (isCosSubdomain && url.pathname.startsWith("/admin")) {
    const strippedPath = url.pathname.replace(/^\/admin/, "");
    url.pathname = strippedPath || "/";
    return NextResponse.redirect(url);
  }

  // 2. For path mode fallback: redirect /admin/posts -> /pirateCOS/posts
  if (!isCosSubdomain && url.pathname.startsWith("/admin")) {
    const namespacedPath = url.pathname.replace(/^\/admin/, "/pirateCOS");
    url.pathname = namespacedPath || "/pirateCOS";
    return NextResponse.redirect(url);
  }

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
