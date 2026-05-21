"use client";

import Link from "next/link";

import PageWrapper from "@/components/PageWrapper";
import ProjectEstimate from "@/components/ProjectEstimate";
import GlassBadge from "@/components/GlassBadge";
import OurWorksHero from "@/screens/ourWorks/hero";
import CaseStudyGrid from "@/screens/ourWorks/works/workCard";
import WhyChooseUs from "@/screens/landing/whyChoosUs";

import caseStudies from "@/data/case-studies.json";

const CaseStudies = () => {
  return (
    <PageWrapper showFloatingButton={false}>
      <div className="mb-12">
        {/* Hero — portfolio + case studies positioning */}
        <div className="container mx-auto px-32 lg:px-20 max-md:px-4">
          <OurWorksHero />
        </div>

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

          <div className="autoShowBottom grid grid-cols-2 max-lg:grid-cols-1 gap-8">
            {caseStudies.map((study) => (
              <Link
                key={study.slug}
                href={`/case-studies/${study.slug}`}
                className="group bg-white border border-gray-200 rounded-2xl p-8 hover:border-[#FF5B04]/40 hover:shadow-lg transition-all"
              >
                {study.heroImage && (
                  <div className="h-16 mb-6 flex items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={study.heroImage}
                      alt={study.client}
                      className="max-h-12 w-auto object-contain"
                    />
                  </div>
                )}
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
                  {study.industry} · {study.region}
                </p>
                <h2 className="text-xl font-bold text-gray-900 group-hover:text-[#FF5B04] transition-colors mb-3">
                  {study.title}
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                  {study.excerpt}
                </p>
                <span className="inline-block mt-6 text-sm font-semibold text-[#FF5B04]">
                  Read case study →
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent works — featured large project cards + why-choose-us */}
        <section className="pt-12 max-md:pt-6">
          <div className="autoShow">
            <div className="mb-6 flex flex-row items-center justify-center">
              <GlassBadge variant="gradient">works</GlassBadge>
            </div>
            <p className="heading-center">Recent Works</p>
          </div>
          <div className="autoShowBottom container mx-auto px-32 lg:px-20 max-md:px-4 mt-6 max-md:mt-4">
            <CaseStudyGrid />
            <WhyChooseUs />
          </div>
        </section>

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
