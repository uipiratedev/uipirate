"use client";

import Link from "next/link";
import SuggestedTools, { ALL_TOOLS_REGISTRY } from "@/components/SuggestedTools";
import GlassBadge from "@/components/GlassBadge";

export interface UpcomingToolSpec {
  id: string;
  category: "saas-product" | "website-conversion" | "ai-geo" | "design-system";
  categoryLabel: string;
  badgeText: string;
  title: string;
  subtitle: string;
  description?: string;
  agencyService: string;
  agencyLink: string;
  keyMetrics: { name: string; desc: string; icon?: React.ReactNode }[];
  howItWorks: { step: string; title: string; desc: string }[];
  faqs: { q: string; a: string }[];
}

export default function UpcomingToolLandingPage({ spec }: { spec: UpcomingToolSpec }) {
  const toolEntry = ALL_TOOLS_REGISTRY.find((t) => t.id === spec.id);

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": spec.title,
    "description": spec.subtitle,
    "url": `https://uipirate.com/tools/${spec.category}/${spec.id}`,
    "applicationCategory": "DesignApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "creator": {
      "@type": "Organization",
      "name": "UI Pirate",
      "url": "https://uipirate.com",
    },
  };

  const faqSchema =
    spec.faqs && spec.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": spec.faqs.map((f) => ({
            "@type": "Question",
            "name": f.q,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": f.a,
            },
          })),
        }
      : null;

  return (
    <div className="min-h-screen bg-[#FAFAFA] relative overflow-hidden">
      {/* Background Grid & Ambient Glow */}
      <div
        className="absolute inset-0 pointer-events-none -top-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 0, 0, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse at 50% 25%, black 40%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 25%, black 40%, transparent 80%)",
        }}
      />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[340px] bg-[#FF5B04]/10 blur-[140px] rounded-full pointer-events-none -z-10" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <div className="container mx-auto px-32 lg:px-20 max-md:px-4 pt-32 pb-20 relative z-10">
        {/* Header Hero */}
        <div className="w-full max-w-5xl mx-auto text-center mb-14">
          {/* Tool Icon & Badge */}
          <div className="flex flex-col items-center justify-center gap-3 mb-6">
            {toolEntry?.icon && (
              <div className="w-16 h-16 rounded-3xl bg-white text-[#FF5B04] flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-[#E5E7EB] [&>svg]:w-8 [&>svg]:h-8 mb-2">
                {toolEntry.icon}
              </div>
            )}
            <div className="mb-2 flex flex-row items-center justify-center">
              <GlassBadge variant="gradient">{spec.badgeText}</GlassBadge>
            </div>
          </div>

          <h1 className="text-[38px] sm:text-[50px] md:text-[62px] lg:text-[72px] text-center font-[800] tracking-[-1.5px] leading-[1.08] text-gray-900 mb-5">
            {spec.title}
          </h1>
          <p className="text-base sm:text-lg text-gray-500 max-w-3xl mx-auto mb-10 font-normal leading-relaxed">
            {spec.subtitle}
          </p>

          {/* Teardown Consultation Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white/95 backdrop-blur-md border border-[#E5E7EB] text-left w-full max-w-3xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-900 font-jakarta mb-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FF5B04]" />
                <span>Need a full diagnostic teardown today?</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed max-w-md">
                Our product design engineers provide tailored manual audits with high-converting Figma wireframes and technical recommendations.
              </p>
            </div>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-full bg-gray-900 hover:bg-[#FF5B04] text-white text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 shadow-md shadow-gray-900/10 cursor-pointer"
            >
              Book Manual Audit →
            </Link>
          </div>
        </div>

        {/* Blueprint: What this Tool Will Analyze */}
        <div className="w-full mb-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF5B04] bg-[#FF5B04]/8 px-3 py-1 rounded-full border border-[#FF5B04]/20">
              Diagnostic Blueprint
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-jakarta mt-3">
              What This Tool Will Analyze & Score
            </h2>
            <p className="text-xs text-gray-500 mt-2">
              Engineered according to UI Pirate agency standards for high-performing digital products.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {spec.keyMetrics.map((metric, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#E5E7EB] rounded-[24px] p-7 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.08)] flex flex-col justify-between hover:border-[#FF5B04]/40 transition-all duration-300"
              >
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-[#FF5B04]/8 text-[#FF5B04] flex items-center justify-center font-mono font-bold text-sm mb-4">
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                  <h3 className="text-base font-bold text-gray-900 font-jakarta mb-2">{metric.name}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{metric.desc}</p>
                </div>
                <div className="mt-5 pt-3.5 border-t border-gray-100 flex items-center justify-between text-[11px] font-mono text-gray-400">
                  <span>Audit Parameter</span>
                  <span className="text-emerald-600 font-semibold">0–100 Weighted</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How it Works / Workflow */}
        <div className="w-full mb-20 bg-white border border-[#E5E7EB] rounded-[32px] p-8 sm:p-12 shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
          <div className="max-w-2xl mb-8">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF5B04] bg-[#FF5B04]/8 px-3 py-1 rounded-full border border-[#FF5B04]/20">
              Evaluation Methodology
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-jakarta mt-3">
              How the Diagnostic Engine Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {spec.howItWorks.map((step, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-gray-50/80 border border-gray-100 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-[#FF5B04] block mb-2">{step.step}</span>
                  <h3 className="text-sm font-bold text-gray-900 font-jakarta mb-2">{step.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agency Bridge Consultation Box */}
        <div className="w-full mb-20 bg-gradient-to-br from-gray-900 to-black text-white rounded-[32px] p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF5B04] bg-white/10 px-3 py-1 rounded-full border border-white/10">
              Agency Service: {spec.agencyService}
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold font-jakarta mt-4">
              Need these optimizations implemented now?
            </h3>
            <p className="text-xs text-gray-300 mt-2 leading-relaxed">
              Don't wait for automated tools. UI Pirate's senior product designers and engineers can audit, redesign, and ship your interface directly in Figma and Next.js.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-7 py-4 rounded-2xl bg-[#FF5B04] hover:bg-[#E54F00] text-white text-sm font-bold transition-all shadow-lg shadow-[#FF5B04]/30 whitespace-nowrap flex-shrink-0"
          >
            Get Expert Help →
          </Link>
        </div>

        {/* FAQs */}
        {spec.faqs && spec.faqs.length > 0 && (
          <div className="w-full mb-20">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF5B04] bg-[#FF5B04]/8 px-3 py-1 rounded-full border border-[#FF5B04]/20">
                Technical Questions
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-jakarta mt-3">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {spec.faqs.map((faq, idx) => (
                <div key={idx} className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-2xs">
                  <h3 className="text-sm font-bold text-gray-900 mb-2 font-jakarta">{faq.q}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Tools */}
        <div className="w-full">
          <SuggestedTools currentToolId={spec.id} category={spec.category} />
        </div>
      </div>
    </div>
  );
}
