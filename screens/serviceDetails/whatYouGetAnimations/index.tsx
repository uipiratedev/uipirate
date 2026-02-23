"use client";
import Image from "next/image";
import GlassBadge from "@/components/GlassBadge";
import { ContainerScroll } from "@/components/container-scroll-animation";
import * as Visuals from "@/components/visuals";

const VISUAL_MAPPING: Record<string, any> = {
  // SaaS
  "UX/UI Design & Prototype": Visuals.VisualUX,
  "UI Development & Integration": Visuals.VisualCode,
  "Idea to MVP": Visuals.VisualMVP,
  "Mobile Optimization": Visuals.VisualMobile,
  // Landing
  "Landing Pages & Corporate Websites": Visuals.VisualLanding,
  "Design & Frontend Development": Visuals.VisualFrontend,
  "SEO Performance & AI-Readable Websites": Visuals.VisualSEO,
  "Fully Responsive Experience": Visuals.VisualResponsive,
  // Graphic
  "Brand & Marketing Visuals": Visuals.VisualBrand,
  "Website & Product Assets": Visuals.VisualWebsiteProduct,
  "Infographics & Newsletters": Visuals.VisualInfo,
  "Multi-Format Graphics": Visuals.VisualMulti,
  // Motion
  "Product UI Animations & Ads": Visuals.VisualUI,
  "Lottie & JSON Animations": Visuals.VisualLottie,
  "Website Motion & Interactions": Visuals.VisualWeb,
  "Developer-Ready Files": Visuals.VisualDev,
  // Audit
  "Heuristic UX Audit Report": Visuals.VisualAudit,
  "Drop-Off & Friction Insights": Visuals.VisualFriction,
  "Flow & Interaction Review": Visuals.VisualFlow,
  "Walkthrough Video": Visuals.VisualVideo,
  // 3D
  "Custom 3D Assets": Visuals.VisualAssets,
  "Web-Ready 3D Animations": Visuals.VisualAnimations,
  "3D Modeling & Animations": Visuals.VisualModeling,
  "Website & Product Integration": Visuals.VisualIntegration,
};

const WhatYouGetCard = ({
  heading,
  description,
  image,
  img,
}: any) => {
  const displayImage = image || img;
  const VisualComponent = VISUAL_MAPPING[heading];

  return (
    <div className="relative flex flex-col h-[290px] md:h-[360px] rounded-[20px] overflow-hidden bg-white border border-[#E5E7EB] shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
      {/* Image/Visual area */}
      <div className="flex-1 flex items-center justify-center bg-[#F8F9FB] overflow-hidden">
        {VisualComponent ? (
          <div className="w-full h-full">
            <VisualComponent />
          </div>
        ) : displayImage ? (
          <div className="relative w-[55%] h-[70%] pt-6">
            <Image
              src={displayImage}
              alt={heading}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
        ) : null}
      </div>

      {/* Content */}
      <div className="px-5 py-4 md:px-6 md:py-5 bg-white relative z-10">
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
                <GlassBadge variant="gradient" size="sm">{data.badge}</GlassBadge>
              </div>
              <h2 className="heading-center">{data.heading}</h2>
            </div>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 autoShow">
          {data.card.map((feature: any) => (
            <WhatYouGetCard key={feature.heading} {...feature} />
          ))}
        </div>
      </ContainerScroll>
    </section>
  );
};

export default WhatYouGetAnimations;

