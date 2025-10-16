import React, { useState } from "react";
import Slider from "react-slick";
import { Card, CardBody } from "@nextui-org/react";

const clients = [
  {
    name: "Eden Hazani",
    occupation: "VP Research and Development",
    location: "New York, USA",
    review:
      "Wonderful to work with, very experienced with UI/UX design. Was very open to work in the flow we requested that required actual Angular coding from his team as well, and stood up to the challenge of working with a remote team in different timezones. Successfully overhauled the design of our entire platform in less than 3 months both as visual designs on Figma and mock Angular code on github.",
    satisfactionScore: 10,
    company: "Xperiti",
    projects: [],
    profileImage:
      "https://res.cloudinary.com/damm9iwho/image/upload/v1731064807/xperiti_we7cq0.svg",
    logo: "https://res.cloudinary.com/damm9iwho/image/upload/v1729513137/image_1_hxpv8e.svg",
  },
  // {
  //   name: "Luis",
  //   occupation: "",
  //   location: "",
  //   review:
  //     "The team has been incredible in developing our SaaS web app. They have a clear understanding of our needs and have created a platform that is intuitive, scalable, and perfectly aligned with our vision. We’re excited for what the future holds with this partnership.",
  //   satisfactionScore: 10,
  //   company: "Amuzn",
  //   projects: [],
  //   profileImage:
  //     "https://res.cloudinary.com/damm9iwho/image/upload/v1731065510/Ellipse_1388_od4ab3.svg",
  //   logo: "https://res.cloudinary.com/damm9iwho/image/upload/v1729513137/image_29_fxjqk6.svg",
  // },
  {
    name: "Aman Sharma",
    occupation: "Founder",
    location: "New Delhi India",
    review:
      "UiPirate turned our messy Shopify wishlist into a clean, working store. Custom features? Solid. Backend? Easy. They kept it simple, fast, and actually cared about making it work. Big win for us.",
    satisfactionScore: 10,
    company: "Godrics",
    projects: [],
    profileImage:
      "https://res.cloudinary.com/damm9iwho/image/upload/v1731065510/Ellipse_1388_od4ab3.svg",
    logo: "https://res.cloudinary.com/damm9iwho/image/upload/v1729513138/image_5_s1yrux.svg",
  },
  {
    name: "Pankaj Soni",
    occupation: "President",
    location: "Jharkhand, India",
    review:
      "Vishal and the team didn’t just build us a site, they helped Mission Blue tell our story better. Their design work during our winter campaign really helped us reach people we couldn’t before. You can feel their heart in the details.",
    satisfactionScore: 10,
    company: "Mission Blue Foundation",
    projects: [],
    profileImage:
      "https://res.cloudinary.com/damm9iwho/image/upload/v1731162245/pankaj-soni-qm3tjj21p3eewy070apjjpyzrymt41qib2tdndac22_w8ajyw.jpg",
    logo: "https://res.cloudinary.com/damm9iwho/image/upload/v1729513138/image_31_sdh5l7.svg",
  },
  {
    name: "Priyanka",
    occupation: "Co-Founder",
    location: "Maharashtra, India",
    review:
      "We recently worked with Vishal on a UI/UX assignment to revamp our landing page with the goal of improving our website’s conversion rate. Vishal demonstrated exceptional flexibility, reliability, and strategic insight throughout the project.What stood out most was his ability to truly understand our brand’s identity and target persona. ",
    satisfactionScore: 10,
    company: "Rings & I",
    projects: [],
    profileImage:
      "https://res.cloudinary.com/damm9iwho/image/upload/v1731162302/priyanka_humj3w.jpg",
    logo: "https://res.cloudinary.com/damm9iwho/image/upload/v1729682150/Rings_I_eyrgog.svg",
  },
  {
    name: "Rohit Kumar Jha",
    occupation: "Co-Founder",
    location: "Bangalore, India",
    review:
      "I'm amazed at how the team brought our complex AI trading vision to life. Not only did they nail the website design, but their work on Brahmastra - our AI trading platform - was outstanding. Their deep understanding of both design and technical requirements helped create a sophisticated tool that makes algo-trading accessible to our users. Vishal's team never backed down from the complex data visualization challenges, and the multiple iterations really perfected the user experience.",
    satisfactionScore: 10,
    company: "ArthAlpha, Brahmastra",
    projects: [],
    profileImage:
      "https://res.cloudinary.com/damm9iwho/image/upload/v1731064807/arth_xpceb3.svg",
    logo: "https://res.cloudinary.com/damm9iwho/image/upload/v1730790130/728_x_90_copy_6x_uft7ai.svg",
  },
  {
    name: "Nidhi Lal",
    occupation: "CEO and Co-Founder",
    location: "New Delhi, India",
    review:
      "Vishal understood the emotional side of our brand without us over-explaining it. The visuals, the tone, the flow, it just felt like Niya. That kind of sensitivity is rare in creative work.",
    satisfactionScore: 10,
    company: "Niya",
    projects: [],
    profileImage:
      "https://res.cloudinary.com/damm9iwho/image/upload/v1731064807/niya_l38ljv.svg",
    logo: "https://res.cloudinary.com/damm9iwho/image/upload/v1730790130/image_38_udzxkk.svg",
  },
  {
    name: "Akash Pandey",
    occupation: "Chairman",
    location: "Jharkhand, India",
    review:
      "We weren’t just another client to Vishal, he genuinely became part of Yuva Sadan’s mission. The care he showed in getting every small detail right still means a lot to us. Our new identity finally feels like us.",
    satisfactionScore: 10,
    company: "Yuva Sadan",
    projects: [],
    profileImage:
      "https://res.cloudinary.com/damm9iwho/image/upload/v1731064808/yuva_ftd7mq.svg",
    logo: "https://res.cloudinary.com/damm9iwho/image/upload/v1729682151/image_30_oiwlqz.svg",
  },
  {
    name: "Vivek Ranjan Singh",
    occupation: "Founder",
    location: "Jharkhand, India",
    review:
      "From day one, Vishal was hyped about the idea. He managed to make Parivarik TV feel modern without losing the desi soul. Our families love using it, clean UI, solid UX, and it just feels right.",
    satisfactionScore: 10,
    company: "Parivarik TV",
    projects: [],
    profileImage:
      "https://res.cloudinary.com/damm9iwho/image/upload/v1731064808/pari_cecp8e.svg",
    logo: "https://res.cloudinary.com/damm9iwho/image/upload/v1729513140/image_34_rb6475.svg",
  },
];

function ResponsiveCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  var settings = {
    className: "center",
    centerMode: true,
    dots: true,
    speed: 4000,
    autoplaySpeed: 4000,
    slidesToShow: 3,
    slidesToScroll: 3,
    initialSlide: 0,
    autoplay: true,
    infinite: true,
    beforeChange: (current: any, next: React.SetStateAction<number>) =>
      setActiveIndex(next),
    appendDots: (dots: any) => (
      <div
        className="py-4 bg-red-400 w-full"
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ul
          style={{
            margin: "0px",
            color: "red",
            background: "#EDEDED",
            width: "300px",
            paddingTop: "12px",
            borderRadius: "20px",
          }}
        >
          {" "}
          {dots}{" "}
        </ul>
      </div>
    ),

    customPaging: (i: number) => (
      <div
        style={{
          width: "14px",
          height: "14px",
          borderRadius: "50%",
          backgroundColor: i === activeIndex ? "#545454" : "#E2E2E2", // Active and inactive colors
          transition: "background-color ease",
        }}
      ></div>
    ),

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <div className="pt-2 pb-12">
      <Slider {...settings}>
        {clients.map((item, index) => (
          <div className=" mt-8 mb-12 py-12 transform transition-transform duration-300 ">
            <Card
              key={index}
              className={`rounded-[32px] max-md:w-[100%] bg-[#e9e9e9] card-item max-md:rounded-[30px] shadow-none border-1 border-[#0000000f]`}
            >
              <CardBody className="p-3 max-md:p-2 max-lg:p-4">
                <div className="w-full p-5 bg-white rounded-[24px] max-md:p-4 box-shadow">
                  <div className="flex flex-row items-center justify-between gap-4 max-md:gap-2">
                    <div className="flex flex-row gap-3 items-center">
                      <img
                        src={
                          item.profileImage
                            ? item.profileImage
                            : "https://res.cloudinary.com/damm9iwho/image/upload/v1731065510/Ellipse_1388_od4ab3.svg"
                        }
                        // sizes="40px"
                        alt="behance Logo"
                        className="w-[40px] h-[40px] min-w-[40px] min-h-[40px] rounded-full"
                      />
                      <div className="">
                        <p className="text-xl max-md:text-lg font-semibold">
                          {item.name}
                        </p>
                        <p className="text-[#A2A2A2] text-sm -mt-1">
                          {item.occupation ? item.occupation : "occupation"}
                        </p>
                        <p className="text-[#A2A2A2] text-sm -mt-1">
                          {item.location ? item.location : "location"}
                        </p>
                      </div>
                    </div>
                    <div className=" max-md:hidden block">
                      <img
                        src={item.logo}
                        alt="behance Logo"
                        className="max-w-[80px] max-md:max-w-[80px] "
                      />
                    </div>
                  </div>

                  <p className="mt-4 text-sm font-[500]">
                    {item.review ? item.review : ""}
                  </p>
                  <div className="grid grid-cols-2 gap-3 mt-6 max-md:grid-cols-1">
                    <div className=" bg-[#EDEDED] p-3 rounded-xl">
                      <p className="text-base font-semibold mb-1  max-md:text-base">
                        {item.satisfactionScore ? item.satisfactionScore : "0"}
                        /10
                      </p>
                      <p className="text-[#C5C5C5] text-sm">
                        Sactisfaction Score
                      </p>
                    </div>
                    <div className=" bg-[#EDEDED] p-3 rounded-xl">
                      <p className="text-base font-semibold mb-1  max-md:text-base">
                        {item.company ? item.company : ""}
                      </p>
                      <p className="text-[#C5C5C5] text-sm">
                        Projects Worked on
                      </p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default ResponsiveCarousel;
