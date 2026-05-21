"use client";

import { Card, CardBody } from "@heroui/react";
import { motion } from "framer-motion";

import GlassBadge from "@/components/GlassBadge";
import { CheckIcon } from "@/components/icons";
import LetsTalkButton from "@/components/LetsTalkButton";
import ProjectEstimate from "@/components/ProjectEstimate";

const Pricing = () => {

  // Subtle animation for the main container
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const monthlyRetainerFeatures = [
    "Access to our full design & development stack",
    "1 Active request at a time",
    "Weekly Progress Meeting",
    "Fast turnaround",
    "Unlimited requests within scope",
    "Expert project management",
    "5/7 Communication",
  ];

  const customProjectFeatures = [
    "Access to all services",
    "Priority support",
    "Fully custom scope",
    "No hidden costs",
    "Working with your team",
    "Experienced project ownership",
    "5/7 Communication",
  ];

  const customQuoteFeatures = [
    "Full access to design, development & product support",
    "Priority handling for complex scopes and timelines",
    "Fully customized project scope and delivery plan",
    "Flexible engagement based on business needs",
    "Close collaboration with internal stakeholders",
    "Dedicated project ownership and planning",
    "5/7 Communication",
  ];

  const benefits = [
    {
      icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1770115432/pause_nod3oq.svg",
      title: "PAUSE ANYTIME",
      description:
        "You can easily pause your subscription whenever you need to, without any worries or hassle.",
    },
    {
      icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1770115432/share_ljjrs4.svg",
      title: "5-DAY PILOT PROJECT",
      description:
        "Big scope. Big budget. No blind trust. This 5-day pilot shows you see our execution before committing long term.",
    },
    {
      icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1770115432/value_jwko4r.svg",
      title: "LOW-RISK, HIGH-VALUE",
      description:
        "Your fee is fully deductible from the final invoice if you move forward with a full project.",
    },
  ];

  return (
    <motion.div
      className="py-12 max-md:py-8 container mx-auto px-4 sm:px-6 lg:px-20 xl:px-32"
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
    >
      {/* Header */}
      <div className=" autoShow text-center mb-6 max-md:mb-4">
        <div className="flex justify-center mb-6">
          <GlassBadge variant="gradient">PRICING</GlassBadge>
        </div>
        <h2 className="heading-center">
          Pricing That Makes Sense
        </h2>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4 autoShowBottom">
        {/* Monthly Retainer Card */}
        <div>
          <Card className="rounded-[20px] max-md:rounded-[12px]  bg-gradient-to-br from-[#212121] to-[#151514] border-1 border-gray-800 shadow-lg h-full noise-texture "
          style={{
            boxShadow: "0px 3.79px 2.53px 0px #FFFFFF73 inset",

          }}
          
          >
          <CardBody className="p-8 max-md:p-6">
            {/* Icon and Title aligned together on mobile */}
            <div className="flex items-center gap-4 max-md:gap-3 mb-6">
              <div className="w-12 h-12 max-md:w-10 max-md:h-10 rounded-lg flex items-center justify-center">
               <img src="/assets/gif/kite.gif" alt="" />
              </div>
              <h3 className="text-3xl max-md:text-xl font-bold text-white font-jakarta">
                Monthly <span className="text-brand-orange">Retainer</span>
              </h3>
            </div>

            {/* Subtitle */}
            <p className="bg-[#262626] text-white w-fit p-2 rounded-lg text-sm max-md:text-xs font- mb-6 uppercase tracking-wide font-mono">
              For teams that need design & dev support, every month
            </p>

            {/* Features List */}
            <ul className="space-y-3 mb-8">
              {monthlyRetainerFeatures.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-gray-300"
                >
                  <span className="text-[#454545]">  <CheckIcon /></span>
                  <span className="text-white max-md:text-sm text-base font-jakarta">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Footer */}
            <div className="mt-auto">
              <p className="text-[#777777] text-base max-md:text-sm mb-4 italic font-jakarta">
                One subscription, endless possibilities
              </p>

              {/* Price with Anchor */}
              <div className="mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl max-md:text-3xl font-black text-white font-jetbrains-mono">
                    $2000
                  </span>
                  <span className="text-[#999999] text-lg font-jetbrains-mono">/per month</span>
                </div>
                <p className="text-[#666666] text-sm mt-1 font-jakarta">
                  vs $8-15k/mo for a typical agency retainer
                </p>
              </div>

              {/* Scarcity */}
              <div className="flex items-center gap-2 mb-4 bg-brand-orange/10 border border-brand-orange/20 rounded-lg px-3 py-2">
                <div className="w-2 h-2 bg-brand-orange rounded-full animate-pulse" />
                <p className="text-brand-orange text-sm font-semibold">
                  Only accepting 2 new clients this month
                </p>
              </div>

              {/* Buttons */}
              <div className="grid grid-cols-1 gap-3">
                <LetsTalkButton fullWidth variant="dark" children="Chat on WhatsApp"/>
              </div>
            </div>
          </CardBody>
          </Card>
        </div>

        {/* Custom Project Estimate Card */}
        <div className="h-full min-h-[580px]">
          <ProjectEstimate />
        </div>
      </div>

      {/* Custom Quote Card - Full Width */}
      <div className="mb-4">
        <Card className="rounded-[20px] max-md:rounded-[12px]  bg-white border-1 border-gray-200 shadow-sm">
          <CardBody className="p-8 max-md:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Side */}
              <div>
                <div className="flex items-center gap-4 max-md:gap-3 mb-6">
                  {/* Icon */}
                  <div className="w-12 h-12 max-md:w-10 max-md:h-10 flex items-center justify-center">
                    <img src="/assets/gif/headquater.gif" alt="" />
                  </div>

                  {/* Title */}
                  <h3 className="text-3xl max-md:text-xl max-lg:text-xl font-bold">
                    Custom <span className="text-brand-orange">Quote</span>
                  </h3>
                </div>
                {/* Subtitle */}
                <p className="bg-black/5 text-black w-fit p-2 rounded-lg text-sm max-md:text-xs mb-6 uppercase tracking-wide font-mono">
                  For complex products, enterprise needs & startups
                </p>

                {/* Description */}
                <p className="text-[#161616] mb-6 max-md:mb-0 text-base max-md:text-sm font-jakarta">
                  Best suited for products that don't fit into standard plans.
                </p>

                {/* Buttons */}
                <div className="grid grid-cols-1 gap-3 max-md:hidden">
                  <LetsTalkButton fullWidth variant="dark" children="Chat on WhatsApp"/>
                </div>
              </div>

              {/* Right Side - Features */}
              <div>
                <ul className="space-y-3">
                  {customQuoteFeatures.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-gray-700"
                    >
                      <span className="text-[#E3E3E3]"><CheckIcon /></span>
                      <span className="text-black max-md:text-sm text-base font-jakarta">{feature}</span>
                    </li>
                  ))}
                </ul>

                <p className="text-[#777777] text-base max-md:text-sm mt-6 italic font-jakarta">
                  Built around your product, not templates
                </p>
              </div>
                  <div className="grid grid-cols-1 gap-3 md:hidden">
                  <LetsTalkButton fullWidth variant="dark" children="Chat on WhatsApp"/>
                </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Benefits Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {benefits.map((benefit, index) => (
          <div key={index}>
            <Card className="rounded-[20px] max-md:rounded-[12px] bg-gradient-to-br from-[#EDEDED] via-[#FFFFFF] to-[#EDEDED] border-1 border-gray-200 shadow-sm h-full">
              <CardBody className="p-6 max-md:p-5">

                <h4 className="text-xl max-md:text-lg max-md:font-semibold font-bold mb-3 tracking-wide flex items-center  gap-2 font-mono max-md:text-center">
                  <img src={benefit.icon} alt=""  className="w-4 h-4 mb-1 max-md:w-6 max-md:h-6" /> {benefit.title}
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
          <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <h4 className="text-xl md:text-2xl font-bold text-gray-900">100% Satisfaction Guarantee</h4>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          Not happy with the first milestone? We'll refund your deposit — no questions asked.
          We're confident in our work because we've done this 100+ times for companies like yours.
        </p>
      </div>
    </motion.div>
  );
};

export default Pricing;
