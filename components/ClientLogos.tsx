"use client";

import React from "react";
import { motion, Variants } from "framer-motion";

import { CLIENT_LOGOS, ClientLogo } from "@/data/clientLogos";

export const logoContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

export const logoItemVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.33, 1, 0.68, 1],
    },
  },
};

export interface ClientLogoCardProps {
  logo: ClientLogo;
  index?: number;
  className?: string;
}

export const ClientLogoCard: React.FC<ClientLogoCardProps> = ({
  logo,
  className = "",
}) => {
  const cardStyle: React.CSSProperties = {
    background:
      "linear-gradient(142deg, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0.65) 50%, rgba(255, 255, 255, 0.55) 100%)",
    backdropFilter: "blur(32px) saturate(120%) brightness(100%)",
    WebkitBackdropFilter: "blur(32px) saturate(120%) brightness(100%)",
    border: "2px solid rgba(255, 255, 255, 0.12)",
    boxShadow:
      "0 4px 16px 0 rgba(31, 38, 135, 0.08), inset 1px 1px 2px 0 rgba(255, 255, 255, 0.3), inset -1px -1px 1px 0 rgba(255, 255, 255, 0.05)",
  };

  const content = (
    <>
      <img
        alt={logo.alt || `${logo.name} logo`}
        className="h-[32px] max-h-[32px] max-md:h-[24px] max-md:max-h-[24px] w-auto object-contain relative z-10"
        loading="lazy"
        src={logo.logo}
        style={
          logo.invertColor
            ? {
                filter:
                  "invert(1) sepia(1) saturate(5) hue-rotate(180deg) brightness(0.7)",
              }
            : undefined
        }
      />

      {logo.desc && (
        <span className="mt-3 text-[11px] text-gray-500 font-medium relative z-10 text-center uppercase tracking-wide leading-tight">
          {logo.desc}
        </span>
      )}

      {logo.isUS && (
        <span className="mt-1 text-[10px] text-brand-orange font-bold relative z-10">
          🇺🇸 US
        </span>
      )}
    </>
  );

  const sharedClasses = `logo-item flex flex-col items-center justify-center w-full h-full min-h-[110px] p-6 max-md:p-4 rounded-[10px] relative overflow-hidden ${
    logo.link ? "cursor-pointer" : "cursor-default"
  } ${className}`;

  if (logo.link) {
    return (
      <motion.a
        className={sharedClasses}
        href={logo.link}
        rel="noopener noreferrer"
        style={cardStyle}
        target="_blank"
        variants={logoItemVariants}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.div
      className={sharedClasses}
      style={cardStyle}
      variants={logoItemVariants}
    >
      {content}
    </motion.div>
  );
};

export interface ClientLogosGridProps {
  logos?: ClientLogo[];
  className?: string;
  gridClassName?: string;
  viewportAmount?: number;
}

export const ClientLogosGrid: React.FC<ClientLogosGridProps> = ({
  logos = CLIENT_LOGOS,
  className = "",
  gridClassName = "grid grid-cols-2 md:grid-cols-5 gap-4 items-center justify-items-center",
  viewportAmount = 0.3,
}) => {
  return (
    <div className={`w-full ${className}`}>
      <motion.div
        className={gridClassName}
        initial="hidden"
        variants={logoContainerVariants}
        viewport={{ once: true, amount: viewportAmount }}
        whileInView="visible"
      >
        {logos.map((logo, index) => (
          <ClientLogoCard key={logo.name || index} index={index} logo={logo} />
        ))}
      </motion.div>

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .logo-item,
          .logo-item img {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export interface ClientLogosProps extends ClientLogosGridProps {
  badge?: React.ReactNode;
  heading?: React.ReactNode;
  subheading?: React.ReactNode;
  containerClassName?: string;
  sectionClassName?: string;
  showBackgroundGrid?: boolean;
}

export const ClientLogos: React.FC<ClientLogosProps> = ({
  logos = CLIENT_LOGOS,
  badge,
  heading,
  subheading,
  className = "",
  gridClassName,
  containerClassName = "container mx-auto px-4 sm:px-6 lg:px-20 xl:px-32 flex flex-col items-center justify-center relative z-10",
  sectionClassName = "py-6 max-md:py-6 bg-white relative overflow-hidden",
  showBackgroundGrid = false,
  viewportAmount = 0.3,
}) => {
  return (
    <section className={sectionClassName}>
      {showBackgroundGrid && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0, 0, 0, 0.03) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 0, 0, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
            maskImage:
              "radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%)",
            opacity: 0.5,
          }}
        />
      )}

      <div className={containerClassName}>
        {(badge || heading || subheading) && (
          <div className="mb-6 max-md:mb-6 text-center max-w-4xl mx-auto px-8 max-md:px-0">
            {badge && <div className="flex justify-center mb-4">{badge}</div>}
            {heading &&
              (typeof heading === "string" ? (
                <h2 className="heading-center">{heading}</h2>
              ) : (
                heading
              ))}
            {subheading &&
              (typeof subheading === "string" ? (
                <p className="text-gray-500 mt-2">{subheading}</p>
              ) : (
                subheading
              ))}
          </div>
        )}

        <ClientLogosGrid
          className={className}
          gridClassName={gridClassName}
          logos={logos}
          viewportAmount={viewportAmount}
        />
      </div>
    </section>
  );
};

export default ClientLogos;
