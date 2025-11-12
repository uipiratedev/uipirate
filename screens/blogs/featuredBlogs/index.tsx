"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Chip } from "@nextui-org/react";
import Link from "next/link";

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

const FeaturedBlogs = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [allTags, setAllTags] = useState<string[]>(["All"]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
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
  };

  const filteredBlogs =
    activeTab === "All"
      ? blogs
      : blogs.filter((blog) => blog.tags?.includes(activeTab));

  return (
    <div className="pt-32 max-md:pt-24 px-6 max-w-7xl mx-auto mb-24 max-md:mb-12">
      {/* Section Header */}

      <div className="autoShow">
        <div className="flex flex-row items-center justify-center mb-6">
          <span className="bg-[#8EF1F1] px-4 py-2 rounded-xl font-semibold uppercase border-cyan-400 border-2">
            What we provide
          </span>
        </div>
        <p className="heading-center">Why Work With UiPirate?</p>
      </div>

      {/* Tabs - Grouped with Horizontal Scroll */}
      <div className="flex justify-center mb-12 mt-12 max-md:mt-8 overflow-x-auto hide-scrollbar px-0">
        <div className="inline-flex bg-[#EDEDED] rounded-full p-1 gap-1 min-w-max">
          {allTags.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm max-md:text-xs whitespace-nowrap transition-all duration-200 ${
                activeTab === tab
                  ? "bg-[#0b132b] text-white shadow-md"
                  : "bg-transparent text-[#0b132b] hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Cards Grid */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading blogs...</p>
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No blogs found. Check back soon!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => (
            <Link href={`/blogs/${blog.slug}`} key={blog._id}>
              <Card className="rounded-[48px] max-md:rounded-[38px]  h-full bg-[#e9e9e9] max-md:mt-4 group shadow-none border-1 border-[#0000000f]">
                <CardBody className="p-2 max-md:p-2 max-md:gap-2">
                  <Card className="rounded-[40px] max-md:rounded-[30px] box-shadow h-full">
                    <CardHeader className="px-0 pt-0">
                      {blog.featuredImage ? (
                        <img
                          src={blog.featuredImage}
                          alt={blog.title}
                          width="100%"
                          className="object-cover h-[200px] min-md:h-[200px] max-h-full rounded-t-[40px] max-md:rounded-t-[30px]"
                        />
                      ) : (
                        <img
                          src="https://res.cloudinary.com/damm9iwho/image/upload/v1731054694/desin_aetz3i.svg"
                          alt={blog.title}
                          width="100%"
                          className="object-cover h-[200px] min-md:h-[200px] max-h-full"
                        />
                      )}
                    </CardHeader>
                    <CardBody className="p-8 max-md:p-5 max-lg:p-6 flex flex-col justify-between">
                      <div>
                        <p className="text-2xl max-md:text-xl mt-4 mb-3 font-[700] tracking-[-0.5px] leading-[34px]">
                          {blog.title}
                        </p>

                        <p className="text-base max-md:text-base font-[500] text-[#777777] py-2">
                          {blog.excerpt || "Read more..."}
                        </p>

                        <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                          <span>👁️ {blog.views || 0} views</span>
                          <span>⏱️ {blog.readTime || 5} min read</span>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturedBlogs;
