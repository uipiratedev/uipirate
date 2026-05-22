"use client";

import { motion } from "framer-motion";

const clientLogos = [
  {
    url: "https://res.cloudinary.com/damm9iwho/image/upload/v1729513137/image_1_hxpv8e.svg",
    alt: "Ipsos - Global market research firm",
  },
  {
    url: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1764586282/logo_qpyrhf.webp",
    alt: "Bioptex Medical - Healthcare technology",
  },
  {
    url: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1753093876/logo_r097ja.png",
    alt: "Khaitan & Co - APAC's largest law firm",
  },
  {
    url: "https://res.cloudinary.com/damm9iwho/image/upload/v1729682150/Frame_1984078729_meav44.svg",
    alt: "RevUp AI - AI-powered business solutions",
  },
  {
    url: "https://res.cloudinary.com/damm9iwho/image/upload/v1729682148/Group-2_uduxpp.svg",
    alt: "SimpleO AI - Legal management platform",
  },
  {
    url: "https://res.cloudinary.com/damm9iwho/image/upload/v1730790130/728_x_90_copy_6x_uft7ai.svg",
    alt: "ArthAlpha - Quant trading platform",
  },
  {
    url: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1770706789/sarge_hewzwz.svg",
    alt: "Sarge - AI business solutions",
  },
  {
    url: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1760598018/healt_nvmdpw.svg",
    alt: "Awesome Health Club - Fitness platform",
  },
  {
    url: "https://res.cloudinary.com/damm9iwho/image/upload/v1729682150/Rings_I_eyrgog.svg",
    alt: "Rings & I - Custom jewelry",
  },
];

const ClientLogosMarquee = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="py-12 max-md:py-8 bg-gray-50"
    >
      <div className="container mx-auto px-32 lg:px-20 max-md:px-4">
        <p className="text-center text-sm text-gray-400 uppercase tracking-wider mb-8 max-md:mb-6 font-medium">
          Trusted by teams at
        </p>

        <div className="flex flex-wrap items-center justify-center gap-8 max-md:gap-6">
          {clientLogos.map((logo, index) => (
            <motion.div
              key={logo.alt}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all duration-300"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo.url}
                alt={logo.alt}
                className="h-8 max-md:h-6 w-auto object-contain"
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default ClientLogosMarquee;
