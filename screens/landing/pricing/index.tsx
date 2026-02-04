"use client";

import { Button, Card, CardBody } from "@heroui/react";
import { motion } from "framer-motion";

import GlassBadge from "@/components/GlassBadge";
import { useIsMobile, createCardScrollVariants } from "@/hooks";
import { CheckIcon } from "@/components/icons";
import LetsTalkButton from "@/components/LetsTalkButton";
import ProjectEstimate from "@/components/ProjectEstimate";

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
    <div className="py-12 max-md:py-8 container mx-auto px-6 md:px-12 lg:px-24 ">
      {/* Header */}
      <div className=" autoShow text-center mb-12 max-md:mb-8">
        <div className="flex justify-center mb-6">
          <GlassBadge variant="gradient">PRICING</GlassBadge>
        </div>
        <h2 className="heading-center">
          Pricing That Makes Sense
        </h2>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Monthly Retainer Card */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.3 }}
        >
          <Card className="rounded-[20px] max-md:rounded-[12px]  bg-gradient-to-br from-[#212121] to-[#151514] border-1 border-gray-800 shadow-lg h-full noise-texture "
          style={{
            boxShadow: "0px 3.79px 2.53px 0px #FFFFFF73 inset",

          }}
          
          >
          <CardBody className="p-8 max-md:p-6">
            {/* Icon */}
            <div className="mb-6">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center">
               <img src="/assets/gif/kite.gif" alt="" />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-3xl max-md:text-2xl font-bold mb-2 text-white "
            style={{fontFamily:"'Plus Jakarta Sans', sans-serif"}}
            >
              Monthly <span className="text-orange-600">Retainer</span>
            </h3>

            {/* Subtitle */}
            <p className="bg-[#262626] text-white w-fit p-2 rounded-lg text-sm font- mb-6 uppercase tracking-wide"
            style={{fontFamily:"'Plus Jakarta Mono', monospace"}}
            >
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
                  <span className="text-white max-md:text-sm text-base"
                  style={{fontFamily:"'Plus Jakarta Sans', sans-serif"}}
                  >{feature}</span>
                </li>
              ))}
            </ul>

            {/* Footer */}
            <div className="mt-auto">
              <p className="text-[#777777] text-base max-md:text-sm mb-4 italic"
              style={{fontFamily:"'Plus Jakarta Sans', sans-serif"}}
              >
                One subscription, endless possibilities
              </p>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl max-md:text-4xl font-black text-white"
                   style={{fontFamily:"'Plus Jakarta Mono', monospace"}}
                  >
                    $2000
                  </span>
                  <span className="text-[#999999] text-lg"
                  style={{fontFamily:"'Plus Jakarta Sans', sans-serif"}}
                  >/per month</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <LetsTalkButton fullWidth variant="color" children="Book a Call"/>
                   <LetsTalkButton fullWidth variant="dark"/>
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
          <ProjectEstimate cardVariants={cardVariants} />
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
        <Card className="rounded-[20px] max-md:rounded-[12px]  bg-white border-1 border-gray-200 shadow-sm">
          <CardBody className="p-8 max-md:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Side */}
              <div>
                {/* Icon */}
                <div className="mb-6">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <img src="/assets/gif/headquater.gif" alt="" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-3xl max-md:text-2xl font-bold mb-2">
                  Custom <span className="text-orange-600">Quote</span>
                </h3>

                {/* Subtitle */}
                <p className="bg-black/5 text-black w-fit p-2 rounded-lg text-sm mb-6 uppercase tracking-wide"
                style={{fontFamily:"'Plus Jakarta Mono', monospace"}}
                >
                  For complex products, enterprise needs & startups
                </p>

                {/* Description */}
                <p className="text-[#161616] mb-6 text-base max-md:text-sm"
                style={{fontFamily:"'Plus Jakarta Sans', sans-serif"}}
                >
                  Best suited for products that don't fit into standard plans.
                </p>

                {/* Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <LetsTalkButton fullWidth variant="color" children="Book a Call"/>
                  <LetsTalkButton fullWidth/>
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
                      <span className="text-black max-md:text-sm text-base"
                      style={{fontFamily:"'Plus Jakarta Sans', sans-serif"}}
                      >{feature}</span>
                    </li>
                  ))}
                </ul>

                <p className="text-[#777777] text-base max-md:text-sm mt-6 italic"
                style={{fontFamily:"'Plus Jakarta Sans', sans-serif"}}
                >
                  Built around your product, not templates
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Benefits Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.3 }}
          >
            <Card className="rounded-[20px] max-md:rounded-[12px] bg-gradient-to-br from-[#EDEDED] via-[#FFFFFF] to-[#EDEDED] border-1 border-gray-200 shadow-sm h-full">
              <CardBody className="p-6 max-md:p-5">
               
                <h4 className="text-xl font-bold mb-3 tracking-wide flex items-center gap-2"
                style={{fontFamily:"'Plus Jakarta Mono', monospace"}}
                >
                  <img src={benefit.icon} alt=""  className="w-4 h-4" /> {benefit.title}
                </h4>
                <p className="text-sm text-[#555555] leading-relaxed"
                style={{fontFamily:"'Plus Jakarta Sans', sans-serif"}}
                >
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
