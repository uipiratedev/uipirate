// GEO (Generative Engine Optimization) competitor benchmark.
//
// Scores a single domain's readiness for AI search/answer engines across
// three pillars - whether AI crawlers can actually reach the site
// (robots.txt), whether it provides the newer llms.txt/llms-full.txt
// context files AI agents increasingly look for, and how much machine-
// readable structured data (JSON-LD) it exposes - then lets two domains'
// scores be compared side by side. The bot-access weighting reuses the same
// AI_BOTS list and weight values as the standalone AI Crawler & GEO
// Readiness Hub (data/bots.ts), so a domain scores consistently whether you
// check it there or benchmark it here against a competitor.

import { AI_BOTS, type BotInfo } from "@/data/bots";

export interface RobotsRuleSet {
  userAgent: string;
  allow: string[];
  disallow: string[];
}

export function parseRobotsTxt(text: string): { ruleSets: RobotsRuleSet[]; sitemapDeclared: boolean } {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"));

  const ruleSets: RobotsRuleSet[] = [];
  let current: RobotsRuleSet | null = null;
  let sitemapDeclared = false;

  for (const line of lines) {
    const lower = line.toLowerCase();

    if (lower.startsWith("user-agent:")) {
      current = { userAgent: line.slice("user-agent:".length).trim(), allow: [], disallow: [] };
      ruleSets.push(current);
    } else if (lower.startsWith("disallow:") && current) {
      const path = line.slice("disallow:".length).trim();

      if (path) current.disallow.push(path);
    } else if (lower.startsWith("allow:") && current) {
      const path = line.slice("allow:".length).trim();

      if (path) current.allow.push(path);
    } else if (lower.startsWith("sitemap:")) {
      sitemapDeclared = true;
    }
  }

  return { ruleSets, sitemapDeclared };
}

function normalizeAgent(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export type BotAccessStatus = "allowed" | "blocked" | "partial";

export interface BotAccessResult {
  id: string;
  name: string;
  category: BotInfo["category"];
  weight: number;
  status: BotAccessStatus;
}

export function resolveBotAccess(bot: BotInfo, ruleSets: RobotsRuleSet[]): BotAccessStatus {
  const botNorm = normalizeAgent(bot.userAgent);
  const specific = ruleSets.filter((rs) => normalizeAgent(rs.userAgent) === botNorm);
  const wildcard = ruleSets.filter((rs) => rs.userAgent === "*");
  const applicable = specific.length > 0 ? specific : wildcard;

  if (applicable.length === 0) return "allowed";

  const disallowed = applicable.flatMap((r) => r.disallow);
  const allowed = applicable.flatMap((r) => r.allow);
  const blocksRoot = disallowed.includes("/");

  if (blocksRoot && allowed.length === 0) return "blocked";
  if (disallowed.length > 0) return "partial";

  return "allowed";
}

export interface DomainGeoFeatures {
  robotsTxtFound: boolean;
  sitemapDeclared: boolean;
  llmsTxtFound: boolean;
  llmsFullTxtFound: boolean;
  jsonLdTypeCount: number;
  botResults: BotAccessResult[];
}

export function extractDomainGeoFeatures(
  robotsTxt: string | null,
  llmsTxtFound: boolean,
  llmsFullTxtFound: boolean,
  jsonLdTypes: string[],
): DomainGeoFeatures {
  const { ruleSets, sitemapDeclared } = robotsTxt !== null ? parseRobotsTxt(robotsTxt) : { ruleSets: [], sitemapDeclared: false };

  const botResults: BotAccessResult[] = AI_BOTS.map((bot) => ({
    id: bot.id,
    name: bot.name,
    category: bot.category,
    weight: bot.weight,
    status: resolveBotAccess(bot, ruleSets),
  }));

  return {
    robotsTxtFound: robotsTxt !== null,
    sitemapDeclared,
    llmsTxtFound,
    llmsFullTxtFound,
    jsonLdTypeCount: new Set(jsonLdTypes).size,
    botResults,
  };
}

export interface DomainGeoScore {
  overallScore: number;
  grade: "A" | "B" | "C" | "D" | "F";
  pillars: {
    botAccessScore: number;
    aiInfrastructureScore: number;
    schemaScore: number;
  };
  features: DomainGeoFeatures;
}

function clampScore(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function scoreToGrade(score: number): DomainGeoScore["grade"] {
  if (score >= 90) return "A";
  if (score >= 75) return "B";
  if (score >= 60) return "C";
  if (score >= 40) return "D";

  return "F";
}

function scoreBotAccess(botResults: BotAccessResult[]): number {
  let maxWeight = 0;
  let earnedWeight = 0;

  for (const bot of botResults) {
    maxWeight += bot.weight;
    if (bot.status === "allowed") earnedWeight += bot.weight;
    else if (bot.status === "partial") earnedWeight += bot.weight * 0.5;
  }

  return maxWeight > 0 ? clampScore((earnedWeight / maxWeight) * 100) : 100;
}

function scoreSchema(jsonLdTypeCount: number): number {
  if (jsonLdTypeCount === 0) return 0;
  if (jsonLdTypeCount === 1) return 55;
  if (jsonLdTypeCount === 2) return 80;

  return 100;
}

export function scoreDomainGeoReadiness(features: DomainGeoFeatures): DomainGeoScore {
  const botAccessScore = scoreBotAccess(features.botResults);

  let aiInfrastructureScore = 0;

  if (features.robotsTxtFound) aiInfrastructureScore += 30;
  if (features.llmsTxtFound) aiInfrastructureScore += 40;
  if (features.llmsFullTxtFound) aiInfrastructureScore += 30;

  const schemaScore = scoreSchema(features.jsonLdTypeCount);

  const overallScore = clampScore(
    botAccessScore * 0.5 + aiInfrastructureScore * 0.3 + schemaScore * 0.2,
  );

  return {
    overallScore,
    grade: scoreToGrade(overallScore),
    pillars: {
      botAccessScore: clampScore(botAccessScore),
      aiInfrastructureScore: clampScore(aiInfrastructureScore),
      schemaScore: clampScore(schemaScore),
    },
    features,
  };
}

export interface PillarComparison {
  key: "botAccessScore" | "aiInfrastructureScore" | "schemaScore";
  label: string;
  primary: number;
  competitor: number;
  winner: "primary" | "competitor" | "tie";
}

export interface GeoBenchmarkComparison {
  overallWinner: "primary" | "competitor" | "tie";
  pillars: PillarComparison[];
  blockedBotsPrimaryOnly: string[];
  blockedBotsCompetitorOnly: string[];
}

function pillarWinner(a: number, b: number): "primary" | "competitor" | "tie" {
  if (a === b) return "tie";

  return a > b ? "primary" : "competitor";
}

export function compareGeoReadiness(primary: DomainGeoScore, competitor: DomainGeoScore): GeoBenchmarkComparison {
  const pillars: PillarComparison[] = [
    {
      key: "botAccessScore",
      label: "AI Bot Access",
      primary: primary.pillars.botAccessScore,
      competitor: competitor.pillars.botAccessScore,
      winner: pillarWinner(primary.pillars.botAccessScore, competitor.pillars.botAccessScore),
    },
    {
      key: "aiInfrastructureScore",
      label: "AI Infrastructure (llms.txt)",
      primary: primary.pillars.aiInfrastructureScore,
      competitor: competitor.pillars.aiInfrastructureScore,
      winner: pillarWinner(primary.pillars.aiInfrastructureScore, competitor.pillars.aiInfrastructureScore),
    },
    {
      key: "schemaScore",
      label: "Structured Data (JSON-LD)",
      primary: primary.pillars.schemaScore,
      competitor: competitor.pillars.schemaScore,
      winner: pillarWinner(primary.pillars.schemaScore, competitor.pillars.schemaScore),
    },
  ];

  const primaryBlocked = new Set(
    primary.features.botResults.filter((b) => b.status === "blocked").map((b) => b.id),
  );
  const competitorBlocked = new Set(
    competitor.features.botResults.filter((b) => b.status === "blocked").map((b) => b.id),
  );

  return {
    overallWinner: pillarWinner(primary.overallScore, competitor.overallScore),
    pillars,
    blockedBotsPrimaryOnly: [...primaryBlocked].filter((id) => !competitorBlocked.has(id)),
    blockedBotsCompetitorOnly: [...competitorBlocked].filter((id) => !primaryBlocked.has(id)),
  };
}
