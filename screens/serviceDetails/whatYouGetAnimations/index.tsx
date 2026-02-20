"use client";
import Image from "next/image";
import GlassBadge from "@/components/GlassBadge";
import { ContainerScroll } from "@/components/container-scroll-animation";

interface FeatureCardProps {
  heading: string;
  description: string;
  image?: string;
  index?: number;
}

const WhatYouGetCard = ({
  heading,
  description,
  image,
  index = 0,
}: FeatureCardProps) => {
  return (
    <div className="relative flex flex-col h-[290px] md:h-[360px] rounded-[20px] overflow-hidden bg-white border border-[#E5E7EB] shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
      {/* Image area */}
      {image && (
        <div className="flex-1 flex items-center justify-center bg-[#F8F9FB] px-6 pt-6">
          <div className="relative w-[55%] h-[70%]">
            <Image
              src={image}
              alt={heading}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="px-5 py-4 md:px-6 md:py-5">
        <h3 className="text-[16px] md:text-[22px] font-semibold text-[#0F172A] leading-snug tracking-tight">
          {heading}
        </h3>
        <p className="mt-1.5 text-[12px] md:text-[13px] text-[#64748B] leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

const WhatYouGetAnimations = ({ data }: any) => {
  return (
    <section className="overflow-hidden">
      {/* Cards grid with ContainerScroll */}
      <ContainerScroll
        titleComponent={
          <>
            <div className="autoShow text-center mb-10 md:mb-8">
              <div className="flex items-center justify-center mb-6">
                <GlassBadge variant="gradient">{data.badge}</GlassBadge>
              </div>
              <h2 className="heading-center">{data.heading}</h2>
            </div>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 autoShow">
          {data.card.map((feature: any, i: number) => (
            <WhatYouGetCard key={feature.heading} {...feature} index={i} />
          ))}
        </div>
      </ContainerScroll>
    </section>
  );
};

export default WhatYouGetAnimations;

