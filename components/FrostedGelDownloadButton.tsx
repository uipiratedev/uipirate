"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export type FrostedGelTheme =
  | "default-blue"
  | "cyber-violet"
  | "emerald-matrix"
  | "magma-orange"
  | "dark-obsidian"
  | "titanium-gold";

export type FrostedGelStateMode = "interactive" | "standerd" | "hover";
export type FrostedGelSize = "xs" | "sm" | "md" | "lg" | "xl";
export type FrostedGelIcon =
  | "cloud-download"
  | "download"
  | "arrow-down"
  | "upload"
  | "folder"
  | "package"
  | "save";

/** Stroke-path sets for the gel tile icon (24x24 viewBox, currentColor stroke). */
const FROSTED_GEL_ICON_PATHS: Record<FrostedGelIcon, React.ReactNode> = {
  "cloud-download": (
    <>
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="M12 12v9" />
      <path d="m8 17 4 4 4-4" />
    </>
  ),
  download: (
    <>
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
    </>
  ),
  "arrow-down": (
    <>
      <path d="M12 5v14" />
      <path d="m5 12 7 7 7-7" />
    </>
  ),
  upload: (
    <>
      <path d="M12 21V9" />
      <path d="m7 14 5-5 5 5" />
      <path d="M5 3h14" />
    </>
  ),
  folder: (
    <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
  ),
  package: (
    <>
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </>
  ),
  save: (
    <>
      <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
      <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" />
      <path d="M7 3v4a1 1 0 0 0 1 1h7" />
    </>
  ),
};

export interface FrostedGelThemeConfig {
  name: string;
  badge: string;
  isDark?: boolean;
  accentColor: string;
  textColor: string;
  pillBg: string;
  pillBorder: string;
  baseGradient: string;
  glowPrimary: string;
  glowSecondary: string;
  gelBg: string;
  gelBorder: string;
  cableColor: string;
  pinstripeColor: string;
}

export const FROSTED_GEL_THEMES: Record<FrostedGelTheme, FrostedGelThemeConfig> = {
  "default-blue": {
    name: "Default Electric Blue (1:1)",
    badge: "1:1 Spec",
    isDark: false,
    accentColor: "#2626FF",
    textColor: "#2626FF",
    pillBg: "#F9F9F9",
    pillBorder: "rgba(255, 255, 255, 0.9)",
    baseGradient:
      "linear-gradient(90deg, #FFFFFF 0%, #9FACE1 4.8%, #AFBCFF 80.8%, #5C76FF 95.3%, #E8EDFF 100%)",
    glowPrimary: "rgba(0, 123, 254, 0.35)",
    glowSecondary: "rgba(0, 42, 254, 0.22)",
    gelBg: "linear-gradient(182deg, rgba(241, 241, 241, 0.55) 27%, rgba(153, 153, 153, 0.1) 150%)",
    gelBorder: "rgba(255, 255, 255, 0.75)",
    cableColor: "rgba(0, 42, 254, 0.18)",
    pinstripeColor: "rgba(0, 42, 254, 0.04)",
  },
  "cyber-violet": {
    name: "Neon Cyber Violet",
    badge: "Ultraviolet",
    isDark: false,
    accentColor: "#7C3AED",
    textColor: "#6D28D9",
    pillBg: "#FAF5FF",
    pillBorder: "rgba(255, 255, 255, 0.9)",
    baseGradient:
      "linear-gradient(90deg, #FFFFFF 0%, #D8B4FE 4.8%, #C084FC 80.8%, #9333EA 95.3%, #F3E8FF 100%)",
    glowPrimary: "rgba(147, 51, 234, 0.35)",
    glowSecondary: "rgba(124, 58, 237, 0.22)",
    gelBg: "linear-gradient(182deg, rgba(245, 235, 255, 0.55) 27%, rgba(192, 132, 252, 0.15) 150%)",
    gelBorder: "rgba(255, 255, 255, 0.75)",
    cableColor: "rgba(124, 58, 237, 0.2)",
    pinstripeColor: "rgba(124, 58, 237, 0.04)",
  },
  "emerald-matrix": {
    name: "Bio Emerald Gel",
    badge: "Bio Data",
    isDark: false,
    accentColor: "#059669",
    textColor: "#047857",
    pillBg: "#F0FDF4",
    pillBorder: "rgba(255, 255, 255, 0.9)",
    baseGradient:
      "linear-gradient(90deg, #FFFFFF 0%, #A7F3D0 4.8%, #6EE7B7 80.8%, #10B981 95.3%, #ECFDF5 100%)",
    glowPrimary: "rgba(16, 185, 129, 0.35)",
    glowSecondary: "rgba(5, 150, 105, 0.22)",
    gelBg: "linear-gradient(182deg, rgba(236, 253, 245, 0.55) 27%, rgba(52, 211, 153, 0.15) 150%)",
    gelBorder: "rgba(255, 255, 255, 0.75)",
    cableColor: "rgba(5, 150, 105, 0.2)",
    pinstripeColor: "rgba(16, 185, 129, 0.04)",
  },
  "magma-orange": {
    name: "Sunset Flame Orange",
    badge: "Flame Glow",
    isDark: false,
    accentColor: "#EA580C",
    textColor: "#C2410C",
    pillBg: "#FFF7ED",
    pillBorder: "rgba(255, 255, 255, 0.9)",
    baseGradient:
      "linear-gradient(90deg, #FFFFFF 0%, #FED7AA 4.8%, #FDBA74 80.8%, #F97316 95.3%, #FFEDD5 100%)",
    glowPrimary: "rgba(249, 115, 22, 0.35)",
    glowSecondary: "rgba(234, 88, 12, 0.22)",
    gelBg: "linear-gradient(182deg, rgba(255, 247, 237, 0.55) 27%, rgba(251, 146, 60, 0.15) 150%)",
    gelBorder: "rgba(255, 255, 255, 0.75)",
    cableColor: "rgba(234, 88, 12, 0.2)",
    pinstripeColor: "rgba(249, 115, 22, 0.04)",
  },
  "dark-obsidian": {
    name: "Obsidian Cyan Pulse",
    badge: "Dark Mode",
    isDark: true,
    accentColor: "#00F0FF",
    textColor: "#00F0FF",
    pillBg: "#0F172A",
    pillBorder: "rgba(255, 255, 255, 0.15)",
    baseGradient:
      "linear-gradient(90deg, #1E293B 0%, #0369A1 4.8%, #0284C7 80.8%, #00F0FF 95.3%, #0C4A6E 100%)",
    glowPrimary: "rgba(0, 240, 255, 0.4)",
    glowSecondary: "rgba(2, 132, 199, 0.28)",
    gelBg: "linear-gradient(182deg, rgba(30, 41, 59, 0.6) 27%, rgba(14, 165, 233, 0.2) 150%)",
    gelBorder: "rgba(0, 240, 255, 0.35)",
    cableColor: "rgba(0, 240, 255, 0.25)",
    pinstripeColor: "rgba(255, 255, 255, 0.03)",
  },
  "titanium-gold": {
    name: "Prestige Titanium Gold",
    badge: "Luxury Gold",
    isDark: false,
    accentColor: "#B45309",
    textColor: "#92400E",
    pillBg: "#FEFCE8",
    pillBorder: "rgba(255, 255, 255, 0.9)",
    baseGradient:
      "linear-gradient(90deg, #FFFFFF 0%, #FEF08A 4.8%, #FDE047 80.8%, #EAB308 95.3%, #FEF9C3 100%)",
    glowPrimary: "rgba(234, 179, 8, 0.35)",
    glowSecondary: "rgba(180, 83, 9, 0.22)",
    gelBg: "linear-gradient(182deg, rgba(254, 252, 232, 0.55) 27%, rgba(250, 204, 21, 0.15) 150%)",
    gelBorder: "rgba(255, 255, 255, 0.75)",
    cableColor: "rgba(180, 83, 9, 0.2)",
    pinstripeColor: "rgba(234, 179, 8, 0.04)",
  },
};

export interface FrostedGelDownloadButtonProps {
  /** Text label in pill (default: "Download now") */
  label?: string;
  /** Visual state mode: 'interactive' (cohesive group hover), 'standerd' (Spec 4604:126), 'hover' (Spec 4604:152) */
  stateMode?: FrostedGelStateMode;
  /** Theme preset */
  theme?: FrostedGelTheme;
  /** Scale sizing */
  size?: FrostedGelSize;
  /** Icon shown inside the frosted gel tile */
  icon?: FrostedGelIcon;
  /** Display background decorative technical trace cables */
  showCables?: boolean;
  /** Unified click handler */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Main button click handler */
  onDownloadClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Cloud icon button click handler */
  onIconClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Custom additional className */
  className?: string;
}

export function FrostedGelDownloadButton({
  label = "Download now",
  stateMode = "interactive",
  theme = "default-blue",
  size = "md",
  icon = "cloud-download",
  showCables = true,
  onClick,
  onDownloadClick,
  onIconClick,
  disabled = false,
  className = "",
}: FrostedGelDownloadButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const t = FROSTED_GEL_THEMES[theme] || FROSTED_GEL_THEMES["default-blue"];

  const sizeScales = {
    xs: 0.64,
    sm: 0.8,
    md: 1,
    lg: 1.2,
    xl: 1.44,
  };
  const scaleFactor = sizeScales[size] || 1;

  // Unified active visual state (Pill and Gel Tile animate together)
  const isVisualHover =
    stateMode === "hover" ||
    (stateMode === "interactive" && (isHovered || isPressed));

  return (
    <div
      className={`relative select-none inline-flex items-center justify-center isolate ${className}`}
      style={
        scaleFactor !== 1
          ? { transform: `scale(${scaleFactor})`, transformOrigin: "center center" }
          : undefined
      }
    >
      <div className="relative min-w-[560px] h-[240px] flex items-center justify-center flex-none">

        {/* ================================================================= */}
        {/* 1. Background Technical Trace Cable Lines (Spec 4604:153-156)    */}
        {/* ================================================================= */}
        {showCables && (
          <div className="absolute inset-0 pointer-events-none overflow-visible flex items-center justify-center">
            {/* Left Cable Cluster */}
            <svg
              className="absolute left-[-10px] top-[95px] w-[160px] h-[50px] pointer-events-none"
              viewBox="0 0 160 50"
              fill="none"
            >
              <path
                d="M0 5C50 5 80 25 160 25"
                stroke={t.cableColor}
                strokeWidth="1.5"
              />
              <path
                d="M10 45C60 45 90 25 160 25"
                stroke={t.cableColor}
                strokeWidth="1.2"
                strokeDasharray="4 3"
              />
              <path
                d="M0 25C40 25 80 25 160 25"
                stroke={t.cableColor}
                strokeWidth="1"
                opacity="0.6"
              />
            </svg>

            {/* Right Cable Cluster */}
            <svg
              className="absolute right-[-10px] top-[95px] w-[160px] h-[50px] pointer-events-none"
              viewBox="0 0 160 50"
              fill="none"
            >
              <path
                d="M0 25C80 25 110 5 160 5"
                stroke={t.cableColor}
                strokeWidth="1.5"
              />
              <path
                d="M0 25C70 25 100 45 150 45"
                stroke={t.cableColor}
                strokeWidth="1.2"
                strokeDasharray="4 3"
              />
              <path
                d="M0 25C80 25 120 25 160 25"
                stroke={t.cableColor}
                strokeWidth="1"
                opacity="0.6"
              />
            </svg>
          </div>
        )}

        {/* ================================================================= */}
        {/* 2. UNIFIED INTERACTIVE CTA WRAPPER (Cohesive Hover & Glow)        */}
        {/* ================================================================= */}
        <div
          onMouseEnter={() => !disabled && setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            setIsPressed(false);
          }}
          onMouseDown={() => !disabled && setIsPressed(true)}
          onMouseUp={() => !disabled && setIsPressed(false)}
          onTouchStart={() => !disabled && setIsPressed(true)}
          onTouchEnd={() => !disabled && setIsPressed(false)}
          className="relative flex items-center justify-center cursor-pointer group"
        >
          {/* =============================================================== */}
          {/* Main "Download Now" Ceramic Pill Button (Spec 4604:158/160)     */}
          {/* =============================================================== */}
          <div className="relative mr-[14px] flex items-center justify-center">
            {/* Volumetric Underglow Flare (Spec 4604:152) */}
            <motion.div
              initial={false}
              animate={{
                opacity: isVisualHover ? 1 : 0,
                scale: isPressed ? 0.98 : isVisualHover ? 1.05 : 0.95,
              }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="absolute inset-0 -bottom-[14px] rounded-[24px] pointer-events-none transform-gpu"
              style={{
                background: `radial-gradient(ellipse at 50% 90%, ${t.glowPrimary} 0%, ${t.glowSecondary} 60%, transparent 80%)`,
                filter: "blur(20px)",
                willChange: "transform, opacity",
              }}
            />

            {/* Blue Gradient Base Bevel / Tray Layer (Spec 4604:158) */}
            <div
              className="absolute -inset-x-[1px] bottom-[-6px] h-[61px] rounded-[16.5px] pointer-events-none"
              style={{
                background: t.baseGradient,
                boxShadow: isVisualHover
                  ? `0px 1px 0px 0px rgba(255,255,255,0.6), 0px 14px 28px 0px ${t.glowPrimary}`
                  : "0px 1px 0px 0px rgba(255,255,255,0.4), 0px 6px 14px 0px rgba(0,42,254,0.15)",
              }}
            >
              <div
                className="absolute inset-0 rounded-[inherit]"
                style={{
                  boxShadow:
                    "inset -1.65px -1.65px 0px 0px rgba(0,119,255,0.15), inset 0px 3.3px 9.9px 0px rgba(0,0,0,0.1)",
                }}
              />
            </div>

            {/* Elevated Ceramic Pill Surface (Spec 4604:160) */}
            <motion.button
              type="button"
              disabled={disabled}
              onClick={(e) => {
                onDownloadClick?.(e);
                onClick?.(e);
              }}
              animate={{
                y: isPressed ? 2 : isVisualHover ? -4 : 0,
                scale: isPressed ? 0.985 : 1,
              }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 24,
                mass: 0.6,
              }}
              className="relative cursor-pointer outline-none border-[1.65px] border-solid flex items-center justify-center min-w-[254px] h-[74px] rounded-[16.5px] px-[32px] py-[23px] overflow-hidden"
              style={{
                borderColor: t.pillBorder,
                backgroundColor: t.pillBg,
                boxShadow: isVisualHover
                  ? `0px 1px 0px 0px #00aff5, 0px 14px 26px 0px ${t.glowSecondary}, inset 0px -3.3px 0px 0px rgba(0,0,0,0.15), inset 0px 3.3px 0px 1.2px white`
                  : `0px 1px 0px 0px ${t.accentColor}, 0px 8px 16px 0px rgba(0,42,254,0.18), inset 0px -3.3px 0px 0px rgba(0,0,0,0.18), inset 0px 3.3px 0px 1.2px white`,
              }}
              aria-label={label}
            >
              {/* Specular Diagonal Sheen Accent */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/70 via-transparent to-black/[0.04]" />

              {/* Pill Label Text */}
              <p
                className="relative z-10 font-sans font-medium text-[20px] tracking-tight whitespace-nowrap capitalize transition-colors duration-200"
                style={{
                  color: t.textColor,
                  textShadow: isVisualHover
                    ? `0px 0px 10px ${t.glowPrimary}`
                    : "none",
                }}
              >
                {label}
              </p>
            </motion.button>
          </div>

          {/* =============================================================== */}
          {/* Frosted Glass Cloud Download Tile (Spec 4604:172 / 4604:140)    */}
          {/* =============================================================== */}
          <div className="relative flex items-center justify-center">
            {/* Volumetric Cyan/Blue Flare under Gel Tile */}
            <motion.div
              initial={false}
              animate={{
                opacity: isVisualHover ? 1 : 0.25,
                scale: isPressed ? 0.95 : isVisualHover ? 1.12 : 0.95,
              }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="absolute inset-0 -bottom-[12px] rounded-[22px] pointer-events-none transform-gpu"
              style={{
                background: `radial-gradient(circle, ${t.glowPrimary} 0%, ${t.glowSecondary} 60%, transparent 80%)`,
                filter: "blur(18px)",
                willChange: "transform, opacity",
              }}
            />

            {/* Frosted Gel Glass Button */}
            <motion.button
              type="button"
              disabled={disabled}
              onClick={(e) => {
                onIconClick?.(e);
                onClick?.(e);
              }}
              animate={{
                y: isPressed ? 2 : isVisualHover ? -4 : 0,
                scale: isPressed ? 0.97 : 1,
              }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 24,
                mass: 0.6,
              }}
              className="relative cursor-pointer outline-none flex items-center justify-center w-[76px] h-[74px] rounded-[16.5px] border-[1.65px] border-solid overflow-hidden backdrop-blur-md"
              style={{
                borderColor: t.gelBorder,
                background: t.gelBg,
                boxShadow: isVisualHover
                  ? `0px 1px 0px 0px white, 0px 16px 32px 0px ${t.glowPrimary}, inset 0px 1.65px 0px 0px rgba(255,255,255,0.9), inset 0px -3.3px 0px 0px rgba(0,42,254,0.15)`
                  : `0px 1px 0px 0px rgba(255,255,255,0.5), 0px 8px 18px 0px ${t.glowSecondary}, inset 0px 1.65px 0px 0px rgba(255,255,255,0.7), inset 0px -3.3px 0px 0px rgba(0,42,254,0.25)`,
              }}
              aria-label="Download Cloud Icon"
            >
              {/* Multi-layered Internal Glass Refraction Rings (Spec 4604:173-176) */}
              <div
                className="absolute -top-[10px] left-[6px] w-[56px] h-[116px] rounded-full pointer-events-none opacity-40 mix-blend-overlay"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 70%)",
                  transform: "rotate(-90deg)",
                }}
              />
              <div
                className="absolute top-[4px] left-[16px] w-[40px] h-[98px] rounded-full pointer-events-none opacity-50 mix-blend-color-dodge"
                style={{
                  background: `radial-gradient(ellipse at center, ${t.accentColor} 0%, transparent 70%)`,
                  transform: "rotate(-90deg)",
                }}
              />

              {/* Gel Tile Icon (Spec 4604:180) — configurable via `icon` prop */}
              <div className="relative z-10 flex items-center justify-center">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={t.accentColor}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform duration-300"
                  style={{
                    filter: isVisualHover
                      ? `drop-shadow(0px 0px 6px ${t.accentColor})`
                      : "none",
                    transform: isPressed ? "translateY(2px)" : "none",
                  }}
                >
                  {FROSTED_GEL_ICON_PATHS[icon] ?? FROSTED_GEL_ICON_PATHS["cloud-download"]}
                </svg>
              </div>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FrostedGelDownloadButton;
