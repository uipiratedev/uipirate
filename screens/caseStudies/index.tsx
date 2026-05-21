import Link from "next/link";

import caseStudies from "@/data/case-studies.json";

const CaseStudies = () => {
  return (
    <div className="min-h-screen bg-[#fafafa] pt-24 max-md:pt-20 pb-20">
      <div className="container mx-auto px-8 max-md:px-4 max-w-5xl">
        <p className="text-[11px] font-jetbrains-mono uppercase tracking-[0.18em] text-[#FF5B04] mb-3 text-center">
          Case studies
        </p>
        <h1 className="text-4xl max-md:text-3xl font-bold text-gray-900 text-center mb-4">
          Product design & development in practice
        </h1>
        <p className="text-gray-500 text-center max-w-2xl mx-auto mb-14">
          Deep dives into how we turn ideas into shipped products — from product thinking and IA
          to UX/UI and Angular/React development.
        </p>

        <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-8">
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

        <p className="text-center text-sm text-gray-400 mt-12">
          More case studies coming soon —{" "}
          <Link href="/ourWorks" className="text-[#FF5B04] hover:underline">
            view our portfolio
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CaseStudies;
