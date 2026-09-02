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
import { TactileNeumorphicSwitch } from "@/components/TactileNeumorphicSwitch";
import { GlossyGelButton } from "@/components/GlossyGelButton";
import GlassSurface from "@/components/GlassSurface";
import {
  HERO_BADGE_PRESET,
  HERO_BADGE_CLASSNAME,
  HERO_BADGE_ANIMATION_STYLE,
} from "@/config/glassSurfacePresets";
import PageWrapper from "@/components/PageWrapper";
import GlobalCTA from "@/components/GlobalCTA";

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
    id: "tactile-neumorphic-switch",
    name: "Tactile Neumorphic Dual-Dome Switch",
    badge: "1:1 Figma (1:7 & 1:8)",
    badgeColor: "#10E599",
    tech: "React • Framer • Tailwind",
    description:
      "Photorealistic 3D neumorphic toggle switch directly from Figma (Nodes 1:7 & 1:8). Features outer recessed cavity, deep shadow trench, illuminated emerald photon channel, and dual-dome sculpted tactile thumb.",
    href: "/buttons/tactile-neumorphic-switch",
    features: ["Dual-dome sculpted knob", "Deep carved trench", "Illuminated emerald fill", "60fps Spring physics"],
  },
  {
    id: "glossy-gel",
    name: "Glossy Gel Glass Button",
    badge: "1:1 Figma (2:2)",
    badgeColor: "#10B981",
    tech: "React • Tailwind • Framer",
    description:
      "High-gloss skeuomorphic gel glass CTA button directly from Figma (Node 2:2). Multi-layer inner shadow depth, organic specular blurred highlight capsule, and crisp text drop shadow.",
    href: "/buttons/glossy-gel-button",
    features: ["1:1 Figma fidelity", "4-layer optical shadows", "Top specular capsule", "Interactive spring bounce"],
  },
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
    badgeColor: "#00B894",
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
    <PageWrapper showFloatingButton={false}>
      <div className="relative min-h-screen bg-[#FAFAFA] text-gray-900 selection:bg-[#FF5B04] selection:text-white hero-page-container">
        {/* Subtle Grid Background Pattern (matching Landing Page) */}
        <div
          className="absolute pointer-events-none inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0, 0, 0, 0.04) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 0, 0, 0.04) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Layered gentle mist & ambient gradient lighting */}
        <div
          className="absolute pointer-events-none inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to top, rgba(250, 250, 250, 1), transparent 15%),
              linear-gradient(to bottom, rgba(250, 250, 250, 0.7) 0%, transparent 30%)
            `,
          }}
        />

        {/* Ambient Lighting Flares */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[550px] bg-[#FF5B04]/6 rounded-full blur-[160px]" />
          <div className="absolute top-1/3 left-1/12 w-[450px] h-[450px] bg-[#00E5BE]/6 rounded-full blur-[140px]" />
          <div className="absolute top-2/3 right-1/12 w-[550px] h-[450px] bg-purple-500/5 rounded-full blur-[160px]" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-20 xl:px-32 relative z-10 space-y-16">
          {/* Header section */}
          <div className="flex flex-col items-center justify-center text-center space-y-3 max-w-3xl mx-auto pt-6">
            <GlassSurface
              {...HERO_BADGE_PRESET}
              className={HERO_BADGE_CLASSNAME}
              style={HERO_BADGE_ANIMATION_STYLE}
            >
              <div className="badge-text relative z-10 max-md:text-xs uppercase font-semibold tracking-wider">
                INTERACTIVE BUTTON LIBRARY
              </div>
            </GlassSurface>

            <div className="relative z-10 w-full">
              <h1 className="hero-header">
                <span className="text-black">Handcrafted </span>
                <span className="text-[#FF5B04]">Button Architecture</span>
              </h1>
            </div>

            <p className="sub-header text-[#11181C] mx-auto">
              Each button component below features its own interactive studio page with full customization sandboxes, props reference, design tokens, and copy-ready React &amp; Tailwind code.
            </p>
          </div>

          {/* Buttons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {BUTTON_CATALOG.map((btn) => (
              <div
                key={btn.id}
                className="bg-white border border-gray-200/90 hover:border-orange-500/40 rounded-3xl p-6 sm:p-8 flex flex-col justify-between gap-6 transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] group"
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
                    <span className="text-[11px] font-mono text-gray-600 bg-gray-100 px-2.5 py-1 rounded-lg border border-gray-200">
                      {btn.tech}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 group-hover:text-[#FF5B04] transition-colors font-jakarta">
                      {btn.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1.5 leading-relaxed">
                      {btn.description}
                    </p>
                  </div>
                </div>

                {/* Live Preview Area */}
                <div className="bg-gradient-to-b from-[#F5F6F8] to-[#ECEEF2] rounded-2xl p-8 border border-gray-200 flex items-center justify-center min-h-[190px] relative overflow-hidden shadow-inner">
                  {/* Subtle dot pattern for preview clarity */}
                  <div
                    className="absolute inset-0 opacity-40 pointer-events-none"
                    style={{
                      backgroundImage: "radial-gradient(#94A3B8 1px, transparent 1px)",
                      backgroundSize: "16px 16px",
                    }}
                  />

                  <div className="relative z-10 flex items-center justify-center w-full">
                    {btn.id === "tactile-neumorphic-switch" && (
                      <div className="scale-75 sm:scale-85 py-1">
                        <TactileNeumorphicSwitch
                          theme="emerald-photon"
                          size="sm"
                          defaultChecked={true}
                        />
                      </div>
                    )}

                    {btn.id === "glossy-gel" && (
                      <div className="scale-90 sm:scale-100 py-1">
                        <GlossyGelButton theme="emerald-gel" size="md">
                          Get Started
                        </GlossyGelButton>
                      </div>
                    )}

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
                          dotColor="#00B894"
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
                        <div className="absolute inset-0 rounded-full bg-[#FF5B04]/30 blur-xl animate-pulse" />
                        <button className="relative px-6 py-3 rounded-full bg-[#FF5B04] text-white font-bold text-sm shadow-[0_4px_15px_rgba(255,91,4,0.4)] hover:scale-105 transition-transform">
                          Let&apos;s Venture ⚡
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Features List */}
                <div className="flex flex-wrap gap-1.5">
                  {btn.features.map((f, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-gray-100 border border-gray-200/80 text-[11px] font-mono text-gray-700"
                    >
                      ✓ {f}
                    </span>
                  ))}
                </div>

                {/* Action Button Link to Dedicated Page */}
                <div className="pt-4 border-t border-gray-100">
                  <Link
                    href={btn.href}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gray-950 hover:bg-[#FF5B04] text-white text-xs sm:text-sm font-bold transition-all shadow-md group/link"
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

          {/* Website Global CTA */}
          <GlobalCTA topic="custom interactive buttons or UI components" />
        </div>
      </div>
    </PageWrapper>
  );
}
