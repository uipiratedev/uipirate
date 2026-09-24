"use client";

import type { ReaderPost } from "@/lib/pirateCOS/public-client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import PageWrapper from "@/components/PageWrapper";
import GlassBadge from "@/components/GlassBadge";
import GlassSurface from "@/components/GlassSurface";

const DEFAULT_CONCEPT_IMAGE = "/assets/blog-banner-default.svg";

interface ConceptCard {
  slug: string;
  title: string;
  excerpt: string;
  client?: string;
  industry?: string;
  technologies?: string[];
  heroImage: string;
  publishedAt: string | null;
}

function isDataUri(url?: string) {
  return !!url && url.startsWith("data:");
}

function normalizeCmsConcept(post: ReaderPost): ConceptCard {
  const rawHeroImage = post.featuredImage || post.bannerImage;

  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt || "",
    client: post.client,
    industry: post.tags?.[0],
    technologies: post.technologies || post.tags,
    heroImage: isDataUri(rawHeroImage)
      ? DEFAULT_CONCEPT_IMAGE
      : rawHeroImage || DEFAULT_CONCEPT_IMAGE,
    publishedAt: post.publishedAt,
  };
}

interface ConceptsProps {
  cmsConcepts?: ReaderPost[];
}

const Concepts = ({ cmsConcepts = [] }: ConceptsProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const concepts: ConceptCard[] = useMemo(
    () => cmsConcepts.map(normalizeCmsConcept),
    [cmsConcepts],
  );

  const filtered = concepts.filter((c) => {
    if (searchQuery === "") return true;

    const query = searchQuery.toLowerCase().trim();
    const searchableText = [
      c.client,
      c.title,
      c.excerpt,
      c.industry,
      ...(c.technologies || []),
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(query);
  });

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Concepts & Proposals - UI Pirate",
    description:
      "Product concepts and technical proposals — problem, solution, and tech stack — for prospective clients, published even when the project itself didn't move forward.",
    url: "https://uipirate.com/concepts",
    provider: { "@type": "Organization", name: "UI Pirate", url: "https://uipirate.com" },
    numberOfItems: concepts.length,
    itemListElement: concepts.map((c, index) => ({
      "@type": "CreativeWork",
      position: index + 1,
      name: c.title,
      description: c.excerpt,
      image: c.heroImage,
      keywords: c.technologies?.join(", "),
    })),
  };

  return (
    <PageWrapper showFloatingButton={false}>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
        type="application/ld+json"
      />

      <div className="hero-wrapper">
        <div className="flex flex-col items-center justify-center w-full relative z-10 section-container pt-16 max-md:pt-10 pb-10">
          <GlassSurface
            backgroundOpacity={0.1}
            blueOffset={20}
            blur={11}
            borderRadius={12}
            borderWidth={0.01}
            brightness={50}
            className="mb-6 !flex !flex-row !items-center !gap-3 isolate overflow-visible p-2 px-4"
            displace={0.5}
            distortionScale={-180}
            forceLightMode={true}
            greenOffset={10}
            height="auto"
            opacity={0.93}
            redOffset={0}
            saturation={1}
            width="auto"
          >
            <p className="badge-text relative z-10 max-md:text-xs uppercase font-semibold tracking-wider">
              CONCEPTS &amp; PROPOSALS
            </p>
          </GlassSurface>

          <h1 className="hero-header text-center">
            Problems we scoped.{" "}
            <span className="text-[#FF5B04]">Solutions we designed.</span>
          </h1>
          <p className="sub-header text-[#11181C] text-center max-w-2xl">
            Not every proposal turns into a signed project — the client goes
            another way, budgets shift, timelines change. The thinking
            doesn&apos;t have to disappear with it. Here&apos;s the problem,
            the solution we architected, and the tech stack we chose, and why.
          </p>
        </div>
      </div>

      <section className="section-container pt-4 max-md:pt-2">
        <div className="autoShow max-w-xl mx-auto mb-8 max-md:mb-6">
          <div className="relative">
            <input
              className="w-full px-5 py-3.5 pl-12 rounded-full border-2 border-gray-200 focus:border-[#FF5B04] focus:outline-none transition-colors duration-300 text-sm bg-white shadow-sm"
              placeholder="Search by client, industry, or technology..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-20 max-md:py-16">
              <p className="text-gray-500 text-lg max-md:text-base mb-2 font-semibold">
                {searchQuery
                  ? "No matching concepts found"
                  : "No concepts published yet"}
              </p>
              <p className="text-gray-500 text-sm">
                {searchQuery ? "Try a different search term" : "Check back soon"}
              </p>
            </div>
          ) : (
            filtered.map((c, index) => (
              <motion.div
                key={c.slug}
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.1,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              >
                <Link
                  className="group block relative rounded-3xl overflow-hidden shadow-lg border border-gray-200/60 hover:shadow-2xl hover:border-gray-300 transition-all duration-500 bg-white"
                  href={`/concepts/${c.slug}`}
                >
                  <div className="absolute inset-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt=""
                      className="w-full h-full object-cover blur-sm scale-110 opacity-60"
                      decoding="async"
                      loading="lazy"
                      src={c.heroImage}
                    />
                  </div>

                  <div className="relative z-10 bg-gradient-to-br from-white/80 to-white/70 backdrop-blur-sm p-8 max-md:p-6 h-full">
                    <div className="flex items-center justify-between mb-6 max-md:mb-4">
                      <div className="px-3 py-1.5 bg-white/90 backdrop-blur-xl border border-gray-200/70 rounded-full shadow-sm">
                        <p className="text-[10px] max-md:text-[9px] font-jetbrains-mono uppercase tracking-[0.12em] text-gray-800 font-medium">
                          {c.industry || "Concept"}
                        </p>
                      </div>
                    </div>

                    <div className="mb-6 max-md:mb-4">
                      {c.client && (
                        <h3 className="text-2xl max-md:text-xl font-bold text-gray-900 mb-1.5 group-hover:text-[#FF5B04] transition-colors">
                          {c.client}
                        </h3>
                      )}
                      <p className="text-sm max-md:text-xs text-gray-600 font-semibold mb-3">
                        {c.title}
                      </p>
                      <p className="text-sm max-md:text-xs text-gray-700 leading-relaxed line-clamp-2">
                        {c.excerpt}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-300/60">
                      <div className="flex gap-1.5 flex-wrap">
                        {c.technologies?.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="px-2.5 py-1 bg-white/95 backdrop-blur-sm border border-gray-300/60 rounded-full text-[10px] font-jetbrains-mono text-gray-800 shadow-sm font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-1.5 text-sm max-md:text-xs font-bold text-[#FF5B04] shrink-0">
                        <span className="hidden md:inline">Read proposal</span>
                        <span className="md:hidden">Read</span>
                        <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5">
                          →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </section>

      <section className="section-container pt-16 pb-16 max-md:pt-10">
        <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-[#212121] to-[#151514] noise-texture px-12 py-20 max-md:px-6 max-md:py-12 text-center">
          <p className="text-[11px] font-jetbrains-mono uppercase tracking-[0.18em] text-[#FF5B04] mb-3">
            Got a similar problem?
          </p>
          <h2 className="text-4xl max-md:text-2xl font-bold text-white mb-4">
            Let&apos;s Scope Your Solution
          </h2>
          <p className="text-gray-500 font-medium text-base max-md:text-sm max-w-2xl mx-auto mb-8 max-md:mb-6">
            Same process as every proposal on this page — problem definition,
            solution architecture, and a tech stack recommendation. Typical
            response under 2 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              className="px-8 py-4 bg-[#FF5B04] text-white font-bold rounded-full hover:bg-[#e04e00] transition-all duration-300 shadow-lg hover:shadow-xl"
              href="/contact"
            >
              Start a Conversation →
            </Link>
            <Link
              className="px-8 py-4 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 transition-all duration-300 border border-white/20"
              href="/case-studies"
            >
              See Shipped Work
            </Link>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
};

export default Concepts;
