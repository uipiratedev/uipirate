"use client";

import type { ReaderPost } from "@/lib/pirateCOS/public-client";

import { memo, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const DEFAULT_BANNER = "/assets/blog-banner-default.svg";

// Matches the CMS `postType` enum (models/Post.ts), minus "case-study" —
// those are excluded from /blogs entirely and live under /case-studies.
const POST_TYPE_LABELS: Record<string, string> = {
  blog: "Blog",
  tutorial: "Tutorial",
  "community-insight": "Community Insight",
  "product-review": "Product Review",
  "product-launch": "Product Launch",
  listicle: "Listicle",
  comparison: "Comparison",
  newsletter: "Newsletter",
  "social-post": "Social Post",
  "corporate-post": "Corporate Post",
};

interface FeaturedBlogsProps {
  blogs: ReaderPost[];
  searchQuery?: string;
  selectedCategory?: string;
}

const FeaturedBlogs = memo(function FeaturedBlogs({
  blogs,
  searchQuery = "",
  selectedCategory = "All",
}: FeaturedBlogsProps) {
  const [selectedPostType, setSelectedPostType] = useState("All");

  // Only show tabs for post types that actually have published posts.
  const postTypeTabs = useMemo(() => {
    const counts = new Map<string, number>();

    blogs.forEach((b) => {
      const type = b.postType || "blog";

      counts.set(type, (counts.get(type) || 0) + 1);
    });

    return [
      { type: "All", label: "All", count: blogs.length },
      ...Array.from(counts.entries()).map(([type, count]) => ({
        type,
        label: POST_TYPE_LABELS[type] || type,
        count,
      })),
    ];
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    let result = blogs;

    if (selectedPostType !== "All") {
      result = result.filter(
        (b) => (b.postType || "blog") === selectedPostType,
      );
    }
    if (
      selectedCategory &&
      selectedCategory !== "All" &&
      selectedCategory !== "general"
    ) {
      result = result.filter((b) => b.tags?.includes(selectedCategory));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();

      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.excerpt?.toLowerCase().includes(q) ||
          b.tags?.some((t) => t.toLowerCase().includes(q)),
      );
    }

    return result;
  }, [blogs, selectedPostType, selectedCategory, searchQuery]);

  return (
    <div className="pt-16 max-md:pt-10 pb-20 container mx-auto px-32 lg:px-20 max-md:px-4">
      {/* Section header */}
      <div className="flex items-center justify-between mb-8 max-md:mb-6">
        <h2 className="text-[22px] md:text-[28px] font-[700] tracking-tight text-[#111]">
          {searchQuery
            ? `Results for "${searchQuery}"`
            : selectedCategory &&
                selectedCategory !== "All" &&
                selectedCategory !== "general"
              ? selectedCategory
              : "All Articles"}
        </h2>
        {filteredBlogs.length > 0 && (
          <span className="text-sm text-gray-400 font-medium">
            {filteredBlogs.length} post{filteredBlogs.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Post type filter — CMS postType categories (blog, tutorial, listicle, etc.) */}
      {postTypeTabs.length > 2 && (
        <div className="flex flex-wrap items-center gap-2 mb-8 max-md:mb-6">
          {postTypeTabs.map(({ type, label, count }) => (
            <button
              key={type}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                selectedPostType === type
                  ? "bg-[#FF5B04] text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-[#FF5B04]/50 hover:text-[#FF5B04]"
              }`}
              onClick={() => setSelectedPostType(type)}
            >
              {label}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  selectedPostType === type
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {count}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Blog Cards Grid */}
      {filteredBlogs.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg">No articles found.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => {
            const image =
              blog.bannerImage || blog.featuredImage || DEFAULT_BANNER;
            const tag = blog.tags?.[0];
            const date = new Date(blog.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <Link
                key={blog._id}
                className="group block"
                href={`/${blog.slug}`}
              >
                <div className="flex flex-col rounded-[20px] overflow-hidden bg-white border border-[#E5E7EB] shadow-[0_2px_12px_rgba(0,0,0,0.05)] transition-shadow duration-300 group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.10)]">
                  {/* Thumbnail */}
                  <div className="relative h-[180px] overflow-hidden bg-[#F8F9FB]">
                    <Image
                      fill
                      alt={blog.title}
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      src={image}
                    />
                    {tag && (
                      <span
                        className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider text-white"
                        style={{
                          background: "rgba(0,0,0,0.45)",
                          backdropFilter: "blur(4px)",
                        }}
                      >
                        {tag}
                      </span>
                    )}
                  </div>

                  {/* Card body */}
                  <div className="px-5 py-4">
                    <h3 className="text-[15px] md:text-[17px] font-[700] text-[#0F172A] leading-snug tracking-tight line-clamp-2 mb-1.5">
                      {blog.title}
                    </h3>
                    {blog.excerpt && (
                      <p className="text-[12px] md:text-[13px] text-[#64748B] leading-relaxed line-clamp-2 mb-3">
                        {blog.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium">
                      <span>{date}</span>
                      <span>·</span>
                      <span>{blog.readTime || 5} min read</span>
                      <span>·</span>
                      <span>
                        {(blog.totalViews || blog.views || 0).toLocaleString()}{" "}
                        views
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
});

export default FeaturedBlogs;
