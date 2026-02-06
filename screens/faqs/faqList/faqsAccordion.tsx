"use client";
import { Accordion, AccordionItem } from "@heroui/react";
import { useMemo } from "react";

import FaqData from "@/data/faqs.json";

interface FaqsAccordionTabsProps {
  activeTab: string;
  searchQuery: string;
}

interface FaqItem {
  heading: string;
  title1: string;
  list: string[];
  title2?: string;
}

type FaqDataType = {
  [key: string]: FaqItem[];
};

export default function FaqsAccordionTabs({
  activeTab,
  searchQuery,
}: FaqsAccordionTabsProps) {
  // Filter FAQs based on active tab and search query
  const filteredData = useMemo(() => {
    const faqData = FaqData as FaqDataType;

    // Get FAQs for the active tab/category
    let filtered = faqData[activeTab] || [];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();

      filtered = filtered.filter(
        (item) =>
          item.heading.toLowerCase().includes(query) ||
          item.title1.toLowerCase().includes(query) ||
          item.list.some((listItem) =>
            listItem.toLowerCase().includes(query),
          ) ||
          (item.title2 && item.title2.toLowerCase().includes(query)),
      );
    }

    return filtered;
  }, [activeTab, searchQuery]);

  return (
    <>
      <div>
        {filteredData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No FAQs found matching your search.
            </p>
          </div>
        ) : (
          <Accordion
            className="mb-0"
            defaultExpandedKeys={["0"]} // ✅ opens first accordion by default
            selectionMode="multiple"
            variant="splitted"
          >
            {filteredData.map((item, index) => (
              <AccordionItem
                key={String(index)}
                aria-label={item.heading}
                className="shadow-none border-1 rounded-[1.25rem] mt-3 max-md:mt-2 items-center hover:bg-[#f2f1f1]"
                indicator={({ isOpen }) =>
                  isOpen ? (
                    <img
                      alt="icon"
                      className="rotate-45 transition-transform duration-300"
                      src="https://res.cloudinary.com/damm9iwho/image/upload/v1731050216/plus_dia0bt.svg"
                    />
                  ) : (
                    <img
                      alt="icon"
                      className="transition-transform duration-300"
                      src="https://res.cloudinary.com/damm9iwho/image/upload/v1731050216/plus_dia0bt.svg"
                    />
                  )
                }
                title={
                  <p className="font-semibold pr-12 max-md:pr-6 md:py-2 md:px-1 text-[16px] leading-snug">
                    {item.heading}
                  </p>
                }
              >
                <div className="p-5 md:p-6 bg-white rounded-[20px]">
                  <p className="mb-5 text-[15px] text-gray-700">
                    {item.title1}
                  </p>
                  {item.list.map((listItem, i) => (
                    <p key={i} className="mb-3 text-[15px] text-gray-700">
                      {listItem}
                    </p>
                  ))}
                  {item.title2 && (
                    <p className="mt-5 text-[15px] text-gray-700">
                      {item.title2}
                    </p>
                  )}
                </div>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </>
  );
}
