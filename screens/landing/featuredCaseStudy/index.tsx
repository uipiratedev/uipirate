"use client";

import GlassBadge from "@/components/GlassBadge";
import LetsTalkButton from "@/components/LetsTalkButton";
import { Parallax, Reveal, Tilt } from "@/components/motion";

export interface FeaturedCaseStudyData {
  slug: string;
  client: string;
  title: string;
  excerpt?: string;
  heroImage: string;
  highlights?: string[];
  clientLogo?: string;
  metricLabel?: string;
  metricValue?: string;
  industry?: string;
}

interface FeaturedCaseStudyProps {
  study: FeaturedCaseStudyData | null;
}

// A single real case study, told as a story rather than a metric tile.
// Renders nothing if no CMS case study with a hero image is available.
const FeaturedCaseStudy = ({ study }: FeaturedCaseStudyProps) => {
  if (!study) return null;

  return (
    <div className="section-container">
      <Reveal
        className="relative overflow-hidden rounded-[20px] border border-2 border-gray-200/80 bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] sm:rounded-[20px] dark:border-white/10 dark:bg-[#141414] dark:shadow-none"
        scrub={false}
        variant="fade"
      >
        {/* Subtle peachy ambient glow in the top-left corner of the card.
            Hidden on mobile — a full-viewport-scale blur filter is costly
            and can haze the card on low-end devices. */}
        <div className="pointer-events-none absolute -left-10 -top-10 hidden h-52 w-72 rounded-full bg-brand-orange/20 blur-[70px] md:block dark:bg-brand-orange/15" />

        <Tilt
          className="relative z-10 flex flex-col lg:flex-row lg:items-stretch"
          lift={0}
          max={4}
        >
          {/* Left Side Content - 50% width */}
          <div className="relative z-10 w-full shrink-0 text-left lg:w-1/2 p-6 sm:p-10 lg:p-12 xl:p-14 flex flex-col justify-between">
            <div>
              <div className="relative mb-6 flex items-center justify-between gap-4">
                <GlassBadge variant="gradient">FEATURED CASE STUDY</GlassBadge>
                {study.clientLogo && (
                  <img
                    alt={`${study.client} logo`}
                    className="h-7 sm:h-8 w-auto shrink-0 object-contain dark:brightness-0 dark:invert"
                    src={study.clientLogo}
                  />
                )}
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-[32px] lg:leading-[1.25] dark:text-white">
                {study.title}
              </h2>

              {study.excerpt && (
                <p className="mt-4 text-[15px] sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
                  {study.excerpt}
                </p>
              )}

              {study.highlights && study.highlights.length > 0 && (
                <ul className="mt-6 flex flex-col gap-3">
                  {study.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="flex items-center gap-3 text-[15px] sm:text-base font-medium text-slate-900 dark:text-slate-100"
                    >
                      <span
                        aria-hidden="true"
                        className="text-brand-orange text-base font-bold"
                      >
                        <i className="ti ti-arrow-right" />
                      </span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-8">
              <LetsTalkButton
                href={`/case-studies/${study.slug}`}
                showArrow={true}
                variant="color"
              >
                Read the full case study
              </LetsTalkButton>
            </div>
          </div>

          {/* Right Side Image - 50% width, seamless blend */}
          <div className="relative flex min-h-[340px] w-full items-center justify-end self-stretch overflow-hidden sm:min-h-[420px] lg:min-h-full lg:w-1/2">
            <Parallax className="h-full w-full" speed={0.08}>
              {/* slight overscale so the parallax shift never reveals an edge */}
              <img
                alt={`${study.client} — ${study.title}`}
                className="h-full w-full scale-[1.12] select-none object-cover object-left"
                loading="lazy"
                src={study.heroImage}
              />
            </Parallax>
          </div>
        </Tilt>
      </Reveal>
    </div>
  );
};

export default FeaturedCaseStudy;
