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
    title: "From Vision to",
    titleHighlight: "Shipped SaaS Product",
    description:
      "Product thinking, competitive analysis, IA, and UX/UI design for SaaS & mobile apps. We take your idea and design it right.",
  },
  "saas-ai-development": {
    badge: "SaaS & AI Development",
    title: "Full-Stack Engineering",
    titleHighlight: "for SaaS & AI Products",
    description:
      "Backend architecture, APIs, database design, and AI/LLM integration in Angular, React, Next.js & Node.js. We build what the interface runs on.",
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
  "ux-audits-consultation": {
    badge: "UX Audits",
    title: "UX Audit —",
    titleHighlight: "Find & Fix Friction",
    description:
      "Heuristic analysis, usability testing & actionable recommendations. Improve conversion rates in your SaaS product.",
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
