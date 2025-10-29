"use client";
import PageWrapper from "@/components/PageWrapper";
import Link from "next/link";

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
      { label: "Blogs", href: "/resources" },
      { label: "FAQs", href: "/faqs" },
    ],
    contact: [{ label: "Contact", href: "/contact" }],
  };

  return (
    <PageWrapper showFloatingButton={false}>
      <div className="container mx-auto xl:px-32 max-md:px-4 max-xl:px-4 max-2xl:px-0 py-20 max-md:py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 max-md:mb-12">
          <div className="mb-6 flex flex-row items-center justify-center">
            <span className="rounded-xl border-2 border-cyan-400 bg-[#8EF1F1] px-4 py-2 font-semibold uppercase text-sm">
              Navigation
            </span>
          </div>
          <h1 className="heading-center mb-6">Site Map</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Navigate through all pages and sections of UI Pirate. Find
            everything you need quickly and easily.
          </p>
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
                  href={sitemapData.services.main.href}
                  className="text-gray-700 hover:text-black font-bold transition-colors flex items-center gap-2 group"
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
            Can't find what you're looking for? Feel free to reach out to us
            directly, and we'll be happy to help!
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://wa.me/919708636151"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:scale-105 transition-transform duration-300"
            >
              <img
                src="https://res.cloudinary.com/damm9iwho/image/upload/v1729511358/whatsapp_zssebt.svg"
                alt="WhatsApp"
                className="h-[22px] invert"
              />
              Chat on WhatsApp
            </a>
            <a
              href="https://cal.com/vishal-anand/introduction-and-free-ui-ux-strategy-session"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-black border-2 border-black px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform duration-300"
            >
              😀 Schedule a Call
            </a>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Sitemap;
