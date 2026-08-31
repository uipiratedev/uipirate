"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import GlassBadge from "@/components/GlassBadge";

export interface FeaturedCaseStudyData {
  slug: string;
  client: string;
  title: string;
  excerpt?: string;
  heroImage: string;
  metricLabel: string;
  metricValue: string;
  clientLogo?: string;
  industry?: string;
}

interface FeaturedCaseStudyProps {
  study: FeaturedCaseStudyData | null;
}

// A single real case study with a real result metric — not just a gallery
// grid. Renders nothing if no CMS case study with a metric is available
// (never falls back to invented numbers).
const FeaturedCaseStudy = ({ study }: FeaturedCaseStudyProps) => {
  if (!study) return null;

  return (
    <div className="container mx-auto px-32 lg:px-20 max-md:px-4">
      <motion.div
        className="flex flex-row max-md:flex-col-reverse items-center gap-10 max-md:gap-6 rounded-[32px] max-md:rounded-[20px] overflow-hidden bg-[#0A0A0A] p-12 max-md:p-6"
        initial={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <div className="flex-1 text-left">
          <GlassBadge className="text-white mb-6" variant="gradient">
            featured case study
          </GlassBadge>
          <h2 className="text-3xl max-md:text-2xl font-bold text-white mb-3 flex items-center gap-3">
            {study.clientLogo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt={`${study.client} logo`}
                className="h-8 w-auto object-contain brightness-0 invert"
                src={study.clientLogo}
              />
            ) : (
              study.client
            )}
            {study.industry && (
              <span className="text-xs font-semibold px-2 py-1 bg-white/10 rounded-md text-gray-300 tracking-wider uppercase ml-2">
                {study.industry}
              </span>
            )}
          </h2>
          {study.excerpt && (
            <p className="text-gray-500 mb-6 max-w-xl leading-relaxed">
              {study.excerpt}
            </p>
          )}
          <div className="inline-flex items-baseline gap-2 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 mb-6">
            <span className="text-3xl font-bold text-brand-orange font-jetbrains-mono">
              {study.metricValue}
            </span>
            <span className="text-sm text-gray-500 uppercase tracking-wider">
              {study.metricLabel}
            </span>
          </div>
          <div>
            <Link
              className="inline-flex items-center gap-2 text-white font-semibold hover:text-brand-orange transition-colors"
              href={`/case-studies/${study.slug}`}
            >
              Read the full case study →
            </Link>
          </div>
        </div>
        <div className="flex-1 w-full max-md:w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={`${study.client} — ${study.title}`}
            className="w-full h-[280px] max-md:h-[180px] object-cover rounded-2xl"
            loading="lazy"
            src={study.heroImage}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default FeaturedCaseStudy;
