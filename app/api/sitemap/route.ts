import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = "https://uipirate.com";
  const currentDate = new Date().toISOString().split("T")[0];

  // Main pages with hreflang support
  const mainPages = [
    {
      url: "/",
      priority: "1.0",
      changefreq: "daily",
      hreflang: true,
      image: true,
    },
    { url: "/about", priority: "0.9", changefreq: "monthly", hreflang: true },
    {
      url: "/services",
      priority: "0.95",
      changefreq: "weekly",
      hreflang: true,
    },
    {
      url: "/ourWorks",
      priority: "0.95",
      changefreq: "weekly",
      hreflang: true,
    },
    { url: "/pricing", priority: "0.95", changefreq: "weekly", hreflang: true },
    { url: "/faqs", priority: "0.8", changefreq: "monthly", hreflang: true },
    {
      url: "/blogs",
      priority: "0.8",
      changefreq: "weekly",
      hreflang: true,
    },
    {
      url: "/contact",
      priority: "0.85",
      changefreq: "monthly",
      hreflang: true,
    },
    {
      url: "/ourTeam",
      priority: "0.7",
      changefreq: "monthly",
      hreflang: false,
    },
    {
      url: "/sitemap",
      priority: "0.5",
      changefreq: "monthly",
      hreflang: false,
    },
    { url: "/blogs", priority: "0.8", changefreq: "weekly", hreflang: false },
  ];

  // Service detail pages
  const servicePages = [
    {
      url: "/services/SaaS-Web-&-Mobile-Apps",
      priority: "0.9",
      changefreq: "weekly",
    },
    {
      url: "/services/Landing-Pages-&-Corporate-Websites",
      priority: "0.9",
      changefreq: "weekly",
    },
    {
      url: "/services/Design-System-&-Component-Library",
      priority: "0.9",
      changefreq: "weekly",
    },
    { url: "/services/Graphic-Design", priority: "0.9", changefreq: "weekly" },
    {
      url: "/services/Motion-Graphics-&-Video-Editing",
      priority: "0.9",
      changefreq: "weekly",
    },
    {
      url: "/services/UX-Audits-&-Consultation",
      priority: "0.9",
      changefreq: "weekly",
    },
    {
      url: "/services/3D-Animation-&-Rendering",
      priority: "0.9",
      changefreq: "weekly",
    },
  ];

  const hreflangs = ["en-us", "en-gb", "en-sg", "en-in", "en-au"];

  const generateHreflangLinks = (url: string) => {
    return hreflangs
      .map(
        (lang) =>
          `    <xhtml:link rel="alternate" hreflang="${lang}" href="${baseUrl}${url}" />`,
      )
      .concat(
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}${url}" />`,
      )
      .join("\n");
  };

  const generateImageTag = () => {
    return `    <image:image>
      <image:loc>https://res.cloudinary.com/dkziil6io/image/upload/v1742919377/ui-pirate-website_amh6qb.png</image:loc>
      <image:title>UI Pirate - Enterprise UI/UX Design Agency</image:title>
      <image:caption>UI Pirate by Vishal Anand - Modern, scalable design for SaaS and Tech companies</image:caption>
    </image:image>`;
  };

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

  <!--
    UI Pirate Sitemap - Optimized for SEO and AI Search Engines
    Brand Variations: uipirate, ui pirate, ui-pirate, UI PIRATE, UIPirate
    Last Updated: ${currentDate}
  -->

${mainPages
  .map(
    (page) =>
      `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
${page.hreflang ? generateHreflangLinks(page.url) : ""}
${page.image ? generateImageTag() : ""}
  </url>`,
  )
  .join("\n")}

${servicePages
  .map(
    (page) =>
      `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
  )
  .join("\n")}

</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "s-maxage=86400, stale-while-revalidate",
    },
  });
}
