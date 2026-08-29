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
  terms: "Terms & Conditions",
  resources: "Resources",
  apps4sale: "Apps for Sale",
  componentlab: "Component Lab",
  buttons: "Buttons",
};

// Service detail page slug labels
const SERVICE_LABELS: Record<string, string> = {
  "UX-UI-Design": "UX/UI Design",
  "SaaS-&-AI-Development": "SaaS & AI Development",
  "Landing-Pages-&-Business-Websites": "Landing Pages & Business Websites",
  "Design-System-&-Component-Library": "Design System & Component Library",
  "UX-Audits-&-Consultation": "UX Audits & Consultation",
};

interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrentPage: boolean;
}

export default function Breadcrumbs() {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);

    // Don't render breadcrumbs on homepage, admin pages, individual blog/case-study
    // detail pages, or root-level blog post slugs (e.g. /some-post-title) — blog
    // posts live at the URL root, so an unrecognized single segment is one of those.
    if (
      pathname === "/" ||
      pathname.startsWith("/admin") ||
      pathname.startsWith("/tools") ||
      pathname.startsWith("/componentlab") ||
      pathname.startsWith("/buttons") ||
      /^\/blogs\/[^/]+/.test(pathname) ||
      /^\/case-studies\/[^/]+/.test(pathname) ||
      (segments.length === 1 && !SEGMENT_LABELS[segments[0]])
    )
      return [];

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
      item: item.isCurrentPage ? undefined : `https://uipirate.com${item.href}`,
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
        <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
          {breadcrumbs.map((item, index) => (
            <li key={item.href} className="flex items-center gap-1">
              {index > 0 && (
                <span aria-hidden="true" className="text-gray-400/60 dark:text-gray-600 mx-1">
                  /
                </span>
              )}
              {item.isCurrentPage ? (
                <span aria-current="page" className="text-gray-900 dark:text-white font-medium">
                  {item.label}
                </span>
              ) : (
                <Link
                  className="hover:text-[#FF5B04] dark:hover:text-[#FF5B04] transition-colors"
                  href={item.href}
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
