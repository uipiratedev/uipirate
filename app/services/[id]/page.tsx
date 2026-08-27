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
const SERVICE_META: Record<
  string,
  { title: string; description: string; keywords: string }
> = {
  "ux-ui-design": {
    title:
      "SaaS & Mobile App UX/UI Design | Idea to Product | Angular, React",
    description:
      "Turn your SaaS or mobile app idea into a shipped product. We handle product thinking, competitive analysis, information architecture, and UX/UI design — from a few lines of vision to dev-ready, high-fidelity screens.",
    keywords:
      "SaaS product design, idea to product, product thinking, UX/UI design, mobile app design, competitive analysis, information architecture, complex enterprise application, MVP to product, startup product agency USA",
  },
  "saas-ai-development": {
    title:
      "SaaS & AI Development | Full-Stack Engineering | Angular, React, Node.js",
    description:
      "Full-stack development for SaaS platforms and AI-powered products. Backend architecture, database design, AI/LLM integration, APIs, and production deployment in Angular, React, Next.js, and Node.js.",
    keywords:
      "SaaS development, AI development, full-stack engineering, AI integration, LLM integration, backend architecture, API development, Angular development, React development, Node.js development, startup engineering agency USA",
  },
  "landing-pages-business-websites": {
    title:
      "Landing Page & Website Design & Development | Angular, React & Webflow",
    description:
      "High-converting landing pages and business websites that turn visitors into customers. We think through your product positioning, competitive landscape, and user journey — then design + develop in Angular, React, Next.js, Framer, or Webflow.",
    keywords:
      "landing page design and development, business website development, Angular website development, high-converting landing page, product positioning, competitive analysis, startup website design",
  },
  "design-system-component-library": {
    title:
      "Design Systems & Component Libraries | Scalable UI Kits",
    description:
      "Custom design systems with design tokens, branded UI kits, and documented dev-ready components for Angular, React, and other frameworks. Built for enterprise teams that need consistency at scale.",
    keywords:
      "design system agency, Angular component library, component library, design tokens, UI kit, scalable design system, enterprise design system, Angular design system, React component library, Figma component library",
  },
  "ux-audits-consultation": {
    title:
      "UX Audit & Consultation | Improve Your Product's Usability",
    description:
      "Expert UX audits with heuristic analysis, usability testing, and actionable recommendations. Identify friction points and improve conversion rates in your SaaS product.",
    keywords:
      "UX audit service, usability testing, UX consultation, SaaS UX review, heuristic analysis, product usability audit",
  },
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const urlSlug = decodeURIComponent(params.id);
  const normalizedSlug = normalize(urlSlug);

  const meta = SERVICE_META[normalizedSlug] || {
    title: `${urlSlug.replace(/-/g, " ")} | Design Services`,
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
            name:
              (service.data as any).hero?.badge || urlSlug.replace(/-/g, " "),
            description: (service.data as any).hero?.description || "",
            provider: {
              "@type": "Organization",
              name: "UI Pirate by Vishal Anand",
              url: "https://uipirate.com",
            },
            areaServed: [
              "United States",
              "United Kingdom",
              "Singapore",
              "India",
              "Australia",
            ],
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
