"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import PageWrapper from "@/components/PageWrapper";
import GlassSurface from "@/components/GlassSurface";
import LetsTalkButton from "@/components/LetsTalkButton";

export interface KeyPoint {
  title: string;
  text: string;
}

export interface ProductItem {
  id: string;
  indexStr: string;
  title: string;
  badgeLetter: string;
  badge: string;
  badgeColor: "purple" | "emerald" | "orange" | "blue";
  subtitle: string;
  description: string;
  category: "AI & Automation" | "Content & Publishing" | "Developer Tools";
  keyPoints: KeyPoint[];
  primaryLink: string;
  primaryLinkText: string;
}

const PRODUCTS: ProductItem[] = [
  {
    id: "alfred-os",
    indexStr: "01",
    title: "Alfred OS",
    badgeLetter: "A",
    badge: "AI TEAM FOR YOUR BUSINESS",
    badgeColor: "purple",
    subtitle: "Your business, minus the busywork.",
    description:
      "An AI assistant for your customers and your team. It answers from your own information by chat or voice, looks things up in your systems, and waits for your OK before anything risky.",
    category: "AI & Automation",
    keyPoints: [
      {
        title: "Answers from your information",
        text: "Cited sources. No making things up.",
      },
      {
        title: "Acts before risky actions",
        text: "Refunds and changes follow your rules.",
      },
      {
        title: "Every step is traced",
        text: "Plan, rule checks, and replay—all visible.",
      },
    ],
    primaryLink: "https://alfred.uipirate.com/",
    primaryLinkText: "Explore Alfred",
  },
  {
    id: "ai-voice-caller",
    indexStr: "02",
    title: "AI Voice Caller",
    badgeLetter: "V",
    badge: "AI PHONE AGENT",
    badgeColor: "emerald",
    subtitle: "Never miss another call.",
    description:
      "An AI phone agent that answers calls, books appointments, and handles reschedules around the clock. Live today for healthcare clinics.",
    category: "AI & Automation",
    keyPoints: [
      {
        title: "Answers every call",
        text: "Day or night, zero hold time.",
      },
      {
        title: "Books into your calendar",
        text: "No double-booking.",
      },
      {
        title: "Works with your software",
        text: "No need to switch systems.",
      },
    ],
    primaryLink: "https://aicalling.uipirate.com/",
    primaryLinkText: "See it live",
  },
  {
    id: "cometCOS",
    indexStr: "03",
    title: "cometCOS",
    badgeLetter: "C",
    badge: "AI CONTENT OPERATING SYSTEM",
    badgeColor: "orange",
    subtitle: "A writing studio with AI inside it.",
    description:
      "Draft articles and ebooks in a real workspace, direct edits with an AI side panel, keep every version in a scrubbable timeline, and publish straight to your site—with zero token markup.",
    category: "Content & Publishing",
    keyPoints: [
      {
        title: "AI side panel, craft stays human",
        text: "Direct edits on selected text. You decide what stays.",
      },
      {
        title: "Ebooks & long-form workspace",
        text: "Chapter-aware context across 30k+ words. Export cleanly.",
      },
      {
        title: "Publish anywhere & BYOK",
        text: "1-click push to WordPress, Ghost, Medium, LinkedIn & Buffer.",
      },
    ],
    primaryLink: "https://cos.uipirate.com/",
    primaryLinkText: "Explore cometCOS",
  },
  {
    id: "medjourney",
    indexStr: "04",
    title: "MedJourney",
    badgeLetter: "M",
    badge: "PATIENT SUPPORT PROGRAM PLATFORM",
    badgeColor: "blue",
    subtitle: "Your patient support program, actually supporting patients.",
    description:
      "One unified platform for telecallers, doctors, labs, pharmacies, and pharma teams. Every role sees the patient they need, with automated refills and compliance built in.",
    category: "AI & Automation",
    keyPoints: [
      {
        title: "Unified patient timeline",
        text: "Calls, refills, orders, and lab results in one place.",
      },
      {
        title: "9 roles, 111 privileges",
        text: "Multi-org, regional zone scoping and strict access.",
      },
      {
        title: "HIPAA & DISHA aligned",
        text: "Integrated consent workflow and full audit trail.",
      },
    ],
    primaryLink: "https://psp.dev.uipirate.com/",
    primaryLinkText: "Explore MedJourney",
  },
];

const CATEGORIES = [
  { label: "All products", key: "All", count: "04" },
  { label: "AI & Automation", key: "AI & Automation", count: "03" },
  { label: "Content & Publishing", key: "Content & Publishing", count: "01" },
  { label: "Developer Tools", key: "Developer Tools", count: "00" },
];

const colorStyles = {
  purple: {
    letterBox: "border-purple-300 dark:border-purple-500/40 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400",
    badgeText: "text-purple-600 dark:text-purple-400",
    subtitle: "text-purple-600 dark:text-purple-400",
    checkBg: "bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400",
  },
  emerald: {
    letterBox: "border-emerald-300 dark:border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400",
    badgeText: "text-emerald-600 dark:text-emerald-400",
    subtitle: "text-emerald-600 dark:text-emerald-400",
    checkBg: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400",
  },
  orange: {
    letterBox: "border-[#FF5B04]/40 bg-[#FF5B04]/10 text-[#FF5B04]",
    badgeText: "text-[#FF5B04]",
    subtitle: "text-[#FF5B04]",
    checkBg: "bg-[#FF5B04]/15 text-[#FF5B04]",
  },
  blue: {
    letterBox: "border-blue-300 dark:border-blue-500/40 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400",
    badgeText: "text-blue-600 dark:text-blue-400",
    subtitle: "text-blue-600 dark:text-blue-400",
    checkBg: "bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400",
  },
};

export default function OurProductsScreen() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filteredProducts = PRODUCTS.filter((item) => {
    return activeCategory === "All" || item.category === activeCategory;
  });

  return (
    <PageWrapper showFloatingButton={false}>
      {/* Hero Section */}
      <div className="hero-wrapper">
        {/* Subtle Grid Background Pattern */}
        <div
          className="absolute pointer-events-none -mt-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0, 0, 0, 0.04) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 0, 0, 0.04) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            marginLeft: "calc(-50vw + 50%)",
          }}
        />
        {/* Layered gradient with gentle mist animation */}
        <div
          className="absolute pointer-events-none -mt-20"
          style={{
            backgroundImage: `
              linear-gradient(to top, rgba(250, 250, 250, 1), transparent 10%),
              linear-gradient(to top, rgba(250, 250, 250, 1) 0%, transparent 35%)
            `,
            animation: "gentle-mist 8s ease-in-out infinite",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            marginLeft: "calc(-50vw + 50%)",
          }}
        />

        <div
          className="flex flex-col items-center justify-center w-full relative z-10 section-container"
          style={{ overflow: "visible" }}
        >
          {/* Header Section */}
          <div className="text-center flex flex-col items-center mb-6 sm:mb-10 px-4">
            <GlassSurface
              backgroundOpacity={0.1}
              blueOffset={20}
              blur={11}
              borderRadius={12}
              borderWidth={0.01}
              brightness={50}
              className="md:my-9 max-md:my-5 !flex !flex-row !items-center !gap-3 isolate overflow-visible p-2 px-4 max-md:mx-2"
              displace={0.5}
              distortionScale={-180}
              forceLightMode={true}
              greenOffset={10}
              height="auto"
              opacity={0.93}
              redOffset={0}
              saturation={1}
              style={{
                animation: "trustBadgeUp 0.5s ease-out forwards",
                animationDelay: "0.1s",
                opacity: 0,
                transform: "translateY(20px) scale(0.95)",
              }}
              width="auto"
            >
              <div className="badge-text relative z-10 text-xs uppercase font-semibold tracking-wider font-jetbrains">
                In-House Systems & Platforms
              </div>
            </GlassSurface>

            <h1 className="hero-header text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
              Our <span className="text-[#FF5B04]">Products</span>
            </h1>

            <p className="sub-header max-w-2xl mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-300 font-jakarta leading-relaxed">
              Proprietary platforms, AI systems, and production engines designed,
              built, and operated by UI Pirate. Engineered for scale, zero hand-off
              friction, and proven in live production.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 relative z-10">
        {/* Top Floating Metrics Bar */}
        <div className="max-w-5xl mx-auto mb-16 sm:mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 rounded-3xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-gray-200/90 dark:border-white/10 shadow-sm overflow-hidden py-6 sm:py-8 px-4 sm:px-6">
            <div className="flex flex-col items-center justify-center text-center py-2">
              <span className="font-jetbrains text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                7+
              </span>
              <span className="text-[10px] sm:text-[11px] uppercase tracking-widest font-semibold text-gray-400 dark:text-zinc-500 mt-2 font-jetbrains">
                Active Systems
              </span>
            </div>

            <div className="flex flex-col items-center justify-center text-center py-2 border-l border-gray-200/80 dark:border-zinc-800">
              <span className="font-jetbrains text-3xl sm:text-4xl font-bold text-[#FF5B04]">
                100%
              </span>
              <span className="text-[10px] sm:text-[11px] uppercase tracking-widest font-semibold text-gray-400 dark:text-zinc-500 mt-2 font-jetbrains">
                In-House Built
              </span>
            </div>

            <div className="flex flex-col items-center justify-center text-center py-2 border-l max-md:border-l-0 md:border-l border-t max-md:border-t border-gray-200/80 dark:border-zinc-800 max-md:mt-4 md:mt-0">
              <span className="font-jetbrains text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                50+
              </span>
              <span className="text-[10px] sm:text-[11px] uppercase tracking-widest font-semibold text-gray-400 dark:text-zinc-500 mt-2 font-jetbrains">
                Shipped Projects
              </span>
            </div>

            <div className="flex flex-col items-center justify-center text-center py-2 border-l border-gray-200/80 dark:border-zinc-800 border-t max-md:border-t max-md:mt-4 md:mt-0">
              <span className="font-jetbrains text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                Enterprise
              </span>
              <span className="text-[10px] sm:text-[11px] uppercase tracking-widest font-semibold text-gray-400 dark:text-zinc-500 mt-2 font-jetbrains">
                Production Grade
              </span>
            </div>
          </div>
        </div>

        {/* Section Header: Left Title / Right Subtitle */}
        <div className="mb-10 sm:mb-12">
          <span className="block text-xs uppercase font-bold tracking-[0.2em] text-[#FF5B04] font-jetbrains mb-3">
            PRODUCT SUITE / 04
          </span>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-gray-900 dark:text-white font-jakarta">
              Systems that do the work.
            </h1>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-jakarta max-w-md md:text-right pb-1">
              Focused products, built around real operational bottlenecks.
            </p>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2.5 mb-10 sm:mb-12">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.key;

            return (
              <button
                key={cat.key}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-[#FF5B04] text-white shadow-sm"
                    : "bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-300 border border-gray-200/90 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700"
                }`}
                onClick={() => setActiveCategory(cat.key)}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] font-jetbrains px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Product Cards Stack */}
        <div className="flex flex-col gap-8">
          {/* @ts-ignore - AnimatePresence type issue with React 19 / Next.js */}
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => {
              const styles = colorStyles[product.badgeColor] || colorStyles.orange;
              const host = product.primaryLink.replace(/^https?:\/\//, "").replace(/\/$/, "");

              return (
                <motion.article
                  key={product.id}
                  layout
                  animate={{ opacity: 1, y: 0 }}
                  className="relative rounded-[28px] sm:rounded-3xl p-6 sm:p-8 md:p-10 bg-white dark:bg-[#151515] border border-gray-200/90 dark:border-white/10 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-300"
                  exit={{ opacity: 0, scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                >
                  {/* Card Index Indicator in top right */}
                  <span className="absolute top-6 sm:top-8 right-8 text-xs font-jetbrains text-gray-300 dark:text-zinc-600 hidden md:block">
                    {product.indexStr}
                  </span>

                  {/* Desktop Layout: Horizontal Grid */}
                  <div className="hidden lg:grid lg:grid-cols-12 gap-8 items-stretch">
                    {/* Left Column (Product Info): 4 cols */}
                    <div className="lg:col-span-4 flex flex-col justify-between pr-4">
                      <div>
                        {/* Top Letter Icon Badge + Text */}
                        <div className="flex items-center gap-2.5 mb-5">
                          <span
                            className={`w-6 h-6 rounded-md border flex items-center justify-center font-jetbrains text-xs font-bold ${styles.letterBox}`}
                          >
                            {product.badgeLetter}
                          </span>
                          <span
                            className={`text-[11px] font-bold uppercase tracking-wider font-jetbrains ${styles.badgeText}`}
                          >
                            {product.badge}
                          </span>
                        </div>

                        <h2 className="text-3xl font-bold font-jakarta text-gray-900 dark:text-white tracking-tight">
                          {product.title}
                        </h2>

                        <p className={`mt-1.5 text-sm font-semibold font-jakarta ${styles.subtitle}`}>
                          {product.subtitle}
                        </p>

                        <p className="mt-4 text-[13px] sm:text-sm text-gray-500 dark:text-gray-400 font-jakarta leading-relaxed">
                          {product.description}
                        </p>
                      </div>
                    </div>

                    {/* Middle 3 Highlight Columns: 6 cols (2 cols each) */}
                    <div className="lg:col-span-6 grid grid-cols-3">
                      {product.keyPoints.map((point, idx) => (
                        <div
                          key={point.title}
                          className="flex flex-col justify-between px-5 sm:px-6 border-l border-gray-200/70 dark:border-zinc-800"
                        >
                          <div>
                            {/* Step Number + Check Icon */}
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-xs font-jetbrains text-gray-400 dark:text-zinc-500">
                                0{idx + 1}
                              </span>
                              <span
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${styles.checkBg}`}
                              >
                                ✓
                              </span>
                            </div>

                            <h3 className="text-[14px] font-bold text-gray-900 dark:text-white font-jakarta leading-snug">
                              {point.title}
                            </h3>

                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed font-jakarta">
                              {point.text}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Right Column (CTA Button + Host): 2 cols */}
                    <div className="lg:col-span-2 flex flex-col items-end justify-center pl-4">
                      <LetsTalkButton
                        showArrow
                        href={product.primaryLink}
                        size="sm"
                        variant="dark"
                      >
                        {product.primaryLinkText}
                      </LetsTalkButton>

                      <span className="text-[11px] text-gray-400 dark:text-zinc-500 font-jetbrains mt-3 text-right">
                        {host}
                      </span>
                    </div>
                  </div>

                  {/* Mobile / Tablet Layout (Matching Screenshots 3 & 4) */}
                  <div className="lg:hidden flex flex-col gap-6">
                    {/* Top Identity */}
                    <div>
                      <div className="flex items-center gap-2.5 mb-4">
                        <span
                          className={`w-6 h-6 rounded-md border flex items-center justify-center font-jetbrains text-xs font-bold ${styles.letterBox}`}
                        >
                          {product.badgeLetter}
                        </span>
                        <span
                          className={`text-[11px] font-bold uppercase tracking-wider font-jetbrains ${styles.badgeText}`}
                        >
                          {product.badge}
                        </span>
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-bold font-jakarta text-gray-900 dark:text-white">
                        {product.title}
                      </h2>

                      <p className={`mt-1 text-sm font-semibold font-jakarta ${styles.subtitle}`}>
                        {product.subtitle}
                      </p>

                      <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 font-jakarta leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    {/* Highlights List with Horizontal Hairlines */}
                    <div className="border-t border-b border-gray-100 dark:border-zinc-800 py-4 flex flex-col divide-y divide-gray-100 dark:divide-zinc-800">
                      {product.keyPoints.map((point, idx) => (
                        <div key={point.title} className="py-4 first:pt-0 last:pb-0">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-jetbrains text-gray-400">
                              0{idx + 1}
                            </span>
                            <span
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${styles.checkBg}`}
                            >
                              ✓
                            </span>
                          </div>
                          <h3 className="text-sm font-bold text-gray-900 dark:text-white font-jakarta">
                            {point.title}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-jakarta">
                            {point.text}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Bottom CTA */}
                    <div>
                      <LetsTalkButton
                        fullWidth
                        showArrow
                        href={product.primaryLink}
                        variant="dark"
                      >
                        {product.primaryLinkText}
                      </LetsTalkButton>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Bottom Banner Section (Matching Screenshot) */}
        <div className="mt-20 sm:mt-24 rounded-[32px] p-8 sm:p-12 md:p-14 bg-[#131313] text-white relative overflow-hidden border border-white/10 shadow-2xl shadow-black/40">
          {/* Warm radial glow behind the badge on the right */}
          <div className="absolute right-[-5%] top-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-[radial-gradient(circle,_rgba(255,91,4,0.18)_0%,_rgba(255,91,4,0.06)_45%,_transparent_70%)] pointer-events-none rounded-full" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 relative z-10">
            {/* Left Copy & Actions */}
            <div className="max-w-2xl">
              <span className="block text-xs uppercase tracking-[0.2em] font-jetbrains text-[#FF5B04] font-bold mb-4">
                WHY WE BUILD IN-HOUSE PRODUCTS
              </span>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal font-jakarta leading-tight tracking-tight">
                We don&apos;t just design for others. We build, ship, and run real software.
              </h2>

              <p className="mt-5 text-gray-400 font-jakarta leading-relaxed text-sm sm:text-[15px] max-w-xl">
                Most agencies produce Figma mockups and leave before the code is
                deployed. We test our design paradigms, component physics, and
                architectures on our own platforms first.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <LetsTalkButton
                  showArrow
                  href="https://cal.com/ui-pirate/15min"
                  variant="color"
                >
                  Book a Product Call
                </LetsTalkButton>

                <LetsTalkButton
                  showArrow
                  href="/case-studies"
                  variant="dark"
                >
                  Explore Client Case Studies
                </LetsTalkButton>
              </div>
            </div>

            {/* Right Side Circular Badge Graphic (Matching Screenshot with Outer Solid Ring + Inner Dashed Ring + Tilted Text) */}
            <div className="flex items-center justify-center lg:pr-8">
              <div className="relative flex items-center justify-center w-48 h-48 sm:w-56 sm:h-56 rounded-full border border-white/10 bg-[#171413]/60 backdrop-blur-sm select-none shadow-2xl">
                {/* Inner Dashed Ring */}
                <div className="absolute inset-3 rounded-full border border-dashed border-zinc-600/70 pointer-events-none" />

                {/* Centered Typography with Tilted IN-HOUSE */}
                <div className="flex flex-col items-center justify-center text-center relative z-10">
                  <span className="text-[10px] sm:text-[11px] tracking-[0.25em] text-zinc-400 font-jetbrains">
                    BUILT
                  </span>
                  <span className="text-lg sm:text-xl font-black tracking-wider text-[#FF5B04] font-jetbrains my-1 transform -rotate-6">
                    IN-HOUSE
                  </span>
                  <span className="text-[9px] sm:text-[10px] tracking-[0.25em] text-zinc-500 font-jetbrains">
                    EST. 2022
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}


