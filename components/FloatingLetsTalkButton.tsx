"use client";
import { useState, useEffect } from "react";

const FloatingLetsTalkButton = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!showButton) return null;

  return (
    <a
      href="https://wa.me/919708636151"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-3 left-1/2 z-[9999] -translate-x-1/2 transition-opacity duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`
          backdrop-blur-md bg-[rgba(0,0,0,0.45)] border border-white/20
          text-white rounded-xl px-8 py-3
          shadow-lg hover:shadow-2xl
          transform transition-all duration-300 ease-in-out
          flex items-center gap-3
          ${isHovered ? "scale-110 bg-white/20" : "scale-100"}
          max-md:px-6 max-md:py-3
        `}
        style={{
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <span className="text-xl">😀</span>
        <span className="font-bold text-base max-md:text-sm whitespace-nowrap">
          Let's Talk
        </span>
      </div>
    </a>
  );
};

export default FloatingLetsTalkButton;
