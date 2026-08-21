"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────
interface BotResult {
  id: string;
  name: string;
  company: string;
  userAgent: string;
  description: string;
  color: string;
  icon: string;
  status: "allowed" | "blocked" | "partial" | "unknown";
  allowedPaths: string[];
  disallowedPaths: string[];
  crawlDelay?: number;
  matchedAgent: string | null;
}

interface CheckResult {
  domain: string;
  robotsUrl: string;
  robotsFound: boolean;
  rawRobotsTxt: string | null;
  fetchError: string | null;
  xRobotsTag: string | null;
  sitemaps: string[];
  bots: BotResult[];
  summary: {
    total: number;
    blocked: number;
    allowed: number;
    partial: number;
  };
}

// ─── Status helpers ───────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  allowed: {
    label: "Allowed",
    bg: "bg-emerald-500/15",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
    dot: "bg-emerald-400",
    cardBorder: "border-emerald-500/20 hover:border-emerald-500/50",
    accent: "bg-emerald-500",
    glow: "rgba(16,185,129,0.12)",
    desc: "This AI bot can fully crawl your site. Your content may be used to train AI models or power AI search results.",
  },
  blocked: {
    label: "Blocked",
    bg: "bg-red-500/15",
    text: "text-red-400",
    border: "border-red-500/30",
    dot: "bg-red-400",
    cardBorder: "border-red-500/20 hover:border-red-500/50",
    accent: "bg-red-500",
    glow: "rgba(239,68,68,0.12)",
    desc: "This AI bot is explicitly blocked from crawling your site via robots.txt. Your content will not be used by this AI.",
  },
  partial: {
    label: "Partial",
    bg: "bg-amber-500/15",
    text: "text-amber-400",
    border: "border-amber-500/30",
    dot: "bg-amber-400",
    cardBorder: "border-amber-500/20 hover:border-amber-500/50",
    accent: "bg-amber-500",
    glow: "rgba(245,158,11,0.12)",
    desc: "This AI bot can access some parts of your site. Specific paths are blocked while others remain accessible.",
  },
  unknown: {
    label: "Unknown",
    bg: "bg-zinc-500/15",
    text: "text-zinc-400",
    border: "border-zinc-500/30",
    dot: "bg-zinc-400",
    cardBorder: "border-zinc-700/40 hover:border-zinc-600/60",
    accent: "bg-zinc-500",
    glow: "rgba(113,113,122,0.12)",
    desc: "No specific rules found for this bot. It may fall under wildcard (*) rules or have unrestricted access.",
  },
};

function StatusBadge({ status }: { status: BotResult["status"] }) {
  const c = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${c.bg} ${c.text} ${c.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} animate-pulse`} />
      {c.label}
    </span>
  );
}

// ─── Bot Detail Drawer ────────────────────────────────────────────────────────
function BotDetailDrawer({
  bot,
  domain,
  onClose,
}: {
  bot: BotResult;
  domain: string;
  onClose: () => void;
}) {
  const c = STATUS_CONFIG[bot.status];

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const totalPaths = bot.allowedPaths.length + bot.disallowedPaths.length;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed right-0 top-0 bottom-0 w-full max-w-[480px] z-50 flex flex-col overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #131315 0%, #0f0f11 100%)",
          borderLeft: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "-20px 0 60px rgba(0,0,0,0.6)",
        }}
      >
        {/* Glow top */}
        <div
          className="absolute inset-x-0 top-0 h-48 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 100% 100% at 50% 0%, ${c.glow} 0%, transparent 70%)`,
          }}
        />

        {/* Header */}
        <div className="relative flex items-start justify-between p-5 pb-4 border-b border-zinc-800/60">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{
                backgroundColor: `${bot.color}18`,
                border: `1px solid ${bot.color}30`,
                boxShadow: `0 0 20px ${bot.color}15`,
              }}
            >
              {bot.icon}
            </div>
            <div>
              <h2 className="font-bold text-white text-base leading-tight">{bot.name}</h2>
              <div className="text-xs text-zinc-500 mt-0.5">{bot.company}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all duration-150 flex-shrink-0 mt-0.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto relative">
          <div className="p-5 space-y-5">

            {/* Status overview card */}
            <div
              className={`rounded-xl p-4 border ${c.border}`}
              style={{ backgroundColor: c.glow }}
            >
              <div className="flex items-center justify-between mb-2">
                <StatusBadge status={bot.status} />
                <span className="text-xs text-zinc-500 font-mono">{domain}</span>
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed">{c.desc}</p>
            </div>

            {/* Crawl stats row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-3 text-center">
                <div className="text-xl font-bold text-white">{bot.disallowedPaths.length}</div>
                <div className="text-xs text-zinc-500 mt-0.5">Blocked<br />paths</div>
              </div>
              <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-3 text-center">
                <div className="text-xl font-bold text-white">{bot.allowedPaths.length}</div>
                <div className="text-xs text-zinc-500 mt-0.5">Allowed<br />paths</div>
              </div>
              <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-3 text-center">
                <div className="text-xl font-bold text-white">
                  {bot.crawlDelay != null ? `${bot.crawlDelay}s` : "—"}
                </div>
                <div className="text-xs text-zinc-500 mt-0.5">Crawl<br />delay</div>
              </div>
            </div>

            {/* Matched rule */}
            <div className="rounded-xl bg-zinc-900/40 border border-zinc-800 p-4">
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                robots.txt rule match
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500">User-Agent directive</span>
                  <span className="font-mono text-xs text-white bg-zinc-800 px-2 py-1 rounded-md">
                    {bot.matchedAgent ?? "No match"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500">Bot User-Agent string</span>
                  <span className="font-mono text-xs text-zinc-400 bg-zinc-800/60 px-2 py-1 rounded-md">
                    {bot.userAgent}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500">Rule source</span>
                  <span className="text-xs text-zinc-400">
                    {bot.matchedAgent === "*"
                      ? "Wildcard (*) rule"
                      : bot.matchedAgent
                        ? "Specific rule"
                        : "No rule — defaults to allowed"}
                  </span>
                </div>
              </div>
            </div>

            {/* Disallowed paths */}
            {bot.disallowedPaths.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  Blocked from crawling ({bot.disallowedPaths.length} path{bot.disallowedPaths.length !== 1 ? "s" : ""})
                </div>
                <div className="rounded-xl border border-red-500/10 bg-red-500/3 overflow-hidden">
                  {bot.disallowedPaths.map((path, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-3 px-3.5 py-2.5 ${i !== bot.disallowedPaths.length - 1 ? "border-b border-red-500/8" : ""}`}
                    >
                      <svg className="w-3 h-3 text-red-500/60 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                      <span className="font-mono text-xs text-red-300/80 break-all">{path}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Allowed paths */}
            {bot.allowedPaths.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Explicitly allowed ({bot.allowedPaths.length} path{bot.allowedPaths.length !== 1 ? "s" : ""})
                </div>
                <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/3 overflow-hidden">
                  {bot.allowedPaths.map((path, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-3 px-3.5 py-2.5 ${i !== bot.allowedPaths.length - 1 ? "border-b border-emerald-500/8" : ""}`}
                    >
                      <svg className="w-3 h-3 text-emerald-500/60 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="font-mono text-xs text-emerald-300/80 break-all">{path}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No path rules */}
            {totalPaths === 0 && (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 text-center">
                <div className="text-zinc-500 text-sm">No specific path rules defined</div>
                <div className="text-zinc-600 text-xs mt-1">
                  {bot.matchedAgent === "*"
                    ? "Wildcard rule applies — check disallow/allow above"
                    : "This bot has no explicit path restrictions in robots.txt"}
                </div>
              </div>
            )}

            {/* About this bot */}
            <div className="rounded-xl bg-zinc-900/40 border border-zinc-800 p-4">
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                About {bot.name}
              </div>
              <div className="space-y-2.5 text-sm">
                <div className="flex items-start gap-3">
                  <span className="text-zinc-500 text-xs w-20 flex-shrink-0 pt-0.5">Company</span>
                  <span className="text-zinc-300 text-xs">{bot.company}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-zinc-500 text-xs w-20 flex-shrink-0 pt-0.5">Purpose</span>
                  <span className="text-zinc-300 text-xs">{bot.description}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-zinc-500 text-xs w-20 flex-shrink-0 pt-0.5">User-Agent</span>
                  <span className="font-mono text-zinc-400 text-xs break-all">{bot.userAgent}</span>
                </div>
              </div>
            </div>

            {/* What this means for you */}
            <div
              className="rounded-xl p-4 border border-zinc-700/30"
              style={{ background: "linear-gradient(135deg, rgba(255,91,4,0.05) 0%, transparent 60%)" }}
            >
              <div className="text-xs font-semibold text-[#FF5B04] uppercase tracking-wider mb-2 flex items-center gap-2">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                What this means
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {bot.status === "blocked" &&
                  `${bot.name} is blocked from indexing ${domain}. Your content won't appear in ${bot.company}'s AI training data or search results powered by this bot.`}
                {bot.status === "allowed" &&
                  `${bot.name} has full access to ${domain}. ${bot.company} may use your content to train AI models or include it in AI-powered search results.`}
                {bot.status === "partial" &&
                  `${bot.name} has restricted access to ${domain}. ${bot.disallowedPaths.length} path(s) are blocked, but ${bot.allowedPaths.length > 0 ? `${bot.allowedPaths.length} path(s) are explicitly allowed and ` : ""}the rest of the site may still be crawled.`}
                {bot.status === "unknown" &&
                  `No specific rule for ${bot.name} was found in ${domain}'s robots.txt. The bot may still crawl unless blocked by a wildcard (*) rule.`}
              </p>
            </div>

            <div className="h-4" />
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ─── Bot card ─────────────────────────────────────────────────────────────────
function BotCard({
  bot,
  index,
  onClick,
}: {
  bot: BotResult;
  index: number;
  onClick: () => void;
}) {
  const c = STATUS_CONFIG[bot.status];

  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.025, duration: 0.35 }}
      onClick={onClick}
      className={`group relative w-full rounded-xl border transition-all duration-200 overflow-hidden bg-[#111113] text-left cursor-pointer ${c.cardBorder}`}
      whileHover={{ scale: 1.005 }}
      whileTap={{ scale: 0.998 }}
    >
      {/* Left accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-0.5 transition-opacity duration-200 opacity-50 group-hover:opacity-100 ${c.accent}`} />

      <div className="pl-4 pr-4 py-3.5 flex items-center gap-3">
        {/* Icon */}
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
          style={{
            backgroundColor: `${bot.color}18`,
            border: `1px solid ${bot.color}28`,
          }}
        >
          {bot.icon}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white text-sm">{bot.name}</span>
            {bot.crawlDelay != null && (
              <span className="text-xs text-zinc-600 bg-zinc-800/80 px-1.5 py-0.5 rounded hidden sm:inline">
                {bot.crawlDelay}s delay
              </span>
            )}
          </div>
          <div className="text-xs text-zinc-500 mt-0.5 truncate">
            {bot.company}
            {(bot.disallowedPaths.length > 0 || bot.allowedPaths.length > 0) && (
              <span className="ml-1.5 text-zinc-600">
                · {bot.disallowedPaths.length + bot.allowedPaths.length} path rule{bot.disallowedPaths.length + bot.allowedPaths.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        {/* Status + arrow */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <StatusBadge status={bot.status} />
          <svg
            className="w-3.5 h-3.5 text-zinc-700 group-hover:text-zinc-400 transition-colors duration-150"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </motion.button>
  );
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-xl border border-zinc-800 bg-[#111113] p-3.5 animate-pulse flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-zinc-800 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-zinc-800 rounded w-24" />
        <div className="h-2.5 bg-zinc-800/60 rounded w-40" />
      </div>
      <div className="h-5 w-16 bg-zinc-800 rounded-full flex-shrink-0" />
      <div className="w-3.5 h-3.5 bg-zinc-800 rounded flex-shrink-0" />
    </div>
  );
}

// ─── Robots.txt viewer ────────────────────────────────────────────────────────
function RobotsTxtViewer({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-xl border border-zinc-800 bg-[#0D0D0F] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
          <span className="ml-2 text-xs text-zinc-500 font-mono">robots.txt</span>
        </div>
        <button
          onClick={copy}
          className="text-xs text-zinc-500 hover:text-white transition-colors flex items-center gap-1.5"
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="p-4 text-xs font-mono overflow-x-auto max-h-72 leading-relaxed whitespace-pre-wrap break-words">
        {content.split("\n").map((line, i) => {
          const trimmed = line.trim();
          let className = "text-zinc-400";
          if (trimmed.startsWith("#")) className = "text-zinc-600";
          else if (trimmed.toLowerCase().startsWith("user-agent:")) className = "text-blue-400";
          else if (trimmed.toLowerCase().startsWith("disallow:")) className = "text-red-400";
          else if (trimmed.toLowerCase().startsWith("allow:")) className = "text-emerald-400";
          else if (trimmed.toLowerCase().startsWith("sitemap:")) className = "text-amber-400";
          else if (trimmed.toLowerCase().startsWith("crawl-delay:")) className = "text-purple-400";
          return (
            <span key={i} className={className}>
              {line}
              {"\n"}
            </span>
          );
        })}
      </pre>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function AIBotCheckerClient() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "blocked" | "allowed" | "partial">("all");
  const [showRaw, setShowRaw] = useState(false);
  const [shareTooltip, setShareTooltip] = useState(false);
  const [selectedBot, setSelectedBot] = useState<BotResult | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (selectedBot) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [selectedBot]);

  const handleCheck = useCallback(async (overrideUrl?: string) => {
    const target = overrideUrl ?? url;
    if (!target.trim()) {
      inputRef.current?.focus();
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    setFilter("all");
    setSelectedBot(null);

    try {
      const res = await fetch(`/api/check-ai-bots?url=${encodeURIComponent(target.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setResult(data);
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    } catch {
      setError("Network error — please try again");
    } finally {
      setLoading(false);
    }
  }, [url]);

  // Auto-check from URL param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const presetUrl = params.get("url");
    if (presetUrl) {
      setUrl(presetUrl);
      handleCheck(presetUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/tools/ai-bot-checker?url=${encodeURIComponent(url)}`;
    navigator.clipboard.writeText(shareUrl);
    setShareTooltip(true);
    setTimeout(() => setShareTooltip(false), 2000);
  };

  const filteredBots = result?.bots.filter((b) =>
    filter === "all" ? true : b.status === filter
  ) ?? [];

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      {/* Ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(255,91,4,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Bot detail drawer */}
      <AnimatePresence>
        {selectedBot && (
          <BotDetailDrawer
            bot={selectedBot}
            domain={result?.domain ?? ""}
            onClose={() => setSelectedBot(null)}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-3xl mx-auto px-4 pt-20 pb-32">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-[#FF5B04]/10 border border-[#FF5B04]/20 rounded-full px-4 py-1.5 mb-6">
            <span className="text-[#FF5B04] text-xs font-semibold tracking-wider uppercase">Free Tool</span>
            <span className="w-1 h-1 rounded-full bg-[#FF5B04]/50" />
            <span className="text-zinc-400 text-xs">No sign up required</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            <span className="text-white">AI Bot</span>{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #FF5B04 0%, #FF7B34 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Crawler Check
            </span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto leading-relaxed">
            Paste any website URL to instantly see which AI bots can crawl it — GPTBot, ClaudeBot, Gemini, Perplexity & 12 more.
            <span className="block text-sm text-zinc-600 mt-1">Click any bot for full crawl rule details.</span>
          </p>
        </motion.div>

        {/* ── URL Input ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mb-10"
        >
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                </svg>
              </div>
              <input
                ref={inputRef}
                id="url-input"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                placeholder="nytimes.com or https://example.com"
                className="w-full bg-[#111113] border border-zinc-800 hover:border-zinc-700 focus:border-[#FF5B04]/60 focus:ring-2 focus:ring-[#FF5B04]/10 rounded-xl pl-10 pr-4 py-4 text-white placeholder:text-zinc-600 transition-all duration-200 outline-none text-sm"
              />
            </div>
            <motion.button
              id="check-btn"
              onClick={() => handleCheck()}
              disabled={loading}
              whileTap={{ scale: 0.97 }}
              className="px-6 py-4 rounded-xl font-semibold text-sm text-white disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex-shrink-0"
              style={{
                background: loading
                  ? "rgba(255,91,4,0.4)"
                  : "linear-gradient(135deg, #FF5B04 0%, #E54F00 100%)",
                boxShadow: loading ? "none" : "0 4px 20px rgba(255,91,4,0.3)",
              }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Checking…
                </span>
              ) : "Check Site"}
            </motion.button>
          </div>

          {/* Example quick links */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className="text-xs text-zinc-600">Try:</span>
            {["nytimes.com", "openai.com", "github.com", "reddit.com"].map((site) => (
              <button
                key={site}
                onClick={() => { setUrl(site); handleCheck(site); }}
                className="text-xs text-zinc-500 hover:text-[#FF5B04] transition-colors underline underline-offset-2 decoration-zinc-700 hover:decoration-[#FF5B04]/50"
              >
                {site}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Error ── */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-sm flex items-start gap-3"
            >
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Loading skeletons ── */}
        {loading && (
          <div className="space-y-2.5">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* ── Results ── */}
        <AnimatePresence>
          {result && !loading && (
            <motion.div ref={resultsRef} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>

              {/* Summary banner */}
              <div className="mb-5 rounded-2xl border border-zinc-800 bg-[#111113] p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-zinc-400 text-sm">Results for</span>
                      <span className="font-mono text-sm font-semibold text-white bg-zinc-800 px-2 py-0.5 rounded">
                        {result.domain}
                      </span>
                    </div>
                    {result.fetchError && (
                      <div className="text-xs text-amber-400 mt-1 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {result.fetchError}
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    <button
                      id="share-btn"
                      onClick={handleShare}
                      className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 rounded-lg px-3 py-2 transition-all duration-200"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      Share
                    </button>
                    {shareTooltip && (
                      <div className="absolute -top-8 right-0 bg-zinc-800 text-zinc-200 text-xs px-2.5 py-1 rounded-lg whitespace-nowrap">
                        Link copied!
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="text-center p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                    <div className="text-2xl font-bold text-red-400">{result.summary.blocked}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">Blocked</div>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                    <div className="text-2xl font-bold text-amber-400">{result.summary.partial}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">Partial</div>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                    <div className="text-2xl font-bold text-emerald-400">{result.summary.allowed}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">Allowed</div>
                  </div>
                </div>

                {/* X-Robots-Tag */}
                {result.xRobotsTag && (
                  <div className="mt-3 p-3 rounded-lg bg-purple-500/5 border border-purple-500/10 flex items-start gap-2">
                    <svg className="w-3.5 h-3.5 mt-0.5 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <div>
                      <span className="text-xs font-medium text-purple-400">X-Robots-Tag: </span>
                      <span className="font-mono text-xs text-zinc-400">{result.xRobotsTag}</span>
                    </div>
                  </div>
                )}

                {/* Sitemaps */}
                {result.sitemaps.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {result.sitemaps.map((sm, i) => (
                      <a key={i} href={sm} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white bg-zinc-800/60 border border-zinc-700 hover:border-zinc-500 rounded-lg px-2.5 py-1 transition-all duration-200">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        Sitemap
                      </a>
                    ))}
                  </div>
                )}

                {/* Hint */}
                <div className="mt-3 pt-3 border-t border-zinc-800/60 flex items-center gap-1.5 text-xs text-zinc-600">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
                  </svg>
                  Click any bot card to see full crawl rule details
                </div>
              </div>

              {/* Filter tabs */}
              <div className="flex gap-2 mb-4 flex-wrap">
                {(["all", "blocked", "allowed", "partial"] as const).map((f) => {
                  const counts = { all: result.bots.length, blocked: result.summary.blocked, allowed: result.summary.allowed, partial: result.summary.partial };
                  const active = filter === f;
                  const cls = {
                    all: active ? "border-zinc-400 text-white bg-zinc-800/60" : "border-zinc-800 text-zinc-500 hover:border-zinc-700",
                    blocked: active ? "border-red-500/60 text-red-400 bg-red-500/5" : "border-zinc-800 text-zinc-500 hover:border-zinc-700",
                    allowed: active ? "border-emerald-500/60 text-emerald-400 bg-emerald-500/5" : "border-zinc-800 text-zinc-500 hover:border-zinc-700",
                    partial: active ? "border-amber-500/60 text-amber-400 bg-amber-500/5" : "border-zinc-800 text-zinc-500 hover:border-zinc-700",
                  }[f];
                  return (
                    <button key={f} onClick={() => setFilter(f)}
                      className={`px-3.5 py-1.5 rounded-lg border text-xs font-medium transition-all duration-200 capitalize ${cls}`}>
                      {f} <span className="opacity-60 ml-1">({counts[f]})</span>
                    </button>
                  );
                })}
              </div>

              {/* Bot cards list */}
              <div className="space-y-2">
                {filteredBots.length === 0 ? (
                  <div className="text-center py-10 text-zinc-500 text-sm">No bots match this filter</div>
                ) : (
                  filteredBots.map((bot, i) => (
                    <BotCard key={bot.id} bot={bot} index={i} onClick={() => setSelectedBot(bot)} />
                  ))
                )}
              </div>

              {/* Raw robots.txt */}
              {result.rawRobotsTxt && (
                <div className="mt-6">
                  <button id="raw-robots-toggle" onClick={() => setShowRaw(!showRaw)}
                    className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors mb-3 group">
                    <svg className={`w-4 h-4 transition-transform duration-200 ${showRaw ? "rotate-90" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    Raw robots.txt
                    <span className="text-xs text-zinc-600 group-hover:text-zinc-500">({result.rawRobotsTxt.split("\n").length} lines)</span>
                  </button>
                  <AnimatePresence>
                    {showRaw && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                        <RobotsTxtViewer content={result.rawRobotsTxt} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                className="mt-8 p-5 rounded-2xl border border-[#FF5B04]/15 bg-gradient-to-br from-[#FF5B04]/5 to-transparent text-center"
              >
                <div className="text-sm font-semibold text-white mb-1">Want real-time AI bot monitoring for your site?</div>
                <div className="text-xs text-zinc-400 mb-3">We build AI-ready products at UI Pirate — from design to shipped.</div>
                <a id="cta-contact" href="/contact" className="inline-flex items-center gap-2 text-xs font-semibold text-[#FF5B04] hover:text-[#FF7B34] transition-colors">
                  Talk to us →
                </a>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
