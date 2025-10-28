import React from "react";

/**
 * Generates a consistent gradient background based on a string (name or id)
 * Each unique string will always get the same gradient combination
 */
const generateGradient = (str: string): string => {
  // Predefined beautiful gradient combinations
  const gradients = [
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", // Purple
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", // Pink-Red
    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", // Blue-Cyan
    "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", // Green-Teal
    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)", // Pink-Yellow
    "linear-gradient(135deg, #30cfd0 0%, #330867 100%)", // Cyan-Purple
    "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)", // Mint-Pink
    "linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)", // Orange-Pink
    "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)", // Peach
    "linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)", // Red-Blue
    "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)", // Lavender-Blue
    "linear-gradient(135deg, #f77062 0%, #fe5196 100%)", // Coral-Pink
    "linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)", // Orange-Purple
    "linear-gradient(135deg, #e45a84 0%, #f5af19 100%)", // Pink-Gold
    "linear-gradient(135deg, #13547a 0%, #80d0c7 100%)", // Navy-Teal
    "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)", // Purple-Blue
    "linear-gradient(135deg, #37ecba 0%, #72afd3 100%)", // Turquoise
    "linear-gradient(135deg, #ebbba7 0%, #cfc7f8 100%)", // Peach-Lavender
    "linear-gradient(135deg, #fff1eb 0%, #ace0f9 100%)", // Cream-Sky
    "linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%)", // Yellow-Orange
    "linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)", // Light Purple
    "linear-gradient(135deg, #fd79a8 0%, #e84393 100%)", // Pink
    "linear-gradient(135deg, #fdcb6e 0%, #e17055 100%)", // Gold-Coral
    "linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)", // Sky Blue
    "linear-gradient(135deg, #55efc4 0%, #00b894 100%)", // Mint Green
    "linear-gradient(135deg, #fab1a0 0%, #ff7675 100%)", // Peach-Red
    "linear-gradient(135deg, #a29bfe 0%, #fd79a8 100%)", // Purple-Pink
    "linear-gradient(135deg, #ffeaa7 0%, #55efc4 100%)", // Yellow-Mint
    "linear-gradient(135deg, #81ecec 0%, #74b9ff 100%)", // Cyan-Blue
    "linear-gradient(135deg, #ff7675 0%, #fdcb6e 100%)", // Red-Yellow
  ];

  // Generate a hash from the string
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Use absolute value and modulo to get a consistent index
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
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
      }}
    >
      <p
        className="text-white font-semibold text-center select-none"
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

