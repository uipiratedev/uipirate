"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * 1. Simplifying SaaS Complexity
 * Interactive Workflow Architecture & Dynamic Node Router
 * Concept: Multi-role logic routing data packets to different pipeline endpoints.
 * Interactive: Click to switch roles (Admin, Member, API), which redirects the glowing data pulse!
 */
export const VisualSaaSComplexity = () => {
  const [activeRole, setActiveRole] = useState<"admin" | "member" | "api">("admin");

  return (
    <div className="w-full h-full bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#0F172A] flex flex-col justify-between p-3.5 relative overflow-hidden select-none text-white">
      {/* Background Subtle Tech Grid */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)",
          backgroundSize: "16px 16px",
        }}
      />

      {/* Top Header: Role Selector Tabs */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md p-0.5 rounded-lg border border-white/15">
          {(["admin", "member", "api"] as const).map((role) => (
            <button
              key={role}
              onClick={() => setActiveRole(role)}
              className={`px-2 py-0.5 rounded-md text-[9px] font-semibold uppercase tracking-wider transition-all ${
                activeRole === role
                  ? "bg-indigo-500 text-white shadow-sm"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        {/* Live Status Pill */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[9px] text-emerald-400 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          99.9%
        </div>
      </div>

      {/* Center: Interactive Node Graph with Moving Data Pulses */}
      <div className="relative w-full h-[120px] flex items-center justify-between px-2 z-10">
        {/* SVG Bezier Wire Connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 300 120">
          <defs>
            <linearGradient id="activeBeamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>

          {/* Path 1: Top Branch */}
          <path
            d="M 50 60 C 100 60, 140 25, 230 25"
            fill="none"
            stroke={activeRole === "admin" ? "#818cf8" : "rgba(255,255,255,0.12)"}
            strokeWidth={activeRole === "admin" ? "2.5" : "1.5"}
            strokeDasharray={activeRole === "admin" ? "none" : "3 3"}
          />

          {/* Path 2: Middle Branch */}
          <path
            d="M 50 60 C 120 60, 150 60, 230 60"
            fill="none"
            stroke={activeRole === "member" ? "#38bdf8" : "rgba(255,255,255,0.12)"}
            strokeWidth={activeRole === "member" ? "2.5" : "1.5"}
            strokeDasharray={activeRole === "member" ? "none" : "3 3"}
          />

          {/* Path 3: Bottom Branch */}
          <path
            d="M 50 60 C 100 60, 140 95, 230 95"
            fill="none"
            stroke={activeRole === "api" ? "#34d399" : "rgba(255,255,255,0.12)"}
            strokeWidth={activeRole === "api" ? "2.5" : "1.5"}
            strokeDasharray={activeRole === "api" ? "none" : "3 3"}
          />

          {/* Flowing Particle on Active Branch */}
          {activeRole === "admin" && (
            <motion.circle
              r="4"
              fill="#c7d2fe"
              animate={{
                cx: [50, 100, 160, 230],
                cy: [60, 48, 28, 25],
                opacity: [0, 1, 1, 0],
              }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
          {activeRole === "member" && (
            <motion.circle
              r="4"
              fill="#bae6fd"
              animate={{
                cx: [50, 110, 170, 230],
                cy: [60, 60, 60, 60],
                opacity: [0, 1, 1, 0],
              }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
          {activeRole === "api" && (
            <motion.circle
              r="4"
              fill="#a7f3d0"
              animate={{
                cx: [50, 100, 160, 230],
                cy: [60, 72, 92, 95],
                opacity: [0, 1, 1, 0],
              }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </svg>

        {/* Source Master Node */}
        <motion.div
          whileHover={{ scale: 1.08 }}
          className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 border border-white/30 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)] cursor-pointer"
        >
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M7 7h10v10H7z" />
          </svg>
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -inset-1 rounded-xl border border-indigo-400"
          />
        </motion.div>

        {/* Destination Nodes */}
        <div className="flex flex-col gap-2.5">
          {/* Node 1: Analytics / Cloud */}
          <motion.div
            animate={{
              scale: activeRole === "admin" ? 1.08 : 1,
              borderColor: activeRole === "admin" ? "rgba(129,140,248,0.8)" : "rgba(255,255,255,0.15)",
            }}
            className={`w-9 h-7 rounded-lg flex items-center justify-center border transition-all ${
              activeRole === "admin" ? "bg-indigo-500/30 text-indigo-200 shadow-sm shadow-indigo-500/50" : "bg-white/5 text-white/40"
            }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </motion.div>

          {/* Node 2: Multi-Role Team */}
          <motion.div
            animate={{
              scale: activeRole === "member" ? 1.08 : 1,
              borderColor: activeRole === "member" ? "rgba(56,189,248,0.8)" : "rgba(255,255,255,0.15)",
            }}
            className={`w-9 h-7 rounded-lg flex items-center justify-center border transition-all ${
              activeRole === "member" ? "bg-sky-500/30 text-sky-200 shadow-sm shadow-sky-500/50" : "bg-white/5 text-white/40"
            }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </svg>
          </motion.div>

          {/* Node 3: API Gateway */}
          <motion.div
            animate={{
              scale: activeRole === "api" ? 1.08 : 1,
              borderColor: activeRole === "api" ? "rgba(52,211,153,0.8)" : "rgba(255,255,255,0.15)",
            }}
            className={`w-9 h-7 rounded-lg flex items-center justify-center border transition-all ${
              activeRole === "api" ? "bg-emerald-500/30 text-emerald-200 shadow-sm shadow-emerald-500/50" : "bg-white/5 text-white/40"
            }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
          </motion.div>
        </div>
      </div>

      {/* Bottom Meter: Realtime Load Distribution */}
      <div className="flex items-center gap-2 bg-white/5 rounded-lg px-2 py-1.5 border border-white/10 z-10">
        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden flex gap-0.5">
          <motion.div
            animate={{ width: activeRole === "admin" ? "65%" : activeRole === "member" ? "40%" : "25%" }}
            className="h-full bg-indigo-500 rounded-full"
            transition={{ type: "spring", stiffness: 120 }}
          />
          <motion.div
            animate={{ width: activeRole === "member" ? "45%" : "25%" }}
            className="h-full bg-sky-400 rounded-full"
            transition={{ type: "spring", stiffness: 120 }}
          />
          <div className="flex-1 h-full bg-emerald-400/60 rounded-full" />
        </div>
        <span className="text-[8px] font-mono text-white/70 uppercase">Route Sync</span>
      </div>
    </div>
  );
};

/**
 * 2. Premium UI + Precise Handoff
 * Interactive Component Inspector with Animated Calipers & Token Pill Box
 * Interactive: Click the button to cycle states (Default -> Hover -> Active) with dynamic dimensions!
 */
export const VisualDesignHandoff = () => {
  const [btnState, setBtnState] = useState<"default" | "hover" | "active">("hover");
  const [inspectMode, setInspectMode] = useState<"specs" | "tokens">("specs");

  return (
    <div className="w-full h-full bg-[#111111] flex flex-col justify-between p-3.5 relative overflow-hidden select-none text-white">
      {/* Background Blueprint Grid */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
      />

      {/* Top Spec Header */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#FF5B04]" />
          <span className="text-[10px] font-mono font-bold text-white/80">INSPECT</span>
        </div>

        {/* View Toggle */}
        <div className="flex bg-white/10 rounded-md p-0.5 border border-white/10 text-[8px] font-mono">
          <button
            onClick={() => setInspectMode("specs")}
            className={`px-1.5 py-0.5 rounded ${inspectMode === "specs" ? "bg-[#FF5B04] text-white" : "text-white/50"}`}
          >
            px
          </button>
          <button
            onClick={() => setInspectMode("tokens")}
            className={`px-1.5 py-0.5 rounded ${inspectMode === "tokens" ? "bg-[#FF5B04] text-white" : "text-white/50"}`}
          >
            var
          </button>
        </div>
      </div>

      {/* Center: Inspect Canvas with Dimension Calipers */}
      <div className="relative flex-1 flex items-center justify-center my-1 z-10">
        {/* Dynamic Calipers (Red Guidelines) */}
        {inspectMode === "specs" && (
          <>
            {/* Top Caliper */}
            <div className="absolute top-1 flex flex-col items-center">
              <div className="w-20 h-px bg-red-400/80" />
              <span className="text-[7.5px] font-mono font-bold text-red-400 bg-black/80 px-1 rounded -mt-1.5">
                120px
              </span>
            </div>
            {/* Right Caliper */}
            <div className="absolute right-4 flex items-center">
              <span className="text-[7.5px] font-mono font-bold text-red-400 bg-black/80 px-1 rounded -mr-1 z-10">
                36px
              </span>
              <div className="h-9 w-px bg-red-400/80" />
            </div>
          </>
        )}

        {/* The Inspected Interactive Component */}
        <motion.button
          onClick={() => {
            setBtnState((prev) => (prev === "default" ? "hover" : prev === "hover" ? "active" : "default"));
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`relative px-6 py-2 rounded-xl font-bold text-[11px] transition-all flex items-center gap-1.5 shadow-lg ${
            btnState === "default"
              ? "bg-[#FF5B04] text-white shadow-[#FF5B04]/30"
              : btnState === "hover"
              ? "bg-[#ff6f24] text-white shadow-[#FF5B04]/50 ring-2 ring-white/30"
              : "bg-[#e04f00] text-white shadow-inner scale-95"
          }`}
        >
          <span>Action</span>
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </motion.button>

        {/* Animated Virtual Cursor */}
        <motion.div
          animate={{
            x: [40, 10, 10, 40],
            y: [30, 0, 0, 30],
            scale: [1, 0.85, 1, 1],
          }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute pointer-events-none text-white drop-shadow-md z-20"
        >
          <svg className="w-4 h-4 fill-white stroke-black stroke-1" viewBox="0 0 24 24">
            <path d="M3 3l7 18 3-7 7-3L3 3z" />
          </svg>
        </motion.div>
      </div>

      {/* Bottom Token Strip */}
      <div className="flex items-center justify-between gap-1 z-10">
        <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-md text-[8px] font-mono border border-white/10">
          <span className="w-2 h-2 rounded-full bg-[#FF5B04]" />
          <span>#FF5B04</span>
        </div>
        <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-md text-[8px] font-mono border border-white/10">
          <span className="text-white/40">R:</span>
          <span>12px</span>
        </div>
        <div className="flex items-center gap-1 bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-md text-[8px] font-mono border border-emerald-500/30">
          <span>✓ 100%</span>
        </div>
      </div>
    </div>
  );
};

/**
 * 3. AI-First UX Expertise
 * Interactive Generative Audio/Visualizer Waveform & Confidence Dial
 * Interactive: Click the AI button to trigger audio wave ripple & watch the confidence ring recalculate!
 */
export const VisualAIFirstUX = () => {
  const [isPrompting, setIsPrompting] = useState(false);
  const [confidence, setConfidence] = useState(98);

  const triggerAI = () => {
    setIsPrompting(true);
    setConfidence(Math.floor(95 + Math.random() * 5));
    setTimeout(() => setIsPrompting(false), 2000);
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-[#1E3A8A] via-[#172554] to-[#0F172A] flex flex-col justify-between p-3.5 relative overflow-hidden select-none text-white">
      {/* Background Neural Circles */}
      <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />

      {/* Top Status */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-lg bg-blue-500/30 border border-blue-400/40 flex items-center justify-center text-[10px]">
            ✨
          </div>
          <span className="text-[10px] font-mono font-bold tracking-wider text-blue-200">
            AI COGNITION
          </span>
        </div>

        {/* Live Spark Indicator */}
        <motion.div
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-[8.5px] font-mono text-blue-300"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          {confidence}%
        </motion.div>
      </div>

      {/* Center: Dynamic Sound/Neural Frequency Wave */}
      <div className="flex-1 flex flex-col items-center justify-center gap-2 z-10 my-1">
        {/* Animated Sound Wave Bars */}
        <div className="flex items-center justify-center gap-1 h-12 w-full px-4">
          {[0.4, 0.8, 1.2, 0.6, 1.5, 0.9, 1.3, 0.5, 1.1, 0.7, 1.4, 0.6].map((scale, i) => (
            <motion.div
              key={i}
              animate={{
                scaleY: isPrompting ? [1, scale * 2.2, 0.4, 1] : [0.5, scale, 0.3, 0.5],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.08,
                ease: "easeInOut",
              }}
              className="w-1.5 h-8 bg-gradient-to-t from-blue-600 via-sky-400 to-indigo-300 rounded-full"
            />
          ))}
        </div>

        {/* Interactive Generate Button */}
        <motion.button
          onClick={triggerAI}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-3.5 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-[9.5px] shadow-[0_0_15px_rgba(59,130,246,0.5)] border border-blue-400/30 flex items-center gap-1.5 cursor-pointer"
        >
          <span>Run Prompt</span>
          <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        </motion.button>
      </div>

      {/* Bottom Skeleton Generation Preview */}
      <div className="flex items-center gap-1.5 bg-white/5 backdrop-blur-md rounded-lg p-2 border border-white/10 z-10">
        <div className="w-5 h-5 rounded-md bg-blue-500/30 border border-blue-400/30 flex-shrink-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-blue-400" />
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <motion.div
            animate={{ opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-3/4 h-1.5 bg-blue-300/40 rounded-full"
          />
          <div className="w-1/2 h-1 bg-white/20 rounded-full" />
        </div>
        <div className="text-[8px] font-mono text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/30">
          VALID
        </div>
      </div>
    </div>
  );
};

/**
 * 4. Designs that Scale & Convert
 * Interactive Growth Multiplier & Conversion Analytics Lift
 * Interactive: Toggle between Baseline vs Design System to see the SVG curve animate upward!
 */
export const VisualScaleConvert = () => {
  const [isOptimized, setIsOptimized] = useState(true);

  return (
    <div className="w-full h-full bg-[#180A14] flex flex-col justify-between p-3.5 relative overflow-hidden select-none text-white">
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-0 w-36 h-36 rounded-full bg-[#E40063]/15 blur-3xl pointer-events-none" />

      {/* Top Header: Interactive Baseline vs Optimized Switch */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono font-bold tracking-wider text-pink-200">
            GROWTH LIFT
          </span>
        </div>

        {/* Interactive A/B Toggle */}
        <div className="flex bg-white/10 rounded-lg p-0.5 border border-white/10 text-[8px] font-mono">
          <button
            onClick={() => setIsOptimized(false)}
            className={`px-2 py-0.5 rounded-md transition-all ${
              !isOptimized ? "bg-white/20 text-white font-bold" : "text-white/40"
            }`}
          >
            Baseline
          </button>
          <button
            onClick={() => setIsOptimized(true)}
            className={`px-2 py-0.5 rounded-md transition-all ${
              isOptimized ? "bg-[#E40063] text-white font-bold shadow-xs" : "text-white/40"
            }`}
          >
            +42% Lift
          </button>
        </div>
      </div>

      {/* Center: Dynamic Rising Conversion Chart */}
      <div className="relative flex-1 w-full flex items-end px-1 my-1 z-10">
        <svg className="w-full h-[75px]" viewBox="0 0 240 75" preserveAspectRatio="none">
          <defs>
            <linearGradient id="scaleAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E40063" stopOpacity={isOptimized ? "0.45" : "0.1"} />
              <stop offset="100%" stopColor="#E40063" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area Fill */}
          <motion.path
            animate={{
              d: isOptimized
                ? "M 0 65 Q 60 55 120 35 T 240 10 L 240 75 L 0 75 Z"
                : "M 0 65 Q 60 62 120 58 T 240 50 L 240 75 L 0 75 Z",
            }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            fill="url(#scaleAreaGrad)"
          />

          {/* Curve Stroke */}
          <motion.path
            animate={{
              d: isOptimized
                ? "M 0 65 Q 60 55 120 35 T 240 10"
                : "M 0 65 Q 60 62 120 58 T 240 50",
              stroke: isOptimized ? "#E40063" : "rgba(255,255,255,0.3)",
            }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            fill="none"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Glowing Apex Dot */}
          <motion.circle
            animate={{
              cx: 236,
              cy: isOptimized ? 10 : 50,
              r: isOptimized ? [4, 6, 4] : [3, 3, 3],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            fill="#E40063"
          />
        </svg>

        {/* Floating Apex Metric Tag */}
        <motion.div
          animate={{
            top: isOptimized ? 4 : 26,
            right: 12,
            scale: isOptimized ? 1 : 0.9,
          }}
          transition={{ type: "spring", stiffness: 120 }}
          className="absolute bg-gradient-to-r from-[#E40063] to-pink-500 text-white font-bold text-[10px] px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 border border-white/20"
        >
          <span>↗</span>
          <span>{isOptimized ? "+42.8%" : "+0.0%"}</span>
        </motion.div>
      </div>

      {/* Bottom Bar Graphic: Resource Efficiency */}
      <div className="flex items-center justify-between bg-white/5 rounded-lg p-2 border border-white/10 z-10">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-[8.5px] font-mono text-white/80">DEV EFFORT</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/30">
            -35%
          </span>
          <span className="text-[7.5px] font-mono text-white/50">HOURS</span>
        </div>
      </div>
    </div>
  );
};

/**
 * 5. Fast & Structured Delivery
 * Interactive Velocity Engine & Pixel-Perfect Milestone Pipeline
 * Perfectly aligned SVG track, active sprint radar, and interactive 1x / 2x / 3x pace gears
 */
export const VisualFastDelivery = () => {
  const [speed, setSpeed] = useState<1 | 2 | 3>(2);

  // Speed-based calculations
  const progressLength = speed === 1 ? 110 : speed === 2 ? 192 : 276;
  const paceLabel = speed === 1 ? "1.2×" : speed === 2 ? "2.4×" : "3.6×";
  const daysAhead = speed === 1 ? "+3 Days" : speed === 2 ? "+6 Days" : "+10 Days";
  const duration = speed === 1 ? 2.5 : speed === 2 ? 1.4 : 0.8;

  return (
    <div className="w-full h-full bg-gradient-to-br from-[#1C0A00] via-[#2A1002] to-[#120500] flex flex-col justify-between p-3.5 relative overflow-hidden select-none text-white">
      {/* Background Tech Grid & Ambient Amber Glow */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,91,4,0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,91,4,0.25) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />
      <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-[#FF5B04]/20 blur-3xl pointer-events-none" />

      {/* Top Header: Engine Badge & Interactive Gear Selector */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-lg bg-[#FF5B04]/20 border border-[#FF5B04]/40 flex items-center justify-center text-[10px]">
            ⚡
          </div>
          <span className="text-[10px] font-mono font-bold tracking-wider text-orange-200">
            VELOCITY ENGINE
          </span>
        </div>

        {/* Interactive Speed Gear Selector */}
        <div className="flex bg-white/10 rounded-lg p-0.5 border border-white/10 text-[8.5px] font-mono">
          {([1, 2, 3] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2 py-0.5 rounded-md transition-all ${
                speed === s
                  ? "bg-[#FF5B04] text-white font-bold shadow-sm shadow-[#FF5B04]/50"
                  : "text-white/40 hover:text-white/80"
              }`}
            >
              {s}×
            </button>
          ))}
        </div>
      </div>

      {/* Mini HUD: Live Speedometer & Timeline Lead */}
      <div className="flex items-center justify-between bg-white/5 backdrop-blur-md rounded-xl px-3 py-1.5 border border-white/10 z-10">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 10 * speed, 0] }}
            transition={{ duration: 1.5 / speed, repeat: Infinity, ease: "easeInOut" }}
            className="w-2.5 h-2.5 rounded-full border-2 border-[#FF5B04] border-t-transparent animate-spin"
          />
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-bold font-mono text-[#FF5B04]">{paceLabel}</span>
            <span className="text-[8px] font-mono text-white/60">SPRINT SPEED</span>
          </div>
        </div>
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[8px] font-mono text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {daysAhead}
        </div>
      </div>

      {/* Center: Pixel-Perfect SVG Milestone Pipeline */}
      <div className="relative w-full h-[72px] flex items-center justify-center z-10">
        <svg className="w-full h-full" viewBox="0 0 300 72" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="activeSprintBeam" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#FF5B04" />
            </linearGradient>
            <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#FF5B04" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Base Background Track (Passes exactly through center y=26) */}
          <line
            x1="24"
            y1="26"
            x2="276"
            y2="26"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Active Glowing Progress Track (Animates to current milestone) */}
          <motion.line
            x1="24"
            y1="26"
            animate={{ x2: progressLength }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            y2="26"
            stroke="url(#activeSprintBeam)"
            strokeWidth="4"
            strokeLinecap="round"
            filter="url(#glowFilter)"
          />

          {/* Racing Comet Light Pulse */}
          <motion.circle
            r="4.5"
            fill="#FFFFFF"
            filter="url(#glowFilter)"
            animate={{
              cx: [24, progressLength],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            cy="26"
          />

          {/* Node 1: W1 - Architecture (Completed) */}
          <g>
            <circle cx="24" cy="26" r="11" fill="#10B981" />
            <path
              d="M 20 26 L 23 29 L 28 23"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <text x="24" y="50" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="8.5" fontFamily="monospace" fontWeight="bold">
              W1
            </text>
            <text x="24" y="61" textAnchor="middle" fill="#10B981" fontSize="7" fontFamily="monospace">
              SHIPPED
            </text>
          </g>

          {/* Node 2: W2 - Design System (Completed) */}
          <g>
            <circle cx="108" cy="26" r="11" fill="#10B981" />
            <path
              d="M 104 26 L 107 29 L 112 23"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <text x="108" y="50" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="8.5" fontFamily="monospace" fontWeight="bold">
              W2
            </text>
            <text x="108" y="61" textAnchor="middle" fill="#10B981" fontSize="7" fontFamily="monospace">
              SHIPPED
            </text>
          </g>

          {/* Node 3: W3 - Code & QA (Active Sprint) */}
          <g>
            {/* Animated Radar Wave Ring */}
            <motion.circle
              cx="192"
              cy="26"
              r="14"
              fill="none"
              stroke="#FF5B04"
              strokeWidth="1.5"
              animate={{ r: [12, 19, 12], opacity: [0.9, 0, 0.9] }}
              transition={{ duration: 1.8 / speed, repeat: Infinity, ease: "easeOut" }}
            />
            <circle cx="192" cy="26" r="11" fill="#FF5B04" filter="url(#glowFilter)" />
            <circle cx="192" cy="26" r="4" fill="#FFFFFF" />
            <text x="192" y="50" textAnchor="middle" fill="#FF5B04" fontSize="8.5" fontFamily="monospace" fontWeight="bold">
              W3
            </text>
            <text x="192" y="61" textAnchor="middle" fill="#FF5B04" fontSize="7" fontFamily="monospace" fontWeight="bold">
              ACTIVE
            </text>
          </g>

          {/* Node 4: W4 - Production Launch (Target) */}
          <g>
            <circle
              cx="276"
              cy="26"
              r="11"
              fill={speed === 3 ? "#10B981" : "rgba(255,255,255,0.08)"}
              stroke={speed === 3 ? "#10B981" : "rgba(255,255,255,0.2)"}
              strokeWidth="1.5"
            />
            <text
              x="276"
              y="29.5"
              textAnchor="middle"
              fill={speed === 3 ? "#FFFFFF" : "rgba(255,255,255,0.4)"}
              fontSize="9"
              fontFamily="sans-serif"
            >
              {speed === 3 ? "✓" : "🚀"}
            </text>
            <text x="276" y="50" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="8.5" fontFamily="monospace" fontWeight="bold">
              W4
            </text>
            <text x="276" y="61" textAnchor="middle" fill={speed === 3 ? "#10B981" : "rgba(255,255,255,0.3)"} fontSize="7" fontFamily="monospace">
              LAUNCH
            </text>
          </g>
        </svg>
      </div>

      {/* Bottom Status: Cadence & Timeline Lead */}
      <div className="flex items-center justify-between bg-white/5 rounded-lg px-2.5 py-1.5 border border-white/10 z-10">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[8.5px] font-mono text-emerald-400 font-bold">100% ON SCHEDULE</span>
        </div>
        <div className="flex items-center gap-1 text-[8.5px] font-mono text-white/70">
          <span>SAVED:</span>
          <span className="font-bold text-[#FF5B04]">{speed * 7} DAYS</span>
        </div>
      </div>
    </div>
  );
};
