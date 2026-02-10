import { Card, CardBody, Tooltip } from "@heroui/react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { useState } from "react";

import GlassBadge from "@/components/GlassBadge";
import GlassSurface from "@/components/GlassSurface";

const TheTeam = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const teamMembers = [
    {
      name: "Vishal",
      role: "Founder",
      quote: "I’m Vishal. I lead the product and direction.",
      image: "/assets/teams/vishal.svg",
      bgColor: "bg-gradient-to-br from-purple-400 to-purple-600",
    },
    {
      name: "Danish",
      role: "Lead Frontend Dev",
      quote: "I’m Danish. I build and ship the frontend.",
      image: "/assets/teams/danish.svg",
      bgColor: "bg-gradient-to-br from-green-400 to-green-600",
    },
    {
      name: "Musuddiq",
      role: "Lead UX Designer",
      quote: "I’m Musuddiq. I design how the product works.",
      image: "/assets/teams/musaddiq.svg",
      bgColor: "bg-gradient-to-br from-blue-400 to-blue-600",
    },
    {
      name: "Kartik",
      role: "Lead Graphics & Motion",
      quote: "I’m Kartik. I design visuals and motion.",
      image: "/assets/teams/kartik.svg",
      bgColor: "bg-gradient-to-br from-yellow-400 to-yellow-600",
    },
    {
      name: "Priyagni",
      role: "Graphic Designer",
      quote: "I’m Priyagni. I work on visual design.",
      image: "/assets/teams/prayagini.svg",
      bgColor: "bg-gradient-to-br from-pink-400 to-pink-600",
    },
    {
      name: "Aniket",
      role: "Lead Backend Dev",
      quote: "I’m Aniket. I handle backend architecture.",
      image: "/assets/teams/aniket.svg",
      bgColor: "bg-gradient-to-br from-orange-400 to-orange-600",
    },
    {
      name: "Harsh",
      role: "Backend Dev",
      quote: "I’m Harsh. I build backend systems.",
      image: "/assets/teams/harsh.svg",
      bgColor: "bg-gradient-to-br from-red-400 to-red-500",
    },
    {
      name: "Karan",
      role: "Marketing",
      quote: "I’m Karan. I handle marketing and growth.",
      image: "/assets/teams/karan.svg",
      bgColor: "bg-gradient-to-br from-lime-400 to-lime-600",
    },
    {
      name: "Aman",
      role: "Video Editing",
      quote: "I’m Aman. I edit and produce videos.",
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
    <div className="container mx-auto px-6 md:px-12 lg:px-24 relative">

      {/* Header */}
      <div className="text-center mb-6 max-md:mb-4">
        <div className="flex justify-center mb-6">
          <GlassBadge variant="gradient">THE TEAM</GlassBadge>
        </div>
        <h2 className="heading-center">
          Meet The Crew On Board
        </h2>
      </div>

      {/* Team Grid */}
      <motion.div
        className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4 max-md:gap-4 relative"
        initial="hidden"
        variants={containerVariants}
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {teamMembers.map((member, index) => (
          <Tooltip
            key={index}
            isOpen={hoveredIndex === index}
            showArrow
            classNames={{
              base: [
                // Arrow styling - glass effect for arrow
                "before:bg-white/70",
                "before:backdrop-blur-md",
                "before:shadow-sm",
                "before:z-50",
              ],
              content: [
                // Remove default NextUI background
                "p-0",
                "bg-transparent",
                "shadow-none",
                "backdrop-blur-none",
              ],
            }}
            closeDelay={100}
            content={
              <div
                className="w-[200px] p-4 rounded-xl border border-white/50 relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(252, 252, 253, 0.94) 100%)",
                  WebkitBackdropFilter:
                    "blur(20px) saturate(180%) brightness(105%)",
                  backdropFilter:
                    "blur(20px) saturate(180%) brightness(105%)",
                  boxShadow:
                    "0 8px 32px -4px rgba(0, 0, 0, 0.12), 0 20px 60px -12px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 1), inset 0 -1px 0 rgba(255, 255, 255, 0.7)",
                }}
              >
                {/* Frosted glass texture overlay */}
                <div
                  className="absolute inset-0 pointer-events-none z-0"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.6) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(245, 248, 255, 0.3) 0%, transparent 50%)",
                    mixBlendMode: "soft-light",
                  }}
                />
                {/* Content wrapper with relative positioning */}
                <div className="relative z-10 text-center">
                  {/* Quote */}
                  <p className="text-sm italic text-black mb-1 leading-relaxed font-semibold">
                    &quot;{member.quote}&quot;
                  </p>

                  {/* Name and Title */}
                  <div className="">
                    {/* <p className="text-xs font-bold text-black">
                      {member.name}
                    </p> */}
                    <p className="text-[10px] text-gray-800 font-semibold opacity-70">
                      {member.role}
                    </p>
                  </div>
                </div>
              </div>
            }
            delay={200}
            disableAnimation={false}
            motionProps={{
              variants: {
                exit: {
                  opacity: 0,
                  y: -8,
                  scale: 0.96,
                  transition: {
                    duration: 0.15,
                    ease: "easeIn",
                  },
                },
                enter: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                    mass: 0.8,
                  },
                },
              },
            }}
            offset={12}
            placement="top"
          >
            <motion.div 
              variants={cardVariants}
              className={`group cursor-pointer relative ${hoveredIndex === index ? 'z-[100]' : 'z-10'}`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => setHoveredIndex(hoveredIndex === index ? null : index)}
            >
              <motion.div
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
              >
                <Card className="rounded-[32px] max-md:rounded-[24px] overflow-hidden border-none shadow-lg transition-shadow duration-300 group-hover:shadow-2xl">
                  <CardBody className="p-0">
                    <div className={`relative w-full aspect-[4/3] ${member.bgColor} flex items-center justify-center overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                      
                      {/* Hover Glow */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0">
                        <div
                          className="w-full h-full"
                          style={{
                            background: "radial-gradient(circle at center, rgba(255,255,255,0.4) 0%, transparent 70%)",
                          }}
                        />
                      </div>

                      <img
                        src={member.image}
                        alt={member.name}
                        className="relative z-10 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            </motion.div>
          </Tooltip>
        ))}
      </motion.div>
    </div>
  );
};

export default TheTeam;
