/**
 * Content Health Components
 *
 * Modular, accordion-based content health dashboard for the post editor.
 * Provides real-time SEO, readability, engagement, and publish-readiness analysis.
 */

export { ContentHealthPanel } from "./ContentHealthPanel";
export { default } from "./ContentHealthPanel";

export {
  // Generic building blocks
  MetricContent,
  OverallHealthHeader,
  // Named content components
  SEOHealthContent,
  ReadabilityContent,
  EngagementContent,
  StructureContent,
  ConversionContent,
  CTAContent,
  DistributionContent,
  // Badge helpers
  getMetricBadge,
  getSEOHealthBadge,
  getReadabilityBadge,
  getEngagementBadge,
  getStructureBadge,
  getConversionBadge,
  getCTABadge,
  getDistributionBadge,
  getScoreColor,
} from "./ContentHealthSubComponents";
