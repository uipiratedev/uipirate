"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import SuggestedTools from "@/components/SuggestedTools";
import GlassBadge from "@/components/GlassBadge";

type SchemaType = "organization" | "faq" | "software" | "service";

export default function SchemaGeneratorClient() {
  const [schemaType, setSchemaType] = useState<SchemaType>("organization");

  // Organization fields
  const [orgName, setOrgName] = useState("UI Pirate");
  const [orgUrl, setOrgUrl] = useState("https://uipirate.com");
  const [orgLogo, setOrgLogo] = useState("https://uipirate.com/logo.png");
  const [orgDesc, setOrgDesc] = useState("Product design & development agency for SaaS and AI products.");
  const [orgFounder, setOrgFounder] = useState("Vishal Anand");

  // FAQ fields
  const [faqItems, setFaqItems] = useState([
    { q: "What services does UI Pirate offer?", a: "We provide end-to-end product design, UX/UI, and frontend development in Angular and React." },
    { q: "How long does a typical project take?", a: "Landing pages take 2-4 weeks; SaaS applications take 1-2 months." },
  ]);

  // Software fields
  const [appName, setAppName] = useState("Pirate AI");
  const [appUrl, setAppUrl] = useState(
    "https://uipirate.com/tools/ai/ai-bot-checker",
  );
  const [appCategory, setAppCategory] = useState("SEOApplication");
  const [appPrice, setAppPrice] = useState("0");

  const [copied, setCopied] = useState(false);

  const addFaq = () => {
    setFaqItems((prev) => [...prev, { q: "", a: "" }]);
  };

  const removeFaq = (index: number) => {
    setFaqItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateFaq = (index: number, field: "q" | "a", value: string) => {
    setFaqItems((prev) => {
      const copy = [...prev];
      copy[index][field] = value;
      return copy;
    });
  };

  const generatedSchema = useMemo(() => {
    if (schemaType === "organization") {
      return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: orgName,
        url: orgUrl,
        logo: orgLogo,
        description: orgDesc,
        founder: {
          "@type": "Person",
          name: orgFounder,
        },
      };
    } else if (schemaType === "faq") {
      return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqItems
          .filter((f) => f.q.trim())
          .map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: f.a,
            },
          })),
      };
    } else if (schemaType === "software") {
      return {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: appName,
        url: appUrl,
        applicationCategory: appCategory,
        offers: {
          "@type": "Offer",
          price: appPrice,
          priceCurrency: "USD",
        },
      };
    } else {
      return {
        "@context": "https://schema.org",
        "@type": "Service",
        name: orgName,
        provider: {
          "@type": "Organization",
          name: orgName,
          url: orgUrl,
        },
        description: orgDesc,
      };
    }
  }, [schemaType, orgName, orgUrl, orgLogo, orgDesc, orgFounder, faqItems, appName, appUrl, appCategory, appPrice]);

  const jsonString = useMemo(() => {
    return `<script type="application/ld+json">\n${JSON.stringify(generatedSchema, null, 2)}\n</script>`;
  }, [generatedSchema]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

      <div className="container mx-auto px-32 lg:px-20 max-md:px-4 pt-32 pb-20 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="mb-6 flex flex-row items-center justify-center">
            <GlassBadge variant="gradient">JSON-LD &amp; GEO SCHEMA BUILDER</GlassBadge>
          </div>

          <h1 className="text-[38px] sm:text-[50px] md:text-[62px] lg:text-[72px] text-center font-[800] tracking-[-1.5px] leading-[1.08] text-gray-900 mb-5 max-w-5xl mx-auto">
            AI &amp; GEO <span className="text-[#FF5B04]">Schema.org</span> Generator
          </h1>
          <p className="text-base sm:text-lg text-gray-500 max-w-3xl mx-auto text-center font-normal leading-relaxed">
            Generate clean JSON-LD structured data. Feed Google Knowledge Graph, ChatGPT, and AI models semantic entity context.
          </p>

          {/* Integrated Capability Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {[
              "Organization & Brand Entity",
              "FAQPage AI Citation Boost",
              "SoftwareApplication Schema",
              "Service & Pricing Schema",
              "Google Rich Snippet Validator",
            ].map((badge, idx) => (
              <span
                key={idx}
                className="text-[11px] font-mono px-3.5 py-1 rounded-full bg-white/90 backdrop-blur-xs border border-gray-200/80 text-gray-700 shadow-2xs flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B04]" />
                {badge}
              </span>
            ))}
          </div>

          {/* Engine Status & Consultation Callout */}
          <div className="mt-8 flex justify-center">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2.5 bg-white/95 backdrop-blur-md border border-[#E5E7EB] hover:border-[#FF5B04]/40 rounded-full px-5 py-2 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(255,91,4,0.08)] transition-all duration-300 text-xs"
            >
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#FF5B04]/10 text-[#FF5B04] font-mono text-[10px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B04] animate-pulse" />
                GEO &amp; SEO
              </span>
              <span className="text-gray-600 font-medium">
                Need enterprise entity graphs &amp; programmatic schema architecture?
              </span>
              <span className="text-gray-900 font-bold group-hover:text-[#FF5B04] inline-flex items-center gap-0.5 transition-colors">
                <span>Consult SEO architects</span>
                <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-[#FF5B04]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          </div>
        </motion.div>

        {/* Builder Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
          {/* Controls Column */}
          <div className="lg:col-span-6 space-y-6">
            {/* Schema Type Selector */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider font-jakarta mb-3">
                Select Schema Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "organization", label: "Organization" },
                  { id: "faq", label: "FAQPage (AI Boost)" },
                  { id: "software", label: "Web App" },
                  { id: "service", label: "Service" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSchemaType(t.id as SchemaType)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                      schemaType === t.id
                        ? "bg-[#FF5B04] text-white shadow-xs"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Form Fields according to Schema Type */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
              {schemaType === "organization" && (
                <>
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Organization Details</h3>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Organization Name</label>
                    <input
                      type="text"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 outline-none focus:border-[#FF5B04]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Official Website URL</label>
                    <input
                      type="text"
                      value={orgUrl}
                      onChange={(e) => setOrgUrl(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 outline-none focus:border-[#FF5B04]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Logo Image URL</label>
                    <input
                      type="text"
                      value={orgLogo}
                      onChange={(e) => setOrgLogo(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 outline-none focus:border-[#FF5B04]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={orgDesc}
                      onChange={(e) => setOrgDesc(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 outline-none focus:border-[#FF5B04]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Founder / Author</label>
                    <input
                      type="text"
                      value={orgFounder}
                      onChange={(e) => setOrgFounder(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 outline-none focus:border-[#FF5B04]"
                    />
                  </div>
                </>
              )}

              {schemaType === "faq" && (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">FAQ Questions & Answers</h3>
                    <button onClick={addFaq} className="text-xs font-semibold text-[#FF5B04] hover:underline">
                      + Add Question
                    </button>
                  </div>

                  <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                    {faqItems.map((item, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 space-y-2 relative">
                        <div className="flex justify-between items-center">
                          <span className="text-[11px] font-bold text-gray-600">Question #{idx + 1}</span>
                          {faqItems.length > 1 && (
                            <button onClick={() => removeFaq(idx)} className="text-[11px] text-red-500 hover:underline">
                              Remove
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          value={item.q}
                          onChange={(e) => updateFaq(idx, "q", e.target.value)}
                          placeholder="e.g. How does your pricing work?"
                          className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-900 outline-none bg-white focus:border-[#FF5B04]"
                        />
                        <textarea
                          rows={2}
                          value={item.a}
                          onChange={(e) => updateFaq(idx, "a", e.target.value)}
                          placeholder="Answer content..."
                          className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-900 outline-none bg-white focus:border-[#FF5B04]"
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}

              {schemaType === "software" && (
                <>
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">App / Tool Info</h3>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Application Name</label>
                    <input
                      type="text"
                      value={appName}
                      onChange={(e) => setAppName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 outline-none focus:border-[#FF5B04]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">App URL</label>
                    <input
                      type="text"
                      value={appUrl}
                      onChange={(e) => setAppUrl(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 outline-none focus:border-[#FF5B04]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
                    <input
                      type="text"
                      value={appCategory}
                      onChange={(e) => setAppCategory(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 outline-none focus:border-[#FF5B04]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Price (USD)</label>
                    <input
                      type="text"
                      value={appPrice}
                      onChange={(e) => setAppPrice(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 outline-none focus:border-[#FF5B04]"
                    />
                  </div>
                </>
              )}

              {schemaType === "service" && (
                <>
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Service Info</h3>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Service Title</label>
                    <input
                      type="text"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 outline-none focus:border-[#FF5B04]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Service Description</label>
                    <textarea
                      rows={3}
                      value={orgDesc}
                      onChange={(e) => setOrgDesc(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 outline-none focus:border-[#FF5B04]"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* JSON-LD Preview Column */}
          <div className="lg:col-span-6">
            <div className="sticky top-28 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF5B04] font-jetbrains-mono">
                    JSON-LD Code
                  </span>
                  <h3 className="text-sm font-bold text-gray-900 font-jakarta">Ready to Embed</h3>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="px-3.5 py-2 rounded-xl bg-[#FF5B04] hover:bg-[#E54F00] text-white text-xs font-semibold transition-colors"
                >
                  {copied ? "Copied!" : "Copy Snippet"}
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-gray-900 text-gray-200 font-mono text-xs overflow-x-auto leading-relaxed max-h-[500px] whitespace-pre-wrap select-all">
                {jsonString}
              </pre>

              <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                Paste inside your HTML <code className="font-mono text-gray-800">&lt;head&gt;</code> or layout component.
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Landing Page Content / Educational Guide */}
        <section className="mt-24 pt-14 border-t border-gray-200 max-w-5xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF5B04]">
              Structured Knowledge Graph
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-jakarta mt-2">
              Why Schema.org JSON-LD is Vital for AI Engine Visibility
            </h2>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              LLMs rely on structured Schema.org markup to extract unambiguous entity relationships, brand identity, verified pricing, and direct answers for ChatGPT Search, Gemini, and Google Overviews.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <span className="text-2xl font-bold font-mono text-[#FF5B04] mb-3 block">01</span>
              <h3 className="text-sm font-bold text-gray-900 mb-2 font-jakarta">Entity Disambiguation</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Organization schema explicitly ties your brand name, founders, official social links, and legal entity together for AI knowledge graphs.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <span className="text-2xl font-bold font-mono text-[#FF5B04] mb-3 block">02</span>
              <h3 className="text-sm font-bold text-gray-900 mb-2 font-jakarta">Direct AI Citations</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                FAQPage and SoftwareApplication schemas provide structured answers that AI answer engines extract directly to quote as verified source snippets.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <span className="text-2xl font-bold font-mono text-[#FF5B04] mb-3 block">03</span>
              <h3 className="text-sm font-bold text-gray-900 mb-2 font-jakarta">Google Rich Snippets</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Valid JSON-LD qualifies your domain for Google SERP enhancements, including star ratings, pricing snippets, and expandable question carousels.
              </p>
            </div>
          </div>

          {/* FAQs */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 font-jakarta mb-6">
              Frequently Asked Questions about Schema.org JSON-LD
            </h3>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <h4 className="text-xs font-bold text-gray-900 mb-1">Where do I paste the generated JSON-LD?</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Paste the generated <code className="font-mono text-gray-800">&lt;script type=&quot;application/ld+json&quot;&gt;</code> block inside your page's <code className="font-mono text-gray-800">&lt;head&gt;</code> or root Next.js layout component.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <h4 className="text-xs font-bold text-gray-900 mb-1">Can I include multiple schema types on a single page?</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Yes. You can either combine them inside an <code className="font-mono text-gray-800">@graph: [...]</code> array or add multiple separate <code className="font-mono text-gray-800">&lt;script type=&quot;application/ld+json&quot;&gt;</code> tags.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Suggested Tools */}
        <SuggestedTools currentToolId="schema-generator" category="ai-geo" />
      </div>
    </div>
  );
}
