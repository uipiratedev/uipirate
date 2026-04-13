"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import GlassSurface from "@/components/GlassSurface";
import PageWrapper from "@/components/PageWrapper";

const sections = [
  {
    id: "introduction",
    title: "1. Introduction",
    content: `UI Pirate ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website uipirate.com. Please read this policy carefully. If you disagree with its terms, please discontinue use of the site.`,
  },
  {
    id: "information-we-collect",
    title: "2. Information We Collect",
    subsections: [
      {
        title: "2.1 Information You Provide",
        content:
          "We may collect personal information that you voluntarily provide to us when you:",
        bullets: [
          "Contact us through our contact forms",
          "Subscribe to our newsletter",
          "Request a consultation or quote",
          "Engage with our services",
          "Join our waitlist",
        ],
      },
      {
        title: "2.2 Automatically Collected Information",
        content:
          "When you visit our website, we automatically collect certain information about your device and browsing behavior through cookies and similar technologies, including IP address, browser type, pages visited, and time spent.",
      },
    ],
  },
  {
    id: "cookies",
    title: "3. Cookies & Tracking Technologies",
    content:
      "We use cookies and similar tracking technologies to track activity on our website and store certain information. You can control cookies through our cookie consent banner and your browser settings.",
    cards: [
      {
        title: "Necessary Cookies",
        description:
          "Essential for the website to function properly. These enable basic functions like page navigation and access to secure areas.",
        icon: "🔒",
      },
      {
        title: "Analytics Cookies (Google Analytics)",
        description:
          "Track website usage, visitor behavior, and traffic sources. Data is stored on Google servers. You may opt out via Google's opt-out tools.",
        icon: "📊",
      },
      {
        title: "Session Recording (Microsoft Clarity)",
        description:
          "Records user sessions, heatmaps, and interaction patterns to improve user experience. Review Microsoft's Privacy Statement for details.",
        icon: "🎯",
      },
    ],
  },
  {
    id: "how-we-use",
    title: "4. How We Use Your Information",
    content: "We use the information we collect to:",
    bullets: [
      "Provide, operate, and maintain our website",
      "Improve, personalize, and expand our website and services",
      "Understand and analyze how you use our website",
      "Develop new products, services, features, and functionality",
      "Communicate with you for customer service, updates, and marketing",
      "Process your transactions and manage your requests",
      "Find and prevent fraud",
    ],
  },
  {
    id: "your-rights",
    title: "5. Your Rights (GDPR & Privacy Laws)",
    content:
      "If you are a resident of the European Economic Area (EEA), United Kingdom, or other jurisdictions with applicable privacy laws, you have certain data protection rights:",
    bullets: [
      "Right to Access — Request copies of your personal data",
      "Right to Rectification — Request correction of inaccurate data",
      "Right to Erasure — Request deletion of your personal data",
      "Right to Restrict Processing — Request limitation of processing",
      "Right to Data Portability — Request transfer of your data",
      "Right to Object — Object to processing of your data",
      "Right to Withdraw Consent — Withdraw consent at any time",
    ],
  },
  {
    id: "data-retention",
    title: "6. Data Retention",
    content:
      "We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. Analytics data is retained as per respective third-party service policies.",
  },
  {
    id: "third-party",
    title: "7. Third-Party Services",
    content: "Our website uses third-party services that may collect information:",
    bullets: [
      "Google Analytics — Analytics & behavior tracking",
      "Microsoft Clarity — Analytics & session recording",
      "Vercel Speed Insights — Performance monitoring",
      "Cloudinary — Image hosting and delivery",
    ],
  },
  {
    id: "international",
    title: "8. International Data Transfers",
    content:
      "Your information may be transferred to and maintained on computers located outside of your state, province, country, or other governmental jurisdiction where data protection laws may differ. We ensure appropriate safeguards are in place for such transfers.",
  },
  {
    id: "cookie-management",
    title: "9. Cookie Consent Management",
    content: "You can manage your cookie preferences at any time by:",
    bullets: [
      "Clearing your browser cookies and revisiting our website",
      "Adjusting your browser settings to block or delete cookies",
      "Using our cookie consent banner when it appears on your first visit",
    ],
  },
  {
    id: "changes",
    title: "10. Changes to This Privacy Policy",
    content:
      'We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: "easeOut" },
  }),
};

const PrivacyPolicyScreen = () => {
  return (
    <PageWrapper showFloatingButton={false}>
      <div className="relative min-h-screen bg-white">
        {/* Consistent Hero Component */}
        <div className="flex flex-row items-center justify-center py-6 pt-20 w-full max-md:py-0 max-md:pt-16 relative ">
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
                LEGAL PROVISIONS
              </p>
            </GlassSurface>

            <div className="relative z-10 w-full mb-6">
              <h1 className="text-[40px] 3xl:text-[80px] 2xl:text-[74px] xl:text-[61px] lg:text-[48px] px-4 text-center font-[700] max-md:font-[600] max-md:leading-[1.08] max-md:px-1 tracking-[-1.5px] leading-[1.1] relative reveal-text-anim">
                <span className="text-black">Privacy </span>
                <span className="text-[#FF5B04]">Policy</span>
              </h1>
            </div>

            <p className="reveal-text-anim-1 max-w-[820px] 2xl:max-w-[1000px] text-center text-lg 2xl:text-xl max-md:text-sm mt-4 md:my-4 2xl:px-3 px-4 leading-[25.2px] 2xl:leading-[32px] text-gray-600">
              We respect your privacy. Here&apos;s everything you need to know about how UI Pirate collects, uses, and protects your information.
            </p>

            <p
              className="mt-4 text-gray-400 text-sm font-mono"
              style={{
                animation: "fade-in 0.8s ease-out forwards",
                animationDelay: "0.4s",
                opacity: 0,
              }}
            >
              Last Updated: April 13, 2025
            </p>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="container mx-auto xl:px-32 max-xl:px-8 max-md:px-4 py-16 max-md:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12 max-lg:gap-8">
            {/* Sticky TOC */}
            <aside className="hidden lg:block">
              <div className="sticky top-32 bg-gray-50 border border-gray-100 rounded-3xl p-6">
                <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-4">
                  Contents
                </p>
                <nav className="flex flex-col gap-2">
                  {sections.map((s) => (
                    <a
                      key={s.id}
                      className="text-sm text-gray-600 hover:text-black font-medium transition-colors py-1 px-2 rounded-lg hover:bg-gray-100 truncate"
                      href={`#${s.id}`}
                    >
                      {s.title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex flex-col gap-12">
              {sections.map((section, i) => (
                <motion.section
                  key={section.id}
                  animate="visible"
                  custom={i}
                  id={section.id}
                  initial="hidden"
                  variants={fadeUp}
                  viewport={{ once: true }}
                >
                  <h2 className="text-2xl max-md:text-xl font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                    {section.title}
                  </h2>

                  {section.content && (
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {section.content}
                    </p>
                  )}

                  {section.bullets && (
                    <ul className="space-y-2 mb-4">
                      {section.bullets.map((b, bi) => (
                        <li key={bi} className="flex items-start gap-3 text-gray-600">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.subsections && (
                    <div className="flex flex-col gap-6">
                      {section.subsections.map((sub, si) => (
                        <div key={si} className="bg-gray-50 rounded-2xl p-6">
                          <h3 className="text-base font-semibold text-gray-900 mb-2">
                            {sub.title}
                          </h3>
                          <p className="text-gray-600 text-sm leading-relaxed mb-3">
                            {sub.content}
                          </p>
                          {sub.bullets && (
                            <ul className="space-y-1.5">
                              {sub.bullets.map((b, bi) => (
                                <li
                                  key={bi}
                                  className="flex items-start gap-2 text-sm text-gray-600"
                                >
                                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                                  {b}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {section.cards && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                      {section.cards.map((card, ci) => (
                        <div
                          key={ci}
                          className="bg-gray-50 border border-gray-100 rounded-2xl p-5 hover:border-orange-200 hover:shadow-sm transition-all"
                        >
                          <div className="text-2xl mb-3">{card.icon}</div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">
                            {card.title}
                          </h4>
                          <p className="text-xs text-gray-500 leading-relaxed">
                            {card.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.section>
              ))}

              {/* Contact Box */}
              <motion.section
                animate="visible"
                custom={sections.length}
                id="contact"
                initial="hidden"
                variants={fadeUp}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl max-md:text-xl font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                  11. Contact Us
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  If you have any questions about this Privacy Policy or wish to
                  exercise your rights, please reach out:
                </p>
                <div className="bg-black rounded-3xl p-8 max-md:p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 blur-[60px] rounded-full" />
                  <p className="text-white font-bold text-lg mb-1">UI Pirate</p>
                  <p className="text-white/50 text-sm mb-4">
                    by Vishal Anand — Design & Development Agency
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <a
                      className="text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors"
                      href="mailto:privacy@uipirate.com"
                    >
                      privacy@uipirate.com
                    </a>
                    <span className="text-white/20">·</span>
                    <a
                      className="text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors"
                      href="https://uipirate.com"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      uipirate.com
                    </a>
                  </div>
                </div>
              </motion.section>

              {/* Related Links */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                <Link
                  className="text-sm text-gray-500 hover:text-black font-medium transition-colors flex items-center gap-1.5 group"
                  href="/terms"
                >
                  <span className="text-orange-400 group-hover:translate-x-0.5 transition-transform">
                    →
                  </span>
                  Terms & Conditions
                </Link>
                <span className="text-gray-200">|</span>
                <Link
                  className="text-sm text-gray-500 hover:text-black font-medium transition-colors flex items-center gap-1.5 group"
                  href="/sitemap"
                >
                  <span className="text-orange-400 group-hover:translate-x-0.5 transition-transform">
                    →
                  </span>
                  Site Map
                </Link>
              </div>
            </main>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default PrivacyPolicyScreen;
