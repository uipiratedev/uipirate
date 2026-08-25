// app/[slug]/page.tsx
// This route handles dynamic blog post pages at uipirate.com/[slug]
import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { headers } from "next/headers";

import BlogsDetails from "@/screens/blogsDetails";
import {
  getPostBySlug,
  listPostSlugs,
  listPosts,
} from "@/lib/pirateCOS/public-client";
import { trackView } from "@/lib/trackView";
import { verifyAuth } from "@/lib/pirateCOS/auth";

interface Props {
  params: { slug: string };
}

// ISR: revalidate published detail pages every 60s.
export const revalidate = 60;

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  const blog = await getPostBySlug(slug.toLowerCase());

  // Case studies live at /case-studies/[slug]; keep metadata consistent with
  // the page-level redirect below instead of emitting a canonical that
  // points back at this now-redirected URL. Kept outside the try/catch:
  // permanentRedirect() works by throwing, and that catch would otherwise
  // swallow it and fall through to the generic "Blog" metadata.
  if ((blog as any)?.postType === "case-study") {
    permanentRedirect(`/case-studies/${slug}`);
  }

  try {
    if (!blog) {
      return {
        title: "Blog Post Not Found",
        description: "The requested blog post could not be found.",
      };
    }

    const seo = (blog as any).seo;

    // Use seo.metaTitle as the page title, fallback to the blog title
    const title = seo?.metaTitle?.trim()
      ? seo.metaTitle.trim()
      : `${(blog as any).title} | Blog`;

    // Use seo.metaDescription as the description, fallback to the blog excerpt/description
    const description =
      seo?.metaDescription?.trim() ||
      (blog as any).excerpt ||
      (blog as any).description ||
      `Read ${(blog as any).title} on UI Pirate's design blog.`;

    // Map keywords: seo.keywords array joined, fallback to blog.tags array joined
    const keywords =
      seo?.keywords && Array.isArray(seo.keywords) && seo.keywords.length > 0
        ? seo.keywords.join(", ")
        : (blog as any).tags?.join(", ") ||
          "UI/UX, design tips, SaaS design, UI Pirate";

    // Configure OG and Twitter card images: seo.ogImage fallback to featuredImage or bannerImage
    const imageUrl =
      seo?.ogImage?.trim() ||
      (blog as any).featuredImage ||
      (blog as any).bannerImage ||
      "";

    // OG fields with custom title/description support (preferring SEO first, falling back to what it was currently using)
    const ogTitle =
      seo?.ogTitle?.trim() || seo?.metaTitle?.trim() || (blog as any).title;
    const ogDescription =
      seo?.ogDescription?.trim() ||
      seo?.metaDescription?.trim() ||
      (blog as any).excerpt ||
      (blog as any).description ||
      `Read ${(blog as any).title} on UI Pirate's design blog.`;

    const twitterCard = seo?.twitterCard || "summary_large_image";

    return {
      title,
      description,
      keywords,
      openGraph: {
        title: ogTitle,
        description: ogDescription,
        url: `https://uipirate.com/${slug}`,
        siteName: "UI Pirate by Vishal Anand",
        images: imageUrl
          ? [
              {
                url: imageUrl,
                width: 1200,
                height: 630,
                alt: ogTitle,
              },
            ]
          : [],
        locale: "en_US",
        type: "article",
      },
      twitter: {
        card: twitterCard,
        title: ogTitle,
        description: ogDescription,
        images: imageUrl ? [imageUrl] : [],
      },
      alternates: {
        canonical: seo?.canonicalUrl?.trim() || `https://uipirate.com/${slug}`,
      },
      robots: seo?.noIndex ? { index: false, follow: false } : undefined,
    };
  } catch (error) {
    return {
      title: "Blog",
      description: "UI/UX design insights, case studies, and tutorials.",
    };
  }
}

// Generate static params for known blog posts at build time
export async function generateStaticParams() {
  const slugs = await listPostSlugs();

  return slugs.map((slug) => ({ slug }));
}

// Allow dynamic params to be generated on-demand
export const dynamicParams = true;

export default async function DynamicBlogPage({ params }: Props) {
  const { slug } = params;

  if (slug !== slug.toLowerCase()) {
    permanentRedirect(`/${slug.toLowerCase()}`);
  }

  // Fetch blog by slug through the tenant-scoped v1 API
  const blog = await getPostBySlug(slug);

  if (!blog) {
    notFound();
  }

  // Case studies are authored here with postType "case-study" but belong
  // under /case-studies, not the blog template — send them to their real home.
  // Permanent (308) so Google consolidates ranking signals into the
  // canonical /case-studies URL instead of indexing both.
  // (Kept outside the try/catch below: redirect()/notFound() work by throwing,
  // and that catch block would otherwise swallow the redirect as a 404.)
  if ((blog as any).postType === "case-study") {
    permanentRedirect(`/case-studies/${slug}`);
  }

  try {
    // Track this view: deduplicates by IP+slug with 24h TTL, filters bots, skips admins
    const user = await verifyAuth();

    trackView(slug, headers(), !!user).catch(() => {});

    const blogData = blog;

    // Suggested reads via the tenant-scoped v1 API; exclude the current post.
    const suggested = (await listPosts({ limit: 4 }))
      .filter((p) => p._id !== blog._id)
      .slice(0, 3);

    return (
      <div>
        {/* Blog post JSON-LD for rich results */}
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: (blog as any).title,
              description: (blog as any).excerpt || (blog as any).description,
              image: (blog as any).featuredImage || undefined,
              author: {
                "@type": "Person",
                name: "Vishal Anand",
                url: "https://uipirate.com/about",
              },
              publisher: {
                "@type": "Organization",
                name: "UI Pirate",
                logo: {
                  "@type": "ImageObject",
                  url: "https://res.cloudinary.com/damm9iwho/image/upload/v1731044026/newfavicon_ibmap0.svg",
                },
              },
              datePublished: blog.publishedAt || blog.createdAt,
              dateModified: blog.updatedAt,
              url: `https://uipirate.com/${slug}`,
              mainEntityOfPage: `https://uipirate.com/${slug}`,
            }),
          }}
          type="application/ld+json"
        />
        <BlogsDetails blog={blogData} suggested={suggested} />
      </div>
    );
  } catch (error) {
    notFound();
  }
}
