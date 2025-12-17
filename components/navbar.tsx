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

import { siteConfig } from "@/config/site";
import GlassSurface from "./GlassSurface";

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
      {/* ✅ Navbar */}
      <div className="container mx-auto h-[67px] pb-6 max-md:pb-0 max-md:h-auto relative z-[99999999]">
        {!loading && (
          <div
            className={clsx(
              "mx-[10rem] max-lg:mx-12 max-md:mx-0 max-xl:mx-24 max-2xl:mx-[12rem] sticky top-0 mt-3 max-md:mt-0 z-[99999999]"
            )}
          >
            <GlassSurface
              width="100%"
              height={52}
              borderRadius={16}
              blur={28}
              opacity={0.93}
              brightness={55}
              backgroundOpacity={0.75}
              saturation={2}
              displace={0}
              distortionScale={-180}
              redOffset={1}
              greenOffset={10}
              blueOffset={20}
              borderWidth={2}
              forceLightMode={true}
              className="relative isolate max-md:rounded-none"
              style={{
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <NextUINavbar
                className={clsx(
                  "w-full py-0 px-0 flex flex-row items-center h-[55px]",
                  "transition-all duration-300 ease-in-out",
                  "!bg-transparent !backdrop-filter-none !backdrop-blur-none",
                  {
                    "text-white": isDarkSection,
                    "text-black": !isDarkSection,
                  }
                )}
                isMenuOpen={isMenuOpen}
                maxWidth="full"
                position="static"
                style={{
                  background: "transparent",
                  backdropFilter: "none",
                  backgroundColor: "transparent",
                }}
                onMenuOpenChange={setIsMenuOpen}
              >
                {/* --- Left Brand Section --- */}
                <NavbarContent
                  className="basis-1/5 sm:basis-full"
                  justify="start"
                >
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
                <NavbarContent
                  className="basis-1/5 sm:basis-full"
                  justify="center"
                >
                  <ul className="hidden lg:flex gap-0 justify-start ml-0">
                    {siteConfig.navItems.map((item) => (
                      <NavbarItem
                        key={item.href}
                        className={clsx(
                          "px-2 rounded-[0.65rem] pb-[4px] transition-all duration-200 relative"
                        )}
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
                <NavbarContent
                  className=" basis-1/5 sm:basis-full"
                  justify="end"
                >
                  <NavbarItem>
                    <Button
                      as={NextLink}
                      href="/contact"
                      className=" text-sm font-[500] text-white bg-brand-orange pt-0 dark:bg-white dark:text-black -mr-6 mt-[0.1rem]"
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
                <NavbarMenu className=" h-screen -mt-3">
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
            </GlassSurface>
          </div>
        )}
      </div>
    </>
  );
};
