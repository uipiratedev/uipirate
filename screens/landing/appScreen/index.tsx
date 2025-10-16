import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const LandingAppScreen = () => {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".appTrigger", // element to start the animation
        start: "top 50%", // when the top of the trigger hits the center of the viewport
        end: "bottom 50%", // end when the bottom of the trigger hits the top of the viewport
        scrub: 1, // smooth animation on scroll
      },
    });

    // Left image rotates and moves from left
    tl.to("#left", { rotate: 0, x: 0, duration: 1, ease: "power2.out" })
      // Right image rotates and moves from right
      .to("#right", { rotate: 0, x: 0, duration: 1, ease: "power2.out" }, "<")
      // Center image moves up
      .to("#center", { paddingTop: 0, duration: 1 }, "<");

    // Initial position off-screen
    gsap.set("#left", { x: "0vw" });
    gsap.set("#right", { x: "0vw" });
  }, []);

  return (
    <>
      <div className="flex flex-row items-center justify-center gap-8 mt-20 appTrigger container mx-auto max-md:gap-4">
        <img
          src="https://res.cloudinary.com/damm9iwho/image/upload/v1729768861/Frame_1984078758_tkh9ag.svg"
          alt="app"
          id="left"
          className="rotate-[-6deg] max-md:w-[40%]"
        />
        <img
          src="https://res.cloudinary.com/damm9iwho/image/upload/v1731054843/middleImage_ggzymj.svg"
          alt="app"
          id="center"
          className="pt-40 max-lg:hidden"
        />
        <img
          src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1753847870/Ai_APp_mockup_y0mt4j.svg"
          alt="app"
          id="right"
          className="rotate-[6deg] max-md:w-[40%] "
        />
      </div>
    </>
  );
};

export default LandingAppScreen;
