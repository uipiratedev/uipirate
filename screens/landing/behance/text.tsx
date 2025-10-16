import { Button } from "@nextui-org/button";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const data = [
  {
    heading: "heading 1",
    subtitle: "subtitle 1",
    img: "https://res.cloudinary.com/damm9iwho/image/upload/v1730025336/xperiti_ptjxaa.svg",
  },
  {
    heading: "heading 2",
    subtitle: "subtitle 2",
    img: "https://res.cloudinary.com/damm9iwho/image/upload/v1730025188/frytx_mo0frx.svg",
  },
  {
    heading: "heading 3",
    subtitle: "subtitle 3",
    img: "https://res.cloudinary.com/damm9iwho/image/upload/v1730025189/brahma_zbxs7g.svg",
  },
  {
    heading: "heading 3",
    subtitle: "subtitle 3",
    img: "https://res.cloudinary.com/damm9iwho/image/upload/v1730025336/olso_rgvl9a.svg",
  },
  {
    heading: "heading 3",
    subtitle: "subtitle 3",
    img: "https://res.cloudinary.com/damm9iwho/image/upload/v1730025333/rings_gnmm1x.svg",
  },
  {
    heading: "heading 2",
    subtitle: "subtitle 2",
    img: "https://res.cloudinary.com/damm9iwho/image/upload/v1730025332/ion_hhwrup.svg",
  },
];

const LandingBehanceDan = () => {
  const runAnimation = () => {
    const images = gsap.utils.toArray("#img") as HTMLElement[]; // Explicitly cast to HTMLElement[]
    const isMobile = window.innerWidth <= 7680; // Detect mobile view

    const animateRow = (
      startIndex: number,
      endIndex: number,
      xMove: string[],
      yMove: string[],
      rotateDeg: number[]
    ) => {
      gsap.to(images.slice(startIndex, endIndex), {
        x: (i) => xMove[i % 2],
        y: (i) => yMove[i % 2],
        rotate: isMobile ? 0 : (i) => rotateDeg[i % 2], // No rotation in mobile view
        scrollTrigger: {
          trigger: images[startIndex], // Ensure the trigger is correctly typed as HTMLElement
          start: "top 70%",
          end: "bottom 0%",
          scrub: 1.5,
        },
      });
    };

    const xMoveMobile = ["-90%", "90%"]; // Move left and right 90% in mobile view
    const yMoveMobile = ["-20%", "-20%"]; // No vertical movement in mobile view

    const xMoveDesktop = ["-40%", "40%"];
    const yMoveDesktop = ["50%", "50%"];

    // Use mobile or desktop movement based on the viewport
    const xMove = isMobile ? xMoveMobile : xMoveDesktop;
    const yMove = isMobile ? yMoveMobile : yMoveDesktop;

    // Animate rows
    animateRow(0, 2, xMove, yMove, [-45, 45]);
    animateRow(2, 4, xMove, yMove, [-45, 45]);
    animateRow(4, 6, xMove, yMove, [-45, 45]);
  };

  useEffect(() => {
    // Initial animation run
    runAnimation();

    // Update animation on window resize
    const handleResize = () => {
      ScrollTrigger.refresh(); // Refresh ScrollTrigger on resize
      runAnimation();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="relative">
      {/* Centered Info */}
      <div
        id="info"
        className="absolute inset-0 flex flex-col items-center justify-center text-center"
      >
        <img
          src="https://res.cloudinary.com/damm9iwho/image/upload/v1729514725/behance_k2zcrn.svg"
          alt="behance Logo"
          className="max-md:w-[60%]"
        />
        <p className="text-center text-lg px-24 max-md:px-4 max-lg:px-12 mb-12 mt-6 w-1/2 max-md:text-lg">
          Explore our diverse portfolio of projects that highlight our
          creativity and craftsmanship.
        </p>
        <Button
          color="primary"
          className=" bg-black button text-lg dark:bg-white dark:text-black"
          style={{
            paddingRight: "70px",
            paddingLeft: "70px",
            paddingTop: "30px",
            paddingBottom: "30px",
          }}
        >
          View Behance
        </Button>
      </div>

      {/* Image Grid with Overlap */}
      <div className="relative grid grid-cols-2 gap-12 max-md:gap-4 overflow-x-hidden overflow-y-auto py-40 max-md:py-32 max-lg:py-40 max-md:grid-cols-1 hide-scrollbar px-32 max-md:px-4">
        {data.map((item, index) => {
          return (
            <div key={index} className="relative w-full h-full">
              <img
                src={item.img}
                alt={item.heading}
                className=" w-full h-full object-fill rounded-3xl grayscale-[25%]"
                id="img"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LandingBehanceDan;
