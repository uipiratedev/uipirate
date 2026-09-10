"use client";

import { motion } from "framer-motion";

// 1. Landing Pages & Corporate Websites (The Conversion Funnel)
export const VisualLandingNew = () => {
  return (
    <div className="w-full h-full bg-gradient-to-tr from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden select-none p-6">
      <div className="relative w-[220px] h-[300px] bg-white rounded-t-xl shadow-xl border-x border-t border-gray-200 overflow-hidden translate-y-8">
        {/* Browser Chrome */}
        <div className="w-full h-6 bg-gray-50 border-b border-gray-100 flex items-center px-2 gap-1.5 absolute top-0 left-0 right-0 z-20">
          <div className="w-2 h-2 rounded-full bg-[#ff5f56]" />
          <div className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
          <div className="w-2 h-2 rounded-full bg-[#27c93f]" />
        </div>

        {/* Page Content */}
        <motion.div
          animate={{ y: [0, -80, 0] }}
          className="w-full flex flex-col pt-8 px-4 gap-4"
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.4, 1],
          }}
        >
          {/* Hero Section */}
          <div className="flex flex-col gap-2 pt-2">
            <div className="w-3/4 h-3 bg-gray-300 rounded" />
            <div className="w-1/2 h-2 bg-gray-200 rounded" />
            <div className="w-full h-24 bg-gradient-to-br from-gray-50 to-gray-100/80 rounded-lg mt-2 border border-gray-100" />
          </div>

          {/* Features */}
          <div className="flex justify-between gap-2">
            <div className="flex-1 h-12 bg-gray-50 rounded border border-gray-100" />
            <div className="flex-1 h-12 bg-gray-50 rounded border border-gray-100" />
            <div className="flex-1 h-12 bg-gray-50 rounded border border-gray-100" />
          </div>

          {/* CTA Section */}
          <div className="w-full h-20 bg-gray-50/80 border border-gray-100 rounded-lg flex flex-col items-center justify-center gap-2 mt-4">
            <div className="w-1/2 h-2 bg-gray-300 rounded" />
            {/* The CTA Button */}
            <motion.div
              animate={{ scale: [1, 1, 0.95, 1, 1] }}
              className="px-4 py-1.5 bg-[#ff5b04] rounded text-[8px] text-white font-bold tracking-wider shadow-[0_2px_10px_rgba(255,91,4,0.3)]"
              transition={{
                duration: 4,
                repeat: Infinity,
                times: [0, 0.45, 0.5, 0.55, 1],
              }}
            >
              GET STARTED
            </motion.div>
          </div>
        </motion.div>

        {/* User / Cursor Dot */}
        <motion.div
          animate={{
            x: [0, 20, 0, 0, 0],
            y: [0, 60, 180, 180, 0],
            scale: [1, 1, 1, 0.8, 1],
          }}
          className="absolute w-4 h-4 rounded-full bg-[#ff5b04] shadow-[0_2px_8px_rgba(255,91,4,0.4)] z-30"
          style={{ top: 40, left: 100 }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.2, 0.45, 0.5, 1],
          }}
        />

        {/* Lead Captured Popup */}
        <motion.div
          animate={{ opacity: [0, 0, 1, 0, 0], y: [10, 10, 0, 0, 10] }}
          className="absolute inset-0 flex items-center justify-center z-40 bg-white/60 backdrop-blur-sm"
          transition={{
            duration: 4,
            repeat: Infinity,
            times: [0, 0.5, 0.6, 0.8, 1],
          }}
        >
          <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-xl flex flex-col items-center gap-2">
            <div className="w-6 h-6 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-200/60">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
            </div>
            <div className="text-[10px] font-bold text-gray-800">
              Lead Captured
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// 2. Design & Frontend Development (Design to Code Translation)
export const VisualFrontendNew = () => {
  return (
    <div className="w-full h-full bg-gradient-to-tr from-gray-50 to-gray-100 flex items-center justify-center p-6 relative overflow-hidden select-none">
      <div className="relative w-full max-w-[280px] h-[160px] flex gap-4">
        {/* Left: Design Canvas (Figma-like) */}
        <div className="flex-1 bg-white rounded-xl shadow-md border border-gray-200 flex flex-col overflow-hidden relative">
          <div className="h-6 bg-gray-50 border-b border-gray-100 flex items-center px-2">
            <span className="text-[8px] font-bold text-gray-400">DESIGN</span>
          </div>
          <div className="flex-1 p-3 flex flex-col gap-2 relative">
            {/* UI Element being designed */}
            <motion.div
              animate={{ x: [0, 10, 0], y: [0, -5, 0] }}
              className="w-full h-12 bg-orange-50/60 border border-orange-200/60 rounded-lg flex items-center px-2"
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-12 h-1.5 bg-[#ff5b04]/50 rounded" />
            </motion.div>
            {/* Designer Cursor */}
            <motion.div
              animate={{ x: [-10, 0, -10], y: [-10, -15, -10] }}
              className="absolute w-4 h-4 top-1/2 left-1/2 z-10"
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg
                className="w-full h-full text-gray-900 drop-shadow-sm"
                fill="none"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 4L9.82 21.46L13.13 13.13L21.46 9.82L4 4Z"
                  fill="currentColor"
                  stroke="white"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </motion.div>
          </div>
        </div>

        {/* Connection Animation */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <motion.div
            animate={{ rotate: 360 }}
            className="w-6 h-6 rounded-full border-2 border-[#ff5b04] border-t-transparent border-r-transparent"
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Right: Code Editor */}
        <div className="flex-1 bg-gray-900 rounded-xl shadow-md border border-gray-800 flex flex-col overflow-hidden">
          <div className="h-6 bg-gray-800/80 border-b border-gray-700/50 flex items-center px-2">
            <span className="text-[8px] font-bold text-gray-400">CODE</span>
          </div>
          <div className="flex-1 p-3 flex flex-col gap-1.5 font-mono text-[8px] text-gray-400">
            <div>
              <span className="text-[#ff5b04]">&lt;div</span>{" "}
              <span className="text-gray-300">className</span>=
              <span className="text-emerald-400">"ui-card"</span>
              <span className="text-[#ff5b04]">&gt;</span>
            </div>

            {/* Code Highlighting syncing with design movement */}
            <motion.div
              animate={{
                backgroundColor: [
                  "rgba(255,91,4,0)",
                  "rgba(255,91,4,0.18)",
                  "rgba(255,91,4,0)",
                ],
              }}
              className="pl-3 py-0.5 rounded"
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            >
              <div className="w-3/4 h-1.5 bg-[#ff5b04]/80 rounded mb-1" />
              <div className="w-1/2 h-1.5 bg-gray-500 rounded" />
            </motion.div>

            <div>
              <span className="text-[#ff5b04]">&lt;/div&gt;</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. SEO Performance & AI-Readable Websites (The Bot Crawler)
export const VisualSEONew = () => {
  return (
    <div className="w-full h-full bg-gradient-to-tr from-gray-50 to-gray-100 flex items-center justify-center p-6 relative overflow-hidden select-none">
      <div className="relative w-full max-w-[210px] h-[180px] bg-white border border-gray-200 rounded-xl shadow-sm p-3.5 flex flex-col gap-2.5">
        {/* Semantic Blocks */}
        <div className="w-full h-6 bg-gray-50 border border-gray-100 rounded flex items-center px-2 justify-between">
          <span className="text-[8px] font-bold text-gray-400 font-mono">
            &lt;nav&gt;
          </span>
          <div className="w-8 h-1.5 bg-gray-200 rounded" />
        </div>

        <div className="flex-1 bg-gray-50/60 border border-gray-100 rounded p-2 flex flex-col gap-2">
          <span className="text-[8px] font-bold text-[#ff5b04] font-mono">
            &lt;main&gt;
          </span>
          <div className="w-3/4 h-2 bg-orange-100 rounded border border-orange-200/50" />
          <div className="w-full h-1.5 bg-gray-200/70 rounded" />
          <div className="w-5/6 h-1.5 bg-gray-200/70 rounded" />
        </div>

        <div className="w-full h-6 bg-gray-50 border border-gray-100 rounded flex items-center px-2">
          <span className="text-[8px] font-bold text-gray-400 font-mono">
            &lt;footer&gt;
          </span>
        </div>

        {/* Bot Crawler Beam */}
        <motion.div
          animate={{
            top: ["-10%", "110%", "-10%"],
            opacity: [0, 1, 1, 0, 0],
          }}
          className="absolute left-0 right-0 h-6 bg-gradient-to-b from-transparent to-[#ff5b04]/15 border-b-2 border-[#ff5b04] z-10 shadow-[0_0_12px_#ff5e00]"
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.45, 0.5, 0.95, 1],
          }}
        />

        {/* SEO Score Popup */}
        <motion.div
          animate={{
            opacity: [0, 0, 1, 1, 0],
            scale: [0.8, 0.8, 1, 1, 0.8],
          }}
          className="absolute -right-3 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-md border border-gray-100 rounded-xl px-2.5 py-1.5 shadow-lg z-20 flex flex-col items-center"
          transition={{
            duration: 4,
            repeat: Infinity,
            times: [0, 0.4, 0.5, 0.8, 1],
          }}
        >
          <span className="text-[7.5px] font-bold text-gray-400 tracking-wider uppercase">
            SEO Score
          </span>
          <div className="flex items-center gap-1 mt-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-black text-emerald-600 leading-none">
              100
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// 4. Fully Responsive Experience (Fluid Multi-Device Reflow)
export const VisualResponsiveNew = () => {
  return (
    <div className="w-full h-full bg-gradient-to-tr from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden select-none p-6">
      {/* Device Label Indicator */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20">
        <motion.div
          animate={{
            opacity: [1, 1, 0, 0, 0, 0],
            y: [-4, -4, 0, 0, 0, -4],
          }}
          className="text-[8.5px] font-bold text-gray-500 tracking-widest uppercase bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-md border border-gray-200/60 shadow-xs"
          transition={{
            duration: 8,
            repeat: Infinity,
            times: [0, 0.2, 0.4, 0.6, 0.8, 1],
          }}
        >
          DESKTOP
        </motion.div>

        <motion.div
          animate={{
            opacity: [0, 0, 0, 1, 0, 0],
            y: [0, 0, 0, -4, 0, 0],
          }}
          className="absolute inset-0 text-[8.5px] font-bold text-gray-500 tracking-widest uppercase bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-md border border-gray-200/60 shadow-xs flex items-center justify-center whitespace-nowrap"
          transition={{
            duration: 8,
            repeat: Infinity,
            times: [0, 0.2, 0.4, 0.6, 0.8, 1],
          }}
        >
          TABLET
        </motion.div>

        <motion.div
          animate={{
            opacity: [0, 0, 0, 0, 1, 0],
            y: [0, 0, 0, 0, -4, 0],
          }}
          className="absolute inset-0 text-[8.5px] font-bold text-[#ff5b04] tracking-widest uppercase bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-md border border-orange-200/60 shadow-xs flex items-center justify-center whitespace-nowrap"
          transition={{
            duration: 8,
            repeat: Infinity,
            times: [0, 0.2, 0.4, 0.6, 0.8, 1],
          }}
        >
          MOBILE
        </motion.div>
      </div>

      {/* Responsive Device Frame */}
      <motion.div
        animate={{
          width: ["240px", "240px", "240px", "140px", "84px", "240px"],
        }}
        className="h-[156px] bg-white border border-gray-100 rounded-xl shadow-lg flex flex-col overflow-hidden mt-4"
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.2, 0.4, 0.6, 0.8, 1],
        }}
      >
        <div className="w-full h-4 bg-gray-50 border-b border-gray-100 flex items-center px-1.5 gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
          <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
        </div>

        {/* Dynamic Content Layout */}
        <div className="flex-1 p-2 flex flex-wrap content-start gap-1.5 h-full">
          {/* Header Block */}
          <div className="w-full h-3 bg-gray-200 rounded" />

          {/* Main Visual Block */}
          <motion.div
            animate={{
              width: ["100%", "100%", "100%", "100%", "100%", "100%"],
            }}
            className="h-10 bg-gradient-to-br from-gray-50 to-gray-100 rounded border border-gray-200/80 flex-grow"
          />

          {/* Text Blocks (Side by side on wide, stacked on narrow) */}
          <motion.div
            animate={{
              minWidth: ["46%", "46%", "46%", "100%", "100%", "46%"],
            }}
            className="flex-1 h-7 bg-gray-50 rounded border border-gray-100"
          />
          <motion.div
            animate={{
              minWidth: ["46%", "46%", "46%", "100%", "100%", "46%"],
            }}
            className="flex-1 h-7 bg-orange-50/60 rounded border border-orange-200/50"
          />
        </div>
      </motion.div>
    </div>
  );
};
