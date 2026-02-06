import GlassBadge from "@/components/GlassBadge";
import React, { useEffect, useRef, useState } from "react";

const LandingWhoWeAre = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const text = "UI Pirate is a global UI/UX Design & Development Studio, helping SaaS founders & enterprise teams build high-performing products that ships faster️, looks premium, and scales without design debt.";
  const words = text.split(" ");

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const element = containerRef.current;
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Start animation when element is 70% into viewport
      const startPoint = windowHeight * 0.7;
      const endPoint = windowHeight * 0.3;
      
      if (rect.top <= startPoint && rect.top >= endPoint) {
        // Calculate progress (0 to 1)
        const progress = 1 - ((rect.top - endPoint) / (startPoint - endPoint));
        setScrollProgress(Math.min(Math.max(progress, 0), 1));
      } else if (rect.top < endPoint) {
        setScrollProgress(1);
      } else {
        setScrollProgress(0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate which words should be revealed based on scroll progress
  const getWordStyle = (index: number) => {
    const totalWords = words.length;
    const wordProgress = (index / totalWords);
    
    // Each word reveals when scroll progress reaches its threshold
    const isRevealed = scrollProgress >= wordProgress;
    
    // Smooth transition for the word being revealed
    const revealProgress = Math.min(Math.max((scrollProgress - wordProgress) * totalWords, 0), 1);
    
    // Interpolate from light gray to black
    const r = Math.round(209 - (209 * revealProgress));
    const g = Math.round(213 - (213 * revealProgress));
    const b = Math.round(219 - (219 * revealProgress));
    const opacity = 0.3 + (0.7 * revealProgress);
    
    return {
      color: isRevealed ? `rgb(${r}, ${g}, ${b})` : 'rgb(209, 213, 219)',
      opacity: isRevealed ? opacity : 0.3,
      transition: 'color 0.3s ease-out, opacity 0.3s ease-out',
      display: 'inline-block',
      marginRight: '0.25em'
    };
  };

  return (
    <>
      <div className="container mx-auto xl:px-40 2xl:px-48 max-md:px-4 pt-32 max-md:pt-24 max-xl:px-4 max-2xl:px-0">
        <div className="autoShow">
          <div className="flex flex-row items-center justify-center mb-6 max-md:mb-0">
            <GlassBadge variant="gradient">WHO we are</GlassBadge>
          </div>
        </div>
      </div>
      <div className="px-32 max-md:px-4 overflow-x-hidden overflow-y-auto pb-20" ref={containerRef}>
        <h2 className="heading-center max-md:text-2xl">
          {words.map((word, index) => (
            <span key={index} style={getWordStyle(index)}>
              {word}
            </span>
          ))}
        </h2>
      </div>
    </>
  );
};

export default LandingWhoWeAre;
