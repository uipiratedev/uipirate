"use client";
import LandingFooter from "@/screens/landing/footer";
import VisionToLife from "@/screens/landing/visionToLife";
import FloatingLetsTalkButton from "./FloatingLetsTalkButton";
import { Navbar } from "@nextui-org/navbar";

interface PageWrapperProps {
  children: React.ReactNode;
  showFloatingButton?: boolean;
}

const PageWrapper = ({
  children,
  showFloatingButton = true,
}: PageWrapperProps) => {
  return (
    <>
      {children}
      <VisionToLife />
      <LandingFooter />
      {showFloatingButton && <FloatingLetsTalkButton />}
    </>
  );
};

export default PageWrapper;
