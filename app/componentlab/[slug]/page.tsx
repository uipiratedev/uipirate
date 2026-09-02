import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ALL_DASHBOARD_COMPONENTS } from "@/screens/uiComponents/dashboardComponents";
import UIComponentDashboard from "@/screens/uiComponents/UIComponentDashboard";

interface ComponentPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return ALL_DASHBOARD_COMPONENTS.map((component) => ({
    slug: component.id,
  }));
}

export async function generateMetadata({ params }: ComponentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const component = ALL_DASHBOARD_COMPONENTS.find((c) => c.id === slug);

  if (!component) {
    return {
      title: "Component Not Found | UI Pirate",
    };
  }

  const title = `${component.name} — Component Lab | UI Pirate`;
  const description = component.description;

  return {
    title,
    description,
    keywords: `${component.name}, ${component.categoryLabel}, react component, tailwind css, framer motion, ui pirate`,
    openGraph: {
      title,
      description,
      url: `https://uipirate.com/componentlab/${slug}`,
      siteName: "UI Pirate",
      type: "website",
    },
    alternates: {
      canonical: `https://uipirate.com/componentlab/${slug}`,
    },
  };
}

export default async function ComponentDetailPage({ params }: ComponentPageProps) {
  const { slug } = await params;
  const component = ALL_DASHBOARD_COMPONENTS.find((c) => c.id === slug);

  if (!component) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    "name": component.name,
    "description": component.description,
    "programmingLanguage": "TypeScript / React",
    "url": `https://uipirate.com/componentlab/${slug}`,
    "author": {
      "@type": "Organization",
      "name": "UI Pirate",
      "url": "https://uipirate.com",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <UIComponentDashboard initialComponentId={slug} />
    </>
  );
}
