import React from "react";
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

export type ComponentCategory = "buttons" | "controls" | "badges" | "surfaces";

export interface PropRow {
  name: string;
  type: string;
  defaultValue: string;
  description: string;
}

export interface PresetVariant {
  title: string;
  themeValue: string;
  themeProp: string;
  description: string;
  badgeColor?: string;
  renderPreview: (size?: "sm" | "md" | "lg") => React.ReactNode;
}

export interface ComponentDetail {
  id: string;
  name: string;
  category: ComponentCategory;
  categoryLabel: string;
  badge?: string;
  badgeColor?: string;
  description: string;
  detailUrl?: string;
  defaultLabel: string;
  hasLabelControl?: boolean;
  hasSizeControl?: boolean;
  hasThemeControl?: boolean;
  defaultTheme: string;
  availableThemes?: Array<{ value: string; label: string; color?: string }>;
  features: string[];
  previewLight: React.ReactNode;
  previewDark: React.ReactNode;
  jsxCode: string;
  htmlCode: string;
  cssCode: string;
  props: PropRow[];
  variantsList?: PresetVariant[];
}

export const ALL_DASHBOARD_COMPONENTS: ComponentDetail[] = [
  {
    id: "isometric-revive-button",
    name: "Isometric 3D Revive Button",
    category: "buttons",
    categoryLabel: "Buttons & CTAs",
    badge: "Isometric 30°",
    badgeColor: "#F59E0B",
    description:
      "Authentic 30° isometric 3D extruded button featuring dynamic spring depression, obsidian bevel walls, amber indicator flare, and blinding optical neon underglow.",
    detailUrl: "/componentlab/isometric-revive-button",
    defaultLabel: "Revive Now",
    hasLabelControl: true,
    hasSizeControl: true,
    hasThemeControl: true,
    defaultTheme: "figma",
    availableThemes: [
      { value: "figma", label: "Figma Obsidian", color: "#FFA000" },
      { value: "amber", label: "Amber Flare", color: "#F59E0B" },
      { value: "cyan", label: "Electric Cyan", color: "#06B6D4" },
      { value: "violet", label: "Cyber Violet", color: "#A855F7" },
      { value: "uipirate", label: "UI Pirate Magma", color: "#FF5B04" },
      { value: "gold-luxury", label: "Gold Luxury", color: "#EAB308" },
      { value: "emerald", label: "Emerald Pulse", color: "#10B981" },
      { value: "crimson", label: "Crimson Reactor", color: "#EF4444" },
    ],
    features: [
      "Authentic 30° isometric matrix projection",
      "Multi-layered extruded bevel side-walls",
      "Optical neon ground reflection rim",
      "Interactive 3D depression with spring damping",
    ],
    previewLight: (
      <div className="py-12 flex items-center justify-center">
        <IsometricReviveButton label="Revive Now" theme="figma" size="md" />
      </div>
    ),
    previewDark: (
      <div className="py-12 flex items-center justify-center">
        <IsometricReviveButton label="Revive Now" theme="figma" size="md" />
      </div>
    ),
    jsxCode: `import { IsometricReviveButton } from "@/components/IsometricReviveButton";

export default function Example() {
  return (
    <IsometricReviveButton
      label="Revive Now"
      theme="figma"
      size="md"
      onClick={() => console.log("Revive triggered")}
    />
  );
}`,
    htmlCode: `<div class="inline-block transform -rotate-12 skew-x-12 cursor-pointer">
  <div class="relative px-8 py-3.5 bg-gradient-to-b from-gray-700 to-gray-900 border-t border-white/30 rounded-xl shadow-[0_12px_0_#1E2024,0_20px_25px_rgba(0,0,0,0.5)] active:translate-y-2 active:shadow-[0_4px_0_#1E2024]">
    <span class="text-white font-mono font-bold text-xs uppercase tracking-wider">Revive Now</span>
  </div>
</div>`,
    cssCode: `/* Isometric 3D Tokens */
:root {
  --iso-angle: rotateX(60deg) rotateZ(-45deg);
  --iso-extrude: 0 10px 0 #18191c, 0 18px 24px rgba(0, 0, 0, 0.6);
  --iso-glow: 0 0 28px rgba(245, 158, 11, 0.4);
}`,
    props: [
      { name: "label", type: "string", defaultValue: '"Revive Now"', description: "Text rendered on the isometric faceplate." },
      { name: "theme", type: '"figma" | "amber" | "cyan" | "violet" | "uipirate" | "gold-luxury" | "emerald" | "crimson"', defaultValue: '"figma"', description: "Color theme for the isometric bevel extrusion." },
      { name: "size", type: '"sm" | "md" | "lg"', defaultValue: '"md"', description: "Controls scale matrix factor." },
      { name: "onClick", type: "() => void", defaultValue: "undefined", description: "Action callback on 3D button press." },
    ],
    variantsList: [
      {
        title: "Figma Master Obsidian",
        themeValue: "figma",
        themeProp: 'theme="figma"',
        badgeColor: "#FFA000",
        description: "1:1 Figma extruded obsidian bevels with amber indicator flare.",
        renderPreview: (sz = "sm") => <IsometricReviveButton theme="figma" label="Revive" size={sz} />,
      },
      {
        title: "Amber Solar Flare",
        themeValue: "amber",
        themeProp: 'theme="amber"',
        badgeColor: "#F59E0B",
        description: "Warm golden amber underglow with dual bevel highlights.",
        renderPreview: (sz = "sm") => <IsometricReviveButton theme="amber" label="Ignite" size={sz} />,
      },
      {
        title: "Electric Cyan",
        themeValue: "cyan",
        themeProp: 'theme="cyan"',
        badgeColor: "#06B6D4",
        description: "Laser cyan neon underlayer with high-contrast obsidian slab.",
        renderPreview: (sz = "sm") => <IsometricReviveButton theme="cyan" label="Deploy" size={sz} />,
      },
      {
        title: "Cyber Violet",
        themeValue: "violet",
        themeProp: 'theme="violet"',
        badgeColor: "#A855F7",
        description: "Ultraviolet neon underglow with cybernetic 3D extrusion.",
        renderPreview: (sz = "sm") => <IsometricReviveButton theme="violet" label="Upgrade" size={sz} />,
      },
      {
        title: "UI Pirate Magma",
        themeValue: "uipirate",
        themeProp: 'theme="uipirate"',
        badgeColor: "#FF5B04",
        description: "Signature brand magma orange 3D isometric bevel slab.",
        renderPreview: (sz = "sm") => <IsometricReviveButton theme="uipirate" label="Launch" size={sz} />,
      },
      {
        title: "Gold Luxury",
        themeValue: "gold-luxury",
        themeProp: 'theme="gold-luxury"',
        badgeColor: "#EAB308",
        description: "Prestige champagne gold walls with golden beacon flare.",
        renderPreview: (sz = "sm") => <IsometricReviveButton theme="gold-luxury" label="Unlock" size={sz} />,
      },
      {
        title: "Emerald Pulse",
        themeValue: "emerald",
        themeProp: 'theme="emerald"',
        badgeColor: "#10B981",
        description: "Toxic phosphor emerald underglow with high-precision bevel.",
        renderPreview: (sz = "sm") => <IsometricReviveButton theme="emerald" label="Activate" size={sz} />,
      },
      {
        title: "Crimson Reactor",
        themeValue: "crimson",
        themeProp: 'theme="crimson"',
        badgeColor: "#EF4444",
        description: "High-alert crimson red reactor bloom with dark obsidian walls.",
        renderPreview: (sz = "sm") => <IsometricReviveButton theme="crimson" label="Engage" size={sz} />,
      },
    ],
  },
  {
    id: "tactile-pill-button",
    name: "Tactile 3D Pill Button",
    category: "buttons",
    categoryLabel: "Buttons & CTAs",
    badge: "3D Tactile Spring",
    badgeColor: "#FF5B04",
    description:
      "Hyper-realistic 3D tactile button with recessed cavity slot, spring tilt physics, specular bevels, and glowing status beacon.",
    detailUrl: "/componentlab/tactile-pill-button",
    defaultLabel: "Get Started",
    hasLabelControl: true,
    hasSizeControl: true,
    hasThemeControl: true,
    defaultTheme: "default",
    availableThemes: [
      { value: "default", label: "Default Teal", color: "#00E5BE" },
      { value: "dark", label: "Dark Knight", color: "#3B82F6" },
      { value: "orange", label: "Magma Orange", color: "#FF5B04" },
      { value: "cyberpunk", label: "Cyberpunk Neon", color: "#EC4899" },
      { value: "minimal", label: "Minimal Frost", color: "#E2E8F0" },
    ],
    features: [
      "Recessed cavity slot with 3D depth shadows",
      "Interactive 60fps spring tilt and depress on click",
      "Pulsing radiant status beacon dot",
      "Light and dark mode tailored specular lighting",
    ],
    previewLight: (
      <div className="py-6 flex items-center justify-center">
        <TactilePillButton label="Get Started" dotColor="#00E5BE" variant="default" />
      </div>
    ),
    previewDark: (
      <div className="py-6 flex items-center justify-center">
        <TactilePillButton label="Get Started" dotColor="#00E5BE" variant="default" />
      </div>
    ),
    jsxCode: `import TactilePillButton from "@/components/TactilePillButton";

export default function Example() {
  return (
    <TactilePillButton
      label="Get Started"
      dotColor="#00E5BE"
      variant="default"
      onClick={() => console.log("Clicked")}
    />
  );
}`,
    htmlCode: `<div class="relative inline-flex items-center justify-center p-1.5 rounded-full bg-[#18181B] shadow-inner">
  <button class="relative px-8 py-3.5 rounded-full bg-gradient-to-b from-[#2A2A30] to-[#121216] text-white font-bold text-sm shadow-xl flex items-center gap-2.5 active:translate-y-0.5 transition-all">
    <span class="w-2.5 h-2.5 rounded-full bg-[#00E5BE] shadow-[0_0_8px_#00E5BE]"></span>
    <span>Get Started</span>
  </button>
</div>`,
    cssCode: `/* Tactile 3D Pill Tokens */
:root {
  --pill-bg-from: #2a2a30;
  --pill-bg-to: #121216;
  --pill-glow: 0 0 12px rgba(0, 229, 190, 0.6);
  --pill-shadow-3d: 0 8px 24px -4px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.2);
}`,
    props: [
      { name: "label", type: "string", defaultValue: '"Get Started"', description: "Primary button call-to-action text." },
      { name: "dotColor", type: "string", defaultValue: '"#00E5BE"', description: "Hex color code for the radiant glowing beacon indicator." },
      { name: "variant", type: '"default" | "dark" | "orange" | "cyberpunk" | "minimal"', defaultValue: '"default"', description: "Theme style variant matching light or dark surfaces." },
      { name: "onClick", type: "() => void", defaultValue: "undefined", description: "Optional click handler event." },
    ],
    variantsList: [
      {
        title: "Default Teal Glow",
        themeValue: "default",
        themeProp: 'variant="default"',
        badgeColor: "#00E5BE",
        description: "Teal beacon dot with dark ceramic pill and specular reflection.",
        renderPreview: (sz = "sm") => <TactilePillButton variant="default" label="Get Started" size={sz} />,
      },
      {
        title: "Dark Knight Obsidian",
        themeValue: "dark",
        themeProp: 'variant="dark"',
        badgeColor: "#3B82F6",
        description: "Monochrome obsidian capsule with electric blue glow beacon.",
        renderPreview: (sz = "sm") => <TactilePillButton variant="dark" label="Explore Dark" size={sz} />,
      },
      {
        title: "Magma Orange Flare",
        themeValue: "orange",
        themeProp: 'variant="orange"',
        badgeColor: "#FF5B04",
        description: "Signature brand magma orange bevel with high-energy beacon.",
        renderPreview: (sz = "sm") => <TactilePillButton variant="orange" label="Venture Now" size={sz} />,
      },
      {
        title: "Cyberpunk Neon",
        themeValue: "cyberpunk",
        themeProp: 'variant="cyberpunk"',
        badgeColor: "#EC4899",
        description: "Vibrant pink & cyan neo-cyberpunk lighting and spring physics.",
        renderPreview: (sz = "sm") => <TactilePillButton variant="cyberpunk" label="Overdrive" size={sz} />,
      },
    ],
  },
  {
    id: "frosted-gel-download-button",
    name: "Frosted Gel Download Button",
    category: "buttons",
    categoryLabel: "Buttons & CTAs",
    badge: "Glassmorphism",
    badgeColor: "#38BDF8",
    description:
      "Dual-pill neumorphic split button with elevated ceramic pill, frosted glass gel download tile, optical refraction rings, and volumetric blue underglow flare.",
    detailUrl: "/componentlab/frosted-gel-download-button",
    defaultLabel: "Download now",
    hasLabelControl: true,
    hasSizeControl: true,
    hasThemeControl: true,
    defaultTheme: "figma-blue",
    availableThemes: [
      { value: "figma-blue", label: "Figma Blue", color: "#38BDF8" },
      { value: "cyber-violet", label: "Cyber Violet", color: "#A855F7" },
      { value: "emerald-matrix", label: "Bio Emerald", color: "#10B981" },
      { value: "magma-orange", label: "Magma Orange", color: "#FF5B04" },
      { value: "dark-obsidian", label: "Dark Obsidian", color: "#64748B" },
      { value: "titanium-gold", label: "Titanium Gold", color: "#EAB308" },
    ],
    features: [
      "Dual-pill split layout with independently elevated ceramic base",
      "Frosted glass gel download tile with backdrop-blur refraction",
      "Volumetric electric blue optical underglow flare",
      "60fps spring lift on hover and click depression",
    ],
    previewLight: (
      <div className="py-6 flex items-center justify-center">
        <FrostedGelDownloadButton label="Download now" theme="figma-blue" size="md" />
      </div>
    ),
    previewDark: (
      <div className="py-6 flex items-center justify-center">
        <FrostedGelDownloadButton label="Download now" theme="figma-blue" size="md" />
      </div>
    ),
    jsxCode: `import { FrostedGelDownloadButton } from "@/components/FrostedGelDownloadButton";

export default function Example() {
  return (
    <FrostedGelDownloadButton
      label="Download now"
      theme="figma-blue"
      size="md"
      onClick={() => alert("Downloading asset...")}
    />
  );
}`,
    htmlCode: `<div class="inline-flex items-center gap-2 p-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
  <button class="px-6 py-2.5 rounded-full bg-white text-gray-900 font-bold text-xs shadow-md">
    Download now
  </button>
  <button class="p-2.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-400/30">
    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
  </button>
</div>`,
    cssCode: `/* Frosted Gel Download Tokens */
:root {
  --gel-glass-blur: blur(16px);
  --gel-underglow: 0 12px 32px rgba(56, 189, 248, 0.35);
  --gel-border-sheen: 1px solid rgba(255, 255, 255, 0.15);
}`,
    props: [
      { name: "label", type: "string", defaultValue: '"Download now"', description: "Text label displayed inside the elevated ceramic pill." },
      { name: "theme", type: '"figma-blue" | "cyber-violet" | "emerald-matrix" | "magma-orange" | "dark-obsidian" | "titanium-gold"', defaultValue: '"figma-blue"', description: "Color palette theme for the frosted gel tile and underglow." },
      { name: "size", type: '"sm" | "md" | "lg"', defaultValue: '"md"', description: "Controls dimensions and padding scale." },
      { name: "onClick", type: "() => void", defaultValue: "undefined", description: "Triggered on clicking the gel download button." },
    ],
    variantsList: [
      {
        title: "Figma Blue Flare",
        themeValue: "figma-blue",
        themeProp: 'theme="figma-blue"',
        badgeColor: "#38BDF8",
        description: "Signature electric blue volumetric gel cloud with optic refraction.",
        renderPreview: (sz = "sm") => <FrostedGelDownloadButton theme="figma-blue" label="Download" size={sz} />,
      },
      {
        title: "Cyber Violet",
        themeValue: "cyber-violet",
        themeProp: 'theme="cyber-violet"',
        badgeColor: "#A855F7",
        description: "Ultraviolet neon gel tile with translucent optical refraction.",
        renderPreview: (sz = "sm") => <FrostedGelDownloadButton theme="cyber-violet" label="Save Asset" size={sz} />,
      },
      {
        title: "Bio Emerald",
        themeValue: "emerald-matrix",
        themeProp: 'theme="emerald-matrix"',
        badgeColor: "#10B981",
        description: "Vibrant emerald green glass tile with translucent glow rim.",
        renderPreview: (sz = "sm") => <FrostedGelDownloadButton theme="emerald-matrix" label="Fetch File" size={sz} />,
      },
      {
        title: "Sunset Magma",
        themeValue: "magma-orange",
        themeProp: 'theme="magma-orange"',
        badgeColor: "#FF5B04",
        description: "Warm magma flame orange gel tile with photon underglow halo.",
        renderPreview: (sz = "sm") => <FrostedGelDownloadButton theme="magma-orange" label="Export" size={sz} />,
      },
    ],
  },
  {
    id: "elevated-underglow-cta",
    name: "Elevated Underglow 3D Button",
    category: "buttons",
    categoryLabel: "Buttons & CTAs",
    badge: "Tactile Elevation",
    badgeColor: "#38BDF8",
    description:
      "Interactive 3D tactile pill button that elevates 13px on hover to reveal a glowing electric blue extruded sub-chassis, bottom reflection rim, and realistic clay elevation physics.",
    detailUrl: "/componentlab/elevated-underglow-cta",
    defaultLabel: "Book A Call",
    hasLabelControl: true,
    hasSizeControl: true,
    hasThemeControl: true,
    defaultTheme: "figma",
    availableThemes: [
      { value: "figma", label: "Figma Cyan", color: "#38BDF8" },
      { value: "emerald", label: "Emerald Shield", color: "#10B981" },
      { value: "amber", label: "Amber Gold", color: "#F59E0B" },
    ],
    features: [
      "13px dynamic vertical spring elevation on hover",
      "Illuminated electric blue sub-chassis rim",
      "Tactile phone / call icon with specular highlights",
      "Soft diffuse claymorphic shadow stack",
    ],
    previewLight: (
      <div className="py-6 flex items-center justify-center">
        <ElevatedUnderglowCTA label="Book A Call" icon="phone" theme="figma" size="md" />
      </div>
    ),
    previewDark: (
      <div className="py-6 flex items-center justify-center">
        <ElevatedUnderglowCTA label="Book A Call" icon="phone" theme="figma" size="md" />
      </div>
    ),
    jsxCode: `import { ElevatedUnderglowCTA } from "@/components/ElevatedUnderglowCTA";

export default function Example() {
  return (
    <ElevatedUnderglowCTA
      label="Book A Call"
      icon="phone"
      theme="figma"
      size="md"
      onClick={() => window.open("/contact", "_blank")}
    />
  );
}`,
    htmlCode: `<div class="relative group cursor-pointer">
  <div class="absolute inset-0 rounded-full bg-blue-500 blur-lg opacity-40 group-hover:opacity-75 transition-opacity"></div>
  <button class="relative px-7 py-3 rounded-full bg-white text-gray-900 font-bold text-sm shadow-xl flex items-center gap-2 group-hover:-translate-y-1.5 transition-transform">
    <span>Book A Call</span>
  </button>
</div>`,
    cssCode: `/* Elevated Underglow Tokens */
:root {
  --underglow-blue: 0 14px 28px rgba(56, 189, 248, 0.4);
  --lift-distance: -13px;
  --elevation-ease: cubic-bezier(0.34, 1.56, 0.64, 1);
}`,
    props: [
      { name: "label", type: "string", defaultValue: '"Book A Call"', description: "Text displayed on the elevated button face." },
      { name: "icon", type: '"phone" | "calendar" | "arrow"', defaultValue: '"phone"', description: "Leading icon displayed next to the label." },
      { name: "theme", type: '"figma" | "emerald" | "amber"', defaultValue: '"figma"', description: "Color theme for the underglow beam and reflection rim." },
      { name: "size", type: '"sm" | "md" | "lg"', defaultValue: '"md"', description: "Size dimensions of the pill." },
    ],
    variantsList: [
      {
        title: "Figma Cyan Underglow",
        themeValue: "figma",
        themeProp: 'theme="figma"',
        badgeColor: "#38BDF8",
        description: "13px vertical spring lift with blue glowing extruded sub-chassis.",
        renderPreview: (sz = "sm") => <ElevatedUnderglowCTA theme="figma" label="Book A Call" size={sz} />,
      },
      {
        title: "Emerald Shield",
        themeValue: "emerald",
        themeProp: 'theme="emerald"',
        badgeColor: "#10B981",
        description: "Glowing green underglow flare with specular white chassis.",
        renderPreview: (sz = "sm") => <ElevatedUnderglowCTA theme="emerald" label="Schedule" size={sz} />,
      },
      {
        title: "Amber Gold Flare",
        themeValue: "amber",
        themeProp: 'theme="amber"',
        badgeColor: "#F59E0B",
        description: "Warm golden glow rim with spring tactile depression.",
        renderPreview: (sz = "sm") => <ElevatedUnderglowCTA theme="amber" label="Connect" size={sz} />,
      },
    ],
  },
  {
    id: "led-matrix-chevron",
    name: "LED Dot Matrix Chevron Button",
    category: "buttons",
    categoryLabel: "Buttons & CTAs",
    badge: "Cyberpunk Matrix",
    badgeColor: "#10B981",
    description:
      "Cyberpunk carbon-fiber squircle button with an expandable 7×7 LED dot matrix screen that stretches across the entire chassis on hover/click revealing 5 cascading pixel chevrons.",
    detailUrl: "/componentlab/led-matrix-chevron",
    defaultLabel: "See Plans",
    hasLabelControl: true,
    hasSizeControl: true,
    hasThemeControl: true,
    defaultTheme: "monochrome",
    availableThemes: [
      { value: "monochrome", label: "Monochrome White", color: "#F8FAFC" },
      { value: "emerald", label: "Phosphor Green", color: "#10B981" },
      { value: "amber", label: "Amber CRT", color: "#F59E0B" },
      { value: "cyan", label: "Laser Cyan", color: "#06B6D4" },
      { value: "uipirate", label: "UI Pirate Orange", color: "#FF5B04" },
      { value: "crimson", label: "Crimson Red", color: "#EF4444" },
    ],
    features: [
      "Expandable 7×7 pixel dot matrix screen",
      "Cascading phosphor marquee wave animation",
      "Carbon-fiber textured squircle chassis",
      "Instant tactile feedback on click",
    ],
    previewLight: (
      <div className="py-6 flex items-center justify-center">
        <LedMatrixChevronButton theme="monochrome" size="md" />
      </div>
    ),
    previewDark: (
      <div className="py-6 flex items-center justify-center">
        <LedMatrixChevronButton theme="monochrome" size="md" />
      </div>
    ),
    jsxCode: `import { LedMatrixChevronButton } from "@/components/LedMatrixChevronButton";

export default function Example() {
  return (
    <LedMatrixChevronButton
      theme="monochrome"
      size="md"
      onTrigger={() => console.log("Matrix sequence activated")}
    />
  );
}`,
    htmlCode: `<div class="p-3 rounded-2xl bg-[#0F0F12] border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
  <div class="grid grid-cols-7 gap-1">
    <!-- 7x7 dot matrix LEDs -->
    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_#10B981]"></span>
  </div>
</div>`,
    cssCode: `/* LED Matrix Tokens */
:root {
  --led-glow-on: 0 0 6px rgba(16, 185, 129, 0.9);
  --led-glow-off: rgba(255, 255, 255, 0.05);
  --matrix-bg: #0d0d11;
}`,
    props: [
      { name: "theme", type: '"monochrome" | "emerald" | "amber" | "cyber-cyan"', defaultValue: '"monochrome"', description: "Phosphor color for the LED dot grid." },
      { name: "size", type: '"sm" | "md" | "lg"', defaultValue: '"md"', description: "Controls pixel scale and chassis padding." },
      { name: "onTrigger", type: "() => void", defaultValue: "undefined", description: "Fired when the chevron sequence reaches climax." },
    ],
  },
  {
    id: "slide-grow-button",
    name: "Swipe to Grow / Slide Button",
    category: "controls",
    categoryLabel: "Controls & Sliders",
    badge: "Capsule Slider",
    badgeColor: "#38BDF8",
    description:
      "Interactive metallic capsule slider button with draggable glowing electric blue knob, illuminated neon channel fill, and dynamic masked text reveal.",
    detailUrl: "/componentlab/slide-grow-button",
    defaultLabel: "Slide to Unlock",
    hasLabelControl: true,
    hasSizeControl: true,
    hasThemeControl: true,
    defaultTheme: "silver",
    availableThemes: [
      { value: "silver", label: "Silver Steel", color: "#CBD5E1" },
      { value: "dark", label: "Dark Metal", color: "#3B82F6" },
      { value: "obsidian", label: "Obsidian Matte", color: "#1E293B" },
    ],
    features: [
      "Gesture-driven draggable capsule knob physics",
      "Dynamic neon channel fill path as knob travels",
      "Masked text reveal animation on swipe",
      "Auto-snap completion threshold",
    ],
    previewLight: (
      <div className="py-6 flex items-center justify-center">
        <SlideGrowButton theme="silver" size="md" />
      </div>
    ),
    previewDark: (
      <div className="py-6 flex items-center justify-center">
        <SlideGrowButton theme="silver" size="md" />
      </div>
    ),
    jsxCode: `import { SlideGrowButton } from "@/components/SlideGrowButton";

export default function Example() {
  return (
    <SlideGrowButton
      theme="silver"
      size="md"
      onComplete={() => alert("Action unlocked!")}
    />
  );
}`,
    htmlCode: `<div class="relative w-64 h-14 rounded-full bg-black/40 border border-white/10 p-1 flex items-center">
  <div class="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 shadow-lg cursor-grab flex items-center justify-center text-white">
    →
  </div>
  <span class="absolute inset-0 flex items-center justify-center text-xs font-mono text-gray-400 pointer-events-none">
    Slide to Unlock
  </span>
</div>`,
    cssCode: `/* Slider Tokens */
:root {
  --slider-knob-glow: 0 0 20px rgba(56, 189, 248, 0.6);
  --slider-track-bg: rgba(0, 0, 0, 0.4);
  --slider-fill-color: #38bdf8;
}`,
    props: [
      { name: "theme", type: '"silver" | "dark" | "obsidian"', defaultValue: '"silver"', description: "Metallic finish for the capsule track." },
      { name: "size", type: '"sm" | "md" | "lg"', defaultValue: '"md"', description: "Width and height scaling dimensions." },
      { name: "onComplete", type: "() => void", defaultValue: "undefined", description: "Called when swipe reaches 100% threshold." },
    ],
  },
  {
    id: "vintage-leather-cta",
    name: "Vintage Leather & Brass Button",
    category: "buttons",
    categoryLabel: "Buttons & CTAs",
    badge: "Heritage Leather",
    badgeColor: "#D97706",
    description:
      "Luxury embossed heritage leather & brass button with 6px bottom tactile bevel lip, recessed enclosure tray, and filigree scrollwork corner flourishes.",
    detailUrl: "/componentlab/vintage-leather-cta",
    defaultLabel: "Shop ties",
    hasLabelControl: true,
    hasSizeControl: true,
    hasThemeControl: true,
    defaultTheme: "heritage",
    availableThemes: [
      { value: "heritage", label: "Heritage Tan", color: "#D97706" },
      { value: "noir", label: "Noir Leather", color: "#334155" },
      { value: "oxblood", label: "Oxblood Crimson", color: "#991B1B" },
    ],
    features: [
      "Embossed heritage leather texture with brass lip",
      "Filigree scrollwork corner ornaments",
      "Recessed enclosure tray with tactile 3D bevel",
      "5 Luxury artisanal themes",
    ],
    previewLight: (
      <div className="py-6 flex items-center justify-center">
        <VintageLeatherCTA theme="heritage" size="md" label="Shop ties" />
      </div>
    ),
    previewDark: (
      <div className="py-6 flex items-center justify-center">
        <VintageLeatherCTA theme="heritage" size="md" label="Shop ties" />
      </div>
    ),
    jsxCode: `import { VintageLeatherCTA } from "@/components/VintageLeatherCTA";

export default function Example() {
  return <VintageLeatherCTA theme="heritage" size="md" label="Shop ties" />;
}`,
    htmlCode: `<button class="px-8 py-3.5 rounded-xl bg-gradient-to-b from-[#8B4513] to-[#5C2E0B] text-[#F5DEB3] font-serif border-2 border-[#DAA520] shadow-[0_6px_0_#3A1D07,0_10px_20px_rgba(0,0,0,0.5)]">
  Shop ties
</button>`,
    cssCode: `/* Vintage Leather Tokens */
:root {
  --leather-base: #5c2e0b;
  --brass-rim: #daa520;
  --leather-shadow: 0 6px 0 #3a1d07;
}`,
    props: [
      { name: "label", type: "string", defaultValue: '"Shop ties"', description: "Artisanal CTA label." },
      { name: "theme", type: '"heritage" | "noir" | "oxblood"', defaultValue: '"heritage"', description: "Leather color palette." },
      { name: "size", type: '"sm" | "md" | "lg"', defaultValue: '"md"', description: "Size dimensions." },
    ],
  },
  {
    id: "neumorphic-glow-cta",
    name: "Neumorphic Glow CTA",
    category: "buttons",
    categoryLabel: "Buttons & CTAs",
    badge: "Clay / Neumorphic",
    badgeColor: "#10B981",
    description:
      "Authentic claymorphic and neumorphic elevated CTA button pair with glowing neon green badge depth, multi-tier elevation drop shadows, and plus-lighter bloom.",
    detailUrl: "/componentlab/neumorphic-glow-cta",
    defaultLabel: "Learn more",
    hasLabelControl: true,
    hasSizeControl: false,
    hasThemeControl: true,
    defaultTheme: "pill",
    availableThemes: [
      { value: "pill", label: "Pill Shape", color: "#10B981" },
      { value: "squircle", label: "Squircle Shape", color: "#06B6D4" },
    ],
    features: [
      "Claymorphic elevated drop shadow stacks",
      "Glowing neon green depth indicator",
      "Pill and squircle layout variants",
      "Plus-lighter bloom reflection filter",
    ],
    previewLight: (
      <div className="py-6 flex items-center justify-center">
        <NeumorphicGlowCTA variant="pill" label="Learn more" />
      </div>
    ),
    previewDark: (
      <div className="py-6 flex items-center justify-center">
        <NeumorphicGlowCTA variant="pill" label="Learn more" />
      </div>
    ),
    jsxCode: `import { NeumorphicGlowCTA } from "@/components/NeumorphicGlowCTA";

export default function Example() {
  return <NeumorphicGlowCTA variant="pill" label="Learn more" />;
}`,
    htmlCode: `<div class="p-1 rounded-full bg-[#18181D] shadow-[-6px_-6px_12px_rgba(255,255,255,0.05),6px_6px_12px_rgba(0,0,0,0.8)]">
  <button class="px-8 py-3 rounded-full bg-[#1F1F24] text-white font-medium text-xs">Learn more</button>
</div>`,
    cssCode: `/* Neumorphic Tokens */
:root {
  --neumorphic-shadow: -8px -8px 16px rgba(255, 255, 255, 0.04), 8px 8px 16px rgba(0, 0, 0, 0.7);
  --clay-bloom: rgba(16, 185, 129, 0.3);
}`,
    props: [
      { name: "variant", type: '"pill" | "squircle"', defaultValue: '"pill"', description: "Shape outline variant." },
      { name: "label", type: "string", defaultValue: '"Learn more"', description: "Button text." },
    ],
  },
  {
    id: "smash-tactile-button",
    name: "Tactile 'Smash' Button",
    category: "buttons",
    categoryLabel: "Buttons & CTAs",
    badge: "Neo-Brutalist",
    badgeColor: "#EC4899",
    description:
      "Neo-brutalist tech button with outer enclosure frame, cushion cooling tray, obsidian core slab, and glowing neon reactor underglow.",
    detailUrl: "/componentlab/smash-tactile-button",
    defaultLabel: "Smash the button",
    hasLabelControl: true,
    hasSizeControl: true,
    hasThemeControl: true,
    defaultTheme: "figma",
    availableThemes: [
      { value: "figma", label: "Figma Brutal", color: "#EC4899" },
      { value: "cyber", label: "Cyber Yellow", color: "#EAB308" },
      { value: "dark", label: "Tactical Dark", color: "#64748B" },
    ],
    features: [
      "Industrial outer enclosure frame",
      "Cushion cooling tray ventilation texture",
      "Obsidian core slab with 3D press feel",
      "Neon reactor underglow bloom",
    ],
    previewLight: (
      <div className="py-6 flex items-center justify-center">
        <SmashTactileButton label="Smash the button" variant="figma" size="md" />
      </div>
    ),
    previewDark: (
      <div className="py-6 flex items-center justify-center">
        <SmashTactileButton label="Smash the button" variant="figma" size="md" />
      </div>
    ),
    jsxCode: `import SmashTactileButton from "@/components/SmashTactileButton";

export default function Example() {
  return <SmashTactileButton label="Smash the button" variant="figma" size="md" />;
}`,
    htmlCode: `<div class="p-2 bg-gray-900 border-2 border-black rounded-2xl shadow-[6px_6px_0_#000]">
  <button class="px-8 py-3 bg-pink-500 text-white font-black uppercase text-xs">Smash the button</button>
</div>`,
    cssCode: `/* Neo Brutalist Tokens */
:root {
  --smash-border: 2px solid #000;
  --smash-shadow: 6px 6px 0 #000;
}`,
    props: [
      { name: "label", type: "string", defaultValue: '"Smash the button"', description: "Button text." },
      { name: "variant", type: '"figma" | "cyber" | "dark"', defaultValue: '"figma"', description: "Industrial theme variant." },
    ],
  },
  {
    id: "scaling-capsule-button",
    name: "Scaling Capsule Tactile Button",
    category: "buttons",
    categoryLabel: "Buttons & CTAs",
    badge: "Frosted Capsule",
    badgeColor: "#38BDF8",
    description:
      "Recessed capsule button featuring a frosted translucent glass tray, obsidian cap with multi-tiered elevation drop shadows, and circular apex emblem badge.",
    detailUrl: "/componentlab/scaling-capsule-button",
    defaultLabel: "Scaling Workshop",
    hasLabelControl: true,
    hasSizeControl: true,
    hasThemeControl: true,
    defaultTheme: "dark",
    availableThemes: [
      { value: "dark", label: "Dark Obsidian", color: "#38BDF8" },
      { value: "light", label: "Light Frosted", color: "#E2E8F0" },
    ],
    features: [
      "Frosted outer glass tray",
      "Multi-tier shadow stack",
      "26px Black circle",
      "Ladder-rung icon",
    ],
    previewLight: (
      <div className="py-6 flex items-center justify-center">
        <ScalingCapsuleButton label="Scaling Workshop" variant="dark" size="md" />
      </div>
    ),
    previewDark: (
      <div className="py-6 flex items-center justify-center">
        <ScalingCapsuleButton label="Scaling Workshop" variant="dark" size="md" />
      </div>
    ),
    jsxCode: `import ScalingCapsuleButton from "@/components/ScalingCapsuleButton";

export default function Example() {
  return <ScalingCapsuleButton label="Scaling Workshop" variant="dark" size="md" />;
}`,
    htmlCode: `<button class="px-8 py-3.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold text-xs shadow-xl">
  Scaling Workshop
</button>`,
    cssCode: `/* Scaling Capsule Tokens */
:root {
  --capsule-blur: blur(12px);
  --capsule-border: 1px solid rgba(255, 255, 255, 0.2);
}`,
    props: [
      { name: "label", type: "string", defaultValue: '"Scaling Workshop"', description: "Text label." },
      { name: "variant", type: '"dark" | "light"', defaultValue: '"dark"', description: "Appearance style." },
    ],
  },
  {
    id: "magnetic-pulse-cta",
    name: "Magnetic Pulsing CTA",
    category: "buttons",
    categoryLabel: "Buttons & CTAs",
    badge: "Audio + Haptic",
    badgeColor: "#FF5B04",
    description:
      "High-energy glowing action button with ambient radiant pulse effect, click audio trigger hook, and 3D depth press feedback.",
    detailUrl: "/componentlab/magnetic-pulse-cta",
    defaultLabel: "Let's Venture",
    hasLabelControl: true,
    hasSizeControl: false,
    hasThemeControl: true,
    defaultTheme: "#FF5B04",
    availableThemes: [
      { value: "#FF5B04", label: "Magma Orange", color: "#FF5B04" },
      { value: "#00E5BE", label: "Teal Cyan", color: "#00E5BE" },
      { value: "#38BDF8", label: "Sky Blue", color: "#38BDF8" },
      { value: "#8B5CF6", label: "Electric Purple", color: "#8B5CF6" },
      { value: "#EC4899", label: "Hot Pink", color: "#EC4899" },
    ],
    features: [
      "Ambient concentric pulse waves",
      "Optional web audio sound click trigger",
      "Tactile 3D press scaling animation",
      "High-conversion lead capture design",
    ],
    previewLight: (
      <div className="py-6 flex items-center justify-center">
        <MagneticPulseCTA label="Let's Venture" pulseColor="#FF5B04" />
      </div>
    ),
    previewDark: (
      <div className="py-6 flex items-center justify-center">
        <MagneticPulseCTA label="Let's Venture" pulseColor="#FF5B04" />
      </div>
    ),
    jsxCode: `import { MagneticPulseCTA } from "@/components/MagneticPulseCTA";

export default function Example() {
  return <MagneticPulseCTA label="Let's Venture" pulseColor="#FF5B04" />;
}`,
    htmlCode: `<div class="relative inline-flex">
  <span class="absolute -inset-1 rounded-full bg-orange-500/40 animate-ping"></span>
  <button class="relative px-8 py-3 rounded-full bg-[#FF5B04] text-white font-bold text-xs shadow-xl">
    Let's Venture
  </button>
</div>`,
    cssCode: `/* Magnetic Pulse Tokens */
:root {
  --pulse-color: #ff5b04;
  --pulse-bloom: 0 0 24px rgba(255, 91, 4, 0.5);
}`,
    props: [
      { name: "label", type: "string", defaultValue: '"Let\'s Venture"', description: "Button text." },
      { name: "pulseColor", type: "string", defaultValue: '"#FF5B04"', description: "Color for the pulsing flare." },
    ],
  },
  {
    id: "arc-corner-toggle",
    name: "Arc Corner Slider Toggle",
    category: "controls",
    categoryLabel: "Controls & Sliders",
    badge: "Arc Slider Switch",
    badgeColor: "#C084FC",
    description:
      "Interactive corner arc slider toggle with light and dark mode states, rotating capsule knob along a 90° circular track, sunken sunburst dial, and glowing magenta laser beam.",
    detailUrl: "/componentlab/arc-corner-toggle",
    defaultLabel: "Arc Switch",
    hasLabelControl: false,
    hasSizeControl: true,
    hasThemeControl: false,
    defaultTheme: "default",
    features: [
      "90° circular arc track calculation",
      "Dual state toggle with angle physics",
      "Sunken sunburst dial background",
      "Glowing magenta laser channel glow",
    ],
    previewLight: (
      <div className="py-6 flex items-center justify-center">
        <ArcCornerToggle scale={0.88} />
      </div>
    ),
    previewDark: (
      <div className="py-6 flex items-center justify-center">
        <ArcCornerToggle scale={0.88} />
      </div>
    ),
    jsxCode: `import { ArcCornerToggle } from "@/components/ArcCornerToggle";

export default function Example() {
  return <ArcCornerToggle scale={0.88} />;
}`,
    htmlCode: `<div class="relative w-48 h-48 rounded-full border border-purple-500/20 bg-[#0E0E12]">
  <!-- 90 Degree Circular Track -->
  <div class="absolute top-2 right-2 w-8 h-8 rounded-full bg-purple-500 shadow-[0_0_12px_#C084FC] cursor-pointer"></div>
</div>`,
    cssCode: `/* Arc Corner Slider Tokens */
:root {
  --arc-radius: 96px;
  --arc-beam-color: #c084fc;
  --arc-laser-glow: 0 0 16px rgba(192, 132, 252, 0.7);
}`,
    props: [
      { name: "scale", type: "number", defaultValue: "1", description: "CSS transform scale multiplier for responsive fitting." },
      { name: "onToggle", type: "(state: boolean) => void", defaultValue: "undefined", description: "State change listener." },
    ],
  },
  {
    id: "glass-badge",
    name: "Glassmorphic Badge",
    category: "badges",
    categoryLabel: "Badges & Indicators",
    badge: "Design Tokens",
    badgeColor: "#8B5CF6",
    description:
      "Frosted glass pill badge with multi-layer backdrop filter blur, subtle border sheen, and glowing typography for section headers and status chips.",
    detailUrl: "/componentlab/glass-badge",
    defaultLabel: "PROPRIETARY COMPONENT",
    hasLabelControl: true,
    hasSizeControl: true,
    hasThemeControl: true,
    defaultTheme: "gradient",
    availableThemes: [
      { value: "gradient", label: "Vibrant Gradient", color: "#8B5CF6" },
      { value: "cyan", label: "Laser Cyan", color: "#06B6D4" },
      { value: "solid", label: "Obsidian Solid", color: "#64748B" },
    ],
    features: [
      "Multi-layer backdrop filter blur",
      "Cyan and vibrant gradient variants",
      "Specular top border highlight sheen",
      "Responsive typography and padding",
    ],
    previewLight: (
      <div className="py-6 flex items-center justify-center">
        <GlassBadge variant="gradient" size="md">PROPRIETARY COMPONENT</GlassBadge>
      </div>
    ),
    previewDark: (
      <div className="py-6 flex items-center justify-center">
        <GlassBadge variant="gradient" size="md">PROPRIETARY COMPONENT</GlassBadge>
      </div>
    ),
    jsxCode: `import GlassBadge from "@/components/GlassBadge";

export default function Example() {
  return <GlassBadge variant="gradient" size="md">PROPRIETARY COMPONENT</GlassBadge>;
}`,
    htmlCode: `<span class="px-3.5 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-[11px] font-mono font-bold text-white">
  PROPRIETARY COMPONENT
</span>`,
    cssCode: `/* Glass Badge Tokens */
:root {
  --badge-blur: blur(8px);
  --badge-border: 1px solid rgba(255, 255, 255, 0.18);
}`,
    props: [
      { name: "variant", type: '"gradient" | "cyan" | "solid"', defaultValue: '"gradient"', description: "Visual style variant." },
      { name: "size", type: '"sm" | "md" | "lg"', defaultValue: '"md"', description: "Padding scale." },
    ],
  },
  {
    id: "glass-surface",
    name: "Glass Surface Container",
    category: "surfaces",
    categoryLabel: "Surfaces & Glass",
    badge: "Atmospheric Depth",
    badgeColor: "#3B82F6",
    description:
      "Deep frosted glassmorphic card container with dynamic specular sheen, rounded corners, noise texture support, and ambient light reflection.",
    detailUrl: "/componentlab/glass-surface",
    defaultLabel: "Content inside glass surface container",
    hasLabelControl: true,
    hasSizeControl: false,
    hasThemeControl: false,
    defaultTheme: "default",
    features: [
      "Gaussian blur backdrop filter",
      "Dynamic specular border sheen",
      "Hardware-accelerated rendering",
      "High accessible contrast overlay",
    ],
    previewLight: (
      <div className="py-6 flex items-center justify-center w-full max-w-sm mx-auto">
        <div className="p-6 rounded-3xl bg-black/5 border border-black/10 backdrop-blur-xl shadow-xl w-full text-center">
          <div className="text-xs font-mono font-bold text-gray-800">Glass Container Surface</div>
          <div className="text-xs text-gray-600 mt-1">Light Theme Reflection</div>
        </div>
      </div>
    ),
    previewDark: (
      <div className="py-6 flex items-center justify-center w-full max-w-sm mx-auto">
        <div className="p-6 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-xl shadow-2xl w-full text-center">
          <div className="text-xs font-mono font-bold text-cyan-400">Glass Container Surface</div>
          <div className="text-xs text-gray-400 mt-1">Dark Theme Reflection</div>
        </div>
      </div>
    ),
    jsxCode: `import GlassSurface from "@/components/GlassSurface";

export default function Example() {
  return (
    <GlassSurface width="100%" height="auto" borderRadius={24} blur={20} className="p-6">
      <p className="text-white">Content inside glass surface</p>
    </GlassSurface>
  );
}`,
    htmlCode: `<div class="p-6 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-xl shadow-2xl">
  <p class="text-white">Content inside glass surface</p>
</div>`,
    cssCode: `/* Glass Surface Tokens */
:root {
  --glass-surface-blur: blur(20px);
  --glass-surface-bg: rgba(255, 255, 255, 0.04);
  --glass-surface-border: 1px solid rgba(255, 255, 255, 0.1);
}`,
    props: [
      { name: "borderRadius", type: "number", defaultValue: "24", description: "Border radius in px." },
      { name: "blur", type: "number", defaultValue: "20", description: "Backdrop blur radius in px." },
    ],
  },
];
