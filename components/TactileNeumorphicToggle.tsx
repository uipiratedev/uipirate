"use client";

import React, { useState } from "react";
import { motion, Transition } from "framer-motion";

export type NeumorphicToggleTheme =
  | "figma-silver"
  | "dark-obsidian"
  | "cyber-cyan"
  | "emerald-glow"
  | "magma-orange"
  | "hyper-violet";

export type NeumorphicToggleSize = "xs" | "sm" | "md" | "lg" | "xl";
export type TactileToggleStateMode = "interactive" | "off" | "on";

export interface TactileNeumorphicToggleProps {
  /** Controlled active state (true = ON, false = OFF) */
  checked?: boolean;
  /** Initial state if uncontrolled */
  defaultChecked?: boolean;
  /** Fixed state mode preview: 'interactive' (default), 'off' (Figma 1:7), 'on' (Figma 1:8) */
  stateMode?: TactileToggleStateMode;
  /** Change event handler */
  onChange?: (checked: boolean) => void;
  /** Visual color theme preset */
  theme?: NeumorphicToggleTheme;
  /** Size preset */
  size?: NeumorphicToggleSize;
  /** Disabled state */
  disabled?: boolean;
  /** Optional accessible label */
  label?: string;
  /** Show on/off icon glyphs inside track */
  showIcons?: boolean;
  /** Additional CSS class name */
  className?: string;
}

const SIZE_CONFIG: Record<
  NeumorphicToggleSize,
  {
    width: number;
    height: number;
    thumbWidth: number;
    thumbHeight: number;
    padding: number;
    iconSize: number;
    fontSize: string;
  }
> = {
  xs: {
    width: 54,
    height: 22,
    thumbWidth: 24,
    thumbHeight: 18,
    padding: 2,
    iconSize: 8,
    fontSize: "text-[8px]",
  },
  sm: {
    width: 68,
    height: 28,
    thumbWidth: 32,
    thumbHeight: 22,
    padding: 3,
    iconSize: 10,
    fontSize: "text-[9px]",
  },
  md: {
    width: 98,
    height: 38,
    thumbWidth: 46,
    thumbHeight: 30,
    padding: 4,
    iconSize: 13,
    fontSize: "text-xs",
  },
  lg: {
    width: 124,
    height: 48,
    thumbWidth: 58,
    thumbHeight: 38,
    padding: 5,
    iconSize: 16,
    fontSize: "text-sm",
  },
  xl: {
    width: 152,
    height: 58,
    thumbWidth: 70,
    thumbHeight: 46,
    padding: 6,
    iconSize: 18,
    fontSize: "text-base",
  },
};

interface ThemeColors {
  trackBg: string;
  trackShadow: string;
  thumbGradient: string;
  thumbShadow: string;
  activeGlow: string;
  accentColor: string;
  indicatorOff: string;
  indicatorOn: string;
  surfaceGlow: string;
}

const THEME_STYLES: Record<NeumorphicToggleTheme, ThemeColors> = {
  "figma-silver": {
    trackBg: "#D8DDE5",
    trackShadow:
      "inset 1.8px 3.25px 2.89px -1.08px rgba(144, 155, 176, 1), " +
      "inset -1.8px -4.34px 2.89px -1.08px rgba(255, 255, 255, 0.7), " +
      "inset 1.8px -4.34px 2.89px -1.08px rgba(255, 255, 255, 0.7), " +
      "inset -7.23px 6.14px 5.42px -7.23px rgba(215, 222, 230, 1), " +
      "inset 8.31px 6.14px 5.42px -7.23px rgba(215, 222, 230, 1)",
    thumbGradient:
      "linear-gradient(135deg, #F6F7F7 0%, #F5F6F8 40%, #A0ACC1 96%)",
    thumbShadow:
      "inset 0 -0.18px 0.36px rgba(0, 14, 38, 0.07), " +
      "0 0.72px 0.36px rgba(0, 23, 55, 0.1), " +
      "2.89px 3.61px 5.06px rgba(35, 46, 64, 0.22)",
    activeGlow: "rgba(99, 140, 214, 0.35)",
    accentColor: "#4B6B94",
    indicatorOff: "#8F9BAE",
    indicatorOn: "#3B82F6",
    surfaceGlow: "rgba(255, 255, 255, 0.8)",
  },
  "dark-obsidian": {
    trackBg: "#16181D",
    trackShadow:
      "inset 2px 3px 5px rgba(0, 0, 0, 0.9), " +
      "inset -1.5px -2px 3px rgba(255, 255, 255, 0.07), " +
      "inset 0 0 10px rgba(0, 0, 0, 0.8)",
    thumbGradient:
      "linear-gradient(135deg, #2D3139 0%, #22262E 40%, #15171C 100%)",
    thumbShadow:
      "inset 0 1px 1px rgba(255, 255, 255, 0.15), " +
      "0 3px 6px rgba(0, 0, 0, 0.6), " +
      "0 1px 2px rgba(0, 0, 0, 0.8)",
    activeGlow: "rgba(255, 255, 255, 0.2)",
    accentColor: "#94A3B8",
    indicatorOff: "#475569",
    indicatorOn: "#F8FAFC",
    surfaceGlow: "rgba(255, 255, 255, 0.1)",
  },
  "cyber-cyan": {
    trackBg: "#0C1E26",
    trackShadow:
      "inset 2px 3px 5px rgba(0, 0, 0, 0.9), " +
      "inset -1.5px -2px 3px rgba(6, 182, 212, 0.15), " +
      "inset 0 0 8px rgba(6, 182, 212, 0.1)",
    thumbGradient:
      "linear-gradient(135deg, #164E63 0%, #0E394A 45%, #082F3B 100%)",
    thumbShadow:
      "inset 0 1px 1px rgba(103, 232, 249, 0.4), " +
      "0 3px 8px rgba(0, 0, 0, 0.6), " +
      "0 0 12px rgba(6, 182, 212, 0.4)",
    activeGlow: "rgba(6, 182, 212, 0.45)",
    accentColor: "#06B6D4",
    indicatorOff: "#155E75",
    indicatorOn: "#22D3EE",
    surfaceGlow: "rgba(34, 211, 238, 0.3)",
  },
  "emerald-glow": {
    trackBg: "#0F241C",
    trackShadow:
      "inset 2px 3px 5px rgba(0, 0, 0, 0.9), " +
      "inset -1.5px -2px 3px rgba(16, 185, 129, 0.15), " +
      "inset 0 0 8px rgba(16, 185, 129, 0.1)",
    thumbGradient:
      "linear-gradient(135deg, #065F46 0%, #064E3B 45%, #022C22 100%)",
    thumbShadow:
      "inset 0 1px 1px rgba(110, 231, 183, 0.4), " +
      "0 3px 8px rgba(0, 0, 0, 0.6), " +
      "0 0 12px rgba(16, 185, 129, 0.4)",
    activeGlow: "rgba(16, 185, 129, 0.45)",
    accentColor: "#10B981",
    indicatorOff: "#065F46",
    indicatorOn: "#34D399",
    surfaceGlow: "rgba(52, 211, 153, 0.3)",
  },
  "magma-orange": {
    trackBg: "#2A140A",
    trackShadow:
      "inset 2px 3px 5px rgba(0, 0, 0, 0.9), " +
      "inset -1.5px -2px 3px rgba(255, 91, 4, 0.2), " +
      "inset 0 0 8px rgba(255, 91, 4, 0.15)",
    thumbGradient:
      "linear-gradient(135deg, #9A3412 0%, #7C2D12 45%, #431407 100%)",
    thumbShadow:
      "inset 0 1px 1px rgba(253, 186, 116, 0.4), " +
      "0 3px 8px rgba(0, 0, 0, 0.6), " +
      "0 0 12px rgba(255, 91, 4, 0.4)",
    activeGlow: "rgba(255, 91, 4, 0.45)",
    accentColor: "#FF5B04",
    indicatorOff: "#7C2D12",
    indicatorOn: "#FB923C",
    surfaceGlow: "rgba(251, 146, 60, 0.3)",
  },
  "hyper-violet": {
    trackBg: "#1F122B",
    trackShadow:
      "inset 2px 3px 5px rgba(0, 0, 0, 0.9), " +
      "inset -1.5px -2px 3px rgba(168, 85, 247, 0.2), " +
      "inset 0 0 8px rgba(168, 85, 247, 0.15)",
    thumbGradient:
      "linear-gradient(135deg, #6B21A8 0%, #581C87 45%, #3B0764 100%)",
    thumbShadow:
      "inset 0 1px 1px rgba(216, 180, 254, 0.4), " +
      "0 3px 8px rgba(0, 0, 0, 0.6), " +
      "0 0 12px rgba(168, 85, 247, 0.4)",
    activeGlow: "rgba(168, 85, 247, 0.45)",
    accentColor: "#A855F7",
    indicatorOff: "#581C87",
    indicatorOn: "#C084FC",
    surfaceGlow: "rgba(192, 132, 252, 0.3)",
  },
};

const SPRING_TRANSITION: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 28,
  mass: 0.8,
};

/**
 * Tactile Neumorphic Pill Toggle Switch
 * 1:1 Pixel-Accurate Implementation from Figma Nodes (1:7 & 1:8 / Frame 47723 & 47727)
 */
export const TactileNeumorphicToggle: React.FC<TactileNeumorphicToggleProps> = ({
  checked: controlledChecked,
  defaultChecked = false,
  stateMode = "interactive",
  onChange,
  theme = "figma-silver",
  size = "md",
  disabled = false,
  label,
  showIcons = true,
  className = "",
}) => {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isControlled = controlledChecked !== undefined;
  const isChecked =
    stateMode === "off"
      ? false
      : stateMode === "on"
        ? true
        : isControlled
          ? controlledChecked
          : internalChecked;

  const config = SIZE_CONFIG[size];
  const themeStyle = THEME_STYLES[theme];

  const travelDistance = config.width - config.thumbWidth - config.padding * 2;

  const handleToggle = () => {
    if (disabled) return;
    const nextVal = !isChecked;
    if (!isControlled) {
      setInternalChecked(nextVal);
    }
    onChange?.(nextVal);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <div
        role="switch"
        aria-checked={isChecked}
        aria-label={label || "Tactile Neumorphic Toggle"}
        tabIndex={disabled ? -1 : 0}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={`relative inline-flex items-center cursor-pointer transition-opacity outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 rounded-full ${disabled ? "opacity-45 cursor-not-allowed" : "active:scale-[0.98]"
          }`}
        style={{
          width: config.width,
          height: config.height,
          backgroundColor: themeStyle.trackBg,
          boxShadow: themeStyle.trackShadow,
          borderRadius: config.height / 2,
          padding: config.padding,
        }}
      >
        {/* Track Etched Indicators (Off Left / On Right) */}
        {showIcons && (
          <div className="absolute inset-0 flex items-center justify-between px-3 pointer-events-none">
            {/* OFF Indicator (Power dot / O) */}
            <motion.div
              animate={{
                opacity: isChecked ? 0.3 : 0.85,
                scale: isChecked ? 0.8 : 1,
              }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
              style={{ width: config.iconSize, height: config.iconSize }}
            >
              <svg
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                <circle
                  cx="8"
                  cy="8"
                  r="5"
                  stroke={themeStyle.indicatorOff}
                  strokeWidth="2"
                  strokeOpacity="0.8"
                />
              </svg>
            </motion.div>

            {/* ON Indicator (Vertical bar / I) */}
            <motion.div
              animate={{
                opacity: isChecked ? 0.95 : 0.25,
                scale: isChecked ? 1 : 0.8,
              }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
              style={{ width: config.iconSize, height: config.iconSize }}
            >
              <svg
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                <path
                  d="M8 3V13"
                  stroke={isChecked ? themeStyle.indicatorOn : themeStyle.indicatorOff}
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
              </svg>
            </motion.div>
          </div>
        )}

        {/* Tactile Sliding Knob */}
        <motion.div
          animate={{
            x: isChecked ? travelDistance : 0,
          }}
          transition={SPRING_TRANSITION}
          className="relative z-10 flex items-center justify-center overflow-hidden"
          style={{
            width: config.thumbWidth,
            height: config.thumbHeight,
            borderRadius: config.thumbHeight / 2,
            background: themeStyle.thumbGradient,
            boxShadow: themeStyle.thumbShadow,
          }}
        >
          {/* Top Bevel Specular Highlight */}
          <div
            className="absolute inset-x-1 top-[1px] h-[35%] pointer-events-none rounded-full"
            style={{
              background:
                "linear-gradient(180deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.1) 100%)",
            }}
          />

          {/* Micro Grip Texture (3 tactile ribs) */}
          <div className="flex items-center gap-[3px] opacity-60">
            <div
              className="w-[1.5px] h-3 rounded-full"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(100,116,139,0.7) 100%)",
              }}
            />
            <div
              className="w-[1.5px] h-3.5 rounded-full"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(100,116,139,0.7) 100%)",
              }}
            />
            <div
              className="w-[1.5px] h-3 rounded-full"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(100,116,139,0.7) 100%)",
              }}
            />
          </div>

          {/* Active Status Glow Reflection */}
          <motion.div
            animate={{
              opacity: isChecked ? 0.8 : 0,
            }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 pointer-events-none rounded-full"
            style={{
              background: `radial-gradient(circle at 50% 100%, ${themeStyle.activeGlow} 0%, transparent 70%)`,
            }}
          />
        </motion.div>
      </div>

      {label && (
        <span
          onClick={handleToggle}
          className={`font-medium cursor-pointer ${config.fontSize} ${disabled
              ? "text-slate-400 cursor-not-allowed"
              : "text-slate-700 dark:text-slate-200"
            }`}
        >
          {label}
        </span>
      )}
    </div>
  );
};

export default TactileNeumorphicToggle;
