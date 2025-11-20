"use client";

import { motion } from "framer-motion";
import { Card, CardBody, CardHeader } from "@nextui-org/react";

const data = [
  {
    heading: "Xperiti",
    subtitle:
      "An integrated platform for efficient qualitative & quantitative research management.",
    img: "https://res.cloudinary.com/damm9iwho/image/upload/v1731155233/xperiti_psd_file_1_cvfkqh.svg",
    url: "https://www.xperiti.com/",
  },
  {
    heading: "Legaltech AI SaaS",
    subtitle:
      "AI-powered legal platform to streamline document analysis, automate drafting, and support legal professionals.",
    img: "https://res.cloudinary.com/damm9iwho/image/upload/v1761444013/lega_n7vqzw.svg",
    url: "https://www.xperiti.com/",
  },
  {
    heading: "ION",
    subtitle:
      "Order fulfilment SaaS platform designed to streamline medical supply chain operations.",
    img: "https://res.cloudinary.com/damm9iwho/image/upload/v1761444002/ion_xce6b5.svg",
    url: "https://arthalpha.in/",
  },
  {
    heading: "Brahmastra",
    subtitle:
      "A trading platform with real-time data, advanced charting, and customizable strategies to enhance trading efficiency.",
    img: "https://res.cloudinary.com/damm9iwho/image/upload/v1761443918/brahma_jvnmc9.svg",
    url: "https://ringsandi.com/",
  },
  {
    heading: "Rings & I",
    subtitle:
      "A Shopify-powered e-commerce site for custom ring design and sales.",
    img: "https://res.cloudinary.com/damm9iwho/image/upload/v1730025333/rings_gnmm1x.svg",
    url: "https://ringsandi.com/",
  },
  {
    heading: "FrytX",
    subtitle:
      "An all-in-one platform for business operations, customer service, verification, and financial management.",
    img: "https://res.cloudinary.com/damm9iwho/image/upload/v1730025188/frytx_mo0frx.svg",
    url: "https://ringsandi.com/",
  },
  {
    heading: "Test Dynamiz",
    subtitle:
      "An automated software testing SaaS for efficient, high-quality releases.",
    img: "https://res.cloudinary.com/damm9iwho/image/upload/v1761444003/test_oxuysl.svg",
    url: "https://ringsandi.com/",
  },
  {
    heading: "SimpleO",
    subtitle:
      "An AI-powered legal management system for streamlined contracts and compliance.",
    img: "https://res.cloudinary.com/damm9iwho/image/upload/v1761443926/simplo_dnrjzi.svg",
    url: "https://ringsandi.com/",
  },
  {
    heading: "StayPe",
    subtitle:
      "A streamlined app for finding, securing, and managing rental properties throughout the entire rental lifecycle.",
    img: "https://res.cloudinary.com/damm9iwho/image/upload/v1761444021/staype_o0y07w.svg",
    url: "https://ringsandi.com/",
  },
  {
    heading: "Infinity AquaSol",
    subtitle:
      "A website highlighting cutting-edge water treatment and environmental solutions.",
    img: "https://res.cloudinary.com/damm9iwho/image/upload/v1761444012/infinity_aqvvse.svg",
    url: "https://ringsandi.com/",
  },

  {
    heading: "Cloud Shift",
    subtitle:
      "A specialized cloud migration platform to guide and support businesses transitioning to cloud infrastructure.",
    img: "https://res.cloudinary.com/damm9iwho/image/upload/v1761444015/cloud_wawxjj.svg",
    url: "https://ringsandi.com/",
  },

  {
    heading: "StayRealtor",
    subtitle:
      "A property management app to optimize landlord and broker operations and improve tenant relations.",
    img: "https://res.cloudinary.com/damm9iwho/image/upload/v1761443928/stayrelater_vbxkvv.svg",
    url: "https://ringsandi.com/",
  },

  {
    heading: "OLSO",
    subtitle:
      "A peer-to-peer platform for local product borrowing and sharing.",
    img: "https://res.cloudinary.com/damm9iwho/image/upload/v1761443916/olso_ldpdnw.svg",
    url: "https://ringsandi.com/",
  },
];

const CaseStudyCard = () => {
  return (
    <div className="min-h-screen pt-32 max-md:pt-24">
      {/* Section Heading */}
      <div className="text-center mb-10 autoShow">
        <span className="rounded-xl border-2 border-cyan-400 bg-[#8EF1F1] px-4 py-2 font-semibold uppercase">
          Featured Case Studies
        </span>
        <p className="heading-center mt-4 max-md:mt-6">
          What happens behind the scenes
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 gap-4 mt-8 max-md:mt-0">
        {data.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            transition={{
              duration: 0.7,
              delay: index * 0.1,
              ease: "easeOut",
            }}
            viewport={{ once: true, amount: 0.3 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            {/* <Link href={item.url} target="_blank"> */}
            <Card className="rounded-[40px] max-md:rounded-[30px] bg-[#e9e9e9]  h-full shadow-none border border-[#0000000f] overflow-hidden">
              <CardBody className="p-1.5">
                <Card className="rounded-[30px] max-md:rounded-[20px] h-full box-shadow overflow-hidden">
                  {/* Image */}
                  <CardHeader className="p-0">
                    <img
                      alt={item.heading}
                      className="w-full h-[250px] object-cover"
                      src={item.img}
                    />
                  </CardHeader>

                  {/* Text */}
                  <CardBody className="p-6">
                    <h3 className="text-2xl max-md:text-xl font-bold mb-3 tracking-tight text-gray-900">
                      {item.heading}
                    </h3>
                    <p className="text-base text-[#666] mb-4 font-medium leading-relaxed opacity-90">
                      {item.subtitle}
                    </p>
                  </CardBody>
                </Card>
              </CardBody>
            </Card>
            {/* </Link> */}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CaseStudyCard;
