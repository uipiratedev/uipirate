"use client";

import * as React from "react";
import { useState, useId } from "react";

export type JoinTactileButtonVariant = "orange" | "dark";
export type JoinTactileButtonState = "interactive" | "standerd" | "hover";
export type JoinTactileButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface JoinTactileButtonProps {
  /** Text on the key cap. Defaults to "LETS VENTURE.". */
  label?: string;
  /** Colour scheme for the backlit glow + edge lighting. */
  variant?: JoinTactileButtonVariant;
  /** Width tier; the button is fluid up to this bound (default: "md"). */
  size?: JoinTactileButtonSize;
  /** Force a state instead of reacting to pointer events. */
  stateMode?: JoinTactileButtonState;
  /** Show the ↗ glyph in the top-right corner. */
  showArrow?: boolean;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

/** Upper width bound per size tier (px). Aspect ratio is 392 : 130. */
const MAX_WIDTH: Record<JoinTactileButtonSize, number> = {
  xs: 260,
  sm: 340,
  md: 460,
  lg: 580,
  xl: 720,
};

const VARIANTS: Record<
  JoinTactileButtonVariant,
  {
    glowBase: string;
    glowCore: string;
    glowAccent: string;
    glowEdgeA: string;
    glowEdgeB: string;
    underglow: string;
    textColor: string;
    faceBg: string;
    shadowTint: string;
    filterShadowMatrix: string;
  }
> = {
  orange: {
    glowBase: "#ED5504",
    glowCore: "#FF6A00",
    glowAccent: "#FF5800",
    glowEdgeA: "#FF7A00",
    glowEdgeB: "#FFA31A",
    underglow:
      "linear-gradient(180deg, rgba(255, 88, 0, 0.55) 0%, rgba(237, 85, 4, 0.3) 35%, rgba(255, 88, 0, 0) 100%)",
    textColor: "#353535",
    faceBg: "#1D1607",
    shadowTint: "rgba(255, 88, 0, 0.55)",
    filterShadowMatrix: "0 0 0 0 1 0 0 0 0 0.357 0 0 0 0 0.016 0 0 0 1 0",
  },
  dark: {
    glowBase: "#0284C7",
    glowCore: "#38BDF8",
    glowAccent: "#0EA5E9",
    glowEdgeA: "#38BDF8",
    glowEdgeB: "#7DD3FC",
    underglow:
      "linear-gradient(180deg, rgba(56, 189, 248, 0.55) 0%, rgba(14, 165, 233, 0.3) 35%, rgba(2, 132, 199, 0) 100%)",
    textColor: "#0F1E2E",
    faceBg: "#08101E",
    shadowTint: "rgba(56, 189, 248, 0.55)",
    filterShadowMatrix: "0 0 0 0 0.22 0 0 0 0 0.74 0 0 0 0 0.97 0 0 0 1 0",
  },
};

/**
 * JoinTactileButton — Pixel-perfect implementation from Figma design node 8123:366.
 *
 * Industrial illuminated tactile switch:
 * - Gunmetal metallic outer casing with textured bezel skirt and specular highlights.
 * - Recessed socket with silver-bezel cavity and drop-shadows.
 * - 3D spring-action key cap with glowing golden-amber magma backlight.
 * - Upper display panel with "LETS VENTURE." typography and corner ↗ arrow.
 * - Horizontal industrial dividing groove with specular light strip.
 * - Ambient warm underglow beneath the button.
 */
export const JoinTactileButton: React.FC<JoinTactileButtonProps> = ({
  label = "LETS VENTURE.",
  variant = "orange",
  size = "md",
  stateMode = "interactive",
  showArrow = true,
  onClick,
  className = "",
  disabled = false,
}) => {
  const rawId = useId();
  const id = rawId.replace(/[^a-zA-Z0-9]/g, "");
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const live = stateMode === "interactive" && !disabled;
  const hovered =
    stateMode === "hover"
      ? true
      : stateMode === "standerd"
        ? false
        : isHovered && !disabled;
  const pressed = live ? isPressed : false;

  const v = VARIANTS[variant] ?? VARIANTS.orange;
  const widthPx = MAX_WIDTH[size] ?? 460;

  // Exact vector match if label is default
  const cleanLabel = label.trim().toUpperCase();
  const isDefaultLabel =
    cleanLabel === "LETS VENTURE." || cleanLabel === "LETS VENTURE";

  const capTransform = pressed
    ? "translateY(4px) scale(0.988)"
    : hovered
      ? "translateY(-3px) scale(1.012)"
      : "translateY(0) scale(1)";

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{
        width: "100%",
        maxWidth: `${widthPx}px`,
        aspectRatio: "392 / 130",
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      onClick={disabled ? undefined : onClick}
      onMouseDown={() => live && setIsPressed(true)}
      onMouseEnter={() => live && setIsHovered(true)}
      onMouseLeave={() => {
        if (!live) return;
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseUp={() => live && setIsPressed(false)}
      onTouchEnd={() => live && setIsPressed(false)}
      onTouchStart={() => live && setIsPressed(true)}
    >
      {/* Ambient underglow below the button casting onto the surface */}
      <div
        aria-hidden="true"
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[85%] h-[55px] pointer-events-none transition-all duration-300"
        style={{
          background: v.underglow,
          filter: "blur(26px)",
          opacity: pressed ? 0.95 : hovered ? 0.8 : 0.48,
          borderRadius: "100%",
        }}
      />

      <svg
        className="w-full h-full block overflow-visible"
        fill="none"
        viewBox="0 0 392 130"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
<defs>
<filter id={`filter0_i_${id}`} x="0" y="0" width="392" height="132" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
<feFlood floodOpacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="2"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.55 0"/>
<feBlend mode="normal" in2="shape" result={`effect1_innerShadow_${id}`}/>
</filter>
<pattern id={`pattern0_${id}`} patternContentUnits="objectBoundingBox" width="2.35102" height="7.08923">
<use xlinkHref={`#image0_${id}`} transform="scale(0.00229592 0.00692308)"/>
</pattern>
<filter id={`filter1_i_${id}`} x="0" y="0" width="392" height="102" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
<feFlood floodOpacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="1"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.7 0"/>
<feBlend mode="normal" in2="shape" result={`effect1_innerShadow_${id}`}/>
</filter>
<filter id={`filter2_dd_${id}`} x="0" y="-2" width="388" height="97" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
<feFlood floodOpacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="-2" dy="2"/>
<feGaussianBlur stdDeviation="1"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.713726 0 0 0 0 0.721569 0 0 0 0 0.717647 0 0 0 0.35 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result={`effect1_dropShadow_${id}`}/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feMorphology radius="7" operator="erode" in="SourceAlpha" result={`effect2_dropShadow_${id}`}/>
<feOffset dx="-9" dy="-8"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.713726 0 0 0 0 0.721569 0 0 0 0 0.717647 0 0 0 0.6 0"/>
<feBlend mode="normal" in2={`effect1_dropShadow_${id}`} result={`effect2_dropShadow_${id}`}/>
<feBlend mode="normal" in="SourceGraphic" in2={`effect2_dropShadow_${id}`} result="shape"/>
</filter>
<filter id={`filter3_d_${id}`} x="10" y="7" width="374.5" height="121" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
<feFlood floodOpacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.15 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result={`effect1_dropShadow_${id}`}/>
<feBlend mode="normal" in="SourceGraphic" in2={`effect1_dropShadow_${id}`} result="shape"/>
</filter>
<filter id={`filter4_f_${id}`} x="42" y="26" width="313" height="101" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
<feFlood floodOpacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="1.5" result={`effect1_foregroundBlur_${id}`}/>
</filter>
<filter id={`filter5_f_${id}`} x="-6" y="-5.02051" width="434" height="194" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
<feFlood floodOpacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="17" result={`effect1_foregroundBlur_${id}`}/>
</filter>
<filter id={`filter6_df_${id}`} x="167.924" y="7.73242" width="339.37" height="123.774" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
<feFlood floodOpacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset/>
<feGaussianBlur stdDeviation="12"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values={v.filterShadowMatrix}/>
<feBlend mode="normal" in2="BackgroundImageFix" result={`effect1_dropShadow_${id}`}/>
<feBlend mode="normal" in="SourceGraphic" in2={`effect1_dropShadow_${id}`} result="shape"/>
<feGaussianBlur stdDeviation="15" result={`effect2_foregroundBlur_${id}`}/>
</filter>
<filter id={`filter7_df_${id}`} x="261.886" y="71.374" width="259.792" height="109.01" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
<feFlood floodOpacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset/>
<feGaussianBlur stdDeviation="12"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values={v.filterShadowMatrix}/>
<feBlend mode="normal" in2="BackgroundImageFix" result={`effect1_dropShadow_${id}`}/>
<feBlend mode="normal" in="SourceGraphic" in2={`effect1_dropShadow_${id}`} result="shape"/>
<feGaussianBlur stdDeviation="5" result={`effect2_foregroundBlur_${id}`}/>
</filter>
<filter id={`filter10_f_${id}`} x="15" y="11" width="365" height="71" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
<feFlood floodOpacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="0.5" result={`effect1_foregroundBlur_${id}`}/>
</filter>
<filter id={`filter11_f_${id}`} x="149.046" y="-19.0576" width="254.168" height="155.506" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
<feFlood floodOpacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="20" result={`effect1_foregroundBlur_${id}`}/>
</filter>
<filter id={`filter12_f_${id}`} x="231.641" y="55.7139" width="171.478" height="150.788" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
<feFlood floodOpacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="20" result={`effect1_foregroundBlur_${id}`}/>
</filter>
<filter id={`filter13_df_${id}`} x="159.396" y="-11.0332" width="232.404" height="152.936" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
<feFlood floodOpacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset/>
<feGaussianBlur stdDeviation="12"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values={v.filterShadowMatrix}/>
<feBlend mode="normal" in2="BackgroundImageFix" result={`effect1_dropShadow_${id}`}/>
<feBlend mode="normal" in="SourceGraphic" in2={`effect1_dropShadow_${id}`} result="shape"/>
<feGaussianBlur stdDeviation="25" result={`effect2_foregroundBlur_${id}`}/>
</filter>
<filter id={`filter14_f_${id}`} x="38.27" y="55.7139" width="303.042" height="150.788" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
<feFlood floodOpacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="20" result={`effect1_foregroundBlur_${id}`}/>
</filter>
<filter id={`filter15_f_${id}`} x="62.2634" y="17.7148" width="199.787" height="115.318" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
<feFlood floodOpacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="10" result={`effect1_foregroundBlur_${id}`}/>
</filter>
<filter id={`filter16_df_${id}`} x="24.5" y="96.5" width="345" height="6" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
<feFlood floodOpacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="0.5"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.3 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result={`effect1_dropShadow_${id}`}/>
<feBlend mode="normal" in="SourceGraphic" in2={`effect1_dropShadow_${id}`} result="shape"/>
<feGaussianBlur stdDeviation="0.75" result={`effect2_foregroundBlur_${id}`}/>
</filter>
<filter id={`filter17_df_${id}`} x="24.5" y="85.5" width="345" height="10" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
<feFlood floodOpacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="0.5"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.7 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result={`effect1_dropShadow_${id}`}/>
<feBlend mode="normal" in="SourceGraphic" in2={`effect1_dropShadow_${id}`} result="shape"/>
<feGaussianBlur stdDeviation="0.75" result={`effect2_foregroundBlur_${id}`}/>
</filter>
<linearGradient id={`paint0_linear_${id}`} x1="375.298" y1="65" x2="392" y2="65" gradientUnits="userSpaceOnUse">
<stop stopOpacity="0"/>
<stop offset="0.5" stopOpacity="0.6"/>
<stop offset="1"/>
</linearGradient>
<linearGradient id={`paint1_linear_${id}`} x1="17.6842" y1="65" x2="3.4386" y2="65" gradientUnits="userSpaceOnUse">
<stop stopOpacity="0"/>
<stop offset="0.5" stopColor="white" stopOpacity="0.2"/>
<stop offset="1" stopColor="white" stopOpacity="0.6"/>
</linearGradient>
<linearGradient id={`paint2_linear_${id}`} x1="196.491" y1="1.74999e-08" x2="195.982" y2="102" gradientUnits="userSpaceOnUse">
<stop stopColor="#4F4F4F"/>
<stop offset="0.52583" stopColor="#646464"/>
<stop offset="0.892106" stopColor="white" stopOpacity="0.5"/>
<stop offset="0.95013" stopColor="#222224"/>
<stop offset="1" stopColor="#353130"/>
</linearGradient>
<linearGradient id={`paint3_linear_${id}`} x1="29.4737" y1="51" x2="147.368" y2="51" gradientUnits="userSpaceOnUse">
<stop stopColor="#141414"/>
<stop offset="1" stopOpacity="0"/>
</linearGradient>
<linearGradient id={`paint4_linear_${id}`} x1="394" y1="53.5" x2="356.5" y2="40.5" gradientUnits="userSpaceOnUse">
<stop stopColor="#141414"/>
<stop offset="1" stopOpacity="0"/>
</linearGradient>
<linearGradient id={`paint5_linear_${id}`} x1="6" y1="47" x2="388" y2="47" gradientUnits="userSpaceOnUse">
<stop offset="0.748942" stopColor="#666867"/>
<stop offset="1" stopColor="#87888A"/>
</linearGradient>
<radialGradient id={`paint6_radial_${id}`} cx="0" cy="0" r="1" gradientTransform="matrix(17.259 -2.5 10.8523 14.1477 20.9578 81.5)" gradientUnits="userSpaceOnUse">
<stop offset="0.437392" stopColor="white"/>
<stop offset="1" stopColor="white" stopOpacity="0"/>
</radialGradient>
<radialGradient id={`paint7_radial_${id}`} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(383 61.5) rotate(-171.703) scale(24.2538 96.1791)">
<stop stopColor="white"/>
<stop offset="0.481395" stopColor="white" stopOpacity="0"/>
</radialGradient>
<linearGradient id={`paint8_linear_${id}`} x1="54.5" y1="127" x2="144.5" y2="40.4999" gradientUnits="userSpaceOnUse">
<stop offset="0.82681" stopColor="#282828"/>
<stop offset="1" stopColor="#525252"/>
</linearGradient>
<linearGradient id={`paint9_linear_${id}`} x1="312.558" y1="20.6" x2="312.316" y2="29.0184" gradientUnits="userSpaceOnUse">
<stop stopColor={v.glowEdgeA}/>
<stop offset="1" stopOpacity="0"/>
</linearGradient>
<radialGradient id={`paint10_radial_${id}`} cx="0" cy="0" r="1" gradientTransform="matrix(31.8316 3.4 -131.713 3.9431 236.516 20)" gradientUnits="userSpaceOnUse">
<stop stopColor={v.glowEdgeB}/>
<stop offset="1" stopColor={v.glowEdgeB} stopOpacity="0"/>
</radialGradient>
<linearGradient id={`paint11_linear_${id}`} x1="313.221" y1="21" x2="306.765" y2="62.113" gradientUnits="userSpaceOnUse">
<stop stopColor={v.glowEdgeA}/>
<stop offset="1" stopOpacity="0"/>
</linearGradient>
<radialGradient id={`paint12_radial_${id}`} cx="0" cy="0" r="1" gradientTransform="matrix(29.0842 17 -120.345 19.7155 243.742 18)" gradientUnits="userSpaceOnUse">
<stop stopColor={v.glowEdgeB}/>
<stop offset="1" stopColor={v.glowEdgeB} stopOpacity="0"/>
</radialGradient>
<radialGradient id={`paint13_radial_${id}`} cx="0" cy="0" r="1" gradientTransform="matrix(34.8576 64 -336.696 31.7319 70.0894 12)" gradientUnits="userSpaceOnUse">
<stop stopColor="white"/>
<stop offset="1" stopColor="white" stopOpacity="0"/>
</radialGradient>
<linearGradient id={`paint14_linear_${id}`} x1="54.5" y1="127" x2="144.5" y2="40.4999" gradientUnits="userSpaceOnUse">
<stop offset="0.82681" stopColor="#282828"/>
<stop offset="1" stopColor="#525252"/>
</linearGradient>
<linearGradient id={`paint15_linear_${id}`} x1="26" y1="99.5" x2="368" y2="99.5" gradientUnits="userSpaceOnUse">
<stop/>
<stop offset="0.5" stopOpacity="0.2"/>
<stop offset="0.75" stopOpacity="0.2"/>
<stop offset="1"/>
</linearGradient>
<linearGradient id={`paint16_linear_${id}`} x1="26" y1="90.5" x2="368" y2="90.5" gradientUnits="userSpaceOnUse">
<stop stopColor="white" stopOpacity="0.3"/>
<stop offset="0.5" stopColor="white" stopOpacity="0.2"/>
<stop offset="0.75" stopColor="white" stopOpacity="0"/>
<stop offset="1" stopColor="white" stopOpacity="0.1"/>
</linearGradient>
<clipPath id={`clip0_${id}`}>
<rect width="392" height="130" rx="20" fill="white"/>
</clipPath>
<clipPath id={`clip1_${id}`}>
<rect width="392" height="102" rx="20" fill="white"/>
</clipPath>
<clipPath id={`clip2_${id}`}>
<rect x="45" y="18" width="307" height="105" fill="white"/>
</clipPath>
<clipPath id={`clip3_${id}`}>
<rect width="307" height="95" fill="white" transform="translate(45 29)"/>
</clipPath>
<clipPath id={`clip4_${id}`}>
<rect width="307" height="67" fill="white" transform="translate(45 30)"/>
</clipPath>
<clipPath id={`clip5_${id}`}>
<rect width="307" height="26" fill="white" transform="translate(45 97)"/>
</clipPath>
<image id={`image0_${id}`} width="1024" height="1024" preserveAspectRatio="none" xlinkHref="[BASE64_OMITTED]"/>
</defs>

<g filter={`url(#filter0_i_${id})`}>
<g clipPath={`url(#clip0_${id})`}>
<rect width="392" height="130" rx="20" fill="#4F4E4C"/>
<rect width="392" height="130" rx="20" fill={`url(#paint0_linear_${id})`}/>
<rect width="392" height="130" rx="20" fill={`url(#paint1_linear_${id})`}/>
<rect width="392" height="130" rx="20" fill={`url(#pattern0_${id})`} fillOpacity="0.05"/>
<g filter={`url(#filter1_i_${id})`}>
<g clipPath={`url(#clip1_${id})`}>
<rect width="392" height="102" rx="20" fill="black" fillOpacity="0.7"/>
<rect width="392" height="102" rx="20" fill={`url(#paint2_linear_${id})`}/>
<rect width="392" height="102" rx="20" fill={`url(#paint3_linear_${id})`}/>
<rect width="392" height="102" rx="20" fill={`url(#paint4_linear_${id})`}/>
<g filter={`url(#filter2_dd_${id})`}>
<path d="M6 18C6 9.71573 12.7157 3 21 3H373C381.284 3 388 9.71573 388 18V76C388 84.2843 381.284 91 373 91H21C12.7157 91 6 84.2843 6 76V18Z" fill={`url(#paint5_linear_${id})`}/>
<path d="M6 18C6 9.71573 12.7157 3 21 3H373C381.284 3 388 9.71573 388 18V76C388 84.2843 381.284 91 373 91H21C12.7157 91 6 84.2843 6 76V18Z" fill={`url(#paint6_radial_${id})`}/>
<path d="M6 18C6 9.71573 12.7157 3 21 3H373C381.284 3 388 9.71573 388 18V76C388 84.2843 381.284 91 373 91H21C12.7157 91 6 84.2843 6 76V18Z" fill={`url(#paint7_radial_${id})`} fillOpacity="0.2"/>
</g>
</g>
<rect x="0.25" y="0.25" width="391.5" height="101.5" rx="19.75" stroke="black" strokeOpacity="0.3" strokeWidth="0.5"/>
</g>


        <g
          className="transition-all duration-200 ease-out transform-gpu"
          style={{
            transform: capTransform,
            transformOrigin: "196px 65px",
            filter: hovered ? `drop-shadow(0 0 16px ${v.shadowTint})` : undefined,
          }}
        >
<g filter={`url(#filter3_d_${id})`}>
<path d="M10 18C10 11.9249 14.9249 7 21 7H373.5C379.575 7 384.5 11.9249 384.5 18V76C384.5 82.0751 379.575 87 373.5 87H373C372.448 87 372 87.4477 372 88V127H23.5C22.9477 127 22.5 126.552 22.5 126V88C22.5 87.4477 22.0523 87 21.5 87H21C14.9249 87 10 82.0751 10 76V18Z" fill="#0B0B09"/>
<path d="M21 7.5H373.5C379.299 7.5 384 12.201 384 18V76C384 81.799 379.299 86.5 373.5 86.5H373C372.172 86.5 371.5 87.1716 371.5 88V126.5H23.5C23.2239 126.5 23 126.276 23 126V88C23 87.1716 22.3284 86.5 21.5 86.5H21C15.201 86.5 10.5 81.799 10.5 76V18L10.5137 17.46C10.7947 11.9119 15.3821 7.5 21 7.5Z" stroke={`url(#paint8_linear_${id})`}/>
</g>
<g clipPath={`url(#clip2_${id})`}>
<rect x="45" y="18" width="307" height="105" fill={v.faceBg}/>
<path d="M19 20H355V41H19V20Z" fill={v.faceBg}/>
<path d="M354.5 20.5V40.5H19.5V20.5H354.5Z" stroke={`url(#paint9_linear_${id})`} strokeOpacity="0.1"/>
<path d="M354.5 20.5V40.5H19.5V20.5H354.5Z" stroke={`url(#paint10_radial_${id})`} strokeOpacity="0.2"/>
<g filter={`url(#filter4_f_${id})`}>
<g clipPath={`url(#clip3_${id})`}>
<g filter={`url(#filter5_f_${id})`}>
<path d="M392.967 92.0206C392.967 126.792 312.028 154.979 212.184 154.979C112.341 154.979 31.4012 126.792 31.4012 92.0206C9.01851 24.0649 100.269 29.0616 212.184 29.0616C418.792 29.0616 392.967 57.2493 392.967 92.0206Z" fill={v.glowBase}/>
</g>
<g filter={`url(#filter6_df_${id})`}>
<path d="M411.705 77.3007C424.183 100.371 516.482 99.404 458.114 100.655C399.745 101.907 212.813 104.902 200.334 81.8324C187.856 58.7624 225.057 39.0461 283.426 37.7947C341.794 36.5433 399.226 54.2307 411.705 77.3007Z" fill={v.glowCore}/>
</g>
<g filter={`url(#filter7_df_${id})`}>
<path d="M338.913 122.687C324.869 100.536 257.117 105.679 299.827 101.796C342.538 97.913 479.538 86.474 493.582 108.625C507.627 130.777 484.388 151.882 441.677 155.765C398.966 159.648 352.958 144.839 338.913 122.687Z" fill={v.glowCore}/>
</g>
</g>
</g>


          <g clipPath={`url(#clip4_${id})`}>
            {isDefaultLabel ? (
              <>
<path d="M84.9141 74.0001V51.3701H98.2131V54.3461H88.2001V60.7631H97.1281V63.7081H88.2001V71.0241H98.2131V74.0001H84.9141Z" fill={v.textColor}/>
<path d="M106.625 73.9999V54.4389H100.58V51.3389H116.018V54.4389H109.973V73.9999H106.625Z" fill={v.textColor}/>
<path d="M125.394 74.3103C123.864 74.3103 122.552 74.0623 121.457 73.5663C120.361 73.0496 119.514 72.3263 118.915 71.3963C118.315 70.4456 118.016 69.3193 118.016 68.0173H121.333C121.333 69.0506 121.694 69.867 122.418 70.4663C123.141 71.045 124.143 71.3343 125.425 71.3343C126.623 71.3343 127.564 71.045 128.246 70.4663C128.928 69.8876 129.269 69.092 129.269 68.0793C129.269 67.232 129.031 66.4983 128.556 65.8783C128.101 65.2583 127.44 64.8346 126.572 64.6073L123.72 63.7703C122.066 63.295 120.785 62.489 119.876 61.3523C118.987 60.195 118.543 58.8206 118.543 57.2293C118.543 55.9893 118.822 54.9043 119.38 53.9743C119.938 53.0443 120.733 52.321 121.767 51.8043C122.8 51.2876 124.019 51.0293 125.425 51.0293C127.491 51.0293 129.145 51.5873 130.385 52.7033C131.645 53.8193 132.286 55.3176 132.307 57.1983H128.959C128.959 56.2063 128.638 55.4313 127.998 54.8733C127.378 54.2946 126.499 54.0053 125.363 54.0053C124.267 54.0053 123.41 54.274 122.79 54.8113C122.17 55.328 121.86 56.0616 121.86 57.0123C121.86 57.8596 122.087 58.5933 122.542 59.2133C123.017 59.8333 123.689 60.2673 124.557 60.5153L127.44 61.3833C129.093 61.838 130.364 62.644 131.253 63.8013C132.141 64.9586 132.586 66.3433 132.586 67.9553C132.586 69.216 132.286 70.332 131.687 71.3033C131.087 72.254 130.25 72.998 129.176 73.5353C128.101 74.052 126.84 74.3103 125.394 74.3103Z" fill={v.textColor}/>
<path d="M156.485 74.0001L150.75 51.3701H154.191L157.818 66.4361C158.045 67.3248 158.242 68.2135 158.407 69.1021C158.593 69.9701 158.727 70.6521 158.81 71.1481C158.893 70.6521 159.006 69.9701 159.151 69.1021C159.316 68.2135 159.513 67.3145 159.74 66.4051L163.336 51.3701H166.684L160.918 74.0001H156.485Z" fill={v.textColor}/>
<path d="M168.914 74.0001V51.3701H182.213V54.3461H172.2V60.7631H181.128V63.7081H172.2V71.0241H182.213V74.0001H168.914Z" fill={v.textColor}/>
<path d="M184.512 74.0001V51.3701H188.728L195.331 70.1871C195.289 69.5878 195.238 68.8748 195.176 68.0481C195.114 67.2215 195.062 66.3638 195.021 65.4751C195 64.5865 194.99 63.7805 194.99 63.0571V51.3701H198.09V74.0001H193.874L187.302 55.1831C187.343 55.7204 187.384 56.3921 187.426 57.1981C187.488 58.0041 187.529 58.8411 187.55 59.7091C187.591 60.5771 187.612 61.3831 187.612 62.1271V74.0001H184.512Z" fill={v.textColor}/>
<path d="M206.625 73.9999V54.4389H200.58V51.3389H216.018V54.4389H209.973V73.9999H206.625Z" fill={v.textColor}/>
<path d="M225.301 74.3101C223.131 74.3101 221.457 73.7211 220.279 72.5431C219.101 71.3444 218.512 69.7221 218.512 67.6761V51.3701H221.86V67.6761C221.86 68.8128 222.139 69.7118 222.697 70.3731C223.275 71.0345 224.143 71.3651 225.301 71.3651C226.437 71.3651 227.295 71.0345 227.874 70.3731C228.452 69.7118 228.742 68.8128 228.742 67.6761V51.3701H232.09V67.6761C232.09 69.7221 231.501 71.3444 230.323 72.5431C229.145 73.7211 227.471 74.3101 225.301 74.3101Z" fill={v.textColor}/>
<path d="M234.604 74.0001V51.3701H241.703C243.129 51.3701 244.369 51.6491 245.423 52.2071C246.477 52.7445 247.293 53.5091 247.872 54.5011C248.471 55.4931 248.771 56.6608 248.771 58.0041C248.771 59.5128 248.378 60.8251 247.593 61.9411C246.828 63.0365 245.784 63.8115 244.462 64.2661L249.081 74.0001H245.268L241.145 64.7001H237.952V74.0001H234.604ZM237.952 61.7551H241.703C242.819 61.7551 243.707 61.4244 244.369 60.7631C245.03 60.0811 245.361 59.1821 245.361 58.0661C245.361 56.9088 245.03 55.9994 244.369 55.3381C243.707 54.6768 242.819 54.3461 241.703 54.3461H237.952V61.7551Z" fill={v.textColor}/>
<path d="M251.914 74.0001V51.3701H265.213V54.3461H255.2V60.7631H264.128V63.7081H255.2V71.0241H265.213V74.0001H251.914Z" fill={v.textColor}/>
<path d="M271.3 74.3102C270.474 74.3102 269.812 74.0726 269.316 73.5972C268.82 73.1012 268.572 72.4399 268.572 71.6132C268.572 70.7659 268.82 70.0942 269.316 69.5982C269.812 69.0816 270.474 68.8232 271.3 68.8232C272.148 68.8232 272.809 69.0816 273.284 69.5982C273.78 70.0942 274.028 70.7659 274.028 71.6132C274.028 72.4399 273.78 73.1012 273.284 73.5972C272.809 74.0726 272.148 74.3102 271.3 74.3102Z" fill={v.textColor}/>
<path d="M69.3789 74.0001V51.3701H72.7269V70.9311H82.6159V74.0001H69.3789Z" fill={v.textColor}/>

              </>
            ) : (
              <text
                dominantBaseline="middle"
                fill={v.textColor}
                style={{
                  fontFamily: "var(--font-jakarta), sans-serif",
                  fontWeight: 600,
                  fontSize: "22px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
                textAnchor="middle"
                x={showArrow ? "45%" : "50%"}
                y="64"
              >
                {label}
              </text>
            )}

            {showArrow && (
              <path
                d="M322.659 51V73.8206H319.32V56.8802L302.2 74H299.839L299.839 71.6388L317.138 54.3396H299.839V51H322.659Z"
                fill={v.textColor}
              />
            )}
          </g>

          <g clipPath={`url(#clip5_${id})`}>
            {isDefaultLabel ? (
              <>
                {showArrow && (
                  <>
                    <path
                      d="M322.666 88.835V97.3877H319.327V91.0387L302.207 97.4549H299.846L299.846 96.57L317.145 90.0866H299.846V88.835H322.666Z"
                      fill={v.textColor}
                    />
                    <path
                      d="M316.723 93.4248L305.412 97.4555H316.723V93.4248Z"
                      fill={v.textColor}
                    />
                  </>
                )}
              </>
            ) : (
              <text
                dominantBaseline="middle"
                fill={v.textColor}
                opacity={0.45}
                style={{
                  fontFamily: "var(--font-jakarta), sans-serif",
                  fontWeight: 600,
                  fontSize: "14px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
                textAnchor="middle"
                x={showArrow ? "45%" : "50%"}
                y="98"
              >
                {label}
              </text>
            )}
          </g>

<rect width="329" height="67" transform="translate(23 30)" fill="white" fillOpacity="0.01"/>
<rect width="329" height="26" transform="matrix(1 0 0 -1 23 123)" fill="white" fillOpacity="0.01"/>
</g>
<rect x="45.5" y="18.5" width="306" height="104" stroke={`url(#paint11_linear_${id})`} strokeOpacity="0.1"/>
<rect x="45.5" y="18.5" width="306" height="104" stroke={`url(#paint12_radial_${id})`} strokeOpacity="0.2"/>
<g filter={`url(#filter10_f_${id})`}>
<path d="M16 19V74C16 77.866 19.134 81 23 81H379V12H23C19.134 12 16 15.134 16 19Z" fill={`url(#paint13_radial_${id})`} fillOpacity="0.12"/>
</g>
<mask id={`mask0_${id}`} style={{ maskType: "alpha" as any }} maskUnits="userSpaceOnUse" x="10" y="7" width="375" height="120">
<path d="M21 7.5H373.5C379.299 7.5 384 12.201 384 18V76C384 81.799 379.299 86.5 373.5 86.5H373C372.172 86.5 371.5 87.1716 371.5 88V126.5H23.5C23.2239 126.5 23 126.276 23 126V88C23 87.1716 22.3284 86.5 21.5 86.5H21C15.201 86.5 10.5 81.799 10.5 76V18L10.5137 17.46C10.7947 11.9119 15.3821 7.5 21 7.5Z" fill="#0B0B09" stroke={`url(#paint14_linear_${id})`}/>
</mask>
<g mask={`url(#mask0_${id})`}>
<g filter={`url(#filter11_f_${id})`}>
<path d="M361.843 64.4275C369.819 89.1791 343.019 86.6195 281.436 91.6795C206.535 97.8336 190.658 96.2709 190.658 96.2709C182.682 71.5193 204.569 30.7639 250.623 22.5262C296.678 14.2885 353.867 39.6759 361.843 64.4275Z" fill={v.glowAccent} fillOpacity="0.4"/>
</g>
<g filter={`url(#filter12_f_${id})`}>
<path d="M360.974 115.992C368.951 91.2401 354.362 95.9841 322.499 96.24C283.745 96.5513 275.095 99.4068 275.095 99.4068C267.119 124.158 272.542 161.969 295.696 166.11C318.85 170.252 352.998 140.743 360.974 115.992Z" fill={v.glowAccent} fillOpacity="0.4"/>
</g>
<g filter={`url(#filter13_df_${id})`} style={{ mixBlendMode: "plus-lighter" as any }}>
<path d="M341.458 68.7148C344.088 76.8764 332.111 82.5139 286.38 88.73C230.761 96.2902 209.623 87.9653 209.623 87.9653C206.993 79.8037 227.085 50.2357 279.734 40.8185C332.383 31.4012 338.828 60.5531 341.458 68.7148Z" fill={v.glowAccent} fillOpacity="0.2" shapeRendering="crispEdges"/>
</g>
<g opacity="0.4">
<g filter={`url(#filter14_f_${id})`}>
<path d="M296.083 115.992C315.53 91.2401 279.961 95.9841 202.272 96.24C107.782 96.5513 86.6926 99.4068 86.6926 99.4068C67.2452 124.158 80.4661 161.969 136.921 166.11C193.376 170.252 276.635 140.743 296.083 115.992Z" fill={v.glowAccent} fillOpacity="0.4"/>
</g>
<g filter={`url(#filter15_f_${id})`} style={{ mixBlendMode: "plus-lighter" as any }}>
<path d="M238.511 92.8409C248.777 105.906 238.341 112.267 185.507 113C121.248 113.89 87.3271 96.9996 87.3271 96.9996C77.0616 83.9343 77.5089 42.3212 136.418 37.9996C195.327 33.678 228.246 79.7756 238.511 92.8409Z" fill={v.glowAccent} fillOpacity="0.2"/>
</g>
</g>
</g>
<g filter={`url(#filter16_df_${id})`}>
<rect x="26" y="98" width="342" height="3" fill={`url(#paint15_linear_${id})`} fillOpacity="0.5" shapeRendering="crispEdges"/>
</g>
<g filter={`url(#filter17_df_${id})`}>
<rect x="26" y="87" width="342" height="7" rx="1" fill={`url(#paint16_linear_${id})`} fillOpacity="0.4" shapeRendering="crispEdges"/>
</g>

        </g>

</g>
</g>
      </svg>
    </div>
  );
};

export default JoinTactileButton;

/** Drop-in source shown in the Component Lab "Component.tsx" tab. */
export const JOIN_TACTILE_BUTTON_COMPONENT_SOURCE = `"use client";

import * as React from "react";
import { useState, useId } from "react";

export type JoinTactileButtonVariant = "orange" | "dark";
export type JoinTactileButtonState = "interactive" | "standerd" | "hover";
export type JoinTactileButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface JoinTactileButtonProps {
  label?: string;
  variant?: JoinTactileButtonVariant;
  size?: JoinTactileButtonSize;
  stateMode?: JoinTactileButtonState;
  showArrow?: boolean;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export const JoinTactileButton: React.FC<JoinTactileButtonProps> = ({
  label = "LETS VENTURE.",
  variant = "orange",
  size = "md",
  stateMode = "interactive",
  showArrow = true,
  onClick,
  className = "",
  disabled = false,
}) => {
  return (
    <div className="relative inline-flex items-center justify-center">
      <button type="button" onClick={onClick} disabled={disabled} className={className}>
        {label}
      </button>
    </div>
  );
};

export default JoinTactileButton;
`;
