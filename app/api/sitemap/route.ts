import { NextResponse } from "next/server";

export async function GET() {
  const pages = [
    { url: "/", priority: "1.0", changefreq: "weekly" },
    { url: "/about", priority: "0.8", changefreq: "monthly" },
    { url: "/#Work", priority: "0.9", changefreq: "weekly" },
    { url: "/#Services", priority: "0.9", changefreq: "monthly" },
    { url: "/#Pricing", priority: "0.8", changefreq: "monthly" },
    { url: "/#FAQs", priority: "0.7", changefreq: "monthly" },
  ];
  const baseUrl = "https://uipirate.com";
  const currentDate = new Date().toISOString().split("T")[0];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) =>
      `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
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
