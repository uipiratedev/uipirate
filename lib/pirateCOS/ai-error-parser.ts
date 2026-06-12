import { AIEngine } from "./ai-registry";

/**
 * Parses raw error status codes and response bodies from different AI providers
 * into clean, human-readable, and consistent user-facing error messages.
 */
export function parseAIError(engine: AIEngine | string, status: number, errText: string): string {
  let engineLabel = "AI";
  if (engine === "openai") engineLabel = "OpenAI";
  else if (engine === "mistral") engineLabel = "Mistral";
  else if (engine === "anthropic") engineLabel = "Claude";
  else if (engine === "gemini") engineLabel = "Gemini";
  else if (engine === "grok") engineLabel = "Grok";
  else if (engine === "openrouter") engineLabel = "OpenRouter";

  let friendlyMessage = `${engineLabel} API error (${status})`;

  try {
    console.error(`[parseAIError] Raw error text from ${engineLabel}:`, errText);
    const errJson = JSON.parse(errText);

    if (
      engine === "openai" ||
      engine === "mistral" ||
      engine === "grok" ||
      engine === "openrouter"
    ) {
      const code = errJson?.error?.code || errJson?.error?.type || errJson?.code || "";
      let msg = "";
      if (errJson?.error && typeof errJson.error === "string") {
        msg = errJson.error;
      } else {
        msg = errJson?.error?.message || errJson?.message || errJson?.detail || "";
      }

      if (code === "insufficient_quota" || msg.toLowerCase().includes("quota") || status === 402) {
        const billingUrl = engine === "mistral" ? "console.mistral.ai" : "platform.openai.com";
        friendlyMessage = `Your ${engineLabel} account has exceeded its quota. Please check your billing at ${billingUrl}.`;
      } else if (code === "rate_limit_exceeded" || status === 429) {
        friendlyMessage = `${engineLabel} rate limit reached. Please wait a moment and try again.`;
      } else if (code === "invalid_api_key" || status === 401) {
        friendlyMessage = `Invalid ${engineLabel} API key. Please update it in AI Config settings.`;
      } else if (msg) {
        friendlyMessage = msg;
      }
    } else if (engine === "anthropic") {
      const type = errJson?.error?.type || errJson?.type || "";
      const msg = errJson?.error?.message || errJson?.message || errJson?.detail || "";

      if (type === "authentication_error" || status === 401) {
        friendlyMessage = "Invalid Anthropic API key. Please update it in AI Config settings.";
      } else if (status === 429 || type === "rate_limit_error") {
        friendlyMessage = "Claude rate limit reached. Please wait a moment and try again.";
      } else if (type === "overloaded_error") {
        friendlyMessage = "Claude is overloaded right now. Please try again in a moment.";
      } else if (msg) {
        friendlyMessage = msg;
      }
    } else if (engine === "gemini") {
      const apiStatus = errJson?.error?.status || errJson?.status || "";
      const msg = errJson?.error?.message || errJson?.message || errJson?.detail || "";

      if (apiStatus === "RESOURCE_EXHAUSTED" || status === 429) {
        friendlyMessage = "Gemini quota exceeded or rate limited. Please try again shortly or switch to another model.";
      } else if (apiStatus === "UNAUTHENTICATED" || status === 401) {
        friendlyMessage = "Invalid Gemini API key. Please update it in AI Config settings.";
      } else if (msg) {
        friendlyMessage = msg;
      }
    } else {
      const msg = errJson?.error?.message || errJson?.message || errJson?.error || "";
      if (msg) {
        friendlyMessage = msg;
      }
    }
  } catch {
    // Fallback checks on status code if JSON parsing fails
    if (status === 401) {
      friendlyMessage = `Invalid ${engineLabel} API key. Please update it in AI Config settings.`;
    } else if (status === 429) {
      friendlyMessage = `${engineLabel} rate limit reached. Please wait a moment and try again.`;
    } else if (status === 403) {
      friendlyMessage = `${engineLabel} access denied. Please verify your API credentials and access levels.`;
    } else if (errText && errText.length < 150) {
      friendlyMessage = errText;
    }
  }

  return friendlyMessage;
}
