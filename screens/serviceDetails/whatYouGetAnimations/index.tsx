"use client";
import Image from "next/image";

import SectionHeader from "@/components/SectionHeader";
import { Reveal, RevealGroup } from "@/components/motion";
import * as UxAuditVisuals from "@/components/visuals/UxAuditVisuals";
import * as SaasDevVisuals from "@/components/visuals/SaasDevVisuals";
import * as LandingVisuals from "@/components/visuals/LandingVisuals";
import * as UxUiVisuals from "@/components/visuals/UxUiVisuals";

/**
 * `whatYouGet` card `heading` strings are LOAD-BEARING: an exact match here swaps
 * the card's static `image`/`img` SVG for an animated visual. Renaming a heading
 * in `data/sericesDetailsList.json` without updating this map silently drops the
 * animation (the card falls back to its `image`). Keep the two in sync.
 *
 * Cards with no entry below (e.g. the SaaS & AI Development set) intentionally
 * render their `image` SVG — that's fine, just not animated.
 */
const VISUAL_MAPPING: Record<string, any> = {
  // UX/UI Design
  "UX/UI Design & Prototype": UxUiVisuals.VisualUxUiNew,
  "UI Development & Integration": UxUiVisuals.VisualUiDevNew,
  "New Build or Redesign": UxUiVisuals.VisualRedesignNew,
  "Mobile Optimization": UxUiVisuals.VisualMobileOptNew,
  // SaaS & AI Development
  "Full-Stack Architecture": SaasDevVisuals.VisualFullStackNew,
  "Full-Stack Development, Idea to Production": SaasDevVisuals.VisualFullStackNew,
  "AI Models & API Integrations": SaasDevVisuals.VisualAILLMNew,
  "Cloud Deployment & Scaling": SaasDevVisuals.VisualCloudNew,
  "AI-Generated Code, Production-Ready": SaasDevVisuals.VisualAiCodeNew,
  // Landing Pages & Business Websites
  "Landing Pages & Corporate Websites": LandingVisuals.VisualLandingNew,
  "Design & Frontend Development": LandingVisuals.VisualFrontendNew,
  "SEO Performance & AI-Readable Websites": LandingVisuals.VisualSEONew,
  "Fully Responsive Experience": LandingVisuals.VisualResponsiveNew,
  // UX Audits & Consultation
  "Heuristic UX Audit Report": UxAuditVisuals.VisualAuditNew,
  "Drop-Off & Friction Insights": UxAuditVisuals.VisualFrictionNew,
  "Flow & Interaction Review": UxAuditVisuals.VisualFlowNew,
  "Walkthrough Video": UxAuditVisuals.VisualVideoNew,
};

const WhatYouGetCard = ({ heading, description, image, img }: any) => {
  const displayImage = image || img;
  const VisualComponent = VISUAL_MAPPING[heading];

  return (
    <div className="relative flex flex-col h-full rounded-[20px] overflow-hidden bg-white border border-[#E5E7EB] shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
      {/* Image/Visual area */}
      <div className="w-full h-[200px] md:h-[220px] flex-shrink-0 flex items-center justify-center bg-[#F8F9FB] overflow-hidden">
        {VisualComponent ? (
          <div className="w-full h-full">
            <VisualComponent />
          </div>
        ) : displayImage ? (
          <div className="relative w-[55%] h-[70%] pt-6">
            <Image
              fill
              alt={heading}
              className="object-contain"
              sizes="(max-width: 768px) 50vw, 25vw"
              src={displayImage}
            />
          </div>
        ) : null}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-start px-5 py-4 md:px-6 md:py-5 bg-white relative z-10">
        <h3 className="text-[18px] md:text-[22px] font-semibold text-[#111827] leading-snug tracking-tight">
          {heading}
        </h3>
        <p className="mt-1.5 text-[14px] md:text-[16px] text-[#4B5563] leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

const WhatYouGetAnimations = ({ data }: any) => {
  return (
    <div className="section-container">
      <Reveal variant="up">
        <SectionHeader chip={data.badge}>{data.heading}</SectionHeader>
      </Reveal>

      <RevealGroup className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        {data.card.map((feature: any) => (
          <Reveal key={feature.heading} className="h-full flex flex-col" variant="up">
            <WhatYouGetCard {...feature} />
          </Reveal>
        ))}
      </RevealGroup>
    </div>
  );
};

export default WhatYouGetAnimations;
