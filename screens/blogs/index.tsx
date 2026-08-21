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
  const [selectedCategory, setSelectedCategory] = useState("general");

  return (
    <div>
      <BlogsHero
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onSearchChange={setSearchQuery}
      />
      <FeaturedBlogs
        blogs={initialBlogs}
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
      />
      <BlogsNewsletter />
    </div>
  );
};

export default Blogs;
