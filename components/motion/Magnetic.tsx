"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

import { useIsMobile } from "@/hooks";

interface MagneticProps {
  /** How far the element follows the cursor (px, at the edge of range). */
  strength?: number;
  /** Pointer distance (px) over which the pull applies. */
  radius?: number;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Eases the wrapped element toward the pointer while it hovers within
 * `radius`, springing back on leave. No-op on touch / reduced motion.
 */
export function Magnetic({
  strength = 14,
  radius = 120,
  className,
  children,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();

  const x = useSpring(useMotionValue(0), {
    stiffness: 220,
    damping: 18,
    mass: 0.3,
  });
  const y = useSpring(useMotionValue(0), {
    stiffness: 220,
    damping: 18,
    mass: 0.3,
  });

  if (reduced || isMobile) {
    return <div className={className}>{children}</div>;
  }

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;

    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);
    const pull = Math.max(0, 1 - dist / radius);

    x.set((dx / (radius || 1)) * strength * pull * 2);
    y.set((dy / (radius || 1)) * strength * pull * 2);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y }}
      onMouseLeave={reset}
      onMouseMove={onMove}
    >
      {children}
    </motion.div>
  );
}
