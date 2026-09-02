"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export type VintageLeatherTheme = "uipirate" | "pirate" | "heritage" | "obsidian" | "emerald" | "ruby" | "silver";
export type VintageLeatherSize = "xs" | "sm" | "md" | "lg" | "xl";
export type VintageLeatherStateMode = "interactive" | "standerd" | "hover";

export interface VintageLeatherCTAProps {
  /** Text label on the button */
  label?: string;
  /** Visual luxury theme preset */
  theme?: VintageLeatherTheme;
  /** Size scale: "sm" | "md" | "lg" */
  size?: VintageLeatherSize;
  /** Visual state mode: 'interactive' (default hover lift), 'standerd', 'hover' */
  stateMode?: VintageLeatherStateMode;
  /** Whether to show the decorative surface scrollwork patterns (default: true) */
  showOrnaments?: boolean;
  /** Click event handler */
  onClick?: () => void;
  /** Custom scale factor */
  scale?: number;
  /** Additional CSS class names */
  className?: string;
  /** Custom children to override label */
  children?: React.ReactNode;
}

/**
 * Exact Random Small Square Pixel Noise Tile (Figma Nodes 14:304 & 14:332)
 */
const RandomSquareGrain: React.FC<{ color?: string }> = ({ color = "#78562B" }) => (
  <svg
    className="absolute inset-0 size-full pointer-events-none opacity-[0.105] mix-blend-multiply"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern id="leatherSquareNoise" width="28" height="28" patternUnits="userSpaceOnUse">
        <rect x="3" y="4" width="1.6" height="1.6" fill={color} opacity="0.68" />
        <rect x="11" y="9" width="1.8" height="1.8" fill={color} opacity="0.55" />
        <rect x="22" y="3" width="2.2" height="2.2" fill={color} opacity="0.72" />
        <rect x="17" y="16" width="1.6" height="1.6" fill={color} opacity="0.62" />
        <rect x="6" y="22" width="2" height="2" fill={color} opacity="0.68" />
        <rect x="25" y="20" width="1.6" height="1.6" fill={color} opacity="0.55" />
        <rect x="13" y="25" width="1.8" height="1.8" fill={color} opacity="0.62" />
        <rect x="26" y="11" width="1.6" height="1.6" fill={color} opacity="0.5" />
        <rect x="4" y="14" width="1.2" height="1.2" fill="#FFFFFF" opacity="0.45" />
        <rect x="19" y="8" width="1.2" height="1.2" fill="#FFFFFF" opacity="0.4" />
        <rect x="10" y="19" width="1.2" height="1.2" fill="#FFFFFF" opacity="0.45" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#leatherSquareNoise)" />
  </svg>
);

/**
 * 1:1 Pixel-Exact Vector Tracing of Rumble Brave Ornaments from Figma (Nodes 14:334 - 14:338)
 */
const VintageSlabFlourish: React.FC<{ color: string }> = ({ color }) => {
  return (
    <svg
      viewBox="0 0 229 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 size-full pointer-events-none overflow-visible"
      preserveAspectRatio="none"
    >
      {/* ─────────────────────────────────────────────────────────────
          LEFT ORNAMENT (Nodes 14:335 & 14:338)
         ───────────────────────────────────────────────────────────── */}
      <g stroke={color} strokeLinecap="round" strokeLinejoin="round" opacity="0.65">
        {/* Node 14:335 - Elegant Spiral Coil (shifted to top border & ~25% inward) */}
        <path
          d="M -10 24 C 0 12, 12 3, 26 3 C 36 3, 44 9, 40 19 C 37 26, 29 26, 26 22 C 24 18, 28 14, 32 15 C 34 16, 35 18, 34 20"
          strokeWidth="1.5"
        />

        {/* Top Arch Swoop sweeping down toward center */}
        <path
          d="M -4 14 C 16 12, 38 18, 60 28 C 80 38, 94 42, 106 44"
          strokeWidth="1.4"
        />

        {/* Node 14:338 - Bottom Sweeping Leaf Ribbon under "SHOP" (shifted down 75%) */}
        <path
          d="M -8 48 C 16 42, 44 30, 72 32 C 86 33, 98 38, 108 42"
          strokeWidth="1.5"
        />
        <path
          d="M -8 48 C 12 48, 34 40, 58 40 C 76 40, 88 43, 98 46"
          strokeWidth="1.2"
          opacity="0.8"
        />

        {/* Lower Left Corner Crossing Arc (shifted down 75%) */}
        <path
          d="M -4 34 C 8 38, 20 44, 30 48"
          strokeWidth="1.3"
          opacity="0.85"
        />
      </g>

      {/* ─────────────────────────────────────────────────────────────
          RIGHT ORNAMENT (Nodes 14:336 & 14:337: Horizontal Mirror)
         ───────────────────────────────────────────────────────────── */}
      <g stroke={color} strokeLinecap="round" strokeLinejoin="round" opacity="0.65">
        {/* Node 14:336 - Elegant Spiral Coil (shifted to top border & ~25% inward) */}
        <path
          d="M 239 24 C 229 12, 217 3, 203 3 C 193 3, 185 9, 189 19 C 192 26, 200 26, 203 22 C 205 18, 201 14, 197 15 C 195 16, 194 18, 195 20"
          strokeWidth="1.5"
        />

        {/* Top Arch Swoop sweeping down toward center */}
        <path
          d="M 233 14 C 213 12, 191 18, 169 28 C 149 38, 135 42, 123 44"
          strokeWidth="1.4"
        />

        {/* Node 14:337 - Bottom Sweeping Leaf Ribbon under "TIES" (shifted down 75%) */}
        <path
          d="M 237 48 C 213 42, 185 30, 157 32 C 143 33, 131 38, 121 42"
          strokeWidth="1.5"
        />
        <path
          d="M 237 48 C 217 48, 195 40, 171 40 C 153 40, 141 43, 131 46"
          strokeWidth="1.2"
          opacity="0.8"
        />

        {/* Lower Right Corner Crossing Arc (shifted down 75%) */}
        <path
          d="M 233 34 C 221 38, 209 44, 199 48"
          strokeWidth="1.3"
          opacity="0.85"
        />
      </g>
    </svg>
  );
};

/**
 * 1:1 Pixel-Accurate Implementation of Figma Node 14:304
 * Master Button Collection - Vintage Leather & Brass Heritage Embossed Button
 */
export const VintageLeatherCTA: React.FC<VintageLeatherCTAProps> = ({
  label = "Shop ties",
  theme = "heritage",
  size = "md",
  stateMode = "interactive",
  showOrnaments = true,
  onClick,
  scale = 1,
  className = "",
  children,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const isLifted =
    stateMode === "hover"
      ? true
      : stateMode === "standerd"
      ? false
      : isHovered;

  // Theme palettes and lighting
  const themeStyles = {
    uipirate: {
      trayBg: "rgba(255, 91, 4, 0.2)",
      capGradient: "linear-gradient(180deg, #D95304 0%, #B83C00 100%)",
      lipColor: "#7A2600",
      textColor: "#FFE0B2",
      textShadow: "0px -1.5px 0px rgba(0, 0, 0, 0.5)",
      topHighlight: "rgba(255, 161, 20, 0.65)",
      flourishColor: "rgba(100, 30, 0, 0.65)",
      grainColor: "#8C3200",
      dropShadow:
        "0px 54px 50px 0px rgba(60,20,5,0.4), 0px 29.7px 31.9px 0px rgba(60,20,5,0.3), 0px 9.6px 8.7px 0px rgba(60,20,5,0.2)",
    },
    pirate: {
      trayBg: "rgba(255, 91, 4, 0.2)",
      capGradient: "linear-gradient(180deg, #D95304 0%, #B83C00 100%)",
      lipColor: "#7A2600",
      textColor: "#FFE0B2",
      textShadow: "0px -1.5px 0px rgba(0, 0, 0, 0.5)",
      topHighlight: "rgba(255, 161, 20, 0.65)",
      flourishColor: "rgba(100, 30, 0, 0.65)",
      grainColor: "#8C3200",
      dropShadow:
        "0px 54px 50px 0px rgba(60,20,5,0.4), 0px 29.7px 31.9px 0px rgba(60,20,5,0.3), 0px 9.6px 8.7px 0px rgba(60,20,5,0.2)",
    },
    heritage: {
      trayBg: "rgba(113, 83, 49, 0.2)",
      capGradient: "linear-gradient(180deg, #B5996D 0%, #967952 100%)",
      lipColor: "#715331",
      textColor: "#E5DEC9",
      textShadow: "0px -1.5px 0px rgba(0, 0, 0, 0.3)",
      topHighlight: "rgba(255, 255, 255, 0.5)",
      flourishColor: "rgba(113, 83, 49, 0.6)",
      grainColor: "#78562B",
      dropShadow:
        "0px 54px 50px 0px rgba(55,42,12,0.33), 0px 29.7px 31.9px 0px rgba(55,42,12,0.23), 0px 19.7px 21.9px 0px rgba(55,42,12,0.23), 0px 9.6px 8.7px 0px rgba(55,42,12,0.18), 0px 4.7px 4.3px 0px rgba(55,42,12,0.15), 0px 1.9px 1.7px 0px rgba(55,42,12,0.1)",
    },
    obsidian: {
      trayBg: "rgba(0, 0, 0, 0.35)",
      capGradient: "linear-gradient(180deg, #2A2D34 0%, #17181C 100%)",
      lipColor: "#0D0E11",
      textColor: "#F1E5AC",
      textShadow: "0px -1.5px 0px rgba(0, 0, 0, 0.8)",
      topHighlight: "rgba(255, 255, 255, 0.25)",
      flourishColor: "rgba(212, 175, 55, 0.35)",
      grainColor: "#000000",
      dropShadow:
        "0px 40px 45px 0px rgba(0,0,0,0.6), 0px 20px 25px 0px rgba(0,0,0,0.4), 0px 8px 10px 0px rgba(0,0,0,0.3)",
    },
    emerald: {
      trayBg: "rgba(10, 40, 25, 0.3)",
      capGradient: "linear-gradient(180deg, #1B4D3E 0%, #0F3327 100%)",
      lipColor: "#082119",
      textColor: "#D1FAE5",
      textShadow: "0px -1.5px 0px rgba(0, 0, 0, 0.5)",
      topHighlight: "rgba(255, 255, 255, 0.35)",
      flourishColor: "rgba(5, 40, 30, 0.55)",
      grainColor: "#052015",
      dropShadow:
        "0px 40px 45px 0px rgba(6,30,18,0.5), 0px 20px 25px 0px rgba(6,30,18,0.35), 0px 8px 10px 0px rgba(6,30,18,0.25)",
    },
    ruby: {
      trayBg: "rgba(60, 15, 20, 0.3)",
      capGradient: "linear-gradient(180deg, #881337 0%, #5F0E25 100%)",
      lipColor: "#3F0716",
      textColor: "#FFE4E6",
      textShadow: "0px -1.5px 0px rgba(0, 0, 0, 0.6)",
      topHighlight: "rgba(255, 255, 255, 0.35)",
      flourishColor: "rgba(60, 10, 25, 0.55)",
      grainColor: "#2A040E",
      dropShadow:
        "0px 40px 45px 0px rgba(50,5,15,0.5), 0px 20px 25px 0px rgba(50,5,15,0.35), 0px 8px 10px 0px rgba(50,5,15,0.25)",
    },
    silver: {
      trayBg: "rgba(160, 160, 160, 0.25)",
      capGradient: "linear-gradient(180deg, #D4D4D8 0%, #A1A1AA 100%)",
      lipColor: "#71717A",
      textColor: "#27272A",
      textShadow: "0px 1px 0px rgba(255, 255, 255, 0.8)",
      topHighlight: "rgba(255, 255, 255, 0.8)",
      flourishColor: "rgba(100, 100, 110, 0.45)",
      grainColor: "#3F3F46",
      dropShadow:
        "0px 35px 40px 0px rgba(0,0,0,0.2), 0px 18px 20px 0px rgba(0,0,0,0.15), 0px 6px 8px 0px rgba(0,0,0,0.1)",
    },
  }[theme];

  // Size specifications
  // 5-tier sizing (xs | sm | md | lg | xl): xs renders the sm layout at 0.8x, xl renders lg at 1.2x.
  const __baseSize = size === "xs" ? "sm" : size === "xl" ? "lg" : size;
  const __extraSizeScale = size === "xs" ? 0.8 : size === "xl" ? 1.2 : 1;
  const __wrapSize = (node: React.ReactElement): React.ReactElement =>
    __extraSizeScale === 1 ? node : (
      <span style={{ display: "inline-flex", transform: `scale(${__extraSizeScale})`, transformOrigin: "center center" }}>
        {node}
      </span>
    );

  const sizeConfig = {
    sm: {
      trayPadding: "pb-[5px] pt-[4px] px-[5px]",
      capPadding: "pb-[14px] pt-[10px] px-[44px]",
      fontSize: "text-[13px] tracking-[1.3px]",
      lipHeight: 4,
    },
    md: {
      trayPadding: "pb-[8px] pt-[6px] px-[8px]",
      capPadding: "pb-[18px] pt-[12px] px-[60px]",
      fontSize: "text-[16px] tracking-[1.6px]",
      lipHeight: 6,
    },
    lg: {
      trayPadding: "pb-[10px] pt-[8px] px-[10px]",
      capPadding: "pb-[22px] pt-[15px] px-[76px]",
      fontSize: "text-[19px] tracking-[2px]",
      lipHeight: 8,
    },
  }[__baseSize];

  return __wrapSize(
    <motion.button
      type="button"
      onClick={onClick}
      onHoverStart={() => stateMode === "interactive" && setIsHovered(true)}
      onHoverEnd={() => stateMode === "interactive" && setIsHovered(false)}
      animate={{
        scale: isLifted ? 1.02 : 1,
      }}
      whileHover={stateMode === "interactive" ? { scale: 1.02 } : undefined}
      whileTap={stateMode === "interactive" ? { scale: 0.98, y: 2 } : undefined}
      transition={{ type: "spring", stiffness: 450, damping: 28 }}
      className={`relative inline-flex items-center justify-center select-none cursor-pointer outline-none ${className}`}
      style={{
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: "center center",
      }}
    >
      {/* ─────────────────────────────────────────────────────────────
          OUTER RECESSED ENCLOSURE TRAY (Figma Node 14:331)
         ───────────────────────────────────────────────────────────── */}
      <div
        className={`relative flex flex-col items-center justify-center ${sizeConfig.trayPadding} rounded-[1px]`}
        style={{
          backgroundColor: themeStyles.trayBg,
          boxShadow: "inset 0px 0px 3px 0px rgba(0, 0, 0, 0.3)",
        }}
      >
        {/* ─────────────────────────────────────────────────────────────
            TACTILE EMBOSSED BRASS/LEATHER SLAB (Figma Node 14:332)
           ───────────────────────────────────────────────────────────── */}
        <div
          className={`relative flex items-center justify-center ${sizeConfig.capPadding} rounded-[2px] overflow-hidden transition-shadow duration-200`}
          style={{
            backgroundImage: themeStyles.capGradient,
            boxShadow: `${themeStyles.dropShadow}, inset 0px 1px 0px 0px ${themeStyles.topHighlight}, inset 0px -${sizeConfig.lipHeight}px 0px 0px ${themeStyles.lipColor}`,
          }}
        >
          {/* Exact Random Small Square Pixel Noise Texture */}
          <RandomSquareGrain color={themeStyles.grainColor} />

          {/* EXACT FIGMA ORNAMENTAL SCROLLWORK FLOURISH OVERLAY */}
          {showOrnaments && <VintageSlabFlourish color={themeStyles.flourishColor} />}

          {/* Letterpress Etched Text Label */}
          {children || (
            <span
              className={`relative z-10 font-medium uppercase ${sizeConfig.fontSize} text-center whitespace-nowrap`}
              style={{
                fontFamily: "var(--font-jakarta), var(--font-sans), 'Avenir Next', sans-serif",
                color: themeStyles.textColor,
                textShadow: themeStyles.textShadow,
              }}
            >
              {label}
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
};

export default VintageLeatherCTA;
