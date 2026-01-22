import React from "react";
import Link from "next/link";

interface AnimatedButtonProps {
  /** Primary text to display */
  primaryText: string;
  /** Text to show on hover (default: "See More") */
  hoverText?: string;
  /** Optional href for Link wrapper */
  href?: string;
  /** Optional onClick handler */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Full width button */
  fullWidth?: boolean;
  /** Button variant */
  variant?: "primary" | "secondary";
}

/**
 * Reusable animated button with slide-up hover effect
 * Used across service cards, team cards, and other CTAs
 */
export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  primaryText,
  hoverText = "See More",
  href,
  onClick,
  className = "",
  fullWidth = true,
  variant = "primary",
}) => {
  const baseClasses = `mt-6 px-[40px] py-[16px] rounded-[20px] group transition-all duration-300 ${
    fullWidth ? "w-full" : ""
  }`;

  const variantClasses =
    variant === "primary"
      ? "bg-black text-white hover:bg-gray-800"
      : "bg-white text-black border-2 border-black hover:bg-gray-100";

  const buttonContent = (
    <div className="flex flex-col items-center justify-center max-h-[24px] overflow-hidden">
      <span className="text-lg transition-transform duration-300 ease-in-out transform flex flex-row items-center gap-x-3 group-hover:translate-y-[50px] translate-y-3">
        {primaryText}
      </span>
      <span className="text-lg transition-transform duration-300 ease-in-out transform flex flex-row items-center gap-3 translate-y-[50px] group-hover:-translate-y-3">
        {hoverText}
      </span>
    </div>
  );

  const buttonElement = (
    <button
      className={`${baseClasses} ${variantClasses} ${className}`}
      type="button"
      onClick={onClick}
    >
      {buttonContent}
    </button>
  );

  if (href) {
    return <Link href={href}>{buttonElement}</Link>;
  }

  return buttonElement;
};
