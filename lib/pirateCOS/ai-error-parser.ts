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
  else if (engine === "puter") engineLabel = "Puter";

  // If the error message is prepended by an HTTP status code (common with Puter SDK), parse it out
  if (errText) {
    const statusMatch = errText.trim().match(/^(\d{3})\s+([\s\S]*)$/);
    if (statusMatch) {
      status = parseInt(statusMatch[1], 10);
      errText = statusMatch[2].trim();
    }
  }

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
    } else if (engine === "puter") {
      const type = errJson?.error?.type || errJson?.type || "";
      const msg = errJson?.error?.message || errJson?.message || "";
      if (type === "not_found_error" && msg.startsWith("model: ")) {
        const modelId = msg.replace("model: ", "");
        friendlyMessage = `Model "${modelId}" is not supported by Puter. Please select a different version from the AI model pill or switch engines.`;
      } else if (type === "not_found_error" || msg.toLowerCase().includes("model not found")) {
        friendlyMessage = `Selected model is not supported by Puter. Please choose a different model.`;
      } else if (status === 404) {
        friendlyMessage = `Model or endpoint not found on Puter. Please verify the model selection.`;
      } else if (status === 429) {
        friendlyMessage = "Puter rate limit reached. Please wait a moment and try again.";
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
    } else if (status === 404) {
      if (engine === "puter") {
        friendlyMessage = `Model or endpoint not found on Puter. Please verify the model selection.`;
      } else {
        friendlyMessage = `${engineLabel} resource not found (404).`;
      }
    } else if (errText && errText.length < 150) {
      friendlyMessage = errText;
    }
  }

  return friendlyMessage;
}
