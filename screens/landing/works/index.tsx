import React from "react";

import RecentWorkCard from "./workCard";

const LandingWork = () => {
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
        <div className="flex flex-row items-center justify-center">
          <a
            href="https://www.behance.net/vishalanand-UI-UX"
            rel="noreferrer"
            target="_blank"
          >
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
