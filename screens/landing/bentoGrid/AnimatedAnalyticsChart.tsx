"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, Variants } from "framer-motion";

interface DataPoint {
  x: number;
  y: number;
}

const AnimatedAnalyticsChart = () => {
  const chartRef = useRef<SVGSVGElement>(null);
  const [lineLength, setLineLength] = useState(0);
  const linePathRef = useRef<SVGPathElement>(null);
  // once:true — re-running the stroke-dash draw + blur glow every time the
  // card scrolls back into view was compounding with the card's own slide
  // animation and causing visible jank.
  const isInView = useInView(chartRef, { once: true, amount: 0.3 });

  // Data points for the chart
  const dataPoints: DataPoint[] = [
    { x: 2, y: 60 },
    { x: 12, y: 45 },
    { x: 22, y: 35 },
    { x: 32, y: 55 },
    { x: 42, y: 40 },
    { x: 52, y: 25 },
    { x: 62, y: 35 },
    { x: 72, y: 20 },
    { x: 82, y: 30 },
    { x: 92, y: 15 },
    { x: 98, y: 20 },
  ];

  // Catmull-Rom spline interpolation for ultra-smooth curves
  const getCatmullRomPath = (points: DataPoint[], tension = 0.5): string => {
    if (points.length < 2) return "";

    // Add phantom points at the beginning and end for better edge handling
    const extendedPoints = [
      { x: points[0].x - (points[1].x - points[0].x), y: points[0].y },
      ...points,
      {
        x:
          points[points.length - 1].x +
          (points[points.length - 1].x - points[points.length - 2].x),
        y: points[points.length - 1].y,
      },
    ];

    let path = `M ${points[0].x},${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      const p0 = extendedPoints[i - 1];
      const p1 = extendedPoints[i];
      const p2 = extendedPoints[i + 1];
      const p3 = extendedPoints[i + 2];

      // Calculate control points using Catmull-Rom formula
      const cp1x = p1.x + ((p2.x - p0.x) / 6) * tension;
      const cp1y = p1.y + ((p2.y - p0.y) / 6) * tension;
      const cp2x = p2.x - ((p3.x - p1.x) / 6) * tension;
      const cp2y = p2.y - ((p3.y - p1.y) / 6) * tension;

      path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }

    return path;
  };

  const linePath = getCatmullRomPath(dataPoints, 0.5);
  const areaPath = `${linePath} L 98,100 L 2,100 Z`;

  // Get line length for the drawing animation
  useEffect(() => {
    if (linePathRef.current) {
      setLineLength(linePathRef.current.getTotalLength());
    }
  }, []);

  // Animation variants for the line drawing effect
  const lineVariants: Variants = {
    hidden: {
      strokeDashoffset: lineLength,
    },
    visible: {
      strokeDashoffset: 0,
      transition: {
        duration: 1.8,
        // Wait for the bento card's slide-in to settle before the
        // stroke-dash draw starts, so the two repaints don't overlap.
        delay: 0.45,
        ease: [0.42, 0, 0.58, 1], // power1.inOut equivalent
      },
    },
  };

  // Area fade in variant
  const areaVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1.2,
        delay: 0.5,
        ease: [0.33, 1, 0.68, 1], // power2.out equivalent
      },
    },
  };

  return (
    <svg
      ref={chartRef}
      className="w-full h-full"
      preserveAspectRatio="none"
      style={{ overflow: "visible" }}
      viewBox="0 0 100 100"
    >
      <defs>
        {/* Enhanced gradient for the line with brand-aligned warm tones */}
        <linearGradient id="lineGradient" x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stopColor="#FF5B04" stopOpacity="1" />
          <stop offset="50%" stopColor="#F59E0B" stopOpacity="1" />
          <stop offset="100%" stopColor="#FF7B34" stopOpacity="1" />
        </linearGradient>

        {/* Enhanced gradient for the area fill with smoother transition */}
        <linearGradient id="areaGradient" x1="0%" x2="0%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#FF5B04" stopOpacity="0.35" />
          <stop offset="40%" stopColor="#F59E0B" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#FF7B34" stopOpacity="0.02" />
        </linearGradient>

      </defs>

      {/* Area fill — no mix-blend-mode: blend modes break layer isolation
          and force a repaint of everything behind the chart every frame
          while the bento card is sliding in. */}
      <motion.path
        animate={isInView ? "visible" : "hidden"}
        d={areaPath}
        fill="url(#areaGradient)"
        initial="hidden"
        variants={areaVariants}
      />

      {/* Main line - invisible reference for measuring length */}
      <path
        ref={linePathRef}
        d={linePath}
        fill="none"
        stroke="transparent"
        strokeWidth="0"
      />

      {/* Main line (animated) */}
      <motion.path
        animate={isInView ? "visible" : "hidden"}
        d={linePath}
        fill="none"
        initial="hidden"
        stroke="url(#lineGradient)"
        strokeDasharray={lineLength}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        variants={lineVariants}
      />
    </svg>
  );
};

export default AnimatedAnalyticsChart;
