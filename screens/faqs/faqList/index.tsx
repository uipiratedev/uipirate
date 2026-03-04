"use client";
import FaqsAccordionTabs from "./faqsAccordion";

interface FaqListProps {
  searchQuery: string;
  selectedCategory: string;
}

const FaqList = ({ searchQuery, selectedCategory }: FaqListProps) => {
  return (
    <div className="-mx-2">
      {/* FAQ Accordion */}
      <FaqsAccordionTabs
        activeTab={selectedCategory}
        searchQuery={searchQuery}
      />
    </div>
  );
};

export default FaqList;
