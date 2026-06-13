"use client";

import { memo, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

import type { ReaderPost } from "@/lib/pirateCOS/public-client";

const DEFAULT_BANNER = "/assets/blog-banner-default.svg";

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
  const filteredBlogs = useMemo(() => {
    let result = blogs;

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
  }, [blogs, selectedCategory, searchQuery]);

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
                href={`/blogs/${blog.slug}`}
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
