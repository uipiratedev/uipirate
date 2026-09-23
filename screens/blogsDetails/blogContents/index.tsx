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

import { useMemo, useState, useEffect, useRef } from "react";

import HeaderInfo from "./headeInfo";

import GlobalCTA from "@/components/GlobalCTA";

// ── TOC helpers ───────────────────────────────────────────────────────────────
function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-");
}

function parseHeadings(
  html: string,
): { id: string; text: string; level: 2 | 3 }[] {
  const out: { id: string; text: string; level: 2 | 3 }[] = [];
  const seen: Record<string, number> = {};
  let m: RegExpExecArray | null;
  const re = /<h([23])[^>]*>([\s\S]*?)<\/h\1>/gi;

  while ((m = re.exec(html))) {
    const lvl = parseInt(m[1]) as 2 | 3;
    const txt = m[2].replace(/<[^>]+>/g, "").trim();

    if (!txt) continue;
    let id = slugifyHeading(txt);

    if (seen[id] != null) {
      seen[id]++;
      id += `-${seen[id]}`;
    } else {
      seen[id] = 0;
    }
    out.push({ id, text: txt, level: lvl });
  }

  return out;
}

function injectHeadingIds(html: string): string {
  const seen: Record<string, number> = {};

  return html.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (_, lvl, attrs, inner) => {
      const txt = inner.replace(/<[^>]+>/g, "").trim();

      if (!txt) return _;
      let id = slugifyHeading(txt);

      if (seen[id] != null) {
        seen[id]++;
        id += `-${seen[id]}`;
      } else {
        seen[id] = 0;
      }

      return `<h${lvl}${attrs.replace(/\s*id="[^"]*"/gi, "")} id="${id}">${inner}</h${lvl}>`;
    },
  );
}

function injectHexColorDots(html: string): string {
  const protectedBlocks: string[] = [];

  // 1. Protect <pre> blocks so multiline code snippets are untouched
  let out = html.replace(/<pre[\s\S]*?<\/pre>/gi, (match) => {
    protectedBlocks.push(match);
    return `___BLOCK_${protectedBlocks.length - 1}___`;
  });

  // 2. Process and protect inline <code> blocks: if they contain hex colors, inject dot
  out = out.replace(
    /(<code[^>]*>)([\s\S]*?)(<\/code>)/gi,
    (match, openTag, inner, closeTag) => {
      if (inner.includes("hex-color-dot")) {
        protectedBlocks.push(match);
        return `___BLOCK_${protectedBlocks.length - 1}___`;
      }
      const replaced = inner.replace(
        /(?<![0-9a-zA-Z])#([0-9a-fA-F]{6}|[0-9a-fA-F]{8}|[0-9a-fA-F]{3})(?![0-9a-zA-Z])/g,
        (hex: string) =>
          `<span class="hex-color-dot" style="background-color: ${hex};"></span>${hex}`,
      );
      protectedBlocks.push(`${openTag}${replaced}${closeTag}`);
      return `___BLOCK_${protectedBlocks.length - 1}___`;
    },
  );

  // 3. For any standalone hex codes in remaining plain text outside tags, wrap in <code> with dot
  out = out.replace(
    /(<[^>]+>)|((?<![0-9a-zA-Z])#([0-9a-fA-F]{6}|[0-9a-fA-F]{8}|[0-9a-fA-F]{3})(?![0-9a-zA-Z]))/g,
    (fullMatch, tagMatch, hexMatch) => {
      if (tagMatch) return tagMatch;
      if (hexMatch) {
        return `<code class="inline-hex-code"><span class="hex-color-dot" style="background-color: ${hexMatch};"></span>${hexMatch}</code>`;
      }
      return fullMatch;
    },
  );

  // 4. Restore protected blocks
  out = out.replace(
    /___BLOCK_(\d+)___/g,
    (_, idx) => protectedBlocks[Number(idx)] || "",
  );

  return out;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function highlightCode(rawCode: string, _language = "CSS"): string {
  const code = rawCode
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  const lines = code.split("\n");
  const highlighted = lines.map((line) => {
    if (!line.trim()) return line;

    // Comments
    if (line.trim().startsWith("/*") || line.trim().startsWith("//")) {
      return `<span class="token-comment">${escapeHtml(line)}</span>`;
    }

    // CSS property: value;
    const propMatch = line.match(/^(\s*)([a-zA-Z0-9_-]+)(\s*:\s*)(.*)$/);
    if (propMatch) {
      const [, indent, prop, colon, rest] = propMatch;

      let val = rest;
      let semi = "";
      if (val.endsWith(";")) {
        semi = ";";
        val = val.slice(0, -1);
      }

      let formattedVal = val;
      if (/var\s*\(/i.test(formattedVal)) {
        formattedVal = formattedVal.replace(
          /var\((--[a-zA-Z0-9_-]+)\)/g,
          '<span class="token-func">var</span>(<span class="token-var">$1</span>)',
        );
      } else if (/^#[0-9a-fA-F]{3,8}$/.test(formattedVal.trim())) {
        formattedVal = `<span class="token-val">${formattedVal}</span>`;
      } else if (
        /^\d+(?:\.\d+)?(?:px|rem|em|%|vh|vw|s|ms|deg|fr)?$/.test(
          formattedVal.trim(),
        )
      ) {
        formattedVal = `<span class="token-val">${formattedVal}</span>`;
      } else {
        formattedVal = formattedVal
          .replace(/(#[0-9a-fA-F]{3,8})/g, '<span class="token-val">$1</span>')
          .replace(
            /\b(\d+(?:\.\d+)?(?:px|rem|em|%|vh|vw|s|ms|deg)?)\b/g,
            '<span class="token-val">$1</span>',
          );
      }

      return `${indent}<span class="token-prop">${prop}</span><span class="token-punct">${colon}</span>${formattedVal}${
        semi ? '<span class="token-punct">;</span>' : ""
      }`;
    }

    return escapeHtml(line);
  });

  return highlighted.join("\n");
}

function formatCodeBlocks(html: string): string {
  return html.replace(
    /<pre([^>]*)>([\s\S]*?)<\/pre>/gi,
    (fullPre, preAttrs, inner) => {
      if (preAttrs.includes("code-block-pre")) return fullPre;

      let cleanCode = inner;
      let lang = "CSS";

      const codeMatch = inner.match(/<code([^>]*)>([\s\S]*?)<\/code>/i);
      if (codeMatch) {
        cleanCode = codeMatch[2];
        const codeAttrs = codeMatch[1];
        const langMatch = `${codeAttrs} ${preAttrs}`.match(
          /class="[^"]*(?:language-|lang-)([a-zA-Z0-9_-]+)/i,
        );
        if (langMatch) {
          lang = langMatch[1].toUpperCase();
        }
      }

      if (lang === "CSS") {
        const textSample = cleanCode.replace(/<[^>]+>/g, "");
        if (/(import\s+.*from|const\s+\w+\s*=|export\s+default)/i.test(textSample)) {
          lang = "TypeScript";
        } else if (/^\s*[{[]/i.test(textSample.trim()) && /":\s*"/i.test(textSample)) {
          lang = "JSON";
        } else if (/<\/?[a-z][\s\S]*>/i.test(textSample) && !/var\(/.test(textSample)) {
          lang = "HTML";
        }
      }

      const plainTextForCopy = cleanCode
        .replace(/<[^>]+>/g, "")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim();

      const highlighted = highlightCode(cleanCode, lang);

      return (
        `<div class="code-block-wrapper">` +
        `<div class="code-block-header">` +
        `<div class="code-block-lang">` +
        `<svg class="code-lang-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">` +
        `<polyline points="16 18 22 12 16 6"></polyline>` +
        `<polyline points="8 6 2 12 8 18"></polyline>` +
        `</svg>` +
        `<span>${lang}</span>` +
        `</div>` +
        `<button class="copy-code-btn" type="button" aria-label="Copy code" title="Copy code" data-code="${encodeURIComponent(plainTextForCopy)}">` +
        `<svg class="copy-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">` +
        `<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>` +
        `<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>` +
        `</svg>` +
        `<svg class="check-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">` +
        `<polyline points="20 6 9 17 4 12"></polyline>` +
        `</svg>` +
        `</button>` +
        `</div>` +
        `<pre class="code-block-pre"><code class="code-block-content">${highlighted}</code></pre>` +
        `</div>`
      );
    },
  );
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

  const headings = useMemo(
    () => parseHeadings(sanitizedContent),
    [sanitizedContent],
  );
  const processedContent = useMemo(
    () =>
      formatCodeBlocks(
        injectHexColorDots(injectHeadingIds(sanitizedContent)),
      ),
    [sanitizedContent],
  );
  const [activeId, setActiveId] = useState("");
  const hasToc = headings.length >= 2;

  // Clipboard copy handler for code blocks
  useEffect(() => {
    const handleCopyClick = async (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const btn = target?.closest<HTMLButtonElement>(".copy-code-btn");

      if (!btn) return;

      e.preventDefault();
      e.stopPropagation();

      const encodedCode = btn.getAttribute("data-code");

      if (!encodedCode) return;

      try {
        const textToCopy = decodeURIComponent(encodedCode);

        await navigator.clipboard.writeText(textToCopy);

        btn.classList.add("copied");
        const originalTitle = btn.getAttribute("title") || "Copy code";

        btn.setAttribute("title", "Copied!");

        setTimeout(() => {
          btn.classList.remove("copied");
          btn.setAttribute("title", originalTitle);
        }, 2000);
      } catch (err) {
        console.error("Failed to copy code to clipboard:", err);
      }
    };

    document.addEventListener("click", handleCopyClick);

    return () => document.removeEventListener("click", handleCopyClick);
  }, []);

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

  const navRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const isHoveringNav = useRef(false);

  useEffect(() => {
    const updateAvailableHeight = () => {
      if (!cardRef.current || !navRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const visibleRemaining = window.innerHeight - rect.top - 24;
      const clamped = Math.max(
        260,
        Math.min(window.innerHeight - 120, visibleRemaining),
      );

      cardRef.current.style.maxHeight = `${clamped}px`;
      navRef.current.style.maxHeight = `${Math.max(180, clamped - 60)}px`;
    };

    updateAvailableHeight();
    window.addEventListener("scroll", updateAvailableHeight, { passive: true });
    window.addEventListener("resize", updateAvailableHeight);

    return () => {
      window.removeEventListener("scroll", updateAvailableHeight);
      window.removeEventListener("resize", updateAvailableHeight);
    };
  }, []);

  // Strictly isolate wheel scrolling to the TOC so main window never scrolls when hovering TOC
  useEffect(() => {
    const nav = navRef.current;

    if (!nav) return;

    const handleWheel = (e: WheelEvent) => {
      if (nav.scrollHeight > nav.clientHeight) {
        e.preventDefault();
        e.stopPropagation();
        nav.scrollTop += e.deltaY;
      }
    };

    nav.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      nav.removeEventListener("wheel", handleWheel);
    };
  }, []);

  useEffect(() => {
    // If the user is currently hovering/scrolling the TOC, don't interrupt them
    if (!activeId || !navRef.current || isHoveringNav.current) return;
    const nav = navRef.current;
    const activeEl = nav.querySelector<HTMLElement>(`[data-toc-id="${activeId}"]`);

    if (activeEl) {
      const navTop = nav.scrollTop;
      const navHeight = nav.clientHeight;
      const elTop = activeEl.offsetTop;
      const elHeight = activeEl.offsetHeight;

      if (elTop < navTop) {
        nav.scrollTo({ top: elTop, behavior: "smooth" });
      } else if (elTop + elHeight > navTop + navHeight - 16) {
        nav.scrollTo({
          top: elTop + elHeight - navHeight + 24,
          behavior: "smooth",
        });
      }
    }
  }, [activeId]);

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
        .blog-prose > p:first-of-type::first-letter,
        .blog-prose p::first-letter {
          all: unset !important;
          font-size: inherit !important;
          font-weight: inherit !important;
          float: none !important;
          line-height: inherit !important;
          margin: 0 !important;
          color: inherit !important;
          font-family: inherit !important;
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

        /* Dedicated TOC scrollbar — permanently visible by default */
        .toc-scrollbar {
          overflow-y: scroll !important;
          scrollbar-width: thin;
          scrollbar-color: #94a3b8 #f1f5f9;
        }
        .toc-scrollbar a {
          flex-shrink: 0 !important;
          min-height: 28px;
        }
        .toc-scrollbar::-webkit-scrollbar {
          width: 6px;
          display: block;
        }
        .toc-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 9999px;
        }
        .toc-scrollbar::-webkit-scrollbar-thumb {
          background: #94a3b8;
          border-radius: 9999px;
        }
        .toc-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }

        .blog-prose h2,
        .blog-prose h3 {
          scroll-margin-top: 100px;
        }

        /* Hex Color Code Badges & Dots */
        .hex-color-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-right: 5px;
          vertical-align: 0.5px;
          flex-shrink: 0;
          box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.15);
        }

        .blog-prose code:has(.hex-color-dot),
        .blog-prose code.inline-hex-code {
          display: inline-flex;
          align-items: center;
          vertical-align: middle;
        }

        .blog-prose code:has(.hex-color-dot) .hex-color-dot,
        .blog-prose code.inline-hex-code .hex-color-dot {
          margin-right: 5px;
          vertical-align: unset;
        }

        /* ── Code Block Card (Screenshot 2 Match) ────────────────────────── */
        .blog-prose .code-block-wrapper,
        .code-block-wrapper {
          margin: 2rem 0 !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 14px !important;
          background-color: #ffffff !important;
          overflow: hidden !important;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03) !important;
        }

        .blog-prose .code-block-header,
        .code-block-header {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          padding: 0.75rem 1.25rem !important;
          background-color: #ffffff !important;
          border-bottom: 1px solid #f1f5f9 !important;
          user-select: none !important;
        }

        .code-block-lang {
          display: inline-flex !important;
          align-items: center !important;
          gap: 0.45rem !important;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
          font-size: 0.8125rem !important;
          font-weight: 700 !important;
          letter-spacing: 0.03em !important;
          text-transform: uppercase !important;
          color: #334155 !important;
        }

        .code-lang-icon {
          color: #94a3b8 !important;
          flex-shrink: 0 !important;
        }

        .copy-code-btn {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          background: transparent !important;
          border: none !important;
          cursor: pointer !important;
          padding: 5px !important;
          border-radius: 6px !important;
          color: #94a3b8 !important;
          transition: all 0.15s ease-in-out !important;
        }

        .copy-code-btn:hover {
          background-color: #f1f5f9 !important;
          color: #334155 !important;
        }

        .copy-code-btn .check-icon {
          display: none !important;
        }

        .copy-code-btn.copied {
          color: #16a34a !important;
        }

        .copy-code-btn.copied .copy-icon {
          display: none !important;
        }

        .copy-code-btn.copied .check-icon {
          display: block !important;
        }

        .blog-prose pre.code-block-pre,
        pre.code-block-pre {
          background-color: #ffffff !important;
          border: none !important;
          border-radius: 0 !important;
          box-shadow: none !important;
          margin: 0 !important;
          padding: 1.25rem 1.5rem !important;
          overflow-x: auto !important;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace !important;
          font-size: 0.875rem !important;
          line-height: 1.75 !important;
          color: #1e293b !important;
        }

        .blog-prose pre.code-block-pre code,
        pre.code-block-pre code {
          background: none !important;
          border: none !important;
          padding: 0 !important;
          font-family: inherit !important;
          font-size: inherit !important;
          color: inherit !important;
        }

        /* Syntax Highlight Tokens */
        .token-prop {
          color: #dc2626 !important;
          font-weight: 400 !important;
        }
        .token-punct {
          color: #475569 !important;
        }
        .token-val {
          color: #c2410c !important;
        }
        .token-func {
          color: #2563eb !important;
        }
        .token-var {
          color: #334155 !important;
        }
        .token-comment {
          color: #94a3b8 !important;
          font-style: italic !important;
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
              style={{
                background: "#FFF0E8",
                color: "#FF5B04",
                fontFamily: "var(--font-geist)",
              }}
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
          style={{
            color: "#6b7280",
            fontFamily: "var(--font-jakarta, var(--font-sans))",
          }}
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
            dangerouslySetInnerHTML={{ __html: processedContent }}
            className="blog-prose"
          />
        </div>

        {hasToc && (
          <aside
            className="hidden xl:block flex-shrink-0"
            style={{ width: 300 }}
          >
            <div
              ref={cardRef}
              className="sticky top-24 bg-gray-50 border border-gray-100 rounded-3xl p-5 flex flex-col overflow-hidden"
              style={{ maxHeight: "calc(100vh - 120px)" }}
            >
              <p className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3 flex-shrink-0">
                Contents
              </p>
              <nav
                ref={navRef}
                className="relative flex flex-col gap-1 overflow-y-scroll pr-1.5 pb-6 toc-scrollbar flex-1 min-h-0 overscroll-contain"
                style={{ maxHeight: "calc(100vh - 180px)" }}
                onMouseEnter={() => {
                  isHoveringNav.current = true;
                }}
                onMouseLeave={() => {
                  isHoveringNav.current = false;
                }}
              >
                {headings.map((h) => (
                  <a
                    key={h.id}
                    data-toc-id={h.id}
                    className="flex-shrink-0 block text-sm leading-normal transition-colors py-1.5 px-2 rounded-lg truncate hover:text-[#FF5B04]"
                    href={`#${h.id}`}
                    title={h.text}
                    style={{
                      flexShrink: 0,
                      minHeight: 28,
                      paddingLeft: h.level === 3 ? "1rem" : undefined,
                      color: activeId === h.id ? "#FF5B04" : "#4b5563",
                      fontWeight: activeId === h.id ? 600 : 400,
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(h.id)?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
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
