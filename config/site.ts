export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "UI Pirate",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Services",
      href: "/services",
      hasDropdown: true,
      dropdownItems: [
        {
          category: "SaaS & AI Product UX/UI",
          icon: "💼",
          href: "/services",
          isLargeCard: true,
        },
        {
          category: "Frontend UI Development",
          icon: "⚡",
          href: "/services",
          isLargeCard: true,
        },
        {
          category: "Landing Pages & Business Websites",
          icon: "🌐",
          href: "/services",
          isLargeCard: true,
        },
        {
          category: "Graphic Design",
          icon: "🎨",
          href: "/services",
        },
        {
          category: "Motion Graphic",
          icon: "🎬",
          href: "/services",
        },
        {
          category: "3D Assets & Animation",
          icon: "🎮",
          href: "/services",
        },
        {
          category: "UX Audits & Consultation",
          icon: "🔍",
          href: "/services",
        },
      ],
    },
    {
      label: "Works",
      href: "/ourWorks",
    },
    {
      label: "Pricing",
      href: "/pricing",
    },
    {
      label: "Resources",
      href: "#",
      hasDropdown: true,
      dropdownItems: [
        {
          category: "Blog",
          href: "/blogs",
        },
        {
          category: "Case Studies",
          href: "/case-studies",
        },
        {
          category: "FAQs",
          href: "/faqs",
        },
      ],
    },
    {
      label: "Mini SaaS Apps",
      href: "#",
      hasDropdown: true,
      dropdownItems: [
        {
          category: "Coming Soon",
          icon: "🚀",
          href: "#",
        },
      ],
    },
    {
      label: "ProPirates",
      href: "https://propirates.com",
    },
  ],
  navMenuItems: [
    {
      label: "Services",
      href: "/services",
    },
    {
      label: "Works",
      href: "/ourWorks",
    },
    {
      label: "Pricing",
      href: "/pricing",
    },
    {
      label: "Resources",
      href: "#",
      subItems: [
        { label: "Blog", href: "/blogs" },
        { label: "Case Studies", href: "/case-studies" },
        { label: "FAQs", href: "/faqs" },
      ],
    },
    {
      label: "ProPirates",
      href: "https://propirates.com",
    },
  ],
  links: {
    github: "#",
    twitter: "https://twitter.com/getnextui",
    docs: "https://nextui.org",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
