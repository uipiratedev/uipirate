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
  // Size classes - responsive: smaller on mobile, normal on desktop
  const sizeClasses = {
    sm: "px-2.5 py-1 text-[10px] sm:px-3 sm:py-1.5 sm:text-xs",
    md: "px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm",
    lg: "px-4 py-2 text-sm sm:px-5 sm:py-2.5 sm:text-base",
  };

  // For the gradient variant, we want it to be slightly more premium (larger) on desktop 
  // but still responsive for mobile.
  const gradientSizeClasses = {
    sm: "px-2.5 py-1 text-[10px] sm:px-3 sm:py-1.5 sm:text-xs",
    md: "px-3 py-1.5 text-xs sm:px-5 sm:py-2.5 sm:text-[15px]",
    lg: "px-4 py-2 text-sm sm:px-7 sm:py-3.5 sm:text-[18px]",
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
          className={`!flex !items-center !justify-center ${gradientSizeClasses[size]}`}
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
          <div className="absolute -left-[20px] -top-[15px] sm:-left-[30px] sm:-top-[20px] w-[18px] h-[18px] sm:w-[28px] sm:h-[28px] bg-teal-400 rounded-full blur-[8px] sm:blur-[10px] opacity-100 animate-float-dot-1" />

          {/* Dot 2: Blue (Center) - 39px, bottom, tiny slice visible */}
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-[35px] sm:-bottom-[50px] w-[25px] h-[25px] sm:w-[39px] sm:h-[39px] bg-blue-500 rounded-full blur-[12px] sm:blur-[18px] opacity-100 animate-float-dot-2" />

          {/* Dot 3: Pink (Right) - 21px, moved slightly inside */}
          <div className="absolute -right-[18px] -top-[12px] sm:-right-[26px] sm:-top-[16px] w-[14px] h-[14px] sm:w-[21px] sm:h-[21px] bg-pink-400 rounded-full blur-[6px] sm:blur-[8px] opacity-100 animate-float-dot-3" />

          {/* Text on top */}
          <span
            className={`relative z-10 font-jetbrains-mono font-medium text-black ${
              uppercase ? "uppercase" : ""
            }`}
            style={{
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
