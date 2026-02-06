# GSAP to Framer Motion Migration Guide

## Executive Summary

This document provides a comprehensive, step-by-step migration strategy to remove GSAP and migrate all animations to Framer Motion. This migration will:

- **Reduce bundle size** by ~50KB gzipped (GSAP removal)
- **Simplify animation codebase** with declarative React patterns
- **Improve maintainability** with consistent animation approach
- **Maintain visual fidelity** of all existing animations

**Estimated Timeline**: 5-7 days  
**Risk Level**: Medium (requires thorough testing)  
**Priority**: High (optimization and technical debt reduction)

---

## Table of Contents

1. [Current State Analysis](#current-state-analysis)
2. [Migration Strategy](#migration-strategy)
3. [Pattern Mapping](#pattern-mapping)
4. [Component-by-Component Migration Plan](#component-by-component-migration-plan)
5. [Code Examples](#code-examples)
6. [Testing Strategy](#testing-strategy)
7. [Rollback Plan](#rollback-plan)

---

## Current State Analysis

### GSAP Usage Inventory

**Total Files Using GSAP**: 15 files

#### 1. Custom Hook (Affects Multiple Components)
- `hooks/useScrollAnimation.ts` - Reusable scroll animation hook

#### 2. Landing Page Components (High Priority)
- `screens/landing/behance/LandingBehance.tsx` - Complex ScrollTrigger with progress tracking
- `screens/landing/appScreen/index.tsx` - Timeline animation with scrub
- `screens/landing/marquee/index.tsx` - Stagger animations for logos
- `screens/landing/works/workCard.tsx` - Image rotation and slide animations
- `screens/landing/about/aboutCard.tsx` - Card rotation with hover effects
- `screens/landing/businessHelp/servicesSection.tsx` - Card scale animations
- `screens/landing/businessHelp/pricingCard.tsx` - Card entrance animations
- `screens/landing/boreYouCommit/index.tsx` - Card scale and slide
- `screens/landing/faqs/accordion.tsx` - Blur and fade animations
- `screens/landing/bentoGrid/AnimatedAnalyticsChart.tsx` - SVG path animations

#### 3. FAQ Page Components
- `screens/faqs/faqList/faqsAccordion.tsx` - Accordion animations

### GSAP Features Used

| Feature | Usage Count | Complexity | Framer Motion Equivalent |
|---------|-------------|------------|-------------------------|
| `ScrollTrigger` | 14 files | High | `useScroll` + `useTransform` + `useInView` |
| `gsap.fromTo()` | 12 files | Medium | `initial` + `animate` props |
| `gsap.timeline()` | 2 files | Medium | Sequential variants |
| `stagger` | 1 file | Low | `staggerChildren` |
| `scrub` | 10 files | High | `useScroll` with `useTransform` |
| `toggleActions` | 8 files | Low | `whileInView` |

---

## Migration Strategy

### Phase 1: Preparation (Day 1)
1. ✅ Complete codebase analysis
2. Create migration guide (this document)
3. Set up testing checklist
4. Create feature branch: `feat/migrate-gsap-to-framer-motion`

### Phase 2: Core Hook Migration (Day 2)
1. Migrate `hooks/useScrollAnimation.ts` to Framer Motion
2. Create new `hooks/useFramerScrollAnimation.ts`
3. Test with one component before rolling out

### Phase 3: High-Priority Components (Days 3-4)
1. Landing page hero and above-the-fold components
2. Most complex animations (LandingBehance, LandingAppScreen)
3. Card animations (servicesSection, pricingCard, boreYouCommit)

### Phase 4: Remaining Components (Day 5)
1. FAQ accordions
2. Work cards and about cards
3. Marquee and other landing sections

### Phase 5: Cleanup & Testing (Days 6-7)
1. Remove GSAP dependencies from package.json
2. Update next.config.js (remove GSAP from optimizePackageImports)
3. Comprehensive cross-browser testing
4. Performance benchmarking
5. Visual regression testing

---

## Pattern Mapping

### Pattern 1: ScrollTrigger → useInView + useScroll

**GSAP Pattern**:
```typescript
gsap.fromTo(element, 
  { y: 100, opacity: 0 },
  {
    y: 0,
    opacity: 1,
    scrollTrigger: {
      trigger: element,
      start: "top 80%",
      end: "bottom 20%",
      toggleActions: "play none none reverse"
    }
  }
);
```

**Framer Motion Equivalent**:
```typescript
<motion.div
  initial={{ y: 100, opacity: 0 }}
  whileInView={{ y: 0, opacity: 1 }}
  viewport={{ once: false, amount: 0.3 }}
  transition={{ duration: 0.8, ease: "easeOut" }}
>
  {content}
</motion.div>
```

### Pattern 2: ScrollTrigger with Scrub → useScroll + useTransform

**GSAP Pattern**:
```typescript
gsap.fromTo(element,
  { x: "-35%", rotation: -12 },
  {
    x: 0,
    rotation: 0,
    scrollTrigger: {
      trigger: element,
      start: "top 110%",
      end: "bottom 0%",
      scrub: 1
    }
  }
);
```

**Framer Motion Equivalent**:
```typescript
import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";

const Component = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const x = useTransform(scrollYProgress, [0, 1], ["-35%", "0%"]);
  const rotation = useTransform(scrollYProgress, [0, 1], [-12, 0]);

  return (
    <motion.div ref={ref} style={{ x, rotate: rotation }}>
      {content}
    </motion.div>
  );
};
```

### Pattern 3: Timeline → Sequential Variants

**GSAP Pattern**:
```typescript
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".appTrigger",
    start: "top 50%",
    end: "bottom 50%",
    scrub: 1
  }
});

tl.to("#left", { rotate: 0, x: 0, duration: 1, ease: "power2.out" })
  .to("#right", { rotate: 0, x: 0, duration: 1, ease: "power2.out" }, "<")
  .to("#center", { paddingTop: 0, duration: 1 }, "<");
```

**Framer Motion Equivalent**:
```typescript
import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";

const Component = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"]
  });

  const leftRotate = useTransform(scrollYProgress, [0, 1], [-15, 0]);
  const leftX = useTransform(scrollYProgress, [0, 1], [-100, 0]);
  const rightRotate = useTransform(scrollYProgress, [0, 1], [15, 0]);
  const rightX = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const centerPadding = useTransform(scrollYProgress, [0, 1], [100, 0]);

  return (
    <div ref={ref} className="appTrigger">
      <motion.div id="left" style={{ rotate: leftRotate, x: leftX }} />
      <motion.div id="right" style={{ rotate: rightRotate, x: rightX }} />
      <motion.div id="center" style={{ paddingTop: centerPadding }} />
    </div>
  );
};
```

### Pattern 4: Stagger → staggerChildren

**GSAP Pattern**:
```typescript
gsap.fromTo(logoElements,
  { opacity: 0, y: 40, scale: 0.9 },
  {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.7,
    ease: "power3.out",
    stagger: 0.12,
    scrollTrigger: {
      trigger: container,
      start: "top 80%",
      toggleActions: "play reverse play reverse"
    }
  }
);
```

**Framer Motion Equivalent**:
```typescript
const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 40, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: "easeOut" }
  }
};

<motion.div
  variants={container}
  initial="hidden"
  whileInView="show"
  viewport={{ once: false, amount: 0.3 }}
>
  {logos.map((logo, i) => (
    <motion.div key={i} variants={item} className="logo-item">
      {logo}
    </motion.div>
  ))}
</motion.div>
```

### Pattern 5: Blur + Fade → Framer Motion Filters

**GSAP Pattern**:
```typescript
gsap.fromTo(card,
  {
    y: 50,
    opacity: 0,
    filter: "blur(5px)"
  },
  {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: card,
      start: "top 90%",
      toggleActions: "restart none none reverse"
    }
  }
);
```

**Framer Motion Equivalent**:
```typescript
<motion.div
  initial={{ y: 50, opacity: 0, filter: "blur(5px)" }}
  whileInView={{ y: 0, opacity: 1, filter: "blur(0px)" }}
  viewport={{ once: false, amount: 0.3 }}
  transition={{ duration: 1, ease: "easeOut" }}
>
  {content}
</motion.div>
```

---

## Component-by-Component Migration Plan

### Priority 1: Custom Hook (Day 2)

#### File: `hooks/useScrollAnimation.ts`

**Current Implementation**: GSAP-based scroll animation hook
**Migration Complexity**: Medium
**Estimated Time**: 2-3 hours

**New Implementation**: Create `hooks/useFramerScrollAnimation.ts`

```typescript
import { Variants } from "framer-motion";

export interface FramerScrollAnimationOptions {
  startY?: number;
  startScale?: number;
  endY?: number;
  endScale?: number;
  duration?: number;
  ease?: string;
  stagger?: number;
}

export function useFramerScrollAnimation(
  options: FramerScrollAnimationOptions = {}
): { container: Variants; item: Variants } {
  const {
    startY = 100,
    startScale = 0.8,
    endY = 0,
    endScale = 1,
    duration = 1,
    ease = "easeOut",
    stagger = 0.1,
  } = options;

  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: stagger,
      },
    },
  };

  const item: Variants = {
    hidden: {
      y: startY,
      scale: startScale,
      opacity: 0,
    },
    show: {
      y: endY,
      scale: endScale,
      opacity: 1,
      transition: {
        duration,
        ease,
      },
    },
  };

  return { container, item };
}
```

**Migration Steps**:
1. Create new file `hooks/useFramerScrollAnimation.ts`
2. Implement the hook with Framer Motion variants
3. Test with one component (e.g., `servicesSection.tsx`)
4. Once validated, update all components using `useScrollAnimation`
5. Keep old hook until all migrations complete
6. Delete `hooks/useScrollAnimation.ts` after full migration

---

### Priority 2: Landing Page - App Screen (Day 3)

#### File: `screens/landing/appScreen/index.tsx`

**Current Implementation**: GSAP Timeline with ScrollTrigger scrub
**Migration Complexity**: High
**Estimated Time**: 2-3 hours

**Before (GSAP)**:
```typescript
useEffect(() => {
  gsap.registerPlugin(ScrollTrigger);

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".appTrigger",
      start: "top 50%",
      end: "bottom 50%",
      scrub: 1,
    },
  });

  tl.to("#left", { rotate: 0, x: 0, duration: 1, ease: "power2.out" })
    .to("#right", { rotate: 0, x: 0, duration: 1, ease: "power2.out" }, "<")
    .to("#center", { paddingTop: 0, duration: 1 }, "<");
}, []);
```

**After (Framer Motion)**:
```typescript
import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";

const LandingAppScreen = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  // Transform values based on scroll progress
  const leftRotate = useTransform(scrollYProgress, [0, 1], [-15, 0]);
  const leftX = useTransform(scrollYProgress, [0, 1], [-100, 0]);
  const rightRotate = useTransform(scrollYProgress, [0, 1], [15, 0]);
  const rightX = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const centerPadding = useTransform(scrollYProgress, [0, 1], [100, 0]);

  return (
    <div ref={containerRef} className="appTrigger">
      <motion.div
        id="left"
        style={{ rotate: leftRotate, x: leftX }}
        transition={{ ease: "easeOut" }}
      >
        {/* Left content */}
      </motion.div>

      <motion.div
        id="right"
        style={{ rotate: rightRotate, x: rightX }}
        transition={{ ease: "easeOut" }}
      >
        {/* Right content */}
      </motion.div>

      <motion.div
        id="center"
        style={{ paddingTop: centerPadding }}
        transition={{ ease: "easeOut" }}
      >
        {/* Center content */}
      </motion.div>
    </div>
  );
};
```

**Testing Checklist**:
- [ ] Verify smooth scroll-linked animation
- [ ] Test on mobile and desktop
- [ ] Verify rotation angles match original
- [ ] Check performance (should be better than GSAP)

---

### Priority 3: Landing Page - Behance Section (Day 3)

#### File: `screens/landing/behance/LandingBehance.tsx`

**Current Implementation**: Complex ScrollTrigger with progress tracking and IDs
**Migration Complexity**: Very High
**Estimated Time**: 3-4 hours

**Before (GSAP)**:
```typescript
const animateRow = (startIndex, endIndex, xMove, yMove, rotateDeg, triggerProgress) => {
  gsap.to(images.slice(startIndex, endIndex), {
    x: (i) => xMove[i % 2],
    y: (i) => yMove[i % 2],
    rotate: isMobile ? 0 : (i) => rotateDeg[i % 2],
    scrollTrigger: {
      trigger: images[startIndex],
      start: "top 99%",
      end: "bottom 0%",
      scrub: 1.5,
      onUpdate: (self) => {
        if (self.progress >= triggerProgress) {
          ScrollTrigger.getById(`row-${startIndex + 2}`)?.enable();
        }
      },
      id: `row-${startIndex}`,
    },
  });
};
```

**After (Framer Motion)**:
```typescript
import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";

const ImageRow = ({ images, xMove, yMove, rotateDeg, isMobile }) => {
  const rowRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ["start end", "end start"]
  });

  return (
    <div ref={rowRef}>
      {images.map((image, i) => {
        const x = useTransform(scrollYProgress, [0, 1], [0, xMove[i % 2]]);
        const y = useTransform(scrollYProgress, [0, 1], [0, yMove[i % 2]]);
        const rotate = useTransform(
          scrollYProgress,
          [0, 1],
          [0, isMobile ? 0 : rotateDeg[i % 2]]
        );

        return (
          <motion.img
            key={i}
            src={image}
            style={{ x, y, rotate }}
            transition={{ ease: "linear" }}
          />
        );
      })}
    </div>
  );
};

const LandingBehance = () => {
  const isMobile = window.innerWidth <= 768;

  return (
    <div>
      <ImageRow
        images={row1Images}
        xMove={["-20%", "20%"]}
        yMove={["-10%", "10%"]}
        rotateDeg={[-5, 5]}
        isMobile={isMobile}
      />
      <ImageRow
        images={row2Images}
        xMove={["15%", "-15%"]}
        yMove={["5%", "-5%"]}
        rotateDeg={[3, -3]}
        isMobile={isMobile}
      />
    </div>
  );
};
```

**Note**: The progressive enabling of rows can be achieved with `whileInView` on each row component.

**Testing Checklist**:
- [ ] Verify all rows animate correctly
- [ ] Test scroll performance with multiple images
- [ ] Verify mobile behavior (no rotation)
- [ ] Check image positioning matches original

---

### Priority 4: Card Animations (Day 4)

#### Files:
- `screens/landing/businessHelp/servicesSection.tsx`
- `screens/landing/businessHelp/pricingCard.tsx`
- `screens/landing/boreYouCommit/index.tsx`

**Current Implementation**: Uses `useScrollAnimation` hook
**Migration Complexity**: Low (after hook migration)
**Estimated Time**: 1-2 hours total

**Before (GSAP via hook)**:
```typescript
const cardsRef = useRef<HTMLDivElement[]>([]);
const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

useLayoutEffect(() => {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

  cardsRef.current.forEach((card) => {
    if (card) {
      gsap.fromTo(
        card,
        { y: 100, transform: isMobile ? "scale(1)" : "scale(0.85)" },
        {
          y: 0,
          transform: "scale(1)",
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 110%",
            end: "bottom center",
            toggleActions: "play none none reverse",
            scrub: 1.5,
          },
        }
      );
    }
  });
}, [isMobile]);
```

**After (Framer Motion)**:
```typescript
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks";

const cardVariants = {
  hidden: (isMobile: boolean) => ({
    y: 100,
    scale: isMobile ? 1 : 0.85,
    opacity: 0,
  }),
  show: {
    y: 0,
    scale: 1,
    opacity: 1,
    transition: {
      duration: 1,
      ease: "easeOut",
    },
  },
};

const ServicesSection = () => {
  const isMobile = useIsMobile();

  return (
    <div className="grid grid-cols-3 gap-6">
      {services.map((service, index) => (
        <motion.div
          key={index}
          custom={isMobile}
          variants={cardVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.3, margin: "0px 0px -10% 0px" }}
        >
          {/* Card content */}
        </motion.div>
      ))}
    </div>
  );
};
```

**Testing Checklist**:
- [ ] Verify card entrance animations
- [ ] Test mobile vs desktop scale differences
- [ ] Verify viewport trigger points
- [ ] Check animation smoothness

---

### Priority 5: Work Cards & About Cards (Day 4)

#### Files:
- `screens/landing/works/workCard.tsx`
- `screens/landing/about/aboutCard.tsx`

**Current Implementation**: Image rotation and slide with ScrollTrigger scrub
**Migration Complexity**: Medium
**Estimated Time**: 2-3 hours

**Before (GSAP)**:
```typescript
useEffect(() => {
  cardRefs.current.forEach((card, index) => {
    const isEven = index % 2 === 0;
    const direction = isEven ? "-35%" : "35%";

    gsap.fromTo(
      card.querySelector("img"),
      { x: direction, rotation: isEven ? -12 : 12, opacity: 1 },
      {
        x: 0,
        rotation: 0,
        opacity: 1,
        scrollTrigger: {
          trigger: card,
          start: "top 110%",
          end: "bottom 0%",
          scrub: 1,
        },
        ease: "power2.out",
      }
    );
  });
}, []);
```

**After (Framer Motion)**:
```typescript
import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";

const WorkCard = ({ work, index }) => {
  const cardRef = useRef(null);
  const isEven = index % 2 === 0;

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    [isEven ? "-35%" : "35%", "0%"]
  );

  const rotation = useTransform(
    scrollYProgress,
    [0, 1],
    [isEven ? -12 : 12, 0]
  );

  return (
    <div ref={cardRef}>
      <motion.img
        src={work.image}
        style={{ x, rotate: rotation }}
        transition={{ ease: "easeOut" }}
      />
      <div id="contentDiv">
        {/* Content */}
      </div>
    </div>
  );
};
```

**Testing Checklist**:
- [ ] Verify alternating rotation directions
- [ ] Test scroll-linked movement
- [ ] Verify smooth transitions
- [ ] Check mobile responsiveness

---

### Priority 6: Marquee & Logo Animations (Day 5)

#### File: `screens/landing/marquee/index.tsx`

**Current Implementation**: Stagger animations for logos
**Migration Complexity**: Low
**Estimated Time**: 1 hour

**Before (GSAP)**:
```typescript
const logoElements = logosRef.current.querySelectorAll(".logo-item");

gsap.fromTo(
  logoElements,
  { opacity: 0, y: 40, scale: 0.9 },
  {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.7,
    ease: "power3.out",
    stagger: 0.12,
    scrollTrigger: {
      trigger: logosRef.current,
      start: "top 80%",
      toggleActions: "play reverse play reverse",
    },
  }
);
```

**After (Framer Motion)**:
```typescript
const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const logoItem = {
  hidden: { opacity: 0, y: 40, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

<motion.div
  ref={logosRef}
  variants={container}
  initial="hidden"
  whileInView="show"
  viewport={{ once: false, amount: 0.3 }}
>
  {logos.map((logo, i) => (
    <motion.div key={i} variants={logoItem} className="logo-item">
      <img src={logo} alt={`Logo ${i + 1}`} />
    </motion.div>
  ))}
</motion.div>
```

---

### Priority 7: FAQ Accordions (Day 5)

#### Files:
- `screens/landing/faqs/accordion.tsx`
- `screens/faqs/faqList/faqsAccordion.tsx`

**Current Implementation**: Blur + fade animations
**Migration Complexity**: Low
**Estimated Time**: 1-2 hours

**Before (GSAP)**:
```typescript
gsap.fromTo(
  card,
  {
    y: 50,
    paddingTop: "5%",
    paddingBottom: "5%",
    opacity: isMobile ? 4 : 0,
    filter: isMobile ? "blur(0px)" : "blur(5px)",
  },
  {
    y: 0,
    paddingTop: "0%",
    paddingBottom: "0%",
    opacity: 1,
    filter: "blur(0px)",
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: card,
      start: isMobile ? "top 50%" : "top 90%",
      toggleActions: "restart none none reverse",
    },
  }
);
```

**After (Framer Motion)**:
```typescript
const accordionVariants = {
  hidden: (isMobile: boolean) => ({
    y: 50,
    paddingTop: "5%",
    paddingBottom: "5%",
    opacity: isMobile ? 1 : 0,
    filter: isMobile ? "blur(0px)" : "blur(5px)",
  }),
  show: {
    y: 0,
    paddingTop: "0%",
    paddingBottom: "0%",
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 1,
      ease: "easeOut",
    },
  },
};

<motion.div
  custom={isMobile}
  variants={accordionVariants}
  initial="hidden"
  whileInView="show"
  viewport={{
    once: false,
    amount: 0.3,
    margin: isMobile ? "0px 0px -50% 0px" : "0px 0px -10% 0px"
  }}
>
  {/* Accordion content */}
</motion.div>
```

---

### Priority 8: Analytics Chart SVG Animation (Day 5)

#### File: `screens/landing/bentoGrid/AnimatedAnalyticsChart.tsx`

**Current Implementation**: GSAP Timeline for SVG path animations
**Migration Complexity**: Medium
**Estimated Time**: 2 hours

**Before (GSAP)**:
```typescript
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: chartRef.current,
    start: "top 85%",
    end: "bottom 60%",
    toggleActions: "play none none reverse",
  },
});

tl.to(glowPathRef.current, {
  strokeDashoffset: 0,
  duration: 1.8,
  ease: "power1.inOut",
});

tl.to(linePathRef.current, {
  strokeDashoffset: 0,
  duration: 1.8,
  ease: "power1.inOut",
}, "-=1.7");
```

**After (Framer Motion)**:
```typescript
import { motion } from "framer-motion";

const pathVariants = {
  hidden: {
    strokeDashoffset: 1000,
    opacity: 0,
  },
  show: {
    strokeDashoffset: 0,
    opacity: 1,
    transition: {
      duration: 1.8,
      ease: "easeInOut",
    },
  },
};

<svg ref={chartRef}>
  <motion.path
    ref={glowPathRef}
    variants={pathVariants}
    initial="hidden"
    whileInView="show"
    viewport={{ once: false, amount: 0.3 }}
    strokeDasharray={1000}
  />
  <motion.path
    ref={linePathRef}
    variants={pathVariants}
    initial="hidden"
    whileInView="show"
    viewport={{ once: false, amount: 0.3 }}
    strokeDasharray={1000}
    transition={{ delay: 0.1 }}
  />
</svg>
```

---

## Testing Strategy

### Pre-Migration Testing
1. **Record baseline metrics**:
   - Bundle size (current with GSAP)
   - Lighthouse performance score
   - Animation frame rates
   - Time to Interactive (TTI)

2. **Create visual regression baseline**:
   - Screenshot all animated sections
   - Record videos of scroll animations
   - Document animation timings

### During Migration Testing

For each component migrated:

1. **Visual Testing**:
   - [ ] Compare side-by-side with original
   - [ ] Verify animation timing matches
   - [ ] Check easing curves feel similar
   - [ ] Test on multiple screen sizes

2. **Functional Testing**:
   - [ ] Verify scroll triggers activate correctly
   - [ ] Test viewport detection
   - [ ] Verify mobile vs desktop behavior
   - [ ] Test with reduced motion preferences

3. **Performance Testing**:
   - [ ] Check frame rate (should be 60fps)
   - [ ] Monitor CPU usage
   - [ ] Test on low-end devices
   - [ ] Verify no layout shifts

### Post-Migration Testing

1. **Cross-Browser Testing**:
   - [ ] Chrome (latest)
   - [ ] Firefox (latest)
   - [ ] Safari (latest)
   - [ ] Edge (latest)
   - [ ] Mobile Safari (iOS)
   - [ ] Chrome Mobile (Android)

2. **Performance Benchmarking**:
   - [ ] Compare bundle size (should be ~50KB smaller)
   - [ ] Run Lighthouse audit
   - [ ] Measure Time to Interactive
   - [ ] Check Core Web Vitals

3. **Accessibility Testing**:
   - [ ] Verify reduced motion support
   - [ ] Test keyboard navigation
   - [ ] Check screen reader compatibility

4. **User Acceptance Testing**:
   - [ ] Internal team review
   - [ ] Stakeholder approval
   - [ ] A/B test if possible

---

## Rollback Plan

### If Issues Arise

1. **Immediate Rollback** (< 5 minutes):
   ```bash
   git checkout main
   git branch -D feat/migrate-gsap-to-framer-motion
   ```

2. **Partial Rollback** (specific component):
   - Keep feature branch
   - Revert specific component commits
   - Re-import GSAP for that component only

3. **Gradual Rollout**:
   - Use feature flags to toggle between GSAP and Framer Motion
   - Roll out to 10% of users first
   - Monitor error rates and performance
   - Gradually increase to 100%

### Rollback Triggers

Rollback if:
- Performance degrades by >10%
- Animation bugs affect >5% of users
- Critical visual regressions
- Accessibility issues discovered
- Bundle size increases (unexpected)

---

## Post-Migration Cleanup

### Day 6-7: Final Steps

1. **Remove GSAP Dependencies**:
   ```bash
   yarn remove gsap
   ```

2. **Update `package.json`**:
   - Remove `"gsap": "^3.12.5"`

3. **Update `next.config.js`**:
   ```javascript
   experimental: {
     optimizePackageImports: ["@heroui/react", "framer-motion"], // Remove "gsap"
   }
   ```

4. **Delete Old Files**:
   - `hooks/useScrollAnimation.ts`

5. **Update Documentation**:
   - Update `DEVELOPER_GUIDE.md` (remove GSAP references)
   - Update `CONTRIBUTING.md` (add Framer Motion best practices)
   - Update `README.md` (remove GSAP from tech stack)

6. **Final Testing**:
   - Full regression test
   - Performance audit
   - Bundle size verification

---

## Success Criteria

Migration is successful when:

- ✅ All 15 files migrated to Framer Motion
- ✅ GSAP completely removed from dependencies
- ✅ Bundle size reduced by ~50KB gzipped
- ✅ All animations visually match original
- ✅ Performance metrics maintained or improved
- ✅ No accessibility regressions
- ✅ All tests passing
- ✅ Documentation updated
- ✅ Team trained on new patterns

---

## Timeline Summary

| Day | Tasks | Estimated Hours |
|-----|-------|----------------|
| 1 | Preparation, documentation | 4h |
| 2 | Migrate custom hook, test with one component | 6h |
| 3 | Migrate LandingAppScreen, LandingBehance | 8h |
| 4 | Migrate card animations, work cards, about cards | 8h |
| 5 | Migrate marquee, FAQs, analytics chart | 6h |
| 6-7 | Testing, cleanup, documentation | 12h |
| **Total** | **Full migration** | **44 hours (~5-7 days)** |

---

## Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Animation timing differences | High | Medium | Careful tuning, side-by-side comparison |
| Performance regression | Low | High | Benchmark before/after, optimize if needed |
| Browser compatibility issues | Medium | Medium | Extensive cross-browser testing |
| Scroll performance on mobile | Medium | High | Test on real devices, optimize transforms |
| Team unfamiliarity with Framer Motion | Medium | Low | Training session, documentation |

---

## Additional Resources

### Framer Motion Documentation
- [Scroll Animations](https://www.framer.com/motion/scroll-animations/)
- [useScroll Hook](https://www.framer.com/motion/use-scroll/)
- [useTransform Hook](https://www.framer.com/motion/use-transform/)
- [Variants](https://www.framer.com/motion/animation/#variants)

### Migration References
- [GSAP to Framer Motion Cheat Sheet](https://motion.dev/guides/gsap-to-framer-motion)
- [Scroll-Linked Animations Best Practices](https://web.dev/scroll-driven-animations/)

---

## Conclusion

This migration will modernize the animation codebase, reduce bundle size, and improve maintainability. The step-by-step approach ensures minimal risk while achieving significant benefits.

**Next Steps**:
1. Review this guide with the team
2. Get approval to proceed
3. Create feature branch
4. Begin Day 1 preparation tasks


