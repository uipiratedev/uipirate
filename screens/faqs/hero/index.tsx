"use client";

import { Select, SelectItem } from "@heroui/react";

interface FaqsHeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const FaqsHero = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}: FaqsHeroProps) => {
  const tabs = [
    "general",
    "SaaS Web & Mobile Apps",
    "Motion Graphics & Video Editing",
    "Services",
    "UX Audits & Consultation",
    "Graphic Design",
    "Landing Pages & Business Websites",
  ];

  // Display name mapping for better UI
  const getDisplayName = (category: string) => {
    if (category === "general") return "General";

    return category;
  };

  return (
    <div className="flex flex-row items-center justify-center py-12 w-full max-lg:py-10 max-md:py-6 container mx-auto">
      <section className="relative flex flex-col items-center text-center w-full ">
        {/* Main Heading */}
        <h1 className="text-3xl md:text-5xl font-bold leading-snug max-w-4xl mb-4 reveal-text-anim ">
          Have questions?
        </h1>

        <h1 className="text-3xl md:text-5xl font-bold leading-snug max-w-4xl mb-4 reveal-text-anim ">
          We&apos;ve got you!
        </h1>

        {/* Search Input with Category Selector */}
        <div className="mt-12 max-md:mt-6 flex flex-row items-center justify-center max-lg:flex-col w-full">
          <div className="w-full max-w-3xl relative">
            <div className="flex items-center w-full rounded-full border border-[#E5E5E5] bg-white overflow-hidden shadow-sm">
              {/* Search Input */}
              <label className="sr-only" htmlFor="faq-search">
                Search FAQs
              </label>
              <input
                aria-label="Search frequently asked questions"
                className="flex-1 px-6 py-4 bg-transparent focus:outline-none text-gray-700 placeholder:text-gray-400"
                id="faq-search"
                placeholder="What do you want help with?"
                type="search"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-gray-400 absolute right-6 top-1/2 transform -translate-y-1/2 md:hidden"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>

              {/* Category Selector */}
              <div className="flex items-center border-l text-white border-gray-200 pl-4 pr-2 max-md:hidden">
                <Select
                  disallowEmptySelection
                  aria-label="Select category"
                  classNames={{
                    base: "min-w-[240px]",
                    trigger:
                      "bg-black text-white rounded-full h-10 px-4 border-none shadow-none hover:bg-gray-800 data-[hover=true]:bg-gray-800 text-white",
                    value: "text-white text-sm font-medium",
                    popoverContent: "rounded-xl",
                    listbox: "p-0",
                  }}
                  renderValue={() => (
                    <div className="flex items-center gap-2">
                      <span className="text-white text-nowrap pr-4">
                        {getDisplayName(selectedCategory)}
                      </span>
                    </div>
                  )}
                  selectedKeys={[selectedCategory]}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;

                    if (selected) {
                      onCategoryChange(selected);
                    }
                  }}
                >
                  {tabs.map((tab) => (
                    <SelectItem key={tab}>{getDisplayName(tab)}</SelectItem>
                  ))}
                </Select>
              </div>
            </div>
          </div>
          <div className="max-md:block md:hidden mt-4 w-full">
            <Select
              disallowEmptySelection
              aria-label="Select category"
              classNames={{
                base: "min-w-[140px]",
                trigger:
                  "bg-black text-white rounded-full h-10 max-md:h-12 px-4 border-none shadow-none hover:bg-gray-800 data-[hover=true]:bg-gray-800 text-white",
                value: "text-white text-base font-medium",
                popoverContent: "rounded-xl",
                listbox: "p-0",
              }}
              renderValue={() => (
                <div className="flex items-center gap-2">
                  <span className="text-white ">
                    {getDisplayName(selectedCategory)}
                  </span>
                </div>
              )}
              selectedKeys={[selectedCategory]}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;

                if (selected) {
                  onCategoryChange(selected);
                }
              }}
            >
              {tabs.map((tab) => (
                <SelectItem key={tab}>{getDisplayName(tab)}</SelectItem>
              ))}
            </Select>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FaqsHero;
