"use client";
import { useState } from "react";

import FaqList from "./faqList";
import FaqsHero from "./hero";

import PageWrapper from "@/components/PageWrapper";

const Faqs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("general");

  return (
    <PageWrapper showFloatingButton={false}>
      <div className="container mx-auto">
        <div className=" max-md:px-4">
          <FaqsHero
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            onSearchChange={setSearchQuery}
          />
        </div>
        <div className="bg-white pb-12 rounded-tr-[100px] rounded-tl-[100px] max-md:rounded-tr-[50px] max-md:rounded-tl-[50px]  xl:px-40 max-md:px-4 max-md:pt-4 max-xl:px-4 max-2xl:px-0">
          <FaqList
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
          />
        </div>
      </div>
    </PageWrapper>
  );
};

export default Faqs;
