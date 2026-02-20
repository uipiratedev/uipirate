"use client";

import { useState, useEffect, useCallback, memo } from "react";
import Image from "next/image";
import { Card, CardBody, CardHeader } from "@heroui/react";
import Link from "next/link";
import GlassBadge from "@/components/GlassBadge";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  tags: string[];
  createdAt: string;
  views: number;
  readTime: number;
}

const FeaturedBlogs = memo(function FeaturedBlogs() {
  const [activeTab, setActiveTab] = useState("All");
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [allTags, setAllTags] = useState<string[]>(["All"]);

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/blogs?published=true&limit=50");
      const data = await response.json();

      if (data.success) {
        setBlogs(data.data);

        // Extract unique tags
        const tags = new Set<string>();

        data.data.forEach((blog: Blog) => {
          blog.tags?.forEach((tag: string) => tags.add(tag));
        });
        setAllTags(["All", ...Array.from(tags)]);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const filteredBlogs =
    activeTab === "All"
      ? blogs
      : blogs.filter((blog) => blog.tags?.includes(activeTab));

  return (
    <div className="pt-32 max-md:pt-24 px-6 max-w-7xl mx-auto mb-24 max-md:mb-12">
      {/* Section Header */}

      <div className="autoShow mb-12 max-md:mb-6">
        <div className="flex flex-row items-center justify-center mb-6">
          <GlassBadge variant="gradient" size="sm">
            What we provide
          </GlassBadge>
        </div>
        <p className="heading-center">Why Work With UiPirate?</p>
      </div>



      {/* Blog Cards Grid */}
      {loading ? (
        <div className="grid md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="relative flex flex-col h-[290px] md:h-[360px] rounded-[20px] overflow-hidden bg-white border border-[#E5E7EB] animate-pulse">
              {/* Image area skeleton */}
              <div className="flex-1 bg-[#F1F5F9]" />
              {/* Content skeleton */}
              <div className="px-5 py-4 md:px-6 md:py-5 space-y-3">
                <div className="h-6 bg-[#F1F5F9] rounded w-[85%]" />
                <div className="h-4 bg-[#F8FAFC] rounded w-[60%]" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No blogs found. Check back soon!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => (
            <Link key={blog._id} href={`/blogs/${blog.slug}`}>
              <div className="relative flex flex-col h-[290px] md:h-[360px] rounded-[20px] overflow-hidden bg-white border border-[#E5E7EB] shadow-[0_2px_12px_rgba(0,0,0,0.06)] group">
                {/* Image area */}
                <div className="flex-1 relative bg-[#F8F9FB] overflow-hidden">
                  <div className="relative w-full h-full transition-transform duration-700 group-hover:scale-110">
                    <Image
                      src={
                        blog.featuredImage ||
                        "https://res.cloudinary.com/damm9iwho/image/upload/v1731054694/desin_aetz3i.svg"
                      }
                      alt={blog.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="px-5 py-4 md:px-6 md:py-5">
                  <h3 className="text-[16px] md:text-[22px] font-semibold text-[#0F172A] leading-snug tracking-tight line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="mt-1.5 text-[12px] md:text-[13px] text-[#64748B] leading-relaxed line-clamp-1">
                    {blog.excerpt || "Read more about this project and our process."}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
});

export default FeaturedBlogs;
