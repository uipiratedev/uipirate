"use client";

import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import { motion } from "framer-motion";


import { useIsMobile, createCardScrollVariants } from "@/hooks";

// Sun Rays Component
const SunRays = ({ color = "rgba(255, 165, 0, 0.15)", rayCount = 12 }) => {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-[32px] max-md:rounded-[24px]  pointer-events-none">
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{
          duration: 100,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {Array.from({ length: rayCount }).map((_, index) => {
          const angle = (360 / rayCount) * index;
          return (
            <div
              key={index}
              className="absolute top-1/2 left-1/2 origin-left"
              style={{
                transform: `rotate(${angle}deg)`,
                width: '150%',
                height: '130px', // Increased height for the widening effect
              }}
            >
              <div
                className="h-full"
                style={{
                  background: `linear-gradient(to right, ${color} 0%, transparent 70%)`,
                  clipPath: 'polygon(0 50%, 100% 0%, 100% 100%)', // Creates triangular/tapered shape
                }}
              />
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};

const ServicesSection = () => {
  const isMobile = useIsMobile();

  const services = [
    {
      icon: "💻",
      title: "UX/UI DESIGN",
    },
    {
      icon: "⚡",
      title: "Saas & AI Development",
    },
    {
      icon: "🌐",
      title: "LANDING PAGES & BUSINESS WEBSITES",
    },
    {
      icon: "🎨",
      title: "GRAPHIC DESIGN",
    },
    {
      icon: "🎬",
      title: "MOTION GRAPHIC",
    },
    {
      icon: "🔍",
      title: "UX AUDITS & CONSULTATION",
    },
    {
      icon: "🎮",
      title: "3D ASSETS & ANIMATION",
    },
  ];

  // Animation variants for cards
  const cardVariants = createCardScrollVariants(isMobile, {
    startY: 100,
    startScale: 0.8,
    duration: 1,
  });

  return (
    <div className="py-12 pt-8 max-md:py-8">
      {/* top card  */}
       <motion.div
        variants={cardVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.3 }}
      >
        <Card className="rounded-[32px] max-md:rounded-[24px] bg-white border-1 border-black/10 shadow-sm">
          <CardBody className="p-8 max-md:p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <h3 className="text-3xl max-md:text-2xl font-bold">
                Check Suite of Products Ready for Sale
              </h3>
              <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                <a
                  className="w-full md:w-auto"
                  href="https://wa.me/919708636151"
                  rel="noreferrer"
                  target="_blank"
                >
                  <Button className="bg-black text-white rounded-[16px] px-8 py-6 font-bold text-base w-full md:w-auto hover:bg-gray-800 transition-colors">
                    See Products In Action
                  </Button>
                </a>
               
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>
      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 my-6">
        {/* Left Card - Apps, SaaS, Websites & More */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.3 }}
          className="col-span-2"
        >
          <Card className="rounded-[32px] max-md:rounded-[24px]   bg-gradient-to-br from-orange-50 to-yellow-50 border-1 border-[#0000000f] shadow-sm h-full relative overflow-hidden"
          style={{padding:"0px"}}
          >
            
            <CardHeader className="relative z-10">
              <div className="bg-orange-500 text-white rounded-full w-full flex items-center justify-between px-6 py-2">
                {/* Left Circle */}
                <div className="w-6 h-6 bg-[#DE5005] rounded-full flex-shrink-0" style={{boxShadow: "0px 0.36px 0.36px 0px #7E7E7E8C inset"}} />

                {/* Text */}
                <p 
                  className="uppercase text-center flex-1"
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontWeight: 800,
                    fontSize: '15.54px',
                    lineHeight: '22.51px',
                    letterSpacing: '-0.24px',
                    verticalAlign: 'middle',
                  }}
                >
                  AI Apps, Saas, Websites & More
                </p>
                
                {/* Right Circle */}
                <div className="w-6 h-6 bg-[#DE5005] rounded-full flex-shrink-0" style={{boxShadow: "0px 0.36px 0.36px 0px #7E7E7E8C inset"}} />
              </div>
            </CardHeader>
            <SunRays color="rgba(255, 140, 0, 0.12)" rayCount={16} />
          <CardBody className="p-8 max-md:p-6 relative z-10">
            
            <div className="flex justify-center items-center">
              <div className="relative">
                <img src="/assets/servicesBanner.svg" alt="" className="" />
                </div>
            </div>
          </CardBody>
          </Card>
        </motion.div>

        {/* Right Card - One-stop shop */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.3 }}
          className="col-span-3"
        >
          <Card className="rounded-[32px] max-md:rounded-[24px] noise-texture bg-black border-1 border-gray-800 shadow-lg h-full">
            <CardBody className="p-8 max-md:p-6">
              <h3 className="text-2xl max-md:text-xl font-bold mb-6 text-white">
                One-stop shop for{" "}
                <span className="text-orange-500">all your essentials</span>
              </h3>
              <div className="flex flex-wrap gap-3">
                {services.map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 text-gray-300 w-fit font-mono text-sm max-md:text-xs bg-[#292929] z-[999999999999999] rounded-lg p-3 hover:bg-[#292929] transition-colors"
                  >
                    <span className="text-lg">{service.icon}</span>
                    <span className="font-medium tracking-wide">
                      {service.title}
                    </span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Card - Need Something Custom */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.3 }}
      >
        <Card className="rounded-[32px] max-md:rounded-[24px]  bg-white border border-black/10 shadow-sm">
          <CardBody className="p-8 max-md:p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <h3 className="text-3xl max-md:text-2xl font-bold">
                Need Something Custom ?
              </h3>
              <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                <a
                  className="w-full md:w-auto"
                  href="https://wa.me/919708636151"
                  rel="noreferrer"
                  target="_blank"
                >
                  <Button className="bg-black text-white rounded-[16px] px-8 py-6 font-bold text-base w-full md:w-auto hover:bg-gray-800 transition-colors">
                    Let's Talk
                  </Button>
                </a>
               
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
};

export default ServicesSection;
