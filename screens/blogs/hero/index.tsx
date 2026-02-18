"use client";

import GlassSurface from "@/components/GlassSurface";

interface BlogsHeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const BlogsHero = ({ searchQuery, onSearchChange }: BlogsHeroProps) => {
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
        className="flex flex-col items-center justify-center w-full relative z-10 container mx-auto mx-auto px-32 lg:px-20 max-md:px-4  "
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
            INSIGHTS & RESOURCES
          </p>
        </GlassSurface>
        {/* Headline */}
        <div className="relative z-10 w-full">
          <h1 className="text-[40px] 3xl:text-[80px] 2xl:text-[74px] xl:text-[61px] lg:text-[48px] text-center font-[700] max-md:font-[600]  max-md:leading-[1.08] tracking-[-1.5px] leading-[1.1] relative">
            <span className="text-black">Insights, Stories &amp; Research for </span>
            <span className="text-[#FF5B04]">SaaS, Tech &amp; Design</span>
          </h1>
           
        </div>
        <p className="reveal-text-anim-1 max-w-[820px] 2xl:max-w-[1000px] text-center text-lg 2xl:text-xl max-md:text-sm mt-4 md:my-4 2xl:px-3 px-4 leading-[25.2px] 2xl:leading-[32px]">
          Fresh ideas, research-backed insights, and real stories from our work and
          the community.
        </p>
        
        {/* Search */}
        <div 
          className="mt-8 md:mt-10 w-full max-w-2xl relative z-10 px-4"
          style={{
             animation: "trustBadgeUp 0.5s ease-out forwards",
             animationDelay: "0.3s",
             opacity: 0,
             transform: "translateY(20px)",
          }}
        >
          <label className="sr-only" htmlFor="blog-search">
            Search blog topics
          </label>
          <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white/80 px-4 md:px-5 py-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] backdrop-blur-md transition-all duration-300 focus-within:shadow-[0_8px_30px_rgba(0,0,0,0.08)] focus-within:bg-white/95">
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
              aria-label="Search blog topics"
              id="blog-search"
              type="search"
              placeholder="Search by topic, problem, or keyword..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="flex-1 bg-transparent focus:outline-none text-slate-800 placeholder:text-slate-400 text-sm md:text-base font-medium"
            />

            {/* Static filter pill on the right */}
            <div className="pl-3 ml-1 border-l border-slate-200 flex-shrink-0">
              <button
                type="button"
                className="bg-[#FF5B04] hover:bg-[#ff6b1e] transition-colors text-white rounded-full h-9 md:h-10 px-4 text-[10px] md:text-xs font-semibold tracking-[0.1em] uppercase whitespace-nowrap shadow-sm"
              >
                BY PRODUCT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogsHero;
