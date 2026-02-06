"use client";
import { useState } from "react";

import FaqList from "./faqList";
import FaqsHero from "./hero";

import PageWrapper from "@/components/PageWrapper";

const Faqs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("general");
  const meteors = Array.from({ length: 9 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${-5 - Math.random() * 10}%`,
    delay: `${Math.random() * 8}s`,
    duration: `${2 + Math.random() * 3}s`,
    drift: `${Math.random() * 80 - 40}px`,
  }));

  return (
    <PageWrapper showFloatingButton={false}>
      <div className="relative overflow-hidden bg-white">
        {/* === Static Gray Grid Background === */}
        <div className="absolute -mt-8 inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:60px_60px]" />

        {/* === Meteors === */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          {meteors.map((meteor) => (
            <span
              key={meteor.id}
              className="meteor absolute"
              style={
                {
                  top: meteor.top,
                  left: meteor.left,
                  animationDelay: meteor.delay,
                  animationDuration: meteor.duration,
                  "--drift": meteor.drift,
                } as React.CSSProperties
              }
            >
              <div className="absolute w-[3px] h-[3px] -ml-[1px] rounded-full bg-black" />
              <div className="absolute top-0 left-0 w-[1.5px] h-[50px] -translate-y-full bg-gradient-to-b from-gray-200 via-gray-900 to-black opacity-70" />
            </span>
          ))}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[100px] bg-gradient-to-t from-[#F5F5F5] to-transparent z-10 pointer-events-none" />

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
