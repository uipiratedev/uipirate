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
  "ux-ui-design": {
    badge: "UX/UI Design",
    title: "Idea to Dev-Ready",
    titleHighlight: "SaaS & App Screens",
    description:
      "Product thinking, competitive analysis & information architecture — then pixel-perfect UX/UI in Angular, React & Next.js.",
  },
  "saas-ai-development": {
    badge: "SaaS & AI Development",
    title: "Full-Stack Engineering,",
    titleHighlight: "Built to Ship",
    description:
      "Backend architecture, APIs, AI/LLM integration & production deployment on Node.js, Python, AWS, GCP & Azure.",
  },
  "landing-pages-business-websites": {
    badge: "Landing Pages & Websites",
    title: "Pages Built to",
    titleHighlight: "Convert Visitors",
    description:
      "High-converting landing pages & business websites in React, Next.js, Framer or Webflow — built around your positioning.",
  },
  "ux-audits-consultation": {
    badge: "UX Audits & Consultation",
    title: "Find the Friction.",
    titleHighlight: "Fix What's Costing You.",
    description:
      "Heuristic audits, drop-off analysis & a prioritised, actionable roadmap. Most audits run 1 to 2 weeks.",
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
      alt: meta ? meta.title : `${params.id} | UI Pirate`,
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
