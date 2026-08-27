"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export type VintageLeatherTheme = "heritage" | "obsidian" | "emerald" | "ruby" | "silver";
export type VintageLeatherSize = "sm" | "md" | "lg";

export interface VintageLeatherCTAProps {
  /** Text label on the button */
  label?: string;
  /** Visual luxury theme preset */
  theme?: VintageLeatherTheme;
  /** Size scale: "sm" | "md" | "lg" */
  size?: VintageLeatherSize;
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
        {/* Node 14:335 - Elegant Spiral Coil Curling Inward */}
        <path
          d="M 0 35 C 10 24, 22 14, 34 14 C 44 14, 52 20, 48 30 C 45 37, 37 37, 34 33 C 32 29, 36 25, 40 26 C 42 27, 43 29, 42 31"
          strokeWidth="1.5"
        />

        {/* Top Arch Swoop sweeping down toward center */}
        <path
          d="M 0 10 C 18 8, 38 12, 58 22 C 78 32, 92 38, 106 38"
          strokeWidth="1.4"
        />

        {/* Node 14:338 - Bottom Sweeping Leaf Ribbon under "SHOP" */}
        <path
          d="M 0 42 C 22 36, 44 24, 72 26 C 85 27, 98 32, 108 36"
          strokeWidth="1.5"
        />
        <path
          d="M 0 42 C 18 42, 38 34, 60 34 C 76 34, 88 37, 98 40"
          strokeWidth="1.2"
          opacity="0.8"
        />

        {/* Lower Left Corner Crossing Arc */}
        <path
          d="M 0 26 C 12 30, 24 36, 32 42"
          strokeWidth="1.3"
          opacity="0.85"
        />
      </g>

      {/* ─────────────────────────────────────────────────────────────
          RIGHT ORNAMENT (Nodes 14:336 & 14:337: Horizontal Mirror)
         ───────────────────────────────────────────────────────────── */}
      <g stroke={color} strokeLinecap="round" strokeLinejoin="round" opacity="0.65">
        {/* Node 14:336 - Elegant Spiral Coil Curling Inward */}
        <path
          d="M 229 35 C 219 24, 207 14, 195 14 C 185 14, 177 20, 181 30 C 184 37, 192 37, 195 33 C 197 29, 193 25, 189 26 C 187 27, 186 29, 187 31"
          strokeWidth="1.5"
        />

        {/* Top Arch Swoop sweeping down toward center */}
        <path
          d="M 229 10 C 211 8, 191 12, 171 22 C 151 32, 137 38, 123 38"
          strokeWidth="1.4"
        />

        {/* Node 14:337 - Bottom Sweeping Leaf Ribbon under "TIES" */}
        <path
          d="M 229 42 C 207 36, 185 24, 157 26 C 144 27, 131 32, 121 36"
          strokeWidth="1.5"
        />
        <path
          d="M 229 42 C 211 42, 191 34, 169 34 C 153 34, 141 37, 131 40"
          strokeWidth="1.2"
          opacity="0.8"
        />

        {/* Lower Right Corner Crossing Arc */}
        <path
          d="M 229 26 C 217 30, 205 36, 197 42"
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
  showOrnaments = true,
  onClick,
  scale = 1,
  className = "",
  children,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Theme palettes and lighting
  const themeStyles = {
    heritage: {
      trayBg: "rgba(113, 83, 49, 0.2)",
      capGradient: "linear-gradient(180deg, #B5996D 0%, #967952 100%)",
      lipColor: "#715331",
      textColor: "#E5DEC9",
      textShadow: "0px -1.5px 0px rgba(0, 0, 0, 0.3)",
      topHighlight: "rgba(255, 255, 255, 0.5)",
      flourishColor: "rgba(113, 83, 49, 0.6)",
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
      dropShadow:
        "0px 35px 40px 0px rgba(0,0,0,0.2), 0px 18px 20px 0px rgba(0,0,0,0.15), 0px 6px 8px 0px rgba(0,0,0,0.1)",
    },
  }[theme];

  // Size specifications
  const sizeConfig = {
    sm: {
      trayPadding: "pb-[5px] pt-[4px] px-[5px]",
      capPadding: "pb-[14px] pt-[10px] px-[44px]",
      fontSize: "text-[13px] tracking-[1.3px]",
      lipHeight: isPressed ? 2 : 4,
      pressOffset: 2,
    },
    md: {
      trayPadding: "pb-[8px] pt-[6px] px-[8px]",
      capPadding: "pb-[18px] pt-[12px] px-[60px]",
      fontSize: "text-[16px] tracking-[1.6px]",
      lipHeight: isPressed ? 2 : 6,
      pressOffset: 4,
    },
    lg: {
      trayPadding: "pb-[10px] pt-[8px] px-[10px]",
      capPadding: "pb-[22px] pt-[15px] px-[76px]",
      fontSize: "text-[19px] tracking-[2px]",
      lipHeight: isPressed ? 3 : 8,
      pressOffset: 5,
    },
  }[size];

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 450, damping: 25 }}
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
        <motion.div
          animate={{
            y: isPressed ? sizeConfig.pressOffset : 0,
          }}
          transition={{ type: "spring", stiffness: 600, damping: 30 }}
          className={`relative flex items-center justify-center ${sizeConfig.capPadding} rounded-[2px] overflow-hidden`}
          style={{
            backgroundImage: themeStyles.capGradient,
            boxShadow: isPressed
              ? `inset 0px 1px 0px 0px ${themeStyles.topHighlight}, inset 0px -${sizeConfig.lipHeight}px 0px 0px ${themeStyles.lipColor}`
              : `${themeStyles.dropShadow}, inset 0px 1px 0px 0px ${themeStyles.topHighlight}, inset 0px -${sizeConfig.lipHeight}px 0px 0px ${themeStyles.lipColor}`,
          }}
        >
          {/* Subtle Organic Micro-Stippling (NO grid squares) */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.05] mix-blend-multiply"
            style={{
              backgroundImage:
                "radial-gradient(#000000 0.5px, transparent 0.5px)",
              backgroundSize: "4px 4px",
            }}
          />

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
        </motion.div>
      </div>
    </motion.button>
  );
};

export default VintageLeatherCTA;
