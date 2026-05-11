import { Metadata } from "next";

import services from "@/data/sericesDetailsList.json";
import ServiceDetails from "@/screens/serviceDetails";

export async function generateStaticParams() {
  return services.map((item: any) => ({ id: item.slug }));
}

interface PageProps {
  params: {
    id: string;
  };
}

// normalize for matching (convert to lowercase, replace special chars with "-")
const normalize = (str: string) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// SEO metadata mapping for each service
const SERVICE_META: Record<string, { title: string; description: string; keywords: string }> = {
  "saas-web-mobile-apps": {
    title: "SaaS & Mobile App Design | Angular, React & Next.js Development | UI Pirate",
    description:
      "Expert SaaS and mobile app UI/UX design & frontend development in Angular, React, and Next.js. From MVP wireframes to enterprise-grade products. 50+ projects delivered. Book a free consultation.",
    keywords:
      "SaaS design agency, Angular development agency, Angular frontend development, mobile app UI design, SaaS UX design, dashboard design, AI app design, MVP design, React Angular Next.js development, startup design agency USA",
  },
  "landing-pages-business-websites": {
    title:
      "Landing Page & Website Design | Angular, React & Webflow Development | UI Pirate",
    description:
      "High-converting landing pages and business websites that turn visitors into customers. Design + development in Angular, React, Next.js, Framer, and Webflow. 2-4 week delivery.",
    keywords:
      "landing page design agency, Angular website development, business website design, high-converting landing page, Angular React development, website redesign, startup website, corporate website design",
  },
  "design-system-component-library": {
    title: "Design Systems & Component Libraries | Scalable UI Kits | UI Pirate",
    description:
      "Custom design systems with design tokens, branded UI kits, and documented dev-ready components for Angular, React, and other frameworks. Built for enterprise teams that need consistency at scale.",
    keywords:
      "design system agency, Angular component library, component library, design tokens, UI kit, scalable design system, enterprise design system, Angular design system, React component library, Figma component library",
  },
  "graphic-design": {
    title: "Graphic Design Services | Brand Identity & Marketing Visuals | UI Pirate",
    description:
      "Professional graphic design for brand identity, infographics, newsletters, social media, and marketing materials. Consistent brand visuals across all channels.",
    keywords:
      "graphic design agency, brand identity design, infographic design, marketing design, social media graphics, brand assets",
  },
  "motion-graphics-video-editing": {
    title: "Motion Graphics & Video Editing | Animations & Explainer Videos | UI Pirate",
    description:
      "Professional motion graphics, 2D/3D animations, social media reels, explainer videos, and product demos. Sound design, color grading, and captions included.",
    keywords:
      "motion graphics agency, video editing, explainer videos, product animation, social media video, 2D 3D animation",
  },
  "ux-audits-consultation": {
    title: "UX Audit & Consultation | Improve Your Product's Usability | UI Pirate",
    description:
      "Expert UX audits with heuristic analysis, usability testing, and actionable recommendations. Identify friction points and improve conversion rates in your SaaS product.",
    keywords:
      "UX audit service, usability testing, UX consultation, SaaS UX review, heuristic analysis, product usability audit",
  },
  "3d-animation-rendering": {
    title: "3D Animation & Rendering | Product Visualization | UI Pirate",
    description:
      "Professional 3D animation, product rendering, and architectural visualization. High-quality 3D assets for marketing, product demos, and brand storytelling.",
    keywords:
      "3D animation agency, product rendering, 3D visualization, architectural rendering, 3D product animation",
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const urlSlug = decodeURIComponent(params.id);
  const normalizedSlug = normalize(urlSlug);

  const meta = SERVICE_META[normalizedSlug] || {
    title: `${urlSlug.replace(/-/g, " ")} | UI Pirate Design Services`,
    description: `Professional ${urlSlug.replace(/-/g, " ").toLowerCase()} services by UI Pirate. Enterprise-grade design trusted by Fortune 500 companies.`,
    keywords: `${urlSlug.replace(/-/g, " ").toLowerCase()}, UI Pirate, design services`,
  };

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `https://uipirate.com/services/${encodeURIComponent(urlSlug)}`,
      siteName: "UI Pirate by Vishal Anand",
      images: [
        {
          url: "https://res.cloudinary.com/dkziil6io/image/upload/v1742919377/ui-pirate-website_amh6qb.png",
          width: 1200,
          height: 630,
          alt: meta.title,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    alternates: {
      canonical: `https://uipirate.com/services/${encodeURIComponent(urlSlug)}`,
    },
  };
}

const ServicesByIdPage = ({ params }: PageProps) => {
  // URL params are automatically decoded by Next.js
  const urlSlug = decodeURIComponent(params.id);

  const service = services.find(
    (s: any) => normalize(s.slug) === normalize(urlSlug),
  );

  if (!service) {
    return (
      <div className="text-center py-24 text-gray-500">
        <h1 className="text-3xl font-semibold">Service not found</h1>
        <p className="mt-2">Please check the URL or select a valid service.</p>
      </div>
    );
  }

  return (
    <div>
      {/* JSON-LD for this specific service */}
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: (service.data as any).hero?.badge || urlSlug.replace(/-/g, " "),
            description: (service.data as any).hero?.description || "",
            provider: {
              "@type": "Organization",
              name: "UI Pirate by Vishal Anand",
              url: "https://uipirate.com",
            },
            areaServed: ["United States", "United Kingdom", "Singapore", "India", "Australia"],
            url: `https://uipirate.com/services/${encodeURIComponent(urlSlug)}`,
          }),
        }}
        type="application/ld+json"
      />
      <ServiceDetails data={service.data} />
    </div>
  );
};

export default ServicesByIdPage;
