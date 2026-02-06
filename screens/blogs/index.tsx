"use client";

import { useState } from "react";
import FeaturedBlogs from "./featuredBlogs";
import BlogsHero from "./hero";
import BlogsNewsletter from "./newsletter";

const Blogs = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div>
      <BlogsHero searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <FeaturedBlogs />
      <BlogsNewsletter />
    </div>
  );
};

export default Blogs;
