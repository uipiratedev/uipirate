"use client";
import { useState } from "react";
import FaqsAccordionTabs from "./faqsAccordion";

interface FaqListProps {
  searchQuery: string;
}

const FaqList = ({ searchQuery }: FaqListProps) => {
  const [activeTab, setActiveTab] = useState("General");

  const tabs = [
    "General",
    "Services",
    "SaaS Web & Mobile Apps",
    "Landing Pages & Business Websites",
    "Graphic Design",
    "Motion Graphics & Video Editing",
    "UX Audits & Consultation",
  ];

  return (
    <div className="pt-12 max-md:pt-8">
      {/* Tabs - Grouped with Horizontal Scroll */}
      <div className="flex justify-center mb-12 mt-12 max-md:mt-8 overflow-x-auto hide-scrollbar px-4">
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

      {/* FAQ Accordion */}
      <FaqsAccordionTabs activeTab={activeTab} searchQuery={searchQuery} />
    </div>
  );
};

export default FaqList;
