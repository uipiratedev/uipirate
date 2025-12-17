export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "UI Pirate",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Services",
      href: "/services",
    },
    {
      label: "Works",
      href: "/ourWorks",
    },
    // {
    //   label: "Tools",
    //   href: "/tools",
    // },
    {
      label: "Pricing",
      href: "/pricing",
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
    // {
    //   label: "Tools",
    //   href: "/tools",
    // },
    {
      label: "Pricing",
      href: "/pricing",
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
