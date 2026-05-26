export type AIEngine = "openai" | "gemini" | "mistral" | "anthropic" | "puter";

export type AIKeyMap = Partial<Record<Exclude<AIEngine, "puter">, string>>;

export const AI_ENGINE_ORDER: AIEngine[] = [
  "openai",
  "gemini",
  "anthropic",
  "mistral",
  "puter",
];

export const DEFAULT_MODEL_BY_ENGINE: Record<AIEngine, string> = {
  openai: "gpt-4o-mini",
  gemini: "gemini-flash-latest",
  mistral: "mistral-large-latest",
  anthropic: "claude-3-5-sonnet-latest",
  puter: "gpt-4o-mini",
};

export function isAIEngine(value: unknown): value is AIEngine {
  return (
    value === "openai" ||
    value === "gemini" ||
    value === "mistral" ||
    value === "anthropic" ||
    value === "puter"
  );
}

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

export function getAIEngineLabel(engine: AIEngine) {
  if (engine === "openai") return "OpenAI";
  if (engine === "gemini") return "Gemini";
  if (engine === "mistral") return "Mistral";
  if (engine === "anthropic") return "Claude";
  return "Puter";
}
