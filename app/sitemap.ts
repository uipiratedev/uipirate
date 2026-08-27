import { MetadataRoute } from "next";

import apps4saleProducts from "@/data/apps4sale.json";
import { DETAILED_BOTS } from "@/data/bots";

/**
 * Dynamic sitemap generation for Next.js App Router.
 * Replaces the static public/sitemap.xml with auto-generated entries.
 *
 * Benefits:
 * - Automatically picks up new blog posts from the database
 * - Always has correct lastModified dates
 * - No manual maintenance required
 */

// Without this, Next statically freezes the sitemap at build time and never
// re-runs the blog-fetch below, so new posts would never actually appear.
// Kept short (10 min, not 1 hr) so new posts/case studies show up in the
// sitemap without a long stale window.
export const revalidate = 600;

const BASE_URL = "https://uipirate.com";

// Static pages with their priorities and change frequencies
const STATIC_PAGES: {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"];
}[] = [
  { path: "/", priority: 1.0, changeFrequency: "daily" },
  // /services hub page was removed in favor of direct links to each service (see SERVICE_SLUGS below).
  { path: "/case-studies", priority: 0.95, changeFrequency: "weekly" },
  { path: "/about", priority: 0.9, changeFrequency: "monthly" },
  { path: "/process", priority: 0.8, changeFrequency: "monthly" },
  { path: "/pricing", priority: 0.9, changeFrequency: "weekly" },
  { path: "/blogs", priority: 0.85, changeFrequency: "weekly" },
  { path: "/contact", priority: 0.85, changeFrequency: "monthly" },
  { path: "/faqs", priority: 0.85, changeFrequency: "monthly" },
  { path: "/sitemap", priority: 0.5, changeFrequency: "monthly" },
  { path: "/apps4sale", priority: 0.7, changeFrequency: "monthly" },
  { path: "/ui-components", priority: 0.9, changeFrequency: "weekly" },
  { path: "/components", priority: 0.9, changeFrequency: "weekly" },
  { path: "/buttons", priority: 0.9, changeFrequency: "weekly" },
  { path: "/buttons/tactile-pill-button", priority: 0.85, changeFrequency: "weekly" },
  { path: "/buttons/scaling-capsule-button", priority: 0.85, changeFrequency: "weekly" },
  { path: "/buttons/animated-slide-button", priority: 0.8, changeFrequency: "weekly" },
  { path: "/buttons/magnetic-pulse-cta", priority: 0.8, changeFrequency: "weekly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },

  // ── Main Tools Hub
  { path: "/tools", priority: 0.95, changeFrequency: "weekly" as const },

  // ── 4 Category Pillar Hubs (Hierarchical SEO structure)
  { path: "/tools/saas", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/tools/website", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/tools/design", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/tools/ai", priority: 0.9, changeFrequency: "weekly" as const },

  // ── 1. SaaS & Product UX (Core Agency Expertise)
  { path: "/tools/saas/saas-ux-audit", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/tools/saas/pricing-page-analyzer", priority: 0.85, changeFrequency: "monthly" as const },
  { path: "/tools/saas/dashboard-analyzer", priority: 0.85, changeFrequency: "monthly" as const },
  { path: "/tools/saas/saas-onboarding-analyzer", priority: 0.85, changeFrequency: "monthly" as const },

  // ── 2. Website & Conversion Tools (Commercial CRO)
  { path: "/tools/website/landing-page-analyzer", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/tools/website/saas-website-audit", priority: 0.85, changeFrequency: "monthly" as const },
  { path: "/tools/website/cta-analyzer", priority: 0.85, changeFrequency: "monthly" as const },
  { path: "/tools/website/website-readability-checker", priority: 0.85, changeFrequency: "monthly" as const },
  { path: "/tools/website/homepage-seo-checker", priority: 0.85, changeFrequency: "monthly" as const },
  { path: "/tools/website/website-performance-score", priority: 0.85, changeFrequency: "monthly" as const },
  { path: "/tools/website/ux-audit", priority: 0.85, changeFrequency: "monthly" as const },

  // ── 3. Design Systems & Code
  { path: "/tools/design/design-tokens", priority: 0.85, changeFrequency: "monthly" as const },
  { path: "/tools/design/color-palette-generator", priority: 0.85, changeFrequency: "monthly" as const },
  { path: "/tools/design/contrast-checker", priority: 0.85, changeFrequency: "monthly" as const },
  { path: "/tools/design/figma-spacing-calculator", priority: 0.85, changeFrequency: "monthly" as const },
  { path: "/tools/design/css-shadow-generator", priority: 0.85, changeFrequency: "monthly" as const },
  { path: "/tools/design/border-radius-generator", priority: 0.85, changeFrequency: "monthly" as const },
  { path: "/tools/design/typography-scale-generator", priority: 0.85, changeFrequency: "monthly" as const },
  { path: "/tools/design/css-to-tailwind-converter", priority: 0.85, changeFrequency: "monthly" as const },
  { path: "/tools/design/svg-optimizer", priority: 0.85, changeFrequency: "monthly" as const },
  { path: "/tools/design/breakpoint-generator", priority: 0.85, changeFrequency: "monthly" as const },

  // ── 4. AI & GEO Visibility Toolkit
  { path: "/tools/ai/ai-bot-checker", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/tools/ai/llms-txt-generator", priority: 0.85, changeFrequency: "monthly" as const },
  { path: "/tools/ai/robots-txt-generator", priority: 0.85, changeFrequency: "monthly" as const },
  { path: "/tools/ai/robots-txt-validator", priority: 0.85, changeFrequency: "monthly" as const },
  { path: "/tools/ai/schema-generator", priority: 0.85, changeFrequency: "monthly" as const },
  { path: "/tools/ai/batch-checker", priority: 0.85, changeFrequency: "monthly" as const },
  { path: "/tools/ai/geo-competitor-checker", priority: 0.85, changeFrequency: "monthly" as const },
  { path: "/tools/ai/bot-directory", priority: 0.85, changeFrequency: "monthly" as const },
];

// Service detail pages (from sericesDetailsList.json slugs)
const SERVICE_SLUGS = [
  "UX-UI-Design",
  "SaaS-&-AI-Development",
  "Landing-Pages-&-Business-Websites",
  "Design-System-&-Component-Library",
  "UX-Audits-&-Consultation",
];

// Fetches every post across all pages instead of capping at one page's worth
// — the sitemap should list all blogs/case studies, not just the first N.
// Capped at 20 pages as a safety net in case the API ever ignores `page` and
// keeps returning the same batch (would otherwise loop forever).
async function fetchAllPosts(
  listPosts: (opts: {
    page: number;
    limit: number;
  }) => Promise<Array<{ [key: string]: any }>>,
) {
  const pageSize = 100;
  const maxPages = 20;
  let all: Array<{ [key: string]: any }> = [];

  for (let page = 1; page <= maxPages; page++) {
    const batch = await listPosts({ page, limit: pageSize });

    all = all.concat(batch);
    if (batch.length < pageSize) break;
  }

  return all;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  // 1. Static pages
  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map((page) => ({
    url: `${BASE_URL}${page.path}`,
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  // 2. AI Bot Dossier pages from DETAILED_BOTS registry
  const botEntries: MetadataRoute.Sitemap = DETAILED_BOTS.map((bot) => ({
    url: `${BASE_URL}/tools/ai/bot-directory/${bot.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // 3. Service detail pages
  const serviceEntries: MetadataRoute.Sitemap = SERVICE_SLUGS.map((slug) => ({
    url: `${BASE_URL}/services/${encodeURIComponent(slug)}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // 4. Apps4sale products
  const apps4saleEntries: MetadataRoute.Sitemap = apps4saleProducts.map(
    (product) => ({
      url: `${BASE_URL}/apps4sale/${product.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }),
  );

  // 5. Blog posts and CMS case studies from API
  // CMS posts tagged postType "case-study" live under /case-studies, not /[slug] —
  // route their sitemap entries there instead of listing them as blog posts.
  // (Previously skipped this fetch during `next build` via a NEXT_PHASE check,
  // meant to avoid a build-time hang — but that guard also silently skipped it
  // in production, since ISR regeneration never got past it. The try/catch
  // below already protects against a genuinely slow/failing API, so the fetch
  // now always runs.)
  let blogEntries: MetadataRoute.Sitemap = [];
  let cmsCaseStudyEntries: MetadataRoute.Sitemap = [];

  try {
    const { listPosts } = await import("@/lib/pirateCOS/public-client");
    const posts = await fetchAllPosts(listPosts);

    blogEntries = posts
      .filter((post: any) => post.postType !== "case-study")
      .map((blog: any) => ({
        url: `${BASE_URL}/${blog.slug}`,
        lastModified: blog.updatedAt
          ? new Date(blog.updatedAt).toISOString()
          : now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));

    cmsCaseStudyEntries = posts
      .filter((post: any) => post.postType === "case-study")
      .map((study: any) => ({
        url: `${BASE_URL}/case-studies/${study.slug}`,
        lastModified: study.updatedAt
          ? new Date(study.updatedAt).toISOString()
          : now,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      }));
  } catch (error) {
    // Silently handle API errors — sitemap still works with static entries
    console.warn("Sitemap: Could not fetch blog posts from API:", error);
  }

  // Combine and deduplicate URLs by exact 'url' property
  const allEntries = [
    ...staticEntries,
    ...botEntries,
    ...serviceEntries,
    ...cmsCaseStudyEntries,
    ...blogEntries,
    ...apps4saleEntries,
  ];

  const seenUrls = new Set<string>();
  const uniqueEntries: MetadataRoute.Sitemap = [];

  for (const entry of allEntries) {
    if (!seenUrls.has(entry.url)) {
      seenUrls.add(entry.url);
      uniqueEntries.push(entry);
    }
  }

  return uniqueEntries;
}
