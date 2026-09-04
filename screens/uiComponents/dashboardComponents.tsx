import React from "react";
import { AnimatedButton } from "@/components/AnimatedButton";
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
import { TactileNeumorphicToggle } from "@/components/TactileNeumorphicToggle";
import { TactileNeumorphicSwitch } from "@/components/TactileNeumorphicSwitch";
import { GlossyGelButton } from "@/components/GlossyGelButton";
import { LuminousShelfCard } from "@/components/LuminousShelfCard";

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
  hasIconControl?: boolean;
  defaultIcon?: string;
  availableIcons?: Array<{ value: string; label: string }>;
  hasCablesControl?: boolean;
  defaultShowCables?: boolean;
  hasIntensityControl?: boolean;
  defaultIntensity?: string;
  hasDotColorControl?: boolean;
  defaultDotColor?: string;
  hasLiftControl?: boolean;
  defaultLiftAmount?: number;
  hasInteractionModeControl?: boolean;
  defaultInteractionMode?: "hover" | "click" | "both";
  hasStepSpeedControl?: boolean;
  defaultStepSpeedMs?: number;
  hasOrnamentsControl?: boolean;
  defaultShowOrnaments?: boolean;
  hasHoverTextControl?: boolean;
  defaultHoverText?: string;
  hasActiveLabelControl?: boolean;
  defaultActiveLabel?: string;
  hasSlideInteractionModeControl?: boolean;
  defaultSlideInteractionMode?: "both" | "drag" | "click" | "hover";
  hasThemeModeControl?: boolean;
  defaultThemeMode?: "auto" | "light" | "dark";
  hasDurationControl?: boolean;
  defaultDuration?: number;
  hasShowIconsControl?: boolean;
  defaultShowIcons?: boolean;
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
    hasIntensityControl: true,
    defaultIntensity: "vibrant",
    defaultTheme: "default",
    availableThemes: [
      { value: "default", label: "Default Obsidian", color: "#FFA000" },
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
        <IsometricReviveButton label="Revive Now" theme="default" size="md" />
      </div>
    ),
    previewDark: (
      <div className="py-12 flex items-center justify-center">
        <IsometricReviveButton label="Revive Now" theme="default" size="md" />
      </div>
    ),
    jsxCode: `import { IsometricReviveButton } from "@/components/IsometricReviveButton";

export default function Example() {
  return (
    <IsometricReviveButton
      label="Revive Now"
      theme="default"
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
      { name: "theme", type: '"default" | "amber" | "cyan" | "violet" | "uipirate" | "gold-luxury" | "emerald" | "crimson"', defaultValue: '"default"', description: "Color theme for the isometric bevel extrusion." },
      { name: "size", type: '"xs" | "sm" | "md" | "lg" | "xl"', defaultValue: '"md"', description: "Controls scale matrix factor." },
      { name: "onClick", type: "() => void", defaultValue: "undefined", description: "Action callback on 3D button press." },
    ],
    variantsList: [
      {
        title: "Default Obsidian",
        themeValue: "default",
        themeProp: 'theme="default"',
        badgeColor: "#FFA000",
        description: "1:1 spec extruded obsidian bevels with amber indicator flare.",
        renderPreview: (sz = "sm") => <IsometricReviveButton theme="default" label="Revive" size={sz} />,
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
    hasDotColorControl: true,
    defaultDotColor: "#54EAD8",
    defaultTheme: "default",
    availableThemes: [
      { value: "default", label: "Default Cyan", color: "#54EAD8" },
      { value: "orange", label: "Magma Orange", color: "#FF5B04" },
      { value: "dark", label: "Dark Obsidian", color: "#A78BFA" },
      { value: "cyberpunk", label: "Cyberpunk Matrix", color: "#10B981" },
      { value: "minimal", label: "Minimal Clean", color: "#3B82F6" },
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
        title: "Default Cyan Beacon",
        themeValue: "default",
        themeProp: 'variant="default"',
        badgeColor: "#54EAD8",
        description: "1:1 reference design with turquoise indicator dot.",
        renderPreview: (sz = "sm") => <TactilePillButton variant="default" dotColor="#54EAD8" label="Get Started" size={sz} />,
      },
      {
        title: "UI Pirate Magma",
        themeValue: "orange",
        themeProp: 'variant="orange"',
        badgeColor: "#FF5B04",
        description: "Signature magma orange pill cap with glowing amber beacon.",
        renderPreview: (sz = "sm") => <TactilePillButton variant="orange" dotColor="#FF5B04" label="Join Waitlist" size={sz} />,
      },
      {
        title: "Dark Obsidian",
        themeValue: "dark",
        themeProp: 'variant="dark"',
        badgeColor: "#A78BFA",
        description: "Stealth midnight pill with violet status indicator.",
        renderPreview: (sz = "sm") => <TactilePillButton variant="dark" dotColor="#A78BFA" label="Explore Tech" size={sz} />,
      },
      {
        title: "Cyberpunk Matrix",
        themeValue: "cyberpunk",
        themeProp: 'variant="cyberpunk"',
        badgeColor: "#10B981",
        description: "Neon reactor green beacon with tactile recessed tray.",
        renderPreview: (sz = "sm") => <TactilePillButton variant="cyberpunk" dotColor="#10B981" label="Deploy Matrix" size={sz} />,
      },
      {
        title: "Minimal Clean",
        themeValue: "minimal",
        themeProp: 'variant="minimal"',
        badgeColor: "#3B82F6",
        description: "Crisp clean tactile pill with sapphire status beacon.",
        renderPreview: (sz = "sm") => <TactilePillButton variant="minimal" dotColor="#3B82F6" label="Learn More" size={sz} />,
      },
      {
        title: "Tilted State Preview",
        themeValue: "default",
        themeProp: 'stateMode="tilted"',
        badgeColor: "#EC4899",
        description: "Fixed mechanical spring tilt position (-9.23° angle).",
        renderPreview: (sz = "sm") => <TactilePillButton variant="default" dotColor="#EC4899" label="Active Tilt" stateMode="tilted" size={sz} />,
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
    hasIconControl: true,
    defaultIcon: "cloud-download",
    availableIcons: [
      { value: "cloud-download", label: "Cloud Download" },
      { value: "download", label: "Download" },
      { value: "arrow-down", label: "Arrow Down" },
      { value: "upload", label: "Upload" },
      { value: "folder", label: "Folder" },
      { value: "package", label: "Package" },
      { value: "save", label: "Save" },
    ],
    hasCablesControl: true,
    defaultShowCables: true,
    defaultTheme: "default-blue",
    availableThemes: [
      { value: "default-blue", label: "Default Blue", color: "#38BDF8" },
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
        <FrostedGelDownloadButton label="Download now" theme="default-blue" size="md" />
      </div>
    ),
    previewDark: (
      <div className="py-6 flex items-center justify-center">
        <FrostedGelDownloadButton label="Download now" theme="default-blue" size="md" />
      </div>
    ),
    jsxCode: `import { FrostedGelDownloadButton } from "@/components/FrostedGelDownloadButton";

export default function Example() {
  return (
    <FrostedGelDownloadButton
      label="Download now"
      theme="default-blue"
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
      { name: "theme", type: '"default-blue" | "cyber-violet" | "emerald-matrix" | "magma-orange" | "dark-obsidian" | "titanium-gold"', defaultValue: '"default-blue"', description: "Color palette theme for the frosted gel tile and underglow." },
      { name: "size", type: '"xs" | "sm" | "md" | "lg" | "xl"', defaultValue: '"md"', description: "Controls dimensions and padding scale." },
      { name: "onClick", type: "() => void", defaultValue: "undefined", description: "Triggered on clicking the gel download button." },
    ],
    variantsList: [
      {
        title: "Default Electric Blue",
        themeValue: "default-blue",
        themeProp: 'theme="default-blue"',
        badgeColor: "#38BDF8",
        description: "1:1 spec ceramic pill with volumetric blue flare.",
        renderPreview: (sz = "sm") => <FrostedGelDownloadButton theme="default-blue" label="Download Package" size={sz} />,
      },
      {
        title: "Cyber Violet",
        themeValue: "cyber-violet",
        themeProp: 'theme="cyber-violet"',
        badgeColor: "#A855F7",
        description: "Ultraviolet refraction glow with tinted frosted gel.",
        renderPreview: (sz = "sm") => <FrostedGelDownloadButton theme="cyber-violet" label="Install Assets" size={sz} />,
      },
      {
        title: "Emerald Matrix",
        themeValue: "emerald-matrix",
        themeProp: 'theme="emerald-matrix"',
        badgeColor: "#10B981",
        description: "Cyberpunk reactor green glow with translucent glass tile.",
        renderPreview: (sz = "sm") => <FrostedGelDownloadButton theme="emerald-matrix" label="Fetch Source" size={sz} />,
      },
      {
        title: "Magma Orange",
        themeValue: "magma-orange",
        themeProp: 'theme="magma-orange"',
        badgeColor: "#FF5B04",
        description: "UI Pirate signature brand magma orange illumination.",
        renderPreview: (sz = "sm") => <FrostedGelDownloadButton theme="magma-orange" label="Get Bundle" size={sz} />,
      },
      {
        title: "Dark Obsidian",
        themeValue: "dark-obsidian",
        themeProp: 'theme="dark-obsidian"',
        badgeColor: "#64748B",
        description: "Stealth midnight pill with smoked dark glass cloud tile.",
        renderPreview: (sz = "sm") => <FrostedGelDownloadButton theme="dark-obsidian" label="Download Code" size={sz} />,
      },
      {
        title: "Titanium Gold",
        themeValue: "titanium-gold",
        themeProp: 'theme="titanium-gold"',
        badgeColor: "#EAB308",
        description: "Luxury warm gold underglow with champagne ceramic pill.",
        renderPreview: (sz = "sm") => <FrostedGelDownloadButton theme="titanium-gold" label="Export Pro" size={sz} />,
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
    hasIconControl: true,
    defaultIcon: "phone",
    availableIcons: [
      { value: "phone", label: "Phone Call" },
      { value: "calendar", label: "Calendar Event" },
      { value: "arrow", label: "Arrow Action" },
      { value: "sparkle", label: "Sparkle Magic" },
      { value: "mail", label: "Direct Mail" },
      { value: "none", label: "None (Text Only)" },
    ],
    hasLiftControl: true,
    defaultLiftAmount: 13,
    defaultTheme: "default",
    availableThemes: [
      { value: "default", label: "Default Electric Blue", color: "#38BDF8" },
      { value: "uipirate", label: "UI Pirate Magma", color: "#FF5B04" },
      { value: "emerald", label: "Neon Emerald", color: "#10B981" },
      { value: "violet", label: "Cyber Violet", color: "#A855F7" },
      { value: "crimson", label: "Crimson Ember", color: "#EF4444" },
      { value: "dark", label: "Dark Obsidian", color: "#64748B" },
    ],
    features: [
      "13px dynamic vertical spring elevation on hover",
      "Illuminated electric blue sub-chassis rim",
      "Tactile phone / call icon with specular highlights",
      "Soft diffuse claymorphic shadow stack",
    ],
    previewLight: (
      <div className="py-6 flex items-center justify-center">
        <ElevatedUnderglowCTA label="Book A Call" icon="phone" theme="default" size="md" />
      </div>
    ),
    previewDark: (
      <div className="py-6 flex items-center justify-center">
        <ElevatedUnderglowCTA label="Book A Call" icon="phone" theme="default" size="md" />
      </div>
    ),
    jsxCode: `import { ElevatedUnderglowCTA } from "@/components/ElevatedUnderglowCTA";

export default function Example() {
  return (
    <ElevatedUnderglowCTA
      label="Book A Call"
      icon="phone"
      theme="default"
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
      { name: "icon", type: '"phone" | "calendar" | "arrow" | "sparkle" | "mail" | "none"', defaultValue: '"phone"', description: "Leading icon displayed next to the label." },
      { name: "liftAmount", type: "number", defaultValue: "13", description: "Optional lift distance in pixels on hover (default: 13 matching spec 55:40)." },
      { name: "theme", type: '"default" | "uipirate" | "emerald" | "violet" | "crimson" | "dark"', defaultValue: '"default"', description: "Color theme for the underglow beam and reflection rim." },
      { name: "size", type: '"xs" | "sm" | "md" | "lg" | "xl"', defaultValue: '"md"', description: "Size dimensions of the pill." },
    ],
    variantsList: [
      {
        title: "Default Electric Blue",
        themeValue: "default",
        themeProp: 'theme="default"',
        badgeColor: "#38BDF8",
        description: "1:1 reference design with blue extruded sub-chassis.",
        renderPreview: (sz = "sm") => <ElevatedUnderglowCTA theme="default" label="Book A Call" icon="phone" size={sz} />,
      },
      {
        title: "UI Pirate Magma",
        themeValue: "uipirate",
        themeProp: 'theme="uipirate"',
        badgeColor: "#FF5B04",
        description: "Vibrant signature brand magma orange glow.",
        renderPreview: (sz = "sm") => <ElevatedUnderglowCTA theme="uipirate" label="Get Started" icon="sparkle" size={sz} />,
      },
      {
        title: "Neon Emerald",
        themeValue: "emerald",
        themeProp: 'theme="emerald"',
        badgeColor: "#10B981",
        description: "High-tech reactor matrix green elevation chassis.",
        renderPreview: (sz = "sm") => <ElevatedUnderglowCTA theme="emerald" label="Deploy Code" icon="arrow" size={sz} />,
      },
      {
        title: "Cyber Violet",
        themeValue: "violet",
        themeProp: 'theme="violet"',
        badgeColor: "#A855F7",
        description: "Sleek neon ultraviolet sub-chassis underglow.",
        renderPreview: (sz = "sm") => <ElevatedUnderglowCTA theme="violet" label="Upgrade Pro" icon="sparkle" size={sz} />,
      },
      {
        title: "Crimson Ember",
        themeValue: "crimson",
        themeProp: 'theme="crimson"',
        badgeColor: "#EF4444",
        description: "Punchy ruby red extruded sub-surface illumination.",
        renderPreview: (sz = "sm") => <ElevatedUnderglowCTA theme="crimson" label="Schedule Demo" icon="calendar" size={sz} />,
      },
      {
        title: "Dark Obsidian",
        themeValue: "dark",
        themeProp: 'theme="dark"',
        badgeColor: "#64748B",
        description: "Monochrome stealth obsidian cap with pure white glow.",
        renderPreview: (sz = "sm") => <ElevatedUnderglowCTA theme="dark" label="Contact Us" icon="mail" size={sz} />,
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
    hasInteractionModeControl: true,
    defaultInteractionMode: "hover",
    hasStepSpeedControl: true,
    defaultStepSpeedMs: 110,
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
      label="See Plans"
      theme="monochrome"
      size="md"
      interactionMode="hover"
      stepSpeedMs={110}
      onClick={() => console.log("LED Matrix Clicked")}
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
      { name: "label", type: "string", defaultValue: '"See Plans"', description: "Button label in resting state." },
      { name: "theme", type: '"monochrome" | "uipirate" | "emerald" | "cyan" | "amber" | "crimson"', defaultValue: '"monochrome"', description: "Phosphor color for the LED dot grid." },
      { name: "size", type: '"xs" | "sm" | "md" | "lg" | "xl"', defaultValue: '"md"', description: "Controls pixel scale and chassis padding." },
      { name: "interactionMode", type: '"hover" | "click" | "both"', defaultValue: '"hover"', description: "Interaction trigger mode: expands LED screen on hover, click, or both." },
      { name: "stepSpeedMs", type: "number", defaultValue: "110", description: "LED shift speed in milliseconds per column step." },
      { name: "onClick", type: "() => void", defaultValue: "undefined", description: "Click event handler." },
    ],
    variantsList: [
      {
        title: "Monochrome",
        themeValue: "monochrome",
        themeProp: 'theme="monochrome"',
        badgeColor: "#F8FAFC",
        description: "1:1 reference design with white LED grid pixels.",
        renderPreview: (sz = "sm") => <LedMatrixChevronButton theme="monochrome" label="See Plans" size={sz} />,
      },
      {
        title: "UI Pirate Magma",
        themeValue: "uipirate",
        themeProp: 'theme="uipirate"',
        badgeColor: "#FF5B04",
        description: "Signature magma orange LED illumination wave.",
        renderPreview: (sz = "sm") => <LedMatrixChevronButton theme="uipirate" label="Get Started" size={sz} />,
      },
      {
        title: "Neon Emerald",
        themeValue: "emerald",
        themeProp: 'theme="emerald"',
        badgeColor: "#10B981",
        description: "Cyberpunk reactor green LED matrix screen.",
        renderPreview: (sz = "sm") => <LedMatrixChevronButton theme="emerald" label="Deploy App" size={sz} />,
      },
      {
        title: "Electric Cyan",
        themeValue: "cyan",
        themeProp: 'theme="cyan"',
        badgeColor: "#06B6D4",
        description: "Laser cyan glowing pixel chevrons.",
        renderPreview: (sz = "sm") => <LedMatrixChevronButton theme="cyan" label="Explore Tech" size={sz} />,
      },
      {
        title: "Amber Solar",
        themeValue: "amber",
        themeProp: 'theme="amber"',
        badgeColor: "#F59E0B",
        description: "Warm golden amber retro terminal LED display.",
        renderPreview: (sz = "sm") => <LedMatrixChevronButton theme="amber" label="View Matrix" size={sz} />,
      },
      {
        title: "Crimson Laser",
        themeValue: "crimson",
        themeProp: 'theme="crimson"',
        badgeColor: "#EF4444",
        description: "High-intensity ruby red cascading chevron pulse.",
        renderPreview: (sz = "sm") => <LedMatrixChevronButton theme="crimson" label="Execute" size={sz} />,
      },
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
    defaultLabel: "Get Started",
    hasLabelControl: true,
    hasActiveLabelControl: true,
    defaultActiveLabel: "Lets Grow!",
    hasSlideInteractionModeControl: true,
    defaultSlideInteractionMode: "both",
    hasSizeControl: true,
    hasThemeControl: true,
    defaultTheme: "silver",
    availableThemes: [
      { value: "silver", label: "Silver Steel (1:1)", color: "#CBD5E1" },
      { value: "dark", label: "Dark Titanium", color: "#3B82F6" },
      { value: "uipirate", label: "UI Pirate Magma", color: "#FF5B04" },
      { value: "cyberpunk", label: "Cyberpunk Violet", color: "#A855F7" },
      { value: "emerald", label: "Emerald Pulse", color: "#10B981" },
      { value: "orange", label: "Amber Orange", color: "#F59E0B" },
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
      startLabel="Get Started"
      activeLabel="Lets Grow!"
      theme="silver"
      size="md"
      interactionMode="both"
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
      { name: "startLabel", type: "string", defaultValue: '"Get Started"', description: "Resting text before slider interaction." },
      { name: "activeLabel", type: "string", defaultValue: '"Lets Grow!"', description: "Revealed label when slid to completion." },
      { name: "theme", type: '"silver" | "dark" | "uipirate" | "cyberpunk" | "emerald" | "orange"', defaultValue: '"silver"', description: "Metallic finish for the capsule track." },
      { name: "size", type: '"xs" | "sm" | "md" | "lg" | "xl"', defaultValue: '"md"', description: "Width and height scaling dimensions." },
      { name: "interactionMode", type: '"both" | "drag" | "click" | "hover"', defaultValue: '"both"', description: "Interaction trigger mode: drag, click, hover, or both." },
      { name: "onComplete", type: "() => void", defaultValue: "undefined", description: "Called when swipe reaches 100% threshold." },
    ],
    variantsList: [
      {
        title: "Silver Steel Track",
        themeValue: "silver",
        themeProp: 'theme="silver"',
        badgeColor: "#CBD5E1",
        description: "Brushed aluminium capsule track with glowing electric blue slider knob.",
        renderPreview: (sz = "sm") => <SlideGrowButton theme="silver" size={sz} />,
      },
      {
        title: "Dark Metal Edition",
        themeValue: "dark",
        themeProp: 'theme="dark"',
        badgeColor: "#3B82F6",
        description: "Dark titanium chassis with bright neon blue photon channel fill.",
        renderPreview: (sz = "sm") => <SlideGrowButton theme="dark" size={sz} />,
      },
      {
        title: "UI Pirate Magma",
        themeValue: "uipirate",
        themeProp: 'theme="uipirate"',
        badgeColor: "#FF5B04",
        description: "Signature molten orange glow track with high-energy sliding physics.",
        renderPreview: (sz = "sm") => <SlideGrowButton theme="uipirate" size={sz} />,
      },
      {
        title: "Emerald Matrix",
        themeValue: "emerald",
        themeProp: 'theme="emerald"',
        badgeColor: "#10B981",
        description: "Vibrant emerald photon illumination channel with smooth slider snap.",
        renderPreview: (sz = "sm") => <SlideGrowButton theme="emerald" size={sz} />,
      },
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
    hasOrnamentsControl: true,
    defaultShowOrnaments: true,
    defaultTheme: "heritage",
    availableThemes: [
      { value: "heritage", label: "Heritage Brass", color: "#D97706" },
      { value: "uipirate", label: "UI Pirate Bronze", color: "#FF5B04" },
      { value: "obsidian", label: "Obsidian Platinum", color: "#64748B" },
      { value: "emerald", label: "Emerald Imperial", color: "#10B981" },
      { value: "ruby", label: "Ruby Royalty", color: "#BE123C" },
      { value: "silver", label: "Silver Armour", color: "#CBD5E1" },
    ],
    features: [
      "Embossed heritage leather texture with brass lip",
      "Filigree scrollwork corner ornaments",
      "Recessed enclosure tray with tactile 3D bevel",
      "6 Luxury artisanal themes",
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
  return (
    <VintageLeatherCTA
      theme="heritage"
      size="md"
      label="Shop ties"
      showOrnaments={true}
      onClick={() => console.log("Clicked")}
    />
  );
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
      { name: "theme", type: '"heritage" | "uipirate" | "obsidian" | "emerald" | "ruby" | "silver"', defaultValue: '"heritage"', description: "Leather color palette." },
      { name: "size", type: '"xs" | "sm" | "md" | "lg" | "xl"', defaultValue: '"md"', description: "Size dimensions." },
      { name: "showOrnaments", type: "boolean", defaultValue: "true", description: "Whether to display the decorative filigree scrollwork corner flourishes." },
    ],
    variantsList: [
      {
        title: "Heritage Brass",
        themeValue: "heritage",
        themeProp: 'theme="heritage"',
        badgeColor: "#D97706",
        description: "1:1 reference design with embossed cowhide leather & brass lip.",
        renderPreview: (sz = "sm") => <VintageLeatherCTA theme="heritage" label="Contact Sales" size={sz} />,
      },
      {
        title: "UI Pirate Bronze",
        themeValue: "uipirate",
        themeProp: 'theme="uipirate"',
        badgeColor: "#FF5B04",
        description: "Signature magma orange leather with filigree corner ornaments.",
        renderPreview: (sz = "sm") => <VintageLeatherCTA theme="uipirate" label="Explore Ship" size={sz} />,
      },
      {
        title: "Obsidian Platinum",
        themeValue: "obsidian",
        themeProp: 'theme="obsidian"',
        badgeColor: "#64748B",
        description: "Stealth midnight black leather with platinum bevel edging.",
        renderPreview: (sz = "sm") => <VintageLeatherCTA theme="obsidian" label="Schedule Call" size={sz} />,
      },
      {
        title: "Emerald Imperial",
        themeValue: "emerald",
        themeProp: 'theme="emerald"',
        badgeColor: "#10B981",
        description: "Royal jade leather with golden scrollwork corner flourishes.",
        renderPreview: (sz = "sm") => <VintageLeatherCTA theme="emerald" label="Claim Throne" size={sz} />,
      },
      {
        title: "Ruby Royalty",
        themeValue: "ruby",
        themeProp: 'theme="ruby"',
        badgeColor: "#BE123C",
        description: "Deep burgundy wine leather with gilded golden tactile bevel.",
        renderPreview: (sz = "sm") => <VintageLeatherCTA theme="ruby" label="Join Order" size={sz} />,
      },
      {
        title: "Silver Armour",
        themeValue: "silver",
        themeProp: 'theme="silver"',
        badgeColor: "#CBD5E1",
        description: "Medieval steel & silver chassis with filigree corner ornaments.",
        renderPreview: (sz = "sm") => <VintageLeatherCTA theme="silver" label="View Armoury" size={sz} />,
      },
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
    hasSizeControl: true,
    hasThemeControl: true,
    defaultTheme: "emerald-pill",
    availableThemes: [
      { value: "emerald-pill", label: "Default Emerald Pill", color: "#10B981" },
      { value: "squircle-emerald", label: "Default Emerald Squircle", color: "#10B981" },
      { value: "uipirate", label: "UI Pirate Magma (Pill)", color: "#FF5B04" },
      { value: "squircle-uipirate", label: "UI Pirate Squircle", color: "#FF5B04" },
      { value: "cyan-pill", label: "Electric Cyan (Pill)", color: "#06B6D4" },
      { value: "magenta-squircle", label: "Neon Magenta Squircle", color: "#EC4899" },
      { value: "amber-pill", label: "Cyber Amber (Pill)", color: "#F59E0B" },
      { value: "violet-squircle", label: "Neon Violet Squircle", color: "#8B5CF6" },
    ],
    features: [
      "Authentic claymorphic multi-tier drop shadow stacks",
      "Radiant glowing neon arrow indicator badge depth",
      "Pill (Spec Node 14:642) & Squircle (Node 14:669) geometry",
      "Interactive 60fps spring press micro-interactions",
    ],
    previewLight: (
      <div className="py-6 flex items-center justify-center">
        <NeumorphicGlowCTA variant="pill" theme="default" neonPreset="emerald" label="Learn more" />
      </div>
    ),
    previewDark: (
      <div className="py-6 flex items-center justify-center">
        <NeumorphicGlowCTA variant="pill" theme="default" neonPreset="emerald" label="Learn more" />
      </div>
    ),
    jsxCode: `import { NeumorphicGlowCTA } from "@/components/NeumorphicGlowCTA";

export default function Example() {
  return (
    <NeumorphicGlowCTA
      label="Learn more"
      variant="pill"
      theme="default"
      neonPreset="emerald"
      size="md"
      onClick={() => console.log("Clicked")}
    />
  );
}`,
    htmlCode: `<!-- Spec Node 14:642 / 14:669 Neumorphic Clay CTA -->
<div class="relative inline-flex items-center justify-between gap-4 px-6 py-3.5 rounded-full bg-[#E6E8ED] border border-white/80 text-[#3D4450] font-bold text-sm shadow-[8px_8px_16px_rgba(166,171,189,0.5),-8px_-8px_16px_rgba(255,255,255,0.9)] cursor-pointer select-none">
  <span>Learn more</span>
  <div class="relative w-8 h-8 rounded-full bg-[#CBF0CD] flex items-center justify-center shadow-[0_0_12px_rgba(73,195,62,0.4)]">
    <svg class="w-4 h-4 text-[#49C33E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
    </svg>
  </div>
</div>`,
    cssCode: `/* Soft Neumorphic Glow Design System Tokens */
:root {
  --neumorphic-pill-bg: #E6E8ED;
  --neumorphic-pill-shadow: 8px 8px 16px rgba(166, 171, 189, 0.5), -8px -8px 16px rgba(255, 255, 255, 0.9);
  --neon-badge-bg: #CBF0CD;
  --neon-badge-glow: 0px 0px 12px rgba(73, 195, 62, 0.4);
  --neon-badge-inner: inset 2.6px 5.2px 6.5px 0px rgba(51, 217, 37, 0.35);
}`,
    props: [
      { name: "label", type: "string", defaultValue: '"Learn more"', description: "Primary button call-to-action text displayed on the cap." },
      { name: "variant", type: '"pill" | "squircle"', defaultValue: '"pill"', description: "Physical rounded contour geometry (Node 14:642 vs 14:669)." },
      { name: "theme", type: '"default" | "uipirate" | "dark" | "orange" | "cyberpunk" | "minimal"', defaultValue: '"default"', description: "Color palette and clay surface lighting theme preset." },
      { name: "size", type: '"xs" | "sm" | "md" | "lg" | "xl"', defaultValue: '"md"', description: "Controls button padding, font scale, and indicator dimensions." },
      { name: "neonPreset", type: '"emerald" | "uipirate" | "cyan" | "magenta" | "amber" | "violet" | "crimson"', defaultValue: '"emerald"', description: "Neon glow preset for glowing indicator arrow circle." },
      { name: "onClick", type: "() => void", defaultValue: "undefined", description: "Interactive click callback event handler." },
    ],
    variantsList: [
      {
        title: "Default Emerald Pill",
        themeValue: "emerald-pill",
        themeProp: 'variant="pill" neonPreset="emerald"',
        badgeColor: "#10B981",
        description: "1:1 reference design with glowing emerald arrow badge and clay drop shadows.",
        renderPreview: (sz = "sm") => (
          <NeumorphicGlowCTA variant="pill" neonPreset="emerald" theme="default" label="Get Started" size={sz} />
        ),
      },
      {
        title: "UI Pirate Squircle",
        themeValue: "squircle-uipirate",
        themeProp: 'variant="squircle" neonPreset="uipirate"',
        badgeColor: "#FF5B04",
        description: "Signature brand magma orange neumorphic clay squircle with neon glow badge.",
        renderPreview: (sz = "sm") => (
          <NeumorphicGlowCTA variant="squircle" neonPreset="uipirate" theme="uipirate" label="Explore Tools" size={sz} />
        ),
      },
      {
        title: "Electric Cyan Pill",
        themeValue: "cyan-pill",
        themeProp: 'variant="pill" neonPreset="cyan"',
        badgeColor: "#06B6D4",
        description: "Cyan optical underglow badge with specular bevel lip and obsidian chassis.",
        renderPreview: (sz = "sm") => (
          <NeumorphicGlowCTA variant="pill" neonPreset="cyan" theme="dark" label="Live Preview" size={sz} />
        ),
      },
      {
        title: "Neon Magenta Squircle",
        themeValue: "magenta-squircle",
        themeProp: 'variant="squircle" neonPreset="magenta"',
        badgeColor: "#EC4899",
        description: "Vivid magenta bloom badge with dark cyberpunk clay squircle chassis.",
        renderPreview: (sz = "sm") => (
          <NeumorphicGlowCTA variant="squircle" neonPreset="magenta" theme="cyberpunk" label="Upgrade Pro" size={sz} />
        ),
      },
      {
        title: "Cyber Amber Pill",
        themeValue: "amber-pill",
        themeProp: 'variant="pill" neonPreset="amber"',
        badgeColor: "#F59E0B",
        description: "Warm golden amber indicator badge depth glow with dark slate body.",
        renderPreview: (sz = "sm") => (
          <NeumorphicGlowCTA variant="pill" neonPreset="amber" theme="dark" label="View Matrix" size={sz} />
        ),
      },
      {
        title: "Neon Violet Squircle",
        themeValue: "violet-squircle",
        themeProp: 'variant="squircle" neonPreset="violet"',
        badgeColor: "#8B5CF6",
        description: "Ultraviolet neon arrow badge with 3D drop shadows and squircle frame.",
        renderPreview: (sz = "sm") => (
          <NeumorphicGlowCTA variant="squircle" neonPreset="violet" theme="dark" label="Deploy Code" size={sz} />
        ),
      },
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
    defaultTheme: "default",
    availableThemes: [
      { value: "default", label: "Default Neo-Brutalist", color: "#EC4899" },
      { value: "orange", label: "UI Pirate Magma", color: "#FF5B04" },
      { value: "dark", label: "Dark Obsidian Core", color: "#64748B" },
      { value: "cyberpunk", label: "Cyberpunk Violet", color: "#A855F7" },
    ],
    features: [
      "Industrial outer enclosure frame",
      "Cushion cooling tray ventilation texture",
      "Obsidian core slab with 3D press feel",
      "Neon reactor underglow bloom",
    ],
    previewLight: (
      <div className="py-6 flex items-center justify-center">
        <SmashTactileButton label="Smash the button" variant="default" size="md" />
      </div>
    ),
    previewDark: (
      <div className="py-6 flex items-center justify-center">
        <SmashTactileButton label="Smash the button" variant="default" size="md" />
      </div>
    ),
    jsxCode: `import SmashTactileButton from "@/components/SmashTactileButton";

export default function Example() {
  return <SmashTactileButton label="Smash the button" variant="default" size="md" />;
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
      { name: "variant", type: '"default" | "orange" | "dark" | "cyberpunk"', defaultValue: '"default"', description: "Industrial theme variant." },
    ],
    variantsList: [
      {
        title: "Default Neo-Brutalist",
        themeValue: "default",
        themeProp: 'variant="default"',
        badgeColor: "#EC4899",
        description: "1:1 reference design with porcelain enclosure tray & dot matrix.",
        renderPreview: (sz = "sm") => <SmashTactileButton variant="default" label="Smash the button" size={sz} />,
      },
      {
        title: "UI Pirate Magma",
        themeValue: "orange",
        themeProp: 'variant="orange"',
        badgeColor: "#FF5B04",
        description: "Signature magma orange reactor glow with dark obsidian core.",
        renderPreview: (sz = "sm") => <SmashTactileButton variant="orange" label="Smash the button" size={sz} />,
      },
      {
        title: "Dark Obsidian Core",
        themeValue: "dark",
        themeProp: 'variant="dark"',
        badgeColor: "#64748B",
        description: "Stealth midnight enclosure with crisp white chamfer bevels.",
        renderPreview: (sz = "sm") => <SmashTactileButton variant="dark" label="Smash the button" size={sz} />,
      },
      {
        title: "Cyberpunk Violet",
        themeValue: "cyberpunk",
        themeProp: 'variant="cyberpunk"',
        badgeColor: "#A855F7",
        description: "High-voltage ultraviolet illumination with matrix array.",
        renderPreview: (sz = "sm") => <SmashTactileButton variant="cyberpunk" label="Smash the button" size={sz} />,
      },
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
    hasIconControl: true,
    defaultIcon: "apex",
    availableIcons: [
      { value: "apex", label: "Apex Ladder Emblem" },
      { value: "arrow", label: "Arrow Right" },
      { value: "sparkle", label: "Sparkle Star" },
      { value: "zap", label: "Lightning Zap" },
      { value: "rocket", label: "Rocket Launch" },
      { value: "check", label: "Checkmark" },
    ],
    defaultTheme: "dark",
    availableThemes: [
      { value: "dark", label: "Default Dark Obsidian", color: "#38BDF8" },
      { value: "orange", label: "UI Pirate Magma", color: "#FF5B04" },
      { value: "light", label: "Titanium Light", color: "#E2E8F0" },
      { value: "cyberpunk", label: "Cyberpunk Neon", color: "#A855F7" },
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
      { name: "variant", type: '"dark" | "orange" | "light" | "cyberpunk"', defaultValue: '"dark"', description: "Appearance style." },
      { name: "size", type: '"xs" | "sm" | "md" | "lg" | "xl"', defaultValue: '"md"', description: "Proportional scaling dimensions." },
      { name: "icon", type: "React.ReactNode", defaultValue: "<ApexEmblemIcon />", description: "Custom icon element displayed inside the 26px black circle." },
    ],
    variantsList: [
      {
        title: "Default Dark Obsidian",
        themeValue: "dark",
        themeProp: 'variant="dark"',
        badgeColor: "#38BDF8",
        description: "1:1 reference design with frosted translucent cavity tray.",
        renderPreview: (sz = "sm") => <ScalingCapsuleButton variant="dark" label="Scaling Workshop" size={sz} />,
      },
      {
        title: "UI Pirate Magma",
        themeValue: "orange",
        themeProp: 'variant="orange"',
        badgeColor: "#FF5B04",
        description: "Signature magma orange glowing capsule with apex emblem.",
        renderPreview: (sz = "sm") => <ScalingCapsuleButton variant="orange" label="Start Building" size={sz} />,
      },
      {
        title: "Titanium Light",
        themeValue: "light",
        themeProp: 'variant="light"',
        badgeColor: "#E2E8F0",
        description: "Clean ceramic light pill with high-contrast ladder apex.",
        renderPreview: (sz = "sm") => <ScalingCapsuleButton variant="light" label="Join Waitlist" size={sz} />,
      },
      {
        title: "Cyberpunk Neon",
        themeValue: "cyberpunk",
        themeProp: 'variant="cyberpunk"',
        badgeColor: "#A855F7",
        description: "Ultraviolet neon tray with cybernetic specular insets.",
        renderPreview: (sz = "sm") => <ScalingCapsuleButton variant="cyberpunk" label="Deploy Matrix" size={sz} />,
      },
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
    hasSizeControl: true,
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
    variantsList: [
      {
        title: "UI Pirate Magma",
        themeValue: "#FF5B04",
        themeProp: 'pulseColor="#FF5B04"',
        badgeColor: "#FF5B04",
        description: "Signature glowing orange radiant pulse bloom for high-conversion CTAs.",
        renderPreview: (sz = "sm") => <MagneticPulseCTA label="Let's Venture" pulseColor="#FF5B04" />,
      },
      {
        title: "Emerald Pulse",
        themeValue: "#00E5BE",
        themeProp: 'pulseColor="#00E5BE"',
        badgeColor: "#00E5BE",
        description: "Electric teal-emerald ambient pulse wave with responsive press damping.",
        renderPreview: (sz = "sm") => <MagneticPulseCTA label="Active Beam" pulseColor="#00E5BE" />,
      },
      {
        title: "Laser Sky Cyan",
        themeValue: "#38BDF8",
        themeProp: 'pulseColor="#38BDF8"',
        badgeColor: "#38BDF8",
        description: "High-voltage sky cyan beacon wave with audio trigger click listener.",
        renderPreview: (sz = "sm") => <MagneticPulseCTA label="Launch Now" pulseColor="#38BDF8" />,
      },
      {
        title: "Electric Purple",
        themeValue: "#8B5CF6",
        themeProp: 'pulseColor="#8B5CF6"',
        badgeColor: "#8B5CF6",
        description: "Deep violet ambient glow aura for creative studio and agency actions.",
        renderPreview: (sz = "sm") => <MagneticPulseCTA label="Explore Lab" pulseColor="#8B5CF6" />,
      },
    ],
  },
  {
    id: "animated-slide-button",
    name: "Animated Slide-Up Button",
    category: "buttons",
    categoryLabel: "Buttons & CTAs",
    badge: "Micro-Interaction",
    badgeColor: "#8B5CF6",
    description:
      "Dual-text roll CTA button that smoothly translates labels vertically on hover with overflow clipping. Optimized for high-conversion service cards.",
    detailUrl: "/componentlab/animated-slide-button",
    defaultLabel: "Explore Services",
    hasLabelControl: true,
    hasHoverTextControl: true,
    defaultHoverText: "See More →",
    hasSizeControl: true,
    hasThemeControl: true,
    defaultTheme: "primary",
    availableThemes: [
      { value: "primary", label: "Primary", color: "#8B5CF6" },
      { value: "secondary", label: "Secondary", color: "#64748B" },
    ],
    features: [
      "Dual text vertical roll on hover",
      "Smooth translateY with overflow clip",
      "Primary & secondary styles",
      "Zero layout shift",
    ],
    previewLight: (
      <div className="py-8 flex items-center justify-center w-full max-w-[240px] mx-auto">
        <AnimatedButton primaryText="Explore Services" hoverText="See More →" variant="primary" className="!mt-0" />
      </div>
    ),
    previewDark: (
      <div className="py-8 flex items-center justify-center w-full max-w-[240px] mx-auto">
        <AnimatedButton primaryText="Explore Services" hoverText="See More →" variant="primary" className="!mt-0" />
      </div>
    ),
    jsxCode: `import { AnimatedButton } from "@/components/AnimatedButton";

export default function Example() {
  return (
    <AnimatedButton
      primaryText="Explore Services"
      hoverText="See More →"
      variant="primary"
    />
  );
}`,
    htmlCode: `<button class="relative overflow-hidden px-6 py-3 rounded-full bg-[#8B5CF6] text-white font-bold text-sm">
  <span class="block transition-transform duration-300 group-hover:-translate-y-full">Explore Services</span>
  <span class="absolute inset-0 flex items-center justify-center translate-y-full transition-transform duration-300 group-hover:translate-y-0">See More →</span>
</button>`,
    cssCode: `/* Animated Slide-Up Tokens */
:root {
  --slide-roll-duration: 300ms;
  --slide-roll-ease: cubic-bezier(0.4, 0, 0.2, 1);
}`,
    props: [
      { name: "primaryText", type: "string", defaultValue: "—", description: "Label shown in the resting state." },
      { name: "hoverText", type: "string", defaultValue: '"See More"', description: "Label rolled in on hover." },
      { name: "variant", type: '"primary" | "secondary"', defaultValue: '"primary"', description: "Colour style of the pill." },
    ],
    variantsList: [
      {
        title: "Primary Obsidian",
        themeValue: "primary",
        themeProp: 'variant="primary"',
        badgeColor: "#8B5CF6",
        description: "Solid high-contrast obsidian button with seamless vertical text roll on hover.",
        renderPreview: () => <AnimatedButton primaryText="Explore Services" hoverText="See More →" variant="primary" className="!mt-0" fullWidth={false} />,
      },
      {
        title: "Secondary Outline",
        themeValue: "secondary",
        themeProp: 'variant="secondary"',
        badgeColor: "#64748B",
        description: "Clean bordered ghost button with inverse slide-up text reveal effect.",
        renderPreview: () => <AnimatedButton primaryText="Read Docs" hoverText="Open API →" variant="secondary" className="!mt-0" fullWidth={false} />,
      },
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
    hasThemeModeControl: true,
    defaultThemeMode: "auto",
    hasDurationControl: true,
    defaultDuration: 0.65,
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
  return (
    <ArcCornerToggle
      size="md"
      themeMode="auto"
      duration={0.65}
      onToggle={(active) => console.log("Toggled:", active)}
    />
  );
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
      { name: "size", type: '"xs" | "sm" | "md" | "lg" | "xl"', defaultValue: '"md"', description: "Named size preset." },
      { name: "themeMode", type: '"auto" | "light" | "dark"', defaultValue: '"auto"', description: "Force specific theme or let state dictate." },
      { name: "duration", type: "number", defaultValue: "0.65", description: "Animation duration in seconds." },
      { name: "scale", type: "number", defaultValue: "1", description: "CSS transform scale multiplier for responsive fitting." },
      { name: "onToggle", type: "(state: boolean) => void", defaultValue: "undefined", description: "State change listener." },
    ],
    variantsList: [
      {
        title: "Sunburst Dial (Interactive)",
        themeValue: "default",
        themeProp: 'themeMode="auto"',
        badgeColor: "#C084FC",
        description: "90° circular corner arc track with rotating capsule knob and laser beam flare.",
        renderPreview: () => <ArcCornerToggle scale={0.75} />,
      },
      {
        title: "Light Mode (Clay Matte)",
        themeValue: "light",
        themeProp: 'themeMode="light"',
        badgeColor: "#E2E8F0",
        description: "Clay light surface with matte dark track contour and sunburst dial.",
        renderPreview: () => <ArcCornerToggle scale={0.75} themeMode="light" />,
      },
      {
        title: "⚡ Snappy Response (0.35s)",
        themeValue: "snappy",
        themeProp: "duration={0.35}",
        badgeColor: "#F59E0B",
        description: "High-velocity snap transition for instant tactile feedback.",
        renderPreview: () => <ArcCornerToggle scale={0.75} duration={0.35} />,
      },

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
      { name: "size", type: '"xs" | "sm" | "md" | "lg" | "xl"', defaultValue: '"md"', description: "Padding scale." },
    ],
    variantsList: [
      {
        title: "Vibrant Gradient",
        themeValue: "gradient",
        themeProp: 'variant="gradient"',
        badgeColor: "#8B5CF6",
        description: "Multi-layer backdrop blur with glowing purple-indigo specular gradient sheen.",
        renderPreview: (sz = "sm") => <GlassBadge variant="gradient" size={sz}>FEATURED</GlassBadge>,
      },
      {
        title: "Laser Cyan",
        themeValue: "cyan",
        themeProp: 'variant="cyan"',
        badgeColor: "#06B6D4",
        description: "Electric cyan status badge with frosted glass diffusion and glowing beacon.",
        renderPreview: (sz = "sm") => <GlassBadge variant="cyan" size={sz}>1:1 SPEC</GlassBadge>,
      },
      {
        title: "Obsidian Solid",
        themeValue: "solid",
        themeProp: 'variant="solid"',
        badgeColor: "#64748B",
        description: "Minimalist dark translucent glass pill for clean technical documentation headers.",
        renderPreview: (sz = "sm") => <GlassBadge variant="solid" size={sz}>PRODUCTION READY</GlassBadge>,
      },
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
    variantsList: [
      {
        title: "Frosted Glass Surface",
        themeValue: "default",
        themeProp: "blur={20}",
        badgeColor: "#3B82F6",
        description: "Deep frosted glassmorphic card container with specular highlight rim and hardware blur.",
        renderPreview: () => (
          <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/10 backdrop-blur-xl shadow-lg text-center w-full max-w-[200px]">
            <div className="text-[11px] font-mono font-bold text-cyan-400">Glass Surface</div>
            <div className="text-[10px] text-gray-400 mt-0.5">Gaussian Blur 20px</div>
          </div>
        ),
      },
    ],
  },
  {
    id: "tactile-neumorphic-toggle",
    name: "Tactile Neumorphic Pill Toggle",
    category: "controls",
    categoryLabel: "Controls & Toggles",
    badge: "Debossed Neumorphic",
    badgeColor: "#3B82F6",
    description:
      "Ultra-tactile debossed neumorphic pill switch with a 5-layer inset shadow groove, brushed metallic sliding thumb with specular bevels, and etched status glyphs.",
    detailUrl: "/componentlab/tactile-neumorphic-toggle",
    defaultLabel: "Power State",
    hasLabelControl: true,
    hasSizeControl: true,
    hasThemeControl: true,
    hasShowIconsControl: true,
    defaultShowIcons: true,
    defaultTheme: "brushed-silver",
    availableThemes: [
      { value: "brushed-silver", label: "Brushed Silver", color: "#94A3B8" },
      { value: "dark-obsidian", label: "Dark Obsidian", color: "#1E293B" },
      { value: "cyber-cyan", label: "Cyber Cyan", color: "#06B6D4" },
      { value: "emerald-glow", label: "Emerald Matrix", color: "#10B981" },
      { value: "magma-orange", label: "Magma Orange", color: "#FF5B04" },
      { value: "hyper-violet", label: "Hyper Violet", color: "#A855F7" },
    ],
    features: [
      "Pixel-accurate debossed neumorphic pill geometry",
      "5-layer optical inset shadow track geometry",
      "Brushed metallic gradient knob with bevel highlight",
      "Smooth physics-based spring slide animation",
    ],
    previewLight: (
      <div className="py-8 flex items-center justify-center">
        <TactileNeumorphicToggle theme="brushed-silver" size="md" defaultChecked={true} label="Active Setting" />
      </div>
    ),
    previewDark: (
      <div className="py-8 flex items-center justify-center">
        <TactileNeumorphicToggle theme="brushed-silver" size="md" defaultChecked={true} label="Active Setting" />
      </div>
    ),
    jsxCode: `import { TactileNeumorphicToggle } from "@/components/TactileNeumorphicToggle";

export default function Example() {
  return (
    <TactileNeumorphicToggle
      theme="brushed-silver"
      size="md"
      defaultChecked={true}
      onChange={(checked) => console.log("State:", checked)}
    />
  );
}`,
    htmlCode: `<div role="switch" aria-checked="true" class="relative inline-flex items-center w-[98px] h-[38px] rounded-full bg-[#D8DDE5] shadow-[inset_1.8px_3.25px_2.89px_-1.08px_#8F9BAE,inset_-1.8px_-4.34px_2.89px_-1.08px_#ffffffb3]">
  <span class="w-[46px] h-[30px] rounded-full bg-gradient-to-br from-[#F6F7F7] via-[#F5F6F8] to-[#A0ACC1] shadow-md transform translate-x-[44px]"></span>
</div>`,
    cssCode: `/* 5-Layer Neumorphic Track Shadows */
.neumorphic-track {
  background: #D8DDE5;
  box-shadow:
    inset 1.8px 3.25px 2.89px -1.08px rgba(144, 155, 176, 1),
    inset -1.8px -4.34px 2.89px -1.08px rgba(255, 255, 255, 0.7),
    inset 1.8px -4.34px 2.89px -1.08px rgba(255, 255, 255, 0.7),
    inset -7.23px 6.14px 5.42px -7.23px rgba(215, 222, 230, 1),
    inset 8.31px 6.14px 5.42px -7.23px rgba(215, 222, 230, 1);
}`,
    props: [
      { name: "checked", type: "boolean", defaultValue: "false", description: "Controlled boolean checked state." },
      { name: "theme", type: '"brushed-silver" | "dark-obsidian" | "cyber-cyan" | "emerald-glow" | "magma-orange" | "hyper-violet"', defaultValue: '"brushed-silver"', description: "Color theme palette." },
      { name: "size", type: '"sm" | "md" | "lg" | "xl"', defaultValue: '"md"', description: "Button dimensions scale." },
      { name: "showIcons", type: "boolean", defaultValue: "true", description: "Whether to show etched 0 / I glyphs." },
    ],
    variantsList: [
      {
        title: "Brushed Silver",
        themeValue: "brushed-silver",
        themeProp: 'theme="brushed-silver"',
        badgeColor: "#94A3B8",
        description: "Photorealistic debossed silver track with a brushed metallic slider knob.",
        renderPreview: (sz = "sm") => <TactileNeumorphicToggle theme="brushed-silver" size={sz} defaultChecked={true} />,
      },
      {
        title: "Dark Obsidian",
        themeValue: "dark-obsidian",
        themeProp: 'theme="dark-obsidian"',
        badgeColor: "#94A3B8",
        description: "Midnight dark clay chassis with deep carved shadow trench and illuminated LED.",
        renderPreview: (sz = "sm") => <TactileNeumorphicToggle theme="dark-obsidian" size={sz} defaultChecked={true} />,
      },
      {
        title: "Cyber Cyan",
        themeValue: "cyber-cyan",
        themeProp: 'theme="cyber-cyan"',
        badgeColor: "#06B6D4",
        description: "High-voltage laser cyan glowing groove with specular bevel highlights.",
        renderPreview: (sz = "sm") => <TactileNeumorphicToggle theme="cyber-cyan" size={sz} defaultChecked={true} />,
      },
      {
        title: "Emerald Matrix",
        themeValue: "emerald-glow",
        themeProp: 'theme="emerald-glow"',
        badgeColor: "#10B981",
        description: "Vibrant emerald photon illumination channel with smooth spring sliding.",
        renderPreview: (sz = "sm") => <TactileNeumorphicToggle theme="emerald-glow" size={sz} defaultChecked={true} />,
      },
      {
        title: "Magma Orange",
        themeValue: "magma-orange",
        themeProp: 'theme="magma-orange"',
        badgeColor: "#FF5B04",
        description: "Signature molten orange glow track with etched 0 / I state indicators.",
        renderPreview: (sz = "sm") => <TactileNeumorphicToggle theme="magma-orange" size={sz} defaultChecked={true} />,
      },
      {
        title: "Hyper Violet",
        themeValue: "hyper-violet",
        themeProp: 'theme="hyper-violet"',
        badgeColor: "#A855F7",
        description: "Deep ultraviolet neon glow channel with multi-tier optical drop shadow.",
        renderPreview: (sz = "sm") => <TactileNeumorphicToggle theme="hyper-violet" size={sz} defaultChecked={true} />,
      },
    ],
  },
  {
    id: "glossy-gel-button",
    name: "Glossy Gel Glass Button",
    category: "buttons",
    categoryLabel: "Buttons & CTAs",
    badge: "Liquid Glass",
    badgeColor: "#10B981",
    description:
      "High-gloss skeuomorphic gel glass CTA button directly from spec (Node 2:2). Multi-layer inner shadow depth, organic specular blurred highlight capsule, and crisp text drop shadow.",
    detailUrl: "/componentlab/glossy-gel-button",
    defaultLabel: "Get Started",
    hasLabelControl: true,
    hasSizeControl: true,
    hasThemeControl: true,
    defaultTheme: "emerald-gel",
    availableThemes: [
      { value: "emerald-gel", label: "Emerald Mint (1:1)", color: "#32E49D" },
      { value: "cyan-gel", label: "Electric Cyan", color: "#38BDF8" },
      { value: "violet-gel", label: "Cyber Violet", color: "#C084FC" },
      { value: "magma-gel", label: "Magma Amber", color: "#FB923C" },
      { value: "silver-glass", label: "Frosted Silver Glass", color: "#E2E8F0" },
      { value: "obsidian-glass", label: "Dark Obsidian", color: "#1E293B" },
    ],
    features: [
      "1:1 spec fidelity from node 2:2 (Glossy Gel Button)",
      "4-layer optical drop & inner shadow composite",
      "Curved blurred top specular reflection capsule",
      "Interactive spring depression & specular sheen animation",
    ],
    previewLight: (
      <div className="py-8 flex items-center justify-center">
        <GlossyGelButton theme="emerald-gel" size="md">Get Started</GlossyGelButton>
      </div>
    ),
    previewDark: (
      <div className="py-8 flex items-center justify-center">
        <GlossyGelButton theme="emerald-gel" size="md">Get Started</GlossyGelButton>
      </div>
    ),
    jsxCode: `import { GlossyGelButton } from "@/components/GlossyGelButton";

export default function Example() {
  return (
    <GlossyGelButton theme="emerald-gel" size="md" onClick={() => console.log("Started")}>
      Get Started
    </GlossyGelButton>
  );
}`,
    htmlCode: `<button class="relative px-7 py-3.5 rounded-[18px] font-semibold text-[#072B1F] bg-gradient-to-b from-[#32E49D] to-[#20C982] shadow-[3px_4px_6px_rgba(35,46,64,0.22),inset_0_-7px_8px_-6px_rgba(76,86,108,0.9)]">
  <span class="relative z-10 [text-shadow:0_1px_0_rgba(255,255,255,0.4)]">Get Started</span>
</button>`,
    cssCode: `/* Skeuomorphic Gel Button Shadows */
.glossy-gel-button {
  background: linear-gradient(180deg, #32E49D 0%, #20C982 100%);
  border-radius: 18px;
  box-shadow:
    3px 4px 6px rgba(35, 46, 64, 0.22),
    inset 0 -7px 8px -6px rgba(76, 86, 108, 0.90),
    inset 1px 1px 2px rgba(76, 86, 108, 0.80),
    inset 0 -1px 3px rgba(255, 255, 255, 0.45);
}`,
    props: [
      { name: "children", type: "ReactNode", defaultValue: '"Get Started"', description: "Button text or custom children." },
      { name: "theme", type: '"emerald-gel" | "cyan-gel" | "violet-gel" | "magma-gel" | "silver-glass" | "obsidian-glass"', defaultValue: '"emerald-gel"', description: "Color theme preset." },
      { name: "size", type: '"sm" | "md" | "lg" | "xl"', defaultValue: '"md"', description: "Button size scale." },
      { name: "isLoading", type: "boolean", defaultValue: "false", description: "Displays loading spinner." },
    ],
    variantsList: [
      {
        title: "Emerald Mint (Node 2:2)",
        themeValue: "emerald-gel",
        themeProp: 'theme="emerald-gel"',
        badgeColor: "#32E49D",
        description: "1:1 spec fidelity skeuomorphic gel glass button with curved top specular highlight.",
        renderPreview: (sz = "sm") => <GlossyGelButton theme="emerald-gel" size={sz}>Get Started</GlossyGelButton>,
      },
      {
        title: "Electric Cyan Gel",
        themeValue: "cyan-gel",
        themeProp: 'theme="cyan-gel"',
        badgeColor: "#38BDF8",
        description: "Vibrant liquid cyan glass with multi-layer inner shadow depth and spring click bounce.",
        renderPreview: (sz = "sm") => <GlossyGelButton theme="cyan-gel" size={sz}>Download</GlossyGelButton>,
      },
      {
        title: "Cyber Violet Gel",
        themeValue: "violet-gel",
        themeProp: 'theme="violet-gel"',
        badgeColor: "#C084FC",
        description: "Rich purple glass finish with specular blurred highlight capsule and crisp drop shadow.",
        renderPreview: (sz = "sm") => <GlossyGelButton theme="violet-gel" size={sz}>Upgrade Pro</GlossyGelButton>,
      },
      {
        title: "Magma Amber Gel",
        themeValue: "magma-gel",
        themeProp: 'theme="magma-gel"',
        badgeColor: "#FB923C",
        description: "Warm amber-gold liquid gel with tactile spring depression physics.",
        renderPreview: (sz = "sm") => <GlossyGelButton theme="magma-gel" size={sz}>Claim Access</GlossyGelButton>,
      },
      {
        title: "Frosted Silver Glass",
        themeValue: "silver-glass",
        themeProp: 'theme="silver-glass"',
        badgeColor: "#E2E8F0",
        description: "Translucent frosted silver glass with optical refraction rim and clean typography.",
        renderPreview: (sz = "sm") => <GlossyGelButton theme="silver-glass" size={sz}>Explore</GlossyGelButton>,
      },
      {
        title: "Dark Obsidian Glass",
        themeValue: "obsidian-glass",
        themeProp: 'theme="obsidian-glass"',
        badgeColor: "#94A3B8",
        description: "Stealth obsidian glass with glowing cyan accent text and specular shine.",
        renderPreview: (sz = "sm") => <GlossyGelButton theme="obsidian-glass" size={sz}>Start Free</GlossyGelButton>,
      },
    ],
  },
  {
    id: "tactile-neumorphic-switch",
    name: "Tactile Neumorphic Dual-Dome Switch",
    category: "controls",
    categoryLabel: "Controls & Toggles",
    badge: "Photon Channel",
    badgeColor: "#10E599",
    description:
      "Photorealistic 3D neumorphic toggle switch with an outer recessed bevel cavity, deep carved shadow trench, illuminated emerald photon channel, and dual-dome sculpted tactile thumb.",
    detailUrl: "/componentlab/tactile-neumorphic-switch",
    defaultLabel: "Power State",
    hasLabelControl: true,
    hasSizeControl: true,
    hasThemeControl: true,
    defaultTheme: "emerald-photon",
    availableThemes: [
      { value: "emerald-photon", label: "Emerald Photon", color: "#10E599" },
      { value: "cyber-cyan", label: "Cyber Laser Cyan", color: "#00E5FF" },
      { value: "magma-orange", label: "UI Pirate Magma", color: "#FF5B04" },
      { value: "dark-obsidian", label: "Dark Obsidian Stealth", color: "#38BDF8" },
      { value: "hyper-violet", label: "Hyper Ultraviolet", color: "#C084FC" },
      { value: "amber-crt", label: "Amber CRT Gold", color: "#FBBF24" },
    ],
    features: [
      "Pixel-accurate OFF and ON state rendering",
      "Dual-dome sculpted tactile thumb with spherical light highlights",
      "Deep recessed shadow trench with illuminated emerald fill",
      "Outer recessed bevel cavity with 3D inset lighting",
      "60fps responsive spring motion physics",
    ],
    previewLight: (
      <div className="py-8 flex items-center justify-center">
        <TactileNeumorphicSwitch theme="emerald-photon" size="md" defaultChecked={true} />
      </div>
    ),
    previewDark: (
      <div className="py-8 flex items-center justify-center">
        <TactileNeumorphicSwitch theme="emerald-photon" size="md" defaultChecked={true} />
      </div>
    ),
    jsxCode: `import { TactileNeumorphicSwitch } from "@/components/TactileNeumorphicSwitch";

export default function Example() {
  return (
    <TactileNeumorphicSwitch
      theme="emerald-photon"
      size="md"
      defaultChecked={true}
      onChange={(checked) => console.log("State:", checked)}
    />
  );
}`,
    htmlCode: `<div role="switch" aria-checked="true" class="relative w-[320px] h-[140px] rounded-[70px] bg-[#DFE3EB] shadow-[inset_5px_6px_12px_rgba(150,162,182,0.65),inset_-5px_-6px_12px_rgba(255,255,255,0.95)] flex items-center justify-center">
  <div class="relative w-[276px] h-[84px] rounded-[42px] bg-gradient-to-b from-[#C2C9D6] to-[#E7ECF3] shadow-[inset_0_8px_12px_rgba(60,72,92,0.45)] overflow-hidden">
    <div class="w-full h-full bg-gradient-to-r from-[#02B86E] via-[#0AD483] to-[#2BF3A4] shadow-[0_0_18px_rgba(16,229,153,0.35)]"></div>
  </div>
  <div class="absolute w-[136px] h-[96px] rounded-[48px] bg-white shadow-xl flex items-center justify-between px-2">
    <div class="w-[60px] h-[60px] rounded-full bg-radial shadow-inner"></div>
    <div class="w-[60px] h-[60px] rounded-full bg-radial shadow-inner"></div>
  </div>
</div>`,
    cssCode: `/* Neumorphic Switch Tokens */
:root {
  --switch-outer-bg: linear-gradient(145deg, #DFE3EB 0%, #EAEEF5 100%);
  --switch-outer-shadow: inset 5px 6px 12px rgba(150, 162, 182, 0.65), inset -5px -6px 12px #FFFFFF;
  --switch-track-on: linear-gradient(90deg, #02B86E 0%, #0AD483 40%, #2BF3A4 85%, #56F8B6 100%);
  --switch-knob-shadow: 0 16px 28px -3px rgba(35, 48, 70, 0.32), 0 8px 14px -2px rgba(35, 48, 70, 0.22);
}`,
    props: [
      { name: "checked", type: "boolean", defaultValue: "false", description: "Controlled boolean state." },
      { name: "stateMode", type: '"interactive" | "off" | "on"', defaultValue: '"interactive"', description: "Force a static OFF, static ON, or live toggle." },
      { name: "theme", type: '"emerald-photon" | "cyber-cyan" | "magma-orange" | "dark-obsidian" | "hyper-violet" | "amber-crt"', defaultValue: '"emerald-photon"', description: "Illumination theme palette." },
      { name: "size", type: '"sm" | "md" | "lg" | "xl"', defaultValue: '"md"', description: "Proportional scale size preset." },
      { name: "showGrid", type: "boolean", defaultValue: "true", description: "Shows fine mesh canvas grid." },
    ],
    variantsList: [
      {
        title: "Off State",
        themeValue: "emerald-photon",
        themeProp: 'stateMode="off"',
        badgeColor: "#94A3B8",
        description: "Resting neutral clay trench with dual-dome sculpted knob.",
        renderPreview: (sz = "sm") => <TactileNeumorphicSwitch theme="emerald-photon" stateMode="off" size={sz} />,
      },
      {
        title: "On State",
        themeValue: "emerald-photon",
        themeProp: 'stateMode="on"',
        badgeColor: "#10E599",
        description: "Glowing emerald photon illumination channel with right dock.",
        renderPreview: (sz = "sm") => <TactileNeumorphicSwitch theme="emerald-photon" stateMode="on" size={sz} />,
      },
      {
        title: "Interactive Spring",
        themeValue: "emerald-photon",
        themeProp: 'theme="emerald-photon"',
        badgeColor: "#10E599",
        description: "Interactive 60fps spring toggle with dynamic channel fill.",
        renderPreview: (sz = "sm") => <TactileNeumorphicSwitch theme="emerald-photon" stateMode="interactive" size={sz} />,
      },
      {
        title: "Cyber Laser Cyan",
        themeValue: "cyber-cyan",
        themeProp: 'theme="cyber-cyan"',
        badgeColor: "#00E5FF",
        description: "High-voltage laser cyan glowing optical underlayer.",
        renderPreview: (sz = "sm") => <TactileNeumorphicSwitch theme="cyber-cyan" stateMode="interactive" size={sz} />,
      },
      {
        title: "UI Pirate Magma",
        themeValue: "magma-orange",
        themeProp: 'theme="magma-orange"',
        badgeColor: "#FF5B04",
        description: "Signature magma orange molten photon illumination.",
        renderPreview: (sz = "sm") => <TactileNeumorphicSwitch theme="magma-orange" stateMode="interactive" size={sz} />,
      },
      {
        title: "Dark Obsidian Stealth",
        themeValue: "dark-obsidian",
        themeProp: 'theme="dark-obsidian"',
        badgeColor: "#38BDF8",
        description: "Midnight dark clay chassis with glowing sapphire channel.",
        renderPreview: (sz = "sm") => <TactileNeumorphicSwitch theme="dark-obsidian" stateMode="interactive" size={sz} />,
      },
    ],
  },
  {
    id: "luminous-shelf-card",
    name: "Luminous Shelf Card",
    category: "surfaces",
    categoryLabel: "Surfaces & Glass",
    badge: "Hover Lighting",
    badgeColor: "#E6E8F0",
    description:
      "Dark product card with an under-shelf light that strikes on hover — a volumetric cone washes up the wall, the shelf edge becomes a hot filament, and the feather pin is lit from below while casting a soft shadow upward.",
    detailUrl: "/componentlab/luminous-shelf-card",
    defaultLabel: "Light Work",
    hasLabelControl: true,
    hasSizeControl: true,
    hasThemeControl: true,
    defaultTheme: "white",
    availableThemes: [
      { value: "white", label: "Studio White", color: "#E6E8F5" },
      { value: "warm", label: "Incandescent", color: "#FFD69E" },
      { value: "arctic", label: "Arctic Cyan", color: "#AAE2FF" },
      { value: "amber", label: "Amber Sodium", color: "#FFBE70" },
      { value: "emerald", label: "Emerald Lab", color: "#A2F0CA" },
      { value: "magenta", label: "Neon Magenta", color: "#FFB0E2" },
    ],
    features: [
      "Volumetric upward light cone (screen-blended layers)",
      "Shelf edge strikes into a hot filament line",
      "Feather pin lit from below, casts shadow upward",
      "Fluorescent-tube flicker on turn-on",
    ],
    previewLight: (
      <div className="py-8 flex items-center justify-center">
        <LuminousShelfCard title="Light Work" subtitle="Life life on easy mode." stateMode="interactive" />
      </div>
    ),
    previewDark: (
      <div className="py-8 flex items-center justify-center">
        <LuminousShelfCard title="Light Work" subtitle="Life life on easy mode." stateMode="interactive" />
      </div>
    ),
    jsxCode: `import { LuminousShelfCard } from "@/components/LuminousShelfCard";

export default function Example() {
  return (
    <LuminousShelfCard
      title="Light Work"
      subtitle="Life life on easy mode by UI Pirate"
      theme="white"
      size="md"
      stateMode="interactive"
      onClick={() => console.log("Card lit")}
    />
  );
}`,
    htmlCode: `<!-- Structure only — the light layers need the component's motion + blend modes -->
<article class="lsc">
  <div class="lsc__frame"></div>
  <div class="lsc__body">
    <div class="lsc__wash"></div>      <!-- volumetric cone, opacity 0 -> 1 on hover -->
    <div class="lsc__pin"><svg><!-- feather --></svg></div>
    <div class="lsc__shelf"><span class="lsc__filament"></span></div>
    <div class="lsc__text">
      <h3>Light Work</h3>
      <p>Life life on easy mode by UI Pirate</p>
    </div>
    <div class="lsc__pill"></div>
  </div>
</article>`,
    cssCode: `/* Luminous Shelf Card — design tokens */
:root {
  --lsc-w: 340px;
  --lsc-h: 460px;
  --lsc-radius: 28px;
  --lsc-shelf-top: 286px;

  /* light colour (Studio White) */
  --lsc-wash: 236, 238, 245;
  --lsc-core: #ffffff;
  --lsc-bloom: 255, 255, 255;
  --lsc-lit-tint: 244, 247, 255;
}

.lsc__body {
  border-radius: var(--lsc-radius);
  background: linear-gradient(180deg, #212226 0%, #171719 52%, #0b0b0d 100%);
  border: 1px solid rgba(255, 255, 255, 0.07);
  box-shadow: 0 40px 80px -24px rgba(0, 0, 0, 0.7),
              inset 0 1px 0 rgba(255, 255, 255, 0.05);
  overflow: hidden;
}

/* volumetric wash — hidden until hover */
.lsc__wash {
  position: absolute;
  left: 50%;
  bottom: calc(var(--lsc-h) - var(--lsc-shelf-top) - 26px);
  width: 460px;
  height: 330px;
  transform: translateX(-50%);
  mix-blend-mode: screen;
  filter: blur(6px);
  opacity: 0;
  transition: opacity 0.5s ease;
  background: radial-gradient(ellipse 56% 92% at 50% 100%,
              rgba(var(--lsc-wash), 0.34) 0%,
              rgba(var(--lsc-wash), 0.12) 42%,
              rgba(var(--lsc-wash), 0) 76%);
}
.lsc:hover .lsc__wash { opacity: 1; }

/* shelf edge filament */
.lsc__filament {
  position: absolute;
  inset: 0 0 auto 0;
  height: 2px;
  background: var(--lsc-core);
  opacity: 0;
  transition: opacity 0.4s ease;
  box-shadow: 0 0 10px 1px rgba(var(--lsc-bloom), 0.95),
              0 0 26px 6px rgba(var(--lsc-wash), 0.6);
}
.lsc:hover .lsc__filament { opacity: 1; }

/* feather pin — teardrop */
.lsc__pin {
  position: absolute;
  top: 100px;
  left: 50%;
  width: 128px;
  height: 128px;
  transform: translateX(-50%);
  border-radius: 50% 50% 50% 10px;
  background: linear-gradient(145deg, #d4d4d4 0%, #a2a2a2 55%, #8a8a8a 100%);
  box-shadow: 0 22px 42px -14px rgba(0, 0, 0, 0.6),
              inset 0 1px 1px rgba(255, 255, 255, 0.45);
  transition: box-shadow 0.45s ease;
}
.lsc:hover .lsc__pin {
  /* lit from below: kill the downward drop, add an underglow rim */
  box-shadow: 0 -2px 26px -6px rgba(255, 255, 255, 0.14),
              inset 0 -9px 16px rgba(255, 255, 255, 0.22),
              inset 0 9px 16px rgba(0, 0, 0, 0.32);
}`,
    props: [
      { name: "title", type: "string", defaultValue: '"Light Work"', description: "Large heading, bottom-left." },
      { name: "subtitle", type: "string", defaultValue: '"Life life on easy mode by UI Pirate"', description: "One-line sub-text; clips at the card edge like the reference." },
      { name: "stateMode", type: '"interactive" | "standerd" | "hover"', defaultValue: '"interactive"', description: '"standerd" = light off · "hover" = light on · "interactive" = follows pointer / focus.' },
      { name: "size", type: '"sm" | "md" | "lg"', defaultValue: '"md"', description: "Uniform scale of the whole card." },
      { name: "theme", type: '"white" | "warm" | "arctic" | "amber" | "emerald" | "magenta"', defaultValue: '"white"', description: "Colour of the light that strikes on hover." },
      { name: "icon", type: "React.ReactNode", defaultValue: "<Feather />", description: "Glyph inside the pin." },
      { name: "showDeviceFrame", type: "boolean", defaultValue: "true", description: "Faint blueprint frame + corner brackets behind the card." },
      { name: "showPeekPill", type: "boolean", defaultValue: "true", description: "White pill peeking up from the bottom-right edge." },
      { name: "flicker", type: "boolean", defaultValue: "true", description: "Fluorescent-tube strike flicker when the light turns on." },
      { name: "onClick", type: "() => void", defaultValue: "undefined", description: "Fired on click / Enter / Space when set." },
    ],
    variantsList: [
      {
        title: "Studio White",
        themeValue: "white",
        themeProp: 'theme="white"',
        badgeColor: "#E6E8F5",
        description: "Neutral broadcast key-light — the reference look.",
        renderPreview: (sz = "sm") => <LuminousShelfCard theme="white" size={sz} stateMode="hover" subtitle="Life life on easy mode." />,
      },
      {
        title: "Incandescent",
        themeValue: "warm",
        themeProp: 'theme="warm"',
        badgeColor: "#FFD69E",
        description: "Tungsten bulb warmth pooling up the wall.",
        renderPreview: (sz = "sm") => <LuminousShelfCard theme="warm" size={sz} stateMode="hover" subtitle="Warm tungsten glow." />,
      },
      {
        title: "Arctic Cyan",
        themeValue: "arctic",
        themeProp: 'theme="arctic"',
        badgeColor: "#AAE2FF",
        description: "Cold clean-room strip lighting.",
        renderPreview: (sz = "sm") => <LuminousShelfCard theme="arctic" size={sz} stateMode="hover" subtitle="Cold clean-room light." />,
      },
      {
        title: "Amber Sodium",
        themeValue: "amber",
        themeProp: 'theme="amber"',
        badgeColor: "#FFBE70",
        description: "Street-lamp sodium orange bloom.",
        renderPreview: (sz = "sm") => <LuminousShelfCard theme="amber" size={sz} stateMode="hover" subtitle="Sodium street glow." />,
      },
      {
        title: "Emerald Lab",
        themeValue: "emerald",
        themeProp: 'theme="emerald"',
        badgeColor: "#A2F0CA",
        description: "Phosphor reactor green wash.",
        renderPreview: (sz = "sm") => <LuminousShelfCard theme="emerald" size={sz} stateMode="hover" subtitle="Phosphor reactor wash." />,
      },
      {
        title: "Neon Magenta",
        themeValue: "magenta",
        themeProp: 'theme="magenta"',
        badgeColor: "#FFB0E2",
        description: "Nightclub magenta tube strike.",
        renderPreview: (sz = "sm") => <LuminousShelfCard theme="magenta" size={sz} stateMode="hover" subtitle="Nightclub tube strike." />,
      },
    ],
  },
];

