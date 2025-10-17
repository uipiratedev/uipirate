import { Card, CardBody } from "@nextui-org/react";

const data = [
  //   col 1
  {
    gradiendt: "linear-gradient(180deg, #FFE6F4 20.66%, #FFFAFD 100%)",
    icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1760610137/rocket_pk7ci5.svg",
    data: [
      {
        image:
          "https://res.cloudinary.com/damm9iwho/image/upload/v1760506407/motionicon_uwwkm4.svg",
        heading: "Research & Community Insights",
        description:
          "Crowdsourced opinions, Reddit research, and user behavior analysis.",
      },
      {
        image:
          "https://res.cloudinary.com/damm9iwho/image/upload/v1760506407/motionicon_uwwkm4.svg",
        heading: "Frontend Development & Code",
        description:
          "React, JS, CSS tips, dev workflows, and code optimization.",
      },
      {
        image:
          "https://res.cloudinary.com/damm9iwho/image/upload/v1760506407/motionicon_uwwkm4.svg",
        heading: "Graphic Design & Print",
        description:
          "Posters, brochures, print assets, and cross-media brand consistency.",
      },
      {
        image:
          "https://res.cloudinary.com/damm9iwho/image/upload/v1760506407/motionicon_uwwkm4.svg",
        heading: "UX Mistakes & Misconceptions",
        description:
          "Debunking bad practices, myths, and misunderstood design “rules.”",
      },
    ],
  },
  //   col 2
  {
    gradiendt: "linear-gradient(180deg, #F5FFD9 29.57%, #FDFFF7 100%)",
    icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1760610137/reserch_hl7lpt.svg",
    data: [
      {
        image:
          "https://res.cloudinary.com/damm9iwho/image/upload/v1760506407/motionicon_uwwkm4.svg",
        heading: "UX & Product Design",
        description:
          "Principles, best practices, and strategies for intuitive digital products.",
      },
      {
        image:
          "https://res.cloudinary.com/damm9iwho/image/upload/v1760506407/motionicon_uwwkm4.svg",
        heading: "Design Systems & Components",
        description:
          "Scalable design tokens, UI kits, and cross-team consistency tips.",
      },
      {
        image:
          "https://res.cloudinary.com/damm9iwho/image/upload/v1760506407/motionicon_uwwkm4.svg",
        heading: "Motion Graphics & Video Editing",
        description:
          "Animations, transitions, editing workflows, and video-based engagement.",
      },
      {
        image:
          "https://res.cloudinary.com/damm9iwho/image/upload/v1760506407/motionicon_uwwkm4.svg",
        heading: "Consultation & Strategy",
        description:
          "Product audits, growth planning, and actionable expert advice.",
      },
    ],
  },

  //   col 3
  {
    gradiendt: "linear-gradient(180deg, #78E6F4 20.66%, #F5FEFF 100%)",
    icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1760610137/design_loqtac.svg",
    data: [
      {
        image:
          "https://res.cloudinary.com/damm9iwho/image/upload/v1760506407/motionicon_uwwkm4.svg",
        heading: "UI Design & Visual Trends",
        description:
          "Interface patterns, style explorations, and modern design aesthetics.",
      },
      {
        image:
          "https://res.cloudinary.com/damm9iwho/image/upload/v1760506407/motionicon_uwwkm4.svg",
        heading: "Branding & Storytelling",
        description:
          "Identity building, narrative-driven design, and brand strategy.",
      },
      {
        image:
          "https://res.cloudinary.com/damm9iwho/image/upload/v1760506407/motionicon_uwwkm4.svg",
        heading: "3D Animation & Rendering",
        description: "Modeling, rendering, and cinematic visual techniques.",
      },
      {
        image:
          "https://res.cloudinary.com/damm9iwho/image/upload/v1760506407/motionicon_uwwkm4.svg",
        heading: "Career Growth & Industry Insights",
        description:
          "Freelance tips, agency life, and staying ahead in design & dev careers.",
      },
    ],
  },
];

const LookingFor = () => {
  return (
    <div className="mt-16">
      <p className="heading-center mb-6">Find What You’re Looking For</p>
      <div className="grid grid-cols-3 max-md:grid-cols-1 max-lg:grid-cols-2 gap-6 max-md:gap-4">
        {data.map((itemMain, index) => {
          const itemsToShow =
            typeof window !== "undefined" && window.innerWidth <= 768
              ? [itemMain.data[0]] // only first card on mobile
              : itemMain.data; // show all cards on larger screens

          return (
            <div key={index}>
              {itemsToShow.map((item, index) => {
                return (
                  <Card
                    key={index}
                    className="rounded-[48px] max-md:rounded-[38px] mt-6   bg-white  group shadow-none border-1 border-[#0000000f]"
                    style={{
                      boxShadow: "0px 3px 7px 3px rgba(0, 0, 0, 0.09)",
                    }}
                  >
                    <CardBody className="p-1.5 max-md:p-1.5 max-md:gap-2">
                      <Card
                        className="rounded-[40px] max-md:rounded-[30px] box-shadow"
                        style={{
                          background: itemMain.gradiendt,
                        }}
                      >
                        <CardBody className="p-7 max-md:p-5 max-lg:p-6 flex flex-col justify-between ">
                          <div className="">
                            <div key={index}>
                              <div className="border border-[#00000014] bg-white rounded-xl p-2 w-fit ">
                                <img
                                  src={itemMain.icon}
                                  alt="behance Logo"
                                  className="w-[40px] grayscale "
                                />
                              </div>
                              <p className="text-xl max-md:text-base font-[700]">
                                {item.heading}
                              </p>
                              <p className="text-base max-md:text-base font-[500]  py-2">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LookingFor;
