"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

export type SlideGrowTheme = "uipirate" | "pirate" | "silver" | "dark" | "cyberpunk" | "emerald" | "orange";
export type SlideGrowStateMode = "interactive" | "standerd" | "slid";
export type SlideGrowInteractionMode = "both" | "drag" | "click" | "hover";
export type SlideGrowSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface SlideGrowButtonProps {
  /** Initial label text when resting (default: "Get Started") */
  startLabel?: string;
  /** Active label text revealed when slid (default: "Lets Grow!") */
  activeLabel?: string;
  /** Visual theme preset (default: "silver" from Figma) */
  theme?: SlideGrowTheme;
  /** Size scale: "sm" | "md" | "lg" */
  size?: SlideGrowSize;
  /** Visual state mode: 'interactive' (swipeable/clickable), 'standerd' (17:1222), 'slid' (17:1240) */
  stateMode?: SlideGrowStateMode;
  /** Interaction trigger mode: 'both' (slide & click), 'drag' (slide only), 'click' (click only), 'hover' */
  interactionMode?: SlideGrowInteractionMode;
  /** Callback triggered when slider reaches completion (slid to right) */
  onComplete?: () => void;
  /** Callback triggered on reset back to start */
  onReset?: () => void;
  /** Custom scale factor */
  scale?: number;
  /** Additional CSS class names */
  className?: string;
}

/**
 * 1:1 Pixel-Accurate Implementation of Figma Nodes 17:1222 & 17:1240
 * Master Button Collection - Interactive Swipe to Grow / Slide to Unlock Slider Button
 */
export const SlideGrowButton: React.FC<SlideGrowButtonProps> = ({
  startLabel = "Get Started",
  activeLabel = "Lets Grow!",
  theme = "silver",
  size = "md",
  stateMode = "interactive",
  interactionMode = "both",
  onComplete,
  onReset,
  scale = 1,
  className = "",
}) => {
  const [isCompleted, setIsCompleted] = useState(stateMode === "slid");
  const [isHovered, setIsHovered] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // Scaled dimensions matching exact Figma 247x76px chassis & 48px knob
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
      width: 200,
      height: 62,
      trackW: 165,
      trackH: 36,
      knobSize: 38,
      knobTop: 10,
      knobLeft: 14,
      maxDrag: 127,
      fontSize: "text-[14px]",
      arrowSize: 15,
      dotSize: 5,
      radius: "rounded-[48px]",
      trackRadius: "rounded-[24px]",
    },
    md: {
      width: 247,
      height: 76,
      trackW: 204,
      trackH: 44,
      knobSize: 48,
      knobTop: 12,
      knobLeft: 17,
      maxDrag: 160,
      fontSize: "text-[18px]",
      arrowSize: 18,
      dotSize: 6,
      radius: "rounded-[60px]",
      trackRadius: "rounded-[30px]",
    },
    lg: {
      width: 300,
      height: 92,
      trackW: 248,
      trackH: 54,
      knobSize: 58,
      knobTop: 15,
      knobLeft: 21,
      maxDrag: 194,
      fontSize: "text-[22px]",
      arrowSize: 22,
      dotSize: 7,
      radius: "rounded-[72px]",
      trackRadius: "rounded-[36px]",
    },
  }[__baseSize];

  // Drag position motion value
  const dragX = useMotionValue(stateMode === "slid" ? sizeConfig.maxDrag : 0);

  // Sync forced stateMode changes
  useEffect(() => {
    if (stateMode === "slid") {
      animate(dragX, sizeConfig.maxDrag, { type: "spring", stiffness: 400, damping: 30 });
      setIsCompleted(true);
    } else if (stateMode === "standerd") {
      animate(dragX, 0, { type: "spring", stiffness: 400, damping: 30 });
      setIsCompleted(false);
    }
  }, [stateMode, sizeConfig.maxDrag, dragX]);

  // Transform values based on drag progress (0 to maxDrag)
  const startTextOpacity = useTransform(dragX, [0, sizeConfig.maxDrag * 0.4], [1, 0]);
  const activeTextOpacity = useTransform(dragX, [sizeConfig.maxDrag * 0.4, sizeConfig.maxDrag], [0, 1]);
  const beamOpacity = useTransform(dragX, [0, sizeConfig.maxDrag * 0.7], [0, 1]);
  const dotOpacity = useTransform(dragX, [0, sizeConfig.maxDrag * 0.3], [1, 0]);
  const arrowOpacity = useTransform(dragX, [sizeConfig.maxDrag * 0.3, sizeConfig.maxDrag], [0, 1]);

  // Themes configurations
  const themeStyles = {
    uipirate: {
      chassisBg: "linear-gradient(180deg, #7C2D12 0%, #431407 100%)",
      chassisBorder: "rgba(255, 91, 4, 0.5)",
      trackBg: "rgba(0, 0, 0, 0.45)",
      startTextColor: "#FFF3EC",
      activeTextColor: "#FF5B04",
      activeTextGlow: "0px 0px 8px rgba(255, 91, 4, 0.9)",
      beamBg: "#7C2D12",
      beamShadow: "0px 0px 12px 0px #FF5B04, 0px 4px 44px 0px rgba(255,91,4,0.5), inset 0px 0px 10px 0px #FF5B04",
      knobGradient: "radial-gradient(50% 50% at 50% 50%, #FF5B04 0%, #C2410C 100%)",
      knobBorder: "#FFA114",
      knobShadow:
        "0px 91px 76px rgba(255,91,4,0.4), 0px 38px 32px rgba(255,91,4,0.3), 0px 20px 17px rgba(255,91,4,0.2)",
      chassisDropShadow:
        "0px 80px 40px rgba(45,15,5,0.7), 0px 35px 20px rgba(45,15,5,0.5), 0px 10px 10px rgba(0,0,0,0.3)",
    },
    pirate: {
      chassisBg: "linear-gradient(180deg, #7C2D12 0%, #431407 100%)",
      chassisBorder: "rgba(255, 91, 4, 0.5)",
      trackBg: "rgba(0, 0, 0, 0.45)",
      startTextColor: "#FFF3EC",
      activeTextColor: "#FF5B04",
      activeTextGlow: "0px 0px 8px rgba(255, 91, 4, 0.9)",
      beamBg: "#7C2D12",
      beamShadow: "0px 0px 12px 0px #FF5B04, 0px 4px 44px 0px rgba(255,91,4,0.5), inset 0px 0px 10px 0px #FF5B04",
      knobGradient: "radial-gradient(50% 50% at 50% 50%, #FF5B04 0%, #C2410C 100%)",
      knobBorder: "#FFA114",
      knobShadow:
        "0px 91px 76px rgba(255,91,4,0.4), 0px 38px 32px rgba(255,91,4,0.3), 0px 20px 17px rgba(255,91,4,0.2)",
      chassisDropShadow:
        "0px 80px 40px rgba(45,15,5,0.7), 0px 35px 20px rgba(45,15,5,0.5), 0px 10px 10px rgba(0,0,0,0.3)",
    },
    silver: {
      chassisBg: "linear-gradient(180deg, rgba(200, 200, 200, 0.85) 0%, rgba(130, 130, 130, 0.85) 100%)",
      chassisBorder: "rgba(255, 255, 255, 0.45)",
      trackBg: "rgba(0, 0, 0, 0.14)",
      startTextColor: "#FFFFFF",
      activeTextColor: "#468AFF",
      activeTextGlow: "0px 0px 4px #C1CCFF",
      beamBg: "#FFFFFF",
      beamShadow: "0px 0px 7px 0px #A5C0FF, 0px 4px 44px 0px #A6ADFF, inset 0px 0px 10px 0px #95BEFF",
      knobGradient: "radial-gradient(50% 50% at 50% 50%, #001AFF 0%, #1500C9 100%)",
      knobBorder: "#42D3FF",
      knobShadow:
        "0px 91px 76px rgba(0,20,255,0.33), 0px 38px 32px rgba(0,20,255,0.24), 0px 20px 17px rgba(0,20,255,0.2), 0px 11px 9.5px rgba(0,20,255,0.17), 0px 6px 5px rgba(0,20,255,0.13), 0px 2.5px 2px rgba(0,20,255,0.09)",
      chassisDropShadow:
        "0px 100px 40px rgba(0,0,0,0.33), 0px 42px 17px rgba(0,0,0,0.24), 0px 22px 9px rgba(0,0,0,0.2), 0px 12.5px 5px rgba(0,0,0,0.17), 0px 6.6px 2.7px rgba(0,0,0,0.13), 0px 2.8px 1.1px rgba(0,0,0,0.09), inset 0px 1px 1px 0px rgba(255, 255, 255, 0.8), inset 0px -1px 2px 0px rgba(0, 0, 0, 0.25)",
    },
    dark: {
      chassisBg: "linear-gradient(180deg, #27272A 0%, #18181B 100%)",
      chassisBorder: "rgba(255, 255, 255, 0.15)",
      trackBg: "rgba(0, 0, 0, 0.4)",
      startTextColor: "#A1A1AA",
      activeTextColor: "#06B6D4",
      activeTextGlow: "0px 0px 6px rgba(6, 182, 212, 0.8)",
      beamBg: "#164E63",
      beamShadow: "0px 0px 10px 0px #06B6D4, 0px 4px 44px 0px rgba(6,182,212,0.4), inset 0px 0px 10px 0px #06B6D4",
      knobGradient: "radial-gradient(50% 50% at 50% 50%, #0891B2 0%, #0E7490 100%)",
      knobBorder: "#67E8F9",
      knobShadow:
        "0px 91px 76px rgba(6,182,212,0.35), 0px 38px 32px rgba(6,182,212,0.25), 0px 20px 17px rgba(6,182,212,0.2)",
      chassisDropShadow:
        "0px 80px 40px rgba(0,0,0,0.6), 0px 35px 20px rgba(0,0,0,0.45), 0px 10px 10px rgba(0,0,0,0.3)",
    },
    cyberpunk: {
      chassisBg: "linear-gradient(180deg, #1E1735 0%, #0F0A1E 100%)",
      chassisBorder: "rgba(192, 132, 252, 0.4)",
      trackBg: "rgba(0, 0, 0, 0.5)",
      startTextColor: "#E9D5FF",
      activeTextColor: "#C084FC",
      activeTextGlow: "0px 0px 8px rgba(192, 132, 252, 0.9)",
      beamBg: "#3B0764",
      beamShadow: "0px 0px 12px 0px #C084FC, 0px 4px 44px 0px rgba(192,132,252,0.5), inset 0px 0px 10px 0px #C084FC",
      knobGradient: "radial-gradient(50% 50% at 50% 50%, #9333EA 0%, #6B21A8 100%)",
      knobBorder: "#F0ABFC",
      knobShadow:
        "0px 91px 76px rgba(168,85,247,0.4), 0px 38px 32px rgba(168,85,247,0.3), 0px 20px 17px rgba(168,85,247,0.2)",
      chassisDropShadow:
        "0px 80px 40px rgba(0,0,0,0.7), 0px 35px 20px rgba(0,0,0,0.5), 0px 10px 10px rgba(0,0,0,0.3)",
    },
    emerald: {
      chassisBg: "linear-gradient(180deg, #134E4A 0%, #042F2E 100%)",
      chassisBorder: "rgba(52, 211, 153, 0.4)",
      trackBg: "rgba(0, 0, 0, 0.45)",
      startTextColor: "#CCFBF1",
      activeTextColor: "#34D399",
      activeTextGlow: "0px 0px 6px rgba(52, 211, 153, 0.8)",
      beamBg: "#064E3B",
      beamShadow: "0px 0px 10px 0px #34D399, 0px 4px 44px 0px rgba(52,211,153,0.4), inset 0px 0px 10px 0px #34D399",
      knobGradient: "radial-gradient(50% 50% at 50% 50%, #059669 0%, #047857 100%)",
      knobBorder: "#6EE7B7",
      knobShadow:
        "0px 91px 76px rgba(16,185,129,0.35), 0px 38px 32px rgba(16,185,129,0.25), 0px 20px 17px rgba(16,185,129,0.2)",
      chassisDropShadow:
        "0px 80px 40px rgba(0,0,0,0.6), 0px 35px 20px rgba(0,0,0,0.45), 0px 10px 10px rgba(0,0,0,0.3)",
    },
    orange: {
      chassisBg: "linear-gradient(180deg, #7C2D12 0%, #431407 100%)",
      chassisBorder: "rgba(251, 146, 60, 0.4)",
      trackBg: "rgba(0, 0, 0, 0.45)",
      startTextColor: "#FFEDD5",
      activeTextColor: "#FB923C",
      activeTextGlow: "0px 0px 6px rgba(251, 146, 60, 0.8)",
      beamBg: "#7C2D12",
      beamShadow: "0px 0px 10px 0px #FB923C, 0px 4px 44px 0px rgba(251,146,60,0.4), inset 0px 0px 10px 0px #FB923C",
      knobGradient: "radial-gradient(50% 50% at 50% 50%, #EA580C 0%, #C2410C 100%)",
      knobBorder: "#FDBA74",
      knobShadow:
        "0px 91px 76px rgba(249,115,22,0.35), 0px 38px 32px rgba(249,115,22,0.25), 0px 20px 17px rgba(249,115,22,0.2)",
      chassisDropShadow:
        "0px 80px 40px rgba(0,0,0,0.6), 0px 35px 20px rgba(0,0,0,0.45), 0px 10px 10px rgba(0,0,0,0.3)",
    },
  }[theme];

  const canDrag = stateMode === "interactive" && (interactionMode === "both" || interactionMode === "drag");
  const canClick = stateMode === "interactive" && (interactionMode === "both" || interactionMode === "click");
  const isHoverMode = stateMode === "interactive" && interactionMode === "hover";

  // Handle drag end snapping and callbacks
  const handleDragEnd = () => {
    const currentX = dragX.get();
    if (currentX > sizeConfig.maxDrag * 0.5) {
      animate(dragX, sizeConfig.maxDrag, {
        type: "spring",
        stiffness: 450,
        damping: 30,
        onComplete: () => {
          setIsCompleted(true);
          onComplete?.();
        },
      });
    } else {
      animate(dragX, 0, {
        type: "spring",
        stiffness: 450,
        damping: 30,
        onComplete: () => {
          setIsCompleted(false);
          onReset?.();
        },
      });
    }
  };

  // Toggle on click
  const handleToggleClick = () => {
    if (!canClick) return;
    if (isCompleted) {
      animate(dragX, 0, {
        type: "spring",
        stiffness: 400,
        damping: 30,
        onComplete: () => {
          setIsCompleted(false);
          onReset?.();
        },
      });
    } else {
      animate(dragX, sizeConfig.maxDrag, {
        type: "spring",
        stiffness: 400,
        damping: 30,
        onComplete: () => {
          setIsCompleted(true);
          onComplete?.();
        },
      });
    }
  };

  // Hover mode handlers
  const handleHoverStart = () => {
    setIsHovered(true);
    if (isHoverMode) {
      animate(dragX, sizeConfig.maxDrag, {
        type: "spring",
        stiffness: 400,
        damping: 30,
        onComplete: () => {
          setIsCompleted(true);
          onComplete?.();
        },
      });
    }
  };

  const handleHoverEnd = () => {
    setIsHovered(false);
    if (isHoverMode) {
      animate(dragX, 0, {
        type: "spring",
        stiffness: 400,
        damping: 30,
        onComplete: () => {
          setIsCompleted(false);
          onReset?.();
        },
      });
    }
  };

  return __wrapSize(
    <div
      className={`relative inline-flex select-none items-center justify-center ${className}`}
      style={{
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: "center center",
      }}
    >
      {/* ─────────────────────────────────────────────────────────────
          METALLIC CHASSIS CAPSULE (Figma Nodes 17:1226 / 17:1227)
         ───────────────────────────────────────────────────────────── */}
      <motion.div
        onMouseEnter={handleHoverStart}
        onMouseLeave={handleHoverEnd}
        onClick={handleToggleClick}
        whileHover={{ scale: 1.02 }}
        whileTap={canClick ? { scale: 0.972, y: 1.5 } : undefined}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
        className={`relative flex items-center justify-center border-[1.5px] backdrop-blur-md ${sizeConfig.radius} overflow-hidden ${
          canClick ? "cursor-pointer" : ""
        }`}
        style={{
          width: sizeConfig.width,
          height: sizeConfig.height,
          backgroundImage: themeStyles.chassisBg,
          borderColor: themeStyles.chassisBorder,
          boxShadow: `${themeStyles.chassisDropShadow}, 0px 10px 10px rgba(0,0,0,0.14)`,
        }}
      >
        {/* ─────────────────────────────────────────────────────────────
            RECESSED TRACK CAVITY (Figma Nodes 17:1229 / 17:1258)
           ───────────────────────────────────────────────────────────── */}
        <div
          ref={trackRef}
          className={`relative flex items-center ${sizeConfig.trackRadius} overflow-hidden`}
          style={{
            width: sizeConfig.trackW,
            height: sizeConfig.trackH,
            backgroundColor: themeStyles.trackBg,
            boxShadow: "inset 0px 2px 4px rgba(0,0,0,0.35)",
          }}
        >
          {/* Glowing Neon Beam Channel Fill (Revealed as knob slides right) */}
          <motion.div
            className="absolute inset-y-0 left-0 rounded-[inherit] pointer-events-none"
            style={{
              width: useTransform(dragX, (v) => v + sizeConfig.knobSize),
              backgroundColor: themeStyles.beamBg,
              boxShadow: themeStyles.beamShadow,
              opacity: beamOpacity,
            }}
          />

          {/* Active Label ("Lets Grow!" - Perfectly centered in the illuminated beam zone) */}
          <motion.div
            className={`absolute inset-y-0 left-4 flex items-center justify-center font-['Figtree'],sans-serif font-normal capitalize whitespace-nowrap pointer-events-none ${sizeConfig.fontSize}`}
            style={{
              right: sizeConfig.knobSize,
              color: themeStyles.activeTextColor,
              textShadow: themeStyles.activeTextGlow,
              opacity: activeTextOpacity,
            }}
          >
            {activeLabel}
          </motion.div>

          {/* Start Label ("Get Started" - Perfectly centered in the resting track zone) */}
          <motion.div
            className={`absolute inset-y-0 right-4 flex items-center justify-center font-['Figtree'],sans-serif font-normal capitalize whitespace-nowrap pointer-events-none ${sizeConfig.fontSize}`}
            style={{
              left: sizeConfig.knobSize,
              color: themeStyles.startTextColor,
              opacity: startTextOpacity,
            }}
          >
            {startLabel}
          </motion.div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            GLOWING BLUE SLIDER KNOB (Figma Nodes 17:1235 / 17:1263)
           ───────────────────────────────────────────────────────────── */}
        <motion.div
          drag={canDrag ? "x" : false}
          dragConstraints={{ left: 0, right: sizeConfig.maxDrag }}
          dragElastic={0.08}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
          onClick={(e) => {
            if (canClick) {
              e.stopPropagation();
              handleToggleClick();
            }
          }}
          style={{
            x: dragX,
            left: sizeConfig.knobLeft,
            top: sizeConfig.knobTop,
            width: sizeConfig.knobSize,
            height: sizeConfig.knobSize,
            backgroundImage: themeStyles.knobGradient,
            borderColor: themeStyles.knobBorder,
            boxShadow: themeStyles.knobShadow,
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          className={`absolute z-20 flex items-center justify-center rounded-full border-[0.5px] select-none ${canDrag ? "cursor-grab active:cursor-grabbing" : canClick ? "cursor-pointer" : ""
            }`}
        >
          {/* Resting State: Glowing Center White Dot (Node 17:1222) */}
          <motion.div
            className="absolute rounded-full bg-white shadow-[0px_0px_8px_white]"
            style={{
              width: sizeConfig.dotSize,
              height: sizeConfig.dotSize,
              opacity: dotOpacity,
            }}
          />

          {/* Slid State: Illuminated Forward Arrow Icon (Node 17:1240) */}
          <motion.div
            className="absolute flex items-center justify-center text-white"
            style={{
              opacity: arrowOpacity,
            }}
          >
            <svg
              width={sizeConfig.arrowSize}
              height={sizeConfig.arrowSize}
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                filter: "drop-shadow(0px 0px 4px rgba(255,255,255,0.9))",
              }}
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SlideGrowButton;
