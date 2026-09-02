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
    <div className="container mx-auto px-4 sm:px-6 lg:px-20 xl:px-32">
      <motion.div
        className="flex flex-col-reverse md:flex-row items-center gap-10 md:gap-14 rounded-[32px] overflow-hidden bg-white dark:bg-[#111] border border-gray-100 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-none p-6 sm:p-10 lg:p-14 relative"
        initial={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        {/* Subtle Background Glow */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-orange/5 dark:bg-brand-orange/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        {/* Left Side Content */}
        <div className="flex-1 text-left relative z-10 w-full">
          <div className="mb-6 inline-flex">
            <GlassBadge variant="gradient">
              FEATURED CASE STUDY
            </GlassBadge>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3 flex-wrap">
            {study.clientLogo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt={`${study.client} logo`}
                className="h-7 md:h-8 w-auto object-contain dark:brightness-0 dark:invert"
                src={study.clientLogo}
              />
            ) : (
              study.client
            )}
            {study.industry && (
              <span className="text-[11px] font-bold px-2.5 py-1 bg-slate-100 dark:bg-white/10 rounded-full text-slate-600 dark:text-gray-300 tracking-wider uppercase ml-1 border border-slate-200 dark:border-white/5">
                {study.industry}
              </span>
            )}
          </h2>
          
          {study.excerpt && (
            <p className="text-slate-600 dark:text-gray-400 mb-8 max-w-xl text-[16px] md:text-[17px] leading-relaxed font-medium">
              {study.excerpt}
            </p>
          )}
          
          <div className="inline-flex flex-row items-center gap-5 bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 rounded-2xl px-6 py-4 mb-8 shadow-sm">
            <span className="text-3xl md:text-4xl font-extrabold text-brand-orange font-jetbrains-mono tracking-tight">
              {study.metricValue}
            </span>
            <span className="text-xs md:text-sm font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-widest leading-snug max-w-[120px]">
              {study.metricLabel}
            </span>
          </div>
          
          <div className="block">
            <Link
              className="group inline-flex items-center gap-2 text-slate-900 dark:text-white font-bold hover:text-brand-orange transition-colors text-[14px] md:text-[15px] uppercase tracking-wide"
              href={`/case-studies/${study.slug}`}
            >
              Read the full case study 
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
        
        {/* Right Side Image */}
        <div className="flex-1 w-full max-md:w-full relative z-10 group">
          <div className="relative overflow-hidden rounded-[24px] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-[#1A1A1A]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={`${study.client} — ${study.title}`}
              className="w-full h-[240px] md:h-[340px] lg:h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
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
