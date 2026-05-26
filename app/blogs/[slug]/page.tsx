import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";

import BlogsDetails from "@/screens/blogsDetails";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import { trackView } from "@/lib/trackView";
import { verifyAuth } from "@/lib/pirateCOS/auth";

interface Props {
  params: { slug: string };
}

// Generate dynamic metadata for search engines and social sharing (SEO)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;

  try {
    await dbConnect();
    const escapedSlug = slug.replace(/[/\-\\^$*+?.()|[\]{}]/g, "\\$&");
    const blog = await Post.findOne({
      slug: { $regex: new RegExp(`^${escapedSlug}$`, "i") },
      published: true,
    }).lean();

    if (!blog) {
      return {
        title: "Blog Post Not Found | UI Pirate",
        description: "The requested blog post could not be found.",
      };
    }

    const seo = (blog as any).seo;

    // Use seo.metaTitle as the page title, fallback to the blog title
    const metaTitle = seo?.metaTitle?.trim() || (blog as any).title;
    const title = seo?.metaTitle?.trim()
      ? seo.metaTitle.trim()
      : `${(blog as any).title} | UI Pirate Blog`;

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

    // Configure OG and Twitter cards images: seo.ogImage fallback to featuredImage or bannerImage
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

    // Twitter fields
    const twitterCard = seo?.twitterCard || "summary_large_image";

    return {
      title,
      description,
      keywords,
      openGraph: {
        title: ogTitle,
        description: ogDescription,
        url: `https://uipirate.com/blogs/${slug}`,
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
      title: "Blog | UI Pirate",
      description: "UI/UX design insights, case studies, and tutorials.",
    };
  }
}

// Pre-render dynamic paths at build time (SSG optimization)
export async function generateStaticParams() {
  try {
    await dbConnect();
    const blogs = await Post.find({ published: true }, { slug: 1 }).lean();

    return blogs.map((blog: any) => ({ slug: blog.slug }));
  } catch (error) {
    return [];
  }
}

export const dynamicParams = true;

const BlogsDetailsPage = async ({ params }: Props) => {
  const { slug } = params;

  if (slug !== slug.toLowerCase()) {
    redirect(`/blogs/${slug.toLowerCase()}`);
  }

  await dbConnect();

  // Fetch blog by slug
  const escapedSlug = slug.replace(/[/\-\\^$*+?.()|[\]{}]/g, "\\$&");
  const blog = await Post.findOne({
    slug: { $regex: new RegExp(`^${escapedSlug}$`, "i") },
    published: true,
  }).lean();

  if (!blog) {
    notFound();
  }

  // Track this view: deduplicates by IP+slug with 24h TTL, filters bots, skips admins
  const user = await verifyAuth();

  trackView(slug, headers(), !!user).catch(() => {});

  // Convert MongoDB document to plain object
  const blogData = {
    ...blog,
    _id: blog._id.toString(),
    createdAt: blog.createdAt.toISOString(),
    updatedAt: blog.updatedAt.toISOString(),
    publishedAt: blog.publishedAt?.toISOString() || null,
  };

  return (
    <div>
      {/* Blog post JSON-LD for search engine rich snippets */}
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: (blog as any).title,
            description: (blog as any).excerpt || (blog as any).description,
            image:
              (blog as any).featuredImage ||
              (blog as any).bannerImage ||
              undefined,
            author: {
              "@type": "Person",
              name: (blog as any).author?.name || "UI Pirate by Vishal Anand",
              url: "https://uipirate.com",
            },
            publisher: {
              "@type": "Organization",
              name: "UI Pirate",
              logo: {
                "@type": "ImageObject",
                url: "https://res.cloudinary.com/damm9iwho/image/upload/v1731044026/newfavicon_ibmap0.svg",
              },
            },
            datePublished:
              blog.publishedAt?.toISOString() || blog.createdAt.toISOString(),
            dateModified: blog.updatedAt.toISOString(),
            url: `https://uipirate.com/blogs/${slug}`,
            mainEntityOfPage: `https://uipirate.com/blogs/${slug}`,
          }),
        }}
        type="application/ld+json"
      />
      <BlogsDetails blog={blogData} />
    </div>
  );
};

export default BlogsDetailsPage;
