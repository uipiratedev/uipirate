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
          category: "UX/UI DESIGN",
          icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1770113288/uxui_qjw76q.svg",
          href: "/services",
          isLargeCard: true,
        },
        {
          category: "Saas & AI Development",
          icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1770113550/code_h8gq63.svg",
          href: "/services",
          isLargeCard: true,
        },
        
        {
          category: "Landing Pages & Business Websites",
          icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1770113288/landing_jirsl5.svg",
          href: "/services",
          isLargeCard: true,
        },
        {
          category: "Graphic Design",
          icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1770113288/graphic_s0cmgk.svg",
          href: "/services",
        },
        {
          category: "Motion Graphic",
          icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1770113288/motion_dqrdcl.svg",
          href: "/services",
        },
        {
          category: "UX Audits & Consultation",
          icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1770113288/ux_biqghx.svg",
          href: "/services",
        },
        {
          category: "3D Assets & Animation",
          icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1770113288/3d_wtkihl.svg",
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
          category: "Blog & Tutorials",
          icon: "✍️",
          href: "/blogs",
          isLargeCard: true,
        },
        {
          category: "Case Studies",
          icon: "📊",
          href: "/case-studies",
          isLargeCard: true,
        },
        {
          category: "FAQs",
          icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1770612676/circle-question-mark_1_sl0cgn.svg",
          href: "/faqs",
          isLargeCard: true,

        },
        {
          category: "Documentation",
          icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1770612675/file_1_fvzqpk.svg",
          href: "/docs",
          isLargeCard: true,

        },
      ],
    },
   
    {
      label: "ProPirates",
      href: "https://propirates.com",
    },
     {
      label: "Apps4Sale",
      href: "/apps4sale",
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
