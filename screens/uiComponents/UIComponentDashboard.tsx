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
import { AnimatedButton } from "@/components/AnimatedButton";
import { FrostedGelDownloadButton, FrostedGelIcon } from "@/components/FrostedGelDownloadButton";
import { IsometricReviveButton, IsometricGlowIntensity } from "@/components/IsometricReviveButton";
import { ElevatedUnderglowCTA } from "@/components/ElevatedUnderglowCTA";
import { LedMatrixChevronButton, LedMatrixInteractionMode } from "@/components/LedMatrixChevronButton";
import { SlideGrowButton } from "@/components/SlideGrowButton";
import { VintageLeatherCTA } from "@/components/VintageLeatherCTA";
import { NeumorphicGlowCTA } from "@/components/NeumorphicGlowCTA";
import { ArcCornerToggle } from "@/components/ArcCornerToggle";
import { MagneticPulseCTA } from "@/components/MagneticPulseCTA";
import { TactileNeumorphicToggle } from "@/components/TactileNeumorphicToggle";
import { TactileNeumorphicSwitch } from "@/components/TactileNeumorphicSwitch";
import { GlossyGelButton } from "@/components/GlossyGelButton";
import {
  ALL_DASHBOARD_COMPONENTS,
  ComponentCategory,
  PropRow,
  ComponentDetail,
  PresetVariant,
} from "./dashboardComponents";

// Full component source + Framer physics excerpts, re-used verbatim from the
// dedicated /buttons/<slug> studio screens so the Component Lab code panel shows
// the exact same files without a second copy.
import { ISOMETRIC_REVIVE_COMPONENT_SOURCE, ISOMETRIC_REVIVE_PHYSICS } from "@/screens/buttons/isometricRevive";
import { TACTILE_PILL_COMPONENT_SOURCE } from "@/screens/buttons/tactilePill";
import { FROSTED_GEL_DOWNLOAD_COMPONENT_SOURCE, FROSTED_GEL_DOWNLOAD_PHYSICS } from "@/screens/buttons/frostedGelDownload";
import { ELEVATED_UNDERGLOW_COMPONENT_SOURCE } from "@/screens/buttons/elevatedUnderglow";
import { LED_MATRIX_CHEVRON_COMPONENT_SOURCE } from "@/screens/buttons/ledMatrixChevron";
import { SLIDE_GROW_COMPONENT_SOURCE } from "@/screens/buttons/slideGrow";
import { VINTAGE_LEATHER_COMPONENT_SOURCE } from "@/screens/buttons/vintageLeather";
import { NEUMORPHIC_GLOW_COMPONENT_SOURCE } from "@/screens/buttons/neumorphicGlow";
import { SMASH_BUTTON_COMPONENT_SOURCE } from "@/screens/buttons/smashButton";
import { SCALING_CAPSULE_COMPONENT_SOURCE } from "@/screens/buttons/scalingCapsule";
import { MAGNETIC_PULSE_COMPONENT_SOURCE } from "@/screens/buttons/magneticPulse";
import { ANIMATED_SLIDE_COMPONENT_SOURCE } from "@/screens/buttons/animatedSlide";
import { ARC_CORNER_TOGGLE_COMPONENT_SOURCE } from "@/screens/buttons/arcCornerToggle";
import { TACTILE_NEUMORPHIC_SWITCH_COMPONENT_SOURCE, TACTILE_NEUMORPHIC_SWITCH_PHYSICS } from "@/screens/buttons/tactileNeumorphicSwitch";

export { ALL_DASHBOARD_COMPONENTS };
export type { ComponentCategory, PropRow, ComponentDetail, PresetVariant };

type CodeTab = "component" | "jsx" | "html" | "css" | "physics";

interface ButtonCodeEntry {
  /** File name shown in the code tab header. */
  file: string;
  /** Full drop-in component source (Component.tsx tab). */
  componentCode: string;
  /** Optional Framer Motion spring excerpt (Physics.ts tab). */
  physicsCode?: string;
}

const BUTTON_CODE: Record<string, ButtonCodeEntry> = {
  "isometric-revive-button": { file: "IsometricReviveButton.tsx", componentCode: ISOMETRIC_REVIVE_COMPONENT_SOURCE, physicsCode: ISOMETRIC_REVIVE_PHYSICS },
  "tactile-pill-button": { file: "TactilePillButton.tsx", componentCode: TACTILE_PILL_COMPONENT_SOURCE },
  "frosted-gel-download-button": { file: "FrostedGelDownloadButton.tsx", componentCode: FROSTED_GEL_DOWNLOAD_COMPONENT_SOURCE, physicsCode: FROSTED_GEL_DOWNLOAD_PHYSICS },
  "elevated-underglow-cta": { file: "ElevatedUnderglowCTA.tsx", componentCode: ELEVATED_UNDERGLOW_COMPONENT_SOURCE },
  "led-matrix-chevron": { file: "LedMatrixChevronButton.tsx", componentCode: LED_MATRIX_CHEVRON_COMPONENT_SOURCE },
  "slide-grow-button": { file: "SlideGrowButton.tsx", componentCode: SLIDE_GROW_COMPONENT_SOURCE },
  "vintage-leather-cta": { file: "VintageLeatherCTA.tsx", componentCode: VINTAGE_LEATHER_COMPONENT_SOURCE },
  "neumorphic-glow-cta": { file: "NeumorphicGlowCTA.tsx", componentCode: NEUMORPHIC_GLOW_COMPONENT_SOURCE },
  "smash-tactile-button": { file: "SmashTactileButton.tsx", componentCode: SMASH_BUTTON_COMPONENT_SOURCE },
  "scaling-capsule-button": { file: "ScalingCapsuleButton.tsx", componentCode: SCALING_CAPSULE_COMPONENT_SOURCE },
  "magnetic-pulse-cta": { file: "MagneticPulseCTA.tsx", componentCode: MAGNETIC_PULSE_COMPONENT_SOURCE },
  "animated-slide-button": { file: "AnimatedButton.tsx", componentCode: ANIMATED_SLIDE_COMPONENT_SOURCE },
  "arc-corner-toggle": { file: "ArcCornerToggle.tsx", componentCode: ARC_CORNER_TOGGLE_COMPONENT_SOURCE },
  "tactile-neumorphic-switch": { file: "TactileNeumorphicSwitch.tsx", componentCode: TACTILE_NEUMORPHIC_SWITCH_COMPONENT_SOURCE, physicsCode: TACTILE_NEUMORPHIC_SWITCH_PHYSICS },
};

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
  const [activeCodeTab, setActiveCodeTab] = useState<CodeTab>("component");
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // ── Playground Dynamic State ──────────────────────────────────────────
  const [customLabel, setCustomLabel] = useState<string>("");
  const [customSize, setCustomSize] = useState<"xs" | "sm" | "md" | "lg" | "xl">("md");
  const [customTheme, setCustomTheme] = useState<string>("");
  const [customDotColor, setCustomDotColor] = useState<string>("#54EAD8");
  const [customIcon, setCustomIcon] = useState<string>("cloud-download");
  const [customLiftAmount, setCustomLiftAmount] = useState<number>(13);
  const [customInteractionMode, setCustomInteractionMode] = useState<LedMatrixInteractionMode>("hover");
  const [customStepSpeedMs, setCustomStepSpeedMs] = useState<number>(110);
  const [customShowOrnaments, setCustomShowOrnaments] = useState<boolean>(true);
  const [customShowCables, setCustomShowCables] = useState<boolean>(true);
  const [customIntensity, setCustomIntensity] = useState<IsometricGlowIntensity>("vibrant");
  const [customStateMode, setCustomStateMode] = useState<"interactive" | "standerd" | "hover">("interactive");
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [clickCount, setClickCount] = useState<number>(0);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const centerScrollRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialComponentId) {
      setSelectedComponentId(initialComponentId);
    }
  }, [initialComponentId]);

  const selectedComponent = useMemo(
    () => ALL_DASHBOARD_COMPONENTS.find((c) => c.id === selectedComponentId) ?? ALL_DASHBOARD_COMPONENTS[0],
    [selectedComponentId]
  );

  // Drop-in source + physics excerpt for this component, straight from its button screen.
  const codeEntry = BUTTON_CODE[selectedComponent.id];

  // Fall back to a valid tab: not every component ships a Component.tsx / Physics.ts.
  const effectiveCodeTab: CodeTab =
    (activeCodeTab === "component" && !codeEntry?.componentCode) ||
    (activeCodeTab === "physics" && !codeEntry?.physicsCode)
      ? "jsx"
      : activeCodeTab;

  // Sync playground initial state when selected component changes
  useEffect(() => {
    setCustomLabel(selectedComponent.defaultLabel || "Button");
    setCustomSize("md");
    setCustomTheme(selectedComponent.defaultTheme || "default");
    setCustomDotColor(selectedComponent.defaultDotColor || "#54EAD8");
    setCustomIcon(
      (selectedComponent.defaultIcon as string) ||
      (selectedComponent.id === "elevated-underglow-cta" ? "phone" : "cloud-download")
    );
    setCustomLiftAmount(
      selectedComponent.defaultLiftAmount !== undefined
        ? selectedComponent.defaultLiftAmount
        : 13
    );
    setCustomInteractionMode(
      (selectedComponent.defaultInteractionMode as LedMatrixInteractionMode) || "hover"
    );
    setCustomStepSpeedMs(
      selectedComponent.defaultStepSpeedMs !== undefined
        ? selectedComponent.defaultStepSpeedMs
        : 110
    );
    setCustomShowOrnaments(
      selectedComponent.defaultShowOrnaments !== undefined
        ? selectedComponent.defaultShowOrnaments
        : true
    );
    setCustomShowCables(selectedComponent.defaultShowCables !== undefined ? selectedComponent.defaultShowCables : true);
    setCustomIntensity((selectedComponent.defaultIntensity as IsometricGlowIntensity) || "vibrant");
    setCustomStateMode("interactive");
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
      const cat = c.categoryLabel || "Buttons & CTAs";
      if (!map[cat]) map[cat] = [];
      map[cat].push(c);
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

  const handleSelectComponent = useCallback((id: string) => {
    setSelectedComponentId(id);
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", `/componentlab/${id}`);
    }
    setMobileSidebarOpen(false);
    centerScrollRef.current?.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  // Keyboard navigation
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
  }, [nextComponent, prevComponent, handleSelectComponent]);

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
      intensity="${customIntensity}"
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
      dotColor="${customDotColor || "#54EAD8"}"
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
      icon="${customIcon}"
      showCables={${customShowCables}}
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
      icon="${customIcon || "phone"}"
      liftAmount={${customLiftAmount}}
      onClick={() => console.log("Call triggered")}
    />
  );
}`;
      case "led-matrix-chevron":
        return `import { LedMatrixChevronButton } from "@/components/LedMatrixChevronButton";

export default function Example() {
  return (
    <LedMatrixChevronButton
      label="${customLabel || "See Plans"}"
      theme="${customTheme || "monochrome"}"
      size="${customSize}"
      interactionMode="${customInteractionMode}"
      stepSpeedMs={${customStepSpeedMs}}
      onClick={() => console.log("LED Matrix Clicked")}
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
      label="${customLabel || "Shop ties"}"
      theme="${customTheme}"
      size="${customSize}"
      showOrnaments={${customShowOrnaments}}
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
      case "animated-slide-button":
        return `import { AnimatedButton } from "@/components/AnimatedButton";

export default function Example() {
  return (
    <AnimatedButton
      primaryText="${customLabel || "Explore Services"}"
      hoverText="See More →"
      variant="${customTheme === "secondary" ? "secondary" : "primary"}"
    />
  );
}`;
      case "tactile-neumorphic-toggle":
        return `import { TactileNeumorphicToggle } from "@/components/TactileNeumorphicToggle";

export default function Example() {
  return (
    <TactileNeumorphicToggle
      theme="${customTheme}"
      size="${customSize}"
      label="${customLabel}"
      defaultChecked={true}
      onChange={(checked) => console.log("Toggle state:", checked)}
    />
  );
}`;
      case "tactile-neumorphic-switch":
        return `import { TactileNeumorphicSwitch } from "@/components/TactileNeumorphicSwitch";

export default function Example() {
  return (
    <TactileNeumorphicSwitch
      theme="${customTheme}"
      size="${customSize}"
      defaultChecked={true}
      onChange={(checked) => console.log("Switch state:", checked)}
    />
  );
}`;
      case "glossy-gel-button":
        return `import { GlossyGelButton } from "@/components/GlossyGelButton";

export default function Example() {
  return (
    <GlossyGelButton
      theme="${customTheme}"
      size="${customSize}"
      onClick={() => console.log("Clicked")}
    >
      ${customLabel || "Get Started"}
    </GlossyGelButton>
  );
}`;
      default:
        return selectedComponent.jsxCode;
    }
  }, [selectedComponent, customLabel, customTheme, customSize]);

  const activeCode =
    effectiveCodeTab === "component"
      ? codeEntry?.componentCode ?? dynamicJsxCode
      : effectiveCodeTab === "physics"
        ? codeEntry?.physicsCode ?? ""
        : effectiveCodeTab === "jsx"
          ? dynamicJsxCode
          : effectiveCodeTab === "html"
            ? selectedComponent.htmlCode
            : selectedComponent.cssCode;

  const isLightPage = pageTheme === "light";

  // ── Render Dynamic Component in Playground ────────────────────────────
  const renderInteractivePlaygroundComponent = () => {
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
              intensity={customIntensity}
              stateMode={customStateMode}
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
              dotColor={customDotColor || tactileDotColorMap[tactileVariant] || "#54EAD8"}
              size={customSize}
              stateMode={customStateMode}
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
              icon={customIcon as FrostedGelIcon}
              showCables={customShowCables}
              stateMode={customStateMode}
              onClick={() => handleTriggerAction("Gel Download Triggered")}
            />
          </div>
        );
      }
      case "elevated-underglow-cta": {
        const validUnderglowThemes = ["figma", "uipirate", "emerald", "violet", "crimson", "dark"];
        const underglowTheme = safeTheme(customTheme, validUnderglowThemes, "figma");
        return (
          <div className="py-8 flex items-center justify-center">
            <ElevatedUnderglowCTA
              label={customLabel || "Book A Call"}
              theme={underglowTheme as any}
              size={customSize}
              stateMode={customStateMode}
              icon={(customIcon as any) || "phone"}
              liftAmount={customLiftAmount}
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
              stateMode={customStateMode}
              interactionMode={customInteractionMode}
              stepSpeedMs={customStepSpeedMs}
              onClick={() => handleTriggerAction("LED Matrix Clicked")}
            />
          </div>
        );
      }
      case "slide-grow-button": {
        const validSlideThemes = ["silver", "dark", "uipirate", "cyberpunk", "emerald", "orange"];
        const slideTheme = safeTheme(customTheme, validSlideThemes, "silver");
        return (
          <div className="py-8 flex items-center justify-center">
            <SlideGrowButton
              startLabel={customLabel || "Get Started"}
              theme={slideTheme as any}
              size={customSize}
              stateMode={customStateMode}
              onComplete={() => handleTriggerAction("Swipe Gesture Completed")}
            />
          </div>
        );
      }
      case "vintage-leather-cta": {
        const validLeatherThemes = ["heritage", "uipirate", "obsidian", "emerald", "ruby", "silver", "pirate"];
        const leatherTheme = safeTheme(customTheme, validLeatherThemes, "heritage");
        return (
          <div className="py-8 flex items-center justify-center">
            <VintageLeatherCTA
              label={customLabel || "Shop ties"}
              theme={leatherTheme as any}
              size={customSize}
              stateMode={customStateMode}
              showOrnaments={customShowOrnaments}
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
              stateMode={customStateMode}
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
              stateMode={customStateMode}
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
              stateMode={customStateMode}
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
              size={customSize}
              stateMode={customStateMode}
              onClick={() => handleTriggerAction("Magnetic Pulse Fired")}
            />
          </div>
        );
      case "animated-slide-button":
        return (
          <div className="py-8 flex items-center justify-center w-full mx-auto">
            <AnimatedButton
              primaryText={customLabel || "Explore Services"}
              hoverText="See More →"
              variant={customTheme === "secondary" ? "secondary" : "primary"}
              size={customSize}
              stateMode={customStateMode}
              className="!mt-0"
              fullWidth={false}
              onClick={() => handleTriggerAction("Slide Button Clicked")}
            />
          </div>
        );
      case "arc-corner-toggle":
        return (
          <div className="py-8 flex items-center justify-center">
            <ArcCornerToggle
              size={customSize}
              stateMode={customStateMode}
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
      case "tactile-neumorphic-toggle": {
        const validToggleThemes = ["brushed-silver", "dark-obsidian", "cyber-cyan", "emerald-glow", "magma-orange", "hyper-violet"];
        const toggleTheme = safeTheme(customTheme, validToggleThemes, "brushed-silver");
        return (
          <div className="py-8 flex items-center justify-center">
            <TactileNeumorphicToggle
              theme={toggleTheme as any}
              size={customSize}
              stateMode={customStateMode}
              label={customLabel || "Tactile Toggle"}
              defaultChecked={true}
              onChange={(st) => handleTriggerAction(`Toggle: ${st ? "ON" : "OFF"}`)}
            />
          </div>
        );
      }
      case "tactile-neumorphic-switch": {
        const validSwitchThemes = ["emerald-photon", "cyber-cyan", "magma-orange", "dark-obsidian", "hyper-violet", "amber-crt"];
        const switchTheme = safeTheme(customTheme, validSwitchThemes, "emerald-photon");
        return (
          <div className="py-12 flex items-center justify-center">
            <TactileNeumorphicSwitch
              theme={switchTheme as any}
              size={customSize}
              stateMode={customStateMode}
              defaultChecked={true}
              onChange={(st) => handleTriggerAction(`Switch: ${st ? "ON" : "OFF"}`)}
            />
          </div>
        );
      }
      case "glossy-gel-button": {
        const validGelThemes = ["emerald-gel", "cyan-gel", "violet-gel", "magma-gel", "silver-glass", "obsidian-glass"];
        const gelTheme = safeTheme(customTheme, validGelThemes, "emerald-gel");
        return (
          <div className="py-8 flex items-center justify-center">
            <GlossyGelButton
              theme={gelTheme as any}
              size={customSize}
              stateMode={customStateMode}
              onClick={() => handleTriggerAction("Glossy Gel CTA Clicked")}
            >
              {customLabel || "Get Started"}
            </GlossyGelButton>
          </div>
        );
      }
      default:
        return canvasTheme === "light" ? selectedComponent.previewLight : selectedComponent.previewDark;
    }
  };

  // Breadcrumbs
  const breadcrumbNav = (
    <nav
      className={`flex items-center gap-2 text-xs font-mono ${isLightPage ? "text-gray-500" : "text-gray-400"
        }`}
    >
      <Link href="/componentlab" className={`transition-colors ${isLightPage ? "hover:text-gray-900" : "hover:text-white"}`}>
        Component Lab
      </Link>
      <span>/</span>
      <span className={isLightPage ? "text-gray-600" : "text-gray-400"}>{selectedComponent.categoryLabel}</span>
      <span>/</span>
      <span className="text-[#FF5B04] font-semibold">{selectedComponent.name}</span>
    </nav>
  );

  // Previous / Next Component Pager
  const componentPagerNav = (
    <div className={`pt-8 border-t grid grid-cols-1 sm:grid-cols-2 gap-4 ${isLightPage ? "border-gray-200" : "border-white/10"}`}>
      {prevComponent ? (
        <button
          onClick={() => handleSelectComponent(prevComponent.id)}
          className={`p-5 rounded-2xl border text-left transition-all group cursor-pointer ${isLightPage
              ? "bg-white border-gray-200 hover:border-gray-300 shadow-sm"
              : "bg-[#121216] border-white/10 hover:border-white/20 shadow-lg"
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
              : "bg-[#121216] border-white/10 hover:border-white/20 shadow-lg"
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
              <span className="hidden sm:inline">Hub</span>
            </Link>

            <div className="h-4 w-px bg-gray-300 dark:bg-white/10 hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF5B04] animate-pulse" />
              <span className={`text-xs font-mono font-bold truncate max-w-[150px] sm:max-w-xs ${isLightPage ? "text-gray-900" : "text-white"}`}>
                {selectedComponent.name}
              </span>
              <span className="hidden md:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#FF5B04]/10 text-[#FF5B04] border border-[#FF5B04]/20">
                {selectedComponent.categoryLabel}
              </span>
            </div>
          </div>

          {/* Right Controls: Keyboard Shortcuts + Page Theme */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Keyboard hint */}
            <div className="hidden xl:flex items-center gap-1 text-[10px] font-mono text-gray-400 mr-1">
              <kbd className={`px-1.5 py-0.5 rounded border ${isLightPage ? "bg-gray-100 border-gray-300 text-gray-600" : "bg-white/5 border-white/10 text-gray-400"}`}>J</kbd>
              <kbd className={`px-1.5 py-0.5 rounded border ${isLightPage ? "bg-gray-100 border-gray-300 text-gray-600" : "bg-white/5 border-white/10 text-gray-400"}`}>K</kbd>
              <span>navigate</span>
            </div>

            {/* Page Theme Toggle */}
            <button
              onClick={() => setPageTheme(pageTheme === "dark" ? "light" : "dark")}
              className={`p-1.5 rounded-xl border transition-all cursor-pointer ${isLightPage
                  ? "bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-800"
                  : "bg-white/5 hover:bg-white/10 border-white/10 text-gray-200 hover:text-white"
                }`}
              title="Toggle page light / dark mode"
              aria-label="Toggle page theme"
            >
              {isLightPage ? <MoonIcon /> : <SunIcon />}
            </button>
          </div>
        </header>

        {/* ── Main Split View ─────────────────────────────────────────── */}
        <div className="flex-1 flex overflow-hidden">
          {/* ── Left Component Selector Sidebar ────────────────────────── */}
          <aside
            data-lenis-prevent="true"
            className={`w-72 shrink-0 border-r flex flex-col transition-all duration-300 z-40 ${isLightPage
                ? "bg-white/80 border-gray-200 backdrop-blur-xl"
                : "bg-[#0D0D11]/90 border-white/8 backdrop-blur-xl"
              } ${mobileSidebarOpen
                ? "fixed inset-y-14 left-0 w-72 shadow-2xl z-50 bg-inherit"
                : "hidden lg:flex"
              }`}
          >
            {/* Sidebar Search */}
            <div className="p-3 border-b border-inherit">
              <div className="relative">
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Filter components..."
                  value={sidebarSearch}
                  onChange={(e) => setSidebarSearch(e.target.value)}
                  className={`w-full pl-8 pr-3 py-1.5 rounded-xl text-xs font-mono transition-colors focus:outline-none focus:border-[#FF5B04] ${isLightPage
                      ? "bg-gray-100 border border-gray-200 text-gray-900 placeholder-gray-400"
                      : "bg-white/5 border border-white/10 text-white placeholder-gray-500"
                    }`}
                />
              </div>
            </div>

            {/* Sidebar Component Tree */}
            <div className="flex-1 overflow-y-auto p-3 space-y-5 scrollbar-thin">
              {Object.entries(groupedSidebar).map(([category, items]) => {
                if (items.length === 0) return null;
                return (
                  <div key={category} className="space-y-1">
                    <div className="px-2 py-1 flex items-center justify-between text-[11px] font-mono font-bold tracking-wider uppercase text-gray-400">
                      <span>{category}</span>
                      <span className="text-[10px] font-normal opacity-70">({items.length})</span>
                    </div>

                    <div className="space-y-0.5">
                      {items.map((item) => {
                        const isSelected = item.id === selectedComponent.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleSelectComponent(item.id)}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center justify-between group cursor-pointer ${isSelected
                                ? isLightPage
                                  ? "bg-orange-50 border border-orange-200 text-[#FF5B04] font-bold shadow-sm"
                                  : "bg-[#FF5B04]/15 border border-[#FF5B04]/30 text-[#FF5B04] font-bold shadow-sm"
                                : isLightPage
                                  ? "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                  : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                              }`}
                          >
                            <span className="truncate">{item.name}</span>
                            {item.badge && (
                              <span
                                className={`text-[10px] font-mono px-1.5 py-0.5 rounded border shrink-0 ${isSelected
                                    ? "bg-[#FF5B04]/20 border-[#FF5B04]/40 text-[#FF5B04]"
                                    : isLightPage
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

          {/* ── Main Detail Content Area ─────────────────────────────────── */}
          <main
            ref={centerScrollRef}
            data-lenis-prevent="true"
            className="flex-1 h-[calc(100vh-3.5rem)] overflow-y-auto min-w-0 min-h-0 p-6 sm:p-10 lg:p-12 space-y-12 scroll-smooth overscroll-contain scrollbar-thin"
          >
            <div className="max-w-5xl mx-auto space-y-12 pb-16">
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
                      <span className="text-emerald-500 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20">
                        ✓ {lastAction}
                      </span>
                    )}
                  </div>
                </div>

                {/* Studio frame */}
                <div
                  className={`rounded-3xl overflow-hidden border shadow-2xl transition-colors ${isLightPage ? "border-gray-200 bg-white" : "border-white/10 bg-[#121216]"
                    }`}
                >
                  <StudioCanvas
                    theme={canvasTheme}
                    showGrid={showGrid}
                    onThemeChange={setCanvasTheme}
                    onGridChange={setShowGrid}
                    title={`${selectedComponent.id}.tsx`}
                  >
                    <div className="w-full flex items-center justify-center">
                      {renderInteractivePlaygroundComponent()}
                    </div>
                  </StudioCanvas>
                </div>

                {/* Customizer */}
                <div
                  className={`rounded-3xl border p-6 space-y-5 transition-colors ${isLightPage ? "border-gray-200 bg-white shadow-sm" : "border-white/10 bg-white/[0.03]"
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
                        setCustomDotColor(selectedComponent.defaultDotColor || "#54EAD8");
                        setCustomIcon(
                          (selectedComponent.defaultIcon as string) ||
                          (selectedComponent.id === "elevated-underglow-cta" ? "phone" : "cloud-download")
                        );
                        setCustomLiftAmount(
                          selectedComponent.defaultLiftAmount !== undefined
                            ? selectedComponent.defaultLiftAmount
                            : 13
                        );
                        setCustomInteractionMode(
                          (selectedComponent.defaultInteractionMode as LedMatrixInteractionMode) || "hover"
                        );
                        setCustomStepSpeedMs(
                          selectedComponent.defaultStepSpeedMs !== undefined
                            ? selectedComponent.defaultStepSpeedMs
                            : 110
                        );
                        setCustomShowOrnaments(
                          selectedComponent.defaultShowOrnaments !== undefined
                            ? selectedComponent.defaultShowOrnaments
                            : true
                        );
                        setCustomShowCables(selectedComponent.defaultShowCables !== undefined ? selectedComponent.defaultShowCables : true);
                        setCustomIntensity((selectedComponent.defaultIntensity as IsometricGlowIntensity) || "vibrant");
                        setCustomStateMode("interactive");
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
                        <select
                          value={customSize}
                          onChange={(e) => setCustomSize(e.target.value as "xs" | "sm" | "md" | "lg" | "xl")}
                          className={`w-full px-3.5 py-2 rounded-xl text-xs transition-colors focus:outline-none focus:border-[#FF5B04] font-mono cursor-pointer ${isLightPage
                              ? "bg-gray-100 border border-gray-200 text-gray-900"
                              : "bg-black/50 border border-white/10 text-white"
                            }`}
                        >
                          <option value="xs" className={isLightPage ? "bg-white text-gray-900" : "bg-[#151518] text-white"}>
                            Extra Small (xs)
                          </option>
                          <option value="sm" className={isLightPage ? "bg-white text-gray-900" : "bg-[#151518] text-white"}>
                            Small (sm)
                          </option>
                          <option value="md" className={isLightPage ? "bg-white text-gray-900" : "bg-[#151518] text-white"}>
                            Medium (md)
                          </option>
                          <option value="lg" className={isLightPage ? "bg-white text-gray-900" : "bg-[#151518] text-white"}>
                            Large (lg)
                          </option>
                          <option value="xl" className={isLightPage ? "bg-white text-gray-900" : "bg-[#151518] text-white"}>
                            Extra Large (xl)
                          </option>
                        </select>
                      </div>
                    )}

                    {/* 3. Theme / Variant Dropdown */}
                    {selectedComponent.hasThemeControl && selectedComponent.availableThemes && (
                      <div className="space-y-1.5">
                        <label className={`block font-bold ${isLightPage ? "text-gray-700" : "text-gray-300"}`}>
                          Variant Theme:
                        </label>
                        <select
                          value={customTheme}
                          onChange={(e) => {
                            const newTheme = e.target.value;
                            setCustomTheme(newTheme);
                            if (selectedComponent.id === "tactile-pill-button") {
                              const tactileDotColorMap: Record<string, string> = {
                                default: "#54EAD8",
                                orange: "#FF5B04",
                                dark: "#A78BFA",
                                cyberpunk: "#10B981",
                                minimal: "#3B82F6",
                              };
                              if (tactileDotColorMap[newTheme]) {
                                setCustomDotColor(tactileDotColorMap[newTheme]);
                              }
                            }
                          }}
                          className={`w-full px-3.5 py-2 rounded-xl text-xs transition-colors focus:outline-none focus:border-[#FF5B04] font-mono cursor-pointer ${isLightPage
                              ? "bg-gray-100 border border-gray-200 text-gray-900"
                              : "bg-black/50 border border-white/10 text-white"
                            }`}
                        >
                          {selectedComponent.availableThemes.map((th) => (
                            <option
                              key={th.value}
                              value={th.value}
                              className={isLightPage ? "bg-white text-gray-900" : "bg-[#151518] text-white"}
                            >
                              {th.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* 3a. Beacon Dot Color Control */}
                    {(selectedComponent.hasDotColorControl || selectedComponent.id === "tactile-pill-button") && (
                      <div className="space-y-1.5">
                        <label className={`block font-bold ${isLightPage ? "text-gray-700" : "text-gray-300"}`}>
                          Beacon Dot Color:
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={customDotColor && customDotColor.startsWith("#") && customDotColor.length === 7 ? customDotColor : "#54EAD8"}
                            onChange={(e) => setCustomDotColor(e.target.value)}
                            className="w-9 h-[34px] rounded-xl cursor-pointer border border-white/10 bg-transparent p-1 shrink-0"
                          />
                          <input
                            type="text"
                            value={customDotColor}
                            onChange={(e) => setCustomDotColor(e.target.value)}
                            placeholder="#54EAD8"
                            className={`w-full px-3.5 py-2 rounded-xl text-xs font-mono transition-colors focus:outline-none focus:border-[#FF5B04] ${isLightPage
                                ? "bg-gray-100 border border-gray-200 text-gray-900 placeholder-gray-400"
                                : "bg-black/50 border border-white/10 text-white placeholder-gray-500"
                              }`}
                          />
                        </div>
                      </div>
                    )}

                    {/* 3b. Icon Control Dropdown */}
                    {selectedComponent.hasIconControl && selectedComponent.availableIcons && (
                      <div className="space-y-1.5">
                        <label className={`block font-bold ${isLightPage ? "text-gray-700" : "text-gray-300"}`}>
                          {selectedComponent.id === "elevated-underglow-cta" ? "Button Icon:" : "Tile Icon:"}
                        </label>
                        <select
                          value={customIcon}
                          onChange={(e) => setCustomIcon(e.target.value)}
                          className={`w-full px-3.5 py-2 rounded-xl text-xs transition-colors focus:outline-none focus:border-[#FF5B04] font-mono cursor-pointer ${isLightPage
                              ? "bg-gray-100 border border-gray-200 text-gray-900"
                              : "bg-black/50 border border-white/10 text-white"
                            }`}
                        >
                          {selectedComponent.availableIcons.map((ic) => (
                            <option
                              key={ic.value}
                              value={ic.value}
                              className={isLightPage ? "bg-white text-gray-900" : "bg-[#151518] text-white"}
                            >
                              {ic.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* 3c. Technical Cables Toggle */}
                    {selectedComponent.hasCablesControl && (
                      <div className="space-y-1.5">
                        <label className={`block font-bold ${isLightPage ? "text-gray-700" : "text-gray-300"}`}>
                          Trace Cables:
                        </label>
                        <select
                          value={customShowCables ? "true" : "false"}
                          onChange={(e) => setCustomShowCables(e.target.value === "true")}
                          className={`w-full px-3.5 py-2 rounded-xl text-xs transition-colors focus:outline-none focus:border-[#FF5B04] font-mono cursor-pointer ${isLightPage
                              ? "bg-gray-100 border border-gray-200 text-gray-900"
                              : "bg-black/50 border border-white/10 text-white"
                            }`}
                        >
                          <option value="true" className={isLightPage ? "bg-white text-gray-900" : "bg-[#151518] text-white"}>
                            Visible (Show Cables)
                          </option>
                          <option value="false" className={isLightPage ? "bg-white text-gray-900" : "bg-[#151518] text-white"}>
                            Hidden (No Cables)
                          </option>
                        </select>
                      </div>
                    )}

                    {/* 3d. Glow Intensity Dropdown */}
                    {selectedComponent.hasIntensityControl && (
                      <div className="space-y-1.5">
                        <label className={`block font-bold ${isLightPage ? "text-gray-700" : "text-gray-300"}`}>
                          Glow Intensity:
                        </label>
                        <select
                          value={customIntensity}
                          onChange={(e) => setCustomIntensity(e.target.value as IsometricGlowIntensity)}
                          className={`w-full px-3.5 py-2 rounded-xl text-xs transition-colors focus:outline-none focus:border-[#FF5B04] font-mono cursor-pointer ${isLightPage
                              ? "bg-gray-100 border border-gray-200 text-gray-900"
                              : "bg-black/50 border border-white/10 text-white"
                            }`}
                        >
                          <option value="subtle" className={isLightPage ? "bg-white text-gray-900" : "bg-[#151518] text-white"}>
                            Subtle (Soft Glow)
                          </option>
                          <option value="vibrant" className={isLightPage ? "bg-white text-gray-900" : "bg-[#151518] text-white"}>
                            Vibrant (Standard Glow)
                          </option>
                          <option value="hyper" className={isLightPage ? "bg-white text-gray-900" : "bg-[#151518] text-white"}>
                            Hyper (Max Radiation)
                          </option>
                        </select>
                      </div>
                    )}

                    {/* 3e. Lift Elevation Dropdown */}
                    {(selectedComponent.hasLiftControl || selectedComponent.id === "elevated-underglow-cta") && (
                      <div className="space-y-1.5">
                        <label className={`block font-bold ${isLightPage ? "text-gray-700" : "text-gray-300"}`}>
                          Lift Elevation:
                        </label>
                        <select
                          value={customLiftAmount}
                          onChange={(e) => setCustomLiftAmount(Number(e.target.value))}
                          className={`w-full px-3.5 py-2 rounded-xl text-xs transition-colors focus:outline-none focus:border-[#FF5B04] font-mono cursor-pointer ${isLightPage
                              ? "bg-gray-100 border border-gray-200 text-gray-900"
                              : "bg-black/50 border border-white/10 text-white"
                            }`}
                        >
                          <option value={0} className={isLightPage ? "bg-white text-gray-900" : "bg-[#151518] text-white"}>
                            Flat (0px)
                          </option>
                          <option value={6} className={isLightPage ? "bg-white text-gray-900" : "bg-[#151518] text-white"}>
                            Subtle (6px)
                          </option>
                          <option value={10} className={isLightPage ? "bg-white text-gray-900" : "bg-[#151518] text-white"}>
                            Medium (10px)
                          </option>
                          <option value={13} className={isLightPage ? "bg-white text-gray-900" : "bg-[#151518] text-white"}>
                            Default (13px - Figma)
                          </option>
                          <option value={18} className={isLightPage ? "bg-white text-gray-900" : "bg-[#151518] text-white"}>
                            High (18px)
                          </option>
                          <option value={24} className={isLightPage ? "bg-white text-gray-900" : "bg-[#151518] text-white"}>
                            Floating (24px)
                          </option>
                          {![0, 6, 10, 13, 18, 24].includes(customLiftAmount) && (
                            <option value={customLiftAmount} className={isLightPage ? "bg-white text-gray-900" : "bg-[#151518] text-white"}>
                              Custom ({customLiftAmount}px)
                            </option>
                          )}
                        </select>
                      </div>
                    )}

                    {/* 3f. Interaction Trigger Dropdown */}
                    {(selectedComponent.hasInteractionModeControl || selectedComponent.id === "led-matrix-chevron") && (
                      <div className="space-y-1.5">
                        <label className={`block font-bold ${isLightPage ? "text-gray-700" : "text-gray-300"}`}>
                          Interaction Trigger:
                        </label>
                        <select
                          value={customInteractionMode}
                          onChange={(e) => setCustomInteractionMode(e.target.value as LedMatrixInteractionMode)}
                          className={`w-full px-3.5 py-2 rounded-xl text-xs transition-colors focus:outline-none focus:border-[#FF5B04] font-mono cursor-pointer ${isLightPage
                              ? "bg-gray-100 border border-gray-200 text-gray-900"
                              : "bg-black/50 border border-white/10 text-white"
                            }`}
                        >
                          <option value="hover" className={isLightPage ? "bg-white text-gray-900" : "bg-[#151518] text-white"}>
                            Hover (Expand on Hover)
                          </option>
                          <option value="click" className={isLightPage ? "bg-white text-gray-900" : "bg-[#151518] text-white"}>
                            Click (Expand on Click)
                          </option>
                          <option value="both" className={isLightPage ? "bg-white text-gray-900" : "bg-[#151518] text-white"}>
                            Both (Hover &amp; Click)
                          </option>
                        </select>
                      </div>
                    )}

                    {/* 3g. LED Shift Speed Dropdown */}
                    {(selectedComponent.hasStepSpeedControl || selectedComponent.id === "led-matrix-chevron") && (
                      <div className="space-y-1.5">
                        <label className={`block font-bold ${isLightPage ? "text-gray-700" : "text-gray-300"}`}>
                          LED Shift Speed:
                        </label>
                        <select
                          value={customStepSpeedMs}
                          onChange={(e) => setCustomStepSpeedMs(Number(e.target.value))}
                          className={`w-full px-3.5 py-2 rounded-xl text-xs transition-colors focus:outline-none focus:border-[#FF5B04] font-mono cursor-pointer ${isLightPage
                              ? "bg-gray-100 border border-gray-200 text-gray-900"
                              : "bg-black/50 border border-white/10 text-white"
                            }`}
                        >
                          <option value={60} className={isLightPage ? "bg-white text-gray-900" : "bg-[#151518] text-white"}>
                            Turbo (60ms)
                          </option>
                          <option value={80} className={isLightPage ? "bg-white text-gray-900" : "bg-[#151518] text-white"}>
                            Fast (80ms)
                          </option>
                          <option value={110} className={isLightPage ? "bg-white text-gray-900" : "bg-[#151518] text-white"}>
                            Standard (110ms - Figma)
                          </option>
                          <option value={160} className={isLightPage ? "bg-white text-gray-900" : "bg-[#151518] text-white"}>
                            Relaxed (160ms)
                          </option>
                          <option value={220} className={isLightPage ? "bg-white text-gray-900" : "bg-[#151518] text-white"}>
                            Slow Wave (220ms)
                          </option>
                          {![60, 80, 110, 160, 220].includes(customStepSpeedMs) && (
                            <option value={customStepSpeedMs} className={isLightPage ? "bg-white text-gray-900" : "bg-[#151518] text-white"}>
                              Custom ({customStepSpeedMs}ms)
                            </option>
                          )}
                        </select>
                      </div>
                    )}

                    {/* 3h. Filigree Corner Ornaments Dropdown */}
                    {(selectedComponent.hasOrnamentsControl || selectedComponent.id === "vintage-leather-cta") && (
                      <div className="space-y-1.5">
                        <label className={`block font-bold ${isLightPage ? "text-gray-700" : "text-gray-300"}`}>
                          Filigree Ornaments:
                        </label>
                        <select
                          value={customShowOrnaments ? "true" : "false"}
                          onChange={(e) => setCustomShowOrnaments(e.target.value === "true")}
                          className={`w-full px-3.5 py-2 rounded-xl text-xs transition-colors focus:outline-none focus:border-[#FF5B04] font-mono cursor-pointer ${isLightPage
                              ? "bg-gray-100 border border-gray-200 text-gray-900"
                              : "bg-black/50 border border-white/10 text-white"
                            }`}
                        >
                          <option value="true" className={isLightPage ? "bg-white text-gray-900" : "bg-[#151518] text-white"}>
                            Visible (Show Scrollwork)
                          </option>
                          <option value="false" className={isLightPage ? "bg-white text-gray-900" : "bg-[#151518] text-white"}>
                            Hidden (Clean Leather)
                          </option>
                        </select>
                      </div>
                    )}

                    {/* 4. State Preview Dropdown */}
                    {[
                      "isometric-revive-button",
                      "frosted-gel-download-button",
                      "elevated-underglow-cta",
                      "led-matrix-chevron",
                      "tactile-pill-button",
                      "vintage-leather-cta",
                      "neumorphic-glow-cta",
                      "smash-tactile-button",
                      "scaling-capsule-button",
                      "magnetic-pulse-cta",
                      "animated-slide-button",
                      "glossy-gel-button",
                      "slide-grow-button",
                      "arc-corner-toggle",
                      "tactile-neumorphic-toggle",
                      "tactile-neumorphic-switch",
                    ].includes(selectedComponent.id) && (
                        <div className="space-y-1.5">
                          <label className={`block font-bold ${isLightPage ? "text-gray-700" : "text-gray-300"}`}>
                            State Preview:
                          </label>
                          <select
                            value={customStateMode}
                            onChange={(e) => setCustomStateMode(e.target.value as "interactive" | "standerd" | "hover")}
                            className={`w-full px-3.5 py-2 rounded-xl text-xs transition-colors focus:outline-none focus:border-[#FF5B04] font-mono cursor-pointer ${isLightPage
                                ? "bg-gray-100 border border-gray-200 text-gray-900"
                                : "bg-black/50 border border-white/10 text-white"
                              }`}
                          >
                            <option value="interactive" className={isLightPage ? "bg-white text-gray-900" : "bg-[#151518] text-white"}>
                              Interactive
                            </option>
                            <option value="standerd" className={isLightPage ? "bg-white text-gray-900" : "bg-[#151518] text-white"}>
                              Standard
                            </option>
                            <option value="hover" className={isLightPage ? "bg-white text-gray-900" : "bg-[#151518] text-white"}>
                              {[
                                "arc-corner-toggle",
                                "tactile-neumorphic-toggle",
                                "tactile-neumorphic-switch",
                              ].includes(selectedComponent.id)
                                ? "Click"
                                : "Hover"}
                            </option>
                          </select>
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
                    className={`border rounded-3xl p-6 sm:p-8 shadow-xl transition-colors ${isLightPage ? "bg-white border-gray-200 shadow-sm" : "bg-[#121216] border-white/10"
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
                    onClick={() => handleCopy(activeCode, effectiveCodeTab)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-[#FF5B04] border border-orange-500/30 text-xs font-mono font-bold transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    {copiedTab === effectiveCodeTab ? <CheckIcon /> : <CopyIcon />}
                    <span>{copiedTab === effectiveCodeTab ? "Copied to Clipboard!" : "Copy Active Code"}</span>
                  </button>
                </div>

                <div className="border border-white/10 rounded-3xl overflow-hidden shadow-2xl bg-[#0E0E12]">
                  {/* Code Tabs Header */}
                  <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-[#14141E]">
                    <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/5 text-xs font-mono">
                      {codeEntry?.componentCode && (
                        <button
                          onClick={() => setActiveCodeTab("component")}
                          className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${effectiveCodeTab === "component"
                              ? "bg-[#FF5B04] text-white font-bold shadow"
                              : "text-gray-400 hover:text-white"
                            }`}
                        >
                          Component.tsx
                        </button>
                      )}
                      <button
                        onClick={() => setActiveCodeTab("jsx")}
                        className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${effectiveCodeTab === "jsx"
                            ? "bg-[#FF5B04] text-white font-bold shadow"
                            : "text-gray-400 hover:text-white"
                          }`}
                      >
                        Usage.tsx
                      </button>
                      <button
                        onClick={() => setActiveCodeTab("html")}
                        className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${effectiveCodeTab === "html"
                            ? "bg-[#FF5B04] text-white font-bold shadow"
                            : "text-gray-400 hover:text-white"
                          }`}
                      >
                        HTML
                      </button>
                      <button
                        onClick={() => setActiveCodeTab("css")}
                        className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${effectiveCodeTab === "css"
                            ? "bg-[#FF5B04] text-white font-bold shadow"
                            : "text-gray-400 hover:text-white"
                          }`}
                      >
                        Tokens.css
                      </button>
                      {codeEntry?.physicsCode && (
                        <button
                          onClick={() => setActiveCodeTab("physics")}
                          className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${effectiveCodeTab === "physics"
                              ? "bg-[#FF5B04] text-white font-bold shadow"
                              : "text-gray-400 hover:text-white"
                            }`}
                        >
                          Physics.ts
                        </button>
                      )}
                    </div>

                    <span className="text-xs font-mono text-gray-400 hidden sm:inline-block">
                      {effectiveCodeTab === "component"
                        ? codeEntry?.file ?? "Component.tsx"
                        : effectiveCodeTab === "physics"
                          ? "Framer Motion / Spring"
                          : effectiveCodeTab === "jsx"
                            ? "React 18 / 19"
                            : effectiveCodeTab === "html"
                              ? "Semantic HTML"
                              : "Tailwind / CSS Tokens"}
                    </span>
                  </div>

                  {/* Code Block */}
                  <div className="p-6 overflow-x-auto max-h-[460px] overflow-y-auto scrollbar-thin">
                    <pre className="text-xs sm:text-sm font-mono text-gray-300 leading-relaxed whitespace-pre">
                      <code>{activeCode}</code>
                    </pre>
                  </div>
                </div>
              </section>

              {/* ── 5. Peer Dependencies & Installation ────────────────── */}
              <section
                className={`border rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl transition-colors ${isLightPage ? "bg-white border-gray-200 text-gray-900 shadow-sm" : "bg-[#121216] border-white/10 text-white"
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
                    className={`border rounded-3xl overflow-hidden shadow-xl transition-colors ${isLightPage ? "bg-white border-gray-200 shadow-sm" : "bg-[#121216] border-white/10"
                      }`}
                  >
                    <div className="overflow-x-auto scrollbar-thin">
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
          </main>

          {/* ── Right Table of Contents (Sticky On This Page) ──────────────── */}
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
        </div>
      </div>
    </PageWrapper>
  );
}
