"use client";

import { Button, Card, CardBody } from "@heroui/react";
import { motion } from "framer-motion";

import GlassBadge from "@/components/GlassBadge";
import { useIsMobile, createCardScrollVariants } from "@/hooks";

const Pricing = () => {
  const isMobile = useIsMobile();

  // Animation variants for cards
  const cardVariants = createCardScrollVariants(isMobile, {
    startY: 100,
    startScale: 0.8,
    duration: 1,
  });

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
      icon: "⏸️",
      title: "PAUSE ANYTIME",
      description:
        "You can easily pause your subscription whenever you need to, without any worries or hassle.",
    },
    {
      icon: "🚀",
      title: "5-DAY PILOT PROJECT",
      description:
        "Big scope. Big budget. No blind trust. This 5-day pilot shows you see our execution before committing long term.",
    },
    {
      icon: "💎",
      title: "LOW-RISK, HIGH-VALUE",
      description:
        "Your fee is fully deductible from the final invoice if you move forward with a full project.",
    },
  ];

  return (
    <div className="py-12 max-md:py-8 container mx-auto px-6 md:px-12 lg:px-24 ">
      {/* Header */}
      <div className="text-center mb-12 max-md:mb-8">
        <div className="flex justify-center mb-6">
          <GlassBadge variant="gradient">PRICING</GlassBadge>
        </div>
        <h2 className="heading-center">
          Pricing That Makes Sense
        </h2>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Retainer Card */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.3 }}
        >
          <Card className="rounded-[32px] max-md:rounded-[24px]  bg-gradient-to-br from-gray-900 to-black border-1 border-gray-800 shadow-lg h-full">
          <CardBody className="p-8 max-md:p-6">
            {/* Icon */}
            <div className="mb-6">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🚀</span>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-3xl max-md:text-2xl font-bold mb-2 text-white">
              Monthly <span className="text-orange-500">Retainer</span>
            </h3>

            {/* Subtitle */}
            <p className="text-gray-400 text-sm font-mono mb-6 uppercase tracking-wide">
              For teams that need design & dev support, every month
            </p>

            {/* Features List */}
            <ul className="space-y-3 mb-8">
              {monthlyRetainerFeatures.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-gray-300"
                >
                  <span className="text-gray-500 mt-1">✓</span>
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Footer */}
            <div className="mt-auto">
              <p className="text-gray-500 text-sm mb-4 italic">
                One subscription, endless possibilities
              </p>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl max-md:text-4xl font-black text-white">
                    $2000
                  </span>
                  <span className="text-gray-400 text-lg">/per month</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="bg-orange-500 text-white rounded-[16px] px-6 py-6 font-bold text-base flex-1 hover:bg-orange-600 transition-colors">
                  Book a Call
                </Button>
                <Button
                  className="bg-transparent text-white rounded-[16px] px-6 py-6 font-bold text-base flex-1 border-2 border-gray-700 hover:border-gray-600 transition-colors"
                  variant="bordered"
                >
                  Lets Talk
                </Button>
              </div>
            </div>
          </CardBody>
          </Card>
        </motion.div>

        {/* Custom Project Estimate Card */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.3 }}
        >
          <Card className="rounded-[32px] max-md:rounded-[24px]  bg-white border-1 border-gray-200 shadow-sm h-full">
            <CardBody className="p-8 max-md:p-6">
              {/* Icon */}
              <div className="mb-6">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-3xl max-md:text-2xl font-bold mb-2">
                Custom Project <span className="text-orange-500">Estimate</span>
              </h3>

              {/* Subtitle */}
              <p className="text-gray-500 text-sm font-mono mb-6 uppercase tracking-wide">
                Get a quick ballpark before committing
              </p>

              {/* Description */}
              <p className="text-gray-700 mb-6">
                Pick your priorities, choose what you need, and get a realistic
                range in seconds.
              </p>

              {/* Features List */}
              <ul className="space-y-3 mb-8">
                {customProjectFeatures.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-gray-700"
                  >
                    <span className="text-gray-400 mt-1">✓</span>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Footer */}
              <div className="mt-auto">
                <p className="text-gray-400 text-sm mb-4 italic">
                  Clarity before commitment
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button className="bg-orange-500 text-white rounded-[16px] px-6 py-6 font-bold text-base flex-1 hover:bg-orange-600 transition-colors">
                    Calculate Now
                  </Button>
                  <Button
                    className="bg-white text-black rounded-[16px] px-6 py-6 font-bold text-base flex-1 border-2 border-gray-200 hover:border-gray-300 transition-colors"
                    variant="bordered"
                  >
                    Lets Talk
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>

      {/* Custom Quote Card - Full Width */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.3 }}
        className="mb-6"
      >
        <Card className="rounded-[32px] max-md:rounded-[24px]  bg-white border-1 border-gray-200 shadow-sm">
          <CardBody className="p-8 max-md:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Side */}
              <div>
                {/* Icon */}
                <div className="mb-6">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🏢</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-3xl max-md:text-2xl font-bold mb-2">
                  Custom <span className="text-orange-500">Quote</span>
                </h3>

                {/* Subtitle */}
                <p className="text-gray-500 text-sm font-mono mb-6 uppercase tracking-wide">
                  For complex products, enterprise needs & startups
                </p>

                {/* Description */}
                <p className="text-gray-700 mb-6">
                  Best suited for products that don't fit into standard plans.
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button className="bg-orange-500 text-white rounded-[16px] px-6 py-6 font-bold text-base hover:bg-orange-600 transition-colors">
                    Book a Call
                  </Button>
                  <Button
                    className="bg-white text-black rounded-[16px] px-6 py-6 font-bold text-base border-2 border-gray-200 hover:border-gray-300 transition-colors"
                    variant="bordered"
                  >
                    Lets Talk
                  </Button>
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
                      <span className="text-gray-400 mt-1">✓</span>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <p className="text-gray-400 text-sm mt-6 italic">
                  Built around your product, not templates
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Benefits Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.3 }}
          >
            <Card className="rounded-[32px] max-md:rounded-[24px] bg-white border-1 border-gray-200 shadow-sm h-full">
              <CardBody className="p-6 max-md:p-5">
                <div className="text-3xl mb-4">{benefit.icon}</div>
                <h4 className="text-base font-bold font-mono mb-3 tracking-wide">
                  {benefit.title}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
