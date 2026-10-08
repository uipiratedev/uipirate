import Link from "next/link";

/**
 * Shown at the end of every article.
 *
 * Readers of the design-tokens post spend ~4 minutes on it and then leave:
 * 0.94 pages per session, no click to any other page. The article persuades
 * and then offers nothing to do next. The two links carry explicit
 * `data-analytics-id`s so their performance reads as its own series in the
 * Funnel screen, independent of the wording.
 *
 * Server component — no client JS, no effect on the cached HTML's weight to
 * speak of.
 */
export default function ArticleCta() {
  return (
    <section className="container mx-auto xl:px-32 2xl:px-40 max-xl:px-8 max-md:px-4 pb-4">
      <div
        className="rounded-3xl border border-[#111]/10 bg-[#111] px-6 py-9 text-white md:px-12 md:py-12"
        data-section="article-cta"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#FF5B04]">
          Working on something similar?
        </p>
        <h2 className="mt-3 max-w-2xl text-[24px] font-[700] leading-tight tracking-tight md:text-[32px]">
          We design and build products like this for SaaS teams.
        </h2>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/70">
          Tell us what you are building and we will tell you honestly how we
          would approach it — no deck, no obligation.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            className="inline-flex items-center rounded-full bg-[#FF5B04] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
            data-analytics-id="cta-article-contact"
            href="/contact"
          >
            Start a conversation
          </Link>
          <a
            className="inline-flex items-center rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            data-analytics-id="cta-article-book-call"
            href="https://cal.com/ui-pirate/15min"
            rel="noopener noreferrer"
            target="_blank"
          >
            Book a 15-min call
          </a>
        </div>
      </div>
    </section>
  );
}
