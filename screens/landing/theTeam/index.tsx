import { Card, CardBody } from "@heroui/react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { useState } from "react";

import GlassBadge from "@/components/GlassBadge";

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
    <div className="py-24 max-md:py-16 container mx-auto px-6 md:px-12 lg:px-24 relative">
      {/* Header */}
      <div className="text-center mb-20 max-md:mb-12">
        <div className="flex justify-center mb-6">
          <GlassBadge variant="gradient">THE TEAM</GlassBadge>
        </div>
        <h2 className="heading-center">
          Meet The Crew On Board
        </h2>
      </div>

      {/* Team Grid */}
      <motion.div
        className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4 max-md:gap-4 relative pt-12"
        initial="hidden"
        variants={containerVariants}
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {teamMembers.map((member, index) => (
          <motion.div 
            key={index} 
            variants={cardVariants}
            className={`group cursor-pointer relative ${hoveredIndex === index ? 'z-[100]' : 'z-10'}`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Desktop Tooltip (Appears just above the hovered card) */}
            <AnimatePresence>
              {hoveredIndex === index && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.8, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: 20, scale: 0.8, filter: "blur(10px)" }}
                  transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  className="hidden lg:block absolute -top-[150px] w-[280px] z-[101] pointer-events-none"
                >
                  <div className="relative p-6 rounded-[32px] border border-white/30 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.3)] backdrop-blur-2xl bg-white/90 text-center overflow-hidden">
                    {/* Gradient overlay matching team member's color */}
                    <div 
                      className="absolute inset-0 opacity-15 pointer-events-none rounded-[32px]"
                      style={{
                        background: member.bgColor.includes('purple') ? 'radial-gradient(circle at bottom, rgba(168, 85, 247, 0.5) 0%, transparent 70%)' :
                                   member.bgColor.includes('green') ? 'radial-gradient(circle at bottom, rgba(74, 222, 128, 0.5) 0%, transparent 70%)' :
                                   member.bgColor.includes('blue') ? 'radial-gradient(circle at bottom, rgba(96, 165, 250, 0.5) 0%, transparent 70%)' :
                                   member.bgColor.includes('yellow') ? 'radial-gradient(circle at bottom, rgba(250, 204, 21, 0.5) 0%, transparent 70%)' :
                                   member.bgColor.includes('pink') ? 'radial-gradient(circle at bottom, rgba(244, 114, 182, 0.5) 0%, transparent 70%)' :
                                   member.bgColor.includes('orange') ? 'radial-gradient(circle at bottom, rgba(251, 146, 60, 0.5) 0%, transparent 70%)' :
                                   member.bgColor.includes('red') ? 'radial-gradient(circle at bottom, rgba(239, 68, 68, 0.5) 0%, transparent 70%)' :
                                   member.bgColor.includes('lime') ? 'radial-gradient(circle at bottom, rgba(163, 230, 53, 0.5) 0%, transparent 70%)' :
                                   member.bgColor.includes('cyan') ? 'radial-gradient(circle at bottom, rgba(34, 211, 238, 0.5) 0%, transparent 70%)' :
                                   'radial-gradient(circle at bottom, rgba(168, 85, 247, 0.5) 0%, transparent 70%)'
                      }}
                    />
                    
                    {/* Subtle shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent pointer-events-none rounded-[32px]" />
                    
                    <p className="relative text-gray-800 text-[15px] font-medium leading-relaxed">
                      Hey hey! I'm <span className="font-bold text-gray-900">{member.name}</span>,<br />
                      I'm your <span className="font-bold text-gray-900">{member.role.toLowerCase()}</span>.
                    </p>
                  </div>

                  {/* Speech bubble tail with rotated circles */}
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-8">
                    {/* First larger circle - positioned left and slightly rotated */}
                    <div 
                      className="absolute top-0 left-2 w-6 h-6 rounded-full bg-white/85 backdrop-blur-xl border border-white/40 shadow-lg"
                      style={{ transform: 'rotate(-15deg)' }}
                    />
                    {/* Second smaller circle - positioned right and rotated opposite */}
                    <div 
                      className="absolute top-4 right-3 w-3 h-3 rounded-full bg-white/75 backdrop-blur-xl border border-white/40 shadow-lg"
                      style={{ transform: 'rotate(15deg)' }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mobile/Tablet Tooltip */}
            <AnimatePresence>
              {hoveredIndex === index && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="lg:hidden absolute -top-28 left-1/2 -translate-x-1/2 w-64 z-50 pointer-events-none"
                >
                  <div className="relative bg-white/90 backdrop-blur-2xl p-4 rounded-[24px] shadow-xl border border-white/30 text-center overflow-hidden">
                    {/* Gradient overlay matching team member's color */}
                    <div 
                      className="absolute inset-0 opacity-15 pointer-events-none rounded-[24px]"
                      style={{
                        background: member.bgColor.includes('purple') ? 'radial-gradient(circle at bottom, rgba(168, 85, 247, 0.5) 0%, transparent 70%)' :
                                   member.bgColor.includes('green') ? 'radial-gradient(circle at bottom, rgba(74, 222, 128, 0.5) 0%, transparent 70%)' :
                                   member.bgColor.includes('blue') ? 'radial-gradient(circle at bottom, rgba(96, 165, 250, 0.5) 0%, transparent 70%)' :
                                   member.bgColor.includes('yellow') ? 'radial-gradient(circle at bottom, rgba(250, 204, 21, 0.5) 0%, transparent 70%)' :
                                   member.bgColor.includes('pink') ? 'radial-gradient(circle at bottom, rgba(244, 114, 182, 0.5) 0%, transparent 70%)' :
                                   member.bgColor.includes('orange') ? 'radial-gradient(circle at bottom, rgba(251, 146, 60, 0.5) 0%, transparent 70%)' :
                                   member.bgColor.includes('red') ? 'radial-gradient(circle at bottom, rgba(239, 68, 68, 0.5) 0%, transparent 70%)' :
                                   member.bgColor.includes('lime') ? 'radial-gradient(circle at bottom, rgba(163, 230, 53, 0.5) 0%, transparent 70%)' :
                                   member.bgColor.includes('cyan') ? 'radial-gradient(circle at bottom, rgba(34, 211, 238, 0.5) 0%, transparent 70%)' :
                                   'radial-gradient(circle at bottom, rgba(168, 85, 247, 0.5) 0%, transparent 70%)'
                      }}
                    />
                    
                    {/* Subtle shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent pointer-events-none rounded-[24px]" />
                    
                    <p className="relative text-gray-800 text-sm font-medium leading-relaxed">
                      Hey hey! I'm <span className="font-bold text-gray-900">{member.name}</span>,<br />
                      I'm your <span className="font-bold text-gray-900">{member.role.toLowerCase()}</span>.
                    </p>
                    
                    {/* Speech bubble tail */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/85 backdrop-blur-xl rotate-45 border-r border-b border-white/30" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

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
        ))}
      </motion.div>
    </div>
  );
};

export default TheTeam;
