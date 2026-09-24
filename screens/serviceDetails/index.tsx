"use client";

import Link from "next/link";
import { notFound } from "next/navigation";

import ServiceDetailsHero from "./hero";
import StreamlinedProcess from "./streamlinedProcess";
import WhoThisIsFor from "./whoThisIsFor";
import RecommendedNextSteps from "./recommendedNextSteps";
import WhyThisMatters from "./whyThisMatters";
import WhatYouGetAnimations from "./whatYouGetAnimations";
import WhatYouGain from "./whatYouGain";

import PageWrapper from "@/components/PageWrapper";
import { Reveal } from "@/components/motion";

// Per-service images — keyed by normalized slug
const SERVICE_IMAGE: Record<string, string> = {
  "ux-ui-design":
    "https://res.cloudinary.com/dvk9ttiym/image/upload/v1789369607/ui_uxdesign_hzqdia.svg",
  "ux-audits-consultation":
    "https://res.cloudinary.com/dvk9ttiym/image/upload/v1789369608/uxaudit_yc9hfj.svg",
  "saas-ai-development":
    "https://res.cloudinary.com/dvk9ttiym/image/upload/v1789369607/saasai_pgbj2d.svg",
  "landing-pages-business-websites":
    "https://res.cloudinary.com/dvk9ttiym/image/upload/v1789369606/landing_hbsqbz.svg",
};

// Per-service case study links — update each slug/link as needed
const SERVICE_CASE_STUDY: Record<string, string> = {
  "ux-ui-design": "/case-studies/designing-sarge-law-enforcement-software",
  "ux-audits-consultation": "",
  "saas-ai-development": "/case-studies/ai-knowledge-management-platform-redesign",
  "landing-pages-business-websites": "",
};

const normalizeSlug = (str: string) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const ServiceDetails = ({ data, slug }: { data: any; slug?: string }) => {
  if (!data) notFound();

  const normalizedSlug = slug ? normalizeSlug(slug) : "";
  const serviceImage = normalizedSlug ? SERVICE_IMAGE[normalizedSlug] : undefined;
  const caseStudyLink = normalizedSlug ? SERVICE_CASE_STUDY[normalizedSlug] : undefined;

  return (
    <PageWrapper showFloatingButton={false}>
      {/* One vertical rhythm for the whole page — identical to the landing
          page's wrapper. Each section owns its own `.section-container`;
          nothing here adds per-section padding or margin. */}
      <div className="space-y-20 max-md:space-y-16">
        {data.hero && <ServiceDetailsHero data={data.hero} />}

        {data.whatYouGet && <WhatYouGetAnimations data={data.whatYouGet} />}

        {data.whyThisMatters && <WhyThisMatters data={data.whyThisMatters} />}

        {data.streamlinedProcess && (
          <StreamlinedProcess data={data.streamlinedProcess} />
        )}

        {data.whatYouGain && <WhatYouGain data={data.whatYouGain} />}

        {/* Service preview image */}
        {serviceImage && (
          <section className="section-container">
            <Reveal variant="fade" scrub={false}>
              {caseStudyLink ? (
                <Link
                  href={caseStudyLink}
                  className="block group overflow-hidden rounded-[36px] transition-all duration-300"
                >
                  <img
                    alt="Service preview"
                    className="w-full h-auto select-none border border-gray-200 rounded-[36px] transition-transform duration-300 group-hover:scale-[1.01]"
                    loading="lazy"
                    src={serviceImage}
                  />
                </Link>
              ) : (
                <img
                  alt="Service preview"
                  className="w-full h-auto select-none border border-gray-200 rounded-[36px]"
                  loading="lazy"
                  src={serviceImage}
                />
              )}
            </Reveal>
          </section>
        )}

        {data.whoThisIsFor && <WhoThisIsFor data={data.whoThisIsFor} />}

        {data.recommendedNextSteps && (
          <RecommendedNextSteps data={data.recommendedNextSteps} />
        )}
      </div>
    </PageWrapper>
  );
};

export default ServiceDetails;
