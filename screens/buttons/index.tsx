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

interface ButtonCatalogItem {
  id: string;
  name: string;
  badge: string;
  badgeColor: string;
  figmaNode?: string;
  description: string;
  href: string;
  features: string[];
}

const BUTTON_CATALOG: ButtonCatalogItem[] = [
  {
    id: "vintage-leather",
    name: "Vintage Leather & Brass Button",
    badge: "Figma Master",
    badgeColor: "#B4986C",
    figmaNode: "Node 14:304",
    description:
      "Luxury embossed heritage leather & brass button with 6px bottom tactile bevel lip, recessed enclosure tray, and filigree scrollwork corner flourishes.",
    href: "/buttons/vintage-leather-cta",
    features: ["3D Tactile bevel lip", "Filigree corner ornaments", "Recessed enclosure tray", "5 Luxury themes"],
  },
  {
    id: "neumorphic-glow",
    name: "Neumorphic Glow CTA",
    badge: "Figma Master",
    badgeColor: "#10B981",
    figmaNode: "Nodes 14:642 & 14:669",
    description:
      "Authentic claymorphic and neumorphic elevated CTA button pair with glowing neon green badge depth, multi-tier elevation drop shadows, and plus-lighter bloom.",
    href: "/buttons/neumorphic-glow-cta",
    features: ["Pill & Squircle variants", "Neon green glow badge", "Multi-tier clay shadows", "Plus-lighter bloom"],
  },
  {
    id: "arc-corner-toggle",
    name: "Arc Corner Slider Toggle",
    badge: "Figma Master",
    badgeColor: "#ED45BE",
    figmaNode: "Nodes 75:5084 & 75:5131",
    description:
      "Interactive corner arc slider toggle with STANDERD (light) and CLICK (dark) states, rotating capsule knob along a 90° circular track, sunken sunburst dial, and glowing magenta laser beam.",
    href: "/buttons/arc-corner-toggle",
    features: ["90° Corner arc track", "Sunburst dial loader", "STANDERD & CLICK states", "Laser beam flare"],
  },
  {
    id: "smash-button",
    name: "Tactile 'Smash' Button",
    badge: "Figma Master",
    badgeColor: "#C084FC",
    figmaNode: "Node 17:1480",
    description:
      "Cyberpunk neo-brutalist tactile button with outer tech enclosure frame, porcelain cushion cooling tray, deep midnight obsidian slab, and glowing neon reactor underglow bloom.",
    href: "/buttons/smash-tactile-button",
    features: ["Tech enclosure frame", "Cushion cooling tray", "Obsidian core slab", "Reactor underglow"],
  },
  {
    id: "tactile-pill",
    name: "Tactile 3D Pill Button",
    badge: "Figma Master",
    badgeColor: "#54EAD8",
    figmaNode: "Nodes 75:1201 & 75:1206",
    description:
      "Interactive 3D tactile button featuring spring tilt physics (-9.23° rotation), recessed cavity slot depth shadows, specular bevels, and glowing status beacon.",
    href: "/buttons/tactile-pill-button",
    features: ["Recessed tray depth", "Spring lift & tilt", "Status beacon", "5 Themes"],
  },
  {
    id: "scaling-capsule",
    name: "Scaling Capsule Tactile Button",
    badge: "Figma Master",
    badgeColor: "#FF5B04",
    figmaNode: "Node 118:6091",
    description:
      "Pixel-perfect capsule button with frosted translucent halo cavity tray, multi-tier elevation drop shadows, specular bevel insets, and 26px black circle with ladder-rung apex emblem.",
    href: "/buttons/scaling-capsule-button",
    features: ["Frosted halo tray", "Multi-tier shadow stack", "26px Black circle", "Ladder-rung icon"],
  },
  {
    id: "animated-slide",
    name: "Animated Slide-Up Button",
    badge: "Interactive",
    badgeColor: "#8B5CF6",
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
    description:
      "High-energy lead capture CTA button featuring pulsing ambient halo bloom, click sound trigger, and dynamic 3D depth press feedback.",
    href: "/buttons/magnetic-pulse-cta",
    features: ["Ambient bloom pulse", "Sound effects", "Spring depth press", "Lead modal trigger"],
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
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <Link
            href="/ui-components"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-300 transition-colors group"
          >
            <svg
              className="w-4 h-4 text-gray-400 group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>All UI Components</span>
          </Link>
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-gray-500">
            <Link href="/ui-components" className="text-gray-400 hover:text-white transition-colors">
              UI Components
            </Link>
            <span>/</span>
            <span className="text-[#FF5B04]">Buttons Catalog</span>
          </div>
        </div>

        {/* Header section */}
        <div className="text-center space-y-5 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-300 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#FF5B04] animate-pulse" />
            <span>Master Button Collection</span>
            <span className="text-gray-500">•</span>
            <span className="text-[#00E5BE]">4 Dedicated Button Studios</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-jakarta">
            Handcrafted <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5B04] via-orange-300 to-[#00E5BE]">Button Architecture</span>
          </h1>

          <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
            Each button component below features its own dedicated interactive studio page with full customization sandbox, Figma Dev Mode breakdown, and copy-ready Next.js code.
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
                  {btn.figmaNode && (
                    <span className="text-[11px] font-mono text-gray-500">
                      {btn.figmaNode}
                    </span>
                  )}
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
