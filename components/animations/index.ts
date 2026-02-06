/**
 * Animation Components
 * Reusable Framer Motion components for consistent animations across the app
 */

export { FadeIn } from "./FadeIn";
export { SlideUp } from "./SlideUp";
export { ScaleIn } from "./ScaleIn";
export { StaggerContainer, StaggerItem, staggerItemVariants } from "./StaggerContainer";

// Export all animation variants
export {
  fadeInVariants,
  scaleInVariants,
  slideUpVariants,
  slideInLeftVariants,
  slideInRightVariants,
  staggerContainerVariants,
  staggerItemVariants as staggerItemVariantsBase,
  cardScrollVariants,
} from "./variants";

