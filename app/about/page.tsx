"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardBody, Accordion, AccordionItem } from "@heroui/react";

import GlassSurface from "@/components/GlassSurface";
import SectionHeader from "@/components/SectionHeader";
import { Reveal } from "@/components/motion";
import { CheckIcon } from "@/components/icons";
import { ClientLogosGrid } from "@/components/ClientLogos";
import LandingWhoWeAre from "@/screens/landing/whoWeAre";
import PricingPerfectFor from "@/screens/pricing/perfectFor";
import {
  HERO_BADGE_PRESET,
  HERO_BADGE_CLASSNAME,
  HERO_BADGE_ANIMATION_STYLE,
} from "@/config/glassSurfacePresets";
import { PROCESS_STEPS } from "@/data/process";

const stats = [
  { number: "9+", label: "Years of Experience" },
  { number: "50+", label: "Products Shipped" },
  { number: "5.0", label: "Client Rating" },
  { number: "6", label: "Countries Served" },
];

const technologies = [
  { name: "Angular", logo: "/assets/logos/angular.svg" },
  { name: "React", logo: "/assets/logos/react.svg" },
  { name: "Next.js", logo: "/assets/logos/next js.svg" },
  { name: "Node.js", logo: "/assets/logos/nodejs.svg" },
  { name: "Python", logo: "/assets/logos/python.svg" },
  { name: "TypeScript", logo: "/assets/logos/typescript.svg" },
  { name: "Tailwind CSS", logo: "/assets/logos/tailwind.svg" },
  { name: "Framer", logo: "/assets/logos/framer.svg" },
  { name: "Figma", logo: "/assets/logos/figma.svg" },
  { name: "GSAP", logo: "/assets/logos/gsap.svg" },
];

const industries = [
  "SaaS & Enterprise Software",
  "FinTech & Quant Trading",
  "HealthTech & MedTech",
  "LegalTech",
  "AI Products & Platforms",
];

const ABOUT_FAQS = [
  {
    question: "What is UI Pirate?",
    answer:
      "A product design and development agency founded by Vishal Anand in 2017. A seven-person team of designers and engineers who take products from first wireframe to shipped code.",
  },
  {
    question: "Where is the team based?",
    answer:
      "The core team is in India. We keep US Eastern and Pacific business hours, and 60% of our clients are US-based startups and enterprises.",
  },
  {
    question: "Do you only design, or do you build too?",
    answer:
      "Both. We handle product thinking, UX/UI design, and production-ready front-end code in React, Angular, and Next.js — the same team, start to finish.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-[#fafafa] overflow-hidden">
      {/* About page JSON-LD */}
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "About UI Pirate",
            description:
              "Full-service SaaS & AI product design and development agency that turns ideas into fully functional shipped products.",
            url: "https://uipirate.com/about",
            mainEntity: {
              "@type": "Organization",
              "@id": "https://uipirate.com/#organization",
              name: "UI Pirate by Vishal Anand",
              description:
                "Full-service product design and development agency specializing in product thinking, competitive analysis, information architecture, UX/UI design, and end-to-end full-stack software development in Angular, React, Next.js, Node.js, and Python.",
              foundingDate: "2017",
              numberOfEmployees: "7",
              founder: {
                "@type": "Person",
                name: "Vishal Anand",
                jobTitle: "Founder & Lead Designer",
                description:
                  "Product designer and software engineer with 9+ years of experience turning product ideas into shipped products.",
              },
              employee: [
                {
                  "@type": "Person",
                  name: "Danish Ansari",
                  jobTitle: "Lead Frontend Developer",
                },
                {
                  "@type": "Person",
                  name: "Syed Musaddiq",
                  jobTitle: "Lead UX Designer",
                },
                {
                  "@type": "Person",
                  name: "Kartik Kumar",
                  jobTitle: "Lead Graphics & Motion",
                },
                {
                  "@type": "Person",
                  name: "Aniket",
                  jobTitle: "Lead Backend & AI Developer",
                },
                {
                  "@type": "Person",
                  name: "Priyagni",
                  jobTitle: "Graphic Designer",
                },
                {
                  "@type": "Person",
                  name: "Aman",
                  jobTitle: "Video Editing",
                },
              ],
              knowsAbout: [
                "Product Thinking",
                "Competitive Analysis",
                "Information Architecture",
                "UX/UI Design",
                "Angular Development",
                "React Development",
                "Complex Enterprise Applications",
                "Design Systems",
                "Enterprise Security Software",
                "HealthTech",
                "LegalTech",
                "AI Platforms",
                "SaaS Applications",
              ],
              // Clients/Customers - verifiable organizations
              customer: [
                {
                  "@type": "Organization",
                  name: "Pivot Bits",
                  url: "http://www.pivotbits.com/",
                  description:
                    "Enterprise security software company serving Fortune 500, hospitals, and schools in the USA",
                },
                {
                  "@type": "Organization",
                  name: "Ipsos",
                  url: "https://www.ipsos.com/",
                  description:
                    "Global market research and consulting firm headquartered in Paris, France",
                },
                {
                  "@type": "Organization",
                  name: "Biotex Medical",
                  url: "https://biotexmedical.com/",
                  description:
                    "MedTech and medical device development company based in Texas, USA",
                },
                {
                  "@type": "Organization",
                  name: "Khaitan & Co",
                  url: "https://www.khaitanco.com/",
                  description:
                    "Asia's largest law firm with offices across India",
                },
                {
                  "@type": "Organization",
                  name: "RevUp AI",
                  url: "https://revupai.com/",
                  description:
                    "AI-powered business solutions platform based in Dallas, USA",
                },
                {
                  "@type": "Organization",
                  name: "Simpleo AI",
                  url: "https://www.simpleo.ai/",
                  description: "Artificial intelligence solutions provider",
                },
                {
                  "@type": "Organization",
                  name: "Sarge",
                  url: "https://sarge.com/",
                  description:
                    "AI-powered police technology platform supporting law enforcement in Florida, USA",
                },
                {
                  "@type": "Organization",
                  name: "Awesome Health Club",
                  url: "https://awesomehealthclub.com/",
                  description:
                    "HealthTech and wellness platform based in California, USA",
                },
                {
                  "@type": "Organization",
                  name: "Rings & I",
                  url: "https://ringsandi.com/",
                  description: "E-commerce jewelry and lifestyle brand",
                },
                {
                  "@type": "Organization",
                  name: "Arth Alpha",
                  url: "https://www.arthalpha.in/",
                  description:
                    "Quant trading funded startup based in Bangalore, India",
                },
              ],
              areaServed: [
                { "@type": "Country", name: "United States" },
                { "@type": "Country", name: "India" },
                { "@type": "Country", name: "France" },
                { "@type": "Country", name: "Canada" },
                { "@type": "Country", name: "United Kingdom" },
                { "@type": "Country", name: "Singapore" },
              ],
              slogan: "From Idea to Shipped Product",
            },
          }),
        }}
      />

      {/* About FAQ JSON-LD */}
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: ABOUT_FAQS.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          }),
        }}
        type="application/ld+json"
      />

      {/* Hero Section - Consistent with landing and other pages */}
      <section className="hero-wrapper max-md:!pt-14 max-md:gap-y-0 pb-12">
        {/* Grid Background */}
        <div
          className="absolute pointer-events-none inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
        <div
          className="absolute pointer-events-none inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(250, 250, 250, 1) 0%, transparent 40%)",
          }}
        />

        <div className="section-container relative z-10">
          <div className="flex flex-col items-center text-center">
            {/* Badge - Same as Landing Page */}
            <GlassSurface
              {...HERO_BADGE_PRESET}
              className={HERO_BADGE_CLASSNAME}
              style={HERO_BADGE_ANIMATION_STYLE}
            >
              <div className="badge-text relative z-10 max-md:text-xs uppercase font-semibold tracking-wider">
                ABOUT US
              </div>
            </GlassSurface>

            {/* Headline */}
            <h1 className="hero-header max-w-4xl">
              <span className="text-black">We Turn Ideas Into </span>
              <span className="text-brand-orange">Shipped Products</span>
            </h1>

            {/* Subheading */}
            <p className="max-w-[720px] text-center text-lg max-md:text-sm mt-4 leading-relaxed text-gray-600">
              We are a product design and development studio. We help SaaS
              founders and enterprise teams think through the product, design
              for real users, and ship production-ready code. No hand-offs, no
              gaps.
            </p>

            {/* US Market Badge */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-full">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">
                    US Timezone Friendly
                  </span>{" "}
                  — EST & PST hours
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Everything below the hero shares one vertical rhythm — matches the
          landing page's `space-y-20 max-md:space-y-16` wrapper. Individual
          sections carry no vertical padding or margin of their own. */}
      <div className="space-y-20 max-md:space-y-16 pb-16 max-md:pb-12">
        {/* Stats Strip */}
        <section className="section-container">
          <div className="grid grid-cols-4 max-md:grid-cols-2 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:border-brand-orange/30 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <p className="text-4xl max-md:text-3xl font-bold text-brand-orange font-jetbrains-mono">
                  {stat.number}
                </p>
                <p className="text-xs text-gray-500 mt-2 font-medium uppercase tracking-wider">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* What Makes Us Different - Bento Grid Style */}
        <section className="section-container">
          <Reveal variant="up">
            <SectionHeader chip="OUR DNA">
              What Makes Us Different
            </SectionHeader>
          </Reveal>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Tall */}
            <div className="premium-card md:row-span-2">
              <motion.div
                className="premium-card-inner bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group h-full flex flex-col justify-between overflow-hidden relative"
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <div className="flex-1 bg-gray-50/50 rounded-xl mb-6 border border-gray-100 border-dashed min-h-[160px]" />
                <div className="z-10 relative">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Strategy Before Pixels
                  </h3>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed">
                    Positioning, user flows, and scope mapped before any screen
                    is touched.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Card 2: Wide */}
            <div className="premium-card md:col-span-2 h-full min-h-[240px]">
              <motion.div
                className="premium-card-inner bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group h-full flex flex-col justify-between relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <div className="flex-1 bg-gray-50/50 rounded-xl mb-6 border border-gray-100 border-dashed min-h-[120px]" />
                <div className="z-10 relative">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Complex Made Simple
                  </h3>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-xl">
                    We turn multi-role dashboards, data-heavy flows, and
                    enterprise systems into interfaces that are fast to learn
                    and easy to use.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Card 3: Standard */}
            <div className="premium-card md:col-span-1 h-full min-h-[240px]">
              <motion.div
                className="premium-card-inner bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group h-full flex flex-col justify-between relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <div className="flex-1 bg-gray-50/50 rounded-xl mb-6 border border-gray-100 border-dashed min-h-[100px]" />
                <div className="z-10 relative">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Built to Convert
                  </h3>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed">
                    Every flow is built to move users forward. Conversion is the
                    brief.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Card 4: Standard */}
            <div className="premium-card md:col-span-1 h-full min-h-[240px]">
              <motion.div
                className="premium-card-inner bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group h-full flex flex-col justify-between relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <div className="flex-1 bg-gray-50/50 rounded-xl mb-6 border border-gray-100 border-dashed min-h-[100px]" />
                <div className="z-10 relative">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Design Through to Code
                  </h3>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed">
                    Wireframes to React, Angular, and Next.js. One team, no
                    hand-offs.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Card 5: Standard */}
            <div className="premium-card md:col-span-1 h-full min-h-[240px]">
              <motion.div
                className="premium-card-inner bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group h-full flex flex-col justify-between relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <div className="flex-1 bg-gray-50/50 rounded-xl mb-6 border border-gray-100 border-dashed min-h-[100px]" />
                <div className="z-10 relative">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Same Hours as Your Team
                  </h3>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed">
                    US Eastern and Pacific hours. Real-time calls, no time zone
                    gaps.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Card 6: Wide */}
            <div className="premium-card md:col-span-2 h-full min-h-[240px]">
              <motion.div
                className="premium-card-inner bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group h-full flex flex-col justify-between relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <div className="flex-1 bg-gray-50/50 rounded-xl mb-6 border border-gray-100 border-dashed min-h-[120px]" />
                <div className="z-10 relative">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    50+ Products, Not Guesses
                  </h3>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-xl">
                    Across SaaS, AI, FinTech, HealthTech, and LegalTech. We have
                    solved this type of problem before.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Design Style & Approach */}
        <section className="section-container">
          <Reveal variant="up">
            <SectionHeader chip="DESIGN PHILOSOPHY">
              Our Design Style
            </SectionHeader>
          </Reveal>

          <div className="grid grid-cols-3 max-md:grid-cols-1 gap-6">
            {[
              {
                title: "Dashboards & SaaS UX",
                desc: "Data-heavy flows and multi-role dashboards, simplified into interfaces that are fast to learn.",
                icon: () => (
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 2v12h5V6H4zm7 0v5h9V6h-9zm0 7v5h9v-5h-9z" />
                ),
              },
              {
                title: "Websites & Landing Pages",
                desc: "Conversion-focused layouts where every section moves visitors toward the next step.",
                icon: () => (
                  <path d="M4 4C2.895 4 2 4.895 2 6v12c0 1.105.895 2 2 2h16c1.105 0 2-.895 2-2V6c0-1.105-.895-2-2-2H4zm0 2h16v3H4V6zm0 5h16v7H4v-7z" />
                ),
              },
              {
                title: "Design That Holds Up in Code",
                desc: "From Figma to production-ready code. The shipped product matches the design, exactly.",
                icon: () => (
                  <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
                ),
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                className="bg-white rounded-[20px] p-7 border border-gray-100 shadow-[0_4px_16px_rgb(0,0,0,0.03)] hover:-translate-y-1.5 hover:shadow-[0_8px_24px_rgb(0,0,0,0.08)] transition-all duration-300 h-full flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                {/* Icon Container - Exact Reference Match (Outer gray pill, inner white pill) */}
                <div className="w-[74px] h-[50px] bg-[#F3F4F6] rounded-[20px] p-[5px] mb-6 flex-shrink-0">
                  <div className="w-full h-full bg-white rounded-[15px] shadow-[0_2px_8px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,1)] flex items-center justify-center">
                    {/* 3D Glossy Orange Icon */}
                    <div className="relative flex items-center justify-center">
                      {/* Blurred Drop Shadow */}
                      <svg
                        className="w-[24px] h-[24px] absolute blur-[3px] opacity-60 translate-y-[2px]"
                        fill="#ff7a2e"
                        viewBox="0 0 24 24"
                      >
                        {item.icon()}
                      </svg>

                      {/* Main Glossy Icon */}
                      <svg
                        className="w-[24px] h-[24px] relative z-10"
                        fill="url(#orange-gloss)"
                        viewBox="0 0 24 24"
                      >
                        <defs>
                          <linearGradient
                            id="orange-gloss"
                            x1="0%"
                            x2="0%"
                            y1="0%"
                            y2="100%"
                          >
                            <stop offset="0%" stopColor="#ffb885" />{" "}
                            {/* Light orange top */}
                            <stop offset="100%" stopColor="#ff5e00" />{" "}
                            {/* Vibrant orange bottom */}
                          </linearGradient>
                        </defs>

                        {/* Base Shape */}
                        {item.icon()}

                        {/* Inner White Highlight (Glass effect) */}
                        <g
                          fill="none"
                          stroke="white"
                          strokeOpacity="0.7"
                          strokeWidth="0.8"
                          style={{ transform: "translateY(0.5px)" }}
                        >
                          {item.icon()}
                        </g>
                      </svg>
                    </div>
                  </div>
                </div>

                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed flex-1">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Our Process - Light Section */}
        <section className="section-container">
          <Reveal variant="up">
            <SectionHeader chip="THE PROCESS">Our Approach</SectionHeader>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {PROCESS_STEPS.map((step, i) => {
              const icons = [
                "https://res.cloudinary.com/dvk9ttiym/image/upload/v1788205201/listen_ylvngt.svg",
                "https://res.cloudinary.com/dvk9ttiym/image/upload/v1788205201/listen_ylvngt.svg",
                "https://res.cloudinary.com/dvk9ttiym/image/upload/v1788205201/plan_mhuu0h.svg",
                "https://res.cloudinary.com/dvk9ttiym/image/upload/v1788205201/plan_mhuu0h.svg",
                "https://res.cloudinary.com/dvk9ttiym/image/upload/v1788205201/build_nq0h2a.svg",
                "https://res.cloudinary.com/dvk9ttiym/image/upload/v1788205201/build_nq0h2a.svg",
              ];

              return (
                <motion.div
                  key={step.title}
                  className="group relative bg-white border border-[#E5E7EB] rounded-[24px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] hover:border-gray-300 transition-all duration-300 overflow-hidden flex flex-col justify-between"
                  initial={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  {/* Step watermark touching top-right */}
                  <span className="absolute -top-3 md:-top-3 -right-1 text-[72px] md:text-[84px] font-bold text-[#ECEEF1] select-none leading-none tracking-tight font-jakarta pointer-events-none">
                    {step.step}
                  </span>

                  {/* SVG Icon */}
                  <div className="w-12 h-12 mb-6 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                    <img
                      alt={step.title}
                      className="w-full h-full object-contain"
                      src={icons[i]}
                    />
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-xl md:text-[22px] font-bold text-[#0F172A] mb-2 tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-[#64748B] font-normal text-sm md:text-[15px] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <Reveal
            className="mt-10 flex justify-center"
            delay={0.15}
            variant="fade"
          >
            <Link
              className="text-brand-orange font-semibold text-sm hover:underline flex items-center gap-1.5 transition-all hover:gap-2.5"
              href="/process"
            >
              See our full process in detail <span>→</span>
            </Link>
          </Reveal>
        </section>

        {/* Shared WhoWeAre / Team Component from Home Page */}
        <LandingWhoWeAre />

        {/* Technology Stack & Industries */}
        <section className="section-container">
          <div className="grid grid-cols-2 max-md:grid-cols-1 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Technology Stack
              </h3>
              <div className="flex flex-wrap gap-3">
                {technologies.map((tech) => (
                  <motion.div
                    key={tech.name}
                    className="bg-white border border-gray-200 rounded-xl px-4 py-2 flex items-center gap-2 hover:border-brand-orange/50 hover:shadow-sm transition-all duration-300"
                    initial={{ opacity: 0, scale: 0.9 }}
                    viewport={{ once: true }}
                    whileInView={{ opacity: 1, scale: 1 }}
                  >
                    <img
                      alt={tech.name}
                      className="w-5 h-5 object-contain"
                      src={tech.logo}
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {tech.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Industries We Serve
              </h3>
              <div className="flex flex-wrap gap-2">
                {industries.map((industry) => (
                  <span
                    key={industry}
                    className="bg-gray-100 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600"
                  >
                    {industry}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Trusted By Clients Grid - Logo-based */}
        <section className="section-container">
          <Reveal variant="up">
            <SectionHeader
              chip="OUR CLIENTS"
              subcopy="60% of our clients are US-based startups and enterprises"
            >
              Trusted by Teams Worldwide
            </SectionHeader>
          </Reveal>

          <ClientLogosGrid />
        </section>

        {/* Who We Work Best With - Landing Page Component */}
        <PricingPerfectFor />

        {/* About FAQ Section */}
        <section className="section-container">
          <div className="max-w-3xl mx-auto">
            <Reveal variant="up">
              <SectionHeader chip="FAQs">
                Everything you need to know
              </SectionHeader>
            </Reveal>
            <Accordion
              className="mb-0 p-0"
              defaultExpandedKeys={["0"]}
              selectionMode="multiple"
              variant="splitted"
            >
              {ABOUT_FAQS.map((faq, index) => (
                <AccordionItem
                  key={String(index)}
                  aria-label={faq.question}
                  className="shadow-none border border-gray-200 rounded-2xl mt-3 max-md:mt-2 items-center bg-white hover:border-brand-orange/40 transition-all duration-300 data-[open=true]:border-l-[3px] data-[open=true]:border-l-brand-orange data-[open=true]:border-gray-200 data-[open=true]:shadow-sm"
                  indicator={({ isOpen }) => (
                    <img
                      alt="icon"
                      className={`transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                      src="https://res.cloudinary.com/damm9iwho/image/upload/v1731050216/plus_dia0bt.svg"
                    />
                  )}
                  title={
                    <p className="font-semibold pr-12 max-md:pr-6 md:py-2 md:px-1 text-[16px] leading-snug text-gray-900">
                      {faq.question}
                    </p>
                  }
                >
                  <div className="px-5 pb-5 md:px-6 md:pb-6 pt-0">
                    <p className="text-[15px] text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA Section - Dark Card */}
        <section className="section-container">
          <Card className="rounded-[24px] max-md:rounded-[16px] bg-gradient-to-br from-[#212121] to-[#151514] border border-gray-800 shadow-xl noise-texture overflow-hidden">
            <CardBody className="p-12 max-md:p-6 text-center relative">
              {/* Glow effect */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-brand-orange/10 blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <h2 className="text-4xl max-md:text-2xl font-bold text-white mb-4 tracking-tight">
                  Ready to Turn Your Idea Into a{" "}
                  <span className="text-brand-orange">Product</span>?
                </h2>
                <p className="text-gray-500 mb-8 max-w-xl mx-auto">
                  Book a free 15-minute call. Tell us your vision — we&apos;ll
                  bring it to life.
                </p>
                <div className="flex flex-row max-md:flex-col items-center justify-center gap-4">
                  <Link
                    className="bg-brand-orange text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-600 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300"
                    href="https://cal.com/vishal-anand-3w8233/15min"
                    target="_blank"
                  >
                    Book a Free Call
                  </Link>
                  <Link
                    className="bg-white/10 border border-white/20 text-white px-6 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300"
                    href="/pricing"
                  >
                    See Pricing
                  </Link>
                </div>

                {/* Trust indicators */}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-gray-500 text-sm">
                  <span className="flex items-center gap-2">
                    <CheckIcon /> No commitment required
                  </span>
                  <span className="flex items-center gap-2">
                    <CheckIcon /> Response within 2 hours
                  </span>
                  <span className="flex items-center gap-2">
                    <CheckIcon /> US timezone friendly
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        </section>
      </div>
    </div>
  );
}
