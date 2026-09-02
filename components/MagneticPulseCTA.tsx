"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export interface MagneticPulseCTAProps {
  label?: string;
  pulseColor?: string;
  onClick?: () => void;
  className?: string;
}

export function MagneticPulseCTA({
  label = "Let's Venture",
  pulseColor = "#FF5B04",
  onClick,
  className = "",
}: MagneticPulseCTAProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative inline-block group select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Outer pulsing radiant glow */}
      <div
        className="absolute inset-0 rounded-full blur-2xl opacity-70 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500 animate-pulse pointer-events-none"
        style={{ backgroundColor: pulseColor }}
      />
      <motion.button
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className="relative px-8 py-4 rounded-full text-white font-bold text-base shadow-2xl flex items-center gap-3 cursor-pointer focus:outline-none"
        style={{
          backgroundColor: pulseColor,
          boxShadow: `0 0 35px ${pulseColor}80`,
        }}
      >
        <span>{label}</span>
        <span className="w-2 h-2 rounded-full bg-white animate-ping" />
      </motion.button>
    </div>
  );
}

export default MagneticPulseCTA;
