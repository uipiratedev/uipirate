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
          description: "IA, user flows, and high-fidelity UI from first sketch to Figma handoff.",
        },
        {
          category: "Saas & AI Development",
          icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1770113550/code_h8gq63.svg",
          href: "/services/SaaS-&-AI-Development",
          isLargeCard: true,
          bgImage:
            "https://res.cloudinary.com/dvk9ttiym/image/upload/v1788164139/ChatGPT_Image_Aug_27_2026_03_35_38_PM_1_uyvn6s.svg",
          description: "React, Next.js, and Angular development with zero hand-off gaps.",
        },

        {
          category: "Landing Pages & Business Websites",
          icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1770113288/landing_jirsl5.svg",
          href: "/services/Landing-Pages-&-Business-Websites",
          isLargeCard: true,
          bgImage:
            "https://res.cloudinary.com/dvk9ttiym/image/upload/v1788164087/image_239_guz7zd.svg",
          description: "Conversion-focused pages built where research dictates.",
        },
        {
          category: "UX Audits & Consultation",
          icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1770113288/ux_biqghx.svg",
          href: "/services/UX-Audits-&-Consultation",
          isLargeCard: true,
          bgImage:
            "https://res.cloudinary.com/dvk9ttiym/image/upload/v1788164113/ChatGPT_Image_Aug_27_2026_03_37_27_PM_1_p1spkb.svg",
          description: "Find where users drop off and get a prioritised, actionable fix list.",
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
          description: "Practical SaaS UX articles written by the team that ships the work.",
        },
        {
          category: "Case Studies",
          icon: "📊",
          href: "/case-studies",
          isLargeCard: true,
          bgImage:
            "https://res.cloudinary.com/dvk9ttiym/image/upload/q_auto/f_auto/v1776670794/casestudy_czsny0.svg",
          description: "Real briefs, constraints, and shipped products with before & afters.",
        },
        // {
        //   category: "FAQs",
        //   icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1770612676/circle-question-mark_1_sl0cgn.svg",
        //   href: "/faqs",
        //   isLargeCard: true,
        //   bgImage:
        //     "https://res.cloudinary.com/dvk9ttiym/image/upload/q_auto/f_auto/v1776670805/faq_gn5mmv.svg",
        // },
        {
          category: "Tools",
          icon: "🛠️",
          href: "/tools",
          isLargeCard: true,
          bgImage:
            "https://res.cloudinary.com/dvk9ttiym/image/upload/v1788181141/tools_q1fxyd.svg",
          description: "Free calculators and generators built for our own internal projects.",
        },
        {
          category: "Component Lab",
          icon: "🧩",
          href: "/componentlab",
          isLargeCard: true,
          bgImage:
            "https://res.cloudinary.com/dvk9ttiym/image/upload/v1788181120/componentlab_warfka.svg",
          description: "Interactive React components to copy, test, and drop into your projects.",
        },
        // {
        //   category: "3D Tactile Buttons",
        //   icon: "🔘",
        //   href: "/buttons",
        // },
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
        { label: "Component Lab", href: "/componentlab" },
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
