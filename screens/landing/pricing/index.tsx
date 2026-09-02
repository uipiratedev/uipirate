"use client";

import { Card, CardBody } from "@heroui/react";
import { motion } from "framer-motion";

import GlassBadge from "@/components/GlassBadge";
import { CheckIcon } from "@/components/icons";
import LetsTalkButton from "@/components/LetsTalkButton";
import ProjectEstimate from "@/components/ProjectEstimate";
import PricingFlip from "../pricingFlip";

const Pricing = () => {
  // Subtle animation for the main container
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const monthlyRetainerFeatures = [
    "Full design & development stack",
    "1 active request at a time",
    "Weekly progress sync",
    "Fast turnaround",
    "Unlimited requests within scope",
    "Mon–Fri, < 2hr response",
  ];

  const customProjectFeatures = [
    "Access to all services",
    "Priority support & Fully custom scope",
    "No hidden costs",
    "Working with your team",
    "Mon–Fri, < 2hr response",
  ];

  const customQuoteFeatures = [
    "Full design, development & product support",
    "Priority handling for complex scopes",
    "Custom project scope & delivery plan",
    "Flexible engagement based on your needs",
    "Close collaboration with stakeholders",
    "Dedicated project ownership",
    "Mon–Fri, < 2hr response",
  ];

  const benefits = [
    {
      icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1770115432/pause_nod3oq.svg",
      title: "PAUSE ANYTIME",
      description:
        "Pause your subscription anytime. No penalties, no lock-ins.",
    },
    {
      icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1770115432/share_ljjrs4.svg",
      title: "5-DAY PILOT PROJECT",
      description:
        "Test our execution quality before committing to a full engagement.",
    },
    {
      icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1770115432/value_jwko4r.svg",
      title: "LOW-RISK, HIGH-VALUE",
      description:
        "Pilot fee fully deductible from the final invoice if you move forward.",
    },
  ];

  return (
    <motion.div
      className="section-container"
      initial="hidden"
      variants={containerVariants}
      viewport={{ once: true, amount: 0.1 }}
      whileInView="show"
    >
      {/* Header */}
      <div className=" autoShow text-center mb-6 max-md:mb-4">
        <div className="flex justify-center mb-6">
          <GlassBadge variant="gradient">PRICING</GlassBadge>
        </div>
        <h2 className="heading-center">Transparent Pricing for <span className="text-brand-orange">SaaS Teams</span> </h2>
      </div>

      <PricingFlip />
      {/* Benefits Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
        {benefits.map((benefit, index) => (
          <div key={index}>
            <Card className="rounded-[20px] max-md:rounded-[12px] bg-gradient-to-br from-[#EDEDED] via-[#FFFFFF] to-[#EDEDED] border-1 border-gray-200 shadow-sm h-full">
              <CardBody className="p-6 max-md:p-5">
                <h4 className="text-xl max-md:text-lg max-md:font-semibold font-bold mb-3 tracking-wide flex items-center  gap-2 font-mono max-md:text-center">
                  <img
                    alt={benefit.title}
                    className="w-4 h-4 mb-1 max-md:w-6 max-md:h-6"
                    src={benefit.icon}
                  />{" "}
                  {benefit.title}
                </h4>
                <p className="text-sm text-[#555555] leading-relaxed font-jakarta">
                  {benefit.description}
                </p>
              </CardBody>
            </Card>
          </div>
        ))}
      </div>

      {/* Risk Reversal / Guarantee Section */}
      <div className="mt-8 p-6 md:p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <svg
            className="w-8 h-8 text-green-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h4 className="text-xl md:text-2xl font-bold text-gray-900">
            100% Satisfaction Guarantee
          </h4>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          Not happy with the first milestone? We'll refund your deposit, no questions asked. 100+ projects delivered for companies like Ipsos, Khaitan &amp; Co, and RevUp AI.
        </p>
      </div>
    </motion.div>
  );
};

export default Pricing;
