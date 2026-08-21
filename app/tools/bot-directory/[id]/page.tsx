import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { DETAILED_BOTS, getBotById } from "@/data/bots";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return DETAILED_BOTS.map((bot) => ({
    id: bot.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const bot = getBotById(id);
  if (!bot) return { title: "Crawler Not Found | UI Pirate" };

  return {
    title: `${bot.name} (${bot.company}): User Agent, robots.txt Rules & Guide | UI Pirate`,
    description: `${bot.name} is operated by ${bot.company}. Learn its official User-Agent token, purpose, robots.txt block/allow rules, and SEO impact.`,
    alternates: {
      canonical: `https://uipirate.com/tools/bot-directory/${bot.id}`,
    },
    openGraph: {
      title: `${bot.name} (${bot.company}) Crawler Profile`,
      description: bot.description,
      url: `https://uipirate.com/tools/bot-directory/${bot.id}`,
      siteName: "UI Pirate",
      type: "article",
    },
  };
}

export default async function BotDetailPage({ params }: Props) {
  const { id } = await params;
  const bot = getBotById(id);

  if (!bot) {
    notFound();
  }

  const allowSnippet = `# Allow ${bot.name}\nUser-agent: ${bot.userAgent}\nAllow: /`;
  const blockSnippet = `# Block ${bot.name}\nUser-agent: ${bot.userAgent}\nDisallow: /`;

  const relatedBots = DETAILED_BOTS.filter(
    (b) => b.id !== bot.id && (b.category === bot.category || b.company === bot.company)
  ).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": bot.name,
        "applicationCategory": bot.categoryLabel,
        "description": bot.description,
        "operatingSystem": "Web Server / HTTP",
        "provider": {
          "@type": "Organization",
          "name": bot.company,
        },
        "url": `https://uipirate.com/tools/bot-directory/${bot.id}`,
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Tools",
            "item": "https://uipirate.com/tools",
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Bot Directory",
            "item": "https://uipirate.com/tools/bot-directory",
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": bot.name,
            "item": `https://uipirate.com/tools/bot-directory/${bot.id}`,
          },
        ],
      },
      ...(bot.faqs.length > 0
        ? [
            {
              "@type": "FAQPage",
              "mainEntity": bot.faqs.map((faq) => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.answer,
                },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-20 xl:px-32 pt-28 pb-20">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6 font-medium">
          <Link href="/tools" className="hover:text-gray-900 transition-colors">
            Tools
          </Link>
          <span>/</span>
          <Link href="/tools/bot-directory" className="hover:text-gray-900 transition-colors">
            Bot Directory
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">{bot.name}</span>
        </nav>

        {/* Hero Card */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                  {bot.categoryLabel}
                </span>
                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                    bot.safetyRating === "Safe & Legitimate"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  {bot.safetyRating}
                </span>
                <span className="text-xs text-gray-400 font-medium font-mono">
                  Operator: {bot.company}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 font-jakarta tracking-tight mt-2">
                {bot.name}
              </h1>
              <p className="text-sm text-gray-600 max-w-2xl mt-3 leading-relaxed">
                {bot.fullOverview}
              </p>
            </div>

            {/* Quick Audit CTA Button */}
            <div className="flex-shrink-0">
              <Link
                href={`/tools/ai-bot-checker`}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#FF5B04] hover:bg-[#E54F00] text-white text-xs font-bold transition-all shadow-md shadow-[#FF5B04]/15"
              >
                <span>Audit Your Site for {bot.name}</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* 2-Column Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
          {/* Main Info Column */}
          <div className="lg:col-span-7 space-y-8">
            {/* Quick Facts Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-sm font-bold text-gray-900 font-jakarta uppercase tracking-wider mb-4">
                Technical Specifications
              </h2>

              <div className="divide-y divide-gray-100 text-xs">
                <div className="py-3 flex justify-between items-center">
                  <span className="text-gray-500 font-medium">User-Agent Token</span>
                  <code className="font-mono bg-gray-50 border border-gray-200 px-2.5 py-1 rounded text-gray-900 font-bold">
                    {bot.userAgent}
                  </code>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <span className="text-gray-500 font-medium">Operator / Owner</span>
                  <span className="font-semibold text-gray-900">{bot.company}</span>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <span className="text-gray-500 font-medium">Primary Purpose</span>
                  <span className="text-gray-700 text-right max-w-xs">{bot.purpose}</span>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <span className="text-gray-500 font-medium">SEO Impact</span>
                  <span
                    className={`font-semibold ${
                      bot.seoImpact === "Critical for SEO" ? "text-red-600" : "text-gray-700"
                    }`}
                  >
                    {bot.seoImpact}
                  </span>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <span className="text-gray-500 font-medium">Respects robots.txt</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    Standard Compliant (RFC 9309)
                  </span>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <span className="text-gray-500 font-medium">Reverse DNS Hostname</span>
                  <span className="font-mono text-gray-600">{bot.reverseDnsHost}</span>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <span className="text-gray-500 font-medium">Official Documentation</span>
                  <a
                    href={bot.officialDocsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FF5B04] hover:underline font-semibold flex items-center gap-1.5"
                  >
                    Operator Docs
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* FAQs */}
            {bot.faqs.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
                <h2 className="text-sm font-bold text-gray-900 font-jakarta uppercase tracking-wider">
                  Frequently Asked Questions
                </h2>

                <div className="space-y-4">
                  {bot.faqs.map((faq, i) => (
                    <div key={i} className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-1.5">
                      <h3 className="text-xs font-bold text-gray-900">{faq.question}</h3>
                      <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Code Snippets & Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            {/* Allow Rule Box */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  How to Allow {bot.name}
                </span>
                <span className="text-[10px] text-gray-400">robots.txt</span>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                Ensure this bot can index your public pages for citations.
              </p>
              <pre className="p-3.5 rounded-xl bg-gray-900 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed select-all">
                {allowSnippet}
              </pre>
            </div>

            {/* Block Rule Box */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                  How to Block {bot.name}
                </span>
                <span className="text-[10px] text-gray-400">robots.txt</span>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                Prevent this bot from accessing any content on your domain.
              </p>
              <pre className="p-3.5 rounded-xl bg-gray-900 text-red-400 font-mono text-xs overflow-x-auto leading-relaxed select-all">
                {blockSnippet}
              </pre>
            </div>

            {/* Related Crawlers */}
            {relatedBots.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
                  Related Crawlers
                </h3>
                <div className="space-y-2">
                  {relatedBots.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/tools/bot-directory/${rel.id}`}
                      className="p-3 rounded-xl border border-gray-100 hover:border-[#FF5B04]/30 hover:bg-[#FFF9F5] transition-all flex items-center justify-between group"
                    >
                      <div>
                        <div className="text-xs font-bold text-gray-900 group-hover:text-[#FF5B04]">
                          {rel.name}
                        </div>
                        <div className="text-[11px] text-gray-400">{rel.company}</div>
                      </div>
                      <svg className="w-4 h-4 text-gray-300 group-hover:text-[#FF5B04] group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
