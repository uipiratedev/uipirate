"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardBody } from "@heroui/react";
import GlassSurface from "@/components/GlassSurface";
import GlassBadge from "@/components/GlassBadge";
import { CheckIcon } from "@/components/icons";
import TheTeam from "@/screens/landing/theTeam";
import {
  HERO_BADGE_PRESET,
  HERO_BADGE_CLASSNAME,
  HERO_BADGE_ANIMATION_STYLE
} from "@/config/glassSurfacePresets";

const stats = [
  { number: "9+", label: "Years of Experience" },
  { number: "50+", label: "Products Shipped" },
  { number: "5.0", label: "Client Rating" },
  { number: "6", label: "Countries Served" },
];

const process = [
  {
    step: "01",
    title: "Listen",
    description:
      "You share your product vision — even if it's just a few lines of an idea. We listen deeply to understand your goals, users, and constraints.",
  },
  {
    step: "02",
    title: "Think",
    description:
      "We do competitive analysis, market research, and product thinking. We study what exists, find gaps, and define what will make your product stand out.",
  },
  {
    step: "03",
    title: "Plan",
    description:
      "Information architecture, user flows, feature prioritization, and product roadmap. We structure your product so it's intuitive from day one.",
  },
  {
    step: "04",
    title: "Design",
    description:
      "Wireframes → High-fidelity UI → Interactive prototypes. Every pixel is deliberate, every interaction is designed to drive user engagement.",
  },
  {
    step: "05",
    title: "Build",
    description:
      "Production-ready frontend code in Angular, React, or Next.js. Component-based architecture, API integration, responsive layouts, and performance optimization.",
  },
  {
    step: "06",
    title: "Ship & Scale",
    description:
      "Deployment, documentation, design system handoff, and ongoing support. We stay with you as your product grows and evolves.",
  },
];

const technologies = [
  { name: "Angular", logo: "/assets/logos/angular.svg" },
  { name: "React", logo: "/assets/logos/react.svg" },
  { name: "Next.js", logo: "/assets/logos/next js.svg" },
  { name: "TypeScript", logo: "/assets/logos/typescript.svg" },
  { name: "Tailwind CSS", logo: "/assets/logos/tailwind.svg" },
  { name: "Framer", logo: "/assets/logos/framer.svg" },
  { name: "Figma", logo: "/assets/logos/figma.svg" },
  { name: "GSAP", logo: "/assets/logos/gsap.svg" },
];

const industries = [
  "SaaS & Enterprise Software",
  "Fintech & Banking",
  "HealthTech & MedTech",
  "LegalTech",
  "E-commerce",
  "EdTech",
  "PropTech",
  "AI & Machine Learning",
];

// Client logos from cloudinary - matching marquee section
const clientLogos = [
  { name: "Pivot Bits", logo: "/assets/logos/pivotbits.png", desc: "Enterprise Security Software", isUS: true, invertColor: true },
  { name: "Ipsos", logo: "https://res.cloudinary.com/damm9iwho/image/upload/v1729513137/image_1_hxpv8e.svg", desc: "Global Market Research", isUS: false },
  { name: "Biotex Medical", logo: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1764586282/logo_qpyrhf.webp", desc: "MedTech", isUS: true },
  { name: "Khaitan & Co", logo: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1753093876/logo_r097ja.png", desc: "Asia's Largest Law Firm", isUS: false },
  { name: "RevUp AI", logo: "https://res.cloudinary.com/damm9iwho/image/upload/v1729682150/Frame_1984078729_meav44.svg", desc: "AI Platform", isUS: true },
  { name: "Simpleo AI", logo: "https://res.cloudinary.com/damm9iwho/image/upload/v1729682148/Group-2_uduxpp.svg", desc: "AI Solutions", isUS: true },
  { name: "Sarge", logo: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1770706789/sarge_hewzwz.svg", desc: "AI Police Tech Platform", isUS: true },
  { name: "Awesome Health", logo: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1760598018/healt_nvmdpw.svg", desc: "HealthTech", isUS: true },
  { name: "Rings & I", logo: "https://res.cloudinary.com/damm9iwho/image/upload/v1729682150/Rings_I_eyrgog.svg", desc: "E-commerce", isUS: true },
  { name: "Arth Alpha", logo: "https://res.cloudinary.com/damm9iwho/image/upload/v1730790130/728_x_90_copy_6x_uft7ai.svg", desc: "Quant Trading Startup", isUS: false },
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
              "Product design and frontend development agency that turns ideas into shipped products.",
            url: "https://uipirate.com/about",
            mainEntity: {
              "@type": "Organization",
              "@id": "https://uipirate.com/#organization",
              name: "UI Pirate by Vishal Anand",
              description:
                "Product design and frontend development agency specializing in product thinking, competitive analysis, information architecture, UX/UI design, and complex enterprise Angular/React applications.",
              foundingDate: "2015",
              numberOfEmployees: "9",
              founder: {
                "@type": "Person",
                name: "Vishal Anand",
                jobTitle: "Founder & Lead Designer",
                description:
                  "Product designer and frontend developer with 9+ years of experience turning product ideas into shipped products.",
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
                  jobTitle: "Lead Backend Developer",
                },
                {
                  "@type": "Person",
                  name: "Priyagni",
                  jobTitle: "Graphic Designer",
                },
                {
                  "@type": "Person",
                  name: "Harsh",
                  jobTitle: "Backend Developer",
                },
                {
                  "@type": "Person",
                  name: "Karan",
                  jobTitle: "Marketing",
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
                  description: "Enterprise security software company serving Fortune 500, hospitals, and schools in the USA",
                },
                {
                  "@type": "Organization",
                  name: "Ipsos",
                  url: "https://www.ipsos.com/",
                  description: "Global market research and consulting firm headquartered in Paris, France",
                },
                {
                  "@type": "Organization",
                  name: "Biotex Medical",
                  url: "https://biotexmedical.com/",
                  description: "MedTech and medical device development company based in Texas, USA",
                },
                {
                  "@type": "Organization",
                  name: "Khaitan & Co",
                  url: "https://www.khaitanco.com/",
                  description: "Asia's largest law firm with offices across India",
                },
                {
                  "@type": "Organization",
                  name: "RevUp AI",
                  url: "https://revupai.com/",
                  description: "AI-powered business solutions platform based in Dallas, USA",
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
                  description: "AI-powered police technology platform supporting law enforcement in Florida, USA",
                },
                {
                  "@type": "Organization",
                  name: "Awesome Health Club",
                  url: "https://awesomehealthclub.com/",
                  description: "HealthTech and wellness platform based in California, USA",
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
                  description: "Quant trading funded startup based in Bangalore, India",
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
        type="application/ld+json"
      />

      {/* Hero Section - Consistent with other pages */}
      <section className="relative pt-8 pb-12 max-md:pt-4">
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
            background: "linear-gradient(to top, rgba(250, 250, 250, 1) 0%, transparent 40%)",
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
              Not just a design agency. We're your product partner — from strategy to shipped code.
              Trusted by 50+ companies across the US, UK, and Singapore.
            </p>

            {/* US Market Badge */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-full">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">US Timezone Friendly</span> — EST & PST hours
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
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:border-brand-orange/30 transition-all duration-300"
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
          <h2 className="heading-center">
            What Makes Us Different
          </h2>
          <p className="text-gray-500 mt-2 max-w-xl mx-auto">
            Most agencies give you mockups. We give you a shipped product.
          </p>
        </div>

        {/* Dark Card Grid */}
        <Card className="rounded-[24px] max-md:rounded-[16px] bg-gradient-to-br from-[#212121] to-[#151514] border border-gray-800 shadow-xl noise-texture">
          <CardBody className="p-8 max-md:p-5">
            <div className="grid grid-cols-3 max-md:grid-cols-1 gap-6">
              {[
                {
                  title: "Product Thinking",
                  desc: "We start with competitive analysis, market positioning, and strategy. Right decisions before designing a single pixel.",
                },
                {
                  title: "Architecture to Code",
                  desc: "From vision to shipped product — IA, user flows, wireframes, UI, and production-ready React/Next.js code.",
                },
                {
                  title: "Enterprise Specialist",
                  desc: "Multi-role dashboards, data-heavy interfaces, complex flows. We handle the hard problems others avoid.",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-brand-orange/30 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-lg bg-brand-orange/20 flex items-center justify-center mb-4">
                    <span className="text-brand-orange font-bold font-mono text-sm">0{i + 1}</span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
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
          <h2 className="heading-center">
            Our Design Style
          </h2>
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="premium-card"
            >
              <div className="premium-card-inner bg-gradient-to-br from-[#EDEDED] via-[#FFFFFF] to-[#EDEDED] rounded-[20px] p-6 border border-gray-200 h-full">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-brand-orange"><CheckIcon /></span>
                  <h3 className="font-semibold text-gray-900">
                    {item.title}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Our Process - Dark Section */}
      <section className="bg-[#0A0A0A] text-white py-16 relative overflow-hidden rounded-[32px] max-md:rounded-[20px] mx-4 sm:mx-6 lg:mx-20 xl:mx-32 mb-16">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-gradient-to-b from-brand-orange/10 to-transparent blur-3xl pointer-events-none" />

        <div className="px-8 max-md:px-5 relative z-10">
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <GlassBadge variant="gradient" className="text-white">THE PROCESS</GlassBadge>
            </div>
            <h2 className="text-3xl max-md:text-2xl font-bold tracking-tight text-white mb-3">
              Our Approach
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Simple: you share your vision. We do the rest.
            </p>
          </div>

          <div className="grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 gap-4">
            {process.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-brand-orange/30 transition-all duration-300"
              >
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-brand-orange/20 text-brand-orange font-mono font-bold text-xs mb-4">
                  {step.step}
                </span>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
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
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="bg-white border border-gray-200 rounded-xl px-4 py-2 flex items-center gap-2 hover:border-brand-orange/50 hover:shadow-sm transition-all duration-300"
                >
                  <img src={tech.logo} alt={tech.name} className="w-5 h-5 object-contain" />
                  <span className="text-sm font-medium text-gray-700">{tech.name}</span>
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
          <h2 className="heading-center">
            Trusted by Teams Worldwide
          </h2>
          <p className="text-gray-500 mt-2">
            60% of our clients are US-based startups and enterprises
          </p>
        </div>

        <div className="grid grid-cols-5 max-lg:grid-cols-3 max-md:grid-cols-2 gap-4">
          {clientLogos.map((client, i) => (
            <motion.div
              key={client.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className={`border rounded-xl p-5 flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-brand-orange/40 hover:shadow-lg group ${
                client.isUS
                  ? 'bg-brand-orange/5 border-brand-orange/20'
                  : 'bg-white border-gray-200'
              }`}
            >
              <img
                src={client.logo}
                alt={client.name}
                className="h-8 w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                style={client.invertColor ? {
                  filter: 'invert(1) sepia(1) saturate(5) hue-rotate(180deg) brightness(0.7)',
                } : undefined}
              />
              <span className="mt-2 text-xs text-gray-500 font-medium">
                {client.desc}
              </span>
              {client.isUS && (
                <span className="mt-1 text-[10px] text-brand-orange font-semibold">
                  🇺🇸 US
                </span>
              )}
            </motion.div>
          ))}
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
                Ready to Turn Your Idea Into a <span className="text-brand-orange">Product</span>?
              </h2>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                Book a free 15-minute call. Tell us your vision — we'll show you how we can bring it to life.
              </p>
              <div className="flex flex-row max-md:flex-col items-center justify-center gap-4">
                <Link
                  href="https://cal.com/ui-pirate/15min"
                  target="_blank"
                  className="bg-brand-orange text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-600 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300"
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
              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-gray-400 text-sm">
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
