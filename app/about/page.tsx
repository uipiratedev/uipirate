"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import GlassBadge from "@/components/GlassBadge";
import TheTeam from "@/screens/landing/theTeam";

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
  { name: "Angular", category: "Frontend" },
  { name: "React", category: "Frontend" },
  { name: "Next.js", category: "Frontend" },
  { name: "TypeScript", category: "Language" },
  { name: "Tailwind CSS", category: "Styling" },
  { name: "Framer", category: "No-Code" },
  { name: "Webflow", category: "No-Code" },
  { name: "Figma", category: "Design" },
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

const clients = [
  { name: "Ipsos", location: "Israel", role: "VP of R&D" },
  { name: "Khaitan & Co", location: "India", role: "Leading Corporate Law Firm" },
  { name: "Xperiti", location: "New York, USA", role: "CEO & Founder" },
  { name: "RevUp AI", location: "Dallas, Texas, USA", role: "CEO" },
  { name: "Sarge", location: "USA", role: "Legal & Policy Support Platform" },
  { name: "Biotex Medical", location: "Texas, USA", role: "MedTech & Device Development" },
  { name: "Bird", location: "San Francisco, USA", role: "CEO" },
  {
    name: "Awesome Health Club",
    location: "California, USA",
    role: "Seed Investor",
  },
  { name: "ArthAlpha", location: "Bangalore, India", role: "Co-Founder" },
  { name: "Netzhill", location: "Ontario, Canada", role: "Founder" },
];

// Smooth entry animations for cards
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1], // Smooth custom easing
    },
  }),
};

const headerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

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
              ],
            },
          }),
        }}
        type="application/ld+json"
      />

      {/* Hero Section */}
      <section className="relative container mx-auto px-32 lg:px-20 max-md:px-4 pt-40 max-md:pt-28 pb-20">
        <motion.div
          className="max-w-4xl"
          initial="hidden"
          animate="visible"
          variants={headerVariants}
        >
          <div className="mb-6 inline-block">
            <GlassBadge variant="gradient">ABOUT US</GlassBadge>
          </div>
          <h1 className="text-6xl max-md:text-4xl font-bold text-gray-900 mb-6 leading-[1.1] tracking-tight">
            We Turn Ideas Into
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5B04] to-orange-400">
              Shipped Products
            </span>
          </h1>
          <p className="text-xl max-md:text-lg text-gray-600 leading-relaxed max-w-3xl font-medium">
            We are not just a design agency that makes things look pretty. We
            are a product design and development partner that helps you think
            through your product, plan its architecture, design the experience,
            and build it with production-ready code.{" "}
            <strong className="text-gray-900">
              Have a conversation about your product — we carry the rest.
            </strong>
          </p>
        </motion.div>
      </section>

      {/* Stats Strip - Glass Cards */}
      <section className="py-10 relative">
        <div className="container mx-auto px-32 lg:px-20 max-md:px-4">
          <div className="grid grid-cols-4 max-md:grid-cols-2 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white/60 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-8 text-center shadow-lg shadow-gray-100/50"
              >
                <p className="text-5xl max-md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#FF5B04] to-orange-400">
                  {stat.number}
                </p>
                <p className="text-sm text-gray-600 mt-3 font-semibold uppercase tracking-wider">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What Makes Us Different - Bento Grid Style */}
      <section className="container mx-auto px-32 lg:px-20 max-md:px-4 py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.8 }}
          variants={headerVariants}
          className="mb-16"
        >
          <div className="mb-4">
            <GlassBadge variant="gradient">OUR DNA</GlassBadge>
          </div>
          <h2 className="text-4xl max-md:text-3xl font-bold text-gray-900 mb-4 tracking-tight">
            What Makes Us Different
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl font-medium">
            Most agencies give you mockups. We give you a shipped product — with
            the thinking, strategy, and code to back it up.
          </p>
        </motion.div>

        <div className="grid grid-cols-3 max-md:grid-cols-1 gap-6">
          {[
            {
              icon: "🧠",
              title: "Product Thinking",
              desc: "We start with competitive analysis, market positioning, and product strategy. We help you make the right product decisions before designing a single pixel.",
            },
            {
              icon: "🏗️",
              title: "Architecture to Code",
              desc: "From your few lines of vision, we build the information architecture, user flows, wireframes, high-fidelity UI, and production-ready Angular/React code.",
            },
            {
              icon: "⚡",
              title: "Enterprise Specialist",
              desc: "Multi-role dashboards, data-heavy interfaces, intricate user flows, and real business logic. We specialize in the hard problems other agencies avoid.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="premium-card-inner bg-gradient-to-br from-white to-gray-50 rounded-[32px] p-8 border border-gray-200/60 shadow-xl shadow-gray-200/20 hover:shadow-2xl hover:border-[#FF5B04]/30 transition-all duration-500 group"
            >
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">{item.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed font-medium">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Design Style & Approach */}
      <section className="container mx-auto px-32 lg:px-20 max-md:px-4 pb-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.8 }}
          variants={headerVariants}
          className="mb-12"
        >
          <div className="mb-4">
            <GlassBadge variant="gradient">DESIGN PHILOSOPHY</GlassBadge>
          </div>
          <h2 className="text-4xl max-md:text-3xl font-bold text-gray-900 mb-4 tracking-tight">
            Our Design Style
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl font-medium">
            We don't just make it look good; we design for conversion, clarity, and scale.
          </p>
        </motion.div>

        <div className="grid grid-cols-3 max-md:grid-cols-1 gap-6">
          {[
            {
              title: "Dashboards & SaaS UX",
              desc: "Clean, intuitive, and data-driven. We tame complexity by organizing dense information into clear, actionable interfaces.",
              bg: "from-blue-50/50",
            },
            {
              title: "Websites & Landing Pages",
              desc: "Fast and conversion-focused. Every section is strategically crafted to guide the user toward the core CTA.",
              bg: "from-green-50/50",
            },
            {
              title: "Pixel-Perfect Execution",
              desc: "From Figma to code, we ensure the final product matches the vision exactly. No lost details in handoff.",
              bg: "from-purple-50/50",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              custom={i + 3}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className={`premium-card-inner bg-gradient-to-br ${item.bg} to-white rounded-[32px] p-8 border border-gray-200/60 shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed font-medium">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Our Process - Dark Section */}
      <section className="bg-[#0A0A0A] text-white py-24 relative overflow-hidden rounded-[60px] max-md:rounded-[30px] mx-4 max-md:mx-2 mb-24">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-[#FF5B04]/10 to-transparent blur-3xl pointer-events-none" />

        <div className="container mx-auto px-32 lg:px-20 max-md:px-4 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.8 }}
            variants={headerVariants}
            className="text-center mb-16"
          >
            <div className="flex justify-center mb-4">
              <GlassBadge variant="gradient" className="!text-white">THE PROCESS</GlassBadge>
            </div>
            <h2 className="text-4xl max-md:text-3xl font-bold tracking-tight mb-4">
              Our Approach
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto font-medium">
              Simple: you share your vision. We do the rest — from thinking to shipping.
            </p>
          </motion.div>

          <div className="grid grid-cols-3 max-md:grid-cols-1 gap-6">
            {process.map((step, i) => (
              <motion.div
                key={step.step}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-[32px] p-8 hover:bg-white/[0.05] hover:border-[#FF5B04]/50 transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-full pointer-events-none" />
                
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#FF5B04]/10 text-[#FF5B04] font-mono font-bold text-sm mb-6 group-hover:scale-110 transition-transform duration-300">
                  {step.step}
                </span>
                <h3 className="text-xl font-bold text-white tracking-tight mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed font-medium">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Shared TheTeam Component */}
      <section className="mb-24">
        <TheTeam />
      </section>

      {/* Technology Stack & Industries */}
      <section className="container mx-auto px-32 lg:px-20 max-md:px-4 py-24 border-t border-gray-200">
        <div className="grid grid-cols-2 max-md:grid-cols-1 gap-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={headerVariants}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
              Technology Stack
            </h2>
            <div className="flex flex-wrap gap-3">
              {technologies.map((tech) => (
                <div
                  key={tech.name}
                  className="bg-white border border-gray-200 shadow-sm rounded-full px-5 py-2 hover:border-[#FF5B04] hover:shadow-md transition-all duration-300 cursor-default"
                >
                  <span className="text-sm font-bold text-gray-900">
                    {tech.name}
                  </span>
                  <span className="text-xs text-gray-500 font-medium ml-2">
                    {tech.category}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={headerVariants}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
              Industries We Serve
            </h2>
            <div className="flex flex-wrap gap-3">
              {industries.map((industry) => (
                <div
                  key={industry}
                  className="bg-gray-100 rounded-full px-5 py-2 text-sm font-semibold text-gray-700"
                >
                  {industry}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trusted By Clients Grid */}
      <section className="bg-white py-24 border-t border-gray-200">
        <div className="container mx-auto px-32 lg:px-20 max-md:px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.8 }}
            variants={headerVariants}
            className="text-center mb-16"
          >
            <h2 className="text-3xl max-md:text-2xl font-bold text-gray-900 tracking-tight">
              Trusted by Teams Across the Globe
            </h2>
          </motion.div>

          <div className="grid grid-cols-4 max-lg:grid-cols-2 max-md:grid-cols-1 gap-6">
            {clients.map((client, i) => (
              <motion.div
                key={client.name}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={cardVariants}
                className="bg-gradient-to-br from-white to-gray-50 border border-gray-200/80 shadow-sm hover:shadow-lg rounded-2xl p-6 transition-all duration-300 group"
              >
                <p className="font-bold text-lg text-gray-900 tracking-tight group-hover:text-[#FF5B04] transition-colors">
                  {client.name}
                </p>
                <p className="text-xs font-semibold text-gray-500 mt-1 uppercase tracking-wide">
                  {client.location}
                </p>
                <div className="mt-4 inline-block px-3 py-1 bg-gray-100 rounded-lg">
                  <p className="text-xs font-bold text-gray-700">
                    {client.role}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-32 lg:px-20 max-md:px-4 py-32 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-orange-50/50 pointer-events-none rounded-[60px]" />
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.8 }}
          variants={headerVariants}
          className="relative z-10"
        >
          <h2 className="text-5xl max-md:text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            Ready to Turn Your Idea
            <br /> Into a Product?
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto font-medium">
            Book a free 15-minute call. Tell us about your product vision — we'll
            show you how we can bring it to life.
          </p>
          <div className="flex flex-row max-md:flex-col items-center justify-center gap-4">
            <Link
              className="bg-[#FF5B04] text-white px-8 py-4 rounded-full font-bold hover:bg-orange-600 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/20 transition-all duration-300"
              href="https://cal.com/ui-pirate/15min"
              target="_blank"
            >
              Book a Free Call
            </Link>
            <Link
              className="bg-white border border-gray-200 text-gray-900 px-8 py-4 rounded-full font-bold hover:border-gray-900 hover:bg-gray-50 hover:scale-105 transition-all duration-300 shadow-sm"
              href="/ourWorks"
            >
              See Our Work
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
