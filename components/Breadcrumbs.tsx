"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

// Map URL segments to human-readable labels
const SEGMENT_LABELS: Record<string, string> = {
  services: "Services",
  pricing: "Pricing",
  blogs: "Blog",
  "case-studies": "Case Studies & Portfolio",
  faqs: "FAQs",
  contact: "Contact",
  about: "About",
  privacy: "Privacy Policy",
  "privacy-policy": "Privacy Policy",
  terms: "Terms & Conditions",
  community: "Community",
  resources: "Resources",
  "mini-saas-apps": "Mini SaaS Apps",
  apps4sale: "Apps for Sale",
  "saas-apps": "SaaS Apps",
  "ai-calling": "AI Calling",
};

// Service detail page slug labels
const SERVICE_LABELS: Record<string, string> = {
  "SaaS-Web-&-Mobile-Apps": "SaaS Web & Mobile Apps",
  "Landing-Pages-&-Business-Websites": "Landing Pages & Business Websites",
  "Design-System-&-Component-Library": "Design System & Component Library",
  "Graphic-Design": "Graphic Design",
  "Motion-Graphics-&-Video-Editing": "Motion Graphics & Video Editing",
  "UX-Audits-&-Consultation": "UX Audits & Consultation",
  "3D-Animation-&-Rendering": "3D Animation & Rendering",
};

interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrentPage: boolean;
}

export default function Breadcrumbs() {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    // Don't render breadcrumbs on the homepage
    if (pathname === "/") return [];

    const segments = pathname.split("/").filter(Boolean);
    const items: BreadcrumbItem[] = [
      { label: "Home", href: "/", isCurrentPage: false },
    ];

    let currentPath = "";
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;

      // Determine label
      let label =
        SEGMENT_LABELS[segment] ||
        SERVICE_LABELS[segment] ||
        decodeURIComponent(segment)
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());

      items.push({
        label,
        href: currentPath,
        isCurrentPage: isLast,
      });
    });

    return items;
  }, [pathname]);

  // Don't render on homepage
  if (breadcrumbs.length === 0) return null;

  // BreadcrumbList JSON-LD schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.isCurrentPage
        ? undefined
        : `https://uipirate.com${item.href}`,
    })),
  };

  return (
    <>
      {/* BreadcrumbList JSON-LD for Google */}
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
        type="application/ld+json"
      />

      {/* Visual breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="container mx-auto px-32 lg:px-20 max-md:px-4 pt-24 max-md:pt-20 pb-0"
      >
        <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
          {breadcrumbs.map((item, index) => (
            <li key={item.href} className="flex items-center gap-1">
              {index > 0 && (
                <span className="text-gray-300 mx-1" aria-hidden="true">
                  /
                </span>
              )}
              {item.isCurrentPage ? (
                <span className="text-gray-900 font-medium" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-[#FF5B04] transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
