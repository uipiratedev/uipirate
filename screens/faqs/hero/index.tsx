"use client";

import { Select, SelectItem } from "@heroui/react";
import GlassSurface from "@/components/GlassSurface";

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
    <div className="flex flex-row items-center justify-center py-6 w-full max-md:py-0 max-md:pt-1 relative ">
      {/* Subtle Grid Background Pattern */}
      <div
        className="absolute pointer-events-none -mt-20 "
        style={{
          backgroundImage: `
              linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px)
            `,
          backgroundSize: "40px 40px",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          marginLeft: "calc(-50vw + 50%)",
        }}
      />
      {/* Layered gradient with gentle mist animation */}
      <div
        className="absolute pointer-events-none -mt-20 "
        style={{
          backgroundImage: `
              linear-gradient(to top, rgba(250, 250, 250, 1), transparent 10%),
              linear-gradient(to top, rgba(250, 250, 250, 1) 0%, transparent 35%)
            `,
          animation: "gentle-mist 8s ease-in-out infinite",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          marginLeft: "calc(-50vw + 50%)",
        }}
      />
      <div
        className="flex flex-col items-center justify-center w-full relative z-10 container mx-auto "
        style={{ overflow: "visible" }}
      >
        {" "}
        {/* Badge with GlassSurface */}
        <GlassSurface
          backgroundOpacity={0.1}
          blueOffset={20}
          blur={11}
          borderRadius={12}
          borderWidth={0.01}
          brightness={50}
          className="md:my-9 max-md:my-5 !flex !flex-row !items-center !gap-3 isolate overflow-visible p-2 px-4 max-md:mx-2"
          displace={0.5}
          distortionScale={-180}
          forceLightMode={true}
          greenOffset={10}
          height="auto"
          opacity={0.93}
          redOffset={0}
          saturation={1}
          style={{
            animation: "trustBadgeUp 0.5s ease-out forwards",
            animationDelay: "0.1s",
            opacity: 0,
            transform: "translateY(20px) scale(0.95)",
          }}
          width="auto"
        >
          {/* Text */}
          <p className="badge-text relative z-10 max-md:text-xs uppercase font-semibold tracking-wider">
            FAQ&apos;S
          </p>
        </GlassSurface>

        {/* Headline */}
        <div className="relative z-10 w-full">
          <h1 className="text-[40px] 3xl:text-[80px] 2xl:text-[74px] xl:text-[61px] lg:text-[48px] px-4 text-center font-[700] max-md:font-[600] max-md:leading-[1.08] max-md:px-1 tracking-[-1.5px] leading-[1.1] relative reveal-text-anim">
            <span className="text-[#FF5B04]">Everything</span>{" "}
            <span className="text-black">you need to know</span>
          </h1>
        </div>

        {/* Description */}
        <p className="reveal-text-anim-1 max-w-[820px] 2xl:max-w-[1000px] text-center text-lg 2xl:text-xl max-md:text-sm mt-4 md:my-4 2xl:px-3 px-4 leading-[25.2px] 2xl:leading-[32px] text-gray-600">
          Questions answered in depth.
        </p>

        {/* Search + Category inside pill */}
        <div 
          className="mt-8 md:mt-10 w-full max-w-3xl relative z-10 px-4"
          style={{
             animation: "trustBadgeUp 0.5s ease-out forwards",
             animationDelay: "0.3s",
             opacity: 0,
             transform: "translateY(20px)",
          }}
        >
          <label className="sr-only" htmlFor="faq-search">
            Search FAQs
          </label>
          <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white/80 px-4 md:px-5 py-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] backdrop-blur-md transition-all duration-300 focus-within:shadow-[0_8px_30px_rgba(0,0,0,0.08)] focus-within:bg-white/95">
            
            <input
              aria-label="Search frequently asked questions"
              className="flex-1 bg-transparent focus:outline-none text-slate-800 placeholder:text-slate-400 text-sm md:text-base font-medium"
              id="faq-search"
              placeholder="Search by topic, problem, or keyword…"
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />

            {/* Category Selector inside input */}
            <div className="pl-3 ml-1 border-l border-slate-200 flex-shrink-0 hidden md:block">
              <Select
                disallowEmptySelection
                aria-label="Select category"
                classNames={{
                  base: "min-w-[150px]",
                  trigger:
                    "bg-[#FF5B04] hover:bg-[#ff6b1e] text-white rounded-full h-9 md:h-10 px-4 border-none shadow-sm data-[hover=true]:bg-[#ff7a33] transition-colors",
                  value:
                    "text-[10px] md:text-xs font-semibold tracking-[0.1em] uppercase group-data-[has-value=true]:text-white",
                  popoverContent: "rounded-xl",
                  listbox: "p-0",
                  selectorIcon: "text-white",
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
                  <SelectItem key={tab} textValue={getDisplayName(tab)}>
                    {getDisplayName(tab)}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqsHero;
