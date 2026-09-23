import React from "react";

export interface CTAButtonConfig {
  label: string;
  href?: string;
  isExternal?: boolean;
  action?: "modal" | "link";
  variant?: "tactile" | "secondary" | "outline" | "ghost" | "link";
}

export interface PageCTAConfig {
  heading: React.ReactNode;
  description?: string;
  primaryButton: CTAButtonConfig;
  secondaryButton?: CTAButtonConfig;
  marqueeText?: string;
}

export const DEFAULT_CTA_CONFIG: PageCTAConfig = {
  heading: (
    <>
      <span className="block">If you scrolled this far,</span>
      <span className="block">
        It’s time to{" "}
        <span className="text-orange-500">Build Something Together</span>
      </span>
    </>
  ),
  primaryButton: {
    label: "LETS VENTURE",
    action: "modal",
  },
  marqueeText: "SAAS WEB APP",
};

export const ROUTE_CTA_CONFIGS: Record<string, PageCTAConfig> = {
  "/about": {
    heading: (
      <>
        Try Your Ideas Into The{" "}
        <span className="text-orange-500">Product</span>
      </>
    ),
    description:
      "Book a free 15-minute call. Whether it's a quick UX audit or a full product build, tell us where you are — we'll tell you the fastest path forward.",
    primaryButton: {
      label: "BOOK A FREE CALL",
      action: "link",
      href: "https://cal.com/vishal-anand-3w8233/15min",
      isExternal: true,
    },
    secondaryButton: {
      label: "See Pricing",
      href: "/pricing",
    },
    marqueeText: "IDEA TO PRODUCT",
  },
  "/pricing": {
    heading: (
      <>
        Ready to Build Something{" "}
        <span className="text-orange-500">Exceptional</span>?
      </>
    ),
    description:
      "Get in touch for custom enterprise needs or start with our 5-day low-risk pilot project.",
    primaryButton: {
      label: "LETS VENTURE",
      action: "modal",
    },
    marqueeText: "PREMIUM DESIGN",
  },
  "/process": {
    heading: (
      <>
        Ready to Start With{" "}
        <span className="text-orange-500">Step 01</span>?
      </>
    ),
    description:
      "Book a free 15-minute call. Tell us your vision — we'll show you how we can bring it to life.",
    primaryButton: {
      label: "BOOK A FREE CALL",
      action: "link",
      href: "https://cal.com/vishal-anand-3w8233/15min",
      isExternal: true,
    },
    secondaryButton: {
      label: "See Pricing",
      href: "/pricing",
    },
    marqueeText: "OUR PROCESS",
  },
  "/case-studies": {
    heading: (
      <>
        Let’s Build Something Like This{" "}
        <span className="text-orange-500">For You</span>
      </>
    ),
    description:
      "From idea to shipped product — product thinking, IA, UX/UI, and production-ready code.",
    primaryButton: {
      label: "LETS VENTURE",
      action: "modal",
    },
    secondaryButton: {
      label: "See Pricing",
      href: "/pricing",
    },
    marqueeText: "SHIPPED PRODUCTS",
  },
  "/services": {
    heading: (
      <>
        Let’s Build It{" "}
        <span className="text-orange-500">Together</span>
      </>
    ),
    description:
      "UI Pirate is a product design & development agency trusted by 50+ SaaS founders and enterprise teams across the US, UK & beyond. Tell us what you need.",
    primaryButton: {
      label: "GET A FREE ESTIMATE",
      action: "link",
      href: "/contact",
    },
    secondaryButton: {
      label: "See Our Work",
      href: "/case-studies",
    },
    marqueeText: "SAAS & AI PRODUCTS",
  },
  "/tools": {
    heading: (
      <>
        Turn Audit Findings Into A{" "}
        <span className="text-orange-500">High-Converting Product</span>
      </>
    ),
    description:
      "UI Pirate is a product design & full-stack development agency specializing in complex SaaS platforms, AI interfaces, and fast, high-converting landing pages.",
    primaryButton: {
      label: "BOOK A 1-ON-1 CALL",
      action: "link",
      href: "https://cal.com/vishal-anand-3w8233/15min",
      isExternal: true,
    },
    secondaryButton: {
      label: "See Pricing",
      href: "/pricing",
      variant: "ghost",
    },
    marqueeText: "PRODUCT AUDIT",
  },
  "/componentlab": {
    heading: (
      <>
        Need A Bespoke Component Or A{" "}
        <span className="text-orange-500">Design System</span>?
      </>
    ),
    description:
      "We build production-ready UI components, tactile physics, and scalable design systems for high-growth SaaS and AI products.",
    primaryButton: {
      label: "BOOK A FREE CALL",
      action: "link",
      href: "https://cal.com/vishal-anand-3w8233/15min",
      isExternal: true,
    },
    secondaryButton: {
      label: "See Pricing",
      href: "/pricing",
      variant: "ghost",
    },
    marqueeText: "COMPONENT LAB",
  },
};

export function getCtaConfig(pathname: string | null): PageCTAConfig {
  if (!pathname) return DEFAULT_CTA_CONFIG;

  // Exact match
  if (ROUTE_CTA_CONFIGS[pathname]) {
    return ROUTE_CTA_CONFIGS[pathname];
  }

  // Prefix match (e.g. /case-studies/... or /services/...)
  const matchedKey = Object.keys(ROUTE_CTA_CONFIGS).find(
    (key) => key !== "/" && pathname.startsWith(key)
  );

  if (matchedKey) {
    return ROUTE_CTA_CONFIGS[matchedKey];
  }

  return DEFAULT_CTA_CONFIG;
}
