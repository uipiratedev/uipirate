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
  knobFilter?: string;
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
      "linear-gradient(90deg, #02B86E 0%, #0AD483 35%, #2BF3A4 80%, #56F8B6 100%)",
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
      "linear-gradient(90deg, #0088CC 0%, #00B4E6 35%, #00E5FF 80%, #6EFAFF 100%)",
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
      "linear-gradient(90deg, #C43600 0%, #E64A00 35%, #FF5B04 80%, #FFA066 100%)",
    trackOnShadow:
      "inset 0 4px 6px -1px rgba(100, 25, 0, 0.65), " +
      "inset 0 -1px 2px rgba(255, 255, 255, 0.65), " +
      "0 0 12px rgba(255, 91, 4, 0.4)",
  },
  "dark-obsidian": {
    name: "Dark Obsidian Stealth",
    accent: "#38BDF8",
    glowColor: "rgba(56, 189, 248, 0.45)",
    canvasBg: "#111317",
    gridColor: "rgba(255, 255, 255, 0.05)",
    outerCavityBg: "linear-gradient(145deg, #15181E 0%, #1A1E26 100%)",
    outerBevelShadow:
      "inset 3px 3.5px 7px rgba(0, 0, 0, 0.8), " +
      "inset -3px -3.5px 7px rgba(255, 255, 255, 0.08)",
    trackOffBg: "linear-gradient(180deg, #07080B 0%, #101217 25%, #181B22 65%, #222630 100%)",
    trackOffShadow:
      "inset 0 10px 14px -2px rgba(0, 0, 0, 0.88), " +
      "inset 0 -2px 3px rgba(255, 255, 255, 0.1)",
    trackOnGradient:
      "linear-gradient(90deg, #0369A1 0%, #0284C7 35%, #38BDF8 80%, #BAE6FD 100%)",
    trackOnShadow:
      "inset 0 10px 14px -2px rgba(0, 0, 0, 0.8), " +
      "0 0 22px rgba(56, 189, 248, 0.4)",
    knobFilter: "brightness(0.3) contrast(1.2)",
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
      "linear-gradient(90deg, #7E22CE 0%, #9333EA 35%, #C084FC 80%, #E9D5FF 100%)",
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
      "linear-gradient(90deg, #B45309 0%, #D97706 35%, #FBBF24 80%, #FDE68A 100%)",
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
 * Exact 1:1 Vector & Asset Implementation of Figma Nodes 20:7232 (OFF) & 20:7248 (ON)
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
              width: isChecked ? `${cfg.trackW}px` : "0px",
              opacity: isChecked ? 1 : 0,
            }}
            transition={SPRING_PHYSICS}
            className="absolute left-0 top-0 bottom-0 pointer-events-none"
            style={{
              borderRadius: `${cfg.trackH / 2}px`,
              background: t.trackOnGradient,
              boxShadow: t.trackOnShadow,
            }}
          >
            {/* Internal Optical Refraction Specular Ray */}
            <div
              className="absolute inset-x-3 top-[2px] h-[35%] pointer-events-none rounded-full"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0) 100%)",
              }}
            />
          </motion.div>
        </div>

        {/* ── 1:1 Figma Master Sculpted Dual-Dome Handle ─────────────── */}
        <motion.div
          initial={false}
          animate={{
            x: isChecked ? cfg.travel / 2 : -cfg.travel / 2,
          }}
          transition={SPRING_PHYSICS}
          className="absolute z-20 pointer-events-none flex items-center justify-center overflow-hidden"
          style={{
            width: cfg.knobW,
            height: cfg.knobH,
            borderRadius: cfg.knobH / 2,
            background:
              "linear-gradient(164.05deg, rgb(246, 247, 247) 15.95%, rgb(245, 246, 248) 42.19%, rgb(160, 172, 193) 78.77%)",
            boxShadow: `${(2.891 * cfg.scale).toFixed(2)}px ${(3.614 * cfg.scale).toFixed(2)}px ${(
              5.059 * cfg.scale
            ).toFixed(2)}px 0px rgba(35,46,64,0.22), 0px ${(0.723 * cfg.scale).toFixed(2)}px ${(
              0.361 * cfg.scale
            ).toFixed(2)}px 0px rgba(0,23,55,0.1), inset 0px ${(-0.181 * cfg.scale).toFixed(2)}px ${(
              0.361 * cfg.scale
            ).toFixed(2)}px 0px rgba(0,14,38,0.07)`,
            filter: t.knobFilter || "none",
          }}
        >
          {/* Symmetrical Dual-Dome Pads (Figma Node 20:7244) */}
          <div
            className="flex items-center justify-center w-full h-full"
            style={{
              gap: `${cfg.gap}px`,
            }}
          >
            {/* Left Dome */}
            <div
              className="relative shrink-0 flex items-center justify-center select-none"
              style={{
                width: `${cfg.ellipseW}px`,
                height: `${cfg.ellipseH}px`,
              }}
            >
              <img
                src="/assets/tactile-switch/ellipse1624.png"
                alt=""
                className="block w-full h-full object-contain pointer-events-none select-none"
                style={{
                  transform: "scale(1.02)",
                }}
                draggable={false}
              />
            </div>

            {/* Right Dome (180deg flipped as in Figma) */}
            <div
              className="relative shrink-0 flex items-center justify-center select-none"
              style={{
                width: `${cfg.ellipseW}px`,
                height: `${cfg.ellipseH}px`,
                transform: "scaleY(-1) rotate(180deg)",
              }}
            >
              <img
                src="/assets/tactile-switch/ellipse1625.png"
                alt=""
                className="block w-full h-full object-contain pointer-events-none select-none"
                style={{
                  transform: "scale(1.02)",
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
