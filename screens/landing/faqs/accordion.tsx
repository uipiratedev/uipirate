"use client";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const data = [
  {
    heading:
      "What’s the difference between design-only, dev-only, and design + development?",

    title1: "Each option caters to different project needs and stages:",
    list: [
      "↳ Design-Only: This service focuses solely on the visual and user experience aspects. We provide wireframes, UI/UX design, branding, and interactive prototypes, ready for handoff to your development team. This is perfect if you have a development team in place and need design assets to start the build.",
      "↳ Dev-Only: In this option, we handle the development based on your existing designs. Our team turns your design files into a live product, focusing on coding, testing, and deployment. This is ideal if you already have finalized designs and only need expert developers to bring them to life.",
      "↳ Design + Development: This end-to-end option combines both services, taking your project from concept to a fully functional product. We manage the design, coding, testing, and launch, ensuring a seamless transition from visuals to a live website or app. Choose this option if you want a one-stop solution from our team, covering all aspects of your project.",
    ],
    title2:
      "📍 Example Use Case: For a new mobile app, design-only provides the design assets for your team, dev-only builds from your provided designs, and design + development offers a complete, managed solution from initial design to launch.",
  },
  {
    heading: "What’s the difference between hourly and fixed pricing?",

    title1: "It depends on how you want to manage the project:",
    list: [
      "↳ Hourly Pricing: Flexible, ideal if you need more control over ongoing costs. You pay only for the hours used, and it’s perfect for projects that might change or grow in scope. Adjustments and extra work are billed transparently on an hourly basis.",
      "↳ Fixed Pricing: Best if you have a well-defined project scope and prefer upfront budgeting. This option allows for a set cost for the entire project, helping with predictable expenses. Typically includes limited iterations to keep the timeline focused.",
    ],
    title2:
      "📍 Example: If you need a landing page with multiple illustrations and animations, fixed pricing gives you a clear cost up front, while hourly pricing lets you add features as we go.",
  },
  {
    heading: "How do I determine the right pricing plan for my project?",

    title1:
      "It depends on the project’s scope, desired flexibility, and timeline.",
    list: [
      "↳ Fixed Pricing: Suitable for well-defined projects with a clear start and end, like landing pages or simple web apps. It’s easier to budget and track, with fewer variables.",
      "↳ Hourly Pricing: Ideal if you need to adapt the scope as you go or want regular iterations. Perfect for complex projects with evolving requirements.",
    ],
    title2:
      "📍 Need Help Choosing? Let’s have a quick call to go over your project details and pick the plan that aligns with your goals and budget.",
  },
  {
    heading: "How long does it take to complete a project?",

    title1:
      "Project timelines vary based on scope and complexity. Here’s a general idea:",
    list: [
      "•	Landing Pages or Small Websites: Usually take 2-4 weeks, depending on specific features.",
      "•	Web & Mobile Apps: Typically span 1-3 months, allowing for testing, user feedback, and adjustments.",
      "•	Comprehensive Design Systems: Around 1-2 months, as they require in-depth planning, component library setup, and testing.",
    ],
    title2:
      "📍 Case Example: A basic landing page could be ready in two weeks, while a full-featured mobile app may require at least two months to meet quality standards",
  },
  {
    heading: "Do you offer post-launch support?",

    title1:
      "Yes! We offer post-launch support to ensure everything runs smoothly.",
    list: [
      "After the project is launched, we’ll be on standby to address any adjustments or unexpected issues. Whether it’s fixing minor bugs or refining some design elements, you’ll have peace of mind knowing we’re here to support your launch.",
    ],
    title2:
      "📍 What’s Included: Minor adjustments, bug fixes, and technical support for a set period. For ongoing support, we offer retainers for long-term collaboration.",
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
    title2:
      "📍 Deliverables: You’ll receive the full app code, all design assets, documentation, and testing reports.",
  },
  {
    heading: "Can I modify my project scope after starting?",

    title1: "Yes, we understand that needs can evolve.",
    list: [
      "If you need to add or change features midway, we’ll review the new scope and adjust the timeline and budget accordingly. Our team will work closely with you to keep everything on track while accommodating the changes.",
    ],
    title2:
      "📍 Flexibility: Additional features can be billed hourly or added to the fixed budget as an agreed scope extension.",
  },

  {
    heading: "What deliverables should I expect for motion graphics?",

    title1:
      "Our motion graphics services bring static visuals to life with seamless animations.",
    list: [
      "•	Storyboard & Concepts: You’ll receive initial concepts to align on the visual style.",
      "•	Animation Files: Final deliverables in video format, optimized for web or app usage.",
      "	•	Revisions: Includes up to three revisions to refine and finalize the animations.",
    ],
    title2:
      "📍 Typical Uses: Great for explainer videos, app onboarding, or social media promos.",
  },
  {
    heading: "Can you help us set up a Design System and Component Library?",

    title1:
      "Yes, we specialize in creating scalable design systems and component libraries.",
    list: [
      "↳ Design Systems: A comprehensive setup of styles, colors, and typography for brand consistency.",
      "↳ Component Libraries: Reusable components for faster development and consistent design across pages.",
    ],
    title2:
      "📍 Benefits: A cohesive design system reduces redundancy and improves team efficiency by ensuring every design aligns with brand guidelines.",
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
    title2:
      "📍 Deliverables: A detailed report, consultation call, and an improvement roadmap, focusing on ease of use and user satisfaction.",
  },
  {
    heading: "What’s included in a 3D Animation & Rendering project?",

    title1: "We handle every step, from concept to final render.",
    list: [
      "↳ Concept & Storyboard: A detailed plan and visuals for your 3D scenes or animations.",
      "↳ 3D Modeling & Texturing: Creation of realistic assets, lighting, and texture to bring your vision to life.",
      "↳ Rendering & Revisions: High-quality final renders delivered in your preferred formats.",
    ],
    title2:
      "📍 Usage: Perfect for product demos, promotional videos, and immersive web content.",
  },
  {
    heading: "Do you work with existing designs or wireframes?",

    title1: "Absolutely. We can pick up from any stage you’re at.",
    list: [
      "Using your existing designs or wireframes, we can enhance the visual style, expand functionality, or build new features. Working from existing assets can save time and ensure we’re aligned with your vision from the start.",
    ],
    title2:
      "📍 Benefits: Faster turnaround and cost savings, while keeping your original vision intact.",
  },
  {
    heading: "How do we get started?",

    title1: "It’s easy!",
    list: [
      "Start by booking a consultation with us. We’ll discuss your project, goals, and timeline, and recommend the best way forward. Alternatively, if you have a specific brief ready, email or WhatsApp us, and we’ll get back to you with a tailored proposal.",
    ],
    title2:
      "📍 Getting in Touch: Click on “Contact Us” to book a call or reach out via WhatsApp.",
  },
];

export default function FaqsAccordion() {
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    cardsRef.current.forEach((card, index) => {
      if (card) {
        gsap.fromTo(
          card,
          {
            y: 50, // Start from below
            paddingTop: "5%",
            paddingBottom: "5%",
            opacity: isMobile ? 4 : 0, // Start fully transparent
            filter: isMobile ? "blur(0px)" : "blur(5px)", // Initial blur effect
          },
          {
            y: 0, // Move to its original position
            paddingTop: "0%",
            paddingBottom: "0%",
            opacity: 1, // Fade in to fully visible
            filter: "blur(0px)", // Remove blur
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: isMobile ? "top 50%" : "top 90%", // Adjust start point for mobile
              end: isMobile ? "botton 10%" : "top 30%", // Adjust end point for mobile
              toggleActions: "restart none none reverse",
            },
          }
        );
      }
    });
  }, []);

  return (
    <>
      <div
        className=""
        ref={(el) => {
          if (el) cardsRef.current[0] = el;
        }}
      >
        <Accordion
          variant="splitted"
          defaultExpandedKeys={["0"]} // ✅ opens first accordion by default
          className="mb-0"
          selectionMode="multiple"
        >
          {data.map((item, index) => (
            <AccordionItem
              key={String(index)}
              aria-label={item.heading}
              title={
                <p className="font-semibold pr-12 max-md:pr-6 md:py-2 md:px-1 text-[16px] leading-snug">
                  {item.heading}
                </p>
              }
              indicator={({ isOpen }) =>
                isOpen ? (
                  <img
                    src="https://res.cloudinary.com/damm9iwho/image/upload/v1731050216/plus_dia0bt.svg"
                    alt="icon"
                    className="rotate-45 transition-transform duration-300"
                  />
                ) : (
                  <img
                    src="https://res.cloudinary.com/damm9iwho/image/upload/v1731050216/plus_dia0bt.svg"
                    alt="icon"
                    className="transition-transform duration-300"
                  />
                )
              }
              className="shadow-none border-1 rounded-[1.25rem] mt-3 max-md:mt-2 items-center hover:bg-[#f2f1f1]"
            >
              <div className="p-5 md:p-6 bg-white rounded-[20px]">
                <p className="mb-5 text-[15px] text-gray-700">{item.title1}</p>
                {item.list.map((listItem, i) => (
                  <p key={i} className="mb-3 text-[15px] text-gray-700">
                    {listItem}
                  </p>
                ))}
                {item.title2 && (
                  <p className="mt-5 text-[15px] text-gray-700">
                    {item.title2}
                  </p>
                )}
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </>
  );
}
