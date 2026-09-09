"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { CLIENT_LOGOS } from "@/data/clientLogos";

// Card 1: Strategy Before Pixels (Tall)
const STRATEGY_NODES = [
  { text: "Positioning", x: 22, y: 16, side: "right" as const, delay: 0.2 },
  { text: "User Flows", x: 78, y: 39, side: "left" as const, delay: 0.7 },
  { text: "Wireframes", x: 22, y: 62, side: "right" as const, delay: 1.2 },
  { text: "UI Design", x: 78, y: 85, side: "left" as const, delay: 1.7 },
];

export const StrategyBeforePixelsAsset = () => {
  return (
    <div className="flex-1 rounded-xl mb-6 bg-gradient-to-b from-gray-50 to-white border border-gray-100 overflow-hidden relative min-h-[220px] select-none">
      {/* Animated Path / Road */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          d="M 22,16 C 22,27.5 78,27.5 78,39 C 78,50.5 22,50.5 22,62 C 22,73.5 78,73.5 78,85"
          fill="none"
          stroke="#f3f4f6"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <motion.path
          d="M 22,16 C 22,27.5 78,27.5 78,39 C 78,50.5 22,50.5 22,62 C 22,73.5 78,73.5 78,85"
          fill="none"
          stroke="url(#strategy-road-gradient)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          viewport={{ once: true }}
        />
        <defs>
          <linearGradient id="strategy-road-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff5e00" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#ff5e00" stopOpacity="1" />
            <stop offset="100%" stopColor="#ff5e00" stopOpacity="0.9" />
          </linearGradient>
        </defs>
      </svg>

      {/* Waypoint Nodes: Point dots are mathematically centered on the road */}
      {STRATEGY_NODES.map((item) => (
        <div
          key={item.text}
          className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center"
          style={{ left: `${item.x}%`, top: `${item.y}%` }}
        >
          {/* Point Dot: Lies precisely on the road curve */}
          <motion.div
            className="w-3 h-3 rounded-full bg-brand-orange border-2 border-white shadow-[0_0_8px_rgba(255,94,0,0.8)] z-10"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.3, delay: item.delay }}
            viewport={{ once: true }}
          />

          {/* Label Pill: Positioned beside the dot */}
          <motion.div
            className={`absolute top-1/2 -translate-y-1/2 whitespace-nowrap bg-white/95 backdrop-blur-md px-3 py-1 rounded-full border border-gray-200 shadow-sm text-xs font-semibold text-gray-700 pointer-events-none ${item.side === "left" ? "right-full mr-2.5" : "left-full ml-2.5"
              }`}
            initial={{ opacity: 0, x: item.side === "left" ? -8 : 8 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: item.delay + 0.1 }}
            viewport={{ once: true }}
          >
            {item.text}
          </motion.div>
        </div>
      ))}
    </div>
  );
};

// Card 2: Complex Made Simple (Wide) - Animated Slider
export const ComplexMadeSimpleAsset = () => {
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
    <div className="flex-1 rounded-xl mb-6 bg-gray-100 overflow-hidden relative min-h-[120px] select-none">

      {/* Background: Bloated UI */}
      <div className="absolute inset-0 p-4 bg-gray-100 flex flex-col gap-2">
        <div className="flex gap-2">
          <div className="w-12 h-12 bg-gray-300 rounded border border-gray-400" />
          <div className="flex-1 flex flex-col gap-1">
            <div className="w-full h-3 bg-gray-300 rounded" />
            <div className="w-3/4 h-3 bg-gray-300 rounded" />
            <div className="flex gap-1 mt-1">
              <div className="w-6 h-4 bg-gray-400 rounded" />
              <div className="w-6 h-4 bg-gray-400 rounded" />
              <div className="w-6 h-4 bg-gray-400 rounded" />
              <div className="w-6 h-4 bg-gray-400 rounded" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-1 mt-2">
          {[...Array(8)].map((_, i) => <div key={i} className="h-6 bg-gray-300 border border-gray-400" />)}
        </div>
        <div className="absolute top-2 right-2 bg-red-200 text-red-800 text-[8px] font-bold px-1 rounded border border-red-400">ERROR</div>
      </div>

      {/* Foreground: Clean UI with Clip Path Animation (driven by shared percent) */}
      <motion.div
        className="absolute inset-0 bg-white p-4 shadow-[inset_0_0_20px_rgba(0,0,0,0.05)] pointer-events-none"
        style={{ clipPath }}
      >
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-orange to-orange-400 shadow-md flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-sm" />
            </div>
            <div>
              <div className="w-24 h-2.5 bg-gray-800 rounded-full mb-1.5" />
              <div className="w-16 h-1.5 bg-gray-400 rounded-full" />
            </div>
          </div>
          <div className="px-2 py-1 bg-green-50 text-green-600 rounded-full text-[8px] font-bold border border-green-100">
            ACTIVE
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex flex-col gap-2">
              <div className="w-6 h-6 bg-white rounded shadow-sm flex items-center justify-center mb-1">
                <div className="w-2.5 h-2.5 bg-brand-orange/60 rounded-full" />
              </div>
              <div className="w-full h-1.5 bg-gray-200 rounded-full" />
              <div className="w-1/2 h-1.5 bg-gray-200 rounded-full" />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Slider Divider Line + Handle (driven by the exact same left transform) */}
      <motion.div
        className="absolute top-0 bottom-0 w-[2px] bg-brand-orange z-20 pointer-events-none -ml-[1px]"
        style={{ left }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-white border-2 border-brand-orange rounded-full shadow-lg flex items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ff5e00" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
            <path d="M9 18l6-6-6-6" className="opacity-0" />
          </svg>
        </div>
      </motion.div>

    </div>
  );
};

// Card 3: Built to Convert (Standard) - Multi-layered Funnel
export const BuiltToConvertAsset = () => {
  return (
    <div className="flex-1 rounded-xl mb-6 bg-gradient-to-b from-gray-50 to-white border border-gray-100 overflow-hidden relative min-h-[100px] flex items-center justify-center p-4">
      <div className="relative w-full max-w-[160px] h-[120px] flex flex-col items-center">

        {/* Layer 1: Traffic */}
        <div className="w-full h-[30px] bg-gray-100/80 rounded-t-lg border-b-2 border-white relative overflow-hidden flex items-center justify-center">
          <span className="text-[9px] font-bold text-gray-400 z-10 tracking-widest uppercase">Traffic</span>
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={`t1-${i}`}
              className="absolute w-1.5 h-1.5 bg-gray-300 rounded-full"
              initial={{ y: -20, x: (Math.random() - 0.5) * 140 }}
              animate={{ y: 40 }}
              transition={{ duration: 1.5, repeat: Infinity, delay: Math.random() * 2, ease: "linear" }}
            />
          ))}
        </div>

        {/* Layer 2: Leads */}
        <div className="w-[75%] h-[30px] bg-orange-50/80 border-b-2 border-white relative overflow-hidden flex items-center justify-center">
          <span className="text-[9px] font-bold text-orange-300 z-10 tracking-widest uppercase">Leads</span>
          {[...Array(7)].map((_, i) => (
            <motion.div
              key={`t2-${i}`}
              className="absolute w-1.5 h-1.5 bg-brand-orange/40 rounded-full"
              initial={{ y: -20, x: (Math.random() - 0.5) * 100 }}
              animate={{ y: 40 }}
              transition={{ duration: 1.5, repeat: Infinity, delay: Math.random() * 2, ease: "linear" }}
            />
          ))}
        </div>

        {/* Layer 3: Customers */}
        <div className="w-[40%] h-[30px] bg-orange-100 rounded-b-lg relative overflow-hidden flex items-center justify-center shadow-inner">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`t3-${i}`}
              className="absolute w-2 h-2 bg-brand-orange rounded-full shadow-[0_0_4px_#ff5e00]"
              initial={{ y: -20, x: (Math.random() - 0.5) * 40 }}
              animate={{ y: 40 }}
              transition={{ duration: 1.5, repeat: Infinity, delay: Math.random() * 2, ease: "linear" }}
            />
          ))}
        </div>

        {/* Conversion Metric Tag */}
        <motion.div
          className="absolute -bottom-2 bg-white px-3 py-1.5 rounded-lg shadow-md border border-brand-orange/20 flex items-center gap-1.5 z-20"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-black text-gray-900 font-jetbrains-mono">12.4%</span>
        </motion.div>
      </div>
    </div>
  );
};

// Card 4: Design Through to Code (Standard) - Kept Same
export const DesignToCodeAsset = () => {
  return (
    <div className="flex-1 rounded-xl mb-6 overflow-hidden relative min-h-[100px] flex shadow-inner">
      {/* Design Side */}
      <div className="w-1/2 bg-[#f5f5f5] border-r border-dashed border-gray-300 relative p-4 flex items-center justify-center">
        {/* Figma Toolbar */}
        <div className="absolute left-0 top-0 bottom-0 w-7 bg-[#2c2c2c] flex flex-col items-center py-2 gap-1.5 z-10">
          {/* Move tool */}
          <div className="w-4 h-4 flex items-center justify-center rounded hover:bg-white/10 cursor-default">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 2L20 12L12 14L15 22L12 23L9 15L4 18V2Z" fill="#999" stroke="#999" />
            </svg>
          </div>
          {/* Frame tool - highlighted */}
          <div className="w-4 h-4 flex items-center justify-center rounded bg-[#0d99ff]/20">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#0d99ff" strokeWidth="2.5">
              <path d="M6 3v18M18 3v18M3 6h18M3 18h18" />
            </svg>
          </div>
          {/* Rectangle tool */}
          <div className="w-4 h-4 flex items-center justify-center rounded hover:bg-white/10 cursor-default">
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
            </svg>
          </div>
          {/* Pen tool */}
          <div className="w-4 h-4 flex items-center justify-center rounded hover:bg-white/10 cursor-default">
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19l7-7 3 3-7 7-3-3z" />
              <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
            </svg>
          </div>
          {/* Text tool */}
          <div className="w-4 h-4 flex items-center justify-center rounded hover:bg-white/10 cursor-default">
            <span className="text-[8px] font-bold text-gray-500 leading-none">T</span>
          </div>
          {/* Hand tool */}
          <div className="w-4 h-4 flex items-center justify-center rounded hover:bg-white/10 cursor-default">
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 11V6a2 2 0 00-4 0v1M14 10V4a2 2 0 00-4 0v6M10 10.5V5a2 2 0 00-4 0v9" />
              <path d="M18 11a2 2 0 014 0v3a8 8 0 01-8 8h-2c-2.8 0-4.5-.9-5.7-2.4L3.3 15a2 2 0 013-2.5l.7.8" />
            </svg>
          </div>
        </div>

        {/* Figma frame with selection handles — button inside */}
        <div className="border-2 border-[#0ea5e9] rounded-lg relative ml-4 p-0">
          {/* Selection handles */}
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-white border border-[#0ea5e9]" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-white border border-[#0ea5e9]" />
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white border border-[#0ea5e9]" />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white border border-[#0ea5e9]" />

          {/* Button shape */}
          <div className="bg-gradient-to-b from-brand-orange to-[#e04e00] rounded-md px-4 py-1.5 flex items-center justify-center shadow-md">
            <span className="text-[8px] font-bold text-white tracking-wide uppercase whitespace-nowrap">Get Started</span>
          </div>

          <motion.div
            className="absolute top-1/2 left-1/2 z-20 pointer-events-none drop-shadow-md"
            animate={{ x: [-20, 10, -20], y: [-10, 15, -10] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="black">
              <path d="M4 2L20 12L12 14L15 22L12 23L9 15L4 18V2Z" fill="black" stroke="white" strokeWidth="2" />
            </svg>
          </motion.div>
        </div>
      </div>

      {/* Code Side */}
      <div className="w-1/2 bg-[#0d1117] relative p-3 flex flex-col justify-center overflow-hidden">
        <motion.div
          className="font-mono text-[8px] leading-[1.4] text-gray-400 whitespace-pre"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <span className="text-[#ff7b72]">export const</span> <span className="text-[#d2a8ff]">UI</span> = () =&gt; {"{\n"}
          {"  "}<span className="text-[#ff7b72]">return</span> {"(\n"}
          {"    "}&lt;<span className="text-[#7ee787]">div</span> <span className="text-[#79c0ff]">className</span>=<span className="text-[#a5d6ff]">&quot;btn&quot;</span>&gt;{"\n"}
          {"      "}GET STARTED{"\n"}
          {"    "}&lt;/<span className="text-[#7ee787]">div</span>&gt;{"\n"}
          {"  "}{");\n"}
          {"}"}
        </motion.div>
      </div>

      {/* Connection badge */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-1.5 shadow-lg border border-gray-100 z-10 flex items-center justify-center text-brand-orange">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
};

// Card 5: Same Hours as Your Team (Standard) - Globe Background
export const TimezoneAsset = () => {
  return (
    <div className="flex-1 rounded-xl mb-6 bg-gradient-to-br from-[#0B0F19] to-[#1A1F30] overflow-hidden relative min-h-[100px] flex items-center justify-center p-4">
      {/* Abstract Map/Globe Graphic in Background */}
      <div className="absolute inset-0 opacity-20 flex items-center justify-center overflow-hidden pointer-events-none">
        <svg viewBox="0 0 200 100" className="w-[150%] h-[150%] animate-[spin_60s_linear_infinite]">
          <circle cx="100" cy="50" r="45" fill="none" stroke="#fff" strokeWidth="0.5" strokeDasharray="2 2" />
          <circle cx="100" cy="50" r="30" fill="none" stroke="#fff" strokeWidth="0.5" strokeDasharray="2 2" />
          <path d="M55 50 Q100 20 145 50 Q100 80 55 50" fill="none" stroke="#fff" strokeWidth="0.5" />
          <path d="M80 15 Q100 50 80 85" fill="none" stroke="#fff" strokeWidth="0.5" />
          <path d="M120 15 Q100 50 120 85" fill="none" stroke="#fff" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="relative z-10 flex gap-4 w-full justify-center">
        {/* PST Card */}
        <motion.div
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-2.5 shadow-xl text-center w-24 relative overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="absolute top-0 right-0 w-8 h-8 bg-brand-orange/30 rounded-full blur-xl" />
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
            <div className="text-[10px] text-gray-300 font-semibold tracking-wider">PST</div>
          </div>
          <div className="text-sm font-bold text-white font-jetbrains-mono">9:00 AM</div>
        </motion.div>

        {/* EST Card */}
        <motion.div
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-2.5 shadow-xl text-center w-24 relative overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="absolute top-0 right-0 w-8 h-8 bg-blue-400/30 rounded-full blur-xl" />
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <div className="text-[10px] text-gray-300 font-semibold tracking-wider">EST</div>
          </div>
          <div className="text-sm font-bold text-white font-jetbrains-mono">12:00 PM</div>
        </motion.div>
      </div>
    </div>
  );
};

// Card 6: 50+ Products (Wide) - Concentric Circles with Revolving Product Logos (same animation as landing page Built With the Best)
export const ProductsGridAsset = () => {
  const outerLogos = [
    CLIENT_LOGOS.find((l) => l.name === "RevUp AI") || CLIENT_LOGOS[4],
    CLIENT_LOGOS.find((l) => l.name === "Pivot Bits") || CLIENT_LOGOS[0],
    CLIENT_LOGOS.find((l) => l.name === "Biotex Medical") || CLIENT_LOGOS[2],
    CLIENT_LOGOS.find((l) => l.name === "Khaitan & Co") || CLIENT_LOGOS[3],
    CLIENT_LOGOS.find((l) => l.name === "Simpleo AI") || CLIENT_LOGOS[5],
    CLIENT_LOGOS.find((l) => l.name === "Arth Alpha") || CLIENT_LOGOS[9],
    CLIENT_LOGOS.find((l) => l.name === "Sarge") || CLIENT_LOGOS[6],
    CLIENT_LOGOS.find((l) => l.name === "Awesome Health") || CLIENT_LOGOS[7],
  ];

  const middleLogos = [
    CLIENT_LOGOS.find((l) => l.name === "Rings & I") || CLIENT_LOGOS[8],
    CLIENT_LOGOS.find((l) => l.name === "Ipsos") || CLIENT_LOGOS[1],
    CLIENT_LOGOS.find((l) => l.name === "RevUp AI") || CLIENT_LOGOS[4],
    CLIENT_LOGOS.find((l) => l.name === "Pivot Bits") || CLIENT_LOGOS[0],
    CLIENT_LOGOS.find((l) => l.name === "Biotex Medical") || CLIENT_LOGOS[2],
    CLIENT_LOGOS.find((l) => l.name === "Simpleo AI") || CLIENT_LOGOS[5],
  ];

  return (
    <div className="flex-1 flex items-end justify-center relative -mx-6 -mb-6 overflow-hidden pt-1 min-h-[170px]">
      {/* Concentric Circles with Gradients and Shadows - Rotating */}
      <div className="relative flex items-center justify-center translate-y-44 scale-[0.85] origin-bottom">
        {/* Outer Circle - Largest - Slow rotation */}
        <div className="w-96 h-96 rounded-full absolute bg-gradient-to-br from-orange-50/30 via-amber-50/20 to-yellow-50/10 shadow-[0_0_40px_rgba(255,91,4,0.08)] animate-[spin_20s_linear_infinite]" />

        {/* Middle Circle - Medium rotation (reverse) */}
        <div className="w-72 h-72 rounded-full absolute bg-gradient-to-br from-orange-100/40 via-amber-100/30 to-yellow-100/20 shadow-[0_0_30px_rgba(255,91,4,0.12)] animate-[spin_15s_linear_infinite_reverse]" />

        {/* Inner Circle - Faster rotation */}
        <div className="w-48 h-48 rounded-full absolute bg-gradient-to-br from-orange-200/50 via-amber-200/40 to-yellow-200/30 shadow-[0_0_20px_rgba(255,91,4,0.15)] animate-[spin_10s_linear_infinite]" />

        {/* Center Circle - Fastest rotation (reverse) */}
        <div className="w-24 h-24 rounded-full absolute bg-gradient-to-br from-brand-orange/50 via-orange-400/40 to-amber-400/30 shadow-[0_0_15px_rgba(255,91,4,0.25)] animate-[spin_8s_linear_infinite_reverse]" />

        {/* Center 50+ Badge */}
        <div className="w-14 h-14 rounded-full absolute bg-white shadow-[0_0_20px_rgba(255,91,4,0.35)] border border-brand-orange/30 flex items-center justify-center z-10">
          <span className="text-sm font-black text-brand-orange font-jetbrains-mono tracking-tight">50+</span>
        </div>

        {/* Client Logos positioned on circle layers - Revolving */}
        <div className="relative w-96 h-96 animate-[spin_25s_linear_infinite]">
          {/* OUTER CIRCLE - 8 icons (45° spacing) */}
          {/* 1: 0° (Top) */}
          <div className="absolute top-[0%] left-[50%] -translate-x-1/2 animate-[spin_25s_linear_infinite_reverse]">
            <div
              title={outerLogos[0].name}
              className="w-12 h-12 rounded-full bg-white/85 backdrop-blur-sm shadow-lg flex items-center justify-center transition-[transform,box-shadow] duration-500 hover:scale-125 hover:shadow-xl p-2.5"
            >
              <img
                alt={outerLogos[0].name}
                className="w-full h-full object-contain"
                src={outerLogos[0].logo}
              />
            </div>
          </div>

          {/* 2: 45° */}
          <div className="absolute top-[15%] right-[15%] animate-[spin_25s_linear_infinite_reverse]">
            <div
              title={outerLogos[1].name}
              className="w-12 h-12 rounded-full bg-white/85 backdrop-blur-sm shadow-lg flex items-center justify-center transition-[transform,box-shadow] duration-500 hover:scale-125 hover:shadow-xl p-2.5"
            >
              <img
                alt={outerLogos[1].name}
                className="w-full h-full object-contain"
                src={outerLogos[1].logo}
              />
            </div>
          </div>

          {/* 3: 90° */}
          <div className="absolute top-[50%] right-[0%] -translate-y-1/2 animate-[spin_25s_linear_infinite_reverse]">
            <div
              title={outerLogos[2].name}
              className="w-12 h-12 rounded-full bg-white/85 backdrop-blur-sm shadow-lg flex items-center justify-center transition-[transform,box-shadow] duration-500 hover:scale-125 hover:shadow-xl p-2.5"
            >
              <img
                alt={outerLogos[2].name}
                className="w-full h-full object-contain"
                src={outerLogos[2].logo}
              />
            </div>
          </div>

          {/* 4: 135° */}
          <div className="absolute bottom-[15%] right-[15%] animate-[spin_25s_linear_infinite_reverse]">
            <div
              title={outerLogos[3].name}
              className="w-12 h-12 rounded-full bg-white/85 backdrop-blur-sm shadow-lg flex items-center justify-center transition-[transform,box-shadow] duration-500 hover:scale-125 hover:shadow-xl p-2.5"
            >
              <img
                alt={outerLogos[3].name}
                className="w-full h-full object-contain"
                src={outerLogos[3].logo}
              />
            </div>
          </div>

          {/* 5: 180° */}
          <div className="absolute bottom-[0%] left-[50%] -translate-x-1/2 animate-[spin_25s_linear_infinite_reverse]">
            <div
              title={outerLogos[4].name}
              className="w-12 h-12 rounded-full bg-white/85 backdrop-blur-sm shadow-lg flex items-center justify-center transition-[transform,box-shadow] duration-500 hover:scale-125 hover:shadow-xl p-2.5"
            >
              <img
                alt={outerLogos[4].name}
                className="w-full h-full object-contain"
                src={outerLogos[4].logo}
              />
            </div>
          </div>

          {/* 6: 225° */}
          <div className="absolute bottom-[15%] left-[15%] animate-[spin_25s_linear_infinite_reverse]">
            <div
              title={outerLogos[5].name}
              className="w-12 h-12 rounded-full bg-white/85 backdrop-blur-sm shadow-lg flex items-center justify-center transition-[transform,box-shadow] duration-500 hover:scale-125 hover:shadow-xl p-2.5"
            >
              <img
                alt={outerLogos[5].name}
                className="w-full h-full object-contain"
                src={outerLogos[5].logo}
              />
            </div>
          </div>

          {/* 7: 270° */}
          <div className="absolute top-[50%] left-[0%] -translate-y-1/2 animate-[spin_25s_linear_infinite_reverse]">
            <div
              title={outerLogos[6].name}
              className="w-12 h-12 rounded-full bg-white/85 backdrop-blur-sm shadow-lg flex items-center justify-center transition-[transform,box-shadow] duration-500 hover:scale-125 hover:shadow-xl p-2.5"
            >
              <img
                alt={outerLogos[6].name}
                className="w-full h-full object-contain"
                src={outerLogos[6].logo}
              />
            </div>
          </div>

          {/* 8: 315° */}
          <div className="absolute top-[15%] left-[15%] animate-[spin_25s_linear_infinite_reverse]">
            <div
              title={outerLogos[7].name}
              className="w-12 h-12 rounded-full bg-white/85 backdrop-blur-sm shadow-lg flex items-center justify-center transition-[transform,box-shadow] duration-500 hover:scale-125 hover:shadow-xl p-2.5"
            >
              <img
                alt={outerLogos[7].name}
                className="w-full h-full object-contain"
                src={outerLogos[7].logo}
              />
            </div>
          </div>

          {/* MIDDLE CIRCLE - 6 icons (60° spacing) */}
          {/* 1: 0° */}
          <div className="absolute top-[18%] left-[50%] -translate-x-1/2 animate-[spin_25s_linear_infinite_reverse]">
            <div
              title={middleLogos[0].name}
              className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center transition-[transform,box-shadow] duration-500 hover:scale-125 hover:shadow-xl p-2.5"
            >
              <img
                alt={middleLogos[0].name}
                className="w-full h-full object-contain"
                src={middleLogos[0].logo}
              />
            </div>
          </div>

          {/* 2: 60° */}
          <div className="absolute top-[32%] right-[18%] animate-[spin_25s_linear_infinite_reverse]">
            <div
              title={middleLogos[1].name}
              className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center transition-[transform,box-shadow] duration-500 hover:scale-125 hover:shadow-xl p-2.5"
            >
              <img
                alt={middleLogos[1].name}
                className="w-full h-full object-contain"
                src={middleLogos[1].logo}
              />
            </div>
          </div>

          {/* 3: 120° */}
          <div className="absolute bottom-[32%] right-[18%] animate-[spin_25s_linear_infinite_reverse]">
            <div
              title={middleLogos[2].name}
              className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center transition-[transform,box-shadow] duration-500 hover:scale-125 hover:shadow-xl p-2.5"
            >
              <img
                alt={middleLogos[2].name}
                className="w-full h-full object-contain"
                src={middleLogos[2].logo}
              />
            </div>
          </div>

          {/* 4: 180° */}
          <div className="absolute bottom-[18%] left-[50%] -translate-x-1/2 animate-[spin_25s_linear_infinite_reverse]">
            <div
              title={middleLogos[3].name}
              className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center transition-[transform,box-shadow] duration-500 hover:scale-125 hover:shadow-xl p-2.5"
            >
              <img
                alt={middleLogos[3].name}
                className="w-full h-full object-contain"
                src={middleLogos[3].logo}
              />
            </div>
          </div>

          {/* 5: 240° */}
          <div className="absolute bottom-[32%] left-[18%] animate-[spin_25s_linear_infinite_reverse]">
            <div
              title={middleLogos[4].name}
              className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center transition-[transform,box-shadow] duration-500 hover:scale-125 hover:shadow-xl p-2.5"
            >
              <img
                alt={middleLogos[4].name}
                className="w-full h-full object-contain"
                src={middleLogos[4].logo}
              />
            </div>
          </div>

          {/* 6: 300° */}
          <div className="absolute top-[32%] left-[18%] animate-[spin_25s_linear_infinite_reverse]">
            <div
              title={middleLogos[5].name}
              className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center transition-[transform,box-shadow] duration-500 hover:scale-125 hover:shadow-xl p-2.5"
            >
              <img
                alt={middleLogos[5].name}
                className="w-full h-full object-contain"
                src={middleLogos[5].logo}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
