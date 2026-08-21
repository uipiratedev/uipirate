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
  summary: { total: number; blocked: number; allowed: number; partial: number };
}

// ─── SVG Company Logos ────────────────────────────────────────────────────────
// Inline SVGs so no external deps or emoji needed

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

function AmazonIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595l.315-.14c.138-.06.234-.1.293-.13.226-.088.39-.046.525.13.12.174.09.336-.12.48-.256.19-.6.41-1.006.63C18.056 21.99 15.9 22.756 13.33 23.1c-.53.063-1.093.094-1.683.094-4.378 0-8.427-1.098-12.075-3.275-.21-.148-.28-.32-.162-.483l.636-.415zM14.485 3.8l-.08.127c-.02.04-.048.073-.07.107-1.44 2.334-3.285 4.05-5.587 5.142-1.248.595-2.466.894-3.7.894-.92 0-1.838-.186-2.67-.567-2.14-.99-3.18-2.743-3.044-5.21.133-2.27 1.19-4.223 3.123-5.8 1.782-1.43 3.832-2.148 6.038-2.148 1.65 0 3.21.403 4.56 1.185.56.33 1.07.737 1.547 1.215.13.12.154.248.073.382l-.19.672z" />
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

function CommonCrawlIcon({ className = "w-5 h-5" }: { className?: string }) {
  // Generic web/crawl icon
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function CohereIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="currentColor">
      <circle cx="50" cy="50" r="18" />
      <circle cx="25" cy="50" r="10" opacity=".7" />
      <circle cx="75" cy="50" r="10" opacity=".7" />
      <circle cx="50" cy="25" r="10" opacity=".7" />
      <circle cx="50" cy="75" r="10" opacity=".7" />
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

// Map bot id → icon component
function BotIcon({ id, className = "w-5 h-5" }: { id: string; className?: string }) {
  const map: Record<string, React.FC<{ className?: string }>> = {
    gptbot: OpenAIIcon,
    "chatgpt-user": OpenAIIcon,
    claudebot: AnthropicIcon,
    "anthropic-ai": AnthropicIcon,
    "google-extended": GoogleIcon,
    perplexitybot: PerplexityIcon,
    ccbot: CommonCrawlIcon,
    bytespider: ByteDanceIcon,
    amazonbot: AmazonIcon,
    "meta-externalagent": MetaIcon,
    "applebot-extended": AppleIcon,
    "cohere-ai": CohereIcon,
  };
  const Icon = map[id] ?? GenericBotIcon;
  return <Icon className={className} />;
}

// ─── Status helpers ───────────────────────────────────────────────────────────
const STATUS = {
  allowed: {
    label: "Allowed",
    pill: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-500",
    leftBar: "bg-emerald-500",
    tag: "bg-emerald-500/10 text-emerald-700",
    desc: "This AI bot can fully crawl your site. Your content may be used to train AI models or appear in AI-powered search results.",
    drawerBorder: "border-emerald-200",
    drawerBg: "bg-emerald-50/50",
  },
  blocked: {
    label: "Blocked",
    pill: "bg-red-50 text-red-700 border border-red-200",
    dot: "bg-red-500",
    leftBar: "bg-red-500",
    tag: "bg-red-500/10 text-red-700",
    desc: "This AI bot is explicitly blocked from crawling your site via robots.txt. Your content will not be used by this AI.",
    drawerBorder: "border-red-200",
    drawerBg: "bg-red-50/50",
  },
  partial: {
    label: "Partial",
    pill: "bg-amber-50 text-amber-700 border border-amber-200",
    dot: "bg-amber-500",
    leftBar: "bg-amber-500",
    tag: "bg-amber-500/10 text-amber-700",
    desc: "This AI bot can access some parts of your site. Specific paths are blocked while others remain accessible.",
    drawerBorder: "border-amber-200",
    drawerBg: "bg-amber-50/50",
  },
  unknown: {
    label: "Unknown",
    pill: "bg-gray-100 text-gray-600 border border-gray-200",
    dot: "bg-gray-400",
    leftBar: "bg-gray-300",
    tag: "bg-gray-100 text-gray-600",
    desc: "No specific rules found for this bot. It falls under default access rules (usually allowed unless blocked by a wildcard).",
    drawerBorder: "border-gray-200",
    drawerBg: "bg-gray-50/50",
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

// ─── Inline SVG icons for UI actions ─────────────────────────────────────────
const IconGlobe = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);
const IconShare = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);
const IconCopy = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);
const IconCheck = () => (
  <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconX = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconChevronRight = () => (
  <svg className="w-4 h-4 text-gray-400 group-hover:text-[#FF5B04] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const IconChevronDown = ({ open }: { open: boolean }) => (
  <svg className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const IconInfo = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);
const IconCode = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
  </svg>
);
const IconBlocked = () => (
  <svg className="w-3.5 h-3.5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
  </svg>
);
const IconAllowed = () => (
  <svg className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconMap = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" /><line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" />
  </svg>
);
const IconSpinner = () => (
  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);
const IconArrow = () => (
  <svg className="w-3.5 h-3.5 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);
const IconCursor = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m5 3 14 9-7 1-3 6Z" />
  </svg>
);

// ─── Bot Detail Drawer ────────────────────────────────────────────────────────
function BotDetailDrawer({ bot, domain, onClose }: { bot: BotResult; domain: string; onClose: () => void }) {
  const s = STATUS[bot.status];
  const totalPaths = bot.allowedPaths.length + bot.disallowedPaths.length;

  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40"
        onClick={onClose}
      />
      {/* Panel */}
      <motion.div
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        className="fixed right-0 top-0 bottom-0 w-full max-w-[440px] z-50 flex flex-col bg-white border-l border-gray-200 shadow-2xl"
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
              <h2 className="font-semibold text-gray-900 font-jakarta text-[15px] leading-tight">{bot.name}</h2>
              <p className="text-xs text-gray-400 mt-0.5">{bot.company}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all duration-150 mt-0.5"
          >
            <IconX />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-5 py-4 space-y-4">

            {/* Status card */}
            <div className={`rounded-xl p-4 border ${s.drawerBorder} ${s.drawerBg}`}>
              <div className="flex items-center justify-between mb-2">
                <StatusPill status={bot.status} />
                <span className="text-xs text-gray-400 font-mono truncate ml-2">{domain}</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { val: bot.disallowedPaths.length, label: "Blocked paths", color: "text-red-600" },
                { val: bot.allowedPaths.length, label: "Allowed paths", color: "text-emerald-600" },
                { val: bot.crawlDelay != null ? `${bot.crawlDelay}s` : "—", label: "Crawl delay", color: "text-gray-800" },
              ].map((item) => (
                <div key={item.label} className="rounded-xl bg-gray-50 border border-gray-100 p-3 text-center">
                  <div className={`text-xl font-bold font-geist ${item.color}`}>{item.val}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5 leading-tight">{item.label}</div>
                </div>
              ))}
            </div>

            {/* robots.txt rule */}
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
                <IconCode />
                robots.txt rule match
              </div>
              <div className="space-y-2.5 text-sm">
                {[
                  { label: "Directive", val: bot.matchedAgent ?? "No match", mono: true },
                  { label: "User-Agent", val: bot.userAgent, mono: true },
                  { label: "Rule type", val: bot.matchedAgent === "*" ? "Wildcard (*)" : bot.matchedAgent ? "Specific rule" : "Default (no rule)", mono: false },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between gap-3">
                    <span className="text-xs text-gray-400 flex-shrink-0">{row.label}</span>
                    <span className={`text-xs text-gray-700 ${row.mono ? "font-mono bg-white border border-gray-200 px-2 py-0.5 rounded-md truncate max-w-[200px]" : ""}`}>
                      {row.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Disallowed paths */}
            {bot.disallowedPaths.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                  Blocked from crawling ({bot.disallowedPaths.length})
                </div>
                <div className="rounded-xl border border-red-100 bg-red-50/40 overflow-hidden">
                  {bot.disallowedPaths.map((path, i) => (
                    <div key={i} className={`flex items-center gap-2.5 px-3.5 py-2.5 ${i < bot.disallowedPaths.length - 1 ? "border-b border-red-100/60" : ""}`}>
                      <IconBlocked />
                      <span className="font-mono text-xs text-gray-600 break-all">{path}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Allowed paths */}
            {bot.allowedPaths.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                  Explicitly allowed ({bot.allowedPaths.length})
                </div>
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 overflow-hidden">
                  {bot.allowedPaths.map((path, i) => (
                    <div key={i} className={`flex items-center gap-2.5 px-3.5 py-2.5 ${i < bot.allowedPaths.length - 1 ? "border-b border-emerald-100/60" : ""}`}>
                      <IconAllowed />
                      <span className="font-mono text-xs text-gray-600 break-all">{path}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No rules */}
            {totalPaths === 0 && (
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-center">
                <p className="text-sm text-gray-500">No specific path rules defined</p>
                <p className="text-xs text-gray-400 mt-1">
                  {bot.matchedAgent ? "Access is governed by the matched rule above" : "No explicit restrictions found"}
                </p>
              </div>
            )}

            {/* About */}
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
                <IconInfo />
                About {bot.name}
              </div>
              <div className="space-y-2.5">
                {[
                  { label: "Company", val: bot.company },
                  { label: "Purpose", val: bot.description },
                  { label: "User-Agent", val: bot.userAgent, mono: true },
                ].map((row) => (
                  <div key={row.label} className="flex items-start gap-3">
                    <span className="text-xs text-gray-400 w-20 flex-shrink-0 pt-0.5">{row.label}</span>
                    <span className={`text-xs text-gray-700 break-all ${(row as { mono?: boolean }).mono ? "font-mono" : ""}`}>{row.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* What this means */}
            <div className="rounded-xl border border-[#FF5B04]/15 p-4" style={{ background: "linear-gradient(135deg, #FFF5F0 0%, #FAFAFA 100%)" }}>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#FF5B04] uppercase tracking-wider mb-2">
                <IconInfo />
                What this means for you
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                {bot.status === "blocked" && `${bot.name} is blocked from indexing ${domain}. Your content won't appear in ${bot.company}'s AI training data or AI-powered search.`}
                {bot.status === "allowed" && `${bot.name} has full access to ${domain}. ${bot.company} may use your content to train AI models or include it in AI search results.`}
                {bot.status === "partial" && `${bot.name} has restricted access. ${bot.disallowedPaths.length} path(s) are blocked, but other parts of the site can still be crawled.`}
                {bot.status === "unknown" && `No explicit rule for ${bot.name} was found. It may crawl unless covered by a wildcard (*) rule.`}
              </p>
            </div>

            <div className="h-2" />
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ─── Bot Card ─────────────────────────────────────────────────────────────────
function BotCard({ bot, index, onClick }: { bot: BotResult; index: number; onClick: () => void }) {
  const s = STATUS[bot.status];
  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.025, duration: 0.3 }}
      onClick={onClick}
      className="group relative w-full bg-white border border-gray-200 hover:border-[#FF5B04]/40 hover:shadow-md rounded-xl text-left cursor-pointer transition-all duration-200 overflow-hidden"
      whileTap={{ scale: 0.995 }}
    >
      {/* Left status accent */}
      <div className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-full ${s.leftBar} opacity-70 group-hover:opacity-100 transition-opacity`} />

      <div className="pl-5 pr-4 py-3.5 flex items-center gap-3">
        {/* Icon */}
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${bot.color}12`, color: bot.color }}
        >
          <BotIcon id={bot.id} className="w-4.5 h-4.5" />
        </div>

        {/* Labels */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-gray-900 text-sm font-jakarta">{bot.name}</span>
            {bot.crawlDelay != null && (
              <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded font-mono hidden sm:inline">
                {bot.crawlDelay}s delay
              </span>
            )}
          </div>
          <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-1.5 truncate">
            <span>{bot.company}</span>
            {(bot.disallowedPaths.length + bot.allowedPaths.length) > 0 && (
              <>
                <span className="text-gray-200">·</span>
                <span>{bot.disallowedPaths.length + bot.allowedPaths.length} path rules</span>
              </>
            )}
          </div>
        </div>

        {/* Status + arrow */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <StatusPill status={bot.status} />
          <IconChevronRight />
        </div>
      </div>
    </motion.button>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-3.5 animate-pulse flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-gray-100 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-gray-100 rounded w-28" />
        <div className="h-2.5 bg-gray-100 rounded w-40" />
      </div>
      <div className="h-5 w-16 bg-gray-100 rounded-full flex-shrink-0" />
      <div className="w-4 h-4 bg-gray-100 rounded flex-shrink-0" />
    </div>
  );
}

// ─── robots.txt viewer ────────────────────────────────────────────────────────
function RobotsTxtViewer({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(content); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" /><div className="w-2.5 h-2.5 rounded-full bg-amber-400" /><div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="ml-2 text-xs text-gray-400 font-mono">robots.txt</span>
        </div>
        <button onClick={copy} className="text-xs text-gray-400 hover:text-gray-700 transition-colors flex items-center gap-1.5">
          {copied ? <><IconCheck /><span className="text-emerald-600">Copied!</span></> : <><IconCopy /><span>Copy</span></>}
        </button>
      </div>
      <pre className="p-4 text-xs font-mono overflow-x-auto max-h-72 leading-relaxed whitespace-pre-wrap break-words">
        {content.split("\n").map((line, i) => {
          const t = line.trim();
          let cls = "text-gray-600";
          if (t.startsWith("#")) cls = "text-gray-400";
          else if (t.toLowerCase().startsWith("user-agent:")) cls = "text-blue-600";
          else if (t.toLowerCase().startsWith("disallow:")) cls = "text-red-600";
          else if (t.toLowerCase().startsWith("allow:")) cls = "text-emerald-600";
          else if (t.toLowerCase().startsWith("sitemap:")) cls = "text-amber-600";
          else if (t.toLowerCase().startsWith("crawl-delay:")) cls = "text-purple-600";
          return <span key={i} className={cls}>{line}{"\n"}</span>;
        })}
      </pre>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
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

  useEffect(() => {
    if (selectedBot) { document.body.style.overflow = "hidden"; }
    else { document.body.style.overflow = ""; }
    return () => { document.body.style.overflow = ""; };
  }, [selectedBot]);

  const handleCheck = useCallback(async (overrideUrl?: string) => {
    const target = overrideUrl ?? url;
    if (!target.trim()) { inputRef.current?.focus(); return; }
    setLoading(true); setError(null); setResult(null); setFilter("all"); setSelectedBot(null);
    try {
      const res = await fetch(`/api/check-ai-bots?url=${encodeURIComponent(target.trim())}`);
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong"); }
      else { setResult(data); setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100); }
    } catch { setError("Network error — please try again"); }
    finally { setLoading(false); }
  }, [url]);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("url");
    if (p) { setUrl(p); handleCheck(p); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/tools/ai-bot-checker?url=${encodeURIComponent(url)}`);
    setShareTooltip(true); setTimeout(() => setShareTooltip(false), 2000);
  };

  const filteredBots = result?.bots.filter((b) => filter === "all" ? true : b.status === filter) ?? [];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Bot detail drawer */}
      <AnimatePresence>
        {selectedBot && (
          <BotDetailDrawer bot={selectedBot} domain={result?.domain ?? ""} onClose={() => setSelectedBot(null)} />
        )}
      </AnimatePresence>

      {/* Hero — matches site's section padding */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-20 xl:px-32 pt-28 pb-10">

        {/* Top badge + heading */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-center mb-10"
        >
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 shadow-sm rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B04]" />
            <span className="text-[#FF5B04] text-xs font-semibold font-jetbrains-mono uppercase tracking-wider">Free Tool</span>
            <span className="w-px h-3 bg-gray-200" />
            <span className="text-gray-400 text-xs">No sign-up required</span>
          </div>

          <h1 className="heading-hero text-gray-900 mb-4">
            AI Bot <span className="text-[#FF5B04]">Crawler</span> Checker
          </h1>
          <p className="sub-header">
            Paste any website URL to see which AI bots can crawl it — GPTBot, ClaudeBot, Gemini, Perplexity & 13 more.
          </p>
        </motion.div>

        {/* URL Input bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.45 }}
          className="max-w-2xl mx-auto mb-4"
        >
          <div className="flex gap-2 bg-white border border-gray-200 rounded-2xl p-2 shadow-sm focus-within:border-[#FF5B04]/40 focus-within:shadow-md transition-all duration-200">
            <div className="relative flex-1">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <IconGlobe />
              </div>
              <input
                ref={inputRef}
                id="url-input"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                placeholder="nytimes.com or https://example.com"
                className="w-full bg-transparent pl-10 pr-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none text-sm font-jakarta"
              />
            </div>
            <motion.button
              id="check-btn"
              onClick={() => handleCheck()}
              disabled={loading}
              whileTap={{ scale: 0.97 }}
              className="px-6 py-2.5 rounded-xl font-semibold text-sm text-white bg-[#FF5B04] hover:bg-[#E54F00] disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2 flex-shrink-0"
            >
              {loading ? <><IconSpinner />Checking…</> : <>Check Site</>}
            </motion.button>
          </div>

          {/* Quick links */}
          <div className="flex items-center gap-2 mt-3 justify-center flex-wrap">
            <span className="text-xs text-gray-400">Try:</span>
            {["nytimes.com", "openai.com", "github.com", "reddit.com"].map((site) => (
              <button
                key={site}
                onClick={() => { setUrl(site); handleCheck(site); }}
                className="text-xs text-gray-500 hover:text-[#FF5B04] transition-colors underline underline-offset-2 decoration-gray-300 hover:decoration-[#FF5B04]/50"
              >
                {site}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Results area */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-20 xl:px-32 pb-24">

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto mb-6 p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm flex items-start gap-2.5"
            >
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading skeletons */}
        {loading && (
          <div className="max-w-2xl mx-auto space-y-2.5">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Results */}
        <AnimatePresence>
          {result && !loading && (
            <motion.div ref={resultsRef} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }} className="max-w-2xl mx-auto">

              {/* Summary card */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-5 shadow-sm">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm text-gray-400">Results for</span>
                      <code className="text-sm font-semibold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md font-mono">{result.domain}</code>
                    </div>
                    {result.fetchError && (
                      <div className="text-xs text-amber-600 flex items-center gap-1.5 mt-1">
                        <IconInfo />
                        {result.fetchError}
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    <button id="share-btn" onClick={handleShare}
                      className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 border border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-white rounded-lg px-3 py-2 transition-all duration-200">
                      <IconShare />Share results
                    </button>
                    {shareTooltip && (
                      <div className="absolute -top-8 right-0 bg-gray-800 text-white text-xs px-2.5 py-1 rounded-lg whitespace-nowrap">Link copied!</div>
                    )}
                  </div>
                </div>

                {/* Stat chips */}
                <div className="grid grid-cols-3 gap-2.5 mt-4">
                  {[
                    { val: result.summary.blocked, label: "Blocked", bg: "bg-red-50 border-red-100", text: "text-red-600" },
                    { val: result.summary.partial, label: "Partial", bg: "bg-amber-50 border-amber-100", text: "text-amber-600" },
                    { val: result.summary.allowed, label: "Allowed", bg: "bg-emerald-50 border-emerald-100", text: "text-emerald-600" },
                  ].map((c) => (
                    <div key={c.label} className={`text-center p-3 rounded-xl border ${c.bg}`}>
                      <div className={`text-2xl font-bold font-geist ${c.text}`}>{c.val}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{c.label}</div>
                    </div>
                  ))}
                </div>

                {/* X-Robots-Tag */}
                {result.xRobotsTag && (
                  <div className="mt-3 p-3 rounded-lg bg-purple-50 border border-purple-100 flex items-start gap-2">
                    <svg className="w-3.5 h-3.5 mt-0.5 text-purple-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" /></svg>
                    <div><span className="text-xs font-semibold text-purple-600">X-Robots-Tag: </span><span className="font-mono text-xs text-gray-600">{result.xRobotsTag}</span></div>
                  </div>
                )}

                {/* Sitemaps */}
                {result.sitemaps.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {result.sitemaps.map((sm, i) => (
                      <a key={i} href={sm} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-lg px-2.5 py-1 transition-all duration-200">
                        <IconMap />Sitemap
                      </a>
                    ))}
                  </div>
                )}

                {/* Hint */}
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-xs text-gray-400">
                  <IconCursor />
                  Click any bot to see full crawl rule details
                </div>
              </div>

              {/* Filter tabs */}
              <div className="flex gap-2 mb-4 flex-wrap">
                {(["all", "blocked", "allowed", "partial"] as const).map((f) => {
                  const counts = { all: result.bots.length, blocked: result.summary.blocked, allowed: result.summary.allowed, partial: result.summary.partial };
                  const active = filter === f;
                  const cls = {
                    all: active ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-500 border-gray-200 hover:border-gray-300",
                    blocked: active ? "bg-red-600 text-white border-red-600" : "bg-white text-gray-500 border-gray-200 hover:border-gray-300",
                    allowed: active ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-gray-500 border-gray-200 hover:border-gray-300",
                    partial: active ? "bg-amber-500 text-white border-amber-500" : "bg-white text-gray-500 border-gray-200 hover:border-gray-300",
                  }[f];
                  return (
                    <button key={f} onClick={() => setFilter(f)}
                      className={`px-3.5 py-1.5 rounded-lg border text-xs font-medium transition-all duration-200 capitalize ${cls}`}>
                      {f} <span className="opacity-70 ml-1">({counts[f]})</span>
                    </button>
                  );
                })}
              </div>

              {/* Bot list */}
              <div className="space-y-2">
                {filteredBots.length === 0
                  ? <div className="text-center py-10 text-gray-400 text-sm">No bots match this filter</div>
                  : filteredBots.map((bot, i) => (
                    <BotCard key={bot.id} bot={bot} index={i} onClick={() => setSelectedBot(bot)} />
                  ))}
              </div>

              {/* Raw robots.txt toggle */}
              {result.rawRobotsTxt && (
                <div className="mt-6">
                  <button id="raw-robots-toggle" onClick={() => setShowRaw(!showRaw)}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-3">
                    <IconChevronDown open={showRaw} />
                    Raw robots.txt
                    <span className="text-xs text-gray-400">({result.rawRobotsTxt.split("\n").length} lines)</span>
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
                className="mt-8 p-6 rounded-2xl border border-gray-200 bg-white shadow-sm text-center"
              >
                <div className="text-sm font-semibold text-gray-900 font-jakarta mb-1">
                  Want real-time AI bot monitoring for your site?
                </div>
                <p className="text-xs text-gray-400 mb-4">We build AI-ready products at UI Pirate — from design to shipped.</p>
                <a id="cta-contact" href="/contact"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#FF5B04] hover:text-[#E54F00] transition-colors">
                  Talk to us <IconArrow />
                </a>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
