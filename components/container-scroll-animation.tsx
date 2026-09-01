"use client";
import React, { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"],
  });
  const [deviceType, setDeviceType] = React.useState<
    "mobile" | "tablet" | "desktop"
  >("desktop");

  React.useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;

      if (width <= 640) {
        setDeviceType("mobile");
      } else if (width <= 1024) {
        setDeviceType("tablet");
      } else {
        setDeviceType("desktop");
      }
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    return () => {
      window.removeEventListener("resize", checkDevice);
    };
  }, []);

  const scaleDimensions = () => {
    if (deviceType === "mobile") return [0.85, 1];
    if (deviceType === "tablet") return [1.02, 1];

    return [1.05, 1];
  };

  const isMobile = deviceType === "mobile";
  const rotateValues =
    deviceType === "mobile" ? [0, 0] : [18, 0];
  const translateValues =
    deviceType === "mobile"
      ? [0, 0]
      : [0, -100];

  const rotate = useTransform(scrollYProgress, [0, 1], rotateValues);
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], translateValues);

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center relative"
    >
      <div
        className="py-10 md:py-24 lg:py-40 w-full relative"
        style={{
          perspective: isMobile ? "none" : "1000px",
        }}
      >
        <Header
          isMobile={isMobile}
          titleComponent={titleComponent}
          translate={translate}
        />
        <Card
          isMobile={isMobile}
          rotate={rotate}
          scale={scale}
          translate={translate}
        >
          {children}
        </Card>
      </div>
    </div>
  );
};

const Header = ({ translate, titleComponent, isMobile }: any) => {
  if (isMobile) {
    return (
      <div className="div max-w-5xl mx-auto text-center">{titleComponent}</div>
    );
  }

  return (
    <motion.div
      className="div max-w-5xl mx-auto text-center"
      style={{
        translateY: translate,
      }}
    >
      {titleComponent}
    </motion.div>
  );
};

const Card = ({
  rotate,
  scale,
  children,
  isMobile,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
  isMobile?: boolean;
}) => {
  if (isMobile) {
    return (
      <div className="mx-auto w-full">
        <div className="h-full w-full overflow-hidden">{children}</div>
      </div>
    );
  }

  return (
    <motion.div
      className=" -mt-12 mx-auto w-full"
      style={{
        rotateX: rotate,
        scale,
      }}
    >
      <div className=" h-full w-full  overflow-hidden">{children}</div>
    </motion.div>
  );
};
