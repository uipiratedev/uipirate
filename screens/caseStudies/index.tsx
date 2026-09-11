"use client";

import type { ReaderPost } from "@/lib/pirateCOS/public-client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import CaseStudiesFAQ from "./CaseStudiesFAQ";

import PageWrapper from "@/components/PageWrapper";
import CaseStudiesHero from "@/screens/caseStudies/hero";
import WhyChooseUs from "@/screens/landing/whyChoosUs";

const DEFAULT_CASE_STUDY_IMAGE = "/assets/blog-banner-default.svg";

interface CaseStudyCard {
  slug: string;
  title: string;
  excerpt: string;
  client: string;
  industry?: string;
  region?: string;
  technologies?: string[];
  metrics?: { label: string; value: string }[];
  heroImage: string;
  clientLogo?: string;
  externalUrl?: string;
  publishedAt: string | null;
}

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

function isNewCaseStudy(publishedAt: string | null) {
  if (!publishedAt) return false;

  return Date.now() - new Date(publishedAt).getTime() <= THIRTY_DAYS_MS;
}

// Some CMS posts have featuredImage/bannerImage stored as raw base64 data
// URIs instead of hosted URLs (a CMS-side data issue, not fixable here).
// Inlining one of those blows up this listing page's HTML — the same
// multi-hundred-KB string gets embedded per card as the <img src>, again in
// the JSON-LD `image` field below, and again in Next's RSC hydration
// payload. Reject them here rather than let it slip into the page.
function isDataUri(url?: string) {
  return !!url && url.startsWith("data:");
}

// CMS-authored case studies (postType "case-study") carry their own client,
// clientLogo, region, technologies, metrics and externalUrl fields from the
// API. There's no "industry" field on the CMS side, so it falls back to the
// post's first tag/title.
function normalizeCmsCaseStudy(post: ReaderPost): CaseStudyCard {
  const rawHeroImage = post.featuredImage || post.bannerImage;

  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt || "",
    client: post.client || post.title.split(" — ")[0],
    clientLogo: isDataUri(post.clientLogo) ? undefined : post.clientLogo,
    industry: post.tags?.[0] || "Case Study",
    region: post.region,
    technologies: post.technologies || post.tags,
    metrics: post.metrics,
    heroImage: isDataUri(rawHeroImage)
      ? DEFAULT_CASE_STUDY_IMAGE
      : rawHeroImage || DEFAULT_CASE_STUDY_IMAGE,
    externalUrl: post.externalUrl,
    publishedAt: post.publishedAt,
  };
}

interface CaseStudiesProps {
  cmsCaseStudies?: ReaderPost[];
}

const CaseStudies = ({ cmsCaseStudies = [] }: CaseStudiesProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");

  const caseStudies: CaseStudyCard[] = useMemo(
    () => cmsCaseStudies.map(normalizeCmsCaseStudy),
    [cmsCaseStudies],
  );

  const categories = useMemo(() => {
    const cats = new Set<string>();
    caseStudies.forEach(s => {
      if (s.industry) cats.add(s.industry);
    });
    return Array.from(cats).sort();
  }, [caseStudies]);

  const filteredStudies = caseStudies.filter((study) => {
    if (category !== "All" && study.industry !== category) {
      return false;
    }

    if (searchQuery === "") return true;

    const query = searchQuery.toLowerCase().trim();

    // Search in multiple fields
    const searchableText = [
      study.client,
      study.title,
      study.excerpt,
      study.industry,
      study.region,
      ...(study.technologies || []),
      ...(study.metrics?.map((m) => m.value) || []),
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(query);
  });

  // JSON-LD Schema for Portfolio/Case Studies
  const portfolioSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Case Studies - UI Pirate",
    description:
      "Product design and development case studies showcasing SaaS, AI, mobile apps, and enterprise projects",
    url: "https://uipirate.com/case-studies",
    provider: {
      "@type": "Organization",
      name: "UI Pirate",
      url: "https://uipirate.com",
    },
    numberOfItems: caseStudies.length,
    itemListElement: caseStudies.map((study, index) => ({
      "@type": "CreativeWork",
      position: index + 1,
      name: study.title,
      description: study.excerpt,
      image: study.heroImage,
      creator: {
        "@type": "Organization",
        name: "UI Pirate",
      },
      keywords: study.technologies?.join(", "),
      about: study.industry,
      ...(study.externalUrl && { url: study.externalUrl }),
    })),
  };

  return (
    <PageWrapper showFloatingButton={false}>
      {/* SEO Schema */}
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolioSchema) }}
        type="application/ld+json"
      />

      <div>
        {/* Hero — portfolio + case studies positioning */}
        <CaseStudiesHero
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          category={category}
          setCategory={setCategory}
          categories={categories}
        />



        {/* Featured deep-dive case studies (from the CMS) */}
        <section className="section-container pt-12 max-md:pt-6">



          {/* Results Count */}
          {(searchQuery || category !== "All") && (
            <div className="flex items-center justify-between mb-6 max-md:mb-4 text-sm">
              <p className="text-gray-600 font-medium">
                Showing{" "}
                <span className="text-[#FF5B04] font-bold">
                  {filteredStudies.length}
                </span>{" "}
                of <span className="font-bold">{caseStudies.length}</span>{" "}
                projects matching filters
              </p>
              <button
                className="text-[#FF5B04] hover:text-[#e04e00] font-medium text-sm transition-colors underline"
                onClick={() => {
                  setSearchQuery("");
                  setCategory("All");
                }}
              >
                Clear filters
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredStudies.length === 0 ? (
              <div className="col-span-full text-center py-20 max-md:py-16">
                <div className="max-w-md mx-auto">
                  <svg
                    className="w-16 h-16 mx-auto mb-4 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                    />
                  </svg>
                  <p className="text-gray-500 text-lg max-md:text-base mb-2 font-semibold">
                    {searchQuery
                      ? "No matching projects found"
                      : "No case studies published yet"}
                  </p>
                  <p className="text-gray-500 text-sm mb-6">
                    {searchQuery
                      ? "Try adjusting your search term"
                      : "Check back soon"}
                  </p>
                  {(searchQuery || category !== "All") && (
                    <div className="flex gap-3 justify-center">
                      <button
                        className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-full hover:border-[#FF5B04] hover:text-[#FF5B04] transition-all duration-300 font-semibold text-sm"
                        onClick={() => {
                          setSearchQuery("");
                          setCategory("All");
                        }}
                      >
                        Clear filters
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              filteredStudies.map((study, index) => {
                const primaryMetric = study.metrics?.[0]?.value;
                const isNew = isNewCaseStudy(study.publishedAt);

                return (
                  <motion.div
                    key={study.slug}
                    className="flex h-full"
                    animate={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 20 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.1,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                  >
                    <Link
                      className="group flex flex-col w-full relative rounded-3xl overflow-hidden shadow-lg border border-gray-200/60 hover:shadow-2xl hover:border-gray-300 transition-all duration-500 bg-white"
                      href={`/case-studies/${study.slug}`}
                    >
                      {isNew && (
                        <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-emerald-500 text-white rounded-full shadow-md">
                          <p className="text-[10px] font-jetbrains-mono uppercase tracking-[0.12em] font-bold">
                            New
                          </p>
                        </div>
                      )}

                      {/* Card content with pure white background */}
                      <div className="relative z-10 p-8 max-md:p-6 flex flex-col flex-grow bg-white">
                        {/* Top row: Industry chip + Metric chip */}
                        <div className="flex items-start justify-between gap-4 mb-6 max-md:mb-4">
                          <div className="px-3 py-1.5 bg-gray-50 border border-gray-200/70 rounded-full shadow-sm shrink-0">
                            <p className="text-[10px] max-md:text-[9px] font-jetbrains-mono uppercase tracking-[0.12em] text-gray-800 font-medium">
                              {study.industry}
                              {study.region ? ` · ${study.region}` : ""}
                            </p>
                          </div>
                          {primaryMetric && (
                            <div className="px-3 py-1.5 bg-[#FF5B04] rounded-full shadow-md text-right">
                              <p className="text-[10px] max-md:text-[9px] font-jetbrains-mono uppercase tracking-[0.12em] text-white font-semibold">
                                {primaryMetric}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Company name + Project title + Excerpt */}
                        <div className="mb-6 max-md:mb-4 flex-grow">
                          <h3 className="text-2xl max-md:text-xl font-bold text-gray-900 mb-1.5 group-hover:text-[#FF5B04] transition-colors">
                            {study.client}
                          </h3>
                          <p className="text-sm max-md:text-xs text-gray-600 font-semibold mb-3">
                            {study.title.split(" — ")[1] || study.title}
                          </p>
                          <p className="text-sm max-md:text-xs text-gray-700 leading-relaxed line-clamp-2">
                            {study.excerpt}
                          </p>
                        </div>

                        {/* Tech stack pills + CTA */}
                        <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-200/60 mt-auto">
                          <div className="flex gap-1.5 flex-wrap">
                            {study.technologies
                              ?.slice(0, 3)
                              .map((tech: string) => (
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
                              alt={`${study.client} logo`}
                              className="w-10 h-10 max-md:w-8 max-md:h-8 object-contain drop-shadow-sm"
                              src={study.clientLogo || study.heroImage}
                            />
                            <div className="flex items-center gap-1.5 text-sm max-md:text-xs font-bold text-[#FF5B04]">
                              <span className="hidden md:inline">
                                Read case study
                              </span>
                              <span className="md:hidden">Read</span>
                              <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5">
                                →
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })
            )}
          </div>
        </section>

        {/* What's Next CTA */}
        <section className="section-container pt-12 max-md:pt-6">
          <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-[#212121] to-[#151514] noise-texture px-12 py-20 max-md:px-6 max-md:py-12 text-center">
            <p className="text-[11px] font-jetbrains-mono uppercase tracking-[0.18em] text-[#FF5B04] mb-3">
              What&apos;s next
            </p>
            <h2 className="text-4xl max-md:text-2xl font-bold text-white mb-4">
              Let&apos;s Build Something Like This For You
            </h2>
            <p className="text-gray-500 font-medium text-base max-md:text-sm max-w-2xl mx-auto mb-8 max-md:mb-6">
              From idea to shipped product — product thinking, IA, UX/UI, and
              Angular/React frontend carried end-to-end. Typical response under
              2 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                className="px-8 py-4 bg-[#FF5B04] text-white font-bold rounded-full hover:bg-[#e04e00] transition-all duration-300 shadow-lg hover:shadow-xl"
                href="/contact"
              >
                Start Your Project →
              </Link>
              <Link
                className="px-8 py-4 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 transition-all duration-300 border border-white/20"
                href="/pricing"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <WhyChooseUs />

        {/* FAQ Section */}
        <CaseStudiesFAQ />
      </div>
    </PageWrapper>
  );
};

export default CaseStudies;
