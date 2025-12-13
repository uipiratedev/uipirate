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
      {/* ✅ Banner with Close Icon - Premium Clean Glass Effect */}
      {showBanner && (
        <div
          className="relative text-center border-b border-white/20 isolate glass-texture navbar-glass-light glass-border-light"
          style={{
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0.65) 100%)",
            WebkitBackdropFilter: "blur(28px) saturate(200%) brightness(108%)",
            backdropFilter: "blur(28px) saturate(200%) brightness(108%)",
          }}
        >
          <div className="h-[40px] flex items-center justify-center px-10 relative z-10">
            <p className="text-sm font-medium text-gray-900 flex items-center justify-center gap-2">
              <span className="hidden md:inline">
                Learn real product skills with mentorship at{" "}
              </span>
              <a
                className="text-gray-900 font-bold hover:text-black transition-colors"
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
              className="absolute right-4 text-gray-700/70 hover:text-gray-900 hover:bg-gray-100/50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white rounded p-1 transition-all backdrop-blur-sm"
              onClick={() => {
                setShowBanner(false);
                setAnnouncement("Banner dismissed");
                setTimeout(() => setAnnouncement(""), 1000);
              }}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
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
      <div className="container mx-auto h-[67px] reveal-text-anim-1 pb-6 relative z-[99999999] max-md:bg-[#F5F5F5]">
        {!loading && (
          <NextUINavbar
            className={clsx(
              "mx-[25rem] py-0 w-auto px-0 max-md:-pb-3 max-lg:mx-20 max-md:mx-0 max-xl:mx-40 max-2xl:mx-[18rem] container flex flex-row items-center rounded-2xl max-md:rounded-none max-md:pt-1 sticky top-0 mt-3 max-md:mt-0 h-[55px] z-[99999999]",
              // Premium glass effect with texture
              "glass-texture",
              "transition-all duration-300 ease-in-out",
              // CRITICAL: Isolation for backdrop-filter to work
              "isolate",
              // Adaptive glass styling based on section
              {
                // Dark section - premium glass with subtle glow
                "navbar-glass-dark glass-border-dark glass-shadow-dark":
                  isDarkSection,
                // Light section - premium glass with bright highlights
                "navbar-glass-light glass-border-light glass-shadow-light":
                  !isDarkSection,
                // Text colors
                "text-white": isDarkSection,
                "text-black": !isDarkSection,
              },
              // Mobile specific styles - simplified glass for performance
              "max-md:backdrop-blur-md max-md:bg-[#F5F5F5]/95 max-md:border-none max-md:shadow-md"
            )}
            isMenuOpen={isMenuOpen}
            maxWidth="xl"
            position="sticky"
            style={{
              zIndex: 99999999,
              // Force backdrop-filter to apply
              WebkitBackdropFilter: isDarkSection
                ? "blur(28px) saturate(180%) brightness(95%)"
                : "blur(28px) saturate(200%) brightness(108%)",
              backdropFilter: isDarkSection
                ? "blur(28px) saturate(180%) brightness(95%)"
                : "blur(28px) saturate(200%) brightness(108%)",
            }}
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
                    className={clsx(
                      "px-2 rounded-[0.65rem] pb-[4px] transition-all duration-200 relative",
                      {
                        // Premium glass hover for dark sections - brighter with inner glow
                        "hover:bg-white/25 hover:shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.3),0_2px_8px_-2px_rgba(255,255,255,0.1)]":
                          isDarkSection,
                        // Premium glass hover for light sections - subtle with depth
                        "hover:bg-white/80 hover:shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.9),0_2px_8px_-2px_rgba(0,0,0,0.08)]":
                          !isDarkSection,
                      }
                    )}
                    style={{
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <NextLink
                      className={clsx(
                        linkStyles({ color: "foreground" }),
                        "data-[active=true]:text-primary data-[active=true]:font-medium text-sm font-[500] cursor-pointer transition-all duration-200 hover:font-[600]"
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
