"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export type ScalingCapsuleVariant = "dark" | "orange" | "light" | "cyberpunk";

export interface ScalingCapsuleButtonProps {
  /** Main button label (default: "Scaling Workshop") */
  label?: string;
  /** Visual variant (default: "dark" from Figma 118:6091) */
  variant?: ScalingCapsuleVariant;
  /** Size scale */
  size?: "sm" | "md" | "lg";
  /** Optional custom icon element or SVG */
  icon?: React.ReactNode;
  /** Optional click handler */
  onClick?: () => void;
  /** Additional CSS class names */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
}

/**
 * Exact Ladder-Rung "A" Icon matching Figma Node 118:6177
 */
export const ApexEmblemIcon: React.FC<{ className?: string }> = ({
  className = "w-[16px] h-[16px]",
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Upper solid triangle apex of the "A" */}
    <path
      d="M12 2.2L6.2 13.5H17.8L12 2.2ZM12 6.8L14.4 11.5H9.6L12 6.8Z"
    />
    {/* Left and Right solid lower legs */}
    <polygon points="6.2,13.5 3,21.5 6.8,21.5 8.2,18 7.2,15.5 8.5,13.5" />
    <polygon points="17.8,13.5 21,21.5 17.2,21.5 15.8,18 16.8,15.5 15.5,13.5" />
    {/* Horizontal ladder rungs / stripes spanning the inner opening */}
    <rect x="7.4" y="14.2" width="9.2" height="1.1" rx="0.3" />
    <rect x="6.8" y="16.0" width="10.4" height="1.1" rx="0.3" />
    <rect x="6.0" y="17.8" width="12.0" height="1.1" rx="0.3" />
    <rect x="5.2" y="19.6" width="13.6" height="1.1" rx="0.3" />
  </svg>
);

/**
 * ScalingCapsuleButton
 *
 * 1. Outer pill cavity glass tray (223x61px) with p-[6px], rounded-[50px]
 * 2. Inner button cap (211x49px) with rounded-[24px], bg-[#343434]
 * 3. 45px circle with bg-gradient-to-b from-[#1b1b1b] to-[#343434]
 * 4. 26px x 26px centered black rounded shape containing the icon (no hover tilt)
 * 5. Specular Bevel overlay covering the entire button cap
 */
export const ScalingCapsuleButton: React.FC<ScalingCapsuleButtonProps> = ({
  label = "Scaling Workshop",
  variant = "dark",
  size = "md",
  icon,
  onClick,
  className = "",
  disabled = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Exact Figma scales: Outer 223x61px, Cap 211x49px, Circle 45px, Inner Ellipse 26x26px
  const sizeConfig = {
    sm: {
      outerPadding: "p-[5px]",
      outerRadius: "rounded-[40px]",
      innerRadius: "rounded-[20px]",
      innerPadding: "pl-[22px] pr-[1px] pt-[1px] pb-[2px]",
      fontSize: "text-[13px]",
      outerCircleSize: "w-[38px] h-[38px]",
      innerCircleSize: "w-[22px] h-[22px]",
      iconSize: "w-[14px] h-[14px]",
      gap: "gap-[12px]",
      liftY: -3,
    },
    md: {
      outerPadding: "p-[6px]",
      outerRadius: "rounded-[50px]",
      innerRadius: "rounded-[24px]",
      innerPadding: "pl-[30px] pr-[1px] pt-[1px] pb-[3px]",
      fontSize: "text-[15px]",
      outerCircleSize: "w-[45px] h-[45px]",
      innerCircleSize: "w-[26px] h-[26px]", // Exact 26x26px from Figma Node 118:6177
      iconSize: "w-[16px] h-[16px]",
      gap: "gap-[15px]",
      liftY: -4,
    },
    lg: {
      outerPadding: "p-[8px]",
      outerRadius: "rounded-[60px]",
      innerRadius: "rounded-[28px]",
      innerPadding: "pl-[36px] pr-[2px] pt-[2px] pb-[4px]",
      fontSize: "text-[18px]",
      outerCircleSize: "w-[54px] h-[54px]",
      innerCircleSize: "w-[32px] h-[32px]",
      iconSize: "w-[20px] h-[20px]",
      gap: "gap-[18px]",
      liftY: -5,
    },
  }[size];

  // Exact theme parameters matching Figma Node 118:6091
  const themeStyles = {
    dark: {
      outerBg: "bg-[rgba(209,213,236,0.14)]",
      outerShadow: "shadow-[0px_1.5px_0px_0px_white,inset_0px_0px_2px_0px_rgba(0,0,0,0.4)]",
      capBg: "bg-[#343434]",
      textColor: "text-[#F8F8F8]",
      textShadow: "0px 1px 1px rgba(0,0,0,0.5)",
      outerCircleBg: "bg-gradient-to-b from-[#1b1b1b] to-[#343434]",
      innerCircleBg: "bg-black",
      capBevel:
        "shadow-[inset_0px_2px_0px_0px_rgba(255,255,255,0.25),inset_0px_-5px_0px_0px_rgba(160,160,160,0.2),inset_0px_1px_0px_0px_rgba(255,255,255,0.8),inset_0px_-4px_0px_0px_black]",
      restingShadow:
        "drop-shadow(0px 3px 3px rgba(0,0,0,0.14)) drop-shadow(0px 6.65px 5.32px rgba(0,0,0,0.13)) drop-shadow(0px 12.5px 10px rgba(0,0,0,0.14)) drop-shadow(0px 22.3px 17.9px rgba(0,0,0,0.14)) drop-shadow(0px 41.8px 33.4px rgba(0,0,0,0.15)) drop-shadow(0px 100px 80px rgba(0,0,0,0.15))",
      hoverShadow:
        "drop-shadow(0px 4px 6px rgba(0,0,0,0.2)) drop-shadow(0px 14px 18px rgba(0,0,0,0.22)) drop-shadow(0px 36px 32px rgba(0,0,0,0.25))",
      iconColor: "text-white",
    },
    orange: {
      outerBg: "bg-[rgba(255,91,4,0.15)]",
      outerShadow: "shadow-[0px_1.5px_0px_0px_rgba(255,255,255,0.7),inset_0px_0px_3px_0px_rgba(255,91,4,0.4)]",
      capBg: "bg-[#FF5B04]",
      textColor: "text-white",
      textShadow: "0px 1px 2px rgba(0,0,0,0.4)",
      outerCircleBg: "bg-gradient-to-b from-[#CC4400] to-[#FF5B04]",
      innerCircleBg: "bg-[#B33B00]",
      capBevel:
        "shadow-[inset_0px_2px_0px_0px_rgba(255,255,255,0.45),inset_0px_-5px_0px_0px_rgba(180,45,0,0.4),inset_0px_1px_0px_0px_rgba(255,255,255,0.9),inset_0px_-4px_0px_0px_rgba(120,30,0,0.8)]",
      restingShadow:
        "drop-shadow(0px 4px 6px rgba(255,91,4,0.25)) drop-shadow(0px 14px 18px rgba(255,91,4,0.2))",
      hoverShadow:
        "drop-shadow(0px 6px 12px rgba(255,91,4,0.35)) drop-shadow(0px 22px 28px rgba(255,91,4,0.3))",
      iconColor: "text-white",
    },
    light: {
      outerBg: "bg-[rgba(0,0,0,0.06)]",
      outerShadow: "shadow-[0px_1.5px_0px_0px_white,inset_0px_0px_2px_0px_rgba(0,0,0,0.15)]",
      capBg: "bg-[#FAFAFA]",
      textColor: "text-gray-900",
      textShadow: "0px 1px 0px rgba(255,255,255,0.8)",
      outerCircleBg: "bg-gradient-to-b from-[#E2E2E2] to-[#FAFAFA]",
      innerCircleBg: "bg-[#222222]",
      capBevel:
        "shadow-[inset_0px_2px_0px_0px_rgba(255,255,255,0.9),inset_0px_-4px_0px_0px_rgba(0,0,0,0.1),inset_0px_1px_0px_0px_white,inset_0px_-2px_0px_0px_rgba(0,0,0,0.15)]",
      restingShadow:
        "drop-shadow(0px 3px 4px rgba(0,0,0,0.08)) drop-shadow(0px 10px 12px rgba(0,0,0,0.06))",
      hoverShadow:
        "drop-shadow(0px 6px 10px rgba(0,0,0,0.12)) drop-shadow(0px 18px 20px rgba(0,0,0,0.09))",
      iconColor: "text-white",
    },
    cyberpunk: {
      outerBg: "bg-[rgba(0,229,190,0.12)]",
      outerShadow: "shadow-[0px_1.5px_0px_0px_rgba(0,229,190,0.5),inset_0px_0px_4px_0px_rgba(0,229,190,0.35)]",
      capBg: "bg-[#111827]",
      textColor: "text-[#E0F2FE]",
      textShadow: "0px 0px 8px rgba(0,229,190,0.5)",
      outerCircleBg: "bg-gradient-to-b from-[#090E1A] to-[#111827]",
      innerCircleBg: "bg-black",
      capBevel:
        "shadow-[inset_0px_2px_0px_0px_rgba(0,229,190,0.4),inset_0px_-5px_0px_0px_rgba(0,0,0,0.6),inset_0px_1px_0px_0px_rgba(0,229,190,0.8),inset_0px_-4px_0px_0px_black]",
      restingShadow:
        "drop-shadow(0px 4px 6px rgba(0,0,0,0.4)) drop-shadow(0px 10px 16px rgba(0,229,190,0.15))",
      hoverShadow:
        "drop-shadow(0px 6px 12px rgba(0,0,0,0.5)) drop-shadow(0px 18px 24px rgba(0,229,190,0.3))",
      iconColor: "text-[#00E5BE]",
    },
  }[variant];

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${sizeConfig.outerPadding} ${sizeConfig.outerRadius} ${themeStyles.outerBg} ${themeStyles.outerShadow} transition-all duration-300 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
    >
      {/* 1. Interactive Button Cap (Frame 11 - 118:6174) */}
      <motion.button
        type="button"
        disabled={disabled}
        onClick={onClick}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onTouchStart={() => setIsPressed(true)}
        onTouchEnd={() => setIsPressed(false)}
        animate={{
          y: isPressed ? 1.5 : isHovered ? sizeConfig.liftY : 0,
          scale: isPressed ? 0.985 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 24,
          mass: 0.7,
        }}
        className={`relative flex items-center ${sizeConfig.gap} ${sizeConfig.innerPadding} ${sizeConfig.innerRadius} ${themeStyles.capBg} cursor-pointer focus:outline-none overflow-hidden`}
        style={{
          filter: isHovered ? themeStyles.hoverShadow : themeStyles.restingShadow,
          willChange: "transform",
          WebkitFontSmoothing: "subpixel-antialiased",
        }}
      >
        {/* 2. Text Label (118:6175) */}
        <span
          className={`font-semibold ${sizeConfig.fontSize} ${themeStyles.textColor} whitespace-nowrap tracking-[-0.2px] leading-none select-none`}
          style={{
            textShadow: themeStyles.textShadow,
            fontFamily: "var(--font-jakarta), var(--font-sans), sans-serif",
          }}
        >
          {label}
        </span>

        {/* 3. Outer Circular Knob (Frame 2095586266 - 118:6176) */}
        <div
          className={`relative shrink-0 ${sizeConfig.outerCircleSize} rounded-full ${themeStyles.outerCircleBg} flex items-center justify-center`}
        >
          {/* 4. Ellipse 1 (118:6177) - Exact 26x26px Black Circle without hover tilt */}
          <div
            className={`shrink-0 ${sizeConfig.innerCircleSize} rounded-full ${themeStyles.innerCircleBg} flex items-center justify-center`}
          >
            <div className={themeStyles.iconColor}>
              {icon || <ApexEmblemIcon className={sizeConfig.iconSize} />}
            </div>
          </div>
        </div>

        {/* 5. Figma Exact Specular Bevel Overlay (Spans entire Frame 11) */}
        <div
          className={`absolute inset-0 pointer-events-none ${sizeConfig.innerRadius} ${themeStyles.capBevel}`}
        />
      </motion.button>
    </div>
  );
};

export default ScalingCapsuleButton;
