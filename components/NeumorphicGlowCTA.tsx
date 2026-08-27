"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export type NeumorphicGlowShape = "pill" | "squircle";
export type NeumorphicGlowTheme = "default" | "dark" | "orange" | "cyberpunk" | "minimal";
export type NeumorphicGlowSize = "sm" | "md" | "lg";
export type NeumorphicNeonPreset =
  | "emerald"
  | "cyan"
  | "magenta"
  | "amber"
  | "violet"
  | "crimson"
  | "orange"
  | "electricBlue"
  | "white";

export const NEON_PRESETS: Record<
  NeumorphicNeonPreset,
  { name: string; badgeBg: string; arrowColor: string; glowColor: string; innerShadow: string }
> = {
  emerald: {
    name: "Neon Emerald (Figma)",
    badgeBg: "#CBF0CD",
    arrowColor: "#49C33E",
    glowColor: "rgba(90, 255, 75, 0.35)",
    innerShadow: "inset 2.6px 5.2px 6.5px 0px rgba(51,217,37,0.35)",
  },
  cyan: {
    name: "Electric Cyan",
    badgeBg: "#C7F5F8",
    arrowColor: "#06B6D4",
    glowColor: "rgba(6, 182, 212, 0.45)",
    innerShadow: "inset 2.6px 5.2px 6.5px 0px rgba(6, 182, 212, 0.35)",
  },
  magenta: {
    name: "Neon Magenta",
    badgeBg: "#FCE7F3",
    arrowColor: "#EC4899",
    glowColor: "rgba(236, 72, 153, 0.45)",
    innerShadow: "inset 2.6px 5.2px 6.5px 0px rgba(236, 72, 153, 0.35)",
  },
  amber: {
    name: "Warm Gold",
    badgeBg: "#FEF3C7",
    arrowColor: "#F59E0B",
    glowColor: "rgba(245, 158, 11, 0.45)",
    innerShadow: "inset 2.6px 5.2px 6.5px 0px rgba(245, 158, 11, 0.35)",
  },
  violet: {
    name: "Cosmic Violet",
    badgeBg: "#EDE9FE",
    arrowColor: "#8B5CF6",
    glowColor: "rgba(139, 92, 246, 0.45)",
    innerShadow: "inset 2.6px 5.2px 6.5px 0px rgba(139, 92, 246, 0.35)",
  },
  crimson: {
    name: "Neon Ruby",
    badgeBg: "#FFE4E6",
    arrowColor: "#F43F5E",
    glowColor: "rgba(244, 63, 94, 0.45)",
    innerShadow: "inset 2.6px 5.2px 6.5px 0px rgba(244, 63, 94, 0.35)",
  },
  orange: {
    name: "Pirate Orange",
    badgeBg: "#FFEDD5",
    arrowColor: "#FF5B04",
    glowColor: "rgba(255, 91, 4, 0.45)",
    innerShadow: "inset 2.6px 5.2px 6.5px 0px rgba(255, 91, 4, 0.35)",
  },
  electricBlue: {
    name: "Electric Blue",
    badgeBg: "#DBEAFE",
    arrowColor: "#3B82F6",
    glowColor: "rgba(59, 130, 246, 0.45)",
    innerShadow: "inset 2.6px 5.2px 6.5px 0px rgba(59, 130, 246, 0.35)",
  },
  white: {
    name: "Titanium White",
    badgeBg: "#F4F4F5",
    arrowColor: "#18181B",
    glowColor: "rgba(0, 0, 0, 0.15)",
    innerShadow: "inset 2.6px 5.2px 6.5px 0px rgba(0, 0, 0, 0.1)",
  },
};

export interface NeumorphicGlowCTAProps {
  /** Shape variant: "pill" (Node 14:642 - Learn more) or "squircle" (Node 14:669 - Get more info) */
  variant?: NeumorphicGlowShape;
  /** Visual color theme: "default" | "dark" | "orange" | "cyberpunk" | "minimal" */
  theme?: NeumorphicGlowTheme;
  /** Size scale: "sm" | "md" | "lg" */
  size?: NeumorphicGlowSize;
  /** Neon glow preset for arrow circle */
  neonPreset?: NeumorphicNeonPreset;
  /** Text label on the button */
  label?: string;
  /** Click event handler */
  onClick?: () => void;
  /** Custom scale factor */
  scale?: number;
  /** Custom badge background color (overrides theme & neonPreset) */
  badgeColor?: string;
  /** Custom arrow stroke color (overrides theme & neonPreset) */
  arrowColor?: string;
  /** Custom glow bloom color (overrides theme & neonPreset) */
  glowColor?: string;
  /** Additional CSS classes */
  className?: string;
  /** Custom children to override label */
  children?: React.ReactNode;
}

/**
 * 1:1 Pixel-Accurate Implementation of Figma Nodes 14:642 & 14:669
 * Master Button Collection - Claymorphic / Neumorphic Glow CTA with full Themes, Neon Presets & Sizes
 */
export const NeumorphicGlowCTA: React.FC<NeumorphicGlowCTAProps> = ({
  variant = "pill",
  theme = "default",
  size = "md",
  neonPreset,
  label,
  onClick,
  scale = 1,
  badgeColor: customBadgeColor,
  arrowColor: customArrowColor,
  glowColor: customGlowColor,
  className = "",
  children,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isPill = variant === "pill";
  const defaultLabel = isPill ? "Learn more" : "Get more info";
  const displayText = label !== undefined ? label : defaultLabel;

  // Theme configuration definitions
  const themeConfig = {
    default: {
      pillBg: "linear-gradient(172.34deg, rgb(225, 225, 225) 5.985%, rgb(215, 215, 215) 94.894%)",
      squircleBg: "#E1E1E1",
      textColor: "#000000",
      textShadow: "0px 1.5px 0px rgba(255, 255, 255, 0.5)",
      badgeBg: "#CBF0CD",
      arrowColor: "#49C33E",
      glowColor: "rgba(90, 255, 75, 0.35)",
      badgeInnerShadow: "inset 2.6px 5.2px 6.5px 0px rgba(51,217,37,0.35)",
      pillInsetShadow:
        "inset 2px 2px 4px 0px rgba(255,255,255,0.15), inset 4px 4px 14px 0px rgba(255,255,255,0.75), inset -4px -4px 4px 0px rgba(0,0,0,0.08), inset -10px -10px 14px -6px rgba(0,0,0,0.15)",
      pillDropShadow:
        "2px 4px 4px 0px rgba(0,0,0,0.1), 85px 85px 85px 0px rgba(0,0,0,0.09), 35.5px 35.5px 35.5px 0px rgba(0,0,0,0.06), 19px 19px 19px 0px rgba(0,0,0,0.05), 10.6px 10.6px 10.6px 0px rgba(0,0,0,0.05), 5.6px 5.6px 5.6px 0px rgba(0,0,0,0.04), 2.35px 2.35px 2.35px 0px rgba(0,0,0,0.03)",
      squircleShadow:
        "-6px -6px 6px 3px rgba(255,255,255,0.4), 6px -6px 6px 3px rgba(205,205,205,0.4), -6px 6px 6px 3px rgba(205,205,205,0.4), 6px 6px 6px 3px rgba(0,0,0,0.15), 0px 0px 60px 30px #e1e1e1",
    },
    dark: {
      pillBg: "linear-gradient(172.34deg, rgb(42, 45, 54) 5.985%, rgb(30, 32, 40) 94.894%)",
      squircleBg: "#22252E",
      textColor: "#FFFFFF",
      textShadow: "0px 1px 2px rgba(0, 0, 0, 0.8)",
      badgeBg: "#164E63",
      arrowColor: "#06B6D4",
      glowColor: "rgba(6, 182, 212, 0.45)",
      badgeInnerShadow: "inset 2.6px 5.2px 6.5px 0px rgba(6, 182, 212, 0.4)",
      pillInsetShadow:
        "inset 2px 2px 4px 0px rgba(255,255,255,0.1), inset 4px 4px 14px 0px rgba(255,255,255,0.15), inset -4px -4px 4px 0px rgba(0,0,0,0.4), inset -10px -10px 14px -6px rgba(0,0,0,0.6)",
      pillDropShadow:
        "2px 6px 12px 0px rgba(0,0,0,0.5), 35px 35px 35px 0px rgba(0,0,0,0.35), 10px 10px 15px 0px rgba(0,0,0,0.25)",
      squircleShadow:
        "-6px -6px 6px 3px rgba(255,255,255,0.06), 6px -6px 6px 3px rgba(0,0,0,0.3), -6px 6px 6px 3px rgba(0,0,0,0.3), 6px 6px 8px 3px rgba(0,0,0,0.5), 0px 0px 40px 10px rgba(6,182,212,0.08)",
    },
    orange: {
      pillBg: "linear-gradient(172.34deg, rgb(255, 110, 30) 5.985%, rgb(235, 80, 0) 94.894%)",
      squircleBg: "#FF5B04",
      textColor: "#FFFFFF",
      textShadow: "0px 1.5px 2px rgba(120, 25, 0, 0.6)",
      badgeBg: "#FFF1E7",
      arrowColor: "#FF5B04",
      glowColor: "rgba(255, 91, 4, 0.5)",
      badgeInnerShadow: "inset 2.6px 5.2px 6.5px 0px rgba(255,91,4,0.3)",
      pillInsetShadow:
        "inset 2px 2px 4px 0px rgba(255,255,255,0.3), inset 4px 4px 14px 0px rgba(255,255,255,0.5), inset -4px -4px 4px 0px rgba(120,25,0,0.2), inset -10px -10px 14px -6px rgba(120,25,0,0.35)",
      pillDropShadow:
        "2px 6px 14px 0px rgba(255,91,4,0.35), 35px 35px 40px 0px rgba(255,91,4,0.15), 10px 10px 15px 0px rgba(0,0,0,0.15)",
      squircleShadow:
        "-6px -6px 6px 3px rgba(255,255,255,0.35), 6px -6px 6px 3px rgba(200,60,0,0.3), -6px 6px 6px 3px rgba(200,60,0,0.3), 6px 6px 8px 3px rgba(140,30,0,0.4), 0px 0px 50px 15px rgba(255,91,4,0.2)",
    },
    cyberpunk: {
      pillBg: "linear-gradient(172.34deg, rgb(28, 22, 48) 5.985%, rgb(18, 14, 34) 94.894%)",
      squircleBg: "#1E1735",
      textColor: "#F3E8FF",
      textShadow: "0px 0px 8px rgba(168, 85, 247, 0.6)",
      badgeBg: "#4C1D95",
      arrowColor: "#C084FC",
      glowColor: "rgba(192, 132, 252, 0.55)",
      badgeInnerShadow: "inset 2.6px 5.2px 6.5px 0px rgba(192,132,252,0.4)",
      pillInsetShadow:
        "inset 2px 2px 4px 0px rgba(192,132,252,0.2), inset 4px 4px 14px 0px rgba(168,85,247,0.25), inset -4px -4px 4px 0px rgba(0,0,0,0.5), inset -10px -10px 14px -6px rgba(0,0,0,0.7)",
      pillDropShadow:
        "2px 6px 16px 0px rgba(168,85,247,0.35), 35px 35px 45px 0px rgba(0,0,0,0.5), 10px 10px 15px 0px rgba(0,0,0,0.3)",
      squircleShadow:
        "-6px -6px 6px 3px rgba(168,85,247,0.15), 6px -6px 6px 3px rgba(0,0,0,0.4), -6px 6px 6px 3px rgba(0,0,0,0.4), 6px 6px 8px 3px rgba(0,0,0,0.6), 0px 0px 50px 15px rgba(168,85,247,0.2)",
    },
    minimal: {
      pillBg: "linear-gradient(172.34deg, rgb(255, 255, 255) 5.985%, rgb(245, 245, 245) 94.894%)",
      squircleBg: "#FAFAFA",
      textColor: "#18181B",
      textShadow: "0px 1px 0px rgba(255, 255, 255, 0.9)",
      badgeBg: "#F4F4F5",
      arrowColor: "#18181B",
      glowColor: "rgba(0, 0, 0, 0.12)",
      badgeInnerShadow: "inset 2.6px 5.2px 6.5px 0px rgba(0,0,0,0.1)",
      pillInsetShadow:
        "inset 2px 2px 4px 0px rgba(255,255,255,0.8), inset 4px 4px 14px 0px rgba(255,255,255,0.9), inset -4px -4px 4px 0px rgba(0,0,0,0.04), inset -10px -10px 14px -6px rgba(0,0,0,0.08)",
      pillDropShadow:
        "2px 4px 8px 0px rgba(0,0,0,0.06), 25px 25px 30px 0px rgba(0,0,0,0.04), 10px 10px 15px 0px rgba(0,0,0,0.03)",
      squircleShadow:
        "-6px -6px 6px 3px rgba(255,255,255,0.9), 6px -6px 6px 3px rgba(220,220,220,0.3), -6px 6px 6px 3px rgba(220,220,220,0.3), 6px 6px 6px 3px rgba(0,0,0,0.08), 0px 0px 40px 10px #ffffff",
    },
  };

  const currentTheme = themeConfig[theme] || themeConfig.default;
  const activeNeon = neonPreset ? NEON_PRESETS[neonPreset] : null;

  const activeBadgeColor = customBadgeColor || activeNeon?.badgeBg || currentTheme.badgeBg;
  const activeArrowColor = customArrowColor || activeNeon?.arrowColor || currentTheme.arrowColor;
  const activeGlowColor = customGlowColor || activeNeon?.glowColor || currentTheme.glowColor;
  const activeBadgeInnerShadow = activeNeon?.innerShadow || currentTheme.badgeInnerShadow;

  // Size scaling configurations
  const sizeConfig = {
    sm: {
      pillPadding: "pl-[14px] pr-[26px] py-[12px]",
      pillGap: "gap-[18px]",
      pillRadius: "rounded-[28px]",
      pillBadgePadding: "p-[9px]",
      pillBadgeRadius: "rounded-[32px]",
      pillArrowSize: 14,
      pillFontSize: "text-[15px] leading-[22px]",
      squirclePadding: "pl-[14px] pr-[6px] py-[6px]",
      squircleGap: "gap-[10px]",
      squircleRadius: "rounded-[8px]",
      squircleBadgePadding: "p-[7px]",
      squircleBadgeRadius: "rounded-[4px]",
      squircleArrowSize: 12,
      squircleFontSize: "text-[14px] leading-[22px]",
    },
    md: {
      pillPadding: "pl-[20px] pr-[40px] py-[20px]",
      pillGap: "gap-[30px]",
      pillRadius: "rounded-[40px]",
      pillBadgePadding: "p-[13px]",
      pillBadgeRadius: "rounded-[45.5px]",
      pillArrowSize: 18,
      pillFontSize: "text-[20px] leading-[31px]",
      squirclePadding: "pl-[18px] pr-[8px] py-[8px]",
      squircleGap: "gap-[15px]",
      squircleRadius: "rounded-[10px]",
      squircleBadgePadding: "p-[10px]",
      squircleBadgeRadius: "rounded-[5px]",
      squircleArrowSize: 15,
      squircleFontSize: "text-[18px] leading-[31px]",
    },
    lg: {
      pillPadding: "pl-[26px] pr-[52px] py-[26px]",
      pillGap: "gap-[38px]",
      pillRadius: "rounded-[52px]",
      pillBadgePadding: "p-[16px]",
      pillBadgeRadius: "rounded-[60px]",
      pillArrowSize: 23,
      pillFontSize: "text-[24px] leading-[38px]",
      squirclePadding: "pl-[24px] pr-[12px] py-[12px]",
      squircleGap: "gap-[20px]",
      squircleRadius: "rounded-[14px]",
      squircleBadgePadding: "p-[13px]",
      squircleBadgeRadius: "rounded-[7px]",
      squircleArrowSize: 19,
      squircleFontSize: "text-[22px] leading-[38px]",
    },
  }[size];

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.025 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`relative inline-flex items-center select-none cursor-pointer outline-none ${className}`}
      style={{
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: "center center",
      }}
    >
      {/* ─────────────────────────────────────────────────────────────
          PILL VARIANT (Figma Node 14:642 / 14:647)
         ───────────────────────────────────────────────────────────── */}
      {isPill ? (
        <div
          className={`relative flex items-center justify-center ${sizeConfig.pillGap} ${sizeConfig.pillPadding} ${sizeConfig.pillRadius} overflow-hidden`}
          style={{
            backgroundImage: currentTheme.pillBg,
            boxShadow: currentTheme.pillDropShadow,
          }}
        >
          {/* Inset Clay Specular Bevel Highlight / Shadow Layer */}
          <div
            className="absolute inset-0 pointer-events-none rounded-[inherit]"
            style={{
              boxShadow: currentTheme.pillInsetShadow,
            }}
          />

          {/* Glowing Neon Badge (Node 14:723) */}
          <motion.div
            className={`relative flex items-center justify-center ${sizeConfig.pillBadgePadding} ${sizeConfig.pillBadgeRadius} shrink-0 overflow-hidden`}
            animate={{
              boxShadow: isHovered
                ? `0px 0px 32px 4px ${activeGlowColor}, 0px 1.3px 1.3px 0px rgba(255,255,255,0.95), 0px -1.3px 1.3px 0px rgba(0,0,0,0.1)`
                : `0px 0px 26px 0px ${activeGlowColor}, 0px 1.3px 1.3px 0px rgba(255,255,255,0.85), 0px -1.3px 1.3px 0px rgba(0,0,0,0.1)`,
            }}
            transition={{ duration: 0.2 }}
            style={{
              backgroundColor: activeBadgeColor,
            }}
          >
            {/* Inset Badge Dish Depth */}
            <div
              className="absolute inset-0 pointer-events-none rounded-[inherit]"
              style={{
                boxShadow: activeBadgeInnerShadow,
              }}
            />

            {/* Diagonal Arrow Vector Icon with Crisp Glow */}
            <div
              className="relative flex items-center justify-center"
              style={{ width: sizeConfig.pillArrowSize, height: sizeConfig.pillArrowSize }}
            >
              <svg
                width={sizeConfig.pillArrowSize}
                height={sizeConfig.pillArrowSize}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="overflow-visible"
                style={{
                  filter: `drop-shadow(0px 0px 3px ${activeArrowColor}) drop-shadow(0px 1px 1px rgba(0,0,0,0.15))`,
                }}
              >
                <path
                  d="M7 17L17 7M17 7H9M17 7V15"
                  stroke={activeArrowColor}
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </motion.div>

          {/* Button Text Label */}
          {children || (
            <span
              className={`capitalize ${sizeConfig.pillFontSize} font-normal whitespace-nowrap`}
              style={{
                fontFamily: "var(--font-jakarta), var(--font-sans), sans-serif",
                color: currentTheme.textColor,
                textShadow: currentTheme.textShadow,
              }}
            >
              {displayText}
            </span>
          )}
        </div>
      ) : (
        /* ─────────────────────────────────────────────────────────────
            SQUIRCLE / CHAMFER VARIANT (Figma Node 14:669 / 14:671)
           ───────────────────────────────────────────────────────────── */
        <div
          className={`relative flex items-center justify-center ${sizeConfig.squircleGap} ${sizeConfig.squirclePadding} ${sizeConfig.squircleRadius} overflow-hidden`}
          style={{
            backgroundColor: currentTheme.squircleBg,
            boxShadow: currentTheme.squircleShadow,
          }}
        >
          {/* Button Text Label */}
          {children || (
            <span
              className={`capitalize ${sizeConfig.squircleFontSize} font-normal whitespace-nowrap`}
              style={{
                fontFamily: "var(--font-jakarta), var(--font-sans), sans-serif",
                color: currentTheme.textColor,
                textShadow: currentTheme.textShadow,
              }}
            >
              {displayText}
            </span>
          )}

          {/* Glowing Neon Squircle Badge (Node 14:673) */}
          <motion.div
            className={`relative flex items-center justify-center ${sizeConfig.squircleBadgePadding} ${sizeConfig.squircleBadgeRadius} shrink-0 overflow-hidden`}
            animate={{
              boxShadow: isHovered
                ? `0px 0px 24px 3px ${activeGlowColor}, 0px 1px 1px 0px rgba(255,255,255,0.95), 0px -1px 1px 0px rgba(0,0,0,0.1)`
                : `0px 0px 20px 0px ${activeGlowColor}, 0px 1px 1px 0px rgba(255,255,255,0.85), 0px -1px 1px 0px rgba(0,0,0,0.1)`,
            }}
            transition={{ duration: 0.2 }}
            style={{
              backgroundColor: activeBadgeColor,
            }}
          >
            {/* Inset Badge Dish Depth */}
            <div
              className="absolute inset-0 pointer-events-none rounded-[inherit]"
              style={{
                boxShadow: activeBadgeInnerShadow,
              }}
            />

            {/* Diagonal Arrow Vector Icon with Crisp Glow */}
            <div
              className="relative flex items-center justify-center"
              style={{ width: sizeConfig.squircleArrowSize, height: sizeConfig.squircleArrowSize }}
            >
              <svg
                width={sizeConfig.squircleArrowSize}
                height={sizeConfig.squircleArrowSize}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="overflow-visible"
                style={{
                  filter: `drop-shadow(0px 0px 3px ${activeArrowColor}) drop-shadow(0px 1px 1px rgba(0,0,0,0.15))`,
                }}
              >
                <path
                  d="M7 17L17 7M17 7H9M17 7V15"
                  stroke={activeArrowColor}
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </motion.div>
        </div>
      )}
    </motion.button>
  );
};

export default NeumorphicGlowCTA;
