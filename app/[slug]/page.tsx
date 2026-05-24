// app/[slug]/page.tsx
// This route handles dynamic blog post pages at uipirate.com/[slug]
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";

import BlogsDetails from "@/screens/blogsDetails";
import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { trackView } from "@/lib/trackView";
import { verifyAuth } from "@/lib/pirateCOS/auth";

interface Props {
  params: { slug: string };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;

  try {
    await dbConnect();
    const escapedSlug = slug.replace(/[/\-\\^$*+?.()|[\]{}]/g, "\\$&");
    const blog = await Blog.findOne({
      slug: { $regex: new RegExp(`^${escapedSlug}$`, "i") },
      published: true,
    }).lean();

    if (!blog) {
      return {
        title: "Blog Post Not Found | UI Pirate",
        description: "The requested blog post could not be found.",
      };
    }

    return {
      title: `${(blog as any).title} | UI Pirate Blog`,
      description:
        (blog as any).excerpt ||
        (blog as any).description ||
        `Read ${(blog as any).title} on UI Pirate's design blog.`,
      openGraph: {
        title: (blog as any).title,
        description:
          (blog as any).excerpt ||
          (blog as any).description ||
          `Read ${(blog as any).title} on UI Pirate's design blog.`,
        url: `https://uipirate.com/${slug}`,
        siteName: "UI Pirate by Vishal Anand",
        images: (blog as any).featuredImage
          ? [
              {
                url: (blog as any).featuredImage,
                width: 1200,
                height: 630,
                alt: (blog as any).title,
              },
            ]
          : [],
        locale: "en_US",
        type: "article",
      },
      alternates: {
        canonical: `https://uipirate.com/${slug}`,
      },
    };
  } catch (error) {
    return {
      title: "Blog | UI Pirate",
      description: "UI/UX design insights, case studies, and tutorials.",
    };
  }
}

// Generate static params for known blog posts at build time
export async function generateStaticParams() {
  try {
    await dbConnect();
    const blogs = await Blog.find({ published: true }, { slug: 1 }).lean();

    return blogs.map((blog: any) => ({ slug: blog.slug }));
  } catch (error) {
    // If DB is unavailable at build time, generate pages on-demand
    return [];
  }
}

// Allow dynamic params to be generated on-demand
export const dynamicParams = true;

export default async function DynamicBlogPage({ params }: Props) {
  const { slug } = params;

  if (slug !== slug.toLowerCase()) {
    redirect(`/${slug.toLowerCase()}`);
  }

  try {
    await dbConnect();

    const escapedSlug = slug.replace(/[/\-\\^$*+?.()|[\]{}]/g, "\\$&");
    const blog = await Blog.findOne({
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
              datePublished:
                blog.publishedAt?.toISOString() || blog.createdAt.toISOString(),
              dateModified: blog.updatedAt.toISOString(),
              url: `https://uipirate.com/${slug}`,
              mainEntityOfPage: `https://uipirate.com/${slug}`,
            }),
          }}
          type="application/ld+json"
        />
        <BlogsDetails blog={blogData} />
      </div>
    );
  } catch (error) {
    notFound();
  }
}
