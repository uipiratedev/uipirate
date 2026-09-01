"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export type MagneticPulseStateMode = "interactive" | "standerd" | "hover";

export interface MagneticPulseCTAProps {
  label?: string;
  textColor?: string;
  pulseColor?: string;
  stateMode?: MagneticPulseStateMode;
  onClick?: () => void;
  className?: string;
}

export function MagneticPulseCTA({
  label = "Let's Venture",
  textColor,
  pulseColor = "#FF5B04",
  stateMode = "interactive",
  onClick,
  className = "",
}: MagneticPulseCTAProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isVisualHover = stateMode === "hover" || (stateMode === "interactive" && isHovered);

  return (
    <div
      className={`relative inline-block group select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Outer pulsing radiant glow */}
      <div
        className={`absolute inset-0 rounded-full blur-2xl transition-all duration-500 animate-pulse pointer-events-none ${
          isVisualHover ? "opacity-100 scale-125" : "opacity-70 scale-100"
        }`}
        style={{ backgroundColor: pulseColor }}
      />
      <motion.button
        type="button"
        animate={isVisualHover ? { scale: 1.05 } : { scale: 1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className="relative px-8 py-4 rounded-full text-white font-bold text-base shadow-2xl flex items-center gap-3 cursor-pointer focus:outline-none"
        style={{
          backgroundColor: pulseColor,
          boxShadow: `0 0 35px ${pulseColor}80`,
        }}
      >
        <span style={{ color: textColor || undefined }}>{label}</span>
        <span className="w-2 h-2 rounded-full bg-white animate-ping" />
      </motion.button>
    </div>
  );
}

export default MagneticPulseCTA;
