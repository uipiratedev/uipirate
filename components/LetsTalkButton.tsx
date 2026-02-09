"use client";

import { Button } from "@heroui/react";
import { ReactNode } from "react";
import Link from "next/link"; 

interface LetsTalkButtonProps {
  children?: ReactNode;
  href?: string;
  className?: string;
  fullWidth?: boolean;
  variant?: "light" | "dark" | "color";
  onClick?: () => void;
  isDisabled?: boolean;
  target?: string;
}

/**
 * Global Let's Talk Button Component
 * 
 * A reusable button with premium styling for CTAs.
 * Opens WhatsApp by default or can be customized with href prop.
 * 
 * @example
 * <LetsTalkButton />
 * <LetsTalkButton variant="dark">Let's Talk</LetsTalkButton>
 * <LetsTalkButton variant="color">Let's Talk</LetsTalkButton>
 * <LetsTalkButton fullWidth>Let's Talk</LetsTalkButton>
 */
export const LetsTalkButton = ({ 
  children = "Let's Talk", 
  href = "https://wa.link/i35lma",
  className = "",
  fullWidth = false,
  variant = "light",
  onClick,
  isDisabled = false,
  target
}: LetsTalkButtonProps) => {
  const isLight = variant === "light";
  const isDark = variant === "dark";
  const isColor = variant === "color";
  
  // Determine if the link is internal
  const isInternal = href && (href.startsWith('/') || href.startsWith('#'));
  // Default target: _self for internal, _blank for external
  const defaultTarget = isInternal ? "_self" : "_blank";
  const finalTarget = target || defaultTarget;

  // Determine background based on variant
  const getBackground = () => {
    if (isDisabled) return "#E5E7EB";
    if (isLight) return "linear-gradient(180deg, #F4F4F4 0%, #FEFEFE 100%)";
    if (isDark) return "#1A1A1A";
    if (isColor) return "#FF5B04";
    return "linear-gradient(180deg, #F4F4F4 0%, #FEFEFE 100%)";
  };

  // Determine text color
  const getTextColor = () => {
    if (isDisabled) return "text-gray-400";
    if (isLight) return "text-black";
    return "text-white"; // Both dark and color use white text
  };

  // Determine box shadow based on variant
  const getBoxShadow = () => {
    if (isDisabled) return "none";
    if (isLight) {
      return `
        0px 0px 0.29px 0.29px rgba(0, 0, 0, 0.07),
        0px 0px 0.29px 0.88px rgba(0, 0, 0, 0.05),
        0px 3.54px 3.83px -1.77px rgba(0, 0, 0, 0.25),
        0px 1.18px 4.71px 1.18px rgba(0, 0, 0, 0.12)
      `;
    }
    // Dark and Color variants use the same shadow structure
    return `
      0px 2.12px 2.97px 0px rgba(255, 255, 255, 0.65) inset,
      0px 2.39px 6.36px 0px rgba(0, 0, 0, 0.16),
      0px 0px 0px 1.73px #2F2F37 inset,
      0px 1.59px 4.97px 0px rgba(0, 0, 0, 0.12),
      0px 11.13px 39.77px 0px rgba(15, 15, 15, 0.03),
      0px 11.13px 25.46px 0px rgba(15, 15, 15, 0.02),
      0px 11.13px 15.91px 0px rgba(15, 15, 15, 0.02)
    `;
  };

  const buttonContent = (
    <Button
      className={`${getTextColor()} font-bold py-[27px] px-8`}
      color="primary"
      onPress={onClick}
      isDisabled={isDisabled}
      style={{
        width: fullWidth ? "100%" : "auto",
        borderRadius: "11.889px",
        border: "none",
        background: getBackground(),
        backgroundClip: "padding-box",
        position: "relative",
        boxShadow: getBoxShadow(),
        cursor: isDisabled ? "not-allowed" : "pointer"
      }}
      variant="bordered"
    >
      {isLight && !isDisabled && (
        <div 
          className="absolute inset-0 rounded-[9.908px] pointer-events-none"
          style={{
            background: "linear-gradient(180deg, #FFFFFF 0%, #ECECEC 100%)",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            padding: "3.98px",
          }}
        />
      )}
      <div className="flex flex-row items-center gap-3 relative z-10">
        <p className="text-base font-semibold max-md:text-medium">
          {children}
        </p>
      </div>
    </Button>
  );
  
  // If onClick is provided, render as button, otherwise as link
  if (onClick) {
    return (
      <div className={`${fullWidth ? 'w-full' : 'w-fit'} z-10 ${className}`}>
        {buttonContent}
      </div>
    );
  }

  // Use NextLink for internal links to avoid page reload
  if (isInternal && !isDisabled) {
    return (
      <div className={`${fullWidth ? 'w-full' : 'w-fit'} z-10 ${className}`}>
        <Link
          className="w-full"
          href={href}
          target={finalTarget}
        >
          {buttonContent}
        </Link>
      </div>
    );
  }

  return (
    <div className={`${fullWidth ? 'w-full' : 'w-fit'} z-10 ${className} ${isDisabled ? 'pointer-events-none opacity-50' : ''}`}>
      <a
        className="w-full"
        href={isDisabled ? "#" : href}
        rel="noreferrer"
        target={isDisabled ? "_self" : finalTarget}
      >
        {buttonContent}
      </a>
    </div>
  );
};

export default LetsTalkButton;
