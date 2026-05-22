/**
 * DEVELOPER NOTICE & BLOG FORMATTING RULES:
 * 
 * To ensure high-contrast accessibility (avoiding low-contrast grey or white text on white backgrounds)
 * and full responsive scaling across all viewports, all dynamically generated blog HTML content must:
 *   1. Use only clean semantic HTML tags (<p>, <h2>, <h3>, <ul>, <ol>, <li>, <strong>, <em>, <blockquote>, <table>, etc.)
 *   2. Strictly contain NO custom inline styles (e.g. style="...")
 *   3. Strictly contain NO custom class attributes (e.g. class="..." or className="...")
 *   4. Strictly contain NO custom wrapper divs (e.g. <div class="bg-charcoal text-gray-200">)
 * 
 * All typography, styling, margins, and custom branding rules are defined globally inside styles/globals.css
 * under the `.blog-prose` selector family.
 * 
 * For full detailed rules and the recommended system prompt for AI-auto-generation,
 * please refer to the root file: /BLOG_FORMATTING_RULES.md
 */

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
  totalViews?: number;
  botViews?: number;
  duplicateViews?: number;
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
      <GlobalCTA topic={blog.title} />
    </article>
  );
};

export default BlogContents;
