"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import GlassBadge from "@/components/GlassBadge";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How long does a typical project take?",
    answer:
      "Most projects take 4-12 weeks depending on scope. We follow a structured process: Discovery (1-2 weeks), Design (2-4 weeks), Development (3-6 weeks), and Testing/Launch (1-2 weeks). We provide weekly milestones and consistent delivery throughout.",
  },
  {
    question: "Do you work with early-stage startups?",
    answer:
      "Yes! We've helped 20+ startups validate and ship their MVPs. We understand the constraints of early-stage companies and offer flexible engagement models. Many of our case studies showcase products we've built from scratch.",
  },
  {
    question: "What's included in your design process?",
    answer:
      "Our process includes: Product discovery & research, Information architecture, User flows & wireframes, Complete UI design system, High-fidelity prototypes, Developer handoff documentation, and Design tokens for implementation.",
  },
  {
    question: "Can you help with existing products?",
    answer:
      "Absolutely. We do redesigns, UX audits, and feature additions. We'll assess your current product, identify improvement opportunities, and create a phased roadmap. Many of our case studies involve enhancing existing platforms.",
  },
  {
    question: "Do you provide ongoing support after launch?",
    answer:
      "Yes, we offer maintenance packages and ongoing design support. This includes design system updates, new feature design, performance optimization, and iterative improvements based on user feedback.",
  },
  {
    question: "What industries do you specialize in?",
    answer:
      "We specialize in SaaS, AI/ML platforms, FinTech, HealthTech, LegalTech, and Enterprise software. Our team understands complex workflows, data-heavy interfaces, and compliance requirements common in these sectors.",
  },
];

const CaseStudiesFAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 max-md:py-12 -mt-52">
      <div className="container mx-auto px-32 lg:px-20 max-md:px-4">
        <motion.div
          className="text-center mb-12 max-md:mb-8"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className="mb-6 flex flex-row items-center justify-center">
            <GlassBadge variant="gradient">FAQ</GlassBadge>
          </div>
          <h2 className="heading-center">
            Common <span className="text-brand-orange">Questions</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto mt-4">
            Everything you need to know about working with us
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 transition-colors"
              initial={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <button
                className="w-full px-6 py-5 max-md:px-4 max-md:py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-base max-md:text-sm font-semibold text-gray-900 pr-4">
                  {faq.question}
                </span>
                <motion.svg
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  className="w-5 h-5 text-brand-orange shrink-0"
                  fill="none"
                  stroke="currentColor"
                  transition={{ duration: 0.3 }}
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M19 9l-7 7-7-7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </motion.svg>
              </button>

              {openIndex === index && (
                <motion.div
                  animate={{ height: "auto", opacity: 1 }}
                  className="overflow-hidden"
                  exit={{ height: 0, opacity: 0 }}
                  initial={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="px-6 pb-5 max-md:px-4 max-md:pb-4">
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudiesFAQ;
