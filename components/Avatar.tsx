import React from "react";
import { getAllGradients } from "@/utils/gradientService";

/**
 * Generates a consistent gradient background based on a string (name or id)
 * Each unique string will always get the same gradient combination
 */
const generateGradient = (str: string): string => {
  // Get all gradients from the gradient service
  const gradients = getAllGradients();

  // Generate a hash from the string
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Use absolute value and modulo to get a consistent index
  const index = Math.abs(hash) % gradients.length;
  return gradients[index].value;
};

export interface AvatarProps {
  /**
   * The name of the person - used to display the first letter as fallback
   * and to generate a consistent gradient color
   */
  name: string;

  /**
   * Optional avatar image URL
   * If provided, displays the image; otherwise shows the first letter with gradient
   */
  avatar?: string;

  /**
   * Size of the avatar in pixels
   * @default 52
   */
  size?: number;

  /**
   * Additional CSS classes to apply to the avatar container
   */
  className?: string;

  /**
   * Alt text for the image (defaults to name)
   */
  alt?: string;
}

/**
 * Avatar Component
 *
 * A beautiful and reusable avatar component that displays either:
 * - An avatar image if provided
 * - The first letter of the name with a unique gradient background
 *
 * Each name gets a consistent gradient color, ensuring visual variety
 * across multiple avatars while maintaining consistency for the same user.
 *
 * @example
 * ```tsx
 * // With image
 * <Avatar name="John Doe" avatar="https://example.com/avatar.jpg" />
 *
 * // Without image (shows gradient with initial)
 * <Avatar name="Jane Smith" />
 *
 * // Custom size
 * <Avatar name="Bob Wilson" size={64} />
 * ```
 */
export const Avatar: React.FC<AvatarProps> = ({
  name,
  avatar,
  size = 52,
  className = "",
  alt,
}) => {
  const gradient = generateGradient(name);
  const initial = name.charAt(0).toUpperCase();
  const altText = alt || name;

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={altText}
        className={`rounded-full object-cover ${className}`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          minWidth: `${size}px`,
          minHeight: `${size}px`,
        }}
      />
    );
  }

  return (
    <div
      className={`rounded-full flex items-center justify-center ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
        background: gradient,
        border: "1px solid",
        borderColor: "#777777",
      }}
    >
      <p
        className=" font-semibold text-center select-none "
        style={{
          fontSize: `${size * 0.4}px`, // 40% of avatar size
        }}
      >
        {initial}
      </p>
    </div>
  );
};

export default Avatar;
