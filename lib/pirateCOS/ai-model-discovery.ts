import { AIEngine, AIModelEntry, getModelsForEngine } from "./ai-registry";

type ModelSource = "live" | "fallback" | "mixed";

interface DiscoveryResult {
  models: AIModelEntry[];
  source: ModelSource;
  error?: string;
}

const CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const cache = new Map<string, { expiresAt: number; result: DiscoveryResult }>();

export function labelFromModelId(id: string): string {
  let cleanId = id.replace(/^models\//, "");

  // Strip date and revision suffixes from the label name to keep it clean for users
  // 1. 8-digit date snapshots (e.g. -20251101)
  cleanId = cleanId.replace(/[-_]?\b\d{8}\b/g, "");
  // 2. Hyphenated date snapshots (e.g. -2024-05-13)
  cleanId = cleanId.replace(/[-_]?\d{4}-\d{2}-\d{2}/g, "");
  // 3. 3-digit or 4-digit version snapshots (e.g. -001, -0613)
  cleanId = cleanId.replace(/[-_]?\d{3,4}(?:-|$)/g, "");

  // Clean trailing hyphens/spaces that might remain after stripping
  cleanId = cleanId.replace(/[-_]+$/g, "").replace(/^[-_]+/g, "");

  const lowerId = cleanId.toLowerCase();
  
  // Specific mappings for known production models
  if (lowerId === "gpt-4o") return "GPT-4o";
  if (lowerId === "gpt-4o-mini") return "GPT-4o Mini";
  if (lowerId === "gpt-3.5-turbo") return "GPT-3.5 Turbo";
  if (lowerId === "claude-3-5-sonnet-latest" || lowerId === "claude-3-5-sonnet") return "Claude 3.5 Sonnet";
  if (lowerId === "claude-3-5-haiku-latest" || lowerId === "claude-3-5-haiku") return "Claude 3.5 Haiku";
  if (lowerId === "claude-3-opus-latest" || lowerId === "claude-3-opus") return "Claude 3 Opus";
  if (lowerId === "gemini-1.5-flash-latest" || lowerId === "gemini-1.5-flash") return "Gemini 1.5 Flash";
  if (lowerId === "gemini-1.5-pro-latest" || lowerId === "gemini-1.5-pro") return "Gemini 1.5 Pro";
  if (lowerId === "gemini-2.0-flash-exp") return "Gemini 2.0 Flash (Preview)";
  if (lowerId === "mistral-large-latest") return "Mistral Large";
  if (lowerId === "mistral-small-latest") return "Mistral Small";
  if (lowerId === "mistral-nemo") return "Mistral Nemo";

  // Check if preview/experimental
  const isPreview = lowerId.endsWith("-exp") || lowerId.endsWith("-preview") || lowerId.includes("preview");
  
  // Check for Claude models with format: [claude-]?<family>-<v1>-<v2>... (e.g., claude-opus-4-8, opus-4-8, opus-4.8)
  const claudeFamilyFirstMatch = lowerId.match(/^(?:claude-)?(opus|haiku|sonnet)[-_]?(\d)[-_.]?(\d)(.*)$/);
  if (claudeFamilyFirstMatch) {
    const family = claudeFamilyFirstMatch[1];
    const major = claudeFamilyFirstMatch[2];
    const minor = claudeFamilyFirstMatch[3];
    let rest = claudeFamilyFirstMatch[4] || "";

    const capitalizedFamily = family.charAt(0).toUpperCase() + family.slice(1);

    // Clean rest (remove suffixes)
    rest = rest
      .replace(/-latest$/i, "")
      .replace(/-exp$/i, "")
      .replace(/-preview$/i, "");

    let restFormatted = "";
    if (rest) {
      restFormatted = rest
        .split(/[-_]/g)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
    }

    let label = `Claude ${major}.${minor} ${capitalizedFamily}`;
    if (restFormatted) {
      label += ` ${restFormatted}`;
    }

    if (isPreview) {
      label += " (Preview)";
    }
    return label;
  }

  // Clean cleanId by removing suffixes
  let workingId = cleanId
    .replace(/-latest$/i, "")
    .replace(/-exp$/i, "")
    .replace(/-preview$/i, "");

  // Format parts
  let formatted = workingId
    .split(/[-_]/g)
    .filter(Boolean)
    .map((part) => {
      const lower = part.toLowerCase();
      // If it contains a dot like "1.5", return as is
      if (lower.includes(".")) return part;
      if (lower === "gpt") return "GPT";
      if (lower === "seo") return "SEO";
      if (lower === "api") return "API";
      if (lower === "cta") return "CTA";
      
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(" ");

  // Normalize "3 5" to "3.5" for Claude/Gemini
  formatted = formatted.replace(/\b3\s+5\b/g, "3.5");

  // Standardize GPT hyphen styling (e.g. GPT 4.1 -> GPT-4.1)
  if (formatted.startsWith("GPT ")) {
    formatted = "GPT-" + formatted.slice(4);
  }

  if (isPreview) {
    formatted += " (Preview)";
  }

  return formatted;
}

export function isContentModel(id: string, engine: AIEngine): boolean {
  const lowercaseId = id.toLowerCase();
  
  // Generic exclusions (embeddings, moderation, audio, fine-tuning helpers, code-specific)
  if (
    lowercaseId.includes("embed") ||
    lowercaseId.includes("moderation") ||
    lowercaseId.includes("whisper") ||
    lowercaseId.includes("tts") ||
    lowercaseId.includes("dall-e") ||
    lowercaseId.includes("similarity") ||
    lowercaseId.includes("edit") ||
    lowercaseId.includes("audio") ||
    lowercaseId.includes("vision-preview") ||
    lowercaseId.includes("codestral") ||
    lowercaseId.includes("coder") ||
    lowercaseId.includes("dep") ||
    lowercaseId.includes("test") ||
    lowercaseId.startsWith("ft:") ||
    lowercaseId.includes("tunedmodel") ||
    lowercaseId.includes("realtime") ||
    lowercaseId.includes("image") ||
    lowercaseId.includes("robotics") ||
    lowercaseId.includes("customtool") ||
    lowercaseId.includes("transcribe") ||
    lowercaseId.includes("diarize") ||
    lowercaseId.includes("search") ||
    lowercaseId.includes("codex") ||
    lowercaseId.includes("nano") ||
    (lowercaseId.includes("instruct") && engine === "openai")
  ) {
    return false;
  }



  // Engine-specific inclusions
  if (engine === "openai") {
    // Only allow gpt, o1, or o3 models
    return lowercaseId.startsWith("gpt-") || lowercaseId.startsWith("o1-") || lowercaseId.startsWith("o3-");
  }

  if (engine === "gemini") {
    // Only allow gemini models
    return lowercaseId.startsWith("gemini-");
  }

  if (engine === "anthropic") {
    // Only allow claude models
    return lowercaseId.startsWith("claude-");
  }

  if (engine === "mistral") {
    // Keep mistral models, open-mixtral, open-mistral, etc.
    return (
      lowercaseId.includes("mistral") ||
      lowercaseId.includes("mixtral") ||
      lowercaseId.includes("pixtral")
    );
  }

  if (engine === "grok") {
    // Only allow grok models
    return lowercaseId.includes("grok");
  }

  return true;
}

function getFilteredFallback(engine: AIEngine): AIModelEntry[] {
  return getModelsForEngine(engine).filter((m) => isContentModel(m.id, engine));
}

interface VersionInfo {
  major: number;
  minor: number;
  dateVal: number;
  revisionVal: number;
}

function isBetterVersion(a: VersionInfo, b: VersionInfo): boolean {
  if (a.major !== b.major) return a.major > b.major;
  if (a.minor !== b.minor) return a.minor > b.minor;
  if (a.dateVal !== b.dateVal) return a.dateVal > b.dateVal;
  return a.revisionVal > b.revisionVal;
}

function parseModelForDeduplication(entry: AIModelEntry) {
  const label = entry.label;
  
  // Matches brand and major/minor version (e.g. Gemini 3.5 Flash, Claude 4.8 Opus, GPT-5.5 Pro)
  const match = label.match(/^(Claude|Gemini|GPT|Mistral|O3)[-\s]+(?:(\d+)(?:\.(\d+))?|4o)[-\s]*(.*)$/i);
  if (!match) {
    return {
      key: label,
      versionInfo: { major: 0, minor: 0, dateVal: 0, revisionVal: 0 },
      entry
    };
  }

  const brand = match[1].toUpperCase();
  const majorStr = match[2];
  const minorStr = match[3];
  const is4o = label.toLowerCase().includes("4o");
  
  const major = is4o ? 4 : (majorStr ? parseInt(majorStr, 10) : 0);
  const minor = minorStr ? parseInt(minorStr, 10) : 0;

  // Extract date snapshots (e.g. 20251101 or 2024-05-13) from original ID
  let dateVal = 0;
  const dateMatch8 = entry.id.match(/\b\d{8}\b/);
  if (dateMatch8) {
    dateVal = parseInt(dateMatch8[0], 10);
  } else {
    const dateMatchHyphen = entry.id.match(/-(\d{4})-(\d{2})-(\d{2})/);
    if (dateMatchHyphen) {
      dateVal = parseInt(dateMatchHyphen[1] + dateMatchHyphen[2] + dateMatchHyphen[3], 10);
    }
  }

  // Extract revision numbers (e.g. -001, -0613) from original ID
  let revisionVal = 0;
  const revMatch = entry.id.match(/-(\d{3,4})(?:-|$)/);
  if (revMatch) {
    revisionVal = parseInt(revMatch[1], 10);
  }

  const tier = (match[4] || "").trim().toUpperCase();
  
  // Group key: Brand + Major Version + Tier
  const key = `${brand}-${major}-${tier}`;
  
  return {
    key,
    versionInfo: { major, minor, dateVal, revisionVal },
    entry
  };
}

export function mergeWithFallback(
  engine: AIEngine,
  liveModelIds: string[],
): AIModelEntry[] {
  const fallback = getFilteredFallback(engine);
  const seen = new Set<string>();
  const merged: AIModelEntry[] = [];

  if (liveModelIds.length === 0) {
    for (const model of fallback) {
      seen.add(model.id);
      merged.push(model);
    }
  } else {
    const liveSet = new Set(liveModelIds);
    for (const model of fallback) {
      if (liveSet.has(model.id)) {
        seen.add(model.id);
        merged.push(model);
      }
    }
  }

  const liveEntries: AIModelEntry[] = [];
  for (const id of liveModelIds) {
    if (!id || seen.has(id) || !isContentModel(id, engine)) continue;
    liveEntries.push({
      id,
      label: labelFromModelId(id),
      provider: engine,
      description: "live",
    });
  }

  // Deduplicate live entries: keep only the latest minor version for each brand + major + tier
  const bestLiveModels = new Map<string, { versionInfo: VersionInfo; entry: AIModelEntry }>();
  for (const entry of liveEntries) {
    const parsed = parseModelForDeduplication(entry);
    const existing = bestLiveModels.get(parsed.key);
    if (!existing || isBetterVersion(parsed.versionInfo, existing.versionInfo)) {
      bestLiveModels.set(parsed.key, { versionInfo: parsed.versionInfo, entry });
    }
  }

  // Add the best live models to merged list
  bestLiveModels.forEach(({ entry }) => {
    seen.add(entry.id);
    merged.push(entry);
  });

  return merged;
}

async function fetchOpenAIModels(apiKey: string): Promise<string[]> {
  const res = await fetch("https://api.openai.com/v1/models", {
    headers: { Authorization: `Bearer ${apiKey}` },
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`OpenAI model fetch failed (${res.status})`);
  const data = await res.json();

  return Array.isArray(data?.data)
    ? data.data
        .map((model: any) => model?.id)
        .filter((id: unknown): id is string => typeof id === "string")
    : [];
}

async function fetchGeminiModels(apiKey: string): Promise<string[]> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`,
    { cache: "no-store" },
  );

  if (!res.ok) throw new Error(`Gemini model fetch failed (${res.status})`);
  const data = await res.json();

  return Array.isArray(data?.models)
    ? data.models
        .filter((model: any) =>
          Array.isArray(model?.supportedGenerationMethods)
            ? model.supportedGenerationMethods.includes("generateContent")
            : true,
        )
        .map((model: any) =>
          typeof model?.name === "string"
            ? model.name.replace(/^models\//, "")
            : undefined,
        )
        .filter((id: unknown): id is string => typeof id === "string")
    : [];
}

async function fetchMistralModels(apiKey: string): Promise<string[]> {
  const res = await fetch("https://api.mistral.ai/v1/models", {
    headers: { Authorization: `Bearer ${apiKey}` },
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`Mistral model fetch failed (${res.status})`);
  const data = await res.json();

  return Array.isArray(data?.data)
    ? data.data
        .map((model: any) => model?.id)
        .filter((id: unknown): id is string => typeof id === "string")
    : [];
}

async function fetchAnthropicModels(apiKey: string): Promise<string[]> {
  const res = await fetch("https://api.anthropic.com/v1/models", {
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`Claude model fetch failed (${res.status})`);
  const data = await res.json();

  return Array.isArray(data?.data)
    ? data.data
        .map((model: any) => model?.id)
        .filter((id: unknown): id is string => typeof id === "string")
    : [];
}

async function fetchGrokModels(apiKey: string): Promise<string[]> {
  const res = await fetch("https://api.x.ai/v1/models", {
    headers: { Authorization: `Bearer ${apiKey}` },
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`Grok model fetch failed (${res.status})`);
  const data = await res.json();

  return Array.isArray(data?.data)
    ? data.data
        .map((model: any) => model?.id)
        .filter((id: unknown): id is string => typeof id === "string")
    : [];
}

async function fetchOpenRouterModels(apiKey: string): Promise<string[]> {
  const res = await fetch("https://openrouter.ai/api/v1/models", {
    headers: { Authorization: `Bearer ${apiKey}` },
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`OpenRouter model fetch failed (${res.status})`);
  const data = await res.json();

  return Array.isArray(data?.data)
    ? data.data
        .map((model: any) => model?.id)
        .filter((id: unknown): id is string => typeof id === "string")
    : [];
}

export async function discoverAIModels({
  engine,
  apiKey,
  cacheKey,
  forceRefresh = false,
}: {
  engine: AIEngine;
  apiKey?: string;
  cacheKey: string;
  forceRefresh?: boolean;
}): Promise<DiscoveryResult> {
  const fallback = getFilteredFallback(engine);

  if (engine === "puter" || !apiKey) {
    return { models: fallback, source: "fallback" };
  }

  const now = Date.now();
  const cached = cache.get(cacheKey);

  if (cached && cached.expiresAt <= now) {
    cache.delete(cacheKey);
  }

  if (!forceRefresh && cached && cached.expiresAt > now) {
    return cached.result;
  }

  try {
    const liveIds =
      engine === "openai"
        ? await fetchOpenAIModels(apiKey)
        : engine === "gemini"
          ? await fetchGeminiModels(apiKey)
          : engine === "mistral"
            ? await fetchMistralModels(apiKey)
            : engine === "grok"
              ? await fetchGrokModels(apiKey)
              : engine === "openrouter"
                ? await fetchOpenRouterModels(apiKey)
                : await fetchAnthropicModels(apiKey);

    const result: DiscoveryResult = {
      models: mergeWithFallback(engine, liveIds),
      source: liveIds.length > 0 ? "mixed" : "fallback",
    };

    cache.set(cacheKey, { expiresAt: now + CACHE_TTL_MS, result });
    return result;
  } catch (error) {
    const result: DiscoveryResult = {
      models: fallback,
      source: "fallback",
      error: error instanceof Error ? error.message : "Model fetch failed",
    };

    cache.set(cacheKey, { expiresAt: now + 5 * 60 * 1000, result });
    return result;
  }
}
