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
    if (category === "general") return "GENERAL";

    return category;
  };

  return (
    <section className="w-full flex flex-col items-center text-center">
      {/* Heading block */}
      <div className="max-w-3xl">
        <p className="text-[11px] md:text-xs font-semibold tracking-[0.25em] text-slate-500 uppercase mb-3">
          FAQ&apos;S
        </p>
        <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-3 max-w-md">
          <span className="text-[#FF5B04]">Everything</span>{" "}
          <span className="text-slate-900">you need to know</span>
        </h1>
        <p className="text-base md:text-lg text-slate-500">
          Questions answered in depth.
        </p>
      </div>

      {/* Search + Category inside pill */}
      <div className="mt-8 md:mt-10 w-full max-w-3xl">
        <label className="sr-only" htmlFor="faq-search">
          Search FAQs
        </label>
        <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white/90 px-4 md:px-5 py-3.5 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur">
          <svg
            aria-hidden="true"
            className="hidden md:block w-5 h-5 text-slate-400 flex-shrink-0"
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
          <input
            aria-label="Search frequently asked questions"
            className="flex-1 bg-transparent focus:outline-none text-slate-800 placeholder:text-slate-400 text-sm md:text-base"
            id="faq-search"
            placeholder="Search by topic, problem, or keyword..."
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />

          {/* Category Selector inside input */}
          <div className="pl-3 ml-1 border-l border-slate-200 flex-shrink-0">
            <Select
              disallowEmptySelection
              aria-label="Select category"
              classNames={{
                base: "min-w-[150px]",
                trigger:
                  "bg-[#FF5B04] text-white rounded-full h-9 md:h-10 px-4 border-none shadow-none data-[hover=true]:bg-[#ff7a33]",
                value:
                  "text-[10px] md:text-xs font-semibold tracking-[0.18em] uppercase",
                popoverContent: "rounded-xl",
                listbox: "p-0",
              }}
              renderValue={() => (
                <div className="flex items-center gap-2">
                  <span className="text-white whitespace-nowrap">
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
    </section>
  );
};

export default FaqsHero;
