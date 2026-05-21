import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import caseStudies from "@/data/case-studies.json";

interface PageProps {
  params: { slug: string };
}

function getStudy(slug: string) {
  return caseStudies.find((s) => s.slug === slug);
}

export function generateStaticParams() {
  return caseStudies.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const study = getStudy(params.slug);
  if (!study) {
    return { title: "Case Study Not Found | UI Pirate" };
  }

  const url = `https://uipirate.com/case-studies/${study.slug}`;

  return {
    title: `${study.title} | Case Study | UI Pirate`,
    description: study.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: study.title,
      description: study.excerpt,
      url,
      type: "article",
      images: study.heroImage
        ? [{ url: study.heroImage, alt: study.title }]
        : undefined,
    },
  };
}

export default function CaseStudyDetailPage({ params }: PageProps) {
  const study = getStudy(params.slug);
  if (!study) notFound();

  const caseStudySchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: study.title,
    description: study.excerpt,
    image: study.heroImage,
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
    about: {
      "@type": "Organization",
      name: study.client,
    },
  };

  return (
    <article className="bg-[#fafafa] min-h-screen pt-24 max-md:pt-20 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseStudySchema) }}
      />

      <div className="container mx-auto px-8 max-md:px-4 max-w-4xl">
        <Link
          href="/case-studies"
          className="text-sm text-gray-500 hover:text-[#FF5B04] mb-8 inline-block"
        >
          ← All case studies
        </Link>

        <p className="text-[11px] font-jetbrains-mono uppercase tracking-[0.18em] text-[#FF5B04] mb-3">
          {study.industry} · {study.region}
        </p>
        <h1 className="text-4xl max-md:text-3xl font-bold text-gray-900 mb-4 tracking-tight">
          {study.title}
        </h1>
        <p className="text-lg text-gray-600 mb-10 leading-relaxed">{study.excerpt}</p>

        {study.heroImage && (
          <div className="mb-12 rounded-2xl border border-gray-200 bg-white p-8 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={study.heroImage}
              alt={study.client}
              className="max-h-24 w-auto object-contain"
            />
          </div>
        )}

        <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4 mb-12">
          {study.metrics.map((m) => (
            <div
              key={m.label}
              className="bg-white border border-gray-200 rounded-xl p-5"
            >
              <p className="text-xs text-gray-400 uppercase tracking-wide">{m.label}</p>
              <p className="text-lg font-semibold text-gray-900 mt-1">{m.value}</p>
            </div>
          ))}
        </div>

        {(["problem", "approach", "solution", "results"] as const).map((key) => (
          <section key={key} className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 capitalize mb-3">{key}</h2>
            <p className="text-gray-600 leading-relaxed">{study[key]}</p>
          </section>
        ))}

        {study.testimonial && (
          <blockquote className="border-l-4 border-[#FF5B04] pl-6 py-2 my-12 bg-white rounded-r-xl">
            <p className="text-gray-700 italic">&ldquo;{study.testimonial.quote}&rdquo;</p>
            <footer className="text-sm text-gray-500 mt-3">— {study.testimonial.author}</footer>
          </blockquote>
        )}

        <div className="flex flex-wrap gap-2 mb-12">
          {study.technologies.map((tech) => (
            <span
              key={tech}
              className="text-xs font-jetbrains-mono px-3 py-1 rounded-full bg-gray-900 text-white"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="bg-gray-900 text-white rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">Want similar results?</h2>
          <p className="text-gray-300 mb-6 text-sm">
            Share your product idea — we handle product thinking, design, and Angular/React build.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-[#FF5B04] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#ff6b1e] transition-colors"
          >
            Tell us about your product
          </Link>
        </div>
      </div>
    </article>
  );
}
