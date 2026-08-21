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
    title: "AI Bot Crawler Checker",
    description:
      "Paste any website URL and instantly see which AI bots (GPTBot, ClaudeBot, Gemini, Perplexity & 13 more) are allowed or blocked via robots.txt.",
    tags: ["robots.txt", "AI crawlers", "SEO"],
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        <line x1="8" y1="16" x2="8.01" y2="16" />
        <line x1="16" y1="16" x2="16.01" y2="16" />
      </svg>
    ),
  },
  // Placeholder — coming soon
  {
    id: "meta-tag-preview",
    href: null,
    badge: "Soon",
    title: "Meta Tag Previewer",
    description:
      "Preview how your page looks in Google search results, Twitter cards, and LinkedIn shares before going live.",
    tags: ["SEO", "OG tags", "social"],
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
  },
  {
    id: "robots-txt-generator",
    href: null,
    badge: "Soon",
    title: "robots.txt Generator",
    description:
      "Build a custom robots.txt file for your site. Choose which AI bots, search engines, and crawlers to allow or block.",
    tags: ["robots.txt", "AI crawlers", "generator"],
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
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
