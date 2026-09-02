"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  TactileNeumorphicSwitch,
  TactileSwitchTheme,
  TactileSwitchSize,
  TactileSwitchStateMode,
  SWITCH_THEMES,
} from "@/components/TactileNeumorphicSwitch";
import StudioCanvas from "@/components/StudioCanvas";
import PageWrapper from "@/components/PageWrapper";
import GlobalCTA from "@/components/GlobalCTA";

export default function TactileNeumorphicSwitchScreen() {
  const [theme, setTheme] = useState<TactileSwitchTheme>("figma-emerald");
  const [size, setSize] = useState<TactileSwitchSize>("md");
  const [stateMode, setStateMode] = useState<TactileSwitchStateMode>("interactive");
  const [showGrid, setShowGrid] = useState(true);
  const [clickCount, setClickCount] = useState(0);
  const [customActiveColor, setCustomActiveColor] = useState<string>("#10E599");
  const [useCustomColor, setUseCustomColor] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"component" | "usage" | "css" | "framer">("component");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
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

export interface TactileNeumorphicSwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  theme?: "figma-emerald" | "cyber-cyan" | "magma-orange" | "dark-obsidian" | "hyper-violet" | "amber-crt";
  size?: "sm" | "md" | "lg" | "xl";
  disabled?: boolean;
  label?: string;
  showGrid?: boolean;
}

export function TactileNeumorphicSwitch({
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  theme = "figma-emerald",
  size = "md",
  disabled = false,
  label,
  showGrid = true,
}: TactileNeumorphicSwitchProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isChecked = controlledChecked !== undefined ? controlledChecked : internalChecked;

  const handleToggle = () => {
    if (disabled) return;
    const next = !isChecked;
    if (controlledChecked === undefined) setInternalChecked(next);
    onChange?.(next);
  };

  return (
    <div
      role="switch"
      aria-checked={isChecked}
      tabIndex={disabled ? -1 : 0}
      onClick={handleToggle}
      className="relative w-[320px] h-[140px] rounded-[70px] bg-[#DFE3EB] shadow-[inset_5px_6px_12px_rgba(150,162,182,0.65),inset_-5px_-6px_12px_rgba(255,255,255,0.95)] flex items-center justify-center cursor-pointer select-none"
    >
      {/* Deep Carved Shadow Trench */}
      <div className="relative w-[276px] h-[84px] rounded-[42px] bg-gradient-to-b from-[#C2C9D6] via-[#D4DBE6] to-[#E7ECF3] shadow-[inset_0_8px_12px_rgba(60,72,92,0.45),inset_0_-2px_4px_rgba(255,255,255,0.85)] overflow-hidden flex items-center">
        {/* Emerald Illuminated Active Fill */}
        <motion.div
          animate={{
            width: isChecked ? "256px" : "0px",
            opacity: isChecked ? 1 : 0,
          }}
          transition={{ type: "spring", stiffness: 380, damping: 26 }}
          className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#02B86E] via-[#0AD483] to-[#2BF3A4] shadow-[inset_0_7px_10px_rgba(0,85,48,0.55),0_0_18px_rgba(16,229,153,0.35)]"
        />
      </div>

      {/* Dual-Dome Sculpted Thumb */}
      <motion.div
        animate={{ x: isChecked ? 70 : -70 }}
        transition={{ type: "spring", stiffness: 380, damping: 26 }}
        className="absolute z-20 w-[136px] h-[96px] rounded-[48px] bg-gradient-to-br from-white via-[#F5F7FA] to-[#DFE4EC] shadow-[0_16px_28px_-3px_rgba(35,48,70,0.32),0_8px_14px_-2px_rgba(35,48,70,0.22),inset_0_2px_3px_white,inset_0_-3px_4px_rgba(150,162,180,0.35)] flex items-center justify-between px-2"
      >
        <div className="w-[60px] h-[60px] rounded-full bg-[radial-gradient(circle_at_35%_32%,white_0%,rgba(255,255,255,0.75)_35%,rgba(185,195,212,0.7)_100%)] shadow-[inset_0_2px_3px_rgba(255,255,255,0.95),inset_0_-2px_3px_rgba(140,152,172,0.4)]" />
        <div className="w-[2px] h-[55%] rounded-full bg-gradient-to-b from-white via-slate-400 to-white opacity-35" />
        <div className="w-[60px] h-[60px] rounded-full bg-[radial-gradient(circle_at_35%_32%,white_0%,rgba(255,255,255,0.75)_35%,rgba(185,195,212,0.7)_100%)] shadow-[inset_0_2px_3px_rgba(255,255,255,0.95),inset_0_-2px_3px_rgba(140,152,172,0.4)]" />
      </motion.div>
    </div>
  );
}`;

  const usageCode = `import { TactileNeumorphicSwitch } from "@/components/TactileNeumorphicSwitch";

export default function Example() {
  return (
    <div className="p-12 flex items-center justify-center bg-[#E3E7EE]">
      <TactileNeumorphicSwitch
        theme="${theme}"
        size="${size}"
        defaultChecked={true}
        onChange={(checked) => console.log("Switch toggled:", checked)}
      />
    </div>
  );
}`;

  const cssTokensCode = `/* 1:1 Figma Neumorphic Switch Design Tokens (Node 1:7 & 1:8) */
:root {
  /* 1. Outer Recessed Bevel Cavity */
  --switch-outer-bg: linear-gradient(145deg, #DFE3EB 0%, #EAEEF5 100%);
  --switch-outer-shadow: inset 5px 6px 12px rgba(150, 162, 182, 0.65),
                         inset -5px -6px 12px rgba(255, 255, 255, 0.95);

  /* 2. Deep Trench Slot (Track) */
  --switch-track-off: linear-gradient(180deg, #C2C9D6 0%, #D4DBE6 40%, #E7ECF3 100%);
  --switch-track-shadow: inset 0 8px 12px rgba(60, 72, 92, 0.45),
                         inset 0 -2px 4px rgba(255, 255, 255, 0.85);

  /* 3. Illuminated Emerald Fill (ON state 1:8) */
  --switch-track-on: linear-gradient(90deg, #02B86E 0%, #0AD483 40%, #2BF3A4 85%, #56F8B6 100%);
  --switch-track-on-glow: inset 0 7px 10px rgba(0, 85, 48, 0.55),
                          0 0 18px rgba(16, 229, 153, 0.35);

  /* 4. Dual-Dome Sculpted Thumb */
  --switch-knob-bg: linear-gradient(145deg, #FFFFFF 0%, #F5F7FA 45%, #DFE4EC 100%);
  --switch-knob-shadow: 0 16px 28px -3px rgba(35, 48, 70, 0.32),
                        0 8px 14px -2px rgba(35, 48, 70, 0.22),
                        inset 0 2px 3px #FFFFFF,
                        inset 0 -3px 4px rgba(150, 162, 180, 0.35);
}`;

  const framerPhysicsCode = `// 60fps Spring Motion Physics
export const SWITCH_SPRING = {
  type: "spring",
  stiffness: 380,
  damping: 26,
  mass: 0.85,
};

<motion.div
  animate={{ x: isChecked ? 70 : -70 }}
  transition={SWITCH_SPRING}
/>`;

  return (
    <PageWrapper showFloatingButton={false}>
      <div className="relative overflow-hidden min-h-screen bg-[#0C0D12] text-white pt-6 pb-20 selection:bg-emerald-500/30 selection:text-emerald-200">
        <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          {/* Header Section */}
          <header className="text-center space-y-4 max-w-3xl mx-auto pt-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-300 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>1:1 Figma Master • Node 1:7 &amp; 1:8</span>
              <span className="text-gray-500">•</span>
              <span className="text-emerald-400">React + Tailwind + Framer Motion</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white font-jakarta">
              Tactile Neumorphic <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Dual-Dome Switch</span>
            </h1>
            <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
              Photorealistic skeuomorphic switch featuring an outer recessed bevel cavity, deep carved shadow trench, illuminated emerald photon channel, and dual-dome sculpted tactile thumb.
            </p>
          </header>

          {/* Interactive Studio Stage */}
          <div className="bg-[#12141A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <StudioCanvas minHeight="min-h-[420px]">
              <TactileNeumorphicSwitch
                theme={theme}
                size={size}
                stateMode={stateMode}
                showGrid={showGrid}
                customActiveColor={useCustomColor ? customActiveColor : undefined}
                onChange={() => setClickCount((c) => c + 1)}
              />

              <div className="flex items-center gap-2 text-xs font-mono text-gray-500 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Interactions:</span>
                <span className="text-white font-semibold">{clickCount}</span>
              </div>
            </StudioCanvas>
          </div>

          {/* Customizer */}
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white/70 font-mono">Customizer</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5 text-xs">
              {/* State Mode Selector */}
              <div className="space-y-1.5">
                <label className="font-mono text-gray-400 uppercase tracking-wider block">
                  State Mode
                </label>
                <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/5">
                  {(["interactive", "off", "on"] as TactileSwitchStateMode[]).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setStateMode(mode)}
                      className={`flex-1 py-1.5 rounded-lg font-mono text-[11px] uppercase transition-all cursor-pointer ${
                        stateMode === mode
                          ? "bg-emerald-500 text-black font-bold shadow"
                          : "text-white/50 hover:text-white"
                      }`}
                    >
                      {mode === "off" ? "OFF (1:7)" : mode === "on" ? "ON (1:8)" : "Live"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Theme Selector */}
              <div className="space-y-1.5">
                <label className="font-mono text-gray-400 uppercase tracking-wider block">
                  Theme &amp; Chassis Preset
                </label>
                <select
                  value={theme}
                  onChange={(e) => {
                    setTheme(e.target.value as TactileSwitchTheme);
                    setUseCustomColor(false);
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-mono cursor-pointer"
                >
                  {(Object.keys(SWITCH_THEMES) as TactileSwitchTheme[]).map((key) => (
                    <option key={key} value={key} className="bg-[#12141A] text-white">
                      {SWITCH_THEMES[key].name}
                    </option>
                  ))}
                </select>
              </div>

              {/* ON State Illumination Color Dropdown & Direct Picker */}
              <div className="space-y-1.5">
                <label className="font-mono text-gray-400 uppercase tracking-wider block">
                  ON State Accent Color
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={
                      !useCustomColor
                        ? "default"
                        : [
                            "#10E599",
                            "#00E5FF",
                            "#38BDF8",
                            "#3B82F6",
                            "#A855F7",
                            "#FF5B04",
                            "#F43F5E",
                            "#84CC16",
                            "#FBBF24",
                          ].includes(customActiveColor)
                        ? customActiveColor
                        : "custom"
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "default") {
                        setUseCustomColor(false);
                      } else if (val === "custom") {
                        setUseCustomColor(true);
                      } else {
                        setCustomActiveColor(val);
                        setUseCustomColor(true);
                      }
                    }}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-mono cursor-pointer text-xs"
                  >
                    <option value="default" className="bg-[#12141A] text-white">
                      Theme Default
                    </option>
                    <option value="#10E599" className="bg-[#12141A] text-white">
                      🟢 Emerald (#10E599)
                    </option>
                    <option value="#00E5FF" className="bg-[#12141A] text-white">
                      💎 Cyan (#00E5FF)
                    </option>
                    <option value="#38BDF8" className="bg-[#12141A] text-white">
                      💠 Sky (#38BDF8)
                    </option>
                    <option value="#3B82F6" className="bg-[#12141A] text-white">
                      🔷 Blue (#3B82F6)
                    </option>
                    <option value="#A855F7" className="bg-[#12141A] text-white">
                      🟣 Violet (#A855F7)
                    </option>
                    <option value="#FF5B04" className="bg-[#12141A] text-white">
                      🔥 Magma (#FF5B04)
                    </option>
                    <option value="#F43F5E" className="bg-[#12141A] text-white">
                      🌸 Rose (#F43F5E)
                    </option>
                    <option value="#84CC16" className="bg-[#12141A] text-white">
                      🍏 Lime (#84CC16)
                    </option>
                    <option value="#FBBF24" className="bg-[#12141A] text-white">
                      ⭐ Gold (#FBBF24)
                    </option>
                  </select>

                  {/* Direct Native Color Picker Input */}
                  <div
                    className="relative shrink-0 flex items-center justify-center w-9 h-9 rounded-xl border border-white/15 bg-white/5 overflow-hidden cursor-pointer hover:border-white/40 transition-colors"
                    title="Click to pick any custom HEX color"
                  >
                    <input
                      type="color"
                      value={useCustomColor ? customActiveColor : SWITCH_THEMES[theme]?.accent || "#10E599"}
                      onChange={(e) => {
                        setCustomActiveColor(e.target.value);
                        setUseCustomColor(true);
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <span
                      className="w-4 h-4 rounded-full shadow-sm border border-black/20"
                      style={{
                        backgroundColor: useCustomColor
                          ? customActiveColor
                          : SWITCH_THEMES[theme]?.accent || "#10E599",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Scale Size Selector */}
              <div className="space-y-1.5">
                <label className="font-mono text-gray-400 uppercase tracking-wider block">
                  Scale Size
                </label>
                <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/5">
                  {(["sm", "md", "lg", "xl"] as TactileSwitchSize[]).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      className={`flex-1 py-1.5 rounded-lg font-mono text-xs uppercase transition-all ${
                        size === s
                          ? "bg-emerald-500 text-black font-bold"
                          : "text-white/50 hover:text-white"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* If Custom Color Active: Show Details & Reset */}
            {useCustomColor && (
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-gray-400 uppercase tracking-wider">
                    Active Custom Color:
                  </span>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                    <span
                      className="w-3.5 h-3.5 rounded-full shadow"
                      style={{ backgroundColor: customActiveColor }}
                    />
                    <span className="font-mono text-xs text-white font-bold uppercase">
                      {customActiveColor}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setUseCustomColor(false)}
                  className="text-xs font-mono text-white/40 hover:text-white transition-colors cursor-pointer"
                >
                  Reset to Theme Preset
                </button>
              </div>
            )}
          </div>

          {/* ─────────────────────────────────────────────────────────────
              ALL VARIANTS & STATES PREVIEW CARD
             ───────────────────────────────────────────────────────────── */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-emerald-400 mb-1.5">
                  <span>FIGMA MASTER SPEC &amp; PRESETS</span>
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  All Variants &amp; States
                </h2>
              </div>
              <p className="text-xs text-gray-400 font-mono">
                Click or hover over switches to test spring physics &amp; photorealistic lighting
              </p>
            </div>

            <div className="bg-[#151518]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* 1. Figma OFF State (1:7) */}
                <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[260px] transition-all hover:border-white/15">
                  <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                    <span className="text-white font-semibold">Figma OFF (Node 1:7)</span>
                    <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-gray-300">
                      state=&quot;off&quot;
                    </span>
                  </div>
                  <div className="my-2">
                    <TactileNeumorphicSwitch
                      theme="figma-emerald"
                      stateMode="off"
                      size="sm"
                    />
                  </div>
                  <span className="text-[11px] font-mono text-gray-500 text-center">
                    Resting neutral clay trench with dual-dome sculpted knob
                  </span>
                </div>

                {/* 2. Figma ON State (1:8) */}
                <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[260px] transition-all hover:border-white/15">
                  <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                    <span className="text-white font-semibold">Figma ON (Node 1:8)</span>
                    <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-emerald-400">
                      state=&quot;on&quot;
                    </span>
                  </div>
                  <div className="my-2">
                    <TactileNeumorphicSwitch
                      theme="figma-emerald"
                      stateMode="on"
                      size="sm"
                    />
                  </div>
                  <span className="text-[11px] font-mono text-gray-500 text-center">
                    Glowing emerald photon illumination channel with right dock
                  </span>
                </div>

                {/* 3. Interactive Live Switch */}
                <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[260px] transition-all hover:border-white/15">
                  <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                    <span className="text-white font-semibold">Interactive Spring</span>
                    <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-emerald-400">
                      mode=&quot;live&quot;
                    </span>
                  </div>
                  <div className="my-2">
                    <TactileNeumorphicSwitch
                      theme="figma-emerald"
                      stateMode="interactive"
                      size="sm"
                    />
                  </div>
                  <span className="text-[11px] font-mono text-gray-500 text-center">
                    Interactive 60fps spring toggle with dynamic channel fill
                  </span>
                </div>

                {/* 4. Cyber Laser Cyan */}
                <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[260px] transition-all hover:border-white/15">
                  <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                    <span className="text-white font-semibold">Cyber Laser Cyan</span>
                    <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-cyan-400">
                      theme=&quot;cyber-cyan&quot;
                    </span>
                  </div>
                  <div className="my-2">
                    <TactileNeumorphicSwitch
                      theme="cyber-cyan"
                      stateMode="interactive"
                      size="sm"
                    />
                  </div>
                  <span className="text-[11px] font-mono text-gray-500 text-center">
                    High-voltage laser cyan glowing optical underlayer
                  </span>
                </div>

                {/* 5. UI Pirate Magma */}
                <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[260px] transition-all hover:border-white/15">
                  <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                    <span className="text-white font-semibold">UI Pirate Magma</span>
                    <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-orange-400">
                      theme=&quot;magma-orange&quot;
                    </span>
                  </div>
                  <div className="my-2">
                    <TactileNeumorphicSwitch
                      theme="magma-orange"
                      stateMode="interactive"
                      size="sm"
                    />
                  </div>
                  <span className="text-[11px] font-mono text-gray-500 text-center">
                    Signature magma orange molten photon illumination
                  </span>
                </div>

                {/* 6. Dark Obsidian Stealth */}
                <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[260px] transition-all hover:border-white/15">
                  <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                    <span className="text-white font-semibold">Dark Obsidian Stealth</span>
                    <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-sky-400">
                      theme=&quot;dark-obsidian&quot;
                    </span>
                  </div>
                  <div className="my-2">
                    <TactileNeumorphicSwitch
                      theme="dark-obsidian"
                      stateMode="interactive"
                      size="sm"
                    />
                  </div>
                  <span className="text-[11px] font-mono text-gray-500 text-center">
                    Midnight dark clay chassis with glowing sapphire channel
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              INSTALLATION & SETUP
             ───────────────────────────────────────────────────────────── */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">Installation &amp; Setup</h2>
            <div className="bg-[#151518] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
              <p className="text-sm text-gray-300 leading-relaxed">
                Install the required dependencies for Framer Motion spring animations and utility classes:
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
                    activeTab === "component"
                      ? componentSourceCode
                      : activeTab === "usage"
                      ? usageCode
                      : activeTab === "css"
                      ? cssTokensCode
                      : framerPhysicsCode,
                    activeTab
                  )
                }
                className="text-xs font-mono text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                {copiedCode === activeTab ? "✓ Copied to Clipboard" : "Copy Active Tab Code"}
              </button>
            </div>

            <div className="bg-[#151518] border border-white/10 rounded-3xl overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-white/10 bg-white/[0.02]">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white font-mono">
                    {activeTab === "component"
                      ? "TactileNeumorphicSwitch.tsx"
                      : activeTab === "usage"
                      ? "Usage.tsx"
                      : activeTab === "css"
                      ? "Tokens.css"
                      : "Physics.ts"}
                  </span>
                  <span className="text-xs text-gray-500 font-mono">• Production Ready</span>
                </div>

                <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/5 text-xs">
                  <button
                    onClick={() => setActiveTab("component")}
                    className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                      activeTab === "component"
                        ? "bg-emerald-500 text-black font-bold"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Component.tsx
                  </button>
                  <button
                    onClick={() => setActiveTab("usage")}
                    className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                      activeTab === "usage"
                        ? "bg-emerald-500 text-black font-bold"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Usage.tsx
                  </button>
                  <button
                    onClick={() => setActiveTab("css")}
                    className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                      activeTab === "css"
                        ? "bg-emerald-500 text-black font-bold"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Tokens.css
                  </button>
                  <button
                    onClick={() => setActiveTab("framer")}
                    className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                      activeTab === "framer"
                        ? "bg-emerald-500 text-black font-bold"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Physics.ts
                  </button>
                </div>
              </div>

              <div className="p-6 bg-[#0B0B0D] overflow-x-auto max-h-[550px]">
                <pre className="text-xs sm:text-sm font-mono text-gray-300 leading-relaxed">
                  <code>
                    {activeTab === "component"
                      ? componentSourceCode
                      : activeTab === "usage"
                      ? usageCode
                      : activeTab === "css"
                      ? cssTokensCode
                      : framerPhysicsCode}
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
                      <td className="py-3 px-6 text-emerald-400 font-semibold">checked</td>
                      <td className="py-3 px-6 text-blue-300">boolean</td>
                      <td className="py-3 px-6 text-gray-400">undefined</td>
                      <td className="py-3 px-6 font-sans text-gray-300">
                        Controlled boolean state of the switch (true = ON, false = OFF)
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-6 text-emerald-400 font-semibold">defaultChecked</td>
                      <td className="py-3 px-6 text-blue-300">boolean</td>
                      <td className="py-3 px-6 text-gray-400">false</td>
                      <td className="py-3 px-6 font-sans text-gray-300">
                        Initial boolean state when uncontrolled
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-6 text-emerald-400 font-semibold">stateMode</td>
                      <td className="py-3 px-6 text-blue-300">&quot;interactive&quot; | &quot;off&quot; | &quot;on&quot;</td>
                      <td className="py-3 px-6 text-gray-400">&quot;interactive&quot;</td>
                      <td className="py-3 px-6 font-sans text-gray-300">
                        Force static Figma 1:7 (OFF) or 1:8 (ON) state, or interactive toggle
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-6 text-emerald-400 font-semibold">theme</td>
                      <td className="py-3 px-6 text-blue-300">TactileSwitchTheme</td>
                      <td className="py-3 px-6 text-gray-400">&quot;figma-emerald&quot;</td>
                      <td className="py-3 px-6 font-sans text-gray-300">
                        Color scheme for illuminated channel and shadow aesthetics
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-6 text-emerald-400 font-semibold">size</td>
                      <td className="py-3 px-6 text-blue-300">&quot;sm&quot; | &quot;md&quot; | &quot;lg&quot; | &quot;xl&quot;</td>
                      <td className="py-3 px-6 text-gray-400">&quot;md&quot;</td>
                      <td className="py-3 px-6 font-sans text-gray-300">
                        Proportional scaling dimension preset
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-6 text-emerald-400 font-semibold">onChange</td>
                      <td className="py-3 px-6 text-blue-300">(checked: boolean) =&gt; void</td>
                      <td className="py-3 px-6 text-gray-400">undefined</td>
                      <td className="py-3 px-6 font-sans text-gray-300">
                        Callback fired whenever the switch is toggled
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-6 text-emerald-400 font-semibold">showGrid</td>
                      <td className="py-3 px-6 text-blue-300">boolean</td>
                      <td className="py-3 px-6 text-gray-400">true</td>
                      <td className="py-3 px-6 font-sans text-gray-300">
                        Renders the fine mesh canvas grid behind the switch
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Website Global CTA */}
          <GlobalCTA topic="skeuomorphic switches, neumorphic UI, or custom React toggles" />
        </div>
      </div>
    </PageWrapper>
  );
}
