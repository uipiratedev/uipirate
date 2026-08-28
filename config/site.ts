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
          category: "UX/UI Design",
          icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1770113288/uxui_qjw76q.svg",
          href: "/services/UX-UI-Design",
          isLargeCard: true,
          bgImage:
            "https://res.cloudinary.com/dvk9ttiym/image/upload/q_auto/f_auto/v1776670802/ux_vyujds.svg",
        },
        {
          category: "Saas & AI Development",
          icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1770113550/code_h8gq63.svg",
          href: "/services/SaaS-&-AI-Development",
          isLargeCard: true,
          bgImage:
            "https://res.cloudinary.com/dvk9ttiym/image/upload/q_auto/f_auto/v1776670797/saas_fb0ea1.svg",
        },

        {
          category: "Landing Pages & Business Websites",
          icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1770113288/landing_jirsl5.svg",
          href: "/services/Landing-Pages-&-Business-Websites",
          isLargeCard: true,
          bgImage:
            "https://res.cloudinary.com/dvk9ttiym/image/upload/q_auto/f_auto/v1776670796/landing_skjuro.svg",
        },
        {
          category: "UX Audits & Consultation",
          icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1770113288/ux_biqghx.svg",
          href: "/services/UX-Audits-&-Consultation",
        },
      ],
    },
    {
      label: "Works",
      href: "/case-studies",
    },
    {
      label: "Pricing",
      href: "/pricing",
    },
    {
      label: "About",
      href: "/about",
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
          bgImage:
            "https://res.cloudinary.com/dvk9ttiym/image/upload/q_auto/f_auto/v1776670800/blog_v5hfmy.svg",
        },
        {
          category: "Case Studies",
          icon: "📊",
          href: "/case-studies",
          isLargeCard: true,
          bgImage:
            "https://res.cloudinary.com/dvk9ttiym/image/upload/q_auto/f_auto/v1776670794/casestudy_czsny0.svg",
        },
        {
          category: "FAQs",
          icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1770612676/circle-question-mark_1_sl0cgn.svg",
          href: "/faqs",
          isLargeCard: true,
          bgImage:
            "https://res.cloudinary.com/dvk9ttiym/image/upload/q_auto/f_auto/v1776670805/faq_gn5mmv.svg",
        },
        {
          category: "Free Tools",
          icon: "🛠️",
          href: "/tools",
          isLargeCard: true,
          bgImage:
            "https://res.cloudinary.com/dvk9ttiym/image/upload/q_auto/f_auto/v1776670797/saas_fb0ea1.svg",
        },
        {
          category: "UI Components",
          icon: "🧩",
          href: "/ui-components",
          isLargeCard: true,
          bgImage:
            "https://res.cloudinary.com/dvk9ttiym/image/upload/q_auto/f_auto/v1776670802/ux_vyujds.svg",
        },
        {
          category: "3D Tactile Buttons",
          icon: "🔘",
          href: "/buttons",
        },
      ],
    },
  ],
  navMenuItems: [
    {
      label: "Services",
      href: "/services",
    },
    {
      label: "Works",
      href: "/case-studies",
    },
    {
      label: "Pricing",
      href: "#pricing",
    },
    {
      label: "Resources",
      href: "#",
      subItems: [
        { label: "Blog", href: "/blogs" },
        { label: "Case Studies", href: "/case-studies" },
        { label: "FAQs", href: "/faqs" },
        { label: "Free Tools", href: "/tools" },
        { label: "UI Components", href: "/ui-components" },
        { label: "3D Buttons", href: "/buttons" },
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
