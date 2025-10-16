// import { Button } from "@nextui-org/button";
// import { useEffect } from "react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// // Register ScrollTrigger plugin
// gsap.registerPlugin(ScrollTrigger);

// const data = [
//   {
//     heading: "heading 1",
//     subtitle: "subtitle 1",
//     img: "https://res.cloudinary.com/damm9iwho/image/upload/v1725008166/MacBook_Pro_16__-_12_cimflk.svg",
//   },
//   {
//     heading: "heading 2",
//     subtitle: "subtitle 2",
//     img: "https://res.cloudinary.com/damm9iwho/image/upload/v1728035006/MacBook_Pro_16__-_24_lcrpht.svg",
//   },
//   {
//     heading: "heading 3",
//     subtitle: "subtitle 3",
//     img: "https://res.cloudinary.com/damm9iwho/image/upload/v1725007626/MacBook_Pro_16__-_23_2x_zxfdux.svg",
//   },
//   {
//     heading: "heading 3",
//     subtitle: "subtitle 3",
//     img: "https://res.cloudinary.com/damm9iwho/image/upload/v1725008637/MacBook_Pro_16__-_13_hzbgw4.svg",
//   },
//   {
//     heading: "heading 3",
//     subtitle: "subtitle 3",
//     img: "https://res.cloudinary.com/damm9iwho/image/upload/v1729515639/simpleo_oxnxxn.svg",
//   },
//   {
//     heading: "heading 2",
//     subtitle: "subtitle 2",
//     img: "https://res.cloudinary.com/damm9iwho/image/upload/v1729515789/olso_wqnbak.svg",
//   },
// ];

// const LandingBehance = () => {
//   useEffect(() => {
//     // Rotate and move images on scroll
//     gsap.utils.toArray("#img").forEach((img: any, index: number) => {
//       // Determine which row the image is in (each row has 2 images)
//       const rowIndex = Math.floor(index / 2);
//       let xMove: any = 0;
//       let yMove: any = 0;

//       // Set horizontal movement based on row
//       if (rowIndex === 0) {
//         xMove = index % 2 === 0 ? "-40%" : "40%"; // First row moves 40%
//         yMove = index % 2 === 0 ? "50%" : "50%"; // First row moves 40%
//       } else if (rowIndex === 1) {
//         xMove = index % 2 === 0 ? "-60%" : "60%"; // Second row moves 30%
//         yMove = index % 2 === 0 ? "50%" : "50%"; // First row moves 40%
//       } else if (rowIndex === 2) {
//         xMove = index % 2 === 0 ? "-30%" : "30%"; // Third row moves 20%
//         // yMove = index % 2 === 0 ? "-50%" : "-50%"; // First row moves 40%
//       }

//       const rotateDeg = index % 2 === 0 ? -45 : 45; // Left for even, right for odd

//       gsap.to(img, {
//         rotate: rotateDeg, // Rotate 45deg left or right
//         x: xMove,
//         y: yMove, // Move left or right
//         scrollTrigger: {
//           trigger: img,
//           start: "top center", // Start animation when the image enters the viewport
//           end: "bottom 10%", // End animation when it's fully in the viewport
//           scrub: true, // Smooth animation while scrolling
//         },
//       });
//     });
//   }, []);

//   return (
//     <div className="relative">
//       {/* Centered Info */}
//       <div
//         id="info"
//         className="absolute inset-0 flex flex-col items-center justify-center text-center"
//       >
//         <img
//           src="https://res.cloudinary.com/damm9iwho/image/upload/v1729514725/behance_k2zcrn.svg"
//           alt="behance Logo"
//           className="max-md:w-[60%]"
//         />
//         <p className="text-center text-2xl px-12 max-md:px-4 max-lg:px-12 mb-12 mt-6 w-1/2 max-md:text-xl">
//           Explore our diverse portfolio of projects that highlight our
//           creativity and craftsmanship.
//         </p>
//         <Button
//           color="primary"
//           className=" bg-black button text-lg dark:bg-white dark:text-black"
//           style={{
//             paddingRight: "70px",
//             paddingLeft: "70px",
//             paddingTop: "30px",
//             paddingBottom: "30px",
//           }}
//         >
//           Bordered
//         </Button>
//       </div>

//       {/* Image Grid with Overlap */}
//       <div className="relative grid grid-cols-2 gap-6 overflow-x-hidden overflow-y-auto py-52 max-md:py-32 max-lg:py-40 max-md:grid-cols-1">
//         {data.map((item, index) => {
//           return (
//             <div
//               key={index}
//               className="relative w-full h-full"
//               // style={{
//               //   zIndex: data.length - index, // Higher z-index for higher images
//               //   transform: `translateY(-${index * 10}%)`, // Stack images with 10% overlap
//               // }}
//             >
//               <img
//                 src={item.img}
//                 alt={item.heading}
//                 className=" w-full h-full object-fill rounded-3xl grayscale-[25%]"
//                 id="img"
//               />
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default LandingBehance;

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
    img: "https://res.cloudinary.com/damm9iwho/image/upload/v1725008166/MacBook_Pro_16__-_12_cimflk.svg",
  },
  {
    heading: "heading 2",
    subtitle: "subtitle 2",
    img: "https://res.cloudinary.com/damm9iwho/image/upload/v1728035006/MacBook_Pro_16__-_24_lcrpht.svg",
  },
  {
    heading: "heading 3",
    subtitle: "subtitle 3",
    img: "https://res.cloudinary.com/damm9iwho/image/upload/v1725007626/MacBook_Pro_16__-_23_2x_zxfdux.svg",
  },
  {
    heading: "heading 3",
    subtitle: "subtitle 3",
    img: "https://res.cloudinary.com/damm9iwho/image/upload/v1725008637/MacBook_Pro_16__-_13_hzbgw4.svg",
  },
  {
    heading: "heading 3",
    subtitle: "subtitle 3",
    img: "https://res.cloudinary.com/damm9iwho/image/upload/v1729515639/simpleo_oxnxxn.svg",
  },
  {
    heading: "heading 2",
    subtitle: "subtitle 2",
    img: "https://res.cloudinary.com/damm9iwho/image/upload/v1729515789/olso_wqnbak.svg",
  },
];

const LandingBehance = () => {
  const runAnimation = () => {
    const images = gsap.utils.toArray("#img") as HTMLElement[]; // Explicitly cast to HTMLElement[]
    const isMobile = window.innerWidth <= 768; // Detect mobile view

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
          start: "top 99%",
          end: "bottom 10%",
          scrub: true,
        },
      });
    };

    const xMoveMobile = ["-90%", "90%"]; // Move left and right 90% in mobile view
    const yMoveMobile = ["0%", "0%"]; // No vertical movement in mobile view

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
        <p className="text-center text-2xl px-12 max-md:px-4 max-lg:px-12 mb-12 mt-6 w-1/2 max-md:text-xl">
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
          Bordered
        </Button>
      </div>

      {/* Image Grid with Overlap */}
      <div className="relative grid grid-cols-2 gap-6 overflow-x-hidden overflow-y-auto py-52 max-md:py-32 max-lg:py-40 max-md:grid-cols-1 hide-scrollbar">
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

export default LandingBehance;
