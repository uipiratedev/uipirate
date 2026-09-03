"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MagneticPulseCTA,
  MagneticPulseSize,
  MagneticPulseStateMode,
} from "@/components/MagneticPulseCTA";
import { useClickSound } from "@/hooks/useClickSound";
import StudioCanvas from "@/components/StudioCanvas";
import PageWrapper from "@/components/PageWrapper";
import GlobalCTA from "@/components/GlobalCTA";

export const MAGNETIC_PULSE_COMPONENT_SOURCE = `"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export interface MagneticPulseCTAProps {
  label?: string;
  pulseColor?: string;
  onClick?: () => void;
  className?: string;
}

export function MagneticPulseCTA({
  label = "Let's Venture",
  pulseColor = "#FF5B04",
  onClick,
  className = "",
}: MagneticPulseCTAProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={\`relative inline-block group select-none \${className}\`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Outer pulsing radiant glow */}
      <div
        className="absolute inset-0 rounded-full blur-2xl opacity-70 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500 animate-pulse pointer-events-none"
        style={{ backgroundColor: pulseColor }}
      />
      <motion.button
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className="relative px-8 py-4 rounded-full text-white font-bold text-base shadow-2xl flex items-center gap-3 cursor-pointer focus:outline-none"
        style={{
          backgroundColor: pulseColor,
          boxShadow: \`0 0 35px \${pulseColor}80\`,
        }}
      >
        <span>{label}</span>
        <span className="w-2 h-2 rounded-full bg-white animate-ping" />
      </motion.button>
    </div>
  );
}

export default MagneticPulseCTA;`;

export default function MagneticPulseButtonScreen() {
  const [label, setLabel] = useState("Let's Venture");
  const [pulseColor, setPulseColor] = useState("#FF5B04");
  const [size, setSize] = useState<MagneticPulseSize>("md");
  const [stateMode, setStateMode] = useState<MagneticPulseStateMode>("interactive");
  const [clickCount, setClickCount] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<"component" | "usage" | "css">("component");
  const [copiedInstall, setCopiedInstall] = useState(false);
  const playClickSound = useClickSound();

  const handleClick = () => {
    playClickSound();
    setClickCount((prev) => prev + 1);
  };

  const handleCopy = (text: string, tabName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(tabName);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleCopyInstall = () => {
    navigator.clipboard.writeText("npm install framer-motion clsx");
    setCopiedInstall(true);
    setTimeout(() => setCopiedInstall(false), 2000);
  };

  const componentSourceCode = MAGNETIC_PULSE_COMPONENT_SOURCE;

  const usageCode = `import { MagneticPulseCTA } from "@/components/MagneticPulseCTA";

export default function Example() {
  return (
    <MagneticPulseCTA
      label="${label}"
      pulseColor="${pulseColor}"
      onClick={() => console.log("Action Triggered!")}
    />
  );
}`;

  const cssOnlyCode = `/* Magnetic Radiant Pulse Tokens */
.magnetic-pulse-aura {
  border-radius: 9999px;
  filter: blur(24px);
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.magnetic-pulse-cap {
  border-radius: 9999px;
  box-shadow: 0 0 35px rgba(255, 91, 4, 0.5);
}`;

  return (
    <PageWrapper showFloatingButton={false}>
      <div className="relative overflow-hidden min-h-screen bg-[#0E0E10] text-gray-100 selection:bg-[#FF5B04] selection:text-white pt-6 pb-20">
        <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          {/* Header section */}
          <header className="text-center space-y-4 max-w-3xl mx-auto pt-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-300 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#FF5B04] animate-pulse" />
              <span>Radiant Aura Glow</span>
              <span className="text-gray-500">•</span>
              <span className="text-[#FF5B04]">Interactive Click Acoustics</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white font-jakarta">
              Magnetic Pulse <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500">Radiant CTA Button</span>
            </h1>

            <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
              High-energy radiant glow CTA button with magnetic spring physics, dynamic aura expand on hover, and live audio feedback.
            </p>
          </header>

        {/* Live Interactive Studio / Sandbox */}
        <div className="bg-[#151518]/90 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <StudioCanvas hint={`Click to trigger sound · ${clickCount} click${clickCount === 1 ? "" : "s"}`}>
            <MagneticPulseCTA
              label={label}
              pulseColor={pulseColor}
              size={size}
              stateMode={stateMode}
              onClick={handleClick}
            />
          </StudioCanvas>
        </div>

        {/* Customizer */}
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white/70 font-mono">Customizer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5 text-xs">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block font-mono">
                Button Label
              </label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF5B04] font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block font-mono">
                Scale Size
              </label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value as MagneticPulseSize)}
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
                onChange={(e) => setStateMode(e.target.value as MagneticPulseStateMode)}
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
            ALL VARIANTS & THEMES PREVIEW CARD
           ───────────────────────────────────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-[#FF5B04] mb-1.5">
                <span>PRESETS &amp; VARIATIONS</span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">All Variants Preview</h2>
            </div>
            <p className="text-xs text-gray-400 font-mono">
              Hover over buttons to trigger radial magnetic bloom expansion
            </p>
          </div>

          <div className="bg-[#151518]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* UI Pirate Orange */}
              <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[200px] overflow-x-clip transition-all hover:border-white/15">
                <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                  <span className="text-white font-semibold">UI Pirate Magma</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-orange-400">#FF5B04</span>
                </div>
                <div className="my-3">
                  <MagneticPulseCTA
                    pulseColor="#FF5B04"
                    label="Let's Venture"
                    onClick={handleClick}
                  />
                </div>
                <span className="text-[11px] font-mono text-gray-500 text-center">Signature magma orange radiant magnetic pulse</span>
              </div>

              {/* Electric Cyan */}
              <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[200px] overflow-x-clip transition-all hover:border-white/15">
                <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                  <span className="text-white font-semibold">Electric Cyan</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-cyan-400">#06B6D4</span>
                </div>
                <div className="my-3">
                  <MagneticPulseCTA
                    pulseColor="#06B6D4"
                    label="Explore Cloud"
                    onClick={handleClick}
                  />
                </div>
                <span className="text-[11px] font-mono text-gray-500 text-center">Vibrant neon cyan magnetic beacon glow</span>
              </div>

              {/* Cyber Violet */}
              <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[200px] overflow-x-clip transition-all hover:border-white/15">
                <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                  <span className="text-white font-semibold">Cyber Violet</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-purple-400">#8B5CF6</span>
                </div>
                <div className="my-3">
                  <MagneticPulseCTA
                    pulseColor="#8B5CF6"
                    label="Join Community"
                    onClick={handleClick}
                  />
                </div>
                <span className="text-[11px] font-mono text-gray-500 text-center">Ultraviolet radiant flare with pulsing beacon</span>
              </div>

              {/* Emerald Matrix */}
              <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[200px] overflow-x-clip transition-all hover:border-white/15">
                <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                  <span className="text-white font-semibold">Emerald Pulse</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-emerald-400">#10B981</span>
                </div>
                <div className="my-3">
                  <MagneticPulseCTA
                    pulseColor="#10B981"
                    label="Deploy Now"
                    onClick={handleClick}
                  />
                </div>
                <span className="text-[11px] font-mono text-gray-500 text-center">Reactor green pulsing energy beacon</span>
              </div>

              {/* Rose Flare */}
              <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[200px] overflow-x-clip transition-all hover:border-white/15">
                <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                  <span className="text-white font-semibold">Rose Flare</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-rose-400">#F43F5E</span>
                </div>
                <div className="my-3">
                  <MagneticPulseCTA
                    pulseColor="#F43F5E"
                    label="Launch Project"
                    onClick={handleClick}
                  />
                </div>
                <span className="text-[11px] font-mono text-gray-500 text-center">High-impact ruby rose radiant CTA beacon</span>
              </div>

              {/* Amber Solar */}
              <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[200px] overflow-x-clip transition-all hover:border-white/15">
                <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                  <span className="text-white font-semibold">Amber Solar</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-amber-400">#F59E0B</span>
                </div>
                <div className="my-3">
                  <MagneticPulseCTA
                    pulseColor="#F59E0B"
                    label="Get Access"
                    onClick={handleClick}
                  />
                </div>
                <span className="text-[11px] font-mono text-gray-500 text-center">Golden solar energy beacon with continuous ping</span>
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
              Install required peer dependencies:
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 bg-black/60 border border-white/10 rounded-2xl px-5 py-3.5 font-mono text-xs text-emerald-400">
              <span>npm install framer-motion clsx</span>
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
                  {activeCodeTab === "component" ? "MagneticPulseCTA.tsx" : activeCodeTab === "usage" ? "Usage.tsx" : "Tokens.css"}
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
                    <td className="py-3 px-6 text-orange-400 font-semibold">label</td>
                    <td className="py-3 px-6 text-blue-300">string</td>
                    <td className="py-3 px-6 text-gray-400">&quot;Let&apos;s Venture&quot;</td>
                    <td className="py-3 px-6 font-sans text-gray-300">Text displayed on the button cap</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-orange-400 font-semibold">pulseColor</td>
                    <td className="py-3 px-6 text-blue-300">string</td>
                    <td className="py-3 px-6 text-gray-400">&quot;#FF5B04&quot;</td>
                    <td className="py-3 px-6 font-sans text-gray-300">Hex color for radiant aura glow bloom</td>
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
        <GlobalCTA topic="magnetic pulse buttons or lead capture CTA design" />
      </div>
    </div>
  </PageWrapper>
  );
}
