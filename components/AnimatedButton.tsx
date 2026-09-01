import React from "react";
import Link from "next/link";

export type AnimatedButtonSize = "xs" | "sm" | "md" | "lg" | "xl";
export type AnimatedButtonStateMode = "interactive" | "standerd" | "hover";

export interface AnimatedButtonProps {
  /** Primary text to display */
  primaryText: string;
  /** Text to show on hover (default: "See More") */
  hoverText?: string;
  /** Optional custom text color */
  textColor?: string;
  /** Optional href for Link wrapper */
  href?: string;
  /** State preview mode: "interactive" | "standerd" | "hover" */
  stateMode?: AnimatedButtonStateMode;
  /** Optional onClick handler */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Full width button */
  fullWidth?: boolean;
  /** Button variant */
  variant?: "primary" | "secondary";
  /** Size scale multiplier */
  size?: AnimatedButtonSize;
}

/**
 * Reusable animated button with slide-up hover effect
 * Used across service cards, team cards, and other CTAs
 */
export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  primaryText,
  hoverText = "See More",
  textColor,
  href,
  stateMode = "interactive",
  onClick,
  className = "",
  fullWidth = false,
  variant = "primary",
  size = "md",
}) => {
  const sizeScales: Record<AnimatedButtonSize, number> = {
    xs: 0.7,
    sm: 0.85,
    md: 1,
    lg: 1.18,
    xl: 1.35,
  };
  const scaleFactor = sizeScales[size] || 1;
  const isVisualHover = stateMode === "hover";

  const baseClasses = `px-8 max-md:px-6 py-4 max-md:py-3 rounded-[20px] max-md:rounded-[12px] group transition-all duration-300 ${
    fullWidth ? "w-full" : "w-auto max-w-full inline-flex"
  }`;

  const variantClasses =
    variant === "primary"
      ? "bg-black text-white hover:bg-gray-800"
      : "bg-white text-black border-2 border-black hover:bg-gray-100";

  const textStyle = textColor ? { color: textColor } : undefined;

  const buttonContent = (
    <div className="relative overflow-hidden h-[1.5em] grid grid-cols-1 grid-rows-1 items-center justify-center font-medium text-lg max-md:text-sm px-2">
      <span
        style={textStyle}
        className={`col-start-1 row-start-1 block transition-transform duration-300 ease-in-out transform ${
          isVisualHover ? "-translate-y-full opacity-0" : "group-hover:-translate-y-full group-hover:opacity-0"
        } flex flex-row items-center justify-center gap-x-3 whitespace-nowrap`}
      >
        {primaryText}
      </span>
      <span
        style={textStyle}
        className={`col-start-1 row-start-1 block transition-transform duration-300 ease-in-out transform ${
          isVisualHover ? "translate-y-0 font-bold opacity-100" : "translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 font-bold"
        } flex flex-row items-center justify-center gap-x-3 whitespace-nowrap`}
      >
        {hoverText}
      </span>
    </div>
  );

  const buttonElement = (
    <div
      className={`inline-flex items-center justify-center ${fullWidth ? "w-full" : "w-auto"}`}
      style={scaleFactor !== 1 ? ({ zoom: scaleFactor } as React.CSSProperties) : undefined}
    >
      <button
        className={`${baseClasses} ${variantClasses} ${className}`}
        type="button"
        onClick={onClick}
      >
        {buttonContent}
      </button>
    </div>
  );

  if (href) {
    return <Link href={href} className={fullWidth ? "w-full" : "w-auto"}>{buttonElement}</Link>;
  }

  return buttonElement;
};

export default AnimatedButton;
