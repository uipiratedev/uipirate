import React from "react";

import GlassBadge from "@/components/GlassBadge";

interface SectionHeaderProps {
  /**
   * Eyebrow chip text. Omit for sections that intentionally have no chip.
   */
  chip?: React.ReactNode;

  /**
   * The heading content (rendered inside an <h2 className="heading-center">).
   * Omit for chip-only headers.
   */
  children?: React.ReactNode;

  /**
   * Extra classes for the wrapper — use for scroll-reveal hooks (e.g. "autoShow").
   */
  className?: string;

  /**
   * Extra classes for the <h2> (e.g. "text-white" on dark sections).
   */
  headingClassName?: string;

  /**
   * Optional muted line under the heading (e.g. a one-sentence qualifier).
   * Sits inside the header block so the mb-12 / max-md:mb-8 gap still applies below it.
   */
  subcopy?: React.ReactNode;
}

/**
 * SectionHeader — the single source of truth for landing-section headers.
 *
 * Spacing is fixed so every section matches:
 *   chip → heading   : mb-4  (16px)
 *   heading → content : mb-12 / max-md:mb-8  (48 / 32px)
 *
 * Do not add vertical margins to the chip, the <h2>, or the element that
 * follows this component — the gap below the header lives here.
 */
const SectionHeader: React.FC<SectionHeaderProps> = ({
  chip,
  children,
  className = "",
  headingClassName = "",
  subcopy,
}) => {
  return (
    <div className={`text-center mb-12 max-md:mb-8 ${className}`}>
      {chip && (
        <div className={`flex justify-center${children ? " mb-4" : ""}`}>
          <GlassBadge variant="gradient">{chip}</GlassBadge>
        </div>
      )}
      {children && (
        <h2 className={`heading-center ${headingClassName}`}>{children}</h2>
      )}
      {subcopy && (
        <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-relaxed text-gray-500">
          {subcopy}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
