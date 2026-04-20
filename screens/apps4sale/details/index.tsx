"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { SaaS } from "@/components/icons";
import LetsTalkButton from "@/components/LetsTalkButton";
import GlassBadge from "@/components/GlassBadge";
import Image from "next/image";

interface IconProps {
  size?: number;
  className?: string;
}

const ArrowLeft = ({ size = 24, className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
  </svg>
);

const Settings = ({ size = 24, className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

const Zap = ({ size = 24, className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 14.5 14 3l-2.5 8.5H20L10 21l2.5-8.5H4z"/>
  </svg>
);

const Rocket = ({ size = 24, className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.5-1 1-4c1.5 0 3 0 3 0l1 4z"/><path d="M12 15v5s1-.5 4-1c0-1.5 0-3 0-3l-4-1z"/>
  </svg>
);

const Check = ({ size = 24, className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 6 9 17l-5-5"/>
  </svg>
);

const Share2 = ({ size = 24, className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.59 13.51 6.83 3.98"/><path d="m15.41 6.51-6.82 3.98"/>
  </svg>
);

// Mock data based on the screenshot
const mockProduct = {
  title: "AI Voice Support System",
  subtitle: "Real-time voice AI for customer conversations",
  category: "AI System",
  useCase: "Customer Support",
  integration: "API / Full Setup",
  description: "A ready-to-deploy voice-based AI system that handles customer queries, routes conversations intelligently, and provides instant responses using advanced natural language processing.",
  whereItFits: "Ideal for SaaS platforms, marketplaces, or services that need scalable, always-on customer support without growing support teams.",
  whatYouGet: [
    { title: "COMPLETE UI/UX FOR THE SYSTEM", icon: "https://res.cloudinary.com/damm9iwho/image/upload/v1730799888/Code_qedbxu.svg" },
    { title: "BACKEND LOGIC AND WORKFLOWS", icon: "https://res.cloudinary.com/damm9iwho/image/upload/v1730799888/Code_qedbxu.svg" },
    { title: "AI INTEGRATION SETUP", icon: "https://res.cloudinary.com/damm9iwho/image/upload/v1730799889/AppWindow_m5lr3w.svg" },
    { title: "API OR EMBED-READY MODULE", icon: "https://res.cloudinary.com/damm9iwho/image/upload/v1730799889/AppWindow_m5lr3w.svg" },
    { title: "DEPLOYMENT GUIDANCE", icon: "https://res.cloudinary.com/damm9iwho/image/upload/v1730799889/AppWindow_m5lr3w.svg" }
  ],
  capabilities: [
    "Real-time voice interaction",
    "Context-aware responses",
    "Multi-language support",
    "Integration with existing systems",
    "Scalable architecture"
  ],
  howItWorks: [
    { title: "Plug in", description: "Connect the module to your product" },
    { title: "Configure", description: "Set up workflows and routing" },
    { title: "Connect AI", description: "Link your preferred AI services" },
    { title: "Go live", description: "Deploy and start handling queries" }
  ]
};

const BracketIcon = () => (
  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-zinc-100 mb-6">
    <svg fill="none" height="32" viewBox="0 0 32 32" width="32" xmlns="http://www.w3.org/2000/svg">
      <path d="M15.3401 22.68L13.3334 18.6667L4.00009 14C3.87244 13.9415 3.76426 13.8476 3.68842 13.7294C3.61258 13.6112 3.57227 13.4738 3.57227 13.3333C3.57227 13.1929 3.61258 13.0554 3.68842 12.9373C3.76426 12.8191 3.87244 12.7252 4.00009 12.6667L28.0001 4L23.0974 17.5787M26.6667 28L29.3333 25.3333L26.6667 22.6667M22.6667 22.6667L20 25.3333L22.6667 28" stroke="#FF5B04" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
    </svg>
  </div>
);

const Apps4SaleDetails = ({ slug }: { slug: string }) => {
  return (
    <div className="min-h-screen  pt-20 pb-20 overflow-hidden container  mx-auto px-32 lg:px-20 max-md:px-4 ">
      <div className="">
        {/* Navigation */}
        <Link href="/apps4sale" className="group flex items-center gap-2 text-zinc-400 hover:text-zinc-600 transition-colors mb-12">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Explore</span>
        </Link>

        {/* Hero Section */}
        <div className="mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[40px] md:text-[64px] font-bold tracking-tight text-zinc-900 mb-4"
          >
            {mockProduct.title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-zinc-500 mb-12"
          >
            {mockProduct.subtitle}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-12 mb-12"
          >
            <div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-2">Category</p>
              <p className="text-zinc-700 font-semibold">{mockProduct.category}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-2">Use Case</p>
              <p className="text-zinc-700 font-semibold">{mockProduct.useCase}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-2">Integration</p>
              <p className="text-zinc-700 font-semibold">{mockProduct.integration}</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4 max-md:justify-center"
          >
            <LetsTalkButton
                              
                              variant="color"
                              children="Get This System"
                              href="/apps4sale/demo"
                              target="_self"
                            />
          <LetsTalkButton
                              
                              variant="light"
                              children="Explore Demo"
                              href="/apps4sale/demo"
                              target="_self"
                            />
          </motion.div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-16 md:mb-24 px-4 md:px-0">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 md:p-12 mb-6 md:mb-0"
            style={{
              borderRadius: "40px",
              boxShadow: "0px 3px 6px 0px rgba(255, 255, 255, 0.35) inset",
              border: "1px solid rgba(0, 0, 0, 0.08)",
              background: "#fff"
            }}
          >
            <BracketIcon />
            <h3 className="text-lg md:text-2xl font-bold text-zinc-900 mb-4 text-center md:text-left">What this system does</h3>
            <p className="text-zinc-500 leading-relaxed text-sm md:text-lg text-center md:text-left">
              {mockProduct.description}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 md:p-12 text-center md:text-left"
            style={{
              borderRadius: "40px",
              boxShadow: "0px 3px 6px 0px rgba(255, 255, 255, 0.35) inset",
              border: "1px solid rgba(0, 0, 0, 0.08)",
              background: "#fff"
            }}
          >
            <BracketIcon />
            <h3 className="text-lg md:text-2xl font-bold text-zinc-900 mb-4">Where this fits</h3>
            <p className="text-zinc-500 leading-relaxed text-sm md:text-lg">
              {mockProduct.whereItFits}
            </p>
          </motion.div>
        </div>

        {/* What You Get Section */}
        <div className="mb-20 md:mb-32">
          <h2 className="heading-center mb-6">What you get</h2>
          <div className="bg-[#18181B] p-4 md:p-6 rounded-[32px] md:rounded-[48px] shadow-2xl overflow-hidden">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {mockProduct.whatYouGet.slice(0, 3).map((item, idx) => (
                   <div key={idx} className="bg-[#27272A] p-6 md:p-8 rounded-[12px] md:rounded-[16px] flex flex-col items-center justify-center text-center group hover:bg-[#3F3F46] transition-colors cursor-default">
                      <div className=" mb-4 text-xl">
                        <Image src={item.icon} alt="icon" width={24} height={24} className="brightness-0 invert" />
                      </div>
                      <p className="global-title text-white">
                        {item.title}
                      </p>
                   </div>
                ))}
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockProduct.whatYouGet.slice(3, 5).map((item, idx) => (
                   <div key={idx} className="bg-[#27272A] p-6 md:p-8 rounded-[12px] md:rounded-[16px] flex flex-col items-center justify-center text-center group hover:bg-[#3F3F46] transition-colors cursor-default">
                      <div className="text-zinc-400 mb-4 text-xl">
                        <Image src={item.icon} alt="icon" width={24} height={24} className="brightness-0 invert" />
                      </div>
                      <p className="global-title text-white">
                        {item.title}
                      </p>
                   </div>
                ))}
             </div>
          </div>
        </div>

        {/* Key Capabilities Section */}
        <div className="mb-20 md:mb-32">
          <h2 className="heading-center mb-6">Key capabilities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap justify-center gap-4 md:gap-6">
            {mockProduct.capabilities.map((capability, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 md:p-8 rounded-[32px] border border-[#F3F4F6] shadow-sm flex flex-col items-center justify-center text-center w-full lg:w-[220px]"
              >
                <div className="w-10 h-10 bg-[#FF5B04]/5 rounded-xl flex items-center justify-center mb-6">
                  <Zap size={18} className="text-[#FF5B04]" />
                </div>
                <p className="text-zinc-800 font-bold text-sm leading-snug">{capability}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mb-32">
          <h2 className="heading-center mb-6">How it works</h2>
          <div className="relative flex flex-col md:flex-row justify-between items-start gap-8 md:gap-12 px-4">
            {/* Step Connection Line (Desktop) */}
            <div className="hidden md:block absolute top-[28px] left-[10%] right-[10%] h-[1px] bg-zinc-200" />
            
            {mockProduct.howItWorks.map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center flex-1 w-full max-sm:mb-12">
                <div className="w-14 h-14 bg-[#FF5B04] text-white rounded-lg flex items-center justify-center text-xl font-bold mb-6 shadow-lg shadow-[#FF5B04]/30">
                  {idx + 1}
                </div>
                <h4 className="text-lg font-bold text-zinc-900 mb-2">{step.title}</h4>
                <p className="text-[#99A1AF] text-sm max-w-[200px] mx-auto">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Customization Section */}
        <div className="mb-32">
          <div 
            className="p-8 md:p-16 rounded-[48px] flex flex-col md:flex-row items-center md:items-start gap-8 mx-auto relative overflow-hidden group"
            style={{
              borderRadius: "40px",
              boxShadow: "0px 3px 6px 0px rgba(255, 255, 255, 0.35) inset",
              border: "1px solid rgba(0, 0, 0, 0.08)",
              background: "#fff"
            }}
          >
            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
               <Settings size={120} className="text-[#FF5B04]/[0.02]" />
            </div>
            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center shrink-0">
               <Settings className="text-[#FF5B04]" size={28} />
            </div>
            <div>
               <h3 className="text-xl font-semibold mb-4">Customization</h3>
               <p className="text-[#99A1AF] leading-relaxed text-lg max-w-3xl">
                  The system can be tailored to your product&apos;s workflows, branding, and scale
                  requirements. We adapt everything from voice tone to routing logic.
               </p>
            </div>
          </div>
        </div>

        {/* Final CTA Banner */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className="bg-[#FF5B04] rounded-[12px] md:rounded-[24px] p-10 md:p-20 text-center mb-16 md:mb-32 relative overflow-hidden shadow-2xl shadow-[#FF5B04]/30"
        >
          {/* Background Decorative Blur */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/20 rounded-full blur-[80px]" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-black/10 rounded-full blur-[80px]" />
          
          <div className="relative z-10">
            <h2 className="text-2xl md:text-4xl font-black font-normal text-white mb-6">Want this in your product?</h2>
            <p className="text-white/80 text-base md:text-lg mb-6 max-w-xl mx-auto font-normal">
               We&apos;ll help you set it up and adapt it to your use case.
            </p>
            <button className="bg-white text-[#FF5B04] px-12 py-5 rounded-full font-black text-lg font-light hover:scale-105 transition-all shadow-xl shadow-black/5 hover:bg-zinc-50 active:scale-95">
               Get This System
            </button>
          </div>
        </motion.div>

        {/* Related Products */}
        <div className="text-center pt-20">
               <GlassBadge variant="gradient">
      RECOMMENDED others apps
      </GlassBadge>
        
   
          <h2 className="heading-center mb-6 mt-5">Check Out Other Tools</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 text-left px-4 md:px-0">
            {[1, 2, 3].map((i) => (
              <div 
                key={i} 
                className="group p-8 md:p-10 hover:shadow-xl hover:shadow-[#FF5B04]/5 transition-all duration-500 cursor-pointer"
                style={{
                  borderRadius: "40px",
                  boxShadow: "0px 3px 6px 0px rgba(255, 255, 255, 0.35) inset",
                  border: "1px solid rgba(0, 0, 0, 0.08)",
                  background: "linear-gradient(131deg, #EDEDED 15%, #FFFFFF 50%, #EDEDED 85%)"
                }}
              >
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-zinc-100 mb-8 group-hover:bg-[#FF5B04]/5 transition-colors">
                  <svg fill="none" height="32" viewBox="0 0 32 32" width="32" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.3401 22.68L13.3334 18.6667L4.00009 14C3.87244 13.9415 3.76426 13.8476 3.68842 13.7294C3.61258 13.6112 3.57227 13.4738 3.57227 13.3333C3.57227 13.1929 3.61258 13.0554 3.68842 12.9373C3.76426 12.8191 3.87244 12.7252 4.00009 12.6667L28.0001 4L23.0974 17.5787M26.6667 28L29.3333 25.3333L26.6667 22.6667M22.6667 22.6667L20 25.3333L22.6667 28" stroke="#FF5B04" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                </div>
                <h3 className="text-lg md:text-2xl font-bold mb-4 text-zinc-900 group-hover:text-[#FF5B04] transition-colors">{i === 1 ? "AI Voice Support System" : i === 2 ? "Smart Onboarding Engine" : "Sales Catalyst"}</h3>
                <p className="text-zinc-500 leading-relaxed text-sm md:text-base">
                  {i === 2 ? "Guide users with dynamic, personalized onboarding flows." : "Handle customer queries with real-time voice AI or scale your sales automation."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Apps4SaleDetails;
