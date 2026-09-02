"use client";

import { motion } from "framer-motion";

import GlassBadge from "@/components/GlassBadge";
import LetsTalkButton from "@/components/LetsTalkButton";

export interface FeaturedCaseStudyData {
  slug: string;
  client: string;
  title: string;
  excerpt?: string;
  heroImage: string;
  highlights?: string[];
  clientLogo?: string;
  metricLabel?: string;
  metricValue?: string;
  industry?: string;
}

interface FeaturedCaseStudyProps {
  study: FeaturedCaseStudyData | null;
}

// A single real case study, told as a story rather than a metric tile.
// Renders nothing if no CMS case study with a hero image is available.
const FeaturedCaseStudy = ({ study }: FeaturedCaseStudyProps) => {
  if (!study) return null;

  return (
    <div className="section-container">
      <motion.div
        className="relative overflow-hidden rounded-[20px] sm:rounded-[20px] bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] dark:bg-[#141414] dark:shadow-none"
        initial={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        {/* Subtle peachy ambient glow in the top-left corner of the card */}
        <div className="pointer-events-none absolute -left-10 -top-10 h-52 w-72 rounded-full bg-brand-orange/20 blur-[70px] dark:bg-brand-orange/15" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-stretch">
          {/* Left Side Content - 50% width */}
          <div className="relative z-10 w-full shrink-0 text-left lg:w-1/2 p-6 sm:p-10 lg:p-12 xl:p-14 flex flex-col justify-between">
            <div>
              <div className="relative mb-6 flex items-center justify-between gap-4">
                <GlassBadge variant="gradient">FEATURED CASE STUDY</GlassBadge>
                {study.clientLogo && (
                  <img
                    alt={`${study.client} logo`}
                    className="h-7 sm:h-8 w-auto shrink-0 object-contain dark:brightness-0 dark:invert"
                    src={study.clientLogo}
                  />
                )}
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-[32px] lg:leading-[1.25] dark:text-white">
                {study.title}
              </h2>

              {study.excerpt && (
                <p className="mt-4 text-[15px] sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
                  {study.excerpt}
                </p>
              )}

              {study.highlights && study.highlights.length > 0 && (
                <ul className="mt-6 flex flex-col gap-3">
                  {study.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="flex items-center gap-3 text-[15px] sm:text-base font-medium text-slate-900 dark:text-slate-100"
                    >
                      <span
                        aria-hidden="true"
                        className="text-brand-orange text-base font-bold"
                      >
                        <i className="ti ti-arrow-right" />
                      </span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-8">
              <LetsTalkButton
                href={`/case-studies/${study.slug}`}
                showArrow={true}
                variant="color"
              >
                Read the full case study
              </LetsTalkButton>
            </div>
          </div>

          {/* Right Side Image - 50% width, seamless blend */}
          <div className="relative w-full lg:w-1/2 self-stretch flex items-center justify-end overflow-hidden min-h-[340px] sm:min-h-[420px] lg:min-h-full">
            <img
              alt={`${study.client} — ${study.title}`}
              className="w-full h-full object-cover object-left select-none"
              loading="lazy"
              src={study.heroImage}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FeaturedCaseStudy;
