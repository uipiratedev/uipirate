"use client";

import React, { useState } from "react";
import { motion, Transition } from "framer-motion";

export type TactileSwitchTheme =
  | "emerald-photon"
  | "cyber-cyan"
  | "magma-orange"
  | "dark-obsidian"
  | "hyper-violet"
  | "amber-crt";

export type TactileSwitchSize = "xs" | "sm" | "md" | "lg" | "xl";
export type TactileSwitchStateMode = "interactive" | "off" | "on" | "standerd" | "hover";

export interface TactileNeumorphicSwitchProps {
  /** Controlled active state (true = ON, false = OFF) */
  checked?: boolean;
  /** Initial state if uncontrolled */
  defaultChecked?: boolean;
  /** Fixed state mode: 'interactive' (default), 'off' (static OFF), 'on' (static ON) */
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
  /** Optional custom active/ON state color override (e.g. '#FF0055', '#8B5CF6') */
  customActiveColor?: string;
  /** Additional CSS class name */
  className?: string;
}

// Utility to shade/tint HEX colors for dynamic gradients and ambient glows
function adjustHex(hex: string, percent: number): string {
  let cleanHex = hex.replace("#", "");
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  let num = parseInt(cleanHex, 16);
  if (isNaN(num)) return hex;
  let r = (num >> 16) + Math.round((255 * percent) / 100);
  let g = ((num >> 8) & 0x00ff) + Math.round((255 * percent) / 100);
  let b = (num & 0x0000ff) + Math.round((255 * percent) / 100);
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// Inline Vector Render Assets (Zero External Network Requests)
const ELLIPSE_1624_URI =
  "data:image/png;base64,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";

const ELLIPSE_1625_URI =
  "data:image/png;base64,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";

interface SizeConfig {
  scale: number;
  outerW: number;
  outerH: number;
  trackW: number;
  trackH: number;
  knobW: number;
  knobH: number;
  travel: number;
  ellipseW: number;
  ellipseH: number;
  gap: number;
}

const SIZES: Record<TactileSwitchSize, SizeConfig> = {
  xs: {
    scale: 0.8,
    outerW: 78,
    outerH: 30,
    trackW: 64,
    trackH: 17,
    knobW: 39,
    knobH: 24,
    travel: 31.5,
    ellipseW: 17,
    ellipseH: 19,
    gap: 3,
  },
  sm: {
    scale: 1.0,
    outerW: 97,
    outerH: 37,
    trackW: 80,
    trackH: 21,
    knobW: 49,
    knobH: 30,
    travel: 39.4,
    ellipseW: 21,
    ellipseH: 24,
    gap: 4,
  },
  md: {
    scale: 1.4,
    outerW: 136,
    outerH: 52,
    trackW: 112,
    trackH: 29,
    knobW: 69,
    knobH: 42,
    travel: 55.2,
    ellipseW: 29,
    ellipseH: 34,
    gap: 5,
  },
  lg: {
    scale: 1.8,
    outerW: 175,
    outerH: 67,
    trackW: 144,
    trackH: 37,
    knobW: 88,
    knobH: 54,
    travel: 71.0,
    ellipseW: 37,
    ellipseH: 44,
    gap: 6,
  },
  xl: {
    scale: 2.2,
    outerW: 214,
    outerH: 82,
    trackW: 176,
    trackH: 45,
    knobW: 108,
    knobH: 66,
    travel: 86.6,
    ellipseW: 45,
    ellipseH: 53,
    gap: 8,
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
  knobBg?: string;
  knobShadow?: string;
  knobFilter?: string;
  knobDomeFilter?: string;
}

export const SWITCH_THEMES: Record<TactileSwitchTheme, SwitchThemeColors> = {
  "emerald-photon": {
    name: "Emerald Photon",
    accent: "#10E599",
    glowColor: "rgba(16, 229, 153, 0.45)",
    canvasBg: "#E3E7EE",
    gridColor: "rgba(175, 186, 205, 0.4)",
    outerCavityBg: "linear-gradient(145deg, #DFE4EC 0%, #EAEEF5 100%)",
    outerBevelShadow:
      "inset 3px 3.5px 7px rgba(150, 163, 184, 0.65), " +
      "inset -3px -3.5px 7px rgba(255, 255, 255, 0.95), " +
      "inset 1px 1px 2px rgba(135, 148, 170, 0.45), " +
      "inset -1px -1px 2px rgba(255, 255, 255, 1)",
    trackOffBg: "linear-gradient(180deg, #BAC3D2 0%, #CDD5E2 25%, #E2E8F1 65%, #F0F4F9 100%)",
    trackOffShadow:
      "inset 0 4px 6px -1px rgba(45, 60, 85, 0.48), " +
      "inset 0 1px 2px rgba(45, 60, 85, 0.35), " +
      "inset 2px 0 4px rgba(55, 70, 95, 0.25), " +
      "inset -2px 0 4px rgba(55, 70, 95, 0.25), " +
      "inset 0 -1px 2px rgba(255, 255, 255, 0.95)",
    trackOnGradient:
      "linear-gradient(180deg, #02B86E 0%, #0AD483 35%, #2BF3A4 80%, #56F8B6 100%)",
    trackOnShadow:
      "inset 0 4px 6px -1px rgba(0, 80, 45, 0.65), " +
      "inset 0 1px 2px rgba(0, 60, 32, 0.45), " +
      "inset 2px 0 4px rgba(0, 75, 40, 0.45), " +
      "inset 0 -1px 2px rgba(255, 255, 255, 0.65), " +
      "0 0 12px rgba(16, 229, 153, 0.4)",
  },
  "cyber-cyan": {
    name: "Cyber Laser Cyan",
    accent: "#00E5FF",
    glowColor: "rgba(0, 229, 255, 0.5)",
    canvasBg: "#E0E6EE",
    gridColor: "rgba(160, 180, 210, 0.4)",
    outerCavityBg: "linear-gradient(145deg, #DCE2EB 0%, #E8EEF7 100%)",
    outerBevelShadow:
      "inset 3px 3.5px 7px rgba(140, 155, 178, 0.6), " +
      "inset -3px -3.5px 7px rgba(255, 255, 255, 0.95)",
    trackOffBg: "linear-gradient(180deg, #BAC3D2 0%, #CDD5E2 25%, #E2E8F1 65%, #F0F4F9 100%)",
    trackOffShadow:
      "inset 0 4px 6px -1px rgba(45, 60, 85, 0.48), " +
      "inset 0 -1px 2px rgba(255, 255, 255, 0.95)",
    trackOnGradient:
      "linear-gradient(180deg, #0088CC 0%, #00B4E6 35%, #00E5FF 80%, #6EFAFF 100%)",
    trackOnShadow:
      "inset 0 4px 6px -1px rgba(0, 60, 100, 0.65), " +
      "inset 0 -1px 2px rgba(255, 255, 255, 0.65), " +
      "0 0 12px rgba(0, 229, 255, 0.4)",
  },
  "magma-orange": {
    name: "UI Pirate Magma",
    accent: "#FF5B04",
    glowColor: "rgba(255, 91, 4, 0.5)",
    canvasBg: "#EAE4DF",
    gridColor: "rgba(200, 180, 170, 0.4)",
    outerCavityBg: "linear-gradient(145deg, #E5DFD8 0%, #F2ECE5 100%)",
    outerBevelShadow:
      "inset 3px 3.5px 7px rgba(175, 155, 145, 0.6), " +
      "inset -3px -3.5px 7px rgba(255, 255, 255, 0.95)",
    trackOffBg: "linear-gradient(180deg, #C7BCB3 0%, #D8CFC7 25%, #E9E2DC 65%, #F5EFEB 100%)",
    trackOffShadow:
      "inset 0 4px 6px -1px rgba(85, 60, 50, 0.48), " +
      "inset 0 -1px 2px rgba(255, 255, 255, 0.95)",
    trackOnGradient:
      "linear-gradient(180deg, #C43600 0%, #E64A00 35%, #FF5B04 80%, #FFA066 100%)",
    trackOnShadow:
      "inset 0 4px 6px -1px rgba(100, 25, 0, 0.65), " +
      "inset 0 -1px 2px rgba(255, 255, 255, 0.65), " +
      "0 0 12px rgba(255, 91, 4, 0.4)",
  },
  "dark-obsidian": {
    name: "Dark Obsidian Stealth",
    accent: "#424242",
    glowColor: "rgba(66, 66, 66, 0.45)",
    canvasBg: "#0B0D11",
    gridColor: "rgba(255, 255, 255, 0.06)",
    outerCavityBg: "linear-gradient(150deg, #14171E 0%, #0D0F14 100%)",
    outerBevelShadow:
      "inset 3px 3.5px 8px rgba(0, 0, 0, 0.95), " +
      "inset -2px -2px 6px rgba(255, 255, 255, 0.06), " +
      "inset 0 1px 1px rgba(255, 255, 255, 0.14)",
    trackOffBg: "linear-gradient(180deg, #050608 0%, #0B0D11 30%, #12151B 70%, #181C24 100%)",
    trackOffShadow:
      "inset 0 6px 8px -1px rgba(0, 0, 0, 0.98), " +
      "inset 0 -1px 2px rgba(255, 255, 255, 0.06), " +
      "inset 2px 0 4px rgba(0, 0, 0, 0.8)",
    trackOnGradient:
      "linear-gradient(180deg, #242424 0%, #424242 45%, #626262 100%)",
    trackOnShadow:
      "inset 0 4px 6px -1px rgba(0, 0, 0, 0.95), " +
      "inset 0 -1px 2px rgba(255, 255, 255, 0.25), " +
      "0 0 12px rgba(66, 66, 66, 0.35)",
    knobBg: "linear-gradient(164deg, #222630 15%, #181B22 42%, #0F1116 78%)",
    knobShadow:
      "0 4px 12px rgba(0, 0, 0, 0.85), 0 1px 3px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.2), inset 0 -1px 2px rgba(0, 0, 0, 0.95)",
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
      "inset 0 10px 14px -2px rgba(75, 50, 95, 0.48), " +
      "inset 0 -2px 3px rgba(255, 255, 255, 0.95)",
    trackOnGradient:
      "linear-gradient(180deg, #7E22CE 0%, #9333EA 35%, #C084FC 80%, #E9D5FF 100%)",
    trackOnShadow:
      "inset 0 10px 14px -2px rgba(60, 10, 100, 0.6), " +
      "inset 0 -2px 3px rgba(255, 255, 255, 0.65), " +
      "0 0 20px rgba(192, 132, 252, 0.4)",
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
      "inset 0 10px 14px -2px rgba(90, 75, 45, 0.48), " +
      "inset 0 -2px 3px rgba(255, 255, 255, 0.95)",
    trackOnGradient:
      "linear-gradient(180deg, #B45309 0%, #D97706 35%, #FBBF24 80%, #FDE68A 100%)",
    trackOnShadow:
      "inset 0 10px 14px -2px rgba(90, 40, 0, 0.65), " +
      "inset 0 -2px 3px rgba(255, 255, 255, 0.65), " +
      "0 0 20px rgba(251, 191, 36, 0.4)",
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
 * Photorealistic vector implementation with sculpted dual-dome handle and OFF / ON states.
 */
export const TactileNeumorphicSwitch: React.FC<TactileNeumorphicSwitchProps> = ({
  checked: controlledChecked,
  defaultChecked = false,
  stateMode = "interactive",
  onChange,
  theme = "emerald-photon",
  size = "md",
  disabled = false,
  label,
  showGrid = true,
  customActiveColor,
  className = "",
}) => {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);

  const isChecked =
    stateMode === "off" || stateMode === "standerd"
      ? false
      : stateMode === "on" || stateMode === "hover"
        ? true
        : controlledChecked !== undefined
          ? controlledChecked
          : internalChecked;

  const cfg = SIZES[size] || SIZES.md;
  const t = SWITCH_THEMES[theme] || SWITCH_THEMES["emerald-photon"];

  const activeGradient = customActiveColor
    ? `linear-gradient(180deg, ${adjustHex(customActiveColor, -25)} 0%, ${customActiveColor} 45%, ${adjustHex(
        customActiveColor,
        35
      )} 100%)`
    : t.trackOnGradient;

  const activeShadow = customActiveColor
    ? `inset 0 4px 6px -1px ${adjustHex(customActiveColor, -60)}b0, inset 0 1px 2px rgba(0, 0, 0, 0.25), inset 0 -1px 2px rgba(255, 255, 255, 0.65), 0 0 16px ${customActiveColor}80`
    : t.trackOnShadow;

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

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center select-none ${className}`}
    >
      {/* ── Outer Recessed Bevel Cavity Frame ──────────────────────── */}
      <div
        role="switch"
        aria-checked={isChecked}
        aria-label={label || "Tactile Neumorphic Switch"}
        tabIndex={disabled ? -1 : 0}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={`relative flex items-center justify-center cursor-pointer outline-none transition-transform duration-200 ${disabled
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
          {/* ON State Illuminated Channel Fill */}
          <motion.div
            initial={false}
            animate={{
              opacity: isChecked ? 1 : 0,
              width: isChecked ? `${cfg.trackW}px` : `${cfg.trackH}px`,
            }}
            transition={SPRING_PHYSICS}
            className="absolute left-0 top-0 bottom-0 pointer-events-none"
            style={{
              borderRadius: `${cfg.trackH / 2}px`,
              background: activeGradient,
              boxShadow: activeShadow,
            }}
          >
            {/* Subtle Balanced Ambient Specular Edge */}
            <div
              className="absolute inset-x-3 top-0 h-[1.5px] pointer-events-none rounded-full"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0) 100%)",
              }}
            />
          </motion.div>
        </div>

        {/* ── Sculpted Dual-Dome Handle ─────────────── */}
        {/* Dark Obsidian Precision Color Matrix Shader */}
        <svg className="absolute w-0 h-0 pointer-events-none opacity-0" aria-hidden="true">
          <filter id="obsidian-dome-filter" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="
                0.16 0 0 0 0.02
                0 0.17 0 0 0.02
                0 0 0.19 0 0.03
                0 0 0 1 0
              "
            />
          </filter>
        </svg>

        {/* Knob Handle Frame */}
        <motion.div
          initial={false}
          animate={{
            x: isChecked ? cfg.travel / 2 : -cfg.travel / 2,
          }}
          whileTap={{
            scale: 0.965,
          }}
          transition={SPRING_PHYSICS}
          className="absolute z-20 pointer-events-none flex items-center justify-center overflow-hidden"
          style={{
            width: cfg.knobW,
            height: cfg.knobH,
            borderRadius: cfg.knobH / 2,
            background:
              t.knobBg ||
              "linear-gradient(164.05deg, rgb(246, 247, 247) 15.95%, rgb(245, 246, 248) 42.19%, rgb(160, 172, 193) 78.77%)",
            boxShadow:
              t.knobShadow ||
              `${(2.891 * cfg.scale).toFixed(2)}px ${(3.614 * cfg.scale).toFixed(2)}px ${(
                5.059 * cfg.scale
              ).toFixed(2)}px 0px rgba(35,46,64,0.22), 0px ${(0.723 * cfg.scale).toFixed(2)}px ${(
                0.361 * cfg.scale
              ).toFixed(2)}px 0px rgba(0,23,55,0.1), inset 0px ${(-0.181 * cfg.scale).toFixed(2)}px ${(
                0.361 * cfg.scale
              ).toFixed(2)}px 0px rgba(0,14,38,0.07)`,
            filter: t.knobFilter || "none",
          }}
        >
          {/* Symmetrical Dual-Dome Pads */}
          <div
            className="flex items-center justify-center w-full h-full select-none"
            style={{
              gap: `${cfg.gap}px`,
            }}
          >
            {/* Left Dome Asset */}
            <div
              className="relative shrink-0 flex items-center justify-center select-none"
              style={{
                width: `${cfg.ellipseW}px`,
                height: `${cfg.ellipseH}px`,
              }}
            >
              <img
                src={ELLIPSE_1624_URI}
                alt=""
                className="block w-full h-full object-contain pointer-events-none select-none"
                style={{
                  transform: "scale(1.04)",
                  filter: theme === "dark-obsidian" ? "url(#obsidian-dome-filter)" : "none",
                }}
                draggable={false}
              />
            </div>

            {/* Right Dome Asset */}
            <div
              className="relative shrink-0 flex items-center justify-center select-none"
              style={{
                width: `${cfg.ellipseW}px`,
                height: `${cfg.ellipseH}px`,
                transform: "scaleY(-1) rotate(180deg)",
              }}
            >
              <img
                src={ELLIPSE_1625_URI}
                alt=""
                className="block w-full h-full object-contain pointer-events-none select-none"
                style={{
                  transform: "scale(1.04)",
                  filter: theme === "dark-obsidian" ? "url(#obsidian-dome-filter)" : "none",
                }}
                draggable={false}
              />
            </div>
          </div>
        </motion.div>
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
