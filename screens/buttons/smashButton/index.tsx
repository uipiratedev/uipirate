"use client";

import React, { useState } from "react";
import Link from "next/link";
import SmashTactileButton, {
  SmashButtonVariant,
} from "@/components/SmashTactileButton";

export default function SmashTactileButtonScreen() {
  const [label, setLabel] = useState("Smash the button");
  const [variant, setVariant] = useState<SmashButtonVariant>("figma");
  const [size, setSize] = useState<"sm" | "md" | "lg" | "hero">("md");
  const [smashCount, setSmashCount] = useState(0);
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

  const componentSourceCode = `"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export type SmashButtonVariant = "figma" | "dark" | "orange" | "cyberpunk";

export interface SmashTactileButtonProps {
  label?: string;
  variant?: SmashButtonVariant;
  size?: "sm" | "md" | "lg" | "hero";
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export function SmashTactileButton({
  label = "Smash the button",
  variant = "figma",
  size = "md",
  onClick,
  className = "",
  disabled = false,
}: SmashTactileButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={\`relative inline-block select-none p-3 rounded-[30px] bg-white/65 border border-[#CEC9F1] shadow-2xl \${className}\`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
    >
      <div className="relative p-2 rounded-[24px] bg-[#F3F3FE] shadow-[inset_0_1px_0_white,inset_0_-3px_0_#DFDEFB]">
        <motion.button
          type="button"
          disabled={disabled}
          onClick={onClick}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          animate={{
            y: isPressed ? 3 : isHovered ? -2 : 0,
            scale: isPressed ? 0.98 : 1,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 22 }}
          className="relative px-10 py-4 rounded-[20px] bg-gradient-to-br from-[#1C182F] via-[#161326] to-[#0E0C18] text-white font-bold text-sm tracking-wide cursor-pointer focus:outline-none shadow-xl"
        >
          <span>{label}</span>
        </motion.button>
      </div>
    </div>
  );
}

export default SmashTactileButton;`;

  const usageCode = `import { SmashTactileButton } from "@/components/SmashTactileButton";

export default function Example() {
  return (
    <SmashTactileButton
      label="${label}"
      variant="${variant}"
      size="${size}"
      onClick={() => console.log("Button Smashed!")}
    />
  );
}`;

  const cssOnlyCode = `/* 5-Tier Tactile Compression Architecture */
.smash-deck-frame {
  border: 1px solid #CEC9F1;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.65);
  box-shadow: 0px 42px 33px rgba(26, 0, 108, 0.05);
}

.smash-porcelain-tray {
  background: #F3F3FE;
  border-radius: 24px;
  box-shadow: inset 0px 1px 0px 0px #FFFFFF, inset 0px -3px 0px 0px #DFDEFB;
}`;

  return (
    <div className="min-h-screen bg-[#0E0E10] text-gray-100 selection:bg-purple-500 selection:text-white pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header section */}
        <header className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-medium text-purple-300 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <span>5-Tier Tactile Compression</span>
            <span className="text-gray-500">•</span>
            <span className="text-purple-400">React + Framer Motion</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white font-jakarta">
            Smash Tactile <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-violet-200 to-purple-500">Haptic Button</span>
          </h1>

          <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
            Multi-tier tactile compression button featuring porcelain cushion trays, dot-matrix arrays, internal optical flare beam, and deep haptic depression.
          </p>
        </header>

        {/* Live Interactive Studio / Sandbox */}
        <div className="bg-[#151518] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-12 sm:p-20 flex flex-col items-center justify-center min-h-[380px] relative overflow-hidden bg-gradient-to-b from-[#181524] to-[#0D0B14]">
            <div className="relative z-10 flex flex-col items-center gap-6">
              <SmashTactileButton
                label={label}
                variant={variant}
                size={size}
                onClick={() => setSmashCount((c) => c + 1)}
              />

              <div className="flex items-center gap-2 text-xs font-mono text-gray-500 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                <span>Interactions:</span>
                <span className="text-white font-semibold">{smashCount}</span>
              </div>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 border-t border-white/10 bg-white/[0.01] text-xs">
            <div className="space-y-1.5">
              <label className="font-mono text-gray-400 uppercase tracking-wider block">Theme</label>
              <select
                value={variant}
                onChange={(e) => setVariant(e.target.value as SmashButtonVariant)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
              >
                <option value="figma" className="bg-[#151518]">Figma Master (1:1)</option>
                <option value="dark" className="bg-[#151518]">Dark Cyan</option>
                <option value="orange" className="bg-[#151518]">UI Pirate Orange</option>
                <option value="cyberpunk" className="bg-[#151518]">Cyberpunk Pink</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-gray-400 uppercase tracking-wider block">Button Label</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-gray-400 uppercase tracking-wider block">Scale</label>
              <div className="flex gap-1">
                {(["sm", "md", "lg", "hero"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`flex-1 py-2 rounded-xl uppercase font-mono transition-all ${
                      size === s ? "bg-purple-600 text-white font-bold" : "bg-white/5 text-gray-400"
                    }`}
                  >
                    {s}
                  </button>
                ))}
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
              className="text-xs font-mono text-purple-400 hover:text-purple-300 transition-colors"
            >
              {copiedCode === activeCodeTab ? "✓ Copied to Clipboard" : "Copy Active Tab Code"}
            </button>
          </div>

          <div className="bg-[#151518] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white font-mono">
                  {activeCodeTab === "component" ? "SmashTactileButton.tsx" : activeCodeTab === "usage" ? "Usage.tsx" : "Tokens.css"}
                </span>
                <span className="text-xs text-gray-500 font-mono">• Production Ready</span>
              </div>

              <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/5 text-xs">
                <button
                  onClick={() => setActiveCodeTab("component")}
                  className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                    activeCodeTab === "component" ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Component.tsx
                </button>
                <button
                  onClick={() => setActiveCodeTab("usage")}
                  className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                    activeCodeTab === "usage" ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Usage.tsx
                </button>
                <button
                  onClick={() => setActiveCodeTab("css")}
                  className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                    activeCodeTab === "css" ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"
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
                    <td className="py-3 px-6 text-purple-400 font-semibold">label</td>
                    <td className="py-3 px-6 text-blue-300">string</td>
                    <td className="py-3 px-6 text-gray-400">&quot;Smash the button&quot;</td>
                    <td className="py-3 px-6 font-sans text-gray-300">Text displayed on the central core cap</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-purple-400 font-semibold">variant</td>
                    <td className="py-3 px-6 text-blue-300">SmashButtonVariant</td>
                    <td className="py-3 px-6 text-gray-400">&quot;figma&quot;</td>
                    <td className="py-3 px-6 font-sans text-gray-300">Color scheme theme preset</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-purple-400 font-semibold">size</td>
                    <td className="py-3 px-6 text-blue-300">&quot;sm&quot; | &quot;md&quot; | &quot;lg&quot; | &quot;hero&quot;</td>
                    <td className="py-3 px-6 text-gray-400">&quot;md&quot;</td>
                    <td className="py-3 px-6 font-sans text-gray-300">Scale multiplier</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-purple-400 font-semibold">onClick</td>
                    <td className="py-3 px-6 text-blue-300">() =&gt; void</td>
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
