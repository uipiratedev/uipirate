"use client";

import type { ReaderPost } from "@/lib/cometCOS/public-client";
import type { ConceptEntry } from "./data";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import PageWrapper from "@/components/PageWrapper";
import GlassSurface from "@/components/GlassSurface";

import { CONCEPTS } from "./data";

interface CardData {
  slug: string;
  number: string;
  title: string;
  industry: string;
  problem: string;
  stack: string[];
  timeline: string;
  builtOn?: string;
  published: boolean;
}

const PRODUCT_PROOF = [
  {
    name: "Alfred OS",
    role: "Multi-agent platform with a policy-check step",
  },
  {
    name: "AI Voice Caller",
    role: "Voice agents for scheduling and front-desk calls",
  },
  {
    name: "cometCOS",
    role: "Multi-tenant content platform that runs this site",
  },
];

const PROTOTYPE_POINTS = [
  "Screens, flows and a first working chatbot",
  "A mock data model with sample records",
  "Enough to feel the idea and test it with people",
];

const PRODUCTION_POINTS = [
  "Auth, roles and per-customer data isolation",
  "Retries, queues and third-party API failures",
  "Audit trails, monitoring and safe rollbacks",
  "Compliance (HIPAA, SOC 2, GDPR, PCI) where it applies",
  "AI guardrails, human handoff and cost control",
];

function toCard(entry: ConceptEntry, publishedSlugs: Set<string>): CardData {
  return {
    slug: entry.slug,
    number: entry.number,
    title: entry.title,
    industry: entry.industry,
    problem: entry.problem,
    stack: entry.stack,
    timeline: entry.timeline,
    builtOn: entry.builtOn,
    published: publishedSlugs.has(entry.slug),
  };
}

function cmsToCard(post: ReaderPost): CardData {
  return {
    slug: post.slug,
    number: "",
    title: post.client ? `${post.client}: ${post.title}` : post.title,
    industry: post.tags?.[0] || "Proposal",
    problem: post.excerpt || "",
    stack: post.technologies || post.tags || [],
    timeline: "",
    published: true,
  };
}

function matches(card: CardData, query: string) {
  if (!query) return true;

  return [card.title, card.industry, card.problem, ...card.stack]
    .join(" ")
    .toLowerCase()
    .includes(query.toLowerCase().trim());
}

const ConceptCard = ({ card, index }: { card: CardData; index: number }) => {
  const body = (
    <div className="relative h-full flex flex-col bg-white p-8 max-md:p-6">
      <div className="flex items-center justify-between mb-5 max-md:mb-4">
        <div className="px-3 py-1.5 bg-gray-50 border border-gray-200/70 rounded-full">
          <p className="text-[10px] max-md:text-[9px] font-jetbrains-mono uppercase tracking-[0.12em] text-gray-800 font-medium">
            {card.industry}
          </p>
        </div>
        {card.number && (
          <span className="text-sm font-jetbrains-mono text-gray-400 font-medium">
            {card.number}
          </span>
        )}
      </div>

      <h3
        className={`text-xl max-md:text-lg font-bold text-gray-900 mb-2 transition-colors ${
          card.published ? "group-hover:text-[#FF5B04]" : ""
        }`}
      >
        {card.title}
      </h3>
      <p className="text-sm max-md:text-xs text-gray-600 leading-relaxed mb-5 flex-1">
        {card.problem}
      </p>

      {card.builtOn && (
        <p className="text-xs text-gray-500 mb-3">
          Extends our{" "}
          <span className="font-semibold text-gray-700">{card.builtOn}</span>
        </p>
      )}

      <div className="flex gap-1.5 flex-wrap mb-5">
        {card.stack.slice(0, 4).map((tech) => (
          <span
            key={tech}
            className="px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-full text-[10px] font-jetbrains-mono text-gray-800 font-medium"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-200/80">
        <p className="text-xs font-jetbrains-mono text-gray-500">
          {card.timeline ? `First version: ${card.timeline}` : ""}
        </p>
        {card.published ? (
          <div className="flex items-center gap-1.5 text-sm max-md:text-xs font-bold text-[#FF5B04] shrink-0">
            <span>Read concept</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5">
              →
            </span>
          </div>
        ) : (
          <span className="text-xs font-jetbrains-mono uppercase tracking-wider text-gray-400 shrink-0">
            Write-up coming soon
          </span>
        )}
      </div>
    </div>
  );

  const wrapperClass =
    "group block h-full rounded-3xl overflow-hidden border border-gray-200/70 shadow-sm transition-all duration-500";

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 20 }}
      transition={{
        duration: 0.4,
        delay: Math.min(index, 6) * 0.07,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {card.published ? (
        <Link
          className={`${wrapperClass} hover:shadow-2xl hover:border-gray-300`}
          href={`/concepts/${card.slug}`}
        >
          {body}
        </Link>
      ) : (
        <div className={wrapperClass}>{body}</div>
      )}
    </motion.div>
  );
};

const SectionHeading = ({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text?: string;
}) => (
  <div className="mb-8 max-md:mb-6">
    <p className="text-[11px] font-jetbrains-mono uppercase tracking-[0.18em] text-[#FF5B04] mb-2">
      {eyebrow}
    </p>
    <h2 className="text-3xl max-md:text-2xl font-bold text-gray-900 mb-2">
      {title}
    </h2>
    {text && (
      <p className="text-gray-600 text-base max-md:text-sm max-w-2xl">{text}</p>
    )}
  </div>
);

interface ConceptsProps {
  cmsConcepts?: ReaderPost[];
  /** Slugs of concepts that have a built-in detail page */
  detailSlugs?: string[];
}

const Concepts = ({ cmsConcepts = [], detailSlugs = [] }: ConceptsProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const { featured, more, earlier } = useMemo(() => {
    const publishedSlugs = new Set([
      ...cmsConcepts.map((p) => p.slug),
      ...detailSlugs,
    ]);
    const knownSlugs = new Set(CONCEPTS.map((c) => c.slug));

    return {
      featured: CONCEPTS.filter((c) => c.tier === "featured").map((c) =>
        toCard(c, publishedSlugs),
      ),
      more: CONCEPTS.filter((c) => c.tier === "more").map((c) =>
        toCard(c, publishedSlugs),
      ),
      earlier: cmsConcepts.filter((p) => !knownSlugs.has(p.slug)).map(cmsToCard),
    };
  }, [cmsConcepts, detailSlugs]);

  const filteredFeatured = featured.filter((c) => matches(c, searchQuery));
  const filteredMore = more.filter((c) => matches(c, searchQuery));
  const filteredEarlier = earlier.filter((c) => matches(c, searchQuery));
  const nothingFound =
    filteredFeatured.length + filteredMore.length + filteredEarlier.length ===
    0;

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Concepts - UI Pirate",
    description:
      "Technical concept breakdowns for AI and API-driven products: the problem, the market, the phased solution, the tech stack, and what production actually needs.",
    url: "https://uipirate.com/concepts",
    provider: {
      "@type": "Organization",
      name: "UI Pirate",
      url: "https://uipirate.com",
    },
    numberOfItems: CONCEPTS.length + earlier.length,
    itemListElement: [...featured, ...more, ...earlier].map((c, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: c.title,
      description: c.problem,
      ...(c.published
        ? { url: `https://uipirate.com/concepts/${c.slug}` }
        : {}),
    })),
  };

  return (
    <PageWrapper showFloatingButton={false}>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
        type="application/ld+json"
      />

      <div className="hero-wrapper">
        <div
          className="absolute pointer-events-none -mt-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            marginLeft: "calc(-50vw + 50%)",
          }}
        />
        <div
          className="absolute pointer-events-none -mt-20"
          style={{
            backgroundImage: `
              linear-gradient(to top, rgba(250, 250, 250, 1), transparent 10%),
              linear-gradient(to top, rgba(250, 250, 250, 1) 0%, transparent 35%)
            `,
            animation: "gentle-mist 8s ease-in-out infinite",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            marginLeft: "calc(-50vw + 50%)",
          }}
        />

        <div
          className="flex flex-col items-center justify-center w-full relative z-10 section-container pb-24"
          style={{ overflow: "visible" }}
        >
          <GlassSurface
            backgroundOpacity={0.1}
            blueOffset={20}
            blur={11}
            borderRadius={12}
            borderWidth={0.01}
            brightness={50}
            className="md:my-9 max-md:my-5 !flex !flex-row !items-center !gap-3 isolate overflow-visible p-2 px-4 max-md:mx-2"
            displace={0.5}
            distortionScale={-180}
            forceLightMode={true}
            greenOffset={10}
            height="auto"
            opacity={0.93}
            redOffset={0}
            saturation={1}
            style={{
              animation: "trustBadgeUp 0.5s ease-out forwards",
              animationDelay: "0.1s",
              opacity: 0,
              transform: "translateY(20px) scale(0.95)",
            }}
            width="auto"
          >
            <p className="badge-text relative z-10 max-md:text-xs uppercase font-semibold tracking-wider">
              CONCEPTS
            </p>
          </GlassSurface>

          <div className="relative z-10 w-full">
            <h1 className="hero-header text-center">
              Ideas worth building.{" "}
              <span className="text-[#FF5B04]">Thought through first.</span>
            </h1>
          </div>

          <p className="sub-header text-[#11181C] text-center max-w-2xl mb-0">
            How we think, not a list of services. For each concept we did the
            work a technical co-founder would do before writing code: who has
            the problem, where existing tools fall short, what we&apos;d build
            in what order, and what it takes to make it production-ready. None
            of these are shipped client work, they&apos;re where we point our
            own thinking.
          </p>
        </div>
      </div>

      {/* Prototype vs production */}
      <section className="section-container pt-4 max-md:pt-2 pb-12 max-md:pb-8">
        <SectionHeading
          eyebrow="Read this first"
          text="Prototype it yourself, we encourage it. Just know what separates a demo from something real customers can depend on."
          title="A demo is not a product"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-gray-200/70 bg-white p-8 max-md:p-6">
            <p className="text-[11px] font-jetbrains-mono uppercase tracking-[0.18em] text-gray-500 mb-3">
              You can prototype this yourself
            </p>
            <ul className="space-y-2.5">
              {PROTOTYPE_POINTS.map((point) => (
                <li
                  key={point}
                  className="flex gap-3 text-sm text-gray-700 leading-relaxed"
                >
                  <span className="text-gray-400">+</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-gradient-to-br from-[#212121] to-[#151514] noise-texture p-8 max-md:p-6">
            <p className="text-[11px] font-jetbrains-mono uppercase tracking-[0.18em] text-[#FF5B04] mb-3">
              Production needs
            </p>
            <ul className="space-y-2.5">
              {PRODUCTION_POINTS.map((point) => (
                <li
                  key={point}
                  className="flex gap-3 text-sm text-gray-300 leading-relaxed"
                >
                  <span className="text-[#FF5B04]">→</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="section-container pt-4 max-md:pt-2">
        <div className="autoShow max-w-xl mx-auto mb-12 max-md:mb-8">
          <div className="relative">
            <input
              className="w-full px-5 py-3.5 pl-12 rounded-full border-2 border-gray-200 focus:border-[#FF5B04] focus:outline-none transition-colors duration-300 text-sm bg-white shadow-sm"
              placeholder="Search by industry, problem, or technology..."
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

        {nothingFound && (
          <div className="text-center py-20 max-md:py-16">
            <p className="text-gray-500 text-lg max-md:text-base mb-2 font-semibold">
              No matching concepts found
            </p>
            <p className="text-gray-500 text-sm">Try a different search term</p>
          </div>
        )}

        {filteredFeatured.length > 0 && (
          <div className="mb-16 max-md:mb-12">
            <SectionHeading
              eyebrow="Start here"
              text="The problems where we see the clearest demand right now."
              title="Featured concepts"
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredFeatured.map((c, i) => (
                <ConceptCard key={c.slug} card={c} index={i} />
              ))}
            </div>
          </div>
        )}

        {filteredMore.length > 0 && (
          <div className="mb-16 max-md:mb-12">
            <SectionHeading
              eyebrow="More concepts"
              text="Narrower niches or longer sales cycles, with technical problems that are just as real."
              title="Specialist ideas"
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredMore.map((c, i) => (
                <ConceptCard key={c.slug} card={c} index={i} />
              ))}
            </div>
          </div>
        )}

        {filteredEarlier.length > 0 && (
          <div className="mb-8">
            <SectionHeading
              eyebrow="Archive"
              title="Earlier proposals"
              text="Proposals written for prospective clients, shared so the thinking isn't wasted."
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredEarlier.map((c, i) => (
                <ConceptCard key={c.slug} card={c} index={i} />
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="section-container pt-4 pb-4">
        <SectionHeading
          eyebrow="Why we can build these"
          text="We build products like this for ourselves too. These are in active development, shown as proof of what we can build, not as finished products to resell."
          title="Built on systems we run ourselves"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PRODUCT_PROOF.map((p) => (
            <Link
              key={p.name}
              className="group rounded-2xl border border-gray-200/70 bg-white p-6 hover:border-gray-300 hover:shadow-md transition-all"
              href="/products"
            >
              <p className="text-[10px] font-jetbrains-mono uppercase tracking-[0.15em] text-gray-400 mb-2">
                In active development
              </p>
              <h3 className="font-bold text-gray-900 mb-1 group-hover:text-[#FF5B04] transition-colors">
                {p.name}
              </h3>
              <p className="text-sm text-gray-600">{p.role}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-container pt-16 pb-16 max-md:pt-10">
        <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-[#212121] to-[#151514] noise-texture px-12 py-20 max-md:px-6 max-md:py-12 text-center">
          <p className="text-[11px] font-jetbrains-mono uppercase tracking-[0.18em] text-[#FF5B04] mb-3">
            Have an idea you&apos;re validating?
          </p>
          <h2 className="text-4xl max-md:text-2xl font-bold text-white mb-4">
            Bring your prototype
          </h2>
          <p className="text-gray-500 font-medium text-base max-md:text-sm max-w-2xl mx-auto mb-8 max-md:mb-6">
            A half-formed idea, a working demo, or a full spec. We&apos;ll tell
            you honestly what&apos;s worth building first and what you can
            safely keep doing yourself. Typical response under 2 hours.
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
