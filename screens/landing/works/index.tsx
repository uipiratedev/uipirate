import React, { useState } from "react";
import { Tabs, Tab, Button } from "@nextui-org/react";
import RecentWorkCard from "./workCard";

const LandingWork = () => {
  const [activeTab, setActiveTab] = useState("Hourly"); // Track active tab

  const tabs = [
    {
      id: "Hourly",
      label: "Hourly",
    },
    {
      id: "Fixed",
      label: "Fixed",
    },
  ];

  return (
    <>
      <div className="container mx-auto xl:px-40 2xl:px-48 max-md:px-4 pt-32 max-md:pt-24 max-xl:px-4 max-2xl:px-0">
        <div className="autoShow">
          <div className="flex flex-row items-center justify-center mb-6">
            <span className="bg-[#8EF1F1] px-4 py-2 rounded-xl font-semibold uppercase border-cyan-400 border-2">
              Works
            </span>
          </div>
          <p className="heading-center">Recent Works</p>
          <div className="flex flex-row items-center justify-center mb-8 mt-3 px-40 max-lg:px-32 max-md:px-8 max-xl:px-32 ">
            <p className="md:w-3/4 text-center content-center font-[500] ">
              In the world of creativity, clients consistently appreciate our
              work and value the results we deliver.
            </p>
          </div>
        </div>
      </div>
      <div className="px-32 max-md:px-4 overflow-x-hidden overflow-y-auto pb-20 pt-48 max-md:pt-12">
        <RecentWorkCard />
      </div>
      <div>
        {/* <p
          className="text-center mb-6"
          style={{
            fontFamily: "Caveat, sans-serif",
          }}
        >
          Case Studies Coming Soon…
        </p> */}
        {/* <div className="flex flex-row items-center justify-center">
          <a href="https://www.behance.net/vishalanand-UI-UX" target="_blank">
            <Button
              color="primary"
              className="bg-black button text-lg dark:bg-white dark:text-black px-[70px] py-[30px] cursor-pointer"
            >
              Explore Works
            </Button>
          </a>
        </div> */}
        {/* test button */}
        {/* <div className="flex flex-row items-center justify-center">
          <button className="group relative overflow-hidden rounded bg-black text-white transition-all duration-300 ease-out hover:bg-gradient-to-r hover:from-black hover:to-gray-500   button text-lg dark:bg-white dark:text-black px-[70px] py-[30px] cursor-pointer">
            <span className="ease absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 transform bg-white opacity-10 transition-all duration-700 group-hover:-translate-x-40"></span>
            <span className="relative">Button Text</span>
          </button>
        </div> */}
        {/* <div className="flex flex-row items-center justify-center">
          <div className="button-container-1 animate__animated animate__fadeInUp animate__slow animate__delay-4s w-[150px] bg-black">
            <span className="mas">Explore Works</span>
            <button id="work" type="button" name="Hover">
              Seen More!
            </button>
          </div>
        </div> */}
        <div className="flex flex-row items-center justify-center">
          <a href="https://www.behance.net/vishalanand-UI-UX" target="_blank">
            {/* <button className="buttonre bg-black button text-lg dark:bg-white dark:text-black px-[70px] py-[30px] cursor-pointer">
            <span className="button-text see-more">See More</span>
            <a href="https://www.behance.net/vishalanand-UI-UX" target="_blank">
              <span className="button-text recent-work">Explore Works</span>
            </a>
          </button> */}

            <button
              color="primary"
              className="mt-3 bg-black text-white  px-[40px]  py-[16px] rounded-[20px] group"
              // style={{ width: "100%" }}
            >
              <div className="flex flex-col items-center justify-center max-h-[24px] overflow-hidden">
                <span
                  className={`text-white text-lg transition-transform duration-300 ease-in-out transform flex flex-row items-center gap-x-3 
                                
                                 group-hover:translate-y-[50px] translate-y-3
                                
                               `}
                >
                  See More
                </span>

                <span
                  className={`text-white text-lg  transition-transform duration-300 ease-in-out transform flex flex-row items-center gap-3
                                
                                translate-y-[50px] group-hover:-translate-y-3
                                
                               
                              
                              
                              `}
                >
                  Recent Works
                </span>
              </div>
            </button>
          </a>
        </div>
      </div>
    </>
  );
};

export default LandingWork;
