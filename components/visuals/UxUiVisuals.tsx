"use client";

import { useEffect } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";

// 1. UX/UI Design & Prototype (Wireframe to Hi-Fi & Interaction)
export const VisualUxUiNew = () => {
  return (
    <div className="w-full h-full bg-gradient-to-tr from-gray-50 to-gray-100 flex items-center justify-center p-6 relative overflow-hidden select-none">
      {/* Container holding the two screens */}
      <div className="relative w-full max-w-[280px] h-[160px] flex items-center justify-between px-2">
        {/* Left: Wireframe Screen */}
        <div className="w-[110px] h-[140px] bg-white border-2 border-gray-200 border-dashed rounded-xl shadow-sm flex flex-col p-2 gap-2 relative z-10">
          {/* Wireframe Header */}
          <div className="w-full h-6 border-2 border-gray-200 border-dashed rounded flex items-center px-1">
            <div className="w-4 h-4 rounded-full border-2 border-gray-200 border-dashed" />
          </div>
          {/* Wireframe Hero */}
          <div className="w-full h-12 border-2 border-gray-200 border-dashed rounded flex flex-col items-center justify-center gap-1">
            <div className="w-1/2 h-1 border border-gray-200 border-dashed" />
            <div className="w-3/4 h-1 border border-gray-200 border-dashed" />
          </div>
          {/* Wireframe Button (Interactive trigger point) */}
          <motion.div
            animate={{
              scale: [1, 0.95, 1],
              borderColor: ["#e5e7eb", "#ff5b04", "#e5e7eb"],
            }}
            className="w-1/2 h-6 border-2 border-gray-200 border-dashed rounded mx-auto mt-auto"
            transition={{
              duration: 4,
              repeat: Infinity,
              times: [0, 0.45, 0.5, 1],
            }}
          />
        </div>

        {/* Prototype Connection Arrow */}
        <svg
          className="absolute inset-0 w-full h-full z-0"
          pointerEvents="none"
          viewBox="0 0 280 160"
        >
          <motion.path
            animate={{ strokeDashoffset: [40, 0] }}
            d="M 90 120 Q 140 160 190 80"
            fill="none"
            stroke="#ff5b04"
            strokeDasharray="4 4"
            strokeWidth="2"
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          {/* Arrowhead */}
          <motion.path
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            d="M 190 80 L 182 85 L 188 88 Z"
            fill="#ff5b04"
            transition={{ duration: 1, repeat: Infinity }}
          />
        </svg>

        {/* Right: Hi-Fi Polished Screen */}
        <motion.div
          animate={{
            y: [0, -5, 0],
            boxShadow: [
              "0px 4px 6px rgba(0,0,0,0.06)",
              "0px 10px 20px rgba(0,0,0,0.09)",
              "0px 4px 6px rgba(0,0,0,0.06)",
            ],
          }}
          className="w-[120px] h-[150px] bg-white border border-gray-100 rounded-xl flex flex-col p-2 gap-2 relative z-10"
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Hi-Fi Header */}
          <div className="w-full h-6 bg-gray-50 rounded flex items-center px-1 shadow-sm border border-gray-100">
            <div className="w-4 h-4 rounded-full bg-orange-50 flex items-center justify-center border border-orange-200/60">
              <div className="w-2 h-2 rounded-full bg-[#ff5b04]" />
            </div>
          </div>
          {/* Hi-Fi Hero */}
          <div className="w-full h-12 bg-gradient-to-br from-gray-50 to-gray-100/80 rounded flex flex-col items-center justify-center gap-1 border border-gray-100">
            <div className="w-1/2 h-1.5 bg-gray-800 rounded" />
            <div className="w-3/4 h-1.5 bg-gray-400 rounded" />
          </div>
          {/* Hi-Fi Polished Button */}
          <motion.div
            animate={{ backgroundColor: ["#ff5b04", "#ea580c", "#ff5b04"] }}
            className="w-2/3 h-6 rounded mx-auto mt-auto shadow-[0_4px_10px_rgba(255,91,4,0.3)] flex items-center justify-center"
            transition={{
              duration: 4,
              repeat: Infinity,
              times: [0, 0.45, 0.5, 1],
            }}
          >
            <div className="w-1/2 h-1 bg-white/90 rounded" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

// 2. UI Development & Integration (Code Rendering the Component)
export const VisualUiDevNew = () => {
  return (
    <div className="w-full h-full bg-gradient-to-tr from-gray-50 to-gray-100 flex items-center justify-center p-6 relative overflow-hidden select-none">
      <div className="relative w-full max-w-[280px] h-[160px] flex gap-4">
        {/* Left: Code Editor typing out */}
        <div className="flex-1 bg-gray-900 rounded-xl shadow-lg flex flex-col overflow-hidden border border-gray-800">
          <div className="h-5 bg-gray-800/90 flex items-center px-2 gap-1 border-b border-gray-700/50">
            <div className="w-1.5 h-1.5 rounded-full bg-[#ff5f56]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#ffbd2e]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#27c93f]" />
          </div>
          <div className="flex-1 p-3 flex flex-col gap-2">
            <div className="w-3/4 h-1.5 bg-[#ff5b04] rounded" />
            <motion.div
              animate={{ width: ["0%", "80%", "80%", "0%"] }}
              className="h-1.5 bg-gray-500 rounded ml-2"
              transition={{
                duration: 4,
                repeat: Infinity,
                times: [0, 0.3, 0.8, 1],
              }}
            />
            <motion.div
              animate={{ width: ["0%", "50%", "50%", "0%"] }}
              className="h-1.5 bg-gray-400 rounded ml-4"
              transition={{
                duration: 4,
                repeat: Infinity,
                times: [0, 0.4, 0.8, 1],
              }}
            />
            <motion.div
              animate={{ width: ["0%", "60%", "60%", "0%"] }}
              className="h-1.5 bg-gray-500 rounded ml-2"
              transition={{
                duration: 4,
                repeat: Infinity,
                times: [0, 0.5, 0.8, 1],
              }}
            />
            <div className="w-1/2 h-1.5 bg-[#ff5b04]/70 rounded mt-1" />
          </div>
        </div>

        {/* Right: Live Interactive Component Rendering */}
        <div className="w-[100px] flex items-center justify-center">
          <motion.div
            animate={{
              backgroundColor: ["#f9fafb", "#ffffff", "#ffffff", "#f9fafb"],
              boxShadow: [
                "0px 0px 0px rgba(0,0,0,0)",
                "0px 8px 20px rgba(0,0,0,0.06)",
                "0px 8px 20px rgba(0,0,0,0.06)",
                "0px 0px 0px rgba(0,0,0,0)",
              ],
              borderColor: ["#e5e7eb", "#ff5b04", "#ff5b04", "#e5e7eb"],
            }}
            className="w-full h-[100px] rounded-xl border-2 flex flex-col items-center justify-center gap-3 relative bg-white"
            transition={{
              duration: 4,
              repeat: Infinity,
              times: [0, 0.5, 0.8, 1],
            }}
          >
            {/* The Toggle Switch responding to the code */}
            <motion.div
              animate={{
                backgroundColor: ["#e5e7eb", "#ff5b04", "#ff5b04", "#e5e7eb"],
              }}
              className="w-12 h-6 rounded-full flex items-center px-1"
              transition={{
                duration: 4,
                repeat: Infinity,
                times: [0, 0.5, 0.8, 1],
              }}
            >
              <motion.div
                animate={{ x: [0, 24, 24, 0] }}
                className="w-4 h-4 bg-white rounded-full shadow-sm"
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  times: [0, 0.5, 0.8, 1],
                  ease: "anticipate",
                }}
              />
            </motion.div>
            <div className="w-1/2 h-1.5 bg-gray-200 rounded" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// 3. New Build or Redesign (The Layout Evolution - Before & After Reveal Slider)
export const VisualRedesignNew = () => {
  const percent = useMotionValue(0);

  useEffect(() => {
    const controls = animate(percent, [0, 100, 0], {
      duration: 6,
      ease: "easeInOut",
      repeat: Infinity,
    });
    return () => controls.stop();
  }, [percent]);

  // Synchronously compute clipPath and handle position from the exact same animated motion value
  const clipPath = useTransform(percent, (v) => `inset(0 ${100 - v}% 0 0)`);
  const left = useTransform(percent, (v) => `${v}%`);

  return (
    <div className="w-full h-full bg-gradient-to-tr from-gray-50 to-gray-100 flex items-center justify-center p-6 relative overflow-hidden select-none">
      <div className="relative w-full max-w-[250px] h-[160px] rounded-xl overflow-hidden shadow-lg border border-gray-100 bg-white">
        {/* Old/Messy Layout (Underneath) */}
        <div className="absolute inset-0 bg-gray-100/90 p-3 flex flex-col gap-2 select-none grayscale opacity-60">
          {/* Unaligned, rough blocks */}
          <div className="flex gap-2">
            <div className="w-1/2 h-8 bg-gray-300 rounded" />
            <div className="w-1/3 h-6 bg-gray-400 mt-2 rounded" />
          </div>
          <div className="w-[90%] h-14 bg-gray-300 ml-[5%] rounded" />
          <div className="flex gap-1 ml-4 mt-auto">
            <div className="w-9 h-9 bg-gray-400 rounded-full" />
            <div className="w-16 h-8 bg-gray-300 mt-1 rounded" />
          </div>
        </div>

        {/* New/Modern Layout (Revealed via synchronized clipPath) */}
        <motion.div
          className="absolute inset-0 bg-white p-3 flex flex-col gap-2 z-10 select-none pointer-events-none"
          style={{ clipPath }}
        >
          {/* Perfectly aligned, modern blocks */}
          <div className="flex justify-between items-center bg-gray-50 p-2 rounded-lg border border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#ff5b04] rounded-md shadow-xs" />
              <div className="w-14 h-2 bg-gray-800 rounded" />
            </div>
            <div className="flex gap-1">
              <div className="w-4 h-1.5 bg-gray-200 rounded" />
              <div className="w-4 h-1.5 bg-gray-200 rounded" />
            </div>
          </div>

          <div className="w-full flex-1 bg-gradient-to-br from-gray-50 to-gray-100/70 rounded-lg border border-gray-100 flex flex-col justify-center p-3 gap-1.5">
            <div className="w-1/2 h-2 bg-gray-800 rounded" />
            <div className="w-3/4 h-1.5 bg-gray-400 rounded" />
          </div>

          <div className="flex gap-2 h-9 flex-shrink-0">
            <div className="flex-1 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center">
              <div className="w-1/2 h-1.5 bg-gray-300 rounded" />
            </div>
            <div className="flex-1 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center">
              <div className="w-1/2 h-1.5 bg-gray-300 rounded" />
            </div>
          </div>
        </motion.div>

        {/* Slider Divider Line + Handle (driven by the exact same left transform) */}
        <motion.div
          className="absolute top-0 bottom-0 w-[2px] bg-[#ff5b04] z-20 pointer-events-none -ml-[1px]"
          style={{ left }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-white border-2 border-[#ff5b04] rounded-full shadow-lg flex items-center justify-center">
            <svg
              className="text-[#ff5b04]"
              fill="none"
              height="12"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
              width="12"
            >
              <path d="M8 7l-5 5 5 5M16 7l5 5-5 5" />
            </svg>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// 4. Mobile Optimization (Fluid Constraint & Collapse)
export const VisualMobileOptNew = () => {
  return (
    <div className="w-full h-full bg-gradient-to-tr from-gray-50 to-gray-100 flex items-center justify-center p-6 relative overflow-hidden select-none">
      <div className="relative w-full max-w-[280px] h-[160px] flex items-center justify-center">
        {/* Dynamic Responsive Viewport */}
        <motion.div
          animate={{ width: ["260px", "100px", "100px", "260px"] }}
          className="h-[150px] bg-white border border-gray-100 rounded-xl shadow-lg flex flex-col overflow-hidden relative"
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.3, 0.7, 1],
          }}
        >
          {/* Header */}
          <div className="w-full h-6 bg-gray-50/90 border-b border-gray-100 flex items-center px-2 gap-1 flex-shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
            <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
            <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
          </div>

          {/* Responsive Content Grid */}
          <div className="flex-1 p-2 flex flex-wrap content-start gap-1.5 h-full overflow-hidden">
            {/* Main Hero Block */}
            <div className="w-full h-8 bg-orange-50/60 rounded-lg border border-orange-200/50 flex-shrink-0" />

            {/* The 3-Column Grid that collapses */}
            {/* On Desktop (260px width), they sit 3 across. On Mobile (100px width), flex-wrap forces them to stack vertically. */}
            <motion.div
              animate={{ minWidth: ["29%", "100%", "100%", "29%"] }}
              className="flex-1 h-6 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center px-1"
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.3, 0.7, 1],
              }}
            >
              <div className="w-3/4 h-1 bg-gray-300 rounded" />
            </motion.div>
            <motion.div
              animate={{ minWidth: ["29%", "100%", "100%", "29%"] }}
              className="flex-1 h-6 bg-white rounded-lg border border-orange-200/70 shadow-xs flex items-center justify-center px-1"
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.3, 0.7, 1],
              }}
            >
              <div className="w-3/4 h-1 bg-[#ff5b04]/70 rounded" />
            </motion.div>
            <motion.div
              animate={{ minWidth: ["29%", "100%", "100%", "29%"] }}
              className="flex-1 h-6 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center px-1"
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.3, 0.7, 1],
              }}
            >
              <div className="w-3/4 h-1 bg-gray-300 rounded" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
