"use client";

import FaqsAccordion from "@/components/FaqsAccordion";
import SectionHeader from "@/components/SectionHeader";
import { Reveal } from "@/components/motion";

export const CASE_STUDIES_FAQS = [
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

export const faqs = CASE_STUDIES_FAQS;

const CaseStudiesFAQ = () => {
  return (
    <section className="py-16 max-md:py-12 -mt-52">
      <div className="section-container">
        <Reveal variant="up">
          <SectionHeader
            chip="FAQ"
            subcopy="Everything you need to know about working with us"
          >
            Common <span className="text-brand-orange">Questions</span>
          </SectionHeader>
        </Reveal>

        <FaqsAccordion
          defaultExpandedKeys={[]}
          items={CASE_STUDIES_FAQS}
          showCta={true}
        />
      </div>
    </section>
  );
};

export default CaseStudiesFAQ;
