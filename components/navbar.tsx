"use client";

import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { useEffect, useState } from "react";

import GlassSurface from "./GlassSurface";
import { NavbarDropdown } from "./NavbarDropdown";
import { MobileMenuAccordionItem } from "./MobileMenuAccordionItem";

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
      { threshold: 0.1 },
    );

    const darkSections = document.querySelectorAll(".dark-section");

    darkSections.forEach((section) => observer.observe(section));

    return () => {
      darkSections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  return (
    <>
      {/* ✅ Navbar */}
      <div className="container mx-auto h-[67px] pb-6 max-md:pb-0 max-md:h-auto relative z-[99999999]">
        {!loading && (
          <div
            className={clsx(
              " mx-auto px-32 lg:px-20 max-md:px-0 sticky top-0 mt-3 max-md:mt-0 z-[99999999]",
            )}
          >
            <GlassSurface
              backgroundOpacity={0.75}
              blueOffset={20}
              blur={28}
              borderRadius={16}
              borderWidth={2}
              brightness={98}
              className="relative isolate max-md:rounded-none !overflow-visible"
              displace={0}
              distortionScale={5}
              forceLightMode={true}
              greenOffset={10}
              height={52}
              opacity={0.93}
              redOffset={1}
              saturation={2}
              style={{
                border: "1px solid rgba(255, 255, 255, 0.2)",
                overflow: "visible",
              }}
              width="100%"
            >
              <NextUINavbar
                className={clsx(
                  "w-full py-0 px-0 flex flex-row items-center h-[55px] !overflow-visible !static",
                  "transition-all duration-300 ease-in-out",
                  "!bg-transparent !backdrop-filter-none !backdrop-blur-none",
                  {
                    "text-white": isDarkSection,
                    "text-black": !isDarkSection,
                  },
                )}
                isMenuOpen={isMenuOpen}
                maxWidth="full"
                position="static"
                style={{
                  background: "transparent",
                  backdropFilter: "none",
                  backgroundColor: "transparent",
                  overflow: "visible",
                  position: "static", // Force static to let children anchor higher up
                }}
                onMenuOpenChange={setIsMenuOpen}
              >
                {/* --- Left Brand Section --- */}
                <NavbarContent
                  className="basis-1/5 md:basis-full px-0"
                  justify="start"
                >
                  {/* --- Mobile Section with Toggle --- */}

                  <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="text-current md:hidden mr-4 max-md:-ml-2 max-md:mr-2"
                  />
                  <NavbarBrand
                    as="li"
                    className="gap-2 max-w-fit max-sm:!gap-0"
                  >
                    <NextLink
                      className="flex justify-start items-center gap-0 md:-ml-7 max-md:-ml-6"
                      href="/"
                    >
                      <img
                        alt="UI Pirate - Enterprise UI/UX Design Agency Logo"
                        className="mt-5"
                        src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1766234689/logo_lcn2cq.png"
                      />
                      <p
                        className={clsx("font-bold text-inherit", {
                          "text-white text-2xl": isDarkSection,
                          "text-black text-xl max-md:text-lg -ml-1":
                            !isDarkSection,
                        })}
                      >
                        UI Pirates
                      </p>
                    </NextLink>
                  </NavbarBrand>
                </NavbarContent>

                {/* --- Center Navigation Links --- */}
                <NavbarContent
                  className="basis-1/5 sm:basis-full !overflow-visible !static"
                  justify="center"
                  style={{ position: "static" }}
                >
                  <ul className="hidden lg:flex gap-0 justify-start ml-0 overflow-visible !static" style={{ position: "static" }}>
                    {siteConfig.navItems.map((item) => (
                      <NavbarItem
                        key={item.href}
                        className={clsx(
                          "px-2 rounded-[0.65rem] pb-[4px] transition-all duration-200 !static",
                        )}
                        style={{ position: "static" }}
                      >
                        {item.hasDropdown && item.dropdownItems ? (
                          <NavbarDropdown
                            isDarkSection={isDarkSection}
                            isServicesMenu={item.label === "Services"}
                            items={item.dropdownItems}
                            label={item.label}
                          />
                        ) : (
                          <NextLink
                            className={clsx(
                              linkStyles({ color: "foreground" }),
                              "data-[active=true]:text-primary data-[active=true]:font-medium text-sm font-[500] cursor-pointer transition-all duration-200 hover:font-[600]",
                            )}
                            href={item.href}
                          >
                            {item.label}
                          </NextLink>
                        )}
                      </NavbarItem>
                    ))}
                  </ul>
                </NavbarContent>

                {/* --- Right Button --- */}
                <NavbarContent
                  className=" basis-1/5 sm:basis-full"
                  justify="end"
                >
                  <NavbarItem>
                    <Button
                      as={NextLink}
                      className=" text-sm font-[500] text-white bg-black border-brand-orange border-2 pt-0 dark:bg-white dark:text-black -mr-4 mt-[0.1rem]"
                      data-back="Let's Talk"
                      data-front="Have an Idea?"
                      href="/contact"
                      style={{ paddingTop: 0 }}
                      variant="solid"
                    >
                      <span aria-hidden="true">😀</span> Let's Talk
                    </Button>
                  </NavbarItem>
                </NavbarContent>

                {/* ARIA Live Region for Screen Reader Announcements */}
                <div aria-atomic="true" aria-live="polite" className="sr-only">
                  {announcement}
                </div>

                {/* --- Mobile Menu Content --- */}
                <NavbarMenu className=" h-screen -mt-3">
                  <div className="mx-0 mt-3 flex flex-col gap-0 px-4">
                    {siteConfig.navItems.map((item, index) => (
                      <NavbarMenuItem key={`${item.href}-${index}`}>
                        <MobileMenuAccordionItem item={item} setIsMenuOpen={setIsMenuOpen} />
                      </NavbarMenuItem>
                    ))}
                  </div>
                </NavbarMenu>
              </NextUINavbar>
            </GlassSurface>
          </div>
        )}
      </div>
    </>
  );
};
