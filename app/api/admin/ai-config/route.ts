import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { verifyAuth } from "@/lib/auth";
import { encrypt, decrypt } from "@/lib/encrypt";
import dbConnect from "@/lib/mongodb";
import AIConfig from "@/models/AIConfig";

// GET /api/admin/ai-config
// Returns which AI providers have keys (env or DB) and current defaults.
// Never exposes actual key values.
export async function GET() {
  const user = await verifyAuth();

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  await dbConnect();
  const tenantOid = new mongoose.Types.ObjectId(user.tenantId);
  const cfg = await AIConfig.findOne({ tenantId: tenantOid }).lean();

  const openaiEnv = !!process.env.OPENAI_API_KEY;
  const geminiEnv = !!process.env.GEMINI_API_KEY;
  const mistralEnv = !!process.env.MISTRAL_API_KEY;
  const openaiDb = !!cfg?.openaiKeyEncrypted;
  const geminiDb = !!cfg?.geminiKeyEncrypted;
  const mistralDb = !!cfg?.mistralKeyEncrypted;

  return NextResponse.json({
    success: true,
    openai: openaiEnv || openaiDb,
    gemini: geminiEnv || geminiDb,
    mistral: mistralEnv || mistralDb,
    openaiSource: openaiEnv ? "env" : openaiDb ? "db" : null,
    geminiSource: geminiEnv ? "env" : geminiDb ? "db" : null,
    mistralSource: mistralEnv ? "env" : mistralDb ? "db" : null,
    defaultEngine: cfg?.defaultEngine ?? "puter",
    defaultModel: cfg?.defaultModel ?? "gpt-4o-mini",
  });
}

// POST /api/admin/ai-config
// Saves API keys (encrypted) and defaults to DB.
// Send null/empty string for a key to clear it.
export async function POST(req: NextRequest) {
  const user = await verifyAuth();

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const { openaiKey, geminiKey, mistralKey, defaultEngine, defaultModel } =
    await req.json();

  if (!process.env.AI_ENCRYPTION_KEY) {
    return NextResponse.json(
      {
        success: false,
        error:
          "AI_ENCRYPTION_KEY is not configured on the server. Add it to your .env.local file.",
      },
      { status: 500 },
    );
  }

  await dbConnect();
  const postTenantOid = new mongoose.Types.ObjectId(user.tenantId);
  const cfg =
    (await AIConfig.findOne({ tenantId: postTenantOid })) ??
    new AIConfig({ tenantId: postTenantOid });

  if (typeof openaiKey === "string") {
    cfg.openaiKeyEncrypted = openaiKey.trim()
      ? encrypt(openaiKey.trim())
      : undefined;
  }
  if (typeof geminiKey === "string") {
    cfg.geminiKeyEncrypted = geminiKey.trim()
      ? encrypt(geminiKey.trim())
      : undefined;
  }
  if (typeof mistralKey === "string") {
    cfg.mistralKeyEncrypted = mistralKey.trim()
      ? encrypt(mistralKey.trim())
      : undefined;
  }
  if (defaultEngine) cfg.defaultEngine = defaultEngine;
  if (defaultModel) cfg.defaultModel = defaultModel;

  await cfg.save();

  return NextResponse.json({ success: true });
}
