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
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      <FeaturedBlogs />
      <BlogsNewsletter />
    </div>
  );
};

export default Blogs;
