import { useEffect, useLayoutEffect, useRef } from "react";
import { Card, CardBody, CardHeader, Chip } from "@nextui-org/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import data from "@/data/servicesTopList.json";

gsap.registerPlugin(ScrollTrigger);

const data1 = [
  {
    heading: "3D Animation & Rendering",
    description: "Create immersive visuals that stand out.",
    chip: [
      {
        icon: "https://res.cloudinary.com/damm9iwho/image/upload/v1730799889/CalendarDots_bqwpcd.svg",
        title: "1–4 weeks",
      },
      {
        icon: "https://res.cloudinary.com/damm9iwho/image/upload/v1730801507/DeviceMobile_rfsexm.svg",
        title: "3D rendering",
      },
      {
        icon: "https://res.cloudinary.com/damm9iwho/image/upload/v1730799888/Code_qedbxu.svg",
        title: "3D motion graphics",
      },
      {
        icon: "https://res.cloudinary.com/damm9iwho/image/upload/v1730801507/ShoppingCart_pirfab.svg",
        title: "Modeling & Animation",
      },
      {
        icon: "https://res.cloudinary.com/damm9iwho/image/upload/v1730799888/Sparkle_qf0yru.svg",
        title: "Development-ready exports",
      },
    ],

    video: (
      <video
        // ref={(elvideo) => {
        //   if (elvideo) videoRefs.current[index] = elvideo;
        // }}
        width="70%"
        autoPlay
        loop
        muted
        className="object-cover h-[250px] w-full"
        src="https://res.cloudinary.com/damm9iwho/video/upload/v1730895565/3D_qasvie.mp4"
      ></video>
    ),
    isImage: false,
  },
  {
    heading: "UX Audits & Consultation",
    description: "Fix user friction before it becomes churn.",
    chip: [
      {
        icon: "https://res.cloudinary.com/damm9iwho/image/upload/v1730799889/CalendarDots_bqwpcd.svg",
        title: "Usability analysis",
      },
      {
        icon: "https://res.cloudinary.com/damm9iwho/image/upload/v1730801507/DeviceMobile_rfsexm.svg",
        title: "Heuristic Evaluation",
      },
      {
        icon: "https://res.cloudinary.com/damm9iwho/image/upload/v1730799888/Code_qedbxu.svg",
        title: "UX  Report",
      },
      {
        icon: "https://res.cloudinary.com/damm9iwho/image/upload/v1730801507/ShoppingCart_pirfab.svg",
        title: "Wireframe suggestions",
      },
      {
        icon: "https://res.cloudinary.com/damm9iwho/image/upload/v1730799888/Sparkle_qf0yru.svg",
        title: "Design improvement plan",
      },
    ],
    image: "/ux-audit.svg",
    video: (
      <video
        // ref={(elvideo) => {
        //   if (elvideo) videoRefs.current[index] = elvideo;
        // }}
        width="100%"
        autoPlay
        loop
        muted
        className="object-cover h-[250px] w-full"
        src="https://res.cloudinary.com/damm9iwho/video/upload/v1730895565/3D_qasvie.mp4"
      ></video>
    ),
    isImage: true,
  },
  // {
  //   heading: "Animated Motion Graphics",
  //   description:
  //     "Impactful animated motion graphics and Videos to enhance storytelling and design.",
  //   image:
  //     "https://res.cloudinary.com/damm9iwho/image/upload/v1730808989/view-3d-cinema-clapperboard_1_bcdsv5.svg",
  //   video: (
  //     <iframe
  //       src="https://my.spline.design/componentkeyboardcopy-418b298aa595a45922ac0f0895edd81d/"
  //       // frameBorder="0"
  //       width="100%"
  //       height="100%"
  //       className="h-[250px] w-full"
  //     ></iframe>
  //   ),
  //   isImage: false,
  // },
  // Add more data as needed...
];

const VideoWithCards = () => {
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const isMobile = window.innerWidth <= 768;

  useLayoutEffect(() => {
    // GSAP ScrollTrigger animation for cards

    // Clear any existing ScrollTriggers
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    cardsRef.current.forEach((card, index) => {
      if (card) {
        gsap.fromTo(
          card,
          {
            y: 100, // Start from below
            transform: isMobile ? "scale(1)" : "scale(0.80)",
          },
          {
            y: 0, // Move to original position
            transform: "scale(1)",
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: isMobile ? "" : "top 110%",
              end: isMobile ? "" : "bottom center",
              toggleActions: "play none none reverse",
              scrub: 1.5,
            },
          }
        );
      }
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Find the index of the observed element in videoRefs
          const index = videoRefs.current.findIndex(
            (video) => video === entry.target
          );

          if (index !== -1) {
            // Check if the index is valid
            const videoElement = videoRefs.current[index];
            if (videoElement) {
              // Ensure the video element is valid
              if (entry.isIntersecting) {
                console.log(`Video ${index + 1} started playing.`);
                videoElement.play();
                videoElement.playbackRate = 0.5; // Adjust speed when in view
              } else {
                console.log(`Video ${index + 1} paused.`);
                videoElement.pause();
                videoElement.playbackRate = 1; // Reset speed when out of view
              }
            }
          }
        });
      },
      { threshold: 0.5 } // Trigger when at least 10% of the video is in view
    );

    // Observing all video elements
    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video); // Ensure video is not null before observing
    });

    return () => {
      observer.disconnect(); // Cleanup observer on unmount
    };
  }, []);

  return (
    <div className="min-h-screen">
      {data.map((item, index) => (
        <div
          ref={(el) => {
            if (el && !isMobile) cardsRef.current[index] = el;
          }}
          key={index}
        >
          <Card className="rounded-[48px] max-md:rounded-[38px] md:mt-12 bg-[#e9e9e9]  max-md:mt-4 group shadow-none border-1 border-[#0000000f]">
            <CardBody className="grid grid-cols-2 gap-4 max-xl:grid-cols-1 p-4 max-md:p-2 max-md:gap-2">
              <Card className="rounded-[40px] max-md:rounded-[30px] box-shadow">
                <CardBody className="p-8 max-md:p-5 max-lg:p-6 flex flex-col justify-between">
                  <div>
                    <img
                      src={item.image}
                      alt="behance Logo"
                      className="w-[40px] grayscale "
                    />
                    <p className="text-3xl max-md:text-3xl mt-4 mb-4 font-[700] tracking-[-0.5px] leading-[41.6px]">
                      {item.heading}
                    </p>
                    <p className="text-lg max-md:text-base font-[500]">
                      {item.subheading}
                    </p>
                    <p className="text-base max-md:text-base font-[500] text-[#777777] py-2">
                      {item.description}
                    </p>
                    <p className="text-lg max-md:text-base font-[500]">
                      {item.subheading2}
                    </p>
                  </div>

                  <div className="mt-6 grid-rows-3 w-full gap-4 max-md:gap-x-3">
                    {item.chip.map((chipItem, chipIndex) => (
                      <Chip
                        key={chipIndex}
                        radius="sm"
                        className="md:m-2 mr-2 max-md:mb-2 text-[14px] text-[#00000094] bg-[#51525E14]"
                        startContent={
                          <img src={chipItem.icon} className="mx-1 w-[16px]" />
                        }
                      >
                        <p className="font-[600] max-md:font-[500]">
                          {chipItem.title}
                        </p>
                      </Chip>
                    ))}
                  </div>
                </CardBody>
              </Card>
              <Card className="rounded-[40px] p-0 h-[500px] max-md:h-[300px]">
                <CardBody style={{ padding: 0 }}>
                  {item.isImage && (
                    <img
                      src={item.sideImage}
                      alt="behance Logo"
                      className="object-cover h-[500px] min-md:h-[400px] max-h-full"
                    />
                  )}
                  {!item.isImage && (
                    <video
                      ref={(elvideo) => {
                        if (elvideo) videoRefs.current[index] = elvideo;
                      }}
                      width="100%"
                      // autoPlay
                      loop
                      muted
                      className="object-cover h-[500px] min-md:h-[400px] max-h-full"
                      src={item.video}
                    ></video>
                  )}
                </CardBody>
              </Card>
            </CardBody>
          </Card>
        </div>
      ))}
      <div
        ref={(el) => {
          if (el && !isMobile) cardsRef.current[3] = el;
        }}
      >
        <Card className="rounded-[48px] mb-12 bg-[#e9e9e9]  mt-12 max-md:mt-4 shadow-none border-1 border-[#0000000f]">
          <CardBody className="grid grid-cols-2 gap-4 max-md:gap-2 max-xl:grid-cols-1 p-4 max-md:p-2">
            {data1.map((item, index) => {
              return (
                <Card
                  className="rounded-[40px] box-shadow"
                  // style={{ boxShadow: " inset 0 2px 4px rgba(0, 0, 0, 0.1)" }}
                >
                  <CardHeader className="px-0 pt-0">
                    <div className=" w-full">
                      {item.isImage && (
                        <img
                          src={item.image}
                          alt="behance Logo"
                          className="w-full object-cover  h-[250px]"
                        />
                      )}
                      {!item.isImage && item.video}
                    </div>
                  </CardHeader>
                  <CardBody className="p-8 max-md:p-6 max-lg:p-6">
                    <p className="text-3xl max-md:text-3xl mt-0 mb-4 font-[700] pr-12 max-md:pr-4 tracking-[-0.5px] leading-[41.6px]">
                      {item.heading}
                    </p>
                    <p className="text-lg max-md:text-base mb-6 font-[500] leading-[25.2px]">
                      {item.description}
                    </p>

                    <div className="mb-6 grid-rows-3 w-full gap-4 max-md:gap-x-3">
                      {item.chip.map((chipItem, chipIndex) => (
                        <Chip
                          key={chipIndex}
                          radius="sm"
                          className="md:m-2 mr-2 max-md:mb-2 text-[14px] text-[#00000094] bg-[#51525E14]"
                          startContent={
                            <img
                              src={chipItem.icon}
                              className="mx-1 w-[16px]"
                            />
                          }
                        >
                          <p className="font-[600] max-md:font-[500]">
                            {chipItem.title}
                          </p>
                        </Chip>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default VideoWithCards;
