"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ScalingCapsuleButton, {
  ScalingCapsuleVariant,
  ScalingCapsuleStateMode,
} from "@/components/ScalingCapsuleButton";
import StudioCanvas from "@/components/StudioCanvas";
import PageWrapper from "@/components/PageWrapper";
import GlobalCTA from "@/components/GlobalCTA";

export default function ScalingCapsuleButtonScreen() {
  const [label, setLabel] = useState("Scaling Workshop");
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [variant, setVariant] = useState<ScalingCapsuleVariant>("dark");

  const textColorOptions = [
    { label: "Pure White", value: "#FFFFFF" },
    { label: "Cyan Ice", value: "#E0F2FE" },
    { label: "Magma Orange", value: "#FF5B04" },
    { label: "Electric Aqua", value: "#00E5BE" },
    { label: "Neon Pink", value: "#F472B6" },
    { label: "Dark Charcoal", value: "#1E293B" },
  ];
  const [size, setSize] = useState<"xs" | "sm" | "md" | "lg" | "xl">("md");
  const [stateMode, setStateMode] = useState<ScalingCapsuleStateMode>("interactive");
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
    navigator.clipboard.writeText("npm install framer-motion clsx tailwind-merge");
    setCopiedInstall(true);
    setTimeout(() => setCopiedInstall(false), 2000);
  };

  const componentSourceCode = `"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export type ScalingCapsuleVariant = "dark" | "orange" | "light" | "cyberpunk";

export interface ScalingCapsuleButtonProps {
  label?: string;
  textColor?: string;
  variant?: ScalingCapsuleVariant;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export const ApexEmblemIcon: React.FC<{ className?: string }> = ({
  className = "w-[16px] h-[16px]",
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M12 2.2L6.2 13.5H17.8L12 2.2ZM12 6.8L14.4 11.5H9.6L12 6.8Z" />
    <polygon points="6.2,13.5 3,21.5 6.8,21.5 8.2,18 7.2,15.5 8.5,13.5" />
    <polygon points="17.8,13.5 21,21.5 17.2,21.5 15.8,18 16.8,15.5 15.5,13.5" />
    <rect x="7.4" y="14.2" width="9.2" height="1.1" rx="0.3" />
    <rect x="6.8" y="16.0" width="10.4" height="1.1" rx="0.3" />
    <rect x="6.0" y="17.8" width="12.0" height="1.1" rx="0.3" />
    <rect x="5.2" y="19.6" width="13.6" height="1.1" rx="0.3" />
  </svg>
);

export const ScalingCapsuleButton: React.FC<ScalingCapsuleButtonProps> = ({
  label = "Scaling Workshop",
  textColor,
  variant = "dark",
  size = "md",
  icon,
  onClick,
  className = "",
  disabled = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const sizeConfig = {
    sm: {
      outerPadding: "p-[5px]",
      outerRadius: "rounded-[40px]",
      innerRadius: "rounded-[20px]",
      innerPadding: "pl-[22px] pr-[1px] pt-[1px] pb-[2px]",
      fontSize: "text-[13px]",
      outerCircleSize: "w-[38px] h-[38px]",
      innerCircleSize: "w-[22px] h-[22px]",
      iconSize: "w-[14px] h-[14px]",
      gap: "gap-[12px]",
      liftY: -3,
    },
    md: {
      outerPadding: "p-[6px]",
      outerRadius: "rounded-[50px]",
      innerRadius: "rounded-[24px]",
      innerPadding: "pl-[30px] pr-[1px] pt-[1px] pb-[3px]",
      fontSize: "text-[15px]",
      outerCircleSize: "w-[45px] h-[45px]",
      innerCircleSize: "w-[26px] h-[26px]",
      iconSize: "w-[16px] h-[16px]",
      gap: "gap-[15px]",
      liftY: -4,
    },
    lg: {
      outerPadding: "p-[8px]",
      outerRadius: "rounded-[60px]",
      innerRadius: "rounded-[28px]",
      innerPadding: "pl-[36px] pr-[2px] pt-[2px] pb-[4px]",
      fontSize: "text-[18px]",
      outerCircleSize: "w-[54px] h-[54px]",
      innerCircleSize: "w-[32px] h-[32px]",
      iconSize: "w-[20px] h-[20px]",
      gap: "gap-[18px]",
      liftY: -5,
    },
  }[size];

  const themeStyles = {
    dark: {
      outerBg: "bg-[rgba(209,213,236,0.14)]",
      outerShadow: "shadow-[0px_1.5px_0px_0px_white,inset_0px_0px_2px_0px_rgba(0,0,0,0.4)]",
      capBg: "bg-[#343434]",
      textColor: "text-[#F8F8F8]",
      textShadow: "0px 1px 1px rgba(0,0,0,0.5)",
      outerCircleBg: "bg-gradient-to-b from-[#1b1b1b] to-[#343434]",
      innerCircleBg: "bg-black",
      capBevel:
        "shadow-[inset_0px_2px_0px_0px_rgba(255,255,255,0.25),inset_0px_-5px_0px_0px_rgba(160,160,160,0.2),inset_0px_1px_0px_0px_rgba(255,255,255,0.8),inset_0px_-4px_0px_0px_black]",
      restingShadow:
        "drop-shadow(0px 3px 3px rgba(0,0,0,0.14)) drop-shadow(0px 6.65px 5.32px rgba(0,0,0,0.13)) drop-shadow(0px 12.5px 10px rgba(0,0,0,0.14)) drop-shadow(0px 22.3px 17.9px rgba(0,0,0,0.14)) drop-shadow(0px 41.8px 33.4px rgba(0,0,0,0.15)) drop-shadow(0px 100px 80px rgba(0,0,0,0.15))",
      hoverShadow:
        "drop-shadow(0px 4px 6px rgba(0,0,0,0.2)) drop-shadow(0px 14px 18px rgba(0,0,0,0.22)) drop-shadow(0px 36px 32px rgba(0,0,0,0.25))",
      iconColor: "text-white",
    },
    orange: {
      outerBg: "bg-[rgba(255,91,4,0.15)]",
      outerShadow: "shadow-[0px_1.5px_0px_0px_rgba(255,255,255,0.7),inset_0px_0px_3px_0px_rgba(255,91,4,0.4)]",
      capBg: "bg-[#FF5B04]",
      textColor: "text-white",
      textShadow: "0px 1px 2px rgba(0,0,0,0.4)",
      outerCircleBg: "bg-gradient-to-b from-[#CC4400] to-[#FF5B04]",
      innerCircleBg: "bg-[#B33B00]",
      capBevel:
        "shadow-[inset_0px_2px_0px_0px_rgba(255,255,255,0.45),inset_0px_-5px_0px_0px_rgba(180,45,0,0.4),inset_0px_1px_0px_0px_rgba(255,255,255,0.9),inset_0px_-4px_0px_0px_rgba(120,30,0,0.8)]",
      restingShadow:
        "drop-shadow(0px 4px 6px rgba(255,91,4,0.25)) drop-shadow(0px 14px 18px rgba(255,91,4,0.2))",
      hoverShadow:
        "drop-shadow(0px 6px 12px rgba(255,91,4,0.35)) drop-shadow(0px 22px 28px rgba(255,91,4,0.3))",
      iconColor: "text-white",
    },
    light: {
      outerBg: "bg-[rgba(0,0,0,0.06)]",
      outerShadow: "shadow-[0px_1.5px_0px_0px_white,inset_0px_0px_2px_0px_rgba(0,0,0,0.15)]",
      capBg: "bg-[#FAFAFA]",
      textColor: "text-gray-900",
      textShadow: "0px 1px 0px rgba(255,255,255,0.8)",
      outerCircleBg: "bg-gradient-to-b from-[#E2E2E2] to-[#FAFAFA]",
      innerCircleBg: "bg-[#222222]",
      capBevel:
        "shadow-[inset_0px_2px_0px_0px_rgba(255,255,255,0.9),inset_0px_-4px_0px_0px_rgba(0,0,0,0.1),inset_0px_1px_0px_0px_white,inset_0px_-2px_0px_0px_rgba(0,0,0,0.15)]",
      restingShadow:
        "drop-shadow(0px 3px 4px rgba(0,0,0,0.08)) drop-shadow(0px 10px 12px rgba(0,0,0,0.06))",
      hoverShadow:
        "drop-shadow(0px 6px 10px rgba(0,0,0,0.12)) drop-shadow(0px 18px 20px rgba(0,0,0,0.09))",
      iconColor: "text-white",
    },
    cyberpunk: {
      outerBg: "bg-[rgba(0,229,190,0.12)]",
      outerShadow: "shadow-[0px_1.5px_0px_0px_rgba(0,229,190,0.5),inset_0px_0px_4px_0px_rgba(0,229,190,0.35)]",
      capBg: "bg-[#111827]",
      textColor: "text-[#E0F2FE]",
      textShadow: "0px 0px 8px rgba(0,229,190,0.5)",
      outerCircleBg: "bg-gradient-to-b from-[#090E1A] to-[#111827]",
      innerCircleBg: "bg-black",
      capBevel:
        "shadow-[inset_0px_2px_0px_0px_rgba(0,229,190,0.4),inset_0px_-5px_0px_0px_rgba(0,0,0,0.6),inset_0px_1px_0px_0px_rgba(0,229,190,0.8),inset_0px_-4px_0px_0px_black]",
      restingShadow:
        "drop-shadow(0px 4px 6px rgba(0,0,0,0.4)) drop-shadow(0px 10px 16px rgba(0,229,190,0.15))",
      hoverShadow:
        "drop-shadow(0px 6px 12px rgba(0,0,0,0.5)) drop-shadow(0px 18px 24px rgba(0,229,190,0.3))",
      iconColor: "text-[#00E5BE]",
    },
  }[variant];

  return (
    <div
      className={\`relative inline-flex items-center justify-center select-none \${sizeConfig.outerPadding} \${sizeConfig.outerRadius} \${themeStyles.outerBg} \${themeStyles.outerShadow} transition-all duration-300 \${className}\`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
    >
      <motion.button
        type="button"
        disabled={disabled}
        onClick={onClick}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onTouchStart={() => setIsPressed(true)}
        onTouchEnd={() => setIsPressed(false)}
        animate={{
          y: isPressed ? 1.5 : isHovered ? sizeConfig.liftY : 0,
          scale: isPressed ? 0.985 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 24,
          mass: 0.7,
        }}
        className="relative flex items-center cursor-pointer focus:outline-none overflow-hidden"
        style={{
          filter: isHovered ? themeStyles.hoverShadow : themeStyles.restingShadow,
          willChange: "transform",
        }}
      >
        <span
          className="font-semibold whitespace-nowrap tracking-[-0.2px] leading-none select-none"
          style={{
            color: textColor || undefined,
            textShadow: themeStyles.textShadow,
          }}
        >
          {label}
        </span>

        <div
          className={\`relative shrink-0 \${sizeConfig.outerCircleSize} rounded-full \${themeStyles.outerCircleBg} flex items-center justify-center\`}
        >
          <div
            className={\`shrink-0 \${sizeConfig.innerCircleSize} rounded-full \${themeStyles.innerCircleBg} flex items-center justify-center\`}
          >
            <div className={themeStyles.iconColor}>
              {icon || <ApexEmblemIcon className={sizeConfig.iconSize} />}
            </div>
          </div>
        </div>

        <div
          className={\`absolute inset-0 pointer-events-none \${sizeConfig.innerRadius} \${themeStyles.capBevel}\`}
        />
      </motion.button>
    </div>
  );
};

export default ScalingCapsuleButton;`;

  const usageCode = `import React from "react";
import { ScalingCapsuleButton } from "@/components/ScalingCapsuleButton";

export default function HeroSection() {
  return (
    <div className="flex items-center gap-4">
      <ScalingCapsuleButton
        label="${label}"
        variant="${variant}"
        size="${size}"
        onClick={() => console.log("Button clicked!")}
      />
    </div>
  );
}`;

  const cssOnlyCode = `/* Scaling Capsule Glass Enclosure Tokens */
.capsule-glass-tray {
  padding: 6px;
  border-radius: 50px;
  background: rgba(209, 213, 236, 0.14);
  box-shadow: 
    0px 1.5px 0px 0px #FFFFFF,
    inset 0px 0px 2px 0px rgba(0, 0, 0, 0.4);
}

.capsule-cap {
  background: #343434;
  border-radius: 24px;
  padding: 1px 1px 3px 30px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow:
    inset 0px 2px 0px 0px rgba(255, 255, 255, 0.25),
    inset 0px -5px 0px 0px rgba(160, 160, 160, 0.2),
    inset 0px 1px 0px 0px rgba(255, 255, 255, 0.8),
    inset 0px -4px 0px 0px #000000;
  filter: drop-shadow(0px 3px 3px rgba(0,0,0,0.14))
          drop-shadow(0px 6.6px 5.3px rgba(0,0,0,0.13))
          drop-shadow(0px 12.5px 10px rgba(0,0,0,0.14))
          drop-shadow(0px 22.3px 17.9px rgba(0,0,0,0.14))
          drop-shadow(0px 41.8px 33.4px rgba(0,0,0,0.15))
          drop-shadow(0px 100px 80px rgba(0,0,0,0.15));
}

.capsule-knob-circle {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: linear-gradient(180deg, #1B1B1B 0%, #343434 100%);
}`;

  return (
    <PageWrapper showFloatingButton={false}>
      <div className="relative overflow-hidden min-h-screen bg-[#0E0E10] text-gray-100 selection:bg-[#FF5B04] selection:text-white pt-6 pb-20">
        {/* Background ambient lighting */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#FF5B04]/10 rounded-full blur-[140px]" />
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-[#00E5BE]/10 rounded-full blur-[120px]" />
          <div className="absolute top-2/3 right-1/4 w-[500px] h-[400px] bg-purple-600/10 rounded-full blur-[140px]" />
        </div>

        <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          {/* Header section */}
          <div className="text-center space-y-5 max-w-3xl mx-auto pt-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-300 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#FF5B04] animate-pulse" />
              <span>Frosted Capsule CTA</span>
              <span className="text-gray-500">•</span>
              <span className="text-[#00E5BE]">React + Multi-Shadow</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-jakarta">
              Scaling Capsule <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400">Tactile Button</span>
            </h1>

          <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
            Interactive capsule button engineered with a frosted translucent glass cavity tray, multi-tier elevation drop shadows, specular bevel insets, and an embedded circular apex emblem badge.
          </p>
        </div>

        {/* Live Interactive Studio / Sandbox */}
        <div className="bg-[#151518]/90 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <StudioCanvas>
              <ScalingCapsuleButton
                label={label}
                textColor={textColor}
                variant={variant}
                size={size}
                stateMode={stateMode}
                onClick={() => setClickCount((c) => c + 1)}
              />

              {/* Click Counter indicator */}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5 text-xs">
            {/* Custom Label Input */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-gray-400 block">
                Button Label
              </label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Enter button text..."
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF5B04] transition-colors font-mono"
              />
            </div>

            {/* Text Color Selector */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-gray-400 block">
                Text Color
              </label>
              <select
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#FF5B04] font-mono"
              >
                {textColorOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-[#151518] text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* State Mode Selector */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-gray-400 block">
                State Preview
              </label>
              <select
                value={stateMode}
                onChange={(e) => setStateMode(e.target.value as ScalingCapsuleStateMode)}
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#FF5B04] font-mono"
              >
                <option value="interactive" className="bg-[#151518] text-white">Interactive</option>
                <option value="standerd" className="bg-[#151518] text-white">Standard</option>
                <option value="hover" className="bg-[#151518] text-white">Hover</option>
              </select>
            </div>

            {/* Variant Selector */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-gray-400 block">
                Colorway Theme
              </label>
              <select
                value={variant}
                onChange={(e) => setVariant(e.target.value as ScalingCapsuleVariant)}
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#FF5B04] font-mono"
              >
                <option value="dark" className="bg-[#151518] text-white">Dark</option>
                <option value="orange" className="bg-[#151518] text-white">Orange</option>
                <option value="light" className="bg-[#151518] text-white">Light</option>
                <option value="cyberpunk" className="bg-[#151518] text-white">Cyberpunk</option>
              </select>
            </div>

            {/* Size Selector */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-gray-400 block">
                Scale Size
              </label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value as typeof size)}
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#FF5B04] font-mono"
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
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-[#FF5B04] mb-1.5">
                <span>PRESETS &amp; VARIATIONS</span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">All Variants Preview</h2>
            </div>
            <p className="text-xs text-gray-400 font-mono">
              Hover over buttons to test frosted glass capsule elevation &amp; multi-tier shadow stacks
            </p>
          </div>

          <div className="bg-[#151518]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Figma Dark Obsidian */}
              <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[220px] overflow-x-clip transition-all hover:border-white/15">
                <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                  <span className="text-white font-semibold">Figma Dark Obsidian</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-gray-300">variant=&quot;dark&quot;</span>
                </div>
                <div className="my-3">
                  <ScalingCapsuleButton
                    variant="dark"
                    label="Scaling Workshop"
                    size="md"
                  />
                </div>
                <span className="text-[11px] font-mono text-gray-500 text-center">1:1 Figma Master design with frosted translucent cavity tray</span>
              </div>

              {/* UI Pirate Magma */}
              <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[220px] overflow-x-clip transition-all hover:border-white/15">
                <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                  <span className="text-white font-semibold">UI Pirate Magma</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-orange-400">variant=&quot;orange&quot;</span>
                </div>
                <div className="my-3">
                  <ScalingCapsuleButton
                    variant="orange"
                    label="Start Building"
                    size="md"
                  />
                </div>
                <span className="text-[11px] font-mono text-gray-500 text-center">Signature magma orange glowing capsule with apex emblem</span>
              </div>

              {/* Titanium Light */}
              <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[220px] overflow-x-clip transition-all hover:border-white/15">
                <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                  <span className="text-white font-semibold">Titanium Light</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-blue-300">variant=&quot;light&quot;</span>
                </div>
                <div className="my-3">
                  <ScalingCapsuleButton
                    variant="light"
                    label="Join Waitlist"
                    size="md"
                  />
                </div>
                <span className="text-[11px] font-mono text-gray-500 text-center">Clean ceramic light pill with high-contrast ladder apex</span>
              </div>

              {/* Cyberpunk Neon */}
              <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[220px] overflow-x-clip transition-all hover:border-white/15">
                <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                  <span className="text-white font-semibold">Cyberpunk Neon</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-purple-400">variant=&quot;cyberpunk&quot;</span>
                </div>
                <div className="my-3">
                  <ScalingCapsuleButton
                    variant="cyberpunk"
                    label="Deploy Matrix"
                    size="md"
                  />
                </div>
                <span className="text-[11px] font-mono text-gray-500 text-center">Ultraviolet neon tray with cybernetic specular insets</span>
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
              This component is self-contained and powered by <strong className="text-white">Framer Motion</strong> for spring physics and <strong className="text-white">Tailwind CSS</strong> for styling. Install the required peer dependency:
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 bg-black/60 border border-white/10 rounded-2xl px-5 py-3.5 font-mono text-xs text-emerald-400">
              <span>npm install framer-motion clsx tailwind-merge</span>
              <button
                onClick={handleCopyInstall}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-sans transition-colors cursor-pointer"
              >
                {copiedInstall ? "Copied Command!" : "Copy Command"}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-xs font-semibold text-white">1. Copy Component Code</span>
                <p className="text-xs text-gray-400">Paste into <code className="text-orange-400 font-mono">components/ScalingCapsuleButton.tsx</code>.</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-xs font-semibold text-white">2. Import in Your Page</span>
                <p className="text-xs text-gray-400">Drop into any Next.js (App/Pages) or React project.</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-xs font-semibold text-white">3. Customize Props</span>
                <p className="text-xs text-gray-400">Pass custom labels, variants, sizes, and click handlers.</p>
              </div>
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
              className="text-xs font-mono text-orange-400 hover:text-orange-300 transition-colors"
            >
              {copiedCode === activeCodeTab ? "✓ Copied to Clipboard" : "Copy Active Tab Code"}
            </button>
          </div>

          <div className="bg-[#151518] border border-white/10 rounded-3xl overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white font-mono">
                  {activeCodeTab === "component" ? "ScalingCapsuleButton.tsx" : activeCodeTab === "usage" ? "Usage.tsx" : "Tokens.css"}
                </span>
                <span className="text-xs text-gray-500 font-mono">• Production Ready</span>
              </div>

              <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/5 text-xs">
                <button
                  onClick={() => setActiveCodeTab("component")}
                  className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                    activeCodeTab === "component"
                      ? "bg-[#FF5B04] text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Component.tsx
                </button>
                <button
                  onClick={() => setActiveCodeTab("usage")}
                  className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                    activeCodeTab === "usage"
                      ? "bg-[#FF5B04] text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Usage.tsx
                </button>
                <button
                  onClick={() => setActiveCodeTab("css")}
                  className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                    activeCodeTab === "css"
                      ? "bg-[#FF5B04] text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Tokens.css
                </button>
              </div>
            </div>

            <div className="p-6 bg-[#0B0B0D] overflow-x-auto max-h-[550px]">
              <pre className="text-xs sm:text-sm font-mono text-gray-300 leading-relaxed">
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
                    <td className="py-3 px-6 text-gray-400">&quot;Scaling Workshop&quot;</td>
                    <td className="py-3 px-6 font-sans text-gray-300">Text displayed on the button cap</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-orange-400 font-semibold">variant</td>
                    <td className="py-3 px-6 text-blue-300">&quot;dark&quot; | &quot;orange&quot; | &quot;light&quot; | &quot;cyberpunk&quot;</td>
                    <td className="py-3 px-6 text-gray-400">&quot;dark&quot;</td>
                    <td className="py-3 px-6 font-sans text-gray-300">Visual colorway theme style</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-orange-400 font-semibold">size</td>
                    <td className="py-3 px-6 text-blue-300">&quot;xs&quot; | &quot;sm&quot; | &quot;md&quot; | &quot;lg&quot; | &quot;xl&quot;</td>
                    <td className="py-3 px-6 text-gray-400">&quot;md&quot;</td>
                    <td className="py-3 px-6 font-sans text-gray-300">Physical scaling size scale</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-orange-400 font-semibold">icon</td>
                    <td className="py-3 px-6 text-blue-300">React.ReactNode</td>
                    <td className="py-3 px-6 text-gray-400">&lt;ApexEmblemIcon /&gt;</td>
                    <td className="py-3 px-6 font-sans text-gray-300">Custom icon or emblem component</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-orange-400 font-semibold">onClick</td>
                    <td className="py-3 px-6 text-blue-300">() =&gt; void</td>
                    <td className="py-3 px-6 text-gray-400">undefined</td>
                    <td className="py-3 px-6 font-sans text-gray-300">Click callback event handler</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-orange-400 font-semibold">disabled</td>
                    <td className="py-3 px-6 text-blue-300">boolean</td>
                    <td className="py-3 px-6 text-gray-400">false</td>
                    <td className="py-3 px-6 font-sans text-gray-300">Disables interaction and hover states</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-orange-400 font-semibold">className</td>
                    <td className="py-3 px-6 text-blue-300">string</td>
                    <td className="py-3 px-6 text-gray-400">&quot;&quot;</td>
                    <td className="py-3 px-6 font-sans text-gray-300">Additional custom Tailwind CSS classes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            THEME VARIANTS SHOWCASE
           ───────────────────────────────────────────────────────────── */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">Theme Presets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Obsidian Core",
                label: "Scaling Workshop",
                variant: "dark" as const,
                desc: "Matte #343434 cap with 26px black circle badge",
              },
              {
                title: "UI Pirate Brand",
                label: "Launch Workshop",
                variant: "orange" as const,
                desc: "High energy brand orange with deep cavity glow",
              },
              {
                title: "Porcelain Minimalist",
                label: "Start Scaling",
                variant: "light" as const,
                desc: "Clean light ceramic cap for bright SaaS products",
              },
              {
                title: "Cyberpunk Apex",
                label: "Deploy Node",
                variant: "cyberpunk" as const,
                desc: "Deep obsidian cap with cyan rim and glowing icon",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="bg-[#151518] border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-between gap-6 hover:border-white/20 transition-colors"
              >
                <div className="w-full text-left">
                  <h3 className="text-sm font-semibold text-white">{card.title}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{card.desc}</p>
                </div>

                <div className="py-3 flex items-center justify-center">
                  <ScalingCapsuleButton
                    label={card.label}
                    variant={card.variant}
                    size="sm"
                  />
                </div>

                <div className="w-full flex items-center justify-between text-[11px] text-gray-500 font-mono border-t border-white/5 pt-3">
                  <span>variant: {card.variant}</span>
                  <span className="text-gray-400">Ready to Use</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Website Global CTA */}
        <GlobalCTA topic="tactile capsule buttons or design systems" />
      </div>
    </div>
  </PageWrapper>
  );
}
