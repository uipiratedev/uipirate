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
      <div className="relative overflow-hidden bg-white">
        <div className="relative container mx-auto px-4 pb-16 pt-10 md:pt-14">
          <FaqsHero
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            onSearchChange={setSearchQuery}
          />

          <div className="mt-10 md:mt-12">
            <FaqList
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
            />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Faqs;
