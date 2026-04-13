"use client";
import Link from "next/link";

import PageWrapper from "@/components/PageWrapper";
import GlassSurface from "@/components/GlassSurface";

const Sitemap = () => {
  const sitemapData = {
    main: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
    ],
    services: {
      main: { label: "Services", href: "/services" },
      items: [
        {
          label: "SaaS Web & Mobile Apps",
          href: "/services/SaaS-Web-&-Mobile-Apps",
        },
        {
          label: "Landing Pages & Corporate Websites",
          href: "/services/Landing-Pages-&-Corporate-Websites",
        },
        {
          label: "Design System & Component Library",
          href: "/services/Design-System-&-Component-Library",
        },
        { label: "Graphic Design", href: "/services/Graphic-Design" },
        {
          label: "Motion Graphics & Video Editing",
          href: "/services/Motion-Graphics-&-Video-Editing",
        },
        {
          label: "UX Audits & Consultation",
          href: "/services/UX-Audits-&-Consultation",
        },
        {
          label: "3D Animation & Rendering",
          href: "/services/3D-Animation-&-Rendering",
        },
      ],
    },
    portfolio: [{ label: "Our Works", href: "/ourWorks" }],
    pricing: [{ label: "Pricing", href: "/pricing" }],
    resources: [
      { label: "Blogs", href: "/blogs" },
      { label: "FAQs", href: "/faqs" },
      { label: "Community Insights", href: "/community" },
      { label: "Apps 4 Sale", href: "/apps4sale" },
      { label: "Mini SaaS Apps", href: "/mini-saas-apps" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms and Conditions", href: "/terms" },
    ],
    contact: [{ label: "Contact", href: "/contact" }],
  };

  return (
    <PageWrapper showFloatingButton={false}>
      <div className="container mx-auto xl:px-32 max-md:px-4 max-xl:px-4 max-2xl:px-0 py-20 max-md:py-12">
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
              <h1 className="text-[40px] 3xl:text-[80px] 2xl:text-[74px] xl:text-[61px] lg:text-[48px] px-4 text-center font-[700] max-md:font-[600] max-md:leading-[1.08] max-md:px-1 tracking-[-1.5px] leading-[1.1] relative reveal-text-anim">
                <span className="text-black">Site </span>
                <span className="text-[#FF5B04]">Map</span>
              </h1>
            </div>

            <p className="reveal-text-anim-1 max-w-[820px] 2xl:max-w-[1000px] text-center text-lg 2xl:text-xl max-md:text-sm mt-4 md:my-4 2xl:px-3 px-4 leading-[25.2px] 2xl:leading-[32px] text-gray-600">
              Navigate through all pages and sections of UI Pirate. Find everything you need quickly and easily.
            </p>
          </div>
        </div>

        {/* Sitemap Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-md:gap-6">
          {/* Main Pages */}
          <div className="bg-white rounded-3xl p-8 max-md:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
              <span className="text-3xl">🏠</span>
              Main Pages
            </h2>
            <ul className="space-y-3">
              {sitemapData.main.map((item, index) => (
                <li key={index}>
                  <Link
                    className="text-gray-700 hover:text-black font-medium transition-colors flex items-center gap-2 group"
                    href={item.href}
                  >
                    <span className="text-cyan-400 group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="bg-white rounded-3xl p-8 max-md:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
              <span className="text-3xl">⚙️</span>
              Services
            </h2>
            <ul className="space-y-3">
              <li>
                <Link
                  className="text-gray-700 hover:text-black font-bold transition-colors flex items-center gap-2 group"
                  href={sitemapData.services.main.href}
                >
                  <span className="text-cyan-400 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                  {sitemapData.services.main.label}
                </Link>
              </li>
              {/* <li className="ml-4 mt-2">
                <ul className="space-y-2">
                  {sitemapData.services.items.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="text-gray-600 hover:text-black text-sm transition-colors flex items-center gap-2 group"
                      >
                        <span className="text-cyan-300 group-hover:translate-x-1 transition-transform text-xs">→</span>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li> */}
            </ul>
          </div>

          {/* Portfolio */}
          <div className="bg-white rounded-3xl p-8 max-md:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
              <span className="text-3xl">💼</span>
              Portfolio
            </h2>
            <ul className="space-y-3">
              {sitemapData.portfolio.map((item, index) => (
                <li key={index}>
                  <Link
                    className="text-gray-700 hover:text-black font-medium transition-colors flex items-center gap-2 group"
                    href={item.href}
                  >
                    <span className="text-cyan-400 group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-3xl p-8 max-md:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
              <span className="text-3xl">💰</span>
              Pricing
            </h2>
            <ul className="space-y-3">
              {sitemapData.pricing.map((item, index) => (
                <li key={index}>
                  <Link
                    className="text-gray-700 hover:text-black font-medium transition-colors flex items-center gap-2 group"
                    href={item.href}
                  >
                    <span className="text-cyan-400 group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="bg-white rounded-3xl p-8 max-md:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
              <span className="text-3xl">📚</span>
              Resources
            </h2>
            <ul className="space-y-3">
              {sitemapData.resources.map((item, index) => (
                <li key={index}>
                  <Link
                    className="text-gray-700 hover:text-black font-medium transition-colors flex items-center gap-2 group"
                    href={item.href}
                  >
                    <span className="text-cyan-400 group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies & Legal */}
          <div className="bg-white rounded-3xl p-8 max-md:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
              <span className="text-3xl">⚖️</span>
              Policies &amp; Legal
            </h2>
            <ul className="space-y-3">
              {sitemapData.legal.map((item, index) => (
                <li key={index}>
                  <Link
                    className="text-gray-700 hover:text-black font-medium transition-colors flex items-center gap-2 group"
                    href={item.href}
                  >
                    <span className="text-cyan-400 group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  className="text-gray-700 hover:text-black font-medium transition-colors flex items-center gap-2 group"
                  href="/sitemap"
                >
                  <span className="text-cyan-400 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                  Site Map
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          {/* <div className="bg-white rounded-3xl p-8 max-md:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
              <span className="text-3xl">📧</span>
              Contact
            </h2>
            <ul className="space-y-3">
              {sitemapData.contact.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className="text-gray-700 hover:text-black font-medium transition-colors flex items-center gap-2 group"
                  >
                    <span className="text-cyan-400 group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div> */}
        </div>

        {/* Additional Info Section */}
        <div className="mt-16 max-md:mt-12 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-3xl p-8 max-md:p-6 text-center">
          <h3 className="text-2xl font-bold mb-4 text-gray-900">
            Need Help Finding Something?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Can&apos;t find what you&apos;re looking for? Feel free to reach out
            to us directly, and we&apos;ll be happy to help!
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              className="bg-black text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:scale-105 transition-transform duration-300"
              href="https://wa.me/919708636151"
              rel="noopener noreferrer"
              target="_blank"
            >
              <img
                alt="WhatsApp"
                className="h-[22px] invert"
                src="https://res.cloudinary.com/damm9iwho/image/upload/v1729511358/whatsapp_zssebt.svg"
              />
              Chat on WhatsApp
            </a>
            <Link
              className="bg-white text-black border-2 border-black px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform duration-300"
              href="/contact"
              rel="noopener noreferrer"
            >
              😀 Schedule a Call
            </Link>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Sitemap;
