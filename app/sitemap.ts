import { MetadataRoute } from "next";

/**
 * Dynamic sitemap generation for Next.js App Router.
 * Replaces the static public/sitemap.xml with auto-generated entries.
 *
 * Benefits:
 * - Automatically picks up new blog posts from the database
 * - Always has correct lastModified dates
 * - No manual maintenance required
 */

const BASE_URL = "https://uipirate.com";

// Static pages with their priorities and change frequencies
const STATIC_PAGES: {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"];
}[] = [
  { path: "/", priority: 1.0, changeFrequency: "daily" },
  { path: "/services", priority: 0.95, changeFrequency: "weekly" },
  { path: "/ourWorks", priority: 0.95, changeFrequency: "weekly" },
  { path: "/pricing", priority: 0.9, changeFrequency: "weekly" },
  { path: "/blogs", priority: 0.85, changeFrequency: "weekly" },
  { path: "/contact", priority: 0.85, changeFrequency: "monthly" },
  { path: "/case-studies", priority: 0.85, changeFrequency: "weekly" },
  { path: "/faqs", priority: 0.8, changeFrequency: "monthly" },
  { path: "/resources", priority: 0.7, changeFrequency: "monthly" },
  { path: "/community", priority: 0.7, changeFrequency: "monthly" },
  { path: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
  { path: "/sitemap", priority: 0.3, changeFrequency: "monthly" },
];

// Service detail pages (from sericesDetailsList.json slugs)
const SERVICE_SLUGS = [
  "SaaS-Web-&-Mobile-Apps",
  "Landing-Pages-&-Business-Websites",
  "Design-System-&-Component-Library",
  "Graphic-Design",
  "Motion-Graphics-&-Video-Editing",
  "UX-Audits-&-Consultation",
  "3D-Animation-&-Rendering",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  // 1. Static pages
  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map((page) => ({
    url: `${BASE_URL}${page.path}`,
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  // 2. Service detail pages
  const serviceEntries: MetadataRoute.Sitemap = SERVICE_SLUGS.map((slug) => ({
    url: `${BASE_URL}/services/${encodeURIComponent(slug)}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // 3. Blog posts from database (fetched at build/request time)
  let blogEntries: MetadataRoute.Sitemap = [];
  try {
    // Use internal API or direct DB query if available
    const mongodbUri = process.env.MONGODB_URI;
    if (mongodbUri) {
      const { default: mongoose } = await import("mongoose");

      // Connect if not already connected
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(mongodbUri);
      }

      // Use the Blog model
      const { default: Blog } = await import("@/models/Blog");
      const blogs = await Blog.find(
        { status: "published" },
        { slug: 1, updatedAt: 1 }
      ).lean();

      blogEntries = blogs.map((blog: any) => ({
        url: `${BASE_URL}/${blog.slug}`,
        lastModified: blog.updatedAt
          ? new Date(blog.updatedAt).toISOString()
          : now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    }
  } catch (error) {
    // Silently handle DB errors — sitemap still works with static entries
    console.warn("Sitemap: Could not fetch blog posts from database:", error);
  }

  return [...staticEntries, ...serviceEntries, ...blogEntries];
}
