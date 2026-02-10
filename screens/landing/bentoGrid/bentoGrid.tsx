"use client";

import { motion } from "framer-motion";
import AnimatedAnalyticsChart from "./AnimatedAnalyticsChart";

// Animation variants for bento cards - smooth and buttery
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1], // Custom ease-out expo for smooth deceleration
    },
  }),
};

const BentoGrid = () => {
  return (
    <>
      <div className="container mx-auto pt-2 max-md:pt-6">
        {/* Bento Grid */}
        <div className="px-32 lg:px-20 max-md:px-4 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
            {/* UX/UI Design Card - Tall */}
            <motion.div
              className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl  border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 md:row-span-2 group overflow-hidden"
              custom={0}
              initial="hidden"
              variants={cardVariants}
              viewport={{ once: true, amount: 0.3 }}
              whileInView="visible"
            >
              <div className="h-full flex flex-col justify-between">
                {/* Chart Visualization */}
                <div className="flex-1 -mb-6 relative px-0 ">
                  <img
                    alt="UX/UI Design"
                    className="w-full h-full object-cover mt-0 -z-10"
                    src="/assets/img/bento1.svg"
                  />
                </div>

                {/* Content */}
                <div className="p-6 -mt-56 z-10">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 ">
                    UX/UI Design
                  </h3>
                  <p className="text-gray-600 font-medium">
                    User-centric interfaces that convert. We craft pixel-perfect
                    experiences
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Frontend Development Card */}
            <motion.div
              className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 group h-[295px] overflow-hidden"
              custom={1}
              initial="hidden"
              variants={cardVariants}
              viewport={{ once: true, amount: 0.3 }}
              whileInView="visible"
            >
              <div className="h-full flex flex-col">
                <div className="flex-1 mb-2 overflow-hidden">
                  {/* Code Window */}
                  <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-700/50 relative h-full">
                    {/* Window Header */}
                    <div className="bg-gray-800/80 backdrop-blur-xl px-3 py-1.5 flex items-center gap-2 border-b border-gray-700/50 rounded-t-2xl">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-red-500/90" />
                        <div className="w-2 h-2 rounded-full bg-yellow-500/90" />
                        <div className="w-2 h-2 rounded-full bg-green-500/90" />
                      </div>
                      <div className="flex-1 text-center">
                        <span className="text-[10px] text-gray-400 font-mono">
                          App.tsx
                        </span>
                      </div>
                    </div>

                    {/* Code Content */}
                    <div className="p-3 font-mono text-[11px] leading-relaxed rounded-2xl">
                      <pre className="text-gray-300">
                        <code>
                          <span className="text-purple-400">const</span>{" "}
                          <span className="text-blue-300">App</span>{" "}
                          <span className="text-gray-300">=</span>{" "}
                          <span className="text-yellow-300">{"() =>"}</span>{" "}
                          <span className="text-gray-300">{"{"}</span>
                          {"\n"}
                          {"  "}
                          <span className="text-purple-400">return</span>{" "}
                          <span className="text-gray-300">(</span>
                          {"\n"}
                          {"    "}
                          <span className="text-green-400">
                            {"<motion.div>"}
                          </span>
                          {"\n"}
                          {"      "}
                          <span className="text-orange-300">
                            "Perfect happens here"
                          </span>
                          {"\n"}
                          {"    "}
                          <span className="text-green-400">
                            {"</motion.div>"}
                          </span>
                          {"\n"}
                          {"  "}
                          <span className="text-gray-300">);</span>
                          {"\n"}
                          <span className="text-gray-300">{"}"}</span>
                        </code>
                      </pre>
                    </div>

                    {/* Gradient Fade Overlay on Code - Stronger */}
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent pointer-events-none" />
                  </div>
                </div>

                {/* Content */}
                <div className="text-left">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    Frontend Development
                  </h3>
                  <p className="text-gray-600 font-medium">
                    Robust Angular.js & Next.js architecture
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Dashboards & SaaS UX Card */}
            <motion.div
              className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 group h-[295px] overflow-hidden"
              custom={2}
              initial="hidden"
              variants={cardVariants}
              viewport={{ once: true, amount: 0.3 }}
              whileInView="visible"
            >
              <div className="h-full flex flex-col">
                <div className="flex-1 mb-2 overflow-hidden">
                  {/* Dashboard Mockup */}
                  <div className="bg-white rounded-xl p-2.5 border border-gray-200/50 shadow-lg">
                    {/* Top Bar - Navigation */}
                    <div className="flex items-center justify-between mb-1.5 pb-1.5 border-b border-gray-100">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-gradient-to-br from-blue-500 to-blue-600" />
                        <div className="w-10 h-1 bg-gray-200 rounded-full" />
                      </div>
                      <div className="flex gap-0.5">
                        <div className="w-3 h-3 rounded-full bg-gray-100" />
                        <div className="w-3 h-3 rounded-full bg-gradient-to-br from-orange-400 to-orange-500" />
                      </div>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-3 gap-1 mb-1.5">
                      {/* Revenue Card */}
                      <div className="bg-gradient-to-br from-blue-50 via-blue-50/50 to-white rounded-md p-1.5 border border-blue-100/50 relative">
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-[6px] text-blue-600/70 font-semibold uppercase">
                            REV
                          </div>
                          <div className="flex items-center gap-0.5">
                            <div className="text-[6px] font-semibold text-green-600">
                              ↑12%
                            </div>
                          </div>
                        </div>
                        <div className="text-xs font-bold text-gray-900">
                          $54k
                        </div>
                        {/* Dollar Sign SVG */}
                        <svg
                          className="absolute bottom-1 right-1 w-3 h-3 opacity-20"
                          fill="none"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            className="text-blue-500"
                            d="M12 2V22M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                          />
                        </svg>
                      </div>

                      {/* Active Users Card */}
                      <div className="bg-gradient-to-br from-purple-50 via-purple-50/50 to-white rounded-md p-1.5 border border-purple-100/50 relative">
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-[6px] text-purple-600/70 font-semibold uppercase">
                            USR
                          </div>
                          <div className="flex items-center gap-0.5">
                            <div className="text-[6px] font-semibold text-green-600">
                              ↑8%
                            </div>
                          </div>
                        </div>
                        <div className="text-xs font-bold text-gray-900">
                          12.8k
                        </div>
                        {/* Users SVG */}
                        <svg
                          className="absolute bottom-1 right-1 w-3 h-3 opacity-20"
                          fill="none"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            className="text-purple-500"
                            d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.3503 17.623 3.8507 18.1676 4.55231C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                          />
                        </svg>
                      </div>

                      {/* Conversion Card */}
                      <div className="bg-gradient-to-br from-orange-50 via-orange-50/50 to-white rounded-md p-1.5 border border-orange-100/50 relative">
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-[6px] text-orange-600/70 font-semibold uppercase">
                            CVR
                          </div>
                          <div className="flex items-center gap-0.5">
                            <div className="text-[6px] font-semibold text-red-600">
                              ↓0.3%
                            </div>
                          </div>
                        </div>
                        <div className="text-xs font-bold text-gray-900">
                          3.2%
                        </div>
                        {/* Target/Conversion SVG */}
                        <svg
                          className="absolute bottom-1 right-1 w-3 h-3 opacity-20"
                          fill="none"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            className="text-orange-500"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <circle
                            className="text-orange-500"
                            cx="12"
                            cy="12"
                            r="6"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <circle
                            className="text-orange-500"
                            cx="12"
                            cy="12"
                            fill="currentColor"
                            r="2"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Analytics Chart */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-50/30 rounded-md p-1.5 mb-1.5 border border-gray-100">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1">
                          {/* Analytics Icon */}
                          <svg
                            className="w-2 h-2 text-gray-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M3 3V21H21"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                            />
                            <path
                              d="M7 16L12 11L16 15L21 10"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                            />
                            <circle
                              cx="7"
                              cy="16"
                              fill="currentColor"
                              r="1.5"
                            />
                            <circle
                              cx="12"
                              cy="11"
                              fill="currentColor"
                              r="1.5"
                            />
                            <circle
                              cx="16"
                              cy="15"
                              fill="currentColor"
                              r="1.5"
                            />
                            <circle
                              cx="21"
                              cy="10"
                              fill="currentColor"
                              r="1.5"
                            />
                          </svg>
                          <div className="text-[7px] font-semibold text-gray-700">
                            Analytics
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          <div className="px-1 py-0.5 bg-white rounded text-[5px] text-gray-600 border border-gray-200">
                            7D
                          </div>
                          <div className="px-1 py-0.5 bg-blue-500 rounded text-[5px] text-white">
                            30D
                          </div>
                        </div>
                      </div>
                      <div className="relative h-12 mt-1">
                        {/* Animated Area Chart with Gradient Fill */}
                        <AnimatedAnalyticsChart />
                      </div>
                    </div>

                    {/* Recent Activity Table */}
                    <div className="space-y-0.5">
                      <div className="text-[7px] font-semibold text-gray-700 mb-0.5">
                        Activity
                      </div>
                      {[
                        {
                          color: "from-blue-400 to-blue-500",
                          progress: 85,
                          status: "from-green-400 to-green-500",
                        },
                        {
                          color: "from-purple-400 to-purple-500",
                          progress: 60,
                          status: "from-yellow-400 to-yellow-500",
                        },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-1 p-1 rounded-md"
                        >
                          <div
                            className={`w-4 h-4 rounded bg-gradient-to-br ${item.color} flex items-center justify-center`}
                          >
                            <div className="w-1.5 h-1.5 bg-white/30 rounded" />
                          </div>
                          <div className="flex-1">
                            <div className="h-0.5 bg-gray-200 rounded-full mb-0.5 w-3/4" />
                            <div className="h-0.5 bg-gray-100 rounded-full w-1/2" />
                          </div>
                          <div className="flex items-center gap-0.5">
                            <div className="w-8 h-1 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full bg-gradient-to-r ${item.status}`}
                                style={{ width: `${item.progress}%` }}
                              />
                            </div>
                            <div
                              className={`w-1 h-1 rounded-full bg-gradient-to-br ${item.status}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="text-left">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    Dashboards & SaaS UX
                  </h3>
                  <p className="text-gray-600 font-medium">
                    Clean and data-driven
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Websites & Landing Pages Card */}
            <motion.div
              className="rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden relative h-[295px]"
              custom={3}
              initial="hidden"
              style={{
                background:
                  "linear-gradient(184deg, rgba(255, 255, 255, 0.00) 30%, #FFF 70%), linear-gradient(90deg, rgba(255, 231, 187, 0.50) 0.07%, rgba(228, 227, 123, 0.50) 40.93%, rgba(194, 239, 242, 0.50) 97.76%), #FFF",
              }}
              variants={cardVariants}
              viewport={{ once: true, amount: 0.3 }}
              whileInView="visible"
            >
              <div className="h-full flex flex-col relative">
                {/* White Gradient Overlay */}
                <div
                  className="absolute inset-0 pointer-events-none z-10 "
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.7) 60%, rgba(255, 255, 255, 0.9) 80%, rgba(255, 255, 255, 1) 95%)",
                  }}
                />
                {/* Website Preview Mockup */}
                <div className="flex-1 mb-1 relative flex items-center justify-center">
                  {/* Main Website Card - White Background with Padding */}
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl  border border-gray-200/50 shadow-xl w-[280px]">
                    {/* Gray Content Area */}
                    <div className="bg-gray-100/60 rounded-lg p-2">
                      {/* Header with Logo and Menu */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-10 h-2 bg-gray-300/60 rounded-full" />
                        <div className="flex flex-col gap-0.5">
                          <div className="w-3 h-0.5 bg-gray-300/60 rounded" />
                          <div className="w-3 h-0.5 bg-gray-300/60 rounded" />
                          <div className="w-3 h-0.5 bg-gray-300/60 rounded" />
                        </div>
                      </div>

                      {/* Hero Image and Text Section */}
                      <div className="flex gap-2 mb-2">
                        {/* Large Image Placeholder */}
                        <div className="flex-1 bg-gray-200/70 rounded-lg h-12 flex items-center justify-center relative overflow-hidden">
                          {/* Mountain Icon */}
                          <svg
                            className="w-8 h-8 text-gray-400/40"
                            fill="currentColor"
                            viewBox="0 0 64 64"
                          >
                            <path
                              d="M4 48 L24 20 L36 36 L60 8 L60 48 Z"
                              opacity="0.6"
                            />
                            <circle cx="48" cy="20" opacity="0.4" r="6" />
                          </svg>
                        </div>

                        {/* Text Lines */}
                        <div className="flex-1 space-y-1 pt-0.5">
                          <div className="w-full h-1.5 bg-gray-300/60 rounded-full" />
                          <div className="w-3/4 h-1.5 bg-gray-300/60 rounded-full" />
                        </div>
                      </div>

                      {/* Text Lines Below Image */}
                      <div className="space-y-1 mb-2">
                        <div className="w-full h-1.5 bg-gray-300/60 rounded-full" />
                        <div className="w-2/3 h-1.5 bg-gray-300/60 rounded-full" />
                      </div>

                      {/* Product Cards Row */}
                      <div className="grid grid-cols-3 gap-1.5">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="bg-white/80 rounded-md p-1.5 space-y-1"
                          >
                            <div className="w-full h-6 bg-gray-200/60 rounded-sm" />
                            <div className="w-full h-1 bg-gray-200/60 rounded-full" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Floating Mobile Mockup */}
                  <div className="absolute bottom-0 right-8 bg-white rounded-[14px] p-2 pb-4 shadow-xl border border-gray-200/50 w-20">
                    {/* Gray Content Area */}
                    <div className="bg-gray-100/60 rounded-lg p-1.5 space-y-1.5">
                      {/* Profile Image Card */}
                      <div className="bg-gray-200/70 rounded-lg h-11 flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-gray-400/50"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <circle cx="12" cy="9" r="4" />
                          <path d="M4 20 C4 16 7 14 12 14 C17 14 20 16 20 20" />
                        </svg>
                      </div>
                      {/* Text Line */}
                      <div className="w-full h-1 bg-gray-300/60 rounded-full" />
                      {/* Orange Button */}
                      <div className="w-full h-3 bg-orange-500 rounded-full shadow-lg" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-20 text-left">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    Websites & Landing Pages
                  </h3>
                  <p className="text-gray-600 font-medium">
                    Fast, conversion-focused sites
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Built With the Best Card */}
            <motion.div
              className="bg-gradient-to-br from-white to-gray-50 rounded-2xl pt-8 pb-0 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 group h-[295px] overflow-hidden"
              custom={4}
              initial="hidden"
              variants={cardVariants}
              viewport={{ once: true, amount: 0.3 }}
              whileInView="visible"
            >
              <div className="h-full flex flex-col">
                {/* Content */}
                <div className="mb-4 px-8 text-left">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Built With the Best
                  </h3>
                  <p className="text-gray-600 font-medium">
                    Figma, React, Angular, Blender & more.
                  </p>
                </div>

                {/* Concentric Circles with Tech Icons */}
                <div className="flex-1 flex items-end justify-end relative pb-6 pt-2 pr-0 ">
                  {/* Concentric Circles with Gradients and Shadows - Rotating */}
                  <div className="relative flex items-center justify-center">
                    {/* Outer Circle - Largest - Slow rotation */}
                    <div className="w-96 h-96 rounded-full absolute bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/10 shadow-[0_0_40px_rgba(59,130,246,0.1)] animate-[spin_20s_linear_infinite]" />

                    {/* Middle Circle - Medium rotation (reverse) */}
                    <div className="w-72 h-72 rounded-full absolute bg-gradient-to-br from-blue-100/40 via-purple-100/30 to-pink-100/20 shadow-[0_0_30px_rgba(139,92,246,0.15)] animate-[spin_15s_linear_infinite_reverse]" />

                    {/* Inner Circle - Faster rotation */}
                    <div className="w-48 h-48 rounded-full absolute bg-gradient-to-br from-blue-200/50 via-purple-200/40 to-pink-200/30 shadow-[0_0_20px_rgba(168,85,247,0.2)] animate-[spin_10s_linear_infinite]" />

                    {/* Center Circle - Fastest rotation (reverse) */}
                    <div className="w-24 h-24 rounded-full absolute bg-gradient-to-br from-blue-400/60 via-purple-400/50 to-pink-400/40 shadow-[0_0_15px_rgba(147,51,234,0.3)] animate-[spin_8s_linear_infinite_reverse]" />

                    {/* Tech Stack Icons positioned on different circle layers - Revolving */}
                    <div className="relative w-96 h-96 animate-[spin_25s_linear_infinite]">
                      {/* OUTER CIRCLE - 8 icons (Perfect Octagon - 45° spacing) */}
                      {/* React */}
                      <div className="absolute top-[0%] left-[50%] -translate-x-1/2 animate-[spin_25s_linear_infinite_reverse]">
                        <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all duration-500 hover:scale-125 hover:shadow-xl">
                          <img
                            alt="React"
                            className="w-8 h-8 object-contain"
                            src="/assets/logos/react.svg"
                          />
                        </div>
                      </div>

                      {/* Next.js */}
                      <div className="absolute top-[15%] right-[15%] animate-[spin_25s_linear_infinite_reverse]">
                        <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all duration-500 hover:scale-125 hover:shadow-xl">
                          <img
                            alt="Next.js"
                            className="w-8 h-8 object-contain"
                            src="/assets/logos/next js.svg"
                          />
                        </div>
                      </div>

                      {/* TypeScript */}
                      <div className="absolute top-[50%] right-[0%] -translate-y-1/2 animate-[spin_25s_linear_infinite_reverse]">
                        <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all duration-500 hover:scale-125 hover:shadow-xl">
                          <img
                            alt="TypeScript"
                            className="w-8 h-8 object-contain"
                            src="/assets/logos/typescript.svg"
                          />
                        </div>
                      </div>

                      {/* Tailwind CSS */}
                      <div className="absolute bottom-[15%] right-[15%] animate-[spin_25s_linear_infinite_reverse]">
                        <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all duration-500 hover:scale-125 hover:shadow-xl">
                          <img
                            alt="Tailwind CSS"
                            className="w-8 h-8 object-contain"
                            src="/assets/logos/tailwind.svg"
                          />
                        </div>
                      </div>

                      {/* Figma */}
                      <div className="absolute bottom-[0%] left-[50%] -translate-x-1/2 animate-[spin_25s_linear_infinite_reverse]">
                        <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all duration-500 hover:scale-125 hover:shadow-xl">
                          <img
                            alt="Figma"
                            className="w-8 h-8 object-contain"
                            src="/assets/logos/figma.svg"
                          />
                        </div>
                      </div>

                      {/* Framer */}
                      <div className="absolute bottom-[15%] left-[15%] animate-[spin_25s_linear_infinite_reverse]">
                        <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all duration-500 hover:scale-125 hover:shadow-xl">
                          <img
                            alt="Framer"
                            className="w-8 h-8 object-contain"
                            src="/assets/logos/framer.svg"
                          />
                        </div>
                      </div>

                      {/* GSAP */}
                      <div className="absolute top-[50%] left-[0%] -translate-y-1/2 animate-[spin_25s_linear_infinite_reverse]">
                        <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all duration-500 hover:scale-125 hover:shadow-xl">
                          <img
                            alt="GSAP"
                            className="w-8 h-8 object-contain"
                            src="/assets/logos/gsap.svg"
                          />
                        </div>
                      </div>

                      {/* Vercel */}
                      <div className="absolute top-[15%] left-[15%] animate-[spin_25s_linear_infinite_reverse]">
                        <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all duration-500 hover:scale-125 hover:shadow-xl">
                          <img
                            alt="Vercel"
                            className="w-8 h-8 object-contain"
                            src="/assets/logos/vercel.svg"
                          />
                        </div>
                      </div>

                      {/* MIDDLE CIRCLE - 6 icons (Perfect Hexagon - 60° spacing) */}
                      {/* Angular */}
                      <div className="absolute top-[18%] left-[50%] -translate-x-1/2 animate-[spin_25s_linear_infinite_reverse]">
                        <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center transition-all duration-500 hover:scale-125 hover:shadow-xl">
                          <img
                            alt="Angular"
                            className="w-8 h-8 object-contain"
                            src="/assets/logos/angular.svg"
                          />
                        </div>
                      </div>

                      {/* Three.js */}
                      <div className="absolute top-[32%] right-[18%] animate-[spin_25s_linear_infinite_reverse]">
                        <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center transition-all duration-500 hover:scale-125 hover:shadow-xl">
                          <img
                            alt="Three.js"
                            className="w-8 h-8 object-contain"
                            src="/assets/logos/threejs.svg"
                          />
                        </div>
                      </div>

                      {/* GitHub */}
                      <div className="absolute bottom-[32%] right-[18%] animate-[spin_25s_linear_infinite_reverse]">
                        <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center transition-all duration-500 hover:scale-125 hover:shadow-xl">
                          <img
                            alt="GitHub"
                            className="w-8 h-8 object-contain"
                            src="/assets/logos/github.svg"
                          />
                        </div>
                      </div>

                      {/* Photoshop */}
                      <div className="absolute bottom-[18%] left-[50%] -translate-x-1/2 animate-[spin_25s_linear_infinite_reverse]">
                        <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center transition-all duration-500 hover:scale-125 hover:shadow-xl">
                          <img
                            alt="Adobe Photoshop"
                            className="w-8 h-8 object-contain"
                            src="/assets/logos/photoshop.svg"
                          />
                        </div>
                      </div>

                      {/* Illustrator */}
                      <div className="absolute bottom-[32%] left-[18%] animate-[spin_25s_linear_infinite_reverse]">
                        <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center transition-all duration-500 hover:scale-125 hover:shadow-xl">
                          <img
                            alt="Adobe Illustrator"
                            className="w-8 h-8 object-contain"
                            src="/assets/logos/illustrator.svg"
                          />
                        </div>
                      </div>

                      {/* Notion */}
                      <div className="absolute top-[32%] left-[18%] animate-[spin_25s_linear_infinite_reverse]">
                        <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center transition-all duration-500 hover:scale-125 hover:shadow-xl">
                          <img
                            alt="Notion"
                            className="w-8 h-8 object-contain"
                            src="/assets/logos/notion.svg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BentoGrid;
