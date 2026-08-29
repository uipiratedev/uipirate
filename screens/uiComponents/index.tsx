"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import TactilePillButton from "@/components/TactilePillButton";
import ScalingCapsuleButton from "@/components/ScalingCapsuleButton";
import SmashTactileButton from "@/components/SmashTactileButton";
import GlassBadge from "@/components/GlassBadge";
import GlassSurface from "@/components/GlassSurface";
import { AnimatedButton } from "@/components/AnimatedButton";
import Avatar from "@/components/Avatar";
import { FrostedGelDownloadButton } from "@/components/FrostedGelDownloadButton";
import { IsometricReviveButton } from "@/components/IsometricReviveButton";
import { ElevatedUnderglowCTA } from "@/components/ElevatedUnderglowCTA";
import { LedMatrixChevronButton } from "@/components/LedMatrixChevronButton";
import { SlideGrowButton } from "@/components/SlideGrowButton";
import { VintageLeatherCTA } from "@/components/VintageLeatherCTA";
import { NeumorphicGlowCTA } from "@/components/NeumorphicGlowCTA";
import { ArcCornerToggle } from "@/components/ArcCornerToggle";
import { MagneticPulseCTA } from "@/components/MagneticPulseCTA";
import PageWrapper from "@/components/PageWrapper";

export type ComponentCategory = "buttons" | "controls" | "badges" | "surfaces";

// ─── Type Definitions ─────────────────────────────────────────────────────────

export interface PropRow {
  name: string;
  type: string;
  defaultValue: string;
  description: string;
}

export interface ComponentDetail {
  id: string;
  name: string;
  category: ComponentCategory;
  categoryLabel: string;
  badge?: string;
  badgeColor?: string;
  description: string;
  detailUrl?: string;
  features: string[];
  previewLight: React.ReactNode;
  previewDark: React.ReactNode;
  jsxCode: string;
  htmlCode: string;
  cssCode: string;
  props: PropRow[];
}

// ─── Component Catalog ────────────────────────────────────────────────────────

const ALL_COMPONENTS: ComponentDetail[] = [
  {
    id: "tactile-pill-button",
    name: "Tactile 3D Pill Button",
    category: "buttons",
    categoryLabel: "Buttons & CTAs",
    badge: "3D Tactile Spring",
    badgeColor: "#54EAD8",
    description:
      "Hyper-realistic 3D tactile button with recessed cavity slot, spring tilt physics, specular bevels, and glowing status beacon.",
    detailUrl: "/buttons/tactile-pill-button",
    features: ["Recessed tray depth", "Spring lift & tilt", "Radiant status glow", "5 Theme variants"],
    previewLight: (
      <div className="flex flex-col items-center justify-center p-12 gap-4">
        <TactilePillButton label="Get Started" dotColor="#00C49F" variant="default" size="md" />
        <div className="text-[11px] font-mono text-gray-500">Interactive: Hover &amp; Click for 3D spring tilt</div>
      </div>
    ),
    previewDark: (
      <div className="flex flex-col items-center justify-center p-12 gap-4">
        <TactilePillButton label="Get Started" dotColor="#54EAD8" variant="default" size="md" />
        <div className="text-[11px] font-mono text-gray-400">Interactive: Hover &amp; Click for 3D spring tilt</div>
      </div>
    ),
    jsxCode: `import { TactilePillButton } from "@/components/TactilePillButton";

export default function Example() {
  return (
    <TactilePillButton
      label="Get Started"
      dotColor="#54EAD8"
      variant="default"
      size="md"
      tiltAngle={-9.23}
      onClick={() => console.log("Clicked!")}
    />
  );
}`,
    htmlCode: `<div class="tactile-pill-container">
  <div class="tactile-cavity-slot"></div>
  <button class="tactile-cap">
    <span class="beacon-dot"></span>
    <span class="label">Get Started</span>
  </button>
</div>`,
    cssCode: `/* Tactile Popped-Up Cavity Tokens */
.tactile-cavity-slot {
  background: #D4D4D8;
  border-radius: 16px;
  box-shadow: inset 0px 2px 4px rgba(0, 0, 0, 0.3);
}

.tactile-cap {
  background: #EAEAEA;
  border-radius: 16px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.tactile-cap:hover {
  transform: translateY(-14px) rotate(-9.23deg);
}`,
    props: [
      { name: "label", type: "string", defaultValue: '"Get Started"', description: "Text displayed on the button cap" },
      { name: "dotColor", type: "string", defaultValue: '"#54EAD8"', description: "Hex color of the beacon LED indicator" },
      { name: "tiltAngle", type: "number", defaultValue: "-9.23", description: "Hover tilt angle in degrees" },
      { name: "size", type: '"sm" | "md" | "lg"', defaultValue: '"md"', description: "Scale multiplier" },
      { name: "onClick", type: "() => void", defaultValue: "undefined", description: "Click callback event handler" },
    ],
  },
  {
    id: "frosted-gel-download-button",
    name: "Frosted Gel Download Button",
    category: "buttons",
    categoryLabel: "Buttons & CTAs",
    badge: "Glassmorphism",
    badgeColor: "#2626FF",
    description:
      "Dual-pill neumorphic split button with elevated ceramic pill, frosted glass gel download tile, optical refraction rings, and volumetric blue underglow flare.",
    detailUrl: "/buttons/frosted-gel-download-button",
    features: ["Elevated ceramic pill", "Frosted glass cloud tile", "Volumetric blue underglow", "Interactive hover lift"],
    previewLight: (
      <div className="flex items-center justify-center p-12">
        <FrostedGelDownloadButton />
      </div>
    ),
    previewDark: (
      <div className="flex items-center justify-center p-12">
        <FrostedGelDownloadButton />
      </div>
    ),
    jsxCode: `import { FrostedGelDownloadButton } from "@/components/FrostedGelDownloadButton";

export default function Example() {
  return (
    <FrostedGelDownloadButton
      label="Download now"
      theme="figma-blue"
      size="md"
    />
  );
}`,
    htmlCode: `<div class="frosted-gel-button-wrapper">
  <button class="frosted-pill-primary">Download now</button>
  <div class="frosted-glass-tile">
    <svg class="download-icon" viewBox="0 0 24 24">...</svg>
  </div>
</div>`,
    cssCode: `/* Frosted Glass Tokens */
.frosted-glass-tile {
  backdrop-filter: blur(24px) saturate(180%);
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 40px rgba(38, 38, 255, 0.35);
  border-radius: 18px;
}`,
    props: [
      { name: "label", type: "string", defaultValue: '"Download Now"', description: "Primary button label text" },
      { name: "theme", type: '"figma-blue" | "dark" | "light"', defaultValue: '"figma-blue"', description: "Visual theme preset" },
      { name: "size", type: '"sm" | "md" | "lg"', defaultValue: '"md"', description: "Scale multiplier" },
      { name: "onClick", type: "() => void", defaultValue: "undefined", description: "Click callback handler" },
    ],
  },
  {
    id: "isometric-revive-button",
    name: "Isometric 3D Revive Button",
    category: "buttons",
    categoryLabel: "Buttons & CTAs",
    badge: "Isometric 30°",
    badgeColor: "#FFB020",
    description:
      "Authentic 30° isometric 3D extruded button featuring dynamic spring depression, obsidian bevel walls, amber indicator flare, and blinding optical neon underglow.",
    detailUrl: "/buttons/isometric-revive-button",
    features: ["30° Isometric matrix", "Multi-layer 3D extrusion", "Optical neon underglow", "Dynamic spring physics"],
    previewLight: (
      <div className="flex items-center justify-center p-12">
        <IsometricReviveButton label="Revive Now" theme="figma" size="sm" />
      </div>
    ),
    previewDark: (
      <div className="flex items-center justify-center p-12">
        <IsometricReviveButton label="Revive Now" theme="figma" size="sm" />
      </div>
    ),
    jsxCode: `import { IsometricReviveButton } from "@/components/IsometricReviveButton";

export default function Example() {
  return (
    <IsometricReviveButton
      label="Revive Now"
      theme="figma"
      size="sm"
    />
  );
}`,
    htmlCode: `<div class="iso-container">
  <div class="iso-underglow"></div>
  <button class="iso-button-cap">
    <span class="iso-label">Revive Now</span>
  </button>
</div>`,
    cssCode: `/* Isometric 3D Tokens */
.iso-button-top {
  transform: rotate(-30deg) skewX(0deg);
  transform-origin: center;
}
.iso-button-wall {
  clip-path: polygon(0 0, 100% 0, 85% 100%, 15% 100%);
  background: linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%);
}`,
    props: [
      { name: "label", type: "string", defaultValue: '"Revive Now"', description: "Button label text" },
      { name: "theme", type: '"figma" | "dark" | "amber"', defaultValue: '"figma"', description: "Color theme preset" },
      { name: "size", type: '"sm" | "md" | "lg"', defaultValue: '"sm"', description: "Scale multiplier" },
      { name: "onClick", type: "() => void", defaultValue: "undefined", description: "Click callback handler" },
    ],
  },
  {
    id: "elevated-underglow-cta",
    name: "Elevated Underglow 3D Button",
    category: "buttons",
    categoryLabel: "Buttons & CTAs",
    badge: "Tactile Elevation",
    badgeColor: "#0077FF",
    description:
      "Interactive 3D tactile pill button that elevates 13px on hover to reveal a glowing electric blue extruded sub-chassis, bottom reflection rim, and realistic clay elevation physics.",
    detailUrl: "/buttons/elevated-underglow-cta",
    features: ["13px Spring lift", "Electric blue 3D underlayer", "Interactive states", "Phone call icon"],
    previewLight: (
      <div className="flex items-center justify-center p-12">
        <ElevatedUnderglowCTA label="Book A Call" theme="figma" size="md" />
      </div>
    ),
    previewDark: (
      <div className="flex items-center justify-center p-12">
        <ElevatedUnderglowCTA label="Book A Call" theme="figma" size="md" />
      </div>
    ),
    jsxCode: `import { ElevatedUnderglowCTA } from "@/components/ElevatedUnderglowCTA";

export default function Example() {
  return (
    <ElevatedUnderglowCTA
      label="Book A Call"
      icon="phone"
      theme="figma"
      size="md"
    />
  );
}`,
    htmlCode: `<div class="elevated-underglow-wrapper">
  <div class="electric-chassis"></div>
  <button class="elevated-pill">Book A Call</button>
</div>`,
    cssCode: `/* Underglow 3D Elevation Tokens */
.underglow-chassis {
  background: #0055CC;
  box-shadow: 0 0 30px rgba(0, 119, 255, 0.6);
  border-radius: 100px;
}
.underglow-cap {
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.underglow-cap:hover {
  transform: translateY(-13px);
}`,
    props: [
      { name: "label", type: "string", defaultValue: '"Book A Call"', description: "Button label text" },
      { name: "theme", type: '"figma" | "dark" | "blue"', defaultValue: '"figma"', description: "Color theme preset" },
      { name: "size", type: '"sm" | "md" | "lg"', defaultValue: '"md"', description: "Scale multiplier" },
      { name: "icon", type: '"phone" | "arrow" | "none"', defaultValue: '"phone"', description: "Icon variant" },
      { name: "onClick", type: "() => void", defaultValue: "undefined", description: "Click callback handler" },
    ],
  },
  {
    id: "led-matrix-chevron",
    name: "LED Dot Matrix Chevron Button",
    category: "buttons",
    categoryLabel: "Buttons & CTAs",
    badge: "Cyberpunk Matrix",
    badgeColor: "#10B981",
    description:
      "Cyberpunk carbon-fiber squircle button with an expandable 7×7 LED dot matrix screen that stretches across the entire chassis on hover/click revealing 5 cascading pixel chevrons.",
    detailUrl: "/buttons/led-matrix-chevron",
    features: ["Expandable LED screen", "7x7 Dot matrix chevrons", "Cascading marquee wave", "Carbon squircle chassis"],
    previewLight: (
      <div className="flex items-center justify-center p-12">
        <LedMatrixChevronButton theme="monochrome" size="md" />
      </div>
    ),
    previewDark: (
      <div className="flex items-center justify-center p-12">
        <LedMatrixChevronButton theme="monochrome" size="md" />
      </div>
    ),
    jsxCode: `import { LedMatrixChevronButton } from "@/components/LedMatrixChevronButton";

export default function Example() {
  return (
    <LedMatrixChevronButton
      theme="monochrome"
      size="md"
    />
  );
}`,
    htmlCode: `<div class="led-matrix-button">
  <div class="carbon-squircle">
    <div class="led-screen-grid">
      <!-- 7x7 dot matrix items -->
    </div>
  </div>
</div>`,
    cssCode: `/* LED Matrix Cyberpunk Tokens */
.led-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #10B981;
  opacity: 0.3;
  transition: opacity 0.1s ease;
}
.led-dot.active {
  opacity: 1;
  box-shadow: 0 0 4px #10B981;
}`,
    props: [
      { name: "theme", type: '"monochrome" | "neon" | "amber"', defaultValue: '"monochrome"', description: "LED color theme" },
      { name: "size", type: '"sm" | "md" | "lg"', defaultValue: '"md"', description: "Scale multiplier" },
      { name: "onClick", type: "() => void", defaultValue: "undefined", description: "Click callback handler" },
    ],
  },
  {
    id: "slide-grow-button",
    name: "Swipe to Grow / Slide Button",
    category: "controls",
    categoryLabel: "Controls & Sliders",
    badge: "Capsule Slider",
    badgeColor: "#468AFF",
    description:
      "Interactive metallic capsule slider button with draggable glowing electric blue knob, illuminated neon channel fill, and dynamic masked text reveal.",
    detailUrl: "/buttons/slide-grow-button",
    features: ["Draggable knob physics", "Neon channel beam fill", "Masked text reveal", "Smooth slider snap"],
    previewLight: (
      <div className="flex items-center justify-center p-12">
        <SlideGrowButton theme="silver" size="md" />
      </div>
    ),
    previewDark: (
      <div className="flex items-center justify-center p-12">
        <SlideGrowButton theme="silver" size="md" />
      </div>
    ),
    jsxCode: `import { SlideGrowButton } from "@/components/SlideGrowButton";

export default function Example() {
  return (
    <SlideGrowButton
      theme="silver"
      size="md"
    />
  );
}`,
    htmlCode: `<div class="capsule-slider-track">
  <div class="slider-fill-channel"></div>
  <div class="slider-draggable-knob"></div>
  <span class="slider-mask-text">Slide to unlock</span>
</div>`,
    cssCode: `/* Capsule Slider Tokens */
.slider-track {
  background: linear-gradient(90deg, #468AFF 0%, transparent 100%);
  border-radius: 100px;
}
.slider-knob {
  box-shadow: 0 0 20px rgba(70, 138, 255, 0.8);
  cursor: grab;
}
.slider-knob:active { cursor: grabbing; }`,
    props: [
      { name: "theme", type: '"silver" | "dark" | "blue"', defaultValue: '"silver"', description: "Slider color theme" },
      { name: "size", type: '"sm" | "md" | "lg"', defaultValue: '"md"', description: "Scale multiplier" },
      { name: "onComplete", type: "() => void", defaultValue: "undefined", description: "Called when slider reaches end" },
    ],
  },
  {
    id: "vintage-leather-cta",
    name: "Vintage Leather & Brass Button",
    category: "buttons",
    categoryLabel: "Buttons & CTAs",
    badge: "Heritage Leather",
    badgeColor: "#B4986C",
    description:
      "Luxury embossed heritage leather & brass button with 6px bottom tactile bevel lip, recessed enclosure tray, and filigree scrollwork corner flourishes.",
    detailUrl: "/buttons/vintage-leather-cta",
    features: ["3D Tactile bevel lip", "Filigree corner ornaments", "Recessed enclosure tray", "5 Luxury themes"],
    previewLight: (
      <div className="flex items-center justify-center p-12">
        <VintageLeatherCTA theme="heritage" size="md" label="Shop Ties" />
      </div>
    ),
    previewDark: (
      <div className="flex items-center justify-center p-12">
        <VintageLeatherCTA theme="heritage" size="md" label="Shop Ties" />
      </div>
    ),
    jsxCode: `import { VintageLeatherCTA } from "@/components/VintageLeatherCTA";

export default function Example() {
  return (
    <VintageLeatherCTA
      theme="heritage"
      size="md"
      label="Shop ties"
    />
  );
}`,
    htmlCode: `<div class="leather-tray-enclosure">
  <button class="embossed-leather-btn">
    <span class="corner-filigree"></span>
    <span class="label">Shop ties</span>
  </button>
</div>`,
    cssCode: `/* Vintage Leather Tokens */
.leather-surface {
  background: repeating-linear-gradient(
    45deg, #5C3A1E, #5C3A1E 2px, #4A2E18 2px, #4A2E18 4px
  );
  border-bottom: 6px solid #2A1A0E;
}
.brass-accent {
  background: linear-gradient(135deg, #D4A853 0%, #B8860B 50%, #CD9B1D 100%);
}`,
    props: [
      { name: "label", type: "string", defaultValue: '"Shop Ties"', description: "Button label text" },
      { name: "theme", type: '"heritage" | "midnight" | "cognac" | "sage" | "slate"', defaultValue: '"heritage"', description: "Leather theme preset" },
      { name: "size", type: '"sm" | "md" | "lg"', defaultValue: '"md"', description: "Scale multiplier" },
      { name: "onClick", type: "() => void", defaultValue: "undefined", description: "Click callback handler" },
    ],
  },
  {
    id: "neumorphic-glow-cta",
    name: "Neumorphic Glow CTA",
    category: "buttons",
    categoryLabel: "Buttons & CTAs",
    badge: "Clay / Neumorphic",
    badgeColor: "#22C55E",
    description:
      "Authentic claymorphic and neumorphic elevated CTA button pair with glowing neon green badge depth, multi-tier elevation drop shadows, and plus-lighter bloom.",
    detailUrl: "/buttons/neumorphic-glow-cta",
    features: ["Pill & Squircle variants", "Neon green glow badge", "Multi-tier clay shadows", "Plus-lighter bloom"],
    previewLight: (
      <div className="flex items-center justify-center p-12 gap-6 flex-wrap">
        <NeumorphicGlowCTA variant="pill" label="Learn more" />
      </div>
    ),
    previewDark: (
      <div className="flex items-center justify-center p-12 gap-6 flex-wrap">
        <NeumorphicGlowCTA variant="pill" label="Learn more" />
      </div>
    ),
    jsxCode: `import { NeumorphicGlowCTA } from "@/components/NeumorphicGlowCTA";

export default function Example() {
  return (
    <NeumorphicGlowCTA
      variant="pill"
      label="Learn more"
    />
  );
}`,
    htmlCode: `<div class="neumorphic-wrapper">
  <button class="neumorphic-pill-btn">
    <span class="neon-pill-dot"></span>
    <span class="text">Learn more</span>
  </button>
</div>`,
    cssCode: `/* Neumorphic Glow Tokens */
.neumorphic-base {
  background: #e0e5ec;
  box-shadow:
    9px 9px 16px #b8bec7,
    -9px -9px 16px #ffffff;
  border-radius: 100px;
}
.neon-badge-glow {
  box-shadow: 0 0 20px rgba(34, 197, 94, 0.8);
}`,
    props: [
      { name: "label", type: "string", defaultValue: '"Learn more"', description: "Button label text" },
      { name: "variant", type: '"pill" | "squircle"', defaultValue: '"pill"', description: "Shape variant" },
      { name: "onClick", type: "() => void", defaultValue: "undefined", description: "Click callback handler" },
    ],
  },
  {
    id: "arc-corner-toggle",
    name: "Arc Corner Slider Toggle",
    category: "controls",
    categoryLabel: "Controls & Sliders",
    badge: "Arc Slider Switch",
    badgeColor: "#A855F7",
    description:
      "Interactive corner arc slider toggle with light and dark mode states, rotating capsule knob along a 90° circular track, sunken sunburst dial, and glowing magenta laser beam.",
    detailUrl: "/buttons/arc-corner-toggle",
    features: ["90° Corner arc track", "Sunburst dial loader", "Light & Dark dual mode", "Laser beam flare"],
    previewLight: (
      <div className="flex items-center justify-center p-12">
        <ArcCornerToggle scale={0.88} />
      </div>
    ),
    previewDark: (
      <div className="flex items-center justify-center p-12">
        <ArcCornerToggle scale={0.88} />
      </div>
    ),
    jsxCode: `import { ArcCornerToggle } from "@/components/ArcCornerToggle";

export default function Example() {
  return (
    <ArcCornerToggle
      scale={0.88}
      onChange={(isOn) => console.log("Toggle state:", isOn)}
    />
  );
}`,
    htmlCode: `<div class="arc-toggle-frame">
  <div class="radial-path-track"></div>
  <div class="radial-rotator-knob"></div>
</div>`,
    cssCode: `/* Arc Corner Toggle Tokens */
.arc-track {
  width: 120px;
  height: 120px;
  border-radius: 0 0 0 100%;
  border: 3px solid rgba(168, 85, 247, 0.4);
}
.arc-knob {
  box-shadow: 0 0 16px rgba(168, 85, 247, 0.9);
}`,
    props: [
      { name: "scale", type: "number", defaultValue: "0.88", description: "Scale multiplier for the component" },
      { name: "defaultOn", type: "boolean", defaultValue: "false", description: "Initial toggle state" },
      { name: "onChange", type: "(value: boolean) => void", defaultValue: "undefined", description: "Toggle state change callback" },
    ],
  },
  {
    id: "smash-tactile-button",
    name: "Tactile 'Smash' Button",
    category: "buttons",
    categoryLabel: "Buttons & CTAs",
    badge: "Neo-Brutalist",
    badgeColor: "#EF4444",
    description:
      "Neo-brutalist tech button with outer enclosure frame, cushion cooling tray, obsidian core slab, and glowing neon reactor underglow.",
    detailUrl: "/buttons/smash-tactile-button",
    features: ["Tech enclosure frame", "Cushion cooling tray", "Obsidian core slab", "Reactor underglow"],
    previewLight: (
      <div className="flex items-center justify-center p-12">
        <SmashTactileButton label="Smash the button" variant="figma" size="md" />
      </div>
    ),
    previewDark: (
      <div className="flex items-center justify-center p-12">
        <SmashTactileButton label="Smash the button" variant="figma" size="md" />
      </div>
    ),
    jsxCode: `import SmashTactileButton from "@/components/SmashTactileButton";

export default function Example() {
  return (
    <SmashTactileButton
      label="Smash the button"
      variant="figma"
      size="md"
    />
  );
}`,
    htmlCode: `<div class="smash-chassis">
  <div class="reactor-cooling-tray"></div>
  <button class="smash-core-slab">Smash the button</button>
</div>`,
    cssCode: `/* Neo-Brutalist Smash Tokens */
.smash-enclosure {
  border: 3px solid #1a1a1a;
  box-shadow: 4px 4px 0 #000;
  border-radius: 16px;
}
.smash-core {
  background: #0a0a0a;
  box-shadow: inset 0 2px 8px rgba(0,0,0,0.8);
}
.reactor-glow {
  box-shadow: 0 0 30px rgba(239, 68, 68, 0.6);
}`,
    props: [
      { name: "label", type: "string", defaultValue: '"Smash the button"', description: "Button label text" },
      { name: "variant", type: '"figma" | "dark" | "neon"', defaultValue: '"figma"', description: "Visual variant" },
      { name: "size", type: '"sm" | "md" | "lg"', defaultValue: '"md"', description: "Scale multiplier" },
      { name: "onClick", type: "() => void", defaultValue: "undefined", description: "Click callback handler" },
    ],
  },
  {
    id: "scaling-capsule-button",
    name: "Scaling Capsule Tactile Button",
    category: "buttons",
    categoryLabel: "Buttons & CTAs",
    badge: "Frosted Capsule",
    badgeColor: "#06B6D4",
    description:
      "Recessed capsule button featuring a frosted translucent glass tray, obsidian cap with multi-tiered elevation drop shadows, and circular apex emblem badge.",
    detailUrl: "/buttons/scaling-capsule-button",
    features: ["Frosted outer glass tray", "Multi-tier shadow stack", "26px Black circle", "Ladder-rung icon"],
    previewLight: (
      <div className="flex items-center justify-center p-12">
        <ScalingCapsuleButton label="Scaling Workshop" variant="dark" size="md" />
      </div>
    ),
    previewDark: (
      <div className="flex items-center justify-center p-12">
        <ScalingCapsuleButton label="Scaling Workshop" variant="dark" size="md" />
      </div>
    ),
    jsxCode: `import ScalingCapsuleButton from "@/components/ScalingCapsuleButton";

export default function Example() {
  return (
    <ScalingCapsuleButton
      label="Scaling Workshop"
      variant="dark"
      size="md"
    />
  );
}`,
    htmlCode: `<div class="scaling-capsule-tray">
  <button class="scaling-capsule-cap">
    <span class="scaling-emblem"></span>
    <span class="label">Scaling Workshop</span>
  </button>
</div>`,
    cssCode: `/* Frosted Capsule Tokens */
.capsule-tray {
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 100px;
  padding: 6px;
}
.capsule-cap {
  border-radius: 100px;
  box-shadow:
    0 4px 12px rgba(0,0,0,0.5),
    0 8px 24px rgba(0,0,0,0.3);
}`,
    props: [
      { name: "label", type: "string", defaultValue: '"Scaling Workshop"', description: "Button label text" },
      { name: "variant", type: '"dark" | "light" | "glass"', defaultValue: '"dark"', description: "Visual variant" },
      { name: "size", type: '"sm" | "md" | "lg"', defaultValue: '"md"', description: "Scale multiplier" },
      { name: "onClick", type: "() => void", defaultValue: "undefined", description: "Click callback handler" },
    ],
  },
  {
    id: "animated-slide-button",
    name: "Animated Slide-Up Button",
    category: "buttons",
    categoryLabel: "Buttons & CTAs",
    badge: "Micro-Interaction",
    badgeColor: "#FF5B04",
    description:
      "Interactive dual-label CTA button with smooth vertical translate animations on hover. Designed for conversion cards and primary service actions.",
    detailUrl: "/buttons/animated-slide-button",
    features: ["Dual text roll-up", "Smooth ease transition", "Primary & secondary styles", "Auto-contained overflow"],
    previewLight: (
      <div className="flex items-center justify-center p-12 gap-6 flex-wrap">
        <AnimatedButton primaryText="Explore Services" hoverText="See More →" variant="primary" />
        <AnimatedButton primaryText="Learn More" hoverText="Dive In →" variant="secondary" />
      </div>
    ),
    previewDark: (
      <div className="flex items-center justify-center p-12 gap-6 flex-wrap">
        <AnimatedButton primaryText="Explore Services" hoverText="See More →" variant="primary" />
        <AnimatedButton primaryText="Learn More" hoverText="Dive In →" variant="secondary" />
      </div>
    ),
    jsxCode: `import { AnimatedButton } from "@/components/AnimatedButton";

export default function Example() {
  return (
    <div className="flex gap-4">
      <AnimatedButton
        primaryText="Explore Services"
        hoverText="See More →"
        variant="primary"
      />
      <AnimatedButton
        primaryText="Learn More"
        hoverText="Dive In →"
        variant="secondary"
      />
    </div>
  );
}`,
    htmlCode: `<button class="animated-slide-button primary">
  <span class="slide-label primary">Explore Services</span>
  <span class="slide-label hover">See More &rarr;</span>
</button>`,
    cssCode: `/* Slide-Up Text Animation Tokens */
.slide-btn {
  overflow: hidden;
  position: relative;
}
.slide-btn .text-primary {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-btn:hover .text-primary {
  transform: translateY(-100%);
}
.slide-btn .text-hover {
  position: absolute;
  transform: translateY(100%);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-btn:hover .text-hover {
  transform: translateY(0);
}`,
    props: [
      { name: "primaryText", type: "string", defaultValue: '"Explore Services"', description: "Default visible text" },
      { name: "hoverText", type: "string", defaultValue: '"See More →"', description: "Text that slides in on hover" },
      { name: "variant", type: '"primary" | "secondary"', defaultValue: '"primary"', description: "Button style variant" },
      { name: "onClick", type: "() => void", defaultValue: "undefined", description: "Click callback handler" },
    ],
  },
  {
    id: "glass-badge",
    name: "Glassmorphic Badge",
    category: "badges",
    categoryLabel: "Badges & Indicators",
    badge: "Design Tokens",
    badgeColor: "#8B5CF6",
    description:
      "Frosted glass pill badge with multi-layer backdrop filter blur, subtle border sheen, and glowing typography for section headers and status chips.",
    features: ["Backdrop blur glass", "Cyan & gradient variants", "Specular top highlight", "Responsive typography"],
    previewLight: (
      <div className="flex flex-col items-center justify-center p-12 gap-6">
        <GlassBadge variant="gradient" size="md">PROPRIETARY COMPONENT</GlassBadge>
        <GlassBadge variant="cyan" size="sm">Production Ready</GlassBadge>
        <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Active Status Beacon</span>
        </div>
      </div>
    ),
    previewDark: (
      <div className="flex flex-col items-center justify-center p-12 gap-6">
        <GlassBadge variant="gradient" size="md">PROPRIETARY COMPONENT</GlassBadge>
        <GlassBadge variant="cyan" size="sm">Production Ready</GlassBadge>
        <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Active Status Beacon</span>
        </div>
      </div>
    ),
    jsxCode: `import GlassBadge from "@/components/GlassBadge";

export default function Example() {
  return (
    <div className="flex gap-4">
      <GlassBadge variant="gradient" size="md">PROPRIETARY</GlassBadge>
      <GlassBadge variant="cyan" size="sm">Production Ready</GlassBadge>
    </div>
  );
}`,
    htmlCode: `<div class="glass-badge gradient">
  <span class="dot dot-1"></span>
  <span class="dot dot-2"></span>
  <span class="dot dot-3"></span>
  <span class="badge-text">PROPRIETARY COMPONENT</span>
</div>`,
    cssCode: `/* Glass Badge Tokens */
.glass-badge {
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  background: rgba(255, 255, 255, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.95);
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.12);
  border-radius: 999px;
}`,
    props: [
      { name: "children", type: "React.ReactNode", defaultValue: "—", description: "Badge content/text" },
      { name: "variant", type: '"gradient" | "solid" | "cyan"', defaultValue: '"gradient"', description: "Visual style variant" },
      { name: "size", type: '"sm" | "md" | "lg"', defaultValue: '"md"', description: "Size preset" },
      { name: "uppercase", type: "boolean", defaultValue: "true", description: "Uppercase text transform" },
    ],
  },
  {
    id: "glass-surface",
    name: "Glass Surface Container",
    category: "surfaces",
    categoryLabel: "Surfaces & Glass",
    badge: "Multi-layered",
    badgeColor: "#3B82F6",
    description:
      "Deep frosted glassmorphic card container with dynamic specular sheen, rounded corners, noise texture support, and ambient light reflection.",
    features: ["Gaussian blur backdrop", "Dynamic border sheen", "Hardware accelerated", "Accessible contrast"],
    previewLight: (
      <div className="flex items-center justify-center p-12">
        <GlassSurface width={300} height={170} borderRadius={24} blur={20} className="flex flex-col items-center justify-center p-6 text-center shadow-xl">
          <div className="text-sm font-mono font-bold text-gray-900">Glass Surface</div>
          <div className="text-xs text-gray-600 mt-1">Specular Sheen &amp; Blur</div>
          <div className="mt-4 flex gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500" />
            <div className="w-3 h-3 rounded-full bg-cyan-500" />
            <div className="w-3 h-3 rounded-full bg-purple-500" />
          </div>
        </GlassSurface>
      </div>
    ),
    previewDark: (
      <div className="flex items-center justify-center p-12">
        <GlassSurface width={300} height={170} borderRadius={24} blur={20} className="flex flex-col items-center justify-center p-6 text-center">
          <div className="text-sm font-mono font-bold text-white">Glass Surface</div>
          <div className="text-xs text-gray-300 mt-1">Specular Sheen &amp; Blur</div>
          <div className="mt-4 flex gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-400 opacity-80" />
            <div className="w-3 h-3 rounded-full bg-cyan-400 opacity-80" />
            <div className="w-3 h-3 rounded-full bg-purple-400 opacity-80" />
          </div>
        </GlassSurface>
      </div>
    ),
    jsxCode: `import GlassSurface from "@/components/GlassSurface";

export default function Example() {
  return (
    <GlassSurface
      width={300}
      height={170}
      borderRadius={24}
      blur={20}
      className="p-6"
    >
      <h3 className="font-bold">Glassmorphism Card</h3>
      <p className="text-sm text-gray-400">Card content here...</p>
    </GlassSurface>
  );
}`,
    htmlCode: `<div class="glass-surface-container">
  <div class="glass-ambient-filter"></div>
  <div class="glass-surface-content">
    <h3>Card Title</h3>
  </div>
</div>`,
    cssCode: `/* Glass Surface Tokens */
.glass-surface {
  backdrop-filter: blur(20px) saturate(180%) brightness(105%);
  -webkit-backdrop-filter: blur(20px) saturate(180%) brightness(105%);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 24px;
  will-change: transform;
}`,
    props: [
      { name: "width", type: "number | string", defaultValue: '"100%"', description: "Container width" },
      { name: "height", type: "number | string", defaultValue: '"auto"', description: "Container height" },
      { name: "borderRadius", type: "number", defaultValue: "24", description: "Border radius in pixels" },
      { name: "blur", type: "number", defaultValue: "20", description: "Backdrop blur intensity" },
      { name: "backgroundOpacity", type: "number", defaultValue: "0.1", description: "Background opacity (0–1)" },
      { name: "className", type: "string", defaultValue: '""', description: "Additional CSS classes" },
    ],
  },
  {
    id: "hash-gradient-avatar",
    name: "Hash Dynamic Gradient Avatar",
    category: "badges",
    categoryLabel: "Badges & Indicators",
    badge: "Algorithmic",
    badgeColor: "#F59E0B",
    description:
      "Deterministic gradient avatar component that computes consistent, harmonious vibrant palettes based on username strings with fallback typography.",
    features: ["Deterministic hash color", "Image + fallback initial", "Customizable size scale", "Subtle border ring"],
    previewLight: (
      <div className="flex items-center justify-center p-12 gap-6 flex-wrap">
        <Avatar name="Vishal Anand" size={64} />
        <Avatar name="Danish Khan" size={48} />
        <Avatar name="UI Pirate" size={40} />
        <Avatar name="React Dev" size={32} />
      </div>
    ),
    previewDark: (
      <div className="flex items-center justify-center p-12 gap-6 flex-wrap">
        <Avatar name="Vishal Anand" size={64} />
        <Avatar name="Danish Khan" size={48} />
        <Avatar name="UI Pirate" size={40} />
        <Avatar name="React Dev" size={32} />
      </div>
    ),
    jsxCode: `import Avatar from "@/components/Avatar";

export default function Example() {
  return (
    <div className="flex gap-3 items-center">
      <Avatar name="Vishal Anand" size={64} />
      <Avatar name="Danish Khan" size={48} />
      <Avatar name="UI Pirate" size={40} />
    </div>
  );
}`,
    htmlCode: `<div class="avatar-group">
  <div class="avatar-circle size-64" style="background: linear-gradient(...)">VA</div>
  <div class="avatar-circle size-48" style="background: linear-gradient(...)">DK</div>
</div>`,
    cssCode: `/* Deterministic Hash Avatar Tokens */
.avatar-ring {
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  overflow: hidden;
}
.avatar-initials {
  font-weight: 700;
  font-size: calc(var(--size) * 0.38px);
  color: white;
  text-shadow: 0 1px 3px rgba(0,0,0,0.3);
}`,
    props: [
      { name: "name", type: "string", defaultValue: "—", description: "User name for hash-based gradient" },
      { name: "size", type: "number", defaultValue: "48", description: "Avatar diameter in pixels" },
      { name: "src", type: "string", defaultValue: "undefined", description: "Optional image URL (falls back to initials)" },
      { name: "className", type: "string", defaultValue: '""', description: "Additional CSS classes" },
    ],
  },
  {
    id: "pulse-cta-button",
    name: "Magnetic Pulsing CTA",
    category: "buttons",
    categoryLabel: "Buttons & CTAs",
    badge: "Audio + Haptic",
    badgeColor: "#FF5B04",
    description:
      "High-energy glowing action button with ambient radiant pulse effect, click audio trigger hook, and 3D depth press feedback.",
    detailUrl: "/buttons/magnetic-pulse-cta",
    features: ["Ambient ring pulse", "Sound effects integration", "Tactile spring scale", "Lead modal trigger"],
    previewLight: (
      <div className="flex items-center justify-center p-16">
        <MagneticPulseCTA label="Let's Venture" pulseColor="#FF5B04" />
      </div>
    ),
    previewDark: (
      <div className="flex items-center justify-center p-16">
        <MagneticPulseCTA label="Let's Venture" pulseColor="#FF5B04" />
      </div>
    ),
    jsxCode: `import { MagneticPulseCTA } from "@/components/MagneticPulseCTA";

export default function Example() {
  return (
    <MagneticPulseCTA
      label="Let's Venture"
      pulseColor="#FF5B04"
      onClick={() => console.log("Clicked!")}
    />
  );
}`,
    htmlCode: `<div class="magnetic-pulse-container">
  <div class="pulse-radiant-glow"></div>
  <button class="pulse-button">
    <span>Let's Venture</span>
    <span class="ping-dot"></span>
  </button>
</div>`,
    cssCode: `/* Magnetic Pulse Tokens */
.pulse-outer {
  animation: magnetic-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes magnetic-pulse {
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.25); }
}
.pulse-btn {
  transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.pulse-btn:hover { transform: scale(1.05); }
.pulse-btn:active { transform: scale(0.95); }`,
    props: [
      { name: "label", type: "string", defaultValue: '"Let\'s Venture"', description: "Button label text" },
      { name: "pulseColor", type: "string", defaultValue: '"#FF5B04"', description: "Hex color for the pulse glow" },
      { name: "onClick", type: "() => void", defaultValue: "undefined", description: "Click callback handler" },
      { name: "className", type: "string", defaultValue: '""', description: "Additional CSS classes" },
    ],
  },
];

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const SunIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const CopyIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const MenuIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ─── Main Screen: Permanent Docs Library Layout ────────────────────────────────

export default function UIComponentsScreen() {
  const [selectedComponentId, setSelectedComponentId] = useState<string>("tactile-pill-button");
  const [sidebarSearch, setSidebarSearch] = useState("");
  const [pageTheme, setPageTheme] = useState<"dark" | "light">("dark");
  const [canvasTheme, setCanvasTheme] = useState<"dark" | "light">("dark");
  const [activeCodeTab, setActiveCodeTab] = useState<"jsx" | "html" | "css">("jsx");
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const selectedComponent = useMemo(
    () => ALL_COMPONENTS.find((c) => c.id === selectedComponentId) ?? ALL_COMPONENTS[0],
    [selectedComponentId]
  );

  const currentIndex = useMemo(
    () => ALL_COMPONENTS.findIndex((c) => c.id === selectedComponent.id),
    [selectedComponent.id]
  );

  const prevComponent = currentIndex > 0 ? ALL_COMPONENTS[currentIndex - 1] : null;
  const nextComponent = currentIndex < ALL_COMPONENTS.length - 1 ? ALL_COMPONENTS[currentIndex + 1] : null;

  const sidebarFilteredComponents = useMemo(() => {
    if (!sidebarSearch.trim()) return ALL_COMPONENTS;
    const q = sidebarSearch.toLowerCase();
    return ALL_COMPONENTS.filter(
      (c) => c.name.toLowerCase().includes(q) || c.categoryLabel.toLowerCase().includes(q) || c.badge?.toLowerCase().includes(q)
    );
  }, [sidebarSearch]);

  // Group sidebar by category
  const groupedSidebar = useMemo(() => {
    const map: Record<string, ComponentDetail[]> = {
      "Buttons & CTAs": [],
      "Controls & Sliders": [],
      "Badges & Indicators": [],
      "Surfaces & Glass": [],
    };
    sidebarFilteredComponents.forEach((c) => {
      if (!map[c.categoryLabel]) map[c.categoryLabel] = [];
      map[c.categoryLabel].push(c);
    });
    return map;
  }, [sidebarFilteredComponents]);

  const handleCopy = useCallback((text: string, tab: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTab(tab);
    setTimeout(() => setCopiedTab(null), 2500);
  }, []);

  const activeCode =
    activeCodeTab === "jsx"
      ? selectedComponent.jsxCode
      : activeCodeTab === "html"
      ? selectedComponent.htmlCode
      : selectedComponent.cssCode;

  // Keyboard navigation between components
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "j" || e.key === "ArrowDown") {
        if (nextComponent) setSelectedComponentId(nextComponent.id);
      } else if (e.key === "k" || e.key === "ArrowUp") {
        if (prevComponent) setSelectedComponentId(prevComponent.id);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [nextComponent, prevComponent]);

  const centerScrollRef = React.useRef<HTMLDivElement>(null);

  // Scroll center panel to top when switching component
  const handleSelectComponent = useCallback((id: string) => {
    setSelectedComponentId(id);
    setMobileSidebarOpen(false);
    centerScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const isLightPage = pageTheme === "light";

  return (
    <PageWrapper showFloatingButton={false}>
      <div
        className={`h-screen w-screen overflow-hidden flex flex-col font-sans transition-colors duration-300 ${
          isLightPage
            ? "bg-[#F8F9FA] text-gray-900 selection:bg-[#FF5B04] selection:text-white"
            : "bg-[#0A0A0C] text-gray-100 selection:bg-[#FF5B04] selection:text-white"
        }`}
      >
        {/* ── Fixed Documentation Top Bar (Controls Full Page Theme) ────────────────────────── */}
        <header
          className={`h-14 shrink-0 border-b px-4 sm:px-6 flex items-center justify-between gap-4 z-30 transition-colors duration-300 ${
            isLightPage
              ? "bg-white/95 border-gray-200 shadow-sm"
              : "bg-[#0D0D11]/95 border-white/8 backdrop-blur-xl"
          }`}
        >
          {/* Left Brand + Logo + Mobile Drawer Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className={`lg:hidden p-1.5 rounded-lg border transition-colors ${
                isLightPage
                  ? "bg-gray-100 border-gray-200 text-gray-700 hover:text-gray-900"
                  : "bg-white/5 border-white/10 text-gray-300 hover:text-white"
              }`}
              aria-label="Toggle Navigation"
            >
              {mobileSidebarOpen ? <CloseIcon /> : <MenuIcon />}
            </button>

            <Link href="/" className="flex items-center gap-2.5 group">
              <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF5B04] to-orange-600 flex items-center justify-center text-white font-extrabold text-xs shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                UI
              </span>
              <span className={`font-bold text-sm tracking-tight font-jakarta ${isLightPage ? "text-gray-950" : "text-white"}`}>
                UI Pirate
              </span>
              <span className="text-gray-400 text-xs">/</span>
              <span className={`text-xs font-mono hidden sm:inline ${isLightPage ? "text-gray-600" : "text-gray-300"}`}>
                Component Lab
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full border hidden md:inline ${
                  isLightPage
                    ? "bg-gray-100 text-gray-600 border-gray-200"
                    : "bg-white/5 text-gray-400 border-white/10"
                }`}
              >
                v1.4.0
              </span>
            </Link>
          </div>

          {/* Quick Search Shortcut Input in Top Bar */}
          <div className="relative flex-1 max-w-md hidden md:block">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <SearchIcon />
            </span>
            <input
              type="text"
              placeholder="Search components, props, tokens... (Press ↑/↓ to navigate)"
              value={sidebarSearch}
              onChange={(e) => setSidebarSearch(e.target.value)}
              className={`w-full rounded-xl pl-9 pr-12 py-1.5 text-xs transition-colors focus:outline-none focus:border-[#FF5B04] ${
                isLightPage
                  ? "bg-gray-100 border border-gray-200 text-gray-900 placeholder-gray-400"
                  : "bg-white/5 border border-white/10 text-white placeholder-gray-500"
              }`}
            />
            <span
              className={`absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono border px-1.5 py-0.5 rounded ${
                isLightPage
                  ? "text-gray-500 border-gray-200 bg-white"
                  : "text-gray-500 border-white/10 bg-black/40"
              }`}
            >
              ⌘K
            </span>
          </div>

          {/* Right Quick Actions */}
          <div className="flex items-center gap-2.5">
            {/* FULL PAGE Theme Switcher */}
            <div
              className={`flex items-center gap-1 p-0.5 rounded-xl border ${
                isLightPage ? "bg-gray-100 border-gray-200" : "bg-black/50 border-white/10"
              }`}
            >
              <button
                onClick={() => setPageTheme("light")}
                title="Switch entire page to Light Theme"
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  isLightPage
                    ? "bg-white text-gray-900 shadow font-semibold"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <SunIcon />
                <span className="hidden sm:inline">Light</span>
              </button>
              <button
                onClick={() => setPageTheme("dark")}
                title="Switch entire page to Dark Theme"
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  !isLightPage
                    ? "bg-[#1E1E28] text-white shadow border border-white/10 font-semibold"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <MoonIcon />
                <span className="hidden sm:inline">Dark</span>
              </button>
            </div>

            {selectedComponent.detailUrl && (
              <Link
                href={selectedComponent.detailUrl}
                className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-[#FF5B04] hover:text-orange-500 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20 transition-colors"
              >
                <span>Full Studio</span>
                <ExternalLinkIcon />
              </Link>
            )}

            <Link
              href="/"
              className={`text-xs font-mono px-2.5 py-1.5 rounded-xl transition-colors hidden lg:inline-flex items-center gap-1 ${
                isLightPage
                  ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>Back to Home</span>
            </Link>
          </div>
        </header>

        {/* ── Fixed Body: Fixed Left Menu + Scrollable Center + Fixed Right TOC ──────── */}
        <div className="flex-1 flex overflow-hidden w-full min-h-0">
          
          {/* ── Left Sidebar (Always Sticky / Fixed in Position) ─────────────────────────── */}
          <aside
            data-lenis-prevent="true"
            className={`
              fixed lg:static top-14 left-0 z-40
              h-[calc(100vh-3.5rem)]
              w-64 xl:w-72 shrink-0
              border-r
              flex flex-col
              min-h-0
              transition-all duration-300 ease-in-out
              ${isLightPage ? "bg-[#F4F5F7] border-gray-200" : "bg-[#0D0D11] border-white/8"}
              ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}
          >
            {/* Mobile Sidebar Close Button */}
            <div
              className={`p-3.5 border-b flex items-center justify-between lg:hidden ${
                isLightPage ? "bg-white border-gray-200" : "bg-[#121216] border-white/8"
              }`}
            >
              <span className={`text-xs font-bold uppercase tracking-wider ${isLightPage ? "text-gray-900" : "text-white"}`}>
                Components Menu
              </span>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className={`p-1 ${isLightPage ? "text-gray-500 hover:text-gray-900" : "text-gray-400 hover:text-white"}`}
              >
                <CloseIcon />
              </button>
            </div>

            {/* Sidebar Search Input (Visible on mobile/tablet) */}
            <div className={`p-3 border-b md:hidden ${isLightPage ? "border-gray-200" : "border-white/8"}`}>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <SearchIcon />
                </span>
                <input
                  type="text"
                  placeholder="Filter components..."
                  value={sidebarSearch}
                  onChange={(e) => setSidebarSearch(e.target.value)}
                  className={`w-full rounded-xl pl-9 pr-3 py-1.5 text-xs ${
                    isLightPage
                      ? "bg-white border border-gray-200 text-gray-900 placeholder-gray-400"
                      : "bg-white/5 border border-white/10 text-white placeholder-gray-500"
                  }`}
                />
              </div>
            </div>

            {/* Navigation Groups (Scrollable inside sidebar) */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-5 scrollbar-thin">
              {Object.entries(groupedSidebar).map(([groupTitle, items]) => {
                if (items.length === 0) return null;
                return (
                  <div key={groupTitle} className="space-y-1">
                    <div
                      className={`px-2 text-[10px] font-mono font-bold uppercase tracking-widest flex items-center justify-between ${
                        isLightPage ? "text-gray-500" : "text-gray-500"
                      }`}
                    >
                      <span>{groupTitle}</span>
                      <span className="text-[9px] text-gray-400 font-mono">{items.length}</span>
                    </div>

                    <div className="space-y-0.5 pt-0.5">
                      {items.map((item) => {
                        const isSelected = item.id === selectedComponent.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleSelectComponent(item.id)}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between group ${
                              isSelected
                                ? "bg-[#FF5B04] text-white shadow-md shadow-[#FF5B04]/25 font-bold"
                                : isLightPage
                                ? "text-gray-600 hover:text-gray-950 hover:bg-white"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 truncate">
                              <span
                                className="w-1.5 h-1.5 rounded-full shrink-0 transition-transform group-hover:scale-125"
                                style={{
                                  backgroundColor: isSelected ? "#FFFFFF" : item.badgeColor || "#FF5B04",
                                }}
                              />
                              <span className="truncate">{item.name}</span>
                            </div>

                            {item.badge && !isSelected && (
                              <span
                                className={`text-[9px] font-mono px-1.5 py-0.5 rounded border shrink-0 hidden sm:inline-block ${
                                  isLightPage
                                    ? "bg-white text-gray-500 border-gray-200"
                                    : "bg-white/5 text-gray-400 border-white/5"
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sidebar Bottom Status */}
            <div
              className={`p-3.5 border-t text-[11px] flex items-center justify-between ${
                isLightPage
                  ? "bg-white/60 border-gray-200 text-gray-500"
                  : "bg-black/30 border-white/8 text-gray-400"
              }`}
            >
              <span>Tailwind + Framer</span>
              <span className="text-[#00E5BE] font-mono font-bold">100% Ready</span>
            </div>
          </aside>

          {/* Overlay for mobile sidebar */}
          {mobileSidebarOpen && (
            <div
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
            />
          )}

          {/* ── Main Detail Content Area (THE ONLY SCROLLABLE AREA) ──────────────────────────────── */}
          <main
            ref={centerScrollRef}
            data-lenis-prevent="true"
            className="flex-1 h-[calc(100vh-3.5rem)] overflow-y-auto min-w-0 min-h-0 p-6 sm:p-10 lg:p-12 space-y-12 scroll-smooth overscroll-contain scrollbar-thin"
          >
            <div className="max-w-4xl mx-auto space-y-12 pb-16">
              
              {/* Breadcrumb Navigation */}
              <nav
                className={`flex items-center gap-2 text-xs font-mono ${
                  isLightPage ? "text-gray-400" : "text-gray-500"
                }`}
              >
                <Link href="/" className={`transition-colors ${isLightPage ? "hover:text-gray-800" : "hover:text-gray-300"}`}>
                  UI Pirate
                </Link>
                <span>/</span>
                <span className={isLightPage ? "text-gray-600" : "text-gray-400"}>Component Lab</span>
                <span>/</span>
                <span className={isLightPage ? "text-gray-600" : "text-gray-400"}>{selectedComponent.categoryLabel}</span>
                <span>/</span>
                <span className="text-[#FF5B04] font-semibold">{selectedComponent.name}</span>
              </nav>

              {/* Header: Title & Badges */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h1
                    className={`text-3xl sm:text-4xl font-extrabold tracking-tight font-jakarta ${
                      isLightPage ? "text-gray-950" : "text-white"
                    }`}
                  >
                    {selectedComponent.name}
                  </h1>
                  {selectedComponent.badge && (
                    <span
                      className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg border uppercase tracking-wider"
                      style={{
                        color: selectedComponent.badgeColor || "#FF5B04",
                        backgroundColor: `${selectedComponent.badgeColor || "#FF5B04"}15`,
                        borderColor: `${selectedComponent.badgeColor || "#FF5B04"}35`,
                      }}
                    >
                      {selectedComponent.badge}
                    </span>
                  )}
                </div>

                <p className={`text-sm sm:text-base leading-relaxed ${isLightPage ? "text-gray-600" : "text-gray-300"}`}>
                  {selectedComponent.description}
                </p>
              </div>

              {/* ── 1. Live Interactive Preview Canvas (Separate Inner Theme Mode) ─────────────────── */}
              <section id="preview" className="space-y-3 scroll-mt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FF5B04] animate-pulse" />
                    <h2 className={`text-base font-bold font-jakarta ${isLightPage ? "text-gray-950" : "text-white"}`}>
                      Interactive Live Studio
                    </h2>
                  </div>

                  <span className={`text-xs font-mono ${isLightPage ? "text-gray-500" : "text-gray-500"}`}>
                    Studio Canvas: <strong className={`capitalize ${isLightPage ? "text-gray-900" : "text-white"}`}>{canvasTheme}</strong>
                  </span>
                </div>

                <div
                  className={`rounded-3xl overflow-hidden border shadow-2xl transition-all ${
                    isLightPage ? "border-gray-200 bg-white" : "border-white/10 bg-[#121216]"
                  }`}
                >
                  {/* Canvas Toolbar */}
                  <div
                    className={`flex items-center justify-between px-6 py-3 border-b ${
                      isLightPage ? "bg-gray-50 border-gray-200" : "bg-[#131318] border-white/8"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-red-500/70 inline-block" />
                      <span className="w-3 h-3 rounded-full bg-yellow-500/70 inline-block" />
                      <span className="w-3 h-3 rounded-full bg-green-500/70 inline-block" />
                      <span className={`text-xs font-mono ml-2 ${isLightPage ? "text-gray-600" : "text-gray-400"}`}>
                        studio-preview.tsx
                      </span>
                    </div>

                    {/* INNER Component Studio Mode Switcher */}
                    <div
                      className={`flex items-center gap-1 p-0.5 rounded-xl border ${
                        isLightPage ? "bg-white border-gray-200 shadow-sm" : "bg-black/40 border-white/10"
                      }`}
                    >
                      <button
                        onClick={() => setCanvasTheme("light")}
                        title="Render button in Light Canvas Studio"
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          canvasTheme === "light"
                            ? isLightPage
                              ? "bg-gray-900 text-white font-bold shadow"
                              : "bg-white text-gray-900 font-bold shadow"
                            : isLightPage
                            ? "text-gray-500 hover:text-gray-900"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        <SunIcon />
                        <span>Light Canvas</span>
                      </button>
                      <button
                        onClick={() => setCanvasTheme("dark")}
                        title="Render button in Dark Canvas Studio"
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          canvasTheme === "dark"
                            ? isLightPage
                              ? "bg-gray-900 text-white font-bold shadow"
                              : "bg-[#1E1E28] text-white font-bold shadow border border-white/10"
                            : isLightPage
                            ? "text-gray-500 hover:text-gray-900"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        <MoonIcon />
                        <span>Dark Canvas</span>
                      </button>
                    </div>
                  </div>

                  {/* Canvas Container */}
                  <div
                    className={`relative min-h-[300px] sm:min-h-[360px] flex items-center justify-center overflow-hidden transition-all duration-300 ${
                      canvasTheme === "light"
                        ? "bg-gradient-to-br from-[#FFFFFF] via-[#F4F5F7] to-[#E9ECEF]"
                        : "bg-[#0C0C10]"
                    }`}
                  >
                    {/* Subtle Grid Background */}
                    {canvasTheme === "dark" ? (
                      <div
                        className="absolute inset-0 opacity-[0.05]"
                        style={{
                          backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                          backgroundSize: "28px 28px",
                        }}
                      />
                    ) : (
                      <div
                        className="absolute inset-0 opacity-[0.45]"
                        style={{
                          backgroundImage: "radial-gradient(circle, #B0B5BA 1px, transparent 1px)",
                          backgroundSize: "24px 24px",
                        }}
                      />
                    )}

                    <div className="relative z-10 w-full">
                      {canvasTheme === "light" ? selectedComponent.previewLight : selectedComponent.previewDark}
                    </div>
                  </div>
                </div>
              </section>

              {/* ── 2. Key Features & Highlights ────────────────────────── */}
              <section id="features" className="space-y-4 scroll-mt-6">
                <h2 className={`text-lg font-bold font-jakarta ${isLightPage ? "text-gray-950" : "text-white"}`}>
                  Features &amp; Physics
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {selectedComponent.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border flex items-center gap-3 transition-colors ${
                        isLightPage ? "bg-white border-gray-200 shadow-sm text-gray-800" : "bg-[#121216] border-white/8 text-gray-200"
                      }`}
                    >
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#00E5BE]/15 text-[#00BFA0] font-bold text-xs shrink-0">
                        ✓
                      </span>
                      <span className="text-xs sm:text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* ── 3. Code Snippets & Drop-in Integration ─────────────── */}
              <section id="code" className="space-y-4 scroll-mt-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className={`text-lg font-bold font-jakarta ${isLightPage ? "text-gray-950" : "text-white"}`}>
                      Code &amp; Integration
                    </h2>
                    <p className={`text-xs mt-0.5 ${isLightPage ? "text-gray-500" : "text-gray-400"}`}>
                      Copy paste the code directly into your React / Next.js app.
                    </p>
                  </div>

                  <button
                    onClick={() => handleCopy(activeCode, activeCodeTab)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-[#FF5B04] border border-orange-500/30 text-xs font-mono font-bold transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    {copiedTab === activeCodeTab ? <CheckIcon /> : <CopyIcon />}
                    <span>{copiedTab === activeCodeTab ? "Copied to Clipboard!" : "Copy Code"}</span>
                  </button>
                </div>

                <div
                  className={`border rounded-3xl overflow-hidden shadow-2xl ${
                    isLightPage ? "bg-[#1E1E28] border-gray-200" : "bg-[#0E0E12] border-white/10"
                  }`}
                >
                  {/* Code Tabs Header */}
                  <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-[#14141E]">
                    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/5 text-xs font-mono">
                      <button
                        onClick={() => setActiveCodeTab("jsx")}
                        className={`px-3.5 py-1.5 rounded-lg transition-all ${
                          activeCodeTab === "jsx"
                            ? "bg-[#FF5B04] text-white font-bold shadow"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        JSX / React
                      </button>
                      <button
                        onClick={() => setActiveCodeTab("html")}
                        className={`px-3.5 py-1.5 rounded-lg transition-all ${
                          activeCodeTab === "html"
                            ? "bg-[#FF5B04] text-white font-bold shadow"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        HTML
                      </button>
                      <button
                        onClick={() => setActiveCodeTab("css")}
                        className={`px-3.5 py-1.5 rounded-lg transition-all ${
                          activeCodeTab === "css"
                            ? "bg-[#FF5B04] text-white font-bold shadow"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        Tokens.css
                      </button>
                    </div>

                    <span className="text-xs font-mono text-gray-400 hidden sm:inline-block">
                      {activeCodeTab === "jsx" ? "React 18 / 19" : activeCodeTab === "html" ? "Semantic HTML" : "Tailwind / CSS Tokens"}
                    </span>
                  </div>

                  {/* Code Block */}
                  <div className="p-6 overflow-x-auto max-h-[460px] overflow-y-auto">
                    <pre className="text-xs sm:text-sm font-mono text-gray-300 leading-relaxed whitespace-pre">
                      <code>{activeCode}</code>
                    </pre>
                  </div>
                </div>
              </section>

              {/* ── 4. Peer Dependencies & Installation ────────────────── */}
              <section
                className={`border rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl transition-colors ${
                  isLightPage ? "bg-white border-gray-200 text-gray-900" : "bg-[#121216] border-white/10 text-white"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className={`text-base font-bold font-jakarta ${isLightPage ? "text-gray-950" : "text-white"}`}>
                      Peer Dependencies
                    </h3>
                    <p className={`text-xs mt-1 ${isLightPage ? "text-gray-500" : "text-gray-400"}`}>
                      Requires Framer Motion and Tailwind CSS for spring physics and layout tokens:
                    </p>
                  </div>

                  <button
                    onClick={() => handleCopy("npm install framer-motion clsx lucide-react tailwind-merge", "install")}
                    className="px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-500 border border-emerald-500/30 text-xs font-mono font-semibold transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    {copiedTab === "install" ? "✓ Copied Command!" : "Copy Install Command"}
                  </button>
                </div>

                <div
                  className={`border rounded-2xl px-5 py-3.5 font-mono text-xs overflow-x-auto ${
                    isLightPage ? "bg-gray-50 border-gray-200 text-emerald-600 font-semibold" : "bg-black/50 border-white/10 text-emerald-400"
                  }`}
                >
                  <code>npm install framer-motion clsx lucide-react tailwind-merge</code>
                </div>
              </section>

              {/* ── 5. Component Props & API Reference ─────────────────── */}
              {selectedComponent.props.length > 0 && (
                <section id="api" className="space-y-4 scroll-mt-6">
                  <h2 className={`text-lg font-bold font-jakarta ${isLightPage ? "text-gray-950" : "text-white"}`}>
                    API &amp; Props Reference
                  </h2>
                  <div
                    className={`border rounded-3xl overflow-hidden shadow-xl transition-colors ${
                      isLightPage ? "bg-white border-gray-200" : "bg-[#121216] border-white/10"
                    }`}
                  >
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs sm:text-sm">
                        <thead>
                          <tr
                            className={`border-b font-mono ${
                              isLightPage ? "bg-gray-50 border-gray-200 text-gray-600" : "bg-white/[0.02] border-white/10 text-gray-400"
                            }`}
                          >
                            <th className="py-3.5 px-6 font-semibold">Prop</th>
                            <th className="py-3.5 px-6 font-semibold">Type</th>
                            <th className="py-3.5 px-6 font-semibold">Default</th>
                            <th className="py-3.5 px-6 font-semibold">Description</th>
                          </tr>
                        </thead>
                        <tbody
                          className={`divide-y font-mono text-xs ${
                            isLightPage ? "divide-gray-200 text-gray-800" : "divide-white/5 text-gray-300"
                          }`}
                        >
                          {selectedComponent.props.map((prop) => (
                            <tr
                              key={prop.name}
                              className={`transition-colors ${isLightPage ? "hover:bg-gray-50" : "hover:bg-white/[0.02]"}`}
                            >
                              <td className="py-3.5 px-6 text-[#FF5B04] font-semibold">{prop.name}</td>
                              <td className={`py-3.5 px-6 text-[11px] ${isLightPage ? "text-blue-600 font-semibold" : "text-blue-300"}`}>
                                {prop.type}
                              </td>
                              <td className={`py-3.5 px-6 ${isLightPage ? "text-gray-600" : "text-gray-400"}`}>
                                {prop.defaultValue}
                              </td>
                              <td className={`py-3.5 px-6 font-sans text-xs ${isLightPage ? "text-gray-700" : "text-gray-300"}`}>
                                {prop.description}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>
              )}

              {/* ── 6. Next & Previous Component Navigation ────────────── */}
              <div className={`pt-8 border-t grid grid-cols-1 sm:grid-cols-2 gap-4 ${isLightPage ? "border-gray-200" : "border-white/10"}`}>
                {prevComponent ? (
                  <button
                    onClick={() => handleSelectComponent(prevComponent.id)}
                    className={`p-5 rounded-2xl border text-left transition-all group ${
                      isLightPage
                        ? "bg-white border-gray-200 hover:border-gray-300 shadow-sm"
                        : "bg-[#121216] border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="text-[11px] font-mono text-gray-400 group-hover:text-[#FF5B04] transition-colors">
                      ← Previous Component
                    </div>
                    <div className={`text-sm font-bold mt-1 font-jakarta ${isLightPage ? "text-gray-900" : "text-white"}`}>
                      {prevComponent.name}
                    </div>
                  </button>
                ) : (
                  <div />
                )}

                {nextComponent && (
                  <button
                    onClick={() => handleSelectComponent(nextComponent.id)}
                    className={`p-5 rounded-2xl border text-right transition-all group sm:col-start-2 ${
                      isLightPage
                        ? "bg-white border-gray-200 hover:border-gray-300 shadow-sm"
                        : "bg-[#121216] border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="text-[11px] font-mono text-gray-400 group-hover:text-[#FF5B04] transition-colors">
                      Next Component →
                    </div>
                    <div className={`text-sm font-bold mt-1 font-jakarta ${isLightPage ? "text-gray-900" : "text-white"}`}>
                      {nextComponent.name}
                    </div>
                  </button>
                )}
              </div>

            </div>
          </main>

          {/* ── Right Table of Contents (Sticky On This Page) ──────────────── */}
          <aside
            data-lenis-prevent="true"
            className={`hidden xl:block w-56 shrink-0 h-[calc(100vh-3.5rem)] overflow-y-auto min-h-0 p-6 border-l text-xs font-mono space-y-4 transition-colors ${
              isLightPage ? "border-gray-200 text-gray-500 bg-[#F8F9FA]" : "border-white/8 text-gray-500 bg-[#0A0A0C]"
            }`}
          >
            <div className={`text-[11px] font-bold uppercase tracking-wider ${isLightPage ? "text-gray-700" : "text-gray-400"}`}>
              On this page
            </div>
            <ul className={`space-y-2.5 ${isLightPage ? "text-gray-600" : "text-gray-500"}`}>
              <li>
                <a
                  href="#preview"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("preview")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`block transition-colors ${isLightPage ? "hover:text-gray-950" : "hover:text-white"}`}
                >
                  • Live Studio
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`block transition-colors ${isLightPage ? "hover:text-gray-950" : "hover:text-white"}`}
                >
                  • Features &amp; Physics
                </a>
              </li>
              <li>
                <a
                  href="#code"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("code")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`block transition-colors ${isLightPage ? "hover:text-gray-950" : "hover:text-white"}`}
                >
                  • Code &amp; Integration
                </a>
              </li>
              <li>
                <a
                  href="#api"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("api")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`block transition-colors ${isLightPage ? "hover:text-gray-950" : "hover:text-white"}`}
                >
                  • API Reference
                </a>
              </li>
            </ul>
          </aside>

        </div>
      </div>
    </PageWrapper>
  );
}

