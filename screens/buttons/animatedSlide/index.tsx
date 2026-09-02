"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AnimatedButton,
  AnimatedButtonSize,
  AnimatedButtonStateMode,
} from "@/components/AnimatedButton";
import StudioCanvas from "@/components/StudioCanvas";
import PageWrapper from "@/components/PageWrapper";
import GlobalCTA from "@/components/GlobalCTA";

export default function AnimatedSlideButtonScreen() {
  const [primaryText, setPrimaryText] = useState("Explore Services");
  const [hoverText, setHoverText] = useState("See More →");
  const [variant, setVariant] = useState<"primary" | "secondary">("primary");
  const [size, setSize] = useState<AnimatedButtonSize>("md");
  const [stateMode, setStateMode] = useState<AnimatedButtonStateMode>("interactive");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<"component" | "usage" | "css">("component");
  const [copiedInstall, setCopiedInstall] = useState(false);

  const handleCopy = (text: string, tabName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(tabName);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleCopyInstall = () => {
    navigator.clipboard.writeText("npm install clsx tailwind-merge");
    setCopiedInstall(true);
    setTimeout(() => setCopiedInstall(false), 2000);
  };

  const componentSourceCode = `"use client";

import React from "react";

export interface AnimatedSlideButtonProps {
  primaryText: string;
  hoverText?: string;
  variant?: "primary" | "secondary";
  onClick?: () => void;
  className?: string;
}

export function AnimatedSlideButton({
  primaryText,
  hoverText = "See More →",
  variant = "primary",
  onClick,
  className = "",
}: AnimatedSlideButtonProps) {
  const variantStyles =
    variant === "primary"
      ? "bg-black text-white hover:bg-neutral-800"
      : "bg-white text-black border-2 border-black hover:bg-neutral-100";

  return (
    <button
      type="button"
      onClick={onClick}
      className={\`group relative px-8 py-4 rounded-[20px] font-semibold text-sm transition-all duration-300 overflow-hidden cursor-pointer select-none \${variantStyles} \${className}\`}
    >
      <div className="flex flex-col items-center justify-center max-h-[22px] overflow-hidden">
        <span className="transition-transform duration-300 ease-in-out transform group-hover:translate-y-[40px] translate-y-2.5">
          {primaryText}
        </span>
        <span className="transition-transform duration-300 ease-in-out transform translate-y-[40px] group-hover:-translate-y-2.5 font-bold">
          {hoverText}
        </span>
      </div>
    </button>
  );
}

export default AnimatedSlideButton;`;

  const usageCode = `import { AnimatedButton } from "@/components/AnimatedButton";

export default function Example() {
  return (
    <AnimatedButton
      primaryText="${primaryText}"
      hoverText="${hoverText}"
      variant="${variant}"
      onClick={() => console.log("Clicked Animated Button!")}
    />
  );
}`;

  const cssOnlyCode = `/* Animated Slide-Up Roll Keyframes */
.slide-up-wrapper {
  overflow: hidden;
  height: 24px;
}

.slide-up-primary {
  transform: translateY(10px);
  transition: transform 0.3s ease-in-out;
}

.slide-up-wrapper:hover .slide-up-primary {
  transform: translateY(50px);
}

.slide-up-hover {
  transform: translateY(50px);
  transition: transform 0.3s ease-in-out;
}

.slide-up-wrapper:hover .slide-up-hover {
  transform: translateY(-10px);
}`;

  return (
    <PageWrapper showFloatingButton={false}>
      <div className="relative overflow-hidden min-h-screen bg-[#0E0E10] text-gray-100 selection:bg-[#FF5B04] selection:text-white pt-6 pb-20">
        <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          {/* Header section */}
          <header className="text-center space-y-4 max-w-3xl mx-auto pt-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-300 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#FF5B04] animate-pulse" />
              <span>Interactive Micro-Interaction</span>
              <span className="text-gray-500">•</span>
              <span className="text-[#00E5BE]">Slide-Up Text Roll</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white font-jakarta">
              Animated <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400">Slide-Up Button</span>
            </h1>

            <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
              High-converting dual-text roll CTA button. Hovering replaces the primary label with a secondary action message through smooth vertical translation with overflow clipping.
            </p>
          </header>

        {/* Live Interactive Studio / Sandbox */}
        <div className="bg-[#151518]/90 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <StudioCanvas hint="Hover to trigger the dual-label slide">
            <div className="w-full flex items-center justify-center">
              <AnimatedButton
                primaryText={primaryText}
                hoverText={hoverText}
                variant={variant}
                size={size}
                stateMode={stateMode}
                fullWidth={false}
                className="!mt-0"
              />
            </div>
          </StudioCanvas>
        </div>

        {/* Customizer */}
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white/70 font-mono">Customizer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5 text-xs">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                Primary Label
              </label>
              <input
                type="text"
                value={primaryText}
                onChange={(e) => setPrimaryText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF5B04] font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                Hover Label
              </label>
              <input
                type="text"
                value={hoverText}
                onChange={(e) => setHoverText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF5B04] font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block font-mono">
                Scale Size
              </label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value as AnimatedButtonSize)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
              >
                <option value="xs" className="bg-[#151518] text-white">Extra Small</option>
                <option value="sm" className="bg-[#151518] text-white">Small</option>
                <option value="md" className="bg-[#151518] text-white">Medium</option>
                <option value="lg" className="bg-[#151518] text-white">Large</option>
                <option value="xl" className="bg-[#151518] text-white">Extra Large</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block font-mono">
                State Preview
              </label>
              <select
                value={stateMode}
                onChange={(e) => setStateMode(e.target.value as AnimatedButtonStateMode)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
              >
                <option value="interactive" className="bg-[#151518] text-white">Interactive</option>
                <option value="standerd" className="bg-[#151518] text-white">Standard</option>
                <option value="hover" className="bg-[#151518] text-white">Hover</option>
              </select>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            ALL VARIANTS & STYLES PREVIEW CARD
           ───────────────────────────────────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-[#00E5BE] mb-1.5">
                <span>PRESETS &amp; VARIATIONS</span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">All Variants Preview</h2>
            </div>
            <p className="text-xs text-gray-400 font-mono">
              Hover over each variant to preview interaction
            </p>
          </div>

          <div className="bg-[#151518]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Primary Dark */}
              <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[200px] overflow-x-clip transition-all hover:border-white/15">
                <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400">
                  <span className="text-white font-semibold">Primary Dark</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-gray-400">variant=&quot;primary&quot;</span>
                </div>
                <div className="w-full max-w-[240px] my-4">
                  <AnimatedButton
                    primaryText="Explore Services"
                    hoverText="See More →"
                    variant="primary"
                    fullWidth={true}
                    className="!mt-0"
                  />
                </div>
                <span className="text-[11px] font-mono text-gray-500">Dark obsidian background with clean white typography</span>
              </div>

              {/* Secondary Light */}
              <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[200px] overflow-x-clip transition-all hover:border-white/15">
                <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400">
                  <span className="text-white font-semibold">Secondary Light</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-gray-400">variant=&quot;secondary&quot;</span>
                </div>
                <div className="w-full max-w-[240px] my-4">
                  <AnimatedButton
                    primaryText="Get Started"
                    hoverText="Instant Access 🚀"
                    variant="secondary"
                    fullWidth={true}
                    className="!mt-0"
                  />
                </div>
                <span className="text-[11px] font-mono text-gray-500">High-contrast white pill with crisp dark border</span>
              </div>

              {/* Action Conversion */}
              <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[200px] overflow-x-clip transition-all hover:border-white/15">
                <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400">
                  <span className="text-white font-semibold">Conversion Roll</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-gray-400">Custom Labels</span>
                </div>
                <div className="w-full max-w-[240px] my-4">
                  <AnimatedButton
                    primaryText="Claim 20% Off"
                    hoverText="Unlock Deal ✨"
                    variant="primary"
                    fullWidth={true}
                    className="!mt-0"
                  />
                </div>
                <span className="text-[11px] font-mono text-gray-500">Compelling deal incentive trigger on hover</span>
              </div>

              {/* Documentation / Link */}
              <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[200px] overflow-x-clip transition-all hover:border-white/15">
                <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400">
                  <span className="text-white font-semibold">Outline Documentation</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-gray-400">variant=&quot;secondary&quot;</span>
                </div>
                <div className="w-full max-w-[240px] my-4">
                  <AnimatedButton
                    primaryText="Documentation"
                    hoverText="Read API Specs 📖"
                    variant="secondary"
                    fullWidth={true}
                    className="!mt-0"
                  />
                </div>
                <span className="text-[11px] font-mono text-gray-500">Secondary navigation &amp; technical documentation CTA</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            QUICK INSTALLATION & DEPENDENCIES SECTION
           ───────────────────────────────────────────────────────────── */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">Installation &amp; Setup</h2>
          <div className="bg-[#151518] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
            <p className="text-sm text-gray-300 leading-relaxed">
              This component is lightweight and built with Tailwind CSS transitions:
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 bg-black/60 border border-white/10 rounded-2xl px-5 py-3.5 font-mono text-xs text-emerald-400">
              <span>npm install clsx tailwind-merge</span>
              <button
                onClick={handleCopyInstall}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-sans transition-colors cursor-pointer"
              >
                {copiedInstall ? "Copied Command!" : "Copy Command"}
              </button>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            CODE EXPORTER TABS
           ───────────────────────────────────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white tracking-tight">Code &amp; Integration</h2>
            <button
              onClick={() =>
                handleCopy(
                  activeCodeTab === "component" ? componentSourceCode : activeCodeTab === "usage" ? usageCode : cssOnlyCode,
                  activeCodeTab
                )
              }
              className="text-xs font-mono text-orange-400 hover:text-orange-300 transition-colors"
            >
              {copiedCode === activeCodeTab ? "✓ Copied to Clipboard" : "Copy Active Tab Code"}
            </button>
          </div>

          <div className="bg-[#151518] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white font-mono">
                  {activeCodeTab === "component" ? "AnimatedButton.tsx" : activeCodeTab === "usage" ? "Usage.tsx" : "Tokens.css"}
                </span>
                <span className="text-xs text-gray-500 font-mono">• Production Ready</span>
              </div>

              <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/5 text-xs">
                <button
                  onClick={() => setActiveCodeTab("component")}
                  className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                    activeCodeTab === "component" ? "bg-[#FF5B04] text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Component.tsx
                </button>
                <button
                  onClick={() => setActiveCodeTab("usage")}
                  className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                    activeCodeTab === "usage" ? "bg-[#FF5B04] text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Usage.tsx
                </button>
                <button
                  onClick={() => setActiveCodeTab("css")}
                  className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                    activeCodeTab === "css" ? "bg-[#FF5B04] text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Tokens.css
                </button>
              </div>
            </div>

            <div className="p-6 bg-[#0B0B0D] overflow-x-auto max-h-[550px]">
              <pre className="text-xs sm:text-sm font-mono text-gray-300 leading-relaxed">
                <code>
                  {activeCodeTab === "component" ? componentSourceCode : activeCodeTab === "usage" ? usageCode : cssOnlyCode}
                </code>
              </pre>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            PROPS & API REFERENCE TABLE
           ───────────────────────────────────────────────────────────── */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">Component API Reference</h2>
          <div className="bg-[#151518] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02] text-gray-400 font-mono">
                    <th className="py-3.5 px-6 font-semibold">Prop</th>
                    <th className="py-3.5 px-6 font-semibold">Type</th>
                    <th className="py-3.5 px-6 font-semibold">Default</th>
                    <th className="py-3.5 px-6 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300 font-mono text-xs">
                  <tr>
                    <td className="py-3 px-6 text-orange-400 font-semibold">primaryText</td>
                    <td className="py-3 px-6 text-blue-300">string</td>
                    <td className="py-3 px-6 text-gray-400">&quot;Explore Services&quot;</td>
                    <td className="py-3 px-6 font-sans text-gray-300">Initial text displayed in resting state</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-orange-400 font-semibold">hoverText</td>
                    <td className="py-3 px-6 text-blue-300">string</td>
                    <td className="py-3 px-6 text-gray-400">&quot;See More →&quot;</td>
                    <td className="py-3 px-6 font-sans text-gray-300">Secondary text revealed upon hover roll</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-orange-400 font-semibold">variant</td>
                    <td className="py-3 px-6 text-blue-300">&quot;primary&quot; | &quot;secondary&quot;</td>
                    <td className="py-3 px-6 text-gray-400">&quot;primary&quot;</td>
                    <td className="py-3 px-6 font-sans text-gray-300">Dark or Light styling mode</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-orange-400 font-semibold">onClick</td>
                    <td className="py-3 px-6 text-blue-300">() =&gt; void</td>
                    <td className="py-3 px-6 text-gray-400">undefined</td>
                    <td className="py-3 px-6 font-sans text-gray-300">Click callback event handler</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Website Global CTA */}
        <GlobalCTA topic="animated roll buttons or high-converting micro-interactions" />
      </div>
    </div>
  </PageWrapper>
  );
}
