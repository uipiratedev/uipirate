"use client";

import { motion } from "framer-motion";

// 1. UX/UI Design & Prototype (Wireframe to Hi-Fi & Interaction)
export const VisualUxUiNew = () => {
  return (
    <div className="w-full h-full bg-gray-50 flex items-center justify-center relative overflow-hidden select-none">
      
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
            animate={{ scale: [1, 0.95, 1], borderColor: ["#e5e7eb", "#ff5e00", "#e5e7eb"] }}
            className="w-1/2 h-6 border-2 border-gray-200 border-dashed rounded mx-auto mt-auto"
            transition={{ duration: 4, repeat: Infinity, times: [0, 0.45, 0.5, 1] }}
          />
        </div>

        {/* Prototype Connection Arrow */}
        <svg className="absolute inset-0 w-full h-full z-0" pointerEvents="none" viewBox="0 0 280 160">
          <motion.path 
            animate={{ strokeDashoffset: [40, 0] }}
            d="M 90 120 Q 140 160 190 80" 
            fill="none" 
            stroke="#ff5e00" 
            strokeDasharray="4 4" 
            strokeWidth="2" 
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          {/* Arrowhead */}
          <motion.path 
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            d="M 190 80 L 182 85 L 188 88 Z" 
            fill="#ff5e00"
            transition={{ duration: 1, repeat: Infinity }}
          />
        </svg>

        {/* Right: Hi-Fi Polished Screen */}
        <motion.div 
          animate={{ y: [0, -5, 0], boxShadow: ["0px 4px 6px rgba(0,0,0,0.1)", "0px 10px 15px rgba(0,0,0,0.2)", "0px 4px 6px rgba(0,0,0,0.1)"] }}
          className="w-[120px] h-[150px] bg-white border border-gray-100 rounded-xl flex flex-col p-2 gap-2 relative z-10"
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Hi-Fi Header */}
          <div className="w-full h-6 bg-gray-50 rounded flex items-center px-1 shadow-sm border border-gray-100">
             <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center">
               <div className="w-2 h-2 rounded-full bg-blue-500" />
             </div>
          </div>
          {/* Hi-Fi Hero */}
          <div className="w-full h-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded flex flex-col items-center justify-center gap-1 border border-blue-100">
             <div className="w-1/2 h-1.5 bg-gray-800 rounded" />
             <div className="w-3/4 h-1.5 bg-gray-400 rounded" />
          </div>
          {/* Hi-Fi Polished Button */}
          <motion.div 
            animate={{ backgroundColor: ["#ff5e00", "#ea580c", "#ff5e00"] }}
            className="w-2/3 h-6 rounded mx-auto mt-auto shadow-[0_4px_10px_rgba(255,94,0,0.3)] flex items-center justify-center"
            transition={{ duration: 4, repeat: Infinity, times: [0, 0.45, 0.5, 1] }}
          >
            <div className="w-1/2 h-1 bg-white/80 rounded" />
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
};

// 2. UI Development & Integration (Code Rendering the Component)
export const VisualUiDevNew = () => {
  return (
    <div className="w-full h-full bg-gradient-to-tr from-gray-100 to-white flex items-center justify-center p-6 relative overflow-hidden select-none">
      <div className="relative w-full max-w-[280px] h-[160px] flex gap-4">
        
        {/* Left: Code Editor typing out */}
        <div className="flex-1 bg-gray-900 rounded-xl shadow-xl flex flex-col overflow-hidden border border-gray-700">
          <div className="h-5 bg-gray-800 flex items-center px-2 gap-1">
             <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
             <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
             <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 p-3 flex flex-col gap-2">
            <div className="w-3/4 h-1.5 bg-pink-400/80 rounded" />
            <motion.div 
              animate={{ width: ["0%", "80%", "80%", "0%"] }}
              className="h-1.5 bg-blue-300/80 rounded ml-2"
              transition={{ duration: 4, repeat: Infinity, times: [0, 0.3, 0.8, 1] }}
            />
            <motion.div 
              animate={{ width: ["0%", "50%", "50%", "0%"] }}
              className="h-1.5 bg-green-300/80 rounded ml-4"
              transition={{ duration: 4, repeat: Infinity, times: [0, 0.4, 0.8, 1] }}
            />
            <motion.div 
              animate={{ width: ["0%", "60%", "60%", "0%"] }}
              className="h-1.5 bg-yellow-300/80 rounded ml-2"
              transition={{ duration: 4, repeat: Infinity, times: [0, 0.5, 0.8, 1] }}
            />
            <div className="w-1/2 h-1.5 bg-pink-400/80 rounded mt-1" />
          </div>
        </div>

        {/* Right: Live Interactive Component Rendering */}
        <div className="w-[100px] flex items-center justify-center">
           <motion.div 
             animate={{ 
               backgroundColor: ["#f3f4f6", "#ffffff", "#ffffff", "#f3f4f6"],
               boxShadow: ["0px 0px 0px rgba(0,0,0,0)", "0px 10px 15px rgba(0,0,0,0.1)", "0px 10px 15px rgba(0,0,0,0.1)", "0px 0px 0px rgba(0,0,0,0)"],
               borderColor: ["#e5e7eb", "#ff5e00", "#ff5e00", "#e5e7eb"]
             }}
             className="w-full h-[100px] rounded-xl border-2 flex flex-col items-center justify-center gap-3 relative"
             transition={{ duration: 4, repeat: Infinity, times: [0, 0.5, 0.8, 1] }}
           >
             {/* The Toggle Switch responding to the code */}
             <motion.div 
               animate={{ backgroundColor: ["#d1d5db", "#ff5e00", "#ff5e00", "#d1d5db"] }}
               className="w-12 h-6 rounded-full flex items-center px-1"
               transition={{ duration: 4, repeat: Infinity, times: [0, 0.5, 0.8, 1] }}
             >
                <motion.div 
                  animate={{ x: [0, 24, 24, 0] }}
                  className="w-4 h-4 bg-white rounded-full shadow-sm"
                  transition={{ duration: 4, repeat: Infinity, times: [0, 0.5, 0.8, 1], ease: "anticipate" }}
                />
             </motion.div>
             <div className="w-1/2 h-1.5 bg-gray-200 rounded" />
           </motion.div>
        </div>

      </div>
    </div>
  );
};

// 3. New Build or Redesign (The Layout Evolution - Before & After Morph)
export const VisualRedesignNew = () => {
  return (
    <div className="w-full h-full bg-white flex items-center justify-center relative overflow-hidden select-none p-6">
      <div className="relative w-full max-w-[240px] h-[160px]">
        
        {/* Old/Messy Layout (Underneath) */}
        <div className="absolute inset-0 bg-gray-100 rounded-xl border border-gray-300 p-3 flex flex-col gap-2 opacity-50 grayscale">
          {/* Unaligned, ugly blocks */}
          <div className="flex gap-2">
            <div className="w-1/2 h-8 bg-gray-300" />
            <div className="w-1/3 h-6 bg-gray-400 mt-2" />
          </div>
          <div className="w-[90%] h-16 bg-gray-300 ml-[5%]" />
          <div className="flex gap-1 ml-4">
            <div className="w-10 h-10 bg-gray-400 rounded-full" />
            <div className="w-16 h-8 bg-gray-300 mt-1" />
          </div>
        </div>

        {/* New/Modern Layout (Revealed by sweeping clipPath) */}
        <motion.div 
          animate={{ clipPath: ["circle(0% at 0% 50%)", "circle(150% at 0% 50%)", "circle(150% at 0% 50%)", "circle(0% at 0% 50%)"] }}
          className="absolute inset-0 bg-white rounded-xl shadow-xl border border-gray-100 p-3 flex flex-col gap-2 z-10"
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", times: [0, 0.4, 0.8, 1] }}
        >
          {/* Perfectly aligned, modern glassmorphic blocks */}
          <div className="flex justify-between items-center bg-gray-50 p-2 rounded-lg border border-gray-100">
            <div className="flex items-center gap-2">
               <div className="w-4 h-4 bg-brand-orange rounded-md" />
               <div className="w-12 h-2 bg-gray-800 rounded" />
            </div>
            <div className="flex gap-1">
               <div className="w-4 h-1.5 bg-gray-200 rounded" />
               <div className="w-4 h-1.5 bg-gray-200 rounded" />
            </div>
          </div>
          
          <div className="w-full h-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 flex flex-col justify-center p-3 gap-1">
             <div className="w-1/2 h-2 bg-blue-500 rounded" />
             <div className="w-3/4 h-1.5 bg-blue-200 rounded" />
          </div>
          
          <div className="flex gap-2 h-10">
            <div className="flex-1 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center">
              <div className="w-1/2 h-1.5 bg-gray-300 rounded" />
            </div>
            <div className="flex-1 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center">
              <div className="w-1/2 h-1.5 bg-gray-300 rounded" />
            </div>
          </div>
        </motion.div>

        {/* Sweeping Laser Line indicating the exact edge of the redesign */}
        <motion.div 
          animate={{ left: ["0%", "100%", "100%", "0%"], opacity: [0, 1, 0, 1, 0] }}
          className="absolute top-0 bottom-0 w-[2px] bg-brand-orange shadow-[0_0_20px_#ff5e00] z-20"
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", times: [0, 0.4, 0.8, 1] }}
        />

      </div>
    </div>
  );
};

// 4. Mobile Optimization (Fluid Constraint & Collapse)
export const VisualMobileOptNew = () => {
  return (
    <div className="w-full h-full bg-gray-50 flex items-center justify-center relative overflow-hidden select-none p-6">
      
      {/* Dynamic Device Boundary */}
      <motion.div 
        animate={{ width: ["260px", "100px", "100px", "260px"] }}
        className="h-[180px] bg-white border-4 border-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden relative"
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", times: [0, 0.3, 0.7, 1] }}
      >
        
        {/* Device Notch/Camera */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-3 bg-gray-800 rounded-b-lg flex justify-center items-center gap-1 z-20">
          <div className="w-1 h-1 bg-gray-600 rounded-full" />
        </div>

        {/* Header */}
        <div className="w-full h-8 bg-gray-100 border-b border-gray-200 flex items-center px-2 mt-2" />
        
        {/* Responsive Content Grid */}
        <div className="flex-1 p-2 flex flex-wrap content-start gap-2 h-full overflow-hidden">
          
          {/* Main Hero Block */}
          <div className="w-full h-10 bg-brand-orange/10 rounded-lg border border-brand-orange/30" />
          
          {/* The 3-Column Grid that collapses */}
          {/* On Desktop (260px width), they sit 3 across. On Mobile (100px width), flex-wrap forces them to stack vertically. */}
          <motion.div 
            animate={{ minWidth: ["30%", "100%", "100%", "30%"] }}
            className="flex-1 h-8 bg-blue-50 rounded-lg border border-blue-100"
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", times: [0, 0.3, 0.7, 1] }}
          />
          <motion.div 
            animate={{ minWidth: ["30%", "100%", "100%", "30%"] }}
            className="flex-1 h-8 bg-green-50 rounded-lg border border-green-100"
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", times: [0, 0.3, 0.7, 1] }}
          />
          <motion.div 
            animate={{ minWidth: ["30%", "100%", "100%", "30%"] }}
            className="flex-1 h-8 bg-purple-50 rounded-lg border border-purple-100"
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", times: [0, 0.3, 0.7, 1] }}
          />
          
        </div>
      </motion.div>

    </div>
  );
};
