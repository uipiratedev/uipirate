"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDisclosure, Modal, ModalContent, ModalBody } from "@heroui/react";
import LetsTalkButton from "@/components/LetsTalkButton";
import ProjectEstimate from "@/components/ProjectEstimate";
import testimonials from "@/data/testimonials.json";

const US_TESTIMONIALS = testimonials.filter((t) =>
  t.company.toLowerCase().includes("us") ||
  t.company.toLowerCase().includes("new york") ||
  t.company.toLowerCase().includes("california") ||
  t.company.toLowerCase().includes("texas") ||
  t.company.toLowerCase().includes("san francisco") ||
  t.company.toLowerCase().includes("new jersey")
);

const TRUST_STATS = [
  { value: "50+", label: "Products Shipped" },
  { value: "5.0★", label: "Average Rating" },
  { value: "< 2hr", label: "Response Time" },
  { value: "11yr", label: "In Business" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function ContactPageClient() {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [modalPlacement, setModalPlacement] = useState<"center" | "bottom" | "top" | "top-center" | "bottom-center">("center");

  useEffect(() => {
    const handleResize = () => {
      setModalPlacement(window.innerWidth < 768 ? "bottom" : "center");
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <div className="min-h-screen bg-white pt-24 max-md:pt-20">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="container mx-auto px-8 max-md:px-4 pt-12 pb-8 text-center">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
          className="inline-block text-[11px] font-jetbrains-mono uppercase tracking-[0.18em] bg-black/5 text-gray-500 px-4 py-1.5 rounded-full mb-5"
        >
          Let's Build Something Great
        </motion.p>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
          className="hero-header max-w-3xl mx-auto mb-5"
        >
          Talk to Us About{" "}
          <span className="text-[#FF5B04]">Your Product</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={2}
          className="sub-header mx-auto text-gray-500"
        >
          Tell us what you're building — we'll take it from there. Book a
          15-minute call, or use the estimator to get a quick ballpark first.
          No pressure, no commitment.
        </motion.p>

        {/* Trust stats */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={3}
          className="flex flex-wrap justify-center gap-6 mt-10 mb-2"
        >
          {TRUST_STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl max-md:text-xl font-black font-jetbrains-mono text-gray-900">
                {stat.value}
              </p>
              <p className="text-xs text-gray-400 mt-0.5 uppercase tracking-wide">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Main Layout: 2 Cards ─────────────────────────── */}
      <section className="container mx-auto px-8 max-md:px-4 py-12 max-md:py-8">
        <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-8 items-stretch max-w-5xl mx-auto">
          {/* Card 1: Book a Call */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={4}
            className="h-full"
          >
            <div className="h-full bg-white border border-gray-200 rounded-[20px] shadow-sm p-8 max-md:p-6 flex flex-col">
              <div className="flex items-center gap-4 max-md:gap-3 mb-6">
                <div className="w-12 h-12 max-md:w-10 max-md:h-10 rounded-xl bg-gray-900 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 max-md:w-5 max-md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-3xl max-md:text-xl max-lg:text-xl font-bold">
                  Book a <span className="text-[#FF5B04]">Call</span>
                </h3>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FF5B04]/10 text-[#FF5B04] text-xs font-bold font-jetbrains-mono uppercase tracking-wider mb-6 w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B04] animate-pulse" />
                Free Strategy Session
              </div>

              <p className="text-[#161616] text-lg max-md:text-base leading-relaxed mb-8">
                Book a free, no-commitment 15-minute call. We'll discuss your product goals, answer questions about our workflow, and outline a plan.
              </p>

              {/* Quick Specs */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3.5 text-gray-700">
                  <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 flex-shrink-0">
                    <svg className="w-4 h-4 text-[#FF5B04]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold">15 Minutes Call</span>
                </div>

                <div className="flex items-center gap-3.5 text-gray-700">
                  <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 flex-shrink-0">
                    <svg className="w-4 h-4 text-[#FF5B04]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold">Google Meet / Zoom</span>
                </div>

                <div className="flex items-center gap-3.5 text-gray-700">
                  <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 flex-shrink-0">
                    <svg className="w-4 h-4 text-[#FF5B04]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold">100% Secure & Confidential</span>
                </div>
              </div>

              <div className="mt-auto">
                <p className="text-gray-400 max-md:text-sm text-base mb-4 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  Typical response time: under 2 hours
                </p>

                <div className="grid grid-cols-1 gap-3">
                  <LetsTalkButton fullWidth variant="color" onClick={onOpen}>
                    Book a Time
                  </LetsTalkButton>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2 — Project Estimator */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={5}
            className="h-full w-full"
          >
            <ProjectEstimate className="h-full w-full" />
          </motion.div>
        </div>
      </section>

      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        size="4xl"
        placement={modalPlacement}
        scrollBehavior="inside"
        classNames={{
          wrapper: "!z-[999999999]",
          backdrop: "!z-[999999999] bg-black/50 backdrop-blur-md",
          base: "rounded-[24px] border-1 border-gray-200 shadow-2xl overflow-hidden",
          body: "p-0",
        }}
      >
        <ModalContent data-lenis-prevent>
          {(onClose) => (
            <ModalBody className="p-0 overflow-hidden bg-white" data-lenis-prevent>
              <iframe
                allow="camera; microphone; autoplay; encrypted-media;"
                className="w-full"
                frameBorder="0"
                height="650"
                style={{ minHeight: "650px", height: "calc(100vh - 150px)", maxHeight: "750px" }}
                src="https://cal.com/ui-pirate/15min?theme=light&layout=column_view&hideEventTypeDetails=true"
                title="Book a Call with UI Pirate"
                width="100%"
                loading="lazy"
              />
            </ModalBody>
          )}
        </ModalContent>
      </Modal>

      {/* ── US Client Testimonials ────────────────────────────────────── */}
      {US_TESTIMONIALS.length > 0 && (
        <section className="bg-[#F9FAFB] py-16 max-md:py-10 mt-8">
          <div className="container mx-auto px-8 max-md:px-4">
            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="text-center text-[11px] font-jetbrains-mono uppercase tracking-[0.18em] text-gray-400 mb-10"
            >
              What US Clients Say
            </motion.p>

            <div className="grid grid-cols-3 max-lg:grid-cols-1 gap-6">
              {US_TESTIMONIALS.slice(0, 3).map((t, i) => (
                <motion.div
                  key={t.name}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  custom={i}
                  className="premium-card"
                >
                  <div className="premium-card-inner p-6">
                    {/* Stars */}
                    <div className="flex gap-0.5 mb-4">
                      {Array.from({ length: 5 }).map((_, si) => (
                        <svg key={si} className="w-4 h-4 text-[#FF5B04]" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>

                    {/* Review */}
                    <p className="text-gray-700 text-sm leading-relaxed mb-6 line-clamp-4">
                      "{t.review}"
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      {t.profileImage ? (
                        <img
                          src={t.profileImage}
                          alt={t.name}
                          className="w-9 h-9 rounded-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-500">
                          {t.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                        <p className="text-xs text-gray-400">{t.occupation}</p>
                      </div>
                      {t.logo && (
                        <img
                          src={t.logo}
                          alt=""
                          className="ml-auto h-6 w-auto object-contain opacity-60"
                          loading="lazy"
                        />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Bottom CTA strip ─────────────────────────────────────────── */}
      <section className="container mx-auto px-8 max-md:px-4 py-16 max-md:py-12 text-center">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-gray-400 text-sm mb-3"
        >
          Prefer email?
        </motion.p>
        <motion.a
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          custom={1}
          href="mailto:vishal@uipirate.com"
          className="text-2xl max-md:text-xl font-bold text-gray-900 hover:text-[#FF5B04] transition-colors"
        >
          vishal@uipirate.com
        </motion.a>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          custom={2}
          className="text-xs text-gray-400 mt-4"
        >
          Serving clients in USA · UK · Singapore · India · Australia
        </motion.p>
      </section>
    </div>
  );
}
