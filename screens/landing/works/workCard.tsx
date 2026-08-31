"use client";

import { motion } from "framer-motion";

import { useIsMobile } from "@/hooks";
import LetsTalkButton from "@/components/LetsTalkButton";

const data = [
  {
    heading: "Xperiti",
    heading1: "Comprehensive Research Platform",
    subtitle:
      "Enterprise Saas App UI/UX Design on Figma & Development on Angular.js",
    img: "https://res.cloudinary.com/damm9iwho/image/upload/v1731155233/xperiti_psd_file_1_cvfkqh.svg",
    url: "https://www.xperiti.com/",
  },

  {
    heading: "ArthAlpha",
    heading1: "AI Trading Platform",
    subtitle: "Quant Trading App, Portfolio Website, UX Design, UI Development",
    img: "https://res.cloudinary.com/damm9iwho/image/upload/v1730025189/brahma_zbxs7g.svg",
    url: "https://arthalpha.in/",
  },
  {
    heading: "AI LegalTech Saas",
    heading1: "APAC’s largest law firm",
    subtitle:
      "Designed a future-ready AI SaaS platform for lawyers and legal professionals ",
    img: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1771570379/Image_hzwg0d.svg",
    url: "https://www.xperiti.com/",
  },
  // {
  //   heading: "Rings & I",
  //   heading1: "Diamond Ring Studio",
  //   subtitle: "Shopify Store, UX Design , Shopify Theme, Asset Creation",
  //   img: "https://res.cloudinary.com/damm9iwho/image/upload/v1730025333/rings_gnmm1x.svg",
  //   url: "https://ringsandi.com/",
  // },
];

interface WorkCardItemProps {
  item: (typeof data)[0];
  index: number;
}

// Reveal transitions once, triggered by IntersectionObserver (Framer Motion's
// `whileInView`) instead of continuously tracking scroll position. The
// previous version created two redundant `useScroll` listeners per card,
// each feeding an 800-stiffness spring, over an artificially tiny 2%
// scroll window — that's what made the reveal feel like it took forever
// (it only fired inside a razor-thin trigger band) and jittery (two
// independent scroll trackers plus stiff springs reacting to every frame).
const revealTransition = { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } as const;
const viewport = { once: true, margin: "-10% 0px -10% 0px" } as const;

const WorkCardItem = ({ item, index }: WorkCardItemProps) => {
  const isEven = index % 2 === 0;
  const isMobile = useIsMobile();

  const imageStartX = isEven
    ? isMobile
      ? "-10%"
      : "-25%"
    : isMobile
      ? "10%"
      : "25%";
  const imageStartRotate = isEven ? (isMobile ? -5 : -12) : isMobile ? 5 : 12;
  const contentStartY = isMobile ? 20 : 60;

  return (
    <div
      className={
        isEven
          ? "flex flex-row-reverse justify-between mb-0 max-md:mb-6 max-w-full max-md:flex-col-reverse"
          : "flex flex-row justify-between mb-0 max-md:mb-6 max-w-full max-md:flex-col-reverse py-32 max-md:py-0 max-lg:py-16 max-xl:py-28"
      }
    >
      <motion.div
        className={
          isEven
            ? "flex flex-row items-start md:justify-end w-[40%] text-end max-md:text-center max-md:w-[100%] max-md:px-0 max-md:justify-center"
            : "flex flex-row items-start justify-start w-[40%] max-md:text-center max-md:w-[100%] max-md:px-4"
        }
        initial={{ y: contentStartY }}
        transition={revealTransition}
        viewport={viewport}
        whileInView={{ y: 0 }}
      >
        <div>
          <h3 className="text-[2rem] max-md:text-xl mb-2 max-md:mb-1 font-[600] max-xl:text-[3.5rem] max-md:mt-6">
            {item.heading}
          </h3>
          <p className="text-[1rem] max-md:text-sm mb-3 max-md:mb-2 font-[600] max-xl:text-[1rem] text-gray-700">
            {item.heading1}
          </p>
          <div className={isEven ? "flex flex-row items-end justify-end" : ""}>
            <p
              className={
                isEven
                  ? "text-base font-[400] max-w-[300px] max-md:text-sm text-gray-500 leading-relaxed"
                  : "text-base font-[400] max-w-[400px] max-md:text-sm text-gray-500 leading-relaxed"
              }
            >
              {item.subtitle}
            </p>
          </div>
          <div
            className={`mt-8 max-md:mt-5 flex ${isEven ? "justify-end" : "justify-start"} max-md:justify-center`}
          >
            <LetsTalkButton
              children="View Project"
              href={item.url}
              target="_blank"
              variant="light"
            />
          </div>
        </div>
      </motion.div>
      <div className="w-[60%] max-w-full max-md:w-[100%]">
        <motion.img
          alt={`${item.heading} - ${item.heading1} UI/UX design project showcase`}
          className="w-full rounded-3xl max-md:rounded-2xl md:-mt-12 max-md:mt-4"
          initial={{ x: imageStartX, rotate: imageStartRotate }}
          loading="lazy"
          src={item.img}
          transition={revealTransition}
          viewport={viewport}
          whileInView={{ x: "0%", rotate: 0 }}
        />
      </div>
    </div>
  );
};

const RecentWorkCard = () => {
  return (
    <div className="">
      {data.map((item, index) => (
        <WorkCardItem key={index} index={index} item={item} />
      ))}
    </div>
  );
};

export default RecentWorkCard;
