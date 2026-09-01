"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import StudioCanvas from "@/components/StudioCanvas";
import PageWrapper from "@/components/PageWrapper";
import TactilePillButton from "@/components/TactilePillButton";
import ScalingCapsuleButton from "@/components/ScalingCapsuleButton";
import SmashTactileButton from "@/components/SmashTactileButton";
import GlassBadge from "@/components/GlassBadge";
import GlassSurface from "@/components/GlassSurface";
import { FrostedGelDownloadButton } from "@/components/FrostedGelDownloadButton";
import { IsometricReviveButton } from "@/components/IsometricReviveButton";
import { ElevatedUnderglowCTA } from "@/components/ElevatedUnderglowCTA";
import { LedMatrixChevronButton } from "@/components/LedMatrixChevronButton";
import { SlideGrowButton } from "@/components/SlideGrowButton";
import { VintageLeatherCTA } from "@/components/VintageLeatherCTA";
import { NeumorphicGlowCTA } from "@/components/NeumorphicGlowCTA";
import { ArcCornerToggle } from "@/components/ArcCornerToggle";
import { MagneticPulseCTA } from "@/components/MagneticPulseCTA";
import {
  ALL_DASHBOARD_COMPONENTS,
  ComponentCategory,
  PropRow,
  ComponentDetail,
  PresetVariant,
} from "./dashboardComponents";
import { getComponentLabScreen } from "./componentScreens";

export { ALL_DASHBOARD_COMPONENTS };
export type { ComponentCategory, PropRow, ComponentDetail, PresetVariant };

/**
 * Scoped light-theme layer for the embedded studio screens.
 *
 * The button studios are authored dark-only with ~30 hard-coded hex surfaces.
 * Rather than restyle every element in 13 files, this remaps those exact dark
 * chrome surfaces + the shared white/gray text and border utilities to light
 * values — but ONLY inside `.lab-embed-light` (added by the dashboard when the
 * page theme is Light and a screen is embedded). It never affects the lab shell
 * or the standalone /buttons pages.
 *
 * Backgrounds are matched by EXACT hex so accent colours (#10B981, #0077FF,
 * #06B6D4, #FF5B04 …) inside the live button previews keep their real values.
 */
const LAB_LIGHT_PAGE_HEXES = [
  "#07080A", "#07080B", "#07080C", "#07090E", "#070709", "#080706", "#08080A",
  "#08080C", "#090A0D", "#0a0c10", "#0c0d12", "#0C0D12", "#0d0e12",
  "#0D0D10", "#0E0E10",
];
const LAB_LIGHT_PANEL_HEXES = [
  "#0B0B0D", "#0D1015", "#0E0F13", "#0F1116", "#101012", "#101014", "#10131A",
  "#121214", "#121215", "#12141A", "#141417", "#141418", "#151518", "#16181F",
  "#181614", "#1a1c23", "#1B1C20", "#1C1815", "#1E1E28",
];
const hexRule = (hexes: string[], color: string) =>
  `${hexes.map((h) => `.lab-embed-light [class*="bg-[${h}]" i]`).join(",\n")} {\n  background-color: ${color} !important;\n  background-image: none !important;\n}`;
const LAB_EMBED_LIGHT_CSS = `
${hexRule(LAB_LIGHT_PAGE_HEXES, "#f1f3f5")}
${hexRule(LAB_LIGHT_PANEL_HEXES, "#ffffff")}
.lab-embed-light [class*="bg-black/"] { background-color: rgba(15, 23, 42, 0.05) !important; }
.lab-embed-light [class*="bg-white/0"],
.lab-embed-light [class*="bg-white/5"],
.lab-embed-light [class*="bg-white/10"] { background-color: rgba(15, 23, 42, 0.04) !important; }
.lab-embed-light .text-white,
.lab-embed-light [class*="text-gray-1"],
.lab-embed-light [class*="text-gray-2"],
.lab-embed-light [class*="text-gray-3"] { color: #1f2933 !important; }
.lab-embed-light [class*="text-gray-4"],
.lab-embed-light [class*="text-gray-5"],
.lab-embed-light [class*="text-white/"] { color: #5b6673 !important; }
.lab-embed-light [class*="border-white/"] { border-color: rgba(15, 23, 42, 0.12) !important; }
.lab-embed-light [class*="divide-white/"] > :not([hidden]) ~ :not([hidden]) { border-color: rgba(15, 23, 42, 0.1) !important; }
`;

/** Soft fade/slide-in for the embedded studio when switching components in the sidebar. */
const LAB_SCREEN_SWAP_CSS = `
@keyframes labScreenIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
.lab-screen-swap { animation: labScreenIn 0.26s cubic-bezier(0.22, 1, 0.36, 1); will-change: opacity, transform; }
@media (prefers-reduced-motion: reduce) { .lab-screen-swap { animation: none; } }
`;

// Icons
const SunIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

const SearchIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
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

const SparklesIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" />
  </svg>
);

interface UIComponentDashboardProps {
  initialComponentId?: string;
  onBackToLibrary?: () => void;
}

export default function UIComponentDashboard({
  initialComponentId = "isometric-revive-button",
  onBackToLibrary,
}: UIComponentDashboardProps) {
  const [selectedComponentId, setSelectedComponentId] = useState<string>(initialComponentId);
  const [sidebarSearch, setSidebarSearch] = useState("");
  const [pageTheme, setPageTheme] = useState<"dark" | "light">("dark");
  const [canvasTheme, setCanvasTheme] = useState<"dark" | "light">("dark");
  const [activeCodeTab, setActiveCodeTab] = useState<"jsx" | "html" | "css">("jsx");
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // ── Playground Dynamic State ──────────────────────────────────────────
  const [customLabel, setCustomLabel] = useState<string>("");
  const [customSize, setCustomSize] = useState<"xs" | "sm" | "md" | "lg" | "xl">("md");
  const [customTheme, setCustomTheme] = useState<string>("");
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [clickCount, setClickCount] = useState<number>(0);
  const [lastAction, setLastAction] = useState<string | null>(null);

  // "On this page" entries auto-derived from the embedded studio screen's <h2> headings
  const [screenToc, setScreenToc] = useState<{ id: string; label: string }[]>([]);

  // Keep-alive: every studio the user has opened stays mounted (just hidden), so
  // switching back is instant with no unmount / lazy-load / flicker.
  const [visitedScreenIds, setVisitedScreenIds] = useState<string[]>([]);
  const activeScreenRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialComponentId) {
      setSelectedComponentId(initialComponentId);
    }
  }, [initialComponentId]);

  const selectedComponent = useMemo(
    () => ALL_DASHBOARD_COMPONENTS.find((c) => c.id === selectedComponentId) ?? ALL_DASHBOARD_COMPONENTS[0],
    [selectedComponentId]
  );

  // The exact same studio screen rendered at /buttons/<slug>, when one exists.
  // When present it fully replaces the bespoke playground/variants/code sections
  // so the Component Lab detail page is 1:1 with the standalone button page.
  const EmbeddedScreen = getComponentLabScreen(selectedComponent.id);

  useEffect(() => {
    if (!EmbeddedScreen) return;
    setVisitedScreenIds((v) => (v.includes(selectedComponent.id) ? v : [...v, selectedComponent.id]));
  }, [selectedComponent.id, EmbeddedScreen]);

  // Sync playground initial state when selected component changes
  useEffect(() => {
    setCustomLabel(selectedComponent.defaultLabel || "Button");
    setCustomSize("md");
    setCustomTheme(selectedComponent.defaultTheme || "default");
    setClickCount(0);
    setLastAction(null);
  }, [selectedComponent]);

  const currentIndex = useMemo(
    () => ALL_DASHBOARD_COMPONENTS.findIndex((c) => c.id === selectedComponent.id),
    [selectedComponent.id]
  );

  const prevComponent = currentIndex > 0 ? ALL_DASHBOARD_COMPONENTS[currentIndex - 1] : null;
  const nextComponent = currentIndex < ALL_DASHBOARD_COMPONENTS.length - 1 ? ALL_DASHBOARD_COMPONENTS[currentIndex + 1] : null;

  const sidebarFilteredComponents = useMemo(() => {
    if (!sidebarSearch.trim()) return ALL_DASHBOARD_COMPONENTS;
    const q = sidebarSearch.toLowerCase();
    return ALL_DASHBOARD_COMPONENTS.filter(
      (c) => c.name.toLowerCase().includes(q) || c.categoryLabel.toLowerCase().includes(q) || c.badge?.toLowerCase().includes(q)
    );
  }, [sidebarSearch]);

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

  const handleTriggerAction = (actionName: string = "Clicked") => {
    setClickCount((prev) => prev + 1);
    setLastAction(`${actionName} event #${clickCount + 1}`);
  };

  // Dynamic code generation reflecting playground values
  const dynamicJsxCode = useMemo(() => {
    switch (selectedComponent.id) {
      case "isometric-revive-button":
        return `import { IsometricReviveButton } from "@/components/IsometricReviveButton";

export default function Example() {
  return (
    <IsometricReviveButton
      label="${customLabel}"
      theme="${customTheme}"
      size="${customSize}"
      onClick={() => console.log("Revive triggered!")}
    />
  );
}`;
      case "tactile-pill-button":
        return `import TactilePillButton from "@/components/TactilePillButton";

export default function Example() {
  return (
    <TactilePillButton
      label="${customLabel}"
      variant="${customTheme}"
      size="${customSize}"
      onClick={() => console.log("Clicked")}
    />
  );
}`;
      case "frosted-gel-download-button":
        return `import { FrostedGelDownloadButton } from "@/components/FrostedGelDownloadButton";

export default function Example() {
  return (
    <FrostedGelDownloadButton
      label="${customLabel}"
      theme="${customTheme}"
      size="${customSize}"
      onDownload={() => console.log("Download started")}
    />
  );
}`;
      case "elevated-underglow-cta":
        return `import { ElevatedUnderglowCTA } from "@/components/ElevatedUnderglowCTA";

export default function Example() {
  return (
    <ElevatedUnderglowCTA
      label="${customLabel}"
      theme="${customTheme}"
      size="${customSize}"
      icon="phone"
      onClick={() => console.log("Call triggered")}
    />
  );
}`;
      case "slide-grow-button":
        return `import { SlideGrowButton } from "@/components/SlideGrowButton";

export default function Example() {
  return (
    <SlideGrowButton
      theme="${customTheme}"
      size="${customSize}"
      onComplete={() => alert("Action unlocked!")}
    />
  );
}`;
      case "vintage-leather-cta":
        return `import { VintageLeatherCTA } from "@/components/VintageLeatherCTA";

export default function Example() {
  return (
    <VintageLeatherCTA
      label="${customLabel}"
      theme="${customTheme}"
      size="${customSize}"
      onClick={() => console.log("Leather button pressed")}
    />
  );
}`;
      case "neumorphic-glow-cta": {
        const themeMap: Record<string, { variant: string; theme: string; neonPreset?: string }> = {
          "emerald-pill": { variant: "pill", theme: "default", neonPreset: "emerald" },
          "squircle-emerald": { variant: "squircle", theme: "default", neonPreset: "emerald" },
          "uipirate": { variant: "pill", theme: "uipirate", neonPreset: "uipirate" },
          "squircle-uipirate": { variant: "squircle", theme: "uipirate", neonPreset: "uipirate" },
          "cyan-pill": { variant: "pill", theme: "dark", neonPreset: "cyan" },
          "magenta-squircle": { variant: "squircle", theme: "cyberpunk", neonPreset: "magenta" },
          "amber-pill": { variant: "pill", theme: "dark", neonPreset: "amber" },
          "violet-squircle": { variant: "squircle", theme: "dark", neonPreset: "violet" },
          "pill": { variant: "pill", theme: "default", neonPreset: "emerald" },
          "squircle": { variant: "squircle", theme: "default", neonPreset: "emerald" },
        };
        const cfg = themeMap[customTheme] || { variant: "pill", theme: "default", neonPreset: "emerald" };
        return `import { NeumorphicGlowCTA } from "@/components/NeumorphicGlowCTA";

export default function Example() {
  return (
    <NeumorphicGlowCTA
      label="${customLabel}"
      variant="${cfg.variant}"
      theme="${cfg.theme}"
      neonPreset="${cfg.neonPreset}"
      size="${customSize}"
      onClick={() => console.log("Neumorphic Glow Clicked")}
    />
  );
}`;
      }
      case "smash-tactile-button":
        return `import SmashTactileButton from "@/components/SmashTactileButton";

export default function Example() {
  return (
    <SmashTactileButton
      label="${customLabel}"
      variant="${customTheme}"
      size="${customSize}"
      onClick={() => console.log("Smashed!")}
    />
  );
}`;
      case "scaling-capsule-button":
        return `import ScalingCapsuleButton from "@/components/ScalingCapsuleButton";

export default function Example() {
  return (
    <ScalingCapsuleButton
      label="${customLabel}"
      variant="${customTheme}"
      size="${customSize}"
      onClick={() => console.log("Capsule clicked")}
    />
  );
}`;
      case "magnetic-pulse-cta":
        return `import { MagneticPulseCTA } from "@/components/MagneticPulseCTA";

export default function Example() {
  return (
    <MagneticPulseCTA
      label="${customLabel}"
      pulseColor="${customTheme}"
      onClick={() => console.log("Pulsed!")}
    />
  );
}`;
      default:
        return selectedComponent.jsxCode;
    }
  }, [selectedComponent, customLabel, customTheme, customSize]);

  const activeCode =
    activeCodeTab === "jsx"
      ? dynamicJsxCode
      : activeCodeTab === "html"
        ? selectedComponent.htmlCode
        : selectedComponent.cssCode;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "j" || e.key === "ArrowDown") {
        if (nextComponent) handleSelectComponent(nextComponent.id);
      } else if (e.key === "k" || e.key === "ArrowUp") {
        if (prevComponent) handleSelectComponent(prevComponent.id);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [nextComponent, prevComponent]);

  const centerScrollRef = React.useRef<HTMLDivElement>(null);

  const handleSelectComponent = useCallback((id: string) => {
    setSelectedComponentId(id);
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", `/componentlab/${id}`);
    }
    setMobileSidebarOpen(false);
    // Jump instantly to the top (no smooth-scroll fighting the content swap);
    // the incoming studio then fades in from a clean position.
    centerScrollRef.current?.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  // Build the right-hand "On this page" rail from the embedded studio screen.
  // The button screens ship no anchor ids, so we tag their <h2> headings once
  // they mount and mirror them into the TOC — works for every button with no
  // per-screen edits.
  useEffect(() => {
    if (!EmbeddedScreen) {
      setScreenToc([]);
      return;
    }
    setScreenToc([]);
    let timer = 0;
    let attempts = 0;
    const scan = () => {
      const root = activeScreenRef.current;
      const heads = root ? (Array.from(root.querySelectorAll("h2")) as HTMLElement[]) : [];
      if (heads.length === 0 && attempts < 40) {
        attempts += 1;
        timer = window.setTimeout(scan, 100);
        return;
      }
      setScreenToc(
        heads.map((h, i) => {
          const label = (h.textContent || `Section ${i + 1}`).replace(/\s+/g, " ").trim();
          const id =
            "lab-" + (label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `section-${i}`);
          h.id = id;
          h.style.scrollMarginTop = "24px";
          return { id, label };
        })
      );
    };
    timer = window.setTimeout(scan, 150);
    return () => window.clearTimeout(timer);
  }, [EmbeddedScreen, selectedComponent.id]);

  const isLightPage = pageTheme === "light";

  // ── Render Dynamic Component in Playground ────────────────────────────
  const renderInteractivePlaygroundComponent = () => {
    // Helper: returns value if in validSet, otherwise returns the fallback
    const safeTheme = (value: string, validSet: string[], fallback: string): string =>
      validSet.includes(value) ? value : fallback;

    switch (selectedComponent.id) {
      case "isometric-revive-button": {
        const validIsoThemes = ["figma", "amber", "cyan", "emerald", "violet", "crimson", "uipirate", "pearl-light", "gold-luxury"];
        const isoTheme = safeTheme(customTheme, validIsoThemes, "figma");
        return (
          <div className="py-12 flex items-center justify-center">
            <IsometricReviveButton
              label={customLabel || "Revive Now"}
              theme={isoTheme as any}
              size={customSize}
              onClick={() => handleTriggerAction("Revive 3D Pressed")}
            />
          </div>
        );
      }
      case "tactile-pill-button": {
        const validTactileVariants = ["default", "dark", "orange", "cyberpunk", "minimal"];
        const tactileVariant = safeTheme(customTheme, validTactileVariants, "default");
        const tactileDotColorMap: Record<string, string> = {
          default: "#54EAD8",
          orange: "#FF5B04",
          dark: "#A78BFA",
          cyberpunk: "#10B981",
          minimal: "#3B82F6",
        };
        return (
          <div className="py-8 flex items-center justify-center">
            <TactilePillButton
              label={customLabel || "Get Started"}
              variant={tactileVariant as any}
              dotColor={tactileDotColorMap[tactileVariant] || "#54EAD8"}
              size={customSize}
              onClick={() => handleTriggerAction("Tactile Pill Clicked")}
            />
          </div>
        );
      }
      case "frosted-gel-download-button": {
        const validGelThemes = ["figma-blue", "cyber-violet", "emerald-matrix", "magma-orange", "dark-obsidian", "titanium-gold"];
        const gelTheme = safeTheme(customTheme, validGelThemes, "figma-blue");
        return (
          <div className="py-8 flex items-center justify-center">
            <FrostedGelDownloadButton
              label={customLabel || "Download now"}
              theme={gelTheme as any}
              size={customSize}
              onClick={() => handleTriggerAction("Gel Download Triggered")}
            />
          </div>
        );
      }
      case "elevated-underglow-cta": {
        const validUnderglowThemes = ["figma", "emerald", "amber"];
        const underglowTheme = safeTheme(customTheme, validUnderglowThemes, "figma");
        return (
          <div className="py-8 flex items-center justify-center">
            <ElevatedUnderglowCTA
              label={customLabel || "Book A Call"}
              theme={underglowTheme as any}
              size={customSize}
              icon="phone"
              onClick={() => handleTriggerAction("Elevated Call Triggered")}
            />
          </div>
        );
      }
      case "led-matrix-chevron": {
        const validLedThemes = ["uipirate", "pirate", "monochrome", "emerald", "cyan", "amber", "crimson"];
        const ledTheme = safeTheme(customTheme, validLedThemes, "monochrome");
        return (
          <div className="py-8 flex items-center justify-center">
            <LedMatrixChevronButton
              label={customLabel || "See Plans"}
              theme={ledTheme as any}
              size={customSize}
              onClick={() => handleTriggerAction("LED Matrix Clicked")}
            />
          </div>
        );
      }
      case "slide-grow-button": {
        const validSlideThemes = ["silver", "dark", "obsidian"];
        const slideTheme = safeTheme(customTheme, validSlideThemes, "silver");
        return (
          <div className="py-8 flex items-center justify-center">
            <SlideGrowButton
              theme={slideTheme as any}
              size={customSize}
              onComplete={() => handleTriggerAction("Swipe Gesture Completed")}
            />
          </div>
        );
      }
      case "vintage-leather-cta": {
        const validLeatherThemes = ["heritage", "noir", "oxblood"];
        const leatherTheme = safeTheme(customTheme, validLeatherThemes, "heritage");
        return (
          <div className="py-8 flex items-center justify-center">
            <VintageLeatherCTA
              label={customLabel || "Shop ties"}
              theme={leatherTheme as any}
              size={customSize}
              onClick={() => handleTriggerAction("Leather Button Pressed")}
            />
          </div>
        );
      }
      case "neumorphic-glow-cta": {
        const themeMap: Record<string, { variant: "pill" | "squircle"; theme: any; neonPreset?: any }> = {
          "emerald-pill": { variant: "pill", theme: "default", neonPreset: "emerald" },
          "squircle-emerald": { variant: "squircle", theme: "default", neonPreset: "emerald" },
          "uipirate": { variant: "pill", theme: "uipirate", neonPreset: "uipirate" },
          "squircle-uipirate": { variant: "squircle", theme: "uipirate", neonPreset: "uipirate" },
          "cyan-pill": { variant: "pill", theme: "dark", neonPreset: "cyan" },
          "magenta-squircle": { variant: "squircle", theme: "cyberpunk", neonPreset: "magenta" },
          "amber-pill": { variant: "pill", theme: "dark", neonPreset: "amber" },
          "violet-squircle": { variant: "squircle", theme: "dark", neonPreset: "violet" },
          "pill": { variant: "pill", theme: "default", neonPreset: "emerald" },
          "squircle": { variant: "squircle", theme: "default", neonPreset: "emerald" },
        };
        const cfg = themeMap[customTheme] || { variant: "pill" as const, theme: "default", neonPreset: "emerald" };
        return (
          <div className="py-8 flex items-center justify-center">
            <NeumorphicGlowCTA
              label={customLabel || (cfg.variant === "pill" ? "Learn more" : "Get more info")}
              variant={cfg.variant}
              theme={cfg.theme}
              neonPreset={cfg.neonPreset}
              size={customSize}
              onClick={() => handleTriggerAction("Neumorphic Glow Clicked")}
            />
          </div>
        );
      }
      case "smash-tactile-button": {
        const validSmashVariants = ["figma", "cyber", "dark"];
        const smashVariant = safeTheme(customTheme, validSmashVariants, "figma");
        return (
          <div className="py-8 flex items-center justify-center">
            <SmashTactileButton
              label={customLabel || "Smash the button"}
              variant={smashVariant as any}
              size={customSize}
              onClick={() => handleTriggerAction("Tactile Smashed!")}
            />
          </div>
        );
      }
      case "scaling-capsule-button": {
        const validCapsuleVariants = ["dark", "light"];
        const capsuleVariant = safeTheme(customTheme, validCapsuleVariants, "dark");
        return (
          <div className="py-8 flex items-center justify-center">
            <ScalingCapsuleButton
              label={customLabel || "Scaling Workshop"}
              variant={capsuleVariant as any}
              size={customSize}
              onClick={() => handleTriggerAction("Scaling Capsule Clicked")}
            />
          </div>
        );
      }
      case "magnetic-pulse-cta":
        return (
          <div className="py-8 flex items-center justify-center">
            <MagneticPulseCTA
              label={customLabel || "Let's Venture"}
              pulseColor={customTheme || "#FF5B04"}
              onClick={() => handleTriggerAction("Magnetic Pulse Fired")}
            />
          </div>
        );
      case "arc-corner-toggle":
        return (
          <div className="py-8 flex items-center justify-center">
            <ArcCornerToggle
              scale={customSize === "sm" ? 0.75 : customSize === "lg" ? 1.05 : 0.88}
              onToggle={(st) => handleTriggerAction(`Arc Toggled: ${st ? "ON" : "OFF"}`)}
            />
          </div>
        );
      case "glass-badge": {
        const validBadgeVariants = ["gradient", "cyan", "solid"];
        const badgeVariant = safeTheme(customTheme, validBadgeVariants, "gradient");
        return (
          <div className="py-8 flex items-center justify-center">
            <GlassBadge variant={badgeVariant as any} size={customSize}>
              {customLabel || "PROPRIETARY COMPONENT"}
            </GlassBadge>
          </div>
        );
      }
      case "glass-surface":
        return (
          <div className="py-8 flex items-center justify-center w-full max-w-sm mx-auto">
            <div className="p-6 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-xl shadow-2xl w-full text-center">
              <div className="text-xs font-mono font-bold text-cyan-400">Glass Container Surface</div>
              <div className="text-xs text-gray-300 mt-2">{customLabel}</div>
            </div>
          </div>
        );
      default:
        return canvasTheme === "light" ? selectedComponent.previewLight : selectedComponent.previewDark;
    }
  };

  // ── Shared shell chrome (used by both the embedded-screen and fallback views) ──
  const breadcrumbNav = (
    <nav
      className={`flex items-center gap-2 text-xs font-mono ${isLightPage ? "text-gray-400" : "text-gray-500"
        }`}
    >
      <Link href="/componentlab" className={`transition-colors ${isLightPage ? "hover:text-gray-800" : "hover:text-gray-300"}`}>
        Component Lab
      </Link>
      <span>/</span>
      <span className={isLightPage ? "text-gray-600" : "text-gray-400"}>{selectedComponent.categoryLabel}</span>
      <span>/</span>
      <span className="text-[#FF5B04] font-semibold">{selectedComponent.name}</span>
    </nav>
  );

  const componentPagerNav = (
    <div className={`pt-8 border-t grid grid-cols-1 sm:grid-cols-2 gap-4 ${isLightPage ? "border-gray-200" : "border-white/10"}`}>
      {prevComponent ? (
        <button
          onClick={() => handleSelectComponent(prevComponent.id)}
          className={`p-5 rounded-2xl border text-left transition-all group cursor-pointer ${isLightPage
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
          className={`p-5 rounded-2xl border text-right transition-all group sm:col-start-2 cursor-pointer ${isLightPage
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
  );

  return (
    <PageWrapper showFloatingButton={false}>
      <div
        className={`h-screen w-screen overflow-hidden flex flex-col font-sans transition-colors duration-300 ${isLightPage
            ? "bg-[#F8F9FA] text-gray-900 selection:bg-[#FF5B04] selection:text-white"
            : "bg-[#0A0A0C] text-gray-100 selection:bg-[#FF5B04] selection:text-white"
          }`}
      >
        {/* ── Fixed Documentation Top Bar ────────────────────────── */}
        <header
          className={`h-14 shrink-0 border-b px-4 sm:px-6 flex items-center justify-between gap-4 z-30 transition-colors duration-300 ${isLightPage
              ? "bg-white/95 border-gray-200 shadow-sm"
              : "bg-[#0D0D11]/95 border-white/8 backdrop-blur-xl"
            }`}
        >
          {/* Left Brand + Back to Library + Mobile Drawer Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className={`lg:hidden p-1.5 rounded-lg border transition-colors ${isLightPage
                  ? "bg-gray-100 border-gray-200 text-gray-700 hover:text-gray-900"
                  : "bg-white/5 border-white/10 text-gray-300 hover:text-white"
                }`}
              aria-label="Toggle Navigation"
            >
              {mobileSidebarOpen ? <CloseIcon /> : <MenuIcon />}
            </button>

            <Link
              href="/componentlab"
              className={`flex items-center gap-1.5 text-xs font-mono px-2.5 py-1.5 rounded-xl border transition-all ${isLightPage
                  ? "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200"
                  : "bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border-white/10"
                }`}
              title="Return to Component Library"
            >
              <span>←</span>
              <span className="hidden sm:inline">Library</span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF5B04] to-orange-600 flex items-center justify-center text-white font-extrabold text-xs shadow-md shadow-orange-500/20">
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
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full border hidden md:inline ${isLightPage
                    ? "bg-gray-100 text-gray-600 border-gray-200"
                    : "bg-white/5 text-gray-400 border-white/10"
                  }`}
              >
                Studio &amp; Playground
              </span>
            </div>
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
              className={`w-full rounded-xl pl-9 pr-12 py-1.5 text-xs transition-colors focus:outline-none focus:border-[#FF5B04] ${isLightPage
                  ? "bg-gray-100 border border-gray-200 text-gray-900 placeholder-gray-400"
                  : "bg-white/5 border border-white/10 text-white placeholder-gray-500"
                }`}
            />
            <span
              className={`absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono border px-1.5 py-0.5 rounded ${isLightPage
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
              className={`flex items-center gap-1 p-0.5 rounded-xl border ${isLightPage ? "bg-gray-100 border-gray-200" : "bg-black/50 border-white/10"
                }`}
            >
              <button
                onClick={() => setPageTheme("light")}
                title="Switch entire page to Light Theme"
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${isLightPage
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
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${!isLightPage
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
                <span>Direct URL</span>
                <ExternalLinkIcon />
              </Link>
            )}
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
              className={`p-3.5 border-b flex items-center justify-between lg:hidden ${isLightPage ? "bg-white border-gray-200" : "bg-[#121216] border-white/8"
                }`}
            >
              <span className={`text-xs font-bold uppercase tracking-wider ${isLightPage ? "text-gray-900" : "text-white"}`}>
                Components Menu
              </span>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className={`p-1 cursor-pointer ${isLightPage ? "text-gray-500 hover:text-gray-900" : "text-gray-400 hover:text-white"}`}
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
                  className={`w-full rounded-xl pl-9 pr-3 py-1.5 text-xs ${isLightPage
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
                      className={`px-2 text-[10px] font-mono font-bold uppercase tracking-widest flex items-center justify-between ${isLightPage ? "text-gray-500" : "text-gray-500"
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
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between group cursor-pointer ${isSelected
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
                                className={`text-[9px] font-mono px-1.5 py-0.5 rounded border shrink-0 hidden sm:inline-block ${isLightPage
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
              className={`p-3.5 border-t text-[11px] flex items-center justify-between ${isLightPage
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
            className={`flex-1 h-[calc(100vh-3.5rem)] overflow-y-auto min-w-0 min-h-0 scroll-smooth overscroll-contain scrollbar-thin ${EmbeddedScreen ? "" : "p-6 sm:p-10 lg:p-12 space-y-12"
              }`}
          >
            {EmbeddedScreen ? (
              /* ── Embedded studio: identical to /buttons/<slug> ─────────── */
              <div className={`min-h-full ${isLightPage ? "lab-embed-light bg-[#F4F5F7]" : "bg-[#0A0A0C]"}`}>
                <style dangerouslySetInnerHTML={{ __html: LAB_SCREEN_SWAP_CSS }} />
                {isLightPage && <style dangerouslySetInnerHTML={{ __html: LAB_EMBED_LIGHT_CSS }} />}
                <div className="px-6 sm:px-10 lg:px-12 pt-6">
                  <div className="max-w-5xl mx-auto">{breadcrumbNav}</div>
                </div>

                {visitedScreenIds.map((id) => {
                  const Screen = getComponentLabScreen(id);
                  if (!Screen) return null;
                  const active = id === selectedComponent.id;
                  return (
                    <div
                      key={id}
                      ref={active ? activeScreenRef : undefined}
                      hidden={!active}
                      className={active ? "lab-screen-swap" : undefined}
                    >
                      <Screen />
                    </div>
                  );
                })}

                <div className="px-6 sm:px-10 lg:px-12 pb-16 pt-4">
                  <div className="max-w-5xl mx-auto">{componentPagerNav}</div>
                </div>
              </div>
            ) : (
              <div className={`max-w-4xl mx-auto space-y-12 pb-16 ${isLightPage ? "lab-embed-light" : ""}`}>
                {isLightPage && <style dangerouslySetInnerHTML={{ __html: LAB_EMBED_LIGHT_CSS }} />}

                {/* Breadcrumb Navigation */}
                {breadcrumbNav}

                {/* Header: Title & Badges */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1
                      className={`text-3xl sm:text-4xl font-extrabold tracking-tight font-jakarta ${isLightPage ? "text-gray-950" : "text-white"
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

                {/* ── 1. Interactive Playground Studio Canvas ─────────────────── */}
                <section id="playground" className="space-y-4 scroll-mt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FF5B04] animate-pulse" />
                      <h2 className={`text-lg font-bold font-jakarta ${isLightPage ? "text-gray-950" : "text-white"}`}>
                        Interactive Playground &amp; Studio
                      </h2>
                      <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                        Live Controls
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono">
                      {lastAction && (
                        <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 animate-pulse">
                          ✓ {lastAction}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Studio frame */}
                  <div
                    className={`rounded-3xl overflow-hidden border shadow-2xl ${isLightPage ? "border-gray-200 bg-white" : "border-white/10 bg-[#121216]"
                      }`}
                  >
                    <StudioCanvas title="interactive-playground.tsx">
                      <div className="w-full flex items-center justify-center">
                        {renderInteractivePlaygroundComponent()}
                      </div>
                    </StudioCanvas>
                  </div>

                  {/* Customizer */}
                  <div
                    className={`rounded-3xl border p-6 space-y-5 ${isLightPage ? "border-gray-200 bg-white" : "border-white/10 bg-white/[0.03]"
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <SparklesIcon />
                        <span className={`text-xs font-mono font-bold uppercase tracking-wider ${isLightPage ? "text-gray-900" : "text-white"}`}>
                          Customizer
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setCustomLabel(selectedComponent.defaultLabel || "Button");
                          setCustomSize("md");
                          setCustomTheme(selectedComponent.defaultTheme || "default");
                          setClickCount(0);
                          setLastAction(null);
                        }}
                        className={`text-[11px] font-mono transition-colors cursor-pointer ${isLightPage ? "text-gray-500 hover:text-gray-900" : "text-gray-400 hover:text-white"
                          }`}
                      >
                        Reset Defaults
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">

                      {/* 1. Label Control */}
                      {selectedComponent.hasLabelControl && (
                        <div className="space-y-1.5">
                          <label className={`block font-bold ${isLightPage ? "text-gray-700" : "text-gray-300"}`}>
                            Button Label Text:
                          </label>
                          <input
                            type="text"
                            value={customLabel}
                            onChange={(e) => setCustomLabel(e.target.value)}
                            placeholder="Type custom text..."
                            className={`w-full px-3.5 py-2 rounded-xl text-xs transition-colors focus:outline-none focus:border-[#FF5B04] ${isLightPage
                                ? "bg-gray-100 border border-gray-200 text-gray-900 placeholder-gray-400"
                                : "bg-black/50 border border-white/10 text-white placeholder-gray-500"
                              }`}
                          />
                        </div>
                      )}

                      {/* 2. Scale / Size Control */}
                      {selectedComponent.hasSizeControl && (
                        <div className="space-y-1.5">
                          <label className={`block font-bold ${isLightPage ? "text-gray-700" : "text-gray-300"}`}>
                            Size Scale:
                          </label>
                          <div className="flex items-center gap-1">
                            {(["xs", "sm", "md", "lg", "xl"] as const).map((s) => (
                              <button
                                key={s}
                                onClick={() => setCustomSize(s)}
                                className={`flex-1 py-2 rounded-xl uppercase font-bold text-xs transition-all cursor-pointer ${customSize === s
                                    ? "bg-[#FF5B04] text-white shadow"
                                    : isLightPage
                                      ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                      : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                                  }`}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 3. Theme / Variant Chips */}
                      {selectedComponent.hasThemeControl && selectedComponent.availableThemes && (
                        <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
                          <label className={`block font-bold ${isLightPage ? "text-gray-700" : "text-gray-300"}`}>
                            Variant Theme:
                          </label>
                          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                            {selectedComponent.availableThemes.map((th) => (
                              <button
                                key={th.value}
                                onClick={() => setCustomTheme(th.value)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${customTheme === th.value
                                    ? "bg-[#FF5B04] text-white font-bold shadow"
                                    : isLightPage
                                      ? "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                                      : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/5"
                                  }`}
                              >
                                {th.color && (
                                  <span
                                    className="w-2 h-2 rounded-full shrink-0"
                                    style={{ backgroundColor: th.color }}
                                  />
                                )}
                                <span>{th.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                </section>

                {/* ── 2. All Presets & Variants Showcase Card ────────────────── */}
                {selectedComponent.variantsList && selectedComponent.variantsList.length > 0 && (
                  <section id="variants" className="space-y-4 scroll-mt-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-[#FFB020] mb-1.5">
                          <span>PRESETS &amp; VARIATIONS</span>
                        </div>
                        <h2 className={`text-2xl font-bold tracking-tight font-jakarta ${isLightPage ? "text-gray-950" : "text-white"}`}>
                          All Variants &amp; Themes
                        </h2>
                      </div>
                      <p className={`text-xs font-mono ${isLightPage ? "text-gray-500" : "text-gray-400"}`}>
                        Click to test interactive spring physics on every theme
                      </p>
                    </div>

                    <div
                      className={`border rounded-3xl p-6 sm:p-8 shadow-xl ${isLightPage ? "bg-white border-gray-200" : "bg-[#121216] border-white/10"
                        }`}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {selectedComponent.variantsList.map((variant) => (
                          <div
                            key={variant.title}
                            className={`rounded-2xl p-6 flex flex-col items-center justify-between min-h-[220px] transition-all border ${isLightPage
                                ? "bg-[#F8F9FA] border-gray-200 hover:border-gray-300"
                                : "bg-[#0E0E12] border-white/5 hover:border-white/15"
                              }`}
                          >
                            <div className="w-full flex items-center justify-between text-xs font-mono mb-2">
                              <span className={`font-bold truncate ${isLightPage ? "text-gray-900" : "text-white"}`}>
                                {variant.title}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-mono shrink-0 ${isLightPage ? "bg-gray-200 text-gray-800 font-bold" : "bg-white/10 text-gray-300"
                                  }`}
                                style={{ color: variant.badgeColor }}
                              >
                                {variant.themeProp}
                              </span>
                            </div>

                            <div className="my-5 scale-90 transform-gpu flex items-center justify-center">
                              {variant.renderPreview("sm")}
                            </div>

                            <p className={`text-[11px] font-mono text-center leading-relaxed ${isLightPage ? "text-gray-500" : "text-gray-400"}`}>
                              {variant.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                )}

                {/* ── 3. Key Features & Highlights ────────────────────────── */}
                <section id="features" className="space-y-4 scroll-mt-6">
                  <h2 className={`text-lg font-bold font-jakarta ${isLightPage ? "text-gray-950" : "text-white"}`}>
                    Features &amp; Physics
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {selectedComponent.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border flex items-center gap-3 transition-colors ${isLightPage ? "bg-white border-gray-200 shadow-sm text-gray-800" : "bg-[#121216] border-white/8 text-gray-200"
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

                {/* ── 4. Code Snippets & Drop-in Integration ─────────────── */}
                <section id="code" className="space-y-4 scroll-mt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h2 className={`text-lg font-bold font-jakarta ${isLightPage ? "text-gray-950" : "text-white"}`}>
                        Code &amp; Integration
                      </h2>
                      <p className={`text-xs mt-0.5 ${isLightPage ? "text-gray-500" : "text-gray-400"}`}>
                        Customized live with your active playground prop settings:
                      </p>
                    </div>

                    <button
                      onClick={() => handleCopy(activeCode, activeCodeTab)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-[#FF5B04] border border-orange-500/30 text-xs font-mono font-bold transition-colors cursor-pointer self-start sm:self-auto"
                    >
                      {copiedTab === activeCodeTab ? <CheckIcon /> : <CopyIcon />}
                      <span>{copiedTab === activeCodeTab ? "Copied to Clipboard!" : "Copy Active Code"}</span>
                    </button>
                  </div>

                  <div
                    className={`border rounded-3xl overflow-hidden shadow-2xl ${isLightPage ? "bg-[#1E1E28] border-gray-200" : "bg-[#0E0E12] border-white/10"
                      }`}
                  >
                    {/* Code Tabs Header */}
                    <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-[#14141E]">
                      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/5 text-xs font-mono">
                        <button
                          onClick={() => setActiveCodeTab("jsx")}
                          className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${activeCodeTab === "jsx"
                              ? "bg-[#FF5B04] text-white font-bold shadow"
                              : "text-gray-400 hover:text-white"
                            }`}
                        >
                          JSX / React
                        </button>
                        <button
                          onClick={() => setActiveCodeTab("html")}
                          className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${activeCodeTab === "html"
                              ? "bg-[#FF5B04] text-white font-bold shadow"
                              : "text-gray-400 hover:text-white"
                            }`}
                        >
                          HTML
                        </button>
                        <button
                          onClick={() => setActiveCodeTab("css")}
                          className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${activeCodeTab === "css"
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

                {/* ── 5. Peer Dependencies & Installation ────────────────── */}
                <section
                  className={`border rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl transition-colors ${isLightPage ? "bg-white border-gray-200 text-gray-900" : "bg-[#121216] border-white/10 text-white"
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
                    className={`border rounded-2xl px-5 py-3.5 font-mono text-xs overflow-x-auto ${isLightPage ? "bg-gray-50 border-gray-200 text-emerald-600 font-semibold" : "bg-black/50 border-white/10 text-emerald-400"
                      }`}
                  >
                    <code>npm install framer-motion clsx lucide-react tailwind-merge</code>
                  </div>
                </section>

                {/* ── 6. Component Props & API Reference ─────────────────── */}
                {selectedComponent.props.length > 0 && (
                  <section id="api" className="space-y-4 scroll-mt-6">
                    <h2 className={`text-lg font-bold font-jakarta ${isLightPage ? "text-gray-950" : "text-white"}`}>
                      API &amp; Props Reference
                    </h2>
                    <div
                      className={`border rounded-3xl overflow-hidden shadow-xl transition-colors ${isLightPage ? "bg-white border-gray-200" : "bg-[#121216] border-white/10"
                        }`}
                    >
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs sm:text-sm">
                          <thead>
                            <tr
                              className={`border-b font-mono ${isLightPage ? "bg-gray-50 border-gray-200 text-gray-600" : "bg-white/[0.02] border-white/10 text-gray-400"
                                }`}
                            >
                              <th className="py-3.5 px-6 font-semibold">Prop</th>
                              <th className="py-3.5 px-6 font-semibold">Type</th>
                              <th className="py-3.5 px-6 font-semibold">Default</th>
                              <th className="py-3.5 px-6 font-semibold">Description</th>
                            </tr>
                          </thead>
                          <tbody
                            className={`divide-y font-mono text-xs ${isLightPage ? "divide-gray-200 text-gray-800" : "divide-white/5 text-gray-300"
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

                {/* ── 7. Next & Previous Component Navigation ────────────── */}
                {componentPagerNav}

              </div>
            )}
          </main>

          {/* ── Right Table of Contents (Sticky On This Page) ──────────────── */}
          {EmbeddedScreen ? (
            screenToc.length > 0 && (
              <aside
                data-lenis-prevent="true"
                className={`hidden xl:block w-56 shrink-0 h-[calc(100vh-3.5rem)] overflow-y-auto min-h-0 p-6 border-l text-xs font-mono space-y-4 transition-colors ${isLightPage ? "border-gray-200 text-gray-500 bg-[#F8F9FA]" : "border-white/8 text-gray-500 bg-[#0A0A0C]"
                  }`}
              >
                <div className={`text-[11px] font-bold uppercase tracking-wider ${isLightPage ? "text-gray-700" : "text-gray-400"}`}>
                  On this page
                </div>
                <ul className={`space-y-2.5 ${isLightPage ? "text-gray-600" : "text-gray-500"}`}>
                  {screenToc.map((s) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                        }}
                        className={`block transition-colors ${isLightPage ? "hover:text-gray-950" : "hover:text-white"}`}
                      >
                        • {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </aside>
            )
          ) : (
            <aside
              data-lenis-prevent="true"
              className={`hidden xl:block w-56 shrink-0 h-[calc(100vh-3.5rem)] overflow-y-auto min-h-0 p-6 border-l text-xs font-mono space-y-4 transition-colors ${isLightPage ? "border-gray-200 text-gray-500 bg-[#F8F9FA]" : "border-white/8 text-gray-500 bg-[#0A0A0C]"
                }`}
            >
              <div className={`text-[11px] font-bold uppercase tracking-wider ${isLightPage ? "text-gray-700" : "text-gray-400"}`}>
                On this page
              </div>
              <ul className={`space-y-2.5 ${isLightPage ? "text-gray-600" : "text-gray-500"}`}>
                <li>
                  <a
                    href="#playground"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById("playground")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`block transition-colors ${isLightPage ? "hover:text-gray-950" : "hover:text-white"}`}
                  >
                    • Playground &amp; Studio
                  </a>
                </li>
                {selectedComponent.variantsList && (
                  <li>
                    <a
                      href="#variants"
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById("variants")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className={`block transition-colors ${isLightPage ? "hover:text-gray-950" : "hover:text-white"}`}
                    >
                      • All Variants &amp; Themes
                    </a>
                  </li>
                )}
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
          )}

        </div>
      </div>
    </PageWrapper>
  );
}
