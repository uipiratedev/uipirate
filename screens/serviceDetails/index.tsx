"use client";
import LandingFaqs from "../landing/faqs";
import LandingWork from "../landing/works";
import ServiceDetailsHero from "./hero";
import OptionalAdd from "./optionalAdd";
import StreamlinedProcess from "./streamlinedProcess";
import WhatWeProvide from "./whatWeProvide";
import WhoThisIsFor from "./whoThisIsFor";
import YouWillGet from "./youWillGet";

const data = {
  hero: {
    badge: "7 CORE SERVICES. 1 SEAMLESS WORKFLOW",
    heading: "Build SaaS apps that scale",
    heading1: "cleanly & convert consistently.",
    description:
      "From MVP wireframes to fully coded dashboards, we design and develop modern web and mobile apps that simplify complex UX, boost user retention, and align with your product’s growth.",
  },
  whatWeProvide: {
    heading: "What We Provide",
    badge: "What we provide",
    card: [
      {
        heading: "UX & Product Flow Design",
        description:
          "Mapping out user journeys, flows, and wireframes built for clarity and conversion.",
        img: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1760622257/ux_wfeudq.svg",
      },
      {
        heading: "Beautiful UI Design",
        description:
          "Mapping out user journeys, flows, and wireframes built for clarity and conversion.",
        img: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1760622278/ui_f5z5ar.svg",
      },
      {
        heading: "Frontend Development",
        description:
          "Mapping out user journeys, flows, and wireframes built for clarity and conversion.",
        img: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1760622270/front_dxjszm.svg",
      },
      {
        heading: "Mobile Optimization",
        description:
          "Mapping out user journeys, flows, and wireframes built for clarity and conversion.",
        img: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1760622283/mobile_ior7xh.svg",
      },
      {
        heading: "Prototyping & Iterations",
        description:
          "Mapping out user journeys, flows, and wireframes built for clarity and conversion.",
        img: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1760622267/figma_opoxx5.svg",
      },
      {
        heading: "Cross-platform QA",
        description:
          "Mapping out user journeys, flows, and wireframes built for clarity and conversion.",
        img: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1760622271/cross_hehxxz.svg",
      },
    ],
  },
  whoThisIsFor: {
    heading: "Does it sound like you?",
    badge: "Who This Is For",
    card: [
      {
        heading: "🚀  SaaS startups building their first MVP",
      },
      {
        heading: "🏢  Enterprise teams needing dashboard redesigns",
      },
      {
        heading: "🤖  AI tools and B2B platforms seeking high-conversion UX",
      },
      {
        heading:
          "🧩  Founders struggling with product complexity & user engagement",
      },
      {
        heading: "🎨  Agencies needing white-label frontend + Figma delivery",
      },
    ],
  },
  streamlinedProcess: {
    heading: "What You'll Get With Us",
    badge: "You Will Get",
    card: [
      {
        icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1760622267/figma_opoxx5.svg",
        heading: "Onboarding",
        gradiendt: "linear-gradient(180deg, #FFE6F4 20.66%, #FFFAFD 100%)",
      },
      {
        icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1760622267/figma_opoxx5.svg",
        gradiendt: "linear-gradient(180deg, #F5FFD9 29.57%, #FDFFF7 100%)",
        heading: "Research & Strategy",
      },
      {
        icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1760622267/figma_opoxx5.svg",
        gradiendt: "linear-gradient(180deg, #78E6F4 20.66%, #F5FEFF 100%)",
        heading: "Design & Prototyping",
      },
      {
        icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1760622267/figma_opoxx5.svg",
        gradiendt: "linear-gradient(180deg, #FFC8DB 29.57%, #FFF7FA 100%)",
        heading: "UI Development",
      },
    ],
  },
  youWillGet: {
    heading: "Streamlined Process",
    badge: "Streamlined Process",
    description:
      "From MVP wireframes to fully coded dashboards, we design and develop modern web and mobile apps that simplify complex UX, boost user retention, and align with your product’s growth.",
    leftBadges: [
      {
        text: "Responsive Figma Files",
        color: "bg-[#8EF1F1E5]",
        rotation: 8,
      },
      {
        text: "Dev-Ready UI Components",
        color: "bg-[#BAFFBCE5]",
        rotation: 6,
      },
      {
        text: "Clickable Prototypes",
        color: "bg-[#FDE2D3E5]",
        rotation: 0,
      },
      {
        text: "Collaboration via Teams & Slack",
        color: "bg-[#E8E8FFE5]",
        rotation: -6,
      },
      {
        text: "Tailwind + React (optional)",
        color: "bg-[#A5FEDCE5]",
        rotation: -8,
      },
    ],
    rightBadges: [
      {
        text: "Mobile–First Layouts",
        color: "bg-[#ECE2FFE5]",
        rotation: -10,
      },
      {
        text: "UX–Focused Flows",
        color: "bg-[#D9ECC7E5]",
        rotation: -6,
      },
      {
        text: "Dashboard & Analytics Screens",
        color: "bg-[#FFDBDBE5]",
        rotation: 0,
      },
      { text: "Design Tokens", color: "bg-[#FCD6F0E5]", rotation: 6 },
      {
        text: "Scalable Design System",
        color: "bg-[#FDE6ACE5]",
        rotation: 10,
      },
    ],
    mockup:
      "https://res.cloudinary.com/dvk9ttiym/image/upload/v1753847870/Ai_APp_mockup_y0mt4j.svg",
  },
};

const ServiceDetails = () => {
  return (
    <div className="container mx-auto xl:px-32 max-md:px-4 max-xl:px-4 max-2xl:px-0">
      <ServiceDetailsHero data={data.hero} />
      <WhatWeProvide data={data.whatWeProvide} />
      <WhoThisIsFor data={data.whoThisIsFor} />
      <YouWillGet data={data.youWillGet} />
      <StreamlinedProcess data={data.streamlinedProcess} />
      <OptionalAdd />
      <LandingWork />

      <LandingFaqs />
    </div>
  );
};

export default ServiceDetails;
