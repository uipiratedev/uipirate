"use client";

import { SearchIcon, SaaS } from "@/components/icons";
import { Input } from "@heroui/input";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import GlassSurface from "@/components/GlassSurface";

const categories = [
  "All",
  "AI Systems",
  "Automation",
  "Customer Experience",
  "Internal Tools",
  "Growth & Analytics",
];

const products = [
  {
    title: "AI Voice Support System",
    description: "Handle customer queries with real-time voice AI.",
    category: "AI Systems",
    slug: "ai-voice-support-system",
  },
  {
    title: "Smart Onboarding Engine",
    description: "Guide users with dynamic, personalized onboarding flows.",
    category: "Customer Experience",
    slug: "smart-onboarding-engine",
  },
];

const ProductIcon = () => (
  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-zinc-100 mb-6">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF5B04" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 16 7-7 7 7" />
      <path d="M12 9v12" />
      <path d="M22 12H2" />
    </svg>
  </div>
);

// Better icon mimicking the screenshot (the orange bracket-like shape)
const LogoIcon = () => (
  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-zinc-100 mb-6 group-hover:bg-[#FF5B04]/5 transition-colors">
    <svg fill="none" height="32" viewBox="0 0 32 32" width="32" xmlns="http://www.w3.org/2000/svg">
      <path d="M15.3401 22.68L13.3334 18.6667L4.00009 14C3.87244 13.9415 3.76426 13.8476 3.68842 13.7294C3.61258 13.6112 3.57227 13.4738 3.57227 13.3333C3.57227 13.1929 3.61258 13.0554 3.68842 12.9373C3.76426 12.8191 3.87244 12.7252 4.00009 12.6667L28.0001 4L23.0974 17.5787M26.6667 28L29.3333 25.3333L26.6667 22.6667M22.6667 22.6667L20 25.3333L22.6667 28" stroke="#FF5B04" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
    </svg>
  </div>
);

const Apps4Sale = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white pt-6 pb-20 px-4 md:px-8 relative overflow-hidden">
      {/* Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #000 1px, transparent 1px),
            linear-gradient(to bottom, #000 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center flex flex-col items-center mb-10 md:mb-16 px-4">
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
          <div className="badge-text relative z-10 max-md:text-xs uppercase font-semibold tracking-wider">
              Used in real projects. Not just concepts.
            
          </div>

          </GlassSurface>

          <h1 className="hero-header">
            Ready to Launch <span className="text-[#FF5B04]">Products</span>
          </h1>

          <p className="sub-header">
            Production-ready micro apps built for real products. Plug them into your workflow, 
            customize as needed, and launch without building from scratch.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="max-w-4xl mx-auto mb-16 px-4">
          <div className="relative mb-10 group">
            <div className="absolute inset-0 bg-[#FF5B04]/5 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product systems, AI tools, workflows..."
              size="lg"
              radius="full"
              startContent={<SearchIcon className="text-zinc-400 text-xl" />}
              classNames={{
                base: "max-w-full",
                mainWrapper: "h-16",
                input: "text-lg px-4 font-geist",
                inputWrapper: "h-16 bg-white border-zinc-200 hover:border-zinc-300 focus-within:!border-[#FF5B04] shadow-sm transition-all duration-300",
              }}
            />
          </div>

          <div className="flex flex-wrap justify-center gap-3 overflow-x-auto pb-4 hide-scrollbar">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap border ${
                  activeCategory === category
                    ? "bg-[#FF5B04] border-[#FF5B04] text-white shadow-lg shadow-[#FF5B04]/20 scale-105"
                    : "bg-white border-zinc-100 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4 md:px-0">
          {filteredProducts.map((product, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              key={index}
              className="group overflow-hidden hover:shadow-[0_20px_40px_-12px_rgba(255,91,4,0.1)] transition-all duration-500 cursor-pointer relative"
              style={{
                borderRadius: "40px",
                boxShadow: "0px 3px 6px 0px rgba(255, 255, 255, 0.35) inset",
                border: "1px solid rgba(0, 0, 0, 0.08)",
                background: "linear-gradient(131deg, #EDEDED 15%, #FFFFFF 50%, #EDEDED 85%)"
              }}
            >
              <Link href={`/apps4sale/${product.slug}`} className="block p-8 md:p-10 h-full w-full">
                {/* Subtle Gradient Backglow */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF5B04]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <LogoIcon />

                <h3 className="text-lg md:text-2xl font-bold mb-3 text-zinc-900 group-hover:text-[#FF5B04] transition-colors duration-300">
                  {product.title}
                </h3>

                <p className="text-zinc-500 leading-relaxed text-sm md:text-base group-hover:text-zinc-600">
                  {product.description}
                </p>

                <div className="mt-8 pt-8 border-t border-zinc-50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <span className="text-[#FF5B04] font-bold text-sm uppercase tracking-wider">View Project</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19" stroke="#FF5B04" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 5L19 12L12 19" stroke="#FF5B04" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-xl font-bold text-zinc-900 mb-2">No products found</h3>
            <p className="text-zinc-500">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      {/* Aesthetic Blobs */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#FF5B04]/[0.02] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/[0.01] rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
    </div>
  );
};

export default Apps4Sale;

