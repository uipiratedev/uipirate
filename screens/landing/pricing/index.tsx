"use client";

import { Card, CardBody } from "@heroui/react";

import PricingFlip from "../pricingFlip";

import SectionHeader from "@/components/SectionHeader";
import { Reveal, RevealGroup } from "@/components/motion";

const Pricing = () => {
  const benefits = [
    {
      icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1770115432/pause_nod3oq.svg",
      title: "PAUSE ANYTIME",
      description:
        "Pause your subscription anytime. No penalties, no lock-ins.",
    },
    {
      icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1770115432/share_ljjrs4.svg",
      title: "5-DAY PILOT PROJECT",
      description:
        "Test our execution quality before committing to a full engagement.",
    },
    {
      icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1770115432/value_jwko4r.svg",
      title: "LOW-RISK, HIGH-VALUE",
      description:
        "Pilot fee fully deductible from the final invoice if you move forward.",
    },
  ];

  return (
    <div className="section-container">
      <Reveal variant="up">
        <SectionHeader chip="PRICING">
          Transparent Pricing for{" "}
          <span className="text-brand-orange">SaaS Teams</span>{" "}
        </SectionHeader>
      </Reveal>

      <Reveal variant="up" distance="lg">
        <PricingFlip />
      </Reveal>

      {/* Benefits Section */}
      <RevealGroup className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
        {benefits.map((benefit, index) => (
          <Reveal key={index} variant="up">
            <Card className="h-full rounded-[20px] border-1 border-gray-200 bg-gradient-to-br from-[#EDEDED] via-[#FFFFFF] to-[#EDEDED] shadow-sm max-md:rounded-[12px]">
              <CardBody className="p-6 max-md:p-5">
                <h4 className="mb-3 flex items-center gap-2 font-mono text-xl font-bold tracking-wide max-md:text-center max-md:text-lg max-md:font-semibold">
                  <img
                    alt={benefit.title}
                    className="mb-1 h-4 w-4 max-md:h-6 max-md:w-6"
                    src={benefit.icon}
                  />{" "}
                  {benefit.title}
                </h4>
                <p className="font-jakarta text-sm leading-relaxed text-[#555555]">
                  {benefit.description}
                </p>
              </CardBody>
            </Card>
          </Reveal>
        ))}
      </RevealGroup>

      {/* Risk Reversal / Guarantee Section */}
      <Reveal
        className="mt-8 rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-6 text-center md:p-8"
        variant="up"
      >
        <div className="mb-3 flex items-center justify-center gap-3">
          <svg
            className="h-8 w-8 text-green-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h4 className="text-xl font-bold text-gray-900 md:text-2xl">
            100% Satisfaction Guarantee
          </h4>
        </div>
        <p className="mx-auto max-w-2xl text-sm leading-relaxed text-gray-600 md:text-base">
          Not happy with the first milestone? We&apos;ll refund your deposit, no
          questions asked. 100+ projects delivered for companies like Ipsos,
          Khaitan &amp; Co, and RevUp AI.
        </p>
      </Reveal>
    </div>
  );
};

export default Pricing;
