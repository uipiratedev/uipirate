"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Input } from "@heroui/input";

import PageWrapper from "@/components/PageWrapper";
import GlassSurface from "@/components/GlassSurface";
import LetsTalkButton from "@/components/LetsTalkButton";
import { SearchIcon } from "@/components/icons";

export interface ProductItem {
  id: string;
  title: string;
  badge: string;
  badgeColor?: "orange" | "purple" | "blue" | "emerald";
  subtitle: string;
  description: string;
  category: "AI & Automation" | "Content & Publishing" | "Developer Tools" | "Micro-SaaS";
  metric: { label: string; value: string };
  features: string[];
  techStack: string[];
  primaryLink: string;
  primaryLinkText: string;
  secondaryLink?: string;
  secondaryLinkText?: string;
}

const PRODUCTS: ProductItem[] = [
  {
    id: "alfred-os",
    title: "Alfred OS",
    badge: "Enterprise Multi-Agent Platform",
    badgeColor: "purple",
    subtitle: "Autonomous AI Butler & 5-Agent Enterprise Workforce",
    description:
      "Pairs leading AI models with a specialized 5-agent architecture and deterministic safety policies. Automate complex customer conversations, ticket triage, and operational workflows safely with zero hallucinations.",
    category: "AI & Automation",
    metric: { label: "Architecture", value: "5 Focused Agents" },
    features: [
      "5-agent division of labor: Planner, Knowledge Researcher, Policy Checker, Monitor & Responder",
      "Deterministic safety engine: enforces business rules & blocks prompt injection before execution",
      "Predictable 2-call cost model: exactly 2 AI calls per query, preventing runaway loops",
      "Shadow DOM embed widget: instant chat + voice streaming with WCAG 2.1 AA compliance",
      "Production-ready single container: FastAPI, Temporal workflows, MongoDB, and OpenTelemetry",
    ],
    techStack: ["FastAPI", "Temporal", "MongoDB", "OpenTelemetry", "SSE Streaming"],
    primaryLink: "https://alfred.uipirate.com/",
    primaryLinkText: "Launch Alfred OS",
    secondaryLink: "https://cal.com/ui-pirate/15min",
    secondaryLinkText: "Schedule Architecture Review",
  },
  {
    id: "ai-voice-caller",
    title: "AI Voice Caller",
    badge: "Conversational Voice AI",
    badgeColor: "emerald",
    subtitle: "Autonomous Voice Agents for Scheduling, Front-Desk & Triage",
    description:
      "Human-grade conversational voice intelligence that answers incoming calls, books appointments, coordinates reschedules, and handles customer triage 24/7/365 with zero hold times or dropped calls.",
    category: "AI & Automation",
    metric: { label: "Voice Latency", value: "< 500ms" },
    features: [
      "Natural sub-500ms voice turnaround that sounds genuinely human without robotic delays",
      "Two-way calendar & EHR synchronization (Epic, Cerner, Athenahealth, Google Calendar, Outlook)",
      "Bilingual voice engine: native English & Spanish with automatic spoken language detection",
      "Automated post-call SMS confirmations and real-time double-booking prevention",
      "HIPAA & SOC2 ready with AES-256 encryption, call audit logs, and medical emergency escalation",
    ],
    techStack: ["WebSockets", "Streaming Audio", "NLU Engine", "Twilio / SIP", "EHR Connectors"],
    primaryLink: "https://aicalling.uipirate.com/",
    primaryLinkText: "Launch AI Voice Caller",
    secondaryLink: "https://cal.com/ui-pirate/15min",
    secondaryLinkText: "Book Live Demo",
  },
  {
    id: "cometCOS",
    title: "cometCOS",
    badge: "Enterprise AI Publishing Platform",
    badgeColor: "orange",
    subtitle: "Multi-Tenant Content Operating System & AI Publishing Engine",
    description:
      "A complete content platform built for high-output design and development teams. Multi-tenant CMS architecture with an integrated AI drafting studio, automated SEO schema generation, and zero-latency public Edge APIs.",
    category: "Content & Publishing",
    metric: { label: "Performance", value: "99+ Lighthouse" },
    features: [
      "Tenant-isolated editorial workspaces with custom domain binding",
      "AI workspace for drafting, tone adjustment & multi-channel repurposing",
      "Edge-cached public read API for instantaneous static and SSR sites",
      "Real-time view analytics with bot, duplicate, and crawler filtering",
      "Automated JSON-LD, OpenGraph & meta schema generation",
    ],
    techStack: ["Next.js 15", "PostgreSQL", "Tailwind CSS", "Edge API"],
    primaryLink: "https://cos.uipirate.com/",
    primaryLinkText: "Launch cometCOS",
    secondaryLink: "https://cos.uipirate.com/register",
    secondaryLinkText: "See Live in Production",
  },
];


const CATEGORIES = [
  "All",
  "AI & Automation",
  "Content & Publishing",
  "Developer Tools",
];

const badgeColors = {
  orange: "border-[#FF5B04]/30 bg-[#FF5B04]/10 text-[#FF5B04]",
  purple: "border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400",
  blue: "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400",
  emerald: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
};

export default function OurProductsScreen() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const isExternalUrl = (url: string) => url.startsWith("http");

  const filteredProducts = PRODUCTS.filter((item) => {
    const matchesCat =
      activeCategory === "All" || item.category === activeCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.techStack.some((tech) =>
        tech.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    return matchesCat && matchesSearch;
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
              linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px)
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
          <div className="text-center flex flex-col items-center mb-12 md:mb-16 px-4">
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

            <p className="sub-header max-w-3xl mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-300 font-jakarta leading-relaxed">
              Proprietary platforms, AI systems, and production engines designed,
              built, and operated by UI Pirate. Engineered for scale, zero hand-off
              friction, and proven in live production.
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 mt-10 w-full max-w-4xl p-6 rounded-2xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md border border-gray-200/80 dark:border-white/10 shadow-sm">
              <div className="flex flex-col items-center justify-center text-center">
                <span className="font-jetbrains text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
                  7+
                </span>
                <span className="text-xs uppercase tracking-wider font-medium text-gray-500 mt-1">
                  Active Systems
                </span>
              </div>
              <div className="flex flex-col items-center justify-center text-center border-l border-gray-200 dark:border-zinc-800">
                <span className="font-jetbrains text-2xl sm:text-3xl font-black text-[#FF5B04]">
                  100%
                </span>
                <span className="text-xs uppercase tracking-wider font-medium text-gray-500 mt-1">
                  In-House Built
                </span>
              </div>
              <div className="flex flex-col items-center justify-center text-center border-l max-sm:border-l-0 sm:border-l border-gray-200 dark:border-zinc-800">
                <span className="font-jetbrains text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
                  50+
                </span>
                <span className="text-xs uppercase tracking-wider font-medium text-gray-500 mt-1">
                  Shipped Projects
                </span>
              </div>
              <div className="flex flex-col items-center justify-center text-center border-l border-gray-200 dark:border-zinc-800">
                <span className="font-jetbrains text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
                  Enterprise
                </span>
                <span className="text-xs uppercase tracking-wider font-medium text-gray-500 mt-1">
                  Production Grade
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-24 relative z-10">

          {/* Search & Category Filter Controls */}
          <div className="max-w-4xl mx-auto mb-12 px-4 space-y-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-[#FF5B04]/5 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity" />
              <Input
                classNames={{
                  base: "max-w-full",
                  mainWrapper: "h-14 sm:h-16",
                  input: "text-base sm:text-lg px-4 font-geist",
                  inputWrapper:
                    "h-14 sm:h-16 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 focus-within:!border-[#FF5B04] shadow-sm transition-all duration-300",
                }}
                placeholder="Search products by name, capability, or tech stack..."
                radius="full"
                size="lg"
                startContent={<SearchIcon className="text-zinc-400 text-xl" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap justify-center items-center gap-2">
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat;

                return (
                  <button
                    key={cat}
                    className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${isActive
                      ? "bg-[#FF5B04] text-white shadow-md shadow-[#FF5B04]/25"
                      : "bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-zinc-800 hover:border-[#FF5B04]/40"
                      }`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
            {/* @ts-ignore - AnimatePresence type issue with React 19 / Next.js */}
            <AnimatePresence>
              {filteredProducts.map((product) => {
                const badgeStyle =
                  badgeColors[product.badgeColor || "orange"] ||
                  badgeColors.orange;
                const isPrimaryExternal = isExternalUrl(product.primaryLink);
                const isSecondaryExternal =
                  product.secondaryLink && isExternalUrl(product.secondaryLink);

                return (
                  <motion.div
                    key={product.id}
                    layout
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col justify-between rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#181818] border border-gray-200 dark:border-white/10 hover:border-[#FF5B04]/50 shadow-sm hover:shadow-xl hover:shadow-[#FF5B04]/10 transition-all duration-300 group"
                    exit={{ opacity: 0, scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                  >
                    <div>
                      {/* Top Bar: Badge & Metric */}
                      <div className="flex items-center justify-between gap-3 mb-5">
                        <span
                          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider font-jetbrains ${badgeStyle}`}
                        >
                          {product.badge}
                        </span>

                        <div className="flex items-center gap-1.5 text-right font-jetbrains">
                          <span className="text-xs text-gray-400">
                            {product.metric.label}:
                          </span>
                          <span className="text-xs font-bold text-gray-900 dark:text-white">
                            {product.metric.value}
                          </span>
                        </div>
                      </div>

                      {/* Title & Subtitle */}
                      <h2 className="text-2xl sm:text-3xl font-bold font-jakarta text-gray-900 dark:text-white group-hover:text-[#FF5B04] transition-colors duration-200">
                        {product.title}
                      </h2>
                      <p className="text-sm font-semibold text-[#FF5B04] mt-1 font-jakarta">
                        {product.subtitle}
                      </p>

                      <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 font-jakarta leading-relaxed">
                        {product.description}
                      </p>

                      {/* Feature Bullet Points */}
                      <div className="mt-6 pt-5 border-t border-dashed border-gray-200 dark:border-zinc-800">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 font-jetbrains mb-3">
                          Key Capabilities
                        </h3>
                        <ul className="space-y-2">
                          {product.features.map((feat, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300"
                            >
                              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#FF5B04] shrink-0" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Tech Stack Pills */}
                      <div className="mt-6 flex flex-wrap gap-1.5">
                        {product.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="px-2.5 py-1 text-[11px] font-mono rounded-md bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 pt-6 border-t border-gray-100 dark:border-zinc-800 flex flex-wrap items-center gap-3">
                      <Link
                        className="inline-flex items-center justify-center rounded-xl bg-black dark:bg-white text-white dark:text-black px-5 py-2.5 text-sm font-semibold hover:bg-[#FF5B04] dark:hover:bg-[#FF5B04] dark:hover:text-white transition-all duration-200 shadow-sm"
                        href={product.primaryLink}
                        {...(isPrimaryExternal
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
                        {product.primaryLinkText} &rarr;
                      </Link>

                      {product.secondaryLink && product.secondaryLinkText && (
                        <Link
                          className="inline-flex items-center justify-center rounded-xl border border-gray-300 dark:border-zinc-700 hover:border-[#FF5B04] px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-[#FF5B04] transition-all duration-200"
                          href={product.secondaryLink}
                          {...(isSecondaryExternal
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                        >
                          {product.secondaryLinkText}
                        </Link>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Bottom Value Section */}
          <div className="mt-24 rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-[#141414] to-[#202020] text-white relative overflow-hidden border border-white/10 shadow-2xl">
            <div className="relative z-10 max-w-3xl">
              <span className="inline-block text-xs uppercase tracking-widest font-jetbrains text-[#FF5B04] font-semibold mb-3">
                Why We Build In-House Products
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-jakarta leading-tight">
                We don&apos;t just design for others. We build, ship, and run real software.
              </h2>
              <p className="mt-4 text-gray-300 font-jakarta leading-relaxed text-sm sm:text-base">
                Most agencies produce Figma mockups and leave before the code is
                deployed. We test our design paradigms, component physics, and
                architectures on our own platforms first. When we build for you,
                you benefit from systems that are already running in production.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <LetsTalkButton
                  showArrow
                  href="https://cal.com/ui-pirate/15min"
                  variant="color"
                >
                  Book a Product Call
                </LetsTalkButton>

                <Link
                  className="px-5 py-3 rounded-full text-sm font-semibold text-white/90 hover:text-white border border-white/20 hover:border-white/40 transition-colors"
                  href="/case-studies"
                >
                  Explore Client Case Studies &rarr;
                </Link>
              </div>
            </div>

            {/* Decorative background glow */}
            <div className="absolute right-0 bottom-0 w-96 h-96 bg-[#FF5B04]/15 blur-3xl pointer-events-none rounded-full" />
          </div>
        </div>
    </PageWrapper>
  );
}
