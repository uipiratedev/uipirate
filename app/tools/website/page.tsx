import type { Metadata } from "next";
import ToolCategoryHub from "@/components/ToolCategoryHub";

export const metadata: Metadata = {
  title: "Website & Conversion Tools Suite | UI Pirate",
  description:
    "Free website UX audit, landing page conversion analysis, CTA button evaluation, and copy readability tools for high-growth SaaS and digital products.",
  alternates: {
    canonical: "https://uipirate.com/tools/website",
  },
};

export default function WebsiteToolsHubPage() {
  return (
    <ToolCategoryHub
      categoryId="website-conversion"
      badgeText="Pillar 1 · Commercial Acquisition"
      title="Website & Conversion Rate Optimization Tools"
      subtitle="Audit above-the-fold value propositions, CTA prominence, social proof placement, and cognitive friction to turn website traffic into paying customers."
      agencyService="Landing Pages & Business Websites"
      agencyDescription="UI Pirate designs and builds high-velocity, high-converting marketing websites and landing pages in Next.js and Tailwind CSS with custom 3D visuals and micro-animations."
      introParagraphs={[
        "Most websites don't lose visitors to bad design — they lose them to ambiguity. A visitor lands, spends five seconds deciding whether the page is relevant to them, and leaves if the headline, CTA, or value proposition makes them think even slightly. That five-second decision happens before your copy, your pricing, or your case studies get read, which is why conversion problems are so often invisible to the people who wrote the page.",
        "These tools run the same checks our designers run manually during a paid audit: above-the-fold clarity, CTA contrast and placement, copy readability, and the trust signals that reduce a buyer's perceived risk. Each one gives you a scored breakdown and specific, actionable fixes — not a generic checklist — so you can prioritize the change that will actually move your conversion rate instead of guessing at a redesign.",
      ]}
      methodology={[
        {
          step: "01. Above-The-Fold Clarity",
          title: "5-Second Value Extraction",
          desc: "We analyze whether first-time visitors can instantly comprehend what your product does, who it is for, and the primary benefit.",
        },
        {
          step: "02. Visual Flow & Eye-Path",
          title: "Saccadic Attention Mapping",
          desc: "We evaluate the contrast, sizing, and vertical rhythm guiding the visitor's eye down the conversion funnel toward primary CTAs.",
        },
        {
          step: "03. Trust & Objection Handling",
          title: "Friction Elimination",
          desc: "We inspect social proof density, enterprise security badges, and clear risk reducers placed adjacent to conversion triggers.",
        },
      ]}
      faqs={[
        {
          q: "How do these tools help improve website conversion rates?",
          a: "Most websites suffer from cognitive overload, vague headlines, and weak CTA contrast. Our diagnostic tools isolate the exact friction points costing you signups.",
        },
        {
          q: "Can I request a full manual audit for my landing page?",
          a: "Yes. UI Pirate's senior product designers conduct comprehensive live teardowns with prioritized Figma redesign blueprints.",
        },
        {
          q: "Are all tools in this suite free to use?",
          a: "Yes, 100% free with no email gating or sign-up required.",
        },
      ]}
    />
  );
}
