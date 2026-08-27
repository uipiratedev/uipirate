"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export type IsometricReviveTheme =
  | "figma"
  | "amber"
  | "cyan"
  | "emerald"
  | "violet"
  | "crimson"
  | "uipirate";

export type IsometricReviveStateMode = "interactive" | "standerd" | "hover";
export type IsometricReviveSize = "sm" | "md" | "lg";

export interface IsometricReviveThemeConfig {
  name: string;
  badge: string;
  glowColor: string;
  indicatorColor: string;
  indicatorGlow: string;
  gradLeft1: string;
  gradLeft2: string;
  gradLeft3: string;
  gradRight1: string;
  gradRight2: string;
  gradRight3: string;
}

export const ISOMETRIC_REVIVE_THEMES: Record<
  IsometricReviveTheme,
  IsometricReviveThemeConfig
> = {
  figma: {
    name: "Figma Master Obsidian (1:1)",
    badge: "1:1 Figma",
    glowColor: "#FFFFFF",
    indicatorColor: "#FFA000",
    indicatorGlow: "rgba(255, 160, 0, 0.9)",
    gradLeft1: "#505561",
    gradLeft2: "#191B1F",
    gradLeft3: "#2C2F37",
    gradRight1: "#212328",
    gradRight2: "#191B1F",
    gradRight3: "#2C2F37",
  },
  amber: {
    name: "Cyber Amber Core",
    badge: "Amber Flare",
    glowColor: "#FFA000",
    indicatorColor: "#FFB020",
    indicatorGlow: "rgba(255, 176, 32, 0.9)",
    gradLeft1: "#6B4310",
    gradLeft2: "#2A1808",
    gradLeft3: "#40260C",
    gradRight1: "#3D240B",
    gradRight2: "#2A1808",
    gradRight3: "#40260C",
  },
  cyan: {
    name: "Obsidian Cyan Pulse",
    badge: "Electric Cyan",
    glowColor: "#00E5FF",
    indicatorColor: "#00F0FF",
    indicatorGlow: "rgba(0, 240, 255, 0.9)",
    gradLeft1: "#1E4F63",
    gradLeft2: "#0D222B",
    gradLeft3: "#163847",
    gradRight1: "#163544",
    gradRight2: "#0D222B",
    gradRight3: "#163847",
  },
  emerald: {
    name: "Matrix Emerald",
    badge: "Bio Emerald",
    glowColor: "#10B981",
    indicatorColor: "#34D399",
    indicatorGlow: "rgba(52, 211, 153, 0.9)",
    gradLeft1: "#1E543B",
    gradLeft2: "#0B2117",
    gradLeft3: "#143D2A",
    gradRight1: "#153C2A",
    gradRight2: "#0B2117",
    gradRight3: "#143D2A",
  },
  violet: {
    name: "Ultraviolet Ray",
    badge: "Neon Violet",
    glowColor: "#C084FC",
    indicatorColor: "#E879F9",
    indicatorGlow: "rgba(232, 121, 249, 0.9)",
    gradLeft1: "#4E2675",
    gradLeft2: "#200E33",
    gradLeft3: "#391A57",
    gradRight1: "#371754",
    gradRight2: "#200E33",
    gradRight3: "#391A57",
  },
  crimson: {
    name: "Inferno Crimson",
    badge: "Magma Red",
    glowColor: "#F87171",
    indicatorColor: "#EF4444",
    indicatorGlow: "rgba(239, 68, 68, 0.9)",
    gradLeft1: "#5C1E1E",
    gradLeft2: "#2B0B0B",
    gradLeft3: "#451414",
    gradRight1: "#401111",
    gradRight2: "#2B0B0B",
    gradRight3: "#451414",
  },
  uipirate: {
    name: "UI Pirate Sunset Flame",
    badge: "Brand Flame",
    glowColor: "#FF5B04",
    indicatorColor: "#FF7300",
    indicatorGlow: "rgba(255, 115, 0, 0.9)",
    gradLeft1: "#6E2D0D",
    gradLeft2: "#2C1004",
    gradLeft3: "#4A1B07",
    gradRight1: "#451906",
    gradRight2: "#2C1004",
    gradRight3: "#4A1B07",
  },
};

export interface IsometricReviveButtonProps {
  /** Text label displayed inside the button face (default: "Revive Now") */
  label?: string;
  /** Visual state mode: 'interactive' (hover to depress & illuminate), 'standerd' (Figma 115:5957 fixed), 'hover' (Figma 115:6002 fixed) */
  stateMode?: IsometricReviveStateMode;
  /** Theme preset */
  theme?: IsometricReviveTheme;
  /** Scale sizing */
  size?: IsometricReviveSize;
  /** Display isometric grid guidelines and metadata timestamp (as in Figma artboard) */
  showGrid?: boolean;
  /** Optional custom date/time timestamp string */
  timestampText?: string;
  /** Click handler */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Custom additional className */
  className?: string;
}

const ISO_TRANSFORM = "rotate(30deg) skewX(-30deg) scaleY(0.866025)";
const ISO_TIMESTAMP_TRANSFORM = "rotate(-30deg) skewX(30deg) scaleY(0.866025)";

export function IsometricReviveButton({
  label = "Revive Now",
  stateMode = "interactive",
  theme = "figma",
  size = "md",
  showGrid = true,
  timestampText = "tus apr 29\n10:05 am",
  onClick,
  disabled = false,
  className = "",
}: IsometricReviveButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const t = ISOMETRIC_REVIVE_THEMES[theme] || ISOMETRIC_REVIVE_THEMES.figma;

  // Determine active visual state
  const isVisualHover =
    stateMode === "hover" ||
    (stateMode === "interactive" && (isHovered || isPressed));

  // Scale factors
  const sizeScales = {
    sm: 0.75,
    md: 1,
    lg: 1.25,
  };
  const scaleFactor = sizeScales[size] || 1;

  // Exact vertical coordinates from Figma artboard (580x580):
  // STANDERD (115:5957): top is 186px
  // HOVER (115:6002): top is 216px (+30px down)
  const standerdTop = 186;
  const hoverTop = 216;
  const pressedTop = 220;

  let currentTop = standerdTop;
  if (stateMode === "standerd") {
    currentTop = standerdTop;
  } else if (stateMode === "hover") {
    currentTop = hoverTop;
  } else if (isPressed) {
    currentTop = pressedTop;
  } else if (isHovered) {
    currentTop = hoverTop;
  }

  const idPrefix = React.useId().replace(/:/g, "_");

  return (
    <div
      className={`relative select-none flex items-center justify-center pointer-events-none ${className}`}
      style={{
        width: `${580 * scaleFactor}px`,
        height: `${580 * scaleFactor}px`,
      }}
    >
      <div
        className="relative w-[580px] h-[580px] origin-center flex-none pointer-events-none"
        style={{ transform: `scale(${scaleFactor})` }}
      >
        {/* ================================================================= */}
        {/* 1. Background Technical Grid & Timestamp (Figma Node 115:5958)    */}
        {/* ================================================================= */}
        {showGrid && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Timestamp (115:5960) */}
            <div className="-translate-x-full -translate-y-1/2 absolute flex h-[74.5px] items-center justify-center left-[calc(50%+235px)] top-[140px] w-[130px]">
              <div style={{ transform: ISO_TIMESTAMP_TRANSFORM }} className="flex-none">
                <div className="flex flex-col font-mono font-medium justify-center text-[12px] text-white/30 text-right uppercase tracking-wider leading-[16px]">
                  {timestampText.split("\n").map((line, idx) => (
                    <p key={idx} className={idx === 0 ? "mb-0" : ""}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Crosshair Diamonds (115:5961 & 115:5962) */}
            <div className="absolute flex h-[5.66px] items-center justify-center left-[285px] top-[40px] w-[9.8px]">
              <div className="border border-white/30 rounded-[1px] size-[8px]" style={{ transform: "scaleX(1.22) scaleY(0.71) rotate(45deg)" }} />
            </div>
            <div className="absolute flex h-[5.66px] items-center justify-center left-[285px] top-[515px] w-[9.8px]">
              <div className="border border-white/30 rounded-[1px] size-[8px]" style={{ transform: "scaleX(1.22) scaleY(0.71) rotate(45deg)" }} />
            </div>

            {/* Isometric Axis Diagonal Grid Lines */}
            <div className="absolute left-[30px] top-[160px] w-[520px] h-[320px] pointer-events-none opacity-15">
              <svg className="w-full h-full stroke-white" fill="none">
                <line x1="0" y1="300" x2="520" y2="0" strokeWidth="0.75" strokeDasharray="3 3" />
                <line x1="0" y1="0" x2="520" y2="300" strokeWidth="0.75" strokeDasharray="3 3" />
              </svg>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 2. Base Glass Surface Tray (Figma 115:5967 / 115:6012)            */}
        {/* ================================================================= */}
        <div className="absolute flex h-[166.704px] items-center justify-center left-[150px] top-[222px] w-[288.739px] pointer-events-none z-0">
          <div style={{ transform: ISO_TRANSFORM }} className="flex-none">
            <div
              className="h-[114.411px] overflow-hidden relative rounded-[20px] w-[218.996px] bg-[rgba(255,255,255,0.01)] border-[0.5px] border-[rgba(255,255,255,0.3)] border-solid transition-shadow duration-500"
              style={{
                boxShadow: isVisualHover
                  ? "0px -1px 24px 0px rgba(255,255,255,0.1), 0px -1px 4px 0px rgba(255,255,255,0.15)"
                  : "-24px 20px 9px 0px rgba(0,0,0,0.01), -15px 13px 8px 0px rgba(0,0,0,0.09), -9px 7px 7px 0px rgba(0,0,0,0.3), -4px 3px 5px 0px rgba(0,0,0,0.51), -1px 1px 3px 0px rgba(0,0,0,0.59)",
              }}
            >
              {/* Internal cast shadow of floating button on idle */}
              <div
                className={`absolute flex items-center justify-center size-[268.729px] transition-opacity duration-500 ${
                  isVisualHover ? "opacity-10" : "opacity-80"
                }`}
                style={{ left: isVisualHover ? "-15.23px" : "4.77px", top: isVisualHover ? "-67.77px" : "-47.77px" }}
              >
                <div style={{ transform: "rotate(-45deg) scaleX(0.82) scaleY(1.41)" }} className="flex-none">
                  <div className="h-[138.728px] w-[225.168px] bg-black/90 rounded-[18px] blur-[10px]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Base Glass Rim Stroke (Figma 115:5978 / 115:6023) */}
        <div className="absolute flex h-[166.704px] items-center justify-center left-[150px] top-[219px] w-[288.739px] pointer-events-none z-0">
          <div style={{ transform: ISO_TRANSFORM }} className="flex-none">
            <div className="bg-[rgba(255,255,255,0.03)] border-[0.5px] border-solid border-white/40 h-[114.411px] relative rounded-[20px] w-[218.996px]" />
          </div>
        </div>

        {/* ================================================================= */}
        {/* 3. Underglow Light Bed Layer (Figma Node 115:6026 - Z-INDEX 1)     */}
        {/* Sits at left: 182px, top: 246.21px BEHIND the 3D button solid body */}
        {/* ================================================================= */}
        <motion.div
          initial={false}
          animate={{
            opacity: isVisualHover ? 1 : 0,
          }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="absolute flex h-[129.674px] items-center justify-center left-[182px] top-[246.21px] w-[224.602px] pointer-events-none z-1"
        >
          <div style={{ transform: ISO_TRANSFORM }} className="flex-none relative">
            {/* Primary soft diffused underglow (Figma blur 20px) */}
            <div
              className="h-[79.582px] w-[179.766px] rounded-[18px]"
              style={{
                backgroundColor: t.glowColor,
                filter: "blur(18px)",
                opacity: 0.95,
              }}
            />
          </div>
        </motion.div>

        {/* ================================================================= */}
        {/* 4. Floating 3D Extruded Button (Z-INDEX 10)                       */}
        {/* Solid opaque body covers light bed; corner stays black & crisp    */}
        {/* ================================================================= */}
        <motion.div
          initial={false}
          animate={{
            top: `${currentTop}px`,
          }}
          transition={{
            type: "spring",
            stiffness: 450,
            damping: 28,
            mass: 0.75,
          }}
          className="absolute left-[180.88px] w-[225.168px] h-[138.728px] pointer-events-auto z-10"
        >
          {/* Interactive Button Target covering the 3D button */}
          <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            onMouseEnter={() => !disabled && setIsHovered(true)}
            onMouseLeave={() => {
              setIsHovered(false);
              setIsPressed(false);
            }}
            onMouseDown={() => !disabled && setIsPressed(true)}
            onMouseUp={() => !disabled && setIsPressed(false)}
            className="w-full h-full relative cursor-pointer outline-none border-none bg-transparent p-0 m-0 text-left"
            aria-label={label}
          >
            {/* SVG Defs for 3D bevels */}
            <svg width="0" height="0" className="absolute">
              <defs>
                <linearGradient id={`${idPrefix}_leftExtrude`} x1="0" y1="47.5" x2="131.26" y2="47.5" gradientUnits="userSpaceOnUse">
                  <stop stopColor={t.gradLeft1} />
                  <stop offset="0.0336" stopColor="#050607" />
                  <stop offset="0.293" stopColor={t.gradLeft2} />
                  <stop offset="0.662" stopColor={t.gradLeft3} />
                  <stop offset="0.954" stopColor="#16181B" />
                  <stop offset="0.996" stopColor="#212329" />
                </linearGradient>

                <linearGradient id={`${idPrefix}_rightExtrude`} x1="-0.295" y1="24" x2="75.74" y2="24.364" gradientUnits="userSpaceOnUse">
                  <stop stopColor={t.gradRight1} />
                  <stop offset="0.0972" stopColor="#050607" />
                  <stop offset="0.293" stopColor={t.gradRight2} />
                  <stop offset="0.662" stopColor={t.gradRight3} />
                  <stop offset="0.954" stopColor="#16181B" />
                  <stop offset="0.996" stopColor="#212329" />
                </linearGradient>
              </defs>
            </svg>

            {/* Left/Front 3D Extrusion Solid Bevel Wall (Figma 115:5995 / 115:6037) */}
            <div className="absolute h-[95px] left-[9.13px] top-[40px] w-[131.26px] pointer-events-none z-10">
              <svg width="131.26" height="95" viewBox="0 0 131.26 95" fill="none" className="block size-full">
                <path
                  d="M0 0C0 3.51472 2.4676 6.6967 6.45703 9L131.26 81.0498L131.165 95L6.45703 23C2.4676 20.6967 0 17.5147 0 14V0Z"
                  fill={`url(#${idPrefix}_leftExtrude)`}
                />
              </svg>
            </div>

            {/* Right 3D Extrusion Solid Bevel Wall & Front Corner (Figma 115:5998 / 115:6040) */}
            {/* Fully opaque dark obsidian covering corner so front corner stays black */}
            <div className="absolute h-[48.728px] left-[140.29px] top-[90px] w-[75.744px] pointer-events-none z-10">
              <svg width="75.744" height="48.728" viewBox="0 0 75.744 48.728" fill="none" className="block size-full">
                <path
                  d="M31.1807 45C22.5714 49.9706 8.60927 49.9706 0 45V31C8.60927 35.9706 22.5714 35.9706 31.1807 31V45ZM69.2861 23L31.1816 45V31L69.2861 9V23ZM75.7441 14C75.7441 17.5147 73.2765 20.6967 69.2871 23V9C73.2765 6.6967 75.7441 3.51468 75.7441 0V14Z"
                  fill={`url(#${idPrefix}_rightExtrude)`}
                />
              </svg>
            </div>

            {/* Button Base Face Cavity (Figma 115:5984 / 115:6030) */}
            <div className="absolute flex h-[130px] items-center justify-center left-0 top-0 w-[225.167px] pointer-events-none z-10">
              <div style={{ transform: ISO_TRANSFORM }} className="flex-none">
                <div className="border-[0.5px] border-[rgba(255,255,255,0.2)] border-solid h-[80px] relative rounded-[18px] w-[180px]">
                  <div className="absolute bg-[#0d1015] inset-0 rounded-[18px]" />
                  <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.25),inset_0px_7px_15px_4px_black]" />
                </div>
              </div>
            </div>

            {/* Button Top Face Surface (Figma 115:5985 / 115:6031 - Z-INDEX 20) */}
            <div className="absolute flex h-[129.674px] items-center justify-center left-0 top-[0.21px] w-[224.602px] pointer-events-none z-20">
              <div style={{ transform: ISO_TRANSFORM }} className="flex-none">
                <div className="h-[79.582px] overflow-hidden relative rounded-[18px] w-[179.766px]">
                  {/* Obsidian Background */}
                  <div className="absolute bg-[#0d1015] inset-0 pointer-events-none rounded-[18px]" />

                  {/* Text: Revive Now (Figma 115:5986 & 115:6032) - Brockmann Oblique/Italic */}
                  <p
                    className="absolute capitalize font-sans font-medium italic left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[20px] whitespace-nowrap transition-all duration-300 pointer-events-none select-none"
                    style={{
                      color: "#FFFFFF",
                      opacity: isVisualHover ? 1 : 0.3,
                      textShadow: isVisualHover
                        ? "0px 0px 8px rgba(255,255,255,0.7), 0px 0px 18px rgba(255,255,255,0.35)"
                        : "0px 0px 8px rgba(255,255,255,0.45)",
                      letterSpacing: "0.01em",
                    }}
                  >
                    {label}
                  </p>

                  {/* Specular Diagonal Sheen (Figma 115:5987 / Vector 8) */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.16] via-white/[0.02] to-transparent pointer-events-none opacity-80" />

                  {/* Amber Chevron (Figma 115:5988 / 115:6034) */}
                  <div className="absolute left-[18.64px] top-[18.95px] pointer-events-none">
                    <div
                      className="transition-all duration-300"
                      style={{
                        filter: isVisualHover
                          ? `drop-shadow(0px 0px 5px ${t.indicatorGlow})`
                          : "none",
                      }}
                    >
                      <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                        <path
                          d="M1 1.5L4 4.5L7 1.5"
                          stroke={t.indicatorColor}
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeOpacity={isVisualHover ? 1 : 0.35}
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Inner Cavity Bevel & Rim Lip */}
                  <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.25),inset_0px_7px_15px_4px_black,inset_0px_0px_0px_5px_black]" />
                </div>
              </div>
            </div>
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default IsometricReviveButton;
