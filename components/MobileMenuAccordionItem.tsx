"use client";

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
  index: number;
  isOpen: boolean;
  onToggle: (index: number) => void;
  setIsMenuOpen: (isOpen: boolean) => void;
}

export const MobileMenuAccordionItem = ({
  item,
  index,
  isOpen,
  onToggle,
  setIsMenuOpen,
}: MobileMenuAccordionItemProps) => {
  const hasDropdown = item.hasDropdown && item.dropdownItems && item.dropdownItems.length > 0;

  const handleRowClick = (e: React.MouseEvent) => {
    if (hasDropdown) {
      e.preventDefault();
      onToggle(index);
    } else {
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="flex flex-col border-b border-gray-100 last:border-none">
      <div
        className="flex items-center justify-between py-4 cursor-pointer"
        onClick={handleRowClick}
      >
        <NextLink
          className="text-lg text-foreground font-semibold flex-1"
          href={hasDropdown ? "#" : item.href}
          onClick={(e) => {
            if (hasDropdown) e.preventDefault();
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
              onToggle(index);
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

      {/* @ts-ignore */}
      <AnimatePresence mode="wait">
        {isOpen && hasDropdown && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-3 pb-4 pl-4">
              {item.dropdownItems!.map((dropdownItem, idx) => (
                <NextLink
                  key={idx}
                  className="text-base text-zinc-500 transition-colors flex items-center gap-2 py-1 hover:text-black"
                  href={dropdownItem.href || "#"}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {dropdownItem.category}
                </NextLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
