import Image from "next/image";
import Link from "next/link";

import type { ReaderPost } from "@/lib/pirateCOS/public-client";

const DEFAULT_BANNER = "/assets/blog-banner-default.svg";

interface SuggestedReadsProps {
  posts: ReaderPost[];
}

const SuggestedReads = ({ posts }: SuggestedReadsProps) => {
  const blogs = posts;

  if (blogs.length === 0) return null;

  return (
    <section className="container mx-auto xl:px-32 2xl:px-40 max-xl:px-8 max-md:px-4 pt-8 pb-20">
      {/* Section header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[22px] md:text-[26px] font-[700] tracking-tight text-[#111]">
          More to Read
        </h2>
        <Link
          className="text-sm font-semibold text-[#FF5B04] hover:underline"
          href="/blogs"
        >
          All articles →
        </Link>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {blogs.map((blog) => {
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
                    {/* Body */}
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
                          {(
                            blog.totalViews ||
                            blog.views ||
                            0
                          ).toLocaleString()}{" "}
                          views
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
      </div>
    </section>
  );
};

export default SuggestedReads;
