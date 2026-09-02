"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export type GlossyGelTheme =
  | "emerald-gel"
  | "cyan-gel"
  | "violet-gel"
  | "magma-gel"
  | "silver-glass"
  | "obsidian-glass";

export type GlossyGelSize = "xs" | "sm" | "md" | "lg" | "xl";
export type GlossyGelStateMode = "interactive" | "resting" | "hover";

export interface GlossyGelButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button text label */
  children?: React.ReactNode;
  /** Visual color theme preset */
  theme?: GlossyGelTheme;
  /** Optional custom text color */
  textColor?: string;
  /** Size variant */
  size?: GlossyGelSize;
  /** Fixed state preview mode */
  stateMode?: GlossyGelStateMode;
  /** Optional icon rendered before label */
  iconLeft?: React.ReactNode;
  /** Optional icon rendered after label */
  iconRight?: React.ReactNode;
  /** Loading state spinner */
  isLoading?: boolean;
  /** Additional CSS class names */
  className?: string;
}

interface ThemeConfig {
  name: string;
  gelBg: string;
  textColor: string;
  textShadow: string;
  shadowLayer: string;
  highlightGradient: string;
  ambientGlow: string;
  hoverSheen: string;
}

const GEL_THEMES: Record<GlossyGelTheme, ThemeConfig> = {
  "emerald-gel": {
    name: "Emerald Mint Gel (1:1 Figma)",
    gelBg: "linear-gradient(180deg, #32E49D 0%, #20C982 100%)",
    textColor: "#072B1F",
    textShadow: "0 1px 0 rgba(255, 255, 255, 0.4)",
    shadowLayer:
      "3px 4px 6px rgba(35, 46, 64, 0.22), " +
      "inset 0 -7px 8px -6px rgba(76, 86, 108, 0.90), " +
      "inset 1px 1px 2px rgba(76, 86, 108, 0.80), " +
      "inset 0 -1px 3px rgba(255, 255, 255, 0.45)",
    highlightGradient:
      "linear-gradient(180deg, rgba(255, 255, 255, 0.85) 0%, rgba(235, 242, 255, 0.35) 60%, rgba(255, 255, 255, 0) 100%)",
    ambientGlow: "rgba(50, 228, 157, 0.45)",
    hoverSheen: "rgba(255, 255, 255, 0.25)",
  },
  "cyan-gel": {
    name: "Electric Cyan",
    gelBg: "linear-gradient(180deg, #38BDF8 0%, #0284C7 100%)",
    textColor: "#082F49",
    textShadow: "0 1px 0 rgba(255, 255, 255, 0.45)",
    shadowLayer:
      "3px 4px 6px rgba(12, 74, 110, 0.25), " +
      "inset 0 -7px 8px -6px rgba(14, 116, 144, 0.90), " +
      "inset 1px 1px 2px rgba(14, 116, 144, 0.80), " +
      "inset 0 -1px 3px rgba(255, 255, 255, 0.45)",
    highlightGradient:
      "linear-gradient(180deg, rgba(255, 255, 255, 0.85) 0%, rgba(224, 242, 254, 0.4) 60%, rgba(255, 255, 255, 0) 100%)",
    ambientGlow: "rgba(56, 189, 248, 0.45)",
    hoverSheen: "rgba(255, 255, 255, 0.3)",
  },
  "violet-gel": {
    name: "Cyber Violet",
    gelBg: "linear-gradient(180deg, #C084FC 0%, #9333EA 100%)",
    textColor: "#2E1065",
    textShadow: "0 1px 0 rgba(255, 255, 255, 0.45)",
    shadowLayer:
      "3px 4px 6px rgba(88, 28, 135, 0.25), " +
      "inset 0 -7px 8px -6px rgba(126, 34, 206, 0.90), " +
      "inset 1px 1px 2px rgba(126, 34, 206, 0.80), " +
      "inset 0 -1px 3px rgba(255, 255, 255, 0.45)",
    highlightGradient:
      "linear-gradient(180deg, rgba(255, 255, 255, 0.85) 0%, rgba(243, 232, 255, 0.4) 60%, rgba(255, 255, 255, 0) 100%)",
    ambientGlow: "rgba(192, 132, 252, 0.45)",
    hoverSheen: "rgba(255, 255, 255, 0.3)",
  },
  "magma-gel": {
    name: "Magma Amber",
    gelBg: "linear-gradient(180deg, #FB923C 0%, #EA580C 100%)",
    textColor: "#431407",
    textShadow: "0 1px 0 rgba(255, 255, 255, 0.45)",
    shadowLayer:
      "3px 4px 6px rgba(154, 52, 18, 0.25), " +
      "inset 0 -7px 8px -6px rgba(194, 65, 12, 0.90), " +
      "inset 1px 1px 2px rgba(194, 65, 12, 0.80), " +
      "inset 0 -1px 3px rgba(255, 255, 255, 0.45)",
    highlightGradient:
      "linear-gradient(180deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 237, 213, 0.4) 60%, rgba(255, 255, 255, 0) 100%)",
    ambientGlow: "rgba(251, 146, 60, 0.45)",
    hoverSheen: "rgba(255, 255, 255, 0.3)",
  },
  "silver-glass": {
    name: "Frosted Silver Glass",
    gelBg: "linear-gradient(180deg, #E2E8F0 0%, #CBD5E1 100%)",
    textColor: "#0F172A",
    textShadow: "0 1px 0 rgba(255, 255, 255, 0.6)",
    shadowLayer:
      "3px 4px 6px rgba(30, 41, 59, 0.2), " +
      "inset 0 -7px 8px -6px rgba(100, 116, 139, 0.85), " +
      "inset 1px 1px 2px rgba(100, 116, 139, 0.75), " +
      "inset 0 -1px 3px rgba(255, 255, 255, 0.6)",
    highlightGradient:
      "linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(241, 245, 249, 0.4) 60%, rgba(255, 255, 255, 0) 100%)",
    ambientGlow: "rgba(226, 232, 240, 0.3)",
    hoverSheen: "rgba(255, 255, 255, 0.35)",
  },
  "obsidian-glass": {
    name: "Dark Obsidian Glass",
    gelBg: "linear-gradient(180deg, #272A34 0%, #171920 100%)",
    textColor: "#F8FAFC",
    textShadow: "0 1px 1px rgba(0, 0, 0, 0.8)",
    shadowLayer:
      "3px 4px 8px rgba(0, 0, 0, 0.45), " +
      "inset 0 -7px 8px -6px rgba(0, 0, 0, 0.95), " +
      "inset 1px 1px 2px rgba(255, 255, 255, 0.15), " +
      "inset 0 -1px 3px rgba(255, 255, 255, 0.2)",
    highlightGradient:
      "linear-gradient(180deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.05) 60%, rgba(255, 255, 255, 0) 100%)",
    ambientGlow: "rgba(255, 255, 255, 0.1)",
    hoverSheen: "rgba(255, 255, 255, 0.15)",
  },
};

const SIZE_STYLES: Record<
  GlossyGelSize,
  {
    padding: string;
    height: string;
    fontSize: string;
    borderRadius: number;
    iconGap: string;
  }
> = {
  xs: {
    padding: "px-3 py-1.5",
    height: "h-7",
    fontSize: "text-xs",
    borderRadius: 10,
    iconGap: "gap-1",
  },
  sm: {
    padding: "px-4 py-2",
    height: "h-9",
    fontSize: "text-sm",
    borderRadius: 14,
    iconGap: "gap-1.5",
  },
  md: {
    padding: "px-7 py-3.5",
    height: "h-[47px]",
    fontSize: "text-base",
    borderRadius: 18,
    iconGap: "gap-2",
  },
  lg: {
    padding: "px-8 py-4",
    height: "h-[54px]",
    fontSize: "text-lg",
    borderRadius: 20,
    iconGap: "gap-2.5",
  },
  xl: {
    padding: "px-10 py-5",
    height: "h-[62px]",
    fontSize: "text-xl",
    borderRadius: 24,
    iconGap: "gap-3",
  },
};

/**
 * Glossy Gel Button (Skeuomorphic Liquid Glass CTA)
 * 1:1 Pixel-Accurate Implementation from Figma Node (2:2 / Glossy Gel Button)
 */
export const GlossyGelButton = React.forwardRef<
  HTMLButtonElement,
  GlossyGelButtonProps
>(
  (
    {
      children = "Get Started",
      theme = "emerald-gel",
      textColor,
      size = "md",
      stateMode = "interactive",
      iconLeft,
      iconRight,
      isLoading = false,
      disabled = false,
      className = "",
      onClick,
      ...restProps
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    const effectiveHovered = stateMode === "hover" ? true : stateMode === "resting" ? false : isHovered;

    const themeConfig = GEL_THEMES[theme] || GEL_THEMES["emerald-gel"];
    const sizeConfig = SIZE_STYLES[size] || SIZE_STYLES.md;

    return (
      <motion.button
        ref={ref}
        type="button"
        disabled={disabled || isLoading}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsPressed(false);
        }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onClick={onClick}
        whileHover={stateMode === "interactive" ? { scale: 1.025 } : undefined}
        whileTap={stateMode === "interactive" ? { scale: 0.97 } : undefined}
        animate={{
          scale: isPressed ? 0.97 : effectiveHovered ? 1.025 : 1,
        }}
        transition={{ type: "spring", stiffness: 450, damping: 25 }}
        className={`relative inline-flex items-center justify-center font-semibold select-none cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500 overflow-hidden ${
          sizeConfig.padding
        } ${sizeConfig.height} ${sizeConfig.fontSize} ${sizeConfig.iconGap} ${
          disabled
            ? "opacity-50 cursor-not-allowed grayscale-[30%]"
            : "active:brightness-95"
        } ${className}`}
        style={{
          borderRadius: sizeConfig.borderRadius,
          background: themeConfig.gelBg,
          boxShadow: themeConfig.shadowLayer,
          color: textColor || themeConfig.textColor,
        }}
        {...(restProps as any)}
      >
        {/* Soft Ambient Ground Bloom */}
        <div
          className="absolute -inset-1 rounded-[22px] pointer-events-none opacity-50 transition-opacity duration-300 -z-10"
          style={{
            background: themeConfig.ambientGlow,
            filter: "blur(10px)",
            opacity: effectiveHovered ? 0.75 : 0.35,
          }}
        />

        {/* Curved Organic Top Gloss Highlight (Figma Node 2:4) */}
        <div
          className="absolute inset-x-2 top-1 h-[65%] pointer-events-none rounded-[14px]"
          style={{
            background: themeConfig.highlightGradient,
            filter: "blur(3px)",
            opacity: isPressed ? 0.6 : effectiveHovered ? 1 : 0.85,
            transition: "opacity 0.2s ease",
          }}
        />

        {/* Specular Interactive Sheen Wave on Hover */}
        <motion.div
          animate={{
            x: effectiveHovered ? ["-120%", "150%"] : "-120%",
          }}
          transition={{
            duration: 1.1,
            repeat: effectiveHovered ? Infinity : 0,
            repeatDelay: 1.8,
            ease: "easeInOut",
          }}
          className="absolute inset-0 pointer-events-none w-1/2 -skew-x-12"
          style={{
            background: `linear-gradient(90deg, transparent, ${themeConfig.hoverSheen}, transparent)`,
          }}
        />

        {/* Content Layer with Crisp Depth Text Shadow */}
        <span
          className="relative z-10 inline-flex items-center gap-2 font-semibold tracking-tight"
          style={{
            textShadow: themeConfig.textShadow,
          }}
        >
          {isLoading ? (
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            iconLeft
          )}

          {children}

          {!isLoading && iconRight}
        </span>
      </motion.button>
    );
  }
);

GlossyGelButton.displayName = "GlossyGelButton";

export default GlossyGelButton;
