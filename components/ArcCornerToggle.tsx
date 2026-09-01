"use client";

import React, { useState } from "react";
import { motion, Transition } from "framer-motion";

export type ArcToggleTheme = "light" | "dark";
export type ArcCornerToggleStateMode = "interactive" | "standard" | "standerd" | "click";
export type ArcToggleSize = "sm" | "md" | "lg";

export const ARC_SIZE_SCALE: Record<ArcToggleSize, number> = {
  sm: 0.75,
  md: 1,
  lg: 1.25,
};

export interface ArcCornerToggleProps {
  /** Controlled active state (false = Light/STANDARD, true = Dark/CLICK) */
  isActive?: boolean;
  /** Optional custom text color for header label */
  textColor?: string;
  /** State preview mode: "interactive" | "standard" | "click" */
  stateMode?: ArcCornerToggleStateMode;
  /** Toggle event handler */
  onToggle?: (active: boolean) => void;
  /** Force specific theme or let state dictate ("auto" | "light" | "dark") */
  themeMode?: "auto" | "light" | "dark";
  /** Named size preset (multiplies with `scale`) */
  size?: ArcToggleSize;
  /** Fine-grained size scale multiplier (combined with `size`) */
  scale?: number;
  /** Animation duration in seconds (default: 0.65) */
  duration?: number;
  /** Custom transition configuration if needed */
  transition?: Transition;
  /** Additional CSS class names */
  className?: string;
  /** Whether to show header line ("STANDARD ———" / "CLICK ———") */
  showHeader?: boolean;
  /** Track geometry: curved corner arc (default) or a horizontal straight line */
  track?: "arc" | "line";
}

/** Straight horizontal track (pill outline + centerline) for the "line" variant */
const LINE_TRACK_PILL =
  "M42 8H278C296.778 8 312 23.2223 312 42C312 60.7777 296.778 76 278 76H42C23.2223 76 8 60.7777 8 42C8 23.2223 23.2223 8 42 8Z";
const LINE_CENTERLINE_PATH = "M 42 42 H 278";

/**
 * Exact Figma Track Outer Contour SVG Path (Node 75:5088 & 75:5138)
 */
const FIGMA_TRACK_PATH =
  "M34.5 8C19.8644 8 8 19.8645 8 34.5C8 49.1355 19.8645 61 34.5 61H46.3838C135.642 61 208 133.358 208 222.616V234.5C208 249.136 219.864 261 234.5 261C249.136 261 261 249.136 261 234.5V220.089C261 102.956 166.044 8 48.9106 8H34.5Z";

/**
 * Mathematically Exact Centerline Vector Path of the 53px-wide track groove
 * Radius = 185.589px around Center (48.91, 220.089)
 */
const FIGMA_CENTERLINE_PATH =
  "M 34.5 34.5 H 48.91 A 185.589 185.589 0 0 1 234.5 220.089 V 234.5";

/**
 * 1:1 Pixel-Accurate Implementation of Figma Nodes 75:5084 & 75:5131
 */
export const ArcCornerToggle: React.FC<ArcCornerToggleProps> = ({
  isActive: controlledActive,
  textColor,
  stateMode = "interactive",
  onToggle,
  themeMode = "auto",
  size = "md",
  scale = 1,
  duration = 0.65,
  transition: customTransition,
  className = "",
  showHeader = true,
  track = "arc",
}) => {
  const effectiveScale = scale * (ARC_SIZE_SCALE[size] ?? 1);
  const [internalActive, setInternalActive] = useState(false);
  const active =
    stateMode === "standerd" || stateMode === "standard"
      ? false
      : stateMode === "click"
        ? true
        : controlledActive !== undefined
          ? controlledActive
          : internalActive;

  const currentTheme: ArcToggleTheme =
    themeMode === "auto" ? (active ? "dark" : "light") : themeMode;

  const isLight = currentTheme === "light";
  const isLine = track === "line";
  const centerline = isLine ? LINE_CENTERLINE_PATH : FIGMA_CENTERLINE_PATH;

  const handleToggle = () => {
    const nextState = !active;
    if (controlledActive === undefined) {
      setInternalActive(nextState);
    }
    onToggle?.(nextState);
  };

  // Motion transition for path travel based on user speed/duration
  const effectiveTransition: Transition = customTransition || {
    duration,
    ease: [0.34, 1.3, 0.64, 1], // Spring snap bezier
  };

  return (
    <div
      className={`relative inline-block select-none overflow-hidden rounded-3xl ${className}`}
      style={{
        width: 600 * scale,
        height: 600 * scale,
        maxWidth: "100%",
      }}
    >
      <div
        style={{
          width: 600,
          height: 600,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {/* ─────────────────────────────────────────────────────────────
            MAIN 600×600 STAGE CONTAINER (Exact Figma Frame 1000003154 / 3155)
           ───────────────────────────────────────────────────────────── */}
        <motion.div
          className="relative w-[600px] h-[600px] overflow-hidden"
          animate={{
            background: isLight
              ? "linear-gradient(149.54deg, rgb(240, 240, 240) 16.26%, rgb(163, 163, 161) 183.63%)"
              : "linear-gradient(149.54deg, rgb(68, 81, 109) 16.26%, rgb(22, 27, 37) 183.63%)",
          }}
          transition={{ duration: duration * 0.9, ease: "easeInOut" }}
        >
          {/* ─────────────────────────────────────────────────────────────
              HEADER BAR: "STANDERD ——————————" / "CLICK ——————————"
             ───────────────────────────────────────────────────────────── */}
          {showHeader && (
            <div className="absolute top-[48px] left-[50px] right-[50px] flex items-center gap-4 z-30">
              <motion.span
                className="text-[26px] font-black tracking-tight uppercase"
                animate={{
                  color: textColor || (isLight ? "#2B2B2B" : "#FFFFFF"),
                }}
                transition={{ duration: duration * 0.7 }}
                style={{
                  fontFamily: "var(--font-jakarta), var(--font-sans), sans-serif",
                }}
              >
                {active ? "CLICK" : "STANDERD"}
              </motion.span>
              <motion.div
                className="flex-1 h-[2px]"
                animate={{
                  backgroundColor: isLight ? "#2B2B2B" : "#FFFFFF",
                  opacity: isLight ? 0.75 : 0.85,
                }}
                transition={{ duration: duration * 0.7 }}
              />
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
            FOREGROUND SLAB (Exact Figma Node 75:5130 / 75:5180)
            Left: -879px, Top: 205px, Width: 1260px, Height: 666px, Radius: 150px
           ───────────────────────────────────────────────────────────── */}
          {!isLine && (
            <motion.div
              className="absolute pointer-events-none z-10"
              animate={{
                backgroundColor: isLight ? "#DDDDDD" : "#404C66",
                boxShadow: isLight
                  ? "0px 1px 0px 0px rgba(167,170,183,0.3), 151px 153px 60px 0px rgba(0,0,0,0.01), 97px 98px 55px 0px rgba(0,0,0,0.04), 55px 55px 46px 0px rgba(0,0,0,0.15), 24px 24px 34px 0px rgba(0,0,0,0.26), inset 0px 2px 0px 0px rgba(255,255,255,0.4)"
                  : "0px 1px 0px 0px rgba(167,170,183,0.3), 151px 153px 60px 0px rgba(0,0,0,0.01), 97px 98px 55px 0px rgba(0,0,0,0.04), 55px 55px 46px 0px rgba(0,0,0,0.15), inset 0px 2px 0px 0px rgba(255,255,255,0.18)",
              }}
              transition={{ duration: duration * 0.9, ease: "easeInOut" }}
              style={{
                left: -879,
                top: 205,
                width: 1260,
                height: 666,
                borderRadius: 150,
              }}
            />
          )}

          {/* ─────────────────────────────────────────────────────────────
            TRACK & MATTE VIOLET-PURPLE TRAIL — corner arc OR straight line
           ───────────────────────────────────────────────────────────── */}
          <div
            className="absolute z-20"
            style={
              isLine
                ? { left: 140, top: 258, width: 320, height: 84 }
                : { left: 203, top: 132, width: 266, height: 267 }
            }
          >
            {/* TRACK SVG BASE & MATTE UNDERGLOW TRAIL */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={isLine ? "320" : "266"}
              height={isLine ? "84" : "267"}
              viewBox={isLine ? "0 0 320 84" : "0 0 266 267"}
              fill="none"
              className="absolute inset-0 size-full overflow-visible pointer-events-none"
            >
              <defs>
                <clipPath id="trackInnerClip">
                  <path d={isLine ? LINE_TRACK_PILL : FIGMA_TRACK_PATH} />
                </clipPath>

                {/* Exact Figma Matte Violet/Purple Underglow Gradient */}
                <linearGradient id="matteTrailGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3E2C4D" stopOpacity="0" />
                  <stop offset="35%" stopColor="#553065" stopOpacity="0.3" />
                  <stop offset="65%" stopColor="#7B3A7B" stopOpacity="0.55" />
                  <stop offset="88%" stopColor="#A84B95" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#C058A8" stopOpacity="0.85" />
                </linearGradient>

                {/* Light Mode Track Filter */}
                <filter
                  id="filter0_dd_75_5088"
                  x="0"
                  y="0"
                  width="266"
                  height="267"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                  <feOffset dx="-4" dy="-4" />
                  <feGaussianBlur stdDeviation="2" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_75_5088" />
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                  <feOffset dx="1" dy="2" />
                  <feGaussianBlur stdDeviation="2" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
                  <feBlend mode="normal" in2="effect1_dropShadow_75_5088" result="effect2_dropShadow_75_5088" />
                  <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_75_5088" result="shape" />
                </filter>

                {/* Dark Mode Track Filter */}
                <filter
                  id="filter0_dd_75_5138"
                  x="0"
                  y="0"
                  width="266"
                  height="267"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                  <feOffset dx="-4" dy="-4" />
                  <feGaussianBlur stdDeviation="2" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.08 0" />
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_75_5138" />
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                  <feOffset dx="1" dy="2" />
                  <feGaussianBlur stdDeviation="2" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.17 0" />
                  <feBlend mode="normal" in2="effect1_dropShadow_75_5138" result="effect2_dropShadow_75_5138" />
                  <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_75_5138" result="shape" />
                </filter>
              </defs>

              {/* 1. Base Channel Track Path */}
              <g filter={isLine ? undefined : isLight ? "url(#filter0_dd_75_5088)" : "url(#filter0_dd_75_5138)"}>
                <path
                  d={isLine ? LINE_TRACK_PILL : FIGMA_TRACK_PATH}
                  fill={isLight ? "#C0C0C0" : "#404C66"}
                  fillOpacity={isLight ? "0.07" : "0.1"}
                  shapeRendering="crispEdges"
                />
                {isLine && (
                  <path
                    d={LINE_TRACK_PILL}
                    fill="none"
                    stroke={isLight ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.14)"}
                    strokeWidth="2"
                  />
                )}
              </g>

              {/* 2. MATTE VOLUMETRIC VIOLET-PURPLE UNDERGLOW ANIMATING IN SYNC WITH THE SWITCH */}
              <g clipPath="url(#trackInnerClip)">
                {/* Wide ambient matte diffusion */}
                <motion.path
                  d={centerline}
                  stroke="url(#matteTrailGrad)"
                  strokeWidth="46"
                  strokeLinecap="round"
                  fill="none"
                  initial={false}
                  animate={{
                    pathLength: active ? 1 : 0,
                    opacity: active ? 0.6 : 0,
                  }}
                  transition={effectiveTransition}
                  style={{ filter: "blur(18px)" }}
                />

                {/* Core matte body fill */}
                <motion.path
                  d={centerline}
                  stroke="url(#matteTrailGrad)"
                  strokeWidth="32"
                  strokeLinecap="round"
                  fill="none"
                  initial={false}
                  animate={{
                    pathLength: active ? 1 : 0,
                    opacity: active ? 0.85 : 0,
                  }}
                  transition={effectiveTransition}
                  style={{ filter: "blur(8px)" }}
                />
              </g>
            </svg>

            {/* ─────────────────────────────────────────────────────────────
              MATHEMATICALLY LOCKED PATH TRAVEL VIA NATIVE CSS OFFSET-PATH
              Anchor Point: (36.47px, 35.48px) — Centers the circular dial exactly on the track end
             ───────────────────────────────────────────────────────────── */}
            <motion.div
              onClick={handleToggle}
              animate={{
                offsetDistance: active ? "100%" : "0%",
              }}
              transition={effectiveTransition}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="absolute cursor-pointer z-30 flex items-center justify-center"
              style={{
                width: 96,
                height: 71,
                offsetPath: `path("${centerline}")`,
                offsetRotate: "auto 0deg",
                offsetAnchor: "36.47px 35.48px",
              }}
            >
              {/* ─────────────────────────────────────────────────────────────
                EXACT FIGMA NODE 75:5090 & 75:5140 GLASS PILL BUTTON
               ───────────────────────────────────────────────────────────── */}
              <div
                className="relative w-[96px] h-[71px] rounded-[70px]"
                style={{
                  border: isLight
                    ? "1px solid rgba(255, 255, 255, 0.8)"
                    : "1px solid rgba(255, 255, 255, 0.28)",
                  background: isLight
                    ? "radial-gradient(49.98% 47.8% at 99.7% 31.67%, rgba(255, 255, 255, 0.60) 0%, rgba(255, 255, 255, 0.00) 100%), linear-gradient(64deg, #E6E6E6 17.28%, rgba(220, 220, 220, 0.60) 101.04%)"
                    : "radial-gradient(49.98% 47.8% at 99.7% 31.67%, rgba(255, 255, 255, 0.20) 0%, rgba(255, 255, 255, 0.00) 100%), linear-gradient(64deg, #616B81 17.28%, rgba(64, 76, 102, 0.50) 101.04%)",
                  boxShadow: isLight
                    ? "0px 1px 0px 0px rgba(167,170,183,0.3), 151px 153px 60px 0px rgba(0,0,0,0.01), 97px 98px 55px 0px rgba(0,0,0,0.04), 55px 55px 46px 0px rgba(0,0,0,0.15), 24px 24px 34px 0px rgba(0,0,0,0.26), inset 0px 1px 1px 0px rgba(255, 255, 255, 0.8), inset 0px -1px 1px 0px rgba(0, 0, 0, 0.1)"
                    : "0px 1px 0px 0px rgba(167,170,183,0.2), 151px 153px 60px 0px rgba(0,0,0,0.01), 97px 98px 55px 0px rgba(0,0,0,0.04), 55px 55px 46px 0px rgba(0,0,0,0.15), 24px 24px 34px 0px rgba(0,0,0,0.26), inset 0px 1px 1px 0px rgba(255, 255, 255, 0.35), inset 0px -1px 1px 0px rgba(0, 0, 0, 0.35)",
                }}
              >
                {/* EXACT FIGMA SVG FOR BUTTON (75:5090 for Light, 75:5140 for Dark) */}
                <svg
                  width="96"
                  height="71"
                  viewBox="0 0 96 71"
                  fill="none"
                  className="absolute inset-0 size-full overflow-visible"
                >
                  <defs>
                    {/* Amber Flame Linear (Figma paint2_linear_10020_2778 for Light Mode) */}
                    <linearGradient id="amberFlameGrad" x1="20" y1="35.7441" x2="83" y2="35.7441" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#ED45BE" stopOpacity="0" />
                      <stop offset="1" stopColor="#FFA449" />
                    </linearGradient>

                    {/* Magenta Flame Linear (Figma paint2_linear_10016_2400 for Dark Mode) */}
                    <linearGradient id="magentaFlameGrad" x1="20" y1="35.7441" x2="83" y2="35.7441" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#ED45BE" stopOpacity="0" />
                      <stop offset="1" stopColor="#ED45BE" />
                    </linearGradient>

                    {/* Flame Blur Filter (Figma filter0_f_10016_2400 / filter1_f_10020_2778) */}
                    <filter id="filter0_f_flame" x="-2" y="-3.75586" width="107" height="79" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                      <feGaussianBlur stdDeviation="11" />
                    </filter>

                    {/* Light Mode Soft Ambient Vector 3590 Filter */}
                    <filter id="filter0_f_light_ambient" x="-47.948" y="-83" width="324.448" height="170.5" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                      <feGaussianBlur stdDeviation="26.5" />
                    </filter>

                    {/* Sunken Cavity Dual Inner Shadow (Top-Left Shadow + Bottom-Right Specular Catch) */}
                    <filter id="filter2_iif_dial" x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB">
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />

                      {/* 1. Deep Top-Left Sunken Drop Shadow */}
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                      <feMorphology radius="1" operator="dilate" in="SourceAlpha" />
                      <feOffset dx={isLight ? "1" : "1.5"} dy={isLight ? "1.5" : "2"} />
                      <feGaussianBlur stdDeviation={isLight ? "2" : "2"} />
                      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                      <feColorMatrix type="matrix" values={`0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 ${isLight ? "0.22" : "0.4"} 0`} />
                      <feBlend mode="normal" in2="shape" result="sunkenShadow" />

                      {/* 2. Bottom-Right Inner Rim Light Catch */}
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha2" />
                      <feMorphology radius="0.5" operator="dilate" in="SourceAlpha" />
                      <feOffset dx="-1" dy="-1.5" />
                      <feGaussianBlur stdDeviation="1.5" />
                      <feComposite in2="hardAlpha2" operator="arithmetic" k2="-1" k3="1" />
                      <feColorMatrix type="matrix" values={`0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 ${isLight ? "0.7" : "0.28"} 0`} />
                      <feBlend mode="normal" in2="sunkenShadow" result="effect2_innerShadow" />
                    </filter>

                    {/* Frosted Glass Radial Gradient (Light - Sunken Lens) */}
                    <radialGradient id="frostedDialRadial_light" cx="30%" cy="25%" r="75%">
                      <stop offset="0%" stopColor="#C8C8C8" stopOpacity="0.45" />
                      <stop offset="50%" stopColor="#DFDFDF" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.6" />
                    </radialGradient>

                    {/* Frosted Glass Radial Gradient (Dark - Spherical Recessed Dish) */}
                    <radialGradient id="frostedDialRadial_dark" cx="32%" cy="28%" r="75%">
                      <stop offset="0%" stopColor="#2E374A" stopOpacity="0.4" />
                      <stop offset="45%" stopColor="#48556F" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#8291AF" stopOpacity="0.32" />
                    </radialGradient>

                    <clipPath id="knobPillClip">
                      <rect width="96" height="71" rx="35.5" fill="white" />
                    </clipPath>

                    <clipPath id="dialCircleClip">
                      <circle cx="36.4697" cy="35.4844" r="23" />
                    </clipPath>
                  </defs>

                  <g clipPath="url(#knobPillClip)">
                    {/* Light Mode Soft Ambient Vector 3590 */}
                    {isLight && (
                      <path
                        d="M13.5 30L14.2091 29.6038C24.9258 23.615 36.8771 20.173 49.1376 19.5442L186.5 12.5L201 34.5L194.5 9L223.5 4L204.5 -30H7L5.05417 21.0779C5.0199 21.9779 5.39178 22.8457 6.06714 23.4416L13.5 30Z"
                        fill="#C8D2DD"
                        filter="url(#filter0_f_light_ambient)"
                      />
                    )}

                    {/* 1. LED Flame (Warm Peach-Amber in Light, Vibrant Magenta in Dark) */}
                    <path
                      d="M83 35.7441C83 45.4091 78.8346 53.2441 73.6962 53.2441C68.5579 53.2441 27.2188 42.9855 20 35.7441C34 29.7097 68.5579 18.2441 73.6962 18.2441C78.8346 18.2441 83 26.0792 83 35.7441Z"
                      fill={isLight ? "url(#amberFlameGrad)" : "url(#magentaFlameGrad)"}
                      fillOpacity={isLight ? "0.85" : "0.7"}
                      filter="url(#filter0_f_flame)"
                    />

                    {/* 2. Sunken Concave Frosted Glass Dial Recess */}
                    <g>
                      {/* Sunken Ellipse 7435 - Concave recessed dish cavity */}
                      <circle
                        cx="36.4697"
                        cy="35.4844"
                        r="23"
                        fill={isLight ? "url(#frostedDialRadial_light)" : "url(#frostedDialRadial_dark)"}
                        filter="url(#filter2_iif_dial)"
                      />
                    </g>

                    {/* 3. Sunburst Loader Vector Icon */}
                    <g id="loader">
                      <path d="M26.7139 35.4844L30.7139 35.4844" stroke={isLight ? "#222222" : "white"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M42.7139 35.4844L46.7139 35.4844" stroke={isLight ? "#222222" : "white"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M29.6436 42.5543L32.4736 39.7243" stroke={isLight ? "#222222" : "white"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M40.9539 31.2444L43.7839 28.4144" stroke={isLight ? "#222222" : "white"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M36.7139 45.4844L36.7139 41.4844" stroke={isLight ? "#222222" : "white"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M36.7139 29.4844L36.7139 25.4844" stroke={isLight ? "#222222" : "white"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M43.7839 42.5544L40.9539 39.7244" stroke={isLight ? "#222222" : "white"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M32.4736 31.2444L29.6436 28.4144" stroke={isLight ? "#222222" : "white"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                  </g>
                </svg>

                {/* ─────────────────────────────────────────────────────────────
                  EXACT FIGMA SPECULAR GLARE & LIGHT RAYS (Node 75:5107 / 75:5157)
                  Anchored at top-left rim of capsule knob
                 ───────────────────────────────────────────────────────────── */}
                <div
                  className="absolute pointer-events-none"
                  style={{
                    left: -26.8,
                    top: -9.5,
                    width: 129,
                    height: 116,
                    mixBlendMode: "plus-lighter",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="129"
                    height="116"
                    viewBox="0 0 129 116"
                    fill="none"
                    className="overflow-visible"
                  >
                    <defs>
                      <filter
                        id="filter0_f_75_5157"
                        x="15.1328"
                        y="7.66406"
                        width="55.6567"
                        height="37.4893"
                        filterUnits="userSpaceOnUse"
                        colorInterpolationFilters="sRGB"
                      >
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur stdDeviation="1" />
                      </filter>
                      <filter
                        id="filter1_f_75_5157"
                        x="0"
                        y="0"
                        width="128.679"
                        height="37.4238"
                        filterUnits="userSpaceOnUse"
                        colorInterpolationFilters="sRGB"
                      >
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur stdDeviation="1" />
                      </filter>
                      <filter
                        id="filter2_f_75_5157"
                        x="11.0933"
                        y="3.50781"
                        width="66.7812"
                        height="58.0586"
                        filterUnits="userSpaceOnUse"
                        colorInterpolationFilters="sRGB"
                      >
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur stdDeviation="8" />
                      </filter>
                    </defs>

                    {/* Ray Beam 1 (-32.95 deg) */}
                    <g filter="url(#filter0_f_75_5157)">
                      <ellipse
                        cx="42.9611"
                        cy="26.4088"
                        rx="30.777"
                        ry="0.5"
                        transform="rotate(-32.9487 42.9611 26.4088)"
                        fill="white"
                        fillOpacity={isLight ? 0.18 : 0.1}
                      />
                    </g>

                    {/* Long Transverse Ray Beam 2 (-15 deg) */}
                    <g filter="url(#filter1_f_75_5157)">
                      <ellipse
                        cx="64.3394"
                        cy="18.7118"
                        rx="64.5384"
                        ry="0.532378"
                        transform="rotate(-15 64.3394 18.7118)"
                        fill="white"
                        fillOpacity={isLight ? 0.18 : 0.1}
                      />
                    </g>

                    {/* Specular Core Hotspot */}
                    <g filter="url(#filter2_f_75_5157)">
                      <path
                        d="M61.6143 20.9863C63.593 24.0393 53.9481 25.6127 44.1143 31.9863C34.2804 38.36 29.5913 48.0391 27.6126 44.9862C25.6338 41.9332 29.279 32.3599 39.1129 25.9862C48.9467 19.6125 59.6355 17.9334 61.6143 20.9863Z"
                        fill="white"
                        fillOpacity={isLight ? 0.35 : 0.3}
                      />
                    </g>
                  </svg>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ArcCornerToggle;
