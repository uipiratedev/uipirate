export type AIEngine = "openai" | "gemini" | "mistral" | "anthropic" | "puter" | "grok";
export type AIKeyProvider = Exclude<AIEngine, "puter">;

export interface AIProviderEntry {
  id: AIEngine;
  name: string;
  shortName: string;
  logo: string;
  color: string;
  badgeColor: string;
  requiresKey: boolean;
  keyPlaceholder?: string;
  keyDescription?: string;
  keyLink?: string;
  keyLinkLabel?: string;
  sourceColors?: {
    bg: string;
    border: string;
    dot: string;
    text: string;
  };
}

export interface AIModelEntry {
  id: string;
  label: string;
  description?: string;
  provider: AIEngine;
  isDefault?: boolean;
}

export const AI_PROVIDERS: AIProviderEntry[] = [
  {
    id: "openai",
    name: "OpenAI",
    shortName: "GPT",
    logo: "/assets/logos/ai/openai.svg",
    color: "#10B981",
    badgeColor: "emerald",
    requiresKey: true,
    keyPlaceholder: "sk-...",
    keyDescription: "Used for GPT-4o, GPT-5 and newer OpenAI models.",
    keyLink: "https://platform.openai.com/api-keys",
    keyLinkLabel: "platform.openai.com/api-keys",
    sourceColors: {
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      dot: "bg-emerald-400",
      text: "text-emerald-700",
    },
  },
  {
    id: "gemini",
    name: "Google Gemini",
    shortName: "Gemini",
    logo: "/assets/logos/ai/google-gemini-icon.svg",
    color: "#3B82F6",
    badgeColor: "blue",
    requiresKey: true,
    keyPlaceholder: "AIza...",
    keyDescription: "Used for Gemini 1.5 Flash, Pro and 2.0 models.",
    keyLink: "https://aistudio.google.com/app/apikey",
    keyLinkLabel: "aistudio.google.com/app/apikey",
    sourceColors: {
      bg: "bg-blue-50",
      border: "border-blue-100",
      dot: "bg-blue-400",
      text: "text-blue-700",
    },
  },
  {
    id: "anthropic",
    name: "Anthropic Claude",
    shortName: "Claude",
    logo: "/assets/logos/ai/claude-ai-icon.svg",
    color: "#C026D3",
    badgeColor: "fuchsia",
    requiresKey: true,
    keyPlaceholder: "sk-ant-...",
    keyDescription: "Used for Claude Sonnet, Haiku and Opus models.",
    keyLink: "https://console.anthropic.com/settings/keys",
    keyLinkLabel: "console.anthropic.com/settings/keys",
    sourceColors: {
      bg: "bg-fuchsia-50",
      border: "border-fuchsia-100",
      dot: "bg-fuchsia-400",
      text: "text-fuchsia-700",
    },
  },
  {
    id: "mistral",
    name: "Mistral AI",
    shortName: "Mistral",
    logo: "/assets/logos/ai/mistral-ai-icon.svg",
    color: "#7C3AED",
    badgeColor: "violet",
    requiresKey: true,
    keyPlaceholder: "e.g. your Mistral API key",
    keyDescription: "Used for Mistral Large, Small, Nemo and Codestral.",
    keyLink: "https://console.mistral.ai/api-keys",
    keyLinkLabel: "console.mistral.ai/api-keys",
    sourceColors: {
      bg: "bg-violet-50",
      border: "border-violet-100",
      dot: "bg-violet-400",
      text: "text-violet-700",
    },
  },
  {
    id: "puter",
    name: "Puter AI",
    shortName: "Puter",
    logo: "/assets/logos/ai/puter.svg",
    color: "#FF5B04",
    badgeColor: "orange",
    requiresKey: false,
  },
  {
    id: "grok",
    name: "xAI Grok",
    shortName: "Grok",
    logo: "/assets/logos/ai/xai-grok.svg",
    color: "#000000",
    badgeColor: "gray",
    requiresKey: true,
    keyPlaceholder: "xai-...",
    keyDescription: "Used for Grok 2 and Grok Beta models.",
    keyLink: "https://console.x.ai/",
    keyLinkLabel: "console.x.ai",
    sourceColors: {
      bg: "bg-gray-50",
      border: "border-gray-100",
      dot: "bg-gray-400",
      text: "text-gray-700",
    },
  },
];

export const AI_ENGINE_IDS: AIEngine[] = [
  "openai",
  "gemini",
  "anthropic",
  "mistral",
  "grok",
  "puter",
];

export const AI_MODELS: AIModelEntry[] = [
  // OpenAI Models
  { id: "gpt-4o-mini", label: "GPT-4o Mini", description: "fast", provider: "openai", isDefault: true },
  { id: "gpt-4o", label: "GPT-4o", provider: "openai" },
  { id: "gpt-5.5", label: "GPT-5.5", provider: "openai" },
  { id: "gpt-5.4", label: "GPT-5.4", provider: "openai" },
  { id: "gpt-5.4-mini", label: "GPT-5.4 Mini", provider: "openai" },

  // Gemini Models
  { id: "gemini-flash-latest", label: "Gemini 1.5 Flash", description: "fast", provider: "gemini", isDefault: true },
  { id: "gemini-1.5-pro-latest", label: "Gemini 1.5 Pro", provider: "gemini" },
  { id: "gemini-2.0-flash-exp", label: "Gemini 2.0 Flash", provider: "gemini" },

  // Mistral Models
  { id: "mistral-large-latest", label: "Mistral Large", description: "capable", provider: "mistral", isDefault: true },
  { id: "mistral-small-latest", label: "Mistral Small", description: "fast", provider: "mistral" },
  { id: "mistral-nemo", label: "Mistral Nemo", provider: "mistral" },
  { id: "codestral-latest", label: "Codestral", provider: "mistral" },

  // Anthropic Models
  { id: "claude-3-5-sonnet-latest", label: "Claude 3.5 Sonnet", provider: "anthropic", isDefault: true },
  { id: "claude-3-5-haiku-latest", label: "Claude 3.5 Haiku", provider: "anthropic" },
  { id: "claude-3-opus-latest", label: "Claude 3 Opus", provider: "anthropic" },

  // Grok Models
  { id: "grok-2-1212", label: "Grok 2", description: "capable", provider: "grok", isDefault: true },
  { id: "grok-beta", label: "Grok Beta", provider: "grok" },

  // Puter Models
  { id: "gpt-4o-mini", label: "GPT-4o Mini", description: "fast", provider: "puter", isDefault: true },
  { id: "gpt-4o", label: "GPT-4o", provider: "puter" },
  { id: "claude-3-5-sonnet", label: "Claude 3.5 Sonnet", provider: "puter" },
  { id: "claude-3-opus", label: "Claude 3 Opus", provider: "puter" },
  { id: "gemini-1.5-flash", label: "Gemini 1.5 Flash", provider: "puter" },
  { id: "gemini-1.5-pro", label: "Gemini 1.5 Pro", provider: "puter" },
  { id: "deepseek-chat", label: "DeepSeek Chat", provider: "puter" },
  { id: "grok-beta", label: "Grok Beta", provider: "puter" },
  { id: "mistral-large", label: "Mistral Large", provider: "puter" },
  { id: "gpt-5.5", label: "GPT-5.5", provider: "puter" },
  { id: "gpt-5.4", label: "GPT-5.4", provider: "puter" },
  { id: "gpt-5.4-mini", label: "GPT-5.4 Mini", provider: "puter" },
];

export function getProvider(id: AIEngine): AIProviderEntry | undefined {
  return AI_PROVIDERS.find((p) => p.id === id);
}

export function getModelsForEngine(engine: AIEngine): AIModelEntry[] {
  return AI_MODELS.filter((m) => m.provider === engine);
}

export function getDefaultModelForEngine(engine: AIEngine): string {
  const model = AI_MODELS.find((m) => m.provider === engine && m.isDefault);
  return model ? model.id : "gpt-4o-mini";
}

export function getProviderLabel(engine: AIEngine): string {
  const provider = getProvider(engine);
  return provider ? provider.name : "Puter";
}

export function getProviderLogo(engine: AIEngine): string {
  const provider = getProvider(engine);
  return provider ? provider.logo : "/assets/logos/ai/puter.svg";
}

export function isAIEngine(value: unknown): value is AIEngine {
  return typeof value === "string" && AI_ENGINE_IDS.includes(value as AIEngine);
}
