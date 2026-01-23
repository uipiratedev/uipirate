"use client";

import { Button, Card, CardBody } from "@heroui/react";
import { motion } from "framer-motion";
import NextLink from "next/link";

import { useIsMobile, createCardScrollVariants } from "@/hooks";

const ServicesSection = () => {
  const isMobile = useIsMobile();

  const services = [
    {
      icon: "💻",
      title: "UX/UI DESIGN",
    },
    {
      icon: "⚡",
      title: "FRONTEND UI DEVELOPMENT",
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
      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Left Card - Apps, SaaS, Websites & More */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.3 }}
        >
          <Card className="rounded-[40px] max-md:rounded-[32px] bg-gradient-to-br from-orange-50 to-yellow-50 border-1 border-[#0000000f] shadow-sm h-full">
          <CardBody className="p-8 max-md:p-6">
            <h3 className="text-2xl max-md:text-xl font-bold mb-6">
              Apps, Saas, Websites & More
            </h3>
            <div className="flex justify-center items-center min-h-[300px]">
              <div className="relative">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-8 max-md:p-6 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-300">
                  <div className="text-white text-center">
                    <p className="text-4xl max-md:text-3xl font-black mb-2">
                      ALL
                    </p>
                    <p className="text-4xl max-md:text-3xl font-black mb-2">
                      THINGS
                    </p>
                    <p className="text-3xl max-md:text-2xl font-bold mb-2">
                      YOU NEED
                    </p>
                    <p className="text-2xl max-md:text-xl font-bold mb-2">
                      UNDER
                    </p>
                    <p className="text-3xl max-md:text-2xl font-black">
                      ONE ROOF
                    </p>
                  </div>
                </div>
                {/* Decorative stamp border effect */}
                <div className="absolute inset-0 border-4 border-dashed border-orange-300 rounded-3xl -z-10 transform scale-105" />
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
        >
          <Card className="rounded-[40px] max-md:rounded-[32px] bg-gradient-to-br from-gray-900 to-black border-1 border-gray-800 shadow-lg h-full">
            <CardBody className="p-8 max-md:p-6">
              <h3 className="text-2xl max-md:text-xl font-bold mb-6 text-white">
                One-stop shop for{" "}
                <span className="text-orange-500">all your essentials</span>
              </h3>
              <div className="space-y-4">
                {services.map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 text-gray-300 font-mono text-sm max-md:text-xs bg-gray-800/50 rounded-lg p-3 hover:bg-gray-800 transition-colors"
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
        <Card className="rounded-[40px] max-md:rounded-[32px] bg-white border-1 border-[#0000000f] shadow-sm">
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
                <NextLink className="w-full md:w-auto" href="/services">
                  <Button
                    className="bg-white text-black rounded-[16px] px-8 py-6 font-bold text-base w-full md:w-auto border-2 border-gray-200 hover:border-gray-300 transition-colors"
                    variant="bordered"
                  >
                    View All Services
                  </Button>
                </NextLink>
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
};

export default ServicesSection;
