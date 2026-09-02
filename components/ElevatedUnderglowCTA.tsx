"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export type ElevatedUnderglowTheme =
  | "figma"
  | "uipirate"
  | "cyan"
  | "emerald"
  | "violet"
  | "crimson"
  | "amber"
  | "dark";

export type ElevatedUnderglowStateMode = "interactive" | "standerd" | "hover";
export type ElevatedUnderglowSize = "xs" | "sm" | "md" | "lg" | "xl";
export type ElevatedUnderglowIconType =
  | "phone"
  | "calendar"
  | "arrow"
  | "sparkle"
  | "mail"
  | "none";

export interface ElevatedUnderglowCTAProps {
  /** Text label inside the button (default: "Book A Call") */
  label?: string;
  /** Built-in icon type or custom ReactNode (default: "phone" from Figma 55:14/55:31) */
  icon?: ElevatedUnderglowIconType | React.ReactNode;
  /** Visual state mode: 'interactive' (hover to lift), 'standerd' (55:37 fixed), 'hover' (55:40 fixed) */
  stateMode?: ElevatedUnderglowStateMode;
  /** Color theme preset */
  theme?: ElevatedUnderglowTheme;
  /** Size scale */
  size?: ElevatedUnderglowSize;
  /** Optional click handler */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Optional lift distance in pixels (default: 13 matching Figma 55:40) */
  liftAmount?: number;
  /** Disabled state */
  disabled?: boolean;
  /** Additional CSS class names */
  className?: string;
}

export const UNDERGLOW_THEMES: Record<
  ElevatedUnderglowTheme,
  {
    name: string;
    badge: string;
    primaryColor: string;
    baseBg: string;
    baseShadow: string;
    capBg: string;
    capBorder: string;
    capText: string;
    capRim: string;
    capInnerReflection: string;
    capHoverShadow: string;
    iconStroke: string;
  }
> = {
  figma: {
    name: "Figma Electric Blue (1:1)",
    badge: "Figma Master",
    primaryColor: "#0077FF",
    baseBg: "bg-[#07f]",
    baseShadow:
      "0px 58px 16px 0px rgba(0,145,255,0.01), 0px 37px 15px 0px rgba(0,145,255,0.04), 0px 21px 12px 0px rgba(0,145,255,0.15), 0px 9px 9px 0px rgba(0,145,255,0.26), 0px 2px 5px 0px rgba(0,145,255,0.29)",
    capBg: "bg-[#e8e8e8]",
    capBorder: "border-[#efefef]",
    capText: "text-[#353535]",
    capRim: "#dadada",
    capInnerReflection: "inset 0px -26px 23px -20px rgba(0,119,255,0.15)",
    capHoverShadow: "0px 21px 12px 0px rgba(0,145,255,0.15)",
    iconStroke: "#353535",
  },
  uipirate: {
    name: "UI Pirate Neon Orange",
    badge: "Brand Edition",
    primaryColor: "#FF5B04",
    baseBg: "bg-[#FF5B04]",
    baseShadow:
      "0px 58px 16px 0px rgba(255,91,4,0.02), 0px 37px 15px 0px rgba(255,91,4,0.06), 0px 21px 12px 0px rgba(255,91,4,0.2), 0px 9px 9px 0px rgba(255,91,4,0.32), 0px 2px 6px 0px rgba(255,91,4,0.4)",
    capBg: "bg-[#f0ece7]",
    capBorder: "border-[#fbf8f5]",
    capText: "text-[#26211d]",
    capRim: "#ded6cc",
    capInnerReflection: "inset 0px -26px 23px -20px rgba(255,91,4,0.18)",
    capHoverShadow: "0px 21px 12px 0px rgba(255,91,4,0.2)",
    iconStroke: "#26211d",
  },
  cyan: {
    name: "Obsidian Cyan",
    badge: "Electric",
    primaryColor: "#06B6D4",
    baseBg: "bg-[#06B6D4]",
    baseShadow:
      "0px 58px 16px 0px rgba(6,182,212,0.02), 0px 37px 15px 0px rgba(6,182,212,0.06), 0px 21px 12px 0px rgba(6,182,212,0.2), 0px 9px 9px 0px rgba(6,182,212,0.3), 0px 2px 6px 0px rgba(6,182,212,0.35)",
    capBg: "bg-[#e8ecee]",
    capBorder: "border-[#f1f6f8]",
    capText: "text-[#1e293b]",
    capRim: "#d1dbe0",
    capInnerReflection: "inset 0px -26px 23px -20px rgba(6,182,212,0.18)",
    capHoverShadow: "0px 21px 12px 0px rgba(6,182,212,0.18)",
    iconStroke: "#1e293b",
  },
  emerald: {
    name: "Radioactive Emerald",
    badge: "Neon Glow",
    primaryColor: "#10B981",
    baseBg: "bg-[#10B981]",
    baseShadow:
      "0px 58px 16px 0px rgba(16,185,129,0.02), 0px 37px 15px 0px rgba(16,185,129,0.06), 0px 21px 12px 0px rgba(16,185,129,0.2), 0px 9px 9px 0px rgba(16,185,129,0.3), 0px 2px 6px 0px rgba(16,185,129,0.35)",
    capBg: "bg-[#e8eee9]",
    capBorder: "border-[#f1f7f2]",
    capText: "text-[#1a2e22]",
    capRim: "#d2ddd4",
    capInnerReflection: "inset 0px -26px 23px -20px rgba(16,185,129,0.18)",
    capHoverShadow: "0px 21px 12px 0px rgba(16,185,129,0.18)",
    iconStroke: "#1a2e22",
  },
  violet: {
    name: "Cyberpunk Violet",
    badge: "Ultraviolet",
    primaryColor: "#8B5CF6",
    baseBg: "bg-[#8B5CF6]",
    baseShadow:
      "0px 58px 16px 0px rgba(139,92,246,0.02), 0px 37px 15px 0px rgba(139,92,246,0.06), 0px 21px 12px 0px rgba(139,92,246,0.2), 0px 9px 9px 0px rgba(139,92,246,0.32), 0px 2px 6px 0px rgba(139,92,246,0.38)",
    capBg: "bg-[#ece8f2]",
    capBorder: "border-[#f5f1fb]",
    capText: "text-[#281e3a]",
    capRim: "#d8d0e5",
    capInnerReflection: "inset 0px -26px 23px -20px rgba(139,92,246,0.18)",
    capHoverShadow: "0px 21px 12px 0px rgba(139,92,246,0.18)",
    iconStroke: "#281e3a",
  },
  crimson: {
    name: "Ruby Crimson",
    badge: "Vivid Red",
    primaryColor: "#EF4444",
    baseBg: "bg-[#EF4444]",
    baseShadow:
      "0px 58px 16px 0px rgba(239,68,68,0.02), 0px 37px 15px 0px rgba(239,68,68,0.06), 0px 21px 12px 0px rgba(239,68,68,0.2), 0px 9px 9px 0px rgba(239,68,68,0.32), 0px 2px 6px 0px rgba(239,68,68,0.38)",
    capBg: "bg-[#f2e8e8]",
    capBorder: "border-[#fbf1f1]",
    capText: "text-[#3a1e1e]",
    capRim: "#e2cece",
    capInnerReflection: "inset 0px -26px 23px -20px rgba(239,68,68,0.18)",
    capHoverShadow: "0px 21px 12px 0px rgba(239,68,68,0.18)",
    iconStroke: "#3a1e1e",
  },
  amber: {
    name: "Luxury Gold",
    badge: "Heritage",
    primaryColor: "#F59E0B",
    baseBg: "bg-[#F59E0B]",
    baseShadow:
      "0px 58px 16px 0px rgba(245,158,11,0.02), 0px 37px 15px 0px rgba(245,158,11,0.06), 0px 21px 12px 0px rgba(245,158,11,0.2), 0px 9px 9px 0px rgba(245,158,11,0.32), 0px 2px 6px 0px rgba(245,158,11,0.38)",
    capBg: "bg-[#f2ece4]",
    capBorder: "border-[#fdf6ec]",
    capText: "text-[#342714]",
    capRim: "#ded3c2",
    capInnerReflection: "inset 0px -26px 23px -20px rgba(245,158,11,0.18)",
    capHoverShadow: "0px 21px 12px 0px rgba(245,158,11,0.18)",
    iconStroke: "#342714",
  },
  dark: {
    name: "Obsidian Slate (Dark Cap)",
    badge: "Dark Theme",
    primaryColor: "#0077FF",
    baseBg: "bg-[#0077FF]",
    baseShadow:
      "0px 58px 16px 0px rgba(0,145,255,0.02), 0px 37px 15px 0px rgba(0,145,255,0.06), 0px 21px 12px 0px rgba(0,145,255,0.25), 0px 9px 9px 0px rgba(0,145,255,0.38), 0px 2px 6px 0px rgba(0,145,255,0.45)",
    capBg: "bg-[#1C1E24]",
    capBorder: "border-[#2D313C]",
    capText: "text-[#F3F4F6]",
    capRim: "#121317",
    capInnerReflection: "inset 0px -26px 23px -20px rgba(0,119,255,0.25)",
    capHoverShadow: "0px 21px 12px 0px rgba(0,145,255,0.22)",
    iconStroke: "#F3F4F6",
  },
};

/**
 * 1:1 Pixel-Accurate Phone Icon from Figma Node 55:14 / 55:31
 */
export const PhoneCallIcon: React.FC<{ stroke?: string; className?: string }> = ({
  stroke = "currentColor",
  className = "size-4",
}) => (
  <svg
    className={className}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M14.6655 11.28V13.28C14.6663 13.4657 14.6282 13.6495 14.5539 13.8196C14.4795 13.9897 14.3704 14.1424 14.2336 14.268C14.0967 14.3935 13.9352 14.489 13.7593 14.5485C13.5835 14.608 13.3971 14.6301 13.2122 14.6134C11.1607 14.3905 9.19018 13.6895 7.45885 12.5667C5.84806 11.5432 4.4824 10.1775 3.45885 8.56671C2.33216 6.82751 1.63101 4.84737 1.41218 2.78671C1.39552 2.60235 1.41743 2.41655 1.47651 2.24112C1.5356 2.0657 1.63056 1.9045 1.75536 1.76779C1.88015 1.63108 2.03205 1.52185 2.20137 1.44706C2.3707 1.37226 2.55374 1.33355 2.73884 1.33337H4.73885C5.06238 1.33019 5.37604 1.44476 5.62135 1.65573C5.86667 1.8667 6.0269 2.15967 6.07218 2.48004C6.15659 3.12009 6.31315 3.74853 6.53885 4.35337C6.62854 4.59199 6.64795 4.85132 6.59478 5.10063C6.54161 5.34994 6.41809 5.57878 6.23885 5.76004L5.39218 6.60671C6.34122 8.27574 7.72315 9.65767 9.39218 10.6067L10.2388 9.76004C10.4201 9.5808 10.6489 9.45727 10.8983 9.4041C11.1476 9.35093 11.4069 9.37034 11.6455 9.46004C12.2504 9.68574 12.8788 9.84229 13.5188 9.92671C13.8427 9.97239 14.1384 10.1355 14.3499 10.385C14.5613 10.6346 14.6736 10.9531 14.6655 11.28Z"
      stroke={stroke}
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.0312 3.33341C10.6824 3.46046 11.2808 3.77892 11.75 4.24804C12.2191 4.71716 12.5375 5.31559 12.6646 5.96675"
      stroke={stroke}
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.0312 0.666748C11.3841 0.817039 12.6456 1.42286 13.6087 2.38475C14.5718 3.34664 15.1793 4.60742 15.3313 5.96008"
      stroke={stroke}
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CalendarIcon: React.FC<{ stroke?: string; className?: string }> = ({
  stroke = "currentColor",
  className = "size-4",
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke={stroke}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="4" width="18" height="18" rx="3" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ArrowRightIcon: React.FC<{ stroke?: string; className?: string }> = ({
  stroke = "currentColor",
  className = "size-4",
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke={stroke}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const SparkleIcon: React.FC<{ stroke?: string; className?: string }> = ({
  stroke = "currentColor",
  className = "size-4",
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke={stroke}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4L12 2z" />
  </svg>
);

const MailIcon: React.FC<{ stroke?: string; className?: string }> = ({
  stroke = "currentColor",
  className = "size-4",
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke={stroke}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="2" y="4" width="20" height="16" rx="3" />
    <path d="M22 6l-10 7L2 6" />
  </svg>
);

/**
 * Pixel-Accurate 1:1 Implementation of Figma Nodes 55:37 & 55:40
 * Elevated 3D Underglow Pill Button
 */
export const ElevatedUnderglowCTA: React.FC<ElevatedUnderglowCTAProps> = ({
  label = "Book A Call",
  icon = "phone",
  stateMode = "interactive",
  theme = "figma",
  size = "md",
  onClick,
  liftAmount = 13,
  disabled = false,
  className = "",
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const t = UNDERGLOW_THEMES[theme] || UNDERGLOW_THEMES.figma;

  // Evaluate active visual state
  const isLifted =
    stateMode === "hover" ? true : stateMode === "standerd" ? false : isHovered;

  // Scaled dimensions matching exact Figma 184x56px pill chassis
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
      width: 154,
      height: 48,
      radius: "rounded-[24px]",
      fontSize: "text-[15px]",
      padding: "px-[16px] py-[8px]",
      gap: "gap-[8px]",
      iconSize: "size-[14px]",
      liftOffset: liftAmount * 0.8,
    },
    md: {
      width: 184,
      height: 56,
      radius: "rounded-[35px]",
      fontSize: "text-[18px]",
      padding: "px-[22px] py-[10px]",
      gap: "gap-[10px]",
      iconSize: "size-[16px]",
      liftOffset: liftAmount,
    },
    lg: {
      width: 220,
      height: 64,
      radius: "rounded-[40px]",
      fontSize: "text-[20px]",
      padding: "px-[26px] py-[12px]",
      gap: "gap-[12px]",
      iconSize: "size-[18px]",
      liftOffset: liftAmount * 1.2,
    },
  }[__baseSize];

  // Resting shadow stack (1:1 from Figma 55:9)
  const restingShadowStack = `0px 2px 0px 0px ${t.capRim}, 0px 87px 24px 0px rgba(0,0,0,0), 0px 55px 22px 0px rgba(0,0,0,0.01), 0px 31px 19px 0px rgba(0,0,0,0.05), 0px 14px 14px 0px rgba(0,0,0,0.09), 0px 3px 8px 0px rgba(0,0,0,0.1)`;

  // Hover elevated shadow stack (1:1 from Figma 55:26)
  const hoverShadowStack = `${t.capHoverShadow}, 0px 2px 0px 0px ${t.capRim}, 0px 87px 24px 0px rgba(0,0,0,0), 0px 55px 22px 0px rgba(0,0,0,0.01), 0px 31px 19px 0px rgba(0,0,0,0.05), 0px 14px 14px 0px rgba(0,0,0,0.09), 0px 3px 8px 0px rgba(0,0,0,0.1)`;

  // Render icon based on type
  const renderIcon = () => {
    if (typeof icon !== "string") {
      return icon;
    }
    switch (icon) {
      case "phone":
        return <PhoneCallIcon stroke={t.iconStroke} className={sizeConfig.iconSize} />;
      case "calendar":
        return <CalendarIcon stroke={t.iconStroke} className={sizeConfig.iconSize} />;
      case "arrow":
        return <ArrowRightIcon stroke={t.iconStroke} className={sizeConfig.iconSize} />;
      case "sparkle":
        return <SparkleIcon stroke={t.iconStroke} className={sizeConfig.iconSize} />;
      case "mail":
        return <MailIcon stroke={t.iconStroke} className={sizeConfig.iconSize} />;
      case "none":
      default:
        return null;
    }
  };

  return __wrapSize(
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{
        width: sizeConfig.width,
        height: sizeConfig.height + sizeConfig.liftOffset,
      }}
    >
      {/* ─────────────────────────────────────────────────────────────
          1. AMBIENT BASE LAYER / GLOWING 3D EXTRUSION (Figma 55:23)
         ───────────────────────────────────────────────────────────── */}
      <motion.div
        className={`absolute bottom-0 left-0 right-0 ${sizeConfig.radius} ${t.baseBg}`}
        style={{
          height: sizeConfig.height,
        }}
        initial={false}
        animate={{
          opacity: isLifted ? 1 : 0,
          scaleY: isLifted ? 1 : 0.8,
          boxShadow: isLifted ? t.baseShadow : "none",
        }}
        transition={{
          type: "spring",
          stiffness: 380,
          damping: 26,
        }}
      >
        {/* Internal Blur Highlight Mask (Figma 55:25) */}
        <div
          className="absolute inset-0 bg-white/20 blur-[12px] pointer-events-none rounded-[inherit] overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)",
          }}
        />
      </motion.div>

      {/* ─────────────────────────────────────────────────────────────
          2. RESTING AMBIENT SHADOW BACKDROP (Figma 55:3 / 55:20)
         ───────────────────────────────────────────────────────────── */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] h-[20px] bg-black/10 blur-[12px] rounded-full pointer-events-none"
        initial={false}
        animate={{
          opacity: isLifted ? 0.35 : 0.65,
          scaleX: isLifted ? 1.08 : 0.95,
          scaleY: isLifted ? 1.3 : 1,
        }}
        transition={{ duration: 0.25 }}
      />

      {/* ─────────────────────────────────────────────────────────────
          3. ELEVATED CAP / INTERACTIVE BUTTON FACE (Figma 55:9 & 55:26)
         ───────────────────────────────────────────────────────────── */}
      <motion.button
        type="button"
        disabled={disabled}
        onClick={onClick}
        onMouseEnter={() => stateMode === "interactive" && setIsHovered(true)}
        onMouseLeave={() => {
          if (stateMode === "interactive") {
            setIsHovered(false);
            setIsPressed(false);
          }
        }}
        onMouseDown={() => stateMode === "interactive" && setIsPressed(true)}
        onMouseUp={() => stateMode === "interactive" && setIsPressed(false)}
        onTouchStart={() => stateMode === "interactive" && setIsPressed(true)}
        onTouchEnd={() => stateMode === "interactive" && setIsPressed(false)}
        className={`absolute bottom-0 left-0 right-0 flex items-center justify-center ${sizeConfig.gap} ${sizeConfig.padding} ${sizeConfig.radius} ${t.capBg} border ${t.capBorder} ${t.capText} font-medium outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed z-10`}
        style={{
          height: sizeConfig.height,
        }}
        initial={false}
        animate={{
          y: isPressed
            ? isLifted
              ? -sizeConfig.liftOffset * 0.35
              : 2
            : isLifted
            ? -sizeConfig.liftOffset
            : 0,
          boxShadow: isLifted ? hoverShadowStack : restingShadowStack,
        }}
        transition={{
          type: "spring",
          stiffness: 450,
          damping: 24,
        }}
      >
        {/* Bottom Inner Reflection Glow on Cap (Figma 55:28 inner shadow) */}
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-[inherit]"
          initial={false}
          animate={{
            boxShadow: isLifted ? t.capInnerReflection : "none",
            opacity: isLifted ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
        />

        {/* Surface Ambient Clay Sheen Highlight */}
        <div
          className="absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-white/35 to-transparent pointer-events-none rounded-t-[inherit]"
          aria-hidden="true"
        />

        {/* Button Content: Label + Icon */}
        <span
          className={`relative z-10 capitalize tracking-tight select-none font-['Figtree',sans-serif] ${sizeConfig.fontSize}`}
          style={{ letterSpacing: "-0.01em" }}
        >
          {label}
        </span>

        {renderIcon() && (
          <span className="relative z-10 flex items-center justify-center shrink-0">
            {renderIcon()}
          </span>
        )}
      </motion.button>
    </div>
  );
};

export default ElevatedUnderglowCTA;
