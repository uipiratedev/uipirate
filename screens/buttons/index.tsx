"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TactilePillButton, {
  TactileButtonVariant,
  TactileButtonState,
} from "@/components/TactilePillButton";

const COLOR_PRESETS = [
  { label: "Figma Aqua", value: "#54EAD8", name: "Aqua" },
  { label: "Brand Orange", value: "#FF5B04", name: "Orange" },
  { label: "Emerald Green", value: "#10B981", name: "Emerald" },
  { label: "Electric Violet", value: "#8B5CF6", name: "Violet" },
  { label: "Amber Glow", value: "#F59E0B", name: "Amber" },
  { label: "Neon Pink", value: "#F43F5E", name: "Pink" },
];

const THEME_VARIANTS: { id: TactileButtonVariant; label: string; desc: string }[] = [
  { id: "default", label: "Figma Light", desc: "Original light grey neumorphic porcelain" },
  { id: "dark", label: "Obsidian Dark", desc: "Sleek dark ceramic with deep shadow" },
  { id: "orange", label: "Brand Orange", desc: "High conversion UI Pirate signature" },
  { id: "cyberpunk", label: "Cyberpunk", desc: "Neon glow with deep blue cavity" },
  { id: "minimal", label: "Clean White", desc: "Subtle minimalist modern look" },
];

export default function ButtonShowcaseScreen() {
  // Sandbox State
  const [label, setLabel] = useState("Get Started");
  const [dotColor, setDotColor] = useState("#54EAD8");
  const [stateMode, setStateMode] = useState<TactileButtonState>("interactive");
  const [variant, setVariant] = useState<TactileButtonVariant>("default");
  const [size, setSize] = useState<"sm" | "md" | "lg">("md");
  const [tiltAngle, setTiltAngle] = useState(-9.23);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<"usage" | "component" | "css">("usage");
  const [clickCount, setClickCount] = useState(0);

  const handleCopy = (text: string, tabName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(tabName);
    setTimeout(() => setCopiedCode(null), 2500);
  };

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

  const cssOnlyCode = `/* Figma Exact CSS Shadows & Insets */
.tactile-slot {
  width: 176px;
  height: 45px;
  border-radius: 15px;
  background: #D0D0D0;
  box-shadow: 
    inset 0px 2px 4px 0px rgba(0, 0, 0, 0.18),
    0px 1px 1px 0px rgba(255, 255, 255, 0.8);
}

.tactile-button-cap {
  background: #F2F2F2;
  border-radius: 15px;
  padding: 6px 22px 13px 16px;
  box-shadow:
    inset 0.5px 1.5px 1px 0px #FFFFFF,
    inset 0px -1px 1px 0px rgba(0, 0, 0, 0.15),
    inset -2px -6px 1px 0px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
              filter 0.3s ease;
  filter: drop-shadow(2px 2px 3.5px rgba(0,0,0,0.1))
          drop-shadow(9px 10px 6.5px rgba(0,0,0,0.09));
}

.tactile-button-cap:hover {
  transform: translate(-3px, -12px) rotate(-9.23deg);
  filter: drop-shadow(7px 6px 10.5px rgba(0,0,0,0.12))
          drop-shadow(28px 26px 19px rgba(0,0,0,0.09))
          drop-shadow(62px 58px 25.5px rgba(0,0,0,0.06));
}

.tactile-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #00E5BE;
  box-shadow: 0 0 10px 1px #00E5BE, inset 0px 1px 1px #FFFFFF;
}`;

  return (
    <div className="min-h-screen bg-[#0E0E10] text-gray-100 selection:bg-[#FF5B04] selection:text-white pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#FF5B04]/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-[#00E5BE]/10 rounded-full blur-[120px]" />
        <div className="absolute top-2/3 right-1/4 w-[500px] h-[400px] bg-purple-600/10 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-16">
        {/* Header section */}
        <div className="text-center space-y-5 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-300 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#00E5BE] animate-pulse" />
            <span>Figma Dev Mode Master Collection</span>
            <span className="text-gray-500">•</span>
            <span className="text-[#FF5B04]">Nodes 75:1201 & 75:1206</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-jakarta">
            Tactile <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400">3D Pill Button</span>
          </h1>

          <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
            High-fidelity implementation of the recessed slot & spring-tilt button from Figma.
            Engineered with realistic 3D bevel lighting, multi-layered depth shadows, and smooth spring physics.
          </p>

          {/* Figma Reference Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="https://www.figma.com/design/MiGFMZakEXgpziqxTcVT6Y/Master-Button-collection--Community-?node-id=75-1201&m=dev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-300 transition-colors"
            >
              <svg className="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 2a4 4 0 0 0-4 4 4 4 0 0 0 4 4h4V2H8zm8 0h-4v8h4a4 4 0 0 0 0-8zM8 10a4 4 0 0 0-4 4 4 4 0 0 0 4 4h4v-8H8zm8 0h-4v8h4a4 4 0 0 0 0-8zm-8 8a4 4 0 0 0-4 4 4 4 0 0 0 4 4 4 4 0 0 0 4-4v-4H8z" />
              </svg>
              <span>Figma Node 75:1201 (Resting)</span>
              <span className="text-gray-500">↗</span>
            </a>
            <a
              href="https://www.figma.com/design/MiGFMZakEXgpziqxTcVT6Y/Master-Button-collection--Community-?node-id=75-1206&m=dev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-300 transition-colors"
            >
              <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 2a4 4 0 0 0-4 4 4 4 0 0 0 4 4h4V2H8zm8 0h-4v8h4a4 4 0 0 0 0-8zM8 10a4 4 0 0 0-4 4 4 4 0 0 0 4 4h4v-8H8zm8 0h-4v8h4a4 4 0 0 0 0-8zm-8 8a4 4 0 0 0-4 4 4 4 0 0 0 4 4 4 4 0 0 0 4-4v-4H8z" />
              </svg>
              <span>Figma Node 75:1206 (Tilted)</span>
              <span className="text-gray-500">↗</span>
            </a>
          </div>
        </div>

        {/* Live Interactive Studio / Sandbox */}
        <div className="bg-[#151518]/90 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          {/* Studio Canvas Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
              </div>
              <span className="text-sm font-semibold text-gray-300 font-mono">
                Interactive Playground
              </span>
            </div>

            {/* State Mode Toggles */}
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5 text-xs">
              {(
                [
                  { id: "interactive", label: "Interactive (Hover)" },
                  { id: "resting", label: "Resting (75:1201)" },
                  { id: "tilted", label: "Tilted (75:1206)" },
                ] as const
              ).map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setStateMode(mode.id)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    stateMode === mode.id
                      ? "bg-[#FF5B04] text-white font-medium shadow-md"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Stage (Matching Figma Canvas Tone #EEEEEE or Dark) */}
          <div
            className={`relative min-h-[360px] flex flex-col items-center justify-center p-8 transition-colors duration-500 ${
              variant === "default" || variant === "minimal"
                ? "bg-[#EEEEEE]"
                : variant === "dark"
                ? "bg-[#121214]"
                : variant === "cyberpunk"
                ? "bg-[#060911]"
                : "bg-[#1E0D05]"
            }`}
          >
            {/* The Live Button */}
            <div className="relative z-10 scale-110 sm:scale-125 transition-transform">
              <TactilePillButton
                label={label}
                dotColor={dotColor}
                stateMode={stateMode}
                variant={variant}
                size={size}
                tiltAngle={tiltAngle}
                onClick={() => setClickCount((prev) => prev + 1)}
              />
            </div>

            {/* Hint & Click counter */}
            <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
              <p
                className={`text-xs font-mono transition-colors ${
                  variant === "default" || variant === "minimal"
                    ? "text-gray-600"
                    : "text-gray-400"
                }`}
              >
                {stateMode === "interactive"
                  ? "Hover to trigger spring lift & tilt • Click for tactile press"
                  : `Forced State: ${stateMode.toUpperCase()}`}
                {clickCount > 0 && ` • Clicked ${clickCount} time${clickCount > 1 ? "s" : ""}`}
              </p>
            </div>
          </div>

          {/* Studio Controls Drawer */}
          <div className="p-6 sm:p-8 bg-[#121215] border-t border-white/10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Control 1: Label */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Button Label
              </label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF5B04] transition-colors"
                placeholder="Button text..."
              />
            </div>

            {/* Control 2: Dot Color */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                <span>Indicator Dot</span>
                <span className="font-mono text-gray-500">{dotColor}</span>
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {COLOR_PRESETS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setDotColor(color.value)}
                    title={color.label}
                    className={`w-7 h-7 rounded-full transition-transform ${
                      dotColor === color.value
                        ? "scale-125 ring-2 ring-white ring-offset-2 ring-offset-[#121215]"
                        : "hover:scale-110 opacity-70 hover:opacity-100"
                    }`}
                    style={{ backgroundColor: color.value }}
                  />
                ))}
              </div>
            </div>

            {/* Control 3: Theme Variant */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Theme Variant
              </label>
              <select
                value={variant}
                onChange={(e) => setVariant(e.target.value as TactileButtonVariant)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF5B04] transition-colors"
              >
                {THEME_VARIANTS.map((v) => (
                  <option key={v.id} value={v.id} className="bg-[#18181B] text-white">
                    {v.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Control 4: Size & Tilt */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Size
                </label>
                <div className="flex gap-1 bg-black/40 p-0.5 rounded-lg border border-white/5 text-xs">
                  {(["sm", "md", "lg"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`px-2.5 py-1 rounded-md uppercase font-mono ${
                        size === s
                          ? "bg-[#FF5B04] text-white font-bold"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Tilt Angle</span>
                  <span className="font-mono text-[#00E5BE]">{tiltAngle}°</span>
                </div>
                <input
                  type="range"
                  min="-20"
                  max="0"
                  step="0.1"
                  value={tiltAngle}
                  onChange={(e) => setTiltAngle(parseFloat(e.target.value))}
                  className="w-full accent-[#FF5B04] cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Side-by-Side Figma Direct Comparison Section */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-jakarta">
              Side-by-Side Figma State Breakdown
            </h2>
            <p className="text-gray-400 text-sm max-w-2xl mx-auto">
              Direct pixel-level breakdown of Node 75:1201 (resting in the slot) versus Node 75:1206 (lifted and rotated).
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Card 1: Node 75:1201 */}
            <div className="bg-[#151518] border border-white/10 rounded-2xl overflow-hidden flex flex-col">
              <div className="p-4 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-xs font-mono">
                    Node 75:1201
                  </span>
                  <span className="text-sm font-semibold text-white">Default / Resting State</span>
                </div>
                <span className="text-xs text-gray-400 font-mono">rotate(0deg)</span>
              </div>

              {/* Stage */}
              <div className="bg-[#EEEEEE] h-[240px] flex items-center justify-center relative p-6">
                <TactilePillButton
                  label="Get Started"
                  dotColor="#00E5BE"
                  stateMode="resting"
                  variant="default"
                  size="md"
                />
              </div>

              {/* Specs */}
              <div className="p-5 space-y-3 bg-[#111113] flex-1 text-xs text-gray-300">
                <div className="font-semibold text-white uppercase tracking-wider text-[11px] text-gray-400">
                  Design Specifications:
                </div>
                <ul className="space-y-2 text-gray-400 font-mono">
                  <li className="flex items-start gap-2">
                    <span className="text-[#00E5BE]">•</span>
                    <span><strong className="text-gray-200">Cavity Slot:</strong> 176×45px, #D0D0D0, inset 0px 2px 4px rgba(0,0,0,0.18)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00E5BE]">•</span>
                    <span><strong className="text-gray-200">Button Cap:</strong> Nestled directly inside slot at (0, 0)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00E5BE]">•</span>
                    <span><strong className="text-gray-200">Shadow:</strong> Soft grounding shadow (0 2px 3.5px rgba(0,0,0,0.1))</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00E5BE]">•</span>
                    <span><strong className="text-gray-200">Indicator:</strong> 12px turquoise #00E5BE dot with subtle bevel</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Card 2: Node 75:1206 */}
            <div className="bg-[#151518] border border-white/10 rounded-2xl overflow-hidden flex flex-col">
              <div className="p-4 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-mono">
                    Node 75:1206
                  </span>
                  <span className="text-sm font-semibold text-white">Popped-Up / Tilted State</span>
                </div>
                <span className="text-xs text-[#00E5BE] font-mono">rotate(-9.23deg)</span>
              </div>

              {/* Stage */}
              <div className="bg-[#EEEEEE] h-[240px] flex items-center justify-center relative p-6">
                <TactilePillButton
                  label="Get Started"
                  dotColor="#00E5BE"
                  stateMode="tilted"
                  variant="default"
                  size="md"
                  tiltAngle={-9.23}
                />
              </div>

              {/* Specs */}
              <div className="p-5 space-y-3 bg-[#111113] flex-1 text-xs text-gray-300">
                <div className="font-semibold text-white uppercase tracking-wider text-[11px] text-gray-400">
                  Design Specifications:
                </div>
                <ul className="space-y-2 text-gray-400 font-mono">
                  <li className="flex items-start gap-2">
                    <span className="text-[#00E5BE]">•</span>
                    <span><strong className="text-gray-200">Elevation:</strong> Y: -12px, X: -3px with -9.23° rotation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00E5BE]">•</span>
                    <span><strong className="text-gray-200">Exposed Cavity:</strong> Recessed slot visible underneath on the right</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00E5BE]">•</span>
                    <span><strong className="text-gray-200">Shadow Stack:</strong> Multi-tier elevation (7px, 28px, 62px, 111px blur)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00E5BE]">•</span>
                    <span><strong className="text-gray-200">Indicator Glow:</strong> Radiant cyan aura (0 0 10px #00E5BE blur)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery / Presets Grid */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-jakarta">
              Colorways & Real-World SaaS Use Cases
            </h2>
            <p className="text-gray-400 text-sm max-w-2xl mx-auto">
              Hover over each button below to see how different themes adapt to SaaS landing pages and dark dashboards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Primary Conversion CTA",
                label: "Get Started",
                dot: "#00E5BE",
                variant: "default" as const,
                desc: "Original Figma aesthetic for landing heroes",
              },
              {
                title: "UI Pirate Brand Edition",
                label: "Launch Project",
                dot: "#FFFFFF",
                variant: "orange" as const,
                desc: "High-contrast energetic signature orange",
              },
              {
                title: "Dark Obsidian Studio",
                label: "Connect Wallet",
                dot: "#10B981",
                variant: "dark" as const,
                desc: "Matte ceramic surface for dark mode dashboards",
              },
              {
                title: "Cyberpunk AI Agent",
                label: "Deploy Agent",
                dot: "#00E5BE",
                variant: "cyberpunk" as const,
                desc: "Neon cyan glow with futuristic deep tone",
              },
              {
                title: "Minimalist SaaS App",
                label: "Start Free Trial",
                dot: "#8B5CF6",
                variant: "minimal" as const,
                desc: "Pristine white porcelain with purple status",
              },
              {
                title: "Live Audio / Voice Room",
                label: "Join Room",
                dot: "#F43F5E",
                variant: "dark" as const,
                desc: "Pulsing live beacon for real-time rooms",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-[#151518] border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-between gap-6 hover:border-white/20 transition-colors"
              >
                <div className="w-full text-left">
                  <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                </div>

                <div className="py-4">
                  <TactilePillButton
                    label={item.label}
                    dotColor={item.dot}
                    variant={item.variant}
                    size="md"
                  />
                </div>

                <div className="w-full flex items-center justify-between text-[11px] text-gray-500 font-mono border-t border-white/5 pt-3">
                  <span>theme: {item.variant}</span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.dot }} />
                    {item.dot}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Code Exporter Section */}
        <div className="bg-[#151518] border border-white/10 rounded-3xl overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white font-mono">Code Export</span>
              <span className="text-xs text-gray-500 font-mono">• Ready for Next.js & Tailwind</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/5 text-xs">
                <button
                  onClick={() => setActiveCodeTab("usage")}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    activeCodeTab === "usage"
                      ? "bg-[#FF5B04] text-white font-medium"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Usage Example
                </button>
                <button
                  onClick={() => setActiveCodeTab("css")}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    activeCodeTab === "css"
                      ? "bg-[#FF5B04] text-white font-medium"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Pure CSS / Shadow Specs
                </button>
              </div>

              <button
                onClick={() =>
                  handleCopy(
                    activeCodeTab === "usage" ? usageCode : cssOnlyCode,
                    activeCodeTab
                  )
                }
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
              >
                {copiedCode === activeCodeTab ? (
                  <>
                    <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="p-6 bg-[#0B0B0D] overflow-x-auto">
            <pre className="text-xs sm:text-sm font-mono text-gray-300 leading-relaxed">
              <code>{activeCodeTab === "usage" ? usageCode : cssOnlyCode}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
