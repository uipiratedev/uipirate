import { NextRequest, NextResponse } from "next/server";

// ─── AI Bot definitions ───────────────────────────────────────────────────────
export interface BotInfo {
  id: string;
  name: string;
  company: string;
  userAgent: string;
  description: string;
  color: string;
  icon: string; // emoji fallback
}

export const AI_BOTS: BotInfo[] = [
  {
    id: "gptbot",
    name: "GPTBot",
    company: "OpenAI",
    userAgent: "GPTBot",
    description: "Trains ChatGPT and OpenAI models",
    color: "#10A37F",
    icon: "🤖",
  },
  {
    id: "chatgpt-user",
    name: "ChatGPT-User",
    company: "OpenAI",
    userAgent: "ChatGPT-User",
    description: "ChatGPT browsing plugin requests",
    color: "#10A37F",
    icon: "💬",
  },
  {
    id: "claudebot",
    name: "ClaudeBot",
    company: "Anthropic",
    userAgent: "ClaudeBot",
    description: "Trains Claude AI models",
    color: "#CC785C",
    icon: "🔶",
  },
  {
    id: "anthropic-ai",
    name: "anthropic-ai",
    company: "Anthropic",
    userAgent: "anthropic-ai",
    description: "Anthropic crawler for model training",
    color: "#CC785C",
    icon: "🔸",
  },
  {
    id: "google-extended",
    name: "Google-Extended",
    company: "Google",
    userAgent: "Google-Extended",
    description: "Trains Gemini and Google AI models",
    color: "#4285F4",
    icon: "✨",
  },
  {
    id: "perplexitybot",
    name: "PerplexityBot",
    company: "Perplexity AI",
    userAgent: "PerplexityBot",
    description: "Powers Perplexity AI search",
    color: "#20808D",
    icon: "🔍",
  },
  {
    id: "ccbot",
    name: "CCBot",
    company: "Common Crawl",
    userAgent: "CCBot",
    description: "Common Crawl — feeds most open LLM datasets",
    color: "#7C3AED",
    icon: "🌐",
  },
  {
    id: "bytespider",
    name: "Bytespider",
    company: "ByteDance (TikTok)",
    userAgent: "Bytespider",
    description: "ByteDance AI crawler (TikTok parent company)",
    color: "#EE1D52",
    icon: "🕷️",
  },
  {
    id: "amazonbot",
    name: "Amazonbot",
    company: "Amazon",
    userAgent: "Amazonbot",
    description: "Trains Amazon Alexa and AWS AI models",
    color: "#FF9900",
    icon: "📦",
  },
  {
    id: "meta-externalagent",
    name: "Meta-ExternalAgent",
    company: "Meta AI",
    userAgent: "meta-externalagent",
    description: "Meta AI (Llama) training crawler",
    color: "#0866FF",
    icon: "🦙",
  },
  {
    id: "applebot-extended",
    name: "Applebot-Extended",
    company: "Apple",
    userAgent: "Applebot-Extended",
    description: "Trains Apple Intelligence models",
    color: "#555555",
    icon: "🍎",
  },
  {
    id: "diffbot",
    name: "Diffbot",
    company: "Diffbot",
    userAgent: "Diffbot",
    description: "AI-powered web data extraction",
    color: "#F4511E",
    icon: "🤖",
  },
  {
    id: "cohere-ai",
    name: "cohere-ai",
    company: "Cohere",
    userAgent: "cohere-ai",
    description: "Trains Cohere enterprise AI models",
    color: "#39594D",
    icon: "🔵",
  },
  {
    id: "youbot",
    name: "YouBot",
    company: "You.com",
    userAgent: "YouBot",
    description: "You.com AI search crawler",
    color: "#8B5CF6",
    icon: "💡",
  },
  {
    id: "timpibot",
    name: "Timpibot",
    company: "Timpi",
    userAgent: "Timpibot",
    description: "Decentralized AI search engine",
    color: "#06B6D4",
    icon: "⏱️",
  },
  {
    id: "omgilibot",
    name: "Omgilibot",
    company: "Webz.io",
    userAgent: "Omgilibot",
    description: "AI-powered web content crawler",
    color: "#84CC16",
    icon: "🕸️",
  },
];

// ─── robots.txt parser ────────────────────────────────────────────────────────

interface RuleSet {
  userAgent: string;
  allow: string[];
  disallow: string[];
  crawlDelay?: number;
}

interface ParsedRobots {
  ruleSets: RuleSet[];
  sitemaps: string[];
}

function parseRobotsTxt(text: string): ParsedRobots {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"));

  const ruleSets: RuleSet[] = [];
  const sitemaps: string[] = [];
  let current: RuleSet | null = null;

  for (const line of lines) {
    const lower = line.toLowerCase();

    if (lower.startsWith("user-agent:")) {
      const ua = line.substring("user-agent:".length).trim();
      if (current && current.userAgent) {
        // If same block continues, add to existing
        if (ruleSets.length > 0 && ruleSets[ruleSets.length - 1].allow.length === 0 && ruleSets[ruleSets.length - 1].disallow.length === 0) {
          // merge user agents — just add another rule set
        }
      }
      current = { userAgent: ua, allow: [], disallow: [] };
      ruleSets.push(current);
    } else if (lower.startsWith("disallow:") && current) {
      const path = line.substring("disallow:".length).trim();
      if (path) current.disallow.push(path);
    } else if (lower.startsWith("allow:") && current) {
      const path = line.substring("allow:".length).trim();
      if (path) current.allow.push(path);
    } else if (lower.startsWith("crawl-delay:") && current) {
      const delay = parseFloat(line.substring("crawl-delay:".length).trim());
      if (!isNaN(delay)) current.crawlDelay = delay;
    } else if (lower.startsWith("sitemap:")) {
      sitemaps.push(line.substring("sitemap:".length).trim());
    }
  }

  return { ruleSets, sitemaps };
}

// ─── Bot status resolver ──────────────────────────────────────────────────────

type BotStatus = "allowed" | "blocked" | "partial" | "unknown";

interface BotResult extends BotInfo {
  status: BotStatus;
  allowedPaths: string[];
  disallowedPaths: string[];
  crawlDelay?: number;
  matchedAgent: string | null;
}

function normalizeName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function resolveBotStatus(
  bot: BotInfo,
  ruleSets: RuleSet[]
): Omit<BotResult, keyof BotInfo> {
  // Find matching rule sets — exact match first, then wildcard
  const botNorm = normalizeName(bot.userAgent);
  const specificRules = ruleSets.filter(
    (rs) => normalizeName(rs.userAgent) === botNorm
  );
  const wildcardRules = ruleSets.filter((rs) => rs.userAgent === "*");

  const applicableRules = specificRules.length > 0 ? specificRules : wildcardRules;
  const matchedAgent =
    specificRules.length > 0
      ? specificRules[0].userAgent
      : wildcardRules.length > 0
        ? "*"
        : null;

  if (applicableRules.length === 0) {
    return {
      status: "allowed",
      allowedPaths: [],
      disallowedPaths: [],
      matchedAgent: null,
    };
  }

  const allDisallowed: string[] = applicableRules.flatMap((r) => r.disallow);
  const allAllowed: string[] = applicableRules.flatMap((r) => r.allow);
  const crawlDelay = applicableRules.find((r) => r.crawlDelay != null)?.crawlDelay;

  const blocksRoot = allDisallowed.includes("/");
  const hasPartialAllows = allAllowed.length > 0 && blocksRoot;

  let status: BotStatus;
  if (blocksRoot && !hasPartialAllows) {
    status = "blocked";
  } else if (blocksRoot && hasPartialAllows) {
    status = "partial";
  } else if (allDisallowed.length > 0) {
    status = "partial";
  } else {
    status = "allowed";
  }

  return {
    status,
    allowedPaths: allAllowed,
    disallowedPaths: allDisallowed,
    crawlDelay,
    matchedAgent,
  };
}

// ─── Main handler ─────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const urlParam = req.nextUrl.searchParams.get("url");

  if (!urlParam) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  // Normalize URL
  let targetUrl: URL;
  try {
    const normalized = urlParam.startsWith("http")
      ? urlParam
      : `https://${urlParam}`;
    targetUrl = new URL(normalized);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  const robotsUrl = `${targetUrl.protocol}//${targetUrl.hostname}/robots.txt`;

  let rawRobotsTxt: string | null = null;
  let robotsFound = false;
  let xRobotsTag: string | null = null;
  let fetchError: string | null = null;

  // Fetch robots.txt
  try {
    const robotsRes = await fetch(robotsUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; AIBotChecker/1.0)",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (robotsRes.ok) {
      const contentType = robotsRes.headers.get("content-type") || "";
      if (contentType.includes("text") || contentType.includes("plain")) {
        rawRobotsTxt = await robotsRes.text();
        robotsFound = true;
      } else {
        fetchError = "robots.txt found but returned unexpected content type";
      }
    } else if (robotsRes.status === 404) {
      fetchError = "No robots.txt found — all bots are allowed by default";
    } else {
      fetchError = `robots.txt fetch returned status ${robotsRes.status}`;
    }
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "TimeoutError") {
      fetchError = "Request timed out — site may be unreachable";
    } else {
      fetchError = "Could not reach site — it may be offline or blocking bots";
    }
  }

  // Fetch homepage headers for X-Robots-Tag
  try {
    const headRes = await fetch(`${targetUrl.protocol}//${targetUrl.hostname}`, {
      method: "HEAD",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; AIBotChecker/1.0)",
      },
      signal: AbortSignal.timeout(5000),
    });
    xRobotsTag = headRes.headers.get("x-robots-tag");
  } catch {
    // Not critical — ignore
  }

  // Parse and resolve bot statuses
  const parsed: ParsedRobots = rawRobotsTxt
    ? parseRobotsTxt(rawRobotsTxt)
    : { ruleSets: [], sitemaps: [] };

  const bots: BotResult[] = AI_BOTS.map((bot) => ({
    ...bot,
    ...resolveBotStatus(bot, parsed.ruleSets),
  }));

  const blockedCount = bots.filter((b) => b.status === "blocked").length;
  const allowedCount = bots.filter((b) => b.status === "allowed").length;
  const partialCount = bots.filter((b) => b.status === "partial").length;

  return NextResponse.json({
    domain: targetUrl.hostname,
    robotsUrl,
    robotsFound,
    rawRobotsTxt,
    fetchError,
    xRobotsTag,
    sitemaps: parsed.sitemaps,
    bots,
    summary: {
      total: bots.length,
      blocked: blockedCount,
      allowed: allowedCount,
      partial: partialCount,
    },
  });
}
