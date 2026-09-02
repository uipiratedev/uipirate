"use client";

import React from "react";
import dynamic from "next/dynamic";

/**
 * Maps a Component Lab slug to the EXACT same dedicated studio screen that is
 * rendered at /buttons/<slug>. The Component Lab detail page embeds this screen
 * inside its shell so the playground, every variant/preset, colours, labels,
 * sizing, code tabs and API table stay 1:1 with the standalone button page —
 * there is a single source of truth and nothing can drift.
 *
 * Slugs here must match the `id` used in `dashboardComponents.tsx`.
 */

const StudioLoading = () => (
  <div className="min-h-screen w-full flex items-center justify-center bg-[#0E0E10]">
    <div className="flex items-center gap-3 text-xs font-mono text-gray-400">
      <span className="w-2.5 h-2.5 rounded-full bg-[#FF5B04] animate-pulse" />
      <span>Loading studio…</span>
    </div>
  </div>
);

const studio = (importer: () => Promise<{ default: React.ComponentType }>) =>
  dynamic(importer, { loading: () => <StudioLoading /> });

export const COMPONENT_LAB_SCREENS: Record<string, React.ComponentType> = {
  "isometric-revive-button": studio(() => import("@/screens/buttons/isometricRevive")),
  "tactile-pill-button": studio(() => import("@/screens/buttons/tactilePill")),
  "frosted-gel-download-button": studio(() => import("@/screens/buttons/frostedGelDownload")),
  "elevated-underglow-cta": studio(() => import("@/screens/buttons/elevatedUnderglow")),
  "led-matrix-chevron": studio(() => import("@/screens/buttons/ledMatrixChevron")),
  "slide-grow-button": studio(() => import("@/screens/buttons/slideGrow")),
  "vintage-leather-cta": studio(() => import("@/screens/buttons/vintageLeather")),
  "neumorphic-glow-cta": studio(() => import("@/screens/buttons/neumorphicGlow")),
  "smash-tactile-button": studio(() => import("@/screens/buttons/smashButton")),
  "scaling-capsule-button": studio(() => import("@/screens/buttons/scalingCapsule")),
  "magnetic-pulse-cta": studio(() => import("@/screens/buttons/magneticPulse")),
  "arc-corner-toggle": studio(() => import("@/screens/buttons/arcCornerToggle")),
  "animated-slide-button": studio(() => import("@/screens/buttons/animatedSlide")),
  "tactile-neumorphic-switch": studio(() => import("@/screens/buttons/tactileNeumorphicSwitch")),
  "glossy-gel-button": studio(() => import("@/screens/buttons/glossyGel")),
};

export const getComponentLabScreen = (id: string): React.ComponentType | undefined =>
  COMPONENT_LAB_SCREENS[id];
