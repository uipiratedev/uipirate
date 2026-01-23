import { Card, CardBody } from "@heroui/react";
import { motion } from "framer-motion";

import GlassBadge from "@/components/GlassBadge";

const TheTeam = () => {
  const teamMembers = [
    {
      name: "Team Member 1",
      role: "Role",
      image: "/placeholder-team.jpg", // You can update this later
      bgColor: "bg-gradient-to-br from-purple-400 to-purple-600",
    },
    {
      name: "Team Member 2",
      role: "Role",
      image: "/placeholder-team.jpg",
      bgColor: "bg-gradient-to-br from-green-400 to-green-600",
    },
    {
      name: "Team Member 3",
      role: "Role",
      image: "/placeholder-team.jpg",
      bgColor: "bg-gradient-to-br from-blue-400 to-blue-600",
    },
    {
      name: "Team Member 4",
      role: "Role",
      image: "/placeholder-team.jpg",
      bgColor: "bg-gradient-to-br from-yellow-400 to-yellow-600",
    },
    {
      name: "Team Member 5",
      role: "Role",
      image: "/placeholder-team.jpg",
      bgColor: "bg-gradient-to-br from-pink-400 to-pink-600",
    },
    {
      name: "Team Member 6",
      role: "Role",
      image: "/placeholder-team.jpg",
      bgColor: "bg-gradient-to-br from-orange-400 to-orange-600",
    },
    {
      name: "Team Member 7",
      role: "Role",
      image: "/placeholder-team.jpg",
      bgColor: "bg-gradient-to-br from-red-400 to-red-500",
    },
    {
      name: "Team Member 8",
      role: "Role",
      image: "/placeholder-team.jpg",
      bgColor: "bg-gradient-to-br from-lime-400 to-lime-600",
    },
    {
      name: "Team Member 9",
      role: "Role",
      image: "/placeholder-team.jpg",
      bgColor: "bg-gradient-to-br from-cyan-400 to-cyan-600",
    },
  ];

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="py-12 max-md:py-8 container mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-12 max-md:mb-8">
        <div className="flex justify-center mb-6">
          <GlassBadge variant="gradient">THE TEAM</GlassBadge>
        </div>
        <h2 className="text-4xl max-md:text-3xl font-bold tracking-tight">
          Meet The Crew On Board
        </h2>
      </div>

      {/* Team Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-md:gap-4"
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
                  {/* White gradient shadow overlay in center */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="w-64 h-64 rounded-full"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.2) 30%, rgba(255,255,255,0) 70%)",
                      }}
                    />
                  </div>

                  {/* Placeholder for team member image */}
                  <div className="relative z-10 w-full h-full flex items-center justify-center">
                    <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white text-4xl">👤</span>
                    </div>
                  </div>
                  {/* You can replace the above div with an actual image like this:
                  <img
                    src={member.image}
                    alt={member.name}
                    className="relative z-10 w-full h-full object-cover"
                  /> */}
                </div>

                {/* Name and Role (Optional - can be added if needed) */}
                {/* <div className="p-4 bg-white">
                  <h3 className="text-lg font-bold">{member.name}</h3>
                  <p className="text-sm text-gray-600">{member.role}</p>
                </div> */}
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default TheTeam;
