"use client";

import { motion } from "framer-motion";
import GlassSurface from "@/components/GlassSurface";

interface CaseStudiesHeroProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  category: string;
  setCategory: (c: string) => void;
  categories: string[];
}

const CaseStudiesHero = ({
  searchQuery,
  setSearchQuery,
  category,
  setCategory,
  categories,
}: CaseStudiesHeroProps) => {
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
        className="flex flex-col items-center justify-center w-full relative z-10 section-container pb-24"
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
            CASE STUDIES
          </p>
        </GlassSurface>
        {/* Headline */}
        <div className="relative z-10 w-full">
          <h1 className="hero-header">
            Real <span className="text-[#FF5B04]"> Projects.</span> Real
            <span className="text-[#FF5B04]"> Results.</span>
          </h1>
        </div>
        {/* Subheading */}
        <p className="sub-header text-[#11181C] mb-12">
          SaaS platforms, enterprise dashboards, AI products, fintech tools. For
          each project: the problem, what we built, and what it looked like after.
        </p>

        {/* Search Bar matching reference image */}
        <motion.div
          className="relative max-w-4xl w-full mx-auto z-10 mt-4"
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className="flex bg-white rounded-medium border border-gray-200 p-1.5 shadow-sm focus-within:ring-2 focus-within:ring-[#FF5B04]/20 focus-within:border-[#FF5B04] transition-all duration-300">
            <input
              className="flex-grow bg-transparent px-4 py-3 text-sm text-gray-800 placeholder-gray-500 focus:outline-none"
              placeholder="Search by topic, problem, or keyword..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="relative shrink-0 hidden md:inline-block">
              {/* This invisible span dictates the width of the container strictly based on current selection */}
              <span className="invisible whitespace-nowrap text-xs font-bold uppercase tracking-wide px-5 py-3 pr-10 inline-block pointer-events-none">
                {category === "All" ? "ALL CATEGORIES" : category.toUpperCase()}
              </span>
              <select
                className="absolute inset-0 appearance-none w-full bg-[#FF5B04] text-white text-xs font-bold uppercase tracking-wide px-5 py-3 pr-10 rounded-medium cursor-pointer hover:bg-[#e04e00] transition-colors outline-none"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="All">ALL CATEGORIES</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.toUpperCase()}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>
          </div>

          {/* Mobile Category Select */}
          <div className="mt-3 md:hidden relative">
            <select
              className="appearance-none w-full bg-[#FF5B04] text-white text-xs font-bold uppercase tracking-wide px-5 py-3.5 pr-10 rounded-medium cursor-pointer hover:bg-[#e04e00] transition-colors outline-none"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="All">ALL CATEGORIES</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.toUpperCase()}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CaseStudiesHero;
