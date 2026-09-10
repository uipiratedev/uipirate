"use client";

import { motion } from "framer-motion";

// 1. Full-Stack Architecture
export const VisualFullStackNew = () => {
  return (
    <div className="w-full h-full bg-gray-50 flex items-center justify-center p-6 relative overflow-hidden select-none">
      <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
      
      <div className="relative w-[180px] h-[220px] flex flex-col items-center justify-between z-10">
        {/* Connection Line */}
        <div className="absolute top-8 bottom-8 w-[2px] bg-gray-200 left-1/2 -translate-x-1/2 z-0" />

        {/* Data packets flowing down */}
        <motion.div animate={{ top: ["15%", "85%"], opacity: [0, 1, 0] }} className="absolute w-2 h-2 bg-brand-orange rounded-full left-1/2 -translate-x-1/2 z-0 shadow-[0_0_8px_#ff5e00]" initial={{ top: "15%", opacity: 0 }} transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 0 }} />
        <motion.div animate={{ top: ["15%", "85%"], opacity: [0, 1, 0] }} className="absolute w-2 h-2 bg-brand-orange rounded-full left-1/2 -translate-x-1/2 z-0 shadow-[0_0_8px_#ff5e00]" initial={{ top: "15%", opacity: 0 }} transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }} />
        
        {/* Data packets flowing up */}
        <motion.div animate={{ top: ["85%", "15%"], opacity: [0, 1, 0] }} className="absolute w-2 h-2 bg-blue-500 rounded-full left-1/2 -translate-x-1/2 z-0 shadow-[0_0_8px_#3b82f6]" initial={{ top: "85%", opacity: 0 }} transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: 0.5 }} />

        {/* Frontend Layer */}
        <motion.div animate={{ y: [-3, 3, -3] }} className="w-full h-14 bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 shadow-md flex items-center px-4 gap-3 z-10" transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
          <div className="w-8 h-8 rounded bg-orange-50 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-brand-orange rounded-sm" />
          </div>
          <div className="flex flex-col gap-1.5 flex-1">
            <div className="w-full h-1.5 bg-gray-200 rounded-full" />
            <div className="w-2/3 h-1.5 bg-gray-200 rounded-full" />
          </div>
        </motion.div>

        {/* Backend Layer */}
        <motion.div animate={{ y: [-2, 2, -2] }} className="w-11/12 h-14 bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 shadow-md flex items-center px-4 gap-3 z-10" transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}>
          <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-gray-500 rounded-full" />
          </div>
          <div className="flex flex-col gap-1.5 flex-1">
            <div className="w-5/6 h-1.5 bg-gray-300 rounded-full" />
            <div className="w-1/2 h-1.5 bg-gray-300 rounded-full" />
          </div>
        </motion.div>

        {/* Database Layer */}
        <motion.div animate={{ y: [-4, 4, -4] }} className="w-5/6 h-14 bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 shadow-md flex items-center px-4 gap-3 z-10" transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}>
          <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center">
            <div className="w-4 h-3 border-2 border-blue-500 rounded-sm" />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <div className="w-full h-1 bg-gray-200 rounded-full" />
            <div className="w-full h-1 bg-gray-200 rounded-full" />
            <div className="w-full h-1 bg-gray-200 rounded-full" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// 2. AI & LLM Integration
export const VisualAILLMNew = () => {
  return (
    <div className="w-full h-full bg-gradient-to-tr from-gray-50 to-white flex items-center justify-center p-6 relative overflow-hidden select-none">
      <div className="relative w-full max-w-[260px] h-[180px] flex flex-col items-center justify-center gap-6">
        
        {/* Glowing AI Core */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-brand-orange/10 rounded-full blur-2xl z-0" />
        
        {/* Input Node */}
        <motion.div animate={{ y: [0, -3, 0] }} className="w-full h-10 bg-white rounded-lg border border-gray-200 shadow-sm flex items-center px-3 gap-2 z-10" transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
          <div className="w-4 h-4 text-brand-orange">
            <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" /></svg>
          </div>
          <div className="w-24 h-2 bg-gray-100 rounded-full relative overflow-hidden">
             <motion.div animate={{ x: ["-100%", "100%"] }} className="absolute inset-0 bg-brand-orange/20" transition={{ duration: 2, repeat: Infinity }} />
          </div>
        </motion.div>

        {/* Processing Line */}
        <div className="w-[2px] h-6 bg-gray-200 relative z-0">
          <motion.div animate={{ height: ["0%", "100%"], opacity: [1, 0] }} className="absolute top-0 w-full bg-brand-orange" transition={{ duration: 1.5, repeat: Infinity }} />
        </div>

        {/* Output Stream */}
        <div className="w-full bg-white rounded-lg border border-gray-200 shadow-md p-3 flex flex-col gap-2 z-10">
          <motion.div animate={{ width: ["0%", "100%"] }} className="h-2 bg-gray-800 rounded-full" transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }} />
          <motion.div animate={{ width: ["0%", "80%"] }} className="h-2 bg-gray-600 rounded-full" transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.2 }} />
          <motion.div animate={{ width: ["0%", "90%"] }} className="h-2 bg-gray-400 rounded-full" transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.4 }} />
        </div>
      </div>
    </div>
  );
};

// 3. API & Third-Party Integrations
export const VisualAPINew = () => {
  return (
    <div className="w-full h-full bg-gray-50 flex items-center justify-center p-6 relative overflow-hidden select-none">
      <div className="relative w-full max-w-[280px] h-[140px] flex items-center justify-between">
        
        {/* App Node */}
        <motion.div animate={{ scale: [1, 1.05, 1] }} className="w-16 h-16 bg-white rounded-2xl border-2 border-brand-orange shadow-lg flex items-center justify-center z-10" transition={{ duration: 3, repeat: Infinity }}>
          <div className="w-8 h-8 bg-brand-orange/10 rounded-xl flex items-center justify-center">
            <div className="w-3 h-3 bg-brand-orange rounded-full" />
          </div>
        </motion.div>

        {/* Connection Path */}
        <div className="absolute left-16 right-16 top-1/2 -translate-y-1/2 h-[2px] z-0">
          <svg className="w-full h-full" preserveAspectRatio="none">
            <line stroke="#e2e8f0" strokeDasharray="6 6" strokeWidth="2" x1="0" x2="100%" y1="0" y2="0" />
            <motion.line animate={{ strokeDashoffset: [24, 0] }} stroke="#ff5e00" strokeDasharray="6 6" strokeWidth="2" transition={{ duration: 1, repeat: Infinity, ease: "linear" }} x1="0" x2="100%" y1="0" y2="0" />
          </svg>
          
          {/* JSON Payload travelling right */}
          <motion.div animate={{ x: [0, 140], opacity: [0, 1, 0] }} className="absolute top-1/2 -translate-y-1/2 -mt-[10px] w-5 h-5 bg-white border border-gray-200 rounded shadow text-[10px] font-bold flex items-center justify-center text-gray-500" initial={{ x: 0 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
            {"{ }"}
          </motion.div>
        </div>

        {/* Third Party Node */}
        <motion.div animate={{ scale: [1, 1.05, 1] }} className="w-16 h-16 bg-white rounded-2xl border border-gray-200 shadow-md flex items-center justify-center z-10" transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}>
          <div className="grid grid-cols-2 gap-1">
            <div className="w-3 h-3 bg-gray-300 rounded-sm" />
            <div className="w-3 h-3 bg-gray-400 rounded-sm" />
            <div className="w-3 h-3 bg-gray-400 rounded-sm" />
            <div className="w-3 h-3 bg-gray-300 rounded-sm" />
          </div>
        </motion.div>
        
      </div>
    </div>
  );
};

// 4. Cloud Deployment & Scaling
export const VisualCloudNew = () => {
  return (
    <div className="w-full h-full bg-gradient-to-t from-gray-100 to-white flex items-center justify-center p-6 relative overflow-hidden select-none">
      <div className="relative w-full h-full flex flex-col items-center justify-end pb-4">
        
        {/* Load Balancer */}
        <div className="absolute top-6 w-12 h-12 bg-white rounded-full border-2 border-brand-orange shadow-[0_0_15px_rgba(255,94,0,0.2)] flex items-center justify-center z-20">
          <svg className="w-5 h-5 text-brand-orange" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>

        {/* Connections */}
        <svg className="absolute inset-0 w-full h-full z-0" pointerEvents="none">
          <path d="M 50% 72 L 50% 120" stroke="#e2e8f0" strokeWidth="2" />
          <path d="M 25% 140 L 50% 72" stroke="#e2e8f0" strokeWidth="2" />
          <path d="M 75% 140 L 50% 72" stroke="#e2e8f0" strokeWidth="2" />
        </svg>

        {/* Server Instances */}
        <div className="w-full max-w-[240px] flex justify-between items-end z-10 h-[60px]">
          <motion.div animate={{ scale: [1, 1.1, 1] }} className="w-14 h-10 bg-white rounded-md border border-gray-200 shadow-md flex items-center justify-center" transition={{ duration: 2, repeat: Infinity }}>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </motion.div>
          
          <motion.div animate={{ scale: [1, 1.1, 1] }} className="w-14 h-10 bg-white rounded-md border border-brand-orange shadow-md flex items-center justify-center" transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </motion.div>

          <motion.div animate={{ scale: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }} className="w-14 h-10 bg-white rounded-md border border-gray-200 shadow-md flex items-center justify-center" transition={{ duration: 4, repeat: Infinity, times: [0, 0.2, 0.8, 1] }}>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </motion.div>
        </div>

      </div>
    </div>
  );
};

// 5. AI-Generated Code, Production-Ready
export const VisualAiCodeNew = () => {
  return (
    <div className="w-full h-full bg-gray-50 flex items-center justify-center p-6 relative overflow-hidden select-none">
      <div className="relative w-full max-w-[280px] h-[160px] bg-white rounded-xl border border-gray-200 shadow-lg flex overflow-hidden">
        
        {/* Left Side: Chaotic Prototype */}
        <div className="flex-1 p-3 flex flex-col gap-2 relative border-r border-gray-100">
          <div className="text-[8px] text-gray-400 font-bold mb-1">PROTOTYPE</div>
          <div className="w-full h-3 bg-gray-100 rounded rotate-1" />
          <div className="w-3/4 h-3 bg-gray-200 rounded -rotate-2 ml-2" />
          <div className="w-5/6 h-3 bg-gray-100 rounded rotate-1" />
          <div className="w-1/2 h-3 bg-red-100 rounded -rotate-1 ml-4" />
          <div className="w-full h-3 bg-gray-200 rounded" />
        </div>

        {/* Right Side: Production Ready */}
        <div className="flex-1 bg-gray-900 p-3 flex flex-col gap-2 relative">
          <div className="text-[8px] text-brand-orange font-bold mb-1">PRODUCTION</div>
          <div className="w-full h-3 bg-gray-800 rounded flex items-center px-1">
            <div className="w-2 h-1.5 bg-blue-400 rounded-sm mr-1" />
            <div className="w-1/2 h-1.5 bg-gray-600 rounded-sm" />
          </div>
          <div className="w-full h-3 bg-gray-800 rounded flex items-center px-1 pl-4">
            <div className="w-2 h-1.5 bg-brand-orange rounded-sm mr-1" />
            <div className="w-3/4 h-1.5 bg-gray-600 rounded-sm" />
          </div>
          <div className="w-full h-3 bg-gray-800 rounded flex items-center px-1 pl-4">
            <div className="w-2 h-1.5 bg-green-400 rounded-sm mr-1" />
            <div className="w-1/2 h-1.5 bg-gray-600 rounded-sm" />
          </div>
          <div className="w-full h-3 bg-gray-800 rounded flex items-center px-1">
            <div className="w-2 h-1.5 bg-purple-400 rounded-sm mr-1" />
            <div className="w-1/3 h-1.5 bg-gray-600 rounded-sm" />
          </div>
        </div>

        {/* Scanning Sweeper */}
        <motion.div animate={{ left: ["10%", "90%", "10%"] }} className="absolute top-0 bottom-0 w-1 bg-brand-orange shadow-[0_0_15px_#ff5e00] z-20" transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
      </div>
    </div>
  );
};
