"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export type MagneticPulseSize = "xs" | "sm" | "md" | "lg" | "xl";
export type MagneticPulseStateMode = "interactive" | "standerd" | "hover";

export interface MagneticPulseCTAProps {
  label?: string;
  pulseColor?: string;
  size?: MagneticPulseSize;
  stateMode?: MagneticPulseStateMode;
  onClick?: () => void;
  className?: string;
}

export function MagneticPulseCTA({
  label = "Let's Venture",
  pulseColor = "#FF5B04",
  size = "md",
  stateMode = "interactive",
  onClick,
  className = "",
}: MagneticPulseCTAProps) {
  const [isHovered, setIsHovered] = useState(false);

  const activeHover =
    stateMode === "hover"
      ? true
      : stateMode === "standerd"
      ? false
      : isHovered;

  const sizeConfig = {
    xs: {
      padding: "px-4 py-2",
      fontSize: "text-xs",
      dotSize: "w-1.5 h-1.5",
      gap: "gap-1.5",
    },
    sm: {
      padding: "px-6 py-3",
      fontSize: "text-sm",
      dotSize: "w-2 h-2",
      gap: "gap-2",
    },
    md: {
      padding: "px-8 py-4",
      fontSize: "text-base",
      dotSize: "w-2 h-2",
      gap: "gap-3",
    },
    lg: {
      padding: "px-10 py-5",
      fontSize: "text-lg",
      dotSize: "w-2.5 h-2.5",
      gap: "gap-3.5",
    },
    xl: {
      padding: "px-12 py-6",
      fontSize: "text-xl",
      dotSize: "w-3 h-3",
      gap: "gap-4",
    },
  }[size || "md"];

  return (
    <div
      className={`relative inline-block select-none ${className}`}
      onMouseEnter={() => stateMode === "interactive" && setIsHovered(true)}
      onMouseLeave={() => stateMode === "interactive" && setIsHovered(false)}
    >
      {/* Outer pulsing radiant glow */}
      <div
        className={`absolute inset-0 rounded-full blur-2xl transition-all duration-500 pointer-events-none ${
          activeHover ? "opacity-100 scale-125" : "opacity-70 animate-pulse"
        }`}
        style={{ backgroundColor: pulseColor }}
      />
      <motion.button
        type="button"
        animate={{
          scale: activeHover ? 1.05 : 1,
        }}
        whileHover={stateMode === "interactive" ? { scale: 1.05 } : undefined}
        whileTap={stateMode === "interactive" ? { scale: 0.95 } : undefined}
        onClick={onClick}
        className={`relative ${sizeConfig.padding} rounded-full text-white font-bold ${sizeConfig.fontSize} shadow-2xl flex items-center ${sizeConfig.gap} cursor-pointer focus:outline-none`}
        style={{
          backgroundColor: pulseColor,
          boxShadow: `0 0 35px ${pulseColor}80`,
        }}
      >
        <span className="whitespace-nowrap">{label}</span>
        <span className={`${sizeConfig.dotSize} rounded-full bg-white animate-ping`} />
      </motion.button>
    </div>
  );
}

export default MagneticPulseCTA;
