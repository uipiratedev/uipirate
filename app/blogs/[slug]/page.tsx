import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";


import BlogsDetails from "@/screens/blogsDetails";
import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";

interface Props {
  params: { slug: string };
}

// Generate dynamic metadata for search engines and social sharing (SEO)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;

  try {
    await dbConnect();
    const escapedSlug = slug.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
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

    const title = `${(blog as any).title} | UI Pirate Blog`;
    const description =
      (blog as any).excerpt ||
      (blog as any).description ||
      `Read ${(blog as any).title} on UI Pirate's design blog.`;
    const imageUrl = (blog as any).featuredImage || (blog as any).bannerImage || "";

    return {
      title,
      description,
      keywords: (blog as any).tags?.join(", ") || "UI/UX, design tips, SaaS design, UI Pirate",
      openGraph: {
        title: (blog as any).title,
        description,
        url: `https://uipirate.com/blogs/${slug}`,
        siteName: "UI Pirate by Vishal Anand",
        images: imageUrl
          ? [
              {
                url: imageUrl,
                width: 1200,
                height: 630,
                alt: (blog as any).title,
              },
            ]
          : [],
        locale: "en_US",
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: (blog as any).title,
        description,
        images: imageUrl ? [imageUrl] : [],
      },
      alternates: {
        // Point canonical to the primary URL indexed in sitemap (https://uipirate.com/[slug])
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

// Pre-render dynamic paths at build time (SSG optimization)
export async function generateStaticParams() {
  try {
    await dbConnect();
    const blogs = await Blog.find({ published: true }, { slug: 1 }).lean();
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
  const escapedSlug = slug.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
  const blog = await Blog.findOne({
    slug: { $regex: new RegExp(`^${escapedSlug}$`, "i") },
    published: true,
  }).lean();

  if (!blog) {
    notFound();
  }

  // Increment view count (don't await to avoid blocking)
  Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } }).exec();

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
            image: (blog as any).featuredImage || (blog as any).bannerImage || undefined,
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
            datePublished: blog.publishedAt?.toISOString() || blog.createdAt.toISOString(),
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
