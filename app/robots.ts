import { MetadataRoute } from "next";

// Replaces the static public/robots.txt so the sitemap URL always tracks
// BASE_URL from a single source instead of two hand-maintained copies.
const BASE_URL = "https://uipirate.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/pirateCOS/", "/blogs/create", "/blogs/edit/", "/api/"],
      },
      // AI crawlers — explicit allow (no Crawl-delay)
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "Claude-Web", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "Bytespider", allow: "/" },
      { userAgent: "CCBot", allow: "/" },
      { userAgent: "cohere-ai", allow: "/" },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
