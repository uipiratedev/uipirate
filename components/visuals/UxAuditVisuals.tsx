"use client";

import { motion } from "framer-motion";

// 1. Heuristic UX Audit Report (Scanner sweeping over a wireframe)
export const VisualAuditNew = () => {
  return (
    <div className="w-full h-full bg-gradient-to-tr from-gray-50 to-gray-100 flex items-center justify-center p-6 relative overflow-hidden select-none">

      {/* Wireframe Mobile App Device */}
      <div className="w-[140px] h-[208px] bg-white rounded-[20px] shadow-[0_10px_28px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] border border-gray-200/80 flex flex-col p-2.5 relative overflow-hidden flex-shrink-0">
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-2 flex-shrink-0">
          <div className="w-4 h-4 bg-gray-100 rounded-full" />
          <div className="w-12 h-1.5 bg-gray-200/80 rounded-full" />
          <div className="w-3.5 h-3.5 bg-gray-100 rounded-md" />
        </div>

        {/* Hero Image Block with Issue 1 */}
        <div className="relative w-full h-[82px] bg-gradient-to-br from-gray-50 to-gray-100/70 rounded-xl mb-2 border border-gray-100 p-2 flex flex-col justify-between overflow-hidden flex-shrink-0">
          <div className="w-10 h-1.5 bg-gray-200/80 rounded-full" />
          <div className="space-y-1">
            <div className="w-16 h-2 bg-gray-200/90 rounded-full" />
            <div className="w-10 h-1.5 bg-gray-200/60 rounded-full" />
          </div>

          {/* Discovered Issue 1: Cleanly aligned in top-right of Hero Block */}
          <motion.div
            animate={{ opacity: [0, 1, 1, 0], scale: [0.6, 1, 1, 0.6] }}
            className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white shadow-md z-10 flex items-center justify-center"
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
        </div>

        {/* List items */}
        <div className="flex flex-col gap-1.5 flex-shrink-0">
          {/* List item 1 with Issue 2 */}
          <div className="relative w-full h-7 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-between px-2">
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 bg-gray-200 rounded-full flex-shrink-0" />
              <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
            </div>

            {/* Discovered Issue 2: Cleanly aligned on the right side of list item 1 */}
            <motion.div
              animate={{ opacity: [0, 1, 1, 0], scale: [0.6, 1, 1, 0.6] }}
              className="w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-md flex-shrink-0 flex items-center justify-center"
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

          {/* List item 2 */}
          <div className="w-full h-7 bg-gray-50 rounded-lg border border-gray-100 flex items-center px-2">
            <div className="w-3.5 h-3.5 bg-gray-200 rounded-full mr-1.5 flex-shrink-0" />
            <div className="w-9 h-1.5 bg-gray-200 rounded-full" />
          </div>
        </div>

        {/* Scanning Laser */}
        <motion.div
          animate={{ top: ["-5%", "105%", "-5%"] }}
          className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff5b04] to-transparent z-20 shadow-[0_0_12px_#ff5e00]"
          initial={{ top: "-5%" }}
          transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
        >
          <div className="absolute inset-x-0 h-10 -top-10 bg-gradient-to-t from-[#ff5b04]/25 via-[#ff5b04]/5 to-transparent pointer-events-none" />
        </motion.div>
      </div>

      {/* Floating Scorecard: rounded-xl */}
      <motion.div
        animate={{ y: [-4, 4, -4] }}
        className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.08)] border border-gray-100 flex items-center gap-3 z-30"
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-200/50">
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
          <div className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase">
            Issues Found
          </div>
          <div className="text-lg font-black text-gray-900 leading-none">
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
    <div className="w-full h-full bg-gradient-to-tr from-gray-50 to-gray-100 flex items-center justify-center p-6 relative overflow-hidden select-none">
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
        {[
          { dx: -12, dy: 65, delay: 0.1 },
          { dx: 10, dy: 80, delay: 0.4 },
          { dx: -5, dy: 70, delay: 0.7 },
          { dx: 16, dy: 95, delay: 1.0 },
          { dx: -18, dy: 75, delay: 1.3 },
          { dx: 8, dy: 85, delay: 1.6 },
          { dx: -8, dy: 90, delay: 1.9 },
          { dx: 14, dy: 68, delay: 2.2 },
          { dx: -14, dy: 88, delay: 2.5 },
          { dx: 6, dy: 72, delay: 2.8 },
        ].map((particle, i) => (
          <motion.div
            key={`drop-${i}`}
            animate={{
              x: [0, 115, 115 + particle.dx],
              y: [0, 0, particle.dy],
              opacity: [1, 1, 0],
            }}
            className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-gray-400 rounded-full z-20"
            initial={{ x: -20, y: 0, opacity: 1 }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeIn",
              delay: particle.delay,
              times: [0, 0.45, 1],
            }}
          />
        ))}

        {/* Warning Indicator over the leak: rounded-xl to match Issues Found badge */}
        <motion.div
          animate={{ scale: [1, 1.05, 1], y: [-5, 0, -5] }}
          className="absolute top-4 left-1/2 -translate-x-1/2 bg-white px-3.5 py-1.5 rounded-xl shadow-lg border border-red-100 flex items-center gap-1.5 z-30"
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
    <div className="w-full h-full bg-gradient-to-tr from-gray-50 to-gray-100 flex items-center justify-center p-6 relative overflow-hidden select-none">
      <div className="relative w-full h-full max-w-[280px]">
        {/* SVG Journey Path */}
        <svg
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          {/* Base inactive curve */}
          <path
            d="M 10,20 C 40,20 40,80 70,80 C 85,80 90,60 90,40"
            fill="none"
            stroke="#e2e8f0"
            strokeLinecap="round"
            strokeWidth="3"
          />
          {/* Active orange journey path drawing smoothly forward & reverse */}
          <motion.path
            animate={{
              pathLength: [0, 0.33, 0.67, 1, 1, 1, 0.67, 0.33, 0, 0],
            }}
            d="M 10,20 C 40,20 40,80 70,80 C 85,80 90,60 90,40"
            fill="none"
            stroke="#ff5b04"
            strokeLinecap="round"
            strokeWidth="3.5"
            transition={{
              duration: 6,
              times: [0, 0.15, 0.30, 0.40, 0.55, 0.58, 0.67, 0.82, 0.95, 1],
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </svg>

        {/* Node 1 (Start Point) */}
        <div className="absolute top-[20%] left-[10%] -translate-x-1/2 -translate-y-1/2 z-10">
          {/* Start pulse ring on cycle restart */}
          <motion.div
            animate={{
              scale: [1, 1.8, 1, 1, 1, 1, 1.8, 1],
              opacity: [0.6, 0, 0, 0, 0, 0, 0.6, 0.6],
            }}
            className="absolute -inset-1 rounded-full bg-[#ff5b04] pointer-events-none"
            transition={{
              duration: 6,
              times: [0, 0.10, 0.40, 0.55, 0.85, 0.95, 0.98, 1],
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
          <div className="w-8 h-8 bg-white rounded-full border-2 border-[#ff5b04] shadow-[0_2px_10px_rgba(255,91,4,0.25)] flex items-center justify-center relative">
            <div className="w-3 h-3 bg-[#ff5b04] rounded-full" />
          </div>
        </div>

        {/* Node 2 (Point 2: Highlights forward, unhighlights reverse) */}
        <div className="absolute top-[50%] left-[40%] -translate-x-1/2 -translate-y-1/2 z-10">
          <motion.div
            animate={{
              borderColor: [
                "#e2e8f0",
                "#e2e8f0",
                "#ff5b04",
                "#ff5b04",
                "#e2e8f0",
                "#e2e8f0",
              ],
              boxShadow: [
                "0 2px 8px rgba(0,0,0,0.04)",
                "0 2px 8px rgba(0,0,0,0.04)",
                "0 0 16px rgba(255,91,4,0.35)",
                "0 0 16px rgba(255,91,4,0.35)",
                "0 2px 8px rgba(0,0,0,0.04)",
                "0 2px 8px rgba(0,0,0,0.04)",
              ],
              scale: [1, 1, 1.18, 1, 1, 1.12, 1, 1],
            }}
            className="w-10 h-10 bg-white rounded-xl border-2 shadow-sm flex items-center justify-center"
            transition={{
              duration: 6,
              times: [0, 0.13, 0.17, 0.55, 0.80, 0.84, 1],
              scale: {
                duration: 6,
                times: [0, 0.13, 0.17, 0.21, 0.80, 0.84, 0.88, 1],
                repeat: Infinity,
                ease: "easeInOut",
              },
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="flex flex-col gap-1 w-5">
              <motion.div
                animate={{
                  backgroundColor: [
                    "#e2e8f0",
                    "#e2e8f0",
                    "#ff5b04",
                    "#ff5b04",
                    "#e2e8f0",
                    "#e2e8f0",
                  ],
                }}
                className="w-full h-1 rounded"
                transition={{
                  duration: 6,
                  times: [0, 0.13, 0.17, 0.80, 0.84, 1],
                  repeat: Infinity,
                }}
              />
              <motion.div
                animate={{
                  backgroundColor: [
                    "#e2e8f0",
                    "#e2e8f0",
                    "#ffa366",
                    "#ffa366",
                    "#e2e8f0",
                    "#e2e8f0",
                  ],
                }}
                className="w-3/4 h-1 rounded"
                transition={{
                  duration: 6,
                  times: [0, 0.13, 0.17, 0.80, 0.84, 1],
                  repeat: Infinity,
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* Node 3 (Point 3: Highlights forward, unhighlights reverse) */}
        <div className="absolute top-[80%] left-[70%] -translate-x-1/2 -translate-y-1/2 z-10">
          <motion.div
            animate={{
              borderColor: [
                "#e2e8f0",
                "#e2e8f0",
                "#ff5b04",
                "#ff5b04",
                "#e2e8f0",
                "#e2e8f0",
              ],
              boxShadow: [
                "0 2px 8px rgba(0,0,0,0.04)",
                "0 2px 8px rgba(0,0,0,0.04)",
                "0 0 16px rgba(255,91,4,0.35)",
                "0 0 16px rgba(255,91,4,0.35)",
                "0 2px 8px rgba(0,0,0,0.04)",
                "0 2px 8px rgba(0,0,0,0.04)",
              ],
              scale: [1, 1, 1.18, 1, 1, 1.12, 1, 1],
            }}
            className="w-10 h-10 bg-white rounded-xl border-2 shadow-sm flex items-center justify-center"
            transition={{
              duration: 6,
              times: [0, 0.28, 0.32, 0.55, 0.65, 0.69, 1],
              scale: {
                duration: 6,
                times: [0, 0.28, 0.32, 0.36, 0.65, 0.69, 0.73, 1],
                repeat: Infinity,
                ease: "easeInOut",
              },
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <motion.div
              animate={{
                borderColor: [
                  "#cbd5e1",
                  "#cbd5e1",
                  "#ff5b04",
                  "#ff5b04",
                  "#cbd5e1",
                  "#cbd5e1",
                ],
              }}
              className="w-4 h-4 rounded border-2 flex items-center justify-center"
              transition={{
                duration: 6,
                times: [0, 0.28, 0.32, 0.65, 0.69, 1],
                repeat: Infinity,
              }}
            >
              <motion.div
                animate={{
                  opacity: [0, 0, 1, 1, 0, 0],
                  scale: [0, 0, 1, 1, 0, 0],
                }}
                className="w-2 h-2 bg-[#ff5b04] rounded-sm"
                transition={{
                  duration: 6,
                  times: [0, 0.28, 0.32, 0.65, 0.69, 1],
                  repeat: Infinity,
                }}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Node 4 (Final Destination: Checks on forward, unchecks on reverse) */}
        <div className="absolute top-[40%] left-[90%] -translate-x-1/2 -translate-y-1/2 z-10">
          {/* Celebration Ripple on Arrival */}
          <motion.div
            animate={{
              scale: [1, 1, 1.8, 1, 1, 1],
              opacity: [0, 0, 0.7, 0, 0, 0],
            }}
            className="absolute -inset-1 rounded-full bg-[#ff5b04] pointer-events-none"
            transition={{
              duration: 6,
              times: [0, 0.38, 0.44, 0.50, 0.55, 1],
              repeat: Infinity,
              ease: "easeOut",
            }}
          />

          <motion.div
            animate={{
              backgroundColor: [
                "#ffffff",
                "#ffffff",
                "#ff5b04",
                "#ff5b04",
                "#ffffff",
                "#ffffff",
              ],
              borderColor: [
                "#e2e8f0",
                "#e2e8f0",
                "#ff5b04",
                "#ff5b04",
                "#e2e8f0",
                "#e2e8f0",
              ],
              boxShadow: [
                "0 2px 8px rgba(0,0,0,0.04)",
                "0 2px 8px rgba(0,0,0,0.04)",
                "0 0 20px rgba(255,91,4,0.45)",
                "0 0 20px rgba(255,91,4,0.45)",
                "0 2px 8px rgba(0,0,0,0.04)",
                "0 2px 8px rgba(0,0,0,0.04)",
              ],
              scale: [1, 1, 1.18, 1, 1, 1.12, 1, 1],
            }}
            className="w-10 h-10 rounded-full border-2 flex items-center justify-center relative z-10 overflow-hidden"
            transition={{
              duration: 6,
              times: [0, 0.38, 0.42, 0.55, 0.58, 1],
              scale: {
                duration: 6,
                times: [0, 0.38, 0.42, 0.46, 0.55, 0.58, 0.62, 1],
                repeat: Infinity,
                ease: "easeInOut",
              },
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Idle placeholder circle: disappears when checked, reappears on reverse */}
            <motion.div
              animate={{
                opacity: [1, 1, 0, 0, 1, 1],
                scale: [1, 1, 0, 0, 1, 1],
              }}
              className="w-3 h-3 rounded-full border-2 border-gray-300 bg-gray-100 absolute"
              transition={{
                duration: 6,
                times: [0, 0.38, 0.41, 0.56, 0.59, 1],
                repeat: Infinity,
              }}
            />

            {/* Checkmark: Draws in on forward, draws out on reverse */}
            <motion.svg
              className="w-5 h-5 text-white relative z-10"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3.5"
              viewBox="0 0 24 24"
              animate={{
                opacity: [0, 0, 1, 1, 0, 0],
                scale: [0, 0, 1.25, 1, 1, 0, 0],
              }}
              transition={{
                duration: 6,
                times: [0, 0.39, 0.43, 0.55, 0.58, 1],
                scale: {
                  duration: 6,
                  times: [0, 0.39, 0.43, 0.46, 0.55, 0.58, 1],
                  repeat: Infinity,
                  ease: "easeOut",
                },
                repeat: Infinity,
                ease: "easeOut",
              }}
            >
              <motion.path
                d="M5 13l4 4L19 7"
                animate={{
                  pathLength: [0, 0, 1, 1, 0, 0],
                }}
                transition={{
                  duration: 6,
                  times: [0, 0.39, 0.44, 0.55, 0.58, 1],
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.svg>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// 4. Walkthrough Video (Screen Recorder)
export const VisualVideoNew = () => {
  return (
    <div className="w-full h-full bg-gradient-to-tr from-gray-50 to-gray-100 flex items-center justify-center p-6 relative overflow-hidden select-none">
      <div className="w-full h-[184px] max-w-[264px] bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-gray-200 flex flex-col overflow-hidden relative">
        {/* Browser / Video Frame Header */}
        <div className="w-full h-7 bg-gray-50/90 border-b border-gray-100 flex items-center px-3 gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#ff5f56]" />
          <div className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
          <div className="w-2 h-2 rounded-full bg-[#27c93f]" />
          <div className="mx-auto w-24 h-2 bg-gray-200/80 rounded-full -ml-8" />
        </div>

        {/* Video Content Area */}
        <div className="flex-1 bg-white relative p-4 flex gap-4">
          {/* Abstract UI inside video */}
          <div className="w-1/3 flex flex-col gap-2">
            <div className="w-full h-12 bg-gray-100/90 rounded-lg" />
            <div className="w-full h-6 bg-gray-50 rounded-lg" />
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <div className="w-3/4 h-3 bg-gray-200/90 rounded" />
            <div className="w-full h-1.5 bg-gray-100 rounded" />
            <div className="w-full h-1.5 bg-gray-100 rounded" />
            <div className="w-5/6 h-1.5 bg-gray-100 rounded" />

            {/* Button to click */}
            <motion.div
              animate={{
                backgroundColor: ["#f3f4f6", "#f3f4f6", "#ff5b04", "#ff5b04", "#f3f4f6"],
                scale: [1, 1, 0.94, 1, 1],
              }}
              className="mt-2 w-16 h-5 rounded-md flex items-center justify-center border border-gray-200/80 transition-shadow"
              transition={{
                duration: 4,
                times: [0, 0.44, 0.48, 0.56, 1],
                repeat: Infinity,
                ease: "easeInOut",
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
                times: [0, 0.46, 0.56],
                repeat: Infinity,
              }}
            />
          </motion.div>
        </div>

        {/* Video Scrubber & REC indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gray-900/95 backdrop-blur-md px-3 flex items-center gap-2.5">
          {/* Play Button: Optically and Geometrically Centered */}
          <div className="w-5 h-5 rounded-full flex items-center justify-center border border-gray-600/70 bg-gray-800 shadow-sm flex-shrink-0">
            <svg
              className="w-2.5 h-2.5 text-white block"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M6.5 4.8a.8.8 0 0 0-1.2.7v9a.8.8 0 0 0 1.2.7l8-4.5a.8.8 0 0 0 0-1.4l-8-4.5z" />
            </svg>
          </div>

          {/* Progress scrubber bar */}
          <div className="flex-1 h-1.5 bg-gray-700/70 rounded-full relative overflow-hidden">
            <motion.div
              animate={{ width: ["0%", "100%"] }}
              className="absolute left-0 top-0 bottom-0 bg-[#ff5b04] rounded-full"
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
          </div>

          {/* REC Status Badge */}
          <div className="flex items-center gap-1.5 bg-black/50 px-2 py-0.5 rounded-md border border-gray-700/80 flex-shrink-0">
            <motion.div
              animate={{ opacity: [1, 0.2, 1] }}
              className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_6px_#ef4444]"
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className="text-[8px] font-bold text-gray-200 tracking-widest leading-none">
              REC
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
