import dbConnect from "@/lib/mongodb";
import AIConfig from "@/models/AIConfig";
import { decrypt } from "@/lib/encrypt";

export async function getDecryptedKeys(): Promise<{
  openai?: string;
  gemini?: string;
  mistral?: string;
  defaultEngine: string;
  defaultModel: string;
}> {
  await dbConnect();
  const cfg = await AIConfig.findOne().lean();

  if (!cfg) return { defaultEngine: "puter", defaultModel: "gpt-4o-mini" };

  let openai: string | undefined;
  let gemini: string | undefined;
  let mistral: string | undefined;

  try {
    if (cfg.openaiKeyEncrypted) openai = decrypt(cfg.openaiKeyEncrypted);
  } catch {}
  try {
    if (cfg.geminiKeyEncrypted) gemini = decrypt(cfg.geminiKeyEncrypted);
  } catch {}
  try {
    if (cfg.mistralKeyEncrypted) mistral = decrypt(cfg.mistralKeyEncrypted);
  } catch {}

  return {
    openai,
    gemini,
    mistral,
    defaultEngine: cfg.defaultEngine ?? "puter",
    defaultModel: cfg.defaultModel ?? "gpt-4o-mini",
  };
}
