import { NextRequest, NextResponse } from "next/server";
import { AI_BOTS, BotInfo, BotCategory } from "@/data/bots";
export type { BotInfo, BotCategory };

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
export type BotStatus = "allowed" | "blocked" | "partial" | "unknown";

export interface BotResult extends BotInfo {
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

// ─── WAF & CDN Detection ──────────────────────────────────────────────────────
export interface WafDetection {
  detected: boolean;
  provider: string | null;
  description: string | null;
}

function detectWaf(headers: Headers): WafDetection {
  const server = headers.get("server")?.toLowerCase() || "";
  const cfRay = headers.get("cf-ray");
  const xSucuri = headers.get("x-sucuri-id");
  const xAmz = headers.get("x-amz-cf-id");
  const xFastly = headers.get("x-fastly-request-id");
  const xVercel = headers.get("x-vercel-id");
  const xNetlify = headers.get("x-nf-request-id");
  const xAkamai = headers.get("x-akamai-transformed");

  if (cfRay || server.includes("cloudflare")) {
    return {
      detected: true,
      provider: "Cloudflare",
      description: "Cloudflare Web Application Firewall detected. Ensure 'AI Scrapers and Crawlers' protection rules aren't blocking legitimate retrieval bots.",
    };
  }
  if (xSucuri) {
    return {
      detected: true,
      provider: "Sucuri WAF",
      description: "Sucuri WAF detected. May challenge automated AI bots with JS challenge or Captcha.",
    };
  }
  if (xAmz || server.includes("cloudfront")) {
    return {
      detected: true,
      provider: "AWS CloudFront",
      description: "AWS CloudFront CDN/WAF detected. Verify AWS WAF rate-limiting rules allow AI crawlers.",
    };
  }
  if (xFastly) {
    return {
      detected: true,
      provider: "Fastly",
      description: "Fastly Edge Cloud / Next-Gen WAF detected.",
    };
  }
  if (xAkamai) {
    return {
      detected: true,
      provider: "Akamai",
      description: "Akamai Edge & App Security detected.",
    };
  }
  if (xVercel) {
    return {
      detected: true,
      provider: "Vercel Edge Network",
      description: "Vercel Edge Network detected with global caching and DDoS mitigation.",
    };
  }
  if (xNetlify) {
    return {
      detected: true,
      provider: "Netlify",
      description: "Netlify Edge CDN detected.",
    };
  }

  return {
    detected: false,
    provider: null,
    description: null,
  };
}

// ─── Score Calculator ─────────────────────────────────────────────────────────
interface ScoreBreakdown {
  overallScore: number;
  grade: "A+" | "A" | "B" | "C" | "D" | "F";
  statusText: string;
  pillars: {
    botAccessScore: number; // 0-100
    aiInfrastructureScore: number; // 0-100
    technicalSignalsScore: number; // 0-100
  };
  recommendations: Array<{
    priority: "high" | "medium" | "low";
    title: string;
    description: string;
  }>;
}

function calculateVisibilityScore(
  bots: BotResult[],
  hasRobots: boolean,
  hasLlmsTxt: boolean,
  hasLlmsFullTxt: boolean,
  hasSitemaps: boolean,
  hasXRobotsRestriction: boolean
): ScoreBreakdown {
  // 1. Bot Access Score (Weighted based on bot importance)
  let maxWeight = 0;
  let earnedWeight = 0;

  for (const bot of bots) {
    maxWeight += bot.weight;
    if (bot.status === "allowed") {
      earnedWeight += bot.weight;
    } else if (bot.status === "partial") {
      earnedWeight += bot.weight * 0.5;
    }
  }

  const botAccessScore = maxWeight > 0 ? Math.round((earnedWeight / maxWeight) * 100) : 100;

  // 2. AI Infrastructure Score
  let infraScore = 0;
  if (hasRobots) infraScore += 30;
  if (hasLlmsTxt) infraScore += 40;
  if (hasLlmsFullTxt) infraScore += 30;
  const aiInfrastructureScore = Math.min(100, infraScore);

  // 3. Technical Signals Score
  let techScore = 60; // baseline for reachable HTTPS
  if (hasSitemaps) techScore += 25;
  if (!hasXRobotsRestriction) techScore += 15;
  const technicalSignalsScore = Math.min(100, techScore);

  // Weighted overall score: 60% bot access, 25% AI files, 15% technical
  const overallScore = Math.round(
    botAccessScore * 0.6 + aiInfrastructureScore * 0.25 + technicalSignalsScore * 0.15
  );

  let grade: ScoreBreakdown["grade"] = "F";
  let statusText = "Needs Immediate Attention";
  if (overallScore >= 95) { grade = "A+"; statusText = "Optimized for AI Engines"; }
  else if (overallScore >= 85) { grade = "A"; statusText = "High AI Search Visibility"; }
  else if (overallScore >= 70) { grade = "B"; statusText = "Good AI Search Readiness"; }
  else if (overallScore >= 50) { grade = "C"; statusText = "Partially Accessible to AI"; }
  else if (overallScore >= 35) { grade = "D"; statusText = "Low AI Search Visibility"; }

  const recommendations: ScoreBreakdown["recommendations"] = [];

  if (!hasLlmsFullTxt) {
    recommendations.push({
      priority: "high",
      title: "Add llms-full.txt file for comprehensive AI context",
      description: "Provides full structured information, services, and FAQs directly to AI crawler knowledge bases.",
    });
  }

  if (!hasLlmsTxt) {
    recommendations.push({
      priority: "high",
      title: "Add llms.txt standard file at domain root",
      description: "llms.txt gives AI crawlers a clean summary of your website, authority links, and preferred citation syntax.",
    });
  }

  const blockedAIBots = bots.filter((b) => (b.category === "ai-search" || b.category === "ai-training") && b.status === "blocked");
  if (blockedAIBots.length > 0) {
    recommendations.push({
      priority: "high",
      title: `Unblock ${blockedAIBots.length} key AI bots in robots.txt`,
      description: `Major AI bots like ${blockedAIBots.slice(0, 3).map((b) => b.name).join(", ")} are blocked from crawling your pages.`,
    });
  }

  if (!hasSitemaps) {
    recommendations.push({
      priority: "medium",
      title: "Declare XML sitemap inside robots.txt",
      description: "Adding 'Sitemap: https://yourdomain.com/sitemap.xml' helps AI crawlers map all your content efficiently.",
    });
  }

  return {
    overallScore,
    grade,
    statusText,
    pillars: {
      botAccessScore,
      aiInfrastructureScore,
      technicalSignalsScore,
    },
    recommendations,
  };
}

// ─── Main Route Handler ───────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const urlParam = req.nextUrl.searchParams.get("url");

  if (!urlParam) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  let targetUrl: URL;
  try {
    const normalized = urlParam.startsWith("http")
      ? urlParam
      : `https://${urlParam}`;
    targetUrl = new URL(normalized);
  } catch {
    return NextResponse.json({ error: "Invalid URL provided" }, { status: 400 });
  }

  const baseOrigin = `${targetUrl.protocol}//${targetUrl.hostname}`;
  const robotsUrl = `${baseOrigin}/robots.txt`;
  const llmsTxtUrl = `${baseOrigin}/llms.txt`;
  const llmsFullTxtUrl = `${baseOrigin}/llms-full.txt`;

  let rawRobotsTxt: string | null = null;
  let robotsFound = false;
  let xRobotsTag: string | null = null;
  let fetchError: string | null = null;
  let wafInfo: WafDetection = { detected: false, provider: null, description: null };
  let llmsTxtFound = false;
  let llmsFullTxtFound = false;

  // Run parallel fetches for robots.txt, homepage headers/WAF, llms.txt, llms-full.txt
  await Promise.allSettled([
    // 1. Fetch robots.txt
    (async () => {
      try {
        const res = await fetch(robotsUrl, {
          headers: { "User-Agent": "Mozilla/5.0 (compatible; AIBotChecker/2.0)" },
          signal: AbortSignal.timeout(8000),
        });
        if (res.ok) {
          const contentType = res.headers.get("content-type") || "";
          if (contentType.includes("text") || contentType.includes("plain") || res.status === 200) {
            rawRobotsTxt = await res.text();
            robotsFound = true;
          }
        } else if (res.status === 404) {
          fetchError = "No robots.txt found — all bots allowed by default";
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "TimeoutError") {
          fetchError = "Request timed out — site may be unreachable";
        } else {
          fetchError = "Could not reach robots.txt — verify URL is accessible";
        }
      }
    })(),

    // 2. Fetch Homepage HEAD for WAF & X-Robots-Tag
    (async () => {
      try {
        const headRes = await fetch(baseOrigin, {
          method: "HEAD",
          headers: { "User-Agent": "Mozilla/5.0 (compatible; AIBotChecker/2.0)" },
          signal: AbortSignal.timeout(6000),
        });
        xRobotsTag = headRes.headers.get("x-robots-tag");
        wafInfo = detectWaf(headRes.headers);
      } catch {
        // non-critical
      }
    })(),

    // 3. Check llms.txt
    (async () => {
      try {
        const res = await fetch(llmsTxtUrl, {
          method: "HEAD",
          headers: { "User-Agent": "Mozilla/5.0 (compatible; AIBotChecker/2.0)" },
          signal: AbortSignal.timeout(5000),
        });
        if (res.ok && res.status === 200) {
          llmsTxtFound = true;
        }
      } catch {
        // non-critical
      }
    })(),

    // 4. Check llms-full.txt
    (async () => {
      try {
        const res = await fetch(llmsFullTxtUrl, {
          method: "HEAD",
          headers: { "User-Agent": "Mozilla/5.0 (compatible; AIBotChecker/2.0)" },
          signal: AbortSignal.timeout(5000),
        });
        if (res.ok && res.status === 200) {
          llmsFullTxtFound = true;
        }
      } catch {
        // non-critical
      }
    })(),
  ]);

  // Parse robots.txt
  const parsed: ParsedRobots = rawRobotsTxt
    ? parseRobotsTxt(rawRobotsTxt)
    : { ruleSets: [], sitemaps: [] };

  // Resolve bot statuses
  const bots: BotResult[] = AI_BOTS.map((bot) => ({
    ...bot,
    ...resolveBotStatus(bot, parsed.ruleSets),
  }));

  const blockedCount = bots.filter((b) => b.status === "blocked").length;
  const allowedCount = bots.filter((b) => b.status === "allowed").length;
  const partialCount = bots.filter((b) => b.status === "partial").length;

  const currentXRobots = xRobotsTag as string | null;
  const hasXRobotsRestriction = Boolean(
    currentXRobots &&
      (currentXRobots.toLowerCase().includes("noai") || currentXRobots.toLowerCase().includes("noindex"))
  );

  const scoreBreakdown = calculateVisibilityScore(
    bots,
    robotsFound,
    llmsTxtFound,
    llmsFullTxtFound,
    parsed.sitemaps.length > 0,
    hasXRobotsRestriction
  );

  // Generate recommended robots.txt snippet if needed
  const recommendedRobotsSnippet = `# Recommended AI-Friendly robots.txt for ${targetUrl.hostname}
User-agent: *
Allow: /

# Allow AI Search & Citations
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: meta-externalagent
Allow: /

# AI Context Files
# llms.txt: ${llmsTxtUrl}
# llms-full.txt: ${llmsFullTxtUrl}
${parsed.sitemaps.length > 0 ? parsed.sitemaps.map((s) => `Sitemap: ${s}`).join("\n") : `Sitemap: ${baseOrigin}/sitemap.xml`}
`;

  return NextResponse.json({
    domain: targetUrl.hostname,
    robotsUrl,
    robotsFound,
    rawRobotsTxt,
    fetchError,
    xRobotsTag,
    wafInfo,
    llmsTxtFound,
    llmsFullTxtFound,
    sitemaps: parsed.sitemaps,
    bots,
    score: scoreBreakdown,
    recommendedRobotsSnippet,
    summary: {
      total: bots.length,
      blocked: blockedCount,
      allowed: allowedCount,
      partial: partialCount,
    },
  });
}
