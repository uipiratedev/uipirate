"use client";

import { useState } from "react";
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

  // Separate large cards (left) and list items (right) for Services menu
  const largeCards = items.filter((item) => item.isLargeCard);
  const listItems = items.filter((item) => !item.isLargeCard);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Trigger Button */}
      <button
        className={clsx(
          "flex items-center gap-1 text-sm font-[500] cursor-pointer transition-all duration-200 hover:font-[600]",
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

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className={clsx(
              "absolute left-1/2 -translate-x-1/2 top-full mt-3 z-50",
              isServicesMenu ? "w-[620px]" : "min-w-[220px]",
            )}
            exit={{ opacity: 0, y: -10 }}
            initial={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-white rounded-[20px] p-3 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-gray-200/80">
              {isServicesMenu ? (
                // Services Menu - Multi-column layout
                <div className="flex gap-2">
                  {/* Left Side - Large Category Cards */}
                  <div className="flex gap-2 flex-1">
                    {largeCards.map((item, index) => (
                      <NextLink
                        key={index}
                        className="flex-1 bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] hover:from-[#252525] hover:to-[#151515] rounded-[14px] p-5 transition-all duration-300 group min-h-[130px] flex flex-col justify-end relative overflow-hidden"
                        href={item.href || "#"}
                      >
                        {/* Subtle gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="text-[13px] text-gray-400 group-hover:text-white font-medium transition-colors leading-snug relative z-10">
                          {item.category}
                        </span>
                      </NextLink>
                    ))}
                  </div>

                  {/* Right Side - List Items with Icons */}
                  <div className="w-[200px] bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-[14px] p-2">
                    <div className="flex flex-col gap-0.5">
                      {listItems.map((item, index) => (
                        <NextLink
                          key={index}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] hover:bg-white/10 transition-all duration-200 group"
                          href={item.href || "#"}
                        >
                          <span className="w-5 h-5 rounded-full bg-gray-800 group-hover:bg-orange-500/20 flex items-center justify-center transition-all duration-200">
                            <svg
                              className="w-2.5 h-2.5 text-gray-500 group-hover:text-orange-400 transition-colors"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                clipRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                fillRule="evenodd"
                              />
                            </svg>
                          </span>
                          <span className="text-[12px] text-gray-400 group-hover:text-white font-medium transition-colors">
                            {item.category}
                          </span>
                        </NextLink>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                // Regular dropdown - Simple list
                <div className="flex flex-col gap-0.5">
                  {items.map((item, index) => (
                    <NextLink
                      key={index}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] hover:bg-gray-100 transition-all duration-200 group"
                      href={item.href || "#"}
                    >
                      {item.icon && (
                        <span className="text-base">{item.icon}</span>
                      )}
                      <span className="text-[13px] text-gray-700 group-hover:text-gray-900 font-medium transition-colors">
                        {item.category}
                      </span>
                    </NextLink>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
