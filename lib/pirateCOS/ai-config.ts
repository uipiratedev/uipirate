import mongoose from "mongoose";

import dbConnect from "@/lib/mongodb";
import AIConfig from "@/models/pirateCOS/AIConfig";
import { decrypt } from "@/lib/pirateCOS/encrypt";

export async function getDecryptedKeys(tenantId: string): Promise<{
  openai?: string;
  gemini?: string;
  mistral?: string;
  anthropic?: string;
  grok?: string;
  defaultEngine: string;
  defaultModel: string;
}> {
  await dbConnect();
  // Cast to ObjectId explicitly — bypasses stale schema cache in dev hot-reload
  const cfg = await AIConfig.findOne({
    tenantId: new mongoose.Types.ObjectId(tenantId),
  }).lean();

  if (!cfg) return { defaultEngine: "puter", defaultModel: "gpt-4o-mini" };

  let openai: string | undefined;
  let gemini: string | undefined;
  let mistral: string | undefined;
  let anthropic: string | undefined;
  let grok: string | undefined;

  try {
    if (cfg.openaiKeyEncrypted) openai = decrypt(cfg.openaiKeyEncrypted);
  } catch {}
  try {
    if (cfg.geminiKeyEncrypted) gemini = decrypt(cfg.geminiKeyEncrypted);
  } catch {}
  try {
    if (cfg.mistralKeyEncrypted) mistral = decrypt(cfg.mistralKeyEncrypted);
  } catch {}
  try {
    if (cfg.anthropicKeyEncrypted)
      anthropic = decrypt(cfg.anthropicKeyEncrypted);
  } catch {}
  try {
    if (cfg.grokKeyEncrypted) grok = decrypt(cfg.grokKeyEncrypted);
  } catch {}

  return {
    openai,
    gemini,
    mistral,
    anthropic,
    grok,
    defaultEngine: cfg.defaultEngine ?? "puter",
    defaultModel: cfg.defaultModel ?? "gpt-4o-mini",
  };
}
