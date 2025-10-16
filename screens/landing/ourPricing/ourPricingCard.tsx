import { Button, Card, CardBody, Chip } from "@nextui-org/react";
import { Tabs, Tab } from "@nextui-org/react";
import { useState } from "react";
import ListMap from "./list";

const data = [
  {
    icon: "https://res.cloudinary.com/damm9iwho/image/upload/v1729841109/widget-svgrepo-com_1_xflrym.svg",
    heading: "Web/Mobile Apps",
    description:
      "Ideal for building complete app or Saas, including design and development.",
    dev: "499",
    design: "1999",
    designDev: "2399",
    devhr: "25",
    designhr: "20",
    list: [
      "8-12 week delivery",
      "SaaS design ready",
      "Predefined scope of work (SOW)",
      "End-to-end design and development",
      "Functional prototypes for testing",
      "Cross-platform testing",
      "50/30/20 payment schedule",
      "5/7 communication via Teams, Meet, or Zoom",
    ],
    listDev: [
      "6-8 week delivery",
      "SaaS design ready",
      "Predefined scope of work (SOW)",
      "Fully responsive code",
      "Custom frontend development",
      "Backend integration (API-ready)",
      "50/30/20 payment schedule",
      "5/7 communication via Teams, Meet, or Zoom",
    ],
    listDesign: [
      "4-6 week delivery",
      "SaaS design ready",
      "Predefined scope of work (SOW)",
      "Interactive prototypes",
      "3 rounds of revisions included",
      "Design files (Figma) provided",
      "50/30/20 payment schedule",
      "5/7 communication via Teams, Meet, or Zoom",
    ],
    listhr: [
      "8-12 week delivery",
      "SaaS design ready",
      "Predefined scope of work (SOW)",
      "End-to-end design and development",
      "Functional prototypes for testing",
      "Cross-platform testing",
      "5/7 communication via Teams, Meet, or Zoom",
    ],
    listDevhr: [
      "6-8 week delivery",
      "SaaS design ready",
      "Predefined scope of work (SOW)",
      "Fully responsive code",
      "Custom frontend development",
      "Backend integration (API-ready)",
      "5/7 communication via Teams, Meet, or Zoom",
    ],
    listDesignhr: [
      "4-6 week delivery",
      "SaaS design ready",
      "Predefined scope of work (SOW)",
      "Interactive prototypes",
      "3 rounds of revisions included",
      "Design files (Figma) provided",
      "5/7 communication via Teams, Meet, or Zoom",
    ],
    tab: true,
  },
  {
    icon: "https://res.cloudinary.com/damm9iwho/image/upload/v1729841107/Vectore_ididim.svg",
    heading: "Landing Pages & E-commerce",
    description:
      "Build high-conversion landing pages or full e-commerce platforms",
    dev: "299",
    design: "499",
    designDev: "699",
    devhr: "25",
    designhr: "20",
    list: [
      "4-6 week delivery",
      "1-5 Pages",
      "End-to-end design & development",
      "E-commerce integrations",
      "SEO-optimized structure",
      "Analytics & tracking integration",
      "50/30/20 payment schedule",
      "5/7 communication via Teams, Meet, or Zoom",
    ],
    listDev: [
      "3-4 week delivery",
      "1-5 Pages",
      "CMS integration (if needed)",
      "SSL & basic security setup",
      "Payment gateway integration (if needed)",
      "Responsive coding (desktop & mobile)",
      "50/30/20 payment schedule",
      "5/7 communication via Teams, Meet, or Zoom",
    ],
    listDesign: [
      "2-3 week delivery",
      "1-5 Pages",
      "Up to 3 rounds of revisions",
      "Custom, conversion-focused design",
      "E-commerce functionality",
      "Mobile-responsive layouts",
      "50/30/20 payment schedule",
      "5/7 communication via Teams, Meet, or Zoom",
    ],
    listhr: [
      "4-6 week delivery",
      "1-5 Pages",
      "End-to-end design & development",
      "E-commerce integrations",
      "SEO-optimized structure",
      "Analytics & tracking integration",
      "5/7 communication via Teams, Meet, or Zoom",
    ],
    listDevhr: [
      "3-4 week delivery",
      "1-5 Pages",
      "CMS integration (if needed)",
      "SSL & basic security setup",
      "Payment gateway integration (if needed)",
      "Responsive coding (desktop & mobile)",
      "5/7 communication via Teams, Meet, or Zoom",
    ],
    listDesignhr: [
      "2-3 week delivery",
      "1-5 Pages",
      "Up to 3 rounds of revisions",
      "Custom, conversion-focused design",
      "E-commerce functionality",
      "Mobile-responsive layouts",
      "5/7 communication via Teams, Meet, or Zoom",
    ],
    tab: true,
  },
  {
    icon: "https://res.cloudinary.com/damm9iwho/image/upload/v1729841104/figma-component-svgrepo-com_1_mtgewy.svg",
    heading: "Design Systems & Component Libraries",
    description:
      "Scalable design systems with reusable components for consistent UI and easy integration.",
    designDev: "1,199",
    designhr: "20",
    list: [
      "1-2 month delivery",
      "Consistent UI components",
      "Scalable design assets",
      "Brand guidelines integration",
      "Documented usage guidelines",
      "Cross-platform consistency",
      "50/30/20 payment schedule",
      "5/7 communication via Teams, Meet, or Zoom",
    ],
    listhr: [
      "1-2 month delivery",
      "Consistent UI components",
      "Scalable design assets",
      "Brand guidelines integration",
      "Documented usage guidelines",
      "Cross-platform consistency",
      "5/7 communication via Teams, Meet, or Zoom",
    ],
    tab: false,
  },
  {
    icon: "https://res.cloudinary.com/damm9iwho/image/upload/v1729841104/figma-component-svgrepo-com_1_mtgewy.svg",
    heading: "Graphics Design",
    description:
      "Scalable design systems with reusable components for consistent UI & easy integration.",
    designDev: "1,199",
    designhr: "15",
    list: [
      "2-4 weeks delivery",
      "Scalable design systems",
      "Development-ready components",
      "UI consistency",
      "Reusable components",
      "Custom design library",
      "5/7 Communication",
    ],
    listhr: [
      "2-4 weeks delivery",
      "Scalable design systems",
      "Development-ready components",
      "UI consistency",
      "Reusable components",
      "Custom design library",
      "5/7 Communication",
    ],
    tab: false,
  },
];

const dataPrice = [
  {
    icon: "https://res.cloudinary.com/damm9iwho/image/upload/v1729841103/video-library-svgrepo-com_1_edfhv4.svg",
    heading: "3D Animation + Motion Graphics",
    description:
      "Create stunning visuals and motion graphics for your digital projects with expert 3D animation and rendering.",
    price: "49",
    pricehr: "35",
    list: [
      "1-4 weeks delivery",
      "Custom motion graphics",
      "High-end 3D rendering",
      "Interactive animations",
      "Development-ready assets",
      "3 rounds of revisions",
      "Compatible with web & social",
      "50/30/20 payment schedule",
      "5/7 communication via Teams, Meet, or Zoom",
    ],
    limited: false,
  },
  {
    icon: "https://res.cloudinary.com/damm9iwho/image/upload/v1729841102/Group_jgfe_zhcljv.svg",

    heading: "Partnership and Consultation ",
    description:
      "Perfect for ongoing design & development needs or flexible, undefined scopes. Get continuous support for your projects.",
    price: "999",
    pricehr: "25",
    list: [
      "Flexible scope of work",
      "End-to-end project management",
      "Unlimited Design request & revisions",
      "Design & dev consultation",
      "Heuristic analysis",
      "Recommendations for improvement",
      "Visual/UX critique",
      "50/30/20 payment schedule",
      "1-3 days updates + 1 sync call/week",
    ],
    limited: true,
  },
];

const OurPricingCard = (props: any) => {
  const [isHoveredChat, setIsHoveredChat] = useState(false);

  const tabs = [
    {
      id: "Design + Dev",
      label: "Design + Dev",
    },
    {
      id: "Design Only",
      label: "Design Only",
    },
    {
      id: "Dev Only",
      label: "Dev Only",
    },
  ];

  return (
    <div>
      <Card className="rounded-[48px] max-md:rounded-[38px] mt-4 max-md:pb-2 bg-[#e9e9e9] shadow-none border-1 border-[#0000000f]">
        <CardBody className="gap-4 max-md:gap-2 max-md:grid-cols-1 p-4 max-md:p-2">
          {data.map((item, index) => {
            const [selectedTab, setSelectedTab] = useState("Design + Dev");

            const handleTabChange = (id: any) => {
              setSelectedTab(id);
              // console.log(`Tab for card ${index} selected:`, id);
            };

            return (
              <Card
                key={index}
                className="rounded-[40px] max-md:rounded-[30px] box-shadow min-h-[470px]"
              >
                <CardBody className="p-8 max-md:p-4 max-lg:p-6 grid grid-cols-2 gap-12  max-md:grid-cols-1 max-md:gap-4">
                  <div className="w-full">
                    <img
                      src={item.icon}
                      alt="service logo"
                      className="w-[40px] grayscale"
                    />
                    <p className="text-3xl max-md:text-3xl mt-4 mb-4 font-[700] tracking-[-0.5px] leading-[38.4px]">
                      {item.heading}
                    </p>
                    <p className="font-[500]">{item.description}</p>
                    <div className="mt-6 mb-4">
                      <p className="text-[#C5C5C5] text-lg">
                        {props.id === "Fixed" ? "Starting from" : "Hourly Rate"}
                      </p>
                      <div className="flex flex-row items-center justify-between">
                        <p className="text-4xl font-semibold mt-2 max-md:text-2xl">
                          {/* $ {item.price} */}
                          {props.id == "Fixed" ? (
                            selectedTab == "Design + Dev" ? (
                              <p>
                                <span className="text-2xl mr-[4px] ">$</span>
                                {item.designDev}
                                <span className=" text-2xl font-bold max-md:text-sm align-top">
                                  *
                                </span>
                              </p>
                            ) : selectedTab == "Design Only" ? (
                              <p className=" align-middle">
                                <span className="text-2xl mr-[4px] ">$</span>
                                {item.design}
                                <span className=" text-2xl font-bold max-md:text-sm align-top">
                                  *
                                </span>
                              </p>
                            ) : (
                              <p className=" align-middle">
                                <span className="text-2xl mr-[4px] ">$</span>
                                {item.dev}
                                <span className=" text-2xl font-bold max-md:text-sm align-top">
                                  *
                                </span>
                              </p>
                            )
                          ) : selectedTab == "Design + Dev" ? (
                            // <p>
                            //   <span className="text-2xl mr-[4px] ">$</span>
                            //   {item.designhr}{" "}
                            //   {item.devhr && (
                            //     <>
                            //       <span className="text-[#C5C5C5] ">+</span>{" "}
                            //       <span className="text-2xl mr-[4px] ">$</span>
                            //       {item.devhr}
                            //     </>
                            //   )}
                            // </p>

                            <p>
                              <span className="text-2xl mr-[4px] ">$</span>
                              {item.designhr}
                              <span className="text-[#C5C5C5] text-lg font-light max-md:text-sm">
                                {item.tab && "Design"}
                              </span>{" "}
                              {item.devhr && (
                                <>
                                  <span className="text-[#C5C5C5] ">+</span>{" "}
                                  <span className="text-2xl mr-[4px] ">$</span>
                                  {item.devhr}
                                  <span className="text-[#C5C5C5] text-lg font-light max-md:text-sm">
                                    Dev
                                  </span>
                                </>
                              )}
                            </p>
                          ) : selectedTab == "Design Only" ? (
                            <p>
                              <span className="text-2xl mr-[4px] ">$</span>
                              {item.designhr}
                            </p>
                          ) : (
                            <p>
                              <span className="text-2xl mr-[4px] ">$</span>
                              {`${item.devhr}`}
                            </p>
                          )}
                        </p>
                        {item.tab && (
                          <img
                            src={
                              selectedTab == "Design + Dev"
                                ? "https://res.cloudinary.com/damm9iwho/image/upload/v1730106610/designdev_f0onqh.svg"
                                : selectedTab == "Design Only"
                                ? "https://res.cloudinary.com/damm9iwho/image/upload/v1730106610/design_oly_f4hn7l.svg"
                                : "https://res.cloudinary.com/damm9iwho/image/upload/v1730106610/dev_grzer7.svg"
                            }
                            alt="design dev icon"
                            className="w-[36px] h-[32px]"
                          />
                        )}
                      </div>
                    </div>
                    <div className="md:hidden max-md:block">
                      <a
                        href="https://cal.com/vishal-anand/introduction-and-free-ui-ux-strategy-session"
                        target="blank"
                      >
                        <Button
                          className="bg-black text-white button dark:bg-white dark:text-black w-full"
                          startContent={
                            <img
                              src="https://res.cloudinary.com/damm9iwho/image/upload/v1729594468/free_p7odqs.svg"
                              alt="Dribble Logo"
                            />
                          }
                        >
                          Book a 15-min call
                        </Button>
                      </a>
                    </div>
                  </div>

                  <div>
                    {item.tab && (
                      <div>
                        {props.id == "Fixed" ? (
                          selectedTab == "Design + Dev" ? (
                            <ListMap list={item.list} />
                          ) : selectedTab == "Design Only" ? (
                            <ListMap list={item.listDesign} />
                          ) : (
                            <ListMap list={item.listDev} />
                          )
                        ) : selectedTab == "Design + Dev" ? (
                          <ListMap list={item.listhr} />
                        ) : selectedTab == "Design Only" ? (
                          <ListMap list={item.listDesignhr} />
                        ) : (
                          <ListMap list={item.listDevhr} />
                        )}
                      </div>
                    )}

                    {!item.tab && (
                      <div className="">
                        {props.id == "Fixed" ? (
                          <ListMap list={item.list} />
                        ) : (
                          <ListMap list={item.listhr} />
                        )}
                      </div>
                    )}

                    {/* {item.list.map((listItem, listIndex) => (
                      <div
                        key={listIndex}
                        className="flex flex-row items-center mt-3 gap-2"
                      >
                        <img
                          src="https://res.cloudinary.com/damm9iwho/image/upload/v1730809748/mynaui_check-hexagon-solid_t7vhzg.svg"
                          alt=""
                        />
                        <p className="">{listItem}</p>
                      </div>
                    ))} */}
                    <div className="md:hidden max-md:block">
                      {item.tab && (
                        <div className="flex w-full flex-col items-start justify-end mt-8 max-sm:mt-6">
                          <Tabs
                            aria-label="Dynamic tabs"
                            items={tabs}
                            classNames={{
                              cursor: "w-full bg-black text-black",
                              tab: "px-6 max-lg:px-2",
                              tabContent:
                                "group-data-[selected=true]:text-white text-black font-[700] max-md:font-[600]",
                            }}
                            onSelectionChange={(key) => handleTabChange(key)}
                          >
                            {tabs.map((tabItem) => (
                              <Tab
                                key={tabItem.id}
                                title={tabItem.label}
                                className="max-md:text-xs"
                              />
                            ))}
                          </Tabs>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="md:block max-md:hidden  -mt-6">
                    <a
                      href="https://cal.com/vishal-anand/introduction-and-free-ui-ux-strategy-session"
                      target="blank"
                    >
                      {/* <Button
                        className="bg-black text-white button dark:bg-white dark:text-black w-full"
                        startContent={
                          <img
                            src="https://res.cloudinary.com/damm9iwho/image/upload/v1729594468/free_p7odqs.svg"
                            alt="Dribble Logo"
                          />
                        }
                      >
                        Book a 15-min call
                      </Button> */}

                      <button
                        color="primary"
                        className="mt-3 bg-black text-white w-full  py-[16px] rounded-[16px] group"
                        style={{ width: "100%" }}
                        onMouseEnter={() => setIsHoveredChat(true)}
                        onMouseLeave={() => setIsHoveredChat(false)}
                      >
                        <div className="flex flex-col items-center justify-center max-h-[24px] overflow-hidden">
                          <span
                            className={`text-white text-sm transition-transform duration-300 ease-in-out transform flex flex-row items-center gap-x-3 
                                
                                 group-hover:translate-y-[50px] translate-y-3
                                
                               `}
                          >
                            <img
                              src="https://res.cloudinary.com/damm9iwho/image/upload/v1729594468/free_p7odqs.svg"
                              alt="Dribble Logo"
                            />
                            Book a 15-min call
                          </span>

                          <span
                            className={`text-white  transition-transform duration-300 ease-in-out transform flex flex-row items-center gap-3
                                
                                translate-y-[50px] group-hover:-translate-y-3
                                
                               
                              
                              
                              `}
                          >
                            <img
                              src="https://res.cloudinary.com/damm9iwho/image/upload/v1729594468/free_p7odqs.svg"
                              alt="Dribble Logo"
                            />
                            Lets talk!
                          </span>
                        </div>
                      </button>
                    </a>
                  </div>

                  <div className="md:block max-md:hidden -mt-4">
                    {item.tab && (
                      <div className="flex w-full flex-col items-start justify-end mt-3 max-sm:mt-0">
                        <Tabs
                          aria-label="Dynamic tabs"
                          items={tabs}
                          classNames={{
                            cursor: "w-full bg-black text-black",
                            tab: "px-6 max-lg:px-2",
                            tabContent:
                              "group-data-[selected=true]:text-white text-black font-[700] max-md:font-[600]",
                          }}
                          onSelectionChange={(key) => handleTabChange(key)}
                        >
                          {tabs.map((tabItem) => (
                            <Tab
                              key={tabItem.id}
                              title={tabItem.label}
                              className="max-md:text-xs"
                            />
                          ))}
                        </Tabs>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            );
          })}
          <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
            {dataPrice.map((item, index) => {
              return (
                <Card className="rounded-[40px] box-shadow  shadow-none border-1 border-[#0000000f]">
                  <CardBody className="p-8 max-md:p-4 max-lg:p-6 grid grid-cols-1 gap-4 max-md:grid-cols-1">
                    <div className="w-full">
                      <div className="flex flex-row items-center justify-between">
                        <img
                          src={item.icon}
                          alt="behance Logo"
                          className="w-[40px]  grayscale "
                        />
                        {item.limited && (
                          <Chip
                            radius="sm"
                            className=" text-sm text-[#7B7B7B] px-2 rounded-lg bg-[#E9E9E9]"
                            startContent={
                              <img
                                src="https://res.cloudinary.com/damm9iwho/image/upload/v1729841595/svg1994013495_1681_qv43ow.svg"
                                className="w-[14px]"
                              />
                            }
                          >
                            Limited availability
                          </Chip>
                        )}
                      </div>

                      <p className="text-3xl max-md:text-2xl mt-4 mb-4 font-semibold pr-20">
                        {item.heading}
                      </p>
                      <p className="font-[500]">{item.description}</p>
                      <div className="mt-6 mb-4">
                        <p className="text-[#C5C5C5] text-lg">
                          {props.id == "Fixed"
                            ? "Starting from"
                            : "Hourly Rate"}
                        </p>
                        <p className="text-4xl font-semibold mt-2">
                          <span className="text-2xl mr-[4px] ">$</span>
                          {props.id == "Fixed" ? item.price : item.pricehr}
                          {props.id == "Fixed" ? (
                            <span className=" text-2xl font-bold max-md:text-sm align-top">
                              *
                            </span>
                          ) : (
                            ""
                          )}
                        </p>
                      </div>
                      {/* <a
                        href="https://cal.com/vishal-anand/introduction-and-free-ui-ux-strategy-session"
                        target="blank"
                      >
                        <Button
                          className="bg-black text-white button dark:bg-white dark:text-black w-full"
                          startContent={
                            <img
                              src="https://res.cloudinary.com/damm9iwho/image/upload/v1729594468/free_p7odqs.svg"
                              alt="Dribble Logo"
                              className=""
                            />
                          }
                        >
                          Book a 15-min call
                        </Button>
                      </a> */}
                      <a
                        href="https://cal.com/vishal-anand/introduction-and-free-ui-ux-strategy-session"
                        target="_blank"
                        className="w-full"
                      >
                        <button
                          color="primary"
                          className="mt-3 bg-black text-white w-full  py-[16px] rounded-[16px] group"
                          style={{ width: "100%" }}
                          onMouseEnter={() => setIsHoveredChat(true)}
                          onMouseLeave={() => setIsHoveredChat(false)}
                        >
                          <div className="flex flex-col items-center justify-center max-h-[24px] overflow-hidden">
                            <span
                              className={`text-white text-sm transition-transform duration-300 ease-in-out transform flex flex-row items-center gap-x-3 
                                
                                 group-hover:translate-y-[50px] translate-y-3
                                
                               `}
                            >
                              <img
                                src="https://res.cloudinary.com/damm9iwho/image/upload/v1729594468/free_p7odqs.svg"
                                alt="Dribble Logo"
                              />
                              Book a 15-min call
                            </span>

                            <span
                              className={`text-white  transition-transform duration-300 ease-in-out transform flex flex-row items-center gap-3
                                
                                translate-y-[50px] group-hover:-translate-y-3
                                
                               
                              
                              
                              `}
                            >
                              <img
                                src="https://res.cloudinary.com/damm9iwho/image/upload/v1729594468/free_p7odqs.svg"
                                alt="Dribble Logo"
                              />
                              Lets talk!
                            </span>
                          </div>
                        </button>
                      </a>
                    </div>

                    <div className="">
                      {item.list.map((items, indexs) => {
                        return (
                          <div>
                            {props.id == "Fixed" ? (
                              <div className="flex flex-row items-start mt-3 gap-2">
                                <img
                                  src="https://res.cloudinary.com/damm9iwho/image/upload/v1730809748/mynaui_check-hexagon-solid_t7vhzg.svg"
                                  alt=""
                                />
                                <p className="">{items}</p>
                              </div>
                            ) : (
                              !(items == "50/30/20 payment schedule") && (
                                <div className="flex flex-row items-start mt-3 gap-2">
                                  <img
                                    src="https://res.cloudinary.com/damm9iwho/image/upload/v1730809748/mynaui_check-hexagon-solid_t7vhzg.svg"
                                    alt=""
                                  />
                                  <p className="">{items}</p>
                                </div>
                              )
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>

          <Card className="rounded-[40px] max-md:rounded-[30px] box-shadow ">
            <CardBody className="p-8 max-md:p-4 max-lg:p-6 px-0">
              <div className="w-full text-center">
                <p className="text-3xl max-md:text-2xl mt-8 mb-4 font-semibold ">
                  Not sure which plan fits your scope?
                </p>
                <p className="font-[500]">We’ll guide you.</p>

                <div
                  className="my-12 flex flex-row items-center justify-center max-lg:flex-col w-full max-md:flex-col max-md:px-2 button-spring-animate relative"
                  style={{ overflow: "visible" }}
                >
                  <a
                    href="https://cal.com/vishal-anand/introduction-and-free-ui-ux-strategy-session"
                    target="blank"
                    className="w-[300px] max-lg:mt-3 lg:ml-3"
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
                        Book a 15-min call
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
                    href="https://wa.link/i35lma"
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
                          <img
                            src="https://res.cloudinary.com/damm9iwho/image/upload/v1729511358/whatsapp_zssebt.svg"
                            alt="WhatsApp Logo"
                            className="w-[30px]  h-[30px] "
                          />
                          <p className="text-lg max-md:text-sm font-bold">
                            Chat on WhatsApp
                          </p>
                        </span>

                        <span
                          className={`text-black w-full transition-transform duration-300 ease-in-out transform flex flex-row items-center gap-3 ${
                            isHoveredChat
                              ? "-translate-y-4"
                              : "translate-y-[50px]"
                          }`}
                        >
                          <img
                            src="https://res.cloudinary.com/damm9iwho/image/upload/v1729511358/whatsapp_zssebt.svg"
                            alt="WhatsApp Logo"
                            className="w-[30px]  h-[30px]"
                          />
                          <p className="text-base font-semibold">
                            {" "}
                            +91 97086 36151
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
  );
};

export default OurPricingCard;
