"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader, Chip } from "@nextui-org/react";
import Link from "next/link";

const tabs = ["All", "Design", "Development", "Marketing"];

const blogData = [
  {
    title: "Creating Modern UI with TailwindCSS",
    category: "Design",
    description:
      "Learn how to build responsive, modern UI components using TailwindCSS.",
    image: "/blog1.jpg",
  },
  {
    title: "Next.js Best Practices for 2025",
    category: "Development",
    description:
      "Discover tips and tricks to optimize your Next.js apps for performance and scalability.",
    image: "/blog2.jpg",
  },
  {
    title: "SEO & Digital Marketing Strategies",
    category: "Marketing",
    description:
      "Boost your website traffic and conversions with these marketing strategies.",
    image: "/blog3.jpg",
  },
  {
    title: "Building Interactive Dashboards",
    category: "Development",
    description:
      "Step-by-step guide to building dashboards with React and Next.js.",
    image: "/blog4.jpg",
  },
  {
    title: "Next.js Best Practices for 2025",
    category: "Development",
    description:
      "Discover tips and tricks to optimize your Next.js apps for performance and scalability.",
    image: "/blog2.jpg",
  },
  {
    title: "SEO & Digital Marketing Strategies",
    category: "Marketing",
    description:
      "Boost your website traffic and conversions with these marketing strategies.",
    image: "/blog3.jpg",
  },
];

const FeaturedBlogs = () => {
  const [activeTab, setActiveTab] = useState("All");

  const filteredBlogs =
    activeTab === "All"
      ? blogData
      : blogData.filter((blog) => blog.category === activeTab);

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

      {/* Tabs */}
      {/* <div className="flex justify-center mb-12 flex-wrap gap-4 mt-12 bg-[#EDEDED]">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full border ${
              activeTab === tab
                ? "bg-[#0b132b] text-white border-[#0b132b]"
                : "bg-white text-[#0b132b] border-gray-300"
            } transition`}
          >
            {tab}
          </button>
        ))}
      </div> */}

      {/* Tabs - Grouped with Horizontal Scroll */}
      <div className="flex justify-center mb-12 mt-12 max-md:mt-8 overflow-x-auto hide-scrollbar px-0">
        <div className="inline-flex bg-[#EDEDED] rounded-full p-1 gap-1 min-w-max">
          {tabs.map((tab) => (
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
      <div className="grid md:grid-cols-3 gap-6">
        {filteredBlogs.map((blog, index) => (
          <Link href={`/blogs/${blog.title.split(" ").join("-")}`} key={index}>
            <Card className="rounded-[48px] max-md:rounded-[38px]  bg-[#e9e9e9] max-md:mt-4 group shadow-none border-1 border-[#0000000f]">
              <CardBody className="p-2 max-md:p-2 max-md:gap-2">
                <Card className="rounded-[40px] max-md:rounded-[30px] box-shadow h-full">
                  <CardHeader className="px-0 pt-0">
                    {blog.image ? (
                      <img
                        src="https://res.cloudinary.com/damm9iwho/image/upload/v1731054694/desin_aetz3i.svg"
                        alt="behance Logo"
                        width="100%"
                        className="object-cover h-[150px] min-md:h-[150px] max-h-full"
                      />
                    ) : null}
                  </CardHeader>
                  <CardBody className="p-8 max-md:p-5 max-lg:p-6 flex flex-col justify-between">
                    <div>
                      <p className="text-2xl max-md:text-xl mt-4 mb-3 font-[700] tracking-[-0.5px] leading-[34px]">
                        {blog.title}
                      </p>

                      <p className="text-base max-md:text-base font-[500] text-[#777777] py-2">
                        {blog.description}
                      </p>
                    </div>
                  </CardBody>
                </Card>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FeaturedBlogs;
