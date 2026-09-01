"use client";

import GlassSurface from "@/components/GlassSurface";

interface BlogsHeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const BlogsHero = ({ searchQuery, onSearchChange }: BlogsHeroProps) => {
  return (
    <div className="hero-wrapper">
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
        className="flex flex-col items-center justify-center w-full relative z-10 section-container"
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
            <span className="text-black">
              Insights, Stories &amp; Research <br />
              for{" "}
            </span>
            <span className="text-[#FF5B04]">SaaS, Tech &amp; Design</span>
          </h1>
        </div>
        <p className="sub-header">
          Fresh ideas, research-backed insights, and real stories from our work
          and the community.
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

          {/* Single pill row, full width on mobile */}
          <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white/80 px-4 py-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] backdrop-blur-md md:focus-within:shadow-[0_8px_30px_rgba(0,0,0,0.08)] md:focus-within:bg-white/95 md:transition-all md:duration-300">
            <input
              aria-label="Search blog topics"
              className="flex-1 bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5B04] rounded-md text-slate-800 placeholder:text-slate-400 text-sm md:text-base font-medium"
              id="blog-search"
              placeholder="Search by topic, problem, or keyword..."
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogsHero;
