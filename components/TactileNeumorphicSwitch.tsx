"use client";

import React, { useState } from "react";
import { motion, Transition } from "framer-motion";

export type TactileSwitchTheme =
  | "figma-emerald"
  | "cyber-cyan"
  | "magma-orange"
  | "dark-obsidian"
  | "hyper-violet"
  | "amber-crt";

export type TactileSwitchSize = "xs" | "sm" | "md" | "lg" | "xl";
export type TactileSwitchStateMode = "interactive" | "off" | "on";

export interface TactileNeumorphicSwitchProps {
  /** Controlled active state (true = ON, false = OFF) */
  checked?: boolean;
  /** Initial state if uncontrolled */
  defaultChecked?: boolean;
  /** Fixed state mode: 'interactive' (default), 'off' (Figma 1:7), 'on' (Figma 1:8) */
  stateMode?: TactileSwitchStateMode;
  /** Change event handler */
  onChange?: (checked: boolean) => void;
  /** Visual color theme preset */
  theme?: TactileSwitchTheme;
  /** Scale size preset */
  size?: TactileSwitchSize;
  /** Disabled state */
  disabled?: boolean;
  /** Optional accessible label */
  label?: string;
  /** Show fine mesh grid canvas texture behind the switch */
  showGrid?: boolean;
  /** Additional CSS class name */
  className?: string;
}

interface SizeConfig {
  scale: number;
  outerW: number;
  outerH: number;
  trackW: number;
  trackH: number;
  knobW: number;
  knobH: number;
  travel: number;
}

const SIZES: Record<TactileSwitchSize, SizeConfig> = {
  xs: {
    scale: 0.5,
    outerW: 170,
    outerH: 72,
    trackW: 144,
    trackH: 42,
    knobW: 76,
    knobH: 51,
    travel: 68,
  },
  sm: {
    scale: 0.72,
    outerW: 245,
    outerH: 104,
    trackW: 207,
    trackH: 60,
    knobW: 109,
    knobH: 73,
    travel: 98,
  },
  md: {
    scale: 1,
    outerW: 340,
    outerH: 144,
    trackW: 288,
    trackH: 84,
    knobW: 152,
    knobH: 102,
    travel: 136,
  },
  lg: {
    scale: 1.25,
    outerW: 425,
    outerH: 180,
    trackW: 360,
    trackH: 105,
    knobW: 190,
    knobH: 128,
    travel: 170,
  },
  xl: {
    scale: 1.5,
    outerW: 510,
    outerH: 216,
    trackW: 432,
    trackH: 126,
    knobW: 228,
    knobH: 153,
    travel: 204,
  },
};

export interface SwitchThemeColors {
  name: string;
  accent: string;
  glowColor: string;
  canvasBg: string;
  gridColor: string;
  outerCavityBg: string;
  outerBevelShadow: string;
  trackOffBg: string;
  trackOffShadow: string;
  trackOnGradient: string;
  trackOnShadow: string;
  // 3D Knob Palette
  knobBevelLight: string;
  knobBevelMid: string;
  knobBevelDark: string;
  discLight: string;
  discMid: string;
  discDark: string;
  discShadowColor: string;
}

export const SWITCH_THEMES: Record<TactileSwitchTheme, SwitchThemeColors> = {
  "figma-emerald": {
    name: "Figma Emerald (1:7 & 1:8)",
    accent: "#10E599",
    glowColor: "rgba(16, 229, 153, 0.45)",
    canvasBg: "#E3E7EE",
    gridColor: "rgba(175, 186, 205, 0.4)",
    outerCavityBg: "linear-gradient(145deg, #DFE4EC 0%, #EAEEF5 100%)",
    outerBevelShadow:
      "inset 6px 7px 14px rgba(150, 163, 184, 0.65), " +
      "inset -6px -7px 14px rgba(255, 255, 255, 0.95), " +
      "inset 1px 1px 2px rgba(135, 148, 170, 0.45), " +
      "inset -1px -1px 2px rgba(255, 255, 255, 1)",
    trackOffBg: "linear-gradient(180deg, #BAC3D2 0%, #CDD5E2 25%, #E2E8F1 65%, #F0F4F9 100%)",
    trackOffShadow:
      "inset 0 12px 16px -3px rgba(45, 60, 85, 0.48), " +
      "inset 0 3px 6px rgba(45, 60, 85, 0.35), " +
      "inset 6px 0 10px rgba(55, 70, 95, 0.3), " +
      "inset -6px 0 10px rgba(55, 70, 95, 0.3), " +
      "inset 0 -2.5px 4px rgba(255, 255, 255, 0.95)",
    trackOnGradient:
      "linear-gradient(90deg, #02B86E 0%, #0AD483 35%, #2BF3A4 80%, #56F8B6 100%)",
    trackOnShadow:
      "inset 0 11px 14px -2px rgba(0, 80, 45, 0.65), " +
      "inset 0 3px 5px rgba(0, 60, 32, 0.45), " +
      "inset 5px 0 9px rgba(0, 75, 40, 0.45), " +
      "inset 0 -2.5px 4px rgba(255, 255, 255, 0.65), " +
      "0 0 20px rgba(16, 229, 153, 0.4)",
    knobBevelLight: "#FFFFFF",
    knobBevelMid: "#F2F5FA",
    knobBevelDark: "#AEBDD2",
    discLight: "#FFFFFF",
    discMid: "#EEF2F8",
    discDark: "#CAD5E3",
    discShadowColor: "#7C8CA6",
  },
  "cyber-cyan": {
    name: "Cyber Laser Cyan",
    accent: "#00E5FF",
    glowColor: "rgba(0, 229, 255, 0.5)",
    canvasBg: "#E0E6EE",
    gridColor: "rgba(160, 180, 210, 0.4)",
    outerCavityBg: "linear-gradient(145deg, #DCE2EB 0%, #E8EEF7 100%)",
    outerBevelShadow:
      "inset 6px 7px 14px rgba(140, 155, 178, 0.6), " +
      "inset -6px -7px 14px rgba(255, 255, 255, 0.95)",
    trackOffBg: "linear-gradient(180deg, #BAC3D2 0%, #CDD5E2 25%, #E2E8F1 65%, #F0F4F9 100%)",
    trackOffShadow:
      "inset 0 12px 16px -3px rgba(45, 60, 85, 0.48), " +
      "inset 0 -2.5px 4px rgba(255, 255, 255, 0.95)",
    trackOnGradient:
      "linear-gradient(90deg, #0088CC 0%, #00B4E6 35%, #00E5FF 80%, #6EFAFF 100%)",
    trackOnShadow:
      "inset 0 11px 14px -2px rgba(0, 60, 100, 0.65), " +
      "inset 0 -2.5px 4px rgba(255, 255, 255, 0.65), " +
      "0 0 20px rgba(0, 229, 255, 0.4)",
    knobBevelLight: "#FFFFFF",
    knobBevelMid: "#EFF3F9",
    knobBevelDark: "#9EAFCA",
    discLight: "#FFFFFF",
    discMid: "#EBF0F7",
    discDark: "#B4C4D8",
    discShadowColor: "#586D88",
  },
  "magma-orange": {
    name: "UI Pirate Magma",
    accent: "#FF5B04",
    glowColor: "rgba(255, 91, 4, 0.5)",
    canvasBg: "#EAE4DF",
    gridColor: "rgba(200, 180, 170, 0.4)",
    outerCavityBg: "linear-gradient(145deg, #E5DFD8 0%, #F2ECE5 100%)",
    outerBevelShadow:
      "inset 6px 7px 14px rgba(175, 155, 145, 0.6), " +
      "inset -6px -7px 14px rgba(255, 255, 255, 0.95)",
    trackOffBg: "linear-gradient(180deg, #C7BCB3 0%, #D8CFC7 25%, #E9E2DC 65%, #F5EFEB 100%)",
    trackOffShadow:
      "inset 0 12px 16px -3px rgba(85, 60, 50, 0.48), " +
      "inset 0 -2.5px 4px rgba(255, 255, 255, 0.95)",
    trackOnGradient:
      "linear-gradient(90deg, #C43600 0%, #E64A00 35%, #FF5B04 80%, #FFA066 100%)",
    trackOnShadow:
      "inset 0 11px 14px -2px rgba(100, 25, 0, 0.65), " +
      "inset 0 -2.5px 4px rgba(255, 255, 255, 0.65), " +
      "0 0 20px rgba(255, 91, 4, 0.4)",
    knobBevelLight: "#FFFFFF",
    knobBevelMid: "#FAF6F4",
    knobBevelDark: "#BCAE9F",
    discLight: "#FFFFFF",
    discMid: "#F7F2EE",
    discDark: "#C5B5A7",
    discShadowColor: "#786455",
  },
  "dark-obsidian": {
    name: "Dark Obsidian Stealth",
    accent: "#38BDF8",
    glowColor: "rgba(56, 189, 248, 0.45)",
    canvasBg: "#111317",
    gridColor: "rgba(255, 255, 255, 0.05)",
    outerCavityBg: "linear-gradient(145deg, #15181E 0%, #1A1E26 100%)",
    outerBevelShadow:
      "inset 6px 7px 14px rgba(0, 0, 0, 0.8), " +
      "inset -6px -7px 14px rgba(255, 255, 255, 0.08)",
    trackOffBg: "linear-gradient(180deg, #07080B 0%, #101217 25%, #181B22 65%, #222630 100%)",
    trackOffShadow:
      "inset 0 12px 16px -3px rgba(0, 0, 0, 0.88), " +
      "inset 0 -2.5px 4px rgba(255, 255, 255, 0.1)",
    trackOnGradient:
      "linear-gradient(90deg, #0369A1 0%, #0284C7 35%, #38BDF8 80%, #BAE6FD 100%)",
    trackOnShadow:
      "inset 0 11px 14px -2px rgba(0, 0, 0, 0.8), " +
      "0 0 22px rgba(56, 189, 248, 0.4)",
    knobBevelLight: "#48505E",
    knobBevelMid: "#2C313B",
    knobBevelDark: "#101318",
    discLight: "#3C4350",
    discMid: "#242932",
    discDark: "#12151B",
    discShadowColor: "#05070A",
  },
  "hyper-violet": {
    name: "Hyper Ultraviolet",
    accent: "#C084FC",
    glowColor: "rgba(192, 132, 252, 0.5)",
    canvasBg: "#E6E1EE",
    gridColor: "rgba(180, 160, 210, 0.4)",
    outerCavityBg: "linear-gradient(145deg, #E1DCEB 0%, #ECE7F5 100%)",
    outerBevelShadow:
      "inset 6px 7px 14px rgba(160, 145, 180, 0.6), " +
      "inset -6px -7px 14px rgba(255, 255, 255, 0.95)",
    trackOffBg: "linear-gradient(180deg, #C2B8D2 0%, #D4C9E3 25%, #E6DCF4 65%, #F3EDFC 100%)",
    trackOffShadow:
      "inset 0 12px 16px -3px rgba(75, 50, 95, 0.48), " +
      "inset 0 -2.5px 4px rgba(255, 255, 255, 0.95)",
    trackOnGradient:
      "linear-gradient(90deg, #7E22CE 0%, #9333EA 35%, #C084FC 80%, #E9D5FF 100%)",
    trackOnShadow:
      "inset 0 11px 14px -2px rgba(60, 10, 100, 0.6), " +
      "inset 0 -2.5px 4px rgba(255, 255, 255, 0.65), " +
      "0 0 20px rgba(192, 132, 252, 0.4)",
    knobBevelLight: "#FFFFFF",
    knobBevelMid: "#F8F5FA",
    knobBevelDark: "#B4A4C6",
    discLight: "#FFFFFF",
    discMid: "#F5EFF9",
    discDark: "#BFB0D0",
    discShadowColor: "#6A5880",
  },
  "amber-crt": {
    name: "Amber CRT Gold",
    accent: "#FBBF24",
    glowColor: "rgba(251, 191, 36, 0.5)",
    canvasBg: "#EBE5DB",
    gridColor: "rgba(205, 190, 160, 0.4)",
    outerCavityBg: "linear-gradient(145deg, #E6E1D5 0%, #F3EEE2 100%)",
    outerBevelShadow:
      "inset 6px 7px 14px rgba(180, 165, 135, 0.6), " +
      "inset -6px -7px 14px rgba(255, 255, 255, 0.95)",
    trackOffBg: "linear-gradient(180deg, #CAC2B0 0%, #DDD5C3 25%, #EDE6D6 65%, #FAF4E7 100%)",
    trackOffShadow:
      "inset 0 12px 16px -3px rgba(90, 75, 45, 0.48), " +
      "inset 0 -2.5px 4px rgba(255, 255, 255, 0.95)",
    trackOnGradient:
      "linear-gradient(90deg, #B45309 0%, #D97706 35%, #FBBF24 80%, #FDE68A 100%)",
    trackOnShadow:
      "inset 0 11px 14px -2px rgba(90, 40, 0, 0.65), " +
      "inset 0 -2.5px 4px rgba(255, 255, 255, 0.65), " +
      "0 0 20px rgba(251, 191, 36, 0.4)",
    knobBevelLight: "#FFFFFF",
    knobBevelMid: "#FAF8F4",
    knobBevelDark: "#BEB29E",
    discLight: "#FFFFFF",
    discMid: "#F7F4EE",
    discDark: "#C5BAA8",
    discShadowColor: "#746652",
  },
};

const SPRING_PHYSICS: Transition = {
  type: "spring",
  stiffness: 380,
  damping: 26,
  mass: 0.85,
};

/**
 * Tactile Neumorphic Dual-Dome Switch
 * Exact 1:1 Vector Implementation of Figma Nodes 1:7 (OFF) & 1:8 (ON)
 */
export const TactileNeumorphicSwitch: React.FC<TactileNeumorphicSwitchProps> = ({
  checked: controlledChecked,
  defaultChecked = false,
  stateMode = "interactive",
  onChange,
  theme = "figma-emerald",
  size = "md",
  disabled = false,
  label,
  showGrid = true,
  className = "",
}) => {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);

  const isChecked =
    stateMode === "off"
      ? false
      : stateMode === "on"
      ? true
      : controlledChecked !== undefined
      ? controlledChecked
      : internalChecked;

  const cfg = SIZES[size] || SIZES.md;
  const t = SWITCH_THEMES[theme] || SWITCH_THEMES["figma-emerald"];

  const handleToggle = () => {
    if (disabled || stateMode !== "interactive") return;
    const nextVal = !isChecked;
    if (controlledChecked === undefined) {
      setInternalChecked(nextVal);
    }
    onChange?.(nextVal);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled || stateMode !== "interactive") return;
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      handleToggle();
    }
  };

  const uid = theme;

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center select-none ${className}`}
    >
      {/* Outer Studio Stage Container with Canvas Background & Mesh Grid */}
      <div
        onClick={handleToggle}
        className={`relative p-6 sm:p-10 rounded-[36px] flex items-center justify-center transition-colors duration-500 overflow-hidden ${
          disabled ? "cursor-not-allowed" : "cursor-pointer"
        }`}
        style={{
          backgroundColor: t.canvasBg,
        }}
      >
        {/* Subtle Fine Mesh Grid Texture (Figma Canvas) */}
        {showGrid && (
          <div
            className="absolute inset-0 pointer-events-none opacity-50"
            style={{
              backgroundImage: `linear-gradient(to right, ${t.gridColor} 1px, transparent 1px), linear-gradient(to bottom, ${t.gridColor} 1px, transparent 1px)`,
              backgroundSize: `${16 * cfg.scale}px ${16 * cfg.scale}px`,
            }}
          />
        )}

        {/* ── Outer Recessed Bevel Cavity Frame ──────────────────────── */}
        <div
          role="switch"
          aria-checked={isChecked}
          aria-label={label || "Tactile Neumorphic Switch"}
          tabIndex={disabled ? -1 : 0}
          onKeyDown={handleKeyDown}
          className={`relative flex items-center justify-center cursor-pointer outline-none transition-transform duration-200 ${
            disabled
              ? "opacity-50 cursor-not-allowed"
              : stateMode === "interactive"
              ? "active:scale-[0.985]"
              : ""
          }`}
          style={{
            width: cfg.outerW,
            height: cfg.outerH,
            borderRadius: cfg.outerH / 2,
            background: t.outerCavityBg,
            boxShadow: t.outerBevelShadow,
          }}
        >
          {/* ── Inner Deep Shadow Trench Slot (Track) ──────────────────── */}
          <div
            className="relative overflow-hidden flex items-center"
            style={{
              width: cfg.trackW,
              height: cfg.trackH,
              borderRadius: cfg.trackH / 2,
              background: t.trackOffBg,
              boxShadow: t.trackOffShadow,
            }}
          >
            {/* ON State Illuminated Emerald / Neon Channel Fill */}
            <motion.div
              initial={false}
              animate={{
                width: isChecked ? `${cfg.trackW - 20 * cfg.scale}px` : "0px",
                opacity: isChecked ? 1 : 0,
              }}
              transition={SPRING_PHYSICS}
              className="absolute left-0 top-0 bottom-0 pointer-events-none"
              style={{
                borderRadius: `${cfg.trackH / 2}px 0 0 ${cfg.trackH / 2}px`,
                background: t.trackOnGradient,
                boxShadow: t.trackOnShadow,
              }}
            >
              {/* Internal Optical Refraction Specular Ray */}
              <div
                className="absolute inset-x-2 top-[2px] h-[32%] pointer-events-none rounded-full"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0) 100%)",
                }}
              />
            </motion.div>
          </div>

          {/* ── 1:1 Vector Double-Cylinder Handle (Figma Image 2) ──────── */}
          <motion.div
            initial={false}
            animate={{
              x: isChecked ? cfg.travel / 2 : -cfg.travel / 2,
            }}
            transition={SPRING_PHYSICS}
            className="absolute z-20 pointer-events-none flex items-center justify-center"
            style={{
              width: cfg.knobW,
              height: cfg.knobH,
              filter: `drop-shadow(0px ${12 * cfg.scale}px ${16 * cfg.scale}px rgba(46, 60, 86, 0.24)) drop-shadow(0px ${4 * cfg.scale}px ${6 * cfg.scale}px rgba(46, 60, 86, 0.16))`,
            }}
          >
            <svg
              viewBox="0 0 152 102"
              width={cfg.knobW}
              height={cfg.knobH}
              className="w-full h-full"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Base pill — flat, barely-there light fill so the two discs read on top */}
                <linearGradient id={`baseBevel_${uid}`} x1="20" y1="4" x2="132" y2="100" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor={t.knobBevelLight} />
                  <stop offset="100%" stopColor={t.knobBevelMid} />
                </linearGradient>

                {/* Disc shading — white plateau then a soft defined grey rim */}
                <radialGradient id={`leftCylGrad_${uid}`} cx="40" cy="38" r="52" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor={t.discLight} />
                  <stop offset="42%" stopColor={t.discLight} />
                  <stop offset="74%" stopColor={t.discMid} />
                  <stop offset="93%" stopColor={t.discDark} />
                  <stop offset="100%" stopColor={t.discDark} />
                </radialGradient>
                <radialGradient id={`rightCylGrad_${uid}`} cx="92" cy="38" r="54" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor={t.discLight} />
                  <stop offset="42%" stopColor={t.discLight} />
                  <stop offset="74%" stopColor={t.discMid} />
                  <stop offset="93%" stopColor={t.discDark} />
                  <stop offset="100%" stopColor={t.discDark} />
                </radialGradient>

                {/* Soft, visible seam where the left disc overlaps the right */}
                <filter id={`castShadow_${uid}`} x="-25%" y="-25%" width="170%" height="170%">
                  <feDropShadow dx="7" dy="2" stdDeviation="6" floodColor={t.discShadowColor} floodOpacity="0.32" />
                </filter>

                {/* Per-disc top-left specular highlight */}
                <radialGradient id={`spec_${uid}`} cx="0.35" cy="0.3" r="0.5">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
                  <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Base pill frame */}
              <rect x="0" y="0" width="152" height="102" rx="51" fill={`url(#baseBevel_${uid})`} />

              {/* Right disc */}
              <circle cx="101" cy="51" r="45" fill={`url(#rightCylGrad_${uid})`} />
              <circle cx="101" cy="51" r="44.25" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
              <ellipse cx="90" cy="34" rx="24" ry="17" fill={`url(#spec_${uid})`} />

              {/* Left disc overlapping the right, with a soft seam */}
              <circle cx="51" cy="51" r="45" fill={`url(#leftCylGrad_${uid})`} filter={`url(#castShadow_${uid})`} />
              <circle cx="51" cy="51" r="44.25" fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="1.5" />
              <ellipse cx="40" cy="34" rx="24" ry="17" fill={`url(#spec_${uid})`} />

              {/* Soft outer rim */}
              <rect x="0.75" y="0.75" width="150.5" height="100.5" rx="50.25" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" fill="none" />
            </svg>
          </motion.div>
        </div>
      </div>

      {label && (
        <span
          onClick={handleToggle}
          className="mt-3 text-xs font-mono text-gray-500 dark:text-gray-400 font-semibold cursor-pointer hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          {label}
        </span>
      )}
    </div>
  );
};

export default TactileNeumorphicSwitch;
