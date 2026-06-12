import {
  AIEngine,
  AI_ENGINE_IDS,
  isAIEngine,
  getProviderLabel,
  getDefaultModelForEngine,
} from "./ai-registry";

export type { AIEngine };
export { isAIEngine };

export type AIKeyMap = Partial<Record<Exclude<AIEngine, "puter">, string>>;

export const AI_ENGINE_ORDER: AIEngine[] = AI_ENGINE_IDS;

export const DEFAULT_MODEL_BY_ENGINE: Record<AIEngine, string> = {
  openai: getDefaultModelForEngine("openai"),
  gemini: getDefaultModelForEngine("gemini"),
  mistral: getDefaultModelForEngine("mistral"),
  anthropic: getDefaultModelForEngine("anthropic"),
  grok: getDefaultModelForEngine("grok"),
  openrouter: getDefaultModelForEngine("openrouter"),
  puter: getDefaultModelForEngine("puter"),
};

export function resolveAIEngine({
  requestedEngine,
  defaultEngine,
  keys,
}: {
  requestedEngine?: unknown;
  defaultEngine?: unknown;
  keys: AIKeyMap;
}): AIEngine {
  const candidates: AIEngine[] = [];

  if (isAIEngine(requestedEngine)) candidates.push(requestedEngine);
  if (isAIEngine(defaultEngine)) candidates.push(defaultEngine);
  candidates.push(...AI_ENGINE_ORDER);

  for (const engine of candidates) {
    if (engine === "puter" || keys[engine]) return engine;
  }

  return "puter";
}

export function getAIKeyForEngine(engine: AIEngine, keys: AIKeyMap) {
  return engine === "puter" ? undefined : keys[engine];
}

export function getAIEngineLabel(engine: AIEngine): string {
  return getProviderLabel(engine);
}
