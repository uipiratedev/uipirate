import Link from "next/link";

import { CONCEPTS } from "../data";
import { CONCEPT_DETAILS } from "../details";

interface ConceptsTeaserProps {
  heading?: string;
  text?: string;
}

// Only concepts with a built-in write-up are linked, so a teaser never points
// at a page that 404s.
const ConceptsTeaser = ({
  heading = "Product concepts we would build",
  text = "Worked-out plans for AI products: the problem, the market, the stack and how we would take it to production.",
}: ConceptsTeaserProps) => {
  const cards = CONCEPTS.filter((c) => CONCEPT_DETAILS[c.slug]);

  if (!cards.length) return null;

  return (
    <section className="section-container">
      <div className="mb-8 max-md:mb-6">
        <p className="text-[11px] font-jetbrains-mono uppercase tracking-[0.18em] text-[#FF5B04] mb-2">
          Concepts &amp; proposals
        </p>
        <h2 className="text-3xl max-md:text-2xl font-bold text-gray-900 mb-2">
          {heading}
        </h2>
        <p className="text-gray-600 max-w-2xl">{text}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((c) => (
          <Link
            key={c.slug}
            className="group rounded-2xl border border-gray-200/70 bg-white p-6 hover:shadow-xl hover:border-gray-300 transition-all duration-300"
            href={`/concepts/${c.slug}`}
          >
            <p className="text-[10px] font-jetbrains-mono uppercase tracking-[0.15em] text-gray-500 mb-2">
              {c.industry}
            </p>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{c.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              {c.problem}
            </p>
            <span className="text-sm font-semibold text-[#FF5B04]">
              Read the concept →
            </span>
          </Link>
        ))}
      </div>
      <div className="mt-6">
        <Link
          className="text-sm font-semibold text-gray-900 hover:text-[#FF5B04] transition-colors"
          href="/concepts"
        >
          All concepts →
        </Link>
      </div>
    </section>
  );
};

export default ConceptsTeaser;
