"use client";
import React, { useState } from "react";
import { motion, Variants } from "framer-motion";

// Animation variants
const headingVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.33, 1, 0.68, 1] as const, // power3.out
    },
  },
};

const logoContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const logoItemVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.33, 1, 0.68, 1] as const, // power3.out
    },
  },
};

const LandingMarquee = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  // Curated selection of premium enterprise client logos
  const premiumLogos = [
    {
      url: "https://res.cloudinary.com/damm9iwho/image/upload/v1729513137/image_1_hxpv8e.svg",
      alt: "Ipsos - Global market research and consulting firm logo",
      link: "https://www.ipsos.com/en/ipsos-acquires-xperiti-strengthen-its-b2b-research-capabilities-global",
    },
    {
      url: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1764586282/logo_qpyrhf.webp",
      alt: "Biotex Medical - Healthcare technology solutions logo",
      link: "https://biotexmedical.com/",
    },
    {
      url: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1753093876/logo_r097ja.png",
      alt: "Khaitan & Co - APAC's largest leading law firm ",
      link: "https://www.khaitanco.com/",
    },
    {
      url: "https://res.cloudinary.com/damm9iwho/image/upload/v1729682150/Frame_1984078729_meav44.svg",
      alt: "RevUp AI - AI-powered business solutions logo",
      link: "https://revupai.com/",
    },

    {
      url: "https://res.cloudinary.com/damm9iwho/image/upload/v1729682148/Group-2_uduxpp.svg",
      alt: "Simpleo AI - Artificial intelligence platform logo",
      link: "https://www.simpleo.ai/",
    },
    {
      url: "https://res.cloudinary.com/damm9iwho/image/upload/v1730790130/728_x_90_copy_6x_uft7ai.svg",
      alt: "Arth Alpha - Financial technology and investment platform logo",
      link: "https://www.arthalpha.in/",
    },
    {
      url: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1764586408/OS-logo_w1dtde.svg",
      alt: "Omnex Systems - Quality management and compliance software logo",
      link: "https://www.omnexsystems.com/",
    },
    {
      url: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1760598018/healt_nvmdpw.svg",
      alt: "Awesome Health Club - Fitness and wellness platform logo",
      link: "https://awesomehealthclub.com/",
    },

    {
      url: "https://res.cloudinary.com/damm9iwho/image/upload/v1729682150/Rings_I_eyrgog.svg",
      alt: "Rings and I - Jewelry and lifestyle brand logo",
      link: "https://ringsandi.com/",
    },
    {
      url: "https://res.cloudinary.com/damm9iwho/image/upload/v1729513139/image_2_srxkyz.svg",
      alt: "Partner company logo",
      link: "",
    },
  ];

  return (
    <div className="py-6 max-md:py-6 bg-white relative overflow-hidden">
      {/* Subtle grid background - much softer, fades at edges, almost invisible */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 0, 0, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%)",
          opacity: 0.5,
        }}
      />

      <div className="container mx-auto max-md:px-4 flex flex-col items-center justify-center relative z-10">
        {/* Section heading with enhanced styling */}
        <div className="mb-6 max-md:mb-10 text-center max-w-4xl mx-auto px-8">
          <motion.div
            variants={headingVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.5 }}
          >
           
              <h2 className="heading-center text-brand-orange">
             Trusted by Teams
          </h2>

             <h2 className="heading-center ">
            Building the Future of SaaS and AI
          </h2>
         
          </motion.div>
        </div>

        {/* Static logo grid - premium enterprise clients only */}
        <div className="w-full max-w-6xl">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center justify-items-center"
            variants={logoContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {premiumLogos.map((logo, index) => (
              <motion.a
                key={index}
                className={`logo-item group flex items-center justify-center w-full h-full p-6 max-md:p-4 rounded-[10px] relative overflow-hidden ${
                  logo.link
                    ? "cursor-pointer hover:brightness-105"
                    : "cursor-default"
                }`}
                href={logo.link || undefined}
                rel={logo.link ? "noopener noreferrer" : undefined}
                style={{
                  background:
                    "linear-gradient(142deg, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0.65) 50%, rgba(255, 255, 255, 0.55) 100%)",
                  backdropFilter: "blur(32px) saturate(120%) brightness(100%)",
                  WebkitBackdropFilter:
                    "blur(32px) saturate(120%) brightness(100%)",
                  border: "2px solid rgba(255, 255, 255, 0.12)",
                  boxShadow:
                    "0 4px 16px 0 rgba(31, 38, 135, 0.08), inset 1px 1px 2px 0 rgba(255, 255, 255, 0.3), inset -1px -1px 1px 0 rgba(255, 255, 255, 0.05)",
                }}
                target={logo.link ? "_blank" : undefined}
                variants={logoItemVariants}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
              >
                {/* Gradient Border - appears on hover */}
                <motion.div
                  className="gradient-border"
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "0.75rem",
                    padding: "2px",
                    background:
                      "linear-gradient(90deg, #F7DE04 4.58%, #11C781 27.52%, #05A2FB 48.18%, #5E72E4 72.05%, #F04800 92.7%)",
                    WebkitMask:
                      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                    pointerEvents: "none",
                    zIndex: 1,
                  }}
                  animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
                />

                <motion.img
                  alt={logo.alt}
                  className="h-[40px] max-h-[40px] max-md:h-[32px] max-md:max-h-[32px] w-auto object-contain relative z-10"
                  loading="lazy"
                  src={logo.url}
                  animate={{ scale: hoveredIndex === index ? 1.1 : 1 }}
                  transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
                />
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          .logo-item,
          .logo-item img,
          .gradient-border {
            transition: none !important;
            animation: none !important;
          }
        }

        .logo-item {
          position: relative;
        }

        .logo-item::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 0.75rem;
          background: linear-gradient(
            135deg,
            rgba(142, 241, 241, 0.1),
            rgba(96, 165, 250, 0.1)
          );
          opacity: 0;
          transition: opacity 0.5s ease;
          z-index: 0;
        }

        .logo-item:hover::before {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default LandingMarquee;
