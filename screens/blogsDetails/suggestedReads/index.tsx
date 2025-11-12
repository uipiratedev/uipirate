"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import Link from "next/link";

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
      console.error("Error fetching suggested blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 max-md:pt-24 px-6 max-w-7xl mx-auto mb-24 max-md:mb-12">
      {/* Section Header */}

      <div className="autoShow">
        <div className="flex flex-row items-center justify-center mb-6">
          <span className="bg-[#8EF1F1] px-4 py-2 rounded-xl font-semibold uppercase border-cyan-400 border-2">
            Suggested Reads
          </span>
        </div>
        <p className="heading-center">Continue Your Journey</p>
      </div>

      {/* Blog Cards Grid */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading suggested reads...</p>
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No suggested blogs available.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          {blogs.map((blog) => (
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

export default SuggestedReads;
