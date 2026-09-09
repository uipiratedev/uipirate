import { Metadata } from "next";
import { notFound } from "next/navigation";

import services from "@/data/sericesDetailsList.json";
import ServiceDetails from "@/screens/serviceDetails";

// Clean, human-readable service names for structured data (not the raw hero badge).
const SERVICE_NAME: Record<string, string> = {
  "ux-ui-design": "UX/UI Design",
  "saas-ai-development": "SaaS & AI Development",
  "landing-pages-business-websites": "Landing Pages & Business Websites",
  "ux-audits-consultation": "UX Audits & Consultation",
};

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
    title: "SaaS & Mobile App UX/UI Design | UI Pirate",
    description:
      "Turn your SaaS or mobile app idea into a shipped product — product thinking, competitive analysis, information architecture, and UX/UI design in Angular, React & Next.js, from vision to dev-ready screens.",
    keywords:
      "SaaS product design, UX/UI design, mobile app design, product thinking, information architecture, new build or redesign, startup product design agency",
  },
  "saas-ai-development": {
    title: "SaaS & AI Development | Full-Stack Engineering | UI Pirate",
    description:
      "Full-stack development for SaaS and AI products — backend architecture, database design, AI/LLM integration, APIs, and production deployment on Node.js, Python, AWS, GCP & Azure. Plus AI-generated code taken to production.",
    keywords:
      "SaaS development, AI development, full-stack engineering, AI/LLM integration, backend architecture, API development, AI-generated code to production, Node.js, Python",
  },
  "landing-pages-business-websites": {
    title: "Landing Page Design & Development | UI Pirate",
    description:
      "High-converting landing pages and business websites that turn visitors into customers — built around your positioning and user journey in React, Next.js, Framer, or Webflow.",
    keywords:
      "landing page design and development, business website development, high-converting landing page, conversion-focused web design, Framer, Webflow",
  },
  "ux-audits-consultation": {
    title: "UX Audit & Consultation | UI Pirate",
    description:
      "Heuristic UX audits with drop-off analysis and a prioritised, actionable roadmap. Find the friction blocking growth before you build more. Most audits run 1–2 weeks.",
    keywords:
      "UX audit service, usability review, UX consultation, SaaS UX review, heuristic analysis, product usability audit, conversion audit",
  },
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const urlSlug = decodeURIComponent(params.id);
  const normalizedSlug = normalize(urlSlug);

  const meta = SERVICE_META[normalizedSlug] || {
    title: `${urlSlug.replace(/-/g, " ")} | UI Pirate`,
    description: `${urlSlug.replace(/-/g, " ")} services by UI Pirate — a product design and development studio for SaaS and AI teams.`,
    keywords: `${urlSlug.replace(/-/g, " ").toLowerCase()}, UI Pirate, product design and development`,
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

  const normalizedSlug = normalize(urlSlug);
  const service = services.find(
    (s: any) => normalize(s.slug) === normalizedSlug,
  );

  if (!service) notFound();

  const serviceName =
    SERVICE_NAME[normalizedSlug] || urlSlug.replace(/-/g, " ");
  const serviceDescription =
    SERVICE_META[normalizedSlug]?.description ||
    (service.data as any).hero?.description ||
    "";

  return (
    <div>
      {/* JSON-LD for this specific service */}
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: serviceName,
            serviceType: serviceName,
            description: serviceDescription,
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
