import { NextRequest, NextResponse } from "next/server";

import { optimizeSvg, svgToJsx, type OptimizeOptions, type JsxOptions } from "@/lib/svgOptimizer";
import { rateLimit } from "@/lib/rateLimit";
import { extractIp } from "@/lib/analytics/ip";

// This runs SVG parsing (cheerio) server-side on purpose: cheerio pulls in
// a real HTML/XML parser and its dependency tree, which is fine in a Node
// API route but would otherwise get bundled into client-side JavaScript if
// a "use client" component imported lib/svgOptimizer.ts directly - every
// other cheerio-based lib in this codebase (dashboardAudit, readability,
// onboardingAudit) is likewise only ever imported from an API route.
const MAX_INPUT_BYTES = 2 * 1024 * 1024; // 2MB - generous for even large illustrations

interface RequestBody {
  svg?: string;
  options?: Partial<OptimizeOptions>;
  jsx?: Partial<JsxOptions>;
}

export async function POST(req: NextRequest) {
  const ip = extractIp(req.headers);
  const limit = rateLimit(`svg-optimize:${ip}`, 90, 60_000);

  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down and try again shortly." },
      { status: 429 },
    );
  }

  let body: RequestBody;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const svg = body.svg;

  if (typeof svg !== "string" || svg.trim().length === 0) {
    return NextResponse.json({ error: "Missing svg" }, { status: 400 });
  }

  if (new TextEncoder().encode(svg).length > MAX_INPUT_BYTES) {
    return NextResponse.json({ error: "SVG input is too large (2MB max)" }, { status: 413 });
  }

  try {
    const optimized = optimizeSvg(svg, body.options ?? {});
    const jsx = svgToJsx(optimized.output, body.jsx ?? {});

    return NextResponse.json({ optimized, jsx });
  } catch {
    return NextResponse.json(
      { error: "Couldn't parse this as SVG/XML - check the markup is well-formed." },
      { status: 400 },
    );
  }
}
