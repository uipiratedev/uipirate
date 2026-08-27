"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export type LedMatrixTheme = "monochrome" | "emerald" | "cyan" | "amber" | "crimson";
export type LedMatrixStateMode = "interactive" | "standerd" | "hover";
export type LedMatrixInteractionMode = "hover" | "click" | "both";
export type LedMatrixSize = "sm" | "md" | "lg";

export interface LedMatrixChevronButtonProps {
  /** Button label in resting state (default: "See Plans") */
  label?: string;
  /** Visual theme preset */
  theme?: LedMatrixTheme;
  /** Size scale: "sm" | "md" | "lg" */
  size?: LedMatrixSize;
  /** Visual state mode: 'interactive' (responds to interaction), 'standerd' (Figma 19:6101), 'hover' (Figma 19:6495) */
  stateMode?: LedMatrixStateMode;
  /** Interaction trigger mode: 'hover' | 'click' | 'both' */
  interactionMode?: LedMatrixInteractionMode;
  /** LED shift speed in ms per column step (default: 110ms) */
  stepSpeedMs?: number;
  /** Whether the arrows continuously shift from left to right across the fixed grid (default: true) */
  enableMovingLoop?: boolean;
  /** Click event handler */
  onClick?: () => void;
  /** Custom scale factor */
  scale?: number;
  /** Additional CSS class names */
  className?: string;
}

/**
 * 1:1 Pixel-Accurate Implementation of Figma Nodes 19:6101 & 19:6495
 * Master Button Collection - Expandable LED Dot Matrix Chevron Button
 * Features a FIXED physical LED square grid with shifting illuminated chevron patterns
 */
export const LedMatrixChevronButton: React.FC<LedMatrixChevronButtonProps> = ({
  label = "See Plans",
  theme = "monochrome",
  size = "md",
  stateMode = "interactive",
  interactionMode = "hover",
  stepSpeedMs = 110,
  enableMovingLoop = true,
  onClick,
  scale = 1,
  className = "",
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isToggled, setIsToggled] = useState(false);
  const [frame, setFrame] = useState(0);

  const isExpanded =
    stateMode === "hover"
      ? true
      : stateMode === "standerd"
      ? false
      : interactionMode === "click"
      ? isToggled
      : interactionMode === "hover"
      ? isHovered
      : isHovered || isToggled;

  // Scaled dimensions matching exact Figma 236x71px enclosure & 224x59px slab
  const sizeConfig = {
    sm: {
      enclosureW: 194,
      enclosureH: 58,
      enclosurePadding: "p-[5px]",
      slabW: 184,
      slabH: 48,
      badgeW: 44,
      badgeH: 40,
      pixelSize: 2.4,
      gap: 2.2,
      compactCols: 7,
      expandedCols: 28,
      fontSize: "text-[15px]",
      enclosureRadius: "rounded-[13px]",
      slabRadius: "rounded-[8px]",
      badgeRadius: "rounded-[4px]",
    },
    md: {
      enclosureW: 236,
      enclosureH: 71,
      enclosurePadding: "p-[6px]",
      slabW: 224,
      slabH: 59,
      badgeW: 53,
      badgeH: 49,
      pixelSize: 3,
      gap: 3,
      compactCols: 7,
      expandedCols: 32,
      fontSize: "text-[18px]",
      enclosureRadius: "rounded-[16px]",
      slabRadius: "rounded-[10px]",
      badgeRadius: "rounded-[5px]",
    },
    lg: {
      enclosureW: 288,
      enclosureH: 86,
      enclosurePadding: "p-[7px]",
      slabW: 274,
      slabH: 72,
      badgeW: 64,
      badgeH: 60,
      pixelSize: 3.6,
      gap: 3.8,
      compactCols: 7,
      expandedCols: 32,
      fontSize: "text-[22px]",
      enclosureRadius: "rounded-[20px]",
      slabRadius: "rounded-[12px]",
      badgeRadius: "rounded-[6px]",
    },
  }[size];

  const totalCols = isExpanded ? sizeConfig.expandedCols : sizeConfig.compactCols;

  // Continuous left-to-right LED column shift timer (seamless periodic cycle of 6)
  useEffect(() => {
    if (!enableMovingLoop) return;
    const timer = setInterval(() => {
      setFrame((prev) => (prev + 1) % 6);
    }, stepSpeedMs);
    return () => clearInterval(timer);
  }, [enableMovingLoop, stepSpeedMs]);

  // Theme palettes & lighting configurations
  const themeStyles = {
    monochrome: {
      ledColor: "#FFFFFF",
      ledDimColor: "rgba(255, 255, 255, 0.12)",
      ledGlow: "rgba(255, 255, 255, 0.7)",
      screenBg: "#8C8C8C",
      screenInnerBevel: "inset 0px 1px 1px 0px rgba(255, 255, 255, 0.35)",
      slabBg: "linear-gradient(180deg, #4A5157 0%, #2A2D30 50%, #1A1C1E 100%)",
      textColor: "#FFFFFF",
      chassisBorder: "rgba(255, 255, 255, 0.85)",
      enclosureBg: "#000000",
      ambientGlow: "rgba(255, 255, 255, 0.05)",
      dropShadow:
        "0px 3px 3px 0px rgba(0,0,0,0.1), 60px 50px 80px 0px rgba(0,0,0,0.15), 20px 42px 33px 0px rgba(0,0,0,0.15), 10px 22px 18px 0px rgba(0,0,0,0.14), 4px 12px 10px 0px rgba(0,0,0,0.14), 0px 7px 5px 0px rgba(0,0,0,0.13), 0px 3px 2px 0px rgba(0,0,0,0.12)",
    },
    emerald: {
      ledColor: "#10B981",
      ledDimColor: "rgba(16, 185, 129, 0.15)",
      ledGlow: "#34D399",
      screenBg: "#064E3B",
      screenInnerBevel: "inset 0px 1px 1px 0px rgba(52, 211, 153, 0.5)",
      slabBg: "linear-gradient(180deg, #0F3D32 0%, #082921 50%, #031511 100%)",
      textColor: "#E6FFFA",
      chassisBorder: "rgba(52, 211, 153, 0.8)",
      enclosureBg: "#01120D",
      ambientGlow: "rgba(16, 185, 129, 0.25)",
      dropShadow:
        "0px 20px 40px rgba(5,40,30,0.5), 0px 8px 16px rgba(5,40,30,0.3), inset 0px 0px 2px 4px rgba(52,211,153,0.1)",
    },
    cyan: {
      ledColor: "#06B6D4",
      ledDimColor: "rgba(6, 182, 212, 0.15)",
      ledGlow: "#67E8F9",
      screenBg: "#164E63",
      screenInnerBevel: "inset 0px 1px 1px 0px rgba(103, 232, 249, 0.5)",
      slabBg: "linear-gradient(180deg, #163645 0%, #0E242E 50%, #061318 100%)",
      textColor: "#ECFEFF",
      chassisBorder: "rgba(103, 232, 249, 0.8)",
      enclosureBg: "#020D12",
      ambientGlow: "rgba(6, 182, 212, 0.25)",
      dropShadow:
        "0px 20px 40px rgba(4,30,40,0.5), 0px 8px 16px rgba(4,30,40,0.3), inset 0px 0px 2px 4px rgba(6,182,212,0.1)",
    },
    amber: {
      ledColor: "#F59E0B",
      ledDimColor: "rgba(245, 158, 11, 0.15)",
      ledGlow: "#FCD34D",
      screenBg: "#78350F",
      screenInnerBevel: "inset 0px 1px 1px 0px rgba(252, 211, 77, 0.5)",
      slabBg: "linear-gradient(180deg, #42240C 0%, #291505 50%, #140A02 100%)",
      textColor: "#FEF3C7",
      chassisBorder: "rgba(252, 211, 77, 0.8)",
      enclosureBg: "#0C0601",
      ambientGlow: "rgba(245, 158, 11, 0.25)",
      dropShadow:
        "0px 20px 40px rgba(40,20,5,0.5), 0px 8px 16px rgba(40,20,5,0.3), inset 0px 0px 2px 4px rgba(245,158,11,0.1)",
    },
    crimson: {
      ledColor: "#EF4444",
      ledDimColor: "rgba(239, 68, 68, 0.15)",
      ledGlow: "#FCA5A5",
      screenBg: "#7F1D1D",
      screenInnerBevel: "inset 0px 1px 1px 0px rgba(252, 165, 165, 0.5)",
      slabBg: "linear-gradient(180deg, #451214 0%, #2A090B 50%, #150304 100%)",
      textColor: "#FEE2E2",
      chassisBorder: "rgba(252, 165, 165, 0.8)",
      enclosureBg: "#0D0102",
      ambientGlow: "rgba(239, 68, 68, 0.25)",
      dropShadow:
        "0px 20px 40px rgba(40,5,10,0.5), 0px 8px 16px rgba(40,5,10,0.3), inset 0px 0px 2px 4px rgba(239,68,68,0.1)",
    },
  }[theme];

  /**
   * Evaluates if a stationary LED pixel at (row, col) is currently illuminated
   * by the unbroken stream of moving chevrons traveling across the fixed physical grid.
   * Completely seamless with ZERO gaps!
   */
  const checkIsPixelLit = (row: number, col: number): boolean => {
    // Only rows 1, 2, 3, 4, 5 participate in the chevron arrowhead
    if (row === 0 || row === 6) return false;

    // Relative column position inside the continuous 6-column periodic cell
    const cellCol = ((col - frame) % 6 + 6) % 6;

    // 1:1 Pixel Chevron shape (3 pixels thick, pointing right):
    // Row 1: cellCol 0, 1, 2
    // Row 2: cellCol 1, 2, 3
    // Row 3: cellCol 2, 3, 4 (Peak)
    // Row 4: cellCol 1, 2, 3
    // Row 5: cellCol 0, 1, 2
    if (row === 1 || row === 5) {
      return cellCol >= 0 && cellCol <= 2;
    }
    if (row === 2 || row === 4) {
      return cellCol >= 1 && cellCol <= 3;
    }
    if (row === 3) {
      return cellCol >= 2 && cellCol <= 4;
    }
    return false;
  };

  const handleButtonClick = () => {
    if (stateMode === "interactive" && (interactionMode === "click" || interactionMode === "both")) {
      setIsToggled((prev) => !prev);
    }
    onClick?.();
  };

  return (
    <motion.button
      type="button"
      onClick={handleButtonClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.975, y: 1.5 }}
      transition={{ type: "spring", stiffness: 450, damping: 28 }}
      className={`relative inline-flex items-center justify-center select-none cursor-pointer outline-none ${className}`}
      style={{
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: "center center",
      }}
    >
      {/* ─────────────────────────────────────────────────────────────
          OUTER RECESSED ENCLOSURE TRAY (Figma Node 19:6440 / 19:6560)
         ───────────────────────────────────────────────────────────── */}
      <div
        className={`relative flex items-center justify-center ${sizeConfig.enclosurePadding} ${sizeConfig.enclosureRadius}`}
        style={{
          backgroundColor: themeStyles.enclosureBg,
          boxShadow: "0px 1.5px 0px rgba(255, 255, 255, 0.1), inset 0px 0px 2px 0px rgba(0, 0, 0, 0.08)",
        }}
      >
        {/* ─────────────────────────────────────────────────────────────
            TACTILE CARBON-FIBER SLAB (Figma Node 19:6441 / 19:6561)
           ───────────────────────────────────────────────────────────── */}
        <div
          className={`relative flex items-center justify-between overflow-hidden border p-[5px] ${sizeConfig.slabRadius}`}
          style={{
            width: sizeConfig.slabW,
            height: sizeConfig.slabH,
            backgroundImage: themeStyles.slabBg,
            borderColor: themeStyles.chassisBorder,
            boxShadow: `${themeStyles.dropShadow}, inset 0px -2px 0px 0px #1a1a1a, inset 0px 0px 2px 4px rgba(255,255,255,0.08), inset 0px 0px 1px 2px black`,
          }}
        >
          {/* Micro-Grid Carbon Texture Overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)",
              backgroundSize: "4px 4px",
            }}
          />

          {/* ─────────────────────────────────────────────────────────────
              EXPANDABLE LED DOT MATRIX SCREEN (Nodes 19:6442 / 19:6562)
             ───────────────────────────────────────────────────────────── */}
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className={`relative flex items-center justify-center overflow-hidden shrink-0 ${sizeConfig.badgeRadius}`}
            style={{
              height: sizeConfig.badgeH,
              width: isExpanded ? "100%" : sizeConfig.badgeW,
              backgroundColor: themeStyles.screenBg,
              boxShadow: themeStyles.screenInnerBevel,
              padding: "4px",
            }}
          >
            {/* Ambient Inner Glow Beam */}
            <div
              className="absolute inset-0 pointer-events-none opacity-25"
              style={{
                background: `radial-gradient(circle at center, ${themeStyles.ledColor} 0%, transparent 80%)`,
              }}
            />

            {/* ─────────────────────────────────────────────────────────────
                FIXED PHYSICAL STATIONARY 7-ROW LED MATRIX GRID
                Only the illuminated LED states travel from left to right!
               ───────────────────────────────────────────────────────────── */}
            <div
              className="relative flex flex-col items-center justify-center pointer-events-none"
              style={{
                gap: `${sizeConfig.gap}px`,
              }}
            >
              {[0, 1, 2, 3, 4, 5, 6].map((row) => (
                <div
                  key={row}
                  className="flex items-center"
                  style={{ gap: `${sizeConfig.gap}px` }}
                >
                  {Array.from({ length: totalCols }).map((_, col) => {
                    const isLit = checkIsPixelLit(row, col);
                    return (
                      <div
                        key={`${row}-${col}`}
                        className="rounded-[0.6px] shrink-0 transition-colors duration-75"
                        style={{
                          width: `${sizeConfig.pixelSize}px`,
                          height: `${sizeConfig.pixelSize}px`,
                          backgroundColor: isLit
                            ? themeStyles.ledColor
                            : themeStyles.ledDimColor,
                          boxShadow:
                            isLit && themeStyles.ledGlow
                              ? `0px 0px 4px ${themeStyles.ledGlow}`
                              : undefined,
                          opacity: isLit ? 1 : 0.22,
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </motion.div>

          {/* ─────────────────────────────────────────────────────────────
              TEXT LABEL (Figma Node 19:6493 - "See Plans")
             ───────────────────────────────────────────────────────────── */}
          {!isExpanded && (
            <motion.span
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.18 }}
              className={`relative z-10 flex-1 text-center font-normal whitespace-nowrap px-4 select-none ${sizeConfig.fontSize}`}
              style={{
                fontFamily: "var(--font-jakarta), var(--font-sans), sans-serif",
                color: themeStyles.textColor,
                letterSpacing: "-0.2px",
              }}
            >
              {label}
            </motion.span>
          )}
        </div>
      </div>
    </motion.button>
  );
};

export default LedMatrixChevronButton;
