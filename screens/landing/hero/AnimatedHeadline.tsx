"use client";

const AnimatedHeadline = () => {
  // Split headline into words with specific animations
  const words = [
    { text: "Designing", delay: 0.05, className: "hero-word" },
    { text: "AI-Driven", delay: 0.1, className: "hero-word" },
    { text: "SaaS", delay: 0.15, className: "hero-word" },
    { text: "Products", delay: 0.2, className: "hero-word", newLine: true },
    { text: "That", delay: 0.25, className: "hero-word" },
  ];

  const highlightWords = [
    {
      text: "Convert,",
      delay: 0.3,
      className: "hero-word-convert max-md:mt-1 md:mt-4",
    },
    { text: "Scale", delay: 0.4, className: "hero-word-scale" },
    { text: "&", delay: 0.5, className: "hero-word" },
    { text: "Ship", delay: 0.6, className: "hero-word-orange" },
    { text: "Faster", delay: 0.7, className: "hero-word-orange" },
  ];

  return (
    <h1 className="text-[68px] 3xl:text-[80px] xl:text-[74px] px-4 text-center font-[700] max-md:font-[600] max-lg:text-5xl max-md:text-[40px] max-md:leading-[1.08] max-md:px-1 tracking-[-1.5px] leading-[1.1] relative">
      {words.map((word, index) => (
        <span key={index} className="">
          {word.newLine && <br className="max-md:block hidden" />}
          <span
            className={word.className}
            style={{
              animationDelay: `${word.delay}s`,
            }}
          >
            {word.text}
          </span>{" "}
        </span>
      ))}
      <br />
      <span className="text-brand-orange ">
        {highlightWords.map((word, index) => (
          <span key={index}>
            {index === 1 && <br className="max-md:block hidden" />}
            {index === 2 && <br className="max-md:block hidden" />}
            <span
              className={word.className}
              style={{
                animationDelay: `${word.delay}s`,
              }}
            >
              {word.text}
            </span>
            {index < highlightWords.length - 1 && " "}
          </span>
        ))}
      </span>
    </h1>
  );
};

export default AnimatedHeadline;
