/**
 * Names a crawler from its User-Agent.
 *
 * `isBotUserAgent` only answers yes/no. For the dashboard we need to know
 * *which* crawler: `robots.txt` explicitly allows GPTBot, ClaudeBot and the
 * other AI crawlers, so how often they actually visit is a signal worth
 * seeing, not noise to discard.
 *
 * Pure (no I/O) so it is safe to unit test and to call per request.
 */

export type BotKind = "ai" | "search" | "seo" | "social" | "tool" | "other";

export interface BotIdentity {
  /** Canonical display name, e.g. "GPTBot". */
  name: string;
  kind: BotKind;
}

/**
 * Ordered — first match wins. More specific patterns must come first:
 * "Googlebot" would otherwise swallow "Googlebot-Image", and several AI
 * crawlers contain the literal string "bot".
 */
const BOTS: Array<{ re: RegExp; name: string; kind: BotKind }> = [
  // ── AI crawlers (allowed in robots.txt — we want these counted) ──
  { re: /GPTBot/i, name: "GPTBot", kind: "ai" },
  { re: /ChatGPT-User/i, name: "ChatGPT-User", kind: "ai" },
  { re: /OAI-SearchBot/i, name: "OAI-SearchBot", kind: "ai" },
  { re: /ClaudeBot/i, name: "ClaudeBot", kind: "ai" },
  { re: /Claude-Web/i, name: "Claude-Web", kind: "ai" },
  { re: /anthropic-ai/i, name: "anthropic-ai", kind: "ai" },
  { re: /PerplexityBot/i, name: "PerplexityBot", kind: "ai" },
  { re: /Google-Extended/i, name: "Google-Extended", kind: "ai" },
  { re: /Applebot-Extended/i, name: "Applebot-Extended", kind: "ai" },
  { re: /CCBot/i, name: "CCBot", kind: "ai" },
  { re: /Bytespider/i, name: "Bytespider", kind: "ai" },
  { re: /Amazonbot/i, name: "Amazonbot", kind: "ai" },
  { re: /Meta-ExternalAgent/i, name: "Meta-ExternalAgent", kind: "ai" },
  { re: /cohere-ai/i, name: "cohere-ai", kind: "ai" },
  { re: /DuckAssistBot/i, name: "DuckAssistBot", kind: "ai" },

  // ── Search engines ──
  { re: /Googlebot-Image/i, name: "Googlebot-Image", kind: "search" },
  { re: /Googlebot-News/i, name: "Googlebot-News", kind: "search" },
  { re: /Googlebot-Video/i, name: "Googlebot-Video", kind: "search" },
  { re: /AdsBot-Google/i, name: "AdsBot-Google", kind: "search" },
  { re: /Googlebot/i, name: "Googlebot", kind: "search" },
  { re: /Google-InspectionTool/i, name: "Google-InspectionTool", kind: "search" },
  { re: /BingPreview/i, name: "BingPreview", kind: "search" },
  { re: /bingbot/i, name: "bingbot", kind: "search" },
  { re: /Applebot/i, name: "Applebot", kind: "search" },
  { re: /DuckDuckBot/i, name: "DuckDuckBot", kind: "search" },
  { re: /YandexBot/i, name: "YandexBot", kind: "search" },
  { re: /Baiduspider/i, name: "Baiduspider", kind: "search" },
  { re: /Slurp/i, name: "Yahoo Slurp", kind: "search" },
  { re: /SeznamBot/i, name: "SeznamBot", kind: "search" },

  // ── SEO tools ──
  { re: /AhrefsBot/i, name: "AhrefsBot", kind: "seo" },
  { re: /SemrushBot/i, name: "SemrushBot", kind: "seo" },
  { re: /MJ12bot/i, name: "MJ12bot", kind: "seo" },
  { re: /DotBot/i, name: "DotBot", kind: "seo" },
  { re: /rogerbot/i, name: "rogerbot", kind: "seo" },
  { re: /Screaming Frog/i, name: "Screaming Frog", kind: "seo" },
  { re: /PetalBot/i, name: "PetalBot", kind: "seo" },

  // ── Social / link unfurlers ──
  { re: /facebookexternalhit/i, name: "Facebook", kind: "social" },
  { re: /Twitterbot/i, name: "Twitterbot", kind: "social" },
  { re: /LinkedInBot/i, name: "LinkedInBot", kind: "social" },
  { re: /Slackbot/i, name: "Slackbot", kind: "social" },
  { re: /TelegramBot/i, name: "TelegramBot", kind: "social" },
  { re: /WhatsApp/i, name: "WhatsApp", kind: "social" },
  { re: /Discordbot/i, name: "Discordbot", kind: "social" },
  { re: /redditbot/i, name: "redditbot", kind: "social" },

  // ── Monitoring / libraries ──
  { re: /Lighthouse|Chrome-Lighthouse/i, name: "Lighthouse", kind: "tool" },
  { re: /HeadlessChrome/i, name: "HeadlessChrome", kind: "tool" },
  { re: /Pingdom/i, name: "Pingdom", kind: "tool" },
  { re: /GTmetrix/i, name: "GTmetrix", kind: "tool" },
  { re: /UptimeRobot/i, name: "UptimeRobot", kind: "tool" },
  { re: /python-requests/i, name: "python-requests", kind: "tool" },
  { re: /axios/i, name: "axios", kind: "tool" },
  { re: /node-fetch/i, name: "node-fetch", kind: "tool" },
  { re: /\bcurl\//i, name: "curl", kind: "tool" },
  { re: /\bWget\//i, name: "wget", kind: "tool" },
  { re: /Vercel/i, name: "Vercel", kind: "tool" },
];

/** Generic catch-all — something self-identifying as a bot we don't know. */
const GENERIC_BOT = /bot\b|crawler|spider|scraper|ia_archiver/i;

/**
 * Identifies the crawler behind a User-Agent, or `null` for a human browser.
 * An empty UA is treated as an unknown bot: real browsers always send one.
 */
export function identifyBot(ua: string | null | undefined): BotIdentity | null {
  if (!ua || !ua.trim()) return { name: "(no user-agent)", kind: "other" };

  for (const b of BOTS) {
    if (b.re.test(ua)) return { name: b.name, kind: b.kind };
  }

  if (GENERIC_BOT.test(ua)) return { name: "Other bot", kind: "other" };

  return null;
}
