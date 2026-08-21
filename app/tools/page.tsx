import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Tools for Developers & Founders",
  description:
    "Free, no-sign-up tools built by UI Pirate. Check AI bot access, analyse robots.txt, and more — all free, all instant.",
  alternates: { canonical: "https://uipirate.com/tools" },
};

const tools = [
  {
    id: "ai-bot-checker",
    href: "/tools/ai-bot-checker",
    badge: "Live",
    title: "AI Crawler & GEO Readiness Hub",
    description:
      "Paste any website URL and get an instant 0–100 GEO Visibility Score across 26+ AI bots, search engines, and firewalls.",
    tags: ["GEO Score", "AI crawlers", "Firewall WAF"],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        <line x1="8" y1="16" x2="8.01" y2="16" />
        <line x1="16" y1="16" x2="16.01" y2="16" />
      </svg>
    ),
  },
  {
    id: "robots-txt-generator",
    href: "/tools/robots-txt-generator",
    badge: "Live",
    title: "AI robots.txt Generator",
    description:
      "Build a custom robots.txt file for your site. Choose which AI bots, search engines, and crawlers to allow or block with 1 click.",
    tags: ["robots.txt", "AI crawlers", "generator"],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    id: "llms-txt-generator",
    href: "/tools/llms-txt-generator",
    badge: "Live",
    title: "llms.txt & Context Generator",
    description:
      "Generate standard llms.txt and deep llms-full.txt files. Provide structured company knowledge directly to AI crawlers.",
    tags: ["llms.txt", "AI context", "GEO"],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    id: "robots-txt-validator",
    href: "/tools/robots-txt-validator",
    badge: "Live",
    title: "robots.txt Validator & Linter",
    description:
      "Test and validate any robots.txt syntax. Catch blocking errors, unknown directives, and accidental AI crawler blocks.",
    tags: ["Linter", "Syntax", "Validator"],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <path d="M9 12l2 2 4-4" />
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    id: "batch-checker",
    href: "/tools/batch-checker",
    badge: "Live",
    title: "Batch AI Crawler & Score Checker",
    description:
      "Audit up to 10 competitor or client domains simultaneously. Compare GEO scores and crawler permissions side-by-side.",
    tags: ["Batch Audit", "Competitor Comparison", "GEO"],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    id: "schema-generator",
    href: "/tools/schema-generator",
    badge: "Live",
    title: "AI & GEO Schema Markup Generator",
    description:
      "Create JSON-LD structured data for Organization, FAQPage, WebApp, and Services to boost ChatGPT & Gemini visibility.",
    tags: ["JSON-LD", "Schema.org", "FAQ Schema"],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
  },
  {
    id: "bot-directory",
    href: "/tools/bot-directory",
    badge: "Live",
    title: "AI Crawler & Bot Directory",
    description:
      "Searchable database of 26+ AI crawlers, search engines, and scrapers. Lookup exact User-Agents, operators, and behaviors.",
    tags: ["Directory", "User-Agents", "AI Database"],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
];

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Hero */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-20 xl:px-32 pt-28 pb-12">
        <div className="text-center mb-14">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 shadow-sm rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B04]" />
            <span className="text-[#FF5B04] text-xs font-semibold font-jetbrains-mono uppercase tracking-wider">
              Free Tools
            </span>
            <span className="w-px h-3 bg-gray-200" />
            <span className="text-gray-400 text-xs">No sign-up required</span>
          </div>

          <h1 className="heading-hero text-gray-900 mb-4">
            Tools for <span className="text-[#FF5B04]">builders</span>
          </h1>
          <p className="sub-header">
            Free, instant tools built by UI Pirate to help founders, developers
            and marketers ship smarter products.
          </p>
        </div>

        {/* Tool cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {tools.map((tool) => {
            const isLive = tool.href !== null;

            const cardContent = (
              <div
                className={`group relative bg-white border rounded-2xl p-6 h-full flex flex-col transition-all duration-200
                  ${
                    isLive
                      ? "border-gray-200 hover:border-[#FF5B04]/40 hover:shadow-lg cursor-pointer"
                      : "border-gray-100 opacity-60 cursor-default"
                  }
                `}
              >
                {/* Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-200
                      ${isLive ? "bg-[#FF5B04]/8 text-[#FF5B04] group-hover:bg-[#FF5B04]/15" : "bg-gray-100 text-gray-400"}
                    `}
                  >
                    {tool.icon}
                  </div>
                  <span
                    className={`text-[10px] font-semibold font-jetbrains-mono uppercase tracking-wider px-2.5 py-1 rounded-full border
                      ${
                        tool.badge === "Live"
                          ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                          : "text-gray-400 bg-gray-100 border-gray-200"
                      }
                    `}
                  >
                    {tool.badge}
                  </span>
                </div>

                {/* Text */}
                <h2 className="text-[15px] font-semibold text-gray-900 font-jakarta mb-2 leading-snug">
                  {tool.title}
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed flex-1">
                  {tool.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {tool.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] text-gray-400 bg-gray-50 border border-gray-100 rounded-md px-2 py-0.5 font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA row */}
                {isLive && (
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-400">Free · No sign-up</span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-[#FF5B04] group-hover:gap-2 transition-all duration-200">
                      Open tool
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </span>
                  </div>
                )}
              </div>
            );

            return isLive ? (
              <Link key={tool.id} href={tool.href!} className="h-full">
                {cardContent}
              </Link>
            ) : (
              <div key={tool.id} className="h-full">
                {cardContent}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-sm text-gray-400 mb-3">
            Got a tool idea? We&apos;d love to build it.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#FF5B04] hover:text-[#E54F00] transition-colors"
          >
            Suggest a tool
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
