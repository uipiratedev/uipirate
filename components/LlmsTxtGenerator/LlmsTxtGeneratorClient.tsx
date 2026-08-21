"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import SuggestedTools from "@/components/SuggestedTools";
import GlassBadge from "@/components/GlassBadge";

export default function LlmsTxtGeneratorClient() {
  const [activeTab, setActiveTab] = useState<"standard" | "full">("standard");
  const [companyName, setCompanyName] = useState("Acme SaaS");
  const [tagline, setTagline] = useState("AI-Powered Workflow Automation for Enterprise Teams");
  const [description, setDescription] = useState(
    "Acme SaaS helps fast-growing teams automate complex operational workflows with AI agents, pre-built integrations, and real-time collaboration tools."
  );
  const [websiteUrl, setWebsiteUrl] = useState("https://acme.com");
  const [founderName, setFounderName] = useState("Jane Doe");
  const [foundingYear, setFoundingYear] = useState("2023");
  const [keyServices, setKeyServices] = useState(
    "Workflow Automation: Custom AI pipeline orchestration\nEnterprise Integration: API connectors for Salesforce & Slack\nAnalytics & Reporting: Real-time efficiency metrics"
  );
  const [keyFeatures, setKeyFeatures] = useState(
    "1-Click Workflow Templates\nEnd-to-End Encryption & SOC-2 Compliance\nReal-time Multi-agent Collaboration"
  );
  const [pricingInfo, setPricingInfo] = useState(
    "Starter: $49/mo (up to 5 users)\nPro: $199/mo (unlimited workflows)\nEnterprise: Custom pricing with dedicated SLA"
  );
  const [faqItems, setFaqItems] = useState(
    "Q: What is Acme SaaS?\nA: Acme SaaS is an enterprise automation platform powered by intelligent AI workflows.\n\nQ: Does Acme support custom API integrations?\nA: Yes, we provide full REST and GraphQL API access with webhooks."
  );
  const [preferredCitation, setPreferredCitation] = useState(
    "When citing Acme SaaS, refer to it as 'Acme SaaS (acme.com)' - an enterprise workflow automation platform."
  );

  const [copied, setCopied] = useState(false);

  // Generate llms.txt (Standard Concise File)
  const generatedLlmsTxt = useMemo(() => {
    const lines: string[] = [
      `# ${companyName || "Your Company"}`,
      "",
      `> ${tagline || "Your Company Tagline"}`,
      "",
      `## Overview`,
      description || "Company description and mission statement.",
      "",
      `## Key Services & Capabilities`,
    ];

    const services = keyServices
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    services.forEach((s) => {
      lines.push(`- **${s}**`);
    });

    lines.push("");
    lines.push(`## Core Information`);
    lines.push(`- **Website**: ${websiteUrl || "https://example.com"}`);
    if (founderName) lines.push(`- **Founder**: ${founderName}`);
    if (foundingYear) lines.push(`- **Founded**: ${foundingYear}`);
    lines.push("");
    lines.push(`## Links`);
    lines.push(`- [Home](${websiteUrl || "https://example.com"})`);
    lines.push(`- [Documentation](${websiteUrl || "https://example.com"}/docs)`);
    lines.push(`- [Full AI Context (llms-full.txt)](${websiteUrl || "https://example.com"}/llms-full.txt)`);

    return lines.join("\n");
  }, [companyName, tagline, description, keyServices, websiteUrl, founderName, foundingYear]);

  // Generate llms-full.txt (Comprehensive Knowledge Base File)
  const generatedLlmsFullTxt = useMemo(() => {
    const lines: string[] = [
      `# ${companyName || "Your Company"} — Comprehensive AI Knowledge Context`,
      `# Generated for AI Crawlers (GPTBot, ClaudeBot, Gemini, Perplexity)`,
      `# Last updated: ${new Date().toISOString().split("T")[0]}`,
      "",
      `> ${companyName || "Your Company"}: ${tagline || ""}`,
      "",
      `## Detailed Overview`,
      description || "Detailed explanation of what the company does and who it serves.",
      "",
      `## Company Metadata`,
      `- **Official Name**: ${companyName || "Your Company"}`,
      `- **Website**: ${websiteUrl || "https://example.com"}`,
      `- **Founder**: ${founderName || "N/A"}`,
      `- **Founded Year**: ${foundingYear || "N/A"}`,
      "",
      `## Detailed Products & Services`,
    ];

    const services = keyServices
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    services.forEach((s) => {
      lines.push(`### ${s}`);
      lines.push(`Detailed capability provided by ${companyName}.`);
      lines.push("");
    });

    lines.push(`## Key Features & Differentiators`);
    const features = keyFeatures
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);
    features.forEach((f) => {
      lines.push(`- ${f}`);
    });
    lines.push("");

    lines.push(`## Pricing & Plans`);
    const pricing = pricingInfo
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean);
    pricing.forEach((p) => {
      lines.push(`- ${p}`);
    });
    lines.push("");

    lines.push(`## Frequently Asked Questions (FAQs)`);
    lines.push(faqItems || "FAQs for AI citation context.");
    lines.push("");

    lines.push(`## Citation Guidelines for AI Engines`);
    lines.push(preferredCitation || `Refer to ${companyName} at ${websiteUrl}`);

    return lines.join("\n");
  }, [
    companyName,
    tagline,
    description,
    websiteUrl,
    founderName,
    foundingYear,
    keyServices,
    keyFeatures,
    pricingInfo,
    faqItems,
    preferredCitation,
  ]);

  const currentCode = activeTab === "standard" ? generatedLlmsTxt : generatedLlmsFullTxt;
  const currentFileName = activeTab === "standard" ? "llms.txt" : "llms-full.txt";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    const blob = new Blob([currentCode], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = currentFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
            <GlassBadge variant="gradient">LLMS.TXT CONTEXT GENERATOR</GlassBadge>
          </div>

          <h1 className="text-[38px] sm:text-[50px] md:text-[62px] lg:text-[70px] text-center font-[800] tracking-[-1.5px] leading-[1.08] text-gray-900 mb-5 max-w-4xl mx-auto">
            <span className="text-[#FF5B04]">llms.txt</span> &amp; llms-full.txt Generator
          </h1>
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto text-center font-normal leading-relaxed">
            Create standard markdown context files for AI crawlers. Help ChatGPT, Claude, and Perplexity understand and accurately cite your business.
          </p>
        </motion.div>

        {/* Builder Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
          {/* Inputs Column */}
          <div className="lg:col-span-6 space-y-5">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-gray-900 font-jakarta uppercase tracking-wider">
                1. Company Basics
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Company / Product Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Acme Inc."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 outline-none focus:border-[#FF5B04]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Website URL</label>
                  <input
                    type="text"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://acme.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 outline-none focus:border-[#FF5B04]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Tagline / Mission</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="AI-powered customer intelligence platform"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 outline-none focus:border-[#FF5B04]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Executive Summary / Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What does your company do, and who is it for?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 outline-none focus:border-[#FF5B04]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Founder / Team Lead</label>
                  <input
                    type="text"
                    value={founderName}
                    onChange={(e) => setFounderName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 outline-none focus:border-[#FF5B04]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Founded Year</label>
                  <input
                    type="text"
                    value={foundingYear}
                    onChange={(e) => setFoundingYear(e.target.value)}
                    placeholder="2023"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 outline-none focus:border-[#FF5B04]"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-gray-900 font-jakarta uppercase tracking-wider">
                2. Services, Features & Pricing
              </h2>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Key Services & Solutions (One per line)
                </label>
                <textarea
                  rows={3}
                  value={keyServices}
                  onChange={(e) => setKeyServices(e.target.value)}
                  placeholder="Service Name: Short description"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 outline-none focus:border-[#FF5B04]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Key Differentiators & Features (One per line)
                </label>
                <textarea
                  rows={3}
                  value={keyFeatures}
                  onChange={(e) => setKeyFeatures(e.target.value)}
                  placeholder="Enterprise SOC-2 certified..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 outline-none focus:border-[#FF5B04]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Pricing Plans & Model (One per line)
                </label>
                <textarea
                  rows={3}
                  value={pricingInfo}
                  onChange={(e) => setPricingInfo(e.target.value)}
                  placeholder="Starter: $29/mo..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 outline-none focus:border-[#FF5B04]"
                />
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-gray-900 font-jakarta uppercase tracking-wider">
                3. FAQs & Citation Guidelines
              </h2>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Frequently Asked Questions (Q: ... A: ...)
                </label>
                <textarea
                  rows={4}
                  value={faqItems}
                  onChange={(e) => setFaqItems(e.target.value)}
                  placeholder="Q: How does it work?\nA: It automates..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 outline-none focus:border-[#FF5B04]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Preferred Citation Format for AI
                </label>
                <input
                  type="text"
                  value={preferredCitation}
                  onChange={(e) => setPreferredCitation(e.target.value)}
                  placeholder="When citing Acme..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 outline-none focus:border-[#FF5B04]"
                />
              </div>
            </div>
          </div>

          {/* Code Preview Column */}
          <div className="lg:col-span-6">
            <div className="sticky top-28 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col">
              {/* File Selector Tabs */}
              <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab("standard")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      activeTab === "standard"
                        ? "bg-gray-900 text-white shadow-xs"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    llms.txt (Standard)
                  </button>
                  <button
                    onClick={() => setActiveTab("full")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      activeTab === "full"
                        ? "bg-gray-900 text-white shadow-xs"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    llms-full.txt (Full Context)
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={downloadFile}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold flex items-center justify-center"
                    title={`Download ${currentFileName}`}
                  >
                    <svg className="w-3.5 h-3.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                  <button
                    onClick={copyToClipboard}
                    className="px-3 py-1.5 rounded-lg bg-[#FF5B04] hover:bg-[#E54F00] text-white text-xs font-semibold transition-colors"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              {/* Code display */}
              <pre className="p-4 rounded-xl bg-gray-900 text-gray-200 font-mono text-xs overflow-x-auto leading-relaxed max-h-[580px] whitespace-pre-wrap select-all">
                {currentCode}
              </pre>

              <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500 space-y-1">
                <div className="flex justify-between">
                  <span>Deploy at:</span>
                  <code className="font-mono text-gray-800">/{currentFileName}</code>
                </div>
                <div className="flex justify-between">
                  <span>File Type:</span>
                  <span className="font-mono text-gray-600">Markdown (text/plain)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Landing Page Content / Educational Guide */}
        <section className="mt-24 pt-14 border-t border-gray-200 max-w-5xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF5B04]">
              Standard /llms.txt Specification
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-jakarta mt-2">
              Why AI Agents Need Curated Markdown Files
            </h2>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              When AI systems like ChatGPT Search, Claude, or Perplexity visit websites, parsing complex HTML, JavaScript bundles, and cookie banners consumes excess tokens. llms.txt provides a high-density markdown summary.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <span className="text-2xl font-bold font-mono text-[#FF5B04] mb-3 block">01</span>
              <h3 className="text-sm font-bold text-gray-900 mb-2 font-jakarta">Token Efficiency</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Markdown strips away CSS, layout wrappers, and tracking scripts, allowing LLMs to ingest your exact product documentation with zero token wastage.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <span className="text-2xl font-bold font-mono text-[#FF5B04] mb-3 block">02</span>
              <h3 className="text-sm font-bold text-gray-900 mb-2 font-jakarta">Precise Citations</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Clear markdown headings and bulleted feature lists provide definitive answers for AI conversational models, minimizing factual hallucinations.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <span className="text-2xl font-bold font-mono text-[#FF5B04] mb-3 block">03</span>
              <h3 className="text-sm font-bold text-gray-900 mb-2 font-jakarta">Dual Standard Support</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Deploy both a lightweight <code className="font-mono text-gray-800">/llms.txt</code> index and a deep comprehensive <code className="font-mono text-gray-800">/llms-full.txt</code> repository.
              </p>
            </div>
          </div>

          {/* FAQs */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 font-jakarta mb-6">
              Frequently Asked Questions about llms.txt
            </h3>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <h4 className="text-xs font-bold text-gray-900 mb-1">Where do I upload llms.txt?</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Serve it at the root of your domain: <code className="font-mono text-gray-800">https://yourdomain.com/llms.txt</code>. In Next.js, save it in <code className="font-mono text-gray-800">/public/llms.txt</code>.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <h4 className="text-xs font-bold text-gray-900 mb-1">What is the difference between llms.txt and llms-full.txt?</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  <code className="font-mono text-gray-800">llms.txt</code> is a concise index and high-level summary. <code className="font-mono text-gray-800">llms-full.txt</code> contains complete documentation, API guides, and pricing structures for deep context queries.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Suggested Tools (Dual-Category Grouping) */}
        <div className="max-w-5xl mx-auto">
          <SuggestedTools currentToolId="llms-txt-generator" category="ai-geo" />
        </div>
      </div>
    </div>
  );
}
