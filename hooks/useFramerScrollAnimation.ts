import type { Variants } from "framer-motion";

/**
 * Options for configuring scroll-triggered animations
 */
interface ScrollAnimationOptions {
  startY?: number;
  startScale?: number;
  endY?: number;
  endScale?: number;
  duration?: number;
  delay?: number;
  once?: boolean;
  amount?: number;
}

/**
 * Return type for useFramerScrollAnimation hook
 * Using inline object types that are compatible with motion components
 */
interface FramerScrollAnimationProps {
  initial: { y: number; scale: number; opacity: number };
  whileInView: { y: number; scale: number; opacity: number };
  viewport: { once: boolean; amount: number };
  transition: { duration: number; delay: number; ease: string };
}

/**
 * Custom hook to generate Framer Motion props for scroll-triggered animations
 * Replaces the GSAP-based useScrollAnimation hook
 *
 * @param isMobile - Whether the device is mobile (affects scale animation)
 * @param options - Animation configuration options
 * @returns Object containing Framer Motion animation props (initial, whileInView, viewport, transition)
 *
 * @example
 * const animationProps = useFramerScrollAnimation(isMobile);
 * <motion.div {...animationProps}>Content</motion.div>
 */
export function useFramerScrollAnimation(
  isMobile: boolean,
  options: ScrollAnimationOptions = {}
): FramerScrollAnimationProps {
  const {
    startY = 100,
    startScale = 0.8,
    endY = 0,
    endScale = 1,
    duration = 1,
    delay = 0,
    once = false,
    amount = 0.3,
  } = options;

  return {
    initial: {
      y: startY,
      scale: isMobile ? endScale : startScale,
      opacity: 0,
    },
    whileInView: {
      y: endY,
      scale: endScale,
      opacity: 1,
    },
    viewport: { once, amount },
    transition: {
      duration,
      delay,
      ease: "easeOut",
    },
  };
}

/**
 * Create animation variants for scroll-triggered card animations
 * For use with motion components that need variants pattern
 *
 * @param isMobile - Whether the device is mobile
 * @param options - Animation configuration options
 * @returns Framer Motion variants object
 *
 * @example
 * const variants = createCardScrollVariants(isMobile);
 * <motion.div variants={variants} initial="hidden" whileInView="show">
 */
export function createCardScrollVariants(
  isMobile: boolean,
  options: ScrollAnimationOptions = {}
): Variants {
  const {
    startY = 100,
    startScale = 0.8,
    endY = 0,
    endScale = 1,
    duration = 1,
    delay = 0,
  } = options;

  return {
    hidden: {
      y: startY,
      scale: isMobile ? endScale : startScale,
      opacity: 0,
    },
    show: {
      y: endY,
      scale: endScale,
      opacity: 1,
      transition: {
        duration,
        delay,
        ease: "easeOut",
      },
    },
  };
}

export default useFramerScrollAnimation;

