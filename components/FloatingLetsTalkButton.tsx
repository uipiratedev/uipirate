"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

const FloatingLetsTalkButton = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Detect when footer is visible
  useEffect(() => {
    const footer = document.querySelector("footer");
    
    if (!footer) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsFooterVisible(entry.isIntersecting);
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of footer is visible
      }
    );

    observer.observe(footer);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Hide button if not scrolled enough OR if footer is visible
  if (!showButton || isFooterVisible) return null;

  return (
    <Link
      className="fixed bottom-3 left-1/2 z-[999999] -translate-x-1/2 transition-opacity duration-500"
      href="/contact"
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
          ${isHovered ? "scale-110 bg-black" : "scale-100"}
          max-md:px-3 max-md:py-1
        `}
        style={{
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <span className="text-xl">😀</span>
        <span className="font-bold text-base max-md:text-sm whitespace-nowrap">
          Let&apos;s Talk
        </span>
      </div>
    </Link>
  );
};

export default FloatingLetsTalkButton;
