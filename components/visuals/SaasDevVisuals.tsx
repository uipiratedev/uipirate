"use client";

import { motion } from "framer-motion";

// 1. Full-Stack Architecture (Isometric / Vertical Stack)
export const VisualFullStackNew = () => {
  return (
    <div className="w-full h-full bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-6 relative overflow-hidden select-none">
      <div className="relative w-[180px] h-[220px] flex flex-col items-center justify-between z-10 perspective-1000">
        
        {/* Connection Beam (Energy flow) */}
        <div className="absolute top-8 bottom-8 w-[2px] bg-gray-200 left-1/2 -translate-x-1/2 z-0" />
        <motion.div 
          animate={{ height: ["0%", "100%", "0%"], top: ["0%", "0%", "100%"] }} 
          className="absolute w-[2px] bg-brand-orange left-1/2 -translate-x-1/2 z-0 shadow-[0_0_8px_#ff5e00]" 
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} 
        />

        {/* Top: Frontend Browser Window */}
        <motion.div 
          animate={{ y: [-4, 4, -4] }} 
          className="w-full h-[60px] bg-white rounded-xl border border-gray-200 shadow-xl flex flex-col overflow-hidden z-10" 
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-full h-4 bg-gray-100 border-b border-gray-200 flex items-center px-2 gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 p-2 flex gap-2">
            <div className="w-8 h-8 bg-blue-50 rounded" />
            <div className="flex-1 flex flex-col gap-1.5">
              <div className="w-3/4 h-2 bg-gray-200 rounded-full" />
              <div className="w-1/2 h-2 bg-gray-200 rounded-full" />
            </div>
          </div>
        </motion.div>

        {/* Middle: Server Rack (Backend) */}
        <motion.div 
          animate={{ y: [-2, 2, -2] }} 
          className="w-11/12 h-[50px] bg-gray-900 rounded-xl border border-gray-700 shadow-xl flex flex-col justify-center p-2 gap-2 z-10" 
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <div className="flex items-center justify-between px-2">
            <div className="w-1/2 h-1 bg-gray-700 rounded-full" />
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse delay-75" />
            </div>
          </div>
          <div className="flex items-center justify-between px-2">
            <div className="w-1/3 h-1 bg-gray-700 rounded-full" />
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse delay-150" />
              <div className="w-1.5 h-1.5 rounded-full bg-gray-700" />
            </div>
          </div>
        </motion.div>

        {/* Bottom: Database Cylinder */}
        <motion.div 
          animate={{ y: [-4, 4, -4] }} 
          className="w-4/5 h-[50px] relative z-10" 
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <div className="absolute inset-0 bg-white border border-gray-200 rounded-xl shadow-xl flex flex-col items-center justify-center gap-1.5">
             <div className="w-10 h-3 rounded-[50%] border-2 border-brand-orange bg-orange-50" />
             <div className="w-10 h-3 rounded-[50%] border-2 border-brand-orange bg-orange-50 -mt-2" />
             <div className="w-10 h-3 rounded-[50%] border-2 border-brand-orange bg-orange-50 -mt-2" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// 2. AI Models & API Integrations (Integration Hub)
export const VisualAILLMNew = () => {
  return (
    <div className="w-full h-full bg-gray-50 flex items-center justify-center p-6 relative overflow-hidden select-none">
      <div className="relative w-full h-full max-w-[260px] max-h-[180px]">
        
        {/* Central App Hub */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-2xl border-2 border-gray-900 shadow-xl flex items-center justify-center z-20">
          <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Animated Connecting Lines */}
        <svg className="absolute inset-0 w-full h-full z-0" pointerEvents="none" viewBox="0 0 260 180">
          {/* Top Left (AI) */}
          <motion.path animate={{ strokeDashoffset: [24, 0] }} d="M 130 90 L 60 40" fill="none" stroke="#ff5e00" strokeDasharray="4 4" strokeWidth="2" transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
          {/* Top Right (Auth) */}
          <motion.path animate={{ strokeDashoffset: [0, 24] }} d="M 130 90 L 200 40" fill="none" stroke="#3b82f6" strokeDasharray="4 4" strokeWidth="2" transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
          {/* Bottom (Payment/API) */}
          <motion.path animate={{ strokeDashoffset: [24, 0] }} d="M 130 90 L 130 150" fill="none" stroke="#10b981" strokeDasharray="4 4" strokeWidth="2" transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
        </svg>

        {/* Floating Payloads */}
        <motion.div animate={{ top: ["20%", "50%", "20%"], left: ["22%", "50%", "22%"] }} className="absolute w-4 h-4 bg-white border border-gray-200 rounded flex items-center justify-center text-[8px] font-bold text-gray-500 z-10" transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>{`{}`}</motion.div>
        
        {/* Node 1: AI (Top Left) */}
        <div className="absolute top-[20px] left-[30px] w-12 h-12 bg-orange-50 rounded-full border border-orange-200 flex items-center justify-center z-10 shadow-[0_0_15px_rgba(255,94,0,0.3)]">
          <svg className="w-5 h-5 text-brand-orange" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" /></svg>
        </div>

        {/* Node 2: Auth Lock (Top Right) */}
        <div className="absolute top-[20px] right-[30px] w-12 h-12 bg-blue-50 rounded-full border border-blue-200 flex items-center justify-center z-10">
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>

        {/* Node 3: Third Party API (Bottom) */}
        <div className="absolute bottom-[10px] left-1/2 -translate-x-1/2 w-12 h-12 bg-green-50 rounded-full border border-green-200 flex items-center justify-center z-10">
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>

      </div>
    </div>
  );
};

// 3. Cloud Deployment & Scaling (Traffic Spike & Horizontal Scaling)
export const VisualCloudNew = () => {
  return (
    <div className="w-full h-full bg-gradient-to-t from-gray-100 to-white flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
      
      {/* Huge Background Cloud */}
      <svg className="absolute top-4 w-48 h-48 text-gray-200/50 z-0" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.5 19C19.9853 19 22 16.9853 22 14.5C22 12.1325 20.177 10.2078 17.8645 10.021C17.3976 6.6186 14.4828 4 11 4C7.13401 4 4 7.13401 4 11C4 11.2335 4.01144 11.4644 4.03369 11.6917C1.78776 12.1857 0 14.1802 0 16.5C0 19.1419 2.05929 21.2987 4.67389 21.4883L5 21.5H17.5V19Z" />
      </svg>

      <div className="relative w-full max-w-[240px] h-[140px] flex flex-col items-center justify-end z-10">
        
        {/* Incoming Traffic (Dots) */}
        <motion.div animate={{ top: ["0%", "40%"], opacity: [0, 1, 0] }} className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full" transition={{ duration: 1.5, repeat: Infinity, ease: "easeIn" }} />
        <motion.div animate={{ top: ["0%", "40%"], opacity: [0, 1, 0] }} className="absolute left-[45%] -translate-x-1/2 w-1.5 h-1.5 bg-brand-orange rounded-full" transition={{ duration: 1.2, repeat: Infinity, ease: "easeIn", delay: 0.3 }} />
        <motion.div animate={{ top: ["0%", "40%"], opacity: [0, 1, 0] }} className="absolute left-[55%] -translate-x-1/2 w-1.5 h-1.5 bg-green-500 rounded-full" transition={{ duration: 1.4, repeat: Infinity, ease: "easeIn", delay: 0.6 }} />

        {/* Server Instances */}
        <div className="flex items-center justify-center gap-3">
          
          {/* Server 2 (Cloned) */}
          <motion.div animate={{ x: [0, -20, 0], opacity: [0, 1, 0], scale: [0.8, 1, 0.8] }} className="w-12 h-14 bg-white rounded-lg border-2 border-gray-200 shadow-lg flex flex-col items-center justify-center gap-1.5" transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", times: [0, 0.2, 0.8, 1] }}>
            <div className="w-8 h-1.5 bg-gray-200 rounded" />
            <div className="w-8 h-1.5 bg-gray-200 rounded" />
            <div className="w-2 h-2 rounded-full bg-green-500 mt-1 animate-pulse" />
          </motion.div>

          {/* Primary Server 1 */}
          <motion.div animate={{ scale: [1, 1.05, 1] }} className="w-14 h-16 bg-white rounded-lg border-2 border-brand-orange shadow-[0_0_15px_rgba(255,94,0,0.3)] flex flex-col items-center justify-center gap-2 z-20" transition={{ duration: 4, repeat: Infinity }}>
            <div className="w-10 h-2 bg-gray-100 rounded" />
            <div className="w-10 h-2 bg-gray-100 rounded" />
            <div className="w-3 h-3 rounded-full bg-green-500 mt-1 animate-pulse" />
          </motion.div>
          
          {/* Server 3 (Cloned) */}
          <motion.div animate={{ x: [0, 20, 0], opacity: [0, 1, 0], scale: [0.8, 1, 0.8] }} className="w-12 h-14 bg-white rounded-lg border-2 border-gray-200 shadow-lg flex flex-col items-center justify-center gap-1.5" transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", times: [0, 0.2, 0.8, 1] }}>
            <div className="w-8 h-1.5 bg-gray-200 rounded" />
            <div className="w-8 h-1.5 bg-gray-200 rounded" />
            <div className="w-2 h-2 rounded-full bg-green-500 mt-1 animate-pulse" />
          </motion.div>

        </div>

        {/* Status Badge */}
        <motion.div animate={{ opacity: [0, 1, 1, 0], y: [10, 0, 0, 10] }} className="absolute -bottom-2 bg-green-100 border border-green-200 px-3 py-1 rounded-full flex items-center gap-1.5 z-30" transition={{ duration: 4, repeat: Infinity, times: [0, 0.2, 0.8, 1] }}>
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
          <span className="text-[9px] font-bold text-green-700 uppercase tracking-wider">Scaled Up</span>
        </motion.div>

      </div>
    </div>
  );
};

// 4. AI-Generated Code, Production-Ready (A/B Reveal Mask Slider)
export const VisualAiCodeNew = () => {
  return (
    <div className="w-full h-full bg-gray-50 flex items-center justify-center relative overflow-hidden select-none">
      
      <div className="relative w-[280px] h-[160px] rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-white">
        
        {/* BACKGROUND LAYER: The Messy AI Prototype (Before) */}
        <div className="absolute inset-0 bg-gray-50 p-4 flex flex-col gap-2">
          <div className="text-[10px] text-gray-400 font-bold mb-1 opacity-60">PROTOTYPE</div>
          <div className="w-11/12 h-3 bg-gray-200 rounded flex items-end">
            <div className="h-0.5 w-1/4 bg-red-400" /> {/* Red squiggly representation */}
          </div>
          <div className="w-3/4 h-3 bg-gray-300 rounded ml-4" />
          <div className="w-5/6 h-3 bg-gray-200 rounded ml-2 flex items-end">
             <div className="h-0.5 w-1/3 bg-red-400" />
          </div>
          <div className="w-1/2 h-3 bg-gray-300 rounded ml-8" />
          <div className="w-full h-3 bg-gray-200 rounded mt-2" />
        </div>

        {/* FOREGROUND LAYER: The Clean Production Code (After) */}
        {/* We use framer-motion clipPath to reveal this layer dynamically */}
        <motion.div 
          animate={{ clipPath: ["inset(0 100% 0 0)", "inset(0 0% 0 0)", "inset(0 100% 0 0)"] }} 
          className="absolute inset-0 bg-gray-900 p-4 flex flex-col gap-2 border-r border-brand-orange"
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="text-[10px] text-brand-orange font-bold mb-1">PRODUCTION</div>
          <div className="w-full flex items-center gap-1">
            <div className="w-4 h-3 bg-purple-500 rounded-sm" />
            <div className="w-1/2 h-3 bg-gray-600 rounded-sm" />
          </div>
          <div className="w-full flex items-center gap-1 pl-4">
            <div className="w-4 h-3 bg-blue-400 rounded-sm" />
            <div className="w-3/4 h-3 bg-gray-600 rounded-sm" />
          </div>
          <div className="w-full flex items-center gap-1 pl-4">
            <div className="w-4 h-3 bg-green-400 rounded-sm" />
            <div className="w-1/3 h-3 bg-gray-600 rounded-sm" />
          </div>
          <div className="w-full flex items-center gap-1 pl-8">
            <div className="w-4 h-3 bg-yellow-400 rounded-sm" />
            <div className="w-1/2 h-3 bg-gray-600 rounded-sm" />
          </div>
          <div className="w-full flex items-center gap-1 mt-2">
            <div className="w-4 h-3 bg-purple-500 rounded-sm" />
            <div className="w-1/4 h-3 bg-gray-600 rounded-sm" />
          </div>
          
          {/* Glowing Slider Handle tied to the edge of the clip-path */}
          <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-brand-orange shadow-[0_0_15px_#ff5e00] z-20">
            <div className="absolute top-1/2 -translate-y-1/2 -left-[5px] w-3 h-8 bg-brand-orange rounded-full flex items-center justify-center">
              <div className="w-[1px] h-4 bg-white/50" />
            </div>
          </div>
        </motion.div>

      </div>
      
    </div>
  );
};
