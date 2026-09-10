"use client";

import { motion } from "framer-motion";

// 1. Heuristic UX Audit Report (Scanner sweeping over a wireframe)
export const VisualAuditNew = () => {
  return (
    <div className="w-full h-full bg-gray-50 flex items-center justify-center p-6 relative overflow-hidden select-none">
      {/* Background abstract dots */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Wireframe Mobile App Device */}
      <div className="w-[140px] h-[220px] bg-white rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col p-3 relative overflow-hidden">
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-4">
          <div className="w-6 h-6 bg-gray-100 rounded-full" />
          <div className="w-12 h-2 bg-gray-200 rounded-full" />
          <div className="w-4 h-4 bg-gray-100 rounded-sm" />
        </div>

        {/* Hero Image Block */}
        <div className="w-full h-24 bg-gray-50 rounded-xl mb-3 border border-gray-100" />

        {/* List items */}
        <div className="flex flex-col gap-2">
          <div className="w-full h-8 bg-gray-50 rounded-lg border border-gray-100 flex items-center px-2">
            <div className="w-4 h-4 bg-gray-200 rounded-full mr-2" />
            <div className="w-16 h-1.5 bg-gray-200 rounded-full" />
          </div>
          <div className="w-full h-8 bg-gray-50 rounded-lg border border-gray-100 flex items-center px-2">
            <div className="w-4 h-4 bg-gray-200 rounded-full mr-2" />
            <div className="w-10 h-1.5 bg-gray-200 rounded-full" />
          </div>
        </div>

        {/* Scanning Laser */}
        <motion.div
          animate={{ top: ["0%", "100%", "0%"] }}
          className="absolute left-0 right-0 h-0.5 bg-[#ff5b04] z-20 shadow-[0_0_10px_#ff5e00,0_4px_20px_#ff5e00]"
          initial={{ top: "0%" }}
          transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#ff5b04]/30 to-transparent h-12 -top-12 pointer-events-none" />
        </motion.div>

        {/* Discovered Issues (Red Dots) */}
        <motion.div
          animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1, 1, 0.5] }}
          className="absolute top-[50px] right-[20px] w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-md z-10 flex items-center justify-center"
          initial={{ opacity: 0 }}
          transition={{
            duration: 4,
            times: [0, 0.2, 0.8, 1],
            repeat: Infinity,
            delay: 0.8,
          }}
        >
          <div className="w-1 h-1 bg-white rounded-full animate-ping" />
        </motion.div>

        <motion.div
          animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1, 1, 0.5] }}
          className="absolute top-[140px] left-[30px] w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-md z-10 flex items-center justify-center"
          initial={{ opacity: 0 }}
          transition={{
            duration: 4,
            times: [0, 0.2, 0.8, 1],
            repeat: Infinity,
            delay: 1.5,
          }}
        >
          <div className="w-1 h-1 bg-white rounded-full animate-ping" />
        </motion.div>
      </div>

      {/* Floating Scorecard */}
      <motion.div
        animate={{ y: [-5, 5, -5] }}
        className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-gray-100 flex items-center gap-3 z-30"
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center border border-orange-100">
          <svg
            className="w-4 h-4 text-[#ff5b04]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <div className="text-[10px] text-gray-400 font-bold tracking-wider uppercase">
            Issues Found
          </div>
          <div className="text-lg font-black text-gray-800 leading-none">
            12
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// 2. Drop-Off & Friction Insights (Funnel Leak)
export const VisualFrictionNew = () => {
  return (
    <div className="w-full h-full bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-6 relative overflow-hidden select-none">
      <div className="w-full max-w-[240px] h-[160px] relative">
        {/* The Funnel Pipe */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-16 bg-white border border-gray-200 rounded-2xl shadow-[inset_0_4px_20px_rgba(0,0,0,0.02)] flex items-center px-2 overflow-hidden z-0">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-8 bg-red-50/50 border-l border-r border-red-100" />
        </div>

        {/* Leaking hole */}
        <div className="absolute top-1/2 translate-y-[24px] left-1/2 -translate-x-1/2 w-10 h-3 bg-gray-200 rounded-full blur-[2px] opacity-50 z-10" />

        {/* Successful Users (Flowing straight) */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`success-${i}`}
            animate={{ x: [0, 240] }}
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-[#ff5b04] rounded-full shadow-[0_0_8px_rgba(255,94,0,0.4)] z-20"
            initial={{ x: -20 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.5,
            }}
          />
        ))}

        {/* Dropping Users (Friction) */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={`drop-${i}`}
            animate={{
              x: [0, 115, 115 + (Math.random() * 40 - 20)],
              y: [0, 0, 60 + Math.random() * 40],
              opacity: [1, 1, 0],
            }}
            className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-gray-400 rounded-full z-20"
            initial={{ x: -20, y: 0, opacity: 1 }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeIn",
              delay: i * 0.3 + 0.1,
              times: [0, 0.45, 1],
            }}
          />
        ))}

        {/* Warning Indicator over the leak */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], y: [-5, 0, -5] }}
          className="absolute top-4 left-1/2 -translate-x-1/2 bg-white px-3 py-1.5 rounded-full shadow-lg border border-red-100 flex items-center gap-1.5 z-30"
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[10px] font-bold text-gray-700 tracking-wide uppercase">
            Friction Point
          </span>
        </motion.div>
      </div>
    </div>
  );
};

// 3. Flow & Interaction Review (Journey Map)
export const VisualFlowNew = () => {
  return (
    <div className="w-full h-full bg-gray-50 flex items-center justify-center p-6 relative overflow-hidden select-none">
      <div className="relative w-full h-full max-w-[280px]">
        {/* SVG Journey Path */}
        <svg
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          <path
            d="M 10,20 C 40,20 40,80 70,80 C 85,80 90,60 90,40"
            fill="none"
            stroke="#e2e8f0"
            strokeLinecap="round"
            strokeWidth="3"
          />
          <motion.path
            animate={{ pathLength: [0, 1] }}
            d="M 10,20 C 40,20 40,80 70,80 C 85,80 90,60 90,40"
            fill="none"
            stroke="#ff5b04"
            strokeLinecap="round"
            strokeWidth="3"
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>

        {/* Nodes */}
        <div className="absolute top-[20%] left-[10%] -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="w-8 h-8 bg-white rounded-full border-2 border-[#ff5b04] shadow-md flex items-center justify-center">
            <div className="w-3 h-3 bg-[#ff5b04] rounded-full" />
          </div>
        </div>

        <div className="absolute top-[50%] left-[40%] -translate-x-1/2 -translate-y-1/2 z-10">
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              borderColor: ["#e2e8f0", "#ff5b04", "#e2e8f0"],
            }}
            className="w-10 h-10 bg-white rounded-xl border-2 shadow-md flex items-center justify-center"
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          >
            <div className="flex flex-col gap-1 w-5">
              <div className="w-full h-1 bg-gray-200 rounded" />
              <div className="w-3/4 h-1 bg-gray-200 rounded" />
            </div>
          </motion.div>
        </div>

        <div className="absolute top-[80%] left-[70%] -translate-x-1/2 -translate-y-1/2 z-10">
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              borderColor: ["#e2e8f0", "#ff5b04", "#e2e8f0"],
            }}
            className="w-10 h-10 bg-white rounded-xl border-2 shadow-md flex items-center justify-center"
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          >
            <div className="w-4 h-4 rounded border-2 border-gray-300 flex items-center justify-center">
              <motion.div
                animate={{ opacity: [0, 1, 0] }}
                className="w-2 h-2 bg-[#ff5b04] rounded-sm"
                transition={{ duration: 3, repeat: Infinity, delay: 2 }}
              />
            </div>
          </motion.div>
        </div>

        <div className="absolute top-[40%] left-[90%] -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="w-10 h-10 bg-[#ff5b04] rounded-full shadow-[0_0_15px_rgba(255,94,0,0.4)] flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path
                d="M5 13l4 4L19 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

// 4. Walkthrough Video (Screen Recorder)
export const VisualVideoNew = () => {
  return (
    <div className="w-full h-full bg-gradient-to-tr from-gray-50 to-gray-100 flex items-center justify-center p-6 relative overflow-hidden select-none">
      <div className="w-full h-[180px] max-w-[260px] bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-gray-200 flex flex-col overflow-hidden relative">
        {/* Browser / Video Frame Header */}
        <div className="w-full h-8 bg-gray-50 border-b border-gray-100 flex items-center px-3 gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <div className="w-2 h-2 rounded-full bg-yellow-400" />
          <div className="w-2 h-2 rounded-full bg-green-400" />
          <div className="mx-auto w-24 h-2 bg-gray-200 rounded-full" />
        </div>

        {/* Video Content Area */}
        <div className="flex-1 bg-white relative p-4 flex gap-4">
          {/* Abstract UI inside video */}
          <div className="w-1/3 flex flex-col gap-2">
            <div className="w-full h-12 bg-gray-100 rounded-lg" />
            <div className="w-full h-6 bg-gray-50 rounded-lg" />
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <div className="w-3/4 h-3 bg-gray-200 rounded" />
            <div className="w-full h-1.5 bg-gray-100 rounded" />
            <div className="w-full h-1.5 bg-gray-100 rounded" />
            <div className="w-5/6 h-1.5 bg-gray-100 rounded" />

            {/* Button to click */}
            <motion.div
              animate={{ backgroundColor: ["#f3f4f6", "#ff5b04", "#f3f4f6"] }}
              className="mt-2 w-16 h-5 bg-gray-100 rounded-md flex items-center justify-center border border-gray-200"
              transition={{
                duration: 4,
                times: [0, 0.45, 0.55],
                repeat: Infinity,
              }}
            >
              <div className="w-8 h-1 bg-white/80 rounded" />
            </motion.div>
          </div>

          {/* Mouse Cursor */}
          <motion.div
            animate={{
              x: [150, 70, 70, 150],
              y: [70, 55, 55, 70],
              scale: [1, 1, 0.9, 1],
            }}
            className="absolute z-30 drop-shadow-md"
            initial={{ x: 150, y: 70 }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg fill="black" height="20" viewBox="0 0 24 24" width="20">
              <path
                d="M4 2L20 12L12 14L15 22L12 23L9 15L4 18V2Z"
                fill="black"
                stroke="white"
                strokeWidth="2"
              />
            </svg>

            {/* Click Ripple */}
            <motion.div
              animate={{ opacity: [0, 1, 0], scale: [0.5, 2, 2] }}
              className="absolute -top-2 -left-2 w-8 h-8 rounded-full border-2 border-[#ff5b04]"
              initial={{ opacity: 0 }}
              transition={{
                duration: 4,
                times: [0, 0.45, 0.55],
                repeat: Infinity,
              }}
            />
          </motion.div>
        </div>

        {/* Video Scrubber & REC indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gray-900/90 backdrop-blur-md px-3 flex items-center gap-2">
          <div className="w-4 h-4 rounded-full flex items-center justify-center border border-gray-600 bg-gray-800">
            <svg
              className="w-2 h-2 text-white ml-0.5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>

          <div className="flex-1 h-1 bg-gray-700 rounded-full relative overflow-hidden">
            <motion.div
              animate={{ width: ["0%", "100%"] }}
              className="absolute left-0 top-0 bottom-0 bg-[#ff5b04]"
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
          </div>

          <div className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded border border-gray-700">
            <motion.div
              animate={{ opacity: [1, 0.2, 1] }}
              className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_4px_#ef4444]"
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className="text-[7px] font-bold text-white tracking-widest">
              REC
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
