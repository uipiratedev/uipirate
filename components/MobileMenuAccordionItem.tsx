"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NextLink from "next/link";
import clsx from "clsx";

interface DropdownItem {
  category: string;
  icon?: string;
  href?: string;
}

interface NavItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
  dropdownItems?: DropdownItem[];
}

interface MobileMenuAccordionItemProps {
  item: NavItem;
  setIsMenuOpen: (isOpen: boolean) => void;
}

export const MobileMenuAccordionItem = ({
  item,
  setIsMenuOpen,
}: MobileMenuAccordionItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasDropdown = item.hasDropdown && item.dropdownItems && item.dropdownItems.length > 0;

  const toggleAccordion = (e: React.MouseEvent) => {
    if (hasDropdown) {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else {
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="flex flex-col border-b border-white/5 last:border-none">
      <div 
        className="flex items-center justify-between py-4 cursor-pointer"
        onClick={toggleAccordion}
      >
        <NextLink
          className="text-lg text-foreground font-semibold flex-1"
          href={hasDropdown ? "#" : item.href}
          onClick={(e) => {
            if (hasDropdown) e.preventDefault(); // Prevent navigation if it's an accordion trigger
            else setIsMenuOpen(false);
          }}
        >
          {item.label}
        </NextLink>
        
        {hasDropdown && (
          <button 
            type="button" 
            className="p-1"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
          >
            <svg
              className={clsx("w-4 h-4 transition-transform duration-300", {
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
        )}
      </div>

      <>
        {/* @ts-ignore - AnimatePresence type issue with TypeScript strict mode */}
        <AnimatePresence mode="wait">
          {isOpen && hasDropdown && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-3 pb-4 pl-4">
                {item.dropdownItems!.map((dropdownItem, index) => (
                  <NextLink
                    key={index}
                    className="text-base text-zinc-400  transition-colors flex items-center gap-2 py-1"
                    href={dropdownItem.href || "#"}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {/* {dropdownItem.icon && <span className="text-sm">
                      <img src={dropdownItem.icon} alt="" className="w-4 h-4 grayscale" />
                      </span>} */}
                    {dropdownItem.category}
                  </NextLink>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    </div>
  );
};
