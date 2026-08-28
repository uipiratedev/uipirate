"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ElevatedUnderglowCTA,
  ElevatedUnderglowTheme,
  ElevatedUnderglowStateMode,
  ElevatedUnderglowSize,
  ElevatedUnderglowIconType,
  UNDERGLOW_THEMES,
} from "@/components/ElevatedUnderglowCTA";

export default function ElevatedUnderglowScreen() {
  const [theme, setTheme] = useState<ElevatedUnderglowTheme>("figma");
  const [size, setSize] = useState<ElevatedUnderglowSize>("md");
  const [stateMode, setStateMode] = useState<ElevatedUnderglowStateMode>("interactive");
  const [iconType, setIconType] = useState<ElevatedUnderglowIconType>("phone");
  const [labelText, setLabelText] = useState("Book A Call");
  const [clickCount, setClickCount] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<"component" | "usage" | "css">("component");
  const [stageBgDark, setStageBgDark] = useState(false);
  const [copiedInstall, setCopiedInstall] = useState(false);

  const handleCopy = (text: string, tabName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(tabName);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleCopyInstall = () => {
    navigator.clipboard.writeText("npm install framer-motion clsx lucide-react");
    setCopiedInstall(true);
    setTimeout(() => setCopiedInstall(false), 2000);
  };

  const componentSourceCode = `"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Calendar, ArrowRight, Sparkles, Mail } from "lucide-react";

export type ElevatedUnderglowTheme =
  | "figma"
  | "uipirate"
  | "cyan"
  | "emerald"
  | "violet"
  | "crimson"
  | "amber"
  | "dark";

export type ElevatedUnderglowSize = "sm" | "md" | "lg";
export type ElevatedUnderglowIconType = "phone" | "calendar" | "arrow" | "sparkle" | "mail" | "none";

export interface ElevatedUnderglowCTAProps {
  label?: string;
  icon?: ElevatedUnderglowIconType | React.ReactNode;
  theme?: ElevatedUnderglowTheme;
  size?: ElevatedUnderglowSize;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  className?: string;
}

export const UNDERGLOW_THEMES = {
  figma: {
    primaryColor: "#0077FF",
    baseBg: "bg-[#0077FF]",
    capBg: "bg-[#e8e8e8]",
    capBorder: "border-[#efefef]",
    capText: "text-[#353535]",
  },
  uipirate: {
    primaryColor: "#FF5B04",
    baseBg: "bg-[#FF5B04]",
    capBg: "bg-[#f0ece7]",
    capBorder: "border-[#fbf8f5]",
    capText: "text-[#26211d]",
  },
  cyan: {
    primaryColor: "#06B6D4",
    baseBg: "bg-[#06B6D4]",
    capBg: "bg-[#e6f4f8]",
    capBorder: "border-[#f0f9fb]",
    capText: "text-[#164e63]",
  },
};

export function ElevatedUnderglowCTA({
  label = "Book A Call",
  icon = "phone",
  theme = "figma",
  size = "md",
  onClick,
  disabled = false,
  className = "",
}: ElevatedUnderglowCTAProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const t = UNDERGLOW_THEMES[theme as keyof typeof UNDERGLOW_THEMES] || UNDERGLOW_THEMES.figma;

  const renderIcon = () => {
    if (typeof icon !== "string") return icon;
    switch (icon) {
      case "phone": return <Phone className="w-4 h-4" />;
      case "calendar": return <Calendar className="w-4 h-4" />;
      case "arrow": return <ArrowRight className="w-4 h-4" />;
      case "sparkle": return <Sparkles className="w-4 h-4" />;
      case "mail": return <Mail className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div
      className={\`relative inline-block select-none \${className}\`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
    >
      {/* 3D Underglow Base Extrusion */}
      <div
        className={\`absolute inset-0 rounded-[35px] \${t.baseBg} transition-opacity duration-300 \${
          isHovered ? "opacity-100" : "opacity-0"
        }\`}
        style={{
          boxShadow: \`0px 21px 12px 0px \${t.primaryColor}26, 0px 9px 9px 0px \${t.primaryColor}42\`,
        }}
      />

      {/* Floating Cap Button */}
      <motion.button
        type="button"
        disabled={disabled}
        onClick={onClick}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        animate={{
          y: isPressed ? 2 : isHovered ? -13 : 0,
        }}
        transition={{ type: "spring", stiffness: 450, damping: 25 }}
        className={\`relative flex items-center justify-center gap-3 px-6 py-3.5 rounded-[35px] \${t.capBg} \${t.capBorder} border \${t.capText} font-semibold text-sm cursor-pointer shadow-lg\`}
      >
        {renderIcon()}
        <span>{label}</span>
      </motion.button>
    </div>
  );
}`;

  const usageCode = `import { ElevatedUnderglowCTA } from "@/components/ElevatedUnderglowCTA";

export default function Example() {
  return (
    <ElevatedUnderglowCTA
      label="${labelText}"
      theme="${theme}"
      size="${size}"
      stateMode="${stateMode}"
      icon="${iconType}"
      onClick={() => console.log("Booked a call!")}
    />
  );
}`;

  const cssOnlyCode = `/* Elevated Underglow 3D Button Design Tokens */

/* 1. Resting State */
.elevated-cta-resting {
  position: relative;
  width: 184px;
  height: 56px;
  padding: 10px 22px;
  border-radius: 35px;
  background-color: #E8E8E8;
  border: 1px solid #EFEFEF;
  color: #353535;
  font-family: 'Figtree', sans-serif;
  font-size: 18px;
  box-shadow:
    0px 2px 0px 0px #DADADA,
    0px 87px 24px 0px rgba(0, 0, 0, 0),
    0px 55px 22px 0px rgba(0, 0, 0, 0.01),
    0px 31px 19px 0px rgba(0, 0, 0, 0.05),
    0px 14px 14px 0px rgba(0, 0, 0, 0.09),
    0px 3px 8px 0px rgba(0, 0, 0, 0.1);
}

/* 2. Elevated State (13px Spring Lift) */
.elevated-cta-hover-cap {
  transform: translateY(-13px);
  box-shadow:
    0px 21px 12px 0px rgba(0, 145, 255, 0.15),
    0px 2px 0px 0px #DADADA,
    inset 0px -26px 23px -20px rgba(0, 119, 255, 0.1);
}

/* 3. Base Underglow Flare */
.elevated-cta-hover-base {
  position: absolute;
  bottom: 0;
  width: 184px;
  height: 56px;
  border-radius: 35px;
  background-color: #0077FF;
  box-shadow:
    0px 21px 12px 0px rgba(0, 145, 255, 0.15),
    0px 9px 9px 0px rgba(0, 145, 255, 0.26),
    0px 2px 5px 0px rgba(0, 145, 255, 0.29);
}`;

  return (
    <div className="min-h-screen bg-[#07090E] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 selection:bg-blue-500/30 selection:text-blue-200">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <Link
            href="/buttons"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-300 transition-colors group"
          >
            <svg
              className="w-4 h-4 text-gray-400 group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>All Buttons</span>
          </Link>
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-gray-500">
            <Link href="/ui-components" className="text-gray-400 hover:text-white transition-colors">
              UI Components
            </Link>
            <span>/</span>
            <Link href="/buttons" className="text-gray-400 hover:text-white transition-colors">
              Buttons
            </Link>
            <span>/</span>
            <span className="text-blue-400">Elevated Underglow CTA</span>
          </div>
        </div>

        {/* Header section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-300 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span>Interactive 3D Spring Button</span>
            <span className="text-gray-500">•</span>
            <span className="text-blue-400">React + Framer Motion</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white font-jakarta">
            Elevated Underglow <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">3D CTA Button</span>
          </h1>

          <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
            Multi-tier 3D CTA button featuring 13px spring elevation, dynamic base underglow flare, and specular reflection bottom insets.
          </p>
        </div>

        {/* Live Interactive Studio / Sandbox */}
        <div className="bg-neutral-900/80 backdrop-blur-xl border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-neutral-800 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
              </div>
              <span className="text-sm font-semibold text-gray-300 font-mono">
                Interactive 3D Underglow Canvas
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStageBgDark((p) => !p)}
                className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-mono text-neutral-300 transition-colors"
              >
                Canvas: {stageBgDark ? "Dark" : "Light"}
              </button>
            </div>
          </div>

          <div
            className={`p-12 sm:p-16 flex flex-col items-center justify-center min-h-[380px] transition-colors duration-500 relative overflow-hidden ${
              stageBgDark ? "bg-[#0c0d12]" : "bg-[#F3F4F6]"
            }`}
          >
            <div className="relative z-10 flex flex-col items-center gap-6">
              <ElevatedUnderglowCTA
                label={labelText}
                theme={theme}
                size={size}
                stateMode={stateMode}
                icon={iconType}
                onClick={() => setClickCount((c) => c + 1)}
              />

              <div className="flex items-center gap-2 text-xs font-mono text-gray-500 bg-black/10 px-3 py-1 rounded-full border border-black/5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                <span>Interactions:</span>
                <span className="text-gray-900 font-semibold">{clickCount}</span>
              </div>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-6 border-t border-neutral-800 bg-neutral-900/60 text-xs">
            <div className="space-y-1.5">
              <label className="font-mono text-gray-400 uppercase tracking-wider block">
                Theme Color
              </label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as ElevatedUnderglowTheme)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono"
              >
                {(Object.keys(UNDERGLOW_THEMES) as ElevatedUnderglowTheme[]).map((key) => (
                  <option key={key} value={key} className="bg-neutral-900">
                    {UNDERGLOW_THEMES[key]?.name || key}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-gray-400 uppercase tracking-wider block">
                Button Label
              </label>
              <input
                type="text"
                value={labelText}
                onChange={(e) => setLabelText(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-gray-400 uppercase tracking-wider block">
                Scale Size
              </label>
              <div className="flex gap-1">
                {(["sm", "md", "lg"] as ElevatedUnderglowSize[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`flex-1 py-2 rounded-xl uppercase font-mono transition-all ${
                      size === s ? "bg-blue-600 text-white font-bold" : "bg-neutral-800 text-gray-400"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-gray-400 uppercase tracking-wider block">
                Icon
              </label>
              <select
                value={iconType}
                onChange={(e) => setIconType(e.target.value as ElevatedUnderglowIconType)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono"
              >
                <option value="phone">Phone</option>
                <option value="calendar">Calendar</option>
                <option value="arrow">Arrow</option>
                <option value="sparkle">Sparkle</option>
                <option value="mail">Mail</option>
                <option value="none">None</option>
              </select>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            QUICK INSTALLATION & DEPENDENCIES SECTION
           ───────────────────────────────────────────────────────────── */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">Installation &amp; Setup</h2>
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <p className="text-sm text-gray-300 leading-relaxed">
              Install the required dependencies for Framer Motion spring physics and Lucide icons:
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 bg-black/60 border border-neutral-800 rounded-2xl px-5 py-3.5 font-mono text-xs text-emerald-400">
              <span>npm install framer-motion clsx lucide-react</span>
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
                  activeCodeTab === "component"
                    ? componentSourceCode
                    : activeCodeTab === "usage"
                    ? usageCode
                    : cssOnlyCode,
                  activeCodeTab
                )
              }
              className="text-xs font-mono text-blue-400 hover:text-blue-300 transition-colors"
            >
              {copiedCode === activeCodeTab ? "✓ Copied to Clipboard" : "Copy Active Tab Code"}
            </button>
          </div>

          <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-neutral-800 bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white font-mono">
                  {activeCodeTab === "component" ? "ElevatedUnderglowCTA.tsx" : activeCodeTab === "usage" ? "Usage.tsx" : "Tokens.css"}
                </span>
                <span className="text-xs text-gray-500 font-mono">• Production Ready</span>
              </div>

              <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/5 text-xs">
                <button
                  onClick={() => setActiveCodeTab("component")}
                  className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                    activeCodeTab === "component" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Component.tsx
                </button>
                <button
                  onClick={() => setActiveCodeTab("usage")}
                  className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                    activeCodeTab === "usage" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Usage.tsx
                </button>
                <button
                  onClick={() => setActiveCodeTab("css")}
                  className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                    activeCodeTab === "css" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Tokens.css
                </button>
              </div>
            </div>

            <div className="p-6 bg-[#0a0c10] overflow-x-auto max-h-[550px]">
              <pre className="text-xs sm:text-sm font-mono text-neutral-300 leading-relaxed">
                <code>
                  {activeCodeTab === "component"
                    ? componentSourceCode
                    : activeCodeTab === "usage"
                    ? usageCode
                    : cssOnlyCode}
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
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-neutral-800 bg-white/[0.02] text-gray-400 font-mono">
                    <th className="py-3.5 px-6 font-semibold">Prop</th>
                    <th className="py-3.5 px-6 font-semibold">Type</th>
                    <th className="py-3.5 px-6 font-semibold">Default</th>
                    <th className="py-3.5 px-6 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800 text-gray-300 font-mono text-xs">
                  <tr>
                    <td className="py-3 px-6 text-blue-400 font-semibold">label</td>
                    <td className="py-3 px-6 text-blue-300">string</td>
                    <td className="py-3 px-6 text-gray-400">&quot;Book A Call&quot;</td>
                    <td className="py-3 px-6 font-sans text-gray-300">Text displayed inside the button</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-blue-400 font-semibold">icon</td>
                    <td className="py-3 px-6 text-blue-300">&quot;phone&quot; | &quot;calendar&quot; | &quot;arrow&quot; | &quot;sparkle&quot; | &quot;mail&quot; | ReactNode</td>
                    <td className="py-3 px-6 text-gray-400">&quot;phone&quot;</td>
                    <td className="py-3 px-6 font-sans text-gray-300">Leading icon glyph or custom React node</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-blue-400 font-semibold">theme</td>
                    <td className="py-3 px-6 text-blue-300">ElevatedUnderglowTheme</td>
                    <td className="py-3 px-6 text-gray-400">&quot;figma&quot;</td>
                    <td className="py-3 px-6 font-sans text-gray-300">Colorway theme preset (Electric Blue, Orange, Cyan, etc.)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-blue-400 font-semibold">size</td>
                    <td className="py-3 px-6 text-blue-300">&quot;sm&quot; | &quot;md&quot; | &quot;lg&quot;</td>
                    <td className="py-3 px-6 text-gray-400">&quot;md&quot;</td>
                    <td className="py-3 px-6 font-sans text-gray-300">Scale multiplier</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-blue-400 font-semibold">onClick</td>
                    <td className="py-3 px-6 text-blue-300">(e) =&gt; void</td>
                    <td className="py-3 px-6 text-gray-400">undefined</td>
                    <td className="py-3 px-6 font-sans text-gray-300">Click callback event handler</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
