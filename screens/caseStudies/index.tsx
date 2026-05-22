"use client";

import { useState } from "react";
import Link from "next/link";

import PageWrapper from "@/components/PageWrapper";
import ProjectEstimate from "@/components/ProjectEstimate";
import GlassBadge from "@/components/GlassBadge";
import OurWorksHero from "@/screens/ourWorks/hero";
import WhyChooseUs from "@/screens/landing/whyChoosUs";
import ClientLogosMarquee from "./ClientLogosMarquee";
import LandingTestimonials from "@/screens/landing/testimonials";
import CaseStudiesFAQ from "./CaseStudiesFAQ";

import caseStudies from "@/data/case-studies.json";

const categories = [
  "All",
  "Enterprise SaaS",
  "AI SaaS",
  "SaaS Product",
  "Mobile App",
  "E-commerce Website",
  "Landing Page"
];

const CaseStudies = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredStudies = activeCategory === "All"
    ? caseStudies
    : caseStudies.filter(study => study.category === activeCategory);

  return (
    <PageWrapper showFloatingButton={false}>
      <div className="mb-12">
        {/* Hero — portfolio + case studies positioning */}
        <div className="container mx-auto px-32 lg:px-20 max-md:px-4">
          <OurWorksHero />
        </div>

        {/* Client Logos Marquee */}
        <ClientLogosMarquee />

        {/* Featured deep-dive case studies (from data/case-studies.json) */}
        <section className="container mx-auto px-32 lg:px-20 max-md:px-4 pt-12 max-md:pt-6">
          <div className="autoShow">
            <div className="mb-6 flex flex-row items-center justify-center">
              <GlassBadge variant="gradient">case studies</GlassBadge>
            </div>
            <p className="heading-center">Product design & development in practice</p>
            <p className="text-gray-500 text-center max-w-2xl mx-auto mt-4 mb-10">
              Deep dives into how we turn ideas into shipped products — from product thinking
              and IA to UX/UI and Angular/React development.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="autoShow flex flex-wrap items-center justify-center gap-3 mb-10 max-md:mb-6">
            {categories.map((category) => {
              const count = category === "All"
                ? caseStudies.length
                : caseStudies.filter(study => study.category === category).length;

              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-jetbrains-mono font-medium transition-all duration-300 flex items-center gap-2 ${
                    activeCategory === category
                      ? "bg-[#FF5B04] text-white shadow-md"
                      : "bg-white/90 text-gray-700 border border-gray-200/70 hover:border-[#FF5B04]/50 hover:text-[#FF5B04]"
                  }`}
                >
                  {category}
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    activeCategory === category
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="autoShowBottom grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredStudies.length === 0 ? (
              <div className="col-span-full text-center py-20 max-md:py-16">
                <div className="max-w-md mx-auto">
                  <p className="text-gray-500 text-lg max-md:text-base mb-4">
                    No projects in this category yet.
                  </p>
                  <button
                    onClick={() => setActiveCategory("All")}
                    className="px-6 py-3 bg-[#FF5B04] text-white rounded-full hover:bg-[#FF5B04]/90 transition-colors duration-300 font-semibold text-sm shadow-md hover:shadow-lg"
                  >
                    View all projects
                  </button>
                </div>
              </div>
            ) : (
              filteredStudies.map((study) => {
              const primaryMetric = study.metrics?.[0]?.value || study.industry;
              const isExternal = !!study.externalUrl;
              const href = study.externalUrl || `/case-studies/${study.slug}`;
              const LinkComponent = isExternal ? 'a' : Link;
              const linkProps = isExternal
                ? { href, target: "_blank", rel: "noopener noreferrer" }
                : { href };

              return (
                <LinkComponent
                  key={study.slug}
                  {...linkProps}
                  className="group block relative rounded-3xl overflow-hidden shadow-lg border border-gray-200/60 hover:shadow-2xl hover:border-gray-300 transition-all duration-500 bg-white"
                >
                  {/* Blurred background image - more visible */}
                  <div className="absolute inset-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={study.heroImage}
                      alt={`${study.client} background`}
                      className="w-full h-full object-cover blur-sm scale-110 opacity-60"
                    />
                  </div>

                  {/* Glass overlay with content */}
                  <div className="relative z-10 bg-gradient-to-br from-white/80 to-white/70 backdrop-blur-sm p-8 max-md:p-6 h-full">
                    {/* Top row: Industry chip + Metric chip */}
                    <div className="flex items-center justify-between mb-6 max-md:mb-4">
                      <div className="px-3 py-1.5 bg-white/90 backdrop-blur-xl border border-gray-200/70 rounded-full shadow-sm">
                        <p className="text-[10px] max-md:text-[9px] font-jetbrains-mono uppercase tracking-[0.12em] text-gray-800 font-medium">
                          {study.industry} · {study.region}
                        </p>
                      </div>
                      <div className="px-3 py-1.5 bg-[#FF5B04] backdrop-blur-xl rounded-full shadow-md">
                        <p className="text-[10px] max-md:text-[9px] font-jetbrains-mono uppercase tracking-[0.12em] text-white font-semibold">
                          {primaryMetric}
                        </p>
                      </div>
                    </div>

                    {/* Company name + Project title + Excerpt */}
                    <div className="mb-6 max-md:mb-4">
                      <h3 className="text-2xl max-md:text-xl font-bold text-gray-900 mb-1.5 group-hover:text-[#FF5B04] transition-colors">
                        {study.client}
                      </h3>
                      <p className="text-sm max-md:text-xs text-gray-600 font-semibold mb-3">
                        {study.title.split(' — ')[1] || study.title}
                      </p>
                      <p className="text-sm max-md:text-xs text-gray-700 leading-relaxed line-clamp-2">
                        {study.excerpt}
                      </p>
                    </div>

                    {/* Tech stack pills + CTA */}
                    <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-300/60">
                      <div className="flex gap-1.5 flex-wrap">
                        {study.technologies?.slice(0, 3).map((tech: string) => (
                          <span
                            key={tech}
                            className="px-2.5 py-1 bg-white/95 backdrop-blur-sm border border-gray-300/60 rounded-full text-[10px] font-jetbrains-mono text-gray-800 shadow-sm font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="flex flex-col items-end gap-2.5 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={study.clientLogo || study.heroImage}
                          alt={`${study.client} logo`}
                          className="w-10 h-10 max-md:w-8 max-md:h-8 object-contain drop-shadow-sm"
                        />
                        <div className="flex items-center gap-1.5 text-sm max-md:text-xs font-bold text-[#FF5B04]">
                          <span className="hidden md:inline">{isExternal ? "View project" : "Read case study"}</span>
                          <span className="md:hidden">{isExternal ? "Visit" : "Read"}</span>
                          <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5">
                            {isExternal ? "↗" : "→"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </LinkComponent>
              );
            })
            )}
          </div>
        </section>

        {/* What's Next CTA */}
        <section className="container mx-auto px-32 lg:px-20 max-md:px-4 pt-12 max-md:pt-6">
          <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-[#212121] to-[#151514] noise-texture px-12 py-20 max-md:px-6 max-md:py-12 text-center">
            <p className="text-[11px] font-jetbrains-mono uppercase tracking-[0.18em] text-[#FF5B04] mb-3">
              What&apos;s next
            </p>
            <h2 className="text-4xl max-md:text-2xl font-bold text-white mb-4">
              Your product, shipped next
            </h2>
            <p className="text-gray-400 font-medium text-base max-md:text-sm max-w-2xl mx-auto mb-8 max-md:mb-6">
              From idea to shipped product — product thinking, IA, UX/UI, and Angular/React frontend
              carried end-to-end. Typical response under 2 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/contact"
                className="px-8 py-4 bg-[#FF5B04] text-white font-bold rounded-full hover:bg-[#e04e00] transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Start Your Project →
              </Link>
              <Link
                href="/pricing"
                className="px-8 py-4 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 transition-all duration-300 border border-white/20"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </section>

        {/* Client Testimonials */}
        <div className="container mx-auto px-32 lg:px-20 max-md:px-4">
          <LandingTestimonials />
        </div>

        {/* Why Choose Us */}
         <div className="container mx-auto px-32 lg:px-20 max-md:px-4">\
     <WhyChooseUs />
         </div>
   

        {/* FAQ Section */}
        <CaseStudiesFAQ />

        {/* Pricing CTA */}
        <div className="container mx-auto px-32 lg:px-20 max-md:px-4">
          <div className="mb-12">
            <div className="autoShow">
              <div className="mb-6 flex flex-row items-center justify-center">
                <GlassBadge variant="gradient">pricing</GlassBadge>
              </div>
              <p className="heading-center">Pricing That Makes Sense</p>
            </div>
            <div className="autoShowBottom mt-6 max-md:mt-4 max-w-2xl mx-auto">
              <ProjectEstimate className="min-h-[600px]" />
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default CaseStudies;
