"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export type SmashButtonVariant = "figma" | "dark" | "orange" | "cyberpunk";

export interface SmashTactileButtonProps {
  /** Text label inside the button (default: "Smash the button") */
  label?: string;
  /** Visual variant (default: "figma" matching Figma Node 17:1480) */
  variant?: SmashButtonVariant;
  /** Size scale (default: "md") */
  size?: "sm" | "md" | "lg" | "hero";
  /** Optional click handler */
  onClick?: () => void;
  /** Additional CSS class names */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
}

/**
 * 21-Dot Double Matrix Array matching Figma Node 17:1529 & 17:1572
 */
const DotMatrixRow: React.FC<{ count?: number; color?: string }> = ({
  count = 21,
  color = "#CEC9F1",
}) => (
  <div className="flex flex-col gap-[3.5px] items-center pointer-events-none select-none">
    <div className="flex items-center gap-[6px]">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={`r1-${i}`}
          className="w-[3px] h-[3px] rounded-full shadow-[0px_0.5px_0.5px_rgba(255,255,255,0.9)]"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
    <div className="flex items-center gap-[6px]">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={`r2-${i}`}
          className="w-[3px] h-[3px] rounded-full shadow-[0px_0.5px_0.5px_rgba(255,255,255,0.9)]"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  </div>
);

/**
 * Exact mathematical continuous path from Figma Node 17:1702 normalized to 0 0 578 148
 */
const FIGMA_CORE_PATH =
  "M 0 15 C 0 6.71573 6.71573 0 15 0 H 563 C 571.284 0 578 6.71573 578 15 V 133 C 578 141.284 571.284 148 563 148 H 53.2132 C 49.235 148 45.4196 146.42 42.6066 143.607 L 4.3934 105.393 C 1.5804 102.58 0 98.765 0 94.7868 V 15 Z";

const FIGMA_STROKE_PATH =
  "M 15 1 H 563 C 570.732 1 577 7.26801 577 15 V 133 C 577 140.732 570.732 147 563 147 H 53.2129 C 49.5 147 45.9389 145.525 43.3135 142.899 L 5.1006 104.687 C 2.4751 102.061 1 98.5 1 94.7871 V 15 C 1 7.26801 7.268 1 15 1 Z";

/**
 * SmashTactileButton
 *
 * 1:1 Pixel-Accurate 5-Tier Layer Architecture from Figma Master Button Collection (Node 17:1480):
 * - LAYER 1: Background Canvas (diagonal pinstripes)
 * - LAYER 2: Crystal Glass Deck (Frame 280, node 17:1481) - 100% transparent glass enclosure with #F3F3FE laser ticks & dots
 * - LAYER 3: Porcelain Cushion Tray (Frame 11, node 17:1527) - Lavender-white plate (#F3F3FE) with dot matrix arrays
 * - LAYER 3.5: Intermediate Cushion Cradle Plate (node 17:1701) - Lavender-blue plate (#D9DCF1) containing Layer 4 with perfectly EVEN padding
 * - LAYER 4: Exact Dark Tactile Core Cap (Node 17:1702/17:1703) with realistic soft Gaussian tactile shadow & glowing chamfer
 * - LIGHT FLARE (Node 17:1704) - Exact 45° rotated purplish (#D7B0FF) radial elliptical spotlight SVG from Figma
 */
export const SmashTactileButton: React.FC<SmashTactileButtonProps> = ({
  label = "Smash the button",
  variant = "figma",
  size = "md",
  onClick,
  className = "",
  disabled = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Scaled dimensions with uniform, perfectly even padding where Layer 3.5 evenly contains Layer 4
  const sizeConfig = {
    sm: {
      deckW: 460,
      deckH: 210,
      trayW: 410,
      trayH: 162,
      cradlePad: 10,
      coreW: 340,
      coreH: 87,
      fontSize: "text-[20px]",
      dotsCount: 17,
      ticksCount: 10,
      flareSize: 76,
      flareOffset: -12,
      liftY: -3,
    },
    md: {
      deckW: 640,
      deckH: 290,
      trayW: 570,
      trayH: 224,
      cradlePad: 14,
      coreW: 474,
      coreH: 121,
      fontSize: "text-[28px] sm:text-[32px]",
      dotsCount: 21,
      ticksCount: 12,
      flareSize: 103,
      flareOffset: -16,
      liftY: -5,
    },
    lg: {
      deckW: 732,
      deckH: 330,
      trayW: 652,
      trayH: 254,
      cradlePad: 16,
      coreW: 578,
      coreH: 148,
      fontSize: "text-[36px] sm:text-[40px]",
      dotsCount: 25,
      ticksCount: 14,
      flareSize: 124,
      flareOffset: -20,
      liftY: -6,
    },
    hero: {
      deckW: 880,
      deckH: 390,
      trayW: 784,
      trayH: 300,
      cradlePad: 18,
      coreW: 694,
      coreH: 178,
      fontSize: "text-[42px] sm:text-[48px]",
      dotsCount: 29,
      ticksCount: 16,
      flareSize: 150,
      flareOffset: -24,
      liftY: -8,
    },
  }[size];

  // Derived cradle dimensions: core dimensions + 2 * even cradle padding
  const cradleW = sizeConfig.coreW + sizeConfig.cradlePad * 2;
  const cradleH = sizeConfig.coreH + sizeConfig.cradlePad * 2;

  // Theme palettes matching Figma Node 17:1480 & variants
  const themeStyles = {
    figma: {
      deckBorder: "rgba(255, 255, 255, 0.85)",
      glassAccentColor: "#F3F3FE", // Glass deck ticks and dots matching #F3F3FE
      trayDotsColor: "#CEC9F1",
      trayBg: "#F3F3FE",
      cradleBg: "#D9DCF1",
      cradleShadow:
        "inset 0px 0.5px 1.5px 0px rgba(0, 0, 0, 0.08), 0px 1px 0px rgba(255, 255, 255, 0.8)",
      textColor: "#FFFFFF",
      flareColor: "#D7B0FF",
      gradStart: "#4A3681",
      gradEnd: "#161A34",
      strokeGlow: "#CB97FF",
      softDropShadow:
        "drop-shadow(0px 3px 3px rgba(13, 10, 28, 0.45)) drop-shadow(0px 7px 8px rgba(61, 47, 98, 0.22)) drop-shadow(0px 16px 20px rgba(61, 47, 98, 0.18))",
    },
    dark: {
      deckBorder: "rgba(255, 255, 255, 0.3)",
      glassAccentColor: "rgba(243, 243, 254, 0.65)",
      trayDotsColor: "rgba(255, 255, 255, 0.35)",
      trayBg: "#18181D",
      cradleBg: "#22222B",
      cradleShadow:
        "inset 0px 0.5px 1.5px 0px rgba(0, 0, 0, 0.4), 0px 1px 0px rgba(255, 255, 255, 0.15)",
      textColor: "#FFFFFF",
      flareColor: "#00E5BE",
      gradStart: "#2B2B38",
      gradEnd: "#101015",
      strokeGlow: "#00E5BE",
      softDropShadow:
        "drop-shadow(0px 3px 4px rgba(0,0,0,0.6)) drop-shadow(0px 8px 12px rgba(0,0,0,0.4)) drop-shadow(0px 16px 22px rgba(0,0,0,0.3))",
    },
    orange: {
      deckBorder: "rgba(255, 91, 4, 0.5)",
      glassAccentColor: "#FFF3EE",
      trayDotsColor: "rgba(255, 91, 4, 0.4)",
      trayBg: "#251208",
      cradleBg: "#3A1B0B",
      cradleShadow:
        "inset 0px 0.5px 1.5px 0px rgba(0, 0, 0, 0.3), 0px 1px 0px rgba(255, 255, 255, 0.3)",
      textColor: "#FFFFFF",
      flareColor: "#FF9254",
      gradStart: "#FF5B04",
      gradEnd: "#962B00",
      strokeGlow: "#FF9254",
      softDropShadow:
        "drop-shadow(0px 3px 4px rgba(56,16,0,0.5)) drop-shadow(0px 8px 12px rgba(150,43,0,0.3)) drop-shadow(0px 16px 20px rgba(150,43,0,0.2))",
    },
    cyberpunk: {
      deckBorder: "rgba(0, 229, 190, 0.5)",
      glassAccentColor: "#E0F2FE",
      trayDotsColor: "rgba(0, 229, 190, 0.45)",
      trayBg: "#0F172A",
      cradleBg: "#16233B",
      cradleShadow:
        "inset 0px 0.5px 1.5px 0px rgba(0, 0, 0, 0.5), 0px 1px 0px rgba(0, 229, 190, 0.3)",
      textColor: "#E0F2FE",
      flareColor: "#F472B6",
      gradStart: "#1E293B",
      gradEnd: "#020617",
      strokeGlow: "#F472B6",
      softDropShadow:
        "drop-shadow(0px 3px 4px rgba(2,4,10,0.6)) drop-shadow(0px 8px 12px rgba(244,63,94,0.25)) drop-shadow(0px 16px 22px rgba(0,229,190,0.2))",
    },
  }[variant];

  const W = sizeConfig.coreW;
  const H = sizeConfig.coreH;

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
      {/* ─────────────────────────────────────────────────────────────
          LAYER 2: 100% Transparent Crystal Glass Deck (Frame 280 - 17:1481)
          Decorated with #F3F3FE laser ticks & corner dot arrays
         ───────────────────────────────────────────────────────────── */}
      <div
        className="relative flex items-center justify-center transition-all duration-300"
        style={{
          width: sizeConfig.deckW,
          height: sizeConfig.deckH,
          borderRadius: 30,
          border: `1.5px solid ${themeStyles.deckBorder}`,
          boxShadow:
            "0px 4px 20px rgba(26, 0, 108, 0.04), inset 0px 1px 1px rgba(255, 255, 255, 0.9)",
          backgroundColor: "transparent",
        }}
      >
        {/* Top Center Laser Ticks */}
        <div className="absolute top-[14px] left-1/2 -translate-x-1/2 flex items-center gap-[3px]">
          {Array.from({ length: sizeConfig.ticksCount }).map((_, i) => (
            <span
              key={i}
              className="w-[2.5px] h-[7px] rounded-[1px] shadow-[0px_0.5px_0.5px_#FFFFFF]"
              style={{ backgroundColor: themeStyles.glassAccentColor }}
            />
          ))}
        </div>

        {/* Bottom Center Laser Ticks */}
        <div className="absolute bottom-[14px] left-1/2 -translate-x-1/2 flex items-center gap-[3px]">
          {Array.from({ length: sizeConfig.ticksCount }).map((_, i) => (
            <span
              key={i}
              className="w-[2.5px] h-[7px] rounded-[1px] shadow-[0px_0.5px_0.5px_#FFFFFF]"
              style={{ backgroundColor: themeStyles.glassAccentColor }}
            />
          ))}
        </div>

        {/* Left Center Laser Ticks */}
        <div className="absolute left-[14px] top-1/2 -translate-y-1/2 flex flex-col items-center gap-[3px]">
          {Array.from({ length: sizeConfig.ticksCount }).map((_, i) => (
            <span
              key={i}
              className="w-[7px] h-[2.5px] rounded-[1px] shadow-[0px_0.5px_0.5px_#FFFFFF]"
              style={{ backgroundColor: themeStyles.glassAccentColor }}
            />
          ))}
        </div>

        {/* Right Center Laser Ticks */}
        <div className="absolute right-[14px] top-1/2 -translate-y-1/2 flex flex-col items-center gap-[3px]">
          {Array.from({ length: sizeConfig.ticksCount }).map((_, i) => (
            <span
              key={i}
              className="w-[7px] h-[2.5px] rounded-[1px] shadow-[0px_0.5px_0.5px_#FFFFFF]"
              style={{ backgroundColor: themeStyles.glassAccentColor }}
            />
          ))}
        </div>

        {/* Bottom Left 4-Dot Array (Node 17:1512-17:1518) */}
        <div className="absolute bottom-[14px] left-[32px] flex items-center gap-[4px]">
          <span className="w-[3px] h-[3px] rounded-full shadow-[0px_0.5px_0.5px_#FFFFFF]" style={{ backgroundColor: themeStyles.glassAccentColor }} />
          <span className="w-[3px] h-[3px] rounded-full shadow-[0px_0.5px_0.5px_#FFFFFF]" style={{ backgroundColor: themeStyles.glassAccentColor }} />
          <span className="w-[3px] h-[3px] rounded-full shadow-[0px_0.5px_0.5px_#FFFFFF]" style={{ backgroundColor: themeStyles.glassAccentColor }} />
          <span className="w-[3px] h-[3px] rounded-full shadow-[0px_0.5px_0.5px_#FFFFFF]" style={{ backgroundColor: themeStyles.glassAccentColor }} />
        </div>

        {/* 4 Corner Pin Accents */}
        <span className="absolute top-[14px] left-[14px] w-[3px] h-[3px] rounded-[1px] shadow-[0px_0.5px_0.5px_#FFFFFF]" style={{ backgroundColor: themeStyles.glassAccentColor }} />
        <span className="absolute top-[14px] right-[14px] w-[3px] h-[3px] rounded-[1px] shadow-[0px_0.5px_0.5px_#FFFFFF]" style={{ backgroundColor: themeStyles.glassAccentColor }} />
        <span className="absolute bottom-[14px] right-[14px] w-[3px] h-[3px] rounded-[1px] shadow-[0px_0.5px_0.5px_#FFFFFF]" style={{ backgroundColor: themeStyles.glassAccentColor }} />

        {/* ─────────────────────────────────────────────────────────────
            LAYER 3: Porcelain Cushion Tray (Frame 11 - 17:1527)
            Solid soft lavender-white plate (#F3F3FE) with balanced padding
           ───────────────────────────────────────────────────────────── */}
        <div
          className="relative flex flex-col items-center justify-between py-[16px] px-[16px]"
          style={{
            width: sizeConfig.trayW,
            height: sizeConfig.trayH,
            borderRadius: 24,
            backgroundColor: themeStyles.trayBg,
            boxShadow:
              "inset 0px 1.5px 0px 0px #FFFFFF, inset 0px -3px 0px 0px #DFDEFB, 0px 12px 28px rgba(26, 0, 108, 0.05), 0px 40px 60px rgba(26, 0, 108, 0.04)",
          }}
        >
          {/* Top Double-Row Dot Matrix Array */}
          <DotMatrixRow count={sizeConfig.dotsCount} color={themeStyles.trayDotsColor} />

          {/* ─────────────────────────────────────────────────────────────
              LAYER 3.5: Intermediate Cushion Cradle Plate (Node 17:1701)
              Wraps around the dark button with perfectly EVEN padding!
             ───────────────────────────────────────────────────────────── */}
          <div
            className="relative flex items-center justify-center my-auto"
            style={{
              width: cradleW,
              height: cradleH,
              borderRadius: 24,
              backgroundColor: themeStyles.cradleBg,
              boxShadow: themeStyles.cradleShadow,
              padding: sizeConfig.cradlePad,
            }}
          >
            {/* ─────────────────────────────────────────────────────────────
                EXACT FIGMA GLOW FLARE (Node 17:1704)
                Purplish (#D7B0FF) 45° Rotated Elliptical Spotlight with Gaussian Blur
               ───────────────────────────────────────────────────────────── */}
            <motion.div
              animate={{
                opacity: isHovered ? 1 : 0.85,
                scale: isPressed ? 0.95 : isHovered ? 1.15 : 1,
              }}
              transition={{ duration: 0.2 }}
              className="absolute pointer-events-none z-10"
              style={{
                width: sizeConfig.flareSize,
                height: sizeConfig.flareSize,
                left: sizeConfig.flareOffset,
                bottom: sizeConfig.flareOffset,
                mixBlendMode: "plus-lighter",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
                viewBox="0 0 103 103"
                fill="none"
                className="overflow-visible"
              >
                <defs>
                  <filter
                    id={`filter0_f_17_1704_${variant}`}
                    x="0"
                    y="0"
                    width="102.745"
                    height="102.745"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feGaussianBlur stdDeviation="7" result="effect1_foregroundBlur" />
                  </filter>

                  <radialGradient
                    id={`paint0_radial_17_1704_${variant}`}
                    cx="0"
                    cy="0"
                    r="1"
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(51.3725 23.1033) rotate(90) scale(69.5514 55.5978)"
                  >
                    <stop stopColor={themeStyles.flareColor} />
                    <stop offset="1" stopColor={themeStyles.flareColor} stopOpacity="0" />
                  </radialGradient>
                </defs>

                <g filter={`url(#filter0_f_17_1704_${variant})`}>
                  <ellipse
                    cx="51.3726"
                    cy="51.3725"
                    rx="33"
                    ry="41.2821"
                    transform="rotate(45 51.3726 51.3725)"
                    fill={`url(#paint0_radial_17_1704_${variant})`}
                    fillOpacity="0.75"
                  />
                </g>
              </svg>
            </motion.div>

            {/* ─────────────────────────────────────────────────────────────
                LAYER 4: EXACT FIGMA CORE BUTTON CAP (Node 17:1702/17:1703)
                Clean continuous path with natural multi-tier tactile drop shadow
               ───────────────────────────────────────────────────────────── */}
            <motion.button
              type="button"
              disabled={disabled}
              onClick={onClick}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => {
                setIsHovered(false);
                setIsPressed(false);
              }}
              onMouseDown={() => setIsPressed(true)}
              onMouseUp={() => setIsPressed(false)}
              onTouchStart={() => setIsPressed(true)}
              onTouchEnd={() => setIsPressed(false)}
              animate={{
                y: isPressed ? 2 : isHovered ? sizeConfig.liftY : 0,
                scale: isPressed ? 0.985 : 1,
              }}
              transition={{
                type: "spring",
                stiffness: 420,
                damping: 24,
                mass: 0.65,
              }}
              className="relative cursor-pointer focus:outline-none flex items-center justify-center select-none z-20"
              style={{
                width: W,
                height: H,
                filter: themeStyles.softDropShadow,
              }}
            >
              <svg
                width={W}
                height={H}
                viewBox="0 0 578 148"
                className="absolute inset-0 size-full pointer-events-none"
              >
                <defs>
                  {/* Ultra-Fine Stippled Noise Filter matching Figma pattern0_17_1702 */}
                  <filter id={`stippleNoise-${variant}`} x="0" y="0" width="100%" height="100%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
                    <feColorMatrix type="matrix" values="1 0 0 0 1   0 1 0 0 1   0 0 1 0 1  0 0 0 0.08 0" />
                  </filter>

                  {/* Exact Figma 17:1702 Radial Gradient */}
                  <radialGradient
                    id={`paint0_radial_17_1702_${variant}`}
                    cx="0"
                    cy="0"
                    r="1"
                    gradientTransform="matrix(148 135.667 -299.77 51.0796 0 12.3333)"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor={themeStyles.gradStart} />
                    <stop offset="1" stopColor={themeStyles.gradEnd} />
                  </radialGradient>

                  {/* Exact Figma 17:1702 Chamfer Stroke Glow Gradient */}
                  <radialGradient
                    id={`paint1_radial_17_1702_${variant}`}
                    cx="0"
                    cy="0"
                    r="1"
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(25.5 125.5) rotate(-39.9575) scale(48.2701 38.6161)"
                  >
                    <stop stopColor={themeStyles.strokeGlow} />
                    <stop offset="0.7" stopColor={themeStyles.strokeGlow} stopOpacity="0.85" />
                    <stop offset="1" stopColor={themeStyles.strokeGlow} stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* 1. Main Dark Button Cap Body with Exact Figma Radial Gradient */}
                <path d={FIGMA_CORE_PATH} fill={`url(#paint0_radial_17_1702_${variant})`} />

                {/* 2. Fine Stippled Grain Texture Overlay */}
                <rect
                  width="578"
                  height="148"
                  clipPath="url(#coreCapClipPath)"
                  filter={`url(#stippleNoise-${variant})`}
                />

                <clipPath id="coreCapClipPath">
                  <path d={FIGMA_CORE_PATH} />
                </clipPath>

                {/* 3. LIGHT GLOWING BORDER on the chamfer edge */}
                <path
                  d={FIGMA_STROKE_PATH}
                  stroke={`url(#paint1_radial_17_1702_${variant})`}
                  strokeWidth="2.5"
                  fill="none"
                />

                {/* 4. Top subtle specular bevel */}
                <path
                  d="M 15 1 H 563"
                  stroke="rgba(255, 255, 255, 0.22)"
                  strokeWidth="1"
                  fill="none"
                />
              </svg>

              {/* Typography Label (node 17:1703) */}
              <span
                className={`relative z-10 font-medium ${sizeConfig.fontSize} tracking-tight whitespace-nowrap leading-none select-none`}
                style={{
                  color: themeStyles.textColor,
                  textShadow: "0px 1px 2px rgba(0,0,0,0.8)",
                  fontFamily: "var(--font-jakarta), var(--font-sans), sans-serif",
                }}
              >
                {label}
              </span>
            </motion.button>
          </div>

          {/* Bottom Double-Row Dot Matrix Array */}
          <DotMatrixRow count={sizeConfig.dotsCount} color={themeStyles.trayDotsColor} />
        </div>
      </div>
    </div>
  );
};

export default SmashTactileButton;
