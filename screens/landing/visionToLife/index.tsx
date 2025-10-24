import React from "react";

function VisionToLife() {
  return (
    <div className="relative w-full h-[100vh] flex justify-center items-center overflow-hidden">
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
      <form className="relative z-10 w-[90%] h-[500px] max-w-[500px] bg-white/10 backdrop-blur-xl border border-white/30 rounded-3xl shadow-black flex flex-col items-center justify-center gap-[20px] px-[20px] text-center">
        <h1 className=" text-[32px] font-semibold mb-[20px] leading-snug">
          Ready to bring your <br /> vision to life?
        </h1>

        <p className=" text-[18px] font-[400] max-w-[350px] mb-[20px]">
          Schedule a call or send us a WhatsApp message, and let’s get started!
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <a
            href="https://cal.com/vishal-anand/introduction-and-free-ui-ux-strategy-session"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 hover:scale-105 transition-transform duration-300"
          >
            <img
              src="https://res.cloudinary.com/damm9iwho/image/upload/v1730289917/Frame_1984078767_sjyim4.svg"
              alt="call"
              className="h-[22px]"
            />
            Book a 15-min call
          </a>

          <a
            href="https://wa.me/919708636151"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-black px-6 py-3 rounded-full font-semibold flex items-center gap-2 hover:scale-105 transition-transform duration-300"
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
