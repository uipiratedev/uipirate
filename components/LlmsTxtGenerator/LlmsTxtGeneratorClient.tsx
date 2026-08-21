"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";

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
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-20 xl:px-32 pt-28 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 shadow-sm rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B04]" />
            <span className="text-[#FF5B04] text-xs font-semibold font-jetbrains-mono uppercase tracking-wider">
              Free AI File Generator
            </span>
            <span className="w-px h-3 bg-gray-200" />
            <span className="text-gray-400 text-xs">Standard & Full Context</span>
          </div>

          <h1 className="heading-hero text-gray-900 mb-4">
            <span className="text-[#FF5B04]">llms.txt</span> & llms-full.txt Generator
          </h1>
          <p className="sub-header">
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
      </div>
    </div>
  );
}
