"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button, Card, CardBody, Chip } from "@nextui-org/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const BoreYouCommit = () => {
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;
  const [isHoveredChat, setIsHoveredChat] = useState(false);

  useLayoutEffect(() => {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    cardsRef.current.forEach((card, index) => {
      if (card) {
        gsap.fromTo(
          card,
          { y: 100, transform: isMobile ? "scale(1)" : "scale(0.85)" },
          {
            y: 0,
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
  }, [isMobile]);

  return (
    <div className="container mx-auto px-6 md:px-12 lg:px-24 py-12">
      <div className="text-center mb-10 autoShow">
        <span className="bg-[#8EF1F1] px-4 py-2 rounded-xl font-semibold uppercase border-cyan-400 border-2">
          Before You Commit
        </span>
        <h2 className="text-4xl md:text-5xl font-bold mt-6 mb-4">
          See the difference in 5 days
        </h2>
        <p className="max-w-2xl mx-auto font-medium text-lg text-gray-700">
          You don't need to gamble with your product. Test how w work - and see
          results, with a short, focused 5-Day Pilot Project.
        </p>
      </div>

      <Card className="rounded-[48px] max-md:rounded-[38px] mb-12 bg-[#e9e9e9]  mt-12 max-md:mt-4 shadow-none border-1 border-[#0000000f]">
        <CardBody className=" p-3 max-md:p-2">
          <Card className="rounded-[40px] max-md:rounded-[30px] box-shadow col-span-3 max-md:col-span-1">
            <CardBody className="p-8 max-md:p-4 max-lg:p-6">
              <div className="flex flex-row gap-3">
                <div>
                  <h3 className="text-[24px] max-md:text-lg font-medium mb-3">
                    Why this works?
                  </h3>
                  <p className="text-gray-700 font-medium">
                    You need a high-quality product, but you can’t risk a large
                    budget on an untested team. We solve this by focusing on a
                    small, high-impact win first.
                  </p>
                </div>
                <div className="">
                  <img
                    src="/fxemoji_rocket.svg"
                    alt=""
                    className="max-md:hidden"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-3 max-md:grid-cols-1 gap-8 mt-10">
                <div>
                  <h3 className="text-[24px] max-md:text-lg font-medium mb-3">
                    Your Low-Risk Investment
                  </h3>
                  <p className="text-gray-700 font-medium">
                    The fee is fully deducted from your final invoice if we
                    proceed with a full project.
                  </p>
                </div>
                <div>
                  <h3 className="text-[24px] max-md:text-lg font-medium mb-3">
                    Zero-Risk Proof
                  </h3>
                  <p className="text-gray-700 font-medium">
                    You walk away with a functional, production-ready solution
                    and a clear demonstration of our skills, professionalism,
                    and speed.
                  </p>
                </div>
                <div>
                  <h3 className="text-[24px] max-md:text-lg font-medium mb-3">
                    Fast, Measurable Output
                  </h3>
                  <p className="text-gray-700 font-medium text-base">
                    In just 3 days, you get tangible results - real code, real
                    design, and real insight into how we work, communicate, and
                    deliver.
                  </p>
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-center pt-6 border-t-1 col-span-3 max-md:col-span-1">
                  What You Get in 3 Days?
                </h3>
              </div>
            </CardBody>
          </Card>
          {/* Top Section */}

          <div className="border-t border-gray-200 pt-10 mb-10 max-md:pt-6 max-md:mb-6">
            {/* 3 Cards Section */}
            <div className="grid md:grid-cols-3 gap-3">
              {/* Card 1 */}
              <Card
                // ref={(el) => {
                //   if (el) cardsRef.current[0] = el;
                // }}
                className="rounded-3xl bg-black text-white p-4 md:p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <Chip
                      className="text-sm font-semibold border-4 border-[#262626] bg-[#ffffff] text-[#000]"
                      variant="flat"
                    >
                      Design
                    </Chip>
                    <h4 className="text-3xl font-bold max-md:text-2xl flex items-baseline gap-1">
                      <span className="text-lg">$</span>
                      150
                    </h4>
                  </div>
                  <ul className="space-y-4 text-left">
                    <li>
                      <div className="flex flex-row gap-2 items-start">
                        <img
                          src="/check.svg"
                          alt=""
                          className=" w-5 h-5 min-w-5 minh-5 max-w-5 max-h-5 mt-1 "
                        />

                        <div>
                          <span className="font-semibold">
                            Research & Creative Direction
                          </span>
                          <p className="text-gray-300 text-sm">
                            Quick discovery phase - understanding your users,
                            goals, and competitors, while mapping a simple IA
                            and short user stories.
                          </p>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="flex flex-row gap-2 items-start">
                        <img
                          src="/check.svg"
                          alt=""
                          className=" w-5 h-5 min-w-5 minh-5 max-w-5 max-h-5 mt-1"
                        />

                        <div>
                          <span className="font-semibold">1–2 Page Design</span>
                          <p className="text-gray-300 text-sm">
                            Designing 1–2 key screens (like a landing page or
                            dashboard) to define layout, hierarchy, and visual
                            tone.
                          </p>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="flex flex-row  gap-2 items-start">
                        <img
                          src="/check.svg"
                          alt=""
                          className=" w-5 h-5 min-w-5 minh-5 max-w-5 max-h-5 mt-1"
                        />

                        <div>
                          <span className="font-semibold">
                            Styles & Visual Direction
                          </span>
                          <p className="text-gray-300 text-sm">
                            We establish your brand direction - colors,
                            typography, and basic visual language, to set the
                            foundation for your UI system.
                          </p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </Card>

              {/* Card 2 */}
              <Card
                // ref={(el) => {
                //   if (el) cardsRef.current[1] = el;
                // }}
                className="rounded-3xl bg-black text-white p-4 md:p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <Chip
                      className="text-sm font-semibold border-4 border-[#262626] bg-white text-black"
                      variant="flat"
                    >
                      Development
                    </Chip>
                    <h4 className="text-3xl font-bold max-md:text-2xl">$250</h4>
                  </div>
                  <ul className="space-y-4 text-left">
                    <li>
                      <div className="flex flex-row  items-start gap-2">
                        <img
                          src="/check.svg"
                          alt=""
                          className=" w-5 h-5 min-w-5 minh-5 max-w-5 max-h-5 mt-1"
                        />

                        <div>
                          <span className="font-semibold">
                            Project Setup on GitHub
                          </span>
                          <p className="text-gray-300 text-sm">
                            We initialize your repo, configure folder structure,
                            dependencies, and version control, clean and ready
                            for future scale.
                          </p>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="flex flex-row  items-start gap-2">
                        <img
                          src="/check.svg"
                          alt=""
                          className=" w-5 h-5 min-w-5 minh-5 max-w-5 max-h-5 mt-1"
                        />

                        <div>
                          <span className="font-semibold">
                            1–2 Page Development
                          </span>
                          <p className="text-gray-300 text-sm">
                            We build 1–2 meaningful components or sections (like
                            a hero, form, or navigation) to show build quality
                            and structure.
                          </p>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="flex flex-row  items-start gap-2">
                        <img
                          src="/check.svg"
                          alt=""
                          className=" w-5 h-5 min-w-5 minh-5 max-w-5 max-h-5 mt-1"
                        />

                        <div>
                          <span className="font-semibold">Hosted URL</span>
                          <p className="text-gray-300 text-sm">
                            Your pilot is deployed on a temporary link so you
                            can test, share, and experience the build directly
                            in your browser.
                          </p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </Card>

              {/* Card 3 */}
              <Card
                // ref={(el) => {
                //   if (el) cardsRef.current[2] = el;
                // }}
                className="rounded-3xl bg-black text-white p-4 md:p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <Chip
                      className="text-sm font-semibold border-4 border-[#262626] bg-white text-black"
                      variant="flat"
                    >
                      Design + Development
                    </Chip>
                    <h4 className="text-3xl font-bold max-md:text-2xl">$350</h4>
                  </div>
                  <ul className="space-y-4 text-left">
                    <li>
                      <div className="flex flex-row  items-start gap-2">
                        <img
                          src="/check.svg"
                          alt=""
                          className=" w-5 h-5 min-w-5 minh-5 max-w-5 max-h-5 mt-1"
                        />

                        <div>
                          <span className="font-semibold">
                            Hybrid Design & Build
                          </span>
                          <p className="text-gray-300 text-sm">
                            We create 1–2 screens and code them into responsive,
                            functional pages, blending both design and
                            development seamlessly.
                          </p>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="flex flex-row  items-start gap-2">
                        <img
                          src="/check.svg"
                          alt=""
                          className=" w-5 h-5 min-w-5 minh-5 max-w-5 max-h-5 mt-1"
                        />

                        <div>
                          <span className="font-semibold">
                            Components & Visual Integration
                          </span>
                          <p className="text-gray-300 text-sm">
                            We implement styled UI components (like buttons,
                            forms, or layouts) consistent with your brand
                            direction and design preview.
                          </p>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="flex flex-row  items-start gap-2">
                        <img
                          src="/check.svg"
                          alt=""
                          className=" w-5 h-5 min-w-5 minh-5 max-w-5 max-h-5 mt-1"
                        />

                        <div>
                          <span className="font-semibold">
                            Technical Speed Audit & Code Review
                          </span>
                          <p className="text-gray-300 text-sm">
                            We identify and fix minor performance issues while
                            reviewing structure and maintainability, ensuring
                            the pilot is production-grade.
                          </p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </Card>
            </div>
          </div>
          <Card className="rounded-[40px] max-md:rounded-[30px] box-shadow col-span-3 max-md:col-span-1 bg-white/50">
            <CardBody className="p-4 max-md:p-4 max-lg:p-6 px-0">
              {/* Bottom Buttons */}
              <div className="flex flex-col items-center justify-center my-6 gap-4">
                <Button
                  as="a"
                  href="https://cal.com/vishal-anand/introduction-and-free-ui-ux-strategy-session"
                  target="_blank"
                  className="bg-black text-white rounded-[16px] px-8 py-6 font-bold text-base max-md:text-sm w-full md:w-auto border-4 border-[#E2E2E2] "
                >
                  Secure Your Zero-Risk Slot Now
                </Button>

                <p className="my-0 text-center">or</p>

                <Link href="/pricing">
                  <Button
                    as="a"
                    color="primary"
                    variant="bordered"
                    className="bg-white text-black rounded-[16px] px-8 py-6 font-bold text-base w-full md:w-auto border-3 border-[#E2E2E2] "
                  >
                    See Detailed Pricing
                  </Button>
                </Link>
              </div>
            </CardBody>
          </Card>
        </CardBody>
      </Card>
    </div>
  );
};

export default BoreYouCommit;
