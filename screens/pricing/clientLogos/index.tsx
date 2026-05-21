"use client";
import { motion } from "framer-motion";

const CLIENT_LOGOS = [
  {
    url: "https://res.cloudinary.com/damm9iwho/image/upload/v1729513137/image_1_hxpv8e.svg",
    alt: "Ipsos",
  },
  {
    url: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1764586282/logo_qpyrhf.webp",
    alt: "Biotex Medical",
  },
  {
    url: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1770706789/sarge_hewzwz.svg",
    alt: "Sarge",
  },
  {
    url: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1760598018/healt_nvmdpw.svg",
    alt: "Awesome Health Club",
  },
  {
    url: "https://res.cloudinary.com/damm9iwho/image/upload/v1729682150/Rings_I_eyrgog.svg",
    alt: "Rings and I",
  },
];

const PricingClientLogos = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="py-8 max-md:py-6"
    >
      <p className="text-center text-sm text-gray-400 uppercase tracking-wider mb-6 font-medium">
        Trusted by teams at
      </p>
      
      <div className="flex flex-wrap items-center justify-center gap-8 max-md:gap-4">
        {CLIENT_LOGOS.map((logo, index) => (
          <motion.div
            key={logo.alt}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
          >
            <img
              src={logo.url}
              alt={logo.alt}
              className="h-8 max-md:h-6 w-auto object-contain"
              loading="lazy"
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default PricingClientLogos;
