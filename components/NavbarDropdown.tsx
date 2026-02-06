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
  const largeCards = items.filter((item) => item.isLargeCard);
  const listItems = items.filter((item) => !item.isLargeCard);

  return (
    <div
      className="!static h-full w-full flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger Button */}
      <button
        className={clsx(
          "flex items-center gap-1 text-sm font-[500] cursor-pointer transition-all duration-200 hover:font-[600] h-full px-1",
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
            <motion.div
              key="dropdown-menu"
              initial={{ opacity: 0, y: 10, scale: 0.95, x: "-50%" }}
              animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
              exit={{ opacity: 0, y: 10, scale: 0.95, x: "-50%" }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              className="fixed left-1/2 top-[85px] z-[99999] w-[calc(100vw-20rem)] max-2xl:w-[calc(100vw-24rem)] max-xl:w-[calc(100vw-12rem)] max-lg:w-[calc(100vw-6rem)] max-md:w-full"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="bg-[#121212]/95 backdrop-blur-3xl rounded-[32px] p-5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] border border-white/10 overflow-hidden ring-1 ring-white/5">
                <div className={clsx(
                  "grid gap-4",
                  largeCards.length > 0 ? "grid-cols-1 md:grid-cols-12" : "grid-cols-1"
                )}>
                  {/* Left Side - Main Feature Cards (cols 1-8) */}
                  {largeCards.length > 0 && (
                    <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {largeCards.map((item, index) => (
                        <NextLink
                          key={index}
                          className="group relative aspect-[4/3] rounded-[24px] overflow-hidden bg-zinc-900/50 border border-white/5 transition-transform duration-500 hover:scale-[1.02]"
                          href={item.href || "#"}
                          onClick={() => setIsOpen(false)}
                        >
                          {/* Background Image / Placeholder */}
                          <div 
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                            style={{ 
                              backgroundImage: `url('https://images.unsplash.com/photo-${index === 0 ? "1586717791821-3f44a563feaf" : "1520110120287-cbb5934001b3"}?auto=format&fit=crop&q=80&w=800')`,
                              filter: 'brightness(0.6)'
                            }}
                          />
                          
                          {/* Overlay Gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                          
                          <div className="absolute inset-0 p-6 flex flex-col justify-end">
                            <h3 className="text-white font-bold text-xl mb-1 group-hover:translate-x-1 transition-transform duration-300">
                              {item.category}
                            </h3>
                            <p className="text-zinc-300 text-sm line-clamp-2 group-hover:text-white transition-colors duration-300">
                              {item.icon} Explore our expertise in {item.category.toLowerCase()}.
                            </p>
                          </div>
                        </NextLink>
                      ))}
                    </div>
                  )}

                  {/* Right Side - List Items (cols 9-12 or full width) */}
                  <div className={clsx(
                    "flex flex-col gap-2",
                    largeCards.length > 0 ? "md:col-span-4" : "w-full"
                  )}>
                    <div className="flex flex-col gap-2 h-full">
                      {listItems.map((item, index) => (
                        <NextLink
                          key={index}
                          className="flex items-center gap-4 p-4 rounded-[20px] bg-white/5 hover:bg-white/10 border border-white/5 transition-all duration-300 group"
                          href={item.href || "#"}
                          onClick={() => setIsOpen(false)}
                        >
                          <div className="w-10 h-10 rounded-[12px] bg-zinc-800 flex items-center justify-center text-lg group-hover:bg-zinc-700 border border-white/5 transition-colors shrink-0">
                            {item.icon || "🔗"}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-white font-semibold text-[14px] group-hover:text-orange-400 transition-colors truncate">
                              {item.category}
                            </span>
                            <span className="text-zinc-500 text-[12px] group-hover:text-zinc-400 transition-colors truncate">
                              {item.category.includes('Blog') ? 'Latest updates' : 'Learn more'}
                            </span>
                          </div>
                        </NextLink>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>,
        document.body
      ) as unknown as ReactNode)}
    </div>
  );
};
