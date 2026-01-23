import { useEffect, useRef } from "react";
import { Card, CardBody, CardFooter, CardHeader, Chip } from "@heroui/react";
import { motion, Variants } from "framer-motion";
import Link from "next/link";

import data from "@/data/servicesTopList.json";

const data1 = [
  {
    heading: "UX Audits & Consultation",
    description: "Identify usability issues and get expert guidance.",
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
        autoPlay
        loop
        muted
        className="object-cover h-[250px] w-full"
        src="https://res.cloudinary.com/damm9iwho/video/upload/v1730895565/3D_qasvie.mp4"
        width="100%"
      />
    ),
    isImage: true,
  },
  {
    heading: "3D Animation  & Rendering",
    description: "Immersive 3D animations and rendering for standout visuals.",
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
        autoPlay
        loop
        muted
        className="object-cover h-[250px] w-full"
        src="https://res.cloudinary.com/damm9iwho/video/upload/v1730895565/3D_qasvie.mp4"
        width="70%"
      />
    ),
    isImage: false,
  },
];

// Animation variants for card scroll animations
const cardVariants: Variants = {
  hidden: {
    y: 100,
    scale: 0.9,
    opacity: 0
  },
  visible: {
    y: 0,
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.33, 1, 0.68, 1], // power2.out equivalent
    },
  },
};

const VideoWithCards = () => {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Handle video autoplay/pause when in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = videoRefs.current.findIndex(
            (video) => video === entry.target,
          );
          const videoElement = videoRefs.current[index];

          if (videoElement) {
            if (entry.isIntersecting) {
              videoElement.play();
              videoElement.playbackRate = 0.5;
            } else {
              videoElement.pause();
              videoElement.playbackRate = 1;
            }
          }
        });
      },
      { threshold: 0.4 },
    );

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Main cards */}
      {data.map((item, index) => (
        <motion.div
          key={index}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
        >
          <Card className="rounded-[48px] max-md:rounded-[38px] md:mt-12 bg-[#e9e9e9] max-md:mt-4 shadow-none border border-[#0000000f]">
            <CardBody className="grid grid-cols-2 gap-4 max-xl:grid-cols-1 p-2.5 max-md:p-2 max-md:gap-2">
              <Card className="rounded-[40px] max-md:rounded-[30px] box-shadow">
                <CardBody className="p-10 max-md:p-6 flex flex-col justify-between">
                  <div>
                    {/* <img
                      src={item.image}
                      alt="behance Logo"
                      className="w-[40px] grayscale "
                    /> */}
                    <div className=" mb-3">
                      <p className="text-3xl max-md:text-3xl mb-2 font-[700] tracking-[-0.5px] leading-[41.6px]">
                        {item.heading}
                      </p>
                      <p className="text-lg max-md:text-base font-[500]">
                        {item.subheading}
                      </p>
                    </div>
                    <p className="text-base max-md:text-base font-[500] text-[#777777] py-2">
                      {item.description}
                    </p>
                    <p className="text-lg max-md:text-base font-[500]">
                      {item.subheading2}
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {item.chip.map((chipItem, chipIndex) => (
                      <Chip
                        key={chipIndex}
                        className="text-[14px] text-[#00000094] bg-[#51525E14]"
                        radius="sm"
                        startContent={
                          <img
                            alt=""
                            className="mx-1 w-[16px]"
                            src={chipItem.icon}
                          />
                        }
                      >
                        <p className="font-[500] text-sm">{chipItem.title}</p>
                      </Chip>
                    ))}
                  </div>
                  <div className="mt-6">
                    <Link
                      href={`/services/${item.heading.replace(/\s+/g, "-")}`}
                    >
                      <button
                        className="mt-6 bg-black text-white  px-[40px]  py-[16px] rounded-[20px] group w-full"
                        color="primary"
                        style={{ width: "100%" }}
                      >
                        <div className="flex flex-col items-center justify-center max-h-[24px] overflow-hidden">
                          <p>Learn More</p>
                        </div>
                      </button>
                    </Link>
                  </div>
                </CardBody>
              </Card>

              <Card className="rounded-[40px] max-md:rounded-[30px] p-0 h-full max-md:h-[300px]">
                <CardBody style={{ padding: 0 }}>
                  {item.isImage && item.sideImage && (
                    <img
                      alt="illustration"
                      className="object-cover h-full w-full"
                      src={item.sideImage}
                    />
                  )}
                  {!item.isImage && (
                    <video
                      ref={(el) => {
                        if (el) videoRefs.current[index] = el;
                      }}
                      loop
                      muted
                      className="object-cover h-full w-full"
                      src={item.video}
                      width="100%"
                    />
                  )}
                </CardBody>
              </Card>
            </CardBody>
          </Card>
        </motion.div>
      ))}
      {/* Bottom cards (data1) */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
      >
        <Card className="rounded-[48px] max-md:rounded-[38px] mb-12 bg-[#e9e9e9] mt-12 max-md:mt-4 shadow-none border border-[#0000000f]">
          <CardBody className="grid grid-cols-2 gap-4 max-md:gap-2 max-xl:grid-cols-1 p-2.5 max-md:p-2">
            {data1.map((item, index) => (
              <div key={index}>
                <Card className="rounded-[40px] max-md:rounded-[30px] box-shadow">
                  <CardHeader className="px-0 pt-0 max-md:hidden">
                    <div className="w-full">
                      {item.isImage && (
                        <img
                          alt="preview"
                          className="w-full h-[250px] object-cover"
                          src={item.image}
                        />
                      )}
                      {!item.isImage && item.video}
                    </div>
                  </CardHeader>

                  <CardBody className="p-8 max-md:p-6">
                    <p className="text-3xl max-md:text-2xl font-[700] mb-4">
                      {item.heading}
                    </p>
                    <p className="text-lg max-md:text-base mb-6 text-[#555]">
                      {item.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {item.chip.map((chipItem, chipIndex) => (
                        <Chip
                          key={chipIndex}
                          className="text-[14px] text-[#00000094] bg-[#51525E14]"
                          radius="sm"
                          startContent={
                            <img
                              alt=""
                              className="mx-1 w-[16px]"
                              src={chipItem.icon}
                            />
                          }
                        >
                          <p className="font-[500] text-sm">{chipItem.title}</p>
                        </Chip>
                      ))}
                    </div>
                    <div className="mt-6">
                      <Link
                        href={`/services/${item.heading.replace(/\s+/g, "-")}`}
                      >
                        <button
                          className="mt-6 bg-black text-white  px-[40px]  py-[16px] rounded-[20px] group w-full"
                          color="primary"
                          style={{ width: "100%" }}
                        >
                          <div className="flex flex-col items-center justify-center max-h-[24px] overflow-hidden">
                            <p>Learn More</p>
                          </div>
                        </button>
                      </Link>
                    </div>
                  </CardBody>
                </Card>

                {/* Mobile Video/Footer */}
                <Card className="rounded-[40px] max-md:rounded-[30px] box-shadow mt-2">
                  <CardFooter className="md:hidden p-0">
                    <div className="w-full">
                      {item.isImage && (
                        <img
                          alt="mobile preview"
                          className="w-full h-[250px] object-cover"
                          src={item.image}
                        />
                      )}
                      {!item.isImage && item.video}
                    </div>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
};

export default VideoWithCards;
