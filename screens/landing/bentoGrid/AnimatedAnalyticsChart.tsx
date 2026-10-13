"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useReducedMotion, useTransform } from "framer-motion";

import { useSectionProgress } from "@/components/motion";

interface DataPoint {
  x: number;
  y: number;
}

const AnimatedAnalyticsChart = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const linePathRef = useRef<SVGPathElement>(null);
  const [lineLength, setLineLength] = useState(0);
  const reduced = useReducedMotion();

  // Scrubbed: the line draws itself as this card transits the viewport,
  // instead of a one-shot on enter.
  const progress = useSectionProgress(wrapRef, ["start 0.85", "start 0.35"]);
  const dashoffset = useTransform(progress, [0, 1], [lineLength, 0]);
  const areaOpacity = useTransform(progress, [0.25, 1], [0, 1]);

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

  useEffect(() => {
    if (linePathRef.current) {
      setLineLength(linePathRef.current.getTotalLength());
    }
  }, []);

  return (
    <div ref={wrapRef} className="h-full w-full">
      <svg
        className="w-full h-full"
        preserveAspectRatio="none"
        style={{ overflow: "visible" }}
        viewBox="0 0 100 100"
      >
        <defs>
          <linearGradient id="lineGradient" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#FF5B04" stopOpacity="1" />
            <stop offset="50%" stopColor="#F59E0B" stopOpacity="1" />
            <stop offset="100%" stopColor="#FF7B34" stopOpacity="1" />
          </linearGradient>

          <linearGradient id="areaGradient" x1="0%" x2="0%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#FF5B04" stopOpacity="0.35" />
            <stop offset="40%" stopColor="#F59E0B" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#FF7B34" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Area fill */}
        <motion.path
          d={areaPath}
          fill="url(#areaGradient)"
          style={{ opacity: reduced ? 1 : areaOpacity }}
        />

        {/* Invisible reference for measuring length */}
        <path
          ref={linePathRef}
          d={linePath}
          fill="none"
          stroke="transparent"
          strokeWidth="0"
        />

        {/* Main line — drawn by strokeDashoffset scrubbed on scroll */}
        <motion.path
          d={linePath}
          fill="none"
          stroke="url(#lineGradient)"
          strokeDasharray={lineLength}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          style={{ strokeDashoffset: reduced ? 0 : dashoffset }}
        />
      </svg>
    </div>
  );
};

export default AnimatedAnalyticsChart;
