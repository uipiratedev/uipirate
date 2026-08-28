"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export type TactileButtonVariant = "default" | "dark" | "orange" | "cyberpunk" | "minimal";
export type TactileButtonState = "interactive" | "resting" | "tilted";

export interface TactilePillButtonProps {
  /** Text label inside the button */
  label?: string;
  /** Status dot indicator color (default: #54EAD8 from Figma) */
  dotColor?: string;
  /** Force a specific visual state: 'interactive' (default hover tilt), 'resting' (75:1201), 'tilted' (75:1206) */
  stateMode?: TactileButtonState;
  /** Visual theme variant */
  variant?: TactileButtonVariant;
  /** Size scale */
  size?: "sm" | "md" | "lg";
  /** Optional onClick handler */
  onClick?: () => void;
  /** Additional CSS class names */
  className?: string;
  /** Optional custom tilt angle in degrees (default: -9.23) */
  tiltAngle?: number;
}

export const TactilePillButton: React.FC<TactilePillButtonProps> = ({
  label = "Get Started",
  dotColor = "#54EAD8",
  stateMode = "interactive",
  variant = "default",
  size = "md",
  onClick,
  className = "",
  tiltAngle = -9.23,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Scaled dimensions matching exact Figma 182x50px cap & 176x45px slot
  const sizeConfig = {
    sm: {
      wrapperW: 152,
      wrapperH: 42,
      slotW: "w-[146px]",
      slotH: "h-[37px]",
      capPadding: "pt-[5px] pb-[10px] pl-[13px] pr-[18px]",
      radius: "rounded-[13px]",
      fontSize: "text-[16px]",
      dotRadius: 5,
      gap: "gap-[14px]",
      liftY: -11,
      liftX: -3,
    },
    md: {
      wrapperW: 184,
      wrapperH: 52,
      slotW: "w-[176px]",
      slotH: "h-[45px]",
      capPadding: "pt-[6px] pb-[13px] pl-[16px] pr-[22px]",
      radius: "rounded-[16px]",
      fontSize: "text-[20px]",
      dotRadius: 6,
      gap: "gap-[17px]",
      liftY: -14,
      liftX: -4,
    },
    lg: {
      wrapperW: 220,
      wrapperH: 60,
      slotW: "w-[212px]",
      slotH: "h-[54px]",
      capPadding: "pt-[8px] pb-[16px] pl-[20px] pr-[26px]",
      radius: "rounded-[20px]",
      fontSize: "text-[24px]",
      dotRadius: 7,
      gap: "gap-[20px]",
      liftY: -18,
      liftX: -5,
    },
  }[size];

  // Theme-aware styles with calibrated dot rims and shadows
  const themeStyles = {
    default: {
      slotBg: "bg-[#d0d0d0]",
      slotShadow: "shadow-[inset_0px_2px_4px_0px_rgba(0,0,0,0.15),0px_1px_1px_0px_rgba(255,255,255,0.8)]",
      capBg: "bg-[#f2f2f2]",
      capText: "text-black",
      capTextShadow: "0px 1.5px 0px white",
      capBevel:
        "shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.15),inset_0.5px_1.5px_1px_0px_white,inset_-2px_-6px_1px_0px_rgba(0,0,0,0.2)]",
      restingFilter:
        "drop-shadow(2px 2px 3.5px rgba(0,0,0,0.1)) drop-shadow(9px 10px 6.5px rgba(0,0,0,0.09)) drop-shadow(20px 22px 9px rgba(0,0,0,0.05))",
      tiltedFilter:
        "drop-shadow(7px 6px 10.5px rgba(0,0,0,0.1)) drop-shadow(28px 26px 19px rgba(0,0,0,0.09)) drop-shadow(62px 58px 25.5px rgba(0,0,0,0.05))",
      dotRestShadow:
        "0px 1.5px 1px rgba(255,255,255,0.8), 0px -0.8px 1px rgba(0,0,0,0.12), inset 0px 1px 2px rgba(0,0,0,0.06)",
      dotTiltShadow:
        "0px 1.5px 1px rgba(255,255,255,0.8), inset 0px 1px 2px rgba(0,0,0,0.15)",
    },
    dark: {
      slotBg: "bg-[#18181B]",
      slotShadow: "shadow-[inset_0px_2px_5px_0px_rgba(0,0,0,0.8),0px_1px_1px_0px_rgba(255,255,255,0.06)]",
      capBg: "bg-[#27272A]",
      capText: "text-white",
      capTextShadow: "0px 1px 2px rgba(0,0,0,0.8)",
      capBevel:
        "shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.6),inset_0.5px_1.5px_1px_0px_rgba(255,255,255,0.15),inset_-2px_-6px_1px_0px_rgba(0,0,0,0.7)]",
      restingFilter:
        "drop-shadow(2px 2px 3.5px rgba(0,0,0,0.35)) drop-shadow(8px 10px 8px rgba(0,0,0,0.25))",
      tiltedFilter:
        "drop-shadow(7px 6px 12px rgba(0,0,0,0.45)) drop-shadow(24px 22px 20px rgba(0,0,0,0.35))",
      dotRestShadow:
        "0px 1px 2px rgba(0,0,0,0.4), inset 0px 1px 1px rgba(255,255,255,0.2)",
      dotTiltShadow:
        "0px 1px 2px rgba(0,0,0,0.5), inset 0px 1px 1px rgba(255,255,255,0.25)",
    },
    orange: {
      slotBg: "bg-[#5A1F00]",
      slotShadow: "shadow-[inset_0px_2px_5px_0px_rgba(0,0,0,0.6),0px_1px_1px_0px_rgba(255,91,4,0.3)]",
      capBg: "bg-[#FF5B04]",
      capText: "text-white",
      capTextShadow: "0px 1px 2px rgba(0,0,0,0.4)",
      capBevel:
        "shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.25),inset_0.5px_1.5px_1px_0px_rgba(255,255,255,0.45),inset_-2px_-6px_1px_0px_rgba(160,40,0,0.6)]",
      restingFilter:
        "drop-shadow(2px 2px 3.5px rgba(0,0,0,0.2)) drop-shadow(9px 10px 8px rgba(255,91,4,0.15))",
      tiltedFilter:
        "drop-shadow(7px 6px 10.5px rgba(0,0,0,0.25)) drop-shadow(24px 22px 18px rgba(255,91,4,0.2))",
      dotRestShadow:
        "0px 1px 2px rgba(0,0,0,0.25), inset 0px 1px 1px rgba(255,255,255,0.3)",
      dotTiltShadow:
        "0px 1px 2px rgba(0,0,0,0.3), inset 0px 1px 1px rgba(255,255,255,0.35)",
    },
    cyberpunk: {
      slotBg: "bg-[#090D16]",
      slotShadow: "shadow-[inset_0px_2px_6px_0px_rgba(0,0,0,0.9),0px_1px_1px_0px_rgba(0,229,190,0.4)]",
      capBg: "bg-[#131B2E]",
      capText: "text-[#E0F2FE]",
      capTextShadow: "0px 0px 8px rgba(0,229,190,0.4)",
      capBevel:
        "shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.6),inset_0.5px_1.5px_1px_0px_rgba(0,229,190,0.4),inset_-2px_-6px_1px_0px_rgba(0,0,0,0.8)]",
      restingFilter:
        "drop-shadow(2px 2px 3.5px rgba(0,0,0,0.3)) drop-shadow(6px 8px 10px rgba(0,229,190,0.15))",
      tiltedFilter:
        "drop-shadow(7px 6px 11px rgba(0,0,0,0.4)) drop-shadow(24px 22px 18px rgba(0,229,190,0.25))",
      dotRestShadow:
        "0px 1px 2px rgba(0,0,0,0.5), inset 0px 1px 1px rgba(0,229,190,0.3)",
      dotTiltShadow:
        "0px 1px 2px rgba(0,0,0,0.6), inset 0px 1px 1px rgba(0,229,190,0.4)",
    },
    minimal: {
      slotBg: "bg-[#E0E0E0]",
      slotShadow: "shadow-[inset_0px_2px_4px_0px_rgba(0,0,0,0.12),0px_1px_1px_0px_rgba(255,255,255,0.9)]",
      capBg: "bg-[#FFFFFF]",
      capText: "text-gray-900",
      capTextShadow: "0px 1px 0px rgba(255,255,255,0.9)",
      capBevel:
        "shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.1),inset_0.5px_1.5px_1px_0px_white,inset_-2px_-5px_1px_0px_rgba(0,0,0,0.12)]",
      restingFilter:
        "drop-shadow(2px 2px 3.5px rgba(0,0,0,0.08)) drop-shadow(9px 10px 6.5px rgba(0,0,0,0.05))",
      tiltedFilter:
        "drop-shadow(7px 6px 10.5px rgba(0,0,0,0.09)) drop-shadow(28px 26px 18px rgba(0,0,0,0.06))",
      dotRestShadow:
        "0px 1.5px 1px rgba(255,255,255,0.8), 0px -0.8px 1px rgba(0,0,0,0.08), inset 0px 1px 2px rgba(0,0,0,0.04)",
      dotTiltShadow:
        "0px 1.5px 1px rgba(255,255,255,0.8), inset 0px 1px 2px rgba(0,0,0,0.1)",
    },
  }[variant];

  // Lift state determination
  const isTilted =
    stateMode === "tilted" ||
    (stateMode === "interactive" && isHovered && !isPressed);

  const dotSize = sizeConfig.dotRadius * 2;

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{
        width: sizeConfig.wrapperW,
        height: sizeConfig.wrapperH,
      }}
      onMouseEnter={() => {
        if (stateMode === "interactive") setIsHovered(true);
      }}
      onMouseLeave={() => {
        if (stateMode === "interactive") {
          setIsHovered(false);
          setIsPressed(false);
        }
      }}
    >
      {/* 1. Recessed Slot / Tray (Frame 257 - 75:1202 & 75:1207) */}
      <motion.div
        animate={{
          opacity: isTilted ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
        className={`absolute pointer-events-none ${sizeConfig.slotW} ${sizeConfig.slotH} ${sizeConfig.radius} ${themeStyles.slotBg} ${themeStyles.slotShadow}`}
        style={{
          bottom: 2,
          left: "50%",
          transform: "translateX(-50%)",
        }}
        aria-hidden="true"
      />

      {/* 2. Tactile Button Cap (Frame 261 - 75:1203 & 75:1208) */}
      <motion.button
        type="button"
        onClick={onClick}
        onMouseDown={() => stateMode === "interactive" && setIsPressed(true)}
        onMouseUp={() => stateMode === "interactive" && setIsPressed(false)}
        onTouchStart={() => stateMode === "interactive" && setIsPressed(true)}
        onTouchEnd={() => stateMode === "interactive" && setIsPressed(false)}
        initial={false}
        animate={{
          rotate: isPressed ? 0 : isTilted ? tiltAngle : 0,
          y: isPressed ? 2 : isTilted ? sizeConfig.liftY : 0,
          x: isPressed ? 0 : isTilted ? sizeConfig.liftX : 0,
          scale: isPressed ? 0.98 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 350,
          damping: 25,
          mass: 0.8,
        }}
        className={`relative z-10 flex items-center justify-center ${sizeConfig.gap} ${sizeConfig.capPadding} ${sizeConfig.radius} ${themeStyles.capBg} cursor-pointer focus:outline-none`}
        style={{
          filter: isTilted ? themeStyles.tiltedFilter : themeStyles.restingFilter,
          transformOrigin: "center center",
          willChange: "transform",
          backfaceVisibility: "hidden",
          WebkitFontSmoothing: "subpixel-antialiased",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Specular & Bevel Highlight Insets */}
        <div
          className={`absolute inset-0 pointer-events-none ${sizeConfig.radius} ${themeStyles.capBevel}`}
        />

        {/* Status Dot */}
        <div
          className="relative shrink-0 flex items-center justify-center"
          style={{ width: dotSize, height: dotSize }}
        >
          {/* Subtle Aura Bloom on Tilt */}
          <motion.div
            animate={{
              opacity: isTilted ? 0.6 : 0,
              scale: isTilted ? 1.4 : 1,
            }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 rounded-full blur-[2.5px] pointer-events-none"
            style={{ backgroundColor: dotColor }}
          />

          {/* Crisp Dot Shape */}
          <div
            className="relative size-full rounded-full transition-shadow duration-200"
            style={{
              backgroundColor: dotColor,
              boxShadow: isTilted
                ? `0 0 6px ${dotColor}, ${themeStyles.dotTiltShadow}`
                : themeStyles.dotRestShadow,
            }}
          />
        </div>

        {/* Text Label (75:1205 & 75:1210) */}
        <p
          className={`font-medium ${sizeConfig.fontSize} ${themeStyles.capText} whitespace-nowrap leading-[31px] not-italic select-none`}
          style={{
            textShadow: themeStyles.capTextShadow,
            fontFamily: "var(--font-jakarta), var(--font-sans), sans-serif",
            transform: "translateZ(0)",
            WebkitFontSmoothing: "subpixel-antialiased",
          }}
        >
          {label}
        </p>
      </motion.button>
    </div>
  );
};

export default TactilePillButton;
