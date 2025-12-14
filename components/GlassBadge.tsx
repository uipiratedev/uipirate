import React from "react";

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

  // For gradient variant, use the exact badge structure the design is based on:
  // outer wrapper + inner glass pill, 3 blurred dots clipped by the edges, and text on top.
  if (variant === "gradient") {
    return (
      <div className={`relative z-10 inline-block ${className}`}>
        <div
          className="
		          relative flex items-center justify-center
		          overflow-hidden
		          bg-white/30 backdrop-blur-2xl
		          border border-white/80
		          rounded-[10px] px-[15.156px] py-[10.104px]
		          gap-[10.104px]
		          shadow-md
		        "
        >
          {/* Dot 1: Teal (Left) - 28px, moved slightly inside */}
          <div className="absolute -left-[8px] -top-[8px] w-[28px] h-[28px] bg-teal-400 rounded-full blur-[8px] opacity-100" />

          {/* Dot 2: Blue (Center) - 39px, bottom, tiny slice visible */}
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-[32px] w-[39px] h-[39px] bg-blue-500 rounded-full blur-[10px] opacity-100" />

          {/* Dot 3: Pink (Right) - 21px, moved slightly inside */}
          <div className="absolute -right-[8px] -top-[6px] w-[21px] h-[21px] bg-pink-400 rounded-full blur-[8px] opacity-100" />

          {/* Text on top */}
          <span
            className={`relative z-10 font-mono font-bold tracking-[0.15em] text-black ${
              uppercase ? "uppercase" : ""
            }`}
          >
            {children}
          </span>
        </div>
      </div>
    );
  }

  // For other variants, simple badge
  return (
    <span
      className={`
        relative inline-flex items-center justify-center
        rounded-2xl font-semibold
        ${sizeClasses[size]}
        ${uppercase ? "uppercase" : ""}
        ${variant !== "cyan" ? "glass-texture isolate" : ""}
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
