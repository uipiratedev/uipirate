"use client";

import { motion } from "framer-motion";

import GlassSurface from "@/components/GlassSurface";
import GlassBadge from "@/components/GlassBadge";
import {
  HERO_BADGE_PRESET,
  HERO_BADGE_CLASSNAME,
  HERO_BADGE_ANIMATION_STYLE,
} from "@/config/glassSurfacePresets";
import { PROCESS_STEPS } from "@/data/process";

export default function ProcessPage() {
  return (
    <div className="bg-[#fafafa] overflow-hidden">
      {/* JSON-LD: how UI Pirate's engagement works, as an ordered process */}
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "UI Pirate's Product Design & Development Process",
            description:
              "How UI Pirate takes a product from idea to shipped: Listen, Think, Plan, Design, Build, Ship & Scale.",
            step: PROCESS_STEPS.map((s) => ({
              "@type": "HowToStep",
              position: Number(s.step),
              name: s.title,
              text: s.description,
            })),
          }),
        }}
        type="application/ld+json"
      />

      {/* Hero */}
      <section className="hero-wrapper-col pb-12 max-md:!pt-14">
        <div
          className="absolute pointer-events-none inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
        <div
          className="absolute pointer-events-none inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(250, 250, 250, 1) 0%, transparent 40%)",
          }}
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-20 xl:px-32 relative z-10">
          <div className="flex flex-col items-center text-center">
            <GlassSurface
              {...HERO_BADGE_PRESET}
              className={HERO_BADGE_CLASSNAME}
              style={HERO_BADGE_ANIMATION_STYLE}
            >
              <div className="badge-text relative z-10 max-md:text-xs uppercase font-semibold tracking-wider">
                OUR PROCESS
              </div>
            </GlassSurface>

            <h1 className="hero-header max-w-4xl">
              <span className="text-black">Here&apos;s Exactly What </span>
              <span className="text-brand-orange">
                Working With Us Looks Like
              </span>
            </h1>

            <p className="max-w-[720px] text-center text-lg max-md:text-sm mt-4 leading-relaxed text-gray-600">
              No mystery, no black box. Six steps take your idea from a
              conversation to a shipped, production-ready product.
            </p>
          </div>
        </div>
      </section>

      {/* Process Steps - Dark Section (same content/structure as About) */}
      <section className="bg-[#0A0A0A] text-white py-16 relative overflow-hidden rounded-[32px] max-md:rounded-[20px] mx-4 sm:mx-6 lg:mx-20 xl:mx-32 mb-16">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-gradient-to-b from-brand-orange/10 to-transparent blur-3xl pointer-events-none" />

        <div className="px-8 max-md:px-5 relative z-10">
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <GlassBadge className="text-white" variant="gradient">
                THE PROCESS
              </GlassBadge>
            </div>
            <h2 className="text-3xl max-md:text-2xl font-bold tracking-tight text-white mb-3">
              Our Approach
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Simple: you share your vision. We do the rest.
            </p>
          </div>

          <div className="grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 gap-4">
            {PROCESS_STEPS.map((step, i) => (
              <motion.div
                key={step.step}
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-brand-orange/30 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-brand-orange/20 text-brand-orange font-mono font-bold text-xs mb-4">
                  {step.step}
                </span>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
