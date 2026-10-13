"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

import { useIsMobile } from "@/hooks";

interface TiltProps {
  /** Max tilt in degrees. */
  max?: number;
  /** Lift toward the viewer on hover (px of translateZ). */
  lift?: number;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Pointer-driven 3D tilt. The wrapper sets its own perspective. No-op on
 * touch / reduced motion.
 */
export function Tilt({
  max = 10,
  lift = 20,
  className,
  children,
}: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();

  const px = useSpring(useMotionValue(0.5), { stiffness: 200, damping: 20 });
  const py = useSpring(useMotionValue(0.5), { stiffness: 200, damping: 20 });
  const hovered = useMotionValue(0);
  const hoverSpring = useSpring(hovered, { stiffness: 200, damping: 20 });

  const rotateY = useTransform(px, [0, 1], [-max, max]);
  const rotateX = useTransform(py, [0, 1], [max, -max]);
  const z = useTransform(hoverSpring, [0, 1], [0, lift]);

  if (reduced || isMobile) {
    return <div className={className}>{children}</div>;
  }

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;

    if (!el) return;
    const r = el.getBoundingClientRect();

    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };

  const reset = () => {
    px.set(0.5);
    py.set(0.5);
    hovered.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        perspective: 900,
        rotateX,
        rotateY,
        z,
        transformStyle: "preserve-3d",
      }}
      onMouseEnter={() => hovered.set(1)}
      onMouseLeave={reset}
      onMouseMove={onMove}
    >
      {children}
    </motion.div>
  );
}
