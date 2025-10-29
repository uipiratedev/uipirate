import React from "react";

function VisionToLife() {
  return (
    <div className="relative w-full z-0 h-[100vh] flex justify-center items-center overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="/bannervideo.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Dark Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/0 backdrop-blur-sm"></div>

      {/* Center Form / CTA Card */}
      <form className="relative z-10 w-[100%] h-[400px]  max-md:h-[450px] max-md:w-[90%] max-w-[550px] bg-white/10 backdrop-blur-xl border border-white/30 rounded-3xl shadow-black flex flex-col items-center justify-center gap-[20px] px-[20px] text-center">
        <h1 className=" text-5xl max-md:text-3xl font-semibold leading-snug">
          Ready to bring your <br /> vision to life?
        </h1>

        <p className=" text-[18px] font-[400] max-w-[350px] mb-0">
          Schedule a call or send us a WhatsApp message, and let’s get started!
        </p>

        <div className="flex flex-row max-md:flex-col justify-center gap-4 mt-4 text-center">
          {/* <a
            href="https://cal.com/vishal-anand/introduction-and-free-ui-ux-strategy-session"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black text-white text-center px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:scale-105 transition-transform duration-300"
          >
            😀 Let’s Talk
          </a> */}
          <a
            href="https://cal.com/vishal-anand/introduction-and-free-ui-ux-strategy-session"
            target="_blank"
            className="w-[250px] max-lg:mt-3 lg:ml-3 hover:scale-105 transition-transform duration-300"
          >
            <div className="  bg-black text-white rounded-xl h-auto transform transition-all duration-[600ms] ease-in-out px-6 py-4 flex flex-row items-center justify-center gap-3 relative">
              😀 Let’s Talk
            </div>
          </a>
          <a
            href="https://wa.me/919708636151"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-black px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:scale-105 transition-transform duration-300"
          >
            <img
              src="https://res.cloudinary.com/damm9iwho/image/upload/v1729511358/whatsapp_zssebt.svg"
              alt="WhatsApp"
              className="h-[22px]"
            />
            Chat on WhatsApp
          </a>
        </div>
      </form>
    </div>
  );
}

export default VisionToLife;
