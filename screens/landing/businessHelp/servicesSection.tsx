"use client";

import { Button, Card, CardBody, CardHeader, Link } from "@heroui/react";
import { motion } from "framer-motion";


import { useIsMobile, createCardScrollVariants } from "@/hooks";
import LetsTalkButton from "@/components/LetsTalkButton";

// Sun Rays Component
const SunRays = ({ color = "rgba(255, 165, 0, 0.15)", rayCount = 12, isMobile = false }) => {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-[20px] max-md:rounded-[12px]  pointer-events-none">
      <motion.div
        className="absolute inset-0"
        animate={isMobile ? {} : { rotate: 360 }}
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
      icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1770113288/uxui_qjw76q.svg",
      title: "UX/UI DESIGN",
    },
    {
      icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1770113550/code_h8gq63.svg",
      title: "Saas & AI Development",
    },
    {
      icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1770113288/landing_jirsl5.svg",
      title: "LANDING PAGES & BUSINESS WEBSITES",
    },
    {
      icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1770113288/graphic_s0cmgk.svg",
      title: "GRAPHIC DESIGN",
    },
    {
      icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1770113288/motion_dqrdcl.svg",
      title: "MOTION GRAPHIC",
    },
    {
      icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1770113288/ux_biqghx.svg",
      title: "UX AUDITS & CONSULTATION",
    },
    {
      icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1770113288/3d_wtkihl.svg",
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
        <Card className="rounded-[20px] max-md:rounded-[12px] bg-white border-1 border-black/10 shadow-sm">
          <CardBody className="p-8 max-md:p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <h3 className="text-3xl max-md:text-xl font-bold">
                Check Suite of Products Ready for Sale
              </h3>
              <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              

    
                 <LetsTalkButton fullWidth variant="dark" children="See Products In Action" href="/contact"/>
           
               
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
          <Card className="rounded-[20px] max-md:rounded-[12px]   bg-gradient-to-br from-orange-50 to-yellow-50 border-1 border-[#0000000f] shadow-sm h-full relative overflow-hidden"
          style={{padding:"0px"}}
          >
            
            <CardHeader className="relative z-10" style={{margin:"0px",padding:"0px",

              boxShadow: "0px 1.03px 1.44px 0px #FFFFFFA6 inset",

            }}>
              <div className="bg-orange-500 text-white rounded-full max-md:rounded-xl w-full flex items-center justify-between px-6 max-md:px-4 py-2">
                {/* Left Circle */}
                <div className="w-6 h-6 bg-[#DE5005] rounded-full flex-shrink-0" style={{boxShadow: "0px 0.36px 0.36px 0px #7E7E7E8C inset"}} />

                {/* Text */}
                <p 
                  className="uppercase text-center flex-1 text-[15px] max-md:text-[12px]"
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontWeight: 800,
                    // fontSize: '15.54px',
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
            <SunRays color="rgba(255, 140, 0, 0.12)" rayCount={16} isMobile={isMobile} />
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
          <Card className="rounded-[20px] max-md:rounded-[12px] noise-texture bg-black border-1 border-gray-800 shadow-lg h-full"
          style={{
            boxShadow: "0px 3.79px 2.53px 0px #FFFFFF73 inset",

          }}
          >
            <CardBody className="p-8 max-md:p-6">
              <h3 className="text-2xl max-md:text-xl font-bold mb-6 text-white">
                One-stop shop for{" "}
                <span className="text-orange-500">all your essentials</span>
              </h3>
              <div className="gap-3 grid grid-cols-2 max-md:grid-cols-1">
                {services.map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 text-gray-300 w-full font-mono text-sm max-md:text-xs bg-[#292929] rounded-lg p-3 hover:bg-[#292929] transition-colors"
                  >
                    <span className="text-lg"><img src={service.icon} alt="" className="w-4 h-4" /></span>
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
        <Card className="rounded-[20px] max-md:rounded-[12px]  bg-white border border-black/10 shadow-sm">
          <CardBody className="p-8 max-md:p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <h3 className="text-3xl max-md:text-xl font-bold">
                Need Something Custom ?
              </h3>
              <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
               

                  <LetsTalkButton fullWidth variant="light" children="Let's Talk"/>
               
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
};

export default ServicesSection;
