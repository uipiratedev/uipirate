"use client";

import { Fragment, useState, useRef, useEffect, ReactNode } from "react";
import { createPortal } from "react-dom";
import NextLink from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

interface DropdownItem {
  category: string;
  icon?: string;
  href?: string;
  isLargeCard?: boolean;
}

interface NavbarDropdownProps {
  label: string;
  items: DropdownItem[];
  isDarkSection?: boolean;
  isServicesMenu?: boolean;
}

export const NavbarDropdown = ({
  label,
  items,
  isDarkSection = false,
  isServicesMenu = false,
}: NavbarDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  // Separate large cards (left) and list items (right) for Services menu
  // Logic for distributing cards
  const allLargeCards = items.filter((item) => item.isLargeCard);
  const regularListItems = items.filter((item) => !item.isLargeCard);
  
  // If exactly 4 large cards, show them all in a row. 
  // If more than 4, show 3 and push rest to right.
  // If less than 4, standard behavior.
  const showFourRow = allLargeCards.length === 4;

  const displayLargeCards = showFourRow 
    ? allLargeCards 
    : (allLargeCards.length > 4 ? allLargeCards.slice(0, 3) : allLargeCards);

  const displayRightItems = [
    ...(showFourRow ? [] : allLargeCards.slice(3)), // If >4, surplus goes here. If 4, none go here.
    ...regularListItems
  ];

  return (
    <div
      className="!static h-full w-full flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger Button */}
      <button
        className={clsx(
          "flex items-center gap-1 text-base font-[500] cursor-pointer transition-all duration-200 hover:font-[600] h-full px-1",
          {
            "text-white": isDarkSection,
            "text-black": !isDarkSection,
          },
        )}
      >
        {label}
        <svg
          className={clsx("w-4 h-4 transition-transform duration-200", {
            "rotate-180": isOpen,
          })}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M19 9l-7 7-7-7"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
      </button>

      {/* Dropdown Menu - Portal to Body to escape overflow/stacking contexts */}
      {mounted && typeof document !== "undefined" && (createPortal(
        /* @ts-ignore - AnimatePresence type issue with TypeScript strict mode */
        <AnimatePresence mode="wait">
          {isOpen ? (
            <div className="fixed left-0 right-0 top-[68px] z-[99999]">
              <div className="container mx-auto">
                <motion.div
                  key="dropdown-menu"
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                  className="mx-auto px-32 lg:px-20 max-md:px-4"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
              <div 
                className="relative isolate overflow-hidden rounded-[28px] p-3 border border-white/50"
                style={{
                  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(252, 252, 253, 0.94) 100%)",
                  WebkitBackdropFilter: "blur(20px) saturate(180%) brightness(105%)",
                  backdropFilter: "blur(20px) saturate(180%) brightness(105%)",
                  boxShadow: "0 8px 32px -4px rgba(0, 0, 0, 0.12), 0 20px 60px -12px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 1), inset 0 -1px 0 rgba(255, 255, 255, 0.7)"
                }}
              >
                {/* Frosted glass texture overlay */}
                 <div
                  className="absolute inset-0 pointer-events-none z-0"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.6) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(245, 248, 255, 0.3) 0%, transparent 50%)",
                    mixBlendMode: "soft-light",
                  }}
                />
                
                <div className={clsx(
                  "flex flex-col gap-4", // Always flex-col on mobile
                  showFourRow ? "md:flex-col" : "md:flex-row" // If 4-row, stack vertically (cards full width, list items below). Else side-by-side.
                )}>
                  {/* Left Side - Main Feature Cards */}
                  {displayLargeCards.length > 0 && (
                    <div className={clsx(
                      "grid gap-3 self-stretch",
                       showFourRow ? "w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-4" : "md:w-2/3 grid-cols-1 sm:grid-cols-3"
                    )}>
                      {displayLargeCards.map((item, index) => (
                        <NextLink
                          key={index}
                          className={clsx(
                            "group relative rounded-[24px] overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 transition-all duration-500 hover:scale-[1.02] hover:border-white/20 hover:shadow-xl hover:shadow-black/20 noise-texture h-full",
                            showFourRow ? "aspect-[16/10]" : "aspect-[4/3]" // Use flatter aspect ratio for 4-col layout to reduce height
                          )}
                          href={item.href || "#"}
                          onClick={() => setIsOpen(false)}
                        >
                          {/* Background Image / Placeholder */}
                          <div 
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                            style={{ 
                              // backgroundImage: `url('https://images.unsplash.com/photo-${index === 0 ? "1586717791821-3f44a563feaf" : "1520110120287-cbb5934001b3"}?auto=format&fit=crop&q=80&w=800')`,
                              // filter: 'brightness(0.6)',
                              background: "linear-gradient(340.36deg, #F5F5F5 39.57%, #E0E0E0 89.85%)",
                            }}
                          />
                          
                          {/* Overlay Gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                          
                          <div className="absolute inset-0 p-6 flex flex-col justify-end">
                            <h3 className="text-gray-900 font-semibold text-lg group-hover:translate-x-1 transition-transform duration-300">
                              {item.category}
                            </h3>
                           
                          </div>
                        </NextLink>
                      ))}
                    </div>
                  )}

                  {/* Right Side - List Items & Overflow Large Cards */}
                  {displayRightItems.length > 0 && (
                    <div className={clsx(
                      "flex flex-col gap-2",
                      showFourRow ? "w-full mt-4" : (displayLargeCards.length > 0 ? "md:w-1/3" : "w-full"),
                      "self-stretch" // Ensure it stretches to match height
                    )}>
                    <div className={clsx(
                      "flex gap-2 h-full",
                      showFourRow ? "flex-row flex-wrap" : "flex-col justify-between"
                    )}>
                      {displayRightItems.map((item, index) => (
                        <NextLink
                          key={index}
                          className={clsx(
                            "flex items-center gap-4 p-1 rounded-[12px] bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 transition-all duration-300 group",
                            showFourRow ? "w-auto" : "flex-1" // Added flex-1 to distribute height only in column mode
                          )}
                          href={item.href || "#"}
                          onClick={() => setIsOpen(false)}
                          style={{
                           // background: "linear-gradient(340.36deg, rgba(21, 21, 20, 0.4) 39.57%, rgba(33, 33, 33, 0.4) 89.85%),linear-gradient(340.36deg, #151514 39.57%, #212121 89.85%)",
                          }}
                        >
                          <div className="w-8 h-8 rounded-[8px] bg-white text-gray-700 flex items-center justify-center text-lg group-hover:bg-orange-50 group-hover:text-orange-600 border border-gray-200 group-hover:border-orange-200 transition-all shrink-0">
                            {item.icon ? (
                              <img src={item.icon} alt={item.category} className="w-4 h-4 invert" />
                            ) : (
                              // Fallback if large card moved here and has no icon property suited for this view, or re-use existing logic
                              <div className="w-4 h-4 bg-gray-400 rounded-full" /> 
                            )}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-gray-900 font-semibold text-[14px] group-hover:text-orange-600 transition-colors truncate">
                              {item.category}
                            </span>
                            
                          </div>
                        </NextLink>
                      ))}
                    </div>
                  </div>
                )}
                </div>
                  </div>
                </motion.div>
              </div>
            </div>
          ) : null}
        </AnimatePresence>,
        document.body
      ) as unknown as ReactNode)}
    </div>
  );
};
