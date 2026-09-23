"use client";

import { motion } from "framer-motion";

// 1. Full-Stack Development, Idea to Production (Frontend, API, & Database Stack)
export const VisualFullStackNew = () => {
  return (
    <div className="w-full h-full bg-gradient-to-tr from-gray-50 to-gray-100 flex items-center justify-center p-6 relative overflow-hidden select-none">
      <div className="relative w-[220px] h-[170px] flex flex-col items-center justify-between z-10">
        {/* Central Data & Energy Pipeline */}
        <div className="absolute top-4 bottom-4 left-1/2 -translate-x-1/2 w-[2px] bg-gray-200 z-0" />
        <motion.div
          animate={{
            top: ["0%", "75%", "0%"],
            height: ["15%", "25%", "15%"],
            opacity: [0.6, 1, 0.6],
          }}
          className="absolute left-1/2 -translate-x-1/2 w-[2px] bg-[#ff5b04] shadow-[0_0_10px_#ff5e00] z-0"
          transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Tier 1: Client / Frontend Layer */}
        <motion.div
          animate={{ y: [-2, 2, -2] }}
          className="w-[196px] h-[40px] bg-white rounded-xl border border-gray-200/90 shadow-[0_4px_16px_rgba(0,0,0,0.04)] flex items-center justify-between px-3 z-10"
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="flex items-center gap-1.5">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#ff5f56]" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#ffbd2e]" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#27c93f]" />
            </div>
            <span className="text-[9.5px] font-semibold text-gray-800 ml-1">
              Client UI
            </span>
          </div>
          <div className="px-2 py-0.5 bg-orange-500/10 rounded-md border border-orange-200/50 text-[8px] font-semibold text-[#ff5b04]">
            Next.js / React
          </div>
        </motion.div>

        {/* Tier 2: Backend API & Service Layer */}
        <motion.div
          animate={{ scale: [1, 1.02, 1] }}
          className="w-[214px] h-[46px] bg-white rounded-xl border-2 border-orange-200 shadow-[0_6px_20px_rgba(255,91,4,0.08)] flex items-center justify-between px-3 z-10"
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        >
          <div className="flex items-center gap-2">
            <div className="px-1.5 py-0.5 bg-gray-900 text-white text-[8px] font-mono font-bold rounded">
              API
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-mono font-semibold text-gray-800">
                POST /api/v1
              </span>
              <span className="text-[7.5px] text-gray-400">Node.js · Python</span>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded-full border border-emerald-200 text-[8px] font-bold">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            200 OK
          </div>
        </motion.div>

        {/* Tier 3: Database & Cache Layer */}
        <motion.div
          animate={{ y: [2, -2, 2] }}
          className="w-[196px] h-[40px] bg-white rounded-xl border border-gray-200/90 shadow-[0_4px_16px_rgba(0,0,0,0.04)] flex items-center justify-between px-3 z-10"
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg bg-orange-50 flex items-center justify-center border border-orange-200/60">
              <svg
                className="w-3 h-3 text-[#ff5b04]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <ellipse cx="12" cy="5" rx="9" ry="3" />
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
              </svg>
            </div>
            <span className="text-[9.5px] font-semibold text-gray-800">
              Data & Cache
            </span>
          </div>
          <span className="text-[8px] font-mono text-gray-400">
            PostgreSQL · Redis
          </span>
        </motion.div>
      </div>

    </div>
  );
};

// 2. AI Models & API Integrations (AI Hub, RAG, & External Services)
export const VisualAILLMNew = () => {
  return (
    <div className="w-full h-full bg-gradient-to-tr from-gray-50 to-gray-100 flex items-center justify-center p-6 relative overflow-hidden select-none">
      <div className="relative w-[250px] h-[170px] flex items-center justify-center">
        {/* Animated Connecting SVG Paths */}
        <svg
          className="absolute inset-0 w-full h-full z-0"
          pointerEvents="none"
          viewBox="0 0 250 170"
        >
          {/* Path to Node 1 (Vector DB - Top Left) */}
          <path
            d="M 125 85 L 50 42"
            fill="none"
            stroke="#e2e8f0"
            strokeDasharray="4 4"
            strokeWidth="2"
          />
          <motion.path
            animate={{ strokeDashoffset: [20, 0] }}
            d="M 125 85 L 50 42"
            fill="none"
            stroke="#ff5b04"
            strokeDasharray="4 4"
            strokeWidth="2"
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          />

          {/* Path to Node 2 (Auth / SSO - Top Right) */}
          <path
            d="M 125 85 L 200 42"
            fill="none"
            stroke="#e2e8f0"
            strokeDasharray="4 4"
            strokeWidth="2"
          />
          <motion.path
            animate={{ strokeDashoffset: [0, 20] }}
            d="M 125 85 L 200 42"
            fill="none"
            stroke="#ff5b04"
            strokeDasharray="4 4"
            strokeWidth="2"
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          />

          {/* Path to Node 3 (APIs & Stripe - Bottom) */}
          <path
            d="M 125 85 L 125 142"
            fill="none"
            stroke="#e2e8f0"
            strokeDasharray="4 4"
            strokeWidth="2"
          />
          <motion.path
            animate={{ strokeDashoffset: [20, 0] }}
            d="M 125 85 L 125 142"
            fill="none"
            stroke="#10b981"
            strokeDasharray="4 4"
            strokeWidth="2"
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          />
        </svg>

        {/* Central AI Orchestration Core */}
        <div className="relative z-20">
          <motion.div
            animate={{ scale: [1, 1.22, 1], opacity: [0.35, 0.7, 0.35] }}
            className="absolute -inset-1.5 rounded-2xl bg-[#ff5b04]/20 blur-sm pointer-events-none"
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="w-[74px] h-[74px] bg-white rounded-2xl border-2 border-orange-200/90 shadow-[0_8px_24px_rgba(255,91,4,0.12)] flex flex-col items-center justify-center p-1.5 relative">
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-200/50 mb-0.5">
              <svg
                className="w-4 h-4 text-[#ff5b04]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <span className="text-[8.5px] font-bold text-gray-900 tracking-tight">
              AI Core
            </span>
            <span className="text-[7px] text-[#ff5b04] font-semibold">
              RAG Engine
            </span>
          </div>
        </div>

        {/* Node 1: Vector DB / Data (Top Left) */}
        <motion.div
          animate={{ y: [-2, 2, -2] }}
          className="absolute top-[16px] left-[20px] bg-white px-2.5 py-1.5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-1.5 z-10"
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-4 h-4 rounded-md bg-orange-50 flex items-center justify-center border border-orange-200/50">
            <svg
              className="w-2.5 h-2.5 text-[#ff5b04]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" />
            </svg>
          </div>
          <span className="text-[8.5px] font-bold text-gray-700">Vector DB</span>
        </motion.div>

        {/* Node 2: Auth / Identity (Top Right) */}
        <motion.div
          animate={{ y: [2, -2, 2] }}
          className="absolute top-[16px] right-[20px] bg-white px-2.5 py-1.5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-1.5 z-10"
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <div className="w-4 h-4 rounded-md bg-gray-100 flex items-center justify-center border border-gray-200">
            <svg
              className="w-2.5 h-2.5 text-gray-700"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <rect height="11" rx="2" ry="2" width="18" x="3" y="11" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
          <span className="text-[8.5px] font-bold text-gray-700">Auth & SSO</span>
        </motion.div>

        {/* Node 3: Stripe / Webhook APIs (Bottom) */}
        <motion.div
          animate={{ y: [-2, 2, -2] }}
          className="absolute bottom-[10px] left-1/2 -translate-x-1/2 bg-white px-2.5 py-1.5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-1.5 z-10"
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <div className="w-4 h-4 rounded-md bg-emerald-50 flex items-center justify-center border border-emerald-200/50">
            <svg
              className="w-2.5 h-2.5 text-emerald-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <rect height="14" rx="2" width="20" x="2" y="5" />
              <line x1="2" x2="22" y1="10" y2="10" />
            </svg>
          </div>
          <span className="text-[8.5px] font-bold text-gray-700">
            Stripe & APIs
          </span>
        </motion.div>
      </div>

    </div>
  );
};

// 3. Cloud Deployment & Scaling (Load Balancer & Auto-Scaling Instances)
export const VisualCloudNew = () => {
  return (
    <div className="w-full h-full bg-gradient-to-tr from-gray-50 to-gray-100 flex items-center justify-center p-6 relative overflow-hidden select-none">
      <div className="relative w-[240px] h-[170px] flex flex-col items-center justify-between z-10">
        {/* Load Balancer / Ingress Router */}
        <motion.div
          animate={{ y: [-2, 2, -2] }}
          className="w-[170px] h-[36px] bg-white rounded-xl border border-gray-200 shadow-sm flex items-center justify-between px-3 z-20"
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#ff5b04] animate-pulse" />
            <span className="text-[9px] font-bold text-gray-800">
              Cloud Load Balancer
            </span>
          </div>
          <span className="text-[8px] font-mono font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/50">
            Active
          </span>
        </motion.div>

        {/* Traffic Pulse Stream from Load Balancer down to Instances */}
        <svg
          className="absolute top-[36px] left-0 w-full h-[54px] z-0"
          pointerEvents="none"
          viewBox="0 0 240 54"
        >
          <path
            d="M 120 0 L 52 54"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="1.5"
          />
          <path
            d="M 120 0 L 120 54"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="1.5"
          />
          <path
            d="M 120 0 L 188 54"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="1.5"
          />

          <motion.circle
            animate={{ cx: [120, 52], cy: [0, 54], opacity: [0, 1, 0] }}
            fill="#ff5b04"
            r="2.5"
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.circle
            animate={{ cx: [120, 120], cy: [0, 54], opacity: [0, 1, 0] }}
            fill="#10b981"
            r="2.5"
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
          <motion.circle
            animate={{ cx: [120, 188], cy: [0, 54], opacity: [0, 1, 0] }}
            fill="#ff5b04"
            r="2.5"
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.0,
            }}
          />
        </svg>

        {/* Server Instances */}
        <div className="flex items-center justify-center gap-2.5 mt-auto z-10">
          {/* Instance 1 */}
          <div className="w-[66px] h-[72px] bg-white rounded-xl border border-gray-200 shadow-sm p-2 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[7.5px] font-mono text-gray-400">Node-01</span>
            </div>
            <div className="space-y-1">
              <div className="w-full h-1 bg-gray-100 rounded" />
              <div className="w-3/4 h-1 bg-gray-100 rounded" />
            </div>
            <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: ["30%", "65%", "30%"] }}
                className="h-full bg-emerald-500 rounded-full"
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>

          {/* Instance 2: Primary with Orange Highlight */}
          <div className="w-[72px] h-[78px] bg-white rounded-xl border-2 border-orange-200 shadow-[0_6px_20px_rgba(255,91,4,0.09)] p-2 flex flex-col justify-between relative -mt-1.5">
            <div className="flex items-center justify-between">
              <div className="w-2 h-2 rounded-full bg-[#ff5b04] animate-pulse" />
              <span className="text-[8px] font-mono font-bold text-gray-700">
                Primary
              </span>
            </div>
            <div className="space-y-1">
              <div className="w-full h-1.5 bg-orange-50 rounded border border-orange-100" />
              <div className="w-4/5 h-1.5 bg-gray-100 rounded" />
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: ["50%", "85%", "50%"] }}
                className="h-full bg-[#ff5b04] rounded-full"
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>

          {/* Instance 3: Auto-Scaling Node */}
          <motion.div
            animate={{
              opacity: [0.4, 1, 1, 0.4],
              scale: [0.94, 1, 1, 0.94],
            }}
            className="w-[66px] h-[72px] bg-white rounded-xl border border-gray-200 shadow-sm p-2 flex flex-col justify-between relative"
            transition={{
              duration: 5,
              repeat: Infinity,
              times: [0, 0.3, 0.7, 1],
              ease: "easeInOut",
            }}
          >
            <div className="flex items-center justify-between">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[7.5px] font-mono text-gray-400">Node-02</span>
            </div>
            <div className="space-y-1">
              <div className="w-full h-1 bg-gray-100 rounded" />
              <div className="w-3/4 h-1 bg-gray-100 rounded" />
            </div>
            <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
              <div className="w-2/3 h-full bg-emerald-500 rounded-full" />
            </div>
          </motion.div>
        </div>
      </div>

    </div>
  );
};

// 4. AI-Generated Code, Production-Ready (IDE Refactoring & Production Scanner)
export const VisualAiCodeNew = () => {
  return (
    <div className="w-full h-full bg-gradient-to-tr from-gray-50 to-gray-100 flex items-center justify-center p-6 relative overflow-hidden select-none">
      {/* IDE Code Editor Window */}
      <div className="w-[238px] h-[168px] bg-white rounded-xl shadow-[0_10px_28px_rgba(0,0,0,0.06)] border border-gray-200/80 flex flex-col overflow-hidden relative z-10">
        {/* Editor Chrome Bar */}
        <div className="w-full h-7 bg-gray-50/90 border-b border-gray-100 flex items-center justify-between px-3 flex-shrink-0">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#ff5f56]" />
            <div className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
            <div className="w-2 h-2 rounded-full bg-[#27c93f]" />
          </div>
          <div className="px-2 py-0.5 bg-white rounded border border-gray-200/60 text-[8.5px] font-mono text-gray-600 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff5b04]" />
            production.ts
          </div>
          <div className="text-[8px] font-semibold text-emerald-600">TypeScript</div>
        </div>

        {/* Code Lines Body */}
        <div className="flex-1 p-3 font-mono text-[9px] flex flex-col justify-between bg-white relative overflow-hidden">
          {/* Line 1 */}
          <div className="flex items-center gap-2">
            <span className="text-gray-300 w-3">1</span>
            <span className="text-[#ff5b04] font-semibold">export async</span>
            <span className="text-gray-800 font-semibold">function POST</span>
            <span className="text-gray-400">() {"{"}</span>
          </div>

          {/* Line 2: Security & Validation */}
          <div className="flex items-center gap-2 pl-3">
            <span className="text-gray-300 w-3">2</span>
            <span className="text-gray-400">// validate & auth</span>
            <div className="w-10 h-2 bg-orange-50 rounded border border-orange-200/60" />
          </div>

          {/* Line 3: Scalable Service Call */}
          <div className="flex items-center gap-2 pl-3">
            <span className="text-gray-300 w-3">3</span>
            <span className="text-[#ff5b04]">const</span>
            <span className="text-gray-700">res = await</span>
            <span className="text-gray-900 font-bold">service.run()</span>
          </div>

          {/* Line 4: Clean Architecture */}
          <div className="flex items-center gap-2 pl-3">
            <span className="text-gray-300 w-3">4</span>
            <div className="w-16 h-2 bg-gray-100 rounded" />
            <div className="w-8 h-2 bg-emerald-50 rounded border border-emerald-200/60" />
          </div>

          {/* Line 5: Return Status */}
          <div className="flex items-center gap-2">
            <span className="text-gray-300 w-3">5</span>
            <span className="text-[#ff5b04] font-semibold">return</span>
            <span className="text-emerald-600 font-bold">Status.OK(200)</span>
            <span className="text-gray-400">{"}"}</span>
          </div>

          {/* Scanning Refactoring Laser */}
          <motion.div
            animate={{ top: ["-10%", "110%", "-10%"] }}
            className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff5b04] to-transparent z-20 shadow-[0_0_12px_#ff5e00]"
            initial={{ top: "-10%" }}
            transition={{ duration: 3.8, ease: "easeInOut", repeat: Infinity }}
          >
            <div className="absolute inset-x-0 h-8 -top-8 bg-gradient-to-t from-[#ff5b04]/20 via-[#ff5b04]/5 to-transparent pointer-events-none" />
          </motion.div>
        </div>
      </div>

    </div>
  );
};
