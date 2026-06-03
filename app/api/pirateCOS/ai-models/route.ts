import { NextRequest, NextResponse } from "next/server";

import { discoverAIModels } from "@/lib/pirateCOS/ai-model-discovery";
import { getDecryptedKeys } from "@/lib/pirateCOS/ai-config";
import { isAIEngine, type AIEngine } from "@/lib/pirateCOS/ai-registry";
import { verifyAuth } from "@/lib/pirateCOS/auth";

function getEnvKey(engine: AIEngine): string | undefined {
  if (engine === "openai") return process.env.OPENAI_API_KEY;
  if (engine === "gemini") return process.env.GEMINI_API_KEY;
  if (engine === "mistral") return process.env.MISTRAL_API_KEY;
  if (engine === "anthropic") return process.env.ANTHROPIC_API_KEY;
  return undefined;
}

// GET /api/pirateCOS/ai-models?engine=openai
// Returns live provider models when the tenant/env key supports discovery,
// otherwise falls back to the local static model registry.
export async function GET(req: NextRequest) {
  const user = await verifyAuth();

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const { searchParams } = new URL(req.url);
  const engineParam = searchParams.get("engine");
  const forceRefresh = searchParams.get("refresh") === "1";

  if (!isAIEngine(engineParam)) {
    return NextResponse.json(
      { success: false, error: "Invalid AI engine" },
      { status: 400 },
    );
  }

  const keys = await getDecryptedKeys(user.tenantId);
  const apiKey = engineParam === "puter" ? undefined : keys[engineParam] || getEnvKey(engineParam);
  const result = await discoverAIModels({
    engine: engineParam,
    apiKey,
    cacheKey: `${user.tenantId}:${engineParam}:${apiKey ? "keyed" : "fallback"}`,
    forceRefresh,
  });

  return NextResponse.json({
    success: true,
    engine: engineParam,
    ...result,
  });
}
