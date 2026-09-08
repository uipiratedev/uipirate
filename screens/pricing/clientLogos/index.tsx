"use client";
import React from "react";
import { motion, Variants } from "framer-motion";

import { ClientLogosGrid } from "@/components/ClientLogos";

// Animation variants for heading
const headingVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.33, 1, 0.68, 1],
    },
  },
};

const PricingClientLogos = () => {
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

        {/* Global Client Logos Grid */}
        <ClientLogosGrid />
      </div>
    </div>
  );
};

export default PricingClientLogos;
