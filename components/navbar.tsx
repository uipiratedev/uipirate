"use client";

import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { link as linkStyles } from "@nextui-org/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { useEffect, useState } from "react";

import { siteConfig } from "@/config/site";

export const Navbar = () => {
  const [isDarkSection, setIsDarkSection] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showBanner, setShowBanner] = useState(true);
  const [announcement, setAnnouncement] = useState(""); // For screen reader announcements

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);

    return () => clearTimeout(timer);
  }, []);

  // Handle Escape key to close mobile menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
        setAnnouncement("Menu closed");
        setTimeout(() => setAnnouncement(""), 1000);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMenuOpen]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const isInView = entries.some((entry) => entry.isIntersecting);

        setIsDarkSection(isInView);
      },
      { threshold: 0.1 }
    );

    const darkSections = document.querySelectorAll(".dark-section");

    darkSections.forEach((section) => observer.observe(section));

    return () => {
      darkSections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  return (
    <>
      {/* ✅ Banner with Close Icon */}
      {showBanner && (
        <div className="relative bg-[#059669] text-center border-b border-gray-200">
          <div className="h-[40px] flex items-center justify-center px-10">
            <p className="text-sm font-medium text-white flex items-center justify-center gap-2">
              <span className="hidden md:inline">
                Learn real product skills with mentorship at{" "}
              </span>
              <a
                className="text-white font-bold"
                href="https://propirates.com"
                rel="noreferrer"
                target="_blank"
              >
                ProPirates →
              </a>
            </p>

            {/* Close Icon */}
            <button
              aria-label="Close banner"
              className="absolute right-4 text-gray-500 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-600 rounded transition-all"
              onClick={() => {
                setShowBanner(false);
                setAnnouncement("Banner dismissed");
                setTimeout(() => setAnnouncement(""), 1000);
              }}
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 18L18 6M6 6l12 12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ✅ Navbar */}
      <div className="container mx-auto h-[67px] reveal-text-anim-1 overflow-hidden pb-6 relative z-[99999999] max-md:bg-[#F5F5F5]">
        {!loading && (
          <NextUINavbar
            className={clsx(
              "bg-none mx-[25rem] blur-none py-0 w-auto px-0 max-md:-pb-3 max-lg:mx-20 max-md:mx-0 max-xl:mx-40 max-2xl:mx-[18rem] border-2 container flex flex-row items-center rounded-2xl max-md:rounded-none max-md:border-none max-md:pt-1 sticky top-0 mt-3 max-md:mt-0 h-[55px] bg-transparent z-[99999999]",
              { "text-white": isDarkSection, "text-black": !isDarkSection }
            )}
            isMenuOpen={isMenuOpen}
            maxWidth="xl"
            position="sticky"
            style={{ zIndex: 99999999 }}
            onMenuOpenChange={setIsMenuOpen}
          >
            {/* --- Left Brand Section --- */}
            <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
              {/* --- Mobile Section with Toggle --- */}
              <NavbarContent
                className="flex md:hidden basis-1 -ml-2"
                justify="start"
              >
                <NavbarMenuToggle
                  aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                  className="text-current"
                />
              </NavbarContent>
              <NavbarBrand as="li" className="gap-3 max-w-fit">
                <NextLink
                  className="flex justify-start items-center gap-1 md:-ml-6 max-sm:-ml-6"
                  href="/"
                >
                  <img
                    alt="UI Pirate - Enterprise UI/UX Design Agency Logo"
                    className="mt-2"
                    src="https://res.cloudinary.com/damm9iwho/image/upload/v1729862847/Div_framer-bfl99f_v7cltn.svg"
                  />
                  <p
                    className={clsx("font-bold text-inherit", {
                      "text-white": isDarkSection,
                      "text-black": !isDarkSection,
                    })}
                  >
                    UI Pirates
                  </p>
                </NextLink>
              </NavbarBrand>
            </NavbarContent>

            {/* --- Center Navigation Links --- */}
            <NavbarContent className="basis-1/5 sm:basis-full" justify="center">
              <ul className="hidden lg:flex gap-0 justify-start ml-0">
                {siteConfig.navItems.map((item) => (
                  <NavbarItem
                    key={item.href}
                    className="hover:bg-[#E9E9E9] px-2 rounded-[0.65rem] pb-[4px] hover:font-[700]"
                  >
                    <NextLink
                      className={clsx(
                        linkStyles({ color: "foreground" }),
                        "data-[active=true]:text-primary data-[active=true]:font-medium text-sm font-[500] cursor-pointer"
                      )}
                      href={item.href}
                    >
                      {item.label}
                    </NextLink>
                  </NavbarItem>
                ))}
              </ul>
            </NavbarContent>

            {/* --- Right Button --- */}
            <NavbarContent className=" basis-1/5 sm:basis-full" justify="end">
              <NavbarItem>
                <Button
                  as={NextLink}
                  href="/contact"
                  className=" text-sm font-[500] text-white bg-black pt-0 dark:bg-white dark:text-black -mr-4 mt-[0.1rem]"
                  data-back="Let's Talk"
                  data-front="Have an Idea?"
                  style={{ paddingTop: 0 }}
                  variant="solid"
                >
                  <span aria-hidden="true">😀</span> Let's Talk
                </Button>
              </NavbarItem>
            </NavbarContent>

            {/* ARIA Live Region for Screen Reader Announcements */}
            <div aria-live="polite" aria-atomic="true" className="sr-only">
              {announcement}
            </div>

            {/* --- Mobile Menu Content --- */}
            <NavbarMenu>
              <div className="mx-0 mt-3 flex flex-col gap-4">
                {siteConfig.navMenuItems.map((item, index) => (
                  <NavbarMenuItem key={`${item}-${index}`}>
                    <NextLink
                      className="text-lg text-foreground cursor-pointer"
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </NextLink>
                  </NavbarMenuItem>
                ))}
              </div>
            </NavbarMenu>
          </NextUINavbar>
        )}
      </div>
    </>
  );
};
