"use client";

import { motion } from "framer-motion";
import { Link } from "@heroui/link";
import { useState } from "react";

import { JoinButtonIcon } from "./JoinButtonIcon";
import ProPirateFooterSection from "./proPirate";
import { useClickSound } from "@/hooks/useClickSound";

const footerSocialLinks = [
  {
    name: "Google Maps",
    url: "https://maps.app.goo.gl/tcp9QiMqsUmN7xoY8",
    icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1751630868/maps_icon-s_rgw06n.svg",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/company/ui-pirate-by-vishal-anand/",
    icon: "https://res.cloudinary.com/damm9iwho/image/upload/v1729665622/ri_linkedin-fill_nivdt4.svg",
  },
  {
    name: "Upwork",
    url: "https://www.upwork.com/agencies/1837026757439552424/",
    icon: "https://res.cloudinary.com/damm9iwho/image/upload/v1729665602/bxl_upwork_qojqwz.svg",
  },
  {
    name: "Behance",
    url: "https://www.behance.net/vishalanand-UI-UX",
    icon: "https://res.cloudinary.com/damm9iwho/image/upload/v1729665601/uil_behance_ky54am.svg",
  },
  {
    name: "Dribbble",
    url: "https://dribbble.com/vishalanandUIUX",
    icon: "https://res.cloudinary.com/damm9iwho/image/upload/v1730786563/uil_behance_mf89uz.svg",
  },
  {
    name: "Clutch",
    url: "https://clutch.co/profile/ui-pirate-vishal-anand",
    icon: "https://res.cloudinary.com/damm9iwho/image/upload/v1729665601/Frame_1000006225_bafxox.svg",
  },
];

/**
 * Footer Section Component
 *
 * Footer with CTA, social links, and branding.
 * Features a gradient button matching the design system.
 */
export const Footer: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const playClickSound = useClickSound();

  const handleClick = () => {
    playClickSound();
    setIsActive(!isActive);
  };

  return (
    <footer className="relative w-full bg-black pt-24 overflow-hidden noise-texture noise-texture ">
      {/* Noise Texture Overlay */}
      {/* <div 
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          backgroundImage: 'url(/assets/noise.png)',
          backgroundRepeat: 'repeat',
          opacity: 0.08,
        }}
      /> */}
      
      {/* Top Light Effect */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-white/5" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[40vh] bg-white/5 blur-[80px] -translate-y-1/2" />

      {/* Content */}
      <div className="relative z-20  mx-auto px-6 text-center">
        {/* CTA Section */}
        <motion.div
          className="mb-24 max-md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          {/* Heading */}
          <h2
            className="footer-heading"
            style={{ fontFamily: "var(--font-geist)" }}
          >
            Wanna Be part of the first wave?
          </h2>
          <h2
            className="footer-heading text-primary -mt-2"
            style={{ fontFamily: "var(--font-geist)" }}
          >
            Get Early Access and help shape what this becomes
          </h2>

          {/* JOIN WAITLIST Button with 3D Effect */}
          {/* JOIN WAITLIST Button with Targeted Scaling & Reflection */}
          <div className="flex justify-center">
            <Link
            href="https://docs.google.com/forms/d/e/1FAIpQLSd5jCqm79CUcwSaaQ6yPckhFoChN8Aq_m1LWlS_0_BO5iFrkg/viewform"
            rel="noopener noreferrer"
            target="_blank"
          >
            <motion.div
              className="flex flex-col items-center mb-16 mt-6 relative group cursor-pointer w-fit"
              onClick={handleClick}
              onMouseLeave={() => setIsPressed(false)}
              onMouseUp={() => setIsPressed(false)}
              onTouchEnd={() => setIsPressed(false)}
              onTouchStart={() => setIsPressed(true)}
              style={{ perspective: "1000px" }}
              // whileTap={{ scale: 0.99 }}
              onMouseDown={() => setIsPressed(true)}
            >
              <div className="block relative mt-6">
                {/* Reflection Sweep Effect (Floating Layer) */}
                <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-[32px]">
                  <div className="absolute inset-x-0 top-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full -skew-x-20 group-hover:animate-sheen" />
                </div>

                {/* Icon Container with Lighting Glow */}
                <div className="flex items-center justify-center w-[600px] max-xl:w-[400px] max-md:w-[250px] z-[999999999999999999] transition-all duration-300 group-hover:drop-shadow-[0_0_35px_rgba(255,100,0,0.8)]">
                  <JoinButtonIcon
                    className="w-full h-auto"
                    isActive={isActive}
                    isPressed={isPressed}
                  />
                </div>
              </div>
            </motion.div>
            </Link>
          </div>

          {/* Background Text - SAAS WEB APP Marquee - Positioned Behind Button */}
          <div
            className="absolute top-[43%] max-md:top-[35%] left-0 right-0 -translate-y-1/2 opacity-[0.03] pointer-events-none overflow-hidden"
            style={{
              WebkitMaskImage:
                "linear-gradient(to right, white 0%, white 20%, transparent 35%, transparent 65%, white 80%, white 100%)",
              maskImage:
                "linear-gradient(to right, white 0%, white 20%, transparent 35%, transparent 65%, white 80%, white 100%)",
            }}
          >
            <motion.div
              animate={{
                x: ["0%", "-50%"],
              }}
              className="flex whitespace-nowrap"
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 25,
                  ease: "linear",
                },
              }}
            >
              {[...Array(4)].map((_, i) => (
                <span
                  key={i}
                  className="text-[100px] max-md:text-[50px] font-bold leading-[100%] tracking-[0px] align-middle uppercase text-white mx-12"
                  style={{
                    fontFamily: "'JetBrains Mono Variable', monospace",
                    // @ts-ignore
                    leadingTrim: "none",
                  }}
                >
                  SAAS WEB APP
                </span>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1 }}
        >
          <p
            className="text-[18px] max-md:text-[14px] font-medium text-center uppercase"
            style={{
              fontFamily: "'Geist Mono', monospace",
              lineHeight: "140%",
              letterSpacing: "4.8px",
              // @ts-ignore
              leadingTrim: "none",
            }}
          >
            <span className="text-white">
              SKILL-FIRST COMPETITIVE PLATFORM FOR{" "}
            </span>
            <span className="text-primary font-semibold">
              BUILDERS AND CREATORS
            </span>
          </p>
        </motion.div>

        {/* Footer Bottom Row - Copyright & Social Links */}
        <motion.div
          className="flex flex-col max-w-7xl mx-auto px-4 max-md:px-0 md:flex-row items-center justify-between gap-6 pt-8 border-t border-gray-800/50 mb-28 max-md:mb-6"
          initial={{ opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1 }}
        >
          {/* Copyright */}
          <p className="text-[14px] text-white order-2 md:order-1">
            Copyright©2025 ProPirates. All Rights Reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-6 max-md:gap-3 order-1 md:order-2">
            {footerSocialLinks.map((link) => (
              <Link
                key={link.name}
                isExternal
                className="group relative transition-all duration-300"
                href={link.url}
              >
                <div className=" flex items-center justify-center rounded-lg bg-white/5 border border-white/10 group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                  <img
                    alt={link.name}
                    className="w-10 h-10  brightness-100 group-hover:invert transition-all duration-300"
                    height="40"
                    src={link.icon}
                    width="40"
                  />
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Torch Effect Section */}
      <ProPirateFooterSection />
    </footer>
  );
};
