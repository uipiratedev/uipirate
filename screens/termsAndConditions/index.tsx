"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import GlassSurface from "@/components/GlassSurface";
import PageWrapper from "@/components/PageWrapper";

const termsSections = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content:
      'By accessing and using the UI Pirate website (uipirate.com), you accept and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our website. These terms apply to all visitors, users, and others who access or use our services ("users").',
  },
  {
    id: "services",
    title: "2. Services",
    content:
      "UI Pirate provides premium UI/UX design and development services including, but not limited to:",
    bullets: [
      "SaaS Web & Mobile App Design",
      "Landing Pages & Corporate Websites",
      "Design Systems & Component Libraries",
      "Graphic Design & Brand Identity",
      "Motion Graphics & Video Editing",
      "UX Audits & Consultation",
      "3D Animation & Rendering",
    ],
  },
  {
    id: "intellectual-property",
    title: "3. Intellectual Property",
    content:
      "All content on this website, including but not limited to text, graphics, logos, images, audio clips, digital downloads, and data compilations, is the property of UI Pirate and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.",
    note: "Client deliverables and ownership rights are governed by individual project agreements and contracts.",
  },
  {
    id: "user-conduct",
    title: "4. User Conduct",
    content: "When using our website, you agree not to:",
    bullets: [
      "Use the site for any unlawful purpose or in violation of any regulations",
      "Transmit any unsolicited or unauthorized advertising or promotional material",
      "Attempt to gain unauthorized access to any portion of the website",
      "Engage in any conduct that restricts or inhibits anyone's use or enjoyment of the website",
      "Use any robot, spider, or other automated means to access the site",
      "Introduce viruses or other malicious code into the website",
    ],
  },
  {
    id: "disclaimers",
    title: "5. Disclaimers",
    content:
      'The information on this website is provided on an "as is" basis without any warranties, express or implied. UI Pirate disclaims all warranties including, without limitation, warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the website will be error-free or uninterrupted.',
  },
  {
    id: "limitation-of-liability",
    title: "6. Limitation of Liability",
    content:
      "To the fullest extent permitted by law, UI Pirate shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, goodwill, or other intangible losses, resulting from your access to or use of (or inability to access or use) our website or services.",
  },
  {
    id: "third-party-links",
    title: "7. Third-Party Links",
    content:
      "Our website may contain links to third-party websites. These links are provided for your convenience only. UI Pirate has no control over the content of those sites and accepts no responsibility for them or for any loss or damage that may arise from your use of them.",
  },
  {
    id: "project-agreements",
    title: "8. Project Agreements & Contracts",
    content:
      "All client engagements are governed by separate project agreements, statements of work, or contracts. In the event of any conflict between these Terms and a project agreement, the project agreement shall prevail. Key provisions typically include:",
    bullets: [
      "Project scope, timelines, and deliverables",
      "Payment terms and schedules",
      "Revision and feedback processes",
      "Intellectual property assignment upon payment",
      "Confidentiality obligations",
      "Termination clauses",
    ],
  },
  {
    id: "privacy",
    title: "9. Privacy",
    content:
      "Your use of this website is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our Privacy Policy to understand our practices.",
  },
  {
    id: "governing-law",
    title: "10. Governing Law",
    content:
      "These Terms shall be governed and construed in accordance with applicable laws, without regard to its conflict of law provisions. Any disputes arising under these terms shall be resolved through mutual negotiation, and if unsuccessful, through appropriate legal proceedings.",
  },
  {
    id: "changes",
    title: "11. Changes to Terms",
    content:
      'We reserve the right to modify or replace these Terms at any time at our sole discretion. We will provide reasonable notice of any significant changes by updating the "Last Updated" date. Your continued use of the website after any changes constitutes your acceptance of the new Terms.',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: "easeOut" },
  }),
};

const TermsAndConditionsScreen = () => {
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
              <h1 className="hero-header">
                <span className="text-black">Terms &amp; </span>
                <span className="text-[#FF5B04]">Conditions</span>
              </h1>
            </div>

            <p className="sub-header text-gray-600">
              Please read these terms carefully before using our website or engaging with our design and development services.
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

        {/* Main Layout */}
        <div className="container mx-auto xl:px-32 max-xl:px-8 max-md:px-4 py-16 max-md:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12 max-lg:gap-8">
            {/* Sticky TOC */}
            <aside className="hidden lg:block">
              <div className="sticky top-32 bg-gray-50 border border-gray-100 rounded-3xl p-6">
                <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-4">
                  Contents
                </p>
                <nav className="flex flex-col gap-2">
                  {termsSections.map((s) => (
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
              {termsSections.map((section, i) => (
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

                  {section.note && (
                    <div className="mt-4 border-l-2 border-orange-400 pl-4 py-2 bg-orange-50 rounded-r-xl">
                      <p className="text-sm text-orange-700">{section.note}</p>
                    </div>
                  )}
                </motion.section>
              ))}

              {/* Contact Box */}
              <motion.section
                animate="visible"
                custom={termsSections.length}
                id="contact"
                initial="hidden"
                variants={fadeUp}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl max-md:text-xl font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                  12. Contact Us
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  If you have any questions about these Terms and Conditions,
                  please contact us:
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
                      href="mailto:hello@uipirate.com"
                    >
                      hello@uipirate.com
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
                  href="/privacy"
                >
                  <span className="text-orange-400 group-hover:translate-x-0.5 transition-transform">
                    →
                  </span>
                  Privacy Policy
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

export default TermsAndConditionsScreen;
