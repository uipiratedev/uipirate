"use client";

import { motion, useInView } from "framer-motion";
import { Link } from "@heroui/link";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState, useMemo } from "react";

import ProPirateFooterSection from "./proPirate";
import LeadCaptureModal from "./LeadCaptureModal";

import JoinTactileButton from "@/components/JoinTactileButton";
import { useClickSound } from "@/hooks/useClickSound";
import { getCtaConfig, PageCTAConfig } from "@/config/ctaConfig";

const footerSocialLinks = [
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/company/ui-pirate-by-vishal-anand/",
    icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1770280207/in_ucqlrn.svg",
  },
  {
    name: "twitter",
    url: "https://twitter.com/ui_pirate",
    icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1770280207/x_n6sgau.svg",
  },
  {
    name: "Dribbble",
    url: "https://dribbble.com/vishalanandUIUX",
    icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1770280207/redit_v3rdpt.svg",
  },
  {
    name: "Upwork",
    url: "https://www.upwork.com/agencies/1837026757439552424/",
    icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1770280706/up_a4rhmj.svg",
  },
  {
    name: "Behance",
    url: "https://www.behance.net/vishalanand-UI-UX",
    icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1770280706/be_k40rwo.svg",
  },

  {
    name: "Clutch",
    url: "https://clutch.co/profile/ui-pirate-vishal-anand",
    icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1770280807/cl_zlzmht.svg",
  },
];

/**
 * Footer Section Component
 *
 * Footer with CTA, social links, and branding.
 * Features a gradient button matching the design system.
 */
interface FooterProps {
  ctaOverride?: Partial<PageCTAConfig>;
}

export const Footer: React.FC<FooterProps> = ({ ctaOverride }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const playClickSound = useClickSound();
  const pathname = usePathname();
  const router = useRouter();

  const cta = useMemo(() => {
    const base = getCtaConfig(pathname);
    return ctaOverride ? { ...base, ...ctaOverride } : base;
  }, [pathname, ctaOverride]);

  // The background marquee strip is an infinite marquee. Gated to on-screen only.
  const marqueeRef = useRef<HTMLDivElement>(null);
  const marqueeInView = useInView(marqueeRef, { margin: "200px" });

  const handlePrimaryClick = () => {
    playClickSound();
    if (cta.primaryButton.action === "link" && cta.primaryButton.href) {
      if (cta.primaryButton.isExternal) {
        window.open(cta.primaryButton.href, "_blank", "noopener,noreferrer");
      } else {
        router.push(cta.primaryButton.href);
      }
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <footer
      className="relative w-full bg-black/95 pt-24 max-md:pt-12 overflow-hidden noise-texture noise-texture "
      id="site-footer"
    >
      {/* Top Light Effect */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-white via-white/90 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[40vh] bg-white/5 blur-[80px] -translate-y-1/2" />

      {/* Content */}
      <div className="relative z-20  mx-auto text-center">
        {/* Dynamic CTA Section */}
        <motion.div
          className="mb-24 max-md:mb-6 relative"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          {/* Heading */}
          <h2 className="footer-heading max-w-4xl mx-auto px-4 leading-tight">
            {cta.heading}
          </h2>

          {/* Description (subheading) */}
          {cta.description && (
            <p className="text-gray-400 text-base max-md:text-sm max-w-xl mx-auto mt-4 px-4 leading-relaxed font-normal">
              {cta.description}
            </p>
          )}

          {/* Action Buttons & Marquee Section */}
          <div className="flex flex-col items-center justify-center mb-16 max-md:mb-6 mt-10 max-md:mt-6">
            {/* Tactile Button with Marquee centered directly behind it */}
            <div className="relative w-full flex justify-center items-center">
              {/* Background Text - Marquee - Perfectly Centered Behind Button */}
              <div
                ref={marqueeRef}
                className="absolute top-1/2 left-0 right-0 -translate-y-1/2 opacity-[0.03] pointer-events-none overflow-hidden"
                style={{
                  WebkitMaskImage:
                    "linear-gradient(to right, white 0%, white 20%, transparent 35%, transparent 65%, white 80%, white 100%)",
                  maskImage:
                    "linear-gradient(to right, white 0%, white 20%, transparent 35%, transparent 65%, white 80%, white 100%)",
                }}
              >
                <motion.div
                  animate={marqueeInView ? { x: ["0%", "-50%"] } : { x: "0%" }}
                  className="flex whitespace-nowrap"
                  transition={{
                    x: {
                      repeat: Infinity,
                      repeatType: "loop",
                      duration: 25,
                      ease: "linear",
                    },
                  }}
                >
                  {[...Array(4)].map((_, i) => (
                    <span
                      key={i}
                      className="text-[100px] max-md:text-[50px] font-bold leading-[100%] tracking-[0px] align-middle uppercase text-white mx-12 font-jetbrains-mono"
                      style={{
                        // @ts-ignore
                        leadingTrim: "none",
                      }}
                    >
                      {cta.marqueeText || "SAAS WEB APP"}
                    </span>
                  ))}
                </motion.div>
              </div>

              {/* Primary JoinTactileButton with responsive sizing */}
              <div
                className={`relative z-20 flex justify-center w-full px-3 ${
                  cta.primaryButton.label.length > 15
                    ? "max-w-[660px] max-xl:max-w-[540px] max-lg:max-w-[460px] max-md:max-w-[340px] max-sm:max-w-[300px]"
                    : "max-w-[560px] max-xl:max-w-[480px] max-lg:max-w-[420px] max-md:max-w-[320px] max-sm:max-w-[280px]"
                }`}
              >
                <JoinTactileButton
                  label={cta.primaryButton.label}
                  size="auto"
                  variant="orange"
                  onClick={handlePrimaryClick}
                />
              </div>
            </div>

            {/* Secondary Ghost Link Button */}
            {cta.secondaryButton && (
              <div className="relative z-30 mt-5">
                {cta.secondaryButton.action === "modal" ? (
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setIsModalOpen(true);
                    }}
                    className="group inline-flex items-center gap-1.5 text-sm md:text-base font-medium text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
                  >
                    <span className="underline-offset-4 group-hover:underline">
                      {cta.secondaryButton.label}
                    </span>
                    <svg
                      className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </button>
                ) : cta.secondaryButton.isExternal ? (
                  <a
                    href={cta.secondaryButton.href || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => playClickSound()}
                    className="group inline-flex items-center gap-1.5 text-sm md:text-base font-medium text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <span className="underline-offset-4 group-hover:underline">
                      {cta.secondaryButton.label}
                    </span>
                    <svg
                      className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                      />
                    </svg>
                  </a>
                ) : (
                  <NextLink
                    href={cta.secondaryButton.href || "#"}
                    onClick={() => playClickSound()}
                    className="group inline-flex items-center gap-1.5 text-sm md:text-base font-medium text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <span className="underline-offset-4 group-hover:underline">
                      {cta.secondaryButton.label}
                    </span>
                    <svg
                      className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </NextLink>
                )}
              </div>
            )}
          </div>

          {/* Lead Capture Modal */}
          <LeadCaptureModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </motion.div>


        {/* Footer Navigation Grid */}
        <motion.div
          className="container mx-auto px-4 sm:px-6 lg:px-20 xl:px-32 mt-20 max-md:mt-0 pb-16 max-md:pb-0"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-12 text-left pt-12 max-md:pt-10">
            {/* Branding/Tagline Section */}
            <div className="lg:col-span-3 max-md:col-span-2 flex flex-col gap-8">
              <p className="text-[18px] md:text-[24px] font-bold text-white leading-[1.3] max-w-sm">
                Premium{" "}
                <span className="text-orange-500  ">
                  UI/UX Design & Development
                </span>{" "}
                for SaaS & AI Products.
              </p>
            </div>

            {/* Quick Links Column */}
            <div className="lg:col-span-2">
              <h4 className="link-heading">Quick Links</h4>
              <ul className="flex flex-col gap-1">
                <li>
                  <Link className="footer-text" href="/">
                    Home
                  </Link>
                </li>
                <li>
                  <Link className="footer-text" href="/case-studies">
                    Works
                  </Link>
                </li>
                <li>
                  <Link className="footer-text" href="/pricing">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link className="footer-text" href="/about">
                    About
                  </Link>
                </li>
                <li>
                  <Link className="footer-text" href="/process">
                    Our Process
                  </Link>
                </li>
                <li>
                  <Link className="footer-text" href="https://propirates.com">
                    ProPirates
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services Column */}
            <div className="lg:col-span-3">
              <h4 className="link-heading">Services</h4>
              <ul className="flex flex-col gap-1">
                <li>
                  <Link className="footer-text" href="/services/UX-UI-Design">
                    UX/UI Design
                  </Link>
                </li>
                <li>
                  <Link
                    className="footer-text"
                    href="/services/SaaS-&-AI-Development"
                  >
                    SaaS & AI Development
                  </Link>
                </li>
                <li>
                  <Link
                    className="footer-text"
                    href="/services/Landing-Pages-&-Business-Websites"
                  >
                    Landing Pages
                  </Link>
                </li>
                <li>
                  <Link
                    className="footer-text"
                    href="/services/UX-Audits-&-Consultation"
                  >
                    UX Audits
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources Column */}
            <div className="lg:col-span-2">
              <h4 className="link-heading">Resources</h4>
              <ul className="flex flex-col gap-1">
                <li>
                  <Link className="footer-text" href="/blogs">
                    Blogs
                  </Link>
                </li>
                {/* <li><Link href="/case-studies" className="footer-text">Case Studies</Link></li> */}
                <li>
                  <Link className="footer-text" href="/apps4sale">
                    Apps 4 Sale
                  </Link>
                </li>
                <li>
                  <Link className="footer-text" href="/componentlab">
                    Component Lab
                  </Link>
                </li>
                <li>
                  <Link className="footer-text" href="/buttons">
                    3D Tactile Buttons
                  </Link>
                </li>
                <li>
                  <Link className="footer-text" href="/faqs">
                    FAQ’s
                  </Link>
                </li>
              </ul>
            </div>

            {/* Policies Column */}
            <div className="lg:col-span-2">
              <h4 className="link-heading">Policies & Legal</h4>
              <ul className="flex flex-col gap-1">
                <li>
                  <Link className="footer-text" href="/privacy">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link className="footer-text" href="/terms">
                    Terms and Conditions
                  </Link>
                </li>
                <li>
                  <Link className="footer-text" href="/sitemap">
                    Site Map
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright Strip */}
          <div className="mt-24 max-md:mt-12 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[13px] text-white/30 font-medium">
              Copyright©2023 UI Pirate. All Rights Reserved.
            </p>
            {/* Social Links Sub-section */}
            <div className="flex items-center gap-4 mt-2">
              {footerSocialLinks.map((link) => (
                <Link
                  key={link.name}
                  isExternal
                  className="group relative"
                  href={link.url}
                >
                  <div className=" flex items-center p-3 max-md:p-2 justify-center rounded-lg bg-white/5 border border-white/10 group-hover:bg-orange-500 group-hover:border-orange-500 transition-[background-color,border-color] duration-300">
                    <img
                      alt={link.name}
                      className="w-4 h-4 max-md:w-5 max-md:h-5 brightness-100 group-hover:invert transition-[filter] duration-300"
                      src={link.icon}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Torch Effect Section */}
      <ProPirateFooterSection />
    </footer>
  );
};