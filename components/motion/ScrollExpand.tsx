"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

import { Reveal } from "./Reveal";

import { useIsMobile } from "@/hooks";

interface ScrollExpandProps {
  /** An <img> or <video> — the wrapper forces it to fill + object-cover. */
  media: React.ReactNode;
  title: string;
  subtitle?: string;
  /** Content revealed below once the media has expanded. */
  children?: React.ReactNode;
  className?: string;
}

/**
 * Scroll-to-expand hero: the media starts as a small centred card with a
 * split title over it, then grows to full-bleed as you scroll through a
 * pinned runway; the title halves slide apart and fade, and the content
 * below reveals once it's open. Scrolling up collapses it.
 *
 * Mobile / reduced-motion: a static framed image + title, content below.
 */
export function ScrollExpand({
  media,
  title,
  subtitle,
  children,
  className,
}: ScrollExpandProps) {
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const runwayRef = useRef<HTMLDivElement>(null);
  const [vp, setVp] = useState({ w: 1280, h: 800 });

  useEffect(() => {
    const measure = () =>
      setVp({ w: window.innerWidth, h: window.innerHeight });

    measure();
    window.addEventListener("resize", measure);

    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ["start start", "end end"] as never,
  });
  const p = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });

  const startW = Math.min(vp.w * 0.34, 440);
  const startH = Math.min(vp.h * 0.52, 480);

  const width = useTransform(p, [0, 0.85], [startW, vp.w]);
  const height = useTransform(p, [0, 0.85], [startH, vp.h]);
  const radius = useTransform(p, [0, 0.85], [26, 0]);
  const overlay = useTransform(p, [0, 0.85], [0.28, 0.12]);

  const titleOpacity = useTransform(p, [0.02, 0.32], [1, 0]);
  const xLeft = useTransform(p, [0, 0.4], ["0%", "-75%"]);
  const xRight = useTransform(p, [0, 0.4], ["0%", "75%"]);

  const words = title.trim().split(/\s+/);
  const mid = Math.ceil(words.length / 2);
  const left = words.slice(0, mid).join(" ");
  const right = words.slice(mid).join(" ");

  if (reduced || isMobile) {
    return (
      <section className={className}>
        <div className="section-container">
          <div className="relative overflow-hidden rounded-[20px]">
            <div className="aspect-[4/3] w-full [&>*]:h-full [&>*]:w-full [&>img]:object-cover [&>video]:object-cover">
              {media}
            </div>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/35 px-6 text-center">
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {title}
              </h2>
            </div>
          </div>
          {subtitle && (
            <p className="mt-3 text-center text-sm font-medium text-slate-500">
              {subtitle}
            </p>
          )}
          <Reveal className="mt-8" scrub={false} variant="fade">
            {children}
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section className={className}>
      <div ref={runwayRef} className="relative h-[160vh]">
        <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
          <motion.div
            className="relative overflow-hidden shadow-[0_40px_120px_-20px_rgba(0,0,0,0.35)]"
            style={{ width, height, borderRadius: radius }}
          >
            <div className="absolute inset-0 [&>*]:h-full [&>*]:w-full [&>img]:object-cover [&>video]:object-cover">
              {media}
            </div>
            <motion.div
              className="absolute inset-0 bg-black"
              style={{ opacity: overlay }}
            />
          </motion.div>

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
            <motion.span
              className="whitespace-nowrap px-2 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl"
              style={{ x: xLeft, opacity: titleOpacity }}
            >
              {left}
            </motion.span>
            <motion.span
              className="whitespace-nowrap px-2 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl"
              style={{ x: xRight, opacity: titleOpacity }}
            >
              {right}
            </motion.span>
          </div>
        </div>
      </div>

      <div className="section-container">
        {subtitle && (
          <Reveal
            as="p"
            className="mb-4 text-center text-sm font-medium uppercase tracking-wider text-brand-orange"
            scrub={false}
            variant="fade"
          >
            {subtitle}
          </Reveal>
        )}
        <Reveal scrub={false} variant="up">
          {children}
        </Reveal>
      </div>
    </section>
  );
}
