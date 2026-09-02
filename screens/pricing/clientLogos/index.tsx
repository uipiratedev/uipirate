"use client";
import React from "react";
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

const PricingClientLogos = () => {
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
      url: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1770706789/sarge_hewzwz.svg",
      alt: "Sarge - AI-powered business solutions logo",
      link: "https://sarge.com/",
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
      url: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1788341201/pivotbitslogo_vgkhnp.svg",
      alt: "Pivotbits - AI-powered business solutions logo",
      link: "https://pivotbits.com/",
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

      <div className="section-container">
        {/* Heading Section */}
        <div className="text-center mb-6">
          <motion.div
            initial="hidden"
            variants={headingVariants}
            viewport={{ once: false, amount: 0.5 }}
            whileInView="visible"
          >
            <h2 className="heading-center">
              Trusted by <span className="text-brand-orange">40+</span> product
              teams
              <br />{" "}
              <span className="text-gray-900">
                across the USA, UK, Singapore & India
              </span>
            </h2>
          </motion.div>
        </div>

        {/* Static logo grid - premium enterprise clients only */}
        <div className="w-full mt-6">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center justify-items-center"
            initial="hidden"
            variants={logoContainerVariants}
            viewport={{ once: true, amount: 0.3 }}
            whileInView="visible"
          >
            {premiumLogos.map((logo, index) => (
              <motion.a
                key={index}
                className={`flex items-center justify-center w-full h-full p-6 max-md:p-4 rounded-[10px] relative overflow-hidden ${
                  logo.link ? "cursor-pointer" : "cursor-default"
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
              >
                <img
                  alt={logo.alt}
                  className="h-[40px] max-h-[40px] max-md:h-[24px] max-md:max-h-[24px] w-auto object-contain relative z-10"
                  loading="lazy"
                  src={logo.url}
                />
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PricingClientLogos;
