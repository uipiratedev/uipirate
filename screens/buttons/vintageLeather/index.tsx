"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  VintageLeatherCTA,
  VintageLeatherTheme,
  VintageLeatherSize,
  VintageLeatherStateMode,
} from "@/components/VintageLeatherCTA";
import StudioCanvas from "@/components/StudioCanvas";
import PageWrapper from "@/components/PageWrapper";
import GlobalCTA from "@/components/GlobalCTA";

export const VINTAGE_LEATHER_COMPONENT_SOURCE = `"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export type VintageLeatherTheme = "heritage" | "uipirate" | "obsidian" | "emerald" | "ruby" | "silver";
export type VintageLeatherSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface VintageLeatherCTAProps {
  label?: string;
  theme?: VintageLeatherTheme;
  size?: VintageLeatherSize;
  showOrnaments?: boolean;
  onClick?: () => void;
  className?: string;
}

export function VintageLeatherCTA({
  label = "Shop ties",
  theme = "heritage",
  size = "md",
  showOrnaments = true,
  onClick,
  className = "",
}: VintageLeatherCTAProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const themeConfig = {
    heritage: {
      bg: "bg-gradient-to-b from-[#B4986C] via-[#94774B] to-[#715428]",
      border: "border-[#C9B086]/60",
      text: "text-[#3D260D]",
      shadow: "shadow-[0_8px_16px_rgba(113,84,40,0.3),inset_0_2px_0_rgba(255,255,255,0.4)]",
    },
    uipirate: {
      bg: "bg-gradient-to-b from-[#FF5B04] via-[#D94500] to-[#A33000]",
      border: "border-orange-400/60",
      text: "text-white",
      shadow: "shadow-[0_8px_16px_rgba(255,91,4,0.35),inset_0_2px_0_rgba(255,255,255,0.4)]",
    },
    obsidian: {
      bg: "bg-gradient-to-b from-[#2A2D35] via-[#1A1C22] to-[#0E1014]",
      border: "border-white/20",
      text: "text-[#E6C687]",
      shadow: "shadow-[0_8px_16px_rgba(0,0,0,0.6),inset_0_2px_0_rgba(255,255,255,0.2)]",
    },
  }[theme as "heritage" | "uipirate" | "obsidian"] || {
    bg: "bg-gradient-to-b from-[#B4986C] via-[#94774B] to-[#715428]",
    border: "border-[#C9B086]/60",
    text: "text-[#3D260D]",
    shadow: "shadow-[0_8px_16px_rgba(113,84,40,0.3),inset_0_2px_0_rgba(255,255,255,0.4)]",
  };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      animate={{
        y: isPressed ? 2 : isHovered ? -3 : 0,
        scale: isPressed ? 0.98 : 1,
      }}
      transition={{ type: "spring", stiffness: 450, damping: 25 }}
      className={\`relative px-8 py-3.5 rounded-[18px] \${themeConfig.bg} \${themeConfig.border} border \${themeConfig.shadow} \${themeConfig.text} font-serif font-bold text-sm tracking-wide cursor-pointer focus:outline-none select-none \${className}\`}
    >
      <span className="relative z-10 uppercase tracking-widest">{label}</span>
    </motion.button>
  );
}`;

export default function VintageLeatherScreen() {
  const [theme, setTheme] = useState<VintageLeatherTheme>("heritage");
  const [size, setSize] = useState<VintageLeatherSize>("md");
  const [stateMode, setStateMode] = useState<VintageLeatherStateMode>("interactive");
  const [showOrnaments, setShowOrnaments] = useState(true);
  const [labelText, setLabelText] = useState("Shop ties");
  const [clickCount, setClickCount] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<"component" | "usage" | "css">("component");
  const [copiedInstall, setCopiedInstall] = useState(false);

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

  const componentSourceCode = VINTAGE_LEATHER_COMPONENT_SOURCE;

  const usageCode = `import { VintageLeatherCTA } from "@/components/VintageLeatherCTA";

export default function Example() {
  return (
    <VintageLeatherCTA
      label="${labelText}"
      theme="${theme}"
      size="${size}"
      showOrnaments={${showOrnaments}}
      onClick={() => console.log("Shop clicked!")}
    />
  );
}`;

  const cssOnlyCode = `/* Vintage Saddle Leather Design System Tokens */
.vintage-leather-cap {
  background: linear-gradient(180deg, #B4986C 0%, #94774B 50%, #715428 100%);
  border: 1px solid rgba(201, 176, 134, 0.6);
  box-shadow: 0px 8px 16px rgba(113, 84, 40, 0.3),
              inset 0px 2px 0px rgba(255, 255, 255, 0.4),
              inset 0px -4px 0px rgba(0, 0, 0, 0.3);
}`;

  return (
    <PageWrapper showFloatingButton={false}>
      <div className="relative overflow-hidden min-h-screen bg-[#070709] text-white pt-6 pb-20 selection:bg-amber-500/30 selection:text-amber-200">
        <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          {/* Header section */}
          <header className="text-center space-y-4 max-w-3xl mx-auto pt-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-medium text-amber-300 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Artisanal Skeuomorphic Leather</span>
              <span className="text-gray-500">•</span>
              <span className="text-amber-400">Heritage Brass &amp; Saddle</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white font-jakarta">
              Vintage Leather <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500">Heritage CTA Button</span>
            </h1>

            <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
              Crafted skeuomorphic button featuring authentic saddle leather grain noise, engraved vector scrollwork flourishes, and rich brass bevel highlights.
            </p>
          </header>

        {/* Live Interactive Studio / Sandbox */}
        <div className="bg-[#101014] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <StudioCanvas>
              <VintageLeatherCTA
                label={labelText}
                theme={theme}
                size={size}
                stateMode={stateMode}
                showOrnaments={showOrnaments}
                onClick={() => setClickCount((c) => c + 1)}
              />

              <div className="flex items-center gap-2 text-xs font-mono text-gray-500 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>Interactions:</span>
                <span className="text-white font-semibold">{clickCount}</span>
              </div>
          </StudioCanvas>
        </div>

        {/* Customizer */}
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white/70 font-mono">Customizer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5 text-xs">
            <div className="space-y-1.5">
              <label className="font-mono text-gray-400 uppercase tracking-wider block">Label</label>
              <input
                type="text"
                value={labelText}
                onChange={(e) => setLabelText(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-gray-400 uppercase tracking-wider block">Theme</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as VintageLeatherTheme)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
              >
                <option value="heritage" className="bg-[#101014]">Brass & Saddle (1:1 spec)</option>
                <option value="uipirate" className="bg-[#101014]">UI Pirate Burnt Orange</option>
                <option value="obsidian" className="bg-[#101014]">Obsidian Gold</option>
                <option value="emerald" className="bg-[#101014]">British Racing Green</option>
                <option value="ruby" className="bg-[#101014]">Burgundy Wine</option>
                <option value="silver" className="bg-[#101014]">Brushed Titanium</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-gray-400 uppercase tracking-wider block">Scale</label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value as typeof size)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
              >
                <option value="xs" className="bg-[#151518] text-white">Extra Small</option>
                <option value="sm" className="bg-[#151518] text-white">Small</option>
                <option value="md" className="bg-[#151518] text-white">Medium</option>
                <option value="lg" className="bg-[#151518] text-white">Large</option>
                <option value="xl" className="bg-[#151518] text-white">Extra Large</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-gray-400 uppercase tracking-wider block">State Preview</label>
              <select
                value={stateMode}
                onChange={(e) => setStateMode(e.target.value as VintageLeatherStateMode)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
              >
                <option value="interactive" className="bg-[#101014]">Interactive</option>
                <option value="standerd" className="bg-[#101014]">Standard</option>
                <option value="hover" className="bg-[#101014]">Hover</option>
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
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-[#B4986C] mb-1.5">
                <span>PRESETS &amp; VARIATIONS</span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">All Variants Preview</h2>
            </div>
            <p className="text-xs text-gray-400 font-mono">
              Hover &amp; click to preview heritage tactile embossed leather &amp; brass bevel flourishes
            </p>
          </div>

          <div className="bg-[#151518]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Heritage Brass & Leather */}
              <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[220px] overflow-x-clip transition-all hover:border-white/15">
                <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                  <span className="text-white font-semibold">Heritage Brass</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-amber-300">theme=&quot;heritage&quot;</span>
                </div>
                <div className="my-3">
                  <VintageLeatherCTA
                    theme="heritage"
                    label="Contact Sales"
                    size="md"
                  />
                </div>
                <span className="text-[11px] font-mono text-gray-500 text-center">1:1 reference design with embossed cowhide leather &amp; brass lip</span>
              </div>

              {/* UI Pirate Bronze */}
              <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[220px] overflow-x-clip transition-all hover:border-white/15">
                <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                  <span className="text-white font-semibold">UI Pirate Bronze</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-orange-400">theme=&quot;uipirate&quot;</span>
                </div>
                <div className="my-3">
                  <VintageLeatherCTA
                    theme="uipirate"
                    label="Explore Ship"
                    size="md"
                  />
                </div>
                <span className="text-[11px] font-mono text-gray-500 text-center">Signature magma orange leather with filigree corner ornaments</span>
              </div>

              {/* Obsidian Platinum */}
              <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[220px] overflow-x-clip transition-all hover:border-white/15">
                <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                  <span className="text-white font-semibold">Obsidian Platinum</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-gray-300">theme=&quot;obsidian&quot;</span>
                </div>
                <div className="my-3">
                  <VintageLeatherCTA
                    theme="obsidian"
                    label="Schedule Call"
                    size="md"
                  />
                </div>
                <span className="text-[11px] font-mono text-gray-500 text-center">Stealth midnight black leather with platinum bevel edging</span>
              </div>

              {/* Emerald Imperial */}
              <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[220px] overflow-x-clip transition-all hover:border-white/15">
                <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                  <span className="text-white font-semibold">Emerald Imperial</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-emerald-400">theme=&quot;emerald&quot;</span>
                </div>
                <div className="my-3">
                  <VintageLeatherCTA
                    theme="emerald"
                    label="Claim Throne"
                    size="md"
                  />
                </div>
                <span className="text-[11px] font-mono text-gray-500 text-center">Royal jade leather with golden scrollwork corner flourishes</span>
              </div>

              {/* Ruby Royalty */}
              <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[220px] overflow-x-clip transition-all hover:border-white/15">
                <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                  <span className="text-white font-semibold">Ruby Royalty</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-rose-400">theme=&quot;ruby&quot;</span>
                </div>
                <div className="my-3">
                  <VintageLeatherCTA
                    theme="ruby"
                    label="Join Order"
                    size="md"
                  />
                </div>
                <span className="text-[11px] font-mono text-gray-500 text-center">Deep burgundy wine leather with gilded golden tactile bevel</span>
              </div>

              {/* Silver Armour */}
              <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[220px] overflow-x-clip transition-all hover:border-white/15">
                <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                  <span className="text-white font-semibold">Silver Armour</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-blue-300">theme=&quot;silver&quot;</span>
                </div>
                <div className="my-3">
                  <VintageLeatherCTA
                    theme="silver"
                    label="View Armoury"
                    size="md"
                  />
                </div>
                <span className="text-[11px] font-mono text-gray-500 text-center">Medieval steel &amp; silver chassis with filigree corner ornaments</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            QUICK INSTALLATION & DEPENDENCIES SECTION
           ───────────────────────────────────────────────────────────── */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">Installation &amp; Setup</h2>
          <div className="bg-[#101014] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
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
              className="text-xs font-mono text-amber-400 hover:text-amber-300 transition-colors"
            >
              {copiedCode === activeCodeTab ? "✓ Copied to Clipboard" : "Copy Active Tab Code"}
            </button>
          </div>

          <div className="bg-[#101014] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white font-mono">
                  {activeCodeTab === "component" ? "VintageLeatherCTA.tsx" : activeCodeTab === "usage" ? "Usage.tsx" : "Tokens.css"}
                </span>
                <span className="text-xs text-gray-500 font-mono">• Production Ready</span>
              </div>

              <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/5 text-xs">
                <button
                  onClick={() => setActiveCodeTab("component")}
                  className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                    activeCodeTab === "component" ? "bg-amber-500 text-black font-bold" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Component.tsx
                </button>
                <button
                  onClick={() => setActiveCodeTab("usage")}
                  className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                    activeCodeTab === "usage" ? "bg-amber-500 text-black font-bold" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Usage.tsx
                </button>
                <button
                  onClick={() => setActiveCodeTab("css")}
                  className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                    activeCodeTab === "css" ? "bg-amber-500 text-black font-bold" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Tokens.css
                </button>
              </div>
            </div>

            <div className="p-6 bg-[#080706] overflow-x-auto max-h-[550px]">
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
          <div className="bg-[#101014] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
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
                    <td className="py-3 px-6 text-amber-400 font-semibold">label</td>
                    <td className="py-3 px-6 text-blue-300">string</td>
                    <td className="py-3 px-6 text-gray-400">&quot;Shop ties&quot;</td>
                    <td className="py-3 px-6 font-sans text-gray-300">Text displayed on the leather cap</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-amber-400 font-semibold">theme</td>
                    <td className="py-3 px-6 text-blue-300">VintageLeatherTheme</td>
                    <td className="py-3 px-6 text-gray-400">&quot;heritage&quot;</td>
                    <td className="py-3 px-6 font-sans text-gray-300">Luxury leather theme preset</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-amber-400 font-semibold">size</td>
                    <td className="py-3 px-6 text-blue-300">&quot;xs&quot; | &quot;sm&quot; | &quot;md&quot; | &quot;lg&quot; | &quot;xl&quot;</td>
                    <td className="py-3 px-6 text-gray-400">&quot;md&quot;</td>
                    <td className="py-3 px-6 font-sans text-gray-300">Scale multiplier</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-amber-400 font-semibold">showOrnaments</td>
                    <td className="py-3 px-6 text-blue-300">boolean</td>
                    <td className="py-3 px-6 text-gray-400">true</td>
                    <td className="py-3 px-6 font-sans text-gray-300">Renders decorative flourish scrollwork</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Website Global CTA */}
        <GlobalCTA topic="skeuomorphic leather CTA buttons or luxury web design" />
      </div>
    </div>
  </PageWrapper>
  );
}
