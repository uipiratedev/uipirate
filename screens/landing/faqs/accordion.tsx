"use client";

import { Accordion, AccordionItem } from "@heroui/react";
import { motion } from "framer-motion";

import LetsTalkButton from "@/components/LetsTalkButton";

// Smooth animation variants for accordion items
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const data = [
  {
    heading: "What types of companies do you typically work with?",
    title1:
      "We work with SaaS startups from seed to Series B, enterprise product teams at companies like Ipsos, Khaitan & Co, and Biotex Medical, and agencies that need a white-label design partner. The common thread: a digital product that needs to ship and a team that doesn't have the full design-and-dev bandwidth to do it.",
    list: [],
  },
  {
    heading:
      "You're based in India — how does communication and time zone work for US/UK clients?",
    title1:
      "Most of our active clients are in the USA, UK, and Singapore. We work on a structured async model with a 2–4 hour daily overlap window for calls and reviews. Projects are managed in Figma and Notion with clear weekly check-ins so nothing falls into a time-zone gap. Book a free 15-minute call to see how it works in practice: cal.com/ui-pirate/15min",
    list: [],
  },
  {
    heading:
      "What makes UI Pirate different from hiring from Toptal, Clutch, or a local agency?",
    title1:
      "Toptal and Clutch give you individual contractors or an agency directory — not a team that thinks through your product from scratch. Local agencies often charge 3–5× more for the same output. We give you a design-and-development team with 9+ years of SaaS product experience, a fixed process, and the ability to go from idea to shipped — not just from brief to Figma file.",
    list: [],
  },
  {
    heading: "What does the process look like after I reach out?",
    title1:
      "You book a 15-minute call (no commitment). We listen, ask the right questions, and send a scoped proposal within 48 hours. If the scope looks right, we kick off with a 5-Day Pilot so you can see exactly how we work before committing to a full project. No retainer lock-in, no surprise invoices.",
    list: [],
  },
  {
    heading: "Do you offer post-launch support?",
    title1:
      "Yes! We offer post-launch support to ensure everything runs smoothly.",
    list: [
      "After the project is launched, we’ll be on standby to address any adjustments or unexpected issues. Whether it’s fixing minor bugs or refining some design elements, you’ll have peace of mind knowing we’re here to support your launch.",
    ],
    title2: (
      <>
        <span className="font-bold text-gray-900">What’s Included:</span> Minor adjustments, bug fixes, and technical support for a set period. For ongoing support, we offer retainers for long-term collaboration.
      </>
    ),
  },
  {
    heading: "What’s included in a web or mobile app project?",
    title1:
      "A typical web or mobile app project includes everything you need to launch a user-friendly and polished app:",
    list: [
      "•	Initial Discovery: We’ll go through your goals, key features, and user journey.",
      "	•	Design & Development: Includes UX/UI design, coding, testing, and feedback rounds.",
      "•	Launch Support: We’ll assist you through deployment, ensuring the app performs well on all devices.",
    ],
    title2: (
      <>
        <span className="font-bold text-gray-900">Deliverables:</span> You’ll receive the full app code, all design assets, documentation, and testing reports.
      </>
    ),
  },
  {
    heading: "Can I modify my project scope after starting?",
    title1: "Yes, we understand that needs can evolve.",
    list: [
      "If you need to add or change features midway, we’ll review the new scope and adjust the timeline and budget accordingly. Our team will work closely with you to keep everything on track while accommodating the changes.",
    ],
    title2: (
      <>
        <span className="font-bold text-gray-900">Flexibility:</span> Additional features can be billed hourly or added to the fixed budget as an agreed scope extension.
      </>
    ),
  },
  {
    heading: "Can you help us set up a Design System and Component Library?",
    title1:
      "Yes, we specialize in creating scalable design systems and component libraries.",
    list: [
      "↳ Design Systems: A comprehensive setup of styles, colors, and typography for brand consistency.",
      "↳ Component Libraries: Reusable components for faster development and consistent design across pages.",
    ],
    title2: (
      <>
        <span className="font-bold text-gray-900">Benefits:</span> A cohesive design system reduces redundancy and improves team efficiency by ensuring every design aligns with brand guidelines.
      </>
    ),
  },
  {
    heading: "What does a UX Audit & Consultation involve?",
    title1:
      "Our UX audits provide actionable insights to improve your product’s usability.",
    list: [
      "•	Audit Report: An in-depth analysis of your product’s current state, highlighting user pain points and areas for improvement.",
      "•	Consultation: A discussion to address the findings, offering recommendations tailored to your goals.",
      "•	Actionable Roadmap: A prioritized list of suggested changes to enhance the user experience.",
    ],
    title2: (
      <>
        <span className="font-bold text-gray-900">Deliverables:</span> A detailed report, consultation call, and an improvement roadmap, focusing on ease of use and user satisfaction.
      </>
    ),
  },
  {
    heading: "Do you work with existing designs or wireframes?",
    title1: "Absolutely. We can pick up from any stage you’re at.",
    list: [
      "Using your existing designs or wireframes, we can enhance the visual style, expand functionality, or build new features. Working from existing assets can save time and ensure we’re aligned with your vision from the start.",
    ],
    title2: (
      <>
        <span className="font-bold text-gray-900">Benefits:</span> Faster turnaround and cost savings, while keeping your original vision intact.
      </>
    ),
  },
  {
    heading: "How do we get started?",
    title1: "It’s easy!",
    list: [
      "Start by booking a consultation with us at cal.com/ui-pirate/15min. We’ll discuss your project, goals, and timeline, and recommend the best way forward. Alternatively, if you have a specific brief ready, email us, and we’ll get back to you with a tailored proposal.",
    ],
    title2: (
      <>
        <span className="font-bold text-gray-900">Getting in Touch:</span> Book a call directly or send us an email.
      </>
    ),
  },
];

export default function FaqsAccordion() {
  return (
    <>
      <div>
        <motion.div
          initial="hidden"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
          viewport={{ once: true, amount: 0.2 }}
          whileInView="visible"
        >
          <Accordion
            className="mb-0 p-0 -px-2"
            defaultExpandedKeys={["0"]} // ✅ opens first accordion by default
            selectionMode="multiple"
            style={{ padding: 0 }}
            variant="splitted"
          >
            {data.slice(0, 4).map((item, index) => (
              <AccordionItem
                key={String(index)}
                aria-label={item.heading}
                className="px-4 md:px-6 shadow-none border border-gray-200 rounded-2xl mt-3 max-md:mt-2 items-center bg-white hover:border-brand-orange/40 transition-all duration-300 data-[open=true]:shadow-sm"
                indicator={({ isOpen }) =>
                  isOpen ? (
                    <img
                      alt="icon"
                      className="rotate-45 transition-transform duration-300"
                      src="https://res.cloudinary.com/damm9iwho/image/upload/v1731050216/plus_dia0bt.svg"
                    />
                  ) : (
                    <img
                      alt="icon"
                      className="transition-transform duration-300"
                      src="https://res.cloudinary.com/damm9iwho/image/upload/v1731050216/plus_dia0bt.svg"
                    />
                  )
                }
                title={
                  <p className="font-semibold pr-12 max-md:pr-6 md:py-2  text-[16px] leading-snug text-gray-900">
                    {item.heading}
                  </p>
                }
              >
                <div className="pb-5 md:pb-6 pt-0">
                  <p className="mb-5 text-[15px] text-gray-600">
                    {item.title1}
                  </p>
                  {item.list.map((listItem, i) => (
                    <p
                      key={i}
                      className="mb-3 text-[15px] text-gray-600 leading-relaxed"
                    >
                      {listItem}
                    </p>
                  ))}
                  {item.title2 && (
                    <p className="mt-5 text-[15px] text-gray-600">
                      {item.title2}
                    </p>
                  )}
                </div>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
        <motion.div
          custom={4}
          initial="hidden"
          variants={itemVariants}
          viewport={{ once: true, amount: 0.3 }}
          whileInView="visible"
        >
          <div className="flex flex-row items-center justify-center mt-6">
            <LetsTalkButton
              children="See all FAQ’s"
              href="/faqs"
              target="_self"
              variant="light"
            />
          </div>
        </motion.div>
      </div>
    </>
  );
}
