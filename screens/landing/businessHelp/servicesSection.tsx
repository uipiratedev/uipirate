import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button, Card, CardBody, Chip } from "@nextui-org/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import data from "@/data/servicesTopList.json";

gsap.registerPlugin(ScrollTrigger);

const ServicesSection = () => {
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;
  const [isHoveredChat, setIsHoveredChat] = useState(false);

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
      <div
        ref={(el) => {
          if (el && !isMobile) cardsRef.current[3] = el;
        }}
      >
        <Card className="rounded-[48px] mb-12 bg-[#e9e9e9]  mt-12 max-md:mt-4 shadow-none border-1 border-[#0000000f]">
          <CardBody className="grid grid-cols-3 gap-4 max-md:gap-2 max-xl:grid-cols-1 p-4 max-md:p-2">
            {data.slice(0, 3).map((item, index) => {
              return (
                <Card
                  className="rounded-[40px] box-shadow"
                  // style={{ boxShadow: " inset 0 2px 4px rgba(0, 0, 0, 0.1)" }}
                >
                  <CardBody className="p-8 max-md:p-6 max-lg:p-6">
                    {item.isImage && (
                      <img
                        src={item.sideImage}
                        alt="behance Logo"
                        className="object-cover h-[250px] min-md:h-[250px] max-h-full"
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
                        className="object-cover h-[250px] min-md:h-[250px] max-h-full"
                        src={item.video}
                      ></video>
                    )}
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
            <Card className="rounded-[40px] max-md:rounded-[30px] box-shadow col-span-3 max-md:col-span-1">
              <CardBody className="p-8 max-md:p-4 max-lg:p-6 px-0">
                <div className="w-full text-center">
                  <p className="text-3xl max-md:text-2xl mt-8 mb-4 font-semibold ">
                    Need something custom !
                  </p>
                  <p className="font-[500]">We’ll guide you.</p>

                  <div
                    className="my-12 flex flex-row items-center justify-center max-lg:flex-col w-full max-md:flex-col max-md:px-2 button-spring-animate relative"
                    style={{ overflow: "visible" }}
                  >
                    <a
                      href="https://cal.com/vishal-anand/introduction-and-free-ui-ux-strategy-session"
                      target="blank"
                      className="w-[250px] max-lg:mt-3 lg:ml-3"
                    >
                      <div className=" hover:border-back/50 hover:border-4 border-4 bg-black text-white rounded-[20px] h-auto group transform transition-all duration-[600ms] ease-in-out max-md:px-4 px-6 py-4 buttonHero md:hover:pl-12 hover:bg-black flex flow-row items-center gap-3 relative">
                        <div className="flex flex-row gap-2 items-center md:mr-11">
                          <img
                            src="https://res.cloudinary.com/damm9iwho/image/upload/v1730289917/Frame_1984078767_sjyim4.svg"
                            alt="Dribble Logo"
                            id="image"
                            className="w-auto h-[30px] md:absolute  transform translate-x-0 transition-all duration-[580ms] ease-in-out  md:group-hover:translate-x-4 max-md:order-3  md:order-1 md:group-hover:order-3"
                          />
                          <p
                            id="plus"
                            className="text-[#5B5B5B] text-xl font-bold md:absolute order-2 -mt-1"
                          >
                            +
                          </p>
                          <img
                            src="https://res.cloudinary.com/damm9iwho/image/upload/v1729761707/vishal_profile_d2fbyt.svg"
                            alt="Dribble Logo"
                            id="client"
                            className="w-auto h-[30px] md:absolute  transform translate-x-0 transition-all duration-500 ease-in-out  md:group-hover:-translate-x-[2.1rem] max-md:order-1  md:order-3 md:group-hover:order-1"
                          />
                        </div>
                        <p className="text-lg max-md:text-sm font-bold">
                          {" "}
                          Let’s Talk
                        </p>
                        <div className="max-md:hidden">
                          <img
                            src="https://res.cloudinary.com/damm9iwho/image/upload/v1729594468/free_p7odqs.svg"
                            alt="Dribble Logo"
                            className="w-auto h-[30px]"
                          />
                        </div>
                      </div>
                    </a>

                    <a
                      href="/services"
                      target="_blank"
                      className="w-[300px] max-lg:mt-3 lg:ml-3"
                    >
                      <Button
                        color="primary"
                        variant="bordered"
                        className=" border-back/50 hover:border-4 border-4 text-black font-bold w-full bg-white hover:border-gray-200 rounded-[16px]   py-[30px]"
                        style={{ width: "100%" }}
                        onMouseEnter={() => setIsHoveredChat(true)}
                        onMouseLeave={() => setIsHoveredChat(false)}
                      >
                        <div className="flex flex-col items-center justify-center max-h-[32px] overflow-hidden">
                          <span
                            className={`text-black transition-transform duration-300 ease-in-out transform flex flex-row items-center gap-x-3 ${
                              isHoveredChat
                                ? "translate-y-[50px]"
                                : "translate-y-4"
                            }`}
                          >
                            <p className="text-lg max-md:text-sm font-bold">
                              View All Services
                            </p>
                          </span>

                          <span
                            className={`text-black w-full transition-transform duration-300 ease-in-out transform flex flex-row items-center gap-3 ${
                              isHoveredChat
                                ? "-translate-y-4"
                                : "translate-y-[50px]"
                            }`}
                          >
                            {/* <img
                              src="https://res.cloudinary.com/damm9iwho/image/upload/v1729511358/whatsapp_zssebt.svg"
                              alt="WhatsApp Logo"
                              className="w-[30px]  h-[30px]"
                            /> */}
                            <p className="text-base font-semibold">
                              {" "}
                              View All Services
                            </p>
                          </span>
                        </div>
                      </Button>
                    </a>
                  </div>
                </div>
              </CardBody>
            </Card>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default ServicesSection;
