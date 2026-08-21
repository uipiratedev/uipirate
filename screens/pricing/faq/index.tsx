"use client";
import { motion } from "framer-motion";
import { Accordion, AccordionItem } from "@heroui/react";

import GlassBadge from "@/components/GlassBadge";
import LetsTalkButton from "@/components/LetsTalkButton";

const PRICING_FAQS = [
  {
    question: "Can I pause my subscription?",
    answer:
      "Yes! You can pause your subscription at any time with no penalty. Your billing pauses immediately, and you can resume whenever you're ready. This is perfect for teams with fluctuating design needs.",
  },
  {
    question: "What if I'm not satisfied with the work?",
    answer:
      "We offer a 100% satisfaction guarantee. If you're not happy with the first milestone, we'll refund your deposit — no questions asked. We've done this 100+ times and stand behind our quality.",
  },
  {
    question: "How fast is the turnaround?",
    answer:
      "Most requests are completed in 48-72 hours. Complex projects like full app redesigns may take longer, but we'll always give you a clear timeline upfront. You'll never be left guessing.",
  },
  {
    question: "What's NOT included?",
    answer:
      "We focus on digital product design: UI/UX, web apps, mobile apps, dashboards, and landing pages. We don't do physical product design, logo-only projects, or print design. For those, we can recommend partners.",
  },
  {
    question: "How does the 5-day pilot work?",
    answer:
      "Pay a small fee ($150-350) to test our work for 5 days. You'll get real deliverables — not just concepts. If you move forward with a full project, the pilot fee is deducted from your invoice. Zero risk.",
  },
  {
    question: "Can I switch between retainer and project-based?",
    answer:
      "Absolutely. Start with a project if you have a specific scope. Switch to retainer when you need ongoing support. Many clients start with a pilot, then move to retainer for continuous iteration.",
  },
];

const PricingFAQ = () => {
  return (
    <motion.div
      className="py-12 max-md:py-8"
      initial={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, amount: 0.2 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <GlassBadge variant="gradient">FAQ</GlassBadge>
        </div>
        <h2 className="heading-center">Common Questions</h2>
      </div>

      {/* Accordion */}
      <Accordion
        className="mb-0 p-0"
        defaultExpandedKeys={["0"]}
        selectionMode="multiple"
        variant="splitted"
      >
        {PRICING_FAQS.map((faq, index) => (
          <AccordionItem
            key={String(index)}
            aria-label={faq.question}
            className="shadow-none border border-gray-200 rounded-2xl mt-3 max-md:mt-2 items-center bg-white hover:border-brand-orange/40 transition-all duration-300 data-[open=true]:border-l-[3px] data-[open=true]:border-l-brand-orange data-[open=true]:border-gray-200 data-[open=true]:shadow-sm"
            indicator={({ isOpen }) => (
              <img
                alt="icon"
                className={`transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                src="https://res.cloudinary.com/damm9iwho/image/upload/v1731050216/plus_dia0bt.svg"
              />
            )}
            title={
              <p className="font-semibold pr-12 max-md:pr-6 md:py-2 md:px-1 text-[16px] leading-snug text-gray-900">
                {faq.question}
              </p>
            }
          >
            <div className="px-5 pb-5 md:px-6 md:pb-6 pt-0">
              <p className="text-[15px] text-gray-600 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </AccordionItem>
        ))}
      </Accordion>

      {/* CTA */}
      <motion.div
        className="flex flex-col items-center justify-center mt-8 gap-3"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <p className="text-gray-500 text-sm">Still have questions?</p>
        <LetsTalkButton variant="light">Chat With Us</LetsTalkButton>
      </motion.div>
    </motion.div>
  );
};

export default PricingFAQ;
