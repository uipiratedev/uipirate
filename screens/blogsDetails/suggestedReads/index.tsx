"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import GlassBadge from "@/components/GlassBadge";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  tags: string[];
  views: number;
  readTime: number;
}

const SuggestedReads = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuggestedBlogs();
  }, []);

  const fetchSuggestedBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/blogs?published=true&limit=3");
      const data = await response.json();

      if (data.success) {
        setBlogs(data.data);
      }
    } catch (error) {
      // Error fetching suggested blogs
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 max-md:pt-12 container mx-auto px-32 lg:px-20 max-md:px-4 mb-24 max-md:mb-12">
      {/* Section Header */}

      <div className="autoShow mb-12 max-md:mb-6 text-center">
        <div className="flex flex-row items-center justify-center mb-6">
          <GlassBadge variant="gradient" size="sm">Suggested Reads</GlassBadge>
        </div>
        <p className="heading-center">Continue Your Journey</p>
      </div>

      {/* Blog Cards Grid */}
      {loading ? (
        <div className="grid md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
             <div key={i} className="relative flex flex-col h-[290px] md:h-[360px] rounded-[20px] overflow-hidden bg-white border border-[#E5E7EB] animate-pulse">
               <div className="flex-1 bg-[#F1F5F9]" />
               <div className="px-5 py-4 md:px-6 md:py-5 space-y-3">
                 <div className="h-6 bg-[#F1F5F9] rounded w-[85%]" />
                 <div className="h-4 bg-[#F8FAFC] rounded w-[60%]" />
               </div>
             </div>
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No suggested blogs available.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {blogs.map((blog) => (
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
};

export default SuggestedReads;
