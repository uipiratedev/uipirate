"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import TactilePillButton, { TactileButtonVariant } from "@/components/TactilePillButton";
import ScalingCapsuleButton from "@/components/ScalingCapsuleButton";
import SmashTactileButton from "@/components/SmashTactileButton";
import GlassBadge from "@/components/GlassBadge";
import GlassSurface from "@/components/GlassSurface";
import { AnimatedButton } from "@/components/AnimatedButton";
import Avatar from "@/components/Avatar";

export type ComponentCategory = "all" | "buttons" | "badges" | "surfaces" | "layout";

interface UIComponentItem {
  id: string;
  name: string;
  category: ComponentCategory;
  categoryLabel: string;
  badge?: string;
  badgeVariant?: "gradient" | "cyan" | "solid";
  description: string;
  detailUrl?: string;
  figmaRef?: string;
  features: string[];
  codeSnippet: string;
}

const UI_COMPONENTS: UIComponentItem[] = [
  {
    id: "smash-tactile-button",
    name: "Tactile 'Smash' Button",
    category: "buttons",
    categoryLabel: "Buttons & CTAs",
    badge: "Figma 17:1480",
    badgeVariant: "gradient",
    description:
      "Neo-brutalist tech button with outer enclosure frame, cushion cooling tray, obsidian core slab, and glowing neon reactor underglow. Direct implementation of Figma Node 17:1480.",
    detailUrl: "/buttons/smash-tactile-button",
    figmaRef: "Node 17:1480",
    features: ["Tech enclosure frame", "Cushion cooling tray", "Obsidian core slab", "Reactor underglow"],
    codeSnippet: `<SmashTactileButton\n  label="Smash the button"\n  variant="figma"\n  size="md"\n  onClick={() => console.log("Smashed!")}\n/>`,
  },
  {
    id: "scaling-capsule-button",
    name: "Scaling Capsule Tactile Button",
    category: "buttons",
    categoryLabel: "Buttons & CTAs",
    badge: "Figma 118:6091",
    badgeVariant: "cyan",
    description:
      "Recessed capsule button featuring a frosted translucent halo tray, obsidian cap with multi-tiered elevation drop shadows, and circular apex emblem badge. Direct 1:1 implementation from Figma Node 118:6091.",
    detailUrl: "/buttons/scaling-capsule-button",
    figmaRef: "Node 118:6091",
    features: ["Frosted outer halo", "Multi-tier shadow stack", "26px Black circle", "Ladder-rung icon"],
    codeSnippet: `<ScalingCapsuleButton\n  label="Scaling Workshop"\n  variant="dark"\n  size="md"\n  onClick={() => console.log("Clicked!")}\n/>`,
  },
  {
    id: "tactile-pill-button",
    name: "Tactile 3D Pill Button",
    category: "buttons",
    categoryLabel: "Buttons & CTAs",
    badge: "Figma Dev Mode",
    badgeVariant: "cyan",
    description:
      "Hyper-realistic 3D tactile button with recessed cavity slot, spring tilt physics, specular bevels, and glowing status beacon. Directly implemented from Figma Master Button collection nodes 75:1201 & 75:1206.",
    detailUrl: "/buttons/tactile-pill-button",
    figmaRef: "Nodes 75:1201 & 75:1206",
    features: ["Recessed tray depth", "Spring lift & tilt", "Radiant status glow", "5 Theme variants"],
    codeSnippet: `<TactilePillButton\n  label="Get Started"\n  dotColor="#54EAD8"\n  variant="default"\n  onClick={() => console.log("Clicked!")}\n/>`,
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
    detailUrl: "/buttons/animated-slide-button",
    features: ["Dual text roll-up", "Smooth ease transition", "Primary & secondary styles", "Auto-contained overflow"],
    codeSnippet: `<AnimatedButton\n  primaryText="Explore Services"\n  hoverText="See More →"\n  variant="primary"\n  onClick={() => {}}\n/>`,
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
    features: ["Gaussian blur backdrop", "Dynamic border sheen", "Hardware accelerated", "Accessible contrast"],
    codeSnippet: `<GlassSurface\n  width="100%"\n  height="auto"\n  borderRadius={24}\n  blur={20}\n  className="p-6"\n>\n  {children}\n</GlassSurface>`,
  },
  {
    id: "hash-gradient-avatar",
    name: "Hash Dynamic Gradient Avatar",
    category: "badges",
    categoryLabel: "Badges & Indicators",
    badge: "Algorithmic",
    badgeVariant: "cyan",
    description:
      "Deterministic gradient avatar component that computes consistent, harmonious vibrant palettes based on username strings with fallback typography.",
    features: ["Deterministic hash color", "Image + fallback initial", "Customizable size scale", "Subtle border ring"],
    codeSnippet: `<Avatar\n  name="Vishal Anand"\n  size={48}\n/>`,
  },
  {
    id: "pulse-cta-button",
    name: "Magnetic Pulsing CTA",
    category: "buttons",
    categoryLabel: "Buttons & CTAs",
    badge: "Audio + Haptic",
    badgeVariant: "gradient",
    description:
      "High-energy glowing action button with ambient halo pulse effect, click audio trigger hook, and 3D depth press feedback.",
    detailUrl: "/buttons/magnetic-pulse-cta",
    features: ["Ambient ring pulse", "Sound effects integration", "Tactile spring scale", "Lead modal trigger"],
    codeSnippet: `<button className="relative px-6 py-3 rounded-full bg-[#FF5B04] text-white font-bold shadow-[0_0_25px_rgba(255,91,4,0.5)] hover:scale-105 transition-transform">\n  Let's Venture\n</button>`,
  },
];

export default function UIComponentsScreen() {
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Featured button sandbox state
  const [heroVariant, setHeroVariant] = useState<TactileButtonVariant>("default");
  const [heroLabel, setHeroLabel] = useState("Get Started");
  const [heroDotColor, setHeroDotColor] = useState("#54EAD8");

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
    <div className="min-h-screen bg-[#0A0A0C] text-gray-100 selection:bg-[#FF5B04] selection:text-white pt-28 pb-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient Lighting Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[850px] h-[550px] bg-[#FF5B04]/12 rounded-full blur-[160px]" />
        <div className="absolute top-1/3 left-1/12 w-[450px] h-[450px] bg-[#00E5BE]/10 rounded-full blur-[140px]" />
        <div className="absolute top-2/3 right-1/12 w-[550px] h-[500px] bg-purple-600/10 rounded-full blur-[160px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-16">
        {/* Top Breadcrumb & Badge */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-300 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#FF5B04] animate-pulse" />
            <span>UI Pirate Component System</span>
            <span className="text-gray-500">•</span>
            <span className="text-[#00E5BE]">Figma Dev Mode &amp; React Code</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-jakarta">
            Handcrafted <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5B04] via-orange-400 to-[#00E5BE]">UI Components</span>
          </h1>

          <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Production-ready React, Tailwind, and Framer Motion components engineered with pixel precision, 3D tactile physics, and rich micro-interactions.
          </p>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <div className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-gray-300">
              <span className="text-[#FF5B04] font-bold">100%</span> Figma Parity
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-gray-300">
              <span className="text-[#00E5BE] font-bold">Spring</span> Physics
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-gray-300">
              <span className="text-purple-400 font-bold">Next.js &amp; Tailwind</span> Ready
            </div>
          </div>
        </div>

        {/* HERO SPOTLIGHT: Tactile 3D Pill Button */}
        <div className="relative rounded-3xl bg-gradient-to-b from-[#18181D] to-[#121215] border border-white/15 p-6 sm:p-10 shadow-2xl overflow-hidden group">
          {/* Subtle glow border effect */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#FF5B04]/15 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#00E5BE]/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Info & Actions */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded-full bg-[#FF5B04]/20 border border-[#FF5B04]/30 text-[#FF5B04] text-xs font-bold uppercase tracking-wider">
                  Featured Master Component
                </span>
                <span className="px-3 py-1 rounded-full bg-[#00E5BE]/15 border border-[#00E5BE]/30 text-[#00E5BE] text-xs font-mono">
                  Figma Nodes 75:1201 &amp; 75:1206
                </span>
              </div>

              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white font-jakarta">
                  Tactile 3D Pill Button
                </h2>
                <p className="text-gray-400 text-sm sm:text-base mt-2 leading-relaxed">
                  Interactive tactile button featuring a recessed tray slot, spring tilt physics, and glowing status beacon. Hover over the stage to trigger the spring tilt physics, and click to open the dedicated detail page.
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {[
                  { label: "Cavity Tray", val: "Inset Shadows" },
                  { label: "Spring Tilt", val: "-9.23° Angle" },
                  { label: "Status Dot", val: "Radiant Glow" },
                  { label: "Variants", val: "5 Colorways" },
                ].map((stat, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <p className="text-[11px] text-gray-400 font-mono">{stat.label}</p>
                    <p className="text-xs font-semibold text-white mt-0.5">{stat.val}</p>
                  </div>
                ))}
              </div>

              {/* Theme variant switcher */}
              <div className="space-y-2 pt-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-mono">
                  Preview Theme:
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {(
                    [
                      { id: "default", name: "Figma Light", dot: "#54EAD8" },
                      { id: "dark", name: "Obsidian Dark", dot: "#10B981" },
                      { id: "orange", name: "Brand Orange", dot: "#FFFFFF" },
                      { id: "cyberpunk", name: "Cyberpunk", dot: "#00E5BE" },
                      { id: "minimal", name: "Clean White", dot: "#8B5CF6" },
                    ] as const
                  ).map((v) => (
                    <button
                      key={v.id}
                      onClick={() => {
                        setHeroVariant(v.id);
                        setHeroDotColor(v.dot);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                        heroVariant === v.id
                          ? "bg-white text-black font-bold shadow-lg shadow-white/10"
                          : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: v.dot }} />
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary Call to Action */}
              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/10">
                <Link
                  href="/buttons"
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#FF5B04] to-[#FF7A00] text-white font-bold text-sm shadow-[0_0_25px_rgba(255,91,4,0.4)] hover:shadow-[0_0_35px_rgba(255,91,4,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <span>Open Button Detail Page &amp; Studio</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>

                <button
                  onClick={() =>
                    handleCopyCode(
                      "hero-btn",
                      `<TactilePillButton label="${heroLabel}" dotColor="${heroDotColor}" variant="${heroVariant}" />`
                    )
                  }
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-gray-300 transition-colors"
                >
                  {copiedId === "hero-btn" ? (
                    <>
                      <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-emerald-300 font-semibold">Snippet Copied!</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span>Copy React Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Live Stage */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div
                className={`w-full h-[280px] sm:h-[320px] rounded-2xl flex flex-col items-center justify-center relative border border-white/10 transition-colors duration-500 shadow-inner ${
                  heroVariant === "default" || heroVariant === "minimal"
                    ? "bg-[#EEEEEE]"
                    : heroVariant === "dark"
                    ? "bg-[#121214]"
                    : heroVariant === "cyberpunk"
                    ? "bg-[#060911]"
                    : "bg-[#1E0D05]"
                }`}
              >
                <div className="scale-125 sm:scale-135">
                  <TactilePillButton
                    label={heroLabel}
                    dotColor={heroDotColor}
                    variant={heroVariant}
                    size="md"
                    tiltAngle={-9.23}
                  />
                </div>

                <div className="absolute bottom-3 left-0 right-0 text-center pointer-events-none">
                  <span
                    className={`text-[11px] font-mono ${
                      heroVariant === "default" || heroVariant === "minimal"
                        ? "text-gray-600"
                        : "text-gray-400"
                    }`}
                  >
                    Hover to tilt • Click button below for detail page
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Category tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/[0.03] border border-white/10 overflow-x-auto max-w-full">
              {[
                { id: "all", label: "All Components" },
                { id: "buttons", label: "Buttons & CTAs" },
                { id: "badges", label: "Badges & Chips" },
                { id: "surfaces", label: "Surfaces & Glass" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id as ComponentCategory)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === tab.id
                      ? "bg-[#FF5B04] text-white shadow-md shadow-[#FF5B04]/30"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search UI components..."
                className="w-full px-4 py-2.5 pl-10 rounded-2xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-[#FF5B04] transition-colors placeholder:text-gray-500 font-mono"
              />
              <svg
                className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" strokeWidth="2" />
                <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white text-xs font-mono"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Components Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredComponents.map((item) => (
            <div
              key={item.id}
              className="bg-[#141417] border border-white/10 hover:border-white/20 rounded-3xl p-6 flex flex-col justify-between gap-6 transition-all duration-300 hover:shadow-xl hover:shadow-black/50 group"
            >
              {/* Card Header */}
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">
                    {item.categoryLabel}
                  </span>
                  {item.badge && (
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium ${
                        item.badgeVariant === "cyan"
                          ? "bg-[#00E5BE]/10 text-[#00E5BE] border border-[#00E5BE]/20"
                          : item.badgeVariant === "gradient"
                          ? "bg-[#FF5B04]/10 text-[#FF5B04] border border-[#FF5B04]/20"
                          : "bg-white/10 text-gray-300 border border-white/10"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-[#FF5B04] transition-colors font-jakarta">
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1.5 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Live Interactive Preview Stage */}
              <div className="bg-[#0B0B0D] rounded-2xl p-6 border border-white/5 flex items-center justify-center min-h-[160px] relative overflow-hidden">
                {item.id === "smash-tactile-button" && (
                  <div className="scale-85 sm:scale-90">
                    <SmashTactileButton
                      label="Smash the button"
                      variant="figma"
                      size="sm"
                    />
                  </div>
                )}

                {item.id === "scaling-capsule-button" && (
                  <div className="scale-95 sm:scale-100">
                    <ScalingCapsuleButton
                      label="Scaling Workshop"
                      variant="dark"
                      size="sm"
                    />
                  </div>
                )}

                {item.id === "tactile-pill-button" && (
                  <div className="scale-105">
                    <TactilePillButton
                      label="Get Started"
                      dotColor="#54EAD8"
                      variant="default"
                      size="sm"
                      tiltAngle={-9.23}
                    />
                  </div>
                )}

                {item.id === "animated-slide-button" && (
                  <div className="w-full max-w-[220px]">
                    <AnimatedButton
                      primaryText="Hover Me"
                      hoverText="Slide Effect →"
                      variant="primary"
                      className="!mt-0 !py-2.5 !px-4 !rounded-xl !bg-[#FF5B04] !text-white text-xs font-semibold"
                    />
                  </div>
                )}

                {item.id === "glass-badge" && (
                  <div className="flex flex-col items-center gap-2">
                    <GlassBadge variant="gradient" size="sm">
                      DESIGN SYSTEM
                    </GlassBadge>
                    <GlassBadge variant="cyan" size="sm">
                      FIGMA DEV MODE
                    </GlassBadge>
                  </div>
                )}

                {item.id === "glass-surface" && (
                  <div className="w-full">
                    <GlassSurface
                      width="100%"
                      height={90}
                      borderRadius={16}
                      blur={15}
                      className="p-3 flex items-center justify-between border border-white/10"
                    >
                      <span className="text-xs font-medium text-white">Glassmorphism Card</span>
                      <span className="w-2 h-2 rounded-full bg-[#00E5BE] shadow-[0_0_8px_#00E5BE]" />
                    </GlassSurface>
                  </div>
                )}

                {item.id === "hash-gradient-avatar" && (
                  <div className="flex items-center -space-x-3">
                    <Avatar name="Alex Rivera" size={44} />
                    <Avatar name="Sarah Connor" size={44} />
                    <Avatar name="David Kim" size={44} />
                    <div className="w-11 h-11 rounded-full bg-black/80 border border-white/20 flex items-center justify-center text-xs font-mono text-gray-300">
                      +12
                    </div>
                  </div>
                )}

                {item.id === "pulse-cta-button" && (
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-[#FF5B04]/40 blur-md animate-pulse" />
                    <button className="relative px-5 py-2.5 rounded-full bg-[#FF5B04] text-white text-xs font-bold shadow-lg shadow-[#FF5B04]/40 hover:scale-105 transition-transform">
                      Pulse Action ⚡
                    </button>
                  </div>
                )}
              </div>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-1.5">
                {item.features.map((feat, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/5 text-[11px] font-mono text-gray-400"
                  >
                    ✓ {feat}
                  </span>
                ))}
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                {item.detailUrl ? (
                  <Link
                    href={item.detailUrl}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-[#FF5B04] text-white text-xs font-bold transition-all"
                  >
                    <span>Open Detail Page</span>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ) : (
                  <span className="text-[11px] font-mono text-gray-500">
                    Ready to copy
                  </span>
                )}

                <button
                  onClick={() => handleCopyCode(item.id, item.codeSnippet)}
                  title="Copy Component Code"
                  className="px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-gray-300 transition-colors flex items-center gap-1.5"
                >
                  {copiedId === item.id ? (
                    <>
                      <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span>Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-[#18181D] via-[#1F1410] to-[#18181D] border border-white/10 p-8 sm:p-12 text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#FF5B04]/10 rounded-full blur-[100px] pointer-events-none" />
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-jakarta">
            Need a custom tactile component for your design system?
          </h2>
          <p className="text-gray-400 text-sm max-w-xl mx-auto leading-relaxed">
            We turn complex Figma prototypes, 3D interactions, and micro-animations into production-grade React components.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="px-6 py-3 rounded-xl bg-[#FF5B04] text-white font-bold text-sm shadow-lg shadow-[#FF5B04]/30 hover:bg-[#FF7A00] transition-colors"
            >
              Get in Touch
            </Link>
            <Link
              href="/buttons"
              className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-sm transition-colors"
            >
              Explore Tactile Buttons →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
