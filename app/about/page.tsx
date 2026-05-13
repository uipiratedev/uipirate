import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "About UI Pirate | Product Design & Development Agency — Our Story & Approach",
  description:
    "We turn product ideas into shipped products. Learn about our approach — product thinking, competitive analysis, UX/UI design & complex enterprise Angular/React development. 50+ products shipped for Fortune 500 clients globally.",
  keywords:
    "about UI Pirate, product design agency, idea to product, product thinking, Vishal Anand, Angular development, enterprise design agency, UX UI agency story",
  openGraph: {
    title: "About UI Pirate | Product Design & Development — Our Story",
    description:
      "Not just designs — we help you think, plan, and build your product from scratch. Product thinking, UX/UI, competitive analysis & complex enterprise Angular/React development.",
    url: "https://uipirate.com/about",
    siteName: "UI Pirate by Vishal Anand",
    images: [
      {
        url: "https://res.cloudinary.com/dkziil6io/image/upload/v1742919377/ui-pirate-website_amh6qb.png",
        width: 1200,
        height: 630,
        alt: "About UI Pirate - Product Design & Development Agency",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://uipirate.com/about",
  },
};

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

const team = [
  {
    name: "Vishal Anand",
    role: "Founder & Lead Designer",
    description:
      "9+ years of experience in product design and enterprise frontend development. Specializes in turning complex ideas into intuitive, scalable products.",
  },
  {
    name: "Danish Ansari",
    role: "Lead Frontend Developer",
    description:
      "Builds and ships the frontend. Expert in Angular, React, and creating pixel-perfect, responsive enterprise applications.",
  },
  {
    name: "Syed Musaddiq",
    role: "Lead UX Designer",
    description:
      "Designs how the product works. Specializes in design systems, component libraries, and data-driven UX for SaaS.",
  },
  {
    name: "Kartik Kumar",
    role: "Lead Graphics & Motion",
    description:
      "Crafts visuals and motion design, ensuring every product feels premium, polished, and dynamic.",
  },
  {
    name: "Aniket",
    role: "Lead Backend Developer",
    description:
      "Handles backend architecture, ensuring our enterprise applications are scalable, secure, and performant.",
  },
  {
    name: "Priyagni",
    role: "Graphic Designer",
    description:
      "Works on visual design, branding, and ensuring visual consistency across all touchpoints.",
  },
  {
    name: "Harsh",
    role: "Backend Developer",
    description:
      "Builds robust backend systems and APIs to power complex frontend interfaces.",
  },
  {
    name: "Karan",
    role: "Marketing",
    description:
      "Handles marketing, growth, and ensuring our products reach the right audience.",
  },
  {
    name: "Aman",
    role: "Video Editing",
    description:
      "Edits and produces high-quality video content for product showcases and marketing.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white">
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
              numberOfEmployees: "3",
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
      <section className="relative container mx-auto px-32 lg:px-20 max-md:px-4 pt-32 max-md:pt-24 pb-20">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold tracking-widest uppercase text-[#FF5B04] mb-4">
            About UI Pirate
          </p>
          <h1 className="text-5xl max-md:text-3xl font-bold text-gray-900 mb-6 leading-tight">
            We Turn Ideas Into
            <br />
            <span className="text-[#FF5B04]">Shipped Products</span>
          </h1>
          <p className="text-xl max-md:text-lg text-gray-600 leading-relaxed max-w-3xl">
            We are not just a design agency that makes things look pretty. We
            are a product design and development partner that helps you think
            through your product, plan its architecture, design the experience,
            and build it with production-ready code.{" "}
            <strong className="text-gray-900">
              Have a conversation about your product — we carry the rest.
            </strong>
          </p>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-32 lg:px-20 max-md:px-4">
          <div className="grid grid-cols-4 max-md:grid-cols-2 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-5xl max-md:text-4xl font-bold text-[#FF5B04]">
                  {stat.number}
                </p>
                <p className="text-sm text-gray-600 mt-2 font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="container mx-auto px-32 lg:px-20 max-md:px-4 py-20">
        <h2 className="text-3xl max-md:text-2xl font-bold text-gray-900 mb-4">
          What Makes Us Different
        </h2>
        <p className="text-lg text-gray-600 mb-12 max-w-3xl">
          Most agencies give you mockups. We give you a shipped product — with
          the thinking, strategy, and code to back it up.
        </p>

        <div className="grid grid-cols-3 max-md:grid-cols-1 gap-8">
          <div className="border border-gray-200 rounded-2xl p-8 hover:border-[#FF5B04] transition-colors">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🧠</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Product Thinking, Not Just Design
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              We start with competitive analysis, market positioning, and
              product strategy. We help you make the right product decisions
              before designing a single pixel.
            </p>
          </div>

          <div className="border border-gray-200 rounded-2xl p-8 hover:border-[#FF5B04] transition-colors">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🏗️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Idea to Architecture to Code
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              From your few lines of vision, we build the information
              architecture, user flows, wireframes, high-fidelity UI, and
              production-ready Angular/React code.
            </p>
          </div>

          <div className="border border-gray-200 rounded-2xl p-8 hover:border-[#FF5B04] transition-colors">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Complex Enterprise Specialist
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Multi-role dashboards, data-heavy interfaces, intricate user
              flows, and real business logic. We specialize in the hard
              problems other agencies avoid.
            </p>
          </div>
        </div>
      </section>

      {/* Design Style & Approach */}
      <section className="container mx-auto px-32 lg:px-20 max-md:px-4 py-20 bg-white">
        <h2 className="text-3xl max-md:text-2xl font-bold text-gray-900 mb-4">
          Our Design Style
        </h2>
        <p className="text-lg text-gray-600 mb-12 max-w-3xl">
          We don't just make it look good; we design for conversion, clarity, and scale.
        </p>

        <div className="grid grid-cols-3 max-md:grid-cols-1 gap-8">
          <div className="border border-gray-200 rounded-2xl p-8 hover:border-[#FF5B04] transition-colors">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Dashboards & SaaS UX
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Clean, intuitive, and data-driven. We tame complexity by organizing dense information into clear, actionable interfaces.
            </p>
          </div>

          <div className="border border-gray-200 rounded-2xl p-8 hover:border-[#FF5B04] transition-colors">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Websites & Landing Pages
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Fast and conversion-focused. Every section is strategically crafted to guide the user toward the core CTA.
            </p>
          </div>

          <div className="border border-gray-200 rounded-2xl p-8 hover:border-[#FF5B04] transition-colors">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Pixel-Perfect Execution
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              From Figma to code, we ensure the final product matches the vision exactly. No lost details in handoff.
            </p>
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-32 lg:px-20 max-md:px-4">
          <h2 className="text-3xl max-md:text-2xl font-bold mb-4">
            Our Approach
          </h2>
          <p className="text-lg text-gray-400 mb-12 max-w-2xl">
            Simple: you share your vision. We do the rest — from thinking to
            shipping.
          </p>

          <div className="grid grid-cols-3 max-md:grid-cols-1 gap-6">
            {process.map((step) => (
              <div
                key={step.step}
                className="border border-gray-700 rounded-2xl p-6 hover:border-[#FF5B04] transition-colors"
              >
                <span className="text-[#FF5B04] font-mono text-sm font-bold">
                  {step.step}
                </span>
                <h3 className="text-xl font-semibold mt-2 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="container mx-auto px-32 lg:px-20 max-md:px-4 py-20">
        <h2 className="text-3xl max-md:text-2xl font-bold text-gray-900 mb-4">
          Technology Stack
        </h2>
        <p className="text-lg text-gray-600 mb-12 max-w-2xl">
          We build with modern, scalable technologies — specializing in Angular
          and React for complex enterprise applications.
        </p>

        <div className="flex flex-wrap gap-4">
          {technologies.map((tech) => (
            <div
              key={tech.name}
              className="border border-gray-200 rounded-full px-6 py-3 hover:border-[#FF5B04] transition-colors"
            >
              <span className="text-sm font-medium text-gray-900">
                {tech.name}
              </span>
              <span className="text-xs text-gray-400 ml-2">
                {tech.category}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Industries */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-32 lg:px-20 max-md:px-4">
          <h2 className="text-3xl max-md:text-2xl font-bold text-gray-900 mb-4">
            Industries We Serve
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl">
            From fintech dashboards to healthcare platforms, we understand the
            unique challenges of each industry.
          </p>

          <div className="grid grid-cols-4 max-md:grid-cols-2 gap-4">
            {industries.map((industry) => (
              <div
                key={industry}
                className="bg-white border border-gray-200 rounded-xl p-5 text-center hover:border-[#FF5B04] transition-colors"
              >
                <p className="text-sm font-medium text-gray-800">{industry}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="container mx-auto px-32 lg:px-20 max-md:px-4 py-20">
        <h2 className="text-3xl max-md:text-2xl font-bold text-gray-900 mb-4">
          Our Team
        </h2>
        <p className="text-lg text-gray-600 mb-12 max-w-2xl">
          A small, focused team of product designers and developers who care
          deeply about shipping great products.
        </p>

        <div className="grid grid-cols-3 max-md:grid-cols-1 gap-8">
          {team.map((member) => (
            <div
              key={member.name}
              className="border border-gray-200 rounded-2xl p-8"
            >
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-gray-500">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {member.name}
              </h3>
              <p className="text-sm text-[#FF5B04] font-medium mb-3">
                {member.role}
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                {member.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Trusted By */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-32 lg:px-20 max-md:px-4">
          <h2 className="text-3xl max-md:text-2xl font-bold text-gray-900 mb-12">
            Trusted by Teams Across the Globe
          </h2>
          <div className="grid grid-cols-4 max-lg:grid-cols-2 max-md:grid-cols-1 gap-6">
            {clients.map((client) => (
              <div
                key={client.name}
                className="bg-white border border-gray-200 rounded-xl p-6"
              >
                <p className="font-semibold text-gray-900">{client.name}</p>
                <p className="text-sm text-gray-500 mt-1">{client.location}</p>
                <p className="text-xs text-[#FF5B04] mt-2">{client.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-32 lg:px-20 max-md:px-4 py-20 text-center">
        <h2 className="text-3xl max-md:text-2xl font-bold text-gray-900 mb-4">
          Ready to Turn Your Idea Into a Product?
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Book a free 15-minute call. Tell us about your product vision — we'll
          show you how we can bring it to life.
        </p>
        <div className="flex flex-row max-md:flex-col items-center justify-center gap-4">
          <Link
            className="bg-[#FF5B04] text-white px-8 py-4 rounded-full font-semibold hover:bg-orange-600 transition-colors"
            href="https://cal.com/ui-pirate/15min"
            target="_blank"
          >
            Book a Free Call
          </Link>
          <Link
            className="border border-gray-300 text-gray-700 px-8 py-4 rounded-full font-semibold hover:border-[#FF5B04] hover:text-[#FF5B04] transition-colors"
            href="/ourWorks"
          >
            See Our Work
          </Link>
        </div>
      </section>
    </div>
  );
}
