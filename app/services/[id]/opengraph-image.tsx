import { ImageResponse } from "next/og";

import { OGTemplate } from "../../_og/template";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface ServiceMeta {
  badge: string;
  title: string;
  titleHighlight?: string;
  description: string;
}

const SERVICE_OG: Record<string, ServiceMeta> = {
  "saas-web-mobile-apps": {
    badge: "SaaS & AI Development",
    title: "From Vision to",
    titleHighlight: "Shipped SaaS Product",
    description:
      "Product thinking, competitive analysis, IA, UX/UI design & React/Angular development. We take your idea and ship it.",
  },
  "landing-pages-business-websites": {
    badge: "Landing Pages & Websites",
    title: "Landing Pages",
    titleHighlight: "That Convert",
    description:
      "High-converting landing pages and business websites in React, Next.js, Framer, or Webflow. Built around your positioning.",
  },
  "design-system-component-library": {
    badge: "Design Systems",
    title: "Design Systems at",
    titleHighlight: "Enterprise Scale",
    description:
      "Custom design tokens, branded UI kits, and dev-ready component libraries for Angular, React & beyond.",
  },
  "graphic-design": {
    badge: "Graphic Design",
    title: "Brand Identity &",
    titleHighlight: "Marketing Visuals",
    description:
      "Infographics, newsletters, social media assets, and marketing materials — consistent brand across all channels.",
  },
  "motion-graphics-video-editing": {
    badge: "Motion Graphics",
    title: "Motion Graphics &",
    titleHighlight: "Explainer Videos",
    description:
      "2D/3D animations, product demos, social reels. Sound design, color grading & captions included.",
  },
  "ux-audits-consultation": {
    badge: "UX Audits",
    title: "UX Audit —",
    titleHighlight: "Find & Fix Friction",
    description:
      "Heuristic analysis, usability testing & actionable recommendations. Improve conversion rates in your SaaS product.",
  },
  "3d-animation-rendering": {
    badge: "3D Assets & Animation",
    title: "3D Animation &",
    titleHighlight: "Product Rendering",
    description:
      "High-quality 3D assets, product visualization, and architectural rendering for marketing and brand storytelling.",
  },
};

export function generateImageMetadata({ params }: { params: { id: string } }) {
  const slug = decodeURIComponent(params.id)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const meta = SERVICE_OG[slug];

  return [
    {
      id: slug,
      alt: meta ? meta.title : `${params.id} — UI Pirate`,
    },
  ];
}

export default function Image({ params }: { params: { id: string } }) {
  const slug = decodeURIComponent(params.id)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const meta = SERVICE_OG[slug] ?? {
    badge: "Design Services",
    title: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    description:
      "Professional design & development services by UI Pirate. Enterprise-grade quality, startup speed.",
  };

  return new ImageResponse(
    <OGTemplate
      badge={meta.badge}
      description={meta.description}
      title={meta.title}
      titleHighlight={meta.titleHighlight}
    />,
    { ...size },
  );
}
