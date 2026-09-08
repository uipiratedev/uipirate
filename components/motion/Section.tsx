"use client";

import { forwardRef } from "react";
import clsx from "clsx";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Drives the background hue continuum + content inversion. */
  bg?: "light" | "dark";
  /** `content-visibility: auto` so offscreen sections cost nothing. */
  contain?: boolean;
}

/**
 * Landing-section shell. Standardizes the scroll anchor offset, offscreen
 * containment, and exposes its intended background via `data-bg` for the
 * page-level hue continuum to read.
 */
export const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  { bg = "light", contain = true, className, children, ...rest },
  ref,
) {
  return (
    <section
      ref={ref}
      className={clsx("scroll-mt-24", contain && "cv-auto", className)}
      data-bg={bg}
      {...rest}
    >
      {children}
    </section>
  );
});
