"use client";

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

import { useMemo, useState, useEffect } from "react";

import HeaderInfo from "./headeInfo";

import GlobalCTA from "@/components/GlobalCTA";

// ── TOC helpers ───────────────────────────────────────────────────────────────
function slugifyHeading(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-").replace(/--+/g, "-");
}

function parseHeadings(html: string): { id: string; text: string; level: 2 | 3 }[] {
  const out: { id: string; text: string; level: 2 | 3 }[] = [];
  const seen: Record<string, number> = {};
  let m: RegExpExecArray | null;
  const re = /<h([23])[^>]*>([\s\S]*?)<\/h\1>/gi;
  while ((m = re.exec(html))) {
    const lvl = parseInt(m[1]) as 2 | 3;
    const txt = m[2].replace(/<[^>]+>/g, "").trim();
    if (!txt) continue;
    let id = slugifyHeading(txt);
    if (seen[id] != null) { seen[id]++; id += `-${seen[id]}`; } else { seen[id] = 0; }
    out.push({ id, text: txt, level: lvl });
  }
  return out;
}

function injectHeadingIds(html: string): string {
  const seen: Record<string, number> = {};
  return html.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi, (_, lvl, attrs, inner) => {
    const txt = inner.replace(/<[^>]+>/g, "").trim();
    if (!txt) return _;
    let id = slugifyHeading(txt);
    if (seen[id] != null) { seen[id]++; id += `-${seen[id]}`; } else { seen[id] = 0; }
    return `<h${lvl}${attrs.replace(/\s*id="[^"]*"/gi, "")} id="${id}">${inner}</h${lvl}>`;
  });
}

interface PostSEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterHandle?: string;
  twitterCard?: "summary" | "summary_large_image";
  focusKeyword?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

interface BlogData {
  _id: string;
  title: string;
  content: string;
  excerpt?: string;
  tags?: string[];
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
  seo?: PostSEO;
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

      if (
        firstCloseTagIndex !== -1 &&
        lastOpenTagIndex !== -1 &&
        trimmed.substring(0, firstCloseTagIndex).includes("blog-post-content")
      ) {
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

  const headings = useMemo(() => parseHeadings(sanitizedContent), [sanitizedContent]);
  const processedContent = useMemo(() => injectHeadingIds(sanitizedContent), [sanitizedContent]);
  const [activeId, setActiveId] = useState("");
  const hasToc = headings.length >= 2;

  useEffect(() => {
    if (!headings.length) return;
    const handleScroll = () => {
      // Walk headings in order; keep updating `current` as long as the heading
      // has scrolled past the 120 px mark from the top of the viewport.
      let current = headings[0].id;
      for (const { id } of headings) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) {
          current = id;
        }
      }
      setActiveId(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // initialise on mount so the first heading is highlighted immediately
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  return (
    <article className="container mx-auto xl:px-32 2xl:px-40 max-md:px-4 max-md:pt-0 max-xl:px-8 pt-8">
      {/* Bulletproof CSS injection to bypass Next.js compilation cache and force high-contrast colors */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
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

        /* ── Table layout ─────────────────────────────────────────────────────
           globals.css owns the visual table design (border-radius, shadow, colors).
           This block only enforces full-width and readable cell colours so the
           injected overrides don't fight globals.css's border-collapse:separate.
           overflow-x: auto on .blog-prose-scroll-wrapper handles mobile overflow. */
        .blog-prose table {
          width: 100% !important;
          min-width: 100% !important;
        }
        .blog-prose td,
        .blog-prose th {
          color: #1a1a1a !important;
          word-break: break-word;
        }

        /* Mobile horizontal scroll: applied to the prose wrapper via a
           sibling selector so the DOM payload stays class-free.           */
        .blog-prose-scroll-wrapper {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
      `,
        }}
      />

      <HeaderInfo blog={blog} />

      {/* Tags — pill list matching PostPreviewPanel styling */}
      {blog.tags && blog.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-6">
          {blog.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-0.5 rounded-full"
              style={{ background: "#FFF0E8", color: "#FF5B04", fontFamily: "var(--font-geist)" }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Excerpt / subtitle — pull-quote style matching PostPreviewPanel */}
      {blog.excerpt && (
        <p
          className="mt-6 text-lg leading-relaxed pl-4 border-l-4 border-orange-200"
          style={{ color: "#6b7280", fontFamily: "var(--font-jakarta, var(--font-sans))" }}
        >
          {blog.excerpt}
        </p>
      )}

      {/* Content + sticky TOC — two-column when ≥2 headings are present */}
      {/* NOTE: no items-start — aside must stretch to full article height so sticky has room to travel */}
      <div className={`mt-10 mb-16 ${hasToc ? "flex gap-12" : ""}`}>
        {/* blog-prose-scroll-wrapper enables horizontal scroll for wide tables
            on mobile without letting them push past the flex-1 column boundary. */}
        <div className="blog-prose-scroll-wrapper min-w-0 flex-1">
          <div
            className="blog-prose"
            dangerouslySetInnerHTML={{ __html: processedContent }}
          />
        </div>

        {hasToc && (
          <aside className="hidden xl:block flex-shrink-0" style={{ width: 220 }}>
            <div className="sticky top-24 bg-gray-50 border border-gray-100 rounded-3xl p-6">
              <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-4">
                Contents
              </p>
              <nav className="flex flex-col gap-2">
                {headings.map((h) => (
                  <a
                    key={h.id}
                    className="text-sm transition-colors py-1 px-2 rounded-lg truncate"
                    href={`#${h.id}`}
                    style={{
                      paddingLeft: h.level === 3 ? "1rem" : undefined,
                      color: activeId === h.id ? "#FF5B04" : "#4b5563",
                      fontWeight: activeId === h.id ? 600 : 400,
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                      setActiveId(h.id);
                    }}
                  >
                    {h.text}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        )}
      </div>

      {/* CTA Banner — convert engaged readers into leads */}
      <GlobalCTA topic={blog.title} />
    </article>
  );
};

export default BlogContents;
