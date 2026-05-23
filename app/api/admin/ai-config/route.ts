import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";

// GET /api/admin/ai-config
// Returns which AI providers have environment keys configured.
// Never exposes the actual key values.
export async function GET() {
  const user = await verifyAuth();
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    openai: !!process.env.OPENAI_API_KEY,
    gemini: !!process.env.GEMINI_API_KEY,
  });
}
