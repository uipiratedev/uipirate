"use client";
import ServiceDetailsHero from "./hero";
import WhatWeProvide from "./whatWeProvide";
import WhoThisIsFor from "./whoThisIsFor";

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
    heading: "Who This Is For",
    card: [
      {
        heading: "UI/UX Design",
      },
      {
        heading: "Frontend Development",
      },
      {
        heading: "Backend Integration",
      },
    ],
  },
};

const ServiceDetails = () => {
  return (
    <div className="container mx-auto xl:px-32 max-md:px-4 max-xl:px-4 max-2xl:px-0">
      <ServiceDetailsHero data={data.hero} />
      <WhatWeProvide data={data.whatWeProvide} />
      <WhoThisIsFor data={data.whoThisIsFor} />
    </div>
  );
};

export default ServiceDetails;
