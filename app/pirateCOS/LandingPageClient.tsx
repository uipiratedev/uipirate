"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { motion } from "framer-motion";

// --- Static constants moved outside component scope for performance ---
const heroTexts = {
  original: "To grow our audience, we should produce a lot of articles and put them on various websites so we get traffic.",
  pirate: "To amass a mighty crew of loyal followers, we must dispatch a fleet of swashbuckling articles across the digital seas and plunder organic traffic!",
  surgical: "To maximize organic acquisition, we must programmatically syndicate optimized content across key digital hubs to drive high-intent referral traffic.",
  punchy: "Syndicate high-quality content. Pillage formatting loops. Secure organic growth instantly.",
};

const mockArticles = [
  { id: 1, title: "SaaS Launch Strategy: The 30-Day Blueprint", goal: "Conversion", type: "Case Study", author: "captain@acme.dev", words: 1420 },
  { id: 2, title: "10 Tailwind CSS Layout Hacks for Dashboards", goal: "Traffic", type: "Tutorial", author: "scribe@acme.dev", words: 980 },
  { id: 3, title: "Decentralized Content Operations: Why Git Snaps Matter", goal: "Authority", type: "Whitepaper", author: "captain@acme.dev", words: 2100 },
  { id: 4, title: "How to Keep Tone Consistency Across Claude & ChatGPT", goal: "Authority", type: "Newsletter", author: "scribe@acme.dev", words: 1150 },
  { id: 5, title: "Syndication Setup: Connecting Ghost & Medium Safely", goal: "Traffic", type: "Tutorial", author: "scribe@acme.dev", words: 850 },
];

const faqs = [
  {
    q: "Is my API key stored securely?",
    a: "Yes. Your LLM provider API keys are encrypted at-rest using AES-256-GCM. They are only decryped in memory to sign your prompts and are never logged or stored by our services."
  },
  {
    q: "Do you charge extra markup on top of AI queries?",
    a: "No. pirateCOS uses a secure Bring Your Own Key (BYOK) setup. You only pay actual token usage costs directly to OpenAI, Claude, or Gemini with 0% platform markup."
  },
  {
    q: "What publishing platforms are currently supported?",
    a: "We natively support one-click syndication to WordPress, Ghost, Medium, and LinkedIn, as well as repurposing drawers for X (Twitter) threads."
  },
  {
    q: "Can I migrate from an individual to an organization account?",
    a: "Yes. The Team Setup Wizard inside your Profile settings converts your workspace namespace, transfers active draft histories, and invites members without any data loss."
  }
];

interface LandingPageProps {
  isSubdomain: boolean;
}

export default function LandingPageClient({ isSubdomain }: LandingPageProps) {
  // Tour State: active page tab
  const [activeTourPage, setActiveTourPage] = useState<
    "dashboard" | "posts" | "workspace" | "teams" | "ai-settings" | "profile" | "billing"
  >("workspace");

  // Mobile Navigation toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auth paths resolution based on props
  const loginUrl = isSubdomain ? "/login" : "/pirateCOS/login";
  const registerUrl = isSubdomain ? "/register" : "/pirateCOS/register";

  // --- Accessibility and Banner states ---
  const [bannerVisible, setBannerVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const dismissed = localStorage.getItem("piratecos_banner_dismissed");
      if (dismissed !== "true") {
        setBannerVisible(true);
      }
      
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }
  }, []);

  const dismissBanner = () => {
    setBannerVisible(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("piratecos_banner_dismissed", "true");
    }
  };

  // --- Interactive Feature States ---

  // 1. Hero AI Co-Pilot playground
  const [heroPrompt, setHeroPrompt] = useState<"pirate" | "surgical" | "punchy">("surgical");
  const [heroText, setHeroText] = useState("");
  const [isTyping, setIsTyping] = useState(false);


  useEffect(() => {
    const targetText = heroTexts[heroPrompt];
    if (prefersReducedMotion) {
      setHeroText(targetText);
      setIsTyping(false);
      return;
    }
    let active = true;
    setIsTyping(true);
    let index = 0;
    setHeroText("");

    const interval = setInterval(() => {
      if (!active) return;
      if (index < targetText.length) {
        setHeroText(targetText.substring(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 12);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [heroPrompt, prefersReducedMotion]);

  // 2. Content Library Filter Playground
  const [libraryFilter, setLibraryFilter] = useState<"all" | "Traffic" | "Conversion" | "Authority">("all");

  const filteredArticles = libraryFilter === "all"
    ? mockArticles
    : mockArticles.filter((art) => art.goal === libraryFilter);

  // 3. AI Config Key Test Playground
  const [keyTestStatus, setKeyTestStatus] = useState<"idle" | "testing" | "success">("idle");
  const handleTestKeys = () => {
    setKeyTestStatus("testing");
    setTimeout(() => {
      setKeyTestStatus("success");
    }, 1800);
  };

  // 4. Onboarding Steps Playground (Simulated Stepper)
  const [onboardingStep, setOnboardingStep] = useState<1 | 2 | 3>(1);

  // 5. Stripe Billing Credit Purchase Playground
  const [creditTier, setCreditTier] = useState<1 | 2 | 3>(2);
  const creditDetails = {
    1: { credits: 250, cost: 15, discount: 0, text: "Starter Pack" },
    2: { credits: 1000, cost: 45, discount: 25, text: "Popular Choice (Save 25%)" },
    3: { credits: 5000, cost: 150, discount: 40, text: "Publisher Fleet (Save 40%)" },
  };

  // 6. Interactive Brand Brain Playground
  const [selectedForbidden, setSelectedForbidden] = useState<string | null>(null);

  // 7. FAQ section toggle state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen text-gray-800 font-sans relative overflow-hidden bg-[#F7F7F6]">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(circle_at_top,_rgba(255,91,4,0.05)_0%,_transparent_60%)] pointer-events-none" />

      {/* Floating Announcement Banner */}
      {bannerVisible && (
        <div className="bg-gradient-to-r from-gray-900 via-[#FF5B04] to-gray-900 text-white text-center py-2 px-4 text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 relative z-50">
          <span className={`w-2 h-2 rounded-full bg-green-400 ${prefersReducedMotion ? "" : "animate-pulse"}`} />
          <span>New release: pirateCOS v2.0 is live with custom multi-channel syndication &amp; version tracking</span>
          <button
            onClick={dismissBanner}
            className="absolute right-4 text-white/70 hover:text-white transition-colors"
            aria-label="Dismiss banner"
          >
            <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Floating Header */}
      <header className="sticky top-4 z-40 mx-auto max-w-6xl rounded-2xl border border-black/[0.04] bg-white/75 backdrop-blur-lg px-6 py-3 shadow-glass-sm mt-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm" style={{ background: "#FF5B04" }}>
              <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 32 32" width="16">
                <path
                  clipRule="evenodd"
                  d="M17.648 10.13L15.878 7.026 7.03 22.55h3.498l7.12-12.42zm2.232 3.916l-1.77 3.152 1.284 2.253h-2.549l-1.74 3.099h9.622l-4.847-8.504z"
                  fill="white"
                  fillRule="evenodd"
                />
              </svg>
            </div>
            <a href="#top" className="text-gray-900 font-bold tracking-tight text-sm hover:opacity-80 transition-opacity">
              UI Pirate <span style={{ color: "#FF5B04" }}>pirateCOS</span>
            </a>
          </div>

          {/* Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-gray-500">
            <a href="#problems" className="hover:text-gray-900 transition-colors">The Challenge</a>
            <a href="#playground" className="hover:text-gray-900 transition-colors">AI Playground</a>
            <a href="#tour" className="hover:text-gray-900 transition-colors">App Tour</a>
            <a href="#value" className="hover:text-gray-900 transition-colors">Value Deck</a>
            <a href="#workspaces" className="hover:text-gray-900 transition-colors">Workspaces</a>
            <a href="#faq" className="hover:text-gray-900 transition-colors">FAQ</a>
          </nav>

          {/* Action BTNs (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <a href={loginUrl} className="text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors px-2 py-1">
              Log In
            </a>
            <Button
              as="a"
              href={registerUrl}
              className="h-9 font-bold text-xs text-white rounded-xl px-4 border border-[#FF5B04]/30 hover:border-[#FF5B04]/60 transition-all shadow-sm"
              style={{ background: "#FF5B04" }}
            >
              Start Free
            </Button>
          </div>

          {/* Mobile Hamburger menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex md:hidden w-8 h-8 flex-col justify-center items-center gap-1.5 p-1 text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className={`w-5 h-0.5 bg-current transition-all ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`w-5 h-0.5 bg-current transition-all ${mobileMenuOpen ? "opacity-0" : ""}`} />
            <span className={`w-5 h-0.5 bg-current transition-all ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="md:hidden mt-4 pt-4 border-t border-black/[0.04] space-y-3 flex flex-col pb-2"
          >
              <a
                href="#problems"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-bold text-gray-500 hover:text-gray-900 py-1"
              >
                The Challenge
              </a>
              <a
                href="#playground"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-bold text-gray-500 hover:text-gray-900 py-1"
              >
                AI Playground
              </a>
              <a
                href="#tour"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-bold text-gray-500 hover:text-gray-900 py-1"
              >
                App Tour
              </a>
              <a
                href="#value"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-bold text-gray-500 hover:text-gray-900 py-1"
              >
                Value Deck
              </a>
              <a
                href="#workspaces"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-bold text-gray-500 hover:text-gray-900 py-1"
              >
                Workspaces
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-bold text-gray-500 hover:text-gray-900 py-1"
              >
                FAQ
              </a>
              <div className="h-[1px] bg-black/[0.04] my-2" />
              <div className="flex items-center justify-between gap-4 pt-1">
                <a href={loginUrl} className="text-xs font-bold text-gray-500 hover:text-gray-900 py-2">
                  Log In
                </a>
                <Button
                  as="a"
                  href={registerUrl}
                  className="h-9 font-bold text-xs text-white rounded-xl px-4 flex items-center justify-center"
                  style={{ background: "#FF5B04" }}
                >
                  Start Free
                </Button>
              </div>
            </motion.div>
          )}
      </header>

      {/* Hero Section */}
      <section id="top" className="relative px-6 pt-16 pb-12 md:pt-24 md:pb-16 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-500/10 text-xs font-bold tracking-wider uppercase text-[#FF5B04]">
              <span className={`w-1.5 h-1.5 rounded-full bg-[#FF5B04] ${prefersReducedMotion ? "" : "animate-pulse"}`} />
              Banish formatting dread
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight leading-[1.08]">
              Stop copy-pasting draft files.<br />
              <span style={{ color: "#FF5B04" }}>Rule your publications.</span>
            </h1>

            <p className="text-sm md:text-base text-gray-500 leading-relaxed max-w-xl">
              Building a multi-channel content empire shouldn't make you a manual copy-paste robot. pirateCOS connects your brand brains, shapes selections surgically via AI co-pilots, and syndicates drafts to WordPress, Ghost, Medium, and LinkedIn in seconds.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center pt-2">
              <Button
                as="a"
                href={registerUrl}
                className="h-12 font-bold text-sm text-white rounded-xl px-8 shadow-md shadow-[#FF5B04]/10 transition-all hover:scale-[1.02] flex items-center justify-center"
                style={{ background: "#FF5B04" }}
              >
                Start Free Now
              </Button>
              <a
                href="#tour"
                className="h-12 inline-flex items-center justify-center font-bold text-sm text-gray-600 hover:text-gray-900 rounded-xl px-8 border border-black/[0.08] hover:border-black/20 transition-all bg-white shadow-sm"
              >
                Inspect App Pages
              </a>
            </div>
          </div>

          {/* Interactive Hero App Mockup */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-black/[0.06] shadow-glass p-5 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-black/[0.04] pb-3 mb-4">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
                <div className="px-2.5 py-0.5 bg-gray-50 border border-black/[0.04] text-[10px] font-mono text-gray-500 rounded">
                  cos.uipirate.com/editor
                </div>
              </div>

              {/* Editor Workspace mockup */}
              <div className="space-y-4">
                {/* Header widget */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest font-mono">TipTap Editor Pane</span>
                  <span className="px-2 py-0.5 bg-[#FF5B04]/10 text-[#FF5B04] text-xs font-bold rounded">
                    Score: 94/100
                  </span>
                </div>

                {/* Editor Content Area */}
                <div className="p-3 bg-[#F7F7F6]/50 rounded-xl border border-black/[0.03] space-y-2 min-h-[110px]">
                  <p className="text-xs font-bold text-gray-500">Original draft segment:</p>
                  <p className="text-xs text-gray-500 italic">
                    "{heroTexts.original}"
                  </p>
                  <div className="border-t border-dashed border-black/[0.06] pt-2 mt-2">
                    <p className="text-xs font-bold text-[#FF5B04] flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full bg-[#FF5B04] ${prefersReducedMotion ? "" : "animate-ping"}`} />
                      AI Co-Pilot suggestion applied:
                    </p>
                    <div className="text-xs text-gray-800 font-semibold mt-1 min-h-[44px]">
                      {heroText}
                      {isTyping && <span className={`inline-block w-1.5 h-3.5 bg-[#FF5B04] ml-0.5 ${prefersReducedMotion ? "" : "animate-pulse"}`} />}
                    </div>
                  </div>
                </div>

                {/* Preset Controls */}
                <div className="space-y-2">
                  <span className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Select Co-Pilot rewrite persona:</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      onClick={() => setHeroPrompt("surgical")}
                      className={`py-1.5 px-2 text-xs font-bold rounded-lg border transition-all ${
                        heroPrompt === "surgical"
                          ? "bg-gray-900 border-gray-900 text-white"
                          : "bg-white border-black/[0.06] text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      ⚡ Surgical/SEO
                    </button>
                    <button
                      onClick={() => setHeroPrompt("pirate")}
                      className={`py-1.5 px-2 text-xs font-bold rounded-lg border transition-all ${
                        heroPrompt === "pirate"
                          ? "bg-gray-900 border-gray-900 text-white"
                          : "bg-white border-black/[0.06] text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      🏴‍☠️ Pirate Mode
                    </button>
                    <button
                      onClick={() => setHeroPrompt("punchy")}
                      className={`py-1.5 px-2 text-xs font-bold rounded-lg border transition-all ${
                        heroPrompt === "punchy"
                          ? "bg-gray-900 border-gray-900 text-white"
                          : "bg-white border-black/[0.06] text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      📝 Short &amp; Punchy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof & Integration Logos Strip */}
      <section className="bg-white border-y border-black/[0.03] py-8 px-6 text-center">
        <div className="max-w-6xl mx-auto space-y-4">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
            Built by the UI Pirate team — Powering 12,000+ multi-channel publishes monthly
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-40 grayscale">
            <span className="font-black text-sm text-gray-600">WordPress</span>
            <span className="font-black text-sm text-gray-600">Ghost CMS</span>
            <span className="font-black text-sm text-gray-600">Medium</span>
            <span className="font-black text-sm text-gray-600">LinkedIn API</span>
            <span className="font-black text-sm text-gray-600">Buffer Hub</span>
          </div>
        </div>
      </section>

      {/* The Struggle Section */}
      <section id="problems" className="py-20 bg-white px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-black text-[#FF5B04] uppercase tracking-widest">We know the drill</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              Why traditional content operations break
            </h2>
            <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
              If your team publishes more than 5 articles a month, you are almost certainly fighting these frustrating manual workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Nightmare 1 */}
            <div className="p-6 bg-[#F7F7F6]/60 rounded-2xl border border-black/[0.04] transition-all hover:shadow-card hover:-translate-y-0.5 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/5 border border-red-500/10 flex items-center justify-center text-red-500">
                <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-gray-900">The Copy-Paste Formatting Trap</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  You draft in Google Docs. To publish, you copy text into WordPress or Ghost, fix linebreaks, download images, re-upload them, build custom layout cards, and then do the exact same process for LinkedIn and Medium. It's a tedious, repetitive chore.
                </p>
              </div>
            </div>

            {/* Nightmare 2 */}
            <div className="p-6 bg-[#F7F7F6]/60 rounded-2xl border border-black/[0.04] transition-all hover:shadow-card hover:-translate-y-0.5 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/5 border border-red-500/10 flex items-center justify-center text-red-500">
                <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-gray-900">AI Prompt Tonal Drift</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  You paste text into a general AI and ask for a quick edit. Instead of fixing paragraph 3, the AI changes your layout, swaps out target SEO keywords, dilutes your formatting, and introduces buzzwords you've explicitly banned.
                </p>
              </div>
            </div>

            {/* Nightmare 3 */}
            <div className="p-6 bg-[#F7F7F6]/60 rounded-2xl border border-black/[0.04] transition-all hover:shadow-card hover:-translate-y-0.5 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/5 border border-red-500/10 flex items-center justify-center text-red-500">
                <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-gray-900">Collaborating in the Blind Spot</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Three writers make edits in parallel. A crucial sentence gets replaced without approval. Since you have no sequential snapshot database or restore points, finding that specific edit is impossible.
                </p>
              </div>
            </div>

            {/* Nightmare 4 */}
            <div className="p-6 bg-[#F7F7F6]/60 rounded-2xl border border-black/[0.04] transition-all hover:shadow-card hover:-translate-y-0.5 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/5 border border-red-500/10 flex items-center justify-center text-red-500">
                <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4" />
                </svg>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-gray-900">BYOK: The Arbitrary AI Markup</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  SaaS products charge a hefty subscription markup on top of AI usage. pirateCOS features secure BYOK (Bring Your Own Key) configuration so you pay standard provider API costs without markup.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Brain & Content Safety Sandbox */}
      <section id="playground" className="py-20 px-6 max-w-6xl mx-auto">
        <div className="bg-white border border-black/[0.06] rounded-3xl p-6 md:p-10 shadow-glass space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Copy */}
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-black text-[#FF5B04] uppercase tracking-widest">Brand Brain Engine</span>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight leading-tight">
                Block forbidden vocabulary automatically
              </h2>
              <p className="text-xs text-gray-500 leading-relaxed">
                Define banned words and expressions globally. Our editor reads selections, alerts authors immediately, and offers suggestions to maintain compliance.
              </p>
              <div className="pt-2 space-y-2">
                <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Common Forbidden Buzzwords:</span>
                <div className="flex flex-wrap gap-1.5">
                  {["revolutionize", "delve", "testament", "tapestry", "game changer"].map((word) => (
                    <button
                      key={word}
                      onClick={() => setSelectedForbidden(word)}
                      className={`px-2 py-1 text-xs font-bold rounded-lg border transition-all ${
                        selectedForbidden === word
                          ? "bg-red-50 border-red-500/20 text-red-600 font-extrabold"
                          : "bg-[#F7F7F6] border-black/[0.04] text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Simulated Live Interface */}
            <div className="lg:col-span-7 bg-[#F7F7F6]/80 border border-black/[0.04] rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-black/[0.04] pb-2 text-xs font-mono font-bold text-gray-500">
                <span>Active Guidelines Checker</span>
                <span className="text-[#FF5B04]">Engine: Your connected LLM provider</span>
              </div>

              {selectedForbidden ? (
                <div className="space-y-3">
                  <div className="p-3 bg-red-500/5 border border-red-500/10 text-red-600 rounded-xl text-xs flex gap-3">
                    <svg aria-hidden="true" className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <span className="font-bold">Vocabulary Alert:</span> The forbidden word <span className="font-mono bg-red-100 px-1 rounded">"{selectedForbidden}"</span> was detected in your draft.
                    </div>
                  </div>
                  <div className="p-3.5 bg-white border border-black/[0.03] rounded-xl text-xs space-y-2">
                    <p className="text-xs font-bold text-gray-500 uppercase">Suggested Alternatives:</p>
                    <div className="flex gap-2">
                      {selectedForbidden === "revolutionize" && (
                        <>
                          <button onClick={() => setSelectedForbidden(null)} className="px-2 py-1 bg-green-50 hover:bg-green-100 text-green-600 border border-green-500/10 font-bold rounded-lg transition-all">Replace with: "transform"</button>
                          <button onClick={() => setSelectedForbidden(null)} className="px-2 py-1 bg-green-50 hover:bg-green-100 text-green-600 border border-green-500/10 font-bold rounded-lg transition-all">Replace with: "modernize"</button>
                        </>
                      )}
                      {selectedForbidden === "delve" && (
                        <>
                          <button onClick={() => setSelectedForbidden(null)} className="px-2 py-1 bg-green-50 hover:bg-green-100 text-green-600 border border-green-500/10 font-bold rounded-lg transition-all">Replace with: "explore"</button>
                          <button onClick={() => setSelectedForbidden(null)} className="px-2 py-1 bg-green-50 hover:bg-green-100 text-green-600 border border-green-500/10 font-bold rounded-lg transition-all">Replace with: "examine"</button>
                        </>
                      )}
                      {selectedForbidden !== "revolutionize" && selectedForbidden !== "delve" && (
                        <button onClick={() => setSelectedForbidden(null)} className="px-2 py-1 bg-green-50 hover:bg-green-100 text-green-600 border border-green-500/10 font-bold rounded-lg transition-all">Remove word</button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 py-4 text-center">
                  <div className="w-10 h-10 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center mx-auto mb-2">
                    <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-800 font-bold">No Forbidden Words Detected</p>
                  <p className="text-xs text-gray-500">Click on any buzzword on the left to see the editor warning system in action.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* App Tour Section */}
      <section id="tour" className="py-20 px-6 max-w-6xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-black text-[#FF5B04] uppercase tracking-widest">App Walkthrough</span>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
            Tour the actual pages inside the app
          </h2>
          <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
            We don't build generic mockups. pirateCOS features actual workspaces designed to refine and distribute your content strategy.
          </p>
        </div>

        {/* Tab List */}
        <div role="tablist" className="flex flex-wrap items-center justify-center gap-1.5 max-w-5xl mx-auto p-1.5 bg-white border border-black/[0.04] rounded-2xl shadow-glass-sm font-sans font-bold">
          {([
            { id: "dashboard", label: "Dashboard" },
            { id: "posts", label: "Content Library" },
            { id: "workspace", label: "Editor & Co-Pilot" },
            { id: "teams", label: "Teams" },
            { id: "ai-settings", label: "AI Config" },
            { id: "profile", label: "My Profile" },
            { id: "billing", label: "Stripe Billing" },
          ] as const).map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTourPage === tab.id}
              onClick={() => setActiveTourPage(tab.id)}
              className={`py-2 px-3.5 text-xs font-bold rounded-xl transition-all ${
                activeTourPage === tab.id
                  ? "bg-gray-900 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-950"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tour Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Details (Col Span 5) */}
          <div className="lg:col-span-5 bg-white border border-black/[0.04] p-8 rounded-3xl shadow-glass-sm flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-black text-[#FF5B04] uppercase tracking-widest font-mono">
                CURRENT ROUTE: {activeTourPage === "workspace" ? "/pirateCOS/posts/create" : `/pirateCOS/${activeTourPage}`}
              </span>

              {activeTourPage === "dashboard" && (
                <>
                  <h3 className="text-xl font-bold text-gray-900">Workflows Dashboard</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Your central command dashboard. Track draft pipelines, monitor active publication integrations, and review global workspace engagement metrics.
                  </p>
                  <ul className="space-y-2 text-xs text-gray-600 pt-2">
                    <li className="flex gap-2 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B04]" />
                      Pipeline logs for multi-channel publish statuses.
                    </li>
                    <li className="flex gap-2 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B04]" />
                      Rapid-draft wizard launch trigger.
                    </li>
                  </ul>
                </>
              )}

              {activeTourPage === "posts" && (
                <>
                  <h3 className="text-xl font-bold text-gray-900">Content Library</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Search and index all drafts. Sort dynamically using Content Goals (Traffic, Conversion, Authority) or type classification tags.
                  </p>
                  <ul className="space-y-2 text-xs text-gray-600 pt-2">
                    <li className="flex gap-2 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B04]" />
                      Filtered results load instantly.
                    </li>
                    <li className="flex gap-2 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B04]" />
                      Track post duplicates, deletes, and ownership.
                    </li>
                  </ul>
                </>
              )}

              {activeTourPage === "workspace" && (
                <>
                  <h3 className="text-xl font-bold text-gray-900">Editor Workspace</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    A beautiful inline editor paired with an AI co-pilot widget. Build keyword tags, run regex surgical rewrites, and configure live syndication drafts.
                  </p>
                  <ul className="space-y-2 text-xs text-gray-600 pt-2">
                    <li className="flex gap-2 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B04]" />
                      <strong>Time Machine:</strong> Save and restore versions.
                    </li>
                    <li className="flex gap-2 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B04]" />
                      <strong>Social Repurposer:</strong> Transform articles to X/LinkedIn posts.
                    </li>
                  </ul>
                </>
              )}

              {activeTourPage === "teams" && (
                <>
                  <h3 className="text-xl font-bold text-gray-900">Teams &amp; Crew Invites</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Manage workspace access. Invite collaborators by email and enforce clear team roles (org-admin, admin, editor, viewer).
                  </p>
                  <ul className="space-y-2 text-xs text-gray-600 pt-2">
                    <li className="flex gap-2 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B04]" />
                      Fine-grained tenant boundaries.
                    </li>
                    <li className="flex gap-2 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B04]" />
                      Team-specific Brand Brain guidelines.
                    </li>
                  </ul>
                </>
              )}

              {activeTourPage === "ai-settings" && (
                <>
                  <h3 className="text-xl font-bold text-gray-900">AI Config &amp; BYOK</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Encrypt keys securely. Use Claude, OpenAI, Gemini, or Mistral keys directly without paying subscription markups on credits.
                  </p>
                  <ul className="space-y-2 text-xs text-gray-600 pt-2">
                    <li className="flex gap-2 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B04]" />
                      Secure client-side decryption setup.
                    </li>
                    <li className="flex gap-2 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B04]" />
                      Verify credential endpoints instantly.
                    </li>
                  </ul>
                </>
              )}

              {activeTourPage === "profile" && (
                <>
                  <h3 className="text-xl font-bold text-gray-900">Profile &amp; Onboarding</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Manage avatar uploads, switch organization namespaces, or trigger the Team Setup Wizard prototype to transition from solo to team workspace.
                  </p>
                  <ul className="space-y-2 text-xs text-gray-600 pt-2">
                    <li className="flex gap-2 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B04]" />
                      3-Step inline conversion wizard model.
                    </li>
                    <li className="flex gap-2 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B04]" />
                      Profile details synced via Cloudinary.
                    </li>
                  </ul>
                </>
              )}

              {activeTourPage === "billing" && (
                <>
                  <h3 className="text-xl font-bold text-gray-900">Stripe Billing Pane</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Review and buy extra credit packs securely. Our integrations hook straight into Stripe Checkout for immediate credit delivery.
                  </p>
                  <ul className="space-y-2 text-xs text-gray-600 pt-2">
                    <li className="flex gap-2 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B04]" />
                      Secured tenant scope check.
                    </li>
                    <li className="flex gap-2 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B04]" />
                      Scale packages dynamically with tier discounts.
                    </li>
                  </ul>
                </>
              )}
            </div>

            <a
              href={registerUrl}
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-black text-[#FF5B04] hover:underline"
            >
              Start Free &amp; Access Dashboard
              <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Interactive Screen Display (Col Span 7) */}
          <div className="lg:col-span-7 bg-white border border-black/[0.04] p-6 rounded-3xl shadow-glass flex flex-col justify-between relative overflow-hidden min-h-[360px]">
            {activeTourPage === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 w-full"
              >
                <div className="flex justify-between items-center border-b border-black/[0.04] pb-2">
                  <span className="text-xs font-bold text-gray-500 uppercase font-sans">Syndication Status Log</span>
                  <span className="text-[11px] font-mono text-gray-500 font-bold">Total: 4 active channels</span>
                </div>

                <div className="space-y-2">
                  {[
                    { title: "Product Announcement post", tag: "WordPress", color: "bg-emerald-50 text-emerald-700 border-emerald-500/10", label: "Published" },
                    { title: "How We Scaled Our TipTap Engine", tag: "LinkedIn", color: "bg-blue-50 text-blue-700 border-blue-500/10", label: "Synced to Buffer" },
                    { title: "AI Voice Guidelines 101", tag: "Ghost", color: "bg-yellow-50 text-yellow-700 border-yellow-500/10", label: "Scheduled for 6 PM" },
                    { title: "Designing the Perfect Light UI", tag: "Medium", color: "bg-gray-100 text-gray-700 border-black/[0.04]", label: "Draft Saved" },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center bg-[#F7F7F6]/50 p-2.5 rounded-xl border border-black/[0.03]">
                      <div>
                        <div className="font-bold text-xs text-gray-800">{item.title}</div>
                        <div className="text-[11px] text-gray-500">Channel: {item.tag}</div>
                      </div>
                      <span className={`px-2 py-0.5 border text-[10px] font-bold rounded-md ${item.color}`}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTourPage === "posts" && (
              <motion.div
                key="posts"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 w-full"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-500 uppercase font-sans">Interactive Filter Demo</span>
                  <div className="flex gap-1">
                    {(["all", "Traffic", "Conversion", "Authority"] as const).map((goal) => (
                      <button
                        key={goal}
                        onClick={() => setLibraryFilter(goal)}
                        className={`px-2 py-1 text-[11px] font-bold rounded-lg border transition-all ${
                          libraryFilter === goal
                            ? "bg-gray-900 border-gray-900 text-white"
                            : "bg-[#F7F7F6] border-black/[0.03] text-gray-500 hover:text-gray-900"
                        }`}
                      >
                        {goal}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                  {filteredArticles.map((art) => (
                    <div key={art.id} className="flex justify-between items-center bg-white border border-black/[0.04] p-3 rounded-xl shadow-sm hover:border-black/10 transition-all">
                      <div>
                        <div className="font-bold text-xs text-gray-800">{art.title}</div>
                        <div className="text-[11px] text-gray-500">{art.author} • {art.words} words • {art.type}</div>
                      </div>
                      <span className="px-2 py-0.5 bg-orange-50 text-[#FF5B04] border border-[#FF5B04]/10 text-[10px] font-bold rounded-md">
                        {art.goal}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTourPage === "workspace" && (
              <motion.div
                key="workspace"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 w-full"
              >
                <div className="flex gap-1.5 items-center border-b border-black/[0.03] pb-2 text-xs text-gray-500 font-bold">
                  <span className="px-1.5 py-0.5 bg-[#F7F7F6] border border-black/[0.03] rounded">B</span>
                  <span className="px-1.5 py-0.5 bg-[#F7F7F6] border border-black/[0.03] rounded italic">I</span>
                  <span className="px-1.5 py-0.5 bg-[#F7F7F6] border border-black/[0.03] rounded font-mono">&lt;&gt;</span>
                  <div className="h-4 w-[1px] bg-black/[0.08]" />
                  <span>Focus Keyword: <strong className="text-green-600">SaaS operations</strong></span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-white border border-black/[0.04] rounded-xl shadow-sm">
                    <p className="text-xs text-gray-800 leading-relaxed font-sans">
                      "We shipped the first feature iteration in 30 days. To do this, our developers leveraged a clean component setup and structured their API endpoints cleanly."
                    </p>
                    <div className="mt-2 border-t border-dashed border-black/[0.05] pt-2 flex justify-between items-center text-xs text-gray-500">
                      <span>Selected segment: "first feature iteration"</span>
                      <span className="text-[#FF5B04] font-bold font-sans">⚡ Surgical Edit Target</span>
                    </div>
                  </div>

                  <div className="p-3 bg-orange-50 border border-orange-500/10 text-[#FF5B04] rounded-xl flex items-center justify-between text-xs font-sans">
                    <div>
                      <span className="font-bold">Co-Pilot Suggestion:</span> Replace with <span className="font-mono bg-orange-100 px-1.5 rounded">"initial MVP"</span>?
                    </div>
                    <button className="px-2 py-1 bg-[#FF5B04] text-white rounded-lg text-xs font-bold shadow-sm">Apply</button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTourPage === "teams" && (
              <motion.div
                key="teams"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 w-full"
              >
                <div className="flex justify-between items-center text-xs text-gray-500 border-b border-black/[0.03] pb-2 font-bold font-sans">
                  <span>Collaborator Email</span>
                  <span>Access Role</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center bg-[#F7F7F6]/50 p-3 border border-black/[0.03] rounded-xl">
                    <div>
                      <div className="font-bold text-xs text-gray-800">captain@acme.dev</div>
                      <span className="text-[11px] font-mono text-gray-500 font-bold">Workspace creator</span>
                    </div>
                    <span className="px-2 py-0.5 bg-orange-50 text-[#FF5B04] border border-[#FF5B04]/20 text-xs font-bold rounded-full font-sans">org-admin</span>
                  </div>

                  <div className="flex justify-between items-center bg-[#F7F7F6]/50 p-3 border border-black/[0.03] rounded-xl">
                    <div>
                      <div className="font-bold text-xs text-gray-800">scribe@acme.dev</div>
                      <span className="text-[11px] font-mono text-gray-500 font-bold">Can manage integrations</span>
                    </div>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-200/20 text-xs font-bold rounded-full font-sans">admin</span>
                  </div>

                  <div className="flex justify-between items-center bg-[#F7F7F6]/50 p-3 border border-black/[0.03] rounded-xl">
                    <div>
                      <div className="font-bold text-xs text-gray-800">writer@acme.dev</div>
                      <span className="text-[11px] font-mono text-gray-500 font-bold">Can write and edit drafts</span>
                    </div>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-500 border border-black/[0.04] text-xs font-bold rounded-full font-sans">editor</span>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTourPage === "ai-settings" && (
              <motion.div
                key="ai-settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 w-full"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-white p-3 border border-black/[0.03] rounded-xl shadow-sm">
                    <div>
                      <div className="font-bold text-xs text-gray-800 font-sans">Claude Key Endpoint</div>
                      <div className="text-[11px] text-gray-500">••••••••••••••••••••••••••••</div>
                    </div>
                    <span className="text-green-600 font-bold text-xs flex items-center gap-1 font-sans">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      Connected
                    </span>
                  </div>

                  <div className="flex justify-between items-center bg-white p-3 border border-black/[0.03] rounded-xl shadow-sm">
                    <div>
                      <div className="font-bold text-xs text-gray-800 font-sans">OpenAI Key Endpoint</div>
                      <div className="text-[11px] text-gray-500">••••••••••••••••••••••••••••</div>
                    </div>
                    <span className="text-green-600 font-bold text-xs flex items-center gap-1 font-sans">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      Connected
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-gray-500 font-sans bg-gray-50 p-2 rounded-lg border border-black/[0.03]">
                  <svg aria-hidden="true" className="w-3.5 h-3.5 text-[#FF5B04] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0-6V9m0 12a9 9 0 110-18 9 9 0 010 18z" />
                  </svg>
                  <span>Keys are encrypted client-side using AES-256-GCM. We never log prompts.</span>
                </div>

                <div className="pt-2 flex items-center justify-between font-sans">
                  <button
                    onClick={handleTestKeys}
                    disabled={keyTestStatus === "testing"}
                    className="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold shadow-sm transition-all hover:bg-gray-800"
                  >
                    {keyTestStatus === "idle" && "Test Credentials"}
                    {keyTestStatus === "testing" && "Validating Endpoint..."}
                    {keyTestStatus === "success" && "Endpoints OK!"}
                  </button>
                  {keyTestStatus === "testing" && (
                    <span className={`text-xs text-gray-500 font-bold ${prefersReducedMotion ? "" : "animate-pulse"}`}>Running secure provider calls...</span>
                  )}
                  {keyTestStatus === "success" && (
                    <span className="text-xs text-green-600 font-bold">✓ Decryption check passed</span>
                  )}
                </div>
              </motion.div>
            )}

            {activeTourPage === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 w-full"
              >
                {/* Step indicators */}
                <div className="flex justify-between items-center border-b border-black/[0.03] pb-2.5 font-sans">
                  <span className="text-xs font-bold text-gray-500 uppercase">Wizard Prototype Setup</span>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3].map((step) => (
                      <div
                        key={step}
                        className={`w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center transition-all ${
                          onboardingStep === step
                            ? "bg-[#FF5B04] text-white"
                            : onboardingStep > step
                            ? "bg-green-500 text-white"
                            : "bg-gray-100 text-gray-450"
                        }`}
                      >
                        {step}
                      </div>
                    ))}
                  </div>
                </div>

                {onboardingStep === 1 && (
                  <div className="space-y-3 font-sans">
                    <div className="text-xs font-bold text-gray-800">Step 1: Set Organisation Identity</div>
                    <p className="text-xs text-gray-500 leading-normal">
                      Convert your personal workspace namespace. Setting this builds a parent tenant scope.
                    </p>
                    <input
                      type="text"
                      placeholder="e.g. UI Pirate Dev Team"
                      className="w-full p-2.5 text-xs bg-gray-50 border border-black/[0.05] rounded-xl focus:outline-none"
                    />
                  </div>
                )}

                {onboardingStep === 2 && (
                  <div className="space-y-3 font-sans">
                    <div className="text-xs font-bold text-gray-800">Step 2: Workspace Guidelines</div>
                    <p className="text-xs text-gray-500 leading-normal">
                      Configure baseline guidelines, focus target limits, and shared BYOK options.
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 border border-[#FF5B04]/20 rounded-xl bg-orange-50/10 text-center">
                        <span className="block text-xs font-bold text-[#FF5B04]">Solo Writer</span>
                      </div>
                      <div className="p-2 border border-black/[0.04] rounded-xl text-center bg-gray-50">
                        <span className="block text-xs text-gray-500">Shared/Agency</span>
                      </div>
                    </div>
                  </div>
                )}

                {onboardingStep === 3 && (
                  <div className="space-y-3 font-sans">
                    <div className="text-xs font-bold text-gray-800">Step 3: Generate Invite Tokens</div>
                    <p className="text-xs text-gray-500 leading-normal">
                      Generate email invite tokens for team writers. You can assign roles beforehand.
                    </p>
                    <div className="p-2 bg-gray-50 border border-dashed border-black/[0.06] rounded-xl text-xs font-mono text-gray-500 truncate">
                      cos.uipirate.com/invite/tok_org_987x
                    </div>
                  </div>
                )}

                <div className="pt-2 flex justify-end font-sans">
                  <button
                    onClick={() => setOnboardingStep((prev) => (prev === 3 ? 1 : (prev + 1) as 1 | 2 | 3))}
                    className="px-3.5 py-1.5 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold rounded-xl shadow-sm"
                  >
                    {onboardingStep === 3 ? "Reset Demo" : "Next Step"}
                  </button>
                </div>
              </motion.div>
            )}

            {activeTourPage === "billing" && (
              <motion.div
                key="billing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 w-full"
              >
                <div className="flex justify-between items-center font-sans">
                  <span className="text-xs font-bold text-gray-500 uppercase">Stripe Credit Packs</span>
                  <span className="text-xs text-[#FF5B04] font-bold font-sans">{creditDetails[creditTier].text}</span>
                </div>

                {/* Pricing slider visualization */}
                <div className="p-4 bg-[#F7F7F6] border border-black/[0.03] rounded-2xl text-center space-y-3 font-sans">
                  <div className="text-2xl font-black text-gray-900">
                    +{creditDetails[creditTier].credits} Credits
                  </div>
                  <div className="text-xs font-bold text-gray-500">
                    One-time charge of <span className="text-gray-900 font-extrabold">${creditDetails[creditTier].cost}.00</span>
                  </div>

                  {/* Selector tabs */}
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    {([1, 2, 3] as const).map((tier) => (
                      <button
                        key={tier}
                        onClick={() => setCreditTier(tier)}
                        className={`py-2 px-1 text-xs font-bold rounded-xl border transition-all ${
                          creditTier === tier
                            ? "bg-white border-[#FF5B04] text-[#FF5B04] shadow-sm font-extrabold"
                            : "bg-[#F7F7F6] border-black/[0.04] text-gray-400"
                        }`}
                      >
                        {tier === 1 && "250 Credits"}
                        {tier === 2 && "1,000 Credits"}
                        {tier === 3 && "5,000 Credits"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs font-sans">
                  <span className="text-gray-500 font-bold uppercase font-sans">SECURED BY STRIPE</span>
                  <button className="px-3.5 py-1.5 bg-[#FF5B04] text-white rounded-xl font-bold shadow-sm font-sans">
                    Purchase Credits
                  </button>
                </div>
              </motion.div>
            )}

            {/* Bottom Actions Link */}
            <div className="mt-6 border-t border-black/[0.04] pt-3 flex justify-between items-center">
              <span className="text-xs text-gray-500 font-bold font-mono">WORKSPACE LIVE DEMO</span>
              <a href={registerUrl} className="text-xs font-bold text-[#FF5B04] hover:underline flex items-center gap-0.5 font-sans">
                Start Free &amp; Access Dashboard
                <svg aria-hidden="true" className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* The Story / Value Section */}
      <section id="value" className="py-20 bg-white border-y border-black/[0.03] px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3 font-sans">
            <span className="text-xs font-black text-[#FF5B04] uppercase tracking-widest font-sans">How it works</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              A content publishing strategy that just scales
            </h2>
            <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
              We built pirateCOS to support writers who want high speed without losing compliance, voice consistency, or editing safety.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Value 1 */}
            <div className="bg-[#F7F7F6]/60 border border-black/[0.03] p-6 rounded-2xl space-y-4">
              <div className="w-10 h-10 rounded-xl bg-orange-500/5 border border-orange-500/10 flex items-center justify-center text-[#FF5B04]">
                <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-gray-900">10+ Hours Saved Weekly</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Publishing is streamlined. Once your draft segment is ready, select target platforms and distribute with a single click. Keep formatting perfectly aligned automatically.
              </p>
            </div>

            {/* Value 2 */}
            <div className="bg-[#F7F7F6]/60 border border-black/[0.03] p-6 rounded-2xl space-y-4">
              <div className="w-10 h-10 rounded-xl bg-orange-500/5 border border-orange-500/10 flex items-center justify-center text-[#FF5B04]">
                <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.952 11.952 0 01-5.618-4.016A11.973 11.973 0 003.75 6V10c0 5.523 4.477 10 10 10s10-4.477 10-10V6a11.973 11.973 0 00-3.082-4.016z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-gray-900">Total Brand Control</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                No matter if writers use GPT-4, Claude, or write manually, the guidelines checker warns against banned buzzwords, readability drift, and tone inconsistency.
              </p>
            </div>

            {/* Value 3 */}
            <div className="bg-[#F7F7F6]/60 border border-black/[0.03] p-6 rounded-2xl space-y-4">
              <div className="w-10 h-10 rounded-xl bg-orange-500/5 border border-orange-500/10 flex items-center justify-center text-[#FF5B04]">
                <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-gray-900">Version Snaps History</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Save version snaps in our database. Highlight differences inline and roll back to past drafts in one click, keeping your work safe from unexpected mistakes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Workspaces / Account Onboarding Section */}
      <section id="workspaces" className="py-20 px-6 max-w-6xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3 font-sans">
          <span className="text-xs font-black text-[#FF5B04] uppercase tracking-widest font-sans">Account Models &amp; Scope</span>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Flexible account models</h2>
          <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
            Start as an individual creator and convert to a team workspace seamlessly with no data migration overhead.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Solo */}
          <div className="bg-white border border-black/[0.05] rounded-3xl p-8 flex flex-col justify-between shadow-glass-sm font-sans">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-base font-extrabold text-gray-900">Individual Workspace</h3>
                  <p className="text-xs text-gray-500 mt-1">For creators, writers, and solo founders</p>
                  <div className="text-lg font-black text-gray-900 mt-2">Free (BYOK)</div>
                </div>
                <span className="px-2 py-0.5 bg-gray-100 border border-black/[0.05] text-[10px] text-gray-600 font-bold rounded-md font-sans">
                  Individual
                </span>
              </div>

              <ul className="text-xs text-gray-600 space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <svg aria-hidden="true" className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  Single Brand Brain guidelines profile.
                </li>
                <li className="flex items-center gap-2">
                  <svg aria-hidden="true" className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  Access to SEO focus tools &amp; formatting checkers.
                </li>
                <li className="flex items-center gap-2">
                  <svg aria-hidden="true" className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  Full version snaps &amp; restore database logs.
                </li>
                <li className="flex items-center gap-2">
                  <svg aria-hidden="true" className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  BYOK API credential storage.
                </li>
              </ul>
            </div>

            <Button
              as="a"
              href={registerUrl}
              className="w-full h-11 font-bold text-xs text-gray-700 bg-[#F7F7F6] border border-black/[0.06] hover:bg-gray-100 transition-all rounded-xl"
            >
              Start Free — Individual
            </Button>
          </div>

          {/* Org */}
          <div className="bg-white border border-[#FF5B04]/30 rounded-3xl p-8 flex flex-col justify-between relative shadow-glass shadow-[#FF5B04]/5 font-sans">
            <div className="absolute top-4 right-4 px-2.5 py-0.5 bg-[#FF5B04]/10 border border-[#FF5B04]/20 text-[#FF5B04] text-[9px] font-black uppercase rounded tracking-wider">
              RECOMMENDED
            </div>

            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-base font-extrabold text-gray-900">Organisation Workspace</h3>
                  <p className="text-xs text-gray-500 mt-1">For publishers, agencies, and content teams</p>
                  <div className="text-lg font-black text-gray-900 mt-2">$29/mo <span className="text-xs font-normal text-gray-500">for 3 seats (BYOK)</span></div>
                </div>
                <span className="px-2.5 py-0.5 bg-[#FF5B04]/10 border border-[#FF5B04]/20 text-[10px] text-[#FF5B04] font-bold rounded-md font-sans">
                  Organisation
                </span>
              </div>

              <ul className="text-xs text-gray-600 space-y-3 mb-8 font-sans">
                <li className="flex items-center gap-2">
                  <svg aria-hidden="true" className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <strong>Workspace → Team → User</strong> hierarchy structures.
                </li>
                <li className="flex items-center gap-2">
                  <svg aria-hidden="true" className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  Add writers via email, assign clear access levels.
                </li>
                <li className="flex items-center gap-2">
                  <svg aria-hidden="true" className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  Separate team-level Brand Brain guidelines.
                </li>
                <li className="flex items-center gap-2">
                  <svg aria-hidden="true" className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  Shared Stripe billing and Central Key Routing.
                </li>
              </ul>
            </div>

            <Button
              as="a"
              href={registerUrl}
              className="w-full h-11 font-bold text-xs text-white rounded-xl shadow-sm font-sans"
              style={{ background: "#FF5B04" }}
            >
              Start Free — Organisation
            </Button>
          </div>
        </div>

        {/* inline notice */}
        <div className="max-w-md mx-auto text-center font-sans">
          <p className="text-xs text-gray-500 leading-normal">
            Already registered as solo? Switch anytime. The Team Setup Wizard inside your Profile settings will convert your namespace, generate invitation keys, and set up team rules instantly.
          </p>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="py-20 bg-white px-6">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-black text-[#FF5B04] uppercase tracking-widest">Questions &amp; Answers</span>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-black/[0.04] pb-4">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                  className="w-full flex justify-between items-center text-left py-3 text-sm font-bold text-gray-800 hover:text-gray-900 transition-colors focus:outline-none"
                  aria-expanded={openFaqIndex === i}
                >
                  <span>{faq.q}</span>
                  <svg
                    aria-hidden="true"
                    className={`w-4 h-4 text-[#FF5B04] transform transition-transform ${openFaqIndex === i ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaqIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="text-xs text-gray-500 leading-relaxed pt-1 pb-3">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Conversion CTA Footer */}
      <footer className="py-20 border-t border-black/[0.05] px-6 text-center bg-[#F7F7F6] relative z-20 font-sans">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Claim your content command center
          </h2>
          <p className="mt-4 text-xs text-gray-500 max-w-sm leading-relaxed">
            Eliminate manual copy-paste cycles, manage brand guidelines, and syndicate seamlessly. Setup takes under 2 minutes.
          </p>

          <Button
            as="a"
            href={registerUrl}
            className="h-12 font-bold text-sm text-white rounded-xl px-10 mt-8 shadow-md shadow-[#FF5B04]/10 transition-all hover:scale-[1.02] font-sans"
            style={{ background: "#FF5B04" }}
          >
            Start Free Now
          </Button>

          <div className="mt-20 flex flex-col sm:flex-row items-center justify-between w-full border-t border-black/[0.05] pt-8 gap-4 font-sans">
            <span className="text-xs text-gray-500 font-bold">
              © {new Date().getFullYear()} UI Pirate. All rights reserved.
            </span>
            <div className="flex items-center gap-6 text-xs text-gray-500 font-bold">
              <a href="/terms" className="hover:text-gray-900 transition-colors">Terms of Service</a>
              <a href="/privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
              <a href="mailto:support@uipirate.com" className="hover:text-gray-900 transition-colors">Support Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
