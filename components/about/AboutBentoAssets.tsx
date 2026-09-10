"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { CLIENT_LOGOS } from "@/data/clientLogos";
import { WORLD_LAND_COORDS } from "@/data/worldLandPoints";

// Card 1: Strategy Before Pixels (Tall)
const STRATEGY_NODES = [
  { text: "Positioning", x: 22, y: 16, side: "right" as const, delay: 0.2 },
  { text: "User Flows", x: 78, y: 39, side: "left" as const, delay: 0.7 },
  { text: "Wireframes", x: 22, y: 62, side: "right" as const, delay: 1.2 },
  { text: "UI Design", x: 78, y: 85, side: "left" as const, delay: 1.7 },
];

export const StrategyBeforePixelsAsset = () => {
  return (
    <div className="w-full flex-1 overflow-hidden relative min-h-[240px] select-none">
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
    <div className="w-full flex-1 overflow-hidden relative min-h-[170px] select-none">

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
    <div className="w-full flex-1 overflow-hidden relative min-h-[160px] flex items-center justify-center p-4">
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
    <div className="w-full flex-1 overflow-hidden relative min-h-[160px] flex shadow-inner">
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

interface GlobeLocation {
  id: "uk" | "india" | "usa";
  name: string;
  flag: string;
  lat: number;
  lon: number;
  timezone: string;
  time: string;
  utc: string;
}

const GLOBE_LOCATIONS: GlobeLocation[] = [
  {
    id: "usa",
    name: "USA",
    flag: "🇺🇸",
    lat: 38,
    lon: -97,
    timezone: "EST",
    time: "12:00 PM",
    utc: "UTC-5",
  },
  {
    id: "uk",
    name: "UK",
    flag: "🇬🇧",
    lat: 54,
    lon: -2,
    timezone: "GMT",
    time: "5:00 PM",
    utc: "UTC+0",
  },
  {
    id: "india",
    name: "India",
    flag: "🇮🇳",
    lat: 22,
    lon: 78,
    timezone: "IST",
    time: "10:30 PM",
    utc: "UTC+5:30",
  },
];

// Card 5: Same Hours as Your Team - Interactive 3D Globe with Location Navigation
export const TimezoneAsset = () => {
  const [selected, setSelected] = useState<"usa" | "uk" | "india">("usa");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pinRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Target longitude in radians based on selected country
  const selectedLoc = GLOBE_LOCATIONS.find((l) => l.id === selected) || GLOBE_LOCATIONS[0];

  // Store rotation states
  const rotationRef = useRef({
    currentLon: (-selectedLoc.lon * Math.PI) / 180,
    targetLon: (-selectedLoc.lon * Math.PI) / 180,
    tilt: 0.32, // ~18 degrees tilt
    isDragging: false,
    lastMouseX: 0,
  });

  // When selection changes, update target angle
  useEffect(() => {
    // Target rotation to bring the location to front (center)
    const targetRad = (-selectedLoc.lon * Math.PI) / 180;
    rotationRef.current.targetLon = targetRad;
  }, [selectedLoc]);

  // Main animation render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const rot = rotationRef.current;

      // Smooth lerp to target longitude if not dragging
      if (!rot.isDragging) {
        let diff = rot.targetLon - rot.currentLon;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        rot.currentLon += diff * 0.08;
      }

      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;
      const radius = width * 0.44;

      ctx.clearRect(0, 0, width, height);

      // Draw authentic world map land dots
      const totalPoints = WORLD_LAND_COORDS.length / 2;
      for (let i = 0; i < totalPoints; i++) {
        const lat = WORLD_LAND_COORDS[i * 2];
        const lon = WORLD_LAND_COORDS[i * 2 + 1];

        const radLat = (lat * Math.PI) / 180;
        const radLon = (lon * Math.PI) / 180;
        const theta = radLon + rot.currentLon;

        // 3D coordinates on unit sphere
        const x = Math.cos(radLat) * Math.sin(theta);
        const y = -Math.sin(radLat);
        const z = Math.cos(radLat) * Math.cos(theta);

        // Tilt rotation along X axis
        const yPrime = y * Math.cos(rot.tilt) - z * Math.sin(rot.tilt);
        const zPrime = y * Math.sin(rot.tilt) + z * Math.cos(rot.tilt);

        // Only draw front-facing points
        if (zPrime > 0.02) {
          const px = cx + x * radius;
          const py = cy + yPrime * radius;
          const size = 1.0 + zPrime * 0.9;
          const alpha = Math.min(1, 0.25 + zPrime * 0.75);

          ctx.beginPath();
          ctx.arc(px, py, Math.max(0.65, size), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(2)})`;
          ctx.fill();
        }
      }

      // Update positions of HTML location pins directly on the DOM
      for (const loc of GLOBE_LOCATIONS) {
        const pinEl = pinRefs.current[loc.id];
        if (!pinEl) continue;

        const radLat = (loc.lat * Math.PI) / 180;
        const radLon = (loc.lon * Math.PI) / 180;
        const theta = radLon + rot.currentLon;

        const x = Math.cos(radLat) * Math.sin(theta);
        const y = -Math.sin(radLat);
        const z = Math.cos(radLat) * Math.cos(theta);

        const yPrime = y * Math.cos(rot.tilt) - z * Math.sin(rot.tilt);
        const zPrime = y * Math.sin(rot.tilt) + z * Math.cos(rot.tilt);

        if (zPrime > 0.05) {
          // Convert internal canvas pixels to CSS client coordinates with scale ratio
          const scaleRatio = (canvas.clientWidth || 220) / canvas.width;
          const clientPx = (cx + x * radius) * scaleRatio;
          const clientPy = (cy + yPrime * radius) * scaleRatio;

          pinEl.style.transform = `translate3d(${clientPx}px, ${clientPy}px, 0)`;
          pinEl.style.opacity = `${Math.min(1, (zPrime - 0.05) * 3)}`;
          pinEl.style.pointerEvents = "auto";
        } else {
          pinEl.style.opacity = "0";
          pinEl.style.pointerEvents = "none";
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  // Resize canvas for retina displays
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const size = canvas.clientWidth || 240;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
  }, []);

  // Drag handlers for tactile manual rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    rotationRef.current.isDragging = true;
    rotationRef.current.lastMouseX = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!rotationRef.current.isDragging) return;
    const delta = e.clientX - rotationRef.current.lastMouseX;
    rotationRef.current.lastMouseX = e.clientX;
    rotationRef.current.currentLon += delta * 0.008;
    rotationRef.current.targetLon = rotationRef.current.currentLon;
  };

  const handleMouseUp = () => {
    rotationRef.current.isDragging = false;
  };

  return (
    <div className="flex-1 w-full -mx-6 -mb-6 relative flex items-end justify-between pr-0 select-none pt-4 min-h-[190px]">
      {/* Left Column: 3D Dotted Dark Globe Sphere */}
      <div
        className="relative w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] -ml-6 sm:-ml-8 -mb-6 sm:-mb-8 flex-shrink-0 flex items-center justify-center self-end"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Globe 3D Sphere with Dark Atmosphere & Vignette */}
        <div className="w-full h-full rounded-full overflow-hidden relative shadow-[0_16px_45px_rgba(0,0,0,0.4),_0_0_60px_rgba(0,0,0,0.25)] border border-white/10 bg-[radial-gradient(circle_at_35%_28%,#222733_0%,#0d1016_60%,#030406_100%)]">
          <canvas
            ref={canvasRef}
            className="w-full h-full block cursor-grab active:cursor-grabbing"
            style={{ width: "100%", height: "100%" }}
          />

          {/* Atmospheric Inner Shadow & Rim Vignette */}
          <div className="absolute inset-0 rounded-full pointer-events-none shadow-[inset_0_0_24px_rgba(255,255,255,0.08),inset_-10px_-10px_35px_rgba(0,0,0,0.85)]" />
        </div>

        {/* Floating Location Markers on Globe */}
        {GLOBE_LOCATIONS.map((loc) => {
          const isActive = selected === loc.id;
          return (
            <div
              key={loc.id}
              ref={(el) => {
                pinRefs.current[loc.id] = el;
              }}
              onClick={(e) => {
                e.preventDefault();
                setSelected(loc.id as "usa" | "uk" | "india");
              }}
              className="absolute left-0 top-0 z-30 cursor-pointer"
              style={{
                opacity: 0,
                pointerEvents: "none",
                willChange: "transform, opacity",
              }}
            >
              {/* Pinpoint Dot Centered on Exact Coordinate */}
              <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                <div
                  className={`w-2 h-2 rounded-full ${isActive ? "bg-white shadow-[0_0_8px_#ffffff]" : "bg-white/70"
                    }`}
                />
                {isActive && (
                  <div className="absolute w-4 h-4 rounded-full border border-white/60 animate-ping pointer-events-none" />
                )}
              </div>

              {/* Flag Badge Connected Directly Above Pinpoint */}
              <div
                className={`absolute bottom-2 left-0 -translate-x-1/2 flex flex-col items-center pointer-events-auto ${isActive ? "opacity-100 scale-100" : "opacity-40 hover:opacity-90 scale-90"
                  }`}
              >
                <div className="bg-[#1E222B] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-lg border border-white/20 flex items-center gap-1 whitespace-nowrap">
                  <span>{loc.flag}</span>
                  <span>{loc.name}</span>
                </div>
                <div className="w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-t-[4px] border-t-[#1E222B]" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Right Column: Interactive Location Pills & Remote Badge */}
      <div className="flex flex-col items-end justify-between h-full z-20 pb-6 ml-auto self-stretch">
        {/* Country Selector Buttons */}
        <div className="flex flex-col gap-2 my-auto">
          {GLOBE_LOCATIONS.map((loc) => {
            const isActive = selected === loc.id;
            return (
              <button
                key={loc.id}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setSelected(loc.id as "usa" | "uk" | "india");
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center justify-between gap-3 transition-colors duration-150 shadow-sm w-[114px] h-[34px] border-2 cursor-pointer ${isActive
                    ? "bg-white text-gray-900 border-[#1E60FF] shadow-md"
                    : "bg-[#14161C] text-gray-200 border-transparent hover:bg-[#20242E] hover:text-white"
                  }`}
              >
                <span className="font-semibold">{loc.name}</span>
                <span className="text-sm leading-none">{loc.flag}</span>
              </button>
            );
          })}
        </div>

        {/* Remote Info Tag (Bottom-Right, Fixed Size) */}
        <div className="flex items-center gap-1.5 text-right mt-3 h-[32px] pr-0.5">
          <svg className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z" />
          </svg>
          <div className="flex flex-col">
            <span className="text-[8px] uppercase tracking-wider text-gray-400 font-bold leading-tight">
              REMOTE
            </span>
            <span className="text-[11px] font-bold text-gray-800 tracking-tight leading-tight whitespace-nowrap">
              {selectedLoc.name} · {selectedLoc.time}
            </span>
          </div>
        </div>
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
    <div className="flex-1 w-full flex items-end justify-center relative -mx-6 -mb-6 overflow-hidden pt-8 mt-1 min-h-[180px]">
      {/* Concentric Circles with Gradients and Shadows - Rotating */}
      <div className="absolute -bottom-36 sm:-bottom-36 flex items-center justify-center scale-[0.72] sm:scale-[0.75] origin-bottom pointer-events-none">
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
