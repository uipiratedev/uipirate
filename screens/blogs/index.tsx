"use client";

import { useState } from "react";

import FeaturedBlogs from "./featuredBlogs";
import BlogsHero from "./hero";
import BlogsNewsletter from "./newsletter";

import type { ReaderPost } from "@/lib/pirateCOS/public-client";

interface BlogsProps {
  initialBlogs: ReaderPost[];
}

const Blogs = ({ initialBlogs }: BlogsProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div>
      <BlogsHero searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <FeaturedBlogs blogs={initialBlogs} searchQuery={searchQuery} />
      <BlogsNewsletter />
    </div>
  );
};

export default Blogs;
