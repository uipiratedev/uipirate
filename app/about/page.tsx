"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Card, CardBody, Accordion, AccordionItem } from "@heroui/react";

import GlassSurface from "@/components/GlassSurface";
import GlassBadge from "@/components/GlassBadge";
import { CheckIcon } from "@/components/icons";
import TheTeam from "@/screens/landing/theTeam";
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

// Premium enterprise client logos from landing page
const premiumLogos = [
  {
    url: "https://res.cloudinary.com/damm9iwho/image/upload/v1729513137/image_1_hxpv8e.svg",
    alt: "Ipsos - Global market research and consulting firm logo",
    link: "https://www.ipsos.com/en/ipsos-acquires-xperiti-strengthen-its-b2b-research-capabilities-global",
  },
  {
    url: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1764586282/logo_qpyrhf.webp",
    alt: "Biotex Medical - Healthcare technology solutions logo",
    link: "https://biotexmedical.com/",
  },
  {
    url: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1753093876/logo_r097ja.png",
    alt: "Khaitan & Co - APAC's largest leading law firm ",
    link: "https://www.khaitanco.com/",
  },
  {
    url: "https://res.cloudinary.com/damm9iwho/image/upload/v1729682150/Frame_1984078729_meav44.svg",
    alt: "RevUp AI - AI-powered business solutions logo",
    link: "https://revupai.com/",
  },
  {
    url: "https://res.cloudinary.com/damm9iwho/image/upload/v1729682148/Group-2_uduxpp.svg",
    alt: "Simpleo AI - Artificial intelligence platform logo",
    link: "https://www.simpleo.ai/",
  },
  {
    url: "https://res.cloudinary.com/damm9iwho/image/upload/v1730790130/728_x_90_copy_6x_uft7ai.svg",
    alt: "Arth Alpha - Financial technology and investment platform logo",
    link: "https://www.arthalpha.in/",
  },
  {
    url: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1770706789/sarge_hewzwz.svg",
    alt: "Sarge - AI-powered business solutions logo",
    link: "https://sarge.com/",
  },
  {
    url: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1760598018/healt_nvmdpw.svg",
    alt: "Awesome Health Club - Fitness and wellness platform logo",
    link: "https://awesomehealthclub.com/",
  },
  {
    url: "https://res.cloudinary.com/damm9iwho/image/upload/v1729682150/Rings_I_eyrgog.svg",
    alt: "Rings and I - Jewelry and lifestyle brand logo",
    link: "https://ringsandi.com/",
  },
];

const logoContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const logoItemVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.33, 1, 0.68, 1],
    },
  },
};

export default function AboutPage() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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

      {/* Hero Section - Consistent with other pages */}
      <section className="hero-page-container pb-12">
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

        <div className="container mx-auto px-4 sm:px-6 lg:px-20 xl:px-32 relative z-10">
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
              Not just a design agency — we're your product partner. We help you
              think through competitive analysis, simplify complex products,
              design for conversion, and ship production-ready code. From idea
              to shipped product.
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

      {/* Stats Strip */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-20 xl:px-32">
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
        </div>
      </section>

      {/* What Makes Us Different - Dark Card Style */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-20 xl:px-32 py-16">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <GlassBadge variant="gradient">OUR DNA</GlassBadge>
          </div>
          <h2 className="heading-center">What Makes Us Different</h2>
          <p className="text-gray-500 mt-2 max-w-xl mx-auto">
            Most agencies give you mockups. We give you a shipped product.
          </p>
        </div>

        {/* Dark Card Grid */}
        <Card className="rounded-[24px] max-md:rounded-[16px] bg-gradient-to-br from-[#212121] to-[#151514] border border-gray-800 shadow-xl noise-texture">
          <CardBody className="p-8 max-md:p-5">
            <div className="grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 gap-6">
              {[
                {
                  title: "Product Thinking First",
                  desc: "Before a single pixel, we do competitive analysis, market positioning, and product strategy. We help you make the right decisions, not just design ones.",
                },
                {
                  title: "Simplify Complex Products",
                  desc: "Multi-role dashboards, data-heavy flows, enterprise systems — we break down complexity into intuitive, user-friendly interfaces that people actually understand.",
                },
                {
                  title: "Designed for Conversion",
                  desc: "Every section, CTA, and flow is strategically designed. We don't just make it look good — we design to convert visitors into users and users into revenue.",
                },
                {
                  title: "Architecture to Code",
                  desc: "From vision to shipped product — IA, user flows, wireframes, UI, and production-ready React/Next.js code.",
                },
                {
                  title: "Enterprise Specialist",
                  desc: "Multi-role dashboards, data-heavy interfaces, complex flows. We handle the hard problems others avoid.",
                },
                {
                  title: "Idea to Shipped Product",
                  desc: "Information architecture, wireframes, UI design, and production-ready React/Angular/Next.js code. We carry your idea all the way to launch.",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-brand-orange/30 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  <div className="w-10 h-10 rounded-lg bg-brand-orange/20 flex items-center justify-center mb-4">
                    <span className="text-brand-orange font-bold font-mono text-sm">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </CardBody>
        </Card>
      </section>

      {/* Design Style & Approach */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-20 xl:px-32 pb-16">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <GlassBadge variant="gradient">DESIGN PHILOSOPHY</GlassBadge>
          </div>
          <h2 className="heading-center">Our Design Style</h2>
        </div>

        <div className="grid grid-cols-3 max-md:grid-cols-1 gap-4">
          {[
            {
              title: "Dashboards & SaaS UX",
              desc: "Clean, intuitive, data-driven. We tame complexity into clear, actionable interfaces.",
            },
            {
              title: "Websites & Landing Pages",
              desc: "Fast and conversion-focused. Every section guides users toward the CTA.",
            },
            {
              title: "Pixel-Perfect Execution",
              desc: "From Figma to code — the final product matches the vision exactly.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              className="premium-card"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <div className="premium-card-inner bg-gradient-to-br from-[#EDEDED] via-[#FFFFFF] to-[#EDEDED] rounded-[20px] p-6 border border-gray-200 h-full">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-brand-orange">
                    <CheckIcon />
                  </span>
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Our Process - Light Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-20 xl:px-32 py-16 mb-16">
        <div className="text-center mb-12 max-md:mb-8">
          <div className="flex justify-center mb-4">
            <GlassBadge variant="gradient">THE PROCESS</GlassBadge>
          </div>
          <h2 className="heading-center">Our Approach</h2>
          <p className="text-gray-500 max-w-xl mx-auto mt-2">
            Simple: you share your vision. We do the rest.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {PROCESS_STEPS.map((step, i) => {
            const icons = [
              "https://res.cloudinary.com/dvk9ttiym/image/upload/v1788205201/listen_ylvngt.svg",
              "https://res.cloudinary.com/dvk9ttiym/image/upload/v1788205201/listen_ylvngt.svg",
              "https://res.cloudinary.com/dvk9ttiym/image/upload/v1788205201/plan_mhuu0h.svg",
              "https://res.cloudinary.com/dvk9ttiym/image/upload/v1788205201/plan_mhuu0h.svg",
              "https://res.cloudinary.com/dvk9ttiym/image/upload/v1788205201/build_nq0h2a.svg",
              "https://res.cloudinary.com/dvk9ttiym/image/upload/v1788205201/build_nq0h2a.svg"
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

        <div className="flex justify-center mt-10">
          <Link
            className="text-brand-orange font-semibold text-sm hover:underline flex items-center gap-1.5 transition-all hover:gap-2.5"
            href="/process"
          >
            See our full process in detail <span>→</span>
          </Link>
        </div>
      </section>

      {/* Shared TheTeam Component */}
      <section className="mb-16">
        <TheTeam />
      </section>

      {/* Technology Stack & Industries */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-20 xl:px-32 py-12">
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
      <section className="container mx-auto px-4 sm:px-6 lg:px-20 xl:px-32 py-12">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <GlassBadge variant="gradient">OUR CLIENTS</GlassBadge>
          </div>
          <h2 className="heading-center">Companies That Trusted Us With Their Products</h2>
          <p className="text-gray-500 mt-2">
            60% of our clients are US-based startups and enterprises
          </p>
          <Link
            className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-brand-orange hover:underline"
            href="https://clutch.co/profile/ui-pirate-vishal-anand"
            target="_blank"
          >
            See our reviews on Clutch →
          </Link>
        </div>

        <div className="w-full mt-6">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center justify-items-center"
            initial="hidden"
            variants={logoContainerVariants}
            viewport={{ once: true, amount: 0.3 }}
            whileInView="visible"
          >
            {premiumLogos.map((logo, index) => (
              <motion.a
                key={index}
                className={`logo-item group flex items-center justify-center w-full h-full p-6 max-md:p-4 rounded-[10px] relative overflow-hidden ${
                  logo.link
                    ? "cursor-pointer hover:brightness-105"
                    : "cursor-default"
                }`}
                href={logo.link || undefined}
                rel={logo.link ? "noopener noreferrer" : undefined}
                style={{
                  background:
                    "linear-gradient(142deg, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0.65) 50%, rgba(255, 255, 255, 0.55) 100%)",
                  backdropFilter: "blur(32px) saturate(120%) brightness(100%)",
                  WebkitBackdropFilter:
                    "blur(32px) saturate(120%) brightness(100%)",
                  border: "2px solid rgba(255, 255, 255, 0.12)",
                  boxShadow:
                    "0 4px 16px 0 rgba(31, 38, 135, 0.08), inset 1px 1px 2px 0 rgba(255, 255, 255, 0.3), inset -1px -1px 1px 0 rgba(255, 255, 255, 0.05)",
                }}
                target={logo.link ? "_blank" : undefined}
                variants={logoItemVariants}
                onHoverEnd={() => setHoveredIndex(null)}
                onHoverStart={() => setHoveredIndex(index)}
              >
                {/* Brand Orange Border - appears on hover */}
                <motion.div
                  animate={{
                    opacity: hoveredIndex === index ? 1 : 0,
                    boxShadow:
                      hoveredIndex === index
                        ? "0 0 20px rgba(255, 91, 4, 0.3), 0 0 40px rgba(255, 91, 4, 0.1)"
                        : "0 0 0px rgba(255, 91, 4, 0)",
                  }}
                  className="brand-border"
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "0.75rem",
                    padding: "2px",
                    background:
                      "linear-gradient(135deg, #FF5B04 0%, #FF7B34 50%, #FF5B04 100%)",
                    WebkitMask:
                      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                    pointerEvents: "none",
                    zIndex: 1,
                  }}
                  transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
                />

                <motion.img
                  alt={logo.alt}
                  animate={{ scale: hoveredIndex === index ? 1.1 : 1 }}
                  className="h-[40px] max-h-[40px] max-md:h-[24px] max-md:max-h-[24px] w-auto object-contain relative z-10"
                  loading="lazy"
                  src={logo.url}
                  transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
                />
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          .logo-item,
          .logo-item img,
          .brand-border {
            transition: none !important;
            animation: none !important;
          }
        }

        .logo-item {
          position: relative;
        }

        .logo-item::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 0.75rem;
          background: linear-gradient(
            135deg,
            rgba(255, 91, 4, 0.06),
            rgba(255, 123, 52, 0.04)
          );
          opacity: 0;
          transition: opacity 0.4s ease;
          z-index: 0;
        }

        .logo-item:hover::before {
          opacity: 1;
        }
      `}</style>

      {/* Who We Work Best With - Landing Page Component */}
      <PricingPerfectFor />

      {/* About FAQ Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-20 xl:px-32 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <GlassBadge variant="gradient">FAQS</GlassBadge>
            </div>
            <h2 className="text-3xl max-md:text-2xl font-bold text-gray-900 tracking-tight">
              Everything you need to know
            </h2>
          </div>
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
      <section className="container mx-auto px-4 sm:px-6 lg:px-20 xl:px-32 py-16 mb-8">
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
                Book a free 15-minute call. Tell us your vision — we'll bring it to life.
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
  );
}
