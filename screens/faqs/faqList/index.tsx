"use client";
import FaqsAccordionTabs from "./faqsAccordion";

interface FaqListProps {
  searchQuery: string;
  selectedCategory: string;
}

const FaqList = ({ searchQuery, selectedCategory }: FaqListProps) => {
  return (
    <div className="pt-12 max-md:pt-4 ">
      {/* FAQ Accordion */}
      <FaqsAccordionTabs
        activeTab={selectedCategory}
        searchQuery={searchQuery}
      />
    </div>
  );
};

export default FaqList;
