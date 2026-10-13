import { NextResponse } from "next/server";

import { verifyAuth } from "@/lib/cometCOS/auth";
import { trackView } from "@/lib/trackView";

export const dynamic = "force-dynamic";

/**
 * Records a blog view. Called from the client after the page loads so the
 * blog page itself stays statically cached (ISR) instead of being forced
 * dynamic by reading request headers.
 */
export async function POST(req: Request) {
  try {
    const { slug } = await req.json();

    if (typeof slug !== "string" || !slug || slug.length > 200) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const user = await verifyAuth();

    await trackView(slug, req.headers as any, !!user);
  } catch {
    // never surface tracking errors
  }

  return NextResponse.json({ ok: true });
}
