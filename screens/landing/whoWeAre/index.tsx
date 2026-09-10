"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useTransform } from "framer-motion";
import Image from "next/image";

import TheTeam from "../theTeam";

import SectionHeader from "@/components/SectionHeader";
import { Reveal, useSectionProgress } from "@/components/motion";

const LandingWhoWeAre = () => {
  const stageRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const progress = useSectionProgress(stageRef);

  // Scroll-linked: the card lifts a touch and rotates back to flat as the
  // composition transits the viewport — a slow "presenting" tilt.
  const cardY = useTransform(progress, [0, 0.5, 1], ["4%", "0%", "-4%"]);
  const cardRotateX = useTransform(progress, [0, 0.5], [7, 0]);

  return (
    <section className="relative overflow-hidden bg-black py-20">
      <div className="section-container relative z-10 flex flex-col items-center">
        <Reveal variant="up">
          <SectionHeader headingClassName="text-white">
            Who We Are.
          </SectionHeader>
        </Reveal>

        {/* Hand + Card composition */}
        <div
          ref={stageRef}
          className="relative mx-auto flex w-full max-w-2xl flex-col items-center [perspective:1200px]"
        >
          {/* The white card — <Reveal> owns the entrance, the inner
              motion.div owns the scroll-linked "presenting" tilt. */}
          <Reveal
            className="relative z-10 mx-auto w-full max-w-[480px]"
            distance="lg"
            variant="up"
          >
            <motion.div
              style={reduced ? undefined : { y: cardY, rotateX: cardRotateX }}
            >
              {/* Card shadow */}
              <div
                className="absolute inset-0 rounded-md"
                style={{
                  boxShadow:
                    "0 40px 80px -10px rgba(0,0,0,0.6), 0 20px 40px -8px rgba(0,0,0,0.4)",
                  borderRadius: "10px",
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
          </Reveal>

          {/* Hand image — overlaps the bottom of the card */}
          <motion.div
            className="relative z-30 -mt-9 pb-16 md:pb-24 w-full max-w-[400px] mx-auto flex justify-center"
            initial={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.9, ease: [0.33, 1, 0.68, 1], delay: 0.3 }}
            viewport={{ once: true, amount: 0.1 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <Image
              priority
              unoptimized
              alt="Hand holding the UI Pirate card"
              className="w-full h-auto object-contain select-none pointer-events-none"
              draggable={false}
              height={480}
              src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1789050306/image_230_xoj5ox.svg"
              style={{ maxHeight: "400px" }}
              width={400}
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
