"use client";

import { motion } from "framer-motion";

import { ClientLogosGrid } from "@/components/ClientLogos";

const ClientLogosMarquee = () => {
  return (
    <motion.section
      className="py-12 max-md:py-8 bg-gray-50"
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div className="section-container">
        <p className="text-center text-sm text-gray-500 uppercase tracking-wider mb-8 max-md:mb-6 font-medium">
          Trusted by teams at
        </p>

        <ClientLogosGrid />
      </div>
    </motion.section>
  );
};

export default ClientLogosMarquee;
