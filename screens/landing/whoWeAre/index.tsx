"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

import GlassBadge from "@/components/GlassBadge";
import TheTeam from "../theTeam";

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.33, 1, 0.68, 1] },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] },
  },
};

const LandingWhoWeAre = () => {
  return (
    <section className="relative overflow-hidden bg-black py-20">
      <div className="section-container relative z-10 flex flex-col items-center">


        {/* Title */}
        <motion.div
          className="text-center mb-14 md:mb-20 "
          initial="hidden"
          variants={fadeUp}
          viewport={{ once: true, amount: 0.3 }}
          whileInView="visible"
        >
          <h2 className="heading-center text-white">
            Who We Are.
          </h2>
        </motion.div>

        {/* Hand + Card composition */}
        <div className="relative w-full max-w-2xl mx-auto flex flex-col items-center">
          {/* The white card */}
          <motion.div
            className="relative z-10 w-full max-w-[480px] mx-auto"
            initial="hidden"
            variants={cardVariant}
            viewport={{ once: true, amount: 0.2 }}
            whileInView="visible"
          >
            {/* Card shadow */}
            <div
              className="absolute inset-0 rounded-md"
              style={{
                boxShadow:
                  "0 40px 80px -10px rgba(0,0,0,0.6), 0 20px 40px -8px rgba(0,0,0,0.4)",
                borderRadius: "10px"
              }}
            />
            {/* Card body */}
            <div
              className="relative bg-white  p-5 sm:p-7"
              style={{ borderRadius: "4px" }}
            >
              {/* Headline */}
              <p className="text-[13px] sm:text-sm font-bold text-black mb-4 leading-snug">
                A small team, built for speed, obsessed with the details.
              </p>

              {/* Body paragraphs */}
              <div className="space-y-3 text-[12px] sm:text-[13px] text-gray-700 leading-relaxed">
                <p>
                  We are a product design and development agency.
                  <br />
                  We help SaaS founders and enterprise teams design, build, and
                  ship products that look premium, perform well, and hold up as
                  they grow.
                </p>

                <p>
                  We keep things simple on purpose.
                  <br />
                  No bloated process. No unnecessary layers.
                  <br />
                  Just clear communication, fast turnaround, and a team you can
                  rely on.
                </p>

                <p>
                  We&apos;re not trying to be the biggest studio.
                  <br />
                  We&apos;re here to be the one you can depend on.
                </p>

                <p>
                  The team you come back to.
                  <br />
                  The team that just gets it.
                </p>
                <p className="text-[12px] sm:text-[13px] text-gray-500 font-medium">
                  — UI Pirate Team
                </p>

              </div>

              {/* Footer row */}
              <div className="flex items-center justify-end mt-6 pt-5 border-t border-gray-100">

                {/* UI Pirate logo — asset has transparent underglow padding at the bottom,
                    so nudge it down to optically centre the icon against the wordmark */}
                <div className="flex items-center gap-2">
                  <Image
                    alt="UI Pirate"
                    className="h-5 w-5 object-contain shrink-0 translate-y-[3px]"
                    height={32}
                    src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1766234689/logo_lcn2cq.png"
                    width={32}
                  />

                  <span className="text-sm font-semibold text-black tracking-tight leading-none whitespace-nowrap">
                    UI Pirate
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Hand image — overlaps the bottom of the card */}
          <motion.div
            className="relative z-30 -mt-6 pb-16 md:pb-24 w-full max-w-[400px] mx-auto flex justify-center"
            initial={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.9, ease: [0.33, 1, 0.68, 1], delay: 0.3 }}
            viewport={{ once: true, amount: 0.1 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <Image
              alt="Hand holding the UI Pirate card"
              className="w-full h-auto object-contain select-none pointer-events-none"
              draggable={false}
              height={480}
              priority
              src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1788774217/Image_Hand_image_holding_something_fxwtbj.svg"
              unoptimized
              width={400}
              style={{ maxHeight: "400px" }}
            />
          </motion.div>
        </div>


      </div>
      {/* call team section */}
      <TheTeam />
    </section>
  );
};

export default LandingWhoWeAre;
