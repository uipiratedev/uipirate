import React, { useLayoutEffect, useRef, useCallback } from 'react';
import type { ReactNode } from 'react';
import Lenis from 'lenis';

export interface ScrollStackItemProps {
  itemClassName?: string;
  children: ReactNode;
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({ children, itemClassName = '' }) => (
  <div
    className={`scroll-stack-card relative w-full max-w-5xl mx-auto h-[400px] p-8 md:p-12 rounded-3xl md:rounded-[40px] shadow-2xl box-border origin-top will-change-transform ${itemClassName}`.trim()}
    style={{
      backfaceVisibility: 'hidden',
      transformStyle: 'preserve-3d'
    }}
  >
    {children}
  </div>
);

interface ScrollStackProps {
  className?: string;
  children: ReactNode;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string;
  scaleEndPosition?: string;
  baseScale?: number;
  scaleDuration?: number;
  rotationAmount?: number;
  blurAmount?: number;
  useWindowScroll?: boolean;
  onStackComplete?: () => void;
}

const ScrollStack: React.FC<ScrollStackProps> = ({
  children,
  className = '',
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = '20%',
  scaleEndPosition = '10%',
  baseScale = 0.85,
	  // Used for the sticky-mode (window scroll) transition timing.
	  // Keep this short so the scale/stack feels like it happens at the *stick* moment,
	  // not as a slow animation that plays while the user is still scrolling.
	  scaleDuration = 0.15,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = false,
  onStackComplete
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const stackCompletedRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const lastTransformsRef = useRef(new Map<number, any>());
  const isUpdatingRef = useRef(false);
  // Store original card positions (before sticky positioning affects getBoundingClientRect)
  const originalCardPositionsRef = useRef<number[]>([]);

  const calculateProgress = useCallback((scrollTop: number, start: number, end: number) => {
    if (scrollTop < start) return 0;
    if (scrollTop > end) return 1;
    return (scrollTop - start) / (end - start);
  }, []);

  const parsePercentage = useCallback((value: string | number, containerHeight: number) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return parseFloat(value as string);
  }, []);

  const getScrollData = useCallback(() => {
    if (useWindowScroll) {
      return {
        scrollTop: window.scrollY,
        containerHeight: window.innerHeight,
        scrollContainer: document.documentElement
      };
    } else {
      const scroller = scrollerRef.current;
      return {
        scrollTop: scroller ? scroller.scrollTop : 0,
        containerHeight: scroller ? scroller.clientHeight : 0,
        scrollContainer: scroller
      };
    }
  }, [useWindowScroll]);

  const getElementOffset = useCallback(
    (element: HTMLElement) => {
      if (useWindowScroll) {
        const rect = element.getBoundingClientRect();
        return rect.top + window.scrollY;
      } else {
        return element.offsetTop;
      }
    },
    [useWindowScroll]
  );

  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length || isUpdatingRef.current) return;

    isUpdatingRef.current = true;

	    const { scrollTop, containerHeight } = getScrollData();
    const stackPositionPx = parsePercentage(stackPosition, containerHeight);
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);

    const endElement = useWindowScroll
      ? (document.querySelector('.scroll-stack-end') as HTMLElement | null)
      : (scrollerRef.current?.querySelector('.scroll-stack-end') as HTMLElement | null);

    const endElementTop = endElement ? getElementOffset(endElement) : 0;

	    cardsRef.current.forEach((card, i) => {
      if (!card) return;

	      const cardTop = getElementOffset(card);
	      const cardOriginalTop = useWindowScroll
	        ? (originalCardPositionsRef.current[i] ?? cardTop)
	        : cardTop;
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
      const triggerEnd = cardTop - scaleEndPositionPx;
	      // For window-scroll mode, all cards share the same sticky `top`, so pinStart shouldn't
	      // be offset by itemStackDistance (the stacking offset is applied via translateY).
	      const pinStart = useWindowScroll
	        ? (cardOriginalTop - stackPositionPx)
	        : (cardTop - stackPositionPx - itemStackDistance * i);
      const pinEnd = endElementTop - containerHeight / 2;

      // Calculate scale based on scroll position
      let scale = 1;
      let rotation = 0;

	      if (useWindowScroll) {
	        // Window-scroll (CSS sticky) mode:
	        // - Stacking offset is applied via translateY (not per-card sticky top)
	        // - Scale/rotation should *only* change at the actual "stack" moment
	        //   (when the NEXT card becomes sticky), not continuously during scrolling.
	        const nextCardIndex = i + 1;
	        const targetScale = baseScale + i * itemScale;

	        if (nextCardIndex < cardsRef.current.length && originalCardPositionsRef.current.length > nextCardIndex) {
	          const nextCardOriginalTop = originalCardPositionsRef.current[nextCardIndex];
	          const nextPinStart = nextCardOriginalTop - stackPositionPx;
	          const nextIsPinned = scrollTop >= nextPinStart;

	          scale = nextIsPinned ? targetScale : 1;
	          rotation = rotationAmount ? (nextIsPinned ? i * rotationAmount : 0) : 0;
	        } else {
	          // Last card stays at full scale
	          scale = 1;
	          rotation = 0;
	        }
	      } else {
        // Original logic for non-sticky mode
        const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
        const targetScale = baseScale + i * itemScale;
        scale = 1 - scaleProgress * (1 - targetScale);
        rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0;
      }

      let blur = 0;
	      if (blurAmount) {
        let topCardIndex = 0;
        for (let j = 0; j < cardsRef.current.length; j++) {
	          const jCardTop = useWindowScroll
	            ? (originalCardPositionsRef.current[j] ?? getElementOffset(cardsRef.current[j]))
	            : getElementOffset(cardsRef.current[j]);
	          const jTriggerStart = useWindowScroll
	            ? (jCardTop - stackPositionPx)
	            : (jCardTop - stackPositionPx - itemStackDistance * j);
          if (scrollTop >= jTriggerStart) {
            topCardIndex = j;
          }
        }

        if (i < topCardIndex) {
          const depthInStack = topCardIndex - i;
          blur = Math.max(0, depthInStack * blurAmount);
        }
      }

	      let translateY = 0;
	      if (useWindowScroll) {
	        // Apply the stacking offset via translateY so all cards share the same sticky top.
	        // This prevents the "4th card lifts" issue on exit (cards release together).
	        const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;
	        const isPastEnd = scrollTop > pinEnd;

	        if (isPinned) {
	          translateY = itemStackDistance * i;
	        } else if (isPastEnd) {
	          // When past the end, all cards (including the last one) should scroll up together
	          // The offset is the stacking offset plus how far past pinEnd we've scrolled
	          translateY = itemStackDistance * i - (scrollTop - pinEnd);
	        } else {
	          translateY = 0;
	        }
	      } else {
        const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;

        if (isPinned) {
          translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * i;
        } else if (scrollTop > pinEnd) {
          translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i;
        }
      }

      const newTransform = {
        translateY: Math.round(translateY * 100) / 100,
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 100) / 100,
        blur: Math.round(blur * 100) / 100
      };

      const lastTransform = lastTransformsRef.current.get(i);
      const hasChanged =
        !lastTransform ||
        Math.abs(lastTransform.translateY - newTransform.translateY) > 0.1 ||
        Math.abs(lastTransform.scale - newTransform.scale) > 0.001 ||
        Math.abs(lastTransform.rotation - newTransform.rotation) > 0.1 ||
        Math.abs(lastTransform.blur - newTransform.blur) > 0.1;

	      if (hasChanged) {
	        const transform = useWindowScroll
	          ? `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale}) rotate(${newTransform.rotation}deg)`
	          : `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale}) rotate(${newTransform.rotation}deg)`;
        const filter = newTransform.blur > 0 ? `blur(${newTransform.blur}px)` : '';

        card.style.transform = transform;
        card.style.filter = filter;

        lastTransformsRef.current.set(i, newTransform);
      }

      if (i === cardsRef.current.length - 1) {
        const isInView = scrollTop >= pinStart && scrollTop <= pinEnd;
        if (isInView && !stackCompletedRef.current) {
          stackCompletedRef.current = true;
          onStackComplete?.();
        } else if (!isInView && stackCompletedRef.current) {
          stackCompletedRef.current = false;
        }
      }
    });

    isUpdatingRef.current = false;
  }, [
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    useWindowScroll,
    onStackComplete,
    calculateProgress,
    parsePercentage,
    getScrollData,
    getElementOffset
  ]);

  const handleScroll = useCallback(() => {
    if (!animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(() => {
        updateCardTransforms();
        animationFrameRef.current = null;
      });
    }
  }, [updateCardTransforms]);

  const setupLenis = useCallback(() => {
    if (useWindowScroll) {
      // Use the global Lenis instance instead of creating a new one
      const globalLenis = (window as any).__lenis;

      if (globalLenis) {
        globalLenis.on('scroll', handleScroll);
        lenisRef.current = globalLenis;
        return globalLenis;
      } else {
        // Fallback: use native scroll if global Lenis not available
        window.addEventListener('scroll', handleScroll, { passive: true });
        return null;
      }
    } else {
      const scroller = scrollerRef.current;
      if (!scroller) return;

      const lenis = new Lenis({
        wrapper: scroller,
        content: scroller.querySelector('.scroll-stack-inner') as HTMLElement,
        duration: 1.2,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 2,
        infinite: false,
        gestureOrientation: 'vertical',
        wheelMultiplier: 1,
        lerp: 0.1,
        syncTouch: true,
        syncTouchLerp: 0.075
      });

      lenis.on('scroll', handleScroll);

      const raf = (time: number) => {
        lenis.raf(time);
        animationFrameRef.current = requestAnimationFrame(raf);
      };
      animationFrameRef.current = requestAnimationFrame(raf);

      lenisRef.current = lenis;
      return lenis;
    }
  }, [handleScroll, useWindowScroll]);

  useLayoutEffect(() => {
    if (!useWindowScroll && !scrollerRef.current) return;

    const cards = Array.from(
      useWindowScroll
        ? document.querySelectorAll('.scroll-stack-card')
        : (scrollerRef.current?.querySelectorAll('.scroll-stack-card') ?? [])
    ) as HTMLElement[];
    cardsRef.current = cards;
    const transformsCache = lastTransformsRef.current;

    // Calculate stack position for sticky positioning
    const containerHeight = useWindowScroll ? window.innerHeight : (scrollerRef.current?.clientHeight || 0);
    const stackPositionPx = parsePercentage(stackPosition, containerHeight);

	    cards.forEach((card, i) => {
      if (i < cards.length - 1) {
        card.style.marginBottom = `${itemDistance}px`;
      }

      if (useWindowScroll) {
        // For window scroll mode, use sticky positioning
	        // All cards share the SAME top; stacking offset is applied via translateY.
        card.style.position = 'sticky';
	        card.style.top = `${stackPositionPx}px`;
        // Higher index = higher z-index so later cards appear on top
        card.style.zIndex = `${i + 1}`;
	        // Smooth the discrete stack/scale changes without tying them to scroll distance
	        card.style.transition = `transform ${scaleDuration}s cubic-bezier(0.22, 1, 0.36, 1), filter ${scaleDuration}s ease`;
      }

      card.style.willChange = 'transform, filter';
      card.style.transformOrigin = 'top center';
      card.style.backfaceVisibility = 'hidden';
      card.style.transform = 'translateZ(0)';
      card.style.perspective = '1000px';
    });

	    // Store original card positions AFTER layout-affecting styles (like marginBottom)
	    // but before scrolling can activate sticky behavior.
	    // This prevents scale/stack triggers from firing early.
	    if (useWindowScroll) {
	      originalCardPositionsRef.current = cards.map((card) => {
	        const rect = card.getBoundingClientRect();
	        return rect.top + window.scrollY;
	      });
	    }

    setupLenis();

    updateCardTransforms();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (lenisRef.current) {
        // Only destroy if it's not the global instance
        const globalLenis = (window as any).__lenis;
        if (lenisRef.current !== globalLenis) {
          lenisRef.current.destroy();
        } else {
          // Just remove the scroll listener from global instance
          lenisRef.current.off('scroll', handleScroll);
        }
      } else if (useWindowScroll) {
        // Clean up native scroll listener if used
        window.removeEventListener('scroll', handleScroll);
      }
      stackCompletedRef.current = false;
      cardsRef.current = [];
      transformsCache.clear();
      isUpdatingRef.current = false;
    };
  }, [
    itemDistance,
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    scaleDuration,
    rotationAmount,
    blurAmount,
    useWindowScroll,
    onStackComplete,
    setupLenis,
    updateCardTransforms
  ]);

  if (useWindowScroll) {
	    // Spacer gives the stack some extra scroll runway so the cards don't start releasing
	    // while they're still prominently in view as you leave the section.
    const childCount = React.Children.count(children);
	    const stackOffsetPx = Math.max(0, childCount - 1) * itemStackDistance;
	    const bufferPx = Math.max(50, itemDistance, itemStackDistance * 2);
	    // Add ~half a viewport to push the sticky-release out of view on most screens.
	    const spacerHeight = `calc(${stackOffsetPx + bufferPx}px + 50vh)`;

    return (
      <div className={`relative w-full ${className}`.trim()}>
        <div className="scroll-stack-inner px-4 md:px-8">
          {children}
	          <div className="scroll-stack-end w-full" style={{ height: spacerHeight }} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full h-screen overflow-y-auto overflow-x-hidden ${className}`.trim()}
      ref={scrollerRef}
      style={{
        overscrollBehavior: 'contain',
        WebkitOverflowScrolling: 'touch',
        scrollBehavior: 'smooth',
        WebkitTransform: 'translateZ(0)',
        transform: 'translateZ(0)',
        willChange: 'scroll-position'
      }}
    >
      <div className="scroll-stack-inner pt-[20vh] px-4 md:px-8 pb-[100vh] min-h-screen">
        {children}
        {/* Spacer so the last pin can release cleanly */}
        <div className="scroll-stack-end w-full h-px" />
      </div>
    </div>
  );
};

export default ScrollStack;

