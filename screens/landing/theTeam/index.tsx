import { Card, CardBody } from "@heroui/react";
import { motion, Variants } from "framer-motion";

import GlassBadge from "@/components/GlassBadge";

const TheTeam = () => {
  const teamMembers = [
    {
      name: "Team Member 1",
      role: "Role",
      image: "/assets/teams/vishal.svg", // You can update this later
      bgColor: "bg-gradient-to-br from-purple-400 to-purple-600",
    },
    {
      name: "Team Member 2",
      role: "Role",
      image: "/assets/teams/danish.svg",
      bgColor: "bg-gradient-to-br from-green-400 to-green-600",
    },
    {
      name: "Team Member 3",
      role: "Role",
      image: "/assets/teams/musaddiq.svg",
      bgColor: "bg-gradient-to-br from-blue-400 to-blue-600",
    },
    {
      name: "Team Member 4",
      role: "Role",
      image: "/assets/teams/kartik.svg",
      bgColor: "bg-gradient-to-br from-yellow-400 to-yellow-600",
    },
    {
      name: "Team Member 5",
      role: "Role",
      image: "/assets/teams/prayagini.svg",
      bgColor: "bg-gradient-to-br from-pink-400 to-pink-600",
    },
    {
      name: "Team Member 6",
      role: "Role",
      image: "/assets/teams/aniket.svg",
      bgColor: "bg-gradient-to-br from-orange-400 to-orange-600",
    },
    {
      name: "Team Member 7",
      role: "Role",
      image: "/assets/teams/harsh.svg",
      bgColor: "bg-gradient-to-br from-red-400 to-red-500",
    },
    {
      name: "Team Member 8",
      role: "Role",
      image: "/assets/teams/karan.svg",
      bgColor: "bg-gradient-to-br from-lime-400 to-lime-600",
    },
    {
      name: "Team Member 9",
      role: "Role",
      image: "/assets/teams/aman.svg",
      bgColor: "bg-gradient-to-br from-cyan-400 to-cyan-600",
    },
  ];

  // Animation variants for Framer Motion
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <div className="py-12 max-md:py-8  container mx-auto px-6 md:px-12 lg:px-24">
      {/* Header */}
      <div className="text-center mb-12 max-md:mb-8">
        <div className="flex justify-center mb-6">
          <GlassBadge variant="gradient">THE TEAM</GlassBadge>
        </div>
        <h2 className="heading-center">
          Meet The Crew On Board
        </h2>
      </div>

      {/* Team Grid */}
      <motion.div
        className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4 max-md:gap-4"
        initial="hidden"
        variants={containerVariants}
        viewport={{ once: true, amount: 0.2 }}
        whileInView="visible"
      >
        {teamMembers.map((member, index) => (
          <motion.div key={index} variants={cardVariants}>
            <Card className="rounded-[32px] max-md:rounded-[24px] overflow-hidden border-none shadow-lg">
              <CardBody className="p-0">
                {/* Image Container with Gradient Background */}
                <div
                  className={`relative w-full aspect-[4/3] ${member.bgColor} flex items-center justify-center overflow-hidden`}
                >
                  

                  <img
                    src={member.image}
                    alt={member.name}
                    className="relative z-10 w-full h-full object-cover"
                  />
                </div>

               
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default TheTeam;
