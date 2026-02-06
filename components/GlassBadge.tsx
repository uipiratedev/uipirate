import React from "react";

import GlassSurface from "./GlassSurface";

interface GlassBadgeProps {
  /**
   * The text content to display in the badge
   */
  children: React.ReactNode;

  /**
   * Optional custom className for additional styling
   */
  className?: string;

  /**
   * Variant of the glass badge
   * @default "gradient"
   */
  variant?: "gradient" | "solid" | "cyan";

  /**
   * Size of the badge
   * @default "md"
   */
  size?: "sm" | "md" | "lg";

  /**
   * Whether to uppercase the text
   * @default true
   */
  uppercase?: boolean;
}

/**
 * GlassBadge - A reusable glass morphism badge component
 *
 * Features:
 * - Premium glass effect with gradient background
 * - Multiple variants (gradient, solid, cyan)
 * - Responsive sizing
 * - Customizable styling
 *
 * @example
 * ```tsx
 * <GlassBadge>Design & Development</GlassBadge>
 * <GlassBadge variant="cyan" size="sm">Services</GlassBadge>
 * <GlassBadge variant="solid" uppercase={false}>Custom Text</GlassBadge>
 * ```
 */
const GlassBadge: React.FC<GlassBadgeProps> = ({
  children,
  className = "",
  variant = "gradient",
  size = "md",
  uppercase = true,
}) => {
  // Size classes
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
  };

  // Variant styles
  const variantStyles = {
    gradient: {
      // Clean white glass base – dots are rendered as separate elements
      backgroundColor: "rgba(255, 255, 255, 0.98)",
      backdropFilter: "blur(18px)",
      WebkitBackdropFilter: "blur(18px)",
      borderRadius: "999px",
      border: "1px solid rgba(255, 255, 255, 0.95)",
      boxShadow: "0 14px 40px rgba(0, 0, 0, 0.12)",
    },
    solid: {
      background: "rgba(255, 255, 255, 0.15)",
      backdropFilter: "blur(16px) saturate(150%) brightness(105%)",
      WebkitBackdropFilter: "blur(16px) saturate(150%) brightness(105%)",
      border: "1px solid rgba(255, 255, 255, 0.25)",
    },
    cyan: {
      background: "#8EF1F1",
      border: "2px solid #22d3ee",
    },
  };

  // For gradient variant, use GlassSurface with decorative dots
  if (variant === "gradient") {
    return (
      <div className={`relative z-10 inline-block ${className}`}>
        <GlassSurface
          backgroundOpacity={0.1}
          blueOffset={20}
          blur={11}
          borderRadius={10}
          borderWidth={0.01}
          brightness={50}
          className="p-2 px-4"
          displace={0.5}
          distortionScale={-180}
          forceLightMode={true}
          greenOffset={10}
          height="auto"
          opacity={0.93}
          redOffset={0}
          saturation={1}
          width="auto"
        >
          {/* Dot 1: Teal (Left) - 28px, moved slightly inside */}
          <div className="absolute -left-[30px] -top-[20px] w-[28px] h-[28px] bg-teal-400 rounded-full blur-[10px] opacity-100 animate-float-dot-1" />

          {/* Dot 2: Blue (Center) - 39px, bottom, tiny slice visible */}
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-[50px] w-[39px] h-[39px] bg-blue-500 rounded-full blur-[18px] opacity-100 animate-float-dot-2" />

          {/* Dot 3: Pink (Right) - 21px, moved slightly inside */}
          <div className="absolute -right-[26px] -top-[16px] w-[21px] h-[21px] bg-pink-400 rounded-full blur-[8px] opacity-100 animate-float-dot-3" />

          {/* Text on top */}
          <span
            className={`relative z-10 font-jetbrains-mono font-medium text-black ${
              uppercase ? "uppercase" : ""
            }`}
            style={{
              fontSize: "16px",
              lineHeight: "20px",
              fontVariantNumeric: "slashed-zero",
            }}
          >
            {children}
          </span>
        </GlassSurface>
      </div>
    );
  }

  // For solid variant, use GlassSurface
  if (variant === "solid") {
    return (
      <GlassSurface
        backgroundOpacity={0.15}
        blur={12}
        borderRadius={16}
        brightness={50}
        className={`
          !inline-flex !items-center !justify-center
          font-semibold
          ${sizeClasses[size]}
          ${uppercase ? "uppercase" : ""}
          transition-all duration-300 ease-in-out
          ${className}
        `}
        height="auto"
        opacity={0.93}
        saturation={1.5}
        width="auto"
      >
        {children}
      </GlassSurface>
    );
  }

  // For cyan variant, simple badge without glass effect
  return (
    <span
      className={`
        relative inline-flex items-center justify-center
        rounded-2xl font-semibold
        ${sizeClasses[size]}
        ${uppercase ? "uppercase" : ""}
        transition-all duration-300 ease-in-out
        ${className}
      `}
      style={variantStyles[variant]}
    >
      {children}
    </span>
  );
};

export default GlassBadge;
