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
  | "uipirate"
  | "pearl-light"
  | "gold-luxury";

export type IsometricReviveAngle =
  | "iso-left"
  | "iso-right"
  | "axonometric-top"
  | "tilt-dynamic";

export type IsometricReviveStateMode = "interactive" | "standerd" | "hover";
export type IsometricReviveSize = "xs" | "sm" | "md" | "lg" | "xl";
export type IsometricGlowIntensity = "subtle" | "vibrant" | "hyper";

export interface IsometricReviveThemeConfig {
  name: string;
  badge: string;
  isLightMode?: boolean;
  bodyBg: string;
  bodyBorder: string;
  textColor: string;
  textGlow: string;
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
    bodyBg: "#0D1015",
    bodyBorder: "rgba(255, 255, 255, 0.2)",
    textColor: "#FFFFFF",
    textGlow: "rgba(255, 255, 255, 0.7)",
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
    bodyBg: "#0E0C0A",
    bodyBorder: "rgba(255, 176, 32, 0.3)",
    textColor: "#FFE6C2",
    textGlow: "rgba(255, 176, 32, 0.8)",
    glowColor: "#FFA000",
    indicatorColor: "#FFB020",
    indicatorGlow: "rgba(255, 176, 32, 0.95)",
    gradLeft1: "#7A480A",
    gradLeft2: "#241403",
    gradLeft3: "#452605",
    gradRight1: "#3B1E04",
    gradRight2: "#241403",
    gradRight3: "#452605",
  },
  cyan: {
    name: "Obsidian Cyan Pulse",
    badge: "Electric Cyan",
    bodyBg: "#080E14",
    bodyBorder: "rgba(0, 229, 255, 0.3)",
    textColor: "#D6FAFF",
    textGlow: "rgba(0, 229, 255, 0.85)",
    glowColor: "#00E5FF",
    indicatorColor: "#00F0FF",
    indicatorGlow: "rgba(0, 240, 255, 0.95)",
    gradLeft1: "#1A5C78",
    gradLeft2: "#0A1F29",
    gradLeft3: "#123F52",
    gradRight1: "#103647",
    gradRight2: "#0A1F29",
    gradRight3: "#123F52",
  },
  emerald: {
    name: "Matrix Emerald",
    badge: "Bio Emerald",
    bodyBg: "#07120D",
    bodyBorder: "rgba(52, 211, 153, 0.3)",
    textColor: "#D1FAE5",
    textGlow: "rgba(16, 185, 129, 0.85)",
    glowColor: "#10B981",
    indicatorColor: "#34D399",
    indicatorGlow: "rgba(52, 211, 153, 0.95)",
    gradLeft1: "#1B5E41",
    gradLeft2: "#082116",
    gradLeft3: "#11422E",
    gradRight1: "#0F3827",
    gradRight2: "#082116",
    gradRight3: "#11422E",
  },
  violet: {
    name: "Ultraviolet Ray",
    badge: "Neon Violet",
    bodyBg: "#0F0A17",
    bodyBorder: "rgba(192, 132, 252, 0.3)",
    textColor: "#F3E8FF",
    textGlow: "rgba(192, 132, 252, 0.85)",
    glowColor: "#C084FC",
    indicatorColor: "#E879F9",
    indicatorGlow: "rgba(232, 121, 249, 0.95)",
    gradLeft1: "#5E298F",
    gradLeft2: "#19082B",
    gradLeft3: "#3F1563",
    gradRight1: "#371754",
    gradRight2: "#19082B",
    gradRight3: "#3F1563",
  },
  crimson: {
    name: "Inferno Crimson",
    badge: "Magma Red",
    bodyBg: "#140A0A",
    bodyBorder: "rgba(248, 113, 113, 0.3)",
    textColor: "#FEE2E2",
    textGlow: "rgba(239, 68, 68, 0.85)",
    glowColor: "#F87171",
    indicatorColor: "#EF4444",
    indicatorGlow: "rgba(239, 68, 68, 0.95)",
    gradLeft1: "#731E1E",
    gradLeft2: "#260606",
    gradLeft3: "#4F0F0F",
    gradRight1: "#450C0C",
    gradRight2: "#260606",
    gradRight3: "#4F0F0F",
  },
  uipirate: {
    name: "UI Pirate Sunset Flame",
    badge: "Brand Flame",
    bodyBg: "#120803",
    bodyBorder: "rgba(255, 91, 4, 0.35)",
    textColor: "#FFEDD5",
    textGlow: "rgba(255, 91, 4, 0.85)",
    glowColor: "#FF5B04",
    indicatorColor: "#FF7300",
    indicatorGlow: "rgba(255, 115, 0, 0.95)",
    gradLeft1: "#7D3008",
    gradLeft2: "#290D01",
    gradLeft3: "#541C03",
    gradRight1: "#4A1702",
    gradRight2: "#290D01",
    gradRight3: "#541C03",
  },
  "pearl-light": {
    name: "Frosted Pearl Ceramic",
    badge: "Light Mode",
    isLightMode: true,
    bodyBg: "#F0F2F5",
    bodyBorder: "rgba(0, 0, 0, 0.12)",
    textColor: "#111827",
    textGlow: "rgba(0, 0, 0, 0.2)",
    glowColor: "#0284C7",
    indicatorColor: "#0284C7",
    indicatorGlow: "rgba(2, 132, 199, 0.8)",
    gradLeft1: "#D1D5DB",
    gradLeft2: "#9CA3AF",
    gradLeft3: "#E5E7EB",
    gradRight1: "#CBD5E1",
    gradRight2: "#94A3B8",
    gradRight3: "#E2E8F0",
  },
  "gold-luxury": {
    name: "Titanium Gold Luxury",
    badge: "Prestige Gold",
    bodyBg: "#14120A",
    bodyBorder: "rgba(234, 179, 8, 0.35)",
    textColor: "#FEF08A",
    textGlow: "rgba(234, 179, 8, 0.8)",
    glowColor: "#FACC15",
    indicatorColor: "#EAB308",
    indicatorGlow: "rgba(234, 179, 8, 0.9)",
    gradLeft1: "#7A6214",
    gradLeft2: "#241C03",
    gradLeft3: "#473807",
    gradRight1: "#3D3004",
    gradRight2: "#241C03",
    gradRight3: "#473807",
  },
};

export const ANGLE_TRANSFORMS: Record<
  IsometricReviveAngle,
  { stageTransform: string; textFlip: string; label: string }
> = {
  "iso-left": {
    stageTransform: "",
    textFlip: "",
    label: "30° Isometric Left (Figma 1:1)",
  },
  "iso-right": {
    stageTransform: "scaleX(-1)",
    textFlip: "scaleX(-1)",
    label: "30° Isometric Right (Mirrored)",
  },
  "axonometric-top": {
    stageTransform: "perspective(1200px) rotateX(16deg)",
    textFlip: "",
    label: "Axonometric Top View",
  },
  "tilt-dynamic": {
    stageTransform: "perspective(1200px) rotateX(10deg) rotateZ(-6deg)",
    textFlip: "",
    label: "Dynamic 3D Tilt View",
  },
};

export interface IsometricReviveButtonProps {
  /** Text label displayed inside the button face (default: "Revive Now") */
  label?: string;
  /** Visual state mode: 'interactive' (hover to depress & illuminate), 'standerd' (Figma 115:5957 fixed), 'hover' (Figma 115:6002 fixed) */
  stateMode?: IsometricReviveStateMode;
  /** Theme preset */
  theme?: IsometricReviveTheme;
  /** Perspective / Rotation Angle */
  angle?: IsometricReviveAngle;
  /** Glow intensity */
  intensity?: IsometricGlowIntensity;
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
  angle = "iso-left",
  intensity = "vibrant",
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
  const angleConfig = ANGLE_TRANSFORMS[angle] || ANGLE_TRANSFORMS["iso-left"];
  const isMirrored = angle === "iso-right";

  // Determine active visual state
  const isVisualHover =
    stateMode === "hover" ||
    (stateMode === "interactive" && (isHovered || isPressed));

  // Scale factors
  const sizeScales = {
    xs: 0.6,
    sm: 0.75,
    md: 1,
    lg: 1.25,
    xl: 1.5,
  };
  const scaleFactor = sizeScales[size] || 1;

  // Glow blur intensities
  const intensityMap: Record<IsometricGlowIntensity, { blur: number; opacity: number }> = {
    subtle: { blur: 14, opacity: 0.7 },
    vibrant: { blur: 18, opacity: 0.95 },
    hyper: { blur: 24, opacity: 1 },
  };
  const activeIntensity = intensityMap[intensity] || intensityMap.vibrant;

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

  // Hidden measurement ref for accurate label width measurement
  const textMeasureRef = React.useRef<HTMLSpanElement>(null);
  const [measuredTextW, setMeasuredTextW] = useState(0);

  React.useEffect(() => {
    if (textMeasureRef.current) {
      const w = Math.ceil(textMeasureRef.current.getBoundingClientRect().width);
      if (w > 0 && w !== measuredTextW) {
        setMeasuredTextW(w);
      }
    }
  }, [label]);

  // Fallback char-width estimation for instant SSR / initial paint
  const estimatedTextW = Math.ceil((label || "").length * 11.8);
  const effectiveTextW = Math.max(measuredTextW, estimatedTextW);

  // Default text slot available inside 1:1 Figma 180px face (with chevron & margins)
  const defaultTextSlot = 120;
  const extraW = Math.max(0, effectiveTextW - defaultTextSlot);

  // Isometric vector projections for extra width:
  // cos(30°) ≈ 0.8660254, sin(30°) = 0.5
  const dx = extraW * 0.8660254;
  const dy = extraW * 0.5;

  // Center alignment shifts so the button grows symmetrically from its center
  const shiftX = dx / 2;
  const shiftY = dy / 2;

  const idPrefix = React.useId().replace(/:/g, "_");

  return (
    <div
      className={`relative select-none flex items-center justify-center pointer-events-none overflow-visible ${className}`}
      style={{
        width: `${580 * scaleFactor}px`,
        height: `${580 * scaleFactor}px`,
      }}
    >
      {/* Hidden offscreen span for accurate label width measurement */}
      <span
        ref={textMeasureRef}
        aria-hidden="true"
        className="fixed -top-[9999px] -left-[9999px] invisible pointer-events-none font-sans font-medium italic text-[20px] whitespace-nowrap capitalize"
        style={{ letterSpacing: "0.01em" }}
      >
        {label}
      </span>

      <div
        className="relative w-[580px] h-[580px] origin-center flex-none pointer-events-none transition-transform duration-500 overflow-visible"
        style={{
          transform: `scale(${scaleFactor}) ${angleConfig.stageTransform}`,
        }}
      >
        {/* ================================================================= */}
        {/* 1. Background Technical Grid & Timestamp (Figma Node 115:5958)    */}
        {/* ================================================================= */}
        {showGrid && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Timestamp (115:5960) */}
            <div className="-translate-x-full -translate-y-1/2 absolute flex h-[74.5px] items-center justify-center left-[calc(50%+235px)] top-[140px] w-[130px]">
              <div
                style={{
                  transform: `${ISO_TIMESTAMP_TRANSFORM} ${angleConfig.textFlip}`,
                }}
                className="flex-none"
              >
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
        <div
          className="absolute flex items-center justify-center pointer-events-none z-0"
          style={{
            left: `${150 - shiftX}px`,
            top: `${222 - shiftY}px`,
            width: `${288.739 + dx}px`,
            height: `${166.704 + dy}px`,
          }}
        >
          <div style={{ transform: ISO_TRANSFORM }} className="flex-none">
            <div
              className={`h-[114.411px] overflow-hidden relative rounded-[20px] ${t.isLightMode
                ? "bg-[rgba(255,255,255,0.4)] border-[0.5px] border-[rgba(0,0,0,0.15)]"
                : "bg-[rgba(255,255,255,0.01)] border-[0.5px] border-[rgba(255,255,255,0.3)]"
                } border-solid transition-shadow duration-500`}
              style={{
                width: `${218.996 + extraW}px`,
                boxShadow: isVisualHover
                  ? "0px -1px 24px 0px rgba(255,255,255,0.1), 0px -1px 4px 0px rgba(255,255,255,0.15)"
                  : "-24px 20px 9px 0px rgba(0,0,0,0.01), -15px 13px 8px 0px rgba(0,0,0,0.09), -9px 7px 7px 0px rgba(0,0,0,0.3), -4px 3px 5px 0px rgba(0,0,0,0.51), -1px 1px 3px 0px rgba(0,0,0,0.59)",
              }}
            >
              {/* Internal cast shadow of floating button on idle */}
              <div
                className={`absolute flex items-center justify-center transition-opacity duration-500 ${isVisualHover ? "opacity-10" : "opacity-80"
                  }`}
                style={{
                  left: isVisualHover ? "-15.23px" : "4.77px",
                  top: isVisualHover ? "-67.77px" : "-47.77px",
                  width: `${268.729 + dx}px`,
                  height: `${268.729 + dy}px`,
                }}
              >
                <div style={{ transform: "rotate(-45deg) scaleX(0.82) scaleY(1.41)" }} className="flex-none">
                  <div
                    className="h-[138.728px] bg-black/90 rounded-[18px] blur-[10px]"
                    style={{ width: `${225.168 + extraW}px` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Base Glass Rim Stroke (Figma 115:5978 / 115:6023) */}
        <div
          className="absolute flex items-center justify-center pointer-events-none z-0"
          style={{
            left: `${150 - shiftX}px`,
            top: `${219 - shiftY}px`,
            width: `${288.739 + dx}px`,
            height: `${166.704 + dy}px`,
          }}
        >
          <div style={{ transform: ISO_TRANSFORM }} className="flex-none">
            <div
              className={`border-[0.5px] border-solid h-[114.411px] relative rounded-[20px] ${t.isLightMode
                ? "bg-[rgba(255,255,255,0.2)] border-black/20"
                : "bg-[rgba(255,255,255,0.03)] border-white/40"
                }`}
              style={{ width: `${218.996 + extraW}px` }}
            />
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
          className="absolute flex items-center justify-center pointer-events-none z-1"
          style={{
            left: `${182 - shiftX}px`,
            top: `${246.21 - shiftY}px`,
            width: `${224.602 + dx}px`,
            height: `${129.674 + dy}px`,
          }}
        >
          <div style={{ transform: ISO_TRANSFORM }} className="flex-none relative">
            {/* Soft diffused underglow */}
            <div
              className="h-[79.582px] rounded-[18px]"
              style={{
                width: `${179.766 + extraW}px`,
                backgroundColor: t.glowColor,
                filter: `blur(${activeIntensity.blur}px)`,
                opacity: activeIntensity.opacity,
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
            top: `${currentTop - shiftY}px`,
          }}
          transition={{
            type: "spring",
            stiffness: 450,
            damping: 28,
            mass: 0.75,
          }}
          className="absolute pointer-events-auto z-10"
          style={{
            left: `${180.88 - shiftX}px`,
            width: `${225.168 + dx}px`,
            height: `${138.728 + dy}px`,
          }}
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
                <linearGradient id={`${idPrefix}_leftExtrude`} x1="0" y1="47.5" x2={131.26 + dx} y2="47.5" gradientUnits="userSpaceOnUse">
                  <stop stopColor={t.gradLeft1} />
                  <stop offset="0.0336" stopColor={t.isLightMode ? "#A0AEC0" : "#050607"} />
                  <stop offset="0.293" stopColor={t.gradLeft2} />
                  <stop offset="0.662" stopColor={t.gradLeft3} />
                  <stop offset="0.954" stopColor={t.isLightMode ? "#CBD5E1" : "#16181B"} />
                  <stop offset="0.996" stopColor={t.isLightMode ? "#E2E8F0" : "#212329"} />
                </linearGradient>

                <linearGradient id={`${idPrefix}_rightExtrude`} x1="-0.295" y1="24" x2="75.74" y2="24.364" gradientUnits="userSpaceOnUse">
                  <stop stopColor={t.gradRight1} />
                  <stop offset="0.0972" stopColor={t.isLightMode ? "#A0AEC0" : "#050607"} />
                  <stop offset="0.293" stopColor={t.gradRight2} />
                  <stop offset="0.662" stopColor={t.gradRight3} />
                  <stop offset="0.954" stopColor={t.isLightMode ? "#CBD5E1" : "#16181B"} />
                  <stop offset="0.996" stopColor={t.isLightMode ? "#E2E8F0" : "#212329"} />
                </linearGradient>
              </defs>
            </svg>

            {/* Left/Front 3D Extrusion Solid Bevel Wall (Figma 115:5995 / 115:6037) */}
            <div
              className="absolute pointer-events-none z-10"
              style={{
                left: "9.13px",
                top: "40px",
                width: `${131.26 + dx}px`,
                height: `${95 + dy}px`,
              }}
            >
              <svg width={131.26 + dx} height={95 + dy} viewBox={`0 0 ${131.26 + dx} ${95 + dy}`} fill="none" className="block size-full">
                <path
                  d={`M0 0C0 3.51472 2.4676 6.6967 6.45703 9L${131.26 + dx} ${81.0498 + dy}L${131.165 + dx} ${95 + dy}L6.45703 23C2.4676 20.6967 0 17.5147 0 14V0Z`}
                  fill={`url(#${idPrefix}_leftExtrude)`}
                />
              </svg>
            </div>

            {/* Right 3D Extrusion Solid Bevel Wall & Front Corner (Figma 115:5998 / 115:6040) */}
            <div
              className="absolute pointer-events-none z-10"
              style={{
                left: `${140.29 + dx}px`,
                top: `${90 + dy}px`,
                width: "75.744px",
                height: "48.728px",
              }}
            >
              <svg width="75.744" height="48.728" viewBox="0 0 75.744 48.728" fill="none" className="block size-full">
                <path
                  d="M31.1807 45C22.5714 49.9706 8.60927 49.9706 0 45V31C8.60927 35.9706 22.5714 35.9706 31.1807 31V45ZM69.2861 23L31.1816 45V31L69.2861 9V23ZM75.7441 14C75.7441 17.5147 73.2765 20.6967 69.2871 23V9C73.2765 6.6967 75.7441 3.51468 75.7441 0V14Z"
                  fill={`url(#${idPrefix}_rightExtrude)`}
                />
              </svg>
            </div>

            {/* Button Base Face Cavity (Figma 115:5984 / 115:6030) */}
            <div
              className="absolute flex items-center justify-center pointer-events-none z-10"
              style={{
                left: 0,
                top: 0,
                width: `${225.167 + dx}px`,
                height: `${130 + dy}px`,
              }}
            >
              <div style={{ transform: ISO_TRANSFORM }} className="flex-none">
                <div
                  className="border-[0.5px] border-solid h-[80px] relative rounded-[18px]"
                  style={{
                    width: `${180 + extraW}px`,
                    borderColor: t.bodyBorder,
                    backgroundColor: t.bodyBg,
                  }}
                >
                  <div
                    className="absolute inset-0 rounded-[inherit]"
                    style={{
                      boxShadow: t.isLightMode
                        ? "inset 0px 1px 0px 0px rgba(255,255,255,0.8), inset 0px 5px 12px rgba(0,0,0,0.12)"
                        : "inset 0px 1px 0px 0px rgba(255,255,255,0.25), inset 0px 7px 15px 4px black",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Button Top Face Surface (Figma 115:5985 / 115:6031 - Z-INDEX 20) */}
            <div
              className="absolute flex items-center justify-center pointer-events-none z-20"
              style={{
                left: 0,
                top: "0.21px",
                width: `${224.602 + dx}px`,
                height: `${129.674 + dy}px`,
              }}
            >
              <div style={{ transform: ISO_TRANSFORM }} className="flex-none">
                <div
                  className="h-[79.582px] overflow-hidden relative rounded-[18px]"
                  style={{
                    width: `${179.766 + extraW}px`,
                  }}
                >
                  {/* Obsidian/Chassis Background */}
                  <div
                    className="absolute inset-0 pointer-events-none rounded-[18px]"
                    style={{ backgroundColor: t.bodyBg }}
                  />

                  {/* Text: Revive Now (Figma 115:5986 & 115:6032) */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none px-3">
                    <p
                      className="capitalize font-sans font-medium italic whitespace-nowrap text-center"
                      style={{
                        fontSize: "20px",
                        color: t.textColor,
                        opacity: isVisualHover ? 1 : 0.35,
                        textShadow: isVisualHover
                          ? `0px 0px 8px ${t.textGlow}, 0px 0px 18px ${t.textGlow}`
                          : `0px 0px 6px ${t.textGlow}`,
                        letterSpacing: "0.01em",
                        transform: angleConfig.textFlip,
                      }}
                    >
                      {label}
                    </p>
                  </div>

                  {/* Specular Diagonal Sheen (Figma 115:5987 / Vector 8) */}
                  <div
                    className={`absolute inset-0 pointer-events-none opacity-80 ${t.isLightMode
                      ? "bg-gradient-to-br from-white/80 via-white/20 to-transparent"
                      : "bg-gradient-to-br from-white/[0.16] via-white/[0.02] to-transparent"
                      }`}
                  />

                  {/* Amber Chevron (Figma 115:5988 / 115:6034) */}
                  <div
                    className="absolute top-[18.95px] pointer-events-none"
                    style={{
                      left: isMirrored ? "auto" : "18.64px",
                      right: isMirrored ? "18.64px" : "auto",
                    }}
                  >
                    <div
                      className="transition-all duration-300"
                      style={{
                        filter: isVisualHover
                          ? `drop-shadow(0px 0px 5px ${t.indicatorGlow})`
                          : "none",
                        transform: angleConfig.textFlip,
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
                  <div
                    className="absolute inset-0 pointer-events-none rounded-[inherit]"
                    style={{
                      boxShadow: t.isLightMode
                        ? "inset 0px 1px 0px 0px rgba(255,255,255,0.9), inset 0px 4px 10px rgba(0,0,0,0.1), inset 0px 0px 0px 3px rgba(0,0,0,0.05)"
                        : "inset 0px 1px 0px 0px rgba(255,255,255,0.25), inset 0px 7px 15px 4px black, inset 0px 0px 0px 5px black",
                    }}
                  />
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
