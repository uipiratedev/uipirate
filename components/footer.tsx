"use client";

import { motion } from "framer-motion";
import { Link } from "@heroui/link";
import { useState } from "react";

import { JoinButtonIcon } from "./JoinButtonIcon";
import ProPirateFooterSection from "./proPirate";
import { useClickSound } from "@/hooks/useClickSound";

const footerSocialLinks = [
  {
    name: "uipirate",
    url: "https://uipirate.com",
    icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1770280222/uipirate_sowte1.svg",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/company/ui-pirate-by-vishal-anand/",
    icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1770280207/in_ucqlrn.svg",
  },
    {
    name: "twitter",
    url: "https://twitter.com/ui_pirate",
    icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1770280207/x_n6sgau.svg",
  },
   {
    name: "Dribbble",
    url: "https://dribbble.com/vishalanandUIUX",
    icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1770280207/redit_v3rdpt.svg",
  },
  {
    name: "Upwork",
    url: "https://www.upwork.com/agencies/1837026757439552424/",
    icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1770280706/up_a4rhmj.svg",
  },
  {
    name: "Behance",
    url: "https://www.behance.net/vishalanand-UI-UX",
    icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1770280706/be_k40rwo.svg",
  },
 
  {
    name: "Clutch",
    url: "https://clutch.co/profile/ui-pirate-vishal-anand",
    icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1770280807/cl_zlzmht.svg",
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
    <footer className="relative w-full bg-[#000000F9] pt-24 overflow-hidden noise-texture noise-texture ">
      
      
      {/* Top Light Effect */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-white via-white/50 to-transparent" />
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
          >
            If you scrolled this far, 
          </h2>
           <h2
            className="footer-heading"
          >
           
It’s time to <span className="text-orange-500">Build Something Together</span>
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
                    text="lets venture"
                  />
                </div>
              </div>
            </motion.div>
            </Link>
          </div>

          {/* Background Text - SAAS WEB APP Marquee - Positioned Behind Button */}
          <div
            className="absolute top-[27%] max-md:top-[20%] left-0 right-0 -translate-y-1/2 opacity-[0.03] pointer-events-none overflow-hidden"
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
                  className="text-[100px] max-md:text-[50px] font-bold leading-[100%] tracking-[0px] align-middle uppercase text-white mx-12 font-jetbrains-mono"
                  style={{
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

        {/* Footer Navigation Grid */}
        <motion.div
          className="max-w-[1400px] mx-auto px-6 mt-20 pb-16"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 text-left pt-16">
            {/* Branding/Tagline Section */}
            <div className="lg:col-span-5 flex flex-col gap-8">
              <p className="text-[18px] md:text-[24px] font-bold text-white leading-[1.3] max-w-sm"
                
                 >
                Premium <span className="text-orange-500  ">UI/UX Design & Development</span> for SaaS & AI Products.
              </p>
              
          
            </div>

            {/* Quick Links Column */}
            <div className="lg:col-span-2">
              <h4 className="link-heading">
                Quick Links
              </h4>
              <ul className="flex flex-col gap-1">
                <li><Link href="/" className="text-white hover:text-white/60 transition-colors text-base font-medium">Home</Link></li>
                <li><Link href="/services" className="text-white hover:text-white/60 transition-colors text-base font-medium">Services</Link></li>
                <li><Link href="/works" className="text-white hover:text-white/60 transition-colors text-base font-medium">Works</Link></li>
                <li><Link href="/pricing" className="text-white hover:text-white/60 transition-colors text-base font-medium">Pricing</Link></li>
              </ul>
            </div>

            {/* Resources Column */}
            <div className="lg:col-span-2">
              <h4 className="link-heading">
                Resources
              </h4>
              <ul className="flex flex-col gap-1">
                <li><Link href="/blogs" className="text-white hover:text-white/60 transition-colors text-base font-medium">Blogs</Link></li>
                <li><Link href="/community" className="text-white hover:text-white/60 transition-colors text-base font-medium">Community Insights</Link></li>
                <li><Link href="/products" className="text-white hover:text-white/60 transition-colors text-base font-medium">Mini SaaS Apps</Link></li>
                <li><Link href="/faq" className="text-white hover:text-white/60 transition-colors text-base font-medium">FAQ’s</Link></li>
              </ul>
            </div>

            {/* Policies Column */}
            <div className="lg:col-span-3">
              <h4 className="link-heading">
                Policies & Legal
              </h4>
              <ul className="flex flex-col gap-1">
                <li><Link href="/privacy" className="text-white hover:text-white/60 transition-colors text-base font-medium">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-white hover:text-white/60 transition-colors text-base font-medium">Terms and Conditions</Link></li>
                <li><Link href="/sitemap" className="text-white hover:text-white/60 transition-colors text-base font-medium">Site Map</Link></li>
              </ul>
            </div>
          </div>

          {/* Copyright Strip */}
          <div className="mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[13px] text-white/30 font-medium">
              Copyright©2023 UI Pirate. All Rights Reserved.
            </p>
              {/* Social Links Sub-section */}
              <div className="flex items-center gap-4 mt-2">
                {footerSocialLinks.map((link) => (
                  <Link
                key={link.name}
                isExternal
                className="group relative transition-all duration-300"
                href={link.url}
              >
                <div className=" flex items-center p-3 max-md:p-2 justify-center rounded-lg bg-white/5 border border-white/10 group-hover:bg-orange-500 group-hover:border-orange-500 transition-all duration-300">
                  <img
                    alt={link.name}
                    className="w-4 h-4 max-md:w-5 max-md:h-5 brightness-100 group-hover:invert transition-all duration-300"
                  
                    src={link.icon}
                  />
                </div>
              </Link>
                ))}
              </div>
          </div>
        </motion.div>
      </div>

      {/* Torch Effect Section */}
      <ProPirateFooterSection />
    </footer>
  );
};
