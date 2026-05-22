import { CSSProperties } from "react";

/**
 * Standardized GlassSurface presets for consistent UI across the application.
 * 
 * These presets ensure all hero sections and badges maintain the same
 * premium glassmorphism appearance while preserving the SSR/hydration fixes.
 */

export interface GlassSurfacePreset {
  backgroundOpacity: number;
  blueOffset: number;
  blur: number;
  borderRadius: number;
  borderWidth: number;
  brightness: number;
  displace: number;
  distortionScale: number;
  forceLightMode: boolean;
  greenOffset: number;
  opacity: number;
  redOffset: number;
  saturation: number;
  width: string;
  height: string;
}

/**
 * Premium hero badge preset - used across all hero sections
 * This is the "gold standard" configuration for GlassSurface badges
 *
 * IMPORTANT: backgroundOpacity is set to 1.0 to create a SOLID surface
 * that completely hides underlying grid patterns and backgrounds.
 * This matches the Apps4Sale visual style exactly.
 */
export const HERO_BADGE_PRESET: GlassSurfacePreset = {
  backgroundOpacity: 1.0,  // SOLID - no transparency, hides grid lines
  blueOffset: 20,
  blur: 11,
  borderRadius: 12,
  borderWidth: 0.01,
  brightness: 50,
  displace: 0.5,
  distortionScale: -180,
  forceLightMode: true,
  greenOffset: 10,
  opacity: 1.0,  // SOLID - full opacity
  redOffset: 0,
  saturation: 1,
  width: "auto",
  height: "auto",
};

/**
 * Standard className for hero badges
 */
export const HERO_BADGE_CLASSNAME = 
  "md:my-9 max-md:my-5 !flex !flex-row !items-center !gap-3 isolate overflow-visible p-2 px-4 max-md:mx-2";

/**
 * Entry animation style for hero badges
 */
export const HERO_BADGE_ANIMATION_STYLE: CSSProperties = {
  animation: "trustBadgeUp 0.5s ease-out forwards",
  animationDelay: "0.1s",
  opacity: 0,
  transform: "translateY(20px) scale(0.95)",
};


