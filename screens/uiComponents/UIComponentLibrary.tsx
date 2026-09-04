"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
import { TactileNeumorphicToggle } from "@/components/TactileNeumorphicToggle";
import { GlossyGelButton } from "@/components/GlossyGelButton";
import { TactileNeumorphicSwitch } from "@/components/TactileNeumorphicSwitch";
import PageWrapper from "@/components/PageWrapper";
import GlobalCTA from "@/components/GlobalCTA";
import {
  HERO_BADGE_PRESET,
  HERO_BADGE_CLASSNAME,
  HERO_BADGE_ANIMATION_STYLE,
} from "@/config/glassSurfacePresets";

export type ComponentCategory = "all" | "buttons" | "badges" | "surfaces" | "controls";

export interface CategoryOverviewCard {
  id: ComponentCategory;
  title: string;
  count: string;
  badge: string;
  badgeColor: string;
  description: string;
  tags: string[];
  href: string;
  featuredPreview: React.ReactNode;
}

export interface UIComponentItem {
  id: string;
  name: string;
  category: ComponentCategory;
  categoryLabel: string;
  badge?: string;
  badgeVariant?: "gradient" | "cyan" | "solid";
  description: string;
  detailUrl: string;
  features: string[];
  codeSnippet: string;
}

export const UI_COMPONENTS: UIComponentItem[] = [
  {
    id: "frosted-gel-download-button",
    name: "Frosted Gel Download Button",
    category: "buttons",
    categoryLabel: "Buttons & CTAs",
    badge: "Glassmorphism",
    badgeVariant: "cyan",
    description:
      "Dual-pill neumorphic split button with elevated ceramic pill, frosted glass gel download tile, optical refraction rings, and volumetric blue underglow flare.",
    detailUrl: "/componentlab/frosted-gel-download-button",
    features: ["Elevated ceramic pill", "Frosted glass cloud tile", "Volumetric blue underglow", "Interactive hover lift"],
    codeSnippet: `<FrostedGelDownloadButton\n  label="Download now"\n  theme="default-blue"\n  size="md"\n/>`,
  },
  {
    id: "isometric-revive-button",
    name: "Isometric 3D Revive Button",
    category: "buttons",
    categoryLabel: "Buttons & CTAs",
    badge: "Isometric 3D",
    badgeVariant: "gradient",
    description:
      "Authentic 30° isometric 3D extruded button featuring dynamic spring depression, obsidian bevel walls, amber indicator flare, and blinding optical neon underglow.",
    detailUrl: "/componentlab/isometric-revive-button",
    features: ["30° Isometric matrix", "Multi-layer 3D extrusion", "Optical neon underglow", "Dynamic spring physics"],
    codeSnippet: `<IsometricReviveButton\n  label="Revive Now"\n  theme="default"\n  size="sm"\n/>`,
  },
  {
    id: "elevated-underglow-cta",
    name: "Elevated Underglow 3D Button",
    category: "buttons",
    categoryLabel: "Buttons & CTAs",
    badge: "Tactile Elevation",
    badgeVariant: "cyan",
    description:
      "Interactive 3D tactile pill button that elevates 13px on hover to reveal a glowing electric blue extruded sub-chassis, bottom reflection rim, and realistic clay elevation physics.",
    detailUrl: "/componentlab/elevated-underglow-cta",
    features: ["13px Spring lift", "Electric blue 3D underlayer", "Interactive states", "Phone call icon"],
    codeSnippet: `<ElevatedUnderglowCTA\n  label="Book A Call"\n  icon="phone"\n  theme="default"\n  size="md"\n/>`,
  },
  {
    id: "tactile-neumorphic-switch",
    name: "Tactile Neumorphic Dual-Dome Switch",
    category: "controls",
    categoryLabel: "Controls & Toggles",
    badge: "Photon Channel",
    badgeVariant: "gradient",
    description:
      "Photorealistic 3D neumorphic toggle switch with an outer recessed bevel cavity, deep carved shadow trench, illuminated emerald photon channel, and dual-dome sculpted tactile thumb.",
    detailUrl: "/componentlab/tactile-neumorphic-switch",
    features: ["Pixel-accurate OFF & ON states", "Dual-dome tactile thumb", "Illuminated emerald trench", "Outer recessed bevel cavity"],
    codeSnippet: `<TactileNeumorphicSwitch\n  theme="emerald-photon"\n  size="md"\n  defaultChecked={true}\n/>`,
  },
  {
    id: "glossy-gel-button",
    name: "Glossy Gel Glass Button",
    category: "buttons",
    categoryLabel: "Buttons & CTAs",
    badge: "Liquid Glass",
    badgeVariant: "cyan",
    description:
      "High-gloss skeuomorphic gel glass CTA button directly from spec node 2:2. Multi-layer inner shadow depth, organic specular blurred highlight capsule, and crisp text drop shadow.",
    detailUrl: "/componentlab/glossy-gel-button",
    features: ["1:1 spec fidelity", "4-layer optical drop & inner shadow", "Curved blurred top specular capsule", "Interactive spring depression"],
    codeSnippet: `<GlossyGelButton\n  theme="emerald-gel"\n  size="md"\n>\n  Get Started\n</GlossyGelButton>`,
  },
  {
    id: "tactile-neumorphic-toggle",
    name: "Tactile Neumorphic Pill Toggle",
    category: "controls",
    categoryLabel: "Controls & Toggles",
    badge: "Debossed Neumorphic",
    badgeVariant: "solid",
    description:
      "Ultra-tactile debossed neumorphic pill switch with a 5-layer inset shadow groove, brushed metallic sliding thumb with specular bevels, and etched status glyphs.",
    detailUrl: "/componentlab/tactile-neumorphic-toggle",
    features: ["Pixel-accurate debossed geometry", "5-layer optical inset groove", "Brushed metallic knob", "Spring motion physics"],
    codeSnippet: `<TactileNeumorphicToggle\n  theme="brushed-silver"\n  size="md"\n  defaultChecked={true}\n/>`,
  },
  {
    id: "led-matrix-chevron",
    name: "LED Dot Matrix Chevron Button",
    category: "buttons",
    categoryLabel: "Buttons & CTAs",
    badge: "Cyberpunk Matrix",
    badgeVariant: "cyan",
    description:
      "Cyberpunk carbon-fiber squircle button with an expandable 7×7 LED dot matrix screen that stretches across the entire chassis on hover/click revealing 5 cascading pixel chevrons.",
    detailUrl: "/componentlab/led-matrix-chevron",
    features: ["Expandable LED screen", "7x7 Dot matrix chevrons", "Cascading marquee wave", "Carbon squircle chassis"],
    codeSnippet: `<LedMatrixChevronButton\n  theme="monochrome"\n  size="md"\n/>`,
  },
  {
    id: "slide-grow-button",
    name: "Swipe to Grow / Slide Button",
    category: "controls",
    categoryLabel: "Interactive Controls",
    badge: "Capsule Slider",
    badgeVariant: "gradient",
    description:
      "Interactive metallic capsule slider button with draggable glowing electric blue knob, illuminated neon channel fill, and dynamic masked text reveal.",
    detailUrl: "/componentlab/slide-grow-button",
    features: ["Draggable knob physics", "Neon channel beam fill", "Masked text reveal", "Smooth slider snap"],
    codeSnippet: `<SlideGrowButton\n  theme="silver"\n  size="md"\n/>`,
  },
  {
    id: "vintage-leather-cta",
    name: "Vintage Leather & Brass Button",
    category: "buttons",
    categoryLabel: "Buttons & CTAs",
    badge: "Heritage Leather",
    badgeVariant: "solid",
    description:
      "Luxury embossed heritage leather & brass button with 6px bottom tactile bevel lip, recessed enclosure tray, and filigree scrollwork corner flourishes.",
    detailUrl: "/componentlab/vintage-leather-cta",
    features: ["3D Tactile bevel lip", "Filigree corner ornaments", "Recessed enclosure tray", "5 Luxury themes"],
    codeSnippet: `<VintageLeatherCTA\n  theme="heritage"\n  size="md"\n  label="Shop ties"\n/>`,
  },
  {
    id: "neumorphic-glow-cta",
    name: "Neumorphic Glow CTA",
    category: "buttons",
    categoryLabel: "Buttons & CTAs",
    badge: "Clay / Neumorphic",
    badgeVariant: "cyan",
    description:
      "Authentic claymorphic and neumorphic elevated CTA button pair with glowing neon green badge depth, multi-tier elevation drop shadows, and plus-lighter bloom.",
    detailUrl: "/componentlab/neumorphic-glow-cta",
    features: ["Pill & Squircle variants", "Neon green glow badge", "Multi-tier clay shadows", "Plus-lighter bloom"],
    codeSnippet: `<NeumorphicGlowCTA\n  variant="pill"\n  label="Learn more"\n/>`,
  },
  {
    id: "arc-corner-toggle",
    name: "Arc Corner Slider Toggle",
    category: "controls",
    categoryLabel: "Interactive Controls",
    badge: "Arc Slider Switch",
    badgeVariant: "gradient",
    description:
      "Interactive corner arc slider toggle with light and dark mode states, rotating capsule knob along a 90° circular track, sunken sunburst dial, and glowing magenta laser beam.",
    detailUrl: "/componentlab/arc-corner-toggle",
    features: ["90° Corner arc track", "Sunburst dial loader", "Light & Dark dual mode", "Laser beam flare"],
    codeSnippet: `<ArcCornerToggle\n  scale={0.88}\n/>`,
  },
  {
    id: "smash-tactile-button",
    name: "Tactile 'Smash' Button",
    category: "buttons",
    categoryLabel: "Buttons & CTAs",
    badge: "Neo-Brutalist",
    badgeVariant: "gradient",
    description:
      "Neo-brutalist tech button with outer enclosure frame, cushion cooling tray, obsidian core slab, and glowing neon reactor underglow.",
    detailUrl: "/componentlab/smash-tactile-button",
    features: ["Tech enclosure frame", "Cushion cooling tray", "Obsidian core slab", "Reactor underglow"],
    codeSnippet: `<SmashTactileButton\n  label="Smash the button"\n  variant="default"\n  size="md"\n/>`,
  },
  {
    id: "scaling-capsule-button",
    name: "Scaling Capsule Tactile Button",
    category: "buttons",
    categoryLabel: "Buttons & CTAs",
    badge: "Frosted Capsule",
    badgeVariant: "cyan",
    description:
      "Recessed capsule button featuring a frosted translucent glass tray, obsidian cap with multi-tiered elevation drop shadows, and circular apex emblem badge.",
    detailUrl: "/componentlab/scaling-capsule-button",
    features: ["Frosted outer glass tray", "Multi-tier shadow stack", "26px Black circle", "Ladder-rung icon"],
    codeSnippet: `<ScalingCapsuleButton\n  label="Scaling Workshop"\n  variant="dark"\n  size="md"\n/>`,
  },
  {
    id: "tactile-pill-button",
    name: "Tactile 3D Pill Button",
    category: "buttons",
    categoryLabel: "Buttons & CTAs",
    badge: "3D Tactile Spring",
    badgeVariant: "cyan",
    description:
      "Hyper-realistic 3D tactile button with recessed cavity slot, spring tilt physics, specular bevels, and glowing status beacon.",
    detailUrl: "/componentlab/tactile-pill-button",
    features: ["Recessed tray depth", "Spring lift & tilt", "Radiant status glow", "5 Theme variants"],
    codeSnippet: `<TactilePillButton\n  label="Get Started"\n  dotColor="#54EAD8"\n  variant="default"\n/>`,
  },
  {
    id: "animated-slide-button",
    name: "Animated Slide-Up Button",
    category: "buttons",
    categoryLabel: "Buttons & CTAs",
    badge: "Micro-Interaction",
    badgeVariant: "gradient",
    description:
      "Interactive dual-label CTA button with smooth vertical translate animations on hover. Designed for conversion cards and primary service actions.",
    detailUrl: "/componentlab/animated-slide-button",
    features: ["Dual text roll-up", "Smooth ease transition", "Primary & secondary styles", "Auto-contained overflow"],
    codeSnippet: `<AnimatedButton\n  primaryText="Explore Services"\n  hoverText="See More →"\n  variant="primary"\n/>`,
  },
  {
    id: "glass-badge",
    name: "Glassmorphic Badge",
    category: "badges",
    categoryLabel: "Badges & Indicators",
    badge: "Design Tokens",
    badgeVariant: "solid",
    description:
      "Frosted glass pill badge with multi-layer backdrop filter blur, subtle border sheen, and glowing typography for section headers and status chips.",
    detailUrl: "/componentlab/glass-badge",
    features: ["Backdrop blur glass", "Cyan & gradient variants", "Specular top highlight", "Responsive typography"],
    codeSnippet: `<GlassBadge variant="gradient" size="md">\n  PROPRIETARY COMPONENT\n</GlassBadge>`,
  },
  {
    id: "glass-surface",
    name: "Glass Surface Container",
    category: "surfaces",
    categoryLabel: "Surfaces & Glassmorphism",
    badge: "Multi-layered",
    badgeVariant: "gradient",
    description:
      "Deep frosted glassmorphic card container with dynamic specular sheen, rounded corners, noise texture support, and ambient light reflection.",
    detailUrl: "/componentlab/glass-surface",
    features: ["Gaussian blur backdrop", "Dynamic border sheen", "Hardware accelerated", "Accessible contrast"],
    codeSnippet: `<GlassSurface\n  width="100%"\n  height="auto"\n  borderRadius={24}\n  blur={20}\n  className="p-6"\n>\n  {children}\n</GlassSurface>`,
  },
  {
    id: "magnetic-pulse-cta",
    name: "Magnetic Pulsing CTA",
    category: "buttons",
    categoryLabel: "Buttons & CTAs",
    badge: "Audio + Haptic",
    badgeVariant: "gradient",
    description:
      "High-energy glowing action button with ambient radiant pulse effect, click audio trigger hook, and 3D depth press feedback.",
    detailUrl: "/componentlab/magnetic-pulse-cta",
    features: ["Ambient ring pulse", "Sound effects integration", "Tactile spring scale", "Lead modal trigger"],
    codeSnippet: `<MagneticPulseCTA\n  label="Let's Venture"\n  pulseColor="#FF5B04"\n/>`,
  },
];

export default function UIComponentLibrary() {
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedInstall, setCopiedInstall] = useState(false);

  const handleCopyInstall = () => {
    navigator.clipboard.writeText("npm install framer-motion clsx lucide-react tailwind-merge");
    setCopiedInstall(true);
    setTimeout(() => setCopiedInstall(false), 2000);
  };

  const CATEGORY_CARDS: CategoryOverviewCard[] = [
    {
      id: "buttons",
      title: "Buttons & CTAs",
      count: "13 Components",
      badge: "Master Collection",
      badgeColor: "#FF5B04",
      description:
        "High-conversion buttons engineered with 3D tactile elevation, optical underglow flares, skeuomorphic leather, liquid gel glass, and phosphor LED matrices.",
      tags: ["3D Tactile Lift", "Liquid Gel Glass", "LED Dot Matrix", "Skeuomorphic", "Isometric 30°"],
      href: "/componentlab/tactile-pill-button",
      featuredPreview: (
        <div className="scale-90 transform-gpu py-2 flex items-center justify-center">
          <ElevatedUnderglowCTA label="Book A Call" theme="default" size="sm" />
        </div>
      ),
    },
    {
      id: "controls",
      title: "Interactive Controls & Toggles",
      count: "4 Components",
      badge: "Neumorphic Toggles",
      badgeColor: "#00B894",
      description:
        "Photorealistic 3D neumorphic switches, 90° radial arc corner toggles, swipe-to-unlock capsule sliders, and tactile smash buttons.",
      tags: ["Dual-Dome 3D", "5-Layer Inset Groove", "Gesture Drag", "Spring Snapping"],
      href: "/componentlab/tactile-neumorphic-switch",
      featuredPreview: (
        <div className="scale-90 transform-gpu py-2 flex items-center justify-center">
          <TactileNeumorphicSwitch theme="emerald-photon" size="sm" defaultChecked={true} />
        </div>
      ),
    },
    {
      id: "badges",
      title: "Badges, Status & Beacons",
      count: "2 Components",
      badge: "Design Tokens",
      badgeColor: "#8B5CF6",
      description:
        "Multi-layer glassmorphic header badges, deterministic hash-gradient avatars, and pulsing radiant beacon indicators.",
      tags: ["Backdrop Blur", "Hash Gradient", "Specular Border", "Live Beacon"],
      href: "/componentlab/glass-badge",
      featuredPreview: (
        <div className="flex flex-col items-center gap-3 py-2">
          <GlassBadge variant="gradient" size="md">
            PROPRIETARY COMPONENT
          </GlassBadge>
          <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Active Status Beacon</span>
          </div>
        </div>
      ),
    },
    {
      id: "surfaces",
      title: "Surfaces & Glass Containers",
      count: "1 Component",
      badge: "Atmospheric Depth",
      badgeColor: "#3B82F6",
      description:
        "Frosted glassmorphism container cards with hardware-accelerated Gaussian blur, specular highlight sheens, and noise overlays.",
      tags: ["Gaussian Blur", "Specular Sheen", "Hardware Accel", "Adaptive Contrast"],
      href: "/componentlab/glass-surface",
      featuredPreview: (
        <div className="w-full max-w-[220px] p-4 rounded-2xl bg-white/80 border border-gray-200/90 shadow-md backdrop-blur-md text-center">
          <div className="text-[11px] font-mono text-blue-600 font-bold uppercase tracking-wider">Glass Surface</div>
          <div className="text-xs text-gray-500 mt-1 font-sans">Specular Sheen &amp; Blur</div>
        </div>
      ),
    },
  ];

  const filteredComponents = useMemo(() => {
    return UI_COMPONENTS.filter((item) => {
      const matchCat = selectedCategory === "all" || item.category === selectedCategory;
      const matchSearch =
        searchQuery.trim() === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

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

        {/* Ambient Warm Flares */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[850px] h-[550px] bg-[#FF5B04]/6 rounded-full blur-[160px]" />
          <div className="absolute top-1/3 left-1/12 w-[450px] h-[450px] bg-[#00E5BE]/6 rounded-full blur-[140px]" />
          <div className="absolute top-2/3 right-1/12 w-[550px] h-[500px] bg-purple-500/5 rounded-full blur-[160px]" />
        </div>

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 space-y-16">
          {/* Top Hero Section */}
          <div className="flex flex-col items-center justify-center text-center space-y-3 max-w-4xl mx-auto pt-6">
            <GlassSurface
              {...HERO_BADGE_PRESET}
              className={HERO_BADGE_CLASSNAME}
              style={HERO_BADGE_ANIMATION_STYLE}
            >
              <div className="badge-text relative z-10 max-md:text-xs uppercase font-semibold tracking-wider">
                COMPONENT ECOSYSTEM
              </div>
            </GlassSurface>

            <div className="relative z-10 w-full">
              <h1 className="hero-header">
                <span className="text-black">Design System &amp; </span>
                <span className="text-[#FF5B04]">Component Library</span>
              </h1>
            </div>

            <p className="sub-header text-[#11181C] mx-auto">
              Browse our categorized collection of handcrafted React, Tailwind CSS, and Framer Motion components. Engineered with 3D tactile physics, glassmorphism, and pixel precision.
            </p>

            {/* Quick Metrics Bar */}
            <div className="flex flex-wrap justify-center gap-8 max-md:gap-4 mt-6 autoShow">
              <div className="text-center">
                <p className="text-2xl max-md:text-lg font-black font-jetbrains-mono text-gray-900">
                  18+
                </p>
                <p className="text-xs text-gray-500 font-jetbrains-mono uppercase">
                  Master Components
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl max-md:text-lg font-black font-jetbrains-mono text-[#FF5B04]">
                  100%
                </p>
                <p className="text-xs text-gray-500 font-jetbrains-mono uppercase">
                  Copy-Paste Code
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl max-md:text-lg font-black font-jetbrains-mono text-gray-900">
                  0
                </p>
                <p className="text-xs text-gray-500 font-jetbrains-mono uppercase">
                  Compromises
                </p>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              CATEGORY OVERVIEW GRID (Primary Hub Navigation)
             ───────────────────────────────────────────────────────────── */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-950 tracking-tight font-jakarta">
                  Explore Component Categories
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Select a category to view specialized live studios, props tables, and drop-in code.
                </p>
              </div>

              <Link
                href="/componentlab/tactile-pill-button"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-xs font-semibold text-[#FF5B04] transition-colors self-start sm:self-auto shadow-sm"
              >
                <span>View All 18 Components</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CATEGORY_CARDS.map((cat) => (
                <div
                  key={cat.id}
                  className="group relative flex flex-col justify-between p-8 rounded-3xl bg-white border border-gray-200/90 hover:border-orange-500/40 transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] overflow-hidden"
                >
                  {/* Background ambient accent */}
                  <div
                    className="absolute -top-20 -right-20 w-48 h-48 rounded-full blur-[90px] opacity-10 pointer-events-none transition-opacity duration-300 group-hover:opacity-25"
                    style={{ backgroundColor: cat.badgeColor }}
                  />

                  <div className="space-y-6 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg border uppercase tracking-wider"
                          style={{
                            color: cat.badgeColor,
                            backgroundColor: `${cat.badgeColor}12`,
                            borderColor: `${cat.badgeColor}30`,
                          }}
                        >
                          {cat.badge}
                        </span>
                        <span className="text-xs font-mono text-gray-500">• {cat.count}</span>
                      </div>

                      <span className="text-xs font-mono text-gray-400 font-medium">Production Ready</span>
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 group-hover:text-[#FF5B04] transition-colors font-jakarta">
                        {cat.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                        {cat.description}
                      </p>
                    </div>

                    {/* Live Visual Feature Showcase */}
                    <div className="p-6 rounded-2xl bg-gradient-to-b from-[#F5F6F8] to-[#ECEEF2] border border-gray-200/90 flex items-center justify-center min-h-[140px] overflow-hidden shadow-inner relative">
                      {/* Subtle dot pattern for preview clarity */}
                      <div
                        className="absolute inset-0 opacity-40 pointer-events-none"
                        style={{
                          backgroundImage: "radial-gradient(#94A3B8 1px, transparent 1px)",
                          backgroundSize: "16px 16px",
                        }}
                      />
                      <div className="relative z-10">{cat.featuredPreview}</div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {cat.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-700 border border-gray-200/70"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between relative z-10">
                    <Link
                      href={cat.href}
                      className="inline-flex items-center gap-2 text-sm font-bold text-gray-900 group-hover:text-[#FF5B04] transition-colors"
                    >
                      <span>Explore {cat.title}</span>
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>

                    <span className="text-xs font-mono text-gray-400">React + Tailwind</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              QUICK INSTALLATION & SETUP GUIDE
             ───────────────────────────────────────────────────────────── */}
          <div className="bg-white border border-gray-200/90 rounded-3xl p-8 space-y-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 font-jakarta">Peer Dependencies &amp; Setup</h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Install peer dependencies to run any component in your Next.js or React application:
                </p>
              </div>

              <button
                onClick={handleCopyInstall}
                className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold transition-colors cursor-pointer self-start md:self-auto shadow-sm"
              >
                {copiedInstall ? "✓ Command Copied!" : "Copy Install Command"}
              </button>
            </div>

            <div className="bg-gray-950 border border-gray-800 rounded-2xl px-5 py-3.5 font-mono text-xs text-emerald-400 overflow-x-auto shadow-inner">
              <code>npm install framer-motion clsx lucide-react tailwind-merge</code>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              LIVE COMPONENT BROWSER & CODE VIEWER
             ───────────────────────────────────────────────────────────── */}
          <div id="browser" className="space-y-8 scroll-mt-28">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-950 font-jakarta">
                  Component Catalog
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Explore every individual component, inspect props, and copy drop-in snippets.
                </p>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-gray-100 border border-gray-200 text-xs font-mono">
                {[
                  { id: "all", label: "All Items" },
                  { id: "buttons", label: "Buttons & CTAs" },
                  { id: "controls", label: "Controls" },
                  { id: "badges", label: "Badges" },
                  { id: "surfaces", label: "Surfaces" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedCategory(tab.id as ComponentCategory)}
                    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                      selectedCategory === tab.id
                        ? "bg-[#FF5B04] text-white font-bold shadow-md shadow-[#FF5B04]/25"
                        : "text-gray-600 hover:text-gray-950 hover:bg-white/60"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search components by name, feature, or keyword (e.g. 'isometric', 'matrix', 'glass', 'neumorphic')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 pl-12 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#FF5B04] focus:ring-2 focus:ring-[#FF5B04]/10 transition-all shadow-sm"
              />
              <svg
                className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Component Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredComponents.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col justify-between p-6 rounded-3xl bg-white border border-gray-200 hover:border-orange-500/40 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] space-y-5 group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-700 border border-gray-200">
                        {item.categoryLabel}
                      </span>
                      {item.badge && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-50 text-[#FF5B04] border border-orange-200 font-semibold">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#FF5B04] transition-colors font-jakarta">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1.5 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <ul className="space-y-1.5 text-xs text-gray-600">
                      {item.features.slice(0, 3).map((f) => (
                        <li key={f} className="flex items-center gap-2">
                          <span className="text-[#00B894] font-bold text-xs">✓</span>
                          <span className="text-gray-600 font-sans">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                    <Link
                      href={item.detailUrl}
                      className="text-xs font-bold text-[#FF5B04] hover:text-orange-600 transition-colors flex items-center gap-1"
                    >
                      <span>Studio &amp; Code</span>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>

                    <button
                      onClick={() => handleCopyCode(item.id, item.codeSnippet)}
                      className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-mono text-gray-700 hover:text-gray-900 border border-gray-200 transition-colors cursor-pointer"
                    >
                      {copiedId === item.id ? "✓ Copied" : "Copy Snippet"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Website Global CTA */}
          <GlobalCTA topic="custom UI components or design systems" />
        </div>
      </div>
    </PageWrapper>
  );
}
