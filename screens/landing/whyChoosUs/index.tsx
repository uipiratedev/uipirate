import Image from "next/image";

import GlassBadge from "@/components/GlassBadge";
import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack";

const features = [
  {
    id: 1,
    title: "Simplifying SaaS Complexity",
    description:
      "We understand data-heavy workflows, permissions, onboarding, multi-roles, and enterprise behaviour patterns.",
    image:
      "https://res.cloudinary.com/dvk9ttiym/image/upload/v1772517931/Dashboard_V2_1_fct6cl.svg",
  },
  {
    id: 2,
    title: "Premium UI + Precise Handoff",
    description:
      "Documentation, tokens, spacing, states — developers love working with us.",
    image:
      "https://res.cloudinary.com/dvk9ttiym/image/upload/v1772517931/Dashboard_V2_1_fct6cl.svg",
  },
  {
    id: 3,
    title: "AI-First UX Expertise",
    description:
      "We design predictable, trustworthy AI interactions — prompt flows, confidence UI, output validation and more.",
    image:
      "https://res.cloudinary.com/dvk9ttiym/image/upload/v1772517931/Dashboard_V2_1_fct6cl.svg",
  },
  {
    id: 4,
    title: "Designs that scale & convert",
    description:
      "We deliver clean, documented systems that reduce dev effort by 30–40%.",
    image:
      "https://res.cloudinary.com/dvk9ttiym/image/upload/v1772517931/Dashboard_V2_1_fct6cl.svg",
  },
  {
    id: 5,
    title: "Fast & Structured Delivery",
    description:
      "Weekly milestones, clean communication, and consistent delivery make your product move 2× faster.",
    image:
      "https://res.cloudinary.com/dvk9ttiym/image/upload/v1772517931/Dashboard_V2_1_fct6cl.svg",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="w-full py-8 pb-0 min-h-screen section-container">
      <div className="mb-0">
        <div className="mb-6 flex flex-row items-center justify-center">
          <GlassBadge variant="gradient">WHY CHOOSE US</GlassBadge>
        </div>
        <h2 className="heading-center mb-10">
          Why SaaS & AI Teams{" "}
          <span className="text-brand-orange">Choose UI Pirate</span>?
        </h2>
      </div>

      <div className="w-full">
        <ScrollStack useWindowScroll={true}>
          <ScrollStackItem itemClassName="bg-[#1E1B4B] text-white">
            <div className="flex flex-row max-md:flex-col justify-between h-full items-center gap-6 max-md:gap-4">
              <div className="flex flex-col justify-between h-full w-[60%] max-md:w-full">
                <div className="flex flex-col h-full">
                  <h3 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 md:mb-4 tracking-tight leading-tight">
                    Simplifying SaaS Complexity
                  </h3>
                  <p className="text-sm sm:text-base md:text-base lg:text-lg opacity-90 leading-relaxed">
                    We understand data-heavy workflows, permissions, onboarding,
                    multi-roles, and enterprise behaviour patterns.
                  </p>
                </div>
                <p className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold max-md:absolute max-md:top-4 max-md:right-6">
                  1
                </p>
              </div>
              <div className="w-[38%] max-md:w-full flex items-center justify-center flex-shrink-0 mt-4 md:mt-0">
                <img
                  alt="Simplifying SaaS Complexity"
                  className="w-full max-w-[180px] sm:max-w-[210px] md:max-w-[240px] lg:max-w-[280px] h-auto max-h-[160px] sm:max-h-[190px] md:max-h-[220px] lg:max-h-[250px] object-contain drop-shadow-sm"
                  src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1772521662/dashboard_pgl0ez.gif"
                />
              </div>
            </div>
          </ScrollStackItem>

          <ScrollStackItem itemClassName="bg-[#111111] text-white">
            <div className="flex flex-row max-md:flex-col justify-between h-full items-center gap-6 max-md:gap-4">
              <div className="flex flex-col justify-between h-full w-[58%] max-md:w-full">
                <div className="flex flex-col h-full">
                  <h3 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 md:mb-4 tracking-tight leading-tight">
                    Premium UI + Precise Handoff
                  </h3>
                  <p className="text-sm sm:text-base md:text-base lg:text-lg opacity-90 leading-relaxed">
                    Documentation, tokens, spacing, states — developers love
                    working with us.
                  </p>
                </div>
                <p className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold max-md:absolute max-md:top-4 max-md:right-6">
                  2
                </p>
              </div>
              <div className="w-[38%] max-md:w-full flex items-center justify-center flex-shrink-0 mt-4 md:mt-0">
                <img
                  alt="Premium UI + Precise Handoff"
                  className="w-full max-w-[180px] sm:max-w-[210px] md:max-w-[240px] lg:max-w-[280px] h-auto max-h-[160px] sm:max-h-[190px] md:max-h-[220px] lg:max-h-[250px] object-contain drop-shadow-sm"
                  src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1772089531/8330154b778d772b061934e86daf7c528f835b5f_esonfn.gif"
                />
              </div>
            </div>
          </ScrollStackItem>

          <ScrollStackItem itemClassName="bg-[#2563EB] text-white">
            <div className="flex flex-row max-md:flex-col justify-between h-full items-center gap-6 max-md:gap-4">
              <div className="flex flex-col justify-between h-full w-[58%] max-md:w-full">
                <div className="flex flex-col h-full">
                  <h3 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 md:mb-4 tracking-tight leading-tight">
                    AI-First UX Expertise
                  </h3>
                  <p className="text-sm sm:text-base md:text-base lg:text-lg opacity-90 leading-relaxed">
                    We design predictable, trustworthy AI interactions — prompt
                    flows, confidence UI, output validation and more.
                  </p>
                </div>
                <p className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold max-md:absolute max-md:top-4 max-md:right-6">
                  3
                </p>
              </div>
              <div className="w-[38%] max-md:w-full flex items-center justify-center flex-shrink-0 mt-4 md:mt-0">
                <img
                  alt="AI-First UX Expertise"
                  className="w-full max-w-[180px] sm:max-w-[210px] md:max-w-[240px] lg:max-w-[280px] h-auto max-h-[160px] sm:max-h-[190px] md:max-h-[220px] lg:max-h-[250px] object-contain drop-shadow-sm"
                  src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1772089532/a8881425d16e3562d9d18ab0cce3acb904bd1f0e_n0dvqj.gif"
                />
              </div>
            </div>
          </ScrollStackItem>

          <ScrollStackItem itemClassName="bg-[#E40063] text-white">
            <div className="flex flex-row max-md:flex-col justify-between h-full items-center gap-6 max-md:gap-4">
              <div className="flex flex-col justify-between h-full w-[58%] max-md:w-full">
                <div className="flex flex-col h-full">
                  <h3 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 md:mb-4 tracking-tight leading-tight">
                    Designs that scale & convert
                  </h3>
                  <p className="text-sm sm:text-base md:text-base lg:text-lg opacity-90 leading-relaxed">
                    We deliver clean, documented systems that reduce dev effort
                    by 30–40%.
                  </p>
                </div>
                <p className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold max-md:absolute max-md:top-4 max-md:right-6">
                  4
                </p>
              </div>
              <div className="w-[38%] max-md:w-full flex items-center justify-center flex-shrink-0 mt-4 md:mt-0">
                <img
                  alt="Designs that scale & convert"
                  className="w-full max-w-[180px] sm:max-w-[210px] md:max-w-[240px] lg:max-w-[280px] h-auto max-h-[160px] sm:max-h-[190px] md:max-h-[220px] lg:max-h-[250px] object-contain drop-shadow-sm"
                  src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1772089531/0287988b27a45e56730a9b65e9ebab48b65f7c88_cmxya1.gif"
                />
              </div>
            </div>
          </ScrollStackItem>

          <ScrollStackItem itemClassName="bg-[#FF5B04] text-white">
            <div className="flex flex-row max-md:flex-col justify-between h-full items-center gap-6 max-md:gap-4">
              <div className="flex flex-col justify-between h-full w-[58%] max-md:w-full">
                <div className="flex flex-col h-full">
                  <h3 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 md:mb-4 tracking-tight leading-tight">
                    Fast & Structured Delivery
                  </h3>
                  <p className="text-sm sm:text-base md:text-base lg:text-lg opacity-90 leading-relaxed">
                    Weekly milestones, clean communication, and consistent
                    delivery make your product move 2× faster.
                  </p>
                </div>
                <p className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold max-md:absolute max-md:top-4 max-md:right-6">
                  5
                </p>
              </div>
              <div className="w-[38%] max-md:w-full flex items-center justify-center flex-shrink-0 mt-4 md:mt-0">
                <img
                  alt="Fast & Structured Delivery"
                  className="w-full max-w-[180px] sm:max-w-[210px] md:max-w-[240px] lg:max-w-[280px] h-auto max-h-[160px] sm:max-h-[190px] md:max-h-[220px] lg:max-h-[250px] object-contain drop-shadow-sm"
                  src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1772089531/88d4d7ae4f6a15a6dc9f1791b88b2147069cb230_zs7x5t.gif"
                />
              </div>
            </div>
          </ScrollStackItem>
        </ScrollStack>
      </div>
    </section>
  );
};

export default WhyChooseUs;
