"use client";

import { useState, useRef, useCallback } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";

const ProPirateFooterSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-15%" });

  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Smoother spring animations with adjusted physics
  const torchX = useMotionValue(0);
  const torchY = useMotionValue(0);
  const lightConeX = useMotionValue(0);
  const lightConeY = useMotionValue(0);

  // Increased stiffness and damping for ultra-smooth following
  const smoothTorchX = useSpring(torchX, {
    stiffness: 200,
    damping: 25,
    mass: 0.5,
  });
  const smoothTorchY = useSpring(torchY, {
    stiffness: 200,
    damping: 25,
    mass: 0.5,
  });
  const smoothLightConeX = useSpring(lightConeX, {
    stiffness: 250,
    damping: 30,
    mass: 0.5,
  });
  const smoothLightConeY = useSpring(lightConeY, {
    stiffness: 250,
    damping: 30,
    mass: 0.5,
  });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!textRef.current) return;

      const rect = textRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update mouse position for mask
      setMousePosition({ x, y });

      // Update torch position with offset
      torchX.set(x);
      torchY.set(y - 70);

      // Update light cone position with slight offset
      lightConeX.set(x);
      lightConeY.set(y - 10);
    },
    [torchX, torchY, lightConeX, lightConeY],
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
  }, []);

  return (
    <div ref={sectionRef} className="relative w-full  px-0 overflow-visible">
      {/* Main text container - Full width */}
      <div
        ref={textRef}
        className="relative w-full mx-auto h-[150px] md:h-[250px] lg:h-[250px] cursor-none pb-32 overflow-visible"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        {/* Dark text - simple and static */}
        <motion.div
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          className="absolute inset-0 flex items-center justify-center filter  contrast-125"
          initial={{ opacity: 0, y: 50 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        >
          <img
            alt="ProPirates text logo"
            className="opacity-20 max-md:opacity-100"
            height="auto"
            src="/assets/uipirate.svg"
            width="100%"
          />
        </motion.div>

        {/* Illuminated text (revealed on hover with torch) */}
        <motion.div
          animate={{ opacity: isHovering ? 1 : 0 }}
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          style={{
            maskImage: `radial-gradient(circle 350px at ${mousePosition.x}px ${mousePosition.y}px, black 0%, transparent 100%)`,
            WebkitMaskImage: `radial-gradient(circle 250px at ${mousePosition.x}px ${mousePosition.y}px, black 0%, transparent 100%)`,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <img
            alt="ProPirates illuminated text logo"
            height="auto"
            src="/assets/uipirate.svg"
            width="100%"
          />
        </motion.div>



      </div>
    </div>
  );
};

export default ProPirateFooterSection;
