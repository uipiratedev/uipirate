"use client";
import Link from "next/link";

import PageWrapper from "@/components/PageWrapper";
import GlassSurface from "@/components/GlassSurface";

const Sitemap = () => {
  const sitemapData = {
    main: [
      { label: "Home", href: "/" },
      { label: "About Us", href: "/about" },
      { label: "Our Works", href: "/ourWorks" },
      { label: "Pricing", href: "/pricing" },
      { label: "Contact", href: "/contact" },
    ],
    services: [
      { label: "UX/UI Design", href: "/services/SaaS-Web-&-Mobile-Apps", desc: "SaaS, AI & mobile app design" },
      { label: "SaaS & AI Development", href: "/services/SaaS-Web-&-Mobile-Apps", desc: "Angular, React & Next.js frontend" },
      { label: "Landing Pages & Business Websites", href: "/services/Landing-Pages-&-Business-Websites", desc: "Conversion-focused marketing pages" },
      { label: "Graphic Design", href: "/services/Graphic-Design", desc: "Brand visuals & illustrations" },
      { label: "Motion Graphics & Video Editing", href: "/services/Motion-Graphics-&-Video-Editing", desc: "Animation, reels & video" },
      { label: "UX Audits & Consultation", href: "/services/UX-Audits-&-Consultation", desc: "Heuristic evaluation & UX strategy" },
      { label: "3D Animation & Rendering", href: "/services/3D-Animation-&-Rendering", desc: "3D assets, animation & renders" },
    ],
    resources: [
      { label: "Blogs & Tutorials", href: "/blogs" },
      { label: "FAQs", href: "/faqs" },
      { label: "Community Insights", href: "/community" },
      { label: "Apps 4 Sale", href: "/apps4sale" },
      { label: "Mini SaaS Apps", href: "/mini-saas-apps" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms and Conditions", href: "/terms" },
      { label: "Site Map", href: "/sitemap" },
    ],
  };

  return (
    <PageWrapper showFloatingButton={false}>
      <div className="container mx-auto xl:px-32 max-md:px-4 max-xl:px-4 max-2xl:px-0 ">
        {/* Consistent Hero Component */}
        <div className="flex flex-row items-center justify-center py-6 pt-10 w-full max-md:py-0 max-md:pt-4 relative ">
          {/* Subtle Grid Background Pattern */}
          <div
            className="absolute pointer-events-none -mt-20 "
            style={{
              backgroundImage: `
                  linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px)
                `,
              backgroundSize: "40px 40px",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              marginLeft: "calc(-50vw + 50%)",
            }}
          />
          {/* Layered gradient with gentle mist animation */}
          <div
            className="absolute pointer-events-none -mt-20 "
            style={{
              backgroundImage: `
                  linear-gradient(to top, rgba(250, 250, 250, 1), transparent 10%),
                  linear-gradient(to top, rgba(250, 250, 250, 1) 0%, transparent 35%)
                `,
              animation: "gentle-mist 8s ease-in-out infinite",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              marginLeft: "calc(-50vw + 50%)",
            }}
          />
          <div
            className="flex flex-col items-center justify-center w-full relative z-10 container mx-auto pb-6"
            style={{ overflow: "visible" }}
          >
            <GlassSurface
              backgroundOpacity={0.1}
              blueOffset={20}
              blur={11}
              borderRadius={12}
              borderWidth={0.01}
              brightness={50}
              className="md:my-9 max-md:my-5 !flex !flex-row !items-center !gap-3 isolate overflow-visible p-2 px-4 max-md:mx-2"
              displace={0.5}
              distortionScale={-180}
              forceLightMode={true}
              greenOffset={10}
              height="auto"
              opacity={0.93}
              redOffset={0}
              saturation={1}
              style={{
                animation: "trustBadgeUp 0.5s ease-out forwards",
                animationDelay: "0.1s",
                opacity: 0,
                transform: "translateY(20px) scale(0.95)",
              }}
              width="auto"
            >
              <p className="badge-text relative z-10 max-md:text-xs uppercase font-semibold tracking-wider">
                NAVIGATION
              </p>
            </GlassSurface>

            <div className="relative z-10 w-full mb-6">
              <h1 className="hero-header">
                <span className="text-black">Site </span>
                <span className="text-[#FF5B04]">Map</span>
              </h1>
            </div>

            <p className="sub-header text-gray-600">
              Navigate through all pages and sections of UI Pirate. Find everything you need quickly and easily.
            </p>
          </div>
        </div>

        {/* Sitemap Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-md:gap-4">

          {/* Main Pages */}
          <div className="bg-white rounded-3xl p-8 max-md:p-6 border border-gray-100 shadow-sm hover:border-brand-orange/20 hover:shadow-md transition-all">
            <h2 className="text-lg font-bold mb-5 text-gray-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-brand-orange/10 flex items-center justify-center text-sm">🏠</span>
              Main Pages
            </h2>
            <ul className="space-y-2">
              {sitemapData.main.map((item, index) => (
                <li key={index}>
                  <Link className="text-gray-600 hover:text-brand-orange font-medium transition-colors flex items-center gap-2 group text-sm" href={item.href}>
                    <span className="text-brand-orange/40 group-hover:translate-x-1 transition-transform">→</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="bg-white rounded-3xl p-8 max-md:p-6 border border-gray-100 shadow-sm hover:border-brand-orange/20 hover:shadow-md transition-all">
            <h2 className="text-lg font-bold mb-5 text-gray-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-brand-orange/10 flex items-center justify-center text-sm">📚</span>
              Resources
            </h2>
            <ul className="space-y-2">
              {sitemapData.resources.map((item, index) => (
                <li key={index}>
                  <Link className="text-gray-600 hover:text-brand-orange font-medium transition-colors flex items-center gap-2 group text-sm" href={item.href}>
                    <span className="text-brand-orange/40 group-hover:translate-x-1 transition-transform">→</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies & Legal */}
          <div className="bg-white rounded-3xl p-8 max-md:p-6 border border-gray-100 shadow-sm hover:border-brand-orange/20 hover:shadow-md transition-all">
            <h2 className="text-lg font-bold mb-5 text-gray-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-brand-orange/10 flex items-center justify-center text-sm">⚖️</span>
              Policies &amp; Legal
            </h2>
            <ul className="space-y-2">
              {sitemapData.legal.map((item, index) => (
                <li key={index}>
                  <Link className="text-gray-600 hover:text-brand-orange font-medium transition-colors flex items-center gap-2 group text-sm" href={item.href}>
                    <span className="text-brand-orange/40 group-hover:translate-x-1 transition-transform">→</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services — spans full width */}
          <div className="md:col-span-2 lg:col-span-3 bg-white rounded-3xl p-8 max-md:p-6 border border-gray-100 shadow-sm hover:border-brand-orange/20 hover:shadow-md transition-all">
            <h2 className="text-lg font-bold mb-5 text-gray-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-brand-orange/10 flex items-center justify-center text-sm">⚙️</span>
              Services
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {sitemapData.services.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="group flex flex-col gap-1 p-4 rounded-xl border border-gray-100 hover:border-brand-orange/30 hover:bg-orange-50/50 transition-all"
                >
                  <span className="text-gray-900 font-semibold text-sm group-hover:text-brand-orange transition-colors flex items-center gap-1">
                    <span className="text-brand-orange/40 group-hover:translate-x-1 transition-transform">→</span>
                    {item.label}
                  </span>
                  <span className="text-gray-400 text-xs">{item.desc}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 max-md:mt-8 bg-gradient-to-br from-[#212121] to-[#151514] rounded-3xl p-10 max-md:p-6 text-center noise-texture">
          <h3 className="text-2xl max-md:text-xl font-bold mb-3 text-white">
            Need Help Finding Something?
          </h3>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto text-sm">
            Can&apos;t find what you&apos;re looking for? Reach out directly — we respond within 2 hours.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              className="bg-brand-orange text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-brand-orange/90 transition-all hover:scale-105"
              href="https://cal.com/ui-pirate/15min"
              rel="noopener noreferrer"
              target="_blank"
            >
              📅 Book a Free Call
            </a>
            <a
              className="bg-white/10 border border-white/20 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-white/20 transition-all hover:scale-105"
              href="https://wa.me/919708636151"
              rel="noopener noreferrer"
              target="_blank"
            >
              <img alt="WhatsApp" className="h-[18px] invert" src="https://res.cloudinary.com/damm9iwho/image/upload/v1729511358/whatsapp_zssebt.svg" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Sitemap;
