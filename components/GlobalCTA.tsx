import Link from "next/link";

/**
 * GlobalCTA — contextual call-to-action banner shown at the bottom of blog posts and service pages.
 * Drives readers toward the contact / estimate flow.
 */
export default function GlobalCTA({ topic }: { topic?: string } = {}) {
  const headingText = topic
    ? `Struggling with ${topic}? Let's talk about your product.`
    : "Let's Build It Together";

  return (
    <section className="container mx-auto xl:px-40 2xl:px-48 max-xl:px-4 max-2xl:px-0 mb-16 mt-8">
      <div className="relative rounded-[28px] bg-gray-900 overflow-hidden px-10 py-12 max-md:px-6 max-md:py-8 flex flex-col md:flex-row items-center gap-8 shadow-2xl">
        {/* Background accent */}
        <div
          aria-hidden="true"
          className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-[#FF5B04] opacity-10 blur-3xl pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full bg-[#FF5B04] opacity-5 blur-2xl pointer-events-none"
        />

        {/* Text */}
        <div className="flex-1 relative z-10">
          <p className="text-[11px] font-jetbrains-mono uppercase tracking-[0.18em] text-[#FF5B04] mb-3">
            {topic ? "Personalized Help" : "Need Help With This?"}
          </p>
          <h3 className="text-2xl max-md:text-xl font-bold text-white mb-2 leading-snug">
            {headingText}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed max-w-md">
            UI Pirate is a product design & development agency trusted by 50+
            SaaS founders and enterprise teams across the US, UK & beyond. Tell
            us what you need.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 relative z-10 flex-shrink-0">
          <Link
            className="px-6 py-3 rounded-xl bg-[#FF5B04] text-white text-sm font-semibold hover:bg-[#e04e00] transition-colors text-center whitespace-nowrap"
            href="/contact"
            id="global-cta-contact"
          >
            Get a Free Estimate →
          </Link>
          <Link
            className="px-6 py-3 rounded-xl bg-white/10 text-white text-sm font-semibold hover:bg-white/20 transition-colors text-center whitespace-nowrap"
            href="/case-studies"
            id="global-cta-works"
          >
            See Our Work
          </Link>
        </div>
      </div>
    </section>
  );
}
