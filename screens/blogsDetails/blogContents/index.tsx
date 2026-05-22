import { useMemo } from "react";
import HeaderInfo from "./headeInfo";
import GlobalCTA from "@/components/GlobalCTA";

interface BlogData {
  _id: string;
  title: string;
  content: string;
  author: {
    name: string;
    email: string;
  };
  createdAt: string;
  publishedAt: string | null;
  views?: number;
  readTime?: number;
}

interface BlogContentsProps {
  blog: BlogData;
}

const BlogContents = ({ blog }: BlogContentsProps) => {
  const sanitizedContent = useMemo(() => {
    let content = blog.content || "";

    // 1. Unwrap outermost styling div if it exists in the cached payload
    const trimmed = content.trim();
    if (trimmed.startsWith("<div") && trimmed.endsWith("</div>")) {
      const firstCloseTagIndex = trimmed.indexOf(">");
      const lastOpenTagIndex = trimmed.lastIndexOf("</div");
      if (firstCloseTagIndex !== -1 && lastOpenTagIndex !== -1 && trimmed.substring(0, firstCloseTagIndex).includes("blog-post-content")) {
        content = trimmed.substring(firstCloseTagIndex + 1, lastOpenTagIndex);
      }
    }

    // 2. Remove low-contrast color/background classes dynamically
    content = content.replace(/\s+class="[^"]*"/gi, (match) => {
      if (
        match.includes("text-gray") ||
        match.includes("text-white") ||
        match.includes("bg-gray") ||
        match.includes("bg-charcoal") ||
        match.includes("blog-post-content")
      ) {
        return "";
      }
      return match;
    });

    return content;
  }, [blog.content]);

  return (
    <article className="container mx-auto xl:px-32 2xl:px-40 max-md:px-4 max-md:pt-0 max-xl:px-8 pt-8">
      {/* Bulletproof CSS injection to bypass Next.js compilation cache and force high-contrast colors */}
      <style dangerouslySetInnerHTML={{ __html: `
        .blog-prose {
          color: #1a1a1a !important;
        }
        .blog-prose p {
          color: #1a1a1a !important;
        }
        .blog-prose li {
          color: #1a1a1a !important;
        }
        .blog-prose h1,
        .blog-prose h2,
        .blog-prose h3,
        .blog-prose h4 {
          color: #111111 !important;
        }
        .blog-prose strong {
          color: #111111 !important;
        }
        .blog-prose em {
          color: #444444 !important;
        }
      ` }} />

      <HeaderInfo blog={blog} />

      {/* Blog Content */}
      <div
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        className="blog-prose mt-10 mb-16"
      />

      {/* CTA Banner — convert engaged readers into leads */}
      <GlobalCTA />
    </article>
  );
};

export default BlogContents;
