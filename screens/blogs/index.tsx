"use client";

import { useState } from "react";

import FeaturedBlogs from "./featuredBlogs";
import BlogsHero from "./hero";
import BlogsNewsletter from "./newsletter";

const Blogs = () => {
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
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
      />
      <BlogsNewsletter />
    </div>
  );
};

export default Blogs;
