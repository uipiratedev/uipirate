"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import TactilePillButton from "@/components/TactilePillButton";
import ScalingCapsuleButton from "@/components/ScalingCapsuleButton";
import SmashTactileButton from "@/components/SmashTactileButton";
import { AnimatedButton } from "@/components/AnimatedButton";
import { NeumorphicGlowCTA } from "@/components/NeumorphicGlowCTA";
import { VintageLeatherCTA } from "@/components/VintageLeatherCTA";
import { SlideGrowButton } from "@/components/SlideGrowButton";
import { LedMatrixChevronButton } from "@/components/LedMatrixChevronButton";
import { ElevatedUnderglowCTA } from "@/components/ElevatedUnderglowCTA";
import { IsometricReviveButton } from "@/components/IsometricReviveButton";
import { FrostedGelDownloadButton } from "@/components/FrostedGelDownloadButton";
import { ArcCornerToggle } from "@/components/ArcCornerToggle";

interface ButtonCatalogItem {
  id: string;
  name: string;
  badge: string;
  badgeColor: string;
  tech: string;
  description: string;
  href: string;
  features: string[];
}

const BUTTON_CATALOG: ButtonCatalogItem[] = [
  {
    id: "frosted-gel-download",
    name: "Frosted Gel Download Button",
    badge: "Glassmorphism",
    badgeColor: "#2626FF",
    tech: "React • Framer • Tailwind",
    description:
      "Dual-pill neumorphic split button with elevated ceramic pill, frosted glass cloud download tile, internal optical refraction rings, and volumetric blue underglow flare.",
    href: "/buttons/frosted-gel-download-button",
    features: ["Elevated ceramic pill", "Frosted glass cloud tile", "Volumetric blue underglow", "Interactive hover lift"],
  },
  {
    id: "isometric-revive",
    name: "Isometric 3D Revive Button",
    badge: "Isometric 3D",
    badgeColor: "#FFB020",
    tech: "Framer 3D • Tailwind",
    description:
      "Authentic 30° isometric 3D extruded button featuring dynamic spring depression, obsidian bevel walls, amber indicator flare, and blinding optical neon underglow.",
    href: "/buttons/isometric-revive-button",
    features: ["30° Isometric matrix", "Multi-layer 3D extrusion", "Optical neon underglow", "Dynamic spring physics"],
  },
  {
    id: "elevated-underglow",
    name: "Elevated Underglow 3D Button",
    badge: "3D Tactile Lift",
    badgeColor: "#0077FF",
    tech: "React • Framer Motion",
    description:
      "Interactive 3D tactile pill button that elevates 13px on hover to reveal a glowing electric blue extruded sub-chassis, bottom reflection rim, and realistic clay elevation physics.",
    href: "/buttons/elevated-underglow-cta",
    features: ["13px Spring lift", "Electric blue 3D underlayer", "Interactive states", "Phone call icon"],
  },
  {
    id: "led-matrix-chevron",
    name: "LED Dot Matrix Chevron Button",
    badge: "Cyberpunk Matrix",
    badgeColor: "#10B981",
    tech: "React • Tailwind • CSS Grid",
    description:
      "Cyberpunk carbon-fiber squircle button with an expandable 7×7 LED dot matrix screen that stretches across the entire chassis on hover/click revealing 5 cascading pixel chevrons.",
    href: "/buttons/led-matrix-chevron",
    features: ["Expandable LED screen", "7x7 Dot matrix chevrons", "Cascading marquee wave", "Carbon squircle chassis"],
  },
  {
    id: "slide-grow",
    name: "Swipe to Grow / Slide Button",
    badge: "Capsule Slider",
    badgeColor: "#468AFF",
    tech: "Framer Drag • Tailwind",
    description:
      "Interactive metallic capsule slider button with draggable glowing electric blue knob, illuminated neon channel fill, and dynamic masked text reveal.",
    href: "/buttons/slide-grow-button",
    features: ["Draggable knob physics", "Neon channel beam fill", "Masked text reveal", "Smooth slider snap"],
  },
  {
    id: "vintage-leather",
    name: "Vintage Leather & Brass Button",
    badge: "Heritage Leather",
    badgeColor: "#B4986C",
    tech: "Tailwind • SVG Noise",
    description:
      "Luxury embossed heritage leather & brass button with 6px bottom tactile bevel lip, recessed enclosure tray, and filigree scrollwork corner flourishes.",
    href: "/buttons/vintage-leather-cta",
    features: ["3D Tactile bevel lip", "Filigree corner ornaments", "Recessed enclosure tray", "5 Luxury themes"],
  },
  {
    id: "neumorphic-glow",
    name: "Neumorphic Glow CTA",
    badge: "Neumorphic / Clay",
    badgeColor: "#10B981",
    tech: "Tailwind • Shadow Stacks",
    description:
      "Authentic claymorphic and neumorphic elevated CTA button pair with glowing neon green badge depth, multi-tier elevation drop shadows, and plus-lighter bloom.",
    href: "/buttons/neumorphic-glow-cta",
    features: ["Pill & Squircle variants", "Neon green glow badge", "Multi-tier clay shadows", "Plus-lighter bloom"],
  },
  {
    id: "arc-corner-toggle",
    name: "Arc Corner Slider Toggle",
    badge: "Arc Slider Switch",
    badgeColor: "#ED45BE",
    tech: "React • SVG Arc Track",
    description:
      "Interactive corner arc slider toggle with light and dark mode states, rotating capsule knob along a 90° circular track, sunken sunburst dial, and glowing magenta laser beam.",
    href: "/buttons/arc-corner-toggle",
    features: ["90° Corner arc track", "Sunburst dial loader", "Light & Dark dual mode", "Laser beam flare"],
  },
  {
    id: "smash-button",
    name: "Tactile 'Smash' Button",
    badge: "Neo-Brutalist",
    badgeColor: "#C084FC",
    tech: "React • Tailwind",
    description:
      "Cyberpunk neo-brutalist tactile button with outer tech enclosure frame, porcelain cushion cooling tray, deep midnight obsidian slab, and glowing neon reactor underglow bloom.",
    href: "/buttons/smash-tactile-button",
    features: ["Tech enclosure frame", "Cushion cooling tray", "Obsidian core slab", "Reactor underglow"],
  },
  {
    id: "tactile-pill",
    name: "Tactile 3D Pill Button",
    badge: "3D Tactile Spring",
    badgeColor: "#54EAD8",
    tech: "Framer Motion • CSS",
    description:
      "Interactive 3D tactile button featuring spring tilt physics (-9.23° rotation), recessed cavity slot depth shadows, specular bevels, and glowing status beacon.",
    href: "/buttons/tactile-pill-button",
    features: ["Recessed tray depth", "Spring lift & tilt", "Status beacon", "5 Themes"],
  },
  {
    id: "scaling-capsule",
    name: "Scaling Capsule Tactile Button",
    badge: "Frosted Capsule",
    badgeColor: "#FF5B04",
    tech: "Tailwind • Multi-Shadow",
    description:
      "Pixel-perfect capsule button with frosted translucent glass cavity tray, multi-tier elevation drop shadows, specular bevel insets, and 26px black circle with ladder-rung apex emblem.",
    href: "/buttons/scaling-capsule-button",
    features: ["Frosted glass tray", "Multi-tier shadow stack", "26px Black circle", "Ladder-rung icon"],
  },
  {
    id: "animated-slide",
    name: "Animated Slide-Up Button",
    badge: "Micro-Interaction",
    badgeColor: "#8B5CF6",
    tech: "Pure CSS / Tailwind",
    description:
      "Dual-text roll CTA button that smoothly translates labels vertically on hover with overflow clipping. Optimized for high-conversion service cards.",
    href: "/buttons/animated-slide-button",
    features: ["Dual text roll", "Smooth translateY", "Primary & secondary styles", "Zero layout shift"],
  },
  {
    id: "magnetic-pulse",
    name: "Magnetic Pulsing CTA",
    badge: "Audio + Haptic",
    badgeColor: "#FF5B04",
    tech: "React • Web Audio",
    description:
      "High-energy lead capture CTA button featuring pulsing ambient radiant bloom, click sound trigger, and dynamic 3D depth press feedback.",
    href: "/buttons/magnetic-pulse-cta",
    features: ["Ambient radiant pulse", "Sound effects", "Spring depth press", "Lead modal trigger"],
  },
];

export default function ButtonHubScreen() {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#0E0E10] text-gray-100 selection:bg-[#FF5B04] selection:text-white pt-28 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient Lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[550px] bg-[#FF5B04]/10 rounded-full blur-[160px]" />
        <div className="absolute top-1/3 left-1/12 w-[450px] h-[450px] bg-[#00E5BE]/10 rounded-full blur-[140px]" />
        <div className="absolute top-2/3 right-1/12 w-[550px] h-[450px] bg-purple-600/10 rounded-full blur-[160px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-16">
        {/* Header section */}
        <div className="text-center space-y-5 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-300 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#FF5B04] animate-pulse" />
            <span>Interactive Button Library</span>
            <span className="text-gray-500">•</span>
            <span className="text-[#00E5BE]">13 Dedicated Component Studios</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-jakarta">
            Handcrafted <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5B04] via-orange-300 to-[#00E5BE]">Button Architecture</span>
          </h1>

          <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
            Each button component below features its own interactive studio page with full customization sandboxes, props reference, design tokens, and copy-ready React & Tailwind code.
          </p>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {BUTTON_CATALOG.map((btn) => (
            <div
              key={btn.id}
              className="bg-[#141417] border border-white/10 hover:border-white/20 rounded-3xl p-6 sm:p-8 flex flex-col justify-between gap-6 transition-all duration-300 hover:shadow-2xl hover:shadow-black/60 group"
            >
              {/* Header */}
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-mono font-medium border"
                    style={{
                      backgroundColor: `${btn.badgeColor}15`,
                      color: btn.badgeColor,
                      borderColor: `${btn.badgeColor}30`,
                    }}
                  >
                    {btn.badge}
                  </span>
                  <span className="text-[11px] font-mono text-gray-400 bg-white/[0.04] px-2.5 py-1 rounded-lg border border-white/5">
                    {btn.tech}
                  </span>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white group-hover:text-[#FF5B04] transition-colors font-jakarta">
                    {btn.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1.5 leading-relaxed">
                    {btn.description}
                  </p>
                </div>
              </div>

              {/* Live Preview Area */}
              <div className="bg-[#0B0B0D] rounded-2xl p-8 border border-white/5 flex items-center justify-center min-h-[180px] relative overflow-hidden">
                {btn.id === "frosted-gel-download" && (
                  <div className="scale-85 sm:scale-95 py-2">
                    <FrostedGelDownloadButton
                      label="Download now"
                      theme="figma-blue"
                      size="md"
                      stateMode="interactive"
                    />
                  </div>
                )}

                {btn.id === "isometric-revive" && (
                  <div className="scale-75 sm:scale-85 py-1">
                    <IsometricReviveButton
                      label="Revive Now"
                      theme="figma"
                      size="sm"
                      stateMode="interactive"
                      showGrid={false}
                    />
                  </div>
                )}

                {btn.id === "elevated-underglow" && (
                  <div className="scale-90 sm:scale-100 py-2">
                    <ElevatedUnderglowCTA
                      label="Book A Call"
                      icon="phone"
                      theme="figma"
                      size="md"
                      stateMode="interactive"
                    />
                  </div>
                )}

                {btn.id === "led-matrix-chevron" && (
                  <div className="scale-85 sm:scale-95">
                    <LedMatrixChevronButton
                      theme="monochrome"
                      size="md"
                      stateMode="interactive"
                    />
                  </div>
                )}

                {btn.id === "slide-grow" && (
                  <div className="scale-85 sm:scale-90">
                    <SlideGrowButton
                      theme="silver"
                      size="md"
                      stateMode="interactive"
                    />
                  </div>
                )}

                {btn.id === "vintage-leather" && (
                  <div className="scale-90 sm:scale-95">
                    <VintageLeatherCTA
                      theme="heritage"
                      size="md"
                      label="Shop ties"
                    />
                  </div>
                )}

                {btn.id === "neumorphic-glow" && (
                  <div className="flex items-center gap-4 scale-90 sm:scale-95">
                    <NeumorphicGlowCTA
                      variant="pill"
                      label="Learn more"
                    />
                  </div>
                )}

                {btn.id === "arc-corner-toggle" && (
                  <div className="scale-75 sm:scale-85 py-1">
                    <ArcCornerToggle scale={0.75} />
                  </div>
                )}

                {btn.id === "smash-button" && (
                  <div className="scale-90 sm:scale-95">
                    <SmashTactileButton
                      label="Smash the button"
                      variant="figma"
                      size="sm"
                    />
                  </div>
                )}

                {btn.id === "tactile-pill" && (
                  <div className="scale-110">
                    <TactilePillButton
                      label="Get Started"
                      dotColor="#54EAD8"
                      variant="default"
                      size="md"
                      tiltAngle={-9.23}
                    />
                  </div>
                )}

                {btn.id === "scaling-capsule" && (
                  <div className="scale-100">
                    <ScalingCapsuleButton
                      label="Scaling Workshop"
                      variant="dark"
                      size="md"
                    />
                  </div>
                )}

                {btn.id === "animated-slide" && (
                  <div className="w-full max-w-[240px]">
                    <AnimatedButton
                      primaryText="Explore Services"
                      hoverText="See More →"
                      variant="primary"
                      className="!mt-0"
                    />
                  </div>
                )}

                {btn.id === "magnetic-pulse" && (
                  <div className="relative group/pulse cursor-pointer">
                    <div className="absolute inset-0 rounded-full bg-[#FF5B04]/40 blur-xl animate-pulse" />
                    <button className="relative px-6 py-3 rounded-full bg-[#FF5B04] text-white font-bold text-sm shadow-[0_0_20px_rgba(255,91,4,0.5)] hover:scale-105 transition-transform">
                      Let&apos;s Venture ⚡
                    </button>
                  </div>
                )}
              </div>

              {/* Features List */}
              <div className="flex flex-wrap gap-1.5">
                {btn.features.map((f, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/5 text-[11px] font-mono text-gray-400"
                  >
                    ✓ {f}
                  </span>
                ))}
              </div>

              {/* Action Button Link to Dedicated Page */}
              <div className="pt-4 border-t border-white/10">
                <Link
                  href={btn.href}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-[#FF5B04] text-white text-xs sm:text-sm font-bold transition-all shadow-md group/link"
                >
                  <span>Open {btn.name} Page</span>
                  <svg
                    className="w-4 h-4 group-hover/link:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
