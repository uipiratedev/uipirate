"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────
export type BotCategory = "ai-training" | "ai-search" | "search-engine" | "seo-tool" | "social";

interface BotResult {
  id: string;
  name: string;
  company: string;
  userAgent: string;
  description: string;
  color: string;
  category: BotCategory;
  categoryLabel: string;
  weight: number;
  status: "allowed" | "blocked" | "partial" | "unknown";
  allowedPaths: string[];
  disallowedPaths: string[];
  crawlDelay?: number;
  matchedAgent: string | null;
}

interface WafInfo {
  detected: boolean;
  provider: string | null;
  description: string | null;
}

interface ScoreBreakdown {
  overallScore: number;
  grade: "A+" | "A" | "B" | "C" | "D" | "F";
  statusText: string;
  pillars: {
    botAccessScore: number;
    aiInfrastructureScore: number;
    technicalSignalsScore: number;
  };
  recommendations: Array<{
    priority: "high" | "medium" | "low";
    title: string;
    description: string;
  }>;
}

interface CheckResult {
  domain: string;
  robotsUrl: string;
  robotsFound: boolean;
  rawRobotsTxt: string | null;
  fetchError: string | null;
  xRobotsTag: string | null;
  wafInfo: WafInfo;
  llmsTxtFound: boolean;
  llmsFullTxtFound: boolean;
  sitemaps: string[];
  bots: BotResult[];
  score: ScoreBreakdown;
  recommendedRobotsSnippet: string;
  summary: { total: number; blocked: number; allowed: number; partial: number };
}

// ─── SVG Company Logos ────────────────────────────────────────────────────────
function OpenAIIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387 2.019-1.168a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.41-.663zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
    </svg>
  );
}

function AnthropicIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.0603 3.6001H13.9067L20 20.4001H23.1536L17.0603 3.6001ZM6.9397 3.6001L0.846375 20.4001H4.07062L5.47984 16.4765H11.573L12.9822 20.4001H16.2065L10.1132 3.6001H6.9397ZM6.4504 13.6741L8.5264 7.8961L10.6024 13.6741H6.4504Z" />
    </svg>
  );
}

function GoogleIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
    </svg>
  );
}

function PerplexityIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.3977 8.1191L17.5667 12.3622V5.6245L22.3977 1.3814V8.1191ZM14.8241 20.3751H9.1756L6.3743 22.6186V15.8812H17.6255V22.6186L14.8241 20.3751ZM6.4333 12.3622L1.6023 8.1191V1.3814L6.4333 5.6245V12.3622ZM16.8566 0H7.1434L6.4333 0.5902V4.8334L1.6023 0.5902H0V9.1438L5.6842 13.8438V17.4997L0 22.1997V23.9998H5.6842L6.4333 23.4097V19.1665L11.9997 23.4097L17.5661 19.1665V23.4097L18.3152 23.9998H24V22.1997L18.3158 17.4997V13.8438L24 9.1438V0.5902L22.3977 0.5902L17.5667 4.8334V0.5902L16.8566 0Z" />
    </svg>
  );
}

function MetaIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.186-.325.34-.6.48-.842l.797-1.458.126-.234c1.282-2.353 2.477-3.662 3.798-3.662.965 0 1.807.578 2.512 1.673.22.343.402.706.541 1.107.14.4.199.776.199 1.12 0 .52-.104 1.028-.297 1.51a3.13 3.13 0 0 1-.87 1.185 2.22 2.22 0 0 1-1.471.494 2.483 2.483 0 0 1-1.518-.535c-.305-.246-.591-.578-.856-1.006l-1.726 2.068a5.34 5.34 0 0 0 1.283 1.164A5.128 5.128 0 0 0 17.16 19.9c1.278 0 2.489-.312 3.516-.907a6.88 6.88 0 0 0 2.51-2.475 7.28 7.28 0 0 0 .814-3.434c0-1.104-.195-2.167-.583-3.17a8.823 8.823 0 0 0-1.684-2.756c-.81-.912-1.89-1.427-3.167-1.427-1.278 0-2.394.614-3.36 1.7-.433.487-.87 1.106-1.32 1.863l-.648 1.096-.077.135-1.08 1.922c-1.07 1.91-1.68 2.94-2.452 3.985-.994 1.34-1.83 1.963-2.72 1.963-.782 0-1.348-.345-1.783-1.073-.249-.42-.44-.94-.564-1.548a9.384 9.384 0 0 1-.12-1.542c0-1.965.557-4.232 1.536-5.861.783-1.311 1.745-2.019 2.681-2.019.498 0 .99.177 1.449.542.37.293.713.7 1.012 1.214l1.73-2.079a5.987 5.987 0 0 0-1.334-1.189A4.57 4.57 0 0 0 6.915 4.03z" />
    </svg>
  );
}

function MicrosoftIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4zM11.4 24H0V12.6h11.4V24zm12.6 0H12.6V12.6H24V24z" />
    </svg>
  );
}

function AppleIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z" />
    </svg>
  );
}

function ByteDanceIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.27 8.27 0 0 0 4.84 1.56V6.78a4.85 4.85 0 0 1-1.07-.09z" />
    </svg>
  );
}

function GenericBotIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      <line x1="8" y1="16" x2="8.01" y2="16" />
      <line x1="16" y1="16" x2="16.01" y2="16" />
    </svg>
  );
}

function BotIcon({ id, className = "w-5 h-5" }: { id: string; className?: string }) {
  const map: Record<string, React.FC<{ className?: string }>> = {
    gptbot: OpenAIIcon,
    "chatgpt-user": OpenAIIcon,
    claudebot: AnthropicIcon,
    "anthropic-ai": AnthropicIcon,
    "google-extended": GoogleIcon,
    googlebot: GoogleIcon,
    perplexitybot: PerplexityIcon,
    "meta-externalagent": MetaIcon,
    facebookexternalhit: MetaIcon,
    "applebot-extended": AppleIcon,
    bytespider: ByteDanceIcon,
    bingbot: MicrosoftIcon,
  };
  const Icon = map[id] ?? GenericBotIcon;
  return <Icon className={className} />;
}

// ─── Status Visual System ─────────────────────────────────────────────────────
const STATUS = {
  allowed: {
    label: "Allowed",
    pill: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-500",
    leftBar: "bg-emerald-500",
    desc: "This crawler has full access to index and read your website content.",
    drawerBorder: "border-emerald-200",
    drawerBg: "bg-emerald-50/40",
  },
  blocked: {
    label: "Blocked",
    pill: "bg-red-50 text-red-700 border border-red-200",
    dot: "bg-red-500",
    leftBar: "bg-red-500",
    desc: "Explicitly blocked via robots.txt or server headers. This bot cannot access your content.",
    drawerBorder: "border-red-200",
    drawerBg: "bg-red-50/40",
  },
  partial: {
    label: "Partial",
    pill: "bg-amber-50 text-amber-700 border border-amber-200",
    dot: "bg-amber-500",
    leftBar: "bg-amber-500",
    desc: "Some paths are disallowed while others remain open for crawling.",
    drawerBorder: "border-amber-200",
    drawerBg: "bg-amber-50/40",
  },
  unknown: {
    label: "Unknown",
    pill: "bg-gray-100 text-gray-600 border border-gray-200",
    dot: "bg-gray-400",
    leftBar: "bg-gray-300",
    desc: "No explicit rule found. Governed by default wildcard rules.",
    drawerBorder: "border-gray-200",
    drawerBg: "bg-gray-50/40",
  },
};

function StatusPill({ status }: { status: BotResult["status"] }) {
  const s = STATUS[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${s.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

// ─── Score Meter Component ───────────────────────────────────────────────────
function ScoreRing({ score, grade }: { score: number; grade: string }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let strokeColor = "#EF4444"; // red
  if (score >= 80) strokeColor = "#10B981"; // emerald
  else if (score >= 60) strokeColor = "#F59E0B"; // amber

  return (
    <div className="relative w-36 h-36 flex items-center justify-center flex-shrink-0">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
        <circle
          cx="64"
          cy="64"
          r={radius}
          stroke="#E5E7EB"
          strokeWidth="10"
          fill="transparent"
        />
        <motion.circle
          cx="64"
          cy="64"
          r={radius}
          stroke={strokeColor}
          strokeWidth="10"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-bold font-geist text-gray-900 leading-none">{score}</span>
        <span className="text-[11px] font-semibold text-gray-400 font-jetbrains-mono mt-1">/ 100</span>
        <span className="text-[10px] uppercase tracking-wider font-bold text-[#FF5B04] mt-0.5 bg-[#FF5B04]/10 px-2 py-0.5 rounded-full">
          Grade {grade}
        </span>
      </div>
    </div>
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
  const s = STATUS[bot.status];
  const [copiedFix, setCopiedFix] = useState(false);

  const fixSnippet = `# Allow ${bot.name} in robots.txt\nUser-agent: ${bot.userAgent}\nAllow: /`;

  const copyFix = () => {
    navigator.clipboard.writeText(fixSnippet);
    setCopiedFix(true);
    setTimeout(() => setCopiedFix(false), 2000);
  };

  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40"
        onClick={onClose}
      />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        className="fixed right-0 top-0 bottom-0 w-full max-w-[460px] z-50 flex flex-col bg-white border-l border-gray-200 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${bot.color}15`, color: bot.color }}
            >
              <BotIcon id={bot.id} className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-gray-900 font-jakarta text-[15px] leading-tight">{bot.name}</h2>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                  {bot.categoryLabel}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{bot.company}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all duration-150"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Status banner */}
          <div className={`rounded-xl p-4 border ${s.drawerBorder} ${s.drawerBg}`}>
            <div className="flex items-center justify-between mb-2">
              <StatusPill status={bot.status} />
              <span className="text-xs text-gray-400 font-mono">{domain}</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
          </div>

          {/* Crawl Stats */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="rounded-xl bg-gray-50 border border-gray-100 p-3 text-center">
              <div className="text-xl font-bold font-geist text-red-600">{bot.disallowedPaths.length}</div>
              <div className="text-[10px] text-gray-400 mt-0.5">Blocked paths</div>
            </div>
            <div className="rounded-xl bg-gray-50 border border-gray-100 p-3 text-center">
              <div className="text-xl font-bold font-geist text-emerald-600">{bot.allowedPaths.length}</div>
              <div className="text-[10px] text-gray-400 mt-0.5">Allowed paths</div>
            </div>
            <div className="rounded-xl bg-gray-50 border border-gray-100 p-3 text-center">
              <div className="text-xl font-bold font-geist text-gray-800">
                {bot.crawlDelay != null ? `${bot.crawlDelay}s` : "—"}
              </div>
              <div className="text-[10px] text-gray-400 mt-0.5">Crawl delay</div>
            </div>
          </div>

          {/* Directive details */}
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-2.5 text-xs">
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Robots.txt Rule Match
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Target User-Agent</span>
              <span className="font-mono bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-800">
                {bot.userAgent}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Matched Directive</span>
              <span className="font-mono bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-800">
                {bot.matchedAgent ?? "None (Default)"}
              </span>
            </div>
          </div>

          {/* Quick Copy Fix if Blocked */}
          {bot.status === "blocked" && (
            <div className="rounded-xl border border-[#FF5B04]/20 bg-[#FFF9F5] p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#FF5B04]">Copy-Paste Fix Snippet</span>
                <button
                  onClick={copyFix}
                  className="text-xs font-semibold text-[#FF5B04] hover:underline"
                >
                  {copiedFix ? "Copied!" : "Copy code"}
                </button>
              </div>
              <pre className="p-3 bg-white border border-gray-200 rounded-lg text-xs font-mono text-gray-800">
                {fixSnippet}
              </pre>
            </div>
          )}

          {/* Blocked Paths List */}
          {bot.disallowedPaths.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Disallowed Paths ({bot.disallowedPaths.length})
              </div>
              <div className="rounded-xl border border-red-100 bg-red-50/30 overflow-hidden text-xs font-mono">
                {bot.disallowedPaths.map((p, i) => (
                  <div key={i} className="px-3.5 py-2 border-b border-red-100/50 last:border-0 text-red-700">
                    ✕ {p}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bot info */}
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-xs space-y-2">
            <div className="font-semibold text-gray-400 uppercase tracking-wider mb-1">About Crawler</div>
            <p className="text-gray-600 leading-relaxed">{bot.description}</p>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ─── Main Client Component ────────────────────────────────────────────────────
export default function AIBotCheckerClient() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<"all" | BotCategory>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "blocked" | "allowed" | "partial">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBot, setSelectedBot] = useState<BotResult | null>(null);
  const [copiedRobots, setCopiedRobots] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [showRaw, setShowRaw] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleCheck = useCallback(async (overrideUrl?: string) => {
    const target = overrideUrl ?? url;
    if (!target.trim()) {
      inputRef.current?.focus();
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    setSelectedBot(null);

    try {
      const res = await fetch(`/api/check-ai-bots?url=${encodeURIComponent(target.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to scan website");
      } else {
        setResult(data);
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 150);
      }
    } catch {
      setError("Network connection issue. Please verify URL and try again.");
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("url");
    if (p) {
      setUrl(p);
      handleCheck(p);
    }
  }, [handleCheck]);

  const handleCopyRobots = () => {
    if (!result?.recommendedRobotsSnippet) return;
    navigator.clipboard.writeText(result.recommendedRobotsSnippet);
    setCopiedRobots(true);
    setTimeout(() => setCopiedRobots(false), 2000);
  };

  const handleShare = () => {
    if (!result) return;
    const shareUrl = `${window.location.origin}/tools/ai-bot-checker?url=${encodeURIComponent(result.domain)}`;
    navigator.clipboard.writeText(shareUrl);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const filteredBots = useMemo(() => {
    if (!result) return [];
    return result.bots.filter((b) => {
      const matchesCat = activeCategory === "all" || b.category === activeCategory;
      const matchesStatus = statusFilter === "all" || b.status === statusFilter;
      const matchesSearch =
        !searchQuery.trim() ||
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.userAgent.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesStatus && matchesSearch;
    });
  }, [result, activeCategory, statusFilter, searchQuery]);

  const AnimatePresenceAny = AnimatePresence as any;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <AnimatePresenceAny>
        {selectedBot ? (
          <BotDetailDrawer
            bot={selectedBot}
            domain={result?.domain ?? ""}
            onClose={() => setSelectedBot(null)}
          />
        ) : null}
      </AnimatePresenceAny>

      {/* Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-20 xl:px-32 pt-28 pb-10">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 shadow-sm rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B04]" />
            <span className="text-[#FF5B04] text-xs font-semibold font-jetbrains-mono uppercase tracking-wider">
              AI Search & Visibility Hub
            </span>
            <span className="w-px h-3 bg-gray-200" />
            <span className="text-gray-400 text-xs">Test 26+ Crawlers & GEO Score</span>
          </div>

          <h1 className="heading-hero text-gray-900 mb-4">
            AI Crawler & <span className="text-[#FF5B04]">GEO Readiness</span> Checker
          </h1>
          <p className="sub-header">
            Audit your site across 26+ AI bots, search engines, and social crawlers. Check robots.txt, llms.txt, WAF firewalls, and generative engine visibility.
          </p>
        </motion.div>

        {/* URL Input */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.45 }}
          className="max-w-2xl mx-auto mb-4"
        >
          <div className="flex gap-2 bg-white border border-gray-200 rounded-2xl p-2 shadow-sm focus-within:border-[#FF5B04]/40 focus-within:shadow-md transition-all duration-200">
            <div className="relative flex-1">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth="1.8" />
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" strokeWidth="1.8" />
                </svg>
              </div>
              <input
                ref={inputRef}
                id="url-input"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                placeholder="example.com or https://yoursite.com"
                className="w-full bg-transparent pl-10 pr-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none text-sm font-jakarta"
              />
            </div>
            <button
              id="check-btn"
              onClick={() => handleCheck()}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl font-semibold text-sm text-white bg-[#FF5B04] hover:bg-[#E54F00] disabled:opacity-60 transition-colors duration-200 flex items-center gap-2 flex-shrink-0 cursor-pointer"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Auditing…
                </>
              ) : (
                "Audit Site"
              )}
            </button>
          </div>

          {/* Quick Examples */}
          <div className="flex items-center gap-2 mt-3 justify-center flex-wrap">
            <span className="text-xs text-gray-400">Popular audits:</span>
            {["nytimes.com", "openai.com", "uipirate.com", "github.com"].map((s) => (
              <button
                key={s}
                onClick={() => {
                  setUrl(s);
                  handleCheck(s);
                }}
                className="text-xs text-gray-500 hover:text-[#FF5B04] transition-colors underline underline-offset-2 decoration-gray-300"
              >
                {s}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Error state */}
      {error && (
        <div className="container mx-auto px-4 max-w-2xl mb-8">
          <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm flex items-center gap-3">
            <svg className="w-5 h-5 flex-shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Main Results Container */}
      <div ref={resultsRef} className="container mx-auto px-4 sm:px-6 lg:px-20 xl:px-32 pb-24">
        {result && (
          <div className="space-y-8 max-w-5xl mx-auto">
            {/* 1. GEO & AI Visibility Score Card */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                {/* Score Circle */}
                <div className="flex items-center gap-6">
                  <ScoreRing score={result.score.overallScore} grade={result.score.grade} />
                  <div>
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      GEO & AI Visibility Score
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 font-jakarta mt-1">
                      {result.score.statusText}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1 max-w-sm">
                      Domain: <span className="font-mono font-bold text-gray-800">{result.domain}</span>
                    </p>
                  </div>
                </div>

                {/* Score Pillars */}
                <div className="w-full md:w-72 space-y-3 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-gray-100 md:pl-8">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-gray-600 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-[#FF5B04]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeWidth="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeWidth="2" />
                        </svg>
                        Bot Access (60%)
                      </span>
                      <span className="text-gray-900 font-mono">{result.score.pillars.botAccessScore}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#FF5B04] rounded-full transition-all duration-500"
                        style={{ width: `${result.score.pillars.botAccessScore}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-gray-600 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        AI Files (25%)
                      </span>
                      <span className="text-gray-900 font-mono">{result.score.pillars.aiInfrastructureScore}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${result.score.pillars.aiInfrastructureScore}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-gray-600 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <circle cx="12" cy="12" r="3" strokeWidth="2" />
                        </svg>
                        Tech Signals (15%)
                      </span>
                      <span className="text-gray-900 font-mono">{result.score.pillars.technicalSignalsScore}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${result.score.pillars.technicalSignalsScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 w-full md:w-auto">
                  <button
                    onClick={handleShare}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-white transition-all flex items-center justify-center gap-2"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    {shareCopied ? "Link Copied!" : "Share Report"}
                  </button>
                  <a
                    href="#recommendations"
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gray-900 hover:bg-black transition-all flex items-center justify-center gap-1.5"
                  >
                    View Fixes ({result.score.recommendations.length})
                  </a>
                </div>
              </div>
            </div>

            {/* 2. Technical & AI Infrastructure Signals Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* robots.txt */}
              <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-500">robots.txt</span>
                  <span className={`w-2 h-2 rounded-full ${result.robotsFound ? "bg-emerald-500" : "bg-red-500"}`} />
                </div>
                <div className="text-sm font-bold text-gray-900">
                  {result.robotsFound ? "Configured" : "Missing"}
                </div>
                <div className="text-[11px] text-gray-400 mt-0.5 truncate">
                  {result.rawRobotsTxt ? `${result.rawRobotsTxt.split("\n").length} lines parsed` : "No file found"}
                </div>
              </div>

              {/* llms.txt */}
              <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-500">llms.txt</span>
                  <span className={`w-2 h-2 rounded-full ${result.llmsTxtFound ? "bg-emerald-500" : "bg-amber-500"}`} />
                </div>
                <div className="text-sm font-bold text-gray-900">
                  {result.llmsTxtFound ? "Active" : "Not Found"}
                </div>
                <div className="text-[11px] text-gray-400 mt-0.5">
                  {result.llmsTxtFound ? "AI Context Standard" : "Missing standard file"}
                </div>
              </div>

              {/* llms-full.txt */}
              <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-500">llms-full.txt</span>
                  <span className={`w-2 h-2 rounded-full ${result.llmsFullTxtFound ? "bg-emerald-500" : "bg-amber-500"}`} />
                </div>
                <div className="text-sm font-bold text-gray-900">
                  {result.llmsFullTxtFound ? "Active" : "Not Found"}
                </div>
                <div className="text-[11px] text-gray-400 mt-0.5">
                  {result.llmsFullTxtFound ? "Full AI Knowledge" : "Missing deep context"}
                </div>
              </div>

              {/* WAF / Firewall */}
              <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-500">WAF / Edge</span>
                  <span className={`w-2 h-2 rounded-full ${result.wafInfo.detected ? "bg-blue-500" : "bg-gray-300"}`} />
                </div>
                <div className="text-sm font-bold text-gray-900 truncate">
                  {result.wafInfo.detected ? result.wafInfo.provider : "None Detected"}
                </div>
                <div className="text-[11px] text-gray-400 mt-0.5 truncate">
                  {result.wafInfo.detected ? "Firewall Active" : "Direct origin"}
                </div>
              </div>
            </div>

            {/* WAF Warning Alert if Detected */}
            {result.wafInfo.detected && result.wafInfo.description && (
              <div className="p-4 rounded-2xl border border-blue-100 bg-blue-50/50 flex items-start gap-3">
                <svg className="w-5 h-5 flex-shrink-0 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <div className="text-xs text-blue-900 leading-relaxed">
                  <span className="font-bold">{result.wafInfo.provider} Detected: </span>
                  {result.wafInfo.description}
                </div>
              </div>
            )}

            {/* 3. AI Search Simulation ("Before & After") */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-xs font-semibold text-[#FF5B04] uppercase tracking-wider">
                    Generative Search Simulation
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 font-jakarta mt-0.5">
                    What AI Assistants (ChatGPT, Perplexity, Claude) Return
                  </h3>
                </div>
                <span className="text-xs text-gray-400 font-mono hidden sm:inline">Live Query Comparison</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Blocked State */}
                <div className="rounded-2xl border border-red-200 bg-red-50/30 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700">
                        When Blocked
                      </span>
                      <span className="text-xs text-gray-400">Query: &quot;What is {result.domain}?&quot;</span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed italic">
                      &quot;I don&apos;t have real-time access to {result.domain} because the website blocks automated crawlers. I cannot provide verified current pricing, service details, or cite direct source pages.&quot;
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-red-100 text-[11px] text-red-600 font-medium flex items-center gap-1.5">
                    <span>✕</span> Missing from AI Search citations & answers
                  </div>
                </div>

                {/* Allowed State */}
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/30 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700">
                        When Optimized
                      </span>
                      <span className="text-xs text-gray-400">Query: &quot;What is {result.domain}?&quot;</span>
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed font-medium">
                      &quot;According to {result.domain}, they offer verified product solutions with full structured pricing and documentation...&quot;
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-emerald-100 text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5">
                    <span>✓</span> Cited with direct source backlink in ChatGPT & Perplexity
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Filterable Bot Crawler Explorer */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 font-jakarta">
                    Crawler Access Breakdown ({result.bots.length} Bots)
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Click any crawler card to inspect exact rules and blocked paths
                  </p>
                </div>

                {/* Search in results */}
                <div className="relative w-full md:w-64">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search bots (e.g. GPTBot)"
                    className="w-full px-3.5 py-2 pl-8 rounded-xl border border-gray-200 text-xs bg-gray-50 focus:bg-white focus:outline-none focus:border-[#FF5B04]"
                  />
                  <svg className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" strokeWidth="2" />
                    <path d="m21 21-4.35-4.35" strokeWidth="2" />
                  </svg>
                </div>
              </div>

              {/* Category Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
                {[
                  { id: "all", label: "All Crawlers", count: result.bots.length },
                  { id: "ai-training", label: "AI Training", count: result.bots.filter((b) => b.category === "ai-training").length },
                  { id: "ai-search", label: "AI Search", count: result.bots.filter((b) => b.category === "ai-search").length },
                  { id: "search-engine", label: "Search Engines", count: result.bots.filter((b) => b.category === "search-engine").length },
                  { id: "seo-tool", label: "SEO Tools", count: result.bots.filter((b) => b.category === "seo-tool").length },
                  { id: "social", label: "Social", count: result.bots.filter((b) => b.category === "social").length },
                ].map((tab) => {
                  const active = activeCategory === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveCategory(tab.id as typeof activeCategory)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                        active
                          ? "bg-gray-900 text-white shadow-sm"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {tab.label} <span className="opacity-60 text-[10px] ml-1">({tab.count})</span>
                    </button>
                  );
                })}
              </div>

              {/* Status Filter Pills */}
              <div className="flex gap-2 mb-6 flex-wrap">
                {(["all", "blocked", "allowed", "partial"] as const).map((st) => {
                  const active = statusFilter === st;
                  const count =
                    st === "all"
                      ? result.bots.length
                      : result.bots.filter((b) => b.status === st).length;

                  return (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium capitalize border transition-all ${
                        active
                          ? "bg-[#FF5B04] text-white border-[#FF5B04]"
                          : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {st} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Bot Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredBots.map((bot, i) => {
                  const s = STATUS[bot.status];
                  return (
                    <motion.button
                      key={bot.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.02 }}
                      onClick={() => setSelectedBot(bot)}
                      className="group relative bg-white border border-gray-200 hover:border-[#FF5B04]/40 hover:shadow-md rounded-2xl p-4 text-left transition-all flex items-center justify-between cursor-pointer"
                    >
                      <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-full ${s.leftBar}`} />
                      <div className="flex items-center gap-3.5 pl-2 min-w-0 flex-1">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${bot.color}15`, color: bot.color }}
                        >
                          <BotIcon id={bot.id} className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900 text-sm truncate">{bot.name}</span>
                            <span className="text-[10px] font-mono text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
                              {bot.categoryLabel}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5 truncate">{bot.company}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <StatusPill status={bot.status} />
                        <span className="text-gray-300 group-hover:text-[#FF5B04] transition-colors">→</span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* 5. Recommended AI-Ready robots.txt Generator */}
            <div id="recommendations" className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <div className="text-xs font-semibold text-[#FF5B04] uppercase tracking-wider">
                    Recommended Fix
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 font-jakarta mt-0.5">
                    Optimized AI robots.txt Configuration
                  </h3>
                </div>
                <button
                  onClick={handleCopyRobots}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#FF5B04] hover:bg-[#E54F00] transition-colors flex items-center gap-2 w-fit"
                >
                  {copiedRobots ? "Copied to Clipboard!" : "Copy Full robots.txt"}
                </button>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                Deploy this file at <code className="font-mono text-gray-800">https://{result.domain}/robots.txt</code> to allow essential AI search crawlers while keeping scrapers governed.
              </p>
              <pre className="p-4 rounded-2xl bg-gray-900 text-gray-200 text-xs font-mono overflow-x-auto leading-relaxed max-h-64">
                {result.recommendedRobotsSnippet}
              </pre>
            </div>

            {/* 6. Raw robots.txt Viewer Toggle */}
            {result.rawRobotsTxt && (
              <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                <button
                  onClick={() => setShowRaw(!showRaw)}
                  className="w-full flex items-center justify-between text-xs font-semibold text-gray-700"
                >
                  <span>View Raw robots.txt ({result.rawRobotsTxt.split("\n").length} lines)</span>
                  <span>{showRaw ? "▲ Hide" : "▼ Show"}</span>
                </button>
                {showRaw && (
                  <pre className="mt-3 p-4 bg-gray-50 border border-gray-100 rounded-xl text-xs font-mono text-gray-600 overflow-x-auto max-h-60 leading-relaxed">
                    {result.rawRobotsTxt}
                  </pre>
                )}
              </div>
            )}

            {/* 7. Agency CTA */}
            <div className="p-8 rounded-3xl border border-gray-200 bg-white shadow-sm text-center">
              <div className="inline-flex items-center gap-2 bg-[#FF5B04]/10 text-[#FF5B04] text-xs font-semibold font-jetbrains-mono uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                UI Pirate Growth & AI Design
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 font-jakarta mb-2">
                Need Help Optimizing Your Site for AI Search Engines?
              </h3>
              <p className="text-sm text-gray-500 max-w-lg mx-auto mb-6">
                We design and engineer high-performing, AI-ready web products and SaaS applications with full schema, SSR rendering, and Generative Engine Optimization.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF5B04] hover:bg-[#E54F00] text-white text-sm font-semibold transition-all shadow-md shadow-[#FF5B04]/20"
              >
                Book a Free Strategy Call →
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
