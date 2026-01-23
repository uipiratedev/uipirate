"use client";

import { Card, CardBody } from "@heroui/react";
import { motion, Variants, Easing } from "framer-motion";

import { getGradientById } from "@/utils/gradientService";

const data = {
  heading: "Simple. Strategic. Results-Driven.",
  badge: "Our Process",
  card: [
    {
      icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1761645511/deliver_ref_vn3hye.svg",
      heading: "Deliver & Refine",
      discription:
        "We launch the pilot or live build, gather insights, and polish every detail to ensure it performs beautifully in production.",
      gradientId: 1, // Pink Blush
    },
    {
      icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1760610137/rocket_pk7ci5.svg",
      heading: "Discover & Understand",
      discription:
        "We dive into your product goals, audience, & user needs, focusing on clarity, intent, and measurable outcomes.",
      gradientId: 2, // Lime Fresh
    },
    {
      icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1761645576/plan_m9mxcj.svg",
      heading: "Plan & Structure",
      discription:
        "We define the IA, visual direction, & tech stack, aligning design & development from day one for smoother execution.",
      gradientId: 3, // Cyan Sky
    },
    {
      icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1761645576/build_z1rwkj.svg",
      heading: "Build & Iterate",
      discription:
        "We design, develop, and test in quick, focused sprints, showing progress early and adapting fast to real feedback.",
      gradientId: 1, // Pink Blush
    },
  ],
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut" as Easing,
    },
  }),
};

const ProgressCard = () => {
  return (
    <div className="pt-0 max-md:pt-8">
      {/* Heading Section Animation */}
      <motion.div
        className="autoShow"
        initial={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.8, ease: "easeOut" as Easing }}
        viewport={{ once: true, amount: 0.3 }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-row items-center justify-center mb-6">
          <span className="bg-[#8EF1F1] px-4 py-2 rounded-xl font-semibold uppercase border-cyan-400 border-2">
            {data.badge}
          </span>
        </div>
        <p className="heading-center">{data.heading}</p>
      </motion.div>

      {/* Cards Section */}
      <div className="grid grid-cols-4 max-md:grid-cols-1 max-lg:grid-cols-2 gap-6 max-md:gap-4 mt-12 max-md:mt-0">
        {data.card.map((item, index) => (
          <motion.div
            key={index}
            className="h-full"
            custom={index}
            initial="hidden"
            transition={{ type: "spring", stiffness: 120, damping: 10 }}
            variants={cardVariants}
            viewport={{ once: true, amount: 0.3 }}
            whileHover={{ scale: 1.03, y: -5 }}
            whileInView="visible"
          >
            <Card
              className="rounded-[48px] max-md:rounded-[38px] mt-6 bg-white group shadow-none border border-[#0000000f] h-full"
              style={{
                boxShadow: "0px 3px 7px 3px rgba(0, 0, 0, 0.09)",
              }}
            >
              <CardBody className="p-1.5 h-full">
                <Card
                  className="rounded-[40px] max-md:rounded-[30px] h-full flex flex-col justify-between"
                  style={{
                    background: getGradientById(item.gradientId)?.value,
                  }}
                >
                  <CardBody className="p-6 max-md:p-5 flex flex-col justify-between h-full">
                    <div>
                      <motion.div
                        className="border border-[#00000014] bg-white rounded-xl p-2 w-fit"
                        initial={{ scale: 0.8, opacity: 0 }}
                        transition={{ delay: index * 0.25, duration: 0.5 }}
                        viewport={{ once: true }}
                        whileInView={{ scale: 1, opacity: 1 }}
                      >
                        <img
                          alt={item.heading}
                          className="w-[40px] h-[40px] p-1 grayscale"
                          src={item.icon}
                        />
                      </motion.div>

                      <p className="text-xl max-md:text-base font-bold mt-3">
                        {item.heading}
                      </p>
                      {item.discription && (
                        <p className="text-base max-md:text-sm font-medium py-2">
                          {item.discription}
                        </p>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProgressCard;
