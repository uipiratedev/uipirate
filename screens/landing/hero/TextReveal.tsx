import { useEffect, useRef } from "react";
import gsap from "gsap";

const TextReveal = () => {
  // Specify the type of headingRef as an HTML heading element (HTMLHeadingElement)
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Check if the ref has been assigned
    if (headingRef.current) {
      // Manually split the text into lines
      const text = headingRef.current.innerHTML;
      const words = text.split(" ");
      headingRef.current.innerHTML = words
        .map((word) => `<span class="split-child">${word}</span>`)
        .join(" ");

      gsap.from(".split-child", {
        duration: 1.5,
        yPercent: 100,
        ease: "power4",
        stagger: 0.1,
      });
    }
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-black text-white">
      <div className="text-heading">
        <h1
          ref={headingRef}
          className="text-[100px] font-light uppercase overflow-hidden"
        >
          Lorem Ipsum is dummy text Lorem Ipsum is dummy text
        </h1>
      </div>
    </div>
  );
};

export default TextReveal;
