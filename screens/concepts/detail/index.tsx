import Link from "next/link";

import PageWrapper from "@/components/PageWrapper";

import { CONCEPTS } from "../data";
import { CONCEPT_DETAILS } from "../details";
import type { ConceptDetail } from "../details";

interface ConceptDetailScreenProps {
  detail: ConceptDetail;
}

const SectionTitle = ({
  eyebrow,
  title,
  id,
}: {
  eyebrow: string;
  title: string;
  id: string;
}) => (
  <div className="mb-8 max-md:mb-6 scroll-mt-28" id={id}>
    <p className="text-[11px] font-jetbrains-mono uppercase tracking-[0.18em] text-[#FF5B04] mb-2">
      {eyebrow}
    </p>
    <h2 className="text-3xl max-md:text-2xl font-bold text-gray-900">{title}</h2>
  </div>
);

const NAV_ITEMS = [
  { id: "problem", label: "Problem" },
  { id: "market", label: "Market" },
  { id: "solution", label: "Solution" },
  { id: "how-it-works", label: "How it works" },
  { id: "stack", label: "Tech stack" },
  { id: "production", label: "Production" },
  { id: "approach", label: "Our approach" },
  { id: "faq", label: "FAQ" },
];

const ConceptDetailScreen = ({ detail }: ConceptDetailScreenProps) => {
  const entry = CONCEPTS.find((c) => c.slug === detail.slug);
  const url = `https://uipirate.com/concepts/${detail.slug}`;

  const related = detail.related
    .map((slug) => CONCEPTS.find((c) => c.slug === slug))
    .filter((c): c is NonNullable<typeof c> => !!c);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: detail.headline,
    description: detail.metaDescription,
    url,
    mainEntityOfPage: url,
    author: {
      "@type": "Organization",
      name: "UI Pirate by Vishal Anand",
      url: "https://uipirate.com",
    },
    publisher: {
      "@type": "Organization",
      name: "UI Pirate by Vishal Anand",
      url: "https://uipirate.com",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: detail.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://uipirate.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Concepts",
        item: "https://uipirate.com/concepts",
      },
      { "@type": "ListItem", position: 3, name: detail.headline, item: url },
    ],
  };

  return (
    <PageWrapper showFloatingButton={false}>
      {[articleSchema, faqSchema, breadcrumbSchema].map((schema, i) => (
        <script
          key={i}
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          type="application/ld+json"
        />
      ))}

      {/* Hero */}
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
        <div className="flex flex-col items-center justify-center w-full relative z-10 section-container pb-16 max-md:pb-10 pt-10">
          <Link
            className="text-sm text-gray-500 hover:text-[#FF5B04] transition-colors mb-6"
            href="/concepts"
          >
            ← All concepts
          </Link>
          {entry && (
            <p className="text-[11px] font-jetbrains-mono uppercase tracking-[0.18em] text-[#FF5B04] mb-4">
              {entry.industry}
            </p>
          )}
          <h1 className="hero-header text-center">{detail.headline}</h1>
          <p className="sub-header text-[#11181C] text-center max-w-2xl mb-8">
            {detail.subhead}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              className="px-8 py-4 bg-[#FF5B04] text-white font-bold rounded-full hover:bg-[#e04e00] transition-all duration-300 shadow-lg hover:shadow-xl text-center"
              href="/contact"
            >
              Bring your prototype →
            </Link>
            <a
              className="px-8 py-4 bg-white text-gray-900 font-bold rounded-full border border-gray-200 hover:border-gray-300 transition-all duration-300 text-center"
              href="#how-it-works"
            >
              See how it works
            </a>
          </div>
        </div>
      </div>

      {/* At a glance */}
      <section className="section-container pb-12 max-md:pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-gray-200/70 bg-white p-6">
            <p className="text-[10px] font-jetbrains-mono uppercase tracking-[0.15em] text-gray-500 mb-2">
              Who it is for
            </p>
            <p className="text-sm text-gray-800 leading-relaxed">
              {detail.persona}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200/70 bg-white p-6">
            <p className="text-[10px] font-jetbrains-mono uppercase tracking-[0.15em] text-gray-500 mb-2">
              First working version
            </p>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {entry?.timeline}
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              A planning estimate, firmed up once we see your real stack.
            </p>
          </div>
          {detail.foundation && (
            <div className="rounded-2xl border border-gray-200/70 bg-white p-6">
              <p className="text-[10px] font-jetbrains-mono uppercase tracking-[0.15em] text-gray-500 mb-2">
                Foundation we would extend
              </p>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {detail.foundation.name}
              </p>
              <p className="text-xs text-gray-500 leading-relaxed">
                {detail.foundation.note}{" "}
                <Link
                  className="text-[#FF5B04] font-semibold"
                  href={detail.foundation.href}
                >
                  See our products
                </Link>
              </p>
            </div>
          )}
        </div>
      </section>

      <div className="section-container">
        <div className="lg:grid lg:grid-cols-[200px_1fr] lg:gap-12">
          {/* Sticky nav */}
          <nav
            aria-label="On this page"
            className="hidden lg:block sticky top-28 self-start"
          >
            <p className="text-[10px] font-jetbrains-mono uppercase tracking-[0.15em] text-gray-500 mb-3">
              On this page
            </p>
            <ul className="space-y-2 border-l border-gray-200">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <a
                    className="block pl-4 text-sm text-gray-600 hover:text-[#FF5B04] transition-colors"
                    href={`#${item.id}`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <Link
              className="mt-6 block px-4 py-3 bg-[#FF5B04] text-white text-sm font-bold rounded-full hover:bg-[#e04e00] transition-colors text-center"
              href="/contact"
            >
              Start a Conversation →
            </Link>
          </nav>

          <div className="min-w-0">
            {/* Problem */}
            <section className="mb-16 max-md:mb-12">
              <SectionTitle eyebrow="The problem" id="problem" title="Who has this problem, and why it matters" />
              <div className="space-y-4 max-w-3xl">
                {detail.problem.map((p) => (
                  <p key={p} className="text-gray-700 leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            </section>

            {/* Market */}
            <section className="mb-16 max-md:mb-12">
              <SectionTitle eyebrow="Market" id="market" title="Where existing tools stop" />
              <div className="space-y-4 max-w-3xl">
                {detail.market.map((p) => (
                  <p key={p} className="text-gray-700 leading-relaxed">
                    {p}
                  </p>
                ))}
                <p className="text-xs text-gray-500">
                  This is our read of the market, not a formal study.
                </p>
              </div>
            </section>

            {/* Solution */}
            <section className="mb-16 max-md:mb-12">
              <SectionTitle eyebrow="The solution" id="solution" title="What we would build, in order" />
              <ol className="space-y-4">
                {detail.phases.map((phase, i) => (
                  <li
                    key={phase.name}
                    className="flex gap-5 rounded-2xl border border-gray-200/70 bg-white p-6 max-md:p-5"
                  >
                    <span className="text-sm font-jetbrains-mono text-[#FF5B04] font-semibold pt-0.5">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">
                        {phase.name}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {phase.summary}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* How it works */}
            <section className="mb-16 max-md:mb-12">
              <SectionTitle eyebrow="Architecture" id="how-it-works" title="How it works, end to end" />
              <ol className="relative border-l-2 border-gray-200 ml-3 space-y-6 max-w-3xl">
                {detail.flow.map((step) => (
                  <li key={step.label} className="pl-6 relative">
                    <span className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full bg-white border-2 border-[#FF5B04]" />
                    <h3 className="font-bold text-gray-900">{step.label}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {step.detail}
                    </p>
                  </li>
                ))}
              </ol>
            </section>

            {/* Stack */}
            <section className="mb-16 max-md:mb-12">
              <SectionTitle eyebrow="Tech stack" id="stack" title="What we would use, and why" />
              <div className="overflow-hidden rounded-2xl border border-gray-200/70 bg-white">
                {detail.stack.map((row, i) => (
                  <div
                    key={row.layer}
                    className={`grid grid-cols-1 md:grid-cols-[160px_1fr_1.4fr] gap-1 md:gap-6 p-5 ${
                      i > 0 ? "border-t border-gray-200/70" : ""
                    }`}
                  >
                    <p className="text-[11px] font-jetbrains-mono uppercase tracking-[0.12em] text-gray-500 pt-0.5">
                      {row.layer}
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {row.choice}
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {row.why}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Prototype vs production */}
            <section className="mb-16 max-md:mb-12">
              <SectionTitle eyebrow="Prototype vs production" id="production" title="A demo is not a product" />
              <div className="grid grid-cols-1 gap-6">
                <div className="rounded-3xl border border-gray-200/70 bg-white p-8 max-md:p-6">
                  <p className="text-[11px] font-jetbrains-mono uppercase tracking-[0.18em] text-gray-500 mb-3">
                    You can prototype this yourself
                  </p>
                  <ul className="space-y-2.5">
                    {detail.prototype.map((point) => (
                      <li
                        key={point}
                        className="flex gap-3 text-sm text-gray-700 leading-relaxed"
                      >
                        <span className="text-gray-400">+</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm text-gray-500 mt-4">
                    We encourage it. A working prototype is the best way to
                    find out what you actually want.
                  </p>
                </div>

                <div className="rounded-3xl bg-gradient-to-br from-[#212121] to-[#151514] noise-texture p-8 max-md:p-6">
                  <p className="text-[11px] font-jetbrains-mono uppercase tracking-[0.18em] text-[#FF5B04] mb-5">
                    What production needs
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {detail.production.map((item) => (
                      <div key={item.title}>
                        <h3 className="text-white font-semibold text-sm mb-1">
                          {item.title}
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                          {item.why}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Approach */}
            <section className="mb-16 max-md:mb-12">
              <SectionTitle eyebrow="Our approach" id="approach" title="Where we would start" />
              <div className="space-y-4 max-w-3xl">
                {detail.approach.map((p) => (
                  <p key={p} className="text-gray-700 leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            </section>

            {/* FAQ */}
            <section className="mb-16 max-md:mb-12">
              <SectionTitle eyebrow="FAQ" id="faq" title="Common questions" />
              <div className="space-y-3 max-w-3xl">
                {detail.faqs.map((f) => (
                  <details
                    key={f.q}
                    className="group rounded-2xl border border-gray-200/70 bg-white p-5 open:shadow-sm"
                  >
                    <summary className="cursor-pointer list-none flex items-center justify-between gap-4 font-semibold text-gray-900">
                      {f.q}
                      <span className="text-[#FF5B04] transition-transform group-open:rotate-45 text-xl leading-none">
                        +
                      </span>
                    </summary>
                    <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                      {f.a}
                    </p>
                  </details>
                ))}
              </div>
            </section>

            {/* Related */}
            {related.length > 0 && (
              <section className="mb-16 max-md:mb-12">
                <SectionTitle eyebrow="Keep reading" id="related" title="Related concepts" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {related.map((r) => {
                    const live = !!CONCEPT_DETAILS[r.slug];
                    const cardClass =
                      "block h-full rounded-2xl border border-gray-200/70 bg-white p-6";

                    const inner = (
                      <>
                        <p className="text-[10px] font-jetbrains-mono uppercase tracking-[0.12em] text-gray-500 mb-2">
                          {r.industry}
                        </p>
                        <h3 className="font-bold text-gray-900 mb-1">
                          {r.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">{r.problem}</p>
                        {live ? (
                          <span className="text-sm font-bold text-[#FF5B04]">
                            Read concept →
                          </span>
                        ) : (
                          <span className="text-xs font-jetbrains-mono uppercase tracking-wider text-gray-400">
                            Write-up coming soon
                          </span>
                        )}
                      </>
                    );

                    return live ? (
                      <Link
                        key={r.slug}
                        className={`${cardClass} hover:border-gray-300 hover:shadow-md transition-all`}
                        href={`/concepts/${r.slug}`}
                      >
                        {inner}
                      </Link>
                    ) : (
                      <div key={r.slug} className={cardClass}>
                        {inner}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      {/* CTA */}
      <section className="section-container pt-4 pb-16">
        <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-[#212121] to-[#151514] noise-texture px-12 py-20 max-md:px-6 max-md:py-12 text-center">
          <p className="text-[11px] font-jetbrains-mono uppercase tracking-[0.18em] text-[#FF5B04] mb-3">
            Have something like this in mind?
          </p>
          <h2 className="text-4xl max-md:text-2xl font-bold text-white mb-4">
            Bring your prototype
          </h2>
          <p className="text-gray-400 font-medium text-base max-md:text-sm max-w-2xl mx-auto mb-8 max-md:mb-6">
            A half-formed idea, a working demo or a full spec. We will tell you
            honestly what is worth building first and what you can safely keep
            doing yourself. Typical response under 2 hours.
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
              href="/concepts"
            >
              All concepts
            </Link>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
};

export default ConceptDetailScreen;
