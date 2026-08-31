"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import TactilePillButton, {
  TactileButtonVariant,
  TactileButtonState,
} from "@/components/TactilePillButton";
import StudioCanvas from "@/components/StudioCanvas";
import PageWrapper from "@/components/PageWrapper";
import GlobalCTA from "@/components/GlobalCTA";

const COLOR_PRESETS = [
  { label: "Figma Aqua", value: "#54EAD8", name: "Aqua" },
  { label: "Brand Orange", value: "#FF5B04", name: "Orange" },
  { label: "Emerald Green", value: "#10B981", name: "Emerald" },
  { label: "Electric Violet", value: "#8B5CF6", name: "Violet" },
  { label: "Amber Glow", value: "#F59E0B", name: "Amber" },
  { label: "Neon Pink", value: "#F43F5E", name: "Pink" },
];

export default function TactilePillButtonScreen() {
  const [label, setLabel] = useState("Get Started");
  const [dotColor, setDotColor] = useState("#54EAD8");
  const [stateMode, setStateMode] = useState<TactileButtonState>("interactive");
  const [variant, setVariant] = useState<TactileButtonVariant>("default");
  const [size, setSize] = useState<"xs" | "sm" | "md" | "lg" | "xl">("md");
  const [tiltAngle, setTiltAngle] = useState(-9.23);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<"component" | "usage" | "css">("component");
  const [clickCount, setClickCount] = useState(0);
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

export type TactileButtonVariant = "default" | "dark" | "orange" | "cyberpunk" | "minimal";
export type TactileButtonState = "interactive" | "resting" | "tilted";

export interface TactilePillButtonProps {
  label?: string;
  dotColor?: string;
  variant?: TactileButtonVariant;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  tiltAngle?: number;
  onClick?: () => void;
  className?: string;
}

export function TactilePillButton({
  label = "Get Started",
  dotColor = "#54EAD8",
  variant = "default",
  size = "md",
  tiltAngle = -9.23,
  onClick,
  className = "",
}: TactilePillButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div
      className={\`relative inline-block select-none \${className}\`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
    >
      {/* Recessed Cavity Base Slot */}
      <div className="absolute inset-0 rounded-[16px] bg-[#D4D4D8] shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]" />

      {/* Tactile Cap with Lift & Tilt */}
      <motion.button
        type="button"
        onClick={onClick}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        animate={{
          rotate: isHovered ? tiltAngle : 0,
          y: isPressed ? 2 : isHovered ? -14 : 0,
          x: isHovered ? -4 : 0,
        }}
        transition={{ type: "spring", stiffness: 450, damping: 25 }}
        className="relative flex items-center gap-3 px-6 py-3 rounded-[16px] bg-[#EAEAEA] border border-white text-gray-800 font-bold text-sm shadow-[0_8px_16px_rgba(0,0,0,0.15)] cursor-pointer focus:outline-none"
      >
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{
            backgroundColor: dotColor,
            boxShadow: \`0 0 8px \${dotColor}\`,
          }}
        />
        <span>{label}</span>
      </motion.button>
    </div>
  );
}

export default TactilePillButton;`;

  const usageCode = `import { TactilePillButton } from "@/components/TactilePillButton";

export default function Example() {
  return (
    <TactilePillButton
      label="${label}"
      dotColor="${dotColor}"
      variant="${variant}"
      size="${size}"
      tiltAngle={${tiltAngle}}
      onClick={() => console.log("Clicked!")}
    />
  );
}`;

  const cssOnlyCode = `/* Tactile Popped-Up Cavity Tokens */
.tactile-cavity-slot {
  background: #D4D4D8;
  border-radius: 16px;
  box-shadow: inset 0px 2px 4px rgba(0, 0, 0, 0.3);
}

.tactile-cap {
  background: #EAEAEA;
  border-radius: 16px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.15);
}`;

  return (
    <PageWrapper showFloatingButton={false}>
      <div className="relative overflow-hidden min-h-screen bg-[#0E0E10] text-gray-100 selection:bg-[#FF5B04] selection:text-white pt-6 pb-20">
        <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          {/* Header section */}
          <header className="text-center space-y-4 max-w-3xl mx-auto pt-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-300 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#00E5BE] animate-pulse" />
              <span>Interactive 3D Spring Tilt</span>
              <span className="text-gray-500">•</span>
              <span className="text-[#FF5B04]">Exposed Cavity Slot</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white font-jakarta">
              Tactile Pill <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400">Popped-Up Button</span>
            </h1>

            <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
              Skeuomorphic tactile pill button featuring mechanical spring tilt, recessed cavity slot reveal, and glowing radiant LED status beacon.
            </p>
          </header>

        {/* Live Interactive Studio / Sandbox */}
        <div className="bg-[#151518] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <StudioCanvas>
              <TactilePillButton
                label={label}
                dotColor={dotColor}
                variant={variant}
                size={size}
                tiltAngle={tiltAngle}
                stateMode={stateMode}
                onClick={() => setClickCount((c) => c + 1)}
              />

              <div className="flex items-center gap-2 text-xs font-mono text-gray-700 bg-black/10 px-3 py-1 rounded-full border border-black/10">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Interactions:</span>
                <span className="text-black font-semibold">{clickCount}</span>
              </div>
          </StudioCanvas>
        </div>

        {/* Customizer */}
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white/70 font-mono">Customizer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5 text-xs">
            <div className="space-y-1.5">
              <label className="font-mono text-gray-400 uppercase tracking-wider block">Button Label</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-gray-400 uppercase tracking-wider block">Beacon Color</label>
              <select
                value={dotColor}
                onChange={(e) => setDotColor(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
              >
                {COLOR_PRESETS.map((p) => (
                  <option key={p.value} value={p.value} className="bg-[#151518] text-white">
                    {p.name}
                  </option>
                ))}
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
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            ALL VARIANTS & THEMES PREVIEW CARD
           ───────────────────────────────────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-[#54EAD8] mb-1.5">
                <span>PRESETS &amp; VARIATIONS</span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">All Variants Preview</h2>
            </div>
            <p className="text-xs text-gray-400 font-mono">
              Hover &amp; click buttons to trigger -9.23° spring tilt &amp; slot depth cavity depression
            </p>
          </div>

          <div className="bg-[#151518]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Figma Master Default */}
              <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[220px] overflow-x-clip transition-all hover:border-white/15">
                <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                  <span className="text-white font-semibold">Figma Cyan Beacon</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-cyan-400">variant=&quot;default&quot;</span>
                </div>
                <div className="my-3">
                  <TactilePillButton
                    variant="default"
                    dotColor="#54EAD8"
                    label="Get Started"
                    size="md"
                  />
                </div>
                <span className="text-[11px] font-mono text-gray-500 text-center">1:1 Figma Master design with turquoise indicator dot</span>
              </div>

              {/* UI Pirate Magma */}
              <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[220px] overflow-x-clip transition-all hover:border-white/15">
                <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                  <span className="text-white font-semibold">UI Pirate Magma</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-orange-400">variant=&quot;orange&quot;</span>
                </div>
                <div className="my-3">
                  <TactilePillButton
                    variant="orange"
                    dotColor="#FF5B04"
                    label="Join Waitlist"
                    size="md"
                  />
                </div>
                <span className="text-[11px] font-mono text-gray-500 text-center">Signature magma orange pill cap with glowing amber beacon</span>
              </div>

              {/* Dark Obsidian */}
              <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[220px] overflow-x-clip transition-all hover:border-white/15">
                <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                  <span className="text-white font-semibold">Dark Obsidian</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-gray-300">variant=&quot;dark&quot;</span>
                </div>
                <div className="my-3">
                  <TactilePillButton
                    variant="dark"
                    dotColor="#A78BFA"
                    label="Explore Tech"
                    size="md"
                  />
                </div>
                <span className="text-[11px] font-mono text-gray-500 text-center">Stealth midnight pill with violet status indicator</span>
              </div>

              {/* Cyberpunk Matrix */}
              <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[220px] overflow-x-clip transition-all hover:border-white/15">
                <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                  <span className="text-white font-semibold">Cyberpunk Matrix</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-emerald-400">variant=&quot;cyberpunk&quot;</span>
                </div>
                <div className="my-3">
                  <TactilePillButton
                    variant="cyberpunk"
                    dotColor="#10B981"
                    label="Deploy Matrix"
                    size="md"
                  />
                </div>
                <span className="text-[11px] font-mono text-gray-500 text-center">Neon reactor green beacon with tactile recessed tray</span>
              </div>

              {/* Minimal Clean */}
              <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[220px] overflow-x-clip transition-all hover:border-white/15">
                <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                  <span className="text-white font-semibold">Minimal Clean</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-blue-400">variant=&quot;minimal&quot;</span>
                </div>
                <div className="my-3">
                  <TactilePillButton
                    variant="minimal"
                    dotColor="#3B82F6"
                    label="Learn More"
                    size="md"
                  />
                </div>
                <span className="text-[11px] font-mono text-gray-500 text-center">Crisp clean tactile pill with sapphire status beacon</span>
              </div>

              {/* Tilted State Preview */}
              <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[220px] overflow-x-clip transition-all hover:border-white/15">
                <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                  <span className="text-white font-semibold">Tilted State Preview</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-pink-400">stateMode=&quot;tilted&quot;</span>
                </div>
                <div className="my-3">
                  <TactilePillButton
                    variant="default"
                    dotColor="#EC4899"
                    label="Active Tilt"
                    stateMode="tilted"
                    size="md"
                  />
                </div>
                <span className="text-[11px] font-mono text-gray-500 text-center">Fixed mechanical spring tilt position (-9.23° angle)</span>
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
                  {activeCodeTab === "component" ? "TactilePillButton.tsx" : activeCodeTab === "usage" ? "Usage.tsx" : "Tokens.css"}
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
                    <td className="py-3 px-6 text-gray-400">&quot;Get Started&quot;</td>
                    <td className="py-3 px-6 font-sans text-gray-300">Text displayed on the button cap</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-orange-400 font-semibold">dotColor</td>
                    <td className="py-3 px-6 text-blue-300">string</td>
                    <td className="py-3 px-6 text-gray-400">&quot;#54EAD8&quot;</td>
                    <td className="py-3 px-6 font-sans text-gray-300">Hex color of the beacon LED indicator</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-orange-400 font-semibold">tiltAngle</td>
                    <td className="py-3 px-6 text-blue-300">number</td>
                    <td className="py-3 px-6 text-gray-400">-9.23</td>
                    <td className="py-3 px-6 font-sans text-gray-300">Hover tilt angle in degrees</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-orange-400 font-semibold">size</td>
                    <td className="py-3 px-6 text-blue-300">&quot;xs&quot; | &quot;sm&quot; | &quot;md&quot; | &quot;lg&quot; | &quot;xl&quot;</td>
                    <td className="py-3 px-6 text-gray-400">&quot;md&quot;</td>
                    <td className="py-3 px-6 font-sans text-gray-300">Scale multiplier</td>
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
        <GlobalCTA topic="3D tactile spring buttons or component libraries" />
      </div>
    </div>
  </PageWrapper>
  );
}
