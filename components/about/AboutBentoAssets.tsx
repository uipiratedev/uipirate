"use client";

import { motion } from "framer-motion";
import { CLIENT_LOGOS } from "@/data/clientLogos";

// Card 1: Strategy Before Pixels (Tall)
export const StrategyBeforePixelsAsset = () => {
  return (
    <div className="flex-1 rounded-xl mb-6 bg-gradient-to-b from-gray-50 to-white border border-gray-100 overflow-hidden relative min-h-[160px] flex items-center justify-center py-6 px-4">
      {/* Animated Path */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 200" preserveAspectRatio="none">
        <path id="strategy-path" d="M30,20 C80,60 10,120 70,180" fill="none" stroke="#f3f4f6" strokeWidth="3" />
        <motion.path 
          d="M30,20 C80,60 10,120 70,180" 
          fill="none" 
          stroke="url(#gradient)" 
          strokeWidth="3"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          viewport={{ once: true }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff5e00" stopOpacity="0" />
            <stop offset="50%" stopColor="#ff5e00" stopOpacity="1" />
            <stop offset="100%" stopColor="#ff5e00" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Nodes */}
      <div className="relative z-10 flex flex-col justify-between h-full w-full py-2">
        {[
          { text: "Positioning", align: "self-start", delay: 0.3 },
          { text: "User Flows", align: "self-end", delay: 0.7 },
          { text: "Wireframes", align: "self-start", delay: 1.1 },
          { text: "UI Design", align: "self-end", delay: 1.5 },
        ].map((item, i) => (
          <motion.div
            key={item.text}
            className={`${item.align} flex items-center gap-2`}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: item.delay }}
            viewport={{ once: true }}
          >
            {item.align === "self-end" && <div className="w-2 h-2 rounded-full bg-brand-orange shadow-[0_0_8px_rgba(255,102,0,0.6)]" />}
            <div className="bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-gray-200 shadow-sm text-xs font-semibold text-gray-700">
              {item.text}
            </div>
            {item.align === "self-start" && <div className="w-2 h-2 rounded-full bg-brand-orange shadow-[0_0_8px_rgba(255,102,0,0.6)]" />}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Card 2: Complex Made Simple (Wide) - Animated Slider
export const ComplexMadeSimpleAsset = () => {
  return (
    <div className="flex-1 rounded-xl mb-6 bg-gray-100 overflow-hidden relative min-h-[120px]">
      
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

      {/* Foreground: Clean UI with Clip Path Animation */}
      <motion.div 
        className="absolute inset-0 bg-white p-4 shadow-[inset_0_0_20px_rgba(0,0,0,0.05)] border-r-2 border-brand-orange"
        animate={{ clipPath: ["inset(0 100% 0 0)", "inset(0 0% 0 0)", "inset(0 100% 0 0)"] }}
        transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
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

      {/* Slider Handle */}
      <motion.div 
        className="absolute top-0 bottom-0 w-[2px] bg-brand-orange z-20 flex items-center justify-center"
        animate={{ left: ["0%", "100%", "0%"] }}
        transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
      >
         <div className="w-6 h-6 bg-white border-2 border-brand-orange rounded-full shadow-lg flex items-center justify-center -ml-3">
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
        <div className="w-16 h-12 border-2 border-[#0ea5e9] rounded relative bg-white shadow-sm">
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-white border border-[#0ea5e9]" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-white border border-[#0ea5e9]" />
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white border border-[#0ea5e9]" />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white border border-[#0ea5e9]" />
          
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
          {"      "}Code{"\n"}
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

// Card 6: 50+ Products (Wide) - Revolving Client Logos
export const ProductsGridAsset = () => {
  // Use a subset of logos for the carousel to keep it clean
  const carouselLogos = CLIENT_LOGOS.slice(0, 6);
  
  return (
    <div className="flex-1 rounded-xl mb-6 bg-gray-50 border border-gray-100 overflow-hidden relative min-h-[120px] flex items-center justify-center">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-orange-50/50 to-transparent" />
      
      {/* Concentric Rotating Rings */}
      <div className="relative flex items-center justify-center scale-75 md:scale-90">
         {/* Inner Ring */}
         <div className="absolute w-40 h-40 border border-gray-200 rounded-full" />
         
         {/* Outer Ring */}
         <div className="absolute w-72 h-72 border border-gray-200 border-dashed rounded-full animate-[spin_30s_linear_infinite]" />

         {/* Revolving Logos Container */}
         <div className="relative w-72 h-72 animate-[spin_20s_linear_infinite]">
            {carouselLogos.map((logo, index) => {
               // Calculate position on the circle (360 / 6 = 60 degrees apart)
               const angle = (index * 60 * Math.PI) / 180;
               const radius = 144; // Half of 288px (w-72)
               
               // Math for top and left percentages
               const x = Math.cos(angle) * radius;
               const y = Math.sin(angle) * radius;
               
               return (
                  <div 
                    key={logo.name}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-[spin_20s_linear_infinite_reverse]"
                    style={{ 
                       transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` 
                    }}
                  >
                     <div className="w-12 h-12 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center p-2 hover:scale-110 transition-transform">
                        <img 
                           src={logo.logo} 
                           alt={logo.name} 
                           className="w-full h-full object-contain"
                           style={logo.invertColor ? { filter: "invert(1) sepia(1) saturate(5) hue-rotate(180deg) brightness(0.7)" } : {}}
                        />
                     </div>
                  </div>
               );
            })}
         </div>

         {/* Center Graphic */}
         <div className="w-16 h-16 bg-white rounded-full shadow-[0_0_30px_rgba(255,94,0,0.15)] border-2 border-brand-orange/20 flex items-center justify-center z-10">
            <span className="text-xl font-black text-brand-orange font-jetbrains-mono">50+</span>
         </div>
      </div>
      
      {/* Gradient fades for edges */}
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-gray-50 to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-gray-50 to-transparent z-20 pointer-events-none" />
    </div>
  );
};
