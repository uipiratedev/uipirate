"use client";

import { motion } from "framer-motion";

import { usePageRevealed } from "@/components/PageLoader";

// Word reveal animation variant
const wordRevealVariant = {
  hidden: { opacity: 0, y: 15 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay,
      ease: "easeOut",
    },
  }),
};

const AnimatedHeadline = () => {
  // Content mounts immediately (SEO) but stays hidden behind the loading
  // overlay for ~1.5s — animate in only once the overlay has actually
  // faded, so the word reveal is visible instead of finishing off-screen.
  const revealed = usePageRevealed();

  // Split headline into words with specific animations
  const words = [
    { text: "A", delay: 0.05 },
    { text: "Design", delay: 0.1 },
    { text: "&", delay: 0.15 },
    { text: "Development", delay: 0.2 },
    { text: "Agency", delay: 0.25, newLine: true },
    { text: "for", delay: 0.3 },

  ];

  const highlightWords = [
    { text: "SaaS", delay: 0.35, extraClass: "max-md:mt-1 md:mt-4" },
    { text: "Teams", delay: 0.4, newLine: true },
    { text: "That", delay: 0.45, },
    { text: "Need", delay: 0.5 },
    { text: "to", delay: 0.55 },
    { text: "Ship", delay: 0.6, isOrange: true },
  ];

  return (
    <h1 className="text-[40px] 3xl:text-[80px] 2xl:text-[74px] xl:text-[61px] lg:text-[48px] px-4 text-center font-[700] max-md:font-[600]  max-md:leading-[1.08] max-md:px-1 tracking-[-1.5px] leading-[1.1] relative">
      {words.map((word, index) => (
        <span key={index}>
          {word.newLine && <br className="max-md:block hidden" />}
          <motion.span
            animate={revealed ? "visible" : "hidden"}
            className="inline-block"
            custom={word.delay}
            initial="hidden"
            variants={wordRevealVariant}
          >
            {word.text}
          </motion.span>{" "}
        </span>
      ))}
      <br />
      <span className="text-brand-orange">
        {highlightWords.map((word, index) => (
          <span key={index}>
            {index === 1 && <br className="max-md:block hidden" />}
            {index === 2 && <br className="max-md:block hidden" />}
            <motion.span
              animate={revealed ? "visible" : "hidden"}
              className={`inline-block ${word.extraClass || ""} ${(word as any).isOrange
                ? "py-1 px-2 rounded bg-gradient-to-r from-orange-400/30 to-orange-400/30 bg-[length:100%_100%]"
                : ""
                }`}
              custom={word.delay}
              initial="hidden"
              variants={wordRevealVariant}
            >
              {word.text}
            </motion.span>
            {index < highlightWords.length - 1 && " "}
          </span>
        ))}
      </span>
    </h1>
  );
};

export default AnimatedHeadline;
