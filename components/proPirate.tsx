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
          animate={
            isInView
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: 0, y: 50, scale: 0.9 }
          }
          className="absolute inset-0 flex items-center justify-center filter  contrast-125"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
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
          {/* <h2 className="text-[60px] md:text-[140px] lg:text-[200px] xl:text-[280px] font-black tracking-tighter bg-gradient-to-b from-white via-amber-100/90 to-amber-200/60 bg-clip-text text-transparent select-none drop-shadow-[0_0_40px_rgba(255,200,100,0.4)]">
            PROPIRATE
          </h2> */}
          <img
            alt="ProPirates illuminated text logo"
            height="auto"
            src="/assets/uipirate.svg"
            width="100%"
          />
        </motion.div>

        {/* Light cone effect - Smoother transitions */}
        {/* <motion.div
          className="absolute pointer-events-none"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: isHovering ? 1 : 0,
            scale: isHovering ? 1 : 0.8,
          }}
          transition={{ 
            opacity: { duration: 0.4, ease: "easeOut" },
            scale: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
          }}
          style={{
            x: smoothLightConeX,
            y: smoothLightConeY,
            width: "400px",
            height: "500px",
            translateX: "-50%",
            translateY: "-5%",
            background:
              "linear-gradient(180deg, rgba(255, 220, 120, 0.5) 0%, rgba(255, 180, 80, 0.2) 30%, rgba(255, 150, 50, 0.08) 60%, transparent 100%)",
            clipPath: "polygon(50% 0%, 10% 100%, 90% 100%)",
            filter: "blur(30px)",
          }}
        /> */}

        {/* Torch icon - Smoother appearance */}
        {/* <motion.div
          className="absolute pointer-events-none text-3xl md:text-5xl lg:text-7xl"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: isHovering ? 1 : 0,
            scale: isHovering ? 1 : 0.5,
          }}
          transition={{
            opacity: { duration: 0.4, ease: "easeOut" },
            scale: { 
              duration: 0.6, 
              type: "spring", 
              stiffness: 200, 
              damping: 20,
              mass: 0.8
            },
          }}
          style={{
            x: smoothTorchX,
            y: smoothTorchY,
            translateX: "-50%",
            translateY: "-100%",
          }}
        >
          
              <svg
                width="24"
                height="36"
                viewBox="0 0 40 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="15"
                  y="25"
                  width="10"
                  height="30"
                  rx="2"
                  fill="url(#heroBtnTorchHandle)"
                />
                <path
                  d="M8 25 L32 25 L28 10 L12 10 Z"
                  fill="url(#heroBtnTorchHead)"
                />
                <ellipse
                  cx="20"
                  cy="8"
                  rx="8"
                  ry="6"
                  fill="url(#heroBtnFlameGlow)"
                />
                <path
                  d="M20 0 C20 0 26 6 26 10 C26 14 23 16 20 16 C17 16 14 14 14 10 C14 6 20 0 20 0Z"
                  fill="url(#heroBtnFlame)"
                />
                <defs>
                  <linearGradient
                    id="heroBtnTorchHandle"
                    x1="20"
                    y1="25"
                    x2="20"
                    y2="55"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#8B4513" />
                    <stop offset="1" stopColor="#5D3A1A" />
                  </linearGradient>
                  <linearGradient
                    id="heroBtnTorchHead"
                    x1="20"
                    y1="10"
                    x2="20"
                    y2="25"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#CD853F" />
                    <stop offset="1" stopColor="#8B4513" />
                  </linearGradient>
                  <radialGradient
                    id="heroBtnFlameGlow"
                    cx="20"
                    cy="8"
                    r="8"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="rgba(255, 200, 100, 0.8)" />
                    <stop offset="1" stopColor="rgba(255, 150, 50, 0)" />
                  </radialGradient>
                  <linearGradient
                    id="heroBtnFlame"
                    x1="20"
                    y1="0"
                    x2="20"
                    y2="16"
                    gradientUnits="userSpaceOnUse"
                  >
                    <motion.stop 
                      offset="0" 
                      stopColor="#FFF4E0"
                      animate={{ stopColor: ["#FFF4E0", "#FFFFFF", "#FFF4E0"] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <motion.stop 
                      offset="0.3" 
                      stopColor="#FFD700"
                      animate={{ offset: [0.25, 0.35, 0.25] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <stop offset="0.7" stopColor="#FF8C00" />
                    <motion.stop 
                      offset="1" 
                      stopColor="#FF4500"
                      animate={{ stopColor: ["#FF4500", "#FF0000", "#FF4500"] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  </linearGradient>
                </defs>
              </svg>
        </motion.div> */}

        {/* Ambient glow on hover - Smoother and more intense */}
        {/* <motion.div
          className="absolute pointer-events-none rounded-full blur-3xl z-[9999999999999999999999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovering ? 1 : 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{
            left: mousePosition.x,
            top: mousePosition.y,
            width: '400px',
            height: '400px',
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(circle, rgba(255, 180, 80, 0.25) 0%, rgba(255, 150, 50, 0.08) 50%, transparent 100%)`,
          }}
        /> */}
      </div>
    </div>
  );
};

export default ProPirateFooterSection;
