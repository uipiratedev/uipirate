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
  const isInView = useInView(chartRef, { once: false, amount: 0.3 });

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

  // Data point variants with stagger
  const pointVariants: Variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: 0.9 + i * 0.06,
        duration: 0.5,
        ease: [0.68, -0.55, 0.265, 1.55], // elastic equivalent
      },
    }),
  };

  // Glow point variants
  const glowPointVariants: Variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i: number) => ({
      scale: 1,
      opacity: 0.6,
      transition: {
        delay: 0.85 + i * 0.06,
        duration: 0.5,
        ease: [0.33, 1, 0.68, 1],
      },
    }),
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
        {/* Enhanced gradient for the line with multiple color stops */}
        <linearGradient id="lineGradient" x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="1" />
          <stop offset="50%" stopColor="#6366f1" stopOpacity="1" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="1" />
        </linearGradient>

        {/* Enhanced gradient for the area fill with smoother transition */}
        <linearGradient id="areaGradient" x1="0%" x2="0%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
          <stop offset="40%" stopColor="#6366f1" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.02" />
        </linearGradient>

        {/* Glow gradient for the line */}
        <linearGradient id="glowGradient" x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#6366f1" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.4" />
        </linearGradient>

        {/* Blur filter for glow effect */}
        <filter height="200%" id="glow" width="200%" x="-50%" y="-50%">
          <feGaussianBlur result="coloredBlur" stdDeviation="2" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Radial gradient for data point glows */}
        <radialGradient id="pointGlow">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
          <stop offset="70%" stopColor="#6366f1" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Area fill */}
      <motion.path
        d={areaPath}
        fill="url(#areaGradient)"
        style={{ mixBlendMode: "multiply" }}
        variants={areaVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      />

      {/* Glow line (behind main line) */}
      <motion.path
        d={linePath}
        fill="none"
        filter="url(#glow)"
        opacity="0.6"
        stroke="url(#glowGradient)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
        strokeDasharray={lineLength}
        variants={lineVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
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
        d={linePath}
        fill="none"
        stroke="url(#lineGradient)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        strokeDasharray={lineLength}
        variants={lineVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      />

      {/* Data point glows */}
      {dataPoints.map((point, i) => (
        <motion.circle
          key={`glow-${i}`}
          cx={point.x}
          cy={point.y}
          fill="url(#pointGlow)"
          r="3"
          style={{
            transformOrigin: `${point.x}px ${point.y}px`,
            pointerEvents: "none",
          }}
          variants={glowPointVariants}
          custom={i}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        />
      ))}

      {/* Data points */}
      {dataPoints.map((point, i) => (
        <g key={`point-${i}`}>
          {/* Outer ring */}
          <circle
            cx={point.x}
            cy={point.y}
            fill="none"
            opacity="0.3"
            r="2.2"
            stroke="url(#lineGradient)"
            strokeWidth="0.5"
            style={{
              transformOrigin: `${point.x}px ${point.y}px`,
              pointerEvents: "none",
            }}
          />
          {/* Main point */}
          <motion.circle
            cx={point.x}
            cy={point.y}
            fill="white"
            r="1.5"
            stroke="url(#lineGradient)"
            strokeWidth="1.5"
            style={{
              transformOrigin: `${point.x}px ${point.y}px`,
              filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))",
            }}
            variants={pointVariants}
            custom={i}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          />
        </g>
      ))}
    </svg>
  );
};

export default AnimatedAnalyticsChart;
