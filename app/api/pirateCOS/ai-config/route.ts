import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { verifyAuth } from "@/lib/pirateCOS/auth";
import { checkRole } from "@/lib/pirateCOS/require-role";
import { audit } from "@/lib/pirateCOS/audit";
import { encrypt } from "@/lib/pirateCOS/encrypt";
import dbConnect from "@/lib/mongodb";
import AIConfig from "@/models/pirateCOS/AIConfig";
import Admin from "@/models/pirateCOS/Admin";

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

  const denied = checkRole(user, ["org-admin", "admin", "editor"]);
  if (denied) return denied;

  await dbConnect();
  const tenantOid = new mongoose.Types.ObjectId(user.tenantId);
  const cfg = await AIConfig.findOne({ tenantId: tenantOid }).lean();
  const admin = await Admin.findById(user.tenantId).lean();

  const openaiEnv = !!process.env.OPENAI_API_KEY;
  const geminiEnv = !!process.env.GEMINI_API_KEY;
  const mistralEnv = !!process.env.MISTRAL_API_KEY;
  const anthropicEnv = !!process.env.ANTHROPIC_API_KEY;
  const grokEnv = !!(process.env.XAI_API_KEY || process.env.GROK_API_KEY);
  const openrouterEnv = !!process.env.OPENROUTER_API_KEY;
  const openaiDb = !!cfg?.openaiKeyEncrypted;
  const geminiDb = !!cfg?.geminiKeyEncrypted;
  const mistralDb = !!cfg?.mistralKeyEncrypted;
  const anthropicDb = !!cfg?.anthropicKeyEncrypted;
  const grokDb = !!cfg?.grokKeyEncrypted;
  const openrouterDb = !!cfg?.openrouterKeyEncrypted;

  return NextResponse.json({
    success: true,
    plan: admin?.plan ?? "free",
    openai: openaiEnv || openaiDb,
    gemini: geminiEnv || geminiDb,
    mistral: mistralEnv || mistralDb,
    anthropic: anthropicEnv || anthropicDb,
    grok: grokEnv || grokDb,
    openrouter: openrouterEnv || openrouterDb,
    openaiSource: openaiEnv ? "env" : openaiDb ? "db" : null,
    geminiSource: geminiEnv ? "env" : geminiDb ? "db" : null,
    mistralSource: mistralEnv ? "env" : mistralDb ? "db" : null,
    anthropicSource: anthropicEnv ? "env" : anthropicDb ? "db" : null,
    grokSource: grokEnv ? "env" : grokDb ? "db" : null,
    openrouterSource: openrouterEnv ? "env" : openrouterDb ? "db" : null,
    openaiEnabled: cfg ? (cfg.openaiEnabled ?? true) : true,
    geminiEnabled: cfg ? (cfg.geminiEnabled ?? true) : true,
    mistralEnabled: cfg ? (cfg.mistralEnabled ?? true) : true,
    anthropicEnabled: cfg ? (cfg.anthropicEnabled ?? true) : true,
    grokEnabled: cfg ? (cfg.grokEnabled ?? true) : true,
    openrouterEnabled: cfg ? (cfg.openrouterEnabled ?? true) : true,
    puterEnabled: cfg ? (cfg.puterEnabled ?? true) : true,
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

  const denied = checkRole(user, ["org-admin", "admin"]);
  if (denied) return denied;

  const {
    openaiKey,
    geminiKey,
    mistralKey,
    anthropicKey,
    grokKey,
    openrouterKey,
    defaultEngine,
    defaultModel,
    openaiEnabled,
    geminiEnabled,
    mistralEnabled,
    anthropicEnabled,
    grokEnabled,
    openrouterEnabled,
    puterEnabled,
  } = await req.json();

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
  if (typeof anthropicKey === "string") {
    cfg.anthropicKeyEncrypted = anthropicKey.trim()
      ? encrypt(anthropicKey.trim())
      : undefined;
  }
  if (typeof grokKey === "string") {
    cfg.grokKeyEncrypted = grokKey.trim()
      ? encrypt(grokKey.trim())
      : undefined;
  }
  if (typeof openrouterKey === "string") {
    cfg.openrouterKeyEncrypted = openrouterKey.trim()
      ? encrypt(openrouterKey.trim())
      : undefined;
  }
  if (defaultEngine) cfg.defaultEngine = defaultEngine;
  if (defaultModel) cfg.defaultModel = defaultModel;

  if (typeof openaiEnabled === "boolean") cfg.openaiEnabled = openaiEnabled;
  if (typeof geminiEnabled === "boolean") cfg.geminiEnabled = geminiEnabled;
  if (typeof mistralEnabled === "boolean") cfg.mistralEnabled = mistralEnabled;
  if (typeof anthropicEnabled === "boolean") cfg.anthropicEnabled = anthropicEnabled;
  if (typeof grokEnabled === "boolean") cfg.grokEnabled = grokEnabled;
  if (typeof openrouterEnabled === "boolean") cfg.openrouterEnabled = openrouterEnabled;
  if (typeof puterEnabled === "boolean") cfg.puterEnabled = puterEnabled;

  await cfg.save();
  await audit(user, "ai_config.update", { meta: { defaultEngine, defaultModel } });

  return NextResponse.json({ success: true });
}
