"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@heroui/button";
import PageWrapper from "@/components/PageWrapper";
import GlassSurface from "@/components/GlassSurface";
import { CheckIcon, SearchIcon } from "@/components/icons";

const AICallingScreen = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const useCases = [
    {
      title: "Medical Appointment Reminders",
      description: "Automate reminders, rescheduling, and pre-op instructions with a natural voice that patients trust.",
      icon: "🏥",
      details: ["Syncs with EHR/EMR", "Multi-language support", "Follow-up coordination"]
    },
    {
      title: "Real Estate Qualification",
      description: "Instantly call new leads to qualify their budget, location, and timeline before passing to an agent.",
      icon: "🏠",
      details: ["Instant lead response", "Buyer qualification", "Viewing scheduling"]
    },
    {
      title: "E-Commerce Recovery",
      description: "Call customers who abandoned high-value carts to offer support or exclusive discounts.",
      icon: "🛒",
      details: ["RTO reduction", "Personalized offers", "Order verification"]
    },
    {
      title: "Enterprise IT Support",
      description: "Initial triage for technical issues and automated updates for system outages.",
      icon: "🛠️",
      details: ["Status notifications", "Initial triage", "Password reset flows"]
    }
  ];

  const callFlowSteps = [
    {
      step: "01",
      title: "API Request",
      desc: "Your system sends a POST request with the specific phone number and context.",
      code: "POST /api/v1/calls/start"
    },
    {
      step: "02",
      title: "Carrier Initiation",
      desc: "Twilio places the outbound call using localized, trusted phone numbers.",
      code: "Twilio + Amazon Polly"
    },
    {
      step: "03",
      title: "Hybrid Processing",
      desc: "Our engine decides whether to use the Rule Engine (Instant) or AI (Complex).",
      code: "Gemini 2.0 Flash Live"
    },
    {
      step: "04",
      title: "Natural Interaction",
      desc: "The AI speaks in human-like neural voices, understanding nuances and interrupts.",
      code: "Neural TTS Engine"
    }
  ];

  return (
    <PageWrapper showFloatingButton={true}>
      <div className="bg-[#fcfdfe] min-h-screen text-slate-900 font-sans selection:bg-blue-100">
        
        {/* --- HERO SECTION --- */}
        <section className="relative pt-32 pb-24 overflow-hidden border-b border-blue-50">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-50/50 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3 pointer-events-none" />
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-20">
              <div className="flex-1 text-center lg:text-left">
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-100 bg-blue-50/50 text-blue-600 text-sm font-semibold mb-8"
                >
                  <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                  Live Voice AI Technology
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-5xl md:text-7xl font-extrabold leading-[1.1] mb-8 text-slate-900"
                >
                  Conversational <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                    Voice Agents
                  </span>
                  <br /> for Enterprise
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-slate-500 text-xl max-w-2xl mx-auto lg:mx-0 mb-12 leading-relaxed"
                >
                  Automate high-volume phone calls with a hybrid engine that combines rule-based efficiency 
                  with the intelligence of LLMs. Deploy human-like neural voices that handle complex scenarios instantly.
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="flex flex-wrap justify-center lg:justify-start gap-4"
                >
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-7 text-lg font-bold rounded-2xl shadow-xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
                  >
                    Start Building Free
                  </Button>
                  <Button 
                    variant="bordered"
                    className="border-slate-200 hover:border-blue-200 hover:bg-blue-50/30 text-slate-700 px-10 py-7 text-lg font-bold rounded-2xl transition-all"
                  >
                    Documentation
                  </Button>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-12 flex items-center justify-center lg:justify-start gap-8 opacity-60"
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Twilio_logo.svg" alt="Twilio" className="h-6 grayscale hover:grayscale-0 transition-all cursor-pointer" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Amazon_Web_Services_Logo.svg/1280px-Amazon_Web_Services_Logo.svg.png" alt="AWS" className="h-6 grayscale hover:grayscale-0 transition-all cursor-pointer" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg" alt="Gemini" className="h-6 grayscale hover:grayscale-0 transition-all cursor-pointer" />
                </motion.div>
              </div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="flex-1 relative"
              >
                <div className="relative z-10 bg-white p-4 rounded-[2.5rem] shadow-2xl shadow-blue-100 border border-white">
                  <img 
                    src="/assets/ai_voice_caller_hero_light.png"
                    alt="AI Voice Interface Hero"
                    className="w-full h-auto rounded-[2rem] transition-transform duration-500 hover:scale-[1.02]"
                  />
                </div>
                {/* Floating UI Elements */}
                <motion.div 
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-10 -left-10 z-20"
                >
                   <GlassSurface className="p-4 bg-white/80 border-white shadow-xl rounded-2xl flex items-center gap-3">
                     <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold">✓</div>
                     <div>
                       <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Status</p>
                       <p className="text-sm font-bold">Call Successful</p>
                     </div>
                   </GlassSurface>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* --- STATS SECTION --- */}
        <section className="py-16 bg-white border-b border-slate-50">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
              {[
                { label: "Call Latency", val: "< 500ms" },
                { label: "Voice Realism", val: "99.9%" },
                { label: "Handling Cap", val: "100k+/hr" },
                { label: "Cost Savings", val: "85%" }
              ].map((stat, i) => (
                <div key={i}>
                  <p className="text-3xl font-black text-slate-900 mb-1">{stat.val}</p>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- ARCHITECTURE --- */}
        <section id="architecture" className="py-24 bg-[#f8fafc]">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-20">
              <div className="flex-1">
                <h2 className="text-4xl md:text-5xl font-extrabold mb-8 text-slate-900">Modular & Reliable Architecture</h2>
                <p className="text-slate-500 text-lg mb-12 leading-relaxed">
                  Our system is built on an event-driven modular framework, ensuring that even if one component 
                  experiences an issue, the conversation continues seamlessly using our three-tier fallback logic.
                </p>

                <div className="space-y-4">
                  {[
                    { title: "Amazon Polly Neural Engine", desc: "Industry-leading text-to-speech with localized accents.", icon: "🎙️" },
                    { title: "Hybrid Decision Engine", desc: "Smart logic that routes simple intents to our ultra-fast Rule Engine.", icon: "⚡" },
                    { title: "Global Webhook Handlers", desc: "Real-time bi-directional data flow for CRM integrations.", icon: "🔗" }
                  ].map((item, i) => (
                    <motion.div 
                      key={i} 
                      {...fadeIn} 
                      transition={{ delay: i * 0.1 }}
                      className="p-6 bg-white rounded-2xl border border-slate-100 flex gap-6 hover:shadow-lg transition-all cursor-default"
                    >
                      <div className="text-3xl">{item.icon}</div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-800">{item.title}</h4>
                        <p className="text-slate-500 text-sm">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div className="flex-1 bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 relative">
                 <div className="space-y-6">
                    <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100">
                       <div className="flex justify-between items-center mb-4">
                          <span className="text-xs font-black text-blue-400 uppercase tracking-tighter">Primary Intelligence</span>
                          <span className="px-2 py-1 bg-green-500 text-white text-[10px] font-bold rounded">ACTIVE</span>
                       </div>
                       <h4 className="text-xl font-black text-blue-900 mb-2">Gemini 2.0 Flash Live</h4>
                       <p className="text-blue-700/60 text-sm">Real-time context-aware conversational logic.</p>
                    </div>
                    <div className="flex items-center justify-center py-2">
                       <div className="h-8 w-px bg-slate-200" />
                    </div>
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 opacity-60">
                       <div className="flex justify-between items-center mb-4">
                          <span className="text-xs font-black text-slate-400 uppercase tracking-tighter">Fallback Tier 1</span>
                          <span className="px-2 py-1 bg-slate-200 text-slate-500 text-[10px] font-bold rounded">STANDBY</span>
                       </div>
                       <h4 className="text-xl font-black text-slate-400 mb-2">Mistral Small Latest</h4>
                       <p className="text-slate-400 text-sm">Cost-effective backup for predictable reliability.</p>
                    </div>
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 opacity-60">
                       <div className="flex justify-between items-center mb-4">
                          <span className="text-xs font-black text-slate-400 uppercase tracking-tighter">Fallback Tier 2</span>
                          <span className="px-2 py-1 bg-slate-200 text-slate-500 text-[10px] font-bold rounded">STANDBY</span>
                       </div>
                       <h4 className="text-xl font-black text-slate-400 mb-2">GPT-4o Mini</h4>
                       <p className="text-slate-400 text-sm">Third-tier resilience for complex edge cases.</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- USE CASES --- */}
        <section id="services" className="py-24">
          <div className="container mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-black mb-6 text-slate-900 leading-tight">Where Excellence Meets <br /> Automation</h2>
              <p className="text-slate-500 text-xl max-w-2xl mx-auto">
                AI Voice agents are transforming how industries communicate. From medical scheduling to real estate leads.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {useCases.map((useCase, i) => (
                <motion.div 
                  key={i} 
                  {...fadeIn} 
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-100 transition-all group"
                >
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-4xl mb-8 group-hover:scale-110 transition-transform">
                    {useCase.icon}
                  </div>
                  <h3 className="text-2xl font-black mb-4 text-slate-900 leading-tight">{useCase.title}</h3>
                  <p className="text-slate-500 mb-8 leading-relaxed italic text-sm">
                    "{useCase.description}"
                  </p>
                  <ul className="space-y-3 pt-6 border-t border-slate-50">
                    {useCase.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                        <CheckIcon size={16} className="text-blue-500" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* --- STEP BY STEP CALL FLOW --- */}
        <section id="flow" className="py-24 bg-slate-900 text-white overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-start mb-20 gap-8">
              <div>
                <h2 className="text-4xl md:text-6xl font-black mb-6">The Journey of a Call</h2>
                <p className="text-white/50 text-xl max-w-2xl">
                  End-to-end transparency. See exactly how our system handles an automated appointment reminder call 
                  from API request to final action.
                </p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-500 text-white font-bold h-16 px-10 rounded-2xl">View Detailed Flow</Button>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              {callFlowSteps.map((step, i) => (
                <div key={i} className="relative p-8 bg-white/5 rounded-[2.5rem] border border-white/10 hover:bg-white/10 transition-all group">
                   <div className="text-6xl font-black text-white/5 absolute top-4 right-8 select-none group-hover:text-blue-500/10 transition-colors">
                      {step.step}
                   </div>
                   <h4 className="text-2xl font-black mb-4">{step.title}</h4>
                   <p className="text-white/60 mb-8 text-sm leading-relaxed">{step.desc}</p>
                   <div className="mt-auto">
                      <div className="px-3 py-1.5 bg-black/40 rounded-lg font-mono text-[10px] text-blue-400 inline-block border border-white/5 italic">
                         {step.code}
                      </div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- API REFERENCE --- */}
        <section id="api" className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-20">
              <div className="flex-1">
                <div className="inline-block px-4 py-1.5 rounded-full border border-slate-100 bg-slate-50 text-slate-500 text-xs font-black mb-6">
                  API ENDPOINTS
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold mb-8">Integrated with <br /> Developer Workflows</h2>
                <p className="text-slate-500 text-lg mb-12">
                  Our RESTful API is designed for speed. Use simple endpoints to start calls, fetch histories, 
                  and receive bi-directional webhooks.
                </p>

                <div className="space-y-4">
                   {[
                     { method: "POST", url: "/v1/calls/start", desc: "Initiate a neural voice call instantly." },
                     { method: "GET", url: "/v1/calls/history", desc: "Fetch full conversation transcripts." },
                     { method: "POST", url: "/v1/webhooks/voice", desc: "Twilio webhook for real-time handling." },
                     { method: "GET", url: "/v1/health", desc: "Monitor system and engine status." }
                   ].map((endpoint, i) => (
                     <div key={i} className="flex items-center gap-6 p-4 rounded-xl border border-slate-50 hover:border-blue-100 transition-all hover:bg-blue-50/20 group">
                        <span className={`w-16 text-center font-bold text-xs py-1 rounded ${endpoint.method === "POST" ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"}`}>
                           {endpoint.method}
                        </span>
                        <code className="text-sm font-bold text-slate-800 flex-1">{endpoint.url}</code>
                        <span className="text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                           {endpoint.desc}
                        </span>
                     </div>
                   ))}
                </div>
              </div>

              <div className="flex-1">
                <div className="bg-slate-900 rounded-[2.5rem] p-4 shadow-2xl overflow-hidden shadow-blue-200">
                   <div className="flex gap-2 mb-4 px-4 pt-2">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                   </div>
                   <div className="p-4 font-mono text-sm overflow-x-auto">
                      <pre className="text-white/80">
                         <span className="text-purple-400">curl</span> -X POST <br />
                         &nbsp;&nbsp;<span className="text-blue-400">"https://api.uipirate.com/v1/calls/start"</span> \<br />
                         &nbsp;&nbsp;-H <span className="text-green-400">"Authorization: Bearer YOUR_TOKEN"</span> \<br />
                         &nbsp;&nbsp;-d <span className="text-yellow-400">'&#123; "to_phone": "+1931...", "context": "reminder" &#125;'</span>
                      </pre>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- COST CONSIDERATIONS --- */}
        <section className="py-24 bg-[#f8fafc] border-t border-slate-100">
           <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto bg-white rounded-[3rem] p-12 md:p-20 shadow-xl border border-slate-100 relative overflow-hidden text-center">
                 <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50 rounded-full blur-[60px] translate-x-1/2 -translate-y-1/2" />
                 <h2 className="text-4xl font-black mb-6">Predictable Costs. <br /> Premium Value.</h2>
                 <p className="text-slate-500 text-lg mb-12">
                    Transparent pricing from Twilio, Amazon Polly, and major LLM providers. <br />
                    We take exactly <span className="text-blue-600 font-black">0% margin</span> on infrastructure.
                 </p>
                 <div className="flex justify-center flex-wrap gap-x-12 gap-y-6">
                    <div className="text-center">
                       <p className="text-2xl font-black mb-1 text-slate-800">$0.00</p>
                       <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Setup Fee</p>
                    </div>
                    <div className="h-10 w-px bg-slate-100 hidden md:block" />
                    <div className="text-center">
                       <p className="text-2xl font-black mb-1 text-slate-800">$0.01/min</p>
                       <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Voice & Connectivity</p>
                    </div>
                    <div className="h-10 w-px bg-slate-100 hidden md:block" />
                    <div className="text-center">
                       <p className="text-2xl font-black mb-1 text-slate-800">0.003¢</p>
                       <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">AI Inference / Token</p>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* --- FINAL CTA --- */}
        <section className="py-32 relative overflow-hidden bg-white">
           <div className="container mx-auto px-6 relative z-10 text-center">
              <h2 className="text-5xl md:text-7xl font-black mb-12 tracking-tight">Experience Voice <br /> Intelligence.</h2>
              <div className="flex justify-center gap-6 flex-col sm:flex-row">
                 <Button className="bg-slate-900 text-white font-black h-16 px-12 rounded-2xl text-lg hover:bg-slate-800 transition-all hover:scale-105">Get Free API Key</Button>
                 <Button className="bg-blue-600 text-white font-black h-16 px-12 rounded-2xl text-lg hover:bg-blue-700 transition-all hover:scale-105">Talk to Sales</Button>
              </div>
              <p className="mt-12 text-slate-400 font-bold text-sm tracking-widest uppercase">No credit card required for testing</p>
           </div>
        </section>

      </div>
    </PageWrapper>
  );
};

export default AICallingScreen;
