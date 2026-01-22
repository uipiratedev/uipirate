"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface DataPoint {
  x: number;
  y: number;
}

const AnimatedAnalyticsChart = () => {
  const chartRef = useRef<SVGSVGElement>(null);
  const linePathRef = useRef<SVGPathElement>(null);
  const areaPathRef = useRef<SVGPathElement>(null);
  const glowPathRef = useRef<SVGPathElement>(null);
  const dataPointsRef = useRef<(SVGCircleElement | null)[]>([]);
  const dataPointGlowsRef = useRef<(SVGCircleElement | null)[]>([]);

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

  useEffect(() => {
    if (
      !chartRef.current ||
      !linePathRef.current ||
      !areaPathRef.current ||
      !glowPathRef.current
    )
      return;

    const ctx = gsap.context(() => {
      // Get line length for drawing animation
      const lineLength = linePathRef.current?.getTotalLength() || 0;

      // Set initial states with hardware acceleration hints
      gsap.set([linePathRef.current, glowPathRef.current], {
        strokeDasharray: lineLength,
        strokeDashoffset: lineLength,
        force3D: true,
        willChange: "stroke-dashoffset",
      });

      gsap.set(areaPathRef.current, {
        opacity: 0,
        force3D: true,
        willChange: "opacity",
      });

      gsap.set(dataPointsRef.current, {
        scale: 0,
        opacity: 0,
        force3D: true,
        transformOrigin: "center center",
        willChange: "transform, opacity",
      });

      gsap.set(dataPointGlowsRef.current, {
        scale: 0,
        opacity: 0,
        force3D: true,
        transformOrigin: "center center",
      });

      // Create optimized timeline with ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: chartRef.current,
          start: "top 85%",
          end: "bottom 60%",
          toggleActions: "play none none reverse",
          fastScrollEnd: true,
        },
      });

      // Animate glow line first (subtle lead-in effect)
      tl.to(glowPathRef.current, {
        strokeDashoffset: 0,
        duration: 1.8,
        ease: "power1.inOut",
      });

      // Animate main line drawing with smooth easing
      tl.to(
        linePathRef.current,
        {
          strokeDashoffset: 0,
          duration: 1.8,
          ease: "power1.inOut",
        },
        "-=1.7", // Start slightly after glow
      );

      // Animate area fill with elegant fade
      tl.to(
        areaPathRef.current,
        {
          opacity: 1,
          duration: 1.2,
          ease: "power2.out",
        },
        "-=1.3", // Overlap more with line drawing
      );

      // Animate data point glows first
      tl.to(
        dataPointGlowsRef.current,
        {
          scale: 1,
          opacity: 0.6,
          duration: 0.5,
          stagger: {
            each: 0.06,
            ease: "power2.out",
          },
          ease: "power2.out",
        },
        "-=0.9",
      );

      // Stagger animate data points with refined timing
      tl.to(
        dataPointsRef.current,
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          stagger: {
            each: 0.06,
            ease: "power2.out",
          },
          ease: "elastic.out(1, 0.6)", // Softer elastic effect
        },
        "-=0.85", // Slight overlap with glows
      );

      // Clean up will-change after animations complete
      tl.set(
        [
          linePathRef.current,
          glowPathRef.current,
          areaPathRef.current,
          dataPointsRef.current,
        ],
        {
          willChange: "auto",
        },
      );
    }, chartRef);

    return () => ctx.revert();
  }, []);

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
      <path
        ref={areaPathRef}
        d={areaPath}
        fill="url(#areaGradient)"
        style={{ mixBlendMode: "multiply" }}
      />

      {/* Glow line (behind main line) */}
      <path
        ref={glowPathRef}
        d={linePath}
        fill="none"
        filter="url(#glow)"
        opacity="0.6"
        stroke="url(#glowGradient)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
      />

      {/* Main line */}
      <path
        ref={linePathRef}
        d={linePath}
        fill="none"
        stroke="url(#lineGradient)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />

      {/* Data point glows */}
      {dataPoints.map((point, i) => (
        <circle
          key={`glow-${i}`}
          ref={(el) => {
            dataPointGlowsRef.current[i] = el;
          }}
          cx={point.x}
          cy={point.y}
          fill="url(#pointGlow)"
          r="3"
          style={{
            transformOrigin: `${point.x}px ${point.y}px`,
            pointerEvents: "none",
          }}
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
          <circle
            ref={(el) => {
              dataPointsRef.current[i] = el;
            }}
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
          />
        </g>
      ))}
    </svg>
  );
};

export default AnimatedAnalyticsChart;
