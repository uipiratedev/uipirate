"use client";
import { useState } from "react";
import FaqList from "./faqList";
import FaqsHero from "./hero";

const Faqs = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="container mx-auto xl:px-32 max-md:px-4 max-xl:px-4 max-2xl:px-0 mb-12">
      <FaqsHero searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <FaqList searchQuery={searchQuery} />
    </div>
  );
};

export default Faqs;
