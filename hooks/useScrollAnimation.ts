import { useLayoutEffect, RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollAnimationOptions {
  startY?: number;
  startScale?: number;
  endY?: number;
  endScale?: number;
  duration?: number;
  ease?: string;
  start?: string;
  end?: string;
  scrub?: number | boolean;
  delay?: number;
}

/**
 * Custom hook to handle GSAP scroll trigger animations for card elements
 * @param cardsRef - Array of card element refs to animate
 * @param isMobile - Whether the device is mobile
 * @param options - Animation configuration options
 */
export function useScrollAnimation(
  cardsRef: RefObject<HTMLDivElement[]>,
  isMobile: boolean,
  options: ScrollAnimationOptions = {},
) {
  const {
    startY = 100,
    startScale = 0.8,
    endY = 0,
    endScale = 1,
    duration = 1,
    ease = "power2.out",
    start = "top 110%",
    end = "bottom center",
    scrub = 1.5,
    delay = 100,
  } = options;

  useLayoutEffect(() => {
    // Clear any existing ScrollTriggers
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      cardsRef.current?.forEach((card) => {
        if (card) {
          gsap.fromTo(
            card,
            {
              y: startY,
              transform: isMobile
                ? `scale(${endScale})`
                : `scale(${startScale})`,
            },
            {
              y: endY,
              transform: `scale(${endScale})`,
              duration,
              ease,
              scrollTrigger: isMobile
                ? undefined
                : {
                    trigger: card,
                    start,
                    end,
                    toggleActions: "play none none reverse",
                    scrub,
                  },
            },
          );
        }
      });

      // Force ScrollTrigger to recalculate positions
      ScrollTrigger.refresh();
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [
    cardsRef,
    isMobile,
    startY,
    startScale,
    endY,
    endScale,
    duration,
    ease,
    start,
    end,
    scrub,
    delay,
  ]);
}
